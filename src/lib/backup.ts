// © Ervin Remus Radosavlevici — Private License. Confidential, NDA-bound.
// Automated backup system for evidence registry with encryption and compression.

import { getEvidence, setEvidence, type Incident } from "./evidence";
import { getAuditLogs, setAuditLogs, type AuditLog } from "./audit";
import { encryptWithPassword, decryptWithPassword, type EncryptedData } from "./encryption";
import { logAudit } from "./audit";

export interface BackupConfig {
  enabled: boolean;
  autoBackup: boolean;
  backupInterval: number; // hours
  maxBackups: number;
  compression: boolean;
  encryption: boolean;
  encryptionPassword?: string;
  storageLimit: number; // MB
  cloudSync: boolean;
  cloudProvider?: string;
}

export interface BackupMetadata {
  id: string;
  timestamp: string;
  version: string;
  app: string;
  attribution: string;
  totalIncidents: number;
  totalAuditLogs: number;
  size: number;
  compressedSize?: number;
  encrypted: boolean;
  checksum: string;
  description?: string;
}

export interface BackupFile {
  metadata: BackupMetadata;
  data: {
    incidents: Incident[];
    auditLogs: AuditLog[];
  };
}

export interface EncryptedBackup {
  metadata: BackupMetadata;
  encryptedData: EncryptedData;
}

export interface BackupReport {
  success: boolean;
  backupId: string;
  timestamp: string;
  incidentsCount: number;
  auditLogsCount: number;
  size: number;
  compressedSize?: number;
  encrypted: boolean;
  filename?: string;
  url?: string;
  error?: string;
}

const BACKUP_STORAGE_KEY = "sentinel_backups";
const LAST_BACKUP_KEY = "sentinel_last_backup";
const BACKUP_CONFIG_KEY = "sentinel_backup_config";

const DEFAULT_CONFIG: BackupConfig = {
  enabled: true,
  autoBackup: true,
  backupInterval: 24, // hours
  maxBackups: 50,
  compression: true,
  encryption: false,
  storageLimit: 100, // MB
  cloudSync: false,
};

// Backup Manager
export class BackupManager {
  private config: BackupConfig;
  private backups: Map<string, BackupMetadata>;

  constructor(config: Partial<BackupConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.backups = new Map();
    this.loadBackups();
  }

  // Create a new backup
  async createBackup(
    description?: string,
    includeAuditLogs: boolean = true,
  ): Promise<BackupReport> {
    try {
      const incidents = getEvidence();
      const auditLogs = includeAuditLogs ? getAuditLogs() : [];

      const backupData = {
        incidents,
        auditLogs,
      };

      const metadata: BackupMetadata = {
        id: this.generateBackupId(),
        timestamp: new Date().toISOString(),
        version: "2.0",
        app: "NDA Multi-Signal Defensive Protection & Evidence Registry",
        attribution: "Ervin Remus Radosavlevici",
        totalIncidents: incidents.length,
        totalAuditLogs: auditLogs.length,
        size: JSON.stringify(backupData).length,
        encrypted: false,
        checksum: await this.calculateChecksum(backupData),
        description,
      };

      let finalData: BackupFile | EncryptedBackup;
      let encrypted = false;

      if (this.config.encryption && this.config.encryptionPassword) {
        const jsonString = JSON.stringify(backupData);
        const encryptedData = await encryptWithPassword(
          jsonString,
          this.config.encryptionPassword
        );
        
        finalData = {
          metadata,
          encryptedData,
        };
        encrypted = true;
        metadata.encrypted = true;
      } else {
        finalData = {
          metadata,
          data: backupData,
        };
      }

      // Compress if configured
      if (this.config.compression) {
        const compressed = this.compressData(finalData);
        if (compressed.size < (finalData as BackupFile).data ? JSON.stringify((finalData as BackupFile).data).length : 0) {
          // Store compressed version
          this.storeBackup(compressed.id, compressed.data, metadata);
          metadata.compressedSize = compressed.compressedSize;
        } else {
          this.storeBackup(metadata.id, finalData, metadata);
        }
      } else {
        this.storeBackup(metadata.id, finalData, metadata);
      }

      // Update last backup timestamp
      this.updateLastBackup(metadata.id);

      // Log audit event
      logAudit("BACKUP", "INFO", `Created backup: ${metadata.id} with ${incidents.length} incidents`);

      return {
        success: true,
        backupId: metadata.id,
        timestamp: metadata.timestamp,
        incidentsCount: incidents.length,
        auditLogsCount: auditLogs.length,
        size: metadata.size,
        compressedSize: metadata.compressedSize,
        encrypted,
        filename: this.getBackupFilename(metadata),
      };
    } catch (error) {
      return {
        success: false,
        backupId: "",
        timestamp: new Date().toISOString(),
        incidentsCount: 0,
        auditLogsCount: 0,
        size: 0,
        encrypted: false,
        error: `Failed to create backup: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  // Restore from backup
  async restoreBackup(backupId: string, password?: string): Promise<BackupReport> {
    try {
      const backup = this.getBackup(backupId);
      if (!backup) {
        return {
          success: false,
          error: `Backup not found: ${backupId}`,
          backupId,
          timestamp: new Date().toISOString(),
          incidentsCount: 0,
          auditLogsCount: 0,
          size: 0,
          encrypted: false,
        };
      }

      let data: { incidents: Incident[]; auditLogs: AuditLog[] };

      if (backup.encrypted) {
        if (!password && this.config.encryptionPassword) {
          password = this.config.encryptionPassword;
        }
        
        if (!password) {
          return {
            success: false,
            error: "Backup is encrypted. Please provide password.",
            backupId,
            timestamp: new Date().toISOString(),
            incidentsCount: 0,
            auditLogsCount: 0,
            size: 0,
            encrypted: true,
          };
        }

        const encryptedData = (backup as EncryptedBackup).encryptedData;
        const decrypted = await decryptWithPassword(encryptedData, password);
        data = JSON.parse(decrypted);
      } else {
        data = (backup as BackupFile).data;
      }

      // Restore incidents
      const existingIncidents = getEvidence();
      const mergedIncidents = [...existingIncidents, ...data.incidents];
      setEvidence(mergedIncidents);

      // Restore audit logs
      const existingLogs = getAuditLogs();
      const mergedLogs = [...existingLogs, ...data.auditLogs];
      setAuditLogs(mergedLogs);

      // Log audit event
      logAudit("RESTORE", "INFO", `Restored backup: ${backupId} with ${data.incidents.length} incidents`);

      return {
        success: true,
        backupId,
        timestamp: new Date().toISOString(),
        incidentsCount: data.incidents.length,
        auditLogsCount: data.auditLogs.length,
        size: backup.size,
        encrypted: backup.encrypted,
      };
    } catch (error) {
      return {
        success: false,
        backupId,
        timestamp: new Date().toISOString(),
        incidentsCount: 0,
        auditLogsCount: 0,
        size: 0,
        encrypted: false,
        error: `Failed to restore backup: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  // Delete backup
  deleteBackup(backupId: string): boolean {
    const backup = this.backups.get(backupId);
    if (!backup) return false;

    this.backups.delete(backupId);
    this.saveBackups();

    try {
      localStorage.removeItem(`${BACKUP_STORAGE_KEY}_${backupId}`);
    } catch {
      // Ignore
    }

    logAudit("DELETE_BACKUP", "INFO", `Deleted backup: ${backupId}`);
    return true;
  }

  // List all backups
  listBackups(): BackupMetadata[] {
    return Array.from(this.backups.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // Get backup by ID
  getBackup(backupId: string): (BackupFile | EncryptedBackup) | null {
    try {
      const backupJson = localStorage.getItem(`${BACKUP_STORAGE_KEY}_${backupId}`);
      if (!backupJson) return null;
      return JSON.parse(backupJson) as BackupFile | EncryptedBackup;
    } catch {
      return null;
    }
  }

  // Get backup metadata
  getBackupMetadata(backupId: string): BackupMetadata | undefined {
    return this.backups.get(backupId);
  }

  // Export backup to file
  exportBackup(backupId: string, password?: string): { success: boolean; blob: Blob | null; filename: string; error?: string } {
    const backup = this.getBackup(backupId);
    if (!backup) {
      return { success: false, blob: null, filename: "", error: "Backup not found" };
    }

    try {
      let data: string;

      if (backup.encrypted) {
        if (!password && this.config.encryptionPassword) {
          password = this.config.encryptionPassword;
        }
        
        if (!password) {
          return { success: false, blob: null, filename: "", error: "Backup is encrypted. Please provide password." };
        }

        const encryptedData = (backup as EncryptedBackup).encryptedData;
        // For export, we export the encrypted data as-is
        data = JSON.stringify(backup);
      } else {
        data = JSON.stringify(backup);
      }

      const blob = new Blob([data], { type: "application/json" });
      const filename = this.getBackupFilename(backup.metadata);

      return { success: true, blob, filename };
    } catch (error) {
      return {
        success: false,
        blob: null,
        filename: "",
        error: `Failed to export backup: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  // Import backup from file
  async importBackup(file: File, password?: string): Promise<BackupReport> {
    try {
      const content = await file.text();
      const backup = JSON.parse(content) as BackupFile | EncryptedBackup;

      // Validate structure
      if (!backup.metadata || (!backup.data && !backup.encryptedData)) {
        return {
          success: false,
          error: "Invalid backup file format",
          backupId: "",
          timestamp: new Date().toISOString(),
          incidentsCount: 0,
          auditLogsCount: 0,
          size: 0,
          encrypted: false,
        };
      }

      // Store the backup
      const backupId = backup.metadata.id || this.generateBackupId();
      backup.metadata.id = backupId;
      
      this.storeBackup(backupId, backup, backup.metadata);
      this.backups.set(backupId, backup.metadata);
      this.saveBackups();

      // Log audit event
      logAudit("IMPORT_BACKUP", "INFO", `Imported backup: ${backupId}`);

      return {
        success: true,
        backupId,
        timestamp: backup.metadata.timestamp,
        incidentsCount: backup.metadata.totalIncidents,
        auditLogsCount: backup.metadata.totalAuditLogs,
        size: backup.metadata.size,
        compressedSize: backup.metadata.compressedSize,
        encrypted: backup.metadata.encrypted,
        filename: file.name,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to import backup: ${error instanceof Error ? error.message : String(error)}`,
        backupId: "",
        timestamp: new Date().toISOString(),
        incidentsCount: 0,
        auditLogsCount: 0,
        size: 0,
        encrypted: false,
      };
    }
  }

  // Get backup statistics
  getStatistics(): {
    totalBackups: number;
    totalSize: number;
    encryptedBackups: number;
    compressedBackups: number;
    oldestBackup?: string;
    newestBackup?: string;
    storageUsed: number;
  } {
    const backups = Array.from(this.backups.values());
    const totalSize = backups.reduce((sum, b) => sum + (b.size || 0), 0);

    return {
      totalBackups: backups.length,
      totalSize,
      encryptedBackups: backups.filter((b) => b.encrypted).length,
      compressedBackups: backups.filter((b) => b.compressedSize).length,
      oldestBackup: backups.length > 0 ? backups[backups.length - 1].timestamp : undefined,
      newestBackup: backups.length > 0 ? backups[0].timestamp : undefined,
      storageUsed: totalSize,
    };
  }

  // Check storage usage
  checkStorageUsage(): { used: number; limit: number; percentage: number; warning: boolean } {
    const stats = this.getStatistics();
    const usedMB = stats.storageUsed / (1024 * 1024);
    const percentage = (usedMB / this.config.storageLimit) * 100;

    return {
      used: Math.round(usedMB * 100) / 100,
      limit: this.config.storageLimit,
      percentage: Math.round(percentage * 100) / 100,
      warning: percentage > 90,
    };
  }

  // Cleanup old backups
  cleanupOldBackups(maxBackups?: number): { deleted: number; spaceFreed: number } {
    const max = maxBackups || this.config.maxBackups;
    const backups = this.listBackups();
    
    if (backups.length <= max) {
      return { deleted: 0, spaceFreed: 0 };
    }

    const toDelete = backups.slice(max);
    let spaceFreed = 0;

    for (const backup of toDelete) {
      const metadata = this.backups.get(backup.id);
      if (metadata) {
        spaceFreed += metadata.size || 0;
        this.deleteBackup(backup.id);
      }
    }

    return {
      deleted: toDelete.length,
      spaceFreed,
    };
  }

  // Enable/disable auto backup
  setAutoBackup(enabled: boolean, interval?: number): void {
    this.config.autoBackup = enabled;
    if (interval) {
      this.config.backupInterval = interval;
    }
    this.saveConfig();
  }

  // Set encryption
  setEncryption(enabled: boolean, password?: string): void {
    this.config.encryption = enabled;
    if (password) {
      this.config.encryptionPassword = password;
    }
    this.saveConfig();
  }

  // Set compression
  setCompression(enabled: boolean): void {
    this.config.compression = enabled;
    this.saveConfig();
  }

  // Get configuration
  getConfig(): BackupConfig {
    return { ...this.config };
  }

  // Update configuration
  updateConfig(config: Partial<BackupConfig>): void {
    this.config = { ...this.config, ...config };
    this.saveConfig();
  }

  // Get last backup info
  getLastBackup(): BackupMetadata | undefined {
    try {
      if (typeof localStorage !== "undefined") {
        const lastBackupId = localStorage.getItem(LAST_BACKUP_KEY);
        if (lastBackupId) {
          return this.backups.get(lastBackupId);
        }
      }
    } catch {
      // localStorage not available
    }
    return undefined;
  }

  // Private methods
  private generateBackupId(): string {
    return typeof crypto?.randomUUID === "function" 
      ? crypto.randomUUID() 
      : `backup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async calculateChecksum(data: unknown): Promise<string> {
    const jsonString = JSON.stringify(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(jsonString));
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  private compressData(data: BackupFile | EncryptedBackup): { id: string; data: string; compressedSize: number } {
    // Simple compression using JSON stringification
    // In a real implementation, use compression libraries
    const jsonString = JSON.stringify(data);
    
    // For now, just return the original
    // This is a placeholder for actual compression
    return {
      id: data.metadata.id,
      data: jsonString,
      compressedSize: jsonString.length,
    };
  }

  private storeBackup(backupId: string, data: BackupFile | EncryptedBackup, metadata: BackupMetadata): void {
    try {
      localStorage.setItem(`${BACKUP_STORAGE_KEY}_${backupId}`, JSON.stringify(data));
      this.backups.set(backupId, metadata);
      this.saveBackups();
    } catch {
      // Storage full or other error
    }
  }

  private updateLastBackup(backupId: string): void {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(LAST_BACKUP_KEY, backupId);
      }
    } catch {
      // localStorage not available
    }
  }

  private loadBackups(): void {
    try {
      if (typeof localStorage !== "undefined") {
        const keys = Object.keys(localStorage).filter((key) => key.startsWith(`${BACKUP_STORAGE_KEY}_`));
        
        for (const key of keys) {
          const backupId = key.replace(`${BACKUP_STORAGE_KEY}_`, "");
          const backupJson = localStorage.getItem(key);
          if (backupJson) {
            const backup = JSON.parse(backupJson) as BackupFile | EncryptedBackup;
            this.backups.set(backupId, backup.metadata);
          }
        }
      }
    } catch {
      this.backups = new Map();
    }
  }

  private saveBackups(): void {
    try {
      if (typeof localStorage !== "undefined") {
        const metadata = Array.from(this.backups.values());
        localStorage.setItem(`${BACKUP_STORAGE_KEY}_metadata`, JSON.stringify(metadata));
      }
    } catch {
      // Ignore
    }
  }

  private saveConfig(): void {
    try {
      if (typeof localStorage !== "undefined") {
        // Don't save password to localStorage
        const { encryptionPassword, ...configWithoutPassword } = this.config;
        localStorage.setItem(BACKUP_CONFIG_KEY, JSON.stringify(configWithoutPassword));
      }
    } catch {
      // Ignore
    }
  }

  private getBackupFilename(metadata: BackupMetadata): string {
    const date = new Date(metadata.timestamp).toISOString().slice(0, 10);
    const time = new Date(metadata.timestamp).toISOString().slice(11, 19).replace(":", "-");
    return `NDA-backup-${date}-${time}-${metadata.id.slice(0, 8)}.json`;
  }
}

// Singleton instance
export const backupManager = new BackupManager();

// Backup utilities
export function createBackupNow(description?: string): Promise<BackupReport> {
  return backupManager.createBackup(description);
}

export function restoreBackupNow(backupId: string, password?: string): Promise<BackupReport> {
  return backupManager.restoreBackup(backupId, password);
}

export function listAllBackups(): BackupMetadata[] {
  return backupManager.listBackups();
}

export function getBackupStatistics() {
  return backupManager.getStatistics();
}
