"use client";

import { memo, useMemo, useState } from "react";

import { CopyButton } from "@/components/shared/copy-button";
import { CodeOutput } from "@/components/shared/code-output";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  buildAnimationProperty,
  buildFullCssBlock,
  buildKeyframesBlock,
} from "@/components/tools/keyframes/keyframes-logic";
import type { KeyframesState } from "@/components/tools/keyframes/types";
import { cn } from "@/lib/utils";

interface CodeOutputPanelProps {
  state: KeyframesState;
  className?: string;
}

type CodeFormat = "keyframes" | "animation" | "full";

export const CodeOutputPanel = memo(function CodeOutputPanel({
  state,
  className,
}: CodeOutputPanelProps) {
  const [format, setFormat] = useState<CodeFormat>("full");

  const keyframesCode = useMemo(() => buildKeyframesBlock(state), [state]);
  const animationCode = useMemo(() => buildAnimationProperty(state), [state]);
  const fullCode = useMemo(() => buildFullCssBlock(state), [state]);

  const activeCode =
    format === "keyframes"
      ? keyframesCode
      : format === "animation"
        ? animationCode
        : fullCode;

  return (
    <section
      aria-label="CSS-код"
      className={cn(
        "rounded-xl border border-border bg-card p-4",
        className,
      )}
    >
      <Tabs
        value={format}
        onValueChange={(value) => setFormat(value as CodeFormat)}
      >
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="full">Полный CSS</TabsTrigger>
            <TabsTrigger value="keyframes">@keyframes</TabsTrigger>
            <TabsTrigger value="animation">animation</TabsTrigger>
          </TabsList>
          <CopyButton value={activeCode} />
        </div>

        <TabsContent value="full" className="mt-0">
          <CodeOutput code={fullCode} language="css" />
        </TabsContent>
        <TabsContent value="keyframes" className="mt-0">
          <CodeOutput code={keyframesCode} language="css" />
        </TabsContent>
        <TabsContent value="animation" className="mt-0">
          <CodeOutput code={animationCode} language="css" />
        </TabsContent>
      </Tabs>
    </section>
  );
});
