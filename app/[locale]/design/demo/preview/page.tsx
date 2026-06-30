"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  Sprout,
  ShoppingBag,
  Share2,
  Download,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DesignScene } from "@/components/design-scene";
import { FloraArt } from "@/components/flora-art";
import { FloralDivider, VineCorner } from "@/components/decorations";
import { COMPONENTS_BY_ID } from "@/lib/mock/components";
import { SPACES_BY_ID } from "@/lib/mock/spaces";
import { DEMO_DESIGN, DEMO_SPACE_ID } from "@/lib/mock/projects";
import type { CanvasItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const PLANT_CATS = new Set(["Plants", "Flowers", "Vines"]);

export default function PreviewPage() {
  const t = useTranslations();
  const [spaceId, setSpaceId] = useState(DEMO_SPACE_ID);
  const [items, setItems] = useState<CanvasItem[]>(DEMO_DESIGN);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("florastudio:design");
      if (raw) {
        const parsed = JSON.parse(raw) as { spaceId: string; items: CanvasItem[] };
        if (parsed.items?.length) {
          setItems(parsed.items);
          setSpaceId(parsed.spaceId || DEMO_SPACE_ID);
        }
      }
    } catch {
      /* keep defaults */
    }
  }, []);

  const space = SPACES_BY_ID[spaceId];

  const grouped = useMemo(() => {
    const map = new Map<string, number>();
    for (const it of items) map.set(it.defId, (map.get(it.defId) ?? 0) + 1);
    return [...map.entries()]
      .map(([defId, count]) => ({ def: COMPONENTS_BY_ID[defId], count }))
      .filter((g) => g.def);
  }, [items]);

  const total = grouped.reduce((s, g) => s + g.def.price * g.count, 0);
  const plantCount = grouped
    .filter((g) => PLANT_CATS.has(g.def.category))
    .reduce((s, g) => s + g.count, 0);

  return (
    <PageShell className="mx-auto w-full max-w-7xl px-5 pb-16 pt-8 sm:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/design/demo/editor">
            <ArrowLeft className="h-4 w-4" /> {t("preview.backToEditor")}
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled title={t("preview.demoOnly")}>
            <Share2 className="h-4 w-4" /> {t("preview.share")}
          </Button>
          <Button variant="outline" size="sm" disabled title={t("preview.demoOnly")}>
            <Download className="h-4 w-4" /> {t("preview.export")}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* preview image */}
        <div>
          <Badge variant="gold" className="mb-3">
            <Sparkles className="h-3.5 w-3.5" /> {t("preview.finalPreview")}
          </Badge>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-blush-200/40 to-gold-soft/30 blur-2xl" />
            <DesignScene spaceId={spaceId} items={items} className="shadow-[var(--shadow-bloom)]" />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-plum-500">
            <span>📍 {space ? t(`spaces.${space.id}`) : ""}</span>
            <span>🪴 {t("preview.piecesPlaced", { count: items.length })}</span>
            <span>🌿 {t("preview.livingPlants", { count: plantCount })}</span>
          </div>
        </div>

        {/* shopping list */}
        <div>
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-blush-200 bg-paper shadow-[var(--shadow-petal)]">
            <VineCorner flip className="absolute -left-3 -top-3 h-24 w-24 opacity-50" />
            <div className="border-b border-blush-200/70 p-5">
              <h2 className="flex items-center gap-2 font-display text-xl text-plum-900">
                <ShoppingBag className="h-5 w-5 text-rose-500" /> {t("preview.shoppingTitle")}
              </h2>
              <p className="text-xs text-plum-400">{t("preview.shoppingSub")}</p>
            </div>

            <div className="max-h-[360px] overflow-y-auto p-3">
              {grouped.length === 0 ? (
                <p className="p-6 text-center text-sm text-plum-400">{t("preview.noPieces")}</p>
              ) : (
                <ul className="space-y-1.5">
                  {grouped.map(({ def, count }) => (
                    <li
                      key={def.id}
                      className="flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-blush-50"
                    >
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-blush-50">
                        <FloraArt art={def.art} className="h-9 w-9" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-plum-800">{t(`components.${def.id}.name`)}</p>
                        <p className="text-xs text-plum-400">{t(`categories.${def.category}`)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-plum-800">
                          {formatCurrency(def.price * count)}
                        </p>
                        {count > 1 && <p className="text-[0.65rem] text-plum-400">×{count}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-blush-200/70 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-plum-500">{t("preview.estimatedTotal")}</span>
                <span className="font-display text-2xl text-plum-900">{formatCurrency(total)}</span>
              </div>
              <FloralDivider className="my-4" />
              <Button asChild className="w-full" size="lg">
                <Link href="/plants">
                  <Sprout className="h-4 w-4" /> {t("preview.trackPlants")}
                </Link>
              </Button>
              <p className="mt-2 text-center text-[0.7rem] text-plum-400">
                {t("preview.trackPlantsHint")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* placed pieces gallery */}
      <div className="mt-14">
        <h3 className="font-display text-2xl tracking-tight text-plum-900">{t("preview.inThisDesign")}</h3>
        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {grouped.map(({ def, count }) => (
            <Card key={def.id} className="flex flex-col items-center p-3 text-center">
              <FloraArt art={def.art} className="h-14 w-14" />
              <p className="mt-1.5 line-clamp-1 text-xs font-medium text-plum-700">{t(`components.${def.id}.name`)}</p>
              {count > 1 && <span className="text-[0.65rem] text-rose-500">×{count}</span>}
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
