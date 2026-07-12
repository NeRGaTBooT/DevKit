"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

import { Prism } from "@/lib/shared/prism-setup";
import { cn } from "@/lib/utils";

interface CodeOutputProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeOutput({
  code,
  language = "css",
  className,
}: CodeOutputProps) {
  const codeRef = useRef<HTMLElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!codeRef.current) return;
    codeRef.current.textContent = code;
    Prism.highlightElement(codeRef.current);
  }, [code, language, resolvedTheme]);

  return (
    <div
      data-theme={resolvedTheme === "dark" ? "dark" : "light"}
      className={cn(
        "code-output overflow-x-auto rounded-xl border border-border bg-muted/40 p-4 text-sm",
        className,
      )}
    >
      <pre className="!m-0 !bg-transparent !p-0">
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
