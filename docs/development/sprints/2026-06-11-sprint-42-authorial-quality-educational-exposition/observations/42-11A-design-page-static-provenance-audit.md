# Sprint 42-11A — Design Page Static Provenance Audit

**Date:** 2026-06-11  
**Type:** Static code and prompt-contract audit only (no workflow runs, no implementation changes)  
**Builds on:** [handover Current Position](../handover-from-sprint-41.md), [42-5 journey context](42-5-design-page-journey-context-investigation.md), [42-6 journey assimilation](../sprint-42-slice-6-journey-assimilation.md), [42-7 GAM preservation](42-7-gam-preservation-audit.md), [42-8 resource spine](42-8-resource-spine-investigation.md), [42-10 source-ingest LC parity](../sprint-42-slice-10-source-ingest-learning-content-parity.md)

---

## Purpose

Determine **which upstream artefacts are intended to dominate** Design Page learner-page composition, using only static evidence: domain pack §13, runtime prompt augmentation order, compose/repair/preserve contracts, and Sprint 42 journey/authorial modules.

This audit precedes any further Design Page implementation. It does not judge live LLM output quality.

---

## Files reviewed

| File | Role |
| ---- | ---- |
| `handover-from-sprint-41.md`, `README.md` | Sprint 42 position and hypothesis |
| `sprint-42-slice-10-source-ingest-learning-content-parity.md` | LC parity on both entry routes |
| `domains/learning-design/domain-learning-design-step-patterns.md` | §13 Design Page Input, `promptTemplate`, workflow policy |
| `lib/ld-design-page-compose-contract.js` | Hard membership, field preservation, materials bridge |
| `lib/ld-journey-assimilation.js` | Wrapper journey assimilation (42-6) |
| `lib/ld-authorial-exposition.js` | Wrapper authorial quality (42-2) |
| `lib/ld-self-directed-rhetoric.js` | L5/L7 rhetoric; `design_page` rider |
| `lib/educational-quality-framework-prompt.js` | EQF `step_design_page` rider |
| `app.js` | `applyWorkflowStepRuntimePromptAugmentations`, compose/repair/GAM preserve, cognition section order |

---

## Static provenance map

| Upstream artefact | Where referenced | Intended learner-visible role | Strength | Notes |
| ----------------- | ---------------- | ----------------------------- | -------- | ----- |
| **learning_activities (DLA)** | §13 Input (core); compose **ACTIVITY MEMBERSHIP**; field preservation list; `repairLearnerPageCompositionFromUpstream`; `resolveUpstreamLearningActivitiesForPageStep`; cognition merge | **Page structure** (`learning_activities` section); activity rows; framing fields (`activity_preamble`, bridges, cognition); order default | **High** | Only artefact with **hard** set-inclusion contract `(U \ X) ⊆ C`. Post-compose repair keys off DLA only. |
| **activity_materials (GAM)** | §13 Input (core); LD-MATERIALS-COPY via compose; `applyComposedPageGamMaterialsPreserve` | **Activity body** — `activity.materials.*` verbatim inside each row | **High** | PREC-02: materials fidelity **overrides** overview / learning_purpose / study_tips thinning. Largest typical visual weight at render. |
| **learning_content** | §13 Input (optional); `promptTemplate` Context; LD-JOURNEY-ASSIMILATION upstream signals; learner `knowledge_summary when LC or KM` output rule | **Explanatory narrative** — overview inquiry, section arc (assimilated); not a page section type | **Low–Medium** | **No** structural mapping LC.sections → page.sections. Binding-dependent; journey module says “use when bound.” |
| **knowledge_model** | §13 optional Input/Context; journey assimilation `knowledge_summary` | **Conceptual orientation** — `knowledge_summary` wrapper | **Low–Medium** | Same as LC: prompt assimilation only; no repair path; no membership rule. |
| **learning_outcomes** | §13 Input (core Context); journey `learning_purpose`; EQF journey rider | **learning_purpose** bullets / capability framing | **Medium** | Listed first in Input; often renders as outcome list rather than narrative arc. |
| **learning_sequence** | §13 optional; compose: order/timing + assimilate transitions (42-6); `COGNITION_PAGE_CANONICAL_SECTION_ORDER` | **Activity order/timing**; transition language in wrappers/bridges; optional `learning_sequence` section | **Low–Medium** | Domain + compose contract historically stress **order/timing** for activities. `transition_to_next` assimilation is prompt-only (42-6). Rarely own section. |
| **assessment_items** (+ blueprint, rubric, feedback) | §13 optional | **assessment_check** section | **Medium** (when present) | Hard shape when bound (`assessment_check.content.items[]`). Not journey spine. |
| **episode_plans** | **Not** Design Page input | — | **None** | DLA-only via population contract. |
| **normalized_content** | Not Design Page input | — | **None** | Upstream of GLC/KM only (42-10). |
| **EQF** | `applyEducationalQualityFrameworkPromptBlockToDraft` — `step_design_page` | Journey across overview, preambles, tasks, study tips | **Medium** | Manifestation prompt; no post-compose enforcement on page JSON. |
| **PEL orientation / reasoning** | `applyPedagogicEnrichmentContractScaffoldToDraft` — **DLA and GAM only** on Design Page path | Orientation/reasoning authored at DLA; materials at GAM — **preserved** on DP compose | **Medium** (indirect) | PEL blocks are **not** appended to Design Page prompt. DP inherits via field preservation + GAM merge. |
| **LD-JOURNEY-ASSIMILATION** | Appended at compose when learner framing active | overview, learning_purpose, knowledge_summary, study_tips, bridge **read** | **Medium** | Wrapper-only; explicitly subordinate to L4 materials (PREC-02). |
| **LD-AUTHORIAL-EXPOSITION** | Embedded in compose contract + separate augment | Same wrapper fields + framing assimilation | **Medium** | Same subordination to materials fidelity. |
| **LD-SELF-DIRECTED-RHETORIC** | `design_page` rider via augmentation | overview, learning_purpose, study_tips, activity fields voice | **Medium** | L7 rhetoric; precedence below L4 materials. |

### Runtime augmentation order (Design Page)

`applyWorkflowStepRuntimePromptAugmentations` (`app.js` ~10378):

1. Pedagogic cognition scaffold  
2. **EQF**  
3. Self-directed learner-page scaffolds (framing preservation, **LD-SELF-DIRECTED-RHETORIC** `design_page` rider)  
4. Table fidelity (GAM path primarily)  
5. Materials copy (GAM path primarily)  
6. **PEL** (DLA/GAM only — not Design Page)  
7. **LD-DESIGN-PAGE-COMPOSE-CONTRACT** (+ authorial exposition block + **LD-JOURNEY-ASSIMILATION**)  
8. Visual affordances, math, strict JSON  

**Post-compose pipeline** (`applyPedagogicCognitionSemanticsToComposedPage`):

1. `repairLearnerPageCompositionFromUpstream` — **DLA** activities + framing fields  
2. Cognition section normalise/reorder (`COGNITION_PAGE_CANONICAL_SECTION_ORDER`)  
3. `applyComposedPageGamMaterialsPreserve` — **GAM** → `activity.materials.*`  

No post-compose step assimilates `learning_content` or `knowledge_model` into page JSON.

---

## Composition control analysis

### Page structure

**Intended dominant artefact: `learning_activities` (DLA).**

- Page schema is `sections[]` with canonical `section_id`; the substantive section is **`learning_activities.content[]`** — one object per `activity_id`.
- **ACTIVITY MEMBERSHIP** is the only hard structural invariant in `LD-DESIGN-PAGE-COMPOSE-CONTRACT`.
- `learning_content` has **no** corresponding section type or 1:1 mapping (LC `sections[]` ≠ page `sections[]`).
- Cognition reorder places wrappers before activities but **does not remove** the activity stack (`overview → learning_purpose → knowledge_summary → learning_sequence → learning_activities → …`).

### Explanatory narrative

**Intended sources (prompt aspiration): `learning_content`, `knowledge_model`, DLA orientation fields, EQF/journey/authorial modules.**

**Effective static priority:**

1. **GAM materials** inside activity rows (L4, verbatim, PREC-02)  
2. **DLA** framing fields on activity rows (preservation list)  
3. **Wrapper prose** (overview, knowledge_summary) from LC/KM/LO — **soft**; journey assimilation instructs assimilation when bound  

`learning_content` is positioned as **primary narrative upstream** (42-8 handover) but at Design Page as **supporting context for wrapper assimilation**, not as the section tree authority.

### Activity sequence

**Intended: DLA array order**, optionally adjusted by **`learning_sequence` timeline** (order/timing only in compose contract membership line).

- `learning_sequence` does not define page sections; it informs activity order and (since 42-6) transition language in wrappers/bridges.
- Episode plans do not reach Design Page.

### Transitions

**Intended sources:** DLA `intellectual_coherence_bridge`, `activity_preamble`; LS `transition_to_next` / `phase_type` (assimilated); authorial/journey transition lines.

**Static role:** Transitions live on **activity rows** or **wrapper prose** — not as standalone inquiry movements. LS transitions are **prompt assimilation**, not a dedicated learner-facing section or repair target.

### Judgement and reflection

**Intended sources:** GAM closure/debrief/prompt_set in `activity.materials.*`; DLA `transfer_or_application_task`, cognition prompts; `study_tips` synthesis.

- GAM judgement scaffolds are **activity-local** (preserved verbatim).
- LD-SELF-DIRECTED-RHETORIC requires evaluative `expected_output` and GAM-PRES-08 closure minima on final activity.
- No page-level “judgement section” — judgement movement is **inside** activity blocks + optional `study_tips`.

### Closure

**Intended:** `study_tips` section + GAM consolidation/transfer materials in final activity.

- Journey assimilation and rhetoric guide **study_tips** synthesis from GAM/DLA signals.
- Closure can remain **trapped in activity materials** if compose omits thin `study_tips` — static contracts do not force page-level synthesis over materials volume.

---

## learning_content spine assessment

| Criterion | Static finding |
| --------- | -------------- |
| Named in §13 Input | Yes — optional |
| Named in `promptTemplate` Context | Yes |
| LD-JOURNEY-ASSIMILATION | “central inquiry, section progression” → **overview** assimilation |
| Hard compose requirement | **No** — unlike activity membership |
| Structural page mapping | **No** — LC sections are not page sections |
| Post-compose repair | **No** |
| Precedence vs materials | **Subordinate** — PREC-02 / L4 > wrapper prose |

**Assessment:** `learning_content` is **not currently positioned as the primary organising spine** in code or hard contracts. It is **optional enrichment** with **medium aspirational influence** on wrapper prose when bound and when journey assimilation applies. Sprint 42-10 ensures LC exists on both entry routes **before** KM — improving **availability** for assimilation, not **dominance**.

**Capability without schema change:** Existing page schema *could* express LC-first order (`knowledge_summary` / overview before `learning_activities`) via prompt discipline — benchmark `marx-self-study-page.json` — but nothing static **requires** it.

---

## DLA dominance assessment

| Criterion | Static finding |
| --------- | -------------- |
| Hard membership contract | **Yes** — every upstream `activity_id` |
| Repair upstream | **DLA only** |
| Field preservation | 15+ DLA cognition/orientation fields verbatim on rows |
| Section payload | Full task + materials per activity |
| PEL authoring locus | DLA (orientation/reasoning contracts on DLA step, preserved on DP) |
| Fallback spine | If wrappers thin, **activity stack still complete** by contract |

**Assessment:** `learning_activities` is positioned as **dominant page structure**, **activity source**, **preservation source**, and **de facto organising spine**. DLA is not “activity source only” — it also supplies framing that should appear in wrappers — but **structural and repair authority** rest on DLA + GAM, not LC.

---

## GAM materials vs page composition

| Layer | Dominance |
| ----- | --------- |
| **Preservation** | GAM bodies merged verbatim per activity (`applyGamMaterialsToComposedPage`); cannot be shortened for overview space (PREC-02) |
| **Composition** | LLM chooses wrapper length; materials are **not** rewritten at compose |
| **Learner experience (static inference)** | Materials **can dominate scan path** — tables, worked examples, checklists render inside task blocks; wrappers are not length-guaranteed |

GAM is **subordinate to compose structure** (must land inside activity rows) but **dominant in fidelity and typical visual weight** relative to optional wrappers. Static evidence supports: **materials preserved in a way that can outweigh thin wrapper prose**, not subordinate in volume.

---

## Learning Sequence — movement vs ordering

| Use | Evidence |
| --- | -------- |
| **Ordering** | Compose contract: “learning_sequence order/timing only”; timeline for activity flow |
| **Learner-facing movement** | 42-6: assimilate `transition_to_next` / `phase_type` into overview, bridges, study_tips — **prompt-only** |
| **Own section** | `learning_sequence` in `COGNITION_PAGE_CANONICAL_SECTION_ORDER` but optional; seldom required in output |
| **Repair** | Sequencing interaction metadata on activity rows; not LS narrative repair |

**Assessment:** LS is **primarily an ordering hint** at Design Page, with **secondary prompt aspiration** for transition language. Not a standalone learner-facing movement spine in static contracts.

---

## Risks / ambiguities

Cannot be settled without **fresh manual workflow outputs**:

| Ambiguity | Why manual runs needed |
| --------- | ---------------------- |
| Actual wrapper vs activity **volume** on page | Static contracts do not fix token allocation; LLM may still emit thin overview + large materials |
| Whether LC-bound runs **change** overview/knowledge_summary quality | Binding + assimilation are necessary but not sufficient; no static guarantee |
| Cognition reorder activation frequency | `reorderPageSectionsForCognitionParity` only when cognition composition active |
| Learner-perceived “workbook feel” | Renderer task-block layout amplifies activity materials — static hint, not measured here |
| Sprint 30 / 42-4 harness / hand-edited fixtures | Handover flags as **lower-confidence** for experience judgements |

---

## Verdict

**A. Static evidence strongly supports DLA/activity dominance**

Hard contracts (activity membership, DLA repair, GAM verbatim preserve, PREC-02 precedence) centre the composed page on **`learning_activities` + `activity.materials.*`**. `learning_content`, `knowledge_model`, and `learning_sequence` influence **wrapper assimilation and ordering hints** but lack structural authority, repair paths, or precedence over materials.

This **supports** the working hypothesis that the remaining gap is **primarily Design Page composition** (how wrappers relate to the activity stack), not missing upstream stages — **statically**, not as proof of live reader experience.

---

## Recommended next investigation

**Manual output audit (42-11B or equivalent)** — no implementation until evidence from fresh runs:

1. Run **two comparable manual workflows** (same brief): confirm `learning_content` bound to Design Page after 42-10.
2. Capture composed `page.json` + rendered HTML.
3. Measure **statically on artefacts**: section order; word/count or block count for overview / knowledge_summary vs `learning_activities` + materials; presence of LC inquiry in overview vs activity titles alone.
4. Compare to hand-edited benchmark `marx-self-study-page.json` (knowledge_summary-first shape).

If manual runs show LC-rich wrappers but activity-dominated scan path unchanged, next work is **compose precedence / section-emphasis guidance** (prompt-only). If LC is absent or unbound despite topology, investigate **inputBindings** before compose changes.

Do **not** implement spine shifts until manual audit confirms whether the gap is **prompt assimilation weakness** vs **structural activity-centrism** vs **materials volume dominance**.
