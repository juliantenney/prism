# Slice 39-3 — Cue authoring design

**Date:** _pending_  
**Status:** **PENDING**  
**Authority:** [39-1-reasoning-cue-audit.md](39-1-reasoning-cue-audit.md), [39-2-reasoning-cue-taxonomy.md](39-2-reasoning-cue-taxonomy.md)

---

## Success criterion

Evidence-based recommendation for **where cue specification lives** in affordance records — preferring existing Sprint 38 fields unless audit proves insufficiency.

---

## Option A — Enrich existing fields (no schema change)

| Field | Cue role (hypothesis) |
|-------|----------------------|
| `pedagogical_added_value` | One-paragraph **incremental support** statement |
| `must_show` | **Perceptible cue list** (primary Sprint 39 target) |
| `must_not_show` | Cue spoilers + duplicate-structure guards |
| `allowed_claims` | Verbal claims the image may support |
| `disallowed_claims` | Claims that would overstate materials |
| `reasoning_supported` | Learner task linkage (not cue list) |

**A3 hypothesis:** `must_show` should name **perceptible features** (e.g. “empty row headers only”, “icon: demand shock vs supply shock”, “scenario symptom → cause-type arrow legend”) not category nouns alone.

---

## Option B — Dedicated field (schema change)

```yaml
reasoning_cues:
  - cue_type: discriminating
    cue_text: "Learners must see that wage-price spiral is distinct from a one-off supply shock in the scenario."
    perceptual_target: "side-by-side scenario symptom labels without classification keys"
```

**Justification bar:** 39-1 must show Option A cannot express cue structure across ≥2 anchors.

---

## Evaluation criteria

| Criterion | Option A | Option B |
|-----------|----------|----------|
| VEU prompt parseability | _TBD_ | _TBD_ |
| Design Page author burden | _TBD_ | _TBD_ |
| Validator complexity | unchanged | _TBD_ |
| Anti-spoiler expressibility | _TBD_ | _TBD_ |
| Quantitative exact-match (CI A4) | _TBD_ | _TBD_ |

---

## Decision (populate)

- [ ] **Recommended approach:** _TBD_  
- [ ] **Rationale:** _TBD_  
- [ ] **If Option B:** minimal shape and version bump strategy (not 38.4 breaking change without programme approval)

---

## Out of scope

- Implementing validator or prompts in 39-3  
- Reopening `visual_decision` or representation allow-lists
