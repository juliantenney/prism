# 38S Phase 2 — Page Rendering Audit (Read Only)

**Date:** 2026-06-08  
**Status:** **COMPLETE — audit only; no code changes**  
**Type:** Read-only learner-page rendering fidelity audit  
**Sprint:** [38S Episode Plan V1 implementation](../README.md)  
**Authority:** [38S-handover-pack.md](38S-handover-pack.md)  
**Predecessors:** [38S Phase 2C Page responsibility audit](38S-phase-2c-page-responsibility-audit.md) · [38M-4 A3 sequencing fidelity](../../2026-06-05-sprint-38m-page-composition-fidelity/observations/38M-4-a3-analyse-sequencing-fidelity.md) · [38P role render sequencing](../../../lib/page-role-render-sequencing.js)

---

## Executive summary

**Evidence:** Inflation learner Page JSON (5 activities LO1–LO5, `visual_affordance_schema_version: "38.4"`, `visual_affordances: []`) and rendered HTML export **`page (79).html`** (confirmed newer than `page (78).html` — 16:55:38 vs 16:49:23 on 2026-06-08).

**Verdict:** GAM→Page **body preservation is largely working** — learner-facing defects are **renderer and compose-metadata issues**, not upstream content collapse. Seven confirmed presentation defects; two are **content/compose gaps** (preambles, empty VA array); five are **renderer pipeline bugs** fixable without touching Episode Plan, DLA, GAM packs, or population contract.

| # | Defect | Severity | Layer |
|---|--------|----------|-------|
| 1 | Checklist before exposition / worked example / sample output | **High** | Renderer |
| 2 | Literal `&lt;strong&gt;` in list items | **High** | Renderer (+ upstream content) |
| 3 | Material IDs (M1, M4, …) visible as headings | **Medium** | Renderer |
| 4 | No activity preamble / PEL framing blocks | **Medium** | Compose (content gap) |
| 5 | PEL CSS present, no populated cues | **Low** | Compose (follows #4) |
| 6 | Visual affordance slots hidden; VA metadata sections leak to body | **Low** | Renderer + compose |
| 7 | LO3 `analysis_table` (M9) missing from render | **High** | Renderer |
| 8 | LO5 material order wrong (checklist before table/template) | **High** | Renderer (same root as #1) |

---

## Evidence confirmation

### Render artefact used

- **Primary:** `c:\Users\cczjrt\Downloads\page (79).html`
- **Secondary check:** `page (78).html` — same defect signatures; superseded by (79)

### JSON shape (from supplied Page capture)

- Activities: `LO1`–`LO5` under `learning_activities`
- Materials: **type-nested buckets** with **material_id sub-keys** (e.g. `text.M1`, `checklist.M4`, `worked_example.M2`)
- No `activity_preamble`, `study_orientation`, or PEL cognition-orientation fields on activities
- Page root: `visual_affordances: []`; additional `sections[]` entries for VA schema/review metadata

### HTML observations (LO1 exemplar)

1. **Order:** `<div class="util-checklist-block">` (M4) appears **before** text (M1), worked example (M2), sample output (M3)
2. **Escaping:** Key Distinction list items contain literal `&lt;strong&gt;Inflation&lt;/strong&gt;`
3. **IDs:** Bare `<h5>M1</h5>`, `<h5>M4</h5>` headings visible
4. **Framing:** No `.util-activity-framing` / `.util-activity-preamble` blocks (only `learner_task` “What to do”)
5. **LO3:** Output promises “Completed analysis table”; HTML ends after modelling note (M8) — **no M9 table**
6. **LO5:** Order scenario → checklist (M17) → template (M16) → decision table (M15) — inverted vs instructional sequence
7. **Metadata leak:** Learner body includes sections “Visual Affordance Schema Version” and “Activities Visual Review”

---

## Renderer responsibility map

| Concern | Primary function / module | Lines (app.js unless noted) |
|---------|---------------------------|----------------------------|
| Activity assembly | `renderLearningActivitiesBlocks` → per-row pipeline | ~32120–32195 |
| Preamble / PEL cues | `renderActivityFramingForActivity` | ~29547–29640 |
| Material ordering | `renderMaterialsForActivity` | ~29776–32020 |
| Role-precedence plan | `lib/page-role-render-sequencing.js` → `buildRolePrecedenceRenderPlan` | 38-P lib |
| Declared order | `activityRow.materials_order` branch | ~31480–31698 |
| **Legacy early paths** | checklist / template / worksheet before `Object.keys` loop | ~31789–31900 |
| Nested material_id headings | `renderMaterialValue` object nesting | ~31378–31430 |
| Inline bold / escape | `utilityRenderMarkdownInline` | ~26721–26764 |
| VA slot hooks | `utilityMaybeRenderVisualAffordanceHook` + CSS | ~27815, ~34562 |
| Page section export | `utilityRenderPageSections` + `renderSectionKey` | ~28403+, ~35874+ |
| VA metadata filter | `metadataKeys` (only 3 keys) | ~35778–35783 |

---

## Root-cause analysis

### 1 & 8 — Material ordering inverted (all activities)

**Symptom:** Verification checklist renders first; LO5 checklist before decision table and template.

**Mechanism:** `renderMaterialsForActivity` uses a **two-tier pipeline**:

1. **Authoritative paths (when present):**
   - `material_role_index` → `buildRolePrecedenceRenderPlan` (38-P) — sorts by `sequence_weight` per archetype
   - `materials_order[]` → `renderOrderedMaterialKeyBlock` per key (38-M A3 pattern)

2. **Legacy fallback paths (always run for unrendered keys):**
   - Hardcoded early renders: **checklist** (~31789), **template** (~31836), **worksheet/analysis_table** (~31849)
   - Then `Object.keys(materials).forEach` for remaining buckets (~31907)

On the Inflation page, materials use **type buckets** (`checklist`, `text`, `worked_example`, …). When **`materials_order` is absent** and **`material_role_index` is absent or not applied** to this capture, the legacy **checklist fast-path runs before** the generic loop that renders `text`, `worked_example`, and `sample_output`.

LO5 matches the legacy pipeline order: **scenario → checklist → template → table**, which inverts evaluate-arcade instructional order (scenario → decision table → template → checklist).

**Precedent:** 38M-4 fixed the same class of bug for A3 Analyse via compose-time `materials_order` + ordered render branch. This Inflation capture uses LO ids and episode-plan material_id nesting — **sequencing hooks were not applied** to these rows.

**Responsibility:** **Renderer** (legacy path precedence) + **compose gap** (no `materials_order` / `material_role_index` on this page).

---

### 2 — Literal `&lt;strong&gt;` in lists

**Symptom:** LO1 Key Distinction / Examples; LO4 Mechanism bullets show escaped HTML entities.

**Mechanism:** `utilityRenderMarkdownInline` always calls `utilityEscapeHtml` first, then applies `**bold**` markdown transforms. Content in Page JSON uses **literal HTML** (`<strong>…</strong>`) inside list strings. After escape, tags become visible entities; markdown `**` in the same items still works (mixed rendering).

```26721:26744:c:\xampp\htdocs\prism\app.js
  function utilityRenderMarkdownInline(text) {
    // ...
    var escaped = utilityEscapeHtml(raw);
    escaped = escaped.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
```

**Responsibility:** **Renderer** (no safe HTML-or-markdown dual path for list content) + **upstream compose** (Page/GAM emitted HTML tags instead of markdown).

---

### 3 — Material ID headings (M1, M4, …)

**Symptom:** Learners see `<h5>M4</h5>`, `<h5>M1</h5>` above real subheadings.

**Mechanism:** When materials are nested as `materials[type][material_id]`, `renderMaterialValue` iterates sub-keys and emits each as an `<h5>` heading when the nested value has no `heading`/`title` field:

```31415:31423:c:\xampp\htdocs\prism\app.js
                var headingText = nestedHeading || prettyMaterialHeading(k);
                // ...
                var heading = "<h5>" + utilityEscapeHtml(String(headingText)) + "</h5>";
```

Material_id keys (`M1`, `M4`, …) are **internal GAM identifiers**, not learner headings.

**Responsibility:** **Renderer** — should suppress `^M\d+(_\d+)*$` (and similar plan ids) as visible headings.

---

### 4 & 5 — Missing preamble / PEL cues

**Symptom:** No `.util-activity-framing`, `.util-pel-orientation-cue`, or `.util-pel-reasoning-cue` content. CSS is present in export stylesheet.

**Mechanism:** `renderActivityFramingForActivity` only renders when activity row fields exist (`activity_preamble`, `study_orientation`, `reasoning_orientation`, etc.). Supplied Page JSON **does not include** these fields on LO1–LO5.

**Responsibility:** **Compose / Page generation gap** — not a renderer regression. Renderer is **ready**; content was not populated upstream.

---

### 6 — Visual affordances hidden; metadata sections visible

**Symptom A:** Empty `<div class="util-visual-affordance" hidden>` placeholders in every activity (expected when `visual_affordances: []`).

**Symptom B:** Learner-visible sections “Visual Affordance Schema Version” and “Activities Visual Review”.

**Mechanism A:** Export CSS deliberately hides VA containers until assets exist:

```34562:34562:c:\xampp\htdocs\prism\app.js
      ".util-visual-affordance{display:none!important}",
```

**Mechanism B:** Page JSON includes VA fields as **`sections[]` entries** (or top-level keys). `utilityIsPageMetadataSectionEntry` only recognises `metadata` / `production_metadata` section ids. `metadataKeys` whitelist covers only `source_artefacts`, `constraints_applied`, `generation_notes` — **not** `visual_affordance_schema_version` or `activities_visual_review`. Those render as normal `<section><h2>…</h2>` body blocks.

**Responsibility:** **Renderer** (metadata classification gap) + **compose** (VA fields placed in learner `sections[]` instead of collapsible meta / root-only).

---

### 7 — LO3 missing analysis_table (M9)

**Symptom:** Activity output cites “Completed analysis table”; HTML has checklist (M10) + modelling note (M8) only.

**Mechanism (dual):**

1. `analysis_table` is in the **explicit skip list** for the `Object.keys(materials)` fallback (~31982) — it must render via role plan, `materials_order`, or `resolveWorksheetTableSource` (~31849).

2. `utilityUnwrapWorksheetTablePayload` unwraps `content`, `rows`, `table`, etc. on a **single object** — not **material_id-keyed maps** like `{ M9: { table: … } }`. Unwrap returns empty → worksheet path emits nothing.

**Responsibility:** **Renderer** — nested material_id table shape not supported on worksheet unwrap path.

---

## KEEP / FIX / DEFER

| Item | Action | Rationale |
|------|--------|-----------|
| GAM / DLA / Episode Plan packs & population | **KEEP** | Defects reproduced with preserved bodies |
| `renderActivityFramingForActivity` / PEL CSS | **KEEP** | Works when fields present |
| Role registry + `material_role_index` sequencing (38-P) | **KEEP** | Correct ordering when index + compose applied |
| `materials_order` compose (38-M) | **KEEP** | Proven A3 fix pattern |
| Legacy checklist/template/table early paths | **FIX** | Gate behind authoritative order or move after exposition |
| `utilityRenderMarkdownInline` HTML-in-markdown | **FIX** | Decode safe inline tags or normalise at compose |
| Material_id `<h5>` emission | **FIX** | Suppress internal ids |
| `utilityUnwrapWorksheetTablePayload` nested M-keys | **FIX** | Descend one level for `M*` wrappers |
| VA root fields in `sections[]` | **FIX** | Route to meta/details, not learner body |
| `activity_preamble` / PEL fields on Page JSON | **FIX (compose)** | Separate sprint slice on Page prompt/validation |
| Visual affordance `display:none` when empty | **DEFER** | Intentional until VA images ship |
| Full evaluate-arcade `materials_order` from episode plan | **FIX (compose)** | Populate `materials_order` for all LO activities at merge |

---

## Smallest safe implementation plan (post-audit)

**Phase A — Renderer-only (no prompt changes)**

1. **Ordering guard:** In `renderMaterialsForActivity`, when `material_role_index` or `materials_order` is present, **skip legacy early checklist/template/worksheet paths** for keys already governed by authoritative plan. When neither is present, **relocate checklist render** to after exposition + worked example families (match 38-P default weights for `understand` / `evaluate`).

2. **Material_id headings:** In nested `renderMaterialValue`, treat keys matching `/^M\d+/` as non-heading (render body only).

3. **Inline HTML bold:** Before `utilityEscapeHtml` in `utilityRenderMarkdownInline`, normalise safe `<strong>…</strong>` / `<em>…</em>` to markdown equivalents (narrow allowlist).

4. **Table unwrap:** Extend `utilityUnwrapWorksheetTablePayload` (or caller) to pick the first material_id child when parent has only `M*` keys.

5. **VA metadata:** Add `visual_affordance_schema_version`, `activities_visual_review`, `visual_affordances` to page metadata suppression (or `utilityIsPageMetadataSectionEntry` patterns).

**Phase B — Compose (Page merge / episode plan)**

6. Ensure `applyGamMaterialsToComposedPage` + role index run on Inflation LO workflow captures.

7. Populate `materials_order[]` from episode plan `required_materials` order for **all** activities (generalise 38-M A3 helper).

8. Enforce `activity_preamble` minimum on learner `page_profile` via existing validation (`pedagogicCognitionFieldHasValue` paths in app.js ~10087+).

**Tests to add (mirror 38M-4 / 38P patterns)**

- Render order: LO1 HTML — text heading before checklist block
- No `&lt;strong&gt;` literals when input uses `<strong>` in list items
- No visible `M1` h5 in output
- LO3 — analysis_table table present
- VA schema section not in primary body HTML

---

## Out of scope (per handover)

- Episode Plan V1 schema or capture logic
- DLA / GAM prompt edits
- Population contract / workflow chaining
- Enabling visual affordance images (CSS unhide)

---

## References

- Render evidence: `page (79).html` (user Downloads)
- Ordering precedent: [38M-4 A3 sequencing](../../2026-06-05-sprint-38m-page-composition-fidelity/observations/38M-4-a3-analyse-sequencing-fidelity.md)
- Role sequence weights: `lib/page-role-registry.js` (`verification_checklist` weight 30–60 depending on archetype)
- Compose role index: `lib/page-gam-materials-preserve.js` (`buildMaterialRoleIndex`)
