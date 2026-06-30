import type { SampleSpace, SpaceType } from "@/lib/types";

export const SPACE_TYPES: SpaceType[] = [
  "Garden",
  "Balcony",
  "Backyard",
  "Courtyard",
  "Living room",
  "Indoor corner",
];

/** Mock "photos" rendered as rich CSS gradients (no external images). */
export const SAMPLE_SPACES: SampleSpace[] = [
  {
    id: "sp-courtyard",
    name: "Sunlit Courtyard",
    type: "Courtyard",
    accent: "#e8b9a0",
    gradient:
      "linear-gradient(180deg, #fbe9d8 0%, #f6d7c0 38%, #e8c3a6 60%, #cbb091 60%, #b89c7d 100%)",
  },
  {
    id: "sp-garden",
    name: "Rose Garden",
    type: "Garden",
    accent: "#cde0b8",
    gradient:
      "linear-gradient(180deg, #dff0f7 0%, #cfe7d4 45%, #aacb96 62%, #8fb87e 62%, #6f9a63 100%)",
  },
  {
    id: "sp-balcony",
    name: "City Balcony",
    type: "Balcony",
    accent: "#f0c9d6",
    gradient:
      "linear-gradient(180deg, #f4e2ea 0%, #e9c9d8 40%, #d8b6c8 55%, #b9a6ad 55%, #9a8a93 100%)",
  },
  {
    id: "sp-backyard",
    name: "Leafy Backyard",
    type: "Backyard",
    accent: "#bfe0a8",
    gradient:
      "linear-gradient(180deg, #e9f4e3 0%, #cfe8bd 44%, #a9d18c 60%, #87b86a 60%, #5f8f48 100%)",
  },
  {
    id: "sp-living",
    name: "Linen Living Room",
    type: "Living room",
    accent: "#f3dbe2",
    gradient:
      "linear-gradient(180deg, #fbf3ee 0%, #f3e6df 52%, #e8d6cb 52%, #d8c2b4 100%)",
  },
  {
    id: "sp-corner",
    name: "Reading Corner",
    type: "Indoor corner",
    accent: "#efd9d0",
    gradient:
      "linear-gradient(180deg, #faf1ec 0%, #f1e0d6 50%, #e4cdbf 50%, #d2b6a4 100%)",
  },
];

export const SPACES_BY_ID = Object.fromEntries(
  SAMPLE_SPACES.map((s) => [s.id, s])
) as Record<string, SampleSpace>;
