# Sprint 62 — Implementation Guidance

## Scope guard

Sprint 62 changes renderer presentation only. Keep all educational and architectural layers stable.

**Hard boundary:** Sprint 62 may reorganise, relabel, and deduplicate existing meaning, but does not invent new instructional meaning.

### Allowed

- presentation-layer section ordering adjustments that preserve deterministic order
- wrapper label suppression/rewording
- metadata hiding in learner-facing render
- instruction/material layout adjustments for coherence
- deduplication of repeated learner-facing labels
- mapping structural beat functions to learner-facing phase labels
- promoting existing checklist / `expected_output` wording into Frame (“Success looks like”)
- suppressing deterministic Output duplicates

### Not allowed

- DLA planning changes
- GAM prompt/rule changes
- instructional-archetype logic changes
- assessment generation logic changes
- persistence or assembly changes
- schema changes
- inventing goals, success criteria, rationale, or closure copy
- generating contextual headings from body text
- rewriting instructional meaning
- changing material resolution, ordering, beat assignment, or diagnostics behaviour

## Learner journey presentation direction

Frame → Understand → [Model] → Apply → Verify → Complete (optional Transfer)

This is a **presentation direction**, not a new schema. See [learner-journey-presentation-slice.md](learner-journey-presentation-slice.md).

## Working method

1. Use the frozen baseline set in [acceptance-evidence-pages.md](acceptance-evidence-pages.md) (S62-D04).
2. Capture before snapshots for all four baseline pages.
3. Apply smallest renderer-only coherence change.
4. Compare after snapshots for:
   - flow improvement
   - no content loss
   - no sequence drift
5. Run tests/regressions (see acceptance doc for test anchors), including `tests/utility-renderer-learner-journey-presentation.test.js` for the A2/A6 presentation slice.
6. Record evidence against [renderer-coherence-checklist.md](renderer-coherence-checklist.md).
