import Link from "next/link";
import { cn } from "@/lib/utils";

export function FlowerMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g transform="translate(24 24)">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse
            key={r}
            cx={0}
            cy={-11}
            rx={5.4}
            ry={9.5}
            transform={`rotate(${r})`}
            fill="url(#petalGrad)"
          />
        ))}
        <circle r={5.2} fill="#f0c674" />
        <circle r={2.2} fill="#e0a93f" />
      </g>
      <defs>
        <linearGradient id="petalGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4c0d2" />
          <stop offset="100%" stopColor="#de7491" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blush-100 to-blush-200 shadow-[var(--shadow-petal)] transition-transform duration-500 group-hover:rotate-[18deg]">
        <FlowerMark className="h-6 w-6" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg tracking-tight text-plum-900">
          MP FloraStudio
        </span>
        <span className="text-[0.62rem] uppercase tracking-[0.22em] text-rose-500">
          Design · Grow · Bloom
        </span>
      </span>
    </Link>
  );
}
