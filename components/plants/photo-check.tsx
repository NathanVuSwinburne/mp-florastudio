"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Upload,
  ScanLine,
  RefreshCw,
  Check,
  AlertTriangle,
  Eye,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PlantAvatar } from "@/components/plants/plant-avatar";
import { FloraArt } from "@/components/flora-art";
import { randomScan } from "@/lib/mock/aiScans";
import { statusFromHealth, STATUS_LABEL } from "@/lib/mock/plants";
import type { AiScanResult, ArtKey } from "@/lib/types";
import { cn } from "@/lib/utils";

type Phase = "idle" | "ready" | "scanning" | "result";

const SAMPLE_ARTS: ArtKey[] = ["monstera", "fiddle-leaf", "peony", "fern"];

const TONE_STYLE = {
  good: { icon: Check, cls: "text-[#5f8f48] bg-[#eef6e7]" },
  watch: { icon: Eye, cls: "text-[#c79a3e] bg-[#fbf1dd]" },
  alert: { icon: AlertTriangle, cls: "text-rose-600 bg-blush-100" },
};

export function PhotoCheck() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [image, setImage] = useState<string | null>(null);
  const [sampleArt, setSampleArt] = useState<ArtKey | null>(null);
  const [result, setResult] = useState<AiScanResult | null>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setSampleArt(null);
      setPhase("ready");
    }
  };

  const pickSample = (art: ArtKey) => {
    setSampleArt(art);
    setImage(null);
    setPhase("ready");
  };

  const runScan = () => {
    setPhase("scanning");
    setTimeout(() => {
      setResult(randomScan());
      setPhase("result");
    }, 2200);
  };

  const reset = () => {
    setPhase("idle");
    setImage(null);
    setSampleArt(null);
    setResult(null);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-16 pt-8 sm:px-8">
      <div className="mb-5 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/plants/demo">
            <ArrowLeft className="h-4 w-4" /> Back to plant
          </Link>
        </Button>
        <Badge variant="gold">
          <ShieldAlert className="h-3.5 w-3.5" /> Demo · Mock AI
        </Badge>
      </div>

      <div className="text-center">
        <h1 className="font-display text-4xl tracking-tight text-plum-900">Photo health check</h1>
        <p className="mx-auto mt-2 max-w-lg text-plum-500">
          Snap or upload a photo and our studio runs a friendly visual check.
          This is a <strong className="text-rose-600">frontend demo</strong> — no
          real AI or server is involved, results are simulated.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* capture panel */}
        <Card className="p-6">
          <div className="relative aspect-square overflow-hidden rounded-[var(--radius-lg)] border border-blush-200 bg-blush-50/50">
            {/* content */}
            {image ? (
              <Image src={image} alt="Your plant" fill unoptimized className="object-cover" />
            ) : sampleArt ? (
              <div className="grid h-full w-full place-items-center" style={{ background: "linear-gradient(160deg,#fdf3f6,#f6d4e0)" }}>
                <FloraArt art={sampleArt} className="h-2/3 w-2/3" />
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="grid h-full w-full place-items-center text-center transition-colors hover:bg-blush-50"
              >
                <div>
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-paper text-rose-500 shadow-[var(--shadow-petal)]">
                    <Upload className="h-6 w-6" />
                  </span>
                  <p className="mt-3 font-medium text-plum-700">Upload or take a photo</p>
                  <p className="text-xs text-plum-400">PNG / JPG · previewed locally</p>
                </div>
              </button>
            )}

            {/* scanning overlay */}
            {phase === "scanning" && (
              <div className="absolute inset-0 z-10 bg-plum-900/10 backdrop-blur-[1px]">
                <div className="absolute inset-x-0 top-0 h-1/2 animate-[scan_2.2s_ease-in-out] bg-gradient-to-b from-rose-400/0 via-rose-400/40 to-rose-400/0" style={{ height: 60 }} />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="flex items-center gap-2 rounded-full bg-paper/90 px-4 py-2 text-sm font-medium text-rose-600 shadow-lg">
                    <ScanLine className="h-4 w-4 animate-pulse" /> Analysing…
                  </div>
                </div>
              </div>
            )}
          </div>

          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />

          {/* controls */}
          {phase === "idle" && (
            <>
              <Button className="mt-4 w-full" onClick={() => fileRef.current?.click()}>
                <Upload className="h-4 w-4" /> Choose photo
              </Button>
              <p className="mb-2 mt-4 text-center text-xs text-plum-400">…or try a sample</p>
              <div className="grid grid-cols-4 gap-2">
                {SAMPLE_ARTS.map((a) => (
                  <button
                    key={a}
                    onClick={() => pickSample(a)}
                    className="grid place-items-center rounded-xl border border-blush-200 bg-paper p-2 transition-all hover:-translate-y-0.5 hover:border-rose-300"
                  >
                    <FloraArt art={a} className="h-10 w-10" />
                  </button>
                ))}
              </div>
            </>
          )}

          {phase === "ready" && (
            <div className="mt-4 flex gap-2">
              <Button className="flex-1" onClick={runScan}>
                <Sparkles className="h-4 w-4" /> Run demo scan
              </Button>
              <Button variant="outline" onClick={reset}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          )}

          {phase === "scanning" && (
            <Button className="mt-4 w-full" disabled>
              <ScanLine className="h-4 w-4 animate-pulse" /> Scanning…
            </Button>
          )}

          {phase === "result" && (
            <Button variant="outline" className="mt-4 w-full" onClick={reset}>
              <RefreshCw className="h-4 w-4" /> Scan another
            </Button>
          )}
        </Card>

        {/* result panel */}
        <Card className="p-6">
          {phase !== "result" || !result ? (
            <div className="grid h-full min-h-[300px] place-items-center text-center text-plum-400">
              <div>
                <ScanLine className="mx-auto h-8 w-8 text-blush-300" />
                <p className="mt-3 text-sm">Your demo scan results will appear here.</p>
              </div>
            </div>
          ) : (
            <ResultView result={result} />
          )}
        </Card>
      </div>

      <p className="mt-6 rounded-2xl border border-blush-200 bg-blush-50/60 px-4 py-3 text-center text-xs text-plum-500">
        ⚠️ <strong>Demo notice:</strong> results are randomly selected from mock
        data to illustrate the experience. No image leaves your browser and no AI
        model is called.
      </p>

      <style>{`@keyframes scan { 0%{transform:translateY(0)} 50%{transform:translateY(360%)} 100%{transform:translateY(0)} }`}</style>
    </div>
  );
}

function ResultView({ result }: { result: AiScanResult }) {
  const status = result.status;
  const health = status === "thriving" ? 88 : status === "okay" ? 66 : 42;
  return (
    <div className="animate-rise">
      <div className="flex items-center gap-4">
        <PlantAvatar art="monstera" status={status} size="md" />
        <div>
          <Badge variant={status}>{STATUS_LABEL[statusFromHealth(health)]}</Badge>
          <h2 className="mt-1 font-display text-2xl text-plum-900">{result.verdict}</h2>
          <p className="text-xs text-plum-400">Confidence {result.confidence}% · simulated</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {result.highlights.map((h) => {
          const t = TONE_STYLE[h.tone];
          const Icon = t.icon;
          return (
            <div key={h.label} className="rounded-xl border border-blush-200/70 bg-paper p-3">
              <div className="flex items-center justify-between">
                <span className="text-[0.65rem] uppercase tracking-wide text-plum-400">{h.label}</span>
                <span className={cn("grid h-5 w-5 place-items-center rounded-full", t.cls)}>
                  <Icon className="h-3 w-3" />
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-plum-800">{h.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-rose-500">
          Recommended care
        </h3>
        <ul className="space-y-2">
          {result.recommendations.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-plum-600">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blush-100 text-rose-500">
                <Check className="h-3 w-3" />
              </span>
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
