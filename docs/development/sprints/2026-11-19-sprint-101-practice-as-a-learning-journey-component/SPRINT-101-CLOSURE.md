# Sprint 101 — Closure Record

**Sprint:** 101 — Practice as a Learning Journey Component  
**Opened:** 2026-11-19  
**Closed:** 2026-11-20  
**Status:** **CLOSED — ACCEPTED WITH QUALIFICATIONS**  
**Type:** Component architecture / instructional product design  
**Opening:** [S101-D01](decisions.md#s101-d01--open-sprint-101--practice-as-a-learning-journey-component)  
**Final close:** [S101-D06](decisions.md#s101-d06--close-sprint-101--accepted-with-qualifications)  
**Development pack:** this folder  
**Programme pointer:** [docs/sprints/sprint-101-practice-as-a-learning-journey-component.md](../../../sprints/sprint-101-practice-as-a-learning-journey-component.md)

## Closure statement

Sprint 101 is **closed** as **ACCEPTED WITH QUALIFICATIONS**.

The sprint established **Practice** as a first-class, Learning Journey–commissioned activity product: own product identity and `promptRoute`, Practice-owned presentation contracts, selection-capable Do surfaces, proportionate workload gates, and an image-brief precision/completeness repair so authorised mathematical expressions reach the generation prompt.

Standalone Interactive, Expository, and Assessment Pack behaviour remain isolated. Existing Interactive LJ commissions remain valid. Commission-native omission of GLC/MK/DLO was investigated (101G) and **not** implemented.

**Closing Sprint 101 does not mean** that every C4 learner-surface polish item is complete, that image rendering of the corrected C4 brief has been independently verified, that journey-level QA is done, or that Learning Journey–owned outcomes transmission is solved.

Do not reopen Sprint 101 for polish. The next sprint addresses Learning Journey–owned outcomes and their transmission through component commissioning. Journey-level QA is a subsequent concern, not part of Sprint 101.

---

## Phase outcomes

| Phase | Outcome | Status |
| ----- | ------- | ------ |
| **101A** | Architectural investigation | **COMPLETE** |
| **101B** | Practice instructional contract | **ACCEPTED** |
| **101C** | Learner-facing wireframe + worked example | **ACCEPTED** (foundation) |
| **101C-3** | Technical capability audit / readiness | **ACCEPTED** |
| **101D** | Practice v1 implementation | **COMPLETE** |
| **101E** | Validation: selection controls, persistence, progressive/discipline-first design, export layout, editorial opening | **COMPLETE** (with qualifications) |
| **101F** | Practice workload proportion (DLA/GAM gates; no workbook leak) | **COMPLETE** |
| **101G** | Commission-native LJ component feasibility (read-only) | **COMPLETE** — Option C recommended; not implemented |
| **101H** | Image-brief precision and completeness | **COMPLETE** — exact equations preserved; rendering verify deferred |

---

## Verification summary

Focused automated suites for Practice identity/intake/render, 101E selection/persistence/progressive/discipline-first/export, 101F workload proportion, 101G investigation artefacts, and 101H image-brief precision/completeness (including prior precision-fidelity and Sprint 70 visual prompt regressions) **passed** at the last reported checkpoints. See [VALIDATION.md](VALIDATION.md) and [STATUS.md](STATUS.md).

These figures are **checkpoint evidence** — not a claim that the entire repository test suite was re-run at closure, nor that C4 image re-render was independently verified.

---

## Qualifications and non-blocking follow-ups

These are **not** outstanding Sprint 101 implementation tasks. Do not reopen the sprint to address them:

1. **C4 A3 linked judgements** — A3’s three linked judgements should render as three independent, clearly labelled radio questions.  
2. **C4 A3 justification prose** — A3’s written justification should be shorter and more focused; remove redundant closure text.  
3. **Image precision extraction hygiene** — Extraction still emits some duplicated/malformed expression fragments, although the required exact equations are now preserved.  
4. **C4 image render verify** — The final image prompt contains all three authorised equations, but successful rendering of the corrected image has **not** yet been independently verified.  
5. **Commission-native workflow** — 101G recommended conditional Option C; implementation deferred.  
6. **Journey-level QA** — Subsequent concern; not part of Sprint 101.  
7. **Learning Journey–owned outcomes transmission** — Next sprint theme; not part of Sprint 101.

See also [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md).

---

## Explicit non-actions at close

- No component regeneration (C1–C4 or otherwise).  
- No additional implementation.  
- No commit or push.
