import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kings Jeweler",
    short_name: "Kings Jeweler",
    description:
      "Kings Jeweler is a family jewelry store at The Shoppes at Buckland Hills in Manchester, CT — fine jewelry, engagement rings, custom design, watch batteries, and expert repairs.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF9F4",
    theme_color: "#14141A",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
