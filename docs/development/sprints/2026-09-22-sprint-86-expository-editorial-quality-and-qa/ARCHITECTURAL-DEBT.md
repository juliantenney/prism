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
| **S86-AD-010** | Learner-facing fallback: “Structured material body is not supported for learner rendering.” | **Functional defect (T-008 root cause).** Renderer supports only compact worked-example (`stages[]`) and diagram (`elements[]`+`relationships[]`) structured XM bodies; other object bodies → `expository_structured_unsupported` via `buildExpositionStructuredMaterial` / `renderUnsupportedStructured` in `lib/learner-renderer-vnext/expository-structured-materials.js`. Five exports; **23** occurrences. Materials ≠ figures by design (diagram graphic = DP VA). Do **not** fix in investigation passes. |
| S86-AD-011 | P2/P8 and P5/P6 overlap candidates | **Resolved in T-007** — overlaps merged into EQ4–EQ6; forward-momentum remains technique note, not separate principle |
| S86-AD-012 | Representation over-generation on low-visual briefs | **Case-sensitive** (C02 strong; C05 mild; C03 warranted). Captured in **EQ5** |
| S86-AD-013 | QA: “remove image ⇒ understanding must fall” vs accessible semantic equivalence | **v0.2 candidate**; rejected heuristic recorded in EQ5. QA v0.1 unmodified |
| S86-AD-014 | Interpretive / disagreement briefs → neighbouring single-model spine | **EQ1**; C04 supported; C05 qualifies universality. **T-008:** EJP is primary owner but typed purpose/epistemic-form transport **missing**; XD cannot replan |
| S86-AD-015 | “Instructional > editorial” not universal | **T-007 refined:** holds when purpose-fit holds; C04 is instructional EQ1 failure |
| S86-AD-016 | Structured-material commissions ≠ learner-facing figures 1:1 | **T-008 confirmed; T-009 preserves as desirable.** Option B links VA→commission optionally without forcing 1:1 |
| S86-AD-017 | Systematic editorial furniture / dual close / flat hierarchy | **T-007/T-008.** WP5/T-010 next for hierarchy/typography |
| S86-AD-018 | EQ1 typed purpose / epistemic-form ownership absent from contracts | **T-008.** Outside T-009 scope |
| S86-AD-019 | Design Page owned patch list includes `sections` | **T-008.** Must-not fragility |
| S86-AD-020 | EQ5 seam: soft post-hoc integration | **T-009:** recommend Option B (perceptibility + participation intent + deterministic VA↔commission binding). No new AI stage. Implementation deferred to successor design (T-011) |

## Explicitly out of sprint (at open / this pass)

- Production editorial implementation  
- CSS/font selection  
- Fixed chapter templates  
- Numerical QA score programmes  
- Reopening S83–S85  
- New AI stages assumed for XD/XM integration  
- Generating validation cases C02–C05 before S86-T-006 authorisation  
- Fixing S86-AD-010 in this investigation pass  
