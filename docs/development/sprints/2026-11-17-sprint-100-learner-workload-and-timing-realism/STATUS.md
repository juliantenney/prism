# Sprint 100 — Status / work log

**Sprint:** 100 — Learner Workload and Timing Realism  
**Opened:** 2026-11-17  
**Closed:** 2026-11-17  
**Status:** **CLOSED — ACCEPTED WITH QUALIFICATIONS**  
**Closure:** [SPRINT-100-CLOSURE.md](SPRINT-100-CLOSURE.md) · [S100-D06](decisions.md#s100-d06--close-sprint-100--accepted-with-qualifications)  
**Opening:** [S100-D01](decisions.md#s100-d01--open-sprint-100--learner-workload-and-timing-realism)

| Item | State |
| ---- | ----- |
| S100-D01 Open sprint | **Accepted** |
| S100-D02 Accept 100A | **Accepted** — 100A **COMPLETE** |
| S100-D03 Authorise 100B-1 | **Accepted** |
| 100B-1 Interactive integration | **COMPLETE** |
| 100B-2 Assessment Pack | **COMPLETE** |
| 100C Learning Journey cumulative | **COMPLETE** |
| 100D External QA workflows v1.3 | **COMPLETE** (outside Cursor) |
| 100E Closeout | **COMPLETE** — closed with qualifications |
| S100-D06 Close sprint | **Accepted** |

---

## Work log

### 2026-11-17 — Documentation + 100A record

- Created Sprint 100 pack under `docs/development/sprints/2026-11-17-sprint-100-learner-workload-and-timing-realism/`.  
- Recorded investigation evidence and 100A calibration.  
- Marked **100A complete** ([S100-D02](decisions.md#s100-d02--accept-phase-100a--workload-feasibility-estimator)).

### 2026-11-17 — 100B-1

- Selected Interactive **Learning Sequence** capture as the review point (durations + upstream activity prose available; no new step).  
- Added `lib/interactive-workload-feasibility-adapter.js`.  
- Wired non-blocking warnings into Learning Sequence capture validation, run-step status/note, and toast.  
- Scripts registered in `index.html`; VM bootstrap copies globals for tests.  
- Focused tests: see [VALIDATION.md](VALIDATION.md).  
- **100B-1 acceptance met** — advisory only; arithmetic duration checks unchanged; no AP/LJ/QA integration.

### 2026-11-17 — 100B-2

- Selected Assessment Pack **Design Evidence Elicitation** and **Author Formative Return** capture as the primary review points (indicative_time / indicative_duration_minutes / suggested_length / formative_return available; no new step). Design Page also surfaces warnings when `assessment_evidence` is present.  
- Added `lib/assessment-pack-workload-feasibility-adapter.js`.  
- Wired non-blocking warnings into AP elicitation / formative-return / Design Page capture validation; reused 100B-1 step-note + toast channel (toast wording generalised).  
- Shared change: Interactive toast no longer names Learning Sequence exclusively.  
- Scripts registered in `index.html`; VM bootstrap copies `PrismAssessmentPackWorkloadFeasibilityAdapter`.  
- Focused tests: see [VALIDATION.md](VALIDATION.md).  
- **100B-2 acceptance met** — advisory only; no schema/duration auto-rewrite; no LJ/QA integration.

### 2026-11-17 — 100C

- Selected Learning Journey **Design Page** capture as the review point (persisted `commissions[].specification_text` + workflow `learning_time` envelope; no new step).  
- Added `lib/learning-journey-workload-feasibility-adapter.js` with separate commission-level and journey-level assessment.  
- Double-counting safeguards: commissions only (not nested activities); no element+commission sum; no summed estimator upper bounds; overlap → risk note without invented total.  
- Wired non-blocking warnings into LJ Design Page validation / capture paths; reused existing step-note + toast channel.  
- Scripts registered in `index.html`; VM bootstrap copies `PrismLearningJourneyWorkloadFeasibilityAdapter`.  
- Focused tests: see [VALIDATION.md](VALIDATION.md).  
- **100C acceptance met** — advisory only; TIME CHECK arithmetic unchanged; no Educational QA integration.

### 2026-11-17 — 100D / 100E / close

- **100D:** Five external QA workflows (Learning Journey, Interactive, Assessment Pack, Situated Task, Expository) updated to **v1.3** outside Cursor; artefacts not necessarily present in this repository.  
- **100E:** Implementation evidence and known limitations reviewed; sprint formally closed with qualifications.  
- Closure record: [SPRINT-100-CLOSURE.md](SPRINT-100-CLOSURE.md).  
- Do not reopen; do not invent Sprint 101 in this close.
