# Sprint 76 — Charter

**Sprint:** 76 — DLA Rationalisation and Content-Quality Consistency  
**Status:** **OPEN** (opened 2026-08-13)  
**Opened:** 2026-08-13  
**Predecessor:** Sprint 75 — COMPLETE / Closed (2026-08-12) — UX programme closed; do not reopen casually  
**Type:** Content-quality / generation-contract investigation and rationalisation (audit-first)  
**Start here:** [SPRINT-76-START-HERE.md](SPRINT-76-START-HERE.md)  
**Opening decision:** [S76-D01](decisions.md#s76-d01--open-sprint-76--dla-rationalisation-and-content-quality-consistency)  
**Related backlog (signals — not auto-consumed):** [PB-FA-006](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-006--qa--workflow-and-resource-refinement-lifecycle) · [PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency)

---

## Mission

Improve the **consistency and educational quality** of PRISM-generated learning resources by rationalising Design Learning Activities (DLA) responsibilities, clarifying task/material closure, and resolving semantic friction around evidence/provenance — grounded in post–Sprint 75 investigation evidence.

The goal is **not** a general PRISM redesign.

The goal is **not** artificial benchmark gaming.

The goal is stronger underlying instructional/resource quality that the QA/benchmark measures — with **typical** performance and **lower run-to-run variance**, aiming toward mid-90s territory over time.

Investigation postures (hypothesis until evidence): **RECOVER** any regression from the Sprint 71 known-good historical quality baseline, then **ADVANCE** remaining task–material / richness problems. Do **not** treat regression as established before T-010 demonstrates it.

---

## Why this sprint exists

Post–Sprint 75 investigation of Lagrangian Multipliers generation showed that the problem is **better bounded** than “Lagrangian sometimes produces weak content”:

- Architecture / scaffolding / feedback dimensions often score strongly.
- Failures concentrate around **DLA complexity**, **task–material sufficiency**, **content richness**, and **evidence/provenance semantics**.
- Intermediate artefacts can omit material learners need; GAM sometimes compensates by luck — which is not architectural correctness.
- DLA assembled prompt size has been observed at approximately **72,000 characters** — more than double a previously rationalised scale — without a known justification for that growth.
- Sprint 71 previously demonstrated stronger typical scores (cluster ~**85.3–91**, including Roman Roads **90** and constructed-content STEM **87–90**) than the current Lagrangian release cluster (~**79**). Whether current DLA has **regressed** from that baseline is a **RECOVER** investigation hypothesis, not an established finding.
- Evidence-injection machinery is under review after live validator/semantic friction.

Full evidence: [CONTEXT.md](CONTEXT.md).

---

## Central questions

1. What does DLA currently own, and how much of the ~72k prompt is necessary, duplicated, or superseded? Reconstruct growth as a **historical delta** where git/docs permit.  
2. Where do EP → DLA and DLA → GAM contracts fail to require materials that learner tasks need?  
3. May evidence machinery conflate or insufficiently distinguish material requirement, provenance/authenticity, and epistemic function? (Observed semantic friction makes this a first-class **audit question**, not a settled finding.)  
4. After rationalisation, do Roman Roads (control) and Lagrangian (challenge) improve in **quality**, **reliability**, and **contract quality**?  
5. **RECOVER then ADVANCE:** has quality regressed from the Sprint 71 known-good historical quality baseline (including constructed/generated-content comparison cases); once recovered, what richness/closure work remains?

---

## Success direction (track three concepts)

| Concept | Meaning |
| ------- | ------- |
| **QUALITY** | Does typical benchmark performance improve? |
| **RELIABILITY** | Does run-to-run variance decrease? |
| **CONTRACT QUALITY** | Do intermediate artefacts contain what downstream stages need — before the final benchmark? |

A high final score that depends on GAM luckily inferring a missing DLA obligation is **not** sufficient evidence that the architecture is correct.

Sprint 76 is **not** failed merely because every run does not immediately reach 95. Improve underlying causes and establish evidence about the remaining ceiling.

---

## Closure exit condition — durable prompt-engineering discipline

Sprint 76 **must not close** after merely rationalising DLA once.

Before closure, the sprint must **establish and document** a durable prompt-engineering discipline intended to prevent recurrence of:

> **APPEND NOW → RATIONALISE LATER**

The eventual Sprint 76 solution should address principles such as:

- identify the existing authoritative responsibility before adding instructions;  
- modify / replace existing instructions rather than automatically append;  
- rationalise superseded / overlapping wording in the **same** change;  
- consider whether a requirement belongs in prompt prose, schema, validation, application logic, or another workflow stage;  
- assess net prompt-size impact;  
- make material prompt growth intentional and explainable;  
- protect behavioural contracts with tests rather than accumulated defensive prose;  
- provide enough observability to detect unexpected prompt growth.

**Not mandated at open (outputs of Sprint 76, informed by T-010):** arbitrary character limits; a particular automated guardrail; a specific metric; a particular implementation. The exact discipline is an **exit condition / deliverable**, not a pre-committed mechanism.

Decision: [S76-D03](decisions.md#s76-d03--durable-prompt-engineering-discipline-as-sprint-76-exit-condition).

---

## Preserve known strengths

Benchmark evidence repeatedly indicates strong:

- instructional architecture  
- scaffolding & independence  
- feedback & self-regulation  
- independent-study effectiveness  
- Orient → Learn → Do → Check structure  

Do **not** frame Sprint 76 as a general redesign that risks those strengths.

---

## Boundaries

| In programme (eventually, after evidence + decisions) | Out of opening / until authorised |
| ----------------------------------------------------- | --------------------------------- |
| DLA audit and prompt rationalisation | Implementing generation changes during T-001 |
| EP → DLA / DLA → GAM contract clarity | Adding a new workflow step by default |
| Task-material sufficiency investigation | Schema redesign without evidence |
| Evidence / provenance / material semantic clarification | Settings implementation (PB-FA-005) |
| Controlled evidence-machinery rollback **experiment** (if justified) | Performing that rollback during pack opening |
| Repeated Roman Roads / Lagrangian re-benchmarks | Benchmark gaming |
| Deterministic closure validation if justified | Learner-renderer architecture redesign |
| | Run-capture persistence reopen (`S75-D21`) |

Default position: **no new workflow step** unless evidence shows an existing stage cannot cleanly own a missing responsibility.

---

## Initial order (summary)

1. **Audit** — S76-T-010 DLA audit (diagnostic).  
2. **Rationalise / fix DLA** — from audit evidence.  
3. **Roman Roads control runs** — repeated generation + benchmark.  
4. **Lagrangian challenge runs** — repeated generation + benchmark.  
5. **Decision gate** — only then choose remaining mechanisms.  
6. **Before close** — document durable prompt-engineering discipline (exit condition; [S76-D03](decisions.md#s76-d03--durable-prompt-engineering-discipline-as-sprint-76-exit-condition)).

Detail: [PLAN.md](PLAN.md).

---

## Inherited constraints

- [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md)  
- [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)  
- Sprint 75 Run persistence **SETTLED** (`S75-D21`) — do not casually reopen  
