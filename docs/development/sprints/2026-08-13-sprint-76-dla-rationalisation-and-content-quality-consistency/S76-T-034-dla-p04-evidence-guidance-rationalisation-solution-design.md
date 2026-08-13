# S76-T-034 — DLA-P04 evidence-guidance rationalisation solution design

**Task:** S76-T-034  
**Problem:** [DLA-P04](S76-T-010-dla-audit-report.md#7-problem-register) — DLA evidence guidance accumulated redundant self-audit  
**Status:** **Solution design complete** (2026-08-13) — **no implementation authorised**  
**Mode:** DESIGN ONLY — no production code, prompt, schema, validator, test, fixture, benchmark, EP, DLA, GAM, Design Page, Graphics, QA, workflow, or Settings changes  
**Depends on:** [T-010](S76-T-010-dla-audit-report.md) · [T-020](S76-T-020-dla-p02-solution-design.md) · [T-021](S76-T-021-dla-p01-solution-design.md) · [T-022](S76-T-022-dla-p03-solution-design.md) · [T-023](S76-T-023-dla-p01-p02-p03-implementation-plan.md) · [T-024](S76-T-024-dla-p01-p02-p03-gate-a-b.md) · [T-026](S76-T-026-dla-p01-residual-operand-closure-diagnostic.md) · [T-027](S76-T-027-dla-p01-residual-operand-closure-solution-design.md) · [T-028](S76-T-028-dla-p01-residual-operand-closure-implementation.md) · [T-030](S76-T-030-generated-operand-operational-suitability-diagnostic.md) · [T-031](S76-T-031-generated-operand-operational-suitability-solution-design.md) · [T-032](S76-T-032-dla-a4-constructive-alignment-diagnostic.md) · [T-033](S76-T-033-dla-lo-operation-coverage-solution-design.md)  
**Out of scope:** P04 implementation · P05 · T-031/T-033 live wording · P01/P02/P03 redesign · schema change · validator change · Sprint 72 rollback · Settings

This artefact designs the **smallest DLA evidence/planning instruction set** that preserves demonstrated good behaviour while removing accumulated redundant, defensive, and historically layered self-audit. It does not rewrite prompts. It does not authorise implementation.

**P04 SOLUTION DESIGN COMPLETE**  
**NO IMPLEMENTATION AUTHORISED**

---

## A. Executive design decision

**PROPOSED TARGET CONTRACT**

P04 is a **rationalisation** of model-visible evidence guidance. It is not a rollback of Sprint 72 evidence-product behaviour, not a P02 redesign, not a P01/P03 redesign, and not T-031 or T-033 implementation.

Keep:

1. **One commissioning order** (steps 1–5) as the only planning flow.  
2. **One compact P02 definition** in step 4 (particulars-as-grounds; independent of P01; `false` ≠ no materials).  
3. **Provider-authoring contract** when `required: true` (inspectable particulars, `learner_action`, `observable_features`, delayed disclosure, provenance, layout where meaningful).  
4. **One attachment/source-use block** (inventory available units; do not invent unattached works; `conversation_attachment` when the activity is about those units).  
5. **Shape:** one evidence-true canonical example plus **one compact P01-true / P02-false contrast line**.  
6. **Validators** close referential/shape consequences.

Delete / merge:

- FINAL PRE-EMIT evidence audit  
- FINAL PER-ACTIVITY EVIDENCE-DECISION CONSISTENCY AUDIT  
- INVALID / VALID contrast  
- noun lists that force `required: true`  
- triplicate provider-presence / wording-consistency restatements  
- pack `defaultPromptNotes` evidence extension that restates the same story  

**Recommended intervention:** Option 2 — semantic-core rationalisation.

Measured unique contract+shape today: **24,103**. Target after P04: **~15,500–17,500**. Unique deletion in that block: **~6,500–8,500**. Assembled Copy ×2 of that block: **~13,000–17,000**. Pack evidence notes (once): additional **~3,000** if thinned in the same change-set.

This is **several-thousand-character unique deletion**, not a small cleanup.

**DLA-P04 READY FOR IMPLEMENTATION PLANNING**

---

## B. Live Copy assembly (what the model actually sees)

Production partial Copy DLA (current):

| Injection | Function | What | Count |
| --------- | -------- | ---- | ----- |
| Preamble schema | `app.js` `buildDlaV2CopilotSchemaInstructions` (~10645) | `buildDlaPageEnrichContractBlock` + `buildCanonicalDlaPageShapeSnippet` | **1** |
| Draft append | `app.js` `applyEpisodePlanDlaPopulationPromptBlockToDraft` (~12007) | same contract + shape if not already present in draft | **+1 if missing** |
| Result | | Unique contract+shape **24,103** appears **twice** when both paths fire | **Copy ×2 = 48,206** |
| Core pack body | `resolveStepPromptText` → catalog `promptTemplate` | 38S / obligation-population pack | **once** |
| Pack notes | Prompt Factory `defaultPromptNotes` | Evidence-centred extension **~3,435** of **~4,122** notes | **once** |
| Runner line | `app.js` ~32688 | `what_to_check` **~524** | **once** |
| OUTPUT CONTRACT line | `LEARNER_PAGE_DLA_ACTIVITIES_SCHEMA_OUTPUT_LINE` (~8755) | field list including evidence objects | **once** (reinforce) |
| Full-page embed paragraph | `buildUpstreamPageShellEmbedSectionForDlaCopy` (~10673) | long evidence-heuristic paragraph **~3,490** | **not on production partial Copy** (`isPartialPageOutputWorkflowEnabled` → empty) |

P05 later removes the **duplicate injection** of contract+shape. P04 first reduces **unique** evidence text.

Lexical validator `looksLikeProceduralTaskMaterialPractice` (`lib/page-dla-enrich.js` ~1165) is **not model-visible**. Do not treat it as a P04 prompt surface.

Contract version remains `76-DLA-PARTIAL-5`. P04 implementation may bump the pin; this design does not.

---

## 1. Inventory of live DLA evidence / self-audit surfaces

Sizes are **measured characters** of the emitted section unless noted. “Copy ×2” means the contract/shape pair is dual-injected; pack/runner/OUTPUT CONTRACT are **once**.

| # | Surface | File / function / section | ~chars | Injection | Purpose | Same responsibility elsewhere? |
| - | ------- | ------------------------- | -----: | --------- | ------- | ------------------------------ |
| 1 | PRE-DESIGN attachment inventory | `lib/ld-dla-page-enrich-contract.js` `buildDlaPageEnrichContractBlock` “PRE-DESIGN” | **862** | ×2 | Classify attachments; inventory units; do not invent unattached works | Pack notes; (dead) embed paragraph; optional `generation_notes` in payload + shape |
| 2 | Commissioning order steps 1–5 | same, “Activity commissioning order” | **2,103** (steps 4–5 **426**) | ×2 | Production → P01 → P03 → independent P02 → providers | Envelope field list restates objects; P01-R1 lives in step 2 (out of P04 delete) |
| 3 | Resource-level source-use | same, “Resource-level source-use commitment” | **1,176** | ×2 | When attachments are learner evidence, use them with `conversation_attachment`; orientation may stay source-free | PRE-DESIGN; evidence-semantics source-preference cluster **2,597**; PRE-EMIT; pack notes |
| 4 | Envelope + payload field list | same, “Required top-level envelope/payload” | **2,837** (evidence lines are a small slice) | ×2 | Emit `evidence_decision`; optional `evidence_requirement`; optional attachment notes | OUTPUT CONTRACT line; shape |
| 5 | Checklist diagnostic spec | same | **631** | ×2 | Checklist specification vs GAM criterion prose | **Out of P04 evidence semantics** (T-020) |
| 6 | Evidence-centred requirement semantics | same, “Evidence-centred requirement semantics…” | **6,854** | ×2 | Provider fields, provenance, layout, delayed disclosure, noun lists, infer-from-task, closure | Steps 4–5; source-use; PRE-EMIT; per-activity audit; pack notes |
| 6a | Provider field definitions (`kind` / `purpose` / `learner_action` / `observable_features` + optional refinements) | inside #6 | **~307** | ×2 | Author evidence-provider rows | Shape JSON example |
| 6b | Scaffold ≠ provider; teaching-role closure; layout `combined_evidence_workspace` | inside #6 | (in 6,854) | ×2 | Sprint 72 provider-role / layout | Validators `materialLooksTeachingOnly`, combined-workspace shape |
| 6c | Source-preference / mixed provenance / conversation_attachment excerpts | inside #6 | **~2,597** | ×2 | Source-bound honesty | #1, #3, PRE-EMIT, pack |
| 6d | Infer from production; preamble/bridge must not decide boolean | inside #6 | (in infer+noun **1,961**) | ×2 | Don’t keyword-trigger from later-activity mentions | Per-activity audit; pack notes |
| 6e | Noun list “must set required true” | inside #6 | **~734** | ×2 | Lexical force-true | Pack notes; INVALID example; historically the prompt half of P02 |
| 6f | Delayed disclosure (pre-task teaching must not resolve the focal judgement) | inside #6 | **~480** | ×2 | Withhold preferred conclusion | GAM also carries; Sprint 72 |
| 6g | Deterministic closure prose (true ⇒ providers + `evidence_requirement`; false empty) | inside #6 | **~841** | ×2 | Shape reminder | Step 5; per-activity; validators |
| 7 | FINAL PRE-EMIT AUDIT | same | **664** | ×2 | Silent attachment/source-use consistency before emit | #1, #3, #6c |
| 8 | FINAL PER-ACTIVITY EVIDENCE-DECISION CONSISTENCY AUDIT | same | **1,360** | ×2 | After each activity, match boolean to task wording + provider presence | Step 4–5; #6g; INVALID/VALID; `validateEvidenceDecisionClosure` |
| 9 | Invalid / valid contrast | same | **503** | ×2 | Worked `required:false` + “analyse supplied case evidence” is forbidden | #8; noun lists; **was** matching lexical fail-close |
| 10 | Forbidden + return | same | **486** | ×2 | Partial-page emit rules | Shape forbidden list — **not P04 evidence** |
| 11 | Canonical shape example (evidence-true scenario + full `evidence_requirement`) | `buildCanonicalDlaPageShapeSnippet` | shape **6,568**; evidence JSON cluster is the activity example | ×2 | Show target shape including Sprint 72 fields | Contract prose |
| 12 | Title guidance | `activityTitleGuidanceBlock` in **both** contract and shape | duplicated inside unique already | ×2 | Titles — **not P04** | P05-adjacent inner duplication |
| 13 | Archetype planning | `buildInstructionalArchetypePlanningGuidance` | **3,282** (in shape) | ×2 | Priority-1 archetypes — **not P04** | |
| 14 | OUTPUT CONTRACT field list | `app.js` `LEARNER_PAGE_DLA_ACTIVITIES_SCHEMA_OUTPUT_LINE` | field list (evidence objects named, not defined) | once | Schema reminder | Envelope |
| 15 | Pack `defaultPromptNotes` evidence extension | `domains/learning-design/domain-learning-design-step-patterns.md` | **~3,435** of notes **~4,122** | **once** | Restates PRE-DESIGN, infer, noun-true, providers, provenance, delayed disclosure | #1–#9 |
| 16 | Pack `what_to_check` | same `runnerInstructions` | **~524** | **once** (Copy “Runner guidance”) | Operator+model check line: interpret-language ⇒ true + conversation_attachment | Noun lists; #8 |
| 17 | Full-page embed heuristic | `app.js` ~10673 | **~3,490** | **not live** on partial Copy | Same stacked evidence story | Dead path for production partial |
| 18 | Validator procedural carve-out | `lib/page-dla-enrich.js` `looksLikeProceduralTaskMaterialPractice` | n/a (code) | not prompt | Historical P02 false-positive mitigation | **Not a P04 prompt surface** |

**Evidence-related unique in the contract block (sum of #1+#3+#6+#7+#8+#9 + steps 4–5):** **~11,845**.  
Commissioning steps 1–3, envelope, checklist, titles, archetype, forbidden: **out of P04 deletion** except where they merely restate evidence.

---

## 2. Classification of every surface

Legend: **A** essential semantic core · **B** essential authoring detail · **C** deterministic consequence · **D** useful but consolidatable · **E** historical/defensive · **F** redundant · **G** potentially harmful/distracting.

| Surface | Class | Why |
| ------- | ----- | --- |
| Commissioning order **step 1** (learner production) | **A** | Protected T-033 surface. Do not delete; do not absorb T-033 wording now. |
| Step **2** (task operands / P01-R1) | **A** | Protected P01. Out of P04 rewrite except do not scramble order. |
| Step **3** (purpose/specification) | **A** | Protected T-031 surface. |
| Step **4** (independent particulars-as-grounds) | **A** | The true P02 core. Keep; may reword to the T-020 one-liner. |
| Step **5** (providers ⊆ task inputs; false ⇒ empty) | **A** (one statement of shape) + **C** (repetition) | Model needs the target shape once. Validators already close ids/emptiness/`evidence_requirement` presence. |
| PRE-DESIGN inventory when attachments exist | **A** (keep as one block) + **D** with source-use | No fail-closed equivalent for “don’t invent unattached works” (T-010). Unique generative check. |
| Resource-level source-use | **A** when attachments exist; **D** vs PRE-DESIGN and #6c | Same story three times. Merge to one. |
| Envelope `evidence_decision` required on every activity | **A** / structural | Shape, not audit. Keep a field-list line. |
| Provider field definitions (`learner_action`, `observable_features`, `kind`, `purpose`) | **B** | Sprint 72 richness. Not decision auditing. |
| Delayed disclosure | **B** | Protects Roman Roads / diagnosis quality when `true`. |
| Provenance controlled values + simulation honesty | **B** | Needed when `true`. Not the boolean. |
| `combined_evidence_workspace` rules | **B** (short) + **C** (shape arrays) | Keep one authoring sentence; validators already check arrays/listing. |
| Teaching/scaffold ≠ provider | **B** (one sentence) + **C** | Validators `materialLooksTeachingOnly` / provider-scaffold closure. |
| Source-preference cluster inside #6 (~2,597) | **D** / **F** vs source-use | Same as #3. Do not keep both. |
| Infer-from-production / preamble must not decide boolean | **D** → merge into step 4 | Valid; duplicated in pack and per-activity. |
| Noun lists “must set required true” | **E** / **G** | Prompt half of pre-P02 lexical P02. Competes with Lagrangian A2/A3 and T-020 role test. |
| Closure prose restating true⇒providers / false⇒empty | **C** | `validateEvidenceDecisionClosure` owns this. One shape sentence in step 5 is enough. |
| PRE-EMIT audit | **D** / **F** | Restates PRE-DESIGN + source-use. No unique generative question once those are one block. |
| Per-activity consistency audit | **E** / **G** for wording-match; **C** for provider empty/non-empty | Added in `126dae2` to match **then-live** lexical fail-close (`taskLooksEvidenceDependent`). P02 **removed** that fail-close. Remaining unique reminder belongs in step 4, not a second audit. |
| INVALID / VALID contrast | **E** / **G** | Worked example of the deleted lexical rule. Biases “analyse supplied…” → must be true. |
| Canonical evidence-true JSON example | **B** | Keep **one**. Shows Sprint 72 fields. |
| Pack notes evidence extension | **D** / **F** / **G** | Third copy of the same story on Copy (once). Undermines unique rationalisation if left intact. |
| Pack `what_to_check` | **D** / **G** | Noun-ish “interpreting language… set required true”. Thin to role language or a pointer. |
| Full-page embed heuristic | **F** on partial (not injected) | Do not spend P04 budget rewriting a dead path; verify it stays empty in partial. |
| Checklist spec / titles / archetypes | **VERIFY ONLY** | Not evidence self-audit. |
| Validator procedural carve-out | **DO NOT TOUCH** | Not prompt; P02 already stopped fail-close. |

---

## 3. True P02 core (from T-020 + Gate C)

Minimum DLA still needs to **know** (T-020 §B, §K):

1. `evidence_decision.required` is a **semantic DLA decision**.  
2. Evidence means **particulars-as-grounds** for inference, interpretation-from-particulars, comparison-as-evaluation, diagnosis, or substantiation.  
3. Material requirement ≠ evidence requirement.  
4. Provenance ≠ evidence dependence.  
5. Procedural operands may be P01 true / P02 false.  
6. Evidence providers are **task inputs**.  
7. Provider rows carry `evidence_requirement`.  
8. `false` does not mean no materials.

**Model-visible prose:** items 1–5 + 8 in **one** step-4 paragraph (plus the existing independence sentence already in step 2: listing a task input does not set `required`).  
**Shape / example:** items 6–7 (ids, `evidence_requirement` object) in step 5 + canonical JSON.  
**Deterministic validation (already live, keep):** true ⇒ non-empty providers ⊆ `task_input_material_ids` with `evidence_requirement`; false ⇒ empty providers and no `evidence_requirement`.

Do **not** keep three competing lists (planning order vs “use evidence_requirement only when…” vs noun taxonomy). One role test.

Gate C (operator-reported, JSON not in git): Roman Roads P02 strong (A1/A2 false; genuine evidence activities true); Lagrangian A2/A3 `required: false` with commissioned practice. That is the behaviour to preserve, not the audit stack that was in force when it was demonstrated — the **commissioning order + P02 contract** already produced it.

---

## 4. Preserve Sprint 72 evidence-product behaviour

These instructions protect **provider quality when `required: true`**. They are not decision-audits.

| Mechanism | Keep in P04? | Form |
| --------- | ------------ | ---- |
| Real inspectable particulars | **Yes** | `observable_features` required when provider exists; processing_notes: excerpts/values not summary packs |
| `learner_action` | **Yes** | What the learner does with the particulars |
| Withholding preferred conclusions | **Yes** | Delayed-disclosure sentence |
| Provenance | **Yes** | Two controlled values; mixed evaluation = separate rows |
| Evidence layout | **Yes, short** | `separate_provider` default; `combined_evidence_workspace` only when same row holds fixed + response columns |
| Provider identification | **Yes, once** | Step 5 + shape; not PRE-EMIT + per-activity + INVALID |

Do **not** rationalise these away because P02 ownership is now clearer. Target: **thin decision semantics + sufficient provider authoring contract**.

---

## 5. Roman Roads preservation test

Live JSON not in git; reasoning uses operator Gate C (QA **87**) + T-010 / T-020 exhibits.

| Case | Demonstrated behaviour | Guidance actually needed | If deleted, damage? |
| ---- | ---------------------- | ------------------------ | ------------------- |
| **A1/A2** teaching / scaffold without epistemic evidence | `required: false`; teaching/model/workspace still commissioned | Step 4 role test + “false ≠ no materials”; teaching ≠ provider | Deleting noun-forced-true **helps**. Deleting delayed disclosure **does not** affect A1/A2. Deleting PRE-DESIGN **does not** if no attachments. |
| **A3** scenario particulars as grounds | `required: true`; inspectable scenario | Step 4 + provider fields + delayed disclosure + example | Deleting `learner_action` / `observable_features` / disclosure **would** risk pre-interpreted scenarios. Deleting PRE-EMIT **should not** if source-use is merged. |
| **A4** case particulars as grounds (boundary) | Defensible `true` when cases are grounds | Role test, not “scenario ⇒ true” | Noun lists **hurt** boundary judgement. Keep role test. |
| **A5** archaeological / source evidence set | Genuine evidence; `conversation_attachment` when attachments exist | Merged PRE-DESIGN/source-use; provenance; inspectable excerpts | Deleting source-use **would** risk summaries/simulations substituted for attached sources. Keep **one** block. |

---

## 6. Lagrangian preservation test

Both runs (pre-T-028 QA **88**; post-T-028 QA **84**; JSON not in git).

| Case | Preserve | Guidance needed | Regression to avoid |
| ---- | -------- | --------------- | ------------------- |
| **A2/A3** explicit task operands; P02 **false**; no forced evidence classification | Step 2 P01-R1 (do not touch) + step 4 role test + delete noun lists / INVALID example | “Material used for analysis/practice ⇒ evidence true” |
| **A4/A5** cases/values as grounds may be P02 **true** | Role test + provider authoring; not “evidential-looking wording ⇒ true” | Lexical “case/data/supplied” force-true |

P04 must not reintroduce the pre-P02 prompt half of `taskLooksEvidenceDependent`.

---

## 7. Protected T-031 and T-033 surfaces

| Step | Owner after P04 | Later refinement | P04 duty |
| ---- | --------------- | ---------------- | -------- |
| **1** Define learner production from mapped LO | DLA | **T-033** LO-operation coverage + perfect-completion counterfactual | Keep step 1 as the home. Do not implement T-033. Do not move coverage into an evidence audit. |
| **2** Task operand / stimulus decision | DLA / P01-R1 **live** | None | Do not reword except if a merge accidentally truncates P01-R1. |
| **3** Commission purpose / specification | DLA / P03 **live** | **T-031** load-bearing method/scope constraints | Keep step 3 as the home. Do not implement T-031. |
| **4** Independent evidence decision | DLA / P02 | P04 **is** the thinning of this step’s surrounding audits | Compact P02 here. |
| **5** Providers + `evidence_requirement` | DLA | Unchanged product fields | Authoring, not a third audit. |

**Current interruptions of this flow:** PRE-DESIGN sits **before** the commissioning order (acceptable if it remains attachment inventory only). Evidence-centred semantics, PRE-EMIT, per-activity audit, and INVALID/VALID sit **after** and **re-ask** step 4–5. Pack notes re-ask the whole stack **before** the contract. That is the scatter P04 removes.

Do not invert to “commission evidence providers, then hope the task is an LO” (T-033 §M).

---

## 8. Evidence existence vs claim sufficiency

T-032 / T-033: particulars can be correctly classified as grounds and still be **insufficient** for the mapped LO (A4: constraint check ≠ optimality judgement).

Current wording that **encourages existence-as-alignment**:

| Location | Mechanism | Class |
| -------- | --------- | ----- |
| Per-activity audit: if inspect-wording, set `required: true` and add a provider | Treats provider presence as the fix | **G** |
| PRE-EMIT: “which activities use conversation_attachment” | Existence/provenance census | **D** (useful for source-use, not LO coverage) |
| Pack `what_to_check`: interpreting language ⇒ true with providers | Same | **G** |
| No sentence says “providers exist ⇒ LO aligned” | Implicit if audits **dominate** step 1 | **G** if audits remain large |

P04 preserves **evidence ROLE** semantics and provider authoring. It must **not** add or retain wording that treats evidence presence as constructive alignment. T-033 later refines step 1. Do not implement T-033 here.

---

## 9. PRE-DESIGN / PRE-EMIT / per-activity / examples / carve-outs

For each: unique failure **not** already addressed by commissioning order, output shape, P01/P02/P03, or validators?

| Block | Unique failure it still catches? | Recommendation |
| ----- | -------------------------------- | -------------- |
| **PRE-DESIGN** | Inventing unattached works; failing to notice attached learner-evidence before design. Validators cannot see Copilot bytes (known boundary already in contract). | **MERGE INTO CORE** with source-use. One short block: inventory → classify role → only then design. Optional `generation_notes` stays in payload/shape. |
| **FINAL PRE-EMIT** | Same as merged source-use, asked again at emit. | **DELETE**. No unique check once #1+#3 are one block. |
| **Per-activity consistency audit** | (a) Provider empty/non-empty — **validator**. (b) Task wording vs boolean — **was** matching lexical fail-close (`126dae2` / S74B-POST). P02 removed that fail-close. Residual generative reminder = step 4 role test. | **DELETE** the section. **MERGE** one clause into step 4: required must follow epistemic role of the production, not inspect-ish verbs. |
| **INVALID / VALID** | Same as (b), as a worked anti-pattern. After P02 it **teaches the old lexical rule**. | **DELETE**. |
| **Noun lists / procedural exceptions in prompt** | Force-true on language/form/data/cases. Procedural carve-out is **validator-only**, not prompt. | **DELETE** noun force-true. Do **not** add a prompt procedural carve-out list (that is more accretion). |
| **“Infer from production not keywords”** | Useful anti-keyword rule. | **REDUCE TO ONE LINE** inside step 4. |

Do not retain a block because it once fixed a bug. `126dae2` fixed capture rejections under a validator P02 deleted.

---

## 10. Historical defensive language (P04-relevant only)

| Addition | Commit / artefact | Bug at the time | Prevented now by structure? | Unique semantic value left? | Remove reopen original issue? |
| -------- | ----------------- | --------------- | --------------------------- | --------------------------- | ----------------------------- |
| `evidence_decision` / `evidence_requirement`; simulation; delayed disclosure | `3cb1a4f` 2026-08-04 (Sprint 72) | Need inspectable evidence product, not theme summaries | Schema + validators + GAM fulfilment | **Yes** — product behaviour | **No** — keep fields and authoring |
| PRE-DESIGN; source-use; `conversation_attachment`; PRE-EMIT | `adf90ac` 2026-08-04 | Avoided attached sources; invented related works; simulation substituted | **Partial.** Validators can check provenance enum and mixed-row split; **cannot** see whether an attachment existed | Inventory/source-use **yes**; PRE-EMIT **no** (duplicate) | Removing **all** source-use could reopen avoidance. Removing PRE-EMIT should not. |
| Per-activity audit + INVALID/VALID | `126dae2` 2026-08-07; [S74B-POST](../../2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/S74B-POST-manual-acceptance-dla-evidence-decision-prompt.md) | DLA emitted `required: false` with evidence-looking task; **validator fail-closed** (`taskLooksEvidenceDependent`) | **Yes.** T-024 removed wording fail-close. Closure validators remain for providers | Only a generative role reminder, already in step 4 | **No** for capture rejection. Quality miss if step 4 is emptied — keep the compact definition |
| Pack notes evidence extension | Sprint 72 onward (T-010) | Same consistency story on pack | Contract + validators | **No unique** vs contract | Thinning pack should not reopen if contract retains core |
| `looksLikeProceduralTaskMaterialPractice` | `2156c86` / working-tree S76 | Procedural maths flagged as evidence | P02 fail-close removal | Validator-only | **Do not touch** in P04 |

T-010 already mapped this accretion. This section does not re-audit general DLA history.

---

## 11. Validator vs prompt responsibility

Already closed deterministically (`validateEvidenceDecisionClosure` and related):

- `evidence_decision` object present; `required` boolean; `provider_material_ids` array of strings  
- `true` ⇒ ≥1 provider; each id exists in `required_materials`; each listed in `task_input_material_ids`; each row has `evidence_requirement`  
- `false` ⇒ empty `provider_material_ids`; no `evidence_requirement` rows  
- teaching-only row must not carry `evidence_requirement` (unless distinguished inspectable evidence)  
- `combined_evidence_workspace` field-array shape  

**Minimal model-visible statement (step 5, once):**

If `required` is true, name those task-input rows as providers and attach `evidence_requirement`. If false, omit providers and `evidence_requirement`. Validators will reject broken references.

Do **not** ask the model to re-audit those bullets after every activity.

The model **must** still see the **shape** (canonical JSON). Shape ≠ self-audit.

---

## 12. Shape / example strategy

Current canonical example is **one evidence-true** diagnosis scenario with full Sprint 72 `evidence_requirement` (including `disclosure_constraint`, `evidence_layout`, `observable_features`). Useful. Slightly **evidence-heavy** (T-026: no procedural P01-true/P02-false example), which can bias A2/A3.

**Recommendation:**

- **Keep one** compact evidence-true JSON activity (current pattern). Do not add a second full activity.  
- **Add one contrast line** after it (not a second JSON), e.g. practice operands remain `task_input_material_ids` with `evidence_decision.required: false` and no `evidence_requirement`.  
- **Delete** INVALID/VALID contrast (domain-neutral anti-pattern of the old lexical rule).  
- Do not add multiple examples (prompt budget ×2).

---

## 13. Rationalised semantic flow

Target DLA reasoning (short; matches live architecture):

1. **Define learner production** from the mapped LO (`learner_task`, `expected_output`). *(T-033 later refines this step.)*  
2. **Decide separate task operands/stimuli** (P01-R1: particular content acted upon ≠ model/workspace/scaffold).  
3. **Commission every required material** with `purpose` (pedagogical job) and `specification` (GAM bounds). *(T-031 later refines this step.)*  
4. **Independently decide** whether any task input is particulars-as-grounds. Set `evidence_decision.required`. False does not mean no materials. Infer from the production’s epistemic role, not from nouns, preamble, or later-activity mentions.  
5. **If true:** identify providers (subset of task inputs) and author `evidence_requirement` (inspectable particulars, learner action, delayed disclosure, provenance, layout). **If false:** no providers / no `evidence_requirement`.  
6. **Emit** the structured decisions. Validators close referential and shape consequences.

Attachment inventory (when Copilot attachments exist) remains a **pre-step** to 1–5, not a parallel evidence theory.

One flow. Evidence logic is not restated in PRE-EMIT, per-activity audit, INVALID/VALID, noun lists, and pack notes.

---

## 14. Provider authoring core

P04 does **not** redesign the schema. It may drop repetitive prose around fields the shape already shows.

| Field | Classification | P04 prose |
| ----- | -------------- | --------- |
| `kind` | **STRUCTURAL ONLY** | Enum in shape; one token in field list. |
| `purpose` | **ESSENTIAL** | Why this evidence is needed (distinct from material `purpose` if both exist — keep short). |
| `learner_action` | **ESSENTIAL** | Sprint 72; T-033 later needs this to describe the **aligned** inspection. |
| `observable_features` | **ESSENTIAL** | Inspectable particulars; not “any cases”. |
| `provenance` | **ESSENTIAL** when `true` | Two values; mixed = separate rows. |
| `disclosure_constraint` / delayed disclosure | **ESSENTIAL** | One sentence in authoring block. |
| `minimum_suitable_form` | **OPTIONAL BUT USEFUL** | Keep in shape example; optional in prose. |
| `processing_notes` | **OPTIONAL BUT USEFUL** | Keep for attachment excerpt vs simulation table; one line in source-use block. |
| `evidence_layout` | **ESSENTIAL** (short) | Default separate; combined only when same row is both evidence and workspace. |
| `fixed_observation_fields` / `learner_response_fields` | **STRUCTURAL ONLY** | Validators + shape; one clause under layout. |

**Candidate for later rationalisation (not this P04 unless cheap):** duplicate `purpose` on both material row and `evidence_requirement`. Do not schema-change now.

---

## 15. Design options

### Option 1 — Conservative consolidation

Keep most sections; delete only obvious duplicates (e.g. one of PRE-EMIT vs per-activity).

| | |
| - | - |
| Behavioural preservation | High short-term |
| Deletion size | Small (~1–2k unique; ×2 ~2–4k) |
| Regression risk | Lowest |
| P02 clarity | Still three lists |
| Sprint 72 | Preserved |
| T-031/T-033 | Surfaces remain but still buried in audits |
| P05 | Leaves a large unique block to duplicate |

**Reject:** does not answer T-010 P2-C. Continues APPEND NOW.

### Option 2 — Semantic-core rationalisation **(recommend)**

One planning flow + one compact P02 definition + provider-authoring + one source-use block; delete PRE-EMIT, per-activity audit, INVALID/VALID, noun force-true; thin pack notes; keep one example + one contrast line.

| | |
| - | - |
| Behavioural preservation | High if Roman Roads source-use and Sprint 72 fields remain |
| Deletion size | **Several thousand unique** (~6.5–8.5k contract+shape; pack ~3k once) |
| Regression risk | Medium — mitigated by keeping role test, source-use, provider fields, and rerunning RR+Lagrangian **before P05** |
| P02 clarity | One definition |
| Sprint 72 | Explicitly retained |
| T-031/T-033 | Clean steps 1 and 3 |
| P05 | Smaller unique object to de-duplicate |

### Option 3 — Minimalist (shape + tiny semantics)

Rely on validators; strip most evidence prose.

| | |
| - | - |
| Behavioural preservation | **Poor** for source-bound Roman Roads and delayed disclosure (no fail-closed attachment inventory) |
| Deletion size | Largest |
| Regression risk | High |
| P02 clarity | Shape may not teach role vs operand |
| Sprint 72 | At risk |
| T-031/T-033 | Surfaces exist but model may not follow a flow |
| P05 | Smallest unique, wrong quality bet |

**Reject:** over-relies on validators for **semantic** choices validators must not make (T-020 invariant 7).

---

## 16. Size reduction estimate

**Measured now** (`76-DLA-PARTIAL-5`, `buildDlaPageEnrichContractBlock` + `buildCanonicalDlaPageShapeSnippet`):

| Quantity | Characters |
| -------- | ---------: |
| Unique contract block | **17,535** |
| Unique shape | **6,568** |
| Unique contract+shape | **24,103** |
| Assembled Copy ×2 of that pair | **48,206** |
| Evidence-centred semantics | **6,854** |
| PRE-DESIGN | **862** |
| Source-use | **1,176** |
| PRE-EMIT | **664** |
| Per-activity audit | **1,360** |
| INVALID/VALID | **503** |
| Pack notes evidence extension (once) | **~3,435** |
| `what_to_check` (once) | **~524** |

T-010 unique instructional whole Copy was **~51k** with an older contract (**~22,578**). Current unique contract+shape is **24,103** after P01-R1 (+893 vs T-024). Do not confuse unique with assembled.

**Option 2 target (contract+shape unique):**

| Category | Action | Unique Δ (approx.) |
| -------- | ------ | -----------------: |
| PRE-EMIT + per-activity + INVALID/VALID | **DELETE** | **−2,527** (measured) |
| Noun / infer cluster inside semantics | **DELETE / REDUCE TO ONE LINE** | **~−1,700 to −1,960** (measured cluster 1,961) |
| Source-preference inside semantics vs source-use | **MERGE** (drop inner duplicate) | **~−1,500 to −2,200** of the 2,597 cluster; retain ~400–800 in merged source-use |
| PRE-DESIGN + source-use 862+1,176 | **MERGE** to ~600–800 | **~−1,200 to −1,400** |
| Remaining provider authoring + delayed disclosure | **RETAIN ~1,000–1,400** of 6,854 after other cuts | included above |
| Contrast line in shape | **ADD** | **+60 to +120** |
| **Net unique contract+shape** | | **~−6,500 to −8,500** |
| **Target unique contract+shape** | | **~15,500–17,500** |
| **Assembled ×2 of that pair** | | **~31,000–35,000** (from 48,206) |
| Pack notes evidence extension | **REDUCE** to ~200–400 pointer | **~−3,000 once** (not ×2) |
| `what_to_check` | **REDUCE TO ONE LINE** | **~−300 once** |

Ranges are **measured bases minus judged retain**. They are not invented totals. Exact post-edit sizes belong to implementation measurement.

P04 is **several-thousand-character unique deletion**, materially larger than a tidy-up, smaller than deleting the whole 24k contract.

---

## 17. P05 interaction

P05 remains: expanding DLA contract/shape is dual-injected on Copy.

| | Unique after P04 (Option 2) | Assembled with ×2 still present | Later P05 |
| - | --------------------------: | ------------------------------: | --------- |
| Contract+shape | **~15.5–17.5k** | **~31–35k** | Drop second copy → assembled **~15.5–17.5k** for that pair |
| Pack notes (thinned) | **~200–400** evidence remnant | same (once) | P05 does not remove pack |
| Whole Copy | still includes 38S pack body | still large | P05 is **not** pack rationalisation |

Expected later P05 benefit: **~15.5–17.5k** assembled drop from de-duplication **after** unique text is already smaller. Do not implement P05 in P04. Do not claim P04 “fixed” dual injection.

---

## 18. Test strategy for later implementation

Do **not** run benchmarks in this task.

**Structural (must pass after P04 impl):**

- All P01/P02/P03 validator suites (`tests/s76-dla-p01-p02-p03-contract.test.js`, procedural evidence tests, Sprint 72 evidence-centred **validator** cases).  
- Evidence-provider shape / closure still fail on true+no provider, provider not task input, false+providers.  
- Copy contract tests: still **exactly two** contract+shape injections; no third.  
- `CONTRACT_VERSION` pin + `index.html` cache pin updated together.

**Prompt tests:**

- Rewrite `tests/ld-dla-evidence-decision-consistency-prompt.test.js`: **stop** asserting PRE-EMIT / per-activity / INVALID–VALID strings.  
- Assert: commissioning order 1–5 present; particulars-as-grounds in step 4; provider authoring fields named; PRE-EMIT / PER-ACTIVITY / Invalid-valid **absent**; no third injection; unique size bound (implementation chooses a measured ceiling vs current 24,103).  
- Keep T-024 tests for commissioning order and P01-R1 wording.

**Behavioural / benchmark (after impl, before P05):**

| Subject | Must preserve |
| ------- | ------------- |
| **Roman Roads** | A1/A2 `required: false`; genuine evidence activities `true`; provider richness (`learner_action`, `observable_features`, disclosure, provenance when attached) |
| **Lagrangian** | A2/A3 `required: false`; A4/A5 `true` where cases/values are grounds; P01 operand closure intact |

**Recommend:** rerun **Roman Roads + Lagrangian immediately after P04 and before P05**, so score movement is attributable to unique-text deletion, not de-duplication. Do not run them now. Live JSON remains absent; post-P04 captures should be stored if the operator wants attribution.

---

## 19. P04 implementation boundary

Later implementation only. This task touches **nothing**.

| File / function | Action |
| --------------- | ------ |
| `lib/ld-dla-page-enrich-contract.js` `buildDlaPageEnrichContractBlock` | **DELETE** PRE-EMIT, per-activity audit, INVALID/VALID, noun force-true, duplicate source-preference/closure restatements. **CONSOLIDATE** PRE-DESIGN + source-use. **REWORD** step 4 to one P02 paragraph; keep steps 1–3 and 5. **CONSOLIDATE** evidence-semantics to provider-authoring + delayed disclosure. |
| same `buildCanonicalDlaPageShapeSnippet` | **REWORD**: keep one evidence-true example; add one P01-true/P02-false contrast line. Do not add a second JSON activity. Do not strip `learner_action` / `observable_features`. |
| `buildInstructionalArchetypePlanningGuidance` | **DO NOT TOUCH** |
| `tests/ld-dla-evidence-decision-consistency-prompt.test.js` | **CONSOLIDATE** assertions to the new core; delete PRE-EMIT/audit/example matches |
| Other prompt tests that pin old audit headings | **CONSOLIDATE** |
| `index.html` contract script pin | **VERIFY** / bump when contract text changes |
| `app.js` `buildDlaV2CopilotSchemaInstructions` | **VERIFY ONLY** — still concatenates contract+shape once in preamble |
| `app.js` `applyEpisodePlanDlaPopulationPromptBlockToDraft` | **VERIFY ONLY** — no third copy |
| `app.js` `LEARNER_PAGE_DLA_ACTIVITIES_SCHEMA_OUTPUT_LINE` | **VERIFY ONLY** (field list). **REWORD** only if a field is removed (none should be). |
| `app.js` `buildUpstreamPageShellEmbedSectionForDlaCopy` | **DO NOT TOUCH** (empty on partial). Optionally note dead full-page paragraph for a later cleanup — not required to meet P04. |
| `domains/learning-design/domain-learning-design-step-patterns.md` `defaultPromptNotes` evidence extension | **CONSOLIDATE** to a short pointer to the contract (unique competing Copy surface). |
| same `what_to_check` | **REWORD** to role language / pointer; do not keep noun-true. |
| `lib/page-dla-enrich.js` validators / `looksLikeProcedural…` | **DO NOT TOUCH** |
| `lib/ld-gam-page-enrich-contract.js` / GAM Copy brief | **DO NOT TOUCH** |
| T-031 step-3 operational-suitability sentence | **DO NOT TOUCH** (after P04) |
| T-033 step-1 coverage sentence | **DO NOT TOUCH** (after P04) |
| Schema | **DO NOT TOUCH** |

---

## 20. Risks

| Risk | Mitigation |
| ---- | ---------- |
| Removing a historically important distinction (material ≠ evidence ≠ provenance) | Keep those three sentences in step 4 / source-use. That distinction **is** the P02 core, not the audits. |
| Weakening Sprint 72 provider quality | Retain `learner_action`, `observable_features`, delayed disclosure, provenance, layout; keep evidence-true shape example; Sprint 72 validator tests stay green. |
| Regressing procedural P02 false | Delete noun lists and INVALID example; keep independence sentence in step 2; do not add a new force-true list. |
| Allowing evidence/provider omission | Validators still fail-close missing providers when `required: true`. Step 5 still states the shape. |
| Over-relying on validators for semantic choices | Option 3 rejected. Role test remains model-visible. |
| Accidentally deleting `learner_action` / `observable_features` | Explicit ESSENTIAL; prompt tests should assert those tokens remain. |
| Obscuring T-031 / T-033 surfaces | Implementation must not merge steps 1–5 into a blob; keep numbered order. |
| Measuring reduction incorrectly because of Copy ×2 | Report unique contract+shape **and** ×2 separately; pack once separately (this artefact). |
| Pack notes left intact, re-teaching deleted audits | Thin pack in the **same** P04 change-set. |
| Source-bound Roman Roads regression | Keep one PRE-DESIGN/source-use block; rerun RR before P05. |

---

## 21. Recommended target contract

**Semantic evidence guidance that remains**

- Numbered commissioning order 1–5 (unchanged ownership).  
- Step 4: one particulars-as-grounds definition; independent of P01; false ≠ no materials; role not nouns; preamble/bridge do not decide.  
- Step 5: one shape sentence for providers / `evidence_requirement`.  
- One attachment inventory + source-use block (when attachments exist).  

**Provider-authoring guidance that remains**

- `learner_action`, `observable_features`, delayed disclosure, provenance (two values; mixed = separate rows), layout (separate vs combined), inspectable excerpts not summaries.  
- Teaching/scaffold ≠ provider (one sentence).  

**Audit machinery that disappears**

- FINAL PRE-EMIT evidence audit.  
- FINAL PER-ACTIVITY EVIDENCE-DECISION CONSISTENCY AUDIT.  
- INVALID / VALID contrast.  
- Noun lists that force `required: true`.  
- Duplicate source-preference / closure restatements inside the long semantics block.  
- Pack notes / `what_to_check` copies of that stack.  

**Validators own**

- Decision object presence and shape.  
- true/false referential closure.  
- Provider ⊆ task inputs; `evidence_requirement` on listed rows only.  
- Teaching-role and combined-workspace structural checks.  
- **Not** the boolean from task prose.

**T-031 / T-033 will later refine**

- Step 1: LO-operation coverage (T-033).  
- Step 3: load-bearing method/scope in specification (T-031).  
- P04 must leave those steps intact and not fill them with evidence audits.

---

## 22. Implementation readiness

**DLA-P04 READY FOR IMPLEMENTATION PLANNING**

No remaining semantic fork that blocks a later implementation-planning task. Option 2 is the recommended design. Pack thinning is **in P04** (competing unique Copy surface), not P05.

This verdict **does not** authorise prompt edits, validator edits, pack edits, tests, generation, P05, T-031, T-033, or Settings.

**P04 SOLUTION DESIGN COMPLETE**  
**NO IMPLEMENTATION AUTHORISED**

---

## Appendix — evidence used

| Kind | Source |
| ---- | ------ |
| Audit | [S76-T-010](S76-T-010-dla-audit-report.md) P2-C, §3.2 commits, P04 register |
| P02 contract | [S76-T-020](S76-T-020-dla-p02-solution-design.md) §B, §J, §K, §L |
| Impl plan / Gate B | [S76-T-023](S76-T-023-dla-p01-p02-p03-implementation-plan.md) · [S76-T-024](S76-T-024-dla-p01-p02-p03-gate-a-b.md) |
| P01-R1 live | [S76-T-028](S76-T-028-dla-p01-residual-operand-closure-implementation.md) contract `76-DLA-PARTIAL-5` |
| T-031 / T-033 protected steps | [S76-T-031](S76-T-031-generated-operand-operational-suitability-solution-design.md) · [S76-T-033](S76-T-033-dla-lo-operation-coverage-solution-design.md) §O, §U |
| Existence ≠ sufficiency | [S76-T-032](S76-T-032-dla-a4-constructive-alignment-diagnostic.md) |
| Historical audit bug | [S74B-POST](../../2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/S74B-POST-manual-acceptance-dla-evidence-decision-prompt.md) · `126dae2` |
| Live prompt | `lib/ld-dla-page-enrich-contract.js`; `app.js` Copy assembly; pack `defaultPromptNotes` / `what_to_check` |
| Validators | `lib/page-dla-enrich.js` `validateEvidenceDecisionClosure` |
| Prompt tests | `tests/ld-dla-evidence-decision-consistency-prompt.test.js` |
| Sizes | Measured 2026-08-13 from `buildDlaPageEnrichContractBlock` / `buildCanonicalDlaPageShapeSnippet` |

Limitation: Gate C / post-T-028 live JSON is **not in git**. Design uses operator-reported scores and prior Sprint 76 records. That does not block P04 design.
