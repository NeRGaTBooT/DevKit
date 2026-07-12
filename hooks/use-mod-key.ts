"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => undefined;
}

function getModKeyLabel() {
  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
  return isMac ? "⌘" : "Ctrl";
}

export function useModKeyLabel(): string {
  return useSyncExternalStore(subscribe, getModKeyLabel, () => "Ctrl");
}
