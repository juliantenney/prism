# Sprint 57A — Closure Report

**Sprint:** 57A — Instructional Sufficiency & Content Budgeting Investigation  
**Status:** **Closed**  
**Closed:** 2026-07-09  
**Successor:** [Sprint 58 — Partial Page Artefact Architecture Implementation](../2026-07-09-sprint-58-partial-page-artefact-architecture-implementation/SPRINT-58-START-HERE.md)

---

## Sprint type

Investigation only. No production implementation.

---

## Objectives achieved

| Objective | Status | Evidence |
| --------- | ------ | -------- |
| Define learner-time budgeting model | **Done** | [instructional-budget-model.md](instructional-budget-model.md), [learner-time-allocation-framework.md](learner-time-allocation-framework.md) |
| Define core vs extension content policy | **Done** | [core-vs-extension-content-policy.md](core-vs-extension-content-policy.md) |
| Define DLA activity sizing guidance | **Done** | [dla-activity-sizing-guidelines.md](dla-activity-sizing-guidelines.md) |
| Define GAM material budgeting guidance | **Done** | [gam-material-budget-guidelines.md](gam-material-budget-guidelines.md) |
| Define content depth guidelines | **Done** | [content-depth-guidelines.md](content-depth-guidelines.md) |
| Controlled end-to-end workflow testing | **Done** | Full-page progressive enrichment pipeline exercised (Episode Plan → DLA → GAM → Learning Sequence → Design Page) |
| Instructional-validity / viability assessment | **Done** | See conclusions below |
| Implementation go/no-go recommendation | **Done** | Proceed to **Sprint 58** with revised architecture (partial artefacts + deterministic assembly) |

---

## Central conclusion

> **Full-page enrich-in-place progressive enrichment is not viable with current LLM behaviour at realistic page sizes.**  
> Prompt hardening alone cannot enforce structural preservation across post-Episode-Plan stages.  
> Implementation should proceed via **partial page artefacts** stored per workflow step and **deterministic code assembly** at render time.

This supersedes the Sprint 56F assumption that each stage would receive and return the same complete page object with only owned-field mutations.

---

## Evidence from end-to-end workflow testing

Testing during 57A (building on Sprint 56F implementation work) demonstrated repeated failure modes when post-EP stages were asked to preserve and return complete pages:

| Failure mode | Stage(s) | Description |
| ------------ | -------- | ----------- |
| Partial page emission | GAM | Output stopped after early activities; later `activity_id` rows omitted |
| Materials-only activity stubs | GAM | Activities reduced to `{ activity_id, materials }` — DLA-owned fields dropped |
| Field pruning / emptying | GAM | `required_materials[]` emptied; `episode_plans[]` truncated |
| Page reconstruction | GAM, later stages | Non-owned fields rewritten, summarised, or simplified despite preservation instructions |
| Meta-output instead of page | GAM | Top-level `note` / limitation messages instead of complete JSON |
| Non-owned field regression | LS, DP (when tested) | Upstream content reconstructed, pruned, or compacted despite enrich-in-place contracts |

**Renderer path was validated** when a structurally complete page was available. Failures occurred upstream in LLM emission, not in `normalizePageForRender`.

**Prompt-only remediation was attempted extensively** (GAM contract versions PAGE-3 through PAGE-15+, activity-count invariants, no-meta-output rules). Improvements were partial and non-durable across fresh runs.

---

## Instructional budgeting conclusions (retained)

These remain valid reference guidance and are **not** blockers to implementation:

1. **Learner workload ≠ word count.** Page duration must be modelled as reading, thinking, production, discussion, analysis, and review — not generated text volume alone.
2. **Core vs extension separation** reduces textbook-like page bloat without sacrificing instructional sufficiency.
3. **DLA activity sizing** and **GAM material budgets** should constrain generation ambition per learner-time budget.
4. **Anti-pattern:** using content volume as a proxy for instructional quality.

Sprint 58 does **not** continue open-ended instructional-budget research. Budget heuristics from 57A inform prompt authoring but are not Sprint 58 scope.

---

## Exit decision (revised)

Original 57A exit options were:

- A. Proceed to Sprint 57B implementation (full-page progressive enrichment)
- B. Continue instructional-budget investigation

**Actual outcome:**

- **C. Proceed to Sprint 58** — implement partial page artefact architecture with deterministic assembly.

Rationale: instructional budgeting models are sufficiently defined for implementation planning; the binding constraint discovered in 57A is **LLM full-page preservation failure**, not unresolved budget theory.

---

## Open questions carried forward to Sprint 58

See [context/open-questions.md](context/open-questions.md) (updated at closure).

Primary carries:

- Exact partial artefact envelope per stage
- `page_synthesis` vs `sections[]` for Design Page partial output
- GAM partial shape: minimal `{ activity_id, materials }` stubs vs fuller activity rows
- Whether chat-only context (no PRISM upstream embed) is operationally sufficient for DLA onward
- Stage-subset validation vs full-schema validation on paste
- Legacy workflow gating strategy

---

## Follow-on work (Sprint 58)

| 57A finding | Sprint 58 action |
| ----------- | ---------------- |
| Full-page enrich-in-place fails | Partial page outputs per stage |
| Upstream JSON embed encourages reconstruction | Remove upstream artefact injection from downstream prompts |
| PRISM cannot rely on LLM merge | Deterministic `assembleVNextPageFromWorkflowCaptures` |
| Captures exist in `runStepOutput` | Use stored step outputs for assembly only — not prompt inputs |
| v2 schema frozen in 56F | Retain `artifact_type: page`, `schema_version: 2.0.0` |
| 56F implementation partially built | Refactor/replace full-page v2 prompt and validation paths |

---

## Artefacts produced

| # | Artefact | Location |
| - | -------- | -------- |
| 1 | Start here | [SPRINT-57A-START-HERE.md](SPRINT-57A-START-HERE.md) |
| 2 | Sprint overview | [sprint-overview.md](sprint-overview.md) |
| 3 | Problem statement | [problem-statement.md](problem-statement.md) |
| 4 | Instructional budget model | [instructional-budget-model.md](instructional-budget-model.md) |
| 5 | Learner time allocation framework | [learner-time-allocation-framework.md](learner-time-allocation-framework.md) |
| 6 | Core vs extension policy | [core-vs-extension-content-policy.md](core-vs-extension-content-policy.md) |
| 7 | Content depth guidelines | [content-depth-guidelines.md](content-depth-guidelines.md) |
| 8 | DLA activity sizing | [dla-activity-sizing-guidelines.md](dla-activity-sizing-guidelines.md) |
| 9 | GAM material budgets | [gam-material-budget-guidelines.md](gam-material-budget-guidelines.md) |
| 10 | Experiment plan | [output-budget-experiment-plan.md](output-budget-experiment-plan.md) |
| 11 | Test strategy | [test-strategy.md](test-strategy.md) |
| 12 | Risk register | [risk-register.md](risk-register.md) |
| 13 | Backlog | [backlog.md](backlog.md) |
| 14 | Handover context | [handover-context.md](handover-context.md) |
| 15 | Closure report | This document |

---

## Governance

- Sprint 57A artefacts are **frozen** — reference only.
- No further investigation scope should be added to 57A except typo/link maintenance.
- Implementation begins in Sprint 58.

**Entry point for implementation:** [SPRINT-58-START-HERE.md](../2026-07-09-sprint-58-partial-page-artefact-architecture-implementation/SPRINT-58-START-HERE.md)
