# Self-directed activity framing — adoption investigation (Sprint 28 stabilisation)

**Date:** 2026-05-21  
**Symptom:** Kitchen-sink and renderer tests prove cognition/framing fields render when present, but ordinary Marx-style self-directed learner-page workflows still omit `activity_preamble`, `self_explanation_prompt`, `transfer_or_application_task`, and `scaffold_hint_sequence` in generated JSON.

---

## Investigation summary

| # | Question | Finding |
|---|----------|---------|
| 1 | Is the framing output contract in the live DLA prompt? | **Yes, when gates fire** — `applySelfDirectedLearnerPageStepScaffoldsToDraft` runs at the end of `buildWorkflowStepPrompt` (line ~5096). |
| 2 | Overridden by pack schemas/examples? | **Yes — primary emission failure.** Domain DLA `promptTemplate` Output listed a **closed** activity schema (`activity_id` … `facilitator_moves`) with no preamble/cognition keys. Models treat Output as authoritative over append-only notes. |
| 3 | Emitted by DLA but dropped before Design Page? | **Sometimes.** No code strip in GAM. Design Page composition often omits fields not named in its predictable-keys list. |
| 4 | Does Design Page preserve when present? | **Weak without scaffold** — pack `defaultPromptNotes` listed `purpose` / `learner_instructions` but not framing fields. Runtime preservation block + merge pass address this. |
| 5 | Field name mismatch? | **No** — DLA, page JSON, and renderer share the same keys. |
| 6 | Cognition packs inactive? | **Yes on ordinary Marx briefs** — `Pedagogic cognition contract` does not append; framing must apply **independently** via self-directed learner-page scaffolds and merge, not pack contract. |
| 7 | Examples too procedural? | **Yes** — closed Output bullets + facilitator_moves emphasis steer models toward `learner_task` / `required_materials` only. |

**Adoption failure location:** primarily **DLA generation** (schema conflict), secondarily **Design Page composition** (field omission). Renderer and page assembly merge are not the bottleneck once fields exist upstream.

### Second pass (live Marx runs still procedural)

**Symptom:** Latest Marx `learning_activities` JSON still has `facilitator_moves`, `failure_mode`, and `learner_task` only — no `activity_preamble` or cognition cues.

**Real root cause:** Runtime workflow execution uses `resolveStepPromptText(step)` → `buildWorkflowStepInstructions`, which returned **library/local override prompt bodies verbatim**. Self-directed OUTPUT CONTRACT blocks were only appended in **Prompt Factory prefill** (`applyWorkflowStepPromptDefaults`), not on the prompt actually sent to the model during **Run**. Saved library prompts therefore never received the adoption fix.

**Why the first fix was insufficient:** It strengthened domain templates and Prompt Factory draft assembly but did not wire the same augmentations into the **run-time prompt resolution path**. Local override early-return in prefill also skipped scaffolds entirely.

---

## Changes (stabilisation, not new features)

1. **Domain pack alignment** — DLA Output bullets and `defaultPromptNotes` now name `activity_preamble` and optional cognition fields; Design Page predictable-keys list updated likewise.
2. **Stronger runtime DLA contract** — `OUTPUT CONTRACT` block + **concrete JSON example**; pointer injected immediately under `Output:` so it precedes model attention on the closed schema list.
3. **Gate robustness** — self-directed detection also matches goal/inputs text when `delivery_context` is not yet resolved on the workflow record.
4. **Design Page preservation** — explicit copy-verbatim scaffold (unchanged intent, clarified `learner_task` / `learner_instructions`).
5. **Downstream merge** — `mergeSelfDirectedActivityFramingFieldsIntoPageActivities` inside `applyPedagogicCognitionSemanticsToComposedPage` runs even when cognition packs are inactive.

6. **Runtime prompt augmentations (2026-05-21)** — `applyWorkflowStepRuntimePromptAugmentations` applied in `resolveStepPromptText` (library + local override) and `buildWorkflowStepInstructions`; local override prefill also augmented before save. OUTPUT CONTRACT + example + `facilitator_moves`/`failure_mode` omit guidance for self-directed learner pages.

---

## Why this is stabilisation

- Uses **existing** Sprint 28 field names and renderer blocks only.
- No new workflow steps, cognition packs, or renderer-invented prose.
- Fixes **prompt authority** and **preservation** so the pipeline emits what the renderer already supports.

---

## Remaining limits

- LLM compliance is improved, not guaranteed; occasional omission may still require regeneration.
- Long-term: domain pack templates and few-shot examples should stay aligned with runtime contracts (bounded pack edits started here).
- GAM does not author preambles; DLA must emit them first.

---

## Tests

- `tests/workflow-self-directed-activity-framing-adoption.test.js`
- `tests/utility-self-directed-activity-framing.test.js`
