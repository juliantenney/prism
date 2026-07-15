# Sprint 59 — Instructional Content Richness Audit

**Document role:** Authoritative sprint charter — scope, status, entry/exit criteria, and non-goals. For reading order and immediate actions, use [SPRINT-59-START-HERE.md](SPRINT-59-START-HERE.md). For architecture handover facts, use [SPRINT-59-CONTEXT-FOR-NEW-CHAT.md](SPRINT-59-CONTEXT-FOR-NEW-CHAT.md).

## Status

- **Sprint ID:** 59
- **Date opened:** 2026-07-14
- **Status:** In progress — Priority-1 MVP **routing + delivery validated** for mechanism and process; mental-model transfer **not started**
- **Mode:** Diagnostic audit (complete) + GAM depth Iterations 1–7 + archetype MVP implementation/validation (in-sprint)
- **Updated:** 2026-07-15
- **Predecessor:** [Sprint 58](../2026-07-09-sprint-58-partial-page-artefact-architecture-implementation/SPRINT-58-CLOSURE.md) (**closed**)
- **Do not open Sprint 60** from this work — remain in Sprint 59

## Purpose

1. Establish evidence-based instructional-content richness criteria and a prioritized defect backlog **before** renderer redesign.
2. Explain quality variation across topics (e.g. heteroscedasticity vs enzymes).
3. Design and implement the **Instructional Archetype Framework**, separating instructional role from material representation.

## Current conclusion (locked for handoff)

**Quality variation is primarily explained by instructional-archetype support differences rather than domain-specific behaviour.**

- **Primary:** Archetype support asymmetry (Evaluate/diagnose/compare rich; mechanism/process/concept thin — historically).
- **Secondary:** Domain exemplar bias within already-strong archetypes.
- **No evidence of:** Biology-specific routing or domain-specific GAM path divergence.

Formal record: [instructional-archetype-audit.md](instructional-archetype-audit.md).

## Milestone status (2026-07-15)

| Component | Status |
| --------- | ------ |
| DLA contract generation | **PASS** |
| Contract persistence | **PASS** |
| Archetype routing | **PASS** |
| GAM Copy delivery | **PASS** |
| Runtime verification | **PASS** |
| Mechanism transfer test | **PASS** |
| Process transfer test | **PASS** |
| Mental model validation | **NOT STARTED** |

Instructional archetypes are an **independent instructional dimension**. Material type ≠ instructional archetype. Intent travels as optional `instructional_archetype` + `archetype_plan` on DLA `required_materials`, then compact Priority-1 rules on GAM Copy.

**Cache-bust verified at runtime:** `ld-instructional-archetype.js?v=20260715-4`, `workflow-step-recognition-context.js?v=20260715-s59-gam-ctx-1`, `app.js?v=20260715-s59-gam-ctx-1`.

## Scope

### Completed (diagnostic + remediation evidence)

- First richness audit (S59-FA-01 … FA-03) — [FIRST-AUDIT-SUMMARY.md](FIRST-AUDIT-SUMMARY.md)
- Generation-constraint audit — [GENERATION-CONSTRAINT-AUDIT.md](GENERATION-CONSTRAINT-AUDIT.md)
- Iterations 1–7 GAM instructional-depth guidance (causal chains, anti-gaming, anti-leakage)
- Heteroscedasticity success case + enzymes weakness comparison
- Instructional archetype prompt/validation audit

### Completed — Priority-1 MVP (mechanism + process)

- Explicit routing module + DLA plan validation + enzymes fixtures
- Mechanism transfer test **PASS** (link → causal transition → outcome)
- Process transfer test **PASS** (rule `v20260715-4`; finding-transfer walkthrough)
- GAM Copy context-shape fix (`buildWorkflowStepRecognitionContext`) so routing reaches clipboard-bound prompts
- Final-prompt snapshot `window.__PRISM_S59_FINAL_GAM_PROMPT` confirmed on live Copy

See [instructional-archetype-framework.md](instructional-archetype-framework.md), [roadmap.md](roadmap.md), [backlog.md](backlog.md).

### Active — remaining Instructional Archetype Framework work

**Still open:** `mental_model_building` transfer validation; fuller P1/P2 support packages (purpose…validation strategy beyond MVP routing).

**Priority 1:** `mechanism_explanation` ✓ · `process_walkthrough` ✓ · `mental_model_building` (not started)  
**Priority 2:** `concept_exposition`, `recommendation`, `modelling_note` instructional contracts

### Still in scope (diagnostic artefacts)

- Content-type inventory and rubric (retain)
- Classification A–F for findings
- Assessment design vs items distinction
- Renderer sprint input pack (evidence only — when Full HTML evidence exists)

### Out of scope (non-goals)

- Renderer redesign or CSS/layout implementation
- Hard richness validators **without** archetype package definitions
- Architecture migrations (compose shrink, hard DP validation, legacy removal)
- Creating Sprint 60
- Weakening Evaluate / diagnostic SP contracts while closing teaching gaps

### Scope evolution note

The original charter deferred prompt changes. After the first audit and constraint audit, **Iterations 1–7** were approved in-stream to improve GAM depth. That work improved privileged archetypes; the enzymes transfer then showed remaining **teaching-archetype** gaps. Sprint 59 therefore continues with the Instructional Archetype Framework rather than closing as diagnostic-only.

## Entry criteria

- Sprint 58 closed; partial pipeline is the baseline
- Sprint 59 pack reviewed ([SPRINT-59-START-HERE.md](SPRINT-59-START-HERE.md))

## Exit criteria

See [definition-of-done.md](definition-of-done.md).

## Key documents

| Document | Role |
| -------- | ---- |
| [SPRINT-59-START-HERE.md](SPRINT-59-START-HERE.md) | Reading order + immediate actions |
| [SPRINT-59-CONTEXT-FOR-NEW-CHAT.md](SPRINT-59-CONTEXT-FOR-NEW-CHAT.md) | Architecture + handover facts |
| [next-chat-briefing.md](next-chat-briefing.md) | Concise paste for new chat |
| [instructional-archetype-audit.md](instructional-archetype-audit.md) | Formal archetype investigation record |
| [instructional-archetype-framework.md](instructional-archetype-framework.md) | Active workstream + inventory |
| [roadmap.md](roadmap.md) | Phase A/B roadmap |
| [backlog.md](backlog.md) | Prioritized backlog (P1/P2 packages) |
| [decisions.md](decisions.md) | Decision records |
| [GENERATION-CONSTRAINT-AUDIT.md](GENERATION-CONSTRAINT-AUDIT.md) | Token / soft-vs-hard gate findings |
| [FIRST-AUDIT-SUMMARY.md](FIRST-AUDIT-SUMMARY.md) | First richness audit |
| [FIRST-AUDIT-HYPOTHESES.md](FIRST-AUDIT-HYPOTHESES.md) | Patterns + status vs archetype conclusion |
| [definition-of-done.md](definition-of-done.md) | Exit criteria |
| [audit-plan.md](audit-plan.md) | Method + evidence rules |
| [content-type-rubric.md](content-type-rubric.md) | Richness rubric |
| [sample-selection-plan.md](sample-selection-plan.md) | Sample matrix |
| [workflow-evidence-inventory.md](workflow-evidence-inventory.md) | Saved-workflow inventory |
| [issue-classification-framework.md](issue-classification-framework.md) | Primary A–F classification |
| [assessment-review-framework.md](assessment-review-framework.md) | Design / items / workload |
| [findings-template.md](findings-template.md) | Per-lesson form |
| [backlog-template.md](backlog-template.md) | Backlog row schema |
| [renderer-input-template.md](renderer-input-template.md) | Renderer handover evidence |

## Constraints

- Preserve Sprint 58 ownership and pipeline (do not reopen Phase 0/1 DP migration)
- Assessment design ≠ generated assessment items
- Missing evidence ≠ missing generated content
- Material type ≠ instructional archetype ([instructional-archetype-framework.md](instructional-archetype-framework.md))
- Retain Iterations 4–7 anti-gaming and anti-exemplar-leakage rules
