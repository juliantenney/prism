# Sprint 34 → Sprint 35 Handover & Forward Plan

**Date:** 2026-06-03  
**Authoritative code:** `app.js`, `tests/`, domain packs under `domains/`  
**Predecessor packs:** Sprint 34 (refinement, **COMPLETE**), Sprint 33 (MathJax, **COMPLETE**), Sprint 32 (diagrams, **PLANNED / NOT STARTED**)

**Test floor (current):** `node --test tests/*.test.js` → **589 pass / 0 fail**

---

## 1. Sprint 34 summary (complete)

| Slice | Deliverable | Notes |
|-------|-------------|-------|
| **34-1** | 0-fail suite | Kitchen-sink CSS assertion alignment |
| **34-2** | Scenario headings | `entry.heading` on singular `materials.scenario` |
| **34-3** | Renderer consolidation | `renderMaterialMarkdownBlock` shared helper |
| **34-4** | Golden composed page | `confidence-interval-a2-multitable-page.json` + MathJax restore fix |
| **34-5** | Typography/spacing | `getUtilityPagePresentationCssV31_7()` |

Sprint 34 did **not** change workflow topology, schema, or MathJax delimiter policy.

---

## 2. Renderer state after V31_7

Presentation CSS is layered:

```text
getUtilityPagePresentationCss()
  → V26_2 … V26_5 (activity cards, tables, assessment base)
  → getUtilityCognitionPresentationCss()
  → V31_2 … V31_7 (framing, materials stack, assessment formative, typography)
```

**V31_7 highlights (34-5):**

- Clearer heading ladder: page `h1` → section `h2` → activity `h3` → material `h4` → in-card subheadings
- Activity card rhythm: task → materials → output → support note spacing
- Reduced double-border in nested material stacks; table wrappers lighter inside activities
- Multi-table template subheading spacing
- Print: `break-inside: auto` on long material tables (cards still avoid-page)

**Renderer logic (stable):**

- `buildUtilityStructuredHtml` → section routing → `renderLearningActivitiesBlocks` / `renderMaterialsForActivity`
- `renderMaterialMarkdownBlock` for shared markdown paths
- `utilityRenderMarkdownBlock` + MathJax protect/restore
- `renderTableHintHeadingSections` for multi-`###` template strings

---

## 3. MathJax restoration hardening (34-4)

**Bug found:** `utilityRestoreProtectedMathDelimiters` restored both `@@PRISMMATHBLOCKn@@` and `@@PRISMMATHINLINEn@@` from the same token index. Inline-only restore inside prose paragraphs overwrote block placeholders.

**Fix:**

- Restore accepts `{ kind: "inline" | "block" | "both" }`
- `utilityRenderMarkdownInline` shields `@@PRISM…@@` placeholders from underscore-emphasis rules

**Regression:** `tests/mathjax-delimiter-preservation.test.js` — block math in prose paragraph; `tests/utility-page-render.test.js` — golden composed page.

**Policy unchanged:** `\(...\)`, `\[...\]` only; no `$` / `$$`.

---

## 4. Golden fixture contract (evaluation baseline for Sprint 35)

**File:** `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json`  
**Test:** `tests/utility-page-render.test.js` — golden composed page test

Locks:

- MathJax inline + block in knowledge summary
- Multi-table A2 template (no `<p>|…|` leaks)
- A4 scenario with custom heading + compressed table
- Formative assessment: intro paragraph + `<ol>` sub-questions
- `expected_output`, `support_note`, activity/material CSS classes

Sprint 35 pedagogical work should **not break** this contract without explicit charter amendment.

---

## 5. Pedagogical refinement direction (Sprint 35)

### Programme intent

Improve **instructional quality** using existing page structures — see [SPRINT-35-CHARTER.md](SPRINT-35-CHARTER.md).

### Core themes

1. Worked-example fading  
2. Concept ↔ procedure integration  
3. Embedded feedback rhetoric  
4. Instructional clarity  
5. Metacognitive closure  
6. Better task operationalisation  
7. Judgement-oriented prompts  
8. Scaffold progression **without workflow expansion**

### Primary levers (in order of preference)

1. Producer / domain **prompt shaping**  
2. **Material composition** patterns in existing fields  
3. **Activity ordering** and framing copy  
4. **Renderer semantics** (field boundaries) — minimal code  
5. New tests only when pedagogy is regression-worthy  

### Explicit constraint: no workflow expansion

Sprint 35 **must not**:

- Add workflow steps or runners  
- Expand JSON schema or PEC  
- Introduce adaptive branching or tutoring loops  
- Implement Sprint 32 diagram orchestration  

`tests/workflow-ld-orchestration.test.js` and `tests/workflow-ld-rna-sparse-brief-topology.test.js` remain mandatory green gates.

---

## 6. Suggested Sprint 35 slices

| Slice | Focus |
|-------|-------|
| **35-1** | Instructional clarity & learner-action rhetoric |
| **35-2** | Worked-example & faded-support patterns |
| **35-3** | Embedded feedback & misconception interruption |
| **35-4** | Concept/procedure integration cues |
| **35-5** | Metacognitive closure & evaluative judgement prompts |

---

## 7. Statistics review observations (reference)

Quantitative self-study evaluation should combine:

| Resource | Path |
|----------|------|
| Golden confidence-interval page | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` |
| Presentation rubric (stats/Marx/RNA) | `docs/development/sprints/2026-06-01-sprint-31-page-rhetoric-renderer-experience/context-files/presentation-review-rubric.md` |
| Sprint 35 observation log | `observations/` (per-slice captures) |
| Assessment manual validation | `docs/development/sprints/2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/context-files/manual-validation-observation-log.md` |

Slice work should document **pedagogical deltas** against these anchors, not only test pass counts.

---

## 8. Risk areas

| Risk | Mitigation |
|------|------------|
| Scope creep into workflow/schema | Charter + orchestration tests on every PR |
| Breaking golden fixture / MathJax | Run `utility-page-render` + `mathjax-delimiter-preservation` |
| Prompt changes without observable improvement | Require `observations/35-X-….md` before slice close |
| Reopening renderer restructuring | Prefer prompt/copy; code only for semantic boundaries |
| Conflating Sprint 32 diagrams | Charter out-of-scope; separate pack path |

---

## 9. Regression suites (Sprint 35 standing)

```bash
node --test tests/utility-renderer-kitchen-sink.test.js
node --test tests/utility-page-render.test.js
node --test tests/utility-markdown-bullet.test.js
node --test tests/mathjax-delimiter-preservation.test.js
node --test tests/workflow-ld-orchestration.test.js
node --test tests/*.test.js
```

---

## 10. Deferred: Sprint 32

[Pedagogic diagram enhancement](../2026-06-02-sprint-32-pedagogic-diagram-enhancement/) — **NOT STARTED**.

Sprint 35 does not substitute for Sprint 32. Visual enrichment remains a separate future programme.

---

## 11. Suggested opening prompt (Sprint 35-1)

> Context: Sprint 35 setup complete; Sprint 34 delivered 589 pass / 0 fail, golden confidence-interval fixture, V31_7 CSS, MathJax restore kind fix. Task: Sprint 35-1 — instructional clarity and learner-action rhetoric. Scope: producer/domain prompts and observation notes; minimal renderer if required. Non-goals: workflow steps, schema, Sprint 32, renderer restructuring. Success: observation delta on golden + one companion fixture; 0-fail suite.

---

## Linked artefacts

| Pack / file | Use |
|-------------|-----|
| [Sprint 34 pack](../2026-06-03-sprint-34-refinement-forward-plan/) | Slice notes 34-1–34-5 |
| [Sprint 33 pack](../2026-06-02-sprint-33-mathjax-support/) | MathJax architecture |
| [Sprint 32 pack](../2026-06-02-sprint-32-pedagogic-diagram-enhancement/) | Deferred diagrams |
| `docs/development/chat-bootstrap-template.md` | Next-chat bootstrap |

---

*Technical snapshot reflects `app.js` and test suite as of 2026-06-03 after Sprint 34-5.*
