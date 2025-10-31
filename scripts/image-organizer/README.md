# Image Organization System

A comprehensive TypeScript-based system for automatically organizing, categorizing, and cleaning up image files. This system analyzes image filenames, categorizes them by content, removes duplicates, and generates descriptive SEO-friendly filenames.

## Features

- **Automatic Categorization**: Intelligently categorizes images based on filename analysis
- **Descriptive Renaming**: Generates SEO-friendly, descriptive filenames in kebab-case
- **Duplicate Detection**: Identifies and removes duplicate images, keeping the highest quality version
- **Cleanup Operations**: Handles corrupted files and non-web-optimized formats
- **Comprehensive Reporting**: Generates detailed reports of all operations
- **Dry Run Mode**: Preview changes before applying them
- **Rollback Support**: Ability to undo changes if needed
- **Error Logging**: Detailed error tracking and reporting

## Categories

The system automatically categorizes images into the following directories:

- **bitcoin/** - Bitcoin-specific images and content
- **ethereum/** - Ethereum, smart contracts, and ETH 2.0 content
- **altcoins/** - Alternative cryptocurrencies (Dogecoin, Litecoin, etc.)
- **defi/** - DeFi protocols, yield farming, and decentralized finance
- **trading/** - Trading charts, analysis, and exchange content
- **staking/** - Staking, rewards, and validation content
- **security/** - Wallet security, protection guides, and safety
- **tutorials/** - Step-by-step guides and educational content
- **market/** - Market analysis, trends, and forecasts
- **general/** - General cryptocurrency and blockchain content

### Preserved Directories

These existing directories are preserved and not reorganized:
- **articles/** - Article images
- **authors/** - Author photos
- **brand/** - Brand assets
- **icons/** - Icon files
- **logos/** - Logo files

## Installation

1. Ensure you have Node.js and TypeScript installed
2. Install dependencies (if any)
3. The system is ready to use

## Usage

### Command Line Interface

```bash
# Basic organization with default settings
ts-node scripts/organize-images.ts

# Preview changes without making them
ts-node scripts/organize-images.ts --dry-run

# Show detailed preview
ts-node scripts/organize-images.ts --preview

# Validate current structure
ts-node scripts/organize-images.ts --validate

# Custom source directory
ts-node scripts/organize-images.ts --source /path/to/images

# Custom filename length limit
ts-node scripts/organize-images.ts --max-length 30
```

### Programmatic Usage

```typescript
import { organizeImages, previewOrganization, validateStructure } from './image-organizer';

// Basic organization
await organizeImages();

// With custom configuration
await organizeImages({
  sourceDir: 'custom/images',
  targetDir: 'organized/images',
  maxFilenameLength: 40,
  dryRun: false
});

// Preview changes
const preview = await previewOrganization();
console.log(`Would process ${preview.wouldProcess} files`);

// Validate structure
const validation = await validateStructure();
console.log(`Structure is ${validation.valid ? 'valid' : 'invalid'}`);
```

## Configuration

The system can be configured through the `OrganizerConfig` interface:

```typescript
interface OrganizerConfig {
  sourceDir: string;           // Source directory to organize
  targetDir: string;           // Target directory for organized files
  categories: CategoryConfig[]; // Category definitions
  preserveExisting: string[];  // Directories to preserve
  maxFilenameLength: number;   // Maximum filename length
  dryRun: boolean;            // Preview mode without changes
}
```

## Architecture

The system follows a modular architecture:

```
Image Organizer
├── Image Analyzer (content detection)
├── Category Manager (directory structure)
├── File Renamer (descriptive naming)
├── Directory Manager (file operations)
├── Duplicate Detector (content hashing)
├── Cleanup Manager (duplicate removal)
├── Report Generator (comprehensive reporting)
├── Error Logger (error tracking)
└── Validation Utils (testing and rollback)
```

## File Naming Convention

The system generates descriptive filenames following these rules:

- **Format**: kebab-case (lowercase with hyphens)
- **Structure**: `category-description-identifier.extension`
- **Length**: Limited to configurable maximum (default: 50 characters)
- **Characters**: Only alphanumeric characters and hyphens
- **Uniqueness**: Automatic numeric suffixes for conflicts

### Examples

- `bitcoin_symbol_2_work.jpg` → `bitcoin-symbol-work.jpg`
- `ethereum_coin_cryptocurrency_trader_looking.png` → `ethereum-coin-cryptocurrency-trader.png`
- `2474876.ai` → `general-2474876.ai`
- `🚀 Подписывайся на наш Telegram-канал.jpg` → `general-telegram-channel.jpg`

## Duplicate Detection

The system uses multiple methods to identify duplicates:

1. **Content Hashing**: MD5 hash comparison for exact duplicates
2. **Size Comparison**: Similar file sizes for potential duplicates
3. **Quality Scoring**: Prioritizes higher quality versions
4. **Format Preference**: Prefers web-optimized formats (PNG, JPG, WebP)

## Reports

After organization, the system generates several reports:

### Main Report (`image-organization-report-[timestamp].md`)
- Processing statistics
- File movements
- Category breakdown
- Error summary
- Recommendations

### JSON Report (`image-organization-report-[timestamp].json`)
- Machine-readable version of the main report
- Detailed operation logs
- Programmatic access to results

### Error Report (`error-report-[timestamp].md`)
- Detailed error analysis
- Critical error tracking
- Troubleshooting information

### Log Files (`logs/image-organizer-[timestamp].log`)
- Real-time operation logs
- Debug information
- Progress tracking

## Error Handling

The system includes comprehensive error handling:

- **File Access Errors**: Logged and skipped
- **Permission Issues**: Detailed error reporting
- **Corrupted Files**: Moved to `invalid/` directory
- **Naming Conflicts**: Automatic resolution with suffixes
- **Critical Errors**: Full stack traces and rollback information

## Rollback Support

The system supports rolling back changes:

```typescript
// Rollback information is automatically created
const rollbackInfo = validator.createRollbackInfo(operations);

// Execute rollback if needed
const result = validator.executeRollback(rollbackInfo.rollbackPath);
```

## Validation and Testing

### Dry Run Mode
Preview all changes without making them:

```bash
ts-node scripts/organize-images.ts --dry-run
```

### Structure Validation
Validate the organized structure:

```bash
ts-node scripts/organize-images.ts --validate
```

### Preview Mode
Get detailed preview of organization plan:

```bash
ts-node scripts/organize-images.ts --preview
```

## Performance Considerations

- **Memory Usage**: Caching is used efficiently and cleared after processing
- **Large Collections**: Progress tracking and batch processing for large image sets
- **Disk Space**: Pre-flight checks ensure sufficient space
- **Concurrent Operations**: Safe file operations with proper error handling

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Ensure read/write permissions on source and target directories
   - Run with appropriate user privileges

2. **Out of Disk Space**
   - Check available disk space before running
   - Use `--preview` to estimate space requirements

3. **Corrupted Files**
   - Check the `invalid/` directory for problematic files
   - Review error reports for specific issues

4. **Naming Conflicts**
   - The system automatically resolves conflicts with numeric suffixes
   - Check reports for renamed files

### Debug Mode

Enable verbose logging for troubleshooting:

```bash
ts-node scripts/organize-images.ts --verbose
```

## Contributing

The system is modular and extensible. To add new features:

1. **New Categories**: Update the `CATEGORIES` configuration
2. **Custom Analyzers**: Extend the `ImageAnalyzer` class
3. **Additional Formats**: Update the `isImageFile` utility
4. **New Reports**: Extend the `ReportGenerator` class

## License

This project is part of the image organization system and follows the same licensing terms as the parent project.