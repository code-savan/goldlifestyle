import AdminSidebar from "@/components/AdminSidebar";
import MobileSidebar from "@/components/MobileSidebar";
import UserMenu from "@/components/UserMenu";
import { getCurrentAdmin } from "@/lib/auth";
import { Bell } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Admin · Gold lifestyle",
  description: "Manage products and orders",
};

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Skip auth check for auth pages
  if (pathname.startsWith("/store/auth")) {
    return <>{children}</>;
  }

  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/store/auth/signin");
  }

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
            <UserMenu email={admin.email} />
          </div>
        </div>
        <section className="admin-content">{children}</section>
      </div>
    </div>
  );
}
