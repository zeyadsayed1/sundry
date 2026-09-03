"use client";

import Link from "next/link";
import { FiHeart, FiArrowRight, FiTrash2 } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearWishlist } from "@/redux/slices/wishlist/wishlistSlice";
import ProductCard from "../components/ProductCard";

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  if (wishlistItems.length === 0) {
    return (
      <main className="min-h-[70vh] bg-[#F2EEE5]/40 py-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="w-24 h-24 rounded-full bg-white border border-[#EDEBF1] flex items-center justify-center mx-auto mb-6 shadow-sm text-[#8B879A]">
            <FiHeart size={40} className="text-[#E8593C]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1C2B] tracking-tight mb-2">
            Your Wishlist is Empty
          </h1>
          <p className="text-sm text-[#8B879A] mb-8 leading-relaxed">
            Save items you love by tapping the heart icon on any product card.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#1E1C2B] text-[#F2EEE5] font-bold text-sm hover:bg-[#F0AA4C] hover:text-[#1E1C2B] transition-all shadow-md"
          >
            <span>Explore Products</span>
            <FiArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F2EEE5]/40 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1E1C2B] tracking-tight">
              My Wishlist
            </h1>
            <p className="text-sm text-[#8B879A] mt-1">
              {wishlistItems.length} {wishlistItems.length === 1 ? "saved item" : "saved items"}
            </p>
          </div>

          <button
            onClick={() => dispatch(clearWishlist())}
            className="text-xs font-bold text-[#E8593C] hover:underline flex items-center gap-1.5"
          >
            <FiTrash2 size={14} />
            <span>Clear Wishlist</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
