# S76-T-046 — Generated-operand operational suitability implementation plan

**Task:** S76-T-046  
**Status:** **Planning complete** (2026-08-14) — **NO IMPLEMENTATION AUTHORISED**  
**Mode:** IMPLEMENTATION PLANNING ONLY — no production, prompt, schema, validator, test, fixture, EP, DLA-WB, GAM D/E, or P05 changes  
**Depends on:** [T-030](S76-T-030-generated-operand-operational-suitability-diagnostic.md) · [T-031](S76-T-031-generated-operand-operational-suitability-solution-design.md) · [T-036](S76-T-036-dla-p04-evidence-guidance-rationalisation-implementation.md) · [T-041](S76-T-041-dla-p01-r1-intermediate-operand-implementation.md) · [T-044](S76-T-044-dla-lo-operation-coverage-implementation.md) · [T-045](S76-T-045-dla-lo-operation-coverage-gate-c-diagnostic.md)  
**Accepted option:** T-031 Option 3 — paired minimal clarification (DLA Step 3 + GAM specification-as-binding sentence)

**IMPLEMENTATION PLAN ONLY. NO IMPLEMENTATION AUTHORISED.**

Do not reopen P01-R1 or T-033. Do not start P05. Do not investigate GAM D/E.

---

## 0. Verdict

Option 3 still fits the **current** live contracts. Step 3 is intact after P04 / T-041 / T-044. GAM Copy still injects `buildGamV2CopyMaterialAuthoringBrief()` as the model-visible authoring body, and that brief still contains the specification-as-binding sentence. Operational-suitability wording is **absent** from live prompts (class **A**). Recommend one coordinated paired implementation when authorised.

**BLOCKER:** none.

---

## 1. Current DLA Step 3

Quoted from `lib/ld-dla-page-enrich-contract.js` commissioning-order (live `76-DLA-PARTIAL-8`):

> 3) Commission every required material. required_materials must be an array. For every row: non-empty purpose (the job of this material) and non-empty specification (binding GAM bounds: content, load-bearing count/variation/constraints/exclusions; not body prose). specification must not be only the material_type token.

**DLA STEP 3 PRESERVED: YES**

Ownership of the five steps still matches T-031:

| Step | Live opening | Owner |
| ---- | ------------ | ----- |
| 1 | Define the learner production obligation… mapped LO… (T-033) | Production / LO coverage — **do not edit** |
| 2 | Decide whether separate task operands… (P01-R1) | Operand identity — **do not edit** |
| 3 | Commission every required material… purpose/specification | P03 / T-031 DLA leg |
| 4 | Independently decide particulars-as-grounds | P02 — **do not edit** |
| 5 | If evidence true: providers + evidence_requirement | Provider authoring — **do not edit** |

P04 thinned evidence audits around this order; it did **not** rewrite Step 3. T-041 edited Step 2 only. T-044 edited Step 1 only. T-044 Gate A still asserts the Step 3 gloss `binding GAM bounds: content, load-bearing count/variation/constraints/exclusions`.

---

## 2. Current GAM binding surface

Exact live sentence in `app.js` `buildGamV2CopyMaterialAuthoringBrief()`:

> Honour required_materials[].purpose and treat specification as binding content bounds.

It sits on the same line as the hydrated-row field list, immediately before the `evidence_requirement` clause.

**GAM BINDING SURFACE PRESENT: YES**

Copy assembly (`buildWorkflowStepInstructions`): when `isGamPageEnrichmentV2CopyStep` is true, `promptBody` is **exactly** `buildGamV2CopyMaterialAuthoringBrief()` (`sourceType: "gam_v2_copy_brief"`). Later the same Copy stream also appends `buildGamV2CopilotSchemaInstructions()` (`ld-gam-page-enrich-contract.js` + shape). That enrich contract binds **`evidence_requirement`**, not ordinary `specification`. T-031 correctly keeps the ordinary-operand clarification on the **Copy brief sentence**, not a new GAM audit stack.

`tests/page-gam-enrich.test.js` already asserts `/treat specification as binding content bounds/i` on `buildWorkflowStepInstructions` for a GAM v2 Copy step.

**GAM SURFACE MODEL-VISIBLE: YES** (v2 Copy / page-enrichment-v2 workflows — the production GAM path).

Do **not** bump `lib/ld-gam-page-enrich-contract.js` `58-GAM-PARTIAL-1`. Do **not** edit `index.html` `lib/ld-gam-page-enrich-contract.js?v=20260803-gr-quality-1` or `lib/page-gam-enrich.js?v=20260813-s76-dla-p01-p02-p03`.

---

## 3. Existing operational-suitability wording

Searched live DLA contract and GAM Copy brief / enrich contract for usable/solvable/untaught/commissioned-operation language.

| Surface | Result |
| ------- | ------ |
| DLA Step 3 | “constraints/exclusions” — unspecified; **not** operational suitability |
| DLA Step 1 | Mapped-LO production (T-033) — **different** invariant |
| GAM Copy brief | Specification as **content bounds** — structural/content, not executability |
| GAM enrich contract | Evidence_requirement binding + evidence-centred fulfilment — **not** ordinary operands |
| T-022 design | “solvable by the taught method” — **design only**, never model-visible |

**Existing suitability wording: A** — still entirely absent from production prompts.

Not redundant. Do not duplicate T-033 into Step 3.

---

## 4. Exact proposed DLA Step 3

Replace the live Step 3 string with:

> 3) Commission every required material. required_materials must be an array. For every row: non-empty purpose (the job of this material) and non-empty specification (binding GAM bounds: content, load-bearing count/variation/constraints/exclusions; not body prose). Include any pedagogically chosen method, condition, assumption, boundary, or exclusion the commissioned operation depends on. If omitting it would permit an operand that requires a different operation or untaught reasoning, the specification is insufficient. State bounds for this commissioned operation only. specification must not be only the material_type token.

Insert only (310 unique characters), after “not body prose).”:

>  Include any pedagogically chosen method, condition, assumption, boundary, or exclusion the commissioned operation depends on. If omitting it would permit an operand that requires a different operation or untaught reasoning, the specification is insufficient. State bounds for this commissioned operation only.

No new numbered step. No subject examples. No theorem list. No LO-coverage wording.

**Ceiling:** ≤ **350** unique (historical 120–250; live insert 310 because the omission-test and anti-over-specification clause are both required). Do not grow with examples.

---

## 5. Exact proposed GAM wording

Replace the binding sentence with:

> Honour required_materials[].purpose and treat specification as binding content bounds. Realised particulars must support the commissioned learner operation within those bounds; do not substitute a different method or extra unstated reasoning; do not invent pedagogical constraints the commission omits.

**Delta:** **+216** unique characters (current sentence 86 → 302). **Ceiling:** ≤ **250** unique. Within ceiling.

Do not add a GAM checklist. Do not mention `task_material_decision`. Do not tell GAM to redesign `learner_task`. Leave the following `evidence_requirement` sentence unchanged.

---

## 6. Inherent vs pedagogical

Still valid on current contracts.

| Class | Owner | Live home |
| ----- | ----- | --------- |
| Pedagogical method/scope choice | DLA | Step 3 `specification` |
| Inherent executability under named operation/bounds | GAM | Copy brief binding sentence |

**CASE A:** DLA “construct X from supplied inputs”; no extra method restriction needed; GAM supplies well-formed inputs. **PASS.**

**CASE B:** DLA “solve using method X” and excludes Y; GAM emits an item requiring Y. **FAIL GAM.**

**CASE C:** DLA only says “solve” where X vs Y is a pedagogical choice; GAM chooses Y. **DLA specification insufficient first.** GAM must not invent “use X.” Residual bad stems after a sufficient spec remain generative variance / QA — not a validator.

---

## 7. Anti-over-specification

Live clause: **“State bounds for this commissioned operation only.”**

Construction of an object must not inherit a later activity’s solvability/method exclusions. Suitability is relative to **this** row’s commissioned operation. Prompt tests must `doesNotMatch` subject examples and must not require global “nice interior maxima” language.

Gate C control: an earlier construction activity’s specification must **not** copy a later practice activity’s method bound.

---

## 8. T-033 boundary

T-033 **CLOSED** (T-045). Chain:

mapped LO → correct learner production (T-033, Step 1) → required operand (P01 / P01-R1, Step 2) → purpose/specification (P03 / T-031 DLA, Step 3) → operationally suitable particulars (T-031 GAM).

Do **not** add LO-operation coverage to Step 3. A later bad GAM stem does **not** reopen T-033.

---

## 9. P01-R1 boundary

P01-R1 **CLOSED**. Step 2 already names the object/state acted on vs workspace/model/scaffold. T-031 assumes that identification. **Do not modify Step 2.**

---

## 10. P02 boundary

Operational suitability applies whether `evidence_decision.required` is true or false. Ordinary practice can be P01 true / P02 false / T-031 applicable. Do **not** redefine evidence semantics. **Do not modify Steps 4/5.**

---

## 11. GAM D relation

GAM D: commissioned **worked example** structurally present but not pedagogically a worked example.

T-031: generated **operand** usable for the commissioned **learner** operation.

**GAM D RELATION: SEPARATE**

Do not broaden T-031 to force worked-example modelling quality. Overlap only if a row is both operand and worked example — still do not absorb D.

---

## 12. GAM E relation

GAM E: learner-facing **corruption/mangling** of generated derivation content (mechanism unknown).

If mangling makes the operand unusable, the T-031 **obligation** is violated, but T-031 does not repair the generation-corruption **mechanism**.

**GAM E RELATION: PARTIAL OVERLAP** (semantic consequence only). Do not investigate further. Do not add anti-mangling wording.

---

## 13. Schema / validator

**SCHEMA CHANGE: NO**  
**DETERMINISTIC VALIDATOR CHANGE: NO**

No solvers, regex `learner_task` inference, Bloom maps, or LLM-as-validator. Existing P03 non-empty / not-type-echo validators stay.

---

## 14. Prompt cost — DLA

Measured 2026-08-14 from repository:

| Series | Live |
| ------ | ---: |
| `buildDlaPageEnrichContractBlock().length` | 11,864 |
| `buildCanonicalDlaPageShapeSnippet().length` | 6,698 |
| **Unique (A)** | **18,562** |
| Assembled ×2 (B) | 37,124 |

Matches T-044. Proposed unique Δ **+310**. Unique after **18,872**. Assembled ×2 Δ **+620**. After unique **18,872** / assembled **37,744**.

Current prompt-test unique band is `18000–18800` (`tests/ld-dla-evidence-decision-consistency-prompt.test.js`). Implementation **must raise the upper bound** (recommend `18000–19250`) so 18,872 is legal. Dual Copy injection unchanged (P05).

---

## 15. Prompt cost — GAM

| Item | Size |
| ---- | ---: |
| Binding sentence (edit surface) | 86 |
| Proposed sentence | 302 |
| **Unique Δ** | **+216** |
| Ceiling | ≤ 250 |

Full `buildGamV2CopyMaterialAuthoringBrief()` grows by the same +216 (one sentence extension). Do not rationalise the rest of the brief.

---

## 16. Version / pins

| Item | Current | Proposed at implementation |
| ---- | ------- | -------------------------- |
| DLA `CONTRACT_VERSION` | `76-DLA-PARTIAL-8` | **`76-DLA-PARTIAL-9`** |
| DLA contract cache | `lib/ld-dla-page-enrich-contract.js?v=20260814-s76-dla-t033-lo-coverage` | **`?v=20260814-s76-dla-t031-opsuit`** (or dated equivalent) |
| DLA validator pin | `lib/page-dla-enrich.js?v=20260813-s76-dla-p01-p02-p03` | **unchanged** |
| GAM Copy brief | `app.js` | Edit `buildGamV2CopyMaterialAuthoringBrief` |
| `app.js` cache | `app.js?v=20260812-s75-library-actions` | **Bump** (brief lives in `app.js`; e.g. `?v=20260814-s76-dla-t031-opsuit`) |
| GAM enrich `CONTRACT_VERSION` | `58-GAM-PARTIAL-1` | **unchanged** (file not edited) |
| GAM enrich / page-gam pins | existing | **unchanged** |

No invented GAM contract version. `schema_version` remains `2.0.0`.

---

## 17. DLA tests

File: `tests/ld-dla-evidence-decision-consistency-prompt.test.js`

Add a focused test (semantic substrings, not a snapshot):

- pedagogically chosen method/condition/assumption/boundary/exclusion belongs in specification;
- omission test: different operation or untaught reasoning → specification insufficient;
- bounds for **this commissioned operation only**;
- Step 1 T-033 sentences still present;
- Step 2 P01-R1 operand/workspace/absence/P01–P02 independence still present;
- Step 3 opening + type-token rule still present;
- Steps 4/5 still present;
- `CONTRACT_VERSION === "76-DLA-PARTIAL-9"`;
- unique size band updated (`> 18000` and `< 19250`);
- `doesNotMatch`: Lagrangian, KKT, Bloom, PRE-EMIT, per-activity evidence audit, new schema field names.

Also update version pin in `tests/ld-instructional-archetype-production-planning.test.js`.

---

## 18. GAM tests

File: `tests/page-gam-enrich.test.js` — extend existing “GAM v2 copy brief enforces canonical hydrated material rows”:

- keep `/treat specification as binding content bounds/i`;
- add: realised particulars must support the commissioned learner operation;
- add: do not substitute a different method or extra unstated reasoning;
- add: do not invent pedagogical constraints the commission omits;
- keep `doesNotMatch(/task_material_decision/)`;
- do **not** add solver tests.

`tests/ld-instructional-archetype-gam-copy-delivery.test.js` exercises enrich-contract injection; no change unless it snapshots the Copy brief sentence.

Do not create a new test file unless that existing test cannot see `buildWorkflowStepInstructions`.

---

## 19. Gate B suites

DLA (same family as T-044):

- `tests/ld-dla-evidence-decision-consistency-prompt.test.js`
- `tests/ld-instructional-archetype-production-planning.test.js`
- `tests/page-dla-enrich.test.js` (dual injection still exactly 2)
- P01/P02/P03 / procedural P02 / S75 DLA false-positive as in T-044 Gate B
- `tests/sprint-72-evidence-centred-activity-slice.test.js` if DLA prompt tokens are asserted

GAM:

- `tests/page-gam-enrich.test.js`
- `tests/ld-instructional-archetype-gam-copy-delivery.test.js` if cheap/normal

No schema/validator/EP/DLA-WB diffs. P05 untouched.

---

## 20. Gate A

Prompt/contract shape only:

- DLA Step 3 contains the three operational-scope sentences; Steps 1/2/4/5 intact; no subject branches; unique Δ ≤ 350; version `76-DLA-PARTIAL-9`.
- GAM binding clarification present; no lesson-redesign / audit stack; Δ ≤ 250.
- Targeted prompt tests green.

---

## 21. Gate B

Regression/integration as §19. Confirm: no schema diff; no validator diff; no EP/DLA-WB diff; P01-R1 intact; T-033 intact; P02 intact; P05 still dual-injects DLA contract+shape.

---

## 22. Gate C (operator; do not run now)

Lagrangian workflow after **DLA + GAM** (not DLA-only). Two independent questions; **no** full QA score required to close T-031.

**DLA:** Does the practice-operand `specification` state any load-bearing pedagogical method/scope the learner operation actually needs?

**GAM:** Do realised particulars actually admit that named method/scope, without a silent untaught alternative?

**Control:** An earlier/simple construction activity must **not** acquire unnecessary downstream method restrictions.

Roman Roads optional as non-over-decomposition / non-regression, not a T-031 close requirement.

---

## 23. Implementation files

**CHANGE:**

- `lib/ld-dla-page-enrich-contract.js` — Step 3 + `CONTRACT_VERSION`
- `index.html` — DLA contract pin + `app.js` pin
- `app.js` — `buildGamV2CopyMaterialAuthoringBrief` binding sentence only
- `tests/ld-dla-evidence-decision-consistency-prompt.test.js`
- `tests/ld-instructional-archetype-production-planning.test.js`
- `tests/page-gam-enrich.test.js`
- Sprint 76 implementation record / pointers

**DO NOT CHANGE:**

- `lib/page-dla-enrich.js` / validators / schemas
- `lib/ld-gam-page-enrich-contract.js` / `lib/page-gam-enrich.js` (unless a test forces a pin comment only — prefer not)
- EP / DLA-WB
- Steps 1, 2, 4, 5
- P05 injection (`buildDlaV2CopilotSchemaInstructions` / `applyEpisodePlanDlaPopulationPromptBlockToDraft` call sites)
- GAM D/E-specific evidence/worked-example blocks

---

## 24. Sequence

1. Re-measure live DLA unique and GAM brief sizes.  
2. Edit DLA Step 3 only; set `76-DLA-PARTIAL-9`.  
3. Edit the one GAM binding sentence.  
4. Bump DLA contract pin and `app.js` pin.  
5. Update focused prompt tests + unique band.  
6. Gate A.  
7. Gate B suites.  
8. Record exact deltas.  
9. Write implementation record (expected T-047).  
10. **STOP** before generation.

Paired change only. Do not split DLA and GAM across sessions.

---

## 25. Stop conditions (implementation)

STOP / BLOCKED if: Step 3 no longer clean; GAM binding sentence gone; schema/validator/subject-specific logic required; must redesign `learner_task`; would absorb GAM D/E; live prompts already implement the invariant (they do not).

---

## 26. Next recommended action

Operator review of this plan. If accepted: authorise **T-031 Option 3 implementation** (expected T-047) through Gate A+B only. Do not generate. Do not start P05 or GAM D/E.

---

**IMPLEMENTATION PLAN ONLY. NO IMPLEMENTATION AUTHORISED.**
