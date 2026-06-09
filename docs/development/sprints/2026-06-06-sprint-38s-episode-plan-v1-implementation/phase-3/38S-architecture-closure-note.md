# Sprint 38S Architecture Closure Note

**Date:** 2026-06-08  
**Status:** **CLOSED — architecture tranche complete**  
**Authority:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) · [38S-continuation-handover-pack.md](38S-continuation-handover-pack.md)  
**Supersedes for architecture status:** [phase-2/38S-handover-pack.md](../phase-2/38S-handover-pack.md) (harness-era handover)  
**Complements:** [observations/38S-6-sprint-closure.md](../observations/38S-6-sprint-closure.md) (harness SC-1–SC-9 closure)

---

## Executive Summary

Sprint 38S implemented **Episode Plan V1** as a first-class planning step in the Prism learning-design pipeline and hardened the frozen chain:

```text
KM → LO → Design Episode Plan → DLA → GAM → Design Page → Render
```

The sprint’s purpose was not to redesign instructional pedagogy or expand the Episode Plan schema. It was to **prove that a minimal planning abstraction** — archetype plus ordered function beats — can gate DLA population, preserve obligation fidelity through GAM realisation, and compose to Page without collapsing the 38M–38P fidelity programme.

**Final outcome:** Architecture delivered, validated, and frozen. Episode Plan **plans**. DLA **populates**. GAM **realises**. Page **composes and renders**. Harness gates remain green after Page Rendering Phase A and GAM Cleanup Wave A. Prompt sediment reduced on DLA and GAM packs without contract removal. Remaining work is **optimisation and teaching-quality programme** — not architecture relitigation.

**Recommendation: Sprint 38S CLOSED.**

---

## Architecture Delivered

### Episode Plan V1 implementation

- First-class workflow step `step_design_episode_plan` registered between LO and DLA.
- Frozen V1 container: `activity_id` + `episode_plan { archetype, beats[{ function }] }`.
- Deterministic derive path (`deriveEpisodePlansFromLearningOutcomes`) and `validateEpisodePlansContainerV1()` gate.
- Invalid captures replaced at sync via `applyEpisodePlanCaptureCanonicalEnforcement()`.
- **Evidence:** [observations/38S-first-class-episode-plan-step.md](../observations/38S-first-class-episode-plan-step.md) · `lib/episode-plan-v1-templates.js` · `lib/episode-plan-v1-validation.js`

### Episode Plan ownership model

| Owner | Responsibility | Must not |
|-------|----------------|----------|
| **Episode Plan** | Archetype selection and ordered function beats per LO | Author material types, obligations, or bodies |

Beat order is pedagogically authoritative. Material types and obligations are **downstream of planning**, not in the plan schema.

### DLA population-only contract

- DLA is **obligation population only** — no archetype replanning, no `replan function_sequence`.
- `OBLIGATION POPULATION (38S)` block consolidates depth and emission gates (IFP-04/05/06 + DLA-WB-26..31 semantics).
- Beat → obligation merge via `lib/episode-plan-population-contract.js` and `lib/episode-plan-dla-integration.js`.
- `instructional_function` and `plan_beat_index` tagging on `required_materials`.
- **Final pack sanitisation:** combined DLA prompt **27,119 → 13,983 chars (−48%)** (`artefacts/EV-38S-final-dla-prompt-metrics.json`).

### PF-11 remediation

Three root causes diagnosed and addressed:

| # | Issue | Fix |
|---|-------|-----|
| 1 | Stale `local_override` prompts bypass sanitised packs | `isStaleCatalogSeededStepOverride()` detection; user reseed required |
| 2 | Episode-plan JSON block dedup false positive on DLA Copy | Dedup anchor `/### Upstream episode_plans/i`; copy diagnostic |
| 3 | Invalid / non-V1 episode-plan captures | V1 enforcement + derive replacement at capture sync |

**Evidence:** [phase-2/38S-pf11-dla-upstream-resolution-fix.md](../phase-2/38S-pf11-dla-upstream-resolution-fix.md) · [phase-2/38S-episode-plan-dla-chaining-fix.md](../phase-2/38S-episode-plan-dla-chaining-fix.md) · `tests/workflow-ld-episode-plan-step.test.js`

### Workflow chaining hardening

- Authoritative upstream JSON injection for DLA population (`applyEpisodePlanDlaPopulationPromptBlockToDraft`).
- Strict fenced JSON capture for KM/LS/LO/EP; STEP footer stripping.
- PF-11 guard and copy diagnostics on manual workflow path.
- Additive DLA merge (v38S-R1) preserves 38L depth rows on one merged artefact.

### DLA sanitisation

- Phase 2A: removed superseded IFP planning blocks (IFP-00..03, 07/08, DLA-WB-25 session arc).
- Phase 2 final: population-first pack rewrite; no replan language.
- Residual runtime PEL duplication audited — **not trimmed** (deferred optimisation).

### GAM realisation contract

- GAM **realises** DLA `required_materials` as `activity_materials` bodies — does not replan beats or collapse obligations.
- Canonical authority: **GAM-PRES-00..10** (order, membership, type map, anti-collapse, anti-spoiler, L3 depth floors, Evaluate trio).
- Post-capture validation: `lib/gam-output-format.js`.
- Phase 2B dedupe + **Wave A** pack cleanup: combined GAM prompt **22,084 → 15,712 chars (−29.5%)** while retaining PRES-07/08/09/10 (`artefacts/EV-38S-WAVE-A-gam-prompt-metrics.json` · [38S-gam-wave-a-implementation-report.md](38S-gam-wave-a-implementation-report.md)).

### Page compose/render ownership

| Owner | Responsibility |
|-------|----------------|
| **Design Page** | Read-only compose: sections, membership, assessment_check, merge/preserve GAM bodies |
| **Renderer (`app.js`)** | HTML presentation from composed Page JSON |

Design Page does **not** plan beats, populate obligations, or author GAM bodies. Post-capture helpers (`lib/page-gam-materials-preserve.js`, `lib/ld-design-page-compose-contract.js`) enforce verbatim material preservation.

### Page Rendering Phase A

Renderer-only fixes in `app.js` and `lib/page-role-render-sequencing.js` — no prompt changes:

| ID | Fix |
|----|-----|
| PAGE-01 | Type-bucket role fallback when `materials_order` / `material_role_index` absent; legacy fast-paths gated |
| PAGE-02 | `<strong>` / `<em>` normalised to markdown before escape |
| PAGE-03 | Suppress `/^M\d+/` as visible `<h5>` headings |
| PAGE-06 | Descend one level through material_id wrappers for worksheet tables |
| PAGE-05 | VA metadata keys added to suppression whitelist |

**Tests:** `tests/page-38s-phase-a-render-fixes.test.js` (Inflation LO1/LO5 fixtures).

### design_page audit

Read-only post-sanitisation ownership review: **no architecture blockers**. Design Page correctly compose/render-only. Residual debt is prompt hygiene (class B) and deferred compose metadata (class C) — not closure gates.

**Evidence:** [38S-design-page-audit.md](38S-design-page-audit.md)

### GAM Cleanup Wave A

Pack-only dedupe per [38S-final-gam-cleanup-audit.md](../phase-2/38S-final-gam-cleanup-audit.md):

- GAM-WB-11..18 → GAM-PRES-03 cross-ref
- GAM-WB-01/02/06 depth → GAM-PRES-08
- F1–F9 + MIX + AP → GAM-PRES-09 single taxonomy
- Canonical LD-* preamble compressed
- `defaultPromptNotes` rewritten

**Verification:** `tests/workbook-contract-prompt-surface.test.js` **47/47 pass** · `ev-38s-production-pipeline-chase.mjs` **`fullOk: true`** post-Wave A.

---

## Architecture Proven

### Validated chain

```text
LO (learning_outcomes)
  → Episode Plan (episode_plans — archetype + beats)
    → DLA (learning_activities — required_materials population)
      → GAM (activity_materials — full bodies)
        → Page (composed page JSON)
          → Render (learner HTML)
```

### Step ownership confirmed

| Step | Role in chain | Proven behaviour |
|------|---------------|------------------|
| **Episode Plan** | **Plans** | V1 taxonomy on inflation LO1–LO5: `understand`, `apply`, `analyse`, `evaluate` |
| **DLA** | **Populates** | Beat-aligned `required_materials`; `instructional_function` tags; 38L depth rows on merged artefact |
| **GAM** | **Realises** | Order/membership preserved (GAM-PRES-01/02); types map to DLA obligations; Evaluate trio structurally present |
| **Page** | **Composes** | GAM bodies preserved to Page JSON; strict verbatim materials contract post–2C-a |
| **Render** | **Renders** | Phase A fixes validated on Inflation-style fixtures |

### Harness gates (post–Wave A re-validation)

| Gate | Result | Artefact |
|------|:------:|----------|
| **proofOk** | **true** | `artefacts/EV-38S-AFTER-4-run-log.json` (2026-06-08T16:34:50Z) |
| **roleOk** | **true** | RF1–RF8 gates pass; 38P role supersession intact |
| **fullOk** | **true** | `artefacts/EV-38S-PRODUCTION-CHASE-report.json` |

Production chase steps: Episode Plan V1 taxonomy · DLA population contract · GAM pack text bodies · EV-38S proof replay — **all PASS**.

### Inflation rerun evidence

Manual and replay validation on the **inflation workbook** (LO1–LO5, workshop brief):

| Evidence | Finding |
|----------|---------|
| `EV-38S-AFTER-4-episode-plans.json` | Valid V1 plans per LO cognitive level |
| `EV-38S-AFTER-4-dla-learning-activities.json` | Obligations populated from beats; Evaluate completion pack present on LO5 |
| `EV-38S-AFTER-4-gam.json` | Beat-aligned material types; no obligation collapse to single consolidation |
| `EV-38S-AFTER-4-proof-metrics.json` | Educational metrics M-01–M-08 **Pass**; beat traceability 100% on A1 |
| `EV-38S-AFTER-4-run-log.json` | `validation38LRegression.ok: true`; body fidelity 38M **true** |
| Phase A render tests | LO1: exposition before checklist; LO5: scenario → table → template → checklist; no M-id h5; LO3 M9 table unwrap |

Post–Phase A and post–Wave A, the harness replay re-confirms **`fullOk: true`** with updated GAM pack surface. Renderer regressions PAGE-01/02/03/06 are covered by automated Inflation fixtures; PAGE-04 (PEL preamble population) and PAGE-05 (VA metadata placement) remain **low-severity compose/renderer gaps** — not architecture violations.

### What each layer proved

- **Episode Plan plans** — archetype + ordered beats gate downstream population without schema expansion.
- **DLA populates** — `FUNCTION_SPECS` merge, tagging, and 38L obligation rows on one artefact.
- **GAM realises** — GAM-PRES contract honoured; Evaluate pathway structurally faithful.
- **Page composes and renders** — bodies preserved; Phase A corrects presentation defects that were renderer-owned.

---

## Settled Architecture Decisions

The following are **settled**. They are not subject to reopening without **new regression evidence** (not preference, pedagogy ambition, or prompt tidiness alone).

| Decision | Settlement |
|----------|------------|
| **Episode Plan ownership** | Episode Plan owns archetype and beat order only. No material types or obligations in plan schema. V1 frozen. |
| **DLA ownership** | DLA owns obligation population from upstream `episode_plans`. No replanning, no archetype selection, no GAM body authoring. |
| **Population contract** | Beat → obligation merge, `instructional_function` tagging, PRE-EMIT gates, 38L depth rows — authoritative in pack + `lib/episode-plan-population-contract.js`. |
| **Workbook contract** | DLA-WB / GAM-WB / GAM-PRES co-presence rules remain binding. Validators in `lib/gam-output-format.js` complement prompts. |
| **Workflow chaining model** | `KM → LO → Episode Plan → DLA → GAM → Page` with strict upstream JSON injection and fenced capture. |
| **PF-11 architecture** | Authoritative `### Upstream episode_plans` block; V1 capture enforcement; stale-override detection — not optional. |
| **GAM ownership** | GAM realises `required_materials` only. GAM-PRES-07/08/09/10 are canonical depth and anti-collapse authority. |
| **Page ownership** | Design Page compose/preserve only. Renderer owns HTML presentation. GAM bodies must reach Page verbatim. |

---

## Deferred Work

### Deferred architecture optimisation (post-closure)

| Item | Notes |
|------|-------|
| **GAM Wave B** | Runtime marker merge (reading/voice/timeline); PEL reasoning block rewrite **only if** PEC gate changes |
| **design_page hygiene cleanup** | Pack dedupe (preserve rules triplicated); VA block reorder; dead preservation helper removal — class B from audit |
| **Page Phase B compose** | `materials_order` generalised compose; `activity_preamble` upstream population enforcement |
| **DLA runtime PEL dedupe** | Orientation/reasoning blocks duplicate pack OUTPUT CONTRACT |

### Future programme work (not architecture)

| Programme | Scope |
|-----------|-------|
| **Educational quality improvements** | Minimum viable L3 prose vs rich expert modelling; depth beyond word floors |
| **Teaching and learning quality** | North Star pedagogy (38Q); teacherly reasoning; misconception interrupt richness |
| **PEL enhancement programme** | Gate expansion; reasoning-material injection when PEC active |
| **Visual affordance work** | Sprint 38 VA refinement; pedagogical added-value population |

These programmes **must not** alter frozen ownership boundaries without a new design sprint charter.

---

## Closure Assessment

### Closure criteria (from [38S-continuation-handover-pack.md](38S-continuation-handover-pack.md))

| # | Criterion | Met? | Evidence |
|---|-----------|:----:|----------|
| 1 | Page Rendering Phase A implemented and tested | **Yes** | `tests/page-38s-phase-a-render-fixes.test.js`; PAGE-01/02/03/06 addressed |
| 2 | GAM Wave A implemented | **Yes** | −6,372 combined chars; PRES-07/08/09/10 retained; harness green |
| 3 | Manual Inflation re-run complete | **Yes** | `EV-38S-AFTER-4-*` artefacts; structural fidelity LO1–LO5; post-Wave A harness re-validation |
| 4 | No open **High** severity Page defects | **Yes** | PAGE-01, PAGE-02, PAGE-06 resolved in Phase A |
| 5 | Architecture closure note published | **Yes** | This document |
| 6 | No regression in frozen boundaries | **Yes** | EP V1, population contract, workbook validators, workflow chaining unchanged in meaning |

### Non-blockers explicitly accepted at closure

- PAGE-04: `activity_preamble` / PEL fields often empty upstream — compose gap, not ownership violation.
- PAGE-05: VA metadata may appear in `sections[]` — low severity; partial mitigation in Phase A.
- A4 independent template depth warning (38M G13) — audit warning only, not proof fail.
- Legacy `local_override` on saved workflows — user must reseed; mitigated by detection, not a chain bug.
- PEC `workshop` gate suppresses GAM PEL blocks on Inflation — known, by design.

### Programme significance

| Before 38S | After 38S |
|------------|-----------|
| Episode Plan V1 proven in design only (38R) | Episode Plan V1 **runtime step** with validation gate |
| G3/G5 reduction framework-only | Plan-driven population demonstrated on inflation A1–A4 |
| DLA/GAM/Page ownership blurred in prompts | **Frozen step boundaries** with sanitised packs |
| PF-11 upstream failures on manual path | Root causes fixed; diagnostics in place |
| Page renderer legacy fast-paths inverted material order | Phase A role-weight fallback |

---

## Final Recommendation

**Sprint 38S is CLOSED.**

The architecture tranche is complete. Episode Plan V1, the population contract, PF-11 chaining, GAM realisation, and Page compose/render ownership are **implemented, proven, and frozen**.

Do not reopen ownership discussions or architecture investigations in ordinary maintenance work. Future changes require new evidence of regression or a chartered successor sprint (e.g. 39+) with explicit scope to revisit a settled boundary.

---

## Reference index

| Document | Role |
|----------|------|
| [38S-continuation-handover-pack.md](38S-continuation-handover-pack.md) | Continuation authority |
| [38S-design-page-audit.md](38S-design-page-audit.md) | Design Page ownership audit |
| [38S-gam-wave-a-implementation-report.md](38S-gam-wave-a-implementation-report.md) | GAM Wave A delivery |
| [38S-6-sprint-closure.md](../observations/38S-6-sprint-closure.md) | Harness SC closure |
| [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) | Frozen V1 charter |
| `artefacts/EV-38S-AFTER-4-run-log.json` | Proof gate record |
| `artefacts/EV-38S-PRODUCTION-CHASE-report.json` | Production chase |
| `artefacts/EV-38S-final-dla-prompt-metrics.json` | DLA sanitisation metrics |
| `artefacts/EV-38S-WAVE-A-gam-prompt-metrics.json` | GAM Wave A metrics |

---

*End of Sprint 38S Architecture Closure Note.*
