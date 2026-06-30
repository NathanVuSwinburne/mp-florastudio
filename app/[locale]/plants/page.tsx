"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Plus, Camera, Sparkles, Leaf } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { PlantCard } from "@/components/plants/plant-card";
import { FloraArt } from "@/components/flora-art";
import { VineCorner } from "@/components/decorations";
import { statusFromHealth } from "@/lib/mock/plants";
import { applyCare, type CareActionId } from "@/lib/care";
import { getLocalizedPlants } from "@/lib/i18n-content";
import type { ArtKey, Plant } from "@/lib/types";

// Starter plants offered in the "register" dialog — keyed by art for translation.
const REGISTERABLE: { key: string; art: ArtKey }[] = [
  { key: "palm", art: "palm" },
  { key: "tulip", art: "tulip" },
  { key: "hydrangea", art: "hydrangea" },
  { key: "ivy", art: "ivy" },
  { key: "pothos", art: "pothos" },
];

const SHORT_LABEL: Record<CareActionId, string> = {
  water: "careActions.shortWater",
  sunlight: "careActions.shortSunlight",
  fertilise: "careActions.shortFertilise",
  mist: "careActions.shortMist",
};

let regCounter = 0;

export default function PlantsPage() {
  const t = useTranslations();
  const [plants, setPlants] = useState<Plant[]>(() => getLocalizedPlants(t));
  const [open, setOpen] = useState(false);

  const gardenHealth = Math.round(
    plants.reduce((s, p) => s + p.health, 0) / Math.max(1, plants.length)
  );
  const gardenLevel = Math.max(1, Math.round(plants.reduce((s, p) => s + p.level, 0) / Math.max(1, plants.length)));

  const counts = useMemo(() => {
    const c = { thriving: 0, okay: 0, needs: 0 };
    for (const p of plants) c[statusFromHealth(p.health)]++;
    return c;
  }, [plants]);

  const handleCare = (id: string, action: CareActionId) => {
    setPlants((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const { plant, leveledUp } = applyCare(p, action);
        toast(t("plants.careToast", { action: t(SHORT_LABEL[action]), name: plant.name }), { icon: "🌿" });
        if (leveledUp) {
          setTimeout(() => toast(t("plants.levelUpToast", { name: plant.name, level: plant.level }), { icon: "⭐" }), 250);
        }
        return plant;
      })
    );
  };

  const registerPlant = (pick: (typeof REGISTERABLE)[number]) => {
    const id = `reg-${++regCounter}`;
    const name = t(`registerable.${pick.key}.name`);
    const newPlant: Plant = {
      id,
      name,
      species: t(`registerable.${pick.key}.species`),
      art: pick.art,
      room: t("plants.newArrival"),
      level: 1,
      xp: 0,
      health: 70,
      value: 30,
      stats: { hydration: 70, sunlight: 70, fertiliser: 60, growth: 55, leafColour: 72, stress: 28 },
      acquired: t("plants.justNow"),
      timeline: [{ id: "t0", label: t("plants.registered"), icon: "🌱", when: t("plants.justNow") }],
    };
    newPlant.health = Math.round(
      (70 + 70 + 60 + 55 + 72 + (100 - 28)) / 6
    );
    setPlants((prev) => [...prev, newPlant]);
    setOpen(false);
    toast(t("plants.joinedToast", { name }), { icon: "🪴" });
  };

  return (
    <PageShell className="mx-auto w-full max-w-7xl px-5 pb-16 pt-10 sm:px-8">
      {/* garden header */}
      <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-blush-200 bg-gradient-to-br from-[#eef3ea] via-paper to-blush-50 p-8 shadow-[var(--shadow-petal)]">
        <VineCorner className="absolute -left-4 -top-4 h-36 w-36 opacity-50" />
        <VineCorner flip className="absolute -right-4 -bottom-8 h-36 w-36 opacity-40" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
          {/* health ring */}
          <div className="flex items-center gap-5">
            <HealthRing value={gardenHealth} label={t("plants.health")} />
            <div>
              <Badge variant="sage" className="mb-1">
                <Leaf className="h-3.5 w-3.5" /> {t("plants.gardenLevel", { level: gardenLevel })}
              </Badge>
              <h1 className="font-display text-3xl tracking-tight text-plum-900">{t("plants.yourGarden")}</h1>
              <p className="text-sm text-plum-500">{t("plants.plantsInCare", { count: plants.length })}</p>
            </div>
          </div>

          {/* status pills */}
          <div className="flex flex-wrap gap-2 lg:justify-center">
            <StatusPill tone="thriving" label={t("plants.statusThriving")} n={counts.thriving} />
            <StatusPill tone="okay" label={t("plants.statusOkay")} n={counts.okay} />
            <StatusPill tone="needs" label={t("plants.statusNeeds")} n={counts.needs} />
          </div>

          {/* actions */}
          <div className="flex flex-wrap gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4" /> {t("plants.registerPlant")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("plants.registerTitle")}</DialogTitle>
                  <DialogDescription>
                    {t("plants.registerDesc")}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {REGISTERABLE.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => registerPlant(p)}
                      className="flex flex-col items-center gap-2 rounded-2xl border border-blush-200 bg-paper p-3 transition-all hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-[var(--shadow-petal)]"
                    >
                      <div className="grid h-16 w-16 place-items-center rounded-xl bg-blush-50">
                        <FloraArt art={p.art} className="h-12 w-12" />
                      </div>
                      <span className="text-xs font-medium text-plum-700">{t(`registerable.${p.key}.name`)}</span>
                      <span className="text-[0.62rem] text-plum-400">{t(`registerable.${p.key}.species`)}</span>
                    </button>
                  ))}
                </div>
                <DialogClose asChild>
                  <Button variant="ghost" className="mt-1">{t("plants.cancel")}</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
            <Button asChild variant="outline">
              <Link href="/plants/demo/photo-check">
                <Camera className="h-4 w-4" /> {t("plants.photoCheck")}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* tip */}
      <div className="mt-6 flex items-center gap-2 rounded-2xl bg-blush-50/70 px-4 py-3 text-sm text-plum-500">
        <Sparkles className="h-4 w-4 shrink-0 text-rose-400" />
        {t("plants.tip")}
      </div>

      {/* grid */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {plants.map((p) => (
          <PlantCard key={p.id} plant={p} onCare={(action) => handleCare(p.id, action)} />
        ))}
      </div>
    </PageShell>
  );
}

function HealthRing({ value, label }: { value: number; label: string }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  return (
    <div className="relative grid h-24 w-24 place-items-center">
      <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#f6d4e0" strokeWidth="8" />
        <circle
          cx="40" cy="40" r={r} fill="none"
          stroke="url(#hg)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700"
        />
        <defs>
          <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#74c08a" />
            <stop offset="100%" stopColor="#de7491" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-2xl leading-none text-plum-900">{value}</p>
        <p className="text-[0.6rem] uppercase tracking-wide text-plum-400">{label}</p>
      </div>
    </div>
  );
}

function StatusPill({ tone, label, n }: { tone: "thriving" | "okay" | "needs"; label: string; n: number }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-blush-200 bg-paper px-4 py-2 shadow-sm">
      <Badge variant={tone}>{n}</Badge>
      <span className="text-sm text-plum-600">{label}</span>
    </div>
  );
}
