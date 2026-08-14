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
  headline = "Celebrating something special?",
  subhead = "Stop by the store or send us a message — whether it's an engagement ring, a repair, or a piece designed just for you, we'll take care of it personally.",
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
      className="relative py-20 md:py-28 overflow-hidden bg-[#14141A]"
    >
      {/* Gold glow + navy depth */}
      <div className="absolute inset-0 metal-texture" />
      {/* Faint crown watermark, drifting slightly with scroll */}
      <motion.div
        aria-hidden="true"
        style={{ y: bgY }}
        className="absolute left-1/2 top-1/2 h-105 w-105 -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/kings-jeweler-badge.webp"
          alt=""
          className="h-full w-full object-contain"
        />
      </motion.div>
      {/* Gold hairlines top & bottom */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#C68A17]/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-[#C68A17]/50 to-transparent" />

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
            className="btn-gold inline-flex items-center px-8 py-4 text-base font-bold text-white hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C68A17] focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
          >
            <Star size={18} className="mr-2" />
            {primaryLabel}
          </Link>
          {secondaryLabel && (
            <Link
              href={secondaryHref}
              className="btn-outline-gold inline-flex items-center px-8 py-4 text-base font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C68A17] focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
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
