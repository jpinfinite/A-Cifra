#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Find and replace image references in files
 */
function updateImageReferences(dir, replacements) {
  const files = fs.readdirSync(dir);
  let updatedFiles = [];
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      updatedFiles = updatedFiles.concat(updateImageReferences(filePath, replacements));
    } else {
      const ext = path.extname(file).toLowerCase();
      const textFiles = ['.js', '.jsx', '.ts', '.tsx', '.md', '.mdx', '.json'];
      
      if (textFiles.includes(ext)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;
        
        replacements.forEach(replacement => {
          const oldPath = replacement.old.replace(/\\/g, '/'); // Normalize path separators
          const newPath = replacement.new.replace(/\\/g, '/');
          
          // Multiple patterns to catch different ways images might be referenced
          const patterns = [
            new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            new RegExp(oldPath.replace('public/', '/'), 'g'),
            new RegExp(oldPath.replace('public/', ''), 'g'),
          ];
          
          patterns.forEach(pattern => {
            if (pattern.test(content)) {
              content = content.replace(pattern, newPath.replace('public/', '/'));
              hasChanges = true;
            }
          });
        });
        
        if (hasChanges) {
          fs.writeFileSync(filePath, content);
          updatedFiles.push(filePath);
        }
      }
    }
  }
  
  return updatedFiles;
}

/**
 * Scan for converted images and create replacement map
 */
function findConvertedImages() {
  const publicDir = path.join(__dirname, '..', 'public');
  const replacements = [];
  
  function scanDir(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDir(filePath);
      } else {
        const ext = path.extname(file).toLowerCase();
        if (ext === '.webp') {
          const baseName = path.basename(file, '.webp');
          const dirPath = path.dirname(filePath);
          
          // Check if there might have been an original with different extension
          const possibleOriginals = ['.eps', '.png', '.jpg', '.jpeg', '.tiff', '.tif'];
          
          possibleOriginals.forEach(origExt => {
            const originalPath = path.join(dirPath, baseName + origExt);
            if (!fs.existsSync(originalPath)) {
              // This WebP might be a converted file
              replacements.push({
                old: path.relative(publicDir, originalPath),
                new: path.relative(publicDir, filePath)
              });
            }
          });
        }
      }
    }
  }
  
  scanDir(publicDir);
  return replacements;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Scanning for converted images...\n');
  
  const replacements = findConvertedImages();
  
  if (replacements.length === 0) {
    console.log('ℹ️  No converted images found to update references for.');
    return;
  }
  
  console.log(`Found ${replacements.length} potential image conversions:\n`);
  replacements.forEach(r => {
    console.log(`📝 ${r.old} → ${r.new}`);
  });
  
  console.log('\n🔄 Updating image references in code...\n');
  
  const srcDir = path.join(__dirname, '..', 'src');
  const updatedFiles = updateImageReferences(srcDir, replacements);
  
  if (updatedFiles.length > 0) {
    console.log(`✅ Updated ${updatedFiles.length} files:`);
    updatedFiles.forEach(file => {
      console.log(`   📄 ${path.relative(process.cwd(), file)}`);
    });
  } else {
    console.log('ℹ️  No files needed updating.');
  }
  
  console.log('\n✅ Image reference update complete!');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { updateImageReferences, findConvertedImages };