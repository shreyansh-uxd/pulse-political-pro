import { getSubscribers, saveSubscribers } from "./mock-db";

export const subscribeToNewsletter = async (data: { email: string; source?: string }) => {
  const subscribers = getSubscribers();
  const emailLower = data.email.toLowerCase();
  
  if (!subscribers.some((s) => s.email === emailLower)) {
    subscribers.push({
      id: `sub_${Date.now()}`,
      email: emailLower,
      source: data.source ?? "site",
      created_at: new Date().toISOString(),
    });
    saveSubscribers(subscribers);
  }
  return { ok: true };
};

