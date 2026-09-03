"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FiHeart,
  FiShoppingCart,
  FiStar,
  FiTruck,
  FiRotateCcw,
  FiShield,
  FiPlus,
  FiMinus,
  FiCheck,
} from "react-icons/fi";
import type { ProductDetailsClientProps } from "./ProductDetailsClient.types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/slices/cart/cartSlice";
import { toggleWishlist } from "@/redux/slices/wishlist/wishlistSlice";
import { getStoredToken } from "@/app/lib/auth";
import { API_ENDPOINTS } from "@/app/lib/api";
import ProductReviews from "./ProductReviews";

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const [activeImage, setActiveImage] = useState(product.imageCover);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const images = [product.imageCover, ...(product.images || [])].filter(
    (img, index, self) => self.indexOf(img) === index
  );

  const hasDiscount =
    product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.priceAfterDiscount!) / product.price) * 100)
    : 0;

  const handleAddToCart = async () => {
    // 1. Update local Redux state immediately (optimistic)
    dispatch(addToCart({ product, quantity }));
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

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(product));
  };

  return (
    <div>
      {/* ── Breadcrumbs ── */}
      <nav className="flex items-center gap-2 text-xs font-medium text-[#8B879A] mb-8">
        <Link href="/" className="hover:text-[#1E1C2B] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#1E1C2B] transition-colors">
          Shop
        </Link>
        <span>/</span>
        <span className="text-[#1E1C2B] truncate max-w-xs">{product.title}</span>
      </nav>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EDEBF1] shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* ── Left: Image Gallery ── */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Main Featured Image */}
            <div className="relative aspect-square w-full rounded-2xl bg-[#F7F6F9] border border-[#EDEBF1] overflow-hidden flex items-center justify-center p-6">
              {hasDiscount && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold bg-[#E8593C] text-white">
                  -{discountPercent}% OFF
                </span>
              )}
              <Image
                src={activeImage}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6 transition-all duration-300"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 rounded-xl bg-[#F7F6F9] border-2 overflow-hidden shrink-0 transition-all p-2 ${
                      activeImage === img
                        ? "border-[#F0AA4C] shadow-sm"
                        : "border-[#EDEBF1] hover:border-[#8B879A]"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${i}`}
                      fill
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Product Info ── */}
          <div className="lg:col-span-6 flex flex-col">
            {/* Category & Brand */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8B879A] uppercase tracking-wider mb-2">
              <span>{product.category?.name}</span>
              {product.brand?.name && (
                <>
                  <span>•</span>
                  <span className="text-[#1E1C2B] font-bold">{product.brand.name}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1C2B] tracking-tight leading-snug mb-3">
              {product.title}
            </h1>

            {/* Ratings & Sold */}
            <div className="flex items-center gap-4 text-xs text-[#8B879A] mb-6">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F7F6F9] border border-[#EDEBF1]">
                <FiStar size={14} className="fill-current text-[#F0AA4C]" />
                <span className="font-bold text-[#1E1C2B]">{product.ratingsAverage}</span>
                <span>({product.ratingsQuantity || 0} reviews)</span>
              </div>
              <span>•</span>
              <span className="text-[#3FA772] font-semibold">{product.sold || 0} sold</span>
              <span>•</span>
              <span className="text-[#3FA772] font-semibold">In Stock</span>
            </div>

            {/* Price */}
            <div className="p-4 rounded-2xl bg-[#F7F6F9] border border-[#EDEBF1] flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-extrabold text-[#1E1C2B]">
                {hasDiscount ? product.priceAfterDiscount : product.price} EGP
              </span>
              {hasDiscount && (
                <span className="text-lg text-[#8B879A] line-through font-semibold">
                  {product.price} EGP
                </span>
              )}
              {hasDiscount && (
                <span className="ml-auto text-xs font-bold text-[#E8593C] bg-[#E8593C]/10 px-2.5 py-1 rounded-md">
                  Save {product.price - product.priceAfterDiscount!} EGP
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B677A] mb-2">
                Description
              </h3>
              <p className="text-sm text-[#524F63] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Actions: Quantity + Add to Cart + Wishlist */}
            <div className="space-y-4 pt-6 border-t border-[#EDEBF1] mt-auto">
              <div className="flex items-center gap-4">
                {/* Quantity selector */}
                <div className="flex items-center border border-[#EDEBF1] rounded-2xl bg-[#F7F6F9] h-12 px-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2 text-[#6B677A] hover:text-[#1E1C2B] disabled:opacity-30 transition-colors"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-[#1E1C2B]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-[#6B677A] hover:text-[#1E1C2B] transition-colors"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`flex-1 h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-200 ${
                    isAdded
                      ? "bg-[#3FA772] text-white"
                      : "bg-[#1E1C2B] text-[#F2EEE5] hover:bg-[#F0AA4C] hover:text-[#1E1C2B] active:scale-[0.99]"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <FiCheck size={18} />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <FiShoppingCart size={18} />
                      <span>Add to Cart • {(hasDiscount ? product.priceAfterDiscount! : product.price) * quantity} EGP</span>
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={handleToggleWishlist}
                  aria-label="Wishlist"
                  className={`h-12 w-12 rounded-2xl border flex items-center justify-center transition-all ${
                    isWishlisted
                      ? "bg-[#E8593C] text-white border-[#E8593C]"
                      : "border-[#EDEBF1] text-[#524F63] hover:text-[#E8593C] hover:border-[#E8593C]/40 bg-[#F7F6F9]"
                  }`}
                >
                  <FiHeart size={20} className={isWishlisted ? "fill-current" : ""} />
                </button>
              </div>

              {/* Perks Row */}
              <div className="grid grid-cols-3 gap-2 pt-4">
                <div className="p-3 rounded-xl bg-[#F7F6F9] text-center text-xs">
                  <FiTruck size={16} className="mx-auto mb-1 text-[#F0AA4C]" />
                  <span className="font-semibold text-[#1E1C2B] block">Free Shipping</span>
                  <span className="text-[10px] text-[#8B879A]">Over 500 EGP</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F7F6F9] text-center text-xs">
                  <FiRotateCcw size={16} className="mx-auto mb-1 text-[#E8593C]" />
                  <span className="font-semibold text-[#1E1C2B] block">14 Days</span>
                  <span className="text-[10px] text-[#8B879A]">Easy Return</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F7F6F9] text-center text-xs">
                  <FiShield size={16} className="mx-auto mb-1 text-[#F0AA4C]" />
                  <span className="font-semibold text-[#1E1C2B] block">Authentic</span>
                  <span className="text-[10px] text-[#8B879A]">100% Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Reviews Section ── */}
        <ProductReviews productId={product._id || product.id} />
      </div>
    </div>
  );
}
