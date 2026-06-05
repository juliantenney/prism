# Sprint 38-H — Workbook Realisation Fidelity

**Pack path:** `docs/development/sprints/2026-06-05-sprint-38h-workbook-realisation-fidelity/`  
**Date:** 2026-06-05  
**Status:** **CLOSED** (2026-06-05) — [38H-5 closure](observations/38H-5-sprint-closure.md) · **SUCCESS**  
**Predecessor:** [Sprint 38-G — Activity Component Quality](../2026-06-04-sprint-38g-activity-component-quality/) (**CLOSED** — [38G-6](../2026-06-04-sprint-38g-activity-component-quality/observations/38G-6-sprint-closure-and-retrospective.md))  
**Successor:** [Sprint 38-I — Instructional Episode Model](../2026-06-05-sprint-38i-instructional-episode-model/) (**CHARTERED** — start **38I-1**)

**Quick resume:** [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) · [HANDOVER.md](HANDOVER.md) · [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Sprint purpose

38-G demonstrated that Prism can generate **richer instructional design** using existing KM/LO structures and the Activity Component Model. 38-H addressed **realisation fidelity** — ensuring instructional intent from DLA/GAM reaches the learner-facing workbook page.

**Focus chain:**

```text
DLA  →  GAM  →  Workbook Page
```

---

## Sprint outcome (closed)

| Verdict | **SUCCESS** |
|---------|-------------|
| H-01 GAM anti-spoiler | **Fixed** — pack §6 (38H-2) |
| H-02 table-adjunct fidelity | **Fixed** — pack §13 + `ld-table-fidelity.js` (38H-3) |
| H-03 harness KM | **Fixed** — 38H-4 + 38H-4b |
| H-04 Evaluate practice | **Deferred** — pedagogy gap → 38-I |
| Holds | V-01 · V-05 · 38E/38F types · 38G ACM · Preservation **PASS** |

Detail: [38H-5 sprint closure](observations/38H-5-sprint-closure.md)

---

## Phase table

| Phase | Focus | Deliverable | Status |
|-------|--------|-------------|--------|
| **38H-1** | Realisation fidelity analysis | [38H-1](observations/38H-1-workbook-realisation-fidelity-analysis.md) | **COMPLETE** |
| **38H-2** | GAM consolidation discipline | [38H-2](observations/38H-2-gam-consolidation-discipline.md) | **COMPLETE** |
| **38H-3** | Design Page material fidelity | [38H-3](observations/38H-3-design-page-material-fidelity.md) | **COMPLETE** |
| **38H-4** | Evaluation harness + KM | [38H-4](observations/38H-4-evaluation-harness-fidelity.md) | **COMPLETE** |
| **38H-4b** | KM output contract fix | [38H-4b](observations/38H-4b-knowledge-model-output-contract.md) | **COMPLETE** |
| **38H-5** | Sprint closure | [38H-5](observations/38H-5-sprint-closure.md) | **COMPLETE** |

Detail: [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Authority (read-only)

| Programme | Role |
|-----------|------|
| [38G-5](../2026-06-04-sprint-38g-activity-component-quality/observations/38G-5-acm-realisation-trace.md) | Pre-fix fidelity evidence |
| [38G-6](../2026-06-04-sprint-38g-activity-component-quality/observations/38G-6-sprint-closure-and-retrospective.md) | Sprint mandate |
| [38G-2](../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md) | ACM reference (frozen) |

**Frozen comparators (do not overwrite):** EV-01 · `EV-38E5-AFTER-*` · `EV-38E10-AFTER-*` · `EV-38F-AFTER-*` · `EV-38G-AFTER-*`

**Harness:** [ev-38h-inflation-pipeline-capture-once.mjs](artefacts/ev-38h-inflation-pipeline-capture-once.mjs) · [HARNESS-CONTRACT.md](artefacts/HARNESS-CONTRACT.md)

**Pack entry state:** `domains/learning-design/domain-learning-design-step-patterns.md` — 38E + 38F-2 + 38G-3 + **38H-2/3** (§3 KM contract, §6 GAM-WB-06b, §13 DP-TABLE-ADJ-01)
