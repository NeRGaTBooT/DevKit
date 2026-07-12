"use client";

import { memo, useMemo, useState } from "react";

import { CopyButton } from "@/components/shared/copy-button";
import { CodeOutput } from "@/components/shared/code-output";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  buildCssProperty,
  buildFullCssBlock,
  buildSimpleCssBlock,
} from "@/components/tools/glassmorphism/glassmorphism-logic";
import type { GlassmorphismState } from "@/components/tools/glassmorphism/types";
import { cn } from "@/lib/utils";

interface CodeOutputPanelProps {
  state: GlassmorphismState;
  className?: string;
}

type CodeFormat = "property" | "simple" | "full";

export const CodeOutputPanel = memo(function CodeOutputPanel({
  state,
  className,
}: CodeOutputPanelProps) {
  const [format, setFormat] = useState<CodeFormat>("property");

  const propertyCode = useMemo(() => buildCssProperty(state), [state]);
  const simpleCode = useMemo(() => buildSimpleCssBlock(state), [state]);
  const fullCode = useMemo(() => buildFullCssBlock(state), [state]);

  const activeCode =
    format === "property"
      ? propertyCode
      : format === "simple"
        ? simpleCode
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
            <TabsTrigger value="property">Свойства</TabsTrigger>
            <TabsTrigger value="simple">Простой блок</TabsTrigger>
            <TabsTrigger value="full">Расширенный блок</TabsTrigger>
          </TabsList>
          <CopyButton value={activeCode} />
        </div>

        <TabsContent value="property" className="mt-0">
          <CodeOutput code={propertyCode} language="css" />
        </TabsContent>
        <TabsContent value="simple" className="mt-0">
          <CodeOutput code={simpleCode} language="css" />
        </TabsContent>
        <TabsContent value="full" className="mt-0">
          <CodeOutput code={fullCode} language="css" />
        </TabsContent>
      </Tabs>
    </section>
  );
});
