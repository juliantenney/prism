# Sprint 57 — Baseline Metrics

**Purpose:** Sprint 57 “before” state — post-Sprint 56 architecture programme, post-final cleanup  
**Measured:** 2026-07-01  
**Profile:** RNA/HCV self-directed learner-page workflow  
**Not** Sprint 56 starting baseline — see [SPRINT-56-BASELINE-METRICS.md](../2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/SPRINT-56-BASELINE-METRICS.md) for before/after rationalisation comparison.

---

## Prompt size (emit path)

| Step | Seeded (pack) | Augmented (runtime) | Probe / test |
| ---- | -------------: | ------------------: | ------------ |
| **DLA** | ~13,201 (S56 baseline seed) | **~31,932** | `tests/sprint-56-dla-ssot-rationalisation.test.js` |
| **GAM** | 15,145 | **41,538** | `scripts/probe-gam-s57-audit-metrics.js` |
| **Design Page** | 2,756 | **32,685** | `scripts/probe-design-page-s57-audit-metrics.js` |

### Historical comparison (DLA only)

| Metric | Sprint 55 (pre-S56) | Sprint 57 baseline |
| ------ | ------------------: | -----------------: |
| DLA augmented core | 49,949 | **31,932** |
| Scaffold layers | 5 | **1** |
| Conflicting word-range classes | 7 | **0** |

---

## Architecture health

| Dimension | Classification | Source |
| --------- | -------------- | ------ |
| Orchestration boundaries | **GREEN** | [CROSS-PROMPT-AUTHORITY-PLACEMENT-AUDIT.md](../../audits/CROSS-PROMPT-AUTHORITY-PLACEMENT-AUDIT.md) |
| Authority placement | **GREEN** | Post-remediation matrix |
| Prompt maintainability | **AMBER (stable)** | Optional size tranches documented |
| Architecture programme | **Closed** | [FINAL-ARCHITECTURE-CLEANUP.md](../../audits/FINAL-ARCHITECTURE-CLEANUP.md) |

---

## Governance status

| Item | Status |
| ---- | ------ |
| DLA SSOT marker | Single `LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT` on emit |
| Deprecation register | Active — [DEPRECATION-REGISTER.md](../../prompt-contracts/DEPRECATION-REGISTER.md) |
| PRE-EMIT on DLA | Unified `DLA PRE-EMIT SCAFFOLD GATE` |
| PRE-EMIT on Design Page | **None** (by design) |
| No layer without supersession | Charter principle adopted |
| Pack ↔ runtime sync | DLA §5 synced (Sprint 56 final cleanup) |

---

## GAM block contributions (probe)

| Block | Chars (approx) |
| ----- | -------------: |
| SP total | 13,414 |
| Self-study materials | 3,529 |
| LD-TABLE-FIDELITY | 3,916 |
| EQF | 2,022 |
| PEL reasoning | 1,436 |
| Rhetoric (gam) | 844 |
| Math | 1,219 |

---

## Design Page block contributions (probe)

| Block | Chars (approx) |
| ----- | -------------: |
| Compose stack | +18,149 |
| Sprint 38 visual | +6,601 |
| Self-directed rhetoric | +2,314 |
| EQF | +1,644 |
| Scaffold (compose-only) | ~632 (in compose) |

---

## DLA external generation variance (known)

From [SPRINT-56-DLA-STABILISATION-PASS.md](../../prompt-contracts/SPRINT-56-DLA-STABILISATION-PASS.md):

| Metric | Value |
| ------ | ----- |
| Stabilisation batch mean mandatory pass | **13.3%** |
| Best single run | **60%** (cognition remediation) |
| Target ≥80% reliable pass | **Not achieved** via prompt alone |

**Sprint 57 implication:** Product quality assessment must use **repaired/captured** artefacts or account for variance — not assume single Copy run represents floor.

---

## Validation / repair coverage

| System | Status |
| ------ | ------ |
| Page materials closure | Active |
| Page activity field closure | Active |
| GAM materials preserve on compose | Active |
| DLA scaffold capture repair | Active |
| GAM pack text capture gate | Active |
| Design Page focused test suite | 46/46 passed (post Design Page remediation) |

---

## Learner experience baseline

Sprint 57 currently has **no learner-experience measurements**. The items below are explicitly **not yet measured** — no scores are assigned at sprint open.

| Dimension | Status at Sprint 57 open |
| --------- | ------------------------ |
| Typography quality | Not yet measured |
| Navigation quality | Not yet measured |
| Perceived duplication | Not yet measured |
| Cognitive load | Not yet measured |
| Table readability | Not yet measured |
| Learner confidence signals | Not yet measured |

As discovery and slices progress, success metrics are expected to become **increasingly learner-visible** rather than prompt-centric. Prompt and governance figures in this file remain the generation baseline; learner-experience rubrics and before/after evidence belong in slice documentation and a future sprint closure update.

---

## Re-measurement commands

```bash
node scripts/probe-gam-s57-audit-metrics.js
node scripts/probe-design-page-s57-audit-metrics.js
node --test tests/sprint-56-dla-ssot-rationalisation.test.js
```

Sprint 57 success metrics are **learner-visible** — update prompt/governance rows only when that baseline intentionally changes; add learner-experience measurements as they are established (see §Learner experience baseline).
