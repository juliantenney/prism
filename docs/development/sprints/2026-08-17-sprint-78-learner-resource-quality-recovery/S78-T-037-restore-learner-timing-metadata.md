# S78-T-037 — Restore learner timing metadata

**Task:** S78-T-037  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-25)  
**Implements:** [S78-T-036](S78-T-036-learner-timing-metadata-regression-diagnostic.md) as revised by operator evidence  
**Sprint 78:** OPEN · **T-013:** remains OPEN · **T-019:** superseded by T-036  

---

## 1. Root-cause confirmation

Operator evidence on the assembled Lagrangian page:

| Field | Value |
| ----- | ----- |
| `activities[A1..A5].duration_minutes` | **absent** |
| `learning_sequence.total_duration_minutes` | **60** |
| `learning_sequence.timeline` durations | A1=8, A2=14, A3=16, A4=11, A5=11 (sum **60**) |

Learning Sequence **did generate** a complete, internally consistent timing allocation. vNext consumes `activities[].duration_minutes` (badges + header sum) and did not read timeline or LS total. Assembly copied the `learning_sequence` object without projecting timeline durations onto activity rows.

This is a **transport/projection defect**, not a DLA generation failure. T-036’s preference for DLA required-output salience is **not** the smallest correct fix given this evidence.

---

## 2. Exact assembly owner/path changed

| Item | Detail |
| ---- | ------ |
| **Owner** | `lib/page-vnext-assemble.js` `assembleVNextPageFromPartials` |
| **When** | After all stage merges, before `validateAssembledPageForRender` |
| **Action** | `projectTimelineDurationsOntoActivities(page)` copies `timeline[].duration_minutes` onto matching `activities[].duration_minutes` by `activity_id` |

Rules implemented:

- Do not overwrite a finite `activities[].duration_minutes`.
- Do not write a duration when the matching timeline entry has none.
- First matching timeline entry per `activity_id` (no sum / no second allocation).

---

## 3. Exact vNext fallback changed

| Item | Detail |
| ---- | ------ |
| **Header** | `lib/learner-renderer-vnext/build-page-model.js` uses `resolveHeaderDurationMinutes`: activity-duration **sum when &gt; 0**, else finite `learning_sequence.total_duration_minutes`, else `null` |
| **Already-assembled pages** | Non-mutating `pageWithProjectedTimelineDurations` so stranded timeline durations still reach activity models/badges on export without requiring re-assembly |

Helper: `lib/learner-renderer-vnext/project-timeline-durations.js`.

---

## 4. Timing ownership conclusion

**Learning Sequence is the authoritative generated timing source** for this path. DLA was **not** made a second timing authority. `duration_minutes` was **not** added to the DLA required-output contract.

Activity-row `duration_minutes` remains the field vNext already renders; LS timeline (and LS total for the header) now **transport** into that field / header fallback.

---

## 5. Tests added/changed

| File | Change |
| ---- | ------ |
| `tests/s78-t-037-learner-timing-metadata.test.js` | **Added** — Lagrangian-shaped live export path |
| `tests/page-vnext-assemble.test.js` | Projection, explicit-win, no-fabricate, grouping-not-projected |

---

## 6. Test results

```text
tests/s78-t-037-learner-timing-metadata.test.js  5/5 pass
tests/page-vnext-assemble.test.js                 pass (incl. 3 new timing tests)
tests/learner-renderer-vnext-export-shell.test.js pass
tests/learner-renderer-vnext-model.test.js        pass
tests/learner-renderer-vnext-browser-artefact-freshness.test.js  pass (after rebuild)
```

---

## 7. Per-activity confirmation (8 / 14 / 16 / 11 / 11)

Lagrangian-shaped fixture (activity durations stripped; timeline as operator evidence) produces vNext models and export badges:

- A1 **8 min**
- A2 **14 min**
- A3 **16 min**
- A4 **11 min**
- A5 **11 min**

---

## 8. Header confirmation (60 minutes)

Same fixture: sticky header `.util-learning-header__duration` is **`60 mins.`** (activity-sum after projection). Fallback path (no activity or timeline durations, `total_duration_minutes: 60`) also yields **`60 mins.`** with no activity time badges.

---

## 9. Grouping inspection

Timeline schema **may** carry `grouping` (`LearningSequenceTimelineEntry`). Operator evidence did **not** show grouping stranded on the timeline. DLA-WB-04 / 56F treat grouping as a DLA activity-row field, not LS timing transport.

Assembly test with `timeline[0].grouping = "pairs"`: `activities[].grouping` remains absent. **No grouping projection implemented.**

---

## 10. Files changed

| File | Change |
| ---- | ------ |
| `lib/page-vnext-assemble.js` | Timeline → activity duration projection at assemble |
| `lib/learner-renderer-vnext/project-timeline-durations.js` | **Added** — projection + header fallback helpers |
| `lib/learner-renderer-vnext/build-page-model.js` | Non-mutating projection + LS-total header fallback |
| `lib/learner-renderer-vnext-browser.js` | Regenerated bundle |
| `lib/learner-renderer-vnext-export-runtime.js` | Regenerated (build script) |
| `lib/learner-renderer-vnext-export-runtime-source.js` | Regenerated (build script) |
| `tests/s78-t-037-learner-timing-metadata.test.js` | **Added** |
| `tests/page-vnext-assemble.test.js` | Three projection tests |
| This record + sprint navigation | STATUS, PLAN, HANDOVER, START-HERE, next-chat-briefing |

**Not changed:** DLA contract, schemas, grouping, learner activities, renderer selection.

---

## 11. Unresolved risks

- **Dual projection sites:** assemble writes onto the canonical page; vNext also projects in-memory so already-assembled artefacts export correctly. Logic is duplicated in assemble UMD vs `project-timeline-durations.js` (browser assemble cannot require the vNext helper). Drift is a hygiene risk, not a second timing *allocation*.
- **Existing stored Lagrangian JSON** still lacks `activities[].duration_minutes` until re-assembled; **re-export** now shows timing via vNext projection. Re-assembly persists the field.
- Header fallback uses LS total only when activity sum is 0. A **partial** explicit activity set (some durations, some missing, no timeline) still shows a **partial sum**, as before.

---

## 12. Sprint 78 / T-013 state

| Item | State |
| ---- | ----- |
| Sprint 78 | **OPEN** |
| T-013 | **OPEN** |
| T-036 | Diagnostic complete (superseded preferred-fix: DLA salience) |
| T-037 | **Implementation complete** |

Do **not** close T-013 or Sprint 78 from this task.
