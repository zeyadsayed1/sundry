"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronRight, FiGrid, FiList } from "react-icons/fi";
import { Category, Product, Subcategory } from "@/app/lib/types";
import ProductCard from "@/app/components/ProductCard";
import type { CategoryDetailsClientProps } from "./CategoryDetailsClient.types";

export default function CategoryDetailsClient({
  category,
  initialProducts,
  subcategories,
}: CategoryDetailsClientProps) {
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  // Filter products locally by subcategory if one is selected
  const displayedProducts = selectedSub
    ? initialProducts.filter((p) =>
        p.subcategory.some((sub) => sub._id === selectedSub)
      )
    : initialProducts;

  return (
    <div>
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-[#8B879A] mb-8">
        <Link href="/" className="hover:text-[#1E1C2B] transition-colors">
          Home
        </Link>
        <FiChevronRight size={14} />
        <Link href="/categories" className="hover:text-[#1E1C2B] transition-colors">
          Categories
        </Link>
        <FiChevronRight size={14} />
        <span className="text-[#1E1C2B]">{category.name}</span>
      </nav>

      {/* ── Category Banner ── */}
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-[#EDEBF1] mb-8 flex flex-col md:flex-row items-center min-h-[280px]">
        {/* Text Content */}
        <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center relative z-10">
          <div className="inline-block px-3 py-1.5 rounded-lg bg-[#F0AA4C]/10 text-[#F0AA4C] text-[10px] font-extrabold uppercase tracking-wider w-fit mb-4">
            Category
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1E1C2B] tracking-tight mb-4">
            {category.name}
          </h1>
          <p className="text-[#8B879A] text-sm leading-relaxed max-w-md">
            Discover our premium selection of {category.name.toLowerCase()} products. Quality and excellence curated just for you.
          </p>
        </div>

        {/* Image Area */}
        <div className="md:w-1/2 h-64 md:h-full relative bg-[#F7F6F9] w-full flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent z-10 hidden md:block" />
          <div className="relative w-full h-full max-w-sm max-h-64">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-contain drop-shadow-xl"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>

      {/* ── Subcategories Filter Pills ── */}
      {subcategories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => setSelectedSub(null)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm border cursor-pointer ${
              selectedSub === null
                ? "bg-[#1E1C2B] text-white border-[#1E1C2B]"
                : "bg-white text-[#6B677A] border-[#EDEBF1] hover:border-[#F0AA4C] hover:text-[#1E1C2B]"
            }`}
          >
            All Products
          </button>
          {subcategories.map((sub) => (
            <button
              key={sub._id}
              onClick={() => setSelectedSub(sub._id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm border cursor-pointer ${
                selectedSub === sub._id
                  ? "bg-[#F0AA4C] text-[#1E1C2B] border-[#F0AA4C]"
                  : "bg-white text-[#6B677A] border-[#EDEBF1] hover:border-[#F0AA4C] hover:text-[#1E1C2B]"
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Products Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-extrabold text-[#1E1C2B]">
          {displayedProducts.length} {displayedProducts.length === 1 ? "Product" : "Products"} Found
        </h2>
        
        <div className="flex items-center gap-2 bg-white border border-[#EDEBF1] rounded-xl p-1 shadow-sm w-fit">
          <button className="w-8 h-8 rounded-lg bg-[#1E1C2B] text-white flex items-center justify-center shadow-sm cursor-pointer">
            <FiGrid size={16} />
          </button>
          <button className="w-8 h-8 rounded-lg text-[#8B879A] hover:bg-[#F7F6F9] hover:text-[#1E1C2B] flex items-center justify-center transition-colors cursor-pointer">
            <FiList size={16} />
          </button>
        </div>
      </div>

      {/* ── Products Grid ── */}
      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#EDEBF1] shadow-sm">
          <div className="w-20 h-20 bg-[#F7F6F9] rounded-full flex items-center justify-center mx-auto mb-4">
            <FiGrid size={28} className="text-[#8B879A]" />
          </div>
          <h3 className="text-lg font-bold text-[#1E1C2B] mb-2">No products found</h3>
          <p className="text-sm text-[#8B879A] max-w-sm mx-auto">
            Try selecting a different subcategory or check back later.
          </p>
        </div>
      )}
    </div>
  );
}
