"use client";

import { memo, useMemo, useState } from "react";

import { CopyButton } from "@/components/shared/copy-button";
import { CodeOutput } from "@/components/shared/code-output";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  buildCssBlock,
  buildCssProperty,
} from "@/components/tools/box-shadow/box-shadow-logic";
import type { BoxShadowState } from "@/components/tools/box-shadow/types";
import { cn } from "@/lib/utils";

interface CodeOutputPanelProps {
  state: BoxShadowState;
  className?: string;
}

type CodeFormat = "property" | "block";

export const CodeOutputPanel = memo(function CodeOutputPanel({
  state,
  className,
}: CodeOutputPanelProps) {
  const [format, setFormat] = useState<CodeFormat>("property");

  const propertyCode = useMemo(() => buildCssProperty(state), [state]);
  const blockCode = useMemo(() => buildCssBlock(state), [state]);
  const activeCode = format === "property" ? propertyCode : blockCode;

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
            <TabsTrigger value="property">Свойство</TabsTrigger>
            <TabsTrigger value="block">CSS-блок</TabsTrigger>
          </TabsList>
          <CopyButton value={activeCode} />
        </div>

        <TabsContent value="property" className="mt-0">
          <CodeOutput code={propertyCode} language="css" />
        </TabsContent>
        <TabsContent value="block" className="mt-0">
          <CodeOutput code={blockCode} language="css" />
        </TabsContent>
      </Tabs>
    </section>
  );
});
