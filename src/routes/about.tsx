import { createFileRoute } from "@tanstack/react-router";
import { Masthead } from "@/components/site/Masthead";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — The Political Gambler" },
      { name: "description", content: "Who we are, how we work, and what we mean by 'edge'." },
      { property: "og:title", content: "About — The Political Gambler" },
      { property: "og:description", content: "Independent political analysis since 2014." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Masthead />
      <main className="container-edit py-16 flex-1 max-w-3xl">
        <div className="eyebrow text-signal">Colophon</div>
        <h1 className="font-serif text-4xl md:text-6xl mt-2">About</h1>
        <div className="mt-8 space-y-6 font-serif text-lg leading-relaxed">
          <p className="first-letter:font-serif first-letter:text-6xl first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.85]">
            The Political Gambler started in 2014 as a Sunday email to a few friends in the polling
            industry. The premise was simple: most political commentary is downstream of vibes, and
            the people closest to the numbers usually disagree with the cable consensus.
          </p>
          <p>
            A decade later we are still doing the same thing — just for more readers, with a model
            that's been pressure-tested over five cycles, and a small newsroom that publishes its
            own calibration.
          </p>
          <p>
            We are reader-funded. No advertisers, no donors with priors in the races we cover, no
            consulting clients. If we're wrong, we say so. If we're right, you'll see it in the
            quarterly scorecard.
          </p>
        </div>

        <div className="mt-12 rule-thick" />
        <h2 className="font-serif text-2xl mt-4">How we work</h2>
        <ol className="mt-4 space-y-3 text-sm">
          <li><span className="font-mono text-signal">01.</span> Start with base rates, not narratives.</li>
          <li><span className="font-mono text-signal">02.</span> Publish the model output, not just the take.</li>
          <li><span className="font-mono text-signal">03.</span> Score ourselves in public, every quarter.</li>
          <li><span className="font-mono text-signal">04.</span> When the data disagrees with the consensus, write that piece.</li>
        </ol>
      </main>
      <Footer />
    </div>
  );
}
