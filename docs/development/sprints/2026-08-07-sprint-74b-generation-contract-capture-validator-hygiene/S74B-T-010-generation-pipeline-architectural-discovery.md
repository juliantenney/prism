# S74B-T-010 — Generation Pipeline Architectural Discovery

**Sprint:** 74B — Generation-contract & capture-validator hygiene  
**Task:** S74B-T-010  
**Status:** **Done** (2026-08-07)  
**Mode:** Evidence-only architectural discovery — **no runtime changes**  
**Authority:** [SPRINT-74B-CHARTER.md](SPRINT-74B-CHARTER.md) · [S74-T-010 Domain B](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-010-rationalisation-domain-refinement.md#domain-b--generation-contract--capture-validator-hygiene-recommended-sprint-74b) · [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)  
**Source revision:** `c32408e9b2d8f83d5807b75a3908d5f15546eac6`  
**Evidence time (UTC):** 2026-08-07T07:57:13Z  
**Evidence class:** Repository / browser-runtime source tracing (Node tests = supporting only)

---

## 1. Executive summary

Prism’s path from an initial workflow brief to a complete page artefact ready for the (already rationalised) learner renderer is **not** a single “generation” subsystem. It is a **browser product spine** with distinct phases, owners, and persistence boundaries.

**Authoritative product spine (pre-renderer):**

```text
Create Workflow (brief → elicitation → design LLM → save)
  → My Workflows Run (prompt assemble → external Copilot → capture → validate → progress)
  → Authoring Assemble (partials → complete page)
  → Authoring Preview / export hand-off → runLearnerRendererVNextExport  ← STOP
```

**Key architectural facts:**

1. **LLM page content is not generated inside Prism’s runtime for the Run path.** Prism builds **prompts**, the user copies them to an external model, pastes **captures** back, and Prism **validates / normalises / assembles**.
2. **True in-app LLM generation** occurs mainly during **Create Workflow** design (`callOpenAIForWorkflowDesign` / brief interpretation).
3. The word **“generation”** in the repository covers **multiple responsibilities** (workflow design, prompt text, contracts, capture intake, page assembly). Treating it as one owner is architecturally false.
4. **Duplicate ownership risk** is real: prompt text vs injection orchestration; compose vs partial contracts; dual capture maps; four live `{ ok: true, legacy: true }` always-pass validators; deprecated PR-W\* aliases still exported on the test API.
5. The operator’s three-area hypothesis is **directionally useful** but must be **split** into more phases; Candidate B and C especially hide multiple ownership boundaries.

**This report is the architectural baseline for the remainder of Sprint 74B.** Removals and consolidation remain **out of scope** for T-010.

---

## 2. Governing question (answered)

> What are the stable architectural phases from an initial workflow brief through to the point where a complete page artefact is handed to the learner renderer?

**Answer:** Twelve stable phases are evidenced on the normal Learning Design browser path (see §4–§5). The renderer itself is out of scope; the hand-off is `runUtilityPageExportPipeline` → `runLearnerRendererVNextExport(page)`.

---

## 3. Evidence provenance

| Item | Value |
| ---- | ----- |
| Method | Static call-path tracing of production browser sources (`index.html` script order, `app.js`, `workflowGenerationContext.js`, `lib/*`) |
| Production path authority | Static `index.html` deployment; browser-only runtime |
| Node-based tests | Supporting only (e.g. `page-vnext-assemble.test.js`, partial-capture validators) |
| Not used as current proof | Historical sprint HTML exports, stale fixtures as behavioural baseline, filename/`@deprecated` labels alone |
| Disciplines applied | Ownership before change; inventory before removal; distinguish orchestration vs transformation vs validation vs persistence vs presentation |

---

## 4. End-to-end pipeline diagram

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  PHASE 1–3  Create Workflow                                              │
│  brief fields → brief resolve / elicitation → pack context               │
│  → OpenAI workflow design → normalize / seed steps → localStorage wf     │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │ workflow definition
                                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  PHASE 4–5  My Workflows · Run                                           │
│  restore runstate → build step prompt (seed + contracts + envelope)      │
│  → user Copy → external Copilot (OUTSIDE Prism) → Paste capture          │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │ capture JSON (+ raw)
                                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  PHASE 6–9  Capture pipeline                                             │
│  sanitize → stage repair / normalize → validate (strict or legacy shim)  │
│  → persist runstate → gate Next / stage progression                      │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │ stage partials in runstate
                                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  PHASE 10–11  Authoring                                                  │
│  Assemble: resolvePageForRenderOrAssembly → assembleVNextPageFromPartials│
│  → composition validation → complete page JSON in Authoring input        │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │ artifact_type:"page" schema 2.0.0
                                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  PHASE 12  Hand-off (boundary)                                           │
│  runUtilityPageExportPipeline → runLearnerRendererVNextExport(page)      │
│  → PRISM_LEARNER_RENDERER_VNEXT.renderLearnerPageHtml  ★ STOP            │
└──────────────────────────────────────────────────────────────────────────┘
```

**Parallel / adjacent surfaces (not the Learning Design page spine, but share some builders):**

- Prompt Studio / Prompt Library (`library.js`, IndexedDB) — prompt assets; not workflow runstate.
- Workflow Resources (`lib/prism-workflow-resources.js`) — durable media; Sprint 73 owner.
- Visual planning / jobs — derived Authoring assets; not brief→page ownership for 74B.

---

## 5. Phase diagram (discovered)

| # | Phase | Stable? | Primary UI | Kind |
| - | ----- | ------- | ---------- | ---- |
| P1 | Initial workflow brief | Yes | Create Workflow form | Presentation → brief object |
| P2 | Brief resolution & elicitation | Yes | Elicitation chat / resolved brief panel | Transformation + orchestration |
| P3 | Domain-pack participation & workflow design generation | Yes | Design start / save | Pack load + **in-app LLM** + seeding |
| P4 | Workflow persistence | Yes | Save designed workflow | Persistence |
| P5 | Run preparation & prompt construction | Yes | My Workflows · Run · Copy | Transformation + orchestration |
| P6 | User copy/run interaction (external LLM) | Yes | Clipboard / Copilot | **User boundary** (outside Prism) |
| P7 | Returned capture ingestion | Yes | `[data-field=runStepOutput]` | Presentation → capture |
| P8 | Capture sanitisation, recovery, normalisation | Yes | on paste (sync) | Transformation |
| P9 | Capture validation | Yes | on paste (sync) | Validation |
| P10 | Runstate persistence & stage progression | Yes | Next/Prev; localStorage runstate | Persistence + orchestration |
| P11 | Page enrichment / progressive assembly | Yes | Authoring Assemble (+ Preview re-assemble) | Transformation |
| P12 | Hand-off to learner renderer | Yes | Authoring Preview / export | Orchestration → **boundary** |

**Additional phase found (not in the original 17-item checklist as a named owner):**

| # | Phase | Rationale |
| - | ----- | --------- |
| P5a | **Contract injection** (subset of P5) | Distinct owner set (`lib/ld-*-contract.js`) from prompt envelope (`buildWorkflowStepInstructions`) — should not be collapsed into “prompt construction” alone |
| P11a | **Post-assembly composition validation** | `applyPageCompositionValidationForUtilitiesPage` before hand-off — validation of assembled page, not capture-time validation |

---

## 6. Per-transformation ownership records

Calling a function is **not** owning the responsibility. Below: orchestration vs transformation vs validation vs persistence vs presentation.

### P1 — Initial workflow brief

| Field | Evidence |
| ----- | -------- |
| Inputs | Form DOM (`#wfDesignName`, intent, audience, scale, domain, …) |
| Outputs | Brief base object (`buildWorkflowDesignBase`) |
| Authoritative owner | Create Workflow UI + `handleStartWorkflowDesign` (orchestration) |
| Orchestrator | `app.js:handleStartWorkflowDesign` |
| Validator | Form/domain policy (general-only blocked for generation) |
| Contract/schema | Brief field conventions + domain brief config |
| Persistence | Session state until save |
| User interaction | Create Workflow tab |
| Browser runtime owner | `app.js` |
| Next consumer | P2 brief resolve / elicitation |

### P2 — Brief resolution & elicitation

| Field | Evidence |
| ----- | -------- |
| Inputs | Brief base + domain brief config |
| Outputs | `state.workflowBriefResolved`, elicitation dialogue, mapped bindings |
| Authoritative owner | Brief resolution rules in `app.js` + config from packs |
| Orchestrator | `handleStartWorkflowDesign` / `handleWorkflowAnswer` |
| Transformation | `extractWorkflowBriefExplicitFactors`, `applyWorkflowBriefInferenceRules`, `resolveWorkflowBriefFactors`, `applyWorkflowBriefMappings` |
| Optional LLM | `callOpenAIForWorkflowIntentInterpretation` |
| Pack participation | `workflowGenerationContext.js:getWorkflowBriefConfig` |
| Persistence | Session; later `workflow.workflowBriefResolution` on save |
| Next consumer | P3 design generation |

### P3 — Domain-pack participation & workflow design generation

| Field | Evidence |
| ----- | -------- |
| Inputs | Resolved brief + selected domains |
| Outputs | Design JSON (`steps[]`) → seeded workflow steps |
| Authoritative owner (pack text) | Domain packs via `WorkflowGenerationContext` |
| Authoritative owner (design LLM call) | `continueWorkflowDesignGeneration` / `callOpenAIForWorkflowDesign` |
| Transformation | `buildWorkflowGenerationContext`, `getStepPatternCatalog`, `buildSeededStepPromptForWorkflowStep` |
| Migration | `normalizeWorkflowForV1`, `migrateWorkflowToSprint58PageArtefactContract` |
| Flags set on save | `workflowOutputSpec.pageEnrichmentV2` / `partialPageOutputs` (current default path) |
| Next consumer | P4 persistence |

### P4 — Workflow persistence

| Field | Evidence |
| ----- | -------- |
| Inputs | Designed workflow object |
| Outputs | `localStorage` key `promptr.workflows.v1` |
| Authoritative owner | `loadWorkflows` / `saveWorkflows` in `app.js` |
| Kind | Persistence |
| Not owner | Prompt Library IndexedDB (`library.js`) |
| Next consumer | P5 run / Edit |

### P5 — Run preparation & prompt construction (+ P5a contracts)

| Field | Evidence |
| ----- | -------- |
| Inputs | Workflow step + runstate + option map |
| Outputs | Clipboard-ready prompt text |
| Authoritative owner (seed body) | `step.override_prompt_body` / `resolveLiveCatalogStepPromptBody` / pack `promptFactory` |
| Authoritative owner (contract text) | `lib/ld-*-contract.js` and related LD modules |
| Orchestrator (injection) | `applyWorkflowStepRuntimePromptAugmentations` |
| Orchestrator (envelope) | `buildWorkflowStepInstructions` |
| Presentation | Copy button → `Utils.copyText` |
| Mutual gating | Compose contract **no-ops** when `partialPageOutputs`; partial contract **no-ops** when partial disabled |
| Next consumer | P6 external LLM |

### P6 — User copy/run interaction

| Field | Evidence |
| ----- | -------- |
| Owner | **User + external model** (outside Prism runtime) |
| Prism role | Presentation of prompt only |
| Next consumer | P7 paste |

### P7 — Returned capture ingestion

| Field | Evidence |
| ----- | -------- |
| Inputs | Pasted text in `[data-field=runStepOutput]` |
| Outputs | Triggers sync pipeline |
| Orchestrator | `syncWorkflowRunCapturedOutputToState` |
| Next consumer | P8 |

### P8 — Sanitisation / recovery / normalisation

| Field | Evidence |
| ----- | -------- |
| Inputs | Raw pasted text |
| Outputs | Sanitized / repaired JSON text (and dual maps) |
| Transformation | `sanitizePrismRunCapturedOutput`, stage repairs, `lib/workflow-page-capture-normalize.js`, DLA/GAM enrich helpers when used for repair |
| Dual maps | `workflowRunCapturedOutputs` vs `workflowRunCapturedOutputsRaw` — assembly prefers **raw** (`preferRaw: true`) |
| Next consumer | P9 |

### P9 — Capture validation

| Field | Evidence |
| ----- | -------- |
| Orchestrator | `validateStrictJsonWorkflowRunStepCapture` / `validatePartialPageCaptureForStep` / `validate*OrPageCapture` |
| Authoritative modern validators | Stage libs / in-app partial validators |
| Legacy shims (live) | Four always-pass `{ ok: true, legacy: true }` paths (see §12) |
| Next consumer | P10 |

### P10 — Runstate persistence & stage progression

| Field | Evidence |
| ----- | -------- |
| Persistence | `promptr.workflows.runstate.v1` via `persistWorkflowRunStateForWorkflow` |
| Progression | Next gated by `isWorkflowRunStepCaptureReadyForAdvance` |
| Next consumer | P11 when enough stage captures exist |

### P11 — Page assembly (+ P11a composition validation)

| Field | Evidence |
| ----- | -------- |
| Orchestrator | `resolvePageForRenderOrAssembly` (`app.js`) |
| Authoritative transformation | `lib/page-vnext-assemble.js:assembleVNextPageFromPartials` (`PRISM_PAGE_VNEXT_ASSEMBLE`) |
| Stage order | `episode_plan` → `dla` → `gam` → `learning_sequence` → `assessment_design` → `assessment_items` → `design_page` |
| Short-circuit | If seed already passes `validateAssembledPageForRender`, assemble skipped (identity attach only) |
| Non-partial mode | Attach identity only when `partialPageOutputs` disabled |
| UI entry | `handleUtilitiesAssembleFromCurrentWorkflowRun`; also re-run on Preview unless `skipWorkflowAssembly` |
| P11a | `applyPageCompositionValidationForUtilitiesPage` (materials closure, etc.) |
| Outputs | Complete `artifact_type:"page"` / `schema_version:"2.0.0"` |
| Next consumer | P12 |

### P12 — Hand-off to learner renderer (boundary)

| Field | Evidence |
| ----- | -------- |
| Orchestrator | `runUtilityPageExportPipeline` |
| Hand-off | `runLearnerRendererVNextExport(parsed, …)` → `window.PRISM_LEARNER_RENDERER_VNEXT.renderLearnerPageHtml` |
| Input artefact | Complete page object (+ optional visual/resource projections) |
| Out of scope | Renderer internals, HTML packaging details beyond hand-off |
| Provenance | Sole path after Sprint 74A; no Legacy page renderer fallback |

---

## 7. Ownership matrix (summary)

| Responsibility | Definitive owner (current evidence) | Orchestrator | Notes |
| -------------- | ----------------------------------- | ------------ | ----- |
| Brief field capture | Create Workflow UI | `handleStartWorkflowDesign` | |
| Brief factor resolution | `app.js` brief rules + pack brief config | `app.js` | Pack supplies config |
| Workflow design LLM | `app.js` OpenAI design call | `continueWorkflowDesignGeneration` | True in-app generation |
| Step pattern / seed prompt | Domain packs + `workflowGenerationContext.js` | `buildSeededStepPromptForWorkflowStep` | |
| Workflow definition store | `app.js` + `promptr.workflows.v1` | `saveWorkflows` | |
| Prompt envelope for Copy | `buildWorkflowStepInstructions` | same | May conflict with contracts |
| Contract **text** | `lib/ld-*-contract.js` (+ LD modules) | — | One responsibility per module |
| Contract **injection** | `applyWorkflowStepRuntimePromptAugmentations` | `app.js` | Easy to mis-attribute as contract owner |
| External page/content LLM | **Outside Prism** | User | |
| Capture normalize | `workflow-page-capture-normalize` + stage repairs | `syncWorkflowRunCapturedOutputToState` | |
| Capture validate (modern) | Stage validators / libs | `validateStrictJson…` | |
| Capture validate (legacy shim) | Four `app.js` always-pass branches | `validate*OrPageCapture` | Ownership = “accept old shapes” |
| Runstate store | `app.js` + `promptr.workflows.runstate.v1` | persist helpers | |
| Page merge from partials | `PRISM_PAGE_VNEXT_ASSEMBLE` | `resolvePageForRenderOrAssembly` | |
| Assembled page composition check | `applyPageCompositionValidationForUtilitiesPage` | export pipeline | |
| Learner HTML render | vNext (74A) | `runLearnerRendererVNextExport` | **Out of 74B scope** |

---

## 8. Input / output matrix

| Phase | Primary input | Primary output |
| ----- | ------------- | -------------- |
| P1 | User form fields | Brief base |
| P2 | Brief + pack brief config | Resolved factors / elicitation state |
| P3 | Resolved brief + packs | Workflow with seeded steps + flags |
| P4 | Workflow object | `promptr.workflows.v1` |
| P5 | Step + workflow + contracts | Prompt string |
| P6 | Prompt string | External model response (opaque to Prism) |
| P7–P8 | Pasted text | Sanitized capture JSON (+ raw twin) |
| P9 | Capture JSON | `{ ok, errors, … }` (+ optional rewrite) |
| P10 | Capture maps | Durable runstate; advanced step index |
| P11 | Stage partial captures | Complete page JSON |
| P11a | Complete page | Pass/fail composition gates |
| P12 | Complete page | Hand-off into vNext render API |

---

## 9. Persistence boundaries

| Store | Key / API | Owns | Does not own |
| ----- | --------- | ---- | ------------ |
| localStorage | `promptr.workflows.v1` | Workflow definitions, brief resolution, step seeds, output flags | Run captures |
| localStorage | `promptr.workflows.runstate.v1` | Captures, raw captures, completion flags, run index | Workflow schema |
| IndexedDB | `promptRefinerDB` / prompts | Prompt Library assets | Workflows / pages |
| IndexedDB | Workflow Resources | Durable media (Sprint 73) | Page JSON assembly |
| Session `state.*` | in-memory | Active run / design session | Durable across reload without persist |

---

## 10. Validation boundaries

| Boundary | When | Owner | Strictness |
| -------- | ---- | ----- | ---------- |
| Capture-time stage validation | On paste | Stage validators / libs | Fail closed for modern shapes |
| Legacy capture shims | On paste for old shapes | `app.js` `validate*OrPageCapture` | **Always pass** (`legacy: true`) |
| Advance gate | Next click | `isWorkflowRunStepCaptureReadyForAdvance` | Blocks progression |
| Assembled-page render validation | Assemble / Preview | `validateAssembledPageForRender` | Completeness for render |
| Composition validation | Before hand-off | `applyPageCompositionValidationForUtilitiesPage` | Can block export (materials closure) |
| Renderer load | Hand-off | Presence of `PRISM_LEARNER_RENDERER_VNEXT` | Explicit error if missing |

---

## 11. Contract ownership

| Module | Builder | Affinity | Role |
| ------ | ------- | -------- | ---- |
| `lib/ld-design-page-compose-contract.js` | `buildLdDesignPageComposePromptBlock` | Design Page when **not** partial | Full compose prompt contract |
| `lib/ld-design-page-partial-contract.js` | `buildDesignPagePartialContractBlock` | Design Page when `partialPageOutputs` | Partial prompt contract |
| `lib/ld-dla-page-enrich-contract.js` | `buildDlaPageEnrichContractBlock` | DLA | Enrich contract |
| `lib/ld-gam-page-enrich-contract.js` | `buildGamPageEnrichContractBlock` | GAM | Enrich contract |
| `lib/ld-gai-page-enrich-contract.js` | `buildGaiPageEnrichContractBlock` | Assessment items | Enrich contract |
| `lib/ld-activity-title-contract.js` | title guidance | DLA titles | Title contract |

**Compose vs partial:** both modules load; injection is mutually gated by `partialPageOutputs`. Dual surfaces remain — documentation of roles is a 74B concern (`S74B-T-020`); forced merge is **not** first-slice scope.

**Injection ownership ≠ text ownership.** `applyWorkflowStepRuntimePromptAugmentations` orchestrates many blocks; it does not author the contract bodies.

---

## 12. Duplicate ownership findings

| Finding | Evidence | Risk |
| ------- | -------- | ---- |
| Prompt text vs envelope vs contracts | Pack seed + `buildWorkflowStepInstructions` + LD contracts all contribute to Copilot-visible text | Silent prompt drift / contradictory directives |
| Compose vs partial Design Page | Two contract modules + mutual no-ops in `app.js` | Duplicate ownership inside supported path |
| Dual capture maps | `workflowRunCapturedOutputs` vs `…Raw`; assemble prefers raw | Last-writer / wrong-map bugs |
| Capture-time rewrite vs assemble | Capture validators may rewrite Design Page JSON; assemble also merges | Multiple writers of page-shaped data |
| Deterministic enrich helpers vs LLM partials | `enrichPageWithDla` / `enrichPageWithGam` vs live LLM captures | Misread as second page generator |
| `app.js` mega-orchestrator | Contracts in `lib/`; almost all routing in `app.js` | Filename does not imply owner |
| Deprecated aliases on live test API | PR-W\* wrappers still assigned to `prismTestApi` | Plausible-but-wrong call surface for agents/tests |

---

## 13. Deprecated surface findings

### 13.1 `@deprecated` PR-W\* wrappers in `app.js`

| Symbol | Delegates to | PR label |
| ------ | ------------ | -------- |
| `buildMathSafeOutputContractPromptBlock` | `buildLdMathRenderPromptBlock` | PR-W1-3 |
| 10× `buildSelfDirected*PromptBlock` | `buildLdSelfDirectedRhetoricPromptBlock` | PR-W1-4 |
| Table-fidelity deprecated wrapper | `buildLdTableFidelityPromptBlock` | PR-W1-1 |
| `buildDesignPageActivityMaterialsFidelityPromptBlock` | `buildLdDesignPageComposePromptBlock` | PR-W3-2 |
| `applyDesignPageActivityMaterialsFidelityContractToDraft` | `applyLdDesignPageComposeContractToDraft` | PR-W3-2 |

**Ownership note:** `@deprecated` ≠ unused. Several aliases remain on `prismTestApi`. Historical docs and some tests still name old symbols. **Do not remove on label alone** — T-030/T-040 must prove call paths (static + dynamic + tests).

### 13.2 Legacy capture validators (live always-pass)

| Function region | Approx line | Condition (abbrev.) | Return |
| --------------- | ----------- | ------------------- | ------ |
| `validateDlaOrPageCapture` | ~9746 | `activities[]` / `learning_activities` without modern path | `{ ok: true, legacy: true, errors: [] }` |
| `validateLearningSequenceOrPageCapture` | ~10025 | `timeline` / `activities_used` / … | same |
| `validateDesignPageOrPageCapture` | ~10367 | `sections` / `activity_materials` / `session_materials` | same |
| `validateGamOrPageCapture` | ~10483 | legacy material shapes | same |

These are **current reachable validation behaviour**, not dead comments. They accept old shapes without structural proof.

### 13.3 Unrelated `legacy: true`

`app.js` ~34786 `return { legacy: true, slotGenerate: {} }` — visual/slot path; **not** a capture validator. Classify separately.

---

## 14. What “generation” means in Prism today

| Sense of “generation” | Exists? | Where | In Domain B? |
| --------------------- | ------- | ----- | ------------ |
| **Workflow design generation** | Yes | Create Workflow OpenAI design | **Peripheral** — formation, not contract hygiene |
| **Prompt generation / assembly** | Yes | Run Copy + contract injection | **Yes** (core) |
| **Contract generation** | Yes (builders emit text blocks) | `lib/ld-*-contract.js` | **Yes** (core) |
| **Capture generation** | **No (in Prism)** | External model; Prism **receives** | Validation hygiene **yes**; generating captures **no** |
| **Page generation (deterministic assembly)** | Yes | `assembleVNextPageFromPartials` | **Boundary** — touch only via contracts/validators that feed it; do not redesign assemble in 74B |
| **Learner HTML generation** | Yes | vNext renderer | **No** (74A closed) |
| **Workflow Resources / visual job generation** | Adjacent | Sprint 73 / visual jobs | **No** |

**Explicit answer:** Within Prism today, “generation” is **not one responsibility**. It is a **family of names** for workflow design, prompt/contract assembly, external-model content creation, and deterministic page assembly. Sprint 74B’s title uses “generation” primarily for **prompt/contract surfaces and capture-validation hygiene**, not for Create Workflow design LLM or the learner renderer.

---

## 15. Operator hypothesis evaluation

### Candidate A — Workflow formation (brief, elicitation, construction, persistence)

| Verdict | **Split / refined — largely confirmed as a cluster** |
| ------- | ----------------------------------------------------- |
| Rationale | Evidence confirms brief → elicitation → pack/design LLM → seed → `promptr.workflows.v1`. Collapsing into one “formation” phase hides **three ownership boundaries**: brief rules, pack/design LLM, persistence. |
| Mapping | P1–P4 |

### Candidate B — Workflow execution preparation (run prep, prompts, contracts, copy/run)

| Verdict | **Refined / split** |
| ------- | ------------------- |
| Rationale | Prompt construction and contract injection are real and central. But **copy/run is a user/external boundary** (P6), not a Prism transformation. Treating “user-visible prompts” and “external run” as one phase obscures that Prism does not generate page JSON here. |
| Mapping | P5 + P5a + P6 |

### Candidate C — Capture and progressive assembly

| Verdict | **Split — confirmed as a cluster, not one phase** |
| ------- | -------------------------------------------------- |
| Rationale | Capture sanitize/validate/persist (P7–P10) is a different owner set from page assembly (P11) and composition validation (P11a). Progressive assembly is deterministic merge owned by `page-vnext-assemble.js`, not by capture validators. |
| Mapping | P7–P11a |

### Additional phases beyond the three candidates

| Addition | Why required |
| -------- | ------------ |
| P12 hand-off | Explicit stop before renderer; prevents 74B from reopening 74A |
| P5a contract injection | Separate definitive owners from prompt envelope |
| P11a composition validation | Pre-export gate distinct from capture validation |
| Parallel Prompt Studio / Library | Shares some builders; must not be mistaken for the Run spine |

### Fewer phases?

Forcing fewer than ~12 **stable** phases would **hide** ownership. Programme communication may still group into three **clusters** (formation / run-prompt / capture-assemble) for storytelling — but **implementation and inventory must use the finer phase list**.

---

## 16. Implications for Sprint 74B

### 16.1 Which phases belong inside Domain B?

| In Domain B (approved scope) | Why |
| ---------------------------- | --- |
| P5 / P5a — prompt & contract surfaces | Deprecated wrappers; dual compose/partial; injection ownership |
| P9 — capture validation (esp. legacy shims) | Explicit Domain B target |
| P8 — only where normalisation **duplicates** validation ownership | Investigate; do not redesign normalize wholesale |
| Compose vs partial **role documentation** | Charter AC-07 / T-020 |

### 16.2 Which belong elsewhere?

| Elsewhere | Why |
| --------- | --- |
| P1–P4 workflow formation | Not Domain B; opening formation redesign would broaden 74B |
| P6 external LLM | Outside Prism |
| P10 runstate schema redesign | Persistence product work — not hygiene |
| P11 assemble algorithm redesign | Sprint 58 architecture; boundary only |
| P12 / renderer | Sprint 74A closed |
| Workflow Resources / Prompt Library product | Explicit non-scope |

### 16.3 Does approved Sprint 74B scope remain correct?

**Yes**, with one clarification: Domain B is correctly about **generation-contract and capture-validator hygiene**, not about the entire brief→page pipeline. T-010 shows the pipeline so 74B does **not** accidentally “fix” formation or assembly under a hygiene label.

### 16.4 Should implementation occur in internal phases?

**Recommendation:** Yes — plan T-030/T-040 slices against **P5a / P9 / compose-partial docs**, not against Candidate A/B/C as monoliths. T-020 remains docs-first for compose vs partial.

### 16.5 Does the title remain correct?

**Recommendation:** Keep **Generation-contract & capture-validator hygiene**. Optionally add a one-line subtitle in active docs: *prompt/contract & capture-validation ownership — not Create Workflow design LLM, not learner renderer.* Do **not** rename the sprint in this task.

### 16.6 Architectural boundaries 74B must not cross

1. Do not reopen learner-renderer / Authoring export path (74A).  
2. Do not redesign Create Workflow brief/elicitation product behaviour.  
3. Do not force compose/partial **code merge** before ownership matrix + docs (T-020).  
4. Do not treat `@deprecated` or zero static call sites as sufficient removal proof.  
5. Do not rewrite `assembleVNextPageFromPartials` as a “cleanup.”  
6. Do not open Sprint 74C work under 74B.

---

## 17. Implications for remaining Sprint 74B tasks

| Task | Implication from T-010 |
| ---- | ---------------------- |
| **T-020** | Document compose vs partial **roles** using §11 + mutual gating evidence; docs-only |
| **T-030** | Removal/consolidation plan must cover: PR-W\* aliases (incl. test API), four legacy capture shims, any proven duplicate injectors — classified with ownership proof |
| **T-040** | Execute only slices with ownership matrix rows; residue sweep after each |
| **T-050** | Verify Authoring export unchanged; focused contract/capture suites; no formation/renderer regressions claimed without evidence |

**Not started by this task:** removals, consolidation, runtime edits, T-020 execution.

---

## 18. Key file index

| Path | Role |
| ---- | ---- |
| `index.html` | Tabs, Create Workflow / Run / Authoring DOM, script order |
| `app.js` | Primary orchestration (design, run, capture, assemble, export) |
| `workflowGenerationContext.js` | Domain pack load, brief config, generation context |
| `library.js` | Prompt Library IndexedDB (adjacent) |
| `lib/page-vnext-assemble.js` | Deterministic partial → page merge |
| `lib/workflow-page-capture-normalize.js` | Capture normalize |
| `lib/page-dla-enrich.js` / `lib/page-gam-enrich.js` | Deterministic enrich helpers |
| `lib/ld-*-contract.js` | Prompt contract text |
| `docs/architecture/renderer-export-behavior.md` | Export spine (post-hand-off narrative) |
| `docs/development/ENGINEERING-DISCIPLINES.md` | How this discovery was conducted |

---

## 19. Acceptance against expanded T-010 intent

| Criterion | Status |
| --------- | ------ |
| End-to-end phases discovered from brief → renderer hand-off | **Met** (§4–§5) |
| Ownership / I-O / persistence / validation matrices | **Met** (§6–§11) |
| Duplicate ownership & deprecated surfaces evidenced | **Met** (§12–§13) |
| “Generation” meaning answered with evidence | **Met** (§14) |
| Operator hypothesis evaluated | **Met** (§15) |
| 74B scope implications / non-crossing boundaries | **Met** (§16–§17) |
| No removals / no runtime changes / no T-020 start | **Met** |

---

## 20. Stop statement

S74B-T-010 expanded architectural discovery is **complete**. Sprint 74B remains **OPEN**. Next planned task remains **S74B-T-020** (compose vs partial role documentation) — **not begun**. No removal plan execution. No Sprint 74C.
