# Next sprint — active programme

**Status:** **Sprint 101 OPEN** — Practice as a Learning Journey Component. Sprint 100 **CLOSED — ACCEPTED WITH QUALIFICATIONS**. Sprint 99 **CLOSED — ACCEPTED WITH QUALIFICATIONS**. Sprint 98 **CLOSED — ACCEPTED WITH QUALIFICATIONS**. Sprint 97 **CLOSED — ACCEPTED** (qualified). Sprint 96 **CLOSED — ACCEPTED**. Alpha development **complete**.  
**Updated:** 2026-11-19 (Sprint 101 opened)

---

## Current programme

**Open sprint:** [Sprint 101 — Practice as a Learning Journey Component](sprint-101-practice-as-a-learning-journey-component.md) · [development pack](../development/sprints/2026-11-19-sprint-101-practice-as-a-learning-journey-component/)

**Last closed:** [Sprint 100 — Learner Workload and Timing Realism](sprint-100-learner-workload-and-timing-realism.md) — **CLOSED — ACCEPTED WITH QUALIFICATIONS** · [SPRINT-100-CLOSURE.md](../development/sprints/2026-11-17-sprint-100-learner-workload-and-timing-realism/SPRINT-100-CLOSURE.md)

**Parallel programme activity (not a sprint gate):** **Interactive and Expository corpus regeneration** may continue using existing inventory / evidence mechanisms. Do **not** create a duplicate corpus governance structure.

**Also closed:** [Sprint 99](sprint-99-expository-instructional-quality-and-academic-plain-english.md) — **CLOSED — ACCEPTED WITH QUALIFICATIONS** · [SPRINT-99-CLOSURE.md](../development/sprints/2026-11-16-sprint-99-expository-instructional-quality-and-academic-plain-english/SPRINT-99-CLOSURE.md)

**Also closed:** [Sprint 98](sprint-98-interactive-instructional-coherence-and-academic-plain-english.md) — **CLOSED — ACCEPTED WITH QUALIFICATIONS** — do not reopen

**Hard invariants:** Assessment Pack remains **NON-SUMMATIVE**. Constituent Learning Journey products remain standalone-publishable. No implicit sharing of all learner responses. No AI marking of shared artefacts. Author Learning Journey download is **unified-only** (S96-D14); legacy multi-document packager is internal. Standalone Interactive remains available and must not be disturbed by Sprint 101.

### Protected state

| Item | State |
| ---- | ----- |
| Open sprint | **Sprint 101 — Practice as a Learning Journey Component** |
| Last closed sprint | **Sprint 100 — CLOSED — ACCEPTED WITH QUALIFICATIONS** |
| Parallel activity | Interactive + Expository corpus regeneration (optional; not a Sprint 101 gate) |
| Sprint 99 | **CLOSED — ACCEPTED WITH QUALIFICATIONS** |
| Sprint 98 | **CLOSED — ACCEPTED WITH QUALIFICATIONS** |
| Sprint 97 | **CLOSED — ACCEPTED** (qualified) — do not reopen |
| Assessment Pack four-case quality review | **Accepted — no substantive implementation** ([sprint-100 stub superseded](sprint-100-assessment-pack-instructional-quality.md)) |
| Situated Task (post–S99 phase) | **Not separately evaluated** — do not claim independently validated or passed |
| Interactive LS study-flow fidelity | Programme [D-015](../development/governance/ARCHITECTURAL-DEBT.md#d-015--interactive-learning-sequence-study-flow-fidelity) (unchanged; S98 / S99 cross-refs retained) |

---

## Immediate next

1. Continue **Sprint 101** per its charter — **101A complete**; next **101B Practice instructional contract** and **101C wireframe** (both require design review before 101D).  
2. Do **not** begin Practice implementation, product registration, prompt/schema/renderer edits, or exemplar regeneration until 101B and 101C are approved.  
3. Optional parallel: **Interactive and Expository corpus regeneration** when authorised (operator / author activity). Prefer existing case lists, evidence registers and QA artefacts rather than inventing a parallel tracker.  
4. Do **not** reopen Sprint 97–100 for polish. Retain Sprint 99 deferred **M3-3 / M3-4**, Sprint 100 qualifications, and programme residuals unchanged.  
5. Interactive Learning Sequence fidelity remains [D-015](../development/governance/ARCHITECTURAL-DEBT.md#d-015--interactive-learning-sequence-study-flow-fidelity) (S98 M5 Option C; S98-AD-004; S99-AD-012) — distinct from PB-FA-019 unless allocated. Do not renumber or duplicate this debt.

### Sprint 100 carry-forward (not Sprint 101 implementation work)

Workload estimates remain **indicative**. Insufficient evidence may yield no warning. Learning Journey commissioning feasibility is provisional. The five external QA workflows updated to v1.3 have **not** yet undergone systematic exemplar-corpus calibration. Future learner testing may refine workload bands. See [SPRINT-100-CLOSURE.md](../development/sprints/2026-11-17-sprint-100-learner-workload-and-timing-realism/SPRINT-100-CLOSURE.md).

### Assessment Pack (post–Sprint 99)

Four-case Assessment Pack instructional quality review: **accepted without substantive implementation**. Planned Assessment Pack Sprint 100 stub is **superseded** — see [sprint-100-assessment-pack-instructional-quality.md](sprint-100-assessment-pack-instructional-quality.md). The closed workload/timing Sprint 100 is a different programme.

**Non-blocking follow-ups (optional; not sprint gates):**

- Academic Plain English alignment for Assessment Pack prose paths (if generation evidence warrants)  
- Manual answer-disclosure checking on Assessment Pack learner exports  

These do **not** reopen a Sprint 100 implementation programme and do **not** change the NON-SUMMATIVE invariant.

Sprint 88 **depth / count / form-selection** real-use calibration remains a separate narrower backlog note ([PRODUCT-BACKLOG](../backlog/PRODUCT-BACKLOG.md#assessment-pack-real-use-calibration-sprint-88-remainder)) and is **not** completed by this four-case quality acceptance.

### Situated Task (this phase)

Situated Task was **not separately evaluated** after Sprint 99. Do **not** describe it as independently validated or passed in this phase. Product first-class status from Sprint 92 stands; that is not a substitute for a post–S99 component quality review.

### Corpus regeneration — existing mechanisms (use; do not duplicate)

| Mechanism | Role | Limitation for live regen |
| --------- | ---- | ------------------------- |
| Sprint 98 / 99 evidence registers and case packages | Recent Interactive / Expository evaluation anchors | Case-specific; not a standing corpus inventory |
| [Sprint 86 VALIDATION-SET](../development/sprints/2026-09-22-sprint-86-expository-editorial-quality-and-qa/VALIDATION-SET.md) + evidence ZIPs | Historical Expository QA case selection | Frozen validation set; not a live regen tracker |
| [EXPOSITORY-QA-v0.2](../development/sprints/2026-09-22-sprint-87-expository-quality-first-successor-implementation/EXPOSITORY-QA-v0.2.md) | Expository QA instrument | Instrument, not inventory |
| Operator QA workflow JSONs / Downloads packages | Practical regen source material (outside repo) | Not versioned programme governance |
| `lib/learner-renderer-vnext/certification-corpus.js` | Renderer certification fixtures | **Not** Interactive/Expository product regen inventory |
| Sprint 44 `benchmark-corpus/` | Historical benchmark | Obsolete for current product regen tracking |

**Gap:** the repository has **no dedicated live Interactive / Expository corpus regeneration inventory**. Do not invent one as part of this transition; track regenerations through existing sprint evidence patterns and operator artefacts until a future authorised decision creates a single tracker.

### Programme outlook

| Activity | Status |
| -------- | ------ |
| **Sprint 101 — Practice as LJ component** | **OPEN** — 101A complete; 101B/101C next |
| **Interactive + Expository corpus regeneration** | Optional parallel activity — not a Sprint 101 gate |
| Sprint 100 workload / timing realism | **CLOSED — ACCEPTED WITH QUALIFICATIONS** |
| Assessment Pack four-case quality review | **Accepted** — no substantive implementation; stub superseded |
| Situated Task separate evaluation | **Not done this phase** |
| Optional AP APE alignment / answer-disclosure check | Non-blocking follow-ups |
| Sprint 99 M3-3 / M3-4 | **Deferred** (unchanged) |
| D-015 Interactive LS study-flow fidelity | **Open residual** (unchanged) |

---

## Previous sprints

- [Sprint 101](sprint-101-practice-as-a-learning-journey-component.md) — **OPEN**
- [Sprint 100](sprint-100-learner-workload-and-timing-realism.md) — **CLOSED — ACCEPTED WITH QUALIFICATIONS**
- [Sprint 99](sprint-99-expository-instructional-quality-and-academic-plain-english.md) — **CLOSED — ACCEPTED WITH QUALIFICATIONS**
- [Sprint 98](sprint-98-interactive-instructional-coherence-and-academic-plain-english.md) — **CLOSED — ACCEPTED WITH QUALIFICATIONS**
- [Sprint 97](sprint-97-learning-journal-and-design-pattern-foundations.md) — **CLOSED — ACCEPTED** (qualified)
- [Sprint 96](sprint-96-unified-learning-journey-experience.md) — **CLOSED — ACCEPTED**
- [Sprint 95](sprint-95-unified-learning-journey-runtime.md) — **CLOSED — ACCEPTED**
- [Sprint 94](sprint-94-learning-journey-continuity.md) — **CLOSED — ACCEPTED**
- [Sprint 93](sprint-93-assessment-pack-educational-contract.md) — **CLOSED — ACCEPTED**
- [Sprint 92](sprint-92-situated-learning-activity-first-class-product.md) — **COMPLETE / CLOSED**
- [Sprint 91](sprint-91-learning-journey-first-class-implementation.md) — **COMPLETE / CLOSED**
- [Sprint 90](sprint-90-learning-journey-foundations.md) — **COMPLETE / CLOSED**
- [Sprint 89](sprint-89-architectural-consolidation.md) — **COMPLETE / CLOSED**
- [Sprint 88](sprint-88-default-product-workflows-and-assessment-architecture.md) — **COMPLETE / CLOSED**
