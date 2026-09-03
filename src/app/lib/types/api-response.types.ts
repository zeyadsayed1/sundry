import type { Brand, Category, Product, Review, Subcategory } from "./product.types";

export interface PaginationMetadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
}

export interface ProductsResponse {
  results: number;
  metadata: PaginationMetadata;
  data: Product[];
}

export interface SingleProductResponse {
  data: Product;
}

export interface CategoriesResponse {
  results: number;
  data: Category[];
}

export interface SubcategoriesResponse {
  results: number;
  data: Subcategory[];
}

export interface BrandsResponse {
  results: number;
  data: Brand[];
}

export interface ReviewsResponse {
  results: number;
  data: Review[];
}

export interface ApiSuccessResponse<T = unknown> {
  status?: string;
  message?: string;
  data?: T;
}
