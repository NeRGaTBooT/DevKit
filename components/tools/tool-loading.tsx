import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function Pulse({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

export function ToolLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="space-y-2">
        <Pulse className="h-8 w-48" />
        <Pulse className="h-4 w-96 max-w-full" />
      </div>
      <Pulse className="h-9 w-full max-w-sm" />
      <Card>
        <CardContent className="flex min-h-72 items-center justify-center p-4 lg:min-h-[28rem]">
          <Pulse className="size-32 rounded-xl" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4 p-4">
          <Pulse className="h-4 w-full" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Pulse className="h-10 w-full" />
            <Pulse className="h-10 w-full" />
            <Pulse className="h-10 w-full" />
            <Pulse className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
