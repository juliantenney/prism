# Slice 39-4 — Representation cue alignment

**Date:** _pending_  
**Status:** **PENDING**  
**Authority:** [38-3 representation guidance](../../development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/observations/38-3-representation-guidance.md), `lib/sprint38-representation-pedagogical-value.js` (read-only reference)

---

## Success criterion

For each Sprint 38 **representation token** (seven tokens, no new tokens), define cue-level requirements:

```yaml
must_make_visible
must_not_hide
cue_failure_modes
```

Align with 38-6 `must_add` / `must_not_duplicate` but **operationalise for image briefs**.

---

## Token matrix (populate)

### `comparison_framework`

| Field | Draft (from 38-6 + 39-1) |
|-------|--------------------------|
| **must_make_visible** | Named comparison dimensions; salient differences; one confusable feature pair |
| **must_not_hide** | Open cells; no pre-filled verdict |
| **cue_failure_modes** | Decorative columns; duplicated comparison table; topic poster |

### `classification_matrix`

| Field | Draft |
|-------|-------|
| **must_make_visible** | Discriminating cues between types; decision criteria; category headers without answers |
| **must_not_hide** | Empty cells; classification keys when `anti_spoiler` |
| **cue_failure_modes** | **Blank worksheet duplicate**; filled answer key; generic category poster |

### `causal_model`

| Field | Draft |
|-------|-------|
| **must_make_visible** | Directed mechanism links; intermediate node; labels tied to materials |
| **must_not_hide** | Unlabelled arrows |
| **cue_failure_modes** | Isolated labels; topic diagram; unsupported arrow |

### `evidence_t_chart`

| Field | Draft |
|-------|-------|
| **must_make_visible** | Evaluation criteria rows; strength distinction scaffolding |
| **must_not_hide** | Neutral cells |
| **cue_failure_modes** | Copied evidence list; pre-weighted verdict |

### `number_line_segments`

| Field | Draft |
|-------|-------|
| **must_make_visible** | Exact endpoints; shared axis; units |
| **must_not_hide** | Segment boundaries |
| **cue_failure_modes** | Invented intervals; overlap verdict in figure |

### `ordered_bar_strip`

| Field | Draft |
|-------|-------|
| **must_make_visible** | Ordered level relationship; width cue |
| **must_not_hide** | Order labels |
| **cue_failure_modes** | Pie chart duplicate; fabricated width |

### `labelled_contrast_panel`

| Field | Draft |
|-------|-------|
| **must_make_visible** | Single contrast dimension; two constructs |
| **must_not_hide** | Open comparison space |
| **cue_failure_modes** | Decorative two-column poster |

---

## Cross-token rules

- [ ] Cue requirements must not contradict `representation_avoid` tokens  
- [ ] `must_make_visible` should inform `must_show` authoring (39-5)  
- [ ] Map each 39-1 failure mode to a `cue_failure_modes` row

---

## Deliverables

- [ ] Completed matrix for all seven tokens  
- [ ] Link table: representation → primary cue types (39-2)  
- [ ] No new representation tokens proposed
