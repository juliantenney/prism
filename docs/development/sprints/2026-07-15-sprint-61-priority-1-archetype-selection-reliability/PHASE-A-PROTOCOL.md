# Sprint 61 — Phase A Protocol (Frozen)

**Status:** Frozen — 2026-07-15  
**Authority:** [decisions.md](decisions.md) S61-D05 … S61-D10  
**Matrix:** [acceptance-matrix.md](acceptance-matrix.md)  
**Execution support (does not alter this freeze):** [PHASE-A-EXECUTION-GUIDE.md](PHASE-A-EXECUTION-GUIDE.md) · [OPERATOR-CHECKLIST.md](OPERATOR-CHECKLIST.md) · [BENCHMARK-LOGGING.md](BENCHMARK-LOGGING.md) · [artefacts/phase-a/README.md](artefacts/phase-a/README.md)  
**Do not change:** benchmark brief wording · product code · enrich-contract guidance (Phase A)

---

## 1. Purpose

Execute Phase A baseline measurement without methodological ambiguity. This document is the operator-facing protocol; decisions record the rationale.

---

## 2. Canonical harness (S61-D05)

| Requirement | Rule |
| ----------- | ---- |
| Workflow mode | **Partial-page only** (`pageEnrichmentV2` + `partialPageOutputs` both enabled) |
| Scored runs | All **30** scored Phase A runs use partial-page |
| Enrich-in-place | **Not** part of scored reliability metrics |
| Acceptance bar | Calculated **only** from partial-page scored runs |
| Architecture | Sprint 58 partial-page pipeline is baseline — do not reopen |

**Pre-run harness checklist:**

- [ ] `pageEnrichmentV2 === true`
- [ ] `partialPageOutputs === true`
- [ ] DLA step uses partial output contract (no upstream page shell embed)
- [ ] Fresh Copilot conversation per benchmark brief (or documented equivalent isolation)
- [ ] Soft-reload; clear `window.__PRISM_S59_*_TEST` globals before each run

---

## 3. Replication policy (S61-D06)

| Policy | Value |
| ------ | ----- |
| Runs per brief | **3** |
| Total scored runs (Phase A baseline) | **30** |
| Reliability unit | **Per brief** (aggregated from 3 runs) + per-run raw log |
| Single success | **Not** reliability evidence |

**Run ID pattern:** `A-<brief-id>-r1`, `A-S61-B01-r2`, … `A-S61-B10-r3`

Optional **non-scored smoke** (1 run on B09 + B01) may precede scored work to validate artefact capture; smoke runs are **excluded** from bar calculations.

---

## 4. Ordinary inputs (no-trigger)

- Sparse brief = **verbatim** workflow goal and/or primary LO statement (from frozen matrix).
- Allow deterministic Episode Plan shell generation from LOs (standard partial-page path).
- **Forbidden:** archetype coaching in Copilot chat; pasted DLA JSON; `S59_*_TEST`; manual archetype fields; enrich-in-place mode for scored runs.

---

## 5. Page-level archetype set (S61-D07)

For each DLA capture, compute:

```text
actual_set = { instructional_archetype on any required_materials[] row
               where the field is present and non-empty }
expected_set = { expected Priority-1 ID } or ∅ for no-archetype briefs
```

Record `actual_set` and `expected_set` on every run. Do **not** use subjective “primary material” judgement.

**Plan validity:** every row in `actual_set` must pass `validatePageArchetypePlans` / capture validation for its archetype shape.

---

## 6. Classification rules (S61-D08)

Apply **one** code per run using §7 precedence. Ten codes:

| Code | When to use |
| ---- | ----------- |
| `INVALID_TEST` | Benchmark conditions violated |
| `INVALID_PLAN` | Any Priority-1 row present but plan incomplete/invalid (capture validation fails on archetype fields) |
| `PERSISTENCE_FAILURE` | Valid emit in capture; Priority-1 fields lost or altered after persist/reload |
| `DELIVERY_FAILURE` | Valid persisted plans; `archetype_delivery.pass === false` when delivery check applies |
| `FALSE_POSITIVE` | `expected_set` empty; `actual_set` non-empty |
| `OVER_SELECTION` | `expected_set` non-empty; expected ID ∈ `actual_set` with valid plan; **and** `actual_set` ⊄ `expected_set` (extra Priority-1 IDs) |
| `WRONG_ARCHETYPE` | `expected_set` non-empty; `actual_set` non-empty; expected ID ∉ `actual_set` (wrong ID(s) only, or wrong + extras without expected) |
| `UNDER_SELECTION` | `expected_set` non-empty; `actual_set` empty |
| `CORRECT_SELECTION` | `expected_set` non-empty; `actual_set === expected_set`; all plans valid |
| `CORRECT_OMISSION` | `expected_set` empty; `actual_set` empty |

### Mixed-case examples

| Expected | Actual (Priority-1 set) | Classification |
| -------- | ----------------------- | -------------- |
| `{mechanism}` | `{mechanism, process}` | `OVER_SELECTION` |
| `{mechanism}` | `{process}` | `WRONG_ARCHETYPE` |
| `{mechanism}` | `{}` | `UNDER_SELECTION` |
| `{mechanism}` | `{mechanism}` (valid plans) | `CORRECT_SELECTION` |
| `∅` | `{mechanism}` | `FALSE_POSITIVE` |
| `∅` | `{}` | `CORRECT_OMISSION` |

**Delivery check applicability:**

- Required for `CORRECT_SELECTION`, `OVER_SELECTION`, `WRONG_ARCHETYPE` when evaluating delivery sub-criterion (not selection itself).
- If selection is `UNDER_SELECTION` or `CORRECT_OMISSION`, set `archetype_delivery.pass` to **NA** unless unexpected Priority-1 fields appear.
- `DELIVERY_FAILURE` applies only when persisted valid plans existed and delivery gate failed.

---

## 7. Classification precedence (S61-D08)

When multiple conditions could apply, assign the **first** matching code:

```text
1. INVALID_TEST
2. INVALID_PLAN
3. PERSISTENCE_FAILURE
4. DELIVERY_FAILURE
5. FALSE_POSITIVE
6. OVER_SELECTION
7. WRONG_ARCHETYPE
8. UNDER_SELECTION
9. CORRECT_SELECTION
10. CORRECT_OMISSION
```

---

## 8. Mandatory artefact pack (S61-D09)

Every **scored** run must retain files under:

```text
artefacts/phase-a/<benchmark-id>/<run-id>/
```

| File | Content |
| ---- | ------- |
| `meta.json` | benchmark ID, run ID, phase, timestamp, workflow name/id, harness flags |
| `brief.txt` | verbatim sparse brief used |
| `activation.json` | `selected_dla_test`, window S59 flags, stamp globals absent/present |
| `dla-prompt-excerpt.txt` | DLA Copy draft excerpt proving no S59 markers/emission blocks |
| `dla-capture.json` | raw DLA step output as captured |
| `dla-validation.json` | `validateDlaPartialPageCapture` (+ archetype plan errors) |
| `persisted-page.json` | page SoT after persist (or note if identical to capture) |
| `expected-set.json` | `{ expected_set, actual_set }` |
| `gam-prompt-final.txt` | final GAM prompt text (when delivery check applies) |
| `prism-final-gam-prompt.json` | `window.__PRISM_FINAL_GAM_PROMPT` snapshot (when applicable) |
| `classification.json` | run-level code + precedence notes |

Files marked “when applicable” are **required** whenever `actual_set` is non-empty and capture validation passed.

Runs missing mandatory artefacts are **`INVALID_TEST`** (incomplete evidence).

---

## 9. Per-brief aggregation (S61-D10)

After 3 runs per brief, compute **brief-level outcome** by majority (≥2 of 3 runs share the same classification):

| Brief-level label | Rule |
| ----------------- | ---- |
| **Brief outcome** | Majority classification among the 3 runs |
| **Tie (1/1/1 or no majority)** | Record **SPLIT**; brief does **not** count toward positive bar until resolved with a 4th adjudication run or documented tie-break rule in decisions |

**Provisional acceptance bar** uses **brief-level** outcomes (10 briefs), not individual runs:

| Criterion | Measurement |
| --------- | ----------- |
| No false positives (B09, B10) | Both briefs: **all 3 runs** `CORRECT_OMISSION` (zero-tolerance) |
| No invalid plans | **Zero** runs classified `INVALID_PLAN` across all 30 |
| No persistence/delivery failures | **Zero** runs `PERSISTENCE_FAILURE` or `DELIVERY_FAILURE` attributable to benchmark execution |
| Strong majority correct selection (positive briefs) | **≥6 of 8** positive briefs have brief-level outcome `CORRECT_SELECTION` |
| Each Priority-1 ID at least once | Among positive briefs with brief-level `CORRECT_SELECTION`, each of mechanism / process / mental model appears **≥1** time |
| Failures classified before prompt change | All 30 runs classified before any Phase B work |

Run-level counts are reported for diagnostics; **bar verdict** uses brief-level rules above.

---

## 10. Recommended run order

1. **S61-B09**, **S61-B10** (false-positive controls)  
2. **S61-B01**, **S61-B04**, **S61-B07** (one per Priority-1 type)  
3. **S61-B02**, **S61-B03**, **S61-B05**, **S61-B06**, **S61-B08**

Complete all 3 replications per brief before moving to Phase B.

---

## 11. Phase A operator sequence (per run)

1. Confirm harness checklist (§2)  
2. Set sparse brief as ordinary goal/LO  
3. Run through DLA capture (Copilot)  
4. Record activation proof  
5. Validate capture → `dla-validation.json`  
6. Confirm persist → `persisted-page.json`  
7. Compute `expected_set` / `actual_set`  
8. If `actual_set` non-empty and valid → GAM Copy → delivery snapshot  
9. Assign classification via precedence (§7)  
10. Write `classification.json`; update matrix run table  

---

## 12. Phase A exit (documentation)

- 30 scored runs logged  
- 10 brief-level outcomes computed  
- Phase A summary filled in [acceptance-matrix.md](acceptance-matrix.md)  
- Baseline decision recorded in [decisions.md](decisions.md)  
- Provisional bar verdict: Met / Not met / Partial  

No product or prompt changes in Phase A.
