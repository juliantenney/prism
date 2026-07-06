# Design Page — Dependency Analysis

**Sprint:** 56A — Design Page Simplification Planning  
**Status:** Planning artefact — descriptive only  
**Date:** 2026-07-06  
**Architectural hypothesis:** [DESIGN-PAGE-TARGET-ARCHITECTURE-DERIVATION.md](DESIGN-PAGE-TARGET-ARCHITECTURE-DERIVATION.md)  
**Authoritative inventory:** [DESIGN-PAGE-RESPONSIBILITY-MATRIX.md](DESIGN-PAGE-RESPONSIBILITY-MATRIX.md) (R-01–R-86)

**Purpose:** Answer — *If Design Page is simplified toward its derived architectural identity, what dependencies must be understood before any change can safely occur?*

**This document does not redesign Design Page, assign owners, move responsibilities, create migration steps, or update implementation plans.**

---

## Executive summary

| Field | Value |
| ----- | ----- |
| **Clusters analysed** | **13** |
| **Highest-risk dependency areas** | Transport (GAM/DLA embed), Organisation (schema/membership), Wrapper content, Visual affordances, Validation/repair tiering |
| **Lowest-risk dependency areas** | Generation notes metadata, EQF on emit (External), Intent-class elicitation, Scaffold transition duplicates |
| **Dominant coupling types** | **Data** (upstream payloads), **Contractual** (page schema, composition contract), **Behavioural** (wrapper vs transport competition) |
| **Unresolved dependency questions** | **14** (see end) |
| **Confidence** | **High** on upstream/downstream transport chain · **Medium** on VA renderer consumption · **Medium** on Copilot vs PRISM path divergence |

---

## Phase 1 — Dependency inventory

Thirteen clusters derived from responsibility matrix groupings, target architecture layers, and Sprint 56/57 contract artefacts.

### Cluster summary table

| Cluster | Purpose | Inputs | Outputs | Internal dependencies | External dependencies |
| ------- | ------- | ------ | ------- | --------------------- | --------------------- |
| **C1 Upstream access** | Locate and consume prior-step bodies from workflow context | Copilot chat history (`STEP N OUTPUT:`); PRISM captures when in-app | Consumed upstream text routed to compose | R-15 routing depends on R-12; R-13 guards R-12 | Workflow `inputBindings`; `app.js` upstream section; compose `UPSTREAM_CONSUMPTION` |
| **C2 Transport — GAM** | Embed full GAM `Content:` bodies into `activity.materials.*` | `activity_materials` artefact; DLA `activity_id` set | Populated `materials` fields per activity row | R-17 fundamental; R-20, R-25 derived; R-18–R-22, R-86 guardrails/validation on R-17 | GAM pack/L4 `LD-MATERIALS-COPY` role `design_page`; `LD-TABLE-FIDELITY`; DLA `required_materials` (spec only) |
| **C3 Transport — DLA** | Copy activity rows and scaffold fields verbatim | `learning_activities` artefact | `learning_activities.content[]` row fields | R-28 fundamental; R-29, R-52 derived; R-30 guardrail on R-28 | DLA SSOT `LD-GUIDED-LEARNING-SCAFFOLD` (ADR-01); ADR-02 compose-only slice |
| **C4 Transport — conditional** | Verbatim copy of assessment items and episode plans when bound | `assessment_items`; `episode_plans` (DEP) | `assessment_check.content.items[]`; `episode_plans[]`; per-row `episode_plan` | R-61–R-63 derived facets; R-64 guardrail; R-66 fundamental when bound | DEP step; assessment step; `DESIGN-PAGE-EPISODE-PLANS-SCHEMA.md`; `app.js` episode binding |
| **C5 Organisation** | Page schema, membership, ordering, metadata without body transform | Upstream activity set; `learning_sequence`; workflow brief | `artifact_type: page`, `sections[]`, `title`, `audience`, `page_profile`, `source_artefacts` | R-01, R-27, R-02, R-31, R-05, R-03, R-06, R-09 | Pack §13 `defaultOutputStructure`; composition contract M1–P4; domain artefacts §18 |
| **C6 Wrapper content** | Author connective prose in wrapper sections | LC, KM, LO, DLA, GAM, sequence signals | `overview`, `learning_purpose`, `study_tips` section bodies | R-35–R-42 Secondary; R-43–R-51 External; R-46, R-50, R-72 guardrails vs transport | `LD-JOURNEY-ASSIMILATION`, `LD-AUTHORIAL-EXPOSITION`, `LD-SELF-DIRECTED-RHETORIC`; `shouldApplyLearnerPagePedagogicFramingScaffold` |
| **C7 Knowledge summaries** | Section slot and/or authored orienting summary | `knowledge_model`, `learning_content` | `knowledge_summary` section content | R-70 slot triggers R-39 authoring; R-71 editorial; R-72 guardrail vs materials | LC/KM upstream steps; journey `KNOWLEDGE_SUMMARY_LINES` |
| **C8 Visual affordances** | Emit renderer-oriented visual metadata on page | Activity rows; GAM materials; DLA context | `visual_affordances[]`, `activities_visual_review[]`, schema 38.4 | R-55–R-59 External; R-60 Secondary validation | Sprint 38 block `app.js`; `applySprint38VisualAffordancesToComposedPage`; renderer (metadata consumer) |
| **C9 Preservation guardrails** | Prevent wrapper/optimiser from mutating archival fields | Competing modules and params on emit path | Boundary rules in prompt (no separate artefact) | R-24, R-46, R-50, R-83, R-14, R-18–R-19, R-22, R-30, R-64, R-72 — all depend on existence of C6, C8, or brevity params | Secondary/External modules they bound |
| **C10 Validation & repair** | Enforce closure when LLM output drifts | Composed page JSON; upstream captures | Warnings in `generation_notes`; repaired fields; workflow advance gates | Prompt validation R-21, R-86; PRISM pipeline order (repair before validate) | `applyPageCompositionValidationForCapturedPage`; `page-gam-materials-preserve.js`; `page-activity-field-preserve.js`; ADR-08 |
| **C11 Profiles** | Deliverable variant selection and profile-specific section emphasis | `userOptions.page_profile`; workflow brief; step params | `page_profile` value; profile-shaped section content | R-03, R-68, R-84; gates C6 application (R-77) | Domain artefacts §18 profile rules; facilitator/assessment `promptInstruction` in §13 |
| **C12 Generation notes** | Transparency, omissions, composition warnings | Validator output; authorised omissions | `generation_notes`, `activities_omitted[]`, `composition_warnings` | R-08 Secondary; fed by C10 validators; interacts with R-33 omission | Capture validators append warnings; pack non-excuse rules |
| **C13 Workflow plumbing** | Deliver rules to model; wire bindings; enforce output format | Pack §13; compose contract; augmentation chain | Augmented prompt; strict JSON emit | R-73, R-75, R-10, R-65, R-69; compose block embeds C2–C5 rules | `applyWorkflowStepRuntimePromptAugmentations`; ADR-06; workflow spec; brevity params R-78–R-80 |
| **C14 Renderer-facing structures** | Shapes export/HTML consumption expects | Composed `page` JSON | `sections[]` authoritative body; optional top-level keys; VA metadata | Depends on C5 schema; C2–C4 payload completeness | Export contract 25-3; `renderer-export-behavior.md`; `utilityRenderPageSections`; catalog `renderHints.sectionOrder` |

**Note:** C14 is separated from C5 because downstream consumers treat `sections[]` and material field shapes as distinct contractual surfaces (composition contract §3.4; export contract §2.4).

---

## Phase 2 — Upstream dependencies

### Upstream ownership map

| Upstream component | Information required by Design Page | Owning stage | Matrix / contract anchors | Consumed by clusters |
| ------------------ | ----------------------------------- | ------------ | ------------------------- | -------------------- |
| **DLA** (`learning_activities`) | Activity membership set (`activity_id`); scaffold fields; `learner_task`, `expected_output`, cognition fields; `required_materials` specs | DLA specifies (ADR-01) | R-27, R-28–R-30, R-52; composition contract M1–M4 | C3, C5, C2 (row targets) |
| **GAM** (`activity_materials`) | Material `Content:` bodies; Material/Purpose metadata; tables | GAM realises (ADR-03) | R-17–R-25; pipeline reference | C2 |
| **DEP** (`episode_plans`) | Portable episode choreography; beats; archetype | DEP designs | R-61–R-64; episode plans schema | C4 |
| **Assessment** (`assessment_items`) | MCQ stems, options, marking/feedback fields | Assessment step | R-66–R-69 | C4, C11 (assessment profile) |
| **Learning sequence** (`learning_sequence`) | Order, timing, transitions — not membership authority | Sequence step / artefact | R-31; composition contract S1–S3 | C5 |
| **LC / KM** (`learning_content`, `knowledge_model`) | Concepts for wrapper or knowledge section | LC/KM steps | R-39, R-70, R-71; audit §L | C6, C7 |
| **Learning outcomes** (`learning_outcomes`) | LO framing for wrapper | LO step | R-37, R-38 | C6 |
| **Workflow brief** | Component quantities, exclusions, profile, tone/density params | Workflow layer | R-09, R-03, R-78–R-80 | C5, C11, C13 |
| **Copilot conversation** | Full prior `STEP N OUTPUT:` bodies | Workflow runtime (not a step) | R-12, R-13; failure mode F | C1 |
| **PRISM captures** | Same artefacts when re-run in-app | PRISM runner | ADR-08 repair path | C1, C10 |

### Upstream assumptions (documented)

| Assumption | Evidence | Risk if wrong |
| ---------- | -------- | ------------- |
| DLA activity set is **membership authority** | Composition contract priority 2; R-27 | Activity drops without traceable omission |
| GAM bodies are **complete** at handoff | Pipeline; GAM-PRES | Design Page cannot recover missing Content |
| `learning_sequence` does **not** reduce membership | Composition contract S2 | Sequence-driven activity drops |
| `required_materials` is **specification**, not payload | R-14; failure mode B,F | Reconstruction from spec alone |
| DEP owns beat **design**; Design Page copies only | R-63; episode schema | Replanning on compose |
| Chat history **is** upstream store in Copilot | R-13; failure mode F | False context denial |
| LC/KM may duplicate content already in activities | Audit §L; R-39 conflict | Second summarisation layer |

---

## Phase 3 — Downstream dependencies

| Consumer | Dependency on Design Page output | Criticality | Evidence |
| -------- | -------------------------------- | ----------- | -------- |
| **Utilities HTML export** | `page.sections[]` authoritative body; `learning_activities.content[]` with `materials.*`; assessment structure | **Critical** | Export contract 25-3 §2.4; `renderer-export-behavior.md` |
| **Renderer — material blocks** | Full prose in `materials` fields; pipe tables; math delimiters | **Critical** | Export path `renderLearningActivitiesBlocks`; failure modes A,D |
| **Renderer — assessment** | `assessment_check.content.items[]` with `stem`, `options`, visibility flags | **High** (when bound) | Workflow spec §Page Assembly; R-66–R-67 |
| **Renderer — section order** | Catalog `sectionOrder` labels; optional section omission | **Medium** | Domain artefacts §18 `renderHints` |
| **Capture validation suite** | Activity closure `(U \ X) ⊆ C`; materials closure vs GAM; episode plan alignment | **Critical** (PRISM path) | Validation audit §3.1; ADR-08 |
| **GAM materials preserve repair** | Thin/placeholder `materials` detectable vs upstream | **High** (PRISM compose) | `page-gam-materials-preserve.js`; validation audit §4 |
| **Activity field preserve** | DLA field thinness detectable | **High** (PRISM) | `page-activity-field-preserve.js` |
| **Episode plans preserve** | Missing portable `episode_plans[]` | **Medium** | `DESIGN-PAGE-EPISODE-PLANS-SCHEMA.md` §Backward compatibility |
| **Sprint 38 VA normalisation** | `visual_affordances[]` schema 38.4 shape | **Medium** (when VA present) | Validation audit §3.6 |
| **Workflow advance / capture sync** | Strict JSON parse; semantic closure warnings | **Critical** (PRISM workflow runs) | `validateStrictJsonWorkflowRunStepCapture` |
| **Workflow authoring docs** | Page assembly guardrails for bundle authors | **Low** (guidance) | `workflow-authoring.md` Design Page section |
| **Audit / test fixtures** | Material fidelity, compose contract, closure tests | **Medium** (regression) | Pipeline reference quick test map |
| **Sprint 57 product layer** | Beat-first HTML presentation on page structure | **Medium** (presentation, not generation) | Pipeline reference §Product layer |
| **Future VA / figure consumers** | `episode_plans`, `source_basis`, `visual_decision` | **Uncertain** | OQ-13, OQ-14; audit §I |

### Copilot vs PRISM downstream split

| Path | Validators run? | Repair runs? | Criticality of prompt-only transport |
| ---- | --------------- | ------------ | ------------------------------------ |
| **Copilot multi-step** | **No** capture validators on emit | **No** compose pipeline repair | **Critical** — C2/C3 must succeed in LLM output alone |
| **PRISM workflow run** | **Yes** — closure suite | **Yes** — materials/episode overlay | **High** — repair masks some transport failures |

**Evidence:** Validation audit §2 (no executable PRE-EMIT on Copilot); matrix R-26, R-34, R-76 as Secondary PRISM-only.

---

## Phase 4 — Architectural coupling assessment

| Cluster | Coupling strength | Coupling type(s) | Rationale |
| ------- | ----------------- | ---------------- | --------- |
| **C1 Upstream access** | **High** | Operational, Behavioural | All clusters depend on successful consumption; Copilot path has no repair backstop |
| **C2 Transport — GAM** | **High** | Data, Contractual | Export and validators assume embedded bodies; composition contract A1–A3 |
| **C3 Transport — DLA** | **High** | Data, Contractual | Membership + row fields are renderer inputs; ADR-02 ties compose to upstream |
| **C4 Transport — conditional** | **Medium** | Data, Structural | Required only when bindings exist; episode schema dual-carry |
| **C5 Organisation** | **High** | Structural, Contractual | `sections[]` authority for export; profile affects section set |
| **C6 Wrapper content** | **High** | Behavioural | Competes with C2/C3 for model attention; failure modes A,G |
| **C7 Knowledge summaries** | **High** | Behavioural, Data | Re-authors LC/KM; overlaps activity content (audit §L) |
| **C8 Visual affordances** | **Medium–High** | Structural, Behavioural | Schema coupled to compose pipeline step 4; `source_basis` vs embed conflict |
| **C9 Preservation guardrails** | **Medium** | Contractual, Behavioural | Coupled to C6/C8 existence — not independent architecture |
| **C10 Validation & repair** | **High** | Operational, Data | Assumes upstream captures available; tiered with prompt (validation audit §7) |
| **C11 Profiles** | **Medium** | Contractual, Behavioural | Changes section emphasis and wrapper gating; assessment profile thins activities (R-68) |
| **C12 Generation notes** | **Low–Medium** | Operational | Downstream transparency; misuse couples to R-33 omission valve |
| **C13 Workflow plumbing** | **High** | Operational, Contractual | Augmentation order affects effective precedence (R-75); ADR-06 SSOT |
| **C14 Renderer-facing structures** | **High** | Contractual | Frozen export contract; changing field shapes breaks HTML path |

---

## Phase 5 — Simplification sensitivity analysis

*Assessment only — no recommended actions.*

| Cluster | Sensitivity | Dependencies affected if simplified/reviewed/relocated/reduced | Why |
| ------- | ----------- | -------------------------------------------------------------- | --- |
| **C1 Upstream access** | **High** | All transport clusters; failure mode F | Without access, every downstream cluster receives fabricated input |
| **C2 Transport — GAM** | **High** | Export, validators, learner deliverable, failure modes B,C,D,E,G | Core derived identity; export renders `materials.*` directly |
| **C3 Transport — DLA** | **High** | Export, activity closure, failure modes A (scaffold compression) | Row fields are learner task framing |
| **C4 Transport — conditional** | **Medium** | DEP consumers, beat-material validator, assessment renderer | Binding-dependent; omission may be valid when unbound |
| **C5 Organisation** | **High** | Export section authority, workflow constraints, profile contracts | Schema change ripples to export contract and catalog |
| **C6 Wrapper content** | **High** | C9 guardrails, failure modes A,G, Sprint 57 UX expectations | Triple-stack overlap; product value not fully evidenced (OQ-02) |
| **C7 Knowledge summaries** | **High** | C6 overlap, R-72 guardrail, LC/KM upstream, failure mode A | Structural conflict when authoring retained |
| **C8 Visual affordances** | **High** | Compose pipeline step 4, Sprint 38 tests, future figure consumers | Schema + prompt + code triple coupling |
| **C9 Preservation guardrails** | **Medium** | C6, C8, brevity params — guardrails shrink if risks removed | Guardrails are derivatives; sensitivity is indirect |
| **C10 Validation & repair** | **Medium–High** | PRISM workflow advance; false confidence on Copilot path | Changing prompt without aligning validators changes observed quality |
| **C11 Profiles** | **Medium** | C6 gating, assessment vs learner workflows, domain artefacts §18 | Profile removal affects facilitator/assessment deliverables |
| **C12 Generation notes** | **Low** | Transparency, omission audit trail | Does not define learner content; misuse risk via R-08 |
| **C13 Workflow plumbing** | **Medium** | All prompt-delivered rules; augmentation order | Changing plumbing affects all clusters' effective instructions |
| **C14 Renderer-facing structures** | **High** | Export, Sprint 16/25 contracts, utility tests | Structural contract frozen for renderer-only work |

---

## Phase 6 — Risk concentration map

### Most isolated clusters

| Cluster | Isolation evidence |
| ------- | ------------------ |
| **C12 Generation notes** | Transparency metadata; validators write to it; not read by export for body content |
| **C13 — EQF slice** (R-74 External within plumbing) | Upstream-only per ADR-05 rationale; abstract pressure, not structural |
| **R-53 Scaffold transition duplicate** | Duplicates journey R-40; no unique downstream consumer |

### Most connected clusters

| Cluster | Connection evidence |
| ------- | ------------------- |
| **C2 + C3 + C5** | Composition contract chain; single page JSON; export single path |
| **C6 + C7 + C9** | Wrapper authoring creates guardrail dependency chain (Cluster F, core reduction) |
| **C2 + C10** | Materials prompt + validation + GAM preserve — four-layer tiering (validation audit §7) |
| **C5 + C14** | Schema emission immediately consumed by export authority rules |

### Highest-risk clusters (dependency + fidelity)

| Cluster | Risk evidence |
| ------- | ------------- |
| **C2 Transport — GAM** | Failure modes B,C,D,E,G; highest prompt fragmentation (9 Core IDs); Copilot no repair |
| **C6 Wrapper content** | Failure modes A,G; triple module overlap; competes with C2 |
| **C1 Upstream access** | Failure mode F; Copilot-specific; no validator backstop |
| **C8 Visual affordances** | `source_basis` substitution; token competition; compose pipeline hard-wired |

### Lowest-risk clusters (for dependency review scope)

| Cluster | Evidence |
| ------- | -------- |
| **C12 Generation notes** | Low sensitivity; Secondary classification |
| **Intent-class elicitation** (R-82 External) | Brief design only; not on compose emit |
| **R-81 include_examples param** | Secondary; low preservation risk per matrix |

### Areas with unclear ownership

| Area | Uncertainty | Evidence |
| ---- | ----------- | -------- |
| **Study tips / closure content** | Transport from GAM consolidation vs wrapper synthesis | OQ-10; R-41 vs GAM materials |
| **Knowledge summary content** | LC/KM transport vs Design Page author vs omit | OQ-17; R-70 vs R-39 |
| **VA specification** | Design Page vs separate step vs renderer inference | OQ-13, OQ-14; Sprint 57 state lists DP owner |
| **Readable assembly scope** | Structure delimiter vs global optimise licence | R-83 ambiguous; failure mode A |
| **Episode plans mandatory?** | Portable schema when DEP exists | OQ-05; conditional fundamental |

### Circular / reflexive dependency patterns

| Pattern | Description | Evidence |
| ------- | ----------- | -------- |
| **Guardrail ↔ Wrapper** | Guardrails (C9) exist because wrapper (C6) creates risk; wrapper quality goals assume guardrails hold | Core reduction Cluster F; matrix R-46/R-50 for R-43/R-49 |
| **Validation ↔ Transport failure** | R-21/R-86 validate what R-17 should produce; validators added because transport fails under competition | Core reduction Phase 5; validation audit materials tiering |
| **Repair ↔ Prompt gap** | GAM preserve compensates for Copilot/prompt transport failure — masks dependency on C2 | ADR-08; C-01 contract conflict audit |
| **Knowledge slot ↔ Knowledge author** | R-70 section slot triggers R-39 authoring when KM/LC bound | Matrix uncertain classification R-70 |
| **VA cite ↔ Material embed** | R-59 `source_basis` satisfies “referenced material” without R-17 embed | Matrix competition R-23 vs R-59; failure mode G |

---

## Phase 7 — Dependency graph summary

Readable chain per cluster (hypothesis-aligned).

```
C1 Upstream access
↓ Depends on: Workflow bindings, Copilot history / PRISM captures
↓ Consumed by: C2, C3, C4, C5 (all transport and organise)
↓ Risk: HIGH

C2 Transport — GAM
↓ Depends on: C1, DLA activity_ids, GAM activity_materials, L4 preserve embed
↓ Consumed by: Export renderer, materials closure validator, GAM preserve repair
↓ Risk: HIGH

C3 Transport — DLA
↓ Depends on: C1, learning_activities upstream, ADR-01/02
↓ Consumed by: Export renderer, activity closure validator, field preserve
↓ Risk: HIGH

C4 Transport — conditional
↓ Depends on: C1, C5 membership alignment, DEP / assessment bindings
↓ Consumed by: Assessment renderer, episode validators, portable schema consumers
↓ Risk: MEDIUM

C5 Organisation
↓ Depends on: C1, learning_sequence, workflow brief, domain artefacts §18
↓ Consumed by: C14 export authority, profile contracts, capture normalisation
↓ Risk: HIGH

C6 Wrapper content
↓ Depends on: C1 signals, C11 profile gating, journey/authorial/rhetoric modules
↓ Consumed by: Export (wrapper sections only), learner UX — competes with C2/C3
↓ Risk: HIGH

C7 Knowledge summaries
↓ Depends on: LC/KM upstream, C6 journey module, C5 section slot R-70
↓ Consumed by: Export knowledge_summary section; overlaps C2 materially
↓ Risk: HIGH

C8 Visual affordances
↓ Depends on: C2/C3 row content, Sprint 38 schema, compose pipeline
↓ Consumed by: VA normalisation, future figure pipeline — not export HTML body
↓ Risk: HIGH

C9 Preservation guardrails
↓ Depends on: C6, C8, brevity params (R-78–R-80), L4 archival split
↓ Consumed by: Prompt precedence only — no separate artefact
↓ Risk: MEDIUM

C10 Validation & repair
↓ Depends on: Upstream captures, composed page from C1–C8, composition pipeline order
↓ Consumed by: Workflow capture sync, utilities preview, generation_notes (C12)
↓ Risk: MEDIUM–HIGH (PRISM); N/A (Copilot emit)

C11 Profiles
↓ Depends on: Workflow brief, §13 userOptions, intent elicitation
↓ Consumed by: C5 section emphasis, C6 gating, assessment presentation
↓ Risk: MEDIUM

C12 Generation notes
↓ Depends on: C10 validators, authorised omissions R-33, compose membership
↓ Consumed by: Audit transparency, workflow reviewers — not export body
↓ Risk: LOW

C13 Workflow plumbing
↓ Depends on: Pack §13, compose contract ADR-06, app.js augmentation chain
↓ Consumed by: All prompt-delivered clusters C1–C9
↓ Risk: MEDIUM

C14 Renderer-facing structures
↓ Depends on: C5 schema, C2–C4 payload completeness
↓ Consumed by: Utilities export, renderer-export-behavior, workflow spec compatibility
↓ Risk: HIGH
```

---

## Phase 8 — Planning conclusions

### Areas safe to analyse independently

| Area | Rationale |
| ---- | --------- |
| **C12 Generation notes** | Low downstream structural coupling; transparency semantics |
| **R-82 Intent-class elicitation** | Upstream of compose; no page JSON dependency |
| **R-53 / R-40 transition duplication** | Governance debt only; no unique consumer |
| **EQF on Design Page emit (R-74)** | External Candidate; ADR-05 already excludes PEL; EQF disputed for DP |
| **Facilitator wrapper gating (R-77)** | Scope control — analyse against profile matrix without touching transport |

### Areas requiring coordinated review

| Area | Coordinating dependencies |
| ---- | ------------------------- |
| **C2 + C10** | Prompt transport rules, L4 embed, validators, GAM preserve — four-layer tier |
| **C6 + C7 + C9** | Wrapper stack, knowledge summary, preservation boundaries — shared failure modes A,G |
| **C5 + C14 + export contract** | Schema, `sections[]` authority, catalog `sectionOrder` — frozen renderer contract |
| **C8 + compose pipeline** | Sprint 38 prompt, `applySprint38VisualAffordancesToComposedPage`, schema 38.4 |
| **C11 + C6** | Profile drives wrapper application and assessment thinning (R-68 vs R-17) |
| **Copilot path vs PRISM path** | C10 absent on Copilot — coordinated understanding of what repair masks |

### Areas that must be understood before migration planning

| Area | Why blocking |
| ---- | ------------ |
| **C2 GAM transport** | Derived identity core; highest failure concentration; export critical path |
| **C1 Upstream access** | Copilot has no repair; context model is architectural prerequisite |
| **C5/C14 page schema** | Export contract 25-3 and composition contract 25-2 are normative |
| **C6 wrapper scope decision** | OQ-02 unresolved — bounds all guardrail and failure-mode work |
| **C8 VA placement** | OQ-13–16; compose pipeline step order dependency |
| **Dual-path strategy** | OQ-24; ADR-08 repair assumptions vs Copilot primary path |
| **Acceptance fixtures** | OQ-25–27; validators assume upstream capture shape |

### Areas where dependency uncertainty remains high

| Area | Open dependency question |
| ---- | ------------------------ |
| **VA downstream consumers** | Does renderer or a future step require VA on page JSON? (OQ-13, OQ-14) |
| **Episode plans mandatory** | Renderer reads metadata only today — future beat-driven HTML? (OQ-05; episode schema doc) |
| **Knowledge summary source of truth** | LC/KM vs activities-only page (OQ-17–19) |
| **Study tips ownership** | GAM consolidation transport vs wrapper synthesis (OQ-10) |
| **Assessment profile vs materials** | R-68 interaction with full GAM embed (OQ-06) |
| **Brevity params injection point** | R-78–R-80 trace to live augmented prompt (backlog R-04) |
| **R-83 boundary** | Guardrail effectiveness under readable assembly wording |

---

## Unresolved dependency questions

| ID | Question | Clusters affected |
| -- | -------- | ----------------- |
| OQ-01 | Minimum valid page — which clusters are mandatory? | All |
| OQ-02 | Author vs organise only | C6, C7, C9 |
| OQ-05 | Episode plans mandatory when DEP bound? | C4 |
| OQ-06 | Assessment profile vs activity materials | C4, C11, C2 |
| OQ-09 | Wrapper stack merge | C6, C9 |
| OQ-10 | Study tips ownership | C6, C2 |
| OQ-13 | VA on Design Page at all? | C8, C10 |
| OQ-14 | VA relocation target | C8, C13 pipeline |
| OQ-17 | Knowledge summary policy | C7, C6 |
| OQ-20 | Migration sequencing (planning consumer only) | Cross-cluster |
| OQ-24 | PRISM repair as backstop | C10 vs C1/C2 Copilot |
| OQ-25 | Canonical acceptance fixtures | C2, C3, C10 |
| **DQ-01** | Does any production renderer **require** `visual_affordances[]` for correct HTML? | C8, C14 |
| **DQ-02** | Are composition contract 25-2 rules fully encoded in compose contract ADR-06, or split across pack? | C5, C13 |

---

## Confidence assessment

| Conclusion | Confidence | Basis |
| ---------- | ---------- | ----- |
| Upstream ownership map (DLA/GAM/DEP) | **High** | Sprint 57 pipeline, ADRs, composition contract |
| Downstream export dependency on `sections[]` + `materials.*` | **High** | Export contract 25-3; renderer-export-behavior |
| Copilot vs PRISM validation split | **High** | Validation audit; matrix Secondary PRISM-only IDs |
| Wrapper ↔ transport competition | **High** | Failure modes; matrix competition table |
| VA downstream criticality | **Medium** | Renderer doc says metadata not HTML body; future consumers uncertain |
| Simplification sensitivity rankings | **Medium** | Logical from evidence; not validated by dependency graph tooling |
| Circular guardrail patterns | **High** | Core reduction Cluster F; validation audit §7 |

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `DESIGN-PAGE-DEPENDENCY-ANALYSIS.md` |
| Clusters analysed | **13** (C1–C14; C14 renderer-facing distinct from C5) |
| Contract artefacts referenced | Compose contract (`lib/ld-design-page-compose-contract.js`), composition contract 25-2, export contract 25-3, episode plans schema, validation audit, domain artefacts §18, renderer-export-behavior |
| Next consumer | Migration planning (when authorised); open questions OQ-05, OQ-13, OQ-17, OQ-24 |
| Does not | Redesign · assign owners · move responsibilities · migration steps · implementation plan updates |

**Descriptive only. Objective: understand the dependency landscape before deciding how architectural simplification could occur.**
