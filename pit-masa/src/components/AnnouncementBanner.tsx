"use client";

import { usePathname } from "next/navigation";
import { useSiteChrome } from "@/components/SiteContentProvider";
import { announcementVisible } from "@/lib/admin/types";

/**
 * Sitewide announcement / holiday-hours banner. Shows only when the client
 * has turned it on in the admin, is within its date window, and is hidden on
 * the admin screens.
 */
export function AnnouncementBanner() {
  const pathname = usePathname();
  const { announcement } = useSiteChrome();

  if (pathname?.startsWith("/admin")) return null;
  if (!announcementVisible(announcement)) return null;

  return (
    <div
      role="status"
      className="relative z-50 bg-[#FF8C00] px-4 py-2.5 text-center text-sm font-semibold text-[#1C1C1C]"
    >
      {announcement.message}
    </div>
  );
}
