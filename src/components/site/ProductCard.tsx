import { Link } from "@tanstack/react-router";
import { Star, Plus } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const discount = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-muted to-cream border border-border/60"
      >
        <div className="absolute inset-0 flex items-center justify-center p-6 transition-transform duration-500 group-hover:scale-105">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain drop-shadow-[0_20px_30px_rgba(10,40,24,0.25)]"
          />
        </div>

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.bestseller && (
            <span className="text-[10px] tracking-[0.18em] uppercase font-semibold bg-forest-deep text-gold px-2.5 py-1 rounded-full">
              Bestseller
            </span>
          )}
          {product.newArrival && (
            <span className="text-[10px] tracking-[0.18em] uppercase font-semibold bg-terracotta text-cream px-2.5 py-1 rounded-full">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="text-[10px] tracking-[0.18em] uppercase font-semibold bg-gold text-forest-deep px-2.5 py-1 rounded-full">
              −{discount}%
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            add({
              slug: product.slug,
              name: product.name,
              image: product.image,
              weight: product.weights[0].label,
              price: product.weights[0].price,
              qty: 1,
            });
          }}
          className="absolute bottom-3 right-3 grid place-items-center w-11 h-11 rounded-full bg-forest-deep text-gold shadow-glow opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition"
          aria-label="Add to cart"
        >
          <Plus className="w-5 h-5" />
        </button>
      </Link>

      <div className="pt-4 px-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">{product.category}</p>
          <div className="flex items-center gap-1 text-xs">
            <Star className="w-3 h-3 fill-gold text-gold" />
            <span className="font-semibold">{product.rating}</span>
          </div>
        </div>
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="mt-1 block font-display text-xl text-forest-deep leading-tight hover:text-terracotta transition"
        >
          {product.name}
        </Link>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{product.tagline}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-2xl text-forest-deep">₹{product.price}</span>
          {product.compareAt && (
            <span className="text-sm text-muted-foreground line-through">₹{product.compareAt}</span>
          )}
        </div>
      </div>
    </div>
  );
}
