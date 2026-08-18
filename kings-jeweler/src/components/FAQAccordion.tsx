"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQAccordion({
  items,
  variant = "dark",
  accentColor = "#C68A17",
}: {
  items: FAQItem[];
  variant?: "dark" | "light" | "green";
  accentColor?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const isLight = variant === "light";

  return (
    <div
      className={cn(
        "divide-y border-t border-b",
        isLight
          ? "divide-[#14141A]/15 border-[#14141A]/15"
          : "divide-white/15 border-white/15"
      )}
    >
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `faq-panel-${i}`;
        const buttonId = `faq-button-${i}`;

        return (
          <div key={i}>
            <h3>
              <button
                id={buttonId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className={cn(
                  "flex w-full items-baseline justify-between gap-4 py-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C68A17]",
                  isLight
                    ? "text-[#14141A] hover:text-[#14141A]/70"
                    : "text-white hover:text-white/75"
                )}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="font-heading text-lg font-bold">
                  {item.question}
                </span>
                <Plus
                  size={18}
                  style={{ color: accentColor }}
                  className={cn(
                    "shrink-0 translate-y-0.5 transition-transform duration-200",
                    isOpen && "rotate-45"
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
                    "max-w-2xl pb-6 text-base leading-relaxed",
                    isLight ? "text-[#14141A]/65" : "text-white/75"
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
