# 38P-2 — Role registry implementation

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Implementation — registry module + tests only  
**Predecessor:** [38P-1-role-authority-architecture.md](38P-1-role-authority-architecture.md)  
**Authority:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)

---

## Implementation summary

Phase 38P-2 implements the instructional role registry as a **standalone, additive module** per 38P-1 architecture.

| Deliverable | Location | Status |
|-------------|----------|--------|
| Role registry module | `lib/page-role-registry.js` | **Complete** |
| Unit tests | `tests/page-38p-role-registry.test.js` | **16 tests — all pass** |
| 38N regression | `tests/page-38n-fidelity-hardening.test.js` | **4 tests — all pass** |

**Scope respected:** No changes to `pageFieldKeyForMaterial`, `FIDELITY_CONTRACTS`, merge logic, render paths, or validators.

**Registry version:** `38P-2`

---

## Registry schema

### Structure

Two-layer schema:

1. **`ROLE_FAMILY_DEFINITIONS`** — static metadata per role family (heading, sequence weights, aliases, authority rules, storage)
2. **`GAM_ROLE_RULES`** — ordered GAM `type`+`purpose` matching rules (most specific first)

Compiled at load time:

- **`ROLE_RENDER_ALIAS_GROUPS`** — role_family → alias keys (for 38P-4 render precedence)
- **`PAGE_KEY_ROLE_HINTS`** — page key → role_family reverse lookup

### Role families implemented (20)

| role_family | storage | canonical_key (primary) | evaluate SW |
|-------------|---------|-------------------------|-------------|
| learner_task | activity_row | `learner_task` | 5 |
| reasoning_orientation | activity_row | `reasoning_orientation` | 8 |
| scenario | materials | `scenario_maya_households` / `scenario_maya_strategy_menu` | 10 |
| explanatory_guidance | materials | `concept_exposition` / `criteria_exposition_evaluate` | 20 |
| worked_example | materials | `worked_example` | — |
| worked_calculation | materials | `worked_example` | — |
| worked_analytic_pass | materials | `worked_analytic_pass` | — |
| model_answer | materials | `sample_output` | — |
| model_calculation | materials | `sample_output` | — |
| sample_output | materials | `sample_output` | — |
| reasoning_support | materials | `modelling_note` | — |
| practice_table | materials | type-specific table key | — |
| verification_checklist | materials | `checklist_evaluate` / `checklist` | 60 |
| worked_judgement_support | materials | `worked_judgement_weak_strong` | 30 |
| guided_judgement_table | materials | `guided_judgement_table` | 40 |
| independent_template | materials | `independent_judgement_template` | 50 |
| scaffold_hint | activity_row | `scaffold_hint_sequence` | 55 |
| self_explanation_prompt | activity_row | `self_explanation_prompt` | 65 |
| consolidation_summary | materials | `consolidation_summary` | 70 |
| transfer_prompt | materials | `transfer_prompt_evaluate` | 80 |

*Checklist role family ID is `verification_checklist` (38O-2 / 38P-1 naming); covers compose keys `checklist`, `verification_checklist`, etc.*

### GAM matching priority

Rules evaluated top-to-bottom. Examples:

```text
modelling_note + worked judgement  → worked_judgement_support (before generic modelling_note)
worked_example + analytic pass     → worked_analytic_pass (before worked_example)
worked_example + calculation       → worked_calculation
text + criteria                    → explanatory_guidance / criteria_exposition_evaluate
text + concept                     → explanatory_guidance / concept_exposition
```

Canonical key resolution **mirrors** `pageFieldKeyForMaterial` branches without modifying that function.

---

## Resolver API summary

| Function | Purpose |
|----------|---------|
| `resolveRoleFamily(type, purpose)` | GAM → role_family |
| `resolveCanonicalKey(type, purpose)` | GAM → canonical page key |
| `resolveCanonicalRole(roleFamily, options?)` | role_family → canonical key (optional type/purpose context) |
| `resolveRoleHeading(roleFamily, options?)` | role_family → learner heading |
| `resolveRoleSequence(roleFamily, archetype?)` | role_family → sequence weight |
| `resolveRoleMetadata(type, purpose)` | Full metadata object including authority_rules |
| `resolveRoleFromGam(mat)` | GAM material object convenience wrapper |
| `getAllowedAliases(roleFamily)` | Alias list for supersession (38P-3) |
| `getAuthorityRules(roleFamily)` | body_markers, inversion_markers, gam_wins_over |
| `getRoleFamilyForPageKey(pageKey, options?)` | Page key → role_family reverse lookup |
| `getSequenceForArchetype(archetype)` | Ordered role_family[] by sequence weight |
| `getRegistryEntry(roleFamily)` | Full registry entry for a family |
| `listRoleFamilies()` | All registered role family IDs |

Exports also include `ROLE_REGISTRY_VERSION`, `ROLE_FAMILY_DEFINITIONS`, `GAM_ROLE_RULES`, `ROLE_RENDER_ALIAS_GROUPS`.

---

## A4 mapping coverage

Explicit tests for 38O failure cases:

| 38O failure | GAM / page key | Resolved role_family | Canonical key | Status |
|-------------|----------------|---------------------|---------------|--------|
| M15 stub `modelling_note` | `modelling_note` + worked judgement | `worked_judgement_support` | `worked_judgement_weak_strong` | ✓ |
| M16 shell `decision_table` | `decision_table` + guided judgement | `guided_judgement_table` | `guided_judgement_table` | ✓ |
| M19 stub `transfer_prompt` | `transfer_prompt` | `transfer_prompt` | `transfer_prompt_evaluate` | ✓ |
| M17 scaffold `template` | `template` + independent | `independent_template` | `independent_judgement_template` | ✓ |

Alias groups prepared for 38P-3 supersession and 38P-4 render:

- `worked_judgement_support`: `modelling_note`, `worked_judgement_weak_strong`, `worked_example`
- `guided_judgement_table`: `decision_table`, `guided_judgement_table`
- `transfer_prompt`: `transfer_prompt`, `transfer_prompt_evaluate`
- `independent_template`: `independent_judgement_template`, `template`

Evaluate sequence ordering verified: worked_judgement → guided_table → template → checklist → transfer.

---

## Compatibility assessment

| Surface | Modified? | Assessment |
|---------|-----------|------------|
| `lib/page-gam-materials-preserve.js` | **No** | `pageFieldKeyForMaterial` unchanged |
| `FIDELITY_CONTRACTS` | **No** | Untouched |
| `applyGamMaterialsToComposedPage` | **No** | No merge behaviour change |
| `lib/page-a3-materials-sequencing.js` | **No** | A3 ordering unchanged |
| `app.js` render | **No** | No render behaviour change |
| 38N tests | **No regression** | 4/4 pass |

Registry is **loaded independently** — no existing module requires it yet. 38P-3 will import registry for supersession; 38P-4 for render precedence.

Canonical key alignment verified against 38M branches:

- checklist evaluate → `checklist_evaluate`
- scenario strategy/menu → `scenario_maya_strategy_menu`
- scenario default → `scenario_maya_households`
- transfer_prompt → `transfer_prompt_evaluate`
- template independent → `independent_judgement_template`

---

## Test results

```text
node --test tests/page-38p-role-registry.test.js tests/page-38n-fidelity-hardening.test.js

38P registry tests:  16/16 pass
38N regression tests: 4/4 pass
Total:               20/20 pass
```

### Test coverage

| Area | Tests |
|------|-------|
| Charter role families present | 1 |
| Worked variant disambiguation | 1 |
| 38M canonical key alignment | 1 |
| A4 modelling_note → worked_judgement_support | 1 |
| A4 decision_table → guided_judgement_table | 1 |
| A4 transfer_prompt variants | 1 |
| A4 independent template | 1 |
| resolveRoleFromGam convenience | 1 |
| Checklist / scenario aliases | 1 |
| Evaluate + analyse sequence ordering | 2 |
| resolveCanonicalRole context override | 1 |
| Activity-row roles | 1 |
| Unknown / fallback | 1 |
| Authority rules | 1 |

---

## Risks and follow-on work

| Item | Phase | Notes |
|------|-------|-------|
| Wire registry into merge supersession | **38P-3** | Populate `material_role_index`; tag superseded stubs |
| Delegate `pageFieldKeyForMaterial` to registry | 38P-3 optional | Can call `resolveCanonicalKey` internally — behaviour must stay identical |
| Generalise A3 sequencing to `getSequenceForArchetype` | **38P-4** | Use `ROLE_RENDER_ALIAS_GROUPS` |
| `modelling_note` page-key ambiguity | 38P-3 | Without GAM purpose, defaults to `reasoning_support`; supersession uses GAM authority |
| Registry not yet in proof harness | **38P-5** | roleOk validators consume registry APIs |

---

## Scope confirmation

| Hold | Status |
|------|--------|
| Registry implemented | ✓ |
| No merge supersession | ✓ |
| No render precedence | ✓ |
| No roleOk validation | ✓ |
| 38M/38N unchanged | ✓ |
| A4 mappings covered | ✓ |
| Unit tests passing | ✓ |

**Next phase:** [38P-3 — Merge supersession implementation](../IMPLEMENTATION-CHARTER.md#38p-3--merge-supersession-implementation)
