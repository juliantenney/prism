# Sprint 100 — Decisions

## S100-D01 — Open Sprint 100 — Learner Workload and Timing Realism

**Date:** 2026-11-17  
**Status:** Accepted  
**Depends on:** [Sprint 99 CLOSED — ACCEPTED WITH QUALIFICATIONS](../2026-11-16-sprint-99-expository-instructional-quality-and-academic-plain-english/SPRINT-99-CLOSURE.md)

**Decision:** Open **Sprint 100 — Learner Workload and Timing Realism**.

**Objective:** Introduce proportionate, explainable workload-feasibility assessment that challenges unrealistic time allocations without predicting exact completion times or automatically compressing activities.

**Phases:** 100A (complete at opening of documentation), 100B-1, 100B-2, 100C, 100D, 100E.

**Not authorised by opening alone:** Assessment Pack / Learning Journey / QA integration beyond the active phase; git commit / push; published exemplar edits; blocking gates.

**Note on numbering:** The earlier programme stub *Sprint 100 — Assessment Pack Instructional Quality* was **superseded** without opening. This Sprint 100 reuses the number for the authorised workload/timing programme.

---

## S100-D02 — Accept Phase 100A — workload feasibility estimator

**Date:** 2026-11-17  
**Status:** Accepted  
**Depends on:** [S100-D01](#s100-d01--open-sprint-100--learner-workload-and-timing-realism)

**Decision:** Accept **100A** as complete.

**Deliverables:**

- `lib/workload-feasibility-estimator.js`  
- `tests/s100a-workload-feasibility-estimator.test.js`  
- `tests/fixtures/s100a-workload-calibration.json`

**Calibration (provisional heuristics, not measured completion times):**

| Activity | Declared | Indicative effort | Flag |
| --- | ---: | ---: | --- |
| Philosophical argument, 300–400 words | 10 | 35–62 | overload |
| Analytical reconsideration, 180–250 words | 5 | 22–41 | overload |
| Institutional recommendation + dossier, 350–500 words | 19 | 42–78 | overload |
| Short MCQ | 3 | 2–7 | feasible |
| Mathematical problem + feedback | 20 | 15–32 | feasible |

**Tests recorded at acceptance:** 100A 14/14; S80-S6 duration 32/32; LS enrich 7/7.

**Agreed product decisions locked for later phases:**

1. Retain existing estimation bands provisionally.  
2. Integrate Interactive first, Assessment Pack second.  
3. Advisory warnings only — not blocking gates.  
4. Map existing workflow data through adapters — do not change established schemas.  
5. Recommend reducing demands or increasing time when overload is detected.  
6. Educators may retain an allocation after review.  
7. Avoid double-counting overlapping cognitive demands.  
8. Do not present heuristic ranges as measured learner completion times.

---

## S100-D03 — Implement 100B-1 — Interactive Learning Sequence advisory warnings

**Date:** 2026-11-17  
**Status:** Accepted (implementation authorised)  
**Depends on:** [S100-D02](#s100-d02--accept-phase-100a--workload-feasibility-estimator)

**Decision:** Integrate the 100A estimator into the Interactive Learning Sequence capture/review path via a narrow adapter and **non-blocking** author-facing warnings.

**Integration point:** Learning Sequence (page enrichment v2) — activity specifications and declared durations are concrete; no new workflow step.

**Constraints:** No schema changes; no automatic duration edits; no learner-facing label changes; no Assessment Pack / LJ / QA integration in this decision.

---

## S100-D04 — Accept phase 100B-2 — Assessment Pack advisory warnings

**Date:** 2026-11-17  
**Status:** Accepted  
**Depends on:** [S100-D02](#s100-d02--accept-phase-100a--workload-feasibility-estimator), [S100-D03](#s100-d03--implement-100b-1--interactive-learning-sequence-advisory-warnings)

**Decision:** Integrate the 100A estimator into the Assessment Pack Design Evidence Elicitation / Author Formative Return (and Design Page when `assessment_evidence` is present) capture paths via a narrow adapter and **non-blocking** author-facing warnings.

**Integration point:** Existing Assessment Pack elicitation and formative-return capture — indicative times, suggested lengths, stimulus/reading cues, and formative_return feedback/revision fields are concrete; no new workflow step.

**Shared change:** Toast wording generalised so Interactive and Assessment Pack share one advisory channel without product-specific step naming.

**Constraints:** No schema changes; no automatic duration edits; no learner-facing label changes; no Learning Journey / Educational QA integration in this decision; no published exemplar edits.

---

## S100-D05 — Accept phase 100C — Learning Journey workload feasibility

**Date:** 2026-11-17  
**Status:** Accepted  
**Depends on:** [S100-D02](#s100-d02--accept-phase-100a--workload-feasibility-estimator), [S100-D04](#s100-d04--accept-phase-100b-2--assessment-pack-advisory-warnings)

**Decision:** Integrate the 100A estimator into Learning Journey Design Page capture via a narrow adapter that separates **commission-level** and **journey-level** feasibility, with **non-blocking** author-facing warnings.

**Integration point:** Learning Journey Design Page — persisted commission specifications and Approximate learner time prose, plus workflow `learning_time` envelope; no new workflow step.

**Double-counting policy:** Commissions only (not nested activities); never add element allocations to commission allocations; never sum estimator upper bounds into a predicted journey total; overlapping scopes yield a risk note without an invented aggregate.

**Constraints:** No schema changes; no automatic envelope/allocation edits; no conversion of sibling TIME CHECKs into blocking code validators; no Educational QA integration in this decision; no published exemplar edits.

---

## S100-D06 — Close Sprint 100 — Accepted with qualifications

**Date:** 2026-11-17  
**Status:** Accepted  
**Depends on:** [S100-D01](#s100-d01--open-sprint-100--learner-workload-and-timing-realism) through [S100-D05](#s100-d05--accept-phase-100c--learning-journey-workload-feasibility)

**Decision:** Close **Sprint 100 — Learner Workload and Timing Realism** as **CLOSED — ACCEPTED WITH QUALIFICATIONS**.

**Accepted phases:**

| Phase | Outcome |
| ----- | ------- |
| 100A | Deterministic workload feasibility estimator and calibration fixtures |
| 100B-1 | Interactive workload feasibility advisories |
| 100B-2 | Assessment Pack workload feasibility advisories |
| 100C | Learning Journey commissioning feasibility advisories |
| 100D | Five external QA workflows updated to v1.3 (outside Cursor; JSON not necessarily in this repository) |
| 100E | Implementation evidence and known limitations reviewed |

**Closure rationale:** Sprint 100 established an advisory workload-feasibility approach. Warnings identify potentially unrealistic allocations from reading, reasoning, production, feedback and revision evidence, and encourage reducing scope or increasing time — without automatically changing durations, blocking authoring or imposing QA score deductions.

**Historical verification note:** Last reported implementation checkpoint recorded **105** relevant automated tests passed ([VALIDATION.md](VALIDATION.md)). That is historical evidence, not a claim of re-run at closure.

**Qualifications (not open Sprint 100 tasks):** indicative (not empirical) estimates; insufficient evidence may yield no warning; LJ commissioning feasibility is provisional; revised external QA workflows not yet systematically calibrated against the exemplar corpus; future learner testing may refine bands.

**Not authorised by this close:** inventing Sprint 101; claiming empirical validation; claiming completed exemplar-based QA calibration; reopening Sprint 100 for polish.

**Record:** [SPRINT-100-CLOSURE.md](SPRINT-100-CLOSURE.md)

