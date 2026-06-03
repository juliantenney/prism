# Sprint 33 → Sprint 34 Handover & Forward Plan

**Date:** 2026-06-03  
**Authoritative code:** `app.js`, `tests/`, domain packs under `domains/`  
**Predecessor packs:** Sprint 31 (page rhetoric, **CLOSED**), Sprint 33 (MathJax + pipeline hardening, **COMPLETE**), Sprint 32 (pedagogic diagrams, **PLANNED / NOT STARTED**)

**Test floor (current):** `node --test tests/*.test.js` → **0 fail** after Sprint 34-1 (see §3)

---

## 1. Sprint 33 summary

Sprint 33 delivered **MathJax-aware mathematical notation** end-to-end and hardened the **page rendering + workflow orchestration** paths that block reliable learner-facing HTML for quantitative learning design.

### MathJax & transport

- Supported delimiters only: inline `\(...\)`, block `\[...\]` (no `$` / `$$`).
- **Preservation-first** pipeline: `utilityProtectSupportedMathBlocks` / restore around markdown parsing.
- **Utilities JSON normalization:** `utilityNormalizeUtilitiesJsonInput` + `normalizeJsonMathDelimiterEscapes` — tolerates invalid TeX spacing `\ ` inside strings; doubles unescaped backslashes before MathJax delimiters `( ) [ ]` for JSON-safe parse.
- **Preview/export:** guarded MathJax activation when supported delimiters present; pinned CDN bootstrap (`mathjax@3.2.2`) documented as interim; fail-safe to raw delimiter text if typeset unavailable.
- **Producer alignment:** `buildMathSafeOutputContractPromptBlock` / `applyMathSafeOutputContractToDraft` on DLA, GAM, Design Page, and assessment producer steps; domain step patterns reference math-safe rules; visible runner text strips internal contract wording.

### Workflow orchestration

- **Normalize Content gating** (`shouldIncludeNormalizeForSourcePosture`): excluded from `generate_from_topic` / sparse greenfield flows; retained for `provided_source_content`, strong mixed-source evidence, and real ingestion cues; negated source wording does not trigger; dependency `requiresAnyOf` prefers `learning_content` over `normalized_content` for topic-only paths; explicit prune when `generateFromTopic`.
- **Generate VLE Structure gating** (`shouldIncludeVleStructureStep`): pruned for page/session self-directed topic workflows; retained for explicit shell/navigation/`session_materials: vle_structure` and large-scope shell intent; explicit re-injection when legitimately required; dependency chain protected.

### Rendering & markdown

- **Table normalization** centralized in `utilityRenderMarkdownBlock` (`normalizeMarkdownTableText`, `normalizeSingleLinePipeTable`).
- **Design Page material paths** aligned: `renderMaterialValue`, `renderPlainStructuredText`, assessment prompts via block markdown, `renderActivityResourcesSection` → `renderResourceMarkdownBlock`.
- **Live-shape fixes:** string `materials.template` and singular `materials.scenario` on `learning_activities` rows; multi-section template strings (`renderTableHintHeadingSections` for `materialHint: "table"`) — heading + table + heading + table without `<p>|...|` leaks.

### Regression tests added/extended

| File | Focus |
|------|--------|
| `tests/mathjax-delimiter-preservation.test.js` | Delimiter preservation, JSON normalize, preview/export hooks |
| `tests/mathjax-producer-prompt-contract.test.js` | Producer prompt contract, domain patterns |
| `tests/utility-markdown-bullet.test.js` | Tables, assessment prompt lists, linked resources, A2/A4 live shapes, multi-table template |
| `tests/workflow-ld-orchestration.test.js` | Normalize / VLE gating, ordering |
| `tests/workflow-ld-rna-sparse-brief-topology.test.js` | Lean topic topology excludes Normalize + VLE |

### Programme context (not reopened in Sprint 33)

- **Sprint 31** closed R-layer rhetoric (metadata fold, activity framing, materials stack, assessment hierarchy) at **502** tests — foundation for current export CSS.
- **Sprint 32** remains unstarted (workflow-side pedagogic diagram enrichment); no Sprint 32 implementation in repo.

---

## 2. Architectural state snapshot

```
Brief + resolved factors
    → applyWorkflowDesignHeuristics (step inclusion/prune/order)
    → step runners + math-safe prompt augmentation
    → artefacts (page JSON, materials nested strings)
    → utilityNormalizeUtilitiesJsonInput / tryParseWorkflowArtefactJson
    → buildUtilityStructuredHtml
         → utilityRenderPageSections
         → renderLearningActivitiesBlocks / renderMaterialsForActivity
         → renderPlainStructuredText | utilityRenderMarkdownBlock
    → preview iframe / export HTML
    → optional MathJax typeset (delimiter-gated)
```

| Layer | State |
|-------|--------|
| **Canonical output** | Learner **page** artefact (`page.sections[]`) is the primary delivery surface; workflow steps converge on Design Page + Construct Learning Sequence rather than whole-VLE generation for session-scale resources. |
| **Workflow** | LD policy in `domains/learning-design/domain-learning-design-step-patterns.md`; heuristics in `applyWorkflowDesignHeuristics` (`app.js`). |
| **Renderer** | Single R-layer in `app.js` (~`buildUtilityStructuredHtml`, `renderMaterialsForActivity`, embedded presentation CSS). |
| **Math** | Delimiter policy enforced at generation + normalization + render protection; typeset is post-HTML only. |
| **Tests** | VM-loaded `__PRISM_TEST_API` pattern; fixture JSON under `tests/fixtures/page-render/` and workflow brief fixtures. |

---

## 3. Remaining known issues

| Issue | Evidence | Severity |
|-------|----------|----------|
| ~~Kitchen-sink CSS assertions~~ | **Resolved (34-1):** test drift — assertions expected `margin-bottom:4px`; `getUtilityPagePresentationCssV31_5()` uses `margin-bottom:0` + grid gap | — |
| **Scenario object `heading` on singular path** | Marx fixture `heading: "Factory Scenario"` renders as generic "Scenario 1" via `renderScenarioBlocks` | Optional 34-2: map `entry.heading` in label resolution |
| **MathJax loading decision open** | Sprint 33 HANDOVER: CDN vs local bundle, CSP, static pre-typeset export | Operational / offline export |
| **Dollar delimiters unsupported** | By design; models may still emit `$...$` | Content QA |
| **Renderer path proliferation** | `renderPlainStructuredText` (worksheet/table/heading sections) vs `utilityRenderMarkdownBlock` vs inline `<p>` fallbacks | Maintenance / missed-path regressions |
| **Template `sections[]` vs string** | Both shapes supported; producers may emit either — tests must cover both | Fixture drift |
| **Compressed one-line tables** | Normalized in block path; edge cases with pipes in prose still possible | Low |
| **Sprint 32 not implemented** | Diagram workflow charter only | Out of Sprint 34 scope unless explicitly chartered |

No open **table leak** regressions are recorded in `utility-markdown-bullet.test.js` for the documented A2 multi-table + A4 scenario shapes after the final template-section fix.

---

## 4. Recommended Sprint 34 priorities

Align with refinement (not new subsystems):

1. **Instructional clarity pass** — learner task vs materials vs expected output boundaries; reduce facilitator leakage in export; tighten PEL/cognition field presentation without schema changes.
2. **Typography & layout refinement** — hierarchy, rhythm, print margins; reconcile kitchen-sink expectations with live CSS.
3. **Visual–semantic consistency** — material type → icon/heading/card class mapping; assessment vs template vs scenario distinction at a glance.
4. **Renderer simplification** — consolidate table/markdown entry points; reduce worksheet-mode false positives on table content.
5. **End-to-end fixture hardening** — capture real composed page JSON (post-workflow) for RNA/statistics-style pages including math + multi-table templates.

---

## 5. Risk areas

| Risk | Mitigation |
|------|------------|
| **Delimiter corruption** in new normalizers | Run `mathjax-delimiter-preservation.test.js` on every markdown/JSON change |
| **Workflow step regression** (Normalize/VLE) | `workflow-ld-orchestration.test.js`, `workflow-ld-rna-sparse-brief-topology.test.js` |
| **Renderer “fix one path, break another”** | Add fixture per *artefact shape* (string vs `sections[]`, singular `scenario` vs `scenarios[]`) before patching |
| **MathJax async races** in preview | Existing hook tests; manual re-render stress on long pages |
| **Over-scoping Sprint 34** | Keep generation/schema/PEC frozen; R-layer + fixtures + copy clarity only |
| **Reopening Sprint 31/32 boundaries** | Sprint 34 ≠ diagram workflow unless new charter |

---

## 6. Suggested regression suites

**Always run (Sprint 34 gate):**

```bash
node --test tests/mathjax-delimiter-preservation.test.js
node --test tests/mathjax-producer-prompt-contract.test.js
node --test tests/utility-markdown-bullet.test.js
node --test tests/utility-page-render.test.js
node --test tests/utility-renderer-kitchen-sink.test.js
node --test tests/workflow-ld-orchestration.test.js
node --test tests/workflow-ld-rna-sparse-brief-topology.test.js
```

**Workflow / pedagogy context:**

```bash
node --test tests/workflow-ld-cognition-topology.test.js
node --test tests/workflow-self-directed-activity-framing-adoption.test.js
node --test tests/utility-self-directed-activity-framing.test.js
node --test tests/utility-page-composition-closure.test.js
node --test tests/workflow-sprint27-post-stabilisation-observation.test.js
```

**Full floor (before merge):**

```bash
node --test tests/*.test.js
```

Target: restore **0 fail** (resolve 2 kitchen-sink failures or update assertions to match intentional CSS).

---

## 7. Visual refinement opportunities

Building on Sprint 31 R-layer (`.util-activity-framing`, `.util-materials-stack`, `.util-assessment-prompt`, material icons):

| Area | Opportunity |
|------|-------------|
| **Typography hierarchy** | Stronger distinction H1 page title → H2 section → H3 activity → H4 material type → H5 in-card subheads |
| **Whitespace rhythm** | Consistent gaps between task block, materials block, output block; reduce double borders |
| **Material differentiation** | Template (dashed/amber) vs scenario (teal) vs task card (indigo) — verify contrast in print |
| **Table polish** | `.util-table-scroll`, header row weight, empty-cell min-height for worksheet templates |
| **Small visual bumps** | Badge alignment, support-note density, checkbox list vertical rhythm |
| **Kitchen-sink parity** | Align embedded CSS selectors with documented Sprint 31 framing rules |

---

## 8. Pedagogical refinement opportunities

| Area | Current state | Sprint 34 angle |
|------|---------------|-----------------|
| **Cognition framing** | Fields copied to activities; renderer skips duplicate material keys | Surface “how to think” without cluttering task line |
| **Instructional clarity** | `learner_task`, `expected_output`, `support_note` rendered | Reduce repetition across activities; one primary action per card |
| **Activity operationalisation** | Materials typed (template/scenario/cards/checklist) | Ensure task verbs match material type (fill table vs discuss scenario) |
| **Workbook cadence** | Manual observation: similar table/scaffold patterns across activities | Review repetition in composed fixtures (RNA/sparse briefs); renderer dedupe is exact-match only |
| **Assessment semantics** | Sprint 27 topology tests + visibility render tests | Prompt + choices hierarchy already improved; verify math in stems/options |

Defer **`metacognition_contract`** on generation layer (Sprint 30 Phase 3 deferral) unless programme explicitly reopens.

---

## 9. Technical debt cleanup items

| Item | Location / notes |
|------|------------------|
| Unify markdown table parsing | `renderMarkdownTableBlock` (in `renderPlainStructuredText`) vs `utilityRenderMarkdownBlock` normalization — single preprocessor |
| Template string entry | One function for `materialHint: "table"` + heading sections; call from string and `sections[]` paths |
| Remove diagnostic `[PRISM TRACE]` noise | `renderMaterialValue` / materials remainder loop — gate behind debug flag |
| MathJax CDN decision | Document + implement local bundle or CSP policy per `mathjax-rendering-architecture.md` |
| Kitchen-sink test maintenance | Update CSS substring tests or extract golden CSS module |
| `renderActivityResourcesSection` vs activity materials | Document when linked-journey resources vs inline `materials.*` apply |
| Fixture library | Add `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` from regression strings |

---

## MATHJAX (reference)

### Delimiter policy

- **Supported:** `\(...\)`, `\[...\]`
- **Unsupported:** `$...$`, `$$...$$` (explicitly forbidden in producer contract)
- Detection: `utilityContainsSupportedMathDelimiters`; typeset only when present

### JSON-safe serialization / parsing

- `utilityNormalizeUtilitiesJsonInput` before `JSON.parse` in utilities + artefact ingest
- `\ ` + whitespace → space; unescaped `\(` `\)` `\[` `\]` → doubled backslash inside JSON strings
- Valid TeX commands (`\\frac`, `\\pm`, etc.) preserved when already escaped

### Renderer / export handling

- HTML built first; MathJax injected for preview/export parity
- Block math protected from markdown list heuristics (minus-sign lines)
- No equation editor, CAS, or auto-checking

### Regression coverage

- `tests/mathjax-delimiter-preservation.test.js` (30 tests)
- `tests/mathjax-producer-prompt-contract.test.js` (11 tests)
- Activity materials regression in delimiter suite (M1/M2 block math)

### Remaining edge cases

- Malformed LaTeX rendering quality (MathJax error UI)
- Heavy equation pages — performance not benchmarked in CI
- Offline export without CDN access
- Model output using dollar delimiters — requires prompt QA, not renderer fix

---

## WORKFLOW ORCHESTRATION (reference)

### Normalize Content gating

- Functions: `shouldIncludeNormalizeForSourcePosture`, `hasIngestionInputCue`, `hasNegatedSourceCue`
- `generate_from_topic`: start **Generate Learning Content → Model Knowledge → Define Learning Outcomes** (no Normalize)
- Source workflows: Normalize retained when posture requires

### Generate VLE Structure gating

- Function: `shouldIncludeVleStructureStep`
- Excluded: topic + page/session scope without explicit shell intent
- Included: explicit Moodle/shell language, `session_materials` includes `vle_structure`, module/course + platform cues

### Page-as-canonical-output direction

- Design Page produces `page` artefact; Construct Learning Sequence orders pedagogy; VLE structure optional and non-consuming for Design Page
- `vle_structure` artefact has no downstream `requires` in current LD policy

### Sparse brief behaviour

- `workflow-ld-rna-sparse-brief-topology.test.js` validates lean chains
- Post-stabilisation observation harness: `workflow-sprint27-post-stabilisation-observation.test.js` + `manual-validation-observation-log.md`

---

## RENDERING (reference)

### Markdown normalization

- `utilityRenderMarkdownBlock`: `normalizeMarkdownTableText`, compact pipe expansion
- `renderPlainStructuredText`: block split, worksheet mode, `renderTableHintHeadingSections` for multi-heading table strings
- `normalizeCompactMaterialText` / `expandSingleLineMarkdownTable` for material strings

### Table rendering fixes (Sprint 33)

- Paths fixed: template string, `materials.scenario`, `renderActivityResourcesSection`, assessment prompt block, `template.sections[]`
- Regression: `utility-markdown-bullet.test.js` (17 tests including A2 multi-table)

### Assessment rendering

- `utilityRenderMarkdownBlock` on prompt text → `<ol>` for numbered follow-ups
- Classes: `.util-assessment-prompt`, `.util-assessment-choices` (Sprint 31)

### Activity framing visual language

- `.util-activity-framing`, `.util-activity-task--primary`, material icon headings (Sprint 31)
- Verify kitchen-sink CSS still matches embedded stylesheet

### Typography / layout opportunities

- See §7; print `@media` rules present — validate long tables and multi-card grids

---

## PEDAGOGY (reference)

- **Cognition:** `COGNITION_ACTIVITY_FIELD_IDS` propagated; rendered on activity row, not duplicated in materials remainder
- **PEL / reasoning:** evaluators in workflow tests (`workflow-pel-reasoning.test.js`, framing adoption tests)
- **Instructional clarity:** separate rendered blocks for task, materials, expected output, support note
- **Operationalisation:** `renderMaterialsForActivity` ordered handlers (task cards → scenarios → prompts → templates → tables → remainder)
- **Workbook repetition:** deterministic dedupe (`createActivityComparableRegistry`) — exact text match only; does not collapse similar tables across activities

---

## VISUAL DESIGN (reference)

### What improved (Sprint 31 + 33)

- Calmer section headings with icons; activity cards with badges
- Material stacks with type-specific borders/icons
- Formative assessment readability
- Tables wrapped in export-friendly markup

### Remaining small bumps

- Framing cue margin rules (kitchen-sink drift)
- Multi-table template vertical spacing between H5 subheads
- Empty worksheet cells — visual weight vs data cells

---

## RECOMMENDED NEXT SPRINT FOCUS (Sprint 34 charter seed)

**Title:** Instructional clarity & renderer refinement  
**In scope:** R-layer CSS/copy, markdown path consolidation, fixture hardening, test floor 0 fail  
**Out of scope:** MathJax dollar support, CAS/graphing, Sprint 32 diagram pipeline, schema/PEC changes, new workflow steps

### Suggested slices

| Slice | Deliverable |
|-------|-------------|
| **34-1** | Fix kitchen-sink / CSS test floor; document embedded CSS version map |
| **34-2** | Instructional clarity audit on 2–3 golden page fixtures (task/material/output) |
| **34-3** | Renderer consolidation: shared `renderMaterialMarkdownBlock` helper |
| **34-4** | Golden composed page fixtures (RNA/statistics + math + multi-table) in CI |
| **34-5** | Typography/spacing pass on materials + tables (print-safe) |

### Suggested opening prompt (next chat)

> Context: Sprint 33 complete (MathJax, workflow gating, table/markdown fixes). Test floor 583/2 fail on kitchen-sink CSS. Task: Sprint 34-1 — restore 0-fail suite and align kitchen-sink assertions with current `getUtilityPagePresentationCss()`. Scope: `tests/utility-renderer-kitchen-sink.test.js`, embedded CSS in `app.js` only if intentional drift. Non-goals: new features, workflow JSON, dollar delimiters. Success: `node --test tests/*.test.js` → 0 fail.

---

## Linked artefacts

| Pack / file | Use |
|-------------|-----|
| `docs/development/sprints/2026-06-02-sprint-33-mathjax-support/` | MathJax architecture, risks, test plan |
| `docs/development/sprints/2026-06-01-sprint-31-page-rhetoric-renderer-experience/` | R-layer class map, closed boundaries |
| `docs/development/sprints/2026-06-02-sprint-32-pedagogic-diagram-enhancement/` | **Not started** — do not conflate with Sprint 34 |
| `docs/development/chat-bootstrap-template.md` | Next-chat bootstrap pattern |

---

*This document reflects implemented behaviour in `app.js` and passing targeted regression tests as of 2026-06-03. Update test counts after kitchen-sink repair.*
