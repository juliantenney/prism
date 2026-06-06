# 38P-5 — roleOk validation and proof harness

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Implementation — validation layer only  
**Predecessor:** [38P-4-render-role-precedence-implementation.md](38P-4-render-role-precedence-implementation.md)  
**Authority:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)

---

## Validation architecture

Phase 38P-5 establishes **`roleOk`** as a formal proof dimension alongside existing **`proofOk`**.

| Deliverable | Location | Status |
|-------------|----------|--------|
| Role fidelity validator | `lib/page-role-fidelity.js` | **Complete** |
| Harness integration | `app.js` (`__PRISM_TEST_API`) | **Complete** |
| Unit tests | `tests/page-38p-role-fidelity.test.js` | **11 tests — all pass** |
| Regression | 38M + 38N + 38P-2..38P-4 | **58/58 pass** |

**Scope respected:** No proof run (38P-6). No `proofOk` calculation changes. Additive validation only.

```text
proofOk  := validate38M (+ optional 38L / A3 — unchanged)
roleOk   := validate38PRoleFidelity (new)
fullOk   := proofOk && roleOk   (reported separately)
```

---

## RF-1..RF-8 implementation

| Gate | ID | Responsibility | Pass condition |
|------|-----|----------------|----------------|
| **RF-1** | `RF1_role_uniqueness` | One authoritative instance per `role_family` | At most one renderable canonical/compose/unresolved entry per family; at most one `authority: canonical` |
| **RF-2** | `RF2_no_weak_first_render` | No superseded stub before authoritative render | Superseded stub headings/bodies must not precede canonical heading in activity HTML |
| **RF-3** | `RF3_stable_role_identity` | GAM → registry → render heading chain | Planned canonical keys emit registry-compatible h4 headings; known stub headings absent |
| **RF-4** | `RF4_pedagogical_function` | Markers on authoritative body | Evaluate-capstone families enforce 38N semantic markers on canonical bodies |
| **RF-5** | `RF5_no_role_inversion` | Consolidation not learner-write | Authoritative consolidation body must not match inversion patterns |
| **RF-6** | `RF6_episode_sequence` | Archetype sequence alignment | Render h4 order matches `buildRolePrecedenceRenderPlan` sequence |
| **RF-7** | `RF7_body_role_coherence` | Body fidelity on canonical keys | 38M metrics on canonical `material_id` meet ratio/marker thresholds |
| **RF-8** | `RF8_compose_transparency` | Index audit completeness | `role_supersession_applied`; every material body keyed; authority/source populated; superseded entries reference `superseded_by` |

### Scoping notes

- **RF-3 / RF-6** require `renderHtml` (full page string or per-activity map `{ [rowIndex]: html }`). Warnings emitted when HTML omitted.
- **RF-3** validates only keys present in the role render plan (materials-stack roles).
- **RF-4 / RF-7** enforce capstone marker sets on `evaluate` archetype families (`worked_judgement_support`, `guided_judgement_table`, `scenario`, `transfer_prompt`, `consolidation_summary`).
- **RF-7** matches 38M metrics by `material_id` when available to avoid cross-activity key collisions.

---

## roleOk result model

```javascript
validate38PRoleFidelity(page, { gamSource, renderHtml, allowLegacy }) → {
  ok: boolean,
  roleOk: boolean,           // alias of ok
  errors: string[],
  warnings: string[],
  passed: string[],          // gate names passing
  failed: string[],          // gate names failing
  gates: {
    RF1_role_uniqueness: { ok, errors, warnings },
    RF2_no_weak_first_render: { ok, errors, warnings },
    // … RF3..RF8
  },
  diagnostics: {
    version: "38P-5",
    activities_checked: number,
    render_html_supplied: boolean
  },
  legacy?: true              // when allowLegacy and no index
}
```

`computeRoleOk(page, options)` returns boolean shorthand.

---

## Diagnostics model

| Utility | Purpose |
|---------|---------|
| `measureRoleCoverage(page)` | Role families, canonical/superseded/unresolved counts per activity; expected sequence |
| `measureRenderedRoles(page, renderHtml)` | h4 headings mapped to role families; planned order; stub heading detection |
| `measureRoleFidelity(page, options)` | Aggregates validation + coverage + rendered + `measureRoleSupersession` |
| `computeProofDimensions(page, options)` | **`proofOk`** and **`roleOk`** independently with nested validation payloads |

---

## Harness integration

`app.js` test API (additive):

| Method | Returns |
|--------|---------|
| `validate38PRoleFidelityForTest(page, options)` | Full validation38P result |
| `computeRoleOkForTest(page, options)` | boolean |
| `computeProofDimensionsForTest(page, options)` | `{ proofOk, roleOk, fullOk, validation38M, validation38P, diagnostics }` |
| `measureRoleFidelityForTest(page, options)` | Diagnostics bundle |

`computeProofDimensions` calls existing `validate38MPageFidelity` unchanged — **proofOk is not modified by role validation**.

Script load: `index.html` includes `lib/page-role-fidelity.js`.

38P-6 will extend `ev-38p-proof-replay.mjs` to emit both dimensions in run logs.

---

## Test coverage

```text
tests/page-38p-role-fidelity.test.js        11/11 pass
tests/page-38p-render-role-precedence.test.js  10/10 pass
tests/page-38p-role-supersession.test.js       11/11 pass
tests/page-38p-role-registry.test.js           16/16 pass
tests/page-38m-a3-sequencing.test.js            6/6 pass
tests/page-38n-fidelity-hardening.test.js       4/4 pass
Total                                            58/58 pass
```

| Test | Gate / behaviour |
|------|------------------|
| A4 canonical + render HTML | Full roleOk pass on merged EV-38M-AFTER replay |
| Superseded stub in HTML | RF-2 / RF-3 fail |
| Duplicate canonical family | RF-1 fail |
| Consolidation inversion body | RF-5 fail |
| Swapped render sequence | RF-6 fail |
| Unresolved orphan key | RF-1 pass |
| Stripped pedagogical markers | RF-4 / RF-7 fail |
| Missing role index | RF-8 fail |
| `computeProofDimensions` | proofOk unchanged; roleOk independent |

---

## Regression assessment

| Suite | Result |
|-------|--------|
| 38M A3 sequencing | **Pass** |
| 38N fidelity hardening | **Pass** |
| 38P-2 registry | **Pass** |
| 38P-3 supersession | **Pass** |
| 38P-4 render precedence | **Pass** |
| 38M `validate38MPageFidelity` via harness | **Unchanged** |

---

## Risks and follow-on work

| Risk | Mitigation / owner |
|------|-------------------|
| A4 scenario canonical key mapping (`scenario_maya_households` vs `scenario_maya_strategy_menu`) | RF-7 uses `material_id`; 38P-6 proof may surface merge/registry alignment gap |
| Criteria exposition not in render plan | RF-3 scoped to planned keys; criteria may live outside materials stack |
| RF-4 marker set narrower than full registry `body_markers` | Expand as semantic marker library grows |
| No EV-38P-AFTER run yet | **38P-6** — formal proof replay with both dimensions |

**Next phase:** 38P-6 — execute `EV-38P-AFTER` proof replay and confirm `proofOk: true` AND `roleOk: true` simultaneously.
