# 38R-5 — Implementation recommendation

**Date:** 2026-06-06  
**Status:** **COMPLETE**  
**Type:** Design-proof phase — recommendation only; no code; no implementation  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38R-5  
**Inputs:** [38R-1 V1](38R-1-minimum-viable-episode-plan.md) · [38R-2 A1–A4](38R-2-archetype-fit-test.md) · [38R-3 mapping](38R-3-plan-to-dla-mapping.md) · [38R-4 proof design](38R-4-proof-validation-design.md) · [38Q-5 architecture](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) · [38Q-6 closure](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-6-sprint-closure.md)  
**Successor:** [38R-6 Sprint closure](38R-6-sprint-closure.md)

---

## Executive framing

**Frozen plan (V1):**

```yaml
episode_plan:
  archetype: <archetype>
  beats:
    - function: <FunctionEnum>
```

**Rule:** Beat order is pedagogically authoritative.

**Primary question:**

> Should Prism proceed to implementation of Episode Plan V1?

**Programme arc:**

```text
38Q — Episode planning required (Option F Hybrid)
38R — Smallest viable plan proven at design level
38R-5 — Recommend whether to implement
```

**Critical distinction:** 38R proves **design viability**. It does **not** prove **runtime improvement**. Implementation is justified; success is **not** guaranteed until the [38R-4 proof gate](38R-4-proof-validation-design.md) passes.

---

## Task 1 — Review of 38Q recommendation

**38Q architecture (frozen):**

```text
LO → Instructional Episode Plan → DLA → GAM → Page
```

| Aspect | 38Q position | 38R evidence | Result |
|--------|--------------|--------------|--------|
| **Pipeline shape** | Insert Episode Plan between LO and DLA; retain DLA/GAM/Page | [38R-3](38R-3-plan-to-dla-mapping.md): DLA viable; 38M–38P path unchanged (P10) | **Strengthened** — stack confirmed; no DLA redesign |
| **Primary planning object** | Instructional Episode Plan as planning authority | V1: `archetype` + ordered `function` beats only | **Strengthened and refined** — plan is **smaller** than 38Q prose implied |
| **G3/G5 root cause** | Activity-as-planner; parallel `required_materials[]` | [38R-3](38R-3-plan-to-dla-mapping.md): collapse is population behaviour; plan→obligation fixes structurally | **Strengthened** — mechanism specified (P1–P10, M-13 gate) |
| **Transitions first-class (M-5)** | Explicit transitions scored | [38R-1](38R-1-minimum-viable-episode-plan.md): `transitions[]` **rejected**; order + function encodes T1–T5 | **Refined, not weakened** — transitions are **implicit in beat order**, not separate objects |
| **Learner-state progression** | Named in 38Q-5 plan description | [38R-1](38R-1-minimum-viable-episode-plan.md), [38R-2](38R-2-archetype-fit-test.md): no learner-state objects; progression implied by function sequence | **Refined** — progression is **choreography**, not a state engine |
| **Option F Hybrid** | Recommended over prompt accretion / DLA-only | [38R-1 §Task 5](38R-1-minimum-viable-episode-plan.md): prompt accretion cannot enforce order; [38R-4 Claim E](38R-4-proof-validation-design.md) | **Strengthened** — structural gate required |
| **Anti-substitution (M-6)** | Checklist/table only when function permits | [38R-3 AC-01–AC-10](38R-3-plan-to-dla-mapping.md); [38R-4 M-05](38R-4-proof-validation-design.md) | **Strengthened** — rules codified; proof metric defined |
| **Plan-before-populate (M-13)** | No DLA materials without plan | [38R-3 P9](38R-3-plan-to-dla-mapping.md); [38R-4 Claim B](38R-4-proof-validation-design.md) | **Strengthened** — gate is implementation prerequisite |
| **fullOk floor (M-1)** | Hard constraint | [38R-4 Task 5](38R-4-proof-validation-design.md): regression framework on EV-38P-AFTER path | **Unchanged** — binding on implementation |
| **Archetype templates (M-8)** | A1–A4 canonical sequences | [38R-2](38R-2-archetype-fit-test.md): all four **Strong** on V1 | **Strengthened** — templates frozen as YAML |
| **Inference contracts (M-11)** | Evaluate/high-inference content | [38R-2](38R-2-archetype-fit-test.md): plan orders functions; **content** from KM/LO — not plan failure | **Unchanged scope** — implementation layer, not V1 |
| **Session / cross-episode fade** | GAP-17; session transitions Missing | [38R-2](38R-2-archetype-fit-test.md): session fade **out of single-episode V1 scope** | **Deferred** — not a blocker (see Task 9) |

**Net assessment:** 38R **strengthens** the 38Q recommendation. It **refines** 38Q prose into a **minimal structural object** without changing pipeline direction. Nothing in 38R **weakens** the case for Episode Plan; the only narrowing is **explicit rejection** of primitives 38Q did not mandate but might have implied (transition graph, learner-state engine, branching).

---

## Task 2 — Sprint success criteria review

| SC | Criterion | Status | Evidence |
|----|-----------|--------|----------|
| **SC-1** | Minimum viable Episode Plan schema defined | **Complete** | [38R-1](38R-1-minimum-viable-episode-plan.md) — V1 frozen |
| **SC-2** | Schema expresses all five transition families | **Complete** | [38R-1](38R-1-minimum-viable-episode-plan.md) T1–T5; [38R-2](38R-2-archetype-fit-test.md) subchains in A1–A4; T3-MICRO in [38R-4](38R-4-proof-validation-design.md) |
| **SC-3** | Schema expresses A1–A4 target episode structures | **Complete** | [38R-2](38R-2-archetype-fit-test.md) — all **Strong**; 12/12/13/15 beats |
| **SC-4** | Plan-to-DLA mapping specified at design level | **Complete** | [38R-3](38R-3-plan-to-dla-mapping.md) — P1–P10, OBL-M/C/T, verdict **Mostly (B)** |
| **SC-5** | Fidelity preservation strategy documented | **Complete** | [38R-3 P10](38R-3-plan-to-dla-mapping.md); [38R-4 Task 5](38R-4-proof-validation-design.md) regression framework |
| **SC-6** | G3/G5 reduction proof approach defined | **Complete** | [38R-4](38R-4-proof-validation-design.md) — Claims A/B, M-01–M-08, T-audits, PF catalogue |
| **SC-7** | Prompt accretion explicitly avoided as primary mechanism | **Complete** | [38R-1 §Task 5](38R-1-minimum-viable-episode-plan.md); [38R-4 Claim E, V6, PF-11](38R-4-proof-validation-design.md) |
| **SC-8** | Recommendation made for implementation, refinement, or rejection | **Complete** | This document — **Proceed with constraints** |

**Summary:** SC-1–SC-7 **complete**. SC-8 **complete** in 38R-5. No partial SCs remain at design-proof level.

**Note:** SC-6 defines **proof approach**, not **proof execution**. Runtime G3/G5 reduction is an **implementation sprint exit criterion**, not a 38R design-proof deliverable.

---

## Task 3 — Architecture readiness assessment

| Area | Assessment | Rationale |
|------|:----------:|-----------|
| **Educational validity** | **Ready** | V1 plans instructional transitions and learner-state **progression by function order** ([38R-1 success condition](38R-1-minimum-viable-episode-plan.md)); adversarial fit **Strong** all archetypes |
| **Archetype coverage** | **Ready** | A1–A4 fully expressed; no missing **R** functions requiring new primitives ([38R-2](38R-2-archetype-fit-test.md)) |
| **Mapping viability** | **Ready** | [38R-3](38R-3-plan-to-dla-mapping.md): all archetypes **Strong**; limited obligation metadata only |
| **Fidelity compatibility** | **Ready** | DLA→GAM→Page path preserved; [38R-4](38R-4-proof-validation-design.md) regression floor defined; **compatibility assumed, not yet proven at runtime** |
| **Proof readiness** | **Ready** | [38R-4](38R-4-proof-validation-design.md): claims, metrics, gate criteria, proof package specified |
| **Complexity control** | **Ready** | Two top-level keys; three rejected primitive classes (state engine, transition graph, branching); burden of proof on expansion ([38R-1](38R-1-minimum-viable-episode-plan.md)) |
| **Prompt independence** | **Ready** | Structural plan carries choreography; [38Q-4](38Q-4-episode-generation-design-options.md) prompt enrichment Weak on G3/G5 |

**No area rated Needs refinement or Not ready** at the **plan schema** layer. Residual **Needs refinement** applies only to **implementation population behaviour** (38R-3 risk R-01), which is the purpose of the follow-on sprint — not a V1 schema hold.

---

## Task 4 — Final minimality attack

### Could Episode Plan be smaller?

| Attack | Finding | Verdict |
|--------|---------|---------|
| Remove `archetype` | Cannot validate archetype-fit; FunctionEnum context lost for Evaluate vs Understand | **Rejected** — [38R-1](38R-1-minimum-viable-episode-plan.md) essential |
| Remove `beats[]` | No sequence; recreates parallel bundle | **Rejected** |
| Replace `function` with opaque index | T1–T5 indistinguishable; all chains collapse | **Rejected** — [38R-1 V0 test](38R-1-minimum-viable-episode-plan.md) |
| Ordered list of strings without wrapper | Loses archetype binding; pipeline attachment unclear | **Marginal** — wrapper cost is negligible; archetype required for templates |
| Single beat per episode | Cannot express T1–T5 or A1–A4 | **Rejected** |

**Conclusion:** V1 is **at the floor**. Further reduction **breaks expressibility** or **archetype validation**. No V1.1 shrink recommended.

### Could Episode Plan be removed entirely?

| Alternative | Evidence against |
|-------------|------------------|
| **LO → DLA direct** | G3/G5 persist at `fullOk` ([38Q-3](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)); GAP-13 parallel bundles; reorder test fails ([38Q-1](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-1-what-good-looks-like-baseline.md)) |
| **Prompt-only choreography** | [38Q-4](38Q-4-episode-generation-design-options.md): Weak on all five thematic gaps; [38R-1](38R-1-minimum-viable-episode-plan.md) accretion test |
| **GAM-only fix** | Cannot retrofit missing obligations ([38Q-4 Option C](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-4-episode-generation-design-options.md)); realisation layer, not planner |

**Conclusion:** Removal **contradicts** 38Q H2 confirmation and 38R mapping proof. **Not supported.**

### Could prompt engineering achieve the same result?

**No as primary strategy.**

| Evidence | Source |
|----------|--------|
| Strong bodies already generate at `fullOk`; G3/G5 remain | [38Q-3](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md) |
| Prompt enrichment scored **Weak** on G3/G5 | [38Q-4](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-4-episode-generation-design-options.md) |
| Order authority cannot be prompt-enforced reliably | [38R-4 PF-11](38R-4-proof-validation-design.md); [38Q-5 M-7](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |

Prompts remain valid for **inference and realisation quality** (M-11), not **choreography authority**.

### Could DLA extension alone achieve the same result?

**Partially — insufficient alone.**

| DLA-only approach | Limit |
|-------------------|-------|
| Add `instructional_function` to materials without plan | Tags without **authoritative order source** — population can still collapse beats; decorative tags ([38R-3](38R-3-plan-to-dla-mapping.md) PF-11) |
| Expand `required_materials[]` schema | Addresses **realisation** not **planning**; recreates worksheet planner at DLA layer ([38Q-5 M-4](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md)) |
| Obligation metadata **with** plan gate | **Required combination** — [38R-3 Mostly (B)](38R-3-plan-to-dla-mapping.md) |

**Conclusion:** DLA extension is **necessary but not sufficient**. Episode Plan + plan-before-populate gate + obligation tags is the minimal **complete** fix.

---

## Task 5 — Implementation options

| Option | Benefits | Risks | Verdict |
|--------|----------|-------|---------|
| **A — Implement V1 as designed** | Closes 38Q/38R arc; smallest object; proof framework ready; no schema churn | Population collapse (R-01); `fullOk` regression if gate weak; GAM substitution (G4) | **Preferred path** — subject to constraints below |
| **B — Refine V1 before implementation** | Theoretical risk reduction | No adversarial evidence forced V2; delay without identified primitive gap; scope creep toward prompt-accretion plan | **Not recommended** — no design-proof failure warrants V1 change |
| **C — Abandon Episode Plan; DLA/GAM evolution only** | Smaller initial change surface | Reverts to architecture 38Q rejected; G3/G5 structurally unaddressed; prompt accretion relapse | **Rejected** — contradicts 38Q-6 closure and 38R evidence |

---

## Task 6 — Implementation scope (existence only)

**Scope definition:** what the follow-on sprint **must** and **must not** introduce. Not a build design.

### Must exist

| # | Requirement | Evidence |
|---|-------------|----------|
| 1 | **Episode Plan V1 object** — `archetype` + ordered `beats[].function` | [38R-1](38R-1-minimum-viable-episode-plan.md) |
| 2 | **FunctionEnum** aligned to [38Q-2 §6](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-2-episode-taxonomy-catalogue.md) | [38R-2](38R-2-archetype-fit-test.md) |
| 3 | **Plan-before-populate gate** — no `required_materials[]` without completed plan beat | [38Q-5 M-13](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md); [38R-3 P9](38R-3-plan-to-dla-mapping.md) |
| 4 | **Ordered obligation population** — plan beat index → DLA obligation(s) | [38R-3 P1–P3](38R-3-plan-to-dla-mapping.md) |
| 5 | **`instructional_function` (or equivalent) per obligation** | [38R-3 Task 5](38R-3-plan-to-dla-mapping.md) — limited DLA extension |
| 6 | **Mapping contract enforcement** — P1–P10, AC-01–AC-10 at population | [38R-3](38R-3-plan-to-dla-mapping.md) |
| 7 | **Archetype templates** — frozen A1–A4 plans as reference or seed | [38R-2](38R-2-archetype-fit-test.md); [38Q-5 M-8](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| 8 | **Proof gate execution** — [38R-4](38R-4-proof-validation-design.md) package before rollout | Claims A–E, M-01–M-08 |
| 9 | **Order propagation to page layer** — generalise `materials_order` / role-precedence alignment | [38R-3 Task 5](38R-3-plan-to-dla-mapping.md); R-05 |
| 10 | **LO → Plan → DLA pipeline insertion** | [38Q-5](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |

### Must not exist

| # | Prohibition | Evidence |
|---|-------------|----------|
| 1 | **Learner-state engine / state objects** | [38R-1 rejected](38R-1-minimum-viable-episode-plan.md); [38R-2](38R-2-archetype-fit-test.md) — no evidence required |
| 2 | **Transition graph / `transitions[]` engine** | [38R-1](38R-1-minimum-viable-episode-plan.md) — order authority sufficient |
| 3 | **Branching / orchestration framework** | [38R-2](38R-2-archetype-fit-test.md) — A1–A4 linear; no branch primitive needed |
| 4 | **Prompt choreography layer** as primary plan substitute | [38Q-5 M-7](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md); SC-7 |
| 5 | **Material types in plan** | [38R-1](38R-1-minimum-viable-episode-plan.md) — G4/G5 risk |
| 6 | **DLA activity object redesign** | [38R-3](38R-3-plan-to-dla-mapping.md) hold conditions |
| 7 | **38M–38P fidelity machinery reopen** | [38Q-5 M-2](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| 8 | **Decorative plan** — plan generated post-hoc from DLA | [38R-4 PF-11](38R-4-proof-validation-design.md) |
| 9 | **V1 schema expansion** without new design sprint | [38R-2](38R-2-archetype-fit-test.md) — burden of proof on complexity |
| 10 | **Session arc engine** in V1 scope | Deferred — Task 9 |

---

## Task 7 — Implementation constraints

Binding on any follow-on implementation sprint:

| ID | Constraint | Authority |
|----|------------|-----------|
| **IC-1** | **`fullOk: true`** on plan-driven proof run — hard gate | [38Q-5 M-1](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md); [38R-4 Claim D](38R-4-proof-validation-design.md) |
| **IC-2** | **Preserve 38M–38P path** — no compose/render redesign | [38Q-5 M-2](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| **IC-3** | **Preserve V1 minimality** — no schema expansion without design sprint | [38R-1](38R-1-minimum-viable-episode-plan.md); [38R-4 Hold §6](38R-4-proof-validation-design.md) |
| **IC-4** | **No prompt-accretion primary strategy** — structural plan gate first | [38Q-5 M-7](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md); SC-7 |
| **IC-5** | **58/58 regression suite preserved** | [38Q-5 M-9](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| **IC-6** | **Plan is planning authority** — DLA derives from plan, not inverse | [38Q-5 M-3, M-13](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| **IC-7** | **Separate planning from realisation** — GAM chooses material types | [38Q-5 M-4, M-6](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| **IC-8** | **38I target states remain acceptance authority** | [38Q-5 M-10](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| **IC-9** | **Proof exit before production rollout** — [38R-4 Proceed criteria](38R-4-proof-validation-design.md) all pass | This recommendation |
| **IC-10** | **Anti-collapse rules enforced** — AC-01–AC-10 at population | [38R-3](38R-3-plan-to-dla-mapping.md) |
| **IC-11** | **Inference contracts for Evaluate functions** — content layer, not plan shape | [38Q-5 M-11](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| **IC-12** | **Activity demoted, not deleted** — DLA row remains realisation container | [38Q-5 M-12](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |

---

## Task 8 — Final recommendation

## Recommendation

### **Proceed with constraints**

Prism **should** proceed to an **implementation sprint** for Episode Plan V1. The design-proof programme has met its burden: the plan is **minimal**, **expressive**, **mappable**, and **proof-ready**. No unresolved **schema** evidence blocks implementation.

Implementation is **not unconditional**. Success requires passing the [38R-4 proof gate](38R-4-proof-validation-design.md) before rollout. Design proof ≠ runtime proof.

### Justification (38Q–38R programme)

| Finding | Implication |
|---------|-------------|
| 38Q: G3/G5 dominant at `fullOk` | Upstream planning change required — not fidelity fix |
| 38Q: Option F Hybrid | Pipeline insertion validated; 38R confirms DLA/GAM retained |
| 38R-1: V1 at primitive floor | No pre-implementation schema work needed |
| 38R-2: A1–A4 Strong adversarial fit | Archetype coverage complete |
| 38R-3: Mostly (B) mapping | Limited obligation metadata — not plan change |
| 38R-4: Proof framework ready | Objective success/failure criteria exist |
| Minimality attack failed | Smaller/removal alternatives rejected with evidence |

### What this recommendation does **not** say

- Does **not** guarantee G3/G5 close on first implementation attempt  
- Does **not** approve skipping proof gate (IC-9)  
- Does **not** authorise V1 expansion, session engine, or prompt-accretion fallback  
- Does **not** reopen 38M–38P  

### If implementation fails proof gate

| Failure mode | Response (not V1 reflex) |
|--------------|--------------------------|
| PF-01 collapse | Fix population contract / enforcement |
| PF-06 fullOk regression | Fix order propagation or GAM realisation — not plan schema |
| M-05 AC violations | Strengthen anti-substitution at GAM + obligation spec |
| PF-11 decorative plan | Enforce M-13 gate in pipeline |

**Refine V1** only if new adversarial evidence identifies a **missing primitive** — none exists today.

---

## Task 9 — Inputs to 38R-6 closure

## Closure inputs

### Recommendation summary

**Proceed with constraints** — implement Episode Plan V1 with IC-1–IC-12; exit on [38R-4](38R-4-proof-validation-design.md) proof gate (A1–A4 + T3-MICRO + `EV-38R-AFTER` class replay).

### Rationale

38Q established **that** episode planning is required. 38R established **how small** it can be and **that** it maps to DLA without stack replacement. Remaining risk is **execution quality** (population collapse), which only an implementation sprint can resolve — and which the proof framework is designed to detect.

### Open questions (implementation sprint, not 38R blockers)

| # | Question | Owner |
|---|----------|-------|
| 1 | Plan generation: template-seeded vs inferred from LO+archetype? | Implementation sprint |
| 2 | Where is plan persisted in pipeline artefacts? | Implementation sprint |
| 3 | GAM prompt changes for AC compliance — how much is required? | Implementation + proof |
| 4 | Generalise `materials_order` beyond A3 — scope of 38N pattern | Implementation sprint |
| 5 | Inference contract shape for A4 criteria/perspective content (M-11) | Adjacent to plan; KM/LO layer |

### Implementation prerequisites

1. Frozen V1 schema and A1–A4 reference plans ([38R-2](38R-2-archetype-fit-test.md))  
2. Mapping contract P1–P10, AC-01–AC-10 ([38R-3](38R-3-plan-to-dla-mapping.md))  
3. Proof gate specification ([38R-4](38R-4-proof-validation-design.md))  
4. EV-38P-AFTER harness available for replay  
5. Implementation charter citing IC-1–IC-12  

### Future concerns explicitly out of scope

| Concern | Classification | Evidence |
|---------|:--------------:|----------|
| **Session-level progression** (A1→A4 independence rise) | **Future enhancement** — **non-blocker** | [38R-2](38R-2-archetype-fit-test.md): multi-episode session plan; [38Q-3 GAP-17](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md) |
| **Cross-episode fade / scaffold rise across workbook** | **Future enhancement** — **non-blocker** | Same; T1 fade is **within-episode** in V1 |
| **Inter-activity transition beats** | **Future enhancement** | `transition` beat closes single episode; session bridges need session contract |
| **Branching strategy paths** | **Out of scope** | [38R-2](38R-2-archetype-fit-test.md) — linear A4 sufficient |
| **Loop/retry orchestration** | **Out of scope** | A2 `revision` beat is single-pass linear extension |
| **G2 weak realisation depth** | **Non-blocker** — track in proof | Worked judgement quality is GAM layer; plan orders function |
| **G1 session-wide missing functions** | **Partially addressed by V1 per episode** | Some G1 gaps (predict-revise) need beats in plan templates over time |

**Session / cross-episode fade verdict:** **Non-blocker.** V1 implements **single-episode choreography**. Session arc is a **second planning object** (session plan or linked episode plans) — explicitly deferred in 38R-2 and not required to justify V1 implementation. Closing GAP-17 remains a **follow-on programme** after single-episode proof passes.

---

## Formal implementation recommendation

| Question | Answer |
|----------|--------|
| Is V1 sufficiently specified to justify implementation? | **Yes** — design proof complete; proof gate defined |
| Should Prism proceed? | **Yes — with constraints** (IC-1–IC-12) |
| Refine V1 first? | **No** — no evidence supports |
| Abandon Episode Plan? | **No** — contradicts 38Q–38R |
| Is implementation success guaranteed? | **No** — runtime proof required |

**Success condition answer:**

> **Is the minimum viable Instructional Episode Plan sufficiently proven to justify implementation, and if so, under what constraints?**

**Yes.** Design proof is sufficient to **justify** an implementation sprint. Constraints: V1 frozen; plan-before-populate gate; obligation function tags; P1–P10 / AC-01–AC-10 enforcement; 38M–38P path preserved; **fullOk** and [38R-4 Proceed criteria](38R-4-proof-validation-design.md) as exit gate.

---

## Sprint SC contribution

| SC | Status after 38R-5 |
|----|-------------------|
| **SC-8** | **PASS** — recommendation recorded |

All SC-1–SC-8 **complete** at design-proof level pending 38R-6 formal closure.

---

## Hold conditions (unchanged)

- No code in 38R-5  
- No implementation in 38R-5  
- V1 frozen  
- 38M–38P not reopened  

---

## Status

| Field | Value |
|-------|-------|
| Phase | 38R-5 |
| Status | **COMPLETE** |
| Recommendation | **Proceed with constraints** |
| V1 schema | **Frozen** |
| Next | **38R-6** — Sprint closure |
