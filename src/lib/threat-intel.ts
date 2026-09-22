// © Ervin Remus Radosavlevici — Private License. Confidential, NDA-bound.
// Threat Intelligence Integration for evidence correlation and pattern analysis.
// Provides contextual threat information based on known indicators and patterns.

import { type Incident, type CategoryKey } from "./evidence";
import { type AnomalyDetectionResult, type AnomalyType } from "./ai-detection";

export interface ThreatIndicator {
  id: string;
  name: string;
  description: string;
  type: "ip" | "domain" | "hash" | "pattern" | "behavior";
  severity: "low" | "medium" | "high" | "critical";
  confidence: number; // 0-100
  categories: CategoryKey[];
  relatedAnomalies: AnomalyType[];
  mitigation: string;
  references: string[];
  firstSeen: string;
  lastSeen: string;
  isActive: boolean;
}

export interface ThreatReport {
  id: string;
  timestamp: string;
  incidentId: string;
  indicators: ThreatIndicator[];
  threatScore: number; // 0-100
  threatLevel: "low" | "medium" | "high" | "critical";
  summary: string;
  recommendations: string[];
  relatedIncidents: string[];
  legalImplications: string[];
}

export interface ThreatIntelConfig {
  enabled: boolean;
  autoUpdate: boolean;
  updateInterval: number; // hours
  customIndicators: ThreatIndicator[];
}

// Known threat indicators database (simulated - in production this would be updated from threat intel feeds)
const KNOWN_INDICATORS: ThreatIndicator[] = [
  // RF Jamming Indicators
  {
    id: "ti-rf-001",
    name: "Broadband RF Noise",
    description: "Detects broadband RF noise patterns indicative of jamming equipment",
    type: "pattern",
    severity: "critical",
    confidence: 95,
    categories: ["rf", "signal_jamming"],
    relatedAnomalies: ["signal_jamming", "rf_interference"],
    mitigation: "Use directional antennas and spectrum analyzers to locate jamming source",
    references: ["ITU Radio Regulations", "FCC Part 15"],
    firstSeen: "2024-01-01T00:00:00Z",
    lastSeen: "2024-09-21T00:00:00Z",
    isActive: true,
  },
  {
    id: "ti-rf-002",
    name: "Frequency Hopping Pattern",
    description: "Detects rapid frequency hopping patterns used in military-grade jamming",
    type: "pattern",
    severity: "high",
    confidence: 90,
    categories: ["rf", "signal_jamming", "surveillance"],
    relatedAnomalies: ["signal_jamming", "multi_signal_correlation"],
    mitigation: "Frequency hopping jammers are illegal. Report to regulatory authorities",
    references: ["ITU Constitution", "National Defense Authorization Act"],
    firstSeen: "2024-02-15T00:00:00Z",
    lastSeen: "2024-09-20T00:00:00Z",
    isActive: true,
  },
  {
    id: "ti-rf-003",
    name: "Pulse Jamming",
    description: "Detects pulsed RF interference patterns",
    type: "pattern",
    severity: "high",
    confidence: 85,
    categories: ["rf", "signal_jamming"],
    relatedAnomalies: ["signal_jamming"],
    mitigation: "Pulse jamming can disrupt communications. Use shielding and filtering",
    references: ["MIL-STD-461", "IEC 61000-4-3"],
    firstSeen: "2024-03-01T00:00:00Z",
    lastSeen: "2024-09-19T00:00:00Z",
    isActive: true,
  },

  // Bluetooth Threats
  {
    id: "ti-bt-001",
    name: "BlueBorne Exploit Pattern",
    description: "Detects patterns matching known BlueBorne exploit attempts",
    type: "pattern",
    severity: "critical",
    confidence: 98,
    categories: ["bluetooth", "cyber"],
    relatedAnomalies: ["bluetooth_spoofing", "network_scanning"],
    mitigation: "Update Bluetooth stack to latest version. Disable Bluetooth when not in use",
    references: ["CVE-2017-0781", "CVE-2017-0782", "CVE-2017-0783"],
    firstSeen: "2024-01-10T00:00:00Z",
    lastSeen: "2024-09-21T00:00:00Z",
    isActive: true,
  },
  {
    id: "ti-bt-002",
    name: "Bluetooth MAC Spoofing",
    description: "Detects MAC address spoofing in Bluetooth connections",
    type: "pattern",
    severity: "high",
    confidence: 88,
    categories: ["bluetooth", "surveillance"],
    relatedAnomalies: ["bluetooth_spoofing"],
    mitigation: "Verify device MAC addresses against known good devices",
    references: ["Bluetooth SIG Security Standards"],
    firstSeen: "2024-02-01T00:00:00Z",
    lastSeen: "2024-09-20T00:00:00Z",
    isActive: true,
  },

  // Wi-Fi Threats
  {
    id: "ti-wifi-001",
    name: "Evil Twin Attack",
    description: "Detects patterns of evil twin (rogue AP) attacks",
    type: "pattern",
    severity: "critical",
    confidence: 95,
    categories: ["wifi", "network", "surveillance"],
    relatedAnomalies: ["network_scanning", "surveillance_pattern"],
    mitigation: "Verify AP certificates and use VPN for all connections",
    references: ["CVE-2014-0160", "Wi-Fi Alliance Security"],
    firstSeen: "2024-01-05T00:00:00Z",
    lastSeen: "2024-09-21T00:00:00Z",
    isActive: true,
  },
  {
    id: "ti-wifi-002",
    name: "KRACK Attack Pattern",
    description: "Detects patterns matching KRACK vulnerability exploitation",
    type: "pattern",
    severity: "critical",
    confidence: 99,
    categories: ["wifi", "cyber"],
    relatedAnomalies: ["network_scanning"],
    mitigation: "Update all Wi-Fi devices with KRACK patches. Use WPA3",
    references: ["CVE-2017-13077", "CVE-2017-13078", "CVE-2017-13079"],
    firstSeen: "2024-01-15T00:00:00Z",
    lastSeen: "2024-09-21T00:00:00Z",
    isActive: true,
  },

  // GPS/Location Threats
  {
    id: "ti-gps-001",
    name: "GPS Spoofing",
    description: "Detects patterns of GPS signal spoofing",
    type: "pattern",
    severity: "critical",
    confidence: 90,
    categories: ["gps", "drone", "surveillance"],
    relatedAnomalies: ["geolocation_anomaly", "signal_jamming"],
    mitigation: "Use multi-constellation GNSS and inertial navigation for verification",
    references: ["FCC GPS Spoofing Notice", "ICAO Annex 10"],
    firstSeen: "2024-02-20T00:00:00Z",
    lastSeen: "2024-09-18T00:00:00Z",
    isActive: true,
  },
  {
    id: "ti-gps-002",
    name: "Location Tracking Malware",
    description: "Detects patterns of location tracking malware",
    type: "behavior",
    severity: "high",
    confidence: 85,
    categories: ["gps", "mobile", "surveillance"],
    relatedAnomalies: ["geolocation_anomaly", "unusual_access"],
    mitigation: "Scan devices for malware. Review app permissions",
    references: ["Mobile Security Best Practices"],
    firstSeen: "2024-03-01T00:00:00Z",
    lastSeen: "2024-09-21T00:00:00Z",
    isActive: true,
  },

  // Audio/Video Threats
  {
    id: "ti-av-001",
    name: "Hidden Camera Detection",
    description: "Detects patterns indicating hidden camera usage",
    type: "pattern",
    severity: "critical",
    confidence: 92,
    categories: ["camera", "surveillance"],
    relatedAnomalies: ["surveillance_pattern"],
    mitigation: "Physical inspection for hidden cameras. Use RF detectors",
    references: ["Privacy Laws", "Video Surveillance Regulations"],
    firstSeen: "2024-01-01T00:00:00Z",
    lastSeen: "2024-09-21T00:00:00Z",
    isActive: true,
  },
  {
    id: "ti-av-002",
    name: "Audio Bug Detection",
    description: "Detects patterns of covert audio recording devices",
    type: "pattern",
    severity: "critical",
    confidence: 88,
    categories: ["audio", "surveillance"],
    relatedAnomalies: ["surveillance_pattern"],
    mitigation: "Use audio sweepers. Check for unusual RF transmissions",
    references: ["Wiretap Laws", "ECHR Art. 8"],
    firstSeen: "2024-02-10T00:00:00Z",
    lastSeen: "2024-09-19T00:00:00Z",
    isActive: true,
  },

  // Drone Threats
  {
    id: "ti-drone-001",
    name: "Drone Swarm Pattern",
    description: "Detects patterns of coordinated drone swarm activity",
    type: "behavior",
    severity: "critical",
    confidence: 95,
    categories: ["drone", "rf", "surveillance"],
    relatedAnomalies: ["multi_signal_correlation", "signal_jamming"],
    mitigation: "Drone swarms may indicate coordinated surveillance. Contact authorities",
    references: ["FAA Part 107", "Aviation Security Regulations"],
    firstSeen: "2024-03-15T00:00:00Z",
    lastSeen: "2024-09-20T00:00:00Z",
    isActive: true,
  },
  {
    id: "ti-drone-002",
    name: "Drone Signal Takeover",
    description: "Detects patterns of drone signal takeover attempts",
    type: "pattern",
    severity: "critical",
    confidence: 97,
    categories: ["drone", "rf", "cyber"],
    relatedAnomalies: ["rf_interference", "signal_jamming"],
    mitigation: "Drone signal takeover is illegal. Report with full evidence",
    references: ["Computer Misuse Act", "Aviation Laws"],
    firstSeen: "2024-02-01T00:00:00Z",
    lastSeen: "2024-09-21T00:00:00Z",
    isActive: true,
  },

  // Network/Cyber Threats
  {
    id: "ti-net-001",
    name: "Man-in-the-Middle Pattern",
    description: "Detects patterns of man-in-the-middle attacks",
    type: "pattern",
    severity: "critical",
    confidence: 96,
    categories: ["network", "cyber", "wifi"],
    relatedAnomalies: ["network_scanning"],
    mitigation: "Use end-to-end encryption. Verify certificates",
    references: ["CVE-2014-0224", "SSL/TLS Best Practices"],
    firstSeen: "2024-01-01T00:00:00Z",
    lastSeen: "2024-09-21T00:00:00Z",
    isActive: true,
  },
  {
    id: "ti-net-002",
    name: "DDoS Attack Pattern",
    description: "Detects patterns of distributed denial of service attacks",
    type: "behavior",
    severity: "critical",
    confidence: 94,
    categories: ["network", "cyber"],
    relatedAnomalies: ["network_scanning", "behavioral_anomaly"],
    mitigation: "DDoS attacks are illegal. Report to authorities and ISP",
    references: ["Computer Fraud and Abuse Act", "CFAA"],
    firstSeen: "2024-01-10T00:00:00Z",
    lastSeen: "2024-09-21T00:00:00Z",
    isActive: true,
  },

  // Surveillance Threats
  {
    id: "ti-surv-001",
    name: "Stalkerware Pattern",
    description: "Detects patterns of stalkerware or spyware applications",
    type: "behavior",
    severity: "critical",
    confidence: 98,
    categories: ["mobile", "surveillance", "cyber"],
    relatedAnomalies: ["surveillance_pattern", "behavioral_anomaly"],
    mitigation: "Stalkerware is illegal in most jurisdictions. Preserve evidence and report",
    references: ["Stalking Laws", "GDPR Art. 5", "ECHR Art. 8"],
    firstSeen: "2024-01-05T00:00:00Z",
    lastSeen: "2024-09-21T00:00:00Z",
    isActive: true,
  },
  {
    id: "ti-surv-002",
    name: "Keylogger Detection",
    description: "Detects patterns of keylogger software",
    type: "pattern",
    severity: "critical",
    confidence: 95,
    categories: ["mobile", "cyber", "surveillance"],
    relatedAnomalies: ["surveillance_pattern"],
    mitigation: "Keyloggers are illegal without consent. Scan devices thoroughly",
    references: ["Computer Misuse Act", "Privacy Laws"],
    firstSeen: "2024-02-01T00:00:00Z",
    lastSeen: "2024-09-20T00:00:00Z",
    isActive: true,
  },
];

// Threat Intelligence Engine
export class ThreatIntelEngine {
  private config: ThreatIntelConfig;
  private indicators: ThreatIndicator[];
  private reports: ThreatReport[];

  constructor(config: Partial<ThreatIntelConfig> = {}) {
    this.config = {
      enabled: true,
      autoUpdate: true,
      updateInterval: 24, // hours
      customIndicators: [],
      ...config,
    };
    this.indicators = [...KNOWN_INDICATORS, ...(config.customIndicators || [])];
    this.reports = [];
  }

  // Search for matching indicators
  searchIndicators(query: string): ThreatIndicator[] {
    const lowerQuery = query.toLowerCase();
    return this.indicators.filter((indicator) => {
      return (
        indicator.name.toLowerCase().includes(lowerQuery) ||
        indicator.description.toLowerCase().includes(lowerQuery) ||
        indicator.id.toLowerCase().includes(lowerQuery) ||
        indicator.references.some((ref) => ref.toLowerCase().includes(lowerQuery))
      );
    });
  }

  // Analyze incident for threat indicators
  analyzeIncident(incident: Incident): ThreatReport {
    const matchingIndicators: ThreatIndicator[] = [];
    let threatScore = 0;
    const recommendations: string[] = [];
    const legalImplications: string[] = [];

    const text =
      `${incident.observation} ${incident.technical} ${incident.classification}`.toLowerCase();

    for (const indicator of this.indicators) {
      const match = this.testIndicator(incident, indicator, text);
      if (match) {
        matchingIndicators.push(indicator);
        threatScore +=
          indicator.severity === "critical"
            ? 40
            : indicator.severity === "high"
              ? 30
              : indicator.severity === "medium"
                ? 20
                : 10;
        recommendations.push(indicator.mitigation);
        legalImplications.push(...indicator.references);
      }
    }

    // Cap threat score at 100
    threatScore = Math.min(100, threatScore);

    const threatLevel = this.getThreatLevel(threatScore);

    const report: ThreatReport = {
      id: `threat-report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      incidentId: incident.id,
      indicators: matchingIndicators,
      threatScore,
      threatLevel,
      summary: this.generateSummary(matchingIndicators, incident),
      recommendations: [...new Set(recommendations)], // Remove duplicates
      relatedIncidents: this.findRelatedIncidents(incident, matchingIndicators),
      legalImplications: [...new Set(legalImplications)],
    };

    this.reports.push(report);
    return report;
  }

  // Analyze all incidents
  analyzeAllIncidents(incidents: Incident[]): ThreatReport[] {
    this.reports = [];
    const reports: ThreatReport[] = [];

    for (const incident of incidents) {
      const report = this.analyzeIncident(incident);
      reports.push(report);
    }

    this.reports = reports;
    return reports;
  }

  // Get overall threat assessment
  getThreatAssessment(): {
    level: "low" | "medium" | "high" | "critical";
    score: number;
    activeThreats: number;
    criticalThreats: number;
    recentThreats: ThreatReport[];
  } {
    if (this.reports.length === 0) {
      return {
        level: "low",
        score: 0,
        activeThreats: 0,
        criticalThreats: 0,
        recentThreats: [],
      };
    }

    const criticalReports = this.reports.filter((r) => r.threatLevel === "critical");
    const highReports = this.reports.filter((r) => r.threatLevel === "high");
    const mediumReports = this.reports.filter((r) => r.threatLevel === "medium");

    const totalScore = this.reports.reduce((sum, r) => sum + r.threatScore, 0);
    const avgScore = totalScore / this.reports.length;

    const level = this.getThreatLevel(avgScore);

    return {
      level,
      score: Math.min(100, avgScore),
      activeThreats: this.reports.length,
      criticalThreats: criticalReports.length + highReports.length,
      recentThreats: [...this.reports].reverse().slice(0, 10),
    };
  }

  // Get threat indicators by category
  getIndicatorsByCategory(category: CategoryKey): ThreatIndicator[] {
    return this.indicators.filter((indicator) => indicator.categories.includes(category));
  }

  // Get threat indicators by severity
  getIndicatorsBySeverity(severity: "low" | "medium" | "high" | "critical"): ThreatIndicator[] {
    return this.indicators.filter((indicator) => indicator.severity === severity);
  }

  // Get recent reports
  getRecentReports(limit: number = 20): ThreatReport[] {
    return [...this.reports].reverse().slice(0, limit);
  }

  // Add custom indicator
  addCustomIndicator(indicator: ThreatIndicator): void {
    this.indicators.push(indicator);
    this.config.customIndicators.push(indicator);
  }

  // Remove custom indicator
  removeCustomIndicator(id: string): void {
    this.indicators = this.indicators.filter((i) => i.id !== id);
    this.config.customIndicators = this.config.customIndicators.filter((i) => i.id !== id);
  }

  // Update indicators (simulated - in production would fetch from threat intel feeds)
  async updateIndicators(): Promise<{ updated: number; new: number; removed: number }> {
    // Simulate update - in real implementation would fetch from external feeds
    const beforeCount = this.indicators.length;

    // Add some "new" indicators for demonstration
    const newIndicators: ThreatIndicator[] = [
      {
        id: `ti-new-${Date.now()}`,
        name: "Emerging Threat Pattern",
        description: "Newly identified threat pattern",
        type: "pattern",
        severity: "medium",
        confidence: 70,
        categories: ["cyber"],
        relatedAnomalies: ["behavioral_anomaly"],
        mitigation: "Monitor for this pattern",
        references: ["Emerging Threats Database"],
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        isActive: true,
      },
    ];

    this.indicators.push(...newIndicators);
    this.config.customIndicators.push(...newIndicators);

    return {
      updated: 0,
      new: newIndicators.length,
      removed: 0,
    };
  }

  // Clear all reports
  clearReports(): void {
    this.reports = [];
  }

  // Private methods
  private testIndicator(incident: Incident, indicator: ThreatIndicator, text: string): boolean {
    // Check if indicator categories match incident categories
    const categoryMatch = indicator.categories.some((cat) => incident.categories?.[cat]);

    // Check text patterns
    const textMatch =
      text.includes(indicator.name.toLowerCase()) ||
      text.includes(indicator.description.toLowerCase()) ||
      indicator.references.some((ref) => text.includes(ref.toLowerCase()));

    return categoryMatch || textMatch;
  }

  private getThreatLevel(score: number): "low" | "medium" | "high" | "critical" {
    if (score >= 80) return "critical";
    if (score >= 60) return "high";
    if (score >= 40) return "medium";
    return "low";
  }

  private generateSummary(indicators: ThreatIndicator[], incident: Incident): string {
    if (indicators.length === 0) {
      return `No known threat indicators matched for incident: ${incident.id}`;
    }

    const severityCounts: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    for (const indicator of indicators) {
      severityCounts[indicator.severity] = (severityCounts[indicator.severity] ?? 0) + 1;
    }

    const severity =
      Object.entries(severityCounts)
        .filter(([_, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || "low";

    return `Threat analysis: ${indicators.length} indicator(s) matched (${severity} severity) for incident ${incident.id}`;
  }

  private findRelatedIncidents(incident: Incident, indicators: ThreatIndicator[]): string[] {
    // In a real implementation, this would search through all incidents
    // For now, return empty array
    return [];
  }
}

// Singleton instance
export const threatIntelEngine = new ThreatIntelEngine();

// Threat indicator utilities
export function getThreatSeverityColor(severity: string): string {
  switch (severity) {
    case "critical":
      return "bg-red-500 text-white";
    case "high":
      return "bg-orange-500 text-white";
    case "medium":
      return "bg-yellow-500 text-black";
    default:
      return "bg-blue-500 text-white";
  }
}

export function getThreatTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    ip: "🌐",
    domain: "🔗",
    hash: "🔑",
    pattern: "🔍",
    behavior: "🤖",
  };
  return icons[type] || "⚠️";
}

export function getThreatLevelIcon(level: string): string {
  const icons: Record<string, string> = {
    critical: "🔴",
    high: "🟠",
    medium: "🟡",
    low: "🔵",
  };
  return icons[level] || "⚪";
}
