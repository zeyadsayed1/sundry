import Link from "next/link";
import { FiHome, FiShoppingBag } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="min-h-[75vh] bg-[#F2EEE5]/40 py-20 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-[#E8593C]/10 text-[#E8593C] font-extrabold text-sm mb-4">
          404 ERROR
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1E1C2B] tracking-tight mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-[#8B879A] mb-8 leading-relaxed">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1E1C2B] text-[#F2EEE5] text-xs font-bold hover:bg-[#F0AA4C] hover:text-[#1E1C2B] transition-colors"
          >
            <FiHome size={15} />
            <span>Go Home</span>
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#EDEBF1] text-[#1E1C2B] text-xs font-bold hover:border-[#F0AA4C] transition-colors shadow-sm"
          >
            <FiShoppingBag size={15} />
            <span>Browse Shop</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
