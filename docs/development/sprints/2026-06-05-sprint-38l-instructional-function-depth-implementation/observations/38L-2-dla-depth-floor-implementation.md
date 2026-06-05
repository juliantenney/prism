# Slice 38L-2 — DLA depth-floor implementation

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Pack §5 implementation — DLA planning obligations only  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38L-2  
**Planning authority:** [38L-1](38L-1-implementation-planning-review.md)  
**Design authority:** [38K-2](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-2-function-depth-model.md) · [38K-3](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-3-archetype-specific-depth-rules.md) · [38K-5](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-5-implementation-implications.md)

---

## Section 1 — Implementation summary

Pack §5 **Design Learning Activities** now requires **Level 3 depth-floor specifications** and **closure emission gates** before JSON emission. Implementation extends 38J IFP without weakening IFP-00..08.

| Area | Implementation |
|------|----------------|
| **IFP-00 sequence** | Steps F2 (IFP-09) and G (IFP-10) inserted; emit moved to step J |
| **IFP-09 depth floors** | R2 — L3 content obligations per Required function; 38K-2 five-dimension sufficiency test |
| **IFP-10 emission gates** | R4 + R1/R5/R6 planning — mandatory Material rows; EMIT-FAIL-01..04 |
| **DLA-WB-26** | R1 — universal verification `checklist` on every activity |
| **DLA-WB-27** | R6 — Analyse worked analytic pass before `analysis_table` |
| **DLA-WB-28** | R5 — Evaluate completion pack (template, checklist, transfer_prompt) |
| **DLA-WB-29** | R4 — anti-emission patterns |
| **DLA-WB-30** | R2 — depth spec discipline (`depth_floor: L3` in specifications) |
| **DLA-WB-22** | Extended with 38L-2 Evaluate closure rows + EV-CAP-03 |
| **Type enum** | `transfer_prompt` added to `required_materials` allowed types |
| **Tests** | Six new assertions in `tests/workbook-contract-prompt-surface.test.js` |

**What did not change**

- §6 GAM (`promptTemplate`, `defaultPromptNotes`)
- JSON output schema (no new DLA fields)
- Renderer, ACM, `app.js`, workflow steps
- IFP-01..07 core logic (extended only)
- DLA-WB-01..25 regression guards

**Deferred to 38L-4**

- **R7** Evaluate LO/harness household alignment — harness contract, not DLA-only

---

## Section 2 — Exact locations modified

**File:** `domains/learning-design/domain-learning-design-step-patterns.md`

| Location | Field | Change |
|----------|-------|--------|
| §5 · `### Prompt Factory` · `promptTemplate` | IFP-00 SEQUENCE | Steps F2, G, J; reordered gates |
| §5 · `promptTemplate` | IFP-08 | References IFP-09/10; emit after A–J |
| §5 · `promptTemplate` | **IFP-09** (new) | Depth-floor L3 obligations (R2) |
| §5 · `promptTemplate` | **IFP-10** (new) | Closure emission gates (R4, R1/R5/R6 planning) |
| §5 · `promptTemplate` | DLA-WB-22 | 38L-2 Evaluate closure rows + EV-CAP-03 |
| §5 · `promptTemplate` | **DLA-WB-26..30** (new) | Workbook depth + emission obligations |
| §5 · `promptTemplate` | `required_materials` type list | Added `transfer_prompt` |
| §5 · `defaultPromptNotes` | 38L-2 suffix | IFP-09/10 + DLA-WB-26..30 reinforcement |

**Tests:** `tests/workbook-contract-prompt-surface.test.js` — 38L-2 block (6 tests)

---

## Section 3 — Rationale

### Why IFP-09 (R2)

[38K-1](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-1-baseline-depth-analysis.md) found ~65–70% of remaining gap is **thin population** — functions emitted but below Level 3. [38J-5 §8](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md) showed GAM preserves DLA specs; A2 reaches Level 4 when depth is specified. IFP-09 encodes **content obligations in `specification` prose** per [38K-5 §7](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-5-implementation-implications.md) without new JSON fields.

### Why IFP-10 + DLA-WB-26..29 (R4, R1, R5, R6 planning)

[38K-1 §6](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-1-baseline-depth-analysis.md) structural gaps G-06, G-09, G-11, G-14–G-17: verification, transfer, independent judgement, and worked analytic pass **absent as Material rows**. Cognition fields alone (`transfer_or_application_task`) did not produce learner-facing sections on `EV-38J-AFTER`. Emission gates mandate rows before GAM can realise bodies in 38L-3.

### Why DLA-WB-26 universal verification (R1)

Verification Level 0 on all four activities was the highest cross-archetype leverage item ([38K-3 §7](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-3-archetype-specific-depth-rules.md)). A3 checklist regression vs 38G ([38J-5 §4](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)) shows optional verification is dropped when not mandated.

### Why DLA-WB-27 (R6)

Analyse archetype: worked analytic pass structurally absent on A3; scenario + inquiry adequate but matrix empty ([38K-1 §4](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-1-baseline-depth-analysis.md)). [38K-4 E3](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-4-target-state-depth-examples.md) demonstrates teaching upgrade from worked pass.

### Why DLA-WB-28 (R5)

Evaluate: 3/10 Required functions at floor on `EV-38J-AFTER` ([38K-3 §6](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-3-archetype-specific-depth-rules.md)); independent judgement, verification, transfer at Level 0. EV-CAP-03 closes consolidation-as-capstone anti-pattern.

---

## Section 4 — Mapping to R1–R7

| ID | Goal | 38L-2 implementation | Phase |
|----|------|----------------------|-------|
| **R1** | Universal verification | IFP-10 G1; DLA-WB-26; EMIT-FAIL-04 | **Planning complete** — bodies in 38L-3 |
| **R2** | Level 3 depth floors | IFP-09; DLA-WB-30 | **Complete** |
| **R3** | Function-shaped GAM bodies | — | **38L-3** (§6) |
| **R4** | Closure emission gates | IFP-10; DLA-WB-29; EMIT-FAIL-01..04 | **Complete** |
| **R5** | Evaluate completion pack | IFP-10 G3/G5; DLA-WB-28; DLA-WB-22 extension; EV-CAP-03 | **Planning complete** — bodies in 38L-3 |
| **R6** | Analyse worked analytic pass | IFP-10 G4/G5; DLA-WB-27 | **Planning complete** — bodies in 38L-3 |
| **R7** | Evaluate LO/harness alignment | — | **Deferred 38L-4** |

---

## Section 5 — IFP block detail

### IFP-09 — Depth floors (R2)

For every **R** function in `function_sequence`, `specification` must include:

- `depth_floor: L3` clause  
- Content obligations per function type (verification ≥4 checks + repair; analytic pass walkthrough; guided table exemplar row; memo scaffold + word band; transfer own-context; criteria ≥3 dimensions; weak/strong judgement)  
- **Present ≠ sufficient** rule

Authority: [38K-2 §1](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-2-function-depth-model.md) sufficiency test · [38K-3](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-3-archetype-specific-depth-rules.md) archetype floors

### IFP-10 — Closure emission gates (R4 + planning)

| Gate | Trigger | Required row |
|------|---------|----------------|
| **G1** | Verification R | `checklist` — every activity |
| **G2** | Transfer R (Evaluate) / Transfer in plan | `transfer_prompt` |
| **G3** | Independent judgement R (Evaluate) | `template` or `task_cards` — separate from `consolidation_summary` |
| **G4** | Worked analytic pass R (Analyse) | `worked_example` or `modelling_note` before `analysis_table` |
| **G5** | Guided judgement/analysis R | Table spec with ≥1 exemplar row or hint column |

**EMIT-FAIL-01..04** — replan before JSON emit (parallel to AS-FAIL).

### DLA-WB-26..30 summary

| Row | Obligation |
|-----|------------|
| **26** | Every activity → `checklist` verification L3 |
| **27** | Analyse → worked analytic pass before matrix |
| **28** | Evaluate → template + checklist + transfer_prompt; EV-CAP-03 |
| **29** | Anti-emission forbids |
| **30** | All R-function specs → depth_floor L3 + named purpose |

---

## Section 6 — Tests added/updated

**File:** `tests/workbook-contract-prompt-surface.test.js`

| Test | Asserts |
|------|---------|
| `pack §5 38L-2: IFP-09 depth floors and IFP-10 emission gates` | IFP-09/10 present; EMIT-FAIL; sequence A–J |
| `pack §5 38L-2: universal verification and closure material rows` | DLA-WB-26/28; transfer_prompt; EV-CAP-03 |
| `pack §5 38L-2: Analyse worked analytic pass obligation` | DLA-WB-27; BEFORE analysis_table |
| `pack §5 38L-2: anti-emission and depth spec discipline` | DLA-WB-29/30 |
| `pack §5 38L-2: defaultPromptNotes reinforce depth + emission gates` | 38L-2 suffix |
| `pack §6 unchanged after 38L-2` | No IFP-09/DLA-WB-26 in §6 |

**Run:** `node --test tests/workbook-contract-prompt-surface.test.js` — **29/29 pass** (23 prior + 6 new)

---

## Section 7 — Implementation notes

1. **Upstream-first:** 38J proved GAM preserves DLA plans — 38L-2 fixes planning omissions before 38L-3 body rules.  
2. **`transfer_prompt` in DLA type list:** GAM §6 already recognises `transfer_prompt`; DLA §5 enum was missing it — added for R4 emission gate consistency (prompt contract extension, not schema change).  
3. **EV-CAP-03:** New cap on Evaluate — `expected_output` must name independent memo artefact; complements EV-CAP-01/02 from 38J.  
4. **IFP-05 AS-04 preserved:** Verification ≥4 checks in anti-shell; DLA-WB-26 makes row emission mandatory.  
5. **R7 intentionally omitted:** Household Evaluate LO contract requires harness alignment — scoped to 38L-4 per [38L-1 §2](../../observations/38L-1-implementation-planning-review.md).

---

## Section 8 — Deviations

| Item | Planned | Actual | Rationale |
|------|---------|--------|-----------|
| **R7 harness** | 38L-4 | Not in 38L-2 | Charter scope: DLA-side only; R7 needs harness + optional §5 inference |
| **Separate artefact file** | Optional (38J pattern) | Inline pack edit only | Single-file edit sufficient; no patch script required |
| **IFP numbering** | Extend IFP-08 | New IFP-09/10 blocks | Clearer separation of depth vs emission vs 38J planning blocks |
| **DLA-WB-22 merge** | New rows only | Extended DLA-WB-22 + DLA-WB-28 | Avoid duplicate Evaluate rules; 22 = archetype bar, 28 = completion pack detail |

**No unplanned deviations.**

---

## Section 9 — Success criterion verification

| Criterion | Met? | Evidence |
|-----------|:----:|----------|
| Verification obligations in DLA planning | **Yes** | IFP-10 G1; DLA-WB-26; EMIT-FAIL-04 |
| Closure obligations in DLA planning | **Yes** | IFP-10 G2–G5; DLA-WB-28/29 |
| Analyse worked-pass obligations | **Yes** | IFP-10 G4; DLA-WB-27 |
| Evaluate completion obligations | **Yes** | IFP-10 G3/G5; DLA-WB-28; EV-CAP-03 |
| Level 3 depth-floor specifications | **Yes** | IFP-09; DLA-WB-30 |
| Before JSON emission | **Yes** | IFP-00 step J; EMIT-FAIL replan |
| §6 unchanged | **Yes** | Test `pack §6 unchanged after 38L-2` |

**38L-2 success criterion met.** Next: **38L-3** — GAM depth-shaped body rules (R3 + R1/R5/R6 bodies).

---

## References

- [38J-3 DLA implementation](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-3-dla-implementation.md) — baseline extended  
- [38L-1 planning review](38L-1-implementation-planning-review.md)  
- `domains/learning-design/domain-learning-design-step-patterns.md` §5

---

**Parent:** [38L observations index](README.md) · **Sprint:** 38-L · **Next:** **38L-3** GAM depth-floor implementation
