import type { Plant, PlantStats } from "@/lib/types";
import { clamp } from "@/lib/utils";

export type CareActionId = "water" | "sunlight" | "fertilise" | "mist";

export interface CareAction {
  id: CareActionId;
  label: string;
  icon: string; // emoji for buttons
  effect: "drip" | "glow" | "sparkle" | "mist";
  toast: (name: string) => string;
  apply: (s: PlantStats) => PlantStats;
  xp: number;
}

export const CARE_ACTIONS: CareAction[] = [
  {
    id: "water",
    label: "Water",
    icon: "💧",
    effect: "drip",
    xp: 6,
    toast: (n) => `${n} feels refreshed!`,
    apply: (s) => ({
      ...s,
      hydration: clamp(s.hydration + 18),
      stress: clamp(s.stress - 8),
      growth: clamp(s.growth + 3),
    }),
  },
  {
    id: "sunlight",
    label: "Give sunlight",
    icon: "☀️",
    effect: "glow",
    xp: 6,
    toast: (n) => `${n} is soaking up the sun!`,
    apply: (s) => ({
      ...s,
      sunlight: clamp(s.sunlight + 16),
      leafColour: clamp(s.leafColour + 6),
      stress: clamp(s.stress - 5),
    }),
  },
  {
    id: "fertilise",
    label: "Fertilise",
    icon: "🌱",
    effect: "sparkle",
    xp: 9,
    toast: (n) => `${n} is well fed and growing!`,
    apply: (s) => ({
      ...s,
      fertiliser: clamp(s.fertiliser + 20),
      growth: clamp(s.growth + 9),
      leafColour: clamp(s.leafColour + 4),
    }),
  },
  {
    id: "mist",
    label: "Mist leaves",
    icon: "🌫️",
    effect: "mist",
    xp: 5,
    toast: (n) => `${n} loves the gentle mist!`,
    apply: (s) => ({
      ...s,
      hydration: clamp(s.hydration + 8),
      leafColour: clamp(s.leafColour + 8),
      stress: clamp(s.stress - 10),
    }),
  },
];

export const CARE_BY_ID = Object.fromEntries(
  CARE_ACTIONS.map((a) => [a.id, a])
) as Record<CareActionId, CareAction>;

export function computeHealth(s: PlantStats): number {
  return Math.round(
    clamp(
      (s.hydration + s.sunlight + s.fertiliser + s.growth + s.leafColour + (100 - s.stress)) / 6
    )
  );
}

export interface ApplyResult {
  plant: Plant;
  leveledUp: boolean;
}

export function applyCare(plant: Plant, actionId: CareActionId): ApplyResult {
  const action = CARE_BY_ID[actionId];
  const stats = action.apply(plant.stats);
  let xp = plant.xp + action.xp;
  let level = plant.level;
  let leveledUp = false;
  let value = plant.value;
  while (xp >= 100) {
    xp -= 100;
    level += 1;
    leveledUp = true;
    value = Math.round(value * 1.08 + 5);
  }
  const health = computeHealth(stats);
  return {
    plant: { ...plant, stats, xp, level, value, health },
    leveledUp,
  };
}
