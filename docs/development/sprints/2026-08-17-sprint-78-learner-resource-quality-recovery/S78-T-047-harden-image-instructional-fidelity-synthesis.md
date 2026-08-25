# S78-T-047 — Harden image instructional fidelity for synthesis visuals

**Task:** S78-T-047  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-25)  
**Mode:** Implementation (prompt assembly + Design Page commissioning salience)  
**Sprint 78:** OPEN · **T-013:** remains OPEN  

**Upstream:** [S78-T-045](S78-T-045-image-instructional-fidelity-diagnostic.md)  
**Separated:** [S78-T-046](S78-T-046-resource-level-image-consistency-diagnostic.md) house-style — **not** implemented here  

---

## 1. Root-cause confirmation

Hydrology synthesis peer labels (“Atmospheric inputs”, “Upstream inflows”, “Outflows to other basins”) arose from:

1. Underspecified DP `must_show` / context (“inputs and outputs around the system”) — **B**  
2. Synthesis human prompt lacked Concept boundary; open “integrate across the lesson” — **C**  
3. Live human prompt omitted resolved evidence — **C**  
4. Image model completed textbook open-system categories — **D**

Residence→storage-direction bounding already worked → explicit claim/concept bounding is viable.

---

## 2. Synthesis Concept / claim boundary change

`buildVisualJobHumanPrompt` now emits **`Concept / claim boundary:`** for `knowledge_synthesis` / page-scoped jobs:

- Visualise only entities/processes/categories/relationships authorised by Show / `must_show` + `allowed_claims`  
- Obey `must_not_show` / `disallowed_claims`  
- No textbook extras (fluxes, boundary crossings, unauthorised causal links)  
- No claim-strength upgrades  
- Evidence is grounding, not permission to extend  
- May connect **multiple authorised** relationships; must not invent new ones  

Educational mode no longer says “integrate relationships across the lesson”; it requires integration of **AUTHORISED** relationships only.

---

## 3. Activity-boundary change

Activity **`Concept boundary:`** strengthened (same file):

- Explicitly includes processes / categories / relationships tied to Show / `must_show` + `allowed_claims`  
- Obey exclusions / disallowed claims  
- “Scientifically or disciplinarily plausible extras … must still be omitted” (addresses Condensation-class soft-boundary miss without redesigning activity visual planning)

---

## 4. Evidence-grounding change

Live human prompt adds **`Authorised source evidence:`** from `brief.source_evidence` (already resolved by planner/compiler — **no second resolver**).

- Prefer `page_synthesis.knowledge_summary` first  
- Compact clips (560 chars/source, 1600 total) — longer than canonical’s ~240 so qualifiers survive better  
- Human-readable labels (“Knowledge summary”, “Learner task”) — no raw `[A1.…]` / schema IDs in operator copy  

---

## 5. Design Page commissioning change

- `lib/ld-design-page-partial-contract.js`: **S78-VA synthesis commissioning** block (specific `must_show` / `allowed_claims`; forbid vague I/O phrasing; use `must_not_show` / `disallowed_claims` for plausible extensions; prefer KS evidence anchors). Contract version → `78-DP-PARTIAL-T047`.  
- `app.js` Sprint 38 VA authoring block: matching **S78-VA synthesis** salience line (domain-general).  

No Hydrology-specific production strings.

---

## 6. Schema

**Unchanged.** Existing `must_show` / `must_not_show` / `allowed_claims` / `disallowed_claims` / `evidence_anchors` / resolved `source_evidence` suffice.

---

## 7. GAM ownership

**Unchanged.** Design Page remains visual-affordance owner. GAM is not the commission owner.

---

## 8. Before / after human-prompt structure (synthesis)

**Before (abbrev.):**  
Modality → goal → synthesis mode (“integrate across the lesson”) → preferred output → representation → subject/context → visual structure → Show → … → claims → …

**After (abbrev.):**  
Modality → goal → synthesis mode (**AUTHORISED** integration) → preferred output → representation → subject/context → **Concept / claim boundary** → **Authorised source evidence** → visual structure → Show → … → claims → …

Activity prompts gain strengthened Concept boundary + evidence section when sources resolve; retain activity scaffolding / pre_classification behaviour.

---

## 9–12. Regressions

| Area | Coverage |
| ---- | -------- |
| Live operator-copy path | `tests/s78-t-047-image-instructional-fidelity-hardening.test.js` + updated Slice 7B |
| Evidence grounding | T-047 KS evidence tests; Roman roads fixture |
| Activity image | Strengthened Concept boundary assertions |
| Domain-general | Roman roads (not Hydrology); DP/VA blocks forbid Hydrology terms |

---

## 13. Tests / checks

```text
node --test tests/s78-t-047-image-instructional-fidelity-hardening.test.js \
  tests/sprint-70-slice-7b-activity-vs-synthesis-prompt.test.js \
  tests/sprint-70-slice-7a-human-prompt-quality.test.js \
  tests/sprint-70-slice-7-visual-jobs-human-prompt.test.js \
  tests/s78-disciplinary-precision-salience.test.js \
  tests/sprint-70-slice-5-image-brief-compiler.test.js \
  tests/sprint-70-slice-6-utilities-visual-jobs-workspace.test.js \
  tests/workflow-design-page-live-prompt-unification.test.js \
  tests/visual-affordance-rationale-regression.test.js
```

**Result:** all listed suites **pass**.

---

## 14. Files changed

| File | Change |
| ---- | ------ |
| `lib/utilities-visual-jobs-workspace.js` | Synthesis + activity boundaries; authorised evidence; mode wording; diagnostics |
| `lib/ld-design-page-partial-contract.js` | S78-VA synthesis commissioning; version bump |
| `app.js` | S78-VA synthesis line in Sprint 38 VA authoring block |
| `tests/s78-t-047-image-instructional-fidelity-hardening.test.js` | **New** |
| `tests/sprint-70-slice-7b-activity-vs-synthesis-prompt.test.js` | Updated for synthesis boundary |
| `tests/s78-disciplinary-precision-salience.test.js` | Assert S78-VA in VA block |
| Sprint nav | STATUS, HANDOVER, PLAN, START-HERE, next-chat-briefing |

**Not changed:** T-046 house style; schema; GAM ownership; Hydrology learner prose; pixel/vision validation.

---

## 15. Regeneration required

| Change | Operator action |
| ------ | --------------- |
| Prompt-assembler hardening (this task) | **Re-copy human prompts** from Graphics workspace → **regenerate / reassociate images** for affected affordances (especially page synthesis) |
| Design Page commissioning hardening | **Newly generated Design Page** outputs get stronger synthesis commissions; existing deposited DP JSON is not auto-rewritten |
| EP → DLA → GAM | **Not required** solely for this boundary hardening |

Do not expect deposited Hydrology figures to self-heal without image regeneration.

---

## 16. Deviations / unresolved risks

- Soft model non-compliance can still occur; bounding is stronger, not fail-closed at pixels.  
- Underspecified **existing** DP rows still need regenerate-or-edit to enumerate taught I/O; assembler cannot invent missing `must_show` specificity.  
- Evidence clips remain bounded; extremely long KS bodies may still truncate — budget preferred over whole-page dump.  
- T-046 visual-family consistency remains a **separate** follow-on.  
- Condensation-class activity extras: wording hardened; no Hydrology activity image re-test in this task.

---

## 17. Sprint state

**Sprint 78:** OPEN  
**T-013:** OPEN  
**T-045:** diagnostic complete  
**T-046:** diagnostic complete (house style **not** implemented)  
**T-047:** implementation complete  
**Learner-workspace/interactivity:** PARKED  
