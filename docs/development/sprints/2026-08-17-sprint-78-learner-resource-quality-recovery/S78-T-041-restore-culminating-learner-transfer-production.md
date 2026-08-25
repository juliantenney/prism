# S78-T-041 — Restore culminating learner transfer production

**Task:** S78-T-041  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-25)  
**Implements:** [S78-T-038](S78-T-038-learner-composition-presentation-regression-diagnostic.md) Defect 1 (P3)  
**Sprint 78:** OPEN · **T-013:** remains OPEN  

---

## 1. Canonical transfer path confirmed

| Stage | Role |
| ----- | ---- |
| Episode Plan | May require `transfer` beat / Evaluate close |
| **DLA** | **Owns commissioning** — `required_materials` type `transfer_prompt` (+ optional `transfer_or_application_task`) |
| **GAM** | **Owns fulfilment** — authors `transfer_prompt` body as learner-production task |
| Design Page | **Transport-only** for `page_synthesis.study_tips` from `### Page learner-resource closure` (S78-D04 / T-032) — does **not** author transfer |
| Assembly | Preserves activity materials / DLA-owned transfer fields |
| **vNext** | Renders `transfer_prompt` as transfer moment + text_entry workspace (`partFromTransferText` → `Transfer your learning`) |

Canonical learner-facing field: activity **`transfer_prompt`** material (existing type). Optional DLA scalar **`transfer_or_application_task`** is preserved (GAM must not overwrite).

Journey order (existing): activity moments including **transfer** → terminal **Study tips**.

---

## 2. Root cause of current omission

T-032 restored **page-level consolidation** in Study tips. That is intentional and correct.

Distinct **activity-level transfer production** was under-commissioned:

- G2 / Evaluate completion pack already mention `transfer_prompt`, but culminating self-study activities could still omit a substantive transfer production when Study tips closure was present.
- Operators therefore saw the journey end at Study tips with no learner-facing transfer workspace.

Not a renderer retirement. Not Design Page authorship failure. **Commissioning / fulfilment salience gap.**

---

## 3. Exact authoring/commissioning change

| Surface | Change |
| ------- | ------ |
| DLA production (`ld-dla-page-enrich-contract.js`) | `S78-T-041 culminating transfer production` — culminating activity commissions compact `transfer_prompt` production on a meaningfully changed context; distinct from study_tips/closure; honour S78-DP; omit only when no transfer intent |
| DLA commissioning | `S78-T-041 (commissioning)` — exactly one `transfer_prompt` row on culminating activity when appropriate |
| DLA workbook overlay G2 | Culminating activity also commissions compact `transfer_prompt` when pedagogically appropriate; **closure ≠ transfer** |

Domain-general invariant (no Lagrangian-specific wording):

> A culminating activity should provide a short transfer/application production task that requires the learner to use the page's core learning in a meaningfully changed context, where appropriate to the learning design.

---

## 4. Exact GAM live-path delivery

| Surface | Change |
| ------- | ------ |
| GAM enrich contract | `S78-T-041 transfer_prompt fulfilment` — production on changed context; learner response required; no solution leak; no new teaching; distinct from page closure |
| GAM enrich S78-D04 block | Clarifies closure is consolidation only; do not replace commissioned `transfer_prompt` production with closure |
| `buildGamV2CopyMaterialAuthoringBrief` (`app.js`) | Live V2 Copy line for `S78-T-041 transfer_prompt` |
| `buildWorkflowStepInstructions` (GAM step) | Receives brief content (verified in tests) |

---

## 5. Transport / assembly / rendering changes

**None.** Existing vNext transfer rendering and Study tips path unchanged. No schema fields added. No Design Page authorship.

---

## 6. Design Page remains transport-only

No Design Page contract change for transfer. Tests assert DP does **not** carry `S78-T-041` and continues S78-D04 study_tips transport-only language.

---

## 7. Study tips / T-032 remains distinct and unchanged

S78-D04 `### Page learner-resource closure` → `page_synthesis.study_tips` path preserved. Closure is consolidation; `transfer_prompt` is learner production. Regression tests lock both.

---

## 8. Tests added/changed

| File | Change |
| ---- | ------ |
| `tests/s78-t-041-culminating-transfer-production.test.js` | **Added** — DLA production/commissioning/overlay; GAM enrich; live GAM V2 Copy + live DLA assembler; Design Page transport-only; GAM capture preserves `transfer_prompt`; live vNext export transfer ≠ study tips; activities without transfer remain valid; T-032 closure unchanged |

---

## 9. Test results

```text
tests/s78-t-041-culminating-transfer-production.test.js  10/10 pass
tests/s78-gam-learner-closure-packaging.test.js          pass (regression)
tests/s78-disciplinary-precision-salience.test.js        pass (regression)
```

---

## 10. Expected learner-facing behaviour after regeneration

After fresh DLA → GAM → Design Page → export:

1. Culminating activity includes a `transfer_prompt` material with a compact production task on a changed context.
2. vNext shows a **Transfer your learning** moment with a learner response surface.
3. Study tips still appear as terminal consolidation (from page closure).
4. Transfer is recognisably distinct from Study tips / recap / worked example.
5. No Lagrangian-specific hard-coded scenario — content is generated under general contracts.

**Operator must regenerate** to prove improved generated content. This task proves contract delivery and render/transport capability only.

---

## 11. Deviations from T-038

None substantive. Preferred owner (DLA + GAM fulfilment of existing `transfer_prompt`) implemented. No new schema. Study tips not used as transfer.

---

## 12. Files changed

| Path | Role |
| ---- | ---- |
| `lib/ld-dla-page-enrich-contract.js` | Production + commissioning + G2 salience |
| `lib/ld-gam-page-enrich-contract.js` | Fulfilment + closure/transfer distinction |
| `app.js` | Live GAM V2 Copy brief line |
| `tests/s78-t-041-culminating-transfer-production.test.js` | Regression coverage |
| Sprint navigation docs | Minimal T-041 record + status |

---

## 13. Unresolved risks

| Risk | Notes |
| ---- | ----- |
| Prompt pressure only | Fresh generation may still omit transfer; salience is not a hard capture validator |
| Pedagogical “where appropriate” escape | Intentional — non-transfer designs remain valid |
| Remaining T-038 Defect 4 | Workspace/template fidelity not addressed |
| T-013 / first-pass reliability | Unrelated; remains OPEN |

---

## 14. Sprint 78 / T-013 state

**Sprint 78:** OPEN  
**T-013:** OPEN — not closed by this commissioning fix  
**T-042:** not opened from this task
