# Sprint 22 — current state

**Date:** 2026-05-15  
**Pack path:** `docs/development/sprints/2026-05-15-sprint-22-unified-workflow-settings/`  
**Sprint:** 22 — Unified Workflow Settings surface  
**Status:** **Slices 22-1 through 22-3 implemented**; **LD metadata coverage expansion complete**

**Predecessor closeout:** [`docs/consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md)

**Entry point:** [`GPT-bootstrap-sprint-22.md`](GPT-bootstrap-sprint-22.md) · [`sprint-22-bootstrap.md`](sprint-22-bootstrap.md)

---

## Active sprint summary

| Sprint | Status |
|--------|--------|
| **Sprint 22** | **In progress (feature-complete for chartered slices)** — **185 tests** |
| **Sprint 21** | **Closed** — **149 tests** — [`../../../consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md) |
| **Sprint 20** | **Closed** — **135 tests** |
| **Sprint 19** | **Closed** — **118 tests** |

---

## Verification floor

```bash
node --test tests/*.test.js
```

| Metric | Value |
|--------|-------|
| **Tests** | **185 passed**, 0 failed |
| **Baseline** | Sprint 21 closeout (**149**) + Sprint 22 (**+34**) |
| **Research fixtures** | S1–S13 — **frozen** unless chartered |

---

## Delivered (chartered slices)

| Slice | Focus | Status |
|-------|--------|--------|
| **22-1 / 22-1.1** | Unified Settings shell, included-step aggregation, sync to notes | **Closed** |
| **22-2a** | Async brief-config recovery + Save merge | **Closed** |
| **22-2b** | `workflowParameterControls` + workflow notes persistence | **Closed** |
| **22-2c** | DOM-first re-read, partial briefConfig merge on Save, discovery by canonical step ID | **Closed** |
| **22-3** | Mode tabs, badge, save hint, planning/provenance → Settings navigation | **Closed** |
| **LD metadata expansion** | Pack-declared controls for core LD steps + workflow tunables | **Closed** |

---

## UI model (implemented)

```text
[ Run ]    [ Settings ]    [ Edit ]
```

- **Settings:** pack-declared workflow + included-step parameters only (no prompts).
- **Badge:** count of visible workflow + step controls for the selected workflow.
- **Save hint:** changes sync to notes; **Save** in workflow header persists.

---

## Architectural position (verified)

| Check | Result |
|-------|--------|
| Domain-pack agnostic runtime | Pass — manifest-driven discovery, no LD branches in unified paths |
| Controls source | Pack `workflowBriefConfig` only — not synthesized from `mappingRules` |
| Sprint 21 renderer / `[PRISM_STEP_PARAMS]` | Reused |
| Prompt editing | Edit / per-step Prompt Factory only |
| Synthesis / adequacy / provenance | Unchanged |

---

## LD pack metadata (post-expansion)

| Category | Count | Notes |
|----------|-------|--------|
| `workflowParameterControls` | **4** | `delivery_context`, `design_scope`, `input_strategy`, `duration_minutes` |
| `stepParameterControls` | **25** | Pilot expanded to core LD chain steps |
| Intentionally unmatched | `step_generate_learning_content` | No Prompt Factory `userOptions`; diagnostics name canonical ID |

---

## Accepted limitations

- **Unsupported steps** only where the pack has no declared `stepParameterControls` (e.g. `step_generate_learning_content`).
- Steps without `canonical_step_id` are excluded from Settings aggregation.
- **Same-session** recovered cache is refreshed when it under-covers included canonical step IDs; full page reload always re-fetches pack files.
- **Persisted** partial `briefConfig` is union-augmented on Settings open when canonical coverage is incomplete; **Save** merges empty control arrays from recovered config (22-2c).
- Research and general-only workflows have no step-level Settings controls unless pack metadata is added later.

---

## References

| Document | Role |
|----------|------|
| [`sprint-22-index.md`](sprint-22-index.md) | Pack index |
| [`review-log.md`](review-log.md) | Decisions log |
| [`HANDOVER.md`](HANDOVER.md) | Boundaries and handover |
| [`slice-22-1-charter.md`](slice-22-1-charter.md) | Slice 22-1 charter |
