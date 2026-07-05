import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Package, IndianRupee, TrendingUp, Users, Search, Plus, MoreHorizontal, ArrowUpRight, ArrowDownRight, Boxes, ShoppingCart, BarChart3 } from "lucide-react";
import { products } from "@/lib/products";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Grams" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

type Section = "dashboard" | "products" | "orders" | "customers";

function Admin() {
  const [section, setSection] = useState<Section>("dashboard");

  return (
    <div className="bg-muted/40 min-h-screen">
      <div className="container-x py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold">Grams · Admin</p>
            <h1 className="font-display text-4xl md:text-5xl text-forest-deep">Command Center</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input placeholder="Search anything…" className="bg-transparent outline-none text-sm w-48" />
            </div>
            <div className="w-10 h-10 rounded-full bg-forest-deep text-gold grid place-items-center font-semibold text-sm">AS</div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {([
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            { id: "products", label: "Products", icon: Boxes },
            { id: "orders", label: "Orders", icon: ShoppingCart },
            { id: "customers", label: "Customers", icon: Users },
          ] as { id: Section; label: string; icon: React.ComponentType<{ className?: string }> }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setSection(t.id)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${section === t.id ? "bg-forest-deep text-cream" : "bg-card border border-border hover:bg-muted"}`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {section === "dashboard" && <Dashboard />}
        {section === "products" && <ProductsTable />}
        {section === "orders" && <OrdersTable />}
        {section === "customers" && <CustomersTable />}
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <KPI title="Revenue" value="₹4,82,340" delta="+12.4%" up icon={IndianRupee} />
        <KPI title="Orders" value="1,284" delta="+8.1%" up icon={Package} />
        <KPI title="New customers" value="342" delta="+22%" up icon={Users} />
        <KPI title="Refunds" value="₹4,120" delta="−2.3%" up={false} icon={TrendingUp} />
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="rounded-2xl bg-card border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-2xl text-forest-deep">Sales this month</p>
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
            {products.slice(0, 5).map((p, i) => (
              <div key={p.slug} className="flex items-center gap-3">
                <span className="w-6 text-gold font-display text-lg">0{i + 1}</span>
                <img src={p.image} alt="" className="w-9 h-11 object-contain" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{p.name}</p>
                  <p className="text-xs text-cream/60">{Math.round(400 - i * 47)} sold</p>
                </div>
                <p className="text-sm text-gold font-semibold">₹{(p.price * (400 - i * 47)).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="font-display text-2xl text-forest-deep">Recent orders</p>
          <button className="text-sm font-semibold text-forest-deep hover:text-terracotta">View all</button>
        </div>
        <OrdersTable compact />
      </div>
    </div>
  );
}

function KPI({ title, value, delta, up, icon: Icon }: { title: string; value: string; delta: string; up: boolean; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="w-9 h-9 rounded-full bg-forest-deep text-gold grid place-items-center"><Icon className="w-4 h-4" /></div>
      </div>
      <p className="mt-3 font-display text-3xl text-forest-deep">{value}</p>
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
    <div className="mt-6 flex items-end gap-2 h-40">
      {bars.map((v, i) => (
        <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-forest-deep to-gold" style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  );
}

function ProductsTable() {
  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      <div className="flex items-center justify-between p-6">
        <div>
          <p className="font-display text-2xl text-forest-deep">Products</p>
          <p className="text-sm text-muted-foreground">{products.length} SKUs in catalog</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-forest-deep text-cream px-5 py-2.5 text-sm font-semibold hover:bg-forest transition">
          <Plus className="w-4 h-4" /> Add product
        </button>
      </div>
      <table className="w-full text-sm">
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
          {products.map((p, i) => {
            const stock = 100 - i * 8;
            return (
              <tr key={p.slug} className="border-t border-border">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="w-10 h-12 object-contain" />
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{p.category}</td>
                <td className="p-4 font-semibold">₹{p.price}</td>
                <td className="p-4">
                  <span className={stock < 30 ? "text-terracotta font-semibold" : "text-muted-foreground"}>{stock} units</span>
                </td>
                <td className="p-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stock > 0 ? "bg-forest-deep text-gold" : "bg-muted"}`}>
                    {stock > 0 ? "Active" : "Out of stock"}
                  </span>
                </td>
                <td className="p-4 text-right"><MoreHorizontal className="w-4 h-4 inline text-muted-foreground" /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const adminOrders = [
  { id: "GRM-10428", customer: "Aanya Sharma", email: "aanya@grams.snack", total: 1249, status: "Delivered", date: "Jul 2" },
  { id: "GRM-10427", customer: "Kabir Singh", email: "kabir@x.com", total: 849, status: "Processing", date: "Jul 2" },
  { id: "GRM-10426", customer: "Meera Patel", email: "meera@x.com", total: 2098, status: "Shipped", date: "Jul 1" },
  { id: "GRM-10425", customer: "Ishaan Rao", email: "ishaan@x.com", total: 549, status: "Delivered", date: "Jul 1" },
  { id: "GRM-10424", customer: "Riya Mehta", email: "riya@x.com", total: 1499, status: "Cancelled", date: "Jun 30" },
];

function OrdersTable({ compact }: { compact?: boolean }) {
  return (
    <div className={compact ? "" : "rounded-2xl bg-card border border-border overflow-hidden"}>
      {!compact && (
        <div className="p-6">
          <p className="font-display text-2xl text-forest-deep">Orders</p>
          <p className="text-sm text-muted-foreground">1,284 total</p>
        </div>
      )}
      <table className="w-full text-sm">
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
          {adminOrders.map((o) => (
            <tr key={o.id} className="border-t border-border">
              <td className="p-4 font-semibold">{o.id}</td>
              <td className="p-4">
                <p className="font-semibold">{o.customer}</p>
                <p className="text-xs text-muted-foreground">{o.email}</p>
              </td>
              <td className="p-4 font-semibold">₹{o.total}</td>
              <td className="p-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  o.status === "Delivered" ? "bg-forest-deep text-gold" :
                  o.status === "Shipped" ? "bg-gold text-forest-deep" :
                  o.status === "Cancelled" ? "bg-destructive/10 text-terracotta" :
                  "bg-muted"
                }`}>{o.status}</span>
              </td>
              <td className="p-4 text-muted-foreground">{o.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
      <div className="p-6">
        <p className="font-display text-2xl text-forest-deep">Customers</p>
        <p className="text-sm text-muted-foreground">Top spenders this quarter</p>
      </div>
      <table className="w-full text-sm">
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
                  <div className="w-9 h-9 rounded-full bg-forest-deep text-gold grid place-items-center text-xs font-semibold">
                    {c.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
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
  );
}
