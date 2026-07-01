# Design Page Baseline Metrics (Sprint 57 Discovery)

**Status:** Evidence record  
**Date:** 2026-07-01  
**Probe:** `node scripts/probe-design-page-s57-audit-metrics.js`  
**Method:** `buildSeededStepPromptForWorkflowStep` + `applyWorkflowStepRuntimePromptAugmentations` · RNA/HCV self-directed learner-page brief · full `tests/prism-vm-lib-bootstrap.js` (same methodology as GAM S57 / Sprint 38B probes)

---

## 1. Prompt size summary

| Metric | Self-directed | Facilitated |
|--------|--------------:|------------:|
| **Seeded (pack static)** | 10,757 | 10,757 |
| **Augmented (emitted core)** | **44,386** | **42,265** |
| **Runtime delta** | +33,629 | +31,508 |
| **Augmentation ratio** | 4.13× seeded | 3.93× seeded |

**Historical comparison:**

| Probe | Design Page augmented | Seeded | Source |
|-------|----------------------:|-------:|--------|
| Sprint 38B (2026-06-04) | **45,791** | 9,648 | `38B-1-prompt-audit.md` |
| Sprint 38B W1-2 (post materials-copy) | ~48,495 | — | `38B-W1-2-ld-materials-copy-mapping.md` |
| **Sprint 57 (2026-07-01)** | **44,386** | 10,757 | This probe |
| **Δ since 38B baseline** | **−1,405 (−3.1%)** | +1,109 (+11.5%) | Pack template growth; runtime consolidation |

| Reference step | Augmented chars | Notes |
|----------------|----------------:|-------|
| DLA pre-rationalisation (S55) | 49,949 | With upstream embed context |
| DLA post-rationalisation (S56) | 31,932 | Core emit only |
| GAM pre-remediation (S57) | 46,349 | Self-directed |
| GAM post-remediation (S57) | 41,558 | After targeted cleanup |
| **Design Page current** | **44,386** | Self-directed |

Design Page remains the **largest learner-facing emit** among post-S56 DLA and post-remediation GAM. It exceeds post-rationalisation DLA by **+12,454 chars** (+39%).

---

## 2. Prompt size breakdown (self-directed)

| Layer | Component | Chars | % of augmented |
|-------|-----------|------:|---------------:|
| **Static** | Pack `promptTemplate` | 10,927 | 24.6% |
| **Static** | Pack `defaultPromptNotes` | 1,122 | 2.5% |
| **Static** | Workflow seed wrapper (est.) | ~−170 | — |
| **Dynamic** | LD-DESIGN-PAGE-COMPOSE stack† | **21,850** | **49.2%** |
| **Dynamic** | Sprint 38 visual + pedagogical | 6,599 | 14.9% |
| **Dynamic** | LD-SELF-DIRECTED-RHETORIC | 2,313 | 5.2% |
| **Dynamic** | EDUCATIONAL-QUALITY-FRAMEWORK | 1,643 | 3.7% |
| **Dynamic** | LD-MATH-RENDER | 1,219 | 2.7% |
| **Dynamic** | Pedagogic cognition | 0‡ | 0% |

† Compose stack incremental Δ includes: compose contract (9,978), authorial exposition (2,728), journey assimilation (4,808), guided-learning scaffold compose block (4,332). Marker overhead ~4 chars between blocks.

‡ Cognition contract inactive for default RNA brief probe.

### Compose stack internal split (blockSizes from probe)

| Block marker | Chars | % of augmented |
|--------------|------:|---------------:|
| LD-DESIGN-PAGE-COMPOSE-CONTRACT | 9,978 | 22.5% |
| LD-JOURNEY-ASSIMILATION-CONTRACT | 4,808 | 10.8% |
| LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT | 4,332 | 9.8% |
| LD-AUTHORIAL-EXPOSITION-CONTRACT | 2,728 | 6.1% |
| LD-SELF-DIRECTED-RHETORIC | 2,313 | 5.2% |
| Sprint 38 visual affordance | 5,476 | 12.3% |
| Sprint 38 pedagogical added-value | 1,123 | 2.5% |
| EDUCATIONAL-QUALITY-FRAMEWORK | 1,643 | 3.7% |
| LD-MATH-RENDER | 1,219 | 2.7% |

---

## 3. Example footprint

| Category | Count | Total chars (est.) |
|----------|------:|-------------------:|
| Sprint 38 JSON exemplars (generate/defer/reject) | **3** | ~2,400 (within 5,476 visual block) |
| LD-GUIDED-LEARNING-SCAFFOLD weak/strong exemplar pairs | **4 field pairs** | ~1,100 (within 4,332 scaffold block) |
| Pack inflation-collapse FAIL substitutes | **6+** prose patterns | ~800 (within pack template) |
| Pack pre-return validation checklist | 1 | ~600 (within pack template) |
| JSON page shape example on emit | **0** full page | 0 |

**Duplicate exemplar risk:** Scaffold exemplars model DLA **generation** quality on a **compose-preservation** step; Sprint 38 JSON examples are unique to visual affordances.

---

## 4. Duplication phrase evidence (probe)

| Phrase | Count in augmented prompt |
|--------|--------------------------:|
| `verbatim` | 18 |
| `activity.materials` | 27 |
| `episode_plans` | 16 |
| `PRESERVATION BOUNDARY` | 5 |
| `LD-JOURNEY-ASSIMILATION` | 5 |
| `LD-DESIGN-PAGE-COMPOSE` | 5 |
| `LD-AUTHORIAL-EXPOSITION` | 6 |
| `intellectual_coherence_bridge` | 7 |
| `facilitator` | 6 |
| `visual affordance` | 4 |
| `PRE-EMIT` | **0** |
| `GOOD shape` | **0** |

---

## 5. Top 10 contributors (ranked)

| Rank | Contributor | Chars | % of augmented | Rationalisation candidate |
|------|-------------|------:|---------------:|---------------------------|
| 1 | Pack `promptTemplate` | 10,927 | 24.6% | **Yes** — thin to pointers; defer to compose contract |
| 2 | LD-DESIGN-PAGE-COMPOSE-CONTRACT | 9,978 | 22.5% | Partial — dedupe pack overlap |
| 3 | Sprint 38 visual block | 5,476 | 12.3% | Partial — examples could be abbreviated |
| 4 | LD-JOURNEY-ASSIMILATION | 4,808 | 10.8% | Partial — overlap with rhetoric wrapper |
| 5 | LD-GUIDED-LEARNING-SCAFFOLD (compose) | 4,332 | 9.8% | **Yes** — DLA exemplars on compose path |
| 6 | LD-AUTHORIAL-EXPOSITION | 2,728 | 6.1% | Low — unique voice boundary |
| 7 | LD-SELF-DIRECTED-RHETORIC | 2,313 | 5.2% | Partial — journey cross-ref |
| 8 | EDUCATIONAL-QUALITY-FRAMEWORK | 1,643 | 3.7% | Low |
| 9 | Sprint 38 pedagogical added-value | 1,123 | 2.5% | Low |
| 10 | LD-MATH-RENDER | 1,219 | 2.7% | Low (shared across LD steps) |

**Top 3 account for 59.4%** of augmented prompt. **Compose stack (ranks 2+4+5+6) accounts for 49.2%** of runtime delta in one augmentation step.

---

## 6. Growth analysis

| Trend | Evidence |
|-------|----------|
| Pack accretion | Seeded +11.5% since 38B (9,648 → 10,757); `promptTemplate` grew with materials/episode/visual rules |
| Runtime consolidation | Augmented −3.1% since 38B (45,791 → 44,386); rhetoric stack unified to single LD-SELF-DIRECTED-RHETORIC block (38B had 15 blocks, probe finds 9) |
| Net position | Still **~2×** Sprint 38B charter target (≤22k augmented per `38B-1-prompt-audit.md`) |
| vs peer steps | GAM post-remediation −10.3%; Design Page −3.1% — **Design Page lagging remediation pace** |

---

## 7. Probe reproducibility

```bash
node scripts/probe-design-page-s57-audit-metrics.js
```

Outputs JSON to stdout: `seededChars`, `augmentedChars`, `blockSizes`, `phraseCounts`, `incremental` trace, facilitated comparison, historical 38B reference values.

**Requirements:** Full lib bootstrap (`tests/prism-vm-lib-bootstrap.js`); `document.readyState: "loading"` stub (avoids `app.js` init crash).

---

## 8. Traceability

| Evidence | Source |
|----------|--------|
| All size figures | `scripts/probe-design-page-s57-audit-metrics.js` run 2026-07-01 |
| 38B historical | `38B-1-prompt-audit.md` |
| DLA/GAM comparators | `GAM-BASELINE-METRICS.md`, `GAM-REMEDIATION-RESULTS.md` |
| Assembly | `app.js` ~10990–11012 |
