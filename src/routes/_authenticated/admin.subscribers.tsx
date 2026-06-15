import React from "react";
import { adminListSubscribers } from "@/lib/admin.functions";
import { useQuery } from "@/hooks/use-query";

function Subscribers() {
  const { data: listData, loading, error } = useQuery(adminListSubscribers);
  const rows = (listData ?? []) as any[];

  function exportCsv() {
    const csv = ["email,source,created_at", ...rows.map((r) => `${r.email},${r.source ?? ""},${r.created_at}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "subscribers.csv";
    a.click();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground font-mono text-xs tracking-widest">LOADING...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div><div className="eyebrow text-signal">Audience</div><h1 className="font-serif text-4xl mt-1">Newsletter subscribers</h1></div>
        <button onClick={exportCsv} className="bg-ink text-paper px-5 py-3 text-xs font-mono uppercase tracking-widest hover:bg-signal">Export CSV</button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{rows.length} subscribers</p>
      <div className="mt-6 border border-ink">
        <table className="w-full text-sm">
          <thead className="bg-ink text-paper">
            <tr>
              <th className="text-left p-3 font-mono text-[11px] uppercase">Email</th>
              <th className="text-left p-3 font-mono text-[11px] uppercase">Source</th>
              <th className="text-left p-3 font-mono text-[11px] uppercase">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-rule">
                <td className="p-3 font-mono text-xs">{r.email}</td>
                <td className="p-3 text-muted-foreground">{r.source ?? "—"}</td>
                <td className="p-3 text-xs text-muted-foreground font-mono">{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Subscribers;
