# Sprint 99 — Implementation map

**Status:** **OPEN** — [S99-D01](decisions.md#s99-d01--open-sprint-99--expository-instructional-quality-and-academic-plain-english)  
**Sprint:** 99 — Expository Instructional Quality and Academic Plain English  
**Charter:** [SPRINT-99-CHARTER.md](SPRINT-99-CHARTER.md)  
**Investigation:** [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md)  
**Evidence:** [EVIDENCE-REGISTER.md](EVIDENCE-REGISTER.md) · [VALIDATION.md](VALIDATION.md)

---

## Current posture

```text
Sprint 98                             CLOSED — ACCEPTED WITH QUALIFICATIONS
Sprint 99                             OPEN
M0 Open + read-only investigation     COMPLETE
M1 User-led Expository generation     AWAITING USER
M2 Targeted improvements              NOT AUTHORISED (evidence-gated)
Code / regen / commit / push          NOT AUTHORISED
```

---

## Milestones

| ID | Milestone | Acceptance (bounded) | Authorisation |
| -- | --------- | -------------------- | ------------- |
| **M0** | Open sprint; map Expository pipeline; record Sprint 98 reach; list evidence gaps | Pack complete; [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md) | **Complete** — S99-D01 |
| **M1** | User-led normal Expository generation + educational evaluation | Assembled JSON + ZIP evaluated for understanding quality; findings classified | **Awaiting user generation** |
| **M2** | Targeted improvements only if evidence justifies | Smallest coherent changes; focused tests; no over-claim | **Not authorised** |

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

## Primary code surfaces (investigation; no edit authorised)

| Path | Role |
| ---- | ---- |
| `lib/expository-sibling-prompts.js` | EJP / XD / XM / sibling bodies |
| `lib/page-vnext-assemble.js` | Expository assembly |
| `lib/expository-structured-materials.js` | XM structured artefacts |
| `lib/first-class-workflow-family.js` | Expository family profile (`activities_required: false`) |
| `lib/ld-learner-facing-prose-typography.js` | S98-D08 (reaches Expository via pre-branch inject) |
| `app.js` `applyWorkflowStepRuntimePromptAugmentations` | Expository: typography → domain → EQF → math → JSON |
| `lib/learner-renderer-vnext/build-page-model.js` | `isExpositoryLearnerPage` / exposition sections |
| `lib/learner-renderer-vnext/render-page.js` | Expository render path |

---

## Explicit non-actions

- Do not impose Interactive attempt-before-scaffold on Expository.  
- Do not treat explanation-before-activity as a defect.  
- Do not move Knowledge Summary after exposition.  
- Do not introduce arbitrary word limits or unnecessary schemas/renderer mechanisms.  
- Do not modify Assessment Pack or Situated Task.  
- Do not implement M2 without evidence from M1.  
- Do not commit or push without separate authorisation.
