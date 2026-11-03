# Sprint 94 — Implementation map

**Status:** **CLOSED — ACCEPTED** (2026-11-03)  
**Sprint:** 94 — Learning Journey Continuity  
**Opening:** [S94-D01](decisions.md#s94-d01--open-sprint-94--learning-journey-continuity)  
**Close:** [S94-D07](decisions.md#s94-d07--close-sprint-94--learning-journey-continuity-accepted)  
**Contract:** [S94-D02](decisions.md#s94-d02--retain-existing-commission-fields-p-1) … [S94-D06](decisions.md#s94-d06--author-only-inspectability-p-5)  
**Charter:** [SPRINT-94-CHARTER.md](SPRINT-94-CHARTER.md)  
**Closure:** [SPRINT-94-CLOSURE.md](SPRINT-94-CLOSURE.md)

This map records the accepted contract and work-package sequence. Do not add work packages.

---

## Current posture

```text
Sprint 93                             CLOSED — ACCEPTED — do not reopen
Sprint 94                             CLOSED — ACCEPTED (S94-D07)
Contract P-1…P-5 (S94-D02…D06)        ACCEPTED
WP0…WP6                               COMPLETE
Production code                       Continuity contract landed
Interactive V2 / PB-FA-019            OUT OF SCOPE
Unified LJ runtime                    OUT OF SCOPE → Sprint 95
```

---

## Established architecture (reuse)

```text
LJ Steps 1–4 (same chat)
  → Step 5 Design Page (commissions[])
  → Authoring Create
  → commissionToIntakeEnvelope
  → intakeCommission
  → applyAcceptedCommissionIntake
  → ordinary product workflow
```

| Layer | File / function | Role today |
| ----- | --------------- | ---------- |
| Commissioning prose | `lib/learning-journey-sibling-prompts.js` (`learning_commissions`) | Asks for self-contained commissions, including what they build on |
| Design Page | `lib/learning-journey-design-page.js` | Compresses into `specification_text` (required), `journey_context_text` / `dependencies` (optional) |
| Envelope | `commissionToIntakeEnvelope` | Maps those fields; context falls back to `learning_journey.continuity` |
| Intake | `lib/first-class-commission-intake.js` | Stores spec/context/deps on `deliverySeed` / `createSeed`; Interactive inputs omit journey context |
| Situated Task bind | `composeSituatedTaskOriginalBrief` in `app.js` | Wrapper over shared composer; Situation still uses `{{ORIGINAL_BRIEF}}` |
| Shared composer | `composeCommissionedOriginalBrief` in `app.js` | Labelled COMMISSION SPECIFICATION / LEARNING JOURNEY CONTEXT / EDUCATIONAL DEPENDENCIES from stored intake fields |
| Runtime delivery | `applyCommissionedOriginalBriefDelivery` in `resolveStepPromptText` | Delivers labelled brief + WP4 honour to earliest commissioned stages; learner-copy stages also receive the WP5 bring-forward instruction; token path retains the materialised brief and adds instructions once |
| Honour instruction | `composeCommissionedContextHonourInstruction` in `app.js` | Commission-only educational contract for established facts, new evidence, no invented scenario, learner-owned bring-forward, and Assessment Pack Grounding-context clarification |
| Learner-facing copy | `composeCommissionedLearnerFacingBringForwardInstruction` in `app.js` | Commission-only instruction for one learner-facing bring-forward in existing `activity_preamble` / opening `exposition` / `learner_context.bring_forward`; not inferred from scenario or dependency IDs alone |

---

## Accepted continuity contract

Authoritative: [S94-D02](decisions.md#s94-d02--retain-existing-commission-fields-p-1) … [S94-D06](decisions.md#s94-d06--author-only-inspectability-p-5).

### Fields (S94-D02 / P-1)

Use the existing three fields. Do not add a structured continuity object unless implementation later proves they cannot carry the contract.

| Field | Use |
| ----- | --- |
| `specification_text` | This component’s educational job and constraints |
| `journey_context_text` | Established scenario facts **or** an explicit no-shared-scenario statement; relevant preceding learner activities; what learners should bring forward |
| `dependencies` | Short pointer to earlier `commission_id`s / experience ids |

The contract must distinguish job, established facts, preceding activities, and bring-forward. Those distinctions live in the field contents and prompt/validator guidance, not in new schema keys.

### Recurring scenario (S94-D03 / P-2)

The contract must distinguish:

1. **Established scenario facts** that later components must preserve.  
2. **Deliberately no recurring scenario** — stated explicitly; do not invent locked options.  
3. **Omitted required continuity** — validation failure, not a legitimate empty case.

Later components may add new evidence or developments. They must not contradict established facts.

### Preceding activities (S94-D04 / P-3)

Later commissions must describe relevant earlier components and what those components **asked learners to do**. Generic “Continue the previous scenario” is insufficient. Validation checks for meaningful context, not a non-empty string. Only educationally relevant predecessors need naming.

**Limitation:** commissions describe intended learner activities. They do not prove published resource content. Later components must not assume they have inspected previous outputs or know individual responses.

First commission in journey order may omit preceding-activity context.

### Handoff (S94-D05 / P-4)

Reuse the Situated Task labelled-brief pattern.

1. Design Page / Step 4–5 guidance preserves the contract through synthesis.  
2. Validator rejects omitted or generic later-commission context.  
3. Intake composes the labelled blocks for commissioned products.  
4. Interactive, Expository, and Assessment Pack receive those blocks at the **earliest relevant content-generating stages**. For Assessment Pack that includes prefixed Generate Learning Content, Model Knowledge, and Define Learning Outcomes where those stages exist — not only Interpret Evidence Purpose.  
5. Existing pipeline stages remain. Standalone Create omits the blocks.

### Visibility (S94-D06 / P-5)

Authors inspect the contract through existing Authoring / commissioning conventions. Published learner home and constituent ZIP must not dump `specification_text` / `journey_context_text` / `dependencies`. Learner-facing bring-forward instructions derived from the contract are allowed.

---

## Work packages (sequence unchanged)

| WP | Focus | Status |
| -- | ----- | ------ |
| WP0 | Pack + agree contract (P-1…P-5) | **COMPLETE** |
| WP1 | Learning Journey Design Page + Step 4/5 prompt guidance | **COMPLETE** |
| WP2 | Validator + author inspectability | **COMPLETE** |
| WP3 | Shared intake / ORIGINAL_BRIEF composition for all commissioned products | **COMPLETE** |
| WP4 | Interactive, Expository, Assessment Pack first-stage honour | **COMPLETE** |
| WP5 | Learner-facing bring-forward copy where a later component depends on earlier work | **COMPLETE** |
| WP6 | Tests + *Making Decisions Under Uncertainty* regression | **COMPLETE** |

All work packages complete. Sprint closed under [S94-D07](decisions.md#s94-d07--close-sprint-94--learning-journey-continuity-accepted).

### Task index

| ID | Title | WP | Status |
| -- | ----- | -- | ------ |
| S94-T-001 | Open sprint + implementation map | WP0 | **COMPLETE** |
| S94-T-002 | Agree P-1…P-5 (S94-D02…D06) | WP0 | **COMPLETE** |
| S94-T-003 | Design Page / commissioning prompt: emit locked facts + preceding activities | WP1 | **COMPLETE** |
| S94-T-004 | Validator: later commissions cannot silently drop required context | WP2 | **COMPLETE** |
| S94-T-005 | Author-facing inspectability (not learner ZIP) | WP2 | **COMPLETE** |
| S94-T-006 | Intake: compose binding brief for Interactive / Expository / Assessment Pack | WP3 | **COMPLETE** |
| S94-T-007 | First-stage prompts honour the brief; standalone paths unchanged | WP4 | **COMPLETE** |
| S94-T-008 | Learner-facing bring-forward wording | WP5 | **COMPLETE** |
| S94-T-009 | Regression tests + live verification notes | WP6 | **COMPLETE** |

---

## Acceptance criteria

Sprint 94 is complete when:

1. Relevant later commissions contain authoritative shared scenario information when the journey has established facts, **or** an explicit no-recurring-scenario statement.  
2. Later commissions contain **meaningful** descriptions of relevant earlier learner activities (not generic continuation).  
3. That information reaches the **actual generation prompts** of independently commissioned Interactive, Expository, Assessment Pack, and Situated Task workflows, from the earliest relevant content-generating stage (Assessment Pack prefix stages included where they exist).  
4. Later components preserve established scenario facts while still allowing new evidence or legitimate educational progression.  
5. Prompts and learner-facing copy do **not** assume access to earlier generated/published outputs or to individual learner responses.  
6. Learner-facing instructions refer to the learner’s own earlier work where a bring-forward is required.  
7. Standalone (uncommissioned) product workflows remain unaffected.  
8. Existing Learning Journey assembly, production status, and ZIP publication continue working.  
9. Interactive V1 activity expansion / transfer beats are unchanged (recorded for PB-FA-019, not fixed here).

---

## Verification approach

**Regression case:** seven-component test journey *Making Decisions Under Uncertainty*.

C1 established a decision among:

- longer library opening hours;
- additional study spaces;
- improved online support.

Verify:

| Check | How |
| ----- | --- |
| Locked options survive | Later commission JSON and live first-stage prompts still name those three options |
| Meaningful preceding activities | Later prompts describe what relevant earlier components asked learners to do; “Continue the previous scenario” fails |
| No-shared-scenario journeys | Explicit statement present; no invented locked options; omitted context still fails validation |
| New evidence allowed | A later component may add evidence about the same decision; it must not replace the options |
| No output or response access | No prompt or learner page claims inspection of previous published resources or stored answers from another component |
| Binding in generation | Commissioned Interactive / Expository / Assessment Pack earliest content-generating stages (including AP prefix stages) contain the labelled continuity blocks |
| Standalone products | Direct Create Interactive / Expository / Assessment Pack / Situated Task prompts omit LJ continuity blocks |
| Assembly / ZIP | Existing LJ package tests remain green; home-page editorial/video behaviour unchanged; commissioning metadata not dumped into learner home or ZIP |
| Author inspectability | Author can see the contract in existing Authoring conventions; no new inspection system unless those surfaces cannot show it |

Do **not** regenerate the whole seven-component journey as a discovery experiment. Use the established C1 scenario as a regression fixture and, where a live later component already exists, inspect its first-stage prompt after the handoff change.

**Automated tests (planned, not written):**

- Design Page / validator: later commission missing or generic context fails; first commission without preceding context passes; explicit no-shared-scenario journey passes; omitted required continuity fails.  
- Intake: Interactive / Expository / Assessment Pack commissioned briefs contain COMMISSION SPECIFICATION + LEARNING JOURNEY CONTEXT (+ dependencies when present) at earliest content-generating stages.  
- Situated Task existing handoff tests remain green.  
- Standalone family build does not grow continuity blocks.  
- Existing LJ package / commissioning-preview tests remain green, except agreed author-only inspectability that still keeps metadata out of ZIP.

---

## Owning layer

Change the **commissioning contract and first-stage brief**, not the Interactive episode-plan grammar, DLA, or transfer beats.

---

## Out of scope (do not absorb)

PB-FA-019 Interactive V2; learner-response transport; unified runtime; home-page redesign; slideshow; graphics-to-embed; Assessment Pack calibration; jazz thirteen-product assembly.
