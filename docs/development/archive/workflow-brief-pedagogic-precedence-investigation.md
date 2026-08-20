# Workflow brief pedagogic precedence — investigation note

**Date:** 2026-05-21  
**Scope:** Brief parsing / assumption resolution in `app.js` only  
**Out of scope:** Workflow steps, renderer, composition, generation, assessment rendering (Sprint 29 unchanged)

---

## Symptom

A **Conflicting Evidence Clinical Reasoning Lab**–style brief (seminar, dialogic cognition, subordinate formative check) resolved as if the deliverable were an **assessment page**:

- `page_profile: assessment`
- `assessment_type: mcq`
- `assessment_total_items: 10` (domain default)
- `design_scope: single_activity` from generic “activity” in goal text
- `topic` polluted with renderer/test meta (`util-cognition`, “activity rows”)

---

## Root cause

In `extractWorkflowBriefExplicitFactors` and downstream inference:

1. **Broad assessment cues** — tokens such as `quiz`, `formative question`, `knowledge check`, `mcq` set `page_profile: assessment` without checking whether assessment was the **primary** deliverable.
2. **MCQ collateral** — `assessment_type: mcq` from generic MCQ mentions, not from “build an MCQ quiz” intent.
3. **Item count default** — `assessment_total_items: 10` applied when no count was parsed; weak patterns for `20-item MCQ` and `3–5 items`.
4. **Design scope** — domain `inferenceRules` fired `single_activity` on generic “activity” in goals.
5. **Topic capture** — `\bon\s+` subject extraction retained implementation tails; no strip of meta phrases.

---

## Fix (bounded)

**New helpers** (before `extractWorkflowBriefExplicitFactors`):

| Helper | Role |
|--------|------|
| `workflowBriefPedagogicTextBlob` | Normalised text union for precedence checks |
| `sanitizeWorkflowBriefTopicCandidate` | Strip renderer/meta tails only (does not shorten legitimate subject lines) |
| `isWorkflowBriefSeminarDialogicCognitionForward` | Seminar/lab + cognition/activities signals |
| `isWorkflowBriefAssessmentPrimaryIntent` | Explicit assessment-page / N-item MCQ quiz / item-bank intent |
| `isWorkflowBriefSubordinateFormativeAssessment` | Formative check inside seminar/handout context |
| `reconcileWorkflowBriefPedagogicFactors` | Post-pass precedence: seminar/dialogic vs assessment-primary |

**`extractWorkflowBriefExplicitFactors`:** Narrower `page_profile` and `assessment_type` rules; improved `firstAssessmentItemCountFromText` (ranges, hyphenated counts); `design_scope: session` when duration ≥45 and activities required; topic sanitization; ends with `reconcileWorkflowBriefPedagogicFactors`.

**`resolveWorkflowBriefFactors`:** Calls `reconcileWorkflowBriefPedagogicFactors` after `deriveAssessmentSemanticFactors` so inferred defaults get the same precedence.

**Precedence rule (summary):**

- If **assessment-primary** (e.g. “assessment page”, “20-item MCQ quiz”) → keep `page_profile: assessment`, MCQ type, parsed counts.
- Else if **seminar/dialogic-forward** → downgrade spurious `page_profile: assessment` to `learner` when handout/learner outputs; cap subordinate formative items (≤6, default 5); prefer `assessment_type: mixed` unless MCQ is explicit; widen `design_scope` to `session` when appropriate.

---

## Tests

| File | Purpose |
|------|---------|
| `tests/fixtures/workflow-brief-ld-clinical-reasoning/conflicting-evidence-clinical-reasoning-lab.json` | Clinical lab brief fixture |
| `tests/workflow-ld-clinical-reasoning-lab-resolver.test.js` | Seminar precedence, topic meta strip, assessment-first counter-case |
| `tests/workflow-brief-pass1.test.js` | Existing pinned extracts (e.g. maximal-factor-rich “assessment page” workshop) — must still pass |

**Verification:** `node --test tests/*.test.js` → **358** passed (2026-05-21).

---

## Residual risks

- **Workshop + assessment page** — relies on `isWorkflowBriefAssessmentPrimaryIntent` matching “assessment page”; workshop alone must not suppress assessment-primary.
- **Ambiguous briefs** — mixed signals (seminar + “quiz on X” without handout context) may still bias one way; no new factors added.
- **Topic sanitization** — meta-tail patterns only; long subject lines from `\bon\s+` capture are intentionally preserved for Pass 1 fixtures.
- **Domain default 10** — still applies when inference runs before reconcile on non–subordinate-formative paths; subordinate path caps at 5.

---

## Related work

- Sprint 27 — assessment elicitation semantics (factors, not this resolver bug)
- Sprint 28–29 — cognition composition/renderer (unchanged by this fix)
