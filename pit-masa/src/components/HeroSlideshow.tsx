"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { BLUR_DATA_URL } from "@/lib/constants";

interface HeroSlideshowProps {
  /** Ordered list of image paths (from /public) to cross-fade between. */
  images: readonly string[];
  /** Alt text — applied to the first slide; the rest are decorative. */
  alt?: string;
  /** Extra classes for the wrapper (e.g. opacity tint). */
  className?: string;
  /** Object-position for the photos. */
  objectPosition?: string;
  /** Time each slide is shown, in ms. */
  interval?: number;
  /** Responsive sizes attribute. Defaults to full-width. */
  sizes?: string;
}

/**
 * Full-bleed background slideshow for hero/banner sections.
 * - First slide loads with priority + blur placeholder for a fast LCP.
 * - Cross-fades with a slow Ken Burns drift for a premium feel.
 * - Honors prefers-reduced-motion: shows a single static image instead.
 */
export function HeroSlideshow({
  images,
  alt = "",
  className = "",
  objectPosition = "center",
  interval = 5500,
  sizes = "100vw",
}: HeroSlideshowProps) {
  const reduce = useReducedMotion();
  const slides = images.length ? images : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || slides.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      interval
    );
    return () => clearInterval(id);
  }, [reduce, slides.length, interval]);

  // Reduced motion (or a single image): render one static photo.
  if (reduce || slides.length <= 1) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <Image
          src={slides[0]}
          alt={alt}
          fill
          priority
          sizes={sizes}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover"
          style={{ objectPosition }}
        />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 ${className}`}>
      {slides.map((src, i) => (
        <div
          key={src}
          aria-hidden={i !== 0}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={i === 0 ? alt : ""}
            fill
            priority={i === 0}
            loading={i === 0 ? undefined : "lazy"}
            sizes={sizes}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className={`object-cover ${i === index ? "animate-kenburns" : ""}`}
            style={{ objectPosition }}
          />
        </div>
      ))}
    </div>
  );
}
