import { createFileRoute } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/chips")({
  head: () => ({
    meta: [
      { title: "CRNCH// — Coming Soon" },
      { name: "description", content: "The chips lab is still cooking. Drop your email to be first in the crunch." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ChipsComingSoon,
});

const LIME = "#c4ff3d";

function ChipsComingSoon() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="relative min-h-[100vh] bg-[#0a0a0a] text-white overflow-hidden font-sans">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div
          className="absolute -top-60 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full blur-3xl opacity-[0.08]"
          style={{ background: `radial-gradient(circle, ${LIME} 0%, transparent 60%)` }}
        />
      </div>

      {/* Chips-brand mini header */}
      <header className="relative">
        <div className="container-x flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-2 font-display text-xl md:text-2xl font-bold tracking-tight">
            <span
              className="grid place-items-center w-8 h-8 rounded-md font-sans font-black text-black text-lg"
              style={{ background: LIME }}
            >
              C
            </span>
            <span className="text-white">CRNCH<span style={{ color: LIME }}>//</span></span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {["Home", "Shop", "About", "Contact"].map((n, i) => (
              <span
                key={n}
                className={
                  "relative py-1 cursor-default " +
                  (i === 0 ? "text-white" : "text-white/50")
                }
              >
                {n}
                {i === 0 && (
                  <span
                    className="absolute -bottom-0.5 left-0 right-0 h-[2px]"
                    style={{ background: LIME }}
                  />
                )}
              </span>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button className="p-2 rounded-full hover:bg-white/5 transition" aria-label="Search">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/5 transition hidden sm:grid" aria-label="Profile">
              <User className="w-4 h-4" />
            </button>
            <button
              className="ml-1 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-black"
              style={{ background: LIME }}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Cart <span className="opacity-70">0</span>
            </button>
          </div>
        </div>
        <div className="h-px bg-white/10" />
      </header>

      {/* Hero */}
      <section className="relative container-x pt-14 md:pt-24 pb-24 text-center">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] md:text-[11px] tracking-[0.32em] uppercase"
          style={{ borderColor: `${LIME}55`, color: LIME, background: `${LIME}0d` }}
        >
          <Sparkles className="w-3 h-3" /> Loud drop loading
        </div>

        <h1 className="mt-8 font-display font-bold leading-[0.85] tracking-tight text-[19vw] md:text-[10.5rem]">
          <span className="block text-white/95">COMING</span>
          <span className="block italic" style={{ color: LIME }}>
            SOON<span className="text-white/95">//</span>
          </span>
        </h1>

        <p className="mt-10 mx-auto max-w-xl text-sm md:text-base text-white/60 leading-relaxed">
          the chips lab is still cooking. flavors are being fried, bags are
          being loud-printed. drop your email and be first in the crunch.
        </p>

        {/* Email form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email.includes("@")) setSubscribed(true);
          }}
          className="mt-10 mx-auto max-w-md flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-sm p-1.5 pl-5"
        >
          <input
            type="email"
            required
            value={email}
            disabled={subscribed}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@loud.mail"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/35 py-2"
          />
          <button
            type="submit"
            className="rounded-full px-5 py-2.5 text-xs font-bold text-black tracking-wide transition hover:brightness-110 active:scale-95"
            style={{ background: LIME }}
          >
            {subscribed ? "You're in ✓" : "NOTIFY ME"}
          </button>
        </form>

        {/* Ticker */}
        <div className="mt-20 border-y border-white/10 -mx-5 md:mx-0 overflow-hidden">
          <div className="flex whitespace-nowrap py-3 marquee-track text-[11px] tracking-[0.3em] uppercase text-white/45">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="flex items-center gap-6 pr-10">
                <span>Kettle cooked</span>
                <span style={{ color: LIME }}>✦</span>
                <span>Loud flavors</span>
                <span style={{ color: LIME }}>✦</span>
                <span>Zero filler</span>
                <span style={{ color: LIME }}>✦</span>
                <span>Dropping 2026</span>
                <span style={{ color: LIME }}>✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
