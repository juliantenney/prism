# Sprint 50 Phase 1b — Persistence Path Fix Report

**Status:** Complete  
**Scope:** Compose/persistence path only — ensure DLA `activity_preamble` (and related framing fields) become authoritative on saved `page.json` activity rows  
**Out of scope:** DLA/GAM prompts, schemas, contracts, gates, ontology, renderer grammar

---

## Summary

Phase 1 closed compose merge logic and raw-map fallback, but refreshed Marx runs still produced `page.json` activity rows without `activity_preamble` while `learning_activities.json` contained it. Phase 1b fixes three remaining persistence-path gaps:

1. **Upstream capture read order** — compose upstream resolution now prefers `workflowRunCapturedOutputsRaw` (authoritative artefact) over sanitized captures.
2. **Binding resolution** — Design Page compose uses persisted workflow `inputBindings` (via `resolveEffectiveInputBindingsForPromptStep`), not DOM-only `data-input-bindings`.
3. **Cascade re-compose** — when DLA capture syncs, all Design Page captures in the workflow are re-composed so page rows pick up framing fields even if page was captured first.

Utilities preview now always writes the composed (mutated) page object back to the JSON textarea after composition validation.

---

## Root cause

Multiple compounding gaps in the workflow → saved artefact path:

| Gap | Effect |
| --- | ------ |
| `readWorkflowRunCaptureTextForStepId` preferred **sanitized** captures for upstream DLA | Stale sanitized DLA (without framing fields) blocked merge even when raw map had full DLA |
| `resolveUpstreamLearningActivitiesForPageStep` used DOM `readStepInputBindings` only | Run stubs / persisted workflow bindings were not used when DOM attribute missing |
| No downstream re-compose when DLA capture updated | Page captured before upstream available, or page not re-synced after DLA refresh, left unmerged rows in `workflowRunCapturedOutputsRaw` and textarea |
| Utilities preview only wrote merged JSON on validation **fail** | User could render from in-memory merge but saved/exported pre-merge textarea JSON |

Renderer grammar (Phase 2) was correct: without `activity_preamble` on page rows, *Why this activity* correctly omitted.

---

## Exact path affected

```
DLA step capture (workflowRunCapturedOutputsRaw)
  → [Phase 1b] readWorkflowRunUpstreamCaptureTextForStepId (raw-first)
  → resolveUpstreamLearningActivitiesForPageStep / resolveUpstreamLearningActivitiesFromWorkflowCaptures
  → mergeLearnerPageActivityFramingFieldsIntoPageActivities
  → applyPageCompositionValidationForCapturedPage (page step sync)
  → workflowRunCapturedOutputsRaw[pageStepId] = composed JSON
  → runStepOutput textarea (when semantically changed)
  → [Phase 1b] recomposeWorkflowPageCapturesFromUpstream on DLA sync
  → utilities JSON textarea (always updated after compose)
  → HTML export/render (reads composed page)
```

**Not affected:** Workshop pages, DLA/GAM generation, renderer section assembly.

---

## Files changed

| File | Change |
| ---- | ------ |
| `app.js` | `readWorkflowRunUpstreamCaptureTextForStepId`; raw-first upstream reads; improved page-step binding resolution; `recomposeWorkflowPageCapturesFromUpstream`; DLA-sync cascade; utilities textarea always persists composed page |
| `tests/sprint-50-phase-1b-persistence-path.test.js` | **New** — stale sanitized vs raw, captured-page compose, cascade recompose, render heading |
| `docs/.../SPRINT-50-PHASE-1B-PERSISTENCE-PATH-FIX-REPORT.md` | This report |

---

## Before / after `page.json` row example

**Before compose (Marx run2 draft — LLM page output):**

```json
{
  "activity_id": "A1",
  "title": "Core Marxist Concepts in Action",
  "learner_task": "…",
  "expected_output": "…",
  "materials": { }
}
```

**After compose (authoritative row — fields from upstream DLA):**

```json
{
  "activity_id": "A1",
  "title": "Core Marxist Concepts in Action",
  "activity_preamble": "This activity establishes the foundation for the session by defining the core Marxist concepts you will use in later analysis.",
  "reasoning_orientation": "Use a structured analytical method: define each concept, cite scenario evidence, then justify your judgement.",
  "learner_task": "…",
  "expected_output": "…",
  "materials": { }
}
```

---

## Before / after rendered heading evidence

**Before (uncomposed page rows):**

- Instructional grammar sections present: *Read and model*, *What to do*, *Check your work*
- *Why this activity* **absent** (no `activity_preamble` on rows)

**After (composed page rows):**

```html
<section class="util-instructional-section util-instructional-orient">
  <h4 class="util-instructional-heading">Why this activity</h4>
  <div class="util-instructional-body">…activity_preamble prose…</div>
</section>
```

---

## Tests added

`tests/sprint-50-phase-1b-persistence-path.test.js`:

| Test | Reproduces |
| ---- | ---------- |
| upstream capture prefers raw DLA when sanitized map is stale | Sanitized/raw divergence |
| page draft without preamble persists merge on captured-page compose | LLM draft → authoritative page |
| recompose after DLA arrives updates saved page capture | Page-first, DLA-second workflow order |
| utilities compose persists merged page.json in parsed object | Utilities export path |

---

## Test evidence

```text
node --test \
  tests/sprint-50-phase-1b-persistence-path.test.js \
  tests/sprint-50-phase-1-compose-fidelity.test.js \
  tests/sprint-50-phase-2-renderer-instructional-grammar.test.js \
  tests/utility-journey-compass-render.test.js

ℹ tests 28
ℹ pass 28
ℹ fail 0
```

---

## Success criteria

| Criterion | Status |
| --------- | ------ |
| `page.json` rows include `activity_preamble` when upstream DLA has it | **Pass** |
| Rendered HTML shows *Why this activity* | **Pass** |
| Phase 1 and Phase 2 tests remain green | **Pass** (28/28 in Sprint 50 suite) |
| No DLA/GAM/prompt/schema/gate/ontology changes | **Pass** |

---

## Validation notes for refreshed Marx runs

After deploying Phase 1b:

1. Re-sync workflow captures (edit DLA step or navigate steps to trigger `syncWorkflowRunCapturedOutputToState`).
2. Confirm `page.json` activity rows include `activity_preamble` before copying/exporting.
3. Utilities paste of page JSON will auto-update to composed rows on Generate preview.

If `activity_preamble` is still missing, verify DLA capture exists in `workflowRunCapturedOutputsRaw` for the Design Learning Activities step and that activity IDs match (`A1`…`A5`).
