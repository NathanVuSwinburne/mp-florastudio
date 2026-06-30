"use client";

import { useTranslations } from "next-intl";
import { Rnd } from "react-rnd";
import { Copy, RotateCw, Trash2 } from "lucide-react";
import { FloraArt } from "@/components/flora-art";
import type { CanvasItem as TItem, ComponentDef } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CanvasItemView({
  item,
  def,
  selected,
  zoom,
  onSelect,
  onChange,
  onDuplicate,
  onDelete,
}: {
  item: TItem;
  def: ComponentDef;
  selected: boolean;
  zoom: number;
  onSelect: () => void;
  onChange: (patch: Partial<TItem>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations();
  return (
    <Rnd
      size={{ width: item.w, height: item.h }}
      position={{ x: item.x, y: item.y }}
      scale={zoom}
      bounds="parent"
      style={{ zIndex: item.z + (selected ? 1000 : 0) }}
      enableResizing={selected}
      lockAspectRatio
      minWidth={48}
      minHeight={48}
      resizeHandleStyles={
        selected
          ? {
              topLeft: handleDot,
              topRight: handleDot,
              bottomLeft: handleDot,
              bottomRight: handleDot,
            }
          : undefined
      }
      onMouseDown={onSelect}
      onDragStart={onSelect}
      onDragStop={(_e, d) => onChange({ x: d.x, y: d.y })}
      onResizeStop={(_e, _dir, ref, _delta, pos) =>
        onChange({
          w: parseFloat(ref.style.width),
          h: parseFloat(ref.style.height),
          x: pos.x,
          y: pos.y,
        })
      }
      className="group"
    >
      <div className="relative h-full w-full">
        {/* selection frame */}
        <div
          className={cn(
            "absolute inset-0 rounded-lg transition-all",
            selected
              ? "ring-2 ring-rose-400 ring-offset-2 ring-offset-transparent"
              : "ring-0 group-hover:ring-2 group-hover:ring-rose-300/50"
          )}
        />

        {/* the artwork */}
        <div
          className="h-full w-full"
          style={{
            transform: `rotate(${item.rotation}deg) scaleX(${item.flipped ? -1 : 1})`,
            opacity: item.opacity,
          }}
        >
          <FloraArt
            art={def.art}
            className="h-full w-full drop-shadow-[0_8px_10px_rgba(80,50,40,0.18)]"
          />
        </div>

        {/* floating toolbar */}
        {selected && (
          <div
            className="absolute -top-11 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-blush-200 bg-paper/95 px-1.5 py-1 shadow-[var(--shadow-bloom)] backdrop-blur"
            style={{ transform: `translateX(-50%) scale(${1 / zoom})`, transformOrigin: "bottom center" }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); onChange({ rotation: (item.rotation + 15) % 360 }); }}
              className="grid h-7 w-7 place-items-center rounded-full text-plum-500 hover:bg-blush-50 hover:text-rose-600"
              title={t("editor.rotate15")}
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
              className="grid h-7 w-7 place-items-center rounded-full text-plum-500 hover:bg-blush-50 hover:text-rose-600"
              title={t("editor.duplicate")}
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="grid h-7 w-7 place-items-center rounded-full text-rose-500 hover:bg-blush-50 hover:text-rose-700"
              title={t("editor.deleteTitle")}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </Rnd>
  );
}

const handleDot: React.CSSProperties = {
  width: 14,
  height: 14,
  borderRadius: 999,
  background: "#fff",
  border: "2px solid #de7491",
  boxShadow: "0 2px 6px rgba(199,91,119,0.35)",
};
