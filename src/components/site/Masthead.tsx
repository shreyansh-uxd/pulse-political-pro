import { Link } from "@tanstack/react-router";
import { useState } from "react";

const nav = [
  { to: "/", label: "Front Page" },
  { to: "/articles", label: "Analysis" },
  { to: "/predictions", label: "Predictions" },
  { to: "/newsletter", label: "Newsletter" },
  { to: "/membership", label: "Membership" },
  { to: "/about", label: "About" },
];

export function Masthead() {
  const [open, setOpen] = useState(false);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <header className="border-b border-rule bg-paper">
      <div className="container-edit flex items-center justify-between py-2 text-[11px] text-muted-foreground">
        <span className="font-mono uppercase tracking-widest">{today}</span>
        <span className="hidden md:inline font-mono uppercase tracking-widest">
          Vol. XII · No. 73 · Washington, DC
        </span>
        <Link to="/auth" className="font-mono uppercase tracking-widest hover:text-foreground">
          Sign in
        </Link>
      </div>

      <div className="rule" />

      <div className="container-edit py-6 md:py-8 text-center relative">
        <Link to="/" className="inline-block">
          <div className="eyebrow text-signal">Independent · Data-driven · Since 2014</div>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold mt-2 tracking-tight">
            The Political Gambler
          </h1>
          <div className="mt-3 text-sm italic text-muted-foreground">
            Numbers, narrative, and the edge in American politics.
          </div>
        </Link>
        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden absolute right-4 top-6 text-xs font-mono uppercase border border-ink px-3 py-1"
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div className="rule-thick" />

      <nav className={`${open ? "block" : "hidden"} md:block border-b border-rule`}>
        <div className="container-edit flex flex-col md:flex-row md:items-center md:justify-center gap-1 md:gap-8 py-3">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "text-signal" }}
              className="font-mono text-[11px] uppercase tracking-[0.18em] hover:text-signal transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
