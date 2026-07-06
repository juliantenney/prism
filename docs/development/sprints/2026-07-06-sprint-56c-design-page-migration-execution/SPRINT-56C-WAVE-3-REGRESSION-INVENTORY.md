# Sprint 56C — Wave 3 Regression Inventory

**Sprint:** 56C — Design Page Migration Execution  
**Wave:** 3 — Validation preparation (W3.4)  
**Authority:** [Wave 3 Validation Architecture Definition](SPRINT-56C-WAVE-3-VALIDATION-ARCHITECTURE-DEFINITION.md) §9

---

## 1) Purpose

Map existing validation tests to frozen architecture controls (Classes A/B) and identify gaps for Wave 3 readiness.

---

## 2) Inventory map

| Suite / file | Wave | Primary controls covered | Class | Layer |
| --- | --- | --- | --- | --- |
| `tests/sprint-56c-wave1-phase1-gates.test.js` | W1 | Prompt-path exclusions; compose presence; non-DP regression guard | A | 1 |
| `tests/sprint-56c-wave1-phase2a-gates.test.js` | W1 | Contract ownership-residue removal; transport/archive wording guards | A | 1 |
| `tests/sprint-56c-wave1-phase2b-gates.test.js` | W1 | Domain §13 surface compliance; brevity-detach checks | A | 0–1 |
| `tests/sprint-56c-wave1-phase3-va-gates.test.js` | W1 | VA residue removal and non-regeneration assertions | A | 1 |
| `tests/sprint-56c-wave2-gates.test.js` | W2 | Bridge presence/order/DP-only/idempotence; R-83 domain and runtime assertions | A | 1 |
| `tests/ld-thin-assembly-coherence.test.js` | W2 | Bridge contract marker, prohibitions, cap text, gating | A | 1 |
| `tests/ld-design-page-compose-contract.test.js` | W2 | Compose SSOT pointers, R-83 delimiter, non-duplication of bridge prose | A | 1 |
| `tests/ld-materials-copy.test.js` | W2 | Materials transport/preservation wording + R-83 structural-only wording | A | 1 |
| `tests/page-materials-closure.test.js` | Pre-56C + reused | Materials closure and anti-placeholder structural checks | B | 2 |
| `tests/utility-page-composition-closure.test.js` | Pre-56C + reused | Activity closure + composition validation flow | B | 2 |
| `tests/page-episode-plans-closure.test.js` | Pre-56C + reused | Episode-plan closure and page schema transport checks | B | 2 |

---

## 3) Architecture control coverage matrix

| Control ID | Control | Evidence suites | Coverage |
| --- | --- | --- | --- |
| AC-L0-01 | Governance wave status and closure traceability | Wave closure docs + checklist | Partial (doc review, not test) |
| AC-L1-01 | DP prompt composition and exclusions | W1 phase1 + W2 gates | Full |
| AC-L1-02 | Thin bridge order and DP-only scope | W2 gates | Full |
| AC-L1-03 | Contract SSOT boundaries (compose/materials/bridge) | compose/materials/bridge unit tests | Full |
| AC-L1-04 | R-83 delimiter wording (domain+contracts) | W2 gates + compose/materials tests | Full |
| AC-L2-01 | Materials closure/preservation | page-materials-closure + utility closure | Full |
| AC-L2-02 | Membership closure | utility page composition closure | Full |
| AC-L2-03 | Episode-plan closure | page-episode-plans-closure | Full |
| AC-L2-04 | OQ-24 dual-path policy enforcement | none yet (Wave 3 artefact pending) | Gap |
| AC-L2-05 | OQ-25 canonical fixture registry presence | none yet (Wave 3 artefact pending) | Gap |
| AC-ALL-01 | Generation-visibility claim hygiene (FM-G) | none yet (Wave 3 meta-test pending) | Gap |

---

## 4) Gap actions (frozen to Wave 3 scope)

| Gap | Required action | Target deliverable |
| --- | --- | --- |
| OQ-24 framework not test-linked | Add readiness assertion for framework existence and mandatory sections | `tests/sprint-56c-wave3-validation-readiness.test.js` |
| OQ-25 registry not test-linked | Add readiness assertion for registry existence and canonical class IDs | `tests/sprint-56c-wave3-validation-readiness.test.js` |
| FM-A…FM-G crosswalk not test-linked | Add readiness assertion for crosswalk existence and FM table rows | `tests/sprint-56c-wave3-validation-readiness.test.js` |
| FM-G policy checks absent | Add readiness assertion for Generation Visibility disclaimers in Wave 3 artefacts | `tests/sprint-56c-wave3-validation-readiness.test.js` |
| Checklist §E incomplete | Update checklist after W3 docs + meta-test land | `SPRINT-56C-EXECUTION-CHECKLIST.md` |

---

## 5) Named bundle definition

The frozen Wave 3 bundle label is:

`56C-VALIDATION-READINESS-BUNDLE`

Bundle composition for Wave 3 implementation validation:

1. `tests/sprint-56c-wave3-validation-readiness.test.js` (new)
2. Existing Layer 1 suites used as references in this inventory (not re-run unless explicitly requested)

Wave 3 phase validation command (minimum):

```bash
node --test tests/sprint-56c-wave3-validation-readiness.test.js
```

---

## 6) Completion linkage

This inventory satisfies checklist §E intent:

- regression inventory exists and maps controls to evidence
- explicit gaps are bounded to Wave 3 implementation tasks
