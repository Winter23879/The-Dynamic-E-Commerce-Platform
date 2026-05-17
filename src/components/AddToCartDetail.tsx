"use client";

import { useCartStore } from "@/store/cartStore";
import { useState, useTransition } from "react";
import { Minus, Plus, ShoppingBag, Check, Loader2, AlertCircle } from "lucide-react";

export function AddToCartDetail({ product }: { product: any }) {
  const { items, addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cartItem = items.find((i) => i.productId === product.id);
  const availableStock = product.stock - (cartItem?.quantity || 0);

  const handleAdd = () => {
    if (availableStock < quantity) {
      setErrorMsg("Cannot add more than available stock.");
      return;
    }

    startTransition(async () => {
      setErrorMsg(null);
      const res = await addItem(product, quantity);
      if (res?.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2500);
      } else if (res?.error) {
        setErrorMsg(res.error);
      }
    });
  };

  if (product.stock === 0) {
    return (
      <div className="py-4 px-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-center text-rose-400 font-bold text-sm">
        Currently Out of Stock
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-slate-800 bg-slate-900/80 rounded-2xl p-1 shadow-inner">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center text-sm font-bold font-mono text-white">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
            disabled={quantity >= availableStock}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={isPending || availableStock <= 0}
          className={`flex-1 py-4 px-8 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all ${
            success
              ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 scale-102"
              : "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-xl shadow-cyan-500/25 active:scale-98"
          } disabled:opacity-50`}
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Updating Cart...</span>
            </>
          ) : success ? (
            <>
              <Check className="w-5 h-5 animate-scaleIn" />
              <span>Added Successfully!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Cart — ${(product.price * quantity).toFixed(2)}</span>
            </>
          )}
        </button>
      </div>

      {cartItem && (
        <div className="flex items-center justify-between text-xs px-2 text-slate-400">
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            {cartItem.quantity} already in your cart
          </span>
          <span>Only {availableStock} more available</span>
        </div>
      )}
    </div>
  );
}
