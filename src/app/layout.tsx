import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import WhatsAppSupportButton from "@/components/WhatsAppSupportButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "INNOVIST | Science-Backed Face Creams & Barrier Skincare",
  description:
    "Shop clinical, dermatologist-tested face creams. Formulated with 5x bio-ceramides, 10% ethyl ascorbic acid, 5D hyaluronic acid, and peptides. Get FLAT 20% OFF with code FLAT20.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF9F6] text-zinc-900 font-sans selection:bg-amber-200 selection:text-amber-900 overflow-x-hidden w-full max-w-full">
        <AuthProvider>
          <CartProvider>
            {children}
            <WhatsAppSupportButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
