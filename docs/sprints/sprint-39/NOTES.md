# Sprint 39 — programme notes

**Date:** 2026-06-03

---

## Founding note

Sprint 38 fixed **whether** and **why** visuals exist and **which representation family** to use. Sprint 39 fixes **what learners must be able to see** in the figure to support the reasoning move — without reopening placement or handover architecture.

---

## Stable foundations (entry)

| Foundation | Detail |
|------------|--------|
| Sprint 38 pipeline | 697 tests; E2E validated |
| Schema | 38.4 page root + affordance records |
| Placement | Sprint 36 hooks — frozen |
| Session rhetoric | Sprint 37 — frozen |
| VEU | v1.2.1 authoritative consumption |

---

## Trigger case (Inflation A3)

| Field | Author intent | Image outcome gap |
|-------|---------------|-------------------|
| `purpose` | `classification` | Job category present |
| `preferred_representation` | `classification_matrix` | Grid layout present |
| `pedagogical_added_value` | Discriminating cause-type cues | Prose intent not rendered as **visible cues** |
| `must_show` | Category names + “evidence or cause cues” | Labels generic; not **perceptible discriminators** |

**Lesson:** `must_show` must encode **cue-level perceptual targets**, not topic vocabulary alone.

---

## Slice log

| Slice | Status | Notes |
|-------|--------|-------|
| 39-1 Reasoning cue audit | **Pending** | [observations/39-1-reasoning-cue-audit.md](observations/39-1-reasoning-cue-audit.md) |
| 39-2 Reasoning cue taxonomy | **Pending** | [observations/39-2-reasoning-cue-taxonomy.md](observations/39-2-reasoning-cue-taxonomy.md) |
| 39-3 Cue authoring design | **Pending** | [observations/39-3-cue-authoring-design.md](observations/39-3-cue-authoring-design.md) |
| 39-4 Representation cue alignment | **Pending** | [observations/39-4-representation-cue-alignment.md](observations/39-4-representation-cue-alignment.md) |
| 39-5 Authoring guidance | **Pending** | [observations/39-5-authoring-guidance.md](observations/39-5-authoring-guidance.md) |
| 39-6 Validation plan | **Pending** | [observations/39-6-validation-plan.md](observations/39-6-validation-plan.md) |

---

## Constraints (repeat)

- No Sprint 38 architecture reopen  
- No renderer / CSS / VEU topology / image model changes in planning phase  
- Schema expansion only if 39-3 audit proves existing fields insufficient  
- Discovery first, implementation later
