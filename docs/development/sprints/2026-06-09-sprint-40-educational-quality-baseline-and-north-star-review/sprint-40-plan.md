# Sprint 40 — Educational Quality Baseline and North Star Review

**Date:** 2026-06-09  
**Status:** **CHARTERED — not started**  
**Type:** Educational quality baseline and North Star review  
**Predecessor:** [Sprint 39 — Architecture Optimisation](../2026-06-08-sprint-39-architecture-optimisation-and-prompt-debt-reduction/) (**CLOSED** — [sprint-39-closure-note.md](../2026-06-08-sprint-39-architecture-optimisation-and-prompt-debt-reduction/sprint-39-closure-note.md))  
**Authoritative continuation:** [sprint-40-handover-pack.md](sprint-40-handover-pack.md)

---

## Executive Summary

Sprint 40 begins the **Educational Quality Programme** — a new phase after architecture delivery and optimisation.

Sprint 38S established and validated the frozen learning-design pipeline. Sprint 39 completed architecture optimisation, prompt debt reduction, and artefact-pathway inventory. **Sprint 40 does not reopen architecture ownership.**

The goal is **not** to redesign Prism architecture. The goal is to:

1. **Review** the existing North Star before using it as the guiding standard for future educational quality work.
2. **Capture** a baseline suite of current outputs from the frozen architecture.
3. **Compare** current outputs against the confirmed or revised North Star.
4. **Prioritise** future educational quality improvements — **without implementing them** in this sprint.

Sprint 40 is an **evidence-gathering and decision sprint**. Improvements follow only after baseline, gap analysis, and priority setting are complete.

---

## Relationship to Sprint 38S and Sprint 39

| Sprint | Role | Sprint 40 inherits |
|--------|------|-------------------|
| **38S** | Delivered Episode Plan V1, DLA population-only contract, GAM-PRES, Page compose/render split; proved `fullOk` on EV-38S-AFTER-4 | **Frozen ownership model** — not to be relitigated |
| **39** | GAM Wave B, Design Page hygiene, architecture inventory; deferred educational quality to this programme | **Optimised prompts** and **pathway inventory** as context |
| **38Q** | Investigated instructional depth; recommended Episode Plan (now implemented in 38S) | **North Star source material** — aspirations, taxonomy, gap registers |

Sprint 40 assumes architecture is **settled**. Any finding that appears to require ownership change must be recorded as a **future architecture sprint candidate**, not implemented under this charter.

---

## Frozen Architecture Statement

```text
KM → LO → Episode Plan → DLA → GAM → Design Page → Render
```

| Step | Owns | Must not |
|------|------|----------|
| **Episode Plan** | **Planning** — archetype + beat order | Author material types, obligations, or bodies |
| **DLA** | **Population** — obligations from `episode_plans` | Replan beats, archetype, or session arc |
| **GAM** | **Realisation** — `required_materials` bodies | Redesign activities or collapse obligations |
| **Design Page** | **Compose** — sections, membership, preserve bodies | Plan, populate, or author GAM bodies |
| **Renderer** | **Presentation** — HTML transport | Alter pedagogic ownership |

**Harness baseline (must remain green; no architecture edits):**

```text
fullOk:  true
proofOk: true
roleOk:  true
```

---

## Sprint Goals

| # | Goal |
|---|------|
| G1 | Confirm, revise, or retire North Star elements so a practical **North Star v2** standard exists for educational quality work |
| G2 | Define and capture an **Educational Quality Benchmark Suite** from current pipeline outputs |
| G3 | Document **gaps** between current outputs and the North Star across agreed evaluation dimensions |
| G4 | Produce a **prioritised register** of future educational quality work packages |
| G5 | Close Sprint 40 with **zero architecture changes** |

---

## Workstreams

### Workstream A — North Star Review

**Purpose:** Review existing North Star documentation before using it as the guiding standard.

**Questions:**

- What does the North Star currently say?
- Does it still reflect the architecture after Sprint 38S/39?
- Which parts are **educational aspirations**?
- Which parts are **architectural assumptions** (now settled)?
- Which parts should be **confirmed, revised, retired, or clarified**?
- What should **North Star v2** mean in practical output terms?

**Primary sources:** [38Q-1 what-good-looks-like](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-1-what-good-looks-like-baseline.md) · [38Q-2 episode taxonomy](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-2-episode-taxonomy-catalogue.md) · [38I-4 exemplars](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/) · [38Q-3 gap analysis](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)

**Deliverable:** `observations/40S-1-north-star-review.md`

---

### Workstream B — Educational Quality Benchmark Suite

**Purpose:** Create a baseline suite of current outputs from the frozen architecture.

**Initial benchmark candidates:**

| ID | Scenario | Delivery mode |
|----|----------|---------------|
| B1 | **Inflation** | Self-study |
| B2 | **Inflation** | Workshop |
| B3 | **Karl Marx** | Workshop |

**Optional later candidate:** Research Methods — self-study

**Per benchmark, capture:**

- Brief (goal, delivery context, resolved factors)
- Delivery mode
- Workflow path (steps included)
- Artefacts produced (`episode_plans`, `learning_activities`, `activity_materials`, `page`, render where available)
- Generated outputs (paths to JSON/HTML/fixtures)
- Notable strengths and weaknesses (qualitative, evidence-linked)

**Primary sources:** [EV-38S-AFTER-4 artefacts](../2026-06-06-sprint-38s-episode-plan-v1-implementation/artefacts/) · `ev-38s-production-pipeline-chase.mjs` · `tests/fixtures/page-render/` · any fresh production runs on frozen pipeline

**Deliverable:** `observations/40S-2-educational-quality-baseline-suite.md`  
**Supporting artefacts (recommended):** `artefacts/40S-BENCHMARK-*.json` (indexed in observation doc)

---

### Workstream C — Current Output vs North Star Gap Analysis

**Purpose:** Compare benchmark outputs against the confirmed or revised North Star from Workstream A.

**Evaluation dimensions:**

| Dimension | Focus |
|-----------|-------|
| Explanation quality | Concept exposition, criteria clarity, disciplinary accuracy |
| Worked thinking quality | Expert modelling, visible reasoning, fading |
| Guided practice quality | Scaffolds, hints, partial completion, task progression |
| Verification quality | Checklists, repair paths, self-check depth |
| Transfer quality | Application to new contexts, assumption-breaking |
| Evaluation and judgement quality | Independent judgement, evidence use, Evaluate trio |
| Coherence of learning journey | Arc, progression, intellectual bridges |
| Authenticity | Topic-specific depth vs generic worksheet feel |
| Learner independence | Self-study usability without tutor dependency |
| Workshop usefulness | Facilitator value, sequence fit, session materials |
| Instructor support | Run guidance, timing, debrief affordances |

**Deliverable:** `observations/40S-3-current-output-vs-north-star-gap-analysis.md`

---

### Workstream D — Educational Quality Improvement Priorities

**Purpose:** Produce a prioritised set of future educational quality work packages.

**Do not implement improvements in Sprint 40** unless explicitly chartered in a successor sprint.

**Likely candidate areas (to be validated by gap analysis):**

- Richer concept exposition
- Stronger worked examples and expert walkthroughs
- Better judgement modelling
- Improved transfer prompts
- More useful verification and repair guidance
- Stronger evaluation activities
- Better workshop facilitation value
- Clearer learner narrative and session journey

**Deliverable:** `observations/40S-4-educational-quality-priorities.md`

---

## Non-Goals

Sprint 40 explicitly **does not**:

| Area | Non-goal |
|------|----------|
| **Architecture** | Modify Episode Plan, DLA, GAM, Design Page, renderer, workflow chaining, PF-11, population contract, workbook contract |
| **Code** | Change `app.js`, `lib/*` validators, merge logic, or augmentation paths |
| **Prompts** | Rewrite packs, runtime blocks, or contracts to improve quality |
| **Implementation** | Implement North Star improvements, PEL expansion, or teacherly reasoning programmes |
| **Visual affordances** | Image generation, diagrams, activity visuals |
| **Ownership** | Reopen 38S/39 settled decisions |

---

## Exit Criteria

Sprint 40 completes when **all** of the following are true:

| # | Criterion | Verification |
|---|-----------|--------------|
| 1 | North Star reviewed and confirmed or revised | `observations/40S-1-north-star-review.md` published; North Star v2 statement recorded |
| 2 | Benchmark suite defined and baseline outputs captured | `observations/40S-2-educational-quality-baseline-suite.md` + artefact index |
| 3 | Current outputs compared against North Star | `observations/40S-3-current-output-vs-north-star-gap-analysis.md` |
| 4 | Educational quality gaps documented | Gap register with dimension scores or qualitative ratings |
| 5 | Future priorities proposed | `observations/40S-4-educational-quality-priorities.md` with ranked work packages |
| 6 | No architecture changes made | No edits to architecture code, packs, or ownership contracts |
| 7 | Harness remains green | `ev-38s-production-pipeline-chase.mjs` — `fullOk`, `proofOk`, `roleOk` unchanged |
| 8 | Sprint 40 closure note published | Handover pack updated; sprint status CLOSED |

---

## Validation Approach

Sprint 40 is **documentation-first**. Validation differs from architecture sprints.

### Architecture regression guard (mandatory at sprint start and end)

```bash
node docs/development/sprints/2026-06-06-sprint-38s-episode-plan-v1-implementation/artefacts/ev-38s-production-pipeline-chase.mjs
```

**Required:** `fullOk: true`, `proofOk: true`, `roleOk: true` — confirms no accidental architecture drift.

### Benchmark capture validation

| Check | Method |
|-------|--------|
| Artefact provenance | Each benchmark cites run ID, date, workflow steps, and file paths |
| Pipeline completeness | Self-study benchmarks include EP → DLA → GAM → Page chain where applicable |
| Render availability | Note RF2/RF3 render gaps where HTML not supplied (known from EV-38S-AFTER-4) |
| Workshop benchmarks | Document PEC gate, `learning_sequence`, facilitator profile where relevant |

### Review quality gates

| Gate | Requirement |
|------|-------------|
| North Star v2 | Separates **aspiration** from **settled architecture** explicitly |
| Gap analysis | Every gap links to benchmark evidence, not speculation |
| Priorities | Each priority cites gap ID, dimension, delivery mode, and suggested intervention class (prompt / contract / exemplar / harness — not implementation commitment) |

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Conflating quality gaps with architecture defects | **High** | Charter + gap template require “intervention class”; architecture changes deferred to separate sprint |
| North Star review reopens Episode Plan debate | **High** | 38Q Episode Plan recommendation is **implemented** in 38S — review treats it as settled; focus on output quality within frozen chain |
| Implementing fixes before evidence | **High** | Work packages forbid implementation; priorities doc only |
| Stale benchmark artefacts | **Medium** | Prefer EV-38S-AFTER-4 + fresh runs; record `capturedAt` and harness version |
| Workshop vs self-study incomparability | **Medium** | Separate gap tables per delivery mode; do not merge scores blindly |
| 38Q “worksheet-oriented” finding applied without post-38S re-baseline | **Medium** | B benchmarks must use **current** pipeline outputs, not pre–Episode Plan artefacts |
| Scope creep into visual affordances or PEL implementation | **Medium** | Deferred items register; VA and PEL noted as future programmes only |

---

## Deliverables

| # | Deliverable | Workstream |
|---|-------------|:----------:|
| 1 | `observations/40S-1-north-star-review.md` | A |
| 2 | `observations/40S-2-educational-quality-baseline-suite.md` | B |
| 3 | `observations/40S-3-current-output-vs-north-star-gap-analysis.md` | C |
| 4 | `observations/40S-4-educational-quality-priorities.md` | D |
| 5 | `sprint-40-closure-note.md` (at sprint end) | — |
| 6 | `artefacts/40S-BENCHMARK-*` (optional indexed captures) | B |

---

## Recommended Execution Sequence

1. Read Sprint 38S closure and Sprint 39 closure.
2. Locate and review existing North Star documentation (38Q, 38I, deferred EQ register).
3. Produce North Star review (Workstream A).
4. Generate or index benchmark outputs (Workstream B).
5. Perform output-vs-North-Star gap analysis (Workstream C).
6. Produce educational quality priority recommendations (Workstream D).
7. Publish Sprint 40 closure note.

**Dependency graph:**

```text
38S/39 closure (read) ──► A North Star review ──► C Gap analysis ──► D Priorities
                              ▲                        ▲
                              └── B Benchmark suite ───┘
```

Workstream B can start in parallel with A once benchmark candidate list is confirmed. Workstream C requires A (North Star v2) and B (baseline outputs). Workstream D requires C.

---

## Reference Index

| Document | Role |
|----------|------|
| [38S-architecture-closure-note.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-3/38S-architecture-closure-note.md) | Settled architecture authority |
| [sprint-39-closure-note.md](../2026-06-08-sprint-39-architecture-optimisation-and-prompt-debt-reduction/sprint-39-closure-note.md) | Predecessor closure |
| [sprint-39-artefact-pathway-inventory.md](../2026-06-08-sprint-39-architecture-optimisation-and-prompt-debt-reduction/sprint-39-artefact-pathway-inventory.md) | Pathway and strategic position |
| [sprint-39-deferred-items.md](../2026-06-08-sprint-39-architecture-optimisation-and-prompt-debt-reduction/sprint-39-deferred-items.md) | EQ programme seed items |
| [38Q-6 sprint closure](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-6-sprint-closure.md) | North Star / teaching architecture lineage |
| [EV-38S-AFTER-4-run-log.json](../2026-06-06-sprint-38s-episode-plan-v1-implementation/artefacts/EV-38S-AFTER-4-run-log.json) | Primary Inflation self-study proof |

---

*End of Sprint 40 plan.*
