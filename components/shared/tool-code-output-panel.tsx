"use client";

import { memo, useMemo, useState } from "react";

import { CopyButton } from "@/components/shared/copy-button";
import { CodeOutput } from "@/components/shared/code-output";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export interface CodeTab {
  id: string;
  label: string;
  code: string;
}

interface ToolCodeOutputPanelProps {
  tabs: CodeTab[];
  defaultTab?: string;
  className?: string;
}

export const ToolCodeOutputPanel = memo(function ToolCodeOutputPanel({
  tabs,
  defaultTab,
  className,
}: ToolCodeOutputPanelProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id ?? "");

  const activeCode = useMemo(
    () => tabs.find((tab) => tab.id === activeTab)?.code ?? tabs[0]?.code ?? "",
    [activeTab, tabs],
  );

  if (tabs.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="CSS-код"
      className={cn(
        "rounded-xl border border-border bg-card p-4",
        className,
      )}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <CopyButton value={activeCode} />
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-0">
            <CodeOutput code={tab.code} language="css" />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
});
