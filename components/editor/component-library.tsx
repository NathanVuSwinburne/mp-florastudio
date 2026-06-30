"use client";

import { useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import { FloraArt } from "@/components/flora-art";
import { Input } from "@/components/ui/input";
import { CATEGORIES, searchComponents } from "@/lib/mock/components";
import type { ComponentCategory, ComponentDef } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

export function ComponentLibrary({
  onAdd,
}: {
  onAdd: (def: ComponentDef) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ComponentCategory | "All">("All");

  const results = useMemo(() => searchComponents(query, category), [query, category]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-blush-200/70 p-4">
        <h2 className="font-display text-lg text-plum-900">Library</h2>
        <p className="text-xs text-plum-400">Click a piece to add it to your space.</p>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-plum-300" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search plants, pots, lights…"
            className="h-10 pl-9"
          />
        </div>
      </div>

      {/* categories */}
      <div className="flex flex-wrap gap-1.5 border-b border-blush-200/70 p-3">
        <CatChip active={category === "All"} onClick={() => setCategory("All")}>
          All
        </CatChip>
        {CATEGORIES.map((c) => (
          <CatChip key={c} active={category === c} onClick={() => setCategory(c)}>
            {c}
          </CatChip>
        ))}
      </div>

      {/* grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {results.length === 0 ? (
          <div className="grid h-full place-items-center text-center text-sm text-plum-400">
            <div>
              <p className="text-3xl">🌷</p>
              <p className="mt-2">No pieces match “{query}”.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {results.map((def) => (
              <button
                key={def.id}
                onClick={() => onAdd(def)}
                className="group relative flex flex-col items-center rounded-2xl border border-blush-200/70 bg-paper p-2.5 text-center transition-all hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-[var(--shadow-petal)]"
              >
                <span className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-blush-100 text-rose-500 opacity-0 transition-opacity group-hover:opacity-100">
                  <Plus className="h-3.5 w-3.5" />
                </span>
                <div className="grid h-16 w-full place-items-center rounded-xl bg-gradient-to-br from-blush-50 to-blush-100/60">
                  <FloraArt art={def.art} className="h-14 w-14" />
                </div>
                <span className="mt-2 line-clamp-1 text-xs font-medium text-plum-700">
                  {def.name}
                </span>
                <span className="text-[0.65rem] text-plum-400">
                  {formatCurrency(def.price)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CatChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-rose-500 text-white shadow-sm"
          : "bg-blush-50 text-plum-500 hover:bg-blush-100 hover:text-rose-600"
      )}
    >
      {children}
    </button>
  );
}
