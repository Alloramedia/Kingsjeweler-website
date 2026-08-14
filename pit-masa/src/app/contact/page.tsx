import { Metadata } from "next";
import { ContactClient } from "./ContactClient";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { getSiteContent, applySeo } from "@/lib/admin/schema";

const baseMetadata: Metadata = {
  title: "Visit or Contact Kings Jeweler",
  description:
    "Visit Kings Jeweler at The Shoppes at Buckland Hills in Manchester, CT, or send us a message about repairs, custom design, engagement rings, or gold buying.",
  alternates: {
    canonical: "https://www.kingsjewelerct.com/contact",
  },
  openGraph: {
    title: "Visit or Contact Kings Jeweler",
    description:
      "Stop by our store at Buckland Hills or send us a message — repairs, custom design, engagement rings, and gold buying.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Visit or Contact Kings Jeweler",
    description:
      "Stop by our store at Buckland Hills or send us a message — repairs, custom design, engagement rings, and gold buying.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteContent();
  return applySeo(baseMetadata, seo.contact);
}

export default async function ContactPage() {
  const { brandImages } = await getSiteContent();
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />
      <ContactClient heroSlides={brandImages.heroSlides} heroImage={brandImages.heroEvents} />
    </>
  );
}
