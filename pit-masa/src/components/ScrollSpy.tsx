"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

interface SpySection {
  id: string;
  label: string;
}

interface ScrollSpyProps {
  sections: SpySection[];
  showAfter?: number;
}

export function ScrollSpy({ sections, showAfter = 600 }: ScrollSpyProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mounted flag for createPortal
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > showAfter);
      setMobileOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [showAfter]);

  useEffect(() => {
    // Use scroll position + element offsets for accurate section detection.
    // The "active" section is whichever section's top is closest to (but not
    // far below) a target line 40% down the viewport.
    const detect = () => {
      const targetY = window.innerHeight * 0.4;
      let bestId: string | null = null;
      let bestDist = Infinity;

      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Section must have at least some part above the target line
        // i.e. its top should be at or above targetY
        if (rect.top <= targetY && rect.bottom > 0) {
          const dist = Math.abs(rect.top - targetY);
          if (dist < bestDist) {
            bestDist = dist;
            bestId = s.id;
          }
        }
      }

      // If nothing found above targetY, pick the first section whose top
      // is closest below it (user hasn't scrolled far enough yet)
      if (!bestId) {
        for (const s of sections) {
          const el = document.getElementById(s.id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          const dist = Math.abs(rect.top - targetY);
          if (dist < bestDist) {
            bestDist = dist;
            bestId = s.id;
          }
        }
      }

      if (bestId) setActiveId(bestId);
    };

    window.addEventListener("scroll", detect, { passive: true });
    // Also detect after a short delay to handle dynamically loaded sections
    const initialTimer = setTimeout(detect, 300);
    const retryTimer = setTimeout(detect, 1000);
    detect();

    return () => {
      window.removeEventListener("scroll", detect);
      clearTimeout(initialTimer);
      clearTimeout(retryTimer);
    };
  }, [sections]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  }, []);

  const activeIndex = sections.findIndex((s) => s.id === activeId);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <>
          {/* ── Desktop: compact right-edge legend ── */}
          <motion.nav
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            aria-label="Page sections"
            className="fixed right-4 top-1/2 z-50 -translate-y-1/2 hidden lg:block"
          >
            <div className="relative flex flex-col items-end gap-0.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/8 px-3 py-2.5 shadow-lg shadow-black/20">
              {/* Track line with green fill */}
              <div className="absolute right-[17px] top-2.5 bottom-2.5 w-px bg-white/6">
                <div
                  className="absolute top-0 left-0 w-full bg-[#FF8C00]/30 transition-all duration-500 ease-out rounded-full"
                  style={{
                    height: activeIndex >= 0 ? `${((activeIndex + 0.5) / sections.length) * 100}%` : "0%",
                  }}
                />
              </div>

              {sections.map((s, i) => {
                const isActive = activeId === s.id;
                const dist = activeIndex >= 0 ? Math.abs(i - activeIndex) : 99;
                const isPast = activeIndex >= 0 && i < activeIndex;

                // Rolling size: active = 13px, ±1 = 11px, rest = 10px
                const fontSize = isActive ? 13 : dist === 1 ? 11 : 10;
                const opacity = isActive ? 1 : dist === 1 ? 0.55 : 0.3;
                const fontWeight = isActive ? 700 : dist === 1 ? 500 : 400;

                return (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    aria-label={`Jump to ${s.label}`}
                    aria-current={isActive ? "page" : undefined}
                    className="group relative flex items-center gap-2 py-0.75 transition-all duration-300 cursor-pointer hover:opacity-80!"
                    style={{ opacity }}
                  >
                    <span
                      className="select-none whitespace-nowrap transition-all duration-300 tracking-wide"
                      style={{
                        fontSize,
                        fontWeight,
                        color: isActive ? "#FF8C00" : "rgba(255,255,255,0.85)",
                        textShadow: isActive ? "0 0 12px rgba(190,90,36,0.3)" : "none",
                      }}
                    >
                      {s.label}
                    </span>
                    <span
                      className="relative z-10 shrink-0 rounded-full transition-all duration-300"
                      style={{
                        width: isActive ? 7 : 4,
                        height: isActive ? 7 : 4,
                        backgroundColor: isActive ? "#FF8C00" : isPast ? "rgba(190,90,36,0.35)" : "rgba(255,255,255,0.35)",
                        boxShadow: isActive ? "0 0 8px rgba(190,90,36,0.5)" : "none",
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </motion.nav>

          {/* ── Mobile: bottom pill ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 lg:hidden"
          >
            <AnimatePresence>
              {mobileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 rounded-xl bg-black/85 backdrop-blur-xl border border-white/10 py-2 px-1 shadow-2xl"
                >
                  {sections.map((s) => {
                    const isActive = activeId === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => scrollTo(s.id)}
                        className={`flex w-full items-center gap-2 px-3 py-1.5 text-left whitespace-nowrap rounded-lg transition-all duration-200 text-[12px] ${isActive ? "text-[#FF8C00] font-semibold bg-[#FF8C00]/10" : "text-white/50 font-medium active:bg-white/5"}`}
                      >
                        <span className={`shrink-0 rounded-full h-1 w-1 ${isActive ? "bg-[#FF8C00]" : "bg-white/25"}`} />
                        {s.label}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 px-3.5 py-2 shadow-lg shadow-black/25 active:scale-95 transition-transform"
              aria-label="Toggle section navigation"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF8C00]" />
              <span className="text-[11px] font-semibold text-white/70">
                {activeIndex >= 0 ? sections[activeIndex].label : "Sections"}
              </span>
              <ChevronUp size={10} className={`text-white/40 transition-transform duration-200 ${mobileOpen ? "rotate-180" : ""}`} />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
