"use client";

import { useCartStore } from "@/store/cartStore";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FREE_SHIPPING_THRESHOLD = 150;

export function CartDrawer() {
  const { items, isOpen, closeDrawer, updateQuantity, removeItem, error } = useCartStore();
  const router = useRouter();

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const progressToFreeShipping = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountNeeded = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  const handleCheckoutClick = () => {
    closeDrawer();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-fadeIn"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md transform transition-transform animate-slideLeft">
          <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800 shadow-2xl shadow-cyan-950/30">
            {/* Header */}
            <div className="px-6 py-6 bg-slate-900/90 backdrop-blur border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Your Cart</h2>
                  <p className="text-xs text-slate-400">{totalQuantity} items selected</p>
                </div>
              </div>
              <button
                onClick={closeDrawer}
                className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Banner */}
            <div className="px-6 py-4 bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-slate-900 border-b border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-medium text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  {amountNeeded === 0 ? (
                    <span className="text-emerald-400 font-semibold">You&apos;ve unlocked Free Prime Shipping!</span>
                  ) : (
                    <span>Add ${amountNeeded.toFixed(2)} more for Free Shipping</span>
                  )}
                </span>
                <span className="text-slate-400 font-mono">{progressToFreeShipping.toFixed(0)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500 rounded-full"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {error && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => useCartStore.setState({ error: null })} className="underline">
                  Dismiss
                </button>
              </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 my-16">
                  <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center text-slate-600">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">Your cart is empty</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      Explore our premium gadgets catalog and unlock exclusive flash deals.
                    </p>
                  </div>
                  <button
                    onClick={closeDrawer}
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-opacity"
                  >
                    Explore Products
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex gap-4 relative group"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0 relative">
                      <Image
                        src={item.product.image}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-white line-clamp-1">{item.product.title}</h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{item.product.category}</p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-slate-800 bg-slate-900 rounded-xl overflow-hidden p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold font-mono text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-cyan-400 font-mono">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping</span>
                    <span className="font-mono text-emerald-400 font-medium">
                      {subtotal >= FREE_SHIPPING_THRESHOLD ? "FREE Prime" : "$9.99"}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Estimated Tax</span>
                    <span className="font-mono text-white">${(subtotal * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
                    <span>Total</span>
                    <span className="text-base font-mono bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      ${(subtotal + (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9.99) + subtotal * 0.08).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 via-purple-600 to-purple-700 hover:from-cyan-400 hover:to-purple-600 text-white font-semibold rounded-2xl shadow-xl shadow-purple-950/50 flex items-center justify-center gap-2 transition-all group"
                >
                  <ShieldCheck className="w-5 h-5 text-cyan-300" />
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
