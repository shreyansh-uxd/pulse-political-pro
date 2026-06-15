import { createServerFn } from "@tanstack/react-start";

export type PredictionRow = {
  id: string;
  market: string;
  contract: string;
  our_line: string;
  market_line: string;
  edge: number;
  confidence: "Low" | "Medium" | "High";
  is_locked: boolean;
  updated_at: string;
};

export const listPredictions = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("predictions")
    .select("id, market, contract, our_line, market_line, edge, confidence, is_locked, updated_at")
    .order("edge", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({ ...r, edge: Number(r.edge) })) as PredictionRow[];
});
