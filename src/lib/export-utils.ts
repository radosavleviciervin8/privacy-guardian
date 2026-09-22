// © Ervin Remus Radosavlevici — Private License. Confidential, NDA-bound.
// Advanced export utilities for multiple formats (JSON, CSV, PDF).

import { type Incident } from "./evidence";
import { type SentinelReport, formatReport, formatInterferenceLog } from "./sentinel";
import { type AuditReport, formatAuditReport } from "./audit";
import { type AnomalyDetectionResult } from "./ai-detection";
import { type ThreatReport } from "./threat-intel";
import { getTranslations, getCurrentLanguage } from "./i18n";

export type ExportFormat = "json" | "csv" | "pdf" | "txt";

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  includeMetadata?: boolean;
  includeLegalNotices?: boolean;
  includeSensitiveData?: boolean;
  password?: string; // For encrypted exports
}

export interface ExportResult {
  success: boolean;
  data: Blob | null;
  url: string | null;
  filename: string;
  size: number;
  error?: string;
}

// Export to JSON with enhanced metadata
export function exportToJSON(
  incidents: Incident[],
  options: Partial<ExportOptions> = {},
): ExportResult {
  try {
    const {
      includeMetadata = true,
      includeLegalNotices = true,
      filename,
      includeSensitiveData = true,
    } = options;

    const exportData: Record<string, unknown> = {
      version: "2.0",
      exportedAt: new Date().toISOString(),
      app: "NDA Multi-Signal Defensive Protection & Evidence Registry",
      attribution: "Ervin Remus Radosavlevici",
      license: "Private License — All Rights Reserved. Confidential under NDA.",
    };

    if (includeMetadata) {
      exportData.metadata = {
        totalIncidents: incidents.length,
        exportTimestamp: new Date().toISOString(),
        classifications: countClassifications(incidents),
        categories: countCategories(incidents),
        dateRange: getDateRange(incidents),
      };
    }

    if (includeLegalNotices) {
      exportData.legalNotices = {
        copyright: "© Ervin Remus Radosavlevici. All rights reserved.",
        confidentiality: "This export contains confidential information subject to NDA.",
        disclaimer:
          "Records are observations, not proof of wrongdoing. Independent verification required.",
        humanRights: "Complies with UDHR Art. 12, ICCPR Art. 17, ECHR Art. 8, GDPR principles.",
        jurisdiction: "Subject to international human rights law and applicable local laws.",
      };
    }

    // Filter sensitive data if requested
    const exportIncidents = includeSensitiveData
      ? incidents
      : incidents.map((incident) => ({
          ...incident,
          observation: incident.observation ? "[REDACTED]" : "",
          technical: incident.technical ? "[REDACTED]" : "",
          location: undefined,
          signalData: undefined,
        }));

    exportData.incidents = exportIncidents;

    if (includeLegalNotices) {
      exportData.warnings = [
        "UNAUTHORIZED DISCLOSURE PROHIBITED: This document contains confidential information protected by NDA and copyright law.",
        "LEGAL USE ONLY: This evidence is for defensive documentation and legal proceedings only.",
        "NO ACCUSATIONS: Records are observations, not accusations. Presumption of innocence applies.",
        "VERIFY INDEPENDENTLY: All evidence should be independently verified by qualified experts.",
      ];
    }

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const finalFilename =
      filename || `NDA-evidence-${new Date().toISOString().slice(0, 10)}-${Date.now()}.json`;

    return {
      success: true,
      data: blob,
      url: URL.createObjectURL(blob),
      filename: finalFilename,
      size: blob.size,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      url: null,
      filename: "",
      size: 0,
      error: `Failed to export to JSON: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// Export to CSV format
export function exportToCSV(
  incidents: Incident[],
  options: Partial<ExportOptions> = {},
): ExportResult {
  try {
    const { filename, includeSensitiveData = true } = options;

    // Create CSV header
    const headers = [
      "ID",
      "Timestamp",
      "Classification",
      "Observation",
      "Technical Reference",
      "Categories",
      "Sensitivity",
      "Status",
      "Hash",
    ];

    const rows: string[][] = [];

    for (const incident of incidents) {
      const row: string[] = [
        incident.id || "",
        incident.timestamp || "",
        incident.classification || "",
        includeSensitiveData ? incident.observation || "" : "[REDACTED]",
        includeSensitiveData ? incident.technical || "" : "[REDACTED]",
        this.formatCategories(incident.categories),
        incident.sensitivity || "",
        incident.status || "",
        incident.hash || "",
      ];
      rows.push(row);
    }

    // Escape CSV values
    const escapedRows = rows.map((row) => row.map((cell) => this.escapeCSV(cell)));

    // Build CSV content
    const csvContent = [
      headers.map((h) => this.escapeCSV(h)).join(","),
      ...escapedRows.map((row) => row.join(",")),
    ].join("\n");

    // Add metadata header
    const metadataLines = [
      `Export Date: ${new Date().toISOString()}`,
      `Total Incidents: ${incidents.length}`,
      `App: NDA Multi-Signal Defensive Protection & Evidence Registry`,
      `Attribution: Ervin Remus Radosavlevici`,
      `License: Private License - Confidential under NDA`,
      `Warning: This document contains confidential information`,
      "", // Empty line before data
    ];

    const finalContent = [...metadataLines, csvContent].join("\n");
    const blob = new Blob([finalContent], { type: "text/csv;charset=utf-8;" });
    const finalFilename =
      filename || `NDA-evidence-${new Date().toISOString().slice(0, 10)}-${Date.now()}.csv`;

    return {
      success: true,
      data: blob,
      url: URL.createObjectURL(blob),
      filename: finalFilename,
      size: blob.size,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      url: null,
      filename: "",
      size: 0,
      error: `Failed to export to CSV: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// Export to Text format
export function exportToTXT(
  incidents: Incident[],
  options: Partial<ExportOptions> = {},
): ExportResult {
  try {
    const { filename, includeSensitiveData = true, includeLegalNotices = true } = options;

    const lines: string[] = [];

    // Add header
    lines.push("=".repeat(80));
    lines.push("NDA MULTI-SIGNAL DEFENSIVE PROTECTION & EVIDENCE REGISTRY");
    lines.push("© Ervin Remus Radosavlevici — Private License / NDA");
    lines.push("=".repeat(80));
    lines.push("");

    // Add metadata
    lines.push(`Export Date: ${new Date().toISOString()}`);
    lines.push(`Total Incidents: ${incidents.length}`);
    lines.push(`Generated By: NDA Multi-Signal Defensive Protection System`);
    lines.push("");

    if (includeLegalNotices) {
      lines.push("LEGAL NOTICES:");
      lines.push("-".repeat(80));
      lines.push(
        "1. This document contains confidential information protected by NDA and copyright.",
      );
      lines.push("2. Unauthorized disclosure is strictly prohibited.");
      lines.push("3. Records are observations, not proof of wrongdoing.");
      lines.push("4. Independent verification by qualified experts is required.");
      lines.push(
        "5. Subject to international human rights law (UDHR Art. 12, ICCPR Art. 17, ECHR Art. 8).",
      );
      lines.push("");
    }

    // Add incidents
    lines.push("INCIDENTS:");
    lines.push("-".repeat(80));

    for (const incident of incidents) {
      lines.push("");
      lines.push(`Incident ID: ${incident.id}`);
      lines.push(`Timestamp: ${incident.timestamp}`);
      lines.push(`Classification: ${incident.classification}`);
      lines.push(`Sensitivity: ${incident.sensitivity || "internal"}`);
      lines.push(`Status: ${incident.status || "draft"}`);
      lines.push("");
      lines.push("Observation:");
      lines.push(includeSensitiveData ? incident.observation || "None" : "[REDACTED]");
      lines.push("");
      lines.push("Technical Reference:");
      lines.push(includeSensitiveData ? incident.technical || "None" : "[REDACTED]");
      lines.push("");
      lines.push("Categories:");
      lines.push(this.formatCategories(incident.categories));
      lines.push("");
      lines.push(`Hash: ${incident.hash || "N/A"}`);
      lines.push("-".repeat(80));
    }

    lines.push("");
    lines.push("END OF EXPORT");
    lines.push("=".repeat(80));

    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const finalFilename =
      filename || `NDA-evidence-${new Date().toISOString().slice(0, 10)}-${Date.now()}.txt`;

    return {
      success: true,
      data: blob,
      url: URL.createObjectURL(blob),
      filename: finalFilename,
      size: blob.size,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      url: null,
      filename: "",
      size: 0,
      error: `Failed to export to TXT: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// Export Sentinel Report
export function exportSentinelReport(
  report: SentinelReport,
  interferenceLogs: unknown[],
  options: Partial<ExportOptions> = {},
): ExportResult {
  try {
    const { filename } = options;

    const reportText = formatReport(report);
    const logsText = formatInterferenceLog(interferenceLogs);

    const content = `${reportText}\n\n${logsText}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const finalFilename =
      filename || `NDA-sentinel-report-${new Date().toISOString().slice(0, 10)}-${Date.now()}.txt`;

    return {
      success: true,
      data: blob,
      url: URL.createObjectURL(blob),
      filename: finalFilename,
      size: blob.size,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      url: null,
      filename: "",
      size: 0,
      error: `Failed to export sentinel report: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// Export Audit Report
export function exportAuditReport(
  report: AuditReport,
  options: Partial<ExportOptions> = {},
): ExportResult {
  try {
    const { filename } = options;

    const reportText = formatAuditReport(report);
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8;" });
    const finalFilename =
      filename || `NDA-audit-report-${new Date().toISOString().slice(0, 10)}-${Date.now()}.txt`;

    return {
      success: true,
      data: blob,
      url: URL.createObjectURL(blob),
      filename: finalFilename,
      size: blob.size,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      url: null,
      filename: "",
      size: 0,
      error: `Failed to export audit report: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// Export Anomaly Detection Results
export function exportAnomalyResults(
  results: AnomalyDetectionResult[],
  options: Partial<ExportOptions> = {},
): ExportResult {
  try {
    const { filename } = options;

    const lines: string[] = [
      "ANOMALY DETECTION REPORT",
      "© Ervin Remus Radosavlevici — Private License / NDA",
      "",
      `Generated: ${new Date().toISOString()}`,
      `Total Anomalies: ${results.length}`,
      "",
      "DETECTED ANOMALIES:",
      "",
    ];

    for (const result of results) {
      lines.push(`[${result.severity.toUpperCase()}] ${result.anomalyType}`);
      lines.push(`  Score: ${result.anomalyScore}/100`);
      lines.push(`  Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      lines.push(`  Description: ${result.description}`);
      if (result.evidenceId) {
        lines.push(`  Evidence ID: ${result.evidenceId}`);
      }
      lines.push("  Recommendations:");
      result.recommendations.forEach((rec) => lines.push(`    - ${rec}`));
      lines.push("  Legal Implications:");
      result.legalImplications.forEach((imp) => lines.push(`    - ${imp}`));
      lines.push("");
    }

    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const finalFilename =
      filename || `NDA-anomaly-report-${new Date().toISOString().slice(0, 10)}-${Date.now()}.txt`;

    return {
      success: true,
      data: blob,
      url: URL.createObjectURL(blob),
      filename: finalFilename,
      size: blob.size,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      url: null,
      filename: "",
      size: 0,
      error: `Failed to export anomaly results: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// Export Threat Report
export function exportThreatReport(
  reports: ThreatReport[],
  options: Partial<ExportOptions> = {},
): ExportResult {
  try {
    const { filename } = options;

    const lines: string[] = [
      "THREAT INTELLIGENCE REPORT",
      "© Ervin Remus Radosavlevici — Private License / NDA",
      "",
      `Generated: ${new Date().toISOString()}`,
      `Total Reports: ${reports.length}`,
      "",
      "THREAT ANALYSIS:",
      "",
    ];

    for (const report of reports) {
      lines.push(`Incident ID: ${report.incidentId}`);
      lines.push(`Threat Score: ${report.threatScore}/100`);
      lines.push(`Threat Level: ${report.threatLevel.toUpperCase()}`);
      lines.push(`Summary: ${report.summary}`);
      lines.push("");
      lines.push("Matched Indicators:");
      report.indicators.forEach((indicator) => {
        lines.push(`  - ${indicator.name} (${indicator.severity})`);
      });
      lines.push("");
      lines.push("Recommendations:");
      report.recommendations.forEach((rec) => lines.push(`  - ${rec}`));
      lines.push("");
      lines.push("Legal Implications:");
      report.legalImplications.forEach((imp) => lines.push(`  - ${imp}`));
      lines.push("-".repeat(80));
      lines.push("");
    }

    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const finalFilename =
      filename || `NDA-threat-report-${new Date().toISOString().slice(0, 10)}-${Date.now()}.txt`;

    return {
      success: true,
      data: blob,
      url: URL.createObjectURL(blob),
      filename: finalFilename,
      size: blob.size,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      url: null,
      filename: "",
      size: 0,
      error: `Failed to export threat report: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// Universal export function
export function exportData(
  data: unknown,
  type: "incidents" | "sentinel" | "audit" | "anomalies" | "threats",
  format: ExportFormat,
  options: Partial<ExportOptions> = {},
): ExportResult {
  switch (type) {
    case "incidents":
      if (!Array.isArray(data))
        return { success: false, error: "Invalid data for incidents export" };
      switch (format) {
        case "json":
          return exportToJSON(data as Incident[], options);
        case "csv":
          return exportToCSV(data as Incident[], options);
        case "txt":
          return exportToTXT(data as Incident[], options);
        default:
          return exportToJSON(data as Incident[], options);
      }

    case "sentinel":
      if (!data || typeof data !== "object")
        return { success: false, error: "Invalid data for sentinel export" };
      return exportSentinelReport(
        (data as { report: SentinelReport }).report,
        (data as { interferenceLogs: unknown[] }).interferenceLogs,
        options,
      );

    case "audit":
      if (!data || typeof data !== "object")
        return { success: false, error: "Invalid data for audit export" };
      return exportAuditReport(data as AuditReport, options);

    case "anomalies":
      if (!Array.isArray(data))
        return { success: false, error: "Invalid data for anomalies export" };
      return exportAnomalyResults(data as AnomalyDetectionResult[], options);

    case "threats":
      if (!Array.isArray(data)) return { success: false, error: "Invalid data for threats export" };
      return exportThreatReport(data as ThreatReport[], options);

    default:
      return { success: false, error: `Unknown export type: ${type}` };
  }
}

// Download export
export function downloadExport(result: ExportResult): boolean {
  if (!result.success || !result.url || !result.filename) {
    return false;
  }

  try {
    const a = document.createElement("a");
    a.href = result.url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(result.url);
    return true;
  } catch (error) {
    return false;
  }
}

// Helper functions
function countClassifications(incidents: Incident[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const incident of incidents) {
    counts[incident.classification] = (counts[incident.classification] || 0) + 1;
  }
  return counts;
}

function countCategories(incidents: Incident[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const incident of incidents) {
    for (const [category, enabled] of Object.entries(incident.categories || {})) {
      if (enabled) {
        counts[category] = (counts[category] || 0) + 1;
      }
    }
  }
  return counts;
}

function getDateRange(incidents: Incident[]): { earliest?: string; latest?: string } {
  if (incidents.length === 0) return {};

  const timestamps = incidents.map((i) => i.timestamp).filter(Boolean) as string[];
  if (timestamps.length === 0) return {};

  const sorted = [...timestamps].sort();
  return {
    earliest: sorted[0],
    latest: sorted[sorted.length - 1],
  };
}

function formatCategories(categories: Record<string, boolean> | undefined): string {
  if (!categories) return "None";
  return Object.entries(categories)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key)
    .join(", ");
}

function escapeCSV(value: string): string {
  if (value === undefined || value === null) return "";

  const stringValue = String(value);

  // If the value contains quotes, comma, or newline, wrap in quotes and escape internal quotes
  if (stringValue.includes('"') || stringValue.includes(",") || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}
