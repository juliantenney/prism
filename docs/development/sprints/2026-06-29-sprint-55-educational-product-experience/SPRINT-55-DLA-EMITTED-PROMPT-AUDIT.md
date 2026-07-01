# Sprint 55 — DLA Emitted-Prompt Audit

**Status:** Formal Sprint 55 evidence artefact  
**Scope:** Copy → `buildWorkflowStepInstructions` → `resolveStepPromptText` → `applyWorkflowStepRuntimePromptAugmentations`  
**Workflow profile:** Self-directed RNA/HCV learner-page brief; `step_design_learning_activities`  
**Date:** 2026-07-01  

---

## Trace

```
Workflow Copy action
  → buildWorkflowStepInstructions(step, index, domElement)
    → resolveStepPromptText(step, wf)
      → finalizePromptBody
        → applyWorkflowStepRuntimePromptAugmentations(raw, step, wf, {})
```

No post-assembly mutation of DLA prompt text for Copy (diagnostics only).

---

## Measured sizes

| Metric | Value |
|--------|------:|
| Base domain-pack seeded prompt | 13,201 chars |
| Augmented core prompt | 49,949 chars |
| Augmentation delta | +36,748 chars (+278%) |
| Copy wrapper overhead | ~1,149 chars |

---

## Sprint 55 scaffold requirements — presence in emitted prompt

| Requirement | Present in emitted prompt? |
|-------------|---------------------------|
| `activity_preamble` 50–120 words | **Yes** (multiple blocks + PRE-EMIT) |
| `reasoning_orientation` 35–80 words | **Yes** |
| `self_explanation_prompt` 35–80 words | **Yes** (also 25–80 in OUTPUT CONTRACT) |
| `conceptual_contrast_prompt` 35–80 words | **Yes** |
| `argument_structure_hint` 35–80 words | **Yes** |
| `transfer_or_application_task` 35–80 words | **Partial** (PRE-EMIT 35–80; OUTPUT CONTRACT 30–70) |
| `expected_output` 30–70 words | **Yes** |
| DLA PRE-EMIT SCAFFOLD GATE | **Yes** |
| Self-check: count words before final JSON | **Yes** |
| FORBIDDEN terse scaffold patterns | **Yes** |

**Conclusion:** Required Sprint 55 ranges and self-check instructions are present in the emitted DLA prompt. Terse generated outputs persist despite this.

---

## Conflicting instructions identified

| Source | Fragment | Risk |
|--------|----------|------|
| OUTPUT CONTRACT | `self_explanation_prompt` **25–80** words | Lower floor than PRE-EMIT 35–80 |
| OUTPUT CONTRACT | `transfer_or_application_task` **30–70** words | Conflicts with PRE-EMIT 35–80 |
| LD-GUIDED-LEARNING-SCAFFOLD | `learner_task may stay concise` | Brevity norm generalised to row JSON |
| Base IFP-05 | `AS-05 expected_output = observable evidence not topic coverage` | Label-like outputs |
| Base task framing | Obligation population step emphasis | Scaffold prose deprioritised |
| LD-COGNITION-ORIENTATION | Strong `self_explanation` exemplar ~17 words | Contradicts 35–80 target |
| OUTPUT CONTRACT | `uncertainty_tension_prompt` one sentence | Adjacent brevity pattern |
| EQF | reduce scaffolding across journey | Conflicts with minimum scaffold prose |
| Base | `Return only the JSON` | Compression bias |

---

## Instruction competition summary

1. **Primacy:** Opening frames DLA as obligation population (`required_materials` gates dominate).
2. **Presence-only gates** (IFP-05, LD-COGNITION PRE-EMIT) satisfied by terse non-empty strings.
3. **Conflicting numeric ranges** appear before authoritative PRE-EMIT gate.
4. **~19k chars** of duplicated Sprint 55 guidance dilute salience of final PRE-EMIT block (~char 45k of 50k).

---

## Traceability

| Sprint 56 work package | This audit finding |
|------------------------|-------------------|
| DLA-WP-01 Consolidated contract | Multiple blocks repeat same ranges |
| DLA-WP-02 Word-range alignment | 25–80 vs 35–80; 30–70 vs 35–80 |
| DLA-WP-03 Pre-emit gate unification | Presence-only gates precede quality gate |
| DLA-WP-04 Exemplar rationalisation | Short Strong exemplar in cognition contract |
| GOV-01 Prompt size monitoring | 13k → 50k growth |
