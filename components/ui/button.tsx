import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 active:scale-[0.97] cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-rose-500 text-white shadow-[0_10px_24px_-10px_rgba(199,91,119,0.7)] hover:bg-rose-600 hover:shadow-[0_14px_30px_-10px_rgba(199,91,119,0.85)]",
        gold:
          "bg-gradient-to-br from-gold to-[#b9924f] text-white shadow-[0_10px_24px_-12px_rgba(198,166,103,0.9)] hover:brightness-105",
        outline:
          "border border-blush-200 bg-paper/70 text-plum-700 hover:border-rose-400 hover:text-rose-600 hover:bg-blush-50",
        soft: "bg-blush-100 text-rose-700 hover:bg-blush-200",
        ghost: "text-plum-700 hover:bg-blush-50 hover:text-rose-600",
        link: "text-rose-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-[0.8rem]",
        lg: "h-13 px-8 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
