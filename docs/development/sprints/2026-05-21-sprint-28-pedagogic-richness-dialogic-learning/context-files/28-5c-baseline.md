# Sprint 28-5c baseline — typed DLA/GAM cognition contracts

**Date:** 2026-05-21  
**Slice:** 28-5c (Theme D — generation contracts)  
**Test floor:** **343** (`node --test tests/*.test.js`)

---

## What shipped

1. **Contract resolution** — `resolvePedagogicCognitionContractRequirements(activePacks, resolved, explicit, config, base)` merges pack fields + factor-only fields (`scaffold_hint_sequence`, `uncertainty_tension_prompt`). Returns `null` when no cognition intent.

2. **Prompt scaffold** — `applyPedagogicCognitionContractScaffoldToDraft` appends a short **Pedagogic cognition contract (auto-applied)** block to **Design Learning Activities** and **Generate Activity Materials** drafts only when a contract is active.

3. **Output evaluation helpers** — `evaluatePedagogicCognitionContractSatisfaction`, `listPedagogicCognitionFieldsFromDlaOutput`, `listPedagogicCognitionFieldsFromGamText` for tests and future trace wiring.

4. **Heuristic trace** — `[PRISM][Trace][Heuristics]` adds `cognitionContractRequirements`, `generatedCognitionFields`, `cognitionContractSatisfied`.

---

## Pack / factor field map

| Source | DLA fields (per activity) | GAM (Cognition cues subsections) |
|--------|----------------------------|----------------------------------|
| `peer_instruction_pack` | `reasoning_revision_prompt`, `initial_position_prompt`, `revision_trigger` | Reasoning revision, Initial position, Revision trigger |
| `misconception_repair_pack` | `misconception_claim`, `reconciliation_prompt`, `evidence_contrast` | Misconception claim, Reconciliation prompt, Evidence contrast |
| `transcript_transformation_pack` | `transformation_activity`, `source_to_application_prompt` | Transformation activity, Source to application |
| `self_study_cognition_pack` | `self_explanation_prompt`, `transfer_or_application_task` | Self-explanation, Transfer or application |
| `adaptive_scaffolding_required` | `scaffold_hint_sequence` | Scaffold hint sequence |
| `productive_uncertainty_required` | `uncertainty_tension_prompt` | Uncertainty tension |

---

## Tests

`tests/workflow-ld-cognition-contracts.test.js` — 11 cases: pack→field propagation, DLA/GAM satisfaction, prompt scaffold, lean RNA unchanged.

---

## Explicit non-goals (28-5c)

- No cognition-aware composition guards (28-5d)
- No renderer / page cognition semantics
- No adaptive learner modelling or dynamic scaffold engine at runtime
- No automatic pedagogic optimisation or giant pedagogic ontologies
- LD pack JSON templates unchanged (runtime contract injection in `app.js` only)

---

## Recommended next slice

**28-5d** — complete; see [`28-5d-baseline.md`](28-5d-baseline.md).
