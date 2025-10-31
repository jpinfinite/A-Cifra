#!/usr/bin/env ts-node

/**
 * Image Organization Script
 * 
 * Command-line interface for organizing images in the public/images directory.
 * This script provides various options for customizing the organization process.
 */

import * as path from 'path';
import { organizeImages, previewOrganization, validateStructure, createOrganizer } from './image-organizer/index';
import { OrganizerConfig } from './image-organizer/types';

// Command line argument parsing
interface CLIOptions {
  dryRun: boolean;
  preview: boolean;
  validate: boolean;
  sourceDir: string;
  targetDir: string;
  maxFilenameLength: number;
  help: boolean;
  verbose: boolean;
}

function parseArguments(): CLIOptions {
  const args = process.argv.slice(2);
  const options: CLIOptions = {
    dryRun: false,
    preview: false,
    validate: false,
    sourceDir: 'public/images',
    targetDir: 'public/images',
    maxFilenameLength: 50,
    help: false,
    verbose: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--dry-run':
      case '-d':
        options.dryRun = true;
        break;
        
      case '--preview':
      case '-p':
        options.preview = true;
        break;
        
      case '--validate':
      case '-v':
        options.validate = true;
        break;
        
      case '--source':
      case '-s':
        options.sourceDir = args[++i];
        break;
        
      case '--target':
      case '-t':
        options.targetDir = args[++i];
        break;
        
      case '--max-length':
      case '-l':
        options.maxFilenameLength = parseInt(args[++i]);
        break;
        
      case '--verbose':
        options.verbose = true;
        break;
        
      case '--help':
      case '-h':
        options.help = true;
        break;
        
      default:
        console.warn(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function showHelp(): void {
  console.log(`
Image Organization Tool

USAGE:
  ts-node scripts/organize-images.ts [OPTIONS]

OPTIONS:
  -d, --dry-run           Preview changes without making them
  -p, --preview           Show detailed preview of organization plan
  -v, --validate          Validate current organization structure
  -s, --source <dir>      Source directory (default: public/images)
  -t, --target <dir>      Target directory (default: public/images)
  -l, --max-length <num>  Maximum filename length (default: 50)
  --verbose               Enable verbose logging
  -h, --help              Show this help message

EXAMPLES:
  # Organize images with default settings
  ts-node scripts/organize-images.ts

  # Preview changes without making them
  ts-node scripts/organize-images.ts --dry-run

  # Show detailed preview
  ts-node scripts/organize-images.ts --preview

  # Validate current structure
  ts-node scripts/organize-images.ts --validate

  # Organize with custom source directory
  ts-node scripts/organize-images.ts --source /path/to/images

  # Organize with shorter filename limit
  ts-node scripts/organize-images.ts --max-length 30

CATEGORIES:
  The tool automatically categorizes images into:
  - bitcoin/     - Bitcoin-specific images
  - ethereum/    - Ethereum and smart contract images
  - altcoins/    - Alternative cryptocurrencies
  - defi/        - DeFi protocols and concepts
  - trading/     - Trading charts and analysis
  - staking/     - Staking and rewards content
  - security/    - Wallet security and protection
  - tutorials/   - Step-by-step guides
  - market/      - Market analysis and trends
  - general/     - General cryptocurrency content

PRESERVED DIRECTORIES:
  These directories are preserved and not reorganized:
  - articles/    - Article images
  - authors/     - Author photos
  - brand/       - Brand assets
  - icons/       - Icon files
  - logos/       - Logo files

REPORTS:
  After organization, detailed reports are generated in:
  - reports/image-organization-report-[timestamp].md
  - reports/image-organization-report-[timestamp].json
  - reports/error-report-[timestamp].md
  - logs/image-organizer-[timestamp].log
`);
}

async function main(): Promise<void> {
  const options = parseArguments();

  if (options.help) {
    showHelp();
    return;
  }

  // Build configuration from CLI options
  const config: Partial<OrganizerConfig> = {
    sourceDir: path.resolve(options.sourceDir),
    targetDir: path.resolve(options.targetDir),
    maxFilenameLength: options.maxFilenameLength,
    dryRun: options.dryRun
  };

  console.log('🖼️  Image Organization Tool');
  console.log('==========================');
  console.log(`Source: ${config.sourceDir}`);
  console.log(`Target: ${config.targetDir}`);
  console.log(`Max filename length: ${config.maxFilenameLength}`);
  console.log(`Mode: ${options.dryRun ? 'DRY RUN' : options.preview ? 'PREVIEW' : options.validate ? 'VALIDATE' : 'ORGANIZE'}`);
  console.log('');

  try {
    if (options.validate) {
      console.log('🔍 Validating current structure...');
      const validation = await validateStructure(config);
      
      console.log(`\n📊 Validation Results:`);
      console.log(`Status: ${validation.valid ? '✅ Valid' : '❌ Invalid'}`);
      
      if (validation.issues.length > 0) {
        console.log('\n❌ Issues:');
        validation.issues.forEach((issue: string) => console.log(`  - ${issue}`));
      }
      
      if (validation.warnings.length > 0) {
        console.log('\n⚠️ Warnings:');
        validation.warnings.forEach((warning: string) => console.log(`  - ${warning}`));
      }
      
      if (validation.suggestions.length > 0) {
        console.log('\n💡 Suggestions:');
        validation.suggestions.forEach((suggestion: string) => console.log(`  - ${suggestion}`));
      }
      
    } else if (options.preview) {
      console.log('👀 Generating preview...');
      const preview = await previewOrganization(config);
      
      console.log(`\n📊 Preview Results:`);
      console.log(`Files to process: ${preview.wouldProcess}`);
      console.log(`Files to move: ${preview.wouldMove}`);
      console.log(`Files to rename: ${preview.wouldRename}`);
      console.log(`Duplicates to remove: ${preview.wouldRemoveDuplicates}`);
      console.log(`Estimated space saved: ${(preview.estimatedSpaceSaved / 1024 / 1024).toFixed(2)} MB`);
      
      if (Object.keys(preview.categoryBreakdown).length > 0) {
        console.log('\n📁 Category Breakdown:');
        for (const [category, count] of Object.entries(preview.categoryBreakdown)) {
          console.log(`  - ${category}: ${count} files`);
        }
      }
      
      if (preview.potentialIssues.length > 0) {
        console.log('\n⚠️ Potential Issues:');
        preview.potentialIssues.forEach((issue: string) => console.log(`  - ${issue}`));
      }
      
    } else {
      // Full organization
      if (options.dryRun) {
        console.log('🧪 Running in DRY RUN mode - no files will be moved');
      }
      
      await organizeImages(config);
    }
    
  } catch (error) {
    console.error('\n❌ Error during execution:');
    console.error(error);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('\n💥 Uncaught Exception:');
  console.error(error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the main function
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}