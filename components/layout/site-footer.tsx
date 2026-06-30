import Link from "next/link";
import { Logo } from "@/components/brand";
import { FloralDivider } from "@/components/decorations";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-blush-200/70 bg-gradient-to-b from-transparent to-blush-50/60">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <FloralDivider className="mb-10" />
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-plum-500">
              A no-code visual studio for gardens and home spaces. Design your
              real space, then care for the plants you bring to life.
            </p>
          </div>
          {[
            { title: "Studio", links: [["Dashboard", "/dashboard"], ["New design", "/design/new"], ["Editor demo", "/design/demo/editor"]] },
            { title: "Garden", links: [["Plant care", "/plants"], ["Plant detail", "/plants/demo"], ["Photo health check", "/plants/demo/photo-check"]] },
            { title: "About", links: [["Preview design", "/design/demo/preview"], ["Home", "/"]] },
          ].map((col) => (
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
          <p>© {new Date().getFullYear()} MP FloraStudio · Frontend demo prototype</p>
          <p className="rounded-full bg-blush-100 px-3 py-1 text-rose-600">
            Phase 1 · No backend · All data is mock
          </p>
        </div>
      </div>
    </footer>
  );
}
