# S80-S2 — Topic vertical proof

**Status:** **COMPLETE**
**Date:** 2026-08-27
**Authoritative basis:** [S80-T-006](S80-T-006-operator-product-architecture-decision-gate.md) (DECIDED),
[S80-T-007](S80-T-007-adjustments-target-architecture-and-implementation-plan.md) (ACCEPTED),
[S80-S1](S80-S1-adjustments-parameter-registry-and-persistence.md) and
[S80-S3](S80-S3-per-step-additional-instruction.md) (both ACCEPTED).

---

## 1. What this slice proves

The Adjustments architecture now works end to end for one parameter. On a single
saved workflow:

1. the effective Topic is `Henry VIII` (commissioned), and every model-driven
   step's assembled prompt says so;
2. `workflow.adjustments.parameters.topic` is set to `Elizabeth I` — the only
   change made;
3. the same workflow assembles again and every one of those prompts now says
   `Elizabeth I`.

No workflow regeneration, no elicitation, no model/API/`fetch` call, no
`resolvedFactors` mutation, no `[PRISM_STEP_PARAMS]` write, and no
`override_prompt_body` rewrite. Proven through live assembly, not helper units.

More importantly, it proves the **extension path** is real:

```
registry declaration
  -> resolveEffectiveRunContext(wf)
    -> shared workflowContext projector
      -> authoritative prompt ingress (I1 / I2)
        -> model-visible text
```

Adding a second `workflowContext` parameter required **no prompt edits at all** —
this is asserted by a test that declares a sample `Audience` parameter and finds
it in the assembled MK prompt without touching any builder.

---

## 2. Topic registry declaration

Declared in `ADJUSTMENTS_PARAMETER_DECLARATION_SOURCE` (`app.js`), which is now
the single allowlisted declaration source; `ADJUSTMENTS_PARAMETER_REGISTRY` is
built from it and **validated at load**, so a malformed row cannot ship.

| Field | Value |
| ----- | ----- |
| `id` | `topic` |
| `label` | `Topic` |
| `type` | `text` (no enum — Topic cannot be constrained to a value list) |
| `owner` | `workflow_run_context` |
| `projection` | `workflowContext` |
| `applicability` | `{ always: true }` — gates no capability and no topology |
| `resolveCommissioned` | `resolveCommissionedWorkflowTopic` |

Registry contents are asserted exactly (`["topic"]`), so the allowlist cannot
grow by accident.

---

## 3. Commissioned fallback source

`resolveCommissionedWorkflowTopic(wf)` reads
`wf.workflowBriefResolution.resolvedFactors.topic`, falling back to the
historical alias `workshop_subject`. This is the existing authoritative
commissioned Topic; **no second store was created**. The read is strictly
read-only.

Where a workflow has neither an adjustment nor a commissioned topic, Topic
resolves to nothing and no block is emitted — prompts are unchanged.

### Provenance

| Situation | Effective value | `provenance.topic` |
| --------- | --------------- | ------------------ |
| No adjustment, commissioned topic present | commissioned topic | `commissioned` |
| Explicit adjustment | the adjustment | `adjustment` |
| Blank / unusable adjustment | commissioned topic | `commissioned` |
| Neither | *(absent)* | `absent` |

Absence means Auto throughout. No `"AUTO"` sentinel is stored.

---

## 4. Shared workflow-context projector

Three functions, all registry-driven and Topic-agnostic:

- `buildEffectiveWorkflowContextLines(wf)` — consumes
  `resolveEffectiveRunContext(wf)` and emits one `Label: value` line per
  declaration whose `projection` is `workflowContext` and which resolved to a
  value.
- `buildEffectiveWorkflowContextBlock(wf)` — wraps those lines in the
  authoritative heading plus one supersession sentence. Returns `""` when there
  is nothing to project.
- `appendEffectiveWorkflowContextBlockToPrompt(promptText, wf)` — used by I2.

The block is deliberately compact (asserted at ≤ 5 lines) and must not restate
the workflow brief (asserted: no `Goal:` / `Constraints:` / `Desired outputs:`).

The rendered form is:

```
Authoritative workflow parameters for this run:
Topic: Elizabeth I

These values are authoritative for this run. If any other text in this prompt —
including copied prompt bodies, workflow context or an author instruction — names
a different value for one of them, the value above wins and the conflicting text
is superseded.
```

---

## 5. Prompt ingress

### I1 — `buildWorkflowStepInstructions`

Injected immediately after the `This step is titled: …` line, ahead of the
step's own content and well ahead of the subordinate Additional Instruction
block. Gated on `isModelDrivenWorkflowStepForAdjustments(step)`.

One subtlety was handled explicitly: the existing "not enough information to be
useful" guard tests `lines.length <= 3`. Projected context lines are discounted
from that comparison (`workflowContextBlockLineCount`), so S2 cannot turn a
previously-empty prompt into text.

### I2 — `buildLiveGamV2CopyPromptViaCanonicalAssembler`

GAM v2 early-returns around ordinary assembly, so the projection is **appended
after** the canonical assembler's output. Nothing is inserted into canonical
text, canonical assembler ownership is untouched, and `NEUTRAL_POLICY_INGRESS`
is unmodified. Ordering is parameters-then-instruction, preserving S2 above S3.

Nothing revives `selectedOptions`, `{{option:…}}`, `[PRISM_STEP_PARAMS]` or any
dead augmentation route; asserted directly against the GAM prompt.

---

## 6. Model-driven step coverage

The model-driven/deterministic distinction is now a single shared predicate,
`isDeterministicWorkflowStepForAdjustments` /
`isModelDrivenWorkflowStepForAdjustments`, used by both S2 and S3. The S3-era
names delegate to it, so the two mechanisms cannot drift apart.

| Step | Canonical id | Ingress | Receives Topic |
| ---- | ------------ | ------- | -------------- |
| Model Knowledge | `step_model_knowledge` | I1 | **Yes** |
| Define Learning Outcomes | `step_define_learning_outcomes` | I1 | **Yes** |
| Design Learning Activities (DLA) | `step_design_learning_activities` | I1 | **Yes** |
| Generate Activity Materials (GAM) | `step_generate_activity_materials` | I2 | **Yes** |
| Construct Learning Sequence | `step_construct_learning_sequence` | I1 | **Yes** |
| Design Page | `step_design_page` | I1 | **Yes** |
| Design Assessment | `step_design_assessment` | I1 | **Yes** |
| Generate Assessment Items | `step_generate_assessment_items` | I1 | **Yes** |
| **Design Episode Plan** | `step_design_episode_plan` | — | **No** |

### Episode Plan exclusion

Episode Plan derives its page shell deterministically from upstream learning
outcomes and invokes no model, so it receives no projection. This is enforced,
not merely hidden: a workflow with an explicit `Elizabeth I` adjustment produces
an EP prompt containing neither the block heading nor the value.

---

## 7. Precedence

Effective precedence is structural, and asserted:

```
hard schema / canonical requirements
authoritative upstream artefacts
explicit typed workflow parameters      <- S2
per-step Additional Instruction         <- S3
stage defaults / discretionary choices
```

The parameter block always precedes the instruction block, and the S3 block
already names "explicit workflow parameters" among the things it is subordinate
to. The adversarial case is covered: with `topic = Elizabeth I` and an MK
instruction of *"Treat Henry VIII as the topic"*, the assembled prompt keeps
Elizabeth I authoritative, the instruction subordinate, and the resolver
unmoved. No AI-based semantic conflict detection was introduced — the structural
contract carries it.

---

## 8. UI

A minimal transitional "Workflow parameters" section renders at the top of the
existing workflow-level Settings panel
(`renderAdjustmentsWorkflowParametersSection`). This is **not** the S4 repurpose:
no panel rename, no change to how legacy controls are presented.

It renders independently of pack `briefConfig`, because Adjustments must be
editable on workflows that have no pack metadata — the legacy panel bails out in
that case, so the section is rendered before that branching and re-rendered in
both async recovery paths.

Auto is represented honestly by absence:

- an unset adjustment renders an **empty** input, with the commissioned value as
  the **placeholder** (`Auto — Henry VIII`), never a prefill;
- a status line states which value is in force and where it came from;
- clearing the field deletes the stored entry rather than storing a sentinel.

Editing calls `setWorkflowAdjustmentParameterValue` and reveals the existing save
hint, matching the established Settings interaction (edit in place, persist with
the workflow header **Save**).

---

## 9. Persistence

Reuses the S1 mechanism unchanged — `workflow.adjustments = { version: 1,
parameters: { topic } }`.

| Path | Result |
| ---- | ------ |
| Save (`gatherWorkflowDetailFormData`) | Explicit topic carried through |
| Load (`normalizeWorkflowForV1`) | Preserved, version intact |
| Duplicate / export | Preserved (structural copy round trip asserted) |
| Old workflows with no `adjustments` | Load unchanged, use commissioned topic |

---

## 10. Intended prompt deltas

Per the T-006/S2 operator decision, Topic moved from *first-step-only* context to
*every model-driven step*. Byte identity was therefore **not** required for
prompts newly receiving Topic. The delta is tightly bounded and asserted:

- **8 prompts gain** the compact block (the table in §6).
- **1 prompt (Episode Plan) gains nothing.**
- The **only** model-visible change is that block. Two tests assert this by
  substituting the topic value back and requiring exact equality with the
  baseline prompt — done for DLA specifically and for all eight steps in the
  vertical proof.
- Canonical DLA duration language is unchanged (D1 remains untouched and out of
  scope).
- No goldens were refreshed.

The pre-existing first-step-only `buildWorkflowRuntimeContextText` block was left
untouched; it is outside I1/I2 and editing it was out of scope. See the risk in
§13.

---

## 11. Defect fixed in passing

`validateAdjustmentsParameterValue` coerced any value with `String(rawValue)`, so
an object stored as a text parameter became the literal `"[object Object]"`. That
was harmless while S1 projected nothing, but S2 makes text parameters
model-visible, so non-scalar values are now rejected outright. Found by a test,
not by inspection.

---

## 12. Tests

New: `tests/s80-s2-topic-workflow-parameter.test.js` — **20 tests**, all
behavioural assertions running through live assembly.

| # | Coverage |
| - | -------- |
| 1 | Topic registry declaration + exact shipped allowlist |
| 2 | Commissioned fallback (incl. `workshop_subject` alias, and no-topic case) |
| 3 | Explicit adjustment precedence |
| 4 | Provenance `commissioned` vs `adjustment` |
| 5 | Blank/invalid value falls back rather than blanking |
| 6 | No mutation of workflow or `resolvedFactors` |
| 7 | Projector is registry-driven (second parameter needs no prompt edits) |
| 8 | Block is compact and asserts its own authority |
| 9 | No value → no block → no prompt change |
| 10 | Topic reaches all 8 model-driven steps |
| 11 | GAM canonical-safe projection (appended, not inserted) |
| 12 | Episode Plan exclusion |
| 13 | DLA canonical-safe: only the topic value differs |
| 14 | **Henry VIII → Elizabeth I vertical proof** (topology, ids, baked bodies, `resolvedFactors`, `fetch`, `PRISM_STEP_PARAMS` all asserted) |
| 15 | Topic + Additional Instruction composition, no leakage |
| 16 | An instruction cannot displace an explicit topic |
| 17 | Normalize / duplicate / export persistence |
| 18 | Gather carries the value through Save |
| 19 | Set writes; clear restores Auto; undeclared id rejected |
| 20 | UI: Auto placeholder, status line, edit writes the adjustment |

### Updated

Two S1 tests were legitimately updated, because S2 changes the facts they
recorded:

- *"shipped registry is empty"* → *"shipped registry is a deliberate allowlist"*,
  asserting exactly `["topic"]`.
- *"registry declaration alone changes no assembled prompt text"* now makes its
  inertness claim against a `stepScoped` declaration. `workflowContext` is
  implemented as of S2, so asserting its inertness would have been false;
  `stepScoped` remains unimplemented and is the honest subject.

### Totals

| Suite | Tests | Result |
| ----- | ----- | ------ |
| S80-S1 | 16 | pass |
| S80-S2 | 20 | pass |
| S80-S3 | 19 | pass |
| **Total** | **55** | **55 pass / 0 fail** |

---

## 13. Regression comparison

Compared against a pristine `git worktree` at the pre-implementation commit
(`9cf0f1d`), running identical commands.

| Run | Baseline (HEAD) | After S1+S3+S2 |
| --- | --------------- | -------------- |
| Full suite | 3785 tests / 412 fail | 3840 tests / **393 fail** |
| Targeted set (84/87 files, serial) | 72 failing locations | **55 failing locations** |

**New failing locations in either comparison: zero.** 19 full-suite and 17
targeted failures present at baseline no longer fail — including the whole
S79 GAM canonical/equivalence/retirement group and DLA Phase D retirement, which
now pass cleanly in isolation.

The large absolute failure count is the pre-existing **D-014** baseline
instability (order dependence and cross-contamination when the suite runs in one
process); it is present identically at HEAD and is not attributable to this
slice. Spot-checked example: `page-learning-sequence-enrich.test.js:265` fails
identically at baseline and after, and is a renderer test with no prompt
involvement.

No unrelated pre-existing failure was fixed or papered over.

---

## 14. Risks / unresolved

1. **Stale `Goal:` prose on step 1 (new, low-moderate).**
   `buildWorkflowRuntimeContextText` still prepends the commissioned brief
   (including `Goal:`) to the first step in Run mode. If Topic is adjusted, that
   prose may still name the original topic, so step 1 can contain both. The
   supersession sentence in the new block is written to cover exactly this
   ("including copied prompt bodies, workflow context …"), and the new block
   appears later in the text, so the authoritative value wins structurally.
   Still, the honest fix is to make that block topic-aware or narrow it. Deferred
   to S4 as it touches the legacy context path, not the Adjustments architecture.
   Recorded as architectural debt.

2. **Baked `override_prompt_body` prose (pre-existing, unchanged).**
   Where Create baked the original topic into a prompt body, that text remains.
   S2 does not rewrite baked bodies by design; the new block supersedes them
   structurally rather than editing them.

3. **`stepScoped` projection is still unimplemented.** A declaration using it
   would persist and resolve but project nothing. Guarded by an explicit S1
   test so it cannot ship silently as if live.

4. **D1 (hardcoded DLA ~60 / 50–70 timing) untouched**, per instruction. It
   still blocks Duration, not Topic.

5. **D-014 baseline instability persists** and makes whole-suite counts a weak
   signal. Comparison against a pristine worktree was necessary and should be
   the standard method until D-014 is addressed.

---

## 15. Acceptance assessment

**S2: COMPLETE.** The product proposition is demonstrated on a live assembly
path; the general extension mechanism is demonstrated separately by a second
parameter requiring no prompt edits; all constraints (no AI/API, no
`resolvedFactors` write, no `[PRISM_STEP_PARAMS]`, no topology change, no baked
rewrite, canonical DLA/GAM untouched) are asserted rather than asserted-by-hand;
and the regression comparison shows zero new failures.

## 16. Recommended next action

Operator review of S2. No further slice should begin without explicit
authorisation. When authorising the next slice, S4 (Adjustments UI repurpose) is
the natural follow-on, and it should absorb risk §14.1.
