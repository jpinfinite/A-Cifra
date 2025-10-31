import * as fs from 'fs';
import * as path from 'path';
import { OrganizerConfig, ImageFile } from './types';
import { getAllFiles, isImageFile } from './utils';

/**
 * Validation and Testing Utilities
 */

export interface ValidationResult {
  valid: boolean;
  issues: string[];
  warnings: string[];
  suggestions: string[];
}

export interface DryRunResult {
  wouldProcess: number;
  wouldMove: number;
  wouldRename: number;
  wouldRemoveDuplicates: number;
  estimatedSpaceSaved: number;
  potentialIssues: string[];
  categoryBreakdown: { [category: string]: number };
}

export interface RollbackInfo {
  timestamp: string;
  operations: Array<{
    type: 'move' | 'rename' | 'delete';
    from: string;
    to: string;
    originalName?: string;
  }>;
  canRollback: boolean;
  rollbackPath: string;
}

export class ValidationUtils {
  private config: OrganizerConfig;

  constructor(config: OrganizerConfig) {
    this.config = config;
  }

  /**
   * Validate the organized directory structure
   */
  validateOrganizedStructure(): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      issues: [],
      warnings: [],
      suggestions: []
    };

    try {
      // Check if target directory exists
      if (!fs.existsSync(this.config.targetDir)) {
        result.issues.push(`Target directory does not exist: ${this.config.targetDir}`);
        result.valid = false;
        return result;
      }

      // Check category directories
      for (const category of this.config.categories) {
        const categoryPath = path.join(this.config.targetDir, category.name);
        
        if (!fs.existsSync(categoryPath)) {
          result.issues.push(`Category directory missing: ${category.name}`);
          result.valid = false;
        } else {
          // Check if directory is accessible
          try {
            fs.accessSync(categoryPath, fs.constants.R_OK | fs.constants.W_OK);
          } catch (error) {
            result.issues.push(`Category directory not accessible: ${category.name}`);
            result.valid = false;
          }
        }
      }

      // Check preserved directories
      for (const preservedDir of this.config.preserveExisting) {
        const preservedPath = path.join(this.config.targetDir, preservedDir);
        
        if (!fs.existsSync(preservedPath)) {
          result.warnings.push(`Preserved directory missing: ${preservedDir}`);
        }
      }

      // Check for orphaned files (files not in any category)
      const orphanedFiles = this.findOrphanedFiles();
      if (orphanedFiles.length > 0) {
        result.warnings.push(`Found ${orphanedFiles.length} orphaned files in root directory`);
        result.suggestions.push('Consider organizing orphaned files into appropriate categories');
      }

      // Check for empty categories
      const emptyCategories = this.findEmptyCategories();
      if (emptyCategories.length > 0) {
        result.warnings.push(`Found ${emptyCategories.length} empty category directories`);
        result.suggestions.push('Consider removing unused category directories');
      }

      // Check for naming consistency
      const namingIssues = this.checkNamingConsistency();
      if (namingIssues.length > 0) {
        result.warnings.push(`Found ${namingIssues.length} naming consistency issues`);
        result.suggestions.push('Consider standardizing file naming conventions');
      }

    } catch (error) {
      result.issues.push(`Validation error: ${error}`);
      result.valid = false;
    }

    return result;
  }

  /**
   * Perform dry run to preview organization changes
   */
  performDryRun(): DryRunResult {
    const result: DryRunResult = {
      wouldProcess: 0,
      wouldMove: 0,
      wouldRename: 0,
      wouldRemoveDuplicates: 0,
      estimatedSpaceSaved: 0,
      potentialIssues: [],
      categoryBreakdown: {}
    };

    try {
      // Get all files that would be processed
      const allFiles = getAllFiles(this.config.sourceDir, true);
      result.wouldProcess = allFiles.length;

      // Simulate analysis and categorization
      const { ImageAnalyzer } = require('./image-analyzer');
      const analyzer = new ImageAnalyzer(this.config.categories);

      for (const filePath of allFiles) {
        try {
          const analysis = analyzer.analyzeImage(filePath);
          const category = analysis.category;
          
          // Count by category
          result.categoryBreakdown[category] = (result.categoryBreakdown[category] || 0) + 1;
          
          // Check if file would be moved
          const currentDir = path.dirname(filePath);
          const targetDir = path.join(this.config.targetDir, category);
          
          if (currentDir !== targetDir) {
            result.wouldMove++;
          }
          
          // Check if file would be renamed
          const currentName = path.basename(filePath);
          const suggestedName = analysis.suggestedName;
          
          if (currentName !== suggestedName) {
            result.wouldRename++;
          }
          
          // Check for potential issues
          if (suggestedName.length > this.config.maxFilenameLength) {
            result.potentialIssues.push(`Filename too long: ${currentName} → ${suggestedName}`);
          }
          
        } catch (error) {
          result.potentialIssues.push(`Could not analyze: ${path.basename(filePath)} - ${error}`);
        }
      }

      // Simulate duplicate detection
      const { DuplicateDetector } = require('./duplicate-detector');
      const duplicateDetector = new DuplicateDetector();
      
      try {
        const duplicateGroups = duplicateDetector.findDuplicates(allFiles);
        
        for (const group of duplicateGroups) {
          result.wouldRemoveDuplicates += group.duplicates.length;
          
          // Estimate space savings
          for (const duplicate of group.duplicates) {
            try {
              const stats = fs.statSync(duplicate);
              result.estimatedSpaceSaved += stats.size;
            } catch (error) {
              // File might not exist, skip
            }
          }
        }
      } catch (error) {
        result.potentialIssues.push(`Duplicate detection simulation failed: ${error}`);
      }

    } catch (error) {
      result.potentialIssues.push(`Dry run failed: ${error}`);
    }

    return result;
  }

  /**
   * Create rollback information before making changes
   */
  createRollbackInfo(operations: Array<{ type: string; from: string; to: string }>): RollbackInfo {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const rollbackPath = path.join(this.config.targetDir, 'rollback', `rollback-${timestamp}.json`);
    
    const rollbackInfo: RollbackInfo = {
      timestamp: new Date().toISOString(),
      operations: operations.map(op => ({
        type: op.type as 'move' | 'rename' | 'delete',
        from: op.from,
        to: op.to,
        originalName: path.basename(op.from)
      })),
      canRollback: true,
      rollbackPath
    };

    try {
      // Ensure rollback directory exists
      const rollbackDir = path.dirname(rollbackPath);
      if (!fs.existsSync(rollbackDir)) {
        fs.mkdirSync(rollbackDir, { recursive: true });
      }

      // Save rollback information
      fs.writeFileSync(rollbackPath, JSON.stringify(rollbackInfo, null, 2), 'utf8');
      console.log(`✓ Rollback information saved to: ${rollbackPath}`);
      
    } catch (error) {
      console.error(`Failed to create rollback info: ${error}`);
      rollbackInfo.canRollback = false;
    }

    return rollbackInfo;
  }

  /**
   * Execute rollback from rollback file
   */
  executeRollback(rollbackPath: string): { success: boolean; errors: string[] } {
    const result = { success: true, errors: [] as string[] };

    try {
      if (!fs.existsSync(rollbackPath)) {
        result.errors.push(`Rollback file not found: ${rollbackPath}`);
        result.success = false;
        return result;
      }

      const rollbackInfo: RollbackInfo = JSON.parse(fs.readFileSync(rollbackPath, 'utf8'));
      
      if (!rollbackInfo.canRollback) {
        result.errors.push('Rollback is not possible for this operation');
        result.success = false;
        return result;
      }

      console.log(`Starting rollback from ${rollbackInfo.timestamp}...`);
      
      // Reverse the operations
      const reversedOps = rollbackInfo.operations.reverse();
      
      for (const operation of reversedOps) {
        try {
          switch (operation.type) {
            case 'move':
              // Move file back to original location
              if (fs.existsSync(operation.to)) {
                fs.renameSync(operation.to, operation.from);
                console.log(`✓ Moved back: ${path.basename(operation.to)} → ${operation.from}`);
              }
              break;
              
            case 'rename':
              // Rename file back to original name
              if (fs.existsSync(operation.to)) {
                const originalPath = path.join(path.dirname(operation.to), operation.originalName!);
                fs.renameSync(operation.to, originalPath);
                console.log(`✓ Renamed back: ${path.basename(operation.to)} → ${operation.originalName}`);
              }
              break;
              
            case 'delete':
              // Cannot restore deleted files
              result.errors.push(`Cannot restore deleted file: ${operation.originalName}`);
              break;
          }
        } catch (error) {
          result.errors.push(`Failed to rollback operation ${operation.type}: ${error}`);
          result.success = false;
        }
      }

      if (result.success) {
        console.log('✅ Rollback completed successfully');
      } else {
        console.log('⚠️ Rollback completed with errors');
      }

    } catch (error) {
      result.errors.push(`Rollback execution failed: ${error}`);
      result.success = false;
    }

    return result;
  }

  /**
   * Find orphaned files (files in root directory that should be categorized)
   */
  private findOrphanedFiles(): string[] {
    const orphanedFiles: string[] = [];
    
    try {
      const items = fs.readdirSync(this.config.targetDir);
      
      for (const item of items) {
        const itemPath = path.join(this.config.targetDir, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isFile() && isImageFile(item)) {
          // Check if it's not in a category or preserved directory
          const isInCategory = this.config.categories.some(cat => cat.name === path.dirname(itemPath));
          const isPreserved = this.config.preserveExisting.includes(path.dirname(itemPath));
          
          if (!isInCategory && !isPreserved) {
            orphanedFiles.push(itemPath);
          }
        }
      }
    } catch (error) {
      console.error(`Error finding orphaned files: ${error}`);
    }
    
    return orphanedFiles;
  }

  /**
   * Find empty category directories
   */
  private findEmptyCategories(): string[] {
    const emptyCategories: string[] = [];
    
    for (const category of this.config.categories) {
      const categoryPath = path.join(this.config.targetDir, category.name);
      
      try {
        if (fs.existsSync(categoryPath)) {
          const items = fs.readdirSync(categoryPath);
          const imageFiles = items.filter(item => {
            const itemPath = path.join(categoryPath, item);
            return fs.statSync(itemPath).isFile() && isImageFile(item);
          });
          
          if (imageFiles.length === 0) {
            emptyCategories.push(category.name);
          }
        }
      } catch (error) {
        console.error(`Error checking category ${category.name}: ${error}`);
      }
    }
    
    return emptyCategories;
  }

  /**
   * Check naming consistency across categories
   */
  private checkNamingConsistency(): string[] {
    const issues: string[] = [];
    
    for (const category of this.config.categories) {
      const categoryPath = path.join(this.config.targetDir, category.name);
      
      try {
        if (fs.existsSync(categoryPath)) {
          const files = fs.readdirSync(categoryPath).filter(file => {
            const filePath = path.join(categoryPath, file);
            return fs.statSync(filePath).isFile() && isImageFile(file);
          });
          
          // Check for inconsistent naming patterns
          const patterns = {
            hasSpaces: files.filter(f => f.includes(' ')).length,
            hasUnderscores: files.filter(f => f.includes('_')).length,
            hasHyphens: files.filter(f => f.includes('-')).length,
            hasNumbers: files.filter(f => /\d/.test(f)).length
          };
          
          // If mixed patterns exist, flag as inconsistent
          const patternCount = Object.values(patterns).filter(count => count > 0).length;
          if (patternCount > 2 && files.length > 5) {
            issues.push(`Inconsistent naming in ${category.name}: mixed patterns detected`);
          }
        }
      } catch (error) {
        console.error(`Error checking naming consistency in ${category.name}: ${error}`);
      }
    }
    
    return issues;
  }

  /**
   * Generate validation report
   */
  generateValidationReport(): string {
    const structureValidation = this.validateOrganizedStructure();
    const dryRunResult = this.performDryRun();
    
    const report = [
      '# Validation Report',
      '',
      `**Generated:** ${new Date().toLocaleString()}`,
      '',
      '## Structure Validation',
      `**Status:** ${structureValidation.valid ? '✅ Valid' : '❌ Invalid'}`,
      ''
    ];

    if (structureValidation.issues.length > 0) {
      report.push('### Issues');
      structureValidation.issues.forEach(issue => report.push(`- ❌ ${issue}`));
      report.push('');
    }

    if (structureValidation.warnings.length > 0) {
      report.push('### Warnings');
      structureValidation.warnings.forEach(warning => report.push(`- ⚠️ ${warning}`));
      report.push('');
    }

    if (structureValidation.suggestions.length > 0) {
      report.push('### Suggestions');
      structureValidation.suggestions.forEach(suggestion => report.push(`- 💡 ${suggestion}`));
      report.push('');
    }

    report.push('## Dry Run Results');
    report.push(`- Files to process: ${dryRunResult.wouldProcess}`);
    report.push(`- Files to move: ${dryRunResult.wouldMove}`);
    report.push(`- Files to rename: ${dryRunResult.wouldRename}`);
    report.push(`- Duplicates to remove: ${dryRunResult.wouldRemoveDuplicates}`);
    report.push(`- Estimated space saved: ${(dryRunResult.estimatedSpaceSaved / 1024 / 1024).toFixed(2)} MB`);
    report.push('');

    if (Object.keys(dryRunResult.categoryBreakdown).length > 0) {
      report.push('### Category Breakdown');
      for (const [category, count] of Object.entries(dryRunResult.categoryBreakdown)) {
        report.push(`- ${category}: ${count} files`);
      }
      report.push('');
    }

    if (dryRunResult.potentialIssues.length > 0) {
      report.push('### Potential Issues');
      dryRunResult.potentialIssues.forEach(issue => report.push(`- ⚠️ ${issue}`));
      report.push('');
    }

    return report.join('\n');
  }
}