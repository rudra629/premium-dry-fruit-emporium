import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Zap, Flame } from "lucide-react";

export const Route = createFileRoute("/chips")({
  head: () => ({
    meta: [
      { title: "Grams Chips — Coming Soon" },
      { name: "description", content: "Something crunchy is on the way. Grams Chips drops soon — bold flavors, zero compromise." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ChipsComingSoon,
});

function ChipsComingSoon() {
  return (
    <div className="relative min-h-[100vh] bg-[#0a0a0a] text-white overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-30" style={{ background: "radial-gradient(circle, #ff5b2e 0%, transparent 70%)" }} />
        <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-25" style={{ background: "radial-gradient(circle, #ffd166 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
      </div>

      {/* Marquee top */}
      <div className="relative border-y border-white/10 bg-white/[0.02]">
        <div className="flex whitespace-nowrap overflow-hidden py-3 text-[11px] tracking-[0.32em] uppercase">
          <div className="marquee-track flex gap-10 min-w-max px-6 text-white/60">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="flex items-center gap-3">
                <Flame className="w-3.5 h-3.5 text-[#ff5b2e]" />
                Grams Chips — Loud Flavors, No Filler
                <Sparkles className="w-3.5 h-3.5 text-[#ffd166]" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="container-x relative pt-20 pb-24 md:pt-32 md:pb-40">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-[11px] tracking-[0.28em] uppercase text-white/70">
            <Zap className="w-3.5 h-3.5 text-[#ffd166]" /> New drop incoming
          </div>

          <h1 className="mt-6 font-display text-[16vw] md:text-[10rem] leading-[0.85] tracking-tighter">
            <span className="block text-white">Coming</span>
            <span className="block italic bg-gradient-to-r from-[#ffd166] via-[#ff5b2e] to-[#ffd166] bg-clip-text text-transparent">
              Soon.
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg text-white/70">
            We spent our whole life on nuts. Now we&apos;re turning up the volume — a chip range so loud, your pantry will need earplugs. Big crunch. Bigger attitude.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#ff5b2e] text-black text-sm font-semibold">
              <Flame className="w-4 h-4" /> Dropping 2026
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/20 text-sm text-white/80">
              5 flavors. Zero chill.
            </div>
          </div>
        </div>

        {/* Big flavor grid */}
        <div className="mt-20 md:mt-28 grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {[
            { n: "01", name: "Peri Peri", c: "#ff5b2e" },
            { n: "02", name: "Salt & Pepper", c: "#e5e5e5" },
            { n: "03", name: "Sour Cream", c: "#a7f3d0" },
            { n: "04", name: "Cheddar", c: "#ffd166" },
            { n: "05", name: "Smoke BBQ", c: "#c084fc" },
          ].map((f) => (
            <div key={f.n} className="group relative aspect-[3/4] rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5 overflow-hidden transition hover:border-white/30 hover:-translate-y-1">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(circle at 50% 100%, ${f.c}33 0%, transparent 70%)` }} />
              <div className="relative flex flex-col h-full justify-between">
                <span className="text-[11px] tracking-[0.3em] text-white/50">{f.n}</span>
                <div>
                  <div className="w-8 h-1 rounded-full mb-3" style={{ background: f.c }} />
                  <div className="font-display text-2xl md:text-3xl">{f.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-6 md:gap-8 text-sm text-white/70">
          <div>
            <div className="text-[11px] tracking-[0.3em] uppercase text-white/40">The Crunch</div>
            <p className="mt-2 text-white/80">Kettle-cooked in small batches. Thicker cut, louder bite, real crunch you can hear across the room.</p>
          </div>
          <div>
            <div className="text-[11px] tracking-[0.3em] uppercase text-white/40">The Flavor</div>
            <p className="mt-2 text-white/80">No mystery powders. Real spices, cold-pressed oils, and enough attitude to ruin your other snacks.</p>
          </div>
          <div>
            <div className="text-[11px] tracking-[0.3em] uppercase text-white/40">The Drop</div>
            <p className="mt-2 text-white/80">Limited first run. Hit the button, get back to Grams — we&apos;ll ping you the second bags leave the fryer.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
