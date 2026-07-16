# Sprint 64

**Sprint:** 64 — Cognitive Structure Preservation Investigation  
**Status:** **Complete** (Outcome C — 2026-07-16)  
**Opened:** 2026-07-16  
**Predecessor:** [Sprint 63 close-out](../2026-07-16-sprint-63-cognitive-flow-and-reasoning-visibility/sprint-63-closeout.md)

| Document | Role |
| -------- | ---- |
| [SPRINT-64-START-HERE.md](SPRINT-64-START-HERE.md) | Reading order |
| [sprint-summary.md](sprint-summary.md) | Sprint close summary |
| [sprint-64-final-recommendation.md](sprint-64-final-recommendation.md) | **S64-BL-005** final recommendation (Outcome C) |
| [next-chat-briefing.md](next-chat-briefing.md) | Paste handover briefing |
| [sprint-64-investigation-charter.md](sprint-64-investigation-charter.md) | Authoritative investigation scope |
| [sprint-64-starting-assumptions.md](sprint-64-starting-assumptions.md) | What may / may not be reopened |
| [candidate-preservation-attachment-points.md](candidate-preservation-attachment-points.md) | **S64-BL-001** attachment-point map |
| [candidate-preservation-mechanisms.md](candidate-preservation-mechanisms.md) | **S64-BL-002** mechanism comparison |
| [source-to-material-correlation-and-retention-feasibility.md](source-to-material-correlation-and-retention-feasibility.md) | **S64-BL-002b** correlation/retention feasibility (Outcome B) |
| [candidate-manifestation-contracts.md](candidate-manifestation-contracts.md) | **S64-BL-003** path-gated manifestation contracts |
| [preservation-and-manifestation-location-comparison.md](preservation-and-manifestation-location-comparison.md) | **S64-BL-004** location comparison |
| [bounded-prototype-ephemeral-verbatim-envelope.md](bounded-prototype-ephemeral-verbatim-envelope.md) | **S64-BL-004b** bounded prototype |
| [backlog.md](backlog.md) | Sprint goals / investigation backlog |
| [evidence-log.md](evidence-log.md) | Evidence log |
| [findings-log.md](findings-log.md) | Findings log |
| [decisions.md](decisions.md) | Decision log |
| [architecture/architecture-notes.md](architecture/architecture-notes.md) | Architecture notes (investigation only) |
| [experiments/](experiments/) | Non-production experiment area |
| [Charter (canonical)](../../../sprints/sprint-64-cognitive-structure-preservation-investigation.md) | Canonical charter pointer |
| [Sprint 63 handover](../2026-07-16-sprint-63-cognitive-flow-and-reasoning-visibility/sprint-63-to-sprint-64-handover.md) | Transition pack |
| [Sprint 63 authoritative findings](../2026-07-16-sprint-63-cognitive-flow-and-reasoning-visibility/sprint-63-authoritative-findings.md) | Frozen prior proof |

---

## Context

Sprint 63 completed discovery and validation (**Outcome A — Architecture Investigation Justified**). Differentiated cognitive structure exists upstream; high-value intermediate reasoning structure is partially non-recoverable after the GAM→assembled-materials boundary. Sprint 64 investigated the **smallest viable** preservation and manifestation mechanism — it did **not** authorise production implementation or schema redesign.

**Close:** [sprint-64-final-recommendation.md](sprint-64-final-recommendation.md) — **Outcome C** (future production-readiness investigation recommended; implementation not justified).

---

## Closing Position

### Established

* Path-gated ephemeral verbatim envelope (Combo 6) is experimentally feasible  
* Exact `material_id` correlation under gates (Outcome B)  
* Fail-closed behaviour; full provenance; no schema/renderer redesign required for the experimental path  

### Still unknown (future investigation only)

* Eligible-path frequency · operational value · cost/benefit · production retention design · rollout · maintenance  

### Not Approved

* Schema redesign  
* Production implementation  
* Production propagation  
* Renderer redesign / rebuild

---

## Sprint Goal

> Investigate the smallest viable preservation and manifestation mechanism capable of retaining learner-relevant intermediate reasoning structure beyond the GAM→assembly boundary.

---

## Success Criteria

Evidence-based only (no production deliverables required):

1. Candidate preservation approaches identified and compared.  
2. Candidate manifestation approaches identified and compared.  
3. Preservation location options understood relative to the known flatten boundary.  
4. Trade-offs documented (technical, semantic, coupling, maintenance).  
5. A clear recommendation produced for *what to do next* (including “do not implement yet” if warranted).

**Not success:** shipping production code; merging experimental manifestation into `app.js`; changing schemas.

---

## One-line purpose

Architecture investigation of cognitive-structure preservation and manifestation — documentation and diagnostic artefacts only until separately authorised.
