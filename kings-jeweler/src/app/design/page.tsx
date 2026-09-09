import { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { DesignClient } from "./DesignClient";

export const metadata: Metadata = {
  title: "Design Your Own Jewelry: Rings, Chains & Charms",
  description:
    "Build your dream ring, chain, bracelet, or charm step by step. Pick the style, metal, and stones — our jewelers in Manchester, CT bring it to life.",
  alternates: { canonical: "https://www.kingsjewelerct.com/design" },
  openGraph: {
    title: "Design Your Own Jewelry | King's Jeweler",
    description:
      "Build your dream ring, chain, bracelet, or charm step by step and send it straight to our jewelers.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function DesignPage() {
  // Photoreal AI previews light up when an OpenAI key is configured.
  const aiRenders = !!process.env.OPENAI_API_KEY;
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Design Your Own", href: "/design" },
        ]}
      />
      <DesignClient aiRenders={aiRenders} />
    </>
  );
}
