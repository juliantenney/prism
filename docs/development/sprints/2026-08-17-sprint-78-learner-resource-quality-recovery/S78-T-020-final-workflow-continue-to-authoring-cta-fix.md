# S78-T-020 — Final workflow Continue to Authoring CTA fix

**Task:** S78-T-020  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-17)  
**Mode:** Bounded Run-mode UI / workflow fix  
**Does not include:** Prompt architecture · DLA/GAM/assembly/renderer/QA contracts · T-013 execution · T-003 · T-019 · Lagrangian regeneration

Sprint 78 remains **OPEN**. T-013 remains **OPEN**. This is a UI refinement, not a workstream.

---

## 1. Proven cause of the non-working CTA

Three cooperating defects:

1. **Placement.** `#workflowContinueToAuthoringBtn` lived inside `#workflowRunButtons`. `syncWorkflowRunStepIdentityPlacement` moves that whole cluster into `[data-role="run-step-nav"]`, so Continue sat beside Previous / Next.
2. **Next still visible on the last step.** Canonical `isWorkflowRunAtFinalStep(idx, total)` (`t > 0 && i >= t - 1`) already existed, but Next was only **disabled** (`title`: “This is the final step.”), not hidden.
3. **Enablement was not final-step completion.** Continue used `isWorkflowRunAuthoringReady` (Design Page live capture **or** persisted Design Page result). Native `disabled` buttons fire no click. Operators could see **Step complete** from a pasted body while Continue stayed disabled (or appear to “do nothing”). The click listener was already wired to `handleContinueToAuthoring` → `switchTab("utilities")`.

The handler was not missing. The button was the wrong control, in the wrong place, often disabled by a second readiness model.

---

## 2. Final-step detection

Unchanged canonical helper: `isWorkflowRunAtFinalStep(idx, total)`.

Not hard-coded as `stepIndex === 7`. Works for any step count (including 1-step workflows).

---

## 3. Top navigation

- **Non-final:** Previous / Next unchanged (Next still gated by `resolveWorkflowRunNextStepDisabledReason`).
- **Final:** Previous remains; Next is hidden (`setWorkflowRunNextButtonHidden`); Continue is **not** in the nav cluster.

---

## 4. CTA placement

`#workflowRunContinueHost` parks in `#workflowRunChromePark` and is moved onto the current **final** step’s `[data-role="run-step-continue"]`, which is rendered **after** the paste wrap (`runStepOutput` + `run-step-output-status`).

Order: paste → validation/status → **Continue to Authoring** → GAM verification wrap (GAM steps only).

---

## 5. Enablement

`isWorkflowRunContinueToAuthoringEnabled` = final step **and** `isWorkflowRunStepCaptureReadyForAdvance` (the same capture gate Next uses on non-final steps).

- Incomplete / invalid final step → Continue visible but **disabled** (existing disabled-button convention).
- Complete final step → enabled.

`isWorkflowRunAuthoringReady` is unchanged for Authoring/assembly orientation tests; it is **not** the Continue enablement rule.

`resolveWorkflowRunNextStepDisabledReason` cannot gate Continue: on the final step it always returns “This is the final step.”

---

## 6. Click / transition

Same canonical action: `handleContinueToAuthoring` → `switchTab("utilities")` → `refreshUtilitiesWorkflowContextUI()`. No new authoring mode. No second run-completion mechanism.

When the live step list is present and the final step is not capture-ready, the handler toasts and does not switch.

---

## 7. Incomplete-state behaviour

Missing/invalid paste → capture gate false → Continue disabled; handler will not advance if invoked with a live step list.

Valid paste without blocking capture errors → Step complete (existing status formatter) → Continue enabled.

---

## 8. Accessibility / responsive

- Visible name and `aria-label`: “Continue to Authoring”.
- Native `type="button"`; keyboard reachable when enabled.
- Layout is flow/flex + margin (`12px` above CTA). No absolute positioning.
- Narrow view: Continue wraps (`max-width: 100%`; `white-space: normal`).

---

## 9. Manual verification (structure)

Automated tests cover Cases A–C (incomplete final, complete final, non-final Next). Live operator confirmation is expected when resuming the T-013 run (Step 8 of 8).

| Case | Expected |
| ---- | -------- |
| A incomplete final | Previous; no Next; Continue below paste; cannot proceed |
| B complete final | Step complete; Continue enabled; click → Authoring (utilities) |
| C non-final | Previous / Next unchanged |

---

## 10. Next action

**Resume S78-T-013.** Do not start T-003 or T-019. Do not regenerate Lagrangian for this UI fix.
