"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Image as ImageIcon, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  Zap
} from "lucide-react";
import { useState } from "react";
import { SITE_CONFIG } from "@/lib/config";
import { logout } from "@/app/admin/login/actions";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-700 rounded flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <span className="font-bold text-neutral-900">Admin</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 text-neutral-600 hover:text-neutral-900 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/50 z-40 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-white border-r border-neutral-200 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } lg:pt-0 pt-16`}
      >
        <div className="hidden lg:flex items-center gap-3 h-16 px-6 border-b border-neutral-200 shrink-0">
          <div className="w-8 h-8 bg-primary-700 rounded flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <div className="font-bold text-neutral-900 leading-tight">Admin Portal</div>
            <div className="text-xs text-neutral-500 truncate max-w-[150px]">{SITE_CONFIG.businessName}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-primary-700" : "text-neutral-400"}`} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-neutral-200 shrink-0">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-red-50 w-full transition-colors"
            >
              <LogOut className="h-5 w-5" aria-hidden="true" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
