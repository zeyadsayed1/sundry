import type { Order } from "@/app/lib/types";

export type OrdersList = Order[];

export type OrderStatus = "pending" | "paid" | "delivered";
