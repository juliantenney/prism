# Sprint 41 Slice 5 — Delivery-Mode Independent Learner Framing

## Purpose

Promote core learner-facing pedagogic scaffolds from self-directed-only prompt gating to **all learner-facing page workflows**, including workshop learner handouts, while preserving facilitator-specific fields and materials.

## Findings

### Where gating occurred

| Layer | Gated? | Mechanism |
| ----- | ------ | --------- |
| **Prompt generation (DLA)** | **Yes** | `shouldApplySelfDirectedLearnerPageScaffoldBase` required `delivery_context` self-directed/async; `resolvePedagogicEnrichmentContractIds` returned `[]` when `isWorkflowBriefFacilitatedDeliveryIntent` |
| **Prompt generation (Design Page)** | **Yes** | `includeFieldPreservation` only when `shouldApplySelfDirectedLearnerPageDesignPagePreservationScaffold` (self-directed + learner page) |
| **PEL contracts** | **Yes** | Orientation block stated "independent self-study" only; blocked for facilitated workshop briefs even with learner handout |
| **GAM self-study materials** | No change | Remains self-directed only (`shouldApplySelfDirectedLearnerPageGamMaterialScaffold`) |
| **LD-SELF-DIRECTED-RHETORIC** | No change | Remains self-directed only (facilitator-ban rhetoric, closure minima) |
| **Page composition merge** | **No** | `mergeSelfDirectedActivityFramingFieldsIntoPageActivities` already delivery-agnostic |
| **Renderer** | **No** | `renderActivityFramingForActivity` and cognition blocks render whenever fields exist; Sprint 37 workshop visibility test already confirmed |

### Root cause

Historical assumption: PEL/self-directed learner supports target **async self-study** only. Workshop learner handouts were treated as facilitated-delivery workflows and skipped DLA output contracts and PEC injection — even when `desiredOutputs` included **learner handout**.

`isLearnerPageFocusedOutputForMaterialShapeScaffold` also failed to recognise **learner handout** phrasing (only matched `page`, `learner page`, etc.).

## Architectural assessment

**Smallest safe change:** decouple **learner-page pedagogic framing** from **self-directed delivery** at the prompt scaffold layer.

Two parallel gates now exist:

| Gate | Applies when |
| ---- | ------------ |
| `shouldApplyLearnerPagePedagogicFramingScaffold` | Learner-facing page/handout in workflow outputs (any delivery mode) |
| `shouldApplySelfDirectedLearnerPageScaffoldBase` | Self-directed/async delivery + learner page (unchanged — GAM, rhetoric, material shape) |

Facilitated learner pages use `buildLearnerPageDlaOutputContractOverrideBlock({ facilitated: true })` which **allows** `facilitator_moves` while still requiring learner-facing orientation fields on activity rows.

**Not changed:** workshop material visibility (answer keys hidden), facilitator_notes sanitization skip on workshop pages, cognition pack detection (`self_study_cognition_pack` still requires self_directed/async).

## Implementation summary

### `app.js`

- Added `shouldApplyLearnerPagePedagogicFramingScaffold`, `isFacilitatedLearnerPageFramingContext`
- Broadened `isLearnerPageFocusedOutputForMaterialShapeScaffold` to include `learner handout`, `participant handout`, `handout page`, `learner pack`
- Split DLA scaffold application: material shape (self-directed) vs activity framing + output contract (learner page)
- `resolvePedagogicEnrichmentContractIds` uses learner-page gate; removed facilitated-delivery blanket block
- `buildPelOrientationContractPromptBlock({ facilitated })` — workshop variant for learner handouts
- `buildLearnerPageDlaOutputContractOverrideBlock({ facilitated })` — renamed from self-directed-only contract
- Design Page compose `includeFieldPreservation` uses learner-page gate

### `lib/ld-design-page-compose-contract.js`

- Field preservation label: `learner-facing page` (was `self-directed learner page`)

## Tests added/updated

| File | Change |
| ---- | ------ |
| `tests/workflow-learner-page-framing-delivery-mode.test.js` | **New** — scaffold gates, Design Page preservation, workshop HTML render |
| `tests/workflow-pel-orientation.test.js` | Workshop learner handout gets PEC; facilitator-only excluded |
| `tests/workflow-pel-reasoning.test.js` | Same split |
| `tests/workflow-self-directed-activity-framing-adoption.test.js` | Updated contract/marker regexes |
| `tests/utility-self-directed-activity-framing.test.js` | In-person learner page now gets framing |

## Before vs after behaviour

### Workshop brief with learner handout (`WORKSHOP_BRIEF`)

| Aspect | Before | After |
| ------ | ------ | ----- |
| PEC orientation/reasoning on DLA | Absent | Present |
| `OUTPUT CONTRACT (learner-facing page)` on DLA | Absent | Present |
| `learner-page activity framing` block | Absent | Present |
| `LD-SELF-DIRECTED-RHETORIC` on DLA | Absent | Still absent |
| Design Page field preservation | Absent | Present |
| `facilitator_moves` in output contract | N/A | Optional (facilitated variant) |

### Facilitator-only brief (`FACILITATED_WORKSHOP_BRIEF`)

| Aspect | Before | After |
| ------ | ------ | ----- |
| PEL / learner framing scaffolds | Absent | **Still absent** (no learner page in outputs) |

### Renderer (workshop learner page with framing fields in JSON)

| Aspect | Before | After |
| ------ | ------ | ----- |
| `activity_preamble`, PEL cues, cognition blocks | Rendered when present | **Unchanged** (already worked) |
| `facilitator_moves` in HTML body | Not rendered on activity card | **Unchanged** |

### Self-directed Marx brief

| Aspect | Before | After |
| ------ | ------ | ----- |
| Full DLA + PEC + rhetoric stack | Present | **Present** (marker text renamed to learner-facing) |

## Constraints honoured

- No EQF evaluator/prompt changes
- No renderer redesign
- No schema changes
- GAM self-study voice and self-directed rhetoric remain delivery-gated
