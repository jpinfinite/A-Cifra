#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Find all EPS files larger than specified size
 */
function findLargeEpsFiles(dir, maxSizeMB = 10, results = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findLargeEpsFiles(filePath, maxSizeMB, results);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.eps') {
        const sizeMB = stat.size / (1024 * 1024);
        if (sizeMB > maxSizeMB) {
          results.push({
            path: filePath,
            size: sizeMB,
            relativePath: path.relative(path.join(__dirname, '..', 'public'), filePath)
          });
        }
      }
    }
  }
  
  return results;
}

/**
 * Create a simple placeholder image info file
 */
function createPlaceholderInfo(originalPath, size) {
  const dir = path.dirname(originalPath);
  const name = path.basename(originalPath, '.eps');
  const infoPath = path.join(dir, `${name}_REMOVED.txt`);
  
  const info = `LARGE EPS FILE REMOVED
=====================

Original file: ${path.basename(originalPath)}
Original size: ${size.toFixed(2)} MB
Removed on: ${new Date().toISOString()}

Reason: EPS files are vector format and too large for web deployment.
This file exceeded the 25MB Cloudflare Pages limit.

To restore: Convert the original EPS to a web-friendly format like:
- WebP (recommended): Use online converter or ImageMagick
- PNG: For images with transparency
- JPEG: For photos without transparency

Suggested command (if you have ImageMagick):
magick "${path.basename(originalPath)}" -strip -quality 85 "${name}.webp"
`;

  fs.writeFileSync(infoPath, info);
  return infoPath;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Scanning for large EPS files...\n');
  
  const publicDir = path.join(__dirname, '..', 'public');
  const largeEpsFiles = findLargeEpsFiles(publicDir, 10); // Files > 10MB
  
  if (largeEpsFiles.length === 0) {
    console.log('✅ No large EPS files found!');
    return;
  }
  
  console.log(`Found ${largeEpsFiles.length} large EPS files:\n`);
  
  let totalSizeRemoved = 0;
  const removedFiles = [];
  
  largeEpsFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file.relativePath} (${file.size.toFixed(2)} MB)`);
  });
  
  console.log('\n🗑️  Removing large EPS files and creating info placeholders...\n');
  
  for (const file of largeEpsFiles) {
    try {
      // Create placeholder info file
      const infoPath = createPlaceholderInfo(file.path, file.size);
      console.log(`📝 Created info: ${path.relative(publicDir, infoPath)}`);
      
      // Remove the original EPS file
      fs.unlinkSync(file.path);
      console.log(`🗑️  Removed: ${file.relativePath} (${file.size.toFixed(2)} MB)`);
      
      totalSizeRemoved += file.size;
      removedFiles.push({
        original: file.relativePath,
        size: file.size,
        infoFile: path.relative(publicDir, infoPath)
      });
      
    } catch (error) {
      console.error(`❌ Error processing ${file.relativePath}:`, error.message);
    }
    
    console.log(''); // Empty line for readability
  }
  
  console.log('📊 Removal Summary:');
  console.log(`   Files removed: ${removedFiles.length}`);
  console.log(`   Total space freed: ${totalSizeRemoved.toFixed(2)} MB`);
  
  // Generate report
  const reportPath = path.join(__dirname, '..', 'logs', 'large-eps-removal-report.md');
  const reportContent = generateReport(removedFiles, totalSizeRemoved);
  
  // Ensure logs directory exists
  const logsDir = path.dirname(reportPath);
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  fs.writeFileSync(reportPath, reportContent);
  console.log(`\n📄 Report saved to: ${path.relative(process.cwd(), reportPath)}`);
  
  console.log('\n✅ Large EPS files have been removed!');
  console.log('\n🔧 Next steps:');
  console.log('   1. Run: npm run build');
  console.log('   2. Verify no files > 25MB: Get-ChildItem -Path "public" -Recurse -File | Where-Object { $_.Length -gt 25MB }');
  console.log('   3. Replace removed images with web-friendly alternatives');
  console.log('   4. Update image references in your code');
  console.log('   5. Test and deploy');
}

/**
 * Generate removal report
 */
function generateReport(removedFiles, totalSizeRemoved) {
  const timestamp = new Date().toISOString();
  
  let report = `# Large EPS Files Removal Report\n\n`;
  report += `**Generated:** ${timestamp}\n`;
  report += `**Files Removed:** ${removedFiles.length}\n`;
  report += `**Total Space Freed:** ${totalSizeRemoved.toFixed(2)} MB\n\n`;
  
  report += `## Removed Files\n\n`;
  
  removedFiles.forEach((file, index) => {
    report += `### ${index + 1}. ${file.original}\n`;
    report += `- **Size:** ${file.size.toFixed(2)} MB\n`;
    report += `- **Info File:** ${file.infoFile}\n`;
    report += `- **Reason:** EPS format too large for web deployment\n\n`;
  });
  
  report += `## Recommendations\n\n`;
  report += `### For each removed file, consider:\n\n`;
  report += `1. **Convert to WebP** (recommended):\n`;
  report += `   - Best compression for web\n`;
  report += `   - Supported by all modern browsers\n`;
  report += `   - Use online converters or ImageMagick\n\n`;
  
  report += `2. **Convert to PNG**:\n`;
  report += `   - If transparency is needed\n`;
  report += `   - Larger file size than WebP\n\n`;
  
  report += `3. **Convert to JPEG**:\n`;
  report += `   - For photographic content\n`;
  report += `   - No transparency support\n\n`;
  
  report += `### ImageMagick Commands:\n\n`;
  report += `\`\`\`bash\n`;
  report += `# Convert to WebP (recommended)\n`;
  report += `magick input.eps -strip -quality 85 output.webp\n\n`;
  report += `# Convert to PNG\n`;
  report += `magick input.eps -strip output.png\n\n`;
  report += `# Convert to JPEG\n`;
  report += `magick input.eps -strip -quality 85 output.jpg\n`;
  report += `\`\`\`\n\n`;
  
  report += `## Next Steps\n\n`;
  report += `1. Convert removed EPS files to web-friendly formats\n`;
  report += `2. Update image references in your code\n`;
  report += `3. Test the build locally: \`npm run build\`\n`;
  report += `4. Verify no files > 25MB remain\n`;
  report += `5. Commit and deploy the changes\n`;
  
  return report;
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { findLargeEpsFiles, createPlaceholderInfo };