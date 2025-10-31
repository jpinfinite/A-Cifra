#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const MAX_SIZE_MB = 10; // Maximum size in MB after compression
const QUALITY = 80; // WebP quality (0-100)
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

/**
 * Convert bytes to MB
 */
function bytesToMB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2);
}

/**
 * Get file size in MB
 */
function getFileSizeMB(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size / (1024 * 1024);
}

/**
 * Compress and convert image to WebP
 */
async function compressImage(inputPath) {
  try {
    const ext = path.extname(inputPath).toLowerCase();
    const dir = path.dirname(inputPath);
    const name = path.basename(inputPath, ext);
    const outputPath = path.join(dir, `${name}.webp`);
    
    console.log(`🔄 Converting: ${path.relative(PUBLIC_DIR, inputPath)}`);
    console.log(`   Original size: ${getFileSizeMB(inputPath).toFixed(2)} MB`);
    
    // Convert to WebP with compression
    await sharp(inputPath)
      .webp({ 
        quality: QUALITY,
        effort: 6 // Higher effort for better compression
      })
      .toFile(outputPath);
    
    const newSize = getFileSizeMB(outputPath);
    console.log(`   New size: ${newSize.toFixed(2)} MB`);
    console.log(`   Saved: ${(getFileSizeMB(inputPath) - newSize).toFixed(2)} MB`);
    
    // Remove original file
    fs.unlinkSync(inputPath);
    console.log(`✅ Converted: ${path.relative(PUBLIC_DIR, outputPath)}`);
    
    return {
      original: inputPath,
      converted: outputPath,
      originalSize: getFileSizeMB(inputPath),
      newSize: newSize,
      saved: getFileSizeMB(inputPath) - newSize
    };
    
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error.message);
    return null;
  }
}

/**
 * Find all large image files
 */
function findLargeImages(dir, results = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findLargeImages(filePath, results);
    } else {
      const ext = path.extname(file).toLowerCase();
      const supportedFormats = ['.eps', '.png', '.jpg', '.jpeg', '.tiff', '.tif', '.bmp'];
      
      if (supportedFormats.includes(ext)) {
        const sizeMB = stat.size / (1024 * 1024);
        if (sizeMB > MAX_SIZE_MB) {
          results.push({
            path: filePath,
            size: sizeMB,
            ext: ext
          });
        }
      }
    }
  }
  
  return results;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Scanning for large image files...\n');
  
  const largeFiles = findLargeImages(PUBLIC_DIR);
  
  if (largeFiles.length === 0) {
    console.log('✅ No large image files found!');
    return;
  }
  
  console.log(`Found ${largeFiles.length} large image files:\n`);
  
  largeFiles.forEach(file => {
    console.log(`📁 ${path.relative(PUBLIC_DIR, file.path)} (${file.size.toFixed(2)} MB)`);
  });
  
  console.log('\n🚀 Starting compression...\n');
  
  const results = [];
  let totalSaved = 0;
  
  for (const file of largeFiles) {
    const result = await compressImage(file.path);
    if (result) {
      results.push(result);
      totalSaved += result.saved;
    }
    console.log(''); // Empty line for readability
  }
  
  console.log('📊 Compression Summary:');
  console.log(`   Files processed: ${results.length}`);
  console.log(`   Total space saved: ${totalSaved.toFixed(2)} MB`);
  console.log('\n✅ All large assets have been optimized!');
  
  // Generate report
  const reportPath = path.join(__dirname, '..', 'logs', 'asset-compression-report.md');
  const reportContent = generateReport(results, totalSaved);
  
  // Ensure logs directory exists
  const logsDir = path.dirname(reportPath);
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  fs.writeFileSync(reportPath, reportContent);
  console.log(`📄 Report saved to: ${path.relative(process.cwd(), reportPath)}`);
}

/**
 * Generate compression report
 */
function generateReport(results, totalSaved) {
  const timestamp = new Date().toISOString();
  
  let report = `# Asset Compression Report\n\n`;
  report += `**Generated:** ${timestamp}\n`;
  report += `**Files Processed:** ${results.length}\n`;
  report += `**Total Space Saved:** ${totalSaved.toFixed(2)} MB\n\n`;
  
  report += `## Processed Files\n\n`;
  
  results.forEach((result, index) => {
    const originalName = path.relative(PUBLIC_DIR, result.original);
    const convertedName = path.relative(PUBLIC_DIR, result.converted);
    
    report += `### ${index + 1}. ${originalName}\n`;
    report += `- **Original Size:** ${result.originalSize.toFixed(2)} MB\n`;
    report += `- **New Size:** ${result.newSize.toFixed(2)} MB\n`;
    report += `- **Space Saved:** ${result.saved.toFixed(2)} MB\n`;
    report += `- **Converted To:** ${convertedName}\n\n`;
  });
  
  report += `## Next Steps\n\n`;
  report += `1. Update image references in your code to use the new .webp files\n`;
  report += `2. Test the build locally: \`npm run build\`\n`;
  report += `3. Verify no files > 25MB remain: \`Get-ChildItem -Path "public" -Recurse -File | Where-Object { $_.Length -gt 25MB }\`\n`;
  report += `4. Commit and deploy the changes\n`;
  
  return report;
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { compressImage, findLargeImages };