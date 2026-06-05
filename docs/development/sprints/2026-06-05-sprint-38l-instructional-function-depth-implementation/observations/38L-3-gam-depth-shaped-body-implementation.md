# Slice 38L-3 — GAM depth-shaped body implementation

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Pack §6 implementation — GAM realisation only  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38L-3  
**Predecessor:** [38L-2 DLA depth-floor implementation](38L-2-dla-depth-floor-implementation.md)  
**Design authority:** [38J-4 GAM preservation](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-4-gam-implementation.md) · [38K-2](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-2-function-depth-model.md) · [38K-4](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-4-target-state-depth-examples.md)

---

## Section 1 — Implementation summary

Pack §6 **Generate Activity Materials** now realises **function-shaped bodies** when DLA specifies `depth_floor L3` and closure Material rows from 38L-2. GAM remains realisation-only — no second planning system.

| Area | Implementation |
|------|----------------|
| **GAM-PRES-08** | R2/R3 — purpose keyword → body templates (V1/A1/E1/E2/T1/G1); DEPTH-FAIL |
| **GAM-PRES-09** | R1/R5/R6 anti-depth-collapse — DEPTH-COLLAPSE-01..05; contract FAIL **(F9)** |
| **GAM-PRES-02** | Extended collapse patterns (b)(d) for checklist/transfer/template absorption |
| **Material guidance** | Checklist, transfer_prompt, modelling_note analytic pass strengthened |
| **GAM-WB-26..30** | Mirror DLA-WB-26..30 at realisation layer |
| **Fail rules** | **(F9)** added; anti-patterns footer F1–**F9** |
| **Tests** | Seven new assertions; fail-rule tests updated F8→F9 range |

**What did not change**

- §5 DLA (IFP-09/10, DLA-WB-26..30 preserved)
- JSON schema, ACM, renderer, `app.js`, workflow
- GAM-PRES-00..07 core (extended, not weakened)
- GAM-WB-01..25 regression guards

**Deferred to 38L-4**

- **R7** Evaluate LO/harness household alignment

---

## Section 2 — Exact locations modified

**File:** `domains/learning-design/domain-learning-design-step-patterns.md` — **§6 only**

| Location | Change |
|----------|--------|
| `promptTemplate` · GAM-PRES-02 | Extended (b)(d) — checklist/transfer/template absorption; DEPTH-COLLAPSE |
| `promptTemplate` · **GAM-PRES-08** (new) | Depth-shaped body rules R2/R3 |
| `promptTemplate` · **GAM-PRES-09** (new) | Anti-depth-collapse R1/R5/R6; F9 |
| `promptTemplate` · Material-type guidance | checklist, transfer_prompt, modelling_note analytic pass |
| `promptTemplate` · **GAM-WB-26..30** (new) | Realisation mirrors for 38L-2 DLA rows |
| `promptTemplate` · GAM-WB-38E-9 FAIL list | **(F9)** DEPTH-COLLAPSE |
| `promptTemplate` · Anti-patterns footer | F1–F8 → F1–**F9** |
| `defaultPromptNotes` | 38L-3 suffix; F1–**F9** fail rules |

**Tests:** `tests/workbook-contract-prompt-surface.test.js`

---

## Section 3 — Rationale

### Why GAM-PRES-08 (R3 + R2 realisation)

[38J-5 §7](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md): GAM-PRES preserved DLA order but **verification Level 0**, **transfer absent**, **analytic pass absent** — bodies were thin or wrong genre. [38L-2](38L-2-dla-depth-floor-implementation.md) now plans rows; §6 must map **purpose + depth_floor L3** → substantive body shapes per [38K-2 §1](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-2-function-depth-model.md).

### Why GAM-PRES-09 + F9 (R1/R5/R6 anti-collapse)

Observed 38J failure modes: `prompt_set` substituted for checklist on A3; cognition-only transfer; consolidation as Evaluate capstone. DEPTH-COLLAPSE-01..05 forbid reflection-only verification, consolidation-only transfer, prompt-set-only analytic pass, discussion-only independent judgement, and merging closure Materials.

### Why GAM-WB-26..30

Regression-testable anchors pairing DLA planning (38L-2) to GAM realisation — same pattern as GAM-WB-22..25 mirroring DLA-WB-22..25 ([38J-4](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-4-gam-implementation.md)).

---

## Section 4 — Mapping to R1–R7

| ID | Goal | 38L-3 implementation | Status |
|----|------|----------------------|--------|
| **R1** | Universal verification | GAM-PRES-08 V1; GAM-WB-26; checklist material guidance; DEPTH-COLLAPSE-01; F9 | **Complete** |
| **R2** | Level 3 depth floors | GAM-PRES-08 honours `depth_floor L3`; GAM-WB-30; DEPTH-FAIL | **Complete** |
| **R3** | Function-shaped GAM bodies | GAM-PRES-08 purpose→template map (V1/A1/E1/E2/T1/G1) | **Complete** |
| **R4** | Closure emission gates | Realises rows DLA emits — no replanning | **Supported** (planned in 38L-2) |
| **R5** | Evaluate completion | GAM-PRES-08 E1/E2/T1; GAM-WB-28; GAM-PRES-06 preserved | **Complete** |
| **R6** | Analyse worked analytic pass | GAM-PRES-08 A1; GAM-WB-27; modelling_note guidance; DEPTH-COLLAPSE-03 | **Complete** |
| **R7** | Evaluate LO/harness | — | **Deferred 38L-4** |

---

## Section 5 — GAM-PRES-08 body templates

When DLA `specification` includes `depth_floor L3` or purpose names the function:

| Code | Function | Minimum body shape |
|------|----------|-------------------|
| **V1** | Verification | ≥4 pass-fail/keyed checks + repair-if-fail — NOT reflective question only |
| **A1** | Worked analytic pass | fact → lens → reasoning → draft cell → conclusion (≥120 words) |
| **E1** | Independent judgement | Memo scaffold sections + starters + word band — learner-empty |
| **E2** | Evaluate verification | Rubric self-audit ≥4 criteria-linked checkpoints |
| **T1** | Transfer | ≥80 words; ≥2 own-context prompts — NOT consolidation-only |
| **G1** | Guided judgement/analysis | ≥1 exemplar row or scoring guide + empty learner rows |

**DEPTH-FAIL:** L3 spec with specification restatement only.

---

## Section 6 — GAM-PRES-09 anti-collapse

| ID | Forbidden substitution |
|----|------------------------|
| DEPTH-COLLAPSE-01 | verification → reflection_prompt / open question only |
| DEPTH-COLLAPSE-02 | transfer_prompt → consolidation reflection only |
| DEPTH-COLLAPSE-03 | worked analytic pass → prompt_set without walkthrough |
| DEPTH-COLLAPSE-04 | independent judgement → discussion prompt_set without memo structure |
| DEPTH-COLLAPSE-05 | merging checklist+template+transfer_prompt into consolidation_summary |

Triggers **(F9)** contract FAIL.

---

## Section 7 — Tests added/updated

| Test | Asserts |
|------|---------|
| `pack §6 38L-3: GAM-PRES-08/09` | Depth-shaped bodies; DEPTH-COLLAPSE; no IFP in §6 |
| `pack §6 38L-3: verification realisation (R1)` | GAM-WB-26; repair path; not reflection-only |
| `pack §6 38L-3: Analyse worked analytic pass (R6)` | GAM-WB-27; analytical lens; DEPTH-COLLAPSE-03 |
| `pack §6 38L-3: Evaluate completion (R5)` | GAM-WB-28; transfer; consolidation must not absorb |
| `pack §6 38L-3: GAM-WB-29/30 and F9` | F9 fail rule; F1–F9 footer |
| `pack §6 38L-3: defaultPromptNotes` | 38L-3 suffix |
| `pack §5 unchanged after 38L-3` | IFP-09/DLA-WB-26 in §5 only |

**Updated (F9 extension):**

- `pack §6 38J-4: function-order` — F1–F9 range
- `pack §6 38F-2: defaultPromptNotes` — F1–F9
- `pack §6 38J-4: defaultPromptNotes` — F1–F9

**Run:** `node --test tests/workbook-contract-prompt-surface.test.js` — **36/36 pass** (29 prior + 7 new)

---

## Section 8 — Implementation notes

1. **DLA-first preserved:** GAM-PRES-00 unchanged; no IFP/archetype logic in §6.  
2. **Extends 38J-4:** GAM-PRES-06 Evaluate depths retained; GAM-PRES-08 adds L3-shaped templates for all closure functions.  
3. **F9 is additive:** F8 (row merge collapse) unchanged; F9 covers depth-genre collapse.  
4. **Pairing with 38L-2:** GAM-WB-26..30 numerically mirrors DLA-WB-26..30 for traceability.  
5. **Proof pending:** Behaviour change validated at prompt-surface; `EV-38L-AFTER` proof run is 38L-5.

---

## Section 9 — Deviations

| Item | Notes |
|------|-------|
| **R7** | Deferred to 38L-4 per charter |
| **F9 new fail rule** | Planned extension — not regression break; tests updated |
| **GAM-PRES numbering** | 08/09 new blocks rather than merging into 03/07 | Clearer 38L boundary vs 38J |
| **No artefact patch files** | Inline pack edit only | Same as 38L-2 |

**No unplanned deviations.**

---

## Section 10 — Success criterion verification

| Criterion | Met? | Evidence |
|-----------|:----:|----------|
| Real verification artefacts when DLA specifies checklist | **Yes** | GAM-PRES-08 V1; GAM-WB-26; not reflection-only |
| Real transfer artefacts | **Yes** | GAM-PRES-08 T1; transfer_prompt guidance; DEPTH-COLLAPSE-02 |
| Real worked analytic passes | **Yes** | GAM-PRES-08 A1; GAM-WB-27; DEPTH-COLLAPSE-03 |
| Real Evaluate completion artefacts | **Yes** | GAM-PRES-08 E1/E2; GAM-WB-28; DEPTH-COLLAPSE-05 |
| DLA-first architecture preserved | **Yes** | GAM-PRES-00; no IFP in §6; §5 unchanged test |
| §5 unchanged | **Yes** | `pack §5 unchanged after 38L-3` |

**38L-3 success criterion met.** Next: **38L-4** — closure-function integration + R7 harness.

---

## References

- [38L-2](38L-2-dla-depth-floor-implementation.md) · [38J-4](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-4-gam-implementation.md)  
- [38K-4 E1–E4](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-4-target-state-depth-examples.md)

---

**Parent:** [38L observations index](README.md) · **Sprint:** 38-L · **Next:** **38L-4** Closure-function implementation
