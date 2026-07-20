import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, User, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin-login")({
  head: () => ({ meta: [{ title: "Admin Login — Grams" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !password) { toast.error("Enter your admin ID and password"); return; }
    setLoading(true);
    // Dummy — no real auth
    setTimeout(() => {
      try { sessionStorage.setItem("grams:admin", "1"); } catch { /* ignore */ }
      toast.success("Welcome back, admin");
      navigate({ to: "/admin" });
    }, 600);
  };

  return (
    <div className="relative min-h-[92vh] overflow-hidden bg-forest-deep text-cream flex items-center justify-center px-4 py-16">
      {/* Ambient glow */}
      <div className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full bg-gold/25 blur-3xl" />
      <div className="absolute -bottom-40 -right-32 w-[520px] h-[520px] rounded-full bg-terracotta/20 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle, #E9D9B0 1px, transparent 1.2px)", backgroundSize: "22px 22px" }} />

      <div className="relative w-full max-w-md">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-cream/10 border border-cream/15 px-4 py-1.5 text-[10px] tracking-[0.3em] uppercase text-gold">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure area
          </div>
          <h1 className="mt-5 font-display text-5xl md:text-6xl leading-none">
            Command<br /><span className="italic text-gold">Center.</span>
          </h1>
          <p className="mt-3 text-cream/70 text-sm">Authorised personnel only. Sign in with your Grams admin credentials.</p>
        </div>

        <form onSubmit={submit} className="mt-8 rounded-3xl bg-cream/[0.06] border border-cream/15 backdrop-blur-xl p-6 md:p-8 space-y-4 shadow-2xl">
          <label className="block">
            <span className="text-[10px] tracking-[0.3em] uppercase text-cream/60">Admin ID</span>
            <div className="mt-2 flex items-center gap-2 rounded-full bg-cream/10 border border-cream/15 px-5 focus-within:border-gold transition">
              <User className="w-4 h-4 text-gold" />
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="admin@grams"
                className="flex-1 bg-transparent outline-none py-3.5 text-sm placeholder:text-cream/40"
                autoComplete="username"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-[10px] tracking-[0.3em] uppercase text-cream/60">Password</span>
            <div className="mt-2 flex items-center gap-2 rounded-full bg-cream/10 border border-cream/15 px-5 focus-within:border-gold transition">
              <Lock className="w-4 h-4 text-gold" />
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 bg-transparent outline-none py-3.5 text-sm placeholder:text-cream/40"
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShow((s) => !s)} className="text-cream/60 hover:text-gold transition" aria-label="Toggle password">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </label>

          <div className="flex items-center justify-between text-xs text-cream/70">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-gold" /> Remember this device
            </label>
            <button type="button" className="hover:text-gold transition">Forgot password?</button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-full bg-gold text-forest-deep py-3.5 text-sm font-bold tracking-wide hover:bg-cream transition disabled:opacity-70"
          >
            <span className="relative z-10">{loading ? "Verifying…" : "Enter dashboard"}</span>
          </button>

          <p className="text-center text-[11px] text-cream/50 pt-1">
            Protected by Grams Sentinel · All sessions are logged
          </p>
        </form>
      </div>
    </div>
  );
}
