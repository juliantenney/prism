# Session handover — Sprint 27 (Assessment & feedback elicitation semantics)

**Role:** authoritative for **this pack only**.

**Pack path:** `docs/development/sprints/2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/`

**Date:** 2026-05-21

**Live repo rule:** `app.js`, `domains/learning-design/`, and `tests/` are authoritative. This pack is investigation and ontology — refresh when behaviour or evidence changes.

---

## Continue here (next chat)

1. Read [`sprint-27-charter.md`](sprint-27-charter.md) (scope + H1–H6).  
2. Open [`elicitation-evidence-matrix.md`](elicitation-evidence-matrix.md) — complete empty cells for **27-1**.  
3. Follow [`investigation-plan.md`](investigation-plan.md) Phase 1 (read-only traces).  
4. Run `node --test tests/*.test.js` — expect **259** pass.  
5. **Do not implement fixes** until 27-1 evidence and ontology review are done.

**Framing:** This is **not** a renderer sprint. Sprint 26 renderer hotfixes are **closed** unless they block reading assessment semantics from export HTML.

---

## Sprint 27 in one paragraph

Sprint 26 showed PRISM can **generate** sophisticated activity pedagogy (misconception discussion, structured materials) and **assessment items**, but **elicitation** still prioritises assessment **type** and **count** over **feedback timing**, **answer visibility**, **discussion mode**, and **learner interaction model**. Renderer flattening was largely presentation-layer and is now hotfixed. The unresolved programme is **how pedagogical assessment intent is modelled and preserved** from brief → workflow → artefacts → page → HTML.

---

## What Sprint 26 closed (do not re-open without cause)

| Track | Issue | Status |
|-------|--------|--------|
| **26-B** | Assessment MCQs missing / wrong section binding in export | **Closed** — R26-PI-007, R26-PI-008 |
| **26-A** | Missing Design Learning Activities / Generate Activity Materials | **Fixed** — `activities_required`, pack/heuristics |
| **26 renderer** | Task card split, typed materials, T/F layout, output markdown | **Closed** — R26-007–010; see renderer pause note |

---

## Renderer status for Sprint 27 investigators

### Closed (treat as done)

- Assessment item rendering (`renderQuestionBlocks`, `assessment_check` section)  
- Section binding (`section_id` + content, not catalogue index alone)  
- Task card splitting (`splitTaskCardBulletClaims`)  
- Typed material rendering (`analysis_template`, `discussion_prompts`, `evaluation_checklist`)  
- Markdown `expected_output` in output block  
- True/false learner layout (`util-true-false-options`; hide answers when `feedback_display: none`)

### Open (Sprint 27 focus)

- Assessment **semantics** in generation and composition  
- Feedback **ontology** (timing, mode, visibility)  
- Elicitation **weighting** (which questions/factors exist)  
- Answer visibility as **pedagogy** not just export flag  
- Pedagogical **interaction modelling** (discussion vs retrieval vs diagnostic)

---

## Evidence cases — where to look

| Case | Narrative | Fixtures / tests |
|------|-----------|------------------|
| **RNA/HCV sparse workshop** | Topology dropped activities; formative assessment dominated | `tests/workflow-brief-ld-sparse/rna-virus-activities-formative.json`, `tests/workflow-ld-rna-sparse-brief-topology.test.js` |
| **Inflation self-study quiz** | Retrieval-oriented page; `feedback_display` drives export | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json`, `tests/utility-ld-inflation-page-render.test.js` |
| **Climate misconception discussion** | Rich activity pedagogy; delayed correctness; T/F items | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json`, `tests/utility-ld-climate-misconception-page-render.test.js` |

Sprint 26 pack detail: [`../2026-05-20-sprint-26-pedagogical-intent-elicitation-orchestration/`](../2026-05-20-sprint-26-pedagogical-intent-elicitation-orchestration/)

---

## Core hypotheses (investigate, do not assume)

| ID | Statement |
|----|-----------|
| H1 | Generation richer than composition/rendering preserve |
| H2 | Default retrieval/correctness-first assessment workflows |
| H3 | Feedback semantics under-elicited vs type/count |
| H4 | Answer visibility = presentation, not pedagogy |
| H5 | Activities step richer interaction semantics than assessment step |
| H6 | Intent not preserved end-to-end |

Record verdicts in [`review-log.md`](review-log.md) as R27-00x.

---

## Key artefacts by pipeline stage

| Stage | Artefact | Typical path / ID |
|-------|----------|-------------------|
| Brief | Factory goal, resolved factors | UI export / `extractWorkflowBriefExplicitFactors` |
| Topology | Workflow `steps[]` | Saved workflow JSON |
| Activities | `learning_activities` | Step output JSON |
| Materials | `activity_materials` | Step output JSON |
| Assessment | `assessment_items` | Step output JSON |
| Feedback | `feedback_pack` | Step output JSON (often skipped in lean paths) |
| Page | `page` with `sections[]` | Design Page output |
| Render | HTML export | Utilities pipeline |

---

## Recommended first actions (27-1)

| # | Action |
|---|--------|
| 1 | Complete rows in [`elicitation-evidence-matrix.md`](elicitation-evidence-matrix.md) for RNA, inflation, climate |
| 2 | Audit LD `workflowBriefConfig` optional factors vs [`assessment-semantics-notes.md`](assessment-semantics-notes.md) gap list |
| 3 | Trace `include_answers` / `feedback_display` / `feedback_required` from brief → page JSON → HTML (inflation + climate) |
| 4 | Compare pack prompts: Design Learning Activities vs Generate Assessment Items vs Design Feedback |
| 5 | Pick **one** probe from [`workflow-probe-catalogue.md`](workflow-probe-catalogue.md) for first live run (suggest: tutor-led delayed-feedback discussion quiz) |

---

## Read order

| Order | File |
|-------|------|
| 1 | [`sprint-27-charter.md`](sprint-27-charter.md) |
| 2 | [`investigation-plan.md`](investigation-plan.md) |
| 3 | [`elicitation-evidence-matrix.md`](elicitation-evidence-matrix.md) |
| 4 | [`assessment-semantics-notes.md`](assessment-semantics-notes.md) |
| 5 | [`workflow-probe-catalogue.md`](workflow-probe-catalogue.md) |
| 6 | [`review-log.md`](review-log.md) |
| 7 | Sprint 26 [`HANDOVER.md`](../2026-05-20-sprint-26-pedagogical-intent-elicitation-orchestration/HANDOVER.md) (historical evidence) |

---

## Test floor

```bash
node --test tests/*.test.js
```

**259 passed**, 0 failed (2026-05-21).

---

## Guidance for new chats

- Ask: **“Where did pedagogical intent enter, transform, or drop?”** — not **“Why doesn’t the renderer show X?”** unless export contradicts valid JSON.  
- Prefer **artefact diff** (brief factors → step params → `assessment_items` → `page.sections[]`) over prompt tweaking.  
- Tag findings by layer: **E**licitation, **O**rchestration, **G**eneration, **C**omposition, **R**endering.  
- Implementation proposals belong in **27-4** after R27 ontology decisions.
