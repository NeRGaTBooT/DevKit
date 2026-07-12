import Link from "next/link";
import { ArrowLeftIcon, ConstructionIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getReadyTools } from "@/lib/tools/registry";
import { getToolPath } from "@/lib/tools/paths";
import type { ToolDefinition } from "@/lib/tools/types";

interface ComingSoonProps {
  tool: ToolDefinition;
}

export function ComingSoon({ tool }: ComingSoonProps) {
  const readyTools = getReadyTools();

  return (
    <div className="flex flex-1 items-center justify-center p-4 lg:p-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-muted">
            <ConstructionIcon className="size-6 text-muted-foreground" />
          </div>
          <Badge variant="secondary">В разработке</Badge>
          <CardTitle className="mt-3">{tool.title}</CardTitle>
          <CardDescription>{tool.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-center text-sm text-muted-foreground">
            Этот инструмент ещё в работе. Пока можно воспользоваться
            доступными генераторами.
          </p>
          {readyTools.length > 0 && (
            <div className="flex flex-col gap-2">
              {readyTools.map((readyTool) => (
                <Button key={readyTool.slug} variant="outline" asChild>
                  <Link href={getToolPath(readyTool.slug)}>
                    <readyTool.icon />
                    {readyTool.title}
                  </Link>
                </Button>
              ))}
            </div>
          )}
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeftIcon />
              На главную
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
