import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowLeft, ShieldCheck, Truck, RotateCcw, Zap, Clock, User } from "lucide-react";
import { AddToCartDetail } from "@/components/AddToCartDetail";
import { ReviewForm } from "@/components/ReviewForm";

export const revalidate = 30; // Revalidate every 30s

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      reviews: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  let specsObj: Record<string, string> = {};
  try {
    if (product.specs) {
      specsObj = JSON.parse(product.specs);
    }
  } catch (e) {
    console.error("Failed to parse specs json", e);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Back Link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Gadgets</span>
        </Link>

        {/* Product Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Image Showcase */}
          <div className="relative p-6 sm:p-12 rounded-3xl bg-slate-900/60 backdrop-blur border border-slate-800 shadow-2xl shadow-cyan-950/20 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
            <div className="relative w-full pt-[90%] overflow-hidden rounded-2xl bg-slate-950/50 shadow-inner">
              <Image
                src={product.image}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>

          {/* Details & Actions */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold font-mono text-purple-400 uppercase tracking-wider">
                  {product.category}
                </span>

                {product.isFlashDeal && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-bold tracking-wide shadow-lg shadow-purple-950/50 animate-pulse">
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>Active Flash Deal</span>
                  </div>
                )}

                {product.stock <= 10 && product.stock > 0 && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                    Only {product.stock} units remaining!
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-white font-mono">{product.rating.toFixed(1)}</span>
                  <span className="text-slate-400">({product.reviewCount} verified reviews)</span>
                </div>
                <span className="text-slate-600">•</span>
                <span className={`font-mono font-semibold ${product.stock > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {product.stock > 0 ? "In Stock & Ready to Ship" : "Sold Out"}
                </span>
              </div>

              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-4xl font-black text-white font-mono tracking-tight">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-slate-500 line-through font-mono">${product.originalPrice}</span>
                )}
              </div>

              <p className="text-slate-300 text-sm leading-relaxed border-t border-slate-800/80 pt-6">
                {product.description}
              </p>
            </div>

            {/* Add to Cart Component */}
            <div className="pt-4">
              <AddToCartDetail product={product} />
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60">
                <Truck className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-300">Fast Prime Express</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60">
                <ShieldCheck className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-300">2-Year Prime Warranty</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60">
                <RotateCcw className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-300">30-Day Hassle Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs Table */}
        {Object.keys(specsObj).length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Technical Specifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(specsObj).map(([key, value]) => (
                <div key={key} className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">{key}</p>
                  <p className="text-sm font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <section className="space-y-8 pt-8 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-tight">Customer Reviews</h2>
            <span className="text-xs font-semibold text-slate-400">{product.reviews.length} reviews posted</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Review Form */}
            <div className="lg:col-span-1">
              <ReviewForm productId={product.id} userName={session?.user?.name} />
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              {product.reviews.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-3xl">
                  <p className="text-sm font-semibold text-slate-400">No reviews yet for this gadget.</p>
                  <p className="text-xs text-slate-600 mt-1">Be the first to share your thoughts!</p>
                </div>
              ) : (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="p-6 bg-slate-900/60 backdrop-blur border border-slate-800 rounded-3xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {rev.user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{rev.user?.name || "Anonymous Prime"}</p>
                          <p className="text-[10px] text-slate-500">
                            {new Date(rev.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-800"}`}
                          />
                        ))}
                      </div>
                    </div>

                    {rev.comment && (
                      <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                        {rev.comment}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
