# Sprint 55 — Content Preservation & Activity Framing Audit

**Scope:** Design Page assembly and content-preservation (not typography).  
**Pipeline:** DLA → Design Page → GAM → page artefact → renderer.

---

## Executive summary

Instructional content is generated correctly upstream but can be **lost or thinned** at three layers:

| Layer | Mechanism | Severity |
|-------|-----------|----------|
| **Design Page LLM compose** | Paraphrase/truncate row fields despite contracts | High |
| **Post-compose repair** | Was fill-empty-only; `learner_task` omitted from merge list | High (fixed) |
| **Renderer** | Grammar path skipped Check/Reflect when `episode_plan.beats` present; `self_explanation_prompt` gated on pre-check co-requisites | Medium (fixed) |
| **GAM L4 merge** | `deriveClosureScaffoldMarkers` used `text` before assignment | Medium (fixed) |

**Principle:** Design Page may **arrange** content; it must not **silently rewrite** instructional bodies or row fields.

---

## Part 1 — DLA content preservation

### Pipeline (row fields)

```
DLA (learning_activities.json)
  → applyLdDesignPageComposeContractToDraft (prompt: LD-DESIGN-PAGE-COMPOSE)
  → LLM page.json
  → repairLearnerPageCompositionFromUpstream
  → mergeLearnerPageActivityFramingFieldsIntoPageActivities
  → validatePageActivityFieldClosure (new)
  → renderer (instructional grammar / legacy)
```

### Field map

| Field | DLA contract | Compose preservation | Runtime repair | Renderer |
|-------|--------------|----------------------|----------------|----------|
| `activity_preamble` | `ld-activity-preamble-exposition.js`, OUTPUT CONTRACT | `FIELD_PRESERVATION_FIELD_IDS` | Merge + compression repair | Orient — "Why this activity" |
| `learner_task` | Core schema | **Now explicit in compose contract** | **Now in merge list + compression repair** | Do — "What to do" |
| `expected_output` | Core schema | preservation list | Merge + compression repair | Check / `util-output-block` |
| `reasoning_orientation` | Cognition OUTPUT CONTRACT | preservation list | Merge + compression repair | Think |
| `self_explanation_prompt` | Cognition OUTPUT CONTRACT | preservation list | Merge + compression repair | **Reflect pre-check (always when present)** |
| `conceptual_contrast_prompt` | Cognition OUTPUT CONTRACT | preservation list | Merge + compression repair | Think |
| `argument_structure_hint` | Cognition OUTPUT CONTRACT | preservation list | Merge + compression repair | Think |
| `support_note` | DLA optional | preservation list | Merge; may strip if facilitator choreography detected | Support |

### Loss points (remaining watch)

- **LLM non-compliance** when compose writes wrong but non-empty text — mitigated by upstream-wins compression repair (`shouldPreferUpstreamFieldContent`, ratio > 1.1×).
- **`support_note` sanitization** — `pelSanitizeLearnerPageActivityRow` may delete facilitator-like notes.
- **Workshop pages** — `utilityShouldSuppressLearnerWorkshopSupportNote` hides support on some exports.
- **Dedup** — `collectOrientTexts` / `collectThinkTexts` may suppress near-duplicate prose.

### Fixes applied (Part 1)

1. `learner_task` added to `FIELD_PRESERVATION_FIELD_IDS` and `LEARNER_PAGE_ACTIVITY_FRAMING_PRESERVATION_FIELD_IDS`.
2. `mergeLearnerPageActivityFramingFieldsIntoPageActivities` replaces compressed upstream fields, not only empty fields.
3. New `lib/page-activity-field-preserve.js` + `validatePageActivityFieldClosure` wired into capture validation.

---

## Part 2 — GAM content preservation

### Pipeline (material bodies)

```
GAM (activity_materials)
  → Design Page compose (verbatim copy contract + LD-MATERIALS-COPY)
  → applyComposedPageGamMaterialsPreserve
  → lib/page-gam-materials-preserve.js (shouldMergeGamBody, closure)
  → beat-first renderMaterialsForActivity
```

### Preservation stack

- **Prompt:** no synopsis, catalogue substitution, or token-limit thinning (`ld-design-page-compose-contract.js`, `ld-materials-copy.js`).
- **L4 merge:** placeholder/synopsis/compression detection; GAM wins when page body is thinner.
- **Closure:** `validatePageMaterialsClosure` — 99% length ratio + scaffold markers.

### Loss points (remaining watch)

- Compose body ≥99% of GAM with passing markers may retain subtle compression.
- Duplicate GAM `pageKey` — second material dropped silently.
- `mergeMaterialsObjects` skips some alias keys (`checklist`, `worked_example`).
- Role supersession hides alias keys at render (`page-role-render-sequencing.js`).

### Fix applied (Part 2)

- **`deriveClosureScaffoldMarkers`** — `text` now assigned before marker contract loop (was breaking scaffold-based merge triggers).

---

## Part 3 — Activity preamble quality

### Problem

Preambles often read as **topic labels** (one short definitional sentence) rather than **orientation prose**.

### Contract updates

- `lib/ld-activity-preamble-exposition.js` — target **50–120 words**, textbook/workbook paragraph style; name key distinction/mechanism and reasoning required.
- `app.js` DLA OUTPUT CONTRACT — aligned to 50–120 word preamble guidance.

### Validation

- `validatePageActivityFieldClosure` flags preambles ≤18 words without multi-sentence structure as topic-label-like (`preambleLooksLikeTopicLabel`).

### Generation vs preservation

- **DLA generates** preambles (authorial contract).
- **Design Page preserves** verbatim — does not regenerate.

---

## Renderer notes (beat-first coexistence)

When `episode_plan.beats` is present:

- Beat-ordered materials render via `renderMaterialsForActivity` (explanation, worked thinking, verification, etc.).
- **Fixed:** `expected_output` / Check section no longer suppressed solely because beats exist.
- **Fixed:** `self_explanation_prompt` renders whenever present, not only when checklist/sample_output co-exist.
- Row-level `expected_output` also appears in legacy `util-output-block` on beat-first Marx A1 exports.

---

## Test anchors

```bash
node --test tests/sprint-55-content-preservation.test.js
node --test tests/workflow-learner-page-design-page-preservation.test.js
node --test tests/page-materials-closure.test.js
```

---

## Acceptance criteria status

| Criterion | Status |
|-----------|--------|
| All eight DLA learner fields rendered or beat-mapped | **Improved** — renderer gaps fixed; field closure validates |
| No silent loss of instructional content on compose | **Improved** — compression repair + closure warnings |
| GAM materials full (A1/A2 text, A6 capstone set) | **Existing L4 merge** + scaffold marker bug fixed |
| Activity preambles as orientation prose | **Contract strengthened**; closure flags thin labels |

---

## Recommended follow-up (out of scope)

1. Upstream-wins repair for GAM-like **hash/near-match** detection on row fields (not only length).
2. Surface dropped duplicate GAM `pageKey` in `generation_notes`.
3. RNA/A6 fixture regression with full material marker checklist in CI.
4. Re-run live workshop pages (Inflation 38F, RNA) against upstream captures after compose.
