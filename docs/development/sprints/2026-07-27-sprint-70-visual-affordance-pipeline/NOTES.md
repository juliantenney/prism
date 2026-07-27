# Sprint 70 Notes

## Reference implementations

- VEU prompt patches: `scripts/build-veu-v121-json.js`
- Sprint 38 validation: `lib/sprint38-visual-affordances.js`
- Renderer plan: `lib/learner-renderer-vnext/sprint38-visual-affordance-plan.js`
- VEU contract tests: `tests/sprint-38-veu-v121.test.js`
- Hook regression: `tests/utility-visual-affordance-hooks.test.js`

## VEU Step 1 JSON shape (reference for manifest)

```json
{
  "handover_mode": "authoritative",
  "image_queue": [
    {
      "id": "VO1",
      "affordance_id": "va-…",
      "filename": "VO1-example.png",
      "prompt": "…",
      "requires_exact_data_match": false
    }
  ],
  "rejected_affordances": [],
  "deferred_affordances": []
}
```

Sprint 70 manifest should carry equivalent information without requiring VEU Step 1 LLM pass.

## Generate field allow-lists (from sprint38-visual-affordances.js)

**Purposes:** distinction, comparison, classification, mechanism, evidence_structure, data_pattern_reading

**Representations:** comparison_framework, classification_matrix, causal_model, evidence_t_chart, number_line_segments, ordered_bar_strip, labelled_contrast_panel

**Visual slots:** activity-after-header, materials-entry, materials-card-grid-after, materials-table-pair-between, assessment-before-checkpoint

## Predecessor metrics (Sprint 69 closeout)

- Certification: CERTIFIED (6 workflows, 25 activities, 91 moments)
- Unsupported material types: 3 intentional (table, video, worksheet)

## Future work (explicit backlog)

- API image generation + provider abstraction
- Copilot session automation / VEU deprecation path
- AI image QA against affordance constraints
- Base64 self-contained export option
- Batch generation and retry policies
- Image normalisation (resize, format conversion)
