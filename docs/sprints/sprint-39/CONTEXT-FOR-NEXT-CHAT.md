# Context for next chat — Sprint 39

**Paste this pack path first:** `docs/sprints/sprint-39/`  
**Mirror:** [NEXT-CHAT-CONTEXT.md](../../../NEXT-CHAT-CONTEXT.md) (repo root)

> **Gate (2026-06-03):** Start with [Sprint 38-B CONTEXT](../../development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/CONTEXT-FOR-NEXT-CHAT.md) instead. Sprint 39 is deferred until LD prompt architecture audit (38B-1) and materials/table fidelity analysis (38B-4) complete.

---

## 1. Current project state

- **PRISM** learning-design workflow: Design Page compose → HTML renderer → Visual Enhancement Utility (VEU) → image generation.
- **Sprint 38** is **complete and committed**.
- **697 tests passing** (`node --test tests/*.test.js`).
- **No Sprint 39 runtime code** exists yet — planning pack only.

---

## 2. Sprint 38 architecture summary

| Piece | Summary |
|-------|---------|
| **Page root** | `visual_affordance_schema_version: "38.4"`, `activities_visual_review[]`, `visual_affordances[]` |
| **Decisions** | `generate` \| `defer` \| `reject` per affordance row |
| **Activity gate** | `activity_visual_value` per `activity_id` |
| **Compose** | `lib/sprint38-visual-affordances.js` validates and normalizes |
| **Renderer** | Authoritative: hooks only for `generate` + matching `visual_slot`; legacy when no affordances |
| **VEU** | v1.2.1 legacy / hybrid / authoritative |
| **38-6** | `pedagogical_added_value` + per-representation `must_add` / `must_not_duplicate` guidance |

Full detail: [Sprint 38 ARCHITECTURE.md](../../development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/ARCHITECTURE.md)

---

## 3. What was validated

End-to-end on programme anchors (Inflation primary):

```text
Design Page → Compose → Renderer → VEU v1.2.1 → Image Generation
```

- Design Page emits valid 38.4 affordances  
- Invalid rows dropped at compose with `generation_notes`  
- Renderer emits authoritative hooks with `data-affordance-id`  
- VEU authoritative mode queues images from `generate` rows only  
- Images generate from structured queue prompts (not topic-only inference)

---

## 4. What failed / remained weak

**Inflation A3** (`classification_matrix`) — first successful authoritative image:

- Affordance **valid** under Sprint 38 schema  
- Image **complied** with representation token  
- Image **lacked** meaningful discriminating cue specificity  
- Looked like **blank worksheet duplication** rather than instructional classification scaffold  

**Diagnosis:** `purpose` + `preferred_representation` + `pedagogical_added_value` + current `must_show` entries are **not always sufficient** to brief the image model on **perceptible reasoning cues**.

---

## 5. Sprint 39 objective

**Working title:** Reasoning Cue Specification

Investigate how to author **specific reasoning cues** so visuals become genuine pedagogical supports.

**Programme question:**

> What reasoning cues must learners notice, compare, classify, interpret, evaluate, or trace — and how should those cues be represented in visual affordances?

**Hypothesis:** The next bottleneck is **insufficient specification of reasoning cues**, not pipeline architecture.

---

## 6. Constraints

**Do not reopen:**

- Sprint 38 architecture or schema 38.4 (unless 39-3 audit proves minimal additive field)  
- Renderer, CSS, Sprint 36 placement  
- VEU topology, image models  
- Sprint 37 session framing  

**Do not implement** in first Sprint 39 pass — **audit and planning only** (39-1 → 39-6).

**Do not** propose `reasoning_cues[]` as foregone conclusion — evaluate existing fields first (`must_show`, `pedagogical_added_value`, `allowed_claims`, `disallowed_claims`, `must_not_show`).

---

## 7. Recommended first action

1. Read [SPRINT-39-CHARTER.md](SPRINT-39-CHARTER.md) and [fixtures/probe-39-1-cue-audit-template.md](fixtures/probe-39-1-cue-audit-template.md).  
2. Complete **39-1 Reasoning Cue Audit** for all Sprint 38 **generate** rows on Inflation, Climate, CI, Marx anchors.  
3. Use `tests/fixtures/sprint-38/affordance-records.json` and live/regenerated HTML+JSON where available.  
4. Populate [observations/39-1-reasoning-cue-audit.md](observations/39-1-reasoning-cue-audit.md).

---

## 8. Key file links

| File | Purpose |
|------|---------|
| `docs/sprints/sprint-39/README.md` | Sprint 39 overview |
| `docs/sprints/sprint-39/SPRINT-39-CHARTER.md` | Charter |
| `docs/sprints/sprint-39/HANDOVER-AND-FORWARD-PLAN.md` | Handover |
| `docs/development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/ARCHITECTURE.md` | Sprint 38 architecture |
| `lib/sprint38-visual-affordances.js` | Validation (read-only for audit) |
| `lib/sprint38-representation-pedagogical-value.js` | 38-6 catalog |
| `tests/fixtures/sprint-38/affordance-records.json` | Probe affordances including `inflation_a3_generate` |
| `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` | Inflation page fixture |
| `domains/learning-design/domain-learning-design-step-patterns.md` | Design Page §13 (reference) |
| `utilities/visual-enhancement-utility/visual-enhancement-utility-v1.2.1.json` | VEU prompts (reference) |

---

## 9. Sprint 39 human-designer test

> Could a competent learning designer explain **what reasoning** the visual supports and **what cues** it makes visible **without** reading the full activity?

---

## 10. Ready-to-paste next-chat starting prompt

```text
We have completed Sprint 38. The pedagogical visual affordance pipeline works end-to-end and is documented in ARCHITECTURE.md with 697 tests passing. The remaining bottleneck is reasoning cue specificity: generated visuals can now follow valid affordances, but the Inflation A3 classification visual showed that purpose + representation + pedagogical_added_value are not always enough. Please review docs/sprints/sprint-39/CONTEXT-FOR-NEXT-CHAT.md and begin Sprint 39 with 39-1 Reasoning Cue Audit. Do not reopen renderer, CSS, VEU topology, image model, or placement architecture.
```
