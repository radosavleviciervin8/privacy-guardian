export const STORAGE_KEY = "ervin_ndamultisignal_evidence_v1";
export const ATTRIBUTION = "Ervin Remus Radosavlevici";
export const PROJECT_NAME = "NDA Multi-Signal Defensive Protection & Evidence Registry";

export const CATEGORY_KEYS = [
  "rf",
  "bluetooth",
  "infrared",
  "vibration",
  "audio",
  "drone",
  "mobile",
] as const;
export type CategoryKey = (typeof CATEGORY_KEYS)[number];

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  rf: "RF / electromagnetic observation",
  bluetooth: "Bluetooth observation",
  infrared: "Infrared / optical observation",
  vibration: "Vibration / low-frequency observation",
  audio: "Audio / voice observation",
  drone: "Possible drone observation",
  mobile: "Mobile / device observation",
};

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
];

export const MAX_OBSERVATION = 4000;
export const MAX_TECHNICAL = 4000;

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

export function capabilityReport(): string[] {
  const w = window as unknown as Record<string, unknown>;
  const n = navigator as unknown as Record<string, unknown>;
  return [
    `Secure context: ${window.isSecureContext ? "YES" : "NO"}`,
    `Web Bluetooth: ${"bluetooth" in n ? "AVAILABLE" : "UNAVAILABLE"}`,
    `DeviceMotion: ${"DeviceMotionEvent" in w ? "AVAILABLE" : "UNAVAILABLE"}`,
    `DeviceOrientation: ${"DeviceOrientationEvent" in w ? "AVAILABLE" : "UNAVAILABLE"}`,
    `Geolocation API: ${"geolocation" in n ? "AVAILABLE" : "UNAVAILABLE"}`,
    `MediaDevices: ${navigator.mediaDevices ? "AVAILABLE" : "UNAVAILABLE"}`,
    `Web Crypto: ${globalThis.crypto?.subtle ? "AVAILABLE" : "UNAVAILABLE"}`,
  ];
}

export function buildExport(incidents: Incident[]) {
  return {
    project: PROJECT_NAME,
    attribution: ATTRIBUTION,
    license: "Private License — All Rights Reserved. See LICENSE and NDA.md.",
    exportedAt: nowISO(),
    legalEthicsNotice:
      "Defensive evidence registry. Records observations and technical information. It does not automatically establish wrongdoing or identify an offender.",
    incidents,
  };
}
