import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Masthead } from "@/components/site/Masthead";
import { Ticker } from "@/components/site/Ticker";
import { Footer } from "@/components/site/Footer";
import { listPredictions } from "@/lib/predictions.functions";

const qo = queryOptions({ queryKey: ["predictions", "all"], queryFn: () => listPredictions() });

export const Route = createFileRoute("/predictions")({
  head: () => ({
    meta: [
      { title: "Predictions Board — The Political Gambler" },
      { name: "description", content: "Our line versus the market line, updated continuously." },
      { property: "og:title", content: "Predictions Board — The Political Gambler" },
      { property: "og:description", content: "Our line versus the market." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(qo),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex flex-col"><Masthead /><main className="container-edit py-20 text-center flex-1"><h1 className="font-serif text-3xl">Could not load</h1><p className="mt-2">{error.message}</p></main><Footer /></div>
  ),
  component: Predictions,
});

function Predictions() {
  const { data: predictions } = useSuspenseQuery(qo);
  return (
    <div className="min-h-screen flex flex-col">
      <Masthead />
      <Ticker />
      <main className="container-edit py-10 flex-1">
        <div className="eyebrow text-signal">The Board</div>
        <h1 className="font-serif text-4xl md:text-6xl mt-2">Predictions</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Our model's line versus the market line, with computed edge. Insider members see locked
          markets and confidence intervals.
        </p>
        <div className="rule-thick mt-6" />

        <div className="mt-6 overflow-x-auto border border-ink">
          <table className="w-full text-sm">
            <thead className="bg-ink text-paper">
              <tr>
                <th className="text-left p-3 font-mono text-[11px] uppercase tracking-widest">Market</th>
                <th className="text-left p-3 font-mono text-[11px] uppercase tracking-widest">Contract</th>
                <th className="text-right p-3 font-mono text-[11px] uppercase tracking-widest">Our line</th>
                <th className="text-right p-3 font-mono text-[11px] uppercase tracking-widest">Market</th>
                <th className="text-right p-3 font-mono text-[11px] uppercase tracking-widest">Edge</th>
                <th className="text-left p-3 font-mono text-[11px] uppercase tracking-widest">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((p) => (
                <tr key={p.id} className={`border-t border-rule ${p.is_locked ? "bg-secondary/40" : ""}`}>
                  <td className="p-3"><div className="font-medium">{p.market}</div></td>
                  <td className="p-3 text-muted-foreground">{p.contract}</td>
                  <td className="p-3 text-right font-mono">{p.is_locked ? "—" : p.our_line}</td>
                  <td className="p-3 text-right font-mono text-muted-foreground">{p.market_line}</td>
                  <td className={`p-3 text-right font-mono ${!p.is_locked && p.edge >= 5 ? "text-signal font-semibold" : ""}`}>
                    {p.is_locked ? "🔒" : `+${p.edge.toFixed(1)}`}
                  </td>
                  <td className="p-3">
                    <span className={`text-[11px] font-mono uppercase tracking-widest ${
                      p.confidence === "High" ? "text-success" : p.confidence === "Medium" ? "text-gold" : "text-muted-foreground"
                    }`}>{p.is_locked ? "—" : p.confidence}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 border border-ink p-6 bg-card flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="eyebrow text-signal">Locked markets</div>
            <div className="font-serif text-xl mt-1">Unlock the full board with Insider.</div>
          </div>
          <Link to="/membership" className="bg-ink text-paper px-5 py-3 text-xs font-mono uppercase tracking-widest hover:bg-signal transition-colors">See plans →</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
