# Sprint 50 Current State

**Status:** Implementation complete — verification and quality review remain open  
**Last updated:** 2026-06-20  
**Authoritative continuation reference** for future Sprint 50 work and chat sessions

**Primary evidence corpus:** [`../2026-06-19-sprint-49-sp-01-text-pattern/marx-run-artefacts-run2/`](../2026-06-19-sprint-49-sp-01-text-pattern/marx-run-artefacts-run2/)

**Implementation reports:**

- [SPRINT-50-PHASE-1-COMPOSE-FIDELITY-REPORT.md](./SPRINT-50-PHASE-1-COMPOSE-FIDELITY-REPORT.md)
- [SPRINT-50-PHASE-1B-PERSISTENCE-PATH-FIX-REPORT.md](./SPRINT-50-PHASE-1B-PERSISTENCE-PATH-FIX-REPORT.md)
- [SPRINT-50-PHASE-2-RENDERER-INSTRUCTIONAL-GRAMMAR-REPORT.md](./SPRINT-50-PHASE-2-RENDERER-INSTRUCTIONAL-GRAMMAR-REPORT.md)

---

## Executive Summary

**Sprint 49** closed as **Complete with follow-on work**. It established that the Marx self-directed learner-page pipeline can generate mandatory framing fields (`activity_preamble`, `reasoning_orientation`), cognition-orientation signals, and substantive GAM connective exposition; carry them through GAM and Design Page compose; and surface them in renderer output. Sprint 49 also proved that **manifestation ≠ presence** — fields can exist in upstream artefacts while learner experience (density, salience, reading order, page JSON fidelity) remains uneven.

**Sprint 50** answered the follow-on question: *When a learner opens the rendered page, does pedagogy read coherently, guide attention, and feel self-explanatory?* Investigation validated a **seven-function instructional model** and a **single-column manifestation grammar**. Implementation delivered compose fidelity (Phase 1), persistence-path fixes (Phase 1B), and renderer instructional grammar (Phase 2).

**Current implementation status:**

| Workstream | Status | Notes |
| ---------- | ------ | ----- |
| Investigation + validation | **Complete** | Inventory, classification, minimal model, scope confirmation |
| Phase 1 — Compose fidelity | **Complete** | Raw-map fallback; authoritative page capture persistence |
| Phase 1B — Persistence path | **Complete** | Raw-first upstream; binding resolution; cascade re-compose |
| Phase 2 — Renderer grammar | **Complete** | Single-column sections; duplicate signal removal; AC1–AC7 pass |
| Fresh-generation verification (P0) | **Open** | Phase 1B fix requires confirmation on a new Marx run |
| Quality / richness review (P1–P3) | **Open** | Architecture settled; remaining gaps are experiential |

Regression suites: **95+ tests green** across Sprint 50 Phase 1, 1B, Phase 2, and Sprint 48–49 regressions (see Phase 2 report for command).

---

## Completed Investigation Work

### Pedagogic Manifestation Inventory

**Document:** [SPRINT-50-PEDAGOGIC-MANIFESTATION-INVENTORY.md](./SPRINT-50-PEDAGOGIC-MANIFESTATION-INVENTORY.md)

Mapped every pedagogic field and structure from DLA through GAM, compose, and renderer to learner-visible HTML. Outcome: pedagogy is **generated upstream** and **renderable downstream**, but compose persistence and renderer order/duplication created gaps between data presence and learner experience. Established provenance for PEL, cognition-orientation, materials, Compass, and task/output blocks.

### Instructional Function Classification

**Document:** [SPRINT-50-INSTRUCTIONAL-FUNCTION-CLASSIFICATION.md](./SPRINT-50-INSTRUCTIONAL-FUNCTION-CLASSIFICATION.md)

Classified fields and renderer components into instructional functions (Orient, Think, Study, Do, Check, Reflect, Transfer, Support). Outcome: validated **seven core functions** plus optional Support; identified boundary fields, duplicate ownership (Compass vs framing vs cognition), and Study/Do ordering conflicts in legacy renderer.

### Minimal Instructional Manifestation Model

**Document:** [SPRINT-50-MINIMAL-INSTRUCTIONAL-MANIFESTATION-MODEL.md](./SPRINT-50-MINIMAL-INSTRUCTIONAL-MANIFESTATION-MODEL.md)

Defined the **simplest viable learner experience**: single-column instructional document per activity; Companion (Orient + Think) before Activity Flow (Study → Do → Check → Reflect → Transfer); one primary owner per function; plain-language section labels. Outcome: **no new fields or pedagogy** — reorder, relabel, and de-duplicate existing signals.

### Scope Confirmation

**Document:** [SPRINT-50-SCOPE-CONFIRMATION-DESIGN-PAGE-RENDERER.md](./SPRINT-50-SCOPE-CONFIRMATION-DESIGN-PAGE-RENDERER.md)

Confirmed solution scope as **Design Page compose + Renderer only**. Upstream DLA/GAM already generate required owners; compose merge exists but was not always persisting to authoritative `page.json`; renderer had capability but wrong order and duplication. Outcome: **no prompt, contract, schema, gate, or ontology changes required** for manifestation.

### Validation Activities

**Documents:** [SPRINT-50-INSTRUCTIONAL-MANIFESTATION-IMPLEMENTATION-SPEC.md](./SPRINT-50-INSTRUCTIONAL-MANIFESTATION-IMPLEMENTATION-SPEC.md), [SPRINT-50-INSTRUCTIONAL-MANIFESTATION-HYPOTHESIS.md](./SPRINT-50-INSTRUCTIONAL-MANIFESTATION-HYPOTHESIS.md), [SPRINT-50-DECISION-LOG.md](./SPRINT-50-DECISION-LOG.md)

Validated grammar order, field ownership, duplicate-resolution rules, pre-check Reflect branch, and accessibility/reading-order requirements. Marx run2 corpus used for before/after comparison. Outcome: implementation spec accepted; hypothesis confirmed that manifestation fixes are compose + renderer, not generation.

---

## Completed Implementation Work

### Phase 1 — Compose Fidelity

**Report:** [SPRINT-50-PHASE-1-COMPOSE-FIDELITY-REPORT.md](./SPRINT-50-PHASE-1-COMPOSE-FIDELITY-REPORT.md)

**Root cause:**

1. Upstream DLA resolution read only `workflowRunCapturedOutputs` (sanitized), not `workflowRunCapturedOutputsRaw` or DOM — compose ran with no upstream when DLA existed only in raw map.
2. Composed page was written back to authoritative capture maps only when `json !== raw` — unmerged LLM draft could remain authoritative.

**Fixes:**

- `readWorkflowRunCaptureTextForStepId` — sanitized → raw → DOM fallback
- Always persist composed JSON to both capture maps when compose returns JSON
- `workflowRunCaptureJsonSemanticallyEquivalent` for textarea updates

**Outcome:** `mergeLearnerPageActivityFramingFieldsIntoPageActivities` runs with correct upstream; `activity_preamble` and `reasoning_orientation` merge onto page rows when DLA is available. Tests: `tests/sprint-50-phase-1-compose-fidelity.test.js`.

### Phase 1B — Persistence Path Fix

**Report:** [SPRINT-50-PHASE-1B-PERSISTENCE-PATH-FIX-REPORT.md](./SPRINT-50-PHASE-1B-PERSISTENCE-PATH-FIX-REPORT.md)

**Issues addressed:**

| Issue | Fix |
| ----- | --- |
| **Stale sanitized upstream** | `readWorkflowRunUpstreamCaptureTextForStepId` — raw-first for compose upstream reads |
| **Binding resolution** | `resolveUpstreamLearningActivitiesForPageStep` uses `resolveEffectiveInputBindingsForPromptStep` with persisted workflow `inputBindings` |
| **Cascade re-compose** | `recomposeWorkflowPageCapturesFromUpstream` runs when DLA capture syncs |
| **Utilities textarea** | Utilities Generate always writes composed page JSON back to textarea after validation |

**Outcome:** Saved `page.json` activity rows should include `activity_preamble` when upstream DLA has it, even if page was captured before DLA or sanitized map was stale. Tests: `tests/sprint-50-phase-1b-persistence-path.test.js`.

### Phase 2 — Renderer Instructional Grammar

**Report:** [SPRINT-50-PHASE-2-RENDERER-INSTRUCTIONAL-GRAMMAR-REPORT.md](./SPRINT-50-PHASE-2-RENDERER-INSTRUCTIONAL-GRAMMAR-REPORT.md)

**Instructional grammar implementation:**

- New lib: `lib/ld-instructional-manifestation-render.js`
- Learner pages (`page_profile: learner`, non-workshop) render single-column instructional sections with `h4` headings
- Legacy framing rail, cognition blocks, side Compass column, and separate Output block suppressed when grammar active

**Section ordering:**

Why this activity → How to approach this → Read and model → [Explain before you check] → What to do → Check your work → What to take away → Apply elsewhere → [Watch for this mistake]

Study appears before Do when study materials exist. Check unifies checklist + `expected_output`.

**Duplicate signal resolution:**

- Compass: progress only (`Step N of M`); no Orient/Think/Transfer prose
- Think: single *How to approach this* section
- Transfer: `materials.transfer_prompt` authoritative in *Apply elsewhere*
- Orient: *Why this activity* from `activity_preamble` (and secondary orient fields)

**Accessibility outcome:** Semantic `<section>` + heading outline communicates function order without styling; single-column reading order matches pedagogic intent.

**Acceptance status (AC1–AC7):** All pass in regression suite. Workshop pages retain legacy renderer.

---

## Validated Findings

The following are **established** — do not re-investigate without new evidence:

1. **Pedagogy is generated, preserved, and rendered.** DLA emits framing fields; GAM emits materials; compose merge and preserve logic exist; renderer surfaces fields when present on page rows.

2. **Seven-function instructional model validated.** Orient, Think, Study, Do, Check, Reflect, Transfer (+ optional Support) with defined field ownership.

3. **Single-column instructional manifestation model adopted.** Companion before Activity Flow; no two-column Compass sidebar for grammar pages.

4. **Solution scope confirmed as Design Page compose + Renderer.** No upstream generation redesign required for manifestation.

5. **No prompt, contract, schema, gate, ontology, or workflow redesign required** for the manifestation architecture.

6. **Remaining issues are quality and richness rather than architecture.** Structure is coherent; voice, concreteness, and optional-field coverage may still be thin.

---

## Current Open Issues

### P0 — Verification

Verify fresh generation after Phase 1B.

**Expected after a full Marx workflow run with capture sync:**

- `activity_preamble` persists on `page.json` activity rows when DLA has it
- *Why this activity* renders in HTML
- `reasoning_orientation` persists when generated
- *How to approach this* renders

**How to verify:** Run workflow; confirm DLA in `workflowRunCapturedOutputsRaw`; copy/export `page.json` after page step sync (or re-sync DLA to trigger cascade re-compose); render and inspect headings.

### P1 — PEL Manifestation Review

Review generated → persisted → rendered → learner-visible PEL across:

- Page-level Orient (`overview`, `learning_purpose`)
- Activity-level Orient (`activity_preamble`, bridges, prior knowledge)
- Think fields beyond `reasoning_orientation`
- Optional fields sparse in generation (`self_explanation_prompt` on A1 only in Marx run2)

Determine what remains hidden vs thin vs duplicated.

### P2 — Instructional Richness Review

**Observed:** Instructional structure is now coherent; instructional voice remains thinner than desired.

Investigate (not architecture):

- Coaching language density
- Transition prose between activities
- Learner guidance tone
- Explanatory framing depth

### P3 — Material Quality Review

Review worked examples, model outputs, transfer prompts, reflection prompts for:

- Concreteness
- Authenticity
- Educational richness

This is **generation/content quality**, not compose or renderer architecture.

---

## Issues Explicitly Considered Resolved

| Issue | Resolution |
| ----- | ---------- |
| Instructional sequencing confusion | Validated grammar order implemented in Phase 2 |
| Study/Do ordering | Study section before Do when study materials exist |
| Duplicate Check structures | Checklist + expected output unified under *Check your work* |
| Duplicate Compass signalling | Compass progress-only; no Orient/Think/Transfer prose |
| Manifestation architecture uncertainty | Scope confirmation + minimal model + implementation spec |
| Compose authority uncertainty | Phase 1 + 1B: authoritative `page.json` rows receive merged framing fields |
| Page JSON PEL echo / render-time merge masking compose gaps | Phase 1B persistence path; raw-first upstream |
| Two-column Compass vs single-column reading order | Grammar pages single-column; workshop legacy retained |
| Separate Output block after activity | Expected output inside Check section |

---

## Scope Boundary

### Do Not Revisit Without Evidence

| Area | Rationale |
| ---- | --------- |
| OUTPUT CONTRACT expansion | Sprint 49 rejected sprawl; schema + modules suffice |
| Prompt architecture redesign | C1–C4, SP-01–SP-06, preamble/cognition modules complete |
| Workflow gates | DLA Framing Gate v1 + GAM capture gate stable |
| Ontology redesign | D-49-01 and LD-COGNITION-ORIENTATION settled |
| Auto-repair systems | Explicitly rejected in Sprint 49 |
| Architecture-first solutions | Current evidence points to persistence + manifestation, not new layers |

Reopening any of the above requires **fresh evidence** that a manifestation gap cannot be closed by compose fidelity or renderer grammar.

### In Scope for Follow-On (Quality, Not Architecture)

- P0 fresh-generation verification
- PEL visibility and optional-field coverage review
- Instructional voice and richness
- Material concreteness and authenticity
- Visual design polish (typography tiering beyond functional headings)

---

## Recommended Next Activities

Priority order:

1. **Verify Phase 1B persistence fix** in a fresh Marx generation run (P0).
2. **Review Orient/Think manifestation** after verification — confirm *Why this activity* and *How to approach this* on all activities with upstream fields.
3. **Investigate remaining PEL visibility gaps** — optional fields, page-level vs activity-level balance (P1).
4. **Review instructional richness** — coaching language, transitions, voice (P2).
5. **Review material quality and concreteness** — worked examples, transfer, reflection (P3).

---

## Continuation Prompt

Copy into a new chat to continue Sprint 50 from this state:

```
Sprint 50 continuation — pedagogic manifestation (post-implementation).

Read first:
docs/development/sprints/2026-06-20-sprint-50-pedagogic-manifestation/SPRINT-50-CURRENT-STATE.md

Context:
- Sprint 49 closed: generation + preservation proven on Marx corpus.
- Sprint 50 investigation complete: seven-function model, single-column grammar, Design Page compose + Renderer scope only.
- Implementation complete: Phase 1 (compose fidelity), Phase 1B (persistence path), Phase 2 (renderer instructional grammar).
- Do NOT reopen prompts, contracts, schemas, gates, ontology, or architecture without new evidence.

Current priority: P0 — verify Phase 1B on a fresh Marx run:
- activity_preamble on page.json rows
- Why this activity / How to approach this in rendered HTML

Then: P1 PEL review, P2 instructional richness, P3 material quality.

Evidence corpus: docs/development/sprints/2026-06-19-sprint-49-sp-01-text-pattern/marx-run-artefacts-run2/
```

---

*This document supersedes [SPRINT-50-HANDOVER-PACK.md](./SPRINT-50-HANDOVER-PACK.md) for implementation status. The handover pack remains useful for Sprint 49 context and historical uncertainty framing.*
