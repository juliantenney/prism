# Sprint 81 — Plan

**Status:** **CLOSED / COMPLETE**  
**Outcome:** [S81-D02](decisions.md#s81-d02--b-targeted-enhancement-narrowed) — **B**  
**Closure:** [SPRINT-81-CLOSURE.md](SPRINT-81-CLOSURE.md)  
**Dashboard:** [STATUS.md](STATUS.md)

Task IDs: `S81-T-###`. Decision IDs: `S81-D##`.

---

## Method (binding — historical)

```text
forensic current-state activity inventory (production evidence)
  → learner-action types (derived, not invented)
  → learner evidence + diagnostic-feedback dependencies
  → candidate surface families (if any) + activity↔surface mappings
  → fallback + representation-selection authority options
  → complexity / maintenance implications
  → RECOMMENDATION A / B / C / D (outcome-neutral evidence gate)
  → implementation only if authorised after recommendation
```

---

## Programme sequence (final)

```text
S81-T-001 … T-005  Investigation / recommendation     ← ACCEPTED
  -> S81-D02 B TARGETED ENHANCEMENT (narrowed)         ← ACCEPTED
  -> S81-T-006 R3 vs R4 design validation              ← ACCEPTED (R4 primary)
  -> S81-T-007 Implement R1 (asymmetric Check→Task)    ← COMPLETE / ACCEPTED
  -> S81-T-008 Implement R4 + compact reminder         ← COMPLETE / ACCEPTED
  -> S81-D03 Close Sprint 81                           ← ACCEPTED
```

---

## Task definitions

### S81-T-001 — Forensic current-state activity inventory

- Status: **COMPLETE — ACCEPTED**  
- Record: [S81-T-001](S81-T-001-forensic-current-state-activity-inventory.md)

### S81-T-002 — Learner-action, evidence & feedback model

- Status: **COMPLETE — ACCEPTED**  
- Record: [S81-T-002](S81-T-002-learner-action-evidence-feedback-model.md)

### S81-T-003 — Current learner interaction needs assessment

- Status: **COMPLETE — ACCEPTED**  
- Record: [S81-T-003](S81-T-003-current-learner-interaction-needs-assessment.md)

### S81-T-004 — Candidate representation options for unmet interaction needs

- Status: **COMPLETE — ACCEPTED**  
- Record: [S81-T-004](S81-T-004-candidate-representation-options-for-unmet-needs.md)

### S81-T-005 — Sprint 81 recommendation and decision gate

- Status: **COMPLETE — ACCEPTED**  
- Record: [S81-T-005](S81-T-005-sprint-81-recommendation-and-decision-gate.md)  
- Decision: [S81-D02](decisions.md#s81-d02--b-targeted-enhancement-narrowed)

### S81-T-006 — Revision co-access design validation: R3 vs R4

- Status: **COMPLETE — ACCEPTED** (R4 primary)  
- Record: [S81-T-006](S81-T-006-revision-co-access-design-validation-r3-vs-r4.md)

### S81-T-007 — Implement R1 learner Task ↔ Check navigation

- Status: **COMPLETE / ACCEPTED** (asymmetric: Check→Task only)  
- Record: [S81-T-007](S81-T-007-implement-r1-task-check-navigation.md)  
- Gate: `npm run test:first-class` → **339/339**

### S81-T-008 — Implement R4 revision-pass accompaniment

- Status: **COMPLETE / ACCEPTED**  
- Record: [S81-T-008](S81-T-008-implement-r4-revision-criterion-accompaniment.md)  
- Gate: `npm run test:first-class` → **339/339**

---

## Explicitly not in Sprint 81

- Surface-family / widget-mapping architecture  
- Learner-workspace overhaul  
- R3 primary, R5 dual-pane, T5, C3  
- Criterion→field mapping / free-text-table diagnosis engine  
- **Maths Entry / mathematical learner input** (future pointer only)
