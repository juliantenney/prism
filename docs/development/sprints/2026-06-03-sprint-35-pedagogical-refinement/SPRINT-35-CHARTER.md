# Sprint 35 charter — Pedagogical refinement

**Pack path:** `docs/development/sprints/2026-06-03-sprint-35-pedagogical-refinement/`  
**Status:** **CHARTERED** — implementation slices not yet approved in `review-log.md`  
**Date:** 2026-06-03  
**Test floor at charter:** **589 pass / 0 fail**

---

## 1. Rationale

Sprints 30–34 established **rich pedagogic JSON**, **calm rendered HTML**, **MathJax-safe quantitative pages**, and **regression-locked composed-page shapes**.

Learners still encounter pages that are **structurally correct** but **instructionally thin**: tasks that describe content coverage rather than actions, materials that present information without fading, assessments that list items without judgement-oriented rhetoric, and closures that omit metacognitive synthesis.

Sprint 35 addresses that gap **inside the existing architecture** — improving how PRISM *expresses* pedagogy, not how many systems it orchestrates.

---

## 2. Architectural principle

Pedagogical improvements should primarily emerge through:

| Lever | Examples |
|-------|----------|
| **Prompt shaping** | Step-runner instructions, math-safe blocks, task operationalisation cues |
| **Rhetorical sequencing** | Activity order, preamble → task → materials → output |
| **Material composition** | Template + scenario + prompt combinations; faded worked examples |
| **Instructional framing** | PEL/cognition fields, support notes, expected-output wording |
| **Renderer semantics** | Field boundaries (task vs materials vs assessment); no facilitator leakage |
| **Activity ordering** | Scaffold progression within `learning_activities` arrays |

**Not** through:

- New orchestration layers
- New artefact types
- Workflow topology expansion
- Adaptive branching or tutoring loops
- Sprint 32 diagram pipeline work

---

## 3. Pedagogical goals

| # | Goal | Sprint 35 expression |
|---|------|---------------------|
| 1 | **Worked-example fading** | Partially completed tables/templates; reducing explicit steps over activities |
| 2 | **Concept ↔ procedure integration** | Key ideas linked to template/scenario tasks; explicit “when to use which” cues |
| 3 | **Embedded feedback rhetoric** | Support notes and assessment stems that interrupt misconceptions without new feedback engines |
| 4 | **Instructional clarity** | Learner-action verbs; separable task / materials / output |
| 5 | **Metacognitive closure** | Study tips and section closings that prompt reflection and transfer |
| 6 | **Task operationalisation** | Observable deliverables in `learner_task` and `expected_output` |
| 7 | **Judgement-oriented prompts** | Assessment and scenario prompts requiring decisions, not recall-only labels |
| 8 | **Scaffold progression** | Increasing demand across activities without new workflow steps |

---

## 4. In scope

- Producer prompt blocks and domain pack copy (`domains/learning-design/…`)
- Brief-resolution heuristics that affect **wording** (not step inclusion)
- Material-field usage patterns in existing JSON shapes
- Assessment `question` / `options` / explanation rhetoric
- Cognition and PEL field presentation and adoption prompts
- Renderer **copy boundaries** (which field renders where) — tiny class hooks only if essential
- Observation-backed iteration on golden + Marx + RNA fixtures
- Tests that lock **pedagogical shape** only when expressed as stable HTML or JSON contracts

---

## 5. Out of scope

| Item | Reason |
|------|--------|
| New workflow steps | Charter constraint |
| Schema / PEC expansion | Charter constraint |
| Adaptive branching | Charter constraint |
| AI tutoring / dialogue loops | Charter constraint |
| Sprint 32 diagram orchestration | Deferred programme |
| Major renderer restructuring | Sprint 34 consolidation complete |
| MathJax policy change (`$` delimiters, new TeX rules) | Sprint 33 closed |
| New artefact types (workbook, slide deck, etc.) | Topology frozen |
| CAS, graphing, interactive widgets | Not pedagogical rhetoric |

---

## 6. Proposed slices

| Slice | Title | Primary deliverable |
|-------|-------|---------------------|
| **35-1** | Instructional clarity & learner-action rhetoric | Producer + domain cues; task/output wording patterns; observation on golden fixture |
| **35-2** | Worked-example & faded-support patterns | Template/scenario composition guidance; partial-fill table patterns |
| **35-3** | Embedded feedback & misconception interruption | Support-note + assessment stem rhetoric; misconception-facing copy |
| **35-4** | Concept/procedure integration cues | Knowledge summary ↔ activity linking prompts; procedure labels in materials |
| **35-5** | Metacognitive closure & evaluative judgement prompts | Study tips, assessment judgement stems, section-level closure |

Each slice should end with:

1. Observation markdown in `observations/`
2. 0-fail test run
3. Explicit list of rejected scope creep

Slices may touch `app.js` only when rhetoric requires a **semantic** render boundary (not CSS-only — that was Sprint 34).

---

## 7. Regression expectations

**Mandatory on every slice:**

```bash
node --test tests/*.test.js
```

**Targeted suites (pedagogy-adjacent):**

| Suite | Why |
|-------|-----|
| `tests/utility-page-render.test.js` | Golden composed page contract |
| `tests/utility-markdown-bullet.test.js` | Materials, assessment lists, live LD shapes |
| `tests/utility-renderer-kitchen-sink.test.js` | Material diversity + CSS markers |
| `tests/mathjax-delimiter-preservation.test.js` | Quantitative pages unchanged |
| `tests/workflow-ld-orchestration.test.js` | **Must stay green** — proves no accidental workflow expansion |

**Floor rule:** No net increase in failing tests; prefer new tests only when pedagogy is expressed as a **stable, justified** contract.

---

## 8. Evaluation strategy

### Automated

- Existing golden page test (`confidence-interval-a2-multitable-page.json`)
- Kitchen-sink and Marx/RNA page fixtures where slices affect those shapes
- Workflow orchestration tests unchanged (step count / topology)

### Manual (realistic self-study fixtures)

Use [presentation-review-rubric.md](../2026-06-01-sprint-31-page-rhetoric-renderer-experience/context-files/presentation-review-rubric.md) on rendered HTML from:

1. **Confidence-interval golden page** (statistics / quantitative)
2. **Marx self-study page** (humanities scenario + materials)
3. **RNA transcript probe context** (life sciences self-study)

Record outcomes in `observations/35-X-….md`.

### Pedagogical success signals (qualitative)

- Primary learner action is obvious within 30 seconds
- Materials support the task without replacing it
- Expected output describes observable evidence of completion
- Assessment prompts require a **decision** or **judgement**, not only label recall
- Support notes address likely misconceptions without becoming full tutoring

---

## 9. Governance

- Slice charters may be added as `slice-35-X-charter.md` when implementation begins.
- **No workflow expansion** — any PR that adds steps, artefact types, or schema fields requires a new programme charter.
- Sprint 32 remains deferred; do not implement diagram workflow under Sprint 35 labels.

---

## 10. Linked programmes

| Sprint | Relationship |
|--------|--------------|
| **Sprint 34** | Immediate predecessor — renderer + fixture stability |
| **Sprint 33** | MathJax + workflow gating baseline |
| **Sprint 31** | R-layer rhetoric foundation |
| **Sprint 32** | **Deferred** — visual/diagram workflow; not Sprint 35 |
