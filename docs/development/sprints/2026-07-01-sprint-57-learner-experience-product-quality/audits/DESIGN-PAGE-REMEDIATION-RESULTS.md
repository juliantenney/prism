# Design Page Remediation Results (Sprint 57 Targeted Pass)

**Status:** Completed — targeted remediation only (not a rationalisation programme)  
**Date:** 2026-07-01  
**Baseline audit:** `DESIGN-PAGE-RATIONALISATION-RECOMMENDATION.md` (AMBER upper bound)

---

## Summary

### What changed

1. **Pack → Compose SSOT (Remediation 1)** — Thinned Design Page `promptTemplate` from ~10.9k to ~2.8k chars. Removed duplicated materials fidelity, membership, episode-plan portable schema, inflation-collapse taxonomy, and inline LD-MATERIALS-COPY / LD-TABLE-FIDELITY rules. Pack now references runtime canonical authorities (`LD-DESIGN-PAGE-COMPOSE-CONTRACT`, embedded L4 modules, journey/rhetoric, Sprint 38, math).

2. **Materials/Table authority wiring (Remediation 2)** — Confirmed canonical injection path: `buildLdDesignPageComposePromptBlock` in `app.js` embeds `LD-MATERIALS-COPY` and `LD-TABLE-FIDELITY` with `role: "design_page"` (no duplicate markers). Synced `app.js` inline table-fidelity fallback preserve role with `lib/ld-table-fidelity.js` (38H-3 table-adjunct prose — previously missing in fallback). Documented Design Page deferral in `applyLdTableFidelityContractToDraft`.

3. **Compose-only scaffold slice (Remediation 3)** — Added `composeOnly` mode to `lib/ld-guided-learning-scaffold.js`. Design Page path uses preservation-only block (~632 chars) instead of full DLA FIELD_LINES + EXEMPLAR_LINES (~4,332 chars). DLA generation path unchanged (`includeDlaPreEmit: true`).

### What did not change

- No schema changes to page JSON output
- No new governance layers or PRE-EMIT gate
- No new contracts created
- Capture/repair pipeline unchanged (`page-gam-materials-preserve`, composition validation suite)
- Compose stack order and module ownership headers unchanged
- Sprint 38 visual block unchanged
- DLA scaffold generation, PRE-EMIT, and repair paths unchanged

### Remediation scope

**Targeted remediation only** — same class as GAM Sprint 57 remediation, not DLA-S56 rationalisation programme.

---

## Before / After Metrics

Probe: `node scripts/probe-design-page-s57-audit-metrics.js` · RNA/HCV self-directed learner-page brief · full `tests/prism-vm-lib-bootstrap.js`

| Metric | Before | After | Δ |
|--------|-------:|------:|--:|
| **Seeded pack** | 10,757 | **2,756** | **−8,001 (−74.4%)** |
| **Augmented prompt** | 44,386 | **32,685** | **−11,701 (−26.4%)** |
| Runtime delta | +33,629 | +29,929 | −3,700 |
| Pack `promptTemplate` | 10,927 | 2,834 | −8,093 |
| Pack `defaultPromptNotes` | 1,122 | 641 | −481 |
| LD-GUIDED-LEARNING-SCAFFOLD block | 4,332 | **632** | **−3,700 (−85.4%)** |
| LD-DESIGN-PAGE-COMPOSE block | 9,978 | 9,978 | 0 |
| Auto-applied block count | 9 | 9 | 0 |
| PRE-EMIT phrase count | 0 | 0 | 0 |

### Incremental contribution (after)

| Step | Δ chars |
|------|--------:|
| Design Page compose stack | +18,149 |
| Sprint 38 visual | +6,601 |
| Self-directed rhetoric | +2,314 |
| EQF | +1,644 |
| Math | +1,220 |
| Scaffold (compose-only) | included in compose stack |

### Peer comparison (post-remediation)

| Step | Augmented chars |
|------|----------------:|
| Design Page (after) | **32,685** |
| GAM post-remediation | 41,558 |
| DLA post-S56 | 31,932 |

Design Page is now **below post-remediation GAM** and **near post-S56 DLA** (+753 chars, +2.4%).

---

## Remediation Evidence

### 1. Pack → Compose SSOT

| Item | Detail |
|------|--------|
| **Files changed** | `domains/learning-design/domain-learning-design-step-patterns.md` §13; `scripts/thin-design-page-pack-template.js` (reproducible thin pass) |
| **Duplicated guidance removed** | Materials fidelity taxonomy, activity membership closure, episode_plans portable schema, inflation-collapse FAIL substitutes, inline table-adjunct rules, pre-return validation checklist (~8k chars) |
| **Authority after** | Pack = task context, user options, output keys, runtime pointers. **LD-DESIGN-PAGE-COMPOSE-CONTRACT** = canonical compose SSOT |
| **Risks** | Pack no longer re-teaches L4 rules at seed time — relies on runtime augmentation (already gated for learner-page briefs) |
| **Tests** | `tests/design-page-materials-fidelity.test.js` (pack delegation assertions); `tests/workflow-learner-page-journey-assimilation.test.js` (pack reference update) |

### 2. Materials/Table authority injection

| Item | Detail |
|------|--------|
| **Files changed** | `app.js` (`buildLdDesignPageComposePromptBlock` role `design_page`; inline table fallback 38H-3 sync; compose-path comment) |
| **Injection path** | `applyLdDesignPageComposeContractToDraft` → `buildLdDesignPageComposePromptBlock` → embedded `materialsCopyBlock` + `tableFidelityBlock` (no separate auto-applied markers) |
| **Authority after** | L4 materials/table rules live inside compose contract L4 preserve embed — matches `tests/ld-design-page-compose-contract.test.js` materials bridge pattern |
| **Risks** | Main-chain `applyLdMaterialsCopyContractToDraft` / `applyLdTableFidelityContractToDraft` still no-op for Design Page by design (dedupe); compose embed is sole emit path |
| **Tests** | `tests/design-page-materials-fidelity.test.js` (L4 preserve embed, 38H-3, table-adjunct); `tests/ld-table-fidelity.test.js`; `tests/ld-design-page-compose-contract.test.js` |

### 3. Compose-only scaffold slice

| Item | Detail |
|------|--------|
| **Files changed** | `lib/ld-guided-learning-scaffold.js` (`composeOnly` option); `app.js` (`composeOnly: isDesignPage` in `applyLdGuidedLearningScaffoldContractToDraft`) |
| **Removed from Design Page path** | DLA FIELD_LINES word-range grid, EXEMPLAR CONTRAST pairs, TRANSITION_LINES, MANDATORY_LINES, PRE-EMIT gate |
| **Retained** | Compose preservation marker, PRESERVATION BOUNDARY cross-refs, COMPOSE_LINES (verbatim materials/scaffold copy) |
| **Authority after** | DLA generation = full scaffold + PRE-EMIT. Design Page compose = preservation-only slice |
| **Risks** | Low — compose contract and field preservation lines remain authoritative for verbatim copy |
| **Tests** | `tests/design-page-materials-fidelity.test.js` (compose-only assertions); `tests/sprint-55-guided-learning-quality.test.js` (DLA path unchanged) |

---

## Behaviour Verification

| Check | Result |
|-------|--------|
| Page JSON schema unchanged | Yes — no output structure edits |
| Design Page output contract unchanged | Yes — compose contract body unchanged |
| Capture/repair flow preserved | Yes — no changes to validation or GAM preserve |
| PRE-EMIT gate added | **No** (probe: `PRE-EMIT` ×0) |
| New governance layer | **No** |
| Tests passing | **46/46** Design Page focused suite (see Test plan below) |

### Test plan executed

```bash
node scripts/probe-design-page-s57-audit-metrics.js
node --test tests/design-page-materials-fidelity.test.js
node --test tests/ld-design-page-compose-contract.test.js
node --test tests/workflow-learner-page-journey-assimilation.test.js
node --test tests/sprint-55-guided-learning-quality.test.js
```

---

## Authority and Validation Counts (after)

| Category | Before | After | Notes |
|----------|-------:|------:|-------|
| Emit-time auto-applied blocks | 9 | 9 | Unchanged |
| Referenced-but-not-injected (C-01) | 2 | **0** | Materials/table now embedded in compose |
| Post-emit validation/repair systems | 12 | 12 | Unchanged |
| PRE-EMIT on emit | 0 | 0 | Unchanged |

---

## Final Classification

### **AMBER (improved)** — targeted remediation sufficient; no dedicated rationalisation programme

| Criterion | Assessment |
|-----------|------------|
| vs GREEN | Not yet — augmented prompt 32,685 chars still above 38B charter ≤22k target |
| vs RED | No — no PRE-EMIT stack, no new contract conflicts, compose SSOT intact |
| vs pre-remediation AMBER upper | **Improved** — −26.4% augmented, pack duplication removed, C-01 resolved, scaffold boundary clarified |

### Further work justified?

**Optional second tranche only** — not a full programme:

- Journey ↔ rhetoric wrapper dedupe (~0.8–1.2k est.)
- Sprint 38 JSON exemplar abbreviation (~1–1.5k est.)
- Re-probe toward ≤30k augmented or charter ≤22k if product requires

No dedicated Design Page rationalisation programme recommended unless new accretion occurs.

---

## Traceability

| Artefact | Path |
|----------|------|
| Pre-remediation audit | `docs/development/audits/DESIGN-PAGE-*.md` |
| Probe | `scripts/probe-design-page-s57-audit-metrics.js` |
| Pack thin script | `scripts/thin-design-page-pack-template.js` |
| Scaffold composeOnly | `lib/ld-guided-learning-scaffold.js` |
| Compose L4 embed | `app.js` `buildLdDesignPageComposePromptBlock` |
