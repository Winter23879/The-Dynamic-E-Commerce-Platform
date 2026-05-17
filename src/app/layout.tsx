import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { Sparkles } from "lucide-react";
import Link from "next/link";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PRIME Marketplace — Next-Gen Tech & Gadgets",
  description: "Dynamic tech gadget store featuring real-time stock counters, flash deals, and persistent database cart synchronization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
        <Header />
        <CartDrawer />
        <div className="flex-1">{children}</div>

        {/* Premium Footer */}
        <footer className="bg-slate-950 border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8 mt-24">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                PRIME
              </span>
            </div>
            <p className="text-xs text-slate-500 text-center sm:text-left">
              &copy; {new Date().getFullYear()} Prime Marketplace. Built with Next.js 15 App Router, Prisma ORM, & Auth.js.
            </p>
            <div className="flex items-center gap-6 text-xs text-slate-400">
              <Link href="/products" className="hover:text-cyan-400 transition-colors">
                Catalog
              </Link>
              <Link href="/products?flash=true" className="hover:text-purple-400 transition-colors">
                Flash Deals
              </Link>
              <Link href="/login" className="hover:text-cyan-400 transition-colors">
                Account
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
