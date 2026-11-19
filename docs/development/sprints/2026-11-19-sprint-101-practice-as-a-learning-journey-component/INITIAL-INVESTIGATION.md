# Sprint 101 — Initial investigation (101A)

**Status:** **COMPLETE** (read-only)  
**Date:** 2026-11-19  
**Opening:** [S101-D01](decisions.md#s101-d01--open-sprint-101--practice-as-a-learning-journey-component)  
**Label discipline:** **CONFIRM** = observed in code; **ASSUME** = inferred / planning judgement.

This investigation does **not** implement Practice, register a product, change prompts, or regenerate exemplars.

---

## 1. Current Interactive pipeline map

### 1.1 Stage order (CONFIRM)

Source: `lib/first-class-workflow-family.js` → `INTERACTIVE_TITLES` / `INTERACTIVE_MIDDLE`; page enrichment order in `lib/page-vnext-assemble.js` → `STAGE_ORDER`.

| # | Title | Canonical step id (v2) | Output (v2) |
| - | ----- | ---------------------- | ----------- |
| 0* | Normalize Content | (optional) | — |
| 1 | Generate Learning Content | `step_generate_learning_content` | `learning_content` |
| 2 | Model Knowledge | `step_model_knowledge` | `knowledge_model` |
| 3 | Define Learning Outcomes | `step_define_learning_outcomes` | `learning_outcomes` |
| 4 | Design Episode Plan | `step_design_episode_plan` | `page` |
| 5 | Design Learning Activities | `step_design_learning_activities` | `page` |
| 6 | Generate Activity Materials | `step_generate_activity_materials` | `page` |
| 7 | Construct Learning Sequence | `step_construct_learning_sequence` | `page` |
| 8 | Design Page | `step_design_page` | `page` |

\*Normalize Content is prepended only when `startingPoint === "authoritative_source"`.

Under `pageEnrichmentV2` + `partialPageOutputs`, stages 4–8 enrich one shared `artifact_type: "page"` / `schema_version: "2.0.0"` envelope with `assembly_state.current_stage` / `enriched_by` (`app.js` `applyPageEnrichmentV2StepNormalization`).

### 1.2 Prompt locations (CONFIRM)

Interactive has **no** sibling-prompt module (unlike Expository / LJ / Situated Task).

| Layer | Location |
| ----- | -------- |
| Catalog templates | `domains/learning-design/domain-learning-design-step-patterns.md` via `resolveStepPromptText` |
| Interactive runtime augmentations | `app.js` `applyWorkflowStepRuntimePromptAugmentations` when `firstClassPromptRoute(wf) === "interactive"` |
| EP shell | `lib/page-shell-create.js`; `app.js` `buildEpisodePlanV2CopilotSchemaInstructions` |
| DLA | `lib/ld-dla-page-enrich-contract.js`, `lib/page-dla-enrich.js`; `assembleLiveDlaCanonicalPrompt` |
| GAM | `lib/gam-canonical-assembler.js`, `lib/ld-gam-page-enrich-contract.js`, `lib/page-gam-enrich.js` |
| LS | `app.js` Learning Sequence v2 copy builders + validators |
| DP | `lib/ld-design-page-partial-contract.js`; `app.js` `buildDesignPageV2CopyAuthoringBrief` |

Author steering: per-step `additional_instruction` via `buildStepAdditionalInstructionBlock` / `appendStepAdditionalInstructionBlockToPrompt`. Capture validates through `validateStrictJsonWorkflowRunStepCapture` then stores under `workflowRunCapturedOutputs[stepId]`.

### 1.3 Shared vs Interactive-specific (CONFIRM)

| Shared with other products | Interactive-specific |
| -------------------------- | -------------------- |
| GLC → MK → DLO (+ optional Normalize) | EP → DLA → GAM → LS middle (`INTERACTIVE_MIDDLE`) |
| Design Page title / page envelope | Interactive promptRoute augmentation chain |
| First-class family builder | Publish route `learner_page` |
| Assessment Pack can consume Interactive DP as `product_output` | Self-study / workshop create variants |

Expository shares GLC/MK/DLO then diverges to EJP/XD/XM. Situated Task does **not** use GLC/MK/DLO/EP/DLA/GAM/LS.

### 1.4 Author intervention / rerun (CONFIRM)

- Copy prompt → paste capture → validate → store.  
- Partial-page mode often does **not** re-embed upstream JSON (chat history / “Locate STEP N OUTPUT”).  
- Non-partial embeds upstream page JSON via `buildUpstream*EmbedSection*`.  
- **ASSUME:** changing `additional_instruction` does not auto-clear downstream captures; author re-runs manually.

---

## 2. Sources of learner-facing prose

Renderer DOM order (`lib/learner-renderer-vnext/render-page.js`): header → editorial opening → orientation → exposition → closing → **activities** → artefacts → assessment → study tips. Default `pageKind` when not assessment/expository/situated_task: **`"interactive"`** (`build-page-model.js`).

| Category | Generated where | Fields | Practice relevance |
| -------- | --------------- | ------ | ------------------ |
| Resource intro / orientation | Design Page | `page_synthesis.overview`, `.learning_purpose` | **ASSUME reducible** in journey context |
| Knowledge summary | Design Page (required for Interactive DP) | `page_synthesis.knowledge_summary` | **ASSUME reducible** for Practice; **CONFIRM** load-bearing for current Interactive DP contract |
| Explanatory / worked examples | GAM | `activities[].materials[]` (`text`, `worked_example`, `modelling_note`, …) | **CONFIRM** some instructional/stimulus material remains essential; full multi-material packs are trim candidates (**ASSUME**) |
| Episode structure | Episode Plan | `episode_plan.archetype`, `beats[]` | **CONFIRM** hard for Interactive validation/render; learner “episode intro” is Orient stack, not EP prose |
| Activity preambles / instructions | DLA | `activity_preamble`, `learner_task`, `expected_output`, `learner_instructions`, `intellectual_coherence_bridge` | **CONFIRM** `learner_task` / production obligation essential; long preamble + every-activity bridge **ASSUME** reducible |
| Hints / feedback | DLA cognition + GAM Check materials | cognition fields; Reveal-after materials; MCQ feedback | **CONFIRM** some attempt-support + post-attempt return is core; full mandatory cognition suite **ASSUME** reducible |
| Transitions / conclusions | DLA bridge; LS timeline; DP `study_tips` / `closing_paragraph` | bridge, timeline purpose, study_tips | **ASSUME** mostly furniture for Practice |
| Editorial opening image | Design Page | `editorial_opening_image` | **ASSUME** reducible for Practice |

Contracts that inflate Interactive prose (CONFIRM): `lib/ld-guided-learning-scaffold.js`, `lib/ld-cognition-orientation.js`, `lib/ld-gam-instructional-depth.js`, `lib/ld-activity-preamble-exposition.js`.

**ASSUME for Practice:** keep consequential learner production + minimal task framing + necessary stimulus/feedback; drop mandatory orientation quartet, knowledge-summary ceremony, and dense cognition word-count stack unless a specific activity needs them.

---

## 3. Learning Journey commissioning and integration map

### 3.1 Flow (CONFIRM)

```text
LJ Requirements → Progression → Elements → Commissioning → Design Page
                         │
                         ├─ commissions[].product_id = "interactive" | …
                         ├─ specification_text / journey_context_text / dependencies
                         └─ shared_authoritative_material
                                    │
                                    ▼
                    first-class-commission-intake.js → intakeCommission
                                    │
                                    ▼
                    buildFirstClassWorkflowFamily (Interactive create type)
                                    │
                                    ▼
                    Child Interactive: GLC…Design Page → LearnerPackage
                                    │
                                    ▼
                    LJ package nests commission_id/ ; unified shell mounts fragments
```

Sources: `lib/learning-journey-sibling-prompts.js`, `lib/learning-journey-design-page.js`, `lib/first-class-commission-intake.js`, `lib/learning-journey-learner-package.js`, `lib/learning-journey-unified-shell.js`, `lib/learning-journey-commission-production-status.js`, `lib/learning-journey-workflow-hierarchy.js`.

### 3.2 Context handoff (CONFIRM)

Commission intake stamps `deliverySeed.commission_specification`, `.journey_context`, `.commission_dependencies`, optional `source_context`, and identity `sourceWorkflowId` / `sourceCommissionId`. It does **not** inject a finished Interactive LO/KM model into the child — **ASSUME** child re-derives GLC/MK/DLO guided by commission text + shared source.

### 3.3 Explicit `interactive` recognition (CONFIRM — main sites)

| Area | Path |
| ---- | ---- |
| Product registry | `lib/first-class-workflow-family.js` `FIRST_CLASS_PRODUCTS` id `"interactive"` |
| Commission intake | `lib/first-class-commission-intake.js` `resolveInteractiveCreateType` |
| LJ Design Page | `SUPPORTED_PRODUCT_IDS`; prompt product list; labels |
| LJ commissioning prompts | Interactive centre-of-gravity in `learning_commissions` |
| Workload | `interactive-workload-feasibility-adapter.js`; LJ adapter `product === "interactive"` |
| Renderer | default `pageKind: "interactive"`; editorial-opening product branches |
| Assessment Pack | `acceptsProductOutputFrom: ["interactive","expository"]` |

### 3.4 Backwards compatibility (CONFIRM + ASSUME)

- Existing `commissions[].product_id: "interactive"` must remain supported.  
- Package/shell are largely product-agnostic once a constituent is complete.  
- **ASSUME:** Practice must be **additive** (`practice` as a new product id, or an explicitly gated Interactive variant) so stored LJ pages are not invalidated.  
- Replacing Interactive in Step 4/5 prompts alone does **not** migrate existing commissions.  
- Fallback `productAcceptsCommission` → interactive-only if family module missing (`learning-journey-design-page.js`) is a footgun when adding Practice (**ASSUME** must be updated in 101D).

---

## 4. Shared dependencies and regression risks

| Dependency | Risk if Practice changes it carelessly |
| ---------- | -------------------------------------- |
| GLC / MK / DLO | Breaks Interactive, Expository, Assessment Pack prefixes |
| Page v2 envelope / `assembleVNextPageFromPartials` | Breaks EP→DP enrichment for Interactive and related validators |
| DLA/GAM contracts (`ld-guided-learning-scaffold`, cognition, instructional depth) | Changing global contracts thins Interactive standalone quality |
| Renderer default `pageKind: "interactive"` | Practice pages without explicit kind may be misclassified or force Interactive validators |
| LJ `SUPPORTED_PRODUCT_IDS` / commissioning prompts | Missing Practice id → unsupported commissions or wrong centre-of-gravity |
| Workload adapters | Practice timing advisories missing or Interactive false positives |
| Assessment Pack `acceptsProductOutputFrom` | May need Practice listed later; not required at investigation |

---

## 5. Comparison of three reuse approaches

### Approach 1 — New Practice workflow reusing Interactive prompt functions and rendering

| Criterion | Assessment |
| --------- | ---------- |
| Duplication | Low initially (call same builders) |
| Risk to standalone Interactive | **Medium–high** — shared contracts/prompts; Practice “thin” changes leak |
| Different learner-facing content | Limited unless overlays are strongly gated |
| Shared schemas / registration | New product id + workflow titles; still shares Interactive contracts |
| LJ integration / packaging | Additive commission path; packaging likely reuse |
| Testability / rollback | Hard to isolate regressions; rollback means undoing shared edits |
| Maintenance | Couples Practice and Interactive release cycles |

### Approach 2 — Shared Interactive/Practice pipeline with type-specific commissioning and generation instructions

| Criterion | Assessment |
| --------- | ---------- |
| Duplication | Low–moderate (shared stages; type-specific overlays) |
| Risk to standalone Interactive | **Lower if** all Practice differences are gated on `product === "practice"` / promptRoute |
| Different learner-facing content | Strong — Practice contracts can omit orientation furniture while Interactive retains it |
| Shared schemas / registration | Shared page envelope; Practice-owned optional fields / softer DP requirements |
| LJ integration / packaging | Clear: new `product_id`, centre-of-gravity, intake create type; Interactive path untouched |
| Testability / rollback | Parallel test suites per product; gate failures localise |
| Maintenance | One pipeline, two contracts — discipline required, but intentional |

### Approach 3 — Isolated Practice pipeline derived from Interactive

| Criterion | Assessment |
| --------- | ---------- |
| Duplication | **High** (fork EP/DLA/GAM/LS/DP/prompt overlays) |
| Risk to standalone Interactive | **Lowest** short-term |
| Different learner-facing content | Highest freedom |
| Shared schemas / registration | Parallel schemas risk drift; renderer may still need shared activity surfaces |
| LJ integration / packaging | More surfaces to teach packaging/status/completeness |
| Testability / rollback | Easy isolation; expensive dual maintenance |
| Maintenance | Divergent bugs/features; likely eventual re-merge pressure |

**Do not choose solely for fewest edits:** Approach 1 looks cheapest but is the worst coupling risk for “lean Practice without disturbing Interactive.”

---

## 6. Recommended implementation direction

**Recommendation (provisional for 101B/101C review): Approach 2 — shared Interactive/Practice pipeline with type-specific commissioning and generation instructions.**

### Reasons

1. Matches the agreed product stance: Practice is a **leaner adaptation** of Interactive, not a greenfield pedagogy engine.  
2. Protects standalone Interactive by requiring **gated** contract overlays (`product` / `promptRoute`), rather than thinning shared Interactive scaffolds globally.  
3. Enables genuinely different learner-facing furniture (optional/absent `page_synthesis` knowledge-summary ceremony; thinner preambles) while reusing activity materials, response surfaces and render composition.  
4. LJ integration stays additive: new `product_id: "practice"`, updated commissioning centre-of-gravity, intake create mapping — without invalidating existing `interactive` commissions.  
5. Preserves GLC → MK → DLO as required this sprint.

### Uncertainties (resolve in 101B / early 101D design)

- Exact Practice pageKind and which Interactive validators still apply.  
- Whether Practice is a first-class Create product **and** LJ-only, or LJ-commissioned-only in v1.  
- How much Episode Plan beat grammar Practice must retain for renderer compatibility.  
- Whether Assessment Pack should later accept Practice product output (out of scope unless authorised).  
- How workload feasibility maps for Practice (reuse Interactive adapter with gates vs new adapter).

---

## 7. Questions for the Practice instructional contract (101B)

1. What is Practice’s centre of gravity in one sentence (vs Interactive vs Situated Task)?  
2. Which learner-facing regions are **forbidden**, **optional**, or **required** (orientation, knowledge summary, editorial opening, study tips, closing)?  
3. How much explanation is allowed before/between activities, and who decides (commission vs generator)?  
4. How does Practice inherit LJ `specification_text` / `journey_context_text` / shared source without re-teaching journey framing?  
5. Which activity types / response surfaces are in v1 (constructed, auto-checkable, worked-example-then-try, …)?  
6. What does “complete” mean for LJ production status (Design Page capture? graphics? thinner DP)?  
7. Is Practice available as a standalone Create product in v1, or LJ-commissioned only?  
8. How should new LJ commissioning prompts prefer Practice while leaving Interactive commissionable for legacy and standalone needs?  
9. What is explicitly **out of contract** (workshop facilitation variant, full visual planning, journal producers, …)?

---

## 8. Proposed wireframe scope and method (101C — not yet executed)

### Intent

Wireframe Practice using the **Understanding Lagrange Multipliers** Learning Journey, focusing on its existing Interactive components as the baseline to strip/reshape.

Repo anchors (CONFIRM): `scripts/reexport-lagrange-unified-journey.js`; Sprint 100 investigation references; various tests citing Lagrange Interactive titles. Live ZIP / operator packages may sit outside the repo (**ASSUME** author supplies current learner export or unified package for 101C).

### Design constraints (from investigation)

- Keep consequential learner action + clear task + necessary stimulus/feedback.  
- Show reduction of orientation / knowledge-summary / preamble / bridge ceremony.  
- Preserve journey-level framing on the LJ home; Practice page should not restate the whole journey.  
- Remains reviewable as HTML/static mock that resembles learner-renderer layout (header → task → materials → response → check), not a new visual language.

### Recommended method (before 101D)

1. Export or locate one Lagrange Interactive constituent page JSON + rendered HTML.  
2. Produce a **Practice candidate** as an annotated HTML wireframe (or stripped page JSON rendered through a local preview) that:  
   - removes or collapses orientation/KS furniture;  
   - shortens activity preamble to task-essential prose;  
   - retains one clear Do surface and Check return;  
   - notes which omitted fields would require contract changes.  
3. Side-by-side review: current Interactive vs Practice wireframe vs LJ commission text.  
4. Design approval gate → then 101D.

**Do not** regenerate exemplars or modify `prism-exemplars` for the wireframe.

---

## 9. Documentation files created or updated

Created under `docs/development/sprints/2026-11-19-sprint-101-practice-as-a-learning-journey-component/`:

- `README.md`, `SPRINT-101-START-HERE.md`, `SPRINT-101-CHARTER.md`  
- `INITIAL-INVESTIGATION.md` (this file)  
- `IMPLEMENTATION-MAP.md`, `STATUS.md`, `VALIDATION.md`  
- `decisions.md`, `ARCHITECTURAL-DEBT.md`

Programme updates:

- `docs/sprints/sprint-101-practice-as-a-learning-journey-component.md`  
- `docs/sprints/NEXT-SPRINT.md`  
- `docs/sprints/README.md`
