# Page Synthesis vs Sections Investigation

**Sprint:** 56F  
**Status:** Complete  
**Date:** 2026-07-07  
**Question:** Are overview, learning_purpose, knowledge_summary, study_tips, support_notes genuinely page-level artefacts or historical section implementations?

---

## Verdict

**They are page-level synthesis artefacts**, stored in `sections[]` because the renderer was built as `document_sections` and Design Page was a monolithic assembler — not because synthesis is logically a section type.

**Recommendation:** Model as first-class `page_synthesis` in vNext. Keep `sections[]` only as a **deprecated read adapter** during migration.

---

## Per-concept conclusions

| Concept | Page-scoped? | Full page context? | Dedicated page field? | vNext location |
|---------|--------------|-------------------|----------------------|----------------|
| overview | Yes | Yes | Yes | page_synthesis.overview |
| learning_purpose | Yes | Yes | Yes | page_synthesis.learning_purpose |
| knowledge_summary | Yes | Partial | Yes (KM projection) | page_synthesis.knowledge_summary |
| study_tips | Yes | Yes | Yes | page_synthesis.study_tips |
| support_notes | Yes | Weak | Yes | page_synthesis.support_notes |
| page-level reflection | Via study_tips only | For closure | **No** | self_explanation_prompt + materials + study_tips |
| page-level transfer | Via study_tips bullet | For bullet only | **No** | transfer_or_application_task + materials.transfer_prompt |
| page-level consolidation | Via study_tips + final activity | For recap | **No** | materials.consolidation_summary |

---

## Why sections[] conflates two concerns

| Kind in sections[] today | True nature |
|--------------------------|-------------|
| overview, learning_purpose, knowledge_summary, study_tips, support_notes | Page synthesis (Category D) |
| learning_activities, assessment_check, learning_sequence | Structural containers |

Sprint 50 classifies wrapper fields as **Companion Guidance** at page level. Progressive enrichment needs DLA/GAM to write `activities[]` without sharing an array with synthesis prose.

---

## Renderer evidence

- `PAGE_BODY_SECTION_IDS` and `COGNITION_PAGE_CANONICAL_SECTION_ORDER` interleave synthesis and containers.
- `utilityFindPageSectionContent` already falls back to top-level `parsed.overview` — sections were transport convenience.
- `buildJourneyCompassFromPage` derives `governing_inquiry` from overview — not a section concept.
- `getPageSectionsForRender` can synthesize sections from top-level keys.

**Adapter strategy:** Resolve `page_synthesis.*` first; inject synthetic sections for render order unchanged.

---

## Recommended model

```text
page
├── page_synthesis          ← finalise_page owns
├── activities[]            ← DLA + GAM
├── learning_sequence       ← Learning Sequence
├── assessment_check        ← Assessment
└── (no wrapper entries in sections[] for new writes)
```

Do **not** add page_synthesis.reflection | .transfer | .consolidation — decomposed per repo evidence.

---

## Related

- [design-page-schema-vnext-freeze-proposal.md](design-page-schema-vnext-freeze-proposal.md)
- [repository-ownership-schema-audit.md](repository-ownership-schema-audit.md)
