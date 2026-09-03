"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiHeart, FiShoppingCart, FiStar, FiCheck } from "react-icons/fi";
import type { ProductCardProps } from "./ProductCard.types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/slices/cart/cartSlice";
import { toggleWishlist } from "@/redux/slices/wishlist/wishlistSlice";
import { getStoredToken } from "@/app/lib/auth";
import { API_ENDPOINTS } from "@/app/lib/api";

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const [isAdded, setIsAdded] = useState(false);

  const hasDiscount =
    product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.priceAfterDiscount!) / product.price) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Update local Redux state immediately (optimistic)
    dispatch(addToCart({ product, quantity: 1 }));
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);

    // 2. Sync to backend if user is logged in
    const token = await getStoredToken();
    if (token) {
      try {
        await fetch(API_ENDPOINTS.cart.base, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify({ productId: product._id }),
        });
      } catch (err) {
        console.error("Failed to sync cart with backend:", err);
      }
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-[#EDEBF1] overflow-hidden hover:shadow-[0_12px_30px_rgba(30,28,43,0.08)] hover:border-[#F0AA4C]/40 transition-all duration-300">
      {/* ── Badges ── */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {hasDiscount && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E8593C] text-white shadow-sm">
            -{discountPercent}%
          </span>
        )}
        {product.ratingsAverage >= 4.5 && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#1E1C2B] text-[#F0AA4C] shadow-sm">
            Top Rated
          </span>
        )}
      </div>

      {/* ── Wishlist Button ── */}
      <button
        onClick={handleToggleWishlist}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute top-3 right-3 z-10 h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
          isWishlisted
            ? "bg-[#E8593C] text-white"
            : "bg-white/90 backdrop-blur-sm text-[#524F63] hover:text-[#E8593C] hover:bg-white"
        }`}
      >
        <FiHeart
          size={17}
          className={isWishlisted ? "fill-current" : ""}
        />
      </button>

      {/* ── Image & Link ── */}
      <Link
        href={`/products/${product._id || product.id}`}
        className="relative aspect-square w-full bg-[#F7F6F9] overflow-hidden flex items-center justify-center"
      >
        <Image
          src={product.imageCover}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* ── Info Body ── */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category & Brand */}
        <div className="flex items-center justify-between text-xs text-[#8B879A] mb-1.5 font-medium">
          <span className="truncate">{product.category?.name || "Product"}</span>
          {product.brand?.name && (
            <span className="text-[#6B677A] font-semibold">{product.brand.name}</span>
          )}
        </div>

        {/* Title */}
        <Link
          href={`/products/${product._id || product.id}`}
          className="font-bold text-[#1E1C2B] text-sm line-clamp-2 hover:text-[#E8593C] transition-colors duration-150 mb-2 leading-snug"
        >
          {product.title}
        </Link>

        {/* Ratings */}
        <div className="flex items-center gap-1.5 text-xs text-[#8B879A] mb-3">
          <div className="flex items-center text-[#F0AA4C]">
            <FiStar size={13} className="fill-current" />
            <span className="font-bold text-[#1E1C2B] ml-1 text-xs">
              {product.ratingsAverage}
            </span>
          </div>
          <span>({product.ratingsQuantity || product.sold || 0})</span>
        </div>

        {/* Price & Add to Cart button */}
        <div className="mt-auto pt-3 border-t border-[#EDEBF1] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-[#1E1C2B]">
                {hasDiscount ? product.priceAfterDiscount : product.price} EGP
              </span>
              {hasDiscount && (
                <span className="text-xs text-[#8B879A] line-through font-medium">
                  {product.price} EGP
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`h-9 px-3.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all duration-200 ${
              isAdded
                ? "bg-[#3FA772] text-white"
                : "bg-[#1E1C2B] text-[#F2EEE5] hover:bg-[#F0AA4C] hover:text-[#1E1C2B] active:scale-95"
            }`}
          >
            {isAdded ? (
              <>
                <FiCheck size={14} />
                <span>Added</span>
              </>
            ) : (
              <>
                <FiShoppingCart size={14} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
