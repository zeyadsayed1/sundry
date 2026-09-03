"use client";

import { useState, useMemo } from "react";
import { FiSearch, FiSliders, FiX, FiCheck } from "react-icons/fi";
import { Product } from "@/app/lib/types";
import ProductCard from "../components/ProductCard";
import type { ShopContentProps, SortOption } from "./ShopContent.types";

export default function ShopContent({
  initialProducts,
  categories,
}: ShopContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.name?.toLowerCase().includes(q) ||
          p.brand?.name?.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category?._id === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort(
          (a, b) =>
            (a.priceAfterDiscount ?? a.price) - (b.priceAfterDiscount ?? b.price)
        );
        break;
      case "price-desc":
        result.sort(
          (a, b) =>
            (b.priceAfterDiscount ?? b.price) - (a.priceAfterDiscount ?? a.price)
        );
        break;
      case "rating":
        result.sort((a, b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0));
        break;
      case "popular":
        result.sort((a, b) => (b.sold || 0) - (a.sold || 0));
        break;
      default:
        break;
    }

    return result;
  }, [initialProducts, searchQuery, selectedCategory, sortBy]);

  return (
    <div>
      {/* ── Header & Breadcrumbs ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1E1C2B] tracking-tight">
          All Products
        </h1>
        <p className="text-sm text-[#8B879A] mt-1">
          Showing {filteredProducts.length} of {initialProducts.length} items
        </p>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EDEBF1] mb-8 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <FiSearch
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B879A]"
            />
            <input
              type="text"
              placeholder="Search products by name, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#F7F6F9] text-sm text-[#1E1C2B] placeholder-[#8B879A] border border-[#EDEBF1] outline-none focus:border-[#F0AA4C] focus:bg-white transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B879A] hover:text-[#1E1C2B]"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#6B677A] uppercase tracking-wider whitespace-nowrap">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-11 px-4 rounded-xl bg-[#F7F6F9] border border-[#EDEBF1] text-xs sm:text-sm font-semibold text-[#1E1C2B] outline-none focus:border-[#F0AA4C] transition-all cursor-pointer"
            >
              <option value="featured">Featured / Default</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="pt-3 border-t border-[#EDEBF1] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === "all"
                ? "bg-[#1E1C2B] text-[#F2EEE5] shadow-sm"
                : "bg-[#F7F6F9] text-[#6B677A] hover:bg-[#EDEBF1] hover:text-[#1E1C2B]"
            }`}
          >
            All Categories ({initialProducts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat._id
                  ? "bg-[#1E1C2B] text-[#F2EEE5] shadow-sm"
                  : "bg-[#F7F6F9] text-[#6B677A] hover:bg-[#EDEBF1] hover:text-[#1E1C2B]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Products Grid ── */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#EDEBF1] max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#F7F6F9] text-[#8B879A] flex items-center justify-center mx-auto mb-4">
            <FiSearch size={28} />
          </div>
          <h3 className="text-lg font-bold text-[#1E1C2B]">No products found</h3>
          <p className="text-sm text-[#8B879A] mt-1.5">
            Try adjusting your search query or selecting a different category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="mt-5 px-5 py-2.5 rounded-xl bg-[#1E1C2B] text-xs font-bold text-[#F2EEE5] hover:bg-[#F0AA4C] hover:text-[#1E1C2B] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
