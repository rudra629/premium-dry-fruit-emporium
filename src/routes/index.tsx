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
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-forest-deep text-cream">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/70 via-forest-deep/50 to-forest-deep" />
        <div className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "3px 3px" }} />

        <div className="container-x relative pt-16 pb-24 md:pt-24 md:pb-36 grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-cream/5 backdrop-blur px-4 py-1.5 text-[11px] tracking-[0.24em] uppercase text-gold">
              <Sparkles className="w-3.5 h-3.5" /> Batch of July · Freshly Packed
            </div>
            <h1 className="mt-6 font-editorial text-[clamp(3.2rem,9vw,8rem)] leading-[0.92] font-normal tracking-tight">
              Snack like{" "}
              <span className="italic text-gold relative inline-block">
                nature
                <span aria-hidden className="absolute -bottom-2 left-0 right-0 h-[6px] bg-gold/40 rounded-full blur-[2px]" />
              </span>
              <br />
              <span className="italic text-cream/95">intended.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-cream/80 leading-relaxed">
              Small-batch dry fruits, obsessively-sourced nuts, and seeds that actually taste
              like the farm they came from. No fillers. No BS.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-gold text-forest-deep px-7 py-4 text-sm font-semibold hover:bg-cream transition"
              >
                Shop the collection
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/story"
                className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-7 py-4 text-sm font-medium hover:bg-cream/10 transition"
              >
                Our sourcing story
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-6 max-w-lg">
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

        {/* Hero mobile pouches */}
        <div className="lg:hidden container-x relative pb-16 -mt-8">
          <div className="grid grid-cols-3 gap-3">
            {[products[0], products[6], products[3]].map((p) => (
              <img key={p.slug} src={p.image} alt={p.name} className="w-full drop-shadow-2xl" />
            ))}
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
      <section className="container-x py-16 md:py-20">
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: Leaf, title: "Farm to pouch", desc: "Direct sourcing, zero middlemen, honest pricing." },
            { icon: ShieldCheck, title: "Lab tested", desc: "Every batch tested for freshness & purity." },
            { icon: Truck, title: "Fast delivery", desc: "Free 2-day shipping on orders over ₹899." },
            { icon: Sparkles, title: "Vacuum sealed", desc: "Nitrogen-flushed pouches lock in crunch." },
          ].map((v) => (
            <div key={v.title} className="rounded-2xl border border-border/70 bg-card p-6 hover:-translate-y-1 hover:shadow-card transition">
              <div className="w-11 h-11 rounded-full bg-forest-deep text-gold grid place-items-center">
                <v.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-4 font-display text-xl text-forest-deep">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
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

      {/* Featured huge banner */}
      <section className="container-x py-20">
        <div className="relative rounded-[2rem] overflow-hidden bg-forest-deep text-cream grain grain-after">
          <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${story1})` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-deep via-forest-deep/85 to-transparent" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center p-8 md:p-16 min-h-[520px]">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-gold">Product of the month</p>
              <h3 className="font-display text-5xl md:text-7xl mt-3 leading-none">
                Walnut<br />
                <span className="italic text-gold">Whole.</span>
              </h3>
              <p className="mt-5 max-w-md text-cream/80 leading-relaxed">
                California-grown, hand-graded and shipped within 14 days of harvest.
                One handful = your daily omega-3 in a crunch.
              </p>
              <div className="mt-8 flex items-center gap-6">
                <div>
                  <p className="font-display text-4xl text-gold">₹{featured.price}</p>
                  {featured.compareAt && <p className="text-sm text-cream/50 line-through">₹{featured.compareAt}</p>}
                </div>
                <Link to="/product/$slug" params={{ slug: featured.slug }} className="rounded-full bg-gold text-forest-deep px-7 py-4 text-sm font-semibold hover:bg-cream transition inline-flex items-center gap-2">
                  Shop walnuts <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="relative flex justify-center">
              <img src={featured.image} alt={featured.name} className="w-full max-w-md drop-shadow-[0_40px_60px_rgba(0,0,0,0.5)]" />
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
