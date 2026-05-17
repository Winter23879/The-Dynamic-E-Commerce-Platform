import { auth } from "@/auth";
import { CheckoutFormClient } from "@/components/CheckoutFormClient";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock } from "lucide-react";

export default async function CheckoutPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Shopping</span>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Secure Prime Checkout</h1>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL Encrypted Sandbox</span>
          </div>
        </div>

        <CheckoutFormClient user={session?.user} />
      </div>
    </div>
  );
}
