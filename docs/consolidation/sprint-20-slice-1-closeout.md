# Sprint 20 Slice 20-1 — closeout (Settings Discoverability)

**Date:** 2026-05-15  
**Status:** **Closed** — implementation + tests complete  
**Charter:** [`sprint-20-slice-1-charter.md`](sprint-20-slice-1-charter.md)  
**Sprint pack:** `docs/development/sprints/2026-05-15-sprint-20-workflow-explainability-settings-ux/`  
**Prior sprint:** [`sprint-19-closeout.md`](sprint-19-closeout.md) — LD rationalisation; **118 tests** at Sprint 19 closeout

**Verification:**

```bash
node --test tests/*.test.js
```

**Result:** **124 passed**, 0 failed

---

## 1. Executive summary

Slice 20-1 closes the **Settings discoverability** gap left after Sprints 18–19: fewer chat questions, but more tuning now happens in **step Settings**. This slice adds **UI-only** affordances so users can see which steps are tunable, read compact parameter summaries, and jump from **planning adequacy** notices to the right step **Settings** — without new elicitation, pack changes, or interpreter rewrites.

**Programme thesis (unchanged):** Generate with minimal questions; then make assumptions and tuning affordances obvious in the Factory UI.

---

## 2. Architectural preservation

| Constraint | Status |
|------------|--------|
| **No new elicitation** | **Preserved** — no new required factors, refinement queues, or wizard flows |
| **Planning adequacy advisory only** | **Preserved** — adequacy rows may link to Settings; they do not block Ready |
| **Step Settings authoritative** | **Preserved** — summaries are read-only cues; Settings panel remains source of truth |
| **Research untouched** | **Preserved** — no Research pack, fixture **S1–S13**, or Research test edits |
| **Mapping interpreter unchanged** | **Preserved** — `applyWorkflowBriefMappings` and mapping application logic not modified |
| **Adequacy interpreter unchanged** | **Preserved** — `evaluateWorkflowBriefPlanningAdequacyChecks` and merge paths not modified |
| **Ready / profile queues** | **Preserved** — `askRefinementByDefault: false` and empty profile required tiers unchanged |

**Four guidance layers (Sprint 18/19 terminology):**

| Layer | Slice 20-1 impact |
|-------|-------------------|
| **Required essentials** | Blocking when missing — **unchanged** |
| **Workflow synthesis** | Produces concrete workflow — **unchanged** |
| **Planning adequacy** | **Assistive** — presentation + Settings deep-links only |
| **Step Settings** | **Primary focus** — discoverability and navigation |
| **Profile post-gen** | Optional opt-in only — **unchanged** |

---

## 3. UX decisions

### 3.1 Configurable-step detection

A step is treated as configurable when **either**:

1. Its domain pattern has `promptFactory.configurationMode: "simple"` with non-empty `userOptions`, or  
2. The active brief pack has `mappingRules` targeting `stepParams.{canonicalStepId}.*` for that step.

Detection reuses existing catalog and pack data — no new schema.

### 3.2 Progressive disclosure

- **Badge** — small **Settings** (library) or **Tunable** (design preview) on the step header.  
- **Muted cue** — one line: “Editable in Settings…” plus optional compact summary.  
- No modal wizards or inline full parameter forms in the workflow list.

### 3.3 Summary key cap

Summaries show at most **four** labelled values, drawn from this priority list:

| Key | Notes |
|-----|--------|
| `assessment_type` | |
| `assessment_total_items` | |
| `page_profile` | |
| `tone_style` | |
| `depth_level` | |
| `include_examples` | |
| `activity_type` | Alias (e.g. mapped from `assessment_type`) |
| `number_of_items` | Alias (e.g. mapped to generate-assessment step) |

Values are merged from step notes (`[PRISM_STEP_PARAMS]`), `stepParamPatch`, and resolved factors via existing `mappingRules`.

### 3.4 Planning adequacy → Settings

Structured planning notices replace plain-text adequacy blocks when disclosures exist. Rows with known targets show **Open step Settings**:

| Adequacy id | Settings target |
|-------------|-----------------|
| `ld_page_profile_facilitator_mismatch` | `step_design_page` |
| `ld_assessment_generate_step_missing` | `step_generate_assessment_items` |

Action copy mentioning “page profile” also infers `step_design_page` without pack edits.

---

## 4. Runtime hooks (UI-only)

These functions were added to `app.js` for **presentation and navigation only**. They do **not** change adequacy evaluation, mapping application, synthesis, or Ready semantics.

| Function | Role |
|----------|------|
| `focusWorkflowStepSettings()` | Tab switch, scroll/highlight, optional Settings open |
| `openWorkflowStepSettingsFromElement()` | Delegates to existing **Settings...** button click |
| `decorateWorkflowStepSettingsDiscoverability()` | Badge + cue on a step list item |
| `appendWorkflowBriefPlanningNoticesUi()` | Structured planning block with Settings links |

**Explicitly unchanged:** `evaluateWorkflowBriefPlanningAdequacyChecks`, `applyWorkflowBriefPlanningAdequacyAfterDesign`, `applyWorkflowBriefMappings`, `buildWorkflowBriefPlanningDisclosures` evaluation logic, LD/Research pack policy.

---

## 5. Changed surfaces

| Surface | Change |
|---------|--------|
| **Workflow library** — `#workflowSteps` | Settings badge, editable cue, parameter summary |
| **Factory design preview** — `#wfDesignSteps` | **Tunable** badge, save-then-Settings cue |
| **Resolved brief** — `#wfBriefResolvedContent` | Structured planning notices; **Open step Settings** buttons |
| **Prompt Factory** | Unchanged behaviour — existing step config panel still opened via **Settings...** |
| `index.html` | Helper text on resolved-brief panel |
| `style.css` | Badge, cue, planning-notice, focus-highlight styles |

---

## 6. Files changed

| File | Change |
|------|--------|
| `app.js` | Discoverability helpers, decoration, planning UI, navigation hooks, `__PRISM_TEST_API` exports |
| `style.css` | Settings discoverability styles |
| `index.html` | Resolved-brief helper copy |
| `tests/workflow-settings-discoverability.test.js` | **New** — 6 tests (+6) |
| `docs/consolidation/sprint-20-slice-1-charter.md` | Charter (pre-closeout) |

**Not changed:**

| Path | Reason |
|------|--------|
| `domains/research/*` | Research frozen |
| `domains/learning-design/domain-learning-design-step-patterns.md` | No pack policy change in 20-1 |
| Research tests / fixtures **S1–S13** | Regression anchor |
| Adequacy / mapping interpreters | UI-only slice |

---

## 7. Navigation behaviour

| Context | Behaviour |
|---------|-----------|
| **Saved workflow** (step in `#workflowSteps`) | `focusWorkflowStepSettings()` → **Workflows** tab → scroll/highlight step → open **Settings...** (Prompt Factory step config) |
| **Design preview only** (`#wfDesignSteps`, not yet saved) | **Workflow Factory** tab → highlight matching step → toast: save workflow, then open Settings |

Target match: `data-canonical-step-id` or step title normalised against canonical patterns.

---

## 8. Test verification

```bash
node --test tests/*.test.js
```

| Milestone | Result |
|-----------|--------|
| Sprint 20 bootstrap | 118 passed |
| **After Slice 20-1** | **124 passed**, 0 failed |

**New suite:** `tests/workflow-settings-discoverability.test.js` — mapping-target detection, adequacy navigation targets, configurability, summary text, planning notice rows.

**Regression:** All Sprint 18/19 suites green (Research S1–S13, LD adequacy, profile thinning).

---

## 9. Outcomes

| Criterion | Met |
|-----------|-----|
| Configurable steps visible in step list | **Yes** — badge + cue |
| Reach assessment/page Settings in 1–2 interactions | **Yes** — planning link → focus → Settings |
| Planning guides toward Settings, not more chat | **Yes** — adequacy action rows + links |
| Ready non-blocking | **Yes** |
| Sprint 18/19 architecture preserved | **Yes** |
| Automated regression | **Yes** — **124** tests |

---

## 10. Recommended next slice — 20-2 Workflow Assumptions / Provenance

**Slice 20-2** should explain **what was assumed** (explicit, inferred, defaulted) in the resolved brief and which factors map to active steps — without reintroducing blocking questions. Deferred from 20-1:

- Factor-level provenance panel (source labels on resolved values).  
- Highlight factors that map to steps in the current design.  
- Optional “changed since design” when Settings diverge from mapped brief.

See `sprint-20-bootstrap.md` §8.

**Slice 20-3** (deferred): adequacy presentation refinement — grouping, priority ordering, broader Settings deep-links — without new predicates.

---

## 11. References

| Document | Role |
|----------|------|
| [`sprint-20-bootstrap.md`](../development/sprints/2026-05-15-sprint-20-workflow-explainability-settings-ux/sprint-20-bootstrap.md) | Programme goals |
| [`contextual-refinement-architecture-note.md`](contextual-refinement-architecture-note.md) | Four layers |
| [`sprint-19-closeout.md`](sprint-19-closeout.md) | Prior sprint baseline |
