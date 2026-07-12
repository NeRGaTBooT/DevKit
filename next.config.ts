import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const isStaticExport = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : undefined,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  ...(isStaticExport
    ? {}
    : {
        async redirects() {
          return [
            {
              source: "/tools",
              destination: "/",
              permanent: true,
            },
            {
              source: "/tools/:slug*",
              destination: "/:slug*",
              permanent: true,
            },
          ];
        },
      }),
};

export default nextConfig;
