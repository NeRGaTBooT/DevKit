"use client";

import { useEffect } from "react";

import { saveLastTool } from "@/lib/storage";

interface LastToolTrackerProps {
  slug: string;
}

export function LastToolTracker({ slug }: LastToolTrackerProps) {
  useEffect(() => {
    saveLastTool(slug);
  }, [slug]);

  return null;
}
