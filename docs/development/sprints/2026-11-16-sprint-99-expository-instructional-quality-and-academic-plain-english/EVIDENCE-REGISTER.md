# Sprint 99 — Evidence register

**Sprint:** 99 — Expository Instructional Quality and Academic Plain English  
**Opened:** 2026-11-16  
**Opening:** [S99-D01](decisions.md#s99-d01--open-sprint-99--expository-instructional-quality-and-academic-plain-english)  
**M1:** [S99-D02](decisions.md#s99-d02--accept-m1--provisional-educational-evaluation-of-three-expository-resources)  
**M2:** [S99-D03](decisions.md#s99-d03--accept-m2-investigation-findings-and-propose-m3-scope) · [M2-INVESTIGATION.md](M2-INVESTIGATION.md)  
**Investigation (M0):** [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md)

Status vocabulary: **Confirmed** · **Hypothesis** · **Monitoring** · **Resolved** · **Verified** · **Provisional** · **Not claimed** · **Gap** · **Defect** · **Guidance gap** · **Educational concern** · **Acceptable** · **Debt**

---

## Findings ledger

| ID | Status | Finding |
| -- | ------ | ------- |
| S99-E01 | **Confirmed (code)** | Expository uses EJP → XD → XM (+ shared GLC/LO/MK/DP), assembled via `page-vnext-assemble` Expository path; not Interactive EP/DLA/GAM. |
| S99-E02 | **Confirmed (code)** | Profile: `activities_required: false` / `materials_required: false`; renderer uses `pageKind: "expository"` and `expositionSections`. |
| S99-E03 | **Confirmed (code)** | S98-D08 typography injects **before** route branching — Expository runtime augmentations receive `LD-LEARNER-FACING-PROSE-TYPOGRAPHY`. |
| S99-E04 | **Confirmed (code)** | Interactive Academic Plain English (`LD-GAM-INSTRUCTIONAL-DEPTH`) does **not** apply on the Expository promptRoute branch. |
| S99-E05 | **Confirmed (code)** | Expository route also receives domain guidance, math-safe and strict JSON after typography; EQF only when step id is an Interactive EQF target (EJP/XD/XM are not). |
| S99-E06 | **Confirmed (guidance reading)** | Expository sibling prompts treat explanation-first, optional invitations, selective examples, and productive recurrence as appropriate. |
| S99-E07 | **Partial** | Learner HTML ZIPs for three M1 cases reviewed; **assembled JSON still absent** from workspace. |
| S99-E08 | **Gap** | S98-D08 not yet validated through generation inspection of assembled prose/markers. |
| S99-E09 | **Superseded by E11** | Whether Expository needs adapted APE — now classified as confirmed guidance gap. |
| S99-E10 | **Hypothesis / monitoring** | Authored EJP/XD vs rendered experience — order appears coherent on HTML; field leakage not observed in HTML. |
| S99-E11 | **Guidance gap → Addressed (M3-2)** | Expository APE now in GLC/XD/XM sibling prompts; Interactive APE/layer purposes still excluded. Generation quality pending. |
| S99-E12 | **Defect → Addressed (M3-1)** | XD/EJP planning string-lists use `normalizePlanningStringList` — no `String(object)` coercion. |
| S99-E13 | **Acceptable** | Renderer ignores invitations/hooks — no learner `[object Object]` in M1 HTML; invitations not surfaced. |
| S99-E14 | **Educational concern** | Extent/WPM is planning metadata; no Expository header duration; learning effort ≠ reading speed alone. |
| S99-E15 | **Educational concern** | Some XM comparison tables near-restate enumerated prose; others are complementary representations. |
| S99-E16 | **Provisional / Acceptable** | M1 educational judgement positive — no broad redesign warranted. |
| S99-E17 | **Gap** | Assembled JSON for the three M1 cases not in workspace (blocks live verification of E12 payloads). |
| S99-E18 | **Debt → Addressed (M3-1)** | EJP string-lists now use the same safe normaliser as XD invitations/hooks. |
| S99-E19 | **Debt / monitoring** | EQF manifestations do not target EJP/XD/XM. |

---

## M0 — Pipeline investigation

**Complete.** Detail: [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md).

---

## M1 — User-led generation / educational evaluation

**Decision:** [S99-D02](decisions.md#s99-d02--accept-m1--provisional-educational-evaluation-of-three-expository-resources)

| Artefact | Status |
| -------- | ------ |
| Learner export ZIPs (Downloads) | **Reviewed** — gradients / claim-true / what-changed |
| Assembled page JSON | **Gap** — not deposited in workspace |
| Educational evaluation | **Provisional positive** — coherent progression; disciplinary precision; usable understanding |

Approximate HTML word mass (rough): gradients ~4012; claim-true ~2984; what-changed ~1672. Not an optimisation target.

---

## M2 — Focused investigation

**Decision:** [S99-D03](decisions.md#s99-d03--accept-m2-investigation-findings-and-propose-m3-scope)  
**Detail:** [M2-INVESTIGATION.md](M2-INVESTIGATION.md)

Covered: APE reach; `[object Object]` coercion; effort/extent; XD/XM duplication; M3 proposal.

---

## M3 — Targeted implementation (M3-1 + M3-2 only)

**Decision:** [S99-D04](decisions.md#s99-d04--implement-m3-1-and-m3-2-only)  
**Validation:** [VALIDATION.md](VALIDATION.md)

| Package | Record |
| ------- | ------ |
| M3-1 | Safe planning string-list normalisation at XD capture (+ EJP lists); focused tests green |
| M3-2 | Expository APE in GLC/XD/XM; Interactive routes unaffected; typography preserved |
| M3-3 / M3-4 | Not implemented |
| Regen / commit / close | Not performed |

---

## M4 — Normal regeneration review (at close)

**Decision:** [S99-D05](decisions.md#s99-d05--close-sprint-99--accepted-with-qualifications)

Author reviewed a normal Expository regeneration including assembled JSON and learner-facing export. Together with M3-1/M3-2 regressions, this supports qualified acceptance. Original M1 object-shaped XD payloads remain unrecovered (qualification 1).

| ID | Status | Finding |
| -- | ------ | ------- |
| S99-E20 | **Provisional → Accepted at close (qualified)** | M4 regeneration review supports M3-1/M3-2 adequacy without broad redesign |

**Deferred:** M3-3 (S99-AD-008), M3-4 (S99-AD-007).  
**Programme carry:** Interactive LS fidelity → [D-015](../../../governance/ARCHITECTURAL-DEBT.md#d-015--interactive-learning-sequence-study-flow-fidelity) (S99-AD-012).
