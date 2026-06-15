import { getPredictions } from "./mock-db";

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
  const all = getPredictions();
  all.sort((a, b) => b.edge - a.edge);
  return all as PredictionRow[];
};

