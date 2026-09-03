"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import { Category } from "@/app/lib/types";
import type { CategoriesClientProps } from "./CategoriesClient.types";

export default function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = initialCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* ── Page Header & Search ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-[#EDEBF1]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E1C2B] tracking-tight">
            Shop by Category
          </h1>
          <p className="text-sm text-[#8B879A] mt-2 max-w-xl">
            Explore our wide range of categories to find exactly what you are looking for.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <FiSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B879A]" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white text-sm text-[#1E1C2B] placeholder-[#8B879A] border border-[#EDEBF1] outline-none focus:border-[#F0AA4C] focus:ring-4 focus:ring-[#F0AA4C]/10 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* ── Categories Grid ── */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredCategories.map((category) => (
            <Link
              key={category._id}
              href={`/categories/${category._id}`}
              className="group block bg-white rounded-3xl border border-[#EDEBF1] overflow-hidden hover:border-[#F0AA4C] hover:shadow-[0_12px_40px_rgba(240,170,76,0.15)] transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-48 sm:h-56 lg:h-64 bg-[#F7F6F9] overflow-hidden p-6 flex items-center justify-center">
                {/* Fallback pattern if image is empty/fails - Next Image handles actual rendering */}
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </div>
              <div className="p-5 border-t border-[#EDEBF1] flex items-center justify-between">
                <h3 className="font-bold text-[#1E1C2B] text-base truncate pr-4">
                  {category.name}
                </h3>
                <div className="w-8 h-8 rounded-full bg-[#F7F6F9] flex items-center justify-center text-[#1E1C2B] group-hover:bg-[#F0AA4C] group-hover:text-white transition-colors shrink-0">
                  <FiArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#EDEBF1]">
            <FiSearch size={28} className="text-[#8B879A]" />
          </div>
          <h3 className="text-lg font-bold text-[#1E1C2B]">No categories found</h3>
          <p className="text-[#8B879A] text-sm mt-1">
            Try adjusting your search query.
          </p>
        </div>
      )}
    </div>
  );
}
