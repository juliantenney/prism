# Sprint 75 — Decision Log

**Sprint status:** **OPEN** (opened 2026-08-10)  
**Format:** ID · Decision · Status · Rationale · Consequences  

Inherited programme constraints are **linked, not duplicated** — [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md); parent Sprint 74 decisions `S74-D03`…`S74-D11`.

Inherited working practice — [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md) *(not duplicated here)*.

---

## S75-D01 Open Sprint 75 — PRISM User Experience and Interface

- **Decision:** Operator approval has **opened Sprint 75** — PRISM User Experience and Interface — as a **new programme** focused on UX / interaction design. Sprint **74** remains **COMPLETE / Closed**; its architecture is **not** reopened. Pack initialisation is task **S75-T-001**. The first discovery task is **S75-T-010** (current-state UX and user-journey audit) — **defined only**; it must **not** be executed until explicitly authorised after pack review. T-001 authorises **no** UI, runtime, test, fixture, or architectural product changes. Later implementation structure is evidence-led from T-010 and is **not** invented in detail at open. Sprint **76** is **not opened**.

- **Status:** **Accepted** (2026-08-10)

- **Rationale:** Underlying architecture is consolidated and validated (Sprint 74). The next programme priority is making Prism work as well as possible for eventual users — journey, interaction, and presentation — under pre-release Compatibility posture (`S74-D09`) and Engineering Disciplines.

- **Consequences:** Work proceeds under [PLAN.md](PLAN.md). Stop after T-001 until T-010 is authorised. UX must not casually leak into generation / renderer / pedagogic-contract redesign. Further decisions: `S75-D##`.

---

## S75-D02 Sprint 75 follows the product journey and major product surfaces sequentially

- **Decision:** Sprint 75 UX discovery and improvement will proceed through **five primary programme domains**:

  **A. Elicitation & Workflow Generation**  
  **B. My Workflows**  
  **C. Authoring**  
  **D. Prompt Studio**  
  **E. Prompt Library**

  These are **programme domains**, not fixed implementation-task boundaries. Each domain may be decomposed into smaller journey stages where evidence shows that is useful.

  Do **not** assume the five domains require equal effort. Do **not** assume their current prominence, audience, or navigation position is correct merely because they exist today.

  **Prompt Studio** and **Prompt Library** are first-class Sprint 75 product surfaces, but their role / audience / relationship to the primary workflow must be established through evidence rather than assumed.

  Cross-cutting UX concerns (navigation, orientation, terminology, progress/state feedback, errors/recovery, empty/disabled/enabled states, discoverability, cognitive load, accessibility, consistency, responsive behaviour, visual hierarchy, engineering-concept leakage) are assessed **(1)** in context within each domain and **(2)** later across the product as a whole where useful — not as disconnected implementation workstreams at programme opening.

  Standing UX principle: **Experience before implementation** — actual use of Prism is the **primary** source of UX evidence; implementation inspection is **supporting** evidence (see [SPRINT-75-CHARTER.md](SPRINT-75-CHARTER.md)).

  **S75-T-010** is reframed as **Primary journey map and Domain A decomposition** (discovery only) — not a whole-application audit. Domains B–E are recorded at programme-map level only in T-010.

- **Status:** **Accepted** (2026-08-10) — operator-reviewed refinement after T-001

- **Rationale:** A single undifferentiated whole-application audit is too broad and risks code-led findings. Sequential domain discovery aligned to product journeys matches how users experience Prism and keeps evidence actionable.

- **Consequences:** T-010 scope narrowed in [PLAN.md](PLAN.md). First detailed discovery area: **Domain A — Elicitation & Workflow Generation**. Domains B–E identified but not audited in detail until later tasks. No implementation tasks opened by this decision.

---

## S75-D03 Retire generic Create Workflow workflow-review step insertion

- **Decision:** Retire the Create Workflow **“Review & suggest improvements”** generic LLM workflow-graph reviewer and its freeform step-insertion path. Users may still inspect, edit, delete, and **Save as workflow**. Do **not** replace it with another QA interaction in Sprint 75. Preserve: Prompt Studio prompt-text review; pack-driven post-generation factor refinement; assessment-specific pack QA/feedback steps; Research validation steps; learner guided-review; Sprint 71 Benchmark/Validation methodology docs. Future closed-loop QA/refinement is backlog **[PB-FA-006](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-006--qa--workflow-and-resource-refinement-lifecycle)** — **not** assigned to Sprint 76.

- **Status:** **Accepted** (2026-08-10)

- **Rationale:** Sprint 75 operator evidence plus implementation investigation showed the generic reviewer invents non-catalog “review” titles that fuzzy-canonicalise into duplicate production steps at Run (e.g. “Review Learning Outcomes” → second “Define Learning Outcomes”). There is no generic executable intermediate-artefact QA model. Leaving the control exposed continues to create unsafe workflows.

- **Consequences:** UI button and reviewer runtime/state removed; focused regression tests added (`tests/s75-retire-generic-workflow-reviewer.test.js`). [S75-T-020](S75-T-020-cross-journey-ux-evidence-synthesis-and-intervention-framing.md) Theme 8 root cause for the **generic reviewer** is established. Productised closed-loop QA remains undesigned, but **[PB-FA-006](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-006--qa--workflow-and-resource-refinement-lifecycle)** now explicitly carries **Sprint 71** Benchmark/Validation corpus-review as prior art (not a blank slate). Existing saved workflows are not migrated.

---

## S75-D04 Implement C-01/C-02 Run → Authoring handoff and provenance clarity

- **Decision:** Authorise a **thin UX implementation** combining S75-T-020 candidate slices **C-01** (B→C handoff / Authoring entry orientation) and **C-02** (Authoring workflow provenance display) as one intervention. Scope: final-Run **Continue to Authoring** via existing `switchTab("utilities")` (no auto-assemble, no Run-data clear, selection preserved); Authoring presentation of selected workflow and Assemble-stamped assembled-from identity; non-destructive mismatch warning when selected ≠ assembled provenance. Explicitly **out of scope:** same-workflow run-freshness / capture fingerprints; new persistent Authoring provenance architecture; Authoring tab redesign; Settings (**PB-FA-005**); QA lifecycle (**PB-FA-006** / `S75-D03` retirement remains); Prompt Studio; SCORM; automatic clear/reassemble on workflow change.

- **Status:** **Accepted** (2026-08-10)

- **Rationale:** Investigation confirmed final Run step is detectable; Authoring buffer is independent of selection; Assemble-path page JSON normally carries `workflow_id` / `metadata.workflow_id` (and often name), so mismatch is derivable without new persistence. Operator evidence Themes 1 and 7 / C-01–C-02 — high confidence, low architecture risk.

- **Consequences:** Product UI/runtime changes limited to handoff + context/warning presentation; tests in `tests/s75-c01-c02-run-authoring-handoff.test.js`. Remaining T-020 slices (**C-03…**) stay **unauthorised**. T-011/T-012/T-013 remain superseded/retired.

---

## S75-D05 Align My Workflows Edit validateWorkflow with current Run semantics

- **Decision:** Keep the Edit-mode **Validation warnings** panel, but fix false-positive rules so validation describes whether a workflow is valid under the **current** executable model. Align runnable-prompt checking with Run (`isWorkflowStepRunnablePromptConfiguration`: non-empty resolved text **or** `sourceType === "v2_locked"`). Exempt shared page-enrichment `page` inputBindings that are same/later under linear Run order (`isSharedPageEnrichmentInputBinding`) — these are artefact wiring, not DAG execution dependencies. Retain genuine warnings for empty custom steps, unresolved library prompts, missing source steps, and invalid custom same/later bindings. Explicitly **out of scope:** redesign of workflow validation/dependencies; workflow migration / normalize-on-load of bindings; Run UX/behaviour change beyond sharing the runnable predicate; Settings (**PB-FA-005**); QA (**PB-FA-006**); Prompt Studio; Authoring; C-03/C-04; Sprint 76.

- **Status:** **Accepted** (2026-08-10)

- **Rationale:** Investigation confirmed Edit `validateWorkflow` predated current Run architecture: it required conventional prompt bodies (false for Design Episode Plan / Generate Assessment Items `v2_locked` paths) and treated every internal `inputBindings` edge as a strict earlier-only DAG dependency (false for shared page-enrichment bindings). Ordinary Learning Design fixtures alarmed operators without actionable defects.

- **Consequences:** `validateWorkflow` + shared helpers in `app.js`; Run Copy uses the same runnable predicate (no execution path change beyond that shared gate). Focused regression tests: `tests/s75-validate-workflow-false-positives.test.js`. Representative Educational Psychology fixture validates with **zero** warnings. Warning “depends on step N which has no outputName” left unchanged (current but low operator value / too broad — not expanded). No workflow migration. No backlog item.

---

## S75-D06 Implement C-03 as persistent lightweight Run execution orientation

- **Decision:** Authorise **C-03** as **persistent lightweight Run guidance**, not first-use/dismissible onboarding. Show a short orientation whenever My Workflows is in **Run** mode, before the current step, teaching: start a **fresh AI chat for this workflow run**; **Copy each step into the same chat** and work in order; paste results back **only when the step asks to store output**. Vendor-neutral “AI chat” in the UI. Do **not** add localStorage/session dismiss state, first-ever-run detection, modals, or per-workflow onboarding flags. Do **not** unhide the full `#workflowRunText` goal/audience/constraints dump. Explicitly **out of scope:** C-04 paste-field visibility; capture/Next gating; prompt bodies; Settings; Prompt Studio; QA; domain packs; Sprint 76.

- **Status:** **Accepted** (2026-08-10)

- **Rationale:** Investigation confirmed BYO-LLM execution is learnable but not taught; the only whole-run chat sentence lived in hidden CSS. The execution model is important enough to remain visible on every Run visit if kept short. Same-chat continuity is especially important for Learning Design partial enrichment; C-03 teaches that operating model without changing prompts. Operator-authorised product decision: persistent guidance over dismissible first-use.

- **Consequences:** Dedicated `#workflowRunOrientation` in `index.html` + Run-only CSS in `style.css`; tests in `tests/s75-c03-run-execution-orientation.test.js`. No `app.js` execution/prompt changes required for visibility. Remaining T-020 slices (**C-04…**) stay **unauthorised** until separately accepted.

---

## S75-D07 Implement C-04 Run capture relevance (page-structure producers only)

- **Decision:** Authorise **C-04** as a **presentation/relevance** correction for My Workflows Run. Product principle: **External AI conversation context carries ordinary inter-step information. PRISM captures returned output only where application-side structured artefacts are required for the page pipeline.** Show the Run paste/capture control **only** when `isWorkflowStepPageStructureProducer(step, wf)` is true (same family as capture/advance gating). Do **not** use `workflowStepProducesStoredArtefact` as the visibility rule. Compact C-03 orientation to one persistent line ending “…only when the step asks you to.” Hide empty Run Instructions (after parameter-block strip); preserve meaningful custom notes. Align runner-summary paste copy with the same rule. Explicitly **out of scope / unchanged:** page assembly; capture parsing/storage; Next gating; Episode Plan derive/repair; prompt construction; workflow schemas; domain packs; optional-store UI; `requiresCapture` metadata. Learning Outcomes capture helpers may remain as legacy/internal fallback but are **not** part of the required Run interaction contract. Compatibility: old custom workflows that used a non-page `outputName` merely as a personal stash **no longer** receive a generic paste box — intentional under the clarified model. Custom `outputName: "page"` / genuine page-structure producers keep capture + existing gate.

- **Status:** **Accepted** (2026-08-10)

- **Rationale:** Operator evidence + dependency investigation showed paste UI overclaimed “can store” steps (Normalize / GLC / KM / LO). Deterministic final assembly needs page-structure captures from Design Episode Plan onward; earlier LD steps rely on the same external AI chat. Presentation must match that contract without changing runtime semantics.

- **Consequences:** `updateWorkflowStepInteractivity` / `buildWorkflowStepRunSummaryText` / step-element labels updated; C-03 wording compacted in `index.html`; tests in `tests/s75-c04-run-capture-relevance.test.js` (+ C-03 wording assertions). Remaining T-020 slices stay **unauthorised** until separately accepted. Sprint 76 **not opened**.

---

## S75-D08 Run UX simplification (operator copy + execution bar)

- **Decision:** Authorise a **Run presentation** simplification for My Workflows → Run. Introduce a **Run-UI-only** description path (`getWorkflowRunUiStepDescription` / `buildWorkflowStepRunSummaryText`) with concise operator-facing Learning Design copy. **Do not** rewrite shared pack `promptFactory.runnerInstructions` — those fields also feed **Copy** as Runner guidance. Preserve meaningful human-authored step **Instructions** (`step.notes` after stripping `[PRISM_STEP_PARAMS]`) as **read-only prose** in Run; hide when empty/params-only; Edit keeps the editable textarea. Record that human instructions and machine params currently share `step.notes` as an architectural smell deferred to **[PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency)** — **no storage redesign** in this slice. Place **Previous · Copy · Next** (and Continue to Authoring on the final step) in one top execution bar with a single heading `Step N of M — Title`. Keep C-04 paste visibility / capture / Next gating / assembly unchanged; simplify paste placeholder to “Paste the result from your AI chat here.”; remove duplicated pipeline/partial paste sentences from Run summaries; use friendly gating tooltips (“result” not “artefact”). Explicitly **out of scope:** pack/prompt semantics; schemas; Settings redesign; QA; Prompt Studio; Authoring; Sprint 76.

- **Status:** **Accepted** (2026-08-10)

- **Rationale:** Post–C-03/C-04 Run still leaked implementation terminology via shared `what_this_step_does`, duplicated paste/global guidance, and split Copy vs Previous/Next controls. Operator walkthrough required a minimal task-oriented Run shell without changing the one-chat / page-structure-capture product model.

- **Consequences:** `app.js` Run-only description map; Instructions prose element; `index.html` / `style.css` top execution bar; tests in `tests/s75-c05-run-ux-simplification.test.js`. Copied prompts and pack runnerInstructions **unchanged**. Remaining T-020 slices stay **unauthorised** until separately accepted. Sprint 76 **not opened**.

---

## S75-D09 Create Workflow API-key prerequisite (C-05)

- **Decision:** **Create Workflow is always accessible. The OpenAI API key is required when PRISM performs an API-dependent generation action, not for navigation into Create Workflow.** Users may always enter and view Create Workflow (including fresh session / initial surface), choose domain/output type, and edit the brief with no key. The first OpenAI-dependent Create action is **Design workflow** (`handleStartWorkflowDesign` → intent interpretation / design generation). Without a key, that action does **not** call the API, keeps the user on Create with brief state intact, and **reveals/focuses** the existing header API-key picker (`#apiKeyFile`) with guidance: “Load your OpenAI API key to continue.” After the key is loaded via the existing in-memory file-load path, the user continues the same Create session. Explicitly **out of scope:** persisting the key; new API-key UI/onboarding/modal; storage/security redesign; gating My Workflows / Run / Authoring / Prompt Studio navigation; Settings; QA; Sprint 76.

- **Status:** **Accepted** (2026-08-10); **amended** (2026-08-10) — navigation gate retracted; action gate retained.

- **Rationale:** Operator evidence (C-05) needed earlier key visibility, but gating **tab entry** broke the intended Create-first fresh session (tab selected while another panel remained visible). API availability is an **action** prerequisite.

- **Consequences:** No `switchTab("workflowFactory")` API gate; `ensureCreateWorkflowApiKeyPrerequisite` used from `handleStartWorkflowDesign`; Design button not disabled solely for missing key; lightweight Create hint that a key is needed to generate. Tests in `tests/s75-c05-create-workflow-api-key-prerequisite.test.js`. Sprint 76 **not opened**.

---

## S75-D10 My Workflows default / handoff mode (C-07)

- **Decision:** **Run is the default My Workflows mode for a fresh session and the destination mode after creating a workflow. During an active session, PRISM preserves the operator’s chosen My Workflows mode when navigating between application areas.** Specifically: (1) session init / `finalizeInitialUiSetup` defaults `workflowDetailMode` to **run**; (2) Create Workflow save handoff (`handleSaveDesignedWorkflow`) selects the new workflow and calls `setWorkflowMode("run")`; (3) ordinary `switchTab("workflows")` and `selectWorkflow` do **not** reset mode. Explicitly **out of scope:** new localStorage/onboarding flags; Edit/Settings/Run execution semantics; C-03/C-04 UI; generation/save format; Settings parameterisation; Prompt Studio; Authoring; QA; Sprint 76.

- **Status:** **Accepted** (2026-08-10)

- **Rationale:** Operator evidence wanted Run as the natural landing after create and on first entry, without continually forcing Run when the operator had chosen Edit/Settings and was merely switching PRISM areas.

- **Consequences:** Initial state + HTML mode-tab chrome default to Run; Create handoff sets Run; session mode preserved via existing `state.workflowDetailMode`. Tests in `tests/s75-c07-my-workflows-default-mode.test.js`. Remaining T-020 slices stay **unauthorised**. Sprint 76 **not opened**.

---

## S75-D11 Explicit Learning Design Create output selection (C-06)

- **Decision:** For the **Learning Design** Create Workflow journey, replace the open-ended primary intent framing (“What are you trying to design or produce?”) with an explicit first-class choice: **What are you creating?** Options (**only**): **Self-study resource** · **Workshop**. No Other, slideshow, assessment pack, lesson, module/course, VLE, or Xerte options. Selection is **Create-time only** and maps onto the **existing** LD factor / `workflowOutputSpec` machinery (self-directed page/learner vs facilitated workshop delivery). Remaining brief fields describe the selected thing; natural-language interpretation of supporting materials (slides, formative checks, handouts, etc.) is preserved. Existing saved workflows are **not** migrated and remain runnable without an output-type id. Explicitly **out of scope:** new persisted output-type architecture / pack `supportedOutputs`; expanding the honest LD catalogue; Settings (**PB-FA-005**); QA (**PB-FA-006**); Prompt Studio; Authoring redesign; SCORM; Sprint 76.

- **Status:** **Accepted** (2026-08-10); **implementation correction** (2026-08-10) — LD selector visibility/synchronisation; **presentation correction** (2026-08-10) — radios → scalable select + top Create layout.

- **Rationale:** C-06 investigation established Self-study and Workshop as the only honest first-class LD products today; an open-ended intent field overstated capability.

- **Consequences:** Create LD control is a native **select** (`#wfLdCreateOutputType`) with placeholder + Self-study resource + Workshop (internal values unchanged). Compose design intent + seed/re-assert primary delivery factors via `mergeLdCreateOutputTypeIntoExplicitFactors` / `applyLdCreateOutputTypePrimaryFactors`. Tests: `tests/s75-c06-ld-create-output-selection.test.js`. Longer-term note only: first-class outputs should eventually be **domain-pack-declared** rather than accumulated as app.js product knowledge — **not implemented** in this slice. Sprint 76 **not opened**.

- **Implementation correction (2026-08-10):** The required LD “What are you creating?” control could remain unsounded when Learning Design was active (validation required a selection the UI did not surface). Cause: Create-time sync depended on cached element refs / ordering, and stale `app.js` cache-busters amplified HTML/JS mismatch. Corrected by live DOM re-query in `refreshWfLdCreateOutputTypeElementRefs`, immediate sync on domain change and Create tab show, force-show on missing-selection validation, and bumped asset cache-busters. **C-06 product semantics unchanged.**

- **Presentation correction (2026-08-10):** Radio group replaced by a scalable native dropdown (`#wfLdCreateOutputType`) suitable for future first-class options; top Create layout adjusted to Workflow name (half-width) then Domain + What are you creating? (half + half). Domain/output sync behaviour from the visibility fix is preserved. **C-06 product semantics unchanged** (Self-study / Workshop only; same values; same factor seeding; no new output-type architecture). Prompt Studio `#outputType` remains a separate control.

---

## S75-D12 Retire Authoring “Learning object” presentation format

- **Decision:** **Learning object is no longer a distinct Authoring output/presentation format.** PRISM retains its supported learner-page HTML preview/export paths without exposing an obsolete format selector. Remove the Authoring **Presentation mode** control (`#utilitiesPresentationMode`, options Single page HTML / Learning object HTML) and delete code that existed solely for Learning object mode (including dead `buildUtilityLearningObjectHtml`). Keep shared HTML Preview, Open in New Tab, HTML download, learner-package ZIP, Assemble From Current Workflow Run, Graphics/Video/Resources, and C-01/C-02 provenance UI. Do **not** interpret this as removing HTML support. Distinct from C-06 Create outputs and Prompt Studio `#outputType`. Explicitly **out of scope:** Authoring redesign; renderer architecture change; SCORM; learner-package semantics change; Sprint 76.

- **Status:** **Accepted** (2026-08-10)

- **Rationale:** The Learning object presentation mode was obsolete product surface; the live page export path already ignored `presentationMode` and routed through learner-page vNext HTML. Leaving the selector and dead LO builder implied a supported format that no longer existed as a real branch.

- **Consequences:** UI no longer offers Learning object HTML. Session-only `state.utilitiesPresentationMode` removed (not persisted — no migration). `#utilitiesOutputFormat` (HTML) retained as packaging format. Tests: `tests/s75-retire-authoring-learning-object-format.test.js`. Sprint 76 **not opened**.

---

## S75-D13 Authoring assembly readiness — Episode Plan shell is not learner-ready

- **Decision:** **Episode Plan is a structural shell, not a learner-ready page.** Authoring must merge available partial-page captures before readiness is assessed, and must **not** silently render an incomplete shell as a finished learner resource.

  Implementation:
  1. Remove the unsafe early-return in `resolvePageForRenderOrAssembly` that returned any seed passing structural `validateAssembledPageForRender` without merging captures.
  2. For partial-page workflows, always assemble via `assembleVNextPageFromPartials` from available EP + DLA + GAM + Learning Sequence + assessment + Design Page captures (existing ownership/merge rules unchanged).
  3. After assembly, apply a **learner-ready** gate aligned with vNext placeholder-activity semantics (≥1 non-placeholder activity). Placeholder-only shells fail Assemble / Preview with a concise incomplete-run message (optionally naming missing Learning Activities / Activity Materials stages).
  4. Design Page remains a **partial** patch. vNext renderer placeholder omission is unchanged. C-04 capture rules, prompts, schemas, and D12 retirement are unchanged. No global Run persistence rewrite.

- **Status:** **Accepted** (2026-08-10)

- **Rationale:** Structural validation accepted EP shells (activity IDs present, instructional fields dash placeholders, empty materials). Early-return then skipped DLA/GAM merge; vNext correctly omitted placeholders → title + outcomes + Close with no learner activities. Fix belongs at the Authoring assembly/readiness boundary.

- **Consequences:** Incomplete runs surface explicit feedback instead of empty “success” HTML. Tests: `tests/s75-authoring-assembly-learner-ready.test.js`. Sprint 76 **not opened**.

---

## S75-D14 Run capture persistence is non-destructive (cumulative latest-run snapshot)

- **Decision:** **Persisted Run captures are cumulative durable state for the workflow's latest run.** Ordinary persistence reconciles current state with the stored snapshot and must **not** interpret missing live keys as deletion. Explicit **Clear Run Data** remains the destructive operation.

  Implementation:
  1. `persistWorkflowRunStateForWorkflow` merges durable baseline + live overlay for `capturedOutputs`, `capturedOutputsRaw`, `stepCompleted`, and preserves non-empty resource refs when live is empty.
  2. Scalar `runIndex` keeps the intended current live value.
  3. Authoring **Assemble From Current Workflow Run** reconciles durable + live captures before assembly (live wins for matching keys; missing live keys recovered from durable).
  4. Before same-workflow `restoreWorkflowRunStateForWorkflow`, flush live via non-destructive persist so newer unsaved captures are not discarded.
  5. Model remains **one latest run per workflow** — no multi-run history.

- **Status:** **Accepted** (2026-08-10)

- **Rationale:** Investigation reproduced replace-all persistence: truncated live EP-only + ordinary persist permanently destroyed fuller EP+DLA+GAM+CLS+DP durable state. Authoring read live maps only, amplifying the defect.

- **Consequences:** Tests: `tests/s75-run-capture-persistence.test.js`. D13 continues to gate learner-ready assembly on the reconciled capture set.

- **Residual (not implemented tonight):** Rename currently creates new workflow identity; Duplicate creates new identity without copying runstate; Delete can leave orphan runstate; browser unload / dirty-state flush for never-persisted pastes remains unresolved (no `beforeunload` machinery added).

---

## S75-D15 DLA evidence_decision false-positive validation (instructional scaffold vs supplied evidence)

- **Decision:** Tighten `taskLooksEvidenceDependent` in `lib/page-dla-enrich.js` so `evidence_decision.required = false` is **not** contradicted by ordinary instructional-material wording. **Principle:** evidence dependency refers to reliance on **supplied evidence/source material**, not ordinary use of generated instructional explanations, examples, samples, or checklists.

- **Status:** **Accepted** (2026-08-11)

- **Rationale:** Lagrangian Multipliers DLA capture rejected valid A5 (`activities[4]`) where learners review explanatory material, compare weak/strong interpretation **examples**, and write a conceptual summary — because `productionOverSource` treated interpret/compare + `(provided|supplied|attached) examples` as source-evidence dependency.

- **Consequences:** Validator-only fix; DLA prompt/schema/runtime semantics unchanged. Tests: `tests/s75-dla-evidence-decision-false-positive.test.js`. Genuine supplied-dataset/source-extract/case-evidence tasks still fail closed when `required:false`. Literary imagery/tone/structure source-analysis paths preserved. Sprint **76 not opened**.

---

## S75-D16 DLA partial-page activities[] false-positive validation

- **Decision:** Resolve the partial DLA capture **subject** before `validateDlaPartialPageCapture` checks `activities[]`. Run paste → `tryParseWorkflowArtefactJson` / `parsePageArtefactCaptureForStorage` → optional partial repair → strict partial validator must inspect activities wherever the production capture shape stores them, not only a missing top-level `activities` key on an otherwise valid v2 page shell.

- **Status:** **Accepted** (2026-08-11)

- **Root cause:** `validateDlaPartialPageCapture` only read `page.activities`. Production captures that are valid DLA partial pages can arrive with activities under tolerated alternate shapes — notably `learning_activities.activities`, a nested `page` wrapper from conversational paste, or a stringified JSON array — while still presenting `artifact_type` / `schema_version` / `assembly_state.current_stage: "dla"` at the outer object. The validator treated those as missing `activities[]`.

- **Consequences:** Validator-only fix in `lib/page-dla-enrich.js` (`resolveDlaPartialPageCaptureSubject`) and Run strict/partial routing in `app.js` (`resolveDlaPartialCaptureForValidation` before repair/validate). Requirement preserved: partial DLA must still contain a non-empty activities array after resolution. Tests: `tests/s75-dla-activities-missing-false-positive.test.js`. DLA prompts/schemas, C-04, D13, D14, Authoring, renderer unchanged. Sprint **76 not opened**.

---

## S75-D17 Generated-workflow Run persistence identity: durable step.id across Edit/Save/reload

- **Decision:** Treat workflow step `step.id` as durable workflow-instance identity. Existing steps retain id across Edit/Save/load/reload and Run/Authoring round-trips; only genuinely new steps receive new ids once. Run persistence remains keyed by workflow id + step.id.

- **Status:** **Accepted** (2026-08-11)

- **Root cause:** `gatherWorkflowDetailFormData` derived ids from `data-step-id || uuid()`. If a rendered existing step row reached gather without `data-step-id`, save assigned a fresh uuid and persisted a new definition id for that step. D14 durable runstate remained correct, but captures stayed under old step ids and appeared missing under regenerated ids after reload.

- **Consequences:** `app.js` now anchors gather/save to durable existing ids by: (1) rendering every step with stable id metadata (`data-step-id`, hidden `stepId`, in-memory `__workflowStepId`), and (2) resolving gather step id in priority order attr/property/hidden, then existing selected-workflow row fallback, then uuid only for genuinely new rows. No canonical-step-id capture lookup fallback introduced. No Rename/Duplicate/Delete residual changes. Tests: `tests/s75-generated-workflow-run-persistence-identity.test.js` plus existing D14/C-04/D13/D15/D16 suites remain green. Sprint **76 not opened**.

---

## S75-D18 Run position is session-scoped (captures remain durable)

- **Decision:** Treat workflow Run position (`currentWorkflowRunIndex`) as **session-only UI state**. Keep persisted run captures durable across sessions, but on a fresh application session/reload start Run at Step 1 (index 0).

- **Status:** **Accepted** (2026-08-11)

- **Rationale:** Operators found cross-session auto-resume to later steps surprising and potentially misleading during fresh-session reopening. Product rule separates concerns: capture data durability remains D14-owned; Run position is transient navigation state.

- **Consequences:** `restoreWorkflowRunStateForWorkflow` restores capture maps/step-completion/resource refs as before but resolves active run index from in-session state only; cold session defaults to 0. Persisted runstate schema can continue to carry `runIndex` for compatibility, but cold-session positioning ignores durable `runIndex`. No D14 merge changes, no D17 identity changes, no capture gating/validation changes. Tests: `tests/s75-run-position-session-scope.test.js` plus D14 and D17 suites remain green. Sprint **76 not opened**.

---

## S75-D19 Accepted Run capture refresh loss when in-memory equals accepted paste but durable key is missing

- **Decision:** Keep existing validation/gating semantics and D14 merge behaviour, but ensure an accepted Run capture is durably written when the live step value is valid and current in memory even if local in-memory change detection reports no delta.

- **Status:** **Accepted** (2026-08-11)

- **Root cause:** `syncWorkflowRunCapturedOutputToState` only persisted when `captureChanged === true` against in-memory previous values. In the reproduced Step 5 refresh-loss path, the accepted capture value could match existing in-memory step state while the corresponding durable `capturedOutputs/capturedOutputsRaw` key was absent or stale, so persistence was skipped and refresh lost the value.

- **Consequences:** `app.js` now checks step-level durable equivalence before deciding to skip persist. If a valid accepted capture is not durably current for that workflow+step, persistence runs even when in-memory changed detection is false. No canonical-id fallback, no Next-gating changes, no D13/D14/D15/D16/D17/D18 contract changes. Regression coverage added to `tests/s75-run-capture-persistence.test.js` (accepted unchanged-in-memory capture still durably persists). Sprint **76 not opened**.

---

## S75-D20 Live refresh-loss hardening: blank live capture values cannot erase durable accepted captures

- **Decision:** Preserve D14 non-destructive persistence contract by treating blank live capture-string values as non-authoritative during merge when a durable non-empty capture already exists for the same step key.

- **Status:** **Accepted** (2026-08-11)

- **Root cause:** In live refresh/open flows, a step can transiently present an empty run capture field in the live map while durable storage still holds the accepted capture. D14 merge used plain `Object.assign`, so a blank live string for an existing key could overwrite the durable non-empty value, making runIndex persistence appear correct while the step capture disappeared.

- **Consequences:** `mergeWorkflowRunCaptureMaps` now keeps durable non-empty values when the live value for that key is blank; ordinary non-blank live updates still win. This does not weaken Next gating, does not introduce canonical-step fallback, and keeps D13/D14/D15/D16/D17/D18/D19 semantics. Regression added: `merge helper: blank live value does not erase durable accepted capture` in `tests/s75-run-capture-persistence.test.js`. Sprint **76 not opened**.

- **Amendment (real-browser finding, 2026-08-11):** Blank durable placeholder presence is not durable currency. `isWorkflowRunCaptureDurablyCurrent` must treat durable-blank vs accepted-live-nonblank as **not current**, so accepted captures always trigger persistence replacement for the same workflow+step key. Regression added: durable blank placeholder replaced by accepted non-blank DLA capture.

- **Amendment (operator diagnostic hardening, 2026-08-11):** Single global last-capture diagnostics were being overwritten by later non-current step syncs (for example Design Page render-path sync after DLA input), which obscured the actual DLA persist decision. Temporary diagnostics now include per-step records keyed by step id (`workflowRunCapturePersistDiagnostics[stepId]`) with persistence-decision fields (previous/incoming/live/durable lengths, captureChanged, durableCurrent, blockingValidation, shouldPersist, persistAttempted, storageWriteReached). Run sync now distinguishes user input from system reconciliation and ignores blank non-current render syncs so rendering does not masquerade as capture input or churn durable placeholders.

- **Amendment (proven persist boundary, 2026-08-11):** Real-operator trace proved `persistWorkflowRunStateForWorkflow` entered with `shouldPersist=true` but `storageWriteReached=false`. Root cause was storage-write failure at `window.localStorage.setItem` (previously swallowed). Persistence now emits in-function stage markers (`persist_enter` through `setitem_called/completed/readback`), captures exception name/message, and retries quota-like failures after pruning blank placeholder capture keys from runstate records. This preserves accepted non-blank captures for the active workflow while avoiding blank-placeholder bloat that can block durable writes.

- **Amendment (resource-backed run captures, 2026-08-11):** Large Run capture payloads are now treated as workflow-owned resources. Durable capture bodies persist via `PRISM_WORKFLOW_RESOURCES` (IndexedDB-backed owner store), while `promptr.workflows.runstate.v1` remains a lightweight metadata/index rail (capture refs, completion flags, run index, resource refs). Storage-pressure behavior now warns operators near quota and surfaces explicit durability-failure messaging instead of silent success.

---

## S75-D21 — One-off Run capture migration to IndexedDB; ref-only runtime after migration

- **Status:** **Accepted** (2026-08-11)

- **Decision (current architecture):** **Run capture payloads are stored as workflow resources in IndexedDB. localStorage stores lightweight refs and run metadata only.** Root cause of the operator persistence failure was `localStorage` quota on large inline Run captures. Migrating payloads into `PRISM_WORKFLOW_RESOURCES` resolved it. Operator verification confirmed Jamies Maths DLA/GAM persist across refresh and Authoring → Assemble From Current Workflow Run works with hydrated captures. `promptr.runCaptureStorageVersion = 2` marks a migrated installation. Legacy inline bodies (`capturedOutputs` / `capturedOutputsRaw` in runstate) are **migration/recovery only**, not the normal Run contract. Orphaned runstate records remain preserved; storage-management UX is backlog ([PB-FA-007](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-007--user-controlled-storage-management)).

- **History (investigation trail, not primary architecture):** D14–D20 hardened merge/blank/durability behaviour while captures were still localStorage-inline. Those patches remain valid as merge/hydration semantics, but the durable store is now resource-backed (D21). Temporary Copy Run diagnostic / Migrate Run data UI and stage-marker tracing were removed after successful operator migration (cleanup 2026-08-11). Migration remains callable from tests/recovery (`migrateAllWorkflowRunCapturesToResourceStore`).

- **Consequences:** Ref-backed persist/hydrate/restore; textarea bind after hydrate; explicit durability-failure toast + storage-pressure warning retained; no automatic orphan deletion; no silent conflict overwrite. Tests: `tests/s75-run-capture-migration.test.js`, `tests/s75-run-capture-resource-persistence.test.js`, updated `tests/s75-run-capture-persistence.test.js`. Sprint **76 not opened**.

---

## S75-D22 — One workflow → one product; Learning Design Create simplification

- **Decision:** **One workflow produces one product.** A product may contain multiple components, and a workflow may generate many intermediate artefacts to construct that product, but Create must **not** invite multiple independent final products.

  **Learning Design Create (authoritative initial form):**
  1. Workflow name
  2. Domain
  3. What are you creating? (Self-study resource · Workshop only — unchanged from `S75-D11`)
  4. What should this cover? (brief/goal; may include important requirements)
  5. Who is this for?
  6. Scale / scope (duration / breadth)
  7. Starting point (`input_strategy`)
  8. **Conditional** source-material description only when Starting point is Use source material or Combine topic and source material

  **Removed from initial LD Create UI:** Supporting contents and materials (`desiredOutputs`); Scope and constraints (`scopeConstraints`).

  **Compatibility:** Internal `desiredOutputs` / `scopeConstraints` / `workflowOutputs` paths remain for Research and legacy saved workflows. LD Create forces empty `desiredOutputs` / `scopeConstraints` at Design/Save so hidden DOM values cannot invite sibling products (e.g. Self-study + Slide deck). Source description is prose expectation only — not runtime upload/binding. **DLA learner evidence remains separate** and is not wired from Create source material.

  **Current first-class LD Create products:** Self-study resource · Workshop. **Future candidates** (not introduced here): Slideshow, Assessment pack, Module outline — only when product contract + Authoring/render path are mature (pack-declared outputs note from `S75-D11` retained). Future Authoring composition of products into larger products is out of scope.

  **Research:** Retains Expected research deliverables + Scope and constraints on Create for now (no LD product picker; `objective_type` remains the Research product signal via inference/elicitation). Research product selection can be made explicit later.

  **C-08** Create refinement discoverability: **CLOSED AS RESOLVED** (prior investigation — original problem addressed by `S75-D03` retirement + current assistant UX; not implemented as a polish slice).

- **Status:** **Accepted** (2026-08-11)

- **Rationale:** Field-semantics and one-product investigations showed Supporting materials and Constraints were unclear, overlapping, or multi-product inviting. Starting point already owns input posture; source description is only needed when material exists. PRISM should hide workflow/artefact vocabulary and design the workflow from the selected product + brief.

- **Consequences:** Create UI/runtime sync in `app.js` / `index.html`; LD domain uiHints updated; tests in `tests/s75-d22-create-one-product-simplification.test.js` (+ neighbouring C-05/C-06/C-07 green). Architectural debt noted but not redesigned: `session_materials` may still include sibling delivery steps (e.g. slide_deck) via Settings/refinement/legacy; constraint propagation to Run prompts remains weak. Sprint **76 not opened**. Persistence untouched.

---

## S75-D23 — Workflow Design Assistant progressive disclosure

- **Decision:** Apply **progressive disclosure** to the Create Workflow design assistant resting state. Show controls only when the user needs them.

  **No usable API key:** Design workflow is **disabled**; actionable status **API key required** reveals/focuses the existing header `#apiKeyFile` loader (`revealOpenAiApiKeyEntry`, silent — not an error). Remove the resting prose “An OpenAI API key is needed…”. Create remains navigable; brief fields remain editable (`S75-D09` navigation rule retained).

  **Key present:** Design workflow enabled; **API key required** absent. Do **not** show Ready / API key loaded /Configured reassurance for the key — the enabled button is enough.

  **Resting chrome:** No Idle badge; hide empty design log; hide Your answer / textarea / Send until the assistant is awaiting input (domain suggestion, inference confirmation, or elicitation queue). Meaningful runtime statuses (Designing…, Needs essentials, Refining quality, etc.) remain.

  Explicitly **out of scope:** refinement/generation semantics; API-key storage/persistence; redesign of Create; C-08; Sprint 76.

- **Status:** **Accepted** (2026-08-11)

- **Rationale:** After `S75-D22` simplified the brief, the inactive assistant still exposed configuration and answer UI before there was anything to do. Progressive disclosure keeps the resting surface quiet.

- **Consequences:** UX sync via `syncWorkflowFactoryDesignAssistantChrome` / `setWorkflowDesignStatusBadge`; tests in `tests/s75-d23-create-assistant-progressive-disclosure.test.js` (+ C-05 amendments for disabled Design). Amends C-05 **presentation** only (Design disabled without key + proactive key action); does not reintroduce a navigation gate. Sprint **76 not opened**.

---

## S75-D24 — Hide Resolved workflow brief panel; keep resolution engine

- **Decision:** **Resolved workflow brief / factor provenance is internal workflow-design state, not normal user-facing UI.** Required unresolved information is surfaced through **natural-language assistant elicitation**.

  **Remove from Create UI:** the expandable “Resolved workflow brief” panel (`#wfBriefResolvedDetails` and its explicit/inferred/defaulted tables, assumption detail, step mappings, planning/debug copy, and machine-state missing-factor diagnostics).

  **Retain:** `state.workflowBriefResolved`, explicit/inferred/defaulted factors, provenance helpers, missing-required tracking, mappings, resolution/elicitation/refinement queues, and call sites that assign resolution state. `renderWorkflowBriefResolvedPanel` becomes a **presentation no-op** so design flow never depends on mounting a diagnostic view.

  **Missing factors:** continue to block via assistant questions (e.g. learner_level → “What learner level should this workflow target?”). Do not weaken required-factor gates. Do not add replacement “assumptions” badges/panels. Applies to Learning Design and Research Create presentation alike.

  Historically the panel was valuable for debugging elicitation; that role is preserved via state, tests, and internal helpers — not via user-facing Create chrome.

- **Status:** **Accepted** (2026-08-11)

- **Rationale:** After `S75-D22`/`S75-D23` quieted Create, the remaining diagnostic brief panel still exposed implementation vocabulary. Users already receive needed questions through the Workflow design assistant.

- **Consequences:** Markup removed from `index.html`; renderer no-op in `app.js`; tests in `tests/s75-d24-hide-resolved-brief-panel.test.js` (+ existing `workflow-brief-panel-ux` helpers remain green). Sprint **76 not opened**. Persistence untouched. Generation/elicitation semantics unchanged.

---

## S75-D25 — Create Proposed workflow: one graph, read-only preview

- **Decision:** Create presents **one** generated workflow as a compact **read-only Proposed workflow** preview. Retire Create-time **Draft / Refined** version chrome and Create-time graph-edit controls (title/role inputs, Delete, Tunable badges, per-row Settings cues). **Save Workflow** is the primary commitment action and always saves `state.workflowDesignResult`. Detailed tuning belongs to the **saved workflow / Settings** experience. Do **not** broadly delete pack `post_generation_refinement` / `stepRefinementProfiles` machinery (future Settings/pack cleanup under **[PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency)**). Prompt Studio Draft/Refined remains separate and unchanged.

- **Status:** **Accepted** (2026-08-11). Create UX pass for Sprint 75 recorded **COMPLETE** after this decision (plus presentation polish below).

- **Rationale:** Investigation showed Create Draft/Refined were identical deep copies with no production path producing a distinct Refined graph — Prompt Studio–style scaffolding, not durable versioning. Editable step cards implied Create is a graph editor; the meaningful Create decision is whether to save the proposal. Assistant already points users to Settings after generation.

- **Historical distinction:**
  - **Prompt Studio Draft/Refined** — legitimate prompt-text versions (`#promptVersionSelect`).
  - **Create Draft/Refined** — non-durable twin-copy scaffolding (retired from UI / generation twinning).
  - **Pack post-generation factor refinement** — separate dormant/policy-limited machinery; **not** removed by this decision.
  - **S75-D03** generic LLM reviewer — already retired; unrelated to Draft/Refined chrome.

- **Presentation polish (same decision; no new decision ID):** table column proportions ~9% / 53% / 38% (Step / Workflow step / Purpose) with `table-layout: fixed`; button label **Save Workflow** (was “Save as workflow”). Cache-bust `app.js?v=20260811-s75-d25b` / `style.css?v=20260811-s75-d25b`.

- **Consequences:** `#wfDesignVersionSelect` removed; heading **Proposed workflow**; compact semantic table preview; Create edit/delete mutation paths removed; D03 regression no longer requires version select; tests in `tests/s75-d25-proposed-workflow-readonly-preview.test.js`. Persistence untouched; Sprint 76 not opened. Next product/design review: **My Workflows** functional audit.

---

## Decision / investigation tracker

Programme tracker for Sprint 75 topics (many entries are **Done** / **Deferred** / **Next** — this is **not** a “pending only” list). Accepted decision text above is unchanged.

| Topic | Status | Notes |
| ----- | ------ | ----- |
| Authorise execution of S75-T-010 | **Done** | 2026-08-10 |
| Authorise S75-T-011 / T-012 / T-013 | **Retired** | Superseded — use S75-T-020 candidate slices |
| Authorise S75-T-020 intervention slices | **Partial** | C-01…C-07/C-10 Done; **C-08 CLOSED AS RESOLVED** (`S75-D22`); **C-09/C-11/C-12 deferred** |
| Create one-product simplification (LD) | **Done** | `S75-D22` |
| Create assistant progressive disclosure | **Done** | `S75-D23` |
| Hide Resolved workflow brief panel | **Done** | `S75-D24` |
| Create Proposed workflow read-only / retire Draft–Refined chrome | **Done** | `S75-D25` (Create UX pass **COMPLETE** for this Sprint 75 pass) |
| My Workflows functional audit + identity CRUD (Rename/Duplicate/Delete/Import/Export) | **Next** | Operator walkthrough; Rename defect known (must keep identity); Duplicate = clean Run state (decided). Historical **C-09** remains a separate deferred slice until audit determines overlap. |
| Domain B first-time selection / mode persistence rules | **Done** | `S75-D10` (Run default + session preservation + Create→Run handoff) |
| Run paste/store-output visibility rule | **Done** | `S75-D07` (page-structure producer visibility) |
| Custom vs runtime-aware stored-output behaviour | **Done** | under `S75-D07` (non-page `outputName` ≠ paste; page producer keeps gate) |
| Run operator copy + execution-bar layout | **Done** | `S75-D08` (Run-UI-only descriptions; top Prev/Copy/Next bar) |
| Create Workflow API-key prerequisite (C-05) | **Done** | `S75-D09`; presentation amended by `S75-D23` |
| Separate human Instructions from PRISM_STEP_PARAMS storage | **Deferred** | Smell noted under **PB-FA-005**; not redesigned in `S75-D08` |
| Domain B Settings / parameterisation | **Deferred** | Investigation complete — [PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency); major review after My Workflows |
| Domain C Authoring + B→C handover | **Done** | Evidence recorded 2026-08-10; thin handoff/provenance **Done** (`S75-D04`) |
| Authoring workflow provenance / assemble entry | **Partial** | Done for selected/assembled identity + mismatch (`S75-D04`); same-workflow run freshness **deferred** |
| Authoring peer-tab IA equivalence | **Deferred** | Operator evidence §3.29 — later consideration, not redesign |
| SCORM / future export formats | **Deferred** | Future product context — not Sprint 75 task |
| Copilot follow-up suppression (prompt vs host UI) | **Deferred** | Operator evidence §3.19 |
| Refinement/QA step provenance and executable integrity | **Done** | Investigation + `S75-D03` retirement; future lifecycle **PB-FA-006** |
| My Workflows Edit validation false positives | **Done** | `S75-D05` (validator aligned with Run; no migration) |
| Run BYO-LLM execution orientation (C-03) | **Done** | `S75-D06` (+ C-04 compact one-line wording under `S75-D07`) |
| Supported LD Create output honesty (C-06) | **Done** | `S75-D11` (Self-study resource · Workshop only) |
| Authoring Learning object presentation format | **Retired** | `S75-D12` |
| Authoring assembly readiness (EP shell ≠ learner-ready) | **Done** | `S75-D13` |
| Run capture persistence non-destructive merge | **Done** | `S75-D14` |
| DLA evidence_decision instructional-scaffold false positive | **Done** | `S75-D15` |
| DLA partial-page activities[] false-positive validation | **Done** | `S75-D16` |
| Generated-workflow Run persistence identity (durable step.id) | **Done** | `S75-D17` |
| Run position session-only; captures durable across sessions | **Done** | `S75-D18` |
| Accepted Run capture durability when in-memory value is unchanged | **Done** | `S75-D19` |
| Blank live capture overwrite of durable accepted key | **Done** | `S75-D20` |
| One-off Run capture migration + ref-only runtime | **Done** | `S75-D21` (operator-verified; diagnostic UI cleaned up) — persistence **SETTLED** |
| Rename / Duplicate / Delete runstate identity hygiene | **Next** | Under My Workflows audit — Rename defect known (must keep identity); Duplicate clean-Run contract decided; Delete/Import/Export still to audit (`S75-D14` residual) |
| Domains D–E detailed discovery sequencing | **Pending** | Not started — operator to prioritise |
| Any architectural work arising from UX findings | **Pending** | Explicit operator authorisation only |
| Open Sprint 76 | **Pending** | Separate operator decision (not relevant yet) |
