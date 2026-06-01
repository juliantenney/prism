# Session handover — Sprint 30 (Pedagogic Enrichment Layer)

**Role:** authoritative entry point for **this pack only**.

**Pack path:** `docs/development/sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/`

**Date:** 2026-05-21

**Live repo rule:** `app.js`, `domains/learning-design/`, and `tests/` are authoritative. Refresh pack notes when behaviour, tests, or evidence change.

---

## Continue here (next chat)

1. Read [`sprint-30-charter.md`](sprint-30-charter.md) (scope, PECs, phases, non-goals).  
2. Read [`CURRENT-STATE.md`](CURRENT-STATE.md) (slice status + test floor).  
3. Open [`pec-registry.md`](pec-registry.md) — PEC architecture (no code until 30-1 charter approved).  
4. Review [`context-files/`](context-files/) — probes, hooks, fixtures, stabilisation summary.  
5. Run `node --test tests/*.test.js` — expect **430** pass.  
6. Start implementation only via [`slice-30-1-charter.md`](slice-30-1-charter.md) (`orientation_contract`).

**Framing:** This is **not** a workflow-orchestration sprint, **not** adaptive tutoring, **not** a Sprint 29 renderer reopen.

---

## Sprint 30 in one paragraph

After Sprints 26–29 and May 2026 hotfixes, PRISM reliably produces **correct workflow topology**, **assessment semantics**, **cognition-typed activity fields**, and **passive renderer display** for learner pages. Self-directed outputs can still feel **procedurally correct but pedagogically thin** — weak orientation, shallow reasoning scaffolds, poor cross-activity coherence. Sprint 30 adds a **Pedagogic Enrichment Layer (PEL)** through optional **Pedagogic Enrichment Contracts (PECs)** attached to **DLA / GAM / Design Page** prompts — enriching generation without new workflow steps.

---

## What prior sprints closed (do not re-open)

| Programme | Status | Pack |
|-----------|--------|------|
| Sprint 27 assessment / feedback semantics | **Closed** | [`../2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/`](../2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/) |
| Sprint 28 cognition packs + DLA/GAM contracts | **Closed** | [`../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/`](../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/) |
| Sprint 29 renderer cognition semantics | **Closed** | [`../2026-05-21-sprint-29-renderer-cognition-semantics/`](../2026-05-21-sprint-29-renderer-cognition-semantics/) |

---

## May 2026 stabilisation (do not regress)

| Hotfix | Doc (repo root `docs/development/`) |
|--------|-------------------------------------|
| Self-directed OUTPUT CONTRACT + runtime adoption | `hotfix-self-directed-activity-framing-adoption.md` |
| Learner-resource brief defaults | `hotfix-brief-learner-resource-defaults.md` |
| Timeline sequencing vs source order | `hotfix-marx-self-study-design-quality-investigation.md` + learner-page formatting hotfix |
| Kitchen-sink renderer | `hotfix-renderer-kitchen-sink-stabilisation.md` |
| Assessment step assembly | `hotfix-assessment-step-assembly.md` |

Summary: [`context-files/stabilisation-hotfixes-summary.md`](context-files/stabilisation-hotfixes-summary.md)

---

## Primary evidence briefs (probes)

| Probe | Purpose | Context file |
|-------|---------|--------------|
| **P30-01** Marx self-study page | Multi-activity coherence, framing, timeline | [`context-files/probe-brief-marx-self-study.md`](context-files/probe-brief-marx-self-study.md) |
| **P30-02** RNA transcript self-study | Uploaded source, brief defaults, activity chain | [`context-files/probe-brief-rna-transcript-self-study.md`](context-files/probe-brief-rna-transcript-self-study.md) |
| **P30-03** Workshop regression | Facilitated brief must stay classroom/workshop | [`context-files/probe-brief-workshop-regression.md`](context-files/probe-brief-workshop-regression.md) |

Full templates: [`workflow-probe-catalogue.md`](workflow-probe-catalogue.md)

---

## Layer boundaries (Sprint 30)

| Layer | Touch? | Notes |
|-------|--------|-------|
| **E** Brief | Rare | Learner-resource defaults hotfixed; avoid classroom bias |
| **O** Topology | **No** | No new steps |
| **G** Generation | **Yes** | PEC prompt scaffolds on DLA, GAM, Design Page |
| **C** Composition | Passthrough | Preserve enrichment fields in page JSON |
| **R** Renderer | Minimal | Display new keys only; see [`context-files/sprint-28-29-boundaries.md`](context-files/sprint-28-29-boundaries.md) |

---

## Key code hooks

See [`context-files/app-generation-hooks.md`](context-files/app-generation-hooks.md).

| Function | Role |
|----------|------|
| `applyWorkflowStepRuntimePromptAugmentations` | Run must match Factory scaffolds |
| `applySelfDirectedLearnerPageStepScaffoldsToDraft` | OUTPUT CONTRACT, timeline alignment |
| `applyPedagogicCognitionContractScaffoldToDraft` | Sprint 28 cognition blocks |
| `reconcileWorkflowBriefPedagogicFactors` | Brief defaults + learner-resource alignment |
| `mergeSelfDirectedActivityFramingFieldsIntoPageActivities` | Composition merge |

---

## Recommended first actions (30-1)

| # | Action |
|---|--------|
| 1 | Approve [`slice-30-1-charter.md`](slice-30-1-charter.md) field list for `orientation_contract` |
| 2 | Add PEC registry stub in `app.js` (document in [`pec-registry.md`](pec-registry.md) first) |
| 3 | Implement orientation prompt block on DLA + Design Page for `self_directed` learner pages |
| 4 | Add tests — extend framing adoption or new `workflow-pel-orientation.test.js` |
| 5 | Record decisions in [`review-log.md`](review-log.md) as R30-00x |
| 6 | Capture live run notes under `context-files/probe-p30-*` when run |

---

## Read order

| Order | File |
|-------|------|
| 1 | [`HANDOVER.md`](HANDOVER.md) (this file) |
| 2 | [`sprint-30-charter.md`](sprint-30-charter.md) |
| 3 | [`CURRENT-STATE.md`](CURRENT-STATE.md) |
| 4 | [`pec-registry.md`](pec-registry.md) |
| 5 | [`slice-30-1-charter.md`](slice-30-1-charter.md) |
| 6 | [`context-files/README.md`](context-files/README.md) |
| 7 | [`investigation-plan.md`](investigation-plan.md) |

---

## Verification

```bash
cd c:\xampp\htdocs\prism
node --test tests/*.test.js
```

**Floor:** **430** passing (2026-05-21) — [`context-files/baseline-test-floor.md`](context-files/baseline-test-floor.md)

---

## Copy-paste prompt for new chat

```
Continue Sprint 30 — Pedagogic Enrichment Layer on Prism.

Pack: docs/development/sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/
Read HANDOVER.md → sprint-30-charter.md → slice-30-1-charter.md → context-files/

Constraints: no new workflow steps; no adaptive tutoring; no orchestration redesign;
minimal renderer (display JSON only). Test floor: 430+ (node --test tests/*.test.js).

Next: 30-1 orientation_contract on DLA/Design Page for self_directed learner pages.
```
