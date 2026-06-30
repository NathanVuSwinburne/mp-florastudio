import {
  Flower2,
  Leaf,
  Lightbulb,
  Armchair,
  Sparkles,
  MousePointer2,
} from "lucide-react";
import { DesignScene } from "@/components/design-scene";
import { DEMO_DESIGN, DEMO_SPACE_ID } from "@/lib/mock/projects";

/** A static, decorative recreation of the editor — the hero centerpiece. */
export function EditorMockup() {
  const rail = [Flower2, Leaf, Lightbulb, Armchair, Sparkles];
  return (
    <div className="relative rounded-[var(--radius-xl)] border border-blush-200 bg-paper/90 p-2.5 shadow-[var(--shadow-bloom)] backdrop-blur">
      {/* window bar */}
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-gold-soft" />
        <span className="h-2.5 w-2.5 rounded-full bg-sage-soft" />
        <div className="ml-3 hidden rounded-full bg-blush-50 px-3 py-1 text-[0.65rem] text-plum-400 sm:block">
          florastudio.app / courtyard-retreat
        </div>
        <div className="ml-auto flex items-center gap-1 rounded-full bg-blush-100 px-2.5 py-1 text-[0.65rem] font-medium text-rose-600">
          <Sparkles className="h-3 w-3" /> Editing
        </div>
      </div>

      <div className="flex gap-2.5">
        {/* left rail */}
        <div className="hidden flex-col gap-2 rounded-2xl bg-blush-50 p-2 sm:flex">
          {rail.map((Icon, i) => (
            <span
              key={i}
              className={`grid h-9 w-9 place-items-center rounded-xl ${
                i === 0 ? "bg-rose-500 text-white shadow-md" : "text-plum-400"
              }`}
            >
              <Icon className="h-5 w-5" />
            </span>
          ))}
        </div>

        {/* canvas */}
        <div className="relative flex-1">
          <DesignScene spaceId={DEMO_SPACE_ID} items={DEMO_DESIGN} />
          {/* selection chip floating on canvas */}
          <div className="absolute left-[14%] top-[30%] hidden items-center gap-1.5 rounded-full bg-plum-900/85 px-2.5 py-1 text-[0.62rem] font-medium text-white shadow-lg sm:flex">
            <MousePointer2 className="h-3 w-3" /> Monstera
          </div>
        </div>

        {/* right panel */}
        <div className="hidden w-32 flex-col gap-2.5 rounded-2xl bg-blush-50 p-2.5 lg:flex">
          <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-rose-500">
            Properties
          </p>
          {[
            ["Size", "82%"],
            ["Rotate", "0°"],
            ["Opacity", "100%"],
          ].map(([label, val]) => (
            <div key={label}>
              <div className="flex justify-between text-[0.6rem] text-plum-500">
                <span>{label}</span>
                <span className="text-plum-700">{val}</span>
              </div>
              <div className="mt-1 h-1 rounded-full bg-blush-200">
                <div className="h-full w-3/4 rounded-full bg-rose-400" />
              </div>
            </div>
          ))}
          <div className="mt-1 rounded-xl bg-paper p-2 text-center text-[0.58rem] text-plum-400">
            8 items · $1,180
          </div>
        </div>
      </div>
    </div>
  );
}
