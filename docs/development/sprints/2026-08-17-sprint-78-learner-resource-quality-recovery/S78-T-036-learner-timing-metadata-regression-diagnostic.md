# S78-T-036 — Learner timing metadata regression diagnostic

**Task:** S78-T-036  
**Status:** **DIAGNOSTIC COMPLETE** (2026-08-25)  
**Mode:** Diagnostic / design only — **no production changes in this task**  
**Supersedes scope of:** [S78-T-019](S78-T-019-activity-timing-duration-diagnostic.md) (queued placeholder — diagnostic executed here)  
**Depends on:** [S78-T-035](S78-T-035-legacy-renderer-retirement-vnext-parity-diagnostic.md) (vNext is sole page renderer; timing is not a legacy-renderer parity issue)  
**Sprint 78:** OPEN · **T-013:** remains OPEN · **T-019:** superseded by this record (not executed separately)

---

## Decision (required)

> **Why is learner-facing timing absent, and what is the smallest correct fix?**

### A. Overall / page duration

**Why absent:** Operator evidence confirms `learning_sequence.total_duration_minutes: 60` on the latest assembled Lagrangian page, but vNext derives header duration **only** from the sum of `activities[].duration_minutes` ([`build-page-model.js`](../../../lib/learner-renderer-vnext/build-page-model.js) L183–237). When activity rows lack `duration_minutes`, the sum is `0` → `header.durationMinutes` is `null` → export omits `.util-learning-header__duration` ([`composeStandaloneVnextLearnerExport`](../../../app.js) → `utilityBuildVnextLearningHeaderIntro`). The LS total is **never read** by the vNext model.

**Not deliberate removal:** Sprint 67 established and still ships header duration presentation (`.util-learning-header__duration`). Export-shell tests assert duration when activity data is present. This is a **data + binding gap**, not a retired UI decision.

**Smallest correct fix (design only):**

| Option | Owner | Scope |
| ------ | ----- | ----- |
| **1 (preferred upstream)** | DLA contract + capture validation | Restore `duration_minutes` on every `activities[]` row so the existing activity-sum path works unchanged |
| **2 (renderer safety net)** | `lib/learner-renderer-vnext/build-page-model.js` | When activity sum is `0`/`null`, fall back to finite `page.learning_sequence.total_duration_minutes` |

Option 1 alone fixes both A and B when DLA emits per-activity durations. Option 2 is the minimal renderer-only patch for the header when LS total exists but activities do not.

### B. Per-activity duration

**Why absent:** vNext maps `activity.duration_minutes` → `durationMinutes` → `<span class="util-badge util-badge-time">` in [`render-activity.js`](../../../lib/learner-renderer-vnext/render-activity.js) L15–22. If `activities[].duration_minutes` is missing upstream, badges are correctly omitted — rendering is working; **data is absent**.

**Not deliberate removal:** Sprint 67 M6 field-coverage audit documents activity duration badges as live learner-facing behaviour. Timeline **purpose** text is intentionally excluded from learner surfaces; **duration badges** are not.

**Smallest correct fix (design only):**

| Option | Owner | Scope |
| ------ | ----- | ----- |
| **1 (preferred — matches 56F ownership)** | [`lib/ld-dla-page-enrich-contract.js`](../../../lib/ld-dla-page-enrich-contract.js) | Add `duration_minutes` and `grouping` to DLA partial **required output** (aligned with DLA-WB-03 and legacy DLA OUTPUT CONTRACT in `app.js` ~8783) |
| **2 (assembly bridge)** | [`lib/page-vnext-assemble.js`](../../../lib/page-vnext-assemble.js) | When merging `learning_sequence`, copy `timeline[].duration_minutes` onto matching `activities[]` rows where `duration_minutes` is still absent |
| **3 (renderer-only — not sufficient alone)** | vNext | Read timeline durations at model-build — duplicates LS data on a path that already owns activity rows |

Option 1 is the smallest **correct** owner per Sprint 56F (`duration_minutes` on DLA row → `page.activities[]`). Option 2 is a deterministic bridge when LS timeline carries per-activity timing but DLA omitted it.

---

## 1. Current timing architecture

### Canonical page artefact fields

| Field | Location | Owner (56F / schema) | Consumed by vNext learner export? |
| ----- | -------- | -------------------- | --------------------------------- |
| `activities[].duration_minutes` | Activity row | DLA (primary) | **Yes** — model + badges + header sum |
| `activities[].grouping` | Activity row | DLA | **Yes** — grouping badge (not timing) |
| `learning_sequence.total_duration_minutes` | Page LS block | Learning Sequence step | **No** |
| `learning_sequence.timeline[].duration_minutes` | LS timeline entry | Learning Sequence step | **No** (purpose text used for composition only) |
| `learning_sequence.timeline[].start_minute` | LS timeline entry | Learning Sequence step | **No** |

Schema reference: [`design-page.schema.vNext.json`](../../2026-07-07-sprint-56f-progressive-page-enrichment-architecture/design-page.schema.vNext.json) — activity and LS duration fields both defined.

### vNext model → HTML → export

```text
page JSON
  → build-page-model.js
      header.durationMinutes = Σ activityModels[].durationMinutes   (NOT learning_sequence.total)
      activity.durationMinutes ← activities[].duration_minutes
  → render-page.js
      inline <p class="util-page-duration"> when durationMinutes set
  → render-activity.js
      util-badge-time when activity.durationMinutes set
  → runLearnerRendererVNextExport (app.js)
      composeStandaloneVnextLearnerExport
        utilityStripVnextInlinePageHeader   ← removes inline header incl. util-page-duration
        utilityBuildVnextLearningHeaderIntro(model)  ← uses model.header.durationMinutes only
        utilityRenderVnextLearningStickyHeaderHtml → .util-learning-header__duration
```

Export intentionally rebuilds the sticky header from the **model**, not from stripped inline HTML ([S78-T-035](S78-T-035-legacy-renderer-retirement-vnext-parity-diagnostic.md) § timing is vNext-native).

### Assembly / enrichment propagation

| Stage | Timing behaviour |
| ----- | ---------------- |
| **Episode Plan shell** | [`page-shell-create.js`](../../../lib/page-shell-create.js) — `buildActivityShell` does **not** seed `duration_minutes`; field listed as forbidden at shell stage |
| **DLA enrich** | [`page-dla-enrich.js`](../../../lib/page-dla-enrich.js) — merges DLA rows; no duration-specific logic; **v2 partial contract omits `duration_minutes` from required output keys** |
| **GAM enrich** | Materials only — no duration |
| **Learning Sequence enrich** | [`page-vnext-assemble.js`](../../../lib/page-vnext-assemble.js) L357–362 — copies `learning_sequence` object only; **does not propagate `timeline[].duration_minutes` to `activities[]`** |
| **Design Page** | Transport / synthesis — no duration propagation |

---

## 2. Historical intended learner-facing behaviour

| Source | Intended behaviour |
| ------ | ------------------- |
| **Sprint 56F implementation plan** | `duration_minutes`, `grouping` from DLA row → `page.activities[]`; LS owns `total_duration_minutes` + timeline |
| **Sprint 56F ownership matrix** | “Structure from DLA; **timing from Sequence**” — dual authority, but learner renderer was wired to **activity rows** |
| **Sprint 67 M6 field coverage** | Header duration = **sum of activity durations**; activity `util-badge-time` badges; timeline **purpose** intentionally excluded (not duration badges) |
| **Sprint 67 closure** | `.util-learning-header__duration` retained as first-class presentation |
| **Legacy DLA prompt (`app.js` ~8783)** | Still lists `duration_minutes` on DLA `activities[]` output |
| **DLA workbook contract (T-008 exhibit)** | DLA-WB-03: sum of activity `duration_minutes` 50–70 |
| **S78 queued T-019** | Logged exhibit “activity time/duration not displayed” — **not** assumed renderer-owned |

**Nothing in sprint history deliberately removed learner-facing timing display.** The regression is **upstream field absence + vNext not binding LS total**.

---

## 3. Total-duration trace

| Step | Latest Lagrangian (operator + repo inference) | vNext behaviour |
| ---- | --------------------------------------------- | --------------- |
| LS step output | `learning_sequence.total_duration_minutes: 60` ✓ (operator) | Stored on assembled page |
| DLA / activities | **`activities[].duration_minutes` expected absent** (inferred — see evidence boundary) | No contribution to sum |
| Assembly | LS merged; activities unchanged w.r.t. duration | Gap persists |
| `build-page-model` | Sum = 0 → `durationMinutes: null` | LS total ignored |
| `render-page` fragment | No `util-page-duration` | — |
| Export shell | No `.util-learning-header__duration` | Confirmed by export-shell test pattern when activity durations deleted |

**Exact failure point:** **`build-page-model.js` L183–237** — binds header duration exclusively to activity sum; **`learning_sequence.total_duration_minutes` never consulted**.

---

## 4. Per-activity-duration trace

| Step | Expected | Observed path |
| ---- | -------- | ------------- |
| DLA partial capture | `duration_minutes` per activity (56F, DLA-WB-03, legacy prompt) | **Not in v2 required output list** ([`ld-dla-page-enrich-contract.js`](../../../lib/ld-dla-page-enrich-contract.js) `buildDlaSectionOutput`) |
| LS timeline | May include `duration_minutes` per block | **Not copied** to activities at assembly |
| Assembled page | `activities[].duration_minutes` | Expected missing on Lagrangian |
| `build-activity-model` | `durationMinutes: null` | Correct mapping |
| `render-activity` | No `util-badge-time` | Correct omission |

**Exact failure point (earliest):** **DLA v2 partial contract / capture** — duration not required on activity rows; optional **assembly** gap when LS timeline holds per-activity timing but activities do not.

---

## 5. Failure / omission points (summary)

| # | Layer | A. Page duration | B. Per-activity duration |
| - | ----- | ---------------- | ------------------------ |
| 1 | DLA contract / capture | Contributes via missing activity durations | **Primary omission** |
| 2 | LS → activity propagation | LS total not bound to header | Timeline durations not copied to activities |
| 3 | vNext model | Ignores `learning_sequence.total_duration_minutes` | Reads only `activities[].duration_minutes` |
| 4 | vNext HTML / export | Works when model has value | Works when model has value |
| 5 | Product decision to hide | **None** | **None** |

Classification: **generated but stranded in LS / never generated on activities** — **not** lost in HTML rendering, **not** intentionally suppressed.

---

## 6. Root cause

**Shared upstream gap:** Latest progressive-enrichment path does not reliably place `duration_minutes` on `page.activities[]`, while Learning Sequence correctly records session-level (`total_duration_minutes: 60`) and may record timeline-level timing.

**Split binding bug for page header:** vNext header duration follows Sprint 67’s **activity-sum** rule only and does not fall back to LS total — so a page can have authoritative session duration on `learning_sequence` and still show **no** learner-facing total when activity rows lack durations.

These are **independent display channels** with **related upstream data** but **different minimal fixes** (see Decision above).

---

## 7. Correct owners

| Concern | Owner |
| ------- | ----- |
| Per-activity `duration_minutes` generation | **DLA** — [`ld-dla-page-enrich-contract.js`](../../../lib/ld-dla-page-enrich-contract.js) + capture validation |
| LS timeline → activity duration bridge (if DLA still omits) | **Assembly** — [`page-vnext-assemble.js`](../../../lib/page-vnext-assemble.js) |
| Header fallback to LS total | **vNext model** — [`build-page-model.js`](../../../lib/learner-renderer-vnext/build-page-model.js) |
| Export header presentation | **Already correct** — `app.js` export shell |
| Per-activity badge presentation | **Already correct** — `render-activity.js` |

Do **not** assign to legacy renderer, CSS, or editable learner workspaces (out of scope).

---

## 8. Minimal proposed fix (implementation — not done in T-036)

**Recommended repair sequence:**

1. **DLA salience (primary):** Add to DLA v2 partial required output: `duration_minutes`, `grouping` on every `activities[]` row; reinforce DLA-WB-03 in contract tests.
2. **Optional assembly bridge:** On LS merge, for each `timeline[]` entry with finite `duration_minutes`, set `activities[id].duration_minutes` when absent.
3. **vNext header safety net:** In `build-page-model.js`, if activity sum is `0`/`null`, use finite `page.learning_sequence.total_duration_minutes`.

Steps 1+2 restore per-activity badges and header sum without renderer changes. Step 3 alone fixes header when only LS total exists.

**Proposed follow-on task:** authorised implementation record (e.g. T-037 timing metadata repair) — **not opened in this diagnostic**.

---

## 9. Required live-path regression tests (not implemented)

Existing coverage:

| Test | What it proves | Gap |
| ---- | -------------- | --- |
| [`learner-renderer-vnext-export-shell.test.js`](../../../tests/learner-renderer-vnext-export-shell.test.js) L408–504 | Live export shows `60 mins.` in sticky header when fixture activities have durations; **omits** duration when all `activity.duration_minutes` deleted | Does not use `learning_sequence.total_duration_minutes` |
| [`learner-renderer-vnext-model.test.js`](../../../tests/learner-renderer-vnext-model.test.js) | Model maps `durationMinutes: 12` from fixture | Unit-only |
| **None** | `util-badge-time` on live export path | **Missing** |

**Add after fix:**

1. Export integration: activities **without** `duration_minutes`, `learning_sequence.total_duration_minutes: 60` → header contains `60 mins.`
2. Export integration: activities **with** per-activity durations → header sum + each activity section contains `util-badge-time`
3. DLA contract test: partial output schema requires `duration_minutes` on each activity row (prompt-contract layer)

---

## 10. Evidence boundary

Repository evidence only. Generated run artefacts are not stored.

**Operator-established:** `learning_sequence.total_duration_minutes = 60` on latest assembled Lagrangian page.

**Still required from operator (one field check on same artefact):**

- For each `activities[]` row: is `duration_minutes` present and finite?
- Optional: for each `learning_sequence.timeline[]` row: is `duration_minutes` present?

If activities lack durations but timeline entries have them, that confirms **assembly bridge** (Option B2). If both lack per-activity durations, **DLA omission** is confirmed.

---

## 11. Files inspected

| Area | Path |
| ---- | ---- |
| vNext page model | `lib/learner-renderer-vnext/build-page-model.js` |
| vNext activity model | `lib/learner-renderer-vnext/build-activity-model.js` |
| vNext HTML | `lib/learner-renderer-vnext/render-page.js`, `render-activity.js` |
| vNext sequence context | `lib/learner-renderer-vnext/compose-sequence-context.js` |
| Export shell | `app.js` (`utilityBuildVnextLearningHeaderIntro`, `composeStandaloneVnextLearnerExport`, `utilityStripVnextInlinePageHeader`) |
| Assembly | `lib/page-vnext-assemble.js` |
| EP shell | `lib/page-shell-create.js` |
| DLA enrich | `lib/page-dla-enrich.js`, `lib/ld-dla-page-enrich-contract.js` |
| GAM enrich | `lib/page-gam-enrich.js` |
| Schema / history | Sprint 56F plan, ownership matrix, Sprint 67 M6 audit, Sprint 67 closure |
| Tests | `tests/learner-renderer-vnext-export-shell.test.js`, `tests/learner-renderer-vnext-model.test.js`, `tests/page-learning-sequence-enrich.test.js` |
| Fixtures | `tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json` |
| Sprint nav | `S78-T-019`, `S78-T-035`, `PLAN.md`, `STATUS.md` |

---

## 12. Files changed

| File | Change |
| ---- | ------ |
| `S78-T-036-learner-timing-metadata-regression-diagnostic.md` | **Created** — this record |
| `S78-T-019-activity-timing-duration-diagnostic.md` | **Note** — superseded by T-036 |
| `STATUS.md`, `PLAN.md`, `HANDOVER.md`, `next-chat-briefing.md`, `SPRINT-78-START-HERE.md` | **Minimal sprint navigation updates** |

**No production code, tests, schemas, or prompts changed.**

---

## 13. Sprint 78 state

| Item | State |
| ---- | ----- |
| Sprint 78 | **OPEN** |
| T-013 | **OPEN** |
| T-019 | **Superseded** by T-036 diagnostic (do not execute separately) |
| T-036 | **Diagnostic complete** — implementation not authorised here |
| Proposed follow-on | DLA salience + optional assembly bridge + vNext LS-total fallback + live-path tests |

Do **not** close T-013 or Sprint 78 from this diagnostic.
