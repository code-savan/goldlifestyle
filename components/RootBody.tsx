"use client";
import { usePathname } from "next/navigation";
import { Navbar, Footer } from "@/components/ui";
import FloatingCartButton from "@/components/FloatingCartButton";
import { ToastProvider } from "@/components/Toast";
import { CartProvider } from "@/components/CartContext";

export default function RootBody({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/store");
  if (isAdmin) {
    return <>{children}</>;
  }
  return (
    <CartProvider>
      <ToastProvider>
        <Navbar />
        <div className="min-h-screen">{children}</div>
        <Footer />
        <FloatingCartButton />
      </ToastProvider>
    </CartProvider>
  );
}
