# Slice 38-5 — Workflow alignment (COMPLETE)

**Date:** 2026-06-03  
**Status:** **COMPLETE** — alignment against authoritative VEU **v1.2**; prompt-patch recommendations only  
**Reviewer lens:** enhancement operator; workflow author  
**Authority:** [`utilities/visual-enhancement-utility/visual-enhancement-utility-v1.2.json`](../../../../utilities/visual-enhancement-utility/visual-enhancement-utility-v1.2.json) · [`utilities/visual-enhancement-utility/README.md`](../../../../utilities/visual-enhancement-utility/README.md) · [38-4](38-4-affordance-enrichment-design.md) · [38-3](38-3-representation-guidance.md) · [38-2](38-2-visual-purpose-taxonomy.md)  
**Change type:** observation + **Step 1 / Step 2 prompt patch spec** (no topology, renderer, image model, or code in this slice)

**Checklist:** [../fixtures/probe-38-5-visual-enhancement-consumer-checklist.md](../fixtures/probe-38-5-visual-enhancement-consumer-checklist.md)

**Supersedes:** All Sprint 38 text that assumed v1.1.1 **analyse → generate → embed** as the live utility. v1.2 **combines** opportunity selection, HTML embed, and queue emission in **one** step.

---

## Success criterion

When Sprint 38 affordances are present, **Visual Enhancement Utility v1.2** treats `visual_affordances[]` as **authoritative** for pedagogy: honours **`generate` / `defer` / `reject`**, respects claim boundaries, and does not promote topic-only opportunities — **without** adding steps, changing image models, or changing renderer behaviour.

---

## 1. v1.2 workflow (source of truth)

| Step | Canonical id | What happens today |
|------|----------------|-------------------|
| **1 — Create Enhanced HTML Package** | `step_create_html_package` | **Opportunity discovery + embed + manifest** in one pass: scan `.util-visual-affordance` hooks, infer pedagogical value from HTML, insert `<figure>` + build `image_queue[]` |
| **2 — Generate One Image** | `step_generate_image` | One PNG per queue entry; uses `id`, `filename`, `prompt` only |

**Declared inputs:** `HTML learner page` only.  
**Declared outputs:** `enhanced_html_package`, `image_generation_manifest` (queue JSON in Step 1 response).

**Frozen constraints (bundle):** `use_prism_visual_affordance_hooks`, `hooks_are_candidates_not_obligations`, `no_visual_preemption_of_tasks`, `one_image_per_step2_run`, `no_base64`, `no_inline_svg`.

---

## 2. Primary questions

### 2.1 Where does opportunity discovery occur in v1.2?

**Only in Step 1** (`override_prompt_body` on *Create Enhanced HTML Package*).

There is **no** separate analyse JSON step. Discovery is the per-hook loop:

1. Enumerate `.util-visual-affordance` hooks (`data-visual-slot`, `data-visual-subject`, `data-visual-activity-id`).
2. Inspect nearby activity/material content.
3. Apply **PEDAGOGICAL SIGNIFICANCE**, **INCREMENTAL VALUE**, and **ANTI-SPOILER** rules.
4. **Insert** a figure at the hook (embed) **or** leave the hook unused.
5. Emit `image_queue[]` only for inserted figures.

If no hooks exist, Step 1 may use conservative placement (fallback scan) and must report that in JSON (`hooks_found`, `selection_notes`).

### 2.2 Where should Sprint 38 affordances enter the workflow?

| Entry point | Step | Behaviour |
|-------------|------|-----------|
| **Author handover** | Before Step 1 | Operator uploads **HTML +** compose JSON (or `visual_affordances.json` extract) in the same chat/session |
| **Mode detection** | Start of Step 1 | Classify **legacy / hybrid / authoritative** (§4) from presence of `visual_affordances[]` + `activities_visual_review[]` |
| **Candidate set** | Step 1 hook loop | **Authoritative:** only `visual_decision: generate` records with matching `visual_slot` / `affordance_id` are eligible; hooks without a generate record are not promoted by inference |
| **Rejection ledger** | Step 1 JSON response | Append `rejected_affordances[]` from all `reject` rows (and inference-only rejects in legacy mode) |
| **Defer ledger** | Step 1 JSON response | Append `deferred_affordances[]`; no figure, no queue entry |
| **Queue enrichment** | Step 1 → Step 2 | Each `image_queue[]` item should carry `affordance_id` and a **composed prompt** built from generate fields (prompt patch — still one image per Step 2 run) |
| **Embed** | Step 1 (unchanged topology) | Insert at hook matching `visual_slot`; optional `data-affordance-id="{affordance_id}"` on `<figure>` (recommended passthrough, not renderer-required in 38-5) |

**Not in scope:** new workflow steps, `workflowInputs` schema change in export file (document as **operational** second attachment until a future bundle patch is chartered).

### 2.3 Which inferences become unnecessary when affordances are present?

In **authoritative mode**, for each hook matched to a `generate` affordance:

| Inference | Becomes unnecessary |
|-----------|---------------------|
| Pedagogical purpose | `purpose` |
| Representation / diagram family | `preferred_representation` + `canonical_discipline_note` |
| Cognitive job | `reasoning_supported` |
| Anti-spoiler policy | `anti_spoiler` + `spoiler_boundary` |
| Visual worthiness (for that slot) | `visual_decision: generate` + `activity_visual_value` |
| Claim boundaries | `must_show`, `must_not_show`, `allowed_claims`, `disallowed_claims` |
| Negative diagram families | `representation_avoid` |
| Quantitative fidelity flag | `requires_exact_data_match` + `source_basis` |
| Duplicate-of-table decision | When `reject` + `duplicate_existing_structure` already authored |
| Topic/title opportunity creation | Suppressed when JSON present |

**Still required (all modes):** DOM slot resolution, HTML structure preservation, filename/VO id assignment, responsive CSS, downloadable file contract, Step 2 one-image discipline.

### 2.4 Generate, defer, reject

See §6–§8. Summary:

| Decision | Step 1 | Step 2 |
|----------|--------|--------|
| **generate** | May insert figure + queue entry | Run for each queued VO |
| **defer** | No figure, no queue; record in `deferred_affordances[]` | Skip |
| **reject** | No figure, no queue; record in `rejected_affordances[]`; **no** substitute opportunity from inference | Skip |

### 2.5 Accessibility and alt text

See §9. **Recommendation:** derive **alt text** and **figcaption** from `caption_intent` + `must_show` / `must_not_show` + `spoiler_boundary`; do **not** add `alt_text_intent` to schema in Sprint 38 implementation phase unless field trials show `caption_intent` is insufficient.

### 2.6 Legacy content

**Yes.** Pages without `visual_affordances[]` continue to use Step 1 inference exactly as today (**legacy mode**). No LD or renderer change required for old exports.

---

## 3. Operating modes

Detect at Step 1 start:

```text
IF visual_affordances[] missing OR empty
  → legacy
ELSE IF activities_visual_review incomplete OR <50% activities have gate + matched affordances
  → hybrid
ELSE IF schema_version present AND all activities in HTML have activity_visual_value AND affordance set is complete for emitted hooks
  → authoritative
ELSE
  → hybrid
```

(Exact threshold for hybrid → authoritative is implementation QA; 38-5 recommends **per-page** author declaration: `visual_affordance_handover_mode: legacy | hybrid | authoritative` optional field in compose JSON.)

### 3.1 Legacy mode

| Aspect | Behaviour |
|--------|-----------|
| **Input** | HTML only (current v1.2 default) |
| **Discovery** | Step 1 infers from hooks + nearby DOM (existing prompt) |
| **Reject/defer** | Inferred only (no authored `rejection_reason`) |
| **Quality** | **Degraded but functional** — matches 38-1 audit (topic posters, over-generation risk) |
| **Output** | Existing JSON shape: `hooks_found`, `figures_inserted`, `image_queue`, `selection_notes` |

### 3.2 Hybrid mode

| Aspect | Behaviour |
|--------|-----------|
| **Input** | HTML + partial `visual_affordances[]` / partial `activities_visual_review[]` |
| **Precedence** | For matched `affordance_id` / `activity_id`+`visual_slot`: **JSON wins** |
| **Gaps** | Unmatched hooks: legacy inference **only if** `activity_visual_value` is not `none` for that activity |
| **Reject** | Authored `reject` always honoured; inference may not override to `generate` |
| **Quality** | **Mixed** — programme should trend toward authoritative exports |
| **Output** | Add `handover_mode: hybrid`, `rejected_affordances[]`, `deferred_affordances[]` where authored rows exist |

### 3.3 Authoritative mode

| Aspect | Behaviour |
|--------|-----------|
| **Input** | HTML + full 38-4 handover (`visual_affordance_schema_version`, `activities_visual_review[]`, `visual_affordances[]`) |
| **Discovery** | **Only** `visual_decision: generate` rows; hooks are slot locators, not opportunity inventors |
| **Reject** | **Prohibited** to queue or embed; **prohibited** to reclassify reject → generate via inference |
| **Defer** | **Prohibited** to queue or embed without explicit author override note in `selection_notes` |
| **Topic-only** | **Prohibited** — no opportunities from `data-visual-subject`, headings, or activity title alone |
| **Quality** | **Preferred** — 38-3 human-designer Pass bar |
| **Output** | Full ledgers + enriched `image_queue[]` entries |

---

## 4. Inference review (v1.2 Step 1 today)

Every item the current Step 1 prompt asks the model to infer or apply:

| Inference | Keep | Replace | Reason |
|-----------|:----:|:-------:|--------|
| Hook enumeration / slot location | ✓ | | Sprint 36 placement; JSON `visual_slot` locates, does not replace DOM |
| Pedagogical significance / visual worthiness | ✓ (legacy) | ✓ (auth) | **Replace** with `visual_decision` + `activity_visual_value` when JSON present |
| Pedagogical purpose (implicit roles list) | ✓ (legacy) | ✓ (auth) | **Replace** with `purpose` |
| Representation / diagram type choice | ✓ (legacy) | ✓ (auth) | **Replace** with `preferred_representation` + `canonical_discipline_note` |
| Anti-spoiler / preemption | ✓ (legacy) | ✓ (auth) | **Replace** with `anti_spoiler` + `spoiler_boundary` when authored |
| Claim boundaries (numeric/text) | ✓ (legacy) | ✓ (auth) | **Replace** with `must_show`, `must_not_show`, `allowed_claims`, `disallowed_claims`, `source_basis` |
| Duplicate / incremental value | ✓ (legacy) | ✓ (auth) | **Replace** when `reject` + `duplicate_existing_structure`; keep as safety net for unmatched hooks in hybrid |
| Topic / heading / `data-visual-subject` opportunity | ✓ (legacy fallback) | | **Prohibited** in authoritative mode |
| Discipline conventions (AD/AS, CI axes, etc.) | ✓ | | Augment from `canonical_discipline_note`; JSON does not remove discipline accuracy rule |
| `requires_exact_data_match` behaviour | | ✓ (auth) | **Replace** inference with explicit flag + `source_basis` |
| Placement when no hooks | ✓ | | Rare fallback; unchanged |
| Alt text quality | ✓ (legacy) | ✓ (auth) | **Replace** prose inference with derived alt from `caption_intent` + boundaries (§9) |
| Visible caption | ✓ | ✓ (auth) | **Replace** with `caption_intent` in authoritative mode |
| Figure CSS / responsive layout | ✓ | | Unchanged |
| VO id / filename assignment | ✓ | | Unchanged; map `affordance_id` → `data-visual-opportunity` |
| Image queue prompt composition | ✓ (legacy) | ✓ (auth) | **Replace** with structured brief from generate fields |
| Tier (essential/valuable) | ✓ (legacy) | ✓ (auth) | **Replace** with `tier` field |
| `representation_avoid` | | ✓ (auth) | **Replace** — must appear in queue `prompt` negatives |
| Defer decisions | ✓ (legacy) | ✓ (auth) | **Replace** with `visual_decision: defer` + `defer_reason` |
| Reject decisions | ✓ (legacy) | ✓ (auth) | **Replace** with `visual_decision: reject` + `rejection_reason` |
| Activity-level visual budget | ✓ (legacy) | ✓ (auth) | **Replace** with `activity_visual_value.decision` |

**Prohibited in authoritative mode (inference must not):**

- Create a figure for `visual_decision: reject` or `defer`
- Promote `reject` → `generate` because HTML “looks visual”
- Invent opportunities from title, topic, or `data-visual-subject` alone
- Invent numeric values, trends, or interval boundaries when `requires_exact_data_match: true`
- Override `disallowed_claims` or `must_not_show` for “better aesthetics”

---

## 5. Step 1 prompt patch specification (no topology change)

Add a block **after** `IMPORTANT ARCHITECTURE` and **before** `OUTPUT REQUIREMENTS`:

### 5.1 Handover detection

```text
OPTIONAL SECOND INPUT: visual_affordances handover JSON (page compose export).
If provided, detect handover_mode: legacy | hybrid | authoritative (see 38-5).
When visual_affordances[] is non-empty, JSON controls generate/defer/reject for matched records.
HTML locates slots; JSON controls pedagogy.
When JSON and HTML conflict on pedagogy, JSON wins.
```

### 5.2 Authoritative generate consumption

When `visual_decision: generate`, **do not infer** these — **consume**:

```yaml
purpose
preferred_representation
reasoning_supported
representation_avoid
allowed_claims
disallowed_claims
must_show
must_not_show
source_basis
requires_exact_data_match
```

Also consume for Step 1 embed + queue: `anti_spoiler`, `spoiler_boundary`, `learner_stage`, `visual_slot`, `affordance_id`, `tier`, `canonical_discipline_note`, `caption_intent`, `discipline_risk_level`.

### 5.3 Step 1 JSON response extensions (recommended)

Preserve existing keys; add:

```json
{
  "handover_mode": "authoritative",
  "rejected_affordances": [
    { "affordance_id": "...", "rejection_reason": "...", "rationale": "..." }
  ],
  "deferred_affordances": [
    { "affordance_id": "...", "defer_reason": "...", "rationale": "..." }
  ],
  "image_queue": [
    {
      "id": "VO1",
      "affordance_id": "va-a2-...",
      "filename": "VO1-example.png",
      "prompt": "...",
      "requires_exact_data_match": true
    }
  ]
}
```

### 5.4 Embed rules (unchanged DOM + Sprint 36)

- Preserve v1.1.1 **HARD RULES** (no figures inside `.util-activity-header`) — still valid for v1.2 Step 1 embed.
- Insert only for `generate`; match `visual_slot` to hook `data-visual-slot`.
- Optional: `data-affordance-id` on `<figure>`.

---

## 6. Authoritative affordance contract (`generate`)

When:

```yaml
visual_decision: generate
```

**Step 1 must:**

1. Match hook by `visual_slot` + `activity_id` (and `affordance_id` if passthrough on hook).
2. Insert figure only if slot exists and anti-spoiler + `learner_stage` permit placement in HTML order.
3. Build `image_queue` prompt from:

| Field | Step 1 use | Step 2 use |
|-------|------------|------------|
| `purpose` | Selection audit in `selection_notes` | Diagram intent |
| `preferred_representation` | — | Primary diagram family |
| `reasoning_supported` | `selection_notes` | Brief anchor |
| `representation_avoid` | — | Negative prompt list |
| `allowed_claims` / `disallowed_claims` | — | Whitelist / blacklist for labels in image |
| `must_show` / `must_not_show` | Alt + caption derivation (§9) | Hard checklist in image prompt |
| `source_basis` | — | **Only** source for numbers, labels, categories |
| `requires_exact_data_match` | Flag on queue item | **Mandatory** — no invented values/trends/boundaries |
| `canonical_discipline_note` | — | Structure and discipline form |
| `anti_spoiler` + `spoiler_boundary` | Placement timing + alt/caption | Image prompt omissions |
| `caption_intent` | Figcaption text | Alt derivation (§9) |
| `tier` | Priority if queue budget constrained | — |

**Do not infer** the nine fields in the table header when the generate record is present.

---

## 7. Defer contract

When:

```yaml
visual_decision: defer
```

| Rule | Detail |
|------|--------|
| **No generation** | No `<figure>`, no `image_queue` entry |
| **Preserve rationale** | Copy `rationale` to `deferred_affordances[]` |
| **Preserve defer_reason** | Copy `defer_reason` verbatim (`worked_example_sufficient_first` \| `model_row_sufficient_first`) |
| **No brief fields** | Do not require `purpose`, `preferred_representation`, `must_show` |
| **Hybrid** | Do not infer-generate for same `affordance_id` |
| **Author override** | If author explicitly requests defer override in chat, document in `selection_notes` only — not default |

---

## 8. Reject contract

When:

```yaml
visual_decision: reject
```

| Rule | Detail |
|------|--------|
| **No generation** | No figure, no queue entry |
| **No substitute opportunity** | Do not invent a different VO for the same pedagogical slot because HTML suggests a figure |
| **Preserve rejection_reason** | Copy enum to `rejected_affordances[]` — do not replace with generic “decorative” |
| **No reclassification** | Inference **must not** promote reject → generate or change `rejection_reason` |
| **Hook** | Leave `.util-visual-affordance` in place (v1.2 default) |

`rejection_reason` allow-list (38-2): `low_pedagogical_value`, `debrief_without_new_reasoning`, `duplicate_existing_structure`, `decorative_only`, `spoiler_risk`, `assessment_text_sufficient`, `insufficient_source_basis`.

**Activity gate:** When `activity_visual_value.decision` is `none`, expect **zero** `generate` for that `activity_id`; reject rows explain omissions.

---

## 9. Accessibility review

### 9.1 Current v1.2 behaviour

Step 1 mandates:

```html
<img src="images/VO1-example.png" alt="[meaningful alt text]">
<figcaption>[short visible caption]</figcaption>
```

There is **no** structured alt contract in the bundle. Anti-spoiler rules protect **sighted** learners from pre-task answer reveal; alt text can accidentally **spoil** if it repeats `must_not_show` content or classification keys.

### 9.2 Sprint 38 field support

| Need | Fields |
|------|--------|
| **Alt text** | Derive from `caption_intent`, constrained by `must_show`, `must_not_show`, `spoiler_boundary`, `allowed_claims` |
| **Screen-reader equivalence** | Same conceptual content as caption **without** hidden answers when `hide_answers` / `hide_classification_keys` / `hide_model_solution` |
| **Anti-spoiler** | `anti_spoiler`, `spoiler_stage`, `spoiler_boundary`, `learner_stage` |
| **Quantitative fidelity** | `requires_exact_data_match`, `source_basis` — alt must not state numbers not in `source_basis` |

### 9.3 `caption_intent` vs `alt_text_intent`

| Option | Verdict |
|--------|---------|
| **`caption_intent` only** | **Sufficient for Sprint 38 implementation** if Step 1 prompt requires: figcaption = `caption_intent`; alt = shortened non-spoiler equivalent of the same intent |
| **`alt_text_intent` new field** | **Defer** — add only if implementation QA shows captions are too long or spoil when shortened for alt |

**Prompt rule (recommended):**

```text
alt text: convey the same instructional support as caption_intent for non-sighted learners;
never include content listed in must_not_show or forbidden by spoiler_boundary;
never include numbers or trends not in source_basis when requires_exact_data_match is true.
```

### 9.4 Screen-reader parity question

> Can a learner using a screen reader receive the same conceptual support and anti-spoiler protection as a sighted learner?

| Mode | Answer |
|------|--------|
| **Legacy** | **Partial** — depends on model alt quality; spoiler protection inconsistent |
| **Hybrid** | **Improving** — authored boundaries apply where generate records exist |
| **Authoritative** | **Yes, when prompt patch applied** — alt/caption derived from same `caption_intent` + `spoiler_boundary` + claim fields; image prompt still must not depict spoilers (Step 2) |

**Caveat:** Full parity also requires generated PNGs to match brief (Step 2) — accessibility is a **two-step** contract in v1.2.

---

## 10. Quantitative review (`requires_exact_data_match: true`)

Applies in **Step 1** (queue flag) and **Step 2** (image prompt).

| Rule | Requirement |
|------|-------------|
| No invented values | Every number in image/alt/caption from `source_basis` only |
| No invented trends | No “rising”, “overlap”, “significant” unless in `source_basis` |
| No invented interval boundaries | Segment endpoints must match materials (38-3 CI A4) |
| No unsupported quantitative claims | `allowed_claims` whitelist; `disallowed_claims` includes invented statistics |
| Representation | Prefer `number_line_segments` or numeric `ordered_bar_strip` per 38-3 |
| `must_show` | Lists every numeric label that may appear |

**Prohibited:** Using discipline-convention examples (generic AD/AS) to invent data when `requires_exact_data_match: true`.

---

## 11. Step 2 prompt patch specification

Extend Step 2 **without** changing `one_image_per_step2_run`:

When queue item includes `affordance_id` / affordance payload (from Step 1):

```text
Use the queue entry prompt as authoritative.
If requires_exact_data_match is true, do not add numbers, trends, or interval boundaries not stated in the prompt's source_basis section.
Apply representation_avoid as hard negatives.
Do not depict must_not_show or disallowed_claims.
Honour spoiler_boundary omissions in the image.
```

**Deprecate:** “Illustrate the topic of {activity title}”.

---

## 12. LD → VEU author workflow (v1.2)

| Step | Author action |
|------|---------------|
| 1 | Complete compose with `activities_visual_review[]` + `visual_affordances[]` (38-4) |
| 2 | Export HTML via Utilities (hooks only on `generate` + `visual_slot` after renderer implementation) |
| 3 | Run VEU Step 1 with **HTML + JSON** attached |
| 4 | Verify `handover_mode`, `rejected_affordances`, `deferred_affordances`, `selection_notes` |
| 5 | Run Step 2 once per `image_queue` item |
| 6 | [Consumer checklist](../fixtures/probe-38-5-visual-enhancement-consumer-checklist.md) |

---

## 13. Alignment with Sprint 32 / 36 / 37

| Programme | v1.2 alignment |
|-----------|----------------|
| Sprint 32 | Tier vocabulary maps to `tier`; reject ledger replaces inference-only `decorative-rejected` |
| Sprint 36 | `visual_slot` + hooks unchanged; JSON authoritative for **whether** to embed |
| Sprint 37 | `learner_stage` + debrief policy → `reject` / `activity_visual_value: none` |

---

## 14. Implementation path (post–38-5)

| Layer | Work | Out of 38-5 scope? |
|-------|------|-------------------|
| **LD / compose** | Emit `visual_affordances[]` per 38-4 | Implementation sprint |
| **Renderer** | Optional `data-affordance-id` passthrough; hooks only for `generate` | Implementation — **no** placement rule changes |
| **VEU bundle** | Patch Step 1 + Step 2 `override_prompt_body` only | Next utility export patch (not redesign) |
| **PRISM tests** | Schema validation fixtures | Implementation |

**38-5 delivers:** prompt patch spec + consumer checklist + mode definitions — **no code** in this slice.

---

## 15. Final review

### 15.1 What parts of v1.2 remain unchanged?

- Two-step topology (`step_create_html_package` → `step_generate_image`)
- Hook candidacy (`hooks_are_candidates_not_obligations`)
- Anti-preemption charter in Step 1 (augmented, not removed)
- Figure HTML/CSS structure, VO id filenames, traditional image refs
- Step 2 one-image-per-run discipline
- Image model / provider (unchanged)
- Renderer hook emission rules (frozen until implementation adds JSON filter)

### 15.2 What inferences become optional?

In **authoritative** and matched **hybrid** rows: purpose, representation, worthiness, spoiler policy, claim boundaries, tier, duplicate rejection, and topic-based opportunity creation.

### 15.3 What inferences become prohibited?

In **authoritative** mode: reject→generate promotion, defer→generate without override, topic-only opportunities, claim invention under `requires_exact_data_match`, overriding `disallowed_claims` / authored `reject`.

### 15.4 How does legacy content continue to work?

HTML-only upload → **legacy mode** → existing Step 1 inference and Step 2 queue behaviour unchanged.

### 15.5 Is Sprint 38 ready to move into implementation?

**Yes.**

| Prerequisite | Status |
|--------------|--------|
| 38-1 audit | Complete |
| 38-2 taxonomy | Complete |
| 38-3 representation | Complete |
| 38-4 schema | Complete |
| 38-5 v1.2 alignment | **Complete** |
| Authoritative utility in repo | `utilities/visual-enhancement-utility/` |

**Next work (not 38-5):** LD compose + validation + renderer passthrough + VEU prompt export patch v1.2.1 (prompt-only bundle bump).

---

## 16. Deliverables checklist (38-5)

- [x] v1.2 flow documented (discovery + embed in Step 1)
- [x] Legacy / hybrid / authoritative modes defined
- [x] Inference table (keep / replace / prohibited)
- [x] Generate / defer / reject contracts mapped to v1.2 steps
- [x] Accessibility + alt derivation from `caption_intent`
- [x] Quantitative fidelity rules for Step 1 + Step 2
- [x] Step 1 + Step 2 prompt patch spec (no topology change)
- [x] Consumer checklist updated
- [x] Implementation path stated

---

## 17. Rejected scope creep (38-5)

- v1.1.1 three-step restoration as “live” model
- Extra workflow steps (analyse-only, embed-only)
- Image model swap
- Renderer-side figure generation
- `alt_text_intent` schema (deferred)
- Utility topology redesign

---

## 18. Regression

Prompt-only bundle patch: no PRISM test impact until compose/renderer changes. Target floor: **642+ pass / 0 fail**; `utility-visual-affordance-hooks.test.js` unchanged unless documented `data-affordance-id` passthrough only.
