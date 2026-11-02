# Sprint 94 — Handover

**Sprint:** 94 — Learning Journey Continuity  
**Status:** **OPEN** — WP0–WP5 complete; WP6 ready; not started  
**Predecessor:** Sprint 93 **CLOSED — ACCEPTED** — do not reopen

## Resume here

1. [SPRINT-94-START-HERE.md](SPRINT-94-START-HERE.md)  
2. [decisions.md](decisions.md) — S94-D02…D06 accepted  
3. [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md) — WP5 complete; WP6 ready  
4. [next-chat-briefing.md](next-chat-briefing.md)

## What is done

- Sprint opened (S94-D01).  
- Continuity contract agreed (S94-D02…D06).  
- WP0–WP1 complete.  
- WP2 / S94-T-004 and S94-T-005 complete:
  - `collectLearningJourneyContinuityErrors` at capture time only;
  - author-only commissioning contract in Preview;
  - structural validator unchanged;
  - learner home/ZIP unchanged.
- WP3 / S94-T-006 complete:
  - `composeCommissionedOriginalBrief` shared labelled brief;
  - runtime delivery in `resolveStepPromptText` for commissioned Interactive / Expository / Assessment Pack earliest stages;
  - Situated Task Situation token path unchanged;
  - standalone Create unchanged.
- WP4 / S94-T-007 complete:
  - shared `composeCommissionedContextHonourInstruction`;
  - eligible commissioned stages receive labelled brief + honour instruction + existing stage task;
  - Assessment Pack clarification is pack-only; Grounding context / Bind commissioning retained;
  - standalone Create, Situated Task Situation, and Learning Journey unchanged.
- WP5 / S94-T-008 complete:
  - shared `composeCommissionedLearnerFacingBringForwardInstruction`;
  - commissioned Interactive DLA, Expository Development, and Assessment Pack Interpret Evidence Purpose receive labelled brief + WP4 honour + WP5 learner-facing instruction;
  - existing `activity_preamble` / opening `exposition` / `learner_context.bring_forward` remain the copy surfaces;
  - standalone Create, Situated Task, Learning Journey home/ZIP unchanged.

## Next slice

**WP6 / S94-T-009** — regression tests + *Making Decisions Under Uncertainty* live verification. Do not regenerate the seven-component journey unless this slice is authorised.

Prefer live files over `context-files/` snapshots.

## Constraints

- http://localhost/prism/ — never `file://`.  
- Do not modify stored clinical Assessment Pack workflow `e50c39b5-0c33-4869-bf5a-4fc2cef07c70`.  
- Cache-bust `index.html` after prompt/renderer/canonical/`app.js` changes.  
- PowerShell: no `&&`; `$` in one-liners is stripped.  
- No Git unless asked.
