"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";

import { ColorPicker } from "@/components/shared/color-picker";
import { SliderField } from "@/components/shared/slider-field";
import { ToolControlsShell } from "@/components/shared/tool-controls-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { KeyframeStep, KeyframesState } from "@/components/tools/keyframes/types";
import {
  ITERATION_OPTIONS,
  MAX_KEYFRAME_STEPS,
  MIN_KEYFRAME_STEPS,
  TIMING_FUNCTIONS,
} from "@/components/tools/keyframes/types";
import { useLivePreviewActions } from "@/hooks/use-live-preview";

interface ControlsPanelProps {
  state: KeyframesState;
  activeStep: KeyframeStep | null;
  onUpdate: (partial: Partial<KeyframesState>) => void;
  onUpdateStep: (id: string, partial: Partial<KeyframeStep>) => void;
  onReset: () => void;
  onSelectStep: (id: string) => void;
  onAddStep: () => void;
  onRemoveStep: (id: string) => void;
  className?: string;
}

export function ControlsPanel({
  state,
  activeStep,
  onUpdate,
  onUpdateStep,
  onReset,
  onSelectStep,
  onAddStep,
  onRemoveStep,
  className,
}: ControlsPanelProps) {
  const { setLive } = useLivePreviewActions<KeyframesState>();
  const sortedSteps = [...state.steps].sort((a, b) => a.percent - b.percent);

  return (
    <ToolControlsShell onReset={onReset} className={className}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="keyframes-name">Имя анимации</Label>
          <Input
            id="keyframes-name"
            value={state.name}
            onChange={(event) => onUpdate({ name: event.target.value })}
            className="font-mono text-sm"
          />
        </div>
        <SliderField
          label="Длительность"
          value={state.duration}
          min={0.5}
          max={10}
          step={0.1}
          format={(value) => `${value}s`}
          onChange={(duration) => onUpdate({ duration })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Timing function</Label>
          <Select
            value={state.timingFunction}
            onValueChange={(timingFunction) => onUpdate({ timingFunction })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMING_FUNCTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Iteration count</Label>
          <Select
            value={state.iterationCount}
            onValueChange={(iterationCount) => onUpdate({ iterationCount })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITERATION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Label>Timeline</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddStep}
            disabled={state.steps.length >= MAX_KEYFRAME_STEPS}
          >
            <PlusIcon />
            Шаг
          </Button>
        </div>

        <div className="relative h-10 rounded-lg border border-border bg-muted/40">
          {sortedSteps.map((step) => (
            <button
              key={step.id}
              type="button"
              className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background transition-transform hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ left: `${step.percent}%` }}
              onClick={() => onSelectStep(step.id)}
              aria-label={`Шаг ${step.percent}%`}
              aria-pressed={state.activeStepId === step.id}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {sortedSteps.map((step) => (
            <div key={step.id} className="flex items-center gap-1">
              <Button
                type="button"
                variant={
                  state.activeStepId === step.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => onSelectStep(step.id)}
              >
                {step.percent}%
              </Button>
              {state.steps.length > MIN_KEYFRAME_STEPS && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onRemoveStep(step.id)}
                  aria-label={`Удалить шаг ${step.percent}%`}
                >
                  <Trash2Icon className="size-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {activeStep && (
        <>
          <SliderField
            label="Процент"
            value={activeStep.percent}
            min={0}
            max={100}
            step={1}
            format={(value) => `${value}%`}
            onChange={(percent) => onUpdateStep(activeStep.id, { percent })}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <SliderField
              label="Translate X"
              value={activeStep.translateX}
              min={-150}
              max={150}
              step={1}
              format={(value) => `${value}px`}
              onChange={(translateX) =>
                onUpdateStep(activeStep.id, { translateX })
              }
            />
            <SliderField
              label="Translate Y"
              value={activeStep.translateY}
              min={-150}
              max={150}
              step={1}
              format={(value) => `${value}px`}
              onChange={(translateY) =>
                onUpdateStep(activeStep.id, { translateY })
              }
            />
            <SliderField
              label="Scale"
              value={activeStep.scale}
              min={0.1}
              max={3}
              step={0.05}
              format={(value) => `${value}`}
              onChange={(scale) => onUpdateStep(activeStep.id, { scale })}
            />
            <SliderField
              label="Rotate"
              value={activeStep.rotate}
              min={-360}
              max={360}
              step={1}
              format={(value) => `${value}°`}
              onChange={(rotate) => onUpdateStep(activeStep.id, { rotate })}
            />
            <SliderField
              label="Opacity"
              value={activeStep.opacity}
              min={0}
              max={1}
              step={0.01}
              format={(value) => `${Math.round(value * 100)}%`}
              onChange={(opacity) => onUpdateStep(activeStep.id, { opacity })}
            />
          </div>

          <ColorPicker
            label="Background color"
            color={activeStep.backgroundColor}
            opacity={1}
            showOpacity={false}
            onLiveColorChange={(backgroundColor) =>
              setLive((prev) => ({
                ...prev,
                steps: prev.steps.map((step) =>
                  step.id === activeStep.id
                    ? { ...step, backgroundColor }
                    : step,
                ),
              }))
            }
            onColorChange={(backgroundColor) =>
              onUpdateStep(activeStep.id, { backgroundColor })
            }
            onOpacityChange={() => undefined}
          />
        </>
      )}

      <ColorPicker
        label="Фон preview"
        color={state.previewBgColor}
        opacity={1}
        showOpacity={false}
        onLiveColorChange={(previewBgColor) =>
          setLive((prev) => ({ ...prev, previewBgColor }))
        }
        onColorChange={(previewBgColor) => onUpdate({ previewBgColor })}
        onOpacityChange={() => undefined}
      />
    </ToolControlsShell>
  );
}
