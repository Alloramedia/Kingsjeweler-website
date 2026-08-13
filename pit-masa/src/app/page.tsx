import { Metadata } from "next";
import ReactDOM from "react-dom";
import { HomeClient } from "./HomeClient";
import { getSiteContent, applySeo } from "@/lib/admin/schema";
import { FAQSchema, ReviewSchema } from "@/components/StructuredData";

const baseMetadata: Metadata = {
  title: {
    absolute: "Pit & Masa | Mobile Smoke & Taco Catering in Connecticut",
  },
  description:
    "Pit & Masa is a Connecticut mobile BBQ & taco catering company — wood-fired smoked brisket, birria tacos, build-your-own taco bars, holiday meal packs, and weekly meal prep for parties, weddings, and corporate events.",
  alternates: {
    canonical: "https://www.pitandmasa.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.pitandmasa.com",
    siteName: "Pit & Masa",
    title: "Pit & Masa | Mobile Smoke & Taco Catering in Connecticut",
    description:
      "Wood-fired BBQ, birria tacos, taco bars, holiday meal packs, and weekly meal prep — mobile catering across Connecticut.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pit & Masa | Smoke & Taco Catering in Connecticut",
    description:
      "Wood-fired BBQ, birria tacos, taco bars, holiday meal packs, and weekly meal prep — mobile catering across Connecticut.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteContent();
  return applySeo(baseMetadata, seo.home);
}

export default async function HomePage() {
  const { hero, recipes, blog, brandImages, testimonials, faqs, serviceTowns } = await getSiteContent();
  ReactDOM.preload(brandImages.heroHome, { as: "image" });
  return (
    <>
      <FAQSchema faqs={faqs.home} />
      <ReviewSchema
        reviews={testimonials.map((t) => ({ author: t.author, body: t.body, rating: 5 }))}
      />
      <HomeClient hero={hero.home} recipes={recipes} blogPosts={blog} brandImages={brandImages} testimonials={testimonials} faqs={faqs.home} serviceTowns={serviceTowns} />
    </>
  );
}
