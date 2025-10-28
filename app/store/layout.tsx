import AdminSidebar from "@/components/AdminSidebar";
import MobileSidebar from "@/components/MobileSidebar";
import { Bell, User } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin · Gold lifestyle",
  description: "Manage products and orders",
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-topbar">
          <div className="flex items-center gap-8">
            <div className="admin-topbar-mobile"><MobileSidebar /></div>
            <h1 className="text-[15px] font-light tracking-wider uppercase">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 flex items-center justify-center hover:bg-black/5 transition-colors">
              <Bell size={18} strokeWidth={1.5} color="rgba(0,0,0,0.6)" />
            </button>
            <button className="w-9 h-9 border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all">
              <User size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
        <section className="admin-content">{children}</section>
      </div>
    </div>
  );
}
