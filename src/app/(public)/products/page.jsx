import { redirect } from "next/navigation";

export const metadata = {
  title: "Heavy Duty Air Conditioning Systems | OG Heavy Duty",
  description:
    "Explore OG Heavy Duty industrial and commercial air conditioning solutions engineered for demanding Indian climatic conditions.",
  alternates: {
    canonical: "https://ogheavyduty.in/products/split-ac",
  },
};

export default function ProductsCatalogPage() {
  redirect("/products/split-ac");
}
