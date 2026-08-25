# Sprint 78 — Charter

**Sprint:** 78 — Learner Resource Quality Recovery  
**Status:** **CLOSED** (opened 2026-08-17 · closed 2026-08-25)  
**Opened:** 2026-08-17  
**Closed:** 2026-08-25  
**Predecessor:** Sprint 77 — COMPLETE / Closed (2026-08-14) — DLA architecture pilot gated; do not reopen  
**Type:** Instructional-relationship repair via diagnosis-first quality recovery  
**Start here:** [SPRINT-78-START-HERE.md](SPRINT-78-START-HERE.md)  
**Closure:** [S78-T-056](S78-T-056-sprint-78-closure.md) · [S78-D05](decisions.md#s78-d05--close-sprint-78)  
**Opening decision:** [S78-D01](decisions.md#s78-d01--open-sprint-78--learner-resource-quality-recovery)  
**Predecessor close-out:** [S77-T-027](../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/S77-T-027-sprint-77-closeout.md)  
**QA baseline:** [POST-S77-lagrangian-qa-baseline-2026-08-14.md](../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/POST-S77-lagrangian-qa-baseline-2026-08-14.md)

---

## Mission

Restore generated **learner-resource quality** by repairing the instructional relationships exposed by the post–Sprint 77 Lagrangian QA baseline — not by hand-tuning one Lagrangian artefact.

Target relationship:

```text
MODEL → ATTEMPT → CHECK → REVISE / TRANSFER
```

The objective is for **architectural / contract improvements** to produce better resources on **regeneration**, not one-off editorial fixes to the benchmark package.

---

## Why this sprint exists

Sprint 77 completed the DLA prompt-contract architecture pilot and closed pipeline blockers (E1, Case 1, canonical DLA live, assembly/render/package achievable).

A fresh post-S77 **Lagrangian Multipliers** end-to-end run reached a complete learner package and independent QA. That result is **below expected quality for a deliberately favourable benchmark topic**:

| Measure | Baseline (2026-08-14) |
| ------- | --------------------- |
| Uncapped weighted score | **70/100 — Competent** |
| Release score | **69/100 — Adequate** |
| Confidence | High |
| Inspection | Complete package |
| Critical defects | **0** |
| Major defects | **2** |
| Recommendation | Revision recommended |
| Feedback & Self-Regulation | **30/100** |

This sprint addresses **instructional relationships** surfaced by that QA — not “fix the Lagrangian resource” as a bespoke editing task.

---

## Primary benchmark

**Lagrangian Multipliers** remains the primary regression / quality benchmark because it is deliberately favourable:

- stable disciplinary content;
- readily generatable worked and practice problems;
- no material copyright dependency;
- no requirement for evidence-heavy source work;
- clear procedural and conceptual learning progression.

### Sprint exit benchmark (this favourable test case)

Fresh end-to-end Lagrangian generation:

```text
EP → DLA → GAM → downstream design/graphics as applicable → assembly → learner package → independent QA
```

| Gate | Target |
| ---- | ------ |
| QA uncapped score | **≥ 90/100** |
| Critical production defects | **0** |
| Major production defects | **0** |

Treat **≥ 90** as the benchmark target for **this** favourable test case, not as a universal hard threshold for every subject. **Do not weaken or tune the QA benchmark** to achieve the target.

---

## Baseline strengths to preserve

QA found useful existing strengths including:

- coherent conceptual progression;
- constructive alignment;
- disciplinary quality;
- accessibility / inclusive design;
- visual synthesis;
- economic interpretation (e.g. shadow prices).

Do **not** solve the quality problem by adding unnecessary content or interface complexity.

---

## Workstreams

| # | Track | Fresh exhibit | First task |
| - | ----- | ------------- | ---------- |
| 1 | **Learner production / workspace fulfilment** | Activity 1: learners told to enter responses into a comparison table; table already completed and non-editable | **S78-T-001** (diagnostic — **complete**; WS1 **CLOSED**) |
| 2 | **Modelling / practice independence** | Activity 3: complete worked solution to the **identical** constrained-optimisation problem immediately before independent practice | **S78-T-002** (diagnostic **complete**; T-013 **CLOSED**) |
| 3 | **Check / revision architecture** | All four activities lack substantive Check/revision; F&S score 30 | **S78-T-003** (**queued**) |

**Moderate / presentation findings (logged, lower priority):** Activity 3 mathematical workspace form; stray blank lines above some response fields; missing horizontal rule between activities; image mismatch/persistence/operator-path where recorded. **Do not elevate** above instructional/reliability workstreams unless a shared architectural cause is proven.

**Activity timing / duration** is in sprint as queued diagnostic **S78-T-019** — do not assume renderer ownership.

---

## Method (binding)

For each quality defect:

1. Preserve the exact fresh learner-facing exhibit.
2. Trace backwards to the earliest proven causal layer.
3. Distinguish commission/design failure from production/rendering failure.
4. Repair the canonical owner, not the symptom.
5. Add protected regression coverage.
6. Regenerate rather than hand-edit the benchmark artefact.
7. Assess the learner-facing result.
8. Use independent QA to measure whether quality actually improved.

Avoid one-off Lagrangian fixes.

---

## Out of sprint / wait states (unless they block the benchmark)

| Item | Disposition |
| ---- | ----------- |
| **GAM E2** intermittent learner-facing / JSON corruption | OPEN / intermittent; **known Sprint 78 recurrence** (T-013 Candidate 2); fail-closed; separate from WS2 and operational suitability; [S77-T-026](../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/S77-T-026-gam-e2-intermittent-corruption-diagnostic.md) protocol; **no sanitiser**; do not reopen Sprint 77 |
| Miscellaneous inherited Sprint 76/77 backlog | Retained; not absorbed unless blocking |
| Prompt-architecture rationalisation beyond what Sprint 78 diagnosis requires | Deferred ([PB-FA-010](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-010--prompt-contract-architecture-method-after-dla-pilot)) |
| Phase D DLA legacy cleanup | Not authorised |
| Evidence-injection rollback | Option only / not executed |
| Settings / RECOVER / unrelated UI backlog | Separate lanes |

Do **not** pull these into Sprint 78 merely because they are open.

---

## Sprint exit

Sprint 78 is **not** complete merely because T-001/T-002/T-003 diagnostics or unit tests pass.

**Final Gate** must include fresh from-top Lagrangian generation and independent QA meeting the exit benchmark above. This must be achieved through **general architectural reliability**, not hand-tuning the Lagrangian resource.

If the target is missed, inspect QA findings — **do not weaken the benchmark**. **Do not close reliability by regenerating until a verifier PASS.**

**Closure result (2026-08-25):** Final Gate **MET** — Lagrangian **94/100**, 0 Critical, 0 Major. See [S78-T-056](S78-T-056-sprint-78-closure.md).

---

## Protected Sprint 77 baseline (do not reopen)

Sprint 77 DLA canonical architecture is **gated and closed**. Do not reopen Sprint 77 to absorb this quality work. Protected contracts (P01–P04, T-031, T-033, E1 closed, Case 1 closed, live `77-DLA-CANONICAL-3`) remain preserved unless a Sprint 78 diagnosis proves a distinct defect with evidence.

---

## Final disposition (2026-08-25)

| Track | Status |
| ----- | ------ |
| WS1 workspace fulfilment | **CLOSED** |
| WS2 model/practice independence | **CLOSED** (T-013 closed) |
| Operational suitability | Temporary verifier retained; retirement = pre-alpha carry-forward ([S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)) |
| WS3 Check/revision | T-022 complete; T-024 satisfied/waived; T-023 NOT OPENED |
| Final Gate | **MET** (Lagrangian **94**) |
| Sprint 78 | **CLOSED** |

**GAM product contract:** intended steady state remains Generate Activity Materials → valid capture → Step complete → Next. **“Regenerate until it passes” is not an acceptable reliability outcome.**

**Exit:** achieved — fresh from-top Lagrangian ≥ **90** uncapped; **0 Critical**; **0 Major**; via general architectural reliability, not Lagrangian hand-tuning.


---

## Inherited constraints

[ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md) · [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)
