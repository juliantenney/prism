# S77-T-014 — DLA invariant OLD vs TARGET equivalence review

**Status:** **PHASE B ACCEPTED / COMPLETE** (2026-08-14)  
**Depends on:** [T-013 Phase A](S77-T-013-dla-canonical-assembler-phase-a-implementation.md) · baseline `76-DLA-PARTIAL-9`  
**Purpose:** Inspect wording before any production switch. Intended behavioural change for protected invariants = **NONE**.

## Operator acceptance (2026-08-14)

- [x] Accept TARGET wording as semantically equivalent for protected invariants
- [ ] Request wording edits
- [ ] Reject

Recorded decisions:

1. Dropping commissioning step-number prefixes such as `2)`: **ACCEPTED** — structural/editorial only.
2. Moving `Do not generate final evidence bodies here; GAM fulfils required materials.` from provider authoring to §6: **ACCEPTED** — same semantics, clearer DLA→GAM ownership.
3. P01/P02 independence in both §5 and §7: **ACCEPTED** — deliberate local reinforcement, not competing authority.

No protected semantic wording change is requested.

Accepted specifically: P01-R1, T-033, T-031, P02, Sprint 72 sources, Sprint 72 providers.

---

## Review posture

If TARGET wording is materially different, **flag it**. Do not rationalise a silent semantic change.

Phase B is **ACCEPTED**.

---

## P01-R1 (operand / workspace / intermediate / prior-product)

**Canonical home:** §5 TASK INPUTS  

**OLD** (`buildDlaPageEnrichContractBlock` commissioning order step 2):

> Decide whether separate task operands/stimuli are required. A task input is the particular content upon which the learner performs the required operation (solve, calculate, classify, diagnose, analyse, compare, interpret, evaluate, transform, or construct from supplied particulars) when not already fully contained in learner_task. Set task_material_decision. If separate_inputs_required is true, commission those operands in required_materials and list only their material_ids in task_input_material_ids. If false, ids must be empty; teaching/model/workspace/scaffold may still be commissioned. Roles (not type-absolute): operand/stimulus = problem, case, data, values, source, passage, object or other particulars acted upon; model = shows how; workspace = place/structure to record or manipulate, including blank tables; scaffold = prompts, supports or checks. An operand may also be an already-formed object or state this activity’s operation acts on when the system must supply it. Recording work in a workspace does not make the workspace the operand. The learner’s own prior-activity product is not a new GAM commission. Used during the activity ≠ automatically a task input. Absence test: if removing it leaves the learner without the particulars needed to operate, it is a task input; if they lose only an example of how, a place to write, guidance, or a checklist, it is not. Listing a task input does not set evidence_decision.required; P01 and P02 remain independent.

**TARGET** (`sections.task_inputs` body, same paragraph):

Identical to OLD step 2 (heading `## 5. TASK INPUTS` added; numbered `2)` prefix removed).

**Semantic difference:** Structural only (section heading; step number dropped). Load-bearing sentences unchanged.

**Intended behavioural change:** **NONE**

**Operator flag:** None required for P01-R1 core. Confirm dropping the `2)` prefix is acceptable editorial change.

---

## T-033 (mapped-LO operation coverage)

**Canonical home:** §4 LEARNER PRODUCTION  

**OLD** (step 1):

> Define the learner production obligation (expected_output and learner_task intent). Completing it must require every load-bearing operation needed to demonstrate the mapped LO. A supporting check must not substitute for the operation the mapped LO requires. If completed perfectly, would the work demonstrate every load-bearing mapped-LO operation? If not, redesign production before commissioning materials.

**TARGET:** Same four sentences, plus neighbouring §4 copy: quality-threshold `expected_output`; `intellectual_coherence_bridge` A1/A2+ rules (moved from live payload list); title guidance once.

**Semantic difference:** T-033 core **identical**. Additional production-field rules that already lived in the same live contract block are co-located, not newly invented.

**Intended behavioural change:** **NONE**

**Operator flag:** None for T-033 sentences. Neighbourhood is rearrangement of existing live contract payload/bridge rules.

---

## T-031 (operational bounds) and P03

**Canonical home:** §6 MATERIAL COMMISSIONING  

**OLD** (step 3):

> Commission every required material. required_materials must be an array. For every row: non-empty purpose (the job of this material) and non-empty specification (binding GAM bounds: content, load-bearing count/variation/constraints/exclusions; not body prose). Include any pedagogically chosen method, condition, assumption, boundary, or exclusion the commissioned operation depends on. If omitting it would permit an operand that requires a different operation or untaught reasoning, the specification is insufficient. State bounds for this commissioned operation only. specification must not be only the material_type token.

**TARGET:** Same paragraph, plus checklist diagnostic spec (already live), archetype planning (already live in shape), and explicit `Do not write materials[].body` / `GAM fulfils` (already live in provider section / forbidden list).

**Semantic difference:** Core T-031/P03 **identical**. GAM-fulfils sentence **moved** from provider-authoring block into §6 (still present once in TARGET). No “must be solvable”.

**Intended behavioural change:** **NONE**

**Operator flag:** Confirm GAM-fulfils placement in §6 rather than §8 is acceptable (same meaning).

---

## P02 (particulars-as-grounds)

**Canonical home:** §7 EVIDENCE DECISION  

**OLD** (steps 4–5):

> Independently decide whether any task input functions as particulars-as-grounds. DLA owns evidence_decision.required. true means the learner cannot complete this activity’s production without inspecting particulars (observations, values, extracts, features, conditions, cases-as-data) as grounds for inference, interpretation-from-particulars, comparison-as-evaluation, diagnosis, or substantiation. false means that epistemic use is not required: it does not mean no materials, no operands, and no generated practice. Procedural operands may be task inputs (task_material_decision true) with required: false. Provenance is not this boolean. Correct evidence classification does not by itself make the production sufficient for the mapped LO. Decide from the production’s epistemic role — not from nouns, activity_preamble, intellectual_coherence_bridge, or later-activity mentions.

> If evidence_decision.required is true: list those task-input rows in provider_material_ids and attach evidence_requirement on those rows. If false: omit providers and evidence_requirement.

**TARGET:** Same two paragraphs, plus a **repeat** of the independence sentence already in §5: `Listing a task input does not set evidence_decision.required; P01 and P02 remain independent.`

**Semantic difference:** Core P02 **identical**. Independence restated in §7 as planned local pointer (T-011).

**Intended behavioural change:** **NONE**

**Operator flag:** Dual independence sentence (§5 and §7) is reinforcement, not a new rule.

---

## Sprint 72 — sources / attachments

**Canonical home:** §3 SOURCES AND ATTACHMENTS  

**OLD:** Live “Attachment inventory and source-use” block (five paragraphs: inspect/classify/inventory; conversation_attachment for learner evidence; source-free orientation; no-attachment continue; optional generation_notes).

**TARGET:** Same five paragraphs under `## 3. SOURCES AND ATTACHMENTS`.

**Semantic difference:** Heading only.

**Intended behavioural change:** **NONE**

**Operator flag:** None.

---

## Sprint 72 — providers

**Canonical home:** §8 PROVIDER AUTHORING  

**OLD:** “Evidence-provider authoring” bullets: learner_action; observable_features; delayed disclosure; provenance; teaching ≠ provider; evidence_layout; GAM fulfils bodies.

**TARGET:** Same bullets **except** `Do not generate final evidence bodies here; GAM fulfils required materials.` which is in **§6** (and forbidden bodies also in §1/§10).

**Semantic difference:** Provider field semantics **identical**. Body/GAM sentence relocated to commissioning/forbidden lists.

**Intended behavioural change:** **NONE**

**Operator flag:** Confirm relocation of GAM-fulfils out of the provider bullet list.

---

## Other TARGET-only editorial notes (not protected-core changes)

| Item | Note |
| ---- | ---- |
| U-1 | TARGET §1/§2 state EP owns plan; DLA owns learner production. Competing pack “not a learning-design step” is **absent from TARGET** and **still present in live pack**. Authority cleanup is target-only. |
| U-2 | §9 is an empty gated slot unless `overlayText` supplied. Workbook semantics **not rewritten**. |
| U-3 | TARGET §10 is partial-page envelope. Pack Output `outcome_alignment` / `delivery_notes` **absent from TARGET**; **still live in pack**. |
| §11 | Reduced miniature with `material_type`. Live Marx example **unchanged**. |
| Titles | Once in TARGET §4. Live still nests titles in contract+shape (×4 Copy). |
| Archetypes | TARGET §6 only. Live still nested in shape. |

---

## Operator decision (not filled)

- [ ] Accept TARGET wording as semantically equivalent for protected invariants  
- [ ] Request TARGET wording edits before Phase C (list below)  
- [ ] Reject — do not switch  

Phase B **not accepted** by this artefact’s creation.
