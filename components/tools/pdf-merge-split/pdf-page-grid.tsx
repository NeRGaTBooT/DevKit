"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";

import type {
  PdfPageGridMode,
  PdfPageItem,
} from "@/components/tools/pdf-merge-split/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PdfPageGridProps {
  pages: PdfPageItem[];
  mode: PdfPageGridMode;
  selectedPageNumbers?: number[];
  highlightedPageNumbers?: number[];
  disabled?: boolean;
  onReorder?: (pages: PdfPageItem[]) => void;
  onToggleSelect?: (pageNumber: number) => void;
  onRemove?: (id: string) => void;
}

interface PageCardProps {
  page: PdfPageItem;
  mode: PdfPageGridMode;
  isSelected: boolean;
  isHighlighted: boolean;
  disabled?: boolean;
  isDragging?: boolean;
  onToggleSelect?: (pageNumber: number) => void;
  onRemove?: (id: string) => void;
}

function PageCard({
  page,
  mode,
  isSelected,
  isHighlighted,
  disabled = false,
  isDragging = false,
  onToggleSelect,
  onRemove,
}: PageCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-muted/20 transition-colors",
        isSelected && "border-primary ring-2 ring-primary/30",
        isHighlighted && !isSelected && "border-primary/70 ring-1 ring-primary/20",
        !isSelected && !isHighlighted && "border-border",
        isDragging && "opacity-40",
        mode === "select" && !disabled && "cursor-pointer hover:border-primary/50",
      )}
      onClick={() => {
        if (mode === "select" && !disabled) {
          onToggleSelect?.(page.pageNumber);
        }
      }}
      onKeyDown={(event) => {
        if (
          mode === "select" &&
          !disabled &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          onToggleSelect?.(page.pageNumber);
        }
      }}
      role={mode === "select" ? "button" : undefined}
      tabIndex={mode === "select" && !disabled ? 0 : undefined}
    >
      {mode === "reorder" && onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute right-1 top-1 z-10 size-6 bg-background/80 opacity-0 transition-opacity group-hover:opacity-100"
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            onRemove(page.id);
          }}
          aria-label={`Удалить страницу ${page.pageNumber}`}
        >
          <XIcon className="size-3" />
        </Button>
      )}

      {page.thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={page.thumbnail}
          alt={`Страница ${page.pageNumber}`}
          className="aspect-[3/4] w-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="aspect-[3/4] w-full animate-pulse bg-muted" />
      )}

      <div className="space-y-0.5 px-1.5 py-1">
        <p className="text-center text-xs font-medium">{page.pageNumber}</p>
        <p className="truncate text-center text-[10px] text-muted-foreground">
          {page.sourceLabel}
        </p>
      </div>
    </div>
  );
}

interface SortablePageCardProps {
  page: PdfPageItem;
  mode: PdfPageGridMode;
  isSelected: boolean;
  isHighlighted: boolean;
  disabled?: boolean;
  onToggleSelect?: (pageNumber: number) => void;
  onRemove?: (id: string) => void;
}

function SortablePageCard({
  page,
  mode,
  isSelected,
  isHighlighted,
  disabled = false,
  onToggleSelect,
  onRemove,
}: SortablePageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: page.id,
    disabled: disabled || mode !== "reorder",
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      <button
        type="button"
        ref={setActivatorNodeRef}
        className="absolute left-1 top-1 z-10 rounded bg-background/80 p-0.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        disabled={disabled}
        aria-label="Перетащить страницу"
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon className="size-3.5" />
      </button>

      <PageCard
        page={page}
        mode={mode}
        isSelected={isSelected}
        isHighlighted={isHighlighted}
        disabled={disabled}
        isDragging={isDragging}
        onToggleSelect={onToggleSelect}
        onRemove={onRemove}
      />
    </div>
  );
}

export function PdfPageGrid({
  pages,
  mode,
  selectedPageNumbers = [],
  highlightedPageNumbers = [],
  disabled = false,
  onReorder,
  onToggleSelect,
  onRemove,
}: PdfPageGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const selectedSet = useMemo(
    () => new Set(selectedPageNumbers),
    [selectedPageNumbers],
  );
  const highlightedSet = useMemo(
    () => new Set(highlightedPageNumbers),
    [highlightedPageNumbers],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activePage = pages.find((page) => page.id === activeId) ?? null;
  const sortableIds = pages.map((page) => page.id);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);

    const { active, over } = event;
    if (!over || active.id === over.id || !onReorder) return;

    const oldIndex = pages.findIndex((page) => page.id === active.id);
    const newIndex = pages.findIndex((page) => page.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(arrayMove(pages, oldIndex, newIndex));
  };

  if (pages.length === 0) return null;

  const grid = (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
      {pages.map((page) => {
        const isSelected = selectedSet.has(page.pageNumber);
        const isHighlighted = highlightedSet.has(page.pageNumber);

        if (mode === "reorder") {
          return (
            <SortablePageCard
              key={page.id}
              page={page}
              mode={mode}
              isSelected={isSelected}
              isHighlighted={isHighlighted}
              disabled={disabled}
              onToggleSelect={onToggleSelect}
              onRemove={onRemove}
            />
          );
        }

        return (
          <PageCard
            key={page.id}
            page={page}
            mode={mode}
            isSelected={isSelected}
            isHighlighted={isHighlighted}
            disabled={disabled}
            onToggleSelect={onToggleSelect}
            onRemove={onRemove}
          />
        );
      })}
    </div>
  );

  if (mode !== "reorder") {
    return grid;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sortableIds} strategy={rectSortingStrategy}>
        {grid}
      </SortableContext>

      <DragOverlay>
        {activePage ? (
          <PageCard
            page={activePage}
            mode={mode}
            isSelected={selectedSet.has(activePage.pageNumber)}
            isHighlighted={highlightedSet.has(activePage.pageNumber)}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
