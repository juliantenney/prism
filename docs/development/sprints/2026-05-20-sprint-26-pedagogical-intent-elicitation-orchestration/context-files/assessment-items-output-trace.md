# Assessment items output trace

**Status:** **CLOSED** (Track B) — 2026-05-20  
**Related case:** RNA virus / HCV self-study (same run as topology track)  
**Authoritative:** workflow run artefacts, Design Page step output, `page` JSON, renderer tests

---

## Closure summary

| Item | Conclusion |
|------|------------|
| **Issue** | Valid `assessment_check` + `content.items[]` in page JSON did not appear correctly in export HTML |
| **Not** | Orchestration failure, Design Page composition failure (for reported JSON shape) |
| **Was** | **Renderer/export** — section detection + binding to current section object |
| **Fix** | R26-PI-007, R26-PI-008 in `app.js` |
| **Tests** | `tests/utility-ld-rna-assessment-page-render.test.js` — **252** suite pass |

**Track A** (missing learning activities) remains open — separate failure locus.

---

## Symptom timeline (resolved)

| Stage | User-visible symptom |
|-------|----------------------|
| 1 | No assessment section in export |
| 2 | Assessment wrapper appeared but **placeholder** + wrong heading (**Study and Revision Guidance**) |
| 3 | **Formative Assessment Check**, all MCQs, `support_notes` separate — **fixed** |

---

## Root cause (final)

1. **R26-PI-007:** Array renderer did not reliably route `section_id: assessment_check` to `renderQuestionBlocks`.
2. **R26-PI-008:** Pack `sectionOrder` indexed by **array position**; when `sections[]` omitted slots (e.g. no `learning_activities`), `orderedKeys[idx]` could be `assessment_check` while `section_id` was `support_notes` → false-positive assessment branch with adjacent heading and non-item content → placeholder.

**Fix:** Trust **`section_id` + `heading` + `content.items[]`** on the **current** section entry; deny `support_notes` for assessment path; `collectAssessmentQuestionRows`.

---

## Investigation checkpoints (final)

| # | Question | Result |
|---|----------|--------|
| 1–4 | Generation / persistence / Design Page input | **Pass** (reported; not composition gap for this case) |
| 5–6 | `assessment_check` in `sections[]` with items | **Pass** (reported) |
| 7 | `omitIfMissing` | N/A for reported case |
| 8 | Renderer receives `sections[]` | **Pass** |
| 9 | HTML shows formative heading + MCQs | **Pass** (tests) |
| 10 | Inflation regression | **Pass** |

**Primary failure locus (historical):** **A-RENDER** only.

---

## Expected artefact chain (unchanged reference)

```
Generate Assessment Items → assessment_items artefact
Design Page → page.sections[] assessment_check + content.items[]
buildUtilityStructuredHtml → utilityRenderPageSections
  → isAssessmentCheckSection / renderAssessmentCheckSectionBlock
  → renderQuestionBlocks → util-assessment-section HTML
```

---

## Verification

```bash
node --test tests/*.test.js
```

**252 passed**, 0 failed.

| Asset | Path |
|-------|------|
| Fixture | `tests/fixtures/page-render/ld-rna-hcv-assessment-page.json` |
| Tests | `tests/utility-ld-rna-assessment-page-render.test.js` |
| Code | `app.js` |

---

## Known limitations

- Non-canonical `section_id` (e.g. `quiz`) may rely on heading heuristics only.
- `source_artefacts.assessment_items` without `sections[]` body — still a **composition** issue, not renderer.
- Live RNA browser re-export not stored in pack; tests are regression authority.

---

## 26-1 remainder

Optional: confirm checkpoints **1–4** on a fresh RNA workflow run for audit trail. **Not required** to continue Track A topology work.
