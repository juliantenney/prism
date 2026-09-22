# Sprint 86 — Plan

**Status:** **OPEN** — Investigation/design pack opened ([S86-D01](decisions.md#s86-d01--open-sprint-86--expository-editorial-quality--qa))  
**Dashboard:** [STATUS.md](STATUS.md) · **Charter:** [SPRINT-86-CHARTER.md](SPRINT-86-CHARTER.md)  
**Draft principles:** [DRAFT-EDITORIAL-PRINCIPLES.md](DRAFT-EDITORIAL-PRINCIPLES.md) — **hypotheses only**

Gate/task IDs: `S86-T-###`, `S86-D##`, `S86-WP#`.

**All work packages below are investigation/design — not production implementation.**

---

## Programme posture

```text
Sprint pack / opening decision     COMPLETE (S86-D01)
Investigation / design WPs         POPULATED (WP1–WP5)
Production implementation          NOT AUTHORISED
Sprint 85 architecture / delivery  CLOSED — do not reopen
S83/S84 Expository architecture    ACCEPTED — do not reopen without compelling evidence
Interactive baseline               PROTECTED (S83-D04)
Draft editorial principles         HYPOTHESES TO TEST — not production rules
```

---

## Investigation / design work packages

| WP | Focus | Gate (summary) | Status |
| -- | ----- | -------------- | ------ |
| **WP1** | Editorial quality model | Draft principles tested/revised; general vs context-dependent distinguished; mediocrity-despite-correctness explained | **IN PROGRESS** — case-01 working findings; not accepted |
| **WP2** | Expository QA framework | Repeatable qualitative process; dimensions; judgement conventions; anti–false-precision guidance | **IN PROGRESS** — [EXPOSITORY-QA-v0.1.md](EXPOSITORY-QA-v0.1.md) pre-validation |
| **WP3** | Diverse QA evidence set | Bayes + ~3–5 contrasting PRISM-generated resources; model hold/fail/change findings | **IN PROGRESS** — case 01 captured; C02–C05 selected; generation not started |
| **WP4** | Pipeline responsibility + XD/XM seam | Responsibility map across EJP/XD/XM/DP/assembly/renderer; XD→XM integration finding | **NOT STARTED** |
| **WP5** | Typography requirements + successor design | Editorial rendering requirements (not CSS); bounded implementation recommendation | **NOT STARTED** |

---

## Task index (bounded investigation/design)

| ID | Title | WP | Status |
| -- | ----- | -- | ------ |
| S86-T-001 | Capture Bayes editorial evidence as case 1 baseline | WP1/WP3 | **COMPLETE** |
| S86-T-002 | Test draft principles P1–P11 for generality / redundancy / missing dimensions | WP1 | **COMPLETE** (provisional; single-case) |
| S86-T-003 | Articulate instructional vs editorial architecture distinction with evidence | WP1 | **COMPLETE** (provisional) |
| S86-T-004 | Draft Expository QA process (dimensions, judgement scheme, evidence expectations) | WP2 | **COMPLETE** (v0.1 pre-validation) |
| S86-T-005 | Select deliberately contrasting resource cases (~4–6 total including Bayes) | WP3 | **COMPLETE** (selection only) |
| S86-T-006 | When authorised: generate/evaluate additional PRISM Expository samples | WP3 | **PENDING** — do not start yet |
| S86-T-007 | Synthesize model hold / fail / qualify findings across sample | WP1/WP3 | **PENDING** |
| S86-T-008 | Map editorial responsibilities onto existing EJP/XD/XM/DP/assembly/renderer | WP4 | **PENDING** |
| S86-T-009 | Investigate XD→XM prose/representation integration seam (smallest coherent option) | WP4 | **PENDING** |
| S86-T-010 | Record typography / editorial rendering requirements (principles only) | WP5 | **PENDING** |
| S86-T-011 | Produce bounded successor implementation design (what to change / not change) | WP5 | **PENDING** |
| S86-T-012 | Sprint closure record when outputs accepted | Close | **PENDING** |

Do **not** invent production implementation tasks in this plan.

---

## Pipeline responsibility hypotheses (to investigate)

| Stage | Working editorial responsibility hypotheses |
| ----- | --------------------------------------------- |
| **EJP** | Intellectual entry; whole-resource editorial shape; relative explanatory emphasis; planned recurrence/development; major rhetorical progression; intended synthesis/ending |
| **XD** | Learner-facing explanatory composition; paragraph-level movement; transitions; selective rhetorical emphasis; prose restraint / semantic density; interaction between prose and commissioned representations |
| **XM** | Realisation of commissioned intellectual artefacts; representation purpose; relationships/distinctions/evidence the artefact must make perceptible; no takeover of main exposition |
| **Design Page** | Learner-facing editorial composition; which internal artefacts deserve visible expression; orientation/synthesis treatment; page-level hierarchy and visual planning; avoid projecting PRISM internal structure as learner furniture |
| **Assembly** | Preserve intended relationships without unrestricted rewrite |
| **Renderer** | Restrained educational-publishing typographic grammar; measure/rhythm; hierarchy; prose/maths/figure/caption/table relationships; conceptual emphasis; editorial not widget presentation; accessibility preserved |

---

## Candidate contrasting sample themes (planning only)

**Superseded for selection by** [VALIDATION-SET.md](VALIDATION-SET.md) (C01–C05). Generation of C02–C05 awaits S86-T-006 authorisation.

---

## Out of scope (preserved)

Production code/prompts/contracts/schemas/renderer/CSS · fixed chapter templates · numerical QA optimisation · reopening S83–S85 · Interactive prompt edits · Research Synthesis resolution · Expository→Interactive · CAS/table-maths programmes · large ongoing polish programme.

---

## Related

- Opening: [S86-D01](decisions.md#s86-d01--open-sprint-86--expository-editorial-quality--qa)  
- Draft principles: [DRAFT-EDITORIAL-PRINCIPLES.md](DRAFT-EDITORIAL-PRINCIPLES.md)  
- Predecessor: [SPRINT-85-CLOSURE.md](../2026-09-21-sprint-85-expository-resource-implementation/SPRINT-85-CLOSURE.md)  
- Design baseline: [S84-EXPOSITORY-RESOURCE-DESIGN.md](../2026-09-21-sprint-84-expository-resource-planning/S84-EXPOSITORY-RESOURCE-DESIGN.md)  
- Backlog: [PB-FA-012](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-012--expository-editorial-quality--qa)
