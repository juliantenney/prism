# Sprint 56D — Implementation Tasks

**Sprint:** 56D — Design Page Material Preservation Fix  
**Date:** 2026-07-06  
**Status:** Active task list

**Reference:** [Preservation Failure Report](SPRINT-56D-PRESERVATION-FAILURE-REPORT.md) · [Context Locks](SPRINT-56D-CONTEXT-LOCKS.md) · [Open Questions](SPRINT-56D-OPEN-QUESTIONS.md) · [Test Plan](SPRINT-56D-TEST-PLAN.md)

---

## Path model

Two paths must be kept distinct:

| Path | Definition | Default assumption for workflow reproduction |
| ---- | ---------- | -------------------------------------------- |
| **Workflow runtime path** | GAM LLM output → Design Page input payload → Design Page runtime compose (prompt + LLM) → Design Page workflow output | **Active** — this produced the observed thinning |
| **Application repair/preservation path** | JS hooks after workflow emit: capture normalize, post-compose merge, repair, cognition semantics | **Unproven** — do not assume execution until [OQ-56D-00](SPRINT-56D-OPEN-QUESTIONS.md) is answered |

---

## Task A — Map GAM output to Design Page input payload

**Goal:** Document what upstream content the Design Page workflow step receives.

**Workflow runtime path only.**

**Inspect:**

| Stage | Artefact / location |
| ----- | ------------------- |
| GAM step output | `activity_materials` — captured conversation body (M1–M15) |
| Design Page step input | Conversation context: prior `STEP N OUTPUT` blocks, Material:/Content: sections |
| Prompt assembly | `app.js` → `applyWorkflowStepRuntimePromptAugmentations` (Design Page branch) |
| Domain binding | `domain-learning-design-step-patterns.md` §13 — upstream artefact references |

**Exit:** Documented map: GAM bodies → fields available to Design Page step before LLM compose.

---

## Task B — Map Design Page runtime compose

**Goal:** Document how the Design Page step constructs its prompt and emits page JSON.

**Workflow runtime path only.**

**Inspect:**

| Location | Function / artefact |
| -------- | ------------------- |
| `app.js` | `applyLdDesignPageComposeContractToDraft` |
| `app.js` | `applyLdThinAssemblyCoherenceContractToDraft` (ordering only — not a materials path) |
| `lib/ld-design-page-compose-contract.js` | Compose contract + L4 materials embed |
| `lib/ld-materials-copy.js` | LD-MATERIALS-COPY preserve block in prompt |
| Domain §13 | `promptTemplate`, `defaultPromptNotes`, materials fidelity language |

**Exit:** Documented prompt augment chain and compose obligations as seen by the workflow LLM.

---

## Task C — Identify truncation source on workflow output

**Goal:** Determine where GAM full bodies become thin Design Page bodies in the **reproduced workflow run**.

**Gate:** Complete OQ-56D-00 before attributing cause to application paths.

**Workflow runtime candidates (investigate first):**

| Mechanism | Suspect location |
| --------- | ---------------- |
| LLM compose condensation | Design Page step Copilot output (workflow-generated page JSON) |
| Prompt instruction competition | Compose prompt size, competing augment blocks |
| Upstream binding gap | GAM bodies not surfaced clearly in Design Page input payload |
| Domain template wording | §13 instructions that licence excerpting despite contracts |
| Model length / token pressure | LLM-side truncation during compose emit |

**Application path candidates (only if OQ-56D-00 = yes):**

| Mechanism | Suspect location |
| --------- | ---------------- |
| Post-compose preserve skip/incomplete | `applyComposedPageGamMaterialsPreserve` |
| Capture candidate selection | `normalizePageWorkflowCapture` |
| Post-compose overwrite | `applyPedagogicCognitionSemanticsToComposedPage` ordering |
| Repair gap | `repairLearnerPageCompositionFromUpstream` |

**Exit:** Named root cause on the **proven** execution path with evidence.

---

## Task D — Restore verbatim GAM → Design Page material preservation

**Goal:** Ensure workflow-emitted page JSON carries full GAM material bodies.

**Approach:** Determined only after Tasks A–C and OQ-56D-00.

| If root cause is… | Fix class |
| ----------------- | --------- |
| Workflow runtime compose (LLM/prompt) | Prompt/contract/domain correction; upstream binding clarity; pre-emit validation language — **not** new LLM authoring |
| Application path (proven) | Targeted JS fix on the proven hook only |
| Both (proven) | Minimal changes on each proven path |

**Prohibited:** Adding new LLM generation to "fill in" truncated bodies; patching unproven JS paths.

**Exit:** Patch on proven path; no architecture document changes; no 56C governance reopening.

---

## Task E — Add regression tests for full body preservation

**Goal:** Tests fail on current thinning; pass after fix.

**Suggested file:** `tests/sprint-56d-gam-material-preservation.test.js`

**Cases:**

- M1/M2/M5/M9/M15 body equality (from captured workflow fixtures)
- Multi-material per activity enumeration
- Placeholder/synopsis rejection

**Exit:** New tests in CI bundle.

---

## Task F — Add GAM vs Design Page diagnostics

**Goal:** Length/hash comparison utilities for debugging workflow artefacts.

**Suggested:**

- `bodyLengthRatio(gamBody, pageBody)` helper in test or lib
- Per-field hash diff report on captured GAM vs workflow-emitted page JSON
- Optional dev logging on **proven** application paths only

**Exit:** Diagnostic output in tests; evidence artefacts for OQ-56D-00 and OQ-56D-01.

---

## Task G — HTML export survival test

**Goal:** Prove full content survives into rendered page HTML when page JSON is correct.

**Note:** Renderer is downstream of workflow output. This test confirms faithful render, not root-cause location.

**Inspect:**

- `tests/design-page-materials-fidelity.test.js`
- `tests/page-gam-materials-projection.test.js`
- Renderer path: `renderLearningActivitiesBlocks` / `materialsByActivityId`

**Exit:** Test asserts M1/M2/M5/M9/M15 substrings present in HTML when page JSON contains full bodies.

---

## Task H — Diagnose React minified error #185 (separate track)

**Goal:** Document root cause; fix only if clearly related and low-risk.

**Investigate:**

- React error #185 = "Maximum update depth exceeded" (typical)
- Reproduction steps during workflow run / page preview
- Oversized page JSON state updates
- Malformed page JSON parse/re-render loops
- Unrelated UI state (workflow panel, settings)

**Exit:** Separate finding; fix optional.

---

## Task status tracker

| Task | Status | Path | Notes |
| ---- | ------ | ---- | ----- |
| A | Pending | Workflow runtime | GAM → DP input payload |
| B | Pending | Workflow runtime | DP runtime compose |
| C | Pending | Workflow runtime (first) | Truncation source — gated on OQ-56D-00 |
| D | Pending | Proven path only | Fix after A–C |
| E | Pending | — | Regression tests |
| F | Pending | — | Diagnostics |
| G | Pending | Renderer | Downstream confirmation |
| H | Pending | — | React #185 |

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `SPRINT-56D-IMPLEMENTATION-TASKS.md` |
| Sprint | 56D |
