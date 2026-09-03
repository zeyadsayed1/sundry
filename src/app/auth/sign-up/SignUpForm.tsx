"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiPhone,
  FiCheck,
  FiStar,
  FiTruck,
  FiShield,
  FiAward,
  FiArrowRight,
  FiLoader,
} from "react-icons/fi";
import { FaGoogle, FaFacebook } from "react-icons/fa6";
import { API_ENDPOINTS } from "@/app/lib/api";
import { decodeJWT, storeAuthSession } from "@/app/lib/auth";
import type { UserSession } from "@/app/lib/types";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/slices/auth/authSlice";
import { signUpSchema, type SignUpFormData } from "./SignUpForm.types";

export default function SignUpForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
  });

  const passwordValue = watch("password") || "";

  // Password strength calculator
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        rePassword: data.rePassword,
        phone: data.phone,
      };

      const response = await fetch(API_ENDPOINTS.auth.signup, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (response.ok && resData.message === "success") {
        toast.success("Account created successfully! Welcome to Sundry.");
        if (resData.token) {
          const decoded = decodeJWT(resData.token);
          const userSession: UserSession = {
            name: data.name,
            email: data.email,
            role: decoded?.role || "user",
            id: decoded?.id || decoded?._id,
          };
          await storeAuthSession(resData.token, userSession);
          dispatch(setCredentials({ user: userSession, token: resData.token }));
        }
        router.push("/");
        router.refresh();
      } else {
        toast.error(resData.message || "Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("Network error. Please check your connection and try again.");
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
            <span>Join 20,000+ Smart Shoppers</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E1C2B] tracking-tight leading-[1.15]">
            Welcome to <span className="text-[#E8593C]">Sundry</span>
          </h1>

          <p className="text-base text-[#6B677A] mt-3 leading-relaxed">
            Create your account to unlock personalized shopping, exclusive member discounts, and express doorstep delivery.
          </p>
        </div>

        {/* Feature List */}
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/80 border border-[#EDEBF1] shadow-xs">
            <div className="h-11 w-11 rounded-xl bg-[#F0AA4C]/15 text-[#F0AA4C] flex items-center justify-center shrink-0">
              <FiAward size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E1C2B]">Premium Curated Quality</h3>
              <p className="text-xs text-[#8B879A] mt-0.5">
                Hand-inspected products directly sourced from verified global brands.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/80 border border-[#EDEBF1] shadow-xs">
            <div className="h-11 w-11 rounded-xl bg-[#E8593C]/15 text-[#E8593C] flex items-center justify-center shrink-0">
              <FiTruck size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E1C2B]">Express Fast Delivery</h3>
              <p className="text-xs text-[#8B879A] mt-0.5">
                Reliable tracking with same-day & next-day options across Egypt.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/80 border border-[#EDEBF1] shadow-xs">
            <div className="h-11 w-11 rounded-xl bg-[#3FA772]/15 text-[#3FA772] flex items-center justify-center shrink-0">
              <FiShield size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E1C2B]">100% Secure Checkout</h3>
              <p className="text-xs text-[#8B879A] mt-0.5">
                Your personal data and payments are protected by industry-standard encryption.
              </p>
            </div>
          </div>
        </div>

        {/* Customer Testimonial Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1E1C2B] to-[#2C293B] text-[#F2EEE5] border border-[#3D3A4E] shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#F0AA4C] text-[#1E1C2B] font-extrabold text-sm flex items-center justify-center">
              ZS
            </div>
            <div>
              <p className="text-xs font-bold text-[#F2EEE5]">Ziad Sayed</p>
              <div className="flex text-[#F0AA4C] gap-0.5 text-xs">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar key={i} size={11} className="fill-current" />
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-[#8B879A] italic leading-relaxed">
            "Sundry has completely elevated my shopping experience. The quality is outstanding, and deliveries are always fast and accurate."
          </p>
        </div>
      </motion.div>

      {/* ── Right Side: SignUp Form Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="lg:col-span-7"
      >
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EDEBF1] shadow-[0_10px_35px_rgba(30,28,43,0.06)]">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1C2B] tracking-tight">
              Create Your Account
            </h2>
            <p className="text-sm text-[#8B879A] mt-1">
              Start your premium journey with us in less than a minute
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
              or register with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#1E1C2B] mb-1.5">
                Full Name <span className="text-[#E8593C]">*</span>
              </label>
              <div className="relative">
                <FiUser
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B879A]"
                />
                <input
                  type="text"
                  placeholder="e.g. Ziad Sayed"
                  {...register("name")}
                  className={`w-full h-11 pl-10 pr-4 rounded-xl bg-[#F7F6F9] text-sm text-[#1E1C2B] placeholder-[#8B879A] border outline-none transition-all ${
                    errors.name
                      ? "border-[#E8593C] focus:ring-2 focus:ring-[#E8593C]/20 bg-[#E8593C]/5"
                      : "border-[#EDEBF1] focus:border-[#F0AA4C] focus:bg-white"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-xs font-medium text-[#E8593C] mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

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
              <label className="block text-xs font-bold text-[#1E1C2B] mb-1.5">
                Password <span className="text-[#E8593C]">*</span>
              </label>
              <div className="relative">
                <FiLock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B879A]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
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

              {/* Password Strength Meter */}
              {passwordValue && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-[#8B879A]">Strength:</span>
                    <span
                      className={
                        passwordStrength <= 1
                          ? "text-[#E8593C]"
                          : passwordStrength <= 3
                          ? "text-[#F0AA4C]"
                          : "text-[#3FA772]"
                      }
                    >
                      {passwordStrength <= 1
                        ? "Weak"
                        : passwordStrength <= 3
                        ? "Moderate"
                        : "Strong"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#EDEBF1] rounded-full overflow-hidden flex gap-1">
                    <div
                      className={`h-full flex-1 rounded-full transition-all duration-300 ${
                        passwordStrength >= 1 ? "bg-[#E8593C]" : "bg-transparent"
                      }`}
                    />
                    <div
                      className={`h-full flex-1 rounded-full transition-all duration-300 ${
                        passwordStrength >= 2 ? "bg-[#F0AA4C]" : "bg-transparent"
                      }`}
                    />
                    <div
                      className={`h-full flex-1 rounded-full transition-all duration-300 ${
                        passwordStrength >= 4 ? "bg-[#3FA772]" : "bg-transparent"
                      }`}
                    />
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="text-xs font-medium text-[#E8593C] mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-[#1E1C2B] mb-1.5">
                Confirm Password <span className="text-[#E8593C]">*</span>
              </label>
              <div className="relative">
                <FiLock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B879A]"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  {...register("rePassword")}
                  className={`w-full h-11 pl-10 pr-11 rounded-xl bg-[#F7F6F9] text-sm text-[#1E1C2B] placeholder-[#8B879A] border outline-none transition-all ${
                    errors.rePassword
                      ? "border-[#E8593C] focus:ring-2 focus:ring-[#E8593C]/20 bg-[#E8593C]/5"
                      : "border-[#EDEBF1] focus:border-[#F0AA4C] focus:bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B879A] hover:text-[#1E1C2B] transition-colors"
                >
                  {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.rePassword && (
                <p className="text-xs font-medium text-[#E8593C] mt-1">
                  {errors.rePassword.message}
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
                  placeholder="01012345678"
                  {...register("phone")}
                  className={`w-full h-11 pl-10 pr-4 rounded-xl bg-[#F7F6F9] text-sm text-[#1E1C2B] placeholder-[#8B879A] border outline-none transition-all ${
                    errors.phone
                      ? "border-[#E8593C] focus:ring-2 focus:ring-[#E8593C]/20 bg-[#E8593C]/5"
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

            {/* Terms and conditions Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register("terms")}
                  className="mt-0.5 h-4 w-4 rounded-md border-[#EDEBF1] text-[#1E1C2B] focus:ring-[#F0AA4C] accent-[#1E1C2B] cursor-pointer"
                />
                <span className="text-xs text-[#6B677A] leading-relaxed">
                  I agree to Sundry's{" "}
                  <Link href="/terms" className="text-[#1E1C2B] font-bold underline hover:text-[#E8593C]">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#1E1C2B] font-bold underline hover:text-[#E8593C]">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.terms && (
                <p className="text-xs font-medium text-[#E8593C] mt-1">
                  {errors.terms.message}
                </p>
              )}
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create My Account</span>
                  <FiArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Bottom link */}
          <div className="mt-8 pt-6 border-t border-[#EDEBF1] text-center text-xs text-[#8B879A]">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="font-bold text-[#E8593C] hover:text-[#F0AA4C] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
