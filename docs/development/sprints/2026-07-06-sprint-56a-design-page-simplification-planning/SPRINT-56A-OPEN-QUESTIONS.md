# Sprint 56A — Open Questions

**Purpose:** Architectural decisions still requiring evidence, stakeholder input, or explicit deferral.  
**Status:** Living document during Sprint 56A planning.

---

## Responsibility boundaries

| ID | Question | Why it matters | Evidence needed |
| -- | -------- | -------------- | --------------- |
| OQ-01 | What is the **minimum** set of Design Page responsibilities for a valid learner page? | Defines simplification floor | Target-state review against live workflows |
| OQ-02 | Should Design Page ever **author** new learner-facing prose, or only **organise** upstream prose? | Core transport vs author split | Wrapper value assessment on exported HTML |
| OQ-03 | Is `overview` / `learning_purpose` essential, optional, or replaceable by upstream LC? | Section schema simplification | Learner testing or heuristic review |
| OQ-04 | Should `activities_omitted[]` remain available for size management? | Direct omission valve | Policy decision; conflicts with journey integrity |

---

## Optional vs mandatory functions

| ID | Question | Why it matters | Evidence needed |
| -- | -------- | -------------- | --------------- |
| OQ-05 | Are **episode_plans** on the page mandatory when upstream DEP exists? | Portable schema vs payload size | Renderer consumption audit |
| OQ-06 | Is **assessment_check** mandatory when `assessment_items` bound? | Assessment-only profile paths | Workflow matrix |
| OQ-07 | Is **knowledge_summary** section mandatory when KM/LC bound? | Summarisation pressure | Compare transport vs author approaches |
| OQ-08 | Are **support_notes** / facilitator sections mandatory for learner profile? | Profile scope | |

---

## Wrapper content ownership

| ID | Question | Why it matters | Evidence needed |
| -- | -------- | -------------- | --------------- |
| OQ-09 | Should journey assimilation, authorial exposition, and self-directed rhetoric **merge** into one thin module? | Triple-stack conflict | Module overlap analysis (audit §G) |
| OQ-10 | Who owns **study_tips** / closure synthesis — Design Page or upstream GAM consolidation materials? | Duplication vs transport | Material field mapping |
| OQ-11 | Should wrapper modules apply to **facilitator** profile or learner-only? | Scope reduction | Profile matrix |
| OQ-12 | What word budget (if any) should wrapper prose have under full material preservation? | Token competition | |

---

## Visual affordances

| ID | Question | Why it matters | Evidence needed |
| -- | -------- | -------------- | --------------- |
| OQ-13 | Should VA authoring remain on Design Page at all? | Largest non-transport load | Renderer capability review |
| OQ-14 | If VA moves, to **separate step** or **renderer inference**? | Migration complexity | Sprint 38 architecture notes |
| OQ-15 | Can `source_basis` citations coexist with full material embedding without substitution risk? | Failure mode F + G | |
| OQ-16 | Is schema 38.4 required on every page or only when figures generated? | Output size | |

---

## Knowledge summaries

| ID | Question | Why it matters | Evidence needed |
| -- | -------- | -------------- | --------------- |
| OQ-17 | Transport KM/LC excerpt verbatim vs omit section vs author preview? | Highest structural conflict (audit §L) | Side-by-side page comparison |
| OQ-18 | If authoring retained, how to prevent second-layer summarisation of activity materials? | Cross-field bleed | |
| OQ-19 | Should knowledge live only inside activities (no page-level summary)? | Radical simplification option | Product decision |

---

## Migration sequencing

| ID | Question | Why it matters | Evidence needed |
| -- | -------- | -------------- | --------------- |
| OQ-20 | Demote VA first, or collapse wrapper stack first, or freeze transport core first? | Order affects risk | Dependency map |
| OQ-21 | Can migration be prompt-only or requires renderer/validation changes? | Implementation scope | |
| OQ-22 | How to handle in-flight preservation patches from recent sessions? | Accretion vs simplification | Git diff inventory |
| OQ-23 | Does Sprint 57 start before, after, or in parallel with implementation? | Programme sequencing | Stakeholder decision |
| OQ-24 | Is PRISM post-compose repair the backstop if Copilot path still fails? | Dual-path strategy | |

---

## Validation and evidence

| ID | Question | Why it matters | Evidence needed |
| -- | -------- | -------------- | --------------- |
| OQ-25 | Which workflow fixtures are canonical for acceptance testing? | Baseline | 15-min communication/trust, inflation |
| OQ-26 | Is automated material-body equality check feasible (GAM Content vs emitted field)? | Validation automation | |
| OQ-27 | What failure rate on live Copilot runs triggers rollback? | Migration safety | |

---

## Resolution log

| ID | Resolution | Date | Owner |
| -- | ---------- | ---- | ----- |
| — | *(populate as questions close)* | | |
