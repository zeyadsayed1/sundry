import Link from "next/link";
import {
  FiTruck,
  FiRotateCcw,
  FiShield,
  FiHeadphones,
  FiPhone,
  FiMail,
  FiMapPin,
  FiArrowRight,
} from "react-icons/fi";
import Logo from "./Logo";
import {
  FOOTER_LINKS,
  SOCIAL_LINKS,
  LEGAL_LINKS,
} from "@/app/lib/footer-data";
import type { FooterPerk } from "./Footer.types";

const PERKS: FooterPerk[] = [
  {
    icon: FiTruck,
    title: "Free Shipping",
    subtitle: "On orders over 500 EGP",
    accent: "#F0AA4C",
  },
  {
    icon: FiRotateCcw,
    title: "Easy Returns",
    subtitle: "14-day return policy",
    accent: "#E8593C",
  },
  {
    icon: FiShield,
    title: "Secure Payment",
    subtitle: "100% secure checkout",
    accent: "#F0AA4C",
  },
  {
    icon: FiHeadphones,
    title: "24/7 Support",
    subtitle: "Contact us anytime",
    accent: "#E8593C",
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer aria-label="Site footer">
      {/* ── Perks Strip ── */}
      <div className="bg-[#2C293B] border-y border-[#3D3A4E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {PERKS.map(({ icon: PerkIcon, title, subtitle, accent }) => (
              <div key={title} className="flex items-center gap-4 group">
                <div
                  className="flex items-center justify-center h-12 w-12 shrink-0 rounded-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
                >
                  <PerkIcon size={22} color={accent} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#F2EEE5]">{title}</p>
                  <p className="text-xs text-[#8B879A] mt-0.5">{subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Footer Body ── */}
      <div className="bg-[#1E1C2B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr] gap-12">
            {/* ── Brand Column ── */}
            <div className="flex flex-col gap-6">
              <Link href="/" aria-label="Sundry home" className="flex items-center gap-3 w-fit group">
              <Logo/>
                {/* <span className="text-[#F2EEE5] font-extrabold text-2xl tracking-tight group-hover:text-[#F0AA4C] transition-colors duration-200">
                  Sundry
                </span> */}
              </Link>

              <p className="text-sm text-[#8B879A] leading-relaxed max-w-xs">
                Your one-stop destination for quality products. From fashion to
                electronics, we bring the best brands at competitive prices.
              </p>

              <div>
                <p className="text-xs font-semibold text-[#F2EEE5]/60 uppercase tracking-widest mb-3">
                  Stay in the loop
                </p>
                <div className="flex h-10 rounded-full overflow-hidden border border-[#3D3A4E] focus-within:border-[#F0AA4C] transition-colors duration-200">
                  <input
                    id="footer-newsletter"
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 min-w-0 bg-transparent px-4 text-sm text-[#F2EEE5] placeholder-[#524F63] outline-none"
                    aria-label="Email for newsletter"
                  />
                  <button
                    aria-label="Subscribe to newsletter"
                    className="flex items-center justify-center px-4 shrink-0 bg-[#F0AA4C] hover:bg-[#E8593C] text-[#1E1C2B] transition-colors duration-200"
                  >
                    <FiArrowRight size={16} />
                  </button>
                </div>
              </div>

              <ul className="flex flex-col gap-3 text-sm">
                <li>
                  <a
                    href="tel:+18001234567"
                    className="flex items-center gap-3 text-[#8B879A] hover:text-[#F0AA4C] transition-colors duration-200"
                  >
                    <FiPhone size={14} className="text-[#F0AA4C] shrink-0" />
                    +1 (800) 123-4567
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@sundry.com"
                    className="flex items-center gap-3 text-[#8B879A] hover:text-[#F0AA4C] transition-colors duration-200"
                  >
                    <FiMail size={14} className="text-[#F0AA4C] shrink-0" />
                    support@sundry.com
                  </a>
                </li>
                <li className="flex items-start gap-3 text-[#8B879A]">
                  <FiMapPin size={14} className="text-[#F0AA4C] shrink-0 mt-0.5" />
                  123 Commerce Street, New York, NY 10001
                </li>
              </ul>

              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map(({ icon: SocialIcon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="h-9 w-9 flex items-center justify-center rounded-xl bg-[#2C293B] border border-[#3D3A4E] text-[#8B879A] hover:text-[#F0AA4C] hover:border-[#F0AA4C]/40 hover:bg-[#F0AA4C]/10 transition-all duration-200"
                  >
                    <SocialIcon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* ── Link Columns ── */}
            {FOOTER_LINKS.map(({ heading, links }) => (
              <div key={heading}>
                <h3 className="text-sm font-bold text-[#F2EEE5] mb-5 tracking-wide">
                  {heading}
                </h3>
                <ul className="flex flex-col gap-3">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-sm text-[#8B879A] hover:text-[#F0AA4C] transition-colors duration-200 hover:translate-x-0.5 inline-block"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-[#2C293B]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[#524F63]">
              © {new Date().getFullYear()} Sundry. All rights reserved.
            </p>
            <nav aria-label="Legal links" className="flex items-center gap-5">
              {LEGAL_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-xs text-[#524F63] hover:text-[#F0AA4C] transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
