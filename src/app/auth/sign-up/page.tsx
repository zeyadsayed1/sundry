import type { Metadata } from "next";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Create Account | Sundry",
  description: "Join Sundry to experience premium shopping, exclusive offers, and express delivery.",
};

export default function SignUpPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#F2EEE5]/40 py-12 sm:py-16 flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <SignUpForm />
      </div>
    </main>
  );
}
