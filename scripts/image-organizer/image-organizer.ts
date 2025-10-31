import * as path from 'path';
import { ImageFile, OrganizerConfig } from './types';
import { ImageAnalyzer } from './image-analyzer';
import { CategoryManager } from './category-manager';
import { FileRenamer } from './file-renamer';
import { DirectoryManager } from './directory-manager';
import { DuplicateDetector } from './duplicate-detector';
import { CleanupManager } from './cleanup-manager';
import { ReportGenerator } from './report-generator';
import { ErrorLogger, ErrorLevel } from './error-logger';
import { getAllFiles } from './utils';

/**
 * Main Image Organizer - Orchestrates the entire organization process
 */

export class ImageOrganizer {
  private config: OrganizerConfig;
  private imageAnalyzer: ImageAnalyzer;
  private categoryManager: CategoryManager;
  private fileRenamer: FileRenamer;
  private directoryManager: DirectoryManager;
  private duplicateDetector: DuplicateDetector;
  private cleanupManager: CleanupManager;
  private reportGenerator: ReportGenerator;
  private errorLogger: ErrorLogger;

  constructor(config: OrganizerConfig) {
    this.config = config;
    this.imageAnalyzer = new ImageAnalyzer(config.categories);
    this.categoryManager = new CategoryManager(config);
    this.fileRenamer = new FileRenamer(config.maxFilenameLength);
    this.directoryManager = new DirectoryManager(config);
    this.duplicateDetector = new DuplicateDetector();
    this.cleanupManager = new CleanupManager(config);
    this.reportGenerator = new ReportGenerator();
    this.errorLogger = new ErrorLogger(path.join(config.targetDir, 'logs'));
  }

  /**
   * Main orchestration method - runs the complete organization process
   */
  async organize(): Promise<void> {
    this.errorLogger.info('MAIN', 'Starting image organization process');
    console.log('🚀 Starting Image Organization Process...');
    
    try {
      // Step 1: Validate environment and permissions
      await this.validateEnvironment();
      
      // Step 2: Create directory structure
      await this.setupDirectoryStructure();
      
      // Step 3: Scan and analyze all image files
      const imageFiles = await this.scanAndAnalyzeImages();
      
      // Step 4: Perform cleanup operations (duplicates, corrupted files)
      const cleanupResult = await this.performCleanup(imageFiles.map(f => f.originalPath));
      
      // Step 5: Filter out files that were removed during cleanup
      const validImageFiles = imageFiles.filter(file => 
        !cleanupResult.removedFiles.includes(file.originalPath)
      );
      
      // Step 6: Organize and move files
      await this.organizeFiles(validImageFiles);
      
      // Step 7: Generate comprehensive report
      await this.generateFinalReport(validImageFiles, cleanupResult);
      
      // Step 8: Cleanup and finalize
      await this.finalize();
      
      console.log('✅ Image organization completed successfully!');
      this.errorLogger.info('MAIN', 'Image organization completed successfully');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Image organization failed:', errorMessage);
      this.errorLogger.critical('MAIN', 'Image organization failed', { error: errorMessage });
      throw error;
    }
  }

  /**
   * Validate environment and permissions
   */
  private async validateEnvironment(): Promise<void> {
    this.errorLogger.info('VALIDATION', 'Validating environment and permissions');
    console.log('🔍 Validating environment...');
    
    // Check permissions
    const permissionCheck = this.directoryManager.validatePermissions();
    if (!permissionCheck.valid) {
      const error = `Permission validation failed: ${permissionCheck.issues.join(', ')}`;
      this.errorLogger.critical('VALIDATION', error);
      throw new Error(error);
    }
    
    // Check disk space
    const spaceCheck = this.directoryManager.checkDiskSpace();
    if (!spaceCheck.sufficient) {
      const error = 'Insufficient disk space for organization';
      this.errorLogger.critical('VALIDATION', error, spaceCheck);
      throw new Error(error);
    }
    
    // Validate category configuration
    const categoryCheck = this.categoryManager.validateDirectoryStructure();
    if (!categoryCheck.valid) {
      this.errorLogger.warning('VALIDATION', 'Category structure needs setup', categoryCheck.issues);
    }
    
    console.log('✅ Environment validation completed');
  }

  /**
   * Setup directory structure
   */
  private async setupDirectoryStructure(): Promise<void> {
    this.errorLogger.info('SETUP', 'Setting up directory structure');
    console.log('📁 Setting up directory structure...');
    
    try {
      // Create backup of original structure
      const backupResult = this.directoryManager.createBackup();
      if (backupResult.success) {
        this.errorLogger.info('SETUP', 'Backup created successfully', { path: backupResult.backupPath });
      } else {
        this.errorLogger.warning('SETUP', 'Backup creation failed', { error: backupResult.error });
      }
      
      // Create category directories
      this.directoryManager.createDirectoryStructure();
      this.categoryManager.createCategoryDirectories();
      
      console.log('✅ Directory structure setup completed');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.errorLogger.error('SETUP', 'Directory structure setup failed', { error: errorMessage });
      throw error;
    }
  }

  /**
   * Scan directory and analyze all image files
   */
  private async scanAndAnalyzeImages(): Promise<ImageFile[]> {
    this.errorLogger.info('SCAN', 'Scanning and analyzing image files');
    console.log('🔎 Scanning and analyzing images...');
    
    try {
      // Get all image files
      const filePaths = getAllFiles(this.config.sourceDir, true);
      console.log(`Found ${filePaths.length} image files to process`);
      
      const imageFiles: ImageFile[] = [];
      let processed = 0;
      
      for (const filePath of filePaths) {
        try {
          processed++;
          this.errorLogger.logProgress(processed, filePaths.length, 'Analyzing images');
          
          // Skip files in preserved directories unless they need organization
          if (this.categoryManager.isInPreservedDirectory(filePath)) {
            this.errorLogger.info('SCAN', `Skipping preserved directory file: ${path.basename(filePath)}`);
            continue;
          }
          
          // Analyze the image
          const analysis = this.imageAnalyzer.analyzeImage(filePath);
          const targetDir = this.categoryManager.getCategoryPath(analysis.category);
          const newFilename = this.fileRenamer.generateDescriptiveFilename(
            path.basename(filePath),
            analysis.category,
            targetDir
          );
          
          const imageFile: ImageFile = {
            originalPath: filePath,
            originalName: path.basename(filePath),
            extension: path.extname(filePath),
            size: 0, // Will be set during duplicate detection
            hash: '', // Will be set during duplicate detection
            suggestedCategory: analysis.category,
            suggestedName: newFilename,
            newPath: path.join(targetDir, newFilename),
            processed: false
          };
          
          imageFiles.push(imageFile);
          
          if (processed % 50 === 0) {
            console.log(`Analyzed ${processed}/${filePaths.length} files...`);
          }
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          this.errorLogger.error('SCAN', `Failed to analyze ${filePath}`, { error: errorMessage });
        }
      }
      
      console.log(`✅ Analysis completed. ${imageFiles.length} files ready for organization`);
      return imageFiles;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.errorLogger.critical('SCAN', 'Image scanning and analysis failed', { error: errorMessage });
      throw error;
    }
  }

  /**
   * Perform cleanup operations (duplicates, corrupted files)
   */
  private async performCleanup(filePaths: string[]): Promise<any> {
    this.errorLogger.info('CLEANUP', 'Starting cleanup operations');
    console.log('🧹 Performing cleanup operations...');
    
    try {
      const cleanupResult = this.cleanupManager.performComprehensiveCleanup(filePaths);
      
      console.log(`✅ Cleanup completed:`);
      console.log(`   - Duplicates removed: ${cleanupResult.duplicatesRemoved}`);
      console.log(`   - Corrupted files handled: ${cleanupResult.corruptedFilesHandled}`);
      console.log(`   - Space saved: ${(cleanupResult.spaceSaved / 1024 / 1024).toFixed(2)} MB`);
      
      if (cleanupResult.errors.length > 0) {
        console.log(`   - Errors encountered: ${cleanupResult.errors.length}`);
        cleanupResult.errors.forEach(error => {
          this.errorLogger.error('CLEANUP', error);
        });
      }
      
      return cleanupResult;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.errorLogger.critical('CLEANUP', 'Cleanup operations failed', { error: errorMessage });
      throw error;
    }
  }

  /**
   * Organize and move files to their target locations
   */
  private async organizeFiles(imageFiles: ImageFile[]): Promise<void> {
    this.errorLogger.info('ORGANIZE', 'Starting file organization');
    console.log('📦 Organizing files...');
    
    try {
      const operations = imageFiles.map(file => ({
        sourcePath: file.originalPath,
        targetDir: path.dirname(file.newPath),
        newFilename: path.basename(file.newPath),
        category: file.suggestedCategory
      }));
      
      const results = this.directoryManager.batchMoveFiles(
        operations,
        (current, total, operation) => {
          this.errorLogger.logProgress(current, total, 'Moving files');
          if (current % 25 === 0) {
            console.log(`Moved ${current}/${total} files...`);
          }
        }
      );
      
      // Update processed status
      results.forEach((result, index) => {
        const imageFile = imageFiles[index];
        if (result.success) {
          imageFile.processed = true;
          imageFile.newPath = result.targetPath || imageFile.newPath;
          this.errorLogger.logFileOperation('move', imageFile.originalPath, imageFile.newPath, true);
        } else {
          imageFile.processed = false;
          imageFile.error = result.error;
          this.errorLogger.logFileOperation('move', imageFile.originalPath, undefined, false, result.error);
        }
      });
      
      const successCount = results.filter(r => r.success).length;
      console.log(`✅ File organization completed. ${successCount}/${imageFiles.length} files moved successfully`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.errorLogger.critical('ORGANIZE', 'File organization failed', { error: errorMessage });
      throw error;
    }
  }

  /**
   * Generate comprehensive final report
   */
  private async generateFinalReport(imageFiles: ImageFile[], cleanupResult: any): Promise<void> {
    this.errorLogger.info('REPORT', 'Generating final report');
    console.log('📊 Generating reports...');
    
    try {
      const processingReport = this.reportGenerator.generateProcessingReport(
        imageFiles,
        cleanupResult,
        this.errorLogger.getLogs().map(log => log.message)
      );
      
      // Save markdown report
      const reportPath = this.reportGenerator.saveReportToFile(
        processingReport,
        cleanupResult,
        imageFiles,
        path.join(this.config.targetDir, 'reports')
      );
      
      // Save JSON report
      const jsonReportPath = this.reportGenerator.saveJSONReport(
        processingReport,
        cleanupResult,
        imageFiles,
        path.join(this.config.targetDir, 'reports')
      );
      
      // Save error report
      const errorReportPath = this.errorLogger.saveErrorReport(
        path.join(this.config.targetDir, 'reports')
      );
      
      console.log('✅ Reports generated:');
      console.log(`   - Main report: ${reportPath}`);
      console.log(`   - JSON report: ${jsonReportPath}`);
      console.log(`   - Error report: ${errorReportPath}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.errorLogger.error('REPORT', 'Report generation failed', { error: errorMessage });
      // Don't throw here - report generation failure shouldn't stop the process
    }
  }

  /**
   * Finalize the organization process
   */
  private async finalize(): Promise<void> {
    this.errorLogger.info('FINALIZE', 'Finalizing organization process');
    console.log('🏁 Finalizing...');
    
    try {
      // Clean up empty directories
      this.directoryManager.cleanupEmptyDirectories();
      
      // Clear caches to free memory
      this.duplicateDetector.clearCaches();
      
      // Display final statistics
      const stats = this.categoryManager.getDirectoryStats();
      console.log('\n📈 Final Statistics:');
      for (const [category, count] of Object.entries(stats)) {
        if (count > 0) {
          console.log(`   - ${category}: ${count} files`);
        }
      }
      
      // Check for critical errors
      if (this.errorLogger.hasCriticalErrors()) {
        console.log('\n⚠️  Critical errors were encountered. Please review the error report.');
      }
      
      console.log('\n🎉 Organization process completed!');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.errorLogger.error('FINALIZE', 'Finalization failed', { error: errorMessage });
      // Don't throw here - finalization failure shouldn't stop the process
    }
  }

  /**
   * Get current progress information
   */
  getProgress(): {
    phase: string;
    completed: number;
    total: number;
    percentage: number;
    errors: number;
  } {
    const errorCount = this.errorLogger.getErrorCount(ErrorLevel.ERROR) + 
                      this.errorLogger.getErrorCount(ErrorLevel.CRITICAL);
    
    return {
      phase: 'Processing',
      completed: 0,
      total: 0,
      percentage: 0,
      errors: errorCount
    };
  }

  /**
   * Get error summary
   */
  getErrorSummary() {
    return this.errorLogger.generateErrorSummary();
  }
}