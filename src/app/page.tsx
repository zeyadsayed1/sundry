import { Suspense } from "react";
import Link from "next/link";
import { FiArrowRight, FiTrendingUp, FiStar, FiZap } from "react-icons/fi";
import { Product, ProductsResponse } from "@/app/lib/types";
import { API_ENDPOINTS } from "@/app/lib/api";
import HeroBanner from "./components/HeroBanner";
import CategorySection from "./components/CategorySection";
import ProductCard from "./components/ProductCard";
import ProductCardSkeleton from "./components/ProductCardSkeleton";

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_ENDPOINTS.products}?limit=16`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const data: ProductsResponse = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();
  const featuredProducts = products.slice(0, 8);
  const newArrivals = products.slice(8, 16);

  return (
    <main className="min-h-screen bg-[#F2EEE5]/40 flex flex-col">
      {/* ── 1. Hero Section ── */}
      <HeroBanner />

      {/* ── 2. Categories Section ── */}
      <Suspense fallback={<div className="py-12 text-center text-sm text-[#8B879A]">Loading categories...</div>}>
        <CategorySection />
      </Suspense>

      {/* ── 3. Featured Products Grid ── */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E8593C] mb-1.5">
              <FiTrendingUp size={15} />
              <span>Trending Collection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1C2B] tracking-tight">
              Featured Products
            </h2>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1E1C2B] hover:text-[#F0AA4C] transition-colors"
          >
            <span>Explore All</span>
            <FiArrowRight size={16} />
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── 4. Promo Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-14">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E1C2B] via-[#2C293B] to-[#1E1C2B] border border-[#3D3A4E] p-8 sm:p-12 text-[#F2EEE5] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8593C]/20 border border-[#E8593C]/40 text-[#E8593C] text-xs font-bold">
              <FiZap size={14} />
              <span>Limited Time Deal</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Get 20% Off Your First Order
            </h3>
            <p className="text-sm text-[#8B879A]">
              Join thousands of happy shoppers. Use promo code <span className="text-[#F0AA4C] font-bold">SUNDRY20</span> at checkout.
            </p>
          </div>

          <Link
            href="/shop"
            className="shrink-0 px-8 py-4 rounded-full bg-[#F0AA4C] text-[#1E1C2B] font-extrabold text-sm hover:bg-[#E8593C] hover:text-white transition-all duration-200 shadow-lg"
          >
            Shop Discounted Items
          </Link>
        </div>
      </section>

      {/* ── 5. New Arrivals ── */}
      {newArrivals.length > 0 && (
        <section className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F0AA4C] mb-1.5">
                <FiStar size={15} />
                <span>Just In</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1C2B] tracking-tight">
                New Arrivals
              </h2>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1E1C2B] hover:text-[#F0AA4C] transition-colors"
            >
              <span>View More</span>
              <FiArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
