import type { ArtKey } from "@/lib/types";

/**
 * FloraArt — self-contained inline SVG illustrations for every component and
 * plant. No external images, so the build is fully offline / Vercel-clean.
 * All pieces share a 100x100 viewBox and the studio's blush palette.
 */

const C = {
  leaf: "#7ea36b",
  leafDark: "#5f8451",
  leafLight: "#a7c590",
  stem: "#6f8a5b",
  terracotta: "#cd7e5b",
  terracottaDark: "#b3654400",
  clay: "#c9785a",
  ceramic: "#f3d9e2",
  ceramicDark: "#e3b6c6",
  rose: "#e36f93",
  roseDark: "#c75b77",
  blush: "#f4c0d2",
  petalGold: "#f0c674",
  lav: "#b79ad6",
  lavDark: "#9b78c4",
  stone: "#cdc6c0",
  stoneDark: "#a9a09a",
  gold: "#c6a667",
  wood: "#c69a6b",
  woodDark: "#a87c4f",
  fabric: "#edc7d3",
  fabricDark: "#d99fb2",
  dark: "#5b4750",
  white: "#fffaf7",
  glow: "#ffe9a8",
};

function Pot({ kind = "terracotta" }: { kind?: "terracotta" | "ceramic" | "tall" }) {
  if (kind === "ceramic")
    return (
      <>
        <path d="M30 60 h40 l-5 30 a6 6 0 0 1-6 5 H41 a6 6 0 0 1-6-5 Z" fill={C.ceramic} />
        <path d="M30 60 h40 l-1.5 9 H31.5 Z" fill={C.ceramicDark} />
        <ellipse cx="50" cy="60" rx="20" ry="4" fill="#fbe9f0" />
      </>
    );
  if (kind === "tall")
    return (
      <>
        <path d="M37 50 h26 l-3 40 a5 5 0 0 1-5 4 H45 a5 5 0 0 1-5-4 Z" fill={C.clay} />
        <path d="M35 48 h30 v7 H35 Z" rx="2" fill={C.terracotta} />
        <ellipse cx="50" cy="50" rx="15" ry="3" fill="#d98a68" />
      </>
    );
  return (
    <>
      <path d="M32 58 h36 l-4 30 a6 6 0 0 1-6 5 H42 a6 6 0 0 1-6-5 Z" fill={C.terracotta} />
      <path d="M30 56 h40 v8 H30 Z" rx="2" fill={C.clay} />
      <ellipse cx="50" cy="57" rx="20" ry="3.5" fill="#d98a68" />
    </>
  );
}

function Leaf(props: { cx: number; cy: number; r: number; rot: number; fill: string }) {
  const { cx, cy, r, rot, fill } = props;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
      <path
        d={`M0 0 C ${r * 0.7} ${-r * 0.5}, ${r * 0.7} ${-r * 1.5}, 0 ${-r * 2} C ${-r * 0.7} ${-r * 1.5}, ${-r * 0.7} ${-r * 0.5}, 0 0 Z`}
        fill={fill}
      />
      <path d={`M0 0 L0 ${-r * 1.8}`} stroke="rgba(0,0,0,0.08)" strokeWidth="1.2" />
    </g>
  );
}

function Bloom({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  const petals = Array.from({ length: 6 });
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {petals.map((_, i) => (
        <ellipse
          key={i}
          cx={0}
          cy={-r * 0.8}
          rx={r * 0.5}
          ry={r * 0.9}
          fill={color}
          transform={`rotate(${i * 60})`}
          opacity={0.95}
        />
      ))}
      <circle r={r * 0.55} fill={C.petalGold} />
    </g>
  );
}

const art: Record<ArtKey, React.ReactNode> = {
  monstera: (
    <>
      <Pot kind="terracotta" />
      <Leaf cx={50} cy={58} r={13} rot={0} fill={C.leaf} />
      <Leaf cx={50} cy={58} r={12} rot={-38} fill={C.leafDark} />
      <Leaf cx={50} cy={58} r={12} rot={38} fill={C.leafLight} />
      <Leaf cx={50} cy={58} r={10} rot={-70} fill={C.leaf} />
      <Leaf cx={50} cy={58} r={10} rot={70} fill={C.leafDark} />
    </>
  ),
  "fiddle-leaf": (
    <>
      <Pot kind="ceramic" />
      <path d="M50 60 C46 40 46 24 50 12 C54 24 54 40 50 60" fill={C.stem} />
      <Leaf cx={50} cy={30} r={11} rot={-30} fill={C.leaf} />
      <Leaf cx={50} cy={24} r={11} rot={28} fill={C.leafLight} />
      <Leaf cx={50} cy={16} r={10} rot={-10} fill={C.leafDark} />
      <Leaf cx={50} cy={42} r={10} rot={42} fill={C.leaf} />
    </>
  ),
  "snake-plant": (
    <>
      <Pot kind="tall" />
      {[-16, -8, 0, 8, 16].map((dx, i) => (
        <path
          key={i}
          d={`M${50 + dx} 50 C ${50 + dx * 1.3} 30, ${50 + dx * 1.3} 18, ${50 + dx * 0.8} 8`}
          stroke={i % 2 ? C.leafDark : C.leaf}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      ))}
    </>
  ),
  pothos: (
    <>
      <Pot kind="ceramic" />
      <path d="M50 60 C30 50 24 66 16 80" stroke={C.stem} strokeWidth="2.5" fill="none" />
      <path d="M50 60 C70 50 76 66 84 82" stroke={C.stem} strokeWidth="2.5" fill="none" />
      {[[18, 80], [30, 70], [82, 82], [70, 70], [50, 52]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} c -5 -6 5 -10 0 -12 c -5 2 5 6 0 12`} fill={i % 2 ? C.leaf : C.leafLight} />
      ))}
    </>
  ),
  fern: (
    <>
      <Pot kind="terracotta" />
      {[-40, -20, 0, 20, 40].map((rot, i) => (
        <g key={i} transform={`translate(50 56) rotate(${rot})`}>
          <path d="M0 0 C 3 -20 -3 -34 0 -44" stroke={C.leaf} strokeWidth="2" fill="none" />
          {[10, 18, 26, 34].map((d, j) => (
            <g key={j}>
              <path d={`M0 ${-d} l -6 -3`} stroke={C.leafLight} strokeWidth="1.6" />
              <path d={`M0 ${-d} l 6 -3`} stroke={C.leafLight} strokeWidth="1.6" />
            </g>
          ))}
        </g>
      ))}
    </>
  ),
  succulent: (
    <>
      <Pot kind="ceramic" />
      {[0, 60, 120, 180, 240, 300].map((rot, i) => (
        <ellipse key={i} cx={50} cy={48} rx={4} ry={11} fill={i % 2 ? C.leaf : C.leafLight} transform={`rotate(${rot} 50 54)`} />
      ))}
      <circle cx={50} cy={54} r={5} fill={C.leafDark} />
    </>
  ),
  palm: (
    <>
      <Pot kind="tall" />
      <path d="M50 50 C48 36 49 24 50 14" stroke={C.woodDark} strokeWidth="3" fill="none" />
      {[-65, -35, 0, 35, 65].map((rot, i) => (
        <path key={i} d="M50 16 C 60 8 72 8 82 14" stroke={i % 2 ? C.leaf : C.leafDark} strokeWidth="4" strokeLinecap="round" fill="none" transform={`rotate(${rot} 50 16)`} />
      ))}
    </>
  ),
  rose: (
    <>
      <path d="M50 92 C 49 70 49 55 50 42" stroke={C.stem} strokeWidth="2.5" />
      <path d="M50 64 c -10 -2 -14 4 -16 10 c 10 1 15 -3 16 -10" fill={C.leaf} />
      <path d="M50 56 c 10 -2 14 4 16 10 c -10 1 -15 -3 -16 -10" fill={C.leafDark} />
      <Bloom cx={50} cy={32} r={15} color={C.rose} />
      <circle cx={50} cy={32} r={6} fill={C.roseDark} />
    </>
  ),
  tulip: (
    <>
      <path d="M50 90 C 50 70 50 56 50 46" stroke={C.stem} strokeWidth="2.5" />
      <path d="M40 60 c -8 -10 -6 -22 0 -28 c 4 8 4 18 0 28" fill={C.leafLight} />
      <path d="M50 46 c -10 0 -12 -16 -2 -24 c 2 4 4 4 4 0 c 10 8 8 24 -2 24 Z" fill={C.rose} />
      <path d="M50 22 c 2 4 2 18 0 24" stroke={C.roseDark} strokeWidth="1.5" />
    </>
  ),
  peony: (
    <>
      <path d="M50 90 C 50 70 50 56 50 44" stroke={C.stem} strokeWidth="2.5" />
      <path d="M50 60 c -12 -2 -16 6 -16 12 c 12 0 16 -4 16 -12" fill={C.leaf} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((r, i) => (
        <ellipse key={i} cx={50} cy={28} rx={6} ry={11} fill={i % 2 ? C.blush : C.rose} transform={`rotate(${r} 50 34)`} opacity={0.92} />
      ))}
      <circle cx={50} cy={34} r={6} fill={C.white} />
    </>
  ),
  lavender: (
    <>
      <Pot kind="terracotta" />
      {[-14, -7, 0, 7, 14].map((dx, i) => (
        <g key={i}>
          <path d={`M${50 + dx} 56 C ${50 + dx} 38 ${50 + dx} 28 ${50 + dx * 0.7} 16`} stroke={C.stem} strokeWidth="1.6" fill="none" />
          {[16, 22, 28, 34].map((d, j) => (
            <circle key={j} cx={50 + dx * (1 - d / 90)} cy={d} r={2.6} fill={j % 2 ? C.lav : C.lavDark} />
          ))}
        </g>
      ))}
    </>
  ),
  hydrangea: (
    <>
      <Pot kind="ceramic" />
      <path d="M50 60 C46 48 46 42 50 36" stroke={C.stem} strokeWidth="2.5" />
      {[[42, 32], [58, 32], [50, 24], [44, 22], [56, 22], [50, 36]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {[0, 90, 180, 270].map((r) => (
            <ellipse key={r} cx={0} cy={-3} rx={2.6} ry={3.4} fill={i % 2 ? C.blush : "#c9d3ee"} transform={`rotate(${r})`} />
          ))}
          <circle r={1.5} fill={C.petalGold} />
        </g>
      ))}
    </>
  ),
  "pot-terracotta": (
    <g transform="translate(0 8)">
      <Pot kind="terracotta" />
    </g>
  ),
  "pot-ceramic": (
    <g transform="translate(0 8)">
      <Pot kind="ceramic" />
    </g>
  ),
  "pot-tall": (
    <g transform="translate(0 4)">
      <Pot kind="tall" />
    </g>
  ),
  vine: (
    <>
      <path d="M20 10 C 40 30 30 50 50 70 C 70 88 60 92 80 96" stroke={C.stem} strokeWidth="3" fill="none" />
      {[[24, 16], [34, 34], [48, 56], [60, 76], [76, 92]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} c -7 -4 -10 4 0 8 c 10 -4 7 -12 0 -8`} fill={i % 2 ? C.leaf : C.leafDark} />
      ))}
    </>
  ),
  ivy: (
    <>
      <path d="M50 8 C 40 30 60 50 50 72 C 44 84 52 90 50 96" stroke={C.stem} strokeWidth="2.5" fill="none" />
      {[[46, 18], [56, 36], [44, 54], [56, 72], [48, 88]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} l -6 -3 l 0 6 l 6 3 l 6 -3 l 0 -6 Z`} fill={i % 2 ? C.leafLight : C.leaf} />
      ))}
    </>
  ),
  stone: (
    <>
      <ellipse cx={38} cy={72} rx={22} ry={14} fill={C.stone} />
      <ellipse cx={38} cy={68} rx={22} ry={12} fill="#ddd7d1" />
      <ellipse cx={64} cy={76} rx={16} ry={10} fill={C.stoneDark} />
    </>
  ),
  pebbles: (
    <>
      {[[30, 70, 12, 8], [52, 74, 14, 9], [70, 68, 10, 7], [42, 60, 9, 6], [62, 60, 8, 6]].map(([x, y, rx, ry], i) => (
        <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill={i % 2 ? C.stone : "#ded8d2"} />
      ))}
    </>
  ),
  statue: (
    <>
      <rect x={38} y={82} width={24} height={8} rx={2} fill={C.stoneDark} />
      <path d="M44 82 L44 50 a6 6 0 0 1 12 0 L56 82 Z" fill={C.stone} />
      <circle cx={50} cy={42} r={9} fill="#e7e1db" />
      <path d="M42 50 q8 -8 16 0" fill="#ded8d2" />
    </>
  ),
  fountain: (
    <>
      <ellipse cx={50} cy={84} rx={28} ry={8} fill={C.stoneDark} />
      <path d="M30 84 q20 8 40 0 l-3 -10 H33 Z" fill={C.stone} />
      <rect x={46} y={54} width={8} height={22} fill="#ded8d2" />
      <ellipse cx={50} cy={54} rx={14} ry={4} fill={C.stone} />
      <path d="M50 54 c -6 -6 6 -10 0 -18 c -6 8 6 12 0 18" fill="#bcd6e6" opacity={0.8} />
    </>
  ),
  lantern: (
    <>
      <path d="M50 14 v8" stroke={C.dark} strokeWidth="2" />
      <rect x={40} y={22} width={20} height={26} rx={4} fill={C.dark} />
      <rect x={43} y={26} width={14} height={18} rx={2} fill={C.glow} />
      <circle cx={50} cy={35} r={4} fill="#fff6d6" />
      <rect x={42} y={48} width={16} height={4} rx={1} fill={C.dark} />
    </>
  ),
  "string-lights": (
    <>
      <path d="M8 24 Q 30 46 50 30 T 92 32" stroke={C.dark} strokeWidth="1.6" fill="none" />
      {[14, 30, 46, 62, 78, 90].map((x, i) => {
        const y = 30 + Math.sin(i) * 8 + 6;
        return <circle key={i} cx={x} cy={y} r={3.4} fill={C.glow} stroke="#e7c96a" strokeWidth="0.8" />;
      })}
    </>
  ),
  "floor-lamp": (
    <>
      <ellipse cx={50} cy={90} rx={12} ry={3} fill={C.stoneDark} />
      <rect x={48.5} y={42} width={3} height={46} fill={C.dark} />
      <path d="M36 42 L64 42 L58 24 L42 24 Z" fill={C.fabric} />
      <path d="M42 24 L58 24" stroke={C.fabricDark} strokeWidth="2" />
    </>
  ),
  bench: (
    <>
      <rect x={20} y={52} width={60} height={8} rx={3} fill={C.wood} />
      <rect x={20} y={40} width={60} height={6} rx={3} fill={C.woodDark} />
      <rect x={24} y={60} width={6} height={24} fill={C.woodDark} />
      <rect x={70} y={60} width={6} height={24} fill={C.woodDark} />
      <rect x={24} y={36} width={5} height={24} fill={C.wood} />
      <rect x={71} y={36} width={5} height={24} fill={C.wood} />
    </>
  ),
  "outdoor-chair": (
    <>
      <rect x={34} y={56} width={32} height={7} rx={3} fill={C.wood} />
      <rect x={34} y={36} width={6} height={26} rx={2} fill={C.woodDark} />
      <rect x={36} y={38} width={26} height={5} rx={2} fill={C.woodDark} />
      <rect x={36} y={46} width={26} height={5} rx={2} fill={C.wood} />
      <rect x={36} y={63} width={5} height={20} fill={C.woodDark} />
      <rect x={59} y={63} width={5} height={20} fill={C.woodDark} />
    </>
  ),
  sofa: (
    <>
      <rect x={18} y={50} width={64} height={22} rx={8} fill={C.fabric} />
      <rect x={14} y={44} width={14} height={28} rx={7} fill={C.fabricDark} />
      <rect x={72} y={44} width={14} height={28} rx={7} fill={C.fabricDark} />
      <rect x={28} y={44} width={44} height={14} rx={6} fill={C.fabricDark} />
      <rect x={24} y={70} width={6} height={10} fill={C.woodDark} />
      <rect x={70} y={70} width={6} height={10} fill={C.woodDark} />
    </>
  ),
  armchair: (
    <>
      <rect x={32} y={50} width={36} height={22} rx={8} fill={C.fabric} />
      <rect x={28} y={44} width={10} height={28} rx={5} fill={C.fabricDark} />
      <rect x={62} y={44} width={10} height={28} rx={5} fill={C.fabricDark} />
      <rect x={38} y={42} width={24} height={14} rx={6} fill={C.fabricDark} />
      <rect x={34} y={70} width={5} height={10} fill={C.woodDark} />
      <rect x={61} y={70} width={5} height={10} fill={C.woodDark} />
    </>
  ),
  "coffee-table": (
    <>
      <rect x={26} y={50} width={48} height={8} rx={3} fill={C.wood} />
      <ellipse cx={50} cy={50} rx={24} ry={4} fill={C.woodDark} />
      <rect x={32} y={58} width={5} height={22} fill={C.woodDark} />
      <rect x={63} y={58} width={5} height={22} fill={C.woodDark} />
    </>
  ),
  rug: (
    <>
      <rect x={18} y={56} width={64} height={28} rx={4} fill={C.fabric} transform="skewX(-10)" />
      <rect x={24} y={60} width={52} height={20} rx={2} fill="none" stroke={C.fabricDark} strokeWidth="2" transform="skewX(-10)" />
      <rect x={32} y={66} width={36} height={8} rx={2} fill={C.blush} transform="skewX(-10)" />
    </>
  ),
  "wall-frame": (
    <>
      <rect x={30} y={22} width={40} height={50} rx={3} fill={C.gold} />
      <rect x={35} y={27} width={30} height={40} rx={2} fill={C.white} />
      <path d="M40 58 l8 -12 l6 8 l5 -7 l5 11 Z" fill={C.leaf} />
      <circle cx={56} cy={36} r={4} fill={C.petalGold} />
    </>
  ),
  mirror: (
    <>
      <ellipse cx={50} cy={48} rx={20} ry={28} fill={C.gold} />
      <ellipse cx={50} cy={48} rx={16} ry={24} fill="#eef4f6" />
      <path d="M40 36 q10 6 16 22" stroke="#fff" strokeWidth="3" opacity={0.6} fill="none" />
    </>
  ),
  shelf: (
    <>
      <rect x={24} y={40} width={52} height={5} rx={2} fill={C.wood} />
      <rect x={24} y={62} width={52} height={5} rx={2} fill={C.wood} />
      <ellipse cx={36} cy={38} rx={5} ry={3} fill={C.leaf} />
      <rect x={48} y={30} width={8} height={10} rx={2} fill={C.ceramic} />
      <circle cx={66} cy={36} r={4} fill={C.rose} />
    </>
  ),
  cushion: (
    <>
      <rect x={30} y={40} width={40} height={36} rx={10} fill={C.fabric} />
      <rect x={36} y={46} width={28} height={24} rx={6} fill="none" stroke={C.fabricDark} strokeWidth="2" />
      <circle cx={50} cy={58} r={5} fill={C.rose} />
    </>
  ),
  vase: (
    <>
      <path d="M42 44 c -6 14 -6 30 8 36 c 14 -6 14 -22 8 -36 Z" fill={C.ceramic} />
      <ellipse cx={50} cy={44} rx={8} ry={3} fill={C.ceramicDark} />
      <path d="M50 44 C 44 30 40 24 38 18" stroke={C.stem} strokeWidth="2" fill="none" />
      <path d="M50 44 C 56 30 60 24 62 18" stroke={C.stem} strokeWidth="2" fill="none" />
      <Bloom cx={38} cy={16} r={7} color={C.rose} />
      <Bloom cx={62} cy={16} r={7} color={C.blush} />
      <Bloom cx={50} cy={12} r={7} color={C.lav} />
    </>
  ),
};

export function FloraArt({
  art: key,
  className,
}: {
  art: ArtKey;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {art[key]}
    </svg>
  );
}
