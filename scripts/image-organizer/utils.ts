import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

/**
 * Utility functions for file operations
 */

export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function getFileHash(filePath: string): string {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('md5');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  } catch (error) {
    console.error(`Error generating hash for ${filePath}:`, error);
    return '';
  }
}

export function getFileSize(filePath: string): number {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    console.error(`Error getting file size for ${filePath}:`, error);
    return 0;
  }
}

export function isImageFile(filename: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.eps', '.ai'];
  const ext = path.extname(filename).toLowerCase();
  return imageExtensions.includes(ext);
}

export function sanitizeFilename(filename: string): string {
  // Remove special characters and emojis, convert to kebab-case
  return filename
    .replace(/[^\w\s.-]/g, '') // Remove special chars except word chars, spaces, dots, hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .toLowerCase();
}

export function truncateFilename(filename: string, maxLength: number = 50): string {
  const ext = path.extname(filename);
  const nameWithoutExt = path.basename(filename, ext);
  
  if (filename.length <= maxLength) {
    return filename;
  }
  
  const maxNameLength = maxLength - ext.length;
  return nameWithoutExt.substring(0, maxNameLength) + ext;
}

export function makeUniqueFilename(basePath: string, filename: string): string {
  let counter = 1;
  let uniqueFilename = filename;
  const ext = path.extname(filename);
  const nameWithoutExt = path.basename(filename, ext);
  
  while (fs.existsSync(path.join(basePath, uniqueFilename))) {
    uniqueFilename = `${nameWithoutExt}-${counter}${ext}`;
    counter++;
  }
  
  return uniqueFilename;
}

export function moveFile(sourcePath: string, targetPath: string): boolean {
  try {
    ensureDirectoryExists(path.dirname(targetPath));
    fs.renameSync(sourcePath, targetPath);
    return true;
  } catch (error) {
    console.error(`Error moving file from ${sourcePath} to ${targetPath}:`, error);
    return false;
  }
}

export function copyFile(sourcePath: string, targetPath: string): boolean {
  try {
    ensureDirectoryExists(path.dirname(targetPath));
    fs.copyFileSync(sourcePath, targetPath);
    return true;
  } catch (error) {
    console.error(`Error copying file from ${sourcePath} to ${targetPath}:`, error);
    return false;
  }
}

export function deleteFile(filePath: string): boolean {
  try {
    fs.unlinkSync(filePath);
    return true;
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
    return false;
  }
}

export function getAllFiles(dirPath: string, recursive: boolean = true): string[] {
  const files: string[] = [];
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory() && recursive) {
        files.push(...getAllFiles(fullPath, recursive));
      } else if (stats.isFile() && isImageFile(item)) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }
  
  return files;
}