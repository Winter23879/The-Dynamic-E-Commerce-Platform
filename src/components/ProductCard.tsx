"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Star, ShoppingBag, Zap, Clock, Check, Loader2 } from "lucide-react";

export function ProductCard({ product }: { product: any }) {
  const { items, addItem } = useCartStore();
  const [isPending, startTransition] = useTransition();
  const [addedTemp, setAddedTemp] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  // Check if item is in cart
  const cartItem = items.find((i) => i.productId === product.id);

  useEffect(() => {
    if (!product.isFlashDeal || !product.dealEndsAt) return;

    const end = new Date(product.dealEndsAt).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [product.isFlashDeal, product.dealEndsAt]);

  const handleAddToCart = () => {
    startTransition(async () => {
      const res = await addItem(product, 1);
      if (res?.success) {
        setAddedTemp(true);
        setTimeout(() => setAddedTemp(false), 2000);
      }
    });
  };

  return (
    <div className="group relative flex flex-col bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-950/40 hover:-translate-y-1">
      {/* Glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isFlashDeal && timeLeft && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/90 text-white rounded-full text-[10px] font-black tracking-wider uppercase shadow-lg shadow-purple-950/50 backdrop-blur animate-pulse">
            <Zap className="w-3 h-3 fill-white" />
            <span>Flash Deal</span>
          </div>
        )}

        {product.stock <= 10 && product.stock > 0 && (
          <div className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-[10px] font-bold tracking-wide backdrop-blur">
            Only {product.stock} left!
          </div>
        )}

        {product.stock === 0 && (
          <div className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full text-[10px] font-bold tracking-wide backdrop-blur">
            Out of Stock
          </div>
        )}
      </div>

      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="relative w-full pt-[100%] overflow-hidden bg-slate-950/40">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

        {/* Ticking Timer overlay */}
        {product.isFlashDeal && timeLeft && (
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-800 text-xs font-mono font-bold text-cyan-300 shadow-xl">
            <Clock className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: "10s" }} />
            <span>
              {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col justify-between z-10">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 font-mono">
              {product.category}
            </span>
            <div className="flex items-center gap-1 bg-slate-950/60 px-2.5 py-1 rounded-full border border-slate-800">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-white">{product.rating.toFixed(1)}</span>
              <span className="text-[10px] text-slate-500">({product.reviewCount})</span>
            </div>
          </div>

          <Link href={`/products/${product.id}`} className="block group/title">
            <h3 className="text-base font-bold text-white group-hover/title:text-cyan-400 transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">{product.description}</p>
        </div>

        {/* Price & Action */}
        <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white font-mono tracking-tight">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-slate-500 line-through font-mono">${product.originalPrice}</span>
              )}
            </div>
            {cartItem && (
              <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                <Check className="w-3 h-3" />
                {cartItem.quantity} in your cart
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isPending || product.stock === 0}
            className={`relative p-3.5 rounded-2xl font-semibold flex items-center justify-center transition-all ${
              addedTemp
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-105"
                : "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/25 active:scale-95"
            } disabled:opacity-50 disabled:pointer-events-none group/btn`}
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : addedTemp ? (
              <Check className="w-5 h-5 animate-scaleIn" />
            ) : (
              <ShoppingBag className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
