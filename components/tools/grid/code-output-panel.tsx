"use client";

import { memo, useMemo } from "react";

import { ToolCodeOutputPanel } from "@/components/shared/tool-code-output-panel";
import {
  buildContainerCss,
  buildFullCssBlock,
  buildItemsCss,
} from "@/components/tools/grid/grid-logic";
import type { GridState } from "@/components/tools/grid/types";
import { cn } from "@/lib/utils";

interface CodeOutputPanelProps {
  state: GridState;
  className?: string;
}

export const CodeOutputPanel = memo(function CodeOutputPanel({
  state,
  className,
}: CodeOutputPanelProps) {
  const tabs = useMemo(
    () => [
      {
        id: "container",
        label: "Контейнер",
        code: buildContainerCss(state),
      },
      {
        id: "items",
        label: "Элементы",
        code: buildItemsCss(state),
      },
      {
        id: "full",
        label: "Полный CSS",
        code: buildFullCssBlock(state),
      },
    ],
    [state],
  );

  return (
    <ToolCodeOutputPanel tabs={tabs} defaultTab="full" className={className} />
  );
});
