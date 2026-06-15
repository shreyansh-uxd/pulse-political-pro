import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertStaff(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r: { role: string }) => r.role);
  const ok = roles.includes("admin") || roles.includes("editor");
  if (!ok) throw new Error("Forbidden: editor or admin role required");
  return { isAdmin: roles.includes("admin") };
}

export const adminListArticles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("articles")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const articleInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, hyphens"),
  title: z.string().trim().min(1).max(240),
  dek: z.string().trim().max(500).optional().nullable(),
  body: z.string().max(50000).optional().nullable(),
  category: z.string().trim().min(1).max(60),
  hero_image_url: z.string().trim().max(500).optional().nullable(),
  is_premium: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
  read_minutes: z.number().int().min(1).max(120).default(5),
  author_name: z.string().trim().max(120).optional().nullable(),
});

export const adminUpsertArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => articleInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      ...data,
      author_id: context.userId,
      published_at: data.status === "published" ? new Date().toISOString() : null,
    };
    const { data: row, error } = await supabaseAdmin
      .from("articles")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeleteArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { isAdmin } = await assertStaff(context.supabase, context.userId);
    if (!isAdmin) throw new Error("Forbidden: admin required to delete");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("articles").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Predictions
export const adminListPredictions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("predictions")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const predictionInput = z.object({
  id: z.string().uuid().optional(),
  market: z.string().trim().min(1).max(120),
  contract: z.string().trim().min(1).max(160),
  our_line: z.string().trim().min(1).max(20),
  market_line: z.string().trim().min(1).max(20),
  edge: z.number().min(-99).max(99),
  confidence: z.enum(["Low", "Medium", "High"]),
  is_locked: z.boolean().default(false),
  notes: z.string().max(1000).optional().nullable(),
});

export const adminUpsertPrediction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => predictionInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("predictions")
      .upsert(data, { onConflict: "id" })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeletePrediction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("predictions").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Newsletter
export const adminListSubscribers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// Stats for admin dashboard
export const adminDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [a, p, s, members] = await Promise.all([
      supabaseAdmin.from("articles").select("status", { count: "exact", head: false }),
      supabaseAdmin.from("predictions").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
    ]);
    const published = (a.data ?? []).filter((r: { status: string }) => r.status === "published").length;
    const drafts = (a.data ?? []).filter((r: { status: string }) => r.status === "draft").length;
    return {
      articlesPublished: published,
      articlesDrafts: drafts,
      predictions: p.count ?? 0,
      subscribers: s.count ?? 0,
      members: members.count ?? 0,
    };
  });

// User role lookup for client (uses user-scoped client via middleware)
export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return (data ?? []).map((r: { role: string }) => r.role);
  });
