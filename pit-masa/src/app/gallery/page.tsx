import { Metadata } from "next";
import Image from "next/image";
import fs from "node:fs";
import path from "node:path";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { CTASection } from "@/components/CTASection";
import { getSiteContent } from "@/lib/admin/schema";

export const metadata: Metadata = {
  title: "Gallery — BBQ & Taco Catering Photos",
  description:
    "Browse photos of Pit & Masa's wood-fired smoked meats, loaded tacos, taco bars, and catered events across Connecticut.",
  alternates: { canonical: "https://www.pitandmasa.com/gallery" },
  openGraph: {
    title: "Gallery | Pit & Masa",
    description:
      "Photos of Pit & Masa's smoked BBQ, tacos, and catered events across Connecticut.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

function getGalleryImages(): string[] {
  try {
    const dir = path.join(process.cwd(), "public/images/food");
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort()
      .map((f) => `/images/food/${f}`);
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const { gallery, imageAlt } = await getSiteContent();
  // Use the admin-curated list when set; otherwise show every food photo.
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
      <section className="bg-[#1C1C1C] text-white metal-texture">
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-40 lg:px-8">
          <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
            Gallery
          </p>
          <h1 className="mt-4 font-display! text-4xl font-normal! uppercase leading-tight md:text-6xl">
            Real smoke. Real flavor.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            A look at the wood-fired BBQ, loaded tacos, and build-your-own taco
            bars Pit &amp; Masa has catered for weddings, parties, and corporate
            events across Connecticut.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-[#FEFCF5]">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
            {images.map((src, i) => (
              <div
                key={src}
                className="overflow-hidden rounded-xl border border-[#1C1C1C]/10 bg-[#FFFCF7] shadow-sm break-inside-avoid"
              >
                <Image
                  src={src}
                  alt={imageAlt[src] || `Pit & Masa catering photo ${i + 1}`}
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
