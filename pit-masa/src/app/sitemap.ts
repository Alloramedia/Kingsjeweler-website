import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/admin/schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { recipes, blog: blogPosts } = await getSiteContent();
  const baseUrl = "https://www.pitandmasa.com";
  // Use a fixed date for static pages — `new Date()` would produce the
  // build timestamp which is misleading.  Update this when content changes.
  const lastModified = new Date("2026-05-23");

  const staticPages = [
    "",
    "/menu",
    "/festivals",
    "/catering",
    "/catering/trailer",
    "/catering/truck",
    "/catering/cocktail-cart",
    "/farm-to-table",
    "/recipes",
    "/blog",
    "/gallery",
    "/about",
    "/contact",
    "/website-policies",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: path === ""
      ? 1
      : ["/menu", "/festivals", "/catering", "/gallery"].includes(path)
        ? 0.9
        : ["/about", "/farm-to-table", "/recipes", "/blog"].includes(path)
          ? 0.85
          : 0.8,
  }));

  const recipeEntries: MetadataRoute.Sitemap = recipes.map((recipe) => ({
    url: `${baseUrl}/recipes/${recipe.slug}`,
    lastModified: new Date(recipe.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...recipeEntries, ...blogEntries];
}
