# 38P-4 — Render role-precedence implementation

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Implementation — learner render only  
**Predecessor:** [38P-3-merge-supersession-implementation.md](38P-3-merge-supersession-implementation.md)  
**Authority:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)

---

## Implementation summary

Phase 38P-4 makes 38P-3 supersession metadata **visible in learner render** by consuming `material_role_index` and registry sequence order.

| Deliverable | Location | Status |
|-------------|----------|--------|
| Role render sequencing module | `lib/page-role-render-sequencing.js` | **Complete** |
| Render integration | `app.js` (materials stack) | **Complete** |
| Script load order | `index.html` | **Complete** |
| Unit tests | `tests/page-38p-render-role-precedence.test.js` | **10 tests — all pass** |
| Regression | 38M + 38N + 38P-2 + 38P-3 | **47/47 pass** |

**Scope respected:** No merge changes. No body-fidelity contract changes. No `roleOk` validators (38P-5).

---

## Render role-precedence model

### Activation

When `activityRow.material_role_index` exists and has entries, the **role-precedence path** replaces the legacy `materials_order` loop (but not the entire materials stack).

When `material_role_index` is absent, existing render behaviour is unchanged.

### Algorithm

```text
FOR EACH role_family IN getSequenceForArchetype(activity_archetype):
  SKIP activity_row storage families (scaffold, learner_task, etc.)
  auth_key := highest-authority renderable key in material_role_index for role_family
  IF auth_key missing OR body empty: CONTINUE
  heading := resolveRoleHeading(role_family)
  IF materials_order declares alias for this family: apply A3 heading compatibility
  EMIT renderOrderedMaterialKeyBlock(auth_key, heading)
  markRoleAliasGroupRendered(ROLE_RENDER_ALIAS_GROUPS[role_family])
```

### Authority selection (`resolveAuthoritativeKeyForRoleFamily`)

Priority: `canonical` → `compose` → `unresolved` → `alias` → `superseded` (superseded never selected because `renderable: false`).

### Legacy path suppression

When role precedence is active:

- `shouldSkipMaterialKeyForRolePrecedence` skips keys with `renderable: false` or already marked rendered
- Checklist, scenario, template, and worksheet legacy blocks honour alias-group marks
- `Object.keys(materials)` loop receives the same guards as 38N A3 plus role-family-specific duplicate guards

### A3 heading compatibility

When `materials_order` coexists with `material_role_index` (post-merge A3):

- Registry sequence drives **order** (matches A3 materials_order weights)
- Declared `materials_order` keys drive **headings** where they differ from registry defaults (e.g. `Scenario Maya households`, `Checklist` when canonical key is `checklist_evaluate`)

---

## A4 learner-facing before/after

| Failure (pre-38P-4) | Post-38P-4 |
|---------------------|------------|
| `Modelling Note` stub h4 before worked judgement | Suppressed — single **Worked judgement (weak vs strong)** block |
| `Decision Table` shell before guided table | Suppressed — single **Guided judgement table** block |
| `Transfer Prompt` stub before evaluate prompt | Suppressed — single **Transfer prompt** (canonical `transfer_prompt_evaluate` body) |
| `Template` alias alongside independent template | Suppressed — **Independent judgement template** only |
| Duplicate weak/strong pairs from alias keys | Eliminated — one worked judgement block |

Compose stub bodies remain in `materials{}` for audit; they no longer appear in learner HTML.

---

## A3 regression assessment

| Check | Result |
|-------|--------|
| `validateA3RenderMaterialOrder` on merged+sequenced page | **Pass** |
| Worked analytic pass → Worksheet → Scenario Maya households → Checklist order | **Pass** |
| Alias keys (`worked_example`, `scenarios`, `evaluation_checklist`) suppressed | **Pass** |
| 38M body fidelity after merge | **Pass** |

A3 continues to use registry sequence (analyse archetype weights) which aligns with `A3_ANALYSE_MATERIALS_ORDER`. Heading compatibility layer preserves 38N h4 patterns.

---

## Fallback behaviour

| Condition | Behaviour |
|-----------|-----------|
| No `material_role_index` | Legacy path: `materials_order` loop (38N) then unstructured `Object.keys` iteration |
| Unresolved key (`authority: unresolved`, `renderable: true`) | Not in role plan; emitted via legacy loop |
| Superseded key (`renderable: false`) | Never emitted on role or legacy paths when index present |
| Role registry module absent | Role path skipped; legacy render unchanged |

---

## Test results

```text
tests/page-38p-render-role-precedence.test.js   10/10 pass
tests/page-38p-role-supersession.test.js      11/11 pass
tests/page-38p-role-registry.test.js            16/16 pass
tests/page-38m-a3-sequencing.test.js             6/6 pass
tests/page-38n-fidelity-hardening.test.js        4/4 pass
Total                                           47/47 pass
```

Coverage highlights:

- A4 stub suppression (modelling_note, decision_table, transfer_prompt, template alias)
- Independent template precedence
- No duplicate weak/strong learner blocks
- A3 sequencing regression with role index present
- Fallback when index absent
- Unresolved orphan key still renders

---

## Risks and follow-on work

| Risk | Mitigation / owner |
|------|-------------------|
| `roleOk` not yet enforced | **38P-5** — formal validators on render output |
| A3 heading compatibility is special-case in `resolveRolePrecedenceHeading` | Acceptable bridge; 38P-5 may generalise via registry context headings |
| Activity-row roles (scaffold, self-explanation) still use cognition path, not role plan | By design — registry marks `storage: activity_row` |
| Pages merged without full compose pipeline lack index | Fallback preserves legacy behaviour |

**Next phase:** 38P-5 — implement `roleOk` validators and proof harness to prove render matches index formally.
