import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, Leaf, ShieldCheck, Sparkles, Star, Quote } from "lucide-react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { useSite } from "@/lib/site-store";
import heroBg from "@/assets/hero-bg.jpg";
import story1 from "@/assets/story-1.jpg";
import lifestyle1 from "@/assets/lifestyle-1.jpg";
import texture1 from "@/assets/texture-1.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Grams — Beyond snack, it's a lifestyle" },
      { name: "description", content: "Farm-fresh dry fruits, nuts and seeds. Small-batch, freshly packed and delivered to your doorstep across India." },
    ],
  }),
  component: Home,
});

function Home() {
  const { allProducts, bannerWords } = useSite();
  const shown = allProducts;
  const bestsellers = shown.filter((p) => p.bestseller).slice(0, 4);
  const featured = shown.find((p) => p.slug === "walnut-whole-california") ?? shown[0];
  const newArrivals = shown.filter((p) => p.newArrival);

  return (
    <div className="relative">
      {/* Decorative fixed side rails */}
      <div aria-hidden className="hidden lg:flex fixed left-4 top-0 h-screen z-[1] pointer-events-none items-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-cream/40 [writing-mode:vertical-rl] rotate-180">Est · 2024 · India</span>
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
        </div>
      </div>
      <div aria-hidden className="hidden lg:flex fixed right-4 top-0 h-screen z-[1] pointer-events-none items-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-cream/40 [writing-mode:vertical-rl]">Farm · Roast · Pack · Ship</span>
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-visible md:overflow-hidden text-cream md:min-h-screen flex flex-col justify-start items-start md:justify-center md:items-center" style={{ background: "linear-gradient(180deg, #0a0a0c 0%, #131114 55%, #0c0b0e 100%)" }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})`, filter: "brightness(0.85) contrast(1.05) saturate(0.95)", opacity: 0.75 }}
        />
        {/* Warm vignette + directional darkening for text legibility */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 40%, transparent 0%, rgba(8,7,10,0.35) 45%, rgba(8,7,10,0.85) 100%)" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />

        {/* Warm amber glow orbs */}
        <div className="absolute -top-24 -left-16 w-[380px] h-[380px] rounded-full bg-gold/15 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-[420px] h-[420px] rounded-full bg-terracotta/12 blur-[140px] pointer-events-none" />

        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "3px 3px" }} />


        <div className="container-x relative px-4 pt-0 pb-4 md:px-12 md:pt-24 md:pb-36 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-6 md:gap-12 items-start md:items-center">
          <div className="relative z-10 mt-[120px] w-full transform-none md:mt-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-cream/5 backdrop-blur px-3 py-1.5 text-[10px] md:text-[11px] tracking-[0.24em] uppercase text-gold">
              <Sparkles className="w-3.5 h-3.5 shrink-0" /> Batch of July · Freshly Packed
            </div>
            <h1 className="mt-6 font-editorial text-5xl sm:text-6xl md:text-7xl lg:text-[8rem] leading-tight md:leading-[0.92] font-normal tracking-tight w-full break-words [text-wrap:balance]">

              Snack like{" "}
              <span className="italic text-gold relative inline-block">
                nature
              </span>

              <br />
              <span className="italic text-cream/95">intended.</span>
            </h1>
            <p className="mt-5 md:mt-6 max-w-lg text-base md:text-lg text-cream/80 leading-relaxed">
              Small-batch dry fruits, obsessively-sourced nuts, and seeds that actually taste
              like the farm they came from. No fillers. No BS.
            </p>

            <div className="mt-8 md:mt-9 flex flex-wrap items-center gap-3 md:gap-4">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-gold text-forest-deep px-6 md:px-7 py-3.5 md:py-4 text-sm font-semibold hover:bg-cream transition"
              >
                Shop the collection
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/story"
                className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-6 md:px-7 py-3.5 md:py-4 text-sm font-medium hover:bg-cream/10 transition"
              >
                Our sourcing story
              </Link>
            </div>

            <div className="mt-10 md:mt-14 grid grid-cols-3 gap-4 md:gap-6 max-w-lg">
              <Stat n="12+" l="Origins" />
              <Stat n="47k" l="Happy snackers" />
              <Stat n="4.8★" l="Avg. rating" />
            </div>
          </div>

          {/* Hero pouch stack */}
          <div className="relative h-[420px] md:h-[560px] hidden lg:block">
            <div className="absolute top-6 left-8 w-64 float-slow">
              <img src={products[3].image} alt="Macadamia" className="w-full drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)] rotate-[-8deg]" />
            </div>
            <div className="absolute top-0 right-4 w-72 float-slower">
              <img src={products[0].image} alt="Walnut" className="w-full drop-shadow-[0_30px_50px_rgba(0,0,0,0.7)] rotate-[6deg]" />
            </div>
            <div className="absolute bottom-4 left-24 w-80 z-10 float-slow" style={{ animationDelay: "1.5s" }}>
              <img src={products[6].image} alt="Mango" className="w-full drop-shadow-[0_40px_60px_rgba(0,0,0,0.7)] rotate-[-3deg]" />
            </div>
            <div className="absolute -bottom-2 right-0 w-64 float-slower" style={{ animationDelay: "2s" }}>
              <img src={products[5].image} alt="Pumpkin seeds" className="w-full drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)] rotate-[10deg]" />
            </div>

            {/* Floating rating card */}
            <div className="absolute top-1/2 -left-6 bg-cream text-ink rounded-2xl p-4 shadow-glow w-56 z-20">
              <div className="flex items-center gap-1 text-gold">
                {[...Array(5)].map((_, i) => (<Star key={i} className="w-3.5 h-3.5 fill-gold" />))}
              </div>
              <p className="mt-2 text-sm leading-snug font-medium">"Freshest cranberries I've ever ordered online."</p>
              <p className="mt-1 text-xs text-muted-foreground">— Riya, Mumbai</p>
            </div>
          </div>
        </div>

        {/* Hero mobile pouches — tight overlapping composition like desktop */}
        <div className="lg:hidden container-x relative px-4 pb-6 mt-0 w-full">
          <div className="relative mx-auto w-full max-w-xs h-[300px] sm:h-[360px]">
            <div className="absolute top-0 left-0 w-[46%] float-slow">
              <img src={products[3].image} alt="Macadamia" className="w-full drop-shadow-[0_16px_28px_rgba(0,0,0,0.6)] rotate-[-8deg]" />
            </div>
            <div className="absolute top-0 right-0 w-[50%] float-slower">
              <img src={products[0].image} alt="Walnut" className="w-full drop-shadow-[0_16px_28px_rgba(0,0,0,0.7)] rotate-[6deg]" />
            </div>
            <div className="absolute bottom-0 left-[12%] w-[56%] z-10 float-slow" style={{ animationDelay: "1.5s" }}>
              <img src={products[6].image} alt="Mango" className="w-full drop-shadow-[0_20px_32px_rgba(0,0,0,0.7)] rotate-[-3deg]" />
            </div>
            <div className="absolute -bottom-2 right-0 w-[46%] float-slower" style={{ animationDelay: "2s" }}>
              <img src={products[5].image} alt="Pumpkin seeds" className="w-full drop-shadow-[0_16px_28px_rgba(0,0,0,0.6)] rotate-[10deg]" />
            </div>

            {/* Floating rating card */}
            <div className="absolute top-[36%] -left-2 bg-cream text-ink rounded-2xl p-3 shadow-glow w-36 sm:w-44 z-20">
              <div className="flex items-center gap-1 text-gold">
                {[...Array(5)].map((_, i) => (<Star key={i} className="w-3 h-3 fill-gold" />))}
              </div>
              <p className="mt-1.5 text-[11px] sm:text-xs leading-snug font-medium">"Freshest cranberries I've ever ordered online."</p>
              <p className="mt-1 text-[10px] text-muted-foreground">— Riya, Mumbai</p>
            </div>
          </div>
        </div>

      </section>

      {/* Marquee */}
      <section className="bg-gold text-forest-deep py-4 overflow-hidden border-y border-forest-deep/20">
        <div className="flex whitespace-nowrap marquee-track font-display text-xl md:text-2xl italic">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10 pr-10">
              {bannerWords.map((w, j) => (
                <span key={j} className="flex items-center gap-10">
                  {w} <span className="text-forest-deep/40">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>


      {/* Value props */}
      <section className="relative py-16 md:py-20" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(20,18,22,0.85) 20%, rgba(20,18,22,0.85) 80%, transparent 100%)" }}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="container-x">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Leaf, title: "Farm to pouch", desc: "Direct sourcing, zero middlemen, honest pricing." },
              { icon: ShieldCheck, title: "Small-batch craft", desc: "Roasted & packed in tiny lots for peak flavor." },
              { icon: Truck, title: "Fast delivery", desc: "Free 2-day shipping on orders over ₹899." },
              { icon: Sparkles, title: "Vacuum sealed", desc: "Nitrogen-flushed pouches lock in crunch." },
            ].map((v) => (
              <div key={v.title} className="group relative rounded-2xl border border-white/[0.08] p-6 hover:-translate-y-1 hover:border-gold/40 transition overflow-hidden" style={{ background: "linear-gradient(145deg, #1a1719 0%, #131114 100%)" }}>
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gold/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-gold/25 to-gold/5 border border-gold/30 text-gold grid place-items-center">
                  <v.icon className="w-5 h-5" />
                </div>
                <h3 className="relative mt-4 font-display text-xl text-cream">{v.title}</h3>
                <p className="relative mt-1 text-sm text-cream/60 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Ornamental divider */}
      <Ornament />

      {/* "As featured in" logo strip */}
      <section className="container-x py-10 md:py-12">
        <div className="flex items-center gap-6 md:gap-10">
          <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-transparent to-cream/15" />
          <p className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-cream/50 whitespace-nowrap">As featured in</p>
          <div className="hidden md:block flex-1 h-px bg-gradient-to-l from-transparent to-cream/15" />
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-8 gap-y-4 items-center justify-items-center opacity-70">
          {["VOGUE", "GQ", "Forbes", "Condé Nast", "Elle", "Mint"].map((n) => (
            <span key={n} className="font-display italic text-lg md:text-xl text-cream/60 hover:text-gold transition">{n}</span>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="container-x py-8">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold">Loved by many</p>
            <h2 className="font-display text-4xl md:text-6xl text-forest-deep mt-2">The Bestsellers</h2>
          </div>
          <Link to="/shop" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold hover:text-terracotta transition">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* Numbers strip */}
      <section className="container-x py-10 md:py-14">
        <div className="relative rounded-2xl border border-white/[0.08] overflow-hidden" style={{ background: "linear-gradient(90deg, #101012 0%, #17141a 50%, #101012 100%)" }}>
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(rgba(212,162,76,0.9) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
          <div className="relative grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
            {[
              { n: "12+", l: "Global origins" },
              { n: "47k", l: "Happy snackers" },
              { n: "98%", l: "Reorder rate" },
              { n: "24h", l: "From roast to pack" },
            ].map((s) => (
              <div key={s.l} className="p-6 md:p-8 text-center">
                <p className="font-display text-4xl md:text-5xl text-gold">{s.n}</p>
                <p className="mt-1 text-[11px] tracking-[0.3em] uppercase text-cream/60">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Featured huge banner */}
      <section className="container-x px-4 py-12 md:px-0 md:py-20">
        <div className="relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-forest-deep text-cream grain grain-after">
          <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${story1})` }} />
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-forest-deep via-forest-deep/85 to-forest-deep/40 md:to-transparent" />
          {/* decorative pattern + glows */}
          <div className="absolute inset-0 opacity-[0.12] mix-blend-screen" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
          <div className="absolute -top-24 -left-16 w-[360px] h-[360px] rounded-full bg-gold/25 blur-[110px]" />
          <div className="absolute -bottom-32 right-1/4 w-[420px] h-[420px] rounded-full bg-terracotta/20 blur-[130px]" />
          <svg className="absolute bottom-6 left-6 w-32 h-32 text-gold/30 hidden md:block" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" />
          </svg>
          <div className="relative flex flex-row gap-4 sm:gap-8 md:gap-12 items-center p-5 sm:p-10 md:p-16 md:min-h-[520px]">
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[9px] sm:text-[11px] md:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase text-gold">Product of the month</p>
              <h3 className="font-display text-3xl sm:text-5xl md:text-7xl mt-2 md:mt-3 leading-[1.05] md:leading-none">
                Walnut<br />
                <span className="italic text-gold">Whole.</span>
              </h3>
              <p className="mt-3 md:mt-5 max-w-md text-xs sm:text-sm md:text-base text-cream/80 leading-relaxed">
                California-grown, hand-graded and shipped within 14 days of harvest.
              </p>
              <div className="mt-4 md:mt-8 flex flex-wrap items-center gap-3 md:gap-6">
                <div>
                  <p className="font-display text-2xl sm:text-3xl md:text-4xl text-gold">₹{featured.price}</p>
                  {featured.compareAt && <p className="text-xs sm:text-sm text-cream/50 line-through">₹{featured.compareAt}</p>}
                </div>
                <Link to="/product/$slug" params={{ slug: featured.slug }} className="rounded-full bg-gold text-forest-deep px-4 sm:px-6 md:px-7 py-2.5 sm:py-3.5 md:py-4 text-xs sm:text-sm font-semibold hover:bg-cream transition inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                  Shop <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>
            <div className="relative flex-1 flex justify-center shrink-0">
              <img src={featured.image} alt={featured.name} className="w-full max-w-[260px] sm:max-w-[280px] md:max-w-md drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] md:drop-shadow-[0_40px_60px_rgba(0,0,0,0.5)]" />
            </div>

          </div>
        </div>
      </section>


      {/* Categories */}
      <section className="container-x py-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-gold">Categories</p>
          <h2 className="font-display text-4xl md:text-6xl text-forest-deep mt-2">Pick your poison<br /><span className="italic">(the healthy kind).</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {[
            { name: "Nuts", desc: "Crunchy, protein-dense, brain fuel.", img: products[0].image, tint: "bg-forest-deep text-cream" },
            { name: "Seeds", desc: "Tiny things, giant nutrition.", img: products[5].image, tint: "bg-terracotta text-cream" },
            { name: "Dried Fruits", desc: "Nature's original candy.", img: products[6].image, tint: "bg-gold text-forest-deep" },
          ].map((c) => (
            <Link
              key={c.name}
              to="/shop"
              search={{ cat: c.name } as never}
              className={`group relative rounded-3xl overflow-hidden ${c.tint} min-h-[380px] flex flex-col justify-end p-8 hover:-translate-y-1 transition`}
            >
              <img src={c.img} alt={c.name} className="absolute -top-6 -right-6 w-56 rotate-6 group-hover:scale-110 group-hover:rotate-3 transition duration-500 drop-shadow-2xl" />
              <div className="relative">
                <h3 className="font-display text-4xl">{c.name}</h3>
                <p className="mt-2 opacity-80 max-w-[220px]">{c.desc}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                  Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="container-x py-20">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold">Fresh off the shelf</p>
            <h2 className="font-display text-4xl md:text-6xl text-forest-deep mt-2">New Arrivals</h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newArrivals.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* Lifestyle editorial */}
      <section className="container-x py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-3xl overflow-hidden">
            <img src={lifestyle1} alt="Snack life" className="w-full aspect-[4/5] object-cover" loading="lazy" />
            <div className="absolute bottom-6 left-6 right-6 bg-cream/95 backdrop-blur rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-forest-deep grid place-items-center text-gold">
                <Quote className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium leading-tight">"My 4pm slump officially has a solution."</p>
                <p className="text-xs text-muted-foreground mt-1">Aanya · Bengaluru</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold">The Grams Ritual</p>
            <h2 className="font-display text-5xl md:text-6xl text-forest-deep mt-3 leading-[0.95]">
              A tiny bowl. <br /><span className="italic">A giant reset.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              We built Grams for the in-between moments — the 4pm slumps, the pre-workout
              scrambles, the "I forgot to eat lunch" saves. Snacks that don't cost you your
              afternoon.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {["Zero refined sugar", "Zero preservatives", "100% traceable", "Recyclable pouches"].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <span className="font-medium">{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/story" className="mt-10 inline-flex items-center gap-2 rounded-full bg-forest-deep text-cream px-7 py-4 text-sm font-semibold hover:bg-forest transition">
              Meet the farmers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-x py-16">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs tracking-[0.3em] uppercase text-gold">Word on the street</p>
          <h2 className="font-display text-4xl md:text-6xl text-forest-deep mt-2">Snacked & Approved</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { q: "The mango slices are dangerous. I finished a pouch in one Netflix episode.", a: "Kabir S.", loc: "Delhi" },
            { q: "Genuinely the freshest walnuts I've had in years. Zero staleness.", a: "Meera P.", loc: "Pune" },
            { q: "Packaging feels premium, product delivers. My gym bag essential.", a: "Ishaan R.", loc: "Bangalore" },
          ].map((t) => (
            <div key={t.a} className="rounded-2xl border border-border bg-card p-7 hover:shadow-card transition">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-gold" />))}
              </div>
              <p className="mt-4 font-display text-xl leading-snug text-forest-deep">"{t.q}"</p>
              <p className="mt-6 text-sm font-semibold">{t.a}</p>
              <p className="text-xs text-muted-foreground">{t.loc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-x py-20">
        <div className="relative rounded-[2rem] overflow-hidden bg-gold text-forest-deep p-10 md:p-16 text-center">
          <img src={texture1} alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-30" />
          <div className="relative max-w-2xl mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase">Join the pantry</p>
            <h2 className="font-display text-4xl md:text-6xl mt-3 leading-tight">
              Get <span className="italic">10% off</span> your<br /> first bag of goodness.
            </h2>
            <p className="mt-4 opacity-80">Recipes, restock alerts, and early access to seasonal drops.</p>
            <form className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input type="email" placeholder="you@snacker.club" className="flex-1 bg-cream rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-forest-deep" />
              <button className="rounded-full bg-forest-deep text-cream px-7 py-4 text-sm font-semibold hover:bg-forest transition">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <p className="font-display text-3xl md:text-4xl text-gold">{n}</p>
      <p className="text-xs uppercase tracking-widest text-cream/60 mt-1">{l}</p>
    </div>
  );
}

function Ornament() {
  return (
    <div aria-hidden className="container-x py-6 md:py-8">
      <div className="flex items-center gap-4 md:gap-6 opacity-70">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <svg className="w-6 h-6 text-gold" viewBox="0 0 24 24" fill="none">
          <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="currentColor" opacity="0.9" />
        </svg>
        <span className="text-[10px] tracking-[0.5em] uppercase text-cream/50">Grams</span>
        <svg className="w-6 h-6 text-gold" viewBox="0 0 24 24" fill="none">
          <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="currentColor" opacity="0.9" />
        </svg>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold/40 to-transparent" />
      </div>
    </div>
  );
}

