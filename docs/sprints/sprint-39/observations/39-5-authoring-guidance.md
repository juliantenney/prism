# Slice 39-5 — Authoring guidance

**Date:** _pending_  
**Status:** **PENDING**  
**Authority:** [39-3-cue-authoring-design.md](39-3-cue-authoring-design.md), [39-4-representation-cue-alignment.md](39-4-representation-cue-alignment.md)

---

## Success criterion

Design Page authors can answer a **fixed cue checklist** when writing `generate` affordances — planning text only (no `app.js` changes in Sprint 39 discovery phase).

---

## Author questions (core)

For each `visual_decision: generate` affordance, the author must answer:

| # | Question |
|---|----------|
| 1 | **What should learners notice?** (perceptible features, not topic title) |
| 2 | **What should learners compare?** (dimensions, confusable pairs) |
| 3 | **What should learners classify / trace / interpret?** (operation on materials) |
| 4 | **What should learners infer?** (allowed inference — ties to `allowed_claims`) |
| 5 | **What must remain unresolved?** (ties to `must_not_show`, spoiler_boundary) |
| 6 | **What would spoil the task?** (duplicate table, filled cells, verdict) |

Answers should map to **`must_show`** lines (Option A) or future `reasoning_cues` (Option B) per 39-3.

---

## Field mapping (draft — pending 39-3)

| Author answer | Target field |
|---------------|--------------|
| What learners notice | `must_show[]` (perceptual phrasing) |
| What must stay hidden | `must_not_show[]` |
| Incremental support vs materials | `pedagogical_added_value` |
| Verbal claims permitted | `allowed_claims[]` |
| Verbal claims forbidden | `disallowed_claims[]` |
| Layout family | `preferred_representation` (unchanged) |

---

## Anti-patterns for authors

| Anti-pattern | Example | Fix |
|--------------|---------|-----|
| Topic labels in `must_show` | “inflation”, “climate change” | Replace with **discriminating features** |
| Category names without cues | “demand-pull inflation” alone | Add **what visible signal** indicates each type |
| Prose-only `pedagogical_added_value` | Explains intent but not perceptual targets | Duplicate cues into `must_show` |
| Layout instruction | “use a 3×3 grid” | Use `preferred_representation`; cues in `must_show` |

---

## Inflation A3 exemplar (target authoring — planning)

**Before (weak cue specificity):**

```yaml
must_show:
  - demand-pull inflation
  - cost-push inflation
```

**After (illustrative — validate in 39-1):**

```yaml
must_show:
  - empty cause-type column headers only (no scenario keys)
  - perceptible demand-shock vs cost-push symptom icons tied to scenario rows
  - decision cue: "which driver best explains the price rise in scenario 2?"
```

---

## Design Page integration (future — not Sprint 39 discovery)

- [ ] Prompt block draft (reference `buildSprint38VisualAffordanceDesignPagePromptBlock` pattern)  
- [ ] JSON example row in pack fixtures  
- [ ] Runner `what_to_check` bullets  

**No implementation until 39-3 decision and programme approval.**

---

## Deliverables

- [ ] Final author checklist  
- [ ] Before/after examples for A3 and one non-inflation anchor  
- [ ] Mapping to 39-4 `must_make_visible` per token
