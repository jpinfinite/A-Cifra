import * as fs from 'fs';
import * as path from 'path';
import { ensureDirectoryExists } from './utils';

/**
 * Error Logger - Comprehensive error logging and tracking system
 */

export enum ErrorLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

export interface LogEntry {
  timestamp: string;
  level: ErrorLevel;
  category: string;
  message: string;
  details?: any;
  filePath?: string;
  stackTrace?: string;
}

export interface ErrorSummary {
  totalErrors: number;
  errorsByLevel: { [key in ErrorLevel]: number };
  errorsByCategory: { [category: string]: number };
  criticalErrors: LogEntry[];
  recentErrors: LogEntry[];
}

export class ErrorLogger {
  private logs: LogEntry[] = [];
  private logFilePath?: string;
  private maxLogEntries: number = 1000;

  constructor(logDir?: string) {
    if (logDir) {
      ensureDirectoryExists(logDir);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      this.logFilePath = path.join(logDir, `image-organizer-${timestamp}.log`);
    }
  }

  /**
   * Log an entry with specified level and category
   */
  log(level: ErrorLevel, category: string, message: string, details?: any, filePath?: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      details,
      filePath,
      stackTrace: level === ErrorLevel.CRITICAL ? new Error().stack : undefined
    };

    this.logs.push(entry);

    // Keep only the most recent entries to prevent memory issues
    if (this.logs.length > this.maxLogEntries) {
      this.logs = this.logs.slice(-this.maxLogEntries);
    }

    // Write to file if configured
    if (this.logFilePath) {
      this.writeToFile(entry);
    }

    // Console output for immediate feedback
    this.writeToConsole(entry);
  }

  /**
   * Log info message
   */
  info(category: string, message: string, details?: any, filePath?: string): void {
    this.log(ErrorLevel.INFO, category, message, details, filePath);
  }

  /**
   * Log warning message
   */
  warning(category: string, message: string, details?: any, filePath?: string): void {
    this.log(ErrorLevel.WARNING, category, message, details, filePath);
  }

  /**
   * Log error message
   */
  error(category: string, message: string, details?: any, filePath?: string): void {
    this.log(ErrorLevel.ERROR, category, message, details, filePath);
  }

  /**
   * Log critical error message
   */
  critical(category: string, message: string, details?: any, filePath?: string): void {
    this.log(ErrorLevel.CRITICAL, category, message, details, filePath);
  }

  /**
   * Write log entry to file
   */
  private writeToFile(entry: LogEntry): void {
    if (!this.logFilePath) return;

    try {
      const logLine = this.formatLogEntry(entry) + '\n';
      fs.appendFileSync(this.logFilePath, logLine, 'utf8');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Write log entry to console with appropriate formatting
   */
  private writeToConsole(entry: LogEntry): void {
    const formattedEntry = this.formatLogEntry(entry);
    
    switch (entry.level) {
      case ErrorLevel.INFO:
        console.log(`ℹ️  ${formattedEntry}`);
        break;
      case ErrorLevel.WARNING:
        console.warn(`⚠️  ${formattedEntry}`);
        break;
      case ErrorLevel.ERROR:
        console.error(`❌ ${formattedEntry}`);
        break;
      case ErrorLevel.CRITICAL:
        console.error(`🚨 ${formattedEntry}`);
        if (entry.stackTrace) {
          console.error(entry.stackTrace);
        }
        break;
    }
  }

  /**
   * Format log entry for output
   */
  private formatLogEntry(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toLocaleString();
    let formatted = `[${timestamp}] ${entry.level} [${entry.category}] ${entry.message}`;
    
    if (entry.filePath) {
      formatted += ` (File: ${path.basename(entry.filePath)})`;
    }
    
    if (entry.details) {
      formatted += ` | Details: ${JSON.stringify(entry.details)}`;
    }
    
    return formatted;
  }

  /**
   * Get all log entries
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs filtered by level
   */
  getLogsByLevel(level: ErrorLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get logs filtered by category
   */
  getLogsByCategory(category: string): LogEntry[] {
    return this.logs.filter(log => log.category === category);
  }

  /**
   * Get logs for a specific file
   */
  getLogsForFile(filePath: string): LogEntry[] {
    return this.logs.filter(log => log.filePath === filePath);
  }

  /**
   * Get recent logs (last N entries)
   */
  getRecentLogs(count: number = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  /**
   * Generate error summary
   */
  generateErrorSummary(): ErrorSummary {
    const errorsByLevel: { [key in ErrorLevel]: number } = {
      [ErrorLevel.INFO]: 0,
      [ErrorLevel.WARNING]: 0,
      [ErrorLevel.ERROR]: 0,
      [ErrorLevel.CRITICAL]: 0
    };

    const errorsByCategory: { [category: string]: number } = {};
    const criticalErrors: LogEntry[] = [];

    for (const log of this.logs) {
      errorsByLevel[log.level]++;
      
      errorsByCategory[log.category] = (errorsByCategory[log.category] || 0) + 1;
      
      if (log.level === ErrorLevel.CRITICAL) {
        criticalErrors.push(log);
      }
    }

    return {
      totalErrors: this.logs.length,
      errorsByLevel,
      errorsByCategory,
      criticalErrors,
      recentErrors: this.getRecentLogs(10)
    };
  }

  /**
   * Generate detailed error report
   */
  generateErrorReport(): string {
    const summary = this.generateErrorSummary();
    const report = [
      '# Error Report',
      '',
      `**Generated:** ${new Date().toLocaleString()}`,
      `**Total Log Entries:** ${summary.totalErrors}`,
      '',
      '## Summary by Level',
      ''
    ];

    for (const [level, count] of Object.entries(summary.errorsByLevel)) {
      if (count > 0) {
        report.push(`- **${level}:** ${count}`);
      }
    }

    report.push('', '## Summary by Category', '');
    for (const [category, count] of Object.entries(summary.errorsByCategory)) {
      report.push(`- **${category}:** ${count}`);
    }

    if (summary.criticalErrors.length > 0) {
      report.push('', '## Critical Errors', '');
      for (const error of summary.criticalErrors) {
        report.push(`### ${error.category} - ${new Date(error.timestamp).toLocaleString()}`);
        report.push(`**Message:** ${error.message}`);
        if (error.filePath) {
          report.push(`**File:** ${error.filePath}`);
        }
        if (error.details) {
          report.push(`**Details:** \`${JSON.stringify(error.details)}\``);
        }
        report.push('');
      }
    }

    if (summary.recentErrors.length > 0) {
      report.push('## Recent Errors (Last 10)', '');
      for (const error of summary.recentErrors.reverse()) {
        const timestamp = new Date(error.timestamp).toLocaleString();
        report.push(`- **[${timestamp}]** ${error.level} - ${error.category}: ${error.message}`);
      }
      report.push('');
    }

    return report.join('\n');
  }

  /**
   * Save error report to file
   */
  saveErrorReport(outputDir: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(outputDir, `error-report-${timestamp}.md`);
    
    const reportContent = this.generateErrorReport();
    
    try {
      ensureDirectoryExists(outputDir);
      fs.writeFileSync(reportPath, reportContent, 'utf8');
      console.log(`✓ Error report saved to: ${reportPath}`);
      return reportPath;
    } catch (error) {
      console.error(`Error saving error report: ${error}`);
      throw error;
    }
  }

  /**
   * Check if there are any critical errors
   */
  hasCriticalErrors(): boolean {
    return this.logs.some(log => log.level === ErrorLevel.CRITICAL);
  }

  /**
   * Get error count by level
   */
  getErrorCount(level?: ErrorLevel): number {
    if (level) {
      return this.logs.filter(log => log.level === level).length;
    }
    return this.logs.length;
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Create rollback information for critical operations
   */
  createRollbackInfo(operation: string, originalState: any, newState: any): void {
    this.info('ROLLBACK', `Rollback info for ${operation}`, {
      operation,
      originalState,
      newState,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Log file operation with detailed context
   */
  logFileOperation(
    operation: 'move' | 'copy' | 'delete' | 'rename',
    sourcePath: string,
    targetPath?: string,
    success: boolean = true,
    error?: string
  ): void {
    const level = success ? ErrorLevel.INFO : ErrorLevel.ERROR;
    const category = 'FILE_OPERATION';
    
    let message = `${operation.toUpperCase()} operation `;
    message += success ? 'succeeded' : 'failed';
    message += ` for ${path.basename(sourcePath)}`;
    
    const details: any = {
      operation,
      sourcePath,
      targetPath,
      success
    };
    
    if (error) {
      details.error = error;
    }
    
    this.log(level, category, message, details, sourcePath);
  }

  /**
   * Log processing progress
   */
  logProgress(current: number, total: number, operation: string): void {
    const percentage = ((current / total) * 100).toFixed(1);
    this.info('PROGRESS', `${operation}: ${current}/${total} (${percentage}%)`);
  }

  /**
   * Export logs to JSON format
   */
  exportLogsToJSON(outputPath: string): void {
    try {
      const exportData = {
        exportedAt: new Date().toISOString(),
        totalEntries: this.logs.length,
        summary: this.generateErrorSummary(),
        logs: this.logs
      };
      
      fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2), 'utf8');
      console.log(`✓ Logs exported to: ${outputPath}`);
    } catch (error) {
      console.error(`Error exporting logs: ${error}`);
      throw error;
    }
  }
}