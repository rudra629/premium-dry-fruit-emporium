import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import lifestyle from "@/assets/lifestyle-1.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Grams" }, { name: "description", content: "Sign in or create your Grams account." }] }),
  component: Auth,
});

function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  return (
    <div className="min-h-[80vh] container-x py-12 grid lg:grid-cols-2 gap-10 items-center">
      <div className="hidden lg:block relative rounded-3xl overflow-hidden">
        <img src={lifestyle} alt="" className="w-full aspect-[4/5] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 to-forest-deep/20" />
        <div className="absolute bottom-8 left-8 right-8 text-cream">
          <p className="text-xs tracking-[0.3em] uppercase text-gold">Welcome back</p>
          <h2 className="mt-3 font-display text-5xl leading-none">Snacks<br /><span className="italic">await.</span></h2>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full">
        <div className="flex gap-2 p-1 rounded-full bg-muted mb-6">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${mode === m ? "bg-forest-deep text-cream" : ""}`}
            >
              {m === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <h1 className="font-display text-4xl text-forest-deep">
          {mode === "signin" ? "Welcome back." : "Join the pantry."}
        </h1>
        <p className="text-muted-foreground mt-1">
          {mode === "signin" ? "Pick up where you left off." : "10% off your first order, always."}
        </p>

        <form className="mt-6 space-y-3">
          {mode === "signup" && <IconField icon={User} placeholder="Full name" />}
          <IconField icon={Mail} placeholder="Email address" type="email" />
          <IconField icon={Lock} placeholder="Password" type="password" />
          <button type="button" className="w-full rounded-full bg-forest-deep text-cream py-3.5 text-sm font-semibold hover:bg-forest transition">
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button className="rounded-full border border-border py-3 text-sm font-semibold hover:bg-muted">Google</button>
          <button className="rounded-full border border-border py-3 text-sm font-semibold hover:bg-muted">Apple</button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          By continuing, you agree to our <Link to="/" className="underline">Terms</Link> and <Link to="/" className="underline">Privacy</Link>.
        </p>
      </div>
    </div>
  );
}

function IconField({ icon: Icon, ...rest }: { icon: React.ComponentType<{ className?: string }> } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-background px-5">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <input {...rest} className="flex-1 bg-transparent outline-none py-3.5 text-sm" />
    </div>
  );
}
