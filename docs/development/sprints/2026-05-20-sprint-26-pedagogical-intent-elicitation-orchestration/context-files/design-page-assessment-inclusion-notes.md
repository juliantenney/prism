# Design Page — assessment inclusion notes

**Authoritative:** Design Page step prompt + pack (`domain-learning-design-step-patterns.md`, `domain-learning-design-artefacts.md`)  
**Why it matters:** Composition decides whether `assessment_items` become a **learner-visible section** or only a **metadata citation**.

---

## Expected behaviour (product)

If **Generate Assessment Items** succeeded and the brief requested a **formative assessment**, the learner-facing page should normally include a visible **assessment_check** (or equivalent) section — unless:

- brief explicitly excludes assessment on page, or
- `omitIfMissing` drops an empty section, or
- `page_profile` rules justify a different surface (investigate — learner profile still allows formative check per pack)

---

## Pack composition rules (excerpt — verify live)

From `domain-learning-design-artefacts.md` §18 (page artefact):

| Rule | Implication |
|------|-------------|
| Canonical `section_id` includes **`assessment_check`** | Design Page should emit section object, not only top-level key |
| `page_profile: learner` | Minimum: summary + **learner tasks**; assessment not automatically excluded in prose rules |
| `page_profile: assessment` | Must preserve structured items; do not flatten to narrative |
| `source_artefacts` optional | Provenance only — **does not replace** `sections[]` body |

Design Page prompt (`step_design_page`) lists upstream inputs including **`assessment_items`** and instructs read-only assembly into `sections[]` array.

---

## omitIfMissing (Sprint 25 export contract)

Pack `renderHints`:

```json
"omitIfMissing": ["assessment_check", "support_notes", ...]
```

| Scenario | Result |
|----------|--------|
| Design Page omits `assessment_check` entirely | Renderer never sees section — may still list `assessment_items` in `source_artefacts` |
| Design Page emits empty `assessment_check` | Section may be skipped as missing |
| Design Page emits `content: "assessment_check"` string placeholder | Renderer may render useless paragraph (sanitizer strips some leaks) |

**26-1:** Inspect actual `page.sections[]` for RNA output — do not infer from `source_artefacts` alone.

---

## page_profile = learner (investigation focus)

| Hypothesis | Check |
|------------|-------|
| H-AP1 | Model interprets learner page as “no quiz on page” despite formative brief | Design Page JSON + generation_notes |
| H-AP2 | `page_profile` set to `learner` while items live only in metadata | `page.page_profile` vs sections |
| H-AP3 | Assessment items placed under wrong `section_id` | Grep all section_ids in page JSON |
| H-AP4 | Items nested inside `learning_activities` by mistake | Activity content vs top-level assessment_check |

Pack explicit rule (artefacts doc): learner profile requires substantive content + learner tasks — **does not say omit assessment**.

---

## Distinction: metadata vs body

| Field | Role |
|-------|------|
| `source_artefacts.assessment_items: true` | **Provenance** — upstream step ran |
| `sections[]` + `section_id: assessment_check` | **Export authority** for learner-visible body (Sprint 25) |

**Failure pattern:** metadata says assessment_items used, but **`sections[]` lacks assessment_check** → composition integrity bug (Track B), not renderer.

---

## Comparison: inflation workshop (known-good)

`tests/fixtures/page-render/ld-inflation-workshop-page-full.json`:

```json
{
  "section_id": "assessment_check",
  "heading": "Formative assessment check",
  "content": { "items": [ { "item_id": "q1", "stem": "...", "options": [...], "item_type": "mcq" } ] }
}
```

RNA case 26-1 action: diff RNA `page` JSON against this shape (field names, nesting, item count).

---

## Evidence placeholders

| Artefact | Status |
|----------|--------|
| Design Page raw JSON output | _pending capture_ |
| `generation_notes` / omissions | _pending_ |
| `page_profile` value | _pending_ |
| Index of `section_id` values | _pending_ |
| `assessment_check` item count | _pending_ |

See also [`page-assessment-renderer-notes.md`](page-assessment-renderer-notes.md).
