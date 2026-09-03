import Image from "next/image";
import Link from "next/link";
import { Category, CategoriesResponse } from "@/app/lib/types";
import { API_ENDPOINTS } from "@/app/lib/api";

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(API_ENDPOINTS.categories, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data: CategoriesResponse = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function CategorySection() {
  const categories = await getCategories();

  if (!categories.length) return null;

  return (
    <section className="py-12 bg-white border-b border-[#EDEBF1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1C2B] tracking-tight">
              Shop by Category
            </h2>
            <p className="text-sm text-[#8B879A] mt-1">
              Find what you're looking for by browsing our curated collections
            </p>
          </div>
          <Link
            href="/categories"
            className="text-xs sm:text-sm font-bold text-[#E8593C] hover:text-[#F0AA4C] transition-colors duration-150"
          >
            All Categories →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat._id}
              href={`/categories/${cat._id}`}
              className="group flex flex-col items-center p-4 rounded-2xl bg-[#F7F6F9] hover:bg-[#F2EEE5] border border-transparent hover:border-[#F0AA4C]/40 transition-all duration-300"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 bg-white p-2 shadow-sm group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="100px"
                  className="object-cover rounded-full"
                />
              </div>
              <span className="font-bold text-xs sm:text-sm text-[#1E1C2B] text-center group-hover:text-[#E8593C] transition-colors duration-150 line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
