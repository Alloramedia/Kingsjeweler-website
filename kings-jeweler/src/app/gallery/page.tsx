import { Metadata } from "next";
import Image from "next/image";
import fs from "node:fs";
import path from "node:path";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { CTASection } from "@/components/CTASection";
import { getSiteContent } from "@/lib/admin/schema";

export const metadata: Metadata = {
  title: "Gallery: Custom Jewelry & Restorations",
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
          <p className="eyebrow-rule font-heading text-[#F0A92D]">
            Gallery
          </p>
          <h1 className="mt-5 text-4xl leading-[1.06] tracking-tight md:text-6xl">
            From our <em className="font-medium italic text-[#F0A92D]">showcase</em>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            A look at the custom pieces, restorations, and fine jewelry we
            craft and care for at King’s Jeweler in The Shoppes at Buckland
            Hills, Manchester, Connecticut.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-[#FBF9F4]">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 *:mb-4">
            {images.map((src, i) => {
              const caption = imageAlt[src];
              return (
                <div
                  key={src}
                  className="group overflow-hidden border border-[#14141A]/15 bg-[#FFFDF8] p-1.5 break-inside-avoid"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={src}
                      alt={caption || `King's Jeweler jewelry photo ${i + 1}`}
                      width={500}
                      height={625}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading={i < 8 ? "eager" : "lazy"}
                    />
                    {caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#14141A]/85 via-[#14141A]/40 to-transparent px-4 pb-3 pt-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <p className="text-sm font-medium text-white">
                          {caption}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-[#14141A]/55">
            Have a repair or custom piece of your own? Bring it by The
            Shoppes at Buckland Hills. We&apos;re happy to talk through
            options in person, no appointment needed.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}
