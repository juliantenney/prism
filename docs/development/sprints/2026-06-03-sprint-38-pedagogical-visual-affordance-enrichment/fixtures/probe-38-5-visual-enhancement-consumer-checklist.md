# Probe 38-5 — Visual Enhancement consumer checklist (v1.2)

**Date:** 2026-06-03  
**Slice:** 38-5 **COMPLETE**  
**Workflow:** Visual Enhancement Utility **v1.2.1** (Sprint 38-8 — prompt patch; no topology change)

**Authority:** [../../../../utilities/visual-enhancement-utility/visual-enhancement-utility-v1.2.1.json](../../../../utilities/visual-enhancement-utility/visual-enhancement-utility-v1.2.1.json) — frozen v1.2: [visual-enhancement-utility-v1.2.json](../../../../utilities/visual-enhancement-utility/visual-enhancement-utility-v1.2.json)  
**Alignment:** [../observations/38-5-workflow-alignment.md](../observations/38-5-workflow-alignment.md)  
**Affordance schema:** [probe-38-4-enriched-affordance-example.yaml](probe-38-4-enriched-affordance-example.yaml)  
**Embed DOM history:** [../../workflow/exports/visual-enhancement-utility-v1.1.1-patch-note.md](../../workflow/exports/visual-enhancement-utility-v1.1.1-patch-note.md)

**v1.2 topology:** Step 1 = discovery + embed + queue · Step 2 = one image per queue item. **There is no separate analyse or embed step.**

---

## Session setup

- [ ] Operating mode identified in Step 1 output: `legacy` | `hybrid` | `authoritative`
- [ ] Utilities HTML export (complete document)
- [ ] Compose JSON attached when programme requires Sprint 38 handover
- [ ] `visual_affordance_schema_version` present when using authoritative mode
- [ ] Same `activity_id` values in JSON and HTML
- [ ] Sprint 36 hooks present only for `visual_decision: generate` affordances (post-renderer implementation)

---

## Authoritative precedence

- [ ] Step 1 uses JSON over heading / title / `data-visual-subject` topic inference when affordances present
- [ ] HTML used for **slot location** (`data-visual-slot` ↔ `visual_slot`) only
- [ ] JSON wins when HTML and JSON disagree on pedagogy

---

## Mode-specific

### Legacy (HTML only)

- [ ] `handover_mode` absent or `legacy`
- [ ] Step 1 inference behaviour acceptable (degraded but functional)
- [ ] `selection_notes` explain hook accept/reject without authored `rejection_reason`

### Hybrid

- [ ] Authored rows honoured; unmatched hooks do not override `reject` / `defer`
- [ ] No generate for `activity_visual_value.decision: none` unless explicit generate affordance with rationale

### Authoritative

- [ ] `activities_visual_review[]` complete for activities in export
- [ ] `visual_affordances[]` covers every emitted hook decision
- [ ] **No** topic-only figures from title / subject / headings

---

## Step 1 — Create Enhanced HTML Package

*Opportunity discovery, embed, and queue occur in this single step.*

### Reject and defer

- [ ] **No** figure and **no** queue entry for `visual_decision: reject`
- [ ] **No** figure and **no** queue entry for `visual_decision: defer`
- [ ] Every authored `reject` appears in `rejected_affordances[]` with same `rejection_reason` (not generic “decorative” only)
- [ ] Every authored `defer` appears in `deferred_affordances[]` with same `defer_reason`
- [ ] **No** substitute opportunity invented for a rejected slot
- [ ] Inference did **not** reclassify reject → generate (authoritative mode)
- [ ] `activity_visual_value.decision: none` → zero generate figures for that activity

### Generate (embed + queue)

- [ ] Figure inserted only for `visual_decision: generate` (authoritative / matched hybrid)
- [ ] Each inserted figure has matching `affordance_id` in queue (when JSON provided)
- [ ] `purpose` and `preferred_representation` reflected in `selection_notes` / queue prompt (not inferred over JSON)
- [ ] `source_basis` cited in queue prompt
- [ ] `must_show` and `must_not_show` applied in queue prompt and caption/alt derivation
- [ ] `allowed_claims` / `disallowed_claims` respected in queue prompt
- [ ] `representation_avoid` in queue prompt negatives
- [ ] `spoiler_boundary` honoured when `anti_spoiler: true` (placement + brief omissions)
- [ ] `requires_exact_data_match: true` flagged on queue item when applicable
- [ ] **No** figure inside `.util-activity-header` (Sprint 36 / v1.1.1 embed rule)
- [ ] Embed at hook matching `visual_slot` when hook exists
- [ ] `<figure class="util-figure util-figure--pedagogic" data-visual-opportunity="VO#">` (optional `data-affordance-id`)
- [ ] Unused hooks left in place unless removal required for clean output
- [ ] Downloadable `enhanced-learner-page.html` created

### Accessibility (Step 1)

- [ ] `figcaption` derived from `caption_intent` when JSON provided
- [ ] `alt` conveys same instructional support without `must_not_show` / spoiler violations
- [ ] Alt does not reveal answers, classification keys, or model solution when `spoiler_boundary` hides them
- [ ] When `requires_exact_data_match: true`, alt contains no numbers outside `source_basis`

### Anti-spoiler (Step 1)

- [ ] Pre-task figures respect `learner_stage` and `anti_spoiler`
- [ ] No preemption of sequencing, classification, matching, evaluation, or data-interpretation tasks
- [ ] Post-reasoning / comparison figures only where `learner_stage` permits

### Quantitative fidelity (Step 1)

- [ ] No invented values, trends, or interval boundaries in queue prompt when `requires_exact_data_match: true`
- [ ] `must_show` lists every numeric label allowed in image

### Deprecations

- [ ] Topic-inference documented as **fallback only** when JSON absent (legacy)
- [ ] No “illustrate the topic of {title}” pattern in queue prompts (authoritative)

### Step 1 JSON response

- [ ] `hooks_found`, `figures_inserted`, `images_required` consistent with queue length
- [ ] `image_queue[]` entries: `id`, `filename`, `prompt` (plus `affordance_id` when patched)
- [ ] `selection_notes` explain pedagogical value and non-preemption per figure

---

## Step 2 — Generate One Image

- [ ] One image only per run (`one_image_per_step2_run`)
- [ ] Uses next ungenerated queue entry
- [ ] Prompt matches Step 1 queue entry (including affordance brief when patched)
- [ ] `preferred_representation` + `canonical_discipline_note` reflected in image
- [ ] `representation_avoid` honoured
- [ ] `must_show` / `must_not_show` checklist applied
- [ ] No diagram text outside `allowed_claims`
- [ ] `disallowed_claims` not violated
- [ ] `requires_exact_data_match: true` → image matches `source_basis` only
- [ ] `spoiler_boundary` → no answers/keys/model solution in image when hidden
- [ ] **No** Step 2 run for reject or defer affordances
- [ ] No base64; PNG only; filename matches `rename_instruction`

---

## Human-designer sufficiency (spot check)

From JSON only (no page body), reviewer can answer:

- [ ] Generate vs reject for sample rows (e.g. A1/A5 reject, A2 generate)
- [ ] Diagram type for generate row (`preferred_representation`)
- [ ] What must not appear (`must_not_show` / `disallowed_claims`)
- [ ] Why reject row has no figure (`rejection_reason` + `rationale`)

---

## Inflation re-run (programme validation)

| Check | Pass? | Notes |
|-------|-------|-------|
| Operating mode = authoritative when full JSON attached | | |
| A1/A5 explicit reject in `rejected_affordances[]` | | |
| A2 generate with full claim boundaries in queue prompt | | |
| No duplicate of comparison table | | |
| No spoiler in pre-worksheet visuals | | |
| Canonical economics representation in queue prompt | | |
| Figure count ≤ value-gated budget | | |
| Alt/caption non-spoiler for pre-task generate | | |

---

## Regression (PRISM core)

```bash
node --test tests/*.test.js
```

Expected: **642 pass / 0 fail**; `utility-visual-affordance-hooks.test.js` unchanged unless documented `data-affordance-id` passthrough only.

**Observation file:** [../observations/38-5-workflow-alignment.md](../observations/38-5-workflow-alignment.md)
