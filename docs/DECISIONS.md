# FloraStudio — Technical Decision Log

Every entry answers three things: **What** was decided/implemented, **Why**
(technical reasoning), and **B2C impact** (how it serves our non-technical
users and/or the ability to make profit).

> **Autonomous agent:** append a new entry for every non-trivial technical
> decision you make while implementing. Use the template at the bottom. Keep the
> newest at the top of the "Implementation decisions" section. Be honest — if a
> decision is a tradeoff or a guess, say so.

---

## Product-shaping decisions (made during design, 2026-07-02)

### D-001 — Image-based ML, not sensor-based
- **What:** The custom ML operates on plant photos, not soil/moisture sensor data.
- **Why:** Sensor ML has a fatal cold-start — users won't own or log sensors, so
  there's no training data and no runtime input. A photo is always available.
- **B2C impact:** Zero hardware barrier for a non-tech audience; anyone with a
  phone camera is a paying-capable user on day one. Bigger addressable market,
  lower activation friction.

### D-002 — Diagnosis runs on-device (TensorFlow.js), not server-side
- **What:** Model A inference happens in the browser.
- **Why:** The common-case inference then costs us ~$0, runs instantly, works
  offline, and keeps photos private (they never need to leave the device for a
  basic result).
- **B2C impact:** Near-zero marginal COGS on the most frequent action → protects
  gross margin as usage scales; privacy + speed build trust with cautious,
  non-technical users. Directly improves unit economics.

### D-003 — 3-class health output (healthy / stressed / diseased) + confidence
- **What:** Model A predicts a coarse health class, mapped to a 0–100 score.
- **Why:** Coarse classes are far easier to train reliably than fine-grained
  disease labels and are robust to the crop-vs-ornamental domain gap. Transfer
  learning needs only hundreds–thousands of images, not millions.
- **B2C impact:** Ships a trustworthy result sooner; a simple "score + status"
  is legible to non-tech users (matches the existing health bars). Faster path
  to a sellable product.

### D-004 — Confidence gate with an honest "uncertain" state (threshold 0.6)
- **What:** Below 0.6 confidence we show "not sure — here's what to check"
  instead of a number.
- **Why:** A young model is sometimes wrong; surfacing a confident-but-wrong
  diagnosis destroys trust faster than admitting uncertainty.
- **B2C impact:** Protects long-term trust and retention — the thing that makes
  LTV (and therefore profit) possible — over a short-term illusion of accuracy.

### D-005 — LLM as a tool-calling "Plant Carer Agent", not a fixed pipeline
- **What:** The LLM decides which tools to call (run model, view image, get care
  rules, get weather, get plant profile) rather than following a hard-coded flow.
- **Why:** Flexible orchestration handles the messy real world; the same agent
  covers both advice-writing and the low-confidence image fallback.
- **B2C impact:** Feels like a knowledgeable helper, not a form — the product's
  differentiation and a reason to pay, beyond a raw classifier anyone could clone.

### D-006 — Owned model keeps diagnosis authority; LLM only writes/falls back
- **What:** High confidence → Model A is the diagnosis. Low confidence → the
  agent inspects the image itself. Only one judge per photo.
- **Why:** Avoids "two AIs disagree on screen" and keeps a single source of truth.
- **B2C impact:** Consistent, confident UX for non-tech users; the paid LLM
  vision call is incurred only on the low-confidence tail (cost control).

### D-007 — Care recommender starts rules-based, becomes ML later
- **What:** "How much water / sun / feed" comes from a species care table first;
  an ML model is deferred until the flywheel has (action→outcome) data.
- **Why:** Same cold-start discipline as D-001 — don't train a model you can't
  yet feed. Rules are reliable and shippable immediately.
- **B2C impact:** Users get useful, specific advice on day one; we avoid burning
  effort on an unfeedable model. Value now, ML rigor later.

### D-008 — Data flywheel is the moat (photos + feedback + care outcomes → retrain)
- **What:** Every photo, one-tap "was this right?", and logged care action + its
  health outcome becomes training data; low-confidence photos are prioritized
  for labeling. The **existing care buttons are the capture mechanism.**
- **Why:** The launch model isn't defensible; a compounding data advantage is.
  The fallback rate (and thus LLM cost) decays as the model learns.
- **B2C impact:** Accuracy improves exactly where real users point their cameras,
  and variable cost falls over time → gross margin *rises* with scale. This is
  the core profit-and-defensibility engine.

### D-009 — Explicit photo-capture consent in onboarding
- **What:** Opt-in consent + plain-language policy shown up front, not buried.
- **Why:** The flywheel stores user photos; trust and legal footing require it.
- **B2C impact:** Non-tech users (and app stores/regulators) need to feel safe;
  trust is a precondition for the photo volume the flywheel needs.

### D-010 — Cost model: on-device is ~free; vision-LLM is the decaying variable cost
- **What:** COGS is dominated by low-confidence vision-LLM calls, which shrink as
  the flywheel improves Model A. Profitability model must treat the fallback rate
  as a first-class, decaying input.
- **Why:** Generic SaaS cost math would misprice this; our margins improve over
  time rather than staying flat.
- **B2C impact:** Enables sustainable pricing and improving margins — the basis
  for the separate profitability analysis (pricing tiers, trials, LTV:CAC).

---

## Implementation decisions (agent appends below, newest first)

<!-- Copy this template for each new decision:

### D-0NN — <short title>
- **What:** <what you implemented / chose>
- **Why:** <technical reasoning; note tradeoffs or guesses honestly>
- **B2C impact:** <how it serves non-tech users and/or profit/unit economics>
- **Refs:** <commit hash(es), files, plan task>

-->

_(none yet — first autonomous run will add entries here)_
