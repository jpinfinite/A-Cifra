/**
 * Core interfaces for the Image Organization System
 */

export interface ImageFile {
  originalPath: string;
  originalName: string;
  extension: string;
  size: number;
  hash: string;
  suggestedCategory: string;
  suggestedName: string;
  newPath: string;
  processed: boolean;
  error?: string;
}

export interface ProcessingReport {
  timestamp: string;
  totalFiles: number;
  processedFiles: number;
  movedFiles: number;
  renamedFiles: number;
  removedDuplicates: number;
  errors: string[];
  fileMovements: Array<{
    from: string;
    to: string;
    category: string;
  }>;
}

export interface CategoryConfig {
  name: string;
  keywords: string[];
  priority: number;
}

export interface OrganizerConfig {
  sourceDir: string;
  targetDir: string;
  categories: CategoryConfig[];
  preserveExisting: string[];
  maxFilenameLength: number;
  dryRun: boolean;
}