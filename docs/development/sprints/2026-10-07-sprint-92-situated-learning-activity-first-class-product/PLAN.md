# Sprint 92 — Plan / work log

**Status:** **OPEN**  
**Dashboard:** [STATUS.md](STATUS.md)  
**Design map:** [PRODUCT-DESIGN-MAP.md](PRODUCT-DESIGN-MAP.md)  
**Implementation map:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md)  
**Charter:** [SPRINT-92-CHARTER.md](SPRINT-92-CHARTER.md)

Gate/task IDs: `S92-T-###`, `S92-D##`, `S92-AD-###`.

Append completed work here; do not reconstruct sprint state from chat.

---

## Programme posture

```text
Sprint pack / opening (S92-D01)       COMPLETE (2026-10-07)
Product design gate 1                   COMPLETE (S92-D02)
Product design gate 2                   COMPLETE (S92-D03)
Product design gate 3                   COMPLETE (S92-D04)
Product design gate 4                   COMPLETE (S92-D05)
Product design gate 5                   COMPLETE (S92-D06)
Product design gate 6                   COMPLETE (S92-D07)
Product design gate 7                   COMPLETE (S92-D08)
Implementation map                    AUTHORISED (Gate 8)
Production code                       NOT STARTED
Sprint 91                             COMPLETE / CLOSED — do not reopen
```

---

## Work packages

| WP | Focus | Status |
| -- | ----- | ------ |
| WP0 | Sprint scaffold + opening decision | **COMPLETE** |
| WP1 | Design gates 1–6 (product definition) | **COMPLETE** |
| WP2 | Design gate 7 (artefact / Design Page contract) | **COMPLETE** (S92-D08) |
| WP3 | Implementation map + first implementation slices | **ACTIVE** — map authorised; code not started |
| WP4 | Commissioning + LJ integration + live acceptance | **BLOCKED** on WP3 vertical slice |

---

## Log

| Date | Entry |
| ---- | ----- |
| 2026-10-07 | Sprint 92 opened (S92-D01). Documentation scaffold created. Design-before-implementation gate established. |
| 2026-10-07 | Product design gate 1 — educational purpose accepted (S92-D02). |
| 2026-10-07 | Product design gate 2 — boundary against sibling products accepted (S92-D03). |
| 2026-10-07 | Product design gate 3 — learner contract accepted (S92-D04). |
| 2026-10-07 | Product design gate 4 — authoring / design responsibilities accepted (S92-D05). |
| 2026-10-07 | Product design gate 5 — product invariants accepted (S92-D06). |
| 2026-10-07 | Product design gate 6 — predetermined design pipeline accepted (S92-D07). Gates 1–6 complete; Gate 7 next. |
| 2026-10-07 | Product design gate 7 — structured artefact / Design Page contract accepted (S92-D08). Graphics compatibility **B** (additive shared `purpose`). Gate 7 COMPLETE; Gate 8 Implementation active; IMPLEMENTATION-MAP authorised. No production code. |
| 2026-10-07 | S92-D09 — product name **Situated Task**, `product_id` `situated_task`, `acceptsCommission: true`. Gate 8 Slice 1 implementation begun (family + five-stage pipeline + Design Page). |
| 2026-10-07 | Gate 8 Slice 2 — shared visual purpose `action_support`; Situated Stage 5 optional section-scoped visual planning; shared planner/compiler/completion path. Gate 8 remains ACTIVE. |
| 2026-10-07 | Gate 8 Slice 3 — LJ supported-product allow-list + commissioning prompts include `situated_task`; shared commission intake creates ordinary Situated workflows; derived Production/Authoring/Complete status + Preview Create. No package/learner-package yet. Gate 8 remains ACTIVE. |
| 2026-10-07 | Gate 8 Slice 4 — Situated Task learner package via shared page publish path (`situated_task_page`); LJ package nests Complete Situated constituents under `cN/`; preflight reuses Sprint 91 enriched run-state. Record persistence still deferred. Gate 8 remains ACTIVE. |
| 2026-10-07 | Gate 8 live E2E defect — Stage 5 omitted `artifact_type` / `schema_version` / `situated_learning` (Interactive `page_synthesis` shape; `wrong_artifact_type`). Wiring fix: exclude Situated from Sprint 58 DP stamp/pipeline; `buildWorkflowStepInstructions` Situated Copy branch; seed clear; prompt mandatory-field hardening. No validation weaken / no repair. No new AD. Gate 8 remains ACTIVE. |
| 2026-10-07 | Gate 8 Slice 5 — live enactability + record surface: standalone `activity.undertaking`; optional `record.entries[]`; deterministic compose → shared `text_entry` + draft runtime; Situated draft identity stamp; S92-D08 clarification (semantics vs entries vs delivery). Gate 8 remains ACTIVE. |
| 2026-10-07 | Gate 8 Slice 5 follow-up — removed brittle `undertaking_not_independently_enactable` regex from schema validation (live Workplace Investigation false positive). Enactability remains Stage 5 prompt + live acceptance; structural empty undertaking still rejected. Gate 8 remains ACTIVE. |
| 2026-10-07 | Gate 8 — LJ educational handoffs: commissioned Situated synthesis must honour explicit prior-experience dependencies (c6→c7 live case); standalone still establishes own inputs; commission deps on deliverySeed + ORIGINAL_BRIEF; no runtime state transfer. Gate 8 remains ACTIVE. |
| 2026-10-07 | Gate 8 presentation refinement — optional `record.entries[].placement.after_section_id` (embedded / consolidated / hybrid); Stage 5 placement contract; compose/render after section vs consolidated; `data-page-kind="situated_task"` via `situated_learning` marker. No Stage 1–4 regen. Gate 8 remains ACTIVE. |
| 2026-10-07 | **Gate 8 PASS / Sprint 92 CLOSED** — live standalone accessibility Situated Task (Situation→Design Page) accepted; hybrid placement Stage 5 evidence; record/persistence manual pass; suites 77/77 + first-class 339/339. Close decision [S92-D10](decisions.md#s92-d10--close-sprint-92--situated-task-first-class-product-complete). No successor opened. |
