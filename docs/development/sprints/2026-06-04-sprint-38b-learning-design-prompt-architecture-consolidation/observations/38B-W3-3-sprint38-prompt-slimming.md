# PR-W3-3 — Sprint 38 visual affordance prompt slimming

**Date:** 2026-06-04  
**Scope:** `app.js` — `buildSprint38VisualAffordanceDesignPagePromptBlock`, `buildSprint38PedagogicalAddedValuePromptLines` only  
**Out of scope:** `lib/sprint38-visual-affordances.js` validation, renderer, VEU, pack §13, compose contract

---

## 1. Inventory (pre-slim)

| Component | Est. chars | Role |
|-----------|----------:|------|
| Visual authoring contract lines | ~2,400 | Required schema/enum/defer/reject rules |
| Example generate (full inflation A3) | ~1,850 | Shape + types pedagogy |
| Example reject + defer | ~700 | Non-generate shape |
| Pedagogical added-value core | ~900 | pedagogical_added_value QA |
| Per-token catalog dump (8 tokens) | ~1,200 | Duplicative of `REPRESENTATION_PEDAGOGICAL_VALUE` lib |
| **Total Sprint 38 append (approx.)** | **~7,050** | Two `(auto-applied)` markers |

**Duplication removed:**

| Text | Already in |
|------|------------|
| Additive page-root / materials not replaced | Pack §13 + `LD-DESIGN-PAGE-COMPOSE-CONTRACT` |
| Figure-only duplicate worksheet/table | `LD-DESIGN-PAGE-COMPOSE-CONTRACT` + pedagogical block (one line) |
| Full 8-token catalog lines | `lib/sprint38-representation-pedagogical-value.js` (runtime catalog unchanged) |

---

## 2. Proposed changes (summary)

### `buildSprint38PedagogicalAddedValuePromptLines`

- **Remove** `Object.keys(catalog).forEach` full token dump.
- **Keep** marker, `pedagogical_added_value`, duplicate-worksheet/figure-only scope, `Per-token must_add / must_not_duplicate`, `REPRESENTATION_PEDAGOGICAL_VALUE`, `explain what cognitive support`, one **classification_matrix** exemplar line.
- **Keep** optional `GENERIC_QA_RULE` line when lib loaded.

### `buildSprint38VisualAffordanceDesignPagePromptBlock`

- **Keep** all test-anchored contract lines (booleans, tier, representation_avoid tokens, generate row field list, hooks, page root 38.4).
- **Shorten** workshop hint to one line.
- **Replace** three verbose pretty-printed JSON examples with:
  - One compact **generate** example (still includes `va-A3-classification-01`, `pedagogical_added_value` with discriminating cues, `anti_spoiler`, `visual_slot`, full 38.4 generate field set),
  - Compact **reject** + **defer** examples (separate headers preserved for tests).

**Not changed:** `applySprint38VisualAffordanceContractToDraft`, validation, compose pipeline.

---

## 3. Test anchors preserved

| Test | Anchor |
|------|--------|
| `sprint-38-visual-affordances` augmented | Both Sprint 38 markers; Example generate/reject/defer; va-A3; rejection_reason; defer_reason; contract lines |
| `buildSprint38VisualAffordanceDesignPagePromptBlock` | generate/reject/defer visual_decision; anti_spoiler; visual_slot |
| `sprint-38-pedagogical-added-value` app.js source | Per-token; REPRESENTATION_PEDAGOGICAL_VALUE; Adds discriminating cause-type cues; explain what cognitive support |
| `design-page-materials-fidelity` block | additive page-root metadata only; must not replace materials |

---

## 4. Metrics (probe `scripts/probe-38b1-ld-workflow-prompt-audit.js`)

| Metric | W3-2 | W3-3 | Δ |
|--------|------:|-----:|--:|
| `seededChars` | 7,745 | 7,745 | 0 |
| `augmentedChars` (self-directed DP) | 25,331 | **24,771** | **−560** |
| `blockCount` | 5 | **5** | 0 |
| Facilitated `augmentedChars` | 21,115 | **20,555** | −560 |
| Four-step sum | 72,520 | **71,960** | **−560** |

**Sprint 38 block size (approx., `buildSprint38VisualAffordanceDesignPagePromptBlock` including embedded pedagogical lines):** ~7,050 → **~5,900** (−~1,150 in block; net augmented −560 after spacing-normalised examples).

**Wave 3 target (22k–23.5k):** Not reached — remaining mass is L4 preserve embed (~4k), `LD-SELF-DIRECTED-RHETORIC` (~3.6k), and slimmed Sprint 38 contract lines (~3.5k). Further reduction is out of scope for W3-3 (no L4/rhetoric edits).

---

## 5. Regression gates

| Gate | Result |
|------|--------|
| `node --test tests/*.test.js` | **730 pass** |
| `sprint-38-visual-affordances.test.js` | Pass (all example/contract anchors) |
| `sprint-38-pedagogical-added-value.test.js` | Pass (app.js source anchors) |
| Validation / renderer / VEU | Unchanged |

---

## 6. Sign-off

| Item | Status |
|------|--------|
| PR-W3-3 slimming | **COMPLETE** |
| Schema / renderer / VEU | No change |
| B4 | Monitoring unchanged |
| Augmented toward 22k band | **Partial** (−560; band needs separate L4/rhetoric work if pursued) |
