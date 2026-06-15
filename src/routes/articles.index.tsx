import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Masthead } from "@/components/site/Masthead";
import { Footer } from "@/components/site/Footer";
import { listPublishedArticles } from "@/lib/articles.functions";
import { resolveHeroImage } from "@/lib/image-resolver";

const qo = queryOptions({ queryKey: ["articles", "published"], queryFn: () => listPublishedArticles() });

export const Route = createFileRoute("/articles/")({
  head: () => ({
    meta: [
      { title: "Analysis — The Political Gambler" },
      { name: "description", content: "All analysis, columns, and long-reads from The Political Gambler." },
      { property: "og:title", content: "Analysis — The Political Gambler" },
      { property: "og:description", content: "Independent political analysis and long-reads." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(qo),
  errorComponent: ({ error }) => <ErrorView message={error.message} />,
  component: ArticlesIndex,
});

function ErrorView({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Masthead />
      <main className="container-edit py-20 flex-1 text-center">
        <h1 className="font-serif text-3xl">Could not load articles</h1>
        <p className="mt-2 text-muted-foreground">{message}</p>
      </main>
      <Footer />
    </div>
  );
}

function ArticlesIndex() {
  const { data: articles } = useSuspenseQuery(qo);
  return (
    <div className="min-h-screen flex flex-col">
      <Masthead />
      <main className="container-edit py-10 flex-1">
        <div className="eyebrow text-signal">Section</div>
        <h1 className="font-serif text-4xl md:text-6xl mt-2">Analysis</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Long-reads, methodology notes, and the column. Sorted by recency.
        </p>
        <div className="rule-thick mt-6" />

        {articles.length === 0 ? (
          <p className="mt-10 text-muted-foreground">No articles yet.</p>
        ) : (
          <ul className="mt-6 divide-y divide-rule">
            {articles.map((a) => (
              <li key={a.slug} className="py-8 grid gap-6 md:grid-cols-12">
                <Link to="/articles/$slug" params={{ slug: a.slug }} className="md:col-span-4 block group">
                  <img src={resolveHeroImage(a.hero_image_url, a.slug)} alt={a.title} loading="lazy" width={1200} height={800}
                    className="w-full aspect-[4/3] object-cover border border-ink group-hover:opacity-90" />
                </Link>
                <div className="md:col-span-8">
                  <div className="flex items-center gap-2">
                    <span className="eyebrow text-signal">{a.category}</span>
                    {a.is_premium && <span className="font-mono text-[10px] uppercase tracking-widest border border-ink px-1.5 py-0.5">Insider</span>}
                  </div>
                  <Link to="/articles/$slug" params={{ slug: a.slug }}>
                    <h2 className="font-serif text-2xl md:text-3xl mt-2 hover:text-signal transition-colors">{a.title}</h2>
                  </Link>
                  <p className="mt-3 text-muted-foreground">{a.dek}</p>
                  <div className="mt-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                    {a.author_name ?? "Staff"} · {a.published_at ? new Date(a.published_at).toLocaleDateString() : ""} · {a.read_minutes} min
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}
