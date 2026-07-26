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

export type SiteStat = { n: string; l: string };

export type MonthPick = {
  key: "Nuts" | "Seeds" | "Dried Fruits";
  slug: string;
  eyebrow: string;
  title: string;
  italic: string;
  desc: string;
};

export type ContactInfo = {
  emails: string[];
  phones: string[];
  address: string[];
  hours: string[];
};

export type CopyMap = Record<string, string>;

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
  stats: SiteStat[];
  setStats: (s: SiteStat[]) => void;
  monthPicks: MonthPick[];
  setMonthPicks: (m: MonthPick[]) => void;
  contact: ContactInfo;
  setContact: (c: ContactInfo) => void;
  copy: CopyMap;
  setCopy: (c: CopyMap) => void;
  t: (key: string) => string;
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

const DEFAULT_STATS: SiteStat[] = [
  { n: "12+", l: "Global origins" },
  { n: "47k", l: "Happy snackers" },
  { n: "98%", l: "Reorder rate" },
];

const DEFAULT_MONTH_PICKS: MonthPick[] = [
  {
    key: "Nuts",
    slug: "walnut-whole-california",
    eyebrow: "Nut of the month",
    title: "Walnut",
    italic: "Whole.",
    desc: "California-grown, hand-graded and shipped within 14 days of harvest.",
  },
  {
    key: "Seeds",
    slug: "pumpkin-seeds",
    eyebrow: "Seed of the month",
    title: "Pumpkin",
    italic: "Seeds.",
    desc: "Cold-dried, magnesium-dense and impossibly crunchy. Your 4pm fix.",
  },
  {
    key: "Dried Fruits",
    slug: "dried-mango",
    eyebrow: "Dry fruit of the month",
    title: "Dried",
    italic: "Mango.",
    desc: "Sun-ripened Alphonso slices with zero added sugar. Nature's candy.",
  },
];

const DEFAULT_CONTACT: ContactInfo = {
  emails: ["care@grams.snack", "wholesale@grams.snack"],
  phones: ["+91 98765 43210", "Mon–Sat · 10am–7pm IST"],
  address: ["Grams Foods Pvt. Ltd.", "42 Farm Lane, Bengaluru 560001"],
  hours: ["Under 24 hours", "Usually same day"],
};

export const COPY_FIELDS: { key: string; label: string; group: string }[] = [
  { key: "home.bestsellers.eyebrow", label: "Bestsellers — eyebrow", group: "Home" },
  { key: "home.bestsellers.title", label: "Bestsellers — title", group: "Home" },
  { key: "home.categories.eyebrow", label: "Categories — eyebrow", group: "Home" },
  { key: "home.categories.title", label: "Categories — title", group: "Home" },
  { key: "home.categories.titleItalic", label: "Categories — italic line", group: "Home" },
  { key: "home.new.eyebrow", label: "New arrivals — eyebrow", group: "Home" },
  { key: "home.new.title", label: "New arrivals — title", group: "Home" },
  { key: "home.ritual.eyebrow", label: "Ritual — eyebrow", group: "Home" },
  { key: "home.ritual.title", label: "Ritual — title", group: "Home" },
  { key: "home.ritual.titleItalic", label: "Ritual — italic line", group: "Home" },
  { key: "home.testimonials.eyebrow", label: "Testimonials — eyebrow", group: "Home" },
  { key: "home.testimonials.title", label: "Testimonials — title", group: "Home" },
  { key: "home.newsletter.eyebrow", label: "Newsletter — eyebrow", group: "Home" },
  { key: "shop.eyebrow", label: "Shop — eyebrow", group: "Shop" },
  { key: "shop.title", label: "Shop — title", group: "Shop" },
  { key: "shop.subtitle", label: "Shop — subtitle", group: "Shop" },
  { key: "contact.eyebrow", label: "Contact — eyebrow", group: "Contact" },
  { key: "contact.title", label: "Contact — title", group: "Contact" },
  { key: "contact.titleItalic", label: "Contact — italic line", group: "Contact" },
  { key: "contact.subtitle", label: "Contact — subtitle", group: "Contact" },
  { key: "chat.trigger", label: "Chatbot — button label", group: "Chatbot" },
  { key: "chat.name", label: "Chatbot — name", group: "Chatbot" },
  { key: "chat.greeting", label: "Chatbot — greeting", group: "Chatbot" },
];

const DEFAULT_COPY: CopyMap = {
  "home.bestsellers.eyebrow": "Loved by many",
  "home.bestsellers.title": "The Bestsellers",
  "home.categories.eyebrow": "Categories",
  "home.categories.title": "Pick your poison",
  "home.categories.titleItalic": "(the healthy kind).",
  "home.new.eyebrow": "Fresh off the shelf",
  "home.new.title": "New Arrivals",
  "home.ritual.eyebrow": "The Grams Ritual",
  "home.ritual.title": "A tiny bowl.",
  "home.ritual.titleItalic": "A giant reset.",
  "home.testimonials.eyebrow": "Word on the street",
  "home.testimonials.title": "Snacked & Approved",
  "home.newsletter.eyebrow": "Join the pantry",
  "shop.eyebrow": "The Collection",
  "shop.title": "Invest In Your health.",
  "shop.subtitle": "Ten obsessively-sourced snacks. Sort, filter, and add the good stuff to your pantry.",
  "contact.eyebrow": "Say hi",
  "contact.title": "Let's",
  "contact.titleItalic": "talk snacks.",
  "contact.subtitle": "Questions, bulk orders, collabs, complaints (rare, but valid) — hit us up. We reply within 24 hours, usually much sooner.",
  "chat.trigger": "Ask the wellness guide",
  "chat.name": "Wellness Guide",
  "chat.greeting": "Hey — I'm your Grams wellness guide. What health or daily issue are you facing?",
};


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
  const [stats, setStatsState] = useState<SiteStat[]>(DEFAULT_STATS);
  const [monthPicks, setMonthPicksState] = useState<MonthPick[]>(DEFAULT_MONTH_PICKS);
  const [contact, setContactState] = useState<ContactInfo>(DEFAULT_CONTACT);
  const [copy, setCopyState] = useState<CopyMap>(DEFAULT_COPY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setExtra(load("grams:extra-products", [] as Product[]));
    setOrders(load("grams:orders", DEFAULT_ORDERS));
    setAddresses(load("grams:addresses", DEFAULT_ADDRESSES));
    setBannerWordsState(load("grams:banner", DEFAULT_BANNER));
    setApplications(load("grams:applications", [] as Application[]));
    setGiftBoxes(load("grams:gift-boxes", DEFAULT_GIFT_BOXES));
    setReviews(load("grams:reviews", [] as Review[]));
    setStatsState(load("grams:stats", DEFAULT_STATS));
    setMonthPicksState(load("grams:month-picks", DEFAULT_MONTH_PICKS));
    setContactState(load("grams:contact", DEFAULT_CONTACT));
    setCopyState({ ...DEFAULT_COPY, ...load("grams:copy", {} as CopyMap) });
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem("grams:extra-products", JSON.stringify(extraProducts)); }, [extraProducts, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:orders", JSON.stringify(orders)); }, [orders, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:addresses", JSON.stringify(addresses)); }, [addresses, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:banner", JSON.stringify(bannerWords)); }, [bannerWords, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:applications", JSON.stringify(applications)); }, [applications, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:gift-boxes", JSON.stringify(giftBoxes)); }, [giftBoxes, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:reviews", JSON.stringify(reviews)); }, [reviews, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:stats", JSON.stringify(stats)); }, [stats, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:month-picks", JSON.stringify(monthPicks)); }, [monthPicks, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:contact", JSON.stringify(contact)); }, [contact, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:copy", JSON.stringify(copy)); }, [copy, hydrated]);


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
    stats,
    setStats: setStatsState,
    monthPicks,
    setMonthPicks: setMonthPicksState,
    contact,
    setContact: setContactState,
    copy,
    setCopy: setCopyState,
    t: (key) => copy[key] ?? DEFAULT_COPY[key] ?? "",
  };


  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSite() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSite must be used within SiteProvider");
  return c;
}
