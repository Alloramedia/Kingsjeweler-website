"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import {
  CTA_PRIMARY,
  CTA_SECONDARY_RESULTS,
} from "@/lib/cta";

interface CTASectionProps {
  headline?: string;
  subhead?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CTASection({
  headline = "Ready to feed your crowd?",
  subhead = "Tell us about your event — date, headcount, and vibe — and we'll put together a tailored menu and quote for you.",
  primaryLabel = CTA_PRIMARY.label,
  primaryHref = CTA_PRIMARY.href,
  secondaryLabel = CTA_SECONDARY_RESULTS.label,
  secondaryHref = CTA_SECONDARY_RESULTS.href,
}: CTASectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden"
    >
      {/* Parallax background image */}
      <motion.div
        className="absolute inset-x-0 -inset-y-[30%] bg-cover bg-center will-change-transform"
        style={{ y: bgY, backgroundImage: "url('/images/food/food-100.webp')" }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/70" />
      {/* Subtle teal tint overlay */}
      <div className="absolute inset-0 bg-[#008080]/20" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display! text-3xl font-normal! uppercase text-white md:text-4xl lg:text-5xl text-shadow-hero"
        >
          {headline}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/75"
        >
          {subhead}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href={primaryHref}
            className="inline-flex items-center rounded-full bg-[#008080] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#008080]/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#FF8C00]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008080] focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
          >
            <Star size={18} className="mr-2" />
            {primaryLabel}
          </Link>
          {secondaryLabel && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center rounded-full border-2 border-white/30 px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:border-[#FF8C00] hover:bg-[#FF8C00]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8C00] focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
            >
              {secondaryLabel}
              <ArrowRight size={18} className="ml-2" />
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
