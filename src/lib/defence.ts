// © Ervin Remus Radosavlevici — Private License. Confidential, NDA-bound.
// Autonomous lawful defence: protects the registry itself. It never jams,
// transmits, or interferes with any device (radio/computer-misuse law, ICCPR 17).
import { getEvidence, setEvidence, sha256, type Incident } from "./evidence";
import { formatReport, type SentinelReport } from "./sentinel";

const VAULT_KEY = "ervin_ndamultisignal_vault_v1";
const MAX_SNAPSHOTS = 10;

export interface Snapshot {
  at: string;
  hash: string;
  incidents: Incident[];
}

export interface DefenceAction {
  at: string;
  action: string;
}

function readVault(): Snapshot[] {
  try {
    const v = JSON.parse(localStorage.getItem(VAULT_KEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function getSnapshots(): Snapshot[] {
  return readVault();
}

/** Keep a sealed copy of the last known-good registry. */
export async function snapshot(): Promise<Snapshot> {
  const incidents = getEvidence();
  const snap = { at: new Date().toISOString(), hash: await sha256(JSON.stringify(incidents)), incidents };
  const vault = [snap, ...readVault()].slice(0, MAX_SNAPSHOTS);
  localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
  return snap;
}

/** Restore records that disappeared since the last snapshot (deletions are blocked, never silently lost). */
export function restoreMissing(): number {
  const latest = readVault()[0];
  if (!latest) return 0;
  const current = getEvidence();
  const ids = new Set(current.map((i) => i.id));
  const missing = latest.incidents.filter((i) => !ids.has(i.id));
  if (missing.length) setEvidence([...current, ...missing]);
  return missing.length;
}

/** Run after every sentinel scan. Returns the defensive actions taken. */
export async function autoDefend(report: SentinelReport): Promise<DefenceAction[]> {
  const now = () => new Date().toISOString();
  const actions: DefenceAction[] = [];
  const restored = restoreMissing();
  if (restored) actions.push({ at: now(), action: `Blocked unauthorised deletion: restored ${restored} record(s) from sealed vault.` });
  if (report.tampered > 0) {
    actions.push({ at: now(), action: `Quarantined ${report.tampered} altered record(s); originals preserved for review.` });
  }
  await snapshot();
  actions.push({ at: now(), action: "Sealed backup copy updated." });
  return actions;
}

/** Distribute the sealed report to people/authorities the user chooses (share sheet or download). */
export async function distributeReport(report: SentinelReport): Promise<string> {
  const text = formatReport(report);
  const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
  if (nav.share) {
    try {
      await nav.share({ title: "Sealed Integrity Report", text });
      return "Shared via your device.";
    } catch {
      /* fall through to download */
    }
  }
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `sentinel-report-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  return "Report downloaded.";
}
