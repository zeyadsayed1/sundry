"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiKey,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiArrowLeft,
  FiCheck,
  FiLoader,
} from "react-icons/fi";
import { API_ENDPOINTS } from "@/app/lib/api";
import {
  emailSchema,
  codeSchema,
  newPasswordSchema,
  type EmailFormData,
  type CodeFormData,
  type NewPasswordFormData,
} from "./ForgotPasswordWizard.types";

export default function ForgotPasswordWizard() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [userEmail, setUserEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forms
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const codeForm = useForm<CodeFormData>({
    resolver: zodResolver(codeSchema),
  });

  const passwordForm = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
  });

  // ── Step 1: Send Reset Code ──
  const onSendEmail = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.auth.forgotPasswords, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const resData = await res.json();

      if (res.ok && (resData.statusMsg === "success" || resData.message === "Reset code sent to your email")) {
        setUserEmail(data.email);
        toast.success("Verification code sent to your email!");
        setStep(2);
      } else {
        toast.error(resData.message || "Email address not found.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2: Verify Reset Code ──
  const onVerifyCode = async (data: CodeFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.auth.verifyResetCode, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetCode: data.resetCode }),
      });

      const resData = await res.json();

      if (res.ok && resData.status === "Success") {
        setResetCode(data.resetCode);
        toast.success("Code verified successfully!");
        setStep(3);
      } else {
        toast.error(resData.message || "Invalid or expired reset code.");
      }
    } catch (error) {
      console.error("Verify code error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 3: Reset Password ──
  const onResetPassword = async (data: NewPasswordFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.auth.resetPassword, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          newPassword: data.newPassword,
        }),
      });

      const resData = await res.json();

      if (res.ok && (resData.token || resData.message === "success")) {
        toast.success("Password reset successfully! Please sign in with your new password.");
        router.push("/auth/sign-in");
      } else {
        toast.error(resData.message || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EDEBF1] shadow-[0_10px_35px_rgba(30,28,43,0.06)]">
      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#EDEBF1]">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
              step >= 1 ? "bg-[#1E1C2B] text-[#F0AA4C]" : "bg-[#F7F6F9] text-[#8B879A]"
            }`}
          >
            {step > 1 ? <FiCheck size={14} /> : "1"}
          </div>
          <span className="text-xs font-bold text-[#1E1C2B] hidden sm:inline">
            Email
          </span>
        </div>

        <div className="flex-1 h-0.5 bg-[#EDEBF1] mx-3 max-w-[40px]" />

        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
              step >= 2 ? "bg-[#1E1C2B] text-[#F0AA4C]" : "bg-[#F7F6F9] text-[#8B879A]"
            }`}
          >
            {step > 2 ? <FiCheck size={14} /> : "2"}
          </div>
          <span className="text-xs font-bold text-[#1E1C2B] hidden sm:inline">
            Verify Code
          </span>
        </div>

        <div className="flex-1 h-0.5 bg-[#EDEBF1] mx-3 max-w-[40px]" />

        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
              step === 3 ? "bg-[#1E1C2B] text-[#F0AA4C]" : "bg-[#F7F6F9] text-[#8B879A]"
            }`}
          >
            3
          </div>
          <span className="text-xs font-bold text-[#1E1C2B] hidden sm:inline">
            New Password
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ── STEP 1: Enter Email ── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-[#1E1C2B] tracking-tight">
                Forgot Your Password?
              </h2>
              <p className="text-xs sm:text-sm text-[#8B879A] mt-1.5 leading-relaxed">
                Enter your registered email address below, and we'll send you a 6-digit verification code to reset your password.
              </p>
            </div>

            <form onSubmit={emailForm.handleSubmit(onSendEmail)} className="space-y-4">
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
                    placeholder="e.g. ziadsayed493@gmail.com"
                    {...emailForm.register("email")}
                    className={`w-full h-11 pl-10 pr-4 rounded-xl bg-[#F7F6F9] text-sm text-[#1E1C2B] placeholder-[#8B879A] border outline-none transition-all ${
                      emailForm.formState.errors.email
                        ? "border-[#E8593C] focus:ring-2 focus:ring-[#E8593C]/20"
                        : "border-[#EDEBF1] focus:border-[#F0AA4C] focus:bg-white"
                    }`}
                  />
                </div>
                {emailForm.formState.errors.email && (
                  <p className="text-xs font-medium text-[#E8593C] mt-1">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-2xl bg-[#1E1C2B] text-[#F2EEE5] font-extrabold text-sm hover:bg-[#F0AA4C] hover:text-[#1E1C2B] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-4 shadow-md"
              >
                {isLoading ? (
                  <>
                    <FiLoader size={18} className="animate-spin text-[#F0AA4C]" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <FiArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* ── STEP 2: Verify Code ── */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-[#1E1C2B] tracking-tight">
                Enter Verification Code
              </h2>
              <p className="text-xs sm:text-sm text-[#8B879A] mt-1.5 leading-relaxed">
                We sent a 6-digit code to <span className="font-bold text-[#1E1C2B]">{userEmail}</span>. Please enter it below.
              </p>
            </div>

            <form onSubmit={codeForm.handleSubmit(onVerifyCode)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1E1C2B] mb-1.5">
                  Reset Code <span className="text-[#E8593C]">*</span>
                </label>
                <div className="relative">
                  <FiKey
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B879A]"
                  />
                  <input
                    type="text"
                    placeholder="e.g. 535863"
                    {...codeForm.register("resetCode")}
                    className={`w-full h-11 pl-10 pr-4 rounded-xl bg-[#F7F6F9] text-sm text-[#1E1C2B] placeholder-[#8B879A] border outline-none tracking-widest font-mono transition-all ${
                      codeForm.formState.errors.resetCode
                        ? "border-[#E8593C] focus:ring-2 focus:ring-[#E8593C]/20"
                        : "border-[#EDEBF1] focus:border-[#F0AA4C] focus:bg-white"
                    }`}
                  />
                </div>
                {codeForm.formState.errors.resetCode && (
                  <p className="text-xs font-medium text-[#E8593C] mt-1">
                    {codeForm.formState.errors.resetCode.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="h-12 px-5 rounded-2xl border border-[#EDEBF1] bg-[#F7F6F9] text-xs font-bold text-[#6B677A] hover:bg-[#EDEBF1] transition-colors"
                >
                  <FiArrowLeft size={16} />
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-12 rounded-2xl bg-[#1E1C2B] text-[#F2EEE5] font-extrabold text-sm hover:bg-[#F0AA4C] hover:text-[#1E1C2B] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-md"
                >
                  {isLoading ? (
                    <>
                      <FiLoader size={18} className="animate-spin text-[#F0AA4C]" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <FiArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ── STEP 3: Set New Password ── */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-[#1E1C2B] tracking-tight">
                Set New Password
              </h2>
              <p className="text-xs sm:text-sm text-[#8B879A] mt-1.5 leading-relaxed">
                Choose a strong new password for your account.
              </p>
            </div>

            <form onSubmit={passwordForm.handleSubmit(onResetPassword)} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-[#1E1C2B] mb-1.5">
                  New Password <span className="text-[#E8593C]">*</span>
                </label>
                <div className="relative">
                  <FiLock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B879A]"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    {...passwordForm.register("newPassword")}
                    className={`w-full h-11 pl-10 pr-11 rounded-xl bg-[#F7F6F9] text-sm text-[#1E1C2B] placeholder-[#8B879A] border outline-none transition-all ${
                      passwordForm.formState.errors.newPassword
                        ? "border-[#E8593C] focus:ring-2 focus:ring-[#E8593C]/20"
                        : "border-[#EDEBF1] focus:border-[#F0AA4C] focus:bg-white"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B879A] hover:text-[#1E1C2B]"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-xs font-medium text-[#E8593C] mt-1">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-[#1E1C2B] mb-1.5">
                  Confirm New Password <span className="text-[#E8593C]">*</span>
                </label>
                <div className="relative">
                  <FiLock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B879A]"
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    {...passwordForm.register("confirmPassword")}
                    className={`w-full h-11 pl-10 pr-11 rounded-xl bg-[#F7F6F9] text-sm text-[#1E1C2B] placeholder-[#8B879A] border outline-none transition-all ${
                      passwordForm.formState.errors.confirmPassword
                        ? "border-[#E8593C] focus:ring-2 focus:ring-[#E8593C]/20"
                        : "border-[#EDEBF1] focus:border-[#F0AA4C] focus:bg-white"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B879A] hover:text-[#1E1C2B]"
                  >
                    {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-xs font-medium text-[#E8593C] mt-1">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-2xl bg-[#1E1C2B] text-[#F2EEE5] font-extrabold text-sm hover:bg-[#3FA772] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-4 shadow-md"
              >
                {isLoading ? (
                  <>
                    <FiLoader size={18} className="animate-spin text-[#F0AA4C]" />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <span>Set New Password & Sign In</span>
                    <FiCheck size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to sign in link */}
      <div className="mt-8 pt-6 border-t border-[#EDEBF1] text-center text-xs text-[#8B879A]">
        Remember your password?{" "}
        <Link
          href="/auth/sign-in"
          className="font-bold text-[#E8593C] hover:text-[#F0AA4C] transition-colors"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
