# Sprint 38-I — Instructional Episode Model

**Pack path:** `docs/development/sprints/2026-06-05-sprint-38i-instructional-episode-model/`  
**Date:** 2026-06-05  
**Status:** **CLOSED** (**SUCCESS**) — [38I-6](observations/38I-6-sprint-closure.md)  
**Predecessor:** [Sprint 38-H](../2026-06-05-sprint-38h-workbook-realisation-fidelity/) (**CLOSED**)  
**Successor:** **Sprint 38-J** — Instructional Function Planning Implementation (charter pending)

**Quick resume:** [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) · [HANDOVER.md](HANDOVER.md) · [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Sprint purpose

Capture the **target pedagogical model** for excellent **self-directed workbook activities**.

| Prior sprint | Established |
|--------------|-------------|
| **38-G** | KM/LO affordances can drive richer instructional design (ACM) |
| **38-H** | Most DLA/GAM intent can be preserved to the learner page; fidelity defects fixed |

**New question:**

> What should an excellent self-directed **instructional episode** look like?

The pipeline is broadly capable:

```text
KM → LO → ACM → DLA → GAM → Workbook Page
```

The limitation is that the **target instructional design model** is not yet explicit or rigorous enough. 38-I defines **what good looks like**.

---

## Core hypothesis

Different **cognitive demands** require different **instructional episode patterns** (Understand · Apply · Analyse · Evaluate).

38-I formalises those patterns and relates them to ACM, KM affordances, and LO metadata — **before** any pack implementation.

---

## Phase table

| Phase | Focus | Deliverable | Status |
|-------|--------|-------------|--------|
| **38I-1** | Prior pedagogical journey review (Sprints 28–31) | [38I-1](observations/38I-1-prior-pedagogical-journey-review.md) | **COMPLETE** |
| **38I-2** | Instructional episode model | [38I-2](observations/38I-2-instructional-episode-model.md) | **COMPLETE** |
| **38I-3** | KM/LO → episode mapping | [38I-3](observations/38I-3-km-lo-episode-mapping.md) | **COMPLETE** |
| **38I-4** | Target-state workbook mock-ups (Inflation) | [38I-4](observations/38I-4-target-state-workbook-mockups.md) | **COMPLETE** |
| **38I-5** | Implementation implications | [38I-5](observations/38I-5-implementation-implications.md) | **COMPLETE** |
| **38I-6** | Sprint closure | [38I-6](observations/38I-6-sprint-closure.md) | **COMPLETE** |

Detail: [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Scope boundaries

| In scope | Out of scope |
|----------|--------------|
| Instructional episode pattern definition | Pack implementation |
| Review Sprints 28–31 journey work | Schema expansion |
| Relate patterns to ACM / KM / LO | `app.js` / renderer changes |
| Evaluation criteria for rich self-study activities | Pipeline changes |
| Target-state Inflation examples | V-01 / V-05 changes |
| Implementation implications (docs) | ACM redesign; reopening 38G/38H |

---

## Authority (read-only)

| Programme | Role |
|-----------|------|
| [38G-2](../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md) | ACM reference (frozen) |
| [38G-5](../2026-06-04-sprint-38g-activity-component-quality/observations/38G-5-acm-realisation-trace.md) | Realisation evidence |
| [38H-5](../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-5-sprint-closure.md) | Fidelity closure |
| [38C-1](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) | Learner workbook bar |
| [Sprint 28](../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/sprint-28-index.md) | Pedagogical journey prior work |

**Frozen comparators (do not overwrite):** EV-01 · `EV-38E5-AFTER-*` · `EV-38E10-AFTER-*` · `EV-38F-AFTER-*` · `EV-38G-AFTER-*`
