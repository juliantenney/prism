# Slice 38F-1 — V-01 / V-05 forensic analysis

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) § 38F-1  
**Authority:** [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) · [38D-5](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) · [38E-10](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-10-inflation-rerun-scorecard.md) · [38E-11](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-11-final-evaluation-and-sprint-closure.md)  
**Evidence:** `EV-38E10-AFTER-*` (read-only) · pack §5/§6 (read-only)  
**Out of scope:** Prompt edits · code · tests · pipeline run · 38-E artefact modification

---

## 1. Purpose

Trace **exactly** why **V-01** (genre family diversity) and **V-05** (scenario alignment) failed on `EV-38E10-AFTER`, classify break points by layer, and identify the **smallest safe pack-only** refinements for **38F-2** — without losing 38E-8/9 worked-example and consolidation gains.

---

## 2. Evidence set

| Artefact | Role |
|----------|------|
| [EV-38E10-AFTER-dla-learning-activities.json](../../2026-06-04-sprint-38e-workbook-contract-implementation/artefacts/EV-38E10-AFTER-dla-learning-activities.json) | DLA `required_materials` inventory |
| [EV-38E10-AFTER-gam.txt](../../2026-06-04-sprint-38e-workbook-contract-implementation/artefacts/EV-38E10-AFTER-gam.txt) | GAM `Material:` types and bodies |
| [EV-38E10-AFTER-design-page.json](../../2026-06-04-sprint-38e-workbook-contract-implementation/artefacts/EV-38E10-AFTER-design-page.json) | Composed `materials.*` |
| [EV-38E10-AFTER-render-excerpt.html](../../2026-06-04-sprint-38e-workbook-contract-implementation/artefacts/EV-38E10-AFTER-render-excerpt.html) | Learner-visible excerpt |
| [38E-10 scorecard](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-10-inflation-rerun-scorecard.md) | Official V-01/V-05 verdicts |
| `domain-learning-design-step-patterns.md` §5–§6 | Current pack obligations (38E-2/3/8/9) |

**Comparator (same anchor, different pack generation):** `EV-38E5-AFTER` — had `scenario` + two `*_table` types; **lost** at 38E10 when 38E-8/9 mandatory rows dominated the activity budget.

---

## 3. V-01 — Table / reference family failure

### 3.1 Rule ([38D-4 V-01](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md))

| Field | Content |
|-------|---------|
| **Pass** | ≥**4** distinct type **families** session-wide ([38D-3 F1](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-3-canonical-workbook-fixture.md); [canonical MIX-02](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/canonical-workbook-gam-expectations.md)) |
| **Fail** | &lt;4 families |
| **Evidence** | GAM `Material:` type inventory |

**Reviewer taxonomy** ([38D-2 §8](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md)):

| Family | Example tokens |
|--------|----------------|
| **Table** | `classification_table`, `comparison_table`, `analysis_table`, `impact_table` |
| **Narrative** | `scenario`, `text` |
| **Structured practice** | `task_cards`, `template`, `prompt_set` |
| **Closure / quality** | `consolidation_summary`, `checklist`, `rubric`, `sample_output`, `worked_example` |

### 3.2 Trace — DLA

| Question | Answer |
|----------|--------|
| Did DLA request any table/reference family? | **No** |
| Where? | — |
| Why not? | No `required_materials` row uses `classification_table`, `comparison_table`, `analysis_table`, or `impact_table` on any activity |

**38E10 DLA type inventory (9 rows across 4 activities):**

| Activity | `required_materials` types |
|----------|---------------------------|
| A1 | `worked_example`, `sample_output`, `text` |
| A2 | `task_cards`, `checklist` |
| A3 | `prompt_set`, `modelling_note` |
| A4 | `consolidation_summary`, `prompt_set` |

**Pack context:** DLA-WB-06 (pack §5) forbids **table-only** sessions and requires **≥2** families when tables appear — but it does **not** require **≥1** `*_table` row when `workbook_contract_applied: true`. [38E-8](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-8-dla-workbook-function-strengthening.md) added mandatory worked/consolidation rows without a co-mandatory practice table row.

**Contrast 38E5 DLA A1/A2:** `classification_table` (A1), `scenario` + `analysis_table` (A2) — tables **were** requested; GAM authored pipe tables ([38E-5](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-5-inflation-after-scorecard.md)).

### 3.3 Trace — GAM

| Question | Answer |
|----------|--------|
| Did GAM receive a table requirement? | **No** — no `*_table` in DLA JSON |
| Did GAM author any table Material? | **No** — zero `Material: … (*_table)` lines |
| Pipe tables in Content? | **No** |

**GAM types present (8):** `worked_example`, `sample_output`, `text`, `task_cards`, `checklist`, `prompt_set`, `modelling_note`, `consolidation_summary`.

### 3.4 Trace — Design Page / render

| Question | Answer |
|----------|--------|
| Did Design Page preserve tables if authored? | **N/A** — none upstream |
| Table keys on page `materials`? | **None** (no `analysis_table`, etc.) |

Page faithfully copied non-table genres ([38E-10 §6](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-10-inflation-rerun-scorecard.md) — V-13 **PASS**). Render excerpt has CSS for `<table>` but **no** pipe-table material bodies in the capture.

### 3.5 Family count on 38E10

| Family | Present? | Tokens |
|--------|----------|--------|
| **Table** | **No** | — |
| **Narrative** | **Yes** | `text` (A1) — no `scenario` type |
| **Structured practice** | **Yes** | `task_cards`, `prompt_set` |
| **Closure / quality** | **Yes** | `worked_example`, `sample_output`, `consolidation_summary`, `checklist` |

**Distinct families counted:** **3** (Table absent) → **V-01 Fail** per [38E-10 §3](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-10-inflation-rerun-scorecard.md).

**Note:** If scored only on narrative / structured practice / retrieval / closure ([38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) wording), `checklist` (A2) may supply **retrieval**; the programme anchor still failed V-01 because the **Table** family — present in `CW-REF-38D3` practice activities ([canonical A2/A4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/canonical-workbook-gam-expectations.md)) — was omitted after 38E-8/9.

### 3.6 Break-point classification (V-01)

| Layer | Verdict | Rationale |
|-------|---------|-----------|
| **DLA specification** | **Primary** | No `*_table` in live JSON; pack does not **mandate** one table row alongside WB-08/WB-12 |
| **GAM realisation** | **Secondary (N/A)** | Correctly followed DLA — no table to realise |
| **Design Page preservation** | **Not involved** | Nothing to preserve |
| **Validation interpretation** | **Correct** | GAM inventory objectively lacks Table family |

```text
Pack WB-06 (anti table-only)  →  DLA model (no *_table row)  →  GAM (no table)  →  V-01 Fail
        38E-8 mandatory rows compete for activity budget — tables dropped vs 38E5
```

---

## 4. V-05 — Explicit scenario Material failure

### 4.1 Rule ([38D-4 V-05](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md))

| Field | Content |
|-------|---------|
| **Pass** | Every activity with case/scenario language has `scenario` material with ≥**2** cases |
| **Fail** | Case language without `scenario` block |
| **Evidence** | GAM; DLA `required_materials` |

### 4.2 Trace — DLA

| Question | Answer |
|----------|--------|
| Did DLA request `scenario` as a distinct type? | **No** |
| Scenario implied only in tasks? | **Yes** |

**Evidence A2:**

- `learner_task`: “For each **household scenario**…”
- `activity_preamble`: “real-life **household scenarios**”
- `required_materials`: **`task_cards`** — purpose “Provide **scenarios** of households…”
- **No** `type: "scenario"` row

**Pack:** DLA-WB-18 already states: when learner_task/preamble references cases/scenarios/households, the activity **must** include `required_materials` type **`scenario`**. Clause is in pack §5 but **did not manifest** in live DLA output (same failure mode as pre-38E-8 WB-08 — narrative contract ≠ JSON row).

### 4.3 Trace — GAM

| Question | Answer |
|----------|--------|
| Did GAM author scenario content? | **Yes** — three household cases in prose |
| Embedded in `task_cards`? | **Yes** |
| `Material: scenario` label? | **No** |

```text
Material: M4 (task_cards)
### Task Cards: Household Inflation Scenarios
**Card 1: The Smith Family** …
**Card 2: The Lee Household** …
**Card 3: The Patel Household** …
```

GAM-WB-10 / AP-04 (pack §6) require `Material: scenario` when task language uses case/scenario — but GAM instruction also says **“Treat learning_activities as the source of truth”** and realise **each DLA `required_materials` type**. With DLA listing only `task_cards`, the model **lawfully** nested cases inside cards.

### 4.4 Trace — Design Page

| Question | Answer |
|----------|--------|
| `materials.scenario` on A2? | **No** |
| `materials.task_cards`? | **Yes** — verbatim GAM body |

Preservation **PASS** — not a stripping issue.

### 4.5 Break-point classification (V-05)

| Layer | Verdict | Rationale |
|-------|---------|-----------|
| **DLA specification** | **Primary** | WB-18 not emitted; `task_cards` used as scenario vehicle |
| **GAM realisation / labelling** | **Secondary** | Faithful to DLA type; AP-04 pattern inside cards |
| **Design Page preservation** | **Not involved** | Copied `task_cards` |
| **Validation interpretation** | **Correct** | Case language + no `scenario` Material = Fail |

**Contrast 38E5:** DLA A2 listed `type: "scenario"` + `analysis_table` → GAM `Material: scenario` → **V-05 Pass** ([38E-5](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-5-inflation-after-scorecard.md)). **38E10 regression** is DLA type substitution, not renderer loss.

```text
Pack WB-18  →  DLA outputs task_cards (not scenario)  →  GAM task_cards  →  V-05 Fail
```

---

## 5. Preserve 38E-8/9 gains (confirmed on EV-38E10)

| Type | DLA spec | GAM | Design Page | Status |
|------|----------|-----|-------------|--------|
| **worked_example** | A1 M1 | `Material: M1 (worked_example)` — 3 steps + CPI formula | `materials.worked_example` | **Present** |
| **sample_output** | A1 M2 | `Material: M2 (sample_output)` | `materials.sample_output` | **Present** |
| **consolidation_summary** | A4 M8 | `Material: M8 (consolidation_summary)` — ≥80 words, 3 ideas | `materials.consolidation_summary` | **Present** |

**38F-2 guardrails:**

- Do **not** remove or weaken DLA-WB-08 / WB-12 mandatory JSON rows or GAM-WB-02 / WB-06 / F1–F4 fail rules.
- Add V-01/V-05 obligations as **additional** `required_materials` rows on **practice activities** (e.g. A2), not by replacing worked/consolidation activities.
- Prefer **A2** for `scenario` + `analysis_table` (matches 38E5 successful shape and `CW-REF` A3/A4 pattern) — keep **A1** teach + **A4** closure arcs unchanged in intent.

---

## 6. `app.js` assessment

| Field | Result |
|-------|--------|
| **`app.js` required?** | **NO** |
| **Evidence** | Failures occur at DLA type selection and GAM labelling **before** compose; V-13 **PASS** when genres exist; 38E-1 pack-first audit unchanged |
| **Rationale** | V-01/V-05 gaps are **missing upstream Material types**, not runtime stripping, sanitization dropping tables, or compose inventing bodies. No new failure mode implicating `sanitizeSelfDirectedGamMaterialsOutput` or Design Page merge beyond “GAM never authored type X.” |

**Charter:** 38F-2 remains pack-only unless a **38F-4** run shows a runtime regression with types present in GAM but absent on page.

---

## 7. Minimal clause deltas for 38F-2

| Rule | Surface | Proposed minimal change | Rationale |
|------|---------|-------------------------|-----------|
| **V-01 table co-presence** | DLA §5 `promptTemplate` | Add **DLA-WB-06a (38F-2):** when `workbook_contract_applied: true`, session **MUST** include ≥1 `required_materials` row with type `analysis_table` or `comparison_table` or `classification_table` on a **practice** activity (not capstone); specification must require **learner-work columns empty** and quantitative comparison; **must not** be only on capstone (WB-16); **coexist** with WB-08/WB-12 rows | Closes Table family gap; mirrors 38E5 + `CW-REF` without reintroducing table-only |
| **V-01 table realisation** | GAM §6 `promptTemplate` | Add **GAM-WB-38F-01:** when DLA lists any `*_table`, emit `Material: <id> (<exact_table_type>)` with **LD-TABLE-FIDELITY** pipe table; learner judgement/rating cells **empty** (AP-03); table supports paired scenario/practice on same activity | DLA row alone insufficient without GAM pipe output |
| **V-05 scenario row** | DLA §5 `promptTemplate` | Strengthen **DLA-WB-18 (38F-2):** when `learner_task` or `activity_preamble` references households/cases/scenarios, **MUST** list `type: scenario` (≥2 cases in specification); **`task_cards` MUST NOT** be the sole material carrying household case narratives — cards may follow scenario for imperative steps | Fixes 38E10 A2 substitution; aligns live JSON with existing WB-18 intent |
| **V-05 scenario labelling** | GAM §6 `promptTemplate` | Strengthen **GAM-WB-10 / AP-04 (38F-2):** if DLA lists `scenario`, **MUST** use `Material: scenario` with ≥2 named cases (≥40 words each); **forbid** embedding ≥2 household case narratives **only** inside `task_cards` when DLA specified `scenario` or WB-18 triggered | Prevents lawful task_cards workaround |
| **V-05 practice pairing** | DLA §5 (optional same row) | On scenario practice activity, recommend `analysis_table` in specification (budget impact table) — pairs with 38E5 A2 pattern | One activity satisfies V-01 table + V-05 scenario alignment |
| **Co-presence guard** | DLA §5 `Output` schema bullet | When `workbook_contract_applied: true`, JSON **MUST** include: (existing WB-08/WB-12 rows) **AND** ≥1 `*_table` row **AND** ≥1 `scenario` row where session uses household/case language | Same 38E-8 pattern — narrative pack text insufficient |
| **Anti-dump** | GAM §6 (unchanged, cite) | Re-affirm GAM-WB-20 / AP-02 in 38F-2 observation only — new table on **A2**, not four-table capstone | Risk control for table reintroduction |

**Not recommended in 38F-2:**

- Broad “every workbook must have 4 tables” — over-constrains non-quantitative briefs.
- GAM-only scenario fix without DLA `scenario` row — [38E-6](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-6-remaining-workbook-function-gap-analysis.md) proved GAM follows DLA inventory.

---

## 8. Risks

| Risk | Mitigation in 38F-2 |
|------|---------------------|
| **Over-constraining all workbook briefs** | Gate table mandate on `workbook_contract_applied` + practice activity with quantitative comparison / household budget analysis (Inflation-shaped), not global all workflows |
| **Tables back as dumps** | Single practice `analysis_table`; capstone stays `consolidation_summary` + `prompt_set`; GAM-WB-20 unchanged |
| **Scenario duplication** | `scenario` = case narrative; `task_cards` = imperative steps referencing scenario — not duplicate three full cases in both |
| **Token / activity budget pressure** | Add rows to **A2** only; keep A1/A4 mandatory types (lesson from 38E5→38E10 trade-off) |
| **Losing worked/consolidation** | Explicit “WB-08/WB-12 rows remain mandatory” in same edit hunk; 38F-3 regression asserts strings still in pack |

---

## 9. Recommendation

**Chosen: C — DLA + GAM refinement**

| Option | Assessment |
|--------|------------|
| **A. DLA-only** | **Insufficient** — 38E5 showed DLA can list tables/scenario; 38E10 DLA omission is primary, but GAM needs AP-04 enforcement when `task_cards` carries cases |
| **B. GAM-only** | **Insufficient** — without DLA `scenario` / `*_table` rows, GAM treats `learning_activities` as source of truth ([38E-6](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-6-remaining-workbook-function-gap-analysis.md)) |
| **C. DLA + GAM** | **Accept** — minimal §5 rows + §6 labelling/table rules; matches 38E-8/9 success pattern |
| **D. `app.js` required** | **Reject** — §6 evidence |

---

## 10. 38F-2 readiness checklist

| Item | Ready? |
|------|--------|
| V-01 break point documented | **Yes** — DLA primary (no table row) |
| V-05 break point documented | **Yes** — DLA primary (task_cards ≠ scenario) |
| Minimal pack edits scoped | **Yes** — §7 table |
| 38E-8/9 protected | **Yes** — §5 |
| `app.js` decision | **Yes** — **NO** |
| Implementation in this slice | **No** — analysis only |

---

## 11. Completion statement

| Criterion | Met? |
|-----------|------|
| V-01 failure path traced | **Yes** — §3 |
| V-05 failure path traced | **Yes** — §4 |
| Smallest 38F-2 pack edits identified | **Yes** — §7 |
| `app.js` explicit | **Yes** — **NO** §6 |
| No implementation | **Yes** |
| Slice 38F-1 | **COMPLETE** |

**Next:** **38F-2** — apply §7 deltas to `domain-learning-design-step-patterns.md` §5 and §6 only.
