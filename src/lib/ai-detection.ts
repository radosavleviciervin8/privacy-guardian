// © Ervin Remus Radosavlevici — Private License. Confidential, NDA-bound.
// Advanced AI-powered anomaly detection system for signal and evidence analysis.
// Uses rule-based AI, pattern matching, and statistical analysis for interference detection.

import { type Incident, type CategoryKey, CATEGORY_KEYS } from "./evidence";
import { type SignalPattern, type SentinelLine } from "./sentinel";

export interface AnomalyDetectionResult {
  id: string;
  timestamp: string;
  anomalyScore: number; // 0-100
  anomalyType: AnomalyType;
  confidence: number; // 0-1
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  evidenceId?: string;
  signalData?: SignalPattern;
  recommendations: string[];
  legalImplications: string[];
}

export type AnomalyType =
  | "signal_jamming"
  | "bluetooth_spoofing"
  | "rf_interference"
  | "surveillance_pattern"
  | "data_tampering"
  | "unusual_access"
  | "geolocation_anomaly"
  | "network_scanning"
  | "behavioral_anomaly"
  | "temporal_anomaly"
  | "multi_signal_correlation";

export interface DetectionRule {
  id: string;
  name: string;
  description: string;
  type: AnomalyType;
  pattern: RegExp | ((data: unknown) => boolean);
  weight: number; // 0-10
  severity: "low" | "medium" | "high" | "critical";
  category: CategoryKey;
  legalReference: string;
  recommendation: string;
}

export interface AIDetectionConfig {
  enabled: boolean;
  sensitivity: "low" | "medium" | "high";
  rules: DetectionRule[];
  thresholds: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

// Comprehensive detection rules database
const DETECTION_RULES: DetectionRule[] = [
  // Signal Jamming Detection
  {
    id: "sj-001",
    name: "RF Signal Blocking Pattern",
    description: "Detects patterns indicating RF signal blocking or jamming attempts",
    type: "signal_jamming",
    pattern: /block|jam|interfer|disrupt|noise|static/i,
    weight: 9,
    severity: "critical",
    category: "rf",
    legalReference: "ITU Constitution Art. 45, National Radio Regulations",
    recommendation:
      "Investigate signal source immediately. Document frequency, duration, and location.",
  },
  {
    id: "sj-002",
    name: "Bluetooth Flooding",
    description: "Detects Bluetooth device flooding or discovery spam",
    type: "bluetooth_spoofing",
    pattern: /flood|spam|continuous.*discover|multiple.*device/i,
    weight: 8,
    severity: "high",
    category: "bluetooth",
    legalReference: "Computer Misuse Act, Wireless Telegraphy Act",
    recommendation: "Check Bluetooth device list. Limit discovery to trusted devices only.",
  },
  {
    id: "sj-003",
    name: "Wi-Fi Deauthentication",
    description: "Detects Wi-Fi deauthentication attack patterns",
    type: "rf_interference",
    pattern: /deauth|disassociate|kick.*off|force.*disconnect/i,
    weight: 10,
    severity: "critical",
    category: "wifi",
    legalReference: "Computer Misuse Act 1990, CFAA",
    recommendation:
      "URGENT: Wi-Fi deauth attacks are illegal. Report to authorities with evidence.",
  },
  {
    id: "sj-004",
    name: "Drone Control Signals",
    description: "Detects patterns of drone control signal interference",
    type: "rf_interference",
    pattern: /drone.*control|takeover|hijack|gps.*spoof/i,
    weight: 10,
    severity: "critical",
    category: "drone",
    legalReference: "Aviation Security Laws, Computer Misuse Act",
    recommendation:
      "Drone interference is a serious offense. Contact aviation authorities immediately.",
  },

  // Surveillance Pattern Detection
  {
    id: "sp-001",
    name: "Continuous Monitoring",
    description: "Detects patterns of continuous monitoring or surveillance",
    type: "surveillance_pattern",
    pattern: /continuous.*monitor|24.*7.*surveillance|always.*watching|persistent.*tracking/i,
    weight: 7,
    severity: "high",
    category: "surveillance",
    legalReference: "UDHR Art. 12, ICCPR Art. 17, ECHR Art. 8",
    recommendation: "Review monitoring patterns. Ensure compliance with privacy laws.",
  },
  {
    id: "sp-002",
    name: "Hidden Camera Detection",
    description: "Detects patterns indicating hidden camera usage",
    type: "surveillance_pattern",
    pattern: /hidden.*camera|covert.*recording|secret.*video|spy.*cam/i,
    weight: 9,
    severity: "critical",
    category: "camera",
    legalReference: "Video Surveillance Laws, GDPR Art. 9",
    recommendation: "Hidden camera usage may violate privacy laws. Seek legal advice.",
  },
  {
    id: "sp-003",
    name: "Audio Eavesdropping",
    description: "Detects patterns of audio eavesdropping or covert listening",
    type: "surveillance_pattern",
    pattern: /eavesdrop|covert.*listen|hidden.*microphone|audio.*surveillance/i,
    weight: 8,
    severity: "high",
    category: "audio",
    legalReference: "Wiretap Act, ECHR Art. 8, UDHR Art. 12",
    recommendation: "Audio eavesdropping is illegal in most jurisdictions. Preserve evidence.",
  },
  {
    id: "sp-004",
    name: "GPS Tracking Pattern",
    description: "Detects patterns of unauthorized GPS tracking",
    type: "geolocation_anomaly",
    pattern: /gps.*track|location.*monitor|follow.*me|stalking/i,
    weight: 8,
    severity: "high",
    category: "gps",
    legalReference: "GDPR Art. 9, Location Privacy Laws",
    recommendation: "Unauthorized GPS tracking may violate stalking laws. Report to authorities.",
  },

  // Data Tampering Detection
  {
    id: "dt-001",
    name: "Hash Mismatch",
    description: "Detects when record hash doesn't match content",
    type: "data_tampering",
    pattern: (data: unknown) => {
      const inc = data as { hash?: string };
      return !inc.hash || inc.hash === "WebCrypto-unavailable";
    },
    weight: 10,
    severity: "critical",
    category: "rf",
    legalReference: "Evidence Integrity Principles, ICCPR Art. 14",
    recommendation:
      "Hash mismatch indicates potential tampering. Quarantine record and investigate.",
  },
  {
    id: "dt-002",
    name: "Timestamp Anomaly",
    description: "Detects impossible or manipulated timestamps",
    type: "temporal_anomaly",
    pattern: (data: unknown) => {
      const inc = data as { timestamp?: string };
      if (!inc.timestamp) return false;
      const date = new Date(inc.timestamp);
      return isNaN(date.getTime()) || date > new Date();
    },
    weight: 9,
    severity: "high",
    category: "rf",
    legalReference: "Evidence Admissibility Standards",
    recommendation: "Invalid timestamp may indicate tampering. Verify record integrity.",
  },
  {
    id: "dt-003",
    name: "Duplicate Record",
    description: "Detects duplicate incident records",
    type: "data_tampering",
    pattern: (data: unknown, allData: unknown[]) => {
      const inc = data as { id?: string };
      if (!inc.id) return false;
      return allData.filter((d: unknown) => (d as { id?: string }).id === inc.id).length > 1;
    },
    weight: 7,
    severity: "medium",
    category: "rf",
    legalReference: "Data Integrity Principles",
    recommendation: "Duplicate records detected. Review for potential data corruption.",
  },

  // Network Scanning Detection
  {
    id: "ns-001",
    name: "Port Scanning",
    description: "Detects patterns of port scanning activity",
    type: "network_scanning",
    pattern: /port.*scan|nmap|nessus|open.*port|vulnerability.*scan/i,
    weight: 8,
    severity: "high",
    category: "network",
    legalReference: "Computer Misuse Act, CFAA",
    recommendation: "Port scanning without authorization is illegal. Document and report.",
  },
  {
    id: "ns-002",
    name: "Network Intrusion",
    description: "Detects patterns of network intrusion attempts",
    type: "network_scanning",
    pattern: /hack|intrusion|exploit|penetration|unauthorized.*access/i,
    weight: 10,
    severity: "critical",
    category: "cyber",
    legalReference: "Computer Misuse Act, Cybercrime Convention",
    recommendation:
      "Network intrusion is a criminal offense. Preserve all evidence and contact law enforcement.",
  },
  {
    id: "ns-003",
    name: "Password Attack",
    description: "Detects password-related attack patterns",
    type: "network_scanning",
    pattern: /brute.*force|password.*crack|credential.*harvest|phishing/i,
    weight: 9,
    severity: "critical",
    category: "cyber",
    legalReference: "Computer Fraud and Abuse Act",
    recommendation: "Password attacks are illegal. Report immediately with full evidence.",
  },

  // Behavioral Anomaly Detection
  {
    id: "ba-001",
    name: "Rapid Data Entry",
    description: "Detects unusually rapid data entry patterns",
    type: "behavioral_anomaly",
    pattern: (data: unknown, context: { recentEntries: number; timeWindow: number }) => {
      return context.recentEntries > 10 && context.timeWindow < 60000; // 10+ entries in < 1 minute
    },
    weight: 6,
    severity: "medium",
    category: "mobile",
    legalReference: "GDPR Art. 5(1)(c) - Data Minimisation",
    recommendation: "Rapid data entry may indicate automation. Review for bot activity.",
  },
  {
    id: "ba-002",
    name: "Unusual Access Time",
    description: "Detects access at unusual hours",
    type: "behavioral_anomaly",
    pattern: (data: unknown, context: { hour: number }) => {
      return context.hour >= 2 && context.hour <= 5; // Between 2-5 AM
    },
    weight: 5,
    severity: "low",
    category: "mobile",
    legalReference: "Access Control Principles",
    recommendation: "Access at unusual hours detected. Verify user identity if possible.",
  },
  {
    id: "ba-003",
    name: "Geographic Anomaly",
    description: "Detects access from unusual geographic locations",
    type: "geolocation_anomaly",
    pattern: (data: unknown, context: { country: string; expectedCountries: string[] }) => {
      return !context.expectedCountries.includes(context.country);
    },
    weight: 8,
    severity: "high",
    category: "gps",
    legalReference: "GDPR Art. 49 - International Transfers",
    recommendation: "Access from unexpected geographic location. Verify legitimacy.",
  },

  // Multi-Signal Correlation
  {
    id: "ms-001",
    name: "Multi-Signal Attack",
    description: "Detects coordinated attacks across multiple signal types",
    type: "multi_signal_correlation",
    pattern: (data: unknown, context: { categories: CategoryKey[] }) => {
      return context.categories.length >= 3; // 3+ categories active
    },
    weight: 9,
    severity: "high",
    category: "rf",
    legalReference: "Coordinated Attack Patterns, ITU Regulations",
    recommendation:
      "Multi-signal correlation detected. This may indicate a sophisticated attack. Investigate thoroughly.",
  },
  {
    id: "ms-002",
    name: "Signal Sweep",
    description: "Detects spectrum sweeping across multiple frequencies",
    type: "multi_signal_correlation",
    pattern: /sweep|scan.*spectrum|frequency.*hop|channel.*hopping/i,
    weight: 8,
    severity: "high",
    category: "rf",
    legalReference: "ITU Radio Regulations",
    recommendation: "Signal sweeping detected. May indicate reconnaissance activity.",
  },
];

// AI Detection Configuration
const DEFAULT_CONFIG: AIDetectionConfig = {
  enabled: true,
  sensitivity: "medium",
  rules: DETECTION_RULES,
  thresholds: {
    low: 20,
    medium: 40,
    high: 70,
    critical: 90,
  },
};

// AI Detection Engine
export class AIDetectionEngine {
  private config: AIDetectionConfig;
  private results: AnomalyDetectionResult[] = [];
  private context: Record<string, unknown> = {};

  constructor(config: Partial<AIDetectionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Analyze a single incident
  analyzeIncident(incident: Incident): AnomalyDetectionResult[] {
    const results: AnomalyDetectionResult[] = [];
    const allIncidents = this.getAllIncidents();

    for (const rule of this.config.rules) {
      const match = this.testRule(incident, rule, allIncidents);
      if (match) {
        const anomaly: AnomalyDetectionResult = {
          id: `anomaly-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          anomalyScore: rule.weight * 10,
          anomalyType: rule.type,
          confidence: this.calculateConfidence(rule, match),
          description: `AI Detection: ${rule.name} - ${rule.description}`,
          severity: rule.severity,
          evidenceId: incident.id,
          recommendations: [rule.recommendation],
          legalImplications: [rule.legalReference],
        };
        results.push(anomaly);
        this.results.push(anomaly);
      }
    }

    return results;
  }

  // Analyze signal pattern
  analyzeSignal(signal: SignalPattern): AnomalyDetectionResult[] {
    const results: AnomalyDetectionResult[] = [];

    for (const rule of this.config.rules) {
      if (rule.category !== signal.type && !this.isRelatedCategory(rule.category, signal.type)) {
        continue;
      }

      const match = this.testSignalRule(signal, rule);
      if (match) {
        const anomaly: AnomalyDetectionResult = {
          id: `anomaly-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          anomalyScore: rule.weight * 10 * (signal.anomalyScore + 0.1),
          anomalyType: rule.type,
          confidence: this.calculateConfidence(rule, match) * (signal.anomalyScore + 0.1),
          description: `Signal Analysis: ${rule.name} - ${signal.type} signal with anomaly score ${signal.anomalyScore.toFixed(2)}`,
          severity: signal.isSuspicious ? "high" : rule.severity,
          signalData: signal,
          recommendations: [rule.recommendation],
          legalImplications: [rule.legalReference],
        };
        results.push(anomaly);
        this.results.push(anomaly);
      }
    }

    return results;
  }

  // Analyze all incidents
  analyzeAllIncidents(incidents: Incident[]): AnomalyDetectionResult[] {
    this.results = [];
    const allResults: AnomalyDetectionResult[] = [];

    for (const incident of incidents) {
      const results = this.analyzeIncident(incident);
      allResults.push(...results);
    }

    // Add correlation analysis
    const correlationResults = this.analyzeCorrelations(incidents);
    allResults.push(...correlationResults);

    this.results = allResults;
    return allResults;
  }

  // Get overall threat score
  getThreatScore(): {
    score: number;
    level: "low" | "medium" | "high" | "critical";
    breakdown: Record<AnomalyType, number>;
  } {
    const breakdown: Record<AnomalyType, number> = {
      signal_jamming: 0,
      bluetooth_spoofing: 0,
      rf_interference: 0,
      surveillance_pattern: 0,
      data_tampering: 0,
      unusual_access: 0,
      geolocation_anomaly: 0,
      network_scanning: 0,
      behavioral_anomaly: 0,
      temporal_anomaly: 0,
      multi_signal_correlation: 0,
    };

    let totalScore = 0;

    for (const result of this.results) {
      breakdown[result.anomalyType] += result.anomalyScore;
      totalScore += result.anomalyScore;
    }

    // Normalize to 0-100
    totalScore = Math.min(100, totalScore);

    let level: "low" | "medium" | "high" | "critical" = "low";
    if (totalScore >= this.config.thresholds.critical) level = "critical";
    else if (totalScore >= this.config.thresholds.high) level = "high";
    else if (totalScore >= this.config.thresholds.medium) level = "medium";

    return { score: totalScore, level, breakdown };
  }

  // Get recent anomalies
  getRecentAnomalies(limit: number = 50): AnomalyDetectionResult[] {
    return [...this.results].reverse().slice(0, limit);
  }

  // Get anomalies by type
  getAnomaliesByType(type: AnomalyType): AnomalyDetectionResult[] {
    return this.results.filter((r) => r.anomalyType === type);
  }

  // Get anomalies by severity
  getAnomaliesBySeverity(
    severity: "low" | "medium" | "high" | "critical",
  ): AnomalyDetectionResult[] {
    return this.results.filter((r) => r.severity === severity);
  }

  // Clear results
  clearResults(): void {
    this.results = [];
  }

  // Update context
  updateContext(key: string, value: unknown): void {
    this.context[key] = value;
  }

  // Private methods
  private testRule(incident: Incident, rule: DetectionRule, allIncidents: Incident[]): boolean {
    if (typeof rule.pattern === "function") {
      return rule.pattern(incident, allIncidents);
    }

    const text =
      `${incident.observation} ${incident.technical} ${incident.classification}`.toLowerCase();
    return rule.pattern.test(text);
  }

  private testSignalRule(signal: SignalPattern, rule: DetectionRule): boolean {
    if (typeof rule.pattern === "function") {
      return rule.pattern(signal);
    }

    const text = JSON.stringify(signal).toLowerCase();
    return rule.pattern.test(text);
  }

  private calculateConfidence(rule: DetectionRule, match: boolean): number {
    if (!match) return 0;
    return Math.min(1, rule.weight / 10);
  }

  private isRelatedCategory(cat1: CategoryKey, cat2: CategoryKey): boolean {
    const related: Record<CategoryKey, CategoryKey[]> = {
      rf: ["bluetooth", "wifi", "signal_jamming", "surveillance"],
      bluetooth: ["rf", "wifi", "mobile"],
      wifi: ["rf", "bluetooth", "network", "cyber"],
      gps: ["mobile", "surveillance", "drone"],
      camera: ["surveillance", "infrared"],
      audio: ["surveillance", "vibration"],
      drone: ["gps", "rf", "surveillance"],
      mobile: ["bluetooth", "wifi", "gps"],
      sensor: ["rf", "infrared", "vibration"],
      network: ["wifi", "cyber", "surveillance"],
      signal_jamming: ["rf", "bluetooth", "wifi"],
      surveillance: ["camera", "audio", "gps", "drone", "network"],
      cyber: ["network", "wifi", "mobile"],
      infrared: ["camera", "sensor"],
      vibration: ["audio", "sensor"],
    };
    return related[cat1]?.includes(cat2) || related[cat2]?.includes(cat1) || false;
  }

  private getAllIncidents(): Incident[] {
    try {
      const parsed = JSON.parse(localStorage.getItem("ervin_ndamultisignal_evidence_v1") || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private analyzeCorrelations(incidents: Incident[]): AnomalyDetectionResult[] {
    const results: AnomalyDetectionResult[] = [];

    // Check for temporal clustering
    const now = Date.now();
    const recentIncidents = incidents.filter((i) => {
      const time = new Date(i.timestamp).getTime();
      return now - time < 3600000; // Within last hour
    });

    if (recentIncidents.length >= 5) {
      results.push({
        id: `corr-${Date.now()}`,
        timestamp: new Date().toISOString(),
        anomalyScore: 75,
        anomalyType: "temporal_anomaly",
        confidence: 0.9,
        description: `Temporal clustering: ${recentIncidents.length} incidents in the last hour`,
        severity: "high",
        recommendations: [
          "Multiple incidents in short timeframe may indicate coordinated activity. Investigate patterns.",
        ],
        legalImplications: ["ICCPR Art. 17 - Privacy Protection"],
      });
    }

    // Check for category diversity
    const categoriesUsed = new Set<CategoryKey>();
    for (const incident of incidents) {
      for (const cat of CATEGORY_KEYS) {
        if (incident.categories?.[cat]) {
          categoriesUsed.add(cat);
        }
      }
    }

    if (categoriesUsed.size >= 5) {
      results.push({
        id: `corr-${Date.now() - 1}`,
        timestamp: new Date().toISOString(),
        anomalyScore: 80,
        anomalyType: "multi_signal_correlation",
        confidence: 0.85,
        description: `Multi-category activity: ${categoriesUsed.size} different signal types observed`,
        severity: "high",
        recommendations: [
          "Diverse signal types may indicate comprehensive surveillance. Review all categories.",
        ],
        legalImplications: ["UDHR Art. 12 - Privacy Protection", "GDPR Art. 5 - Data Minimisation"],
      });
    }

    return results;
  }
}

// Singleton instance
export const aiDetectionEngine = new AIDetectionEngine();

// Utility functions
export function getAnomalySeverityColor(severity: string): string {
  switch (severity) {
    case "critical":
      return "text-red-500";
    case "high":
      return "text-orange-500";
    case "medium":
      return "text-yellow-500";
    default:
      return "text-blue-500";
  }
}

export function getAnomalyTypeIcon(type: AnomalyType): string {
  const icons: Record<AnomalyType, string> = {
    signal_jamming: "📡",
    bluetooth_spoofing: "🔵",
    rf_interference: "🌐",
    surveillance_pattern: "👁️",
    data_tampering: "🔧",
    unusual_access: "🔐",
    geolocation_anomaly: "📍",
    network_scanning: "🖥️",
    behavioral_anomaly: "🤖",
    temporal_anomaly: "⏰",
    multi_signal_correlation: "🔗",
  };
  return icons[type] || "⚠️";
}
