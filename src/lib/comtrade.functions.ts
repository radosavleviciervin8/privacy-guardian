// © Ervin Remus Radosavlevici — Private License. Confidential, NDA-bound.
// UN Comtrade lookup. The subscription key stays on the server.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  reporterCode: z.string().regex(/^\d{1,4}$/),
  partnerCode: z.string().regex(/^\d{1,4}$/),
  period: z.string().regex(/^\d{4}$/),
  cmdCode: z.string().regex(/^(TOTAL|\d{2,6})$/),
  flowCode: z.enum(["M", "X"]),
});

export interface TradeRow {
  reporter: string;
  partner: string;
  cmdCode: string;
  cmdDesc: string;
  flow: string;
  period: string;
  value: number;
  netWeightKg: number | null;
}

export const getTradeData = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<{ rows: TradeRow[]; error?: string }> => {
    const key = process.env["COMTRADE_API_KEY"];
    if (!key) return { rows: [], error: "The UN Comtrade key has not been added yet." };
    const qs = new URLSearchParams({
      reporterCode: data.reporterCode,
      partnerCode: data.partnerCode,
      period: data.period,
      cmdCode: data.cmdCode,
      flowCode: data.flowCode,
      includeDesc: "true",
    });
    try {
      const res = await fetch(`https://comtradeapi.un.org/data/v1/get/C/A/HS?${qs}`, {
        headers: { "Ocp-Apim-Subscription-Key": key },
      });
      if (!res.ok) {
        return { rows: [], error: res.status === 401 || res.status === 403 ? "The UN Comtrade key was rejected." : `UN Comtrade is unavailable (${res.status}).` };
      }
      const json = (await res.json()) as { data?: Record<string, unknown>[] };
      const rows = (json.data ?? []).slice(0, 500).map((r) => ({
        reporter: String(r["reporterDesc"] ?? ""),
        partner: String(r["partnerDesc"] ?? ""),
        cmdCode: String(r["cmdCode"] ?? ""),
        cmdDesc: String(r["cmdDesc"] ?? ""),
        flow: String(r["flowDesc"] ?? ""),
        period: String(r["period"] ?? ""),
        value: Number(r["primaryValue"] ?? 0),
        netWeightKg: r["netWgt"] == null ? null : Number(r["netWgt"]),
      }));
      return { rows };
    } catch {
      return { rows: [], error: "Could not reach UN Comtrade." };
    }
  });
