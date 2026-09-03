"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiSave,
  FiShield,
  FiCheck,
  FiLoader,
  FiArrowRight,
} from "react-icons/fi";
import { API_ENDPOINTS } from "@/app/lib/api";
import { getStoredToken, getStoredUser, storeAuthSession } from "@/app/lib/auth";
import type { UserSession } from "@/app/lib/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCredentials } from "@/redux/slices/auth/authSlice";
import {
  profileSchema,
  passwordSchema,
  type ProfileFormData,
  type PasswordFormData,
  type AccountTab,
} from "./AccountSettingsClient.types";

export default function AccountSettingsClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);

  const [activeTab, setActiveTab] = useState<AccountTab>("profile");
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserSession | null>(null);

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    setMounted(true);
    const restoreAccount = async () => {
      const storedToken = await getStoredToken();
      const storedUser = getStoredUser();

      if (!storedToken) {
        router.push("/auth/sign-in");
        return;
      }

      setToken(storedToken);
      setUser(storedUser);

      if (storedUser) {
        resetProfile({
          name: storedUser.name || "",
          email: storedUser.email || "",
          phone: (storedUser as { phone?: string }).phone || "",
        });
      }
    };

    void restoreAccount();
  }, [router, resetProfile]);

  const currentUser = reduxUser || user;

  // ── 1. Update Profile Information ──
  const onUpdateProfile = async (data: ProfileFormData) => {
    if (!token) return;
    setIsUpdatingProfile(true);

    try {
      const response = await fetch(API_ENDPOINTS.users.updateMe, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.message === "success") {
        const updatedUser: UserSession = {
          name: data.name,
          email: data.email,
          id: currentUser?.id,
          role: currentUser?.role,
        };
        (updatedUser as any).phone = data.phone;

        await storeAuthSession(token, updatedUser);
        dispatch(setCredentials({ user: updatedUser, token }));
        setUser(updatedUser);

        toast.success("Profile updated successfully!");
      } else {
        toast.error(resData.message || "Failed to update profile details.");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // ── 2. Change Password ──
  const onChangePassword = async (data: PasswordFormData) => {
    if (!token) return;
    setIsUpdatingPassword(true);

    try {
      const response = await fetch(API_ENDPOINTS.users.changeMyPassword, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          password: data.password,
          rePassword: data.rePassword,
        }),
      });

      const resData = await response.json();

      if (response.ok && (resData.message === "success" || resData.token)) {
        if (resData.token) {
          setToken(resData.token);
          if (currentUser) {
            await storeAuthSession(resData.token, currentUser);
            dispatch(setCredentials({ user: currentUser, token: resData.token }));
          }
        }
        resetPassword();
        toast.success("Password changed successfully!");
      } else {
        toast.error(resData.message || "Failed to change password. Please check your current password.");
      }
    } catch (error) {
      console.error("Change password error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1E1C2B] tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-[#8B879A] mt-1">
          Manage your personal details, email preferences, and password security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Left Sidebar Navigation ── */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#EDEBF1] shadow-sm space-y-6">
          {/* User Info Header Card */}
          <div className="flex items-center gap-3.5 pb-6 border-b border-[#EDEBF1]">
            <div className="w-12 h-12 rounded-2xl bg-[#F0AA4C] text-[#1E1C2B] font-extrabold text-base flex items-center justify-center shrink-0 uppercase shadow-xs">
              {currentUser?.name ? currentUser.name.slice(0, 2) : "U"}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-[#1E1C2B] truncate">
                {currentUser?.name || "User"}
              </h2>
              <p className="text-xs text-[#8B879A] truncate mt-0.5">
                {currentUser?.email || ""}
              </p>
            </div>
          </div>

          {/* Tab Buttons */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-[#1E1C2B] text-[#F2EEE5] shadow-sm"
                  : "text-[#6B677A] hover:bg-[#F7F6F9] hover:text-[#1E1C2B]"
              }`}
            >
              <FiUser size={16} className={activeTab === "profile" ? "text-[#F0AA4C]" : ""} />
              <span>Personal Information</span>
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "security"
                  ? "bg-[#1E1C2B] text-[#F2EEE5] shadow-sm"
                  : "text-[#6B677A] hover:bg-[#F7F6F9] hover:text-[#1E1C2B]"
              }`}
            >
              <FiShield size={16} className={activeTab === "security" ? "text-[#E8593C]" : ""} />
              <span>Password & Security</span>
            </button>
          </nav>
        </div>

        {/* ── Right Content Area ── */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-[#EDEBF1] shadow-sm">
          {activeTab === "profile" ? (
            <div>
              <div className="mb-6 pb-4 border-b border-[#EDEBF1]">
                <h2 className="text-xl font-extrabold text-[#1E1C2B] tracking-tight">
                  Personal Information
                </h2>
                <p className="text-xs text-[#8B879A] mt-1">
                  Update your contact details to ensure smooth order deliveries.
                </p>
              </div>

              <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-5">
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
                      placeholder="Ahmed Abd Al-Muti"
                      {...registerProfile("name")}
                      className={`w-full h-11 pl-10 pr-4 rounded-xl bg-[#F7F6F9] text-sm text-[#1E1C2B] placeholder-[#8B879A] border outline-none transition-all ${
                        profileErrors.name
                          ? "border-[#E8593C] focus:ring-2 focus:ring-[#E8593C]/20"
                          : "border-[#EDEBF1] focus:border-[#F0AA4C] focus:bg-white"
                      }`}
                    />
                  </div>
                  {profileErrors.name && (
                    <p className="text-xs font-medium text-[#E8593C] mt-1">
                      {profileErrors.name.message}
                    </p>
                  )}
                </div>

                {/* Email Address */}
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
                      placeholder="ziadsayed493@gmail.com"
                      {...registerProfile("email")}
                      className={`w-full h-11 pl-10 pr-4 rounded-xl bg-[#F7F6F9] text-sm text-[#1E1C2B] placeholder-[#8B879A] border outline-none transition-all ${
                        profileErrors.email
                          ? "border-[#E8593C] focus:ring-2 focus:ring-[#E8593C]/20"
                          : "border-[#EDEBF1] focus:border-[#F0AA4C] focus:bg-white"
                      }`}
                    />
                  </div>
                  {profileErrors.email && (
                    <p className="text-xs font-medium text-[#E8593C] mt-1">
                      {profileErrors.email.message}
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
                      placeholder="01010700700"
                      {...registerProfile("phone")}
                      className={`w-full h-11 pl-10 pr-4 rounded-xl bg-[#F7F6F9] text-sm text-[#1E1C2B] placeholder-[#8B879A] border outline-none transition-all ${
                        profileErrors.phone
                          ? "border-[#E8593C] focus:ring-2 focus:ring-[#E8593C]/20"
                          : "border-[#EDEBF1] focus:border-[#F0AA4C] focus:bg-white"
                      }`}
                    />
                  </div>
                  {profileErrors.phone && (
                    <p className="text-xs font-medium text-[#E8593C] mt-1">
                      {profileErrors.phone.message}
                    </p>
                  )}
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-[#EDEBF1]">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="h-11 px-6 rounded-2xl bg-[#1E1C2B] text-[#F2EEE5] font-bold text-xs hover:bg-[#F0AA4C] hover:text-[#1E1C2B] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60 shadow-sm"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <FiLoader size={15} className="animate-spin text-[#F0AA4C]" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <FiSave size={15} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <div className="mb-6 pb-4 border-b border-[#EDEBF1]">
                <h2 className="text-xl font-extrabold text-[#1E1C2B] tracking-tight">
                  Password & Security
                </h2>
                <p className="text-xs text-[#8B879A] mt-1">
                  Ensure your account stays protected by using a strong password.
                </p>
              </div>

              <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-5">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-bold text-[#1E1C2B] mb-1.5">
                    Current Password <span className="text-[#E8593C]">*</span>
                  </label>
                  <div className="relative">
                    <FiLock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B879A]"
                    />
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      placeholder="Enter your current password"
                      {...registerPassword("currentPassword")}
                      className={`w-full h-11 pl-10 pr-11 rounded-xl bg-[#F7F6F9] text-sm text-[#1E1C2B] placeholder-[#8B879A] border outline-none transition-all ${
                        passwordErrors.currentPassword
                          ? "border-[#E8593C] focus:ring-2 focus:ring-[#E8593C]/20"
                          : "border-[#EDEBF1] focus:border-[#F0AA4C] focus:bg-white"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B879A] hover:text-[#1E1C2B] transition-colors"
                    >
                      {showCurrentPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-xs font-medium text-[#E8593C] mt-1">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

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
                      type={showNewPass ? "text" : "password"}
                      placeholder="Enter new password (min. 6 chars)"
                      {...registerPassword("password")}
                      className={`w-full h-11 pl-10 pr-11 rounded-xl bg-[#F7F6F9] text-sm text-[#1E1C2B] placeholder-[#8B879A] border outline-none transition-all ${
                        passwordErrors.password
                          ? "border-[#E8593C] focus:ring-2 focus:ring-[#E8593C]/20"
                          : "border-[#EDEBF1] focus:border-[#F0AA4C] focus:bg-white"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B879A] hover:text-[#1E1C2B] transition-colors"
                    >
                      {showNewPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {passwordErrors.password && (
                    <p className="text-xs font-medium text-[#E8593C] mt-1">
                      {passwordErrors.password.message}
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
                      type={showConfirmPass ? "text" : "password"}
                      placeholder="Re-enter new password"
                      {...registerPassword("rePassword")}
                      className={`w-full h-11 pl-10 pr-11 rounded-xl bg-[#F7F6F9] text-sm text-[#1E1C2B] placeholder-[#8B879A] border outline-none transition-all ${
                        passwordErrors.rePassword
                          ? "border-[#E8593C] focus:ring-2 focus:ring-[#E8593C]/20"
                          : "border-[#EDEBF1] focus:border-[#F0AA4C] focus:bg-white"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B879A] hover:text-[#1E1C2B] transition-colors"
                    >
                      {showConfirmPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {passwordErrors.rePassword && (
                    <p className="text-xs font-medium text-[#E8593C] mt-1">
                      {passwordErrors.rePassword.message}
                    </p>
                  )}
                </div>

                {/* Change Password Button */}
                <div className="pt-4 border-t border-[#EDEBF1]">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="h-11 px-6 rounded-2xl bg-[#1E1C2B] text-[#F2EEE5] font-bold text-xs hover:bg-[#E8593C] hover:text-white transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60 shadow-sm"
                  >
                    {isUpdatingPassword ? (
                      <>
                        <FiLoader size={15} className="animate-spin text-[#F0AA4C]" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <FiLock size={15} />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
