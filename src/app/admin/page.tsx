import { Package, MessageSquare, Image as ImageIcon, Tags, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getAdminStats } from "@/services/admin.service";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      subtitle: `${stats.publishedProducts} published, ${stats.draftProducts} draft`,
      icon: Package,
      color: "bg-blue-50 text-blue-700",
      href: "/admin/products"
    },
    {
      title: "New Leads",
      value: stats.newLeads,
      subtitle: `${stats.totalLeads} total inquiries`,
      icon: MessageSquare,
      color: "bg-amber-50 text-amber-700",
      href: "/admin/leads"
    },
    {
      title: "Active Banners",
      value: stats.activeBanners,
      subtitle: `Out of ${stats.totalBanners} total banners`,
      icon: ImageIcon,
      color: "bg-emerald-50 text-emerald-700",
      href: "/admin/banners"
    },
    {
      title: "Categories",
      value: stats.categories,
      subtitle: "Active product categories",
      icon: Tags,
      color: "bg-purple-50 text-purple-700",
      href: "/admin/settings"
    }
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard Overview</h1>
          <p className="text-neutral-500 mt-1">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/products/new" 
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-primary-700 rounded-md hover:bg-primary-800 transition-colors"
          >
            Add Product
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-neutral-600">{card.title}</h2>
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
              <div className="mb-1">
                <span className="text-3xl font-bold text-neutral-900">{card.value}</span>
              </div>
              <p className="text-xs text-neutral-500 mb-4">{card.subtitle}</p>
              
              <Link 
                href={card.href}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors"
              >
                View Details <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-neutral-900">Recent Activity</h2>
        </div>
        <div className="p-12 text-center text-neutral-500">
          <p>Activity logging will be available when database is connected.</p>
        </div>
      </div>
    </div>
  );
}
