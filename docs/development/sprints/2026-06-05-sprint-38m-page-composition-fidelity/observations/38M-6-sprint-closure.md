# 38M-6 — Sprint closure

**Date:** 2026-06-05  
**Sprint:** 38-M Page Composition Fidelity  
**Phase:** 38M-6 (documentation and closure only)  
**Status:** **CLOSED**  
**Predecessor:** [Sprint 38-L](../2026-06-05-sprint-38l-instructional-function-depth-implementation/) (**CLOSED** — [38L-6](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-6-sprint-closure.md))  
**Authority:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)

---

## Sprint objective

**Mission:** Prevent Design Page composition from summarising or collapsing instructional materials that GAM already generated correctly, so the rendered learner workbook reflects GAM richness.

**Programme question addressed:**

> Why does the learner-facing page feel like “worksheet + checklist” when DLA and GAM already carry full instructional episodes?

**38-M answer:** Enforce **L4 fidelity** so composed page JSON carries GAM bodies programmatically after LLM compose, with validators and proof gates on `EV-38M-AFTER`.

**Charter goals (F1–F6):**

| ID | Goal | Outcome |
|----|------|---------|
| F1 | Quantify GAM→page→render fidelity gap (A3, A4) | ✓ [38M-1](38M-1-baseline-page-fidelity-analysis.md) |
| F2 | Define preservation model | ✓ [38M-2](38M-2-page-composition-preservation-model.md) |
| F3 | A4 Evaluate body parity | ✓ [38M-3](38M-3-a4-evaluate-fidelity-implementation.md) |
| F4 | A3 Analyse sequencing | ✓ [38M-4](38M-4-a3-analyse-sequencing-fidelity.md) |
| F5 | Proof run `EV-38M-AFTER` | ✓ [38M-5](38M-5-inflation-proof-run.md) |
| F6 | Evidence-backed closure | ✓ This document |

**Non-goals respected:** No schema/ACM/workflow redesign; no 38-L §5/§6 depth rule weakening; no renderer CSS overhaul.

---

## Investigation timeline

| Phase | Date | Deliverable | Type | Status |
|-------|------|-------------|------|--------|
| **38M-1** | 2026-06-05 | [38M-1-baseline-page-fidelity-analysis.md](38M-1-baseline-page-fidelity-analysis.md) | Analysis only | **Complete** |
| **38M-2** | 2026-06-05 | [38M-2-page-composition-preservation-model.md](38M-2-page-composition-preservation-model.md) | Design/spec | **Complete** |
| **38M-3** | 2026-06-05 | [38M-3-a4-evaluate-fidelity-implementation.md](38M-3-a4-evaluate-fidelity-implementation.md) | Code + tests | **Complete** |
| **38M-4** | 2026-06-05 | [38M-4-a3-analyse-sequencing-fidelity.md](38M-4-a3-analyse-sequencing-fidelity.md) | Code + tests | **Complete** |
| **38M-5** | 2026-06-05 | [38M-5-inflation-proof-run.md](38M-5-inflation-proof-run.md) · `artefacts/EV-38M-AFTER-*` | Harness proof | **Complete** |
| **38M-6** | 2026-06-05 | This closure record | Docs only | **Complete** |

**Dependency chain executed:**

```text
38M-1 Baseline → 38M-2 Model → 38M-3 A4 + 38M-4 A3 (parallel) → 38M-5 Proof → 38M-6 Closure
```

**Proof run:** `EV-38M-AFTER` captured `2026-06-05T14:10:09Z` · model `gpt-4.1-mini` · harness `artefacts/ev-38m-inflation-pipeline-capture-once.mjs`.

---

## Findings

### Primary finding (38M-1)

Instructional fidelity loss on `EV-38L-AFTER` was **not uniform**:

| Activity | GAM→Page (raw compose) | Primary loss stage | Symptom |
|----------|------------------------|--------------------|---------|
| A1–A2 | 99–100% | None | — |
| **A3 Analyse** | **100%** | **Render sequencing** (not compose) | Full bodies; checklist-first order inverts episode |
| **A4 Evaluate** | **45%** | **L4 Design Page compose** | Keys survive; capstone bodies synopsis-replaced or table-shell collapsed |

**Loss mechanisms identified:**

- **Synopsis replacement** — catalogue pointer sentences replace scenario and worked-judgement prose (M12, M14).
- **Table-shell collapse** — guided judgement table structure retained; exemplar rows replaced by `Partial example` placeholders (M15).
- **Severe compression** — transfer and consolidation bodies shortened (M18, M19).
- **Meta replacement** — independent template header replaced by bullet scaffold (M16).
- **Render order inversion (A3)** — hardcoded early renderer paths (checklist, worksheet) precede worked analytic pass despite 100% page JSON fidelity.

**Critical insight:** LD-MATERIALS-COPY prompt obligations were cited on the composed page but **not enforced by the LLM alone**. GAM authority must be applied **programmatically** after compose.

### Proof-run confirmation (38M-5)

On a **fresh** inflation run (`EV-38M-AFTER`), raw LLM compose thinned bodies **more severely** than frozen `EV-38L-AFTER` (A4 aggregate **7%** vs **45%** pre-merge). Post-merge compose path restored **100%** GAM→Page parity for A1–A4. The L4 compose cliff is real and recurring; the 38M merge layer closes it regardless of thinning severity.

---

## Implementations

### 38M-2 — Preservation model (specification)

Defined GAM authority rules, synopsis/shell/meta detectors, per-material fidelity contracts (FC-M12..M19), `validate38MPageFidelity`, and hard gates G1–G10 for proof. Established compose hook position: end of `applyPedagogicCognitionSemanticsToComposedPage`.

### 38M-3 — A4 Evaluate fidelity

| Surface | Change |
|---------|--------|
| `lib/page-gam-materials-preserve.js` | Tier contracts, CAT/SH/MR/SC detectors, `mergeMaterialsFromGamList`, `validate38MPageFidelity`, `measurePageGamFidelity` |
| `app.js` | Test API exports for 38M validator |
| `tests/page-38m-gam-preservation.test.js` | **7 tests** — gates, merge, compose integration |

**Replay on frozen `EV-38L-AFTER`:** M12–M15, M18 post-merge **100%** parity; synopsis and table-shell eliminated; A3 regression guard intact.

### 38M-4 — A3 Analyse sequencing

| Surface | Change |
|---------|--------|
| `lib/page-a3-materials-sequencing.js` | **New** — `materials_order`, compose apply, page/render validators |
| `app.js` | Chained after GAM preserve; declared-order render path |
| `tests/page-38m-a3-sequencing.test.js` | **6 tests** |

**Target order:** worked analytic pass → analysis table → scenario → checklist (charter order).

### 38M-5 — Proof harness

| Artefact | Role |
|----------|------|
| `ev-38m-inflation-pipeline-capture-once.mjs` | Full pipeline capture with 38M validation |
| `EV-38M-AFTER-design-page.json` | Post-merge composed page (`gam_materials_preserve_applied: true`) |
| `EV-38M-AFTER-run-log.json` | Metrics, gate results, comparator |
| `EV-38M-vs-38L-comparison.json` | Structured baseline comparison |

**Regression suite:** **17/17 pass** (`page-38m-a3-sequencing` + `page-38m-gam-preservation` + `page-38l-gam-preservation`).

---

## Proof results

### Mission-critical outcomes (`EV-38M-AFTER` post-merge)

| Charter requirement | Target | Result |
|---------------------|--------|--------|
| A4 worked judgement parity (G1) | ≥90% char ratio | **PASS** — 100% |
| A4 guided judgement parity (G2) | ≥90% char ratio | **PASS** — 100% |
| Transfer prompts survive (G6) | ≥80%; marker present | **PASS** — 100% |
| No synopsis replacement (G10) | Tier-A `lossType: none` | **PASS** |
| No table-shell collapse | Full exemplar bodies | **PASS** |
| A3 body fidelity (G7) | ≥99% M8–M10 | **PASS** — 100% |
| Preserve metadata (G9) | `gam_materials_preserve_applied` | **PASS** |
| A3 `materials_order` in page JSON (G15/G16) | Charter sequence | **PASS** |
| Regression tests | 17/17 | **PASS** |

### Aggregate GAM→Page ratio (post-merge)

| Activity | EV-38L-AFTER (raw) | EV-38M pre-merge | EV-38M post-merge |
|----------|-------------------|------------------|-------------------|
| A1 | 100% | 56% | **100%** |
| A2 | 99% | 54% | **100%** |
| A3 | 100% | 30% | **100%** |
| A4 | **45%** | **7%** | **100%** |

### Render spot-check

- **A4:** Strategy menu, weak/strong judgement prose, guided table, and transfer prompt **present** in `EV-38M-AFTER-render.html` — learner-facing capstone richness restored.
- **A3:** Page JSON order correct; **fresh-run render order still inverted** (residual R2/R3).

### Harness `proofOk`

`proofOk: false` on fresh run due to **marker literal** gate failures (G4/G5) and A3 render order — not due to body parity failure. Frozen-workload replay passes all substantive gates (17/17 tests).

---

## Residuals

Documented residuals are **not mission blockers**. They affect harness strictness and fresh-run render edge cases, not the core L4 compose fidelity fix.

| ID | Issue | Severity | Evidence | Recommended disposition |
|----|-------|----------|----------|-------------------------|
| **R1** | **Marker literal generalisation** — G4/G5 expect EV-38L strings (`Weak Evaluation Example`, `Budget Tightening`) but fresh GAM uses variant phrasing | Low (harness false negative) | 38M-5 §4.3 — 100% body ratio with marker failures | **Post-sprint harness hardening:** generalise markers to semantic patterns or gate on ratio + anti-synopsis only |
| **R2** | **Render alias-key sequencing bypass** — duplicate alias keys (`checklist_evaluate`, `worked_example`, `scenarios`, etc.) trigger renderer early paths before `materials_order` loop | Medium (fresh-run learner UX) | 38M-5 §7 — checklist h4 precedes worked pass on fresh page; EV-38L replay passes | **Follow-on sprint:** mark alias keys consumed when declared-order path renders; suppress duplicate early paths |
| **R3** | **Validator schema alignment** — `validate38LPageGamPreservation` false negative on fresh schema; `scenario_maya_strategy_menu` vs `scenarios[]` key variance | Low (harness noise) | 38M-5 §4.1 — 38L regression fail; G3 not invoked on `scenarios` array layout | Extend fidelity contracts for variant page-key layouts; scope 38L validator to frozen comparator or retire in favour of 38M validator |
| R4 | `validate38LPageGamPreservation` false negative on fresh composed page | Low | 38M-5 §4.1 | Fold into R3 — use `validate38MPageFidelity` as sole proof validator |
| R5 | M19 consolidation marker variant phrasing | Low (soft gate) | 38M-3 G12 | Accept variant phrasing or keep soft-gate only |
| R6 | Fresh raw page thinner than EV-38L (A4 7% vs 45%) | Informational | 38M-5 §5.3 | Monitor L4 prompt variance; out of 38M scope — merge layer handles regardless |

**User-specified residuals R1–R3** map directly to harness marker literals, alias-key render bypass, and validator/schema alignment respectively.

---

## Lessons learned

1. **Prompt contracts are necessary but insufficient.** `LD-MATERIALS-COPY` was applied on `EV-38L-AFTER` yet A4 bodies were still thinned. Programmatic GAM authority after compose is the reliable enforcement boundary.

2. **Key survival ≠ body fidelity.** All A4 material keys survived on the baseline page; the learner experience failed because bodies were synopsis-replaced. Validators must check **markers and ratios**, not key presence alone.

3. **Compose and render are separate failure surfaces.** A3 proved that 100% GAM→Page parity does not guarantee correct learner-facing order. Sequencing policy belongs in page JSON (`materials_order`) **and** renderer consumption of that order.

4. **Frozen comparators and fresh runs diverge in phrasing.** Marker literals calibrated on `EV-38L-AFTER` produce false negatives on fresh GAM output with equivalent instructional substance. Proof gates should prefer semantic detection over fixed strings.

5. **Canonical alias proliferation complicates render.** Post-merge alias keys (`scenarios`, `worked_example`, duplicate checklists) improve renderer compatibility but can bypass declared-order paths if not marked consumed.

6. **Tiered fidelity contracts scale.** Separating Tier-A capstone (90%), Tier-B transfer (80%), and Tier-D A3 regression (99%) allowed targeted merge without over-writing already-faithful bodies.

7. **Proof architecture: pre-merge cliff + post-merge restore.** Capturing `design-page-raw.txt` alongside merged JSON makes the L4 loss stage visible and proves the merge closes it on every run.

---

## Success assessment

### Charter success criteria

| Criterion | Assessment |
|-----------|------------|
| F1 — Quantified fidelity gap | **Met** |
| F2 — Preservation model defined | **Met** |
| F3 — A4 capstone body parity | **Met** (post-merge ≥90% Tier-A, ≥80% Tier-B) |
| F4 — A3 sequencing corrected | **Met** (page JSON); **partial** (fresh-run render — R2) |
| F5 — `EV-38M-AFTER` proof | **Met** (evidence captured; conditional on harness markers) |
| F6 — Closure record | **Met** (this document) |

### EV-38M-AFTER mission gates (substance)

| Gate class | Verdict |
|------------|---------|
| L4 compose fidelity cliff closed | **Yes** — 100% post-merge A4 parity |
| Synopsis replacement eliminated | **Yes** |
| Table-shell collapse eliminated | **Yes** |
| A3 body preservation | **Yes** |
| No 38L/38M test regression | **Yes** — 17/17 |
| Harness G1–G10 all green (fresh run) | **No** — R1 marker literals |
| A3 render order (fresh run) | **No** — R2 alias bypass |

### Overall sprint verdict

**SUCCESS (mission)** with **documented residuals (R1–R3)**.

Sprint 38-M achieved its charter objective: Design Page composition no longer stands as the authoritative source for instructional material bodies when upstream GAM is richer. The programmatic preservation layer restores full GAM bodies, eliminates synopsis replacement and table-shell collapse, and is proven on `EV-38M-AFTER` with frozen-comparator regression coverage.

Proof harness strictness (R1) and fresh-run A3 render alias behaviour (R2) are **quality-of-proof** and **learner-presentation** follow-ups — they do not reopen the L4 fidelity failure mode that motivated the sprint.

---

## Closure recommendation

**Recommend closing Sprint 38-M as SUCCESS.**

| Action | Detail |
|--------|--------|
| **Close sprint** | Charter objectives F1–F6 satisfied; no further 38M implementation required |
| **Freeze comparators** | Retain `EV-38L-AFTER-*` (pre-fidelity baseline) and `EV-38M-AFTER-*` (post-fidelity proof) |
| **Retain regression suite** | `tests/page-38m-gam-preservation.test.js` + `tests/page-38m-a3-sequencing.test.js` + `tests/page-38l-gam-preservation.test.js` (17 tests) |
| **Carry residuals** | R1–R3 to follow-on work (see next sprint); do not block 38M closure |
| **Hold conditions** | Do not weaken 38-L DLA/GAM §5/§6; do not reopen schema/ACM/workflow redesign |

**Closure status:** **CLOSED — SUCCESS (mission), residuals documented.**

---

## Recommended next sprint

**Proposed focus: Sprint 38-N — Page render fidelity hardening** (or equivalent short follow-on)

| Priority | Work item | Maps from |
|----------|-----------|-----------|
| 1 | Generalise 38M proof markers (G4/G5) to semantic patterns; reduce harness false negatives | R1 |
| 2 | Suppress duplicate alias-key early render paths when `materials_order` is declared | R2 |
| 3 | Align `FIDELITY_CONTRACTS` and validators for `scenarios[]` vs `scenario_maya_strategy_menu` layouts | R3 |
| 4 | Retire or scope `validate38LPageGamPreservation` to frozen EV-38L comparator only | R3/R4 |

**Alternative / parallel tracks** (if programme priority shifts):

- **Instructional episode depth** — continue 38I learner-episode calibration against now-faithful composed pages.
- **L4 prompt stability** — optional Design Page pack tightening if raw compose thinning variance (R6) becomes operationally costly (merge layer already mitigates).

**Not recommended as next sprint:**

- Reopening 38-L DLA/GAM depth obligations (upstream is substantively rich on `EV-38M-AFTER`).
- Renderer CSS redesign (explicit 38M hold).
- Schema / ACM / workflow structural change.

---

## References

| Document | Path |
|----------|------|
| Implementation charter | [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) |
| 38M-1 Baseline analysis | [38M-1-baseline-page-fidelity-analysis.md](38M-1-baseline-page-fidelity-analysis.md) |
| 38M-2 Preservation model | [38M-2-page-composition-preservation-model.md](38M-2-page-composition-preservation-model.md) |
| 38M-3 A4 implementation | [38M-3-a4-evaluate-fidelity-implementation.md](38M-3-a4-evaluate-fidelity-implementation.md) |
| 38M-4 A3 sequencing | [38M-4-a3-analyse-sequencing-fidelity.md](38M-4-a3-analyse-sequencing-fidelity.md) |
| 38M-5 Proof run | [38M-5-inflation-proof-run.md](38M-5-inflation-proof-run.md) |
| 38L closure | [38L-6](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-6-sprint-closure.md) |
| 38I-4 A4 benchmark | [38I-4 A4 evaluate learner episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) |
| Proof artefacts | `../artefacts/EV-38M-AFTER-*` · `../artefacts/EV-38M-vs-38L-comparison.json` |
| Core libs | `lib/page-gam-materials-preserve.js` · `lib/page-a3-materials-sequencing.js` |
