# Sprint 98 — Closure Record

**Sprint:** 98 — Interactive Instructional Coherence and Academic Plain English  
**Opened:** 2026-11-16  
**Closed:** 2026-11-16  
**Status:** **CLOSED — ACCEPTED WITH QUALIFICATIONS**  
**Type:** Bounded, evidence-led Interactive instructional quality (guidance, regeneration evaluation, sequencing correction, global prose typography)  
**Opening:** [S98-D01](decisions.md#s98-d01--open-sprint-98--interactive-instructional-coherence-and-academic-plain-english)  
**Final close:** [S98-D09](decisions.md#s98-d09--close-sprint-98--accepted-with-qualifications)  
**Predecessor:** [Sprint 97 — CLOSED — ACCEPTED](../2026-11-12-sprint-97-learning-journal-and-design-pattern-foundations/SPRINT-97-CLOSURE.md) (qualified) — **do not reopen**  
**Successor:** [Sprint 99 — Expository Instructional Quality and Academic Plain English](../2026-11-16-sprint-99-expository-instructional-quality-and-academic-plain-english/SPRINT-99-START-HERE.md)  
**Baseline HEAD:** `54774cde3810bea1f666b2456c6edff4bb6181ee`

## Closure statement

Sprint 98 is **closed** as **ACCEPTED WITH QUALIFICATIONS**. The programme verified Interactive Design Page guidance, evaluated regenerated Interactive resources (including a later three-activity case), implemented M5 Option C (bounded attempt-before-scaffold presentation), and established S98-D08 as a global ban on discretionary inline emphasis in continuous learner-facing prose.

**Closing Sprint 98 does not mean** that all instructional sequencing or editorial issues have been eliminated. It does **not** claim:

- a controlled before-and-after comparison between the earlier four-activity and later three-activity *Why the constraint matters* packages;  
- that the original M5 learner-facing case was re-verified after workflow deletion (M5 accepted on focused regression evidence);  
- that the renderer executes the complete authored Learning Sequence as an authoritative study-flow engine;  
- that Overview / Learning purpose overlap is fully eliminated;  
- that S98-D08 has been validated through a subsequent normal generation;  
- that the independent `s96-interactive-editorial-opening` figcaption baseline (S98-E07) or A5 compose baseline failures were repaired;  
- that uncommitted Interactive guidance trees were committed or pushed;  
- that Sprint 97 deferred catalogue / Level 3 journal work was absorbed.

Those remain qualifications, future considerations, or independent debt (see [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md)). Do not reopen Sprint 97 for items deferred there.

---

## Accepted outcomes

| Outcome | Basis |
| ------- | ----- |
| Interactive Academic Plain English improved clarity and precision of generated instructional prose | M2 provisional acceptance · case evaluation |
| Latest three-activity *Why the constraint matters* showed coherent conceptual progression, meaningful mathematical reasoning, and generally productive repetition | Author evaluation (current-output evidence, not controlled A/B) |
| Knowledge Summary remains an advance organiser before activities | M2 / M4 / M5 preservation |
| M5 Option C — targeted attempt-before-scaffold renderer correction | [S98-D07](decisions.md#s98-d07--authorise-and-implement-m5-option-c-bounded-scaffold-sequencing) · focused regressions |
| S98-D08 — shared PRISM-wide ban on discretionary inline bold/italic/underline in continuous learner-facing prose | [S98-D08](decisions.md#s98-d08--global-ban-on-discretionary-inline-emphasis-in-learner-facing-prose) |
| S98-D08 reaches relevant generation routes and GAM V2 assembly | Validation: **40 pass / 0 fail** in typography + related guidance set |

---

## Qualifications and remaining debt

1. **Three-activity vs four-activity packages** — different generations; current package is evidence of present quality, not a controlled before-and-after.  
2. **Original M5 case unreproducible** — deleted workflow runtime state; M5 accepted on focused regression evidence, not a verified repeat of that original case.  
3. **Study-flow engine** — renderer still does not execute the complete authored Learning Sequence as authoritative step control (Option C is a narrow disclosure presentation only).  
4. **Residual Overview / Learning purpose overlap** — improved; not fully eliminated.  
5. **Current A3 guidance density** — more pre-proof guidance than the earlier resource; pedagogical design difference, not automatically a defect.  
6. **S98-D08 generation validation pending** — rule not yet confirmed via a subsequent normal generation.  
7. **Known baseline failures** — S98-E07 figcaption; A5 heteroscedasticity compose expectations — explicitly **not** Sprint 98 regressions.  
8. **Sprint 97 deferred items** — remain on the Sprint 97 ledger (S98-AD-007).

---

## Completed scope

| ID | Title | Status |
| -- | ----- | ------ |
| M1 | Sprint opening, file verification, evidence baseline, principles | **COMPLETE** — S98-D02 |
| M2 | Regenerate / evaluate Design Page guidance change | **PROVISIONALLY ACCEPTED** — S98-D03 |
| M3 | Learning Sequence intentions vs rendered order/disclosure | **COMPLETE (investigation)** — S98-D04 |
| M4 | Evidence consolidation / historical qualified close | **COMPLETE** — S98-D05 (superseded operationally by reopen) |
| M5 | Bounded instructional scaffold sequencing (Option C) | **IMPLEMENTED** — S98-D07 |
| Editorial | Global discretionary-emphasis ban (S98-D08) | **IMPLEMENTED** — S98-D08 |
| Close | Final qualified close | **COMPLETE** — S98-D09 |

---

## Verification summary

| Suite | Result | Notes |
| ----- | ------ | ----- |
| M4 guidance set | 67 pass / 1 fail | Fail = S98-E07 baseline figcaption |
| M5 focused + related | 13 pass (M5+post-attempt); broader 95/99 with 4 baselines | A5 compose ×3 + S98-E07 |
| S98-D08 typography + related | **40 pass / 0 fail** | Multi-route + GAM assembler |

---

## Carry-forward

See [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md). Programme continues in **Sprint 99** (Expository). Assessment Pack and Situated Task reviews are planned as Sprint 100 / 101 — review first, improve only where justified.
