import * as fs from 'fs';
import * as path from 'path';
import { ProcessingReport, ImageFile } from './types';
import { CleanupResult } from './cleanup-manager';

/**
 * Report Generator - Creates comprehensive processing reports
 */

export class ReportGenerator {
  private startTime: Date;
  private endTime?: Date;

  constructor() {
    this.startTime = new Date();
  }

  /**
   * Mark processing as complete
   */
  markComplete(): void {
    this.endTime = new Date();
  }

  /**
   * Calculate processing duration
   */
  getProcessingDuration(): string {
    if (!this.endTime) {
      this.endTime = new Date();
    }
    
    const durationMs = this.endTime.getTime() - this.startTime.getTime();
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Generate comprehensive processing report
   */
  generateProcessingReport(
    processedFiles: ImageFile[],
    cleanupResult: CleanupResult,
    errors: string[] = []
  ): ProcessingReport {
    this.markComplete();

    const fileMovements = processedFiles
      .filter(file => file.processed && file.newPath !== file.originalPath)
      .map(file => ({
        from: file.originalPath,
        to: file.newPath,
        category: file.suggestedCategory
      }));

    const report: ProcessingReport = {
      timestamp: new Date().toISOString(),
      totalFiles: processedFiles.length,
      processedFiles: processedFiles.filter(f => f.processed).length,
      movedFiles: fileMovements.length,
      renamedFiles: processedFiles.filter(f => f.processed && path.basename(f.originalPath) !== path.basename(f.newPath)).length,
      removedDuplicates: cleanupResult.duplicatesRemoved,
      errors: [...errors, ...cleanupResult.errors],
      fileMovements
    };

    return report;
  }

  /**
   * Generate detailed markdown report
   */
  generateMarkdownReport(
    report: ProcessingReport,
    cleanupResult: CleanupResult,
    processedFiles: ImageFile[]
  ): string {
    const markdown = [
      '# Image Organization Report',
      '',
      `**Generated:** ${new Date().toLocaleString()}`,
      `**Processing Duration:** ${this.getProcessingDuration()}`,
      '',
      '## Summary Statistics',
      '',
      `- **Total Files Processed:** ${report.totalFiles}`,
      `- **Successfully Processed:** ${report.processedFiles}`,
      `- **Files Moved:** ${report.movedFiles}`,
      `- **Files Renamed:** ${report.renamedFiles}`,
      `- **Duplicates Removed:** ${report.removedDuplicates}`,
      `- **Corrupted Files Handled:** ${cleanupResult.corruptedFilesHandled}`,
      `- **Space Saved:** ${(cleanupResult.spaceSaved / 1024 / 1024).toFixed(2)} MB`,
      `- **Errors Encountered:** ${report.errors.length}`,
      ''
    ];

    // Category breakdown
    const categoryStats = this.generateCategoryStats(processedFiles);
    if (Object.keys(categoryStats).length > 0) {
      markdown.push('## Files by Category');
      markdown.push('');
      for (const [category, count] of Object.entries(categoryStats)) {
        markdown.push(`- **${category}:** ${count} files`);
      }
      markdown.push('');
    }

    // File movements
    if (report.fileMovements.length > 0) {
      markdown.push('## File Movements');
      markdown.push('');
      markdown.push('| Original File | New Location | Category |');
      markdown.push('|---------------|--------------|----------|');
      
      for (const movement of report.fileMovements.slice(0, 50)) { // Limit to first 50 for readability
        const originalName = path.basename(movement.from);
        const newName = path.basename(movement.to);
        const category = movement.category;
        markdown.push(`| ${originalName} | ${newName} | ${category} |`);
      }
      
      if (report.fileMovements.length > 50) {
        markdown.push(`| ... | ... | ... |`);
        markdown.push(`| *${report.fileMovements.length - 50} more files* | | |`);
      }
      markdown.push('');
    }

    // Cleanup details
    if (cleanupResult.movedFiles.length > 0) {
      markdown.push('## Cleanup Operations');
      markdown.push('');
      
      const cleanupByReason = this.groupCleanupByReason(cleanupResult.movedFiles);
      for (const [reason, files] of Object.entries(cleanupByReason)) {
        markdown.push(`### ${this.formatReasonTitle(reason)}`);
        markdown.push('');
        for (const file of files.slice(0, 20)) { // Limit to first 20 per reason
          markdown.push(`- \`${path.basename(file.from)}\` → \`${path.relative(process.cwd(), file.to)}\``);
        }
        if (files.length > 20) {
          markdown.push(`- *... and ${files.length - 20} more files*`);
        }
        markdown.push('');
      }
    }

    // Errors
    if (report.errors.length > 0) {
      markdown.push('## Errors and Issues');
      markdown.push('');
      for (const error of report.errors) {
        markdown.push(`- ❌ ${error}`);
      }
      markdown.push('');
    }

    // Processing details
    markdown.push('## Processing Details');
    markdown.push('');
    markdown.push(`- **Start Time:** ${this.startTime.toLocaleString()}`);
    markdown.push(`- **End Time:** ${this.endTime?.toLocaleString() || 'In progress'}`);
    markdown.push(`- **Duration:** ${this.getProcessingDuration()}`);
    markdown.push(`- **Success Rate:** ${((report.processedFiles / report.totalFiles) * 100).toFixed(1)}%`);
    markdown.push('');

    // Recommendations
    const recommendations = this.generateRecommendations(report, cleanupResult, processedFiles);
    if (recommendations.length > 0) {
      markdown.push('## Recommendations');
      markdown.push('');
      for (const recommendation of recommendations) {
        markdown.push(`- 💡 ${recommendation}`);
      }
      markdown.push('');
    }

    return markdown.join('\n');
  }

  /**
   * Generate category statistics
   */
  private generateCategoryStats(processedFiles: ImageFile[]): { [category: string]: number } {
    const stats: { [category: string]: number } = {};
    
    for (const file of processedFiles) {
      if (file.processed) {
        const category = file.suggestedCategory;
        stats[category] = (stats[category] || 0) + 1;
      }
    }
    
    return stats;
  }

  /**
   * Group cleanup operations by reason
   */
  private groupCleanupByReason(movedFiles: Array<{ from: string; to: string; reason: string }>): { [reason: string]: Array<{ from: string; to: string }> } {
    const grouped: { [reason: string]: Array<{ from: string; to: string }> } = {};
    
    for (const file of movedFiles) {
      if (!grouped[file.reason]) {
        grouped[file.reason] = [];
      }
      grouped[file.reason].push({ from: file.from, to: file.to });
    }
    
    return grouped;
  }

  /**
   * Format reason titles for display
   */
  private formatReasonTitle(reason: string): string {
    const titles: { [key: string]: string } = {
      'duplicate': 'Duplicate Files Removed',
      'corrupted': 'Corrupted Files Moved',
      'unreadable': 'Unreadable Files Moved',
      'non-web-format': 'Non-Web Formats Moved'
    };
    
    return titles[reason] || reason.charAt(0).toUpperCase() + reason.slice(1);
  }

  /**
   * Generate recommendations based on processing results
   */
  private generateRecommendations(
    report: ProcessingReport,
    cleanupResult: CleanupResult,
    processedFiles: ImageFile[]
  ): string[] {
    const recommendations: string[] = [];
    
    // High error rate
    if (report.errors.length > report.totalFiles * 0.1) {
      recommendations.push('High error rate detected. Consider checking file permissions and disk space.');
    }
    
    // Many duplicates found
    if (cleanupResult.duplicatesRemoved > report.totalFiles * 0.2) {
      recommendations.push('Many duplicate files were found. Consider implementing a file naming convention to prevent future duplicates.');
    }
    
    // Large space savings
    if (cleanupResult.spaceSaved > 100 * 1024 * 1024) { // 100MB
      recommendations.push(`Significant space was saved (${(cleanupResult.spaceSaved / 1024 / 1024).toFixed(2)} MB). Consider running cleanup regularly.`);
    }
    
    // Corrupted files
    if (cleanupResult.corruptedFilesHandled > 0) {
      recommendations.push('Corrupted files were found and moved to the invalid directory. Review these files manually.');
    }
    
    // Category distribution
    const categoryStats = this.generateCategoryStats(processedFiles);
    const totalCategorized = Object.values(categoryStats).reduce((sum, count) => sum + count, 0);
    const generalCount = categoryStats['general'] || 0;
    
    if (generalCount > totalCategorized * 0.5) {
      recommendations.push('Many files were categorized as "general". Consider improving filename conventions for better categorization.');
    }
    
    return recommendations;
  }

  /**
   * Save report to file
   */
  saveReportToFile(
    report: ProcessingReport,
    cleanupResult: CleanupResult,
    processedFiles: ImageFile[],
    outputDir: string
  ): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(outputDir, `image-organization-report-${timestamp}.md`);
    
    const markdownContent = this.generateMarkdownReport(report, cleanupResult, processedFiles);
    
    try {
      fs.writeFileSync(reportPath, markdownContent, 'utf8');
      console.log(`✓ Report saved to: ${reportPath}`);
      return reportPath;
    } catch (error) {
      console.error(`Error saving report: ${error}`);
      throw error;
    }
  }

  /**
   * Generate JSON report for programmatic use
   */
  generateJSONReport(
    report: ProcessingReport,
    cleanupResult: CleanupResult,
    processedFiles: ImageFile[]
  ): any {
    return {
      metadata: {
        generatedAt: new Date().toISOString(),
        processingDuration: this.getProcessingDuration(),
        startTime: this.startTime.toISOString(),
        endTime: this.endTime?.toISOString()
      },
      summary: {
        totalFiles: report.totalFiles,
        processedFiles: report.processedFiles,
        movedFiles: report.movedFiles,
        renamedFiles: report.renamedFiles,
        duplicatesRemoved: report.removedDuplicates,
        corruptedFilesHandled: cleanupResult.corruptedFilesHandled,
        spaceSaved: cleanupResult.spaceSaved,
        errorCount: report.errors.length,
        successRate: (report.processedFiles / report.totalFiles) * 100
      },
      categoryStats: this.generateCategoryStats(processedFiles),
      fileMovements: report.fileMovements,
      cleanupOperations: cleanupResult.movedFiles,
      errors: report.errors,
      recommendations: this.generateRecommendations(report, cleanupResult, processedFiles)
    };
  }

  /**
   * Save JSON report to file
   */
  saveJSONReport(
    report: ProcessingReport,
    cleanupResult: CleanupResult,
    processedFiles: ImageFile[],
    outputDir: string
  ): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(outputDir, `image-organization-report-${timestamp}.json`);
    
    const jsonContent = this.generateJSONReport(report, cleanupResult, processedFiles);
    
    try {
      fs.writeFileSync(reportPath, JSON.stringify(jsonContent, null, 2), 'utf8');
      console.log(`✓ JSON report saved to: ${reportPath}`);
      return reportPath;
    } catch (error) {
      console.error(`Error saving JSON report: ${error}`);
      throw error;
    }
  }
}