import type { Product } from "./product.types";

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface OrderCartItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  id?: string;
  user: string;
  cartItems: OrderCartItem[];
  totalOrderPrice: number;
  shippingAddress: ShippingAddress;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  paymentMethodType?: string;
}

export interface CartApiResponse {
  _id: string;
  cartItems: OrderCartItem[];
  totalCartPrice: number;
}

export interface CheckoutSessionResponse {
  session?: {
    url: string;
  };
  message?: string;
}
