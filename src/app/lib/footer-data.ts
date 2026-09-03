import { FaFacebook, FaXTwitter, FaInstagram, FaYoutube } from "react-icons/fa6";
import type { FooterNavLink, FooterSection, SocialLink } from "./footer-data.types";

export type { FooterNavLink, FooterSection, SocialLink } from "./footer-data.types";

export const FOOTER_LINKS: FooterSection[] = [
  {
    heading: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Categories", href: "/categories" },
      { label: "Brands", href: "/brands" },
      { label: "Electronics", href: "/categories/electronics" },
      { label: "Men's Fashion", href: "/categories/mens-fashion" },
      { label: "Women's Fashion", href: "/categories/womens-fashion" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "My Account", href: "/account" },
      { label: "Order History", href: "/account/orders" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Shopping Cart", href: "/cart" },
      { label: "Sign In", href: "/auth/sign-in" },
      { label: "Create Account", href: "/auth/sign-up" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Help Center", href: "/help" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Returns & Refunds", href: "/returns" },
      { label: "Track Order", href: "/track" },
    ],
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { icon: FaFacebook,  label: "Facebook",    href: "#" },
  { icon: FaXTwitter,  label: "Twitter / X", href: "#" },
  { icon: FaInstagram, label: "Instagram",   href: "#" },
  { icon: FaYoutube,   label: "YouTube",     href: "#" },
];

export const LEGAL_LINKS: FooterNavLink[] = [
  { label: "Privacy Policy",   href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy",    href: "/cookies" },
];
