# S76-T-035 — DLA-P04 evidence-guidance rationalisation implementation plan

**Task:** S76-T-035  
**Mode:** IMPLEMENTATION PLANNING ONLY — no production code, prompt, schema, validator, test, fixture, benchmark, EP, DLA, GAM, workflow, or Settings changes  
**Depends on (accepted):** [T-034](S76-T-034-dla-p04-evidence-guidance-rationalisation-solution-design.md) (Option 2) · [T-020](S76-T-020-dla-p02-solution-design.md) · [T-023](S76-T-023-dla-p01-p02-p03-implementation-plan.md) · [T-024](S76-T-024-dla-p01-p02-p03-gate-a-b.md) · [T-028](S76-T-028-dla-p01-residual-operand-closure-implementation.md) · [T-031](S76-T-031-generated-operand-operational-suitability-solution-design.md) · [T-033](S76-T-033-dla-lo-operation-coverage-solution-design.md)  
**Sprint:** 76 Phase 2 remainder  
**Out of scope:** P04 live edits · P05 dual-injection repair · T-031/T-033 wording · P01/P02/P03 validator change · schema change · Settings · fresh generation

This artefact is a **reviewable change plan**. It does not authorise implementation.

**IMPLEMENTATION PLAN ONLY**  
**NO IMPLEMENTATION AUTHORISED**

---

## A. Executive implementation strategy

Implement T-034 Option 2 as **one coordinated prompt change-set**: unique DLA contract/shape rationalisation **plus** pack-note thinning **plus** prompt-test updates **plus** contract-version / cache-pin bump.

| Goal | Code meaning of “done” |
| ---- | ---------------------- |
| One planning flow | Commissioning-order steps 1–5 remain the only evidence-planning sequence; steps 1 and 3 survive verbatim enough for later T-033 / T-031 |
| One P02 definition | Step 4 is the only particulars-as-grounds definition; noun force-true lists gone |
| Provider authoring | Compact block + canonical JSON retain `learner_action`, `observable_features`, delayed disclosure, provenance, layout |
| Self-audit gone | No PRE-EMIT evidence audit, no per-activity evidence audit, no INVALID/VALID contrast |
| Validators unchanged | `validateEvidenceDecisionClosure` and related closure **not edited** |
| P05 isolated | Copy still injects contract+shape **exactly twice** |
| Size | Unique contract+shape **24,103 → ~15,500–17,500**; pack evidence notes **~3,435 → ~200–400** |

**Do not** implement T-031 or T-033 in this change-set. **Do not** run benchmarks until Gate B is green and the operator authorises Gate C.

---

## 1. Exact change inventory

Classification: **DELETE** · **CONSOLIDATE** · **REWORD** · **RETAIN** · **VERIFY ONLY** · **DO NOT TOUCH**

Line numbers refer to `lib/ld-dla-page-enrich-contract.js` as of `76-DLA-PARTIAL-5` (2026-08-13).

### 1.1 `lib/ld-dla-page-enrich-contract.js` — `CONTRACT_VERSION`

| Field | Value |
| ----- | ----- |
| Location | line 19 `var CONTRACT_VERSION = "76-DLA-PARTIAL-5"` |
| Current purpose | Observability pin for prompt-contract generation |
| Action | **REWORD** → **`76-DLA-PARTIAL-6`** (see §14) |

`schema_version` remains `"2.0.0"`. No schema change.

### 1.2 `buildDlaPageEnrichContractBlock`

| Surface | Boundary | Current purpose | Action |
| ------- | -------- | --------------- | ------ |
| Header | lines 61–62 `### Sprint 58 vNext DLA partial-page contract` | Identify contract | **RETAIN** |
| PRE-DESIGN | lines 63–68 heading through optional `generation_notes` bullet | Attachment inventory; do not invent unattached works | **CONSOLIDATE** with source-use into one pre-step (§5). Keep inventory + optional `generation_notes` + known-byte-boundary. Drop “do this first” audit tone if the merged heading already says before designing. |
| Commissioning order heading | line 70 | Flow home | **RETAIN** |
| **Step 1** | line 71 `1) Define the learner production obligation…` | T-033 surface | **RETAIN** verbatim (protected §11) |
| **Step 2** | line 72 entire P01-R1 paragraph including `P01 and P02 remain independent` | P01 operand vs model/workspace/scaffold | **RETAIN** verbatim (protected §10) |
| **Step 3** | line 73 `3) Commission every required material… specification must not be only the material_type token.` | T-031 / P03 surface | **RETAIN** verbatim (protected §11) |
| **Step 4** | line 74 | Compact P02 already present but too thin vs remaining 6.8k semantics | **REWORD** to the §3 draft (still one numbered step, not an audit) |
| **Step 5** | line 75 | Shape: true ⇒ providers ⊆ task inputs + `evidence_requirement`; false ⇒ empty | **REWORD** lightly per §4 / §7 — keep shape, drop “must” self-audit stacking |
| Source-use | lines 77–85 `### Resource-level source-use commitment` | Roman Roads A5 / attachment honesty | **CONSOLIDATE** into the merged pre-step; **DELETE** this as a second heading |
| Envelope + payload | lines 87–108 | Partial-page emit + field list | **RETAIN**. **REWORD** only the payload line that says `see PRE-DESIGN` if the heading is renamed |
| Title guidance | line 110 `activityTitleGuidanceBlock()` | Titles | **DO NOT TOUCH** (call remains) |
| Checklist diagnostic spec | lines 112–117 | Out of P04 evidence semantics | **DO NOT TOUCH** |
| Evidence-centred requirement semantics | lines 119–153 | Mixed: authoring + source-preference + noun lists + closure + delayed disclosure | **CONSOLIDATE** to provider-authoring core (§4). **DELETE** noun force-true (141–143), infer/preamble cluster except one line moved to step 4 (139–140), inner source-preference (130–133, 144–145) once merged to pre-step, repetitive closure (128, 150) once step 5 + validators own it |
| FINAL PRE-EMIT AUDIT | lines 155–162 | Silent source-use census | **DELETE** entire heading and bullets |
| FINAL PER-ACTIVITY EVIDENCE-DECISION CONSISTENCY AUDIT | lines 164–175 | Wording↔boolean + provider presence | **DELETE** entire heading and numbered list |
| Invalid / valid contrast | lines 177–183 | Lexical anti-pattern matching deleted fail-close | **DELETE** entire contrast |
| Explicitly forbidden + return | lines 185–194 | Partial-page emit | **RETAIN** |

### 1.3 `buildCanonicalDlaPageShapeSnippet`

| Surface | Boundary | Action |
| ------- | -------- | ------ |
| Envelope + optional `generation_notes` | lines 262–268 | **RETAIN** |
| Evidence-true activity JSON including full `evidence_requirement` | lines 270–298 | **KEEP AS-IS** for Sprint 72 fields (§8). Optional **TRIM** only `expected_output` “what good evidence looks like” if implementer judges existence-bias; default **KEEP** |
| `evidence_decision` true example | line 298 | **RETAIN** |
| Contrast line | **new**, immediately after the JSON activity / before title guidance | **REWORD**/add: one P01-true / P02-false sentence (§8) |
| Title + archetype + forbidden | lines 302–312 | **DO NOT TOUCH** |

### 1.4 `buildInstructionalArchetypePlanningGuidance`

**DO NOT TOUCH.**

### 1.5 Pack — `domains/learning-design/domain-learning-design-step-patterns.md` §5 DLA Prompt Factory

| Surface | Boundary | Action |
| ------- | -------- | ------ |
| `promptTemplate` 38S / DLA-WB body | JSON `promptTemplate` | **DO NOT TOUCH** (not P04 evidence self-audit) |
| `defaultPromptNotes` prefix through `LD-MATERIALS-COPY` / titles / scaffold | before `Evidence-centred extension:` | **RETAIN** |
| `defaultPromptNotes` from `Evidence-centred extension:` through delayed-disclosure / combined workspace / provenance restatement (ends before `Table specs:`) | ~3,435 chars | **CONSOLIDATE** to a short pointer (§9) |
| `runnerInstructions.what_to_expect` | optional upload / simulated default | **RETAIN** (Sprint 72 UX; `tests/sprint-72-dla-evidence-guidance-ux.test.js`) |
| `runnerInstructions.what_to_check` | interpret-language ⇒ required true + conversation_attachment | **REWORD** to role language (§9) |
| `runnerInstructions.what_this_step_does` | | **DO NOT TOUCH** |

### 1.6 Assembly / validators / other

| Path | Action |
| ---- | ------ |
| `app.js` `buildDlaV2CopilotSchemaInstructions` (~10645) | **VERIFY ONLY** — still concatenates contract+shape once in preamble |
| `app.js` `applyEpisodePlanDlaPopulationPromptBlockToDraft` (~12007) | **VERIFY ONLY** — second injection; no third copy |
| `app.js` `LEARNER_PAGE_DLA_ACTIVITIES_SCHEMA_OUTPUT_LINE` (~8755) | **VERIFY ONLY** — field list already names evidence objects; no field removed |
| `app.js` `buildUpstreamPageShellEmbedSectionForDlaCopy` (~10658) | **DO NOT TOUCH** — empty on production partial Copy |
| `app.js` Copy `what_to_check` injection (~32688) | **VERIFY ONLY** — picks up pack reword automatically |
| `lib/page-dla-enrich.js` all evidence validators / `looksLikeProceduralTaskMaterialPractice` | **DO NOT TOUCH** |
| `lib/ld-gam-page-enrich-contract.js` / GAM Copy | **DO NOT TOUCH** |
| EP contracts | **DO NOT TOUCH** |
| `index.html` `lib/ld-dla-page-enrich-contract.js?v=20260813-s76-dla-p01-r1-operand` | **REWORD** pin when contract text changes (§14) |
| `index.html` `page-dla-enrich.js` pin | **DO NOT TOUCH** (validators unchanged) |

---

## 2. BEFORE → AFTER prompt map

Every meaningful evidence/self-audit responsibility. No orphans.

| CURRENT SURFACE | TARGET DESTINATION | ACTION |
| --------------- | ------------------ | ------ |
| PRE-DESIGN inventory / don’t invent unattached works | Merged **Attachment inventory and source-use** pre-step | CONSOLIDATE |
| PRE-DESIGN optional `generation_notes.learner_evidence_attachments` | Same pre-step + payload line + shape | RETAIN |
| Resource-level source-use (conversation_attachment, no summaries, orientation source-free, simulation allowed, mixed separate rows) | Same merged pre-step | CONSOLIDATE (one copy) |
| Inner “Source preference” / resource-level consistency / excerpt-not-summary inside evidence-semantics | Merged pre-step | DELETE duplicate; unique excerpt rule kept once |
| Known boundary (cannot read attachment bytes) | Merged pre-step (one line) | CONSOLIDATE from end of semantics block |
| Commissioning step 1 production | Step 1 | RETAIN (T-033 later) |
| Commissioning step 2 P01-R1 + independence sentence | Step 2 | RETAIN |
| Commissioning step 3 purpose/specification | Step 3 | RETAIN (T-031 later) |
| Step 4 one-liner particulars-as-grounds | Step 4 expanded compact definition | REWORD |
| “Use evidence_requirement only when inspect…” | Step 4 | CONSOLIDATE (role test, not a second list) |
| Infer from production not keywords; preamble/bridge must not decide boolean | Step 4 one line | CONSOLIDATE |
| Noun lists “must set required true” | **Nowhere** | DELETE (G / E) |
| “Conceptual teaching that only mentions examples must not” | Covered by step 4 role test | DELETE as separate list |
| Step 5 provider ⊆ task inputs / false empty | Step 5 one shape sentence | REWORD; validators own closure |
| Semantics closure bullets (true ⇒ rows with `evidence_requirement`) | Step 5 + `validateEvidenceDecisionClosure` | DELETE repeated prose |
| Per-activity audit wording↔boolean | Step 4 role test | DELETE audit; do not reintroduce lexical match |
| Per-activity audit provider empty/non-empty | Validators | DELETE |
| INVALID/VALID “Analyse the supplied case evidence…” | **Nowhere** | DELETE |
| PRE-EMIT attachment census | Merged source-use pre-step | DELETE audit |
| Provider field definitions `kind` / `purpose` / `learner_action` / `observable_features` | Provider-authoring core + shape JSON | CONSOLIDATE (short list) |
| Scaffold ≠ provider; teaching-role closure | Provider-authoring one sentence + existing validators | CONSOLIDATE |
| `combined_evidence_workspace` + source-native `fixed_observation_fields` | Provider-authoring short layout clause + shape | CONSOLIDATE (keep tokens tests need) |
| Delayed disclosure / analogous worked example | Provider-authoring | RETAIN compact |
| Controlled provenance two values | Merged source-use + provider-authoring one line | CONSOLIDATE |
| Canonical evidence-true JSON | Shape | RETAIN |
| P01-true / P02-false contrast | New one line after JSON | ADD |
| Pack notes evidence extension | Pointer to contract | CONSOLIDATE / DELETE duplicate |
| Pack `what_to_check` noun-true | Role-language one line | REWORD |
| Pack `what_to_expect` optional upload | Unchanged | RETAIN |
| Full-page embed heuristic | Not live on partial | DO NOT TOUCH |
| Validator procedural carve-out | Not prompt | DO NOT TOUCH |
| Evidence **existence** as LO alignment | **Nowhere** (T-033 owns sufficiency in step 1 later) | Do not add; deleting audits removes the implicit pressure |

---

## 3. Target Step 4 semantics

**Implementer draft — not live.** Replace current line 74 only. Stay inside the numbered commissioning list. No audit heading. No noun lists. No extra examples.

Current:

> 4) Independently decide whether any task input functions as particulars-as-grounds for inference, judgement, diagnosis, or substantiation. Set evidence_decision.required. false does not mean no materials.

Proposed replacement (conceptual; implementer may tighten wording but must keep every bullet below):

> 4) Independently decide whether any task input functions as particulars-as-grounds. DLA owns `evidence_decision.required`. `true` means the learner cannot complete this activity’s production without inspecting particulars (observations, values, extracts, features, conditions, cases-as-data) as grounds for inference, interpretation-from-particulars, comparison-as-evaluation, diagnosis, or substantiation. `false` means that epistemic use is not required: it does not mean no materials, no operands, and no generated practice. Procedural operands may be task inputs (`task_material_decision` true) with `required: false`. Provenance is not this boolean. Correct evidence classification does not by itself make the production sufficient for the mapped LO. Decide from the production’s epistemic role — not from nouns, `activity_preamble`, `intellectual_coherence_bridge`, or later-activity mentions.

**Must preserve**

- DLA owns the boolean  
- particulars-as-grounds  
- material required ≠ evidence required  
- provenance ≠ evidence dependence  
- false ≠ no materials  
- P01 true / P02 false is legal  
- evidence role ≠ LO alignment / claim sufficiency  

**Must not**

- become a PRE-EMIT/per-activity checklist  
- reintroduce language/form/data/cases force-true  
- add examples beyond T-034’s authorised contrast line (that line lives in **shape**, not step 4)  
- implement T-033 coverage wording  

Independence with P01 remains the existing sentence in **step 2** (`Listing a task input does not set evidence_decision.required; P01 and P02 remain independent`). Do not delete it. Do not copy it into step 4 unless the step-2 sentence is accidentally lost (it must not be).

---

## 4. Target Step 5 / provider-authoring core

### 4.1 Step 5 (in the numbered list)

Current line 75 is already the shape. Proposed (conceptual):

> 5) If `evidence_decision.required` is true: list those task-input rows in `provider_material_ids` and attach `evidence_requirement` on those rows. If false: omit providers and `evidence_requirement`.

Deterministic id/existence/subset checks stay in validators (§7). This sentence is what the model needs to **emit** the structure.

### 4.2 Provider-authoring block (replaces lines 119–153)

Place **after** checklist spec, **before** forbidden. Suggested heading: `Evidence-provider authoring (only when evidence_decision.required is true)`.

**Explicit prose (ESSENTIAL)**

| Topic | Keep as prose | Notes |
| ----- | ------------- | ----- |
| `learner_action` | what the learner must do with the particulars | Do not drop token |
| `observable_features` | non-empty array of inspectable particulars | Do not drop token |
| Delayed disclosure | pre-task teaching / worked_example / modelling_note must not analyse the focal provider, answer the focal task, or state the preferred judgement; analogous case / procedure-only modelling allowed | Sprint 72; Roman Roads A3/A5 |
| Provenance | `system_generated_simulation` \| `conversation_attachment` only; mixed evaluation = separate rows both listed | Cross-ref merged source-use; do not retell the whole source-use story |
| Teaching/scaffold ≠ provider | recording evidence in a scaffold does not make it a provider; teaching text is not a provider unless it also supplies distinguished inspectable grounds | Validators already fail teaching-only + `evidence_requirement` |
| Layout | default `separate_provider`; `combined_evidence_workspace` only when the **same** listed row holds fixed evidence columns and learner response columns; `fixed_observation_fields` must name the inspectable content field (quotation, extract, value, observation — not labels only) | Keep tokens for `tests/sprint-72-evidence-centred-activity-slice.test.js` source-native test |
| Inspectable vs summary | conversation_attachment providers require attributed excerpts/values, not summary packs | May live here **or** in merged source-use — **once only** |

**Leave to shape / schema / example (STRUCTURAL or OPTIONAL)**

| Field | Prose |
| ----- | ----- |
| `kind`: `"learner_evidence"` | Shape JSON only |
| `purpose` (on `evidence_requirement`) | One short clause in the field list, or shape only if material `purpose` is already clear |
| `minimum_suitable_form` | Shape example only |
| `processing_notes` | Optional; source-use can require naming inventoried units |
| `disclosure_constraint` | Shape example carries the string; delayed-disclosure **principle** stays in prose |
| `fixed_observation_fields` / `learner_response_fields` arrays | One layout sentence + validators |

Do **not** redesign `evidence_requirement`. Do **not** generate bodies (existing “GAM fulfils” may remain one clause or rely on forbidden list).

---

## 5. Source-use consolidation

**Target: one pre-step**, still **before** commissioning order (attachments must be inventoried before design). Suggested heading:

`### Attachment inventory and source-use (before designing activities)`

**Remains (unique semantic value — Roman Roads A5)**

1. Inspect Copilot attachments; classify supporting knowledge vs learner evidence vs both.  
2. Inventory available units; do not invent unattached/related works; do not reconstruct from memory.  
3. If attachments are learner evidence, make them central to activities whose purpose is to analyse/interpret/compare/evaluate **that material**; provenance `conversation_attachment`; name inventoried units.  
4. Do not substitute thematic summaries, generic simulations, teaching-only examples, or pre-interpreted observations for that source-bound need.  
5. Orientation/prerequisite teaching may remain source-free.  
6. `system_generated_simulation` remains valid for genuinely different evidential needs or when no suitable source exists.  
7. Mixed attached excerpts + generated viewpoints = separate providers, both listed.  
8. No learner-evidence attachment: continue ordinary generated decisions; do not fail the workflow; do not fabricate copyrighted/exact source wording.  
9. Known boundary: Prism cannot read attachment bytes; absence of attachments must not fail ordinary workflows.  
10. Optional `generation_notes.learner_evidence_attachments`.

**Remove as duplicate** (no unique remainder after the list above)

- Evidence-semantics “Source preference:” paragraph (line 130)  
- “Resource-level consistency: once conversation_attachment is established…” (line 133) if item 3 already says later activities about the same material continue with it — **keep that continuation clause once** inside the merged block (A5 later activities).  
- PRE-EMIT bullets that only re-ask 3–8  
- Pack notes restating 1–8  

**Roman Roads A5 preservation:** items 3, 4, 7, and inspectable excerpts (in this block or provider-authoring, once). Deleting PRE-EMIT is safe **only if** this merged block exists.

---

## 6. Self-audit deletion plan

| Block | Why it can go or shrink | Replacement |
| ----- | ----------------------- | ----------- |
| **PRE-DESIGN** | Unique inventory/source-honesty is real (no fail-closed attachment bytes). The **heading-as-audit** is not unique. | **REDUCE/MERGE** into §5 pre-step. **Not** “delete with no home.” |
| **PRE-EMIT** | Same census as merged source-use, asked again at emit. No unique generative question. | **DELETE**. Replacement = §5 planning-flow semantics. |
| **Per-activity consistency audit** | Provider empty/non-empty = **validator**. Wording↔boolean was added in `126dae2` to match lexical fail-close that **P02 removed**. Residual generative reminder = step 4 role test. | **DELETE**. Replacement = step 4 + step 5 + validators. |
| **INVALID/VALID** | Worked example of the deleted lexical rule; biases Lagrangian A2/A3. | **DELETE**. Replacement = shape contrast line (procedural P01 true / P02 false), **not** a new invalid JSON. |

If an implementer is tempted to keep PRE-EMIT “just in case”: the unique safeguard it protected is **source-bound use of inventoried units**. That lives in §5. Keeping PRE-EMIT would recreate T-010 P2-C.

---

## 7. Deterministic closure prose

Already closed by `validateEvidenceDecisionClosure` / related (T-024; **do not edit**):

- `evidence_decision` present; `required` boolean; `provider_material_ids` array of non-empty strings  
- `true` ⇒ ≥1 provider; each id in `required_materials`; each in `task_input_material_ids`; each row has `evidence_requirement`  
- `false` ⇒ empty providers; no `evidence_requirement` rows  
- teaching-only row must not carry `evidence_requirement`  
- `combined_evidence_workspace` array/listing shape  

**Minimum model-visible wording:** step 5 sentence in §4.1 + canonical JSON showing a true provider row + contrast line for false.

**Delete** from contract: lines 128, 150, per-activity items 1–2 structural bullets, INVALID option A restating the same.

Do **not** remove the JSON keys from the shape or the payload field list (`evidence_decision { required, reason, provider_material_ids[] }`).

---

## 8. Canonical example plan

| Decision | Detail |
| -------- | ------ |
| Keep one evidence-true JSON | Current A1 diagnosis scenario with full Sprint 72 `evidence_requirement` (**KEEP AS-IS** as default) |
| TRIM? | Only if `expected_output`: “what good evidence looks like” is judged existence-bias; optional reword to quality-threshold production, **not** required |
| REWORD JSON? | Do not strip `learner_action`, `observable_features`, `disclosure_constraint`, `provenance`, `evidence_layout` |
| Add contrast line | Immediately after the JSON (before title guidance). Conceptual: `Contrast: practice operands remain in task_input_material_ids with evidence_decision.required false and no evidence_requirement.` |
| Delete INVALID/VALID | Entire contract contrast block |
| Second JSON activity | **Forbidden** |

---

## 9. Pack notes plan

Same change-set as the contract. Do not leave the deleted stack in `defaultPromptNotes`.

### 9.1 `defaultPromptNotes`

**RETAIN** everything before `Evidence-centred extension:` (38S population, titles, scaffold, LD-MATERIALS-COPY, DLA-WB pointers). `tests/workbook-contract-prompt-surface.test.js` depends on `38S`, `episode_plans`, `IFP-06`, `DLA-WB-06a` / `DLA-WB-08`.

**Replace** the evidence extension (~3,435 chars) with ~200–400 chars, conceptual:

> Evidence: emit `evidence_decision` on every activity. `required` means particulars-as-grounds, not that materials exist. When true, author `evidence_requirement` on provider rows per the DLA partial-page contract. Do not infer `required` from nouns.

| Pack statement (current extension) | Class |
| ---------------------------------- | ----- |
| emit `evidence_decision` every activity | CORE UNIQUE VALUE as a **pointer** (one clause) |
| PRE-DESIGN inventory before design | DUPLICATES CONTRACT (§5) → DELETE |
| Infer from production not keywords | DUPLICATES step 4 → DELETE |
| interpret language/form/data/cases must set true | HISTORICAL DEFENSIVE / G → DELETE |
| conceptual teaching must not | DUPLICATES step 4 → DELETE |
| `evidence_requirement` only on named providers; scaffold ≠ provider | DUPLICATES authoring → DELETE |
| combined_evidence_workspace rules | DUPLICATES authoring → DELETE |
| provenance two values; source preference; later activities continue attachment | DUPLICATES §5 → DELETE |
| delayed disclosure | DUPLICATES authoring → DELETE |
| Table specs / IFP-06 / workbook after the extension | RETAIN (not evidence extension) |

### 9.2 `what_to_check`

Current (~524): interpret-language force-true + conversation_attachment excerpts.

**REWORD** to one role line, conceptual:

> `evidence_decision.required` records particulars-as-grounds (not nouns). When true, providers are inspectable and distinct from teaching/scaffolds; attached sources use `conversation_attachment` for inventoried units.

Keep token `conversation_attachment` somewhere in the DLA pack section (`what_to_check` or notes) so `tests/sprint-72-evidence-centred-activity-slice.test.js` “DLA runner Instructions… conversation_attachment” still matches the **file**. Prefer `what_to_check`.

`what_to_expect` **RETAIN** unchanged.

---

## 10. Protect P01 / P02 / P03

P04 **must not alter any validator behaviour**.

| Concern | Regression risk | Tests |
| ------- | --------------- | ----- |
| **P01** operand ≠ model/workspace/scaffold | Accidental rewrite/truncation of step 2 | **KEEP** `tests/ld-dla-evidence-decision-consistency-prompt.test.js` `S76 P01-R1:…`; **KEEP** `tests/s76-dla-p01-p02-p03-contract.test.js` |
| **P02** A2/A3 procedural false | Noun lists / INVALID example left in pack or step 4 | **KEEP** validator suites `s76-dla-procedural-task-evidence-validation.test.js`, `s75-dla-evidence-decision-false-positive.test.js`, Sprint 72 literary `required:false` pass; **ADD** prompt `doesNotMatch` on “must set evidence_decision.required true”; **ADD** shape contrast line assertion |
| **P02** A4/A5 grounds can be true | Over-minimalist step 4 | **KEEP** Sprint 72 provider-closure validator tests; **KEEP** particulars-as-grounds in step 4 |
| **P03** purpose/specification | Accidental edit of step 3 | **KEEP** commissioning-order test `non-empty purpose` / `non-empty specification`; **KEEP** P03 validator cases |

---

## 11. Protect T-031 / T-033

**Do not implement their wording in P04.**

| Later task | Exact live surface that must survive | How later change stays local |
| ---------- | ----------------------------------- | ---------------------------- |
| **T-033** | Commissioning **step 1** string: `1) Define the learner production obligation (expected_output and learner_task intent).` | T-033 replaces/extends **this numbered item only** (~150–280 unique). P04 must not merge step 1 into step 4 or into source-use. |
| **T-031** | Commissioning **step 3** string: `3) Commission every required material. required_materials must be an array. For every row: non-empty purpose (the job of this material) and non-empty specification (binding GAM bounds: content, load-bearing count/variation/constraints/exclusions; not body prose). specification must not be only the material_type token.` | T-031 adds a compact operational-suitability clause **inside this item** (~120–250 unique). P04 must not fold step 3 into provider-authoring. |

Prompt tests after P04 should still `assert.match` these two openings (`Define the learner production obligation`, `non-empty purpose` / `non-empty specification` / `binding GAM bounds` or equivalent current tokens). If an implementer “simplifies” steps 1–3 while touching 4–5, **stop**.

---

## 12. Test changes

| Test file / case | Class | What to do |
| ---------------- | ----- | ---------- |
| `tests/ld-dla-evidence-decision-consistency-prompt.test.js` — per-activity present | **REPLACE** | Assert **absence** of `FINAL PER-ACTIVITY EVIDENCE-DECISION CONSISTENCY AUDIT` |
| same — required:false forbids inspect wording | **DELETE** | That prose is deleted; validators do not infer boolean from wording |
| same — evidence-dependent requires true + provider | **REPLACE** | Assert step 5 shape sentence tokens, not per-activity list |
| same — INVALID/VALID contrast | **REPLACE** | `doesNotMatch` `/Invalid \/ valid contrast/` and the “Analyse the supplied case evidence” string |
| same — commissioning order | **KEEP** | production → inputs → commissions → evidence; particulars-as-grounds |
| same — canonical shape + `CONTRACT_VERSION` | **UPDATE** version to `76-DLA-PARTIAL-6` |
| same — P01-R1 | **KEEP** | |
| same — **new** | **ADD** | one particulars-as-grounds definition; P01/P02 independence (step 2); `learner_action` + `observable_features`; delayed-disclosure / analogous case; provenance tokens; contrast line for P01-true/P02-false; `doesNotMatch` `FINAL PRE-EMIT AUDIT`; `doesNotMatch` noun “must set evidence_decision.required true”; optional unique size ceiling `block.length + shape.length` in 15500–17500 |
| `tests/sprint-72-evidence-centred-activity-slice.test.js` `S72: DLA and GAM contracts include evidence-centred guidance…` | **UPDATE** | Drop PRE-EMIT / per-activity / INVALID / “Source preference” heading / “language, form, structure” force-true. Keep `evidence_requirement`, `observable_features`, `conversation_attachment`, `system_generated_simulation`, delayed-disclosure / analogous case, inventory/unattached works, scaffold ≠ provider / combined layout. GAM assertions **KEEP** |
| same `S72: DLA contract requires source-native field on combined source-bound workspaces` | **UPDATE** if layout sentence shortens; keep match on `fixed_observation_fields` + quotation/extract |
| same `S72: DLA runner Instructions… conversation_attachment` | **KEEP** if pack still contains token |
| same validator / GAM diagnostic cases | **KEEP** |
| `tests/sprint-72-dla-evidence-guidance-ux.test.js` | **KEEP** | `what_to_expect` unchanged; seeded `what_to_check` is catalog stub not pack |
| `tests/page-dla-enrich.test.js` `S76 Gate B: DLA contract+shape remain dual-injected` | **KEEP** | still **exactly 2** `buildDlaPageEnrichContractBlock()` and `buildCanonicalDlaPageShapeSnippet()` call sites in `app.js` |
| `tests/ld-instructional-archetype-production-planning.test.js` version | **UPDATE** `76-DLA-PARTIAL-6` |
| `tests/s76-dla-p01-p02-p03-contract.test.js` | **KEEP** | validators |
| `tests/s76-dla-procedural-task-evidence-validation.test.js` | **KEEP** | |
| `tests/s75-dla-evidence-decision-false-positive.test.js` | **KEEP** | |
| `tests/workbook-contract-prompt-surface.test.js` DLA notes | **KEEP** if 38S prefix retained |
| `tests/intellectual-coherence-bridge-coverage.test.js` enrich contract bridge line | **KEEP** | payload **RETAIN** |
| `tests/ld-activity-title-contract.test.js` | **KEEP** | titles untouched |
| `tests/ld-cognition-orientation.test.js` `PRE-EMIT CHECKLIST` | **DO NOT TOUCH** | different PRE-EMIT (scaffold) |
| Whole-prompt snapshots | **Do not add** | |

No pack-specific test currently asserts the long evidence extension; thinning should not fail workbook tests if 38S prefix remains.

---

## 13. Size measurement plan

**Same basis as T-034:** unique A = `buildDlaPageEnrichContractBlock().length + buildCanonicalDlaPageShapeSnippet().length` (measured **24,103**). Do **not** count the `\n` join inside `buildDlaV2CopilotSchemaInstructions` as a third term. Assembled B = **2 × A** (T-034 **48,206**).

**Before implementation (mandatory first step of the live change-set):**

```text
node -e "var c=require('./lib/ld-dla-page-enrich-contract.js'); var b=c.buildDlaPageEnrichContractBlock(); var s=c.buildCanonicalDlaPageShapeSnippet(); console.log('A unique', b.length+s.length); console.log('B x2', 2*(b.length+s.length)); console.log('block', b.length, 'shape', s.length);"
```

Pack C: length of `defaultPromptNotes` and of the substring from `Evidence-centred extension:` to `Table specs:` (T-034 ~4,122 / ~3,435). `what_to_check` separately (~524).

**After:** repeat A/B/C.

| Series | Before (T-034) | Target |
| ------ | -------------: | ------ |
| A unique contract+shape | 24,103 | **~15,500–17,500** |
| B assembled ×2 | 48,206 | **~31,000–35,000** |
| C pack evidence extension once | ~3,435 | **~200–400** |
| D P04 instructional change | | **(A_after − A_before) + (C_after − C_before)** plus `what_to_check` delta. **Do not** include a P05 “would-be” de-duplication. |

If A_after > 17,500: treat as incomplete deletion (pack or semantics leftover) — Gate B fail. If A_after < 15,500: inspect whether step 2, Sprint 72 fields, or source-use were over-deleted — stop and restore.

P05 savings are **not** P04 savings.

---

## 14. Contract version / cache pin

**BUMP.**

Repository convention (T-023 / T-024 / T-028): DLA prompt-contract edits bump `CONTRACT_VERSION` even without schema change. `schema_version` stays `"2.0.0"`.

| Item | Value |
| ---- | ----- |
| Current | `76-DLA-PARTIAL-5` |
| Proposed | **`76-DLA-PARTIAL-6`** |
| `index.html` | `lib/ld-dla-page-enrich-contract.js?v=20260813-s76-dla-p01-r1-operand` → e.g. `?v=20260813-s76-dla-p04-evidence` |
| `page-dla-enrich.js` pin | **no change** |

Tests that equal `76-DLA-PARTIAL-5` must update (§12).

---

## 15. Implementation sequence

Derived from dependencies: prompt tests import the contract module; Copy assembly tests grep `app.js` call counts; pack tests read the markdown file; size must be measured on the same functions the tests can assert.

1. **Establish before-size** (script in §13); record A/B/C in the later implementation record.  
2. **Bump** `CONTRACT_VERSION` to `76-DLA-PARTIAL-6` (so mid-edit tests fail closed on version until the rest lands — or bump last in the same commit; either is fine if **one change-set**).  
3. **REWORD steps 4–5** only; leave steps 1–3 untouched.  
4. **CONSOLIDATE** PRE-DESIGN + source-use into the pre-step; delete the old source-use heading.  
5. **Replace** evidence-centred semantics with provider-authoring core; **DELETE** PRE-EMIT, per-activity, INVALID/VALID.  
6. **Add** shape contrast line; keep evidence-true JSON.  
7. **Thin pack** `defaultPromptNotes` + `what_to_check` in the same change-set.  
8. **Update prompt tests** (§12) so they fail on leftover audit headings.  
9. **Bump** `index.html` contract cache pin.  
10. **Run targeted tests:** `ld-dla-evidence-decision-consistency-prompt.test.js`, `page-dla-enrich.test.js` (injection count), archetype version test, the one Sprint 72 prompt-guidance test.  
11. **Measure** A/B/C; compare to §13 targets.  
12. **Run broader affected suites:** `s76-dla-p01-p02-p03-contract.test.js`, procedural/S75 evidence validator tests, `sprint-72-evidence-centred-activity-slice.test.js`, workbook DLA notes, title + bridge contract tests.  
13. **VERIFY** `app.js` still has exactly two contract and two shape builder call sites.  
14. **Stop before benchmark.** Gate C is operator-authorised generation only.

Do not edit validators “while the tests are open.” Do not start P05.

---

## 16. Review gates

### GATE A — semantic prompt shape

**Evidence**

- Commissioning order 1–5 present; step 1 and step 3 protected tokens intact; step 2 P01-R1 intact.  
- Step 4 contains particulars-as-grounds, false ≠ no materials, independence from LO sufficiency.  
- Provider-authoring contains `learner_action`, `observable_features`.  
- Deleted: `FINAL PRE-EMIT AUDIT`, `FINAL PER-ACTIVITY EVIDENCE-DECISION CONSISTENCY AUDIT`, `Invalid / valid contrast`.  
- No noun-list `must set evidence_decision.required true`.  
- Prompt tests in §12 targeted set **pass**.  
- `CONTRACT_VERSION === "76-DLA-PARTIAL-6"`.

**Stop if:** steps 1–3 rewritten; T-031/T-033 sentences added; validators edited.

### GATE B — regression / size

**Evidence**

- Suites in §15 step 12 pass.  
- Sprint 72 **validator** provider-closure / source-bound GAM tests pass (unchanged code).  
- Unique A in **15,500–17,500**; B = 2×A in **31,000–35,000**.  
- Pack evidence extension ≤ ~400.  
- `app.js` still **2** contract + **2** shape call sites (P05 not done).

**Stop if:** A outside band without a documented leftover/over-delete diagnosis; injection count ≠ 2.

### GATE C — benchmark (after operator review)

**Evidence**

- Fresh Roman Roads + Lagrangian **after** Gate B, **before P05**, **before T-031/T-033 live wording**.  
- Inspection checklist §17. Scores need not rise.

**Stop if:** operator withholds generation; or P02 force-true / missing providers / source-avoidance reappears.

---

## 17. Benchmark acceptance

Do not require scores to rise. Do not implement T-031/T-033 before this run.

| Lens | Inspect |
| ---- | ------- |
| **Roman Roads A1/A2** | Teaching/scaffold; `evidence_decision.required: false`; materials may still exist |
| **Roman Roads evidence activities** | `required: true` where particulars are grounds; `learner_action` / `observable_features` / delayed disclosure present; A5 source-bound uses `conversation_attachment` and inspectable excerpts when attachments exist |
| **Lagrangian A2/A3** | P01 task inputs present; `required: false`; no noun-list inflation |
| **Lagrangian A4/A5** | `required: true` where cases/values are grounds (DLA judges); not forced true merely by “case/data” |
| **P01** | Operand closure remains strong (post-T-028 behaviour) |
| **PROMPT** | Measured A materially smaller than 24,103 |
| **QUALITY** | No obvious learner-facing coherence collapse vs the post-T-028 84 / RR 87 anchors |

Store JSON if the operator wants attribution. Live Gate C JSON is still not in git.

---

## 18. P05 isolation

P04 **does not** change dual injection.

`tests/page-dla-enrich.test.js` already asserts:

- `buildDlaPageEnrichContractBlock()` appears **twice** in `app.js`  
- `buildCanonicalDlaPageShapeSnippet()` appears **twice**

**KEEP** that test. After P04 it must still pass. P05 later removes one injection path and **then** updates that assertion to 1.

Causal measurement: unique deletion now; de-duplication later.

---

## 19. Implementation boundary

**Expected to change**

- `lib/ld-dla-page-enrich-contract.js`  
- `domains/learning-design/domain-learning-design-step-patterns.md` (DLA `defaultPromptNotes` + `what_to_check` only)  
- `tests/ld-dla-evidence-decision-consistency-prompt.test.js`  
- `tests/sprint-72-evidence-centred-activity-slice.test.js` (prompt-guidance cases only)  
- `tests/ld-instructional-archetype-production-planning.test.js` (version pin)  
- `index.html` contract script `?v=`  
- Sprint 76 implementation record / pointers **after** authorised implementation (not this task)

**VERIFY ONLY**

- `app.js` injection paths and OUTPUT CONTRACT line  
- Copy still ×2  

**DO NOT TOUCH**

- `lib/page-dla-enrich.js` P01/P02/P03 / evidence validators  
- evidence schema / `schema_version`  
- T-031 / T-033 wording  
- P05 injection logic  
- `buildUpstreamPageShellEmbedSectionForDlaCopy` dead full-page paragraph  
- GAM / EP  
- checklist spec, titles, archetypes, 38S pack `promptTemplate`

Repository reality matches T-034: pack notes **are** on Copy once; they belong in this change-set.

---

## 20. Risks / rollback signals

| Risk | Detection | Mitigation | Stop / rollback |
| ---- | --------- | ---------- | --------------- |
| Sprint 72 provider richness weakened | Prompt tests miss `learner_action` / `observable_features`; Gate C thin providers | Keep those tokens in authoring + JSON | Restore authoring block from `76-DLA-PARTIAL-5`; do not restore audits |
| P02 procedural false regresses | Gate C A2/A3 `required: true`; prompt still has noun force-true | Delete noun lists + INVALID; keep contrast line | If pack leftover is the cause, thin pack; do not add validator fail-close |
| Source-bound evidence weakens | RR A5 summaries/simulation substituted | Merged §5 block must exist before PRE-EMIT deletion | Restore merged source-use, not PRE-EMIT stack |
| Provider omission rises | Capture/validator errors `required=true` without providers | Step 5 + **unchanged** validators | If emit-shape unclear, lengthen step 5 one sentence — not per-activity audit |
| Size reduction smaller than expected | A still ≳ 20k | Leftover semantics or pack | Gate B fail; find remaining duplicate |
| Pack notes reintroduce deleted concepts | Read `defaultPromptNotes` after edit; size C | Same change-set | Do not ship contract-only |
| T-031/T-033 surfaces removed | Step 1/3 token tests fail | Sequence: do not edit 1–3 | Restore those two lines from PARTIAL-5 |
| Benchmark regression despite tests | Gate C operator QA / qualitative | Isolation vs P05/T-031/T-033 | Stop before P05; do not silently re-append audits |

Rollback unit = the **whole P04 change-set** (contract + pack + tests + pin), not pack-only or contract-only.

---

## 21. Change-set decision

**YES — one coordinated change-set.**

Contract rationalisation without pack thinning would leave ~3,435 chars of the deleted stack on Copy (`defaultPromptNotes`) plus a noun-ish `what_to_check`. That undermines T-034 Option 2 and S76-D03.

Do **not** include P05. Do **not** include T-031/T-033. Do **not** include validator edits.

---

## 22. Implementation readiness

**DLA-P04 IMPLEMENTATION PLAN READY FOR OPERATOR REVIEW**

No unresolved semantic fork. Mechanical surfaces, protected strings, test classes, measurement basis, version pin, and change-set scope are specified.

This verdict **does not** authorise implementation.

**IMPLEMENTATION PLAN ONLY**  
**NO IMPLEMENTATION AUTHORISED**

---

## Appendix — evidence used

| Kind | Source |
| ---- | ------ |
| Accepted design | [S76-T-034](S76-T-034-dla-p04-evidence-guidance-rationalisation-solution-design.md) |
| P02 contract | [S76-T-020](S76-T-020-dla-p02-solution-design.md) §B §K |
| Prior impl-plan conventions | [S76-T-023](S76-T-023-dla-p01-p02-p03-implementation-plan.md) · [S76-T-028](S76-T-028-dla-p01-residual-operand-closure-implementation.md) version bump |
| Protected later wording | [S76-T-031](S76-T-031-generated-operand-operational-suitability-solution-design.md) · [S76-T-033](S76-T-033-dla-lo-operation-coverage-solution-design.md) |
| Live contract | `lib/ld-dla-page-enrich-contract.js` `76-DLA-PARTIAL-5` lines 19, 58–312 |
| Pack | `domains/learning-design/domain-learning-design-step-patterns.md` DLA `defaultPromptNotes` / `what_to_check` |
| Injection | `app.js` ~10645, ~12007; `tests/page-dla-enrich.test.js` Gate B |
| Prompt tests | `tests/ld-dla-evidence-decision-consistency-prompt.test.js`; Sprint 72 guidance cases |
