// © Ervin Remus Radosavlevici — Private License. Confidential, NDA-bound.
// Data retention and lifecycle management system.
// Implements automated cleanup, archival, and retention policies.

import { getEvidence, setEvidence, type Incident, emptyCategories } from "./evidence";
import { getAuditLogs, setAuditLogs, type AuditLog } from "./audit";
import { logAudit } from "./audit";

export interface RetentionPolicy {
  id: string;
  name: string;
  description: string;
  retentionPeriod: number; // days
  appliesTo: ("incidents" | "auditLogs" | "all")[];
  conditions?: {
    sensitivity?: string[];
    classification?: string[];
    status?: string[];
  };
  action: "keep" | "archive" | "delete";
  priority: number;
}

export interface RetentionConfig {
  enabled: boolean;
  autoCleanup: boolean;
  cleanupInterval: number; // hours
  policies: RetentionPolicy[];
  maxIncidents: number;
  maxAuditLogs: number;
  archiveEnabled: boolean;
  archiveThreshold: number; // days before archive
  deleteThreshold: number; // days before permanent deletion
}

export interface RetentionReport {
  timestamp: string;
  policiesApplied: number;
  incidentsProcessed: number;
  incidentsArchived: number;
  incidentsDeleted: number;
  auditLogsProcessed: number;
  auditLogsArchived: number;
  auditLogsDeleted: number;
  spaceSaved: number; // bytes
  errors: string[];
}

// Default retention policies
const DEFAULT_POLICIES: RetentionPolicy[] = [
  {
    id: "rp-001",
    name: "Critical Evidence Retention",
    description: "Keep all incidents marked as restricted or quarantined indefinitely",
    retentionPeriod: 0, // 0 = keep forever
    appliesTo: ["incidents"],
    conditions: {
      sensitivity: ["restricted"],
      status: ["quarantined"],
    },
    action: "keep",
    priority: 100,
  },
  {
    id: "rp-002",
    name: "High Sensitivity Retention",
    description: "Keep high sensitivity incidents for 10 years",
    retentionPeriod: 3650, // 10 years
    appliesTo: ["incidents"],
    conditions: {
      sensitivity: ["confidential", "restricted"],
    },
    action: "keep",
    priority: 90,
  },
  {
    id: "rp-003",
    name: "Standard Incident Retention",
    description: "Keep standard incidents for 7 years (legal requirement)",
    retentionPeriod: 2555, // 7 years
    appliesTo: ["incidents"],
    action: "keep",
    priority: 80,
  },
  {
    id: "rp-004",
    name: "Draft Incident Cleanup",
    description: "Delete draft incidents after 30 days",
    retentionPeriod: 30,
    appliesTo: ["incidents"],
    conditions: {
      status: ["draft"],
    },
    action: "delete",
    priority: 60,
  },
  {
    id: "rp-005",
    name: "Audit Log Retention",
    description: "Keep audit logs for 5 years",
    retentionPeriod: 1825, // 5 years
    appliesTo: ["auditLogs"],
    action: "keep",
    priority: 70,
  },
  {
    id: "rp-006",
    name: "Old Audit Log Cleanup",
    description: "Delete audit logs older than 5 years",
    retentionPeriod: 1825,
    appliesTo: ["auditLogs"],
    action: "delete",
    priority: 50,
  },
  {
    id: "rp-007",
    name: "Maximum Incident Limit",
    description: "Archive oldest incidents when exceeding maximum count",
    retentionPeriod: 0,
    appliesTo: ["incidents"],
    action: "archive",
    priority: 40,
  },
  {
    id: "rp-008",
    name: "Maximum Audit Log Limit",
    description: "Archive oldest audit logs when exceeding maximum count",
    retentionPeriod: 0,
    appliesTo: ["auditLogs"],
    action: "archive",
    priority: 30,
  },
];

// Default configuration
const DEFAULT_CONFIG: RetentionConfig = {
  enabled: true,
  autoCleanup: true,
  cleanupInterval: 24, // hours
  policies: DEFAULT_POLICIES,
  maxIncidents: 10000,
  maxAuditLogs: 10000,
  archiveEnabled: true,
  archiveThreshold: 365, // 1 year
  deleteThreshold: 2555, // 7 years
};

// Archived incident type
export interface ArchivedIncident extends Incident {
  archivedAt: string;
  archivedBy: string;
  archiveReason: string;
  originalId: string;
}

// Archived audit log type
export interface ArchivedAuditLog extends AuditLog {
  archivedAt: string;
  archivedBy: string;
  archiveReason: string;
  originalId: string;
}

// Retention Engine
export class RetentionEngine {
  private config: RetentionConfig;
  private archivedIncidents: ArchivedIncident[] = [];
  private archivedAuditLogs: ArchivedAuditLog[] = [];

  constructor(config: Partial<RetentionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.loadArchives();
  }

  // Run retention cleanup
  async runCleanup(dryRun: boolean = false): Promise<RetentionReport> {
    const report: RetentionReport = {
      timestamp: new Date().toISOString(),
      policiesApplied: 0,
      incidentsProcessed: 0,
      incidentsArchived: 0,
      incidentsDeleted: 0,
      auditLogsProcessed: 0,
      auditLogsArchived: 0,
      auditLogsDeleted: 0,
      spaceSaved: 0,
      errors: [],
    };

    if (!this.config.enabled) {
      report.errors.push("Retention engine is disabled");
      return report;
    }

    try {
      // Process incidents
      const incidents = getEvidence();
      report.incidentsProcessed = incidents.length;

      const { processedIncidents, archived, deleted, spaceSaved } = this.processItems(
        incidents,
        "incidents",
        dryRun,
      );

      report.incidentsArchived += archived;
      report.incidentsDeleted += deleted;
      report.spaceSaved += spaceSaved;

      // Process audit logs
      const auditLogs = getAuditLogs();
      report.auditLogsProcessed = auditLogs.length;

      const {
        archived: archivedLogs,
        deleted: deletedLogs,
        spaceSaved: spaceSavedLogs,
      } = this.processItems(auditLogs, "auditLogs", dryRun);

      report.auditLogsArchived += archivedLogs;
      report.auditLogsDeleted += deletedLogs;
      report.spaceSaved += spaceSavedLogs;

      // Apply changes if not dry run
      if (!dryRun) {
        if (processedIncidents.length !== incidents.length) {
          setEvidence(processedIncidents);
        }

        const processedAuditLogs = auditLogs.filter((log) => {
          const shouldArchive = this.shouldArchive(log, "auditLogs");
          const shouldDelete = this.shouldDelete(log, "auditLogs");
          return !shouldArchive && !shouldDelete;
        });

        if (processedAuditLogs.length !== auditLogs.length) {
          setAuditLogs(processedAuditLogs);
        }

        this.saveArchives();
      }

      report.policiesApplied = this.config.policies.length;
    } catch (error) {
      report.errors.push(
        `Cleanup failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    return report;
  }

  // Check if an item should be archived
  shouldArchive(item: Incident | AuditLog, type: "incidents" | "auditLogs"): boolean {
    if (!this.config.archiveEnabled) return false;

    const now = new Date();
    const itemDate = new Date((item as Incident).timestamp || (item as AuditLog).timestamp);
    const daysOld = (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysOld < this.config.archiveThreshold) return false;

    // Check if any policy says to archive
    for (const policy of this.config.policies) {
      if (policy.appliesTo.includes(type) && policy.action === "archive") {
        if (this.itemMatchesPolicy(item, policy)) {
          return true;
        }
      }
    }

    // Check maximum count
    const allItems = type === "incidents" ? getEvidence() : getAuditLogs();
    if (
      allItems.length > (type === "incidents" ? this.config.maxIncidents : this.config.maxAuditLogs)
    ) {
      // Archive oldest items
      const sorted = [...allItems].sort(
        (a, b) =>
          new Date((a as Incident).timestamp || (a as AuditLog).timestamp).getTime() -
          new Date((b as Incident).timestamp || (b as AuditLog).timestamp).getTime(),
      );
      const index = sorted.findIndex(
        (i) =>
          (i as Incident).id === (item as Incident).id ||
          (i as AuditLog).id === (item as AuditLog).id,
      );
      if (index < sorted.length * 0.2) {
        // Archive oldest 20%
        return true;
      }
    }

    return false;
  }

  // Check if an item should be deleted
  shouldDelete(item: Incident | AuditLog, type: "incidents" | "auditLogs"): boolean {
    const now = new Date();
    const itemDate = new Date((item as Incident).timestamp || (item as AuditLog).timestamp);
    const daysOld = (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysOld < this.config.deleteThreshold) return false;

    // Check if any policy says to delete
    for (const policy of this.config.policies) {
      if (policy.appliesTo.includes(type) && policy.action === "delete") {
        if (this.itemMatchesPolicy(item, policy)) {
          return true;
        }
      }
    }

    return false;
  }

  // Archive an item
  archiveIncident(incident: Incident, reason: string = "Retention policy"): ArchivedIncident {
    const archived: ArchivedIncident = {
      ...incident,
      archivedAt: new Date().toISOString(),
      archivedBy: "retention-engine",
      archiveReason: reason,
      originalId: incident.id,
    };

    this.archivedIncidents.push(archived);
    logAudit("ARCHIVE", "INFO", `Archived incident: ${incident.id} - ${reason}`);

    return archived;
  }

  // Archive an audit log
  archiveAuditLog(log: AuditLog, reason: string = "Retention policy"): ArchivedAuditLog {
    const archived: ArchivedAuditLog = {
      ...log,
      archivedAt: new Date().toISOString(),
      archivedBy: "retention-engine",
      archiveReason: reason,
      originalId: log.id,
    };

    this.archivedAuditLogs.push(archived);
    logAudit("ARCHIVE", "INFO", `Archived audit log: ${log.id} - ${reason}`);

    return archived;
  }

  // Get retention report for an item
  getRetentionStatus(
    item: Incident | AuditLog,
    type: "incidents" | "auditLogs",
  ): {
    shouldArchive: boolean;
    shouldDelete: boolean;
    daysOld: number;
    applicablePolicies: RetentionPolicy[];
  } {
    const now = new Date();
    const itemDate = new Date((item as Incident).timestamp || (item as AuditLog).timestamp);
    const daysOld = (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24);

    const applicablePolicies = this.config.policies.filter(
      (policy) => policy.appliesTo.includes(type) && this.itemMatchesPolicy(item, policy),
    );

    return {
      shouldArchive: this.shouldArchive(item, type),
      shouldDelete: this.shouldDelete(item, type),
      daysOld,
      applicablePolicies,
    };
  }

  // Get all archived incidents
  getArchivedIncidents(): ArchivedIncident[] {
    return [...this.archivedIncidents];
  }

  // Get all archived audit logs
  getArchivedAuditLogs(): ArchivedAuditLog[] {
    return [...this.archivedAuditLogs];
  }

  // Restore archived incident
  restoreIncident(archivedId: string): Incident | null {
    const index = this.archivedIncidents.findIndex(
      (i) => i.id === archivedId || i.originalId === archivedId,
    );
    if (index === -1) return null;

    const [archived] = this.archivedIncidents.splice(index, 1);
    const restored: Incident = {
      ...archived,
      id: archived.originalId || archived.id,
    };
    delete (restored as Partial<ArchivedIncident>).archivedAt;
    delete (restored as Partial<ArchivedIncident>).archivedBy;
    delete (restored as Partial<ArchivedIncident>).archiveReason;
    delete (restored as Partial<ArchivedIncident>).originalId;

    const incidents = getEvidence();
    incidents.push(restored);
    setEvidence(incidents);

    logAudit("RESTORE", "INFO", `Restored incident: ${archived.originalId || archived.id}`);
    this.saveArchives();

    return restored;
  }

  // Restore archived audit log
  restoreAuditLog(archivedId: string): AuditLog | null {
    const index = this.archivedAuditLogs.findIndex(
      (i) => i.id === archivedId || i.originalId === archivedId,
    );
    if (index === -1) return null;

    const [archived] = this.archivedAuditLogs.splice(index, 1);
    const restored: AuditLog = {
      ...archived,
      id: archived.originalId || archived.id,
    };
    delete (restored as Partial<ArchivedAuditLog>).archivedAt;
    delete (restored as Partial<ArchivedAuditLog>).archivedBy;
    delete (restored as Partial<ArchivedAuditLog>).archiveReason;
    delete (restored as Partial<ArchivedAuditLog>).originalId;

    const logs = getAuditLogs();
    logs.push(restored);
    setAuditLogs(logs);

    logAudit("RESTORE", "INFO", `Restored audit log: ${archived.originalId || archived.id}`);
    this.saveArchives();

    return restored;
  }

  // Delete archived incident permanently
  deleteArchivedIncident(archivedId: string): boolean {
    const index = this.archivedIncidents.findIndex(
      (i) => i.id === archivedId || i.originalId === archivedId,
    );
    if (index === -1) return false;

    this.archivedIncidents.splice(index, 1);
    logAudit("DELETE_ARCHIVED", "INFO", `Permanently deleted archived incident: ${archivedId}`);
    this.saveArchives();
    return true;
  }

  // Delete archived audit log permanently
  deleteArchivedAuditLog(archivedId: string): boolean {
    const index = this.archivedAuditLogs.findIndex(
      (i) => i.id === archivedId || i.originalId === archivedId,
    );
    if (index === -1) return false;

    this.archivedAuditLogs.splice(index, 1);
    logAudit("DELETE_ARCHIVED", "INFO", `Permanently deleted archived audit log: ${archivedId}`);
    this.saveArchives();
    return true;
  }

  // Get retention statistics
  getStatistics(): {
    totalIncidents: number;
    totalAuditLogs: number;
    archivedIncidents: number;
    archivedAuditLogs: number;
    storageUsed: number;
    storageEstimate: number;
  } {
    const incidents = getEvidence();
    const auditLogs = getAuditLogs();

    // Estimate storage (rough approximation)
    const incidentSize = JSON.stringify(incidents[0] || {}).length || 500;
    const logSize = JSON.stringify(auditLogs[0] || {}).length || 200;

    return {
      totalIncidents: incidents.length,
      totalAuditLogs: auditLogs.length,
      archivedIncidents: this.archivedIncidents.length,
      archivedAuditLogs: this.archivedAuditLogs.length,
      storageUsed: incidents.length * incidentSize + auditLogs.length * logSize,
      storageEstimate:
        (incidents.length + this.archivedIncidents.length) * incidentSize +
        (auditLogs.length + this.archivedAuditLogs.length) * logSize,
    };
  }

  // Get cleanup estimate
  getCleanupEstimate(): {
    wouldArchive: number;
    wouldDelete: number;
    spaceWouldSave: number;
  } {
    const incidents = getEvidence();
    const auditLogs = getAuditLogs();

    let wouldArchive = 0;
    let wouldDelete = 0;
    let spaceWouldSave = 0;

    const incidentSize = JSON.stringify(incidents[0] || {}).length || 500;
    const logSize = JSON.stringify(auditLogs[0] || {}).length || 200;

    for (const incident of incidents) {
      if (this.shouldArchive(incident, "incidents")) wouldArchive++;
      if (this.shouldDelete(incident, "incidents")) wouldDelete++;
    }

    for (const log of auditLogs) {
      if (this.shouldArchive(log, "auditLogs")) wouldArchive++;
      if (this.shouldDelete(log, "auditLogs")) wouldDelete++;
    }

    spaceWouldSave = (wouldDelete * (incidentSize + logSize)) / 2;

    return { wouldArchive, wouldDelete, spaceWouldSave };
  }

  // Enable/disable retention
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  // Set auto cleanup
  setAutoCleanup(enabled: boolean, interval?: number): void {
    this.config.autoCleanup = enabled;
    if (interval) {
      this.config.cleanupInterval = interval;
    }
  }

  // Add custom policy
  addPolicy(policy: RetentionPolicy): void {
    this.config.policies.push(policy);
    // Re-sort by priority
    this.config.policies.sort((a, b) => b.priority - a.priority);
  }

  // Remove policy
  removePolicy(id: string): void {
    this.config.policies = this.config.policies.filter((p) => p.id !== id);
  }

  // Update policy
  updatePolicy(id: string, updates: Partial<RetentionPolicy>): void {
    const index = this.config.policies.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.config.policies[index] = { ...this.config.policies[index], ...updates };
      this.config.policies.sort((a, b) => b.priority - a.priority);
    }
  }

  // Get configuration
  getConfig(): RetentionConfig {
    return { ...this.config };
  }

  // Private methods
  private processItems<T extends Incident | AuditLog>(
    items: T[],
    type: "incidents" | "auditLogs",
    dryRun: boolean,
  ): { processedIncidents: T[]; archived: number; deleted: number; spaceSaved: number } {
    const processed: T[] = [];
    let archived = 0;
    let deleted = 0;
    let spaceSaved = 0;

    const itemSize = JSON.stringify(items[0] || {}).length || (type === "incidents" ? 500 : 200);

    for (const item of items) {
      const shouldArchive = this.shouldArchive(item, type);
      const shouldDelete = this.shouldDelete(item, type);

      if (shouldDelete) {
        deleted++;
        spaceSaved += itemSize;
        if (!dryRun) {
          // Don't add to processed
          if (type === "incidents") {
            logAudit(
              "DELETE",
              "INFO",
              `Retention cleanup: Deleted ${type} ${(item as Incident).id}`,
            );
          }
        }
      } else if (shouldArchive) {
        archived++;
        spaceSaved += itemSize / 2; // Archive uses less space
        if (!dryRun) {
          if (type === "incidents") {
            this.archiveIncident(item as Incident);
          } else {
            this.archiveAuditLog(item as AuditLog);
          }
          processed.push(item);
        }
      } else {
        processed.push(item);
      }
    }

    return { processedIncidents: processed, archived, deleted, spaceSaved };
  }

  private itemMatchesPolicy(item: Incident | AuditLog, policy: RetentionPolicy): boolean {
    if (!policy.conditions) return true;

    const inc = item as Incident;
    const log = item as AuditLog;

    // Check sensitivity
    if (policy.conditions.sensitivity) {
      const itemSensitivity = (inc.sensitivity || "internal").toLowerCase();
      if (!policy.conditions.sensitivity.includes(itemSensitivity)) return false;
    }

    // Check classification
    if (policy.conditions.classification) {
      const itemClassification = (inc.classification || "").toLowerCase();
      if (
        !policy.conditions.classification.some((c) => itemClassification.includes(c.toLowerCase()))
      )
        return false;
    }

    // Check status
    if (policy.conditions.status) {
      const itemStatus = (inc.status || "draft").toLowerCase();
      if (!policy.conditions.status.includes(itemStatus)) return false;
    }

    return true;
  }

  private loadArchives(): void {
    try {
      const archivedIncidents = JSON.parse(
        localStorage.getItem("sentinel_archived_incidents") || "[]",
      ) as ArchivedIncident[];
      this.archivedIncidents = archivedIncidents.filter((i) => i.archivedAt);

      const archivedAuditLogs = JSON.parse(
        localStorage.getItem("sentinel_archived_audit_logs") || "[]",
      ) as ArchivedAuditLog[];
      this.archivedAuditLogs = archivedAuditLogs.filter((l) => l.archivedAt);
    } catch {
      this.archivedIncidents = [];
      this.archivedAuditLogs = [];
    }
  }

  private saveArchives(): void {
    try {
      localStorage.setItem("sentinel_archived_incidents", JSON.stringify(this.archivedIncidents));
      localStorage.setItem("sentinel_archived_audit_logs", JSON.stringify(this.archivedAuditLogs));
    } catch {
      // Storage full or other error
    }
  }
}

// Singleton instance
export const retentionEngine = new RetentionEngine();

// Retention utilities
export function getRetentionStatus(incident: Incident): {
  shouldArchive: boolean;
  shouldDelete: boolean;
  daysOld: number;
  applicablePolicies: RetentionPolicy[];
} {
  return retentionEngine.getRetentionStatus(incident, "incidents");
}

export function getRetentionPolicyLabels(): { id: string; name: string; description: string }[] {
  return DEFAULT_POLICIES.map((policy) => ({
    id: policy.id,
    name: policy.name,
    description: policy.description,
  }));
}
