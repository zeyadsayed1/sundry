import type { Metadata } from "next";
import AccountSettingsClient from "./AccountSettingsClient";

export const metadata: Metadata = {
  title: "Account Settings | Sundry",
  description: "Manage your profile information and account security settings.",
};

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-[#F2EEE5]/40 py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AccountSettingsClient />
      </div>
    </main>
  );
}
