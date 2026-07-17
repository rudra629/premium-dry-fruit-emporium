import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useRef, useCallback } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import { flyToCart } from "@/lib/fly-to-cart";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const imgRef = useRef<HTMLImageElement>(null);
  const zoomRef = useRef<HTMLImageElement>(null);
  const rafRef = useRef<number | null>(null);
  const discount = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : 0;

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const img = zoomRef.current;
    if (!img) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      img.style.transformOrigin = `${x}% ${y}%`;
      img.style.transform = "scale(1.75)";
    });
  }, []);

  const handleEnter = useCallback(() => {
    const img = zoomRef.current;
    if (img) img.style.transform = "scale(1.75)";
  }, []);

  const handleLeave = useCallback(() => {
    const img = zoomRef.current;
    if (!img) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    img.style.transform = "scale(1)";
    img.style.transformOrigin = "center center";
  }, []);

  return (
    <div className="group relative flex flex-col">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-white/30 backdrop-blur-[2px] border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:shadow-[0_18px_45px_rgb(0,0,0,0.09)] transition-shadow duration-500"
      >
        <div
          className="absolute inset-0 flex items-center justify-center p-6 cursor-zoom-in overflow-hidden"
          onMouseMove={handleMove}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <img
            ref={(el) => { imgRef.current = el; zoomRef.current = el; }}
            src={product.image}
            alt={product.name}
            loading="lazy"
            style={{
              transformOrigin: "center center",
              transition: "transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94), transform-origin 0.12s ease-out",
              willChange: "transform, transform-origin",
            }}
            className="max-h-full max-w-full object-contain drop-shadow-[0_20px_30px_rgba(10,40,24,0.22)] pointer-events-none select-none"
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
      </Link>

      <div className="pt-4 px-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground truncate">{product.category}</p>
          <div className="flex items-center gap-1 text-xs shrink-0">
            <Star className="w-3 h-3 fill-gold text-gold" />
            <span className="font-semibold">{product.rating}</span>
          </div>
        </div>
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="mt-1 block font-display text-lg sm:text-xl text-forest-deep leading-tight hover:text-terracotta transition line-clamp-1"
        >
          {product.name}
        </Link>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-1">{product.tagline}</p>
        <div className="mt-3 flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="font-display text-xl sm:text-2xl text-forest-deep">₹{product.price}</span>
            {product.compareAt && (
              <span className="text-xs sm:text-sm text-muted-foreground line-through">₹{product.compareAt}</span>
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
              flyToCart(imgRef.current, product.image);
            }}
            className="add-btn shrink-0 relative overflow-hidden rounded-full border-2 border-forest-deep text-forest-deep text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3 sm:px-4 py-2 animate-bouncy hover:animate-none"
          >
            <span className="add-btn-fill" />
            <span className="add-btn-label relative z-10">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
