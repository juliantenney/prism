# S78-T-042 — Learner workspace authoring fidelity

**Task:** S78-T-042  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-25)  
**Implements:** [S78-T-038](S78-T-038-learner-composition-presentation-regression-diagnostic.md) Defect 4 (P4)  
**Sprint 78:** OPEN · **T-013:** remains OPEN  

---

## 1. Existing workspace/template capability confirmed

| Capability | Behaviour |
| ---------- | --------- |
| `material_type: "template"` + `**Label:**` sections | `parseTemplateSections` → `text_entry` workspaces per section (`partsFromTemplateMaterial`) |
| `**Label**` without trailing `:` | No sections → static Markdown bold paragraphs |
| Table-family + blank cells | `table_entry` workspaces (T-001 / T-007) |
| Ordinary inline bold in prose | Not treated as workspace fields |
| Mathematical derivation UI | **Parked** — even correct templates yield textareas, not symbolic maths editors |

Canonical parse regex (unchanged): `/(?:^|\n)\s*\*\*([^*]+):\*\*[ \t]*/g`

---

## 2. Root cause confirmed

Structured learner workspaces (especially A3 “Solution workspace”) were authored as **bold prose scaffolds** (and/or wrong material type), not as `template` / blank table that vNext can bind. `parseTemplateSections` therefore returned `[]` and the material fell back to static Markdown — a stack of stranded bold labels with no response affordance.

This is an **authoring / material-shape fidelity** problem at the DLA → GAM boundary, not a renderer retirement and not a Design Page issue.

---

## 3. Exact DLA commissioning change

In `lib/ld-dla-page-enrich-contract.js` commissioning section:

**`S78-T-042 (commissioning) structured learner workspace fidelity`**

- Structured response/derivation workspaces → commission `template` (or table-family when learners complete rows/columns)
- Specification MUST require parseable structured body — not standalone bold prose labels
- For template: require successive `**Label:**` sections
- Keep genuine tables as tables
- Do not commission `text` / `worked_example` / `sample_output` as sole multi-field workspace carrier
- Editable maths remains parked; still commission template/table for pedagogical order

---

## 4. Exact GAM authoring/material-shape change

In `lib/ld-gam-page-enrich-contract.js`:

**`S78-T-042 structured workspace fidelity`**

- Template bodies use exact `**Label:**` form (one section per ordered response location)
- Forbid standalone bold lines without trailing colon as surrogate response fields
- Ordinary inline emphasis remains valid
- Genuine tables stay table-family with blank learner cells
- Derivation sequences use the same template/`**Label:**` (or blank table); do not invent an equation editor

---

## 5. Live GAM V2 Copy delivery confirmation

`app.js` `buildGamV2CopyMaterialAuthoringBrief` includes:

> `S78-T-042 structured workspace fidelity: for template / structured response or derivation workspaces, author **Label:** sections…`

Verified via:

- `buildGamV2CopyMaterialAuthoringBrief()`
- `buildWorkflowStepInstructions` on GAM V2 workflow step
- `assembleLiveDlaCanonicalPrompt` for DLA commissioning line

---

## 6. Parser change

**None.** Prefer authoring salience so GPT emits the existing canonical `**Label:**` syntax. Broadening the parser to guess structure from generic bold prose would create false positives on ordinary emphasis.

---

## 7. vNext behaviour / renderer changes

**No renderer changes.** Existing `parseTemplateSections` → `partsFromTemplateMaterial` → labelled `text_entry` workspaces already render correctly when the body is authored canonically.

---

## 8. Treatment of mathematical derivation workspaces

Commission as `template` with ordered `**Label:**` steps (or blank table). Preserves pedagogical sequence as labelled response prompts. Does **not** claim symbolic maths editing.

---

## 9. Editable maths remains explicitly unsolved/parked

Contracts and tests state: do not invent an equation editor; MathQuill/MathLive not introduced; editable mathematical input remains a separate parked capability.

---

## 10. Tests added/changed

| File | Change |
| ---- | ------ |
| `tests/s78-t-042-learner-workspace-authoring-fidelity.test.js` | **Added** — DLA/GAM salience; live V2 Copy; `**Label:**` parse; stranded bold; ordinary emphasis; live export workspaces; tables remain tables; domain-generality; prior S78 markers |

---

## 11. Test results

```text
tests/s78-t-042-learner-workspace-authoring-fidelity.test.js  10/10 pass
tests/s78-t-041-culminating-transfer-production.test.js       pass (regression)
tests/s78-disciplinary-precision-salience.test.js             pass (regression)
```

---

## 12. Expected learner-facing improvement after regeneration

After fresh DLA → GAM → export:

1. Solution/derivation workspaces appear as **label → response area** sequences (textareas), not stranded bold stacks.
2. Comparison/diagnostic tables remain editable tables.
3. Ordinary pedagogical bold emphasis is unaffected.
4. True editable maths input is still **not** available — textareas are interim fidelity for labelled steps.

**Operator must regenerate** to prove improved GAM material shape. This task proves contract delivery and render capability for correctly authored templates.

---

## 13. Files changed

| Path | Role |
| ---- | ---- |
| `lib/ld-dla-page-enrich-contract.js` | Commissioning salience |
| `lib/ld-gam-page-enrich-contract.js` | Fulfilment / material-shape salience |
| `app.js` | Live GAM V2 Copy brief line |
| `tests/s78-t-042-learner-workspace-authoring-fidelity.test.js` | Regression coverage |
| Sprint navigation docs | Minimal T-042 record + status |

---

## 14. Deviations

None. Preferred T-038 approach (DLA/GAM salience; no broad bold-prose parser) implemented. Optional parser broaden for bold-without-colon **not** taken.

---

## 15. Unresolved risks

| Risk | Notes |
| ---- | ----- |
| Prompt pressure only | Fresh generation may still emit bold scaffolds; not a hard capture validator |
| Textarea ≠ maths editor | Explicitly parked; QA/operators may still expect symbolic working |
| Heading-based templates | Existing `# Heading` parse path unchanged; salience emphasises `**Label:**` |
| T-013 / first-pass reliability | Unrelated; remains OPEN |

---

## 16. Sprint 78 / T-013 state

**Sprint 78:** OPEN  
**T-013:** OPEN — not closed by this task  

All planned T-038 composition follow-ons (T-039…T-042) are now implemented. Next operator action: **fresh end-to-end Lagrangian regeneration benchmark**.
