# Sprint 38-F — Fixtures

**Status:** Links to Sprint **38-D** validation fixtures and **38-E** comparator artefacts — no duplicate bodies unless 38F-3 charters sprint-local checks.

---

## Validation authority

| Document | Path |
|----------|------|
| V-01 … V-13 | [38D-4 observation](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) |
| Before/after framework | [38D-5 observation](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) |
| Canonical PASS | [38D-3](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-3-canonical-workbook-fixture.md) · `CW-REF-38D3` |

---

## Canonical PASS reference (`CW-REF-38D3`)

| Document | Path |
|----------|------|
| Manifest | [canonical-workbook-reference-manifest.md](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/canonical-workbook-reference-manifest.md) |
| DLA outline | [canonical-workbook-dla-outline.md](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/canonical-workbook-dla-outline.md) |
| GAM expectations | [canonical-workbook-gam-expectations.md](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/canonical-workbook-gam-expectations.md) |

---

## Frozen comparators (read-only)

| ID | Location |
|----|----------|
| **EV-01** | [38B fixtures](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/) · [NEG index](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/negative-exemplar-ev01-index.md) |
| **EV-38E5** | [38-E artefacts](../2026-06-04-sprint-38e-workbook-contract-implementation/artefacts/EV-38E5-AFTER-*) |
| **EV-38E10** | [38-E artefacts](../2026-06-04-sprint-38e-workbook-contract-implementation/artefacts/EV-38E10-AFTER-*) |

---

## Usage in 38-F

1. **38F-1** — score `EV-38E10` against V-01 and V-05 using [38E-10](../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-10-inflation-rerun-scorecard.md).  
2. **38F-3** — confirm pack deltas trace to 38D-4; compare type inventory ≠ EV-01-only.  
3. **38F-4** — capture `EV-38F-AFTER`; four-way table EV-01 / 38E5 / 38E10 / 38F.  
4. Do **not** modify 38-B or 38-E committed artefacts.
