# Sprint 98 — M3 sequencing investigation (read-only)

**Date:** 2026-11-16  
**Decision:** [S98-D04](decisions.md#s98-d04--accept-m3-investigation-findings-read-only--architectural-gap-no-automatic-learner-facing-defect)  
**Case package:** `why-the-constraint-matters.zip` (learner HTML) + author-supplied Design Page partial + assembled page JSON  
**Artefact summary:** [evidence/M2-PAGE-SYNTHESIS-AND-LS-SUMMARY.md](evidence/M2-PAGE-SYNTHESIS-AND-LS-SUMMARY.md)  
**Scope:** Investigation only — no code/prompt/schema/assembly/renderer changes; no regen; Knowledge Summary left first; no figcaption reopen.

Status labels: **Confirmed implementation** · **Pedagogical implication** · **Unverified hypothesis**

---

## Files and functions inspected

| Area | Paths / symbols |
| ---- | --------------- |
| Learning Sequence guidance | `lib/educational-quality-framework-prompt.js` (`learner_study_flow` wording); `app.js` Learning Sequence authoring brief / capture validation (`ordered_activity_ids`, not study-flow ordering) |
| Assembly | `lib/page-vnext-assemble.js` — `learning_sequence` deep-clone passthrough; `projectTimelineDurationsOntoActivities` (timeline only) |
| Renderer sequence context | `lib/learner-renderer-vnext/compose-sequence-context.js` — maps `study_flow` → phase labels by activity id |
| Moment composition | `compose-page-model.js` (fixed Orient→Learn→Do→Check→Transfer); `compose-activity-moments.js` (studyPhase framing); `compose-generic-moments.js` (`shouldDeferMaterialToCheck`, reveal heuristics); `compose-moment-classification.js` (material placement); `render-composed-moment.js` (headings / details) |
| Activity order | `lib/learner-renderer-vnext/build-page-model.js` — `ordered_activity_ids` |
| Tests | `tests/interactive-attempt-before-explanation-guidance.test.js`; `tests/discovery-dependent-learning-guidance.test.js`; `tests/post-attempt-solution-disclosure.test.js`; progressive-disclosure suites |
| Case HTML | Extracted `learner-page.html` from supplied ZIP (nested-article-aware parse) |
| Case JSON | Assembled `learning_sequence.timeline[].learner_study_flow` + Design Page / assembled `page_synthesis` (author-supplied) |

**Still unverified:** Effective Design Page prompt (newly authored vs transported Overview/Purpose/KS).

---

## Answers

### 1. Is `learning_sequence.learner_study_flow` consumed by assembly or rendering, or retained only as metadata?

**Confirmed implementation (refined with assembled JSON):** Three distinct surfaces exist:

1. **Prompt wording** — EQF/LS authoring says “order `learner_study_flow`…”.  
2. **Authored data on this page** — `learning_sequence.timeline[].learner_study_flow[]` with `{step, action, material_ids, disclosure}` (`initial_attempt`, `optional_scaffold`, `conceptual_scaffold`, `post_attempt_feedback`, etc.). Assembly **copies** the LS object wholesale, so these steps survive in JSON.  
3. **Renderer Orient field** — `learning_sequence.study_flow[]` (`phase` + `activity_ids`). **Absent** from this assembled page. If present, used only as Orient `studyPhase` labels.

**No code path found** that reads `timeline[].learner_study_flow` to order moments, place materials, or enforce disclosure. Relative to Interactive rendering, the authored step flows are **planning metadata** retained in the page JSON.

### 2. What determines the order of materials and activity sections?

**Confirmed implementation:**

- **Activity order:** `learning_sequence.ordered_activity_ids` (else source `activities[]`).
- **Within-activity sections:** Fixed composition order Orient → Learn → Do → Check → Transfer.
- **Headings:** Explore the idea / Your task / Check your response / Transfer your learning.
- **Material placement:** Classification by material type, beat roles, instruction patterns; within-moment order from `required_materials` ranking and type priority.
- **Not a driver:** `timeline[].learner_study_flow`, top-level `study_flow`, or prompt `learner_study_flow`.

### 3. Can learners make the intended initial attempt before explanatory scaffolding?

**Confirmed implementation:** Learn always precedes Do when both exist.

**Pedagogical implication:** Independent attempt before *complete* explanation depends on what is authored into Learn vs Check, not on LS study-flow execution.

**Case package (JSON + HTML):** Destination proofs / model answers (A2-M4, A3-M3, A4-M5) sit in Check — aligned with post-attempt policy at material-type level. However, **authored LS step order is not preserved** for scaffolds:

- **A3 (strongest mismatch):** LS requires attempt on A3-M2 **before** studying A3-M1; renderer places A3-M1 in Learn before Do.  
- **A2:** LS marks A2-M2 as `optional_scaffold` after initial attempt; renderer places it in Learn as required Explore-the-idea content (distinct-data modelling mitigates R1–R4 spoiling).  
- **A1:** LS wants prediction before examining A1-M1’s mathematical explanation; Learn shows A1-M1 first.

### 4. Are worked answers reliably withheld until after the attempt, or merely “reveal later” instructions?

**Confirmed implementation (hybrid):**

- Check-typed materials (`sample_output`, `checklist`, …) defer to Check.
- Eligible types with Reveal/Review/Release-after wording defer and often wrap in closed `<details>`.
- `sample_output` in Check uses closed details by default.
- **No** attempt-completion gate before opening Check / guided review.
- Soft prose without the detector pattern does not defer; `worked_example` is not in the defer-type set.

**Case package:** A2–A4 include Check labels such as “Reveal after attempting: …”; checklist criterion guidance and sample outputs start closed. Instructional copy: “Complete your response first…”.

### 5. Does the renderer distinguish required explanations, optional scaffolds and post-attempt feedback?

**Confirmed implementation:** Partially, via moment kinds + material-type placement + reveal heuristics — **not** a three-way pedagogical taxonomy. Authored LS `disclosure` values (`optional_scaffold`, `conceptual_scaffold`, `post_attempt_feedback`, …) are **not** read by the renderer; optional scaffolds can render as ordinary Learn content.

### 6. Genuine instructional problems vs metadata vs presentation conventions?

| Observation | Class |
| ----------- | ----- |
| Prompt name vs `timeline[].learner_study_flow` vs absent `study_flow` | Naming / schema drift across three surfaces |
| Fixed Learn→Do→Check vs authored LS step/disclosure order | **Confirmed architectural gap** (intentions non-executable) |
| A3: A3-M1 before A3-M2 despite LS attempt-first | **Genuine presentation mismatch** — method scaffold before intended first attempt; original destination still withheld in Check |
| A2: optional A2-M2 forced into Learn | Presentation convention conflict with LS; mitigated by distinct-data modelling |
| Closed Check details without attempt gate | Presentation convention (voluntary progressive disclosure) |
| Overview/Purpose/KS improvements (M2) | Separate page-synthesis evaluation; DP bodies match assembled |
| Complete worked answers visible before attempt | **Not established** for A2–A4 sample_outputs (Check-deferred) |

---

## A1–A4 (regenerated package)

| Activity | LS intention (timeline) | Moments | Learn | Do | Check |
| -------- | ----------------------- | ------- | ----- | -- | ----- |
| **A1** | Predict before examining A1-M1 explanation; then formulate; A1-M3 review | orient→learn→do→check | A1-M1 full definitions | Prediction + formulation template | Checklist (closed details) |
| **A2** | Attempt A2-M1/M3; optional A2-M2; then reveal A2-M4 | orient→learn→do→check | A2-M2 modelling (forced pre-task) | A2-M1 + A2-M3 | A2-M4 sample_output + checklist |
| **A3** | Attempt A3-M2 **before** A3-M1; then reveal A3-M3 | orient→learn→do→check | A3-M1 full illustrative proof (p+q=12) | A3-M2 blank proof | A3-M3 sample_output + checklist |
| **A4** | Reflect; transfer attempt; reveal A4-M5 | orient→learn→do→check→transfer | A4-M2 scenario | Reflection + transfer workspaces | A4-M5 sample_output + checklist; Transfer present |

Knowledge Summary remains in orientation **before** activities (unchanged; intentional).

---

## Test coverage and gaps

| Coverage | Status |
| -------- | ------ |
| Attempt-before / discovery **prompt** contracts | Present |
| Defer + closed Check for typed/marked solutions | `post-attempt-solution-disclosure` |
| Progressive disclosure / guided review | Present |
| `timeline[].learner_study_flow` drives Learn/Do/Check or optional scaffolds | **Gap** — authored on this page; not consumed |
| Top-level `study_flow` → Orient phase / reorder Do before Learn | **Gap** — field absent here; would not reorder moments if present |
| Attempt gate before Check open | **Gap** (not implemented) |
| End-to-end generation cannot place destination explanation in Learn | **Gap** (guidance-only) |

---

## Defect judgement

**Complete worked-answer spoiling before attempt?** Not established for A2–A4 (sample_outputs Check-deferred).

**Genuine presentation mismatch with authored LS?** **Yes for A3** (milder for A1/A2): conceptual/optional scaffolds appear in Learn before the LS-intended first attempt. Instructional-coherence issue between planning metadata and fixed composition — not a mandate for interaction gates.

**Genuine architectural limitation?** Yes — `timeline[].learner_study_flow` is non-executable relative to Interactive rendering; answer protection depends on DLA/GAM placement + Check deferral.

---

## Smallest warranted next action (no implementation without further authorisation)

1. Prefer **M4 consolidation** of M1–M3 evidence.  
2. If a later fix is authorised, decide whether LS `disclosure` / `learner_study_flow` remains documentation-only or may influence material moment placement — **without** defaulting to mandatory gates; overlaps Interactive V2 / PB-FA-019 if expanded.  
3. Optional remaining artefact: effective Design Page prompt (newly authored vs transport for Overview/Purpose/KS).  
4. Do **not** implement from this investigation alone.
