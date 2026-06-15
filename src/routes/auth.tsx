import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Masthead } from "@/components/site/Masthead";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";

function Auth() {
  useEffect(() => {
    document.title = "Sign in — The Political Gambler";
  }, []);

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/");
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate("/");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setLoading(true);
    setErr(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      navigate("/");
    } catch (e: any) {
      setErr(e.message || "Google sign-in failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Masthead />
      <main className="container-edit py-16 flex-1 max-w-md">
        <div className="border border-ink p-8 bg-card">
          <div className="eyebrow text-signal">{mode === "signin" ? "Welcome back" : "Create account"}</div>
          <h1 className="font-serif text-3xl mt-2">{mode === "signin" ? "Sign in" : "Join"}</h1>

          <button
            onClick={onGoogle}
            disabled={loading}
            className="mt-6 w-full border border-ink py-3 text-xs font-mono uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors disabled:opacity-50"
          >
            Continue with Google
          </button>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 rule" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">or</span>
            <div className="flex-1 rule" />
          </div>

          <form className="mt-5 space-y-3" onSubmit={onSubmit}>
            {mode === "signup" && (
              <input className="w-full border border-ink bg-paper px-4 py-3 text-sm" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            )}
            <input className="w-full border border-ink bg-paper px-4 py-3 text-sm" placeholder="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="w-full border border-ink bg-paper px-4 py-3 text-sm" placeholder="Password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            <button disabled={loading} className="w-full bg-ink text-paper py-3 text-xs font-mono uppercase tracking-widest hover:bg-signal transition-colors disabled:opacity-50">
              {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          {err && <p className="mt-3 text-xs text-destructive font-mono">{err}</p>}

          <div className="mt-5 text-sm text-center text-muted-foreground">
            {mode === "signin" ? "New here?" : "Already a member?"}{" "}
            <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(null); }} className="underline text-foreground">
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </div>
          <div className="mt-3 text-xs text-muted-foreground text-center">
            <Link to="/" className="underline">Back home</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Auth;
