"use client";

import { type ReactNode } from "react";

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
  const variantClass = variant ? variantStyles[variant] : "";

  return (
    <section
      id={id}
      className={`relative overflow-hidden py-14 md:py-20 ${variantClass} ${className}`}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  center = false,
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
  const onDarkBand = variant === "green" || variant === "accent";
  const titleColor = onDarkBand ? "text-white" : "text-[#14141A]";
  const descColor = onDarkBand ? "text-white/75" : "text-[#14141A]/65";

  return (
    <div
      className={`relative mb-10 max-w-3xl md:mb-12 ${center ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <p
          className={`eyebrow-rule mb-4 font-heading ${eyebrowColor ?? (onDarkBand ? "text-[#F0A92D]" : "text-[#C68A17]")}`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-heading text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl [&_em]:font-medium [&_em]:italic ${titleColor}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 max-w-2xl text-lg leading-relaxed ${descColor} ${center ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
    </div>
  );
}
