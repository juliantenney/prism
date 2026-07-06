# Sprint 56A — Implementation Plan (Skeleton)

**Sprint:** 56A — Design Page Simplification Planning  
**Status:** **DRAFT — skeleton only**  
**Approval:** Not yet approved  
**Purpose:** Structured container for migration planning decisions. Populate during Sprint 56A; approve before implementation sprint.

---

## Document control

| Field | Value |
| ----- | ----- |
| Version | 0.1 (skeleton) |
| Created | 2026-07-06 |
| Approved by | *(pending)* |
| Approved date | *(pending)* |
| Implementation sprint | *(TBD)* |

---

## 1. Responsibility matrix

*(To be populated during Sprint 56A planning.)*

### 1.1 Current-state matrix

| Responsibility | Type | Module / location | Keep | Relocate | Remove | Notes |
| -------------- | ---- | ----------------- | ---- | -------- | ------ | ----- |
| | | | | | | |

### 1.2 Target-state matrix

| Responsibility | Type | Owner step / module | Priority | Notes |
| -------------- | ---- | ------------------- | -------- | ----- |
| | | | | |

### 1.3 Decision log

| ID | Decision | Rationale | Date |
| -- | -------- | --------- | ---- |
| | | | |

---

## 2. Target-state architecture

*(To be defined — candidate from architecture audit: transport → organise → optional bridge.)*

### 2.1 Primary responsibility statement

> *(confirm or revise)*

### 2.2 Layer definitions

#### Layer 1 — Hard transport

*(TBD)*

#### Layer 2 — Organise

*(TBD)*

#### Layer 3 — Optional bridge

*(TBD)*

### 2.3 Augmentation chain (target)

*(TBD — module list and order)*

### 2.4 Page JSON contract (target)

*(TBD — required vs optional keys)*

---

## 3. Dependency analysis

### 3.1 Code and module dependencies

*(TBD)*

| Component | Path | Depends on | Impacted by |
| --------- | ---- | ---------- | ----------- |
| | | | |

### 3.2 Renderer and export dependencies

*(TBD)*

### 3.3 Test suite dependencies

*(TBD)*

### 3.4 Copilot vs PRISM-run path differences

*(TBD)*

---

## 4. Migration plan

### 4.1 Principles

*(TBD)*

### 4.2 Phases

#### Phase 0 — Freeze and baseline

*(TBD)*

#### Phase 1 —

*(TBD)*

#### Phase 2 —

*(TBD)*

#### Phase 3 —

*(TBD)*

### 4.3 Rollback criteria

*(TBD)*

### 4.4 Sprint 57 interaction

*(TBD — defer / narrow / parallel)*

---

## 5. Risk assessment

| ID | Risk | Likelihood | Impact | Mitigation |
| -- | ---- | ---------- | ------ | ---------- |
| | | | | |

---

## 6. Implementation order

*(To be sequenced after dependency analysis — not populated in skeleton.)*

1. *(TBD)*
2. *(TBD)*
3. *(TBD)*

---

## 7. Validation strategy

### 7.1 Acceptance invariant

> Can a learner complete the journey using only the page JSON, with no dereferencing and no upstream recovery?

*(TBD — operationalise)*

### 7.2 Per-failure-mode checks

| Failure mode | Detection method | Pass criteria |
| ------------ | ---------------- | ------------- |
| A Summarisation | | |
| B Metadata substitution | | |
| C Multi-material omission | | |
| D Truncation | | |
| E Placeholder substitution | | |
| F Context denial | | |
| G Material elision | | |

### 7.3 Baseline fixtures

*(TBD)*

### 7.4 Copilot validation protocol

*(TBD)*

### 7.5 PRISM-run validation protocol

*(TBD)*

### 7.6 Metrics and probes

*(TBD — e.g. `probe-design-page-s57-audit-metrics.js`)*

---

## 8. References

| Document | Role |
| -------- | ---- |
| [DESIGN-PAGE-ARCHITECTURE-AUDIT.md](../2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/DESIGN-PAGE-ARCHITECTURE-AUDIT.md) | Accepted diagnosis |
| [DESIGN-PAGE-FAILURE-MODES.md](DESIGN-PAGE-FAILURE-MODES.md) | Failure catalogue |
| [DESIGN-PAGE-RESPONSIBILITY-ANALYSIS.md](DESIGN-PAGE-RESPONSIBILITY-ANALYSIS.md) | Responsibility taxonomy |
| [SPRINT-56A-OPEN-QUESTIONS.md](SPRINT-56A-OPEN-QUESTIONS.md) | Unresolved decisions |
| [SPRINT-57-ARCHITECTURE-STATE.md](../2026-07-01-sprint-57-learner-experience-product-quality/SPRINT-57-ARCHITECTURE-STATE.md) | Current ownership map |

---

## Approval

| Role | Name | Signature / date |
| ---- | ---- | ---------------- |
| Planning lead | | |
| Technical review | | |

**Do not begin implementation until this plan is marked APPROVED.**
