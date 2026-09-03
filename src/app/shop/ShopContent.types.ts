import type { Category, Product } from "@/app/lib/types";

export interface ShopContentProps {
  initialProducts: Product[];
  categories: Category[];
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "popular";
