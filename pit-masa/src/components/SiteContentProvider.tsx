"use client";

import { createContext, useContext } from "react";
import { siteConfig } from "@/lib/constants";
import { defaultHours, defaultAnnouncement, type Announcement, type HoursRow, type SocialLinks } from "@/lib/admin/types";

export interface SiteChrome {
  contact: { phone: string; email: string };
  socials: SocialLinks;
  hours: HoursRow[];
  announcement: Announcement;
  logo: string;
}

const fallback: SiteChrome = {
  contact: { phone: siteConfig.phone, email: siteConfig.email },
  socials: { ...siteConfig.socials },
  hours: defaultHours,
  announcement: defaultAnnouncement,
  logo: "/images/kings-jeweler-logo.webp",
};

const SiteChromeContext = createContext<SiteChrome>(fallback);

export function SiteContentProvider({
  value,
  children,
}: {
  value: SiteChrome;
  children: React.ReactNode;
}) {
  return <SiteChromeContext.Provider value={value}>{children}</SiteChromeContext.Provider>;
}

/** Live, client-side access to editable contact/social/hours content. */
export function useSiteChrome(): SiteChrome {
  return useContext(SiteChromeContext);
}
