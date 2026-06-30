"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Heart, TrendingUp, Gem } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PlantAvatar } from "@/components/plants/plant-avatar";
import { StatBar } from "@/components/plants/stat-bar";
import { CareActions } from "@/components/plants/care-actions";
import { CareFeedback } from "@/components/plants/care-feedback";
import { statusFromHealth } from "@/lib/mock/plants";
import { CARE_BY_ID, type CareActionId } from "@/lib/care";
import { statusLabel } from "@/lib/i18n-content";
import type { Plant } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function PlantCard({
  plant,
  onCare,
}: {
  plant: Plant;
  onCare: (id: CareActionId) => void;
}) {
  const t = useTranslations();
  const [fx, setFx] = useState<{ effect: "drip" | "glow" | "sparkle" | "mist"; key: number } | null>(null);
  const status = statusFromHealth(plant.health);

  const handle = (id: CareActionId) => {
    setFx({ effect: CARE_BY_ID[id].effect, key: Date.now() });
    onCare(id);
  };

  return (
    <Card className="group relative overflow-hidden p-5 transition-shadow hover:shadow-[var(--shadow-bloom)]">
      {/* level chip */}
      <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-blush-100 px-2.5 py-1 text-xs font-semibold text-rose-600">
        <Gem className="h-3 w-3" /> {t("plantCard.level", { level: plant.level })}
      </div>

      <div className="flex items-start gap-4">
        <div className="relative">
          <PlantAvatar art={plant.art} status={status} size="md" />
          {fx && <CareFeedback key={fx.key} effect={fx.effect} />}
        </div>
        <div className="min-w-0 flex-1 pt-1">
          <Link href="/plants/demo" className="block">
            <h3 className="truncate font-display text-xl text-plum-900 hover:text-rose-600">
              {plant.name}
            </h3>
          </Link>
          <p className="truncate text-xs text-plum-400">{plant.species}</p>
          <Badge variant={status} className="mt-2">{statusLabel(t, status)}</Badge>
        </div>
      </div>

      {/* health + value */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-blush-50/70 p-2.5">
          <p className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide text-plum-400">
            <Heart className="h-3 w-3 text-rose-400" /> {t("plantCard.health")}
          </p>
          <p className="font-display text-2xl text-plum-900">{plant.health}%</p>
        </div>
        <div className="rounded-xl bg-blush-50/70 p-2.5">
          <p className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide text-plum-400">
            <TrendingUp className="h-3 w-3 text-sage" /> {t("plantCard.value")}
          </p>
          <p className="font-display text-2xl text-plum-900">{formatCurrency(plant.value)}</p>
        </div>
      </div>

      {/* xp bar */}
      <div className="mt-3">
        <div className="mb-1 flex justify-between text-[0.65rem] text-plum-400">
          <span>{t("plantCard.xpToNext", { level: plant.level + 1 })}</span>
          <span>{plant.xp}/100</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-blush-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold-soft to-gold transition-[width] duration-500"
            style={{ width: `${plant.xp}%` }}
          />
        </div>
      </div>

      {/* mini stats */}
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
        <StatBar label={t("plantCard.water")} value={plant.stats.hydration} tone="hydration" showValue={false} />
        <StatBar label={t("plantCard.sun")} value={plant.stats.sunlight} tone="sunlight" showValue={false} />
        <StatBar label={t("plantCard.feed")} value={plant.stats.fertiliser} tone="fertiliser" showValue={false} />
        <StatBar label={t("plantCard.growth")} value={plant.stats.growth} tone="growth" showValue={false} />
      </div>

      {/* care */}
      <div className="mt-4">
        <CareActions onAction={handle} />
      </div>
    </Card>
  );
}
