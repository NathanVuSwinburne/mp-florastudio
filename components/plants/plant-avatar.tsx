import { FloraArt } from "@/components/flora-art";
import type { ArtKey, PlantStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const RING: Record<PlantStatus, string> = {
  thriving: "from-[#dcecd1] to-[#eef6e8] ring-[#bcd9a8]",
  okay: "from-[#fbeccd] to-[#fdf6e7] ring-[#f0d59a]",
  needs: "from-blush-100 to-blush-50 ring-blush-300",
};

const FACE: Record<PlantStatus, string> = {
  thriving: "◡̈",
  okay: "•ᴗ•",
  needs: "◞﹏◟",
};

export function PlantAvatar({
  art,
  status,
  size = "md",
  withFace = true,
  className,
}: {
  art: ArtKey;
  status: PlantStatus;
  size?: "sm" | "md" | "lg" | "xl";
  withFace?: boolean;
  className?: string;
}) {
  const dims = {
    sm: "h-14 w-14",
    md: "h-20 w-20",
    lg: "h-28 w-28",
    xl: "h-40 w-40",
  }[size];

  return (
    <div
      className={cn(
        "relative grid place-items-center rounded-full bg-gradient-to-br ring-2",
        RING[status],
        dims,
        className
      )}
    >
      <FloraArt art={art} className="h-[78%] w-[78%]" />
      {withFace && (
        <span
          className="absolute bottom-[18%] left-1/2 -translate-x-1/2 select-none text-[0.6rem] font-bold text-plum-700/70"
          aria-hidden="true"
        >
          {FACE[status]}
        </span>
      )}
    </div>
  );
}
