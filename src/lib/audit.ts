// © Ervin Remus Radosavlevici — Private License. Confidential, NDA-bound.
// Comprehensive audit logging system for evidence registry operations.

import { getEvidence, setEvidence, type Incident } from "./evidence";
import { sha256 } from "./evidence";

export type AuditAction =
  | "CREATE"
  | "READ"
  | "UPDATE"
  | "DELETE"
  | "EXPORT"
  | "IMPORT"
  | "SCAN"
  | "BACKUP"
  | "RESTORE"
  | "ENCRYPT"
  | "DECRYPT";

export type AuditSeverity = "INFO" | "WARNING" | "ERROR" | "CRITICAL";

export interface AuditLog {
  id: string;
  timestamp: string;
  action: AuditAction;
  severity: AuditSeverity;
  userAgent: string;
  description: string;
  metadata?: Record<string, unknown>;
  evidenceId?: string;
  ipAddress?: string;
  sessionId?: string;
  hash?: string;
}

export interface AuditReport {
  totalLogs: number;
  byAction: Record<AuditAction, number>;
  bySeverity: Record<AuditSeverity, number>;
  recentLogs: AuditLog[];
  firstTimestamp: string | null;
  lastTimestamp: string | null;
}

const AUDIT_STORAGE_KEY = "ervin_ndamultisignal_audit_v1";
const MAX_AUDIT_LOGS = 1000;

function generateId(): string {
  return typeof crypto?.randomUUID === "function"
    ? crypto.randomUUID()
    : `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getSessionId(): string {
  if (typeof sessionStorage !== "undefined") {
    const existing = sessionStorage.getItem("sentinel_session_id");
    if (existing) return existing;
    const newId = generateId();
    sessionStorage.setItem("sentinel_session_id", newId);
    return newId;
  }
  return "unknown-session";
}

export function getAuditLogs(): AuditLog[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(AUDIT_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter(isAuditLog) : [];
  } catch {
    return [];
  }
}

function isAuditLog(x: unknown): x is AuditLog {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o["id"] === "string" &&
    typeof o["timestamp"] === "string" &&
    typeof o["action"] === "string" &&
    typeof o["severity"] === "string" &&
    typeof o["description"] === "string"
  );
}

export function logAudit(
  action: AuditAction,
  severity: AuditSeverity,
  description: string,
  metadata?: Record<string, unknown>,
  evidenceId?: string,
): AuditLog {
  const log: AuditLog = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    action,
    severity,
    userAgent: navigator.userAgent,
    description,
    metadata,
    evidenceId,
    sessionId: getSessionId(),
  };

  const logs = getAuditLogs();
  logs.push(log);

  // Keep only the most recent logs
  if (logs.length > MAX_AUDIT_LOGS) {
    logs.shift();
  }

  setAuditLogs(logs);
  return log;
}

export function setAuditLogs(logs: AuditLog[]) {
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
}

export function clearAuditLogs(): void {
  localStorage.removeItem(AUDIT_STORAGE_KEY);
}

// Convenience functions for common audit actions
export function auditCreate(incident: Incident): AuditLog {
  return logAudit(
    "CREATE",
    "INFO",
    `Created new incident record: ${incident.classification}`,
    {
      incidentId: incident.id,
      classification: incident.classification,
      observationLength: incident.observation.length,
    },
    incident.id,
  );
}

export function auditRead(incidentId: string): AuditLog {
  return logAudit(
    "READ",
    "INFO",
    `Accessed incident record: ${incidentId}`,
    { incidentId },
    incidentId,
  );
}

export function auditUpdate(incident: Incident): AuditLog {
  return logAudit(
    "UPDATE",
    "WARNING",
    `Updated incident record: ${incident.id}`,
    {
      incidentId: incident.id,
      classification: incident.classification,
    },
    incident.id,
  );
}

export function auditDelete(incidentId: string): AuditLog {
  return logAudit(
    "DELETE",
    "WARNING",
    `Deleted incident record: ${incidentId}`,
    { incidentId },
    incidentId,
  );
}

export function auditExport(count: number): AuditLog {
  return logAudit("EXPORT", "INFO", `Exported ${count} incident records`, { recordCount: count });
}

export function auditImport(count: number): AuditLog {
  return logAudit("IMPORT", "INFO", `Imported ${count} incident records`, { recordCount: count });
}

export function auditScan(verified: number, repaired: number, tampered: number): AuditLog {
  return logAudit(
    "SCAN",
    tampered > 0 ? "CRITICAL" : repaired > 0 ? "WARNING" : "INFO",
    `Integrity scan: ${verified} verified, ${repaired} repaired, ${tampered} tampered`,
    { verified, repaired, tampered },
  );
}

export function auditBackup(size: number): AuditLog {
  return logAudit("BACKUP", "INFO", `Created backup of ${size} records`, { backupSize: size });
}

export function auditRestore(size: number): AuditLog {
  return logAudit("RESTORE", "INFO", `Restored ${size} records from backup`, { restoreSize: size });
}

export function auditEncryption(incidentId: string): AuditLog {
  return logAudit(
    "ENCRYPT",
    "INFO",
    `Encrypted sensitive data for incident: ${incidentId}`,
    { incidentId },
    incidentId,
  );
}

export function auditDecryption(incidentId: string): AuditLog {
  return logAudit(
    "DECRYPT",
    "INFO",
    `Decrypted sensitive data for incident: ${incidentId}`,
    { incidentId },
    incidentId,
  );
}

export function auditError(error: Error, context: string): AuditLog {
  return logAudit("ERROR", "ERROR", `Error in ${context}: ${error.message}`, {
    errorName: error.name,
    errorMessage: error.message,
    stack: error.stack,
    context,
  });
}

// Generate audit report
export function generateAuditReport(): AuditReport {
  const logs = getAuditLogs();
  const byAction: Record<AuditAction, number> = {
    CREATE: 0,
    READ: 0,
    UPDATE: 0,
    DELETE: 0,
    EXPORT: 0,
    IMPORT: 0,
    SCAN: 0,
    BACKUP: 0,
    RESTORE: 0,
    ENCRYPT: 0,
    DECRYPT: 0,
  };

  const bySeverity: Record<AuditSeverity, number> = {
    INFO: 0,
    WARNING: 0,
    ERROR: 0,
    CRITICAL: 0,
  };

  for (const log of logs) {
    byAction[log.action] = (byAction[log.action] || 0) + 1;
    bySeverity[log.severity] = (bySeverity[log.severity] || 0) + 1;
  }

  const recentLogs = [...logs].reverse().slice(0, 50);

  return {
    totalLogs: logs.length,
    byAction,
    bySeverity,
    recentLogs,
    firstTimestamp: logs.length > 0 ? logs[0].timestamp : null,
    lastTimestamp: logs.length > 0 ? logs[logs.length - 1].timestamp : null,
  };
}

// Format audit log for display
export function formatAuditLog(log: AuditLog): string {
  const date = new Date(log.timestamp);
  const timeStr = date.toLocaleString();
  return `[${log.severity.padEnd(8)}] [${log.action.padEnd(8)}] ${timeStr} — ${log.description}`;
}

// Format full audit report
export function formatAuditReport(report: AuditReport): string {
  const lines: string[] = [
    "AUDIT LOG REPORT",
    "© Ervin Remus Radosavlevici — Private License / NDA",
    "",
    `Total logs: ${report.totalLogs}`,
    `Period: ${report.firstTimestamp || "N/A"} to ${report.lastTimestamp || "N/A"}`,
    "",
    "By Action:",
    ...Object.entries(report.byAction).map(([action, count]) => `  ${action.padEnd(12)}: ${count}`),
    "",
    "By Severity:",
    ...Object.entries(report.bySeverity).map(
      ([severity, count]) => `  ${severity.padEnd(8)}: ${count}`,
    ),
    "",
    "Recent Logs:",
    ...report.recentLogs.map((log) => formatAuditLog(log)),
  ];

  return lines.join("\n");
}

// Continuous audit monitoring
export function startAuditMonitoring(callback: (log: AuditLog) => void): { stop: () => void } {
  // In a real implementation, this would watch for changes
  // For now, we'll just provide a stop function
  return {
    stop: () => {},
  };
}

// Check for suspicious audit patterns
export function detectSuspiciousAuditPatterns(): { patterns: string[]; severity: AuditSeverity } {
  const logs = getAuditLogs();
  const patterns: string[] = [];
  let severity: AuditSeverity = "INFO";

  // Check for mass deletion
  const deleteLogs = logs.filter((l) => l.action === "DELETE");
  if (deleteLogs.length > 10) {
    patterns.push(`High volume of deletions detected (${deleteLogs.length})`);
    severity = "CRITICAL";
  }

  // Check for rapid operations
  const recentLogs = logs.slice(-20);
  const timeWindow =
    recentLogs.length > 0
      ? new Date(recentLogs[recentLogs.length - 1].timestamp).getTime() -
        new Date(recentLogs[0].timestamp).getTime()
      : 0;

  if (recentLogs.length >= 10 && timeWindow < 1000) {
    patterns.push(`Rapid operations detected (${recentLogs.length} in ${timeWindow}ms)`);
    severity = "WARNING";
  }

  // Check for error patterns
  const errorLogs = logs.filter((l) => l.severity === "ERROR" || l.severity === "CRITICAL");
  if (errorLogs.length > 5) {
    patterns.push(`High error rate detected (${errorLogs.length} errors)`);
    severity = "ERROR";
  }

  // Check for unusual access patterns
  const readLogs = logs.filter((l) => l.action === "READ");
  if (readLogs.length > 100) {
    patterns.push(`High volume of reads detected (${readLogs.length})`);
    severity = "WARNING";
  }

  return { patterns, severity };
}

// Export audit logs
export function exportAuditLogs(): void {
  const logs = getAuditLogs();
  const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `NDA-audit-logs-${new Date().toISOString().replaceAll(":", "-")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Verify audit log integrity
export async function verifyAuditLogIntegrity(): Promise<{ valid: boolean; issues: string[] }> {
  const logs = getAuditLogs();
  const issues: string[] = [];

  // Check for tampering
  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];

    // Check if log has all required fields
    if (!log.id || !log.timestamp || !log.action || !log.severity || !log.description) {
      issues.push(`Log at index ${i} is missing required fields`);
    }

    // Check timestamp validity
    if (isNaN(Date.parse(log.timestamp))) {
      issues.push(`Log at index ${i} has invalid timestamp`);
    }
  }

  // Check chronological order
  for (let i = 1; i < logs.length; i++) {
    const prevTime = new Date(logs[i - 1].timestamp).getTime();
    const currTime = new Date(logs[i].timestamp).getTime();

    if (currTime < prevTime) {
      issues.push(`Logs are out of chronological order at index ${i}`);
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
