import { supabase } from "@/integrations/supabase/client";

async function assertStaff(userId: string) {
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

export const adminListArticles = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  await assertStaff(user.id);

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
};

export const adminUpsertArticle = async (data: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  await assertStaff(user.id);

  const payload = {
    ...data,
    author_id: user.id,
    published_at: data.status === "published" ? new Date().toISOString() : null,
  };
  const { data: row, error } = await supabase
    .from("articles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return row;
};

export const adminDeleteArticle = async (data: { id: string }) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { isAdmin } = await assertStaff(user.id);
  if (!isAdmin) throw new Error("Forbidden: admin required to delete");

  const { error } = await supabase.from("articles").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return { ok: true };
};

export const adminListPredictions = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  await assertStaff(user.id);

  const { data, error } = await supabase
    .from("predictions")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
};

export const adminUpsertPrediction = async (data: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  await assertStaff(user.id);

  const { data: row, error } = await supabase
    .from("predictions")
    .upsert(data, { onConflict: "id" })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return row;
};

export const adminDeletePrediction = async (data: { id: string }) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  await assertStaff(user.id);

  const { error } = await supabase.from("predictions").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return { ok: true };
};

export const adminListSubscribers = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  await assertStaff(user.id);

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return data ?? [];
};

export const adminDashboardStats = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  await assertStaff(user.id);

  const [a, p, s, members] = await Promise.all([
    supabase.from("articles").select("status"),
    supabase.from("predictions").select("id", { count: "exact", head: true }),
    supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);

  if (a.error) throw new Error(a.error.message);
  if (p.error) throw new Error(p.error.message);
  if (s.error) throw new Error(s.error.message);
  if (members.error) throw new Error(members.error.message);

  const published = (a.data ?? []).filter((r: { status: string }) => r.status === "published").length;
  const drafts = (a.data ?? []).filter((r: { status: string }) => r.status === "draft").length;
  
  return {
    articlesPublished: published,
    articlesDrafts: drafts,
    predictions: p.count ?? 0,
    subscribers: s.count ?? 0,
    members: members.count ?? 0,
  };
};

export const getMyRoles = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r: { role: string }) => r.role);
};
