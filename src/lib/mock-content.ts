import hero from "@/assets/hero-capitol.jpg";
import a1 from "@/assets/article-1.jpg";
import a2 from "@/assets/article-2.jpg";
import a3 from "@/assets/article-3.jpg";
import a4 from "@/assets/article-4.jpg";

export const HERO_IMAGE = hero;

export type Article = {
  slug: string;
  title: string;
  dek: string;
  category: string;
  author: string;
  date: string;
  readMinutes: number;
  image: string;
  premium?: boolean;
  body?: string[];
};

export const articles: Article[] = [
  {
    slug: "the-2026-midterm-spread-narrows",
    title: "The 2026 Midterm Spread Narrows as Suburban Voters Shift",
    dek: "Internal polling from three swing-state operations shows a four-point compression since September. Here's what's actually moving — and what isn't.",
    category: "Analysis",
    author: "Marcus Hale",
    date: "Mar 14, 2026",
    readMinutes: 9,
    image: a1,
    premium: true,
    body: [
      "For most of the last cycle, the conventional wisdom held that suburban districts in the upper Midwest would harden along the lines established in 2024. New tracking from operatives in three states — none of whom would speak on the record — tells a more interesting story.",
      "The compression isn't ideological. It's structural. Turnout models built on 2022 mid-cycle assumptions are returning probabilities that consistently overstate the incumbent advantage by 2 to 3 points in counties with significant population churn.",
      "What that means, in market terms, is that the implied odds being offered on several House races are mispriced. Not by much — but enough to matter if you're sizing positions against the consensus.",
    ],
  },
  {
    slug: "what-the-iowa-numbers-are-actually-saying",
    title: "What the Iowa Numbers Are Actually Saying",
    dek: "A close read of the early-state crosstabs that everyone is misreading.",
    category: "Polling",
    author: "Sasha Greene",
    date: "Mar 12, 2026",
    readMinutes: 6,
    image: a2,
    body: [
      "Three polls dropped this week. The headlines were wrong on all three.",
      "Here's the part nobody is talking about: the share of undecideds in the 50-64 demographic is the highest it has been at this point in any cycle since 2008.",
    ],
  },
  {
    slug: "senate-floor-arithmetic",
    title: "Senate Floor Arithmetic: The Vote That Isn't Where You Think",
    dek: "The procedural map for the appropriations fight, drawn out one whip count at a time.",
    category: "Capitol",
    author: "Marcus Hale",
    date: "Mar 10, 2026",
    readMinutes: 11,
    image: a3,
    premium: true,
  },
  {
    slug: "ballot-design-and-base-rates",
    title: "Ballot Design and Base Rates: A Quiet Edge",
    dek: "Why ballot order, county-level rollout, and the boring stuff matter more than the cable hits.",
    category: "Methodology",
    author: "R. Okonkwo",
    date: "Mar 08, 2026",
    readMinutes: 7,
    image: a4,
  },
];

export type Prediction = {
  id: string;
  market: string;
  contract: string;
  ourLine: string;
  marketLine: string;
  edge: number; // percent
  confidence: "High" | "Medium" | "Low";
  updated: string;
  locked?: boolean;
};

export const predictions: Prediction[] = [
  { id: "p1", market: "2026 Senate Control", contract: "Dem majority", ourLine: "42%", marketLine: "37%", edge: 5.0, confidence: "Medium", updated: "2h ago" },
  { id: "p2", market: "PA-Sen General", contract: "GOP win", ourLine: "54%", marketLine: "49%", edge: 5.1, confidence: "High", updated: "4h ago" },
  { id: "p3", market: "2028 GOP Nominee", contract: "Field vs frontrunner", ourLine: "61%", marketLine: "55%", edge: 6.2, confidence: "Medium", updated: "1d ago", locked: true },
  { id: "p4", market: "OH-Gov", contract: "Incumbent re-elect", ourLine: "71%", marketLine: "68%", edge: 3.0, confidence: "Low", updated: "1d ago" },
  { id: "p5", market: "House Generic Ballot", contract: "GOP +1 or better", ourLine: "48%", marketLine: "44%", edge: 4.1, confidence: "Medium", updated: "3h ago", locked: true },
];

export const ticker = [
  "PA-SEN  GOP 54¢  ▲ 1.2",
  "2026 SENATE CTRL  DEM 37¢  ▼ 0.8",
  "OH-GOV  INC 68¢  ▲ 0.3",
  "GENERIC BALLOT  GOP+1 44¢  ▲ 0.6",
  "2028 GOP NOM  FIELD 55¢  ▼ 0.4",
  "MI-SEN  DEM 51¢  ▲ 0.9",
  "AZ-SEN  GOP 47¢  ▼ 0.2",
];

export const plans = [
  {
    name: "Reader",
    price: 0,
    cadence: "free",
    tagline: "The daily column and weekly newsletter.",
    features: ["Daily analysis column", "Weekly newsletter", "Public predictions board", "Comment access"],
    cta: "Create account",
  },
  {
    name: "Insider",
    price: 14,
    cadence: "/ month",
    tagline: "Full archive, model outputs, and the Sunday brief.",
    features: ["Everything in Reader", "Full prediction model with edge", "Premium long-reads", "Sunday strategy brief", "Member-only Q&A threads"],
    cta: "Start 7-day trial",
    featured: true,
  },
  {
    name: "Operator",
    price: 49,
    cadence: "/ month",
    tagline: "For pros: data exports, API, and Substack cross-post.",
    features: ["Everything in Insider", "CSV / API data exports", "Custom alert workflows", "Substack cross-post embed", "Priority email"],
    cta: "Get Operator",
  },
];
