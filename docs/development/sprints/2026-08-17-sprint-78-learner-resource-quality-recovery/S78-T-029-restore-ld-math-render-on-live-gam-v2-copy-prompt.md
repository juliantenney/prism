# S78-T-029 — Restore LD-MATH-RENDER on live GAM V2 Copy prompt

**Task:** S78-T-029  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-25)  
**Mode:** Prompt-assembly fix only  
**Depends on:** [S78-T-028](S78-T-028-ld-math-render-prose-inside-math-salience-implementation.md) · live GAM V2 Copy investigation (post-T-028)  
**Sprint 78:** OPEN · **T-013:** remains OPEN · **T-019:** not started

**T-028 wording / validator / schemas / GAM brief duplication:** **UNCHANGED**

---

## 1. Exact assembly change

In `buildWorkflowStepInstructions` (`app.js`), on the existing GAM post-assembly inject block:

- After `applyLdInstructionalArchetypeRoutingToDraft(...)`,
- when `gamV2CopyStep` is true (`isGamPageEnrichmentV2CopyStep`),
- call:

```js
assembledInstructions = applyMathSafeOutputContractToDraft(
  assembledInstructions,
  gamRecognition
);
```

This restores the shared LD-MATH-RENDER SSOT (including T-028 salience) onto the operator-facing Run Copy prompt. Marker/dedupe behaviour is unchanged.

**Not done:** duplicating LD-MATH-RENDER into `buildGamV2CopyMaterialAuthoringBrief`.

---

## 2. Tests added/changed

`tests/page-gam-enrich.test.js` — new test:

`S78-T-029: live GAM V2 Copy prompt includes shared LD-MATH-RENDER (Run Copy path)`

- Uses `buildWorkflowStepInstructions` with partial-page + page-enrichment-v2 workflow (same path as Run Copy).
- Asserts `LD-MATH-RENDER (auto-applied)`, T-028 label-outside sentence, and `\text{...}` instruction.
- Asserts single injection (dedupe).
- Asserts the authoring brief itself does **not** contain LD-MATH-RENDER (no duplication).

---

## 3. Test results

Command:

`node --test "tests/page-gam-enrich.test.js" "tests/ld-math-render-integrity.test.js" "tests/mathjax-producer-prompt-contract.test.js"`

Result: **66 passed / 0 failed**.

---

## 4. Live GAM V2 Copy confirmation

`buildWorkflowStepInstructions` for GAM V2 Copy now includes `LD-MATH-RENDER (auto-applied)` and the T-028 salience lines. Confirmed by the new page-gam-enrich regression (not by Prompt Studio augmentation alone).

---

## 5. Other runtime augmentations still bypassed on V2 Copy

V2 Copy still skips the full `applyWorkflowStepRuntimePromptAugmentations` chain. Still **not** re-injected at the post-assembly point (unless already inlined elsewhere):

- LD-TABLE-FIDELITY (via augmentation)
- LD-MATERIALS-COPY
- Self-directed learner-page scaffolds
- Pedagogic cognition / EQF / instructional-pattern scaffolds
- Design Page / thin-assembly / Sprint 38 VA contracts (not GAM-owned)

Already present on this path by other means: GAM enrich contract, Copy brief (incl. S78-DP), authoritative DLA commission / WS2 / ops blocks, archetype routing, instructional-depth text inside enrich contract.

T-029 restores **math only**; does not reopen a full augmentation-chain redesign.

---

## 6. Files changed

- `app.js` — V2 Copy post-assembly `applyMathSafeOutputContractToDraft`
- `tests/page-gam-enrich.test.js` — live Run Copy LD-MATH-RENDER assertion
- This record + minimal Sprint 78 navigation updates

---

## 7. Sprint 78 state

| Item | Status |
| ---- | ------ |
| Sprint 78 | **OPEN** |
| T-013 | **OPEN** |
| T-028 | Complete (shared contract) |
| T-029 | **Implementation complete** (live V2 Copy injection) |
| T-019 | Queued — not started |
| Next | Operator fresh Lagrangian regen/benchmark with LD-MATH-RENDER present on Copy |
