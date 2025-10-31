import * as path from 'path';
import { sanitizeFilename, truncateFilename, makeUniqueFilename } from './utils';

/**
 * File Renamer - Generates descriptive, SEO-friendly filenames
 */

export class FileRenamer {
  private maxFilenameLength: number;

  constructor(maxFilenameLength: number = 50) {
    this.maxFilenameLength = maxFilenameLength;
  }

  /**
   * Convert text to kebab-case format
   */
  toKebabCase(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Remove special characters and emojis from filename
   */
  removeSpecialCharacters(filename: string): string {
    // Remove emojis and special Unicode characters
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    
    return filename
      .replace(emojiRegex, '') // Remove emojis
      .replace(/[^\w\s.-]/g, '') // Keep only word characters, spaces, dots, hyphens
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  }

  /**
   * Extract meaningful keywords from filename for descriptive naming
   */
  extractMeaningfulKeywords(filename: string): string[] {
    const nameWithoutExt = path.basename(filename, path.extname(filename));
    const cleaned = this.removeSpecialCharacters(nameWithoutExt);
    
    // Split by common separators and filter meaningful words
    const words = cleaned
      .toLowerCase()
      .split(/[\s_\-\.]+/)
      .filter(word => {
        // Filter out very short words, numbers only, and common meaningless terms
        if (word.length < 2) return false;
        if (/^\d+$/.test(word)) return false;
        
        const meaninglessWords = ['img', 'image', 'pic', 'photo', 'file', 'new', 'final', 'copy', 'temp'];
        if (meaninglessWords.includes(word)) return false;
        
        return true;
      });

    return words;
  }

  /**
   * Generate context-aware descriptive name based on category and content
   */
  generateContextualName(filename: string, category: string): string {
    const keywords = this.extractMeaningfulKeywords(filename);
    const extension = path.extname(filename);
    
    // Define category-specific naming patterns
    const categoryPatterns: { [key: string]: string[] } = {
      bitcoin: ['bitcoin', 'btc', 'cryptocurrency', 'digital-currency'],
      ethereum: ['ethereum', 'eth', 'smart-contract', 'blockchain'],
      altcoins: ['altcoin', 'cryptocurrency', 'digital-asset'],
      defi: ['defi', 'decentralized-finance', 'yield-farming'],
      trading: ['crypto-trading', 'exchange', 'market-analysis'],
      staking: ['crypto-staking', 'rewards', 'validation'],
      security: ['crypto-security', 'wallet', 'protection'],
      tutorials: ['crypto-tutorial', 'guide', 'how-to'],
      market: ['crypto-market', 'analysis', 'trends'],
      general: ['cryptocurrency', 'blockchain', 'digital-asset']
    };

    let descriptiveParts: string[] = [];

    // Add category context if not already present in keywords
    const categoryKeywords = categoryPatterns[category] || [];
    const hasContextInKeywords = keywords.some(keyword => 
      categoryKeywords.some(catKeyword => 
        keyword.includes(catKeyword.replace('-', '')) || catKeyword.includes(keyword)
      )
    );

    if (!hasContextInKeywords && category !== 'general') {
      descriptiveParts.push(category);
    }

    // Add meaningful keywords
    descriptiveParts.push(...keywords.slice(0, 3)); // Limit to first 3 meaningful keywords

    // If no meaningful keywords found, use category-specific defaults
    if (descriptiveParts.length === 0 || (descriptiveParts.length === 1 && descriptiveParts[0] === category)) {
      const defaultName = this.generateDefaultName(filename, category);
      return defaultName;
    }

    // Join parts and convert to kebab-case
    const descriptiveName = this.toKebabCase(descriptiveParts.join(' '));
    
    return descriptiveName + extension;
  }

  /**
   * Generate default name for files with no meaningful keywords
   */
  private generateDefaultName(filename: string, category: string): string {
    const extension = path.extname(filename);
    const nameWithoutExt = path.basename(filename, extension);
    
    // Extract any numbers or identifiers
    const numbers = nameWithoutExt.match(/\d+/g);
    const identifier = numbers ? numbers.join('-') : 'image';
    
    return `${category}-${identifier}${extension}`;
  }

  /**
   * Enhance filename with SEO-friendly terms
   */
  addSEOTerms(filename: string, category: string): string {
    const nameWithoutExt = path.basename(filename, path.extname(filename));
    const extension = path.extname(filename);
    
    // Define SEO terms for each category
    const seoTerms: { [key: string]: string[] } = {
      bitcoin: ['bitcoin', 'btc', 'cryptocurrency'],
      ethereum: ['ethereum', 'eth', 'blockchain'],
      altcoins: ['altcoin', 'cryptocurrency'],
      defi: ['defi', 'decentralized-finance'],
      trading: ['crypto-trading', 'exchange'],
      staking: ['crypto-staking', 'rewards'],
      security: ['crypto-wallet', 'security'],
      tutorials: ['crypto-guide', 'tutorial'],
      market: ['crypto-market', 'analysis'],
      general: ['cryptocurrency', 'crypto']
    };

    const terms = seoTerms[category] || seoTerms.general;
    const hasRelevantTerm = terms.some(term => 
      nameWithoutExt.toLowerCase().includes(term.replace('-', ''))
    );

    if (!hasRelevantTerm) {
      return `${terms[0]}-${nameWithoutExt}${extension}`;
    }

    return filename;
  }

  /**
   * Handle filename length limits
   */
  enforceFilenameLength(filename: string): string {
    return truncateFilename(filename, this.maxFilenameLength);
  }

  /**
   * Ensure filename uniqueness in target directory
   */
  ensureUniqueness(targetDir: string, filename: string): string {
    return makeUniqueFilename(targetDir, filename);
  }

  /**
   * Main method to generate a complete descriptive filename
   */
  generateDescriptiveFilename(
    originalFilename: string, 
    category: string, 
    targetDir: string
  ): string {
    // Step 1: Generate contextual name
    let descriptiveName = this.generateContextualName(originalFilename, category);
    
    // Step 2: Add SEO terms if needed
    descriptiveName = this.addSEOTerms(descriptiveName, category);
    
    // Step 3: Sanitize the filename
    const nameWithoutExt = path.basename(descriptiveName, path.extname(descriptiveName));
    const extension = path.extname(descriptiveName);
    const sanitized = sanitizeFilename(nameWithoutExt) + extension;
    
    // Step 4: Enforce length limits
    const lengthLimited = this.enforceFilenameLength(sanitized);
    
    // Step 5: Ensure uniqueness
    const uniqueFilename = this.ensureUniqueness(targetDir, lengthLimited);
    
    return uniqueFilename;
  }

  /**
   * Batch rename files with progress tracking
   */
  batchRename(
    files: Array<{ path: string; category: string; targetDir: string }>,
    progressCallback?: (current: number, total: number, filename: string) => void
  ): Array<{ original: string; renamed: string; category: string }> {
    const results: Array<{ original: string; renamed: string; category: string }> = [];
    
    files.forEach((file, index) => {
      const originalName = path.basename(file.path);
      const renamedName = this.generateDescriptiveFilename(originalName, file.category, file.targetDir);
      
      results.push({
        original: originalName,
        renamed: renamedName,
        category: file.category
      });

      if (progressCallback) {
        progressCallback(index + 1, files.length, originalName);
      }
    });

    return results;
  }
}