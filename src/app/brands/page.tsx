import { Metadata } from "next";
import BrandsClient from "./BrandsClient";

export const metadata: Metadata = {
  title: "Brands | Sundry",
  description: "Browse our collection of premium brands",
};

export default function BrandsPage() {
  return <BrandsClient />;
}
