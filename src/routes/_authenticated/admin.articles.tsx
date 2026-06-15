import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { adminListArticles, adminUpsertArticle, adminDeleteArticle } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/articles")({
  component: ArticlesAdmin,
});

type Article = any;

function ArticlesAdmin() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["admin", "articles"], queryFn: () => adminListArticles() });
  const [editing, setEditing] = useState<Partial<Article> | null>(null);

  const save = useMutation({
    mutationFn: (data: any) => adminUpsertArticle({ data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "articles"] });
      qc.invalidateQueries({ queryKey: ["articles"] });
      setEditing(null);
    },
  });
  const del = useMutation({
    mutationFn: (id: string) => adminDeleteArticle({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "articles"] });
      qc.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  if (editing) return <ArticleForm initial={editing} onCancel={() => setEditing(null)} onSave={(d) => save.mutate(d)} saving={save.isPending} error={save.error?.message} />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="eyebrow text-signal">CMS</div>
          <h1 className="font-serif text-4xl mt-1">Articles</h1>
        </div>
        <button onClick={() => setEditing({ status: "draft", category: "Analysis", is_premium: false, read_minutes: 5 })} className="bg-ink text-paper px-5 py-3 text-xs font-mono uppercase tracking-widest hover:bg-signal">New article</button>
      </div>

      <div className="mt-6 border border-ink">
        <table className="w-full text-sm">
          <thead className="bg-ink text-paper">
            <tr>
              <th className="text-left p-3 font-mono text-[11px] uppercase tracking-widest">Title</th>
              <th className="text-left p-3 font-mono text-[11px] uppercase tracking-widest">Status</th>
              <th className="text-left p-3 font-mono text-[11px] uppercase tracking-widest">Category</th>
              <th className="text-left p-3 font-mono text-[11px] uppercase tracking-widest">Updated</th>
              <th className="text-right p-3 font-mono text-[11px] uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(list.data ?? []).map((a: any) => (
              <tr key={a.id} className="border-t border-rule">
                <td className="p-3">
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground font-mono">/{a.slug}</div>
                </td>
                <td className="p-3">
                  <span className={`font-mono text-[11px] uppercase tracking-widest ${a.status === "published" ? "text-success" : "text-muted-foreground"}`}>{a.status}</span>
                  {a.is_premium && <span className="ml-2 font-mono text-[10px] uppercase border border-ink px-1.5 py-0.5">Insider</span>}
                </td>
                <td className="p-3 text-muted-foreground">{a.category}</td>
                <td className="p-3 text-xs text-muted-foreground font-mono">{new Date(a.updated_at).toLocaleDateString()}</td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => setEditing(a)} className="text-xs font-mono uppercase tracking-widest hover:text-signal">Edit</button>
                  <button onClick={() => { if (confirm(`Delete "${a.title}"?`)) del.mutate(a.id); }} className="text-xs font-mono uppercase tracking-widest hover:text-destructive">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ArticleForm({ initial, onCancel, onSave, saving, error }: { initial: any; onCancel: () => void; onSave: (d: any) => void; saving: boolean; error?: string }) {
  const [f, setF] = useState({
    id: initial.id,
    slug: initial.slug ?? "",
    title: initial.title ?? "",
    dek: initial.dek ?? "",
    body: initial.body ?? "",
    category: initial.category ?? "Analysis",
    hero_image_url: initial.hero_image_url ?? "",
    is_premium: !!initial.is_premium,
    status: initial.status ?? "draft",
    read_minutes: initial.read_minutes ?? 5,
    author_name: initial.author_name ?? "",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      ...f,
      dek: f.dek || null,
      body: f.body || null,
      hero_image_url: f.hero_image_url || null,
      author_name: f.author_name || null,
      read_minutes: Number(f.read_minutes),
    });
  }

  return (
    <form onSubmit={submit} className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">{initial.id ? "Edit article" : "New article"}</h1>
        <button type="button" onClick={onCancel} className="text-xs font-mono uppercase">Cancel</button>
      </div>
      <div className="mt-6 space-y-4">
        <Field label="Title"><input className="w-full border border-ink bg-paper px-3 py-2" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required /></Field>
        <Field label="Slug (lowercase, hyphens)"><input className="w-full border border-ink bg-paper px-3 py-2 font-mono text-sm" value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} required /></Field>
        <Field label="Dek (subtitle)"><textarea className="w-full border border-ink bg-paper px-3 py-2" rows={2} value={f.dek} onChange={(e) => setF({ ...f, dek: e.target.value })} /></Field>
        <Field label="Body (markdown / plain text, blank lines split paragraphs)"><textarea className="w-full border border-ink bg-paper px-3 py-2 font-serif" rows={14} value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} /></Field>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Category"><input className="w-full border border-ink bg-paper px-3 py-2" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} /></Field>
          <Field label="Author name"><input className="w-full border border-ink bg-paper px-3 py-2" value={f.author_name} onChange={(e) => setF({ ...f, author_name: e.target.value })} /></Field>
          <Field label="Read minutes"><input type="number" min={1} max={120} className="w-full border border-ink bg-paper px-3 py-2" value={f.read_minutes} onChange={(e) => setF({ ...f, read_minutes: Number(e.target.value) })} /></Field>
        </div>
        <Field label="Hero image URL"><input className="w-full border border-ink bg-paper px-3 py-2" value={f.hero_image_url} onChange={(e) => setF({ ...f, hero_image_url: e.target.value })} placeholder="https://..." /></Field>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.is_premium} onChange={(e) => setF({ ...f, is_premium: e.target.checked })} /> Insider only</label>
          <label className="flex items-center gap-2 text-sm">
            Status:
            <select className="border border-ink bg-paper px-2 py-1" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as "draft" | "published" })}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>
      </div>
      {error && <p className="mt-4 text-sm text-destructive font-mono">{error}</p>}
      <div className="mt-6 flex gap-3">
        <button disabled={saving} className="bg-ink text-paper px-6 py-3 text-xs font-mono uppercase tracking-widest hover:bg-signal disabled:opacity-50">
          {saving ? "Saving…" : initial.id ? "Save changes" : "Create article"}
        </button>
        <button type="button" onClick={onCancel} className="border border-ink px-6 py-3 text-xs font-mono uppercase tracking-widest">Cancel</button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><div className="eyebrow mb-1.5">{label}</div>{children}</label>;
}
