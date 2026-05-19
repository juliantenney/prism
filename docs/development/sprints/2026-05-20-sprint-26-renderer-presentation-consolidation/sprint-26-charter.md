# Sprint 26 charter — Renderer presentation consolidation

**Date:** 2026-05-20  
**Status:** **Open**  
**Pack:** [`sprint-26-index.md`](sprint-26-index.md)

---

## 1. Charter statement

Sprint 26 improves **how composed `page` JSON looks and reads** in Utilities HTML export—without changing **what** the page contains or **how** activities are selected for composition.

Sprint 25 established and implemented:

- composition membership and omission traceability;
- export authority (`page.sections[]` canonical body, `strictCompositionClosure`);
- live validation that all workshop activities **A1–A5** are preserved in composed JSON and render faithfully.

Sprint 26 **builds on that stability** with governed, presentation-only renderer work.

---

## 2. Objectives

### 2.1 Renderer visual refinement

Improve learner-facing polish:

- spacing consistency across sections and activity blocks
- heading hierarchy (`h1`–`h4`) and section transitions
- typography rhythm (line-height, list density, label weight)
- material card consistency (borders, nesting, grey/white surfaces)
- scannability vs density balance for workshop-length pages
- print readability (page breaks, contrast, table overflow)

### 2.2 Material rendering refinement

Audit and refine typed patterns (no generic collapse):

| Pattern | Current location (indicative) |
|---------|-------------------------------|
| Task cards | `util-task-card`, card grids |
| Prompt sets | `util-prompt-set` |
| Scenario cards | `util-scenario-card` |
| Worksheets / templates | tables, `util-template-block`, worksheet lines |
| Support notes | `util-support-note` |
| Output blocks | `util-output-block` |
| Tables | markdown → `<table>` |
| Metadata | `util-meta` `<details>` |

### 2.3 Accessibility and usability

- logical heading order per section/activity
- semantic HTML landmarks where low-cost
- decorative icons: `aria-hidden` (preserve); meaningful labels where needed
- colour contrast and focus-friendly structure
- print/PDF tolerance; basic mobile reflow

### 2.4 Renderer governance

Maintain [`renderer-governance.md`](renderer-governance.md):

- safe presentation refinements
- prohibited semantic behaviour
- renderer responsibility boundaries vs composition/export
- extension patterns for new material subtypes

### 2.5 Regression protection

Extend renderer tests/fixtures using the **inflation workshop full page** as primary benchmark:

- dense multi-activity workshop
- mixed material types per activity
- nested materials within activity blocks
- long prompt sets and checklists
- printable worksheets/tables
- metadata collapse behaviour

### 2.6 Optional enhancements (bounded only)

Candidates require **per-item mini-charter** in [`renderer-refinement-backlog.md`](renderer-refinement-backlog.md):

- improved worksheet/table styling
- cleaner facilitator-note presentation
- compact mode for long workshops
- print-specific CSS (`@media print`)
- clearer material grouping subheadings

---

## 3. Out of scope (non-negotiable)

| Topic | Reason |
|-------|--------|
| Composition semantics / Design Page prompts | Closed in Sprint 25 |
| Activity closure validation behaviour | Closed in Sprint 25 |
| Export authority / `strictCompositionClosure` | Closed in Sprint 25 |
| Recovering missing activities from sequence/materials | Violates export contract |
| Workflow orchestration / runtime capture | Not renderer |
| LD artefact taxonomy changes | Pack scope |
| Broad renderer rewrite / generic object walkers | Risk to semantic fidelity |

---

## 4. Success criteria

| # | Criterion |
|---|-----------|
| S1 | Inflation workshop fixture renders with measurably improved presentation (documented before/after or review checklist) |
| S2 | No regression in activity visibility (A1–A5 titles present in HTML when fixture complete) |
| S3 | `node --test tests/*.test.js` — **≥ 229 passed**, 0 failed |
| S4 | [`renderer-governance.md`](renderer-governance.md) updated and referenced from implementation PRs |
| S5 | Backlog items classified (P0–P2) with safe/prohibited tags |
| S6 | No changes to composition/export contracts without explicit new sprint |

---

## 5. Primary benchmark

**JSON:** `tests/fixtures/page-render/ld-inflation-workshop-page-full.json`  
**Tests:** `tests/utility-ld-inflation-page-render.test.js`  
**Process:** Utilities preview or test-render HTML; human review + automated structure checks.

Live Sprint 25–validated workshop JSON may supplement benchmarks in `context-files/` when captured (optional, redacted).

---

## 6. Slice entry criteria

| Slice | Entry | Exit |
|-------|-------|------|
| **26-1** | Sprint 26 open | Governance doc + audit notes + prioritised backlog |
| **26-2+** | 26-1 complete | Per-slice charter; tests updated; review-log entry |

---

## 7. Related documentation

- [Sprint 25 closeout](../2026-05-19-sprint-25-design-page-composition-renderer-consolidation/sprint-25-closeout.md)
- [Composition contract](../2026-05-19-sprint-25-design-page-composition-renderer-consolidation/design-page-composition-contract.md) (frozen)
- [Export contract](../2026-05-19-sprint-25-design-page-composition-renderer-consolidation/design-page-export-contract.md) (frozen)
- [Renderer export behaviour](../../../architecture/renderer-export-behavior.md)
