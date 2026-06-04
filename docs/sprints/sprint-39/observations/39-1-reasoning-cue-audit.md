# Slice 39-1 — Reasoning cue audit

**Date:** _pending_  
**Status:** **PENDING**  
**Reviewer lens:** learning designer; discipline expert  
**Authority:** Sprint 38 generate affordances — [probe-39-1-cue-audit-template.md](../fixtures/probe-39-1-cue-audit-template.md)

---

## Success criterion

For every Sprint 38 **`visual_decision: generate`** affordance on programme anchors, produce an evidence-backed row answering: what reasoning move is intended, what cues are currently specified, how specific they are, what is missing, and what failure mode the image model likely produced.

---

## Anchors

| Anchor | Page fixture | Affordance probes |
|--------|--------------|-------------------|
| **Inflation** | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` | `tests/fixtures/sprint-38/affordance-records.json` |
| **Climate** | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` | same |
| **CI** | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` | same |
| **Marx** | `tests/fixtures/page-render/marx-self-study-page.json` | same |

Include **live/regenerated** VEU output where available (A3 image review is priority).

---

## Audit table (populate)

| Anchor | activity_id | affordance_id | reasoning move | cues currently specified | cue specificity | missing cue information | anti-spoiler boundary | representation | likely failure mode |
|--------|-------------|---------------|----------------|--------------------------|-----------------|-------------------------|----------------------|----------------|-------------------|
| Inflation | A2 | va-A2-cpi-deflator-distinction | distinction (indices) | `must_show`: CPI/PPI/deflator labels; `pedagogical_added_value`: comparison without filled table | _TBD_ | _TBD_ | hide answers/keys | `comparison_framework` | _TBD_ |
| Inflation | A3 | va-A3-classification-01 | classification (cause types) | category names + “evidence or cause cues”; pedagogical_added_value mentions discriminating cues | **low** (A3 image) | Perceptible **discriminators** between cause types; scenario-linked cues not in brief | hide classification keys | `classification_matrix` | **blank worksheet duplicate** |
| Climate | CC-MIS-1 | _(mechanism)_ | mechanism | _TBD_ | _TBD_ | _TBD_ | _TBD_ | `causal_model` | _TBD_ |
| Climate | CC-MIS-1 | _(evidence)_ | evidence_structure | _TBD_ | _TBD_ | _TBD_ | _TBD_ | `evidence_t_chart` | _TBD_ |
| CI | A2 | _(level-width)_ | distinction | _TBD_ | _TBD_ | _TBD_ | _TBD_ | `ordered_bar_strip` | _TBD_ |
| CI | A4 | va-A4-interval-overlap | data_pattern_reading | endpoints in `must_show` | _TBD_ | _TBD_ | _TBD_ | `number_line_segments` | _TBD_ |
| Marx | A3 | _(text comparison)_ | comparison | _TBD_ | _TBD_ | _TBD_ | _TBD_ | `comparison_framework` | _TBD_ |

---

## Priority finding (seed — Inflation A3)

| Dimension | Finding |
|-----------|---------|
| **Authoring** | Affordance valid; `pedagogical_added_value` states intent in prose |
| **must_show** | Lists **category labels** not **visible discriminating features** (e.g. demand shock vs cost push **signals** in scenarios) |
| **Image** | `classification_matrix` shell without cue-rich scaffolding |
| **Implication for 39-3** | May need structured cue lines in `must_show` or dedicated field — **evidence pending across anchors** |

---

## Deliverables

- [ ] Completed table for all 6–8 generate audit rows  
- [ ] A3 deep-dive subsection with image + affordance + queue prompt comparison  
- [ ] Cross-anchor pattern note (when cue specificity low despite valid 38.4)  
- [ ] Recommendation input for 39-2 and 39-3 (no schema decision here)

---

## Out of scope (39-1)

- Renderer or VEU code changes  
- New schema fields (defer to 39-3)  
- Image model tuning
