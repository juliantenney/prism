# GPT bootstrap — Sprint 17 (Research Elicitation & Sparse Brief Testing)

**Role:** authoritative for **this pack only**.

**Pack path:** `docs/development/sprints/2026-05-15-sprint-17-research-elicitation-sparse-brief-testing/`

**Use this document** to start a **fresh chat** for Sprint **17**: **Research workflow elicitation** and **sparse-brief** robustness — **bounded** planning/factor work only.

**Snapshots:** Read from **`context-files/`** when the repo root is not attached.

---

## 1. Assistant role

You improve **Research** workflow **elicitation quality** and **sparse-brief** robustness: factor resolution, inference, questioning, and assumption disclosure. You use Research as a **simpler diagnostic surface** for planning behaviour. You **do not** change the renderer, **do not** redesign workflow schema, **do not** run a broad domain-pack rewrite, and **do not** implement Learning Design changes (LD lessons may be **documented only**).

---

## 2. Sprint status

| Sprint | Status |
|--------|--------|
| **Sprint 17** | **Active** — Research elicitation & sparse-brief testing (prep complete; implementation starting) |
| **Sprint 16** | **Closed baseline** — shared `page` renderer hardening; shape-first tests; **80 passed** |
| **Sprint 15** | **Baseline only** — Research → Design Page → `page` → Utilities HTML |
| **Sprint 14** | **Baseline only** — runnable Research + save/export integrity |

---

## 3. Read-first order

1. **`context-files/sprint-17-research-elicitation-sparse-brief-prep.md`** — prep note (audit, factor inventory, sparse examples S1–S6, elicitation heuristics)
2. **`context-files/sprint-17-index.md`** — consolidation index
3. **`context-files/domain-research-step-patterns.md`** — Research `workflowBriefConfig`, `workflowPolicy`, Design Page §13
4. **`context-files/domain-research-artefacts.md`** — Research artefact catalogue (if present)
5. **`context-files/domain-learning-design-step-patterns.md`** — **cross-domain comparison only** (do not implement LD)
6. **`context-files/sprint-16-renderer-page-contract-stabilisation.md`** — **closed baseline only** (renderer out of scope)
7. **`context-files/tests/`** — existing workflow-brief and Research heuristic tests
8. **Live repo (when mounted):** `app.js` — `extractWorkflowBriefExplicitFactors`, `resolveWorkflowBriefFactors`, `applyWorkflowDesignHeuristics`, elicitation queue (~5840+)

---

## 4. What is already proven (Sprint 16 baseline)

- **Shared `page` renderer** hardened for Research and LD string/structured sections.
- **Shape-first regression:** `tests/fixtures/page-render/`, `tests/utility-page-render.test.js`.
- **Automated regression:** `node --test tests/*.test.js` → **80 passed, 0 failed** (2026-05-15).

**Sprint 17 does not reopen renderer work** unless a hard regression appears.

---

## 5. Sprint 17 focus (prep findings)

| Area | Current state |
|------|----------------|
| **Required factors** | Four: `objective_type`, `input_strategy`, `audience`, `output_depth` |
| **Refinement** | Research has **no** `refinementFactors`; elicitation is **essentials-only** (max 4 questions) |
| **Explicit extract** | Shared `extractWorkflowBriefExplicitFactors` applies **LD-style regex** to Research briefs |
| **Pack inference** | Minimal — mainly briefing → `objective_type` |
| **Main risk** | **Topic-only generation** when upload/source language appears without actual `inputs` |
| **Visibility** | Assumption disclosure is **limited** (resolved panel exists; no planning-assumptions block) |

---

## 6. Active Sprint 17 tasks

| Priority | Task |
|----------|------|
| **P0** | Create **sparse-brief golden fixtures S1–S6** under `tests/fixtures/workflow-brief-research-sparse/` |
| **P0** | Test **current** Research planner/factor-resolution **before** changing inference logic |
| **P1** | Inspect `extractWorkflowBriefExplicitFactors` and Research **`inferenceRules`** |
| **P1** | Define when to **infer**, **ask**, **proceed**, or **disclose** assumptions |
| — | **Avoid** renderer, schema redesign, workflow-generation overhaul, LD implementation |

---

## 7. Boundaries

- **Sprint 16 is closed** — do not reopen unless a hard renderer regression appears.
- **No** renderer / Utilities HTML changes.
- **No** new workflow schema.
- **No** broad domain-pack rewrite.
- **No** orchestration architecture redesign.
- **LD** — lessons may be **documented only**, not implemented in Sprint 17.

---

## 8. Recommended first task

1. Read **`context-files/sprint-17-research-elicitation-sparse-brief-prep.md`** §§**4, 9**.
2. Run **`node --test tests/*.test.js`** — confirm **80 passed**.
3. Add **S1–S6** golden fixtures pinning current `resolveWorkflowBriefFactors` + heuristic step sets **before** changing heuristics.

---

## Copy-paste block for the assistant

You are assisting with Sprint 17 — Research Elicitation & Sparse Brief Testing for PRISM.

Sprint 17 focus:
- improve Research workflow elicitation quality and sparse-brief robustness
- audit and test factor resolution, inference, questioning, and assumption disclosure
- use Research as a simpler diagnostic surface for planning/elicitation behaviour
- capture transferable lessons for Learning Design, but do not reopen LD as active implementation scope

Start by reading:
1. context-files/sprint-17-research-elicitation-sparse-brief-prep.md
2. context-files/sprint-17-index.md
3. context-files/domain-research-step-patterns.md
4. context-files/domain-research-artefacts.md if present
5. context-files/domain-learning-design-step-patterns.md only for cross-domain comparison
6. context-files/sprint-16-renderer-page-contract-stabilisation.md as closed baseline only

Active Sprint 17 tasks:
- create sparse-brief golden fixtures S1–S6
- test current Research planner/factor-resolution behaviour before changing logic
- inspect extractWorkflowBriefExplicitFactors and Research inference rules
- identify when to infer, ask, proceed, or disclose assumptions
- avoid renderer work, schema redesign, workflow-generation overhaul, or LD implementation

Boundaries:
- Sprint 16 is closed and should not be reopened unless a hard regression appears
- no renderer changes
- no new workflow schema
- no broad domain-pack rewrite
- no orchestration architecture
- LD lessons may be documented only, not implemented

Verification baseline:
node --test tests/*.test.js
Expected latest baseline: 80 passed, 0 failed

---

## Review log

- **2026-05-15** — Bootstrap prompt for Sprint 17 portable pack (post prep note; docs-only sprint start).
