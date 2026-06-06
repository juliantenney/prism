# Sprint 38-N — Implementation charter (Page Fidelity Hardening)

**Date:** 2026-06-05  
**Status:** **CLOSED** — [38N-5](observations/38N-5-sprint-closure.md) · **SUCCESS**  
**Predecessor:** [Sprint 38-M](../2026-06-05-sprint-38m-page-composition-fidelity/) (**CLOSED** — [38M-6](../2026-06-05-sprint-38m-page-composition-fidelity/observations/38M-6-sprint-closure.md) · **SUCCESS (mission)**)

---

## Mission

**Page Fidelity Hardening** — resolve known residuals R1–R3 from Sprint 38-M without redesigning instructional architecture, educational strategy, or depth obligations.

**Not:** discovery sprint; schema/ACM/workflow redesign; renderer CSS overhaul; GAM regeneration overhaul.

---

## Inherited residuals (38M-6)

| ID | Problem | 38N goal |
|----|---------|----------|
| **R1** | Marker literal generalisation — fresh GAM phrasing causes G4/G5 false negatives | Semantic marker families without weakening fidelity |
| **R2** | Render alias-key sequencing bypass — alias keys skip `materials_order` | Single authoritative render ordering path |
| **R3** | Validator/schema alignment — `scenarios[]`, alias keys cause false negatives | Align validation contracts with current schema reality |

---

## Core goals

| ID | Goal | Deliverable |
|----|------|-------------|
| **H1** | Semantic marker generalisation (R1) | [38N-1](observations/38N-1-marker-generalisation-design.md) |
| **H2** | Render ordering hardening (R2) | [38N-2](observations/38N-2-render-ordering-hardening.md) |
| **H3** | Validator schema alignment (R3) | [38N-3](observations/38N-3-validator-schema-alignment.md) |
| **H4** | Proof run — `proofOk: true` without conditional exceptions | [38N-4](observations/38N-4-proof-run.md) |
| **H5** | Sprint closure | [38N-5](observations/38N-5-sprint-closure.md) |

---

## Touch surfaces

| Surface | Change |
|---------|--------|
| `lib/page-gam-materials-preserve.js` | Semantic markers, `pageMaterialText`, alias-aware validators |
| `lib/page-a3-materials-sequencing.js` | `MATERIAL_RENDER_ALIAS_GROUPS`, `markMaterialAliasGroupRendered` |
| `app.js` | Declared-order render path; alias suppression when `materials_order` set |
| `artefacts/ev-38m-inflation-pipeline-capture-once.mjs` | `findActivityTitles` uses `section.content` |
| `tests/page-38n-fidelity-hardening.test.js` | **4 tests** — R1/R2/R3 on `EV-38M-AFTER` |
| `artefacts/ev-38n-proof-replay.mjs` | 38N-4 replay harness |

**Hold:** 38M preservation guarantees (ratio + anti-synopsis) unchanged.

---

## Success criteria

| Criterion | Target | Result |
|-----------|--------|--------|
| R1 resolved | G4/G5 pass on fresh phrasing | ✓ |
| R2 resolved | A3 render follows `materials_order` with alias keys | ✓ |
| R3 resolved | Fresh EV validates without schema false negatives | ✓ |
| Proof | `proofOk: true` on replay | ✓ `EV-38N-AFTER` |
| Regression | No 38M preservation regression | ✓ **21/21** tests |

---

## Phases

| Phase | Type | Status |
|-------|------|--------|
| 38N-1 Marker generalisation design | Design doc | **Complete** |
| 38N-2 Render ordering hardening | Code + tests | **Complete** |
| 38N-3 Validator schema alignment | Code + tests | **Complete** |
| 38N-4 Proof run | Harness replay | **Complete** |
| 38N-5 Sprint closure | Docs | **Complete** |
