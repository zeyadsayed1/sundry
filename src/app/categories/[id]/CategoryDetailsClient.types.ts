import type { Category, Product, Subcategory } from "@/app/lib/types";

export interface CategoryDetailsClientProps {
  category: Category;
  initialProducts: Product[];
  subcategories: Subcategory[];
}
