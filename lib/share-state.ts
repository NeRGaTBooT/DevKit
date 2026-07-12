export function encodeState<T>(state: T): string {
  const json = JSON.stringify(state);
  const bytes = new TextEncoder().encode(json);

  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeState<T>(encoded: string): T | null {
  try {
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padding = normalized.length % 4;
    const padded =
      padding === 0 ? normalized : normalized + "=".repeat(4 - padding);

    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);

    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

import { withBasePath } from "@/lib/base-path";

export function buildShareUrl(pathname: string, state: unknown): string {
  const encoded = encodeState(state);
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  return `${origin}${withBasePath(pathname)}?s=${encoded}`;
}

export function readShareParam(): string | null {
  if (typeof window === "undefined") return null;

  return new URLSearchParams(window.location.search).get("s");
}
