import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.kingsjewelerct.com";
  // Use a fixed date for static pages — `new Date()` would produce the
  // build timestamp which is misleading.  Update this when content changes.
  const lastModified = new Date("2026-08-13");

  const staticPages = [
    "",
    "/services",
    "/gallery",
    "/about",
    "/contact",
    "/website-policies",
  ];

  return staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : ["/services", "/gallery"].includes(path) ? 0.9 : 0.8,
  }));
}
