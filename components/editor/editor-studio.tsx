"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ChevronLeft,
  Eye,
  Minus,
  Plus,
  Maximize,
  Trash2,
  Sparkles,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FlowerMark } from "@/components/brand";
import { ComponentLibrary } from "@/components/editor/component-library";
import { PropertiesPanel } from "@/components/editor/properties-panel";
import { CanvasItemView } from "@/components/editor/canvas-item";
import { CANVAS_H, CANVAS_W } from "@/lib/canvas";
import { COMPONENTS_BY_ID } from "@/lib/mock/components";
import { SPACES_BY_ID } from "@/lib/mock/spaces";
import { DEMO_DESIGN, DEMO_SPACE_ID } from "@/lib/mock/projects";
import type { CanvasItem, ComponentDef } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

let counter = 100;
const nextId = () => `c${++counter}`;

export function EditorStudio() {
  const t = useTranslations();
  const router = useRouter();
  const [items, setItems] = useState<CanvasItem[]>(() =>
    DEMO_DESIGN.map((d) => ({ ...d }))
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [spaceId, setSpaceId] = useState(DEMO_SPACE_ID);
  const [zoom, setZoom] = useState(0.8);

  const selected = items.find((i) => i.instanceId === selectedId) ?? null;
  const selectedDef = selected ? COMPONENTS_BY_ID[selected.defId] : null;
  const space = SPACES_BY_ID[spaceId];

  const totalCost = useMemo(
    () => items.reduce((s, it) => s + (COMPONENTS_BY_ID[it.defId]?.price ?? 0), 0),
    [items]
  );
  const topZ = items.reduce((m, i) => Math.max(m, i.z), 0);

  const addComponent = useCallback(
    (def: ComponentDef) => {
      const id = nextId();
      const cascade = (items.length % 6) * 18;
      setItems((prev) => [
        ...prev,
        {
          instanceId: id,
          defId: def.id,
          x: CANVAS_W / 2 - def.w / 2 + cascade,
          y: CANVAS_H / 2 - def.h / 2 + cascade,
          w: def.w,
          h: def.h,
          rotation: 0,
          z: prev.reduce((m, i) => Math.max(m, i.z), 0) + 1,
          flipped: false,
          opacity: 1,
        },
      ]);
      setSelectedId(id);
      toast(t("editor.addedToast", { name: t(`components.${def.id}.name`) }), { icon: "🌿" });
    },
    [items.length, t]
  );

  const updateItem = useCallback((id: string, patch: Partial<CanvasItem>) => {
    setItems((prev) =>
      prev.map((it) => (it.instanceId === id ? { ...it, ...patch } : it))
    );
  }, []);

  const duplicate = useCallback(
    (id: string) => {
      const src = items.find((i) => i.instanceId === id);
      if (!src) return;
      const newId = nextId();
      setItems((prev) => [
        ...prev,
        { ...src, instanceId: newId, x: src.x + 28, y: src.y + 28, z: topZ + 1 },
      ]);
      setSelectedId(newId);
      toast(t("editor.duplicatedToast"), { icon: "📑" });
    },
    [items, topZ, t]
  );

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.instanceId !== id));
    setSelectedId(null);
    toast(t("editor.removedToast"), { icon: "🗑️" });
  }, [t]);

  const layer = useCallback(
    (id: string, dir: "up" | "down") => {
      setItems((prev) =>
        prev.map((it) =>
          it.instanceId === id
            ? { ...it, z: Math.max(0, it.z + (dir === "up" ? 1 : -1)) }
            : it
        )
      );
    },
    []
  );

  const clearAll = () => {
    setItems([]);
    setSelectedId(null);
    toast(t("editor.clearedToast"), { icon: "🧹" });
  };

  const preview = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "florastudio:design",
        JSON.stringify({ spaceId, items })
      );
    }
    router.push("/design/demo/preview");
  };

  const setZoomClamped = (z: number) =>
    setZoom(Math.min(2, Math.max(0.5, Math.round(z * 100) / 100)));

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-cream">
      {/* ---------------------------------------------------------- TOP TOOLBAR */}
      <header className="z-30 flex h-14 items-center justify-between border-b border-blush-200 bg-paper/90 px-3 backdrop-blur sm:px-4">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="shrink-0">
            <Link href="/dashboard" aria-label={t("editor.backToDashboard")}>
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-blush-100">
            <FlowerMark className="h-5 w-5" />
          </span>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-medium text-plum-900">{t("editor.projectName")}</p>
            <p className="text-[0.65rem] text-plum-400">{t("editor.autoSaved", { space: t(`spaces.${spaceId}`) })}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="soft" className="hidden sm:inline-flex">
            <Layers className="h-3 w-3" /> {t("editor.items", { count: items.length })}
          </Badge>
          <Badge variant="gold" className="hidden sm:inline-flex">
            {formatCurrency(totalCost)}
          </Badge>
          <Button variant="outline" size="sm" onClick={clearAll} className="hidden sm:inline-flex">
            <Trash2 className="h-4 w-4" /> {t("editor.clear")}
          </Button>
          <Button size="sm" onClick={preview}>
            <Eye className="h-4 w-4" /> {t("editor.preview")}
          </Button>
        </div>
      </header>

      {/* ---------------------------------------------------------- WORKSPACE */}
      <div className="flex min-h-0 flex-1">
        {/* left library */}
        <aside className="hidden w-72 shrink-0 border-r border-blush-200 bg-paper md:block">
          <ComponentLibrary onAdd={addComponent} />
        </aside>

        {/* canvas */}
        <section className="relative min-w-0 flex-1">
          <div
            className="checker-soft absolute inset-0 overflow-auto p-8"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setSelectedId(null);
            }}
          >
            {/* sizer keeps scroll area correct at any zoom */}
            <div
              className="relative mx-auto"
              style={{ width: CANVAS_W * zoom, height: CANVAS_H * zoom }}
            >
              <div
                className="absolute left-0 top-0 origin-top-left overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-bloom)] ring-1 ring-black/5"
                style={{
                  width: CANVAS_W,
                  height: CANVAS_H,
                  transform: `scale(${zoom})`,
                  background: space?.gradient,
                }}
                onMouseDown={(e) => {
                  if (e.target === e.currentTarget) setSelectedId(null);
                }}
              >
                {/* ground shadow band */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                  style={{ background: "linear-gradient(180deg, transparent, rgba(80,50,40,0.12))" }}
                />

                {items.map((item) => {
                  const def = COMPONENTS_BY_ID[item.defId];
                  if (!def) return null;
                  return (
                    <CanvasItemView
                      key={item.instanceId}
                      item={item}
                      def={def}
                      selected={item.instanceId === selectedId}
                      zoom={zoom}
                      onSelect={() => setSelectedId(item.instanceId)}
                      onChange={(patch) => updateItem(item.instanceId, patch)}
                      onDuplicate={() => duplicate(item.instanceId)}
                      onDelete={() => remove(item.instanceId)}
                    />
                  );
                })}

                {items.length === 0 && (
                  <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                    <div className="rounded-2xl bg-paper/70 px-6 py-5 backdrop-blur">
                      <Sparkles className="mx-auto h-6 w-6 text-rose-400" />
                      <p className="mt-2 text-sm font-medium text-plum-700">{t("editor.canvasEmpty")}</p>
                      <p className="text-xs text-plum-400">{t("editor.canvasEmptyHint")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* zoom control */}
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-blush-200 bg-paper/95 p-1 shadow-[var(--shadow-bloom)] backdrop-blur">
            <button
              onClick={() => setZoomClamped(zoom - 0.1)}
              className="grid h-8 w-8 place-items-center rounded-full text-plum-500 hover:bg-blush-50 hover:text-rose-600"
              aria-label={t("editor.zoomOut")}
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={() => setZoomClamped(0.8)}
              className="min-w-[3.2rem] rounded-full px-2 text-xs font-medium tabular-nums text-plum-600 hover:text-rose-600"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={() => setZoomClamped(zoom + 0.1)}
              className="grid h-8 w-8 place-items-center rounded-full text-plum-500 hover:bg-blush-50 hover:text-rose-600"
              aria-label={t("editor.zoomIn")}
            >
              <Plus className="h-4 w-4" />
            </button>
            <span className="mx-1 h-5 w-px bg-blush-200" />
            <button
              onClick={() => setZoomClamped(1)}
              className="grid h-8 w-8 place-items-center rounded-full text-plum-500 hover:bg-blush-50 hover:text-rose-600"
              aria-label={t("editor.resetZoom")}
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>

          {/* mobile library hint */}
          <div className="absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full bg-plum-900/80 px-3 py-1 text-[0.65rem] text-white md:hidden">
            {t("editor.mobileHint")}
          </div>
        </section>

        {/* right properties */}
        <aside className="hidden w-72 shrink-0 border-l border-blush-200 bg-paper lg:block">
          <PropertiesPanel
            item={selected}
            def={selectedDef}
            spaceId={spaceId}
            onChangeSpace={setSpaceId}
            onChange={(patch) => selected && updateItem(selected.instanceId, patch)}
            onDuplicate={() => selected && duplicate(selected.instanceId)}
            onDelete={() => selected && remove(selected.instanceId)}
            onLayer={(dir) => selected && layer(selected.instanceId, dir)}
          />
        </aside>
      </div>
    </div>
  );
}
