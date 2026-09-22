import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  ATTRIBUTION,
  CATEGORY_KEYS,
  CATEGORY_LABELS,
  CLASSIFICATIONS,
  MAX_OBSERVATION,
  MAX_TECHNICAL,
  PROJECT_NAME,
  buildExport,
  capabilityReport,
  clearEvidence,
  createIncident,
  getEvidence,
  newId,
  nowISO,
  setEvidence,
  sha256,
  type CategoryKey,
  type Incident,
  getLegalFrameworkRecommendations,
  getRecommendedSensitivity,
  validateIncident,
  emptyCategories,
  getEnabledCategories,
  hasSensitiveCategories,
} from "@/lib/evidence";
import {
  runSentinelScan,
  sentinelMonitor,
  type SentinelReport,
  type SignalPattern,
} from "@/lib/sentinel";
import {
  SAFEGUARD_GROUPS,
  SAFEGUARD_COUNT,
  getSafeguardsByPriority,
  getLegalFrameworks,
} from "@/lib/safeguards";
import {
  getAuditLogs,
  logAudit,
  auditCreate,
  auditDelete,
  auditExport,
  auditScan,
  type AuditLog,
} from "@/lib/audit";
import {
  isEncryptionAvailable,
  encryptWithPassword,
  decryptWithPassword,
  type EncryptedData,
} from "@/lib/encryption";
import { getLegalFrameworkSummary, generateComplianceReport } from "@/lib/legal";
import { SentinelDashboard } from "@/components/SentinelDashboard";

const TITLE = "NDA Multi-Signal Defensive Protection Registry";
const DESCRIPTION =
  "Local-first, non-jamming defensive evidence registry for Bluetooth, RF, infrared, vibration, audio, drone and mobile observations. Enhanced with autonomous interference detection, 200+ human rights safeguards, encryption, and comprehensive legal framework compliance.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

// Enhanced theme colors
const themeColors = {
  primary: "bg-blue-600 text-white",
  secondary: "bg-gray-700 text-white",
  success: "bg-green-600 text-white",
  warning: "bg-yellow-500 text-black",
  danger: "bg-red-600 text-white",
  info: "bg-cyan-500 text-white",
};

function Index() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [clock, setClock] = useState("");
  const [iso, setIso] = useState("");
  const [capabilities, setCapabilities] = useState("Checking...");
  const [classification, setClassification] = useState<string>(
    CLASSIFICATIONS[0] ?? "General Observation",
  );
  const [observation, setObservation] = useState("");
  const [technical, setTechnical] = useState("");
  const [categories, setCategories] = useState(emptyCategories);
  const [notice, setNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("registry");
  const [sentinelReport, setSentinelReport] = useState<SentinelReport | null>(null);
  const [signalPatterns, setSignalPatterns] = useState<SignalPattern[]>([]);
  const [showSafeguards, setShowSafeguards] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [showEncryption, setShowEncryption] = useState(false);
  const [encryptionPassword, setEncryptionPassword] = useState("");
  const [decryptionPassword, setDecryptionPassword] = useState("");
  const [encryptedData, setEncryptedData] = useState<EncryptedData | null>(null);
  const [decryptedText, setDecryptedText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState("");
  const [showBackup, setShowBackup] = useState(false);

  const formRef = useRef<HTMLSelectElement>(null);

  // Initialize
  useEffect(() => {
    setIncidents(getEvidence());
    setFilteredIncidents(getEvidence());
    setCapabilities(capabilityReport().join("\n"));

    // Start signal monitoring
    sentinelMonitor.start();
    sentinelMonitor.onSignal((pattern) => {
      setSignalPatterns((prev) => [...prev.slice(-19), pattern]);
    });

    const tick = () => {
      setClock(new Date().toLocaleString(undefined, { dateStyle: "full", timeStyle: "medium" }));
      setIso(nowISO());
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => {
      clearInterval(t);
      sentinelMonitor.stop();
    };
  }, []);

  // Filter incidents when search query changes
  useEffect(() => {
    const allIncidents = getEvidence();
    if (!searchQuery.trim()) {
      setFilteredIncidents(allIncidents);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = allIncidents.filter(
        (i) =>
          i.observation.toLowerCase().includes(lowerQuery) ||
          i.technical.toLowerCase().includes(lowerQuery) ||
          i.classification.toLowerCase().includes(lowerQuery) ||
          i.id.toLowerCase().includes(lowerQuery),
      );
      setFilteredIncidents(filtered);
    }
  }, [searchQuery, incidents]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4500);
    return () => clearTimeout(t);
  }, [notice]);

  const toggle = useCallback((k: CategoryKey) => {
    setCategories((c) => ({ ...c, [k]: !c[k] }));
  }, []);

  // Run sentinel scan
  const runScan = useCallback(async () => {
    try {
      const result = await runSentinelScan({ deepAnalysis: true, signalPatterns });
      setSentinelReport(result.report);
      setIncidents(result.incidents);
      setFilteredIncidents(result.incidents);
      logAudit(
        "SCAN",
        result.report.tampered > 0 ? "CRITICAL" : result.report.repaired > 0 ? "WARNING" : "INFO",
        `Integrity scan: ${result.report.verified} verified, ${result.report.repaired} repaired, ${result.report.tampered} tampered`,
      );
      setNotice(
        `Sentinel scan complete: ${result.report.verified} verified, ${result.report.tampered} tampered`,
      );
    } catch (error) {
      setNotice("Sentinel scan failed. Please try again.");
    }
  }, [signalPatterns]);

  // Save incident with enhanced validation
  async function saveIncident() {
    const obs = observation.trim();
    if (!obs) return setNotice("Please describe what was directly observed.");

    const validation = validateIncident({ observation: obs, technical, classification });
    if (!validation.valid) return setNotice(validation.errors[0] ?? "Invalid entry.");

    if (obs.length > MAX_OBSERVATION || technical.length > MAX_TECHNICAL)
      return setNotice("Entry too long. Please shorten the text.");

    const incident: Incident = createIncident({
      observation: obs,
      technical: technical.trim(),
      classification,
      categories,
    });

    incident.hash = await sha256(JSON.stringify(incident));
    const next = [...getEvidence(), incident];
    setEvidence(next);
    setIncidents(next);
    setFilteredIncidents(next);
    setObservation("");
    setTechnical("");
    setCategories(emptyCategories());
    setClassification(CLASSIFICATIONS[0]);

    auditCreate(incident);
    setNotice("Timestamped local evidence record created with SHA-256 integrity seal.");
  }

  async function requestBluetooth() {
    const bt = (
      navigator as unknown as {
        bluetooth?: { requestDevice: (o: unknown) => Promise<{ name?: string; id?: string }> };
      }
    ).bluetooth;
    if (!bt) return setNotice("Web Bluetooth is not available in this browser or context.");
    try {
      const device = await bt.requestDevice({ acceptAllDevices: true });
      setTechnical(
        JSON.stringify({
          timestamp: nowISO(),
          type: "Bluetooth device voluntarily exposed to browser",
          name: device.name || "Unnamed device",
          id: device.id || "Browser-generated identifier",
        }),
      );
      setCategories((c) => ({ ...c, bluetooth: true }));
      setNotice(
        "Bluetooth information returned by the browser. This does not prove malicious activity.",
      );
    } catch (e) {
      if ((e as Error).name !== "NotFoundError") setNotice("Bluetooth request did not complete.");
    }
  }

  function exportEvidence() {
    const blob = new Blob([JSON.stringify(buildExport(getEvidence()), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NDA-multisignal-evidence-${nowISO().replaceAll(":", "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    auditExport(getEvidence().length);
    setNotice("Evidence exported. Remember: exports carry NDA and copyright notices.");
  }

  function deleteEvidence() {
    if (!confirm("Delete ALL locally stored evidence from this browser? This cannot be undone."))
      return;
    clearEvidence();
    setIncidents([]);
    setFilteredIncidents([]);
    auditDelete("all");
    setNotice("Local evidence deleted.");
  }

  function deleteIncident(id: string) {
    if (!confirm("Delete this incident? This cannot be undone.")) return;
    const next = getEvidence().filter((i) => i.id !== id);
    setEvidence(next);
    setIncidents(next);
    setFilteredIncidents(next);
    auditDelete(id);
    setNotice("Incident deleted.");
  }

  function copyTimestamp() {
    navigator.clipboard
      .writeText(nowISO())
      .then(() => setNotice("Timestamp copied."))
      .catch(() => setNotice("Clipboard permission unavailable."));
  }

  function focusForm() {
    formRef.current?.focus();
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Encryption functions
  async function handleEncrypt() {
    if (!encryptionPassword) return setNotice("Please enter a password.");
    if (!observation) return setNotice("Please enter text to encrypt.");

    try {
      const encrypted = await encryptWithPassword(observation, encryptionPassword);
      setEncryptedData(encrypted);
      setNotice("Data encrypted successfully. Store this securely.");
    } catch (error) {
      setNotice("Encryption failed. Please try again.");
    }
  }

  async function handleDecrypt() {
    if (!decryptionPassword) return setNotice("Please enter a password.");
    if (!encryptedData) return setNotice("No encrypted data to decrypt.");

    try {
      const decrypted = await decryptWithPassword(encryptedData, decryptionPassword);
      setDecryptedText(decrypted);
      setNotice("Data decrypted successfully.");
    } catch (error) {
      setNotice("Decryption failed. Incorrect password or corrupted data.");
    }
  }

  // Import/export backup
  function exportBackup() {
    const data = JSON.stringify({ incidents: getEvidence(), exportedAt: nowISO() });
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NDA-backup-${nowISO().replaceAll(":", "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice("Backup exported successfully.");
  }

  function importBackup() {
    try {
      const data = JSON.parse(importData);
      if (data.incidents && Array.isArray(data.incidents)) {
        const existing = getEvidence();
        const merged = [...existing, ...data.incidents];
        setEvidence(merged);
        setIncidents(merged);
        setFilteredIncidents(merged);
        setImportData("");
        setShowImport(false);
        setNotice(`Imported ${data.incidents.length} incidents from backup.`);
      } else {
        setNotice("Invalid backup format. Please use a valid export file.");
      }
    } catch (error) {
      setNotice("Invalid JSON format. Please check your import file.");
    }
  }

  // Get legal recommendations for current classification
  const legalRecommendations = getLegalFrameworkRecommendations(classification);

  // Get recommended sensitivity level
  const recommendedSensitivity = getRecommendedSensitivity({ classification, categories });

  // Get enabled categories count
  const enabledCategories = getEnabledCategories({
    id: "temp",
    timestamp: "",
    attribution: "",
    classification,
    observation: "",
    technical: "",
    categories,
    browser: { userAgent: "", online: false, secureContext: false },
  } as Incident);

  return (
    <div className="min-h-screen">
      {/* Enhanced Header */}
      <header className="site-header px-5 py-6 border-b">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold tracking-tight">
                <span className="text-red-500">🛡️</span> {TITLE}
              </h1>
              <div className="flex gap-2">
                <span className="badge tone-green">DEFENSIVE / LOCAL / NON-JAMMING</span>
                <span className="badge tone-blue">200+ SAFEGUARDS ACTIVE</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{clock || "--"}</p>
                <p className="text-xs text-muted-foreground font-mono">{iso || "--"}</p>
              </div>
            </div>
          </div>
          <p className="mt-3 max-w-4xl leading-relaxed text-muted-foreground">
            Enhanced browser-based defensive evidence and privacy registry with autonomous
            interference detection, encryption, comprehensive audit logging, and 200+ international
            human rights law safeguards.
          </p>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <nav className="px-5 py-4 border-b bg-muted/50">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-2 overflow-x-auto">
            <button
              className={`btn ${activeTab === "registry" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setActiveTab("registry")}
            >
              📋 Evidence Registry
            </button>
            <button
              className={`btn ${activeTab === "sentinel" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setActiveTab("sentinel")}
            >
              🛡️ Sentinel Dashboard
            </button>
            <button
              className={`btn ${activeTab === "safeguards" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setActiveTab("safeguards")}
            >
              🔒 Safeguards ({SAFEGUARD_COUNT})
            </button>
            <button
              className={`btn ${activeTab === "legal" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setActiveTab("legal")}
            >
              ⚖️ Legal Framework
            </button>
            <button
              className={`btn ${activeTab === "encryption" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setActiveTab("encryption")}
            >
              🔐 Encryption
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl space-y-5 px-5 py-5">
        {/* Notice */}
        {notice && (
          <div
            role="status"
            className="badge tone-blue fixed bottom-5 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 border border-border shadow-lg animate-in fade-in slide-in-from-bottom-2"
          >
            {notice}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "registry" && (
          <div className="space-y-5">
            {/* System Protection Panel */}
            <div className="grid gap-4 md:grid-cols-3">
              <section className="panel">
                <h2 className="mb-3 text-lg font-bold flex items-center gap-2">
                  🛡️ System Protection
                </h2>
                <span className="badge tone-green">Local evidence mode</span>
                <p className="my-3 text-xs text-muted-foreground">
                  No automatic transmission. No RF jammer. No hidden microphone. No hidden camera.
                  No remote device control.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-safe" onClick={requestBluetooth}>
                    Request Bluetooth Device
                  </button>
                  <button
                    className="btn"
                    onClick={() => setCapabilities(capabilityReport().join("\n"))}
                  >
                    Check Browser Sensors
                  </button>
                  <button className="btn" onClick={focusForm}>
                    Record Observation
                  </button>
                  <button className="btn btn-primary" onClick={runScan}>
                    Run Sentinel Scan
                  </button>
                </div>
              </section>

              <section className="panel">
                <h2 className="mb-3 text-lg font-bold">⏰ Current Timestamp</h2>
                <div className="tone-blue text-xl font-extrabold leading-snug">{clock || "--"}</div>
                <p className="my-3 text-xs text-muted-foreground">
                  Timestamp generated locally by this device. ISO: {iso}
                </p>
                <button className="btn" onClick={copyTimestamp}>
                  Copy timestamp
                </button>
              </section>

              <section className="panel">
                <h2 className="mb-3 text-lg font-bold">📊 Protection Categories</h2>
                <div className="space-y-2 max-h-40 overflow-auto">
                  {CATEGORY_KEYS.map((k) => (
                    <label key={k} className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="accent-accent"
                        checked={categories[k]}
                        onChange={() => toggle(k)}
                      />
                      <span className={categories[k] ? "font-medium" : "text-muted-foreground"}>
                        {CATEGORY_LABELS[k]}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {enabledCategories.length} categories selected
                </p>
              </section>
            </div>

            {/* Incident Record Panel */}
            <section className="panel">
              <h2 className="mb-3 text-lg font-bold flex items-center gap-2">
                📝 Incident / Observation Record
              </h2>

              {/* Legal Recommendations */}
              {legalRecommendations.length > 0 && (
                <div className="mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-sm font-medium text-blue-500 mb-2">
                    Relevant Legal Framework:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {legalRecommendations.map((law) => (
                      <span key={law} className="text-xs badge tone-blue">
                        {law}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs text-muted-foreground">Event classification</label>
                  <select
                    ref={formRef}
                    className="field"
                    value={classification}
                    onChange={(e) => setClassification(e.target.value)}
                  >
                    {CLASSIFICATIONS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Sensitivity Level</label>
                  <div className="flex gap-2">
                    <span
                      className={`badge ${recommendedSensitivity === "restricted" ? "tone-red" : recommendedSensitivity === "confidential" ? "tone-yellow" : "tone-green"}`}
                    >
                      Recommended: {recommendedSensitivity.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <label className="text-xs text-muted-foreground mt-4 block">
                What was directly observed?
              </label>
              <textarea
                className="field"
                maxLength={MAX_OBSERVATION}
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Describe only what was directly observed. Avoid identifying or accusing a person unless independently verified. Records are subject to international human rights law (UDHR Art. 12, ICCPR Art. 17, ECHR Art. 8)."
              />
              <p className="text-xs text-muted-foreground">
                {observation.length}/{MAX_OBSERVATION} characters
              </p>

              <label className="text-xs text-muted-foreground mt-4 block">
                Optional technical evidence/reference
              </label>
              <textarea
                className="field"
                maxLength={MAX_TECHNICAL}
                value={technical}
                onChange={(e) => setTechnical(e.target.value)}
                placeholder="Example: Bluetooth device name shown by the browser, sensor permission result, external measurement reference, photograph/file reference, signal strength, frequency, etc."
              />
              <p className="text-xs text-muted-foreground">
                {technical.length}/{MAX_TECHNICAL} characters
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <button className="btn btn-primary" onClick={saveIncident}>
                  Save timestamped incident
                </button>
                <button
                  className="btn btn-warn"
                  onClick={() => {
                    setObservation("");
                    setTechnical("");
                    setCategories(emptyCategories());
                    setClassification(CLASSIFICATIONS[0]);
                  }}
                >
                  Clear
                </button>
              </div>
            </section>

            {/* Search and Filter */}
            <div className="panel">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="field flex-1"
                  placeholder="Search incidents by observation, technical details, classification, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn" onClick={() => setSearchQuery("")}>
                  Clear
                </button>
              </div>
            </div>

            {/* Evidence Registry */}
            <section className="panel">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">📚 Evidence Registry</h2>
                <div className="flex gap-2">
                  <button className="btn btn-safe" onClick={exportEvidence}>
                    Export evidence JSON
                  </button>
                  <button className="btn btn-danger" onClick={deleteEvidence}>
                    Delete local evidence
                  </button>
                  <button className="btn" onClick={() => setShowBackup(!showBackup)}>
                    Backup / Restore
                  </button>
                </div>
              </div>

              {/* Backup/Restore Panel */}
              {showBackup && (
                <div className="mb-4 p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Backup & Restore</h3>
                    <button className="text-sm" onClick={() => setShowBackup(false)}>
                      Close
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-safe" onClick={exportBackup}>
                      Export Backup
                    </button>
                    <button className="btn" onClick={() => setShowImport(true)}>
                      Import Backup
                    </button>
                  </div>
                </div>
              )}

              {/* Import Panel */}
              {showImport && (
                <div className="mb-4 p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Import Backup</h3>
                    <button className="text-sm" onClick={() => setShowImport(false)}>
                      Close
                    </button>
                  </div>
                  <textarea
                    className="field w-full"
                    rows={5}
                    placeholder="Paste your backup JSON here..."
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    <button className="btn btn-primary" onClick={importBackup}>
                      Import
                    </button>
                    <button className="btn" onClick={() => setImportData("")}>
                      Clear
                    </button>
                  </div>
                </div>
              )}

              <div className="max-h-90 overflow-auto rounded-xl border border-border">
                {filteredIncidents.length === 0 ? (
                  <div className="log-item text-xs text-muted-foreground">
                    {searchQuery
                      ? `No incidents match "${searchQuery}"`
                      : "No local incidents recorded yet."}
                  </div>
                ) : (
                  [...filteredIncidents].reverse().map((x) => (
                    <div key={x.id} className="log-item group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <strong
                            className={
                              x.classification.includes("[QUARANTINED]") ? "text-red-500" : ""
                            }
                          >
                            {x.classification}
                          </strong>
                          <div className="text-xs text-muted-foreground">{x.timestamp}</div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="text-xs btn-ghost"
                            onClick={() => navigator.clipboard.writeText(x.id)}
                          >
                            Copy ID
                          </button>
                          <button
                            className="text-xs btn-danger"
                            onClick={() => deleteIncident(x.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="my-2 text-sm whitespace-pre-wrap">{x.observation}</p>
                      {x.technical && (
                        <div className="text-xs text-muted-foreground break-words">
                          Technical reference: {x.technical}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="font-mono text-xs text-muted-foreground">
                          Record ID: {x.id}
                        </div>
                        {x.hash && (
                          <div className="font-mono text-xs text-muted-foreground break-all">
                            SHA-256: {x.hash.slice(0, 16)}...
                          </div>
                        )}
                        {x.sensitivity && (
                          <span
                            className={`badge text-xs ${x.sensitivity === "restricted" ? "tone-red" : x.sensitivity === "confidential" ? "tone-yellow" : "tone-green"}`}
                          >
                            {x.sensitivity.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Browser Capability Report */}
            <section className="panel">
              <h2 className="mb-3 text-lg font-bold">🔧 Browser Capability Report</h2>
              <pre className="font-mono text-sm whitespace-pre-wrap text-muted-foreground">
                {capabilities}
              </pre>
            </section>

            {/* Privacy & Human Rights Safeguards */}
            <section className="panel">
              <h2 className="mb-3 text-lg font-bold">🛡️ Privacy & Human-Rights Safeguards</h2>
              <p className="mb-3 text-sm">
                This application implements <strong>{SAFEGUARD_COUNT}+ defensive safeguards</strong>{" "}
                mapped to international human rights law:
              </p>
              <div className="grid gap-2 md:grid-cols-2">
                {SAFEGUARD_GROUPS.map((group) => (
                  <div key={group.id} className="p-3 bg-muted/50 rounded">
                    <h3 className="font-semibold text-sm">{group.title}</h3>
                    <p className="text-xs text-muted-foreground">{group.law}</p>
                    <p className="text-sm mt-1">{group.items.length} safeguards</p>
                  </div>
                ))}
              </div>
              <button className="btn mt-4" onClick={() => setActiveTab("safeguards")}>
                View All Safeguards
              </button>
            </section>

            {/* NDA / Provenance */}
            <section className="panel">
              <h2 className="mb-3 text-lg font-bold">
                📜 NDA / Provenance / Private License Notice
              </h2>
              <p className="text-sm">
                <strong>Copyright:</strong> © {ATTRIBUTION}. All rights reserved.
              </p>
              <p className="text-sm">
                <strong>Project:</strong> {PROJECT_NAME}
              </p>
              <p className="text-sm">
                <strong>License:</strong> Private License — confidential, non-transferable, subject
                to NDA.
              </p>
              <p className="text-sm">
                <strong>Safeguards:</strong> 200+ international human rights law compliant
              </p>
              <p className="font-mono text-sm">
                <strong>Timestamp:</strong> {iso || "--"}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                This notice records project attribution and provenance information. It does not by
                itself create or prove a legally enforceable NDA, copyright registration, ownership
                of radio spectrum, or legal finding against another person.
              </p>
            </section>
          </div>
        )}

        {/* Sentinel Dashboard Tab */}
        {activeTab === "sentinel" && <SentinelDashboard />}

        {/* Safeguards Tab */}
        {activeTab === "safeguards" && (
          <div className="space-y-6">
            <div className="panel">
              <h2 className="mb-3 text-2xl font-bold">🔒 200+ Defensive Safeguards</h2>
              <p className="text-muted-foreground mb-6">
                Comprehensive safeguards mapped to international human rights law principles.
              </p>

              <div className="space-y-6">
                {SAFEGUARD_GROUPS.map((group) => (
                  <div key={group.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold">{group.title}</h3>
                      <span className="badge tone-muted">{group.items.length} safeguards</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{group.law}</p>
                    <p className="text-sm text-muted-foreground mb-4">{group.description}</p>

                    <div className="grid gap-2">
                      {group.items.map((item, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded ${item.priority === "critical" ? "bg-red-500/10 border border-red-500/20" : item.priority === "high" ? "bg-yellow-500/10 border border-yellow-500/20" : "bg-muted/50"}`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={
                                item.priority === "critical"
                                  ? "text-red-500"
                                  : item.priority === "high"
                                    ? "text-yellow-500"
                                    : "text-green-500"
                              }
                            >
                              {item.priority === "critical"
                                ? "🔴"
                                : item.priority === "high"
                                  ? "🟡"
                                  : "🟢"}
                            </span>
                            <p className="font-medium">{item.description}</p>
                          </div>
                          {item.lawReference && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.lawReference}
                            </p>
                          )}
                          {item.technicalImplementation && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Technical: {item.technicalImplementation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Legal Framework Tab */}
        {activeTab === "legal" && (
          <div className="space-y-6">
            <div className="panel">
              <h2 className="mb-3 text-2xl font-bold">⚖️ International Legal Framework</h2>
              <p className="text-muted-foreground mb-6">
                Comprehensive compliance with international human rights instruments.
              </p>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getLegalFrameworks().map((instrument, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-bold text-lg">{instrument.name}</h3>
                    <p className="text-sm text-muted-foreground">{instrument.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Articles: {instrument.articles.join(", ")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Compliance Report</h3>
                <div className="space-y-4">
                  {generateComplianceReport(PROJECT_NAME).map((check, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${check.compliant ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={check.compliant ? "text-green-500" : "text-red-500"}>
                          {check.compliant ? "✓" : "✗"}
                        </span>
                        <h4 className="font-semibold">{check.requirement}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{check.legalBasis}</p>
                      <p className="text-sm mt-2">{check.evidence}</p>
                      {check.recommendation && (
                        <p className="text-sm mt-2 text-blue-500">{check.recommendation}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Encryption Tab */}
        {activeTab === "encryption" && (
          <div className="space-y-6">
            <div className="panel">
              <h2 className="mb-3 text-2xl font-bold">🔐 Encryption Utilities</h2>
              <p className="text-muted-foreground mb-6">
                {isEncryptionAvailable()
                  ? "Web Crypto API is available for client-side encryption."
                  : "Web Crypto API is not available in this browser."}
              </p>

              {isEncryptionAvailable() && (
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Encrypt Section */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-bold mb-4">Encrypt Data</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Text to Encrypt</label>
                        <textarea
                          className="field w-full mt-1"
                          rows={4}
                          placeholder="Enter sensitive text to encrypt..."
                          value={observation}
                          onChange={(e) => setObservation(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Password</label>
                        <input
                          type="password"
                          className="field w-full mt-1"
                          placeholder="Enter encryption password..."
                          value={encryptionPassword}
                          onChange={(e) => setEncryptionPassword(e.target.value)}
                        />
                      </div>
                      <button className="btn btn-primary" onClick={handleEncrypt}>
                        Encrypt
                      </button>
                    </div>

                    {encryptedData && (
                      <div className="mt-4 p-3 bg-green-500/10 rounded border border-green-500/20">
                        <h4 className="font-semibold mb-2">Encrypted Data</h4>
                        <pre className="text-xs font-mono whitespace-pre-wrap">
                          {JSON.stringify(encryptedData, null, 2)}
                        </pre>
                        <button
                          className="btn btn-ghost text-xs mt-2"
                          onClick={() =>
                            navigator.clipboard.writeText(JSON.stringify(encryptedData))
                          }
                        >
                          Copy to Clipboard
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Decrypt Section */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-bold mb-4">Decrypt Data</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Encrypted Data (JSON)</label>
                        <textarea
                          className="field w-full mt-1"
                          rows={4}
                          placeholder="Paste encrypted JSON here..."
                          value={JSON.stringify(encryptedData) || ""}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Password</label>
                        <input
                          type="password"
                          className="field w-full mt-1"
                          placeholder="Enter decryption password..."
                          value={decryptionPassword}
                          onChange={(e) => setDecryptionPassword(e.target.value)}
                        />
                      </div>
                      <button className="btn btn-primary" onClick={handleDecrypt}>
                        Decrypt
                      </button>
                    </div>

                    {decryptedText && (
                      <div className="mt-4 p-3 bg-blue-500/10 rounded border border-blue-500/20">
                        <h4 className="font-semibold mb-2">Decrypted Text</h4>
                        <p className="whitespace-pre-wrap">{decryptedText}</p>
                        <button
                          className="btn btn-ghost text-xs mt-2"
                          onClick={() => navigator.clipboard.writeText(decryptedText)}
                        >
                          Copy to Clipboard
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-yellow-500/10 rounded border border-yellow-500/20">
                <h3 className="font-bold mb-2">⚠️ Important Encryption Notes</h3>
                <ul className="text-sm space-y-1">
                  <li>• Encryption is performed entirely in your browser using Web Crypto API</li>
                  <li>• No data is transmitted to any server</li>
                  <li>• If you lose your password, encrypted data cannot be recovered</li>
                  <li>• Store passwords securely and separately from encrypted data</li>
                  <li>• Encryption does not replace proper security practices</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="px-5 py-6 text-center text-xs text-muted-foreground border-t">
        © {ATTRIBUTION} — NDA / provenance / defensive technology concept — international
        human-rights-law ethics and privacy principles. Private License. All rights reserved.
        <br />
        Enhanced with 200+ safeguards, autonomous interference detection, encryption, and
        comprehensive legal framework compliance.
      </footer>
    </div>
  );
}

export default Index;
