# Sprint 38-S — Implementation charter (Episode Plan V1 Implementation)

**Date:** 2026-06-06  
**Status:** **CHARTERED** — **38S-2 START HERE**  
**Predecessor:** [Sprint 38-R](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/) (**CLOSED** — [38R-6](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-6-sprint-closure.md) · **SUCCESS**)

---

## Programme framing

```text
38Q discovered the missing planning abstraction.
38R proved the smallest viable form of that abstraction.
38S implements that abstraction and executes the proof framework.
```

| Sprint | Role |
|--------|------|
| **38Q** | Educational abstraction investigation — **CLOSED** |
| **38R** | Episode Plan design proof — **CLOSED** |
| **38S** | Episode Plan V1 **implementation + proof** — **CHARTERED** |

**38S is not asking** whether Episode Plan is needed or how small it can be. **38Q and 38R answered that.**

**38S asks:** Can V1 be **implemented** in the Prism pipeline such that G3/G5 reduce and `fullOk` holds?

---

## Authoritative predecessor

[38R-6 sprint closure](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-6-sprint-closure.md) — **Proceed with constraints**.

---

## Frozen architecture

```text
LO → Episode Plan V1 → DLA → GAM → Page
```

### Episode Plan V1 (frozen — no expansion)

```yaml
episode_plan:
  archetype: <archetype>          # understand | apply | analyse | evaluate
  beats:
    - function: <FunctionEnum>    # strictly ordered; order is authoritative
```

**Rule:** Beat order is pedagogically authoritative.

**Explicitly excluded from plan schema:**

- Transition graph / `transitions[]`  
- Learner-state engine / state objects  
- Branching / orchestration framework  
- Material types / obligations in plan  
- V2 fields  

Any proposed V1 schema change requires a **future design sprint** — not resolution within 38S.

---

## Background

### 38R outcomes (binding)

| Finding | Source |
|---------|--------|
| V1 expresses T1–T5 and A1–A4 | [38R-2](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-2-archetype-fit-test.md) |
| DLA mapping viable — limited obligation metadata | [38R-3](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-3-plan-to-dla-mapping.md) Mostly (B) |
| Proof framework ready | [38R-4](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-4-proof-validation-design.md) |
| Risks are population behaviour, not plan structure | [38R-3 R-01](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-3-plan-to-dla-mapping.md) |
| Runtime G3/G5 reduction **unproven** until proof gate passes | [38R-6](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-6-sprint-closure.md) |

### Fidelity programme (closed — do not reopen)

| Sprint | Outcome |
|--------|---------|
| **38M–38P** | `proofOk: true`, `roleOk: true`, `fullOk: true` on EV-38P-AFTER |

38S may **consume** the 38M–38P replay harness. It must **not** redesign compose, render, role registry, or validators without new discovery evidence.

### Baseline artefacts

| Artefact | Role |
|----------|------|
| **EV-38M-AFTER** | Before — parallel bundles; G3/G5 at `fullOk` |
| **EV-38P-AFTER** | Regression floor — `fullOk: true`, 58/58 |
| **EV-38S-AFTER** (target) | Plan-driven proof run — to be produced in 38S-4 |

---

## Mission

Implement Episode Plan V1 in the Prism pipeline and execute the [38R-4](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-4-proof-validation-design.md) proof framework to demonstrate:

1. **G3 reduction** — missing transitions addressed  
2. **G5 reduction** — episode-structure gaps addressed  
3. **`fullOk` preservation** — 38M–38P path intact  
4. **Mapping contract** — P1–P10 and AC-01–AC-10 enforced at population  

**Do not redesign V1.** **Do not reopen abstraction design.**

---

## Core implementation objectives

| # | Objective | Authority |
|---|-----------|-----------|
| 1 | Introduce Episode Plan V1 between LO and DLA | [38R-6 Task 6](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-6-sprint-closure.md) |
| 2 | Plan-before-populate gate (M-13) | [38Q-5](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| 3 | `instructional_function` obligation tagging | [38R-3](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-3-plan-to-dla-mapping.md) |
| 4 | Preserve P1–P10 | [38R-3](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-3-plan-to-dla-mapping.md) |
| 5 | Preserve AC-01–AC-10 | [38R-3](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-3-plan-to-dla-mapping.md) |
| 6 | Execute 38R-4 proof framework | [38R-4](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-4-proof-validation-design.md) |
| 7 | Preserve `fullOk` and 58/58 | [38R-4 Task 5](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-4-proof-validation-design.md) · IC-1 |

---

## Scope

### In scope

| Area | Phase |
|------|-------|
| Pipeline insertion LO → Plan → DLA | 38S-1 |
| Plan generation / persistence / downstream pass-through | 38S-1 |
| Plan-before-populate gate | 38S-2 |
| Beat → obligation population; order preservation | 38S-2 |
| `instructional_function` tagging on DLA obligations | 38S-3 |
| AC rule enforcement and collapse detection | 38S-3 |
| Proof execution A1–A4 + T3-MICRO | 38S-4 |
| Claims A–E, M-01–M-08, PF catalogue | 38S-4 |
| Evaluation vs G3/G5/`fullOk` | 38S-5 |
| Sprint closure and production readiness | 38S-6 |

### Out of scope

| Item | Notes |
|------|-------|
| V1 schema expansion | Future design sprint only |
| Learner-state engine | Rejected in 38R |
| Transition graph / branching / orchestration | Rejected in 38R |
| Session-level progression / cross-episode fade | [38R-6 Task 7](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-6-sprint-closure.md) — future enhancement |
| 38M–38P machinery reopen | Fidelity closed |
| Prompt-accretion as primary choreography | [38Q-5 M-7](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| Abstraction relitigation | 38Q/38R authoritative |

---

## Success criteria (sprint completion at 38S-6)

| ID | Criterion |
|----|-----------|
| **SC-1** | Episode Plan V1 integrated |
| **SC-2** | Plan-before-populate gate implemented |
| **SC-3** | `instructional_function` tagging implemented |
| **SC-4** | P1–P10 enforced |
| **SC-5** | AC-01–AC-10 enforced |
| **SC-6** | Claims A–E evaluated |
| **SC-7** | `fullOk` remains true |
| **SC-8** | 58/58 suite preserved |
| **SC-9** | Implementation recommendation produced |

### Proof exit gate (from 38R-4 — binding)

All [38R-4 Proceed criteria](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-4-proof-validation-design.md) must pass before production rollout recommendation in 38S-5/38S-6.

Key thresholds:

- M-01 ≥ 80% · M-02 ≥ 95% · M-03 = 100% · M-05 = 0  
- T1 Pass on A2 · T2 Pass on A4 · T3 Pass on T3-MICRO  
- `fullOk: true` · 58/58 · RF-1..RF-8  

---

## Hard constraints (IC-1–IC-12 inherited)

From [38R-5](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-5-implementation-recommendation.md):

| ID | Constraint |
|----|------------|
| **IC-1** | `fullOk: true` on plan-driven proof run |
| **IC-2** | Preserve 38M–38P path |
| **IC-3** | Preserve V1 minimality |
| **IC-4** | No prompt-accretion primary strategy |
| **IC-5** | 58/58 regression suite preserved |
| **IC-6** | Plan is planning authority |
| **IC-7** | Separate planning from realisation |
| **IC-8** | 38I target states remain acceptance authority |
| **IC-9** | Proof exit before production rollout |
| **IC-10** | Anti-collapse rules enforced |
| **IC-11** | Inference contracts for Evaluate (content layer) |
| **IC-12** | Activity demoted, not deleted |

---

## Migration principles (inherited from 38Q-5 M-1–M-13)

Binding on all 38S work. See [38Q-5 Task 7](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md).

---

## Phase plan

### 38S-1 — Episode Plan V1 integration

| Field | Content |
|-------|---------|
| **Purpose** | Insert Episode Plan V1 into planning pipeline between LO and DLA |
| **Deliverable** | [observations/38S-1-episode-plan-v1-integration.md](observations/38S-1-episode-plan-v1-integration.md) |
| **Depends on** | 38R-6 closure |
| **Status** | **COMPLETE** |

**Questions:**

- Where is the minimal insertion point?  
- How is LO → Episode Plan derived?  
- How is V1 stored and passed downstream?  

---

### 38S-2 — Population contract implementation

| Field | Content |
|-------|---------|
| **Purpose** | Implement plan-before-populate; beat → obligation conversion; P1–P10 |
| **Deliverable** | [observations/38S-2-population-contract-implementation.md](observations/38S-2-population-contract-implementation.md) |
| **Depends on** | 38S-1 |
| **Status** | **NEXT** |

**Questions:**

- How are beats converted into obligations?  
- How is beat order preserved?  
- How are P1–P10 enforced?  

---

### 38S-3 — DLA obligation tagging

| Field | Content |
|-------|---------|
| **Purpose** | `instructional_function` tagging; AC-01–AC-10; collapse detection |
| **Deliverable** | [observations/38S-3-dla-obligation-tagging.md](observations/38S-3-dla-obligation-tagging.md) |
| **Depends on** | 38S-2 |
| **Status** | Not started |

**Questions:**

- How is beat identity preserved?  
- How are AC-01–AC-10 enforced?  
- How is collapse detected?  

---

### 38S-4 — Proof execution

| Field | Content |
|-------|---------|
| **Purpose** | Execute 38R-4 framework on A1–A4 + T3-MICRO |
| **Deliverable** | [observations/38S-4-proof-execution.md](observations/38S-4-proof-execution.md) |
| **Depends on** | 38S-3 |
| **Status** | Not started |

**Required proof set:** A1, A2, A3, A4, T3-MICRO · M-01–M-08 · Claims A–E · PF catalogue

---

### 38S-5 — Evaluation and recommendation

| Field | Content |
|-------|---------|
| **Purpose** | Assess G3/G5 reduction and `fullOk`; recommend production readiness |
| **Deliverable** | [observations/38S-5-evaluation-and-recommendation.md](observations/38S-5-evaluation-and-recommendation.md) |
| **Depends on** | 38S-4 |
| **Status** | Not started |

---

### 38S-6 — Sprint closure

| Field | Content |
|-------|---------|
| **Purpose** | Close sprint; production readiness; next sprint recommendation |
| **Deliverable** | [observations/38S-6-sprint-closure.md](observations/38S-6-sprint-closure.md) |
| **Depends on** | 38S-5 |
| **Status** | Not started |

**Dependency chain:**

```text
38S-1 Integration → 38S-2 Population → 38S-3 Tagging
  → 38S-4 Proof → 38S-5 Evaluation → 38S-6 Closure
```

---

## Implementation permissions

| Phase | Code | Notes |
|-------|------|-------|
| **38S-1** through **38S-3** | **Expected** | Pipeline integration; population; tagging |
| **38S-4** | **Expected** | Proof harness / replay; evidence artefacts |
| **38S-5** through **38S-6** | Docs + evidence | Evaluation and closure |

Pack documentation updates permitted throughout. **No V1 schema changes** without charter hold review.

---

## Reference models (read-only)

| Model | Location |
|-------|----------|
| V1 schema | [38R-1](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-1-minimum-viable-episode-plan.md) |
| A1–A4 plans | [38R-2](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-2-archetype-fit-test.md) |
| Mapping P1–P10, AC-01–AC-10 | [38R-3](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-3-plan-to-dla-mapping.md) |
| Proof framework | [38R-4](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-4-proof-validation-design.md) |
| T3-MICRO plan | [38R-4 Task 3](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-4-proof-validation-design.md) |
| FunctionEnum | [38Q-2 §6](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-2-episode-taxonomy-catalogue.md) |
| Gap register | [38Q-3](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md) |
| 38I acceptance | [38I-4](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) |

---

## Programme lineage

```text
38I Episode model → 38M–38P Fidelity → 38Q Abstraction → 38R Design proof → 38S Implementation
```

---

## Risks

| Risk | Mitigation |
|------|------------|
| Population collapses beats (R-01) | AC rules; M-01–M-03 metrics; 38S-3 detection |
| `fullOk` regression | EV-38P replay; IC-1; preservation control on shared code |
| Decorative plan (PF-11) | M-13 gate; plan must precede DLA |
| Schema creep during implementation | IC-3; charter hold; V1 frozen |
| Prompt accretion substitute | IC-4; SC-7 lineage from 38R |
| GAM substitution (G4) | AC-01–AC-10 at realisation layer |

---

## Must exist / must not exist (from 38R-5)

### Must exist

- Episode Plan V1 object (`archetype` + ordered `beats[].function`)  
- Plan-before-populate gate  
- Ordered obligation population with `instructional_function` tags  
- P1–P10 / AC-01–AC-10 enforcement  
- 38R-4 proof gate execution before rollout recommendation  

### Must not exist

- Learner-state engine  
- Transition graph engine  
- Orchestration / branching framework  
- Prompt choreography layer as primary mechanism  
- DLA activity object redesign  
- Decorative post-hoc plan  

See [38R-5 Task 6](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-5-implementation-recommendation.md) for full lists.
