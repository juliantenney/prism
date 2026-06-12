# Sprint 43-01 — Educational Salience Baseline

**Date:** 2026-06-12  
**Type:** Investigation plan only — no implementation, prompt, schema, renderer, or workflow changes  
**Prerequisite reading:** [`handover-from-sprint-42.md`](handover-from-sprint-42.md), [`README.md`](README.md), Sprint 42 [`43-00` problem reframing](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/43-00-problem-reframing-educational-salience.md)

---

## Purpose

Establish a **baseline measurement of educational salience** on existing artefacts before any Sprint 43 implementation or compose intervention is considered.

Sprint 42 concluded that educational structure **exists upstream** but does not consistently **own** the learner experience. Slice 43-01 must make that claim **operational and auditable** — distinguishing:

- **Presence** — signal exists in JSON, fields, or prompts
- **Salience** — learner or reviewer can **encounter, recognise, and experience** the signal as organising the resource

This investigation does **not** assume solutions. It produces evidence for the Sprint 43 **decision** on what learner experience Design Page should optimise for.

---

## Research question

> For benchmark learner resources, how much of the educational structure generated upstream is **salient** in the final composed and rendered page — and where does salience weaken?

Sub-questions:

1. At which workflow boundary does each salience dimension weaken most (DLA → GAM → Design Page → render)?
2. Is low salience primarily **structural** (section authority), **visual** (materials dominance), or **rhetorical** (thin wrappers)?
3. Do upstream quality and downstream salience **decouple** (good LC, activity-led page)?

---

## Existing evidence

Treat as **confirmed** unless this investigation contradicts on fresh artefact read:

| Finding | Source | Confidence |
| ------- | ------ | ------------ |
| Upstream educational structure exists on Marx run | 42-13, manual workflow review | High |
| Design Page activity + material authority (static) | 42-11A Verdict A | High |
| PEL weak at page level (static) | 42-12 Verdict B | High |
| LC available on both entry routes | 42-10 | High |
| Rendered Marx page activity-led | 42-13, manual review | Medium-high |
| Specific salience scores per dimension | **Not established** | — |
| Generalisation beyond Marx self-study | **Open** | — |

**Evidence hierarchy for this investigation:**

1. **Marx manual run artefacts** — composed `page.json`, upstream captures (LC, KM, LO, DLA, GAM), rendered HTML
2. **Sprint 42 observation documents** — rubric design input only
3. **Benchmark fixtures** — `tests/fixtures/page-render/marx-self-study-page.json` etc. — secondary; label lower confidence

---

## Hypotheses

To be tested — not assumed true:

| ID | Hypothesis | If confirmed | If disconfirmed |
| -- | ---------- | ------------ | --------------- |
| H1 | **Inquiry exists but lacks salience** — governing question strong in LC, weak as page frame | Authority problem; LC not structural spine | Inquiry may be absent or thin upstream on some runs |
| H2 | **Judgement exists but lacks salience** — evaluation in tasks/materials, not resource-closing arc | Judgement activity-local | Judgement may be missing upstream on some workflows |
| H3 | **PEL exists but lacks salience** — fields preserved, buried in layout | Composition/visual weight problem | PEL may be stripped at compose |
| H4 | **Progression exists but lacks salience** — LO/EP/sequence not readable as arc | Progression signalling gap at page level | Progression may not survive DLA |
| H5 | **Independence exists but lacks salience** — scaffold fade not learner-visible | Page-level independence signalling gap | Independence may not be authored upstream |
| H6 | **Activity structure dominates perception** — regardless of wrapper quality | Narrative authority = activity + material | Other factors (thin LC, missing bind) may dominate on some runs |

**Null hypothesis for sprint direction:** If all dimensions show **high salience** on Marx artefacts, Sprint 43 problem reframing may need revision for that workflow — investigate fixture/route mismatch before implementation.

---

## Method

### Phase 1 — Artefact inventory

Collect for Marx manual run (minimum) and note availability for inflation/climate:

| Artefact | File / capture location |
| -------- | ------------------------ |
| `learning_content` | Workflow capture |
| `knowledge_model` | Workflow capture |
| `learning_outcomes` | Workflow capture |
| `episode_plans` | Workflow capture |
| `learning_activities` | DLA capture |
| `activity_materials` | GAM capture |
| `learning_sequence` | CLS capture (if present) |
| Composed `page` | Design Page capture |
| Rendered HTML | Export or render output |

Record: workflow ID, date, route (topic vs source-ingest), whether LC was bound to Design Page.

### Phase 2 — Presence audit

For each salience dimension, document **where the signal appears** in upstream artefacts and composed page JSON:

| Dimension | Upstream indicators | Page JSON indicators |
| --------- | ------------------- | -------------------- |
| Inquiry | LC governing inquiry, sections; DLA progression | overview, knowledge_summary, activity preambles |
| Judgement | LO evaluation outcomes; evaluate tasks; GAM decision framework | expected_output, materials sections, final activity |
| Progression | LO sequence; EP beats; LS transitions | learning_purpose, bridges, activity order |
| Metacognition | PEL fields on DLA; GAM self-check/closure | preserved cognition fields; study_tips |
| Independence | Faded scaffolding in GAM; transfer tasks; rhetoric | materials structure; closure depth |

Use existing evaluators where applicable (diagnostic only):

- `evaluatePelOrientationContractSatisfaction`
- `evaluatePelReasoningContractSatisfaction`
- EQF evaluator (`metacognition`, `learning_success`, `independence` dimensions)

Compare scores: DLA capture vs composed page vs rendered text extract.

### Phase 3 — Salience audit (manual structured read)

Two reviewers (or one reviewer + structured checklist) perform **blind-to-hypothesis** read of rendered page:

1. **First-impression frame** — Without reading activity titles first, what is this resource “about”?
2. **Inquiry trace** — Can reviewer state governing question and investigation arc?
3. **Progression trace** — Can reviewer describe what builds on what?
4. **Judgement trace** — Can reviewer describe how evaluation deepens?
5. **PEL trace** — Where does self-monitoring appear? Meaningful or buried?
6. **Independence trace** — Where does scaffolding fade?
7. **Structural scan** — What owns visual and sectional dominance (wrappers vs activities vs materials)?

Rate each dimension on a simple scale (proposed for investigation — refine in output doc):

| Rating | Meaning |
| ------ | ------- |
| **Absent** | Not detectable in artefact or render |
| **Present** | Detectable if searched for |
| **Salient** | Obvious on normal read; organises experience |
| **Dominant** | Primary frame of the resource |

### Phase 4 — Boundary analysis

For each dimension that drops from **Present** to below **Salient**, identify last strong stage:

```text
LC / KM / LO / EP → DLA → GAM → Design Page compose → render
```

Map to 42-11A authority types: activity, material, inquiry, page-level.

### Phase 5 — Synthesis

Produce observation document `observations/43-01-educational-salience-baseline.md` (created when investigation executes — not part of this plan).

---

## Artefacts to inspect

### Primary (required)

- Marx manual self-study run — full artefact chain + rendered HTML
- Sprint 42 closure docs for rubric alignment

### Secondary (if available)

| Artefact | Purpose |
| -------- | ------- |
| `tests/fixtures/page-render/marx-self-study-page.json` | Compare hand-edited benchmark shape vs live compose |
| `tests/fixtures/page-render/ld-inflation-workshop-page.json` | Session-shaped contrast |
| `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` | Discussion/judgement contrast |

### Static reference (no re-audit required)

- `lib/ld-design-page-compose-contract.js` — authority contracts
- `observations/42-11A-design-page-static-provenance-audit.md`
- `observations/42-12-pel-manifestation-audit.md`

---

## Expected outputs

| Output | Description |
| ------ | ----------- |
| **`observations/43-01-educational-salience-baseline.md`** | Main deliverable when investigation runs |
| **Salience matrix** | Dimension × stage × rating (Absent / Present / Salient / Dominant) |
| **Presence vs salience gap table** | Where structure exists but does not own experience |
| **Boundary map** | Stage at which each dimension weakens |
| **Evaluator comparison** | DLA vs page EQF/PEL diagnostic scores (if artefacts available) |
| **Confidence notes** | What is confirmed vs single-run inference |
| **Decision brief** | Evidence pack for “what should Design Page optimise for?” — no implementation prescription |

---

## Decision points

After 43-01 completes, Sprint 43 should be able to decide:

| Decision | Evidence needed from 43-01 |
| -------- | ------------------------- |
| **Is salience gap real on benchmarks?** | Salience ratings vs presence audit |
| **Primary failure mode** | Structural vs visual vs rhetorical (H6 and boundary analysis) |
| **Which dimensions matter most** | Dimension ratings; Marx brief alignment |
| **Learner experience target** | First-impression read vs desired Question → … → Reflection frame |
| **Whether investigation-only phase continues** | If Marx shows high salience, expand to other workflows before any implementation slice |
| **Whether compose intervention is in scope** | Only after decision + success criteria agreed — not automatic |

**Key decision (unchanged from 43-00):**

> What exact learner experience should Design Page be optimising for?

43-01 supplies evidence; it does **not** answer this question.

---

## Non-goals

Slice 43-01 does **not**:

- Propose or implement compose, prompt, schema, renderer, or workflow changes
- Reopen Sprint 41 EQF/PEL architecture
- Treat low salience as proof of missing upstream pedagogy without presence audit
- Use harness captures as sole evidence when manual run artefacts exist
- Define success thresholds that commit Sprint 43 to a specific solution
- Replace manual learner-experience read with evaluator scores alone

---

## Suggested execution order

1. Locate and inventory Marx manual run artefacts
2. Run presence audit on full chain
3. Run evaluator diagnostics (DLA vs page)
4. Perform structured salience read on rendered HTML
5. Complete boundary analysis and salience matrix
6. Write `observations/43-01-educational-salience-baseline.md`
7. Review against Sprint 43 success criteria in [`README.md`](README.md)
8. Hold decision session on learner experience target before any 43-02 implementation planning

---

## Related documents

| Document | Role |
| -------- | ---- |
| [`handover-from-sprint-42.md`](handover-from-sprint-42.md) | Sprint entry context |
| [`README.md`](README.md) | Sprint scope and success criteria |
| [`43-00` problem reframing](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/43-00-problem-reframing-educational-salience.md) | Problem definition |
| [`42-13` synthesis](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/42-13-sprint-synthesis-authorial-quality-findings.md) | Sprint 42 closure |
