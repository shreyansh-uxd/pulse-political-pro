import { createFileRoute } from "@tanstack/react-router";
import { Masthead } from "@/components/site/Masthead";
import { Footer } from "@/components/site/Footer";
import { plans } from "@/lib/mock-content";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "Membership — The Political Gambler" },
      { name: "description", content: "Reader, Insider, or Operator. Three plans for three kinds of readers." },
      { property: "og:title", content: "Membership — The Political Gambler" },
      { property: "og:description", content: "Three plans. Pick yours." },
    ],
  }),
  component: Membership,
});

function Membership() {
  return (
    <div className="min-h-screen flex flex-col">
      <Masthead />
      <main className="container-edit py-10 flex-1">
        <div className="text-center max-w-2xl mx-auto">
          <div className="eyebrow text-signal">Membership</div>
          <h1 className="font-serif text-4xl md:text-6xl mt-2">Three plans.</h1>
          <p className="mt-4 text-muted-foreground">
            Cancel any time. Annual saves two months. Site-license and team pricing available on request.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`border ${p.featured ? "border-ink bg-card shadow-[6px_6px_0_0_var(--ink)]" : "border-rule bg-paper"} p-7 flex flex-col`}
            >
              {p.featured && <div className="eyebrow text-signal mb-2">Most popular</div>}
              <div className="font-serif text-2xl">{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-serif text-5xl">${p.price}</span>
                <span className="text-sm text-muted-foreground">{p.cadence}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
              <ul className="mt-5 space-y-2 text-sm flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-signal font-mono">→</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-6 px-5 py-3 text-xs font-mono uppercase tracking-widest transition-colors ${
                  p.featured
                    ? "bg-ink text-paper hover:bg-signal"
                    : "border border-ink hover:bg-ink hover:text-paper"
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 text-sm">
          {[
            ["Independent", "No advertisers, no donors with priors, no consulting clients in the races we cover."],
            ["Calibrated", "We publish hit rates, log losses, and where we were wrong. Every quarter."],
            ["Useful", "Members tell us what to dig into. The agenda is set in the threads."],
          ].map(([h, b]) => (
            <div key={h}>
              <div className="eyebrow text-signal">{h}</div>
              <p className="mt-2 text-muted-foreground">{b}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
