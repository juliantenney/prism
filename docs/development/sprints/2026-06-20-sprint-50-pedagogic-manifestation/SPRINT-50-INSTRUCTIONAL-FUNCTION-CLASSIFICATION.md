# Sprint 50 — Instructional Function Classification

**Mode:** Model validation — no implementation  
**Authority:** [`SPRINT-50-PEDAGOGIC-MANIFESTATION-INVENTORY.md`](SPRINT-50-PEDAGOGIC-MANIFESTATION-INVENTORY.md), [`SPRINT-50-INSTRUCTIONAL-MANIFESTATION-HYPOTHESIS.md`](SPRINT-50-INSTRUCTIONAL-MANIFESTATION-HYPOTHESIS.md)  
**Question:** Can the complete pedagogic manifestation inventory be cleanly organised by the Orient → Think → Study → Do → Check → Reflect → Transfer model?

---

# Executive Summary

**Answer: Mostly**

The instructional-function model classifies **the overwhelming majority** of inventoried pedagogic fields with **High** or **Medium** confidence. Every major learner-facing structure maps to at least one function without inventing new function categories.

**Why not “Yes”:**

1. **Boundary fields** — Several structures legitimately span two functions (`expected_output` as Check vs deliverable specification; `support_note` as Think guard vs Check; `sample_output` as Study model vs Check exemplar; `self_explanation_prompt` as Reflect vs pre-verification Study step).
2. **Placement tension** — The Activity Flow vs Companion Guidance rule classifies fields cleanly in principle, but **current manifestation interleaves functions** (e.g. Think cues in framing block, Reflect/Transfer in cognition block, Study/Do/Check inside a single materials stack) without an explicit instructional grammar.
3. **Infrastructure/Meta residue** — A small set of fields (traceability, facilitator-only, compose metadata, sequencing answer keys) does not participate in learner instruction and is correctly excluded via Meta/Infrastructure.
4. **Derived aggregates** — Journey Compass `signals[]` re-express multiple functions from one source field; classification is clean at source-field level, ambiguous at compass-signal level.

**Why not “No”:**

- No inventoried learner-facing field lacks a plausible primary function assignment.
- Coverage is **adequate across all seven functions** on the Marx corpus (materials-heavy activities carry Study/Do/Check even when row-level PEL is thin).
- Technical origin (DLA vs GAM vs Design Page vs Renderer) is **largely explainable** as implementation channel rather than pedagogic category.

---

# Classification Table

## DLA activity-row — PEL / framing / cognition-orientation

| Field | Instructional Function | Placement | Confidence | Notes |
| ----- | ---------------------- | --------- | ---------- | ----- |
| `activity_preamble` | Orient | Companion Guidance | High | “Why the idea matters”; significance and momentum |
| `orienting_preamble` | Orient | Companion Guidance | High | Alias of preamble |
| `activity_framing` | Orient | Companion Guidance | High | Legacy alias |
| `study_orientation` | Orient | Companion Guidance | Medium | Page-working guidance; borders page-level Orient vs within-activity coaching |
| `intellectual_frame` | Think | Companion Guidance | High | Names mode of inquiry |
| `intellectual_coherence_bridge` | Orient | Companion Guidance | High | Cross-activity progression; “why this follows” |
| `prior_knowledge_activation` | Orient | Companion Guidance | High | “Before you start”; activates prior context |
| `prior_knowledge_prompt` | Orient | Companion Guidance | High | Alias |
| `reasoning_orientation` | Think | Companion Guidance | High | Disciplinary reasoning stance |
| `reasoning_orientation_prompt` | Think | Companion Guidance | High | Alias |
| `self_explanation_prompt` | Reflect | Activity Flow | Medium | Generative retrieval; often positioned before checking model work |
| `conceptual_contrast_prompt` | Think | Companion Guidance | High | Discriminating concepts |
| `uncertainty_tension_prompt` | Think | Companion Guidance | High | Interpretive instability + discriminating move |
| `argument_structure_hint` | Think | Companion Guidance | High | Claim → evidence → implication scaffold |
| `transfer_or_application_task` | Transfer | Activity Flow | Medium | Row-level transfer move; may duplicate material `transfer_prompt` |
| `evidence_use_prompt` | Think | Companion Guidance | High | Source-use discipline |
| `disciplinary_lens` | Think | Companion Guidance | High | Lens label (“thinking as a historian”) |
| `scaffold_hint_sequence` | Think | Companion Guidance | Medium | Procedural/reasoning hints during challenge; borders Do support |

## DLA activity-row — task, support, metadata

| Field | Instructional Function | Placement | Confidence | Notes |
| ----- | ---------------------- | --------- | ---------- | ----- |
| `learner_task` | Do | Activity Flow | High | Primary actionable instructions |
| `expected_output` | Check | Activity Flow | High | Success criteria / deliverable evidence |
| `support_note` | Think | Companion Guidance | Medium | Misconception/evidence guard; rhetoric labels “Check your thinking” but reactive coaching |
| `support_notes` | Think | Companion Guidance | Medium | Alias |
| `purpose` | Orient | Companion Guidance | Medium | Learning-move label; one-sentence cue |
| `learner_instructions` / `instructions` | Do | Activity Flow | High | When distinct from `learner_task` |
| `facilitator_moves` | Meta | — | High | Not learner-facing self-directed |
| `failure_mode` | Meta | — | High | Facilitator debrief timing |
| `mapped_learning_outcomes` | Meta | — | High | Traceability; not manifested to learner |
| `required_materials[]` | Infrastructure | — | High | Authoring spec; GAM realisation is learner-facing |
| `activity_interaction_type` | Infrastructure | — | High | Sequencing/ranking metadata |
| `ordering.canonical_order` | Infrastructure | — | High | Answer key for sequencing UI |
| `ordering.learner_display_order` | Do | Activity Flow | High | Learner-facing ordering task presentation |
| `duration_minutes` | Infrastructure | Companion Guidance | Low | Logistical badge; weak instructional function |
| `grouping` | Infrastructure | Companion Guidance | Low | Logistical badge |

## DLA — cognition pack fields (brief-conditional)

| Field | Instructional Function | Placement | Confidence | Notes |
| ----- | ---------------------- | --------- | ---------- | ----- |
| `initial_position_prompt` | Think | Activity Flow | Medium | Dialogic positioning |
| `revision_trigger` | Think | Activity Flow | Medium | Triggers reasoning revision |
| `reasoning_revision_prompt` | Reflect | Activity Flow | Medium | Post-revision reflection |
| `misconception_claim` | Think | Companion Guidance | Medium | Names error pattern |
| `reconciliation_prompt` | Reflect | Activity Flow | Medium | Repair after misconception |
| `evidence_contrast` | Think | Activity Flow | Medium | Contrasting evidence lines |
| `transformation_activity` | Do | Activity Flow | Medium | Source transformation task |
| `source_to_application_prompt` | Transfer | Activity Flow | Medium | Source → application bridge |

## GAM — activity materials

| Field | Instructional Function | Placement | Confidence | Notes |
| ----- | ---------------------- | --------- | ---------- | ----- |
| `materials.text` | Study | Activity Flow | High | Connective exposition |
| `materials.worked_example` | Study | Activity Flow | High | Modelled reasoning steps |
| `materials.worked_analytic_pass` | Study | Activity Flow | High | Analytic modelling pass |
| `materials.sample_output` | Study | Activity Flow | Medium | Primary: model answer; secondary Check exemplar |
| `materials.checklist` | Check | Activity Flow | High | Verification and repair path |
| `materials.analysis_table` | Do | Activity Flow | High | Guided practice / completion |
| `materials.comparison_table` | Do | Activity Flow | High | Structured comparison work |
| `materials.worksheet` / `table` | Do | Activity Flow | High | Learner completion surface |
| `materials.scenario` / `scenarios` | Study | Activity Flow | High | Context to read before analysis |
| `materials.prompt_set` / `prompts` | Do | Activity Flow | Medium | Inquiry/discussion prompts as tasks |
| `materials.transfer_prompt` | Transfer | Activity Flow | High | Extended transfer writing |
| `materials.consolidation_summary` | Reflect | Activity Flow | High | Session/activity synthesis |
| `materials.reflection_prompt` | Reflect | Activity Flow | High | Explicit reflection |
| `materials.modelling_note` | Study | Activity Flow | Medium | Reasoning support within materials |
| `materials.independent_judgement_template` | Do | Activity Flow | High | Independent completion template |
| `materials.decision_table` | Do | Activity Flow | High | Guided judgement completion |
| Cognition cues (inline, non-text) | Think | Activity Flow | Medium | Embedded in Study/Check materials |
| GAM cognition labels (inline) | Think | Activity Flow | Medium | Same; not separate channel |

## Design Page — page-level sections

| Field | Instructional Function | Placement | Confidence | Notes |
| ----- | ---------------------- | --------- | ---------- | ----- |
| `sections[].overview` | Orient | Companion Guidance | High | Governing inquiry and stakes |
| `sections[].learning_purpose` | Orient | Companion Guidance | High | Capability arc and outcomes frame |
| `sections[].knowledge_summary` | Orient | Companion Guidance | Medium | Conceptual preview; borders Study |
| `sections[].study_tips` | Reflect | Companion Guidance | Medium | Epistemic closure; page-level synthesis |
| `sections[].learning_sequence` | Orient | Companion Guidance | Medium | Timeline / phase visibility |
| `sections[].learning_activities` | Infrastructure | — | High | Container, not instructional content |
| `sections[].activity_materials` | Infrastructure | — | High | Legacy merge channel |
| `sections[].support_notes` | Think | Companion Guidance | Medium | Page-level support prose |
| `sections[].assessment_check` | Check | Activity Flow | High | Formative assessment items |
| `page.title` | Orient | Companion Guidance | Low | Topic label |
| `page.audience` | Infrastructure | Companion Guidance | Low | Audience line / compass session frame input |
| `metadata.cognition_profile` | Meta | — | High | Compose trace |
| `generation_notes.*` | Meta | — | High | Compose/repair trace |
| `visual_affordances[]` | Infrastructure | — | High | Metadata for optional visual hooks |

## Renderer-generated structures

| Field | Instructional Function | Placement | Confidence | Notes |
| ----- | ---------------------- | --------- | ---------- | ----- |
| Journey Compass page header | Orient | Companion Guidance | High | Inquiry + session frame |
| Journey Compass per-activity aside | Orient (aggregate) | Companion Guidance | Medium | Re-signals multiple functions |
| `governing_inquiry` (derived) | Orient | Companion Guidance | High | From overview first sentence |
| `session_frame` (derived) | Infrastructure | Companion Guidance | Low | Audience + duration |
| Compass `signals[]` (derived) | Multi | Companion Guidance | Medium | Truncated re-display of Orient/Think/Reflect/Transfer fields |
| Activity header badges | Infrastructure | Companion Guidance | Low | Time/grouping chrome |
| `util-page-columns` wrapper | Infrastructure | — | High | Layout container |
| Visual affordance hooks | Infrastructure | — | Medium | Decorative pedagogy metadata |
| Duplicate-suppressed cues | Infrastructure | — | High | Renderer filter artefact |

---

# Ambiguous Fields

| Field | Competing functions | Why |
| ----- | ------------------- | --- |
| `expected_output` | Check vs Do | Describes what to produce (Do contract) and how success is evidenced (Check) |
| `support_note` | Think vs Check | Rhetoric frames as “check your thinking” but functions as misconception/evidence coaching |
| `sample_output` | Study vs Check | Models good work (Study) and annotates why it works (Check) |
| `self_explanation_prompt` | Reflect vs Study | Generative retrieval before model comparison — reflection or study-phase rehearsal |
| `study_orientation` | Orient vs Meta | Page-working logistics vs intellectual orientation |
| `knowledge_summary` | Orient vs Study | Conceptual preview vs content to read |
| `study_tips` | Reflect vs Transfer | Synthesis of learning vs application beyond session |
| `prompt_set` | Do vs Reflect | Can be discussion prompts (Do) or reflection prompts (Reflect) depending on content |
| `scaffold_hint_sequence` | Think vs Do | Reasoning guidance vs step-by-step task completion |
| `transfer_or_application_task` vs `materials.transfer_prompt` | Transfer (both) | Same function, two channels — row cue vs material body |
| Compass `signals[]` | Orient / Think / Reflect / Transfer | Derived excerpt inherits source ambiguity |
| `intellectual_coherence_bridge` | Orient vs Think | Progression framing vs carried reasoning move |

---

# Duplicate Signals

## Orient

| Signals | Sources |
| ------- | ------- |
| Why this activity matters | `activity_preamble`, aliases, `purpose` |
| Why this page/session | `overview`, `learning_purpose`, `study_orientation` |
| Where this sits in journey | `intellectual_coherence_bridge`, `learning_sequence`, Compass transitions |
| Before you start | `prior_knowledge_activation` |
| Page entry inquiry | `governing_inquiry` (derived), Journey Compass header |

## Think

| Signals | Sources |
| ------- | ------- |
| How to think (general) | `reasoning_orientation`, Compass “How to think” |
| Disciplinary stance | `intellectual_frame`, `disciplinary_lens` |
| Structural reasoning | `argument_structure_hint`, `conceptual_contrast_prompt`, `evidence_use_prompt` |
| Uncertainty handling | `uncertainty_tension_prompt`, Compass “Uncertainty” |
| Misconception / repair | `misconception_claim`, `support_note`, inline cognition cues |
| Scaffold hints | `scaffold_hint_sequence`, `scaffold_hint` materials |

## Study

| Signals | Sources |
| ------- | ------- |
| Exposition | `materials.text` |
| Modelled work | `worked_example`, `worked_analytic_pass`, `modelling_note` |
| Annotated exemplar | `sample_output` |
| Scenario context | `scenarios` |

## Do

| Signals | Sources |
| ------- | ------- |
| Task instructions | `learner_task`, `instructions`, `purpose` cue |
| Practice surfaces | tables, templates, `decision_table`, `prompt_set` |
| Pack dialogic tasks | `transformation_activity`, `initial_position_prompt` |

## Check

| Signals | Sources |
| ------- | ------- |
| Verification lists | `materials.checklist` |
| Success specification | `expected_output` |
| Assessment section | `assessment_check` |
| Exemplar quality annotations | `sample_output` “why this works” sections |

## Reflect

| Signals | Sources |
| ------- | ------- |
| Self-explanation | `self_explanation_prompt`, Compass “Reflect” |
| Explicit reflection materials | `reflection_prompt`, `consolidation_summary` |
| Revision / reconciliation | `reasoning_revision_prompt`, `reconciliation_prompt` |
| Page closure | `study_tips` |

## Transfer

| Signals | Sources |
| ------- | ------- |
| Row transfer cue | `transfer_or_application_task`, Compass “Apply” |
| Material transfer | `materials.transfer_prompt` |
| Source application | `source_to_application_prompt` |

---

# Orphan Fields

**None** among learner-facing instructional structures. Every manifested learner-visible field maps to at least one instructional function.

**Excluded by design (Meta / Infrastructure — not orphans):**

| Field | Why excluded |
| ----- | ------------ |
| `mapped_learning_outcomes` | Authoring traceability |
| `required_materials[]` | Spec channel; learner sees GAM bodies |
| `facilitator_moves`, `failure_mode` | Facilitator-only |
| `metadata.cognition_profile`, `generation_notes` | System compose trace |
| `visual_affordances[]`, `activities_visual_review[]` | Metadata hooks |
| `ordering.canonical_order` | Validator answer key |
| `activity_interaction_type` | Policy metadata |
| `learning_activities` section container | Structural |
| Duplicate-suppressed renderer output | Filter artefact |

These are **not failures of the model** — they are non-instructional infrastructure correctly outside the seven functions.

---

# Coverage Analysis

| Function | Fields supporting it | Adequacy (Marx self-study corpus) |
| -------- | -------------------- | --------------------------------- |
| **Orient** | `activity_preamble`, `overview`, `learning_purpose`, `intellectual_coherence_bridge`, `prior_knowledge_activation`, `study_orientation`, Compass header, `purpose` | **Strong at page level**; **weaker at activity-row level** when PEL omitted from `page.json` (run2) |
| **Think** | `reasoning_orientation`, `conceptual_contrast_prompt`, `argument_structure_hint`, `evidence_use_prompt`, `uncertainty_tension_prompt`, `intellectual_frame`, `disciplinary_lens`, `support_note`, inline cognition cues, `scaffold_hint_sequence` | **Strong in DLA**; **thin on rendered page** when row fields not composed; materials embed some Think (bridges in worked examples) |
| **Study** | `materials.text`, `worked_example`, `worked_analytic_pass`, `sample_output`, `scenario`, `modelling_note` | **Strong** — Marx run2 materials substantive |
| **Do** | `learner_task`, tables/templates, `decision_table`, `prompt_set`, `ordering.learner_display_order` | **Strong** — tasks and practice surfaces present all activities |
| **Check** | `checklist`, `expected_output`, `assessment_check`, checklist sections in materials | **Strong** — verification checklists on activities |
| **Reflect** | `self_explanation_prompt`, `reflection_prompt`, `consolidation_summary`, `study_tips`, pack reconciliation fields | **Partial** — `self_explanation` sparse (A1 only in run2 DLA); consolidation on final activity |
| **Transfer** | `transfer_or_application_task`, `materials.transfer_prompt`, `source_to_application_prompt` | **Present** — A4 `transfer_prompt` material; row-level transfer less universal |

**Summary:** Inventory **adequately supports all seven functions** for a workbook-style self-directed page. Weak spots are **Reflect** coverage consistency and **Orient/Think** when activity-row PEL does not survive compose — not absence of function definitions in architecture.

---

# Placement Analysis

**Answer: Mostly clean separation**

**Evidence for clean separation:**

- Hypothesis placement rule aligns with field semantics: framing/PEL → Companion; tasks/materials/deliverables → Activity Flow.
- Classification table assigns Companion to coaching fields (`reasoning_orientation`, preamble, bridges) and Activity Flow to completion fields (`learner_task`, materials bodies, checklists, transfer prompts).
- Page-level wrapper sections (overview, purpose) classify as Companion without polluting per-activity flow.

**Evidence for overlap:**

1. **Renderer order ≠ instructional function order** — Current path: Companion framing → Do task → cognition block (Reflect/Transfer/Think mix) → materials stack (Study+Do+Check interleaved) → Check (`expected_output`) → Think (`support_note`). Placement rule is semantic; manifestation order is technical.
2. **`self_explanation_prompt`** — Hypothesis lists reflection in Activity Flow; renderer places cognition block **before** materials, so Reflect may precede Study — functionally debatable.
3. **`support_note` after output** — Classified Think Companion but rendered after Check block (`expected_output`), blurring placement narrative.
4. **Journey Compass** — Companion Guidance aggregate that duplicates Activity Flow and Companion sources in truncated form.
5. **Inline cognition cues** — Think function embedded inside Study material bodies (Activity Flow container).

**Conclusion:** Fields **classify cleanly** into Activity Flow vs Companion Guidance. **Manifestation does not yet express** that separation consistently — overlap is observational, not a classification failure.

---

# Final Assessment

### 1. Does the instructional-function model appear viable?

**Yes.** All seven functions are populated by multiple independent field types across DLA, GAM, Design Page, and renderer layers. No learner-facing structure requires an eighth instructional function.

### 2. Does the inventory largely support the model?

**Yes.** The inventory from Sprint 50 is sufficient to test and apply the model. Gaps are **manifestation and compose fidelity** (PEL not always on `page.json`), not missing architectural field types.

### 3. Are most pedagogic fields explainable through instructional function rather than technical origin?

**Yes.** Technical origin (DLA row vs GAM material vs page section vs derived compass) explains **where** content is authored and stored; instructional function explains **what job** it does for the learner. The same function routinely appears on multiple channels (e.g. Transfer on row and in materials; Think in row fields and inline in worked examples).

### 4. Does the Activity Flow vs Companion Guidance distinction appear workable?

**Mostly yes.** The distinction is semantically stable for classification. Workability as a **learner-visible organising principle** depends on manifestation expressing the split — which the inventory shows is **not yet consistently realised** in render order or compose echo of Companion fields.

---

**Classification verdict:** The instructional-function model is a **valid organising principle** for Sprint 50. Classification is **mostly clean** with documented boundary cases and duplicate signals. The model **validates** the hypothesis; it does not falsify it. Falsification would require learner-facing fields that resist all seven functions — none were found.

---

*Classification v1 — investigation only; no implementation.*
