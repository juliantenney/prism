# 38M-3 — A4 Evaluate fidelity implementation

**Date:** 2026-06-05  
**Sprint:** 38-M Page Composition Fidelity  
**Phase:** 38M-3  
**Spec:** [38M-2-page-composition-preservation-model.md](38M-2-page-composition-preservation-model.md)  
**Baseline:** [38M-1-baseline-page-fidelity-analysis.md](38M-1-baseline-page-fidelity-analysis.md)

---

## §1 Executive summary

**Implemented** the 38M-2 preservation model for A4 Evaluate capstone materials in `lib/page-gam-materials-preserve.js`, with `validate38MPageFidelity` hard gates and regression tests on frozen `EV-38L-AFTER` artefacts.

**Result:** Post-merge replay of thinned `EV-38L-AFTER-design-page.json` achieves:

| Material | Pre-merge ratio | Post-merge ratio | Gate |
|----------|-----------------|------------------|------|
| M12 scenario | 27% | **100%** | G3 ✓ |
| M14 worked judgement | 24% | **100%** | G1, G4 ✓ |
| M15 guided table | 40% | **100%** | G2, G5 ✓ |
| M18 transfer | 41% | **100%** | G6 ✓ |
| M8–M11 (A3) | 100% | **100%** | G7 ✓ (no regression) |

**Success criteria met:**

- Tier-A materials ≥ 90% GAM→Page parity after merge
- Tier-B transfer ≥ 80% parity after merge
- No synopsis replacement on capstone fields post-merge
- No table-shell collapse post-merge
- No A3 body regression

---

## §2 Implementation surface

### `lib/page-gam-materials-preserve.js`

| Addition | Purpose |
|----------|---------|
| `FIDELITY_CONTRACTS` | Per-material tier, minRatio, markers (FC-M12..M19, M8–M10) |
| `catalogueSynopsis` | CAT-1..CAT-6 synopsis detection |
| `tableShellCollapse` | SH-1..SH-4 guided table shell detection |
| `metaReplacement` | MR-1..MR-3 independent template meta replace |
| `severeCompression` | SC-1..SC-3 transfer/consolidation compression |
| `isSynopsisOrShell` | Composed detector for merge + validation |
| `shouldMergeGamBody` | Tier-aware merge triggers (T1–T7) |
| `mergeMaterialsFromGamList` | Per-GAM-material contract merge (replaces flat-object-only path in compose) |
| `measurePageGamFidelity` | Pre/post diagnostic metrics array |
| `validate38MPageFidelity` | Hard gates G1–G10 + soft warnings G11–G13 |

**Compose path change:** `applyGamMaterialsToComposedPage` now calls `mergeMaterialsFromGamList` per activity and sets `metadata.gam_materials_preserve_schema: "38M-2"`.

### `app.js`

| Export | Purpose |
|--------|---------|
| `validate38MPageFidelityForTest` | Test/harness access to 38M validator |
| `measurePageGamFidelityForTest` | Diagnostic metrics in tests |

**Unchanged:** Compose hook location (`applyComposedPageGamMaterialsPreserve` at end of `applyPedagogicCognitionSemanticsToComposedPage`). No renderer, schema, ACM, or pack edits.

### `tests/page-38m-gam-preservation.test.js` (new — 7 tests)

| Test | Verifies |
|------|----------|
| Synopsis detector on raw EV-38L A4 | CAT + shell detection |
| `validate38MPageFidelity` pre-merge fail | G1, G2, G3, G5, G9 errors |
| Tier-A/B parity after merge | M12–M15 ≥90%, M18 ≥80% |
| Post-merge validator pass | All hard gates + A3 ≥99% |
| `measurePageGamFidelity` loss types | synopsis_replacement, table_shell_collapse |
| Compose path integration | `applyPedagogicCognitionSemanticsToComposedPage` + validate38M |
| `mergeMaterialsFromGamList` | Exact GAM body for M14 |

**Regression:** `tests/page-38l-gam-preservation.test.js` — 4/4 pass unchanged.

---

## §3 Gate verification (EV-38L replay)

Replay command:

```bash
node --test tests/page-38m-gam-preservation.test.js tests/page-38l-gam-preservation.test.js
```

| Gate | Check | Pre-merge | Post-merge |
|------|-------|-----------|------------|
| **G1** | M14 ratio ≥ 90% | FAIL (24%) | **PASS** (100%) |
| **G2** | M15 ratio ≥ 90% | FAIL (40%) | **PASS** (100%) |
| **G3** | Strategy A: + Strategy E: | FAIL | **PASS** |
| **G4** | Weak + Strong Evaluation Example | FAIL | **PASS** |
| **G5** | No table shell; Budget Tightening present | FAIL | **PASS** |
| **G6** | M18 ratio ≥ 80%; 80 words marker | FAIL (41%) | **PASS** (100%) |
| **G7** | A3 M8–M10 ratio ≥ 99% | PASS | **PASS** |
| **G8** | Checklist A1–A4 ≥ 80 chars | PASS | **PASS** |
| **G9** | `gam_materials_preserve_applied` | FAIL | **PASS** |
| **G10** | No synopsis on Tier-A | FAIL | **PASS** |

**Soft gates (warnings only on merged page):**

| Gate | Material | Post-merge |
|------|----------|------------|
| G11 | M13 criteria ≥ 85% | PASS (merge restores 100%) |
| G12 | M19 consolidation ≥ 70% | PASS (merge restores 100%) |
| G13 | M16 independent template depth | **WARN** — GAM header only (218 chars); upstream depth gap per 38M-1 |

---

## §4 Merge behaviour — A4 capstone examples

### M12 — synopsis → full strategy menu

Merge trigger: ratio 27% < 90% + `catalogueSynopsis` positive (`are provided to evaluate`).

Post-merge body contains full Strategy A–E list from GAM (817 chars).

### M14 — synopsis → weak/strong exemplars

Merge trigger: ratio 24% < 90% + `This note shows stepwise reasoning` catalogue pattern.

Post-merge body contains `Weak Evaluation Example` and `Strong Evaluation Example` (1,050 chars).

### M15 — table shell → rich exemplar rows

Merge trigger: `tableShellCollapse` (`Partial example` cells without `Budget Tightening` judgements).

Post-merge body contains full pipe table with Strategy A exemplar judgements (1,711 chars). `Partial example` absent.

### M18 — compression → full transfer task

Merge trigger: ratio 41% < 80% + `severeCompression` (guiding questions stripped).

Post-merge body contains full 684-char transfer prompt with bullet questions.

---

## §5 A3 regression guard

38M-1 established A3 at 100% GAM→Page parity on raw `EV-38L-AFTER`. Merge policy uses Tier-D contracts (99% threshold) for M8–M10:

- Merge does **not** overwrite A3 bodies when page already meets contract
- `validate38MPageFidelity` G7 blocks any future A3 thinning below 99%

Verified: post-merge A3 materials remain exact GAM copies.

---

## §6 Residual gaps (not 38M-3 scope)

| Item | Status | Next phase |
|------|--------|------------|
| M16 independent template depth | GAM 218-char header stub; G13 soft warning | Upstream GAM calibration or 38M-5 proof note |
| A3 render sequencing (checklist-first) | Bodies preserved; order inverted | 38M-4 |
| `EV-38M-AFTER` live harness | Validator ready; harness fork pending | 38M-5 |
| Render spot-check G14 | Test API available; HTML gate in 38M-5 | 38M-5 |

---

## §7 Files changed

| File | Change |
|------|--------|
| `lib/page-gam-materials-preserve.js` | 38M detectors, tier merge, `validate38MPageFidelity`, `measurePageGamFidelity` |
| `app.js` | `validate38MPageFidelityForTest`, `measurePageGamFidelityForTest` |
| `tests/page-38m-gam-preservation.test.js` | **New** — 7 tests |

**Unchanged:** DLA/GAM packs, schema, ACM, renderer, harness (`ev-38l-*` still uses 38L validator — upgrade in 38M-5).

---

## §8 Success condition check (38M-3)

| Criterion | Status |
|-----------|--------|
| M12 scenario fidelity | ✓ |
| M14 worked judgement fidelity | ✓ |
| M15 guided judgement table fidelity | ✓ |
| M18 transfer fidelity | ✓ |
| `validate38MPageFidelity` implemented | ✓ |
| EV-38M proof gates G1–G10 enforced in tests | ✓ |
| Tier-A ≥ 90% parity post-merge | ✓ |
| Tier-B ≥ 80% parity post-merge | ✓ |
| No synopsis / table-shell on capstone post-merge | ✓ |
| No A3 regression | ✓ |

**38M-3 complete.** Next: **38M-4** A3 sequencing fidelity · **38M-5** `EV-38M-AFTER` proof harness.

---

## References

- [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)
- [38M-2 preservation model](38M-2-page-composition-preservation-model.md)
- [38M-1 baseline analysis](38M-1-baseline-page-fidelity-analysis.md)
- `lib/page-gam-materials-preserve.js` · `tests/page-38m-gam-preservation.test.js`
