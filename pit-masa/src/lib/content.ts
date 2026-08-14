/**
 * Editorial content types for the Recipes and Blog sections of the admin CMS.
 * King's Jeweler does not currently publish recipes or blog posts, so the
 * arrays are empty — the types remain for the admin content model.
 */

export interface Recipe {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  /** Hands-on + total time, e.g. "8 hours". */
  time: string;
  difficulty: "Easy" | "Intermediate" | "Advanced";
  /** How many it serves. */
  serves: string;
  intro: string[];
  ingredients: string[];
  steps: { title: string; body: string }[];
  tip: string;
  /** ISO date used for sitemap lastModified + ordering. */
  date: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  body: { heading?: string; paragraphs: string[] }[];
  /** Curated internal links shown in a "Related reading" block. */
  related?: { label: string; href: string }[];
  /** Q&A pairs rendered as an accordion and emitted as FAQPage schema. */
  faqs?: { question: string; answer: string }[];
}

export const recipes: Recipe[] = [];

export const blogPosts: BlogPost[] = [];
