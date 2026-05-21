# Sprint 27 index — Assessment & feedback elicitation semantics

**Pack path:** `docs/development/sprints/2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/`  
**Title:** Sprint 27 — Assessment & Feedback Elicitation Semantics  
**Date:** 2026-05-21  
**Status:** **Complete** — investigation (27-1–27-3) + implementation (27-4a–4f)

**Verification floor:** **284 passed** (`node --test tests/*.test.js`)

---

## Framing

The key issue is no longer **“Can PRISM generate assessments?”**

The key issue is:

**“How does PRISM model and preserve pedagogical assessment intent?”**

This sprint investigates **computational pedagogy semantics** across elicitation → orchestration → composition → rendering — not renderer CSS cleanup.

---

## Programme context

| Prior sprint | Outcome | Relevance to 27 |
|--------------|---------|-----------------|
| [Sprint 26 pedagogical intent](../2026-05-20-sprint-26-pedagogical-intent-elicitation-orchestration/) | Track A topology fix; Track B assessment render closed | Evidence + closed renderer blockers |
| [Sprint 26 renderer presentation](../2026-05-20-sprint-26-renderer-presentation-consolidation/) | Presentation slices 26-2–26-5 + climate materials hotfix | **Closed** unless blocking semantics work |
| [Sprint 25 composition](../2026-05-19-sprint-25-design-page-composition-renderer-consolidation/) | `page.sections[]` authority frozen | Composition probe boundary |

---

## Pack inventory

| File | Purpose |
|------|---------|
| [`sprint-27-index.md`](sprint-27-index.md) | This index |
| [`sprint-27-charter.md`](sprint-27-charter.md) | Scope, hypotheses, non-goals, slices |
| [`HANDOVER.md`](HANDOVER.md) | New-chat entry point |
| [`CURRENT-STATE.md`](CURRENT-STATE.md) | Live status |
| [`investigation-plan.md`](investigation-plan.md) | Phased investigation steps |
| [`elicitation-evidence-matrix.md`](elicitation-evidence-matrix.md) | Cross-layer evidence table |
| [`assessment-semantics-notes.md`](assessment-semantics-notes.md) | Ontology + semantic gaps |
| [`workflow-probe-catalogue.md`](workflow-probe-catalogue.md) | Suggested brief/workflow probes |
| [`review-log.md`](review-log.md) | Decisions R27-001+ |
| [`slice-27-4-charter.md`](slice-27-4-charter.md) | Bounded implementation programme (27-4) |

---

## Core hypotheses (H1–H6)

| ID | Hypothesis |
|----|------------|
| **H1** | Assessment **generation** is richer than composition/rendering preserve |
| **H2** | Assessment workflows default to **retrieval/correctness-first** unless discussion mode is explicit |
| **H3** | **Feedback semantics** are under-elicited vs type/count |
| **H4** | **Answer visibility** is treated as presentation, not pedagogy |
| **H5** | **Design Learning Activities** supports richer interaction semantics than **Generate Assessment Items** |
| **H6** | Pedagogical intent is **not consistently preserved** across the pipeline |

---

## Evidence cases (Sprint 26 carry-forward)

| Case | Primary layer | Pack reference |
|------|---------------|----------------|
| RNA/HCV sparse workshop | Topology + elicitation | Sprint 26 Track A |
| Inflation self-study retrieval quiz | Assessment render + feedback display | Sprint 26 Track B + inflation fixtures |
| Climate misconception discussion | Activity pedagogy vs assessment semantics | Climate fixture + Sprint 26 renderer hotfix |

---

## Suggested slice roadmap (27-x)

| Slice | Focus | Status |
|-------|--------|--------|
| **27-1** | Evidence matrix + runtime trace (read-only) | **Complete** |
| **27-2** | Elicitation ontology draft (`workflowBriefConfig` gaps) | **Complete** |
| **27-3** | Workflow probes + artefact captures | **Complete** |
| **27-4** | Implementation charter | **Complete** |
| **27-4a** | Elicitation & extract | **Complete** |
| **27-4b** | Topology | **Complete** |
| **27-4c** | Generation prompts | **Complete** |
| **27-4d** | Composition metadata | **Complete** |
| **27-4e** | Renderer policy | **Complete** |
| **27-4f** | Regression consolidation | **Complete** |
| **27-4g** (optional) | Design Assessment diagnostic | **Deferred** |

---

## Authoritative code (investigation)

| Area | Path |
|------|------|
| Brief extract | `app.js` — `extractWorkflowBriefExplicitFactors` |
| Brief resolve | `app.js` — `resolveWorkflowBriefFactors` |
| Workflow heuristics | `app.js` — `applyWorkflowDesignHeuristics` |
| Assessment render | `app.js` — `renderQuestionBlocks`, `renderAssessmentCheckSectionBlock` |
| Page composition | LD pack — Design Page step; `strictCompositionClosure` |
| Pack config | `domains/learning-design/domain-learning-design-step-patterns.md` |

---

## Resume

1. Read [`CURRENT-STATE.md`](CURRENT-STATE.md) and [`review-log.md`](review-log.md) (R27-035–R27-040).  
2. Run `node --test tests/*.test.js` (expect **284** pass).  
3. Optional: live Factory probe capture per [`workflow-probe-catalogue.md`](workflow-probe-catalogue.md).
