# Regression fixture candidates (26-3)

**Authoritative tests (extend later):** `tests/workflow-brief-pass1.test.js`, new `tests/workflow-brief-ld-sparse/`  
**Why it matters:** 26-1 proposes fixtures; **26-3** implements after rules are designed.

---

## Proposed directory

```
tests/fixtures/workflow-brief-ld-sparse/
  rna-virus-activities-formative.json
  explicit-activities-only.json
  formative-without-activities-phrase.json
  lean-mcq-pack.json
  self-study-page-with-tasks.json
  source-to-page-thin.json
```

---

## Fixture catalogue

| ID | Scenario | Brief cues | Expected post-heuristic steps (minimum) |
|----|----------|------------|----------------------------------------|
| **LD-S1** | **RNA virus case** | transcript, learning activities, formative, self-study | Activities + Materials + Assessment + Page |
| **LD-S2** | Explicit activities only | "short learning activities", no assessment words | Activities + Materials + Page; no assessment unless asked |
| **LD-S3** | Formative assessment only | "formative assessment", no activity words | Lean path OK: Assessment Items; **no** Activities |
| **LD-S4** | MCQ pack | "10 MCQs", topic-only | Lean path: Assessment; prune pedagogy |
| **LD-S5** | Self-study + tasks | self-study, learner tasks, page | Activities (self-directed style) + Materials + Page |
| **LD-S6** | Thin source→page | convert transcript to page, no activities | Model Knowledge + Page only (exclude activities) |

---

## Fixture JSON shape (proposal)

```json
{
  "id": "LD-S1-rna-virus",
  "domain": ["learning-design"],
  "brief": {
    "goal": "...",
    "inputs": "...",
    "desiredOutputs": "...",
    "startingArtefact": "provided_source_content"
  },
  "expect": {
    "resolvedFactors": {
      "assessment_required": true,
      "activities_required": true
    },
    "stepsInclude": [
      "Design Learning Activities",
      "Generate Activity Materials"
    ],
    "stepsExclude": []
  }
}
```

**Note:** `activities_required` does not exist yet — fixture documents **desired** contract for 26-2/26-4.

---

## Test style (26-3)

- Call `__PRISM_TEST_API.extractWorkflowBriefExplicitFactors`
- Call `__PRISM_TEST_API.applyWorkflowDesignHeuristics` with mock step list
- Assert step title set ⊆ expected
- **Do not** call live OpenAI in CI

---

## Research cross-reference

Sprint 17 proposed `tests/fixtures/workflow-brief-research-sparse/` — same extract function, different pack rules. LD fixtures must use **LD pack** `workflowPolicy` in hints.

---

## Track B — page composition fixtures (26-3 proposal)

| ID | Scenario | Assert |
|----|----------|--------|
| **LD-P1** | Page JSON with `assessment_check` + items (inflation-shaped) | HTML contains `util-assessment` / formative heading |
| **LD-P2** | Page JSON: `source_artefacts.assessment_items: true` but **no** `assessment_check` section | Documents failure mode — no MCQ HTML |
| **LD-P3** | RNA page JSON capture (when available) | Pin regression for invisible assessment |

---

## Priority for 26-1

1. **LD-S1** — pin RNA baseline (failing today) — Track A  
2. **LD-P2** — document metadata-vs-body gap — Track B  
3. **LD-S3** — confirm formative lean path is intentional when no activity words  
4. **Inflation render** — confirm assessment section renders (`utility-ld-inflation-page-render.test.js`)  
5. **LD-S6** — guard thin-page exclude rule does not regress  
