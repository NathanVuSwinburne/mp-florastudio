import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-[88px] w-full rounded-[var(--radius-md)] border border-input bg-paper/80 px-4 py-3 text-sm text-plum-900 shadow-sm transition-colors placeholder:text-plum-300 focus-visible:outline-none focus-visible:border-rose-400 focus-visible:ring-2 focus-visible:ring-rose-400/30 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
