import Link from "next/link";
import {
  Plus,
  ArrowRight,
  Sprout,
  HeartPulse,
  Wallet,
  LayoutGrid,
  Clock,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DesignScene } from "@/components/design-scene";
import { PlantAvatar } from "@/components/plants/plant-avatar";
import { FloralDivider, VineCorner } from "@/components/decorations";
import { PROJECTS, DEMO_DESIGN } from "@/lib/mock/projects";
import { PLANTS, statusFromHealth, STATUS_LABEL } from "@/lib/mock/plants";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Dashboard · MP FloraStudio" };

export default function DashboardPage() {
  const thriving = PLANTS.filter((p) => statusFromHealth(p.health) === "thriving").length;
  const avgHealth = Math.round(PLANTS.reduce((s, p) => s + p.health, 0) / PLANTS.length);
  const collectionValue = PLANTS.reduce((s, p) => s + p.value, 0);

  const stats = [
    { icon: LayoutGrid, label: "Designs", value: String(PROJECTS.length), tone: "bg-blush-100 text-rose-500" },
    { icon: Sprout, label: "Plants thriving", value: `${thriving}/${PLANTS.length}`, tone: "bg-[#eef3ea] text-sage" },
    { icon: HeartPulse, label: "Avg. health", value: `${avgHealth}%`, tone: "bg-[#fbf1dd] text-[#c79a3e]" },
    { icon: Wallet, label: "Collection value", value: formatCurrency(collectionValue), tone: "bg-blush-100 text-rose-600" },
  ];

  return (
    <PageShell className="mx-auto w-full max-w-7xl px-5 pb-10 pt-10 sm:px-8">
      {/* header */}
      <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-blush-200 bg-gradient-to-br from-blush-50 via-paper to-paper p-8 shadow-[var(--shadow-petal)]">
        <VineCorner flip className="absolute -right-5 -top-5 h-36 w-36 opacity-60" />
        <p className="text-sm font-medium text-rose-500">Welcome back 🌸</p>
        <h1 className="mt-1 font-display text-4xl tracking-tight text-plum-900">
          Your studio
        </h1>
        <p className="mt-2 max-w-lg text-plum-500">
          Pick up a design or check in on your plants. Everything here is a
          friendly demo with mock data.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/design/new">
              <Plus className="h-4 w-4" /> New design
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/plants">Open plant care</Link>
          </Button>
        </div>
      </div>

      {/* stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <span className={`grid h-11 w-11 place-items-center rounded-2xl ${s.tone}`}>
              <s.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-display text-3xl text-plum-900">{s.value}</p>
            <p className="text-sm text-plum-500">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* projects */}
      <div className="mt-12 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl tracking-tight text-plum-900">
            Saved designs
          </h2>
          <p className="text-sm text-plum-500">Continue where you left off.</p>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/design/new">
            New <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p, i) => (
          <Card
            key={p.id}
            className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-bloom)]"
          >
            <div className="relative">
              <DesignScene
                spaceId={p.spaceId}
                items={DEMO_DESIGN.slice(0, 4 + (i % 4))}
                rounded="rounded-none"
                className="!aspect-[16/10]"
              />
              <Badge
                variant={p.status === "Ready" ? "thriving" : p.status === "Draft" ? "okay" : "soft"}
                className="absolute left-3 top-3 backdrop-blur"
              >
                {p.status}
              </Badge>
            </div>
            <div className="p-5">
              <h3 className="text-lg text-plum-900">{p.name}</h3>
              <p className="mt-0.5 text-sm text-plum-500">
                {p.spaceType} · {p.style}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-plum-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {p.updatedAt}
                </span>
                <span>{p.itemCount} items · {formatCurrency(p.estCost)}</span>
              </div>
              <Button asChild variant="soft" size="sm" className="mt-4 w-full">
                <Link href="/design/demo/editor">
                  Open editor <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}

        {/* new design tile */}
        <Link
          href="/design/new"
          className="group grid min-h-[260px] place-items-center rounded-[var(--radius-lg)] border-2 border-dashed border-blush-300 bg-blush-50/40 text-center transition-colors hover:border-rose-400 hover:bg-blush-50"
        >
          <div>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-paper text-rose-500 shadow-[var(--shadow-petal)] transition-transform group-hover:scale-110">
              <Plus className="h-7 w-7" />
            </span>
            <p className="mt-4 font-medium text-plum-700">Start a new design</p>
            <p className="text-sm text-plum-400">From a photo of your space</p>
          </div>
        </Link>
      </div>

      <FloralDivider className="my-14" />

      {/* plant summary */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl tracking-tight text-plum-900">
            Plant care
          </h2>
          <p className="text-sm text-plum-500">A quick look at your garden.</p>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/plants">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLANTS.slice(0, 6).map((p) => {
          const status = statusFromHealth(p.health);
          return (
            <Link key={p.id} href="/plants/demo">
              <Card className="flex items-center gap-4 p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-petal)]">
                <PlantAvatar art={p.art} status={status} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-base text-plum-900">{p.name}</h3>
                    <Badge variant={status}>{STATUS_LABEL[status]}</Badge>
                  </div>
                  <p className="truncate text-xs text-plum-400">{p.species}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-blush-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-rose-300 to-rose-500"
                        style={{ width: `${p.health}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium tabular-nums text-plum-500">{p.health}%</span>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </PageShell>
  );
}
