"use client";

import { memo, useMemo } from "react";

import { ToolCodeOutputPanel } from "@/components/shared/tool-code-output-panel";
import {
  buildCssBlock,
  buildCssProperty,
} from "@/components/tools/gradient/gradient-logic";
import type { GradientState } from "@/components/tools/gradient/types";
import { cn } from "@/lib/utils";

interface CodeOutputPanelProps {
  state: GradientState;
  className?: string;
}

export const CodeOutputPanel = memo(function CodeOutputPanel({
  state,
  className,
}: CodeOutputPanelProps) {
  const tabs = useMemo(
    () => [
      {
        id: "property",
        label: "Свойство",
        code: buildCssProperty(state),
      },
      {
        id: "block",
        label: "CSS-блок",
        code: buildCssBlock(state),
      },
    ],
    [state],
  );

  return (
    <ToolCodeOutputPanel
      tabs={tabs}
      defaultTab="property"
      className={className}
    />
  );
});
