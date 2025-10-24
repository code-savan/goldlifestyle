import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui";
import { CartProvider } from "@/components/CartContext";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Gold lifestyle",
  description: "Wear Style, Wear Confidence, Wear luxury. Gold lifestyle is an ecommerce store selling high-quality clothes and shoes.",
  icons: { icon: "/appicon.png" },
  openGraph: {
    title: "Gold lifestyle",
    description: "Wear Style, Wear Confidence, Wear luxury. Shop stylish clothes and shoes.",
    images: ["/appicon.png"],
    type: "website",
    locale: "en_US",
    siteName: "Gold lifestyle",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gold lifestyle",
    description: "Wear Style, Wear Confidence, Wear luxury. Shop stylish clothes and shoes.",
    images: ["/appicon.png"],
  },
  category: "ecommerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} antialiased minimal-root`}>
        <CartProvider>
          <Navbar />
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>{children}</div>
        </CartProvider>
      </body>
    </html>
  );
}
