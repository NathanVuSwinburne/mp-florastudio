import type { AiScanResult } from "@/lib/types";

/**
 * Scripted "Demo AI scan" results. These are 100% mock — no model is called.
 * The photo-check UI picks one at random to feel alive.
 */
export const MOCK_SCANS: AiScanResult[] = [
  {
    verdict: "Healthy & thriving",
    confidence: 94,
    status: "thriving",
    highlights: [
      { label: "Leaf colour", value: "Vibrant green", tone: "good" },
      { label: "Hydration", value: "Well watered", tone: "good" },
      { label: "Pests", value: "None detected", tone: "good" },
      { label: "New growth", value: "2 buds forming", tone: "good" },
    ],
    recommendations: [
      "Keep your current watering rhythm — it's working beautifully.",
      "Rotate the pot a quarter turn weekly for even growth.",
      "Consider a light feed in 2 weeks to support new buds.",
    ],
  },
  {
    verdict: "Slightly thirsty",
    confidence: 88,
    status: "okay",
    highlights: [
      { label: "Leaf colour", value: "Mostly green", tone: "good" },
      { label: "Hydration", value: "A little low", tone: "watch" },
      { label: "Soil", value: "Drying near surface", tone: "watch" },
      { label: "Pests", value: "None detected", tone: "good" },
    ],
    recommendations: [
      "Give a deep drink today and check soil moisture in 3 days.",
      "Mist the leaves to lift humidity around the plant.",
      "Move slightly away from the direct afternoon sun.",
    ],
  },
  {
    verdict: "Needs a little love",
    confidence: 91,
    status: "needs",
    highlights: [
      { label: "Leaf colour", value: "Some yellowing", tone: "alert" },
      { label: "Hydration", value: "Underwatered", tone: "alert" },
      { label: "Light", value: "Too low", tone: "watch" },
      { label: "Pests", value: "None detected", tone: "good" },
    ],
    recommendations: [
      "Water thoroughly and let excess drain fully.",
      "Relocate to a brighter spot with indirect light.",
      "Trim 1–2 yellowed leaves to redirect energy.",
      "Re-scan in 5 days to track recovery.",
    ],
  },
];

export function randomScan(): AiScanResult {
  return MOCK_SCANS[Math.floor(Math.random() * MOCK_SCANS.length)];
}
