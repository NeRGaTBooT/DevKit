"use client";

import { useEffect } from "react";

import { basePath } from "@/lib/base-path";

export function BasePathGuard() {
  useEffect(() => {
    if (!basePath) return;

    const doubled = `${basePath}${basePath}`;
    const { pathname, search, hash } = window.location;

    if (!pathname.includes(doubled)) return;

    const fixed = pathname.replaceAll(doubled, basePath);
    window.location.replace(`${fixed}${search}${hash}`);
  }, []);

  return null;
}
