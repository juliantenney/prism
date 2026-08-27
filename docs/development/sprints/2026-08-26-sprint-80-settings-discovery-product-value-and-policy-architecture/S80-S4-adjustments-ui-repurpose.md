# S80-S4 — Adjustments UI repurpose

**Status:** COMPLETE — awaiting operator review
**Slice:** S4 of the S80-T-007 implementation plan
**Authoritative basis:** S80-T-006 (decided), S80-T-007 (accepted), S1/S2/S3 (accepted)

---

## 1. Scope delivered

Four changes, no more:

1. The workflow **Settings** tab became **Adjustments**, and the historical
   pack-derived Settings catalogue left the active product surface.
2. **Instructions** (`step.notes`) and **Additional Instruction**
   (`step.additional_instruction`) are now presented as two distinct, clearly
   labelled capabilities. Both are retained; neither was merged or migrated.
3. **Design Episode Plan now supports Additional Instruction** — an explicit
   operator correction superseding the S2/S3 exclusion.
4. Step 1 no longer presents **stale commissioning prose** beside an explicitly
   adjusted typed parameter.

Not done, per instruction: Duration (S5), Audience, Assessment parameters, D1,
D2, D3, new workflow parameters, unrelated legacy cleanup.

---

## 2. Final Adjustments UX

```
Adjustments

Workflow parameters
  Reuse this workflow with different values. Leave a field blank to keep
  the value it was created with.

  Topic          [                    ]  placeholder: "Auto — Henry VIII"

Workflow steps
  Add optional guidance for individual steps. Everything here is optional —
  leave a step untouched to let PRISM decide.

  Model Knowledge
    Additional instruction (optional)   [ ... ]
      Optional guidance to influence choices PRISM can make when generating
      this step. It cannot override workflow parameters, required output
      structure, or information established by earlier steps.
    Instructions (optional)             [ ... ]
      Your own instructions for this step, included when the step runs. Use
      this for steps you have written yourself, or to add detail PRISM has no
      other way to know.

  Design Episode Plan
    ... (same two fields)
```

Additional Instruction is placed above Instructions because it is the
PRISM-stage-steering mechanism most authors will want; Instructions is the
general-purpose escape hatch. No implementation vocabulary
(`resolvedFactors`, `workflowContext`, registry, projection,
`PRISM_STEP_PARAMS`, canonical assembler) appears anywhere on the surface —
asserted by test.

---

## 3. Settings → Adjustments rename scope

Renamed (user-visible, this feature only):

| Location | Before | After |
| --- | --- | --- |
| `index.html` mode tab text | `Settings` | `Adjustments` |
| `index.html` tab `aria-label` | `Settings — workflow and step parameters` | `Adjustments — workflow parameters and step guidance` |
| `index.html` tab `title` | `Tune pack-defined workflow and step parameters` | `Reuse this workflow with different values, and add optional step guidance` |
| `index.html` panel `aria-label` | `Workflow settings — pack parameters` | `Adjustments — workflow parameters and step guidance` |
| `index.html` panel hint | `...open Settings to tune pack-defined parameters.` | `Select a saved workflow to review its Adjustments.` |
| `index.html` save hint | `Changes sync to workflow and step notes...` | `Changes apply as you edit...` |
| `app.js` panel hint | pack-parameter framing | Adjustments framing |
| `app.js` tab tooltips | pack-control counts | Adjustments semantics |
| `app.js` post-create toast (×2) | `You can adjust Settings at any time.` | `You can open Adjustments at any time.` |
| `app.js` design-tab toast | `...open Settings on the matching step to tune parameters.` | `...open Adjustments to add guidance for the matching step.` |

Deliberately **not** renamed:

- `#apiSettings` / `.api-settings` — the API key panel is a different product
  concept (asserted by test).
- The Prompt Factory `Settings...` button on step rows — it seeds the refinement
  panel and is unrelated to workflow Adjustments. Flagged as a naming-clarity
  item, not changed in S4.
- Element IDs, CSS class names and internal function names
  (`unifiedWorkflowSettings*`, `workflowModeSettingsBtn`, …). Renaming these
  would ripple through unrelated tests for no product benefit; the operator
  asked for user-visible terminology.

---

## 4. Workflow-parameter rendering

`renderAdjustmentsWorkflowParametersSection` is unchanged from S2 in behaviour
and remains fully declarative: it filters the registry to
`projection === "workflowContext"` and applicable declarations, then renders
from declaration metadata (`label`, `help`, `type`, `options`). There is no
Topic branch in the UI.

Extensibility is asserted rather than asserted-by-comment: a test registers a
second `workflowContext` declaration and both parameters render through the same
path with no UI change. Duration/Audience/Assessment will therefore appear when
declared, without rebuilding the panel.

### Topic Auto UX

| State | Field | Storage | Effective value | Provenance |
| --- | --- | --- | --- | --- |
| Auto | empty, placeholder `Auto — Henry VIII` | no `adjustments` key | commissioned Topic | `commissioned` |
| Adjusted | `Elizabeth I` | `adjustments.parameters.topic` | `Elizabeth I` | `adjustment` |
| Cleared | empty again | key deleted | commissioned Topic | `commissioned` |

The commissioned value is contextual placeholder text only; it is never written
as an explicit adjustment. No `AUTO` sentinel exists — absence is Auto.

---

## 5. Historical Settings catalogue disposition

### Removed from the active surface (now)

| Surface | Change |
| --- | --- |
| Adjustments panel | `renderUnifiedWorkflowSettingsUI` no longer calls `renderUnifiedWorkflowSettingsContent`; no pack control renders |
| Async pack recovery | the panel no longer needs `briefConfig`, so the `Loading pack parameter metadata…` states are gone from the render path |
| Step badge | `Tunable` / `Settings` badge removed |
| Step cue | `Editable in the Settings tab…` prose removed |
| Planning adequacy notice | `Open Settings` button removed (suggestion text retained) |
| Brief provenance rows | `Open Settings` button removed |
| Tab badge | numeric pack-control count replaced (§8 below) |

### Retained internally (deliberately, not yet retired)

Retained because removal is a larger, separable change with its own regression
surface, and because §5 explicitly authorises the distinction:

- `aggregateUnifiedWorkflowParameterSections`, `renderUnifiedWorkflowSettingsContent`,
  `renderWorkflowPackParameterControlsSection`, `collectPackParamRowsFromDomContainer`,
  `syncUnifiedWorkflowSettingsToStepNotes`, `buildUnifiedWorkflowSettingsCoverageHint`,
  `countUnifiedWorkflowVisibleParameterControls`,
  `recoverWorkflowBriefConfigForUnifiedSettings` and the surrounding
  brief-config discovery/merge helpers.
- `isWorkflowStepConfigurableInSettings` — left intact and still unit-tested; S4
  gates its *callers* instead, which is the narrower change.
- `parseWorkflowStepParamBlock` / `upsertWorkflowStepParamBlock` and all
  `[PRISM_STEP_PARAMS]` parsing.
- `resolvePlanningAdequacySettingsNavigationTarget`,
  `focusWorkflowStepSettings`, `decorateWorkflowStepSettingsDiscoverability`.

None of these is reachable from the Adjustments surface as runtime authority.
Their 60+ existing unit tests continue to pass unchanged, which is what makes
the retention safe rather than merely convenient.

**Nothing was migrated.** No pack control became effective, no value moved into
`workflow.adjustments`, and no `[PRISM_STEP_PARAMS]` value gained authority. A
test loads a workflow whose `notes` contain a `[PRISM_STEP_PARAMS]` block with
`dla_difficulty: hard` and asserts it appears neither in the panel nor in any
assembled prompt as an authoritative parameter.

---

## 6. Instructions / `step.notes` — retained behaviour

Unchanged in every respect:

- storage: `step.notes`;
- gather: the same `[data-field="notes"]` textarea in the step editor;
- runtime: reaches the prompt exactly as before, **not** wrapped in the
  subordinate Additional Instruction block;
- Run mode: still rendered as read-only prose when meaningful;
- editor: the Edit-tab `Instructions` textarea is untouched.

Not migrated, not merged, not removed, not described as legacy — asserted by a
test that scans the rendered surface for `legacy|deprecated|obsolete`.

The Adjustments panel edits `step.notes` as a **second view** of the same field.
To avoid two competing drafts, `readAdjustmentsStepField` prefers the Edit-tab
textarea when it is rendered, and `writeAdjustmentsStepField` mirrors edits into
that textarea as well as the record. Save therefore has exactly one source of
truth, which is the existing gather path.

### Distinction presented to the user

| | Instructions | Additional instruction |
| --- | --- | --- |
| What it is | your own instructions for this step | guidance influencing PRISM's choices |
| Best for | steps you wrote yourself; detail PRISM cannot know | steering a PRISM stage's discretion |
| Storage | `step.notes` | `step.additional_instruction` |
| Runtime | included as step content | subordinate block with explicit precedence |

---

## 7. Episode Plan

### Previous exclusion analysis

S3 shipped `isDeterministicWorkflowStepForAdditionalInstruction`, which
delegated to `isDeterministicWorkflowStepForAdjustments`, whose sole exclusion
was `isWorkflowStepDesignEpisodePlanRow`. S2 then promoted that same predicate
to govern Topic projection as well. One predicate therefore answered two
unrelated questions:

- *does this step author its own content, or derive a shell from upstream?* —
  the correct question for **parameter projection**;
- *can an author legitimately steer this step?* — the question for
  **Additional Instruction**.

Conflating them made EP steering not merely hidden but inert: the accessor
`getStepAdditionalInstruction` returned `""` for EP, so a stored value could
never reach the prompt.

### Eligibility correction

The predicate was **split**, which is the narrowest correction that frees EP
without loosening anything else:

| Concern | Predicate | EP | Others |
| --- | --- | --- | --- |
| Workflow-parameter projection | `isWorkflowStepEligibleForWorkflowContextProjection` (via `isDerivedShellWorkflowStep`) | excluded (unchanged) | included |
| Additional Instruction | `isWorkflowStepEligibleForAdditionalInstruction` | **included (new)** | included |

`stepSupportsAdditionalInstruction` now delegates to the second predicate, so the
EP guard cleared without any EP-specific code. No bespoke EP mechanism exists.

### Resulting general eligibility rule

> A workflow step is eligible for Additional Instruction when it has an
> author-facing prompt/copy operation whose output materially shapes downstream
> artefacts and over which the author can legitimately exercise discretion.
>
> "Deterministic" is **not** a disqualifier. Episode Plan derives its page shell
> deterministically from upstream outcomes, yet still emits an author-facing
> prompt and its learning arc shapes the whole downstream resource.
>
> Every step in the runner emits such a prompt, so every step is currently
> eligible. `NON_STEERABLE_CANONICAL_STEP_IDS` is the extension point for a
> genuinely non-steerable operation (one with no author-facing prompt). It is
> deliberately **empty** rather than pre-populated with guesses.
>
> Projection eligibility is a separate question and keeps its own predicate: a
> derived-shell step receives no projected typed parameters.

### Prompt-steering proof

`buildStepAdditionalInstructionBlock(ep)` output is embedded **verbatim** in the
EP prompt — the test asserts `prompt.includes(sharedBlock)`, which proves the
shared S3 helper is the mechanism rather than a lookalike. The instruction does
not appear in MK, LO, DLA or the custom step.

### Authority / precedence proof

With EP instruction `"Only create Understand activities."`:

- the upstream `learning_outcomes` reference appears **before** the block;
- the block retains the shared subordinate wording — `subordinate to`,
  `authoritative upstream artefacts`, and `preserve the requirements and ignore
  the conflicting part`.

That structural contract is the whole mechanism; no AI reconciliation call was
added. A blank/whitespace EP instruction is byte-identical to no field at all,
and EP still receives no projected workflow parameters.

---

## 8. Badge / count disposition

The numeric badge counted pack-declared controls that were never
runtime-effective — a count of knobs. It is replaced by a semantic marker driven
by `countExplicitWorkflowAdjustments` (explicit parameter values + steps
carrying an Additional Instruction):

- nothing set → **no badge at all** (an all-automatic workflow reads as clean,
  not as `0`);
- anything set → **`Customised`**.

A test asserts the badge is never a bare number.

---

## 9. Step-1 stale commissioning context

### Investigation

`buildWorkflowRuntimeContextText` prepends commissioned brief prose to step 1:
`Workflow:`, `Goal:`, `Audience:`, `Constraints:`, `Inputs:`,
`Desired outputs:`, sourced from `workflowOutputSpec`. `Goal:` carries the
commissioned "What should this cover?" prose, which names the original subject.
After a Topic adjustment, step 1 therefore asserted two subjects at once — the
new authoritative Topic block and a Goal written around the old one.

The other fields are orthogonal to Topic and remain accurate.

### Repair implemented

Declarative, in the registry rather than in the prompt builder. The Topic
declaration gained:

```js
supersedesCommissionedContextFields: ["goal"]
```

`getSupersededCommissionedContextFields(wf)` consults
`resolveEffectiveRunContext` and collects the declared fields of every parameter
whose provenance is **`adjustment`**. `buildWorkflowRuntimeContextText` omits
those fields.

| Condition | `Goal:` | Audience / Constraints / Inputs / Outputs |
| --- | --- | --- |
| Topic on Auto (`commissioned`) | retained, unchanged | retained |
| Topic explicitly adjusted | **omitted** | retained |

Properties that matter:

- **No prose is parsed or rewritten.** A stale field is shown whole or omitted
  whole. No topic-string substitution, no AI.
- **No behaviour change without an explicit adjustment.** Provenance
  `commissioned` suppresses nothing, so every workflow without a Topic
  adjustment keeps the accepted post-S2 prompt exactly.
- **Registry-driven, not Topic-specific.** A test registers a parameter with no
  `supersedesCommissionedContextFields` and confirms it suppresses nothing.

---

## 10. Empty-state, persistence and no-op behaviour

**Empty state.** With no adjustments and no instructions the panel still renders
both sections, offers Topic, and shows no badge. Asserted by test.

**Persistence.** Unchanged from S1/S3. Parameters live in
`workflow.adjustments.parameters`; step steering lives in
`step.additional_instruction`; notes live in `step.notes`. The panel writes to
the record and mirrors into the Edit-tab textareas, so the existing
`gatherWorkflowDetailFormData` path remains the single save mechanism. Save,
duplicate and export behaviour is inherited unchanged.

**No-op safety.** A test assembles every step of a bare workflow, renders the
Adjustments panel, reassembles, and asserts every prompt is byte-identical. The
only authorised model-visible changes are the two sanctioned exceptions: an EP
prompt when an EP Additional Instruction is present, and step-1 Goal omission
when a Topic adjustment is present. No goldens were refreshed.

**`PRISM_STEP_PARAMS` non-use.** Editing every field in the panel leaves
`step.notes` and `workflow.notes` untouched by any param block; asserted by test.
The old `syncUnifiedWorkflowSettingsToStepNotes` write path is no longer reached
from the panel.

**No AI/API/fetch.** The sandbox `fetch` stub records every call. Rendering the
panel, editing Topic, assembling all steps and refreshing the badge add zero
calls. `resolvedFactors` are snapshot-compared before and after and are
unchanged.

---

## 11. Files changed

| File | Change |
| --- | --- |
| `app.js` | eligibility split; EP guard cleared; `getSupersededCommissionedContextFields` + `Goal` omission; `supersedesCommissionedContextFields` in declaration normalisation; Adjustments panel (`renderAdjustmentsWorkflowStepsSection`, rebuilt `renderUnifiedWorkflowSettingsUI`, step-field read/write mirrors); semantic badge; pack affordances suppressed; user-visible strings; test-API exports |
| `index.html` | Settings → Adjustments for this feature's tab, panel labels and hints |
| `tests/s80-s4-adjustments-ui-repurpose.test.js` | **new** — 28 tests |
| `tests/s80-s2-topic-workflow-parameter.test.js` | predicate rename; EP projection exclusion retained |
| `tests/s80-s3-step-additional-instruction.test.js` | **2 superseded EP-exclusion tests replaced** with EP-inclusion proofs |
| `tests/unified-workflow-settings.test.js` | badge test updated to the semantic marker |
| `tests/s75-d25-proposed-workflow-readonly-preview.test.js` | source-scan assertion for the removed `Tunable`/`Settings` badge inverted |

---

## 12. Tests

| Suite | Tests | Pass | Fail |
| --- | --- | --- | --- |
| `s80-s1-adjustments-parameter-registry` | 16 | 16 | 0 |
| `s80-s2-topic-workflow-parameter` | 20 | 20 | 0 |
| `s80-s3-step-additional-instruction` | 19 | 19 | 0 |
| `s80-s4-adjustments-ui-repurpose` | **28** | 28 | 0 |
| `unified-workflow-settings` | 38 | 38 | 0 |
| `workflow-settings-discoverability` | 6 | 6 | 0 |
| `workflow-step-parameter-controls` | 22 | 22 | 0 |
| `s75-d25-proposed-workflow-readonly-preview` | 6 | 6 | 0 |
| **Total focused** | **155** | **155** | **0** |

### Operator correction, not regression-papering

Four test changes encode superseded decisions rather than hiding breakage. Each
is recorded in-file with the reason:

1. `s80-s3` — *"deterministic Episode Plan does not expose the field"* →
   **"Episode Plan is now eligible for Additional Instruction"**.
2. `s80-s3` — *"Episode Plan does not consume an instruction even if one is
   stored"* → **"Episode Plan consumes a stored instruction through the shared
   block"**. Coverage was strengthened, not deleted: the replacement asserts the
   shared-helper identity and prompt presence.
3. `unified-workflow-settings` — badge no longer counts pack controls. The
   legacy counter is still asserted to work; it just no longer drives the badge.
4. `s75-d25` — source-scan for the removed `Tunable`/`Settings` badge inverted
   to `doesNotMatch`, with the decorator and predicate still asserted present.

---

## 13. Regression comparison

Method per D-014: compare **failing locations**, not failure counts, against a
pre-S4 baseline captured from the working tree before any S4 edit.

Targeted set — 93 suites covering GAM/DLA canonical and equivalence, MK/LO/EP,
Design Page, assessment prompt paths, LS, persistence, workflow detail/settings
and all S80 slices:

| | Pre-S4 | Post-S4 |
| --- | --- | --- |
| Failing locations | 55 | **55** |
| New failing locations | — | **0** |
| Locations that stopped failing | — | 0 |

Wider sweep — 157 further workflow/renderer/export/prompt suites (1591 tests,
251 failures, 47 failing suites). Every failing suite was checked for
sensitivity to an S4-changed identifier or string. Exactly one was sensitive:
`s75-d25-proposed-workflow-readonly-preview.test.js:198`, a source-scan for the
deliberately removed step badge. It is fixed above; after the fix that suite is
6/6. The other 46 failing suites reference no S4-changed surface and belong to
the documented D-014 renderer/page population.

### Pre-existing failures

55 failing locations in the targeted set and the renderer/page population in the
wider sweep are pre-existing and unrelated. None was fixed or papered over.

---

## 14. Risks and unresolved issues

| Risk | Assessment |
| --- | --- |
| Two editors for `step.notes` (Edit tab and Adjustments) | Mitigated by preferring the Edit-tab textarea on read and mirroring on write, so gather keeps one source of truth. Residual risk if the Edit-tab step list is ever not rendered while Adjustments is open; gather then falls back to the record, which the panel also writes. Worth a follow-up integration test in S9. |
| Retained pack machinery could be revived by accident | It is unreferenced from the panel and covered by tests that assert pack controls do not render. Deeper retirement is deferred debt. |
| `NON_STEERABLE_CANONICAL_STEP_IDS` is empty | Deliberate. Every current step has an author-facing prompt. A future non-prompt operation must be added there, and the rule is documented in the code. |
| EP steering could be used to contradict Learning Outcomes | Bounded by the shared subordinate block only. That is the sanctioned mechanism; no semantic conflict detection exists by design. Real-world efficacy is a prompt-quality question for manual validation, not a code guarantee. |
| Prompt Factory `Settings...` button on step rows | Unrelated feature sharing the word "Settings". Left as-is per scope; naming clarity is a small follow-up. |
| Goal omission loses commissioning nuance | When Topic is adjusted, purpose/emphasis prose inside `Goal:` is dropped along with the stale subject. Authorised by §12 and preferable to contradictory authority, but a future Purpose parameter would let the useful part survive. New debt item. |

---

## 15. Acceptance assessment

All 27 required test propositions in §15 of the task are covered by the 155
focused tests, with zero new failing locations against the pre-S4 baseline. The
four superseded assertions are documented as operator corrections in-file and
above. Prompt semantics are unchanged except the two authorised exceptions.

**S4: COMPLETE — recommended for operator review.**

Recommended next action: operator review of S4. Do not start S5 Duration until
S4 is accepted; D1 (hardcoded canonical DLA ~60 / 50–70 timing language) remains
the prerequisite for Duration being a truthful parameter.
