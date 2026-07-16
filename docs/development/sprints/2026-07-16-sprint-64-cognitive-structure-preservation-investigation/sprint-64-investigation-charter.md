# Sprint 64 — Investigation Charter

**Sprint:** 64 — Cognitive Structure Preservation Investigation  
**Type:** Architecture **investigation** (documentation + optional diagnostic artefacts)  
**Status:** Complete (charter exit criteria met — Outcome C)  
**Predecessor outcome:** Sprint 63 Outcome A — Architecture Investigation Justified  

**Close:** [sprint-64-final-recommendation.md](sprint-64-final-recommendation.md) · [sprint-summary.md](sprint-summary.md)

**Canonical pointer:** [docs/sprints/sprint-64-cognitive-structure-preservation-investigation.md](../../../sprints/sprint-64-cognitive-structure-preservation-investigation.md)

## Purpose

Investigate the smallest viable preservation and manifestation mechanism capable of retaining learner-relevant intermediate reasoning structure beyond the GAM→assembly boundary — **without** implementing production changes or redesigning schemas.

---

## Investigate

* Preservation boundary (confirm and refine relative to preserve/normalize/render consumers)  
* Preservation mechanisms (options that reuse existing `instructional_archetype` / `archetype_plan` fields)  
* Preservation location / attachment points on the assembled-page path  
* Preservation granularity (activity vs material; full plan vs high-value subset)  
* Manifestation contracts (how preserved fields could be consumed safely — verbatim only)  
* Manifestation location (pre-render vs render-time; diagnostic vs learner-facing experiment)  
* Implementation feasibility and risk (technical, semantic, coupling, maintenance)  
* Recommendation for next step (not automatic authorisation to ship)

---

## Do Not Investigate Yet

* Schema redesign  
* Taxonomy / activity-type redesign  
* Renderer replacement or production rewrite  
* Production rollout / merge plans  
* DLA/GAM pedagogical rule redesign  
* Inventing new plan fields or relationships  
* Broad repository audits beyond the known flatten path

---

## Exit Criteria

Architecture investigation is **complete** when:

1. Candidate preservation approaches are identified  
2. Candidate manifestation approaches are identified  
3. Preservation location options are understood  
4. Trade-offs are documented  
5. A recommendation is produced  

Investigation is **not** complete when production code is shipped. Shipping requires a **separate** explicit authorisation beyond this charter.

---

## Constraints

* No schema changes  
* No production renderer behaviour changes unless a later decision explicitly authorises a bounded prototype  
* No synthetic archetype plans  
* No paraphrasing of plan semantics into new instructional claims  
* Prefer existing Sprint 63 fixtures and diagnostic patterns  

---

## First task (locked)

Map candidate preservation attachment points on the existing pipeline — document only.
