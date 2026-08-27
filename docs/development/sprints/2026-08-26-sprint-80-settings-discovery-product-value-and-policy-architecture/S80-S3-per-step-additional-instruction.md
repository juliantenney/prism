# S80-S3 — Generic per-step Additional Instruction

**Slice:** S3 (of the S80-T-007 plan)
**Status:** **COMPLETE**
**Type:** Implementation (live behaviour — author steering reaches the model)
**Authorised by:** S80-T-006 (DECIDED) + S80-T-007 (ACCEPTED)
**Date:** 2026-08-27
**Tests:** `tests/s80-s3-step-additional-instruction.test.js` — 19 tests, all passing

---

## 1. What S3 delivers

Every model-driven workflow step can now carry an optional natural-language author
instruction that is visible to the model when that step runs, through **one**
generic mechanism with **two** ingress points. There are no stage-specific
implementations for MK, LO, DLA, GAM, LS, DP, DA or GAI.

This is the first Sprint 80 slice with live model-visible behaviour. It is
nevertheless additive: with no instruction set, prompts are byte-identical.

---

## 2. Storage

New per-step field: **`step.additional_instruction`**.

- Distinct from `step.notes`, `[PRISM_STEP_PARAMS]` and every legacy Settings field.
- Never appended into notes; a test asserts notes remain unpolluted.
- Trimmed on normalization. Absent or blank means **no steering**, and the key is
  removed so steps without an instruction keep their existing serialized shape.
- A legacy camelCase `additionalInstruction` is read once on load and normalized
  away, so a hand-edited or imported record is tolerated without a migration.

Wiring: `normalizeWorkflowForV1` (load/import/duplicate) and
`gatherWorkflowDetailFormData` (DOM capture → Save). When the editor is not
rendered — Run mode, or a deterministic step that never exposes the field — gather
falls back to the stored value rather than clearing it.

---

## 3. Shared prompt-block helper

`buildStepAdditionalInstructionBlock(step)` is the single renderer; the precedence
wording exists in exactly one place. It returns `""` when there is no instruction,
which is what makes the no-op guarantee structural rather than incidental.

Rendered block:

```
Author additional instruction for this step.

Apply this instruction only where this step has legitimate discretion.

It is subordinate to:
- output contracts and schemas;
- validators;
- explicit workflow parameters;
- authoritative upstream artefacts;
- fixed workflow capabilities and required stage responsibilities.

If the instruction conflicts with those requirements, preserve the requirements and ignore the conflicting part.

<author instruction>
```

`appendStepAdditionalInstructionBlockToPrompt(promptText, step)` appends it, and is
the only thing the two ingress points call. The author text is passed through
verbatim — it is never summarised, rewritten, or interpreted by a separate model
call.

---

## 4. Ingress points

Exactly the two identified in T-007 §1.1 / §14, no others.

| ID | Function | Covers | Placement |
| -- | -------- | ------ | --------- |
| **I1** | `buildWorkflowStepInstructions` | all steps reaching ordinary assembly (MK, LO, DLA, DP, LS, DA, GAI, non-v2 GAM) | after canonical requirements, output contracts, completion overrides and the footer contract; immediately before the pipeline completion directive |
| **I2** | `buildLiveGamV2CopyPromptViaCanonicalAssembler` | GAM v2, which early-returns around I1 | after the canonical assembler's output and after archetype/math-safe post-processing; before the pipeline completion directive |

Placing the block last is what makes subordination structural: every hard
requirement is already stated above it.

---

## 5. Model-driven step detection

No duplicated catalogue was created. The rule inverts the problem:

> **Every workflow step is model-driven except the deterministic ones.**

`isDeterministicWorkflowStepForAdditionalInstruction(step)` uses the existing
`isWorkflowStepDesignEpisodePlanRow` predicate; `stepSupportsAdditionalInstruction`
is its negation. Design Episode Plan is currently the only deterministic LD step,
so it is the only exclusion. If a future deterministic step is added it must be
added to that one function — recorded as debt in §9.

Coverage, as required:

| Step | Field | Ingress |
| ---- | ----- | ------- |
| Model Knowledge | yes | I1 |
| Learning Outcomes | yes | I1 |
| **Design Episode Plan** | **no — excluded** | none |
| Design Learning Activities (DLA) | yes | I1 |
| Generate Activity Materials (GAM v2) | yes | **I2** |
| Design Page | yes | I1 |
| Generate Assessment Items | yes | I1 |
| PEL | n/a — not a workflow step | none |

Episode Plan is excluded **unconditionally**, at three levels: it renders no field,
`getStepAdditionalInstruction` returns `""` even if a value is present in the JSON,
and the block helper therefore emits nothing. A stored EP instruction is inert
rather than merely hidden.

---

## 6. Scope / no leakage

Proven by test across every step pair: an instruction set on Model Knowledge
appears in the MK prompt and in **no** other step's prompt, including the GAM
canonical prompt. Steps without an instruction carry no block at all.

The instruction is also never written into `step.notes`, upstream artefacts, or
`workflowBriefResolution.resolvedFactors` — asserted after live assembly.

Downstream artefacts may of course differ because the steered step produced
different output; that is ordinary workflow propagation, not leakage.

---

## 7. Canonical DLA / GAM safety

- No canonical normative text was modified.
- DLA receives the block through the ordinary assembly shell, appended after the
  canonical hard requirements — not injected inside them.
- GAM keeps canonical assembler ownership. `NEUTRAL_POLICY_INGRESS` is untouched,
  `settingsEffective` is not flipped, and no new normative section was added inside
  the assembler. The block is appended to the assembler's finished output.
- No retired DLA/GAM Settings ingress was re-enabled.

The block is author steering, explicitly subordinate — not canonical policy.

---

## 8. No-op / byte-equivalence

With `step.additional_instruction` absent or empty, prompts are **byte-identical**
for MK, LO, EP, DLA, DP, GAI (via I1) and GAM v2 (via I2). Tested by string
equality against the unmodified baseline, not by pattern matching.

No prompt golden or baseline fixture was refreshed. The two regressions the full
suite did surface were structural source-scan assertions in
`workflow-prism-step-marker.test.js` and `workflow-run-step-complete-status.test.js`,
which locate the gathered-step object literal by the anchor `steps.push({`. Rather
than edit those guards, the production code was rewritten to preserve the anchor
and strip blank instruction keys in a subsequent pass. Both tests pass unmodified.

---

## 9. Visible UI change introduced by S3

Deliberately minimal; the full Settings → Adjustments repurpose remains S4.

Per workflow step in the step editor, **below** the existing "Instructions"
textarea, S3 adds one new group:

- label: *"Additional instruction (optional)"*
- a 3-row textarea bound to `step.additional_instruction`
  (`data-field="additionalInstruction"`)
- placeholder: *"Optional steering for this step, applied where the step has discretion."*
- helper line: *"Subordinate to output contracts, validators, workflow parameters and upstream artefacts."*

The group is **not rendered at all** for Design Episode Plan, and is hidden in Run
mode (the textarea stays in the DOM, read-only, so Save cannot clear it).

The existing "Instructions" textarea was **not** repurposed: it still reads and
writes `step.notes`. Keeping them separate avoids conflating designer notes with
author steering and avoids disturbing the live `step.notes` prompt route. No
renaming or cosmetic work reserved for S4 was performed.

---

## 10. Acceptance against the S3 brief

| Requirement | Status |
| ----------- | ------ |
| Dedicated `step.additional_instruction` field | met |
| Separate from notes / step params / legacy Settings | met |
| Not appended into notes | met (proven) |
| Persists through gather/save/duplicate/export | met |
| Absent/empty means no steering | met |
| ONE shared block helper | met |
| Precedence explicit, wording as specified | met |
| Used at both I1 and I2 | met |
| Only the two T-007 ingress points | met |
| No stage-specific injection paths | met |
| No canonical GAM restructuring | met |
| Step-scoped, no leakage | met (proven) |
| MK / DLA / GAM / DP / assessment supported | met |
| Episode Plan excluded | met (proven, unconditional) |
| No new AI call | met (proven — zero fetch calls) |
| Byte-identical when unset | met (proven) |
| Minimal UI only | met |

---

## 11. Architectural debt recorded (not fixed)

| Item | Note |
| ---- | ---- |
| Deterministic-step exclusion is a single hand-maintained predicate | Correct today (EP is the only deterministic LD step), but a future deterministic step will silently gain a meaningless field unless added to `isDeterministicWorkflowStepForAdditionalInstruction`. |
| No stage-specific guidance copy | T-007 §11 proposed per-stage help text. S3 ships one generic helper line; per-stage guidance belongs to S4. |
| Two adjacent instruction-like fields | The step editor now shows both "Instructions" (`step.notes`, legacy, still live) and "Additional instruction" (`step.additional_instruction`). S4 should resolve this presentational overlap. |
| Steps with no prompt body still expose the field | `buildWorkflowStepInstructions` early-returns `""` when there is no prompt and no notes, so an instruction on such a step is silently unused. Harmless, but the UI does not signal it. |
| Pre-existing suite instability | ~394 baseline failures and demonstrable test-order dependence in the renderer suites. Unrelated to S1/S3 — see the S1/S3 report. |
