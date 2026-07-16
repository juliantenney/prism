# Source-to-Material Correlation and Retention Feasibility

**Sprint:** 64 — Task 2b (S64-BL-002b)  
**Type:** Bounded feasibility experiment (diagnostic only)  
**Date:** 2026-07-16  
**Status:** Complete  

**Artefacts:** [experiments/correlation-feasibility/](experiments/correlation-feasibility/)  
**Predecessor:** [candidate-preservation-mechanisms.md](candidate-preservation-mechanisms.md)

---

## 1. Objective

Determine whether:

1. post-GAM `required_materials[]` is reliably retained across pipeline paths, and  
2. `material_id` is a stable join between upstream instructional plans and realised materials, and  
3. Mechanisms A / D / E can work consistently — or only under path constraints.

---

## 2. Pipeline Variants

| Path | Entry Point | Source Contract Present Initially | Output Shape | Representative Artefact |
| ---- | ----------- | --------------------------------- | ------------ | ----------------------- |
| **DLA / pre-GAM** | DLA enrich | Yes (`required_materials`) | Plans + empty/absent bodies | `dla-mixed-priority1.page.json`; `dla-partial.json` |
| **Full-page GAM (contract)** | GAM enrich-in-place brief | Yes on input | Instructed to retain `required_materials` + populate `materials` | `app.js` `buildUpstreamDlaPageEmbedSectionForGamCopy` |
| **Partial GAM** | GAM materials-only brief | On upstream page, not in partial output | `activities[].materials[]` only | `gam-partial.json`; Ed Psych / Marx **GAM captures** |
| **Material-only assembled** | Assembled render fixture | No | `materials[]` only | RNA assembled vnext |
| **Preserve / normalize** | L4 merge / render normalize | Only if present on page | Bodies merged; no plan fields | `page-gam-materials-preserve.js` |
| **Fixture / diagnostic** | Sprint 63 Exp 2–3 | Yes (authored) | Both arrays or cross-artefact join | Exp2 experimental page; Exp3 diagnostics |

Behavioural distinction that matters: **whether the source contract is on the same artefact as realised materials** after GAM.

---

## 3. Retention Survey

| Path | required_materials Retained? | Plan Retained? | materials Retained? | Evidence |
| ---- | ---------------------------- | -------------- | ------------------- | -------- |
| DLA page | **yes** | **yes** when authored | no / empty | mixed DLA; dla-partial; Ed Psych DLA capture |
| Full-page GAM (instructed) | **conditional** (prompt requires copy) | conditional | **yes** | `buildUpstreamDlaPageEmbedSectionForGamCopy` |
| Partial GAM output | **no** | **no** | **yes** | `buildGamV2CopyMaterialAuthoringBrief`; Ed Psych/Marx GAM captures; `gam-partial.json` |
| Material-only assembled | **no** | **no** | **yes** | RNA assembled fixture |
| Preserve/normalize | N/A (passthrough) | **no** (no plan handling) | **yes** (bodies) | preserve module |
| Exp2 diagnostic | **yes** | **yes** | **yes** | experimental-assembled-page.json |

**Drop point for source on common live path:** partial GAM capture emits materials-only — source is not on that artefact (may still exist earlier in workflow as DLA capture).

**Full-page retention:** instructed in code, but the two production-like workflow captures inspected (Ed Psych, Marx) used **partial GAM** shape (`required_materials` absent on GAM artefact).

---

## 4. Intended Correlation Contract

| Question | Answer | Evidence |
| -------- | ------ | -------- |
| 1. Where is `material_id` created? | DLA / authoring on `required_materials[]` | DLA fixtures; `ld-dla-page-enrich-contract` examples |
| 2. Who owns creation? | DLA planning emission | Sprint 60 SoT |
| 3. Required or optional? | **Required** at GAM boundary validation when validating full GAM page | `page-gam-enrich.js` validate: `material_id required` |
| 4. Validated? | **Yes** at GAM validation | missing / orphan / count mismatch errors |
| 5. Uniqueness enforced? | **Yes within activity** on materials in partial validation; full validation flags duplicate / mismatch | `validateGamPartialPageCapture` duplicate check; full validate orphan/missing |
| 6. Preserved verbatim through GAM? | **Intended:** `buildMaterialFromRequired` copies `required.material_id`; full-page must not modify `required_materials` | `page-gam-enrich.js` lines ~233–245, ~715–718 |
| 7. Copied onto realised materials? | **Yes** when hydration follows contract | same |
| 8. Multiple materials per requirement? | **Not allowed** by contract (“exactly one hydrated material per required_materials.material_id”; counts must match) | GAM V2 brief; validate count equality |
| 9. One material, multiple requirements? | **Not allowed** (orphan material_id error) | validate |
| 10. Drop / merge / split / reorder? | Drop/mismatch → validation error; reorder OK if ID-keyed | validate; preserve keys by id |
| 11. IDs regenerated? | **Not** in `buildMaterialFromRequired` | copies source id |
| 12. Partial paths preserve original ID? | **Yes on materials** when emitted; **source array absent** on partial artefact | gam-partial; live GAM captures |

---

## 5. Sample

| Sample | Path Type | Required Materials Count | Realised Materials Count | Why Included |
| ------ | --------- | ------------------------ | ------------------------ | ------------ |
| **S1** | Diagnostic both-arrays | 1 | 1 | Exp 2 mechanism |
| **S2** | Diagnostic cross-artefact | 1 | 1 | Exp 3 process |
| **S3** | Diagnostic cross-artefact | 1 | 1 | Exp 3 mental-model |
| **S4** | Production-like DLA↔GAM | 23 | 23 | Ed Psych multi-material |
| **S5** | Production-like DLA↔GAM | 26 | 26 | Marx multi-material |
| **S6** | Partial material-only | 0 | 2 | gam-partial fixture |
| **S7** | Material-only assembled | 0 | 29 | RNA assembled |
| **S8** | DLA-only multi-required | 4 | 0 | mixed Priority-1 plans |

---

## 6. Correlation Results

Join key: `required_materials[].material_id` ↔ `materials[].material_id` only.

For **S4 + S5** (production-like cross-stage joins): **49/49 exact 1:1**.

For **S1–S5** (including diagnostics): **52/52 exact 1:1**.

**S6/S7:** all realised rows are **orphan realised material** relative to on-artefact source (no `required_materials`).

**S8:** **not assessable** (no realised materials).

No one-to-many, many-to-one, duplicate IDs, or missing IDs in joined assessable samples.

Full row dump: [experiments/correlation-feasibility/correlation-report.json](experiments/correlation-feasibility/correlation-report.json).

---

## 7. Coverage Metrics

**Bounded-sample only — not repository-wide.**

### Production-like joined (S4+S5)

| Metric | Numerator | Denominator | % |
| ------ | --------- | ----------- | - |
| Source coverage (exact 1:1) | 49 | 49 | **100%** |
| Realised coverage (exact 1:1) | 49 | 49 | **100%** |
| Source ID presence | 49 | 49 | **100%** |
| Realised ID presence | 49 | 49 | **100%** |
| Ambiguity rate | 0 | 49 | **0%** |

### With diagnostics (S1–S5)

| Metric | Value |
| ------ | ----- |
| Source coverage exact 1:1 | 52/52 = **100%** |
| Ambiguity | **0%** |

### Material-only (S6+S7)

| Metric | Value |
| ------ | ----- |
| Source coverage | **not assessable** (no source) |
| Orphan realised (vs on-artefact source) | 31 unmatched rows |

---

## 8. Orphans and Mismatches

| Case | Failure Type | Pipeline Stage | Likely Cause | Confidence |
| ---- | ------------ | -------------- | ------------ | ---------- |
| S6 A1-M1, A2-M1 | orphan realised | Partial GAM output | Source contract not on partial artefact | High |
| S7 all RNA materials | orphan realised | Assembled material-only | `required_materials` never on fixture | High |
| S8 all required rows | not assessable | Pre-GAM | No materials yet | High |
| S4/S5 joined | none | Cross-stage | IDs align DLA→GAM | High |

No evidence in this sample of ID regeneration, split/merge, or type-based mis-joins when both sides exist.

---

## 9. Full vs Partial Paths

| Property | Full Page (contract) | Partial | Material Only |
| -------- | -------------------- | ------- | ------------- |
| Source contract availability | Conditionally reliable (instructed; not seen on live partial captures) | **Unsupported** on output artefact | **Unsupported** |
| Identifier preservation | Reliable when hydrated from required | Reliable on materials | Reliable on materials |
| Correlation reliability | Reliable **if** both arrays present | **Fragile** (needs external DLA context) | **Unsupported** |
| Opaque reference feasibility | Conditionally reliable | Conditionally reliable **only with** retained upstream DLA | Unsupported alone |
| Preserve/normalize bridge | Conditionally reliable if source on page | Fragile / unsupported without source | Unsupported |
| Missing source behaviour | Must fail closed | Must fail closed | Must fail closed |

---

## 10. Mechanism Feasibility

| Mechanism | Full Path | Partial Path | Material-Only Path | Main Blocker |
| --------- | --------- | ------------ | ------------------ | ------------ |
| **A** Retain `required_materials` | **Conditionally reliable** (contract yes; live captures often partial) | **Unsupported** on GAM artefact | **Unsupported** | Partial output omits array |
| **D** Opaque `material_id` reference | **Reliable** when both sides available | **Conditionally reliable** if DLA capture still accessible | **Unsupported** | No source to reference |
| **E** Preserve/normalize bridge | **Conditionally reliable** | **Fragile** | **Unsupported** | Needs source on page at bridge time |

**B / C / F status change?** None material — still conditional on source+correlation; this experiment **supports** using `material_id` when source exists, and **strengthens** path-gating requirements. Subset/full projection remains premature until manifestation contracts.

---

## 11. Required Guardrails

| Guardrail | Class |
| --------- | ----- |
| Source contract must exist (validated `required_materials` with plan where claimed) | **required** |
| `material_id` present on both sides | **required** |
| IDs unique within activity scope | **required** |
| Correlation exact 1:1 only | **required** |
| No fallback to title, type, or array index | **required** |
| Ambiguous / missing matches fail closed (no preservation) | **required** |
| Unmatched materials remain Tier 2 only | **required** |
| Source values remain verbatim | **required** |
| No learner-facing exposure from invalid/unvalidated plans | **required** |
| Explicit path gate: skip when artefact is materials-only | **required** |
| Prefer activity-scoped join (`activity_id` + `material_id`) | **advisable** |
| Diagnostic logging of skip reasons | **advisable** |
| Re-validate with `validateMaterialArchetypePlan` before expose | **advisable** |
| Generation stamps / freshness checks | **optional** |

---

## 12. Limitations

* Bounded sample (8 artefacts); not corpus-wide.  
* S2/S3 use diagnostic material stand-ins (ID-aligned by construction).  
* S4/S5 correlate **across workflow captures**, not a single post-GAM page containing both arrays.  
* No captured full-page GAM artefact in-sample that retains `required_materials` alongside `materials` (Exp2 diagnostic is the closest same-artefact both-arrays case).  
* Priority-1 plans absent on Ed Psych/Marx rows — correlation tested; plan retention tested elsewhere (S1–S3, S8).

---

## 13. Outcome

## Outcome B — Feasible With Explicit Constraints

* When source and realised materials are both available, **`material_id` 1:1 correlation was perfect** in this sample (52/52).  
* **Partial and material-only paths do not retain `required_materials`** on the output artefact.  
* A bounded opaque-reference or bridge prototype may proceed **only** with path gating and fail-closed behaviour when source context is absent.

---

## 14. Recommended Next Task

**S64-BL-003 — Candidate manifestation contracts**, constrained to:

* paths / artefacts where source contract is available, and  
* exact 1:1 `material_id` correlation, and  
* Mechanisms A/D/(E) as preservation inputs — still no production implementation.

---

## Success condition met

Current retained source contracts and identifiers are **sufficient to support a bounded preservation experiment** under explicit path constraints — without implementing the mechanism in production.
