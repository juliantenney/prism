# Sprint 40 Continuation Handover

**Date:** 2026-06-09  
**Status:** **CHARTERED — not started**  
**Type:** Educational quality baseline and North Star review  
**Predecessor:** [Sprint 39](../2026-06-08-sprint-39-architecture-optimisation-and-prompt-debt-reduction/) (**CLOSED**)  
**Authority:** [38S-architecture-closure-note.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-3/38S-architecture-closure-note.md) · [sprint-39-closure-note.md](../2026-06-08-sprint-39-architecture-optimisation-and-prompt-debt-reduction/sprint-39-closure-note.md)  
**Sprint plan:** [sprint-40-plan.md](sprint-40-plan.md)

---

## Executive Summary

**Sprint 40 is an educational-quality baseline sprint, not an architecture sprint.**

Sprint 38S delivered and proved the frozen learning-design pipeline. Sprint 39 optimised prompts and documented artefact pathways. Sprint 40 **begins the Educational Quality Programme** by establishing evidence before any quality improvements are implemented.

**Four workstreams:**

1. **North Star Review** — confirm, revise, or retire North Star elements; define North Star v2 in practical output terms
2. **Educational Quality Benchmark Suite** — capture baseline outputs from the frozen architecture (Inflation self-study/workshop, Karl Marx workshop)
3. **Current Output vs North Star Gap Analysis** — compare benchmarks against North Star v2 across eleven evaluation dimensions
4. **Educational Quality Improvement Priorities** — ranked future work packages (documentation only — no implementation)

**Not in scope:** Code changes, prompt rewrites, architecture ownership changes, visual affordance implementation, or educational quality fixes.

---

## Current Architecture State

| Layer | Status | Sprint 40 touch? |
|-------|--------|:----------------:|
| **Episode Plan V1** | **Settled / frozen** | **No** |
| **DLA population** | **Settled** — pack 13,983 chars; population contract authoritative | **No** |
| **PF-11 chain** | **Settled** | **No** |
| **GAM realisation** | **Settled** — pack 15,712 chars post–Wave A; Wave B runtime optimised | **No** |
| **Design Page** | **Settled** — compose/render; hygiene complete (Sprint 39) | **No** |
| **Page renderer** | **Stable** — Phase A complete | **No** |
| **Harness** | **Green** — `EV-38S-AFTER-4` fullOk | **Must stay green** |

### Frozen pipeline

```text
KM → LO → Episode Plan → DLA → GAM → Design Page → Render
```

### Ownership shorthand

| Step | Verb |
|------|------|
| Episode Plan | **plans** |
| DLA | **populates** |
| GAM | **realises** |
| Design Page | **composes** |
| Renderer | **presents** |

### Post–Sprint 39 prompt baseline (reference only — not Sprint 40 edit targets)

| Step | Pack combined | Augmented (inflation self-directed probe) |
|------|-------------:|------------------------------------------:|
| DLA | 13,983 | 30,613 |
| GAM | 15,712 | 27,542 |
| Design Page | 9,970 | 27,528 |

---

## Settled Architecture Decisions

**Do not reopen without new regression evidence:**

| Decision | Settlement |
|----------|------------|
| **Episode Plan ownership** | Plans archetype + beat order only. V1 schema frozen. |
| **DLA ownership** | Populates obligations from `episode_plans`. No replanning. |
| **GAM ownership** | Realises `required_materials` bodies. GAM-PRES canonical. |
| **Page ownership** | Compose/preserve only. Renderer owns HTML. |
| **Workflow chaining** | Authoritative upstream JSON; fenced capture; PF-11 guards. |
| **Workbook contract** | DLA-WB / GAM-WB / GAM-PRES co-presence. Validators complement prompts. |
| **PF-11 architecture** | `### Upstream episode_plans` block; V1 enforcement; stale-override detection. |
| **38Q Episode Plan recommendation** | **Implemented** in Sprint 38S — not a Sprint 40 design question. |

Any proposal that changes step ownership is **out of Sprint 40 charter** and requires a new architecture sprint.

---

## Current Educational-Quality Focus

Sprint 40 shifts from **“does the pipeline preserve fidelity?”** (answered: yes — `fullOk`) to **“how good are the learning experiences the pipeline produces?”**

| Prior phase | Question | Status |
|-------------|----------|--------|
| 38M–38P | Are materials preserved through compose/render? | **Solved** — `proofOk`, `roleOk` |
| 38S | Does Episode Plan gating improve population fidelity? | **Solved** — architecture frozen |
| 39 | Is prompt sediment reduced without ownership change? | **Solved** — GAM/Page optimised |
| **40** | **What does “good” look like, and how far are current outputs from it?** | **This sprint** |

**Primary evaluation contexts:**

1. **Self-study learner materials** — Inflation EV-38S proof path; workbook contract; independent study usability
2. **Workshop learning materials** — facilitated delivery; sequence adjacency; instructor support

North Star documentation predates full Episode Plan implementation. Sprint 40 must **reconcile** 38Q aspirations with post–38S/39 reality — without undoing architecture.

---

## North Star Review Requirement

Before gap analysis or priority setting, Workstream A must answer:

| # | Question |
|---|----------|
| 1 | What does the North Star currently say? (38Q, 38I, historical exemplars, contract floors) |
| 2 | Which statements assumed pre–Episode Plan architecture? |
| 3 | Which gaps were **planning** gaps (now addressed by Episode Plan) vs **generation quality** gaps? |
| 4 | What should North Star v2 require in **observable output** terms (activities, materials, page, journey)? |
| 5 | What should be retired because it conflicts with settled ownership? |

**Deliverable:** `observations/40S-1-north-star-review.md`

---

## Benchmark Suite Requirement

Workstream B must establish reproducible baseline evidence.

### Mandatory candidates

| ID | Scenario | Delivery mode | Primary evidence sources |
|----|----------|---------------|-------------------------|
| **B1** | Inflation | Self-study | `EV-38S-AFTER-4-*` artefacts; `EV-38S-AFTER-4-render.html` |
| **B2** | Inflation | Workshop | Workshop brief resolution; `learning_sequence` if present; facilitator profile |
| **B3** | Karl Marx | Workshop | `tests/fixtures/page-render/marx-self-study-page.json`; Marx workflow tests; fresh run if needed |

### Optional candidate

| ID | Scenario | Delivery mode | Notes |
|----|----------|---------------|-------|
| **B4** | Research Methods | Self-study | Add only if capture cost is low; not blocking for sprint closure |

### Per-benchmark capture checklist

- [ ] Brief text and resolved `workflowBriefResolution` factors
- [ ] Workflow step list (canonical IDs)
- [ ] Artefact file paths and run IDs
- [ ] `fullOk` / harness status for the run
- [ ] Qualitative strengths (3+)
- [ ] Qualitative weaknesses (3+)
- [ ] Known validator warnings (e.g. G13 depth gap, RF2 render gaps)

**Deliverable:** `observations/40S-2-educational-quality-baseline-suite.md`

---

## Workstreams

### WS-A — North Star Review (priority 1)

Review and reconcile North Star documentation with post–38S/39 architecture. Output North Star v2 practical standard.

**Authority:** [38Q-1](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-1-what-good-looks-like-baseline.md) · [38Q-2](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-2-episode-taxonomy-catalogue.md) · [38I-4](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/)

### WS-B — Benchmark Suite (priority 2 — parallel with A after candidate list fixed)

Capture and index baseline outputs. No new architecture runs required if EV-38S-AFTER-4 suffices for B1; workshop benchmarks may need dedicated captures.

### WS-C — Gap Analysis (priority 3 — after A + B)

Eleven-dimension comparison. Link every gap to benchmark evidence.

### WS-D — Priority Setting (priority 4 — after C)

Ranked future work packages. Implementation explicitly deferred.

---

## Scope Boundaries

### In scope

- Read-only review of North Star and quality documentation
- Benchmark artefact indexing and qualitative review
- Gap analysis and priority documentation
- Harness regression check (no code changes expected)
- Optional fresh production runs **for capture only** (no prompt/code edits)

### Out of scope

| Area | Reason |
|------|--------|
| Episode Plan / DLA / GAM / Page / renderer changes | Architecture frozen |
| Prompt or contract rewrites | Implementation sprint — not baseline sprint |
| PEL expansion / teacherly reasoning implementation | Deferred educational quality programme |
| Visual affordance generation | Separate VA programme |
| DLA runtime trim / ARCH-05 / ARCH-06 | Architecture optimisation — deferred at Sprint 39 |
| North Star implementation | Priorities only in Sprint 40 |

---

## Deferred Work

See [sprint-40-deferred-items.md](sprint-40-deferred-items.md) for full register.

**Summary:**

- **Architecture:** app.js review, DLA combined optimisation, Page Phase B compose, future pathway implementation
- **Educational quality implementation:** prompt rewrites, contract changes, exemplar programmes — **after Sprint 40 priorities**
- **Visual affordances:** image generation, diagrams, activity visuals
- **Future artefact pathways:** slideshow, VLE packaging, LO programmes, assessment enhancement beyond benchmark analysis

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Quality review becomes architecture relitigation | **High** | Gap template separates “quality” from “ownership”; charter non-goals |
| Pre–38S benchmarks compared unfairly | **High** | Mandate post–EV-38S-AFTER-4 outputs for Inflation self-study |
| Premature implementation | **High** | Work packages forbid code/prompt changes; D deliverable is priorities only |
| North Star v2 too vague to prioritise | **Medium** | A must output observable criteria per dimension |
| Missing workshop captures | **Medium** | B2/B3 may require dedicated runs — document blockers in benchmark suite |
| Render gaps skew journey assessment | **Low** | Note RF2/RF3 limitations; use JSON + available HTML |

---

## Closure Criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| 1 | North Star reviewed | `40S-1` published with v2 statement |
| 2 | Benchmark suite captured | `40S-2` with artefact index |
| 3 | Gap analysis complete | `40S-3` across eleven dimensions |
| 4 | Priorities proposed | `40S-4` ranked work packages |
| 5 | No architecture changes | Git diff excludes architecture code/packs |
| 6 | Harness green | `fullOk: true` at sprint end |
| 7 | Sprint 40 closure note | Published; status CLOSED |

---

## Recommended Execution Sequence

Execute in order (B may overlap A):

1. **Read authority** — 38S closure, 39 closure, 39 inventory, 38Q-6 closure
2. **Harness check** — confirm `fullOk` baseline before any work
3. **WS-A** — North Star review → North Star v2
4. **WS-B** — Benchmark capture (B1 from EV-38S-AFTER-4; B2/B3 workshop runs or fixtures)
5. **WS-C** — Gap analysis (requires A + B)
6. **WS-D** — Priority register (requires C)
7. **Closure note** — `sprint-40-closure-note.md`

```text
Read 38S/39 ──► A North Star ──┬──► C Gap analysis ──► D Priorities ──► Closure
                               │
                    B Benchmarks ┘
```

---

## Files To Read First

Read in this order to resume Sprint 40:

1. **This document** — `sprint-40-handover-pack.md`
2. [sprint-40-plan.md](sprint-40-plan.md)
3. [sprint-40-work-packages.md](sprint-40-work-packages.md)
4. [sprint-40-deferred-items.md](sprint-40-deferred-items.md)
5. [38S-architecture-closure-note.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-3/38S-architecture-closure-note.md)
6. [sprint-39-closure-note.md](../2026-06-08-sprint-39-architecture-optimisation-and-prompt-debt-reduction/sprint-39-closure-note.md)
7. [sprint-39-artefact-pathway-inventory.md](../2026-06-08-sprint-39-architecture-optimisation-and-prompt-debt-reduction/sprint-39-artefact-pathway-inventory.md)
8. [38Q-6-sprint-closure.md](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-6-sprint-closure.md) — North Star lineage
9. [38Q-1-what-good-looks-like-baseline.md](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-1-what-good-looks-like-baseline.md)
10. [38I-4-a4-evaluate-learner-episode.md](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) — exemplar target state
11. [EV-38S-AFTER-4-run-log.json](../2026-06-06-sprint-38s-episode-plan-v1-implementation/artefacts/EV-38S-AFTER-4-run-log.json) — primary Inflation proof
12. [EV-38S-AFTER-4-render.html](../2026-06-06-sprint-38s-episode-plan-v1-implementation/artefacts/EV-38S-AFTER-4-render.html) — learner render sample
13. [sprint-39-deferred-items.md](../2026-06-08-sprint-39-architecture-optimisation-and-prompt-debt-reduction/sprint-39-deferred-items.md) — EQ programme seed (EQ-01–EQ-19)

**Key artefact locations:** `docs/.../38s-episode-plan-v1-implementation/artefacts/EV-38S-AFTER-4-*` · `tests/fixtures/page-render/` · `domains/learning-design/domain-learning-design-step-patterns.md` (read-only context)

---

*End of Sprint 40 continuation handover pack.*
