import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, PackageCheck, Truck, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

export default async function OrderSuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: true },
      },
      user: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
      {/* Glow Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 sm:p-12 rounded-3xl shadow-2xl shadow-emerald-950/20 space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30 animate-bounce">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-scaleIn" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-bold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Order Authorized Successfully</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Thank You For Your Order!
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
            Your inventory has been deducted securely. We&apos;ve sent an order confirmation to{" "}
            <span className="text-white font-bold">{order.user?.email || "your email"}</span>.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4 text-xs font-mono">
            <div>
              <span className="text-slate-500">Order Reference:</span>
              <p className="text-white font-bold">{order.id}</p>
            </div>
            <div>
              <span className="text-slate-500">Stripe Payment ID:</span>
              <p className="text-cyan-400">{order.stripePaymentId}</p>
            </div>
            <div>
              <span className="text-slate-500">Status:</span>
              <p className="text-emerald-400 font-bold uppercase">{order.status}</p>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0 relative">
                  <Image src={item.product.image} alt={item.product.title} fill className="object-cover" sizes="56px" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{item.product.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                </div>
                <span className="text-xs font-mono font-bold text-white">
                  ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-sm">
            <span className="text-slate-400 font-semibold">Total Paid</span>
            <span className="text-2xl font-mono font-black text-emerald-400">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Order Progress Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 border-t-2 border-t-emerald-500 space-y-1">
            <PackageCheck className="w-5 h-5 text-emerald-400 mx-auto" />
            <p className="text-xs font-bold text-white">1. Order Placed</p>
            <p className="text-[10px] text-slate-500">Inventory decremented</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 border-t-2 border-t-cyan-500 space-y-1">
            <ShieldCheck className="w-5 h-5 text-cyan-400 mx-auto" />
            <p className="text-xs font-bold text-white">2. Verified & Packed</p>
            <p className="text-[10px] text-slate-500">Prime QA inspection</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 border-t-2 border-t-purple-500 space-y-1">
            <Truck className="w-5 h-5 text-purple-400 mx-auto" />
            <p className="text-xs font-bold text-white">3. Out For Delivery</p>
            <p className="text-[10px] text-slate-500">Arriving via Express</p>
          </div>
        </div>

        <div className="text-center pt-4 border-t border-slate-800/80">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 py-4 px-8 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-cyan-500/25 transition-all group"
          >
            <span>Continue Shopping Gadgets</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
