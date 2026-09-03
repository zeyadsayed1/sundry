"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiLoader,
  FiStar,
  FiShield,
  FiTruck,
  FiShoppingBag,
} from "react-icons/fi";
import { FaGoogle, FaFacebook } from "react-icons/fa6";
import { API_ENDPOINTS } from "@/app/lib/api";
import { decodeJWT, storeAuthSession } from "@/app/lib/auth";
import type { UserSession } from "@/app/lib/types";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/slices/auth/authSlice";
import { signInSchema, type SignInFormData } from "./SignInForm.types";

export default function SignInForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.auth.signin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.message === "success") {
        toast.success("Welcome back to Sundry!");
        if (resData.token) {
          const decoded = decodeJWT(resData.token);
          const userSession: UserSession = {
            name: decoded?.name || resData.user?.name || "User",
            email: data.email,
            role: decoded?.role || resData.user?.role || "user",
            id: decoded?.id || decoded?._id || resData.user?._id,
          };
          await storeAuthSession(resData.token, userSession);
          dispatch(setCredentials({ user: userSession, token: resData.token }));
        }
        router.push("/");
        router.refresh();
      } else {
        toast.error(resData.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      {/* ── Left Side: Brand Showcase & Value Props ── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-5 flex flex-col gap-8"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E1C2B] text-[#F0AA4C] text-xs font-bold tracking-wide uppercase mb-4">
            <FiStar size={13} className="text-[#F0AA4C] fill-current" />
            <span>Welcome Back</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E1C2B] tracking-tight leading-[1.15]">
            Sign in to <span className="text-[#F0AA4C]">Sundry</span>
          </h1>

          <p className="text-base text-[#6B677A] mt-3 leading-relaxed">
            Access your orders, saved wishlist items, and personalized recommendations with a single click.
          </p>
        </div>

        {/* Feature List */}
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/80 border border-[#EDEBF1] shadow-xs">
            <div className="h-11 w-11 rounded-xl bg-[#F0AA4C]/15 text-[#F0AA4C] flex items-center justify-center shrink-0">
              <FiShoppingBag size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E1C2B]">Track Your Orders</h3>
              <p className="text-xs text-[#8B879A] mt-0.5">
                Real-time updates on your packages from checkout to doorstep.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/80 border border-[#EDEBF1] shadow-xs">
            <div className="h-11 w-11 rounded-xl bg-[#E8593C]/15 text-[#E8593C] flex items-center justify-center shrink-0">
              <FiTruck size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E1C2B]">Express Checkout</h3>
              <p className="text-xs text-[#8B879A] mt-0.5">
                Saved shipping addresses and payment methods for swift ordering.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/80 border border-[#EDEBF1] shadow-xs">
            <div className="h-11 w-11 rounded-xl bg-[#3FA772]/15 text-[#3FA772] flex items-center justify-center shrink-0">
              <FiShield size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E1C2B]">Encrypted Privacy</h3>
              <p className="text-xs text-[#8B879A] mt-0.5">
                Your account security and privacy are always our top priority.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Right Side: SignIn Form Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="lg:col-span-7"
      >
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EDEBF1] shadow-[0_10px_35px_rgba(30,28,43,0.06)]">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1C2B] tracking-tight">
              Sign In to Your Account
            </h2>
            <p className="text-sm text-[#8B879A] mt-1">
              Enter your email and password to access your dashboard
            </p>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => toast.info("Google Authentication will be connected soon!")}
              className="h-11 px-4 rounded-xl border border-[#EDEBF1] bg-[#F7F6F9] hover:bg-white hover:border-[#F0AA4C]/50 text-[#1E1C2B] text-xs font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-2xs"
            >
              <FaGoogle size={15} className="text-[#EA4335]" />
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => toast.info("Facebook Authentication will be connected soon!")}
              className="h-11 px-4 rounded-xl border border-[#EDEBF1] bg-[#F7F6F9] hover:bg-white hover:border-[#F0AA4C]/50 text-[#1E1C2B] text-xs font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-2xs"
            >
              <FaFacebook size={16} className="text-[#1877F2]" />
              <span>Continue with Facebook</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-full border-t border-[#EDEBF1]" />
            <span className="absolute bg-white px-3 text-[11px] font-bold text-[#8B879A] uppercase tracking-wider">
              or sign in with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-[#1E1C2B] mb-1.5">
                Email Address <span className="text-[#E8593C]">*</span>
              </label>
              <div className="relative">
                <FiMail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B879A]"
                />
                <input
                  type="email"
                  placeholder="ziad@example.com"
                  {...register("email")}
                  className={`w-full h-11 pl-10 pr-4 rounded-xl bg-[#F7F6F9] text-sm text-[#1E1C2B] placeholder-[#8B879A] border outline-none transition-all ${
                    errors.email
                      ? "border-[#E8593C] focus:ring-2 focus:ring-[#E8593C]/20 bg-[#E8593C]/5"
                      : "border-[#EDEBF1] focus:border-[#F0AA4C] focus:bg-white"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-[#E8593C] mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#1E1C2B]">
                  Password <span className="text-[#E8593C]">*</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-bold text-[#E8593C] hover:text-[#F0AA4C] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FiLock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B879A]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className={`w-full h-11 pl-10 pr-11 rounded-xl bg-[#F7F6F9] text-sm text-[#1E1C2B] placeholder-[#8B879A] border outline-none transition-all ${
                    errors.password
                      ? "border-[#E8593C] focus:ring-2 focus:ring-[#E8593C]/20 bg-[#E8593C]/5"
                      : "border-[#EDEBF1] focus:border-[#F0AA4C] focus:bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B879A] hover:text-[#1E1C2B] transition-colors"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-[#E8593C] mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="pt-1 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="h-4 w-4 rounded-md border-[#EDEBF1] text-[#1E1C2B] focus:ring-[#F0AA4C] accent-[#1E1C2B] cursor-pointer"
                />
                <span className="text-xs text-[#6B677A] font-medium">
                  Remember this device
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-2xl bg-[#1E1C2B] text-[#F2EEE5] font-extrabold text-sm hover:bg-[#F0AA4C] hover:text-[#1E1C2B] transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-4 active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <FiLoader size={18} className="animate-spin text-[#F0AA4C]" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Bottom link */}
          <div className="mt-8 pt-6 border-t border-[#EDEBF1] text-center text-xs text-[#8B879A]">
            Don't have an account yet?{" "}
            <Link
              href="/auth/sign-up"
              className="font-bold text-[#E8593C] hover:text-[#F0AA4C] transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
