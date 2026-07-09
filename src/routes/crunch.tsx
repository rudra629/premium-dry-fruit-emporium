import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Zap, Timer } from "lucide-react";

export const Route = createFileRoute("/crunch")({
  head: () => ({
    meta: [
      { title: "Crunch Mode — Coming Soon | Grams" },
      { name: "description", content: "Something bold is cracking open. Crunch Mode drops soon." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CrunchPage,
});

function CrunchPage() {
  return (
    <div className="crunch-scope min-h-[calc(100vh-5rem)] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.15]"
        style={{ backgroundImage: "radial-gradient(rgba(255,180,80,0.6) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle, #ff7a3d 0%, transparent 70%)" }} />
      <div className="absolute -bottom-32 -right-32 w-[520px] h-[520px] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle, #ffd166 0%, transparent 70%)" }} />

      <div className="container-x relative py-20 md:py-32 grid gap-12 place-items-center text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#ffb26b]/50 text-[#ffb26b] text-xs tracking-[0.3em] uppercase">
          <Zap className="w-3.5 h-3.5" /> Crunch Mode
        </span>

        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.9] text-cream">
          Something <span className="italic text-[#ffb26b]">bold</span> is
          <br />cracking open.
        </h1>

        <p className="max-w-xl text-cream/70 text-lg">
          A louder, spicier, snappier side of Grams. Chili-lime cashews.
          Smoked almonds. Wasabi peas. Coming soon — buckle up.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 md:gap-6 w-full max-w-3xl mt-6">
          {[
            { icon: Sparkles, k: "Bold", v: "Flavors that punch" },
            { icon: Zap, k: "Crunch", v: "Extra-loud textures" },
            { icon: Timer, k: "Soon", v: "Dropping this quarter" },
          ].map((f) => (
            <div key={f.k} className="rounded-2xl border border-cream/15 bg-cream/[0.04] backdrop-blur p-6 text-left">
              <f.icon className="w-5 h-5 text-[#ffb26b]" />
              <div className="mt-3 font-display text-2xl text-cream">{f.k}</div>
              <div className="text-cream/60 text-sm mt-1">{f.v}</div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-cream/40 text-xs tracking-[0.3em] uppercase">
          Tap "Enter Cozy Mode" to head back
        </p>
      </div>
    </div>
  );
}
