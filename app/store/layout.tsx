import AdminSidebar from "@/components/AdminSidebar";
import MobileSidebar from "@/components/MobileSidebar";
import { User, Bell } from "lucide-react";
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
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <div className="admin-topbar-mobile"><MobileSidebar /></div>
            <h1 style={{ fontSize: "16px", fontWeight: "600", color: "#111", margin: 0 }}>Dashboard</h1>
            {/* <div className="admin-tabs">
              <span className="admin-tab active">Summary</span>
              <span className="admin-tab">Statistics</span>
              <span className="admin-tab">Overview</span>
            </div> */}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Bell size={18} color="#6b7280" />
            </div>
            {/* <select style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: "500",
              background: "white"
            }}>
              <option>Last Month</option>
              <option>This Month</option>
            </select> */}
            <div style={{
              border: "2px solid #e5e7eb",
              cursor: "pointer",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background: "#f3f4f6"
            }}>
              <User size={16} color="#6b7280" />
            </div>
          </div>
        </div>
        <section className="admin-content">{children}</section>
      </div>
    </div>
  );
}
