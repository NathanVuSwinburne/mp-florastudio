# Phase 2b — Plant Carer Agent: Direction (pre-spec)

> **Status:** DIRECTION ONLY — not an approved spec, not a build plan.
> Phase 2b needs its own brainstorm → spec → plan cycle before implementation,
> because it introduces paid LLM spend, user accounts/PII, and data storage —
> product/business decisions the founder must make, not an autonomous agent.

## What Phase 2b is

Turn the on-device health result (Phase 2a) into genuine, useful guidance via a
tool-calling **Plant Carer Agent**, backed by the app's first server layer.

## Already decided (from the approved spec — carry forward, don't relitigate)

- The LLM is an **agent with tools**, not a fixed pipeline. Tools:
  `run_health_model`, `view_image`, `get_care_recommendation`, `get_weather`,
  `get_plant_profile`.
- **On-device first:** the CNN runs automatically on a new photo (free); the
  agent is invoked for reasoning/advice, not on every UI tap.
- **Diagnosis authority stays with the owned system.** High confidence → Model A.
  Low confidence → the agent's own `view_image`. One judge per photo.
- **Structured JSON output** (`diagnosis`, `confidence`, `summary`, `actions[]`,
  optional `see_a_pro`) so the UI stays simple for non-tech users.
- **Care recommender is rules-first** — a species-keyed care table — ML deferred.
- **Weather-aware** via Open-Meteo (keyless).
- **Model access via Vercel AI Gateway** (`provider/model` string) so providers
  swap without code changes.

## Open decisions — REQUIRE a brainstorm + founder sign-off before building

These are the reason 2b can't be auto-built overnight. Each has cost, privacy,
or lock-in consequences:

1. **LLM provider + model + spend caps.** Which vision-capable model via the AI
   Gateway? What per-request and monthly budget ceiling? Fallback rate assumption
   feeds the profitability model — decide the cost envelope first.
2. **Auth provider.** Accounts are needed to persist per-plant history. Clerk
   (native Vercel Marketplace) vs. alternatives — a pricing + UX decision.
3. **Storage.** Photos (Vercel Blob — public vs private?) and events/care logs
   (a Marketplace Postgres, e.g. Neon). Data residency / retention policy.
4. **Consent + privacy copy.** Exact opt-in flow and policy wording (ties to
   flywheel D-009). Legal-adjacent — founder must approve.
5. **Care-rules data source + schema.** Where does the species care table come
   from (curated from Perenual/Trefle vs. hand-authored), and what's its shape?
6. **Agent runtime + streaming.** Vercel Functions (Fluid Compute) endpoint
   shape; whether advice streams to the client; timeout/retry behavior.
7. **Cost-control mechanics.** How the confidence gate + rate limits + caching
   keep the paid `view_image` calls on the low-confidence tail only.

## What the overnight agent MAY do if it finishes 2a early (safe prep only)

Non-committal groundwork that spends no money and stores no user data:

- Define the **TypeScript interfaces** for the agent's structured output and each
  tool's input/output types (pure types, no implementations, unit-tested shape).
- Author the **rules-based care table** as static JSON for a handful of common
  plants + a pure `getCareRecommendation(plant, status)` function with tests.
- Wire a **local Open-Meteo client** (keyless, read-only) with tests.
- Draft (not send) the **agent system prompt** and the JSON schema as files.

The agent MUST NOT, without founder sign-off: add an auth provider, provision any
database/storage, call or configure a paid LLM, deploy a backend endpoint, or add
any flow that stores user photos/PII. If it reaches these, it stops and records
an OPEN QUESTION in `docs/DECISIONS.md`.

## Next step for the founder

When ready for 2b, start a brainstorm session on the seven open decisions above
(the AskUserQuestion flow), produce `docs/superpowers/specs/<date>-plant-carer-agent-design.md`,
then a Phase 2b plan — same spec → plan → execute rhythm as 2a.
