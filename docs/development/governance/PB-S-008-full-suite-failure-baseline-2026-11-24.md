# PB-S-008 — Full-suite pre-existing failure baseline

**Recorded:** 2026-11-24 · **Status:** Open technical debt — **not investigated, not sprint-allocated**  
**Backlog item:** [PB-S-008](../../backlog/PRODUCT-BACKLOG.md#pb-s-008--full-suite-pre-existing-failures-technical-debt)  
**Related:** [PB-S-007](PB-S-007-broad-suite-failure-reconciliation.md) (earlier reconciliation, complete 2026-10-05)

## How this baseline was taken

`node --test --test-concurrency=4 tests/*.test.js` was run three times during the C06 QA work (Windows, PowerShell, Node 24):

| Run | Code state | Pre-existing tests run | Failed |
| --- | ---------- | ----: | -----: |
| 1 | Committed HEAD `2b572ec` (changes stashed; the new C06 test file excluded from the counts) | 4956 | 86 |
| 2 | HEAD + C06 F01/F04 first pass | 4956 | 86 |
| 3 | HEAD + final C06 changes (bundle rebuilt) | 4956 | 84 |

- **84 failures occur in all three runs** and are listed below. **No failure was introduced by the C06 changes** (the failure set at HEAD is a superset of the final set).
- **Two further tests** fail only while the committed vNext browser bundle is stale against `lib/learner-renderer-vnext/` source, and pass after `npm run build:learner-renderer-vnext-browser`:
  - `tests/learner-renderer-vnext-browser-artefact-freshness.test.js` — committed vNext browser artefacts match a fresh build from source
  - `tests/s101e-practice-selection-export-path.test.js` — 101E export-path: browser bundle artefacts match modular source

  They are a **release-hygiene check, not a defect**: rebuild the bundle whenever renderer source changes and before committing.
- Correction to an earlier chat figure: "87" counted distinct `✖` output lines; the test runner's failure count was 86 at HEAD and 84 in the final run.
- The `s96` browser tests and the Sprint 96 evidence screenshots: several browser tests regenerate PNGs under `docs/development/sprints/2026-11-03-sprint-96-unified-learning-journey-experience/evidence/` as a side effect of running. Revert them (`git checkout -- <evidence dir>`) unless a screenshot refresh is intended.

## What is known and not known

**Known:** the failures exist at committed HEAD, are stable across runs, and are unrelated to the Assessment Pack evidence, guidance and material-rendering changes. One verified example: `s97-m3-t1-learning-journal-pipeline` asserts Learning Journey prompt wording (`/Interactive Resource producers are legitimate/`) that the current prompt no longer contains.

**Not known:** the cause of each failure. They have **not** been classified. Likely families, to be confirmed rather than assumed: stale asserted prompt/contract wording after Sprints 95–103; IndexedDB / file-picker / browser E2E tests that need a headed or particular environment (`s75-*`, `sprint-70-*`, `s95-*`, `s96-*browser*`); a size-band assertion (`ld-dla-evidence-decision-consistency-prompt`); MathJax delimiter tests (`mathjax-delimiter-preservation`, 9).

## Suggested approach (for the separate investigation)

1. Classify each failure: stale assertion, environment/harness, or genuine defect (PB-S-007 method).
2. Fix or retire stale assertions; do not weaken tests to pass.
3. Escalate any genuine product defect as its own backlog item.
4. Decide whether the browser E2E group belongs in the default `tests/*.test.js` run.

## Failing tests (84, stable across runs)

### `tests/s75-run-capture-migration.test.js` (10)

- A inline-only capture migrates to resource ref
- B identical raw/final uses one resource
- C differing raw/final preserves both resources
- D ref-only capture remains unchanged
- E inline+identical-ref removes inline after verification
- F broken ref + valid inline repairs correctly
- G inline/ref conflict is reported, not silently overwritten
- K owned runstate stores refs not inline bodies after migration
- L cold restore hydrates from refs only
- O visible DLA during hydration updates textarea when ready

### `tests/mathjax-delimiter-preservation.test.js` (9)

- preview/export source: durable HTML stays unenhanced; preview srcdoc gets MathJax when math present
- preview srcdoc: non-math HTML remains unchanged and has no MathJax bootstrap
- preview hook: no supported delimiters means no MathJax call
- preview hook: MathJax unavailable in iframe exits safely
- preview hook: supported delimiters call iframe MathJax typeset
- preview hook: parent window MathJax is ignored
- preview hook: typeset rejection does not throw or corrupt preview HTML
- preview hook: repeated rerenders preserve latest non-math HTML
- preview MathJax: minimal document gets inline and display delimiter support

### `tests/sprint-70-slice-8d-file-picker-browser-e2e.test.js` (4)

- Slice 8D integration: unversioned preview write cannot overwrite asset-aware iframe revision
- Slice 8D integration: real file-picker path commits data_url asset and refreshes iframe
- Slice 8D integration: hook-driven attach cannot bypass data_url requirement vs file-picker path
- Slice 8D integration: re-click Preview HTML reuses current learner page with attached images

### `tests/learner-renderer-vnext-compose-a5.test.js` (3)

- adapter: A5 Learn uses worked_judgement modelling materials
- adapter: A5 Check includes diagnostic review content only
- render slice: A5 Learn keeps reference tables static and places capstone materials

### `tests/s75-generated-workflow-run-persistence-identity.test.js` (3)

- A/B/C: generated ids are assigned once and stable across save/load + edit/save/reload
- E/F: existing ids preserved; new step gets one stable id; title/notes/output edits keep ids
- G: EP/DLA/GAM/CLS/DP captures restore after edit/save/reload and DLA gate passes

### `tests/s75-run-position-session-scope.test.js` (3)

- C/D/E: cold session starts at Step 1 while captures restore
- F: workflow selection does not clear restored capture maps
- stored runIndex remains in durable schema but is session-ignored on cold load

### `tests/s95-m1-assessment-pack-lifecycle.test.js` (3)

- S95-T-002/004 mount → type → unmount → remount restores draft text
- S95-T-004 dispose is idempotent and repeated mount does not duplicate handlers
- selection change persists across remount via draft pageKey

### `tests/s75-c06-ld-create-output-selection.test.js` (2)

- B: Select contains placeholder + Self-study + Workshop + Expository Resource
- K: Research → Learning Design sync shows/populates the dropdown immediately

### `tests/s75-run-ux-refinements.test.js` (2)

- Continue to Authoring readiness uses persisted Design Page state
- reload, switching workflows, and clear-runstate recompute authoring readiness

### `tests/s91-learning-journey-wp1-wp2.test.js` (2)

- learning_journey is registered as a first-class product
- authenticated Learning Journey prompts match export top-level bodies

### `tests/s94-learning-journey-wp4-honour-brief.test.js` (2)

- commissioned Expository GLC, MK, and DLO receive labelled brief and honour instruction
- WP3 delivery remains idempotent and stored family / catalog prompt bodies are unchanged

### `tests/s96-constituent-catalogue-persist-reload.test.js` (2)

- failed IndexedDB write rolls back ghost constituent
- constituent create persists in IndexedDB and survives reload

### `tests/sprint-70-slice-e4-export-ui-and-e5-open-tab.test.js` (2)

- E4 regression: preview srcdoc preserves inline data/blob/remote image sources
- E5: Open in New Tab path remains session HTML (unchanged)

### `tests/ld-dla-evidence-decision-consistency-prompt.test.js` (1)

- S76 P04: canonical assembler stays inside the post-Phase-D size band

### `tests/lj-cascade-deletion.test.js` (1)

- Deleting Learning Journey cascades to owned constituents and leaves unrelated

### `tests/s75-authoring-assembly-learner-ready.test.js` (1)

- E: Design Page partial retains title/synthesis while DLA/GAM bodies survive

### `tests/s75-c03-run-execution-orientation.test.js` (1)

- Copy payload generation path unchanged (buildWorkflowStepInstructions still used)

### `tests/s75-d22-create-one-product-simplification.test.js` (1)

- B: LD Create no longer shows Scope/constraints as an active field

### `tests/s75-delete-workflow-cleanup.test.js` (1)

- Delete removes workflow definition runstate and owned resources only

### `tests/s75-rename-preserves-workflow-identity.test.js` (1)

- Rename updates name in place and preserves identity, selection, runstate, and resources

### `tests/s75-run-layout-and-default-selection.test.js` (1)

- 22: delete keeps immediate empty selection; later render path can default-select

### `tests/s75-run-progress-segments.test.js` (1)

- 10: clear run data removes saved-data indication via existing cleanup

### `tests/s75-workflow-import-collision-roundtrip.test.js` (1)

- D: Import as new creates a new workflow id and keeps existing untouched

### `tests/s78-t-042-learner-workspace-authoring-fidelity.test.js` (1)

- T-042 GAM enrich contract forbids stranded bold labels and requires **Label:** template syntax

### `tests/s79-t-005-gam-live-canonical-switch.test.js` (1)

- S79-T-005: Studio live chain still invokes full pre-graft scaffold functions

### `tests/s79-t-006-gam-integration-hardening.test.js` (1)

- S79-T-006: Studio scaffolds remain before canonical graft

### `tests/s88-assessment-depth.test.js` (1)

- end of pack hides checking until finish and the evidence profile stays conservative

### `tests/s88-assessment-pack-publish.test.js` (1)

- Assemble From Current Workflow Run reads the AAC artefact from the run-step output chain

### `tests/s88-first-class-topic-propagation.test.js` (1)

- tests\s88-first-class-topic-propagation.test.js

### `tests/s89-product-family-boundary.test.js` (1)

- four first-class products are declared including Learning Journey

### `tests/s91-learning-journey-design-page-acceptance.test.js` (1)

- valid GPT Learning Journey Step 5 page passes the live Run acceptance path

### `tests/s91-learning-journey-display-labels.test.js` (1)

- Learning Journey proposed stages expose intended display names and purposes

### `tests/s92-situated-task-record-placement-page-kind.test.js` (1)

- 5. Hybrid: placed alongside sections; unplaced in consolidated record region

### `tests/s92-situated-task-slice3-lj-commission.test.js` (1)

- 2. LJ prompt guidance contains Situated Task centre-of-gravity discriminator

### `tests/s93-assessment-pack-guided-review.test.js` (1)

- weakness statement and written judgement persist as separate text entries

### `tests/s93-authoring-current-workflow-preview.test.js` (1)

- Authoring layout keeps JSON behind Advanced and shows resource identity

### `tests/s93-expository-editorial-opening.test.js` (1)

- a fulfilled editorial image opens the chapter and an unfulfilled one leaves no artefact

### `tests/s93-situated-editorial-opening.test.js` (1)

- a fulfilled Situated opening image renders after the title and an unfulfilled one does not

### `tests/s93-zip-export-active-resource.test.js` (1)

- Learning Journey ZIP still reports genuinely missing constituents

### `tests/s94-learning-journey-home.test.js` (1)

- fulfilled editorial banner uses a learner caption and keeps production text out

### `tests/s94-learning-journey-wp3-original-brief.test.js` (1)

- commissioned Expository GLC, MK, and DLO receive the labelled brief once

### `tests/s94-learning-journey-wp5-bring-forward.test.js` (1)

- commissioned Expository Development receives brief, honour, and WP5 instruction

### `tests/s95-sequential-section-nav-browser.test.js` (1)

- S95 browser: Interactive section nav remounts and preserves journey hash

### `tests/s96-artefact-carry-forward-signposting.test.js` (1)

- C5 producer signpost names C6 and consumer reference identifies C1

### `tests/s96-c2-expository-number-line-formula-regression.test.js` (1)

- editorial opening still renders beside an attached XM number line

### `tests/s96-interactive-editorial-opening.test.js` (1)

- title then opening image then Overview; missing image leaves layout unchanged

### `tests/s96-m1-navigation-layout-browser.test.js` (1)

- M1 browser: sticky clearance, collapse persistence, narrow + zoom layouts

### `tests/s96-m2-visual-coherence-browser.test.js` (1)

- M2 browser: compact toggle, full-height sidebar, reading width, sticky, zoom

### `tests/s96-m5-skip-main-a11y.test.js` (1)

- M5.3 browser: skip link focuses resource title; named main; TOC and controls remain usable

### `tests/s97-m3-t1-learning-journal-pipeline.test.js` (1)

- Design Page journal guidance preserves all Step 4 producers including Interactive
