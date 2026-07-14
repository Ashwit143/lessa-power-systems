import type { Metadata } from "next";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Admin Dashboard | Leesa Power Systems",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Sidebar - hidden on auth pages if we had one, but we'll show it everywhere for scaffolding */}
      <AdminSidebar />
      
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {!isSupabaseConfigured && (
          <div className="bg-amber-100 text-amber-800 px-4 py-2 text-sm font-medium text-center lg:mt-0 mt-16 border-b border-amber-200">
            Running in Demo Mode — Database disconnected. Changes will not be saved.
          </div>
        )}
        <div className="flex-1 lg:mt-0 mt-16">
          {children}
        </div>
      </main>
    </div>
  );
}
