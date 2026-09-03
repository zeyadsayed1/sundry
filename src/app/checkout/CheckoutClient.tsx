"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  FiMapPin,
  FiPhone,
  FiCreditCard,
  FiDollarSign,
  FiShield,
  FiCheckCircle,
  FiLoader,
  FiArrowRight,
  FiInfo,
} from "react-icons/fi";
import { API_ENDPOINTS } from "@/app/lib/api";
import { getStoredToken } from "@/app/lib/auth";
import { useAppDispatch } from "@/redux/hooks";
import { clearCart } from "@/redux/slices/cart/cartSlice";
import {
  checkoutSchema,
  type CheckoutFormData,
  type PaymentMethod,
} from "./CheckoutClient.types";

export default function CheckoutClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [token, setToken] = useState<string | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetchingCart, setIsFetchingCart] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    trigger,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const restoreCheckout = async () => {
      const storedToken = await getStoredToken();
      if (!storedToken) {
        toast.error("Please sign in to continue to checkout.");
        router.push("/auth/sign-in");
        return;
      }
      setToken(storedToken);

      try {
        const res = await fetch(API_ENDPOINTS.cart.base, {
          headers: { token: storedToken },
        });
        const data = await res.json();

        if (res.ok && data.data && data.data._id) {
          setCartId(data.data._id);
        } else {
          toast.error("Your cart is empty on the server. Please add items.");
        }
      } catch (error) {
        console.error("Failed to fetch cart ID", error);
      } finally {
        setIsFetchingCart(false);
      }
    };

    void restoreCheckout();
  }, [router]);

  const onCheckout = async (data: CheckoutFormData) => {
    if (!token) {
      toast.error("Please sign in to continue.");
      return;
    }

    setIsProcessing(true);

    let activeCartId = cartId;

    // If no cartId cached, try fetching again
    if (!activeCartId) {
      try {
        const cartRes = await fetch(API_ENDPOINTS.cart.base, {
          headers: { token },
        });
        const cartData = await cartRes.json();
        if (cartRes.ok && cartData.data?._id) {
          activeCartId = cartData.data._id;
          setCartId(cartData.data._id);
        } else {
          toast.error("Your cart is empty. Please add items before checkout.");
          setIsProcessing(false);
          return;
        }
      } catch {
        toast.error("Failed to fetch your cart. Please try again.");
        setIsProcessing(false);
        return;
      }
    }

    if (!activeCartId) {
      setIsProcessing(false);
      return;
    }

    const payload = {
      shippingAddress: {
        details: data.details,
        phone: data.phone,
        city: data.city,
      },
    };

    try {
      if (paymentMethod === "cash") {
        const res = await fetch(API_ENDPOINTS.orders.cashOrder(activeCartId), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify(payload),
        });

        const resData = await res.json();
        if (res.ok && resData.status === "success") {
          toast.success("🎉 Order placed successfully!");
          dispatch(clearCart());
          router.push("/account/orders");
        } else {
          toast.error(resData.message || "Failed to place order. Please try again.");
          setIsProcessing(false);
        }
      } else {
        const baseUrl = window.location.origin;
        const res = await fetch(API_ENDPOINTS.orders.checkoutSession(activeCartId, baseUrl), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify(payload),
        });

        const resData = await res.json();
        if (res.ok && resData.session?.url) {
          window.location.href = resData.session.url;
        } else {
          toast.error(resData.message || "Failed to initiate payment session.");
          setIsProcessing(false);
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Network error. Please try again.");
      setIsProcessing(false);
    }
  };

  if (isFetchingCart) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <FiLoader size={40} className="animate-spin text-[#F0AA4C] mb-4" />
        <p className="text-[#8B879A] font-bold">Preparing your secure checkout...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ── Page Title ── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1C2B] tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-sm text-[#8B879A] mt-1">
          Complete your order by providing your shipping and payment details.
        </p>
      </div>

      <form onSubmit={handleSubmit(onCheckout)} className="space-y-8">
        
        {/* ── Side by Side: Shipping + Payment ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* ── Shipping Address Box ── */}
        <div className="bg-white rounded-3xl overflow-hidden border border-[#EDEBF1] shadow-sm">
          {/* Header */}
          <div className="bg-[#3FA772] px-6 py-4 flex items-center gap-3">
            <FiMapPin size={20} className="text-white" />
            <div>
              <h2 className="text-white font-extrabold text-base tracking-wide">
                Shipping Address
              </h2>
              <p className="text-white/80 text-[11px] font-semibold">
                Where should we deliver your order?
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#EAF2FA] border border-[#C5DFF8] rounded-xl text-xs font-semibold text-[#2B6CB0]">
              <FiInfo size={16} className="shrink-0" />
              <span>Please ensure your address is accurate for smooth delivery.</span>
            </div>

            <div className="space-y-5">
              {/* City */}
              <div>
                <label className="block text-xs font-bold text-[#1E1C2B] mb-1.5">
                  City <span className="text-[#E8593C]">*</span>
                </label>
                <div className="relative">
                  <FiMapPin
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B879A]"
                  />
                  <input
                    type="text"
                    placeholder="e.g. Cairo, Alexandria, Giza"
                    {...register("city")}
                    className={`w-full h-11 pl-10 pr-4 rounded-xl bg-[#F7F6F9] text-sm text-[#1E1C2B] placeholder-[#8B879A] border outline-none transition-all ${
                      errors.city
                        ? "border-[#E8593C] focus:ring-2 focus:ring-[#E8593C]/20"
                        : "border-[#EDEBF1] focus:border-[#F0AA4C] focus:bg-white"
                    }`}
                  />
                </div>
                {errors.city && (
                  <p className="text-xs font-medium text-[#E8593C] mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              {/* Details / Street Address */}
              <div>
                <label className="block text-xs font-bold text-[#1E1C2B] mb-1.5">
                  Street Address <span className="text-[#E8593C]">*</span>
                </label>
                <div className="relative">
                  <FiMapPin
                    size={16}
                    className="absolute left-3.5 top-3.5 text-[#8B879A]"
                  />
                  <textarea
                    placeholder="Street name, building number, floor, apartment..."
                    {...register("details")}
                    className={`w-full h-24 pl-10 pr-4 pt-3 rounded-xl bg-[#F7F6F9] text-sm text-[#1E1C2B] placeholder-[#8B879A] border outline-none resize-none transition-all ${
                      errors.details
                        ? "border-[#E8593C] focus:ring-2 focus:ring-[#E8593C]/20"
                        : "border-[#EDEBF1] focus:border-[#F0AA4C] focus:bg-white"
                    }`}
                  />
                </div>
                {errors.details && (
                  <p className="text-xs font-medium text-[#E8593C] mt-1">
                    {errors.details.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-[#1E1C2B] mb-1.5">
                  Phone Number <span className="text-[#E8593C]">*</span>
                </label>
                <div className="relative">
                  <FiPhone
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B879A]"
                  />
                  <input
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    {...register("phone")}
                    className={`w-full h-11 pl-10 pr-4 rounded-xl bg-[#F7F6F9] text-sm text-[#1E1C2B] placeholder-[#8B879A] border outline-none transition-all ${
                      errors.phone
                        ? "border-[#E8593C] focus:ring-2 focus:ring-[#E8593C]/20"
                        : "border-[#EDEBF1] focus:border-[#F0AA4C] focus:bg-white"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs font-medium text-[#E8593C] mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Payment Method Box ── */}
        <div className="bg-white rounded-3xl overflow-hidden border border-[#EDEBF1] shadow-sm">
          {/* Header */}
          <div className="bg-[#3FA772] px-6 py-4 flex items-center gap-3">
            <FiDollarSign size={20} className="text-white" />
            <div>
              <h2 className="text-white font-extrabold text-base tracking-wide">
                Payment Method
              </h2>
              <p className="text-white/80 text-[11px] font-semibold">
                Choose how you'd like to pay
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-4">
            {/* Cash on Delivery Option */}
            <label
              className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                paymentMethod === "cash"
                  ? "border-[#3FA772] bg-[#3FA772]/5"
                  : "border-[#EDEBF1] hover:border-[#3FA772]/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    paymentMethod === "cash"
                      ? "bg-[#3FA772] text-white"
                      : "bg-[#F7F6F9] text-[#8B879A]"
                  }`}
                >
                  <FiDollarSign size={20} />
                </div>
                <div>
                  <h3
                    className={`text-sm sm:text-base font-extrabold ${
                      paymentMethod === "cash" ? "text-[#3FA772]" : "text-[#1E1C2B]"
                    }`}
                  >
                    Cash on Delivery
                  </h3>
                  <p className="text-xs text-[#8B879A] mt-0.5">
                    Pay when your order arrives at your doorstep
                  </p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  paymentMethod === "cash"
                    ? "border-[#3FA772] bg-[#3FA772]"
                    : "border-[#EDEBF1]"
                }`}
              >
                {paymentMethod === "cash" && <FiCheckCircle size={16} className="text-white" />}
              </div>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
                className="hidden"
              />
            </label>

            {/* Pay Online Option */}
            <label
              className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                paymentMethod === "online"
                  ? "border-[#1E1C2B] bg-[#1E1C2B]/5"
                  : "border-[#EDEBF1] hover:border-[#1E1C2B]/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    paymentMethod === "online"
                      ? "bg-[#1E1C2B] text-white"
                      : "bg-[#F7F6F9] text-[#8B879A]"
                  }`}
                >
                  <FiCreditCard size={20} />
                </div>
                <div>
                  <h3
                    className={`text-sm sm:text-base font-extrabold ${
                      paymentMethod === "online" ? "text-[#1E1C2B]" : "text-[#1E1C2B]"
                    }`}
                  >
                    Pay Online
                  </h3>
                  <p className="text-xs text-[#8B879A] mt-0.5">
                    Secure payment with Credit/Debit Card via Stripe
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#1A1F71] text-white">VISA</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#EB001B] text-white">MC</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#0070CE] text-white">AMEX</span>
                  </div>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  paymentMethod === "online"
                    ? "border-[#1E1C2B] bg-[#1E1C2B]"
                    : "border-[#EDEBF1]"
                }`}
              >
                {paymentMethod === "online" && <FiCheckCircle size={16} className="text-white" />}
              </div>
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
                className="hidden"
              />
            </label>

            {/* Security Notice */}
            <div className="flex items-center gap-3 px-5 py-4 bg-[#EAF8F1] border border-[#BCE4CD] rounded-2xl mt-4">
              <FiShield size={24} className="text-[#3FA772] shrink-0" />
              <div>
                <p className="text-sm font-bold text-[#2A724E]">Secure & Encrypted</p>
                <p className="text-[11px] font-semibold text-[#3FA772]">
                  Your payment info is protected with 256-bit SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Close Side-by-Side Grid ── */}
        </div>

        {/* ── Submit Button ── */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full sm:w-auto px-10 h-14 rounded-full bg-[#1E1C2B] text-[#F2EEE5] font-extrabold text-sm hover:bg-[#F0AA4C] hover:text-[#1E1C2B] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-lg"
          >
            {isProcessing ? (
              <>
                <FiLoader size={18} className="animate-spin text-[#F0AA4C]" />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <span>Complete Order</span>
                <FiArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
