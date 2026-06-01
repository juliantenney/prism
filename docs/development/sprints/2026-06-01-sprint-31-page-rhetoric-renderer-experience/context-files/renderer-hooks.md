# Renderer hooks (Sprint 31 planning)

**Authority:** `app.js` — refresh line references when implementing.

---

## Page shell

| Function | Role |
|----------|------|
| `buildUtilityStructuredHtml` | Main page HTML; splits `primaryBlocks` vs `metadataBlocks`; emits `<details class="util-meta">` |
| `buildUtilityStructuredHtmlForTest` | Test API entry (`__PRISM_TEST_API`) |
| `sanitizeUtilityHtmlOutput` | Post-process HTML (lists, checkboxes) |

**Metadata keys (page artefacts):** `source_artefacts`, `constraints_applied`, `generation_notes` — routed to `metadataBlocks` for `artifact_type: page` (see ~30168–30379).

---

## Sections and activities

| Function | Role |
|----------|------|
| `utilityRenderPageSections` | Section dispatch; `suppressInternalMetadata`; composition closure |
| `utilityIsPageMetadataSectionEntry` | Detects learner-facing `metadata` sections in `sections[]` |
| `utilityRenderPageMetadataSectionHtml` | Renders section-level metadata into meta fold |
| `renderLearningActivitiesBlocks` | Activity cards |
| `renderActivityFramingForActivity` | PEL preamble, orientation, reasoning cues |
| `renderCognitionFieldsForActivity` | Sprint 28 cognition blocks |

---

## Materials and assessment

| Function | Role |
|----------|------|
| `utilityRenderObject` | Cards, nested objects |
| `utilityRenderArray` | Lists, materials arrays |
| `utilityRenderSupportNoteParagraph` | Support / facilitator note display |
| Assessment render paths inside `utilityRenderPageSections` | MCQ, formative checks |

---

## Presentation CSS

Embedded in `buildUtilityStructuredHtml` style blocks (~29284–29322, print rules ~29337):

- `details.util-meta` — collapsed production metadata footer
- `.util-meta-section` — subsections inside fold
- `.util-pel-orientation-cue`, `.util-pel-reasoning-cue` — PEL cues (31-2 target)
- `.util-activity-preamble` — activity framing block

Sprint 31 CSS changes must ship with **test assertions** — no untested visual-only edits.

---

## Sprint 31 slice touch map (planned)

| Slice | Primary hooks |
|-------|----------------|
| **31-1** | `buildUtilityStructuredHtml`, `utilityIsPageMetadataSectionEntry`, `utilityRenderPageMetadataSectionHtml`, meta fold summary |
| **31-2** | `renderActivityFramingForActivity` (`.util-activity-framing`), `.util-activity-task--primary`, `getUtilityPagePresentationCssV31_2`, PEL/cognition CSS |
| **31-3** | `renderKnowledgeSummaryBlocks`, `utilityRenderDefinitionStyleBlock`, `looksKnowledgeSummarySection`, `getUtilityPagePresentationCssV31_3` |
| **31-4** | `renderMaterialsForActivity` (`.util-materials-stack`), `utilityWrapExportTableHtml` (`.util-material-table`), `.util-material-template` / `.util-material-prompt` / `.util-worked-example`, `getUtilityPagePresentationCssV31_4` |
| **31-5** | `createActivityComparableRegistry`, `renderActivityFramingForActivity(row, registry)`, cross-block suppression in `renderLearningActivitiesBlocks`, `getUtilityPagePresentationCssV31_5` |
| **31-6** | `renderQuestionBlocks`, `renderAssessmentItemArticle`, `renderMcqOptionsList`, `.util-assessment-prompt` / `.util-assessment-choices`, `getUtilityPagePresentationCssV31_6` |
