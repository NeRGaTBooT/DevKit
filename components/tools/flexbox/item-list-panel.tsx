"use client";

import { MinusIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { FlexboxState } from "@/components/tools/flexbox/types";
import { MAX_FLEX_ITEMS, MIN_FLEX_ITEMS } from "@/components/tools/flexbox/types";
import { cn } from "@/lib/utils";

interface ItemListPanelProps {
  state: FlexboxState;
  onSelectItem: (id: string) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  embedded?: boolean;
  className?: string;
}

export function ItemListPanel({
  state,
  onSelectItem,
  onAddItem,
  onRemoveItem,
  embedded = false,
  className,
}: ItemListPanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        !embedded && "rounded-xl border border-border bg-card p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <Label>Элементы ({state.items.length})</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddItem}
            disabled={state.items.length >= MAX_FLEX_ITEMS}
          >
            <PlusIcon />
            Добавить
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {state.items.map((item, index) => {
          const isSelected = state.selectedItemId === item.id;

          return (
            <div key={item.id} className="flex items-center gap-1">
              <Button
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectItem(item.id)}
              >
                Item {index + 1}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onRemoveItem(item.id)}
                disabled={state.items.length <= MIN_FLEX_ITEMS}
                aria-label={`Удалить элемент ${index + 1}`}
              >
                <MinusIcon />
              </Button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Кликните по элементу в preview или в списке, чтобы редактировать его
        свойства. Минимум {MIN_FLEX_ITEMS}, максимум {MAX_FLEX_ITEMS} элементов.
      </p>
    </div>
  );
}
