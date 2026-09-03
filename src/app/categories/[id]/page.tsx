import { Metadata } from "next";
import { notFound } from "next/navigation";
import { API_ENDPOINTS } from "@/app/lib/api";
import { Category, ProductsResponse, Subcategory } from "@/app/lib/types";
import CategoryDetailsClient from "./CategoryDetailsClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(API_ENDPOINTS.categoryById(id));
    if (!res.ok) return { title: "Category Not Found | Sundry" };
    const data = await res.json();
    return {
      title: `${data.data.name} | Sundry`,
      description: `Explore products in ${data.data.name}`,
    };
  } catch {
    return { title: "Category | Sundry" };
  }
}

async function getCategory(id: string): Promise<Category | null> {
  try {
    const res = await fetch(API_ENDPOINTS.categoryById(id), { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

async function getCategoryProducts(categoryId: string): Promise<ProductsResponse | null> {
  try {
    const res = await fetch(`${API_ENDPOINTS.products}?category=${categoryId}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getCategorySubcategories(categoryId: string): Promise<Subcategory[]> {
  try {
    const res = await fetch(API_ENDPOINTS.categorySubcategories(categoryId), {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [category, productsData, subcategories] = await Promise.all([
    getCategory(id),
    getCategoryProducts(id),
    getCategorySubcategories(id),
  ]);

  if (!category) {
    notFound();
  }

  const products = productsData?.data || [];

  return (
    <main className="min-h-screen bg-[#F2EEE5]/40 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CategoryDetailsClient 
          category={category} 
          initialProducts={products} 
          subcategories={subcategories}
        />
      </div>
    </main>
  );
}
