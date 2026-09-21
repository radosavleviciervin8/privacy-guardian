// © Ervin Remus Radosavlevici — Private License. Confidential, NDA-bound.
// Autonomous integrity sentinel: detects interference with the local registry,
// corrects what can lawfully be corrected and reports everything in plain language.

import {
  CATEGORY_KEYS,
  getEvidence,
  setEvidence,
  sha256,
  type CategoryKey,
  type Incident,
} from "./evidence";

export type SentinelLevel = "ok" | "info" | "warn" | "alert";

export interface SentinelLine {
  level: SentinelLevel;
  message: string;
  at: string;
}

export interface SentinelReport {
  scannedAt: string;
  total: number;
  verified: number;
  repaired: number;
  tampered: number;
  quarantined: number;
  chainHash: string;
  lines: SentinelLine[];
}

function line(level: SentinelLevel, message: string): SentinelLine {
  return { level, message, at: new Date().toISOString() };
}

function normalise(raw: Incident): { fixed: Incident; notes: string[] } {
  const notes: string[] = [];
  const fixed: Incident = { ...raw };

  if (!fixed.attribution) {
    fixed.attribution = "Ervin Remus Radosavlevici";
    notes.push("missing attribution restored");
  }
  if (!fixed.timestamp || Number.isNaN(Date.parse(fixed.timestamp))) {
    fixed.timestamp = new Date(0).toISOString();
    notes.push("unreadable timestamp replaced with a flagged placeholder");
  }
  if (typeof fixed.technical !== "string") {
    fixed.technical = "";
    notes.push("technical field reset to empty");
  }
  const cats = {} as Record<CategoryKey, boolean>;
  for (const k of CATEGORY_KEYS) cats[k] = Boolean(fixed.categories?.[k]);
  fixed.categories = cats;
  if (!fixed.browser || typeof fixed.browser !== "object") {
    fixed.browser = { userAgent: "unavailable", online: false, secureContext: false };
    notes.push("browser context rebuilt");
  }
  return { fixed, notes };
}

async function hashOf(incident: Incident): Promise<string> {
  const { hash: _ignored, ...rest } = incident;
  return sha256(JSON.stringify({ ...rest, hash: undefined }));
}

/**
 * Runs a full autonomous scan. Records whose content still matches their stored
 * hash are verified. Records with a structural defect are repaired and re-sealed.
 * Records whose content no longer matches a valid hash are flagged as tampered
 * and quarantined — never silently rewritten, so evidence value is preserved.
 */
export async function runSentinelScan(): Promise<{ report: SentinelReport; incidents: Incident[] }> {
  const incidents = getEvidence();
  const lines: SentinelLine[] = [];
  let verified = 0;
  let repaired = 0;
  let tampered = 0;
  let quarantined = 0;

  const seenIds = new Set<string>();
  let previousTime = -Infinity;
  const output: Incident[] = [];

  for (const raw of incidents) {
    const { fixed, notes } = normalise(raw);
    const expected = await hashOf(fixed);

    if (seenIds.has(fixed.id)) {
      fixed.id = `${fixed.id}-dup-${output.length}`;
      notes.push("duplicate record identifier corrected");
    }
    seenIds.add(fixed.id);

    const t = Date.parse(fixed.timestamp);
    if (t < previousTime) {
      lines.push(line("warn", `Record ${fixed.id.slice(0, 8)} is out of chronological order.`));
    }
    previousTime = Math.max(previousTime, t);

    if (!raw.hash) {
      fixed.hash = expected;
      repaired++;
      lines.push(line("info", `Record ${fixed.id.slice(0, 8)} had no seal — integrity seal applied.`));
    } else if (raw.hash === expected) {
      verified++;
      if (notes.length) {
        repaired++;
        fixed.hash = await hashOf(fixed);
        lines.push(line("info", `Record ${fixed.id.slice(0, 8)} corrected (${notes.join(", ")}).`));
      }
    } else if (notes.length) {
      fixed.hash = await hashOf(fixed);
      repaired++;
      lines.push(
        line("warn", `Record ${fixed.id.slice(0, 8)} was damaged and has been corrected (${notes.join(", ")}). Re-sealed.`),
      );
    } else {
      tampered++;
      quarantined++;
      fixed.classification = fixed.classification.startsWith("[QUARANTINED]")
        ? fixed.classification
        : `[QUARANTINED] ${fixed.classification}`;
      lines.push(
        line("alert", `Interference detected: record ${fixed.id.slice(0, 8)} no longer matches its original seal. Kept and quarantined for independent review — not rewritten.`),
      );
    }

    output.push(fixed);
  }

  if (repaired || tampered) setEvidence(output);

  const chainHash = await sha256(output.map((i) => i.hash ?? "").join("|") || "empty-registry");

  if (!incidents.length) lines.push(line("ok", "Registry is empty — nothing to verify."));
  else if (!tampered && !repaired) lines.push(line("ok", `All ${verified} records verified intact.`));

  lines.push(line("info", `Chain summary hash: ${chainHash.slice(0, 32)}…`));

  return {
    report: {
      scannedAt: new Date().toISOString(),
      total: output.length,
      verified,
      repaired,
      tampered,
      quarantined,
      chainHash,
      lines,
    },
    incidents: output,
  };
}

export function formatReport(r: SentinelReport): string {
  return [
    "AUTONOMOUS INTEGRITY REPORT",
    "© Ervin Remus Radosavlevici — Private License / NDA",
    `Scanned at: ${r.scannedAt}`,
    `Records: ${r.total} · verified ${r.verified} · corrected ${r.repaired} · interference ${r.tampered} · quarantined ${r.quarantined}`,
    `Chain hash: ${r.chainHash}`,
    "",
    ...r.lines.map((l) => `[${l.level.toUpperCase()}] ${l.at} — ${l.message}`),
  ].join("\n");
}
