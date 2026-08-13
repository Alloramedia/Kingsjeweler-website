import type { Metadata } from "next";
import { Zilla_Slab, Inter, Sancreek } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LocalBusinessSchema, OrganizationSchema } from "@/components/StructuredData";
import { CookieConsent } from "@/components/CookieConsent";
import { BackToTop } from "@/components/BackToTop";
import { ConsentGoogleAnalytics } from "@/components/ConsentGoogleAnalytics";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { PreviewBanner } from "@/components/PreviewBanner";
import { HideOnAdmin } from "@/components/HideOnAdmin";
import { getSiteContent, isPreviewMode } from "@/lib/admin/schema";
import { buildThemeCss } from "@/lib/admin/theme";
import "./globals.css";

const zillaSlab = Zilla_Slab({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Decorative Western display face from the brand logo — used for hero/accent
// headlines via the `font-display` utility, not body or default headings.
const sancreek = Sancreek({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pitandmasa.com"),
  title: {
    default: "Pit & Masa | Mobile Smoke & Taco Catering in Connecticut",
    template: "%s | Pit & Masa",
  },
  description:
    "Pit & Masa is a mobile smoke & taco catering company serving all of Connecticut — wood-fired BBQ, birria tacos, holiday meal packs, and weekly meal prep for events, parties, and everyday meals.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.pitandmasa.com",
    siteName: "Pit & Masa",
    title: "Pit & Masa | Mobile Smoke & Taco Catering in Connecticut",
    description:
      "Wood-fired BBQ, birria tacos, holiday meal packs, and meal prep for events, parties, and everyday meals across Connecticut.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pit & Masa | Smoke & Taco Catering",
    description:
      "Wood-fired BBQ, birria tacos, holiday meal packs, and meal prep for events, parties, and everyday meals across Connecticut.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const content = await getSiteContent();
  const themeCss = buildThemeCss(content.colors);
  const preview = await isPreviewMode();

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${zillaSlab.variable} ${inter.variable} ${sancreek.variable} antialiased`}
        // Suppress body-level hydration warnings caused by browser extensions
        // injecting attributes (e.g. Grammarly, password managers, dark-mode).
        suppressHydrationWarning
      >
        {themeCss && (
          <style id="brand-theme" dangerouslySetInnerHTML={{ __html: themeCss }} />
        )}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-[#FF8C00] focus:px-6 focus:py-3 focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        <LocalBusinessSchema />
        <OrganizationSchema />
        <SiteContentProvider
          value={{ contact: content.contact, socials: content.socials, hours: content.hours, announcement: content.announcement, logo: content.brandImages.logo }}
        >
          <AnnouncementBanner />
          <HideOnAdmin>
            <Header />
          </HideOnAdmin>
          <main id="main-content" className="min-h-screen">{children}</main>
          <Footer />
        </SiteContentProvider>
        <HideOnAdmin>
          <CookieConsent />
          <BackToTop />
        </HideOnAdmin>
        {preview && <PreviewBanner />}
        {gaId && <ConsentGoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
