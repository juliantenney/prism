# 38R-6 — Sprint closure (Instructional Episode Plan Design Proof)

**Date:** 2026-06-06  
**Status:** **CLOSED — SUCCESS**  
**Type:** Sprint closure — documentation only; no new design; no implementation  
**Authority:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)  
**Recommendation:** [38R-5-implementation-recommendation.md](38R-5-implementation-recommendation.md) — **Proceed with constraints**

---

## Executive verdict

Sprint **38-R** is **CLOSED — SUCCESS**.

The sprint completed a **design-proof programme** across six phases (38R-1 through 38R-6). It determined that the Instructional Episode Plan recommended by [38Q-5](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) can remain **extremely minimal** — two fields plus ordered function beats — while expressing all five transition families (T1–T5) and all four target archetypes (A1–A4). The plan maps to DLA without stack replacement. Remaining risk is **population behaviour**, not plan structure.

All charter success criteria **SC-1 through SC-8** pass. No production code changed. No 38M–38P fidelity claims were weakened.

**Implementation recommendation:** **Proceed with constraints** ([38R-5](38R-5-implementation-recommendation.md)). Runtime G3/G5 reduction is **unproven** until the [38R-4 proof gate](38R-4-proof-validation-design.md) passes in a follow-on implementation sprint.

---

## Task 1 — Opening question answered

### Question at sprint start

> **What is the smallest Instructional Episode Plan capable of expressing the missing teaching transitions identified in 38Q?**

### Answer

**Episode Plan V1:**

```yaml
episode_plan:
  archetype: <archetype>
  beats:
    - function: <FunctionEnum>
```

**Rule:** Beat order is pedagogically authoritative. No other plan fields.

This object is **sufficient** to express T1–T5 and A1–A4 target episodes. No additional primitives were justified by adversarial testing.

### Expected vs observed complexity

| Dimension | Expected at sprint start | Observed at sprint end |
|-----------|-------------------------|------------------------|
| **Plan schema size** | Unknown — might require transitions, learner-state, scaffolding metadata | **Two top-level keys** — `archetype` + `beats[].function` |
| **Transition representation** | Possibly explicit `transitions[]` graph ([38Q-5 M-5](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md)) | **Implicit** — strict beat order encodes all T1–T5 linear chains ([38R-1](38R-1-minimum-viable-episode-plan.md)) |
| **Learner-state objects** | Possible given 38Q prose ("learner-state progression") | **Rejected** — progression implied by function sequence ([38R-1](38R-1-minimum-viable-episode-plan.md), [38R-2](38R-2-archetype-fit-test.md)) |
| **Branching / orchestration** | Unknown for Evaluate capstone | **Rejected** — A4 linear plan Strong without branches ([38R-2](38R-2-archetype-fit-test.md)) |
| **Material obligations in plan** | Risk of plan-as-material-list | **Rejected** — materials are DLA derivation ([38R-3](38R-3-plan-to-dla-mapping.md)) |
| **DLA stack change** | Uncertain whether plan forces DLA redesign | **Not required** — activity row + obligation metadata sufficient ([38R-3 Mostly B](38R-3-plan-to-dla-mapping.md)) |
| **Schema versions** | V0 → V1 → possible V2 under adversarial test | **V1 frozen** — no V2 ([38R-2](38R-2-archetype-fit-test.md)) |
| **Archetype fit** | Might fail on A4 Evaluate | **Strong** all four ([38R-2](38R-2-archetype-fit-test.md)) |
| **Proof of improvement** | Might be provable in design sprint | **Deferred** — proof **framework** defined; runtime proof is implementation exit gate ([38R-4](38R-4-proof-validation-design.md)) |

**Net difference:** Complexity landed **far below** what 38Q prose and charter starting assumptions suggested. The burden shifted from **abstraction discovery** to **implementation enforcement**.

---

## Task 2 — Major discoveries

## Major discoveries

### Discovery 1 — The abstraction remained minimal

| Evidence | Finding |
|----------|---------|
| [38R-1](38R-1-minimum-viable-episode-plan.md) primitive elimination | V1 = `archetype` + ordered `function` only |
| [38R-2](38R-2-archetype-fit-test.md) adversarial mandate | No schema change forced; **Strong** all A1–A4 |
| Charter V0 starting point | `transitions[]`, learner-state, scaffolding all **eliminated** |

**Implication:** Episode Plan is not a growing specification object. Implementation should resist schema accretion.

---

### Discovery 2 — Ordered functions are sufficient

| Evidence | Finding |
|----------|---------|
| [38R-1](38R-1-minimum-viable-episode-plan.md) T1–T5 expressibility | All five families pass with function + order |
| [38R-2](38R-2-archetype-fit-test.md) frozen A1–A4 YAML | 12/12/13/15 beats; all **R** functions present |
| [38Q-2 §7.3](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-2-episode-taxonomy-catalogue.md) | Transition-dominant teaching is **edge-weighted** — encoded by ordered distinct functions |

**Implication:** Choreography is a **sequence of function identities**, not a separate transition algebra.

---

### Discovery 3 — Explicit transitions are unnecessary

| Evidence | Finding |
|----------|---------|
| [38R-1](38R-1-minimum-viable-episode-plan.md) V0 test | `transitions[]` redundant when beats carry `function` and strict order |
| [38R-2](38R-2-archetype-fit-test.md) T4 in A4 | Non-contiguous subsequence valid — adjacency not required for proof |
| [38R-4](38R-4-proof-validation-design.md) T-audit | Subsequence presence + order, not edge objects |

**Implication:** M-5 "transitions first-class" from 38Q is satisfied by **ordered function beats**, not a transition graph engine.

---

### Discovery 4 — DLA remains viable

| Evidence | Finding |
|----------|---------|
| [38R-3](38R-3-plan-to-dla-mapping.md) Task 5–6 | DLA hosts ordered obligations; all A1–A4 mapping **Strong** |
| [38R-3](38R-3-plan-to-dla-mapping.md) verdict | **Mostly (B)** — limited `instructional_function` tag + plan gate; no activity redesign |
| [38Q-5 M-1, M-2](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) | 38M–38P path preserved (P10) |

**Implication:** Option F Hybrid is **compatible** with frozen fidelity machinery. Implementation inserts planning upstream, not replaces realisation downstream.

---

### Discovery 5 — Risks are behavioural, not structural

| Evidence | Finding |
|----------|---------|
| EV-38M-AFTER | Parallel bundles at `fullOk` — collapse is **population**, not DLA array shape |
| [38R-3](38R-3-plan-to-dla-mapping.md) AC-01–AC-10 | Anti-collapse rules codified |
| [38R-4](38R-4-proof-validation-design.md) PF-01–PF-14 | Failure catalogue + objective metrics M-01–M-08 |
| [38R-3](38R-3-plan-to-dla-mapping.md) R-01 | Highest risk: beats merged despite plan |

**Implication:** Implementation success depends on **enforcing** the mapping contract, not **expanding** the plan.

---

## Task 3 — Success criteria review

| SC | Criterion | Status | Evidence |
|----|-----------|--------|----------|
| **SC-1** | Minimum viable Episode Plan schema defined | **PASS** | [38R-1](38R-1-minimum-viable-episode-plan.md) — V1 frozen |
| **SC-2** | Schema expresses all five transition families | **PASS** | [38R-1](38R-1-minimum-viable-episode-plan.md); [38R-2](38R-2-archetype-fit-test.md); T3-MICRO in [38R-4](38R-4-proof-validation-design.md) |
| **SC-3** | Schema expresses A1–A4 target episode structures | **PASS** | [38R-2](38R-2-archetype-fit-test.md) — all **Strong** |
| **SC-4** | Plan-to-DLA mapping specified at design level | **PASS** | [38R-3](38R-3-plan-to-dla-mapping.md) — P1–P10, OBL-M/C/T |
| **SC-5** | Fidelity preservation strategy documented | **PASS** | [38R-3 P10](38R-3-plan-to-dla-mapping.md); [38R-4 Task 5](38R-4-proof-validation-design.md) |
| **SC-6** | G3/G5 reduction proof approach defined | **PASS** | [38R-4](38R-4-proof-validation-design.md) — Claims A–E, M-01–M-08 |
| **SC-7** | Prompt accretion explicitly avoided as primary mechanism | **PASS** | [38R-1](38R-1-minimum-viable-episode-plan.md); [38R-4 Claim E](38R-4-proof-validation-design.md); [38R-5 IC-4](38R-5-implementation-recommendation.md) |
| **SC-8** | Recommendation made for implementation, refinement, or rejection | **PASS** | [38R-5](38R-5-implementation-recommendation.md) — **Proceed with constraints** |

**Final sprint status:** **SC-1 through SC-8 — ALL PASS.** Sprint **CLOSED — SUCCESS**.

---

## Task 4 — Rejected assumptions

## Rejected assumptions

Assumptions **tested** during 38R and **not supported** by evidence:

| Assumption | Test | Verdict | Evidence |
|------------|------|---------|----------|
| Episode Plan requires **transition graph** (`transitions[]`) | [38R-1](38R-1-minimum-viable-episode-plan.md) V0 elimination | **Rejected** | Order + function encodes T1–T5 |
| Episode Plan requires **learner-state engine** | [38R-1](38R-1-minimum-viable-episode-plan.md), [38R-2](38R-2-archetype-fit-test.md) | **Rejected** | State change implied by function progression |
| Episode Plan requires **branching** | [38R-2](38R-2-archetype-fit-test.md) A4 adversarial | **Rejected** | Linear 15-beat plan Strong |
| Episode Plan requires **orchestration framework** | [38R-2](38R-2-archetype-fit-test.md) loops/branches table | **Rejected** | Single-pass linear beats sufficient |
| Episode Plan requires **prompt choreography** as primary mechanism | [38R-1](38R-1-minimum-viable-episode-plan.md), [38R-5](38R-5-implementation-recommendation.md) minimality attack | **Rejected** | [38Q-4](38Q-4-episode-generation-design-options.md) Weak on G3/G5 |
| Episode Plan requires **DLA replacement** | [38R-3](38R-3-plan-to-dla-mapping.md) | **Rejected** | DLA remains realisation container |
| Episode Plan requires **material types in plan** | [38R-1](38R-1-minimum-viable-episode-plan.md) | **Rejected** | Recreates G5 bundle planner |
| Episode Plan requires **scaffolding metadata** | [38R-2](38R-2-archetype-fit-test.md) T1 via function triple | **Rejected** | Fade = worked → guided → independent |
| Episode Plan requires **V2 schema** for A1–A4 | [38R-2](38R-2-archetype-fit-test.md) adversarial fit | **Rejected** | V1 unchanged |
| **Smaller plan** (remove archetype or function) | [38R-5](38R-5-implementation-recommendation.md) Task 4 | **Rejected** | Breaks expressibility or validation |
| **No Episode Plan** — DLA extension alone | [38R-5](38R-5-implementation-recommendation.md) Task 4 | **Rejected** | Tags without plan gate are decorative |

---

## Task 5 — Final architecture statement

### Recommended architecture (programme record)

```text
LO
  ↓
Episode Plan V1
  ↓
DLA
  ↓
GAM
  ↓
Page
```

### Episode Plan V1 (precise definition)

**Episode Plan V1** =

```yaml
episode_plan:
  archetype: <archetype>          # understand | apply | analyse | evaluate
  beats:
    - function: <FunctionEnum>    # strictly ordered; order is authoritative
```

**Nothing more** at plan schema level.

**Derived rules (not schema fields):**

- Beat order is pedagogically authoritative  
- FunctionEnum from [38Q-2 §6](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-2-episode-taxonomy-catalogue.md)  
- Plan binds to LO extrinsically (pipeline attachment)

**Implementation layer (not plan schema):**

- `instructional_function` per DLA obligation ([38R-3](38R-3-plan-to-dla-mapping.md))  
- Plan-before-populate gate ([38Q-5 M-13](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md))

### Recommendation (unchanged from 38R-5)

**Proceed with constraints** — implement V1; do not expand plan schema without new design sprint.

---

## Task 6 — Implementation sprint charter inputs

## Recommended implementation objectives

Objectives only — **not** implementation design.

1. **Introduce Episode Plan V1** — persist/generate `archetype` + ordered `beats[].function` between LO and DLA population  
2. **Add plan-before-populate gate** — no `required_materials[]` without completed plan beat ([38Q-5 M-13](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md))  
3. **Add `instructional_function` obligation tagging** — per [38R-3](38R-3-plan-to-dla-mapping.md) limited DLA extension  
4. **Preserve mapping contract** — P1–P10 and AC-01–AC-10 at population  
5. **Run [38R-4](38R-4-proof-validation-design.md) proof framework** — Claims A–E, M-01–M-08, A1–A4 + T3-MICRO, `EV-38R-AFTER` class replay  
6. **Preserve `fullOk` and 58/58 suite** — IC-1, IC-2, IC-5; no 38M–38P reopen  
7. **Generalise order propagation** — plan indices → DLA → page render order ([38R-3](38R-3-plan-to-dla-mapping.md) R-05)  
8. **Seed from A1–A4 reference plans** — [38R-2](38R-2-archetype-fit-test.md) frozen YAML as templates or validation authority  
9. **Enforce anti-decorative-plan** — plan must precede DLA; PF-11 hold ([38R-4](38R-4-proof-validation-design.md))  
10. **Exit on Proceed criteria** — [38R-4 Task 8](38R-4-proof-validation-design.md) before production rollout  

**Binding constraints:** IC-1–IC-12 from [38R-5](38R-5-implementation-recommendation.md).

---

## Task 7 — Out of scope

| Concern | Classification | Rationale |
|---------|:--------------:|-----------|
| **Session-level progression** (A1→A4 independence rise) | **Future enhancement** | [38R-2](38R-2-archetype-fit-test.md): multi-episode session plan; not single-episode V1 failure |
| **Cross-episode fade** | **Future enhancement** | T1 fade is within-episode; workbook arc needs session contract ([38Q-3 GAP-17](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) |
| **Curriculum sequencing** | **Future enhancement** | Above session; no 38R evidence tested |
| **Learner-state persistence** | **Proven unnecessary** (for V1) | [38R-1](38R-1-minimum-viable-episode-plan.md), [38R-2](38R-2-archetype-fit-test.md) — no state engine required |
| **Branching pathways** | **Proven unnecessary** (for A1–A4) | [38R-2](38R-2-archetype-fit-test.md) linear plans Strong |
| **Transition graph engine** | **Proven unnecessary** | [38R-1](38R-1-minimum-viable-episode-plan.md) |
| **Loop/retry orchestration** | **Future enhancement** | A2 `revision` beat is linear single-pass; full verify-fail-retry loop not in V1 |
| **G2 weak realisation depth** | **Unknown at plan layer** | GAM quality; plan orders function — proof may pass structurally with weak bodies |
| **Inference contracts (M-11)** | **Future enhancement** (adjacent) | Content for Evaluate functions; plan orders beats only |

**None of the above block V1 implementation.**

---

## Task 8 — Programme significance

## Why 38R matters

### What changed between 38Q and 38R?

| 38Q | 38R |
|-----|-----|
| Discovered **that** episode planning is required | Proved **how small** it can be |
| Recommended Option F Hybrid architecture | Confirmed DLA/GAM/Page retained; specified mapping |
| Described plan in prose (functions + transitions + learner-state) | Froze **V1** — archetype + ordered functions only |
| Identified G3/G5 as dominant gaps | Defined **objective proof** for G3/G5 reduction |
| Deferred schema to 38R | Delivered schema; **no V2** |

### Why this matters for implementation risk

1. **Scope is bounded** — implement two fields + enforcement, not an orchestration platform  
2. **Fidelity path is closed** — implementation cannot blame compose/render; proof is upstream population  
3. **Failure modes are named** — PF catalogue and metrics detect collapse early  
4. **Schema creep has a gate** — burden of proof on any V1 expansion  
5. **38Q recommendation is strengthened, not reopened** — no architectural relitigation required  

**Before 38R:** Episode Plan was an architectural recommendation with unknown size and mapping cost.

**After 38R:** Episode Plan V1 is a **proven, minimal, mappable** planning object with a defined proof exit gate.

---

## Task 9 — Closure statement

### Before 38R

Episode Plan was an **architectural recommendation** from 38Q — necessary in principle, unknown in minimal form, untested against A1–A4 adversarially, unmapped to DLA, without objective proof criteria.

### After 38R

**Episode Plan V1** is a **proven, minimal, mappable** planning object:

- Expresses T1–T5 and A1–A4  
- Maps to DLA without stack replacement  
- Preserves 38M–38P fidelity path by design  
- Has objective proof framework for implementation exit  

**The remaining challenge is implementation proof, not abstraction discovery.**

### Governing answer (for programme records)

> **What is the smallest Instructional Episode Plan capable of expressing the missing teaching transitions identified in 38Q?**

**Episode Plan V1** — `archetype` plus strictly ordered instructional `function` beats. Nothing more at schema level.

### What did 38R prove?

| Proven | Unproven |
|--------|----------|
| V1 expresses T1–T5 and A1–A4 | Runtime G3/G5 reduction on generated output |
| V1 maps to DLA (design level) | Population contract holds under real generation |
| DLA/GAM/Page remain viable | `fullOk` on plan-driven workbook replay |
| Risks are behavioural (collapse, substitution) | GAM realisation quality (G2 depth) |
| Proof framework is ready | Session-level workbook arc |

### What should the implementation sprint build?

Insert **Episode Plan V1** between LO and DLA with **plan-before-populate gate**, **obligation function tagging**, and **mapping contract enforcement** — then pass the [38R-4](38R-4-proof-validation-design.md) proof gate. See Task 6 objectives and [38R-5 Must exist](38R-5-implementation-recommendation.md).

---

## Task 10 — Handoff package

## Inputs to implementation sprint

| Input | Location |
|-------|----------|
| **Frozen V1 schema** | [38R-1](38R-1-minimum-viable-episode-plan.md) |
| **FunctionEnum authority** | [38Q-2 §6](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-2-episode-taxonomy-catalogue.md) |
| **A1–A4 reference plans** | [38R-2 Task 1](38R-2-archetype-fit-test.md) — frozen YAML |
| **Mapping contract** | [38R-3](38R-3-plan-to-dla-mapping.md) — P1–P10, AC-01–AC-10, OBL-M/C/T, function→obligation table |
| **Proof framework** | [38R-4](38R-4-proof-validation-design.md) — Claims A–E, M-01–M-08, T-audits, PF catalogue, Proceed/Hold |
| **T3-MICRO plan** | [38R-4 Task 3](38R-4-proof-validation-design.md) |
| **Implementation recommendation** | [38R-5](38R-5-implementation-recommendation.md) — Proceed with constraints; IC-1–IC-12; Must exist / Must not exist |
| **Regression suite** | 58/58 floor; EV-38P-AFTER harness — [38P-6](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6-proof-run.md) |
| **Baseline (before)** | `EV-38M-AFTER-dla-learning-activities.json` — parallel bundles |
| **Fidelity floor** | `EV-38P-AFTER-*` — `fullOk: true` |
| **38Q migration principles** | [38Q-5 M-1–M-13](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| **38I acceptance authority** | [38I-4 mock-ups](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) |

### Recommended successor sprint

**[Sprint 38-S — Episode Plan V1 Implementation](../../2026-06-06-sprint-38s-episode-plan-v1-implementation/)** — **CHARTERED**. Start [38S-1](../../2026-06-06-sprint-38s-episode-plan-v1-implementation/observations/38S-1-episode-plan-v1-integration.md).

---

## Phase deliverable index

| Phase | Deliverable | Status |
|-------|-------------|--------|
| **38R-1** | [38R-1-minimum-viable-episode-plan.md](38R-1-minimum-viable-episode-plan.md) | COMPLETE |
| **38R-2** | [38R-2-archetype-fit-test.md](38R-2-archetype-fit-test.md) | COMPLETE |
| **38R-3** | [38R-3-plan-to-dla-mapping.md](38R-3-plan-to-dla-mapping.md) | COMPLETE |
| **38R-4** | [38R-4-proof-validation-design.md](38R-4-proof-validation-design.md) | COMPLETE |
| **38R-5** | [38R-5-implementation-recommendation.md](38R-5-implementation-recommendation.md) | COMPLETE |
| **38R-6** | This document | COMPLETE |

---

## Status

| Field | Value |
|-------|-------|
| Sprint | 38-R |
| Status | **CLOSED — SUCCESS** |
| Phases | 38R-1 through 38R-6 **COMPLETE** |
| Recommendation | **Proceed with constraints** |
| V1 schema | **Frozen** |
| Successor | [Sprint 38-S](../../2026-06-06-sprint-38s-episode-plan-v1-implementation/) — **CHARTERED** |
