# GPT bootstrap — Sprint 21 (Pack-defined Step Parameter Controls)

**Role:** authoritative for **this pack only**.

**Pack path:** `docs/development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/`

**Use this document** to start a **fresh chat** for Sprint **21**: **Pack-defined Step Parameter Controls** — complete the **parameterised workflow front-end** by making pack-defined `stepParams` **first-class editable Settings controls**, generically rendered by runtime.

**Snapshots:** Read from **`context-files/`** when added; until then use canonical paths in §3.

---

## 1. Assistant role

You advance **Sprint 21** for PRISM: make **Settings the full workflow parameter editor** so every relevant pack-defined parameter is **inspectable**, **editable**, **human-readable**, and **generically rendered** — without bespoke runtime UI per parameter.

You preserve **Sprint 18–20 architecture**: lightweight elicitation, essentials blocking, advisory adequacy, provenance model, pack-driven policy, generic runtime, no wizard regression.

You **do not** implement changes, redesign synthesis, merge Prompt Studio, overhaul schema, or expand blocking elicitation until a slice is **explicitly chartered**.

---

## 2. Sprint status

| Sprint | Status |
|--------|--------|
| **Sprint 21** | **Proposed / ready for charter** — bootstrap pack only; **no implementation** until Slice 21-1 chartered |
| **Sprint 20** | **Closed** — explainability + Settings UX; **135 tests** — [`docs/consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) |
| **Sprint 19** | **Closed** — LD rationalisation; **118 tests** |
| **Sprint 18** | **Closed** — Research contextual refinement; **100 tests** |

---

## 3. Read-first order

1. **`CURRENT-STATE.md`** — verification floor and gap statement  
2. **`HANDOVER.md`** — purpose, boundaries, recommended slice sequence  
3. **`sprint-21-bootstrap.md`** — thesis, two-tier model, Slice 21-1 outline  
4. [`docs/consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) — §11 Sprint 21 candidate  
5. [`docs/consolidation/sprint-20-parameterisation-reflection.md`](../../../consolidation/sprint-20-parameterisation-reflection.md) — parameterisation thesis  
6. [`docs/consolidation/contextual-refinement-architecture-note.md`](../../../consolidation/contextual-refinement-architecture-note.md) — guidance layers  
7. **`domains/learning-design/domain-learning-design-step-patterns.md`** — `mappingRules`, `stepParams`, `promptFactory`  
8. **`review-log.md`** — decisions log  

---

## 4. Architectural headline

Sprint 20 established: *generate with minimal questions; then show what was assumed, where it applies, and how to open Settings.*

Sprint 21 asks: *When users open Settings, can they edit **all relevant pack-defined parameters** through **generic controls** driven by pack metadata — not notes-only or hard-coded branches?*

**Core principle:** Packs declare **what parameters exist and how they render**; runtime **renders, persists, propagates, and explains** them generically.

**Rule:** Runtime interprets policy; packs declare policy. Sprint 21 completes the **Settings surface** of the parameterised workflow model — **not** a new synthesis architecture.

---

## 5. Two-tier parameter model (carry forward)

| Tier | When | Examples |
|------|------|----------|
| **Elicited** | Lightweight brief / essentials — **high-impact only** | Assessment type, item count, learner level, topic/scope, formative vs summative intent |
| **Settings-only** | After generation — richer tuning | Sequencing strategy, difficulty progression, distractor style, feedback granularity, answer visibility, retry/remediation, explanation depth, scaffolding intensity |

**Do not** force arcane configuration during synthesis. **Generate quickly**, then expose rich tuning in Settings.

---

## 6. Architectural inheritance (do not regress)

| Layer | Role |
|-------|------|
| **Required essentials** | **Blocking** when missing — pre-synthesis |
| **Workflow synthesis** | Creates the **concrete** step graph — unchanged architecture |
| **Planning adequacy** | **Advisory / non-blocking** |
| **Provenance** | Read-only over `resolvedState` — integrate with new controls |
| **Step Settings** | **Authoritative** — Sprint 21 makes this the **full parameter editor** |
| **Optional profile refinement** | **Convenience only** — no restored required tiers |

---

## 7. Sprint 21 bootstrap deliverables

| Deliverable | Status |
|-------------|--------|
| Sprint 21 portable pack (7 files) | **Done** — this folder |
| Slice 21-1 charter (parameter metadata + generic controls) | **Next** — create when starting implementation |
| Pack metadata schema / conventions doc | **Deferred** — part of 21-1 charter |
| Research regression | **Frozen** — no pack changes unless chartered |

---

## 8. Boundaries (bootstrap)

**In scope (when chartered):** pack-defined parameter metadata; generic Settings control rendering; typed controls; advanced/basic grouping; visibility rules; pack-driven Settings UX; provenance integration.

**Out of scope initially:** renderer rewrite; Prompt Studio merge; schema overhaul; pack validation framework; AI-generated parameter semantics; workflow diff/history; collaborative editing; runtime execution redesign.

---

## 9. Verification

```bash
node --test tests/*.test.js
```

**Expected:** **135 passed**, 0 failed (docs-only bootstrap).

---

## 10. Recommended first task

Charter **Slice 21-1** — pack parameter metadata conventions + generic Settings renderer MVP (see `sprint-21-bootstrap.md` § Slice 21-1).

---

## Copy-paste block for the assistant

You are assisting with Sprint 21 — Pack-defined Step Parameter Controls for PRISM.

Sprint 20 (closed): Settings discoverability, provenance, adequacy UX refinement; consolidated Factory interaction model; 135 tests passed. Settings still expose only part of mapped stepParams as first-class controls.

Sprint 21 (bootstrap): Make pack-defined stepParams inspectable and editable via generic Settings controls driven by pack metadata (labels, defaults, options, visibility, advanced/basic, elicitation priority). Two-tier model: elicited high-impact params in brief; richer params Settings-only after generation. Preserve lightweight elicitation, essentials, advisory adequacy, provenance, pack-driven architecture. Do not implement until Slice 21-1 is chartered.

Out of scope unless chartered: renderer rewrite, schema overhaul, Prompt Studio merge, blocking elicitation regression, AI parameter semantics, workflow diff/history.

Start by reading:
1. docs/development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/sprint-21-bootstrap.md
2. docs/consolidation/sprint-20-closeout.md (§11)
3. docs/consolidation/sprint-20-parameterisation-reflection.md

Baseline: node --test tests/*.test.js → 135 passed.
