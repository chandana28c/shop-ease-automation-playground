import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

interface LoginSearch { redirect?: string }

export const Route = createFileRoute("/login")({
  component: LoginPage,
  validateSearch: (s: Record<string, unknown>): LoginSearch => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  head: () => ({ meta: [{ title: "Sign in — ShopEase" }] }),
});

function LoginPage() {
  const { login } = useApp();
  const router = useRouter();
  const { redirect } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Prefill remembered credentials saved at registration / previous login.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("shopease_remember");
      if (raw) {
        const saved = JSON.parse(raw) as { email?: string; password?: string };
        if (saved.email) setEmail(saved.email);
        if (saved.password) setPassword(saved.password);
      }
    } catch { /* ignore */ }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      try {
        if (remember) {
          localStorage.setItem(
            "shopease_remember",
            JSON.stringify({ email, password }),
          );
        } else {
          localStorage.removeItem("shopease_remember");
        }
      } catch { /* ignore */ }
      toast.success("Welcome back!");
      router.navigate({ to: redirect ?? "/" });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="mx-auto flex max-w-md flex-col px-4 py-16 animate-fade-in"
      data-testid="login-page"
    >
      <h1 className="text-3xl font-bold">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Sign in to your ShopEase account.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="login-email-input"
            autoComplete="email"
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="login-password-input"
            autoComplete="current-password"
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
        </div>
        {error && (
          <p data-testid="login-error" className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-sm text-destructive">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          data-testid="login-submit-btn"
          className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to ShopEase?{" "}
        <Link to="/register" data-testid="register-link" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
