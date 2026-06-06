# 38P-1 — Role authority architecture

**Date:** 2026-06-05  
**Status:** **COMPLETE** (architecture only)  
**Type:** Design — no implementation  
**Predecessor:** [38O-4 preservation recommendation](../../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-4-preservation-options-recommendation.md)  
**Authority:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)

---

## Executive summary

This document converts **F1 — Registry-led hybrid** (38O-4) into an implementation architecture for Sprint 38-P.

| Decision | Recommendation |
|----------|----------------|
| **Source of role truth** | GAM `type` + `purpose` → role registry lookup |
| **Registry module** | New `lib/page-role-registry.js` (38P-2); extends, does not replace, `pageFieldKeyForMaterial` |
| **Page metadata** | **Option B — parallel `material_role_index`** on activity row (backward-compatible with string `materials{}`) |
| **Supersession policy** | **Mark and suppress** — retain stub keys with `authority: superseded`, `renderable: false`; do not delete bodies |
| **Render precedence** | Generalise 38N A3 pattern — `role_sequence` + `ROLE_RENDER_ALIAS_GROUPS` + authoritative instance selection |
| **Validator module** | New `lib/page-role-fidelity.js` — `validate38PRoleFidelity()` → `roleOk`; additive to `proofOk` |
| **38M/38N preservation** | Body merge and ratio gates unchanged; supersession never removes GAM body from canonical key |

**Verdict:** Architecture is complete for 38P-2 through 38P-5 implementation. Primary proof target remains A4 capstone on inflation workload.

---

## Design goals

| ID | Goal | Constraint |
|----|------|------------|
| **DG-1** | One authoritative learner-facing instance per `(activity, role_family)` | RF-1 |
| **DG-2** | Authoritative instance precedes any superseded duplicate in render | RF-2 |
| **DG-3** | Stable identity GAM → Page → Render via registry | RF-3 |
| **DG-4** | Pedagogical function markers on authoritative body only | RF-4 |
| **DG-5** | No role inversion on authoritative consolidation body | RF-5 |
| **DG-6** | Capstone episode sequence alignment (38I-4 reference) | RF-6 |
| **DG-7** | Body fidelity on authoritative instance ≥ 38M tier minimum | RF-7 |
| **DG-8** | Compose vs GAM authority auditable on raw and merged page | RF-8 |
| **DG-9** | `proofOk` remains true — no 38M/38N regression | Charter hold |
| **DG-10** | Backward-compatible page JSON — legacy key→string `materials{}` preserved | Migration |

### Non-goals (this architecture)

- Compose LLM prompt redesign (out of primary scope; RF-8 flags raw-only failures)
- Schema/ACM/IFP/DLA changes
- Elimination of all alias keys from JSON (aliases may persist as superseded audit entries)
- Instructional depth scoring beyond role survival

---

## Role authority model

### Definition

**Role authority** is the right to define which page material instance represents a given instructional role family for a learner. It is distinct from **body authority** (38M), which governs whether the GAM substantive body is present at contract ratio on a canonical key.

### End-to-end flow

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ GAM material                                                                  │
│   type + purpose + material_id + body                                         │
│   SOURCE OF TRUTH for pedagogical intent                                      │
└───────────────────────────────┬──────────────────────────────────────────────┘
                                │ resolveRoleFromGam(mat)
                                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ ROLE REGISTRY (lib/page-role-registry.js)                                     │
│   role_family, canonical_key, heading, sequence_weight, allowed_aliases       │
└───────────────────────────────┬──────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐     ┌─────────────────────┐   ┌─────────────────────┐
│ PAGE RAW      │     │ MERGE (38M + 38P)   │   │ RENDER (38N + 38P)  │
│ compose keys  │     │ GAM body injection  │   │ role_sequence loop  │
│ + role_index  │     │ + supersession tags │   │ + alias suppression │
│ authority:    │     │ authority: gam on   │   │ one block / role    │
│   compose     │     │   canonical;          │   │ registry heading    │
│               │     │   superseded on stubs │   │                     │
└───────────────┘     └─────────────────────┘   └─────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ PROOF                                                                         │
│   proofOk  ← validate38MPageFidelity (unchanged)                              │
│   roleOk   ← validate38PRoleFidelity (new, additive)                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Authority ownership

| Concern | Authoritative owner | Notes |
|---------|---------------------|-------|
| **Pedagogical intent** | GAM `type` + `purpose` | Unchanged upstream |
| **Role family identity** | Role registry | Single vocabulary across pipeline |
| **Canonical page key** | Registry `canonical_key` (= existing `pageFieldKeyForMaterial` output for GAM materials) | Aligns with 38M merge contract |
| **Body content (substance)** | GAM body on canonical key | 38M `shouldMergeGamBody` / ratio gates |
| **Role instance selection** | `material_role_index[].authority` | `gam` > `compose` > `superseded` |
| **Learner heading** | Registry `heading` (fallback: `prettyMaterialHeading(key)`) | Fixes RN/AP misleading labels |
| **Render order** | Registry `sequence_weight` per activity archetype | Generalises A3 `materials_order` |

### Authority transitions

```text
COMPOSE (page raw)
  Every material key present in compose output:
    authority := "compose"
    source    := "compose"
    canonical := false  (until registry match confirms otherwise)

MERGE (applyGamMaterialsToComposedPage + 38P supersession)
  For each GAM material mat:
    canonical_key := registry.canonical_key(mat)
    Inject GAM body on canonical_key (38M — unchanged)
    material_role_index[canonical_key] := {
      role_family, authority: "gam", source: "gam", canonical: true, renderable: true
    }
    For each allowed_alias of role_family where alias ≠ canonical_key AND alias exists in materials:
      material_role_index[alias] := {
        role_family, authority: "superseded", source: "compose", canonical: false, renderable: false
      }
      (body text retained in materials{} for RF-8 audit — not deleted)

RENDER
  For each role_family in activity role_sequence:
    Select entry where authority ∈ {"gam","compose"} AND renderable ≠ false
    Prefer highest authority; tie-break by body length vs stub threshold
    Emit one block; mark alias group consumed (38N pattern)
```

### Authority persistence rules

| Rule | Description |
|------|-------------|
| **P-1** | `material_role_index` persists on activity row through raw → merged → render |
| **P-2** | Merge always **writes** GAM authority entries; never overwrites with compose |
| **P-3** | Supersession **never deletes** `materials[key]` body strings |
| **P-4** | `pageMaterialText()` and 38M validators continue resolving body via alias groups on **canonical key** — unchanged read path |
| **P-5** | Activity-row roles (`scaffold_hint`, `learner_task`, etc.) live in separate fields; indexed in registry with `storage: "activity_row"` |
| **P-6** | Raw-only pages (merge skipped): all entries remain `authority: compose`; RF-8 fails; roleOk false |

---

## Role registry schema

### Module location

**New file:** `lib/page-role-registry.js`  
**Relationship:** Consumed by merge (`page-gam-materials-preserve.js`), render sequencing (`page-a3-materials-sequencing.js` → generalised), validators (`page-role-fidelity.js`).

Existing `pageFieldKeyForMaterial` becomes a **delegate** to registry `canonical_key` resolution — registry is authoritative; function preserved for 38M backward compatibility.

### Registry entry schema

```javascript
{
  role_family: string,           // stable identifier, e.g. "worked_judgement_support"
  gam_match: {                   // GAM assignment rule
    type: string | string[],     // GAM type(s)
    purpose_pattern: RegExp | null  // disambiguation; null = type-only
  },
  canonical_key: string,         // merge contract key (= pageFieldKeyForMaterial output)
  heading: string,               // learner-facing h4 label
  sequence_weight: {             // per activity archetype
    evaluate: number,
    analyse: number,
    apply: number,
    understand: number,
    default: number
  },
  allowed_aliases: string[],     // compose/legacy keys mapping to this role_family
  authority_rules: {
    gam_wins_over: ["compose"],  // supersession targets
    body_markers: string[],      // RF-4 semantic marker IDs (extends 38N)
    inversion_markers: string[]  // RF-5 anti-patterns, e.g. learner-write on consolidation
  },
  storage: "materials" | "activity_row",  // where body lives
  activity_row_field: string | null       // e.g. "scaffold_hint_sequence"
}
```

### Registry version

```javascript
ROLE_REGISTRY_VERSION = "38P-1"
```

Stored in page metadata: `metadata.role_registry_version` after merge.

---

### Major role family entries

Legend: **SW** = sequence_weight.evaluate (A4 archetype). A1–A3 use respective archetype columns.

#### Material-stored roles

| role_family | gam_match | canonical_key | heading | SW (eval) | allowed_aliases | authority_rules |
|-------------|-----------|---------------|---------|-----------|-----------------|-----------------|
| **explanatory_guidance** | `text` / `concept\|exposition\|elucidation\|criteria` | `criteria_exposition_evaluate` or `concept_exposition` | Criteria exposition *(context-specific)* | 20 | `criteria_text`, `concept_text`, `concept_exposition`, `text` | markers: criteria dimensions; gam_wins compose stubs |
| **worked_example** | `worked_example` / `worked thinking` (not calc/analytic/judgement) | `worked_example` | Worked example | 10 | `worked_example` | markers: stepwise reasoning |
| **worked_calculation** | `worked_example` / `calculation\|CPI\|numeric` | `worked_example` | Worked calculation | 15 | `worked_example` | markers: calculation steps |
| **worked_analytic_pass** | `worked_example` / `analytic pass` | `worked_analytic_pass` | Worked analytic pass | 10 | `worked_example`, `worked_analytic_pass` | markers: Distribution Lens, Stepwise Analysis |
| **model_answer** | `sample_output` / `model answer` (non-numeric) | `sample_output` | Sample output | 12 | `sample_output` | — |
| **model_calculation** | `sample_output` / `calculation\|model calc` | `sample_output` | Sample output | 12 | `sample_output` | — |
| **scenario** | `scenario` / * | `scenario_maya_households` or `scenario_maya_strategy_menu` | Scenario | 10 | `scenario`, `scenarios`, `scenario_maya_households`, `scenario_maya_strategy_menu` | purpose disambiguates menu vs households |
| **practice_table** | `classification_table\|analysis_table\|comparison_table\|impact_table` | type-specific | Worksheet | 25 | `worksheet`, `classification_table`, `analysis_table`, `practice_table`, `table` | — |
| **verification_checklist** | `checklist` / `verification\|evaluate` | `checklist_evaluate` | Verification checklist | 60 | `checklist`, `checklist_evaluate`, `verification_checklist`, `evaluation_checklist` | single family; aliases superseded |
| **worked_judgement_support** | `modelling_note` / `worked judgement` | `worked_judgement_weak_strong` | Worked judgement (weak vs strong) | 30 | `modelling_note`, `worked_judgement_weak_strong`, `worked_example` | markers: weak_worked_judgement, strong_worked_judgement |
| **guided_judgement_table** | `decision_table` / `guided judgement` | `guided_judgement_table` | Guided judgement table | 40 | `decision_table`, `guided_judgement_table` | markers: guided_table_exemplar |
| **independent_template** | `template` / `independent` | `independent_judgement_template` | Independent judgement template | 50 | `independent_judgement_template`, `template` | — |
| **transfer_prompt** | `transfer_prompt` / * | `transfer_prompt_evaluate` | Transfer prompt | 80 | `transfer_prompt`, `transfer_prompt_evaluate` | markers: transfer_word_band |
| **consolidation_summary** | `consolidation_summary` / * | `consolidation_summary` | Consolidation summary | 70 | `consolidation_summary` | inversion_markers: learner-write prompt patterns |

*Purpose-specific canonical_key selection for `explanatory_guidance` and `scenario` follows existing `pageFieldKeyForMaterial` branches — registry documents both variants with purpose_pattern disambiguation.*

#### Activity-row roles

| role_family | storage | activity_row_field | heading | SW (eval) | Notes |
|-------------|---------|-------------------|---------|-----------|-------|
| **learner_task** | activity_row | `learner_task` | What to do | 5 | Rendered before materials; not in `materials{}` |
| **scaffold_hint** | activity_row | `scaffold_hint_sequence` | Scaffold hints | 55 | Between template and checklist in A4 flow |
| **reasoning_orientation** | activity_row | `reasoning_orientation` | Reasoning orientation | 8 | Optional one-liner |
| **self_explanation_prompt** | activity_row | `self_explanation_prompt` | Self-explanation | 65 | Post-checklist reflect bridge |

Activity-row roles participate in **RF-6 sequence alignment** but not **RF-1 uniqueness** (no duplicate issue on materials map).

---

### A4 evaluate sequence weights (38I-4 alignment)

Ordered by `sequence_weight.evaluate`:

| Order | role_family | 38I-4 step | Registry SW |
|-------|-------------|------------|-------------|
| 1 | learner_task | framing | 5 |
| 2 | scenario | Step 1 — perspectives | 10 |
| 3 | reasoning_orientation | lenses framing | 8 |
| 4 | explanatory_guidance | Step 2 — criteria | 20 |
| 5 | worked_judgement_support | Step 3 — worked example | 30 |
| 6 | guided_judgement_table | Step 4 — guided judgement | 40 |
| 7 | independent_template | Step 5 — independent memo | 50 |
| 8 | scaffold_hint | hints during judgement | 55 |
| 9 | verification_checklist | Step 6 — verify | 60 |
| 10 | self_explanation_prompt | Step 7 — reflect bridge | 65 |
| 11 | consolidation_summary | session closure | 70 |
| 12 | transfer_prompt | Step 8 — transfer | 80 |

Render emits material roles in SW order; activity-row roles at their SW positions interleaved with existing activity-row render paths in `app.js`.

---

## Page metadata model

### Alternatives evaluated

#### Option A — Inline metadata on material objects

```json
"materials": {
  "worked_judgement_weak_strong": {
    "body": "…1082 chars…",
    "role_family": "worked_judgement_support",
    "authority": "gam",
    "canonical": true,
    "source": "gam"
  }
}
```

| Strengths | Weaknesses |
|-----------|------------|
| Co-located body + role | **Breaking change** — compose LLM emits `key: string` today |
| Single structure to iterate | Requires compose output migration or normalisation pass |
| | Breaks `pageMaterialText()` string assumptions across codebase |
| | High regression risk to 38M/38N validators |

#### Option B — Parallel role metadata structure (recommended)

```json
"materials": {
  "modelling_note": "…273 char stub…",
  "worked_judgement_weak_strong": "…1082 chars…",
  "worked_example": "…1082 chars…"
},
"material_role_index": {
  "modelling_note": {
    "role_family": "worked_judgement_support",
    "authority": "superseded",
    "canonical": false,
    "source": "compose",
    "renderable": false,
    "superseded_by": "worked_judgement_weak_strong"
  },
  "worked_judgement_weak_strong": {
    "role_family": "worked_judgement_support",
    "authority": "gam",
    "canonical": true,
    "source": "gam",
    "renderable": true,
    "material_id": "M15"
  },
  "worked_example": {
    "role_family": "worked_judgement_support",
    "authority": "superseded",
    "canonical": false,
    "source": "merge_alias",
    "renderable": false,
    "superseded_by": "worked_judgement_weak_strong"
  }
}
```

| Strengths | Weaknesses |
|-----------|------------|
| **Backward compatible** — `materials{}` stays string map | Two structures to keep in sync |
| Compose output unchanged | Index must be populated at merge (and optionally inferred at compose) |
| 38M `pageMaterialText()` unchanged | Slightly more JSON surface |
| RF-8 audit: stubs visible alongside tags | |
| Incremental adoption — missing index = legacy mode | |

### Recommendation: **Option B — parallel `material_role_index`**

**Rationale:** Minimises 38M/38N regression risk. Merge phase owns index population (38P-3). Render and validators read index; body resolution unchanged.

### Metadata field specification

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `role_family` | string | yes | Registry role family ID |
| `authority` | `"gam"` \| `"compose"` \| `"superseded"` | yes | Instance authority rank |
| `canonical` | boolean | yes | true iff this key is registry canonical_key for role_family |
| `source` | `"gam"` \| `"compose"` \| `"merge_alias"` | yes | Provenance for RF-8 |
| `renderable` | boolean | default true | false = suppress at render |
| `superseded_by` | string \| null | when superseded | Canonical key that wins |
| `material_id` | string \| null | when gam | GAM material_id tie |

### Activity-level fields (new)

| Field | Purpose |
|-------|---------|
| `role_sequence` | Ordered `role_family[]` for render — derived from registry SW for activity archetype; generalises `materials_order` |
| `material_role_index` | Per-key metadata (Option B) |
| `activity_archetype` | `"evaluate"` \| `"analyse"` \| `"apply"` \| `"understand"` — selects SW column; inferred from activity_id/title/materials signature |

**Compatibility:** `materials_order` (A3) remains supported. When `role_sequence` present, it takes precedence; `materials_order` treated as legacy alias of role_sequence for A3.

---

## Merge supersession architecture

### Principle

**38M body injection is unchanged.** Supersession is a **metadata and visibility** policy applied after GAM body merge — it does not alter `shouldMergeGamBody`, ratio gates, or `pageMaterialText()` alias resolution.

### When GAM wins body authority

Trigger: merge applies GAM body to `canonical_key` for GAM material `mat`.

```text
1. RESOLVE role_family := registry.resolveRoleFromGam(mat)
2. INJECT body (38M — existing mergeMaterialsFromGamList path)
3. TAG canonical:
     material_role_index[canonical_key] := { authority: "gam", canonical: true, renderable: true, … }
4. SUPERSEDE aliases:
     For each alias in registry.allowed_aliases where alias ≠ canonical_key:
       If materials[alias] exists (any body length):
         material_role_index[alias] := { authority: "superseded", renderable: false, superseded_by: canonical_key }
         (materials[alias] body UNCHANGED — not deleted)
5. SUPERSEDE compose-only keys for same role_family not in allowed_aliases:
     Infer via registry reverse lookup — any key in material_role_index or materials{} 
     mapped to same role_family with authority "compose" → superseded
6. APPLY renderer alias copy (applyRendererCanonicalAliases) ONLY for non-superseded keys
     OR: post-process alias copies to mark authority "superseded" if canonical already tagged gam
```

### What happens to compose stubs

| Aspect | Policy |
|--------|--------|
| **Body text** | Retained in `materials[stub_key]` |
| **Authority** | `superseded` |
| **Renderable** | `false` |
| **38M body read** | `pageMaterialText(canonical_key)` still resolves via alias group to best body — unchanged |
| **38M ratio gate** | Evaluated on canonical contract key — unchanged |

### What happens to aliases

| Alias type | Policy |
|------------|--------|
| **Merge-generated copies** (`applyRendererCanonicalAliases`) | Tag `source: "merge_alias"`, `authority: superseded` when canonical has `gam` |
| **Compose synonyms** (`modelling_note` vs `worked_judgement_weak_strong`) | Supersede compose stub; canonical gets GAM |
| **38N alias groups** | Preserved for body resolution; render uses alias group **suppression** when canonical rendered |

### What remains visible to learner

Exactly **one block per role_family** — the entry with highest authority where `renderable !== false`, using registry heading.

### What becomes superseded

All other keys mapping to the same `role_family` in `material_role_index` with lower authority.

### A4 worked example (M15)

| Key | Pre-38P | Post-38P |
|-----|---------|----------|
| `modelling_note` (273) | Renders first as "Modelling Note" | `superseded`, not rendered |
| `worked_judgement_weak_strong` (1082) | Renders second | `gam`, canonical, renders with registry heading |
| `worked_example` (1082) | Renders third (alias copy) | `superseded`, not rendered |

---

## Render role-precedence architecture

### Design intent

Generalise the **38N A3 success pattern**:

1. Declared order loop (`materials_order`)  
2. `renderOrderedMaterialKeyBlock` per key  
3. `markMaterialAliasGroupRendered` to suppress duplicates  
4. Legacy path suppression when ordered key already rendered  

Extend to **role-family-aware** ordering for all activity archetypes, not only A3.

### Core components (38P-4)

| Component | Location | Purpose |
|-----------|----------|---------|
| `ROLE_SEQUENCE_BY_ARCHETYPE` | `page-role-registry.js` | Default role_family order per archetype |
| `ROLE_RENDER_ALIAS_GROUPS` | `page-role-registry.js` | Generalises `MATERIAL_RENDER_ALIAS_GROUPS` |
| `resolveAuthoritativeMaterialKey(activity, role_family)` | `page-role-registry.js` | Select canonical render key from index + materials |
| `applyRoleSequencingToComposedPage(page)` | `page-a3-materials-sequencing.js` (renamed scope) | Set `role_sequence` on activity rows |
| `renderRoleOrderedMaterialBlocks()` | `app.js` | New loop parallel to A3 ordered path |

### Role ordering algorithm

```text
INPUT: activityRow, materials, material_role_index, role_sequence[]

FOR EACH role_family IN role_sequence (ascending sequence_weight):
  IF storage == "activity_row":
    Render via existing activity-row path (scaffold, learner_task, etc.)
    CONTINUE

  auth_key := resolveAuthoritativeMaterialKey(role_family)
  IF auth_key is null OR index[auth_key].renderable == false: CONTINUE
  IF role_family already rendered: CONTINUE

  heading := registry.heading(role_family) OR prettyMaterialHeading(auth_key)
  body    := materials[auth_key]
  EMIT h4(heading) + body
  markRoleAliasGroupRendered(role_family)  // all allowed_aliases + superseded keys
```

### Duplicate suppression

Extend `markMaterialAliasGroupRendered`:

```javascript
ROLE_RENDER_ALIAS_GROUPS = {
  worked_judgement_support: [
    "worked_judgement_weak_strong", "modelling_note", "worked_example"
  ],
  guided_judgement_table: ["guided_judgement_table", "decision_table"],
  // … per registry allowed_aliases
}
```

Legacy material iteration paths in `app.js` check `wasRoleFamilyRendered(role_family)` before emitting checklist/scenario/template/modelling_note blocks — same guard pattern as 38N A3 checklist suppression.

### Authoritative role selection

Priority order:

1. Entry with `authority: "gam"` AND `renderable: true`  
2. Entry with `authority: "compose"` AND `renderable: true` AND body length ≥ stub threshold (50% of GAM or absolute min 400 chars for Tier-A roles)  
3. If multiple `gam` keys (should not occur post-supersession): longest body on canonical key  

### Heading selection

```text
heading := registry.heading(role_family)
  IF activity context overrides (e.g. A4 criteria vs A1 concept):
    heading := registry.contextHeading(role_family, activity_archetype)
  ELSE IF heading missing:
    heading := prettyMaterialHeading(auth_key)  // legacy fallback
```

Fixes A4 "Modelling Note" mis-label — learner sees "Worked judgement (weak vs strong)" from registry.

### Interaction with 38N A3

| A3 today | 38P generalisation |
|----------|-------------------|
| `A3_ANALYSE_MATERIALS_ORDER` hardcoded | Derived from registry SW for `analyse` archetype |
| `MATERIAL_RENDER_ALIAS_GROUPS` | Subset of `ROLE_RENDER_ALIAS_GROUPS` |
| `materials_order` on A3 row | Populated from `role_sequence` or kept as alias |
| A3 validators G15/G16 | Remain; A3 becomes regression case for generalised model |

**Hold:** Existing A3 proof gates must continue to pass unchanged.

---

## Validator architecture

### Module

**New file:** `lib/page-role-fidelity.js`

Exports:

```javascript
validate38PRoleFidelity(page, gam, renderHtml, options) → { ok, errors, gates }
computeRoleOk(page, gam, renderHtml, options) → boolean
ROLE_FIDELITY_GATES // RF-1..RF-8
```

### roleOk and proofOk interaction

```text
proofOk  := validation38M.ok && validation38LRegression.ok && a3Sequencing.ok
           (existing harness — unchanged)

roleOk   := validation38P.ok
           (new — additive)

fullOk   := proofOk && roleOk   (reported separately; both required for 38P-7 SUCCESS)
```

**Critical:** `proofOk` computation **does not** incorporate `roleOk`. Harness reports both fields independently (38O orthogonality preserved as positive capability).

### validation38P structure

```javascript
{
  ok: boolean,
  gates: {
    RF1_role_uniqueness: { ok, errors },
    RF2_no_weak_first_render: { ok, errors },
    RF3_stable_role_identity: { ok, errors },
    RF4_pedagogical_function: { ok, errors },
    RF5_no_role_inversion: { ok, errors },
    RF6_episode_sequence: { ok, errors },
    RF7_body_role_coherence: { ok, errors },
    RF8_compose_transparency: { ok, errors }
  },
  errors: string[]  // flattened
}
```

### RF → validator mapping

| Gate | Validator responsibility | Inputs | Pass condition |
|------|-------------------------|--------|----------------|
| **RF-1** | `assertRoleUniqueness(activity)` | `material_role_index`, registry | Exactly one `authority: gam` + `canonical: true` per role_family present in GAM |
| **RF-2** | `assertNoWeakFirstRender(html, activity)` | render HTML h4 positions, index | No `superseded` key's heading appears before authoritative heading for same role_family |
| **RF-3** | `assertStableRoleIdentity(gam, page, html)` | GAM mats, index, h4 headings | GAM mat → registry role_family → render heading matches registry (not stub label) |
| **RF-4** | `assertPedagogicalFunctionMarkers(page, gam)` | authoritative body per role_family | Role-specific semantic markers (38N IDs) present on `authority: gam` body, absent on superseded stubs |
| **RF-5** | `assertNoRoleInversion(page, role_family)` | consolidation body, inversion_markers | `consolidation_summary` authoritative body does not match learner-write prompt patterns |
| **RF-6** | `assertEpisodeSequence(html, archetype)` | render h4 order, registry SW | Role families appear in ascending SW order within tolerance (activity-row roles optional) |
| **RF-7** | `assertBodyRoleCoherence(page, gam)` | delegates to 38M ratio on canonical key only | When RF-1 passes, existing 38M tier ratio ≥ minimum on authoritative instance |
| **RF-8** | `assertComposeTransparency(page)` | index on raw and merged | Every materials key has index entry; `source` and `authority` populated; superseded keys reference `superseded_by` |

### Activity-scoped vs page-scoped

| Scope | Gates |
|-------|-------|
| **Per activity** | RF-1, RF-2, RF-3, RF-4, RF-5, RF-6, RF-7 |
| **Page-level** | RF-8 (audit metadata presence) |
| **A4 capstone** | All gates — primary proof |
| **A1–A3** | RF-1, RF-2, RF-3, RF-7 minimum |

### Test suite (38P-5 — specified here, implemented later)

`tests/page-38p-role-fidelity.test.js`:

- A4 RF-1..RF-6 on fixture derived from `EV-38M-AFTER` post-38P merge  
- A3 sequence regression (38N parity)  
- A1 checklist duplication cleanup  
- `proofOk` regression snapshot — must remain true  

---

## Integration map

### lib/page-role-registry.js (NEW — 38P-2)

| Export | Consumer |
|--------|----------|
| `ROLE_REGISTRY`, `ROLE_REGISTRY_VERSION` | merge, render, validators |
| `resolveRoleFromGam(mat)` | merge, validators |
| `resolveCanonicalKey(mat)` | merge (wraps/replaces inline logic) |
| `getRoleFamilyForPageKey(key, activityContext)` | supersession, render |
| `getAllowedAliases(role_family)` | supersession, render |
| `getSequenceForArchetype(archetype)` | render sequencing |
| `getRegistryHeading(role_family, context)` | render |
| `ROLE_RENDER_ALIAS_GROUPS` | render, validators |

### lib/page-gam-materials-preserve.js (EXTEND — 38P-2, 38P-3)

| Function | Change |
|----------|--------|
| `pageFieldKeyForMaterial` | Delegate canonical key to registry (behaviour preserved) |
| `mergeMaterialsFromGamList` | After body merge: populate `material_role_index`; invoke supersession |
| `applyGamMaterialsToComposedPage` | Set `activity_archetype`; call role index builder |
| `applyRendererCanonicalAliases` | Post-alias: tag alias copies as `superseded` when canonical has `gam` |
| `PAGE_MATERIAL_KEY_ALIASES` | Remain for 38M body resolution; registry is superset for role |
| `validate38MPageFidelity` | **No change** — RF-7 calls it on authoritative keys only |

**38M hold:** `FIDELITY_CONTRACTS`, ratio tiers, semantic markers — untouched.

### lib/page-a3-materials-sequencing.js (EXTEND — 38P-4)

| Function | Change |
|----------|--------|
| `A3_ANALYSE_MATERIALS_ORDER` | Derived from registry or kept as alias to `role_sequence` for analyse |
| `MATERIAL_RENDER_ALIAS_GROUPS` | Re-export from registry or merge into `ROLE_RENDER_ALIAS_GROUPS` |
| `applyA3MaterialsSequencingToComposedPage` | Generalise → `applyRoleSequencingToComposedPage` (A3 calls through) |
| `validateA3MaterialsSequencing` | Unchanged — A3 regression |
| `validateA3RenderMaterialOrder` | Unchanged — A3 regression |

### app.js (EXTEND — 38P-4)

| Area | Change |
|------|--------|
| Material render block (~30072+) | When `role_sequence` present: role-ordered loop with alias suppression |
| Legacy paths (checklist, scenario, template, modelling_note) | Guard: skip if `wasRoleFamilyRendered(role_family)` |
| Heading emission | Prefer `getRegistryHeading()` over `prettyMaterialHeading(key)` when index entry exists |
| Activity-row render | Interleave at registry SW positions |

**38N hold:** Existing A3 `materials_order` path remains functional when `role_sequence` absent.

### lib/page-role-fidelity.js (NEW — 38P-5)

Full validator suite per RF-1..RF-8.

### artefacts/ev-38p-proof-replay.mjs (NEW — 38P-6)

Extend 38N replay pattern:

```javascript
{
  proofOk: validate38M && validate38L && a3Sequencing,
  roleOk: validation38P.ok,
  validation38P: { … },
  a4RoleSequencing: { render: { ok, positions } }
}
```

---

## Risks and trade-offs

| Risk | Trade-off accepted | Mitigation |
|------|-------------------|------------|
| **Dual structure (materials + index)** | Option B complexity vs Option A breaking change | Index owned solely by merge; single writer |
| **Registry drift vs GAM-PRES** | Manual registry maintenance | `ROLE_REGISTRY_VERSION`; tie entries to `material_id` patterns |
| **38M regression from supersession** | Metadata-only supersession | Never delete bodies; validators run 38M first |
| **A3 regression** | Generalisation may disturb working path | Keep A3 validators; `role_sequence` optional; A3 uses analyse SW |
| **Over-unification of checklist** | Single `verification_checklist` family | Registry sub-headings by context; one authority |
| **Compose raw path still weak** | RF-8 flags; merge path is primary proof | Manual thin-page fails roleOk loudly |
| **applyRendererCanonicalAliases creates new duplicates** | Post-process tagging as superseded | 38P-3 step 6 |
| **Heading override confusion** | Registry heading vs key label | RF-3 checks registry heading in render |
| **Module proliferation** | 2 new libs vs monolithic preserve.js | Clear separation: registry / fidelity / preserve |

---

## Recommended implementation sequence

Aligned to charter phases:

```text
38P-2  Role registry (lib/page-role-registry.js)
         ↓
38P-3  Merge supersession + material_role_index population
         ↓
38P-4  Render role precedence (role_sequence + alias suppression)
         ↓
38P-5  validate38PRoleFidelity + tests/page-38p-role-fidelity.test.js
         ↓
38P-6  EV-38P-AFTER proof replay
         ↓
38P-7  Sprint closure
```

### Within-phase sequencing notes

| Phase | First deliverable | Validation checkpoint |
|-------|-------------------|----------------------|
| **38P-2** | Registry entries for all EV-38M-AFTER role families | Unit tests: GAM mat → role_family → canonical_key |
| **38P-3** | `material_role_index` on merged A4 row | JSON inspection: stubs tagged superseded; canonical tagged gam |
| **38P-4** | A4 render order | h4 positions: worked judgement before any stub label |
| **38P-5** | RF-1 + RF-2 gates | A4 roleOk true on merged fixture (pre-render HTML) |
| **38P-6** | Full harness | `proofOk: true` AND `roleOk: true` |

### Migration path for existing pages

| Page state | Behaviour |
|------------|-----------|
| No `material_role_index` | Legacy mode — render uses existing paths; roleOk skipped or fails RF-8 |
| Post-merge with 38P | Full role fidelity |
| Raw compose only | RF-8 fails; roleOk false — expected |

No retroactive migration of historical artefacts required. Proof uses fresh inflation replay.

---

## Scope and hold confirmation

| Hold | Status |
|------|--------|
| No production code in 38P-1 | ✓ Architecture only |
| Do not reopen 38M | ✓ Body merge and validators unchanged |
| Do not reopen 38N | ✓ A3 path preserved; pattern generalised |
| F1 registry-led hybrid | ✓ All four components designed |
| RF-1..RF-8 mappable | ✓ Validator architecture complete |
| 38P-2 ready to start | ✓ |

---

## References

| Document | Path |
|----------|------|
| 38O-1 baseline trace | [38O-1](../../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-1-baseline-role-survival-trace.md) |
| 38O-2 taxonomy | [38O-2](../../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-2-role-taxonomy-page-mapping-analysis.md) |
| 38O-3 failure modes | [38O-3](../../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-3-failure-mode-classification.md) |
| 38O-4 F1 + RF criteria | [38O-4](../../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-4-preservation-options-recommendation.md) |
| 38O-5 closure | [38O-5](../../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-5-sprint-closure.md) |
| 38I A4 episode | [38I-4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) |
| 38M merge contract | `lib/page-gam-materials-preserve.js` |
| 38N A3 sequencing | `lib/page-a3-materials-sequencing.js` |

**Next phase:** [38P-2 — Role registry implementation](../IMPLEMENTATION-CHARTER.md#38p-2--role-registry-implementation)
