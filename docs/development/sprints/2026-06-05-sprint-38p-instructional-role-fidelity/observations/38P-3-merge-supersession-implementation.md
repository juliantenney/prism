# 38P-3 — Merge supersession implementation

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Implementation — merge metadata only  
**Predecessor:** [38P-2-role-registry-implementation.md](38P-2-role-registry-implementation.md)  
**Authority:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)

---

## Implementation summary

Phase 38P-3 extends `applyGamMaterialsToComposedPage` with **role authority metadata** and **supersession tagging** using `lib/page-role-registry.js`.

| Deliverable | Location | Status |
|-------------|----------|--------|
| Merge supersession logic | `lib/page-gam-materials-preserve.js` | **Complete** |
| Unit tests | `tests/page-38p-role-supersession.test.js` | **11 tests — all pass** |
| Regression | 38M + 38N + 38P-2 | **33/33 pass** |

**Scope respected:** No render changes. No roleOk validators. Bodies not deleted. 38M merge body injection unchanged.

---

## Metadata model implemented

### Activity-level fields

| Field | Set by | Purpose |
|-------|--------|---------|
| `material_role_index` | merge | Per-key role authority metadata (Option B from 38P-1) |
| `activity_archetype` | merge | `evaluate` \| `analyse` \| `apply` \| `understand` \| `default` |

### Page metadata

| Field | Value |
|-------|-------|
| `metadata.role_supersession_applied` | `true` |
| `metadata.role_supersession_schema` | `"38P-3"` |
| `metadata.role_registry_version` | `"38P-2"` |
| `metadata.gam_materials_preserve_schema` | `"38M-2"` (unchanged) |

### Per-key index entry

```javascript
{
  role_family: string | null,
  canonical_key: string,
  authority: "canonical" | "compose" | "alias" | "superseded" | "unresolved",
  source: "gam" | "compose" | "merge_alias",
  canonical: boolean,
  renderable: boolean,
  superseded_by: string | null,
  material_id: string | null  // when GAM canonical
}
```

---

## Supersession rules

### Merge flow (per activity)

```text
1. Snapshot pre-merge materials (compose state)
2. mergeMaterialsFromGamList — 38M body injection (unchanged)
3. buildMaterialRoleIndex — populate material_role_index
4. Set activity_archetype
```

### Authority assignment

| Condition | authority | renderable | source |
|-----------|-----------|------------|--------|
| GAM material merged to canonical key | `canonical` | `true` | `gam` |
| Compose key, no GAM winner for role | `compose` | `true` | `compose` |
| Compose stub, same role_family as GAM canonical | `superseded` | `false` | `compose` |
| Merge alias copy (not in pre-merge compose) | `alias` | `false` | `merge_alias` |
| Unmapped page key | `unresolved` | `true` | `compose` |

### Supersession detection

When GAM canonical exists for `role_family`:

1. Tag canonical key `authority: canonical`
2. For each key in `ROLE_RENDER_ALIAS_GROUPS[role_family]` with body content:
   - If key was in **pre-merge** compose → `superseded`, `superseded_by: canonical_key`
   - If key added only by merge alias copy → `alias`, `superseded_by: canonical_key`
3. **Bodies retained** — no key deletion from `materials{}`

### Alias-group ownership

Uses `ROLE_RENDER_ALIAS_GROUPS` from registry. Example A4 clusters:

| role_family | canonical_key | superseded / alias keys |
|-------------|---------------|-------------------------|
| `worked_judgement_support` | `worked_judgement_weak_strong` | `modelling_note`, `worked_example` |
| `guided_judgement_table` | `guided_judgement_table` | `decision_table` |
| `transfer_prompt` | `transfer_prompt_evaluate` | `transfer_prompt` |
| `independent_template` | `independent_judgement_template` | `template` |

---

## A4 coverage

On `EV-38M-AFTER` re-merge:

| Key | authority | renderable | superseded_by |
|-----|-----------|------------|---------------|
| `worked_judgement_weak_strong` | canonical | true | — |
| `modelling_note` | superseded | false | `worked_judgement_weak_strong` |
| `worked_example` | superseded | false | `worked_judgement_weak_strong` |
| `guided_judgement_table` | canonical | true | — |
| `decision_table` | superseded | false | `guided_judgement_table` |
| `transfer_prompt_evaluate` | canonical | true | — |
| `transfer_prompt` | superseded | false | `transfer_prompt_evaluate` |
| `independent_judgement_template` | canonical | true | — |
| `template` | superseded | false | `independent_judgement_template` |

GAM body on canonical keys unchanged; stub bodies remain in JSON for RF-8 audit.

---

## Diagnostics summary

### `measureRoleSupersession(page, options)`

Returns per-activity report:

```javascript
{
  ok: true,
  activities: [{
    activity_id, index,
    canonical: [{ key, role_family, authority, renderable, superseded_by }],
    superseded: [...],
    alias: [...],
    compose: [...],
    unresolved: [...]
  }],
  totals: { canonical, superseded, alias, compose, unresolved }
}
```

### Exported helpers

| Function | Purpose |
|----------|---------|
| `buildMaterialRoleIndex(pre, merged, gamList)` | Build index without full page merge |
| `applyRoleSupersessionToActivityRow(row, gamList, pre, gamAct)` | Tag single activity |
| `measureRoleSupersession(page)` | Proof/diagnostic aggregate |
| `ROLE_AUTHORITY` | Authority enum constants |
| `inferActivityArchetype(row, gamAct)` | Archetype inference |

---

## Regression assessment

| Suite | Result | Notes |
|-------|--------|-------|
| `page-38p-role-supersession.test.js` | 11/11 | New |
| `page-38p-role-registry.test.js` | 16/16 | Unchanged |
| `page-38n-fidelity-hardening.test.js` | 4/4 | Render unchanged |
| `page-38m-gam-preservation.test.js` | 7/7 | Body merge + validate38M pass |
| `page-38m-a3-sequencing.test.js` | 6/6 | A3 ordering unchanged |
| **Total** | **44/44** | |

`validate38MPageFidelity` passes after supersession metadata on `EV-38M-AFTER`. `pageMaterialText()` resolution unchanged.

---

## Test results

```text
node --test tests/page-38p-role-supersession.test.js \
         tests/page-38p-role-registry.test.js \
         tests/page-38n-fidelity-hardening.test.js \
         tests/page-38m-gam-preservation.test.js \
         tests/page-38m-a3-sequencing.test.js

44/44 pass
```

---

## Risks and follow-on work

| Item | Phase | Notes |
|------|-------|-------|
| Render still shows superseded keys | **38P-4** | `material_role_index.renderable` not consumed yet — expected |
| Re-merge on already-merged page | 38P-4+ | Alias copies appear in pre-merge snapshot → tagged `superseded`; acceptable |
| `criteria_exposition_evaluate` vs `concept_exposition` | 38P-4 | Both map to `explanatory_guidance`; canonical from GAM criteria |
| roleOk validators | **38P-5** | Consume index + `measureRoleSupersession` |
| `pageFieldKeyForMaterial` delegation | Optional | Registry canonical resolution; behaviour must stay identical |

---

## Scope confirmation

| Criterion | Met? |
|-----------|------|
| `material_role_index` populated | ✓ |
| Authority tagging working | ✓ |
| Supersession tagging working | ✓ |
| Canonical bodies preserved | ✓ |
| No content deleted | ✓ |
| A4 duplicate-role cases identified | ✓ |
| All tests pass | ✓ 44/44 |
| No render behaviour changed | ✓ |

**Next phase:** [38P-4 — Render role-precedence implementation](../IMPLEMENTATION-CHARTER.md#38p-4--render-role-precedence-implementation)
