import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wesley Maia — Soluções Digitais",
    short_name: "Wesley Maia",
    description:
      "Portfólio de Wesley Maia: desenvolvimento, infraestrutura, design e marketing digital.",
    id: "/pt",
    start_url: "/pt",
    scope: "/",
    display: "standalone",
    background_color: "#05070B",
    theme_color: "#05070B",
    lang: "pt-BR",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
