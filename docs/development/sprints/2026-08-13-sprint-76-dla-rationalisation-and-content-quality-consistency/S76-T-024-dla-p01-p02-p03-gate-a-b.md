# S76-T-024 — DLA-P01 / P02 / P03 Gate A + Gate B implementation

**Task:** S76-T-024  
**Status:** **Gate A + Gate B complete** (2026-08-13) — awaiting operator review before Gate C  
**Mode:** Authorised implementation of [S76-T-023](S76-T-023-dla-p01-p02-p03-implementation-plan.md) through Gate B only  
**Depends on:** [T-010](S76-T-010-dla-audit-report.md) · [T-020](S76-T-020-dla-p02-solution-design.md) · [T-021](S76-T-021-dla-p01-solution-design.md) · [T-022](S76-T-022-dla-p03-solution-design.md) · [T-023](S76-T-023-dla-p01-p02-p03-implementation-plan.md)  
**Out of scope (not started):** Gate C (Roman Roads / Lagrangian) · DLA-P04 · DLA-P05 · Settings · wider DLA prompt rationalisation

This artefact records what was implemented. It does **not** authorise Gate C. It does **not** claim RECOVER. It does **not** mark P04 or P05 complete.

---

## 1. Contract version

| Field | Before | After |
| ----- | ------ | ----- |
| `lib/ld-dla-page-enrich-contract.js` `CONTRACT_VERSION` | `58-DLA-PARTIAL-3` | **`76-DLA-PARTIAL-4`** |

`schema_version` remains `"2.0.0"`. No new schema-version framework.

---

## 2. Files changed

### Production

| File | Change |
| ---- | ------ |
| `lib/page-dla-enrich.js` | Shared P01/P03 validators; P02 without prose fail-close; always-required `evidence_decision`; always-array `required_materials`; provider ⊆ task-input; enrich emits `task_material_decision` |
| `lib/ld-dla-page-enrich-contract.js` | Canonical shape + commissioning order + required payload; version bump |
| `app.js` | OUTPUT CONTRACT lists `task_material_decision` (production → inputs → commissions → evidence); GAM brief: specification is binding |
| `lib/page-gam-enrich.js` | Preserve `task_material_decision` (and `evidence_decision`) as DLA-owned; 1:1 fulfilment unchanged |
| `index.html` | Cache pins `?v=20260813-s76-dla-p01-p02-p03` on contract, DLA enrich, GAM enrich |

### Tests / fixtures

| File | Change class |
| ---- | ------------ |
| `tests/s76-dla-p01-p02-p03-contract.test.js` | **New** Gate A contract matrix (partial + full) |
| `tests/s76-dla-commission-shape.js` | **New** fixture helper (not listed in T-023) |
| `tests/s75-dla-evidence-decision-false-positive.test.js` | Obsolete fail-close → P02 pass |
| `tests/s76-dla-procedural-task-evidence-validation.test.js` | Obsolete fail-close → P02 pass |
| `tests/sprint-72-evidence-centred-activity-slice.test.js` | Obsolete wording fail-close → P02 pass; preserve genuine provider-closure / evidence-product tests |
| `tests/page-dla-enrich.test.js` | Enrich emission + Gate B dual-injection |
| `tests/page-gam-enrich.test.js` | Specification binding; GAM must not mention `task_material_decision` |
| `tests/ld-dla-evidence-decision-consistency-prompt.test.js` | Commissioning order + shape; KEEP PRE-EMIT / INVALID–VALID |
| `tests/ld-instructional-archetype-production-planning.test.js` | Version + shape |
| Archetype / title / S75 activities-missing / intellectual-coherence builders | Fixture migration |
| `tests/fixtures/page-assemble/dla-partial.json` | Fixture migration |
| Sprint 60 mixed-archetype artefact JSON | Fixture migration |

### Sprint documentation (this update)

STATUS / PLAN / HANDOVER / next-chat / README / START-HERE / this file. P04 and P05 remain incomplete.

---

## 3. Implementation summary

**P01.** Every activity must declare `task_material_decision`. `required_materials` is always an array. `true` ⇒ ≥1 unique non-empty id, each in that activity’s `required_materials[]`. `false` ⇒ empty ids; teaching/scaffold rows still allowed. Missing object is a fail (no silent `false`). No inference from `learner_task` prose.

**P02.** `evidence_decision` is required on every activity. `required:true` ⇒ non-empty providers, each in `required_materials`, each listed in `task_input_material_ids`, each with `evidence_requirement`. `required:false` ⇒ empty providers and no `evidence_requirement` rows. Fail-closed `inferredEvidenceDemand` / `taskLooksEvidenceDependent` wording contradiction **removed**. Existing provider/shape/scaffold-role closure preserved.

**P03.** Every `required_materials[]` row needs non-empty trimmed `purpose` and `specification`. Type-echo fail-close is **specification only** after: trim → lowercase → whitespace/hyphen normalisation → strip leading/trailing `_` → ignore trailing ASCII punctuation `[.,;:!?]+` → compare with normalised `material_type`/`type`. Purpose equal to a type token **passes**. No semantic-quality regexes, word-count floors, purpose type-echo, or new P03 schema. `instructional_archetype` remains optional.

**Non-Copy enrich.** `enrichActivityWithDla` emits a structurally valid `task_material_decision` from existing evidence-provider rows only. Beat→material mapping is not reinterpreted as P01 semantics; practice operands are not invented from EP beats.

**GAM.** Preserves `task_material_decision`. Fulfils `required_materials[]` 1:1. Brief adds only: treat `specification` as binding. GAM does not interpret `task_material_decision` or discover missing inputs.

---

## 4. Gate A result

**PASS.**

Partial and full DLA validators agree. Contract matrix covers:

- P01 pass: inline-complete / ordinary practice + evidence false / evidence task with provider as task input  
- P01 fail: missing object / true+no ids / false+ids / duplicate id / unknown id / `required_materials` absent  
- P02 pass: procedural task-input + evidence false / valid evidence + provider closure / evidential-looking wording with `required:false`  
- P02 fail: true+no provider / provider absent from materials / provider not a task input / provider missing `evidence_requirement`  
- P03 pass: non-empty purpose + meaningful specification; **purpose equal to material-type token is not rejected**  
- P03 fail: missing/empty purpose; missing/empty specification; specification equal to type; specification equal after accepted normalisation  

---

## 5. Gate B result

**PASS.**

- Canonical shape contains `task_material_decision`  
- Field order: production → inputs → commissions → purpose/specification → evidence  
- `required_materials` always an array  
- Purpose/specification responsibilities explicit  
- `evidence_decision` required  
- Contract version `76-DLA-PARTIAL-4`  
- No third unique contract/shape injection (`app.js` still two `buildDlaPageEnrichContractBlock()` and two `buildCanonicalDlaPageShapeSnippet()` call sites)  
- No broad P04 rationalisation (PRE-DESIGN / PRE-EMIT / per-activity audit / INVALID–VALID kept)  
- GAM brief limited to specification binding; 1:1 unchanged  
- Unique prompt growth small (see §7)

---

## 6. Tests run and results

| Suite | Result |
| ----- | ------ |
| Gate A core (T-023 §P) + Gate B prompt/GAM | **199 pass / 0 fail** |
| Remaining affected DLA/GAM/assemble (archetype, title, S75 activities-missing, intellectual-coherence, partial-capture, GAM copy delivery, vNext assemble) | **158 pass / 0 fail** |

Combined targeted + directly affected: **357 pass / 0 fail**.

Historical expectation classification:

| Change | Class |
| ------ | ----- |
| S75-D15 E/F/H, Sprint 72 A3/A5 wording, literary form, S76 FAIL 6–10 now **pass** with `required:false` | **Obsolete** — accepted P02 contract |
| Fixtures/builders filling purpose, specification, `task_material_decision`, `evidence_decision` | **Fixture migration** |
| Genuine provider-closure / Sprint 72 evidence-product / PRE-EMIT prompt text | **Preserved** |
| None identified | **Genuine regression** |

---

## 7. DLA Copy unique size

Measured from `buildDlaPageEnrichContractBlock()` + `buildCanonicalDlaPageShapeSnippet()` (one unique pair; Copy still dual-injects).

| | Unique contract | Unique shape | Unique sum | Assembled ×2 |
| - | -------------- | ------------ | ---------- | ------------ |
| Before Gate B | — | — | **22,577** | **45,154** |
| After Gate B | **16,642** | **6,568** | **23,210** | **46,420** |
| Δ | | | **+633** | **+1,266** |

Within T-023 budget (~0.5–1.0k unique; ~1–2k assembled ×2). No third unique contract/shape call site.

---

## 8. Heuristic functions

| Function | Status | Why |
| -------- | ------ | --- |
| Fail-closed `inferredEvidenceDemand` / wording contradiction | **Removed** | P02 |
| `taskLooksEvidenceDependent` | **Retained** | Warn-only `activityLooksSourceAnalytical` → `collectDlaEvidenceQualityDiagnostics` |
| `looksLikeProceduralTaskMaterialPractice` | **Retained** | Helper of the retained warn heuristic |
| `looksLikeInstructionalScaffoldNotSourceEvidence` | **Retained** | S75-D15 warn stack |
| `materialLooksTeachingOnly` | **Kept** | Structural provider-role closure |

T-023 allowed deleting `looksLikeProceduralTaskMaterialPractice` if unused after the call-path change. It remains used by the warn path, so it was kept.

---

## 9. Deviations from T-023

1. Shared test helper `tests/s76-dla-commission-shape.js` (not listed in T-023; fixture migration only). Optional `fillBridge` — full-page validate requires `intellectual_coherence_bridge`; default remains unfilled so Owen missing-bridge fail still fires.  
2. Sprint-72 `validateShapedDlaEnrichedPage` wrapper + title-contract test 14 fills placeholder bridges **in the test only** (enrich still does not invent generic LO bridges).  
3. Cache pins also bumped for `ld-dla-page-enrich-contract.js` and `page-gam-enrich.js` (T-023 named `page-dla-enrich.js` only).  
4. OUTPUT CONTRACT field order adjusted to production → inputs → commissions → evidence, not only appending the new object.  
5. Dual-injection Gate B test asserts `app.js` call-site counts plus OUTPUT CONTRACT token (sandbox Copy path does not always resolve the contract lib).  
6. Specification type-echo uses `normalizeSpecificationTypeEchoToken` on both specification and type (accepted normalisation, including trailing punctuation), slightly more than `tokenizeMaterialType` alone.

No accepted-contract weakening.

---

## 10. Unresolved / Gate C blockers

- Operator review of this Gate A/B change-set.  
- Gate C (Roman Roads control + Lagrangian challenge) **not run** — first post-repair scores, by plan, before P04/P05.  
- Generative risk: model may omit `task_material_decision` (not fail-closed from prose). Inspect DLA captures in Gate C.  
- P04 evidence-prompt accretion and P05 Copy dual-injection remain open.  
- Continue-to-Authoring async refresh remains a separate open defect.  
- Working tree may still contain unrelated transition fixes; inspect `git status` before any commit.

**READY FOR OPERATOR REVIEW BEFORE GATE C**

*End of S76-T-024. Do not start Gate C, P04, or P05 from this artefact.*
