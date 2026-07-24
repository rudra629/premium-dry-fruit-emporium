import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Package, IndianRupee, TrendingUp, Users, Search, Plus, MoreHorizontal,
  ArrowUpRight, ArrowDownRight, Boxes, ShoppingCart, BarChart3, Trash2, Settings2, Megaphone, X, Briefcase, FileText, Download, Gift, Star, EyeOff, Eye,
} from "lucide-react";
import { toast } from "sonner";
import { products as baseProducts, type Product } from "@/lib/products";
import { useSite, type Order, type GiftBox, type GiftCategory } from "@/lib/site-store";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Grams" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

type Section = "dashboard" | "products" | "add" | "orders" | "customers" | "careers" | "gifting" | "reviews" | "settings";


function Admin() {
  const [section, setSection] = useState<Section>("dashboard");

  return (
    <div className="bg-muted/40 min-h-screen">
      <div className="container-x py-6 md:py-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 mb-6 md:mb-8 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs tracking-[0.3em] uppercase text-gold">Grams · Admin</p>
            <h1 className="truncate font-display text-3xl md:text-5xl text-forest-deep">Command Center</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input placeholder="Search…" className="bg-transparent outline-none text-sm w-40" />
            </div>
            <div className="w-10 h-10 rounded-full bg-forest-deep text-gold grid place-items-center font-semibold text-sm shrink-0">AS</div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
          {([
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            { id: "products", label: "Products", icon: Boxes },
            { id: "add", label: "Add Product", icon: Plus },
            { id: "orders", label: "Orders", icon: ShoppingCart },
            { id: "customers", label: "Customers", icon: Users },
            { id: "gifting", label: "Gifting", icon: Gift },
            { id: "reviews", label: "Reviews", icon: Star },
            { id: "careers", label: "Careers", icon: Briefcase },
            { id: "settings", label: "Site Settings", icon: Settings2 },
          ] as { id: Section; label: string; icon: React.ComponentType<{ className?: string }> }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setSection(t.id)}
              className={`shrink-0 inline-flex items-center gap-2 rounded-full px-4 md:px-5 py-2.5 text-sm font-medium transition ${section === t.id ? "bg-forest-deep text-cream" : "bg-card border border-border hover:bg-muted"}`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {section === "dashboard" && <Dashboard />}
        {section === "products" && <ProductsTable />}
        {section === "add" && <AddProductForm />}
        {section === "orders" && <OrdersTable />}
        {section === "customers" && <CustomersTable />}
        {section === "gifting" && <GiftingManager />}
        {section === "reviews" && <ReviewsManager />}
        {section === "careers" && <CareersTable />}
        {section === "settings" && <SiteSettings />}
      </div>
    </div>
  );
}


function Dashboard() {
  const { orders } = useSite();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <KPI title="Revenue" value="₹4,82,340" delta="+12.4%" up icon={IndianRupee} />
        <KPI title="Orders" value={String(orders.length + 1279)} delta="+8.1%" up icon={Package} />
        <KPI title="New customers" value="342" delta="+22%" up icon={Users} />
        <KPI title="Refunds" value="₹4,120" delta="−2.3%" up={false} icon={TrendingUp} />
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="rounded-2xl bg-card border border-border p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display text-xl md:text-2xl text-forest-deep">Sales this month</p>
              <p className="text-sm text-muted-foreground">₹4,82,340 · +12.4% vs last month</p>
            </div>
            <select className="rounded-full bg-muted border border-border px-4 py-2 text-sm">
              <option>Last 30 days</option><option>Last 7 days</option><option>Last 90 days</option>
            </select>
          </div>
          <MiniChart />
        </div>

        <div className="rounded-2xl bg-forest-deep text-cream p-6">
          <p className="font-display text-2xl">Top products</p>
          <div className="mt-4 space-y-3">
            {baseProducts.slice(0, 5).map((p, i) => (
              <div key={p.slug} className="flex items-center gap-3">
                <span className="w-6 text-gold font-display text-lg shrink-0">0{i + 1}</span>
                <img src={p.image} alt="" className="w-9 h-11 object-contain shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{p.name}</p>
                  <p className="text-xs text-cream/60">{Math.round(400 - i * 47)} sold</p>
                </div>
                <p className="text-sm text-gold font-semibold shrink-0">₹{(p.price * (400 - i * 47)).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="font-display text-xl md:text-2xl text-forest-deep">Recent orders</p>
        </div>
        <OrdersTable compact />
      </div>
    </div>
  );
}

function KPI({ title, value, delta, up, icon: Icon }: { title: string; value: string; delta: string; up: boolean; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-4 md:p-6">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs md:text-sm text-muted-foreground truncate">{title}</p>
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-forest-deep text-gold grid place-items-center shrink-0"><Icon className="w-4 h-4" /></div>
      </div>
      <p className="mt-3 font-display text-2xl md:text-3xl text-forest-deep truncate">{value}</p>
      <div className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${up ? "text-forest" : "text-terracotta"}`}>
        {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {delta}
      </div>
    </div>
  );
}

function MiniChart() {
  const bars = [42, 58, 46, 72, 60, 88, 74, 92, 80, 96, 84, 108];
  const max = Math.max(...bars);
  return (
    <div className="mt-6 flex items-end gap-1.5 md:gap-2 h-32 md:h-40">
      {bars.map((v, i) => (
        <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-forest-deep to-gold" style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  );
}

function ProductsTable() {
  const { extraProducts, removeProduct } = useSite();
  const rows = [...extraProducts, ...baseProducts];
  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      <div className="flex items-center justify-between p-5 md:p-6 flex-wrap gap-3">
        <div>
          <p className="font-display text-xl md:text-2xl text-forest-deep">Products</p>
          <p className="text-sm text-muted-foreground">{rows.length} SKUs in catalog</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-muted/60 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Stock</th>
              <th className="text-left p-4">Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => {
              const stock = 100 - i * 6;
              const isCustom = extraProducts.some((x) => x.slug === p.slug);
              return (
                <tr key={p.slug} className="border-t border-border">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="w-10 h-12 object-contain shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold truncate flex items-center gap-2">
                          {p.name}
                          {isCustom && <span className="text-[9px] font-bold uppercase tracking-widest bg-gold text-forest-deep px-1.5 py-0.5 rounded">Custom</span>}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{p.category}</td>
                  <td className="p-4 font-semibold">₹{p.price}</td>
                  <td className="p-4">
                    <span className={stock < 30 ? "text-terracotta font-semibold" : "text-muted-foreground"}>{stock} units</span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-forest-deep text-gold">Active</span>
                  </td>
                  <td className="p-4 text-right">
                    {isCustom ? (
                      <button onClick={() => { removeProduct(p.slug); toast.success("Product removed"); }} className="text-muted-foreground hover:text-terracotta">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <MoreHorizontal className="w-4 h-4 inline text-muted-foreground" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddProductForm() {
  const { addProduct } = useSite();
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState<Product["category"]>("Nuts");
  const [price, setPrice] = useState(0);
  const [compareAt, setCompareAt] = useState(0);
  const [rating, setRating] = useState(4.8);
  const [reviews, setReviews] = useState(100);
  const [origin, setOrigin] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [badges, setBadges] = useState<string[]>([]);
  const [badgeInput, setBadgeInput] = useState("");
  const [weights, setWeights] = useState([{ label: "250g", value: "250", price: 0 }]);
  const [slides, setSlides] = useState<{ image: string; title: string; description: string }[]>([]);
  const [nutrition, setNutrition] = useState([
    { label: "Protein", value: "" },
    { label: "Fibre", value: "" },
    { label: "Omega-3", value: "" },
    { label: "Energy", value: "" },
  ]);


  const addBadge = () => {
    if (badgeInput.trim()) { setBadges([...badges, badgeInput.trim()]); setBadgeInput(""); }
  };
  const rmBadge = (i: number) => setBadges(badges.filter((_, x) => x !== i));

  const addWeight = () => setWeights([...weights, { label: "", value: "", price: 0 }]);
  const rmWeight = (i: number) => setWeights(weights.filter((_, x) => x !== i));

  const handleImage = (file: File | null) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setImage(String(r.result));
    r.readAsDataURL(file);
  };

  const submit = () => {
    if (!name || !price || !image) { toast.error("Name, price and image are required"); return; }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Math.random().toString(36).slice(2, 6);
    const product: Product = {
      slug, name, tagline: tagline || name, category, price,
      compareAt: compareAt > price ? compareAt : undefined,
      rating, reviews, image,
      badges, description: description || tagline, origin: origin || "India",
      nutrition: nutrition.filter((n) => n.value),
      weights: weights.filter((w) => w.label && w.price > 0),
      bestseller, newArrival,
    };
    if (product.weights.length === 0) { toast.error("Add at least one weight/price"); return; }
    addProduct(product);
    toast.success(`${name} added to catalog`);
    // Reset
    setName(""); setTagline(""); setPrice(0); setCompareAt(0); setOrigin(""); setImage("");
    setDescription(""); setBadges([]); setWeights([{ label: "250g", value: "250", price: 0 }]);
    setBestseller(false); setNewArrival(false);
  };

  return (
    <div className="rounded-2xl bg-card border border-border p-5 md:p-8 space-y-6">
      <div>
        <p className="font-display text-2xl md:text-3xl text-forest-deep">Add a new product</p>
        <p className="text-sm text-muted-foreground">All fields flow directly into the shop and product detail page.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Product name *"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Almonds Premium" /></Field>
        <Field label="Category">
          <select value={category} onChange={(e) => setCategory(e.target.value as Product["category"])} className={inputCls}>
            <option>Nuts</option><option>Seeds</option><option>Dried Fruits</option>
          </select>
        </Field>
        <Field label="Subtitle / Tagline" full><input value={tagline} onChange={(e) => setTagline(e.target.value)} className={inputCls} placeholder="Sun-cured Californian almonds, hand-selected" /></Field>
        <Field label="Final price (₹) *"><input type="number" value={price || ""} onChange={(e) => setPrice(+e.target.value)} className={inputCls} /></Field>
        <Field label="Cancelled / MRP price (₹)"><input type="number" value={compareAt || ""} onChange={(e) => setCompareAt(+e.target.value)} className={inputCls} placeholder="Optional strike-through" /></Field>
        <Field label="Rating (0-5)"><input type="number" step="0.1" value={rating} onChange={(e) => setRating(+e.target.value)} className={inputCls} /></Field>
        <Field label="Number of reviews"><input type="number" value={reviews} onChange={(e) => setReviews(+e.target.value)} className={inputCls} /></Field>
        <Field label="Origin"><input value={origin} onChange={(e) => setOrigin(e.target.value)} className={inputCls} placeholder="California, USA" /></Field>
        <Field label="Product image *" full>
          <div className="flex items-center gap-3">
            <input type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0] ?? null)} className="text-sm" />
            {image && <img src={image} alt="" className="w-16 h-16 object-contain rounded-lg border border-border" />}
          </div>
        </Field>
      </div>

      {/* Tags */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Badges (Protein Rich, Omega-3, …)</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {badges.map((b, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs bg-muted rounded-full px-3 py-1.5 font-medium">
              ✦ {b}
              <button onClick={() => rmBadge(i)} className="text-muted-foreground hover:text-terracotta"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={badgeInput} onChange={(e) => setBadgeInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBadge())} placeholder="Protein Rich" className={inputCls} />
          <button onClick={addBadge} className="rounded-xl bg-forest-deep text-cream px-4 text-sm font-semibold shrink-0">Add</button>
        </div>
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-3">
        <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={bestseller} onChange={(e) => setBestseller(e.target.checked)} /> Bestseller</label>
        <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={newArrival} onChange={(e) => setNewArrival(e.target.checked)} /> New arrival</label>
      </div>

      {/* Weights */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Weight variants & pricing</p>
          <button onClick={addWeight} className="text-xs font-semibold text-forest-deep hover:text-terracotta inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Add row</button>
        </div>
        <div className="space-y-2">
          {weights.map((w, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
              <input value={w.label} onChange={(e) => setWeights(weights.map((x, ix) => ix === i ? { ...x, label: e.target.value } : x))} placeholder="250g" className={inputCls} />
              <input value={w.value} onChange={(e) => setWeights(weights.map((x, ix) => ix === i ? { ...x, value: e.target.value } : x))} placeholder="250" className={inputCls} />
              <input type="number" value={w.price || ""} onChange={(e) => setWeights(weights.map((x, ix) => ix === i ? { ...x, price: +e.target.value } : x))} placeholder="Price ₹" className={inputCls} />
              <button onClick={() => rmWeight(i)} className="w-11 h-11 grid place-items-center border border-border rounded-xl hover:text-terracotta"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Nutrition (Protein, Fibre, Omega, Energy…)</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {nutrition.map((n, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr] gap-2">
              <input value={n.label} onChange={(e) => setNutrition(nutrition.map((x, ix) => ix === i ? { ...x, label: e.target.value } : x))} className={inputCls} />
              <input value={n.value} onChange={(e) => setNutrition(nutrition.map((x, ix) => ix === i ? { ...x, value: e.target.value } : x))} placeholder="15g / 100g" className={inputCls} />
            </div>
          ))}
        </div>
        <button onClick={() => setNutrition([...nutrition, { label: "", value: "" }])} className="mt-2 text-xs font-semibold text-forest-deep hover:text-terracotta inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Add nutrient</button>
      </div>

      {/* Description */}
      <Field label="The Story / Description" full>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className={inputCls} placeholder="Slow-cured, hand-picked and packed within 14 days of harvest…" />
      </Field>

      <div className="flex gap-3">
        <button onClick={submit} className="rounded-full bg-forest-deep text-cream px-7 py-3.5 text-sm font-semibold hover:bg-forest transition inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Save product
        </button>
      </div>
    </div>
  );
}

const inputCls = "rounded-xl border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-forest-deep w-full";

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`flex flex-col ${full ? "md:col-span-2" : ""}`}>
      <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{label}</label>
      {children}
    </div>
  );
}

function OrdersTable({ compact }: { compact?: boolean }) {
  const { orders, updateOrderStatus } = useSite();
  const list = compact ? orders.slice(0, 6) : orders;
  const statuses: Order["status"][] = ["Processing", "Shipped", "Delivered", "Cancelled"];
  return (
    <div className={compact ? "" : "rounded-2xl bg-card border border-border overflow-hidden"}>
      {!compact && (
        <div className="p-5 md:p-6">
          <p className="font-display text-xl md:text-2xl text-forest-deep">Orders</p>
          <p className="text-sm text-muted-foreground">{orders.length} total · change status inline</p>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-muted/60 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left p-4">Order</th>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="border-t border-border">
                <td className="p-4 font-semibold">{o.id}</td>
                <td className="p-4">
                  <p className="font-semibold">{o.customer}</p>
                  <p className="text-xs text-muted-foreground">{o.email}</p>
                </td>
                <td className="p-4 font-semibold">₹{o.total}</td>
                <td className="p-4">
                  <select
                    value={o.status}
                    onChange={(e) => { updateOrderStatus(o.id, e.target.value as Order["status"]); toast.success(`${o.id} → ${e.target.value}`); }}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border-0 outline-none cursor-pointer ${
                      o.status === "Delivered" ? "bg-forest-deep text-gold" :
                      o.status === "Shipped" ? "bg-gold text-forest-deep" :
                      o.status === "Cancelled" ? "bg-destructive/10 text-terracotta" :
                      "bg-muted text-forest-deep"
                    }`}
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4 text-muted-foreground">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CustomersTable() {
  const customers = [
    { name: "Aanya Sharma", email: "aanya@grams.snack", orders: 12, spend: 8240, tier: "Silver" },
    { name: "Kabir Singh", email: "kabir@x.com", orders: 8, spend: 5199, tier: "Silver" },
    { name: "Meera Patel", email: "meera@x.com", orders: 24, spend: 18500, tier: "Gold" },
    { name: "Ishaan Rao", email: "ishaan@x.com", orders: 4, spend: 1849, tier: "Bronze" },
    { name: "Riya Mehta", email: "riya@x.com", orders: 15, spend: 11200, tier: "Gold" },
  ];
  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      <div className="p-5 md:p-6">
        <p className="font-display text-xl md:text-2xl text-forest-deep">Customers</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead className="bg-muted/60 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Orders</th>
              <th className="text-left p-4">Lifetime spend</th>
              <th className="text-left p-4">Tier</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.email} className="border-t border-border">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-forest-deep text-gold grid place-items-center text-xs font-semibold shrink-0">
                      {c.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-semibold">{c.orders}</td>
                <td className="p-4 font-semibold">₹{c.spend.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    c.tier === "Gold" ? "bg-gold text-forest-deep" :
                    c.tier === "Silver" ? "bg-muted text-forest-deep" :
                    "bg-terracotta/20 text-terracotta"
                  }`}>{c.tier}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SiteSettings() {
  const { bannerWords, setBannerWords } = useSite();
  const [words, setWords] = useState<string[]>(bannerWords);
  const [draft, setDraft] = useState("");

  const save = () => { setBannerWords(words); toast.success("Home banner updated"); };
  const add = () => { if (draft.trim()) { setWords([...words, draft.trim()]); setDraft(""); } };
  const rm = (i: number) => setWords(words.filter((_, x) => x !== i));

  return (
    <div className="rounded-2xl bg-card border border-border p-5 md:p-8 space-y-6 max-w-3xl">
      <div className="flex items-center gap-2">
        <Megaphone className="w-5 h-5 text-forest-deep" />
        <p className="font-display text-2xl md:text-3xl text-forest-deep">Home yellow banner</p>
      </div>
      <p className="text-sm text-muted-foreground -mt-4">The scrolling gold marquee under the hero. Edit each phrase — they cycle in order.</p>

      {/* Preview */}
      <div className="bg-gold text-forest-deep py-3 overflow-hidden rounded-xl">
        <div className="flex whitespace-nowrap marquee-track font-display text-xl italic">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10 pr-10">
              {words.map((w, j) => (<span key={j} className="flex items-center gap-10">{w} <span className="text-forest-deep/40">✦</span></span>))}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {words.map((w, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto] gap-2">
            <input value={w} onChange={(e) => setWords(words.map((x, ix) => ix === i ? e.target.value : x))} className={inputCls} />
            <button onClick={() => rm(i)} className="w-11 h-11 grid place-items-center border border-border rounded-xl hover:text-terracotta"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())} placeholder="New phrase…" className={inputCls} />
        <button onClick={add} className="rounded-xl bg-muted border border-border px-4 text-sm font-semibold shrink-0 inline-flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
      </div>

      <button onClick={save} className="rounded-full bg-forest-deep text-cream px-7 py-3.5 text-sm font-semibold hover:bg-forest transition">
        Save banner
      </button>
    </div>
  );
}

function CareersTable() {
  const { applications, removeApplication } = useSite();

  return (
    <div className="rounded-2xl bg-card border border-border p-5 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-display text-2xl md:text-3xl text-forest-deep">Job applications</p>
          <p className="text-sm text-muted-foreground">{applications.length} submission{applications.length === 1 ? "" : "s"} from the Careers page.</p>
        </div>
        <div className="hidden md:flex w-10 h-10 rounded-full bg-forest-deep/10 items-center justify-center">
          <Briefcase className="w-5 h-5 text-forest-deep" />
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-xl bg-muted/50 border border-dashed border-border p-10 text-center">
          <Briefcase className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-forest-deep">No applications yet</p>
          <p className="text-sm text-muted-foreground mt-1">Submissions from /careers will land here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((a) => (
            <div key={a.id} className="rounded-xl bg-muted/40 border border-border p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="font-semibold text-forest-deep truncate">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.date}</p>
                </div>
                <a href={`mailto:${a.email}`} className="text-sm text-forest-deep/80 hover:text-forest-deep transition break-all">{a.email}</a>
                {a.message && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{a.message}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={a.resumeDataUrl}
                  download={a.resumeName}
                  className="inline-flex items-center gap-2 rounded-full bg-forest-deep text-cream px-4 py-2 text-xs font-semibold hover:bg-forest transition"
                >
                  <Download className="w-3.5 h-3.5" /> Resume
                </a>
                <a
                  href={a.resumeDataUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-muted border border-border px-4 py-2 text-xs font-semibold hover:bg-card transition"
                >
                  <FileText className="w-3.5 h-3.5" /> View
                </a>
                <button
                  onClick={() => { if (confirm("Remove this application?")) removeApplication(a.id); }}
                  className="w-9 h-9 rounded-full bg-muted border border-border hover:bg-destructive/10 hover:text-destructive grid place-items-center transition"
                  aria-label="Delete application"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GiftingManager() {
  const { giftBoxes, addGiftBox, updateGiftBox, removeGiftBox } = useSite();
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState<GiftCategory>("Corporate");
  const [price, setPrice] = useState(0);
  const [compareAt, setCompareAt] = useState(0);
  const [image, setImage] = useState("");
  const [contents, setContents] = useState("");
  const [description, setDescription] = useState("");

  const onImage = (f: File | null) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setImage(String(r.result));
    r.readAsDataURL(f);
  };
  const submit = () => {
    if (!name || !price || !image) { toast.error("Name, price, image required"); return; }
    addGiftBox({
      category, name, tagline: tagline || name, price,
      compareAt: compareAt > price ? compareAt : undefined,
      image, contents: contents.split("\n").map((s) => s.trim()).filter(Boolean),
      description: description || tagline,
    });
    toast.success(`${name} added to Gifting`);
    setName(""); setTagline(""); setPrice(0); setCompareAt(0); setImage(""); setContents(""); setDescription("");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-card border border-border p-5 md:p-8 space-y-4">
        <p className="font-display text-2xl md:text-3xl text-forest-deep">Add a gift box</p>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Box name *"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} /></Field>
          <Field label="Category">
            <select value={category} onChange={(e) => setCategory(e.target.value as GiftCategory)} className={inputCls}>
              <option>Corporate</option><option>Birthday</option><option>Festive</option>
            </select>
          </Field>
          <Field label="Tagline" full><input value={tagline} onChange={(e) => setTagline(e.target.value)} className={inputCls} /></Field>
          <Field label="Price (₹) *"><input type="number" value={price || ""} onChange={(e) => setPrice(+e.target.value)} className={inputCls} /></Field>
          <Field label="MRP / compare-at (₹)"><input type="number" value={compareAt || ""} onChange={(e) => setCompareAt(+e.target.value)} className={inputCls} /></Field>
          <Field label="Contents (one per line)" full>
            <textarea value={contents} onChange={(e) => setContents(e.target.value)} rows={4} className={inputCls} placeholder="Walnut 250g\nMacadamia 200g\nGold foil card" />
          </Field>
          <Field label="Description" full>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputCls} />
          </Field>
          <Field label="Cover image *" full>
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" onChange={(e) => onImage(e.target.files?.[0] ?? null)} className="text-sm" />
              {image && <img src={image} alt="" className="w-16 h-16 object-contain rounded-lg border border-border" />}
            </div>
          </Field>
        </div>
        <button onClick={submit} className="rounded-full bg-forest-deep text-cream px-6 py-3 text-sm font-semibold hover:bg-forest transition">Publish gift box</button>
      </div>

      <div className="rounded-2xl bg-card border border-border p-5 md:p-6">
        <p className="font-display text-2xl text-forest-deep mb-4">Existing boxes ({giftBoxes.length})</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {giftBoxes.map((g) => (
            <div key={g.id} className="rounded-xl border border-border p-4 flex gap-3">
              <img src={g.image} alt="" className="w-16 h-20 object-contain shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] tracking-widest uppercase text-gold">{g.category}</p>
                <p className="font-semibold text-forest-deep truncate">{g.name}</p>
                <p className="text-xs text-muted-foreground truncate">₹{g.price}{g.compareAt ? ` · was ₹${g.compareAt}` : ""}</p>
                <div className="mt-2 flex gap-1.5">
                  <select
                    value={g.category}
                    onChange={(e) => updateGiftBox(g.id, { category: e.target.value as GiftCategory })}
                    className="text-[11px] rounded-full bg-muted px-2 py-1 border border-border"
                  >
                    <option>Corporate</option><option>Birthday</option><option>Festive</option>
                  </select>
                  <button onClick={() => { if (confirm("Delete box?")) removeGiftBox(g.id); }} className="text-muted-foreground hover:text-terracotta"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewsManager() {
  const { reviews, allProducts, toggleReviewHidden, removeReview } = useSite();
  const nameOf = (slug: string) => allProducts.find((p) => p.slug === slug)?.name ?? slug;

  return (
    <div className="rounded-2xl bg-card border border-border p-5 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-display text-2xl md:text-3xl text-forest-deep">Ratings & Reviews</p>
          <p className="text-sm text-muted-foreground">{reviews.length} submitted from customers post-delivery.</p>
        </div>
      </div>
      {reviews.length === 0 ? (
        <div className="rounded-xl bg-muted/50 border border-dashed border-border p-10 text-center">
          <Star className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-forest-deep">No reviews yet</p>
          <p className="text-sm text-muted-foreground mt-1">Reviews submitted after delivery will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className={`rounded-xl border p-4 flex flex-col md:flex-row md:items-start gap-3 ${r.hidden ? "bg-muted/40 border-dashed" : "bg-card border-border"}`}>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-gold">{nameOf(r.productSlug)}</span>
                  <span className="text-xs text-muted-foreground">· {r.date}</span>
                  <span className="text-xs text-muted-foreground">· Order {r.orderId}</span>
                  {r.hidden && <span className="text-[10px] uppercase tracking-widest text-terracotta">Hidden</span>}
                </div>
                <div className="mt-1.5 flex items-center gap-1 text-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-gold" : ""}`} />)}
                  <span className="ml-2 text-sm font-semibold text-forest-deep">{r.user}</span>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{r.text}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleReviewHidden(r.id)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-muted border border-border px-3 py-1.5 text-xs font-semibold hover:bg-card transition"
                >
                  {r.hidden ? <><Eye className="w-3.5 h-3.5" /> Show</> : <><EyeOff className="w-3.5 h-3.5" /> Hide</>}
                </button>
                <button
                  onClick={() => { if (confirm("Delete review?")) removeReview(r.id); }}
                  className="w-9 h-9 rounded-full bg-muted border border-border hover:bg-destructive/10 hover:text-destructive grid place-items-center transition"
                  aria-label="Delete review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

