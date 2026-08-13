"use client";

import { usePathname } from "next/navigation";
import { Eye } from "lucide-react";

/**
 * Fixed bar shown while the client is previewing unpublished draft changes.
 * Visitors never see this — it only appears when preview mode is on. The
 * "Exit preview" link turns preview mode off and returns to the live site.
 */
export function PreviewBanner() {
  const pathname = usePathname() || "/";
  const off = `/api/admin/preview/off?to=${encodeURIComponent(pathname)}`;
  return (
    <div className="fixed inset-x-0 bottom-0 z-100 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-[#1C1C1C] px-4 py-2.5 text-center text-sm font-semibold text-white">
      <span className="flex items-center gap-2">
        <Eye size={16} className="text-[#FFA733]" />
        Preview — this is how your draft will look. Visitors still see the published site.
      </span>
      <a href={off} className="rounded-full bg-[#FF8C00] px-4 py-1 font-bold text-[#1C1C1C] hover:bg-[#FFA733]">
        Exit preview
      </a>
    </div>
  );
}
