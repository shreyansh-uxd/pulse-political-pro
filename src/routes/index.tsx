import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Masthead } from "@/components/site/Masthead";
import { Ticker } from "@/components/site/Ticker";
import { Footer } from "@/components/site/Footer";
import { NewsletterCTA } from "@/components/site/NewsletterCTA";
import { listPublishedArticles } from "@/lib/articles.functions";
import { listPredictions } from "@/lib/predictions.functions";
import { resolveHeroImage } from "@/lib/image-resolver";
import { useQuery } from "@/hooks/use-query";

function Home() {
  useEffect(() => {
    document.title = "The Political Gambler — Numbers, narrative, and the edge in American politics";
  }, []);

  const { data: articles, loading: articlesLoading } = useQuery(listPublishedArticles);
  const { data: predictions, loading: predictionsLoading } = useQuery(listPredictions);

  if (articlesLoading || predictionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="font-mono text-sm tracking-widest text-muted-foreground">LOADING...</div>
      </div>
    );
  }

  const articlesList = articles || [];
  const predictionsList = predictions || [];
  const [lead, ...rest] = articlesList;

  if (!lead) {
    return (
      <div className="min-h-screen flex flex-col">
        <Masthead />
        <main className="container-edit py-20 text-center flex-1">
          <h1 className="font-serif text-4xl">No articles published yet.</h1>
          <p className="mt-3 text-muted-foreground">Editors can publish from the admin panel.</p>
          <Link to="/admin" className="inline-block mt-6 bg-ink text-paper px-5 py-3 text-xs font-mono uppercase tracking-widest">Open admin →</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Masthead />
      <Ticker />

      <main className="container-edit pt-8 md:pt-12 flex-1">
        <section className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <Link to={`/articles/${lead.slug}`} className="block group">
              <div className="overflow-hidden border border-ink relative grain">
                <img src={resolveHeroImage(lead.hero_image_url, lead.slug)} alt={lead.title} width={1200} height={800}
                  className="w-full aspect-[3/2] object-cover group-hover:scale-[1.02] transition-transform duration-700" />
              </div>
              <div className="mt-5">
                <div className="flex items-center gap-3">
                  <span className="eyebrow text-signal">{lead.category}</span>
                  {lead.is_premium && <span className="font-mono text-[10px] uppercase tracking-widest border border-ink px-1.5 py-0.5">Insider</span>}
                </div>
                <h2 className="font-serif text-3xl md:text-5xl mt-3 leading-[1.05] group-hover:text-signal transition-colors">{lead.title}</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">{lead.dek}</p>
                <div className="mt-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  By {lead.author_name ?? "Staff"} · {formatDate(lead.published_at)} · {lead.read_minutes} min read
                </div>
              </div>
            </Link>
          </div>

          <aside className="md:col-span-4 md:border-l md:border-rule md:pl-8">
            <div className="flex items-baseline justify-between">
              <h3 className="font-serif text-2xl">The Board</h3>
              <Link to="/predictions" className="font-mono text-[11px] uppercase tracking-widest text-signal">All →</Link>
            </div>
            <div className="mt-1 eyebrow text-muted-foreground">Where our line beats the market</div>
            <div className="rule-thick mt-3" />
            <ul className="mt-2 divide-y divide-rule">
              {predictionsList.slice(0, 5).map((p) => (
                <li key={p.id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-mono uppercase text-muted-foreground">{p.market}</div>
                      <div className="text-sm font-medium truncate">{p.contract}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono text-sm">
                        <span className="text-foreground">{p.is_locked ? "🔒" : p.our_line}</span>
                        <span className="text-muted-foreground"> / {p.market_line}</span>
                      </div>
                      <div className={`font-mono text-[11px] ${p.edge >= 5 ? "text-signal" : "text-muted-foreground"}`}>
                        +{p.edge.toFixed(1)} edge
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <div className="mt-16 rule-thick" />
        <div className="flex items-baseline justify-between mt-4">
          <h3 className="font-serif text-2xl md:text-3xl">More Analysis</h3>
          <Link to="/articles" className="font-mono text-[11px] uppercase tracking-widest text-signal">All articles →</Link>
        </div>

        <section className="mt-6 grid gap-10 md:grid-cols-3">
          {rest.map((a) => (
            <Link key={a.slug} to={`/articles/${a.slug}`} className="group block">
              <div className="overflow-hidden border border-ink">
                <img src={resolveHeroImage(a.hero_image_url, a.slug)} alt={a.title} loading="lazy" width={1200} height={800}
                  className="w-full aspect-[4/3] object-cover group-hover:scale-[1.03] transition-transform duration-700" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="eyebrow text-signal">{a.category}</span>
                {a.is_premium && <span className="font-mono text-[10px] uppercase tracking-widest border border-ink px-1.5 py-0.5">Insider</span>}
              </div>
              <h4 className="font-serif text-xl md:text-2xl mt-2 leading-tight group-hover:text-signal transition-colors">{a.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{a.dek}</p>
              <div className="mt-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                {a.author_name ?? "Staff"} · {formatDate(a.published_at)}
              </div>
            </Link>
          ))}
        </section>

        <div className="mt-20"><NewsletterCTA /></div>

        <section className="mt-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="eyebrow text-signal">Become a Member</div>
            <h3 className="font-serif text-3xl md:text-4xl mt-2 leading-tight">The work that doesn't make the front page.</h3>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-md">
              Insider members get the full model, the Sunday strategy brief, premium long-reads, and member-only threads.
            </p>
            <Link to="/membership" className="inline-block mt-6 bg-ink text-paper px-6 py-3 text-xs font-mono uppercase tracking-widest hover:bg-signal transition-colors">See plans →</Link>
          </div>
          <div className="border border-ink p-6 bg-card">
            <div className="eyebrow mb-3">This week, Insider only</div>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3"><span className="font-mono text-signal">01.</span> The mid-cycle turnout model, updated</li>
              <li className="flex gap-3"><span className="font-mono text-signal">02.</span> Three races the consensus is mispricing</li>
              <li className="flex gap-3"><span className="font-mono text-signal">03.</span> Friday Q&A: what we got wrong in February</li>
              <li className="flex gap-3"><span className="font-mono text-signal">04.</span> Sunday brief: the week ahead in DC</li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function formatDate(d: string | null) {
  if (!d) return "Draft";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default Home;
