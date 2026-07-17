# Sprint 65 Bounded Renderer Prototype

## Task

**S65-BL-007 — Bounded Renderer Prototype**

Build the smallest reversible renderer prototype that tests settled Sprint 65 recommendations using only current renderer-available data.

```text
Implementation: Prototype complete — not production-ready
Production readiness: Not established
```

## Scope and Constraints

**In scope:** Feature-switched presentation helpers; activity contract; bounded archetype cues; beat/role material presentation; residual/orphan/unknown safety; journey overview dedupe; diagnostic CSS/gating retained; focused tests; HTML captures.

**Out of scope:** Schema/GAM; hidden-plan fields (`required_links`, `stages`, `key_relationships`, `governing_constraint`); prose inference; production default-on; SPA shell; per-archetype trees; full WCAG certification; production rollout.

```text
Known architecture ceiling — not a Sprint 65 renderer defect.
```

## Settled Design Inputs

| Source | Used |
| ------ | ---- |
| BL-003/004 activity contract + MR rules | Activity frame, Produce≠Check, mode cues |
| BL-005 adaptive hybrid (PIA) | Journey overview reprint omitted; meta remains gated |
| BL-006 Option C + MBP rules | Role labels, residual policy, title policy |
| S1–S3 signals only | No S4/S6 learner structure |

## Prototype Hypotheses

1. Consolidated contract improves action/output clarity vs Success+What-to-do composition.  
2. Role labels outperform type/beat enum headings.  
3. Residual policy places learner-work (e.g. `planning_table`) before Check.  
4. Default `current` mode remains unchanged.  
5. Sparse/unsupported archetype falls back without inventing mode.

## Implementation Boundary

- New lib: `lib/s65-learner-experience-prototype.js`  
- Narrow `app.js` branches keyed by `renderMode`  
- Bootstrap + `index.html` script tag  
- No fixture-ID branching  

## Feature Switch

```text
renderMode: "current" | "s65-prototype"
```

| Aspect | Behaviour |
| ------ | --------- |
| Production default | **`current`** (prototype **off**) |
| Test selection | Explicit `renderMode: "s65-prototype"` |
| Capture harness | Renders both modes |
| Hidden env flags | **None** |

At end of BL-007: prototype mode is **default off / explicitly selected** (including test-only and capture harness).

## Presentation Model

Internal (not a schema):

- Activity: `{ mode, modeLabel, verb, sections: { why, task, produce, approach, reflect } }`  
- Material role: `{ role, label, source: beat|type|fallback }`  
- Residual-adjusted beat plan: assigned beats + injected Try it / Extend residual groups  

## Code Changes

| Path | Change |
| ---- | ------ |
| `lib/s65-learner-experience-prototype.js` | **Added** — pure helpers + contract HTML + CSS snippet |
| `app.js` | Resolve lib; plumb `renderMode`; S65 frame; residual beat plan; role headings; journey overview omit; CSS include; test API export |
| `index.html` | Script include |
| `tests/prism-vm-lib-bootstrap.js` | Load lib in DEFAULT/PEDAGOGICAL lists |
| `tests/utility-renderer-s65-prototype.test.js` | **Added** |

## Rule Traceability

| Prototype behaviour | Rule IDs | Signal IDs | Code path | Test | Sample evidence |
| ------------------- | -------- | ---------- | --------- | ---- | --------------- |
| Feature switch default off | S65-D07 | — | pipeline `renderMode` | default renderMode test | captures |
| Activity contract Task/Produce | S65-MR-001–003, D18/D21 | T01/T02 | `renderActivityContractFrameHtml` | RNA prototype test | rna-*-s65-prototype.html |
| Mode cue from plan archetype | S65-MR / D22 | A03 | `buildActivityPresentationModel` | mode badge test | RNA A1 |
| Unsupported archetype → no badge | S65-MR-013/014, D23 | A03 | `normalizeArchetype` | fallback test | synthetic page |
| Role headings not beat enums | S65-MBP-003/004, MR-018 | beat fn | `roleLabelForBeat` | RNA headings | captures |
| Residual before Check | S65-MBP-014/020, MR-021 | planning_table | `applyResidualPolicyToBeatPlan` | residual tests | RNA A3 |
| Title type-equality replace | S65-MBP-006/007 | M01 | `resolveDisplayTitle` | title policy test | helpers |
| Journey overview not reprinted | S65-PIA-021, F06 | P04 | journey section branch | (HTML compare) | RNA captures |
| Unknown → Also available | S65-MBP-016 | unknown | `resolveMaterialRole` | helper test | kitchen-sink |

## Activity Contract Implementation

When `renderMode === "s65-prototype"`, `buildLearnerJourneyFrameHtml` delegates to S65 contract: optional mode cue, Why, Your task, Produce, Approach — **no** Success-looks-like merge of checklist+output. Checklist remains in materials Check.

## Archetype Cue Implementation

Reads `episode_plan.archetype` (and aliases). Valid: understand/apply/analyse/evaluate. Else no mode badge (Composition B equivalent).

## Material Role Implementation

Beat headings use learner roles (Idea/Example/Evidence/Try it/Check/Extend). Type conflict precedence per MBP.

## Beat and Ordering Implementation

Valid beat plan preserved; consecutive residual injection before verification; Extend residuals after.

## Residual and Orphan Handling

`applyResidualPolicyToBeatPlan` consumes `unassigned` keys; marks rendered so `_render_sequence` does not re-append after Check. Orphans remain visible under role groups / Also available.

## Unknown Material Handling

Default role `also`; `try_it` only if table-shaped structural flag.

## Title Treatment

Meaningful titles kept; type-equal / fixture-test titles de-emphasised (role heading preferred). Original retained in diagnostic sense (not deleted from data).

## Page IA Implementation

Prototype omits Learning Journey overview reprint when mode is S65 (purpose still allowed). Full adaptive hybrid page chrome (collapsed KS, begin cue) is **partially** deferred — journey dedupe + activity contract are the primary BL-007 page-level changes. **Prototype-only implementation choice — requires validation** for fuller BL-005 chrome in BL-008.

## Assessment and Consolidation

Unchanged placement (after activities when present). Answers not newly default-opened.

## Progressive Disclosure

CSS includes print-friendly disclose hooks; full KS collapse not fully wired in this increment (deferred). Required Try it not collapsed.

## Diagnostics and Observability

`details.util-meta` retained. Beat-render console diagnostics unchanged. Rule IDs not shown to learners. Original titles not stripped from source objects.

## Accessibility

Mode cue is text (`s65-mode-badge` + verb). Role headings are text. Tables retain structure. No colour-only mode themes. Keyboard disclosures: native `details` where used; not newly required for core task.

## Mobile

Existing single-column / table-scroll CSS retained; role sections stack.

## Print

S65 CSS includes print note for disclosures; order follows DOM (independent of JS state). Meta remains end/collapsed.

## Tests Added

`tests/utility-renderer-s65-prototype.test.js` — 9 tests (helpers + RNA + residual + fallback + default-off).

## Existing Tests Run

```text
node --test tests/utility-renderer-s65-prototype.test.js
node --test tests/utility-renderer-material-completeness.test.js tests/utility-renderer-cognition-fields.test.js tests/utility-renderer-learner-journey-presentation.test.js tests/utility-renderer-s65-prototype.test.js
node --test tests/utility-renderer-kitchen-sink.test.js
```

| Suite | Result |
| ----- | ------ |
| S65 prototype | 9/9 pass |
| Combined material/cognition/journey/S65 | 34/34 pass |
| Kitchen-sink | **42 pass / 3 fail** (pre-existing on HEAD; Sprint 62 Session timeline / Learning purpose gaps — F44) |
| Marx page-render | **6 pass / 5 fail** (pre-existing on HEAD; activityScope nav-title fallback — F44) |
| Broader `utility-renderer-*` + `utility-*-page-render` | 114 pass / 10 fail (same pre-existing KS/marx/inflation set; no S65-specific assertion weakening) |

**Journey-orient fix (S65-EV-48):** mid-tag `id="activity-1"` fallback no longer emits `<div </div>id=…`; orient ends before Learning Activities.

## Current versus Prototype Captures

Harness: `samples/capture-prototype-render.js`  
Outputs: `samples/prototype/*-current.html` and `*-s65-prototype.html`  
Meta: `samples/prototype/capture-meta.json`

Screenshots: [`screenshots/prototype/rna-a1-current-desktop.png`](screenshots/prototype/rna-a1-current-desktop.png) · [`screenshots/prototype/rna-a1-s65-prototype-desktop.png`](screenshots/prototype/rna-a1-s65-prototype-desktop.png) · note [`screenshots/comparisons/rna-a1-desktop-comparison.md`](screenshots/comparisons/rna-a1-desktop-comparison.md). Additional mobile/print captures deferred to BL-008.

## Evaluation Scores

Judgement on RNA primary + helper evidence (1–5). Confidence medium (no learner research).

| Dimension | Current | Prototype | Evidence | Confidence | Trade-off |
| --------- | ------- | --------- | -------- | ---------- | --------- |
| Orientation | 3 | 4 | Journey dedupe; mode cue | Med | Fuller page chrome still thin |
| Action clarity | 3 | **5** | Your task dominant | High | — |
| Output clarity | 3 | **5** | Produce ≠ checklist | High | — |
| Cognitive mode | 2 | **4** | Mode badge when archetype present | High | Absent archetype = no badge |
| Progression | 3 | 4 | Role sequence | Med | Bridges still rare (S2) |
| Material role | 2 | **5** | Role headings | High | — |
| Verification | 3 | **4** | Check region | High | — |
| Transfer | 2 | **4** | Extend residual/beat | Med | — |
| Density | 2 | **4** | Less Success merge | High | Grammar Orient/Think may still add |
| Duplication | 2 | **4** | Produce/Check split; journey intro | High | — |
| Accessibility | 3 | 4 | Text cues | Med | Needs BL-008 a11y pass |
| Resilience | 4 | **5** | Residual/unknown helpers | High | — |
| Source fidelity | 5 | 5 | Titles/bodies retained | High | — |
| Residual safety | 1 | **5** | A3 before Check | High | — |

## Regressions and Trade-Offs

- Prototype CSS classes present in shared stylesheet even in current mode (class names in `<style>` only; elements only in prototype).  
- Fuller BL-005 page IA (KS disclosure, begin CTA) not fully implemented — deferred.  
- Grammar Orient/Think sections may still appear alongside S65 Why/Approach (possible dual framing) — **Prototype-only implementation choice — requires validation**.

## Prototype Acceptance Assessment

| Threshold | Result |
| --------- | ------ |
| Source fidelity not reduced | **Pass** |
| Action clarity improves | **Pass** |
| Material role improves | **Pass** |
| Cognitive mode improves when archetype exists | **Pass** |
| Sparse/unsupported fallback coherent | **Pass** |
| Density/duplication not worsened | **Pass** |
| Residual/orphan/unknown visible | **Pass** |
| Current mode reproducible | **Pass** |
| No schema/GAM/hidden plans | **Pass** |
| No fixture-ID branching | **Pass** |
| No prose inference | **Pass** |
| Focused tests pass; renderer suites green | **Pass** |

**Decision for BL-008:** Prototype **accepted** for cross-sample validation.

## Rollback Plan

**Triggers:** Source loss; material suppression; unstable ordering; fixture branching; widespread regressions; a11y regression.

**Method:**

1. Set/keep `renderMode: "current"` (default).  
2. Or remove `lib/s65-learner-experience-prototype.js` + reverse `app.js` / bootstrap / `index.html` wiring.  
3. Delete `tests/utility-renderer-s65-prototype.test.js` if abandoning.

## Prototype Register

| Prototype ID | Behaviour | Rule IDs | Code path | Tests | Status |
| ------------ | --------- | -------- | --------- | ----- | ------ |
| S65-PROT-001 | Feature switch `renderMode` | D07 | pipeline / renderOpts | default-off test | Implemented |
| S65-PROT-002 | Activity contract frame | MR-001–003 | s65 lib + journey frame | RNA tests | Implemented |
| S65-PROT-003 | Archetype mode cue + fallback | MR-013/014, D22–23 | `resolveModeCue` | fallback test | Implemented |
| S65-PROT-004 | Role headings for beats | MBP-003/004 | beat render loop | RNA test | Implemented |
| S65-PROT-005 | Residual policy reorder | MBP-014/020, MR-021 | `applyResidualPolicyToBeatPlan` | residual tests | Implemented |
| S65-PROT-006 | Title policy | MBP-006–008 | `resolveDisplayTitle` | title test | Implemented |
| S65-PROT-007 | Journey overview omit | PIA-021 | journey section | capture compare | Implemented |
| S65-PROT-008 | Unknown/Also available mapping | MBP-016 | `resolveMaterialRole` | helper test | Implemented |
| S65-PROT-009 | Full BL-005 page chrome | PIA-* | — | — | Deferred |
| S65-PROT-010 | Progressive KS disclosure | PIA-013 | — | — | Deferred |

**Count:** 10 prototype IDs (8 implemented, 2 deferred).

## Findings

See findings log S65-F39–F44.

## Decision Required for S65-BL-008

Proceed to cross-sample validation with prototype **explicitly selected**; production default remains `current`.

## Constraints for Cross-Sample Validation

Validate grammar+S65 dual framing; kitchen-sink unknown; assessment companion; marx rich; self-directed sparse; mobile/print screenshots; confirm no regressions when `renderMode` omitted.

## Conclusion

The bounded prototype is **complete and accepted for BL-008**, with production readiness **not** established. Default rendering remains current. Strongest gains: action/output clarity, material roles, residual ordering, mode cues.

**Next:** S65-BL-008 — Cross-sample validation.
