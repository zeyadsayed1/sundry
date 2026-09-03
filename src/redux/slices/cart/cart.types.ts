import type { CartItem } from "@/app/lib/types";

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

export interface AddToCartPayload {
  product: CartItem["product"];
  quantity?: number;
}

export interface UpdateQuantityPayload {
  productId: string;
  quantity: number;
}
