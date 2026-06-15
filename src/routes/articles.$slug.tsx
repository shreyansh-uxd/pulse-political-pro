import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Masthead } from "@/components/site/Masthead";
import { Footer } from "@/components/site/Footer";
import { NewsletterCTA } from "@/components/site/NewsletterCTA";
import { getArticleBySlug, listPublishedArticles } from "@/lib/articles.functions";
import { resolveHeroImage } from "@/lib/image-resolver";
import { useQuery } from "@/hooks/use-query";

function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, loading: articleLoading, error: articleError } = useQuery(
    () => getArticleBySlug(slug!),
    [slug]
  );
  
  const { data: all, loading: allLoading } = useQuery(listPublishedArticles);

  if (articleLoading || allLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Masthead />
        <main className="container-edit py-20 flex-1 text-center">
          <div className="font-mono text-sm tracking-widest text-muted-foreground">LOADING...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (articleError || !article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Masthead />
        <main className="container-edit py-20 flex-1 text-center">
          <h1 className="font-serif text-3xl">Article Not Found</h1>
          <p className="mt-2 text-muted-foreground">{articleError?.message || "The requested article does not exist."}</p>
          <Link to="/" className="inline-block mt-6 border border-ink px-4 py-2 text-xs font-mono uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors">Go Home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const allList = all || [];
  const related = allList.filter((a) => a.slug !== article.slug).slice(0, 3);
  const paragraphs = (article.body ?? "").split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col">
      <Masthead />
      <main className="flex-1">
        <article className="container-edit py-10 md:py-16 max-w-3xl">
          <div className="flex items-center gap-2 justify-center">
            <span className="eyebrow text-signal">{article.category}</span>
            {article.is_premium && <span className="font-mono text-[10px] uppercase tracking-widest border border-ink px-1.5 py-0.5">Insider</span>}
          </div>
          <h1 className="font-serif text-4xl md:text-6xl mt-3 leading-[1.05] text-center">{article.title}</h1>
          {article.dek && <p className="mt-5 text-lg md:text-xl text-muted-foreground text-center leading-relaxed">{article.dek}</p>}
          <div className="mt-6 text-[11px] font-mono uppercase tracking-widest text-muted-foreground text-center">
            By {article.author_name ?? "Staff"} · {article.published_at ? new Date(article.published_at).toLocaleDateString() : ""} · {article.read_minutes} min read
          </div>
        </article>

        <div className="container-edit max-w-5xl">
          <img src={resolveHeroImage(article.hero_image_url, article.slug)} alt={article.title} width={1600} height={1000}
            className="w-full aspect-[16/10] object-cover border border-ink" />
        </div>

        <article className="container-edit max-w-2xl py-12">
          {paragraphs.length === 0 && (
            <p className="font-serif text-lg md:text-xl leading-[1.7] text-muted-foreground">Full piece coming online shortly.</p>
          )}
          {paragraphs.map((p, i) => (
            <p key={i} className={`font-serif text-lg md:text-xl leading-[1.7] ${
              i === 0
                ? "first-letter:font-serif first-letter:text-6xl first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.85]"
                : "mt-6"
            }`}>{p}</p>
          ))}

          {article.is_premium && (
            <div className="mt-12 border-y-2 border-ink py-8 text-center bg-card">
              <div className="eyebrow text-signal">Continue Reading</div>
              <h3 className="font-serif text-2xl mt-2">The rest of this piece is for Insider members.</h3>
              <p className="mt-2 text-sm text-muted-foreground">7-day free trial. Cancel anytime.</p>
              <Link to="/membership" className="inline-block mt-5 bg-ink text-paper px-6 py-3 text-xs font-mono uppercase tracking-widest hover:bg-signal transition-colors">
                Become an Insider →
              </Link>
            </div>
          )}
        </article>

        <div className="container-edit max-w-3xl"><NewsletterCTA compact source={`article:${article.slug}`} /></div>

        {related.length > 0 && (
          <section className="container-edit mt-20">
            <div className="rule-thick" />
            <h3 className="font-serif text-2xl md:text-3xl mt-4">Related</h3>
            <div className="mt-6 grid gap-8 md:grid-cols-3">
              {related.map((a) => (
                <Link key={a.slug} to={`/articles/${a.slug}`} className="group block">
                  <img src={resolveHeroImage(a.hero_image_url, a.slug)} alt={a.title} loading="lazy" width={1200} height={800}
                    className="w-full aspect-[4/3] object-cover border border-ink" />
                  <div className="eyebrow text-signal mt-3">{a.category}</div>
                  <h4 className="font-serif text-xl mt-1 group-hover:text-signal transition-colors">{a.title}</h4>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default ArticlePage;
