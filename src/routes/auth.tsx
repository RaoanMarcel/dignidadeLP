import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integration/supabase/client";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-screen gradient-sky-soft flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-card border border-border shadow-soft p-8">
        <Link to="/" className="inline-flex items-center gap-2 text-ocean font-display text-lg">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full gradient-ocean text-primary-foreground">
            <Heart className="h-4 w-4" fill="currentColor" />
          </span>
          Projeto Dignidade
        </Link>
        <h1 className="mt-6 text-2xl text-ocean">Área do administrador</h1>
        <p className="mt-1 text-sm text-muted-foreground">Acesso restrito para publicar atualizações.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full gradient-ocean px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}