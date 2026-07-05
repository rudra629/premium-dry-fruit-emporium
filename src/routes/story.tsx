import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, Users, Award, Sprout } from "lucide-react";
import story1 from "@/assets/story-1.jpg";
import lifestyle1 from "@/assets/lifestyle-1.jpg";
import texture1 from "@/assets/texture-1.jpg";
import { products } from "@/lib/products";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — Grams" },
      { name: "description", content: "How Grams went from one farmer's walnut orchard to your pantry. Small-batch, honest, obsessive." },
      { property: "og:title", content: "Our Story — Grams" },
      { property: "og:description", content: "Farm-to-pouch, no middlemen, no BS." },
      { property: "og:image", content: story1 },
    ],
  }),
  component: Story,
});

function Story() {
  return (
    <div>
      <section className="relative overflow-hidden bg-forest-deep text-cream min-h-[70vh] flex items-end">
        <img src={story1} alt="" className="absolute inset-0 w-full h-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/60 to-transparent" />
        <div className="container-x relative py-20">
          <p className="text-xs tracking-[0.3em] uppercase text-gold">Since 2021</p>
          <h1 className="mt-4 font-display text-[clamp(3rem,9vw,8rem)] leading-[0.85] max-w-4xl">
            One orchard,<br /><span className="italic text-gold">a thousand pouches.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cream/80">
            Grams started in a shed in Ratnagiri with 12 kilos of walnuts, a vacuum sealer, and a stubborn belief that snacks shouldn't taste like the plastic they came in.
          </p>
        </div>
      </section>

      {/* Numbers */}
      <section className="container-x py-16">
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { n: "12+", l: "Farmer partners", i: Users },
            { n: "47k", l: "Pouches shipped", i: Leaf },
            { n: "0", l: "Preservatives", i: Sprout },
            { n: "4.8★", l: "Verified rating", i: Award },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-card border border-border p-6">
              <s.i className="w-6 h-6 text-gold" />
              <p className="mt-4 font-display text-5xl text-forest-deep">{s.n}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chapters */}
      <section className="container-x py-16 space-y-24">
        {[
          {
            year: "Chapter 01",
            title: "The problem we couldn't ignore.",
            body: "Every ‘premium' dry fruit in the market tasted 3 months old, cost twice its worth, and came wrapped in dead-plastic. So we did what any obsessed founder would do — booked a train to Ratnagiri and started asking questions.",
            img: story1,
          },
          {
            year: "Chapter 02",
            title: "Farm to pouch, minus the middlemen.",
            body: "We now work with 12+ farmer partners across 8 origins. Every batch is graded on-site, packed within 14 days of harvest, and shipped in vacuum-sealed pouches you can actually recycle.",
            img: texture1,
            reverse: true,
          },
          {
            year: "Chapter 03",
            title: "For the 4pm slump crowd.",
            body: "Grams is built for the in-between moments — the pre-workout, the desk snack, the airport rescue. Nothing frilly. Just the good stuff, packed properly.",
            img: lifestyle1,
          },
        ].map((c, i) => (
          <div key={i} className={`grid lg:grid-cols-2 gap-10 items-center ${c.reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div className="rounded-3xl overflow-hidden">
              <img src={c.img} alt={c.title} loading="lazy" className="w-full aspect-[4/3] object-cover" />
            </div>
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-gold">{c.year}</p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl text-forest-deep leading-tight">{c.title}</h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{c.body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Values grid */}
      <section className="container-x py-16">
        <div className="text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gold">What we stand for</p>
          <h2 className="mt-2 font-display text-5xl text-forest-deep">Three non-negotiables.</h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {[
            { t: "Traceability", d: "Every pouch lists its origin farm. If we can't trace it, we don't sell it." },
            { t: "Freshness first", d: "Nitrogen-flushed, vacuum-sealed, dated. No mystery shelf life." },
            { t: "Honest pricing", d: "No inflated ‘premium' tax. Just fair prices for actually-fresh product." },
          ].map((v, i) => (
            <div key={v.t} className="rounded-2xl bg-forest-deep text-cream p-8">
              <p className="font-display text-6xl text-gold">0{i + 1}</p>
              <h3 className="mt-4 font-display text-2xl">{v.t}</h3>
              <p className="mt-2 text-cream/70 leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-16">
        <div className="rounded-[2rem] bg-gold text-forest-deep p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h3 className="font-display text-4xl md:text-5xl">Ready to taste the difference?</h3>
            <p className="mt-3">Start with our bestsellers — we'll do the rest.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/shop" className="rounded-full bg-forest-deep text-cream px-7 py-4 text-sm font-semibold inline-flex items-center gap-2 hover:bg-forest transition">
              Shop now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/product/$slug" params={{ slug: products[0].slug }} className="rounded-full border-2 border-forest-deep px-7 py-4 text-sm font-semibold hover:bg-forest-deep hover:text-cream transition">
              Try walnuts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
