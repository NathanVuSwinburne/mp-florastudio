import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Sparkles,
  Wand2,
  HeartHandshake,
  Camera,
  MousePointerClick,
  Image as ImageIcon,
  Layers,
  Droplets,
  Sun,
  Leaf,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FloralDivider, PetalField, VineCorner } from "@/components/decorations";
import { EditorMockup } from "@/components/landing/editor-mockup";
import { FloraArt } from "@/components/flora-art";
import { CATEGORIES } from "@/lib/mock/components";
import type { ArtKey } from "@/lib/types";

const CATEGORY_ART: ArtKey[] = [
  "rose", "monstera", "pot-ceramic", "vine", "stone", "statue",
  "lantern", "bench", "outdoor-chair", "sofa", "wall-frame", "vase",
];

export default function Home() {
  const t = useTranslations();

  const steps = [
    { icon: ImageIcon, title: t("home.step1Title"), text: t("home.step1Text") },
    { icon: MousePointerClick, title: t("home.step2Title"), text: t("home.step2Text") },
    { icon: HeartHandshake, title: t("home.step3Title"), text: t("home.step3Text") },
  ];

  return (
    <PageShell>
      {/* ---------------------------------------------------------------- HERO */}
      <section className="relative overflow-hidden">
        <PetalField />
        <VineCorner className="absolute -left-6 top-10 h-40 w-40 opacity-70" />
        <VineCorner flip className="absolute -right-6 top-24 h-40 w-40 opacity-60" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:pt-20">
          <div className="relative">
            <Badge variant="soft" className="mb-5 animate-rise">
              <Sparkles className="h-3.5 w-3.5" />
              {t("home.heroBadge")}
            </Badge>
            <h1 className="font-display text-[2.7rem] leading-[1.04] tracking-tight text-plum-900 sm:text-6xl">
              {t("home.heroTitleLine1")}
              <br />
              {t("home.heroTitleGarden")}{" "}
              <span className="shimmer-text">{t("home.heroTitleHighlight")}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-plum-500">
              {t("home.heroSubtitle")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/design/new">
                  {t("home.startDesigning")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/design/demo/editor">
                  <Wand2 className="h-4 w-4" /> {t("home.viewDemo")}
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-plum-400">
              <span className="flex items-center gap-1.5"><Layers className="h-4 w-4 text-rose-400" /> {t("home.statPieces")}</span>
              <span className="flex items-center gap-1.5"><Leaf className="h-4 w-4 text-sage" /> {t("home.statCare")}</span>
            </div>
          </div>

          <div className="relative animate-rise [animation-delay:120ms]">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-blush-200/50 via-transparent to-gold-soft/30 blur-2xl" />
            <EditorMockup />
          </div>
        </div>
      </section>

      <FloralDivider className="mx-auto max-w-5xl px-8" />

      {/* ----------------------------------------------------------- TWO STUDIOS */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
            {t("home.studiosEyebrow")}
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-tight text-plum-900">
            {t("home.studiosTitle")}
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <FeatureCard
            tone="rose"
            eyebrow={t("home.featureDesignEyebrow")}
            title={t("home.featureDesignTitle")}
            text={t("home.featureDesignText")}
            bullets={[t("home.featureDesignBullet1"), t("home.featureDesignBullet2"), t("home.featureDesignBullet3")]}
            href="/design/demo/editor"
            cta={t("home.featureDesignCta")}
          />
          <FeatureCard
            tone="sage"
            eyebrow={t("home.featureCareEyebrow")}
            title={t("home.featureCareTitle")}
            text={t("home.featureCareText")}
            bullets={[t("home.featureCareBullet1"), t("home.featureCareBullet2"), t("home.featureCareBullet3")]}
            href="/plants"
            cta={t("home.featureCareCta")}
          />
        </div>
      </section>

      {/* ------------------------------------------------------------- HOW IT WORKS */}
      <section className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-[var(--radius-lg)] border border-blush-200/70 bg-paper/70 p-7 shadow-[var(--shadow-petal)]"
            >
              <span className="absolute right-6 top-5 font-display text-5xl text-blush-200">
                {i + 1}
              </span>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blush-100 text-rose-500">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl text-plum-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-plum-500">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- CATEGORIES */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <Badge variant="gold" className="mb-4">
            <Sparkles className="h-3.5 w-3.5" /> {t("home.libraryBadge")}
          </Badge>
          <h2 className="font-display text-4xl tracking-tight text-plum-900">
            {t("home.libraryTitle")}
          </h2>
          <p className="mt-3 max-w-xl text-plum-500">
            {t("home.libraryText")}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat}
              className="group flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-blush-200/60 bg-paper/70 p-5 text-center shadow-[var(--shadow-petal)] transition-all duration-300 hover:-translate-y-1 hover:border-rose-300 hover:shadow-[var(--shadow-glow)]"
            >
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blush-50 to-blush-100 transition-transform duration-500 group-hover:scale-110">
                <FloraArt art={CATEGORY_ART[i]} className="h-12 w-12" />
              </div>
              <span className="text-sm font-medium text-plum-700">{t(`categories.${cat}`)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- CARE TEASER */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-blush-200 bg-gradient-to-br from-blush-50 via-paper to-[#fbf4e3] p-8 shadow-[var(--shadow-bloom)] sm:p-12">
          <VineCorner className="absolute -right-4 -top-4 h-36 w-36 opacity-60" />
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h2 className="font-display text-4xl tracking-tight text-plum-900">
                {t("home.careTeaserTitle")}
              </h2>
              <p className="mt-4 max-w-lg text-plum-500">
                {t("home.careTeaserText")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { icon: Droplets, label: t("home.careWater") },
                  { icon: Sun, label: t("home.careSunlight") },
                  { icon: Leaf, label: t("home.careFertilise") },
                  { icon: Camera, label: t("home.carePhotoCheck") },
                ].map((a) => (
                  <span
                    key={a.label}
                    className="flex items-center gap-2 rounded-full border border-blush-200 bg-paper px-4 py-2 text-sm font-medium text-plum-600 shadow-sm"
                  >
                    <a.icon className="h-4 w-4 text-rose-500" /> {a.label}
                  </span>
                ))}
              </div>
              <Button asChild className="mt-7">
                <Link href="/plants">
                  {t("home.meetYourPlants")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex items-end justify-center gap-4">
              {(["monstera", "peony", "lavender"] as ArtKey[]).map((a, i) => (
                <div
                  key={a}
                  className="rounded-[var(--radius-lg)] border border-blush-200 bg-paper/80 p-4 shadow-[var(--shadow-petal)] animate-float"
                  style={{ animationDelay: `${i * 0.6}s` }}
                >
                  <FloraArt art={a} className="h-24 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- CTA BAND */}
      <section className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-8">
        <h2 className="font-display text-4xl tracking-tight text-plum-900 sm:text-5xl">
          {t("home.ctaTitle")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-plum-500">
          {t("home.ctaText")}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/design/new">
              {t("home.ctaStart")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="soft">
            <Link href="/dashboard">{t("home.ctaDashboard")}</Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}

function FeatureCard({
  tone,
  eyebrow,
  title,
  text,
  bullets,
  href,
  cta,
}: {
  tone: "rose" | "sage";
  eyebrow: string;
  title: string;
  text: string;
  bullets: string[];
  href: string;
  cta: string;
}) {
  const toneClasses =
    tone === "rose" ? "from-blush-100 to-paper" : "from-[#eef3ea] to-paper";
  return (
    <div className="group relative overflow-hidden rounded-[var(--radius-xl)] border border-blush-200/70 bg-paper p-8 shadow-[var(--shadow-petal)] transition-shadow hover:shadow-[var(--shadow-bloom)]">
      <div className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br ${toneClasses} opacity-70 blur-2xl`} />
      <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-rose-500">
        {eyebrow}
      </p>
      <h3 className="relative mt-2 font-display text-2xl tracking-tight text-plum-900">
        {title}
      </h3>
      <p className="relative mt-3 text-sm leading-relaxed text-plum-500">{text}</p>
      <ul className="relative mt-5 space-y-2">
        {bullets.map((b) => (
          <li key={b} className="flex items-center gap-2 text-sm text-plum-600">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-blush-100 text-rose-500">
              <Sparkles className="h-3 w-3" />
            </span>
            {b}
          </li>
        ))}
      </ul>
      <Button asChild variant="ghost" className="relative mt-6 px-0 hover:bg-transparent hover:text-rose-700">
        <Link href={href}>
          {cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    </div>
  );
}
