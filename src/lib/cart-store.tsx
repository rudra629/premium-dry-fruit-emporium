import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

export const MAX_QTY_PER_ITEM = 30;

export type CartItem = {
  slug: string;
  name: string;
  image: string;
  weight: string;
  price: number;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  add: (i: CartItem) => void;
  remove: (slug: string, weight: string) => void;
  setQty: (slug: string, weight: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("grams:cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("grams:cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  const add: CartCtx["add"] = (i) =>
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.slug === i.slug && p.weight === i.weight);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + i.qty };
        return copy;
      }
      return [...prev, i];
    });

  const remove: CartCtx["remove"] = (slug, weight) =>
    setItems((prev) => prev.filter((p) => !(p.slug === slug && p.weight === weight)));

  const setQty: CartCtx["setQty"] = (slug, weight, qty) =>
    setItems((prev) =>
      prev.map((p) =>
        p.slug === slug && p.weight === weight ? { ...p, qty: Math.max(1, qty) } : p,
      ),
    );

  const clear = () => setItems([]);
  const count = items.reduce((n, i) => n + i.qty, 0);
  const total = items.reduce((n, i) => n + i.qty * i.price, 0);

  return <Ctx.Provider value={{ items, add, remove, setQty, clear, count, total }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
