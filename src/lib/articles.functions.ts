import { getArticles } from "./mock-db";

export type ArticleListItem = {
  id: string;
  slug: string;
  title: string;
  dek: string | null;
  category: string;
  hero_image_url: string | null;
  is_premium: boolean;
  read_minutes: number;
  author_name: string | null;
  published_at: string | null;
};

export type ArticleFull = ArticleListItem & {
  body: string | null;
  status: "draft" | "published";
};

export const listPublishedArticles = async () => {
  const all = getArticles();
  const published = all.filter((a) => a.status === "published");
  published.sort((a, b) => {
    const tA = a.published_at ? new Date(a.published_at).getTime() : 0;
    const tB = b.published_at ? new Date(b.published_at).getTime() : 0;
    return tB - tA;
  });
  return published.slice(0, 50) as ArticleListItem[];
};

export const getArticleBySlug = async (slug: string) => {
  const all = getArticles();
  const row = all.find((a) => a.slug === slug && a.status === "published");
  return (row ?? null) as ArticleFull | null;
};

