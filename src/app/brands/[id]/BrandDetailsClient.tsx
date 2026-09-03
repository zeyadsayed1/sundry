"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiLoader, FiChevronRight, FiGrid } from "react-icons/fi";
import { Brand, Product, ProductsResponse } from "@/app/lib/types";
import { API_ENDPOINTS } from "@/app/lib/api";
import ProductCard from "@/app/components/ProductCard";
import type { BrandDetailsClientProps } from "./BrandDetailsClient.types";

export default function BrandDetailsClient({ brandId }: BrandDetailsClientProps) {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBrandAndProducts = async () => {
      try {
        // Fetch Brand details
        const brandRes = await fetch(API_ENDPOINTS.brands.byId(brandId));
        if (brandRes.ok) {
          const brandData = await brandRes.json();
          setBrand(brandData.data);
        }

        // Fetch Products for this brand
        const productsRes = await fetch(`${API_ENDPOINTS.products}?brand=${brandId}`);
        if (productsRes.ok) {
          const productsData: ProductsResponse = await productsRes.json();
          setProducts(productsData.data || []);
        }
      } catch (error) {
        console.error("Error fetching brand details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandAndProducts();
  }, [brandId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7F6F9]">
        <FiLoader size={40} className="animate-spin text-[#F0AA4C] mb-4" />
        <p className="text-[#8B879A] font-bold">Loading brand details...</p>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7F6F9]">
        <h1 className="text-2xl font-bold text-[#1E1C2B] mb-2">Brand not found</h1>
        <Link href="/brands" className="text-[#E8593C] font-semibold hover:underline">
          Back to Brands
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F9]">
      {/* ── Brand Hero Section ── */}
      <div className="bg-white border-b border-[#EDEBF1] pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium text-[#8B879A] mb-10">
            <Link href="/" className="hover:text-[#1E1C2B] transition-colors">Home</Link>
            <FiChevronRight size={12} />
            <Link href="/brands" className="hover:text-[#1E1C2B] transition-colors">Brands</Link>
            <FiChevronRight size={12} />
            <span className="text-[#1E1C2B]">{brand.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left">
            {/* Brand Logo */}
            <div className="relative w-40 h-40 shrink-0 bg-[#F7F6F9] rounded-3xl border border-[#EDEBF1] shadow-sm flex items-center justify-center p-6">
              <div className="relative w-full h-full">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  className="object-contain"
                  sizes="160px"
                  priority
                />
              </div>
            </div>

            {/* Brand Info */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#EAF2FA] text-[#2B6CB0] text-xs font-bold mb-4">
                <FiGrid size={14} />
                <span>{products.length} Products Available</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1E1C2B] tracking-tight mb-4">
                {brand.name}
              </h1>
              <p className="text-sm text-[#8B879A] max-w-2xl leading-relaxed">
                Explore the latest collection from {brand.name}. Discover premium quality products designed to elevate your everyday experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Products Section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E1C2B] tracking-tight">
            Shop {brand.name}
          </h2>
          <span className="text-sm font-semibold text-[#8B879A]">
            Showing {products.length} results
          </span>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-[#EDEBF1]">
            <h3 className="text-lg font-bold text-[#1E1C2B] mb-2">No Products Found</h3>
            <p className="text-sm text-[#8B879A]">
              We currently don't have any products from {brand.name}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
