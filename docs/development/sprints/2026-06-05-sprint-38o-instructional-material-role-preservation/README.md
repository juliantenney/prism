# Sprint 38-O — Instructional Material Role Preservation

**Pack path:** `docs/development/sprints/2026-06-05-sprint-38o-instructional-material-role-preservation/`  
**Date:** 2026-06-05  
**Status:** **CLOSED** — [38O-5-sprint-closure.md](observations/38O-5-sprint-closure.md) · **SUCCESS**  
**Predecessor:** [Sprint 38-N — Page Fidelity Hardening](../2026-06-05-sprint-38n-page-fidelity-hardening/) (**CLOSED** — [38N-5](../2026-06-05-sprint-38n-page-fidelity-hardening/observations/38N-5-sprint-closure.md) · **SUCCESS**)

**Quick resume:** [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) · [HANDOVER.md](HANDOVER.md) · [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Sprint purpose

Determine whether **pedagogically important instructional material roles** generated upstream (GAM) survive into the composed page model and learner render — distinct from the body-parity and anti-synopsis guarantees closed in Sprints 38-M and 38-N.

| Prior sprint | Established |
|--------------|-------------|
| **38-M** | GAM→Page body preservation; anti-synopsis; A3 sequencing |
| **38-N** | Semantic markers; render alias hardening; validator/schema alignment; `proofOk: true` |
| **38-O** | **Role fidelity is a distinct architectural concern** — orthogonal to body fidelity |

**Successor:** [Sprint 38-P — Instructional Role Fidelity](../2026-06-05-sprint-38p-instructional-role-fidelity/) (**CHARTERED** — [38P-1](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-1-role-authority-architecture.md) next)

**Closure answer:**

> Instructional role fidelity **is** a distinct architectural concern worthy of separate treatment from body fidelity.

---

## Outcome summary

| Finding | Detail |
|---------|--------|
| **Hypothesis** | Supported — roles degrade independently of body fidelity (proven on A4) |
| **Root cause** | Missing role authority; split key vocabularies; additive merge; render key-order precedence |
| **A4 pattern** | Compose weaken → additive merge → render prefer compose keys |
| **Recommendation** | F1 registry-led hybrid; charter future implementation sprint |
| **Proof concept** | `roleOk` additive to `proofOk` (RF-1..RF-8) |

Full closure: [38O-5-sprint-closure.md](observations/38O-5-sprint-closure.md)

---

## Phase table

| Phase | Focus | Deliverable | Status |
|-------|--------|-------------|--------|
| **38O-1** | Baseline role-survival trace | [38O-1](observations/38O-1-baseline-role-survival-trace.md) | **Complete** |
| **38O-2** | Role taxonomy and page-mapping analysis | [38O-2](observations/38O-2-role-taxonomy-page-mapping-analysis.md) | **Complete** |
| **38O-3** | Failure-mode classification | [38O-3](observations/38O-3-failure-mode-classification.md) | **Complete** |
| **38O-4** | Preservation options / recommendation | [38O-4](observations/38O-4-preservation-options-recommendation.md) | **Complete** |
| **38O-5** | Sprint closure | [38O-5](observations/38O-5-sprint-closure.md) | **Complete** |

Detail: [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Evidence base

| Source | Location |
|--------|----------|
| 38M closure + artefacts | `../2026-06-05-sprint-38m-page-composition-fidelity/` · `EV-38M-AFTER-*` |
| 38N closure + artefacts | `../2026-06-05-sprint-38n-page-fidelity-hardening/` · `EV-38N-AFTER-*` |
| 38N follow-on observation | [38N-5 §Follow-on](../2026-06-05-sprint-38n-page-fidelity-hardening/observations/38N-5-sprint-closure.md) |
| 38I A4 episode reference | [38I-4 A4 episode](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) |

---

## Hold conditions (carry forward)

| Hold | Source |
|------|--------|
| **38-M closed** | Do not reopen body-preservation mission |
| **38-N closed** | Do not reopen marker/render/schema hardening |
| **38O closed** | Discovery complete; implementation separately chartered |
