# Sprint 21 — current state

**Date:** 2026-05-15  
**Pack path:** `docs/development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/`  
**Sprint:** 21 — Pack-defined Step Parameter Controls  
**Status:** **Proposed / ready for charter** — bootstrap pack only; **no implementation**

**Entry point:** [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md)

**Predecessor:** [`docs/consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md)

---

## Active sprint summary

| Sprint | Status |
|--------|--------|
| **Sprint 21** | **Bootstrap** — charter pending |
| **Sprint 20** | **Closed** — **135 tests** — [`../../../consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) |
| **Sprint 19** | **Closed** — **118 tests** |
| **Sprint 18** | **Closed** — **100 tests** |

---

## Verification floor

```bash
node --test tests/*.test.js
```

| Metric | Value |
|--------|-------|
| **Tests** | **135 passed**, 0 failed |
| **Baseline** | Sprint 20 closeout |
| **Research fixtures** | S1–S13 — **frozen** unless chartered |

---

## Problem statement (entry gap)

The runtime already supports:

- resolved factors  
- `mappingRules` → `stepParams`  
- provenance and step relevance  
- Settings discoverability and navigation  
- parameter propagation into execution  

Step **Settings** still expose only **part** of the parameter surface (Prompt Factory `userOptions`, notes, partial summaries). Many mapped `stepParams` are not **first-class editable controls**.

---

## Sprint 21 goal

Every **relevant** pack-defined workflow parameter should be:

| Property | Intent |
|----------|--------|
| **Inspectable** | Visible in Settings with pack label/description |
| **Editable** | Generic control, not notes-only |
| **Human-readable** | Pack-authored copy |
| **Pack-defined** | Metadata in domain packs |
| **Generically rendered** | Runtime control by type/metadata — no per-param bespoke UI |

---

## Architectural position

Sprint 21 is the **completion of the parameterised workflow front-end model**, not a new synthesis architecture.

| Layer | Sprint 21 touch |
|-------|-----------------|
| Brief / essentials | **Unchanged** — elicited tier only |
| Synthesis | **Unchanged** |
| Adequacy | **Unchanged** interpreters |
| Provenance | **Integrate** — reflect Settings edits |
| **Settings** | **Primary programme surface** |

---

## Two-tier model (documented target)

| Tier | Where | Examples |
|------|-------|----------|
| **Elicited** | Brief / essentials | Assessment type, item count, learner level, topic/scope, formative/summative intent |
| **Settings-only** | Step Settings post-design | Sequencing, difficulty progression, distractor style, feedback granularity, answer visibility, retry/remediation, explanation depth, scaffolding intensity |

---

## Bootstrap deliverables

| Artefact | Status |
|----------|--------|
| Portable pack (7 files) | **Done** |
| Slice 21-1 charter | **Not started** |
| Implementation | **Not started** |

---

## Key runtime / pack touchpoints (investigation starting points)

| Area | Path (illustrative) |
|------|---------------------|
| Settings UI | `app.js` — Prompt Factory step config, `userOptions`, `[PRISM_STEP_PARAMS]` |
| Discoverability | `decorateWorkflowStepSettingsDiscoverability`, summaries (Sprint 20-1) |
| Mappings | `applyWorkflowBriefMappings`, pack `mappingRules` |
| LD pack | `domains/learning-design/domain-learning-design-step-patterns.md` |
| Research pack | **Frozen** — charter required for changes |

---

## Recommended next work

1. Charter **Slice 21-1** — parameter metadata conventions + generic Settings renderer MVP  
2. Define minimal pack metadata schema (control type, label, default, options, `tier`: basic/advanced, `elicitation`: elicited/settings-only, visibility)  
3. LD pilot parameters before cross-domain expansion  

---

## References

| Document | Role |
|----------|------|
| [`sprint-21-bootstrap.md`](sprint-21-bootstrap.md) | Programme thesis and slices |
| [`sprint-20-parameterisation-reflection.md`](../../../consolidation/sprint-20-parameterisation-reflection.md) | Why parameters matter |
| [`contextual-refinement-architecture-note.md`](../../../consolidation/contextual-refinement-architecture-note.md) | Guidance layers |
