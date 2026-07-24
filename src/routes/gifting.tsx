import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Gift, Sparkles, ArrowRight, Package } from "lucide-react";
import { useSite, type GiftCategory } from "@/lib/site-store";
import { Price } from "@/components/site/Price";

export const Route = createFileRoute("/gifting")({
  head: () => ({
    meta: [
      { title: "Gifting — Grams" },
      { name: "description", content: "Corporate, birthday and festive gift boxes from Grams. Luxe black, hand-numbered, delivered gift-wrapped." },
      { property: "og:title", content: "Gifting — Grams" },
      { property: "og:description", content: "Corporate, birthday and festive dry-fruit gift boxes. Matte black, gold foiled, ridiculously generous." },
    ],
  }),
  component: Gifting,
});

const CATEGORIES: { id: GiftCategory; label: string; sub: string }[] = [
  { id: "Corporate", label: "Corporate", sub: "Impress clients & teams" },
  { id: "Birthday", label: "Birthday", sub: "Better than another candle" },
  { id: "Festive", label: "Festive", sub: "Diwali, Rakhi, Christmas" },
];

function Gifting() {
  const { giftBoxes } = useSite();
  const [cat, setCat] = useState<GiftCategory>("Corporate");
  const filtered = giftBoxes.filter((g) => g.category === cat);

  return (
    <div className="bg-[#050506] text-cream min-h-screen -mx-[calc((100vw-100%)/2)]">
      <div className="mx-auto max-w-[100vw] px-0">
        {/* Hero */}
        <section className="relative overflow-hidden bg-black">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(rgba(212,162,76,0.35) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
          <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-gold/10 blur-[140px]" />
          <div className="absolute -bottom-32 -right-16 w-[420px] h-[420px] rounded-full bg-terracotta/10 blur-[120px]" />
          <div className="container-x relative py-20 md:py-32 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1.5 text-[10px] tracking-[0.3em] uppercase text-gold">
              <Sparkles className="w-3.5 h-3.5" /> The Gifting Collection
            </div>
            <h1 className="mt-6 font-display text-5xl md:text-8xl leading-[0.9] tracking-tight">
              Gift like <span className="italic text-gold">you mean it.</span>
            </h1>
            <p className="mt-6 max-w-xl mx-auto text-cream/70 leading-relaxed">
              Matte-black rigid boxes. Gold foil monograms. Hand-numbered. Ships gift-wrapped, no invoice inside.
              For clients you actually want to keep and people you actually love.
            </p>
          </div>
        </section>

        {/* Category tabs */}
        <section className="container-x py-10 md:py-14">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`pill rounded-full px-5 md:px-6 py-3 text-xs md:text-sm font-medium tracking-wide border transition ${cat === c.id ? "bg-gold text-forest-deep border-gold" : "border-white/15 bg-white/[0.03] text-cream/80 hover:border-gold/50"}`}
              >
                {c.label} <span className="opacity-60 hidden md:inline">· {c.sub}</span>
              </button>
            ))}
          </div>

          {/* Boxes */}
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {filtered.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-white/15 p-12 text-center text-cream/60">
                <Gift className="w-8 h-8 mx-auto mb-3 text-gold" />
                No {cat.toLowerCase()} boxes yet. Ask an admin to add some.
              </div>
            )}
            {filtered.map((g) => (
              <article key={g.id} className="group relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0f0f11] to-black hover:border-gold/50 transition">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(400px 200px at 50% 0%, rgba(212,162,76,0.15), transparent 60%)" }} />
                <div className="relative aspect-[4/5] bg-black grid place-items-center p-8 border-b border-white/10">
                  <img src={g.image} alt={g.name} className="max-h-full max-w-full object-contain drop-shadow-[0_20px_40px_rgba(212,162,76,0.25)] group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-4 left-4 text-[10px] tracking-[0.25em] uppercase font-semibold text-gold border border-gold/40 rounded-full px-2.5 py-1">
                    {g.category}
                  </span>
                </div>
                <div className="relative p-5 md:p-6">
                  <h3 className="font-display italic text-2xl md:text-3xl leading-tight text-cream">{g.name}</h3>
                  <p className="mt-1.5 text-sm text-cream/60">{g.tagline}</p>

                  <ul className="mt-4 space-y-1.5 text-xs text-cream/70">
                    {g.contents.slice(0, 4).map((c, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-gold" /> {c}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex items-end justify-between gap-3">
                    <Price price={g.price} compareAt={g.compareAt} size="lg" />
                    <button className="shrink-0 rounded-full bg-gold text-forest-deep px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-cream transition inline-flex items-center gap-1.5">
                      Enquire <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Bulk banner */}
        <section className="container-x py-16">
          <div className="relative rounded-[2rem] overflow-hidden border border-gold/25 bg-gradient-to-br from-[#0d0d0f] to-black p-8 md:p-16">
            <div className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full bg-gold/15 blur-[120px]" />
            <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
              <div>
                <p className="text-[11px] tracking-[0.3em] uppercase text-gold">Corporate · Bulk</p>
                <h2 className="mt-3 font-display text-4xl md:text-6xl leading-[0.95]">
                  50 boxes. 500 boxes. <span className="italic text-gold">One quote.</span>
                </h2>
                <p className="mt-4 text-cream/70 max-w-md leading-relaxed">
                  White-label, custom branding, personalised notes at scale. Diwali & year-end slots go fast — reserve early.
                </p>
                <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold text-forest-deep px-7 py-4 text-sm font-semibold hover:bg-cream transition">
                  Request a quote <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid place-items-center">
                <div className="relative w-full max-w-xs aspect-square rounded-2xl border border-gold/30 grid place-items-center">
                  <Package className="w-24 h-24 text-gold/40" />
                  <span className="absolute -top-3 -right-3 text-[10px] tracking-[0.25em] uppercase text-forest-deep bg-gold px-3 py-1 rounded-full">Est. 2024</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
