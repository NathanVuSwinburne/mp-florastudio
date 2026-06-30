"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="bottom-center"
      toastOptions={{
        style: {
          background: "rgba(255,252,250,0.92)",
          backdropFilter: "blur(12px)",
          border: "1px solid var(--blush-200)",
          color: "var(--plum-900)",
          borderRadius: "999px",
          boxShadow: "var(--shadow-bloom)",
          fontFamily: "var(--font-hanken), sans-serif",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
