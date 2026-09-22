// © Ervin Remus Radosavlevici — Private License. Confidential, NDA-bound.
// IP geolocation analysis for evidence correlation and threat detection.
// Provides location-based context for incidents and signals.

import { type Incident } from "./evidence";
import { type SignalPattern } from "./sentinel";
import { logAudit } from "./audit";

export interface GeolocationData {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  asName: string;
  mobile: boolean;
  proxy: boolean;
  hosting: boolean;
  accuracy: number; // kilometers
  timestamp: string;
}

export interface GeolocationAnalysis {
  id: string;
  timestamp: string;
  data: GeolocationData;
  confidence: number; // 0-100
  riskScore: number; // 0-100
  riskFactors: string[];
  isSuspicious: boolean;
  distanceFromExpected?: number; // kilometers
  expectedLocation?: {
    latitude: number;
    longitude: number;
    radius: number; // kilometers
  };
}

export interface GeolocationConfig {
  enabled: boolean;
  autoAnalyze: boolean;
  expectedLocations: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    radius: number; // kilometers
  }[];
  riskThreshold: number; // 0-100
  proxyDetection: boolean;
  mobileDetection: boolean;
  hostingDetection: boolean;
}

export interface LocationHistory {
  id: string;
  timestamp: string;
  ip: string;
  geolocation: GeolocationData;
  incidentId?: string;
  signalId?: string;
}

// Known IP ranges and their associated risks
const KNOWN_IP_RANGES: {
  range: [string, string];
  country: string;
  risk: number;
  reason: string;
}[] = [
  // Cloud providers
  {
    range: ["1.0.0.0", "1.255.255.255"],
    country: "AU",
    risk: 10,
    reason: "APNIC cloud range",
  },
  {
    range: ["3.0.0.0", "3.255.255.255"],
    country: "US",
    risk: 15,
    reason: "Amazon AWS",
  },
  {
    range: ["8.8.8.0", "8.8.8.255"],
    country: "US",
    risk: 5,
    reason: "Google DNS",
  },
  {
    range: ["142.250.0.0", "142.251.255.255"],
    country: "US",
    risk: 20,
    reason: "Google cloud",
  },
  {
    range: ["103.86.96.0", "103.86.96.255"],
    country: "US",
    risk: 30,
    reason: "Known VPN exit node",
  },
  {
    range: ["104.28.0.0", "104.28.255.255"],
    country: "US",
    risk: 25,
    reason: "Cloudflare",
  },
  {
    range: ["139.59.0.0", "139.59.255.255"],
    country: "US",
    risk: 20,
    reason: "DigitalOcean",
  },
  {
    range: ["167.99.0.0", "167.99.255.255"],
    country: "US",
    risk: 20,
    reason: "DigitalOcean",
  },
  // Tor exit nodes (example ranges)
  {
    range: ["185.220.101.0", "185.220.101.255"],
    country: "DE",
    risk: 90,
    reason: "Known Tor exit node",
  },
  {
    range: ["199.249.230.0", "199.249.230.255"],
    country: "US",
    risk: 95,
    reason: "Known Tor exit node",
  },
  // VPN providers
  {
    range: ["103.86.96.0", "103.86.99.255"],
    country: "US",
    risk: 85,
    reason: "VPN provider",
  },
  {
    range: ["109.195.56.0", "109.195.59.255"],
    country: "NL",
    risk: 80,
    reason: "VPN provider",
  },
];

// Country risk levels based on cybersecurity threat assessments
const COUNTRY_RISK_LEVELS: Record<
  string,
  { level: "low" | "medium" | "high" | "critical"; score: number }
> = {
  // Low risk
  US: { level: "low", score: 10 },
  CA: { level: "low", score: 10 },
  GB: { level: "low", score: 10 },
  DE: { level: "low", score: 10 },
  FR: { level: "low", score: 10 },
  AU: { level: "low", score: 10 },
  JP: { level: "low", score: 10 },
  NO: { level: "low", score: 10 },
  SE: { level: "low", score: 10 },
  FI: { level: "low", score: 10 },

  // Medium risk
  BR: { level: "medium", score: 40 },
  IN: { level: "medium", score: 40 },
  IT: { level: "medium", score: 40 },
  ES: { level: "medium", score: 40 },
  MX: { level: "medium", score: 40 },

  // High risk
  RU: { level: "high", score: 70 },
  CN: { level: "high", score: 70 },
  IR: { level: "high", score: 70 },
  KP: { level: "high", score: 70 },

  // Critical risk
  SY: { level: "critical", score: 90 },
  IQ: { level: "critical", score: 90 },
  AF: { level: "critical", score: 90 },
};

// Default configuration
const DEFAULT_CONFIG: GeolocationConfig = {
  enabled: true,
  autoAnalyze: true,
  expectedLocations: [],
  riskThreshold: 60,
  proxyDetection: true,
  mobileDetection: true,
  hostingDetection: true,
};

// Geolocation Engine
export class GeolocationEngine {
  private config: GeolocationConfig;
  private locationHistory: LocationHistory[];
  private ipCache: Map<string, GeolocationData>;

  constructor(config: Partial<GeolocationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.locationHistory = [];
    this.ipCache = new Map();
    this.loadFromStorage();
  }

  // Get geolocation for an IP address (simulated - in production use a geolocation API)
  async getGeolocation(ip: string): Promise<GeolocationData> {
    // Check cache first
    const cached = this.ipCache.get(ip);
    if (cached) return cached;

    // Simulate geolocation lookup
    const geolocation = this.simulateGeolocation(ip);
    this.ipCache.set(ip, geolocation);
    return geolocation;
  }

  // Analyze IP address for risks
  async analyzeIP(ip: string): Promise<GeolocationAnalysis> {
    const geolocation = await this.getGeolocation(ip);
    const analysis = this.analyzeGeolocation(geolocation);

    return {
      id: this.generateAnalysisId(),
      timestamp: new Date().toISOString(),
      data: geolocation,
      confidence: analysis.confidence,
      riskScore: analysis.riskScore,
      riskFactors: analysis.riskFactors,
      isSuspicious: analysis.isSuspicious,
    };
  }

  // Analyze geolocation data
  analyzeGeolocation(geolocation: GeolocationData): {
    confidence: number;
    riskScore: number;
    riskFactors: string[];
    isSuspicious: boolean;
  } {
    const riskFactors: string[] = [];
    let riskScore = 0;

    // Check country risk
    const countryRisk = COUNTRY_RISK_LEVELS[geolocation.countryCode];
    if (countryRisk) {
      riskScore += countryRisk.score * 0.5;
      if (countryRisk.level !== "low") {
        riskFactors.push(`Country risk: ${countryRisk.level}`);
      }
    }

    // Check proxy/VPN
    if (geolocation.proxy) {
      riskScore += 40;
      riskFactors.push("Proxy/VPN detected");
    }

    // Check hosting
    if (geolocation.hosting) {
      riskScore += 30;
      riskFactors.push("Hosting provider IP");
    }

    // Check mobile
    if (geolocation.mobile) {
      riskScore += 5;
      // Mobile is not necessarily suspicious
    }

    // Check known IP ranges
    for (const range of KNOWN_IP_RANGES) {
      if (this.isIPInRange(geolocation.ip, range.range[0], range.range[1])) {
        riskScore += range.risk * 0.5;
        riskFactors.push(range.reason);
        break;
      }
    }

    // Check distance from expected locations
    if (this.config.expectedLocations.length > 0) {
      for (const expected of this.config.expectedLocations) {
        const distance = this.calculateDistance(
          geolocation.latitude,
          geolocation.longitude,
          expected.latitude,
          expected.longitude,
        );

        if (distance > expected.radius) {
          const distanceScore = Math.min(50, (distance - expected.radius) * 2);
          riskScore += distanceScore;
          riskFactors.push(
            `Distance from expected location: ${Math.round(distance)}km (expected < ${expected.radius}km)`,
          );
        }
      }
    }

    // Cap risk score at 100
    riskScore = Math.min(100, riskScore);

    // Calculate confidence
    const confidence = geolocation.accuracy > 0 ? Math.max(0, 100 - geolocation.accuracy) : 80;

    return {
      confidence,
      riskScore,
      riskFactors,
      isSuspicious: riskScore >= this.config.riskThreshold,
    };
  }

  // Analyze incident with geolocation context
  async analyzeIncident(incident: Incident): Promise<GeolocationAnalysis | null> {
    // Extract IP from technical data if available
    const ipMatch = incident.technical?.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
    const ip = ipMatch ? ipMatch[1] : undefined;

    if (!ip) return null;

    return this.analyzeIP(ip);
  }

  // Analyze signal pattern with geolocation context
  async analyzeSignal(signal: SignalPattern): Promise<GeolocationAnalysis | null> {
    // In a real implementation, signal might have associated IP or location
    // For now, return null
    return null;
  }

  // Record location history
  recordLocation(
    ip: string,
    geolocation: GeolocationData,
    incidentId?: string,
    signalId?: string,
  ): LocationHistory {
    const history: LocationHistory = {
      id: this.generateHistoryId(),
      timestamp: new Date().toISOString(),
      ip,
      geolocation,
      incidentId,
      signalId,
    };

    this.locationHistory.push(history);
    if (this.locationHistory.length > 1000) {
      this.locationHistory.shift();
    }

    this.saveToStorage();
    return history;
  }

  // Get location history
  getLocationHistory(limit: number = 50): LocationHistory[] {
    return [...this.locationHistory].reverse().slice(0, limit);
  }

  // Get location history for an incident
  getLocationHistoryForIncident(incidentId: string): LocationHistory[] {
    return this.locationHistory.filter((h) => h.incidentId === incidentId);
  }

  // Get location statistics
  getStatistics(): {
    totalLookups: number;
    uniqueIPs: number;
    countries: string[];
    highRiskIPs: number;
    proxyIPs: number;
    recentLookups: LocationHistory[];
  } {
    const uniqueIPs = new Set(this.locationHistory.map((h) => h.ip));
    const countries = new Set(this.locationHistory.map((h) => h.geolocation.countryCode));
    const highRiskIPs = this.locationHistory.filter((h) => {
      const analysis = this.analyzeGeolocation(h.geolocation);
      return analysis.isSuspicious;
    }).length;
    const proxyIPs = this.locationHistory.filter((h) => h.geolocation.proxy).length;

    return {
      totalLookups: this.locationHistory.length,
      uniqueIPs: uniqueIPs.size,
      countries: Array.from(countries),
      highRiskIPs,
      proxyIPs,
      recentLookups: this.getLocationHistory(10),
    };
  }

  // Add expected location
  addExpectedLocation(location: GeolocationConfig["expectedLocations"][0]): void {
    this.config.expectedLocations.push(location);
    this.saveConfig();
  }

  // Remove expected location
  removeExpectedLocation(id: string): void {
    this.config.expectedLocations = this.config.expectedLocations.filter((l) => l.id !== id);
    this.saveConfig();
  }

  // Set risk threshold
  setRiskThreshold(threshold: number): void {
    this.config.riskThreshold = Math.max(0, Math.min(100, threshold));
    this.saveConfig();
  }

  // Enable/disable geolocation
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    this.saveConfig();
  }

  // Enable/disable auto analysis
  setAutoAnalyze(enabled: boolean): void {
    this.config.autoAnalyze = enabled;
    this.saveConfig();
  }

  // Get configuration
  getConfig(): GeolocationConfig {
    return { ...this.config };
  }

  // Get country risk level
  getCountryRisk(countryCode: string): { level: string; score: number } {
    return COUNTRY_RISK_LEVELS[countryCode] || { level: "unknown", score: 30 };
  }

  // Private methods
  private generateAnalysisId(): string {
    return typeof crypto?.randomUUID === "function"
      ? crypto.randomUUID()
      : `geo-analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateHistoryId(): string {
    return typeof crypto?.randomUUID === "function"
      ? crypto.randomUUID()
      : `geo-history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private simulateGeolocation(ip: string): GeolocationData {
    // Simulate geolocation based on IP patterns
    const parts = ip.split(".").map(Number);

    // Generate deterministic location based on IP
    const seed = parts.reduce((sum, part) => sum + part, 0);
    const random = (seed % 100) / 100;

    // Determine country based on IP range
    let country = "US";
    let countryName = "United States";
    let latitude = 37.0902 + (random * 10 - 5);
    let longitude = -95.7129 + (random * 20 - 10);

    if (parts[0] >= 1 && parts[0] <= 126) {
      country = "US";
      countryName = "United States";
    } else if (parts[0] >= 128 && parts[0] <= 191) {
      country = "EU";
      countryName = "European Union";
      latitude = 48.8566 + (random * 10 - 5);
      longitude = 2.3522 + (random * 20 - 10);
    } else if (parts[0] >= 192 && parts[0] <= 223) {
      country = "ASIA";
      countryName = "Asia";
      latitude = 35.6762 + (random * 10 - 5);
      longitude = 139.6503 + (random * 20 - 10);
    }

    // Check for known ranges
    for (const range of KNOWN_IP_RANGES) {
      if (this.isIPInRange(ip, range.range[0], range.range[1])) {
        country = range.country;
        countryName = range.reason.includes("Tor")
          ? "Tor Network"
          : range.reason.includes("VPN")
            ? "VPN Provider"
            : range.reason.includes("cloud")
              ? "Cloud Provider"
              : countryName;
        break;
      }
    }

    const isProxy = countryName.includes("Tor") || countryName.includes("VPN");
    const isHosting = countryName.includes("cloud") || countryName.includes("Cloud");
    const isMobile = Math.random() > 0.8; // 20% chance of mobile

    return {
      ip,
      country: countryName,
      countryCode: country,
      region: country === "US" ? "California" : country === "EU" ? "France" : "Tokyo",
      regionCode: country === "US" ? "CA" : country === "EU" ? "FR" : "13",
      city: country === "US" ? "San Francisco" : country === "EU" ? "Paris" : "Tokyo",
      latitude,
      longitude,
      timezone:
        country === "US" ? "America/Los_Angeles" : country === "EU" ? "Europe/Paris" : "Asia/Tokyo",
      isp: countryName.includes("Tor")
        ? "Tor Project"
        : countryName.includes("VPN")
          ? "VPN Provider"
          : countryName.includes("cloud")
            ? "Cloud Provider"
            : "Local ISP",
      org: countryName,
      as: `AS${Math.floor(Math.random() * 100000)}`,
      asName: countryName,
      mobile: isMobile,
      proxy: isProxy,
      hosting: isHosting,
      accuracy: Math.random() * 50 + 10, // 10-60 km accuracy
      timestamp: new Date().toISOString(),
    };
  }

  private isIPInRange(ip: string, start: string, end: string): boolean {
    const ipNum = this.ipToNumber(ip);
    const startNum = this.ipToNumber(start);
    const endNum = this.ipToNumber(end);
    return ipNum >= startNum && ipNum <= endNum;
  }

  private ipToNumber(ip: string): number {
    const parts = ip.split(".").map(Number);
    return (
      ((parts[0] ?? 0) << 24) | ((parts[1] ?? 0) << 16) | ((parts[2] ?? 0) << 8) | (parts[3] ?? 0)
    );
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Haversine formula
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private loadFromStorage(): void {
    try {
      if (typeof localStorage !== "undefined") {
        const historyJson = localStorage.getItem("sentinel_geolocation_history");
        if (historyJson) {
          this.locationHistory = JSON.parse(historyJson) as LocationHistory[];
        }

        const configJson = localStorage.getItem("sentinel_geolocation_config");
        if (configJson) {
          this.config = { ...this.config, ...JSON.parse(configJson) };
        }
      }
    } catch {
      this.locationHistory = [];
    }
  }

  private saveToStorage(): void {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("sentinel_geolocation_history", JSON.stringify(this.locationHistory));
        localStorage.setItem("sentinel_geolocation_config", JSON.stringify(this.config));
      }
    } catch {
      // Storage full or other error
    }
  }

  private saveConfig(): void {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("sentinel_geolocation_config", JSON.stringify(this.config));
      }
    } catch {
      // Ignore
    }
  }
}

// Singleton instance
export const geolocationEngine = new GeolocationEngine();

// Geolocation utilities
export function analyzeIP(ip: string): Promise<GeolocationAnalysis> {
  return geolocationEngine.analyzeIP(ip);
}

export function getGeolocationStats() {
  return geolocationEngine.getStatistics();
}

export function getCountryRisk(countryCode: string) {
  return geolocationEngine.getCountryRisk(countryCode);
}
