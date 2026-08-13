"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQAccordion({
  items,
  variant = "dark",
  accentColor = "#FF8C00",
}: {
  items: FAQItem[];
  variant?: "dark" | "light" | "green";
  accentColor?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const isLight = variant === "light";

  return (
    <div className={cn(
      "divide-y rounded-2xl border overflow-hidden",
      isLight
        ? "divide-[#008080]/20 border-[#008080]/25 bg-white/60"
        : "divide-white/15 border-white/15 gradient-border-card"
    )}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `faq-panel-${i}`;
        const buttonId = `faq-button-${i}`;

        return (
          <div
            key={i}
            className={cn(
              "transition-colors",
              isLight ? "hover:bg-[#008080]/5" : "hover:bg-white/5"
            )}
          >
            <h3>
              <button
                id={buttonId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className={cn(
                  "flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors md:px-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF8C00]",
                  isLight
                    ? "text-[#008080] hover:bg-[#008080]/5"
                    : "text-white hover:bg-white/5"
                )}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="text-base font-semibold md:text-lg">
                  {item.question}
                </span>
                <ChevronDown
                  size={20}
                  style={{ color: accentColor }}
                  className={cn(
                    "shrink-0 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className={cn(
                    "px-6 pb-6 text-base leading-relaxed md:px-8",
                    isLight ? "text-[#008080]/65" : "text-white/75"
                  )}>
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
