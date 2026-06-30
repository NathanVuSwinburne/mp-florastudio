import { cn } from "@/lib/utils";

const TONES = {
  hydration: { from: "#9ed0f0", to: "#5fa8e0", icon: "💧" },
  sunlight: { from: "#ffd98a", to: "#f5b73d", icon: "☀️" },
  fertiliser: { from: "#c7e0a3", to: "#8fc05c", icon: "🌱" },
  growth: { from: "#bfe6c4", to: "#74c08a", icon: "📈" },
  leafColour: { from: "#a7d8a0", to: "#6aa863", icon: "🍃" },
  stress: { from: "#f3b6c4", to: "#e07090", icon: "🌡️" },
  rose: { from: "#f4c0d2", to: "#de7491", icon: "" },
} as const;

export type StatTone = keyof typeof TONES;

export function StatBar({
  label,
  value,
  tone,
  className,
  showValue = true,
}: {
  label: string;
  value: number;
  tone: StatTone;
  className?: string;
  showValue?: boolean;
}) {
  const t = TONES[tone];
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 font-medium text-plum-600">
          {t.icon && <span aria-hidden="true">{t.icon}</span>}
          {label}
        </span>
        {showValue && <span className="tabular-nums text-plum-400">{Math.round(value)}%</span>}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-blush-100">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${Math.min(100, Math.max(0, value))}%`,
            background: `linear-gradient(90deg, ${t.from}, ${t.to})`,
          }}
        />
      </div>
    </div>
  );
}
