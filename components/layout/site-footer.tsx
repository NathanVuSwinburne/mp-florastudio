import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand";
import { FloralDivider } from "@/components/decorations";

export function SiteFooter() {
  const t = useTranslations();
  const columns = [
    {
      title: t("footer.studio"),
      links: [
        [t("footer.links.dashboard"), "/dashboard"],
        [t("footer.links.newDesign"), "/design/new"],
        [t("footer.links.editorDemo"), "/design/demo/editor"],
      ],
    },
    {
      title: t("footer.garden"),
      links: [
        [t("footer.links.plantCare"), "/plants"],
        [t("footer.links.plantDetail"), "/plants/demo"],
        [t("footer.links.photoCheck"), "/plants/demo/photo-check"],
      ],
    },
    {
      title: t("footer.about"),
      links: [
        [t("footer.links.previewDesign"), "/design/demo/preview"],
        [t("footer.links.home"), "/"],
      ],
    },
  ] as const;

  return (
    <footer className="relative mt-24 border-t border-blush-200/70 bg-gradient-to-b from-transparent to-blush-50/60">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <FloralDivider className="mb-10" />
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-plum-500">
              {t("footer.tagline")}
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-rose-600">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-plum-500 transition-colors hover:text-rose-600"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-blush-200/60 pt-6 text-xs text-plum-400 sm:flex-row">
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <p className="rounded-full bg-blush-100 px-3 py-1 text-rose-600">
            {t("footer.phase")}
          </p>
        </div>
      </div>
    </footer>
  );
}
