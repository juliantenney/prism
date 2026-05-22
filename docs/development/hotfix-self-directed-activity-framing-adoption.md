# Self-directed activity framing — weak adoption investigation

**Date:** 2026-05-21  
**Symptom:** Marx self-study pages improved structurally but activities still lack `activity_preamble`, cognition cues, and smooth orientation despite renderer + DLA scaffold existing.

---

## Root cause (where adoption fails)

| Layer | Finding |
|-------|---------|
| **1. DLA prompt reaches scaffold?** | **Yes** — `applySelfDirectedLearnerPageStepScaffoldsToDraft` runs after pack template assembly for Design Learning Activities. |
| **2. Scaffold too weak?** | **Yes — primary cause.** Append-only guidance at the **end** of a long prompt loses to the pack **Output** section, which lists a **closed activity schema** (`activity_id`, `learner_task`, `facilitator_moves`, …) with **no** `activity_preamble` or cognition fields. Models treat Output as authoritative. |
| **3. Downstream stripping?** | **No code strip** in GAM. **Design Page** predictable-keys guidance omits framing fields → LLM composition often drops them even when DLA emitted them. |
| **4. Schema/examples bias?** | **Yes** — domain `promptTemplate` Output bullets overpower optional appendices. `defaultPromptNotes` mention self-directed tasks but not preamble/cognition JSON keys. |
| **5. Few-shot / canonical shapes?** | **Implicit** — closed Output list acts as a few-shot schema. |
| **6. GAM** | **Preserves** activity objects; does not remove unknown fields if present in `learning_activities` input. |
| **7. Design Page** | **Weak preservation** — composition prompt lists `purpose`, `learner_instructions` but not `activity_preamble` / cognition fields. |
| **8. Field name mismatch?** | **No** — names align (`activity_preamble`, `self_explanation_prompt`, etc.). Issue is **non-emission**, not aliasing. |
| **9. Sprint 28 cognition pack** | **Inactive** on ordinary Marx briefs → `Pedagogic cognition contract` block never appends; cognition fields not required by pack contract. |

**Adoption failure occurs primarily at DLA generation** (schema override), secondarily at **Design Page composition** (field omission).

---

## Bounded fix applied

1. **`OUTPUT CONTRACT (self-directed learner page — overrides…)`** appended to DLA prompts — explicitly requires `activity_preamble` and selective cognition fields with minimum coverage.
2. **Stronger activity framing block** — minimum preamble on all activities; cognition cues on ≥50% of activities.
3. **`applySelfDirectedLearnerPageStepScaffoldsToDraft`** — consolidates material-shape + framing + output override (DLA) + Design Page field preservation.
4. **Design Page gate fix** — field-preservation scaffold was incorrectly gated only on the DLA step (`shouldApplySelfDirectedLearnerPageMaterialShapeScaffold`); Design Page now uses `shouldApplySelfDirectedLearnerPageDesignPagePreservationScaffold` with the same self-directed + learner-page signals.
4. **`mergeSelfDirectedActivityFramingFieldsIntoPageActivities`** — copies framing/cognition fields from upstream `learning_activities` onto composed page rows when Design Page drops them (no invented prose).
5. **Framing merge runs even when cognition packs are inactive** — ordinary self-directed workflows benefit without `cognitive_engagement_required`.

---

## Why this fix is sufficient

- Targets the **authoritative Output schema** conflict (main generator failure).
- Adds **downstream safety net** without redesigning architecture or renderer invention.
- Keeps cognition surfacing **lightweight** (selective fields, concise strings) per product constraints.

---

## Remaining limits / risks

- **LLM compliance** — override reduces but does not eliminate model drift; regeneration may still occasionally omit fields.
- **Pack template edits** — runtime append overrides domain JSON; long-term alignment may still need domain-pack Output bullet updates (out of scope here).
- **GAM** — does not add preamble; still depends on DLA emitting fields first.
- **Heuristic validation** — `evaluateSelfDirectedDlaActivityFramingCoverage` is for tests/monitoring, not runtime blocking of step output.

---

## Tests

- `tests/workflow-self-directed-activity-framing-adoption.test.js`
- `tests/utility-self-directed-activity-framing.test.js` (updated for full DLA pipeline)
