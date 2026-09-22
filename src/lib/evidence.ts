// © Ervin Remus Radosavlevici — Private License. Confidential, NDA-bound.
// Enhanced evidence registry with comprehensive categories, metadata, and international law compliance.

export const STORAGE_KEY = "ervin_ndamultisignal_evidence_v1";
export const ATTRIBUTION = "Ervin Remus Radosavlevici";
export const PROJECT_NAME = "NDA Multi-Signal Defensive Protection & Evidence Registry";

// Enhanced category system with detailed descriptions and legal relevance
export const CATEGORY_KEYS = [
  "rf",
  "bluetooth",
  "infrared",
  "vibration",
  "audio",
  "drone",
  "mobile",
  "wifi",
  "gps",
  "camera",
  "sensor",
  "network",
  "signal_jamming",
  "surveillance",
  "cyber",
] as const;

export type CategoryKey = (typeof CATEGORY_KEYS)[number];

// Detailed category labels with legal and technical context
export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  rf: "RF / Electromagnetic observation",
  bluetooth: "Bluetooth observation",
  infrared: "Infrared / Optical observation",
  vibration: "Vibration / Low-frequency observation",
  audio: "Audio / Voice observation",
  drone: "Possible drone observation",
  mobile: "Mobile / Device observation",
  wifi: "Wi-Fi / Wireless network observation",
  gps: "GPS / Location tracking observation",
  camera: "Camera / Optical surveillance observation",
  sensor: "Sensor / IoT device observation",
  network: "Network / Cyber observation",
  signal_jamming: "Signal jamming / Interference detection",
  surveillance: "Surveillance / Monitoring observation",
  cyber: "Cyber / Digital security observation",
};

// Category descriptions with legal relevance
export const CATEGORY_DESCRIPTIONS: Record<
  CategoryKey,
  { description: string; legalRelevance: string[]; technicalNotes: string }
> = {
  rf: {
    description:
      "Observations related to radio frequency signals, electromagnetic interference, or spectrum monitoring.",
    legalRelevance: ["ITU Constitution", "National radio regulations"],
    technicalNotes:
      "Browser APIs have limited RF detection capabilities. Observations are typically based on user reports or visible equipment.",
  },
  bluetooth: {
    description: "Observations of Bluetooth device behavior, connections, or discovery.",
    legalRelevance: ["UDHR Art. 12", "ICCPR Art. 17", "ECHR Art. 8"],
    technicalNotes:
      "Web Bluetooth API requires explicit user permission. Device names may be voluntarily exposed by users.",
  },
  infrared: {
    description: "Observations using infrared sensors, thermal imaging, or optical detection.",
    legalRelevance: ["UDHR Art. 12", "GDPR Art. 9 (biometric data)"],
    technicalNotes:
      "Browser APIs do not provide direct infrared access. Observations are based on user reports.",
  },
  vibration: {
    description: "Observations of vibration patterns, seismic activity, or low-frequency signals.",
    legalRelevance: ["UDHR Art. 12", "ICCPR Art. 17"],
    technicalNotes: "DeviceMotion API can detect vibration. Requires user permission.",
  },
  audio: {
    description: "Observations of audio signals, voice patterns, or sound-based monitoring.",
    legalRelevance: ["UDHR Art. 12", "ECHR Art. 8", "Wiretap laws"],
    technicalNotes: "Microphone access requires explicit user permission. No silent recording.",
  },
  drone: {
    description:
      "Observations of possible drone activity, including visual, audio, or RF detection.",
    legalRelevance: ["Aviation regulations", "Privacy laws"],
    technicalNotes:
      "Browser cannot reliably detect drones. Observations are based on user reports.",
  },
  mobile: {
    description: "Observations of mobile device behavior, location tracking, or app activity.",
    legalRelevance: ["UDHR Art. 12", "GDPR", "Telecommunications laws"],
    technicalNotes: "No direct mobile device access. Observations are based on user reports.",
  },
  wifi: {
    description: "Observations of Wi-Fi network behavior, connections, or interference.",
    legalRelevance: ["Telecommunications laws", "Computer Misuse Act"],
    technicalNotes: "Browser can detect available networks with permission. No active scanning.",
  },
  gps: {
    description: "Observations of GPS tracking, location monitoring, or geolocation.",
    legalRelevance: ["UDHR Art. 12", "GDPR Art. 9", "Location privacy laws"],
    technicalNotes: "Geolocation API requires explicit user permission. No background tracking.",
  },
  camera: {
    description: "Observations of camera usage, optical surveillance, or visual monitoring.",
    legalRelevance: ["UDHR Art. 12", "GDPR Art. 9", "Video surveillance laws"],
    technicalNotes: "Camera access requires explicit user permission. No silent recording.",
  },
  sensor: {
    description: "Observations of IoT sensors, environmental sensors, or device telemetry.",
    legalRelevance: ["UDHR Art. 12", "GDPR"],
    technicalNotes: "Sensor APIs require explicit user permission. No continuous monitoring.",
  },
  network: {
    description: "Observations of network traffic, data transmission, or cyber activity.",
    legalRelevance: ["Computer Misuse Act", "Cybersecurity laws"],
    technicalNotes:
      "Browser cannot intercept network traffic. Observations are based on user reports.",
  },
  signal_jamming: {
    description: "Detection or observation of signal jamming, interference, or blocking attempts.",
    legalRelevance: ["ITU Constitution", "National radio regulations", "Computer Misuse Act"],
    technicalNotes:
      "This application does NOT perform jamming. Only observes and records potential interference.",
  },
  surveillance: {
    description: "Observations of surveillance activity, monitoring, or tracking attempts.",
    legalRelevance: ["UDHR Art. 12", "ICCPR Art. 17", "ECHR Art. 8"],
    technicalNotes: "No active surveillance capabilities. Only passive observation recording.",
  },
  cyber: {
    description: "Observations of cyber security events, hacking attempts, or digital intrusions.",
    legalRelevance: ["Computer Misuse Act", "Cybercrime conventions"],
    technicalNotes: "No hacking or intrusion capabilities. Only observation recording.",
  },
};

// Enhanced classification system with legal context
export const CLASSIFICATIONS = [
  "Unknown technical event",
  "Bluetooth-related observation",
  "RF-related observation",
  "Infrared/optical observation",
  "Vibration/low-frequency observation",
  "Audio/voice observation",
  "Possible drone observation",
  "Possible mobile/device event",
  "Unwanted monitoring concern",
  "Signal interference observation",
  "Network anomaly observation",
  "Surveillance concern",
  "Cyber security observation",
  "GPS/location observation",
  "Camera/optical observation",
  "Sensor/IoT observation",
  "Wi-Fi network observation",
  "Multi-signal correlation",
];

// Evidence sensitivity levels
export type SensitivityLevel = "public" | "internal" | "confidential" | "restricted";

// Evidence status
export type EvidenceStatus = "draft" | "verified" | "quarantined" | "archived" | "deleted";

// Enhanced incident interface with comprehensive metadata
export interface Incident {
  id: string;
  timestamp: string;
  attribution: string;
  classification: string;
  observation: string;
  technical: string;
  categories: Record<CategoryKey, boolean>;
  browser: { userAgent: string; online: boolean; secureContext: boolean };
  hash?: string;
  // New enhanced fields
  sensitivity?: SensitivityLevel;
  status?: EvidenceStatus;
  tags?: string[];
  location?: {
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    timestamp?: string;
  };
  signalData?: {
    type: string;
    strength?: number;
    frequency?: number;
    direction?: string;
    timestamp?: string;
  };
  relatedIncidents?: string[]; // IDs of related incidents
  legalNotes?: string;
  verificationNotes?: string;
  lastModified?: string;
  createdBy?: string;
  modifiedBy?: string;
}

export const MAX_OBSERVATION = 4000;
export const MAX_TECHNICAL = 4000;
export const MAX_TAGS = 10;
export const MAX_TAG_LENGTH = 50;

// Legal frameworks for reference
export const LEGAL_FRAMEWORKS = [
  "UDHR Art. 12 (Privacy)",
  "ICCPR Art. 17 (Privacy)",
  "ECHR Art. 8 (Private life)",
  "GDPR Art. 5 (Principles)",
  "GDPR Art. 9 (Special categories)",
  "ITU Constitution (Radio regulations)",
  "Computer Misuse Act (UK)",
  "CFAA (US)",
  "UN Guiding Principles on Business and Human Rights",
];

// Default sensitivity levels for classifications
export function getDefaultSensitivity(classification: string): SensitivityLevel {
  const sensitiveClassifications = [
    "Unwanted monitoring concern",
    "Signal interference observation",
    "Surveillance concern",
    "Cyber security observation",
    "GPS/location observation",
    "Camera/optical observation",
  ];

  const confidentialClassifications = [
    "Possible drone observation",
    "Possible mobile/device event",
    "Network anomaly observation",
    "Multi-signal correlation",
  ];

  if (sensitiveClassifications.includes(classification)) {
    return "restricted";
  }
  if (confidentialClassifications.includes(classification)) {
    return "confidential";
  }
  return "internal";
}

// Get legal framework recommendations for a classification
export function getLegalFrameworkRecommendations(classification: string): string[] {
  const recommendations: Record<string, string[]> = {
    "Unknown technical event": ["UDHR Art. 12", "ICCPR Art. 17"],
    "Bluetooth-related observation": ["UDHR Art. 12", "ECHR Art. 8", "GDPR Art. 5"],
    "RF-related observation": ["ITU Constitution", "National radio regulations", "UDHR Art. 12"],
    "Infrared/optical observation": ["UDHR Art. 12", "GDPR Art. 9"],
    "Vibration/low-frequency observation": ["UDHR Art. 12", "ICCPR Art. 17"],
    "Audio/voice observation": ["UDHR Art. 12", "ECHR Art. 8", "Wiretap laws"],
    "Possible drone observation": ["Aviation regulations", "UDHR Art. 12", "Privacy laws"],
    "Possible mobile/device event": ["UDHR Art. 12", "GDPR", "Telecommunications laws"],
    "Unwanted monitoring concern": [
      "UDHR Art. 12",
      "ICCPR Art. 17",
      "ECHR Art. 8",
      "Stalking laws",
    ],
    "Signal interference observation": ["ITU Constitution", "Computer Misuse Act", "UDHR Art. 12"],
    "Network anomaly observation": ["Computer Misuse Act", "Cybersecurity laws", "UDHR Art. 12"],
    "Surveillance concern": ["UDHR Art. 12", "ICCPR Art. 17", "ECHR Art. 8", "Surveillance laws"],
    "Cyber security observation": ["Computer Misuse Act", "Cybercrime conventions", "UDHR Art. 12"],
    "GPS/location observation": ["UDHR Art. 12", "GDPR Art. 9", "Location privacy laws"],
    "Camera/optical observation": ["UDHR Art. 12", "GDPR Art. 9", "Video surveillance laws"],
    "Sensor/IoT observation": ["UDHR Art. 12", "GDPR", "IoT regulations"],
    "Wi-Fi network observation": ["Telecommunications laws", "Computer Misuse Act", "UDHR Art. 12"],
    "Multi-signal correlation": ["UDHR Art. 12", "ICCPR Art. 17", "Privacy impact assessment"],
  };

  return recommendations[classification] || ["UDHR Art. 12", "ICCPR Art. 17"];
}

export function nowISO() {
  return new Date().toISOString();
}

function isIncident(x: unknown): x is Incident {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o["id"] === "string" &&
    typeof o["timestamp"] === "string" &&
    typeof o["classification"] === "string" &&
    typeof o["observation"] === "string"
  );
}

export function getEvidence(): Incident[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter(isIncident) : [];
  } catch {
    return [];
  }
}

export function setEvidence(data: Incident[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearEvidence() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function sha256(text: string): Promise<string> {
  if (!globalThis.crypto?.subtle) return "WebCrypto-unavailable";
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function newId() {
  return typeof crypto?.randomUUID === "function" ? crypto.randomUUID() : "local-" + Date.now();
}

// Enhanced capability report with more details
export function capabilityReport(): string[] {
  const w = window as unknown as Record<string, unknown>;
  const n = navigator as unknown as Record<string, unknown>;

  const reports: string[] = [
    `Secure context: ${window.isSecureContext ? "YES" : "NO"}`,
    `Web Bluetooth: ${"bluetooth" in n ? "AVAILABLE" : "UNAVAILABLE"}`,
    `DeviceMotion: ${"DeviceMotionEvent" in w ? "AVAILABLE" : "UNAVAILABLE"}`,
    `DeviceOrientation: ${"DeviceOrientationEvent" in w ? "AVAILABLE" : "UNAVAILABLE"}`,
    `Geolocation API: ${"geolocation" in n ? "AVAILABLE" : "UNAVAILABLE"}`,
    `MediaDevices: ${navigator.mediaDevices ? "AVAILABLE" : "UNAVAILABLE"}`,
    `Web Crypto: ${globalThis.crypto?.subtle ? "AVAILABLE" : "UNAVAILABLE"}`,
    `IndexedDB: ${"indexedDB" in w ? "AVAILABLE" : "UNAVAILABLE"}`,
    `Service Workers: ${"serviceWorker" in n ? "AVAILABLE" : "UNAVAILABLE"}`,
    `Web Storage: ${typeof localStorage !== "undefined" ? "AVAILABLE" : "UNAVAILABLE"}`,
    `Clipboard API: ${"clipboard" in n ? "AVAILABLE" : "UNAVAILABLE"}`,
    `Permissions API: ${"permissions" in n ? "AVAILABLE" : "UNAVAILABLE"}`,
    `Screen Wake Lock: ${"wakeLock" in n ? "AVAILABLE" : "UNAVAILABLE"}`,
    `Web Share API: ${"share" in n ? "AVAILABLE" : "UNAVAILABLE"}`,
    `File API: ${typeof File !== "undefined" ? "AVAILABLE" : "UNAVAILABLE"}`,
  ];

  // Add browser-specific capabilities
  if (navigator.userAgent.includes("Chrome")) {
    reports.push("Browser: Chrome/Chromium-based");
  } else if (navigator.userAgent.includes("Firefox")) {
    reports.push("Browser: Firefox");
  } else if (navigator.userAgent.includes("Safari")) {
    reports.push("Browser: Safari");
  } else if (navigator.userAgent.includes("Edg")) {
    reports.push("Browser: Edge");
  }

  // Add platform information
  reports.push(`Platform: ${navigator.platform || "Unknown"}`);
  reports.push(`Online: ${navigator.onLine ? "YES" : "NO"}`);
  reports.push(`Hardware Concurrency: ${navigator.hardwareConcurrency || "Unknown"}`);
  reports.push(`Device Memory: ${navigator.deviceMemory || "Unknown"} GB`);

  return reports;
}

export function buildExport(incidents: Incident[]) {
  return {
    project: PROJECT_NAME,
    attribution: ATTRIBUTION,
    license: "Private License — All Rights Reserved. See LICENSE and NDA.md.",
    exportedAt: nowISO(),
    legalEthicsNotice:
      "Defensive evidence registry. Records observations and technical information. It does not automatically establish wrongdoing or identify an offender. All records are subject to international human rights law principles including UDHR Art. 12, ICCPR Art. 17, and ECHR Art. 8.",
    complianceNotice:
      "This export complies with privacy by design principles, data minimisation, purpose limitation, and storage limitation. Data is suitable for independent review and legal proceedings.",
    incidents,
    statistics: {
      totalIncidents: incidents.length,
      classifications: countClassifications(incidents),
      categories: countCategories(incidents),
      sensitivityLevels: countSensitivityLevels(incidents),
      dateRange: getDateRange(incidents),
    },
  };
}

// Helper functions for statistics
export function countClassifications(incidents: Incident[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const incident of incidents) {
    counts[incident.classification] = (counts[incident.classification] || 0) + 1;
  }
  return counts;
}

export function countCategories(incidents: Incident[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const incident of incidents) {
    for (const [category, enabled] of Object.entries(incident.categories)) {
      if (enabled) {
        counts[category] = (counts[category] || 0) + 1;
      }
    }
  }
  return counts;
}

export function countSensitivityLevels(incidents: Incident[]): Record<SensitivityLevel, number> {
  const counts: Record<SensitivityLevel, number> = {
    public: 0,
    internal: 0,
    confidential: 0,
    restricted: 0,
  };
  for (const incident of incidents) {
    const level = incident.sensitivity || "internal";
    counts[level] = (counts[level] || 0) + 1;
  }
  return counts;
}

export function getDateRange(incidents: Incident[]): { earliest?: string; latest?: string } {
  if (incidents.length === 0) return {};

  const timestamps = incidents.map((i) => i.timestamp);
  const sorted = [...timestamps].sort();

  return {
    earliest: sorted[0],
    latest: sorted[sorted.length - 1],
  };
}

// Create a new incident with enhanced metadata
export function createIncident(data: Partial<Incident> & Pick<Incident, "observation">): Incident {
  const now = nowISO();
  const sensitivity = getDefaultSensitivity(data.classification || CLASSIFICATIONS[0]);

  return {
    id: newId(),
    timestamp: now,
    attribution: ATTRIBUTION,
    classification: data.classification || CLASSIFICATIONS[0],
    observation: data.observation,
    technical: data.technical || "",
    categories: data.categories || emptyCategories(),
    browser: {
      userAgent: navigator.userAgent,
      online: navigator.onLine,
      secureContext: window.isSecureContext,
    },
    sensitivity,
    status: "draft",
    tags: data.tags || [],
    location: data.location,
    signalData: data.signalData,
    relatedIncidents: data.relatedIncidents || [],
    legalNotes: data.legalNotes || "",
    verificationNotes: data.verificationNotes || "",
    lastModified: now,
    createdBy: data.createdBy || "user",
    modifiedBy: data.modifiedBy || "user",
  };
}

// Update an incident
export function updateIncident(incident: Incident, updates: Partial<Incident>): Incident {
  return {
    ...incident,
    ...updates,
    lastModified: nowISO(),
    modifiedBy: updates.modifiedBy || incident.modifiedBy || "user",
  };
}

// Archive an incident
export function archiveIncident(incident: Incident): Incident {
  return updateIncident(incident, {
    status: "archived",
    verificationNotes: incident.verificationNotes
      ? `${incident.verificationNotes}\nArchived at: ${nowISO()}`
      : `Archived at: ${nowISO()}`,
  });
}

// Quarantine an incident
export function quarantineIncident(incident: Incident, reason: string): Incident {
  return updateIncident(incident, {
    status: "quarantined",
    classification: incident.classification.startsWith("[QUARANTINED]")
      ? incident.classification
      : `[QUARANTINED] ${incident.classification}`,
    verificationNotes: incident.verificationNotes
      ? `${incident.verificationNotes}\nQuarantined: ${reason} at ${nowISO()}`
      : `Quarantined: ${reason} at ${nowISO()}`,
  });
}

// Get incidents by sensitivity level
export function getIncidentsBySensitivity(
  incidents: Incident[],
  level: SensitivityLevel,
): Incident[] {
  return incidents.filter((i) => i.sensitivity === level);
}

// Get incidents by status
export function getIncidentsByStatus(incidents: Incident[], status: EvidenceStatus): Incident[] {
  return incidents.filter((i) => i.status === status);
}

// Get incidents by tag
export function getIncidentsByTag(incidents: Incident[], tag: string): Incident[] {
  return incidents.filter((i) => i.tags?.includes(tag) || false);
}

// Get incidents by date range
export function getIncidentsByDateRange(
  incidents: Incident[],
  startDate: string,
  endDate: string,
): Incident[] {
  return incidents.filter((i) => {
    const date = new Date(i.timestamp);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return date >= start && date <= end;
  });
}

// Search incidents by text
export function searchIncidents(incidents: Incident[], query: string): Incident[] {
  const lowerQuery = query.toLowerCase();
  return incidents.filter((i) => {
    return (
      i.observation.toLowerCase().includes(lowerQuery) ||
      i.technical.toLowerCase().includes(lowerQuery) ||
      i.classification.toLowerCase().includes(lowerQuery) ||
      i.tags?.some((t) => t.toLowerCase().includes(lowerQuery)) ||
      false
    );
  });
}

// Validate incident data
export function validateIncident(incident: Partial<Incident>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!incident.observation || incident.observation.trim() === "") {
    errors.push("Observation is required");
  }

  if (incident.observation && incident.observation.length > MAX_OBSERVATION) {
    errors.push(`Observation exceeds maximum length of ${MAX_OBSERVATION} characters`);
  }

  if (incident.technical && incident.technical.length > MAX_TECHNICAL) {
    errors.push(`Technical field exceeds maximum length of ${MAX_TECHNICAL} characters`);
  }

  if (incident.tags && incident.tags.length > MAX_TAGS) {
    errors.push(`Maximum of ${MAX_TAGS} tags allowed`);
  }

  if (incident.tags) {
    for (const tag of incident.tags) {
      if (tag.length > MAX_TAG_LENGTH) {
        errors.push(`Tag '${tag}' exceeds maximum length of ${MAX_TAG_LENGTH} characters`);
      }
    }
  }

  if (incident.classification && !CLASSIFICATIONS.includes(incident.classification)) {
    errors.push("Invalid classification");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Empty categories helper
export function emptyCategories() {
  return Object.fromEntries(CATEGORY_KEYS.map((k) => [k, false])) as Record<CategoryKey, boolean>;
}

// Get all enabled categories for an incident
export function getEnabledCategories(incident: Incident): CategoryKey[] {
  return Object.entries(incident.categories)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key as CategoryKey);
}

// Check if incident has any sensitive categories
export function hasSensitiveCategories(incident: Incident): boolean {
  const sensitiveCategories: CategoryKey[] = [
    "gps",
    "camera",
    "audio",
    "bluetooth",
    "wifi",
    "signal_jamming",
    "surveillance",
  ];

  for (const category of sensitiveCategories) {
    if (incident.categories[category]) {
      return true;
    }
  }
  return false;
}

// Get recommended sensitivity level based on categories and classification
export function getRecommendedSensitivity(incident: Partial<Incident>): SensitivityLevel {
  // Check if any sensitive categories are enabled
  if (incident.categories) {
    const sensitiveCats: CategoryKey[] = [
      "gps",
      "camera",
      "audio",
      "bluetooth",
      "wifi",
      "signal_jamming",
      "surveillance",
    ];
    for (const cat of sensitiveCats) {
      if (incident.categories[cat]) {
        return "restricted";
      }
    }
  }

  // Check classification
  const sensitiveClassifications = [
    "Unwanted monitoring concern",
    "Signal interference observation",
    "Surveillance concern",
    "Cyber security observation",
    "GPS/location observation",
    "Camera/optical observation",
  ];

  if (incident.classification && sensitiveClassifications.includes(incident.classification)) {
    return "restricted";
  }

  const confidentialClassifications = [
    "Possible drone observation",
    "Possible mobile/device event",
    "Network anomaly observation",
    "Multi-signal correlation",
  ];

  if (incident.classification && confidentialClassifications.includes(incident.classification)) {
    return "confidential";
  }

  return "internal";
}

// Import evidence from backup
export function importEvidence(backup: {
  incidents: Incident[];
  metadata?: Record<string, unknown>;
}): { success: boolean; count: number; errors: string[] } {
  const errors: string[] = [];
  const validIncidents: Incident[] = [];

  for (const incident of backup.incidents) {
    const validation = validateIncident(incident);
    if (validation.valid) {
      validIncidents.push(incident);
    } else {
      errors.push(`Invalid incident ${incident.id}: ${validation.errors.join(", ")}`);
    }
  }

  if (validIncidents.length > 0) {
    const existing = getEvidence();
    const merged = [...existing, ...validIncidents];
    setEvidence(merged);
  }

  return {
    success: errors.length === 0,
    count: validIncidents.length,
    errors,
  };
}

// Export evidence to backup format
export function exportEvidenceBackup(incidents: Incident[]): {
  incidents: Incident[];
  metadata: Record<string, string>;
} {
  return {
    incidents,
    metadata: {
      exportedAt: nowISO(),
      project: PROJECT_NAME,
      attribution: ATTRIBUTION,
      license: "Private License — All Rights Reserved",
      version: "1.0",
      totalIncidents: incidents.length.toString(),
    },
  };
}
