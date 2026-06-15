import {
  getArticles,
  saveArticles,
  getPredictions,
  savePredictions,
  getSubscribers,
  getMockSession,
  MockArticle,
  MockPrediction,
} from "./mock-db";

export const adminListArticles = async () => {
  const session = getMockSession();
  if (!session) throw new Error("Unauthorized");
  return getArticles();
};

export const adminUpsertArticle = async (data: any) => {
  const session = getMockSession();
  if (!session) throw new Error("Unauthorized");

  const articles = getArticles();
  const id = data.id || `art_${Date.now()}`;
  const now = new Date().toISOString();

  const existingIdx = articles.findIndex((a) => a.id === id);
  const existing = existingIdx > -1 ? articles[existingIdx] : null;

  const payload: MockArticle = {
    id,
    slug: data.slug || "new-article-" + Date.now(),
    title: data.title || "Untitled Article",
    dek: data.dek || null,
    category: data.category || "Analysis",
    hero_image_url: data.hero_image_url || null,
    is_premium: data.is_premium ?? false,
    read_minutes: Number(data.read_minutes) || 5,
    author_name: session.user.email.split("@")[0] || "Staff",
    published_at: data.status === "published" ? (existing?.published_at || now) : null,
    body: data.body || "",
    status: data.status || "draft",
    created_at: existing?.created_at || now,
    updated_at: now,
  };

  if (existingIdx > -1) {
    articles[existingIdx] = payload;
  } else {
    articles.unshift(payload);
  }

  saveArticles(articles);
  return payload;
};

export const adminDeleteArticle = async (data: { id: string }) => {
  const session = getMockSession();
  if (!session) throw new Error("Unauthorized");

  const articles = getArticles();
  const filtered = articles.filter((a) => a.id !== data.id);
  saveArticles(filtered);
  return { ok: true };
};

export const adminListPredictions = async () => {
  const session = getMockSession();
  if (!session) throw new Error("Unauthorized");
  return getPredictions();
};

export const adminUpsertPrediction = async (data: any) => {
  const session = getMockSession();
  if (!session) throw new Error("Unauthorized");

  const predictions = getPredictions();
  const id = data.id || `pred_${Date.now()}`;

  const existingIdx = predictions.findIndex((p) => p.id === id);
  const now = new Date().toISOString();

  const payload: MockPrediction = {
    id,
    market: data.market || "General Market",
    contract: data.contract || "Contract",
    our_line: data.our_line || "50%",
    market_line: data.market_line || "50%",
    edge: Number(data.edge) || 0,
    confidence: data.confidence || "Medium",
    is_locked: data.is_locked ?? false,
    updated_at: now,
  };

  if (existingIdx > -1) {
    predictions[existingIdx] = payload;
  } else {
    predictions.unshift(payload);
  }

  savePredictions(predictions);
  return payload;
};

export const adminDeletePrediction = async (data: { id: string }) => {
  const session = getMockSession();
  if (!session) throw new Error("Unauthorized");

  const predictions = getPredictions();
  const filtered = predictions.filter((p) => p.id !== data.id);
  savePredictions(filtered);
  return { ok: true };
};

export const adminListSubscribers = async () => {
  const session = getMockSession();
  if (!session) throw new Error("Unauthorized");
  return getSubscribers();
};

export const adminDashboardStats = async () => {
  const session = getMockSession();
  if (!session) throw new Error("Unauthorized");

  const articles = getArticles();
  const predictions = getPredictions();
  const subscribers = getSubscribers();

  const published = articles.filter((a) => a.status === "published").length;
  const drafts = articles.filter((a) => a.status === "draft").length;

  return {
    articlesPublished: published,
    articlesDrafts: drafts,
    predictions: predictions.length,
    subscribers: subscribers.length,
    members: Math.max(5, Math.floor(subscribers.length * 0.4)),
  };
};

export const getMyRoles = async () => {
  const session = getMockSession();
  if (!session) return [];
  // For mock mode, any logged-in user is an administrator
  return ["admin"];
};
