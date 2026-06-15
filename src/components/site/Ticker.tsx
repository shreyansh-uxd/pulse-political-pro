import { ticker } from "@/lib/mock-content";

export function Ticker() {
  const row = [...ticker, ...ticker];
  return (
    <div className="bg-ink text-paper overflow-hidden border-y border-ink">
      <div className="flex whitespace-nowrap ticker py-2">
        {row.map((t, i) => (
          <span key={i} className="font-mono text-[11px] tracking-wider px-6 uppercase">
            <span className="text-signal mr-2">●</span>{t}
          </span>
        ))}
      </div>
    </div>
  );
}
