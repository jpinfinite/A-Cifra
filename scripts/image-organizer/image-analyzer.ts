import * as path from 'path';
import { CategoryConfig } from './types';
import { sanitizeFilename, truncateFilename } from './utils';

/**
 * Image Analyzer - Analyzes filenames and content to determine category and descriptive names
 */

export class ImageAnalyzer {
  private categories: CategoryConfig[];

  constructor(categories: CategoryConfig[]) {
    this.categories = categories.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Extract keywords from filename for analysis
   */
  extractKeywords(filename: string): string[] {
    const nameWithoutExt = path.basename(filename, path.extname(filename));
    
    // Convert to lowercase and split by common separators
    const keywords = nameWithoutExt
      .toLowerCase()
      .replace(/[_\-\s\.]+/g, ' ')
      .split(' ')
      .filter(word => word.length > 2); // Filter out very short words
    
    return keywords;
  }

  /**
   * Detect cryptocurrency and trading terms in filename
   */
  detectCryptoTerms(filename: string): string[] {
    const text = filename.toLowerCase();
    const cryptoTerms: string[] = [];
    
    // Bitcoin terms
    if (text.includes('bitcoin') || text.includes('btc')) cryptoTerms.push('bitcoin');
    if (text.includes('satoshi') || text.includes('nakamoto')) cryptoTerms.push('bitcoin');
    if (text.includes('mining') || text.includes('hash')) cryptoTerms.push('bitcoin');
    
    // Ethereum terms
    if (text.includes('ethereum') || text.includes('eth')) cryptoTerms.push('ethereum');
    if (text.includes('vitalik') || text.includes('smart')) cryptoTerms.push('ethereum');
    if (text.includes('erc20') || text.includes('gas')) cryptoTerms.push('ethereum');
    
    // Altcoins
    if (text.includes('dogecoin') || text.includes('doge')) cryptoTerms.push('altcoins');
    if (text.includes('litecoin') || text.includes('ltc')) cryptoTerms.push('altcoins');
    if (text.includes('ripple') || text.includes('xrp')) cryptoTerms.push('altcoins');
    if (text.includes('cardano') || text.includes('ada')) cryptoTerms.push('altcoins');
    if (text.includes('solana') || text.includes('sol')) cryptoTerms.push('altcoins');
    
    // DeFi terms
    if (text.includes('defi') || text.includes('decentralized')) cryptoTerms.push('defi');
    if (text.includes('yield') || text.includes('farming')) cryptoTerms.push('defi');
    if (text.includes('liquidity') || text.includes('pool')) cryptoTerms.push('defi');
    if (text.includes('swap') || text.includes('uniswap')) cryptoTerms.push('defi');
    
    // Trading terms
    if (text.includes('trading') || text.includes('trade')) cryptoTerms.push('trading');
    if (text.includes('exchange') || text.includes('bitget')) cryptoTerms.push('trading');
    if (text.includes('chart') || text.includes('analysis')) cryptoTerms.push('trading');
    if (text.includes('candlestick') || text.includes('volume')) cryptoTerms.push('trading');
    
    // Staking terms
    if (text.includes('staking') || text.includes('stake')) cryptoTerms.push('staking');
    if (text.includes('reward') || text.includes('validator')) cryptoTerms.push('staking');
    
    // Security/Wallet terms
    if (text.includes('wallet') || text.includes('metamask')) cryptoTerms.push('security');
    if (text.includes('security') || text.includes('private')) cryptoTerms.push('security');
    if (text.includes('seed') || text.includes('phrase')) cryptoTerms.push('security');
    
    // Tutorial terms
    if (text.includes('tutorial') || text.includes('guide')) cryptoTerms.push('tutorials');
    if (text.includes('how') || text.includes('step')) cryptoTerms.push('tutorials');
    if (text.includes('learn') || text.includes('education')) cryptoTerms.push('tutorials');
    
    // Market terms
    if (text.includes('market') || text.includes('bull')) cryptoTerms.push('market');
    if (text.includes('bear') || text.includes('trend')) cryptoTerms.push('market');
    if (text.includes('forecast') || text.includes('prediction')) cryptoTerms.push('market');
    
    // General crypto terms
    if (text.includes('crypto') || text.includes('blockchain')) cryptoTerms.push('general');
    if (text.includes('digital') || text.includes('currency')) cryptoTerms.push('general');
    if (text.includes('coin') || text.includes('token')) cryptoTerms.push('general');
    
    return [...new Set(cryptoTerms)]; // Remove duplicates
  }

  /**
   * Determine the best category for an image based on filename analysis
   */
  categorizeImage(filename: string): string {
    const keywords = this.extractKeywords(filename);
    const cryptoTerms = this.detectCryptoTerms(filename);
    const allTerms = [...keywords, ...cryptoTerms];
    
    // Find the highest priority category that matches
    for (const category of this.categories) {
      const hasMatch = category.keywords.some(keyword => 
        allTerms.some(term => term.includes(keyword) || keyword.includes(term))
      );
      
      if (hasMatch) {
        return category.name;
      }
    }
    
    // Default to general if no specific category found
    return 'general';
  }

  /**
   * Generate a descriptive filename based on content analysis
   */
  generateDescriptiveName(filename: string, category: string): string {
    const nameWithoutExt = path.basename(filename, path.extname(filename));
    const extension = path.extname(filename);
    
    // Clean the original filename
    let descriptiveName = sanitizeFilename(nameWithoutExt);
    
    // If the name is just numbers or very generic, enhance it with category context
    if (/^\d+$/.test(descriptiveName) || descriptiveName.length < 5) {
      const cryptoTerms = this.detectCryptoTerms(filename);
      if (cryptoTerms.length > 0) {
        descriptiveName = `${category}-${cryptoTerms[0]}-${descriptiveName}`;
      } else {
        descriptiveName = `${category}-${descriptiveName}`;
      }
    }
    
    // Add category prefix if not already present
    if (!descriptiveName.includes(category) && category !== 'general') {
      descriptiveName = `${category}-${descriptiveName}`;
    }
    
    // Truncate if too long
    const fullName = descriptiveName + extension;
    return truncateFilename(fullName, 50);
  }

  /**
   * Analyze an image file and return category and suggested name
   */
  analyzeImage(filePath: string): { category: string; suggestedName: string } {
    const filename = path.basename(filePath);
    const category = this.categorizeImage(filename);
    const suggestedName = this.generateDescriptiveName(filename, category);
    
    return {
      category,
      suggestedName
    };
  }
}