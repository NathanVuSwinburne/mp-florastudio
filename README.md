# 🌸 MP FloraStudio

> **Design your dream garden from a photo** — a no-code visual studio for gardens
> and home spaces, paired with a cosy, game-like plant care companion.

MP FloraStudio lets you start from a photo of your real space (garden, balcony,
backyard, courtyard, living room or indoor corner), drag in plants, flowers,
pots, statues, vines, lighting, furniture and decor — then care for the living
plants you brought to life.

**Aesthetic:** _Canva meets a refined pink flower garden studio_ — blush & rose,
ivory whitespace, delicate floral line-art, soft shadows, and gentle
micro-interactions, built for people who want their home to feel beautiful.

---

## ⚠️ This is Phase 1 — frontend only

This repository is a **frontend-only demo prototype**. It is intentionally
self-contained and proves the product idea visually.

There is **no backend**. Specifically, this phase does **not** include:

- ❌ Authentication / accounts
- ❌ Database or persistence (state is in-memory / `sessionStorage` only)
- ❌ Real API routes or server actions
- ❌ Prisma / Supabase
- ❌ Real AI/ML — the “Demo AI scan” is simulated from mock data

Everything you see runs in the browser using **local React state** and
**mock data**. All imagery is hand-crafted inline **SVG** + CSS gradients, so
the app builds cleanly and works fully offline.

---

## ✨ Features

### 1. No-code visual design editor (`/design/demo/editor`)
A Canva-like editor for your space:

- 🔍 **Search** components & **browse** 12 categories
- ➕ **Add** components to the canvas with a click
- ✋ **Drag**, ↔️ **resize**, 🔄 **rotate** (powered by `react-rnd`)
- 📑 **Duplicate** & 🗑️ **delete** pieces
- 🔭 **Zoom** the canvas (50%–200%)
- 🎚️ Live **properties panel** (size, rotation, opacity, flip, layering)
- 🖼️ Swap the **background space**, then **preview** the finished design

Categories: Flowers · Plants · Pots · Vines · Stones · Statues · Lighting ·
Benches · Outdoor furniture · Indoor furniture · Wall decor · Living room decor.

### 2. Cute, game-like plant health monitor (`/plants`)
Care for your plants like a cosy game:

- 🪴 Plant cards with cute avatar, name, **level**, **health score** & **value**
- 📊 Stats: hydration, sunlight, fertiliser, growth, leaf colour, stress
- 🟢 Status: **thriving / okay / needs care**
- 💧☀️🌱🌫️ One-tap care: **Water · Give sunlight · Fertilise · Mist leaves**
- ✨ Delightful feedback: water droplets, sunlight glow, sparkles, mist, level-ups
- 🌿 Overall **garden health** ring + register new plants

### 3. Demo AI photo health check (`/plants/demo/photo-check`)
- 📸 Mock upload / take-photo UI with **local image preview**
- 🔎 Simulated scan animation → **fake “Demo AI scan” result**
- 🏷️ Clearly labelled as **mock / demo** — nothing leaves your browser

---

## 🗺️ Routes

| Route | Page |
| --- | --- |
| `/` | Landing page |
| `/dashboard` | Saved designs + plant care summary |
| `/design/new` | New design setup (space, photo, style, budget…) |
| `/design/demo/editor` | The visual design editor |
| `/design/demo/preview` | Final design preview + shopping list |
| `/plants` | Plant monitor (garden) |
| `/plants/demo` | Plant detail + care timeline |
| `/plants/demo/photo-check` | Demo AI photo health check |

---

## 🧰 Tech stack

- **Next.js (App Router)** + **TypeScript**
- **Tailwind CSS v4** (CSS-first `@theme` design tokens)
- **shadcn/ui-style** primitives on **Radix UI**
- **lucide-react** icons
- **react-rnd** for drag / resize in the editor
- **sonner** for toasts
- Local React state + mock data (no backend)

---

## 🚀 Run locally

```bash
# 1. install
npm install

# 2. start the dev server
npm run dev
# open http://localhost:3000

# 3. production build (also used by Vercel)
npm run build
npm start
```

Requires Node 18.18+ (developed on Node 24).

---

## ▲ Deploy on Vercel

This project is Vercel-ready out of the box — it's a standard Next.js app with
no environment variables, no database and no server dependencies.

1. Push this repo to GitHub (already at
   `github.com/NathanVuSwinburne/mp-florastudio`).
2. In [Vercel](https://vercel.com/new), **Import** the repository.
3. Framework preset: **Next.js** (auto-detected). No env vars needed.
4. Click **Deploy** — every route is statically prerendered.

Or with the CLI:

```bash
npm i -g vercel
vercel        # preview
vercel --prod # production
```

---

## 📁 Project structure

```
app/
  layout.tsx                  # fonts, metadata, toaster
  page.tsx                    # landing
  dashboard/page.tsx
  design/new/page.tsx
  design/demo/editor/page.tsx
  design/demo/preview/page.tsx
  plants/page.tsx
  plants/demo/page.tsx
  plants/demo/photo-check/page.tsx
components/
  ui/                         # shadcn-style primitives (button, card, slider…)
  layout/                     # header, footer, page shell
  landing/                    # hero editor mockup
  editor/                     # editor studio, canvas item, library, properties
  plants/                     # plant card, detail, stats, care, photo check
  flora-art.tsx               # all inline SVG illustrations
  decorations.tsx             # floral divider, vine corners, petals
  brand.tsx                   # logo + flower mark
lib/
  types.ts                    # shared types
  care.ts                     # plant care logic
  canvas.ts                   # canvas constants
  utils.ts                    # cn, currency, clamp
  mock/                       # components, spaces, projects, plants, aiScans
```

---

## 🔭 Future backend plan (not in this phase)

Phase 1 deliberately stops at the frontend. A future phase could add:

- 🔐 **Auth & accounts** (e.g. Auth.js) so designs and gardens persist per user
- 🗄️ **Database** (Postgres + an ORM) for projects, components, plants & care logs
- 🔌 **API routes / server actions** for CRUD and saving designs
- 🤖 **Real AI plant health** — replace the mock scan with an actual vision model
- 🛒 **Real catalogue & checkout** for the shopping list
- ⏰ Care reminders / notifications and growth history over time

---

_MP FloraStudio · Phase 1 frontend demo · all data is mock._
