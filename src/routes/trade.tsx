// © Ervin Remus Radosavlevici — Private License. Confidential, NDA-bound.
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getTradeData, type TradeRow } from "@/lib/comtrade.functions";

export const Route = createFileRoute("/trade")({
  head: () => ({
    meta: [
      { title: "UN Trade Data Explorer — Ervin Remus Radosavlevici" },
      { name: "description", content: "Search official UN Comtrade import and export statistics by country, product and year." },
      { property: "og:title", content: "UN Trade Data Explorer" },
      { property: "og:description", content: "Official UN Comtrade import/export statistics by country, product and year." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TradePage,
});

const COUNTRIES: [string, string][] = [
  ["0", "World"], ["826", "United Kingdom"], ["842", "USA"], ["642", "Romania"], ["276", "Germany"],
  ["251", "France"], ["380", "Italy"], ["724", "Spain"], ["156", "China"], ["392", "Japan"],
  ["699", "India"], ["76", "Brazil"], ["124", "Canada"], ["36", "Australia"], ["804", "Ukraine"],
];
const PRODUCTS: [string, string][] = [
  ["TOTAL", "All products"], ["8526", "Radar & radio navigation"], ["8529", "Radio/TV parts"],
  ["8517", "Phones & network equipment"], ["8525", "Transmitters & cameras"], ["8806", "Drones (UAV)"],
  ["30", "Pharmaceuticals"], ["10", "Cereals"], ["27", "Fuels & oils"], ["87", "Vehicles"],
];

function TradePage() {
  const fetchTrade = useServerFn(getTradeData);
  const [f, setF] = useState({ reporterCode: "826", partnerCode: "0", period: "2023", cmdCode: "TOTAL", flowCode: "M" as "M" | "X" });
  const [rows, setRows] = useState<TradeRow[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true); setError(undefined);
    try {
      const r = await fetchTrade({ data: f });
      setRows(r.rows); setError(r.error ?? (r.rows.length ? undefined : "No results for this search."));
    } catch { setError("Please check the search values."); } finally { setLoading(false); }
  }
  const max = Math.max(1, ...rows.map((r) => r.value));
  const sel = (k: keyof typeof f, opts: [string, string][], label: string) => (
    <label className="block text-sm"><span className="text-muted-foreground">{label}</span>
      <select className="field mt-1 w-full" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })}>
        {opts.map(([v, n]) => <option key={v} value={v}>{n}</option>)}
      </select></label>
  );

  return (
    <div className="min-h-screen">
      <header className="site-header px-5 py-6 border-b">
        <div className="mx-auto max-w-5xl">
          <Link to="/" className="text-sm text-muted-foreground">← Evidence Registry</Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">🌍 UN Trade Data Explorer</h1>
          <p className="mt-2 text-muted-foreground">Official import and export statistics from UN Comtrade. Figures in US dollars.</p>
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-6 p-5">
        <section className="panel grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {sel("reporterCode", COUNTRIES.slice(1), "Country")}
          {sel("partnerCode", COUNTRIES, "Trading partner")}
          {sel("cmdCode", PRODUCTS, "Product")}
          {sel("flowCode", [["M", "Imports"], ["X", "Exports"]], "Direction")}
          <label className="block text-sm"><span className="text-muted-foreground">Year</span>
            <input className="field mt-1 w-full" inputMode="numeric" maxLength={4} value={f.period}
              onChange={(e) => setF({ ...f, period: e.target.value.replace(/\D/g, "") })} /></label>
          <div className="flex items-end">
            <button className="btn-primary w-full" onClick={search} disabled={loading}>{loading ? "Searching…" : "Search"}</button>
          </div>
        </section>
        {error && <div className="notice">{error}</div>}
        {rows.length > 0 && (
          <section className="panel space-y-3 p-5">
            {rows.map((r, i) => (
              <div key={i} className="log-item">
                <div className="flex flex-wrap justify-between gap-2 text-sm">
                  <span>{r.reporter} → {r.partner} · {r.flow} · {r.period}</span>
                  <span className="font-mono">${r.value.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">{r.cmdCode} — {r.cmdDesc}</p>
                <div className="mt-2 h-2 rounded bg-muted"><div className="h-2 rounded bg-primary" style={{ width: `${(r.value / max) * 100}%` }} /></div>
              </div>
            ))}
          </section>
        )}
        <p className="text-xs text-muted-foreground">Source: UN Comtrade. Trade statistics are context, not evidence about any person. © Ervin Remus Radosavlevici.</p>
      </main>
    </div>
  );
}
