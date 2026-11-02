# Sprint 94 — Next-chat briefing

Load this file plus [SPRINT-94-START-HERE.md](SPRINT-94-START-HERE.md) and [decisions.md](decisions.md).

**Sprint 94 is OPEN. WP0–WP5 are COMPLETE. WP6 is READY and not started.**

Sprint 93 is **CLOSED — ACCEPTED**. Do not reopen.

## Contract (accepted)

- **S94-D02 / P-1:** Use `specification_text`, `journey_context_text`, `dependencies`.  
- **S94-D03 / P-2:** Recurring scenarios optional; omitted required continuity fails.  
- **S94-D04 / P-3:** Meaningful preceding-activity context; commissions describe intended activities, not published outputs or learner responses.  
- **S94-D05 / P-4:** Bind from the earliest relevant generation stage, following Situated Task. Assessment Pack includes prefixed Generate Learning Content, Model Knowledge, Define Learning Outcomes.  
- **S94-D06 / P-5:** Author-only inspectability via existing conventions.

## What WP5 landed

Shared `composeCommissionedLearnerFacingBringForwardInstruction` plus `isCommissionLearnerFacingCopyStep`. Commissioned Interactive Design Learning Activities, Expository Development, and Assessment Pack Interpret Evidence Purpose receive labelled ORIGINAL_BRIEF, WP4 honour, and one learner-facing bring-forward instruction. Copy belongs in existing `activity_preamble`, opening `exposition`, or `learner_context.bring_forward`. A shared scenario is not treated as automatic bring-forward. Standalone Create, Situated Task, and Learning Journey home/ZIP remain unchanged.

## Next work

Start **WP6** only when authorised: S94-T-009 — regression tests and *Making Decisions Under Uncertainty* live verification. Do not regenerate the seven-component journey unless that slice is authorised.

Do not absorb Interactive V2, learner-response sharing, unified runtime, media substitution, slideshow, or unrelated publishing.

## Invariants

- http://localhost/prism/  
- Do not modify stored clinical Assessment Pack `e50c39b5-0c33-4869-bf5a-4fc2cef07c70`  
- Cache-bust `index.html` after prompt/renderer/canonical/`app.js` changes  
- No `file://`; PowerShell: no `&&`; `$` stripped in one-liners  
- No Git unless asked
