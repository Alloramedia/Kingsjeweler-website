import { Metadata } from "next";
import ReactDOM from "react-dom";
import { HomeClient } from "./HomeClient";
import { getSiteContent, applySeo } from "@/lib/admin/schema";
import { FAQSchema, ReviewSchema } from "@/components/StructuredData";

const baseMetadata: Metadata = {
  title: {
    absolute: "Kings Jeweler | Jewelry Store at Buckland Hills in Manchester, CT",
  },
  description:
    "Kings Jeweler is a family jewelry store at The Shoppes at Buckland Hills in Manchester, CT — fine jewelry, engagement rings, custom design, watch batteries, jewelry repair, and gold buying.",
  alternates: {
    canonical: "https://www.kingsjewelerct.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.kingsjewelerct.com",
    siteName: "Kings Jeweler",
    title: "Kings Jeweler | Jewelry Store at Buckland Hills in Manchester, CT",
    description:
      "Fine jewelry, engagement rings, custom design, watch batteries, and expert repairs — inside The Shoppes at Buckland Hills, Manchester, CT.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kings Jeweler | Jewelry Store in Manchester, CT",
    description:
      "Fine jewelry, engagement rings, custom design, watch batteries, and expert repairs — inside The Shoppes at Buckland Hills, Manchester, CT.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteContent();
  return applySeo(baseMetadata, seo.home);
}

export default async function HomePage() {
  const { hero, brandImages, testimonials, faqs, serviceTowns, hours } =
    await getSiteContent();
  ReactDOM.preload(brandImages.heroHome, { as: "image" });
  return (
    <>
      <FAQSchema faqs={faqs.home} />
      <ReviewSchema
        reviews={testimonials.map((t) => ({ author: t.author, body: t.body, rating: 5 }))}
      />
      <HomeClient
        hero={hero.home}
        brandImages={brandImages}
        testimonials={testimonials}
        faqs={faqs.home}
        serviceTowns={serviceTowns}
        hours={hours}
      />
    </>
  );
}
