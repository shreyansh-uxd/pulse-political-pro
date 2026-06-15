import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { subscribeToNewsletter } from "@/lib/newsletter.functions";

export function NewsletterCTA({ compact = false, source = "site" }: { compact?: boolean; source?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);
  const subscribe = useServerFn(subscribeToNewsletter);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErr(null);
    try {
      await subscribe({ data: { email, source } });
      setStatus("done");
      setEmail("");
    } catch (e) {
      setStatus("error");
      setErr(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  return (
    <section className={`border border-ink ${compact ? "p-6" : "p-8 md:p-12"} bg-card relative`}>
      <div className="eyebrow text-signal">The Sunday Brief</div>
      <h3 className="font-serif text-2xl md:text-3xl mt-2 max-w-xl">
        One email a week. The numbers that matter, and the ones the cable hits ignored.
      </h3>
      <p className="mt-3 text-sm text-muted-foreground max-w-lg">
        Free. No churn-bait. Unsubscribe any time. Cross-posted from our Substack.
      </p>
      <form onSubmit={onSubmit} className="mt-5 flex flex-col sm:flex-row gap-2 max-w-lg">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@domain.com"
          disabled={status === "loading" || status === "done"}
          className="flex-1 border border-ink bg-paper px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-signal disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "done"}
          className="bg-ink text-paper px-5 py-3 text-xs font-mono uppercase tracking-widest hover:bg-signal transition-colors disabled:opacity-60"
        >
          {status === "loading" ? "…" : status === "done" ? "Subscribed ✓" : "Subscribe"}
        </button>
      </form>
      {err && <p className="mt-3 text-xs text-destructive font-mono">{err}</p>}
    </section>
  );
}
