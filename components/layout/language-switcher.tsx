"use client";

import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  en: "EN",
  vi: "VI",
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  // `usePathname` from next-intl returns the path without the locale prefix,
  // so we can re-render it under the target locale.
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-blush-200 bg-paper/70 p-0.5",
        className
      )}
    >
      <Globe className="mx-1 h-3.5 w-3.5 text-plum-400" aria-hidden="true" />
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          aria-current={loc === locale ? "true" : undefined}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
            loc === locale
              ? "bg-rose-500 text-white shadow-sm"
              : "text-plum-500 hover:text-rose-600"
          )}
        >
          {LABELS[loc] ?? loc.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
