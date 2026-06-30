"use client";

import { cn } from "@/lib/utils";
import type { CareAction } from "@/lib/care";

/**
 * A short-lived animated overlay shown over a plant when a care action fires.
 * Render conditionally with a `key` so the animation restarts each time.
 */
export function CareFeedback({
  effect,
  className,
}: {
  effect: CareAction["effect"];
  className?: string;
}) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 z-20 overflow-hidden", className)} aria-hidden="true">
      {effect === "drip" &&
        [0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="absolute top-2 animate-drip text-base"
            style={{ left: `${18 + i * 16}%`, animationDelay: `${i * 0.12}s` }}
          >
            💧
          </span>
        ))}

      {effect === "glow" && (
        <>
          <span className="absolute inset-0 animate-pop rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(255,221,138,0.55),transparent_60%)]" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 h-[46%] w-0.5 origin-bottom animate-pop rounded-full bg-gradient-to-t from-transparent to-[#ffd98a]"
              style={{ transform: `rotate(${i * 60}deg) translateY(-60%)`, animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </>
      )}

      {effect === "sparkle" &&
        [
          { l: "22%", t: "26%", d: "0s", s: "text-lg" },
          { l: "64%", t: "18%", d: "0.1s", s: "text-sm" },
          { l: "44%", t: "54%", d: "0.2s", s: "text-xl" },
          { l: "74%", t: "60%", d: "0.15s", s: "text-base" },
          { l: "30%", t: "70%", d: "0.25s", s: "text-sm" },
        ].map((p, i) => (
          <span
            key={i}
            className={cn("absolute animate-sparkle", p.s)}
            style={{ left: p.l, top: p.t, animationDelay: p.d }}
          >
            ✨
          </span>
        ))}

      {effect === "mist" &&
        [0, 1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="absolute animate-pop text-xs opacity-70"
            style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 18}%`, animationDelay: `${i * 0.08}s` }}
          >
            💨
          </span>
        ))}
    </div>
  );
}
