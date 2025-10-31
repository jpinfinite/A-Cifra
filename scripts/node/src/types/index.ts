/**
 * Tipos e interfaces para o sistema de reorganização de projetos A-Cifra
 */

export interface OperationLogEntry {
  timestamp: Date;
  operation: string;
  source: string;
  destination?: string;
  status: 'started' | 'completed' | 'failed' | 'rolled_back';
  checksum?: string;
  dryRun: boolean;
  details: string;
  userId?: string;
}

export interface FileIntegrityRecord {
  filePath: string;
  checksum: string;
  algorithm: 'md5' | 'sha1' | 'sha256';
  size: number;
  lastModified: Date;
  verified: boolean;
}

export interface StructureValidationResult {
  isValid: boolean;
  violations: StructureViolation[];
  suggestions: string[];
  score: number; // 0-100
}

export interface StructureViolation {
  type: 'naming' | 'location' | 'missing' | 'unexpected';
  path: string;
  expected: string;
  actual: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ScriptConfiguration {
  logging: LoggingConfig;
  backup: BackupConfig;
  validation: ValidationConfig;
  dryRun: DryRunConfig;
  notifications: NotificationConfig;
  projectStructure: ProjectStructureConfig;
  namingConventions: NamingConventionsConfig;
}

export interface LoggingConfig {
  enabled: boolean;
  level: 'debug' | 'info' | 'warn' | 'error';
  outputPath: string;
  maxFileSize: string;
  retentionDays: number;
}

export interface BackupConfig {
  enabled: boolean;
  retentionDays: number;
  compressionEnabled: boolean;
  backupPath: string;
}

export interface ValidationConfig {
  checksumAlgorithm: 'md5' | 'sha1' | 'sha256';
  verifyBeforeOperation: boolean;
  verifyAfterOperation: boolean;
}

export interface DryRunConfig {
  defaultMode: boolean;
  confirmationRequired: boolean;
}

export interface NotificationConfig {
  enabled: boolean;
  email: {
    enabled: boolean;
    recipients: string[];
  };
  slack: {
    enabled: boolean;
    webhook: string;
  };
}

export interface ProjectStructureConfig {
  assetsPath: string;
  imagesPath: string;
  scriptsPath: string;
  docsPath: string;
}

export interface NamingConventionsConfig {
  imagePattern: string;
  altTextPattern: string;
  enforceConventions: boolean;
}

export interface MoveImagesOptions {
  dryRun?: boolean;
  sourcePath?: string;
  backupBeforeMove?: boolean;
}

export interface MoveImagesStats {
  filesProcessed: number;
  filesMovedOrCopied: number;
  directoriesCreated: number;
  errors: number;
  skipped: number;
  startTime: Date;
  endTime?: Date;
  totalDuration?: number;
}

export interface BackupOptions {
  sourcePath: string;
  backupName?: string;
  compressionLevel?: number;
}

export interface ValidationOptions {
  filePath: string;
  expectedChecksum?: string;
  algorithm?: 'md5' | 'sha1' | 'sha256';
}

export interface ReportOptions {
  operationName: string;
  statistics?: Record<string, any>;
  outputPath?: string;
}

export type ImageCategory = 'articles' | 'brand' | 'icons' | 'logos';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';