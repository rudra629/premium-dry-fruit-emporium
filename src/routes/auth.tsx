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

      <div className="max-w-md mx-auto w-full rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8">
        <div className="flex gap-2 p-1 rounded-full bg-white/[0.05] mb-6">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${mode === m ? "bg-gold text-forest-deep" : "text-cream/70 hover:text-cream"}`}
            >
              {m === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <h1 className="font-display italic text-4xl text-cream">
          {mode === "signin" ? "Welcome back." : "Join the pantry."}
        </h1>
        <p className="text-cream/60 mt-1 text-sm">
          {mode === "signin" ? "Pick up where you left off." : "10% off your first order, always."}
        </p>

        {/* Social buttons */}
        <div className="mt-6 space-y-2.5">
          <button className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-cream text-forest-deep py-3.5 text-sm font-semibold hover:bg-white transition">
            <GoogleIcon /> Continue with Google
          </button>
          <div className="grid grid-cols-3 gap-2">
            <SocialBtn label="Facebook" icon={<FacebookIcon />} />
            <SocialBtn label="Instagram" icon={<InstagramIcon />} />
            <SocialBtn label="X (Twitter)" icon={<XIcon />} />
          </div>
        </div>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/15" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-cream/40">Or with email</span>
          <div className="flex-1 h-px bg-white/15" />
        </div>

        <form className="space-y-3">
          {mode === "signup" && <IconField icon={User} placeholder="Full name" />}
          <IconField icon={Mail} placeholder="Email address" type="email" />
          <IconField icon={Lock} placeholder="Password" type="password" />
          <button type="button" className="w-full rounded-full bg-gold text-forest-deep py-3.5 text-sm font-semibold hover:bg-cream transition">
            {mode === "signin" ? "Sign in" : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-cream/50">
          By continuing, you agree to our <Link to="/" className="underline hover:text-gold">Terms</Link> and <Link to="/" className="underline hover:text-gold">Privacy</Link>.
        </p>
      </div>
    </div>
  );
}

function SocialBtn({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button aria-label={label} className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] py-3 hover:bg-white/[0.10] hover:border-gold/40 transition text-cream">
      {icon}
    </button>
  );
}

function IconField({ icon: Icon, ...rest }: { icon: React.ComponentType<{ className?: string }> } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5">
      <Icon className="w-4 h-4 text-cream/50" />
      <input {...rest} className="flex-1 bg-transparent outline-none py-3.5 text-sm text-cream placeholder:text-cream/40" />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-4 h-4" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.2 0 6 .9 8.3 2.6l6.2-6.2C34.4 2.3 29.6 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.2 5.6C11.5 13.1 17.3 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.6c0-1.5-.1-2.9-.4-4.3H24v8.2h12.7c-.6 3-2.3 5.5-4.9 7.2l7.5 5.8c4.4-4 7.2-10 7.2-16.9z"/>
      <path fill="#FBBC05" d="M9.8 28.6c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7.2-5.6C1 16.8 0 20.3 0 24s1 7.2 2.6 10.4l7.2-5.8z"/>
      <path fill="#34A853" d="M24 48c6.5 0 12-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.7 0-12.5-3.6-14.6-9.4l-7.2 5.6C6.5 42.6 14.6 48 24 48z"/>
    </svg>
  );
}
function FacebookIcon() { return (<svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M13 22v-8h3l1-4h-4V7.5c0-1.2.4-2 2-2h2V2.1c-.4-.1-1.6-.2-3-.2-3 0-5 1.8-5 5.1V10H6v4h3v8h4z"/></svg>); }
function InstagramIcon() { return (<svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>); }
function XIcon() { return (<svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18 3h3l-7.5 8.6L22 21h-6.9l-4.7-6-5.4 6H2l8-9.1L2.4 3h7l4.3 5.5L18 3z"/></svg>); }
