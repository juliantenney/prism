# 38N-5 — Sprint closure

**Date:** 2026-06-05  
**Sprint:** 38-N Page Fidelity Hardening  
**Phase:** 38N-5 (documentation and closure only)  
**Status:** **CLOSED**  
**Predecessor:** [Sprint 38-M](../2026-06-05-sprint-38m-page-composition-fidelity/) (**CLOSED** — [38M-6](../../2026-06-05-sprint-38m-page-composition-fidelity/observations/38M-6-sprint-closure.md) · **SUCCESS (mission)**)  
**Authority:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)

---

## Sprint objective

Harden the page-fidelity architecture established in Sprint 38-M by resolving all known charter residuals **R1, R2, R3** — without redesigning instructional architecture, educational strategy, or depth obligations, and without weakening 38M preservation guarantees (GAM→Page body parity, anti-synopsis, tiered ratio gates).

**Programme question addressed:**

> Can 38M proof gates and render paths handle fresh GAM phrasing and schema variants without false negatives or render-order defects?

**38-N answer:** Yes. Semantic markers, alias-aware validation, and declared-order render suppression close the 38M residual set. `proofOk: true` on `EV-38N-AFTER` replay.

---

## Investigation timeline

| Phase | Date | Deliverable | Type | Status |
|-------|------|-------------|------|--------|
| **38N-1** | 2026-06-05 | [38N-1-marker-generalisation-design.md](38N-1-marker-generalisation-design.md) | Design + implementation | **Complete** |
| **38N-2** | 2026-06-05 | [38N-2-render-ordering-hardening.md](38N-2-render-ordering-hardening.md) | Code + tests | **Complete** |
| **38N-3** | 2026-06-05 | [38N-3-validator-schema-alignment.md](38N-3-validator-schema-alignment.md) | Code + tests | **Complete** |
| **38N-4** | 2026-06-05 | [38N-4-proof-run.md](38N-4-proof-run.md) · `EV-38N-AFTER-*` | Harness replay | **Complete** |
| **38N-5** | 2026-06-05 | This closure record | Docs only | **Complete** |

**Dependency chain executed:**

```text
38N-1 Marker design → 38N-2 Render hardening + 38N-3 Schema alignment (parallel) → 38N-4 Proof → 38N-5 Closure
```

---

## Residuals addressed

All three residuals inherited from [38M-6](../../2026-06-05-sprint-38m-page-composition-fidelity/observations/38M-6-sprint-closure.md) are **closed**.

| ID | Problem (38M) | 38N resolution | Evidence |
|----|---------------|----------------|----------|
| **R1** | G4/G5 marker literals fail on fresh GAM phrasing despite 100% body ratio | Semantic marker families (`weak_worked_judgement`, `strong_worked_judgement`, `guided_table_exemplar`, etc.) | G4/G5 **PASS** on `EV-38N-AFTER`; [38N-1](38N-1-marker-generalisation-design.md) |
| **R2** | Alias material keys bypass `materials_order`; checklist renders before worked pass | `MATERIAL_RENDER_ALIAS_GROUPS` + `markMaterialAliasGroupRendered`; legacy path suppression in `app.js` | A3 render positions 2726 → 4597 → 5553 → 6530; [38N-2](38N-2-render-ordering-hardening.md) |
| **R3** | Validator/schema mismatch (`scenarios[]`, alias keys) causes false negatives | `PAGE_MATERIAL_KEY_ALIASES` + `pageMaterialText()` resolver | `validate38M` + `validate38L` **ok: true**; [38N-3](38N-3-validator-schema-alignment.md) |

**Pre-38N vs post-38N harness status (`EV-38M-AFTER` source):**

| Check | Pre-38N | Post-38N |
|-------|---------|----------|
| `proofOk` | **false** | **true** |
| `validation38M.ok` | false (G4/G5) | **true** |
| `validation38LRegression.ok` | false (schema) | **true** |
| `a3Sequencing.render.ok` | false | **true** |

---

## Implementation summary

### 38N-1 — Marker generalisation (R1)

| Surface | Change |
|---------|--------|
| `lib/page-gam-materials-preserve.js` | `FIDELITY_CONTRACTS` markers replaced with semantic IDs; `semanticMarkerSatisfied`, `evaluateMaterialMarkers`, `hasGuidedTableExemplar` |
| Tier-A gates G3–G5 | Evaluate marker families, not display literals |

Fresh phrasing such as `Weak Judgement (Slogan-style)` and strategy-row guided tables without `Budget Tightening` now pass while synopsis/shell collapse detectors remain active.

### 38N-2 — Render ordering hardening (R2)

| Surface | Change |
|---------|--------|
| `lib/page-a3-materials-sequencing.js` | `MATERIAL_RENDER_ALIAS_GROUPS`, `markMaterialAliasGroupRendered` |
| `app.js` | Declared-order loop marks alias groups consumed; legacy checklist/scenario/worksheet paths suppressed when `materials_order` set |
| `ev-38m-inflation-pipeline-capture-once.mjs` | `findActivityTitles()` reads `section.content` (not `section.rows`) |

### 38N-3 — Validator schema alignment (R3)

| Surface | Change |
|---------|--------|
| `lib/page-gam-materials-preserve.js` | `PAGE_MATERIAL_KEY_ALIASES`, `pageMaterialText()` |
| Validators | `measurePageGamFidelity`, `validate38MPageFidelity`, `materialsHasSubstantiveA4*` use alias-aware body resolution |

### Tests and harness

| Artefact | Role |
|----------|------|
| `tests/page-38n-fidelity-hardening.test.js` | **4 tests** — R1/R2/R3 on `EV-38M-AFTER` |
| `artefacts/ev-38n-proof-replay.mjs` | 38N-4 replay harness (`HARNESS_VERSION: 38N-4`) |

**Scope respected:** No instructional architecture, educational strategy, or depth investigation. Page-fidelity hardening only.

---

## Proof evidence

**Run ID:** `EV-38N-AFTER`  
**Source:** `EV-38M-AFTER` (38M fresh inflation capture)  
**Mode:** Artefact replay — no LLM pipeline (hardening sprint, not discovery)  
**Captured:** `2026-06-06T09:50:51Z`  
**Harness:** `artefacts/ev-38n-proof-replay.mjs`

### Overall proof status

| Check | Result |
|-------|--------|
| `proofOk` | **true** |
| Conditional exceptions | **None** |
| Residuals R1–R3 | **All resolved** |

### Gate matrix (post-38N replay)

| Gate | Requirement | Result |
|------|-------------|--------|
| G1 | M14 ratio ≥90% | **PASS** (100%) |
| G2 | M15 ratio ≥90% | **PASS** (100%) |
| G3 | Strategy A + E | **PASS** (semantic; via `scenarios[]`) |
| G4 | Weak/Strong exemplars | **PASS** (semantic markers) |
| G5 | Guided table exemplar | **PASS** (`hasGuidedTableExemplar`) |
| G6–G10 | Transfer, consolidation, anti-synopsis, metadata | **PASS** |
| G15/G16 | A3 `materials_order` in page JSON | **PASS** |
| A3 render order | worked → worksheet → scenario → checklist | **PASS** |

### A3 render positions (`EV-38N-AFTER-run-log.json`)

| Material | Position |
|----------|----------|
| worked_analytic_pass | 2726 |
| analysis_table | 4597 |
| scenario_maya_households | 5553 |
| checklist | 6530 |

### Artefacts

| File | Purpose |
|------|---------|
| `artefacts/EV-38N-AFTER-design-page.json` | Composed page (from EV-38M-AFTER) |
| `artefacts/EV-38N-AFTER-gam.json` | GAM authority |
| `artefacts/EV-38N-AFTER-render.html` | Re-render with 38N renderer |
| `artefacts/EV-38N-AFTER-run-log.json` | Validation metrics + `proofOk` |

**Reference:** [38N-4-proof-run.md](38N-4-proof-run.md)

---

## Regression results

```bash
node --test tests/page-38n-fidelity-hardening.test.js tests/page-38m-a3-sequencing.test.js tests/page-38m-gam-preservation.test.js tests/page-38l-gam-preservation.test.js
```

| Suite | Tests | Result |
|-------|-------|--------|
| `page-38n-fidelity-hardening.test.js` | 4 | **PASS** |
| `page-38m-a3-sequencing.test.js` | 6 | **PASS** |
| `page-38m-gam-preservation.test.js` | 7 | **PASS** |
| `page-38l-gam-preservation.test.js` | 4 | **PASS** |
| **Total** | **21** | **PASS** |

Frozen `EV-38L-AFTER` merge and compose regression paths remain green. 38M A3 sequencing and A4 capstone gates unchanged in substance.

---

## Preservation guarantee status

38M L4 preservation guarantees remain **intact**. 38N changes affect detection and render consumption only — not merge authority or anti-thinning policy.

| Guarantee | 38M baseline | Post-38N status |
|-----------|--------------|-----------------|
| GAM→Page body parity (post-merge) | 100% A1–A4 on `EV-38M-AFTER` | **Unchanged** — replay confirms 100% Tier-A ratios |
| Anti-synopsis (`catalogueSynopsis`) | Active on Tier-A | **Unchanged** — still fails when synopsis present and markers absent |
| Table-shell collapse detection | Active on M15 | **Unchanged** — `Partial example` without exemplar still flagged |
| Tier ratio gates G1/G2 (≥90%) | Enforced | **Unchanged** — thresholds not lowered |
| Tier-D A3 regression (≥99%) | Enforced | **Unchanged** |
| `gam_materials_preserve_applied` metadata | Required | **Unchanged** |
| Compose hook position | End of `applyPedagogicCognitionSemanticsToComposedPage` | **Unchanged** |

**Note:** Some Tier-D metric rows in the run log report `substantive: false` due to literal Tier-D markers (e.g. `Stepwise Analysis`, `Fixed-Income Household`) on variant phrasing. These are soft informational flags, not charter gate failures, and were out of 38N scope. Tier-A capstone materials (M12–M15, M18–M19) all report `substantive: true`.

---

## Lessons learned

1. **False negatives are a fidelity risk.** When proof gates pass on frozen comparators but fail on fresh runs with equivalent substance, the harness is mis-calibrated — not the pipeline. Semantic markers are the correct fix for phrasing variance.

2. **Alias keys are a dual-edged compatibility layer.** Post-merge aliases (`worked_example`, `scenarios`, duplicate checklists) help renderer coverage but must be marked consumed when declared-order paths render, or they reintroduce sequencing defects.

3. **Validators must resolve schema variants before measuring bodies.** Key presence and canonical key lookup are insufficient when fresh compose emits `scenarios[]` or `modelling_note` instead of canonical fidelity-contract keys. A single resolver (`pageMaterialText`) prevents drift between measurement and gate logic.

4. **Harness extraction bugs can mask render fixes.** Reading `section.rows` instead of `section.content` caused A3 HTML blocks to span unrelated activities, producing false render-order failures in proof logs. Harness helpers must share the same row-discovery contract as production libs.

5. **Hardening sprints benefit from artefact replay.** Replaying `EV-38M-AFTER` through updated validators and renderer proved closure without a costly full LLM pipeline rerun, while still exercising fresh-run phrasing and schema layout.

6. **Body parity ≠ instructional role parity.** Manual inflation testing after 38N surfaced a possible gap between character-level preservation and instructional-material *role* preservation (see Follow-on observations). 38N correctly scoped body/ratio/render hardening only.

---

## Success assessment

### Charter success criteria

| Criterion | Target | Result |
|-----------|--------|--------|
| R1 resolved | Semantic marker families; no fidelity weakening | ✓ |
| R2 resolved | `materials_order` always wins over alias keys | ✓ |
| R3 resolved | Fresh EV validates without schema false negatives | ✓ |
| Proof | `proofOk: true` without conditional exceptions | ✓ |
| No 38M regression | Preservation guarantees intact | ✓ |

### Phase deliverables

| ID | Deliverable | Status |
|----|-------------|--------|
| H1 | 38N-1 Marker generalisation design | ✓ |
| H2 | 38N-2 Render ordering hardening | ✓ |
| H3 | 38N-3 Validator schema alignment | ✓ |
| H4 | 38N-4 Proof run | ✓ |
| H5 | 38N-5 Sprint closure | ✓ |

**Sprint verdict:** **CLOSED — SUCCESS**

All chartered fidelity-hardening residuals are resolved. No open items remain within 38N scope.

---

## Closure recommendation

**Recommend closing Sprint 38-N with verdict SUCCESS.**

Rationale:

- All three 38M residuals (R1–R3) are closed with implementation evidence and proof replay.
- `proofOk: true` on `EV-38N-AFTER` with zero validation errors.
- **21/21** regression tests pass.
- 38M preservation guarantees (ratio, anti-synopsis, merge authority) are confirmed intact.
- Scope boundaries respected — no instructional architecture or strategy changes.

**Do not reopen Sprint 38-N.** Any new findings from manual inflation testing belong in a separate discovery sprint (see below).

---

## Follow-on observations

**Status:** Recorded only — **not investigated** in 38N. **Out of scope** for this sprint.

Manual inflation testing after 38N completion identified a possible **instructional-material role preservation** issue distinct from the body-parity and render-order problems addressed in 38M/38N:

| Stage | Observation |
|-------|-------------|
| KM | Appears complete |
| DLA | Appears complete |
| GAM | Contains worked examples, explanatory guidance, and reasoning support |
| Design Page | Appears to retain instructional templates, tables, and checklists while **omitting some worked-example and explanatory structures** |

**Hypothesis (unverified):** The L4 compose path may preserve material *bodies* and *keys* for capstone Tier-A fields (now proven at 100% ratio) while still dropping or collapsing certain **instructional roles** — e.g. worked examples and explanatory scaffolding in non-capstone activities — that GAM authored with distinct pedagogical intent.

**Relationship to 38N:** 38N addressed validator false negatives, render alias bypass, and schema-variant resolution. It did **not** investigate whether all GAM material *types* and *roles* survive compose and render with correct learner-facing structure across the full activity set.

**Disposition:** Candidate investigation for a future sprint. No implementation action in 38N-5.

---

## Recommended next sprint

**Proposed: Sprint 38-O — Instructional Material Role Preservation** (discovery + baseline)

| Field | Proposal |
|-------|----------|
| **Mission** | Determine whether GAM instructional roles (worked example, explanatory guidance, reasoning support) survive L4 compose and render with pedagogical intent intact — beyond body-ratio parity |
| **Trigger** | Follow-on observation from manual inflation testing (this document §Follow-on observations) |
| **Not** | Reopening 38M/38N body-parity or anti-synopsis work; marker/render/schema hardening |
| **Suggested first phase** | Baseline trace: KM → DLA → GAM → Page → Render per material *role* and *type* on a fresh inflation run; compare against 38I episode model expectations |
| **Success shape** | Role-level fidelity matrix; identified loss stage(s); preservation model if gap confirmed |

Charter and scope to be defined when 38-O is initiated. **38-N is closed.**

**Update (2026-06-05):** [Sprint 38-O — Instructional Material Role Preservation](../../2026-06-05-sprint-38o-instructional-material-role-preservation/) is **CHARTERED**. [38O-1 baseline role-survival trace](../../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-1-baseline-role-survival-trace.md) **complete** — 38O-2 next.
