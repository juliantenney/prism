# Workflow topology rules — current state (summary)

**Authoritative pack:** `domains/learning-design/domain-learning-design-step-patterns.md` — `workflowPolicy`  
**Authoritative runtime:** `app.js` — `applyWorkflowDesignHeuristics`  
**Why it matters:** Topology is **split** between pack declarative rules and runtime pruning heuristics.

---

## Pack layer — dependencies (excerpt)

Activities and materials are **first-class** in the canonical chain:

```
Define Learning Outcomes
  → Design Learning Activities  → learning_activities
  → Generate Activity Materials → activity_materials, session_materials
  → Design Page                 → page (optionalRequires include learning_activities)
```

See pack JSON `dependencies` block (~74–79 in step-patterns file).

---

## Pack layer — triggerRules (selected)

| Rule pattern | Effect |
|--------------|--------|
| `assessment_required: true` | **include** `Generate Assessment Items` |
| `session_materials: [page]` + goal mentions activities/tasks | **include** full pedagogy chain + Design Page |
| `session_materials: [page]` + source content + thin conversion goal | **exclude** Outcomes, Activities, Materials, Sequence — **include** Model Knowledge + Design Page only |
| Goal mentions lesson/session/workshop | **include** `Construct Learning Sequence` |

**Asymmetry:** Assessment has a **boolean factor trigger**; activities rely on **goal phrase lists** in trigger rules, not `activities_required`.

---

## Runtime layer — strong assessment pruning

Two high-impact filters in `applyWorkflowDesignHeuristics` (~11094–11160):

### 1. `leanAssessmentItemIntent`

When assessment + MCQ/item-bank cues **without** page/session/activity/blueprint cues — **drops**:

- Define Learning Outcomes  
- **Design Learning Activities**  
- **Generate Activity Materials**  
- Generate Learning Content, Model Knowledge, Construct Learning Sequence, Design Page  

### 2. `formativeAssessmentPackDefaultIntent`

When `/\bformative assessment\b/` and **not** `explicitSessionOrActivityRequested` (and other guards) — **drops**:

- **Design Learning Activities**  
- **Generate Activity Materials**  
- Construct Learning Sequence  

---

## Runtime layer — assessment_required interaction

Explicit extract sets `assessment_required` from quiz/assessment/test/MCQ language. Pack rule then **includes** Generate Assessment Items even when model omitted it.

**No equivalent** automatic **include** for Design Learning Activities when brief says "learning activities" — must rely on model + other triggerRules + not being pruned.

---

## self-study / self_directed

| Mechanism | Behaviour |
|-----------|-----------|
| `delivery_context: self_directed` | Influences `allowGenerateLearningContent` and activity **style** in pack prompts |
| `selfDirectedPageNeedsSequence` | May add sequence step in some page paths (verify in 26-1) |
| Thin page + source content | Pack rule may **exclude** activity chain entirely |

**26-1:** Confirm which path RNA case matched.

---

## Proposed direction (26-2 — not implemented)

| Rule | Intent |
|------|--------|
| `activities_required: true` | Explicit extract when brief mentions learning activities / tasks / exercises (configurable phrase map) |
| Pack `triggerRules` | `whenResolvedFactorsInclude: { activities_required: true }` → include Activities + Materials |
| Pruning guard | **Never** apply `formativeAssessmentPackDefaultIntent` or `leanAssessmentItemIntent` when `activities_required` or strong activity phrase detected |

---

## Trace logging

When enabled, `[PRISM][Trace][Heuristics]` logs:

- `matchedTriggerRules`
- `stepsAfterTriggerRules`
- `stepsAfterPruning`
- `leanAssessmentItemIntent`

Use on RNA rerun to attribute failure to model vs heuristics.
