# Sprint 31 charter — Page rhetoric & renderer experience

**Pack path:** `docs/development/sprints/2026-06-01-sprint-31-page-rhetoric-renderer-experience/`  
**Status:** **CLOSED** (2026-06-01 — [R31-999](review-log.md))  
**Date:** 2026-06-01  
**Predecessor:** [Sprint 30 CLOSED](../2026-05-21-sprint-30-pedagogic-enrichment-layer/SPRINT-30-RETROSPECTIVE.md) (PEL Phases 1–2)  
**Closure:** [`SPRINT-31-RETROSPECTIVE.md`](SPRINT-31-RETROSPECTIVE.md) — all six planned slices implemented; final test floor **502** pass / **0 fail**

**Governance:** Sprint 30 [`phase-3-design-constraints.md`](../2026-05-21-sprint-30-pedagogic-enrichment-layer/phase-3-design-constraints.md) still applies to any future generation work — Sprint 31 touches **renderer (R-layer) only**.

---

## Programme framing

| Sprint | Role |
|--------|------|
| **Sprint 30** | Made Prism **pedagogically intelligent** — `orientation_contract`, `reasoning_contract`, passive cue render, bounded sanitisation |
| **Sprint 31** | Makes Prism **pedagogically elegant** — calm, scannable, professionally authored **rendered** pages |

> **Sprint 31 is not a pedagogy-expansion sprint.**

No new PECs, no `metacognition_contract`, no workflow topology changes, no changes to what the model is asked to generate except where rendering absolutely requires a field already in JSON.

---

## 1. Goal

Improve **rendered page quality** so self-directed learner outputs feel:

- **Professionally authored** — intentional hierarchy, not assembled chrome
- **Calm** — room to think; reduced visual shouting
- **Readable** — clear scan path from purpose → cues → action → materials
- **Studyable** — notebook-and-pencil friendly; confidence-building tone in layout

Success is measured by **learner experience of the HTML export**, not by adding more pedagogic fields.

---

## 2. Scope

Sprint 31 focuses on the **utility page renderer** (`buildUtilityStructuredHtml`, `utilityRenderPageSections`, `renderActivityFramingForActivity`, material/card/table renderers, assessment blocks, metadata fold) and **embedded presentation CSS** in `app.js`.

| Area | Intent |
|------|--------|
| **Visual hierarchy** | Primary (task) vs secondary (orientation/reasoning) vs background (meta) |
| **Cue prominence** | Differentiate PEL orientation cues, reasoning cues, cognition blocks, support notes |
| **Density management** | Fewer simultaneous competing elements; renderer-side dedupe/omit where non-generative |
| **Rhetorical differentiation** | Label tone and weight (“How to think” vs “What to do”) |
| **Page pacing** | Section rhythm, activity-card spacing, breaks between dense blocks |
| **Typography / spacing** | Font size, line-height, margins on cues and preambles |
| **Concept presentation consistency** | `knowledge_summary`, concept lists, definitions — one calm pattern |
| **Activity-card rhythm** | Header → framing → task → materials → output; predictable structure |
| **Assessment presentation** | MCQ/options, formative check sections — clear, not noisy |
| **Metadata visibility** | `source_artefacts`, `generation_notes`, `constraints_applied` — learner vs developer boundary |
| **Table / material polish** | Pipe tables, templates, worked examples, awkward inline pipe-text |

### Layer policy

| Layer | Sprint 31 may touch |
|-------|----------------------|
| **E / O / G** (brief, topology, generation) | **No** — frozen unless blocker |
| **C** (composition) | **No** — frozen |
| **R** (renderer + presentation CSS) | **Yes** — primary surface |

Renderer remains **passive**: display and omit/dedupe only; **no** LLM, no invented pedagogy, no synthesis of new instructional prose.

---

## 3. Out of scope

| Excluded | Notes |
|----------|--------|
| **New PECs** | Including `metacognition_contract` |
| **`metacognition_contract` implementation** | Deferred with Sprint 30 Phase 3 |
| **New workflow steps** | Topology frozen |
| **Orchestration changes** | `applyWorkflowDesignHeuristics`, trigger rules |
| **Adaptive tutoring** | No runtime adaptation |
| **Diagram / chart generation workflow** | No new asset pipelines |
| **Image generation** | Out of scope |
| **Learner modelling** | No profiles or history |
| **Pedagogic contract changes** | Unless strictly required for a render bug (unlikely) |
| **Broad CSS redesign without tests** | Every visual change needs fixture/assertion coverage |
| **Sprint 30 sanitiser / GAM / DLA prompt changes** | Unless regression fix only |

---

## 4. Evidence base

### Representative pages

| Profile | Primary sources | Role in Sprint 31 |
|---------|-----------------|-------------------|
| **Marx self-study** (humanities) | [`marx-page.json`](../2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/live-artefacts/marx-page.json), [`marx-render.html`](../2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/live-artefacts/marx-render.html), [`marx-self-study-page.json`](../../../tests/fixtures/page-render/marx-self-study-page.json), [`renderer-kitchen-sink-page.json`](../../../tests/fixtures/page-render/renderer-kitchen-sink-page.json) (KS-A6/A7) | High PEL density; bridges; tables; transfer task |
| **RNA / HCV self-study** (STEM transcript) | [`rna-page.json`](../2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/live-artefacts/rna-page.json), [`rna-render.html`](../2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/live-artefacts/rna-render.html), [`ld-rna-hcv-assessment-page.json`](../../../tests/fixtures/page-render/ld-rna-hcv-assessment-page.json) | Evidence/contrast cues; long materials in cards; assessment section |
| **Quantitative / statistical interpretation** (third profile) | **To capture:** dedicated self-study page on statistical significance / hypothesis testing when available; **interim:** assessment-heavy fixtures + table-rich kitchen-sink sections | Methods vocabulary, numeric tables, MCQ presentation |

**Before/after comparison:** Re-render Marx/RNA live JSON through `buildUtilityStructuredHtmlForTest` after each slice; manual calmness rubric + automated HTML assertions.

### Observed issues (Sprint 30 outputs)

Recorded from Factory live HTML, fixture renders, and retrospective review ([`SPRINT-30-RETROSPECTIVE.md`](../2026-05-21-sprint-30-pedagogic-enrichment-layer/SPRINT-30-RETROSPECTIVE.md)):

| Issue | Observation |
|-------|-------------|
| **Density near upper limit** | Marx and RNA pages carry preamble + multiple PEL cues + cognition + task + materials — readable but busy |
| **Similar visual weight on cues** | `util-pel-orientation-cue` and `util-pel-reasoning-cue` can feel equally loud; hard to see what matters most |
| **Metadata boundary** | `metadata` section / `source_artefacts` / `generation_notes` sometimes feel developer-facing; `util-meta` fold exists but not all paths consistent ([`shape-production-metadata.json`](../../../tests/fixtures/page-render/shape-production-metadata.json) tests fold) |
| **Key concepts inconsistent** | `knowledge_summary` as object vs prose vs bullets varies by page |
| **Awkward worked examples** | Pipe-table or markdown fragments inline in cards instead of calm table/template blocks |
| **Tables generally strong** | Need spacing, header rhythm, print-friendly polish |
| **Long materials inside cards** | GAM content can dominate activity block; weak separation from “What to do” |
| **Repeated cue structures** | Stacked “Before you start” / “How to think” / “Reflect” reads as generated template |
| **Not yet “wow”** | Pedagogically capable; presentation still feels **assembled** rather than **authored** |

### Existing renderer test surface (planning inventory)

| Test file | Fixtures / focus |
|-----------|------------------|
| `tests/utility-renderer-kitchen-sink.test.js` | Synthetic coverage: materials, MCQ, metadata fold, KS-A7 reasoning |
| `tests/utility-page-render.test.js` | Page shapes: metadata fold, tables, assessment MCQ |
| `tests/utility-self-directed-activity-framing.test.js` | PEL orientation + reasoning cue order/labels |
| `tests/utility-renderer-cognition-fields.test.js` | Cognition chrome vs PEL |
| `tests/utility-marx-page-render.test.js` | Marx self-study materials |
| `tests/utility-ld-rna-assessment-page-render.test.js` | RNA/HCV assessment section order |
| `tests/utility-ld-inflation-page-render.test.js` | Workshop page (regression guard) |
| `tests/utility-ld-assessment-visibility-render.test.js` | Assessment visibility semantics |

### Key renderer functions (R-layer — planning reference)

| Function | Role |
|----------|------|
| `buildUtilityStructuredHtml` | Page shell, section order, metadata fold, inline CSS |
| `utilityRenderPageSections` | Section dispatch, facilitator appendix, meta handling |
| `renderActivityFramingForActivity` | PEL orientation + reasoning cues, dedupe |
| `renderLearningActivitiesBlocks` | Activity cards, support notes, materials |
| `renderCognitionFieldsForActivity` | Sprint 28 cognition item blocks |
| `utilityRenderObject` / material renderers | Cards, tables, templates, prompt sets |
| `renderSectionHeadingH2` | Section icons and headings |

---

## 5. Design principles

1. **Help pedagogy breathe** — whitespace and pacing are part of the product.
2. **Foreground learner action** — “What to do” and expected output are the visual anchor.
3. **Make support available but not noisy** — orientation/reasoning cues are secondary rails, not co-primary headlines.
4. **Distinguish primary, secondary, and background** — task > framing cues > materials > metadata.
5. **Avoid visual shouting** — fewer borders, badges, and saturated labels where one level suffices.
6. **Keep pages calm and confidence-building** — study pages should not feel like error logs or facilitator scripts.
7. **Feel authored, not assembled** — consistent rhythm across activities and domains.

These principles **preserve Sprint 30 pedagogic value** — nothing in Sprint 31 should hide reasoning fields that exist in JSON without an explicit, tested omission rule.

---

## 6. Initial slice proposals (charter only — not implemented)

| Slice | Name | Objective | Risk |
|-------|------|-----------|------|
| **31-1** | Metadata visibility & learner/developer boundary | Collapse/hide `source_artefacts`, `generation_notes`, `constraints_applied`, raw `metadata` sections; strengthen `util-meta`; never leak upstream keys into learner body | **Low** |
| **31-2** | Cue hierarchy & visual weighting | Typography and spacing for preamble vs PEL orientation vs reasoning vs cognition; optional de-emphasis classes | Medium |
| **31-3** | Concept / knowledge-summary consistency | One pattern for concept lists, relationships, definitions | Medium |
| **31-4** | Worked-example & material rendering polish | Tables, templates, pipe-text normalisation, card length cues | Medium |
| **31-5** | Density / pacing audit & anti-repetition | Renderer dedupe/omit when cue text duplicates task or prior cue; section spacing pass | Medium–high |
| **31-6** | Assessment presentation refinement | MCQ layout, formative check headings, option spacing | Low–medium |

Slices are **sequential-friendly**: 31-1 first; 31-2 and 31-5 highest learner impact; 31-6 can parallel after 31-1.

---

## 7. Test strategy

| Approach | Use |
|----------|-----|
| **Existing fixtures** | Extend kitchen-sink, Marx, RNA, shape-* fixtures — no visual-only changes |
| **Representative pages** | Marx/RNA live JSON re-rendered in tests where stable; add stats page fixture when captured |
| **Snapshot-style HTML assertions** | Regex/structural checks: section order, class presence, meta fold, cue order, absence of leaked keys |
| **Accessibility** | Semantic structure: `section`, `article`, `details/summary` for meta; heading order; `role="note"` on support aside |
| **Regression floor** | Maintain **≥ 471** pass unless review-log documents justified change |
| **Workshop regression** | `ld-inflation-workshop-page.json` unchanged in facilitated character |

**Not acceptable:** CSS-only tweaks without at least one assertion that would fail on regression.

---

## 8. Success criteria

Rendered pages should:

| Criterion | Measure |
|-----------|---------|
| **Feel calmer** | Manual rubric on Marx/RNA HTML (density, visual noise) |
| **Reduce perceived density** | Fewer duplicate cues visible; improved spacing |
| **Preserve Sprint 30 value** | All PEL fields in JSON still render when present (unless explicit dedupe rule documented) |
| **Easier cue scan** | Primary task found within 5s; secondary cues visually subordinate |
| **Consistent concepts/materials** | Knowledge summary + tables + templates match patterns across probes |
| **Metadata demoted** | No `source_artefacts` / generation noise in main reading flow |
| **No utility test regressions** | Full suite green; kitchen-sink + framing tests updated intentionally |

---

## 9. First recommended implementation slice

**Recommend 31-1 first:** Metadata visibility + learner/developer output boundary.

| Reason | Detail |
|--------|--------|
| **Low risk** | Presentation-only; no pedagogic field changes |
| **Immediate feel** | Pages stop looking like debug exports |
| **Tests exist** | `utility-page-render.test.js` — `shape-production-metadata.json`, kitchen-sink `util-meta` |
| **Aligns with R-layer discipline** | Hide/demote data already in JSON — do not delete generation |

**31-1 exit (draft):** Learner body contains no raw upstream artefact keys; `details.util-meta` (or equivalent) holds production metadata; RNA `metadata` section handled consistently; Marx/RNA live HTML pass manual review.

**After 31-1 approval:** Implement per [`slice-31-1-charter.md`](slice-31-1-charter.md) — not before charter sign-off.

---

## References

| Document | Use |
|----------|-----|
| [`HANDOVER.md`](HANDOVER.md) | New-chat entry point |
| [`sprint-31-seed-notes.md`](../2026-05-21-sprint-30-pedagogic-enrichment-layer/sprint-31-seed-notes.md) | Programme seed |
| [`SPRINT-30-RETROSPECTIVE.md`](../2026-05-21-sprint-30-pedagogic-enrichment-layer/SPRINT-30-RETROSPECTIVE.md) | Why Sprint 31 exists |
| [`phase-3-design-constraints.md`](../2026-05-21-sprint-30-pedagogic-enrichment-layer/phase-3-design-constraints.md) | Anti-saturation rules if generation touched later |
| [`baseline-test-floor.md`](baseline-test-floor.md) | Inherited 471 floor |
