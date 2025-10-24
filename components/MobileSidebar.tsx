"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, BarChart3, Package, ShoppingCart } from "lucide-react";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        aria-label="Open menu"
        className="mobile-rail-toggle"
        onClick={() => setOpen(true)}
      >
        <Menu size={18} />
      </button>

      {open && (
        <div className="mobile-rail-overlay" onClick={() => setOpen(false)} />
      )}

      <aside className={`mobile-rail${open ? " open" : ""}`} aria-hidden={!open}>
        <div className="mobile-rail-header">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo" width={120} height={28} />
          <button aria-label="Close menu" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <nav className="mobile-rail-links" onClick={() => setOpen(false)}>
          <Link href="/store/" className="mobile-rail-link"><BarChart3 size={16} /> <span>Dashboard</span></Link>
          <Link href="/store/products" className="mobile-rail-link"><Package size={16} /> <span>Products</span></Link>
          <Link href="/store/orders" className="mobile-rail-link"><ShoppingCart size={16} /> <span>Orders</span></Link>
        </nav>
      </aside>
    </>
  );
}
