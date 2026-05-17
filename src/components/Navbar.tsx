"use client";

import { useCartStore } from "@/store/cartStore";
import { logoutAction } from "@/actions/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { ShoppingBag, Search, Sparkles, User, LogOut, Zap, Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";

const categories = ["Audio", "Displays", "Computing", "Wearables", "Power", "Smart Home"];

export function Navbar({ session }: { session: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, openDrawer } = useCartStore();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("query") || "");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const totalQty = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 sm:gap-8">
        {/* Brand */}
        <div className="flex items-center gap-6 sm:gap-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              PRIME
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/products" className="hover:text-cyan-400 transition-colors">
              All Gadgets
            </Link>
            <Link
              href="/products?flash=true"
              className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-full hover:bg-purple-500/20 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span className="text-xs font-semibold">Flash Deals</span>
            </Link>

            <div className="relative group/cat py-2">
              <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5 group-hover/cat:rotate-180 transition-transform duration-300" />
              </button>

              <div className="absolute top-full left-0 w-56 p-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl shadow-cyan-950/20 opacity-0 pointer-events-none group-hover/cat:opacity-100 group-hover/cat:pointer-events-auto transition-all duration-200 transform translate-y-2 group-hover/cat:translate-y-0 z-50 space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/products?category=${encodeURIComponent(cat)}`}
                    className="block px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search premium OLEDs, Mechanical Keyboards, GaN..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-2xl text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={openDrawer}
            className="relative p-2.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-slate-300 hover:text-white transition-all shadow-lg shadow-cyan-950/10 group"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {totalQty > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-tr from-cyan-500 to-purple-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-cyan-500/50 animate-bounce">
                {totalQty}
              </span>
            )}
          </button>

          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 rounded-xl transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-purple-500/20">
                  {session.user.name?.charAt(0) || "U"}
                </div>
                <span className="text-xs font-semibold text-slate-200 hidden sm:inline-block max-w-[100px] truncate">
                  {session.user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline-block" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-800/80 mb-1">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-xs font-bold text-white truncate mt-0.5">{session.user.email}</p>
                  </div>
                  <button
                    onClick={() => startTransition(async () => await logoutAction())}
                    className="w-full px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="py-2.5 px-5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 transition-all"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 lg:hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 py-6 bg-slate-950 border-b border-slate-800 animate-fadeIn space-y-6">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search premium gadgets..."
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </form>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-3">Navigation</p>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-900 rounded-xl"
            >
              All Gadgets
            </Link>
            <Link
              href="/products?flash=true"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-purple-400 bg-purple-500/10 rounded-xl border border-purple-500/20"
            >
              <Zap className="w-4 h-4" />
              <span>Flash Deals</span>
            </Link>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-3">Categories</p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 hover:text-white"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
