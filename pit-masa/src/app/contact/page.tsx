import { Metadata } from "next";
import { ContactClient } from "./ContactClient";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { getSiteContent, applySeo } from "@/lib/admin/schema";

const baseMetadata: Metadata = {
  title: "Contact Pit & Masa",
  description:
    "Contact Pit & Masa to request a catering proposal, schedule a tasting, or ask about event menu options.",
  alternates: {
    canonical: "https://www.pitandmasa.com/contact",
  },
  openGraph: {
    title: "Contact Pit & Masa",
    description:
      "Tell us about your date, guest count, and event style. We'll build a tailored catering proposal.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Pit & Masa",
    description:
      "Tell us about your date, guest count, and event style. We'll build a tailored catering proposal.",
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
