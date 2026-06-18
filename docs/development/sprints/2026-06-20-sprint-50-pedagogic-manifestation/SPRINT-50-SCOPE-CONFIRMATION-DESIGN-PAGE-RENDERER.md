# Sprint 50 — Scope Confirmation: Design Page + Renderer Only

**Mode:** Investigation only — no implementation  
**Question:** Can the validated minimal instructional manifestation model be achieved without upstream DLA/GAM/prompt/schema/gate changes?  
**Evidence:** Sprint 50 inventory and classification; Marx `marx-run-artefacts-run2/`; `app.js` compose and render paths

---

# Executive Summary

**Answer: Mostly Design Page + Renderer only**

The validated instructional grammar (Orient → Think → Study → Do → Check → Reflect → Transfer) can be manifested using **fields already generated upstream**, **compose-time merge and materials preservation already implemented**, and **renderer reordering/labelling/de-duplication** — without new DLA prompts, GAM prompts, OUTPUT CONTRACT expansion, schema redesign, workflow gates, cognition ontology changes, or a new generation stage.

**The one compose-side qualification (still within “Design Page”, not upstream):** Activity-row PEL and Think fields are **available at compose time** from DLA upstream and are **merged by existing repair logic** (`mergeLearnerPageActivityFramingFieldsIntoPageActivities` via `applyPageCompositionValidationForCapturedPage`), but Marx run2 `page.json` shows they are **not always persisted** on activity rows in the saved artefact. Manifestation work must ensure the **authoritative page model** carries merged fields — not regenerate them.

**No upstream change is required** unless the investigation goal is expanded to mandate optional fields on every activity (e.g. `self_explanation_prompt` on all five Marx activities) — that would be **generation coverage**, not **manifestation**.

---

# Evidence Summary

1. **DLA generates required Companion owners** — Marx `learning_activities.json` has `activity_preamble` and `reasoning_orientation` on all five activities; `prior_knowledge_activation` and `self_explanation_prompt` on A1; `support_note` on all activities.

2. **GAM generates required Activity Flow bodies** — Marx `page.json` carries `materials.text`, `worked_example`, `sample_output`, `scenario`, `analysis_table`, `template`, `checklist`, `consolidation_summary`, and `transfer_prompt` where the instructional design requires them.

3. **Page-level Orient exists** — `overview` and `learning_purpose_outcomes` are persisted in run2 `page.json`.

4. **Compose merge exists** — `applyPageCompositionValidationForCapturedPage` (workflow capture handler ~19288) calls `applyPedagogicCognitionSemanticsToComposedPage`, which runs `repairLearnerPageCompositionFromUpstream` and merges `LEARNER_PAGE_ACTIVITY_FRAMING_PRESERVATION_FIELD_IDS` from upstream DLA when absent on page rows.

5. **GAM materials preserve exists** — `applyComposedPageGamMaterialsPreserve` overlays upstream `activity_materials` when compose thins materials.

6. **Renderer can surface all functions** — `renderActivityFramingForActivity`, `renderCognitionFieldsForActivity`, `renderMaterialsForActivity`, and task/output/support blocks already render the field types; the gap is **order, labels, and de-duplication**, not missing render capability.

7. **Persistence gap is compose artefact, not upstream absence** — Run2 `page.json` activity rows omit `activity_preamble`, `reasoning_orientation`, etc., while DLA upstream contains them and merge code would populate them at capture validation time.

8. **Export pipeline can merge before render** — `runUtilityPageExportPipeline` calls `applyPageCompositionValidationForUtilitiesPage` by default (~38247), resolving upstream from workflow captures when available.

---

# Function Availability Matrix

| Function | Required Fields (minimal model owners) | Available at Compose | Persisted in page.json (run2) | Renderer-ready | Upstream Change Needed |
| -------- | -------------------------------------- | -------------------- | ----------------------------- | -------------- | ---------------------- |
| **Orient** (page) | `overview`, `learning_purpose` | Yes — Design Page + LC/LO upstream | **Yes** | Yes | **No** |
| **Orient** (activity) | `activity_preamble` (+ optional bridge) | Yes — DLA upstream; merge at capture | **No** on rows (merge not in saved artefact) | Yes, if on row | **No** |
| **Think** | `reasoning_orientation` (+ merged hints) | Yes — DLA upstream; merge at capture | **No** on rows | Yes, if on row | **No** |
| **Study** | `materials.text`, `worked_example`, `scenario`, etc. | Yes — GAM upstream; preserve overlay | **Yes** | Yes (order wrong) | **No** |
| **Do** | `learner_task`, practice materials | Yes — DLA + GAM | **Yes** | Yes (order wrong) | **No** |
| **Check** | `materials.checklist`, `expected_output` | Yes — DLA + GAM | **Yes** | Yes (split order) | **No** |
| **Reflect** | `self_explanation_prompt`, `consolidation_summary` | Yes — DLA / GAM when designed | **Partial** — `consolidation_summary` A5 yes; `self_explanation` not on page row | Yes | **No** for manifestation; optional field sparse in generation |
| **Transfer** | `materials.transfer_prompt` | Yes — GAM | **Yes** (A4, A5) | Yes | **No** |

---

# Field Availability Detail

| Field | Source | Compose Availability | page.json Persistence (run2) | Renderer Use | Notes |
| ----- | ------ | -------------------- | ---------------------------- | ------------ | ----- |
| `activity_preamble` | DLA | Yes — upstream + merge | **No** on activity rows | `util-activity-preamble` | Present all activities in DLA JSON |
| `orienting_preamble` | DLA | Yes — alias merge path | No | Fallback in framing render | Not in Marx DLA |
| `activity_framing` | DLA | Yes — alias merge path | No | Fallback in framing render | Not in Marx DLA |
| `prior_knowledge_activation` | DLA | Yes — upstream + merge | **No** | “Before you start” cue | A1 only in Marx DLA |
| `reasoning_orientation` | DLA | Yes — upstream + merge | **No** | “How to think” cue | All activities in DLA |
| `intellectual_frame` | DLA | Yes — if upstream has it | No | PEL orientation cue | Not in Marx DLA |
| `disciplinary_lens` | DLA | Yes — if upstream has it | No | PEL orientation cue | Not in Marx DLA |
| `conceptual_contrast_prompt` | DLA | Yes — if upstream has it | No | “Key distinction” cue | Not in Marx DLA; optional Think |
| `argument_structure_hint` | DLA | Yes — if upstream has it | No | “Structuring your response” | Not in Marx DLA; optional Think |
| `evidence_use_prompt` | DLA | Yes — if upstream has it | No | “Using evidence” | Not in Marx DLA; optional Think |
| `self_explanation_prompt` | DLA | Yes — upstream + merge | **No** | `util-cognition--explain` | A1 only in Marx DLA |
| `transfer_or_application_task` | DLA | Yes — if upstream has it | No | `util-cognition--transfer` | Not in Marx DLA; `transfer_prompt` material used |
| `learner_task` | DLA | Yes | **Yes** | `util-activity-task` | |
| `expected_output` | DLA | Yes | **Yes** | `util-output-block` | |
| `support_note` | DLA | Yes | **Yes** | `util-support-note` | All activities |
| `materials.text` | GAM | Yes — preserve overlay | **Yes** | Study material block | |
| `materials.worked_example` | GAM | Yes | **Yes** | Study material block | |
| `materials.sample_output` | GAM | Yes | **Yes** (A1) | Study / Check exemplar | |
| `materials.scenario` | GAM | Yes | **Yes** (A3, A4) | Study scenario card | |
| `materials.analysis_table` | GAM | Yes | **Yes** (A2, A3) | Do practice table | |
| `materials.template` | GAM | Yes | **Yes** (A5) | Do template block | |
| `materials.checklist` | GAM | Yes | **Yes** | Check checklist block | |
| `materials.reflection_prompt` | GAM | Yes — if generated | No in run2 | Reflection heading | Marx uses `consolidation_summary` instead |
| `materials.consolidation_summary` | GAM | Yes | **Yes** (A5) | Reflect material block | |
| `materials.transfer_prompt` | GAM | Yes | **Yes** (A4, A5) | Transfer material block | |

**Page wrapper fields (Orient / closure):**

| Field | Source | Compose | Persisted (run2) | Renderer | Notes |
| ----- | ------ | ------- | ---------------- | -------- | ----- |
| `overview` | Design Page | Yes | **Yes** | Page section | |
| `learning_purpose` / `learning_purpose_outcomes` | Design Page | Yes | **Yes** | Page section | |
| `knowledge_summary` | Design Page | Yes | No | Page section | Optional Orient preview |
| `study_tips` | Design Page | Yes | No | Page section | Optional page Reflect |

---

# Compose Gap Analysis

## Available at compose but not persisted in run2 `page.json`

| Field group | Compose mechanism | Gap |
| ----------- | ----------------- | --- |
| PEL / Think activity-row fields | `mergeLearnerPageActivityFramingFieldsIntoPageActivities` during `applyPageCompositionValidationForCapturedPage` | Merge runs on workflow capture paste (~19288) but run2 saved artefact lacks merged keys — either exported before validation, outside capture handler, or validation did not write back to saved file |
| `self_explanation_prompt` | Same merge list (`LEARNER_PAGE_ACTIVITY_FRAMING_PRESERVATION_FIELD_IDS` includes cognition-orientation fields via framing list) | Not on page rows in run2 |
| Optional Think fields | Merge if upstream has value | Not generated in Marx DLA — N/A for run2 |

## Already persisted correctly (compose working)

| Field group | Evidence |
| ----------- | -------- |
| GAM `materials.*` bodies | Full substantive bodies on all activities in run2 |
| `learner_task`, `expected_output`, `support_note` | All activities |
| Page `overview`, learning purpose section | Present |

## Transient / render-time only (not a substitute for persistence)

| Mechanism | Behaviour |
| --------- | --------- |
| `applyPageCompositionValidationForUtilitiesPage` | Merges upstream when workflow captures available at export — mutates parsed page in memory before render |
| Journey Compass | Derived at render from page fields — not a PEL store |
| Render without compose validation + without workflow state | Uses `page.json` as-is — **PEL absent in run2** |

**Conclusion:** Compose gap is **persistence and authority of merged page model**, not missing upstream data. Fixing this is **Design Page compose scope** (ensure merged output is the saved `page.json`), not DLA regeneration.

---

# Renderer Gap Analysis

The renderer **can express** the minimal model sections using existing data **when fields are on `page.json` activity rows and materials**:

| Minimal section | Data source | Currently manifested? | Gap type |
| --------------- | ----------- | --------------------- | -------- |
| Why this activity | `activity_preamble` | Conditional — only if on row | **Compose persistence** + label |
| How to approach this | `reasoning_orientation` (+ hints) | Conditional — framing block | **Compose persistence** + merge into one block + label |
| Read and model | Study materials | Yes — but after task in DOM order | **Manifestation order** |
| What to do | `learner_task`, Do materials | Yes — task often before materials | **Manifestation order** |
| Check your work | `checklist`, `expected_output` | Yes — split (output after materials) | **Manifestation order** + unify section |
| What to take away | `consolidation_summary`, `self_explanation_prompt` | Partial | Order + optional field presence |
| Apply elsewhere | `transfer_prompt` | Yes (A4, A5) | Label + position |

**Renderer gaps are organisational, not data gaps:**

- DOM order: task before Study materials (inventory §4)
- Unlabelled material stack (Study/Do/Check not distinguished by function headings)
- Duplicate signals: framing + cognition + Compass repeat Orient/Think/Reflect/Transfer
- `expected_output` separated from checklist Check section

**None of these require new field types** — only reorder, section semantics, and de-duplication per minimal model.

---

# Upstream Dependency Analysis

## Per-function upstream dependency test

| Function | Available before Design Page? | Available at compose? | Persisted in page.json? | Renderer can use? | Upstream change needed? |
| -------- | ----------------------------- | --------------------- | ----------------------- | ----------------- | ----------------------- |
| Orient (page) | Yes (LC/LO/Design Page) | Yes | Yes (run2) | Yes | **No** |
| Orient (activity) | Yes (DLA) | Yes | No (run2) — merge available | Yes | **No** |
| Think | Yes (DLA) | Yes | No (run2) — merge available | Yes | **No** |
| Study | Yes (GAM) | Yes | Yes | Yes | **No** |
| Do | Yes (DLA + GAM) | Yes | Yes | Yes | **No** |
| Check | Yes (DLA + GAM) | Yes | Yes | Yes | **No** |
| Reflect | Yes (when designed) | Yes | Partial | Yes | **No** for manifestation |
| Transfer | Yes (GAM) | Yes | Yes (where designed) | Yes | **No** |

## Explicit non-goal confirmation

| Item | Required? | Evidence |
| ---- | --------- | -------- |
| **DLA prompt changes** | **No** | Marx DLA emits preamble, reasoning_orientation, tasks, support_note; gates already enforce minimum |
| **GAM prompt changes** | **No** | Marx GAM materials substantive and preserved |
| **OUTPUT CONTRACT expansion** | **No** | Fields already defined; compose contract (`LD-DESIGN-PAGE-COMPOSE`) already lists preservation IDs |
| **Schema redesign** | **No** | Activity row and materials shapes sufficient |
| **Workflow gate changes** | **No** | DLA/GAM gates unrelated to manifestation |
| **Cognition ontology changes** | **No** | Classification uses existing fields |
| **Auto-repair (new)** | **No** | `repairLearnerPageCompositionFromUpstream` already merges framing fields at capture; strengthening persistence ≠ new upstream repair |
| **New generation stage** | **No** | Full pipeline DLA → GAM → Design Page → render exists |

## When upstream work would become necessary (out of current Sprint 50 manifestation scope)

Only if product goals require **content not present in any upstream artefact** for a given activity — e.g. mandating `self_explanation_prompt` on every activity when DLA only emits it on A1. That is **generation coverage**, not **instructional manifestation** of existing pedagogy.

---

# Final Verdict

**Sprint 50 can proceed as a Design Page + Renderer manifestation slice.**

| Workstream | In scope | Rationale |
| ---------- | -------- | --------- |
| **Design Page compose / page model** | **Yes** | Ensure PEL/Think fields from DLA are **persisted** on `page.json` activity rows (existing merge path); materials preservation already works; optional page closure sections |
| **Renderer manifestation** | **Yes** | Reorder to Study → Do → Check; function labels; merge Think/Orient blocks; de-duplicate Compass/cognition/framing; unify Check |
| **DLA / GAM / prompts / gates** | **No** | Required source fields already generated and available at compose time for Marx corpus |

**Scope boundary statement:** The validated minimal instructional manifestation model does **not** depend on upstream generation changes for the Marx validation corpus. It depends on **compose fidelity** (page model carries what upstream already provides) and **renderer expression** (order and labels that make the grammar legible).

---

*Scope confirmation v1 — investigation only.*
