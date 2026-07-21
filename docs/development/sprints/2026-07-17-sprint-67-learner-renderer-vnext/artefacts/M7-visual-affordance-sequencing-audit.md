# Sprint 67 — Visual Affordance Contract and Sequencing Verification

Date: 2026-07-21

## 1. Existing visual-affordance source contract (Sprint 38.4)

Page JSON root fields:

| Field | Purpose |
|-------|---------|
| `visual_affordance_schema_version` | `"38.4"` for authoritative handover |
| `activities_visual_review[]` | Per-activity review envelope |
| `visual_affordances[]` | Typed affordance records |

Generate records require at minimum: `affordance_id`, `activity_id`, `visual_decision: "generate"`, `rationale`, `visual_slot`, `tier`, `purpose`, `preferred_representation`, plus discipline/spoiler metadata.

Valid `visual_slot` values:

- `activity-after-header`
- `materials-entry`
- `materials-card-grid-after`
- `materials-table-pair-between`
- `assessment-before-checkpoint`

Authoritative mode emits hooks only for `visual_decision: "generate"` rows whose `activity_id` + `visual_slot` match a renderer insertion point. `defer` and `reject` suppress hooks for that activity/slot.

## 2. Downstream discovery contract (VEU v1.2.1)

Discovery selector: `.util-visual-affordance`

Required attributes for matching:

| Attribute | Role |
|-----------|------|
| `data-visual-slot` | Placement key |
| `data-activity-id` | Activity scope |
| `data-visual-activity-id` | Activity scope (mirror) |
| `data-affordance-id` | Authoritative record join (when present) |
| `data-visual-subject` | Optional activity title hint |
| `hidden` + `aria-hidden="true"` | Hidden from learners |

Hook HTML shape (legacy + vNext):

```html
<div class="util-visual-affordance util-visual-affordance--{slot}"
     data-visual-slot="{slot}"
     data-visual-subject="..."
     data-visual-activity-id="A2"
     data-activity-id="A2"
     data-affordance-id="va-..."
     hidden aria-hidden="true"></div>
```

CSS: `.util-visual-affordance{display:none!important}` in export shell.

## 3. vNext preservation status

| Stage | Status |
|-------|--------|
| Source JSON → plan | **Preserved** via `sprint38-visual-affordance-plan.js` |
| Plan → model hooks | **Preserved** via `build-visual-affordance-placements.js` |
| Model → HTML | **Preserved** via `render-visual-affordance.js` |
| Legacy heuristic mode | **Preserved** when `visual_affordances[]` absent |
| Authoritative mode | **Preserved** — generate/defer/reject behaviour matches Sprint 38 |
| Downstream discovery | **Compatible** — same selector and attributes |

Prior gap (pre-this task): vNext emitted **no** hooks. Now restored.

## 4. Model fields added

**LearnerPageModel**

- `visualAffordancePlan: { legacy, slotGenerate, affordanceCount? }`
- `visualAffordanceBeforeAssessment: VisualAffordanceHook | null`

**LearnerActivity**

- `visualAffordanceAfterHeader: VisualAffordanceHook | null`

**BeatContentItem**

- `visualAffordanceBefore: VisualAffordanceHook | null`
- `visualAffordanceAfter: VisualAffordanceHook | null`

## 5. Placement strategy

| Slot | vNext insertion point |
|------|----------------------|
| `activity-after-header` | Immediately after `</header>` in activity, before mapped outcomes/framing |
| `materials-entry` | Before first material in activity (first beat stream material) |
| `materials-card-grid-after` | After scenario/prompt_set material when next stream item warrants (table, template, checklist, etc.) |
| `materials-table-pair-between` | After table material when next material is also a table type |
| `assessment-before-checkpoint` | After assessment heading, before `.util-assessment-list` |

Legacy warrants are computed at model-build from typed materials/prompts — no raw JSON inspection in render modules, no text heuristics.

## 6. Instruction-alignment rule and limitations

**Rule:** Positional 1:1 pairing in `buildBeatContentSequence()`.

At each index `i`: emit instruction `i` (if present), then material `i` (if present). Extras from either side are retained in source order. There is **no** explicit source ownership link between learner-task steps and materials.

**Limitation:** Interleaved output reflects deterministic index pairing, not semantic “this step governs this material” unless future source adds explicit ownership fields.

**Guarantees:** Unmatched instructions/materials are never dropped; source order preserved; stable `BeatContentItem[]` structure supports richer alignment later.

## 7. Prompt-placement findings

| Prompt field | Placement rule | Pedagogical rationale |
|--------------|----------------|----------------------|
| `reasoning_orientation` | Activity framing (before beats) | Explicit model field — orient before activity content |
| `self_explanation_prompt` | Beat entry | Activate prior knowledge before new content |
| `conceptual_contrast_prompt` | Beat entry | Contrast before encountering new concept |
| `intellectual_coherence_bridge` | Beat entry | Bridge prior lesson context before beat work |
| `argument_structure_hint` | Beat entry | Structural guidance before evaluation materials |
| `transfer_or_application_task` | **After** interleaved content, before expected output | Apply/consolidate after encountering beat materials |

Transfer prompts moved from beat-entry to post-interleave in this task to avoid referring to consolidation materials the learner has not yet read.

## 8. Files modified / added

**New**

- `lib/learner-renderer-vnext/sprint38-visual-affordance-plan.js`
- `lib/learner-renderer-vnext/build-visual-affordance-placements.js`
- `lib/learner-renderer-vnext/visual-affordance-warrants.js`
- `lib/learner-renderer-vnext/render-visual-affordance.js`
- `lib/learner-renderer-vnext/discover-visual-affordance-hooks.js`
- `tests/learner-renderer-vnext-visual-affordances.test.js`
- `tests/learner-renderer-vnext-beat-content-sequence.test.js`
- `scripts/write-heteroscedasticity-vnext-va-export.js`

**Modified**

- `lib/learner-renderer-vnext/types.js`
- `lib/learner-renderer-vnext/build-page-model.js`
- `lib/learner-renderer-vnext/build-beat-content-sequence.js`
- `lib/learner-renderer-vnext/render-activity.js`
- `lib/learner-renderer-vnext/render-beat.js`
- `lib/learner-renderer-vnext/render-page.js`
- `lib/learner-renderer-vnext-browser.js` (rebuilt)
- `tests/learner-renderer-vnext-feature-flag.test.js`

## 9. Tests and results

| Suite | Tests | Result |
|-------|-------|--------|
| `learner-renderer-vnext-beat-content-sequence.test.js` | 10 | pass |
| `learner-renderer-vnext-visual-affordances.test.js` | 9 | pass |
| All `learner-renderer-vnext-*.test.js` | 103 | pass |

Coverage includes: hook shape, legacy vs authoritative counts, stable IDs, placement, defer suppression, downstream selector compatibility, no duplicates, legacy renderer unchanged.

## 10. Fresh export and downstream discovery

Export: `docs/development/sprints/2026-07-17-sprint-67-learner-renderer-vnext/artefacts/heteroscedasticity-vnext-visual-affordances-export.html`

Discovery via `discoverVisualAffordanceHooks()` finds legacy-mode hooks across A1–A5 plus assessment (no `data-affordance-id` when source lacks `visual_affordances[]`).

Authoritative injection (`records.inflation_a2_generate` on A2) yields exactly one hook in A2 with `data-affordance-id="va-A2-cpi-deflator-distinction"` at `materials-entry`.

## 11. Remaining risks

1. **Beat-scoped vs activity-scoped materials:** vNext places materials inside beat streams; legacy flattened all materials into one activity region. Slot placement is pedagogically equivalent but DOM paths differ — VEU matches on slot + activity id, not DOM depth.
2. **Card-grid slot in vNext:** Legacy targets `.util-card-grid`; vNext maps `scenario` / `prompt_set` materials to `materials-card-grid-after` by typed material sequence, not class name.
3. **Instruction–material semantic alignment** still positional only until source adds explicit ownership.
4. **`sprint38-visual-affordance-plan.js`** mirrors Sprint 38 render-plan logic for browser-bundle safety; keep in sync if schema evolves.
