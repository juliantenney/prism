# S78-T-026 — General disciplinary-precision authoring salience implementation

**Task:** S78-T-026  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-25)  
**Mode:** Prompt/contract salience only  
**Depends on:** [S78-T-025](S78-T-025-disciplinary-precision-authoring-solution-design.md) · [S78-D03](decisions.md#s78-d03--disciplinary-warrant-authoring-salience-s78-dp)  
**Sprint 78:** OPEN · **T-013:** remains OPEN · **T-019:** not started  

**Schema / verifier / deterministic validation / domain solvers / assembly-renderer claim rewrite:** **NO**

---

## 1. Implementation summary

Implemented **S78-DP** disciplinary-warrant salience exactly as T-025 Changes 1–5:

| # | Surface | Change |
| - | ------- | ------ |
| 1 | DLA production + commissioning | Claim-strength / scope bounds; simplification rule |
| 2 | GAM enrich contract | Honour S78-DP; prefer accurate weaker strength |
| 3 | GAM Copy material authoring brief | Global S78-DP claim-strength line |
| 4 | Design Page partial + Sprint 38 VA authoring | Synthesis + visual claim/model-class bounds |
| 5 | Image human prompt | Do not broaden/strengthen beyond brief claims |

No redesign beyond T-025. No verifier expansion. No Candidate 6 regeneration.

---

## 2. Canonical invariant (unchanged from T-025 / S78-D03)

> Learner-facing content, including visuals, must not present a stronger disciplinary conclusion than stated assumptions, taught model class, and supplied evidence warrant. Omit advanced theory freely; do not upgrade the strength of what remains.

---

## 3. Production changes (exact)

| File | Change |
| ---- | ------ |
| `lib/ld-dla-page-enrich-contract.js` | Production bullet `S78-DP disciplinary warrant…`; commissioning bullet `S78-DP (commissioning)…` |
| `lib/ld-gam-page-enrich-contract.js` | Required-payload bullet `honour S78-DP disciplinary warrant…` |
| `app.js` | `buildGamV2CopyMaterialAuthoringBrief` S78-DP line; Sprint 38 VA authoring S78-DP claim-bounds line |
| `lib/ld-design-page-partial-contract.js` | `S78-DP disciplinary warrant (Design Page):` block after orientation hygiene |
| `lib/utilities-visual-jobs-workspace.js` | Claim-discipline reinforcement line in `buildVisualJobHumanPrompt` |

---

## 4. Tests

**Added:** `tests/s78-disciplinary-precision-salience.test.js`

Coverage:

- DLA production / commissioning salience + simplification rule  
- Domain-generality (no Lagrangian-specific production rules)  
- GAM enrich + Copy brief  
- Design Page synthesis/visual claim bounds  
- Sprint 38 VA authoring projection  
- Image human-prompt claim/model-class reinforcement (stats association≠causation fixture)  
- Verifier module not expanded with S78-DP  

**Regression run (2026-08-25):**

```text
node --test tests/s78-disciplinary-precision-salience.test.js \
  tests/ld-dla-canonical-assembler.test.js \
  tests/s78-gam-operational-suitability-prompt.test.js \
  tests/sprint-58-phase0-design-page-partial-gates.test.js \
  tests/sprint-70-slice-7-visual-jobs-human-prompt.test.js \
  tests/sprint-70-slice-7a-human-prompt-quality.test.js
```

**Result:** 103 pass / 0 fail.

---

## 5. Deviations from T-025

**None substantive.** Sprint 38 VA authoring line in `app.js` is the live append path referenced by T-025 Change 4 (“+ Sprint 38 visual affordance authoring contract append where live”).

---

## 6. Unresolved risks (unchanged from T-025)

| Risk | Status |
| ---- | ------ |
| Salience insufficient on live generation | Needs fresh benchmark after authorisation |
| Vacuous but non-empty claim arrays | Prompt salience only; residual → QA |
| Image model ignores brief | Human-prompt backstop; residual → QA |
| E2 / first-pass reliability | Separate; T-013 remains OPEN |
| Subject 84 → ≥90 not guaranteed | Accepted |

---

## 7. Recommended next action

Operator-led fresh Lagrangian generation after T-026 (EP → DLA → GAM → verify → Design Page/graphics → package → independent QA). Assess Subject & Disciplinary Quality / FOC warrant / shadow-price scope / visual model-class.

Do **not** treat this task as T-013 or Sprint 78 closure. E2 architecture diagnostic remains queued separately. Do **not** start T-019 from this record.

---

## 8. Sprint handling

- T-026 = **implementation complete**  
- T-013 = **OPEN**  
- T-019 = **not started**  
- Sprint 78 = **OPEN**  
