# S80-S8 — Assessment Adjustments v1 (Quantity + Difficulty)

**Status:** COMPLETE — ACCEPTED (operator 2026-08-28)  
**Date:** 2026-08-28  
**Authority:** operator-authorised bounded implementation slice after accepted
[S80-T-011](S80-T-011-design-assessment-topology-and-cai-relationship-diagnostic.md) and
[S80-T-012](S80-T-012-cai-assessment-adjustment-contract-diagnostic.md)  
**Predecessors:** S80-S1…S7 (Adjustments registry / projection / Goal / Duration / Audience)

---

## 1. Executive conclusion

Assessment Adjustments v1 ships **Option B only**:

| Parameter | id | Type |
| --------- | -- | ---- |
| Number of items | `assessment_item_count` | number 1–200 |
| Difficulty | `assessment_difficulty_profile` | enum `foundational` / `balanced` / `higher_order` |

Both are **CAI-capability-gated** (`generate_assessment_items`), projected through the
existing `workflowContext` architecture with pack-facing imperative sentences, and
persisted only under `workflow.adjustments.parameters.*`.

**Question Type is not implemented.** Design Assessment remains out of scope.
`selectedOptions` / `{{option:}}` / `PRISM_STEP_PARAMS` are not revived.

**D28** is **partially resolved / superseded for governed v1 Quantity + Difficulty**
via Adjustments projection. Other historical CAI `userOptions` remain inert at Run.

---

## 2. Accepted T-011 / T-012 decisions implemented

| Decision | Implementation |
| -------- | -------------- |
| CAI-first; DA not required | Capability resolver scans CAI/GAI steps only |
| Option B only | Two registry declarations; no `assessment_response_format` |
| Quantity range 1–200, default 10 | Registry min/max + commissioned legacy 10 |
| Difficulty pack vocabulary | Existing mapper; Foundational-heavy / Balanced / Higher-order-heavy labels |
| Pack semantic Quantity sentence | `promptInstructionTemplate: "Generate exactly {{value}} assessment items."` |
| Pack semantic Difficulty sentence | `promptInstructionTemplate: "Use a {{label}} difficulty profile."` |
| No validator count enforcement | Unchanged GAI capture validator |
| No selectedOptions revival | Projection via shared workflowContext only |

---

## 3. Exact registry declarations

```
id:            assessment_item_count
label:         Number of items
type:          number
min / max:     1 / 200
owner:         workflow_run_context
projection:    workflowContext
applicability: { requiresCapability: "generate_assessment_items" }
promptInstructionTemplate: "Generate exactly {{value}} assessment items."
resolveCommissioned: resolveCommissionedAssessmentItemCount

id:            assessment_difficulty_profile
label:         Difficulty
type:          enum
options:       foundational → Foundational-heavy
               balanced → Balanced
               higher_order → Higher-order-heavy
owner:         workflow_run_context
projection:    workflowContext
applicability: { requiresCapability: "generate_assessment_items" }
promptInstructionTemplate: "Use a {{label}} difficulty profile."
resolveCommissioned: resolveCommissionedAssessmentDifficultyProfile
```

Blank Adjustments field = Auto. Commissioned value is placeholder / select blank
label only — never prefilled.

---

## 4. Capability resolver

```
ADJUSTMENTS_CAPABILITY_RESOLVERS.generate_assessment_items(wf)
  → true iff some step matches isWorkflowStepGenerateAssessmentItemsRow(step)
```

Prefer `canonical_step_id === "step_generate_assessment_items"`; existing title
fallback retained. Fail closed when capability absent. No Goal scan. No
`assessment_required` read. DA alone does not expose controls.

---

## 5. Commissioned resolver rules

### Quantity

1. `workflowBriefResolution.resolvedFactors.assessment_total_items` (clamped to 1–200 for Adjustments)
2. Frozen `mappedBindings.stepParamPatch.step_generate_assessment_items.number_of_items`
3. Legacy CAI default **10**

Does not read Goal prose, Studio options, or `prompt_bindings.selectedOptions`.

### Difficulty

1. `resolvedFactors.difficulty_profile` → `mapDesignAssessmentDifficultyToItemsDifficultyProfile`
2. Frozen CAI `stepParamPatch.difficulty_profile` (same mapper)
3. Legacy CAI default **balanced**

Does not expose or reinterpret per-item `difficulty_level`.

---

## 6. Projection architecture

Shared `buildEffectiveWorkflowContextLines` now honours optional
`promptInstructionTemplate` (`{{value}}` / `{{label}}`).

When set, the pack-facing sentence replaces `Label: value` so Quantity /
Difficulty sit in the **authoritative typed-parameters** region above Goal and
Additional Instruction — one authority per parameter, no CAI pack-template edit,
no selectedOptions revival.

Enum UI: declarative `<select>` with Auto blank option (first enum in Adjustments).

---

## 7. Precedence

Unchanged structural rule:

> hard schemas > typed workflow parameters > Goal > Additional Instruction > stage discretion

Adversarial tests prove typed Quantity=10 and Difficulty=`higher_order` precede
contradictory Goal / Additional Instruction prose; subordinate strings may survive
verbatim.

---

## 8. Vertical proofs

| Run | Result |
| --- | ------ |
| A Auto | CAI prompt contains `Generate exactly 10…` and `Use a Foundational-heavy…` (commissioned) |
| B adjust 5 + higher_order | Prompt switches; topology / resolvedFactors unchanged; zero fetch |
| C clear | Governed projection matches Run A |
| Capability | Self-study CAI / workshop CAI / DA+CAI → visible; non-CAI / DA-only → absent |

---

## 9. Persistence

Existing S1 path: `workflow.adjustments.parameters.{assessment_item_count,assessment_difficulty_profile}`.
Proven via normalize / JSON round-trip (save / load / duplicate / export shape).
Clearing deletes the key.

---

## 10. Files changed

| File | Change |
| ---- | ------ |
| `app.js` | Capability resolver; commissioned resolvers; registry rows; `promptInstructionTemplate` normalisation + projection; enum select UI; test API exports |
| `tests/s80-s8-assessment-adjustments.test.js` | **New** — 27 tests |
| `tests/s80-s1-…`, `s80-s2-…`, `s80-s7-…` | Allowlist / CAI-default projection expectations updated |
| Sprint pointers + this record | Discoverability |

---

## 11. Tests

| Suite | Result |
| ----- | ------ |
| `tests/s80-s8-assessment-adjustments.test.js` | **27/27** |
| Focused S80 S1–S8 set | **229/229** |
| Full suite | 4014 tests; **393** failing locations |

---

## 12. Regression

| Metric | Value |
| ------ | ----- |
| Baseline failing locations (post-S7) | **393** |
| Post-S8 failing locations | **393** |
| **New failing locations** | **ZERO** |
| S8-specific full-suite failures | none |

---

## 13. D28 disposition

**Partially resolved / superseded for governed v1 parameters.**

- Quantity and Difficulty now reach the live Run prompt via Adjustments
  `workflowContext` projection (pack-facing templates).
- This does **not** repair `selectedOptions = []` or restore other CAI
  `userOptions` (composition_mode, stimulus_mode, response_formats, …).
- Those historical options remain Create/Studio-oriented and inert at Run until
  separately authorised.

Debt ledger: D28 retained with this precise wording; D29–D31 untouched.

---

## 14. Retained debt

| ID | Status |
| -- | ------ |
| D28 | Partially superseded for Quantity/Difficulty; other CAI userOptions still inert |
| D29 | Open (Create difficulty elicitation wording) |
| D30 | Open (multi-answer MCQ renderer) — blocks future Question Type expansion |
| D31 | Open (`normalizeAssessmentItemCount` unclamped); Adjustments commissioned path clamps 1–200 separately |
| D25–D27 | Open; out of scope |
| Question Type | Deferred (T-012 C′) |
| Settings catalogue cleanup | Still S9+ |

---

## 15. Risks

- Count remains prompt-authoritative; model may still emit ≠ N (accepted T-012).
- CAI workflows without commissioned factors always Auto-project **10** + **balanced**; intentional legacy default.
- Assessment lines now appear on *every* projection-eligible step of a CAI workflow (same as Topic), not only the CAI step — consistent with shared projector; upstream assessment-cue sanitiser still applies to Goal prose.

---

## 16. Acceptance assessment

| Criterion | Met? |
| --------- | ---- |
| Option B only; no Question Type | Yes |
| Capability-gated CAI presence | Yes |
| Commissioned sources + legacy defaults | Yes |
| Pack-facing Quantity / Difficulty projection | Yes |
| No selectedOptions / PRISM_STEP_PARAMS / DA / topology / AI | Yes |
| Precedence + Auto/adjust/clear + persistence tests | Yes |
| Zero new failing locations | Yes |
| STOP after Quantity + Difficulty | Yes |

---

## 17. Exact recommended next action

Operator review of this slice. Optional follow-on (separate authorisation):
narrowed Question Type (**C′**), or Settings cleanup / D28 remainder for other
CAI options — not started here.
