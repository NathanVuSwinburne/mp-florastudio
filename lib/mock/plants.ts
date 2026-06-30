import type { Plant, PlantStatus } from "@/lib/types";

export function statusFromHealth(health: number): PlantStatus {
  if (health >= 78) return "thriving";
  if (health >= 55) return "okay";
  return "needs";
}

export const STATUS_LABEL: Record<PlantStatus, string> = {
  thriving: "Thriving",
  okay: "Doing okay",
  needs: "Needs care",
};

export const PLANTS: Plant[] = [
  {
    id: "monstera",
    name: "Monty",
    species: "Monstera Deliciosa",
    art: "monstera",
    room: "Living Room",
    level: 7,
    xp: 64,
    health: 88,
    value: 145,
    stats: { hydration: 82, sunlight: 74, fertiliser: 68, growth: 79, leafColour: 90, stress: 14 },
    acquired: "Mar 2024",
    timeline: [
      { id: "t1", label: "Watered", icon: "💧", when: "Today, 8:10am" },
      { id: "t2", label: "Health check passed", icon: "📸", when: "Yesterday" },
      { id: "t3", label: "Fertilised", icon: "🌱", when: "4 days ago" },
      { id: "t4", label: "New leaf unfurled", icon: "🌿", when: "1 week ago" },
    ],
  },
  {
    id: "peony",
    name: "Rosie",
    species: "Garden Peony",
    art: "peony",
    room: "Courtyard",
    level: 5,
    xp: 40,
    health: 72,
    value: 60,
    stats: { hydration: 58, sunlight: 86, fertiliser: 55, growth: 64, leafColour: 70, stress: 32 },
    acquired: "Sep 2024",
    timeline: [
      { id: "t1", label: "Misted leaves", icon: "🌫️", when: "Today, 9:30am" },
      { id: "t2", label: "Moved to brighter spot", icon: "☀️", when: "3 days ago" },
      { id: "t3", label: "Watered", icon: "💧", when: "5 days ago" },
    ],
  },
  {
    id: "fiddle",
    name: "Iggy",
    species: "Fiddle-Leaf Fig",
    art: "fiddle-leaf",
    room: "Reading Corner",
    level: 4,
    xp: 22,
    health: 48,
    value: 110,
    stats: { hydration: 34, sunlight: 40, fertiliser: 38, growth: 45, leafColour: 52, stress: 64 },
    acquired: "Jan 2025",
    timeline: [
      { id: "t1", label: "Leaf drop noticed", icon: "🍂", when: "Yesterday" },
      { id: "t2", label: "Watered", icon: "💧", when: "6 days ago" },
      { id: "t3", label: "Repotted", icon: "🪴", when: "3 weeks ago" },
    ],
  },
  {
    id: "lavender",
    name: "Lulu",
    species: "French Lavender",
    art: "lavender",
    room: "Balcony",
    level: 6,
    xp: 55,
    health: 81,
    value: 35,
    stats: { hydration: 70, sunlight: 92, fertiliser: 60, growth: 72, leafColour: 78, stress: 20 },
    acquired: "Nov 2024",
    timeline: [
      { id: "t1", label: "Given sunlight", icon: "☀️", when: "Today, 7:45am" },
      { id: "t2", label: "Pruned", icon: "✂️", when: "1 week ago" },
      { id: "t3", label: "Fertilised", icon: "🌱", when: "2 weeks ago" },
    ],
  },
  {
    id: "succulent",
    name: "Pebble",
    species: "Echeveria",
    art: "succulent",
    room: "Kitchen Sill",
    level: 3,
    xp: 80,
    health: 90,
    value: 22,
    stats: { hydration: 64, sunlight: 80, fertiliser: 50, growth: 60, leafColour: 88, stress: 10 },
    acquired: "Feb 2025",
    timeline: [
      { id: "t1", label: "Health check passed", icon: "📸", when: "2 days ago" },
      { id: "t2", label: "Watered (light)", icon: "💧", when: "1 week ago" },
    ],
  },
  {
    id: "fern",
    name: "Fronda",
    species: "Boston Fern",
    art: "fern",
    room: "Bathroom",
    level: 4,
    xp: 33,
    health: 60,
    value: 40,
    stats: { hydration: 48, sunlight: 55, fertiliser: 45, growth: 58, leafColour: 64, stress: 44 },
    acquired: "Dec 2024",
    timeline: [
      { id: "t1", label: "Misted leaves", icon: "🌫️", when: "Yesterday" },
      { id: "t2", label: "Watered", icon: "💧", when: "4 days ago" },
    ],
  },
];

export const PLANTS_BY_ID = Object.fromEntries(
  PLANTS.map((p) => [p.id, p])
) as Record<string, Plant>;

export const DEMO_PLANT_ID = "monstera";
