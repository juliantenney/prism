# Visual Enhancement Utility

**Repository path:** `utilities/visual-enhancement-utility/`  
**Current bundled version:** **v1.2.1** (`visual-enhancement-utility-v1.2.1.json`) — Sprint 38 authoritative affordance consumption  
**Frozen reference:** **v1.2** (`visual-enhancement-utility-v1.2.json`)

---

## Purpose

Augment **PRISM Utilities-exported learner HTML** with pedagogically justified figures: select from hidden `.util-visual-affordance` hooks, insert `<figure class="util-figure util-figure--pedagogic">` with traditional `<img src="images/…">` references, and produce an **image generation queue** for manual or stepwise image creation.

Consumes **HTML** and, from v1.2.1 onward, optional **Sprint 38** `visual_affordances[]` handover JSON (same compose export as LD Design Page).

---

## Version in this folder

| File | Version | Notes |
|------|---------|--------|
| [`visual-enhancement-utility-v1.2.1.json`](visual-enhancement-utility-v1.2.1.json) | **v1.2.1** | Sprint 38 modes + field consumption (import this) |
| [`visual-enhancement-utility-v1.2.json`](visual-enhancement-utility-v1.2.json) | **v1.2** | Frozen — inference-only prompts |
| [`PATCH-NOTES.md`](PATCH-NOTES.md) | — | Version lineage |

**Workflow id:** `4315bb60-5169-4854-a5b3-eee1bf92734c`  
**Workflow name:** `Visual Enhancement Utility v1.2.1`

---

## Operating modes (v1.2.1)

| Mode | When | Step 1 behaviour |
|------|------|------------------|
| **Legacy** | No `visual_affordances[]` (or empty) | v1.2 inference unchanged — hook heuristics, pedagogical significance |
| **Hybrid** | Partial affordance JSON | JSON wins on matched `activity_id` + `visual_slot` / `data-affordance-id`; legacy inference on unmatched hooks |
| **Authoritative** | Full 38.4 handover (`visual_affordance_schema_version`, `activities_visual_review[]`, valid `visual_affordances[]`) | **Only** `visual_decision: generate` rows become figures; reject/defer never queued; no topic-only inference |

Detection logic (documentation/tests): [`lib/sprint38-visual-affordances.js`](../../lib/sprint38-visual-affordances.js) — `detectVisualAffordanceHandoverMode`.

---

## Inputs

| Input | Required | Description |
|-------|----------|-------------|
| **HTML learner page** | yes | PRISM export with `.util-visual-affordance` hooks (`data-visual-slot`, `data-affordance-id`, `data-activity-id`) |
| **visual_affordances JSON** | no (recommended for Sprint 38) | Page compose extract: `visual_affordances[]`, `activities_visual_review[]` |
| **images/** folder | yes (operational) | Beside downloaded HTML for Step 2 |

---

## Outputs

| Output | Step | Description |
|--------|------|-------------|
| **`enhanced_html_package`** | 1 | `enhanced-learner-page.html` + Step 1 JSON (`handover_mode`, ledgers, `image_queue`) |
| **`generated_image`** | 2 | One PNG per queue item |

**Step 1 JSON (v1.2.1):** `handover_mode`, `rejected_affordances[]`, `deferred_affordances[]`, `image_queue[]` with `affordance_id` and `requires_exact_data_match` when applicable.

---

## Current Workflow Summary

```text
Inputs
  └── HTML learner page (+ optional visual_affordances handover JSON)

        ↓

Step 1 — Create Enhanced HTML Package
  • Detect legacy | hybrid | authoritative
  • Match hooks via data-visual-slot + activity id + data-affordance-id
  • generate → figure + queue (consume 38-4 fields)
  • defer / reject → ledgers only, no figure
  • caption_intent → figcaption; alt with must_show / must_not_show / spoiler_boundary

        ↓

Step 2 — Generate One Image (per queue entry; honour Sprint 38 brief when present)

        ↓

Outputs
  └── enhanced HTML + images/
```

---

## Generate field consumption (authoritative)

When `visual_decision: generate`, Step 1/2 consume (do not infer):

`purpose`, `preferred_representation`, `reasoning_supported`, `representation_avoid`, `allowed_claims`, `disallowed_claims`, `must_show`, `must_not_show`, `source_basis`, `requires_exact_data_match`, `caption_intent`, plus `anti_spoiler`, `spoiler_boundary`, `canonical_discipline_note`, `tier`, `affordance_id`, `visual_slot`.

---

## Relationship to Sprint 38

| Slice | Status |
|-------|--------|
| 38-4 schema | LD emits affordances |
| 38-5 alignment | Complete |
| 38-6 LD emission | Complete |
| 38-7 renderer | `data-affordance-id` passthrough |
| **38-8 VEU v1.2.1** | **This bundle** |
| 38 validation | Inflation / climate / CI / Marx E2E (next) |

Alignment spec: [`docs/development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/observations/38-5-workflow-alignment.md`](../../docs/development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/observations/38-5-workflow-alignment.md)

---

## Import / use in PRISM

Import **`visual-enhancement-utility-v1.2.1.json`** via PRISM Workflow import. Attach the same compose JSON used to render the HTML when running Step 1.

---

## References

- v1.2 frozen export: `visual-enhancement-utility-v1.2.json`
- Sprint 38 pack: [`docs/development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/`](../../docs/development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/)
- Contract tests: [`tests/sprint-38-veu-v121.test.js`](../../tests/sprint-38-veu-v121.test.js)
