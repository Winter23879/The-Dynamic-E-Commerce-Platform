"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { SlidersHorizontal, X, ArrowUpDown, Zap, Star } from "lucide-react";

const categories = ["All", "Audio", "Displays", "Computing", "Wearables", "Power", "Smart Home"];
const sortOptions = [
  { label: "Featured", value: "" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Customer Rating", value: "rating" },
];

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams?.get("category") || "All";
  const currentSort = searchParams?.get("sort") || "";
  const isFlash = searchParams?.get("flash") === "true";
  const minRating = searchParams?.get("minRating") || "";

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (value === null || value === "" || value === "All") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
  };

  const hasFilters = currentCategory !== "All" || currentSort !== "" || isFlash || minRating !== "";

  const clearFilters = () => {
    startTransition(() => {
      router.push("/products");
    });
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl shadow-cyan-950/10">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
          <span>Filter & Sort Gadgets</span>
          {isPending && <span className="text-xs text-cyan-400 animate-pulse ml-2">Updating...</span>}
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-rose-400" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Category</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParam("category", cat === "All" ? null : cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentCategory === cat
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/20"
                  : "bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sort & Quick Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Sort Order
          </label>
          <div className="relative">
            <select
              value={currentSort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Minimum Rating
          </label>
          <div className="flex gap-1.5">
            {[4, 4.5, 4.8].map((star) => (
              <button
                key={star}
                onClick={() => updateParam("minRating", minRating === String(star) ? null : String(star))}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  minRating === String(star)
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10"
                    : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                <span>{star}+</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Special</label>
          <button
            onClick={() => updateParam("flash", isFlash ? null : "true")}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border text-xs font-semibold transition-all ${
              isFlash
                ? "bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-md shadow-purple-500/10"
                : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isFlash ? "text-purple-400 fill-purple-400" : "text-slate-500"}`} />
            <span>Flash Deals Only</span>
          </button>
        </div>
      </div>
    </div>
  );
}
