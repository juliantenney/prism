# May 2026 stabilisation hotfixes (pre–Sprint 30)

**Do not regress** these fixes during PEL implementation.

| Hotfix | Repo doc | What it fixed |
|--------|----------|---------------|
| Self-directed activity framing adoption | `docs/development/hotfix-self-directed-activity-framing-adoption.md` | Runtime DLA/GAM OUTPUT CONTRACT; `activity_preamble`, cognition fields on Run |
| Learner-resource brief defaults | `docs/development/hotfix-brief-learner-resource-defaults.md` | `self_directed` / async / not classroom for transcript self-study |
| Learner-page formatting | `docs/development/hotfix-self-directed-learner-page-formatting.md` | Bullets, table rows, readings, timeline sequencing alignment |
| Marx design quality | `docs/development/hotfix-marx-self-study-design-quality-investigation.md` | Integrated scaffolds, orient-before-compare, timeline order |
| Kitchen-sink renderer | `docs/development/hotfix-renderer-kitchen-sink-stabilisation.md` | Tables, headings, answer grid, list markers |
| Assessment step assembly | `docs/development/hotfix-assessment-step-assembly.md` | Assessment steps on self-study when required |
| Brief pedagogic precedence | `docs/development/workflow-brief-pedagogic-precedence-investigation.md` | Seminar vs assessment-primary resolution |

---

## Architectural invariant from hotfixes

**Generation quality** is changed via **prompt scaffolds** and **brief reconciliation** — not new workflow steps or renderer-invented content.

**Run parity:** `applyWorkflowStepRuntimePromptAugmentations` must apply the same blocks as Prompt Factory prefill.
