import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-24 border-t-4 border-double border-ink bg-paper">
      <div className="container-edit py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif text-2xl">The Political Gambler</div>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            Independent political analysis with a focus on numbers, base rates, and where the
            market is mispricing the story.
          </p>
        </div>
        <div>
          <div className="eyebrow mb-3">Sections</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/articles">Analysis</Link></li>
            <li><Link to="/predictions">Predictions</Link></li>
            <li><Link to="/newsletter">Newsletter</Link></li>
            <li><Link to="/membership">Membership</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-3">House</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about">About</Link></li>
            <li><a href="#">Methodology</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Terms & Privacy</a></li>
          </ul>
        </div>
      </div>
      <div className="rule" />
      <div className="container-edit py-5 flex flex-col md:flex-row justify-between text-xs text-muted-foreground gap-2 font-mono uppercase tracking-widest">
        <span>© {new Date().getFullYear()} The Political Gambler</span>
        <span>Built for readers who do the math.</span>
      </div>
    </footer>
  );
}
