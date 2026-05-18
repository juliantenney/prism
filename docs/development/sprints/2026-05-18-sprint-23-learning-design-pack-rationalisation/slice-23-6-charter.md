# Sprint 23 Slice 23-6 — Pack metadata rationalisation

**Date:** 2026-05-18  
**Status:** **Closed**  
**Sprint:** 23 — Learning Design pack rationalisation  
**Slice:** 23-6

**Baselines:** Slices 23-1–23-5 (`ld-semantics-matrix.md`, `ld-elicitation-alignment-plan.md`, `ld-pf-bespoke-control-audit.md`, `ld-parameter-ownership-model.md`, `ld-design-assessment-semantics.md`)

**Primary file:** `domains/learning-design/domain-learning-design-step-patterns.md`

---

## Objective

Apply agreed Sprint 23 metadata changes to the Learning Design pack only: expand Design Assessment and Generate Assessment Items `stepParameterControls`, align PF ids and prompt placeholders, reduce refinement re-asking, and document assessment inheritance policy — without Settings redesign or Research pack changes.

---

## Outcomes

| Outcome | Status |
|---------|--------|
| DA `stepParameterControls` expanded to **7** keys | **Done** |
| Gen Items `stepParameterControls` expanded to **10** keys (`settings-only` elicitation) | **Done** |
| DA PF: `difficulty_level` → `difficulty_profile`, `coverage_breadth` → `coverage_scope` | **Done** |
| `assessmentPolicy` block in `workflowBriefConfig` | **Done** |
| Refinement: `assessment_type`, `assessment_total_items` `mustAsk: false` | **Done** |
| Construct Sequence PF: `duration_minutes` userOption id | **Done** |
| DLA PF: `activity_pattern_mix` userOption + template constraint | **Done** |
| `extraFields` delivery_context duplication removed (workflow control retained) | **Done** |
| Runtime: canonical DA key fallback + brief-aligned mapper passthrough | **Done** (minimal contract fix) |
| Tests: pack controls, PF dedupe, Settings aggregation, inheritance | **Done** |

---

## Constraints honoured

- No Research pack edits  
- No Settings UI redesign  
- Assessment inheritance helpers preserved (`resolveAssessmentItemsInheritedOptions` retained)  
- No `mappingRules` auto-promotion into controls  
- `assessment_required` remains topology-only (not a Settings control)

---

## Verification

```bash
node --test tests/*.test.js
```

**Result:** **195 passed**, 0 failed.

---

## Follow-up (out of scope)

- Runtime inheritance retirement charter (gates in `ld-design-assessment-semantics.md` §10.2)  
- Optional Sprint 23 closeout document
