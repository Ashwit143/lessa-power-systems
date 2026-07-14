import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Home, Search, Battery, Zap, Sun, Package } from "lucide-react";
import { CATEGORIES } from "@/data/categories";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  battery: Battery,
  inverter: Zap,
  solar: Sun,
  combo: Package,
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <div className="max-w-lg text-center">
        {/* 404 illustration */}
        <div className="mb-6">
          <p className="text-8xl font-extrabold text-primary-100 leading-none">404</p>
          <div className="-mt-8 relative z-10">
            <div className="flex items-center justify-center w-16 h-16 bg-primary-700 rounded-xl mx-auto">
              <Zap className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-neutral-800 mb-3">Page Not Found</h1>
        <p className="text-neutral-600 mb-8">
          The page you're looking for doesn't exist or may have been moved. Browse our product categories or return home.
        </p>

        {/* Quick category links */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {CATEGORIES.filter((c) => c.isActive).map((cat) => {
            const Icon = CATEGORY_ICONS[cat.slug] ?? Zap;
            return (
              <Link
                key={cat.id}
                href={`/products/${cat.slug}`}
                className="flex items-center gap-2.5 p-3 bg-white border border-neutral-200 rounded-lg text-sm font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700 transition-colors text-left"
              >
                <Icon className="h-4 w-4 text-primary-600" aria-hidden="true" />
                {cat.name}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" asChild>
            <Link href="/">
              <Home className="h-4 w-4" aria-hidden="true" />
              Return Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products">Browse All Products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
