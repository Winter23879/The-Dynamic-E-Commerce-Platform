import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { FilterBar } from "@/components/FilterBar";
import { Prisma } from "@prisma/client";
import { Sparkles, ShoppingBag } from "lucide-react";

export const revalidate = 30; // Revalidate dynamic catalog every 30 seconds

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams?.query === "string" ? resolvedParams.query : "";
  const category = typeof resolvedParams?.category === "string" ? resolvedParams.category : "";
  const sort = typeof resolvedParams?.sort === "string" ? resolvedParams.sort : "";
  const flash = resolvedParams?.flash === "true";
  const minRating = typeof resolvedParams?.minRating === "string" ? parseFloat(resolvedParams.minRating) : 0;

  // Build prisma where clause
  const whereClause: Prisma.ProductWhereInput = {};

  if (query) {
    whereClause.OR = [
      { title: { contains: query } },
      { description: { contains: query } },
      { category: { contains: query } },
    ];
  }

  if (category && category !== "All") {
    whereClause.category = category;
  }

  if (flash) {
    whereClause.isFlashDeal = true;
  }

  if (minRating > 0) {
    whereClause.rating = { gte: minRating };
  }

  // Build prisma orderBy
  let orderByClause: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };

  if (sort === "price-asc") {
    orderByClause = { price: "asc" };
  } else if (sort === "price-desc") {
    orderByClause = { price: "desc" };
  } else if (sort === "rating") {
    orderByClause = { rating: "desc" };
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: orderByClause,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-xs font-bold text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Premium Gadget Catalog
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Explore state-of-the-art tech gear with live stock tracking. Use filters below to pinpoint exactly what you need.
          </p>
        </div>

        {/* Interactive Filter Bar */}
        <FilterBar />

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
          <span>Found {products.length} premium gadgets</span>
          {(query || category || flash || minRating > 0) && (
            <span className="text-cyan-400">Showing filtered results</span>
          )}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="py-24 text-center space-y-4 border border-slate-800/80 rounded-3xl bg-slate-900/30">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/60 mx-auto flex items-center justify-center text-slate-500">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No products matched your criteria</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search filters or resetting minimum rating to discover more items.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
