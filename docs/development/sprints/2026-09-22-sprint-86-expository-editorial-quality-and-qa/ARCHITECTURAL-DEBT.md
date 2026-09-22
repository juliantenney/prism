# Sprint 86 — Architectural debt ledger

Debt / observations relevant to Sprint 86 scope. **Investigation/design only.**

**Sprint 86 is OPEN (2026-09-22).** Production implementation not authorised.

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
| S86-AD-007 | Typography functional not publishing-grade | **Supported by case 01** (0×H3; UI font stack) — WP5 |
| S86-AD-008 | Research Synthesis identity | Remains with PB-FA-011 — out of S86 scope |
| S86-AD-009 | Expository → Interactive hypothesis | Out of S86 scope |

## New evidence-backed findings (case 01 QA)

| ID | Finding | Notes |
| -- | ------- | ----- |
| **S86-AD-010** | Learner-facing fallback: “Structured material body is not supported for learner rendering.” (**×7** in preserved Bayes export) | **Functional/rendering defect** discovered via QA — **not** an editorial-quality finding. Do **not** fix in T-001…T-005. Do not let it dominate editorial assessment. Bounded handling later. |
| S86-AD-011 | P2/P8 and P5/P6 overlap candidates; missing “forward momentum / section joints” candidate | Working model notes in [WP1-FINDINGS.md](WP1-FINDINGS.md) — await cross-case challenge |

## Explicitly out of sprint (at open / this pass)

- Production editorial implementation  
- CSS/font selection  
- Fixed chapter templates  
- Numerical QA score programmes  
- Reopening S83–S85  
- New AI stages assumed for XD/XM integration  
- Generating validation cases C02–C05 before S86-T-006 authorisation  
- Fixing S86-AD-010 in this investigation pass  
