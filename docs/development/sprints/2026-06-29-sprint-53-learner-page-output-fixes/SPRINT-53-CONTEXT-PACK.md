# Sprint 53 Context Pack — Learner Page Output Fixes

**Sprint:** 53 — Learner Page Output Fixes  
**Baseline commit:** `04c9e81` — close sprint 51 learner experience work and bootstrap sprint 52  
**Pack date:** 2026-06-29  
**Status:** Bootstrap complete — implementation not started

---

## 1. Sprint Identity

**Sprint 53 — Learner Page Output Fixes**

Starting baseline:

`04c9e81` — close sprint 51 learner experience work and bootstrap sprint 52

This commit is the **source of truth** for Sprint 53. Untracked investigation artefacts from 2026-06-29 were quarantined to `_archive/failed-investigation-2026-06-29/` and must not be treated as valid baseline evidence.

---

## 2. Architecture Constraints

Read carefully. These constraints are non-negotiable.

PRISM is NOT an execution engine.

PRISM does NOT execute prompts.

PRISM does NOT run Copilot.

PRISM does NOT observe workflow execution.

PRISM does NOT see generated artifacts after Copilot produces them.

PRISM does NOT inspect runtime outputs.

PRISM does NOT intervene in workflows.

PRISM does NOT repair outputs.

PRISM does NOT reconcile outputs.

PRISM does NOT merge outputs.

PRISM does NOT retrieve missing outputs.

PRISM does NOT dynamically chunk workflow execution.

PRISM does NOT perform post-generation correction.

PRISM does NOT perform runtime recovery.

PRISM does NOT perform runtime validation of Copilot-generated artifacts.

PRISM ONLY defines and maintains:

* prompt contracts
* workflow definitions
* workflow guidance
* artifact schemas
* validation specifications
* renderer behaviour for supplied artifacts
* documentation
* regression fixtures
* tests

Therefore:

Any proposed solution that depends on PRISM observing, repairing, chunking, merging, reconciling, retrieving, or intervening after generation is architecturally invalid.

If such a solution appears, explicitly classify it as:

**"Requires architectural change outside current PRISM scope"**

and reject it from Sprint 53 recommendations.

### Validation carve-out (in scope)

The following **are** in scope for Sprint 53:

* **Validation specifications** applied to **artifacts explicitly supplied to PRISM** (pasted workflow capture, Utilities JSON input, committed test fixtures).
* **Renderer gating** when a supplied page JSON fails validation before HTML export/preview.
* **Prompt contracts** that instruct the external generator (Copilot) how to compose learner-facing page JSON.
* **Compose-time merge helpers** that run when PRISM processes a **user-supplied** page artefact for preview/export (e.g. merging upstream GAM bodies onto composed page rows in the utilities pipeline).

The following **are** out of scope:

* PRISM observing, retrieving, repairing, or reconciling Copilot outputs during or after workflow execution **without** the user supplying the artefact.
* Post-generation orchestration, runtime recovery, or dynamic chunking of workflow steps.

### Renderer scope boundary

Renderer work is limited to **correct presentation of supplied page JSON** (HTML/export). It is not workflow orchestration and not post-generation repair of missing upstream artefacts.

---

## 3. Why Sprint 53 Exists

* **Sprint 52** was chartered for **education quality** — voice, depth, consistency, cross-activity polish ([SPRINT-52-CHARTER.md](../2026-06-20-sprint-52-production-quality-resource/SPRINT-52-CHARTER.md)).
* During Sprint 52 exploration, **learner-facing output defects** were observed (missing activities, thin materials, placeholder content, renderer presentation issues).
* **Output correctness** must be addressed **separately** from educational quality work.
* Sprint separation is intentional: Sprint 53 branches from the Sprint 51 stable baseline (`04c9e81`), not from today's discarded investigation work.

**Sprint 52 handling:** Existing Sprint 52 documentation remains in place and is **not deleted or rewritten**. Sprint 53 does **not** continue the Sprint 52 education-quality implementation track for output-defect work.

---

## 4. Current Objective

Produce a **properly functioning learner-facing page**.

Focus on:

* workflow correctness
* learner-facing output correctness
* renderer reliability

**Not** educational quality optimisation.

---

## 5. Stable Baseline Capabilities

Verified from **committed code and tests at `04c9e81`** (2026-06-29 verification).

### 5.1 Activity closure behaviour

**Present.**

* `validatePageActivityClosure()` in `app.js` compares upstream `learning_activities` activity IDs to composed `page.sections` learning-activities rows; supports explicit `generation_notes.activities_omitted[]` tracing (`(U \ X) ⊆ C` semantics).
* Wired on capture path (`applyPageCompositionValidationForCapturedPage`) and utilities path (`applyPageCompositionValidationForUtilitiesPage`).
* On failure, `appendPageCompositionClosureWarnings()` writes to `generation_notes.limitations` and may append `activities_omitted[]` entries.
* Committed tests: `tests/utility-page-composition-closure.test.js` (mostly passing), `tests/ld-design-page-compose-contract.test.js`.

**Known weakness (committed test failure):** `utility-page-composition-closure.test.js` — *"applyPageCompositionValidationForUtilitiesPage: silent omission mutates generation_notes only"* expects `outcome: "fail"` when upstream declares A2 but page omits A2; baseline returns `outcome: "pass"`. This is an evidenced defect on the utilities composition path.

### 5.2 Learner-material preservation behaviour

**Partially present.**

* **Prompt level:** `LD-MATERIALS-COPY`, `LD-DESIGN-PAGE-COMPOSE-CONTRACT`, and domain §13 Design Page `promptTemplate` require verbatim `activity.materials.*` copy, forbid synopsis/placeholder substitution, and reference `generation_notes.limitations` when constraints cannot be met.
* **Compose merge:** `applyComposedPageGamMaterialsPreserve()` → `page-gam-materials-preserve.js` `applyGamMaterialsToComposedPage()` merges upstream GAM bodies onto composed page rows when utilities/capture processing runs `applyPedagogicCognitionSemanticsToComposedPage()`.
* **38L / 38M validators** in `page-gam-materials-preserve.js`: `validate38LPageGamPreservation`, `validate38MPageFidelity`, `measurePageGamFidelity`.
* **Not present at baseline:** per-material closure validation (`validatePageMaterialsClosure`), `material_bank` / `content_ref` packaging, `hydratePageMaterialsFromMaterialBank`, `validatePageArtifactMaterialFidelity`, ellipsis/truncation body detectors beyond placeholder heuristics.

### 5.3 Renderer behaviour

**Present (Sprint 51 baseline).**

* Utilities export pipeline: `runUtilityPageExportPipeline()` → `runUtilityRendererByPlan()` → `buildUtilityStructuredHtml()`.
* Material normalisation helpers in `app.js`: `normalizeActivityMaterialsForRender()`, `appendMaterialBucket()` for array-shaped and typed material entries.
* `renderRichMaterials()` delegates to primary activity materials path; falls back to scenario/table/strategy rendering with `utilityLabelFromKey()` headings for remainder keys.
* Committed tests: `tests/utility-page-render.test.js`, sprint 38M/38P render fidelity tests.

**Known weaknesses:** metadata-style headings for unknown material keys; no `material_bank` hydration before render; renderer does not validate body fidelity of supplied JSON.

### 5.4 Placeholder detection behaviour

**Present in lib; not wired to live capture/export gating.**

* `lib/design-page-materials-fidelity.js`: `stringLooksPlaceholderOnly()`, `materialsObjectLooksPlaceholderOnly()`, `pageActivityMaterialsLookPlaceholderOnly()`, synopsis heuristics.
* Committed test: `tests/design-page-materials-fidelity.test.js`.
* **Not found in `app.js`:** no import or call of `PRISM_DESIGN_PAGE_MATERIALS_FIDELITY` on capture or utilities paths at baseline.

### 5.5 Prompt-level material-preservation language

**Present, including permissive limitation wording.**

Compose contract (`lib/ld-design-page-compose-contract.js`, 102 lines on disk):

* Activity membership: every upstream `activity_id` unless `generation_notes.activities_omitted[]`.
* Materials bridge: copy `activity.materials.*` verbatim; no paraphrase/shorten/summarise/rewrite.
* Fallback when bodies cannot be preserved: record `generation_notes.limitations`.

`lib/ld-materials-copy.js` and `app.js` inline fallback (identical sentence):

> Do not shorten activity.materials.* content. If a hard output limit prevents full preservation, keep the full upstream material body **where possible** and record the limitation in **generation_notes.limitations** rather than silently compressing it.

Domain §13 Design Page (`domain-learning-design-step-patterns.md`) repeats the same pattern and extensive forbidden collapse substitutes.

### 5.6 Regression tests (committed)

**Full suite command:** `node --test tests/*.test.js`  
**Result at bootstrap (2026-06-29):** **1218 passed, 12 failed** (~15s)

**Learner-page / design-page committed tests:**

| Test file | Role |
| --------- | ---- |
| `tests/design-page-materials-fidelity.test.js` | Placeholder vs rich materials |
| `tests/ld-design-page-compose-contract.test.js` | Compose prompt contract anchors |
| `tests/utility-page-composition-closure.test.js` | Activity closure + render omission behaviour |
| `tests/utility-page-render.test.js` | HTML shape, materials, assessment |
| `tests/page-38l-gam-preservation.test.js` | 38L GAM preservation merge |
| `tests/page-38m-gam-preservation.test.js` | 38M synopsis / parity |
| `tests/page-38m-a3-sequencing.test.js` | A3 sequencing body fidelity |
| `tests/page-38p-*` | Role fidelity / supersession / render precedence |
| `tests/page-gam-materials-projection.test.js` | GAM projection |
| `tests/workflow-learner-page-design-page-preservation.test.js` | End-to-end preservation prompts |

**Learner-focused subset (7 files, 2026-06-29):** 66 passed, 1 failed (`utility-page-composition-closure.test.js:156`).

**Other baseline failures (not Sprint 53 primary):** `mathjax-producer-prompt-contract`, `page-38p-role-fidelity` (2), `page-38p-role-supersession`, `utility-live-worksheet-csv-export` (6), `workflow-research-sparse-briefs`.

### 5.7 IDE vs disk verification

At bootstrap, on-disk line counts **disagreed** with stale IDE tab metadata:

| File | On disk (`04c9e81`) | IDE (stale) |
| ---- | ------------------- | ----------- |
| `lib/ld-design-page-compose-contract.js` | **89** lines | ~1190 lines |
| `app.js` | **38568** lines | ~40174 lines |

**Rule:** disk + git win over IDE buffers.

---

## 6. Learner-Page Defect Investigation Areas

Investigation targets only — **not conclusions**.

* Missing learner activities on composed page vs upstream `learning_activities`
* Missing or emptied learner materials vs upstream `activity_materials` / GAM
* Placeholder-only or catalogue-description materials
* Shortened, summarised, or collapsed material bodies
* Renderer dropping, mis-labelling, or shallow-presenting material content
* Mismatch between activity definitions (DLA/GAM) and Design Page / rendered output
* Utilities composition path false-pass on activity closure (evidenced by committed test failure)
* Permissive prompt language (`where possible` + `generation_notes.limitations`) vs hard fidelity expectations

**Hypotheses from 2026-06-29 discarded investigation** (e.g. `material_bank`, v3 compose marker, live fidelity enforcement) are **untrusted** until re-verified from committed code.

---

## 7. Diagnostic Method

For **development and testing only**:

Compare:

1. Activity specification (DLA / `learning_activities`)
2. Material specification (GAM / `activity_materials`)
3. Design Page artefact fixture (pasted JSON)
4. Rendered learner page (utilities HTML export)

Purpose: identify **where** learner-facing output defects originate (prompt contract gap, compose JSON gap, merge gap, renderer gap).

**Do NOT** imply PRISM performs this comparison at runtime against Copilot during workflow execution.

---

## 8. Explicit Non-Goals

Exclude:

* runtime repair of Copilot outputs
* runtime reconciliation or retrieval of missing artefacts
* runtime chunking of workflow execution
* runtime artifact merging without user-supplied inputs
* post-generation correction orchestration
* workflow intervention after external generation
* educational quality optimisation (Sprint 52 track)
* architecture redesign of PRISM as an execution engine

---

## 9. Sprint 53 Success Criteria

A learner-facing page (from a **supplied** Design Page JSON artefact) should:

* contain expected activities (or explicit traced omissions in `generation_notes.activities_omitted[]`)
* contain expected learner materials with substantive bodies where upstream provided them
* render correctly in utilities HTML export
* avoid obvious placeholder-only catalogue strings
* avoid malformed or metadata-leaking presentation where renderer policy forbids it
* satisfy workflow prompt-contract expectations verifiable by committed regression tests

…without requiring PRISM to become an execution engine or post-Copilot orchestrator.

---

## 10. First Recommended Implementation Task

**Chosen from committed baseline evidence only** (not from discarded investigation hypotheses).

### Fix utilities-path activity-closure false pass

**Evidence:** `tests/utility-page-composition-closure.test.js:156` — when `applyPageCompositionValidationForUtilitiesPage()` is called with explicit `upstreamLearningActivities` and the page silently omits activity A2, validation returns `outcome: "pass"` but the test requires `outcome: "fail"` with composed activity IDs unchanged.

**Why first:**

1. **Workflow correctness** is priority 1; activity membership is foundational.
2. Smallest evidenced defect with a **committed failing test** on the learner-page composition path.
3. Does not require new architectural primitives (`material_bank`, live Copilot observation, etc.).
4. Unblocks trust in utilities preview/export validation before deeper material-body fidelity work.

**Scope of task (when implemented):** diagnose why `validatePageActivityClosure` returns pass in this scenario (e.g. interaction with `applyPedagogicCognitionSemanticsToComposedPage` / repair helpers running before validation), fix validation ordering or upstream ID resolution, make test `:156` pass without mutating composed activity membership.

**Do not implement in this bootstrap task.**

### Guardrail for subsequent tasks

Later material-closure, body-fidelity, or renderer tasks must each be justified by **new** evidence from baseline investigation or new committed tests — not by quarantined archive files until those APIs are reintroduced and verified.

---

# Sprint 53 Evidence Standard

This section overrides assumptions, memories, archived investigations, and chat conclusions.

A defect is only considered established if supported by at least one of:

* a committed failing test
* reproducible behaviour from the 04c9e81 baseline
* inspection of committed code
* inspection of committed fixtures
* inspection of committed prompt contracts

The following are NOT evidence:

* chat conclusions
* archived investigations
* quarantined files
* untracked files
* abandoned implementation work
* assumptions carried over from previous conversations
* hypotheses that have not been reproduced from the current baseline

When discussing a defect, explicitly classify it as one of:

## Established Defect

Supported by committed code, committed tests, or reproducible baseline behaviour.

## Working Hypothesis

Plausible explanation that has not yet been verified.

## Archived Hypothesis

Idea originating from a discarded investigation and not yet re-verified against the current baseline.

Do not promote a Working Hypothesis or Archived Hypothesis to an Established Defect without evidence.

---

# Historical Context and Investigation Leads

This section preserves useful historical context from work performed before Sprint 53.

These items are NOT established defects.

These items are NOT implementation instructions.

These items are investigation leads only.

All items must be re-verified against the 04c9e81 baseline before being treated as facts.

This section exists to preserve potentially useful investigation direction while remaining consistent with the Sprint 53 Evidence Standard.

---

## Learner Experience Focus

The objective is not merely to render content.

The learner-facing page should correctly surface the intended learning experience.

Sprint 53 investigations should consider:

* activity sequence
* learner guidance
* modelling
* scaffolding
* worked examples
* guided practice
* reflection
* progression through the learning experience

not just raw content presence.

---

## GAM and Design Page as Primary Investigation Areas

Historically, learner-facing defects were most often suspected to emerge somewhere between:

Activity Specification (GAM)
→ Design Page Composition
→ Learner-Facing Page

These areas should receive early attention during Sprint 53 investigations.

This is an investigation lead only.

It is not an established defect.

No conclusion should be assumed until verified against committed code, committed tests, committed fixtures, or reproducible 04c9e81 baseline behaviour.

---

## PEL and Scaffolding Visibility

Historically there was concern that important pedagogical structures were not always visible in learner-facing output.

Examples include:

* scaffolding
* modelling
* worked examples
* guided practice
* learner support structures
* progression cues
* PEL-related learner guidance

Sprint 53 should verify that these elements are represented appropriately in learner-facing pages.

Verification must be based on:

* committed fixtures
* committed tests
* committed code
* reproducible baseline behaviour

This is an investigation lead only.

It is not an established defect.

---

## Educational Quality Boundary

Sprint 53 is not an educational-quality optimisation sprint.

However:

obvious omissions of intended pedagogical structures may represent learner-page output defects rather than educational-quality opportunities.

Use the following rule:

If an intended learner-support structure exists in upstream specifications but disappears before reaching the learner-facing page, treat it as a candidate output defect.

If the structure reaches the learner-facing page correctly but could be improved pedagogically, defer that work until after Sprint 53.

---

## Investigation Reminder

Do not assume:

* GAM is the defect location
* Design Page is the defect location
* Renderer is the defect location

Treat all of these as investigation targets only.

Follow the Sprint 53 Evidence Standard.

A defect becomes established only when supported by:

* committed failing tests
* committed code inspection
* committed fixtures
* reproducible baseline behaviour

---

# Sprint 53 Startup Procedure

Every new Sprint 53 investigation session should begin from evidence rather than theory.

Preferred process:

1. Execute a representative workflow manually.
2. Capture the generated artefacts.
3. Paste the artefacts into the investigation session.
4. Perform an evidence-based audit before proposing fixes.

The purpose is to establish the current behaviour of the 04c9e81 baseline before discussing solutions.

---

## Artefacts To Collect

Where available, provide:

* learning objective
* workflow specification
* GAM / activity specification
* material specification
* Design Page artefact
* learner-facing page output
* rendered HTML
* relevant screenshots

The more complete the artefact chain, the easier it is to identify where learner-facing defects originate.

---

## Audit Method

The investigation should compare the supplied artefacts and answer:

1. What was intended?
2. What was generated?
3. What reached the learner-facing page?
4. What appears to be missing?
5. What appears to be malformed?
6. What appears to be shortened, simplified, or omitted?
7. Are PEL structures visible?
8. Are scaffolding structures visible?
9. Are worked examples visible?
10. Are learner-support structures visible?

The goal is to identify candidate defect locations.

---

## Architectural Reminder

This audit process is performed by developers using supplied artefacts.

PRISM does not perform this analysis.

PRISM does not observe workflow execution.

PRISM does not inspect generated outputs.

PRISM does not validate runtime artefacts.

The audit exists solely as a development and debugging practice.

---

## Investigation Output

At the end of the audit, classify findings as:

### Established Defect

Supported by evidence from supplied artefacts, committed tests, committed code, or reproducible baseline behaviour.

### Working Hypothesis

Plausible explanation requiring further verification.

### Archived Hypothesis

Idea carried forward from previous investigations that has not yet been re-verified.

Do not propose fixes until the audit is complete.

---

## First Session Requirement

The first investigation session of Sprint 53 should begin with a fresh workflow run from the 04c9e81 baseline.

Before discussing solutions:

1. Run a representative workflow.
2. Collect the available artefacts.
3. Paste the artefacts into the investigation session.
4. Perform the audit described above.
5. Identify Established Defects and Working Hypotheses.
6. Only then discuss implementation options.

The preferred order is:

Run workflow
→ Collect artefacts
→ Audit
→ Establish evidence
→ Discuss fixes

Do not begin with architecture proposals, redesign ideas, or defect theories.

Begin with artefact evidence.

---

# Sprint 53 Investigation Discipline

Before proposing a fix:

1. Identify the exact failing test, committed behaviour, or committed code path.
2. Explain why the behaviour is incorrect.
3. Show the relevant code location.
4. Confirm the issue can be reproduced from the 04c9e81 baseline.
5. Only then propose a change.

---

# Architectural Validity Check

Before recommending any solution, evaluate it against PRISM architecture.

PRISM is not an execution engine.

PRISM does not execute prompts.

PRISM does not run Copilot.

PRISM does not observe workflow execution.

PRISM does not see generated artifacts after generation.

PRISM does not inspect runtime outputs.

PRISM does not intervene in workflows.

PRISM does not repair outputs.

PRISM does not reconcile outputs.

PRISM does not merge outputs.

PRISM does not retrieve missing outputs.

PRISM does not dynamically chunk workflow execution.

PRISM does not perform post-generation correction.

Reject any proposal that requires PRISM to:

* execute prompts
* observe Copilot execution
* inspect generated artifacts after generation
* intervene in workflow execution
* repair generated outputs
* reconcile generated outputs
* retrieve missing outputs
* dynamically chunk workflow execution
* merge generated outputs
* perform post-generation correction

If any of those capabilities are required, classify the proposal as:

"Requires architectural change outside current PRISM scope"

and exclude it from Sprint 53 recommendations.

---

# Sprint 53 Default Starting Point

When uncertain about what to work on next:

1. Prefer committed failing tests over hypotheses.
2. Prefer workflow-correctness defects over fidelity enhancements.
3. Prefer fidelity defects over educational-quality improvements.
4. Prefer the smallest reproducible defect first.
5. Re-run tests before creating new theories.

Current highest-priority established defect:

tests/utility-page-composition-closure.test.js:156

Expected:
activity omission should fail

Actual:
activity omission passes

This is currently the preferred starting point for Sprint 53 until resolved or disproven.

---

## Appendix A — Cleanup record (2026-06-29)

Untracked investigation files quarantined to `_archive/failed-investigation-2026-06-29/`. See archive `README.md` for inventory.

Post-cleanup `git status`: only `_archive/` and new Sprint 53 docs untracked; `tests/` contains no orphan investigation tests.

---

## Appendix B — Sprint timeline

| Sprint | Focus |
| ------ | ----- |
| 51 | Stable learner experience baseline (closed) |
| 52 | Education quality exploration (paused for output-defect track) |
| 53 | Learner-facing output defect removal from `04c9e81` |

---

*End of Sprint 53 context pack.*
