"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Facebook, Instagram, Music, Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import { footerLinks } from "@/lib/constants";
import { useSiteChrome } from "@/components/SiteContentProvider";

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 24, filter: "blur(3px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Footer() {
  const pathname = usePathname();
  const { contact, socials, hours, logo } = useSiteChrome();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="relative bg-[#14141A] border-t border-white/5 noise-texture metal-texture">
      {/* Top glow divider */}
      <div className="absolute top-0 left-0 right-0 section-glow-divider" />
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-12 md:grid-cols-2 lg:grid-cols-5"
        >
          {/* Brand */}
          <motion.div variants={staggerItem} className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-3"
              aria-label="King's Jeweler — home"
            >
              <Image
                src={logo}
                alt="King's Jeweler — Fine Jewelry"
                width={1600}
                height={533}
                className="h-16 w-auto"
              />
            </Link>
            <p className="mt-5 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#F0A92D]">
              Fine Jewelry. Family Service.
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
              A family jewelry store inside The Shoppes at Buckland Hills — engagement rings, custom design, watch batteries, expert repairs, and fair gold buying in Manchester, Connecticut.
            </p>

            {/* Contact info */}
            <div className="mt-6 space-y-3">
              <a
                href={`tel:${contact.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-[#C68A17]"
              >
                <Phone size={16} className="text-[#C68A17] shrink-0" />
                {contact.phone}
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-[#C68A17]"
              >
                <Mail size={16} className="text-[#C68A17] shrink-0" />
                {contact.email}
              </a>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <MapPin size={16} className="text-[#C68A17] shrink-0" />
                The Shoppes at Buckland Hills · 194 Buckland Hills Dr, Manchester, CT
              </div>
              {hours.length > 0 && (
                <div className="flex items-start gap-3 text-sm text-white/60">
                  <Clock size={16} className="text-[#C68A17] shrink-0 mt-0.5" />
                  <ul className="space-y-0.5">
                    {hours.map((h, i) => (
                      <li key={i}>
                        <span className="text-white/80">{h.day}:</span> {h.hours}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Social icons */}
            <div className="mt-6 flex gap-3">
              <a
                href={socials.gmb}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition-all duration-400 hover:bg-[#C68A17] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-[#C68A17]/20"
                aria-label="Google Business Profile (opens in new window)"
              >
                <MapPin size={18} />
              </a>
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition-all duration-400 hover:bg-[#C68A17] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-[#C68A17]/20"
                aria-label="Instagram (opens in new window)"
              >
                <Instagram size={18} />
              </a>
              <a
                href={socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition-all duration-400 hover:bg-[#C68A17] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-[#C68A17]/20"
                aria-label="Facebook (opens in new window)"
              >
                <Facebook size={18} />
              </a>
              <a
                href={socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition-all duration-400 hover:bg-[#C68A17] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-[#C68A17]/20"
                aria-label="TikTok (opens in new window)"
              >
                <Music size={18} />
              </a>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div variants={staggerItem}>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#C68A17]">
              Services
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white link-hover-underline inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={staggerItem}>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#C68A17]">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white link-hover-underline inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Occasions */}
          <motion.div variants={staggerItem}>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#C68A17]">
              Occasions
            </h3>
            <ul className="space-y-3">
              {footerLinks.industries.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white link-hover-underline inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 rounded-2xl border border-white/5 bg-white/2 p-8 md:p-10"
        >
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div>
              <h3 className="font-heading text-lg font-bold text-white">Celebrating something special?</h3>
              <p className="mt-1 text-sm text-white/55">Stop by the store or send us a message — we&apos;ll help you find or create the perfect piece.</p>
            </div>
            <Link
              href="/contact"
              className="btn-gold flex shrink-0 items-center gap-2 px-6 py-3 text-sm font-semibold text-white"
            >
              Visit or Contact Us
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 border-t border-white/5 pt-8 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-white/55">
            <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-[0.14em] text-[#F0A92D]">
              We Buy Gold — Top Prices Paid
            </span>
            <span className="hidden h-3 w-px bg-white/15 sm:block" />
            <span>All major credit cards accepted</span>
            <span className="hidden h-3 w-px bg-white/15 sm:block" />
            <span>Financing with no credit needed</span>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-white/55">
          &copy; {new Date().getFullYear()} King's Jeweler. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/website-policies#privacy-policy"
              className="text-xs text-white/60 transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/website-policies#terms-of-service"
              className="text-xs text-white/60 transition-colors hover:text-white"
            >
              Terms of Service
            </Link>
          </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
