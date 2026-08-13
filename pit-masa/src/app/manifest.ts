import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pit & Masa",
    short_name: "Pit & Masa",
    description:
      "Pit & Masa is a mobile BBQ & taco catering company for weddings, parties, corporate events, and holidays across Connecticut.",
    start_url: "/",
    display: "standalone",
    background_color: "#FEFCF5",
    theme_color: "#1C1C1C",
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
