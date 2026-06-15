import { supabase } from "@/integrations/supabase/client";

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
  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, title, dek, category, hero_image_url, is_premium, read_minutes, author_name, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return (data ?? []) as ArticleListItem[];
};

export const getArticleBySlug = async (slug: string) => {
  const { data: row, error } = await supabase
    .from("articles")
    .select("id, slug, title, dek, body, category, hero_image_url, is_premium, status, read_minutes, author_name, published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (row ?? null) as ArticleFull | null;
};
