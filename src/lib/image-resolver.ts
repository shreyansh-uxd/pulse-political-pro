import a1 from "@/assets/article-1.jpg";
import a2 from "@/assets/article-2.jpg";
import a3 from "@/assets/article-3.jpg";
import a4 from "@/assets/article-4.jpg";
import hero from "@/assets/hero-capitol.jpg";

const FALLBACKS = [a1, a2, a3, a4, hero];

/** Resolve a hero image. Maps known seed paths and stray /src/assets/* paths to the bundled asset. */
export function resolveHeroImage(url: string | null | undefined, key?: string): string {
  if (url && /^https?:\/\//i.test(url)) return url;
  if (url?.includes("article-1")) return a1;
  if (url?.includes("article-2")) return a2;
  if (url?.includes("article-3")) return a3;
  if (url?.includes("article-4")) return a4;
  if (url?.includes("hero-capitol")) return hero;
  // deterministic fallback by key
  if (key) {
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
    return FALLBACKS[Math.abs(h) % FALLBACKS.length];
  }
  return a1;
}

export { hero as defaultHero };
