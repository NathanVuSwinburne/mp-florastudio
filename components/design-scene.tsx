import { FloraArt } from "@/components/flora-art";
import { CANVAS_H, CANVAS_W } from "@/lib/canvas";
import { COMPONENTS_BY_ID } from "@/lib/mock/components";
import { SPACES_BY_ID } from "@/lib/mock/spaces";
import type { CanvasItem } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Renders a non-interactive design (space photo + placed items), scaled to fit
 * its container while preserving the canvas aspect ratio. Used in the hero,
 * dashboard thumbnails, and the preview page.
 */
export function DesignScene({
  spaceId,
  items,
  className,
  rounded = "rounded-[var(--radius-lg)]",
}: {
  spaceId: string;
  items: CanvasItem[];
  className?: string;
  rounded?: string;
}) {
  const space = SPACES_BY_ID[spaceId] ?? Object.values(SPACES_BY_ID)[0];

  return (
    <div
      className={cn("relative w-full overflow-hidden", rounded, className)}
      style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}`, background: space.gradient }}
    >
      {/* soft light + ground shadow band */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{ background: "linear-gradient(180deg, transparent, rgba(80,50,40,0.12))" }}
      />
      {[...items]
        .sort((a, b) => a.z - b.z)
        .map((item) => {
          const def = COMPONENTS_BY_ID[item.defId];
          if (!def) return null;
          return (
            <div
              key={item.instanceId}
              className="absolute"
              style={{
                left: `${(item.x / CANVAS_W) * 100}%`,
                top: `${(item.y / CANVAS_H) * 100}%`,
                width: `${(item.w / CANVAS_W) * 100}%`,
                height: `${(item.h / CANVAS_H) * 100}%`,
                transform: `rotate(${item.rotation}deg) scaleX(${item.flipped ? -1 : 1})`,
                opacity: item.opacity,
              }}
            >
              <FloraArt art={def.art} className="h-full w-full drop-shadow-[0_8px_10px_rgba(80,50,40,0.18)]" />
            </div>
          );
        })}
    </div>
  );
}
