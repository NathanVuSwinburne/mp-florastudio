import Link from "next/link";
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

const STEPS = [
  { icon: ImageIcon, title: "Start from your space", text: "Pick a sample photo or upload your own garden, balcony, courtyard or living room." },
  { icon: MousePointerClick, title: "Drag in the beauty", text: "Search hundreds of plants, pots, lights and furnishings. Drag, resize, rotate — no skills needed." },
  { icon: HeartHandshake, title: "Grow what you planted", text: "Track the real plants from your design in a cosy, game-like care studio." },
];

export default function Home() {
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
              No-code visual garden studio
            </Badge>
            <h1 className="font-display text-[2.7rem] leading-[1.04] tracking-tight text-plum-900 sm:text-6xl">
              Design your dream
              <br />
              garden{" "}
              <span className="shimmer-text">from a photo.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-plum-500">
              MP FloraStudio is a no-code visual studio for gardens and home
              spaces. Edit your real space, add flowers, plants, pots, statues,
              vines, lighting, furniture and decor — then care for the real
              plants you bring to life.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/design/new">
                  Start designing <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/design/demo/editor">
                  <Wand2 className="h-4 w-4" /> View demo
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-plum-400">
              <span className="flex items-center gap-1.5"><Layers className="h-4 w-4 text-rose-400" /> 35+ design pieces</span>
              <span className="flex items-center gap-1.5"><Leaf className="h-4 w-4 text-sage" /> Live plant care</span>
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
            Two studios, one bloom
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-tight text-plum-900">
            Imagine it, then grow it
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <FeatureCard
            tone="rose"
            eyebrow="Visual design editor"
            title="A Canva for your real space"
            text="Upload your garden or room, then drag in plants, pots, vines, statues, lighting and furniture. Resize, rotate, layer and preview — all in the browser, no design skills required."
            bullets={["Search & browse categories", "Drag · resize · rotate · duplicate", "Live cost & shopping list"]}
            href="/design/demo/editor"
            cta="Open the editor"
          />
          <FeatureCard
            tone="sage"
            eyebrow="Plant health monitor"
            title="Care for plants like a cosy game"
            text="Every plant you place becomes a living companion. Water, give sunlight, fertilise and mist to keep them thriving — and run a demo AI photo check whenever you're unsure."
            bullets={["Cute avatars, levels & health", "Hydration · sunlight · growth stats", "Demo AI photo health check"]}
            href="/plants"
            cta="Enter the garden"
          />
        </div>
      </section>

      {/* ------------------------------------------------------------- HOW IT WORKS */}
      <section className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
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
            <Sparkles className="h-3.5 w-3.5" /> Curated library
          </Badge>
          <h2 className="font-display text-4xl tracking-tight text-plum-900">
            Everything to style a space
          </h2>
          <p className="mt-3 max-w-xl text-plum-500">
            From peonies to floor lamps — a hand-illustrated collection across
            twelve categories, ready to drag onto your canvas.
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
              <span className="text-sm font-medium text-plum-700">{cat}</span>
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
                Then watch them flourish
              </h2>
              <p className="mt-4 max-w-lg text-plum-500">
                Your design isn&apos;t the finish line. Every plant becomes a
                companion with a level, a health score and a little personality.
                Tend to them with delightful one-tap care.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { icon: Droplets, label: "Water" },
                  { icon: Sun, label: "Sunlight" },
                  { icon: Leaf, label: "Fertilise" },
                  { icon: Camera, label: "Photo check" },
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
                  Meet your plants <ArrowRight className="h-4 w-4" />
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
          Your most beautiful space starts here
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-plum-500">
          No sign-up, no setup. Open the studio and start dreaming in flowers.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/design/new">
              Start designing <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="soft">
            <Link href="/dashboard">Go to dashboard</Link>
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
