# Plant Health Monitoring — Design Spec

**Status:** Approved design, ready for implementation planning
**Date:** 2026-07-02
**Scope:** The plant health monitoring subsystem of FloraStudio. The garden
design / screenshot subsystem is a separate spec and is out of scope here.

---

## 1. Summary

Users photograph a plant; FloraStudio returns a health score, a plain-language
diagnosis, and concrete care actions. Diagnosis is owned and runs on-device; an
LLM-based **Plant Carer Agent** reasons about the result and advises; a data
flywheel improves both the health model and the care recommender over time.

The design reconciles a hard requirement ("custom ML/DL is a must") with
practical reality: sensor-based ML is a dead end (users won't log sensor data),
but image-based ML is viable because a user can always take a photo.

**Architecture in one line:** Model A (on-device health CNN) → Plant Carer Agent
(tool-calling LLM) → data flywheel feeding both Model A and a rules-first care
recommender.

---

## 2. Goals & non-goals

### Goals
- A B2C-grade health check that works on real users' ornamental garden plants,
  not just lab images.
- An owned, on-device diagnosis model (satisfies the "custom ML is a must"
  requirement; keeps marginal inference cost ≈ $0).
- Plain-language, actionable, weather-aware advice for a non-technical audience.
- A self-improving system: user photos and logged care actions become training
  data.

### Non-goals (YAGNI — keep this spec focused)
- **Model B (trained care recommender):** stays rules-based until the flywheel
  produces enough (action → outcome) data. Not trained in this spec.
- **Species identification model:** out. The user tells us the plant, or we
  infer it from the curated catalog.
- **Sensor / IoT hardware integration:** excluded (cold-start data problem).
- **Garden design / screenshot subsystem:** its own separate spec.
- **Checkout / payments / billing:** separate. (A profitability model informs
  pricing but is not built here.)

---

## 3. Architecture & data flow

```
User taps a plant → takes / uploads photo
        │
        ▼
[Model A: on-device CNN]  → health class + confidence
        │                    {healthy | stressed | diseased}
        ▼
[Plant Carer Agent (LLM, backend)] — decides which tools to call:
   - run_health_model(photo)      → Model A result (cheap, instant)
   - view_image(photo)            → agent looks itself (esp. low confidence)
   - get_care_recommendation(...) → concrete action (e.g. "~250 ml water")
   - get_weather(location)        → Open-Meteo, keyless
   - get_plant_profile(species)   → care baseline from curated catalog
        │
        ▼
   Diagnosis + plain-language advice + 2–3 next actions
        │
        ▼
User performs action → taps existing care button (💧/☀️/fertilize)
        │
        ▼
[Data flywheel] stores photo + model output + feedback + (action → outcome)
   → periodic human-in-the-loop labeling → retrain → new on-device weights
```

**Key properties**
- Diagnosis authority stays with the owned system (Model A + agent), never a
  silent third party.
- On-device inference is free/instant/private/offline for the common case; the
  backend is touched for the agent and flywheel storage.
- The care buttons that already exist in the app double as the training-data
  capture mechanism.

---

## 4. Component: Model A — on-device vision health classifier

- **Task:** single-image classification → `{healthy, stressed, diseased}` +
  confidence.
- **Model:** transfer learning on a mobile-friendly backbone (MobileNetV3 or
  EfficientNet-Lite, ImageNet-pretrained). Freeze base → train 3-class head →
  fine-tune top layers. Quantized to a few MB.
- **Serving:** in-browser via TensorFlow.js or ONNX Runtime Web. Shipped as a
  static asset the app loads once and caches. Training happens offline
  (Python / Colab / Kaggle GPU); weights are exported to TF.js/ONNX.
- **Data strategy (make-or-break):**
  - **Base:** public disease datasets (PlantVillage + field-realistic PlantDoc)
    **relabeled** into the 3 classes via a mapping table (many disease labels →
    `diseased`; healthy → `healthy`; ambiguous/early-symptom → `stressed`).
  - **Domain-gap closer:** a few hundred self-collected, labeled real-garden
    photos (including the target user's garden) mixed in. This is what makes it
    work on real users rather than lab leaves.
  - **Augmentation:** random crop / rotate / brightness / background swap to
    harden against messy real-world photos.
- **Output → UX mapping:** confidence → health score 0–100 (e.g. `healthy@0.9 →
  ~90`, `diseased@0.9 → ~15`), feeding the existing health bars.
- **Confidence gate:** below threshold (start ~0.6) the agent is expected to
  `view_image` itself rather than surface a low-confidence number as fact.

---

## 5. Component: Plant Carer Agent (LLM)

An LLM agent with tool-calling. It decides what it needs rather than following a
rigid pipeline.

| Tool | Purpose |
|------|---------|
| `run_health_model(photo)` | On-device CNN result (cheap, instant). |
| `view_image(photo)` | Agent inspects the photo directly — used when Model A is unsure or detail is needed. This is the "LLM diagnostic fallback," now agent-controlled. |
| `get_care_recommendation(plant, health, weather)` | Concrete action (e.g. watering amount). Rules-first initially. |
| `get_weather(location)` | Open-Meteo (keyless) grounding — e.g. "skip watering, rain's coming." |
| `get_plant_profile(species)` | Species care baseline from the curated catalog. |

**Design decisions**
- **On-device first, agent for reasoning.** The CNN runs automatically and
  instantly on a new photo (free). The agent is invoked for reasoning/advice and
  pulls tools as needed — avoiding an LLM call on every UI tap (cost, latency,
  nondeterminism matter for a non-technical, possibly older audience).
- **Diagnosis reconciliation:** per photo, either Model A (high confidence) or
  the agent's own `view_image` (low confidence) is authoritative — they never
  disagree on screen.
- **Structured output:** the agent returns a fixed JSON shape (`diagnosis`,
  `confidence`, `summary`, `actions[]`, optional `see_a_pro`) so the UI renders
  consistently — no walls of text.
- **Scope guardrail:** system prompt constrains the agent to plant care; when
  genuinely unsure it recommends a local nursery rather than inventing a fix.
- **Model choice:** a current vision-capable model via the Vercel AI Gateway
  (`provider/model` string) so providers can be swapped without code changes.

**The closed loop (core value):**
```
Agent: "This rose looks thirsty — add ~250 ml water."
  → user waters, taps the existing 💧 Water button
  → health bar goes up
  → (action taken, health change) is logged
  → data trains the care recommender over time
```

**Care recommender cold-start:** on day one there is no (action → outcome) data.
The recommender **starts rules-based** — a species-keyed care table
(`rose → 200–300 ml, 2×/week, full sun`) — and the closed loop accumulates real
outcome data until an ML model genuinely beats the rules. This is "Model B,"
deferred until it can be fed.

---

## 6. Component: Data flywheel

**Captured (all tied to a plant + timestamp):**
- **Health photos** + Model A output + agent's final diagnosis + one-tap
  "was this right?" → labels to retrain **Model A**.
- **Care actions** logged via existing buttons + subsequent health-bar change →
  (action → outcome) pairs to eventually train the **care recommender** and to
  grade the rules.
- **Low-confidence / agent-viewed photos** flagged **priority-for-labeling** —
  where Model A is weakest, worth human review first.

**Flow:**
```
capture → store (photo + metadata + feedback) → human-in-the-loop labeling of
the priority queue → retrain → export new on-device weights → app auto-updates
model → fewer low-confidence hits → less LLM cost → repeat
```

**Infra (the Phase-2 backend):** object storage for photos, a small DB for
events/feedback/care logs, an auth/account layer (persists per-plant history —
also unlocks the README's "long-term plant history"), and an offline training
job. On Vercel: Blob (photos) + a Marketplace Postgres (events) + a
background/cron retraining trigger.

**Privacy (B2C trust):** capturing photos requires explicit **opt-in consent**
and a clear, plain-language policy surfaced in onboarding — not buried in ToS.

**Guardrail:** the flywheel only improves things if labels are trustworthy;
human-in-the-loop review of the priority queue is non-optional.

---

## 7. Integration into the existing app

- **Photo health-check screen** (currently mock AI, screen #8) becomes the real
  capture → Model A → agent flow.
- **Plant detail view** (screen #7) renders the health score and agent advice;
  the care timeline becomes the flywheel's care-action log.
- **Care buttons** (💧/☀️/fertilize) already exist — they now double as
  (action → outcome) data capture.
- **New:** an account/auth layer so a plant's photo + care history persists per
  user.

This subsystem introduces a **backend + storage layer** for the first time,
which is a deliberate step beyond the current frontend-only Phase 1 prototype.

---

## 8. Phasing

- **Phase 2a — Owned diagnosis, on-device.** Train Model A, ship it in-browser,
  show real health score + confidence gate. No backend yet; advice stubbed with
  rules. Replaces the mock; demoable on its own.
- **Phase 2b — Plant Carer Agent.** Add backend, wire the LLM agent + tools
  (view_image, weather, care rules). Real advice + agent-controlled image
  inspection.
- **Phase 2c — Flywheel.** Add storage, consent/onboarding, feedback capture,
  human-in-the-loop labeling, retraining job. The self-improving loop.

---

## 9. Evaluation & success metrics

**Model A (offline, pre-ship):**
- Accuracy + per-class recall on a hold-out set, and separately on a real-garden
  test set (the honest number).
- Priority: recall on `diseased` (missing a sick plant is worse than a false
  alarm).
- Calibration: does confidence 0.8 mean ~80% correct? Validates the gate
  threshold.

**System (production):**
- **Fallback rate** (% photos the agent has to `view_image`) — should decay over
  time; it is both the flywheel-health metric and the dominant cost driver.
- **Advice usefulness:** one-tap "was this right?" acceptance rate.
- **Closed-loop signal:** after users follow advice + log the action, does the
  health bar trend up?
- **Cost/user:** average vision-LLM spend per active user per month (feeds the
  profitability model).

**Success =** users trust the health score, follow the advice, plants improve,
and the fallback rate (cost) falls as the model learns.

---

## 10. Cost model notes (for the separate profitability analysis)

- On-device inference ≈ $0 per photo for the common case.
- The **vision-LLM `view_image` calls are the dominant variable cost**, incurred
  only on the low-confidence tail, and **shrink as the flywheel improves Model
  A** — so gross margin improves over time.
- Other costs: object storage (per-GB), weather API (free — Open-Meteo), one-off
  training compute, fixed infra, and human-in-the-loop labeling.
- A dedicated profitability/unit-economics model (pricing tiers, trial design,
  ARPU, LTV:CAC, break-even, scenarios) is tracked separately and should treat
  the decaying fallback rate as a first-class input.
