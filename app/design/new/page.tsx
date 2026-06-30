"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowRight,
  Upload,
  Check,
  Sun,
  Wallet,
  Sparkles,
  PawPrint,
  Leaf,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VineCorner } from "@/components/decorations";
import { SAMPLE_SPACES, SPACE_TYPES } from "@/lib/mock/spaces";
import { cn, formatCurrency } from "@/lib/utils";

const MOODS = ["Romantic", "Modern Luxe", "Cottagecore", "Mediterranean", "Minimal Zen", "Wild Garden"];
const MAINTENANCE = ["Low", "Medium", "High"];
const SUNLIGHT = ["Full sun", "Partial shade", "Low light"];

export default function NewDesignPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("My Dream Space");
  const [spaceType, setSpaceType] = useState(SPACE_TYPES[0]);
  const [spaceId, setSpaceId] = useState(SAMPLE_SPACES[0].id);
  const [upload, setUpload] = useState<string | null>(null);
  const [mood, setMood] = useState(MOODS[0]);
  const [sunlight, setSunlight] = useState(SUNLIGHT[0]);
  const [budget, setBudget] = useState(1500);
  const [maintenance, setMaintenance] = useState("Low");
  const [petSafe, setPetSafe] = useState(true);

  const selectedSpace = SAMPLE_SPACES.find((s) => s.id === spaceId)!;

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUpload(URL.createObjectURL(file));
      setSpaceId("");
    }
  };

  return (
    <PageShell className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:px-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-rose-500">New design</p>
        <h1 className="mt-1 font-display text-4xl tracking-tight text-plum-900">
          Set up your space
        </h1>
        <p className="mt-2 max-w-xl text-plum-500">
          A few quick choices and we&apos;ll open the editor. Everything is a
          frontend demo — your settings shape the canvas you land on.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        {/* FORM */}
        <div className="space-y-8">
          {/* basics */}
          <Section title="The basics" icon={Sparkles}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Project name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Space type</Label>
                <Select value={spaceType} onValueChange={(v) => setSpaceType(v as typeof spaceType)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SPACE_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Section>

          {/* photo */}
          <Section title="Choose a photo" icon={Upload}>
            <p className="mb-3 text-sm text-plum-500">
              Pick a sample space or upload your own (previewed locally — nothing is uploaded).
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {SAMPLE_SPACES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSpaceId(s.id); setUpload(null); }}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border-2 text-left transition-all",
                    spaceId === s.id ? "border-rose-400 shadow-[var(--shadow-petal)]" : "border-transparent hover:border-blush-300"
                  )}
                >
                  <div className="h-20 w-full" style={{ background: s.gradient }} />
                  <div className="bg-paper px-2.5 py-1.5">
                    <p className="truncate text-xs font-medium text-plum-700">{s.name}</p>
                  </div>
                  {spaceId === s.id && (
                    <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-rose-500 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              ))}

              {/* upload tile */}
              <button
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "relative grid place-items-center overflow-hidden rounded-2xl border-2 border-dashed transition-colors",
                  upload ? "border-rose-400" : "border-blush-300 hover:border-rose-300 hover:bg-blush-50"
                )}
              >
                {upload ? (
                  <>
                    <Image src={upload} alt="Your upload" fill unoptimized className="object-cover" />
                    <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-rose-500 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  </>
                ) : (
                  <span className="flex flex-col items-center gap-1 py-6 text-plum-400">
                    <Upload className="h-5 w-5" />
                    <span className="text-xs font-medium">Upload photo</span>
                  </span>
                )}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
            </div>
          </Section>

          {/* preferences */}
          <Section title="Style & preferences" icon={Leaf}>
            <div className="space-y-5">
              <div>
                <Label>Style mood</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {MOODS.map((m) => (
                    <Chip key={m} active={mood === m} onClick={() => setMood(m)}>{m}</Chip>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="flex items-center gap-1.5"><Sun className="h-4 w-4 text-gold" /> Sunlight</Label>
                  <Select value={sunlight} onValueChange={setSunlight}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SUNLIGHT.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Maintenance</Label>
                  <div className="mt-1.5 flex rounded-full bg-blush-50 p-1">
                    {MAINTENANCE.map((m) => (
                      <button
                        key={m}
                        onClick={() => setMaintenance(m)}
                        className={cn(
                          "flex-1 rounded-full py-1.5 text-xs font-medium transition-colors",
                          maintenance === m ? "bg-paper text-rose-600 shadow-sm" : "text-plum-500"
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-1.5"><Wallet className="h-4 w-4 text-rose-500" /> Budget</Label>
                  <span className="text-sm font-medium text-plum-700">{formatCurrency(budget)}</span>
                </div>
                <Slider className="mt-3" value={[budget]} min={200} max={5000} step={50} onValueChange={([b]) => setBudget(b)} />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-blush-200 bg-blush-50/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <PawPrint className="h-5 w-5 text-rose-500" />
                  <div>
                    <p className="text-sm font-medium text-plum-800">Pet-safe plants only</p>
                    <p className="text-xs text-plum-400">Filter out anything toxic to cats &amp; dogs</p>
                  </div>
                </div>
                <Switch checked={petSafe} onCheckedChange={setPetSafe} />
              </div>
            </div>
          </Section>
        </div>

        {/* SUMMARY */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-blush-200 bg-paper shadow-[var(--shadow-bloom)]">
            <VineCorner className="absolute -right-3 -top-3 z-10 h-28 w-28 opacity-60" />
            <div className="relative h-40 w-full">
              {upload ? (
                <Image src={upload} alt="Selected space" fill unoptimized className="object-cover" />
              ) : (
                <div className="h-full w-full" style={{ background: selectedSpace.gradient }} />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-plum-900/40 to-transparent p-4">
                <p className="font-display text-xl text-white drop-shadow">{name || "Untitled"}</p>
              </div>
            </div>
            <div className="space-y-3 p-5">
              <Row label="Space" value={spaceType} />
              <Row label="Photo" value={upload ? "Your upload" : selectedSpace.name} />
              <Row label="Mood" value={mood} />
              <Row label="Sunlight" value={sunlight} />
              <Row label="Maintenance" value={maintenance} />
              <Row label="Budget" value={formatCurrency(budget)} />
              <Row label="Pet-safe" value={petSafe ? "Yes 🐾" : "No"} />

              <Button className="mt-3 w-full" size="lg" onClick={() => router.push("/design/demo/editor")}>
                Open editor <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-center text-[0.7rem] text-plum-400">
                Demo opens a sample courtyard you can fully edit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-blush-200/70 bg-paper/70 p-6 shadow-[var(--shadow-petal)]">
      <h2 className="mb-4 flex items-center gap-2 font-display text-xl text-plum-900">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-blush-100 text-rose-500">
          <Icon className="h-4 w-4" />
        </span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
        active
          ? "border-rose-400 bg-rose-500 text-white shadow-sm"
          : "border-blush-200 bg-paper text-plum-600 hover:border-rose-300 hover:text-rose-600"
      )}
    >
      {children}
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-blush-100 pb-2.5 text-sm last:border-0">
      <span className="text-plum-400">{label}</span>
      <span className="font-medium text-plum-800">{value}</span>
    </div>
  );
}
