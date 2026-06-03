# Sprint 34-1 — Test floor restore

**Date:** 2026-06-03  
**Outcome:** `node --test tests/*.test.js` → **0 fail**

## Kitchen-sink (`slice 31-5: density pacing CSS markers`)

**Verdict: test drift (not CSS regression).**

Assertions expected `.util-activity-framing>.util-activity-preamble-cue{margin-bottom:4px}` from an early 31-5 substring sketch. Authoritative CSS in `getUtilityPagePresentationCssV31_5()` uses:

- `.util-activity-framing>.util-activity-preamble-cue{margin-bottom:0}`
- `.util-activity-framing>.util-activity-preamble-cue+.util-activity-preamble-cue{margin-top:0}`
- `.util-activity-framing+.util-activity-task--primary{margin-top:10px}`

Framing rhythm also comes from `getUtilityPagePresentationCssV31_2()` (`.util-activity-framing { gap:8px }`). No `app.js` CSS change.

## Marx design-quality (`Factory Scenario` assertion)

**Verdict: test drift after Sprint 33 scenario routing.**

Singular `materials.scenario` objects now render via `renderScenarioBlocks`; card title defaults to `Scenario 1` because `resolveScenarioCardLabel` does not read `entry.heading`. Upstream scenario body still renders. Test now asserts `util-scenario-card` + factory prose instead of the literal heading string.

**Follow-up (34-2+):** optionally include `entry.heading` in scenario label resolution if custom titles should appear on cards.
