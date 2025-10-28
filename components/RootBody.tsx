"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/ui";
import { CartProvider } from "@/components/CartContext";

export default function RootBody({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/store");
  if (isAdmin) {
    return <>{children}</>;
  }
  return (
    <CartProvider>
      <Navbar />
      <div className="max-w-7xl mx-auto">{children}</div>
    </CartProvider>
  );
}
