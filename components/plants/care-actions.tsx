"use client";

import { Droplets, Sun, Sprout, CloudDrizzle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CareActionId } from "@/lib/care";

const ICONS: Record<CareActionId, React.ElementType> = {
  water: Droplets,
  sunlight: Sun,
  fertilise: Sprout,
  mist: CloudDrizzle,
};

const STYLES: Record<CareActionId, string> = {
  water: "hover:border-[#9ed0f0] hover:bg-[#eaf5fd] hover:text-[#3d87c4]",
  sunlight: "hover:border-[#f5cd72] hover:bg-[#fdf6e6] hover:text-[#c79a3e]",
  fertilise: "hover:border-[#bcd9a8] hover:bg-[#eef6e7] hover:text-[#5f8f48]",
  mist: "hover:border-blush-300 hover:bg-blush-50 hover:text-rose-600",
};

const ACTIONS: { id: CareActionId; label: string }[] = [
  { id: "water", label: "Water" },
  { id: "sunlight", label: "Sunlight" },
  { id: "fertilise", label: "Fertilise" },
  { id: "mist", label: "Mist" },
];

export function CareActions({
  onAction,
  variant = "compact",
}: {
  onAction: (id: CareActionId) => void;
  variant?: "compact" | "full";
}) {
  return (
    <div className={cn("grid grid-cols-4 gap-2", variant === "full" && "sm:grid-cols-4")}>
      {ACTIONS.map((a) => {
        const Icon = ICONS[a.id];
        return (
          <button
            key={a.id}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAction(a.id);
            }}
            className={cn(
              "group/care flex flex-col items-center gap-1 rounded-xl border border-blush-200 bg-paper py-2 text-plum-500 transition-all active:scale-95",
              STYLES[a.id]
            )}
          >
            <Icon className="h-4 w-4 transition-transform group-hover/care:scale-110" />
            <span className="text-[0.65rem] font-medium">{a.label}</span>
          </button>
        );
      })}
    </div>
  );
}
