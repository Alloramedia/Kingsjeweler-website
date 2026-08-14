"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

type SectionVariant = "dark" | "light" | "green" | "accent";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: SectionVariant;
}

const variantStyles: Record<SectionVariant, string> = {
  dark: "bg-[#FBF9F4] text-[#14141A]",
  light: "bg-[#E5E1D8] text-[#14141A]",
  green: "bg-[#14141A] text-white noise-texture",
  accent: "bg-[#C68A17] text-white",
};

export function Section({ children, className = "", id, variant }: SectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  const variantClass = variant ? variantStyles[variant] : "";

  return (
    <section
      ref={ref}
      id={id}
      className={`relative overflow-hidden py-14 md:py-20 ${variantClass} ${className}`}
    >
      <motion.div style={{ opacity }} className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">{children}</motion.div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  center = true,
  variant,
  eyebrowColor,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  center?: boolean;
  variant?: SectionVariant;
  eyebrowColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const onDarkBand = variant === "green" || variant === "accent";
  const titleColor = onDarkBand ? "text-white" : "text-[#14141A]";
  const descColor = onDarkBand ? "text-white/75" : "text-[#14141A]/65";

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className={`relative mb-10 max-w-3xl md:mb-12 ${center ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <p className={`mb-3 text-sm font-heading font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] ${eyebrowColor ?? (onDarkBand ? "text-[#F0A92D]" : "text-[#C68A17]")}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-display! text-3xl font-normal! uppercase md:text-4xl lg:text-5xl ${titleColor}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-lg leading-relaxed md:text-xl ${descColor}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
