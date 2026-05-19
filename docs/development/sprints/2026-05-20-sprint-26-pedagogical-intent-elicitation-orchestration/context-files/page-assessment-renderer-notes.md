# Page assessment — renderer notes

**Status:** **CLOSED** (Track B) — 2026-05-20  
**Authoritative:** `app.js` — `buildUtilityStructuredHtml`, `utilityRenderPageSections`, `renderAssessmentCheckSectionBlock`

---

## Closure

When `page.sections[]` contains a valid **`assessment_check`** entry with **`content.items[]`** (stems + options), export HTML now includes:

- Heading from **that section’s** `heading` (e.g. Formative Assessment Check)
- All MCQ items (`util-assessment-item`, `util-assessment-options`)
- **No** “Self-check questions will appear here” placeholder
- **`support_notes`** (e.g. Study and Revision Guidance) as a **separate** section
- **No** invented answer key

**Not in scope of this fix:** workflow topology, Design Page prompts, activity/material steps (Track A).

---

## Renderer path

```
buildUtilityStructuredHtml(parsed page)
  → utilityRenderPageSections(sections[], labels, sectionOrder, opts)
  → per entry: isAssessmentCheckSection(section_id, heading, orderedKey)
  → renderAssessmentCheckSectionBlock(content, heading, …)
  → collectAssessmentQuestionRows → renderQuestionBlocks
  → utilityWrapAssessmentSectionHtml
```

**Frozen (Sprint 25):** renderer does not invent assessment items.

---

## Root causes fixed (R26-PI-007 / R26-PI-008)

| # | Cause | Fix |
|---|--------|-----|
| 1 | Heading-only detection; ignored `section_id: assessment_check` | `isAssessmentCheckSection` uses `resolveSectionKind` |
| 2 | `sectionOrder[idx]` mis-bound when catalogue longer than `sections[]` | `orderedKey = section_id` first; deny `support_notes` for assessment branch |
| 3 | Wrong heading/content on false-positive branch | `resolvePageSectionHeadingFromEntry`, bind content from current entry |

---

## Regression coverage

```bash
node --test tests/utility-ld-rna-assessment-page-render.test.js
node --test tests/utility-ld-inflation-page-render.test.js
node --test tests/*.test.js
```

| Check | Fixture / test |
|-------|----------------|
| RNA shape, 10 MCQs, object `options` | `ld-rna-hcv-assessment-page.json` |
| Catalogue `sectionOrder` + adjacent `support_notes` | Same test file |
| No placeholder / no heading bleed | Asserted |
| Inflation `assessment_check` | `utility-ld-inflation-page-render.test.js` |

**Suite:** **252 passed**, 0 failed.

---

## Failure attribution (for future issues)

| Observation | Likely track |
|-------------|--------------|
| No `assessment_check` in page JSON | **Composition** (Design Page) |
| Section present, empty `items` | **Generation** or composition |
| Section present, items OK, no HTML | **Renderer** (re-open only on regression) |
| HTML OK, hidden in UI only | Preview CSS / browser |

---

## Known limitations

- Canonical `section_id` `assessment_check` is the reliable path; exotic ids need case-by-case checks.
- Renderer does not read `source_artefacts` flags as body content.

Cross-reference: [`assessment-items-output-trace.md`](assessment-items-output-trace.md) (closed).
