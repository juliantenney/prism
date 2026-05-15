# Session Handover — Sprint 17 portable pack

**Role:** authoritative for **this pack only**.

**Pack path:** `docs/development/sprints/2026-05-15-sprint-17-research-elicitation-sparse-brief-testing/`

**Date:** 2026-05-15

---

## What this pack is for

Portable context for **Sprint 17 — Research Elicitation & Sparse Brief Testing**. Physical copies in **`context-files/`** for assistants without the full repo; refresh from canonical paths when policies change.

---

## Sprint 17 prep completed

Sprint **17** preparation is **complete** (documentation only — **no code**, schema, or renderer changes in prep).

| Deliverable | Path |
|-------------|------|
| Prep note | `docs/consolidation/sprint-17-research-elicitation-sparse-brief-prep.md` |
| Consolidation index | `docs/consolidation/sprint-17-index.md` |
| Portable pack | This folder |

---

## Sprint 17 purpose

Improve **Research** workflow **planning and elicitation** under **sparse user briefs**: what PRISM infers, what it asks, what workflow it produces, and whether that is safe. Use Research as a **bounded lab** for factor-resolution policy; capture **LD lessons** for later without implementing LD in this sprint.

**Pipeline (unchanged — planning layer only):**

```
Factory brief → getWorkflowBriefConfig → extractWorkflowBriefExplicitFactors
  → applyWorkflowBriefInferenceRules → AI intent merge → resolveWorkflowBriefFactors
  → [elicitation if required missing] → workflow generation → applyWorkflowDesignHeuristics
```

---

## Sprint 16 closed baseline (do not reopen)

Sprint **16** delivered:

- Shared **`page`** renderer hardening (Research string sections → markdown; metadata in `util-meta`).
- Shape-first fixtures: `tests/fixtures/page-render/`, `tests/utility-page-render.test.js`.
- **80 tests passed** (2026-05-15 closure).

**Do not reopen Sprint 16** unless a hard renderer regression appears.

---

## Headline findings (prep audit)

| Finding | Detail |
|---------|--------|
| **Four required factors** | `objective_type`, `input_strategy`, `audience`, `output_depth` |
| **No refinementFactors** | Research elicitation is **essentials-only** (`maxDefaultQuestions: 4`) |
| **Shared explicit extract** | `extractWorkflowBriefExplicitFactors` in `app.js` applies **LD-style regex** to Research briefs |
| **Minimal pack inference** | Research `inferenceRules` mainly map briefing language → `objective_type: briefing` |
| **Main sparse-brief risk** | **Topic-only generation** when upload/source language appears in goal text **without** populated `inputs` |
| **Assumption visibility** | Resolved panel shows factor sources; **no** dedicated “planning assumptions” disclosure block |

**Sparse brief examples (S1–S6)** are documented in the prep note §4 — use as golden-fixture sources.

---

## Existing tests (baseline — extend in Sprint 17)

| Test file | Role |
|-----------|------|
| `tests/workflow-research-validation-intent.test.js` | Validate Research Output strip/inject heuristic |
| `tests/workflow-research-design-page-heuristic.test.js` | Design Page append heuristic |
| `tests/workflow-brief-pass1.test.js` | Brief pass-1 / factor resolution patterns |
| `tests/workflow-brief-config-input-strategy.test.js` | Input strategy brief config |

**Snapshots in pack:** `context-files/tests/` (copies of the above).

**Gap (Sprint 17 P0):** no `tests/fixtures/workflow-brief-research-sparse/` yet — **create S1–S6 before changing inference**.

---

## Recommended first implementation step

1. Add **`tests/fixtures/workflow-brief-research-sparse/`** with golden payloads for **S1–S6** (sparse prompt text → expected `resolvedFactors` + allowed step titles).
2. Run against **current** behaviour to **pin baseline**.
3. Only then change `inferenceRules` or `extractWorkflowBriefExplicitFactors` (bounded diffs + tests).

---

## Boundaries (Sprint 17)

- No renderer / Utilities HTML work.
- No workflow schema redesign.
- No broad domain-pack rewrite.
- No orchestration architecture.
- LD implementation **out of scope** (documentation of cross-domain lessons only).

---

## What has been prepared in this pack

| File | Purpose |
|------|---------|
| `GPT-BOOTSTRAP-PROMPT.md` | Fresh-chat bootstrap + copy-paste block |
| `HANDOVER.md` | This handover summary |
| `SPRINT-CONTEXT.md` | Focus, boundaries, read-first order |
| `CURRENT-STATE.md` | Active sprint + closed Sprint 16 baseline |
| `context-files/` | Doc and test snapshots |

### `context-files/` inventory

| Snapshot | Canonical source |
|----------|------------------|
| `sprint-17-research-elicitation-sparse-brief-prep.md` | `docs/consolidation/` |
| `sprint-17-index.md` | `docs/consolidation/` |
| `sprint-16-renderer-page-contract-stabilisation.md` | Closed Sprint 16 baseline |
| `sprint-15-charter.md`, `sprint-15-index.md` | Sprint 15 baseline |
| `current-state.md` | `docs/development/` (point-in-time) |
| `domain-research-step-patterns.md` | Research workflow brief + policy |
| `domain-research-artefacts.md` | Research artefacts (**present**) |
| `domain-learning-design-step-patterns.md` | LD comparison only |
| `domain-learning-design-artefacts.md` | LD comparison / renderHints reference |
| `tests/workflow-research-*.test.js`, `workflow-brief-*.test.js` | Planning regression baseline |

---

## What to do next

1. Open **`GPT-BOOTSTRAP-PROMPT.md`** in a fresh chat (or paste the copy-paste block).
2. Read **`context-files/sprint-17-research-elicitation-sparse-brief-prep.md`**.
3. Run **`node --test tests/*.test.js`** — confirm **80 passed**.
4. Implement **S1–S6** golden fixtures; add tests that call factor resolution / heuristics without changing logic first.
5. Update prep note review log when a slice lands.

---

## Review log

- **2026-05-15** — Sprint 17 portable handover pack created (post prep note; docs-only; 80-test baseline).
