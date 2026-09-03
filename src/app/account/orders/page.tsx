import type { Metadata } from "next";
import OrdersClient from "./OrdersClient";

export const metadata: Metadata = {
  title: "My Orders | Sundry",
  description: "View your order history and track shipments.",
};

export default function OrdersPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#F7F6F9] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <OrdersClient />
      </div>
    </main>
  );
}
