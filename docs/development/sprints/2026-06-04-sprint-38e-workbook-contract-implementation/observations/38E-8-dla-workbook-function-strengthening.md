# Slice 38E-8 — DLA workbook function strengthening

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Authority:** [38E-6](38E-6-remaining-workbook-function-gap-analysis.md) · [38D-1](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-1-dla-workbook-contract.md) · [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md)  
**Predecessor:** [38E-2](38E-2-dla-contract-implementation.md) (initial DLA-WB)  
**Out of scope:** §6 GAM · `app.js` · Design Page · renderer · tests · preservation modules

---

## 1. Purpose

Strengthen **§5 Design Learning Activities** so workbook-gated DLA output **must** list explicit `required_materials` rows for worked-example and consolidation genres — addressing the **DLA break points** in [38E-6 §3.4 and §4.4](38E-6-remaining-workbook-function-gap-analysis.md) where narrative DLA-WB clauses did not manifest in `EV-38E5-AFTER` JSON.

---

## 2. Inputs and authority

| Source | Role |
|--------|------|
| [38E-6](38E-6-remaining-workbook-function-gap-analysis.md) | Rank-1 DLA omission of `sample_output` / worked types; rank-3 closure typed as `prompt_set` only |
| [38E-5](38E-5-inflation-after-scorecard.md) | V-03, V-04, V-10 failures on AFTER |
| [38D-1 DLA-WB-08 / WB-12](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-1-dla-workbook-contract.md) | Normative worked example and consolidation obligations |
| [38D-4 V-03, V-04, V-09](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) | Validation targets for DLA layer |
| [38E-2](38E-2-dla-contract-implementation.md) | Baseline §5 implementation map |

---

## 3. Files changed

| File | Section | Change |
|------|---------|--------|
| `domains/learning-design/domain-learning-design-step-patterns.md` | **§5 only** | `promptTemplate` DLA-WB block + Output schema + `defaultPromptNotes` |

**Not changed:** §6 GAM · §13 Design Page · `app.js` · `lib/*` · tests · fixtures · artefacts

---

## 4. Worked example strengthening

### 4.1 Problem (38E-6)

AFTER DLA had **no** `sample_output`, `worked_example`, or `modelling_note` in `required_materials`. Capstone/ranking `template` entries were misread as worked examples.

### 4.2 Pack changes (38E-8)

| Element | Strengthening |
|---------|---------------|
| **DLA-WB intro** | **38E-8 learner-facing output rule** — types must appear as JSON rows, not `delivery_notes` prose alone |
| **DLA-WB-08** | Renamed **mandatory required_materials row**; requires **worked_example AND sample_output** (preferred pair) on early teach activity; `modelling_note` alternate if sample path omitted; **anti-ambiguity:** capstone integrative template, ranking template, blank practice worksheet **do not** satisfy WB-08 |
| **Output schema** | When `workbook_contract_applied: true`, JSON **must** include ≥1 WB-08 row; prefer `worked_example` + `sample_output` on early activity |
| **Type enum** | Added `worked_example`, `modelling_note` to allowed `required_materials.type` list |
| **defaultPromptNotes** | Points to mandatory rows; states ranking/capstone template ≠ worked example |

### 4.3 Expected DLA JSON shape (post-38E-8)

Example pattern (illustrative — not a fixture):

```json
{
  "activity_id": "A1",
  "required_materials": [
    { "type": "text", "purpose": "exposition", "..." : "..." },
    { "type": "worked_example", "purpose": "stepped expert modelling", "specification": "≥3 steps with intermediate results on [topic task]" },
    { "type": "sample_output", "purpose": "annotated exemplar", "specification": "completed example aligned to worked_example before learner parallel practice" }
  ],
  "learner_task": "... study the worked example and sample output before ..."
}
```

---

## 5. Consolidation strengthening

### 5.1 Problem (38E-6)

`delivery_notes.consolidation_requirement` was present but **no** `consolidation_summary` type; A4 used `prompt_set` only → GAM could not satisfy V-03.

### 5.2 Pack changes (38E-8)

| Element | Strengthening |
|---------|---------------|
| **DLA-WB-12** | Renamed **mandatory required_materials row**; final capstone **must** list `type: consolidation_summary` with ≥80-word / ≥3-idea spec; `prompt_set` may supplement only; **anti-ambiguity:** capstone `template` or `prompt_set` alone **do not** satisfy WB-12; consolidation **cannot** exist only in `delivery_notes` |
| **Output schema** | When `workbook_contract_applied: true`, final activity **must** include `consolidation_summary` row |
| **Type enum** | Added `consolidation_summary` to allowed types |
| **defaultPromptNotes** | Final activity `consolidation_summary` required; not prompt_set-only closure |

### 5.3 Expected DLA JSON shape (post-38E-8)

```json
{
  "activity_id": "A4",
  "required_materials": [
    { "type": "template", "purpose": "integrative capstone plan", "..." : "..." },
    { "type": "consolidation_summary", "purpose": "session closure summary", "specification": "≥80 words summarising ≥3 key session ideas for the learner" },
    { "type": "prompt_set", "purpose": "optional reflection supplement", "..." : "..." }
  ]
}
```

---

## 6. Clause mapping

| 38D clause | 38E-6 gap | 38E-8 implementation | V-* target |
|------------|-----------|----------------------|------------|
| **DLA-WB-08** | No worked row in AFTER JSON | Mandatory row + worked_example/sample_output prefer + anti-template ambiguity | **V-09**, upstream **V-04** |
| **DLA-WB-09** | N/A path unused | modelling_note alternate in WB-08 | R5 alternate |
| **DLA-WB-12** | prompt_set-only closure | Mandatory `consolidation_summary` on final activity | **V-09**, upstream **V-03** |
| **DLA-WB-01** | — | Unchanged; still requires `workbook_contract_applied` | V-09 |
| **DLA-WB-16** | — | Unchanged; reinforced in WB-08 anti-ambiguity | V-06 |

**Learner-facing materials contract (Output block):** Explicit statement that `worked_example`, `sample_output`, `modelling_note`, and `consolidation_summary` are **GAM-authored learner materials** that **must** be listed in `required_materials` when the workbook contract applies.

---

## 7. Risks

| Risk | Mitigation |
|------|------------|
| **Prompt size** | Incremental addition to existing DLA-WB block — monitor in 38E-10 capture |
| **Model still omits rows** | Output schema now states JSON **MUST** satisfy WB-08/WB-12 rows when `workbook_contract_applied: true`; 38E-9 GAM enforcement for `consolidation_requirement` without row |
| **Over-constraining workshop briefs** | Changes gated inside existing DLA-WB applicability (self_directed + workbook brief) |
| **Duplicate types on one activity** | Preferred pair on same/adjacent activity is intentional for GAM handoff |
| **Runtime `app.js` gap** | Deferred per [38E-1](38E-1-implementation-target-audit.md) — pack-first; amend only if 38E-10 DLA JSON still fails |

---

## 8. Handoff to 38E-9

**38E-9 — GAM Workbook Function Enforcement** should:

1. Enforce **GAM-WB-06**: if `delivery_notes.consolidation_requirement` or DLA lists `consolidation_summary` → author `Material: consolidation_summary` ≥80 words; **capstone prompt_set alone = FAIL**.
2. Enforce **GAM-WB-02 / MIX-04**: realise every DLA `worked_example`, `sample_output`, `modelling_note` row with stepped bodies; do not substitute capstone `template`.
3. Keep **§6 only** — no further §5 edits unless 38E-10 shows DLA regression.

**Validation:** Re-run Inflation in **38E-10**; score in **38E-11** against [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) with **Workbook** and **Preservation** separate.

---

## 9. Completion statement

| Criterion | Met? |
|-----------|------|
| DLA explicitly emits worked-example-capable material requirements | **Yes** — WB-08 mandatory rows + type enum + output MUST |
| DLA explicitly emits `consolidation_summary` requirements | **Yes** — WB-12 mandatory row on final activity |
| Anti-ambiguity (template ≠ worked; prompt_set ≠ consolidation) | **Yes** — in WB-08, WB-12, defaultPromptNotes |
| No GAM / runtime / renderer / preservation edits | **Yes** |
| Addresses 38E-6 failure paths | **Yes** — DLA-side break points |
| Slice 38E-8 | **COMPLETE** |

**Next:** **38E-9** — GAM workbook function enforcement (§6 only).
