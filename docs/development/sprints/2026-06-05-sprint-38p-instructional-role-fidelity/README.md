# Sprint 38-P — Instructional Role Fidelity

**Pack path:** `docs/development/sprints/2026-06-05-sprint-38p-instructional-role-fidelity/`  
**Date:** 2026-06-05  
**Status:** **CHARTERED** — **38P-1 START HERE**  
**Predecessor:** [Sprint 38-O — Instructional Material Role Preservation](../2026-06-05-sprint-38o-instructional-material-role-preservation/) (**CLOSED** — [38O-5](../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-5-sprint-closure.md) · **SUCCESS**)

**Quick resume:** [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) · [HANDOVER.md](HANDOVER.md) · [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Sprint purpose

Implement **instructional role fidelity** as a first-class architectural guarantee alongside body fidelity — establishing `roleOk` as an additive proof dimension to existing `proofOk`.

| Prior sprint | Established |
|--------------|-------------|
| **38-M** | GAM→Page body preservation; anti-synopsis; merge contract; `proofOk` |
| **38-N** | Semantic markers; render alias hardening; validator/schema alignment |
| **38-O** | Role fidelity discovery; taxonomy; failure modes; F1 preservation strategy |
| **38-P** | **Role fidelity implementation** — registry, supersession, render precedence, `roleOk` |

**Core shift:**

```text
38M/N proved body fidelity machinery works.
38O proved role fidelity is orthogonal — proofOk true, roleOk false on A4.
38P implements F1 registry-led hybrid so both pass together.
```

**Programme question:**

> Can the pipeline guarantee exactly one authoritative, correctly labelled, correctly ordered learner-facing instructional role instance per declared role family — without weakening 38M/38N body guarantees?

---

## Target outcome

```text
proofOk: true  +  roleOk: true  =  full L4 instructional fidelity
```

---

## Phase table

| Phase | Focus | Deliverable | Status |
|-------|--------|-------------|--------|
| **38P-1** | Role authority architecture | `observations/38P-1-role-authority-architecture.md` | **NEXT** |
| **38P-2** | Role registry implementation | Code + observation | Not started |
| **38P-3** | Merge supersession implementation | Code + observation | Not started |
| **38P-4** | Render role-precedence implementation | Code + observation | Not started |
| **38P-5** | roleOk validation and proof harness | Code + tests | Not started |
| **38P-6** | Proof run | `EV-38P-AFTER-*` | Not started |
| **38P-7** | Sprint closure | `observations/38P-7-sprint-closure.md` | Not started |

Detail: [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Evidence base

| Source | Location |
|--------|----------|
| 38M closure | [38M-6](../2026-06-05-sprint-38m-page-composition-fidelity/observations/38M-6-sprint-closure.md) · `EV-38M-AFTER-*` |
| 38N closure | [38N-5](../2026-06-05-sprint-38n-page-fidelity-hardening/observations/38N-5-sprint-closure.md) · `EV-38N-AFTER-*` |
| 38O closure + discovery | [38O-5](../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-5-sprint-closure.md) · [38O-1](../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-1-baseline-role-survival-trace.md)–[38O-4](../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-4-preservation-options-recommendation.md) |
| 38I A4 episode reference | [38I-4 A4 episode](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) |

---

## Hold conditions

| Hold | Source |
|------|--------|
| **38-M closed** | Do not reopen body-preservation mission — extend only |
| **38-N closed** | Do not reopen marker/render/schema hardening — extend render precedence pattern only |
| **38-O closed** | F1 registry-led hybrid is the mandated strategy |
| **Additive guarantees** | `roleOk` must not weaken `proofOk` or existing 38M tier gates |

---

Open with **38P-1**. Cite [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md) · [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md).
