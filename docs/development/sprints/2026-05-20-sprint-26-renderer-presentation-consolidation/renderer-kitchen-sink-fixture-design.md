# Renderer kitchen sink fixture — design note (Sprint 26)

**Status:** **Approved design** (fixture + matrix + gap audit)  
**Date:** 2026-05-20  
**Fixture path:** [`tests/fixtures/page-render/renderer-kitchen-sink-page.json`](../../../tests/fixtures/page-render/renderer-kitchen-sink-page.json)  
**Smoke test:** [`tests/utility-renderer-kitchen-sink.test.js`](../../../tests/utility-renderer-kitchen-sink.test.js)

---

## 1. Purpose and non-goals

### 1.1 Purpose

Provide a **deterministic, high-coverage** `artifact_type: page` JSON document that exercises Utility renderer v1 patterns in one HTML export—without running a full Learning Design workflow.

Use for:

- visual regression and presentation iteration (Sprint 26)
- renderer PR verification
- accessibility / print spot checks

### 1.2 Explicit non-goals

| This fixture is **not**… | Authoritative source instead |
|--------------------------|------------------------------|
| A pedagogic exemplar | Real workshop content (e.g. inflation full fixture) |
| A Design Page composition contract | [Sprint 25 composition contract](../2026-05-19-sprint-25-design-page-composition-renderer-consolidation/design-page-composition-contract.md) |
| An export authority specification | [Sprint 25 export contract](../2026-05-19-sprint-25-design-page-composition-renderer-consolidation/design-page-export-contract.md) |
| Workflow-generated truth | Pack prompts / live runs |

Synthetic `source_artefacts.synthetic_fixture: true` flags this in metadata.

---

## 2. Renderer audit summary (`app.js`)

### 2.1 Export path

| Step | Symbol | Role |
|------|--------|------|
| Entry | `handleUtilitiesGenerate` | Parse JSON → render |
| Plan | `resolveUtilityRenderPlan` | Catalog `renderHints` |
| Body | `buildUtilityStructuredHtml` | Shell, `pageBodyFromSectionsArray`, metadata fold |
| Sections | `utilityRenderPageSections` | Section routing + materials |
| Sanitize | `sanitizeUtilityHtmlOutput` | Placeholder/checkbox cleanup |

When `sections[]` is non-empty: **single** `utilityRenderPageSections(sections[])` pass; `strictCompositionClosure: true` (no activity fabrication).

### 2.2 Section routing (`utilityRenderPageSections`)

| Pattern | Detection | Render path |
|---------|-----------|-------------|
| Learning activities | `section_id` / heading | `renderLearningActivitiesBlocks` → `renderMaterialsForActivity` |
| Learning sequence | heading / id | `renderLearningSequenceBlocks` or `renderLinkedJourneyBlocks` |
| Learning purpose | heading | `renderLearningPurposeOutcomes` (statement + `outcomes[]`) |
| Study tips | heading “study tips” | Icon `study_tips` (wins over assessment id) |
| Assessment | `assessment_check` / heading | `renderQuestionBlocks` (MCQ, feedback modes) |
| Support / facilitator | heading | Markdown / object render |
| Overview, knowledge | default | `utilityRenderMarkdownBlock` / primitive |
| Section icons | `resolveSectionKind` | `util-section-icon--*` on `h2` |

`PAGE_BODY_SECTION_IDS`: overview, learning_purpose, knowledge_summary, learning_activities, learning_sequence, activity_materials, assessment_check, support_notes, study_tips.

### 2.3 Activity row fields (`renderLearningActivitiesBlocks`)

| Field | Rendered as |
|-------|-------------|
| `title` | `h3` in `util-activity-header` |
| `duration_minutes`, `timing` | `util-badge` / `util-badge-time` |
| `grouping`, `group_size`, … | `util-badge-group` |
| `purpose` | `<p><strong>Task:</strong> …` (summarized) |
| `learner_task`, `task` | `util-activity-task` + “What to do” list |
| `learner_instructions`, `instructions` | “Guidance” if distinct |
| `materials` | `util-activity-materials` |
| `expected_output` | `util-output-block` |
| `support_note`, `facilitator_note` | `util-support-note` |

**Not renderer-aware:** `mapped_outcomes`, `outcome_ids`, `activity_id` display (id used for lookup only).

### 2.4 Material first-pass keys (`renderMaterialsForActivity`)

Dedicated handlers (in order):

1. `task_cards` / `cards` → `util-card-grid` + `util-task-card`
2. `scenarios` / `study_scenarios` / `scenario_set` → `util-scenario-list` / `util-scenario-card` / `util-stage-card`
3. `prompt_set` / `prompts` → `util-prompt-set`
4. `checklist` → checklist sections / `util-checkbox-list`
5. `template` / `templates` / `worksheet_template` → `util-template-block` + note lines
6. `analysis_table` / `impact_table` / `table` → “Worksheet” heading + markdown table
7. `strategy_options` / `options` / `strategies` → bullet list

**Remainder loop:** other keys → `renderMaterialValue` (generic); `isCardLikeMaterialKey` → `util-material-card`.

### 2.5 `renderMaterialValue` highlights

- Markdown pipe tables (divider row)
- Checkbox tokens in lists (`util-checkbox-list`)
- `checklist.sections[]`, `template.sections[]`
- `escalation_template` SBAR object
- String / array / nested object fallbacks
- `utilityRenderObject` last resort

### 2.6 Assessment (`renderQuestionBlocks`)

- `stem`, `options`, `item_type`
- `feedback_display`: `none` | `answer_grid_end` | `answers_explanations`
- `correct_answer` / `correct_answers` (hidden when `none`)

### 2.7 Metadata fold (`buildUtilityStructuredHtml`)

Top-level `source_artefacts`, `constraints_applied`, `generation_notes` → `<details class="util-meta">` (not duplicated in body when `sections[]` authoritative).

---

## 3. Fixture structure

| Section | Fixture intent |
|---------|----------------|
| `overview` | String + inline markdown |
| `learning_purpose` | Object: `statement` + `outcomes[]` |
| `knowledge_summary` | String with `##`, bullets, pipe table |
| `learning_activities` | Four activities **KS-A1–KS-A4** (see matrix) |
| `learning_sequence` | Timeline + facilitator lines |
| `assessment_check` | Two MCQ items (one with `correct_answers`) |
| `study_tips` | Bullet string; study icon |
| `support_notes` | Facilitator markdown section |
| `metadata` | In-body production metadata section |
| Top-level | `generation_notes`, `constraints_applied`, `source_artefacts` |

Materials are **embedded in activity rows** (canonical composed shape). No separate `activity_materials` section (avoids probe-merge confusion in strict mode).

---

## 4. Renderer coverage matrix

| ID | Fixture location | Renderer behaviour | Expected HTML signals |
|----|------------------|--------------------|------------------------|
| M01 | overview | Markdown inline | `<p>`, `<strong>` |
| M02 | learning_purpose.statement | Bullet extraction from string | `<ul><li>` |
| M03 | learning_purpose.outcomes | Outcomes list | `<ul><li>` |
| M04 | knowledge_summary | Headings + table in string | `<h2>`/block, `<table>` |
| M05 | KS-A1.task_cards | Task card grid | `util-card-grid`, `util-task-card` |
| M06 | KS-A1.scenarios | Scenario + stage cards | `util-scenario-card`, `util-stage-card` |
| M07 | KS-A1.prompt_set | Prompt set object | `util-prompt-set`, long `<li>` |
| M08 | KS-A1.checklist | Checkbox sections | `util-checkbox-list` |
| M09 | KS-A1.template | Template sections | `util-template-block`, `util-template-note-line` |
| M10 | KS-A1.escalation_template | SBAR blocks | four `util-template-block` |
| M11 | KS-A1.analysis_table / impact_table | Table + worksheet intro | `<table>`, Worksheet `h4` |
| M12 | KS-A1.strategy_options | Label/description bullets | `<ul><li>` |
| M13 | KS-A1.experimental_unknown_key | Remainder / generic | `util-material-card` or generic block |
| M14 | KS-A1 badges | Duration + grouping | `util-badge`, `util-badge-group` |
| M15 | KS-A1 output + support | Output + support note | `util-output-block`, `util-support-note` |
| M16 | KS-A2 no grouping | Missing badge | header without group badge |
| M17 | KS-A2.prompts string | Markdown prompt fallback | `util-prompt-set` or markdown |
| M18 | KS-A2.comparison_table | Remainder key `comparison_table` | table via `renderMaterialValue` |
| M19 | KS-A2.facilitator_note | Alias for support note | `util-support-note` |
| M20 | KS-A3 density | Six cards, four scenarios, wide table | spacing stress |
| M21 | KS-A3 empty support_note | Empty string | no support aside |
| M22 | KS-A4 minimal | Title + learner_task only | single `util-task-block` |
| M23 | learning_sequence | Sequence blocks | timeline / session steps |
| M24 | assessment_check | MCQ | stems, options lists |
| M25 | study_tips | Study icon not assessment | `util-section-icon--study-tips` |
| M26 | support_notes | Facilitator section | markdown `h2` section |
| M27 | metadata section | Object render in body | section content |
| M28 | top-level generation_notes | Metadata fold | `util-meta`, limitations list |
| M29 | section h2 icons | Per-section FA | `util-section-heading` |

---

## 5. Renderer gap audit

### 5.1 Unsupported or weak areas

| Gap | Severity | Notes |
|-----|----------|-------|
| **Mapped outcomes on activities** | N/A | No renderer field wiring |
| **`comparison_table` / ad-hoc keys** | Low | Rely on remainder loop; heading quality varies |
| **Duplicate icon on checklist vs prompt** | P2 | Both may use `fa-comments` |
| **Worksheet intro text hard-coded** | P2 | “Use this table…” injected for all analysis/impact tables |
| **Unknown keys** | Medium | Generic render OK; visual consistency weak |
| **PRISM TRACE console.log** | P2 | Noise in devtools during material render |
| **Linked journey vs flat sequence** | Medium | Behaviour depends on resources probe; not in kitchen sink |
| **Separate `activity_materials` section** | By design | Strict export uses composed LA only; inflation uses probe |
| **Learning object mode** | Medium | Per-screen spacing not covered by kitchen sink alone |
| **feedback_display grid** | Low | Kitchen sink uses `none`; need second fixture variant for answers |

### 5.2 Layout / presentation (Sprint 26 targets)

| Issue | Backlog ref |
|-------|-------------|
| Section vertical rhythm inconsistent | B26-001 |
| Nested material double padding | B26-002 |
| Wide tables overflow on print | B26-004 |
| Long prompt sets hard to scan | B26-005 |
| Badge contrast | B26-022 |
| Metadata fold discoverability | B26-016 — **addressed (26-3)** metadata → `util-meta` only |

### 5.3 Accessibility

| Issue | Notes |
|-------|-------|
| Decorative icons | Generally `aria-hidden` |
| Checkbox lists | Token + text; verify screen reader |
| Table headers | Present for markdown tables |
| Heading jumps | `h4` materials under `h3` activity — acceptable but dense |

### 5.4 Duplication / maintenance

| Area | Risk |
|------|------|
| Markdown table parsing | Duplicated in `renderMaterialValue` and utilities |
| Bullet/checkbox splitting | Complex `renderBulletArray` |
| Material remainder vs first-pass | Two paths can diverge |

---

## 6. Sprint 26 slice recommendations

| Slice | Action |
|-------|--------|
| **26-1** | Mark audit complete; use kitchen sink HTML for baseline screenshots |
| **26-2** | **Done** — spacing pass via `getUtilityPagePresentationCssV26_2` (KS-A3 density/print) |
| **26-3** | **Done** — fallback safety, metadata fold, checklist distinction, no worksheet injection |
| **26-3b** | Material pattern polish (M05–M13) |
| **26-4** | **Done** — professional polish (`getUtilityPagePresentationCssV26_4`, timeline/meta/table/card hierarchy) |
| **26-5** | **Done** — typographic finish (`getUtilityPagePresentationCssV26_5`, assessment identity, print shadow strip) |
| **26-5** | Extend tests: class counts, section icons, meta fold, KS-A1–A4 titles |
| **26-6** | Optional: `renderer-kitchen-sink-page-answers.json` variant with `feedback_display: answer_grid_end` |

---

## 7. Usage

```bash
node --test tests/utility-renderer-kitchen-sink.test.js
```

Utilities: paste JSON from fixture → Generate HTML → visual review.

**Do not** use this JSON to validate Design Page composition closure (`validatePageActivityClosure` expects real upstream `learning_activities`).

---

## 8. Related

- [`renderer-governance.md`](renderer-governance.md)
- [`renderer-refinement-backlog.md`](renderer-refinement-backlog.md)
- [`ld-inflation-workshop-page-full.json`](../../../tests/fixtures/page-render/ld-inflation-workshop-page-full.json) — production-shaped benchmark (composition fidelity)
