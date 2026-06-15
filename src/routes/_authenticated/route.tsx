import { createFileRoute, Outlet, redirect, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <header className="border-b-2 border-ink bg-ink text-paper">
        <div className="container-edit flex items-center justify-between py-3">
          <Link to="/" className="font-serif text-lg">The Political Gambler · <span className="text-signal">Admin</span></Link>
          <nav className="flex items-center gap-5 text-[11px] font-mono uppercase tracking-widest">
            <Link to="/admin" activeOptions={{ exact: true }} activeProps={{ className: "text-signal" }}>Dashboard</Link>
            <Link to="/admin/articles" activeProps={{ className: "text-signal" }}>Articles</Link>
            <Link to="/admin/predictions" activeProps={{ className: "text-signal" }}>Predictions</Link>
            <Link to="/admin/subscribers" activeProps={{ className: "text-signal" }}>Subscribers</Link>
            <button onClick={signOut} className="text-paper/70 hover:text-paper">Sign out</button>
          </nav>
        </div>
      </header>
      <main className="flex-1 container-edit py-8"><Outlet /></main>
    </div>
  );
}
