# S76-T-010 — DLA Audit Report

**Task:** S76-T-010  
**Status:** **Diagnostic investigation complete** (2026-08-13)  
**Mode:** DIAGNOSTIC ONLY — no production code, prompt, schema, validator, test, EP, DLA, GAM, workflow, or Settings changes in this task  
**Sprint:** 76 — DLA Rationalisation and Content-Quality Consistency  
**Opening evidence:** [CONTEXT.md](CONTEXT.md)  
**This artefact is the diagnostic source of truth** for subsequent Sprint 76 solution design.

This report converts the completed T-010 investigation into an architecture baseline, historical growth account, ranked findings, non-findings, and a bounded problem register. It **does not** recommend implementation.

---

## 1. Executive summary

The EP → DLA → GAM responsibility model is **fundamentally coherent**.

- **EP** defines pedagogical choreography (archetype + beats).  
- **DLA** turns that choreography into executable learner tasks, expected outputs, material commissions, and epistemic evidence decisions.  
- **GAM** fulfils explicit DLA `required_materials[]` as learner-facing bodies.  
- **Deterministic logic** protects structured contracts and referential integrity **where implemented**.

The audit did **not** establish that DLA size, Copy dual-injection, or evidence-machinery existence caused a quality regression from the Sprint 71 known-good historical baseline. That **RECOVER** hypothesis remains open pending control/challenge re-benchmarks. T-010 **did** establish current, bounded architectural problems that can drive Phase 2 design without waiting for those scores.

Three P1/P2 problems dominate:

1. **Task→material closure is missing.** DLA can emit a valid learner task that refers to inputs it never commissioned. Lagrangian A3/A4 are the production exhibits. This is independent of evidence classification. GAM is not licensed to repair missing commissions.  
2. **Epistemic evidence dependence is a generative decision that deterministic code partly re-infers from prose.** Prompt guidance can push data/cases/examples toward `evidence_decision.required: true`. Validator heuristics (`taskLooksEvidenceDependent`, `looksLikeProceduralTaskMaterialPractice`) can disagree. Lagrangian A2 is the artefact exhibit.  
3. **Ordinary material commissioning is weakly contracted.** Partial DLA need not emit `required_materials`; purpose/specification on ordinary rows are not required. Weak commissions force GAM inference without making GAM the owner of the defect.

DLA Copy grew from Sprint 71 **~41.3k** to current **~76.1k**. Almost all of that is **instructional overhead**. Combined contract+shape grew **~5.2k → ~22.6k** and is injected **twice**. Dual injection already existed in Sprint 71; later unique growth is mechanically amplified. That is a maintainability/assembly finding, not proof that duplication caused quality failure.

GAM production Copy is **~19–21k**, bounded, and not a DLA-scale problem. No systematic independent GAM failure was demonstrated given a strong commission.

**T-010 DIAGNOSTIC INVESTIGATION COMPLETE.**

---

## 2. Architecture baseline

```text
EP  →  DLA  →  GAM  →  deterministic protections (where implemented)
```

The intended split, supported by current contracts:

**Generative stages make pedagogical/semantic decisions. Deterministic logic protects structured consequences of those decisions.**

### 2.1 EP — Design Episode Plan

| Aspect | Baseline |
| ------ | -------- |
| **Generative / derived** | Production v2 derives `{ archetype, beats[] }` from learning outcomes. EP does **not** design `learner_task`, materials, or `evidence_decision`. |
| **Structured output** | V1: frozen archetype (`understand` \| `apply` \| `analyse` \| `evaluate`) + ordered beats with approved `function` values. |
| **Downstream dependency** | DLA must elaborate beats into executable activities without replanning the archetype/sequence. |
| **Deterministic protections** | `validateEpisodePlanV1`; `validateSequenceAgainstGrammar` (`requiredBeats` / `requiredGroups`). |

### 2.2 DLA — Design Learning Activities

| Aspect | Baseline |
| ------ | -------- |
| **Generative** | `learner_task`, `expected_output`, activity titles, cognition/scaffold copy, whether/what materials are required, `purpose`/`specification`, `evidence_decision`, provenance, checklist *diagnostic specification* (not criterion prose). |
| **Structured output** | Partial v2 page: `activities[]` with DLA-owned fields; `required_materials[]` as the GAM commission; optional `evidence_requirement` on provider rows; **no** `materials[].body`. |
| **Downstream dependency** | GAM must realise every commissioned `material_id` and must not mutate `required_materials`. |
| **Deterministic protections** | Envelope; `materials[].body` forbidden; `evidence_decision` **shape** and **provider closure** when the boolean is set; `episode_plan` preserved on full validate; titles; `intellectual_coherence_bridge` distinct from preamble on full page. Partial capture does **not** require `required_materials`. |

Deterministic enrich (`buildRequiredMaterialsFromPlan` / `FUNCTION_TO_MATERIAL_TYPE`) maps beats to material *types* on a non-Copy path. Production Copy DLA is generative and is **not** that mapper.

### 2.3 GAM — Generate Activity Materials

| Aspect | Baseline |
| ------ | -------- |
| **Generative** | Learner-facing `materials[].body`; honour purpose/specification/`evidence_requirement`; simulation/source-bound honesty; guided-review criterion prose. |
| **Structured output** | Partial: `activity_id` + `materials[]` (`material_id`, `material_type`, `title`, `body_format`, `body`). |
| **Downstream dependency** | Page assembly / renderer consume bodies. Missing DLA rows cannot be invented without violating 1:1. |
| **Deterministic protections** | Non-empty body and format; guided-review **JSON shape**; full validate 1:1 ids/count and no `required_materials` mutation **when a DLA baseline exists**. Evidence inspectability/depth are warn-only or prompt-only. |

Production Copy is contract + short authoring brief (~19–21k). Pack GAM-PRES / full LD-GAM-INSTRUCTIONAL-DEPTH are **not** on Copy.

### 2.4 Deterministic application logic

Protects, where implemented: artefact envelope; EP grammar; DLA/GAM stage ownership; evidence **provider** referential integrity; GAM 1:1 material-id closure; non-empty bodies.

Does **not** currently protect: general task→material closure; ordinary purpose/specification presence; epistemic dependence as a structured decision immune to prose re-inference; GAM pedagogical adequacy.

---

## 3. Historical DLA growth

Measurements are **partial-v2 Copy** (`buildWorkflowStepInstructions`), comparable method, representative RNA-HCV-style brief, no embedded EP JSON in partial mode. Figures are character counts of the assembled Copy string, not tokens.

CONTEXT’s opening observation was “approximately 72,000 characters.” T-010 reproduction on current HEAD measured **76,142**. The difference is method/input precision, not a second growth event. Use **~76.1k** as the current T-010 baseline and **~72k** as the pre-audit observation.

### 3.1 Quantitative reconciliation

| Baseline | Assembled Copy | Unique instructional (approx.) | Combined contract+shape | Notes |
| -------- | -------------: | -----------------------------: | ----------------------: | ----- |
| Sprint 56 documented core (2026-07-01) | ~31,932 core | — | Sprint 58 contract not yet present | Pack/docs; not the same Copy assembly as later v2 |
| Sprint 71 close (`6437ba1`, 2026-07-31) | **~41,289** | **~34,084** | **~5,217** (block ~1,099 + shape ~4.1k) | Dual injection **already present**; duplicated payload ~5.2k |
| Current T-010 (2026-08-13) | **~76,142** | **~51,204** | **~22,578** (block ~16,222 + shape ~6,355) | Runtime EP JSON **0** in partial mode |

**SOURCE / UNIQUE INSTRUCTIONAL GROWTH** (Sprint 71 → current): unique core **~34.1k → ~51.2k** (about **+17k**). Combined contract+shape **+17,361**.

**ASSEMBLY AMPLIFICATION:** Copy injects contract+shape in the preamble **and** again via core/runtime augmentations. Dedup does not collapse the pair. Unique +17,361 in the duplicated block therefore appears **twice** (~**+34.7k** assembled from that block’s expansion). Predicted assembled **~76,373** vs measured **76,142** (remainder ~−230; measurement noise / adjacent copy text).

Rough split of 41.3k → 76.1k: **about half unique source growth, about half Copy amplification of that source.** Runtime payload is not the driver.

Dual injection itself is **not a new Sprint 72–76 regression mechanism**. It existed at `3f0b38b` (2026-07-07, preamble) and `3506d1c` (2026-07-09, core). What changed is the **size of the duplicated object**.

`CONTRACT_VERSION` remains `"58-DLA-PARTIAL-3"` (`lib/ld-dla-page-enrich-contract.js`) while evidence machinery continued to accumulate after the titles bump.

### 3.2 Major post–Sprint 71 additions (unique Δ into combined contract+shape)

| Commit | Date | What | Combined after | Unique Δ | Copy ~×2 |
| ------ | ---- | ---- | -------------: | -------: | -------: |
| `db7f439` | 2026-08-03 | `58-DLA-PARTIAL-3`; titles in block and shape | ~7,449 | +2,232 | ~+4.5k |
| `b97d5b5` | 2026-08-03 | Checklist diagnostic spec (GAM owns criterion prose) | ~8,080 | +631 | ~+1.3k |
| `3cb1a4f` | 2026-08-04 | `evidence_decision` / `evidence_requirement`; simulation; delayed disclosure | ~12,351 | +4,271 | ~+8.5k |
| `adf90ac` | 2026-08-04 | PRE-DESIGN; source-use; `conversation_attachment`; PRE-EMIT audit | ~20,264 | +7,913 | ~+15.8k |
| `de62802` | 2026-08-05 | `intellectual_coherence_bridge` required | ~20,715 | +451 | ~+0.9k |
| `126dae2` | 2026-08-07 | PER-ACTIVITY consistency audit + INVALID/VALID | **~22,578** | +1,863 | ~+3.7k |

Motivation where documented: Sprint 72 evidence-centred productisation; titles ownership; guided-review split; `126dae2` from post–Sprint 74b manual acceptance of evidence-decision inconsistency (`docs/development/sprints/2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/S74B-POST-manual-acceptance-dla-evidence-decision-prompt.md`; `tests/ld-dla-evidence-decision-consistency-prompt.test.js`).

Pattern: **incremental defensive additions**, not periodic rationalisation. The same evidence-consistency responsibility is now in planning order, PRE-EMIT, per-activity audit, INVALID/VALID example, pack notes, Copy `what_to_check`, and fail-closed validation.

`2156c86` (2026-08-13) added `looksLikeProceduralTaskMaterialPractice` (validator carve-out). That is **not** a Copy-size event; it is a semantic-heuristic event (Finding P1-B).

S75/S76 prompt commits checked in the investigation (`e2b74f1`, `6fa966b`) did not change the measured contract size.

---

## 4. Evidence / material conceptual model

Three concerns are **conceptually distinct**. Current schema *can* represent the distinction. Prompt and validator behaviour do not always preserve it.

| Concern | Question | Typical fields |
| ------- | -------- | -------------- |
| **Material requirement** | Does the learner need an artefact to perform the task? | `required_materials[]` row (type, id, purpose, specification) |
| **Epistemic evidence dependence** | Must the learner inspect particulars in order to infer, judge, compare, interpret, or substantiate? | `evidence_decision.required` + `provider_material_ids` + `evidence_requirement` on provider rows |
| **Provenance / authenticity** | Where did that material come from, and what honesty claim applies? | `evidence_requirement.provenance`: `system_generated_simulation` \| `conversation_attachment` |

Ordinary non-evidence material is representable:

- material required = **yes**  
- epistemic evidence = **no** (`evidence_decision.required: false`, no `evidence_requirement`)  
- provenance = not a field on ordinary rows; generated practice/teaching is not automatically “evidence”

`provenance` exists on `evidence_requirement`, not on ordinary `required_materials` rows.

**Blur:** DLA prompt language treats data/cases/images/supplied examples used as evidence as dependence triggers. Validator lexical helpers can classify construct/apply/solve practice (including “provided examples/problems”) as **not** evidence-dependent. Those are different responsibilities: **deciding** dependence vs **closing** a structured `required: true` to a provider.

Task→material closure is a **fourth** concern, independent of the three above: if the task needs an input, was a material row commissioned for it?

---

## 5. Ranked findings

### P1 — material architectural / functional problems

#### P1-A — Task→material closure is not guaranteed

**Problem.** There is no general invariant that when DLA writes a learner task requiring an input, DLA also commissions that input in `required_materials[]`.

**Evidence.** Partial `validateDlaPartialPageCapture` does not require `required_materials`. Full `validateDlaEnrichedPage` requires a non-empty array **only when beats exist**, with no check that task language has a corresponding row, quantity, or specification. OBLIGATION POPULATION / DLA-WB / `depth_floor` are prompt-only (`tests/workbook-contract-prompt-surface.test.js`). Lagrangian: A2 “each practice problem” without a practice-problem row; A3 new optimisation problem without a problem row; A4 lambda-value exercises with no values/cases commissioned (benchmark **Major**). Those DLA shapes pass current validators.

**Consequence.** Learners can be asked to use materials that were never commissioned. GAM 1:1 preservation **prevents** inventing missing rows. Apparent GAM “compensation” (A2 extra problems inside an existing body) is accidental inference, not closure.

**Owner / boundary.** DLA generative commissioning. Not EP (beats do not name concrete inputs). Not GAM.

**Confidence.** High.

**Does not establish.** That a particular validator or schema field should be added; that GAM failed A4; that evidence classification caused A4.

#### P1-B — Evidence dependence is partly re-inferred from wording

**Problem.** Whether a task is epistemically evidence-dependent is generative, but fail-closed validation approximates it from joined task/output/spec prose.

**Evidence.** Prompt: planning order and “data, cases, observations, supplied examples used as evidence … must set `required` true” (`lib/ld-dla-page-enrich-contract.js`). Validator: `taskLooksEvidenceDependent`; carve-out `looksLikeProceduralTaskMaterialPractice` (`lib/page-dla-enrich.js`; `2156c86`; `tests/s76-dla-procedural-task-evidence-validation.test.js`). If `required: false` but the heuristic fires, capture fails. If the heuristic is silent, missing `evidence_decision` is allowed even though the contract says every activity must emit it. Lagrangian A2: generated `required: false` (construct from provided optimisation statements); current validator agrees; literal prompt guidance can point the other way. True deterministic closure (`required: true` ⇒ providers exist and carry `evidence_requirement`) is implemented **and** is a different property.

**Consequence.** Procedural/practice activities can be over- or under-classified. Prompt and validator can demand incompatible repairs. Heuristics will keep accumulating carve-outs (already true for Lagrangian).

**Owner / boundary.** DLA generative decision vs DLA deterministic **closure**. Misplaced: deterministic code re-deciding pedagogy.

**Confidence.** High.

**Does not establish.** That procedural material “is” or “is not” epistemic evidence in the abstract; that evidence machinery should be rolled back; that the provider-closure checks are wrong.

---

### P2 — significant structural / maintainability risks

#### P2-C — DLA evidence responsibility has accumulated redundant self-audit layers

**Problem.** One consistency story (task/output ↔ `evidence_decision.required` ↔ providers) is restated as planning-order check, PRE-EMIT audit, per-activity audit, INVALID/VALID example, pack notes, and then fail-closed validation.

**Evidence.** `lib/ld-dla-page-enrich-contract.js` sections PRE-DESIGN, Evidence-decision planning order, FINAL PRE-EMIT AUDIT, FINAL PER-ACTIVITY EVIDENCE-DECISION CONSISTENCY AUDIT; `126dae2`; `validateEvidenceDecisionClosure`. Unique growth of the last audit layer ~+1.9k (Copy ~×2).

**Consequence.** Prompt size and competing restatements without a new closure property. Makes later rationalisation harder. Mixes generative “is this evidential?” with deterministic “if required, list a provider.”

**Owner / boundary.** DLA prompt accretion. Closure itself is correctly a validator concern.

**Confidence.** High.

**Does not establish.** That all evidence guidance is unnecessary, or that self-audit is always wrong when it adds a genuinely generative check (source-use still has no fail-closed equivalent).

#### P2-D — DLA prompt growth is mechanically amplified by dual contract injection

**Problem.** The expanding contract+shape block is injected twice on Copy. Unique instructional growth is therefore amplified in model input.

**Evidence.** Sprint 71 combined ~5.2k already duplicated; current ~22.6k duplicated. Copy ~41.3k → ~76.1k with ~50% unique / ~50% amplification (section 3).

**Consequence.** Model input is larger than unique instruction. Cost/attention load rises faster than new responsibilities. This is **not** the demonstrated cause of Lagrangian A4.

**Owner / boundary.** DLA Copy assembly (`buildWorkflowStepInstructions` / `applyEpisodePlanDlaPopulationPromptBlockToDraft` pattern). Distinct from semantic content of the contract.

**Confidence.** High for the mechanism; the quality impact of the extra copy is **unresolved**.

**Does not establish.** That dual injection caused quality regression; that Sprint 71 should be restored; that unique evidence responsibilities are illegitimate.

#### P2-E — Material commissioning sufficiency is weakly contracted

**Problem.** Even when a row exists, DLA is not required to specify it sufficiently (`purpose` / `specification`). Partial DLA may omit `required_materials` entirely. Quantity and variation live in free text.

**Evidence.** `validateEvidenceRequirementShape` requires `purpose` **if** `evidence_requirement` is present. Ordinary rows have no purpose/spec presence check. Roman Roads renderer fixtures show type-only commissions (not live generation). Weak commissions increase GAM inference; GAM validators still only require a non-empty body.

**Consequence.** “Valid DLA” can still be an under-specified commission. Distinct from missing rows (P1-A), but both produce learner-task failure modes.

**Owner / boundary.** DLA commission quality. GAM fulfilment floor cannot substitute for a missing or empty specification.

**Confidence.** High for the contract gap; medium for how often live Copy emits empty specs (no current-run DLA JSON in git).

**Does not establish.** A particular required-field design.

---

### P3 — secondary concern / future risk

#### P3-F — GAM fulfilment floor is thin; GAM is not an independent architectural problem

**Problem.** GAM fail-closed checks are envelope, non-empty body, optional merge 1:1, and guided-review JSON shape. Depth/spec fidelity are generative. Copy omits the historical GAM-PRES / full depth module.

**Evidence.** GAM Copy ~19,087 (no DLA capture) / ~20,886 (archetype routing). `pushMaterialBodyAndFormatErrors`; Sprint 59 generation-constraint audit (non-empty body only); Sprint 53 WH-53-02 historical thinning. CONTEXT: GAM can generate maths when commissioned; A4 is missing commission.

**Consequence.** Weak DLA specs yield weak or inferred bodies without proving GAM redesign is needed.

**Owner / boundary.** GAM fulfilment, correctly bounded. Not a Sprint 76 primary owner.

**Confidence.** High for the floor; high that independent systematic GAM failure was **not** demonstrated.

**Does not establish.** That GAM is broken; that Copy should receive the pack GAM-PRES corpus; that thin-body warnings should become fail-closed.

---

## 6. Non-findings

The audit **did not** establish:

1. **DLA size alone caused quality regression** from the Sprint 71 historical baseline (~85.3–91 vs current Lagrangian release ~79). Size growth is demonstrated; causal quality regression is not.  
2. **Copy×2 dual injection alone caused quality regression.** The mechanism is older than the post–Sprint 71 unique growth.  
3. **Evidence machinery should be rolled back.** Legitimate new responsibilities (decisions, providers, provenance, inspectability) were added for product reasons. Rollback remains an **option**, not a finding.  
4. **Sprint 71 prompt should simply be restored.** That would discard titled activities, evidence contracts, and guided-review split without solving task→material closure.  
5. **GAM is systematically broken** given a strong, specified commission.  
6. **EP / DLA / GAM requires wholesale redesign.** The stage split is coherent.  
7. **Procedural material should be reclassified as epistemic evidence** (or the reverse as a universal rule). That is generative pedagogy, not an audit conclusion.  
8. **Deterministic validators should replace generative pedagogical judgement.** The audit supports the opposite principle: protect structured consequences; do not re-decide pedagogy from prose.  
9. **EP failed to list practice problems.** EP is not specified to do so.  
10. **GAM failed Lagrangian A4.** A4 had no corresponding commission.  
11. **`required: true` provider closure is the defect.** That closure is a correct deterministic property. The defect is heuristic re-inference of the boolean, plus prompt/validator disagreement.

---

## 7. Problem register

Problems strong enough to drive subsequent Sprint 76 **design** work. Names are problems, not solutions.

| ID | Problem | Severity | Owner/boundary | Evidence strength | Depends on | Explicitly not a solution |
| -- | ------- | -------- | -------------- | ----------------- | ---------- | ------------------------- |
| **DLA-P01** | Task→material closure is not guaranteed | P1 | DLA commissioning | High (validators + Lagrangian A3/A4) | Independent of evidence class | Not “add a task-material validator” |
| **DLA-P02** | Evidence dependence is re-inferred from task wording; prompt and validator disagree on procedural/practice | P1 | DLA generative decision vs deterministic closure | High (code + tests + A2) | Independent of P01 | Not “delete evidence machinery” / “make heuristic stricter” |
| **DLA-P03** | Ordinary material commissioning (presence of rows; purpose/specification sufficiency) is weakly contracted | P2 | DLA commission contract | High for gap; medium for live frequency | Related to P01; not the same | Not “require all purpose/spec fields” as a decided design |
| **DLA-P04** | DLA evidence guidance accumulated redundant self-audit/reinforcement of one consistency story | P2 | DLA prompt accretion | High | Clarifying P02 reduces what P04 is protecting | Not “strip all evidence prose” |
| **DLA-P05** | Expanding DLA contract/shape is dual-injected on Copy, amplifying unique growth | P2 | DLA Copy assembly | High (mechanism); quality impact unresolved | Independent of P01–P03 | Not “restore Sprint 71 prompt” |

GAM thin fulfilment floor is **P3-F** in findings and is **not** a register driver for Sprint 76 GAM work.

---

## 8. Problem relationships

```text
DLA-P01  task→material closure     ── independent of evidence class
DLA-P03  weak commission fields    ── same DLA commissioning surface as P01;
                                      missing row ≠ empty specification

DLA-P02  evidence semantic blur    ── logically prior to rationalising
                                      evidence prompt text (P04)
DLA-P04  redundant self-audit      ── largely restates P02’s consistency story
                                      plus provider closure already validated

DLA-P05  Copy ×2 amplification     ── assembly; can be considered independently
                                      of semantic rationalisation

GAM outcomes                       ── affected by P01/P03; GAM is not the owner
```

- **Evidence semantic clarification (P02) logically precedes evidence-prompt rationalisation (P04).** Otherwise rationalisation will argue about the wrong invariant.  
- **Task→material closure (P01) is independent of evidence classification.** A4 is a commissioning hole whether or not the task is “evidential.”  
- **Mechanical duplicate assembly (P05) can be considered independently** of P01–P03. Do not treat P05 as the Lagrangian Major.  
- **Commissioning sufficiency (P03) affects GAM outcomes** (more inference, thin-but-legal bodies) **without making GAM the owner.**  
- **RECOVER (historical quality regression)** is **not** a register problem. It is an unproven hypothesis that Phase 3–4 re-benchmarks must still test. P01–P03 are **ADVANCE**-class defects that exist even if scores later recover.

---

## 9. Architectural principles

Supported by this audit (existing architecture, not a redesign):

1. **Generative judgement vs deterministic closure.** Stages decide pedagogy; validators protect structured consequences of those decisions.  
2. **DLA commissions; GAM fulfils.** `required_materials[]` is the commission. GAM must not add, remove, or mutate it.  
3. **Material requirement ≠ epistemic evidence dependence.** A practice problem can be required material without being learner evidence.  
4. **Provenance is a separate concern**, attached to evidence-provider rows, not a synonym for “material exists.”  
5. **Deterministic code should not casually re-decide pedagogy from prose.** Lexical “looks like evidence” is not the same as provider closure.  
6. **Prompt changes should not accumulate indefinitely without rationalisation.** Post–Sprint 71 history is APPEND NOW without a corresponding subtractive pass (relevant to [S76-D03](decisions.md#s76-d03--durable-prompt-engineering-discipline-as-sprint-76-exit-condition), without prescribing the discipline).  
7. **EP owns choreography, not concrete task inputs.** Missing practice problems are not an EP schema omission.  
8. **Absence of a structured decision cannot be closed by interpreting free-text task references** (“the following problems”, “the lambda values”) as if they were ids.

---

## 10. Unresolved questions

Only questions that matter to later design. None block **starting** solution design on DLA-P01–P05.

| Question | Why it matters | Blocks solution design? | Can wait? |
| -------- | -------------- | ----------------------- | --------- |
| Did live quality **regress** from Sprint 71 because of DLA prompt growth (RECOVER)? | Distinguishes restore-vs-advance emphasis in later scoring | **No** for P01–P05; **yes** for claiming regression | Phase 3–4 repeated Roman Roads / Lagrangian runs |
| How often live Copy DLA omits purpose/specification vs omits entire rows? | Weights P01 vs P03 | No | Implementation/test design; current-run captures |
| Does every live GAM paste have a stored DLA baseline so 1:1 actually runs? | Conditional GAM preservation | No for DLA problems | Implementation/test design |
| What is the quality effect of the second contract copy (P05) vs unique evidence prose? | Whether assembly hygiene is urgent | No | Can wait; do not treat as Lagrangian root cause |
| Are any production GAM runs still using Studio Generate (pack + depth modules) rather than Copy? | Explains GAM instruction variance | No | Implementation/test design |

Not retained: exhaustive GAM chronology; live GAM JSON for “strong commission” body quality (already classified as non-demonstrated independent failure).

---

## 11. T-010 completion verdict

**T-010 DIAGNOSTIC INVESTIGATION COMPLETE**

Evidence is sufficient to consolidate architecture, growth, ownership, and a small problem register. No further diagnostic investigation is required before Sprint 76 **solution design** may be authorised.

T-010 does **not** authorise implementation, prompt rationalisation, validator changes, evidence rollback, schema changes, generation, or Settings work.

Phase 2 remains **blocked on operator authorisation**, not on missing T-010 evidence.

---

## Appendix A — Evidence index

### A.1 Architecture / contracts

| Item | Location |
| ---- | -------- |
| DLA contract version | `lib/ld-dla-page-enrich-contract.js` `CONTRACT_VERSION` = `58-DLA-PARTIAL-3` |
| DLA contract / self-audits | same file: PRE-DESIGN; Evidence-decision planning order; PRE-EMIT; PER-ACTIVITY audit; INVALID/VALID |
| DLA partial / full validate | `lib/page-dla-enrich.js` `validateDlaPartialPageCapture`, `validateDlaEnrichedPage` |
| Evidence closure + heuristics | `validateEvidenceDecisionClosure`; `taskLooksEvidenceDependent`; `looksLikeProceduralTaskMaterialPractice` |
| Deterministic DLA enrich (non-Copy) | `buildRequiredMaterialsFromPlan`; `FUNCTION_TO_MATERIAL_TYPE` |
| EP V1 validation / grammar | `lib/episode-plan-v1-validation.js`; `lib/episode-plan-v1-archetype-grammar.js` |
| EP derive | `lib/episode-plan-dla-integration.js` `deriveEpisodePlansFromLearningOutcomes` |
| GAM contract | `lib/ld-gam-page-enrich-contract.js` |
| GAM validate / merge | `lib/page-gam-enrich.js` `validateGamPartialPageCapture`, `validateGamEnrichedPage`, `normalizeGamCaptureToPage` |
| GAM Copy brief | `app.js` `buildGamV2CopyMaterialAuthoringBrief` (~11248); V2 Copy skips pack `promptTemplate` (~32788–32791) |
| GAM 1:1 if baseline | `app.js` `applyGamPackTextValidationToCapture` (~16273–16307) |
| Pack DLA OBLIGATION POPULATION | `domains/learning-design/domain-learning-design-step-patterns.md` §5; `tests/workbook-contract-prompt-surface.test.js` |
| Renderer beat–material (not task wording) | `lib/beat-material-registry.js` `validatePageBeatMaterialClosure` |

### A.2 Measurements (T-010 reproductions)

| Measurement | Result | Method |
| ----------- | ------ | ------ |
| Current DLA Copy | ~76,142 | `__PRISM_TEST_API.buildWorkflowStepInstructions`, partial v2, RNA-HCV-style, no EP embed |
| Sprint 71 DLA Copy | ~41,289 | Same method at `6437ba1` |
| Unique DLA core now / S71 | ~51,204 / ~34,084 | Deduped instructional |
| Contract+shape now / S71 | ~22,578 / ~5,217 | `buildDlaPageEnrichContractBlock` + shape snippet |
| GAM Copy | ~19,087 / ~20,886 | Partial v2; without / with archetype routing from stored DLA |
| Pack GAM `promptTemplate` | ~16,907 | Pack factory JSON; **not** on Copy |

CONTEXT opening figure ~72k is the same order of magnitude; T-010 uses the reproduced 76.1k.

### A.3 Commits

| Hash | Date | Role |
| ---- | ---- | ---- |
| `6437ba1` | 2026-07-31 | Sprint 71 close; DLA size baseline |
| `3f0b38b` | 2026-07-07 | Dual injection: preamble contract |
| `3506d1c` | 2026-07-09 | Dual injection: core contract |
| `db7f439` | 2026-08-03 | Titles; `58-DLA-PARTIAL-3` |
| `b97d5b5` | 2026-08-03 | Checklist diagnostic spec |
| `3cb1a4f` | 2026-08-04 | Evidence-centred slice |
| `adf90ac` | 2026-08-04 | PRE-DESIGN / source-bound / PRE-EMIT |
| `de62802` | 2026-08-05 | `intellectual_coherence_bridge` |
| `126dae2` | 2026-08-07 | Per-activity evidence-decision consistency prompt |
| `2156c86` | 2026-08-13 | Procedural/practice evidence-validation carve-out |

### A.4 Tests / captures / reports

| Item | Location |
| ---- | -------- |
| Opening Lagrangian hypotheses | [CONTEXT.md](CONTEXT.md) §5–6 (A2/A3/A4; GAM not primary suspect) |
| Sprint 71 scores | [CONTEXT.md](CONTEXT.md) §2; `docs/development/sprints/2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/review-metadata-index.md` |
| Evidence-decision prompt tests | `tests/ld-dla-evidence-decision-consistency-prompt.test.js` |
| Procedural carve-out | `tests/s76-dla-procedural-task-evidence-validation.test.js` |
| GAM Copy excludes pack core | `tests/page-gam-enrich.test.js` |
| GAM thin-body warn-only (legacy pack-text) | `tests/workflow-gam-capture-validation-gate.test.js`; `docs/development/audits/GAM-VALIDATION-AUDIT.md` |
| GAM non-empty body only (v2) | `docs/development/sprints/2026-07-14-sprint-59-instructional-content-richness-audit/GENERATION-CONSTRAINT-AUDIT.md` §4.1 |
| Historical GAM thinning | Sprint 53 WH-53-02 (`SPRINT-53-CLOSURE-REPORT.md`) |
| `126dae2` motivation | `S74B-POST-manual-acceptance-dla-evidence-decision-prompt.md` |
| Roman Roads fixtures (stub bodies; not live GAM) | `tests/fixtures/page-render/roman-roads-association-page.json` |
| Live current-run DLA/GAM JSON | **Not in git** (IndexedDB run captures; [S75-D21](../2026-08-10-sprint-75-prism-user-experience-and-interface/decisions.md) settled persistence) |

### A.5 Lagrangian / Roman Roads use in this audit

| Exhibit | Use | Limit |
| ------- | --- | ----- |
| Lagrangian A2 | Missing practice-problem commission; `required: false` vs prompt pressure; GAM in-body extras not guaranteed | Operator-quoted live DLA (13 Aug) + CONTEXT; no git JSON |
| Lagrangian A3 | New problem in task, no row | CONTEXT |
| Lagrangian A4 | Lambda exercises, no values/cases; benchmark Major | CONTEXT |
| Roman Roads renderer fixtures | Weak/type-only commissions; stub bodies would pass non-empty GAM checks | Not a generation run; do not merge association vs visual-jobs pages |

---

*End of S76-T-010 DLA Audit Report. No implementation is authorised by this artefact.*
