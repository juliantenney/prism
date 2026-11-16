# Sprint 99 — Implementation map

**Status:** **CLOSED — ACCEPTED WITH QUALIFICATIONS** — [S99-D05](decisions.md#s99-d05--close-sprint-99--accepted-with-qualifications) · [SPRINT-99-CLOSURE.md](SPRINT-99-CLOSURE.md)  
**Opening:** [S99-D01](decisions.md#s99-d01--open-sprint-99--expository-instructional-quality-and-academic-plain-english)  
**M1:** [S99-D02](decisions.md#s99-d02--accept-m1--provisional-educational-evaluation-of-three-expository-resources)  
**M2:** [S99-D03](decisions.md#s99-d03--accept-m2-investigation-findings-and-propose-m3-scope) · [M2-INVESTIGATION.md](M2-INVESTIGATION.md)  
**M3:** [S99-D04](decisions.md#s99-d04--implement-m3-1-and-m3-2-only)  
**Close:** [S99-D05](decisions.md#s99-d05--close-sprint-99--accepted-with-qualifications)  
**Charter:** [SPRINT-99-CHARTER.md](SPRINT-99-CHARTER.md)  
**Evidence:** [EVIDENCE-REGISTER.md](EVIDENCE-REGISTER.md) · [VALIDATION.md](VALIDATION.md)

---

## Current posture

```text
Sprint 98                             CLOSED — ACCEPTED WITH QUALIFICATIONS
Sprint 99                             CLOSED — ACCEPTED WITH QUALIFICATIONS (S99-D05)
Sprint 100 stub                       SUPERSEDED — AP four-case review accepted; no substantive impl
Next programme activity               Interactive + Expository corpus regeneration (no sprint opened)
Situated Task (this phase)            Not separately evaluated
M0–M2                                 COMPLETE
M3-1 / M3-2                           IMPLEMENTED
M3-3 / M3-4                           DEFERRED — not implemented
M4 Regeneration review                COMPLETE
Interactive LS fidelity               Programme D-015 (do not reopen Sprint 98)
```

---

## Milestones

| ID | Milestone | Acceptance (bounded) | Authorisation |
| -- | --------- | -------------------- | ------------- |
| **M0** | Open sprint; map Expository pipeline | Pack + [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md) | **Complete** — S99-D01 |
| **M1** | User-led Expository generation + educational evaluation | Three representative resources reviewed; provisional positive judgement; no broad redesign | **Complete** — S99-D02 |
| **M2** | Focused investigation (APE, coercion, effort, duplication) | Findings classified; M3 proposed | **Complete** — S99-D03 |
| **M3** | Narrow implementation | M3-1 + M3-2 only; focused tests green; M3-3/M3-4 deferred | **Partial** — S99-D04 |
| **M4** | Normal regeneration review | Assembled JSON + learner export evaluated | **Complete** — S99-D05 |
| **Close** | Qualified close | Qualifications recorded; programme → Sprint 100 planned | **Complete** — S99-D05 |

---

## M3 work packages

| Order | Package | Primary boundary | State |
| ----- | ------- | ---------------- | ----- |
| **M3-1** | String-list coercion fix | `lib/expository-contracts.js` | **Implemented** |
| **M3-2** | Expository Academic Plain English guidance | `lib/expository-sibling-prompts.js` | **Implemented** |
| **M3-3** | Optional XD/XM complementarity reinforcement | Sibling prompts only | **Deferred (S99-AD-008)** |
| **M3-4** | Optional extent/effort clarification | EJP/XD extent bullets | **Deferred (S99-AD-007)** |

Detail: [M2-INVESTIGATION.md](M2-INVESTIGATION.md) §F · [S99-D04](decisions.md#s99-d04--implement-m3-1-and-m3-2-only).

---

## Stage responsibility map (Expository)

| Stage | Role in this sprint |
| ----- | ------------------- |
| **GLC / LO / MK** | Shared upstream; Expository sibling bodies where route is Expository |
| **EJP** | Intellectual journey — section order, epistemic form, extent |
| **XD** | Per-section exposition + optional invitations/commissions |
| **XM** | Commissioned supporting materials (not Interactive GAM) |
| **Design Page** | Thin orientation / synthesis transport |
| **Assembly** | `page-vnext-assemble` Expository path → page + `expository_journey` |
| **Renderer** | `pageKind: "expository"` / `expositionSections` — not Interactive Orient→Learn→Do→Check |

Interactive EP / DLA / GAM / M5 Option C are **out of scope** as Expository control planes.

---

## Primary code surfaces

| Path | Role |
| ---- | ---- |
| `lib/expository-sibling-prompts.js` | EJP / XD / XM / sibling bodies — APE / complementarity candidates |
| `lib/expository-contracts.js` | XD/EJP normalize — coercion defect (M3-1) |
| `lib/page-vnext-assemble.js` | Expository assembly (preserves captured arrays) |
| `lib/ld-learner-facing-prose-typography.js` | S98-D08 (already reaches Expository) |
| `lib/ld-gam-instructional-depth.js` | Interactive APE — must **not** be forced onto Expository |
| `app.js` `applyWorkflowStepRuntimePromptAugmentations` | Expository augment chain |
| `lib/learner-renderer-vnext/build-page-model.js` | Exposition sections; ignores invitations/hooks |

---

## Explicit non-actions (at close)

- Do not reopen Sprint 99 or 98 for polish.  
- Do not treat deferred M3-3 / M3-4 as delivered.  
- Do not impose Interactive attempt-before-scaffold on Expository.  
- Do not conflate programme [D-015](../../../governance/ARCHITECTURAL-DEBT.md#d-015--interactive-learning-sequence-study-flow-fidelity) with Expository work or PB-FA-019 without allocation.  
- Commit / push requires separate authorisation.  
- Continue with Interactive + Expository corpus regeneration per [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md); do not open superseded Sprint 100.
