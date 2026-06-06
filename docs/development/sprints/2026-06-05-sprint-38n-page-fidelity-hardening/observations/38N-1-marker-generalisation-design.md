# 38N-1 — Marker generalisation design

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Residual:** R1 (from [38M-6](../../2026-06-05-sprint-38m-page-composition-fidelity/observations/38M-6-sprint-closure.md))  
**Type:** Design + implementation

---

## Problem

Sprint 38-M proof run `EV-38M-AFTER` achieved **100%** GAM→Page body parity but failed harness gates G4/G5 because validators searched for **literal strings** calibrated on frozen `EV-38L-AFTER`:

| Gate | Legacy literal | Fresh GAM phrasing (`EV-38M-AFTER`) |
|------|----------------|-------------------------------------|
| G4 weak exemplar | `Weak Evaluation Example` | `Weak Judgement (Slogan-style)` |
| G4 strong exemplar | `Strong Evaluation Example` | `Strong Judgement (Criteria-led)` |
| G5 table exemplar | `Budget Tightening` | Strategy-row table without that literal |

Instructional substance was preserved; gates produced **false negatives**.

---

## Design principle

Replace literal substring checks with **semantic marker IDs** that accept equivalent phrasing families while still rejecting synopsis/shell collapse (38M anti-synopsis guarantees unchanged).

---

## Marker catalogue

| Marker ID | Satisfied when |
|-----------|----------------|
| `strategy_a` | `/Strategy\s+A\s*:/i` |
| `strategy_e` | `/Strategy\s+E\s*:/i` |
| `weak_worked_judgement` | `Weak Judgement` OR `Weak Evaluation Example` OR `Slogan-style` |
| `strong_worked_judgement` | `Strong Judgement` OR `Strong Evaluation Example` OR `Criteria-led` |
| `guided_table_exemplar` | `hasGuidedTableExemplar()` — pipe table with Strategy A–E rows or Budget Tightening exemplar pattern |
| `transfer_word_band` | `at least 80 words` |
| `consolidation_reflect` | `Reflect on` OR ≥3 bullet lines OR `consolidat` |

Tier-A contracts in `FIDELITY_CONTRACTS` now reference marker IDs, not display strings.

---

## API surface

| Export | Role |
|--------|------|
| `semanticMarkerSatisfied(markerId, text)` | Single-marker check |
| `evaluateMaterialMarkers(body, markers)` | Returns `{ found, missing }` |
| `hasGuidedTableExemplar(text)` | Table exemplar without Budget Tightening literal requirement |

---

## Non-weakening guarantees

- Ratio gates G1/G2 unchanged (≥90% Tier-A).
- `tableShellCollapse` still flags `Partial example` without exemplar rows.
- `catalogueSynopsis` still fails when synopsis text present **and** semantic markers absent.
- Literal markers remain the `default` branch in `semanticMarkerSatisfied` for Tier-D keys (e.g. `Distribution Lens`).

---

## Verification

- `EV-38M-AFTER` A4: G4/G5 pass on replay.
- `tests/page-38n-fidelity-hardening.test.js` — R1 semantic marker test.
- Frozen `EV-38L-AFTER` regression suite unchanged (17/17 + 4 new = 21/21).
