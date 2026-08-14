"use client";

import { usePathname } from "next/navigation";

/** Hides site chrome (header, footer, banners) on the /admin editor. */
export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
