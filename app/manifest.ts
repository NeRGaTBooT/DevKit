import type { MetadataRoute } from "next";
import { withBasePath } from "@/lib/base-path";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DevKit — инструменты для разработчиков",
    short_name: "DevKit",
    description: "Клиентские утилиты для вёрстки и ежедневной работы",
    start_url: withBasePath("/"),
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    lang: "ru",
    icons: [
      {
        src: withBasePath("/icons/icon-192.svg"),
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: withBasePath("/icons/icon-512.svg"),
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: withBasePath("/icons/icon-512.svg"),
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
