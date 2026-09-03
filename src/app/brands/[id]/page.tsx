import { Metadata } from "next";
import BrandDetailsClient from "./BrandDetailsClient";

export const metadata: Metadata = {
  title: "Brand Details | Sundry",
};

export default function BrandPage({ params }: { params: { id: string } }) {
  return <BrandDetailsClient brandId={params.id} />;
}
