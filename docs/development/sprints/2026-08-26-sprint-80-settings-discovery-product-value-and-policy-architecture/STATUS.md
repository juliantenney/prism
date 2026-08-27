# Sprint 80 — Status

**Last updated:** 2026-08-27  
**Sprint status:** **OPEN**  
**Theme:** Settings Discovery, Product Value and Policy Architecture  
**Opening decision:** [S80-D01](decisions.md#s80-d01--open-sprint-80--settings-discovery-product-value-and-policy-architecture)  
**Start here:** [SPRINT-80-START-HERE.md](SPRINT-80-START-HERE.md)

---

## Snapshot

| Field | Value |
| ----- | ----- |
| Objective | Decide whether Settings exist, what they are for, and how policy should work — against **current** PRISM architecture |
| Sprint type | Discovery / planning, plus explicitly authorised implementation slices (S1, S3, S2, S4) |
| Sprint 79 | CLOSED |
| DLA Phase D | COMPLETE (canonical-only DLA) |
| GAM | Canonical-only (S79) |
| Current task | **S80-S7 implemented** (Audience as the fourth governed workflow parameter) — awaiting operator review |
| Last completed | **S80-S7**; S80-S6 and S80-S5 implemented; S80-T-009 / S80-T-010 ACCEPTED as evidence; S80-S1…S4 ACCEPTED |
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
| S80-T-007 | Target architecture + implementation plan | **PLAN — ACCEPTED** |
| S80-T-009 | Goal vs Topic runtime-authority diagnostic | **ACCEPTED** as evidence; operator adopted Option E |
| S80-S5 | Goal authority repair + Goal Adjustment (D4/D5/D6 fixed) | **IMPLEMENTED** — awaiting review |
| S80-S6 | Duration parameter + D1 hardcoded DLA timing repair | **IMPLEMENTED** — awaiting review |
| S80-T-010 | Audience / learner-level runtime parameter diagnostic | **ACCEPTED** as evidence; operator authorised Audience as free text |
| S80-S7 | Audience governed workflow parameter (D13/D16 fixed) | **IMPLEMENTED** — awaiting review |
| S80-T-008 | Final review + discovery sprint closure | PENDING |

---

## Implementation slice board

Authorised and implemented: S1, S3, S2, S4, S5, S6, S7. No other slice has been
started.

**Numbering note (S80-S6 §22, extended by S7).** T-007's plan labelled *Duration
+ D1* as "S5" and *Audience* as "S6". Delivery order changed: the Goal authority
repair took the S5 number, so **Duration + D1 is S80-S6** and **Audience is
S80-S7**. There is exactly one S5 (Goal), one S6 (Duration) and one S7
(Audience). The remaining planned slices are listed by name below rather than by
their superseded T-007 numbers, so no number is used twice.

| Slice | Title | Status | Record |
| ----- | ----- | ------ | ------ |
| **S1** | Minimal Adjustments parameter registry + persistence contract | **COMPLETE — ACCEPTED** | [S80-S1](S80-S1-adjustments-parameter-registry-and-persistence.md) |
| **S2** | Topic vertical proof | **COMPLETE — ACCEPTED** | [S80-S2](S80-S2-topic-vertical-proof.md) |
| **S3** | Generic per-step Additional Instruction | **COMPLETE — ACCEPTED** | [S80-S3](S80-S3-per-step-additional-instruction.md) |
| **S4** | Adjustments UI repurpose | **COMPLETE** | [S80-S4](S80-S4-adjustments-ui-repurpose.md) |
| **S5** | Goal authority repair + Goal Adjustment | **COMPLETE** | [S80-S5](S80-S5-goal-authority-and-goal-adjustment.md) |
| **S6** | Duration parameter + D1 timing repair | **COMPLETE** | [S80-S6](S80-S6-duration-parameter-and-d1-timing-repair.md) |
| **S7** | Audience governed workflow parameter (D13/D16 fixed) | **COMPLETE** | [S80-S7](S80-S7-audience-governed-workflow-parameter.md) |
| Assessment | Assessment minimal parameter set (T-007 planned slice "S7") | NOT STARTED | — |
| S8 | Remove/hide superseded Settings controls | NOT STARTED | — |
| S9 | Behavioural regression/extension tests | NOT STARTED | — |
| S10 | Closure / documentation | NOT STARTED | — |

**S1 + S2 + S3 + S4 test totals:** 83 tests added (16 + 20 + 19 + 28), all
passing. Focused set including the affected settings-UI suites: **155/155**.
Measured against a pristine worktree at the pre-implementation commit `9cf0f1d`:
**zero new failing locations** (full suite 3785/412 fail → 3840/**393 fail**;
targeted serial set 72 → **55** failing locations). The large absolute count is
pre-existing **D-014** baseline instability, identical at HEAD.

### Live behaviour introduced

| Slice | Live? |
| ----- | ----- |
| S1 | **No.** Contract, resolver and persistence only; projects nothing on its own. |
| S2 | **Yes.** Topic is model-visible in all 8 model-driven steps and overridable per run without regenerating the workflow. |
| S3 | **Yes.** A per-step author instruction is model-visible when that step runs. Byte-identical when unset. |
| S4 | **Yes, narrowly.** The panel became Adjustments (no prompt effect). Two authorised model-visible changes only: Episode Plan now consumes an Additional Instruction, and step 1 omits the commissioned `Goal:` when Topic is explicitly adjusted. |

**S2 prompt delta (intended, per T-006):** Topic moved from first-step-only to
every model-driven step. 8 prompts gain a compact authoritative-parameter block;
Episode Plan gains nothing; no other model-visible text changed; no goldens
refreshed.

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
- T-007 is design/planning; implementation requires explicit slice authorisation. **S1, S3, S2 and S4 are authorised and complete; every other slice still requires authorisation.**
- The registry is a deliberate allowlist. It currently declares **`topic`, `goal`, `duration_minutes` and `audience`**, and the shipped contents are asserted exactly. Adding a declaration is not the same as authorising its projection.
- Only the **`workflowContext`** projection strategy is implemented (S2). A `stepScoped` declaration would persist and resolve but project nothing — guarded by test.
- **S4 split the eligibility predicate.** `isWorkflowStepEligibleForAdditionalInstruction` governs steering (**every** step, Episode Plan included); `isWorkflowStepEligibleForWorkflowContextProjection` governs typed-parameter projection (Episode Plan still excluded as a derived shell). "Deterministic" is no longer a steering disqualifier.
- The historical pack-derived Settings catalogue is **removed from the active UI** (S4) but its parsing/storage code is **deliberately retained** and unreferenced. Deeper retirement is separate work.
- `step.notes` (**Instructions**) is a **supported capability**, not legacy. It must not be merged into or migrated to `step.additional_instruction`.
- Topic projection must stay **compact**. The block is asserted at ≤ 5 lines and must not restate the workflow brief.
- Precedence is structural and asserted: typed workflow parameters (S2) always precede and outrank per-step Additional Instruction (S3). No AI conflict detection.
- **T-006 §17C is superseded by T-007 §1.1:** the projection chokepoint is `buildWorkflowStepInstructions` (`app.js:33394`) + `buildLiveGamV2CopyPromptViaCanonicalAssembler` (`33293`) — **not** `applyWorkflowStepRuntimePromptAugmentations` (`15990`).
- Do **not** revive `selectedOptions` / `{{option:}}` (`app.js:5373`, `6104`) to activate assessment parameters — Create-time bake path and legacy plumbing.
- ~~Episode Plan gets **no** Additional Instruction field (deterministic derive).~~ **SUPERSEDED by operator correction at S4:** Episode Plan **must** support Additional Instruction, through the same generic storage and shared block helper.
- Audience ships as **free text** in v1 (delivered at S7); the learner-level enum is deferred and its vocabulary debt stays open.
- **S7 removed the step-1 `Audience:` line outright** rather than declaring `supersedesCommissionedContextFields: ["audience"]`. Supersession fires only on provenance `adjustment`, so it could not close D13 for workflows with Audience on Auto. This follows the S5 `Goal:` precedent; the generic supersession mechanism remains live and is proven against `constraints`.
- **`page.audience` now reads the effective governed Audience** (S7, D16). It is still not rendered, so this is metadata correctness.
- The canonical `"audience": "Learners"` shell exemplar is **deliberately retained** (D22). S7 evidence: the field is built deterministically by code, and the exemplar is followed by the authoritative return-verbatim shell embed.
- T-005A / T-005B / T-005B.1 do **not** authorise parameterisation implementation.
- T-005B's provisional v1 parameter surface is **evidence for T-006**, not an approved design.
- T-005B.1's parameterisation-relevance classification is **evidence only** — **superseded by T-006 §8** for the v1 candidate set.
- T-005B.2 is **diagnostic only**. Its two recorded defects (canonical-DLA cognition bypass; hardcoded DLA duration literals) remain **recorded, not fixed** — scheduled as T-007 slices S12 and S1.
- T-005B.2's "candidate for Adjustments" column did not choose the surface — **T-006 §2–§8 is now authoritative**.
