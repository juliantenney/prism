# Generated workflow — observed vs expected

**Authoritative:** persisted workflow on Factory workflow definition screen  
**Why it matters:** This is the **user-visible failure** — wrong step topology.

---

## Expected steps (when brief requests learning activities)

| # | Canonical title | Produces |
|---|-----------------|----------|
| 1 | Normalize Content | `normalized_content` |
| 2 | Model Knowledge | `knowledge_model` |
| 3 | Define Learning Outcomes | `learning_outcomes` |
| 4 | **Design Learning Activities** | `learning_activities` |
| 5 | **Generate Activity Materials** | `activity_materials` |
| 6 | Generate Assessment Items | `assessment_items` |
| 7 | Design Page | `page` |

---

## Observed steps (RNA virus case — reported)

| # | Canonical title | Notes |
|---|-----------------|-------|
| 1 | Normalize Content | OK |
| 2 | Model Knowledge | OK |
| 3 | Define Learning Outcomes | OK |
| 4 | Generate Assessment Items | Present — assessment path strong |
| 5 | Design Page | Present — no upstream activities |

**Missing:** rows 4–5 from expected table (activities + materials).

---

## UI notes to capture on rerun

- Step **titles** (canonicalized display labels)
- Whether **Design Assessment** appeared then was pruned
- Whether **Generate Learning Content** appeared
- Workflow **trace** in DevTools if `[PRISM][Trace][Heuristics]` logging enabled

---

## Runtime pruning candidates (verify in 26-1)

From `app.js` `applyWorkflowDesignHeuristics` optional-step filter (~11094–11160):

**`formativeAssessmentPackDefaultIntent`** removes when brief matches `/\bformative assessment\b/` AND NOT session/activity/page/blueprint/rubric cues:

- `design learning activities`
- `generate activity materials`
- `construct learning sequence`

**`leanAssessmentItemIntent`** removes pedagogy chain when assessment + MCQ/item-bank cues without session/page/activity scaffolding.

**Critical 26-1 check:** Does brief text `"learning activities"` satisfy `explicitSessionOrActivityRequested`?

```javascript
// app.js ~10173–10175 (excerpt)
var explicitSessionOrActivityRequested = hasIntent(
  /\b(session|lesson|workshop|class|activities?|tasks?|exercise|learning outcomes?|learning sequence)\b/
);
```

If **yes**, `formativeAssessmentPackDefaultIntent` should be **false** and these steps should survive unless another rule prunes them.

---

## Pack trigger (assessment include)

LD pack `workflowPolicy.triggerRules` includes assessment when:

```json
"whenResolvedFactorsInclude": { "assessment_required": true },
"include": ["Generate Assessment Items"]
```

No symmetric rule for activities at pack level (26-2 proposal).
