# Sprint 100 — Charter

**Sprint:** 100 — Learner Workload and Timing Realism  
**Status:** **CLOSED — ACCEPTED WITH QUALIFICATIONS**  
**Opened:** 2026-11-17  
**Closed:** 2026-11-17  
**Type:** Bounded timing realism / workload feasibility  
**Opening:** [S100-D01](decisions.md#s100-d01--open-sprint-100--learner-workload-and-timing-realism)  
**Closure:** [S100-D06](decisions.md#s100-d06--close-sprint-100--accepted-with-qualifications) · [SPRINT-100-CLOSURE.md](SPRINT-100-CLOSURE.md)  
**Map:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md)  
**Investigation:** [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md)

---

## Problem statement

PRISM currently tends to fit learning activities into author-specified time envelopes rather than independently estimating the workload required.

Existing timing checks primarily enforce arithmetic consistency. They do not reliably detect activities whose reading, reasoning, writing, feedback or revision demands exceed the time allocated.

This has produced optimistic learner-facing timing guidance in published exemplars.

---

## Sprint objective

Introduce a proportionate, explainable workload-feasibility assessment that can challenge unrealistic time allocations without pretending to predict exact completion times or automatically compressing learning activities.

---

## Planned phases

| Phase | Intent | State |
| ----- | ------ | ----- |
| **100A** | Standalone workload feasibility model | **COMPLETE** |
| **100B-1** | Interactive workflow integration (advisory) | **COMPLETE** |
| **100B-2** | Assessment Pack integration | **COMPLETE** |
| **100C** | Learning Journey commission and cumulative workload | **COMPLETE** |
| **100D** | External Educational QA workflows updated to v1.3 | **COMPLETE** (outside Cursor) |
| **100E** | Evidence review and sprint closeout | **COMPLETE** (closed with qualifications) |

---

## Guardrails

- Indicative ranges only — not empirical completion-time predictions.  
- Advisory warnings only — authors may continue after review.  
- Prefer reducing demand or increasing time when overload is flagged; never silent compression.  
- Map existing data through adapters; do not change established product schemas.  
- Avoid double-counting overlapping cognitive demands.  
- Incomplete evidence → no warning clutter.  
- Do not modify published exemplars in this sprint unless separately authorised.  
- Do not invent word counts or substantial writing demands from free-text alone.

---

## Non-goals (this sprint)

- Automatic duration rewriting  
- Blocking capture / generation gates  
- Learner-facing label changes as a primary vehicle  
- Full empirical calibration against completion telemetry  
- Reopening Sprint 99 for polish
