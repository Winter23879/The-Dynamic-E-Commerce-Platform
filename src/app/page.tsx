import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";
import { Sparkles, Zap, ShieldCheck, RefreshCw, ArrowRight, TrendingUp } from "lucide-react";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  // Fetch flash deals
  const flashDeals = await prisma.product.findMany({
    where: { isFlashDeal: true },
    take: 4,
  });

  // Fetch top rated
  const topRated = await prisma.product.findMany({
    orderBy: { rating: "desc" },
    take: 4,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* Glow Orbs */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-cyan-500/15 via-purple-500/15 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 space-y-24">
        {/* Hero Section */}
        <section className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 p-8 sm:p-16 overflow-hidden shadow-2xl shadow-cyan-950/20">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-full text-xs font-bold text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Next-Gen Reactive E-Commerce Showcase</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Where Data Moves <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                At The Speed of Interaction.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl">
              Experience a fully dynamic gadget marketplace featuring real-time stock sync, ticking flash deal countdowns, persistent database cart, and secure embedded Stripe mock payments.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/products"
                className="py-4 px-8 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition-all group"
              >
                <span>Explore Premium Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/products?flash=true"
                className="py-4 px-8 bg-slate-900/80 hover:bg-slate-900 border border-slate-700 hover:border-purple-500 text-slate-200 font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Live Flash Deals</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Highlights Banner */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-3xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Persistent DB Cart</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Add items and refresh without fear. Your cart state is instantly synchronized with our robust PostgreSQL database.
              </p>
            </div>
          </div>

          <div className="p-6 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-3xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Live Inventory & Deals</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Stock counters decrement live upon checkout, preventing over-ordering. Flash deals tick down in real time.
              </p>
            </div>
          </div>

          <div className="p-6 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-3xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Embedded Stripe Test</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Experience ultra-premium checkout inside our UI using test card numbers to process mock authorizations.
              </p>
            </div>
          </div>
        </section>

        {/* Flash Deals Section */}
        {flashDeals.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-end justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                  <Zap className="w-4 h-4 fill-purple-400 animate-bounce" />
                  <span>Limited Time Offers</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Active Flash Deals</h2>
              </div>
              <Link
                href="/products?flash=true"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group transition-colors"
              >
                <span>View all deals</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {flashDeals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Top Rated Section */}
        <section className="space-y-8">
          <div className="flex items-end justify-between border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>Customer Favorites</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Highest Rated Gadgets</h2>
            </div>
            <Link
              href="/products?sort=rating"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group transition-colors"
            >
              <span>View all highly rated</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {topRated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
