import type { CanvasItem, Project } from "@/lib/types";

export const PROJECTS: Project[] = [
  {
    id: "pr-courtyard",
    name: "Tuscan Courtyard Retreat",
    spaceType: "Courtyard",
    spaceId: "sp-courtyard",
    style: "Romantic Mediterranean",
    itemCount: 9,
    plantCount: 5,
    estCost: 1180,
    updatedAt: "2 days ago",
    status: "In progress",
  },
  {
    id: "pr-balcony",
    name: "Parisian Balcony Garden",
    spaceType: "Balcony",
    spaceId: "sp-balcony",
    style: "Soft Cottagecore",
    itemCount: 6,
    plantCount: 4,
    estCost: 640,
    updatedAt: "5 days ago",
    status: "Ready",
  },
  {
    id: "pr-living",
    name: "Blush Living Room Refresh",
    spaceType: "Living room",
    spaceId: "sp-living",
    style: "Modern Luxe",
    itemCount: 8,
    plantCount: 3,
    estCost: 1620,
    updatedAt: "1 week ago",
    status: "Draft",
  },
  {
    id: "pr-backyard",
    name: "Backyard Bloom Sanctuary",
    spaceType: "Backyard",
    spaceId: "sp-backyard",
    style: "Wild English Garden",
    itemCount: 12,
    plantCount: 8,
    estCost: 2240,
    updatedAt: "2 weeks ago",
    status: "In progress",
  },
];

/**
 * Pre-arranged demo design that opens in the editor (/design/demo/editor).
 * Coordinates are at 100% zoom on the canvas.
 */
export const DEMO_DESIGN: CanvasItem[] = [
  { instanceId: "d1", defId: "b-bench", x: 250, y: 300, w: 190, h: 130, rotation: 0, z: 1, flipped: false, opacity: 1 },
  { instanceId: "d2", defId: "p-monstera", x: 110, y: 210, w: 150, h: 170, rotation: 0, z: 2, flipped: false, opacity: 1 },
  { instanceId: "d3", defId: "p-fiddle", x: 470, y: 180, w: 150, h: 190, rotation: 0, z: 2, flipped: false, opacity: 1 },
  { instanceId: "d4", defId: "f-peony", x: 200, y: 360, w: 110, h: 130, rotation: 0, z: 3, flipped: false, opacity: 1 },
  { instanceId: "d5", defId: "f-lavender", x: 420, y: 380, w: 120, h: 140, rotation: 0, z: 3, flipped: false, opacity: 1 },
  { instanceId: "d6", defId: "l-string", x: 180, y: 60, w: 320, h: 110, rotation: 0, z: 4, flipped: false, opacity: 1 },
  { instanceId: "d7", defId: "po-ceramic", x: 350, y: 410, w: 110, h: 120, rotation: 0, z: 3, flipped: false, opacity: 1 },
  { instanceId: "d8", defId: "s-pebbles", x: 300, y: 470, w: 150, h: 90, rotation: 0, z: 0, flipped: false, opacity: 1 },
];

export const DEMO_SPACE_ID = "sp-courtyard";
