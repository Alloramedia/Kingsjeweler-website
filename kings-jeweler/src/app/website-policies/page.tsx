import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";
import { BreadcrumbSchema } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Website Policies",
  description:
    "Privacy policy and terms of service for King's Jeweler. Learn how we collect, use, and protect your information.",
  alternates: {
    canonical: "https://www.kingsjewelerct.com/website-policies",
  },
  openGraph: {
    title: "Website Policies | King's Jeweler",
    description:
      "Privacy policy and terms of service for King's Jeweler. Learn how we collect, use, and protect your information.",
    url: "https://www.kingsjewelerct.com/website-policies",
    siteName: "King's Jeweler",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Policies | King's Jeweler",
    description:
      "Privacy policy and terms of service for King's Jeweler.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function WebsitePoliciesPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Website Policies", href: "/website-policies" },
        ]}
      />
      <section className="bg-[#14141A] pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <p className="mb-3 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#C68A17]">
            Legal
          </p>
          <h1 className="text-4xl tracking-tight text-white md:text-5xl">
            Website Policies
          </h1>
          <p className="mt-4 text-lg text-white/60">
            Last updated: February 2026
          </p>
        </div>
      </section>

      <section className="bg-[#FBF9F4] py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="prose max-w-none space-y-12 text-[#14141A]/75 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-[#14141A] [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#14141A] [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:leading-relaxed [&_ul]:space-y-2 [&_li]:text-[#14141A]/75">
            {/* PRIVACY POLICY */}
            <div id="privacy-policy">
              <h2>Privacy Policy</h2>
              <p>
                King's Jeweler (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                &ldquo;our&rdquo;) respects your privacy and is committed to
                protecting the personal information you share with us. This
                Privacy Policy explains how we collect, use, and safeguard your
                information when you visit our website at{" "}
                <a
                  href={siteConfig.url}
                  className="text-[#C68A17] hover:underline"
                >
                  {siteConfig.url}
                </a>
                .
              </p>

              <h3>Information We Collect</h3>
              <p>We may collect the following types of information:</p>
              <ul>
                <li>
                  <strong className="text-[#14141A]">Personal Information:</strong>{" "}
                  Name, email address, phone number, business name, and any
                  other information you voluntarily provide through our contact
                  form.
                </li>
                <li>
                  <strong className="text-[#14141A]">Usage Data:</strong> We use
                  Google Analytics to collect anonymous data about how visitors
                  interact with our website, including pages visited, time
                  spent, and traffic sources.
                </li>
                <li>
                  <strong className="text-[#14141A]">Cookies:</strong> Our website
                  uses cookies to improve your browsing experience and for
                  analytics purposes.
                </li>
              </ul>

              <h3>How We Use Your Information</h3>
              <ul>
                <li>To respond to your inquiries and provide requested services</li>
                <li>To improve our website and marketing efforts</li>
                <li>To send you information related to our services (only if you&apos;ve opted in)</li>
                <li>To comply with legal obligations</li>
              </ul>

              <h3>Information Sharing</h3>
              <p>
                We do not sell, trade, or rent your personal information to
                third parties. We may share information with trusted service
                providers who assist us in operating our website and conducting
                our business, provided they agree to keep your information
                confidential.
              </p>

              <h3>Data Security</h3>
              <p>
                We implement reasonable security measures to protect your
                personal information. However, no method of transmission over
                the Internet is 100% secure, and we cannot guarantee absolute
                security.
              </p>

              <h3>Your Rights</h3>
              <p>
                You have the right to access, correct, or delete your personal
                information. To exercise these rights, please contact us at{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-[#C68A17] hover:underline"
                >
                  {siteConfig.email}
                </a>
                .
              </p>
            </div>

            {/* TERMS OF SERVICE */}
            <div id="terms-of-service" className="pt-8 border-t border-white/10">
              <h2>Terms of Service</h2>
              <p>
                By accessing and using the King's Jeweler website, you accept and
                agree to be bound by these Terms of Service.
              </p>

              <h3>Use of Website</h3>
              <p>
                This website is provided for informational purposes and to
                facilitate inquiries about our catering and event services. You
                agree to use this website only for lawful purposes and in a
                manner that does not infringe upon the rights of others.
              </p>

              <h3>Intellectual Property</h3>
              <p>
                All content on this website — including text, graphics, logos,
                images, videos, and software — is the property of King's Jeweler
                and is protected by copyright and intellectual property laws.
                You may not reproduce, distribute, or create derivative works
                without our express written permission.
              </p>

              <h3>Disclaimer</h3>
              <p>
                The information on this website is provided &ldquo;as is&rdquo;
                without warranties of any kind. Menus, pricing, and availability
                are subject to change and are confirmed at the time of booking.
                Photographs are representative and actual presentation may vary
                by event, season, and ingredient availability.
              </p>

              <h3>Limitation of Liability</h3>
              <p>
                King's Jeweler shall not be liable for any indirect, incidental,
                special, or consequential damages arising from your use of this
                website or our services.
              </p>

              <h3>Contact</h3>
              <p>
                For questions about these policies, please contact us at{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-[#C68A17] hover:underline"
                >
                  {siteConfig.email}
                </a>{" "}
                or call{" "}
                <a
                  href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                  className="text-[#C68A17] hover:underline"
                >
                  {siteConfig.phone}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
