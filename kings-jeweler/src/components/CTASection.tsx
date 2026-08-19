"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  CTA_PRIMARY,
  CTA_SECONDARY_RESULTS,
} from "@/lib/cta";

interface CTASectionProps {
  headline?: ReactNode;
  subhead?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CTASection({
  headline = (
    <>
      Come get the <em>royal treatment</em>
    </>
  ),
  subhead = "Whether it's an engagement ring, a five-minute battery, or a piece designed just for you, we take care of it personally. Stop by the store or send us a message.",
  primaryLabel = CTA_PRIMARY.label,
  primaryHref = CTA_PRIMARY.href,
  secondaryLabel = CTA_SECONDARY_RESULTS.label,
  secondaryHref = CTA_SECONDARY_RESULTS.href,
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#14141A] py-20 md:py-28">
      {/* Gold glow + navy depth */}
      <div className="absolute inset-0 metal-texture" />
      {/* Gold hairlines top & bottom */}
      <div className="absolute inset-x-0 top-0 h-px bg-[#C68A17]/40" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-[#C68A17]/40" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div>
            <h2 className="font-heading text-4xl font-bold leading-[1.08] tracking-tight text-white md:text-5xl [&_em]:font-medium [&_em]:italic [&_em]:text-[#F0A92D]">
              {headline}
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/75">
              {subhead}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 lg:justify-end">
            <Link
              href={primaryHref}
              className="btn-gold inline-flex items-center px-7 py-3.5 text-base font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C68A17] focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
            >
              {primaryLabel}
            </Link>
            {secondaryLabel && (
              <Link
                href={secondaryHref}
                className="btn-outline-gold inline-flex items-center px-7 py-3.5 text-base font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C68A17] focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
              >
                {secondaryLabel}
                <ArrowRight size={18} className="ml-2" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
