# Sprint 86 — Architectural debt ledger

Debt / observations relevant to Sprint 86 scope. **Investigation/design only.**

**Sprint 86 is COMPLETE / CLOSED (2026-09-22).** Production implementation was **not** authorised in S86. First-slice functional/editorial work (including AD-010) is scheduled for a **successor implementation sprint** per [T-011](T-011-SUCCESSOR-IMPLEMENTATION-DESIGN.md) / [T-012](T-012-SPRINT-86-CLOSURE.md).

## Protected prior programme state

| Item | State |
| ---- | ----- |
| Alpha development | **Complete** |
| Sprint 83–84 | **CLOSED** — Expository architecture accepted |
| Sprint 85 | **COMPLETE / CLOSED** — functional Expository delivered |
| First-class gate | **339/339** |
| Interactive prompt family | **Protected** ([S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline)) |
| S85 closure distinction | Functional **yes**; polished presentation **not claimed** |

## Binding (not debt)

| Source | Constraint |
| ------ | ---------- |
| S86-D01 | Investigation/design only at open |
| S84-D03…D12 | Topology/authority — do not reopen without compelling evidence |
| S83-D04 | Sibling family; do not edit Interactive prompts for Expository |

## Carried from S85 (non-blocking — investigation inputs)

| ID | Finding | Notes |
| -- | ------- | ----- |
| S86-AD-001 | Front matter can feel mechanical/repetitive | **Supported by case 01** — QA D8/D9 |
| S86-AD-002 | Overview / purpose / summary / body / closing redundancy | **Supported by case 01** — QA D7/D10 |
| S86-AD-003 | Generated prose rhythm / metacommentary | **Supported by case 01** — QA D4 |
| S86-AD-004 | Representations may accompany rather than participate | **Supported by case 01** — QA D5/D6 · WP4 seam |
| S86-AD-005 | Internal artefacts as page furniture | **Supported by case 01** — QA D8 |
| S86-AD-006 | Multiple closures | **Supported by case 01** — QA D10 |
| S86-AD-007 | Typography functional not publishing-grade | **T-010:** requirements recorded — [T-010-TYPOGRAPHY-REQUIREMENTS.md](T-010-TYPOGRAPHY-REQUIREMENTS.md). Implementation design = T-011 |
| S86-AD-008 | Research Synthesis identity | Remains with PB-FA-011 — out of S86 scope |
| S86-AD-009 | Expository → Interactive hypothesis | Out of S86 scope |

## New evidence-backed findings (case 01 QA + T-006…T-011)

| ID | Finding | Notes |
| -- | ------- | ----- |
| **S86-AD-010** | Learner-facing fallback: “Structured material body is not supported for learner rendering.” | T-008 root cause (unsupported structured XM shapes). **RESOLVED in Sprint 87 T-004** ([S87-D05](../2026-09-22-sprint-87-expository-quality-first-successor-implementation/decisions.md#s87-d05--ad-010-structured-material-semantic-rendering)) — specialised + generic semantic fallback; live re-export confirm at S87-T-007. |
| S86-AD-011 | P2/P8 and P5/P6 overlap candidates | **Resolved in T-007** → EQ4–EQ6 |
| S86-AD-012 | Representation over-generation (low-visual) | Case-sensitive (C02/C05/C03). EQ5 |
| S86-AD-013 | “Remove image ⇒ understanding must fall” vs a11y equivalence | QA v0.2 candidate; EQ5 |
| S86-AD-014 | Interpretive briefs → neighbouring spine | EQ1 / C04. **T-011 FIRST slice:** smallest purpose/epistemic-form contract |
| S86-AD-015 | “Instructional > editorial” not universal | Holds when purpose-fit holds; C04 counterexample |
| S86-AD-016 | Materials ≠ figures 1:1 | By design; T-009 Option B optional link. **T-011: later follow-on** |
| S86-AD-017 | Prospectus furniture + dual close | **T-011 FIRST slice:** omit default orientation stack; omit Expository page Closing |
| S86-AD-018 | EQ1 typed ownership absent | Covered by AD-014 / T-011 EQ1 work |
| S86-AD-019 | DP owned fields include `sections` | **T-011 FIRST slice safety:** ignore Expository DP `sections` patch |
| S86-AD-020 | EQ5 soft integration / Option B | Design ready (T-009). **T-011: later follow-on** |
| S86-AD-021 | UI-adjacent presentation | T-010 requirements. **T-011 FIRST slice:** CSS MUST only |

## Explicitly out of sprint (at open / investigation passes)

- Production implementation of T-011 first slice (successor sprint)  
- CSS/font selection beyond T-011 MUST presentation  
- Fixed chapter templates / design-system programme  
- Numerical QA score programmes  
- Reopening S83–S85  
- New AI stages  
- Fixing AD-010 during T-006…T-010 investigation passes (now scheduled in first slice design)  
