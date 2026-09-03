"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FiTrash2,
  FiPlus,
  FiMinus,
  FiShoppingBag,
  FiArrowRight,
  FiCheck,
  FiTag,
  FiShield,
} from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/redux/slices/cart/cartSlice";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items, totalQuantity, totalPrice } = useAppSelector(
    (state) => state.cart
  );

  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const shipping = totalPrice >= 500 || items.length === 0 ? 0 : 50;
  const discountAmount = discountApplied ? Math.round(totalPrice * 0.2) : 0;
  const grandTotal = Math.max(0, totalPrice - discountAmount + shipping);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "SUNDRY20") {
      setDiscountApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid code. Try SUNDRY20");
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] bg-[#F2EEE5]/40 py-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="w-24 h-24 rounded-full bg-white border border-[#EDEBF1] flex items-center justify-center mx-auto mb-6 shadow-sm text-[#8B879A]">
            <FiShoppingBag size={40} className="text-[#F0AA4C]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1C2B] tracking-tight mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-[#8B879A] mb-8 leading-relaxed">
            Looks like you haven't added anything to your cart yet. Explore our products and discover great deals!
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#1E1C2B] text-[#F2EEE5] font-bold text-sm hover:bg-[#F0AA4C] hover:text-[#1E1C2B] transition-all shadow-md"
          >
            <span>Start Shopping</span>
            <FiArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F2EEE5]/40 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1E1C2B] tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-sm text-[#8B879A] mt-1">
              You have {totalQuantity} {totalQuantity === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          <button
            onClick={() => dispatch(clearCart())}
            className="text-xs font-bold text-[#E8593C] hover:underline flex items-center gap-1.5"
          >
            <FiTrash2 size={14} />
            <span>Clear Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* ── Cart Items List ── */}
          <div className="lg:col-span-8 space-y-4">
            {items.map(({ product, quantity }) => {
              const itemPrice =
                product.priceAfterDiscount ?? product.price;
              const lineTotal = itemPrice * quantity;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EDEBF1] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-sm"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/products/${product._id}`}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#F7F6F9] shrink-0 overflow-hidden border border-[#EDEBF1] flex items-center justify-center p-2"
                  >
                    <Image
                      src={product.imageCover}
                      alt={product.title}
                      fill
                      className="object-contain p-1"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-[#8B879A] uppercase tracking-wider block mb-1">
                      {product.category?.name}
                    </span>
                    <Link
                      href={`/products/${product._id}`}
                      className="text-sm sm:text-base font-bold text-[#1E1C2B] line-clamp-1 hover:text-[#E8593C] transition-colors"
                    >
                      {product.title}
                    </Link>
                    <div className="text-xs font-semibold text-[#8B879A] mt-1">
                      {itemPrice} EGP per unit
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="flex items-center border border-[#EDEBF1] rounded-xl bg-[#F7F6F9] h-9 px-1">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: product._id,
                              quantity: quantity - 1,
                            })
                          )
                        }
                        className="p-1.5 text-[#6B677A] hover:text-[#1E1C2B] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus size={13} />
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-[#1E1C2B]">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: product._id,
                              quantity: quantity + 1,
                            })
                          )
                        }
                        className="p-1.5 text-[#6B677A] hover:text-[#1E1C2B] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <FiPlus size={13} />
                      </button>
                    </div>

                    {/* Price & Delete */}
                    <div className="text-right flex items-center gap-4">
                      <span className="text-base font-extrabold text-[#1E1C2B] whitespace-nowrap">
                        {lineTotal} EGP
                      </span>
                      <button
                        onClick={() => dispatch(removeFromCart(product._id))}
                        className="p-2 text-[#8B879A] hover:text-[#E8593C] rounded-lg hover:bg-[#E8593C]/10 transition-colors"
                        aria-label="Remove item"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 border border-[#EDEBF1] shadow-sm space-y-6 sticky top-24">
              <h2 className="text-lg font-extrabold text-[#1E1C2B] tracking-tight pb-4 border-b border-[#EDEBF1]">
                Order Summary
              </h2>

              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <label className="text-xs font-bold text-[#6B677A] uppercase tracking-wider flex items-center gap-1.5">
                  <FiTag size={13} />
                  <span>Promo Code</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. SUNDRY20"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={discountApplied}
                    className="flex-1 min-w-0 h-10 px-3 rounded-xl bg-[#F7F6F9] border border-[#EDEBF1] text-xs uppercase font-bold text-[#1E1C2B] outline-none focus:border-[#F0AA4C]"
                  />
                  <button
                    type="submit"
                    disabled={discountApplied || !promoCode}
                    className="px-4 h-10 rounded-xl bg-[#1E1C2B] text-[#F2EEE5] text-xs font-bold hover:bg-[#F0AA4C] hover:text-[#1E1C2B] transition-colors disabled:opacity-40"
                  >
                    Apply
                  </button>
                </div>
                {discountApplied && (
                  <p className="text-xs font-bold text-[#3FA772] flex items-center gap-1">
                    <FiCheck size={13} /> 20% discount applied!
                  </p>
                )}
                {promoError && (
                  <p className="text-xs font-semibold text-[#E8593C]">{promoError}</p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-2 text-sm text-[#524F63]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#1E1C2B]">{totalPrice} EGP</span>
                </div>

                {discountApplied && (
                  <div className="flex justify-between text-[#3FA772]">
                    <span>Discount (20%)</span>
                    <span className="font-bold">-{discountAmount} EGP</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-[#1E1C2B]">
                    {shipping === 0 ? (
                      <span className="text-[#3FA772]">FREE</span>
                    ) : (
                      `${shipping} EGP`
                    )}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-[11px] text-[#8B879A]">
                    Add {500 - totalPrice} EGP more for FREE shipping!
                  </p>
                )}

                <div className="pt-4 border-t border-[#EDEBF1] flex justify-between items-baseline">
                  <span className="text-base font-extrabold text-[#1E1C2B]">Total</span>
                  <span className="text-2xl font-extrabold text-[#1E1C2B]">
                    {grandTotal} EGP
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="w-full py-4 rounded-2xl bg-[#F0AA4C] text-[#1E1C2B] font-extrabold text-sm hover:bg-[#E8593C] hover:text-white transition-all duration-200 shadow-md flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <FiArrowRight size={17} />
              </Link>

              <div className="flex items-center justify-center gap-2 text-xs text-[#8B879A] pt-2">
                <FiShield size={14} className="text-[#3FA772]" />
                <span>Secure SSL Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
