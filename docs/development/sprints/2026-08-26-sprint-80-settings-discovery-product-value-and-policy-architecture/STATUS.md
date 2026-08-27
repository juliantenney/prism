# Sprint 80 — Status

**Last updated:** 2026-08-26  
**Sprint status:** **OPEN**  
**Theme:** Settings Discovery, Product Value and Policy Architecture  
**Opening decision:** [S80-D01](decisions.md#s80-d01--open-sprint-80--settings-discovery-product-value-and-policy-architecture)  
**Start here:** [SPRINT-80-START-HERE.md](SPRINT-80-START-HERE.md)

---

## Snapshot

| Field | Value |
| ----- | ----- |
| Objective | Decide whether Settings exist, what they are for, and how policy should work — against **current** PRISM architecture |
| Sprint type | Discovery / planning only |
| Sprint 79 | CLOSED |
| DLA Phase D | COMPLETE (canonical-only DLA) |
| GAM | Canonical-only (S79) |
| Current task | **S80-T-007 PLAN delivered** — awaiting operator review + answers to Q1–Q4 |
| Last completed | **S80-T-007** — Adjustments target architecture and implementation plan (S1–S10) |
| Prior | T-001…T-004 ACCEPTED; T-005B.2 ACCEPTED; T-005 / T-005A / T-005B / T-005B.1 delivered (acceptance may still be pending) |
| Operator gate | **S80-T-006 PASSED** (operator decision recorded 2026-08-27) |
| Product direction A/B/C/D | **Option C — substantially redesign: Settings → Adjustments** |

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
| S80-T-007 | Target architecture + implementation plan | **PLAN** — awaiting operator review (Q1–Q4) |
| S80-T-008 | Final review + discovery sprint closure | PENDING |

---

## Non-negotiables

- No Settings runtime activation “because the control exists.”
- No DLA / GAM / PEL / Design Page redesign or retune.
- No schema migration / validator changes.
- No Workspace Surfaces work.
- Existing catalogue is **not** assumed authoritative — now **superseded product design** (T-006).
- A/B/C/D is **closed**: Option C (Adjustments) adopted at T-006.
- Adjustments' two mechanisms (typed parameters / per-step instruction) must **not** be merged into one catalogue.
- No parameter ships until its declared runtime contract is actually honoured — no repeat of persisted-but-inert.
- Author instructions must **not** override schemas, validators, typed parameters, upstream artefacts, topology or canonical requirements.
- **No new AI interpretation call** for Adjustments; structured parameters editable without model capability.
- Parameters must **not** alter workflow topology or capability.
- **Defect D1 (hardcoded DLA timing text) must be resolved before Duration ships.**
- T-007 is design/planning; implementation requires explicit slice authorisation.
- **T-006 §17C is superseded by T-007 §1.1:** the projection chokepoint is `buildWorkflowStepInstructions` (`app.js:33394`) + `buildLiveGamV2CopyPromptViaCanonicalAssembler` (`33293`) — **not** `applyWorkflowStepRuntimePromptAugmentations` (`15990`).
- Do **not** revive `selectedOptions` / `{{option:}}` (`app.js:5373`, `6104`) to activate assessment parameters — Create-time bake path and legacy plumbing.
- Episode Plan gets **no** Additional Instruction field (deterministic derive).
- Audience ships as **free text** in v1; the learner-level enum is deferred.
- T-005A / T-005B / T-005B.1 do **not** authorise parameterisation implementation.
- T-005B's provisional v1 parameter surface is **evidence for T-006**, not an approved design.
- T-005B.1's parameterisation-relevance classification is **evidence only** — **superseded by T-006 §8** for the v1 candidate set.
- T-005B.2 is **diagnostic only**. Its two recorded defects (canonical-DLA cognition bypass; hardcoded DLA duration literals) remain **recorded, not fixed** — scheduled as T-007 slices S12 and S1.
- T-005B.2's "candidate for Adjustments" column did not choose the surface — **T-006 §2–§8 is now authoritative**.
