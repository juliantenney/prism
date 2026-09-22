# Sprint 86 — Charter

**Sprint:** 86 — Expository Editorial Quality & QA  
**Status:** **COMPLETE / CLOSED** (closed 2026-09-22)  
**Type:** Investigation / Design — not implementation  
**Predecessor:** Sprint 85 — COMPLETE / CLOSED ([SPRINT-85-CLOSURE.md](../2026-09-21-sprint-85-expository-resource-implementation/SPRINT-85-CLOSURE.md))  
**Backlog item:** [PB-FA-012 — Expository Editorial Quality & QA](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-012--expository-editorial-quality--qa)  
**Start here:** [SPRINT-86-START-HERE.md](SPRINT-86-START-HERE.md)  
**Opening decision:** [S86-D01](decisions.md#s86-d01--open-sprint-86--expository-editorial-quality--qa)  
**Close:** [S86-D02](decisions.md#s86-d02--close-sprint-86--expository-editorial-quality--qa) · [T-012-SPRINT-86-CLOSURE.md](T-012-SPRINT-86-CLOSURE.md)

---

## Mission

Establish:

1. a **general editorial quality model** for first-class Expository Resources;
2. a **repeatable QA process** for evaluating Expository Resources;
3. **evidence** that the model is useful across substantially different resource types / subject matter (not only Bayes);
4. a **responsibility map** showing where validated editorial principles belong in the existing Expository pipeline;
5. a **bounded implementation design** for a later implementation sprint.

Do **not** implement that design during this sprint unless separately authorised after investigation/design acceptance.

---

## Background — two quality layers

Sprint 85 delivered functional first-class Expository capability. Its closure distinction remains authoritative:

> S85 establishes functional first-class Expository capability. It does not claim that the learner-facing presentation is polished or final.

A live Bayes' theorem Expository Resource showed **instructional architecture** substantially stronger than **editorial execution**: strong conceptual journey and representations, but not yet consistently the feel of a high-quality authored educational book chapter.

| Layer | Question |
| ----- | -------- |
| **Instructional architecture** | Does the resource construct the right understanding, in an appropriate order, with sufficient explanation and representation? |
| **Editorial architecture** | Does it create a coherent and satisfying reading experience through entry, pacing, emphasis, rhetorical variation, transitions, representation integration, controlled recurrence, hierarchy, typography and closure? |

Sprint 86 investigates and designs for the **second** layer without weakening the first.

---

## Core research question

What distinguishes a functionally and pedagogically sound PRISM Expository Resource from a high-quality educational chapter, and how should PRISM systematically produce and evaluate that additional quality?

---

## Overarching working hypothesis (to investigate — not a production contract)

> A high-quality Expository Resource should feel authored as a coherent intellectual experience, not assembled from individually competent instructional components.

---

## Draft editorial principles

**Status:** **INITIAL HYPOTHESES** from Bayes editorial review — to test and revise.  
**Not:** accepted architecture, fixed rubric, or production rules.  
**Canonical draft list:** [DRAFT-EDITORIAL-PRINCIPLES.md](DRAFT-EDITORIAL-PRINCIPLES.md)

Do **not** turn them into a fixed chapter formula (e.g. every resource must open with a provocative question, contain a worked example, etc.). Bayes is **evidence**, not a template.

Particular test: can the quality model explain why a resource feels mediocre even when factually correct, pedagogically sensible, and technically valid?

---

## Expository QA intent

Establish an Expository QA process analogous in **discipline** to Interactive QA, but do **not** copy Interactive quality dimensions where they do not apply.

Prefer structured **human judgement** (e.g. strong / satisfactory / concern; pass / observation / issue; qualitative findings with evidence) over premature numerical scores. Human editorial judgement remains first-class evidence.

Provisional dimension list and process hypotheses: [PLAN.md](PLAN.md) · Charter §QA below.

### Candidate QA dimensions (provisional)

Intellectual journey · explanatory sufficiency · conceptual progression · editorial coherence · rhetorical quality · representation purpose · prose/representation integration · redundancy vs productive recurrence · semantic density · learner-facing information architecture · opening / intellectual entry · closure / synthesis · audience appropriateness · grounding / fidelity · formal/mathematical correctness where applicable · typography / readability / hierarchy · accessibility baseline · overall sense of an authored coherent chapter.

---

## Validation strategy

Bayes' theorem is **case 1**. Plan (and when authorised within investigation) generate a **small** diverse sample of additional PRISM Expository Resources (~4–6 total) to challenge the draft model — deliberately contrasting cases, not confirmation bias.

Prefer actual PRISM-generated outputs as evidence.

---

## Pipeline responsibility hypotheses

Map accepted editorial responsibilities onto the **existing** topology (do not reopen topology merely for editorial refinement):

```text
[Normalize?] → GLC → MK → LO → EJP → XD → XM → Design Page
  → deterministic assembly → learner-renderer-vnext → export
```

Hypotheses for EJP / XD / XM / Design Page / assembly / renderer are recorded in [PLAN.md](PLAN.md). They are **not** accepted changes.

### XD → XM integration seam (important)

Editorial quality suggests prose and representations should sometimes compose as one explanation, yet XD cannot inspect realised XM artefacts at authoring time. Investigate the **smallest coherent** support (richer commissions, deterministic binding, assembly support, or other bounded mechanism). Do **not** assume a new AI stage; do **not** collapse XD/XM; do **not** route XM through Interactive GAM.

### Typography

Part of editorial quality, not decoration. Investigate requirements (measure, rhythm, hierarchy, maths/figures/tables, chrome restraint, a11y) — **not** font selection or CSS implementation in this opening / without later authorisation.

Working principles to investigate:

> The page should reveal the structure of the argument before the reader consciously notices its design.

> Use typography to encode intellectual hierarchy, not to decorate content.

---

## Guardrails (binding)

1. Sprint 85 remains **CLOSED**.  
2. Do not reopen accepted S83/S84 Expository architecture without compelling evidence.  
3. Existing Interactive behaviour remains protected.  
4. Do not modify Interactive prompts merely to improve Expository.  
5. Preserve applicable PRISM capabilities.  
6. Do not solve editorial quality by imposing a fixed chapter template.  
7. Do not optimise against a numerical QA score.  
8. Do not turn every observed Bayes edit into a product requirement.  
9. Prefer evidence from generated resources over speculative codebase investigation.  
10. Do not begin implementation before quality model, QA evidence and pipeline design are sufficiently understood.  
11. Do not invent a large ongoing editorial programme — bounded investigation/design sprint.

---

## Expected outputs (by closure)

1. Expository Editorial Quality Model (tested/refined; general vs context-dependent)  
2. Expository QA framework/process  
3. Diverse QA evidence set (Bayes + contrasting cases)  
4. Pipeline responsibility map  
5. XD/XM integration finding  
6. Typography / editorial rendering requirements (principles, not implementation)  
7. Bounded implementation design / successor recommendation  

---

## Non-goals (binding at open)

- Production code / prompt / contract / schema / renderer / CSS changes  
- Editorial implementation in this sprint  
- Reopening S83/S84/S85 decisions or topology without compelling evidence  
- Fixed chapter template or numerical QA optimisation  
- Research Synthesis resolution (remains with PB-FA-011)  
- Expository → Interactive transformation  
- CAS / table-maths / new maths programmes  

---

## Settled programme inputs

| Input | Authority |
| ----- | --------- |
| Alpha development complete | [S82-D04](../2026-09-01-sprint-82-maths-entry-and-alpha-completion/decisions.md#s82-d04--alpha-development-complete) |
| First-class gate | **339/339** |
| Functional Expository | [SPRINT-85-CLOSURE.md](../2026-09-21-sprint-85-expository-resource-implementation/SPRINT-85-CLOSURE.md) |
| Accepted Expository design | [S84 design](../2026-09-21-sprint-84-expository-resource-planning/S84-EXPOSITORY-RESOURCE-DESIGN.md) |
| Protected Interactive baseline | [S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline) |

Programme pointer: [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md)
