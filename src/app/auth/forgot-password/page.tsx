import type { Metadata } from "next";
import ForgotPasswordWizard from "./ForgotPasswordWizard";

export const metadata: Metadata = {
  title: "Reset Password | Sundry",
  description: "Reset your Sundry account password securely.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#F2EEE5]/40 py-12 sm:py-16 flex items-center justify-center">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <ForgotPasswordWizard />
      </div>
    </main>
  );
}
