import type { ComponentCategory, ComponentDef } from "@/lib/types";

export const CATEGORIES: ComponentCategory[] = [
  "Flowers",
  "Plants",
  "Pots",
  "Vines",
  "Stones",
  "Statues",
  "Lighting",
  "Benches",
  "Outdoor furniture",
  "Indoor furniture",
  "Wall decor",
  "Living room decor",
];

export const COMPONENTS: ComponentDef[] = [
  // Flowers
  { id: "f-rose", name: "Garden Rose", category: "Flowers", art: "rose", price: 28, w: 120, h: 150, note: "Classic blush rose with thornful stem.", tags: ["pink", "romantic"] },
  { id: "f-tulip", name: "Tulip Cluster", category: "Flowers", art: "tulip", price: 22, w: 110, h: 150, note: "Spring tulips in soft rose.", tags: ["spring"] },
  { id: "f-peony", name: "Peony Bloom", category: "Flowers", art: "peony", price: 34, w: 130, h: 150, note: "Lush layered peony.", tags: ["luxury", "pink"] },
  { id: "f-lavender", name: "Lavender Pot", category: "Flowers", art: "lavender", price: 26, w: 130, h: 160, note: "Fragrant, pollinator-friendly.", tags: ["purple", "scented"] },
  { id: "f-hydrangea", name: "Hydrangea", category: "Flowers", art: "hydrangea", price: 38, w: 140, h: 160, note: "Cloud-like blooms.", tags: ["blue", "pink"] },

  // Plants
  { id: "p-monstera", name: "Monstera Deliciosa", category: "Plants", art: "monstera", price: 65, w: 150, h: 170, note: "Statement split-leaf foliage.", tags: ["indoor", "tropical"] },
  { id: "p-fiddle", name: "Fiddle-Leaf Fig", category: "Plants", art: "fiddle-leaf", price: 89, w: 150, h: 190, note: "Elegant sculptural tree.", tags: ["indoor", "tall"] },
  { id: "p-snake", name: "Snake Plant", category: "Plants", art: "snake-plant", price: 42, w: 120, h: 180, note: "Near-unkillable architectural lines.", tags: ["low-light", "easy"] },
  { id: "p-pothos", name: "Golden Pothos", category: "Plants", art: "pothos", price: 32, w: 160, h: 150, note: "Trailing heart-shaped leaves.", tags: ["trailing", "easy"] },
  { id: "p-fern", name: "Boston Fern", category: "Plants", art: "fern", price: 36, w: 150, h: 160, note: "Soft, feathery and lush.", tags: ["humidity"] },
  { id: "p-succulent", name: "Echeveria", category: "Plants", art: "succulent", price: 18, w: 100, h: 110, note: "Rosette succulent, sun-loving.", tags: ["drought", "easy"] },
  { id: "p-palm", name: "Areca Palm", category: "Plants", art: "palm", price: 74, w: 150, h: 190, note: "Resort-style fronds.", tags: ["tropical", "tall"] },

  // Pots
  { id: "po-terra", name: "Terracotta Pot", category: "Pots", art: "pot-terracotta", price: 24, w: 120, h: 130, note: "Warm classic clay.", tags: ["neutral"] },
  { id: "po-ceramic", name: "Blush Ceramic Pot", category: "Pots", art: "pot-ceramic", price: 44, w: 120, h: 130, note: "Glazed rose ceramic.", tags: ["pink", "luxury"] },
  { id: "po-tall", name: "Tall Planter", category: "Pots", art: "pot-tall", price: 58, w: 110, h: 150, note: "Floor-standing column planter.", tags: ["modern"] },

  // Vines
  { id: "v-vine", name: "Climbing Vine", category: "Vines", art: "vine", price: 30, w: 150, h: 170, note: "Drapes beautifully over walls.", tags: ["trailing"] },
  { id: "v-ivy", name: "English Ivy", category: "Vines", art: "ivy", price: 27, w: 130, h: 180, note: "Delicate trailing ivy.", tags: ["trailing"] },

  // Stones
  { id: "s-stone", name: "Feature Stone", category: "Stones", art: "stone", price: 40, w: 140, h: 100, note: "Sculptural garden boulder.", tags: ["zen"] },
  { id: "s-pebbles", name: "Pebble Set", category: "Stones", art: "pebbles", price: 16, w: 150, h: 90, note: "Decorative ground pebbles.", tags: ["zen", "path"] },

  // Statues
  { id: "st-statue", name: "Garden Statue", category: "Statues", art: "statue", price: 120, w: 110, h: 170, note: "Timeless stone figure.", tags: ["classic"] },
  { id: "st-fountain", name: "Tiered Fountain", category: "Statues", art: "fountain", price: 240, w: 150, h: 160, note: "Gentle water feature.", tags: ["water", "luxury"] },

  // Lighting
  { id: "l-lantern", name: "Hanging Lantern", category: "Lighting", art: "lantern", price: 34, w: 100, h: 150, note: "Warm ambient glow.", tags: ["warm"] },
  { id: "l-string", name: "Festoon Lights", category: "Lighting", art: "string-lights", price: 48, w: 180, h: 110, note: "Cafe-style string lights.", tags: ["ambient"] },
  { id: "l-floor", name: "Arc Floor Lamp", category: "Lighting", art: "floor-lamp", price: 96, w: 120, h: 180, note: "Statement indoor lighting.", tags: ["indoor"] },

  // Benches
  { id: "b-bench", name: "Wooden Bench", category: "Benches", art: "bench", price: 130, w: 190, h: 130, note: "Seat for two in the garden.", tags: ["seating"] },

  // Outdoor furniture
  { id: "of-chair", name: "Outdoor Chair", category: "Outdoor furniture", art: "outdoor-chair", price: 78, w: 140, h: 150, note: "Weatherproof lounge chair.", tags: ["seating"] },

  // Indoor furniture
  { id: "if-sofa", name: "Linen Sofa", category: "Indoor furniture", art: "sofa", price: 420, w: 200, h: 120, note: "Blush three-seater.", tags: ["seating", "pink"] },
  { id: "if-armchair", name: "Accent Armchair", category: "Indoor furniture", art: "armchair", price: 260, w: 150, h: 130, note: "Cozy reading chair.", tags: ["seating"] },
  { id: "if-coffee", name: "Coffee Table", category: "Indoor furniture", art: "coffee-table", price: 180, w: 170, h: 120, note: "Round oak top.", tags: ["surface"] },

  // Wall decor
  { id: "wd-frame", name: "Botanical Print", category: "Wall decor", art: "wall-frame", price: 55, w: 110, h: 150, note: "Framed pressed flower.", tags: ["art"] },
  { id: "wd-mirror", name: "Arch Mirror", category: "Wall decor", art: "mirror", price: 140, w: 120, h: 160, note: "Gold-framed arch mirror.", tags: ["gold", "luxury"] },
  { id: "wd-shelf", name: "Plant Shelf", category: "Wall decor", art: "shelf", price: 70, w: 150, h: 130, note: "Floating display ledge.", tags: ["storage"] },

  // Living room decor
  { id: "lr-cushion", name: "Velvet Cushion", category: "Living room decor", art: "cushion", price: 38, w: 110, h: 110, note: "Soft rose accent pillow.", tags: ["pink", "soft"] },
  { id: "lr-vase", name: "Fresh Bouquet Vase", category: "Living room decor", art: "vase", price: 52, w: 110, h: 140, note: "Hand-tied seasonal stems.", tags: ["flowers"] },
  { id: "lr-rug", name: "Blush Area Rug", category: "Living room decor", art: "rug", price: 210, w: 200, h: 130, note: "Soft underfoot anchor.", tags: ["pink", "soft"] },
];

export const COMPONENTS_BY_ID = Object.fromEntries(
  COMPONENTS.map((c) => [c.id, c])
) as Record<string, ComponentDef>;

export function searchComponents(query: string, category: ComponentCategory | "All") {
  const q = query.trim().toLowerCase();
  return COMPONENTS.filter((c) => {
    const inCat = category === "All" || c.category === category;
    if (!inCat) return false;
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.tags ?? []).some((t) => t.includes(q))
    );
  });
}
