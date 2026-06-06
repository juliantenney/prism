# Sprint 38-P — Instructional Role Fidelity

**Pack path:** `docs/development/sprints/2026-06-05-sprint-38p-instructional-role-fidelity/`  
**Date:** 2026-06-05  
**Closed:** 2026-06-06  
**Status:** **CLOSED — SUCCESS**  
**Closure:** [38P-7-sprint-closure.md](observations/38P-7-sprint-closure.md)  
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

**Outcome achieved:**

```text
proofOk: true  +  roleOk: true  =  fullOk: true   (EV-38P-AFTER)
```

---

## Phase table

| Phase | Focus | Deliverable | Status |
|-------|--------|-------------|--------|
| **38P-1** | Role authority architecture | [38P-1](observations/38P-1-role-authority-architecture.md) | **Complete** |
| **38P-2** | Role registry implementation | [38P-2](observations/38P-2-role-registry-implementation.md) · `lib/page-role-registry.js` | **Complete** |
| **38P-3** | Merge supersession implementation | [38P-3](observations/38P-3-merge-supersession-implementation.md) | **Complete** |
| **38P-4** | Render role-precedence implementation | [38P-4](observations/38P-4-render-role-precedence-implementation.md) · `lib/page-role-render-sequencing.js` | **Complete** |
| **38P-5** | roleOk validation and proof harness | [38P-5](observations/38P-5-role-fidelity-validation.md) · `lib/page-role-fidelity.js` | **Complete** |
| **38P-6** | Proof run | [38P-6-proof-run.md](observations/38P-6-proof-run.md) · `EV-38P-AFTER-*` | **Complete** |
| **38P-7** | Sprint closure | [38P-7-sprint-closure.md](observations/38P-7-sprint-closure.md) | **Complete** |

Detail: [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Evidence base

| Source | Location |
|--------|----------|
| 38M closure | [38M-6](../2026-06-05-sprint-38m-page-composition-fidelity/observations/38M-6-sprint-closure.md) · `EV-38M-AFTER-*` |
| 38N closure | [38N-5](../2026-06-05-sprint-38n-page-fidelity-hardening/observations/38N-5-sprint-closure.md) · `EV-38N-AFTER-*` |
| 38O closure + discovery | [38O-5](../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-5-sprint-closure.md) |
| **38P proof** | `artefacts/EV-38P-AFTER-*` · [38P-6-proof-run.md](observations/38P-6-proof-run.md) |
| 38I A4 episode reference | [38I-4 A4 episode](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) |

---

## Recommended next programme direction

Instructional **episode depth / 38I alignment** (DLA + GAM generation shape) — see [38P-7 closure § Recommended next sprint](observations/38P-7-sprint-closure.md).

---

Sprint **CLOSED — SUCCESS**. Do not reopen 38M/38N/38P fidelity machinery without new discovery evidence.
