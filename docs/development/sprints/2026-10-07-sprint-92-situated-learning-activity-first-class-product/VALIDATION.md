# Sprint 92 — Validation / test evidence

**Status:** **COMPLETE / CLOSED** — Gate 8 live E2E **PASS**  
**Sprint:** 92 — Situated Task First-Class Product  
**Dashboard:** [STATUS.md](STATUS.md)  
**Closure:** [SPRINT-92-CLOSURE.md](SPRINT-92-CLOSURE.md)

Canonical place for focused automated results and live acceptance evidence. Append rows; do not overwrite history. Live evidence and automated evidence both matter — test counts do not replace live acceptance.

---

## Protected baselines (reference)

| Gate | Last known | Notes |
| ---- | ---------- | ----- |
| First-class gate | **339/339** (2026-10-07, Sprint 92 close) | Preserved at close |
| Broad suite | **3705 / 3704 / 0 / 1** (PB-S-007) | Re-measure when warranted |

---

## Focused Sprint 92 tests

| Date | Suite / command | Result | Notes |
| ---- | --------------- | ------ | ----- |
| 2026-10-07 | `node --test tests/s92-situated-task-slice1-family-design-page.test.js` (+ LJ WP1/WP2) | **20/20 pass** | Gate 8 Slice 1 |
| 2026-10-07 | `tests/s92-situated-task-slice2-visual-action-support.test.js` (+ Expository VA + Slice 1) | **pass** | Gate 8 Slice 2 |
| 2026-10-07 | `npm run test:first-class` | **339/339 pass** | First-class regression (Slice 1 & 2) |
| 2026-10-07 | `tests/s88-first-class-local-instantiation.test.js` | **9/9 pass** | Existing families intact |
| 2026-10-07 | `tests/s92-situated-task-slice3-lj-commission.test.js` (+ S91 LJ commission suite) | **91/91 pass** | Gate 8 Slice 3 |
| 2026-10-07 | `npm run test:first-class` | **339/339 pass** | First-class regression (Slice 3) |
| 2026-10-07 | `tests/s92-situated-task-slice4-learner-package.test.js` (+ S91 LJ package + S92 slices) | **51/51 pass** | Gate 8 Slice 4 |
| 2026-10-07 | `npm run test:first-class` | **339/339 pass** | First-class regression (Slice 4) |
| 2026-10-07 | `tests/s92-situated-task-stage5-prompt-wiring.test.js` (+ S92 slices 1–4) | **47/47 pass** | Live E2E Stage 5 prompt-wiring regression |
| 2026-10-07 | `npm run test:first-class` | **339/339 pass** | First-class regression (Stage 5 wiring fix) |
| 2026-10-07 | `tests/s92-situated-task-slice5-enactability-record-surface.test.js` (+ S92 slices 1–4, Stage 5 wiring) | **57/57 pass** | Gate 8 Slice 5 — enactability + record entries → shared text_entry |
| 2026-10-07 | `npm run test:first-class` | **339/339 pass** | First-class regression after Slice 5 |
| 2026-10-07 | S92 focused (Slice 5 + related) after enactability heuristic removal | **58/58 pass** | Live false-positive fix |
| 2026-10-07 | `npm run test:first-class` | **339/339 pass** | After enactability heuristic removal |
| 2026-10-07 | `tests/s92-situated-task-lj-educational-handoff.test.js` (+ Slice 3/5) | **26/26 pass** | LJ educational handoff synthesis contract |
| 2026-10-07 | `npm run test:first-class` | **339/339 pass** | After LJ handoff contract |
| 2026-10-07 | `tests/s92-situated-task-*.test.js` (placement + all S92 slices) | **77/77 pass** | Optional record placement + `data-page-kind=situated_task` |
| 2026-10-07 | `npm run test:first-class` | **339/339 pass** | After placement/page-kind refinement |
| 2026-10-07 | Browser bundle rebuild/check | **PASS** | At presentation refinement |
| 2026-10-07 | **At close:** `tests/s92-situated-task-*.test.js` | **77/77 PASS** | Final known Sprint 92 suite evidence |
| 2026-10-07 | **At close:** `npm run test:first-class` | **339/339 PASS** | Final known first-class regression |
| 2026-10-07 | **At close:** browser rebuild/check | **PASS** | Final known browser artefacts |

---

## Live / manual validation

| Date | Scenario | Result | Evidence / notes |
| ---- | -------- | ------ | ---------------- |
| 2026-10-07 | Design gates 1–7 recorded (S92-D02…S92-D08) | Accepted | Docs only — no live product E2E yet |
| 2026-10-07 | Live Situated Task — valid page but how-to guide + no record surface | **Slice 5 fix** | Enactability prompt + `record.entries[]` → shared `text_entry`; external recording still valid when `entries` omitted. |
| 2026-10-07 | Live Workplace Investigation rejected `undertaking_not_independently_enactable` | **False-positive fixed** | Regex heuristic matched ordinary instructional prose. Removed semantic NL enactability from schema validation; Stage 5 prompt retained; structural empty/missing undertaking still fails. |
| 2026-10-07 | Commissioned c7 absorbed c6 design work under absolute standalone enactability | **Handoff contract** | Stage 5 / Situation / Activity honour explicit LJ educational dependencies; ORIGINAL_BRIEF surfaces commission_specification + journey_context + commission_dependencies; no learner-state transport. |
| 2026-10-07 | Live Situated Task — record entries consolidated after all sections; `data-page-kind=interactive` | **Presentation fix** | Optional `placement.after_section_id`; Stage 5 embedded/consolidated/hybrid contract; page-kind from `situated_learning` → `situated_task`. |
| 2026-10-07 | Live Situated Task run Stages 1–4 OK; Stage 5 rejected | **Defect fixed (wiring)** | Interactive-shaped JSON omitted `artifact_type` / `schema_version` / `situated_learning`. Root cause: Sprint 58 Interactive Design Page Copy fallthrough. Fix: LJ-style exclusion + Situated Copy branch. Validation not weakened. |
| 2026-10-07 | **Gate 8 live E2E — standalone accessibility Situated Task** (brief: university staff accessibility; investigate own context; improve practice; ~2–3 hours; five stages unsteered) | **PASS** | Situation / Activity / Support / Learning Return / Design Page all PASS. See [SPRINT-92-CLOSURE.md](SPRINT-92-CLOSURE.md). |
| 2026-10-07 | Live record → text_entry → browser-local draft save/restore | **PASS** | Manual persistence testing; no further persistence plumbing required. |
| 2026-10-07 | Final Stage 5 HYBRID placement acceptance | **PASS** | focus→choose; evidence→investigate; interpretation+improvement→interpret_improve; recheck→recheck; future_practice unplaced (consolidated). Model did not mechanically place every entry. Rendered: embedded after sections; consolidated for remainder; stable IDs; draft active; `data-page-kind="situated_task"`; `data-composed-activity-count="0"`. |

---

## Sign-off checklist (at close)

| Criterion | State |
| --------- | ----- |
| Product definition stable (gates 1–7) | **Met** |
| First-class product + pipeline | **Met** |
| Learning Journey commission intake | **Met** |
| Situated / LJ learner package | **Met** |
| Live representative cases (Gate 8) | **PASS** |
| Sibling product boundaries respected | **Met** |
| Automated suites at close | **77/77** · first-class **339/339** · browser **PASS** |
| Sprint status | **COMPLETE / CLOSED** ([S92-D10](decisions.md#s92-d10--close-sprint-92--situated-task-first-class-product-complete)) |
