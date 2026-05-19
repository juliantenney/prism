# Sprint 26 index — Pedagogical intent resolution and workflow topology

**Pack path:** `docs/development/sprints/2026-05-20-sprint-26-pedagogical-intent-elicitation-orchestration/`  
**Working title:** Pedagogical Intent Resolution, Composition Integrity, and Learner Inclusion  
**Date:** 2026-05-20  
**Status:** **Open** — Slice **26-1** (**Track A** investigation; Track B **closed**)

**Verification floor:** **252 passed** (`node --test tests/*.test.js`)

---

## Programme note (two Sprint 26 packs)

| Pack | Focus | Status |
|------|--------|--------|
| [`2026-05-20-sprint-26-renderer-presentation-consolidation/`](../2026-05-20-sprint-26-renderer-presentation-consolidation/) | Renderer CSS/HTML presentation | **Paused** (26-2–26-5 complete) |
| **This pack** | Elicitation → workflow topology for LD sparse briefs | **Active** |

Same sprint number, **different programme tracks**. Do not mix renderer work into this pack.

---

## Purpose

Investigate how PRISM converts **sparse educational briefs** into **correct learner-facing outcomes** across three layers:

1. **Pedagogical topology selection** — which workflow steps run  
2. **Artefact composition integrity** — whether generated pedagogy lands in `page.sections[]`  
3. **Learner-facing inclusion rules** — whether composed content renders visibly in export/preview  

**Primary case:** RNA virus / HCV **self-study** brief from uploaded lecture transcript (see `context-files/rna-virus-brief-case.md`).

---

## Core problem statements (two tracks)

### Track A — Workflow topology (activities)

Activity intent is often treated as **weak page/content guidance** rather than a **strong workflow-topology trigger**. Assessment signals (`assessment_required`, formative assessment heuristics) can dominate topology pruning and drop **Design Learning Activities** / **Generate Activity Materials** even when the brief requests learning activities.

### Track B — Assessment on rendered page — **CLOSED**

Export omitted MCQs despite valid `assessment_check` in page JSON — **fixed** (renderer/export, R26-PI-007–009). Not orchestration or Design Page composition for reported shape. See `context-files/assessment-items-output-trace.md`.

---

## Pipelines (investigation scope)

### Track A — Topology

```
User brief → resolve factors → AI workflow design → applyWorkflowDesignHeuristics
  → saved workflow steps
```

### Track B — Assessment on page

```
Generate Assessment Items → assessment_items artefact
  → Design Page → page.sections[] (assessment_check?)
  → buildUtilityStructuredHtml → utilityRenderPageSections → HTML
```

**Authoritative code:** `app.js`, `workflowGenerationContext.js`, LD pack docs, Sprint 25 composition/export contracts.

---

## Portable pack

| File | Purpose |
|------|---------|
| [`sprint-26-index.md`](sprint-26-index.md) | This index |
| [`slice-26-1-charter.md`](slice-26-1-charter.md) | **26-1** investigation charter (doc only) |
| [`CURRENT-STATE.md`](CURRENT-STATE.md) | Live slice status |
| [`HANDOVER.md`](HANDOVER.md) | New-chat handover |
| [`review-log.md`](review-log.md) | Decisions R26-PI-001+ |
| [`context-files/README.md`](context-files/README.md) | Snapshot rules + inventory |

### Track B context files (assessment on page)

| File | Purpose |
|------|---------|
| [`context-files/assessment-items-output-trace.md`](context-files/assessment-items-output-trace.md) | Checkpoint trace + failure loci A-GEN … A-EXPORT |
| [`context-files/design-page-assessment-inclusion-notes.md`](context-files/design-page-assessment-inclusion-notes.md) | Design Page / `omitIfMissing` / metadata vs `sections[]` |
| [`context-files/page-assessment-renderer-notes.md`](context-files/page-assessment-renderer-notes.md) | Renderer path + inflation workshop comparison |

---

## Proposed slice sequence

| Slice | Focus | Status |
|-------|--------|--------|
| **26-1** | Evidence-led topology investigation (**Track A**; Track B done) | **Active** — doc only |
| **26-2** | Pedagogical signal taxonomy + topology trigger rules (design) | Not chartered |
| **26-3** | Regression fixtures for sparse briefs | Not chartered |
| **26-4** | Bounded elicitation/topology fixes | Not chartered |
| **26-5** | Resolved-brief UI language + confidence display | Not chartered |

Slices **26-2+** require **26-1 findings** and explicit charter approval.

---

## Frozen boundaries (Sprint 26-1)

- No runtime, pack, renderer, or Settings changes
- No Sprint 25 composition/export contract changes
- Test floor must not regress (**248** pass)

---

## Key references (live repo)

| Topic | Path |
|-------|------|
| Brief explicit extract | `app.js` — `extractWorkflowBriefExplicitFactors` (~7226) |
| Workflow heuristics / pruning | `app.js` — `applyWorkflowDesignHeuristics` (~10057) |
| LD workflow policy | `domains/learning-design/domain-learning-design-step-patterns.md` — `workflowPolicy` JSON |
| Brief resolution | `app.js` — `resolveWorkflowBriefFactors` (~7459) |
| Sprint 23 assessment topology | `docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/ld-design-assessment-semantics.md` |
| Sprint 17 sparse brief (Research lab) | `docs/development/sprints/2026-05-15-sprint-17-research-elicitation-sparse-brief-testing/` |

---

## Verification

```bash
node --test tests/*.test.js
```

**26-1:** documentation only — expect **248 passed**, 0 failed, no code diff.
