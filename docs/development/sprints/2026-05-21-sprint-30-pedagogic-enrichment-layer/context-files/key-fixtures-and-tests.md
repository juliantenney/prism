# Key fixtures and tests (Sprint 30)

---

## Page render fixtures

| Fixture | Path | Use |
|---------|------|-----|
| Kitchen-sink | `tests/fixtures/page-render/renderer-kitchen-sink-page.json` | Renderer util coverage |
| Marx self-study | `tests/fixtures/page-render/marx-self-study-page.json` | Framing + render |
| Climate misconception | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` | Facilitated render |
| Inflation workshop | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` | Assessment visibility |

---

## Workflow brief fixtures

| Fixture | Path | Use |
|---------|------|-----|
| RNA sparse | `tests/fixtures/workflow-brief-ld-sparse/rna-virus-activities-formative.json` | Topology + activities |
| Marx DLA procedural | `tests/fixtures/workflow-brief/marx-dla-procedural-output.json` | Framing coverage negative |
| Pass 1 maximal | `tests/fixtures/workflow-brief-pass1/maximal-factor-rich.json` | Extract pin |

---

## Test files (run before/after each slice)

| File | Covers |
|------|--------|
| `tests/workflow-self-directed-activity-framing-adoption.test.js` | OUTPUT CONTRACT, runtime Run, Marx |
| `tests/workflow-brief-learner-resource-defaults.test.js` | Transcript/Marx/workshop brief resolution |
| `tests/workflow-self-directed-learner-page-formatting.test.js` | Timeline, tables, GAM scaffolds |
| `tests/utility-renderer-kitchen-sink.test.js` | Renderer regressions |
| `tests/workflow-ld-cognition-contracts.test.js` | Sprint 28 contracts + peer goal |
| `tests/workflow-ld-rna-sparse-brief-topology.test.js` | RNA activity chain |
| `tests/workflow-assessment-step-assembly.test.js` | Assessment on self-study |
| `tests/utility-marx-page-render.test.js` | Marx HTML |
| `tests/utility-self-directed-activity-framing.test.js` | Renderer framing |

---

## Domain pack

| Resource | Path |
|----------|------|
| LD step patterns + brief config | `domains/learning-design/domain-learning-design-step-patterns.md` |

Search `### Workflow Brief Config` and `step_design_learning_activities` prompt templates.
