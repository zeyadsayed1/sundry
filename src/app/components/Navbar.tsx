"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiChevronDown,
  FiHeadphones,
  FiLogIn,
  FiLogOut,
  FiUserPlus,
  FiPackage,
  FiSettings,
} from "react-icons/fi";
import { toast } from "sonner";
import { NAV_LINKS } from "@/app/lib/nav-data";
import Logo from "@/app/components/Logo";
import { getStoredUser, getStoredToken, clearAuthSession } from "@/app/lib/auth";
import type { UserSession } from "@/app/lib/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, setCredentials } from "@/redux/slices/auth/authSlice";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);

  const userMenuRef = useRef<HTMLDivElement>(null);

  const reduxUser = useAppSelector((state) => state.auth.user);
  const cartCount = useAppSelector((state) => state.cart.totalQuantity);
  const wishlistCount = useAppSelector((state) => state.wishlist.items.length);

  const currentUser = reduxUser || user;
  const isLoggedIn = !!currentUser;

  useEffect(() => {
    setMounted(true);

    const restoreSession = async () => {
      const stored = getStoredUser();
      if (!stored) return;

      setUser(stored);
      const token = await getStoredToken();
      if (token) {
        dispatch(setCredentials({ user: stored, token }));
      }
    };

    void restoreSession();
  }, [dispatch]);

  // Listen to storage events to sync login state across tabs/actions
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = getStoredUser();
      setUser(stored);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSignOut = () => {
    clearAuthSession();
    dispatch(logout());
    setUser(null);
    setUserMenuOpen(false);
    setMobileOpen(false);
    toast.success("Signed out successfully");
    router.push("/auth/sign-in");
  };

  return (
    <>
      {/* ── Announcement Bar ── */}
      <div className="relative overflow-hidden text-[#F2EEE5] text-xs" style={{ background: "#E8593C" }}>
        <div className="absolute inset-0 opacity-20" style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)", backgroundSize: "200% 100%", animation: "shimmer 4s infinite" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 overflow-hidden">
            <span className="flex items-center gap-1.5 whitespace-nowrap font-semibold">
              <span className="opacity-70">✦</span>
              Free Shipping on Orders 500 EGP
            </span>
            <span className="hidden sm:flex items-center gap-1.5 whitespace-nowrap font-medium opacity-80">
              <span>✦</span>
              New Arrivals Daily
            </span>
          </div>
          <div className="hidden md:flex items-center gap-5 shrink-0 font-medium">
            <a
              href="tel:+18001234567"
              className="flex items-center gap-1.5 hover:opacity-70 transition-opacity duration-200"
            >
              <span>+1 (800) 123-4567</span>
            </a>
            <span className="opacity-40">|</span>
            <a
              href="mailto:support@sundry.com"
              className="hover:opacity-70 transition-opacity duration-200"
            >
              support@sundry.com
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#1E1C2B]/95 shadow-[0_4px_30px_rgba(0,0,0,0.3)] backdrop-blur-md"
            : "bg-[#1E1C2B]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">

            {/* ── Logo ── */}
            <Link href="/" aria-label="Sundry home" className="group shrink-0 mr-4">
              <Logo size={36} />
            </Link>

            {/* ── Desktop Nav Links ── */}
            <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.label} className="relative">
                    <button
                      id="categories-menu-btn"
                      aria-expanded={categoriesOpen}
                      aria-haspopup="true"
                      onClick={() => setCategoriesOpen((v) => !v)}
                      onBlur={() =>
                        setTimeout(() => setCategoriesOpen(false), 150)
                      }
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-[#F2EEE5]/80 hover:text-[#F0AA4C] hover:bg-white/5 transition-all duration-200"
                    >
                      {link.label}
                      <FiChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${categoriesOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {categoriesOpen && (
                      <div
                        role="menu"
                        aria-labelledby="categories-menu-btn"
                        className="absolute top-full left-0 mt-2 w-52 py-1.5 rounded-xl bg-[#2C293B] border border-[#3D3A4E] shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            role="menuitem"
                            className="block px-4 py-2.5 text-sm text-[#F2EEE5]/80 hover:text-[#F0AA4C] hover:bg-white/5 transition-all duration-150"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-[#F2EEE5]/80 hover:text-[#F0AA4C] hover:bg-white/5 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* ── Spacer ── */}
            <div className="flex-1" />

            {/* ── Desktop Right Icons ── */}

            <div className="hidden lg:flex items-center gap-1">
              {/* Support */}
              <a
                href="tel:+18001234567"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors duration-200 group"
                aria-label="Support 24/7"
              >
                <FiHeadphones
                  size={18}
                  className="text-[#F0AA4C] group-hover:text-[#E8593C] transition-colors duration-200"
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] text-[#8B879A]">Support</span>
                  <span className="text-xs font-semibold text-[#F2EEE5]">24/7 Help</span>
                </div>
              </a>

              <div className="w-px h-6 bg-[#3D3A4E] mx-1" />

              {/* Wishlist */}
              <Link
                href="/wishlist"
                id="navbar-wishlist"
                aria-label="Wishlist"
                className="relative h-9 w-9 flex items-center justify-center rounded-full text-[#F2EEE5]/70 hover:text-[#E8593C] hover:bg-white/5 transition-all duration-200"
              >
                <FiHeart size={18} />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-[#E8593C] text-[#F2EEE5] text-[10px] font-bold leading-none animate-scale-in">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                id="navbar-cart"
                aria-label="Shopping cart"
                className="relative h-9 w-9 flex items-center justify-center rounded-full text-[#F2EEE5]/70 hover:text-[#F0AA4C] hover:bg-white/5 transition-all duration-200"
              >
                <FiShoppingCart size={18} />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-[#F0AA4C] text-[#1E1C2B] text-[10px] font-bold leading-none animate-scale-in">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* ── User Dropdown (Sign In / Sign Out) ── */}
              <div className="relative" ref={userMenuRef}>
                <button
                  id="navbar-account"
                  aria-label="User Account Menu"
                  aria-expanded={userMenuOpen}
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className={`h-9 ${
                    isLoggedIn ? "px-2.5" : "w-9"
                  } flex items-center justify-center gap-2 rounded-full bg-[#2C293B] border transition-all duration-200 cursor-pointer ${
                    userMenuOpen || isLoggedIn
                      ? "border-[#F0AA4C] text-[#F0AA4C]"
                      : "border-[#3D3A4E] text-[#F2EEE5]/70 hover:text-[#F0AA4C] hover:border-[#F0AA4C]/40"
                  }`}
                >
                  {isLoggedIn ? (
                    <>
                      <div className="w-5 h-5 rounded-full bg-[#F0AA4C] text-[#1E1C2B] font-extrabold text-[10px] flex items-center justify-center shrink-0 uppercase">
                        {currentUser?.name ? currentUser.name.charAt(0) : "U"}
                      </div>
                      <span className="text-xs font-bold text-[#F2EEE5] max-w-[100px] truncate hidden xl:inline">
                        {currentUser?.name?.split(" ")[0]}
                      </span>
                      <FiChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${
                          userMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </>
                  ) : (
                    <FiUser size={16} />
                  )}
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 py-2 rounded-2xl bg-[#2C293B] border border-[#3D3A4E] shadow-[0_12px_36px_rgba(0,0,0,0.5)] z-50 animate-scale-in">
                    {isLoggedIn ? (
                      <>
                        <div className="px-4 py-3 border-b border-[#3D3A4E]/70 mb-1">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-[#F0AA4C] text-[#1E1C2B] font-extrabold text-xs flex items-center justify-center shrink-0 uppercase">
                              {currentUser?.name ? currentUser.name.slice(0, 2) : "U"}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#F2EEE5] truncate">
                                {currentUser?.name || "User"}
                              </p>
                              {currentUser?.email && (
                                <p className="text-[11px] text-[#8B879A] truncate">
                                  {currentUser.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <Link
                          href="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#F2EEE5]/80 hover:text-[#F0AA4C] hover:bg-white/5 transition-all"
                        >
                          <FiSettings size={15} />
                          <span>Settings</span>
                        </Link>

                        <Link
                          href="/account/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#F2EEE5]/80 hover:text-[#F0AA4C] hover:bg-white/5 transition-all"
                        >
                          <FiPackage size={15} />
                          <span>Order History</span>
                        </Link>

                        <div className="my-1 border-t border-[#3D3A4E]/70" />

                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[#E8593C] hover:bg-[#E8593C]/10 transition-all cursor-pointer text-left"
                        >
                          <FiLogOut size={15} />
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2 border-b border-[#3D3A4E]/70 mb-1">
                          <p className="text-xs font-bold text-[#F2EEE5]">Welcome to Sundry</p>
                          <p className="text-[11px] text-[#8B879A]">Sign in to your account</p>
                        </div>

                        <Link
                          href="/auth/sign-in"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[#F0AA4C] hover:bg-[#F0AA4C]/10 transition-all"
                        >
                          <FiLogIn size={15} />
                          <span>Sign In</span>
                        </Link>

                        <Link
                          href="/auth/sign-up"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#F2EEE5]/80 hover:text-[#F0AA4C] hover:bg-white/5 transition-all"
                        >
                          <FiUserPlus size={15} />
                          <span>Create Account</span>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Mobile Right Icons ── */}
            <div className="flex lg:hidden items-center gap-1">
              <Link
                href="/wishlist"
                id="navbar-mobile-wishlist"
                aria-label="Wishlist"
                className="relative h-9 w-9 flex items-center justify-center rounded-full text-[#F2EEE5]/70 hover:text-[#E8593C] hover:bg-white/5 transition-all duration-200"
              >
                <FiHeart size={18} />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-[#E8593C] text-[#F2EEE5] text-[10px] font-bold leading-none">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                id="navbar-mobile-cart"
                aria-label="Shopping cart"
                className="relative h-9 w-9 flex items-center justify-center rounded-full text-[#F2EEE5]/70 hover:text-[#F0AA4C] hover:bg-white/5 transition-all duration-200"
              >
                <FiShoppingCart size={18} />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-[#F0AA4C] text-[#1E1C2B] text-[10px] font-bold leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                id="navbar-mobile-menu"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
                className="h-9 w-9 flex items-center justify-center rounded-full text-[#F2EEE5] hover:bg-white/5 transition-all duration-200"
              >
                {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>

        </div>

        {/* ── Mobile Menu Drawer ── */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 border-t ${
            mobileOpen
              ? "max-h-screen opacity-100 border-[#2C293B]"
              : "max-h-0 opacity-0 border-transparent"
          }`}
        >
          <nav
            aria-label="Mobile navigation"
            className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-1"
          >
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <button
                    id="mobile-categories-btn"
                    aria-expanded={mobileCategoriesOpen}
                    onClick={() => setMobileCategoriesOpen((v) => !v)}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold text-[#F2EEE5]/80 hover:text-[#F0AA4C] hover:bg-white/5 transition-all duration-200"
                  >
                    {link.label}
                    <FiChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${mobileCategoriesOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      mobileCategoriesOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-[#3D3A4E] pl-4">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-2.5 text-sm text-[#F2EEE5]/60 hover:text-[#F0AA4C] transition-colors duration-150"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-semibold text-[#F2EEE5]/80 hover:text-[#F0AA4C] hover:bg-white/5 transition-all duration-200"
                >
                  {link.label}
                </Link>
              )
            )}

            {/* Mobile Account & Sign In / Out */}
            <div className="mt-3 pt-3 border-t border-[#2C293B] flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <div className="px-4 py-3 rounded-2xl bg-[#2C293B] border border-[#3D3A4E] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F0AA4C] text-[#1E1C2B] font-extrabold text-sm flex items-center justify-center shrink-0 uppercase">
                      {currentUser?.name ? currentUser.name.slice(0, 2) : "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#F2EEE5] truncate">
                        {currentUser?.name || "User"}
                      </p>
                      {currentUser?.email && (
                        <p className="text-xs text-[#8B879A] truncate">
                          {currentUser.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#F2EEE5]/80 hover:text-[#F0AA4C] hover:bg-white/5 transition-all duration-200"
                  >
                    <FiSettings size={16} className="text-[#8B879A]" />
                    Settings
                  </Link>

                  <Link
                    href="/account/orders"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#F2EEE5]/80 hover:text-[#F0AA4C] hover:bg-white/5 transition-all duration-200"
                  >
                    <FiPackage size={16} className="text-[#8B879A]" />
                    Order History
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#E8593C] hover:bg-[#E8593C]/10 transition-all duration-200 text-left cursor-pointer"
                  >
                    <FiLogOut size={16} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/sign-in"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#F0AA4C] hover:bg-white/5 transition-all duration-200"
                  >
                    <FiLogIn size={16} />
                    Sign In
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#F2EEE5]/80 hover:text-[#F0AA4C] hover:bg-white/5 transition-all duration-200"
                  >
                    <FiUserPlus size={16} className="text-[#8B879A]" />
                    Create Account
                  </Link>
                </>
              )}

              <a
                href="tel:+18001234567"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#F2EEE5]/80 hover:text-[#F0AA4C] hover:bg-white/5 transition-all duration-200"
              >
                <FiHeadphones size={16} className="text-[#F0AA4C]" />
                Support 24/7
              </a>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
