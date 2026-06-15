import { supabase } from "@/integrations/supabase/client";

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

export const listPredictions = async () => {
  const { data, error } = await supabase
    .from("predictions")
    .select("id, market, contract, our_line, market_line, edge, confidence, is_locked, updated_at")
    .order("edge", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({ ...r, edge: Number(r.edge) })) as PredictionRow[];
};
