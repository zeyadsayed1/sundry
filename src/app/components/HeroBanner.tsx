import Link from "next/link";
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiPercent } from "react-icons/fi";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-[#1E1C2B] text-[#F2EEE5] py-16 sm:py-24">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F0AA4C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#E8593C]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2C293B] border border-[#3D3A4E] text-[#F0AA4C] text-xs font-bold tracking-wide uppercase">
              <FiPercent size={14} className="text-[#E8593C]" />
              <span>Special Offer • Up to 50% Off</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Discover Premium Trends & Everyday Essentials
            </h1>

            <p className="text-base sm:text-lg text-[#8B879A] max-w-xl leading-relaxed">
              Explore thousands of curated products from top brands in fashion, electronics, and beauty with express doorstep delivery.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#F0AA4C] text-[#1E1C2B] font-bold text-sm hover:bg-[#E8593C] hover:text-white shadow-[0_4px_20px_rgba(240,170,76,0.3)] hover:shadow-none transition-all duration-200"
              >
                <FiShoppingBag size={17} />
                <span>Shop Now</span>
                <FiArrowRight size={17} />
              </Link>

              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#2C293B] text-[#F2EEE5] font-semibold text-sm border border-[#3D3A4E] hover:border-[#F0AA4C]/50 hover:bg-[#3D3A4E] transition-all duration-200"
              >
                <span>Browse Categories</span>
              </Link>
            </div>

            {/* Micro perks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-[#2C293B] w-full">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#2C293B] text-[#F0AA4C]">
                  <FiTruck size={16} />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#F2EEE5]">Fast Delivery</p>
                  <p className="text-[#8B879A]">Across Egypt</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#2C293B] text-[#E8593C]">
                  <FiShield size={16} />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#F2EEE5]">100% Genuine</p>
                  <p className="text-[#8B879A]">Guaranteed Quality</p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#2C293B] text-[#F0AA4C]">
                  <FiShoppingBag size={16} />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#F2EEE5]">Easy Returns</p>
                  <p className="text-[#8B879A]">14-Day Guarantee</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-gradient-to-br from-[#2C293B] to-[#1E1C2B] p-8 rounded-3xl border border-[#3D3A4E] shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F0AA4C]">
                  Trending This Week
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#E8593C] text-white">
                  HOT
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#1E1C2B]/80 border border-[#3D3A4E]/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#8B879A]">Electronics</p>
                    <p className="font-bold text-sm text-[#F2EEE5]">Latest Gadgets & Audio</p>
                  </div>
                  <span className="text-sm font-extrabold text-[#F0AA4C]">Up to 40%</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#1E1C2B]/80 border border-[#3D3A4E]/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#8B879A]">Fashion & Apparel</p>
                    <p className="font-bold text-sm text-[#F2EEE5]">Seasonal Collections</p>
                  </div>
                  <span className="text-sm font-extrabold text-[#E8593C]">Up to 50%</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#1E1C2B]/80 border border-[#3D3A4E]/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#8B879A]">Beauty & Wellness</p>
                    <p className="font-bold text-sm text-[#F2EEE5]">Skincare & Perfumes</p>
                  </div>
                  <span className="text-sm font-extrabold text-[#F0AA4C]">Up to 30%</span>
                </div>
              </div>

              <Link
                href="/shop"
                className="mt-6 block text-center w-full py-3 rounded-xl bg-[#F0AA4C]/10 border border-[#F0AA4C]/30 text-[#F0AA4C] font-bold text-sm hover:bg-[#F0AA4C] hover:text-[#1E1C2B] transition-colors duration-200"
              >
                View All Deals
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
