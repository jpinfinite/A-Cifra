import * as fs from 'fs';
import * as path from 'path';
import { getFileHash, getFileSize } from './utils';
import { ImageFile } from './types';

/**
 * Duplicate Detector - Identifies and handles duplicate images
 */

export interface DuplicateGroup {
  hash: string;
  files: Array<{
    path: string;
    size: number;
    quality: number;
    format: string;
  }>;
  bestFile: string;
  duplicates: string[];
}

export class DuplicateDetector {
  private hashCache: Map<string, string> = new Map();
  private sizeCache: Map<string, number> = new Map();

  /**
   * Generate content hash for an image file
   */
  generateContentHash(filePath: string): string {
    // Check cache first
    if (this.hashCache.has(filePath)) {
      return this.hashCache.get(filePath)!;
    }

    const hash = getFileHash(filePath);
    this.hashCache.set(filePath, hash);
    return hash;
  }

  /**
   * Get file size with caching
   */
  getFileSizeWithCache(filePath: string): number {
    if (this.sizeCache.has(filePath)) {
      return this.sizeCache.get(filePath)!;
    }

    const size = getFileSize(filePath);
    this.sizeCache.set(filePath, size);
    return size;
  }

  /**
   * Determine image quality score based on file size and format
   */
  calculateQualityScore(filePath: string): number {
    const size = this.getFileSizeWithCache(filePath);
    const extension = path.extname(filePath).toLowerCase();
    
    let formatScore = 0;
    let sizeScore = Math.min(size / 1000000, 10); // Size in MB, capped at 10

    // Format preference: PNG > JPG > WEBP > GIF > others
    switch (extension) {
      case '.png':
        formatScore = 10;
        break;
      case '.jpg':
      case '.jpeg':
        formatScore = 9;
        break;
      case '.webp':
        formatScore = 8;
        break;
      case '.gif':
        formatScore = 6;
        break;
      case '.bmp':
        formatScore = 4;
        break;
      case '.eps':
        formatScore = 7; // Vector format, good quality
        break;
      case '.ai':
        formatScore = 8; // Adobe Illustrator, high quality
        break;
      case '.svg':
        formatScore = 9; // Vector, scalable
        break;
      default:
        formatScore = 3;
    }

    // Weighted score: format is more important than size
    return (formatScore * 0.7) + (sizeScore * 0.3);
  }

  /**
   * Check if two files are likely duplicates based on size similarity
   */
  areSizeSimilar(size1: number, size2: number, tolerance: number = 0.05): boolean {
    const larger = Math.max(size1, size2);
    const smaller = Math.min(size1, size2);
    const difference = larger - smaller;
    
    return (difference / larger) <= tolerance;
  }

  /**
   * Find duplicate images in a list of files
   */
  findDuplicates(filePaths: string[]): DuplicateGroup[] {
    console.log(`Analyzing ${filePaths.length} files for duplicates...`);
    
    const hashGroups: Map<string, string[]> = new Map();
    const sizeGroups: Map<number, string[]> = new Map();
    
    // Group files by hash (exact duplicates)
    for (const filePath of filePaths) {
      try {
        const hash = this.generateContentHash(filePath);
        if (hash) {
          if (!hashGroups.has(hash)) {
            hashGroups.set(hash, []);
          }
          hashGroups.get(hash)!.push(filePath);
        }
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
      }
    }

    // Also group by size for potential near-duplicates
    for (const filePath of filePaths) {
      try {
        const size = this.getFileSizeWithCache(filePath);
        if (!sizeGroups.has(size)) {
          sizeGroups.set(size, []);
        }
        sizeGroups.get(size)!.push(filePath);
      } catch (error) {
        console.error(`Error getting size for ${filePath}:`, error);
      }
    }

    const duplicateGroups: DuplicateGroup[] = [];

    // Process exact hash duplicates
    for (const [hash, files] of hashGroups.entries()) {
      if (files.length > 1) {
        const group = this.createDuplicateGroup(hash, files);
        duplicateGroups.push(group);
      }
    }

    // Process potential size-based duplicates (different formats of same image)
    for (const [size, files] of sizeGroups.entries()) {
      if (files.length > 1) {
        // Check if these files have different hashes (not already processed)
        const uniqueHashes = new Set(files.map(f => this.generateContentHash(f)));
        if (uniqueHashes.size === files.length) {
          // All different hashes but same size - potential format duplicates
          const group = this.createDuplicateGroup(`size-${size}`, files);
          duplicateGroups.push(group);
        }
      }
    }

    console.log(`Found ${duplicateGroups.length} duplicate groups`);
    return duplicateGroups;
  }

  /**
   * Create a duplicate group with quality analysis
   */
  private createDuplicateGroup(hash: string, files: string[]): DuplicateGroup {
    const fileDetails = files.map(filePath => ({
      path: filePath,
      size: this.getFileSizeWithCache(filePath),
      quality: this.calculateQualityScore(filePath),
      format: path.extname(filePath).toLowerCase()
    }));

    // Sort by quality score (highest first)
    fileDetails.sort((a, b) => b.quality - a.quality);

    const bestFile = fileDetails[0].path;
    const duplicates = fileDetails.slice(1).map(f => f.path);

    return {
      hash,
      files: fileDetails,
      bestFile,
      duplicates
    };
  }

  /**
   * Identify highest quality version among duplicates
   */
  identifyBestVersion(duplicateGroup: DuplicateGroup): string {
    return duplicateGroup.bestFile;
  }

  /**
   * Get web-optimized format preference
   */
  isWebOptimized(filePath: string): boolean {
    const extension = path.extname(filePath).toLowerCase();
    const webFormats = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
    return webFormats.includes(extension);
  }

  /**
   * Prioritize web-optimized formats over others
   */
  prioritizeWebFormats(duplicateGroup: DuplicateGroup): string {
    // First, try to find web-optimized formats
    const webOptimizedFiles = duplicateGroup.files.filter(f => this.isWebOptimized(f.path));
    
    if (webOptimizedFiles.length > 0) {
      // Among web-optimized files, pick the highest quality
      webOptimizedFiles.sort((a, b) => b.quality - a.quality);
      return webOptimizedFiles[0].path;
    }

    // If no web-optimized formats, return the original best file
    return duplicateGroup.bestFile;
  }

  /**
   * Generate duplicate removal report
   */
  generateDuplicateReport(duplicateGroups: DuplicateGroup[]): {
    totalDuplicates: number;
    spaceSaved: number;
    removedFiles: string[];
    keptFiles: string[];
  } {
    let totalDuplicates = 0;
    let spaceSaved = 0;
    const removedFiles: string[] = [];
    const keptFiles: string[] = [];

    for (const group of duplicateGroups) {
      const bestFile = this.prioritizeWebFormats(group);
      keptFiles.push(bestFile);

      for (const duplicate of group.duplicates) {
        if (duplicate !== bestFile) {
          removedFiles.push(duplicate);
          spaceSaved += this.getFileSizeWithCache(duplicate);
          totalDuplicates++;
        }
      }
    }

    return {
      totalDuplicates,
      spaceSaved,
      removedFiles,
      keptFiles
    };
  }

  /**
   * Validate image files and identify corrupted ones
   */
  validateImageFiles(filePaths: string[]): {
    valid: string[];
    corrupted: string[];
    unreadable: string[];
  } {
    const valid: string[] = [];
    const corrupted: string[] = [];
    const unreadable: string[] = [];

    for (const filePath of filePaths) {
      try {
        // Try to read the file
        const stats = fs.statSync(filePath);
        
        if (stats.size === 0) {
          corrupted.push(filePath);
          continue;
        }

        // Try to generate hash (basic validation)
        const hash = this.generateContentHash(filePath);
        if (hash) {
          valid.push(filePath);
        } else {
          corrupted.push(filePath);
        }
      } catch (error) {
        unreadable.push(filePath);
      }
    }

    return { valid, corrupted, unreadable };
  }

  /**
   * Clear caches to free memory
   */
  clearCaches(): void {
    this.hashCache.clear();
    this.sizeCache.clear();
  }
}