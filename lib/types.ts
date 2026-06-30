// ---------------------------------------------------------------------------
// MP FloraStudio — shared types (frontend-only demo, all data is mocked)
// ---------------------------------------------------------------------------

export type ArtKey =
  | "monstera"
  | "fiddle-leaf"
  | "snake-plant"
  | "pothos"
  | "fern"
  | "succulent"
  | "palm"
  | "rose"
  | "tulip"
  | "peony"
  | "lavender"
  | "hydrangea"
  | "pot-terracotta"
  | "pot-ceramic"
  | "pot-tall"
  | "vine"
  | "ivy"
  | "stone"
  | "pebbles"
  | "statue"
  | "fountain"
  | "lantern"
  | "string-lights"
  | "floor-lamp"
  | "bench"
  | "outdoor-chair"
  | "sofa"
  | "armchair"
  | "coffee-table"
  | "rug"
  | "wall-frame"
  | "mirror"
  | "shelf"
  | "cushion"
  | "vase";

export type ComponentCategory =
  | "Flowers"
  | "Plants"
  | "Pots"
  | "Vines"
  | "Stones"
  | "Statues"
  | "Lighting"
  | "Benches"
  | "Outdoor furniture"
  | "Indoor furniture"
  | "Wall decor"
  | "Living room decor";

export interface ComponentDef {
  id: string;
  name: string;
  category: ComponentCategory;
  art: ArtKey;
  price: number;
  /** default footprint on the canvas, in px at 100% zoom */
  w: number;
  h: number;
  /** marketing-y blurb for the properties panel */
  note?: string;
  tags?: string[];
}

export interface CanvasItem {
  instanceId: string;
  defId: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  z: number;
  flipped: boolean;
  opacity: number;
}

export type SpaceType =
  | "Garden"
  | "Balcony"
  | "Backyard"
  | "Courtyard"
  | "Living room"
  | "Indoor corner";

export interface SampleSpace {
  id: string;
  name: string;
  type: SpaceType;
  /** CSS gradient used as the mock "photo" */
  gradient: string;
  accent: string;
}

export interface Project {
  id: string;
  name: string;
  spaceType: SpaceType;
  spaceId: string;
  style: string;
  itemCount: number;
  plantCount: number;
  estCost: number;
  updatedAt: string;
  status: "Draft" | "In progress" | "Ready";
}

export type PlantStatus = "thriving" | "okay" | "needs";

export interface PlantStats {
  hydration: number;
  sunlight: number;
  fertiliser: number; // higher = better fed
  growth: number;
  leafColour: number; // 0..100 vibrancy
  stress: number; // higher = more stressed (bad)
}

export interface CareEvent {
  id: string;
  label: string;
  icon: string;
  when: string;
}

export interface Plant {
  id: string;
  name: string;
  species: string;
  art: ArtKey;
  room: string;
  level: number;
  xp: number; // 0..100 toward next level
  health: number;
  value: number;
  stats: PlantStats;
  timeline: CareEvent[];
  acquired: string;
}

export interface AiScanResult {
  verdict: string;
  confidence: number;
  status: PlantStatus;
  highlights: { label: string; value: string; tone: "good" | "watch" | "alert" }[];
  recommendations: string[];
}
