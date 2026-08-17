import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.kingsjewelerct.com";
  // Use a fixed date for static pages — `new Date()` would produce the
  // build timestamp which is misleading.  Update this when content changes.
  const lastModified = new Date("2026-08-17");

  const staticPages = [
    "",
    "/services",
    "/sell-gold",
    "/gallery",
    "/about",
    "/blog",
    "/contact",
    "/website-policies",
  ];

  const staticEntries = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : ["/services", "/sell-gold", "/gallery", "/blog"].includes(path) ? 0.9 : 0.8,
  }));

  const blogEntries = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}
