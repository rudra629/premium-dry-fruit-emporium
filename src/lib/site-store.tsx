import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products as baseProducts, type Product } from "./products";

export type Address = {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  label?: string; // Home / Work
};

export type Order = {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
  items?: { name: string; qty: number; weight: string; price: number }[];
};

export type Application = {
  id: string;
  name: string;
  email: string;
  resumeName: string;
  resumeDataUrl: string;
  message?: string;
  date: string;
};

export type PromoCode = {
  id: string;
  code: string;
  description: string;
  discountType: "percent" | "flat";
  discountValue: number;
  minOrder?: number;
  active: boolean;
};

type SiteCtx = {
  extraProducts: Product[];
  addProduct: (p: Product) => void;
  removeProduct: (slug: string) => void;
  allProducts: Product[];
  orders: Order[];
  addOrder: (o: Order) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  addresses: Address[];
  addAddress: (a: Omit<Address, "id">) => Address;
  removeAddress: (id: string) => void;
  bannerWords: string[];
  setBannerWords: (w: string[]) => void;
  applications: Application[];
  addApplication: (a: Omit<Application, "id" | "date">) => void;
  removeApplication: (id: string) => void;
  promoCodes: PromoCode[];
  addPromoCode: (p: Omit<PromoCode, "id">) => void;
  updatePromoCode: (id: string, patch: Partial<PromoCode>) => void;
  removePromoCode: (id: string) => void;
};

const Ctx = createContext<SiteCtx | null>(null);

const DEFAULT_BANNER = [
  "Freshly Packed",
  "Small Batch",
  "No Preservatives",
  "Direct from Farms",
  "Vacuum Sealed",
  "Traceable Origins",
const DEFAULT_ADDRESSES: Address[] = [
  { id: "a1", name: "Aanya Sharma", phone: "+91 98765 43210", line1: "12, Palm Grove Apartments", line2: "Linking Road", city: "Mumbai", state: "MH", pincode: "400050", label: "Home" },
  { id: "a2", name: "Aanya Sharma", phone: "+91 98765 43210", line1: "Nexus Coworking, 4th Floor", city: "Mumbai", state: "MH", pincode: "400013", label: "Work" },
];

const DEFAULT_PROMOS: PromoCode[] = [
  { id: "p1", code: "WELCOME10", description: "10% off first order", discountType: "percent", discountValue: 10, minOrder: 499, active: true },
  { id: "p2", code: "CRUNCH200", description: "Flat ₹200 off above ₹1499", discountType: "flat", discountValue: 200, minOrder: 1499, active: true },
  { id: "p3", code: "GENZ15", description: "15% off for the Gen-Z pantry", discountType: "percent", discountValue: 15, active: false },
];

const DEFAULT_ORDERS: Order[] = [
  { id: "GRM-10428", customer: "Aanya Sharma", email: "aanya@grams.snack", total: 1249, status: "Delivered", date: "Jul 2" },
  { id: "GRM-10427", customer: "Kabir Singh", email: "kabir@x.com", total: 849, status: "Processing", date: "Jul 2" },
  { id: "GRM-10426", customer: "Meera Patel", email: "meera@x.com", total: 2098, status: "Shipped", date: "Jul 1" },
  { id: "GRM-10425", customer: "Ishaan Rao", email: "ishaan@x.com", total: 549, status: "Delivered", date: "Jul 1" },
  { id: "GRM-10424", customer: "Riya Mehta", email: "riya@x.com", total: 1499, status: "Cancelled", date: "Jun 30" },
];

const DEFAULT_ADDRESSES: Address[] = [
  { id: "a1", name: "Aanya Sharma", phone: "+91 98765 43210", line1: "12, Palm Grove Apartments", line2: "Linking Road", city: "Mumbai", state: "MH", pincode: "400050", label: "Home" },
  { id: "a2", name: "Aanya Sharma", phone: "+91 98765 43210", line1: "Nexus Coworking, 4th Floor", city: "Mumbai", state: "MH", pincode: "400013", label: "Work" },
];

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [extraProducts, setExtra] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>(DEFAULT_ORDERS);
  const [addresses, setAddresses] = useState<Address[]>(DEFAULT_ADDRESSES);
  const [bannerWords, setBannerWordsState] = useState<string[]>(DEFAULT_BANNER);
  const [applications, setApplications] = useState<Application[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setExtra(load("grams:extra-products", [] as Product[]));
    setOrders(load("grams:orders", DEFAULT_ORDERS));
    setAddresses(load("grams:addresses", DEFAULT_ADDRESSES));
    setBannerWordsState(load("grams:banner", DEFAULT_BANNER));
    setApplications(load("grams:applications", [] as Application[]));
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem("grams:extra-products", JSON.stringify(extraProducts)); }, [extraProducts, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:orders", JSON.stringify(orders)); }, [orders, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:addresses", JSON.stringify(addresses)); }, [addresses, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:banner", JSON.stringify(bannerWords)); }, [bannerWords, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:applications", JSON.stringify(applications)); }, [applications, hydrated]);

  const allProducts = useMemo(() => [...extraProducts, ...baseProducts], [extraProducts]);

  const value: SiteCtx = {
    extraProducts,
    addProduct: (p) => setExtra((prev) => [p, ...prev.filter((x) => x.slug !== p.slug)]),
    removeProduct: (slug) => setExtra((prev) => prev.filter((p) => p.slug !== slug)),
    allProducts,
    orders,
    addOrder: (o) => setOrders((prev) => [o, ...prev]),
    updateOrderStatus: (id, status) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o))),
    addresses,
    addAddress: (a) => {
      const full = { ...a, id: `addr_${Date.now()}` };
      setAddresses((prev) => [...prev, full]);
      return full;
    },
    removeAddress: (id) => setAddresses((prev) => prev.filter((a) => a.id !== id)),
    bannerWords,
    setBannerWords: setBannerWordsState,
    applications,
    addApplication: (a) => setApplications((prev) => [{ ...a, id: `app_${Date.now()}`, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }, ...prev]),
    removeApplication: (id) => setApplications((prev) => prev.filter((x) => x.id !== id)),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSite() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSite must be used within SiteProvider");
  return c;
}
