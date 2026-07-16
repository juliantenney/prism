# Learning Experience Evolution

**Status:** Living synthesis (updated at Sprint 62 close)  
**Date:** 2026-07-16  
**Related:** [Sprint 62 closure](../development/sprints/2026-07-16-sprint-62-coherent-renderer-pass/SPRINT-62-CLOSURE.md) · [Sprint 63 charter](../sprints/sprint-63-cognitive-flow-and-reasoning-visibility.md)

This document records how PRISM’s understanding of learner experience has evolved. It is **synthesis**, not a schema redesign proposal.

---

## Phase 1 — Renderer Correctness

**Outcome:** Renderer faithfully represents authored structure.

Sprint 62 established that learner-facing defects were often **presentation fidelity** problems, not missing pedagogy in the pipeline.

### Documented work

| Theme | What was done |
| ----- | ------------- |
| Materials restoration | Unique storage keys; `_material_ids` / `_material_types` / `_render_sequence`; type-hint dispatch; RNA 29/29 materials render once |
| Ordering validation | Activity → beat → material order audited; beat-first preferred; authored sequence preserved |
| Duplicate suppression | Skip duplicate `page_synthesis` when body already present from `sections[]` |
| Metadata cleanup | Technical keys confined to collapsed “About this page”; fixture/test title rule for RNA artefacts |
| Diagnostics alignment | Exclude sidecar keys; use `_material_types` for typing; align closure with `resolveBeatMaterialPlan` |

### Implication

Once correctness holds, remaining learner friction is less “something is missing from the HTML” and more “the episode does not yet feel like expert-guided thinking.”

---

## Phase 2 — Journey Presentation

**Outcome:** Learners can navigate activities more easily.

Sprint 62 implemented a **minimum learner-journey presentation slice** using only existing data.

### Documented work

| Theme | What was done |
| ----- | ------------- |
| Learner-facing labels | Structural beat functions → Understand / See it modelled / Your turn / Check your work / Apply elsewhere |
| Goal framing | Conservative goal-shaped `learner_task` → “Your goal”; inventory tasks retain “What to do” |
| Success promotion | Checklist / `expected_output` wording → “Success looks like” (no paraphrase) |
| Duplication reduction | Deterministic trailing Output suppression; checklist remains in Verify |
| Completion cues | Minimal “Done” wrapping only when existing output can be reused safely |

### Presentation direction (not a schema)

```text
Frame
  ↓
Understand
  ↓
[Model]
  ↓
Apply
  ↓
Verify
  ↓
Complete
(+ optional Transfer)
```

Hard rule: reorganise / relabel / deduplicate existing meaning — **do not invent** instructional meaning.

### Implication

A2 demonstrates a coherent learning episode from existing pipeline meaning. A6 shows the boundary: without authored goals and richer evaluation framing, presentation alone cannot create an evaluative goal.

---

## Phase 3 — Cognitive Orchestration

**Status:** Emerging (Sprint 63 discovery focus)

### Key insight

> **Learning Journey and Cognitive Journey are not identical.**

The Learning Journey describes how an activity is **presented and paced**.  
A Cognitive Journey describes the **reasoning moves** a competent learner (or expert) actually performs.

#### Learning Journey (presentation)

```text
Frame
  ↓
Understand
  ↓
Model
  ↓
Apply
  ↓
Verify
  ↓
Complete
```

#### Potential Cognitive Journey (hypothesis)

```text
Question
  ↓
Evidence
  ↓
Reasoning
  ↓
Decision
  ↓
Justification
  ↓
Confidence
```

These may align, diverge, or nest depending on activity type. They must not be collapsed into one schema prematurely.

### Observations (from Sprint 62 design work)

| Source | Observation |
| ------ | ----------- |
| A2 redesign exercise | Causal analysis benefits from explicit goal + success criteria + model → apply → check; presentation made the episode coherent when meaning already existed |
| A6 boundary analysis | Evaluation/judgement needs criteria and justification moves; inventory-style tasks expose missing authored goal/framing |
| Educational redesign prototype | Uniform episode structure can feel repetitive when underlying reasoning tasks differ |

### Hypotheses (not decisions)

1. Cognitive orchestration problems may persist even when rendering is correct and journey labels are clear.
2. Different activities may require different cognitive sequences, not only different materials under the same beat labels.
3. Some “repetition” complaints may be **pattern collision** (different reasoning tasks forced through one uniform episode grammar).

---

## Phase 4 — Reasoning Visibility

**Status:** Emerging (Sprint 63 discovery focus)

Independent learners need to **see** how to think — not only what to read and what to produce.

### Recurring themes (hypotheses + evidence)

| Theme | Evidence / signal | Status |
| ----- | ----------------- | ------ |
| Evaluation criteria | Checklist promotion helped when criteria already exist; many activities lack explicit evaluative standards | Hypothesis: criteria must be authored/upstream |
| Judgement frameworks | A6 evaluative activities need more than decision tables + memos | Hypothesis: framework visibility ≠ material completeness |
| Self-checking | Verify beat + checklist works when criteria are concrete | Hypothesis: self-check needs criteria + revision cues |
| Answer validation | Expected output often restates completion, not quality of reasoning | Hypothesis: validation language is an information gap |
| Reasoning transparency | Worked examples model steps, but “why this move” is uneven | Hypothesis: model beats need explicit reasoning moves |
| Independent learner support | Renderer can organise existing meaning; cannot invent missing coaching | Finding: information availability limits presentation |

### Constraint

Document as **hypotheses and evidence**, not final design decisions. Sprint 63 must classify issues as:

- rendering issues
- orchestration issues
- information gaps

before any pipeline or schema evolution is proposed.

---

## Cognitive Pattern Investigation

**Working hypothesis:** Different activities embody different reasoning patterns and should not necessarily be treated as identical learning experiences.

### Provisional pattern map (RNA A1–A6)

| Activity | Candidate Cognitive Pattern | Status |
| -------- | --------------------------- | ------ |
| A1 | Classification | Provisional — requires Sprint 63 validation |
| A2 | Causal Analysis | Provisional — strong A2 redesign signal |
| A3 | Process Modelling | Provisional |
| A4 | Systems Analysis | Provisional |
| A5 | Comparative Analysis | Provisional |
| A6 | Evaluation & Judgement | Provisional — A6 boundary analysis |

### Related observation

Repetition concerns may arise because **fundamentally different reasoning tasks** are currently rendered through a **largely uniform episode structure** (explanation → model → practice → verify ± transfer).

Sprint 63 should validate, revise, or reject these candidates with evidence — not treat them as schema.

---

## Cumulative conclusion (end of Sprint 62)

| Layer | State |
| ----- | ----- |
| Renderer correctness | Largely achieved |
| Journey presentation | Materially improved |
| Cognitive orchestration | Opportunity area |
| Reasoning visibility | Emerging upstream concern |
| Pipeline / schema evolution | Possibly required later — **no redesign decisions yet** |

---

## Forward link

Next phase: **Sprint 63 — Cognitive Flow & Reasoning Visibility**  
Charter: [sprint-63-cognitive-flow-and-reasoning-visibility.md](../sprints/sprint-63-cognitive-flow-and-reasoning-visibility.md)
