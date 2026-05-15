# GPT bootstrap — Sprint 20 (Workflow Explainability and Settings UX)

**Role:** authoritative for **this pack only**.

**Pack path:** `docs/development/sprints/2026-05-15-sprint-20-workflow-explainability-settings-ux/`

**Use this document** to start a **fresh chat** for Sprint **20**: **Workflow Explainability and Settings UX** — improve how users **understand** and **tune** generated workflows after Sprint 19 reduced chat-heavy elicitation.

**Snapshots:** Read from **`context-files/`** when added; until then use canonical paths in §3.

---

## 1. Assistant role

You advance **Sprint 20** for PRISM: make generated workflows **easier to understand and tune** through **Settings discoverability** and **workflow explainability**, without reintroducing wizard-style questioning. You preserve **Sprint 18 Research** and **Sprint 19 LD** architecture (essentials blocking, assistive adequacy, pack-only policy where possible). You **do not** implement UI/runtime changes, redesign renderer/schema, merge Prompt Studio, or touch Research regression until a slice is **explicitly chartered**.

---

## 2. Sprint status

| Sprint | Status |
|--------|--------|
| **Sprint 20** | **Proposed / ready for charter** — bootstrap pack only; **no implementation** until Slice 20-1 chartered |
| **Sprint 19** | **Closed** — LD rationalisation (19-1–19-3); **118 tests** — [`../2026-05-15-sprint-19-ld-workflow-rationalisation/SPRINT-19-CHECKPOINT.md`](../2026-05-15-sprint-19-ld-workflow-rationalisation/SPRINT-19-CHECKPOINT.md) |
| **Sprint 18** | **Closed** — Research contextual refinement; **100 tests** at closeout |
| **Sprint 17** | **Closed** — Research sparse essentials |

---

## 3. Read-first order

1. **`CURRENT-STATE.md`** — verification floor and file map  
2. **`HANDOVER.md`** — purpose, boundaries, slice sequence  
3. **`sprint-20-bootstrap.md`** — thesis, goals, Slice 20-1 outline  
4. [`docs/consolidation/sprint-19-closeout.md`](../../../consolidation/sprint-19-closeout.md) — what Sprint 19 delivered  
5. [`docs/consolidation/contextual-refinement-architecture-note.md`](../../../consolidation/contextual-refinement-architecture-note.md) — four-layer model  
6. **`domains/learning-design/domain-learning-design-step-patterns.md`** — current LD policy  
7. **`review-log.md`** — decisions log  

---

## 4. Architectural headline

Sprint 18/19 established: *minimal interrogation → concrete workflow → assistive adequacy + Settings for tuning*.

Sprint 20 asks: *After we stop asking so many questions, can users still see **what was assumed** and **where to tune** without chat?*

**Core principle:** Generate good workflows with minimal interrogation, then **clearly expose assumptions and tuning affordances afterward**.

**Rule:** Runtime interprets policy; packs declare policy. Sprint 20 focuses on **Factory UX** that surfaces existing mappings and resolved state — not new mandatory elicitation.

---

## 5. Architectural inheritance (do not regress)

| Layer | Role |
|-------|------|
| **Required essentials** | **Blocking** when missing — pre-synthesis |
| **Workflow synthesis** | Creates the **concrete** step graph |
| **Planning adequacy** | **Advisory / non-blocking** — Planning panel only |
| **Step Settings** | **Authoritative** for step-level tuning (`mappingRules` → `stepParams`) |
| **Optional profile refinement** | **Convenience only** — empty required tiers after 19-3; opt-in optional |

---

## 6. Sprint 20 bootstrap deliverables

| Deliverable | Status |
|-------------|--------|
| Sprint 20 portable pack (7 files) | **Done** — this folder |
| Slice 20-1 charter (Settings Discoverability) | **Next** — to create when starting implementation |
| Runtime / renderer implementation | **Deferred** — chartered per slice |
| Research regression | **Frozen** — no changes unless chartered |

---

## 7. Boundaries (bootstrap)

- **No** implementation, runtime rewrite, renderer/schema redesign, or Prompt Studio merge in bootstrap.  
- **No** return to heavy pre/post-design chat elicitation.  
- **No** AI-generated adequacy copy (deterministic pack text only, per Sprint 18).  
- **No** LD validation/conflict framework unless evidence emerges (Sprint 19 backlog).  
- **No** Research pack or S1–S13 changes.

---

## 8. Verification

```bash
node --test tests/*.test.js
```

**Expected:** **118 passed**, 0 failed (docs-only bootstrap).

---

## 9. Recommended first task

Charter and implement **Slice 20-1 — Settings Discoverability** (see `sprint-20-bootstrap.md` § Slice 20-1).

---

## Copy-paste block for the assistant

You are assisting with Sprint 20 — Workflow Explainability and Settings UX for PRISM.

Sprint 19 (closed): LD askRefinementByDefault false; 4 structural planningAdequacyChecks; stepRefinementProfiles required tiers emptied; app.js unchanged; Research S1–S13 frozen; 118 tests passed.

Sprint 20 (bootstrap): After less chat elicitation, improve Settings discoverability and workflow explainability so users can tune assessment/page/activity parameters without interrogation. Do not implement until Slice 20-1 is chartered.

Core principle: minimal interrogation during design; clear assumptions and tuning affordances afterward. Essentials blocking; adequacy advisory; Settings authoritative; optional profile opt-in only.

Recommended first slice: 20-1 Settings Discoverability — badges, editable-in-Settings indicators, Planning-panel links, summaries for common params (assessment type/count, page profile, tone, depth, examples).

Out of scope unless chartered: runtime rewrite, schema redesign, Prompt Studio merge, AI adequacy, heavy elicitation, Research changes.

Start by reading:
1. docs/development/sprints/2026-05-15-sprint-20-workflow-explainability-settings-ux/sprint-20-bootstrap.md
2. docs/consolidation/sprint-19-closeout.md
3. docs/consolidation/contextual-refinement-architecture-note.md

Baseline: node --test tests/*.test.js → 118 passed.
