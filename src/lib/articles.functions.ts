import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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

export const listPublishedArticles = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("articles")
    .select("id, slug, title, dek, category, hero_image_url, is_premium, read_minutes, author_name, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return (data ?? []) as ArticleListItem[];
});

export const getArticleBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("articles")
      .select("id, slug, title, dek, body, category, hero_image_url, is_premium, status, read_minutes, author_name, published_at")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row ?? null) as ArticleFull | null;
  });
