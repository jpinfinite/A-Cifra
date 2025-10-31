import * as fs from 'fs';
import * as path from 'path';
import { DuplicateDetector, DuplicateGroup } from './duplicate-detector';
import { deleteFile, moveFile, ensureDirectoryExists } from './utils';
import { OrganizerConfig } from './types';

/**
 * Cleanup Manager - Handles removal of duplicates and corrupted files
 */

export interface CleanupResult {
  duplicatesRemoved: number;
  corruptedFilesHandled: number;
  spaceSaved: number;
  errors: string[];
  removedFiles: string[];
  movedFiles: Array<{ from: string; to: string; reason: string }>;
}

export class CleanupManager {
  private config: OrganizerConfig;
  private duplicateDetector: DuplicateDetector;

  constructor(config: OrganizerConfig) {
    this.config = config;
    this.duplicateDetector = new DuplicateDetector();
  }

  /**
   * Remove duplicate files safely
   */
  removeDuplicates(duplicateGroups: DuplicateGroup[]): CleanupResult {
    console.log('Starting duplicate removal process...');
    
    const result: CleanupResult = {
      duplicatesRemoved: 0,
      corruptedFilesHandled: 0,
      spaceSaved: 0,
      errors: [],
      removedFiles: [],
      movedFiles: []
    };

    const duplicatesRemovedDir = path.join(this.config.targetDir, 'duplicates-removed');
    ensureDirectoryExists(duplicatesRemovedDir);

    for (const group of duplicateGroups) {
      try {
        const bestFile = this.duplicateDetector.prioritizeWebFormats(group);
        console.log(`Keeping best version: ${path.basename(bestFile)}`);

        for (const duplicate of group.duplicates) {
          if (duplicate !== bestFile) {
            const fileSize = this.duplicateDetector.getFileSizeWithCache(duplicate);
            
            if (this.config.dryRun) {
              console.log(`[DRY RUN] Would remove duplicate: ${duplicate}`);
              result.duplicatesRemoved++;
              result.spaceSaved += fileSize;
            } else {
              // Move to duplicates-removed directory instead of deleting
              const filename = path.basename(duplicate);
              const backupPath = path.join(duplicatesRemovedDir, filename);
              
              if (moveFile(duplicate, backupPath)) {
                console.log(`✓ Moved duplicate to backup: ${filename}`);
                result.duplicatesRemoved++;
                result.spaceSaved += fileSize;
                result.removedFiles.push(duplicate);
                result.movedFiles.push({
                  from: duplicate,
                  to: backupPath,
                  reason: 'duplicate'
                });
              } else {
                const error = `Failed to move duplicate: ${duplicate}`;
                console.error(error);
                result.errors.push(error);
              }
            }
          }
        }
      } catch (error) {
        const errorMessage = `Error processing duplicate group: ${error}`;
        console.error(errorMessage);
        result.errors.push(errorMessage);
      }
    }

    console.log(`Duplicate removal complete. Removed: ${result.duplicatesRemoved}, Space saved: ${(result.spaceSaved / 1024 / 1024).toFixed(2)} MB`);
    return result;
  }

  /**
   * Handle corrupted or unreadable image files
   */
  handleCorruptedFiles(filePaths: string[]): CleanupResult {
    console.log('Checking for corrupted files...');
    
    const result: CleanupResult = {
      duplicatesRemoved: 0,
      corruptedFilesHandled: 0,
      spaceSaved: 0,
      errors: [],
      removedFiles: [],
      movedFiles: []
    };

    const validation = this.duplicateDetector.validateImageFiles(filePaths);
    const invalidDir = path.join(this.config.targetDir, 'invalid');
    ensureDirectoryExists(invalidDir);

    // Handle corrupted files
    for (const corruptedFile of validation.corrupted) {
      try {
        const filename = path.basename(corruptedFile);
        const fileSize = this.duplicateDetector.getFileSizeWithCache(corruptedFile);
        
        if (this.config.dryRun) {
          console.log(`[DRY RUN] Would move corrupted file: ${corruptedFile}`);
          result.corruptedFilesHandled++;
        } else {
          const invalidPath = path.join(invalidDir, `corrupted-${filename}`);
          
          if (moveFile(corruptedFile, invalidPath)) {
            console.log(`✓ Moved corrupted file: ${filename}`);
            result.corruptedFilesHandled++;
            result.spaceSaved += fileSize;
            result.movedFiles.push({
              from: corruptedFile,
              to: invalidPath,
              reason: 'corrupted'
            });
          } else {
            const error = `Failed to move corrupted file: ${corruptedFile}`;
            console.error(error);
            result.errors.push(error);
          }
        }
      } catch (error) {
        const errorMessage = `Error handling corrupted file ${corruptedFile}: ${error}`;
        console.error(errorMessage);
        result.errors.push(errorMessage);
      }
    }

    // Handle unreadable files
    for (const unreadableFile of validation.unreadable) {
      try {
        const filename = path.basename(unreadableFile);
        
        if (this.config.dryRun) {
          console.log(`[DRY RUN] Would move unreadable file: ${unreadableFile}`);
          result.corruptedFilesHandled++;
        } else {
          const invalidPath = path.join(invalidDir, `unreadable-${filename}`);
          
          if (moveFile(unreadableFile, invalidPath)) {
            console.log(`✓ Moved unreadable file: ${filename}`);
            result.corruptedFilesHandled++;
            result.movedFiles.push({
              from: unreadableFile,
              to: invalidPath,
              reason: 'unreadable'
            });
          } else {
            const error = `Failed to move unreadable file: ${unreadableFile}`;
            console.error(error);
            result.errors.push(error);
          }
        }
      } catch (error) {
        const errorMessage = `Error handling unreadable file ${unreadableFile}: ${error}`;
        console.error(errorMessage);
        result.errors.push(errorMessage);
      }
    }

    console.log(`Corrupted file handling complete. Handled: ${result.corruptedFilesHandled} files`);
    return result;
  }

  /**
   * Prioritize web-optimized formats over others
   */
  prioritizeWebFormats(filePaths: string[]): {
    prioritized: string[];
    deprioritized: string[];
  } {
    const webFormats = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
    const prioritized: string[] = [];
    const deprioritized: string[] = [];

    for (const filePath of filePaths) {
      const extension = path.extname(filePath).toLowerCase();
      if (webFormats.includes(extension)) {
        prioritized.push(filePath);
      } else {
        deprioritized.push(filePath);
      }
    }

    return { prioritized, deprioritized };
  }

  /**
   * Handle non-web-optimized formats
   */
  handleNonWebFormats(filePaths: string[]): CleanupResult {
    console.log('Processing non-web-optimized formats...');
    
    const result: CleanupResult = {
      duplicatesRemoved: 0,
      corruptedFilesHandled: 0,
      spaceSaved: 0,
      errors: [],
      removedFiles: [],
      movedFiles: []
    };

    const { prioritized, deprioritized } = this.prioritizeWebFormats(filePaths);
    
    if (deprioritized.length === 0) {
      console.log('All files are already in web-optimized formats');
      return result;
    }

    const nonWebDir = path.join(this.config.targetDir, 'non-web-formats');
    ensureDirectoryExists(nonWebDir);

    // Group by base name to find format alternatives
    const baseNameGroups: Map<string, string[]> = new Map();
    
    for (const filePath of filePaths) {
      const baseName = path.basename(filePath, path.extname(filePath));
      if (!baseNameGroups.has(baseName)) {
        baseNameGroups.set(baseName, []);
      }
      baseNameGroups.get(baseName)!.push(filePath);
    }

    // Process files that have web alternatives
    for (const [baseName, files] of baseNameGroups.entries()) {
      if (files.length > 1) {
        const webFiles = files.filter(f => this.prioritizeWebFormats([f]).prioritized.length > 0);
        const nonWebFiles = files.filter(f => this.prioritizeWebFormats([f]).deprioritized.length > 0);
        
        if (webFiles.length > 0 && nonWebFiles.length > 0) {
          // We have both web and non-web versions, move non-web to separate folder
          for (const nonWebFile of nonWebFiles) {
            try {
              const filename = path.basename(nonWebFile);
              const fileSize = this.duplicateDetector.getFileSizeWithCache(nonWebFile);
              
              if (this.config.dryRun) {
                console.log(`[DRY RUN] Would move non-web format: ${nonWebFile}`);
              } else {
                const nonWebPath = path.join(nonWebDir, filename);
                
                if (moveFile(nonWebFile, nonWebPath)) {
                  console.log(`✓ Moved non-web format: ${filename}`);
                  result.spaceSaved += fileSize;
                  result.movedFiles.push({
                    from: nonWebFile,
                    to: nonWebPath,
                    reason: 'non-web-format'
                  });
                } else {
                  const error = `Failed to move non-web format: ${nonWebFile}`;
                  console.error(error);
                  result.errors.push(error);
                }
              }
            } catch (error) {
              const errorMessage = `Error handling non-web format ${nonWebFile}: ${error}`;
              console.error(errorMessage);
              result.errors.push(errorMessage);
            }
          }
        }
      }
    }

    console.log(`Non-web format processing complete. Moved: ${result.movedFiles.length} files`);
    return result;
  }

  /**
   * Comprehensive cleanup operation
   */
  performComprehensiveCleanup(filePaths: string[]): CleanupResult {
    console.log('Starting comprehensive cleanup...');
    
    const combinedResult: CleanupResult = {
      duplicatesRemoved: 0,
      corruptedFilesHandled: 0,
      spaceSaved: 0,
      errors: [],
      removedFiles: [],
      movedFiles: []
    };

    try {
      // Step 1: Handle corrupted files
      console.log('Step 1: Handling corrupted files...');
      const corruptedResult = this.handleCorruptedFiles(filePaths);
      this.mergeResults(combinedResult, corruptedResult);

      // Step 2: Find and remove duplicates
      console.log('Step 2: Finding and removing duplicates...');
      const validFiles = filePaths.filter(f => !corruptedResult.movedFiles.some(m => m.from === f));
      const duplicateGroups = this.duplicateDetector.findDuplicates(validFiles);
      const duplicateResult = this.removeDuplicates(duplicateGroups);
      this.mergeResults(combinedResult, duplicateResult);

      // Step 3: Handle non-web formats
      console.log('Step 3: Processing non-web formats...');
      const remainingFiles = validFiles.filter(f => !duplicateResult.removedFiles.includes(f));
      const formatResult = this.handleNonWebFormats(remainingFiles);
      this.mergeResults(combinedResult, formatResult);

      console.log('Comprehensive cleanup complete!');
      console.log(`Total duplicates removed: ${combinedResult.duplicatesRemoved}`);
      console.log(`Total corrupted files handled: ${combinedResult.corruptedFilesHandled}`);
      console.log(`Total space saved: ${(combinedResult.spaceSaved / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Total errors: ${combinedResult.errors.length}`);

    } catch (error) {
      const errorMessage = `Error during comprehensive cleanup: ${error}`;
      console.error(errorMessage);
      combinedResult.errors.push(errorMessage);
    }

    return combinedResult;
  }

  /**
   * Merge cleanup results
   */
  private mergeResults(target: CleanupResult, source: CleanupResult): void {
    target.duplicatesRemoved += source.duplicatesRemoved;
    target.corruptedFilesHandled += source.corruptedFilesHandled;
    target.spaceSaved += source.spaceSaved;
    target.errors.push(...source.errors);
    target.removedFiles.push(...source.removedFiles);
    target.movedFiles.push(...source.movedFiles);
  }

  /**
   * Generate cleanup summary report
   */
  generateCleanupSummary(result: CleanupResult): string {
    const summary = [
      '# Cleanup Summary Report',
      '',
      `**Generated:** ${new Date().toISOString()}`,
      '',
      '## Statistics',
      `- Duplicates removed: ${result.duplicatesRemoved}`,
      `- Corrupted files handled: ${result.corruptedFilesHandled}`,
      `- Space saved: ${(result.spaceSaved / 1024 / 1024).toFixed(2)} MB`,
      `- Files moved: ${result.movedFiles.length}`,
      `- Errors encountered: ${result.errors.length}`,
      ''
    ];

    if (result.movedFiles.length > 0) {
      summary.push('## Files Moved');
      summary.push('');
      for (const move of result.movedFiles) {
        summary.push(`- **${move.reason}**: \`${path.basename(move.from)}\` → \`${move.to}\``);
      }
      summary.push('');
    }

    if (result.errors.length > 0) {
      summary.push('## Errors');
      summary.push('');
      for (const error of result.errors) {
        summary.push(`- ${error}`);
      }
      summary.push('');
    }

    return summary.join('\n');
  }
}