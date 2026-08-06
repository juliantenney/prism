# Sprint 73 — Closure Record

**Sprint:** 73 — Workflow Resources  
**Opened:** 2026-08-06  
**Closed:** 2026-08-06  
**Status:** **COMPLETE / Closed**  
**Predecessor:** [Sprint 72 closure](../2026-07-31-sprint-72-productising-instructional-architecture/SPRINT-72-CLOSURE.md) — evidence frozen; not reopened  
**Successor:** Sprint 74 **not opened** — select from [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md) via [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md)  
**Final report:** [SPRINT-73-FINAL-REPORT.md](SPRINT-73-FINAL-REPORT.md)  
**Top-level closeout:** [docs/sprints/sprint-73-closeout.md](../../../sprints/sprint-73-closeout.md)  
**Product backlog:** [docs/backlog/PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md)

---

## Closure authority

Sprint 73 is closed by operator closeout on **2026-08-06** after delivery of the Workflow Resources objective: discovery, conditional feasibility, generated-image persistence, downloadable resources, provider-supplied video embed, authoring-surface and Orient presentation refinements — all within documented constraints. Residual enhancements (manually uploaded graphics, orphan cleanup, attachment bytes, cross-device sync) are product-backlog items — Sprint 73 is **not** incomplete because those remain.

**No active implementation work remains under Sprint 73.** Do not continue feature work in this pack. Sprint 74 is **not** opened by this closure.

---

## Original objective

Investigate whether robust workflow asset persistence is achievable as the foundation for first-class Workflow Resources; if so, implement persistent generated images first, then generalise to an extensible resource model for additional downloadable resources and one embedded video — without assuming implementation at open (`S73-D01`).

---

## Outcome summary

- Generated-image lifecycle discovery; canonical workflow-scoped Workflow Resources owner; persistence feasible with explicit conditions (`S73-D02`).
- IndexedDB-backed generated-image persistence; same-browser/profile refresh and new-session rehydration; preview / standalone HTML / ZIP regeneration.
- Heavy verify: ~10 images / ~23.7 MB total payload (see T-012).
- Multiple downloadable Additional Resources; one provider-supplied embedded video (`S73-D03` verbatim).
- Page owns video/resource presentation (title, intro, link text, ordering); owner owns intrinsic payload/metadata.
- Authoring tabs: Learner Page · Graphics (n) · Video (0|1) · Resources (n).
- Learner ordering: Orient → optional video → optional resources → Activities; video/resources as Orient supporting content.
- Focused automated suites green as last recorded; browser-path verification completed.
- Backlog: [PB-FA-004](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-004--manually-uploaded-graphics) created; PB-FA-001 marked closed for Sprint 73.

---

## Completion criteria checklist

| Criterion | Status |
| --------- | ------ |
| Phase 1 architecture discovery | **Met** (`S73-T-001`…`T-005`) |
| Feasibility gate recorded | **Met** (`S73-T-006` / `S73-D02`) |
| Phase 2 generated-image persistence + verification | **Met** (`S73-T-010`…`T-012`) |
| Phase 3 generalisation design | **Met** (`S73-T-020`, `S73-T-021`) |
| Downloadable resources + video implementation/verification | **Met** (`S73-T-022`…`T-025`) |
| Authoring / Orient presentation refinements | **Met** (documented in T-022-024 / T-023-025) |
| Documentation / closure / backlog capture | **Met** |
| Sprint 74 not prematurely opened | **Met** |

---

## Known boundaries at close

See Final Report §17. Highlights: same-browser/profile only; orphans/mixed data; verbatim external embeds; no custom player / library / re-import / server sync; manually uploaded graphics → **PB-FA-004**.

Working-tree runtime and documentation changes may await **operator commit** — operational follow-up, not reopening of scope.

---

## Binding carry-forward

Retain `S73-D01`…`S73-D03` and inherited `S72-D09`, `S72-D10`, `S72-D14` unless a later sprint revises them. Sprint 72 evidence remains linked, not rewritten.

---

## Handover posture

- Sprint 73 is **COMPLETE / Closed**
- Product backlog is the authority for future work
- [PB-FA-004](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-004--manually-uploaded-graphics) captures manually uploaded graphics
- Orphan/mixed-data handling remains a known future consideration ([PB-R-008](../../../backlog/PRODUCT-BACKLOG.md#3-research--design-questions))
- No next sprint has been selected or opened
