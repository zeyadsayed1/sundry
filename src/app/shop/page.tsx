import { Product, ProductsResponse, Category, CategoriesResponse } from "@/app/lib/types";
import { API_ENDPOINTS } from "@/app/lib/api";
import ShopContent from "./ShopContent";

async function getShopData(): Promise<{
  products: Product[];
  categories: Category[];
}> {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${API_ENDPOINTS.products}?limit=50`, {
        next: { revalidate: 300 },
      }),
      fetch(API_ENDPOINTS.categories, {
        next: { revalidate: 3600 },
      }),
    ]);

    const productsData: ProductsResponse = await productsRes.json();
    const categoriesData: CategoriesResponse = await categoriesRes.json();

    return {
      products: productsData.data || [],
      categories: categoriesData.data || [],
    };
  } catch (error) {
    console.error("Error loading shop data:", error);
    return { products: [], categories: [] };
  }
}

export default async function ShopPage() {
  const { products, categories } = await getShopData();

  return (
    <main className="min-h-screen bg-[#F2EEE5]/40 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ShopContent initialProducts={products} categories={categories} />
      </div>
    </main>
  );
}
