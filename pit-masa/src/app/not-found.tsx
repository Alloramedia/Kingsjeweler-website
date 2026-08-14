import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#FBF9F4]">
      <div className="mx-auto max-w-lg px-6 text-center">
        <p className="font-heading text-8xl font-black text-[#C68A17] md:text-9xl">
          404
        </p>
        <h1 className="mt-4 font-display! text-3xl font-normal! uppercase text-[#14141A] md:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[#14141A]/65">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="btn-gold inline-flex items-center rounded-full px-8 py-4 text-base font-bold text-white hover:scale-[1.03]"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full border-2 border-[#14141A]/20 px-8 py-4 text-base font-bold text-[#14141A] transition-all duration-300 hover:border-[#C68A17] hover:bg-[#C68A17]/10"
          >
            Contact Us
          </Link>
        </div>
        <div className="mt-12 border-t border-[#14141A]/10 pt-8">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-[#14141A]/40">
            Popular pages
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Services", href: "/services" },
              { label: "Gallery", href: "/gallery" },
              { label: "About Us", href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="rounded-full border border-[#14141A]/15 px-4 py-2 text-sm text-[#14141A]/65 transition-all hover:border-[#C68A17] hover:text-[#C68A17]"
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
