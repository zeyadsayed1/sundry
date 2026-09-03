"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiLoader, FiStar, FiAward, FiSearch } from "react-icons/fi";
import { Brand, BrandsResponse } from "@/app/lib/types";
import { API_ENDPOINTS } from "@/app/lib/api";

export default function BrandsClient() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.brands.base);
        if (!res.ok) throw new Error("Failed to fetch brands");
        const data: BrandsResponse = await res.json();
        setBrands(data.data || []);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7F6F9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#EAF2FA] text-[#2B6CB0] text-xs font-bold mb-4">
              <FiAward size={14} />
              <span>Premium Partners</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E1C2B] tracking-tight">
              Featured Brands
            </h1>
            <p className="mt-2 text-sm text-[#8B879A] max-w-lg">
              Discover our carefully curated collection of the world's most trusted brands. Quality and excellence guaranteed.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <FiSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B879A]" />
            <input
              type="text"
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white text-sm text-[#1E1C2B] placeholder-[#8B879A] border border-[#EDEBF1] outline-none transition-all focus:border-[#F0AA4C] focus:ring-2 focus:ring-[#F0AA4C]/20 shadow-sm"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <FiLoader size={40} className="animate-spin text-[#F0AA4C] mb-4" />
            <p className="text-[#8B879A] font-bold">Loading brands...</p>
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-[#EDEBF1] shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#F7F6F9] flex items-center justify-center mx-auto mb-4 text-[#8B879A]">
              <FiSearch size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#1E1C2B] mb-2">No brands found</h3>
            <p className="text-sm text-[#8B879A]">We couldn't find any brands matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredBrands.map((brand) => (
              <Link
                key={brand._id}
                href={`/brands/${brand._id}`}
                className="group bg-white rounded-2xl p-6 flex flex-col items-center text-center border border-[#EDEBF1] hover:border-[#F0AA4C]/40 hover:shadow-[0_12px_30px_rgba(30,28,43,0.06)] transition-all duration-300"
              >
                <div className="relative w-24 h-24 mb-4">
                  <div className="absolute inset-0 bg-[#F7F6F9] rounded-full group-hover:scale-105 transition-transform duration-300" />
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-contain p-4 z-10"
                    sizes="96px"
                  />
                </div>
                <h3 className="text-sm font-bold text-[#1E1C2B] group-hover:text-[#E8593C] transition-colors">
                  {brand.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
