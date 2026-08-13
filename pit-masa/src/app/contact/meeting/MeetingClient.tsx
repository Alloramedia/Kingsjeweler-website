"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/constants";

export function MeetingClient() {
  return (
    <section className="min-h-screen bg-[#FEFCF5] pt-32 pb-20 text-[#1C1C1C]">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#FF8C00]/10 px-4 py-2 text-sm font-semibold text-[#FF8C00]">
            <MessageSquare size={16} />
            Let&apos;s Talk
          </div>
          <h1 className="font-display! text-3xl font-normal! uppercase md:text-4xl lg:text-5xl">
            Prefer to talk it through?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#1C1C1C]/65">
            Give us a call or send an email and we&apos;ll help you plan your
            event — menu, headcount, and pricing. Or send your details through
            the contact form and we&apos;ll get right back to you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 grid gap-4 sm:grid-cols-2"
        >
          <a
            href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
            className="flex items-center gap-4 rounded-2xl border border-[#1C1C1C]/10 bg-[#FFFCF7] p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#FF8C00]/40"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FF8C00]/10 text-[#FF8C00]">
              <Phone size={20} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-[#1C1C1C]/55">Call us</span>
              <span className="font-heading text-lg font-bold">{siteConfig.phone}</span>
            </span>
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="flex items-center gap-4 rounded-2xl border border-[#1C1C1C]/10 bg-[#FFFCF7] p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#FF8C00]/40"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FF8C00]/10 text-[#FF8C00]">
              <Mail size={20} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-[#1C1C1C]/55">Email us</span>
              <span className="font-heading text-lg font-bold break-all">{siteConfig.email}</span>
            </span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full bg-[#008080] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#008080]/25 transition-all hover:scale-[1.03] hover:shadow-xl hover:shadow-[#FF8C00]/40"
          >
            Use the contact form
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
