import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { adminListPredictions, adminUpsertPrediction, adminDeletePrediction } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/predictions")({
  component: PredictionsAdmin,
});

function PredictionsAdmin() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["admin", "predictions"], queryFn: () => adminListPredictions() });
  const [editing, setEditing] = useState<any | null>(null);
  const save = useMutation({
    mutationFn: (d: any) => adminUpsertPrediction({ data: d }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "predictions"] }); qc.invalidateQueries({ queryKey: ["predictions"] }); setEditing(null); },
  });
  const del = useMutation({
    mutationFn: (id: string) => adminDeletePrediction({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "predictions"] }); qc.invalidateQueries({ queryKey: ["predictions"] }); },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div><div className="eyebrow text-signal">Markets</div><h1 className="font-serif text-4xl mt-1">Predictions</h1></div>
        <button onClick={() => setEditing({ confidence: "Medium", edge: 0, is_locked: false })} className="bg-ink text-paper px-5 py-3 text-xs font-mono uppercase tracking-widest hover:bg-signal">New prediction</button>
      </div>

      {editing && (
        <PredictionForm initial={editing} onCancel={() => setEditing(null)} onSave={(d) => save.mutate(d)} saving={save.isPending} error={save.error?.message} />
      )}

      <div className="mt-6 border border-ink">
        <table className="w-full text-sm">
          <thead className="bg-ink text-paper">
            <tr>
              <th className="text-left p-3 font-mono text-[11px] uppercase">Market</th>
              <th className="text-left p-3 font-mono text-[11px] uppercase">Contract</th>
              <th className="text-right p-3 font-mono text-[11px] uppercase">Our</th>
              <th className="text-right p-3 font-mono text-[11px] uppercase">Market</th>
              <th className="text-right p-3 font-mono text-[11px] uppercase">Edge</th>
              <th className="text-left p-3 font-mono text-[11px] uppercase">Conf.</th>
              <th className="text-left p-3 font-mono text-[11px] uppercase">Locked</th>
              <th className="text-right p-3 font-mono text-[11px] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(list.data ?? []).map((p: any) => (
              <tr key={p.id} className="border-t border-rule">
                <td className="p-3 font-medium">{p.market}</td>
                <td className="p-3 text-muted-foreground">{p.contract}</td>
                <td className="p-3 text-right font-mono">{p.our_line}</td>
                <td className="p-3 text-right font-mono">{p.market_line}</td>
                <td className="p-3 text-right font-mono">{Number(p.edge).toFixed(1)}</td>
                <td className="p-3">{p.confidence}</td>
                <td className="p-3">{p.is_locked ? "🔒" : "—"}</td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => setEditing(p)} className="text-xs font-mono uppercase hover:text-signal">Edit</button>
                  <button onClick={() => { if (confirm(`Delete ${p.market}?`)) del.mutate(p.id); }} className="text-xs font-mono uppercase hover:text-destructive">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PredictionForm({ initial, onCancel, onSave, saving, error }: any) {
  const [f, setF] = useState({
    id: initial.id,
    market: initial.market ?? "",
    contract: initial.contract ?? "",
    our_line: initial.our_line ?? "",
    market_line: initial.market_line ?? "",
    edge: initial.edge ?? 0,
    confidence: initial.confidence ?? "Medium",
    is_locked: !!initial.is_locked,
    notes: initial.notes ?? "",
  });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ ...f, edge: Number(f.edge), notes: f.notes || null });
  }
  return (
    <form onSubmit={submit} className="mt-6 border border-ink p-6 bg-card">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Market"><input className="w-full border border-ink bg-paper px-3 py-2" value={f.market} onChange={(e) => setF({ ...f, market: e.target.value })} required /></Field>
        <Field label="Contract"><input className="w-full border border-ink bg-paper px-3 py-2" value={f.contract} onChange={(e) => setF({ ...f, contract: e.target.value })} required /></Field>
        <Field label="Our line"><input className="w-full border border-ink bg-paper px-3 py-2 font-mono" value={f.our_line} onChange={(e) => setF({ ...f, our_line: e.target.value })} required /></Field>
        <Field label="Market line"><input className="w-full border border-ink bg-paper px-3 py-2 font-mono" value={f.market_line} onChange={(e) => setF({ ...f, market_line: e.target.value })} required /></Field>
        <Field label="Edge (%)"><input type="number" step="0.1" className="w-full border border-ink bg-paper px-3 py-2 font-mono" value={f.edge} onChange={(e) => setF({ ...f, edge: Number(e.target.value) })} required /></Field>
        <Field label="Confidence">
          <select className="w-full border border-ink bg-paper px-3 py-2" value={f.confidence} onChange={(e) => setF({ ...f, confidence: e.target.value })}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
        </Field>
      </div>
      <label className="flex items-center gap-2 mt-4 text-sm"><input type="checkbox" checked={f.is_locked} onChange={(e) => setF({ ...f, is_locked: e.target.checked })} /> Locked (Insider only)</label>
      <Field label="Notes (admin only)" ><textarea className="w-full border border-ink bg-paper px-3 py-2 mt-4" rows={3} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></Field>
      {error && <p className="mt-3 text-sm text-destructive font-mono">{error}</p>}
      <div className="mt-4 flex gap-3">
        <button disabled={saving} className="bg-ink text-paper px-5 py-3 text-xs font-mono uppercase tracking-widest hover:bg-signal disabled:opacity-50">{saving ? "Saving…" : "Save"}</button>
        <button type="button" onClick={onCancel} className="border border-ink px-5 py-3 text-xs font-mono uppercase tracking-widest">Cancel</button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><div className="eyebrow mb-1.5">{label}</div>{children}</label>;
}
