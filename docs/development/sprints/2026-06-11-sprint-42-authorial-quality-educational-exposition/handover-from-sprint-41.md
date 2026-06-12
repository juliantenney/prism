# Handover from Sprint 41 → Sprint 42

**From:** Sprint 41 — Educational Framework Integration (closed)  
**To:** Sprint 42 — Authorial Quality / Educational Exposition (in progress — through Slice 42-10)

Authoritative Sprint 41 closure: [`../2026-06-11-sprint-41-educational-framework-integration/sprint-41-closure-report.md`](../2026-06-11-sprint-41-educational-framework-integration/sprint-41-closure-report.md)

---

## Current Position

*Updated after investigations and implementation through Sprint 42-10. Resume the next chat from **Next likely investigation** below.*

### Questions now largely resolved

- The workflow is not missing a stage.
- The learner journey already exists upstream.
- Generate Activity Materials is not the primary bottleneck.
- Learning Sequence contains useful progression signals.
- Episode Plans are not the missing ingredient.
- The workflow already contains substantial EQF and PEL pedagogy.
- Source-ingest and topic-generated routes now both converge on `learning_content` (Sprint 42-10).

### Most important findings

1. `learning_content` is the strongest candidate for the intellectual/resource spine of a learner-facing resource.
2. `knowledge_model` is the strongest conceptual spine.
3. DLA is the strongest activity spine.
4. GAM is the strongest instructional/explanatory spine.
5. Design Page is currently activity-centred and organised primarily around `learning_activities`.
6. The learner experience therefore tends towards **activity sequence** rather than **authored investigation**.

### Working hypothesis

The remaining gap is not primarily:

- missing content
- missing pedagogy
- missing journey
- missing transitions
- missing materials

**The remaining gap is composition.**

Design Page currently behaves as:

**Activities → Resource**

The desired learner experience is closer to:

**Resource → Activities embedded within a larger investigation**

### Sprint 42-10 outcome

Source-ingest workflows now follow:

```text
Normalize Content
→ Generate Learning Content
→ learning_content
→ Model Knowledge
```

This creates parity with topic-generated workflows and ensures both major entry routes produce `learning_content` before conceptual extraction.

No schema changes. No renderer changes. No workflow-stage redesign.

Deliverable: [`sprint-42-slice-10-source-ingest-learning-content-parity.md`](sprint-42-slice-10-source-ingest-learning-content-parity.md)

### Next likely investigation

Determine how Design Page can use `learning_content` as a stronger organising spine so that learners experience:

**Question → Explanation → Investigation → Judgement → Reflection**

rather than:

**Activity → Activity → Activity → Activity**

while preserving DLA/GAM fidelity and without introducing new schemas, workflow stages, or renderer changes.

Related prior work: journey assimilation (42-6), resource spine investigation (42-8), GAM preservation audit (42-7).

### Evidence note

For learner-experience judgements, prefer **current manual workflow runs** and **fresh artefacts**.

Treat conclusions based primarily on:

- Sprint 30 Marx fixtures
- hand-edited fixtures
- 42-4 harness captures

as **lower-confidence evidence** than fresh manual runs.

### Investigation and slice index (42-1 through 42-10)

| ID | Focus | Type | Deliverable |
| -- | ----- | ---- | ----------- |
| 42-1 | Exposition baseline audit | Investigation | `observations/42-1-exposition-baseline-audit.md` |
| 42-2 | Design Page authorial exposition contract | Implementation | `lib/ld-authorial-exposition.js` |
| 42-3 | DLA activity preamble exposition | Implementation | `lib/ld-activity-preamble-exposition.js` |
| 42-4 | Live-run validation / topic fidelity | Investigation | `observations/42-4A-*.md`, `42-4B-*.md` |
| 42-5 | Design Page journey context | Investigation | `observations/42-5-design-page-journey-context-investigation.md` |
| 42-6 | Journey assimilation at compose | Implementation | `lib/ld-journey-assimilation.js`, `sprint-42-slice-6-journey-assimilation.md` |
| 42-7 | GAM preservation audit | Investigation | `observations/42-7-gam-preservation-audit.md` |
| 42-8 | Learner resource spine | Investigation | `observations/42-8-resource-spine-investigation.md` |
| 42-9 | Generate vs Normalise LC parity | Investigation | (conversation / parity analysis) |
| 42-10 | Source-ingest `learning_content` parity | Implementation | `sprint-42-slice-10-source-ingest-learning-content-parity.md` |

---

## What Sprint 41 delivered

Sprint 41 integrated the Sprint 40 Educational Quality Framework and completed the learner-framing pipeline.

| Layer | Status | Key artefacts |
| ----- | ------ | ------------- |
| EQF prompt (Slices 1–2) | Complete | `lib/educational-quality-framework-prompt.js` |
| EQF evaluator (Slice 3) | Complete | `lib/educational-quality-framework-evaluator.js` |
| Diagnostics (Slice 4) | Complete | `tools/evaluate-educational-quality-framework.js` |
| Learner framing — any delivery mode (Slice 5) | Complete | `shouldApplyLearnerPagePedagogicFramingScaffold` |
| Design Page preservation (Slice 5 follow-up) | Complete | `repairLearnerPageCompositionFromUpstream` |
| Mandatory DLA framing (Slice 5 finalisation) | Complete | `activity_preamble` + cognition field per activity |

### Do not reopen without explicit rescoping

- EQF integration and step manifestation
- PEL/EQF learner framing architecture
- Mandatory framing field set and preservation repair
- New workflow steps or schema changes for “educational structure”

---

## Principal conclusion (carries into Sprint 42)

**The educational architecture is functioning well.**

Workflow structure, brief semantics, episode-plan obligation population, activity alignment, sequencing, judgement scaffolds, transfer orientation, and metacognitive support are integrated and measurable.

**The primary remaining weakness is learner-facing exposition** — narrative flow, explanatory depth, publication-quality instructional prose, and readable integration of framing fields — **not** missing framework machinery.

Sprint 42 exists to make resources **read as well as they structure**.

---

## Current generation architecture (unchanged)

Resolved LD step prompts flow through `applyWorkflowStepRuntimePromptAugmentations` in `app.js`:

1. Pedagogic cognition contract
2. **EQF** (`applyEducationalQualityFrameworkPromptBlockToDraft`)
3. Learner-page scaffolds (framing, rhetoric — delivery-gated where applicable)
4. Materials copy, table fidelity
5. PEL enrichment
6. **Design Page compose** (`lib/ld-design-page-compose-contract.js`)
7. Episode plan, visual affordance, math, strict JSON

**Learner-page mandatory minimum (DLA):** every activity requires `activity_preamble` + at least one cognition-orientation field. Capture validation: `applyLearnerPageDlaFramingValidationToCapture`.

**Design Page:** framing fields preserved/repaired from upstream `learning_activities`; unauthorized output-size omissions stripped.

---

## Validation baseline (three workflows)

| Workflow | Key artefact | EQF score | Structural strength | Exposition gap (hypothesis) |
| -------- | ------------ | --------- | ------------------- | --------------------------- |
| **Inflation workshop** | `tests/fixtures/page-render/ld-inflation-workshop-page.json` | 5/8 | Tasks, tables, session blocks | Wrapper prose thin; facilitator-session shape over narrative arc |
| **Marx workshop** | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` | 5/8 | Judgement/discussion design | Framing fields may read as labels bolted to tasks |
| **Marx self-study** | `tests/fixtures/page-render/marx-self-study-page.json` | 7/8 | Journey, PEL, faded scaffolding | Best exemplar — still weak on explicit learning-success prose; compare to `marx-self-study-design-quality-page.json` (4/8) for thin-variant contrast |

Full validation: Sprint 41 `sprint-41-validation-report.md`. Impact captures pending: `captures/sprint-41-impact/`.

---

## Known limitations Sprint 42 inherits

1. PRISM does not evaluate external LLM output during run — exposition validation needs saved artefacts or manual review
2. EQF evaluator measures dimension presence, not prose quality
3. Compose repair restores missing fields; does not improve weak or repetitive phrasing
4. Mandatory framing ensures fields exist; does not ensure they read well on the page
5. Renderer already displays framing when present — exposition improvement is primarily **generation/compose** work

---

## Sprint 42 scope

### In scope

- Richer learner-facing prose in prompts and compose contracts
- Explanatory depth and conceptual narrative
- Smoother inter-activity transitions (`intellectual_coherence_bridge`, page wrappers, section prose)
- Publication-ready tone and rhythm
- Integration of preamble and cognition cues into coherent instructional voice
- Optional: lightweight exposition heuristics or review checklists (diagnostic only, like Sprint 41 EQF evaluator)

### Out of scope (unless later agreed)

- New EQF dimensions
- New workflow steps
- Schema redesign
- Renderer structural redesign
- GAM structural redesign
- Further PEL/EQF architecture work

---

## Likely implementation surfaces

| Surface | Why |
| ------- | --- |
| **Design Page compose** | Final learner page assembly — highest visibility for “assembled” feel |
| **DLA activity fields** | Where preamble and cognition text is first authored |
| **`lib/ld-self-directed-rhetoric.js`** | Existing closure, progression, and voice vocabulary |
| **Page-level sections** | `overview`, `learning_purpose`, `study_tips` — narrative spine |
| **EQF manifestation (read-only)** | May add exposition lines to existing step blocks — not new dimensions |

### Regression suites to keep green

- `tests/workflow-learner-page-mandatory-framing.test.js`
- `tests/workflow-learner-page-design-page-preservation.test.js`
- `tests/workflow-learner-page-framing-delivery-mode.test.js`
- `tests/workflow-self-directed-activity-framing-adoption.test.js`
- `tests/utility-self-directed-activity-framing.test.js`

---

## Slice sequence (historical plan — superseded by Current Position)

Slices 42-1 through 42-10 are complete or documented. **Do not reopen** completed investigation conclusions without fresh manual-run evidence. Next work: **Design Page composition spine** (see Current Position).

| Slice | Focus | Status |
| ----- | ----- | ------ |
| **42-1** | Exposition baseline audit | Done |
| **42-2** | Design Page authorial exposition contract | Done |
| **42-3** | DLA exposition guidance | Done |
| **42-4** | Validation / live-run fidelity | Done (investigation) |
| **42-5 – 42-9** | Journey, spine, GAM, LC parity investigations | Done |
| **42-10** | Source-ingest `learning_content` parity | Done |

---

## Files to read first

1. `sprint-41-closure-report.md` (Sprint 41 folder)
2. `tests/fixtures/page-render/marx-self-study-page.json`
3. `lib/ld-design-page-compose-contract.js`
4. `lib/ld-self-directed-rhetoric.js`
5. `app.js` — `buildLearnerPageDlaOutputContractOverrideBlock`, `buildSelfDirectedLearnerPageActivityFramingPromptBlock`
6. `docs/architecture/renderer-export-behavior.md` (understand render boundaries — do not redesign)
