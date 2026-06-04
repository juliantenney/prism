# Sprint 38-E — Implementation charter (Workbook Contract Implementation)

**Date:** 2026-06-04  
**Status:** **CLOSED** (2026-06-04) — [38E-11](observations/38E-11-final-evaluation-and-sprint-closure.md) final closure  
**Predecessor:** [Sprint 38-D](../2026-06-04-sprint-38d-workbook-authoring-contracts/) (**CLOSED** — planning)  
**Successor:** [Sprint 38-F — Workbook Contract Refinement](../2026-06-04-sprint-38f-workbook-contract-refinement/) (**CLOSED** — [38F-5](../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-5-final-evaluation-and-sprint-closure.md))

---

## Mission

**Operationalise** Sprint **38-D** workbook authoring contracts in learning-design **prompts/contracts** so self-directed learner workbook briefs produce **multi-genre** workbook material rather than table-only activity sheets or reference notes.

**Primary success condition:**

> **Workbook PASS** + **Preservation PASS** (reported separately)

**Primary hypothesis:**

> If DLA workbook obligations and GAM workbook genre obligations are added to the relevant learning-design prompts/contracts, then an Inflation self-study learner run will move from **EV-01 FAIL** to **workbook PASS** without regressing Design Page preservation or B4 table fidelity.

---

## Preconditions (assumed true)

**Sprint 38-B:**

- Clarified step ownership and canonical LD modules
- Design Page compose contract and materials preservation
- B4 table fidelity **MONITORING** with passing Inflation gate evidence
- Four-step prompt sum reduced; test suite green at charter time

**Sprint 38-C:**

- Workbook pedagogy model, gap analysis, DLA/GAM planning requirements, learner experience target (**CLOSED**)

**Sprint 38-D:**

- [38D-1](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-1-dla-workbook-contract.md) DLA-WB-01 … 19
- [38D-2](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md) GAM-WB-* · AP-01 invalid
- [38D-3](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-3-canonical-workbook-fixture.md) `CW-REF-38D3`
- [38D-4](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) V-01 … V-13
- [38D-5](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) BEFORE frozen; scorecard ready

---

## Programme question

> Can we implement 38-D contracts in the live pipeline and prove workbook uplift on the Inflation anchor while holding 38-B preservation?

---

## Non-goals

| Non-goal | Notes |
|----------|--------|
| Renderer redesign | Deferred |
| Learner page UX redesign | Out of charter |
| Broad runtime refactor | Out of charter |
| Prompt-size reduction | 38-B complete |
| Reopening 38-B preservation architecture | Use existing `LD-*` modules; V-13 regression only |
| Sprint 39 reasoning cues | Separate programme |
| Composition-first / 38-F | After upstream multi-genre GAM exists |
| `app.js` changes | Unless 38E-1 proves required **and** charter amended with rationale |

---

## Implementation permissions by phase

| Phase | Code / prompt changes | Notes |
|-------|----------------------|--------|
| **38E-1** | **None** | Audit only — **COMPLETE** [38E-1](observations/38E-1-implementation-target-audit.md) |
| **38E-2** | **DLA-related prompt/contract files only** | After 38E-1 file list; no GAM edits |
| **38E-3** | **GAM-related prompt/contract files only** | After 38E-1 file list; no DLA edits |
| **38E-4** | **Tests/checks** only if tied to [38D-4](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) | No unrelated CI |
| **38E-5** | **Artefacts** under sprint `artefacts/` | AFTER captures; scorecard in observation |
| **38E-6** | Docs only | Remaining workbook function gap analysis — **COMPLETE** |
| **38E-7** | Docs only | Sprint closure — **COMPLETE** |
| **`app.js`** | **Forbidden** unless 38E-1 documents need + charter amendment | Default: pack/prompt only |

---

## Phases

### 38E-1 — Implementation target audit

| Field | Content |
|-------|---------|
| **Purpose** | Map [38D-1](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-1-dla-workbook-contract.md) and [38D-2](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md) clauses to **exact** repo files (pack paths, domain modules, step prompts); confirm whether `app.js` is required |
| **Planned deliverable** | [observations/38E-1-implementation-target-audit.md](observations/38E-1-implementation-target-audit.md) |
| **Inputs from 38-D** | 38D-1 clause index; 38D-2 GAM-WB / AP-01; 38D-3 fixture scope; 38-B `LD-*` module inventory (read-only) |
| **Implementation permission** | **Audit only** — no code/prompt changes |
| **Success criteria** | File-level implementation map; DLA vs GAM edit boundaries; risk notes (prompt size, overlap); explicit `app.js` yes/no with evidence |
| **Non-goals** | Prompt edits; live pipeline run; test changes |
| **Status** | **COMPLETE** (2026-06-04) — `app.js` **NO**; pack §5 / §6 primary targets |

---

### 38E-2 — DLA workbook contract implementation

| Field | Content |
|-------|---------|
| **Purpose** | Enact DLA-WB-01 … 19 in identified DLA prompt/contract surfaces for `self_directed` + `page_profile: learner` workbook briefs |
| **Planned deliverable** | [observations/38E-2-dla-contract-implementation.md](observations/38E-2-dla-contract-implementation.md) + DLA file diffs |
| **Inputs from 38-D** | [38D-1](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-1-dla-workbook-contract.md); [38D-3 DLA outline](../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/canonical-workbook-dla-outline.md); 38C-3 (authority) |
| **Implementation permission** | **DLA-related prompt/contract files only** (per 38E-1 list) |
| **Success criteria** | Reviewer can trace each mandatory DLA-WB clause to a prompt/contract location; no GAM files modified in this slice |
| **Non-goals** | GAM prose; Design Page compose; `app.js`; Inflation AFTER run |

**Depends on:** 38E-1  
**Status:** **COMPLETE** (2026-06-04) — [38E-2](observations/38E-2-dla-contract-implementation.md)

---

### 38E-3 — GAM workbook genre contract implementation

| Field | Content |
|-------|---------|
| **Purpose** | Enact GAM-WB-* and anti-patterns (AP-01 table-only invalid, etc.) in identified GAM prompt/contract surfaces |
| **Planned deliverable** | [observations/38E-3-gam-contract-implementation.md](observations/38E-3-gam-contract-implementation.md) + GAM file diffs |
| **Inputs from 38-D** | [38D-2](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md); [38D-3 GAM expectations](../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/canonical-workbook-gam-expectations.md); DLA→GAM matrix in 38D-2 |
| **Implementation permission** | **GAM-related prompt/contract files only** (per 38E-1 list) |
| **Success criteria** | Table-only workbook explicitly contract-FAIL in GAM prompts; genre obligations tied to DLA `required_materials`; no DLA files modified in this slice |
| **Non-goals** | DLA activity design changes beyond handoff from 38E-2; renderer; reopening `LD-MATERIALS-COPY` architecture |

**Depends on:** 38E-1, 38E-2 (DLA types must exist for GAM to realise)  
**Status:** **COMPLETE** (2026-06-04) — [38E-3](observations/38E-3-gam-contract-implementation.md)

---

### 38E-4 — Contract regression and fixture check

| Field | Content |
|-------|---------|
| **Purpose** | Verify implemented contracts against [38D-4](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) and `CW-REF-38D3` shape; add/update tests only where directly tied to V-01 … V-13 |
| **Planned deliverable** | [observations/38E-4-contract-regression-fixture-check.md](observations/38E-4-contract-regression-fixture-check.md) |
| **Inputs from 38-D** | 38D-4 layers V1–V4; [38D-3](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-3-canonical-workbook-fixture.md); [38D fixtures](../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/); 38-B B4 gate (V-13) |
| **Implementation permission** | **Tests/checks** only if tied to 38D-4; optional sprint-local fixture links |
| **Success criteria** | Regression checklist complete; V-13 preservation monitor defined; ready for 38E-5 pipeline |
| **Non-goals** | Live Inflation run (38E-5); broad test suite refactor; 38-B fixture rewrites |

**Depends on:** 38E-2, 38E-3  
**Status:** **COMPLETE** (2026-06-04) — [38E-4](observations/38E-4-contract-regression-fixture-check.md) — **READY** for 38E-5

---

### 38E-5 — Inflation AFTER run and scorecard

| Field | Content |
|-------|---------|
| **Purpose** | Run post-contract Inflation self-study learner pipeline; fill [38D-5 §6](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) AFTER column; apply §7 tiers and §9 Cases A–D |
| **Planned deliverable** | [observations/38E-5-inflation-after-scorecard.md](observations/38E-5-inflation-after-scorecard.md) + captures in [artefacts/](artefacts/) |
| **Inputs from 38-D** | 38D-5 BEFORE (`NEG-EV-01`); 38D-4 scorecard; `CW-REF-38D3`; EV-03 comparator |
| **Implementation permission** | **Artefacts** under sprint `artefacts/`; observation doc; no scope expansion beyond audit-approved files |
| **Success criteria** | Dual verdict recorded: **Workbook** PASS/FAIL · **Preservation** PASS/FAIL; BEFORE vs AFTER table complete; minimum success per 38D-5 §7 assessed |
| **Non-goals** | Renderer UX as success dependency; overwriting 38-B EV-01 fixtures; composition-first changes |

**Depends on:** 38E-2, 38E-3, 38E-4  
**Status:** **COMPLETE** (2026-06-04) — [38E-5](observations/38E-5-inflation-after-scorecard.md) — Workbook **FAIL**, Preservation **PASS**, Case **C**

---

### 38E-6 — Remaining workbook function gap analysis

| Field | Content |
|-------|---------|
| **Purpose** | Trace why Workbook FAIL remains after 38E-2/38E-3 using AFTER artefacts only |
| **Planned deliverable** | [observations/38E-6-remaining-workbook-function-gap-analysis.md](observations/38E-6-remaining-workbook-function-gap-analysis.md) |
| **Inputs** | [38E-5](observations/38E-5-inflation-after-scorecard.md); `EV-38E5-AFTER-*`; [38D-1 … 38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/) |
| **Implementation permission** | **Docs only** — no code/prompt changes |
| **Success criteria** | Worked-example and consolidation failure paths traced; smallest fix identified |
| **Non-goals** | Implementation; pipeline re-run |

**Depends on:** 38E-5  
**Status:** **COMPLETE** (2026-06-04) — [38E-6](observations/38E-6-remaining-workbook-function-gap-analysis.md) — recommend **strengthen both** DLA+GAM (prompt-only)

---

### 38E-7 — Sprint closure and next-step recommendation

| Field | Content |
|-------|---------|
| **Purpose** | Close sprint; document outcome vs hypothesis; recommend programme continuation |
| **Planned deliverable** | [observations/38E-7-sprint-closure.md](observations/38E-7-sprint-closure.md) |
| **Inputs from 38-D** | 38D-5 Cases A–D; full 38E-1 … 38E-6 trail |
| **Implementation permission** | **Docs only** |
| **Success criteria** | Explicit sprint exit; preserved 38-B statement; next step named |
| **Non-goals** | New implementation in closure slice |

**Depends on:** 38E-5, 38E-6  
**Status:** **COMPLETE** (2026-06-04) — [38E-7](observations/38E-7-sprint-closure.md)

---

## Sprint exit summary (38E-11 — authoritative)

| Outcome | Result |
|---------|--------|
| Contracts enacted | **Yes** (38E-2 + 38E-3 + 38E-8 + 38E-9) |
| Inflation evaluated | **Yes** (38E-5 + 38E-10) |
| Residual gaps traced | **Yes** ([38E-6](observations/38E-6-remaining-workbook-function-gap-analysis.md)); 38E-8/9 addressed; **V-01/V-05** remain |
| **Preservation** | **PASS** (EV-01, 38E5, 38E10) |
| **Workbook** | **FAIL** (38E10: V-03/V-04/V-10 Pass; V-01/V-05 Fail) |
| Hypothesis | **Partially supported** |
| Case (final) | **A** at 38E10 (was **C** at 38E5) |
| Next programme | **Sprint 38-F** — pack refinement for V-01 + V-05 |

Historical mid-closure: [38E-7](observations/38E-7-sprint-closure.md) (post-38E-5 only). Full trail: [38E-11](observations/38E-11-final-evaluation-and-sprint-closure.md).

### Phases 38E-8 … 38E-11 (continuation)

| Phase | Status |
|-------|--------|
| **38E-8** DLA function strengthening | **COMPLETE** — [38E-8](observations/38E-8-dla-workbook-function-strengthening.md) |
| **38E-9** GAM function enforcement | **COMPLETE** — [38E-9](observations/38E-9-gam-workbook-function-enforcement.md) |
| **38E-10** Inflation re-run | **COMPLETE** — [38E-10](observations/38E-10-inflation-rerun-scorecard.md) · `EV-38E10-AFTER-*` |
| **38E-11** Final evaluation and closure | **COMPLETE** — [38E-11](observations/38E-11-final-evaluation-and-sprint-closure.md) |

---

## Phase dependency graph

```text
38E-1 → 38E-2 → 38E-3 → 38E-4 → 38E-5 → 38E-6 → 38E-7 (historical)
    → 38E-8 (DLA strengthen) → 38E-9 (GAM enforce) → 38E-10 (re-run) → 38E-11 (final closure)
```

**Parallelism rule:** 38E-2 and 38E-3 are **sequential** (DLA before GAM), not parallel.

---

## Success criteria (sprint exit)

| Criterion | Measure |
|-----------|---------|
| Contracts enacted | 38E-2 + 38E-3 map to 38D-1 + 38D-2 |
| Regression checked | 38E-4 against 38D-4 + V-13 |
| Inflation evaluated | 38E-5 fills 38D-5 §6 AFTER column |
| Primary success | **Workbook PASS** + **Preservation PASS** on AFTER run |
| 38-D traceability | Each 38E slice cites 38D inputs |
| 38-B protected | No preservation regression; B4 gate holds |
| EV-01 preserved | BEFORE column unchanged; new artefacts only under 38-E |

**Partial success:** Document per [38D-5 §7](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) (minimum / strong / exceptional) with dual verdicts.

---

## Boundaries with 38-D

| 38-D owns (closed) | 38-E owns |
|------------------|-----------|
| Contract **specification** (DLA-WB, GAM-WB, validation, evaluation **plan**) | Contract **implementation** in packs |
| `CW-REF-38D3` planning fixture | AFTER artefacts + scorecard |
| Frozen EV-01 BEFORE | Post-contract AFTER run |

**Do not redefine** 38D-1 … 38D-5 clauses — **implement and evidence**.

---

## Boundaries with 38-C

| 38-C owns | 38-E uses |
|-----------|-----------|
| Pedagogy model (38C-1), gap analysis (38C-2) | PASS/FAIL bar only |
| Planning requirements (38C-3/4) | Already operationalised in 38-D |

**Do not reopen** 38C-6 candidate ranking except to cite authority.

---

## Boundaries with 38-B

| 38-B owns | 38-E owns |
|-----------|-----------|
| Prompt size, module dedupe, B4 pipe fidelity | Workbook **genre** obligations in DLA/GAM steps |
| `LD-MATERIALS-COPY`, `LD-TABLE-FIDELITY`, compose contract | **Reference** preserve modules; V-13 regression monitor |
| EV-01 fixtures (frozen BEFORE) | New AFTER captures in 38-E `artefacts/` |

**Do not reopen** 38-B architecture unless 38E-5 proves specific regression — then document justification before any fix.

---

## Inherited evidence (38-D summary)

| Slice | Role |
|-------|------|
| **38D-1** | Executable DLA contract — `required_materials`, session economics, consolidation, solo feasibility |
| **38D-2** | Executable GAM contract — 16 genres, AP-01 table-only **invalid**, DLA→GAM matrix |
| **38D-3** | `CW-REF-38D3` canonical PASS shape; negative `NEG-EV-01` index |
| **38D-4** | V1–V4 validation layers; **V-01 … V-13**; workbook ≠ preservation |
| **38D-5** | EV-01 frozen BEFORE; §6 scorecard; §7 tiers; §9 Cases A–D |

---

## References

- [README.md](README.md)
- [HANDOVER.md](HANDOVER.md)
- [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md)
- [38D HANDOVER](../2026-06-04-sprint-38d-workbook-authoring-contracts/HANDOVER.md)
