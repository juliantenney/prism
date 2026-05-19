# Elicitation and brief resolution — runtime entrypoints

**Authoritative:** `app.js`, `workflowGenerationContext.js`  
**Why it matters:** 26-1 must trace **which function** sets or drops activity vs assessment signals.

---

## Pipeline functions (ordered)

| Step | Function | Approx. lines (`app.js`) | Role |
|------|----------|--------------------------|------|
| Pack config load | `getWorkflowBriefConfig` | via `workflowGenerationContext.js` | LD `workflowBriefConfig` JSON |
| Per-workflow config | `resolveWorkflowBriefConfigForWorkflow` | ~1764 | Merge workflow + resolved state |
| Text interpret | `interpretWorkflowBriefText` | ~7150+ | `session_materials`, `learning_environments` from prose |
| Explicit factors | `extractWorkflowBriefExplicitFactors` | ~7226 | Regex extract: `assessment_required`, `page_profile`, duration, etc. |
| Inference | `applyWorkflowBriefInferenceRules` | (pack-driven) | Pack `inferenceRules` |
| Resolution | `resolveWorkflowBriefFactors` | ~7459 | Merge explicit + inferred + elicited + defaults |
| Assessment class | `resolveAssessmentIntentClassMetadata` | ~8940+ | Post-gen assessment elicitation queue |
| Workflow design | `callOpenAIForWorkflowDesign` | ~13292 | Model proposes `steps[]` |
| Heuristics | `applyWorkflowDesignHeuristics` | ~10057 | Canonicalize, triggerRules, **prune** |
| Test API | `window.__PRISM_TEST_API.*` | ~26098+ | Unit tests hook extract/heuristics |

---

## Key extract — assessment vs activity asymmetry

```javascript
// app.js extractWorkflowBriefExplicitFactors (~7293–7295) — excerpt
var mcqTypeCueRe = /\b(mcq|mcqs|multiple[ -]?choice(?:\s+questions?)?)\b/;
if (/\b(quiz|assessment|test)\b/.test(blob) || mcqTypeCueRe.test(blob)) out.assessment_required = true;
if (/\b(no assessment|without assessment)\b/.test(blob)) out.assessment_required = false;
```

**Note:** No parallel `activities_required = true` extract in this function at open.

---

## Key heuristics — intent flags

```javascript
// app.js applyWorkflowDesignHeuristics (~10164–10175) — excerpt
var assessmentItemsRequested = hasIntent(
  /\b(assessment questions?|...|formative assessment|assessment items?)\b/
);
var explicitSessionOrActivityRequested = hasIntent(
  /\b(session|lesson|workshop|class|activities?|tasks?|exercise|learning outcomes?|learning sequence)\b/
);
```

```javascript
// app.js (~10185–10191) — formative lean path gate
var formativeAssessmentPackDefaultIntent =
  hasIntent(/\bformative assessment\b/) &&
  !assessmentBlueprintRequested &&
  !explicitRubricRequested &&
  !explicitPageRequested &&
  !explicitSessionOrActivityRequested &&
  !explicitItemBankOrMcqRequested;
```

---

## Pack load path

| Module | Function |
|--------|----------|
| `workflowGenerationContext.js` | `getWorkflowBriefConfig`, `getWorkflowPolicy` |
| LD pack file | `domains/learning-design/domain-learning-design-step-patterns.md` — embedded `workflowBriefConfig` + `workflowPolicy` JSON |

---

## Tests to extend (26-3 — not 26-1)

| File | Today |
|------|-------|
| `tests/workflow-brief-pass1.test.js` | Brief pass-1 patterns |
| `tests/workflow-brief-config-input-strategy.test.js` | Input strategy |
| `tests/workflow-research-design-page-heuristic.test.js` | Research heuristics |

**Gap:** no `tests/fixtures/workflow-brief-ld-sparse/` for LD activity-intent briefs.

---

## 26-1 trace procedure

1. Build minimal brief object matching RNA case.
2. Call `__PRISM_TEST_API.extractWorkflowBriefExplicitFactors(base)`.
3. Call `__PRISM_TEST_API.applyWorkflowDesignHeuristics(parsedSteps, hints)` with resolved factors.
4. Log `stepsAfterPruning` vs expected — pin baseline before any fix.
