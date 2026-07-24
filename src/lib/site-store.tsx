import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products as baseProducts, type Product, type ProductSlide } from "./products";

export type Address = {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  label?: string;
};

export type Order = {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
  items?: { name: string; qty: number; weight: string; price: number; slug?: string }[];
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

export type GiftCategory = "Corporate" | "Birthday" | "Festive";

export type GiftBox = {
  id: string;
  category: GiftCategory;
  name: string;
  tagline: string;
  price: number;
  compareAt?: number;
  image: string;
  contents: string[];
  description: string;
};

export type Review = {
  id: string;
  productSlug: string;
  orderId: string;
  user: string;
  rating: number;
  text: string;
  date: string;
  hidden?: boolean;
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
  giftBoxes: GiftBox[];
  addGiftBox: (g: Omit<GiftBox, "id">) => void;
  updateGiftBox: (id: string, patch: Partial<GiftBox>) => void;
  removeGiftBox: (id: string) => void;
  reviews: Review[];
  addReview: (r: Omit<Review, "id" | "date">) => void;
  toggleReviewHidden: (id: string) => void;
  removeReview: (id: string) => void;
  productSlides: Record<string, ProductSlide[]>;
  setProductSlides: (slug: string, slides: ProductSlide[]) => void;
};

const Ctx = createContext<SiteCtx | null>(null);

const DEFAULT_BANNER = [
  "Freshly Packed",
  "Small Batch",
  "No Preservatives",
  "Direct from Farms",
  "Vacuum Sealed",
  "Traceable Origins",
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

const DEFAULT_GIFT_BOXES: GiftBox[] = [
  {
    id: "g1",
    category: "Corporate",
    name: "The Boardroom Reserve",
    tagline: "A statement gift for clients & teams.",
    price: 2499,
    compareAt: 2999,
    image: baseProducts[3].image,
    contents: ["Macadamia Halves 250g", "Walnut Whole 250g", "Pecan Halves 200g", "Hand-numbered card"],
    description: "Matte black rigid box, magnetic close, gold foil monogram. Ships gift-wrapped, no invoice inside.",
  },
  {
    id: "g2",
    category: "Corporate",
    name: "Deskside Ritual",
    tagline: "Because Zoom fatigue is real.",
    price: 1499,
    image: baseProducts[5].image,
    contents: ["Pumpkin Seeds 200g", "Sunflower Kernels 200g", "Dried Cranberries 150g"],
    description: "The quiet flex for your favourite colleague. Slim slate box with embossed foil.",
  },
  {
    id: "g3",
    category: "Birthday",
    name: "Birthday Reset",
    tagline: "Better than another candle.",
    price: 1899,
    compareAt: 2299,
    image: baseProducts[6].image,
    contents: ["Dried Mango 200g", "Dried Kiwi 150g", "Dried Pineapple 200g", "Personalised note"],
    description: "Neon birthday sleeve over an obsidian box. Fully personalised message strip.",
  },
  {
    id: "g4",
    category: "Birthday",
    name: "The Sweet Sixteen",
    tagline: "A little chaos, a lot of crunch.",
    price: 1299,
    image: baseProducts[7].image,
    contents: ["Dried Mango 150g", "Cranberries 150g", "Hazelnuts 150g"],
    description: "Bright chrome-stripe pouch tucked into a jet black gift tin.",
  },
  {
    id: "g5",
    category: "Festive",
    name: "Diwali Noir",
    tagline: "Festive lights. Darker box. Louder gift.",
    price: 3499,
    compareAt: 3999,
    image: baseProducts[0].image,
    contents: ["Walnut 250g", "Macadamia 200g", "Pecan 200g", "Cranberries 200g", "Brass tealight"],
    description: "Two-tier lacquered box, brass tealight and a hand-numbered festive card. Bulk pricing available.",
  },
  {
    id: "g6",
    category: "Festive",
    name: "Rakhi Ritual Box",
    tagline: "A modern take on the classic thali.",
    price: 1699,
    image: baseProducts[6].image,
    contents: ["Dried Mango 200g", "Cashew 150g equivalent", "Handmade rakhi", "Roli & chawal"],
    description: "Slim charcoal box, silk-tied rakhi, minimal typography.",
  },
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
  const [giftBoxes, setGiftBoxes] = useState<GiftBox[]>(DEFAULT_GIFT_BOXES);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [productSlides, setProductSlidesState] = useState<Record<string, ProductSlide[]>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setExtra(load("grams:extra-products", [] as Product[]));
    setOrders(load("grams:orders", DEFAULT_ORDERS));
    setAddresses(load("grams:addresses", DEFAULT_ADDRESSES));
    setBannerWordsState(load("grams:banner", DEFAULT_BANNER));
    setApplications(load("grams:applications", [] as Application[]));
    setGiftBoxes(load("grams:gift-boxes", DEFAULT_GIFT_BOXES));
    setReviews(load("grams:reviews", [] as Review[]));
    setProductSlidesState(load("grams:product-slides", {} as Record<string, ProductSlide[]>));
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem("grams:extra-products", JSON.stringify(extraProducts)); }, [extraProducts, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:orders", JSON.stringify(orders)); }, [orders, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:addresses", JSON.stringify(addresses)); }, [addresses, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:banner", JSON.stringify(bannerWords)); }, [bannerWords, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:applications", JSON.stringify(applications)); }, [applications, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:gift-boxes", JSON.stringify(giftBoxes)); }, [giftBoxes, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:reviews", JSON.stringify(reviews)); }, [reviews, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:product-slides", JSON.stringify(productSlides)); }, [productSlides, hydrated]);

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
    giftBoxes,
    addGiftBox: (g) => setGiftBoxes((prev) => [{ ...g, id: `gb_${Date.now()}` }, ...prev]),
    updateGiftBox: (id, patch) => setGiftBoxes((prev) => prev.map((g) => g.id === id ? { ...g, ...patch } : g)),
    removeGiftBox: (id) => setGiftBoxes((prev) => prev.filter((g) => g.id !== id)),
    reviews,
    addReview: (r) => setReviews((prev) => [{ ...r, id: `rev_${Date.now()}`, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }, ...prev]),
    toggleReviewHidden: (id) => setReviews((prev) => prev.map((r) => r.id === id ? { ...r, hidden: !r.hidden } : r)),
    removeReview: (id) => setReviews((prev) => prev.filter((r) => r.id !== id)),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSite() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSite must be used within SiteProvider");
  return c;
}
