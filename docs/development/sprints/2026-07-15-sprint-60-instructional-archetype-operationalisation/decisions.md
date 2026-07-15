# Sprint 60 — Decisions

**Updated:** 2026-07-15

---

## S60-D01 — Authoritative archetype SoT is DLA required_materials

**Decision:** Production instructional-archetype selection is expressed only as:

```text
required_materials[].instructional_archetype
required_materials[].archetype_plan
```

Workflow goal/title tokens, window flags, `selected_dla_test`, DLA test emission blocks, and capture stamps are **not** the production path.

**Date:** 2026-07-15

---

## S60-D02 — Phase A: production DLA planning guidance shipped

**Decision:** Accept Sprint 60 Phase A. Update `lib/ld-dla-page-enrich-contract.js` (`CONTRACT_VERSION` `58-DLA-PARTIAL-2`) so DLA emits Priority-1 archetype fields when pedagogical purpose matches; correct mental-model plan to `system` / `key_relationships` / `governing_constraint` / `contrast.{state_a,state_b}` (no `parts` / `predicted_effect`); allow multiple materials with different archetypes on one page; ordinary materials omit fields.

Keep Sprint 59 `S59_*_TEST` helpers as **legacy regression-only** paths (not removed). GAM routing behaviour unchanged.

**Evidence:** `tests/ld-instructional-archetype-production-planning.test.js`

**Date:** 2026-07-15

---

## S60-D03 — Phase B: durable GAM prompt observability and delivery verification

**Decision:** Publish sprint-neutral final GAM prompt observability at `window.__PRISM_FINAL_GAM_PROMPT`. Keep `window.__PRISM_S59_FINAL_GAM_PROMPT` as a legacy alias to the **same snapshot object** during Sprint 60. Snapshot includes `archetype_delivery` (expected/delivered/missing/pass) derived from persisted DLA `required_materials` + final GAM prompt — not activation flags or `S59_*_TEST` tokens. Acceptance rule: **Do not evaluate archetype quality until `archetype_delivery.pass` is true.**

**Evidence:** `lib/ld-instructional-archetype.js` (`buildFinalGamPromptObservabilitySnapshot`, `buildArchetypeDeliveryVerification`); `app.js` (`publishFinalGamPromptSnapshot`); `tests/ld-instructional-archetype-delivery-observability.test.js`

**Date:** 2026-07-15

---

## S60-D04 — Phase C: mixed-archetype acceptance PASS; recommend Sprint 60 close

**Decision:** Accept Sprint 60 Phase C. One ordinary lesson DLA page with all three Priority-1 archetypes (plus ordinary non-archetype material) validates, reaches GAM Copy with `archetype_delivery.pass === true`, and uses **no** Sprint 59 token/stamp/emission path. Live browser check (2026-07-15) and `tests/ld-instructional-archetype-mixed-acceptance.test.js` record the evidence. Recommend **closing Sprint 60**.

**Evidence:** [artefacts/mixed-archetype-acceptance/PHASE-C-ACCEPTANCE.md](artefacts/mixed-archetype-acceptance/PHASE-C-ACCEPTANCE.md)

**Date:** 2026-07-15
