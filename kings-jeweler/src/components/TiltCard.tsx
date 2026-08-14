"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltIntensity?: number;
  glareOpacity?: number;
}

export function TiltCard({
  children,
  className = "",
  tiltIntensity = 4,
  glareOpacity = 0.05,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const latestPos = useRef({ x: 0, y: 0 });
  const [style, setStyle] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const updateTilt = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const px = (latestPos.current.x - centerX) / (rect.width / 2);
    const py = (latestPos.current.y - centerY) / (rect.height / 2);

    setStyle({
      rx: -py * tiltIntensity,
      ry: px * tiltIntensity,
      gx: ((latestPos.current.x - rect.left) / rect.width) * 100,
      gy: ((latestPos.current.y - rect.top) / rect.height) * 100,
    });
    rafRef.current = null;
  }, [tiltIntensity]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      latestPos.current = { x: e.clientX, y: e.clientY };
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updateTilt);
      }
    },
    [updateTilt, prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setStyle({ rx: 0, ry: 0, gx: 50, gy: 50 });
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{
        transform: `perspective(800px) rotateX(${style.rx}deg) rotateY(${style.ry}deg)`,
        transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: isHovered ? "transform" : "auto",
      }}
    >
      {children}
      {/* Glare overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle at ${style.gx}% ${style.gy}%, rgba(190, 90, 36, ${glareOpacity}), transparent 60%)`,
        }}
      />
    </div>
  );
}
