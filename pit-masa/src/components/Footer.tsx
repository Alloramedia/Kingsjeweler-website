"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, Youtube, Music, Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
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
    <footer className="relative bg-[#1C1C1C] border-t border-white/5 noise-texture metal-texture">
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
              aria-label="Pit & Masa — home"
            >
              <Image
                src={logo}
                alt="Pit & Masa — Tacos & BBQ"
                width={1000}
                height={1000}
                className="h-28 w-28 shrink-0"
              />
            </Link>
            <p className="mt-5 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
              Smoke. Masa. Repeat.
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
              Mobile smoke {"&"} taco catering — wood-fired BBQ, birria tacos, holiday meal packs, and weekly meal prep, served across Connecticut.
            </p>

            {/* Contact info */}
            <div className="mt-6 space-y-3">
              <a
                href={`tel:${contact.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-[#FF8C00]"
              >
                <Phone size={16} className="text-[#FF8C00] shrink-0" />
                {contact.phone}
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-[#FF8C00]"
              >
                <Mail size={16} className="text-[#FF8C00] shrink-0" />
                {contact.email}
              </a>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <MapPin size={16} className="text-[#FF8C00] shrink-0" />
                Mobile catering · Serving all of Connecticut
              </div>
              {hours.length > 0 && (
                <div className="flex items-start gap-3 text-sm text-white/60">
                  <Clock size={16} className="text-[#FF8C00] shrink-0 mt-0.5" />
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
                href={socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition-all duration-400 hover:bg-[#FF8C00] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-[#FF8C00]/20"
                aria-label="Facebook (opens in new window)"
              >
                <Facebook size={18} />
              </a>
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition-all duration-400 hover:bg-[#FF8C00] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-[#FF8C00]/20"
                aria-label="Instagram (opens in new window)"
              >
                <Instagram size={18} />
              </a>
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition-all duration-400 hover:bg-[#FF8C00] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-[#FF8C00]/20"
                aria-label="LinkedIn (opens in new window)"
              >
                <Linkedin size={18} />
              </a>
              <a
                href={socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition-all duration-400 hover:bg-[#FF8C00] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-[#FF8C00]/20"
                aria-label="YouTube (opens in new window)"
              >
                <Youtube size={18} />
              </a>
              <a
                href={socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition-all duration-400 hover:bg-[#FF8C00] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-[#FF8C00]/20"
                aria-label="TikTok (opens in new window)"
              >
                <Music size={18} />
              </a>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div variants={staggerItem}>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#FF8C00]">
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
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#FF8C00]">
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

          {/* Events */}
          <motion.div variants={staggerItem}>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#FF8C00]">
              Events
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
              <h3 className="font-heading text-lg font-bold text-white">Planning a celebration?</h3>
              <p className="mt-1 text-sm text-white/55">Tell us the date, headcount, and style. We&apos;ll craft a catering menu and quote tailored to your event.</p>
            </div>
            <Link
              href="/contact"
              className="flex shrink-0 items-center gap-2 rounded-full bg-[#008080] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#008080]/20 transition-all hover:shadow-xl hover:shadow-[#FF8C00]/40"
            >
              Book Catering
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
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-white/55">
          &copy; {new Date().getFullYear()} Pit {"&"} Masa. All rights reserved.
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
