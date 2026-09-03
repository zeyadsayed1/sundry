import type { Metadata } from "next";
import SignInForm from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign In | Sundry",
  description: "Sign in to your Sundry account to view orders, wishlist, and exclusive offers.",
};

export default function SignInPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#F2EEE5]/40 py-12 sm:py-16 flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <SignInForm />
      </div>
    </main>
  );
}
