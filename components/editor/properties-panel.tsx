"use client";

import {
  Copy,
  Trash2,
  FlipHorizontal2,
  ArrowUp,
  ArrowDown,
  MousePointer2,
  Image as ImageIcon,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FloraArt } from "@/components/flora-art";
import { SAMPLE_SPACES } from "@/lib/mock/spaces";
import type { CanvasItem, ComponentDef } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function PropertiesPanel({
  item,
  def,
  spaceId,
  onChangeSpace,
  onChange,
  onDuplicate,
  onDelete,
  onLayer,
}: {
  item: CanvasItem | null;
  def: ComponentDef | null;
  spaceId: string;
  onChangeSpace: (id: string) => void;
  onChange: (patch: Partial<CanvasItem>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onLayer: (dir: "up" | "down") => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-blush-200/70 p-4">
        <h2 className="font-display text-lg text-plum-900">Properties</h2>
        <p className="text-xs text-plum-400">
          {item ? "Fine-tune the selected piece." : "Nothing selected."}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!item || !def ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-dashed border-blush-300 bg-blush-50/40 p-5 text-center">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-paper text-rose-400 shadow-sm">
                <MousePointer2 className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm text-plum-500">
                Select a piece on the canvas to edit its size, rotation and more.
              </p>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-500">
                <ImageIcon className="h-3.5 w-3.5" /> Background space
              </label>
              <Select value={spaceId} onValueChange={onChangeSpace}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SAMPLE_SPACES.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} · {s.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ul className="space-y-2 rounded-2xl bg-blush-50/60 p-4 text-xs text-plum-500">
              <li>💡 Tip: drag pieces straight from the library.</li>
              <li>🔁 Use the rotate button on a selection to spin it.</li>
              <li>🔍 Zoom with the controls at the bottom-right.</li>
            </ul>
          </div>
        ) : (
          <div className="space-y-6">
            {/* preview */}
            <div className="flex items-center gap-3 rounded-2xl border border-blush-200/70 bg-blush-50/50 p-3">
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-paper">
                <FloraArt art={def.art} className="h-11 w-11" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-plum-900">{def.name}</p>
                <p className="text-xs text-plum-400">{def.category}</p>
                <p className="text-xs font-medium text-rose-600">{formatCurrency(def.price)}</p>
              </div>
            </div>

            {def.note && (
              <p className="rounded-xl bg-paper px-3 py-2 text-xs italic text-plum-500">
                “{def.note}”
              </p>
            )}

            <Control label="Size" value={`${Math.round(item.w)}px`}>
              <Slider
                value={[item.w]}
                min={48}
                max={420}
                step={2}
                onValueChange={([w]) => {
                  const ratio = item.h / item.w;
                  onChange({ w, h: Math.round(w * ratio) });
                }}
              />
            </Control>

            <Control label="Rotation" value={`${item.rotation}°`}>
              <Slider
                value={[item.rotation]}
                min={0}
                max={359}
                step={1}
                onValueChange={([rotation]) => onChange({ rotation })}
              />
            </Control>

            <Control label="Opacity" value={`${Math.round(item.opacity * 100)}%`}>
              <Slider
                value={[item.opacity * 100]}
                min={20}
                max={100}
                step={1}
                onValueChange={([o]) => onChange({ opacity: o / 100 })}
              />
            </Control>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="soft" size="sm" onClick={() => onChange({ flipped: !item.flipped })}>
                <FlipHorizontal2 className="h-4 w-4" /> Flip
              </Button>
              <Button variant="soft" size="sm" onClick={onDuplicate}>
                <Copy className="h-4 w-4" /> Duplicate
              </Button>
              <Button variant="soft" size="sm" onClick={() => onLayer("up")}>
                <ArrowUp className="h-4 w-4" /> Forward
              </Button>
              <Button variant="soft" size="sm" onClick={() => onLayer("down")}>
                <ArrowDown className="h-4 w-4" /> Backward
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full border-rose-200 text-rose-600 hover:border-rose-400 hover:bg-blush-50"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" /> Delete piece
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Control({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">{label}</span>
        <span className="text-xs tabular-nums text-plum-500">{value}</span>
      </div>
      {children}
    </div>
  );
}
