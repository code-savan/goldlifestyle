"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Package, ShoppingCart } from "lucide-react";

const links = [
  { href: "/store", label: "Dashboard", icon: BarChart3 },
  { href: "/store/products", label: "Products", icon: Package },
  { href: "/store/orders", label: "Orders", icon: ShoppingCart },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="admin-rail">
      <a href="/" aria-label="Home" className="">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" className="w-[90%] mx-auto mb-12" alt="Gold lifestyle" width={28} height={28} />
      </a>
      <nav style={{ display: "grid", gap: 8 }}>
        {links.map((l) => {
          // Special handling for root store path
          let active = false;
          if (l.href === "/store") {
            active = pathname === "/store" || pathname === "/store/" || pathname === "/store/index" || pathname === "/store";
          } else {
            active = pathname?.startsWith(l.href);
          }
          const Icon = l.icon;
          return (
            <Link key={l.href} href={l.href} className={`admin-rail-link${active ? " active" : ""}`}>
              <Icon size={18} />
              <span>{l.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
