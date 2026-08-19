"use client";

import { motion } from "framer-motion";
import { CheckCircle, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/constants";

export function ThankYouClient() {
  const headline = "Thank you for reaching out.";

  const intro =
    "We've received your message and we'll get back to you shortly. For anything quick, like a watch battery or ring sizing, you're always welcome to just stop by the store.";

  const steps = [
    { step: "1", text: "We review your request and check it with our jeweler." },
    { step: "2", text: "We reach out with answers, options, and honest pricing." },
    { step: "3", text: "You visit the store, and we take care of the rest." },
  ];

  return (
    <section className="min-h-screen bg-[#FBF9F4] pt-32 pb-20 text-[#14141A]">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <CheckCircle size={56} className="mx-auto mb-6 text-[#C68A17]" />
          </motion.div>
          <h1 className="text-3xl tracking-tight md:text-4xl lg:text-5xl">
            {headline}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#14141A]/65">
            {intro}
          </p>
        </motion.div>

        {/* What happens next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-10 max-w-2xl"
        >
          <div className="border border-[#14141A]/15 bg-[#FFFDF8] p-6 md:p-8">
            <h2 className="mb-4 text-center text-lg font-bold">
              What happens next?
            </h2>
            <div className="space-y-4">
              {steps.map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C68A17]/10 text-sm font-bold text-[#C68A17]">
                    {item.step}
                  </div>
                  <p className="pt-1 text-sm text-[#14141A]/65">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-sm border border-[#14141A]/15 px-6 py-3 text-sm font-medium transition-all hover:bg-[#14141A]/5"
          >
            View Our Gallery
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-sm border border-[#14141A]/15 px-6 py-3 text-sm font-medium transition-all hover:bg-[#14141A]/5"
          >
            Explore Our Services
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Phone fallback */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#14141A]/55">
            Need to talk now? Call us at{" "}
            <a
              href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
              className="inline-flex items-center gap-1 font-medium text-[#C68A17] hover:underline"
            >
              <Phone size={14} />
              {siteConfig.phone}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
