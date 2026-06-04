# Slice 38E-7 — Sprint closure and recommendation

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) § 38E-7  
**Prerequisite:** [38E-6](38E-6-remaining-workbook-function-gap-analysis.md) — residual failure paths  
**Authority:** [38D-5](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) · [38C-6](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-6-planning-synthesis-and-execution-recommendation.md)  
**Evidence trail:** [38E-1](38E-1-implementation-target-audit.md) · [38E-2](38E-2-dla-contract-implementation.md) · [38E-3](38E-3-gam-contract-implementation.md) · [38E-4](38E-4-contract-regression-fixture-check.md) · [38E-5](38E-5-inflation-after-scorecard.md) · [38E-6](38E-6-remaining-workbook-function-gap-analysis.md)

---

## 1. Purpose

Close **Sprint 38-E — Workbook Contract Implementation** by judging whether the sprint validated its hypothesis, interpreting the Inflation before/after outcome, and recommending the next programme step — with **Workbook** and **Preservation** conclusions kept separate throughout.

---

## 2. Sprint mission recap

**Programme question (38-E):**

> Can we implement 38-D contracts in the live pipeline and prove workbook uplift on the Inflation anchor while holding 38-B preservation?

**Primary success condition (unchanged):**

> **Workbook PASS** + **Preservation PASS**

(report separately — never conflated)

**Primary hypothesis:**

> If DLA workbook obligations and GAM workbook genre obligations are added to the relevant learning-design prompts/contracts, then an Inflation self-study learner run will move from **EV-01 FAIL** to **workbook PASS** without regressing Design Page preservation or B4 table fidelity.

**Implementation path (38E-1):** Pack-first — `domain-learning-design-step-patterns.md` §5 (DLA) and §6 (GAM); **`app.js` not modified**.

---

## 3. What changed

| Phase | Deliverable | Outcome |
|-------|-------------|---------|
| **38E-1** | [Implementation target audit](38E-1-implementation-target-audit.md) | DLA → pack §5; GAM → §6; preserve stack read-only; `app.js` = **NO** |
| **38E-2** | [DLA contract implementation](38E-2-dla-contract-implementation.md) | DLA-WB-01 … 19 in §5; `delivery_notes` (`resource_intent`, `workbook_contract_applied`, duration, consolidation requirement); multi-genre `required_materials` obligations |
| **38E-3** | [GAM contract implementation](38E-3-gam-contract-implementation.md) | GAM-WB-00 … 21, MIX-01 … 06, AP-01 … 04 in §6; table-only invalid; full-body genre realisation rules |
| **38E-4** | [Contract regression & fixture check](38E-4-contract-regression-fixture-check.md) | 38D-4 / `CW-REF-38D3` traceability; `tests/workbook-contract-prompt-surface.test.js` (4 pass); V-13 stack untouched; **READY** for AFTER |
| **38E-5** | [Inflation AFTER + scorecard](38E-5-inflation-after-scorecard.md) | `EV-38E5-AFTER` capture under [artefacts/](../artefacts/); EV-01 BEFORE frozen; dual verdicts recorded |

**Repo touch (implementation scope):** `domains/learning-design/domain-learning-design-step-patterns.md` §5–§6; sprint docs; `tests/workbook-contract-prompt-surface.test.js`; capture harness under `artefacts/`. **Not changed:** `app.js`, preservation `lib/ld-*`, renderer, Design Page §13 pack body.

---

## 4. Hypothesis assessment

| Hypothesis component | Assessment | Rationale |
|----------------------|------------|-----------|
| **Overall** | **Partially supported** | Contracts **changed** live output materially; **Preservation PASS** held; **Workbook PASS** not achieved |
| Workbook improves | **Supported** | EV-01 → 38E-5: 4 → 7 types, 1 → 3 families, all AP-01–04 cleared, R1 Present, duration fixed |
| Workbook reaches PASS | **Not supported** | V-03, V-04, V-10 still fail; closure family missing; no `consolidation_summary` or worked example |
| No preservation regression | **Supported** | V-13 PASS; pipe tables verbatim GAM→page; no B4 comma/Headers-Rows signals |

**Sprint primary success condition:** **Not met** (Workbook FAIL + Preservation PASS).

**Sprint implementation objective:** **Met** (38-D contracts enacted in packs, evaluated on Inflation anchor, 38-B protected).

---

## 5. Before / after summary

Frozen BEFORE: **NEG-EV-01** ([38B fixtures](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/)). AFTER: **`EV-38E5-AFTER`** ([38E-5](38E-5-inflation-after-scorecard.md)).

| Measure | EV-01 BEFORE | 38E-5 AFTER | Change |
|---------|--------------|-------------|--------|
| **Workbook verdict** | **FAIL** | **FAIL** | No overall PASS |
| **Preservation verdict** | **PASS** | **PASS** | Held |
| **Material types (GAM)** | 4 (tables only) | 7 (`text`, `scenario`, `task_cards`, `prompt_set`, `template`, + 2 table types) | **+3 types** |
| **Genre families** | 1 (table) | 3 (narrative, table, structured_practice) | **+2 families** |
| **AP-01 table-only** | FAIL | **PASS** | Cleared |
| **AP-02 capstone dump** | FAIL | **PASS** | Cleared |
| **AP-03 pre-filled judgement** | FAIL | **PASS** | Cleared |
| **AP-04 scenario not authored** | FAIL | **PASS** | Cleared |
| **Duration (sum)** | 125 min | 65 min | **V-08 fixed** |
| **Retrieval (R3)** | Partial | Partial | Prompt reflection only; no checklist/self-check |
| **Consolidation (R4)** | Absent | Partial | Reflection prompts; no `consolidation_summary` body |
| **Worked example (R5)** | Absent | Absent | No `sample_output` / `worked_example` |
| **Transfer (R6)** | Partial | Partial | Capstone + transfer tasks in DLA |
| **Learner journey** | Table drill → reference dump | Teach → scenario practice → evaluate → capstone template | **Materially improved**; closure thin |

---

## 6. Key findings

### Confirmed

| Finding | Evidence |
|---------|----------|
| **Authoring contracts influence genre mix** | Same brief, post-pack run: 7 types / 3 families vs EV-01’s 4 / 1 ([38E-5](38E-5-inflation-after-scorecard.md)) |
| **Preservation architecture holds under workbook expansion** | V-13 PASS; new non-table genres on page without table syntax regression |
| **EV-01 anti-patterns are addressable upstream** | AP-01–04 all PASS on AFTER |
| **Pack-first path is viable** | 38E-1 … 38E-5 without `app.js` edits |
| **38-D contracts are reachable in the pipeline** | Not Case D (no meaningful change) |

### Disproved (for this programme — reaffirmed)

| Finding | Evidence |
|---------|----------|
| **Design Page as primary cause of thin workbooks** | AFTER adds genres; DP composes them faithfully ([38C-6](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-6-planning-synthesis-and-execution-recommendation.md); [38E-5 §6](38E-5-inflation-after-scorecard.md)) |
| **Table-only output as inevitable for Inflation** | GAM authored exposition, scenario, cards, prompts after contracts |

### Unknown

| Item | Why unknown |
|------|-------------|
| **Whether current consolidation / worked-example contract wording is strong enough** | Pack lists obligations; model still omitted `consolidation_summary` and `worked_example` on AFTER |
| **Product brief path vs harness gate** | AFTER used explicit `self_study_workbook` flags in capture user message |
| **Multi-run variance** | Single `gpt-4.1-mini` capture |
| **Full render E1–E17 PASS** | V4 Partial; JSON-primary review |

---

## 7. Remaining gap analysis

*Residual failures only — do not reopen solved issues (table-only, capstone dump, pre-filled ranks, scenario gap, duration blowout, preservation).*

| Gap | Layer | 38E-5 status | Likely fix surface |
|-----|-------|--------------|-------------------|
| **`consolidation_summary` body (V-03)** | GAM | Fail | Stronger GAM-WB mandatory realisation + DLA `required_materials` entry for closure activity |
| **Worked example / `sample_output` (V-04)** | GAM / DLA | Fail | DLA-WB-08 spec on opening activity; GAM stepped example obligation |
| **Closure type family (V-01)** | GAM | Fail (3/4 families) | `checklist`, `retrieval_check`, or `consolidation_summary` authored |
| **R4 / R5 Present (V-10)** | Page | Fail | Follows GAM gaps |
| **Retrieval Present (R3)** | GAM | Partial | `checklist` / `self_check` not only `prompt_set` |
| **Workbook overall PASS** | Programme | Fail | Above closures + optional second AFTER run |

**Not residual:** AP-01–04, V-02, V-05–V-08 (except V-01 family count), V-07, V-12, V-13, teaching exposition (R1 Present).

---

## 8. Programme interpretation

Per [38D-5 §9](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md):

| Case | Pattern | 38-E fit |
|------|---------|----------|
| **A** | Workbook improves · Preservation holds | **Directionally yes** — large genre uplift |
| **B** | Workbook improves · Preservation regresses | **No** |
| **C** | Preservation holds · Workbook still FAIL | **Primary label** — V-03/V-04/V-10 block PASS |
| **D** | No meaningful change | **No** |

**Why Case C (not full Case A):** [38D-5](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) reserves Case **A** for hypothesis **confirmed** at programme success bar. 38-E met the **preserve + improve** half but not **Workbook PASS**. The correct programme reading is **Case C with strong partial uplift** — contracts work for genre mix and anti-patterns; **function-completion** (closure + modelling) needs a focused follow-on.

```text
V-13 PASS → V-02 PASS → V-10 FAIL → Case C
```

**Minimum success tier ([38D-5 §7](38D-5-inflation-before-after-evaluation.md)):** **Partially met** (AP-01 cleared, ≥2 families, preservation held; overall workbook still FAIL).

---

## 9. Recommendation

**Choice: B — Further workbook contract iteration**

| Option | Decision | Justification |
|--------|----------|---------------|
| **A. Stop** | Reject | Problem narrowed; evidence shows upstream contracts **do** move output |
| **B. Further workbook contract iteration** | **Accept** | Residual gaps are **specific genres** (consolidation, worked example, retrieval closure), not architecture or Design Page |
| **C. Renderer / experience work** | Defer | [38C-6 Candidate B](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-6-planning-synthesis-and-execution-recommendation.md): low impact until upstream bodies exist; AFTER already shows compose path works |
| **D. New investigation** | Reject | Root cause identified; no need to reopen stripping/preservation thesis |

**Preservation:** Keep **38-B `LD-*` modules out of scope** for the successor sprint unless V-13 regresses on a future AFTER run.

**Do not:** Conflate preservation PASS with workbook PASS; overwrite EV-01 BEFORE fixtures.

---

## 10. Proposed next sprint

### Sprint 38-F — Workbook Function Completion

| Field | Content |
|-------|---------|
| **Mission** | Close residual **V-03, V-04, V-01 (4th family), V-10 (R4/R5)** on self-study workbook briefs via **pack-only** DLA/GAM tightening |
| **Focus** | `consolidation_summary`; `worked_example` / `sample_output`; `checklist` / `retrieval_check`; explicit closure activity in DLA spec |
| **Validation** | Re-run Inflation AFTER (`EV-38F-AFTER-*`); score against [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) and [38D-5 §6](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md); target **Workbook PASS** + **Preservation PASS** |
| **Out of scope** | Renderer redesign; `app.js` unless audit proves gate failure; 38-B preservation architecture reopen |
| **Comparator** | EV-01 BEFORE (frozen); `CW-REF-38D3`; optional `EV-38E5-AFTER` as mid-point |

**Charter trigger:** 38-E Case C — contracts effective for mix, insufficient for mandatory functions.

---

## 11. Executive summary

**For stakeholders**

Sprint **38-E** implemented the workbook authoring contracts defined in Sprint **38-D** directly into the learning-design prompt pack (activity design and materials generation steps), without changing application code or the preservation modules that keep tables and materials faithful from generation through the learner page.

**What was attempted**

Prove that a self-study inflation workbook brief could move from a **table-only activity sheet** (frozen baseline EV-01) to a **full workbook** while keeping existing table and copy preservation guarantees.

**What improved**

On a post-contract Inflation run, the system produced **seven material types across three genre families** (including teaching text, a household scenario, task cards, and reflection prompts), cleared **all four** known anti-patterns from the baseline, and fixed session duration to about **65 minutes**. **Preservation passed** — tables and narratives copied correctly to the learner page.

**What remains**

The run still **failed the workbook bar**: no dedicated consolidation summary, no worked example, and insufficient closure/retrieval genres for a full pass against the validation model. The sprint hypothesis is **partially supported** — contracts change what the model authors; they are **not yet strong enough** for a complete pass.

**Recommendation**

Proceed with **Sprint 38-F — Workbook Function Completion**: tighten pack obligations for consolidation, worked examples, and retrieval/closure; re-evaluate on the same Inflation anchor; keep preservation architecture unchanged. Defer renderer and page-composition redesign until upstream content consistently passes the workbook gate.

| Verdict | Result |
|---------|--------|
| **Workbook** | **FAIL** (material uplift) |
| **Preservation** | **PASS** |
| **Sprint 38-E** | **COMPLETE** (implementation done; primary PASS bar not met) |
| **Next** | **38-F** (option B) |

---

## 12. Closure statement

| Criterion | Met? |
|-----------|------|
| Clear judgement on hypothesis | **Yes** — **Partially supported** |
| Clear interpretation of Case C | **Yes** — primary case; uplift toward A |
| Explicit recommendation for next sprint | **Yes** — **38-F Workbook Function Completion** |
| Separate workbook and preservation conclusions | **Yes** — §4, §5, §11 |
| Stakeholder-readable executive summary | **Yes** — §11 |
| All phases 38E-1 … 38E-6 documented | **Yes** |
| EV-01 BEFORE preserved | **Yes** |
| Sprint 38-E status | **COMPLETE** |

**Sprint 38-E — Workbook Contract Implementation:** **CLOSED** — 2026-06-04.

**Programme exit:** **Partial success** on primary bar; **full success** on implementation and preservation objectives. Charter **38-F** recommended for workbook PASS completion.
