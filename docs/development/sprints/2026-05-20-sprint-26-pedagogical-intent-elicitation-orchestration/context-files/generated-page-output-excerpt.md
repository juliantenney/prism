# Generated page — downstream symptom excerpt

**Authoritative renderer:** `app.js` — `buildUtilityStructuredHtml`, `utilityRenderPageSections`  
**Why it matters:** Proves **composition/renderer are not the root cause** when upstream artefacts are missing.

---

## Symptom (paraphrase)

Design Page output or `generation_notes` indicated that **no learning activities** were supplied from upstream steps — the page could not embed activity blocks that were never generated.

Sprint 25 established: **`learning_activities` artefact defines membership** for `page.sections[].learning_activities`. If the workflow skips **Design Learning Activities**, Design Page has nothing to compose except outcomes, knowledge summary, and assessment sections.

---

## What this is NOT

- Not a renderer bug (Sprint 26 renderer pack — separate track)
- Not an activity-closure validator false positive if activities truly absent upstream
- Not fixed by Design Page prompt edits alone without topology fix

---

## What a correct run should show

After topology fix, page should include:

- `page.sections[]` entry with `section_id` / heading for learning activities
- `learning_activities.content[]` with activity rows (`activity_id`, `learner_task`, materials keys)
- Materials embedded or referenced from `activity_materials` step output

**Regression anchor:** `tests/utility-ld-inflation-page-render.test.js` (full workshop) — different shape but same composition rules.

---

## 26-1 action

Paste **exact** `generation_notes` / omission trace from RNA page JSON if captured, or note field names from `validatePageActivityClosure` messages.
