import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout | Sundry",
  description: "Securely checkout your Sundry order.",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#F7F6F9] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <CheckoutClient />
      </div>
    </main>
  );
}
