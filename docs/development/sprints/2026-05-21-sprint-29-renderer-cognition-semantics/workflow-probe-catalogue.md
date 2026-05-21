# Workflow probe catalogue — Sprint 29 (renderer)

**Purpose:** Standardised **renderer** investigation targets — JSON inputs and capture checklist. Generation briefs unchanged from Sprint 28.

**Rubric:** [`renderer-cognition-evidence-matrix.md`](renderer-cognition-evidence-matrix.md) (D-R1–D-R10)

---

## Probe index

| ID | Name | Source | Hypotheses |
|----|------|--------|------------|
| **R29-P01** | Climate misconception (post-5d) | P28-01 page JSON | R29-H1, H3, H4 |
| **R29-P02** | Peer instruction (post-5d) | P28-02 page JSON | R29-H1, H3, H4 |
| **R29-P07** | Transcript dialogic (post-5d) | P28-07 page JSON | R29-H1, H3 |
| **R29-P08** | Lean retrieval / RNA | Fixtures + sparse brief | R29-H1 (negative) |
| **R29-P09** | Kitchen sink | `renderer-kitchen-sink-page.json` | Baseline patterns |

---

## R29-P01 — Climate misconception seminar

**JSON source:** [`probe-p28-01-post-5d.md`](../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/context-files/probe-p28-01-post-5d.md) section G (composed page).

**Cognition-bearing content to trace:**

- `misconception_claim`, `reconciliation_prompt`, `evidence_contrast`, `uncertainty_tension_prompt` on activities A1/A2
- Rich `materials` (task cards) vs formative check items

**Capture checklist (29-0 / 29-1):**

| Layer | Capture |
|-------|---------|
| A | Section order: `overview` → `learning_activities` → `assessment_check` |
| B | Field presence in `learning_activities.content[]` |
| C | HTML: activity card vs assessment item visual weight |
| D | Flattening: are cognition fields visible as labelled blocks? |
| E | Assessment dominance: 5-item check vs activity block area |
| F | Investigator notes |

**Known 28-3 vs post-5d:** Structural — fields absent in 28-3 DLA; **present** post-5d. Renderer gap unchanged until 29-x.

---

## R29-P02 — Peer instruction (stoichiometry)

**JSON source:** [`probe-p28-02-post-5d.md`](../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/context-files/probe-p28-02-post-5d.md) section G.

**Cognition-bearing content:**

- `initial_position_prompt`, `reasoning_revision_prompt`, `revision_trigger` per activity
- `feedback_display: reflection_then_answers` (Sprint 27) — renderer assessment path

**Capture focus:**

- Revision prompts buried inside generic card vs MCQ section
- Reflection/self-check block ordering in HTML export
- Reasoning flow legibility (D-R3)

---

## R29-P07 — Transcript → dialogic activities

**JSON source:** [`probe-p28-07-post-5d.md`](../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/context-files/probe-p28-07-post-5d.md) section G.

**Cognition-bearing content:**

- `transformation_activity`, `source_to_application_prompt`
- Misconception repair fields on pair/transcript tasks

**Capture focus:**

- Transcript transformation visible as activity type (not quiz-only page)
- Source→application visual chain
- Comparison with R29-P08 (RNA assessment-only historical fixture)

---

## R29-P08 — Lean retrieval (negative control)

**JSON sources:**

- [`rna-virus-activities-formative.json`](../../../tests/fixtures/workflow-brief-ld-sparse/rna-virus-activities-formative.json) (topology)
- Lean page fixtures / observation harness paths

**Expectation:**

- No `metadata.cognition_profile`
- No cognition field keys
- Renderer must remain unchanged (no spurious cognition chrome)

**Regression role:** Guard for 29-3 implementation.

---

## R29-P09 — Kitchen sink (pattern baseline)

**JSON source:** [`tests/fixtures/page-render/renderer-kitchen-sink-page.json`](../../../tests/fixtures/page-render/renderer-kitchen-sink-page.json)

**Role:**

- Validates material-type renderers (task cards, scenarios, prompts)
- **No** cognition classes — baseline for “ordinary” LD richness

**29-2 action:** Add cognition variant fixture sibling — not in 29-0.

---

## Capture method (29-1 recommended)

```javascript
// Pattern from existing tests:
api.buildUtilityStructuredHtmlForTest(pageJson);
```

Document section-scoped HTML snippets in `context-files/r29-p*-render-notes.md` when 29-1 runs.

---

## Non-goals per probe

- Do not re-run full D1–D10 pedagogic rubric unless comparing G vs R gap
- Do not change briefs or re-generate with OpenAI in 29-0
