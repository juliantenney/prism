# Sprint 80 — Status

**Last updated:** 2026-08-28  
**Sprint status:** **CLOSED**  
**Theme:** Settings Discovery, Product Value and Policy Architecture  
**Opening decision:** [S80-D01](decisions.md#s80-d01--open-sprint-80--settings-discovery-product-value-and-policy-architecture)  
**Closeout:** [S80-T-008](S80-T-008-working-alpha-boundary-audit-and-sprint-80-closeout.md) — **ACCEPTED** 2026-08-28  
**Product status:** **WORKING ALPHA** (first-class self-study / workshop; boundary = T-008)  
**Start here:** [SPRINT-80-START-HERE.md](SPRINT-80-START-HERE.md)

---

## Snapshot

| Field | Value |
| ----- | ----- |
| Objective | Decide whether Settings exist, what they are for, and how policy should work — against **current** PRISM architecture |
| Sprint type | Discovery / planning, plus authorised implementation slices S1–S8 |
| Sprint 79 | CLOSED |
| Sprint 80 | **CLOSED** (2026-08-28) |
| Product | **WORKING ALPHA** — first-class self-study and workshop paths |
| Alpha boundary | Exactly as established by [S80-T-008](S80-T-008-working-alpha-boundary-audit-and-sprint-80-closeout.md) |
| DLA Phase D | COMPLETE (canonical-only DLA) |
| GAM | Canonical-only (S79) |
| Current task | **None — sprint closed.** D-014 confidence **RESOLVED** (`npm run test:first-class`). Next product programme: **learner-page accessibility** |
| Last completed | Formal closeout: S5–S8 **ACCEPTED**; T-008 **ACCEPTED**; Sprint 80 **CLOSED** |
| Operator gate | **S80-T-006 PASSED** (Option C — Adjustments) |
| Product direction A/B/C/D | **Option C — Settings → Adjustments** (delivered) |

---

## Task board

| ID | Title | Status |
| -- | ----- | ------ |
| S80-T-001 | Sprint opening + Settings history / current-state diagnostic | **COMPLETE — ACCEPTED** |
| S80-T-002 | Existing Settings catalogue + provenance + supersession audit | **COMPLETE — ACCEPTED** |
| S80-T-003 | Settings product value, catalogue philosophy and UX framing | **COMPLETE — ACCEPTED** |
| S80-T-004 | Policy authority / stage ownership architecture options | **COMPLETE — ACCEPTED** |
| S80-T-005 | Persistence, lifecycle and compatibility options | **COMPLETE** (awaiting acceptance unless separately accepted) |
| S80-T-005A | Elicitation-to-workflow-to-Run parameterisation diagnostic | **COMPLETE** (awaiting acceptance) |
| S80-T-005B | Minimal runtime parameter contract diagnostic | **COMPLETE** (awaiting acceptance) |
| S80-T-005B.1 | Complete brief-factor inventory and resolution diagnostic | **COMPLETE** (awaiting acceptance; corrected by T-005B.2) |
| S80-T-005B.2 | Resolved brief-factor effectiveness / live-consumer audit | **COMPLETE — ACCEPTED** |
| S80-T-006 | Operator product/architecture decision gate | **DECIDED** — Option C (Adjustments) |
| S80-T-007 | Target architecture + implementation plan | **PLAN — ACCEPTED** |
| S80-T-009 | Goal vs Topic runtime-authority diagnostic | **ACCEPTED** as evidence; operator adopted Option E |
| S80-S5 | Goal authority repair + Goal Adjustment (D4/D5/D6 fixed) | **COMPLETE — ACCEPTED** |
| S80-S6 | Duration parameter + D1 hardcoded DLA timing repair | **COMPLETE — ACCEPTED** |
| S80-T-010 | Audience / learner-level runtime parameter diagnostic | **ACCEPTED** as evidence; operator authorised Audience as free text |
| S80-S7 | Audience governed workflow parameter (D13/D16 fixed) | **COMPLETE — ACCEPTED** |
| S80-T-011 | Design Assessment topology and CAI relationship diagnostic | **ACCEPTED** as evidence (CAI-first Assessment Adjustments) |
| S80-T-012 | CAI Assessment Adjustment contract diagnostic | **ACCEPTED** as evidence; Option B delivered as S80-S8 |
| S80-S8 | Assessment Adjustments v1 (Quantity + Difficulty) | **COMPLETE — ACCEPTED** |
| S80-T-008 | Working-alpha boundary audit + Sprint 80 closeout | **COMPLETE — ACCEPTED** (WORKING ALPHA; sprint CLOSED) |

---

## Implementation slice board

All authorised Sprint 80 slices **S1–S8 are COMPLETE — ACCEPTED**. Sprint 80 does **not** reopen for remaining debt.

| Slice | Title | Status | Record |
| ----- | ----- | ------ | ------ |
| **S1** | Minimal Adjustments parameter registry + persistence contract | **COMPLETE — ACCEPTED** | [S80-S1](S80-S1-adjustments-parameter-registry-and-persistence.md) |
| **S2** | Topic vertical proof | **COMPLETE — ACCEPTED** | [S80-S2](S80-S2-topic-vertical-proof.md) |
| **S3** | Generic per-step Additional Instruction | **COMPLETE — ACCEPTED** | [S80-S3](S80-S3-per-step-additional-instruction.md) |
| **S4** | Adjustments UI repurpose | **COMPLETE — ACCEPTED** | [S80-S4](S80-S4-adjustments-ui-repurpose.md) |
| **S5** | Goal authority repair + Goal Adjustment | **COMPLETE — ACCEPTED** | [S80-S5](S80-S5-goal-authority-and-goal-adjustment.md) |
| **S6** | Duration parameter + D1 timing repair | **COMPLETE — ACCEPTED** | [S80-S6](S80-S6-duration-parameter-and-d1-timing-repair.md) |
| **S7** | Audience governed workflow parameter (D13/D16 fixed) | **COMPLETE — ACCEPTED** | [S80-S7](S80-S7-audience-governed-workflow-parameter.md) |
| **S8** | Assessment Adjustments v1 (Quantity + Difficulty; CAI-gated) | **COMPLETE — ACCEPTED** | [S80-S8](S80-S8-assessment-adjustments-quantity-difficulty.md) |

**Post-alpha sequencing (operator, 2026-08-28 — does not reopen Sprint 80):**

1. **D-014** confidence **RESOLVED** (RC1/RC2; gate `npm run test:first-class`). Record: [D-014 §11](../../governance/D-014-test-suite-confidence-diagnostic.md).
2. Next substantive product programme: **learner-page accessibility**.

Former planned S9–S11 (Settings cleanup / regression / closure docs) and other T-008 §16 items remain **post-alpha** backlog candidates outside this sprint. They are not Sprint 80 work.

**Numbering note (S80-S6 §22, extended by S7/S8).** Goal = S5, Duration = S6, Audience = S7, Assessment Adjustments = S8. T-007's earlier slice numbers for Duration/Audience/Assessment are superseded.

### Live behaviour introduced

| Slice | Live? |
| ----- | ----- |
| S1 | **No.** Contract, resolver and persistence only; projects nothing on its own. |
| S2 | **Yes.** Topic is model-visible in all 8 model-driven steps and overridable per run without regenerating the workflow. |
| S3 | **Yes.** A per-step author instruction is model-visible when that step runs. Byte-identical when unset. |
| S4 | **Yes, narrowly.** The panel became Adjustments (no prompt effect). Two authorised model-visible changes only: Episode Plan now consumes an Additional Instruction, and step 1 omits the commissioned `Goal:` when Topic is explicitly adjusted. |
| S5–S8 | **Yes.** Goal, Duration, Audience, and (when CAI present) Number of items + Difficulty are governed Adjustments parameters. |

Focused S80 suite at closeout: **229/229**. Full-suite failing locations at S8: **393** (zero new vs prior baseline; **D-014**).

---

## Closeout non-negotiables (binding after CLOSED)

- Sprint 80 is **CLOSED**. Remaining architectural debt is **post-alpha** and does **not** reopen this sprint.
- Supported alpha boundary remains exactly [S80-T-008](S80-T-008-working-alpha-boundary-audit-and-sprint-80-closeout.md).
- Do not expand Adjustments (Question Type, learner level, etc.) under a Sprint 80 label.
- Do not treat historical Settings machinery cleanup as Sprint 80 unfinished work.
- Next immediate engineering signal: `npm run test:first-class` (**D-014 resolved**).
- Next substantive product programme: **learner-page accessibility**.

---

## Historical non-negotiables (from delivery; retained for archive)

- No Settings runtime activation “because the control exists.”
- A/B/C/D is **closed**: Option C (Adjustments) adopted at T-006 and delivered.
- Adjustments' two mechanisms (typed parameters / per-step instruction) must **not** be merged into one catalogue.
- No parameter ships until its declared runtime contract is actually honoured.
- Author instructions must **not** override schemas, validators, typed parameters, upstream artefacts, topology or canonical requirements.
- **No new AI interpretation call** for Adjustments.
- Parameters must **not** alter workflow topology or capability.
- Registry allowlist at close: `topic`, `goal`, `duration_minutes`, `audience`, `assessment_item_count`, `assessment_difficulty_profile` (last two CAI-gated).
- Only the **`workflowContext`** projection strategy is implemented.
- Historical pack Settings catalogue removed from active UI (S4); code retained inert — cleanup is post-alpha.
- `step.notes` (**Instructions**) remains a supported capability distinct from `step.additional_instruction`.
- Audience is free text; learner level deferred (D14).
- Assessment Adjustments are CAI-first; DA not required for ordinary first-class resources (T-011/T-012/S8).
