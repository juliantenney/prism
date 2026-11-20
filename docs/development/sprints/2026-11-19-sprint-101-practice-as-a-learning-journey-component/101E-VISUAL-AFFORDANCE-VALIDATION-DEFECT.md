# Sprint 101E — Practice Design Page visual-affordance validation defect

**Status:** Superseded / extended by [101E-VISUAL-PLANNING-CONTRACT-INTEGRATION.md](101E-VISUAL-PLANNING-CONTRACT-INTEGRATION.md)  
**Date:** 2026-11-19  
**Scope:** Practice Design Page prompt assembly vs Sprint 38 visual-affordance validator (prompt layer)  
**Out of scope:** Lagrange exemplar; Interactive KS / partial-DP furniture; inventing new visual slots; weakening validation

---

## Defect (observed)

First live 101E generation of Practice C2 (*Formulate and solve multiplier equations*) produced a Design Page paste that failed existing Sprint 38 validation on `visual_affordances[0..4]`:

| Failure class | Manifestation |
| ------------- | ------------- |
| Envelope | Missing `affordance_id` |
| `generate` | Missing required generation fields (`allowed_claims`, `disallowed_claims`, `anti_spoiler`, `canonical_discipline_note`, `discipline_risk_level`, `preferred_representation`, `purpose`, `reasoning_supported`, `representation_avoid`, `requires_exact_data_match`, `source_basis`, `tier`, …) |
| `defer` / `reject`/`skip` | Inappropriate generate-only fields; missing/invalid `defer_reason` / `skip_reason` |
| Slots | Unsupported `visual_slot` `materials-after-feedback` |

Validation was correct and fail-closed. The model was under-instructed.

---

## Root cause

Practice uses `promptRoute: "practice"` and returns early from `applyWorkflowStepRuntimePromptAugmentations` so it does **not** enter Interactive’s scaffold / mandatory knowledge-summary / `LD-DESIGN-PAGE-PARTIAL-CONTRACT` stack.

That early return also skipped the **shared, product-independent** Sprint 38 authoring injection:

- `stripContradictoryDesignPageVisualAffordanceOmitClauses`
- `applySprint38VisualAffordanceContractToDraft` → `buildSprint38VisualAffordanceDesignPagePromptBlock`

Practice presentation contracts (`lib/ld-practice-presentation-contracts.js`) only mentioned that `visual_affordances` were optional, without decision-specific field shapes or the controlled slot vocabulary. The model therefore invented incomplete rows and an unknown slot.

This was an integration gap on the Practice prompt route — not a conflict that required a Practice-specific VA schema, and not a reason to weaken the validator.

---

## Correction (smallest justified fix)

1. **`app.js` — Practice branch of `applyWorkflowStepRuntimePromptAugmentations`**  
   On Design Page only, after Practice presentation contracts and EQF, apply the same shared Sprint 38 strip + VA contract used by Interactive. Still return before Interactive scaffold / partial DP / mandatory KS.

2. **`lib/ld-practice-presentation-contracts.js`**  
   Point Design Page guidance at the shared Sprint 38 contract; list allowed slots; explicitly forbid inventing slots such as `materials-after-feedback`; keep purposeful imagery optional and empty `visual_affordances: []` valid.

3. **Regression:** `tests/s101e-practice-dp-visual-affordances.test.js`  
   Asserts Practice DP receives exactly one Sprint 38 VA authoring block with decision-specific fields and recognised slots; Practice non-DP steps do not; Interactive still receives VA + partial contract; Practice does not receive mandatory KS / partial DP; validator still rejects invented slots / missing ids.

Architectural invariants preserved:

- Practice `promptRoute: "practice"` unchanged  
- No Interactive mandatory knowledge summary / heavyweight presentation restored  
- Shared VA contract reused (no Practice schema duplication)  
- No new slots; validation unchanged  

---

## Results

| Suite | Result |
| ----- | ------ |
| `tests/s101e-practice-dp-visual-affordances.test.js` | **pass** (5/5) |
| `tests/s101-practice-product-identity-and-intake.test.js` | **pass** |
| `tests/s101-practice-render-and-package.test.js` | **pass** |
| `tests/sprint-38-visual-affordances.test.js` | **pass** |
| `tests/workflow-design-page-live-prompt-unification.test.js` | **pass** |

Harness note: `PRISM_LD_PRACTICE_PRESENTATION_CONTRACTS` added to the VM sandbox→window global copy list so Node tests resolve Practice contracts the same way the browser does via `index.html`.

Live C2 Design Page paste should be re-attempted only after confirming Practice DP Copy instructions include `Sprint 38 visual affordance authoring contract (auto-applied):`.

---

## Remaining issues / watch-outs

- Prompt sufficiency does not guarantee model compliance; invalid rows will still be dropped at compose under strict validation. Prefer empty `[]` over invented slots.
- Interactive still uniquely receives `LD-DESIGN-PAGE-PARTIAL-CONTRACT` (including mandatory knowledge summary). Practice intentionally does not — page-scope KS visuals remain optional when a Practice page actually emits KS content.
- The shared Sprint 38 prompt still says new slot names may be introduced “when genuinely required”; Practice contracts now explicitly forbid inventing slots outside the controlled list. If live models still invent slots, consider tightening that shared wording in a later sprint (out of 101E minimal scope).
- No commit/push for this correction until authorised.
