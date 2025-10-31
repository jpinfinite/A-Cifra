/**
 * Image Organizer - Main Entry Point
 * 
 * This module exports all the components and provides a unified interface
 * for organizing images in the public/images directory.
 */

// Core types and configuration
export { ImageFile, ProcessingReport, CategoryConfig, OrganizerConfig } from './types';
export { getConfig, DEFAULT_CONFIG, CATEGORIES } from './config';

// Utility functions
export * from './utils';

// Core components
export { ImageAnalyzer } from './image-analyzer';
export { CategoryManager } from './category-manager';
export { FileRenamer } from './file-renamer';
export { DirectoryManager } from './directory-manager';
export { DuplicateDetector, DuplicateGroup } from './duplicate-detector';
export { CleanupManager, CleanupResult } from './cleanup-manager';
export { ReportGenerator } from './report-generator';
export { ErrorLogger, ErrorLevel, LogEntry, ErrorSummary } from './error-logger';
export { ValidationUtils, ValidationResult, DryRunResult, RollbackInfo } from './validation-utils';

// Main orchestrator
export { ImageOrganizer } from './image-organizer';

// Convenience function to create and run the organizer
import { ImageOrganizer } from './image-organizer';
import { getConfig } from './config';
import { OrganizerConfig } from './types';

/**
 * Quick start function to organize images with default configuration
 */
export async function organizeImages(configOverrides?: Partial<OrganizerConfig>): Promise<void> {
  const config = getConfig(configOverrides);
  const organizer = new ImageOrganizer(config);
  await organizer.organize();
}

/**
 * Create an organizer instance with custom configuration
 */
export function createOrganizer(configOverrides?: Partial<OrganizerConfig>): ImageOrganizer {
  const config = getConfig(configOverrides);
  return new ImageOrganizer(config);
}

/**
 * Perform a dry run to preview changes without making them
 */
export async function previewOrganization(configOverrides?: Partial<OrganizerConfig>): Promise<any> {
  const config = getConfig({ ...configOverrides, dryRun: true });
  const { ValidationUtils } = await import('./validation-utils');
  const validator = new ValidationUtils(config);
  return validator.performDryRun();
}

/**
 * Validate the current organization structure
 */
export async function validateStructure(configOverrides?: Partial<OrganizerConfig>): Promise<any> {
  const config = getConfig(configOverrides);
  const { ValidationUtils } = await import('./validation-utils');
  const validator = new ValidationUtils(config);
  return validator.validateOrganizedStructure();
}