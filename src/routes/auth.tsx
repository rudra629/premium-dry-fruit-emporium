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

        {/* Social logins */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            className="group w-full flex items-center justify-center gap-3 rounded-full border border-border bg-card py-3.5 text-sm font-semibold hover:bg-muted transition"
          >
            <GoogleIcon className="w-5 h-5" />
            Continue with Google
          </button>
          <button
            type="button"
            className="group w-full flex items-center justify-center gap-3 rounded-full bg-[#1877F2] text-white py-3.5 text-sm font-semibold hover:brightness-110 transition"
          >
            <FacebookIcon className="w-5 h-5" />
            Continue with Facebook
          </button>
        </div>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">OR CONTINUE WITH EMAIL</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          {mode === "signup" && <IconField icon={User} placeholder="Full name" />}
          <IconField icon={Mail} placeholder="Email address" type="email" />
          <IconField icon={Lock} placeholder="Password" type="password" />
          <button type="submit" className="w-full rounded-full bg-forest-deep text-cream py-3.5 text-sm font-semibold hover:bg-forest transition">
            {mode === "signin" ? "Sign in with email" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          By continuing, you agree to our <Link to="/" className="underline">Terms</Link> and <Link to="/" className="underline">Privacy</Link>.
        </p>
      </div>
    </div>
  );
}

function IconField({ icon: Icon, ...rest }: { icon: React.ComponentType<{ className?: string }> } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-background px-5 focus-within:border-forest-deep transition">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <input {...rest} className="flex-1 bg-transparent outline-none py-3.5 text-sm" />
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.86c2.26-2.09 3.58-5.17 3.58-8.85z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.07.72-2.44 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.11A11.99 11.99 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.6H1.29a12 12 0 0 0 0 10.8l3.98-3.11z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.18 15.23 0 12 0A11.99 11.99 0 0 0 1.29 6.6l3.98 3.11C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.24 10.44 22v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06z" />
    </svg>
  );
}

