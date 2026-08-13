import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#FEFCF5]">
      <div className="mx-auto max-w-lg px-6 text-center">
        <p className="font-heading text-8xl font-black text-[#FF8C00] md:text-9xl">
          404
        </p>
        <h1 className="mt-4 font-display! text-3xl font-normal! uppercase text-[#1C1C1C] md:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[#1C1C1C]/65">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-[#008080] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#008080]/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#FF8C00]/40"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full border-2 border-[#1C1C1C]/20 px-8 py-4 text-base font-bold text-[#1C1C1C] transition-all duration-300 hover:border-[#FF8C00] hover:bg-[#FF8C00]/10"
          >
            Contact Us
          </Link>
        </div>
        <div className="mt-12 border-t border-[#1C1C1C]/10 pt-8">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-[#1C1C1C]/40">
            Popular pages
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Menu", href: "/menu" },
              { label: "Catering", href: "/catering" },
              { label: "Festivals", href: "/festivals" },
              { label: "Gallery", href: "/gallery" },
              { label: "About Us", href: "/about" },
            ].map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="rounded-full border border-[#1C1C1C]/15 px-4 py-2 text-sm text-[#1C1C1C]/65 transition-all hover:border-[#FF8C00] hover:text-[#FF8C00]"
              >
                {page.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
