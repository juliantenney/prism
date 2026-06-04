# Slice 38E-9 — GAM workbook function enforcement

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Authority:** [38E-6](38E-6-remaining-workbook-function-gap-analysis.md) · [38E-8](38E-8-dla-workbook-function-strengthening.md) · [38D-2](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md) · [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) · [canonical-workbook-gam-expectations.md](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/canonical-workbook-gam-expectations.md)  
**Predecessor:** [38E-3](38E-3-gam-contract-implementation.md) · [38E-8](38E-8-dla-workbook-function-strengthening.md) (DLA §5)  
**Out of scope:** §5 DLA · `app.js` · Design Page · renderer · tests · preservation modules · artefact re-run

---

## 1. Purpose

Strengthen **§6 Generate Activity Materials** so GAM **must** author full bodies for `worked_example`, `sample_output`, `modelling_note`, and `consolidation_summary` — closing the **GAM-side** break points in [38E-6 §3.3 and §4.3](38E-6-remaining-workbook-function-gap-analysis.md) (prompt_set substituted for consolidation; no worked materials when DLA omits rows — plus enforcement when DLA **does** list rows per [38E-8](38E-8-dla-workbook-function-strengthening.md)).

---

## 2. Inputs and authority

| Source | Role |
|--------|------|
| [38E-6](38E-6-remaining-workbook-function-gap-analysis.md) | Rank-2 GAM consolidation FAIL; rank-4 DLA-truth vs GAM-WB-06 conflict |
| [38E-8](38E-8-dla-workbook-function-strengthening.md) | DLA now mandates explicit `required_materials` rows — GAM must realise them |
| [38E-5](38E-5-inflation-after-scorecard.md) | V-03, V-04 failures on `EV-38E5-AFTER` |
| [38D-2 GAM-WB-02 / WB-06](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md) | Normative worked example and consolidation clauses |
| [38D-4 V-03, V-04](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) | GAM layer validation targets |
| [canonical-workbook-gam-expectations.md](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/canonical-workbook-gam-expectations.md) | PASS shape: `sample_output`, `consolidation_summary` on session |

---

## 3. Files changed

| File | Section | Change |
|------|---------|--------|
| `domains/learning-design/domain-learning-design-step-patterns.md` | **§6 only** | `promptTemplate` GAM-WB block, material-type guidance, MIX rules, fail conditions, output labelling; `defaultPromptNotes` |

**Not changed:** §5 DLA · §13 Design Page · `app.js` · `lib/*` · tests · `artefacts/*` captures

---

## 4. Worked example enforcement

### 4.1 Material-type guidance (expanded)

| DLA type | GAM obligation (38E-9) |
|----------|-------------------------|
| **worked_example** | `Material: <id> (worked_example)` — ≥3 expert steps, reasoning, visible model answer/output |
| **sample_output** | `Material: <id> (sample_output)` — concrete annotated exemplar of expected learner product |
| **modelling_note** | `Material: <id> (modelling_note)` — expert decision-making, not generic advice |
| **reasoning_walkthrough** | Same as modelling_note when DLA uses that type |

**Invalid substitutes:** blank `template`, ranking table, capstone scaffold — explicit in guidance and MIX-04.

### 4.2 GAM-WB-02 (38E-9 mandatory)

- Emit **one Material block per DLA row** with **exact type** in the Material line.
- **Contract FAIL** if DLA lists `worked_example` / `sample_output` / `modelling_note` but matching Material body is missing or spec-only.

### 4.3 Alignment with canonical fixture

[canonical-workbook-gam-expectations.md](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/canonical-workbook-gam-expectations.md): teach activity includes `sample_output` or stepped example — GAM-WB-02 now requires full realisation when DLA specifies.

---

## 5. Consolidation enforcement

### 5.1 Triggers

GAM must author `Material: consolidation_summary` when **either**:

1. DLA `required_materials` includes `type: consolidation_summary`, **or**
2. `delivery_notes.consolidation_requirement` is true (even if DLA row was weak in prior runs).

### 5.2 Body requirements

| Requirement | Pack text |
|-------------|-----------|
| Minimum size | ≥80 words, ≥3 key ideas |
| Content | What to remember, what changed, how to apply |
| Labelling | `Material: <id> (consolidation_summary)` — not relabelled as `prompt_set` |

### 5.3 GAM-WB-06 (38E-9 mandatory)

- Distinct consolidation Material on final (or designated closure) activity.
- **Invalid substitutes:** capstone `prompt_set`, `reflection_prompt`, table reprint, `template` alone.
- **Contract FAIL:** `consolidation_requirement=true` but no `consolidation_summary` Material.

### 5.4 MIX-03 extension

`prompt_set`-only capstone closure explicitly **FAIL** — addresses [38E-6 §4.3](38E-6-remaining-workbook-function-gap-analysis.md) EV-38E5 pattern.

---

## 6. Fail conditions added

**GAM-WB-38E-9 contract FAIL (explicit F1–F4):**

| ID | Condition |
|----|-----------|
| **F1** | `consolidation_requirement` true but no `Material: consolidation_summary` with ≥80-word closure body |
| **F2** | Capstone `prompt_set` or `reflection_prompt` alone presented as consolidation |
| **F3** | DLA lists `worked_example`, `sample_output`, or `modelling_note` but no matching Material with full body |
| **F4** | `template`-only or ranking-table-only output instead of worked genres when DLA requested |

Merged into Anti-patterns list alongside AP-01–AP-04.

---

## 7. Clause mapping

| 38D / 38D-4 | 38E-9 implementation | Evidence in pack |
|-------------|----------------------|------------------|
| **GAM-WB-02** | Mandatory realisation + F3/F4 | `GAM-WB-02 (38E-9 mandatory)` |
| **GAM-WB-03** | modelling_note body rules | GAM-WB-02 cross-ref |
| **GAM-WB-06** | consolidation_summary + F1/F2 | `GAM-WB-06 (38E-9 mandatory)` |
| **GAM-WB-MIX-03** | prompt_set-only closure FAIL | MIX-03 bullet |
| **GAM-WB-MIX-04** | template-only worked FAIL | MIX-04 bullet |
| **V-03** | consolidation_summary body | GAM-WB-06 |
| **V-04** | worked_example / sample_output | GAM-WB-02 |
| **LD-MATERIALS-COPY** | Unchanged — “obey, do not weaken” | Canonical contracts intro |
| **LD-TABLE-FIDELITY** | Unchanged — table guidance retained | Material-type + GAM-WB-16 |

---

## 8. Non-goals respected

| Non-goal | Status |
|----------|--------|
| §5 DLA edits | **Not touched** (38E-8 complete) |
| `app.js` | **Not touched** |
| Design Page §13 | **Not touched** |
| Renderer | **Not touched** |
| Tests | **Not touched** |
| `lib/ld-table-fidelity.js`, `ld-materials-copy.js` | **Not touched** — pack references preserved |
| Live AFTER re-run | **Deferred** to 38E-10 |

---

## 9. Readiness for 38E-10

| Check | Status |
|-------|--------|
| DLA §5 mandates WB-08 / WB-12 rows | **Yes** ([38E-8](38E-8-dla-workbook-function-strengthening.md)) |
| GAM §6 enforces realisation + fail rules | **Yes** (this slice) |
| Harness | Reuse [ev-38e5-inflation-pipeline-capture-once.mjs](../artefacts/ev-38e5-inflation-pipeline-capture-once.mjs) — save as `EV-38E10-AFTER-*` (38E-10) |
| BEFORE frozen | EV-01 + `EV-38E5-AFTER` unchanged |
| Scorecard authority | [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) · [38E-5](38E-5-inflation-after-scorecard.md) §6 template |

**38E-10 success signal:** GAM contains `Material: worked_example` or `sample_output`, and `Material: consolidation_summary` on same brief; re-score Workbook vs Preservation separately.

---

## 10. Completion statement

| Criterion | Met? |
|-----------|------|
| GAM realises DLA worked_example / sample_output / modelling_note as bodies | **Yes** — GAM-WB-02 mandatory + type-specific guidance |
| GAM realises consolidation_summary as distinct body | **Yes** — GAM-WB-06 + consolidation_requirement trigger |
| prompt_set alone cannot satisfy consolidation | **Yes** — F2, MIX-03, GAM-WB-06 |
| Template alone cannot satisfy worked example | **Yes** — F4, MIX-04 |
| Exact Material type labelling | **Yes** — Output organisation 38E-9 note |
| LD-TABLE-FIDELITY / LD-MATERIALS-COPY intact | **Yes** |
| No DLA / app.js / renderer / test / preservation edits | **Yes** |
| Slice 38E-9 | **COMPLETE** |

**Next:** **38E-10** — Inflation AFTER re-run → new artefacts under `artefacts/`.
