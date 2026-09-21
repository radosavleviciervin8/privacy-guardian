import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
  getEvidence,
  newId,
  nowISO,
  setEvidence,
  sha256,
  type CategoryKey,
  type Incident,
} from "@/lib/evidence";

const TITLE = "NDA Multi-Signal Defensive Protection Registry";
const DESCRIPTION =
  "Local-first, non-jamming defensive evidence registry for Bluetooth, RF, infrared, vibration, audio, drone and mobile observations. Copyright Ervin Remus Radosavlevici.";

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

const emptyCategories = () =>
  Object.fromEntries(CATEGORY_KEYS.map((k) => [k, false])) as Record<CategoryKey, boolean>;

function Index() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [clock, setClock] = useState("");
  const [iso, setIso] = useState("");
  const [capabilities, setCapabilities] = useState("Checking...");
  const [classification, setClassification] = useState(CLASSIFICATIONS[0]);
  const [observation, setObservation] = useState("");
  const [technical, setTechnical] = useState("");
  const [categories, setCategories] = useState(emptyCategories);
  const [notice, setNotice] = useState<string | null>(null);
  const formRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    setIncidents(getEvidence());
    setCapabilities(capabilityReport().join("\n"));
    const tick = () => {
      setClock(new Date().toLocaleString(undefined, { dateStyle: "full", timeStyle: "medium" }));
      setIso(nowISO());
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4500);
    return () => clearTimeout(t);
  }, [notice]);

  const toggle = (k: CategoryKey) => setCategories((c) => ({ ...c, [k]: !c[k] }));

  async function saveIncident() {
    const obs = observation.trim();
    if (!obs) return setNotice("Please describe what was directly observed.");
    if (obs.length > MAX_OBSERVATION || technical.length > MAX_TECHNICAL)
      return setNotice("Entry too long. Please shorten the text.");

    const incident: Incident = {
      id: newId(),
      timestamp: nowISO(),
      attribution: ATTRIBUTION,
      classification,
      observation: obs,
      technical: technical.trim(),
      categories,
      browser: {
        userAgent: navigator.userAgent,
        online: navigator.onLine,
        secureContext: window.isSecureContext,
      },
    };
    incident.hash = await sha256(JSON.stringify(incident));
    const next = [...getEvidence(), incident];
    setEvidence(next);
    setIncidents(next);
    setObservation("");
    setTechnical("");
    setNotice("Timestamped local evidence record created.");
  }

  async function requestBluetooth() {
    const bt = (navigator as unknown as { bluetooth?: { requestDevice: (o: unknown) => Promise<{ name?: string; id?: string }> } }).bluetooth;
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
      setNotice("Bluetooth information returned by the browser. This does not prove malicious activity.");
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
  }

  function deleteEvidence() {
    if (!confirm("Delete ALL locally stored evidence from this browser?")) return;
    clearEvidence();
    setIncidents([]);
    setNotice("Local evidence deleted.");
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

  return (
    <div className="min-h-screen">
      <header className="site-header px-5 py-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-2 text-2xl font-bold tracking-tight">🛡 {TITLE}</h1>
          <span className="badge tone-green">DEFENSIVE / LOCAL / NON-JAMMING</span>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
            A browser-based defensive evidence and privacy registry for recording observable events
            involving Bluetooth, RF-related observations, infrared observations, vibration/audio
            observations, mobile devices, drones and other possible technical incidents.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-5 px-5 py-5">
        <div className="notice text-sm leading-relaxed">
          <strong>Important:</strong> This application does not jam, interfere with, disable, hack,
          take control of, or attack another person's equipment. Browser APIs cannot reliably
          measure the entire radio spectrum or identify a drone/operator. Records are therefore
          labelled as observations or technical evidence, not automatic proof of wrongdoing.
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <section className="panel">
            <h2 className="mb-3 text-lg font-bold">System protection</h2>
            <span className="badge tone-green">Local evidence mode</span>
            <p className="my-3 text-xs text-muted-foreground">
              No automatic transmission. No RF jammer. No hidden microphone. No hidden camera. No
              remote device control.
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-safe" onClick={requestBluetooth}>Request Bluetooth Device</button>
              <button className="btn" onClick={() => setCapabilities(capabilityReport().join("\n"))}>Check Browser Sensors</button>
              <button className="btn" onClick={focusForm}>Record Observation</button>
            </div>
          </section>

          <section className="panel">
            <h2 className="mb-3 text-lg font-bold">Current timestamp</h2>
            <div className="tone-blue text-xl font-extrabold leading-snug">{clock || "—"}</div>
            <p className="my-3 text-xs text-muted-foreground">Timestamp generated locally by this device.</p>
            <button className="btn" onClick={copyTimestamp}>Copy timestamp</button>
          </section>

          <section className="panel">
            <h2 className="mb-3 text-lg font-bold">Protection categories</h2>
            <div className="space-y-2">
              {CATEGORY_KEYS.map((k) => (
                <label key={k} className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" className="accent-accent" checked={categories[k]} onChange={() => toggle(k)} />
                  {CATEGORY_LABELS[k]}
                </label>
              ))}
            </div>
          </section>
        </div>

        <section className="panel">
          <h2 className="mb-3 text-lg font-bold">Incident / observation record</h2>
          <label className="text-xs text-muted-foreground">Event classification</label>
          <select ref={formRef} className="field" value={classification} onChange={(e) => setClassification(e.target.value)}>
            {CLASSIFICATIONS.map((c) => <option key={c}>{c}</option>)}
          </select>

          <label className="text-xs text-muted-foreground">What was directly observed?</label>
          <textarea
            className="field"
            maxLength={MAX_OBSERVATION}
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Describe only what was directly observed. Avoid identifying or accusing a person unless independently verified."
          />

          <label className="text-xs text-muted-foreground">Optional technical evidence/reference</label>
          <textarea
            className="field"
            maxLength={MAX_TECHNICAL}
            value={technical}
            onChange={(e) => setTechnical(e.target.value)}
            placeholder="Example: Bluetooth device name shown by the browser, sensor permission result, external measurement reference, photograph/file reference, etc."
          />

          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary" onClick={saveIncident}>Save timestamped incident</button>
            <button className="btn btn-warn" onClick={() => { setObservation(""); setTechnical(""); setCategories(emptyCategories()); }}>Clear</button>
          </div>
        </section>

        <section className="panel">
          <h2 className="mb-3 text-lg font-bold">Evidence registry</h2>
          <div className="max-h-90 overflow-auto rounded-xl border border-border">
            {incidents.length === 0 ? (
              <div className="log-item text-xs text-muted-foreground">No local incidents recorded yet.</div>
            ) : (
              [...incidents].reverse().map((x) => (
                <div key={x.id} className="log-item">
                  <strong>{x.classification}</strong>
                  <div className="text-xs text-muted-foreground">{x.timestamp}</div>
                  <p className="my-2 text-sm whitespace-pre-wrap">{x.observation}</p>
                  {x.technical && (
                    <div className="text-xs text-muted-foreground break-words">Technical reference: {x.technical}</div>
                  )}
                  <div className="font-mono text-xs text-muted-foreground">Record ID: {x.id}</div>
                  <div className="font-mono text-xs text-muted-foreground break-all">SHA-256: {x.hash || "pending"}</div>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn btn-safe" onClick={exportEvidence}>Export evidence JSON</button>
            <button className="btn btn-danger" onClick={deleteEvidence}>Delete local evidence</button>
          </div>
        </section>

        <section className="panel">
          <h2 className="mb-3 text-lg font-bold">Browser capability report</h2>
          <pre className="font-mono text-sm whitespace-pre-wrap text-muted-foreground">{capabilities}</pre>
        </section>

        <section className="panel">
          <h2 className="mb-3 text-lg font-bold">Privacy &amp; human-rights safeguards</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Local-first evidence storage.</li>
            <li>No automatic accusation of another person.</li>
            <li>No automatic identification of individuals.</li>
            <li>No covert microphone recording.</li>
            <li>No covert camera recording.</li>
            <li>No RF or Bluetooth jamming.</li>
            <li>No remote takeover of phones, drones or computers.</li>
            <li>Events are separated from conclusions.</li>
            <li>Every incident receives a timestamp and SHA-256 integrity hash.</li>
            <li>Evidence can be exported for independent review.</li>
            <li>Users can delete locally stored evidence.</li>
          </ul>
          <p className="mt-3 text-sm leading-relaxed">
            The design follows the proportionality, necessity and transparency principles of
            international human-rights law (UDHR Art. 12, ICCPR Art. 17, ECHR Art. 8): collect only
            what is necessary for the stated defensive purpose.
          </p>
        </section>

        <section className="panel">
          <h2 className="mb-3 text-lg font-bold">NDA / provenance / private license notice</h2>
          <p className="text-sm"><strong>Copyright:</strong> © {ATTRIBUTION}. All rights reserved.</p>
          <p className="text-sm"><strong>Project:</strong> {PROJECT_NAME}</p>
          <p className="text-sm"><strong>License:</strong> Private License — confidential, non-transferable, subject to NDA.</p>
          <p className="font-mono text-sm"><strong>Timestamp:</strong> {iso || "—"}</p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            This notice records project attribution and provenance information. It does not by
            itself create or prove a legally enforceable NDA, copyright registration, ownership of
            radio spectrum, or legal finding against another person.
          </p>
        </section>
      </main>

      <footer className="px-5 py-6 text-center text-xs text-muted-foreground">
        © {ATTRIBUTION} — NDA / provenance / defensive technology concept — international
        human-rights-law ethics and privacy principles. Private License. All rights reserved.
      </footer>

      {notice && (
        <div role="status" className="badge tone-blue fixed bottom-5 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 border border-border shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {notice}
        </div>
      )}
    </div>
  );
}
