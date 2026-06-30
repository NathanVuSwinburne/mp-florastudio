import { cn } from "@/lib/utils";

/** A thin floral rule with a centered bloom + subtle thorns. */
export function FloralDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center justify-center gap-3 text-rose-300", className)}
      aria-hidden="true"
    >
      <span className="h-px w-full max-w-[180px] bg-gradient-to-r from-transparent via-rose-300/60 to-rose-300/60" />
      <svg viewBox="0 0 60 16" className="h-4 w-16 shrink-0">
        <path d="M2 8 h14" stroke="currentColor" strokeWidth="1" />
        <path d="M9 8 l-3 -3 M9 8 l-3 3" stroke="currentColor" strokeWidth="0.8" />
        <g transform="translate(30 8)">
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx={0} cy={-4} rx={2} ry={3.6} transform={`rotate(${r})`} fill="#e890a8" />
          ))}
          <circle r={2} fill="#f0c674" />
        </g>
        <path d="M58 8 h-14" stroke="currentColor" strokeWidth="1" />
        <path d="M51 8 l3 -3 M51 8 l3 3" stroke="currentColor" strokeWidth="0.8" />
      </svg>
      <span className="h-px w-full max-w-[180px] bg-gradient-to-l from-transparent via-rose-300/60 to-rose-300/60" />
    </div>
  );
}

/** Decorative vine that curls from a corner. Position with utility classes. */
export function VineCorner({
  className,
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={cn("pointer-events-none select-none", className)}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <path
        d="M4 4 C 50 20 30 70 70 90 C 110 110 90 140 150 150"
        fill="none"
        stroke="#cbe0b6"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {[
        [20, 16],
        [44, 42],
        [60, 78],
        [96, 104],
        [128, 138],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${i * 40})`}>
          <path d="M0 0 c -8 -5 -12 5 0 10 c 12 -5 8 -15 0 -10" fill={i % 2 ? "#a7c590" : "#cbe0b6"} />
        </g>
      ))}
      {[[34, 28], [80, 96]].map(([x, y], i) => (
        <g key={`b-${i}`} transform={`translate(${x} ${y})`}>
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx={0} cy={-3} rx={1.8} ry={3} transform={`rotate(${r})`} fill="#f4c0d2" />
          ))}
          <circle r={1.6} fill="#f0c674" />
        </g>
      ))}
    </svg>
  );
}

/** Soft floating petals for hero backgrounds. */
export function PetalField({ className }: { className?: string }) {
  const petals = [
    { left: "8%", top: "18%", delay: "0s", size: 18, c: "#f4c0d2" },
    { left: "22%", top: "62%", delay: "1.4s", size: 12, c: "#efb6c9" },
    { left: "44%", top: "12%", delay: "2.2s", size: 14, c: "#f6d4e0" },
    { left: "67%", top: "70%", delay: "0.8s", size: 16, c: "#f4c0d2" },
    { left: "82%", top: "26%", delay: "1.8s", size: 11, c: "#e890a8" },
    { left: "91%", top: "58%", delay: "2.8s", size: 14, c: "#f6d4e0" },
  ];
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {petals.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="absolute animate-float"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDelay: p.delay }}
        >
          <path d="M10 1 C 15 6 15 14 10 19 C 5 14 5 6 10 1 Z" fill={p.c} opacity={0.7} />
        </svg>
      ))}
    </div>
  );
}
