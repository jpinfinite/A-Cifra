import * as fs from 'fs';
import * as path from 'path';
import { ensureDirectoryExists, moveFile, copyFile } from './utils';
import { OrganizerConfig } from './types';

/**
 * Directory Manager - Handles file movement operations and directory structure
 */

export class DirectoryManager {
  private config: OrganizerConfig;

  constructor(config: OrganizerConfig) {
    this.config = config;
  }

  /**
   * Create the complete directory structure for organization
   */
  createDirectoryStructure(): void {
    console.log('Creating directory structure...');
    
    // Create category directories
    this.config.categories.forEach(category => {
      const categoryPath = path.join(this.config.targetDir, category.name);
      ensureDirectoryExists(categoryPath);
      console.log(`✓ Created category directory: ${category.name}`);
    });

    // Ensure preserved directories exist
    this.config.preserveExisting.forEach(dirName => {
      const preservedPath = path.join(this.config.targetDir, dirName);
      ensureDirectoryExists(preservedPath);
      console.log(`✓ Ensured preserved directory: ${dirName}`);
    });

    // Create special directories
    const specialDirs = ['invalid', 'duplicates-removed'];
    specialDirs.forEach(dirName => {
      const specialPath = path.join(this.config.targetDir, dirName);
      ensureDirectoryExists(specialPath);
      console.log(`✓ Created special directory: ${dirName}`);
    });
  }

  /**
   * Move file to target directory with error handling
   */
  moveFileToCategory(
    sourcePath: string, 
    targetDir: string, 
    newFilename: string,
    dryRun: boolean = false
  ): { success: boolean; error?: string; targetPath?: string } {
    try {
      const targetPath = path.join(targetDir, newFilename);
      
      if (dryRun) {
        console.log(`[DRY RUN] Would move: ${sourcePath} → ${targetPath}`);
        return { success: true, targetPath };
      }

      // Ensure target directory exists
      ensureDirectoryExists(targetDir);

      // Check if source file exists
      if (!fs.existsSync(sourcePath)) {
        return { success: false, error: `Source file does not exist: ${sourcePath}` };
      }

      // Check if target already exists
      if (fs.existsSync(targetPath)) {
        return { success: false, error: `Target file already exists: ${targetPath}` };
      }

      // Perform the move
      const moveSuccess = moveFile(sourcePath, targetPath);
      
      if (moveSuccess) {
        console.log(`✓ Moved: ${path.basename(sourcePath)} → ${targetPath}`);
        return { success: true, targetPath };
      } else {
        return { success: false, error: `Failed to move file: ${sourcePath}` };
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: `Error moving file: ${errorMessage}` };
    }
  }

  /**
   * Copy file to target directory (for backup purposes)
   */
  copyFileToCategory(
    sourcePath: string, 
    targetDir: string, 
    newFilename: string
  ): { success: boolean; error?: string; targetPath?: string } {
    try {
      const targetPath = path.join(targetDir, newFilename);
      
      // Ensure target directory exists
      ensureDirectoryExists(targetDir);

      // Check if source file exists
      if (!fs.existsSync(sourcePath)) {
        return { success: false, error: `Source file does not exist: ${sourcePath}` };
      }

      // Perform the copy
      const copySuccess = copyFile(sourcePath, targetPath);
      
      if (copySuccess) {
        console.log(`✓ Copied: ${path.basename(sourcePath)} → ${targetPath}`);
        return { success: true, targetPath };
      } else {
        return { success: false, error: `Failed to copy file: ${sourcePath}` };
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: `Error copying file: ${errorMessage}` };
    }
  }

  /**
   * Move file to invalid directory for manual review
   */
  moveToInvalidDirectory(sourcePath: string): { success: boolean; error?: string } {
    const invalidDir = path.join(this.config.targetDir, 'invalid');
    const filename = path.basename(sourcePath);
    
    return this.moveFileToCategory(sourcePath, invalidDir, filename, this.config.dryRun);
  }

  /**
   * Batch move files with progress tracking
   */
  batchMoveFiles(
    operations: Array<{
      sourcePath: string;
      targetDir: string;
      newFilename: string;
      category: string;
    }>,
    progressCallback?: (current: number, total: number, operation: string) => void
  ): Array<{ success: boolean; operation: any; error?: string; targetPath?: string }> {
    const results: Array<{ success: boolean; operation: any; error?: string; targetPath?: string }> = [];
    
    operations.forEach((operation, index) => {
      const result = this.moveFileToCategory(
        operation.sourcePath,
        operation.targetDir,
        operation.newFilename,
        this.config.dryRun
      );
      
      results.push({
        success: result.success,
        operation,
        error: result.error,
        targetPath: result.targetPath
      });

      if (progressCallback) {
        const operationDesc = `${path.basename(operation.sourcePath)} → ${operation.category}`;
        progressCallback(index + 1, operations.length, operationDesc);
      }
    });

    return results;
  }

  /**
   * Validate file system permissions
   */
  validatePermissions(): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    let valid = true;

    // Check source directory permissions
    try {
      fs.accessSync(this.config.sourceDir, fs.constants.R_OK);
    } catch (error) {
      issues.push(`Cannot read source directory: ${this.config.sourceDir}`);
      valid = false;
    }

    // Check target directory permissions
    try {
      fs.accessSync(this.config.targetDir, fs.constants.W_OK);
    } catch (error) {
      // Try to create target directory if it doesn't exist
      try {
        ensureDirectoryExists(this.config.targetDir);
      } catch (createError) {
        issues.push(`Cannot write to target directory: ${this.config.targetDir}`);
        valid = false;
      }
    }

    return { valid, issues };
  }

  /**
   * Check available disk space
   */
  checkDiskSpace(): { available: number; required: number; sufficient: boolean } {
    try {
      const stats = fs.statSync(this.config.sourceDir);
      // This is a simplified check - in a real implementation, you'd use a library
      // to get actual disk space information
      return {
        available: 1000000000, // 1GB placeholder
        required: stats.size || 0,
        sufficient: true
      };
    } catch (error) {
      return {
        available: 0,
        required: 0,
        sufficient: false
      };
    }
  }

  /**
   * Clean up empty directories after organization
   */
  cleanupEmptyDirectories(): void {
    console.log('Cleaning up empty directories...');
    
    const cleanupDir = (dirPath: string) => {
      try {
        const items = fs.readdirSync(dirPath);
        
        // Recursively clean subdirectories first
        for (const item of items) {
          const itemPath = path.join(dirPath, item);
          const stats = fs.statSync(itemPath);
          
          if (stats.isDirectory()) {
            cleanupDir(itemPath);
          }
        }

        // Check if directory is now empty
        const remainingItems = fs.readdirSync(dirPath);
        if (remainingItems.length === 0 && dirPath !== this.config.sourceDir) {
          fs.rmdirSync(dirPath);
          console.log(`✓ Removed empty directory: ${dirPath}`);
        }
      } catch (error) {
        console.error(`Error cleaning directory ${dirPath}:`, error);
      }
    };

    cleanupDir(this.config.sourceDir);
  }

  /**
   * Create backup of original structure before organization
   */
  createBackup(): { success: boolean; backupPath?: string; error?: string } {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(this.config.targetDir, `backup-${timestamp}`);
      
      ensureDirectoryExists(backupPath);
      
      // Create a manifest of the original structure
      const manifest = this.createStructureManifest();
      const manifestPath = path.join(backupPath, 'original-structure.json');
      
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      
      console.log(`✓ Created backup manifest: ${manifestPath}`);
      return { success: true, backupPath };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: `Failed to create backup: ${errorMessage}` };
    }
  }

  /**
   * Create a manifest of the current directory structure
   */
  private createStructureManifest(): any {
    const manifest: any = {
      timestamp: new Date().toISOString(),
      sourceDir: this.config.sourceDir,
      structure: {}
    };

    const scanDirectory = (dirPath: string): any => {
      const result: any = {};
      
      try {
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
          const itemPath = path.join(dirPath, item);
          const stats = fs.statSync(itemPath);
          
          if (stats.isDirectory()) {
            result[item] = {
              type: 'directory',
              contents: scanDirectory(itemPath)
            };
          } else {
            result[item] = {
              type: 'file',
              size: stats.size,
              modified: stats.mtime.toISOString()
            };
          }
        }
      } catch (error) {
        console.error(`Error scanning directory ${dirPath}:`, error);
      }
      
      return result;
    };

    manifest.structure = scanDirectory(this.config.sourceDir);
    return manifest;
  }
}