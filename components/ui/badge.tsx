import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-rose-500 text-white",
        soft: "border-blush-200 bg-blush-50 text-rose-700",
        gold: "border-gold-soft bg-[#fbf4e3] text-[#8a6d2f]",
        sage: "border-sage-soft bg-[#eef3ea] text-[#4f6344]",
        outline: "border-blush-200 text-plum-700",
        thriving: "border-transparent bg-[#e7f1e2] text-[#4f6e41]",
        okay: "border-transparent bg-[#fbf1dd] text-[#a4762a]",
        needs: "border-transparent bg-[#fbe3e8] text-[#b8425f]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
