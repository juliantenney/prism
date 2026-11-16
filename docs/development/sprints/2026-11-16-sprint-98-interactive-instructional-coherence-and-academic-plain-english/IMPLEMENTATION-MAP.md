# Sprint 98 — Implementation map

**Status:** **CLOSED — ACCEPTED WITH QUALIFICATIONS** — [S98-D09](decisions.md#s98-d09--close-sprint-98--accepted-with-qualifications) · [SPRINT-98-CLOSURE.md](SPRINT-98-CLOSURE.md)  
**Sprint:** 98 — Interactive Instructional Coherence and Academic Plain English  
**Opening:** [S98-D01](decisions.md#s98-d01--open-sprint-98--interactive-instructional-coherence-and-academic-plain-english)  
**Historical close:** [S98-D05](decisions.md#s98-d05--close-sprint-98--accepted--qualified)  
**Reopen:** [S98-D06](decisions.md#s98-d06--reopen-sprint-98-for-m5-instructional-sequencing-resolution)  
**M5 impl:** [S98-D07](decisions.md#s98-d07--authorise-and-implement-m5-option-c-bounded-scaffold-sequencing) · [M5-SEQUENCING-OPTIONS.md](M5-SEQUENCING-OPTIONS.md)  
**Charter:** [SPRINT-98-CHARTER.md](SPRINT-98-CHARTER.md)  
**Evidence:** [EVIDENCE-REGISTER.md](EVIDENCE-REGISTER.md) · [VALIDATION.md](VALIDATION.md)  
**Baseline HEAD:** `54774cde3810bea1f666b2456c6edff4bb6181ee`

---

## Current posture

```text
Sprint 97                             CLOSED — ACCEPTED (qualified) — do not reopen
Sprint 98                             CLOSED — ACCEPTED WITH QUALIFICATIONS (S98-D09)
Sprint 99                             OPEN — Expository Instructional Quality
M1–M4                                 COMPLETE (M2 provisional)
M5 Option C                           IMPLEMENTED (S98-D07)
S98-D08 typography                    IMPLEMENTED
```

---

## Milestones

| ID | Milestone | Acceptance (bounded) | Authorisation |
| -- | --------- | -------------------- | ------------- |
| **M1** | Sprint opening, file verification, evidence baseline, documented principles | Pack exists; Design Page diffs verified; tests recorded; evidence register distinguishes confirmed / hypothesis / monitoring / resolved; principles locked | **Complete** — S98-D02 |
| **M2** | Regenerate and evaluate the Interactive Design Page guidance change | Controlled regen evaluated; educational improvement observed; DP-alone causation not claimed; provenance limits recorded | **Provisionally accepted** — S98-D03 |
| **M3** | Investigate Learning Sequence intentions vs rendered order/disclosure | Read-only; files/functions recorded; confirmed vs pedagogical vs unverified distinguished; defect judgement recorded | **Complete (investigation)** — S98-D04 |
| **M4** | Consolidate evidence, re-verify tests | Conclusions consolidated; suite re-run; over-claims checked | **Complete** — S98-D05 (operational close superseded) |
| **M5** | Instructional sequencing resolution | Option C implemented; A2/A3 fixture-verified; explanation-first preserved; no gates; Option B not needed; A1 residual documented | **Implemented** — S98-D07; original case unreproducible — accepted on focused regressions |
| **Editorial** | Global discretionary-emphasis ban | S98-D08 shared guidance reaches routes + GAM V2; 40-test set green | **Implemented** — S98-D08; generation validation pending |
| **Close** | Final qualified close | Accepted outcomes + qualifications recorded; programme → Sprint 99 | **Complete** — S98-D09 |

---

## Stage responsibility map (locked principle)

| Stage | Responsibility in this sprint |
| ----- | ----------------------------- |
| **DLA** | Activity structure and pedagogic rows — not page-wrapper rewrite |
| **GAM** | Activity materials depth; Academic Plain English / layer-purpose economy (prior uncommitted work) |
| **Learning Sequence** | Authored study-flow retained; M5 reads disclosure allow-list only (not a full execution engine) |
| **Design Page** | Newly authored `page_synthesis` roles; verbatim upstream transport; visual planning |
| **Assembly** | Deterministic merge / title authority restore; no instructional rewrite |
| **Renderer** | Presentation order and accessibility; Knowledge Summary before activities; M5 Option C scaffold relocation |

---

## Primary code surfaces

| Path | Role |
| ---- | ---- |
| `lib/learner-renderer-vnext/compose-sequence-context.js` | Parse timeline study-flow; relocate attempt-before scaffolds |
| `lib/learner-renderer-vnext/compose-page-model.js` | Interactive-only relocate after moment composition |
| `lib/learner-renderer-vnext/render-composed-moment.js` | `data-study-flow-disclosure` on collapsed details |
| `lib/learner-renderer-vnext-browser.js` | Rebuilt browser mirror |
| `tests/s98-m5-attempt-before-scaffold-sequencing.test.js` | Focused M5 regressions |
| `lib/ld-learner-facing-prose-typography.js` | S98-D08 global discretionary-emphasis ban |
| `tests/s98-learner-facing-prose-typography.test.js` | Multi-route typography regressions |
| `lib/gam-canonical-assembler.js` / `lib/ld-gam-page-enrich-contract.js` | Contradiction removal + typography inject |
| `lib/ld-design-page-partial-contract.js` | Interactive DP page-synthesis role separation + transport authority (prior) |
| `tests/workflow-design-page-upstream-prompt.test.js` | Partial-contract assertions including role distinctness |
| `lib/ld-gam-instructional-depth.js` | Academic Plain English (prior) |
| `app.js` | DP partial injection; authoritative title prompt/restore (prior) |

---

## Explicit non-actions (at close)

- Do not invert global Learn→Do; do not add mandatory gates; do not build a general sequencing engine.  
- Do not auto-split A1-M1.  
- Do not reopen Sprint 97 or Sprint 98 for polish.  
- Do not claim controlled A/B between four- and three-activity packages, or full study-flow engine delivery.  
- Commit / push of uncommitted trees requires separate authorisation (not part of S98-D09).  
- Continue Expository work under Sprint 99.
