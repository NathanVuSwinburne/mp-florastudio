// ---------------------------------------------------------------------------
// Helpers that map the mock data (which carries stable English ids) onto the
// translated strings in messages/<locale>.json. Pass a global next-intl
// translator — `const t = useTranslations()` — i.e. one with NO namespace, so
// the full key paths below resolve.
// ---------------------------------------------------------------------------
import { PLANTS } from "@/lib/mock/plants";
import type { AiScanResult, Plant, PlantStatus } from "@/lib/types";

/** Structural type for a global next-intl translator (callable + `.raw`). */
export type Translator = {
  (key: string, values?: Record<string, string | number>): string;
  raw: (key: string) => unknown;
};

const STATUS_KEY: Record<PlantStatus, string> = {
  thriving: "plants.statusThriving",
  okay: "plants.statusOkay",
  needs: "plants.statusNeeds",
};

export function statusLabel(t: Translator, status: PlantStatus): string {
  return t(STATUS_KEY[status]);
}

/** Replace a plant's display fields (species, room, acquired, timeline) with
 * the translated copy keyed by the plant id. Pet names are kept as-is. */
export function localizePlant(t: Translator, plant: Plant): Plant {
  const base = `gardenPlants.${plant.id}`;
  return {
    ...plant,
    species: t(`${base}.species`),
    room: t(`${base}.room`),
    acquired: t(`${base}.acquired`),
    timeline: plant.timeline.map((e) => ({
      ...e,
      label: t(`${base}.timeline.${e.id}`),
      when: t(`${base}.when.${e.id}`),
    })),
  };
}

export function getLocalizedPlants(t: Translator): Plant[] {
  return PLANTS.map((p) => localizePlant(t, p));
}

// Confidence scores stay fixed per scripted verdict (was inline in aiScans.ts).
const SCAN_CONFIDENCE: Record<PlantStatus, number> = {
  thriving: 94,
  okay: 88,
  needs: 91,
};

const SCAN_STATUSES: PlantStatus[] = ["thriving", "okay", "needs"];

export function localizeScan(t: Translator, status: PlantStatus): AiScanResult {
  const base = `aiScans.${status}`;
  return {
    status,
    verdict: t(`${base}.verdict`),
    confidence: SCAN_CONFIDENCE[status],
    highlights: t.raw(`${base}.highlights`) as AiScanResult["highlights"],
    recommendations: t.raw(`${base}.recommendations`) as string[],
  };
}

export function randomScan(t: Translator): AiScanResult {
  const status = SCAN_STATUSES[Math.floor(Math.random() * SCAN_STATUSES.length)];
  return localizeScan(t, status);
}
