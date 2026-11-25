# Sprint 105 — Validation Plan

**Sprint:** 105 — Learning Journey Progressive Capture and Assembly  
**Status:** **MILESTONES 1–2 COMMITTED (`4b698db`, `09cfbfc`); MILESTONE 3 FOCUSED-VERIFIED (STOPPED FOR REVIEW)**  
**Baseline:** `09cfbfc`

---

## 1. Evidence & scope boundaries

- Do **not** pull pre-existing [PB-S-008](../../../backlog/PRODUCT-BACKLOG.md#pb-s-008--full-suite-pre-existing-failures-technical-debt) failures into Sprint 105.
- Preserve both the original pre-intervention Economics baseline (`c01-page.json`, `c01-zip/`, `c02-page.json`, `tests/fixtures/assessment-pack-c06-design-page-d09-scatterplot.json`, and external captures) and the incomplete Sprint 104 regeneration untouched throughout Sprint 105.

---

## 2. Milestone verification gates & observed results

### Milestone 1 gate — Stage contracts, deterministic LJ assembler, workflow versioning & strict legacy separation (**Verified 2026-11-25**)

| Check / Suite | Result | Verified Scope |
| ------------- | ------ | -------------- |
| `node --check lib/learning-journey-assemble.js` | **Pass** (exit 0) | New UMD module syntax clean |
| `node --check lib/page-vnext-assemble.js` | **Pass** (exit 0) | Additive LJ stage registration & delegation clean |
| `node --check lib/first-class-workflow-family.js` | **Pass** (exit 0) | Workflow versioning (`s105_v1`) & brief-source origin clean |
| `node --check tests/s105-m1-lj-assembly.test.js` | **Pass** (exit 0) | Test syntax clean |
| `tests/s105-m1-lj-assembly.test.js` | **8 / 8 pass** | Complete 5-stage assembly & immutable DP top-level/commission/journal keys (zero intermediate leakage); mandatory 5-stage enforcement (Stage 2/3 omission fails closed); deterministic brief-provided source transport & conflict rejection; single-stage ownership & cross-stage integrity across Stages 1–5 (including pre-injection continuity & Stage 1 outcome subset/conflict); constituent journey & disabled journal integrity; strict legacy separation (progressive rejects monolithic bypass; legacy monolithic passes); `page-vnext-assemble.js` delegation & workflow-capture assembly; live downstream compatibility with unchanged `first-class-commission-intake.js`, `learning-journey-shared-source.js`, `learning-journey-unified-shell.js`, and `learning-journey-workload-feasibility-adapter.js` |
| `tests/page-vnext-assemble.test.js` | **32 / 32 pass** | Interactive & Practice partial-page assembly non-regression |
| `tests/s85-expository-assembled-learner-page-sections.test.js` | **6 / 6 pass** | Expository progressive assembly non-regression |
| `tests/s96-lj-shared-source-design-page-boundary.test.js` | **19 / 19 pass** | Shared source write-once boundary non-regression |
| `tests/s104-m5-workload-estimation.test.js` | **6 / 6 pass** | Sprint 104 M5 authoritative duration & workload adapter non-regression |
| **Focused Milestone 1 total** | **71 / 71 pass** | Zero regressions across Interactive, Expository, LJ shared source, and S104 M5 |

*Baseline observation (outside M1 scope):* Running `tests/s104-m1-duration-transport.test.js` showed 10/11 passing; the single failure at `tests/s104-m1-duration-transport.test.js:1011` (`resolveEffectiveWorkflowDurationMinutes(` static count `5 !== 3` in `app.js`) is pre-existing from Sprint 104 M5 (`f1f1269`), as Sprint 105 M1 did not touch `app.js`.

### Milestone 2 gate — Economical prompts, Step 5 runner-guidance fix & continuity reconciliation (**Verified 2026-11-25**)

| Check / Suite | Result | Verified Scope |
| ------------- | ------ | -------------- |
| `node --check` on `lib/learning-journey-assemble.js`, `lib/learning-journey-shared-source.js`, `lib/learning-journey-design-page.js`, `lib/learning-journey-sibling-prompts.js`, `app.js`, `tests/s105-m2-prompts-and-continuity.test.js` | **Pass** (exit 0) | All touched JS files syntax clean |
| `tests/s105-m2-prompts-and-continuity.test.js` | **5 / 5 pass** | All 5 progressive prompts aligned verbatim to M1 contracts without legacy prose checklists or arbitrary word-count limits; thin Step 5 editorial-only contract; deterministic brief-provided shared-source transport without retranscription; authoritative stored-capture handoff honours author edits & never leaks Stage 4 specs/context/source into Stage 5; `S105-AD-002` Step 5 Interactive runner-guidance leak fixed for both progressive & legacy LJ in live `app.js` VM; `S105-AD-003` reconciled continuity guidance & validator; legacy LJ & Interactive preserved |
| `tests/s105-m1-lj-assembly.test.js` | **8 / 8 pass** | M1 stage validators, deterministic assembler & legacy separation intact |
| `tests/s104-m4-proportionate-commissioning.test.js` | **2 / 2 pass** | Sprint 104 M4 proportionate commissioning non-regression |
| `tests/s94-learning-journey-wp2-continuity-validation.test.js` | **20 / 20 pass** | Continuity validator & automatic-transfer rejection non-regression |
| `tests/s103-duration-fidelity-guidance.test.js` | **5 / 5 pass** | Familiar vs unfamiliar reading & duration fidelity guidance non-regression |
| `tests/s96-lj-shared-source-design-page-boundary.test.js` | **19 / 19 pass** | Shared source boundary non-regression |
| `tests/s91-learning-journey-design-page-run-stage.test.js` | **4 / 4 pass** | LJ Design Page run-stage routing & Interactive non-regression |
| Non-LJ product family design-page suites (`s94-assessment-design-page-framing-string`, `s92-situated-task-slice1-family-design-page`, `s85-expository-design-page-visual-affordances`, `s85-expository-design-page-capture-shape`) | **37 / 37 pass** | Assessment Pack, Situated Task, and Expository product families unaffected |
| **Focused Milestone 2 total** | **100 / 100 pass** | Zero regressions across LJ and non-LJ product families; no live generation yet |

### Milestone 3 gate — Run orchestration, invalidation, reload persistence, clear-run, duplication & legacy compatibility (**Verified 2026-11-25**)

| Check / Suite | Result | Verified Scope |
| ------------- | ------ | -------------- |
| `node --check` on `lib/learning-journey-assemble.js`, `lib/learning-journey-sibling-prompts.js`, `app.js`, `tests/s105-m2-prompts-and-continuity.test.js`, `tests/s105-m3-lifecycle-and-orchestration.test.js` | **Pass** (exit 0) | All touched JS files syntax clean |
| `tests/s105-m3-lifecycle-and-orchestration.test.js` | **6 / 6 pass** | 5-stage progressive capture, validation, persistence & deterministic assembly requiring all 5 stages and rejecting monolithic bypass; authoritative author-edit propagation through compact Stages 2–5 handoffs (Stage 5 receives editorial cues without specs/source) + upstream invalidation clearing downstream stages & run-derived metadata while preserving brief-provided source; reload persistence restoring all 5 stages identically, failing closed on corrupted Stage 3, and zero phantom captures on empty reload; origin-aware clear-run & clean workflow duplication (`S105-AD-004`) for both run-generated and brief-provided source; legacy pre-105 LJ monolithic Step 5 compatibility; stale async persistence write abort & durable `ABSENT≠DELETE` purge preventing resurrection on reload |
| `tests/s105-m2-prompts-and-continuity.test.js` | **5 / 5 pass** | M2 progressive prompts, strengthened handoff assertions, Step 5 runner-guidance fix & continuity reconciliation |
| `tests/s105-m1-lj-assembly.test.js` | **8 / 8 pass** | M1 stage contracts, deterministic assembler & legacy separation |
| `tests/qa-lj-no-phantom-run-captures.test.js` | **2 / 2 pass** | Zero phantom run captures across commission creation & switching |
| `tests/qa-lj-batch-component-creation.test.js` | **6 / 6 pass** | LJ single & batch component creation non-regression |
| `tests/qa-lj-commission-native-and-lifecycle.test.js` | **3 / 3 pass** | Commission-native creation & deletion lifecycle non-regression |
| `tests/s96-lj-shared-source-design-page-boundary.test.js` | **19 / 19 pass** | Shared source write-once & derived-stat contradiction boundary |
| `tests/s94-learning-journey-wp2-continuity-validation.test.js` | **20 / 20 pass** | Continuity validation & author inspection / learner export safety |
| `tests/s91-learning-journey-design-page-run-stage.test.js` | **4 / 4 pass** | LJ Design Page run-stage routing & Interactive isolation |
| `tests/s103-clear-run-learner-runtime-isolation.test.js` | **7 / 7 pass** | Clear run data learner-runtime isolation non-regression |
| `tests/s102e-clear-run-data-practice-child.test.js` | **3 / 3 pass** | Clear run data Practice child & stale persist abort non-regression |
| `tests/page-vnext-assemble.test.js` | **32 / 32 pass** | Interactive & Practice partial-page assembly non-regression |
| `tests/s85-expository-assembled-learner-page-sections.test.js` | **6 / 6 pass** | Expository progressive assembly non-regression |
| `tests/s104-m5-workload-estimation.test.js` | **6 / 6 pass** | Authoritative durations & workload feasibility adapter non-regression |
| Sprint 104 M2–M4 safeguards (`s104-m2-practice-episode-plan`, `s104-m3-downstream-practice-reconciliation`, `s104-m4-proportionate-commissioning`) | **13 / 13 pass** | Sprint 104 Practice & proportionate commissioning safeguards intact |
| **Focused Milestone 3 total** | **140 / 140 unique tests pass** (`127/127` + `13/13` M2–M4; `19/19` M2–M5) | Zero regressions across LJ lifecycle, clear-run, duplication, Interactive, Practice, Expository, and Sprint 104 safeguards; no live generation yet |

### Milestone 4 gate — Live clean Economics LJ validation & Sprint 104 handback
- **Live validation (fresh workflow; original baseline & incomplete Sprint 104 run preserved untouched):**
  1. Run the 90-minute / 2-week *Correlation and Causation: Making Sense of Economic Evidence* brief end-to-end through progressive Learning Journey Steps 1–5.
  2. Confirm economical stage outputs across Steps 1–4 (no ~14,000-word Step 4 sprawl) and thin Step 5 synthesis completing comfortably within model output limits.
  3. Confirm deterministic final assembly passes all LJ Design Page, duration reconciliation, shared-source, continuity, and Journal validations cleanly.
  4. Verify browser reload persistence, preview contract, single/batch commissioning handoff (carrying authoritative `allocated_minutes`, component outcomes, journey outcomes, shared source, and `{commission_id}.{elicitation_id}` bindings), and unified shell export readiness.
- **Handback to Sprint 104:** Close Sprint 105 and resume **Sprint 104 live acceptance** (Milestone 1 integrated live acceptance, Milestone 6 live 5-/15-/30-minute Practice sensitivity probes, and Milestone 7 Economics component regeneration, baseline comparison against preserved pre-intervention captures, educational QA, and unified learner-runtime acceptance).
