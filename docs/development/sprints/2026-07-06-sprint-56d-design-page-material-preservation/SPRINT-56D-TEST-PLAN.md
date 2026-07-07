# Sprint 56D — Test Plan

**Sprint:** 56D — Design Page Material Preservation Fix  
**Date:** 2026-07-06  
**Status:** Active

**Reference:** [Implementation Tasks](SPRINT-56D-IMPLEMENTATION-TASKS.md) · [Preservation Failure Report](SPRINT-56D-PRESERVATION-FAILURE-REPORT.md)

---

## Test philosophy

1. **Evidence-first** — capture GAM and Design Page JSON from reproduction workflow before writing assertions
2. **Deterministic** — prefer fixture-based equality over live Copilot runs in CI
3. **Boundary-focused** — assert GAM → page JSON first; HTML second
4. **No runtime-quality claims** — tests prove structural preservation, not pedagogical quality

---

## Core preservation tests

### T1 — GAM → Design Page material body equality

**Purpose:** Prove each `activity.materials.<field>` body equals upstream GAM `Content:` body.

| Input | Assertion |
| ----- | --------- |
| Fixture: GAM `activity_materials` capture | Parsed upstream bodies |
| Fixture: Design Page `page` JSON (post-fix) | `strictEqual` or normalized string equality per field |
| M1, M2, M5, M9, M15 | Full body match |

**Suggested file:** `tests/sprint-56d-gam-material-preservation.test.js`

---

### T2 — Material ID and order preservation

**Purpose:** Prove material IDs, activity IDs, and field key mapping survive compose.

| Assertion |
| --------- |
| `count(activity.materials keys) === count(GAM Material blocks)` per activity |
| Material order preserved relative to GAM |
| No orphan or invented material IDs |

**Reuse:** Patterns from `lib/ld-design-page-compose-contract.js` PRE-EMIT VALIDATION language.

---

### T3 — No ellipsis insertion test

**Purpose:** Detect `...` used as body truncation marker.

| Assertion |
| --------- |
| No material body ends with `...` unless present in GAM source |
| No mid-body ellipsis replacing omitted paragraphs |

---

### T4 — No summarisation language test

**Purpose:** Reject catalogue/synopsis substitutes.

**Reuse:** `lib/design-page-materials-fidelity.js` heuristics:

- `looksLikeMaterialDescriptionSynopsis`
- `PLACEHOLDER_ONLY_LABEL_RES`
- `MATERIAL_CATALOGUE_META_RES`

| Assertion |
| --------- |
| No material field matches synopsis-only patterns when GAM body is rich |
| `design-page-materials-fidelity` reports zero placeholder violations on fixed page |

---

## HTML / renderer tests

### T5 — HTML contains full M1/M2/M5/M9/M15 bodies

**Purpose:** Confirm renderer faithfully transports preserved JSON to HTML.

| Assertion |
| --------- |
| Distinctive substrings from full GAM bodies appear in HTML export |
| Not merely section headings or activity titles |

**Suggested extension:** `tests/sprint-56d-html-material-survival.test.js` or extend `tests/page-gam-materials-projection.test.js`

---

### T6 — Renderer hidden-content / CSS sanity test

**Purpose:** Rule out CSS/DOM hiding when JSON is complete.

| Assertion |
| --------- |
| When page JSON contains full body, HTML text content length ≥ threshold ratio vs JSON |
| No `display:none` / `visibility:hidden` on primary material containers (if applicable) |

**Note:** This test is **secondary** — failure report already rules out renderer as first failure point when JSON is thin.

---

## Application path tests (conditional — OQ-56D-00)

These tests apply **only if** application preservation/repair paths are proven to execute during workflow reproduction. Workflow runtime compose tests (T1–T4) are primary.

### T7 — `applyGamMaterialsToComposedPage` overwrite test

**Purpose:** If post-compose preserve runs on the proven path, verify it restores thin LLM output.

**Prerequisite:** OQ-56D-00 = yes.

| Setup | Assertion |
| ----- | --------- |
| Thin page JSON fixture + full GAM upstream | Output materials match GAM verbatim |
| Already-full page JSON | Idempotent — no corruption |

**File:** Extend `tests/page-49-6b-gam-material-preservation.test.js` or `tests/page-gam-materials-projection.test.js`

---

### T8 — Capture normalization does not select thin candidate

**Purpose:** If `normalizePageWorkflowCapture` runs on the proven path, ensure it picks the fullest page object.

**Prerequisite:** OQ-56D-00 = yes (capture normalize proven).

| Setup | Assertion |
| ----- | --------- |
| Multi-candidate Copilot output with thin + full variants | Normalizer selects higher-scoring full candidate |

**File:** `tests/workflow-page-capture-normalize.test.js` (if exists) or new case

---

## React diagnostics (separate track)

### T9 — React #185 reproduction test

**Purpose:** Document and optionally guard against render loop regression.

| Approach |
| -------- |
| Manual reproduction checklist first |
| If automatable: mount page preview with large fixture; assert no infinite update within N renders |
| Record: oversized content, malformed JSON, state loop, or unrelated UI |

**Status:** Investigation — not a preservation blocker.

---

## Regression bundle

Run after each fix tranche:

```bash
node --test tests/sprint-56d-gam-material-preservation.test.js tests/page-gam-materials-projection.test.js tests/page-49-6b-gam-material-preservation.test.js tests/design-page-materials-fidelity.test.js tests/ld-materials-copy.test.js tests/ld-design-page-compose-contract.test.js
```

Include existing 56C gate tests if compose/preserve paths change:

```bash
node --test tests/sprint-56c-wave2-gates.test.js
```

---

## Fixture requirements

| Fixture | Source | Status |
| ------- | ------ | ------ |
| GAM capture (reproduction workflow) | End-to-end run | **To capture** |
| Thin Design Page output (pre-fix) | End-to-end run | **To capture** |
| Expected full page (post-fix) | Derived from GAM | **After fix** |

Store under `tests/fixtures/sprint-56d/` when captured (redact if needed).

---

## Pass criteria

| Gate | Criterion |
| ---- | --------- |
| **Primary** | T1–T4 pass on reproduction fixtures |
| **Secondary** | T5–T7 pass |
| **Tertiary** | T6 sanity pass when JSON complete |
| **Separate** | T9 documented (fix optional) |

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `SPRINT-56D-TEST-PLAN.md` |
| Sprint | 56D |
