# Autonomous `/goal` Run — Paste-In Prompt

Start a fresh session in the `mp-florastudio` repo and paste the block below
after `/goal`. It makes the agent execute Phase 2a end-to-end, autonomously,
logging every technical decision.

> **Note on `/goal`:** if your setup uses a different non-stop/agentic command,
> paste the same block after that command. The prompt is self-contained.

---

```
You are the lead engineer for FloraStudio, a B2C plant-care app for
NON-TECHNICAL users. You have full authority over technical decisions this
session. Work autonomously and continuously until the stop conditions are met.

FIRST, read these in order (do not skip):
1. CONTEXT.md
2. AGENTS.md  (this is NOT the Next.js you know — before editing anything under
   app/, read the relevant guide in node_modules/next/dist/docs/)
3. docs/superpowers/specs/2026-07-02-plant-health-monitoring-design.md
4. docs/superpowers/plans/2026-07-02-plant-health-phase-2a.md
5. docs/DECISIONS.md

YOUR GOAL: Implement the Phase 2a plan task-by-task, top to bottom, producing a
working, tested on-device plant-health photo check that runs against the stub
model. Everything the plan marks as a manual GPU/human step (dataset download,
real training, real export) you DO NOT attempt — instead build all the code
around it and leave a clearly labeled `TODO(human-gpu):` note plus a short
`ml/RUN_TRAINING.md` with the exact 4 commands to run on a GPU.

HOW TO WORK:
- Follow strict TDD per the plan: write the failing test, run it and confirm it
  fails, write minimal code, run it and confirm it passes, commit. One task at a
  time. Do not batch away the test steps.
- Run the actual test commands and paste real output into your reasoning. NEVER
  claim a test passed without running it. If something fails, debug it before
  moving on — do not proceed on a red suite.
- Commit after every major change, using Conventional Commit format
  (feat:, fix:, refactor:, test:, chore:, docs:). Prefer the message from the
  plan where one is given. Commit frequently — at least once per task.
- You are already on branch feat/vietnamese-i18n; keep working there unless the
  repo is on main, in which case create a branch first.
- Stay strictly in Phase 2a scope. Do NOT start the Plant Carer Agent (2b), the
  backend, or the flywheel (2c). Do NOT touch the garden-design subsystem.
- Respect all Global Constraints in the plan, especially the model I/O contract,
  the 0.6 confidence gate, and the shared health-score formula (Python and TS
  must stay byte-for-byte equivalent in behavior — the parity tests enforce it).

DECISION LOGGING (required):
- For every non-trivial technical decision you make that ISN'T already dictated
  by the plan (a library choice, a fallback behavior, an interface shape, a
  tradeoff), append an entry to docs/DECISIONS.md using the template there:
  What / Why / B2C impact / Refs(commit+files). Newest first in the
  "Implementation decisions" section. Be honest about guesses and tradeoffs.
- Judge every choice against two questions and record the answer: (a) does it
  keep the experience dead-simple for a non-technical user, and (b) does it help
  unit economics / willingness to pay. If a choice fails both, reconsider it.

GUARDRAILS:
- Never fabricate a trained model, fake accuracy numbers, or claim GPU training
  happened. The stub model is explicitly untrained; say so wherever relevant.
- Do not commit datasets or large binaries. The quantized stub/real web model
  under public/models/health-v1/ is the only model artifact committed.
- Keep the honest "uncertain" UX — a low-confidence or errored result must show
  "not sure", never a fake confident diagnosis.
- If you hit a genuine blocker you cannot resolve (missing dependency that won't
  install, an ambiguous requirement not covered by spec/plan), record it in
  docs/DECISIONS.md as an OPEN QUESTION entry, implement the most reasonable
  default, and keep going.

STOP CONDITIONS (stop and write a summary when ALL are true):
- Every task B1–B6 and A1–A5 is implemented and its tests pass (npm test and
  cd ml && python -m pytest both green).
- `npx tsc --noEmit` is clean.
- The stub model exists at public/models/health-v1/ and `npm run dev` serves the
  photo-check screen; uploading a photo produces a score+confidence (from the
  untrained stub) with no console errors, and samples still show the demo mock.
- docs/DECISIONS.md has an entry for every implementation decision you made.
- ml/RUN_TRAINING.md documents the human GPU steps.

IF TIME REMAINS AFTER 2A: you may do ONLY the "safe prep" listed in
docs/superpowers/specs/PHASE-2B-DIRECTION.md (pure types, the rules-based care
table + tests, a keyless Open-Meteo client + tests, drafting the agent system
prompt as a file). You MUST NOT, without founder sign-off, add auth, provision
any database/storage, call or configure a paid LLM, deploy a backend, or store
any user photo/PII. If you reach any of those, STOP and record an OPEN QUESTION
in docs/DECISIONS.md. Do not start real Phase 2b implementation.

FINAL OUTPUT: a concise summary of what you built, the test results (real
output), the list of decisions you logged (titles), and the exact next steps for
the human (GPU training + Phase 2b kickoff).
```

---

## After the run — how to review

1. Skim `docs/DECISIONS.md` "Implementation decisions" — each should tie back to
   non-tech UX and/or profit. Push back on any that don't.
2. `git log --oneline` — expect one commit per plan task.
3. `npm test` and `cd ml && python -m pytest` — should be green.
4. `npm run dev` → `/en/plants/demo/photo-check` → upload a photo → confirm the
   real (stub-powered) inference path renders.
5. When you have a GPU, follow `ml/RUN_TRAINING.md`, drop the real export into
   `public/models/health-v1/`, and re-verify.
6. Then start Phase 2b: brainstorm → spec → plan for the Plant Carer Agent.
