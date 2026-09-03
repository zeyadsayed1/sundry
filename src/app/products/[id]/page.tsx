import { notFound } from "next/navigation";
import { Product, SingleProductResponse } from "@/app/lib/types";
import { API_ENDPOINTS } from "@/app/lib/api";
import ProductDetailsClient from "./ProductDetailsClient";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(API_ENDPOINTS.productById(id), {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    const data: SingleProductResponse = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.title} | Sundry`,
    description: product.description?.slice(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F2EEE5]/40 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductDetailsClient product={product} />
      </div>
    </main>
  );
}
