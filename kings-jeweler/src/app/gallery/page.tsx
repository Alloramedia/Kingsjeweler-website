import { Metadata } from "next";
import Image from "next/image";
import fs from "node:fs";
import path from "node:path";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { CTASection } from "@/components/CTASection";
import { getSiteContent } from "@/lib/admin/schema";

export const metadata: Metadata = {
  title: "Gallery — Custom Jewelry & Work From Our Showcase",
  description:
    "Browse custom pieces, restorations, and favorites from the King's Jeweler showcase at The Shoppes at Buckland Hills in Manchester, CT.",
  alternates: { canonical: "https://www.kingsjewelerct.com/gallery" },
  openGraph: {
    title: "Gallery | King's Jeweler",
    description:
      "Custom pieces, restorations, and favorites from the King's Jeweler showcase in Manchester, CT.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

function getGalleryImages(): string[] {
  try {
    const dir = path.join(process.cwd(), "public/images/jewelry");
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort()
      .map((f) => `/images/jewelry/${f}`);
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const { gallery, imageAlt } = await getSiteContent();
  // Use the admin-curated list when set; otherwise show every jewelry photo.
  const images = gallery.length > 0 ? gallery : getGalleryImages();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Gallery", href: "/gallery" },
        ]}
      />

      {/* Hero */}
      <section className="bg-[#14141A] text-white metal-texture">
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-40 lg:px-8">
          <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#F0A92D]">
            Gallery
          </p>
          <h1 className="mt-4 font-display! text-4xl font-normal! uppercase leading-tight md:text-6xl">
            From our showcase.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            A look at the custom pieces, restorations, and fine jewelry we
            craft and care for at King's Jeweler in The Shoppes at Buckland
            Hills, Manchester, Connecticut.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-[#FBF9F4]">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 *:mb-4">
            {images.map((src, i) => (
              <div
                key={src}
                className="overflow-hidden rounded-xl border border-[#14141A]/10 bg-[#FFFDF8] shadow-sm break-inside-avoid"
              >
                <Image
                  src={src}
                  alt={imageAlt[src] || `King's Jeweler jewelry photo ${i + 1}`}
                  width={500}
                  height={625}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="h-auto w-full object-cover"
                  loading={i < 8 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
