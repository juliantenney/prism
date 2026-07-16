# Sprint 62 — Acceptance Evidence Pages

**Updated:** 2026-07-16  
**Decision:** S62-D04  
**Status:** Frozen baseline set for Sprint 62 renderer coherence evaluation

All Sprint 62 renderer changes must be evaluated against this fixed page set. Capture before/after HTML snapshots and a short rationale per page when making coherence changes.

---

## Baseline set (four instructional behaviours)

| ID | Category | Fixture | Focus activity | Why this page |
| -- | -------- | ------- | -------------- | ------------- |
| **S62-EV-01** | Classification activity | [`tests/fixtures/page-render/ld-inflation-workshop-page-full.json`](../../../../tests/fixtures/page-render/ld-inflation-workshop-page-full.json) | **A1** — `classification_table` in activity materials | Workshop-shaped classification with table materials, task cards, and facilitator framing — tests schema wrappers around tabular classification work |
| **S62-EV-02** | Evaluation / judgement activity | [`tests/fixtures/page-render/marx-beat-render-page.json`](../../../../tests/fixtures/page-render/marx-beat-render-page.json) | **A4** — “Was Marx Right Historically?” | Criteria tables, scenarios, decision table, evaluative judgement, and checklist — representative of `evaluation_judgement`-style reasoning (criteria → evidence → trade-offs → judgement) at render time |
| **S62-EV-03** | Worked-example-led activity | [`tests/fixtures/page-render/marx-self-study-page.json`](../../../../tests/fixtures/page-render/marx-self-study-page.json) | **A2** — “Modelled comparison row” | Worked example leads into learner task; preamble, cognition fields, and template follow-on — tests interleaving and label deduplication around modeled reasoning |
| **S62-EV-04** | Transfer challenge activity | [`tests/fixtures/page-render/marx-beat-render-page.json`](../../../../tests/fixtures/page-render/marx-beat-render-page.json) | **A5** — “Is Marx Still Relevant Today?” (`transfer_prompt`) | Independent judgement memo plus explicit transfer prompt — tests coherence of transfer scaffolding without generic “Output” clutter |

**Note on S62-EV-02:** Production `evaluation_judgement` is an archetype ID on DLA `required_materials[]`. Composed page fixtures do not carry that field; this page is the accepted **renderer behaviour proxy** for evaluative judgement activities until a dedicated composed evaluative page fixture is added.

---

## Optional breadth regression (non-blocking)

| Fixture | Role |
| ------- | ---- |
| [`tests/fixtures/page-render/renderer-kitchen-sink-page.json`](../../../../tests/fixtures/page-render/renderer-kitchen-sink-page.json) | Synthetic material-type and section-pattern coverage (Sprint 26 convention). Run after targeted acceptance pages; not a substitute for S62-EV-01 … S62-EV-04 |

---

## Evidence capture convention

For each change affecting renderer presentation:

1. Render **all four** baseline pages before and after the change.
2. Store snapshots under `artefacts/coherence/<change-id>/` (create when implementation begins).
3. Record per page:
   - flow improvement observed
   - confirmation that educational content is unchanged
   - confirmation that ordering and pedagogical sequence are unchanged
4. Apply [renderer-coherence-checklist.md](renderer-coherence-checklist.md) to each baseline page.

---

## Automated test anchors

| Fixture | Test file (regression guard) |
| ------- | ---------------------------- |
| `ld-inflation-workshop-page-full.json` | `tests/utility-ld-inflation-page-render.test.js` |
| `marx-self-study-page.json` | `tests/utility-marx-self-study-design-quality.test.js`, `tests/workflow-self-directed-activity-framing-adoption.test.js` |
| `marx-beat-render-page.json` | `tests/sprint-51-pedagogic-salience-render.test.js` (beat render coverage) |
| `renderer-kitchen-sink-page.json` | `tests/utility-renderer-kitchen-sink.test.js` |
