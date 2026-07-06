# Design Page — Responsibility Matrix

**Sprint:** 56A — Design Page Simplification Planning  
**Status:** Planning artefact — descriptive, not prescriptive  
**Date:** 2026-07-06  
**Sources:** [DESIGN-PAGE-ARCHITECTURE-AUDIT.md](../2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/DESIGN-PAGE-ARCHITECTURE-AUDIT.md), [DESIGN-PAGE-RESPONSIBILITY-ANALYSIS.md](DESIGN-PAGE-RESPONSIBILITY-ANALYSIS.md), [DESIGN-PAGE-FAILURE-MODES.md](DESIGN-PAGE-FAILURE-MODES.md), [SPRINT-57-ARCHITECTURE-STATE.md](../2026-07-01-sprint-57-learner-experience-product-quality/SPRINT-57-ARCHITECTURE-STATE.md), [SPRINT-57-LEARNER-PIPELINE-REFERENCE.md](../2026-07-01-sprint-57-learner-experience-product-quality/SPRINT-57-LEARNER-PIPELINE-REFERENCE.md), [SPRINT-57-ARCHITECTURE-DECISIONS.md](../2026-07-01-sprint-57-learner-experience-product-quality/SPRINT-57-ARCHITECTURE-DECISIONS.md)

**Purpose:** Complete inventory and consistent classification of Design Page responsibilities before target architecture or migration planning.

---

## Classification legend

| Class | Meaning |
| ----- | ------- |
| **Core** | Essential to Design Page identity; removing it means Design Page no longer performs its primary role |
| **Secondary** | Useful but not foundational; may remain if it never compromises learner-content preservation |
| **External Candidate** | May belong elsewhere or be removable; identified only — not reassigned in this document |

**Preservation risk:** Likelihood this responsibility encourages summarisation, substitution, omission, or transformation of upstream learner content (High / Medium / Low / None / Guardrail).

---

## Responsibility matrix

| ID | Responsibility | Description | Current Behaviour | Dependencies | Classification | Preservation Risk | Notes |
| -- | -------------- | ----------- | ----------------- | ------------ | -------------- | ----------------- | ----- |
| R-01 | Page JSON schema emission | Emit `artifact_type: page` with canonical top-level keys and `sections[]` structure | Model outputs strict JSON page object per §13 `defaultOutputStructure` | Domain pack §13; `LD-DESIGN-PAGE-COMPOSE-CONTRACT`; strict JSON augmentation | **Core** | None | Defines deliverable shape |
| R-02 | Canonical section ordering | Order sections: overview → learning_purpose → knowledge_summary → learning_activities → assessment_check → support_notes | Pack template instructs coherent section sequence when applicable | §13 `promptTemplate`; upstream artefact bindings | **Core** | Low | Organisation only when bodies not rewritten |
| R-03 | Page profile selection | Set `page_profile` to learner, facilitator, or assessment | `userOptions.page_profile` drives emphasis and section content | Workflow brief; step params; profile-specific prompt instructions | **Core** | Medium | Learner profile is default primary path; assessment profile may thin activities |
| R-04 | Learner-facing section headings | Provide meaningful headings; avoid schema-style labels in learner text | Pack and compose instruct human-readable headings | §13; compose contract | **Secondary** | Low | Presentation, not payload |
| R-05 | Title and audience metadata | Emit `title` and `audience` on page root | From brief or inferred from context | Workflow brief; step params `audience_level` | **Core** | None | |
| R-06 | Source artefact provenance | Record `source_artefacts` listing consumed upstream artefacts | Compose requires episode_plans in list when consumed | Upstream bindings; compose `EPISODE_PLAN_LINES` | **Core** | None | Audit trail |
| R-07 | Constraints applied recording | Emit `constraints_applied` reflecting workflow constraints | Pack output contract | Workflow brief | **Secondary** | None | |
| R-08 | Generation notes | Record `generation_notes` including `limitations`, `activities_omitted[]` | Document gaps and authorised omissions | Compose membership; L4 generation-notes rules | **Secondary** | **High** when misused | Forbidden to excuse material-body loss; still a pressure valve |
| R-09 | Workflow constraint enforcement | Preserve requested component types, quantities, exclusions from brief | Hard constraints in pack and compose membership | Workflow goal; desired outputs; step notes | **Core** | Low | Must not drop bound components |
| R-10 | Strict JSON output contract | Return JSON only via `preferredOutputFormat` and runtime strict JSON block | Single fenced JSON object | `app.js` strict JSON augmentation | **Core** | None | Mechanical |
| R-11 | Math notation preservation | Preserve `\(...\)` and `\[...\]` in copied learner-facing text | `LD-MATH-RENDER` referenced on compose path | Shared math module; upstream STEM content | **Core** | None | Transport fidelity |
| R-12 | Copilot upstream consumption | Locate and consume full prior `STEP N OUTPUT:` bodies from conversation | Compose `UPSTREAM_CONSUMPTION`; `app.js` upstream section | Copilot multi-step workflow; input bindings | **Core** | **High** if skipped | Primary path when PRISM does not re-inject captures |
| R-13 | Context access rule | Treat active chat history as context; search before claiming artefacts unavailable | `CONTEXT_ACCESS_RULE_LINES` in compose contract | Copilot conversation model | **Core** | **High** if violated | Addresses failure mode **F** |
| R-14 | Anti-reconstruction guard | Do not compose material bodies from `required_materials` or brief alone | Compose, §13, L4 GAM binding | DLA obligations; GAM Content bodies | **Core** | **High** | Anti-specification |
| R-15 | Per-binding consumption routing | Apply artefact-specific rules (GAM→materials, DLA→rows, DEP→episode_plans) | `buildDesignPageUpstreamArtefactsConversationalPromptSection` | Workflow `inputBindings` | **Core** | Medium | Routing hints per binding |
| R-16 | Read-only compose policy | Do not replan, respecify, or summarise away upstream bodies | Compose upstream tail; ADR-06 | All upstream artefacts | **Core** | **High** if violated | North star for assembly step |
| R-17 | GAM material block merge | Merge every GAM `Material:` block per `activity_id` into matching activity row | L4 preserve; compose upstream merge instructions | `activity_materials` pack text; DLA activity_ids | **Core** | **High** | Core payload operation |
| R-18 | Opaque payload transport | Treat each GAM `Content:` body as uninterpreted payload; transport not authoring | `OPAQUE_PAYLOAD_LINES` | GAM pack text parsing | **Core** | Guardrail | Prevents type-driven regeneration |
| R-19 | GAM content binding | Distinguish metadata (Material/Purpose/type) from payload (`Content:` only) | `GAM_CONTENT_BINDING_LINES` | GAM pack structure | **Core** | **High** | Addresses failure mode **B** |
| R-20 | Multi-material enumeration | Emit one `activity.materials.<field>` per GAM Material block; count keys == count blocks | `MULTI_MATERIAL_ENUMERATION_LINES` | Per-activity GAM blocks | **Core** | **High** | Addresses failure mode **C** |
| R-21 | Full content body preservation | Entire `Content:` body per field; no first-line, excerpt, or partial copy | `FULL_CONTENT_BODY_PRESERVATION_LINES` | GAM Content boundaries | **Core** | **High** | Addresses failure mode **D** |
| R-22 | Material preservation vs optimisation | Large output acceptable; condensed output not; preservation beats page size | `MATERIAL_PRESERVATION_OVERRIDES_PAGE_OPTIMISATION_LINES` | Competing brevity signals | **Core** | Guardrail | Precedence rule |
| R-23 | Final learner output invariant | Page must embed full bodies; no references (`"Full text from…"`) or dereferenceable content | `PAGE_ARTEFACT_FINAL_LEARNER_OUTPUT_LINES` | Self-contained page contract | **Core** | **High** | Addresses failure mode **E** |
| R-24 | Authorable vs archival split | Page narrative authorable; `activity.materials.*` archival only — exact GAM copy | L4 + compose `FIELD_AUTHORIZING` | Journey/authorial modules | **Core** | Guardrail | Correct boundary when obeyed |
| R-25 | Table fidelity preserve | Copy full pipe tables and table-adjunct prose into named materials fields | `LD-TABLE-FIDELITY` role `design_page` embed | GAM table materials; ADR-07 | **Core** | **High** | Tables are high-loss surfaces |
| R-26 | Post-capture materials repair | PRISM-run overlay when captures thin materials | `page-gam-materials-preserve.js`; `design-page-materials-fidelity.js` | PRISM capture path; ADR-08 | **Secondary** | Guardrail | Not primary Copilot path |
| R-27 | Activity membership closure | Every upstream `activity_id` in `learning_activities.content` unless authorised omission | Compose `MEMBERSHIP_LINES`; `(U \ X) ⊆ C` | DLA activity set; `activities_omitted[]` | **Core** | Medium | Omission valve under size pressure |
| R-28 | DLA scaffold field preservation | Copy 15+ cognition/scaffold fields verbatim from upstream DLA | Compose `FIELD_PRESERVATION_LINES` | `learning_activities`; ADR-01, ADR-02 | **Core** | **High** | Includes preamble, cognition fields, bridge |
| R-29 | Core task field preservation | `learner_task`, `expected_output`, `support_note(s)` verbatim | Compose field preservation | DLA rows | **Core** | **High** | |
| R-30 | Anti-scaffold compression | Never compress scaffold fields to labels or arrow chains during compose | Compose; `LD-GUIDED-LEARNING-SCAFFOLD` `COMPOSE_LINES` | DLA upstream text | **Core** | **High** | |
| R-31 | Learning sequence order/timing | Use `learning_sequence` for activity order and timing only — not replanning | §13; compose membership | `learning_sequence` artefact | **Core** | Low | Organisation facet |
| R-32 | Sequencing/ranking metadata | Preserve `ordering.*`, `render_hints.*` on activity rows when present | Domain pack sequencing semantics | DLA ordering metadata | **Secondary** | None | Renderer policy |
| R-33 | Authorised activity omission | Record `activities_omitted[]` with `activity_id`, reason, authority | §13 output; compose membership | User subset requests | **Secondary** | **High** when used for size | Legitimate when authorised; leak path otherwise |
| R-34 | Post-capture activity closure repair | Restore omitted activities; strip unauthorised size omissions on PRISM run | `app.js` repair; closure tests | PRISM validation; ADR-08 | **Secondary** | Guardrail | Copilot path bypasses |
| R-35 | Journey upstream signal assimilation | Use LC, KM, LO, DLA, GAM, sequence signals for wrapper prose only | `LD-JOURNEY-ASSIMILATION` `UPSTREAM_SIGNAL_LINES` | Multiple upstream artefacts | **Secondary** | Medium | Must not mutate materials per module scope |
| R-36 | Inquiry arc framing | Express Question → Investigation → Evidence → Judgement in wrapper | Journey `CORE_LINES`, `OVERVIEW_PURPOSE_LINES` | Sprint 42–43 salience goals | **Secondary** | Medium | Editorial; competes with activity-centric assembly |
| R-37 | Overview section authoring | Author `overview` section — inquiry, stakes, journey arc | Journey + authorial + rhetoric | `learning_content`, LOs, sequence | **Secondary** | Medium | May front-load content that belongs in activities |
| R-38 | Learning purpose authoring | Author `learning_purpose` — capability development across resource | Journey + authorial | `learning_outcomes` | **Secondary** | Medium | Overlaps overview |
| R-39 | Knowledge summary authoring | Synthesise orienting summary from KM/LC into `knowledge_summary` section | Journey `KNOWLEDGE_SUMMARY_LINES` | `knowledge_model`, `learning_content` | **External Candidate** | **High** | Explicit re-summarisation; failure mode **A** |
| R-40 | Wrapper transition prose | Assimilate `transition_to_next` as 30–60 word conceptual continuity in wrapper | Journey + authorial + scaffold `TRANSITION_LINES` | `learning_sequence` | **Secondary** | Low | Duplicated across three modules |
| R-41 | Study tips / closure synthesis | Synthesise epistemic closure in `study_tips` from GAM consolidation/transfer signals | Journey `CLOSURE_LINES`; authorial; rhetoric | GAM consolidation materials | **Secondary** | **High** | May paraphrase instead of transport; mode **A**, **G** |
| R-42 | GAM reference in study tips | Reference GAM closure/transfer in study_tips while copying bodies in L4 | Journey `UPSTREAM_SIGNAL_LINES` | GAM materials | **Secondary** | **High** | Dual treatment of same content |
| R-43 | Authorial exposition — coherent experience | Compose coherent authored learning experience on wrapper sections | `LD-AUTHORIAL-EXPOSITION` `CORE_LINES` | Sprint 42 authorial quality | **External Candidate** | Medium | Overlaps journey + rhetoric |
| R-44 | Authorial role separation | Assign one rhetorical job per wrapper section (overview vs purpose vs tips) | `ROLE_SEPARATION_LINES` | Wrapper section schema | **External Candidate** | Low | Editorial discipline |
| R-45 | Authorial transition quality | Build intellectual momentum across page arc in wrapper | `TRANSITION_LINES` | Section ordering | **External Candidate** | Low | Overlaps R-40 |
| R-46 | Authorial preservation boundary | Authorial polish does not apply to activity rows or materials | `PRESERVATION_BOUNDARY_LINES` | L4 PREC-02 | **Core** | Guardrail | Critical guardrail for R-43 |
| R-47 | Anti-redundancy editing | Avoid repeating orientation across overview and learning_purpose | `ANTI_REDUNDANCY_LINES` | Multiple wrapper sections | **Secondary** | Low | Editorial |
| R-48 | Wrapper voice variants | Self-study vs workshop handout voice on wrapper prose | `VOICE_SELF_STUDY_LINES`, `VOICE_WORKSHOP_LINES` | `page_profile`; facilitated context gate | **Secondary** | Low | Gated by `shouldApplyLearnerPagePedagogicFramingScaffold` |
| R-49 | Self-directed rhetoric — wrapper shaping | Shape overview/purpose/knowledge_summary/study_tips from journey substance | `LD-SELF-DIRECTED-RHETORIC` role `design_page` | Journey assimilation (when appended) | **External Candidate** | Medium | Third wrapper layer; ADR-04 excludes from DLA only |
| R-50 | Rhetoric preservation boundary | L4 materials/table fidelity overrides rhetoric; no rewrite of preserved fields | Rhetoric `SHARED_LINES` | L4 modules | **Core** | Guardrail | |
| R-51 | Wrapper rhetoric substance | Progression vocabulary, epistemic closure bullets, difficulty framing | `WRAPPER_RHETORIC_LINES` | EQF; journey signals | **External Candidate** | Medium | Adds composition surface |
| R-52 | Scaffold compose preservation slice | Preserve scaffold fields; copy GAM worked_example Bridge and sample_output verbatim | `COMPOSE_LINES`; ADR-02 compose-only mode | DLA upstream; GAM bodies | **Core** | **High** | Correct compose behaviour post-S56 |
| R-53 | Scaffold transition rules (duplicate) | Transition rules repeated in guided-learning scaffold module | Scaffold `TRANSITION_LINES` | Same as journey R-40 | **Secondary** | Low | Duplication — governance debt |
| R-54 | DLA pre-emit gates on compose path | DLA word-range floors and PRE-EMIT gate text (if full block injected) | `DLA_PRE_EMIT_LINES` in scaffold module | ADR-02 mitigated via `composeOnly` | **External Candidate** | **High** if present | Remediation removed full block; verify no regression |
| R-55 | Visual affordance schema emission | Emit `visual_affordance_schema_version` 38.4, `visual_affordances[]`, `activities_visual_review[]` | Sprint 38 block; §13 output keys | Renderer VA consumer | **External Candidate** | Medium | Additive metadata — competes for tokens |
| R-56 | Visual decision specification | Per-affordance `visual_decision` generate/defer/reject with full enum schema | `buildSprint38VisualAffordanceDesignPagePromptBlock` | Upstream materials; activity rows | **External Candidate** | **High** | Heavy specification-writing |
| R-57 | Activities visual review | Per-activity `activity_visual_value` decision and rationale | Sprint 38 contract | Activity set | **External Candidate** | Low | |
| R-58 | Pedagogical added-value reasoning | Require `pedagogical_added_value` explaining figure adds beyond materials | Sprint 38 added-value lines | Materials content | **External Candidate** | Medium | Good intent; attention competition |
| R-59 | Visual affordance source_basis citations | Cite upstream paths in VA records (e.g. `A3 materials.scenarios`) | Sprint 38 examples | GAM/DLA field paths | **External Candidate** | **High** | Can substitute for embedded bodies; mode **G** |
| R-60 | VA post-capture validation | Validate and normalise VA records on PRISM capture | `sprint38-visual-affordances.js` | Page JSON schema | **Secondary** | None | Runtime only |
| R-61 | Top-level episode_plans transport | Copy `episode_plans[]` aligned to composed activity_ids when upstream DEP exists | Compose `EPISODE_PLAN_LINES` | `episode_plans` artefact; ADR wiring | **Core** | Low | Verbatim transport |
| R-62 | Per-activity episode_plan attachment | Attach `episode_plan` on each matching `learning_activities.content[]` row | Compose `EPISODE_PLAN_LINES` | DEP; activity id mapping | **Core** | Low | |
| R-63 | Episode beat verbatim copy | Copy archetype and beats verbatim; no replan or reorder | Compose `EPISODE_PLAN_LINES` | DEP output | **Core** | Low | Design belongs on DEP |
| R-64 | Episode plans excluded from section prose | Beat functions are renderer metadata — not dumped into `sections[].content` | Compose `EPISODE_PLAN_LINES` | Section assembly | **Core** | Low | Prevents beat leakage |
| R-65 | Episode plans input auto-binding | Auto-bind `episode_plans` when Design Episode Plan in workflow | `app.js` `ensureDesignPageUpstreamBindingsForSteps` | Workflow graph | **Secondary** | None | Wiring |
| R-66 | Assessment items transport | Emit `assessment_check.content.items[]` when `assessment_items` bound | §13; compose membership | `assessment_items` artefact | **Core** | Low | |
| R-67 | Assessment visibility flags | Respect `include_answers`, `include_marking_guidance`, `include_feedback_guidance` | §13 `userOptions`; `app.js` param patches | Assessment presentation intent | **Secondary** | Low | |
| R-68 | Assessment page profile | Preserve structured item schema when `page_profile: assessment` | §13 profile choice | Assessment workflows | **Secondary** | Medium | May bias toward items over activities |
| R-69 | Assessment param patching | Wire workflow assessment presentation into step params | `app.js` step param patch logic | Workflow brief factors | **Secondary** | None | |
| R-70 | Knowledge summary section slot | Include `knowledge_summary` section when LC/KM bound | §13 `promptTemplate` | `learning_content`, `knowledge_model` | **Secondary** | Medium | Slot vs content distinction |
| R-71 | Knowledge summary preview constraints | Avoid glossary dump; preview concepts for session | Authorial + journey knowledge lines | KM/LC | **External Candidate** | Medium | Editorial on summarisation task |
| R-72 | Anti-restate guard (knowledge vs materials) | Do not restate full activity materials in knowledge_summary | Journey knowledge lines | L4 archival split | **Core** | Guardrail | Acknowledges duplication risk |
| R-73 | Compose contract SSOT | `LD-DESIGN-PAGE-COMPOSE-CONTRACT` owns assembly rules at runtime | ADR-06; `buildLdDesignPageComposePromptBlock` | Pack §13 pointers; embedded L4 | **Core** | None | Orchestration |
| R-74 | EQF principles block | Inject Educational Quality Framework principles on Design Page emit | `app.js` bootstrap EQF | Shared L5 module | **External Candidate** | Medium | Abstract design pressure on assembly step |
| R-75 | Runtime augmentation ordering | Apply compose → journey → authorial → scaffold → rhetoric → VA → EQF in defined order | `app.js` `applyWorkflowStepRuntimePromptAugmentations` | All modules | **Core** | Low | Plumbing; order affects precedence perception |
| R-76 | PRISM material closure validation | Validate material closure on PRISM Design Page capture | `app.js` composition validation | Capture pipeline; ADR-08 | **Secondary** | Guardrail | Copilot bypasses |
| R-77 | Learner vs facilitator wrapper gating | Apply journey/authorial/scaffold only on learner-page profiles | `shouldApplyLearnerPagePedagogicFramingScaffold` | `page_profile`; brief context | **Secondary** | None | Scope control |
| R-78 | Tone style step param | Apply `tone_style` from brief to Design Page | Domain brief mappings | Workflow output spec | **External Candidate** | Medium | Style pressure on wrapper |
| R-79 | Depth level step param | Apply `depth_level` from brief | Domain brief mappings | Workflow output spec | **External Candidate** | Medium | May imply content depth changes |
| R-80 | Output density step param | Apply `output_density` / compactness preferences | Domain brief mappings | Workflow output spec | **External Candidate** | **High** | Direct brevity conflict with R-22 |
| R-81 | Include examples / practice tasks params | Toggle examples and practice task emphasis | Step params mappings | Brief factors | **Secondary** | Low | |
| R-82 | Intent-class design_page refinement | Elicit page profile, tone, depth during brief refinement | Domain `intentClasses.design_page` | Elicitation flow | **External Candidate** | None | Brief design, not compose |
| R-83 | Readable page assembly scope | Apply readable assembly to structure, headings, ordering, wrapper — not materials bodies | Pack; L4 preserve; compose | Multiple modules | **Core** | Medium | Wording historically blurred boundary; partially fixed by R-24 |
| R-84 | Facilitator profile content | Prioritise run guidance and facilitation/logistics for facilitator profile | §13 facilitator `promptInstruction` | Facilitator workflows | **Secondary** | Low | Different deliverable emphasis |
| R-85 | Support notes section | Emit `support_notes` section when applicable | §13 section ordering | Facilitator/support artefacts | **Secondary** | Low | |
| R-86 | Pre-emit materials validation (prompt) | Instruct model to fail before emit if materials condensed, referenced, or incomplete | L4 preserve PRE-EMIT lines; compose validation | All L4 invariants | **Core** | Guardrail | Prompt-level enforcement |

---

## Classification summary

| Classification | Count | % of total |
| -------------- | ----: | ---------: |
| **Core** | 44 | 51% |
| **Secondary** | 24 | 28% |
| **External Candidate** | 18 | 21% |
| **Total responsibilities** | **86** | 100% |

**Note:** Core count includes transport, organisation, guardrails, and SSOT orchestration. Guardrail responsibilities (e.g. R-24, R-46, R-50, R-86) are Core because their absence would allow transformation of learner content.

---

## 1. Core identity analysis

> If Design Page were reduced to its minimum viable architectural responsibility set, which responsibilities are unquestionably core?

**Minimum viable set (transport + organise + consume):**

| # | Responsibility IDs | Function |
| - | ------------------ | -------- |
| 1 | R-12, R-13, R-14, R-15, R-16 | Locate and consume upstream bodies; read-only compose |
| 2 | R-17 – R-25, R-86 | Embed full GAM material payloads with L4 invariants |
| 3 | R-27 – R-31, R-52 | Embed full DLA activity rows; sequence order only |
| 4 | R-61 – R-64, R-66 | Transport episode plans and assessment items verbatim |
| 5 | R-01, R-02, R-05, R-06, R-09, R-10 | Emit valid page JSON with membership and provenance |
| 6 | R-24, R-46, R-50, R-72 | Preservation boundaries between archival payloads and other fields |

**Unquestionably core — removing any of these means Design Page is no longer assembling a complete learner-facing page from upstream content.**

**Not in minimum viable set but commonly present today:** R-35–R-51 (wrapper authoring stack), R-55–R-59 (visual affordances), R-39/R-71 (knowledge summary authoring), R-74 (EQF), R-78–R-80 (brevity params), R-26/R-34/R-76 (PRISM repair — quality layer, not compose identity).

This is an **inventory conclusion**, not a redesign proposal.

---

## 2. Responsibility conflict analysis

### Overlaps (same concern, multiple owners)

| Overlap | Responsibility IDs | Observation |
| ------- | ------------------ | ----------- |
| Wrapper transitions | R-40, R-45, R-53 | Same transition guidance in journey, authorial, and scaffold modules |
| Overview / purpose authoring | R-37, R-38, R-43, R-49 | Four modules influence the same sections |
| Study tips / closure | R-41, R-43, R-49, R-51 | Journey, authorial, and rhetoric all synthesise closure |
| Materials fidelity teaching | R-17–R-23, R-83 | Pack, compose, and L4 embed repeat preservation rules (intentional SSOT + embed, but high prompt volume) |
| Knowledge in two places | R-39, R-70, R-71 | Section slot + authoring from KM/LC duplicates upstream LC/KM |

### Competitions (success criteria pull in opposite directions)

| Competition | IDs involved | Failure modes |
| ----------- | ------------ | ------------- |
| Complete payload vs readable page | R-22 vs R-80, R-83, R-37–R-38 | **A**, **D**, **G** |
| Archival materials vs wrapper synthesis | R-24 vs R-35–R-51 | **A**, **G** |
| Embed bodies vs cite paths | R-23 vs R-59 | **E**, **G** |
| Full enumeration vs token budget | R-20 vs R-80, R-08 | **C** |
| Membership vs page size | R-27 vs R-33, R-08 | **C**, activity drop |
| Transport vs author on same step | R-16 vs R-39, R-56 | **B**, **A** |
| Copilot context vs current message | R-12 vs model default behaviour | **F** |

### Transformation encouragement (responsibilities that invite change rather than copy)

| Mechanism | IDs | Typical transformation |
| --------- | --- | ---------------------- |
| Summarisation | R-39, R-41, R-80 | Shorter bodies; synopsis labels |
| Metadata substitution | R-19 (when violated), R-14 (when bypassed) | Purpose/type as payload |
| Specification writing | R-56, R-58 | VA records instead of material bodies |
| Reference placeholders | R-23 (when violated) | `"Full text from LO1-TEXT"` |
| Elision to wrapper | R-37, R-41, R-59 | Describe in overview; empty materials |
| Context denial | R-12, R-13 (when violated) | Rebuild from `required_materials` |

---

## 3. Responsibility concentration assessment

### Role breadth

Design Page has a **broad role**, not a narrow one. The 86 responsibilities span:

- 5 functional categories (transport, organise, author, present, workflow)
- 9+ prompt modules on the emit path
- 3 runtime repair validators (PRISM only)

The pipeline model assigns Design Page a single verb — **assemble** — but the emit path instructs the model to also **author**, **specify**, **optimise**, and **synthesise**.

### Cohesion

Responsibilities are **not cohesive** as a single step:

| Cohesive cluster | IDs | Internal consistency |
| ---------------- | --- | -------------------- |
| GAM → materials transport | R-17–R-25 | High — aligned purpose |
| DLA → row transport | R-27–R-30, R-52 | High |
| Page schema / membership | R-01, R-02, R-05, R-06, R-09, R-27 | High |
| Wrapper authoring stack | R-35–R-51 | Medium — overlapping modules |
| Visual affordance specification | R-55–R-59 | Medium — distinct from transport |
| Brevity / profile params | R-78–R-81 | Low cohesion with preservation cluster |

### Accumulation over time

Evidence of **accumulated responsibility** (not a single design decision):

| Era / sprint | Added responsibility | IDs (approx.) |
| ------------ | -------------------- | ------------- |
| Sprint 25 | Page composition contract | R-01, R-73 |
| Sprint 38 | Visual affordances on page | R-55–R-59 |
| Sprint 38B | L4 materials/table shared contracts | R-17–R-25 |
| Sprint 38S | Portable episode_plans on page | R-61–R-65 |
| Sprint 40 | EQF on emit path | R-74 |
| Sprint 41–42 | Journey + authorial wrapper quality | R-35–R-48 |
| Sprint 49+ | Self-directed rhetoric design_page role | R-49–R-51 |
| Sprint 55–56 | Scaffold compose slice; preservation patches | R-52, R-86 |
| Post-S56 investigation | Context access, final output, optimisation override invariants | R-13, R-22, R-23 |

Each addition addressed a **quality dimension** (salience, visuals, fidelity, portability). Cumulative effect: **competing mandates** on one LLM call.

---

## 4. Planning recommendations (Sprint 56A only)

These are **investigation and planning** recommendations — not implementation, prompt, or architecture actions.

| # | Recommendation | Rationale | Suggested backlog IDs |
| - | -------------- | --------- | --------------------- |
| 1 | **Deep-map wrapper stack overlap** | R-35–R-51 share sections; quantify duplicate instruction surface | A-02, R-01 in backlog |
| 2 | **Dependency-map visual affordances** | R-55–R-59 need renderer consumption audit before any relocation decision | D-01, OQ-13–16 |
| 3 | **Separate section slot from authoring for knowledge_summary** | R-70 vs R-39/R-71 conflated in practice | OQ-17–19 |
| 4 | **Trace brevity params to live prompt text** | R-78–R-80 conflict with R-22 — document where each appears in augmented prompt | R-04 in backlog |
| 5 | **Validate compose-only scaffold remediation** | R-54 external candidate — confirm ADR-02 fully effective in current `app.js` | C-05 |
| 6 | **Build failure-mode → responsibility traceability matrix** | Link each mode A–G to primary IDs for validation design | V-02 |
| 7 | **Inventory PRISM-only vs Copilot-only responsibilities** | R-26, R-34, R-60, R-76 may not protect Copilot path | M-04, V-03 |
| 8 | **Assess assessment profile interaction with materials** | R-68 vs R-17–R-25 — workflow matrix needed | OQ-06 |
| 9 | **Document augmented prompt module char budget per responsibility cluster** | Quantify concentration (journey + authorial + rhetoric + VA vs L4 embed) | V-06 |
| 10 | **Triage External Candidates without reassignment** | 18 candidates need evidence gather — not relocation decisions yet | Open questions register |

---

## Responsibilities with uncertain classification

| ID | Responsibility | Issue | Provisional class |
| -- | -------------- | ----- | ----------------- |
| R-03 | Page profile selection | Learner = Core; facilitator/assessment variants differ in preservation impact | **Core** (step); profiles split by workflow |
| R-08 | Generation notes | Essential for transparency vs misuse for excuses | **Secondary** with High risk |
| R-33 | Authorised activity omission | Legitimate workflow feature vs size-management leak | **Secondary** — context-dependent |
| R-54 | DLA pre-emit on compose | Should be absent post-ADR-02; verify runtime | **External Candidate** pending verification |
| R-70 | Knowledge summary section slot | Organisational (section exists) vs triggers authoring (R-39) | **Secondary** — slot only; paired with R-39 conflict |
| R-83 | Readable page assembly scope | Core when scoped to structure; risky when read as global optimise | **Core** with Medium risk — wording ambiguity |

---

## Document control

| Field | Value |
| ----- | ----- |
| Responsibility count | **86** |
| Matrix version | 1.0 |
| Next consumer | [SPRINT-56A-IMPLEMENTATION-PLAN.md](SPRINT-56A-IMPLEMENTATION-PLAN.md) §1 (when planning advances) |
| Related | [SPRINT-56A-BACKLOG.md](SPRINT-56A-BACKLOG.md) items R-01–R-05, A-01–A-06 |

**This document is descriptive. It does not prescribe prompt changes, code changes, responsibility relocation, or target-state architecture.**
