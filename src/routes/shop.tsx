import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { type Product } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { useSite } from "@/lib/site-store";
import { Skeleton } from "@/components/ui/skeleton";

type Search = { cat?: string; q?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    cat: typeof s.cat === "string" ? s.cat : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop — Grams" },
      { name: "description", content: "Browse the full Grams collection of premium nuts, seeds and dried fruits." },
    ],
  }),
  component: Shop,
});

const cats = ["All", "Nuts", "Seeds", "Dried Fruits"] as const;
const sorts = ["Featured", "Price: Low → High", "Price: High → Low", "Rating"] as const;

function Shop() {
  const search = Route.useSearch();
  const { allProducts } = useSite();
  const [q, setQ] = useState(search.q ?? "");
  const [cat, setCat] = useState<string>(search.cat ?? "All");
  const [sort, setSort] = useState<(typeof sorts)[number]>("Featured");
  const [maxPrice, setMaxPrice] = useState(1500);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 350); return () => clearTimeout(t); }, []);

  const filtered = useMemo(() => {
    let list: Product[] = allProducts.slice();
    if (cat !== "All") list = list.filter((p) => p.category === cat);
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.tagline.toLowerCase().includes(q.toLowerCase()));
    list = list.filter((p) => p.price <= maxPrice);
    if (sort === "Price: Low → High") list.sort((a, b) => a.price - b.price);
    if (sort === "Price: High → Low") list.sort((a, b) => b.price - a.price);
    if (sort === "Rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [q, cat, sort, maxPrice, allProducts]);


  return (
    <div>
      {/* Header */}
      <section className="bg-forest-deep text-cream py-16 md:py-24">
        <div className="container-x">
          <p className="text-xs tracking-[0.3em] uppercase text-gold">The Collection</p>
          <h1 className="mt-3 font-display text-5xl md:text-7xl">Shop the shelf.</h1>
          <p className="mt-4 max-w-xl text-cream/70">Ten obsessively-sourced snacks. Sort, filter, and add the good stuff to your pantry.</p>

          <div className="mt-10 flex items-center gap-3 bg-cream/10 backdrop-blur border border-cream/20 rounded-full px-5 py-1 max-w-2xl">
            <Search className="w-5 h-5 text-gold" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search walnuts, mango, seeds…"
              className="flex-1 bg-transparent outline-none py-4 text-cream placeholder:text-cream/50"
            />
            {q && (
              <button onClick={() => setQ("")} className="p-1.5 rounded-full hover:bg-cream/10">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="container-x py-8 sticky top-16 md:top-20 bg-cream/90 backdrop-blur z-20 border-b border-border/50 -mt-1">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${cat === c ? "bg-forest-deep text-cream" : "bg-muted hover:bg-border"}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Max ₹{maxPrice}</span>
              <input type="range" min={199} max={1500} step={50} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="accent-forest-deep" />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value as never)} className="rounded-full bg-muted px-4 py-2 text-sm font-medium border border-border">
              {sorts.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container-x py-12">
        <p className="text-sm text-muted-foreground mb-6">{loading ? "Loading…" : `${filtered.length} products`}</p>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="aspect-[4/5] rounded-2xl" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-3xl text-forest-deep">Nothing matches that.</p>
            <p className="text-muted-foreground mt-2">Try clearing filters or searching a friendlier word.</p>
            <button onClick={() => { setQ(""); setCat("All"); setMaxPrice(1500); }} className="mt-6 rounded-full bg-forest-deep text-cream px-6 py-3 text-sm font-semibold">Reset</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        )}
      </section>

      <section className="container-x pb-20">
        <div className="rounded-3xl bg-forest-deep text-cream p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-3xl md:text-4xl">Can't decide?</h3>
            <p className="mt-2 text-cream/70">Grab our curated Signature Trio — one from each category, hand-picked by us.</p>
          </div>
          <Link to="/product/$slug" params={{ slug: allProducts[0]?.slug ?? "walnut-whole-california" }} className="rounded-full bg-gold text-forest-deep px-7 py-4 text-sm font-semibold hover:bg-cream transition">
            Explore Signature
          </Link>
        </div>
      </section>
    </div>
  );
}
