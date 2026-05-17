"use client";

import { useActionState, useEffect, useState } from "react";
import { processCheckoutAction } from "@/actions/checkout";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, CreditCard, Lock, CheckCircle2, AlertCircle, Loader2, Truck, Sparkles } from "lucide-react";

export function CheckoutFormClient({ user }: { user: any }) {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [state, formAction, isPending] = useActionState(processCheckoutAction, null);
  const [name, setName] = useState(user?.name || "");
  const [address, setAddress] = useState("123 Prime Blvd, Silicon Valley, CA 94025");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("123");

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 150 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const totalAmount = subtotal + shipping + tax;

  useEffect(() => {
    if (state?.success && state.orderId) {
      clearCart();
      router.push(`/success/${state.orderId}`);
    }
  }, [state, clearCart, router]);

  const loadStripeTestCard = () => {
    setCardNumber("4242 •••• •••• 4242");
    setExpiry("12/28");
    setCvc("424");
  };

  if (items.length === 0 && !state?.success) {
    return (
      <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
          <Truck className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Your Cart is Empty</h2>
          <p className="text-xs text-slate-400 mt-1">Please add items to your cart before proceeding to checkout.</p>
        </div>
        <button
          onClick={() => router.push("/products")}
          className="py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-semibold rounded-2xl shadow-lg shadow-cyan-500/25"
        >
          Browse Gadgets Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Checkout Form */}
      <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl shadow-cyan-950/20">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>Encrypted Connection</span>
          </div>
          <span className="text-xs font-mono text-slate-500">Stripe Sandbox Mode</span>
        </div>

        {/* Test Card Quick Fill */}
        <button
          type="button"
          onClick={loadStripeTestCard}
          className="w-full py-3 px-4 bg-purple-500/10 border border-purple-500/30 hover:border-purple-500 rounded-2xl flex items-center justify-center gap-2 text-purple-300 text-xs font-semibold transition-all group"
        >
          <Sparkles className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
          <span>Click to Auto-Fill Stripe Sandbox Test Card (4242)</span>
        </button>

        {state?.error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-400 text-xs animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">1. Shipping Address</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Recipient Full Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Alex Rivers"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Delivery Address</label>
              <input
                type="text"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="123 Prime Blvd, Silicon Valley, CA"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">2. Secure Payment Details</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  name="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                  placeholder="•••• •••• •••• ••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
                <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Expiration</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  required
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">CVC / Security Code</label>
                <input
                  type="text"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  required
                  placeholder="123"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-8 py-4 px-6 bg-gradient-to-r from-cyan-500 via-purple-600 to-purple-700 hover:from-cyan-400 hover:to-purple-600 text-white font-bold rounded-2xl shadow-2xl shadow-purple-950/50 flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Authorization & Stock Deduction...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-cyan-300" />
                <span>Authorize & Pay ${totalAmount.toFixed(2)}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-white">Order Summary</h3>

        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 items-center p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0 relative">
                <Image src={item.product.image} alt={item.product.title} fill className="object-cover" sizes="64px" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{item.product.title}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                <p className="text-xs font-mono font-bold text-cyan-400 mt-1">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal ({items.reduce((a, b) => a + b.quantity, 0)} items)</span>
            <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Prime Shipping</span>
            <span className="font-mono text-emerald-400 font-bold">{shipping === 0 ? "FREE" : `$${shipping}`}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Estimated Tax (8%)</span>
            <span className="font-mono text-white">${tax.toFixed(2)}</span>
          </div>
          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
            <span>Total</span>
            <span className="text-base font-mono font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
