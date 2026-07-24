import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Star, Minus, Plus, ShieldCheck, Truck, Leaf, Heart, Share2, Check, ChevronDown } from "lucide-react";
import { getProduct, products, type Product, type ProductSlide } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { useCart, MAX_QTY_PER_ITEM } from "@/lib/cart-store";
import { useSite } from "@/lib/site-store";
import { flyToCart } from "@/lib/fly-to-cart";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const p = getProduct(params.slug);
    if (p) return { product: p };
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("grams:extra-products");
        if (raw) {
          const list = JSON.parse(raw) as Product[];
          const found = list.find((x) => x.slug === params.slug);
          if (found) return { product: found };
        }
      } catch {}
    }
    throw notFound();
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Grams` },
          { name: "description", content: loaderData.product.tagline },
          { property: "og:title", content: `${loaderData.product.name} — Grams` },
          { property: "og:description", content: loaderData.product.tagline },
          { property: "og:image", content: loaderData.product.image },
          { name: "twitter:image", content: loaderData.product.image },
        ]
      : [{ title: "Product not found" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="container-x py-32 text-center">
      <h1 className="font-display text-5xl text-forest-deep">Product not found</h1>
      <Link to="/shop" className="mt-6 inline-block underline">Back to shop</Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const { productSlides } = useSite();
  const [weight, setWeight] = useState(product.weights[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const heroImgRef = useRef<HTMLImageElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Merge admin-edited slides with product default; fallback = one slide from product base
  const slides: ProductSlide[] = useMemo(() => {
    const admin = productSlides[product.slug];
    if (admin && admin.length) return admin;
    if (product.slides && product.slides.length) return product.slides;
    return [{ image: product.image, title: product.name, description: product.tagline }];
  }, [productSlides, product]);

  const [slideIdx, setSlideIdx] = useState(0);
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setSlideIdx((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, [slides.length]);

  const current = slides[slideIdx];
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);

  const scrollDown = () => {
    detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      {/* Full-viewport hero slideshow */}
      <section className="relative w-full h-[100svh] min-h-[560px] overflow-hidden bg-[#0a0a0c]">
        {/* Slides (image layer) */}
        {slides.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
            style={{ opacity: i === slideIdx ? 1 : 0 }}
          >
            <img
              ref={i === 0 ? heroImgRef : undefined}
              src={s.image}
              alt={s.title}
              className="absolute inset-0 w-full h-full object-contain md:object-cover object-center"
              style={{
                transform: i === slideIdx ? "scale(1.02)" : "scale(1.08)",
                transition: "transform 6s ease-out",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/70 via-transparent to-[#0a0a0c]/30" />
          </div>
        ))}

        {/* Breadcrumb */}
        <div className="absolute top-6 left-0 right-0 container-x text-xs text-cream/70 z-10">
          <Link to="/" className="hover:text-gold">Home</Link> / <Link to="/shop" className="hover:text-gold">Shop</Link> / <span className="text-gold">{product.name}</span>
        </div>

        {/* Text overlay */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end pb-24 md:pb-32">
          <div className="container-x">
            <div key={slideIdx} className="slide-fade max-w-2xl">
              <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-gold mb-3 md:mb-4">{product.category}</p>
              <h1 className="font-display italic text-5xl md:text-7xl lg:text-8xl text-cream leading-[0.95] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                {current.title}
              </h1>
              <p className="mt-4 md:mt-6 text-base md:text-xl text-cream/85 max-w-xl leading-relaxed">
                {current.description}
              </p>
            </div>
          </div>
        </div>

        {/* Fixed origin badge (stays across slides) */}
        <div className="absolute top-20 right-4 md:top-8 md:right-8 z-10">
          <div className="rounded-full border border-cream/20 bg-black/40 backdrop-blur-md px-4 py-2.5 text-xs md:text-sm text-cream flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="tracking-[0.25em] uppercase text-cream/60 text-[10px] md:text-[11px]">Origin</span>
            <span className="font-semibold">{product.origin}</span>
          </div>
        </div>

        {/* Slide indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-24 md:bottom-28 right-4 md:right-8 z-10 flex flex-col gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-8 w-1 rounded-full transition-all ${i === slideIdx ? "bg-gold" : "bg-cream/25 hover:bg-cream/50"}`}
              />
            ))}
          </div>
        )}

        {/* Scroll cue */}
        <button
          onClick={scrollDown}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-cream/70 hover:text-gold transition group"
        >
          <span className="text-[10px] tracking-[0.35em] uppercase">Scroll for details</span>
          <ChevronDown className="w-5 h-5 animate-bounce group-hover:text-gold" />
        </button>
      </section>

      {/* Details — everything else scrolled below */}
      <div ref={detailsRef} className="container-x py-14 md:py-20 grid lg:grid-cols-[1fr_1.1fr] gap-10 md:gap-16">
        <div className="relative rounded-3xl bg-gradient-to-br from-muted to-cream border border-border/60 p-8 md:p-14 grid place-items-center min-h-[420px] overflow-hidden">
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            {product.bestseller && <span className="text-[10px] tracking-[0.18em] uppercase font-semibold bg-forest-deep text-gold px-2.5 py-1 rounded-full">Bestseller</span>}
            {product.newArrival && <span className="text-[10px] tracking-[0.18em] uppercase font-semibold bg-terracotta text-cream px-2.5 py-1 rounded-full">New</span>}
          </div>
          <img src={product.image} alt={product.name} className="max-h-[480px] drop-shadow-[0_30px_50px_rgba(10,40,24,0.3)]" />
        </div>

        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-gold">{product.category}</p>
          <h2 className="mt-2 font-display italic text-4xl md:text-5xl text-forest-deep leading-none">{product.name}</h2>
          <p className="mt-3 text-base md:text-lg text-muted-foreground">{product.tagline}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-gold text-gold" : "text-border"}`} />)}
              <span className="ml-1 text-sm font-semibold">{product.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">{product.reviews} reviews</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-5xl text-forest-deep">₹{weight.price}</span>
            {product.compareAt && weight.value === product.weights[0].value && (
              <span className="text-lg text-muted-foreground line-through">₹{product.compareAt}</span>
            )}
            <span className="text-sm text-muted-foreground">/ {weight.label}</span>
          </div>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Choose weight</p>
            <div className="flex flex-wrap gap-2">
              {product.weights.map((w) => (
                <button
                  key={w.value}
                  onClick={() => setWeight(w)}
                  className={`rounded-full px-5 py-3 text-sm font-semibold border-2 transition ${weight.value === w.value ? "border-forest-deep bg-forest-deep text-cream" : "border-border hover:border-forest-deep"}`}
                >
                  {w.label} · ₹{w.price}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center rounded-full border-2 border-border overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-11 h-11 grid place-items-center hover:bg-muted"><Minus className="w-4 h-4" /></button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(Math.min(MAX_QTY_PER_ITEM, qty + 1))} className="w-11 h-11 grid place-items-center hover:bg-muted"><Plus className="w-4 h-4" /></button>
            </div>
            <button
              onClick={() => {
                add({ slug: product.slug, name: product.name, image: product.image, weight: weight.label, price: weight.price, qty });
                setAdded(true);
                flyToCart(heroImgRef.current, product.image);
                setTimeout(() => setAdded(false), 1800);
              }}
              className="flex-1 min-w-[180px] rounded-full bg-forest-deep text-cream py-4 text-sm font-semibold hover:bg-forest transition inline-flex items-center justify-center gap-2"
            >
              {added ? (<><Check className="w-4 h-4" /> Added to bag</>) : (<>Add to bag · ₹{weight.price * qty}</>)}
            </button>
            <button className="w-12 h-12 grid place-items-center rounded-full border-2 border-border hover:border-terracotta hover:text-terracotta transition"><Heart className="w-5 h-5" /></button>
            <button className="w-12 h-12 grid place-items-center rounded-full border-2 border-border hover:border-forest-deep transition"><Share2 className="w-5 h-5" /></button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Max {MAX_QTY_PER_ITEM} units per product.</p>

          <div className="mt-8 flex flex-wrap gap-2">
            {product.badges.map((b) => (
              <span key={b} className="text-xs bg-muted rounded-full px-3 py-1.5 font-medium">✦ {b}</span>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-xs">
            <div className="flex items-start gap-2 p-3 rounded-xl border border-border/60"><Truck className="w-4 h-4 mt-0.5 text-forest-deep" /><span>Free shipping over ₹899</span></div>
            <div className="flex items-start gap-2 p-3 rounded-xl border border-border/60"><ShieldCheck className="w-4 h-4 mt-0.5 text-forest-deep" /><span>Nitrogen-flushed freshness</span></div>
            <div className="flex items-start gap-2 p-3 rounded-xl border border-border/60"><Leaf className="w-4 h-4 mt-0.5 text-forest-deep" /><span>Recyclable pouch</span></div>
          </div>
        </div>
      </div>

      {/* Detail tabs */}
      <section className="container-x py-12 border-t border-border/50">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-3xl text-forest-deep">The Story</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We source directly from growers in {product.origin}, cutting the layers of middlemen so you get freshness without the markup. Each batch is small-lot roasted (where applicable), nitrogen-flushed, and vacuum-sealed within hours.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl text-forest-deep">Nutrition</h2>
            <div className="mt-4 rounded-2xl border border-border overflow-hidden">
              {product.nutrition.map((n, i) => (
                <div key={n.label} className={`flex items-center justify-between px-5 py-4 ${i % 2 ? "bg-muted/50" : ""}`}>
                  <span className="text-sm text-muted-foreground">{n.label}</span>
                  <span className="font-semibold">{n.value}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">*Values are indicative per 100g serving. Actual values may vary slightly.</p>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="container-x py-12">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-4xl text-forest-deep">You might also love</h2>
          <Link to="/shop" className="text-sm font-semibold hover:text-terracotta">View all</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>
    </div>
  );
}
