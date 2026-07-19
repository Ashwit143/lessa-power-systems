import type { Metadata } from "next";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

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
      {/* Actually, it's better to handle sidebar conditionally or let the login page not use this layout. 
          But since it's nested under /admin, it uses it. Let's let the Sidebar component handle its own visibility based on auth or pathname if needed, or we just leave it for now since login isn't explicitly hiding it here. 
          Wait, to hide it properly, we can check headers/cookies or make login a separate route group.
          For now, I'll remove the demo mode banner. */}
      <AdminSidebar />
      
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <div className="flex-1 lg:mt-0 mt-16">
          {children}
        </div>
      </main>
    </div>
  );
}
