import { Link, useRouterState } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Menu, X, Leaf } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/story", label: "Our Story" },
  { to: "/contact", label: "Contact" },
];

export function AnnouncementBar() {
  return (
    <div className="bg-forest-deep text-cream text-[11px] md:text-xs tracking-[0.2em] uppercase">
      <div className="container-x flex items-center justify-center gap-8 py-2 overflow-hidden">
        <span className="hidden md:inline opacity-70">Free shipping over ₹899</span>
        <span className="text-gold">✦ Freshly packed this week ✦</span>
        <span className="hidden md:inline opacity-70">Cash on delivery available</span>
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const cartRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const bump = () => {
      const el = cartRef.current;
      if (!el) return;
      el.classList.remove("cart-bump");
      void el.offsetWidth;
      el.classList.add("cart-bump");
    };
    window.addEventListener("grams:cart-bump", bump);
    return () => window.removeEventListener("grams:cart-bump", bump);
  }, []);



  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-cream/85 border-b border-border/60">
        <div className="container-x flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 font-display text-2xl md:text-3xl font-semibold text-forest-deep">
            <span className="grid place-items-center w-9 h-9 rounded-full bg-forest-deep text-gold">
              <Leaf className="w-4 h-4" />
            </span>
            <span>Grams<span className="text-gold">.</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-9 text-sm font-medium">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "relative py-1 transition-colors hover:text-forest-deep",
                  pathname === n.to ? "text-forest-deep" : "text-ink/70",
                )}
              >
                {n.label}
                {pathname === n.to && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-gold" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <Link to="/shop" className="p-2 rounded-full hover:bg-muted transition" aria-label="Search">
              <Search className="w-5 h-5" />
            </Link>
            <Link to="/profile" className="p-2 rounded-full hover:bg-muted transition hidden sm:grid" aria-label="Profile">
              <User className="w-5 h-5" />
            </Link>
            <Link ref={cartRef} to="/cart" className="relative p-2 rounded-full hover:bg-muted transition" aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-terracotta text-cream text-[10px] font-semibold grid place-items-center">
                  {count}
                </span>
              )}
            </Link>
            <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-border/60 bg-cream">
            <div className="container-x py-4 flex flex-col gap-1">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="py-3 border-b border-border/40 text-base font-medium"
                >
                  {n.label}
                </Link>
              ))}
              <Link to="/profile" onClick={() => setOpen(false)} className="py-3 text-base font-medium">
                My Account
              </Link>
              <Link to="/admin" onClick={() => setOpen(false)} className="py-3 text-base font-medium text-gold">
                Admin
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
