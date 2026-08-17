"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Facebook, Instagram, Mail, Phone, MapPin, Music, ChevronDown, Coins, CreditCard } from "lucide-react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { navLinks, type NavLink } from "@/lib/constants";
import { useSiteChrome } from "@/components/SiteContentProvider";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { contact, socials, logo } = useSiteChrome();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 60, damping: 30, restDelta: 0.001 });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  // Clean up dropdown timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    };
  }, []);

  const handleDropdownEnter = (href: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(href);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on Escape, trap focus
  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMobileMenu();
        return;
      }

      // Focus trap
      if (e.key === "Tab" && mobileNavRef.current) {
        const focusable = mobileNavRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    // Prevent background scroll
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, closeMobileMenu]);

  return (
    <>
    {/* Scroll Progress Indicator */}
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
    />
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#14141A]/95 backdrop-blur-xl shadow-lg shadow-black/30"
          : "bg-[#14141A]/85 backdrop-blur-md"
      )}
    >
      {/* Utility bar — collapses away once scrolled */}
      <div
        className={cn(
          "hidden overflow-hidden border-b border-white/8 transition-all duration-500 lg:block",
          scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
        )}
      >
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 text-xs sm:px-6 lg:px-8">
          <div className="flex items-center gap-5 text-white/60">
            <a
              href={`tel:${contact.phone.replace(/\D/g, "")}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-[#F0A92D]"
            >
              <Phone size={12} />
              {contact.phone}
            </a>
            <span className="h-3 w-px bg-white/15" />
            <span>The Shoppes at Buckland Hills · Manchester, CT</span>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/sell-gold"
              className="inline-flex items-center gap-1.5 font-heading font-bold uppercase tracking-[0.14em] text-[#F0A92D] transition-colors hover:text-[#F7DFA8]"
            >
              <Coins size={13} />
              We Buy Gold — Top Prices Paid
            </Link>
            <span className="h-3 w-px bg-white/15" />
            <span className="inline-flex items-center gap-1.5 text-white/60">
              <CreditCard size={12} />
              No credit needed financing · All major cards accepted
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mobile layout */}
        <div className="flex h-20 items-center justify-between xl:hidden">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="King's Jeweler — home">
            <Image
              src="/images/kings-jeweler-crest.webp"
              alt=""
              width={879}
              height={1224}
              priority
              className="h-14 w-auto"
            />
            <Image
              src={logo}
              alt="King's Jeweler"
              width={1600}
              height={533}
              priority
              className="h-10 w-auto"
            />
          </Link>
          <button
            className="text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop layout — 3-column grid: left | centered logo | right */}
        <div className="hidden xl:grid h-24 items-center" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
          {/* Left: Social icons + nav links */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <a
                href={socials.gmb}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 transition-colors hover:text-[#C68A17]"
                aria-label="Google Business Profile (opens in new window)"
              >
                <MapPin size={18} />
              </a>
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 transition-colors hover:text-[#C68A17]"
                aria-label="Instagram (opens in new window)"
              >
                <Instagram size={18} />
              </a>
              <a
                href={socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 transition-colors hover:text-[#C68A17]"
                aria-label="Facebook (opens in new window)"
              >
                <Facebook size={18} />
              </a>
              <a
                href={socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 transition-colors hover:text-[#C68A17]"
                aria-label="TikTok (opens in new window)"
              >
                <Music size={18} />
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="text-white/60 transition-colors hover:text-[#C68A17]"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
              <a
                href={`tel:${contact.phone.replace(/\D/g, "")}`}
                className="text-white/60 transition-colors hover:text-[#C68A17]"
                aria-label="Phone"
              >
                <Phone size={18} />
              </a>
            </div>
            {navLinks.slice(0, 3).map((link) => (
              <NavItem
                key={link.href}
                link={link}
                openDropdown={openDropdown}
                onEnter={handleDropdownEnter}
                onLeave={handleDropdownLeave}
                pathname={pathname}
              />
            ))}
          </div>

          {/* Center: Crest + wordmark lockup — centered in the navbar */}
          <Link href="/" className="flex items-center gap-3 justify-self-center px-4" aria-label="King's Jeweler — home">
            <Image
              src="/images/kings-jeweler-crest.webp"
              alt=""
              width={879}
              height={1224}
              priority
              className="h-17 w-auto"
            />
            <Image
              src={logo}
              alt="King's Jeweler"
              width={1600}
              height={533}
              priority
              className="h-12 w-auto"
            />
          </Link>

          {/* Right: nav links + Client Portal + CTA */}
          <div className="flex items-center gap-6 justify-self-end">
            {navLinks.slice(3).map((link) => (
              <NavItem
                key={link.href}
                link={link}
                openDropdown={openDropdown}
                onEnter={handleDropdownEnter}
                onLeave={handleDropdownLeave}
                pathname={pathname}
              />
            ))}
            <Link
              href="/contact"
              className="btn-gold inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C68A17] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14141A]"
            >
              Visit or Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom gold hairline */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-[#C68A17]/45 to-transparent" />

    </header>

      {/* Mobile nav — rendered OUTSIDE <header> so backdrop-blur-xl on the header
          doesn't create a containing block that traps this fixed overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            ref={mobileNavRef}
            className="fixed inset-0 top-20 bg-[#14141A]/98 backdrop-blur-xl xl:hidden z-40 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
          <nav className="flex flex-col gap-1 px-6 py-8">
            {navLinks
              .filter((link) => link.href !== "/sell-gold")
              .map((link) =>
              link.children ? (
                <div key={link.href}>
                  <button
                    onClick={() =>
                      setMobileExpanded(
                        mobileExpanded === link.href ? null : link.href
                      )
                    }
                    className="flex w-full items-center justify-between rounded-lg px-4 py-3.5 text-lg font-medium text-white transition-colors hover:bg-white/5 hover:text-[#C68A17]"
                    aria-expanded={mobileExpanded === link.href}
                  >
                    {link.label}
                    <ChevronDown
                      size={20}
                      className={cn(
                        "transition-transform duration-200",
                        mobileExpanded === link.href && "rotate-180"
                      )}
                    />
                  </button>
                  {mobileExpanded === link.href && (
                    <div className="ml-4 flex flex-col gap-0.5 border-l border-white/10 pl-4 py-1">
                      {link.children.map((child) =>
                        child.isHeader ? (
                          <Link
                            key={`header-${child.label}`}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="mt-3 mb-1 px-4 text-xs font-semibold uppercase tracking-wider text-[#C68A17]"
                          >
                            {child.label}
                          </Link>
                        ) : (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="rounded-lg px-4 py-2.5 text-base text-white/70 transition-colors hover:bg-white/5 hover:text-[#C68A17]"
                          >
                            {child.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3.5 text-lg font-medium text-white transition-colors hover:bg-white/5 hover:text-[#C68A17]"
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              href="/sell-gold"
              onClick={() => setMobileOpen(false)}
              className="mt-4 flex items-center justify-center gap-2 rounded-sm border border-[#C68A17]/50 bg-[#C68A17]/10 px-6 py-3.5 text-center text-base font-heading font-bold uppercase tracking-[0.12em] text-[#F0A92D]"
            >
              <Coins size={17} />
              We Buy Gold — Top Prices Paid
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="btn-gold mt-3 px-6 py-4 text-center text-base font-semibold text-white"
            >
              Visit or Contact Us
            </Link>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-white/50">
              <CreditCard size={13} />
              No credit needed financing · All major cards accepted
            </p>
            {/* Social icons mobile */}
            <div className="mt-8 flex items-center justify-center gap-6">
              <a href={socials.gmb} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#C68A17]" aria-label="Google Business Profile (opens in new window)">
                <MapPin size={22} />
              </a>
              <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#C68A17]" aria-label="Instagram (opens in new window)">
                <Instagram size={22} />
              </a>
              <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#C68A17]" aria-label="Facebook (opens in new window)">
                <Facebook size={22} />
              </a>
              <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#C68A17]" aria-label="TikTok (opens in new window)">
                <Music size={22} />
              </a>
              <a href={`mailto:${contact.email}`} className="text-white/60 hover:text-[#C68A17]" aria-label="Email">
                <Mail size={22} />
              </a>
              <a href={`tel:${contact.phone.replace(/\D/g, "")}`} className="text-white/60 hover:text-[#C68A17]" aria-label="Phone">
                <Phone size={22} />
              </a>
            </div>
          </nav>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}

/* ───── Desktop nav item (supports dropdown children) ───── */
function NavItem({
  link,
  openDropdown,
  onEnter,
  onLeave,
  pathname,
}: {
  link: NavLink;
  openDropdown: string | null;
  onEnter: (href: string) => void;
  onLeave: () => void;
  pathname: string;
}) {
  const isOpen = openDropdown === link.href;
  const isActive = pathname === link.href || (link.children && link.children.some(c => pathname.startsWith(c.href)));

  if (!link.children) {
    return (
      <Link
        href={link.href}
        className={cn(
          "nav-link-animated text-sm font-medium transition-colors hover:text-[#C68A17] uppercase tracking-wider whitespace-nowrap",
          isActive ? "text-[#C68A17]" : "text-white/80"
        )}
        data-active={isActive}
      >
        {link.label}
      </Link>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isOpen) {
        onLeave();
      } else {
        onEnter(link.href);
      }
    } else if (e.key === "Escape" && isOpen) {
      onLeave();
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => onEnter(link.href)}
      onMouseLeave={onLeave}
      onFocusCapture={() => onEnter(link.href)}
      onBlurCapture={(e) => {
        // Only close when focus leaves this dropdown group entirely
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          onLeave();
        }
      }}
    >
      <div className="flex items-center gap-1">
        <Link
          href={link.href}
          className={cn(
            "nav-link-animated text-sm font-medium transition-colors hover:text-[#C68A17] uppercase tracking-wider whitespace-nowrap",
            isActive ? "text-[#C68A17]" : "text-white/80"
          )}
          data-active={isActive}
        >
          {link.label}
        </Link>
        <button
          type="button"
          className={cn(
            "transition-colors hover:text-[#C68A17]",
            isActive ? "text-[#C68A17]" : "text-white/80"
          )}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={`${link.label} submenu`}
          onKeyDown={handleKeyDown}
          onClick={() => (isOpen ? onLeave() : onEnter(link.href))}
        >
          <ChevronDown
            size={14}
            className={cn(
              "transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50"
            role="menu"
          >
          <div className="min-w-60 rounded-xl border border-white/10 bg-[#111111]/95 backdrop-blur-xl shadow-2xl shadow-black/40 py-2">
            {link.children.map((child) =>
              child.isHeader ? (

                <div key={`header-${child.label}`} className="px-5 pt-3 pb-1 mt-1 border-t border-white/10">
                  <Link
                    href={child.href}
                    role="menuitem"
                    className="text-xs font-semibold uppercase tracking-wider text-[#C68A17] hover:text-[#A87310] transition-colors"
                  >
                    {child.label}
                  </Link>
                </div>
              ) : (
                <Link
                  key={child.href}
                  href={child.href}
                  role="menuitem"
                  className="flex items-center px-5 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-[#C68A17]"
                >
                  {child.label}
                </Link>
              )
            )}
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
