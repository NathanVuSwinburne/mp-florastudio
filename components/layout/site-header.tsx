"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, Sparkles, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/brand";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", labelKey: "nav.dashboard" },
  { href: "/design/new", labelKey: "nav.newDesign" },
  { href: "/design/demo/editor", labelKey: "nav.editor" },
  { href: "/plants", labelKey: "nav.plantCare" },
] as const;

export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-blush-200/70 glass-rose">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "text-rose-600"
                  : "text-plum-500 hover:text-rose-600"
              )}
            >
              {isActive(item.href) && (
                <span className="absolute inset-0 -z-10 rounded-full bg-blush-100" />
              )}
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <Button asChild variant="default" size="sm">
            <Link href="/design/new">
              <Sparkles className="h-4 w-4" />
              {t("nav.startDesigning")}
            </Link>
          </Button>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-full text-plum-700 hover:bg-blush-50 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={t("nav.toggleMenu")}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-blush-200/70 bg-paper/95 px-5 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-blush-100 text-rose-600"
                    : "text-plum-600 hover:bg-blush-50"
                )}
              >
                {t(item.labelKey)}
              </Link>
            ))}
            <Button asChild className="mt-2">
              <Link href="/design/new" onClick={() => setOpen(false)}>
                <Sparkles className="h-4 w-4" />
                {t("nav.startDesigning")}
              </Link>
            </Button>
            <LanguageSwitcher className="mt-2 self-start" />
          </nav>
        </div>
      )}
    </header>
  );
}
