# PRISM Product Backlog

**Canonical location:** `docs/backlog/PRODUCT-BACKLOG.md`  
**Status:** Active — maturation / v1.0 stabilisation phase  
**Last updated:** 2026-08-14 (GAM ordinary markdown-body output-contract repair closed as bounded maintenance; Sprint 77 remains CLOSED)  
**Source migrations:** Sprint 72 cut-line (`S72-T-077`); Sprint 71 disposition audit; Sprint 73 closeout; Sprint 74 open; Sprint 75 Settings investigation + QA/review retirement + one-product Create (`S75-D22`); historical notes in `ideas.md`, `known-issues.md`, `future-directions.md` (see [README.md](README.md))

---

## Planning principle (binding)

> A backlog item should only enter a sprint when it has a concrete implementation approach, clear ownership and acceptance criteria. Ideas and possible future enhancements remain in the product backlog until they are ready for planning.

**How the next sprint is selected:** Pull a sufficiently mature item from **Stabilisation** or **Future architecture** below. Do **not** pre-assign a sprint number to a feature until a sprint pack is opened with approach and acceptance criteria.

---

## 1. Stabilisation

Concrete defects, friction, polish and robustness. Suitable to pull into a sprint once understood.

| ID | Observation | Impact | Possible direction | Readiness |
| -- | ----------- | ------ | ------------------ | --------- |
| PB-S-001 | Broader `sprint-72-evidence-centred-activity-slice.test.js` has **28 known pre-existing failures** tied to `intellectual_coherence_bridge` fixture enrichment | Focused suites pass; full suite not green — risk of false confidence | Enrich fixtures or align validators; keep focused suites authoritative until resolved | **Investigation needed** — not sprint-ready |
| PB-S-002 | Residual nav / long-title / heading a11y polish beyond Sprint 72 bounded T-056 fixes | Occasional overflow / hierarchy friction on long titles | Targeted CSS / nav acceptance criteria | **Partial** — needs clear acceptance criteria |
| PB-S-003 | Historical UX/runtime friction notes (inspectability, `app.js` state complexity, domain-pack overlap) | Ongoing author friction and maintenance cost | See legacy [known-issues.md](known-issues.md); promote only when scoped | **Low readiness** — needs scoping |
| PB-S-004 | Duplicate / legacy UI–state pathways | Clarity and regression risk | Incremental rationalisation with fixtures | **Low readiness** |
| PB-S-005 | **Stable release / development process** (includes asset cache-bust discipline) | Stale `index.html` `?v=` / `app.js` mismatches and Sprint 75 persistence debugging showed operators cannot always know which code is running; no repeatable path from active development to a known-good stable release | Establish a release-engineering process (dev vs stable, versioning, cache-bust, regression gate, checklist, rollback) — see detailed scope below | **Partial** — known debt from S74A / S75; needs approach + acceptance criteria |

### PB-S-005 — Stable release / development process

**Product problem:** PRISM lacks a repeatable path from active development to a **known-good stable release**. Cache-bust mismatches (`index.html` `?v=` vs `app.js`) and Sprint 75 persistence debugging demonstrated that knowing **exactly which code is running** is a product reliability concern, not a cosmetic nicety.

**Why it matters:** Without a stable/release discipline, investigation and operator verification waste time on stale assets; a bad release is hard to recognise and hard to roll back; development and “what users should trust” blur together.

**Product goal (not implementation speculation):** Establish a release-engineering / process capability so PRISM can preserve a known-good stable build while development continues, and update/deploy with confidence.

**Scope sketch (absorbing former cache-bust-only framing):**

1. **Development vs stable/release state** — Clear distinction between in-progress work and a cut that operators may treat as known-good.
2. **Versioning / release identifiers** — Human- and machine-visible markers for which build is running (where appropriate); do not invent a second competing versioning system without need.
3. **Asset / cache-bust discipline** — Reliable convention (and later automation) for bumping browser asset `?v=` (and equivalents) when shipping changed assets — the original PB-S-005 core.
4. **Regression-test gate** — What must be green before a cut is called a release.
5. **Release checklist** — Repeatable readiness checks (docs/version alignment, smoke journeys, known defects).
6. **Documentation / version alignment** — STATUS, decisions, and shipped behaviour stay consistent with the cut.
7. **Backup / rollback / recovery** — How to recover from a bad release without losing operator data unnecessarily.
8. **Preserve known-good while developing** — Procedure for keeping a stable baseline available alongside ongoing work.
9. **Deployment / update procedure** — How an installation is updated to a release cut.
10. **Release readiness definition** — Explicit criteria for what constitutes “ready to call stable.”

**Explicit non-scope (for backlog placement):** Implementing the process in Sprint 75; opening Sprint 76; redesigning product features under the guise of “release work.”

**Evidence:** Sprint 75 operator/debug experience (stale assets; persistence investigation needing certainty about running code); S74A/S75 cache-bust debt.

**Readiness:** Problem is documented; **approach and acceptance criteria not yet written** — Stabilisation candidate, **not sprint-allocated**.

---

## 2. Future architecture

Coherent capabilities large enough to become a sprint. **No sprint numbers assigned.** Do not create detailed sprint plans here.

### PB-FA-001 — Workflow Resources

**Product-facing capability:** First-class **Workflow Resources** — durable learner-facing and workflow-bound assets that authors and learners can rely on across refresh, navigation, export, and regeneration.

**Sprint 73 outcome (COMPLETE / Closed 2026-08-06):** Established the workflow-scoped Workflow Resources owner; IndexedDB-backed generated-image persistence with same-browser/profile rehydration; downloadable Additional Resources; one provider-supplied embedded video with page-owned presentation; authoring tabs and Orient-supporting learner presentation. See [SPRINT-73-FINAL-REPORT.md](../development/sprints/2026-08-06-sprint-73-workflow-resources/SPRINT-73-FINAL-REPORT.md) · [SPRINT-73-CLOSURE.md](../development/sprints/2026-08-06-sprint-73-workflow-resources/SPRINT-73-CLOSURE.md).

**Remaining under this theme (not Sprint 73):** Conversation-attachment byte persistence (`S72-D10` / PB-R-001); orphan/mixed-data cleanup; cross-device/server sync; package re-import; central resource library. **Manually uploaded graphics** (non–visual-job images) are tracked separately as [PB-FA-004](#pb-fa-004--manually-uploaded-graphics).

**Bounded maintenance (2026-08-14, not a sprint):** **Graphics / image lifecycle — stale images survive Clear Run Data** (queue G; S76-T-037 G; S76-T-029 out of scope) — **CLOSED**. Clear Run Data now purges current-workflow generated visual-job images (`binary` + `image/*` + non-empty `affordance_id`) and resets live Graphics state. Additional Resources, `page_video_embed`, and other workflows are preserved. This is **not** PB-FA-004, PB-R-008, or PB-FA-007.

**Evidence basis:** `S72-D09`, `S72-D10`; Sprint 73 decisions `S73-D01`…`S73-D03` and implementation/verification notes in the Sprint 73 pack.

**Readiness:** Sprint 73 **COMPLETE / Closed** (2026-08-06). Residual follow-ons are separate backlog items — do not continue work under Sprint 73.

**Former Sprint 72 links (retired from S72):** T-040 remaining, T-041, T-042, T-044, T-051, B-002.

### PB-FA-002 — Programming learning-resource support

**Evidence basis:** `S71-F-014` (Confirmed); Sprint 72 operator backlog `S72-B-003`; requirements task never started in Sprint 72.

**Scope sketch:**

- Learner code handling
- Programming-specific workspaces
- Language-aware rendering
- Programming evidence and feedback

**Readiness:** Evidence of need exists; **implementation approach and acceptance criteria not yet written** — mature enough to remain Future architecture, not yet sprint-allocated.

**Former Sprint 72 links:** T-052, B-003.

### PB-FA-003 — Pipeline integrity

**Evidence basis:** Sprint 72 capacity cut-line / operator hardening notes; public-export vs Node-module path divergence lesson in Sprint 72 (browser-bundle parity).

**Scope sketch:**

- Finalized-page schema-currency audit
- Model-to-DOM / render-closure validation
- Renderer-contract validation

**Readiness:** Direction clear; needs concrete audit plan and acceptance criteria before sprint open. Sprint 74 discovery ([S74-T-001](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-001-codebase-rationalisation-discovery.md)) recommends a **74A** domain aligned with this item — **74A is not opened**.

### PB-FA-004 — Manually uploaded graphics

**Product need:** Authors should be able to add an existing image directly through the Graphics authoring area without requiring an AI-generated visual job.

**Desired behaviour:**

- Allow an author to upload an image as a graphic
- Persist it through the established Workflow Resources owner
- Allow it to participate in learner rendering and packaging
- Present generated and manually uploaded graphics through the same Graphics authoring concept
- Distinguish origin only where useful
- Do not require the learner renderer or package builder to care whether a graphic was generated or uploaded

**Architectural alignment:**

- Uploaded graphics are Workflow Resources
- Use the existing resource-type-neutral owner
- Use the existing binary-payload persistence path
- Do not create a separate image attachment system
- Do not assume a graphic must originate from a visual job
- Image origin may be recorded as minimal metadata if required
- Renderer and package output consume the same image-resource projection

**Predecessor evidence:** Sprint 73 Workflow Resources architecture — [PB-FA-001](#pb-fa-001--workflow-resources); [S73-T-002](../development/sprints/2026-08-06-sprint-73-workflow-resources/S73-T-002-canonical-workflow-resource-ownership.md); [S73-T-011](../development/sprints/2026-08-06-sprint-73-workflow-resources/S73-T-011-generated-image-persistence-implementation.md); [S73-T-020](../development/sprints/2026-08-06-sprint-73-workflow-resources/S73-T-020-workflow-resources-generalisation-design.md); [SPRINT-73-FINAL-REPORT.md](../development/sprints/2026-08-06-sprint-73-workflow-resources/SPRINT-73-FINAL-REPORT.md).

**Explicit non-scope (for this item):**

- Implementation in Sprint 73
- AI image generation changes
- Central media library
- Cross-workflow resource sharing
- Image editor
- Automatic image optimisation
- Bulk upload unless separately prioritised
- Learner-renderer redesign

**Readiness:** Evidence of need and architectural alignment exist after Sprint 73; **implementation approach and acceptance criteria not yet written** — Future architecture candidate, **not sprint-allocated**.

### PB-FA-005 — Workflow Settings / parameterisation source-of-truth and runtime consistency

**Also covers (expanded 2026-08-11 after `S75-D22`):** Settings **information architecture / product semantics** review — what belongs in Settings vs Create vs defaults vs refinement; terminology; hierarchy; global / domain / product / workflow layers; interaction with pack-declared products. Not visual polish alone.

**Product problem:** My Workflows → **Settings** provides a functioning UI and persistence mechanism for pack-declared workflow and step parameters, but (1) edited values are **not consistently authoritative** for subsequent **Run** prompt construction and runtime behaviour, and (2) as Create and Run increasingly **hide internal complexity** (`S75-D22`), Settings still risks exposing implementation concepts, unclear hierarchy, and choices that belong in Create, defaults, or refinement instead. This is both a **parameter / source-of-truth** problem and a **Settings information-architecture / product-semantics** problem — not merely a Settings presentation problem.

**Evidence basis (Sprint 75 — discovery + implementation investigation, 2026-08-10…11):**

- Operator observation: Settings is intentionally important for reusable workflows; full elicitation is not the target model; a representative Learning Design workflow exposed ~**25** pack-declared controls; experienced users may legitimately tune workflows before running them. See [S75-T-010-domain-a-operator-observation-synthesis.md](../development/sprints/2026-08-10-sprint-75-prism-user-experience-and-interface/S75-T-010-domain-a-operator-observation-synthesis.md) (§§3.5–3.7, 3.21, Part II) and [CONTEXT.md](../development/sprints/2026-08-10-sprint-75-prism-user-experience-and-interface/CONTEXT.md).
- Implementation investigation (same programme): Settings → Save workflow → **Run** does not reliably consume the values the user just chose. Configuration state is distributed across multiple representations that can **diverge after workflow creation**, including:
  - `workflowBriefResolution.resolvedFactors` (frozen at create/save)
  - `workflowOutputSpec` / constraints text
  - workflow-level `[PRISM_STEP_PARAMS]` in `workflow.notes`
  - step-level `[PRISM_STEP_PARAMS]` in `step.notes`
  - baked `override_prompt_body` on steps (Run Copy primary body)
  - Prompt Studio–generated / saved prompt bodies
  - runtime prompt augmentations (often reading frozen brief resolution, not live Settings)
- **Prompt Studio shared dependency:** My Workflows Settings and Prompt Studio workflow-step configuration share the same pack-parameter storage and `renderWorkflowPackParameterControlsSection()` infrastructure (`[PRISM_STEP_PARAMS]` in notes). PS can regenerate drafts from parameter values; Run assembles prompts through a different path (`buildWorkflowStepInstructions()` + `resolveStepPromptText()`). Parameter-contract changes must account for both surfaces — **not** a Prompt Studio UX redesign in this item.
- **My Workflows Settings** (workflow Settings tab) is **distinct** from the step header **“Settings…”** control, which opens Prompt Studio workflow-step mode — naming collision documented in Sprint 75; do not conflate in implementation.
- **`S75-D22` Create simplification:** LD Create no longer surfaces Supporting materials / Scope-and-constraints. Residual **weak constraint → Run prompt propagation** remains architectural debt under this item (constraints are not reliably enforced downstream). Product components that belong in defaults/refinement/Settings must not reappear as Create “second products.”
- **`S75-D25` Create Proposed workflow:** Create-time Draft/Refined chrome and Create graph-edit controls retired. Pack **`post_generation_refinement` / `stepRefinementProfiles`** machinery is **retained** but largely dormant by policy; any cleanup or re-homing of those factors into Settings IA belongs here — **not** a Create reintroduction of chat-based parameter interviews.

**Scope (for a future sprint — not prescribed here):**

**A. Parameter contract / runtime consistency**

1. **Settings → Run consistency** — Ensure values edited in My Workflows Settings are consumed by subsequent Run prompt construction / runtime behaviour. Avoid Run continuing to use creation-time `override_prompt_body`, frozen `resolvedFactors`, stale `workflowOutputSpec`, or other derived configuration after the user has saved new Settings values.

2. **Authoritative parameter model** — Establish a coherent source-of-truth for workflow configuration **after creation**. Clarify relationships among: elicited/resolved values; reusable workflow defaults; workflow-level vs step-level parameters; prompt-generation parameters; run-time values. Prevent multiple independently editable representations drifting out of sync.

3. **Workflow definition vs run configuration** — Investigate/define the distinction between **reusable workflow definition** and **parameters for a particular use/run**. Current architecture stores many effective run parameters inside the saved workflow definition; there is no distinct per-run configuration/profile layer. Relevant reuse cases (do not prescribe run-profile implementation unless product decisions establish one): same workflow, different topic / audience / duration; generated source vs uploaded transcript; changed activity or assessment configuration.

4. **Settings coverage review** — Audit supported step Settings coverage against meaningful tunable behaviour (not “every step must have settings”). Known findings to inform the review:
   - **Design Episode Plan** — no Settings is **intentional** (deterministic derive step; `executionMode: deterministic_derive`).
   - **Generate Learning Content** — no Settings appears a **likely coverage gap** for an LLM-driven reusable step.
   - **Design Page** — unified Settings exposes only part of available parameter set (`page_profile`, `include_examples`; other `userOptions` seeded from brief mapping only).
   - Stale/obsolete configuration may remain around older review/feedback steps.
   - Pack source: `domains/learning-design/domain-learning-design-step-patterns.md` (`workflowParameterControls`, `stepParameterControls`, `mappingRules`).

5. **Workflow-level / step-level consistency** — Resolve cases where equivalent values exist at multiple levels and can diverge (e.g. `duration_minutes` at workflow level and on Construct Learning Sequence). Establish intended precedence / single source of truth.

6. **Verification requirement** — Future implementation must include controlled verification that Settings changes have real behavioural consequences. Suggested operator pattern: same workflow + same input + same external model where practical + change **one** setting → verify Run prompt and/or downstream artefact changes as intended. Static tests should verify parameter propagation / source-of-truth where possible.

**B. Settings information architecture / product semantics** (coordinate with A; do not treat as “visual polish only”)

End-to-end review of Settings now that PRISM hides more internal complexity at Create/Run. Questions to answer:

- What genuinely belongs in Settings?
- What should instead be inferred / defaulted?
- What belongs in Create?
- What should be elicited through refinement only when relevant?
- Are any settings exposing PRISM implementation concepts rather than meaningful user choices?
- Is terminology understandable?
- Is the hierarchy / scanning sensible?
- Which settings are global, domain-specific, product-specific, or workflow-specific?
- How should Settings interact with domain packs and future product declarations ([PB-FA-008](#pb-fa-008--first-class-slideshow-product--architecture-extensibility-test))?

**Outcome criteria (when mature enough to plan):** Settings changes are behaviourally authoritative at Run; Settings surfaces only meaningful user choices at appropriate layers; Create / refinement / Settings responsibilities are coherent under **one workflow → one product** (`S75-D22`).

**Explicit non-scope (for backlog placement):**

- Sprint 75 implementation (deferred — see Sprint 75 STATUS)
- Implementing Settings IA changes **without** coordinating on parameter-contract resolution (UI/IA may follow or run in parallel once contract direction is clear)
- Prompt Studio UX review or redesign
- Automatic assignment to Sprint 76 or any future sprint number
- Prescribing a specific run-profile / per-run overlay implementation

**Sprint 75 posture:** Settings **observations remain valid evidence**. Underlying parameter-contract and Settings IA work are **deferred to this backlog item** for later prioritisation.

**Readiness:** Problem and divergence mechanisms are **documented** from Sprint 75 investigation; **implementation approach, migration strategy, and acceptance criteria not yet written** — Future architecture candidate, **not sprint-allocated**.

**Related stabilisation signals (do not duplicate):** [PB-S-003](#pb-s-003) (historical UX friction) · [PB-S-004](#pb-s-004) (duplicate UI–state pathways) · [ideas.md](ideas.md) (“richer parameter systems” — superseded for planning by this item) · `S75-D22` (Create simplification; weak constraint→Run debt).

### PB-FA-006 — QA / workflow and resource refinement lifecycle

**Product problem:** PRISM does **not** currently have a coherent **productised closed-loop** QA / refinement model (inspect → diagnose → decide what to change → regenerate) usable by ordinary authors inside the product. That is **not** the same as “QA does not exist.” Sprint 71 already ran a **fledgling post-hoc, artefact-level** Benchmark + Validation corpus-review process on produced learner resources. Sprint 75 (`S75-D03`) **retired** the unsafe Create Workflow **generic “Review & suggest improvements”** path (freeform invented “review” steps → fuzzy canonicalisation → duplicate production steps at Run). Retirement separates QA from an **unsupported in-workflow execution model**; it does **not** abandon QA. Eventual direction is expected to look **substantially more like** Sprint 71 artefact inspection than like inserting generic QA steps into executable workflows.

#### Prior art / starting evidence — Sprint 71 corpus QA (not target architecture)

PRISM is **not** starting from zero on post-workflow QA. Future work under this item should **begin by evaluating and evolving** the Sprint 71 methodology before inventing a wholly new QA model.

| Aspect | What Sprint 71 actually did (evidence-backed) |
| ------ | ----------------------------------------------- |
| **Process** | Generate a Prism learner resource → run **Prism Resource Quality Benchmark v2.1** → run **Prism Benchmark Validation Review v2.0** → compare → treat benchmark findings as **hypotheses** until validated → classify Confirmed / Partially confirmed / Rejected / New → attribute validated findings to Learning Design pipeline stages → update recurrence in an improvement register → synthesise across resources |
| **Artefacts inspected** | Produced **learner-facing resources** (page / export / packaged resource as used in each review) — post-generation, **not** invented intermediate workflow “QA steps” |
| **Corpus** | **11** closed reviews (`S71-R-001`–`S71-R-011`) across Life Sciences, Social Sciences, Humanities/History, Mathematics, Engineering, Computing, Biology, English Literature — short of original ~15–20 sample target |
| **Recording** | Per-resource review files; [review-logging-template.md](../development/sprints/2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/review-logging-template.md); [improvement-register.md](../development/sprints/2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/improvement-register.md) clusters (`S71-F-*`, `S71-O-*`); [review-metadata-index.md](../development/sprints/2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/review-metadata-index.md); [cross-resource-synthesis.md](../development/sprints/2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/cross-resource-synthesis.md); [design-principles.md](../development/sprints/2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/design-principles.md) |
| **Automated vs operator-led** | **Operator-led / offline instruments** (Benchmark v2.1 + Validation Review v2.0). In-repo instrument paths remain **unresolved** ([PB-R-007](#pb-r-007)). Sprint 71 did **not** ship an in-app QA product surface |
| **What it demonstrated** | Instructional quality is **materially steerable** via pedagogically informed workflow guidance (controlled Owen pair `S71-R-010` **88/100** → `S71-R-011` **91/100`); residual Critical limits increasingly concern **evidence availability**; lasting quality belongs in Layer-1 defaults / Layer-2 elicitation / Layer-3 author supply — not ever-longer free-text prompts; six **validated candidate architectural principles** frozen |
| **What it could not / did not do** | Did **not** rewrite canonical prompts (chartered); did **not** productise a closed inspect→change→rerun UX; did **not** automate scoring in-app; did **not** resolve instrument in-repo homes; sample volume incomplete vs original target; did **not** claim Benchmark/Validation as final product architecture |
| **Findings → change?** | Findings fed **registers, synthesis, principles, and successor planning** (e.g. Sprint 72 productisation of principles). The Owen pair regenerated under **different briefs as research arms**, not as an in-product “QA failed → apply fix” loop |

**Authoritative Sprint 71 anchors:** [SPRINT-71-FINAL-REPORT.md](../development/sprints/2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/SPRINT-71-FINAL-REPORT.md) · [SPRINT-71-CHARTER.md](../development/sprints/2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/SPRINT-71-CHARTER.md) · [sprint-71-closeout.md](../sprints/sprint-71-closeout.md) · [SPRINT-71-DISPOSITION-AUDIT.md](../development/sprints/2026-07-31-sprint-72-productising-instructional-architecture/SPRINT-71-DISPOSITION-AUDIT.md).

**Future QA work under PB-FA-006 should:**

1. Evaluate and evolve the Sprint 71 corpus-review methodology (reusable / scalable / automatable parts; preserve useful human judgement).  
2. Inspect **actual produced learner artefacts** rather than assume QA belongs inside workflow execution.  
3. Avoid designing a wholly new QA model without first understanding this evidence.  
4. **Not** declare Sprint 71 Benchmark/Validation the final target architecture.

#### Evidence basis (Sprint 75 — why the generic in-workflow path was retired)

- Operator observation: refinement/QA suggestions produced incoherent Run steps (duplicate adjacent production stages). See [S75-T-010 operator synthesis](../development/sprints/2026-08-10-sprint-75-prism-user-experience-and-interface/S75-T-010-domain-a-operator-observation-synthesis.md) (§§3.10–3.12, §3.20) and [S75-T-020 Theme 8](../development/sprints/2026-08-10-sprint-75-prism-user-experience-and-interface/S75-T-020-cross-journey-ux-evidence-synthesis-and-intervention-framing.md).
- Investigation: generic reviewer LLM could invent arbitrary titles; save-time `pickCanonicalWorkflowStepTitle` fuzzy-mapped e.g. “Review Learning Outcomes” → “Define Learning Outcomes”; save path did not re-run heuristics/`maxOccurrences` dedup. No **generic executable intermediate-artefact QA step model** exists — and inventing one via freeform graph surgery was unsafe.
- Operator product hypothesis (not design): QA belongs **after** learner artefacts exist (Sprint 71-like inspection), then findings feed brief / Settings / prompts / rerun — rather than as inserted workflow graph stages.

#### Product boundary (keep concepts distinct)

| Concept | Status relative to PB-FA-006 |
| ------- | ---------------------------- |
| Generic Create Workflow review-step insertion | **Retired** (`S75-D03`) — do not reintroduce |
| Sprint 71 Benchmark + Validation corpus review | **Prior art / starting methodology** — evolve; not abandoned |
| Assessment-specific pack steps (Design Feedback, Validate Learning Design, Revise Assessment Based on QA, Design Marking Rubric) | **Distinct supported** pack concepts where applicable |
| Prompt Studio **prompt-text** review | **Distinct** |
| Pack-driven **post-generation brief-factor** refinement (`stepRefinementProfiles`) | **Distinct** |
| Learner **guided-review** content features | **Distinct** |
| Offline Benchmark / Validation instruments in-repo | Unresolved research — [PB-R-007](#pb-r-007) |

Future work should **rationalise** how these relate — **not** collapse them prematurely into one mechanism.

#### Improvement loop to investigate (not target architecture)

```text
GENERATE / RUN
  → ASSEMBLE
  → INSPECT
  → QA
  → DIAGNOSE
  → DECIDE WHAT TO CHANGE
  → REGENERATE / RERUN
```

**Unresolved problem pair (investigation):**

1. Does this resource pass QA?  
2. **Given the QA findings, what should change before the next attempt?** ([PB-R-010](#pb-r-010))

Sprint 71 answered (1) richly for a research corpus and attributed causes for successor planning; it did **not** productise (2) as an author-facing closed loop.

**Potential intervention targets to investigate (not accepted architecture):**

- original brief / elicited intent  
- workflow design / structure  
- workflow parameters / Settings ([PB-FA-005](#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency))  
- per-run configuration ([PB-R-009](#pb-r-009))  
- prompt configuration / Prompt Studio  
- particular generated intermediate artefacts  
- final learner content (manual edit)  
- selected-step rerun  
- complete workflow rerun  

#### Scope (investigation questions for a future sprint — not prescribed solutions)

1. **Evolve Sprint 71 methodology** — Which Benchmark / Validation / register / attribution practices are reusable, scalable, or automatable? Where must operator judgement remain? Where should instruments live ([PB-R-007](#pb-r-007))?

2. **Brief refinement** — Can QA identify insufficient / ambiguous / misdirected briefs? How might findings help improve desired output, audience, duration, scope, constraints, source/input strategy, or other elicited factors? (Owen controlled pair is starting evidence of brief steerability.)

3. **Workflow refinement** — When is the workflow structure itself the problem (missing / unnecessary step, sequencing, wrong workflow type, unsuitable prompt configuration)? How should structure changes be proposed **without** inventing unsupported freeform step types?

4. **Parameter / Settings refinement** — Can QA identify sound structure with wrong configuration? Coordinate with [PB-FA-005](#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency) and [PB-R-009](#pb-r-009); do **not** prescribe Settings implementation here.

5. **Prompt refinement** — When should intervention change a prompt rather than the workflow? Prompt Studio may participate later; Domains D/E UX discovery remains deferred in Sprint 75.

6. **Content / artefact QA** — Continue and productise **post-workflow** inspection of produced learner-facing content (page JSON, assembled resource, rendered experience, accessibility, factual / instructional quality, alignment, completeness, usability, assessment quality where applicable), building from Sprint 71 dimensions rather than a blank rubric. Do **not** redefine the full Benchmark instrument in this backlog item.

7. **Diagnose → decide → regenerate** — How should findings map to a better second attempt (revised brief, parameters, prompts, selected-step rerun, full rerun, manual edit)? Investigation only — see [PB-R-010](#pb-r-010).

8. **Rationalise existing review/validation concepts** — Map relationships among Sprint 71 corpus QA, assessment pack QA steps, Prompt Studio review, post-generation factor refinement, and guided-review — without assuming they are one mechanism.

**Explicit non-scope:**

- Reintroducing generic Create Workflow freeform review-step insertion (`S75-D03`)
- Declaring Sprint 71 Benchmark/Validation the final product QA architecture
- Sprint 75 UX redesign of Authoring / Run beyond the retirement already shipped
- Automatic assignment to Sprint 76
- Settings / PB-FA-005 implementation
- Prompt Studio or Prompt Library UX programme
- Implementing Benchmark instruments in-app without resolving [PB-R-007](#pb-r-007)

**Sprint 75 posture:** Generic in-workflow reviewer **retired**. Future QA/refinement lifecycle **deferred here**, with Sprint 71 as explicit prior art. Historical operator observations remain valid evidence.

**Readiness:** Problem framing, S75-D03 retirement, and Sprint 71 prior-art anchors documented; **product design, approach, and acceptance criteria not yet written** — Future architecture candidate, **not sprint-allocated**.

**Related:** [PB-FA-005](#pb-fa-005) · [PB-R-007](#pb-r-007) · [PB-R-009](#pb-r-009) · [PB-R-010](#pb-r-010) · Design Feedback attribution (product ideas) · Sprint 71 quality evidence programme · `S75-D03`.

### PB-FA-007 — User-controlled storage management

**Product need:** Authors/operators need **visible, understandable control** over browser storage used by PRISM — presented simply as **PRISM storage**, not as IndexedDB/localStorage jargon — especially as Run captures and generated assets grow.

**Why it matters:** Sprint 75 proved a real `localStorage` quota failure on large inline Run captures (`S75-D21`). Payloads now live in IndexedDB Workflow Resources; localStorage holds lightweight refs/metadata. Browser quota is environment-dependent. Orphaned runstate was intentionally preserved during migration. Without a user-facing storage surface, pressure becomes a surprise and cleanup risks silent data loss.

**Sprint 75 finding:** Run capture payloads moved to IndexedDB (`PRISM_WORKFLOW_RESOURCES`) after a proven `localStorage` quota failure. The operator installation also contains **orphaned runstate** workflow IDs (no owning workflow) that consume storage. These orphans were **intentionally preserved** during migration — no automatic eviction.

**Scope sketch:**

- Visible storage usage
- Available capacity where the browser exposes it
- A simple storage usage / capacity bar
- Warning as storage pressure approaches meaningful thresholds (retain existing pressure-estimate behaviour as a starting point)
- Clear handling when a write cannot be completed
- Breakdown of what is consuming storage where useful
- Workflow / resource ownership where useful
- Orphaned-resource identification (runstate and Workflow Resources)
- User-controlled cleanup with **explicit choices** about what to remove if space must be freed
- **No silent deletion** of valid user data (user-created or generated)
- User-facing language: **PRISM storage** (do not require understanding of IndexedDB vs localStorage)

**Architectural context (do not redesign persistence here):**

- Large Run captures / resources → IndexedDB / Workflow Resources
- localStorage → lightweight refs and metadata
- Quota is browser/environment-dependent

**Out of scope for Sprint 75:** Implementing the storage manager UI; reopening persistence architecture.

**Related:** [PB-FA-001](#pb-fa-001--workflow-resources) · [PB-R-008](#pb-r-008) · Sprint 75 `S75-D21`.

**Outcome criteria (when mature enough to plan):** User can see usage/pressure, understand what consumes space at a useful grain, and deliberately free space without silent deletion of valid data.

**Readiness:** Evidence of need exists; **approach and acceptance criteria not yet written** — Future architecture candidate, not sprint-allocated.

### PB-FA-008 — First-class Slideshow product / architecture extensibility test

**Product problem:** PRISM’s honest first-class Learning Design Create products are currently **Self-study resource** and **Workshop** only (`S75-D11`, `S75-D22`). Heuristic / sibling `slide_deck` behaviour inside `session_materials` is **not** a first-class Slideshow product. Adding Slideshow as a genuine product is the best near-term **architecture extensibility test** under the rule **one workflow → one product**.

**Why it matters:** This is **not** primarily “we need slides.” It deliberately tests how extensible PRISM’s architecture has become: how cleanly a domain/product pack can declare a new product end-to-end without hard-coded learner-page assumptions or `desiredOutputs`/keyword heuristics.

**Product goal:** Investigate and (when ready) implement Slideshow as a coherent first-class product across:

domain/product declaration → Create product selection → factors/refinement → workflow generation/topology → prompts → Run → persistence → rendering → Authoring → export/use

**Architecture questions to answer:**

- How much existing code must change to add one new product?
- Are product definitions sufficiently pack-driven?
- Which assumptions are still hard-coded around learner pages?
- Can a domain pack declare a product cleanly?
- Can Authoring handle a non-page product coherently?
- What renderer/export contract does a slideshow require?
- Can the product be added without `desiredOutputs` / keyword heuristics?

**Honest product catalogue (direction from `S75-D11` / `S75-D22` — retained here):**

| Status | Products |
| ------ | -------- |
| **Current first-class LD Create** | Self-study resource · Workshop |
| **Future candidates** (not Create options until contracts mature) | Slideshow · Assessment pack · Module outline · other pack-declared products |

A product becomes first-class only when its contract is coherent across Create → workflow → Run → Authoring/render/export. Do **not** expose every currently recognised artefact type as a product.

**Longer-term composition (record only — do not design now):** Authoring may eventually help compose smaller components into larger products (e.g. a learner resource containing a slideshow **component**). That does **not** weaken **one workflow → one product**: the authoritative Create product can still be the learner resource; the slideshow is a component within it.

**D22 architectural debt absorbed here:**

- `session_materials` can still introduce sibling delivery artefacts such as `slide_deck` via Settings/refinement/legacy — **not** equivalent to first-class Slideshow; resolve as part of product-topology honesty when this item is planned.

**Explicit non-scope:** Implementing Slideshow in Sprint 75; expanding Create options now; redesigning `desiredOutputs` UI; opening Sprint 76; designing composition UX now.

**Related:** `S75-D11` · `S75-D22` · [PB-FA-005](#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency) (Settings × future product declarations) · [PB-FA-009](#pb-fa-009--research-domain-pack-maturation).

**Readiness:** Direction and motivation documented post-`S75-D22`; **approach and acceptance criteria not yet written** — Future architecture candidate, **not sprint-allocated**.

### PB-FA-009 — Research domain pack maturation

**Product problem:** Research has not yet received the same architectural / product maturation as Learning Design. After `S75-D22`, Research still differs materially: product identity is primarily `objective_type`; there is no LD-style “What are you creating?” control; some intent still arrives via `desiredOutputs` / free text; Create still retains fields LD could remove.

**Why it matters:** The product rule **one workflow → one product** applies across domains. Research should express its own domain semantics through the common PRISM architecture — not remain a heuristic special case, and **not** by simply copying the Learning Design Create UI.

**Product goal:** Bring Research through pack-driven product maturation:

- first-class Research products / objectives
- product declaration
- factors, defaults, refinement
- workflow patterns / topologies
- prompts
- Run behaviour
- output / render contracts
- Authoring behaviour where appropriate
- removal of heuristic / legacy dependencies where possible

**D22 architectural debt absorbed here:** Research product selection remains immature (inference/`desiredOutputs` cues rather than an explicit first-class product model).

**Explicit non-scope:** Copying LD Create controls into Research in Sprint 75; stripping Research fields without a replacement product signal; opening Sprint 76.

**Related:** `S75-D22` · [PB-FA-008](#pb-fa-008--first-class-slideshow-product--architecture-extensibility-test) (shared product-declaration / catalogue direction).

**Outcome criteria (when mature enough to plan):** Research products are explicit and pack-declared; Create/refinement/Settings responsibilities are coherent; workflows produce one Research product without inviting sibling final products via free-text deliverable lists.

**Readiness:** Problem framed from Sprint 75 Create investigations; **approach and acceptance criteria not yet written** — Future architecture candidate, **not sprint-allocated**.

### PB-FA-010 — Prompt-contract architecture method (after DLA pilot)

**Product problem:** Model-visible workflow prompts accrete competing authorities, duplicate contracts, and hard-to-trace defects. Sprint 77 proved a **method** on DLA; other stages (EP, GAM, Design Page, Graphics, QA, etc.) still have their own instruction-architecture debt.

**Why it matters:** Maintainability and defect-to-instruction traceability. Size reduction is a **consequence** of architecture, not the primary objective.

**Proven method (DLA reference implementation — do not copy DLA sections mechanically):**

inventory → canonical ownership → equivalence ledger → assemble once → atomic switch → behavioural gate

**Principles:**

1. DLA is the reference for the **METHOD**, not a prompt template to clone.
2. Each prompt retains its own semantic responsibilities.
3. Seek: clear model-visible sections; canonical ownership of invariants; deterministic/single assembly where appropriate; controlled overlays; easy defect-to-instruction traceability; removal of duplicate or competing authorities.
4. Do **not** begin a system-wide prompt rewrite as one programme.
5. Rationalise prompts **individually** in later bounded work.
6. **GAM prompt architecture** should be reconsidered in a later bounded item after GAM D/E diagnostics (now complete in Sprint 77: E1/Case 1 closed; GAM D no live repair; E2 wait-state). Do not start GAM prompt rewrite from this item.

**Evidence:** Sprint 77 T-010–T-017 (canonical DLA `77-DLA-CANONICAL-2`; Gate D PASS; P05 resolved as architecture consequence). Phase D DLA legacy cleanup remains a **separate** authorised cleanup, not this backlog item.

**Explicit non-scope now:** Starting EP/GAM/Design Page/QA rewrites; deleting DLA rollback; merging this item into GAM E.

**Readiness:** Method documented; **not sprint-allocated**. Sprint 77 closed; do not treat this item as the next live workstream.

---

## 3. Research / design questions

Unresolved questions requiring investigation before planning. **No implementation commitment.**

| ID | Question | Why it matters | Notes |
| -- | -------- | -------------- | ----- |
| PB-R-001 | What is the minimal durable store for Copilot conversation attachments with rights and fidelity guarantees? | Unlocks PB-FA-001 byte path without overbuilding | Bound by `S72-D10` |
| PB-R-002 | Which programming languages and IO/debug affordances are first-class for v1.0? | Scopes PB-FA-002 | Anchored by `S71-F-014` |
| PB-R-003 | How should “raise the ceiling” (~90–91 → aspirational 95–98) be measured without score-chasing? | Avoids premature ceiling sprints | Sprint 72 T-060 baseline selected; T-061/T-062 not completed |
| PB-R-004 | When is a dedicated case-study / shared-evidence-spine page type warranted vs activity-level evidence? | Prevents premature page-type proliferation | Explicitly deferred in Sprint 72 (`S72-D11`) |
| PB-R-005 | How far should progressive-disclosure elicitation go beyond source-bound attachment guidance? | Layer 2 redesign still largely discovery | Former T-030–T-032 |
| PB-R-006 | What does discipline-appropriate source / evidence evaluation require beyond the Evidence-Centred Learning umbrella? | Residual Confirmed `S71-F-007` after Sprint 72 umbrella adoption | Do not import history provenance rules into literature; investigate per-discipline profiles |
| PB-R-007 | Where should Benchmark v2.1 / Validation Review v2.0 instruments live in-repo (if at all)? | Sprint 71 Final Report recommendation; paths unresolved at S71 close; informs PB-FA-006 methodology evolution | Methodology / tooling — not a generation-contract defect |
| PB-R-008 | How should unreferenced / orphan Workflow Resources be cleaned up without destructive surprise? | Sprint 73 retained mixed-data limitation; only referenced resources render | Follow-on to PB-FA-001; no automatic cleanup shipped |
| PB-R-009 | Should reusable workflows support a distinct **per-run configuration/profile** layer separate from saved workflow definition? | Informs PB-FA-005 scope item 3; current model conflates definition with run parameters | Sprint 75 investigation — do not prescribe implementation in backlog |
| PB-R-010 | Where in the product lifecycle should QA findings feed back (brief vs workflow vs Settings vs prompts vs content edit vs rerun)? | Informs PB-FA-006 closed loop; Sprint 71 attributed findings offline but did not productise author-facing “what to change next” | Sprint 75; build on Sprint 71 prior art in PB-FA-006 |

---

## 4. Product ideas

Lightly formed possibilities. Concise only. **No task IDs, sprint allocation, or implied commitment.**

- Case-study page type / shared evidence spines
- Image-style consistency hardening (run/workflow visual style profile)
- Specialist discipline renderers (music, maths notation beyond current TeX, chemistry, engineering diagrams)
- Richer evidence visualisations
- Design Feedback attribution programme beyond guided-review slice
- Broader Layer-1 uncertainty / timing / competing-interpretations programme beyond shipped constraints (`S71-F-005`, related)
- Ambiguous / conflicting diagnostic evidence for professional judgement (`S71-F-009`) — **PB-I-009**
- Worked-example conceptual explanation depth (`S71-F-011`) — **PB-I-011**
- Transfer / modelling depth beyond Check→Transfer ordering (`S71-F-010`)
- Rejection-of-alternatives prompting (`S71-F-006`); scholarly-perspective specificity (`S71-F-008`); later-stage prediction (`S71-F-012`); contrasting worked patterns (`S71-F-013`)
- Controlled raise-the-ceiling experiment
- Further nav/heading a11y polish beyond Sprint 72 bounded fixes
- Historical ideas retained from [ideas.md](ideas.md): reusable workflow templates; workflow inspectability surfaces; optional API gateway; utility transforms; renderer quality presets
- Richer parameter systems — **promoted to [PB-FA-005](#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency)** (Sprint 75)
- Longer-horizon notes from [future-directions.md](future-directions.md): institutional deployment; collaborative authoring; domain-pack marketplaces — programme-level only
- First-class Slideshow / pack-declared product catalogue / future composition — **promoted to [PB-FA-008](#pb-fa-008--first-class-slideshow-product--architecture-extensibility-test)** (`S75-D22`)
- Research domain pack maturation — **promoted to [PB-FA-009](#pb-fa-009--research-domain-pack-maturation)** (`S75-D22`)
- Prompt-contract architecture method after DLA pilot — **promoted to [PB-FA-010](#pb-fa-010--prompt-contract-architecture-method-after-dla-pilot)** (Sprint 77)
- Stable release / development process — **see [PB-S-005](#pb-s-005--stable-release--development-process)** (expanded from cache-bust)

---

## Sprint 71 disposition audit

Completed 2026-08-05: [SPRINT-71-DISPOSITION-AUDIT.md](../development/sprints/2026-07-31-sprint-72-productising-instructional-architecture/SPRINT-71-DISPOSITION-AUDIT.md). Every validated Sprint 71 finding/recommendation has an explicit disposition (implemented, deferred to this backlog, superseded, or intentionally not adopted).

---

## Maturity ranking for next-sprint selection (non-binding)

| Rank | Item | Why |
| ---- | ---- | --- |
| 1 | **PB-FA-003** Pipeline integrity | Recent public-export/bundle parity lesson; hardening for maturation phase; aligned with Sprint 74 recommended **74A** (not opened) |
| 2 | **PB-FA-004** Manually uploaded graphics | Extends Sprint 73 Graphics path; approach/acceptance criteria still needed |
| 3 | **PB-FA-002** Programming learning resources | Confirmed S71 finding; needs requirements pass first |
| — | Stabilisation PB-S-001 | Fix when capacity allows; do not block sprint selection on greenwashing the full suite |
| — | Stabilisation PB-S-004 | Duplicate/legacy pathways — informed by Sprint 74 discovery; not auto-consumed |
| — | **PB-FA-001** Workflow Resources | Sprint 73 **closed**; residual follow-ons via PB-FA-004 / PB-R-001 / PB-R-008 |
| — | Stabilisation **PB-S-005** Stable release / development process | Expanded from cache-bust; needs approach + AC |
| — | **PB-FA-005** Workflow Settings / parameterisation (+ Settings IA) | Sprint 75 evidence complete; needs approach + acceptance criteria before sprint open |
| — | **PB-FA-006** QA / refinement lifecycle | S75-D03 retired unsafe in-workflow path; Sprint 71 corpus QA is prior art; productised closed loop not started |
| — | **PB-FA-007** User-controlled storage management | Sprint 75 evidence (quota failure + orphaned runstate); UX scope expanded post-D21; approach/AC not written |
| — | **PB-FA-008** First-class Slideshow / product extensibility | Architecture test under `S75-D22` one-product rule; includes catalogue/composition direction |
| — | **PB-FA-010** Prompt-contract architecture method | DLA method proven Sprint 77; not a system-wide rewrite; GAM architecture after D/E |

**Sprint 74** is **COMPLETE / Closed** — see [SPRINT-74-START-HERE.md](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/SPRINT-74-START-HERE.md). **Sprint 75** is **COMPLETE / Closed** (2026-08-12). **Sprint 76** is **COMPLETE / Closed** (2026-08-14) — [sprint-76-closeout.md](../sprints/sprint-76-closeout.md). **Sprint 77** is **COMPLETE / Closed** (2026-08-14) — [sprint-77-closeout.md](../sprints/sprint-77-closeout.md). Next sprint is **not selected**. **Settings** → [PB-FA-005](#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency) remains deferred. Other backlog lanes remain available via [NEXT-SPRINT.md](../sprints/NEXT-SPRINT.md) (QA → [PB-FA-006](#pb-fa-006--qa--workflow-and-resource-refinement-lifecycle); storage → [PB-FA-007](#pb-fa-007--user-controlled-storage-management); Slideshow/catalogue → [PB-FA-008](#pb-fa-008--first-class-slideshow-product--architecture-extensibility-test); Research pack → [PB-FA-009](#pb-fa-009--research-domain-pack-maturation); prompt-contract method → [PB-FA-010](#pb-fa-010--prompt-contract-architecture-method-after-dla-pilot); release process → [PB-S-005](#pb-s-005--stable-release--development-process)). **Sprint 74A / 74B / 74C are not opened as separate live programmes.**

---

## Related

- Sprint 74 pack: [SPRINT-74-START-HERE.md](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/SPRINT-74-START-HERE.md)  
- Sprint 74 discovery: [S74-T-001](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-001-codebase-rationalisation-discovery.md)  
- Sprint 73 closure: [SPRINT-73-CLOSURE.md](../development/sprints/2026-08-06-sprint-73-workflow-resources/SPRINT-73-CLOSURE.md)  
- Sprint 73 final report: [SPRINT-73-FINAL-REPORT.md](../development/sprints/2026-08-06-sprint-73-workflow-resources/SPRINT-73-FINAL-REPORT.md)  
- Sprint 72 closure: [SPRINT-72-CLOSURE.md](../development/sprints/2026-07-31-sprint-72-productising-instructional-architecture/SPRINT-72-CLOSURE.md)  
- Sprint 72 cut-line history: [SPRINT-72-BACKLOG-RATIONALISATION.md](../development/sprints/2026-07-31-sprint-72-productising-instructional-architecture/SPRINT-72-BACKLOG-RATIONALISATION.md)  
- Next sprint pointer: [docs/sprints/NEXT-SPRINT.md](../sprints/NEXT-SPRINT.md)  
