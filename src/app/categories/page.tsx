import type { Metadata } from "next";
import CategoriesClient from "./CategoriesClient";
import { API_ENDPOINTS } from "@/app/lib/api";
import { Category } from "@/app/lib/types";

export const metadata: Metadata = {
  title: "Categories | Sundry",
  description: "Browse all our product categories.",
};

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(API_ENDPOINTS.categories, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-[#F2EEE5]/40 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CategoriesClient initialCategories={categories} />
      </div>
    </main>
  );
}
