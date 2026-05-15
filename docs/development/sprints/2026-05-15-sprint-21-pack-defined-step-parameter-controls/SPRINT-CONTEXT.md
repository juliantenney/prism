# Sprint 21 — Pack-defined Step Parameter Controls (context)

**Pack path:** `docs/development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/`  
**Date:** 2026-05-15  
**Phase:** **Proposed / ready for charter** — bootstrap pack only

---

## Problem statement

Sprint 20 closed the **explainability gap**: users can see assumptions, step relevance, and how to open Settings.

**Remaining gap:** Settings do not yet implement a **complete, pack-driven parameter editor**. Mapped `stepParams` may appear in provenance and summaries but lack **generic editable controls** backed by pack metadata. Tuning still depends on Prompt Factory patterns, notes, and partial `userOptions` — not a unified parameter contract.

Without Sprint 21, the parameterised workflow model is **visible** but not **fully operable** in Settings.

---

## Sprint goal

Complete the transition to a **fully parameterised, pack-driven workflow system** by making pack-defined `stepParams` **first-class editable Settings controls**.

**Outcome:** Settings = full workflow parameter editor; runtime = generic renderer + persistence + propagation + provenance alignment.

---

## Core thesis

| Responsibility | Owner |
|----------------|-------|
| Which parameters exist | **Pack** |
| Labels, descriptions, defaults, options | **Pack** |
| Visibility, advanced/basic grouping, elicitation priority | **Pack** |
| Settings rendering metadata (control types) | **Pack** |
| Render controls, persist, propagate to execution | **Runtime** |
| Explain assumptions and step relevance | **Runtime** (existing provenance; integrate edits) |

**Not:** bespoke Factory UI per parameter or per domain in `app.js`.

---

## Two-tier parameter model

### 1. Elicited parameters

Small set of **high-impact** decisions worth asking during workflow design.

| Examples |
|----------|
| Assessment type |
| Item count |
| Learner level |
| Topic / scope |
| Formative vs summative intent |

Pack declares **`elicitation: elicited`** (or equivalent) so runtime and charters keep brief surfaces small.

### 2. Settings-only parameters

Richer controls available **after** generation without expanding the wizard.

| Examples |
|----------|
| Sequencing strategy |
| Difficulty progression |
| Distractor style |
| Feedback granularity |
| Answer visibility |
| Retry / remediation policy |
| Explanation depth |
| Scaffolding intensity |

**Key principle:** Do not force users through arcane configuration during synthesis. **Generate quickly**, then expose rich tuning in Settings.

---

## Candidate programme goals

| ID | Goal | Description |
|----|------|-------------|
| **A** | **Pack parameter metadata** | Declarative schema for controls, labels, tiers, visibility |
| **B** | **Generic Settings renderer** | Typed controls from metadata; no per-param branches |
| **C** | **Persistence + propagation** | Values flow to `stepParams` and execution paths |
| **D** | **Provenance integration** | Settings edits reflected in explainability surfaces |
| **E** | **LD pilot pack** | Representative stepParams on Learning Design steps |

---

## Success criteria (programme — bootstrap targets)

| Criterion | Target |
|-----------|--------|
| Relevant mapped params editable in Settings | Yes — via generic controls |
| Pack-authored labels and options | Yes — no hard-coded domain copy in runtime |
| Elicited vs Settings-only respected | Brief stays small; rich params post-gen |
| Provenance still accurate | Source/labels after Settings edits |
| Architecture preserved | Essentials, adequacy, elicitation discipline |
| Test floor | **135+** passed, 0 failed |
| Research regression | **Frozen** unless chartered |

---

## In scope (when chartered)

- Pack-defined parameter metadata conventions  
- Generic Settings control rendering (typed controls)  
- Advanced/basic grouping and visibility rules  
- Pack-driven Settings UX in Factory  
- Hooks to persist and propagate `stepParams`  
- Preserving and extending provenance integration  

---

## Out of scope (bootstrap and default programme)

| Item | Reason |
|------|--------|
| Bootstrap implementation | Planning only |
| Utilities / page HTML renderer rewrite | Separate programme |
| Prompt Studio merge | Product boundary |
| Schema overhaul | Prefer incremental metadata on packs |
| Pack validation framework | Future |
| AI-generated parameter semantics | Pack-authored only |
| Workflow diff / history | Deferred |
| Collaborative editing | Out of scope |
| Runtime execution redesign | Minimal propagation hooks only |
| New blocking elicitation | Contradicts 18–20 |
| Pack audit (which params should exist) | Related future programme — informs packs, not blocker for 21-1 MVP |

---

## Dependencies

| Dependency | Notes |
|------------|--------|
| Sprint 20 closed | **135 tests**; provenance + discoverability live |
| Sprint 20 closeout §11 | Sprint 21 candidate specification |
| Parameterisation reflection | Pedagogical framing for metadata tiers |
| `mappingRules` / `stepParams` | Existing mapping pipeline — extend, don’t replace |
| Manual validation | `npm run dev` + Factory Settings flows |

---

## Risks

| Risk | Mitigation |
|------|------------|
| Metadata schema sprawl | Charter minimal v1; version in pack |
| Settings UI complexity | Advanced/basic collapse; visibility flags |
| Runtime domain branches return | Generic renderer + pack metadata only |
| Provenance drift after edits | Slice 21-3 / explicit integration tests |
| Research fixture breakage | Freeze S1–S13; LD-first pilot |
| Elicitation creep | Two-tier model enforced in pack metadata |

---

## Expected future benefits

| Benefit | Description |
|---------|-------------|
| Declarative evolution | New workflow settings mostly pack edits |
| Domain independence | LD and Research extend metadata separately |
| Reduced `app.js` branching | One renderer for control types |
| Configuration contracts | Packs own factors + mappings + Settings metadata |
| Audit-ready surface | Exposed params match pack declarations |

---

## References

- [`sprint-21-bootstrap.md`](sprint-21-bootstrap.md)  
- [`docs/consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md)  
- [`docs/consolidation/sprint-20-parameterisation-reflection.md`](../../../consolidation/sprint-20-parameterisation-reflection.md)  
- [`docs/consolidation/contextual-refinement-architecture-note.md`](../../../consolidation/contextual-refinement-architecture-note.md)
