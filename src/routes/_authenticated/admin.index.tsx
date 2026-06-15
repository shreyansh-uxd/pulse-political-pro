import React from "react";
import { Link } from "react-router-dom";
import { adminDashboardStats, getMyRoles } from "@/lib/admin.functions";
import { useQuery } from "@/hooks/use-query";

function AdminHome() {
  const { data: roles, loading: rolesLoading } = useQuery(getMyRoles);
  const { data: stats, loading: statsLoading } = useQuery(adminDashboardStats);

  if (rolesLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground font-mono text-xs tracking-widest">LOADING...</p>
      </div>
    );
  }

  const rolesList = roles || [];
  const isStaff = rolesList.includes("admin") || rolesList.includes("editor");

  if (!isStaff) {
    return (
      <div className="max-w-xl border border-ink p-8 bg-card mx-auto mt-8">
        <div className="eyebrow text-signal">Member account</div>
        <h1 className="font-serif text-3xl mt-2">You're signed in.</h1>
        <p className="mt-3 text-muted-foreground">
          You're not currently a staff editor. Staff access (article + prediction editing) requires
          the <span className="font-mono">editor</span> or <span className="font-mono">admin</span> role.
          To grant yourself admin for the first time, run this in the database:
        </p>
        <pre className="mt-4 bg-ink text-paper text-xs p-4 overflow-x-auto font-mono">
{`INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'your@email.com';`}
        </pre>
        <Link to="/" className="mt-6 inline-block bg-ink text-paper px-5 py-3 text-xs font-mono uppercase tracking-widest">Back to site →</Link>
      </div>
    );
  }

  const s = stats;
  return (
    <div>
      <div className="eyebrow text-signal">Dashboard</div>
      <h1 className="font-serif text-4xl mt-2">Newsroom</h1>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          ["Articles published", s?.articlesPublished],
          ["Drafts", s?.articlesDrafts],
          ["Predictions", s?.predictions],
          ["Members", s?.members],
          ["Subscribers", s?.subscribers],
        ].map(([label, v]) => (
          <div key={label as string} className="border border-ink p-5 bg-card">
            <div className="eyebrow text-muted-foreground">{label}</div>
            <div className="font-serif text-4xl mt-1">{v ?? "—"}</div>
          </div>
        ))}
      </div>
      <div className="mt-10 grid md:grid-cols-3 gap-4">
        <Link to="/admin/articles" className="border border-ink p-6 hover:bg-ink hover:text-paper transition-colors">
          <div className="eyebrow text-signal">CMS</div>
          <div className="font-serif text-2xl mt-1">Manage articles →</div>
        </Link>
        <Link to="/admin/predictions" className="border border-ink p-6 hover:bg-ink hover:text-paper transition-colors">
          <div className="eyebrow text-signal">Markets</div>
          <div className="font-serif text-2xl mt-1">Edit predictions →</div>
        </Link>
        <Link to="/admin/subscribers" className="border border-ink p-6 hover:bg-ink hover:text-paper transition-colors">
          <div className="eyebrow text-signal">Audience</div>
          <div className="font-serif text-2xl mt-1">View subscribers →</div>
        </Link>
      </div>
    </div>
  );
}

export default AdminHome;
