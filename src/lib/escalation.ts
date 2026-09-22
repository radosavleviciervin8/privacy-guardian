// © Ervin Remus Radosavlevici — Private License. Confidential, NDA-bound.
// Incident escalation workflow system with automated notifications and procedures.

import { type Incident, type SensitivityLevel } from "./evidence";
import { type AnomalyDetectionResult } from "./ai-detection";
import { type ThreatReport } from "./threat-intel";
import { logAudit } from "./audit";

export type EscalationLevel = "info" | "low" | "medium" | "high" | "critical";

export interface EscalationRule {
  id: string;
  name: string;
  description: string;
  conditions: {
    sensitivity?: SensitivityLevel[];
    classifications?: string[];
    anomalyTypes?: string[];
    threatLevels?: EscalationLevel[];
    anomalyScore?: { min?: number; max?: number };
    keywords?: string[];
  };
  escalationLevel: EscalationLevel;
  actions: EscalationAction[];
  priority: number;
  autoEscalate: boolean;
}

export interface EscalationAction {
  type:
    "notify" | "alert" | "report" | "archive" | "quarantine" | "legal_review" | "authority_contact";
  target: string; // user, role, email, api endpoint, etc.
  method: "in_app" | "email" | "sms" | "api" | "manual";
  template?: string;
  delay?: number; // minutes
  required: boolean;
}

export interface Escalation {
  id: string;
  incidentId: string;
  timestamp: string;
  level: EscalationLevel;
  triggeredBy: string;
  triggeredRules: string[];
  actions: EscalationAction[];
  status: "pending" | "in_progress" | "completed" | "cancelled";
  assignedTo?: string;
  assignedAt?: string;
  completedAt?: string;
  notes?: string;
  evidence?: {
    incident?: Incident;
    anomalies?: AnomalyDetectionResult[];
    threatReports?: ThreatReport[];
  };
}

export interface EscalationConfig {
  enabled: boolean;
  autoEscalate: boolean;
  rules: EscalationRule[];
  notificationChannels: {
    email?: { enabled: boolean; smtpServer: string; from: string };
    sms?: { enabled: boolean; provider: string };
    api?: { enabled: boolean; endpoints: string[] };
  };
  defaultRecipients: string[];
}

// Default escalation rules
const DEFAULT_ESCALATION_RULES: EscalationRule[] = [
  {
    id: "er-001",
    name: "Critical Threat Detection",
    description: "Escalate when critical threats are detected",
    conditions: {
      anomalyTypes: ["signal_jamming", "rf_interference", "network_scanning"],
      threatLevels: ["critical", "high"],
      anomalyScore: { min: 90 },
    },
    escalationLevel: "critical",
    actions: [
      {
        type: "alert",
        target: "admin",
        method: "in_app",
        required: true,
      },
      {
        type: "notify",
        target: "security-team",
        method: "email",
        template: "critical_threat_alert",
        required: true,
      },
      {
        type: "report",
        target: "legal",
        method: "manual",
        template: "legal_review_request",
        required: false,
      },
    ],
    priority: 100,
    autoEscalate: true,
  },
  {
    id: "er-002",
    name: "Quarantined Evidence",
    description: "Escalate when evidence is quarantined",
    conditions: {
      keywords: ["[QUARANTINED]"],
    },
    escalationLevel: "high",
    actions: [
      {
        type: "alert",
        target: "admin",
        method: "in_app",
        required: true,
      },
      {
        type: "quarantine",
        target: "system",
        method: "in_app",
        required: true,
      },
      {
        type: "legal_review",
        target: "legal-team",
        method: "manual",
        required: true,
      },
    ],
    priority: 95,
    autoEscalate: true,
  },
  {
    id: "er-003",
    name: "Restricted Sensitivity Evidence",
    description: "Escalate when restricted sensitivity evidence is recorded",
    conditions: {
      sensitivity: ["restricted"],
    },
    escalationLevel: "high",
    actions: [
      {
        type: "notify",
        target: "supervisor",
        method: "in_app",
        required: true,
      },
      {
        type: "report",
        target: "compliance",
        method: "manual",
        template: "compliance_review",
        required: false,
      },
    ],
    priority: 90,
    autoEscalate: false,
  },
  {
    id: "er-004",
    name: "Multi-Signal Correlation",
    description: "Escalate when multiple signal types are correlated",
    conditions: {
      anomalyTypes: ["multi_signal_correlation"],
      anomalyScore: { min: 70 },
    },
    escalationLevel: "medium",
    actions: [
      {
        type: "notify",
        target: "analyst",
        method: "in_app",
        required: true,
      },
      {
        type: "report",
        target: "investigation",
        method: "manual",
        template: "investigation_request",
        required: false,
      },
    ],
    priority: 85,
    autoEscalate: true,
  },
  {
    id: "er-005",
    name: "Surveillance Concern",
    description: "Escalate when surveillance concerns are recorded",
    conditions: {
      classifications: ["Surveillance concern", "Unwanted monitoring concern"],
    },
    escalationLevel: "high",
    actions: [
      {
        type: "alert",
        target: "security",
        method: "in_app",
        required: true,
      },
      {
        type: "authority_contact",
        target: "law-enforcement",
        method: "manual",
        template: "authority_contact_guide",
        required: false,
      },
    ],
    priority: 88,
    autoEscalate: false,
  },
  {
    id: "er-006",
    name: "Data Tampering Detected",
    description: "Escalate when data tampering is detected",
    conditions: {
      anomalyTypes: ["data_tampering"],
      anomalyScore: { min: 50 },
    },
    escalationLevel: "critical",
    actions: [
      {
        type: "alert",
        target: "admin",
        method: "in_app",
        required: true,
      },
      {
        type: "quarantine",
        target: "system",
        method: "in_app",
        required: true,
      },
      {
        type: "legal_review",
        target: "legal",
        method: "manual",
        required: true,
      },
      {
        type: "authority_contact",
        target: "law-enforcement",
        method: "manual",
        template: "tampering_report",
        required: false,
      },
    ],
    priority: 100,
    autoEscalate: true,
  },
  {
    id: "er-007",
    name: "Confidential Sensitivity",
    description: "Escalate when confidential sensitivity evidence is recorded",
    conditions: {
      sensitivity: ["confidential"],
    },
    escalationLevel: "medium",
    actions: [
      {
        type: "notify",
        target: "supervisor",
        method: "in_app",
        required: false,
      },
    ],
    priority: 75,
    autoEscalate: false,
  },
  {
    id: "er-008",
    name: "Signal Jamming",
    description: "Escalate when signal jamming is detected",
    conditions: {
      anomalyTypes: ["signal_jamming"],
    },
    escalationLevel: "critical",
    actions: [
      {
        type: "alert",
        target: "admin",
        method: "in_app",
        required: true,
      },
      {
        type: "authority_contact",
        target: "regulatory-authority",
        method: "manual",
        template: "jamming_report",
        required: true,
      },
    ],
    priority: 98,
    autoEscalate: true,
  },
  {
    id: "er-009",
    name: "Bluetooth Spoofing",
    description: "Escalate when Bluetooth spoofing is detected",
    conditions: {
      anomalyTypes: ["bluetooth_spoofing"],
      anomalyScore: { min: 70 },
    },
    escalationLevel: "high",
    actions: [
      {
        type: "notify",
        target: "security",
        method: "in_app",
        required: true,
      },
      {
        type: "report",
        target: "it",
        method: "manual",
        template: "spoofing_investigation",
        required: false,
      },
    ],
    priority: 85,
    autoEscalate: true,
  },
  {
    id: "er-010",
    name: "GPS Anomaly",
    description: "Escalate when GPS anomalies are detected",
    conditions: {
      anomalyTypes: ["geolocation_anomaly"],
      anomalyScore: { min: 60 },
    },
    escalationLevel: "medium",
    actions: [
      {
        type: "notify",
        target: "user",
        method: "in_app",
        template: "gps_anomaly_notice",
        required: true,
      },
    ],
    priority: 80,
    autoEscalate: true,
  },
];

// Default configuration
const DEFAULT_CONFIG: EscalationConfig = {
  enabled: true,
  autoEscalate: true,
  rules: DEFAULT_ESCALATION_RULES,
  notificationChannels: {
    email: { enabled: false, smtpServer: "", from: "" },
    sms: { enabled: false, provider: "" },
    api: { enabled: false, endpoints: [] },
  },
  defaultRecipients: ["admin"],
};

// Escalation templates
const ESCALATION_TEMPLATES: Record<string, string> = {
  critical_threat_alert: `
CRITICAL THREAT ALERT

Incident ID: {incidentId}
Timestamp: {timestamp}
Threat Level: CRITICAL

Description: {description}

Detected Anomalies:
{anomalies}

Recommended Actions:
1. Immediate investigation required
2. Preserve all evidence
3. Contact security team
4. Consider law enforcement notification

This is an automated alert from the NDA Multi-Signal Defensive Protection System.
© Ervin Remus Radosavlevici — Private License / NDA
`,

  legal_review_request: `
LEGAL REVIEW REQUEST

Incident ID: {incidentId}
Classification: {classification}
Sensitivity: {sensitivity}

Observation: {observation}

Technical Reference: {technical}

Categories: {categories}

This incident has been flagged for legal review due to:
{reasons}

Please review and advise on appropriate legal actions.

© Ervin Remus Radosavlevici — Private License / NDA
`,

  authority_contact_guide: `
AUTHORITY CONTACT GUIDE

Incident ID: {incidentId}
Type: {type}

This incident may require reporting to law enforcement or regulatory authorities.

Recommended Contacts:
- Local Law Enforcement: [Emergency number]
- Cyber Crime Unit: [Contact information]
- Regulatory Authority: [Contact information]
- Aviation Authority (for drone incidents): [Contact information]

Evidence to Preserve:
- All incident records
- Sentinel reports
- Audit logs
- Screenshots
- Any physical evidence

Legal References:
{legalReferences}

© Ervin Remus Radosavlevici — Private License / NDA
`,

  tampering_report: `
DATA TAMPERING REPORT

Incident ID: {incidentId}
Timestamp: {timestamp}

Tampering Evidence:
{tamperingEvidence}

Affected Records:
{affectedRecords}

Recommended Actions:
1. Isolate affected systems
2. Preserve forensic evidence
3. Do not modify any data
4. Contact cybersecurity experts
5. Consider legal action

This is a serious security incident requiring immediate attention.

© Ervin Remus Radosavlevici — Private License / NDA
`,

  jamming_report: `
SIGNAL JAMMING REPORT

Incident ID: {incidentId}
Timestamp: {timestamp}

Detected Jamming:
{jammingDetails}

Affected Frequencies/Signals:
{affectedSignals}

Recommended Actions:
1. Document exact time, location, and affected signals
2. Use spectrum analyzer to identify jamming source
3. Report to regulatory authorities (FCC, ITU, etc.)
4. Preserve all technical evidence
5. Consider legal action against jammers

Signal jamming is illegal in most jurisdictions.

© Ervin Remus Radosavlevici — Private License / NDA
`,

  investigation_request: `
INVESTIGATION REQUEST

Incident ID: {incidentId}
Classification: {classification}

Observation: {observation}

Technical Details:
{technicalDetails}

Anomalies Detected:
{anomalies}

Requesting thorough investigation of this incident.

© Ervin Remus Radosavlevici — Private License / NDA
`,

  compliance_review: `
COMPLIANCE REVIEW REQUEST

Incident ID: {incidentId}
Sensitivity: {sensitivity}

This incident involves sensitive data and requires compliance review.

Data Classification: {classification}
Categories: {categories}

Compliance Checklist:
- [ ] Data minimisation verified
- [ ] Purpose limitation confirmed
- [ ] Storage limitation checked
- [ ] Legal basis established
- [ ] Privacy impact assessed

© Ervin Remus Radosavlevici — Private License / NDA
`,

  gps_anomaly_notice: `
GPS ANOMALY NOTICE

Incident ID: {incidentId}
Timestamp: {timestamp}

Anomaly Detected: {anomalyType}
Confidence: {confidence}%

Description: {description}

Your location data may have been compromised or manipulated.

Recommended Actions:
1. Verify your current location using alternative methods
2. Check device GPS settings
3. Review recent location history
4. Consider device security scan

© Ervin Remus Radosavlevici — Private License / NDA
`,

  spoofing_investigation: `
SPOOFING INVESTIGATION REQUEST

Incident ID: {incidentId}
Timestamp: {timestamp}

Spoofing Type: {spoofingType}
Affected Signal: {signalType}

Description: {description}

Investigation Required:
1. Identify spoofing source
2. Assess impact on data integrity
3. Implement countermeasures
4. Review security protocols

© Ervin Remus Radosavlevici — Private License / NDA
`,
};

// Escalation Manager
export class EscalationManager {
  private config: EscalationConfig;
  private escalations: Map<string, Escalation>;
  private notifications: Map<string, { timestamp: string; read: boolean; content: string }>;

  constructor(config: Partial<EscalationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.escalations = new Map();
    this.notifications = new Map();
    this.loadFromStorage();
  }

  // Check if incident should be escalated
  checkEscalation(
    incident: Incident,
    anomalies?: AnomalyDetectionResult[],
    threatReports?: ThreatReport[],
  ): { shouldEscalate: boolean; rules: EscalationRule[]; level: EscalationLevel } {
    const matchingRules: EscalationRule[] = [];
    let maxLevel: EscalationLevel = "info";

    for (const rule of this.config.rules) {
      if (this.incidentMatchesRule(incident, rule, anomalies, threatReports)) {
        matchingRules.push(rule);
        if (this.getLevelPriority(rule.escalationLevel) > this.getLevelPriority(maxLevel)) {
          maxLevel = rule.escalationLevel;
        }
      }
    }

    return {
      shouldEscalate: matchingRules.length > 0,
      rules: matchingRules,
      level: maxLevel,
    };
  }

  // Create escalation
  createEscalation(
    incident: Incident,
    triggeredBy: string,
    triggeredRules: string[],
    level: EscalationLevel,
    anomalies?: AnomalyDetectionResult[],
    threatReports?: ThreatReport[],
  ): Escalation {
    const escalation: Escalation = {
      id: this.generateEscalationId(),
      incidentId: incident.id,
      timestamp: new Date().toISOString(),
      level,
      triggeredBy,
      triggeredRules,
      actions: this.getActionsForRules(triggeredRules),
      status: "pending",
      evidence: {
        incident,
        anomalies,
        threatReports,
      },
    };

    this.escalations.set(escalation.id, escalation);
    this.saveToStorage();

    // Log audit event
    logAudit(
      "ESCALATE",
      level === "critical" ? "CRITICAL" : level === "high" ? "WARNING" : "INFO",
      `Escalation created: ${escalation.id} for incident ${incident.id}`,
    );

    // Auto-escalate if configured
    if (this.config.autoEscalate) {
      this.autoExecuteActions(escalation);
    }

    // Create notification
    this.createNotification(escalation);

    return escalation;
  }

  // Auto-execute actions
  private autoExecuteActions(escalation: Escalation): void {
    for (const action of escalation.actions) {
      if (action.required && action.method === "in_app") {
        this.executeAction(action, escalation);
      }
    }
  }

  // Execute an action
  executeAction(action: EscalationAction, escalation: Escalation): boolean {
    switch (action.type) {
      case "notify":
        return this.sendNotification(action, escalation);
      case "alert":
        return this.sendAlert(action, escalation);
      case "report":
        return this.generateReport(action, escalation);
      case "archive":
        return this.archiveIncident(escalation);
      case "quarantine":
        return this.quarantineIncident(escalation);
      case "legal_review":
        return this.requestLegalReview(escalation);
      case "authority_contact":
        return this.contactAuthority(escalation);
      default:
        return false;
    }
  }

  // Send notification
  private sendNotification(action: EscalationAction, escalation: Escalation): boolean {
    const content = this.generateActionContent(action, escalation);
    const notificationId = this.generateEscalationId();

    this.notifications.set(notificationId, {
      timestamp: new Date().toISOString(),
      read: false,
      content,
    });

    this.saveToStorage();
    return true;
  }

  // Send alert
  private sendAlert(action: EscalationAction, escalation: Escalation): boolean {
    // In a real implementation, this would send to alert systems
    // For now, just create a notification
    return this.sendNotification(action, escalation);
  }

  // Generate report
  private generateReport(action: EscalationAction, escalation: Escalation): boolean {
    // Generate report content
    const content = this.generateActionContent(action, escalation);

    // In a real implementation, this would generate and store a report
    // For now, just log it
    logAudit("REPORT_GENERATED", "INFO", `Report generated for escalation: ${escalation.id}`);
    return true;
  }

  // Archive incident
  private archiveIncident(escalation: Escalation): boolean {
    // In a real implementation, this would archive the incident
    // For now, just log it
    logAudit(
      "ARCHIVE_ESCALATION",
      "INFO",
      `Incident archived via escalation: ${escalation.incidentId}`,
    );
    return true;
  }

  // Quarantine incident
  private quarantineIncident(escalation: Escalation): boolean {
    // In a real implementation, this would quarantine the incident
    // For now, just log it
    logAudit(
      "QUARANTINE_ESCALATION",
      "WARNING",
      `Incident quarantined via escalation: ${escalation.incidentId}`,
    );
    return true;
  }

  // Request legal review
  private requestLegalReview(escalation: Escalation): boolean {
    // In a real implementation, this would create a legal review request
    // For now, just log it
    logAudit(
      "LEGAL_REVIEW_REQUESTED",
      "INFO",
      `Legal review requested for escalation: ${escalation.id}`,
    );
    return true;
  }

  // Contact authority
  private contactAuthority(escalation: Escalation): boolean {
    // In a real implementation, this would contact authorities
    // For now, just log it
    logAudit(
      "AUTHORITY_CONTACT",
      "CRITICAL",
      `Authority contact initiated for escalation: ${escalation.id}`,
    );
    return true;
  }

  // Get escalation by ID
  getEscalation(escalationId: string): Escalation | undefined {
    return this.escalations.get(escalationId);
  }

  // Get escalations for an incident
  getEscalationsForIncident(incidentId: string): Escalation[] {
    return Array.from(this.escalations.values())
      .filter((e) => e.incidentId === incidentId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Get all escalations
  getAllEscalations(): Escalation[] {
    return Array.from(this.escalations.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }

  // Get escalations by status
  getEscalationsByStatus(status: Escalation["status"]): Escalation[] {
    return Array.from(this.escalations.values())
      .filter((e) => e.status === status)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Get escalations by level
  getEscalationsByLevel(level: EscalationLevel): Escalation[] {
    return Array.from(this.escalations.values())
      .filter((e) => e.level === level)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Get pending escalations
  getPendingEscalations(): Escalation[] {
    return this.getEscalationsByStatus("pending");
  }

  // Update escalation status
  updateEscalationStatus(
    escalationId: string,
    status: Escalation["status"],
    assignedTo?: string,
    notes?: string,
  ): Escalation | undefined {
    const escalation = this.escalations.get(escalationId);
    if (!escalation) return undefined;

    escalation.status = status;
    if (assignedTo) {
      escalation.assignedTo = assignedTo;
      escalation.assignedAt = new Date().toISOString();
    }
    if (notes) {
      escalation.notes = notes;
    }
    if (status === "completed") {
      escalation.completedAt = new Date().toISOString();
    }

    this.escalations.set(escalationId, escalation);
    this.saveToStorage();

    logAudit("ESCALATION_UPDATE", "INFO", `Escalation ${escalationId} status updated to ${status}`);

    return escalation;
  }

  // Assign escalation
  assignEscalation(escalationId: string, assignedTo: string): Escalation | undefined {
    return this.updateEscalationStatus(escalationId, "in_progress", assignedTo);
  }

  // Complete escalation
  completeEscalation(escalationId: string, notes?: string): Escalation | undefined {
    return this.updateEscalationStatus(escalationId, "completed", undefined, notes);
  }

  // Cancel escalation
  cancelEscalation(escalationId: string, notes?: string): Escalation | undefined {
    return this.updateEscalationStatus(escalationId, "cancelled", undefined, notes);
  }

  // Get notifications
  getNotifications(): { id: string; timestamp: string; read: boolean; content: string }[] {
    return Array.from(this.notifications.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }

  // Get unread notifications
  getUnreadNotifications(): { id: string; timestamp: string; read: boolean; content: string }[] {
    return this.getNotifications().filter((n) => !n.read);
  }

  // Mark notification as read
  markNotificationAsRead(notificationId: string): boolean {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.read = true;
      this.notifications.set(notificationId, notification);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Mark all notifications as read
  markAllNotificationsAsRead(): void {
    for (const [id, notification] of this.notifications) {
      notification.read = true;
      this.notifications.set(id, notification);
    }
    this.saveToStorage();
  }

  // Get escalation statistics
  getStatistics(): {
    totalEscalations: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    byLevel: Record<EscalationLevel, number>;
    unreadNotifications: number;
  } {
    const allEscalations = this.getAllEscalations();
    const byLevel: Record<EscalationLevel, number> = {
      info: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    for (const escalation of allEscalations) {
      byLevel[escalation.level] = (byLevel[escalation.level] || 0) + 1;
    }

    return {
      totalEscalations: allEscalations.length,
      pending: this.getEscalationsByStatus("pending").length,
      inProgress: this.getEscalationsByStatus("in_progress").length,
      completed: this.getEscalationsByStatus("completed").length,
      cancelled: this.getEscalationsByStatus("cancelled").length,
      byLevel,
      unreadNotifications: this.getUnreadNotifications().length,
    };
  }

  // Enable/disable escalation
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    this.saveConfig();
  }

  // Enable/disable auto escalation
  setAutoEscalate(enabled: boolean): void {
    this.config.autoEscalate = enabled;
    this.saveConfig();
  }

  // Add custom rule
  addRule(rule: EscalationRule): void {
    this.config.rules.push(rule);
    this.config.rules.sort((a, b) => b.priority - a.priority);
    this.saveConfig();
  }

  // Remove rule
  removeRule(id: string): void {
    this.config.rules = this.config.rules.filter((r) => r.id !== id);
    this.saveConfig();
  }

  // Update rule
  updateRule(id: string, updates: Partial<EscalationRule>): void {
    const index = this.config.rules.findIndex((r) => r.id === id);
    if (index !== -1) {
      this.config.rules[index] = { ...this.config.rules[index], ...updates };
      this.config.rules.sort((a, b) => b.priority - a.priority);
      this.saveConfig();
    }
  }

  // Get configuration
  getConfig(): EscalationConfig {
    return { ...this.config };
  }

  // Get escalation rules
  getRules(): EscalationRule[] {
    return [...this.config.rules];
  }

  // Get escalation templates
  getTemplates(): Record<string, string> {
    return { ...ESCALATION_TEMPLATES };
  }

  // Private methods
  private generateEscalationId(): string {
    return typeof crypto?.randomUUID === "function"
      ? crypto.randomUUID()
      : `escalation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private incidentMatchesRule(
    incident: Incident,
    rule: EscalationRule,
    anomalies?: AnomalyDetectionResult[],
    threatReports?: ThreatReport[],
  ): boolean {
    // Check sensitivity
    if (rule.conditions.sensitivity) {
      const incidentSensitivity = (incident.sensitivity || "internal").toLowerCase();
      if (!rule.conditions.sensitivity.includes(incidentSensitivity as SensitivityLevel)) {
        return false;
      }
    }

    // Check classifications
    if (rule.conditions.classifications) {
      const incidentClassification = incident.classification || "";
      if (!rule.conditions.classifications.some((c) => incidentClassification.includes(c))) {
        return false;
      }
    }

    // Check anomaly types
    if (rule.conditions.anomalyTypes && anomalies) {
      const matchingAnomalyTypes = anomalies.filter((a) =>
        rule.conditions.anomalyTypes!.includes(a.anomalyType),
      );
      if (matchingAnomalyTypes.length === 0) return false;
    }

    // Check threat levels
    if (rule.conditions.threatLevels && threatReports) {
      const matchingThreatLevels = threatReports.filter((r) =>
        rule.conditions.threatLevels!.includes(r.threatLevel as EscalationLevel),
      );
      if (matchingThreatLevels.length === 0) return false;
    }

    // Check anomaly score
    if (rule.conditions.anomalyScore && anomalies) {
      const maxScore = Math.max(...anomalies.map((a) => a.anomalyScore));
      if (rule.conditions.anomalyScore.min && maxScore < rule.conditions.anomalyScore.min)
        return false;
      if (rule.conditions.anomalyScore.max && maxScore > rule.conditions.anomalyScore.max)
        return false;
    }

    // Check keywords
    if (rule.conditions.keywords) {
      const text =
        `${incident.observation} ${incident.technical} ${incident.classification}`.toLowerCase();
      const matchingKeywords = rule.conditions.keywords.filter((kw) =>
        text.includes(kw.toLowerCase()),
      );
      if (matchingKeywords.length === 0) return false;
    }

    return true;
  }

  private getActionsForRules(ruleIds: string[]): EscalationAction[] {
    const actions: EscalationAction[] = [];
    const seenActions = new Set<string>();

    for (const ruleId of ruleIds) {
      const rule = this.config.rules.find((r) => r.id === ruleId);
      if (rule) {
        for (const action of rule.actions) {
          const actionKey = `${action.type}-${action.target}-${action.method}`;
          if (!seenActions.has(actionKey)) {
            actions.push(action);
            seenActions.add(actionKey);
          }
        }
      }
    }

    return actions;
  }

  private getLevelPriority(level: EscalationLevel): number {
    const priorities: Record<EscalationLevel, number> = {
      info: 1,
      low: 2,
      medium: 3,
      high: 4,
      critical: 5,
    };
    return priorities[level] || 0;
  }

  private generateActionContent(action: EscalationAction, escalation: Escalation): string {
    const template = ESCALATION_TEMPLATES[action.template || ""] || "";
    const incident = escalation.evidence?.incident;
    const anomalies = escalation.evidence?.anomalies || [];

    let content = template
      .replace(/\{incidentId\}/g, escalation.incidentId)
      .replace(/\{timestamp\}/g, escalation.timestamp)
      .replace(/\{classification\}/g, incident?.classification || "")
      .replace(/\{sensitivity\}/g, incident?.sensitivity || "")
      .replace(/\{observation\}/g, incident?.observation || "")
      .replace(/\{technical\}/g, incident?.technical || "")
      .replace(/\{categories\}/g, this.formatCategories(incident?.categories))
      .replace(/\{level\}/g, escalation.level.toUpperCase())
      .replace(/\{type\}/g, action.type);

    // Add anomalies
    if (anomalies.length > 0) {
      const anomaliesText = anomalies
        .map((a) => `  - ${a.anomalyType}: ${a.description}`)
        .join("\n");
      content = content.replace(/\{anomalies\}/g, anomaliesText);
    }

    // Add legal references
    const legalReferences = anomalies.flatMap((a) => a.legalImplications).join(", ");
    content = content.replace(/\{legalReferences\}/g, legalReferences || "None");

    return content;
  }

  private formatCategories(categories?: Record<string, boolean>): string {
    if (!categories) return "None";
    return Object.entries(categories)
      .filter(([_, enabled]) => enabled)
      .map(([key]) => key)
      .join(", ");
  }

  private loadFromStorage(): void {
    try {
      if (typeof localStorage !== "undefined") {
        const escalationsJson = localStorage.getItem("sentinel_escalations");
        if (escalationsJson) {
          const escalations = JSON.parse(escalationsJson) as Escalation[];
          this.escalations = new Map(escalations.map((e) => [e.id, e]));
        }

        const notificationsJson = localStorage.getItem("sentinel_escalation_notifications");
        if (notificationsJson) {
          const notifications = JSON.parse(notificationsJson) as {
            id: string;
            timestamp: string;
            read: boolean;
            content: string;
          }[];
          this.notifications = new Map(notifications.map((n) => [n.id, n]));
        }
      }
    } catch {
      this.escalations = new Map();
      this.notifications = new Map();
    }
  }

  private saveToStorage(): void {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(
          "sentinel_escalations",
          JSON.stringify(Array.from(this.escalations.values())),
        );
        localStorage.setItem(
          "sentinel_escalation_notifications",
          JSON.stringify(Array.from(this.notifications.values())),
        );
      }
    } catch {
      // Storage full or other error
    }
  }

  private saveConfig(): void {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("sentinel_escalation_config", JSON.stringify(this.config));
      }
    } catch {
      // Ignore
    }
  }
}

// Singleton instance
export const escalationManager = new EscalationManager();

// Escalation utilities
export function checkAndEscalate(
  incident: Incident,
  anomalies?: AnomalyDetectionResult[],
  threatReports?: ThreatReport[],
): { shouldEscalate: boolean; escalation?: Escalation } {
  const { shouldEscalate, rules, level } = escalationManager.checkEscalation(
    incident,
    anomalies,
    threatReports,
  );

  if (shouldEscalate && rules.length > 0) {
    const escalation = escalationManager.createEscalation(
      incident,
      "automatic",
      rules.map((r) => r.id),
      level,
      anomalies,
      threatReports,
    );
    return { shouldEscalate: true, escalation };
  }

  return { shouldEscalate: false };
}

export function getPendingEscalations(): Escalation[] {
  return escalationManager.getPendingEscalations();
}

export function getEscalationStatistics() {
  return escalationManager.getStatistics();
}
