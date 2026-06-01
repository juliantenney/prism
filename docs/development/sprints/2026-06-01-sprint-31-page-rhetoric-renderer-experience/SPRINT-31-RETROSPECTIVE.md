# Sprint 31 retrospective — Page rhetoric & renderer experience

**Status:** **CLOSED** (2026-06-01)  
**Decision:** [R31-999](review-log.md)  
**Pack path:** `docs/development/sprints/2026-06-01-sprint-31-page-rhetoric-renderer-experience/`  
**Predecessor:** [Sprint 30 CLOSED](../2026-05-21-sprint-30-pedagogic-enrichment-layer/SPRINT-30-RETROSPECTIVE.md)

---

## Executive summary

Sprint 31 delivered **renderer-only presentation and rhetoric refinement** for self-directed learner pages. Six sequential slices improved metadata boundaries, activity cue hierarchy, knowledge-summary consistency, material/table presentation, deterministic activity-local dedupe, and formative assessment readability — while **preserving all Sprint 30 pedagogic content in JSON** and **not** changing generation, orchestration, composition, schema, PECs, or assessment semantics.

The programme closed with **502 pass / 0 fail** on `node --test tests/*.test.js` (inherited Sprint 30 floor **471**; **+31** tests across slices).

**Do not reopen Sprint 31** except for documented regression fixes tied to this programme’s R-layer scope.

---

## Programme goal

Make rendered self-directed learner pages feel **calm, scannable, and professionally authored** — not assembled from debug exports — by improving **visual hierarchy, pacing, and presentation consistency** on the **R-layer** (`buildUtilityStructuredHtml`, activity/material/assessment renderers, embedded CSS).

Sprint 30 made Prism **pedagogically intelligent**; Sprint 31 made Prism **pedagogically elegant** in HTML export.

---

## Slices completed

| Slice | Focus | Review | Floor after |
|-------|--------|--------|-------------|
| **31-1** | Metadata visibility & learner/developer boundary | R31-002 | 475 (+4) |
| **31-2** | Cue hierarchy & visual weighting | R31-003 | 481 (+6) |
| **31-3** | Concept / knowledge-summary consistency | R31-004 | 485 (+4) |
| **31-4** | Worked-example & material rendering polish | R31-005 | 490 (+5) |
| **31-5** | Density / pacing & anti-repetition (deterministic dedupe) | R31-006 | 497 (+7) |
| **31-6** | Assessment presentation refinement | R31-007 | **502** (+5) |

Charters: [`slice-31-1-charter.md`](slice-31-1-charter.md) through [`slice-31-6-charter.md`](slice-31-6-charter.md).

---

## Final test floor

```bash
cd c:\xampp\htdocs\prism
node --test tests/*.test.js
```

| Metric | Value |
|--------|-------|
| **Pass** | **502** |
| **Fail** | **0** |

See [`baseline-test-floor.md`](baseline-test-floor.md).

---

## Key renderer improvements (R-layer)

| Area | Outcome |
|------|---------|
| **Metadata** | `About this page` meta fold; production keys collapsed; learner body free of upstream artefact H2s |
| **Activity cues** | `.util-activity-framing`, `.util-activity-task--primary`; softer PEL/cognition chrome |
| **Knowledge** | `.util-knowledge-summary`, `.util-definition-list`, `.util-concept-relationships`; prose scalar support |
| **Materials** | `.util-materials-stack`, `.util-material-table`, template/prompt/example tiers |
| **Dedupe** | `createActivityComparableRegistry()` — exact `normalizeComparableText` match only; task never suppressed |
| **Assessment** | `.util-assessment-prompt`, `.util-assessment-choices`, `.util-assessment-item--formative` |

Architecture summary: [`context-files/sprint-31-renderer-architecture-summary.md`](context-files/sprint-31-renderer-architecture-summary.md).

### CSS additions (embedded)

`getUtilityPagePresentationCssV31_2()` through `getUtilityPagePresentationCssV31_6()` appended via `getUtilityPagePresentationCss()`.

---

## Governance boundaries preserved

| Boundary | Sprint 31 stance |
|----------|------------------|
| **Generation / orchestration / composition** | **No changes** |
| **JSON schema / source artefacts** | **No changes** |
| **PECs / workflow topology** | **No changes** |
| **`metacognition_contract`** | **Not implemented** (deferred Sprint 30 Phase 3) |
| **Adaptive learner modelling** | **None** |
| **Semantic rewriting / inference** | **None** — presentation wrappers and CSS only |
| **Dedupe** | **Deterministic, activity-local, exact-match only** (31-5) |
| **Assessment semantics** | **Unchanged** — visibility/feedback/grid modes regression-tested (31-6) |

Programme charter: [R31-001](review-log.md).

---

## Representative evidence reviewed

| Profile | Sources | Probes (examples) |
|---------|---------|-------------------|
| **Marx self-study** | `marx-self-study-page.json`, live Marx JSON | 31-01, 31-03, 31-05, 31-07, 31-09 |
| **RNA / HCV** | `ld-rna-hcv-assessment-page.json`, live RNA JSON | 31-02, 31-04, 31-08, 31-10, 31-12 |
| **Synthetic** | `renderer-kitchen-sink-page.json` | 31-06, 31-08, 31-11 |
| **Shapes** | `shape-production-metadata.json`, `shape-markdown-table.json`, `shape-structured-assessment-mcq.json`, `shape-activity-echo-dedupe.json`, `shape-knowledge-summary-prose.json` | Per-slice tests |

Full probe index: [`context-files/`](context-files/) (`probe-31-01` … `probe-31-12`).  
Evidence map: [`context-files/evidence-pages-marx-rna.md`](context-files/evidence-pages-marx-rna.md).

Manual rubric: [`context-files/presentation-review-rubric.md`](context-files/presentation-review-rubric.md).

---

## Unresolved / future work (out of Sprint 31)

| Item | Notes |
|------|--------|
| **P31-03 quantitative / stats page** | No dedicated repo fixture; interim table/MCQ shapes only |
| **Quantitative / math rendering programme** | Future charter — not Sprint 31 |
| **`metacognition_contract`** | Deferred — generation-layer; see Sprint 30 Phase 3 constraints |
| **Generation-layer dedupe** | Activity echoes handled renderer-side only where exact match |
| **Sprint 32+** | **Not started** — open new programme if needed |

---

## Architectural handoff

- Renderer hooks: [`context-files/renderer-hooks.md`](context-files/renderer-hooks.md)  
- Fixtures/tests: [`context-files/key-fixtures-and-tests.md`](context-files/key-fixtures-and-tests.md)  
- Live state at close: [`CURRENT-STATE.md`](CURRENT-STATE.md)

---

## Closure

Sprint 31 **succeeded** within its charter: all six planned slices shipped, test floor held, R-layer boundary maintained. Presentation quality on Marx/RNA/kitchen-sink exports is materially calmer than the Sprint 30 close baseline; further pedagogy belongs in **new generation programmes**, not reopening this pack.

**Successor:** None mandated. Optional future work listed above.
