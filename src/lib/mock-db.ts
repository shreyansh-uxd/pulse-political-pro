import { articles as initialArticles, predictions as initialPredictions } from "./mock-content";

// Define the schemas matching our types
export type MockArticle = {
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
  body: string | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};

export type MockPrediction = {
  id: string;
  market: string;
  contract: string;
  our_line: string;
  market_line: string;
  edge: number;
  confidence: "Low" | "Medium" | "High";
  is_locked: boolean;
  updated_at: string;
};

export type MockSubscriber = {
  id: string;
  email: string;
  source: string;
  created_at: string;
};

// Seed mapping
const seededArticles: MockArticle[] = initialArticles.map((art, idx) => ({
  id: `art_${idx + 1}`,
  slug: art.slug,
  title: art.title,
  dek: art.dek || null,
  category: art.category,
  hero_image_url: art.image || null,
  is_premium: art.premium ?? false,
  read_minutes: art.readMinutes ?? 5,
  author_name: art.author || "Staff",
  published_at: art.date ? new Date(art.date).toISOString() : new Date().toISOString(),
  body: art.body ? art.body.join("\n\n") : "This is a detailed analysis of the political situation.",
  status: "published",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

const seededPredictions: MockPrediction[] = initialPredictions.map((pred) => ({
  id: pred.id,
  market: pred.market,
  contract: pred.contract,
  our_line: pred.ourLine,
  market_line: pred.marketLine,
  edge: pred.edge,
  confidence: pred.confidence,
  is_locked: pred.locked ?? false,
  updated_at: new Date().toISOString(),
}));

const seededSubscribers: MockSubscriber[] = [
  { id: "sub_1", email: "editor@example.com", source: "site", created_at: new Date().toISOString() },
  { id: "sub_2", email: "reader@gmail.com", source: "newsletter", created_at: new Date().toISOString() },
  { id: "sub_3", email: "vip-member@domain.com", source: "membership", created_at: new Date().toISOString() },
];

function initializeDb() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem("pulse_db_seeded")) {
    localStorage.setItem("pulse_articles", JSON.stringify(seededArticles));
    localStorage.setItem("pulse_predictions", JSON.stringify(seededPredictions));
    localStorage.setItem("pulse_subscribers", JSON.stringify(seededSubscribers));
    localStorage.setItem("pulse_db_seeded", "true");
  }
}

export function getArticles(): MockArticle[] {
  initializeDb();
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("pulse_articles") || "[]");
}

export function saveArticles(articles: MockArticle[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("pulse_articles", JSON.stringify(articles));
}

export function getPredictions(): MockPrediction[] {
  initializeDb();
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("pulse_predictions") || "[]");
}

export function savePredictions(predictions: MockPrediction[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("pulse_predictions", JSON.stringify(predictions));
}

export function getSubscribers(): MockSubscriber[] {
  initializeDb();
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("pulse_subscribers") || "[]");
}

export function saveSubscribers(subscribers: MockSubscriber[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("pulse_subscribers", JSON.stringify(subscribers));
}

// Auth mock helpers
export function getMockSession() {
  if (typeof window === "undefined") return null;
  const sessionStr = localStorage.getItem("pulse_session");
  if (!sessionStr) return null;
  try {
    return JSON.parse(sessionStr);
  } catch {
    return null;
  }
}

export function setMockSession(email: string) {
  if (typeof window === "undefined") return null;
  const session = {
    access_token: "mock-token",
    token_type: "bearer",
    expires_in: 3600,
    refresh_token: "mock-refresh",
    user: {
      id: "mock-user-id",
      email: email,
      role: "authenticated",
      user_metadata: {
        full_name: email.split("@")[0],
      },
    },
  };
  localStorage.setItem("pulse_session", JSON.stringify(session));
  return session;
}

export function clearMockSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("pulse_session");
}
