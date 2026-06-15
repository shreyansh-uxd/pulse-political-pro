import { createFileRoute } from "@tanstack/react-router";
import { Masthead } from "@/components/site/Masthead";
import { Footer } from "@/components/site/Footer";
import { NewsletterCTA } from "@/components/site/NewsletterCTA";

export const Route = createFileRoute("/newsletter")({
  head: () => ({
    meta: [
      { title: "Newsletter — The Political Gambler" },
      { name: "description", content: "The Sunday Brief: one email a week with the numbers that matter. Cross-posted from our Substack." },
      { property: "og:title", content: "The Sunday Brief" },
      { property: "og:description", content: "One email a week. Cross-posted from Substack." },
    ],
  }),
  component: Newsletter,
});

function Newsletter() {
  return (
    <div className="min-h-screen flex flex-col">
      <Masthead />
      <main className="container-edit py-10 flex-1 max-w-3xl">
        <div className="eyebrow text-signal">Newsletter</div>
        <h1 className="font-serif text-4xl md:text-6xl mt-2">The Sunday Brief</h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          One email, every Sunday morning. The week ahead in DC, the markets we're watching, and the
          single chart that explains the news. Also cross-posted on Substack — read it wherever you
          prefer.
        </p>

        <div className="mt-10">
          <NewsletterCTA />
        </div>

        <div className="mt-12 rule-thick" />
        <h2 className="font-serif text-2xl mt-4">Recent issues</h2>
        <ul className="mt-4 divide-y divide-rule">
          {[
            { d: "Mar 10", t: "Why we faded the consensus on PA-Sen" },
            { d: "Mar 03", t: "Three turnout assumptions worth questioning" },
            { d: "Feb 25", t: "The mid-cycle market is wrong about 2026" },
            { d: "Feb 18", t: "How we score a 'mispriced' race" },
          ].map((i) => (
            <li key={i.d} className="py-4 flex items-baseline gap-4">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground w-16 shrink-0">{i.d}</span>
              <a href="#" className="font-serif text-lg hover:text-signal">{i.t}</a>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
