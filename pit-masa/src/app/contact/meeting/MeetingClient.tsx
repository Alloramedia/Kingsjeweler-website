"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/constants";

export function MeetingClient() {
  return (
    <section className="min-h-screen bg-[#FBF9F4] pt-32 pb-20 text-[#14141A]">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#C68A17]/10 px-4 py-2 text-sm font-semibold text-[#C68A17]">
            <MessageSquare size={16} />
            Let&apos;s Talk
          </div>
          <h1 className="font-display! text-3xl font-normal! uppercase md:text-4xl lg:text-5xl">
            Prefer to talk it through?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#14141A]/65">
            Give us a call or send an email and we&apos;ll help with whatever
            you need — a repair, a custom design, or finding the right piece.
            Or send your details through the contact form and we&apos;ll get
            right back to you.
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
            className="flex items-center gap-4 rounded-2xl border border-[#14141A]/10 bg-[#FFFDF8] p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#C68A17]/40"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#C68A17]/10 text-[#C68A17]">
              <Phone size={20} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-[#14141A]/55">Call us</span>
              <span className="font-heading text-lg font-bold">{siteConfig.phone}</span>
            </span>
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="flex items-center gap-4 rounded-2xl border border-[#14141A]/10 bg-[#FFFDF8] p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#C68A17]/40"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#C68A17]/10 text-[#C68A17]">
              <Mail size={20} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-[#14141A]/55">Email us</span>
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
            className="btn-gold inline-flex items-center rounded-full px-8 py-4 text-base font-bold text-white hover:scale-[1.03]"
          >
            Use the contact form
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
