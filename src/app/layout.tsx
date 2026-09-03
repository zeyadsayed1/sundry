import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import Footer from "./components/Footer";
import "./globals.css";
import Navbar from "./components/Navbar";
import StoreProvider from "./components/StoreProvider";
import { Toaster } from "sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Sundry",
  description: "Created by Ziad Sayed",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <Toaster position="top-right" richColors />
          <Navbar />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
