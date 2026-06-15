import React from "react";
import { Link, NavLink } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <header className="border-b-2 border-ink bg-ink text-paper">
        <div className="container-edit flex items-center justify-between py-3">
          <Link to="/" className="font-serif text-lg">The Political Gambler · <span className="text-signal">Admin</span></Link>
          <nav className="flex items-center gap-5 text-[11px] font-mono uppercase tracking-widest">
            <NavLink to="/admin" end className={({ isActive }) => isActive ? "text-signal" : "text-paper/70 hover:text-paper"}>Dashboard</NavLink>
            <NavLink to="/admin/articles" className={({ isActive }) => isActive ? "text-signal" : "text-paper/70 hover:text-paper"}>Articles</NavLink>
            <NavLink to="/admin/predictions" className={({ isActive }) => isActive ? "text-signal" : "text-paper/70 hover:text-paper"}>Predictions</NavLink>
            <NavLink to="/admin/subscribers" className={({ isActive }) => isActive ? "text-signal" : "text-paper/70 hover:text-paper"}>Subscribers</NavLink>
            <button onClick={signOut} className="text-paper/70 hover:text-paper">Sign out</button>
          </nav>
        </div>
      </header>
      <main className="flex-1 container-edit py-8">{children}</main>
    </div>
  );
}
