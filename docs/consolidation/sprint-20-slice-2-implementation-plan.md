# Sprint 20 Slice 20-2 — implementation plan (Workflow Assumptions / Provenance)

**Date:** 2026-05-15  
**Status:** **Plan only** — no implementation in this document  
**Charter:** [`sprint-20-slice-2-charter.md`](sprint-20-slice-2-charter.md)  
**Prior slice:** [`sprint-20-slice-1-closeout.md`](sprint-20-slice-1-closeout.md)

**Goal:** Smallest safe path to structured **post-generation provenance** in the Factory resolved-brief panel — **UI-only**; no mapping or adequacy interpreter changes.

**Verification before implementation PR:**

```bash
node --test tests/*.test.js
```

**Expected:** **124 passed**, 0 failed

---

## 1. Existing data and render path (read-first)

### 1.1 `resolvedState` shape (already populated)

Produced by existing brief pipeline (`resolveWorkflowBriefFactors` → `applyWorkflowBriefMappings` → attach planning):

| Key | Set by | 20-2 use |
|-----|--------|----------|
| `resolvedFactors` | `resolveWorkflowBriefFactors` | Value column |
| `resolvedSources` | Same — per-factor `explicit` \| `elicited` \| `inferred` \| `default` | Source badge |
| `inferredFactors` | Inference pass | Summary count only |
| `confirmedInferredFactors` | Elicitation confirm path | Optional icon on inferred rows |
| `rejectedInference` | Validation / conflict | “Not applied” section |
| `mappedBindings.mapped` | `applyWorkflowBriefMappings` | Step relevance index |
| `mappedBindings.stepParamPatch` | Mapping + MCQ heuristics | Optional read-only echo (do not duplicate 20-1 step UI) |
| `mappedBindings.workflowConstraintPatch` | Mapping | Workflow-level relevance group |
| `planningDisclosures` | Planning builder | Unchanged; rendered after provenance via 20-1 UI |
| `briefConfig` | Attached on state | Factor labels |

### 1.2 Current UI (`renderWorkflowBriefResolvedPanel`)

| Today | 20-2 change |
|-------|-------------|
| Plain-text `lines.join("\n")` for stats + factor lists | Keep **stats** as compact text block |
| `pushSourceBlock` for user-provided / inferred | **Replace** with structured provenance sections |
| Defaults toggle (`workflowBriefShowDefaults`) | **Reuse** pattern + shared CSS class |
| `appendWorkflowBriefPlanningNoticesUi` (20-1) | **Keep** order: provenance → planning |

### 1.3 Design snapshot for step filter

| Source | When available |
|--------|----------------|
| `getSelectedWorkflowDesign()` | After design completes in Factory session |
| `design.steps[].title` | Match `stepsIncludeAny` / mapping step titles |
| `canonical_step_id` on saved workflow steps | Library path — optional for 20-2 if Factory-only |

**Rule:** Step relevance section renders only when `design && design.steps && design.steps.length`.

---

## 2. Minimum viable provenance model

### 2.1 View model (pure function output)

```text
buildWorkflowBriefProvenanceViewModel(config, resolvedState, design) → {
  summary: { asked, resolved, mapped, sourceCounts },
  groups: [
    { source: "explicit"|"elicited"|"inferred"|"default", factors: [{ id, label, value, confirmed? }] }
  ],
  rejected: [{ factorId, value, message }],
  stepRelevance: [
    { stepKey, stepTitle, factors: [{ id, label, paramKeys[] }], canonicalStepId }
  ],
  workflowLevel: [{ id, label, targets: ["constraints.assessment_type", ...] }]
}
```

No persistence; no new fields on `resolvedState`.

### 2.2 Source label mapping (UI copy)

| `resolvedSources` | Display label |
|-------------------|---------------|
| `explicit` | Explicit (from brief fields) |
| `elicited` | You answered |
| `inferred` | Inferred |
| `default` | Default |

### 2.3 Factor label resolution

```text
formatWorkflowBriefFactorDisplayLabel(config, factorId):
  lookup in requiredFactors + optionalFactors + refinementFactors
  return factor.label || factor.plainEnglish || factorId
```

### 2.4 Step relevance algorithm

```text
FOR each row in mappedBindings.mapped:
  IF target starts with stepParams.{stepId}.
    ADD factor to stepRelevance[stepId] (dedupe by factor id)
  ELSE IF target starts with workflow.workflowOutputSpec.
    ADD to workflowLevel

FOR each stepRelevance entry:
  RESOLVE stepTitle from design.steps (canonical id or title match via catalog)

FILTER OUT steps not in design.steps (no orphan canonical ids)
SORT by design step order
```

Reuse `normalizeCanonicalStepId` and patterns from Slice 20-1 (`getWorkflowStepPatternForStep` optional for title).

### 2.5 Deferred: Settings diff

**Not in MVP.** Would require comparing `stepParamPatch` to live `parseWorkflowStepParamBlock(step.notes)` per saved workflow — overlaps 20-1 summaries and needs clear UX spec. Document as 20-2b or Sprint 21 if requested.

---

## 3. Implementation phases (single PR recommended)

### Phase A — Pure helpers + tests (~40% effort)

| Task | Detail |
|------|--------|
| A1 | `buildWorkflowBriefProvenanceViewModel` |
| A2 | `formatWorkflowBriefFactorDisplayLabel` / `formatWorkflowBriefFactorDisplayValue` |
| A3 | `buildWorkflowBriefStepRelevanceIndex(mapped, design, catalog)` |
| A4 | Export on `__PRISM_TEST_API` |
| A5 | `tests/workflow-brief-provenance.test.js` — LD-like mapped fixture |

### Phase B — Resolved brief UI (~45% effort)

| Task | Detail |
|------|--------|
| B1 | `appendWorkflowBriefProvenanceUi(parent, model, options)` |
| B2 | Refactor `renderWorkflowBriefResolvedPanel` — stats text + call B1 + planning UI + defaults toggle |
| B3 | CSS: `.workflow-brief-provenance-*`, source badges, step-relevance list |
| B4 | `index.html` helper: “Assumptions and step mapping (read-only)” |

### Phase C — Settings / planning integration (~15% effort)

| Task | Detail |
|------|--------|
| C1 | Step relevance row: optional “Settings” text link when step is configurable (reuse `isWorkflowStepConfigurableInSettings` + `focusWorkflowStepSettings`) |
| C2 | Planning: **no** adequacy interpreter changes; provenance block appears **above** planning notices so adequacy can be read in context |
| C3 | Optional: for `planning_adequacy` rows, show muted subline if `resolvedFactorEquals` keys from pack check are obvious in view model — **skip if brittle** |

---

## 4. UX goals (acceptance)

| # | Goal |
|---|------|
| 1 | After generation, user can name at least one **inferred** factor and its displayed value |
| 2 | User can see which **Design Page** / **Generate Assessment Items** assumptions apply (when those steps exist) |
| 3 | Defaults remain **collapsed** by default |
| 4 | Rejected inference visible when validation blocked a value |
| 5 | No new questions before **Ready** |

---

## 5. Non-goals (implementation guard)

- Do not add `provenanceEngine`, `ExplainabilityService`, or pack `provenancePolicy`  
- Do not stringify full `resolvedState` to the panel  
- Do not edit factors inline in provenance UI  
- Do not call OpenAI for explanations  
- Do not modify `applyWorkflowBriefPlanningAdequacyAfterDesign`  

---

## 6. Files touched (expected)

| File | Change |
|------|--------|
| `app.js` | Helpers + `renderWorkflowBriefResolvedPanel` |
| `style.css` | Provenance styles |
| `index.html` | Helper copy |
| `tests/workflow-brief-provenance.test.js` | New |

---

## 7. Test strategy (detail)

### 7.1 New tests

| Test | Assert |
|------|--------|
| Groups inferred vs explicit | Correct `groups[].source` |
| Step relevance | `page_profile` → `step_design_page` when mapped + step in design |
| Workflow-level | `input_strategy` → `workflowLevel` not duplicated under step |
| Rejected rows | Passed through when `rejectedInference` non-empty |
| Empty design | `stepRelevance` length 0 |

### 7.2 Regression

- Full suite **124+** pass  
- `workflow-settings-discoverability.test.js` unchanged behaviour  
- Research S1–S13 / LD adequacy suites unchanged  

### 7.3 Manual (LD-first)

1. LD brief with assessment + page → design → open resolved brief.  
2. Confirm inferred `assessment_type` / `page_profile` badges.  
3. Confirm step relevance lists **Design Page** / assessment steps.  
4. Click 20-1 **Open step Settings** from adequacy — still works.  
5. Optional: Research S7-style brief — provenance renders without LD-only branches.

---

## 8. Progressive disclosure (implementation notes)

| Section | Default state |
|---------|----------------|
| Stats line | Visible |
| User-provided | Expanded |
| Inferred | Expanded (if count ≤ 12; else show first 8 + “show all” button) |
| Defaulted | Collapsed (existing toggle) |
| Rejected | Collapsed if present |
| Step relevance | Expanded when ≤ 6 steps; else collapsed with summary |
| Workflow-level mappings | Collapsed |
| Planning notices | Unchanged (20-1) |

**Cap:** If inferred factor count > 12, use “Show all inferred (N)” to avoid scroll fatigue — same pattern as defaults toggle.

---

## 9. Planning integration

| Approach | Decision |
|----------|----------|
| Change adequacy messages in pack | **Out of scope** (Research frozen; LD copy optional later) |
| Re-order panel | Provenance **before** `appendWorkflowBriefPlanningNoticesUi` |
| Factor hints on adequacy rows | **Optional Phase C3** — only if derivable from view model without parsing pack `when` |
| Adequacy blocking | **None** |

---

## 10. Relationship to Slice 20-1

| 20-1 | 20-2 |
|------|------|
| Step list badges | Unchanged |
| `collectWorkflowStepSettingsSummaryValues` | Unchanged — different surface |
| `focusWorkflowStepSettings` | Called from step relevance link |
| Planning Settings buttons | Below provenance |

---

## 11. Verification checklist (PR)

- [ ] `node --test tests/*.test.js` — **124+** passed  
- [ ] No edits under `domains/research/`  
- [ ] No edits to `evaluateWorkflowBriefPlanningAdequacyChecks` / `applyWorkflowBriefMappings` bodies  
- [ ] Manual LD assessment/page path documented in PR description  
- [ ] `docs/consolidation/sprint-20-slice-2-closeout.md` on merge (separate doc task)
