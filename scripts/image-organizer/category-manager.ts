import * as path from 'path';
import * as fs from 'fs';
import { CategoryConfig, OrganizerConfig } from './types';
import { ensureDirectoryExists } from './utils';

/**
 * Category Manager - Handles directory structure and category mapping
 */

export class CategoryManager {
  private config: OrganizerConfig;
  private categoryMap: Map<string, CategoryConfig>;

  constructor(config: OrganizerConfig) {
    this.config = config;
    this.categoryMap = new Map();
    
    // Build category map for quick lookup
    config.categories.forEach(category => {
      this.categoryMap.set(category.name, category);
    });
  }

  /**
   * Get all available categories
   */
  getCategories(): CategoryConfig[] {
    return this.config.categories;
  }

  /**
   * Check if a category exists
   */
  categoryExists(categoryName: string): boolean {
    return this.categoryMap.has(categoryName);
  }

  /**
   * Get category configuration by name
   */
  getCategory(categoryName: string): CategoryConfig | undefined {
    return this.categoryMap.get(categoryName);
  }

  /**
   * Check if a directory should be preserved (existing organized directories)
   */
  shouldPreserveDirectory(dirName: string): boolean {
    return this.config.preserveExisting.includes(dirName);
  }

  /**
   * Get the target directory path for a category
   */
  getCategoryPath(category: string): string {
    return path.join(this.config.targetDir, category);
  }

  /**
   * Create all necessary category directories
   */
  createCategoryDirectories(): void {
    console.log('Creating category directories...');
    
    // Create main categories
    this.config.categories.forEach(category => {
      const categoryPath = this.getCategoryPath(category.name);
      ensureDirectoryExists(categoryPath);
      console.log(`Created directory: ${categoryPath}`);
    });

    // Ensure preserved directories exist
    this.config.preserveExisting.forEach(dirName => {
      const preservedPath = path.join(this.config.targetDir, dirName);
      ensureDirectoryExists(preservedPath);
      console.log(`Ensured preserved directory: ${preservedPath}`);
    });
  }

  /**
   * Get existing subdirectories in the source directory
   */
  getExistingSubdirectories(): string[] {
    const subdirs: string[] = [];
    
    try {
      const items = fs.readdirSync(this.config.sourceDir);
      
      for (const item of items) {
        const fullPath = path.join(this.config.sourceDir, item);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          subdirs.push(item);
        }
      }
    } catch (error) {
      console.error(`Error reading source directory ${this.config.sourceDir}:`, error);
    }
    
    return subdirs;
  }

  /**
   * Determine if a file is in a preserved directory
   */
  isInPreservedDirectory(filePath: string): boolean {
    const relativePath = path.relative(this.config.sourceDir, filePath);
    const topLevelDir = relativePath.split(path.sep)[0];
    
    return this.shouldPreserveDirectory(topLevelDir);
  }

  /**
   * Map a category to its final directory, handling edge cases
   */
  mapCategoryToDirectory(category: string, originalPath: string): string {
    // If file is already in a preserved directory, keep it there
    if (this.isInPreservedDirectory(originalPath)) {
      const relativePath = path.relative(this.config.sourceDir, originalPath);
      const topLevelDir = relativePath.split(path.sep)[0];
      return path.join(this.config.targetDir, topLevelDir);
    }

    // Handle category consolidation - if multiple similar categories exist, consolidate
    const consolidatedCategory = this.consolidateCategory(category);
    
    // Return the appropriate category path
    return this.getCategoryPath(consolidatedCategory);
  }

  /**
   * Consolidate similar categories to avoid fragmentation
   */
  private consolidateCategory(category: string): string {
    // Define consolidation rules
    const consolidationMap: { [key: string]: string } = {
      'cryptocurrency': 'general',
      'crypto': 'general',
      'blockchain': 'general',
      'digital-currency': 'general',
      'btc': 'bitcoin',
      'eth': 'ethereum',
      'trading-analysis': 'trading',
      'market-analysis': 'market',
      'wallet-security': 'security'
    };

    return consolidationMap[category] || category;
  }

  /**
   * Get statistics about current directory structure
   */
  getDirectoryStats(): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    
    // Count files in each category directory
    this.config.categories.forEach(category => {
      const categoryPath = this.getCategoryPath(category.name);
      if (fs.existsSync(categoryPath)) {
        try {
          const files = fs.readdirSync(categoryPath).filter(file => {
            const filePath = path.join(categoryPath, file);
            return fs.statSync(filePath).isFile();
          });
          stats[category.name] = files.length;
        } catch (error) {
          stats[category.name] = 0;
        }
      } else {
        stats[category.name] = 0;
      }
    });

    // Count files in preserved directories
    this.config.preserveExisting.forEach(dirName => {
      const preservedPath = path.join(this.config.targetDir, dirName);
      if (fs.existsSync(preservedPath)) {
        try {
          const files = fs.readdirSync(preservedPath).filter(file => {
            const filePath = path.join(preservedPath, file);
            return fs.statSync(filePath).isFile();
          });
          stats[dirName] = files.length;
        } catch (error) {
          stats[dirName] = 0;
        }
      } else {
        stats[dirName] = 0;
      }
    });

    return stats;
  }

  /**
   * Validate category directory structure
   */
  validateDirectoryStructure(): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    let valid = true;

    // Check if all category directories exist
    this.config.categories.forEach(category => {
      const categoryPath = this.getCategoryPath(category.name);
      if (!fs.existsSync(categoryPath)) {
        issues.push(`Missing category directory: ${categoryPath}`);
        valid = false;
      }
    });

    // Check if preserved directories exist
    this.config.preserveExisting.forEach(dirName => {
      const preservedPath = path.join(this.config.targetDir, dirName);
      if (!fs.existsSync(preservedPath)) {
        issues.push(`Missing preserved directory: ${preservedPath}`);
        valid = false;
      }
    });

    return { valid, issues };
  }
}