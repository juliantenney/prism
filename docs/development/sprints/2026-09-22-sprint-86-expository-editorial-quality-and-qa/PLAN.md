# Sprint 86 — Plan

**Status:** **OPEN** — Investigation/design pack opened ([S86-D01](decisions.md#s86-d01--open-sprint-86--expository-editorial-quality--qa))  
**Dashboard:** [STATUS.md](STATUS.md) · **Charter:** [SPRINT-86-CHARTER.md](SPRINT-86-CHARTER.md)  
**Draft principles:** [DRAFT-EDITORIAL-PRINCIPLES.md](DRAFT-EDITORIAL-PRINCIPLES.md) — **EQ1–EQ8** (T-007)

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
Draft editorial principles         EQ1–EQ8 after T-007 — not yet production rules
```

---

## Investigation / design work packages

| WP | Focus | Gate (summary) | Status |
| -- | ----- | -------------- | ------ |
| **WP1** | Editorial quality model | Draft principles tested/revised; general vs context-dependent distinguished; mediocrity-despite-correctness explained | **COMPLETE** — EQ1–EQ8; [T-007-FIVE-CASE-SYNTHESIS.md](T-007-FIVE-CASE-SYNTHESIS.md) |
| **WP2** | Expository QA framework | Repeatable qualitative process; dimensions; judgement conventions; anti–false-precision guidance | **IN PROGRESS** — v0.1 frozen; v0.2 candidates listed in T-007 |
| **WP3** | Diverse QA evidence set | Bayes + ~3–5 contrasting PRISM-generated resources; model hold/fail/change findings | **COMPLETE** — C01–C05 frozen; T-007 synthesis done |
| **WP4** | Pipeline responsibility + XD/XM seam | Responsibility map across EJP/XD/XM/DP/assembly/renderer; XD→XM integration finding | **COMPLETE** — T-008 map + T-009 Option B seam design |
| **WP5** | Typography requirements + successor design | Editorial rendering requirements (not CSS); bounded implementation recommendation | **IN PROGRESS** — T-010 COMPLETE; T-011 PENDING |

---

## Task index (bounded investigation/design)

| ID | Title | WP | Status |
| -- | ----- | -- | ------ |
| S86-T-001 | Capture Bayes editorial evidence as case 1 baseline | WP1/WP3 | **COMPLETE** |
| S86-T-002 | Test draft principles P1–P11 for generality / redundancy / missing dimensions | WP1 | **COMPLETE** (provisional; single-case) |
| S86-T-003 | Articulate instructional vs editorial architecture distinction with evidence | WP1 | **COMPLETE** (provisional) |
| S86-T-004 | Draft Expository QA process (dimensions, judgement scheme, evidence expectations) | WP2 | **COMPLETE** (v0.1 pre-validation) |
| S86-T-005 | Select deliberately contrasting resource cases (~4–6 total including Bayes) | WP3 | **COMPLETE** (selection only) |
| S86-T-006 | When authorised: generate/evaluate additional PRISM Expository samples | WP3 | **COMPLETE** — C01–C05 evaluated under frozen QA v0.1 |
| S86-T-007 | Synthesize model hold / fail / qualify findings across sample | WP1/WP3 | **COMPLETE** — EQ1–EQ8; [T-007-FIVE-CASE-SYNTHESIS.md](T-007-FIVE-CASE-SYNTHESIS.md) |
| S86-T-008 | Map editorial responsibilities onto existing EJP/XD/XM/DP/assembly/renderer | WP4 | **COMPLETE** — [T-008-PIPELINE-RESPONSIBILITY-MAP.md](T-008-PIPELINE-RESPONSIBILITY-MAP.md) |
| S86-T-009 | Investigate XD→XM prose/representation integration seam (smallest coherent option) | WP4 | **COMPLETE** — [T-009-XD-XM-SEAM.md](T-009-XD-XM-SEAM.md) · recommend Option B |
| S86-T-010 | Record typography / editorial rendering requirements (principles only) | WP5 | **COMPLETE** — [T-010-TYPOGRAPHY-REQUIREMENTS.md](T-010-TYPOGRAPHY-REQUIREMENTS.md) |
| S86-T-011 | Produce bounded successor implementation design (what to change / not change) | WP5 | **PENDING** — next |
| S86-T-012 | Sprint closure record when outputs accepted | Close | **PENDING** |

Do **not** invent production implementation tasks in this plan.

---

## Pipeline responsibility hypotheses (superseded as working notes)

**Superseded for ownership conclusions by** [T-008-PIPELINE-RESPONSIBILITY-MAP.md](T-008-PIPELINE-RESPONSIBILITY-MAP.md).

| Stage | Working editorial responsibility hypotheses |
| ----- | --------------------------------------------- |
| **EJP** | Intellectual entry; whole-resource editorial shape; relative explanatory emphasis; planned recurrence/development; major rhetorical progression; intended synthesis/ending — **plus EQ1 purpose/epistemic form (typed ownership currently missing)** |
| **XD** | Learner-facing explanatory composition; paragraph-level movement; transitions; selective rhetorical emphasis; prose restraint / semantic density; warrant-based commissions |
| **XM** | Realisation of commissioned intellectual artefact **bodies**; not warrant; not necessarily the learner figure |
| **Design Page** | Title; thin orientation/synthesis transport; optional Closing; visual affordance planning — **must not repair EJP/XD/XM**; current furniture/VA practice is EQ7/EQ8/EQ5 risk |
| **Assembly** | Preserve intended relationships without unrestricted rewrite |
| **Renderer** | Regions, supported structured XM, VA placement, typography; AD-010 on unsupported structured bodies |

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
