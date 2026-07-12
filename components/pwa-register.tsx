"use client";

import { useEffect } from "react";
import { withBasePath } from "@/lib/base-path";

async function unregisterServiceWorkers() {
  if (!("serviceWorker" in navigator)) return;

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));
}

export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      void unregisterServiceWorkers();
      return;
    }

    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register(withBasePath("/sw.js")).catch(() => {
      // Ignore registration errors in unsupported contexts.
    });
  }, []);

  return null;
}
