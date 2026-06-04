# Sprint 39 Charter — Reasoning Cue Specification

**Pack path:** `docs/sprints/sprint-39/`  
**Date:** 2026-06-03  
**Mode:** Discovery and planning — **no runtime implementation** in charter phase

---

## Mission

Improve **instructional specificity** of generated visuals by defining how **reasoning cues** are authored in visual affordances — without reopening Sprint 38 architecture.

---

## Problem statement

Sprint 38 validated end-to-end handover. The first successful Inflation A3 image (`classification_matrix`) was **representation-correct** but **pedagogically weak**: it reproduced a blank worksheet structure rather than making **discriminating cause-type cues** perceptible.

The affordance stated:

```yaml
purpose: classification
preferred_representation: classification_matrix
pedagogical_added_value: Adds discriminating cause-type cues and decision criteria...
must_show:
  - demand-pull inflation
  - cost-push inflation
  - wage-price spiral
  - evidence or cause cues
```

The pipeline executed; the **cue-level brief** was still insufficient for the image model to render distinctive instructional content.

---

## Principles

1. **Sprint 38 is frozen** — schema 38.4, handover modes, and placement contracts are not redesign targets.
2. **Cues before cosmetics** — quality failures are traced to missing or vague **perceptible cues**, not figure polish.
3. **Schema parsimony** — prefer enriching `must_show`, `pedagogical_added_value`, `allowed_claims`, and related fields before adding `reasoning_cues[]` or similar.
4. **Representation-aligned** — each Sprint 38 representation token has explicit **must_make_visible** / **cue_failure_modes** (39-4).
5. **Anti-spoiler preserved** — cue specification must not collapse spoiler boundaries from Sprint 38.
6. **Human-designer test** — if a designer cannot name visible cues without reading the full activity, the affordance is incomplete for Sprint 39 purposes.

---

## Success criteria (programme)

| Criterion | Evidence |
|-----------|----------|
| Audit completes for all anchor generate affordances | 39-1 populated |
| Taxonomy covers recurring cue types with examples | 39-2 allow-list or controlled vocabulary |
| Authoring design recommends field strategy with evidence | 39-3 — no foregone schema expansion |
| Representation–cue matrix for seven tokens | 39-4 |
| Design Page authoring questions documented | 39-5 |
| Validation plan uses Sprint 38 baseline | 39-6 |

**Not success criteria for Sprint 39 charter phase:** new renderer hooks, VEU steps, validator changes, or image model swaps.

---

## Sprint 39 human-designer test

> Could a competent learning designer explain **what reasoning** the visual supports and **what cues** it makes visible **without** reading the full activity?

If not, cue specification is incomplete — even when Sprint 38 Pass (purpose + representation + anti-spoiler) is satisfied.

---

## Relationship to Sprint 38

| Sprint 38 taught | Sprint 39 investigates |
|----------------|------------------------|
| When to create a visual (`generate` / `defer` / `reject`) | What cues must be **perceptible** |
| Where to place it (`visual_slot`, Sprint 36) | How cues map to **must_show** / claims |
| Why it exists (`rationale`, `pedagogical_added_value`) | **Specificity** of cue wording |
| Representation family (`preferred_representation`) | Per-token **must_make_visible** |
| What not to show (`must_not_show`, `representation_avoid`) | **Cue failure modes** (duplicate structure) |

---

## Governance

| Role | Responsibility |
|------|----------------|
| Learning designer lens | Audit and taxonomy (39-1, 39-2) |
| Schema designer lens | Cue authoring design (39-3) — evidence-based |
| Representation lens | Token alignment (39-4) |
| LD author lens | Prompt guidance draft (39-5) — planning only |
| QA lens | Validation plan (39-6) |

Implementation slices (prompt patch, validator, VEU prompt) are **post–Sprint 39 planning** unless audit mandates minimal prompt-only changes.

---

## References

- Sprint 38 architecture: [../../development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/ARCHITECTURE.md](../../development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/ARCHITECTURE.md)
- Pedagogical added value: [../../development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/observations/38-6-pedagogical-added-value-contract.md](../../development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/observations/38-6-pedagogical-added-value-contract.md)
- Representation catalog: `lib/sprint38-representation-pedagogical-value.js`
