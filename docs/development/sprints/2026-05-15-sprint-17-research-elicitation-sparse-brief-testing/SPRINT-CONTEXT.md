# Sprint Context

**Role:** authoritative for **this pack only** (Sprint 17 portable continuity).

**Sprint:** Sprint 17 — Research Elicitation & Sparse Brief Testing

**Pack path:** `docs/development/sprints/2026-05-15-sprint-17-research-elicitation-sparse-brief-testing/`

**Physical snapshots:** `context-files/` — copies for upload to a fresh chat; **not** authoritative over live repo paths. Prefer repo roots for **`app.js`** and **`domains/research/`** when implementing.

---

## Sprint 17 focus

- **Goal:** Improve Research **workflow elicitation** and **sparse-brief** robustness — factor resolution, inference vs ask, assumption visibility.
- **Framing:** **Bounded planning semantics** — use Research as a **diagnostic surface**; capture LD lessons **without** LD implementation.
- **Not in scope:** renderer, workflow schema redesign, domain-pack rewrite, orchestration architecture, LD sprint work.

---

## Baseline (closed — do not reopen)

| Sprint | Role |
|--------|------|
| **Sprint 16** | **Closed** — shared `page` renderer; shape-first tests; **80 passed** |
| **Sprint 15** | Research → Design Page → `page` → Utilities HTML proof |
| **Sprint 14** | Runnable Research + save/export integrity |

Treat **`context-files/sprint-16-renderer-page-contract-stabilisation.md`** as **closed baseline only**. Renderer changes are **out of scope** unless hard regression.

---

## Research planning surface (Sprint 17)

| Layer | Location |
|-------|----------|
| Pack config | `domain-research-step-patterns.md` — `workflowBriefConfig`, `workflowPolicy` |
| Runtime | `app.js` — `extractWorkflowBriefExplicitFactors`, `resolveWorkflowBriefFactors`, elicitation queue, `applyWorkflowDesignHeuristics` |
| Tests (extend) | `workflow-research-*.test.js`, `workflow-brief-*.test.js` |
| Fixtures (create) | `tests/fixtures/workflow-brief-research-sparse/` — **S1–S6** |

**Required factors (Research):** `objective_type`, `input_strategy`, `audience`, `output_depth`.

**No `refinementFactors`** in Research pack — essentials-only elicitation.

---

## Consolidation artefacts (Sprint 17)

| Artefact | Purpose |
|----------|---------|
| `context-files/sprint-17-research-elicitation-sparse-brief-prep.md` | Prep note: audit, S1–S6 table, heuristics candidates |
| `context-files/sprint-17-index.md` | Consolidation index |
| `context-files/domain-research-step-patterns.md` | Pack policy source |
| `context-files/sprint-16-*.md` | Closed renderer baseline |

**Live canonical:** `docs/consolidation/sprint-17-research-elicitation-sparse-brief-prep.md`

---

## Read-first order (from this pack)

1. `context-files/sprint-17-research-elicitation-sparse-brief-prep.md`
2. `context-files/sprint-17-index.md`
3. `context-files/domain-research-step-patterns.md` (Workflow Brief Config + Workflow Policy)
4. `context-files/domain-research-artefacts.md`
5. `context-files/tests/workflow-research-validation-intent.test.js` + `workflow-research-design-page-heuristic.test.js`
6. `context-files/domain-learning-design-step-patterns.md` — **comparison only**
7. Live `app.js` when repo mounted

---

## Verification command

```bash
node --test tests/*.test.js
```

**Baseline:** **80 passed**, 0 failed (2026-05-15).

---

## Review log

- **2026-05-15** — Sprint 17 portable context pack created.
