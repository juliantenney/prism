# Sprint 16 — Renderer & Page Contract Stabilisation (prep)

**Date:** 2026-05-15  
**Path:** `docs/consolidation/sprint-16-renderer-page-contract-stabilisation.md`  
**Status:** **Preparation only** — defines Sprint 16 starting point after Sprint 15 E2E proof. **Does not** approve a broad renderer redesign, separate Research/LD renderers, Utilities overhaul, or new workflow schema.

**Baseline:** Sprint **15** proved **Research → Design Page → `page` artefact → Utilities HTML**. First Research page rendered successfully; **list/bullet presentation remains inconsistent** across shapes and domains. Sprint **16** hardens the **shared** Utilities renderer and **`page`** contract.

**Related:** [`sprint-15-index.md`](sprint-15-index.md), [`sprint-15-charter.md`](sprint-15-charter.md), [`../architecture/renderer-export-behavior.md`](../architecture/renderer-export-behavior.md), [`sprint-14-current-known-issues.md`](sprint-14-current-known-issues.md) §11.

---

## 1. Sprint 16 intent (one sentence)

Stabilise the **single** Utilities HTML path and a **shared `page` JSON contract** so Research and Learning Design Design Page outputs render predictably—via **minimal, tested** renderer fixes, not parallel renderers or schema expansion.

---

## 2. Non-goals (carry forward)

| Excluded | Rationale |
|----------|-----------|
| Separate Research / LD renderers | Death-by-a-million-formats; one `buildUtilityStructuredHtml` path |
| Utilities UI redesign | Out of scope |
| New workflow schema / output types | Contract discipline only |
| Broad portability architecture | Sprint 13 boundary |
| Prompt/template rewrites unless contract-driven | Prefer renderer + contract alignment first |

---

## 3. Audit — Design Page prompts & `page` artefact shapes

### 3.1 Shared top-level contract (both domains)

Both packs declare the same **top-level keys** for Design Page output:

| Field | Research | Learning Design | Renderer use |
|-------|----------|-----------------|--------------|
| `artifact_type` | must be `page` | must be `page` | `resolveUtilityRenderPlan` lookup |
| `title` | required | required | `<h1>` |
| `audience` | required / inferred | required / inferred | Audience line |
| `page_profile` | `learner` \| `facilitator` \| `assessment` (labels differ) | same enum | Passed to `utilityRenderPageSections` opts; omitted from body |
| `sections` | array of `{ section_id, heading, content }` | same + strict LD inner shapes | Primary body via `utilityRenderPageSections` |
| `source_artefacts` | object of booleans | object of booleans | Metadata `<details>` when ordered |
| `constraints_applied` | optional | optional | Metadata |
| `generation_notes` | optional; `limitations[]` when gaps | optional; `limitations[]` when hard constraints unmet | Metadata |

**Sources:** `domains/research/domain-research-step-patterns.md` §13; `domains/learning-design/domain-learning-design-step-patterns.md` §13.

### 3.2 Research vs LD — where they diverge

| Aspect | Research Design Page | LD Design Page |
|--------|----------------------|----------------|
| **Prompt strictness** | Shorter; “same contract as platform Design Page”; free-form section headings (Executive overview, Key findings, …) | Long `defaultPromptNotes` + template: canonical `section_id`s, rich `learning_activities.content[]`, structured `assessment_check.content.items` |
| **Section `content`** | Typically **markdown strings** (bullets, prose, tables) in `sections[].content` | **Structured objects/arrays**: activity rows, `materials` objects, assessment item rows |
| **Canonical section_ids** | Suggested in prose only (not enforced in prompt) | Enforced: `overview`, `learning_purpose`, `knowledge_summary`, `learning_activities`, `assessment_check`, `support_notes` |
| **User options** | `page_profile` only | `page_profile`, `include_answers`, `include_marking_guidance`, `include_feedback_guidance` |
| **Pack artefact doc** | Research pack has **no** `page` artefact section in `domain-research-artefacts.md` | `domain-learning-design-artefacts.md` §18 defines `page` + **renderHints** |

**Implication:** Research workflows emit `artifact_type: page` but **render metadata** (`renderHints.renderConfig`) comes from the **Learning Design** artefact catalogue entry (`getArtefactRenderCatalog({})` merge — first domain wins for id, LD fills `renderHints`). Research does not define a separate render plan.

### 3.3 LD inner shapes the renderer expects

- **`learning_activities` section:** `content` = array of activity objects (`activity_id`, `title`, `duration_minutes`, `learner_instructions`, `materials` object, …). Renderer: `renderLearningActivitiesBlocks`, `renderMaterialsForActivity`, scenario/stage helpers.
- **`assessment_check` section:** `content` = `{ items: [...] }` with MCQ rows (`stem`, `options`, optional answer fields). Renderer: `renderQuestionBlocks` + `feedback_display` modes.
- **`knowledge_summary`:** array of `{ concept, summary }` or similar — `renderKnowledgeSummaryBlocks`.
- **Materials:** named fields (`task_cards`, `scenarios`, `checklist`, `analysis_table`, …); markdown in **named string fields**, not flattened into bullet-only strings.

### 3.4 Research inner shapes (typical)

- `sections[]` with **string** `content` containing `•` multiline lists, inline `•` runs, `-` checklists, pipe tables, or prose + bullets.
- Occasional **LD-shaped nesting** if the model mimics activity cards (Sprint 15 fixture used `materials.content` string — valid but not the Research prompt default).

---

## 4. Audit — Utilities renderer path

### 4.1 Pipeline (unchanged architecture)

```
handleUtilitiesGenerate()
  → JSON.parse (+ light escape normalisation)
  → resolveUtilityRenderPlan(parsed, format)
       → WorkflowGenerationContext.getArtefactRenderCatalog({})
       → validate renderHints.renderConfig (sectionOrder, labels, omitIfMissing, grouping, itemKeyMap)
  → runUtilityRendererByPlan(plan, parsed, …)
       → buildUtilityStructuredHtml (document / page variant)
            → utilityRenderPageSections (sections array or object)
            → section helpers (activities, assessment, knowledge, materials, questions)
            → metadata blocks (source_artefacts, constraints_applied, generation_notes)
            → sanitizeUtilityHtmlOutput (final HTML pass)
```

**Canonical behaviour doc:** `docs/architecture/renderer-export-behavior.md`.

### 4.2 `resolveUtilityRenderPlan`

- Requires top-level `artifact_type`; only **html** format supported in UI.
- Loads **all domains’** artefact rows when catalog opts are `{}` (pack-sensitive; not persisted in workflow JSON).
- For `page`: expects LD `renderHints` with `rendererType: document`, `rendererVariant: page`, `sectionOrder` listing **canonical LD section keys** (`overview`, `learning_purpose`, …) — **not** the key `sections`.

**Consequence:** Design Page JSON stores body in `parsed.sections` (array). Renderer processes `sections` when that key appears in `Object.keys` fallback (not in LD `sectionOrder`). Order: `sectionOrder` keys first (usually empty on Research payloads), then remaining keys including `sections`.

### 4.3 `buildUtilityStructuredHtml` (page mode)

- `isPageArtefact`: special-case `sections` → `utilityRenderPageSections` with `cleanupInlineMarkdown: true`, `suppressInternalMetadata: true`.
- `page_profile` skipped as visible section.
- `source_artefacts` (object of booleans) → labelled `<ul>` in metadata fold.
- `presentationMode: learning_object` → per-section screens + metadata aside.

### 4.4 `utilityRenderPageSections`

- **Array form:** `[{ section_id?, heading?, content? }, …]` — primary for both domains.
- **Heuristic section detection** on heading/key: learning activities, assessment, knowledge summary, sequence, resources (LD-biased regexes).
- **String `content`:** `utilityRenderPrimitive` → `utilityRenderMarkdownBlock`.
- **Array `content`:** activities / tasks / questions / generic array renderers.
- **Object `content`:** `utilityRenderObject` or question extraction.

### 4.5 Text / material helpers

| Helper | Role |
|--------|------|
| `utilityRenderMarkdownBlock` | Block markdown: headings, `-/*` bullets, ordered lists, tables, `•` inline/multiline, prose+bullets |
| `utilityRenderMarkdownInline` | Bold/italic/links/code within lines |
| `renderLearningActivitiesBlocks` | LD activity cards; card-scoped markdown flush |
| `renderMaterialsForActivity` | Named material keys; scenarios, checklists, tables |
| `renderQuestionBlocks` | Assessment items, MCQ options, answer grids |
| `sanitizeUtilityHtmlOutput` | Checkbox list class, placeholder strip, dash-prompt split, adjacent `<ul>` merge, empty section drop |

### 4.6 Test hooks (`__PRISM_TEST_API`)

- `utilityRenderMarkdownBlockForTest` — markdown unit tests.
- `buildUtilityStructuredHtmlForTest(parsed, sectionOrderOverride?)` — page HTML integration; default `sectionOrder: ["sections"]`.

---

## 5. Sprint 15 — observed fixture / E2E issue

**Symptom:** “List/bullet rendering inconsistent” on first real Research page.

**What worked (Sprint 15):**

- E2E chain: Research terminal **Design Page** → Utilities → HTML produced.
- `utilityRenderMarkdownBlock` handles `•` newline lists, inline `•` runs, prose+bullets (see `tests/utility-markdown-bullet.test.js`).
- LD-shaped path: `materials.content` string with newline `•` bullets → `<ul>/<li>` (`buildUtilityStructuredHtml` test).

**Inconsistency drivers (prep findings):**

1. **Shape mismatch:** Research prompt emits `sections[].content` strings; LD path expects structured activities/assessment. Same renderer, different branches — bullets fine on strings, fragile if content is array-of-strings without `-`/`•` prefixes.
2. **Bullet marker diversity:** `•` (handled in `utilityRenderMarkdownBlock`) vs `-` (line bullets) vs hyphen checklist with `☐` (checkbox pass in **sanitizer**, not always in markdown block).
3. **Catalog `sectionOrder` vs `sections` array:** LD renderConfig does not list `sections`; reliance on `Object.keys` ordering can interleave metadata (`source_artefacts` UL) with body when not folded into `<details>`.
4. **Research pack has no `page` renderHints:** Behaviour tied to LD catalogue; changes to LD artefact doc affect Research HTML.
5. **Sprint 15 integration test gap:** Bullet regression targeted markdown block + LD materials wrapper, not canonical Research `sections[].content` string (addressed in Sprint 16 prep fixtures).

---

## 6. Proposed shared `page` contract (Sprint 16 target)

**Normative for both domains** (prompt alignment + renderer assumptions):

```json
{
  "artifact_type": "page",
  "title": "string",
  "audience": "string",
  "page_profile": "learner | facilitator | assessment",
  "sections": [
    {
      "section_id": "string (stable id; LD canonical ids when applicable)",
      "heading": "string (human-facing)",
      "content": "string | object | array — see profile rules"
    }
  ],
  "source_artefacts": { "artefact_name": true },
  "constraints_applied": {},
  "generation_notes": { "limitations": ["string"] }
}
```

**Content rules:**

| Profile / section | Research | LD |
|-------------------|----------|-----|
| Briefing sections | `content` **string** (markdown); prefer `•` or `-` line bullets; tables in own paragraph block | Same for overview/purpose prose |
| `learning_activities` | N/A unless hybrid | `content`: **array** of activity objects; `materials` **object** |
| `assessment_check` | Optional string summary only if no items | `content`: `{ "items": [ ... ] }` |
| Metadata | Booleans only in `source_artefacts` | Same |

**Renderer MAY** continue to accept legacy variants (object-wrapped sections, top-level canonical keys) but Sprint 16 tests should lock the **array + section_id** form.

---

## 7. Supported markdown subset (renderer truth)

Documented subset for **string `content`** (via `utilityRenderMarkdownBlock` + sanitizer):

| Feature | Support | Notes |
|---------|---------|-------|
| Paragraphs | Yes | Blank-line separated; merged lines → one paragraph |
| `##`–`######` headings | Yes | In blocks; stripped/cleaned in some card contexts |
| `-` / `*` / `•` line bullets | Yes | `•` also split inline on ` • ` |
| Ordered `1.` / `1)` lists | Yes | |
| `**bold**`, `*italic*`, `` `code` ``, links | Yes (inline) | `cleanupInlineMarkdown` strips `**` in page mode |
| Pipe tables | Yes | Requires divider row |
| `---` hr | Yes | |
| Checkbox lines `☐` / `- ☐` | Partial | Block → `<ul>`; sanitizer may upgrade to `util-checkbox-list` |
| Raw HTML | No | Escaped |
| Nested lists | Best-effort | No full CommonMark |

**Not supported:** arbitrary HTML, footnotes, code fences as blocks, nested blockquotes.

---

## 8. LD page rendering considerations (deferred overhaul, not ignored)

- Section heuristics and icons assume LD vocabulary (`learning_activities`, `assessment_check`, …). Research headings (`Key findings`) use generic `fa-file-lines` icon — acceptable.
- `renderConfig.sectionOrder` targets **top-level keys** that LD prompts rarely emit (body is in `sections[]`). Do **not** rename LD prompts to top-level keys in Sprint 16; optionally add `sections` to `sectionOrder` in artefact renderHints as a **small** catalogue fix.
- Activity/material fidelity rules are LD-heavy; Research should not be forced through `learning_activities` unless content is truly activity-shaped.

---

## 9. Immediate renderer hardening tasks (prioritised)

| Priority | Task | Rationale |
|----------|------|-----------|
| P0 | Lock regression fixtures (below) in CI | Prevent bullet/table/checkbox regressions on real `page` JSON |
| P1 | Ensure `sections[].content` **string** bullets (`•`, `-`) always reach `utilityRenderMarkdownBlock` | Research default path |
| P1 | Metadata ordering: render `source_artefacts` / `generation_notes` only inside `<details class="util-meta">` when `sections` present | Avoid extra `<li>` in body scan / visual clutter |
| P2 | Align hyphen checklist in string sections with checkbox sanitizer consistently | E2E checklist sections |
| P2 | Add `sections` to LD `page` `renderConfig.sectionOrder` (after canonical keys or as primary body key) | Predictable section-first ordering |
| P3 | Document Research reliance on LD `renderHints` in `domain-research-artefacts.md` or shared general artefact | Pack clarity |
| P3 | Optional: Research `page` renderHints mirror (same config, explicit dependency) | Reduces “hidden LD dependency” |

**Explicitly defer:** new renderer families, Learning Object mode changes, assessment answer-mode redesign.

---

## 10. Regression fixture & test plan

### 10.1 Fixtures (added in prep)

| File | Covers |
|------|--------|
| `tests/fixtures/page-render/research-multiline-bullets.json` | Research `sections[].content` with newline `•` |
| `tests/fixtures/page-render/research-inline-bullets.json` | Inline `•` run |
| `tests/fixtures/page-render/research-prose-bullets-prose.json` | Prose + bullets + prose |
| `tests/fixtures/page-render/ld-learning-activities-assessment.json` | LD activities + `assessment_check.items` |
| `tests/fixtures/page-render/markdown-table-section.json` | Pipe table in string section |
| `tests/fixtures/page-render/checkbox-list-section.json` | `- ☐` checklist string |
| `tests/fixtures/page-render/metadata-full.json` | `source_artefacts`, `constraints_applied`, `generation_notes` |

### 10.2 Tests

| File | Scope |
|------|--------|
| `tests/utility-markdown-bullet.test.js` | `utilityRenderMarkdownBlock` + LD materials wrapper (existing) |
| `tests/utility-page-render.test.js` | Full `buildUtilityStructuredHtmlForTest` per fixture (added) |

**Run:** `node --test tests/*.test.js`

**Regression run (2026-05-15):** **80** tests, **0 failures** (`utility-page-render.test.js` shape semantics + existing suite).

**Bounded E2E HTML smoke (2026-05-15):** `node scripts/sprint-16-e2e-html-smoke.js` → HTML under `tests/output/sprint-16-e2e/` for Research briefing (`shape-metadata-with-body.json`), LD learner + facilitator (`ld-learning-activities-assessment.json`), and assessment MCQ (`shape-structured-assessment-mcq.json`). Inline bullet, prose+bullets, table, and checkbox shapes covered by automated shape fixtures in `utility-page-render.test.js`.

### 10.3 Future fixtures (Sprint 16 implementation)

- Research page with `sections[].content` as **array of strings** (failure mode if model emits bullet lines without markers).
- LD page with `feedback_display: answer_grid_end` and answer fields.
- `artifact_type: page` through **`resolveUtilityRenderPlan`** with frozen catalog snapshot (Sprint 11 inventory item 15 — optional, higher cost).

---

## 11. Recommended Sprint 16 first implementation slice

1. Run full test glob; fix any failing **Research string section** bullet edge cases (P1).
2. Metadata fold ordering fix (P1) — smallest HTML diff with high visual impact.
3. Update `renderer-export-behavior.md` with shared contract §6–7 from this note.
4. One manual E2E re-run of Sprint 15 Research workflow; compare HTML to fixture expectations.

---

## 12. Review log

- **2026-05-15** — Sprint 16 prep: domain prompt audit, renderer path audit, shared contract proposal, fixtures + `utility-page-render.test.js`, test API `sectionOrder` override; full `node --test tests/*.test.js` green.
- **2026-05-15** — Closure verification: shape-first page renderer hardening confirmed with 80-test green run and bounded E2E Utilities HTML smoke checks for Research, Learning Design, and assessment-oriented page outputs. No schema, workflow generation, Utilities UI, or domain-specific renderer changes.
