"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Camera, Gem, Heart, MapPin, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PlantAvatar } from "@/components/plants/plant-avatar";
import { StatBar } from "@/components/plants/stat-bar";
import { CareActions } from "@/components/plants/care-actions";
import { CareFeedback } from "@/components/plants/care-feedback";
import { statusFromHealth, STATUS_LABEL } from "@/lib/mock/plants";
import { applyCare, CARE_BY_ID, type CareActionId } from "@/lib/care";
import type { CareEvent, Plant } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function PlantDetail({ initial }: { initial: Plant }) {
  const [plant, setPlant] = useState<Plant>(initial);
  const [fx, setFx] = useState<{ effect: "drip" | "glow" | "sparkle" | "mist"; key: number } | null>(null);
  const status = statusFromHealth(plant.health);

  const handleCare = (action: CareActionId) => {
    const a = CARE_BY_ID[action];
    setFx({ effect: a.effect, key: Date.now() });
    setPlant((prev) => {
      const { plant: next, leveledUp } = applyCare(prev, action);
      const event: CareEvent = {
        id: `e-${Date.now()}`,
        label: a.label,
        icon: a.icon,
        when: "Just now",
      };
      toast(a.toast(next.name), { icon: a.icon });
      if (leveledUp) {
        setTimeout(() => toast(`🎉 ${next.name} reached Level ${next.level}!`, { icon: "⭐" }), 250);
      }
      return { ...next, timeline: [event, ...prev.timeline].slice(0, 8) };
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-8 sm:px-8">
      <Button asChild variant="ghost" size="sm" className="mb-5">
        <Link href="/plants">
          <ArrowLeft className="h-4 w-4" /> All plants
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        {/* hero card */}
        <Card className="relative overflow-hidden p-7">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-blush-100 to-transparent opacity-70 blur-2xl" />
          <div className="relative flex flex-col items-center text-center">
            <div className="relative">
              <PlantAvatar art={plant.art} status={status} size="xl" />
              {fx && <CareFeedback key={fx.key} effect={fx.effect} />}
            </div>
            <Badge variant={status} className="mt-4">{STATUS_LABEL[status]}</Badge>
            <h1 className="mt-3 font-display text-4xl tracking-tight text-plum-900">{plant.name}</h1>
            <p className="text-plum-500">{plant.species}</p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-plum-400">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {plant.room}</span>
              <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> Since {plant.acquired}</span>
            </div>

            {/* key figures */}
            <div className="mt-6 grid w-full grid-cols-3 gap-3">
              <Figure icon={<Gem className="h-4 w-4 text-rose-500" />} label="Level" value={String(plant.level)} />
              <Figure icon={<Heart className="h-4 w-4 text-rose-500" />} label="Health" value={`${plant.health}%`} />
              <Figure icon={<span className="text-sm">💎</span>} label="Value" value={formatCurrency(plant.value)} />
            </div>

            {/* xp */}
            <div className="mt-5 w-full">
              <div className="mb-1 flex justify-between text-[0.7rem] text-plum-400">
                <span>Level {plant.level}</span>
                <span>{plant.xp}/100 XP</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-blush-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-soft to-gold transition-[width] duration-500"
                  style={{ width: `${plant.xp}%` }}
                />
              </div>
            </div>

            {/* care */}
            <div className="mt-6 w-full">
              <p className="mb-2 text-left text-xs font-semibold uppercase tracking-wider text-rose-500">
                Care actions
              </p>
              <CareActions onAction={handleCare} variant="full" />
            </div>

            <Button asChild variant="soft" className="mt-3 w-full">
              <Link href="/plants/demo/photo-check">
                <Camera className="h-4 w-4" /> Take photo health check
              </Link>
            </Button>
          </div>
        </Card>

        {/* stats + timeline */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 font-display text-xl text-plum-900">Vital stats</h2>
            <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              <StatBar label="Hydration" value={plant.stats.hydration} tone="hydration" />
              <StatBar label="Sunlight" value={plant.stats.sunlight} tone="sunlight" />
              <StatBar label="Fertiliser" value={plant.stats.fertiliser} tone="fertiliser" />
              <StatBar label="Growth" value={plant.stats.growth} tone="growth" />
              <StatBar label="Leaf colour" value={plant.stats.leafColour} tone="leafColour" />
              <StatBar label="Stress level" value={plant.stats.stress} tone="stress" />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 font-display text-xl text-plum-900">Care timeline</h2>
            <ol className="relative space-y-4 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-blush-200">
              {plant.timeline.map((e) => (
                <li key={e.id} className="relative flex items-center gap-3 pl-1">
                  <span className="z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-blush-200 bg-paper text-sm shadow-sm">
                    {e.icon}
                  </span>
                  <div className="flex flex-1 items-center justify-between">
                    <span className="text-sm font-medium text-plum-700">{e.label}</span>
                    <span className="text-xs text-plum-400">{e.when}</span>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Figure({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-blush-50/70 p-3">
      <div className="flex items-center justify-center gap-1 text-[0.65rem] uppercase tracking-wide text-plum-400">
        {icon} {label}
      </div>
      <p className="mt-0.5 font-display text-xl text-plum-900">{value}</p>
    </div>
  );
}
