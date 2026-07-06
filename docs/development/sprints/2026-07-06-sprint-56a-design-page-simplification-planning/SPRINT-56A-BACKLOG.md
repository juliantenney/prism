# Sprint 56A — Planning Backlog

**Sprint type:** Discovery and planning only — not implementation tasks.

---

## 1. Consolidation

| ID | Task | Status | Notes |
| -- | ---- | ------ | ----- |
| C-01 | Index all Design Page audit artefacts | Done | See source list in START-HERE |
| C-02 | Consolidate failure modes into single catalogue | Done | [DESIGN-PAGE-FAILURE-MODES.md](DESIGN-PAGE-FAILURE-MODES.md) |
| C-03 | Extract responsibility taxonomy from architecture audit | Done | [DESIGN-PAGE-RESPONSIBILITY-ANALYSIS.md](DESIGN-PAGE-RESPONSIBILITY-ANALYSIS.md) |
| C-04 | Map live failure examples to failure mode IDs | Pending | Requires manual review of recent Copilot runs |
| C-05 | Cross-reference Sprint 56 remediation vs ongoing failures | Pending | `DESIGN-PAGE-REMEDIATION-RESULTS.md` |

---

## 2. Responsibility mapping

| ID | Task | Status | Notes |
| -- | ---- | ------ | ----- |
| R-01 | Classify every Design Page prompt module by responsibility type | Pending | Pack, compose, L4, journey, authorial, rhetoric, VA, EQF |
| R-02 | Mark essential / optional / relocate / conflict per module | Pending | Extend audit §1 tables |
| R-03 | Document authorable vs archival field boundaries | Pending | L4 split is correct; wrapper boundaries need decision |
| R-04 | Inventory brevity/size signals (`output_density`, profile instructions) | Pending | Conflict audit C-04 |
| R-05 | Produce draft responsibility matrix for implementation plan | Done | [DESIGN-PAGE-RESPONSIBILITY-MATRIX.md](DESIGN-PAGE-RESPONSIBILITY-MATRIX.md) |

---

## 3. Architecture simplification

| ID | Task | Status | Notes |
| -- | ---- | ------ | ----- |
| A-01 | Validate three-layer model (transport / organise / bridge) | Pending | From architecture audit §4 |
| A-02 | Decide fate of triple wrapper stack | Pending | Merge, thin, or remove |
| A-03 | Decide knowledge_summary treatment | Pending | Transport, omit, or upstream-only |
| A-04 | Decide visual affordance placement | Pending | On DP vs separate step vs renderer-only |
| A-05 | Define "complete final learner page" acceptance test | Pending | Single invariant question from audit §6 |
| A-06 | Document target-state augmentation chain | Pending | Fewer modules, explicit order |

---

## 4. Migration sequencing

| ID | Task | Status | Notes |
| -- | ---- | ------ | ----- |
| M-01 | Identify quick wins vs structural changes | Pending | |
| M-02 | Map dependencies (pack, lib, app.js, tests, renderer) | Pending | |
| M-03 | Define phased migration (e.g. demote VA before wrapper collapse) | Pending | |
| M-04 | Assess Copilot vs PRISM-run path differences | Pending | Repair layer is PRISM-only |
| M-05 | Record Sprint 57 deferral/narrowing options | Pending | |

---

## 5. Dependency analysis

| ID | Task | Status | Notes |
| -- | ---- | ------ | ----- |
| D-01 | Renderer dependencies on VA schema 38.4 | Pending | `sprint38-visual-affordances.js` |
| D-02 | Episode plan portable schema consumers | Pending | `DESIGN-PAGE-EPISODE-PLANS-SCHEMA.md` |
| D-03 | Assessment profile / include_answers wiring | Pending | `app.js` step param patches |
| D-04 | Test suite impact map | Pending | `design-page-materials-fidelity`, compose contract tests |
| D-05 | Cross-prompt authority map update post-simplification | Pending | Extends SPRINT-57-ARCHITECTURE-STATE |

---

## 6. Risk identification

| ID | Task | Status | Notes |
| -- | ---- | ------ | ----- |
| K-01 | Regression risk: wrapper removal reduces journey salience | Pending | Sprint 42–43 concern |
| K-02 | Regression risk: VA relocation breaks renderer | Pending | |
| K-03 | Risk: over-correction to content-only pages with no orientation | Pending | |
| K-04 | Risk: migration partially applied leaves worse conflict state | Pending | |
| K-05 | Risk: implementation sprint scope creep into learner UX | Pending | |

---

## 7. Validation strategy

| ID | Task | Status | Notes |
| -- | ---- | ------ | ----- |
| V-01 | Define pre-migration baseline fixtures | Pending | Inflation, communication/trust workflows |
| V-02 | Define per-failure-mode detection criteria | Pending | Link to FAILURE-MODES |
| V-03 | Define Copilot validation protocol (conversation history) | Pending | |
| V-04 | Define PRISM-run validation protocol (repair path) | Pending | |
| V-05 | Define "pass" for complete final learner page | Pending | No dereference, full GAM bodies |
| V-06 | Plan probe metrics for post-migration comparison | Pending | `probe-design-page-s57-audit-metrics.js` |

---

## Backlog hygiene

- Implementation tasks belong in a **future implementation sprint**, not here.
- Resolved open questions move from [SPRINT-56A-OPEN-QUESTIONS.md](SPRINT-56A-OPEN-QUESTIONS.md) to implementation plan decisions section.
- Completed planning items update status in this file.
