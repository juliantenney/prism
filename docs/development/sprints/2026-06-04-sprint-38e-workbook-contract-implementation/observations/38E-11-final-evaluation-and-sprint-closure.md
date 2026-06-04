# Slice 38E-11 — Final evaluation and sprint closure

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Sprint:** **38-E — Workbook Contract Implementation** → **CLOSED**  
**Authority:** [38C-6](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-6-planning-synthesis-and-execution-recommendation.md) · [38D-5](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) · [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md)  
**Evidence trail:** [38E-1](38E-1-implementation-target-audit.md) through [38E-10](38E-10-inflation-rerun-scorecard.md) · [38E-7](38E-7-sprint-closure.md) (historical mid-sprint closure)

---

## 1. Purpose

Close **Sprint 38-E** by judging whether the workbook-contract **implementation hypothesis** was validated on the Inflation anchor, synthesising the full evidence chain (EV-01 → 38E-5 → 38E-6 → 38E-8/9 → 38E-10), and recommending the next programme action — with **Workbook** and **Preservation** reported separately throughout.

---

## 2. Sprint mission recap

**Mission:**

> Operationalise Sprint **38-D** workbook authoring contracts in learning-design **prompts/contracts** so self-directed learner workbook briefs produce **multi-genre** workbook material — not table-only activity sheets.

**Primary success condition:**

> **Workbook PASS** + **Preservation PASS** (never conflated)

**Primary hypothesis:**

> If DLA workbook obligations and GAM workbook genre obligations are added to the relevant learning-design prompts/contracts, then an Inflation self-study learner run will move from **EV-01 FAIL** to **workbook PASS** without regressing Design Page preservation or B4 table fidelity.

**Programme question:**

> Can we implement 38-D contracts in the live pipeline and prove workbook uplift on the Inflation anchor while holding 38-B preservation?

**Implementation boundary (held):** Pack-first — `domains/learning-design/domain-learning-design-step-patterns.md` §5 (DLA) and §6 (GAM); **`app.js` not modified** ([38E-1](38E-1-implementation-target-audit.md)).

---

## 3. What was implemented

| Phase | Scope | Outcome |
|-------|--------|---------|
| **[38E-2](38E-2-dla-contract-implementation.md)** | DLA-WB-01 … 19 in pack **§5** | `required_materials` diversity, `delivery_notes` (`resource_intent`, `workbook_contract_applied`, duration, consolidation requirement); multi-genre obligations; session economics |
| **[38E-3](38E-3-gam-contract-implementation.md)** | GAM-WB-00 … 21, MIX-01 … 06, AP-01 … 04 in pack **§6** | Table-only **invalid**; full-body genre realisation; DLA→GAM matrix; anti-pattern enforcement in prompts |
| **[38E-8](38E-8-dla-workbook-function-strengthening.md)** | **§5 only** (post-38E-6) | Mandatory `worked_example` + `sample_output` rows (WB-08); `consolidation_summary` on final activity (WB-12); JSON MUST rules; anti-ambiguity vs `template`/`prompt_set` substitutes |
| **[38E-9](38E-9-gam-workbook-function-enforcement.md)** | **§6 only** | GAM-WB-02/06 mandatory; F1–F4 fail conditions; exact `Material:` labelling; consolidation trigger; **LD-MATERIALS-COPY** / **LD-TABLE-FIDELITY** unchanged |

**Supporting work:** [38E-1](38E-1-implementation-target-audit.md) audit · [38E-4](38E-4-contract-regression-fixture-check.md) regression · [38E-5](38E-5-inflation-after-scorecard.md) / [38E-10](38E-10-inflation-rerun-scorecard.md) pipeline captures · [38E-6](38E-6-remaining-workbook-function-gap-analysis.md) diagnosis.

**Repo touch (implementation):** `domain-learning-design-step-patterns.md` §5–§6; `tests/workbook-contract-prompt-surface.test.js`; sprint `artefacts/` captures. **Not changed:** `app.js`, preservation `lib/*`, renderer, Design Page §13 body.

---

## 4. Evidence chain

```text
EV-01 (BEFORE — frozen 38-B)
  │  table-only · AP-01–04 FAIL · R4/R5 Absent · 125 min
  ▼
38E-2/3 — pack §5 + §6 contracts enacted
  ▼
38E-5 — EV-38E5-AFTER
  │  multi-genre uplift · AP-01–04 PASS · Workbook FAIL (V-03, V-04)
  ▼
38E-6 — gap analysis
  │  worked example breaks at DLA output; consolidation at GAM (prompt_set substitute)
  ▼
38E-8/9 — §5 + §6 function strengthening (mandatory types + enforcement)
  ▼
38E-10 — EV-38E10-AFTER
     worked_example + sample_output + consolidation_summary manifest
     V-03/V-04/V-10 Pass · V-01/V-05 Fail · Preservation PASS
```

| Step | Observation | Key deliverable |
|------|-------------|-----------------|
| Baseline | EV-01 | [38D-5 §3](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) |
| First AFTER | [38E-5](38E-5-inflation-after-scorecard.md) | `EV-38E5-AFTER-*` |
| Diagnosis | [38E-6](38E-6-remaining-workbook-function-gap-analysis.md) | Strengthen **both** DLA + GAM |
| Fix | [38E-8](38E-8-dla-workbook-function-strengthening.md) · [38E-9](38E-9-gam-workbook-function-enforcement.md) | Pack §5/§6 |
| Second AFTER | [38E-10](38E-10-inflation-rerun-scorecard.md) | `EV-38E10-AFTER-*` |

---

## 5. Hypothesis assessment

**Verdict: Partially supported**

| Component | Judgement | Evidence |
|-----------|-----------|----------|
| **Contracts change live output** | **Supported** | EV-01 → 38E5: 4→7 types, AP-01–04 cleared; 38E5 → 38E10: worked + consolidation authored and preserved on page |
| **Workbook quality improves** | **Supported** | R1–R5 progression; V-03/V-04 fixed at 38E10; duration 125→60 min; anti-patterns cleared from EV-01 baseline |
| **Workbook reaches PASS** | **Not supported** | All three runs: **Workbook FAIL**; 38E10 blocked by **V-01** (3/4 families) and **V-05** |
| **No preservation regression** | **Supported** | **Preservation PASS** on EV-01, 38E5, 38E10; V-13 stable; LD-MATERIALS-COPY match for new genres |

**Sprint primary success condition (Workbook PASS + Preservation PASS):** **Not met.**

**Sprint implementation objective (enact 38-D contracts, evaluate on anchor, protect 38-B):** **Met.**

**Programme learning:** Authoring contracts in DLA/GAM packs are a **necessary and effective** lever for workbook function uplift; they are **not sufficient alone** for full [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) PASS when genre-family obligations compete under model token budget (table family dropped at 38E10).

---

## 6. Before / after summary

Frozen BEFORE: **NEG-EV-01** (38-B fixtures). Mid AFTER: **`EV-38E5-AFTER`**. Final AFTER: **`EV-38E10-AFTER`**.

| Measure | EV-01 | 38E-5 | 38E-10 |
|---------|-------|-------|--------|
| **Workbook verdict** | **FAIL** | **FAIL** | **FAIL** |
| **Preservation verdict** | **PASS** | **PASS** | **PASS** |
| **GAM material types** | 4 (tables only) | 7 | **8** |
| **Genre families** | 1 (table) | 3 | **3** (narrative, practice, closure — **no table family**) |
| **AP-01 table-only** | FAIL | **PASS** | **PASS** |
| **AP-02 capstone dump** | FAIL | **PASS** | **PASS** |
| **AP-03 pre-filled judgement** | FAIL | **PASS** | **PASS** |
| **AP-04 scenario gap** | FAIL | **PASS** | **Partial** — scenario language; no `scenario` Material |
| **worked_example** | No | No | **Yes** |
| **sample_output** | No | No | **Yes** |
| **consolidation_summary** | No | No | **Yes** |
| **Duration (sum)** | 125 min | 65 min | **60 min** |
| **Transfer (R6)** | Partial | Partial | **Partial** (A4 transfer task) |
| **Learner journey** | Activity sheet + reference dump | Multi-section practice + narrative; weak closure | **Teach → practice → retrieval → closure** with worked model and summary |
| **V-03 consolidation** | Fail | Fail | **Pass** |
| **V-04 worked example** | Fail | Fail | **Pass** |
| **V-01 ≥4 families** | Fail | Fail | **Fail** |
| **V-05 scenario align** | Fail | Pass | **Fail** |
| **V-10 page functions** | Fail | Fail | **Pass** |

Detail: [38E-5 §5–6](38E-5-inflation-after-scorecard.md) · [38E-10 §3](38E-10-inflation-rerun-scorecard.md).

---

## 7. Confirmed findings

**Confirmed:**

- **Authoring contracts influence output** — Pack §5/§6 changes manifest in DLA JSON, GAM bodies, and Design Page `materials` on the same anchor brief ([38E-5](38E-5-inflation-after-scorecard.md), [38E-10](38E-10-inflation-rerun-scorecard.md)).
- **Preservation remained stable** — V-13 **PASS** across three runs; new genres copied verbatim; no B4 comma/Headers-Rows regression ([38E-10 §6](38E-10-inflation-rerun-scorecard.md)).
- **Design Page is not the primary cause** of workbook thinness — When GAM authors genres, page preserves them; when GAM omits genres, page cannot invent them (aligns [38C-6 §3](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-6-planning-synthesis-and-execution-recommendation.md)).
- **Worked-example and consolidation contracts can manifest in output** — After [38E-8](38E-8-dla-workbook-function-strengthening.md)/[38E-9](38E-9-gam-workbook-function-enforcement.md), `EV-38E10` shows `worked_example`, `sample_output`, `consolidation_summary` at DLA, GAM, and page layers.
- **38E-6 diagnosis was correct** — First-pass contracts (38E-2/3) were necessary but under-specified for WB-08/WB-12 live manifestation; targeted strengthening closed those paths.
- **Pack-first implementation is viable** — [38E-1](38E-1-implementation-target-audit.md) `app.js` = NO held; no preservation architecture reopen required.

---

## 8. Disproved findings

**Ruled out as primary causes (reconfirmed on execution):**

| Finding | Why disproved | Evidence |
|---------|---------------|----------|
| **Design Page stripping as primary cause** | GAM→page bodies match for authored genres including new 38E10 types | [38E-10 §6](38E-10-inflation-rerun-scorecard.md); [38C-2 §7.1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md) |
| **Table fidelity / B4 syntax as root workbook problem** | Tables preserve when authored (38E5); 38E10 absence is **genre choice**, not fidelity failure | V-13 PASS; LD-TABLE-FIDELITY N/A when no pipes |
| **“Contracts in pack = automatic PASS”** | 38E5 and 38E10 both FAIL overall despite enacted pack text | Live pipeline captures |
| **GAM-only fix sufficient for consolidation/worked** | 38E5 showed GAM cannot compensate for missing DLA `required_materials` rows | [38E-6](38E-6-remaining-workbook-function-gap-analysis.md) |
| **Preservation vs workbook trade-off required** | 38E10 added genres **without** preservation regression | Three-run V-13 PASS |

**Not disproved (deferred):** Renderer could improve **visibility** of existing fields ([38C-5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-5-workbook-experience-rendering.md)) — secondary until upstream PASS.

---

## 9. Remaining blockers

Only **V-01** and **V-05** block workbook PASS at 38E10 ([38D-4 §6.3 G3](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md)).

### V-01 — Genre family count (≥4 families)

| Field | Detail |
|-------|--------|
| **Evidence** | 38E10 GAM: **8** types but **3** families (narrative, structured_practice, closure); **0** pipe-table materials; 38E5 had **2** table types + 3 families = still failed V-01 (missing closure) |
| **Likely cause** | Model prioritised new mandatory rows (worked, consolidation) over table-family materials; pack does not **require** table + closure + scenario families **in one run** |
| **Severity** | **High** — blocks V2 Pass and overall workbook PASS |

### V-05 — Scenario alignment

| Field | Detail |
|-------|--------|
| **Evidence** | 38E10: household case language in **task_cards**; no `Material: scenario`; 38E5 had dedicated `scenario` type (**V-05 Pass**) |
| **Likely cause** | Strengthening emphasis on exact Material labels for worked/consolidation; scenario type not re-mandated alongside new rows |
| **Severity** | **Medium** — blocks V2 Pass; AP-04 only **Partial** at 38E10 |

---

## 10. Programme interpretation

### Cases A–D ([38D-5 §9](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md))

| Case | Definition | Fit |
|------|------------|-----|
| **A** | Workbook improves materially; preservation holds; not full PASS | **38E-10 primary** |
| **B** | Workbook PASS + preservation PASS | **Not met** (any run) |
| **C** | Preservation holds; workbook FAIL — contracts thin / wrong layer | **38E-5 primary** (no worked/consolidation) |
| **D** | No meaningful change | **EV-01 only** (superseded by 38E5+) |

### Classification change (38E-5 → 38E-10)

| Run | Case | Interpretation |
|-----|------|----------------|
| **38E-5** | **C** | Contracts in pipeline; multi-genre uplift; critical functions still absent |
| **38E-10** | **A** | Same preservation; **material uplift** on 38E-6 targets; new V-01/V-05 gaps |

**Change:** Case **C → A** — the sprint **resolved** the 38E-6 failure mode (worked + consolidation) without achieving Case **B**. The programme moved from “contracts not manifesting critical functions” to “functions manifest; family mix incomplete.”

### Success tiers ([38D-5 §7](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md))

| Tier | 38E-10 |
|------|--------|
| **Not met** | — |
| **Minimum (expanded)** | **Met** — AP-01 Pass, V-13 Pass, V-03/V-04 fixed, ≥2 families |
| **Strong** | **Not met** — V2 Fail (V-01, V-05) |
| **Exceptional** | **Not met** — below `CW-REF-38D3` full mix |

---

## 11. Recommendation

**Chosen: B — Small contract refinement sprint**

| Option | Assessment |
|--------|------------|
| **A. Close workbook programme** | **Reject** — Hypothesis partially supported; two pack-addressable blockers remain with clear evidence |
| **B. Small contract refinement sprint** | **Accept** — V-01/V-05 are upstream spec gaps, not preservation or renderer failures; 38E-8/9 proved targeted pack edits work |
| **C. Design Page / renderer investigation** | **Reject** — Disproved as primary cause; would not restore table/scenario families GAM never authored |
| **D. New pedagogical investigation** | **Reject** — 38C/38D already defined the bar; execution gap is contract completeness under one-run budget |

**Justification:** Three runs show a **stable preservation stack** and **predictable contract→output causality**. Remaining failures are **enumerated V-rules** fixable by requiring **≥1 table-family material** and **`scenario` Material** alongside mandatory worked/consolidation rows — not by reopening 38-B or `app.js`.

---

## 12. Proposed next sprint

### Sprint 38-F — Workbook Contract Refinement

| Field | Content |
|-------|---------|
| **Objective** | Achieve **Workbook PASS** + **Preservation PASS** on Inflation anchor re-run |
| **Scope** | **V-01:** DLA §5 require ≥1 practice `analysis_table` or `classification_table` **and** retain closure/worked rows; GAM §6 enforce table-family Material when DLA lists it · **V-05:** Re-mandate `scenario` Material where brief uses household cases · **Inflation rerun** → `EV-38F-AFTER-*` · Score against [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) |
| **Explicit non-goals** | Architecture reopen · 38-B preservation module changes · Renderer redesign · `app.js` unless audit proves required · Sprint 39 reasoning cues |

**Frozen comparators:** EV-01 · `EV-38E5-AFTER` · `EV-38E10-AFTER` (do not overwrite).

---

## 13. Executive summary

**For stakeholders (one page)**

**Objective.** Prove that Sprint 38-D workbook authoring contracts, when implemented in live learning-design prompts, can turn the Inflation self-study learner experience from a table-heavy activity sheet into a genuine self-study workbook — without breaking content preservation.

**Intervention.** We added DLA and GAM workbook obligations to the domain step-pattern pack (no application-code changes). After a first pipeline run showed partial uplift but missing worked examples and consolidation, we strengthened DLA and GAM contracts and re-ran the same Inflation brief.

**Results.**

- **Preservation: PASS** across all evaluations. Design Page continues to copy upstream material faithfully; no regression in table syntax or materials-copy behaviour.
- **Workbook: FAIL** on the official bar, but with **substantial improvement**. Compared with the baseline, outputs now include teaching narrative, practice tasks, retrieval checklists, a stepped worked example with sample output, and a consolidation summary. Duration moved from 125 to 60 minutes. Anti-patterns (table-only sheets, capstone dumps, pre-filled judgement) are cleared.
- **Remaining gaps:** The final run did not include a table-family material type (needed for full genre diversity) and did not emit a dedicated scenario material (case content appeared only inside task cards).

**Recommendation.** Continue with a **short refinement sprint (38-F)** to adjust pack contracts so one run can satisfy both function requirements (worked example, consolidation) **and** family diversity (table + scenario) — still pack-only, still separate workbook vs preservation reporting. Do **not** pivot to renderer or Design Page work as the primary fix; evidence shows the bottleneck remains upstream authoring.

**Programme verdict.** The workbook-contract implementation hypothesis is **partially supported**: contracts work and preservation holds; full PASS requires one more targeted contract pass, not a platform redesign.

---

## 14. Closure statement

| Criterion | Met? |
|-----------|------|
| Explicit judgement on hypothesis | **Yes** — §5 **Partially supported** |
| Programme learning documented | **Yes** — §5, §7, §8 |
| Clear recommendation | **Yes** — §11 **Option B** → Sprint 38-F |
| Workbook and Preservation separate | **Yes** — throughout; §6 table |
| Stakeholder executive summary | **Yes** — §13 |
| All 38E-1 … 38E-10 synthesised | **Yes** — §3–§4 |

**Sprint 38-E — Workbook Contract Implementation: COMPLETE (CLOSED).**

| Final dual verdict (38E-10 anchor) | Result |
|----------------------------------|--------|
| **Workbook** | **FAIL** (V-01, V-05; strong partial on V-03, V-04, V-10) |
| **Preservation** | **PASS** |

**Historical note:** [38E-7](38E-7-sprint-closure.md) closed the sprint after 38E-5; the sprint **continued** for 38E-8 … 38E-10. **This document** is the authoritative final closure.

**Next programme step:** Charter **Sprint 38-F — Workbook Contract Refinement** per §12.
