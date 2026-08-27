# S80-T-006 — Operator product / architecture decision gate

**Sprint:** 80 — Settings Discovery, Product Value and Policy Architecture
**Status:** **DECIDED** (operator direction recorded 2026-08-27)
**Mode:** Decision + planning handoff only — **no production code; T-007 implementation not started**
**Decision owner:** Operator (human gate). Cursor records and structures the decision; it did not choose it.
**Evidence base:** [T-001](S80-T-001-sprint-opening-settings-history-and-current-state-diagnostic.md) → [T-005B.2](S80-T-005B.2-resolved-brief-factor-effectiveness-live-consumer-audit.md)

---

## 1. Formal operator decision

**The historical Settings catalogue and `[PRISM_STEP_PARAMS]` mechanism will NOT define the future product architecture.**

Against the A/B/C/D options carried since T-003:

| Option | Outcome |
| --- | --- |
| A — Delete Settings | **Partially adopted.** The 41-control catalogue is superseded and will not be rehabilitated. |
| B — Retain reduced/purposeful surface | **Rejected as framed.** The surviving concept is not a reduced Settings panel. |
| **C — Substantially redesign** | **ADOPTED.** Settings is replaced by **Adjustments**, a different product concept with two deliberately separate mechanisms. |
| D — Further evidence / prototype first | **Discharged.** T-005 → T-005B.2 supplied the evidence; no further discovery is required before T-007. |

**Rationale of record.** Rehabilitating the historical parameter plumbing would create unnecessary complexity and competing authority. This is now evidence-backed rather than presumed:

- The Create-time bake reads **no** brief factor — `buildSeededStepPromptForWorkflowStep` hardcodes an empty option list and strips the param block (`app.js:5373`, `5381`).
- `[PRISM_STEP_PARAMS]` has **no reachable route to any model** — the only caller of the builder that would emit it sits behind a provably unreachable guard (`app.js:27107–27109` vs `27126`).
- Of 44 resolved brief keys, **17 have no proven effect** and only **6** produce model-visible text (T-005B.2 §2).

Rebuilding authority on that substrate would mean reviving dead plumbing. The decision is to build a small, explicit mechanism instead.

---

## 2. Product model: Adjustments

**Adjustments** replaces Settings. Final labels for sub-elements may still be refined.

Adjustments contains **two deliberately separate mechanisms** which must not be merged into one catalogue:

| # | Mechanism | Nature | Purpose |
| - | --- | --- | --- |
| **1** | **Workflow Parameters** | Small, allowlisted, **typed** | Make an existing workflow reusable with different commissioning values |
| **2** | **Per-Step Additional Instruction** | Optional, **natural language**, per model-driven step | Scoped author direction for intentions PRISM cannot anticipate |

The separation is architectural, not cosmetic. Mechanism 1 is deterministic and machine-readable; mechanism 2 is discretionary and model-interpreted. Conflating them would recreate the failure T-002/T-003 documented — a control panel whose semantics no one can state honestly.

**Explicitly not adopted:** exposing the historical factor catalogue merely because the values exist.

---

## 3. Workflow-parameter model

A workflow parameter is a typed value that a workflow consumer may change **without regenerating the workflow through Create**.

Every parameter must declare, as a precondition of existing:

1. **Type** — text, number, enum, boolean, or structured payload.
2. **Valid values / bounds** — complete enumeration for enums; explicit range for numbers.
3. **Owning interpretation point** — the single place responsible for interpreting it.
4. **Deterministic runtime semantics** — a statable contract of what changing it does.
5. **Runtime projection** — how the value reaches the consuming stage.

**Start small.** Future parameters must be addable without inventing a new propagation architecture (§14).

**Hard constraint carried from T-005B.2:** parameters must **not** be stored as, or derive authority from, `[PRISM_STEP_PARAMS]`. That block is demoted to legacy transport (§12).

---

## 4. Per-step additional-instruction model

Every model-driven workflow step should be capable of carrying an **optional** natural-language author instruction.

This is deliberately broad. PRISM cannot anticipate every legitimate advanced-user intention, and T-003 established that forcing such intentions into enums produces controls whose behaviour cannot be explained.

Operator examples of record:

| Step | Example instruction |
| --- | --- |
| Model Knowledge | "Prioritise foundational concepts and competing interpretations rather than chronological detail." |
| Learning Outcomes | "Keep the outcomes at introductory conceptual-understanding level." |
| Episode Plan | "Use a relatively flat learning arc because this resource introduces concepts developed in a later resource." |
| Design Page | "Create and prioritise an explanatory image for every activity." |
| Assessment generation | "Make distractors diagnose common misconceptions." |

**This is not another typed Settings catalogue.** It is scoped author direction supplied to an **existing** model call. It introduces no new vocabulary, no enums, and no per-step schema.

---

## 5. Create vs reusable-workflow boundary

**Create remains the commissioning / compiler experience used to DESIGN a workflow.** Adjustments provides deliberately supported variability when **REUSING** that workflow.

**Parameterisable workflow thesis (adopted as a major product goal).** An advanced author may create a small number of generic workflows which other users repeatedly run with different values:

- *Generic generate-content workflow* — Topic = Henry VIII, then Elizabeth I, then French Revolution.
- *Generic supplied-content workflow* — late-bound PDF / transcript / source material.

A consumer of such a workflow should not need to regenerate it through Create to change a legitimate runtime parameter. This is especially valuable where the consumer **cannot** generate a new workflow themselves.

**Consequences of the boundary:**

- Not every Create-time factor becomes a runtime parameter.
- Some decisions remain **workflow invariants** — notably the topology-bound factors T-005B.2 classified `NO_TOPOLOGY_BOUND`.
- Some advanced design variation is expressed through **per-step additional instructions** instead of new typed parameters.

---

## 6. Parameter authority rules

1. **One owning interpretation point per parameter.** A parameter must not be independently reinterpreted by several stages (T-004 principle, retained).
2. **Parameters are authoritative over discretionary stage choices** within their declared scope, and only there.
3. **Parameters must not become a second pedagogical authority.** They may not override stage-owned pedagogic reasoning outside their declared scope.
4. **Parameters must not silently invalidate artefacts.** If a change requires regeneration, that must be explicit rather than implied.
5. **Parameters must not alter workflow topology or capability.** Anything that would add or remove stages is a Create concern, not an Adjustment.
6. **Deterministic, no AI round-trip.** Editing a parameter must not require a model call (§7, no-new-interpretation rule).
7. **Truthfulness precondition.** A parameter may not ship until its declared contract is actually honoured at runtime — no repetition of the persisted-but-inert pattern.

---

## 7. Additional-instruction precedence and boundary rules

**Compositional contract.** The instruction is **not** replacement prompt text. Conceptually:

```
canonical / stage prompt
+ authoritative upstream artefacts
+ explicit workflow parameters
+ optional author additional instruction
```

**The additional instruction may steer discretionary decisions. It must NOT override:**

- required schemas;
- validators;
- explicit typed workflow parameters;
- authoritative upstream artefacts;
- fixed workflow topology / capability;
- canonical hard requirements.

**Precedence order (highest first):** canonical hard requirements and schemas → validators → authoritative upstream artefacts → explicit typed workflow parameters → **author additional instruction** → stage discretionary defaults.

**No new AI interpretation call for Adjustments.** Natural-language step instructions are consumed when that existing workflow step is run. They require no separate elicitation or interpretation model call. This preserves the no-API-key consumer case: a user without their own model capability must still be able to edit **structured** workflow parameters deterministically.

---

## 8. Initial v1 parameter candidates

| Candidate | Status | Basis |
| --- | --- | --- |
| **Topic** | **Strong** | T-005B.1: free text, no enum conflict, no topology gate, no dependent factors, already sanitised, high-impact confirmation gate exists. T-005B.2: the cleanest chain in the model |
| **Duration** | **Strong, blocked** | Conceptually strong; **blocked by the hardcoded DLA timing defect** (§15). Cannot be declared truthful until resolved |
| **Audience / learner level** | **Candidate, needs vocabulary work** | Requires a clean canonical vocabulary rather than inheriting conflicting historical enums (§10) |
| **Assessment parameters** | **Conditional** | Only where the workflow contains assessment (§9); requires capability investigation first |

**Not v1:** everything else. The 17 keys T-005B.2 found to have no proven effect are retirement candidates, not parameter candidates.

---

## 9. Assessment conditionality

**Operator intent of record:**

- an assessment-capable workflow **remains** assessment-capable;
- Adjustments does **NOT** turn assessment off or remove its workflow stages;
- the assessment **itself** may be parameterised;
- likely dimensions: **quantity, difficulty, supported question type**;
- **only expose capabilities PRISM genuinely supports.**

This draws the line exactly where T-005B.2 found the architecture to be sound: `assessment_required` and `assessment_total_items` are *topology* levers (whether assessment stages exist), and topology is a Create concern. Parameterising the assessment's *content* is a different, legitimate concern.

**Prerequisite investigation.** The last clause is load-bearing and currently unmet. T-005B.2 found that within the assessment family:

- the item **count** reaches no prompt — its stepParam is dead and its constraint line is filtered by `isAssessmentLeakLine` (`app.js:33131–33141`);
- the GAI stored prompt is voided (`31432–31439`) and Design Assessment's baked body is replaced by a six-line fixed brief (`33810–33812`);
- `assessment_strategy` and `assessment_cadence` have **no `app.js` read site at all**;
- `difficulty_profile` and `coverage_scope` are Settings-panel-only.

So quantity, difficulty and question type are **not** currently truthful. A scoped investigation must establish the genuinely supported capability before any assessment parameter is declared.

---

## 10. Audience / level vocabulary issue

**Decision: do not inherit the historical enums. Establish one canonical vocabulary.**

The evidence (T-005B.1 §14, conflicts 1 and 13):

- brief factor `learner_level` = `beginner / intermediate / advanced / undergraduate / postgraduate`;
- LO step param `learnerLevel` = `school / undergraduate / postgraduate / professional / general_adult` (default `general_adult`);
- **the two overlap in only 2 of 5 values**;
- the Research pack declares `audience` as a first-class factor; **Learning Design does not** (`extraFields: []`), which is why the page shell's `resolved.audience` is permanently undefined for LD and falls back to the `"Learners"` constant (`app.js:11638`).

A single canonical vocabulary with one owning interpretation point is a precondition for shipping Audience as a parameter. Blindly unioning the two enums is explicitly rejected.

---

## 11. Treatment of historical Settings

**The 41-control Settings surface is superseded product design.**

- Controls will **not** be preserved merely for compatibility.
- Dead controls are retirement candidates, not migration candidates.
- The Settings *summary display* layer is misleading and should not survive into Adjustments: `formatWorkflowSettingsParamDisplayValue` (`app.js:3554–3562`) renders a friendly "yes"/"no" for `include_examples`, a value no prompt builder reads.
- Retirement is a T-007+ implementation activity. **Nothing is deleted in T-006.**

---

## 12. Treatment of `[PRISM_STEP_PARAMS]`

**Demoted. It is not, and will not become, policy authority.**

| Aspect | Decision |
| --- | --- |
| Authority | **None.** No new parameter may derive authority from it |
| Role | Legacy UI/transport serialisation only |
| New writes | No new parameter concepts to be added to it |
| Removal | **Not decided here.** Removal or quarantine is a T-007+ implementation question |
| Reinterpretation | Historical values must **not** be silently reinterpreted as new authoritative policy |

Evidence basis: T-005B.2 established every stepParam projection is a prompt dead end, and that the block is stripped at every notes-to-prompt boundary.

---

## 13. Compatibility decision

**No migration complexity will be designed for old workflows unless a genuine technical requirement is discovered.**

- The operator is currently the only user.
- Existing workflows may be treated as **stale before Alpha** and regenerated.
- Historical workflow compatibility is **NOT** a reason to keep dead Settings controls or `[PRISM_STEP_PARAMS]` authority.
- Retired controls persisted in old workflows must not regain authority merely because a new parameter system exists (T-005 constraint, retained).

---

## 14. Extensibility rule for future parameters

**Required shape for adding a parameter:**

```
declare parameter
→ type / valid values
→ owning interpretation point
→ runtime projection
```

**Explicitly forbidden shape:**

```
declare parameter
→ manually patch many prompts / stages / stores
```

This is the acceptance test for the T-007 architecture: if adding a second or third parameter requires touching many prompts, the architecture has failed and must be revised before more parameters are added.

**V1 philosophy:** prefer a useful small surface over completeness. Further typed parameters can be added later, provided the above holds.

---

## 15. Known prerequisite defects

Recorded by T-005B.2 §8. **Not fixed in this task.**

| # | Defect | Evidence | Consequence |
| - | --- | --- | --- |
| **D1** | Hardcoded DLA timing text — `session_duration_target_minutes (~60)` and `Sum of activity duration_minutes 50–70` | `lib/ld-dla-page-enrich-contract.js:473,493,495`; `buildDlaWorkbookOverlayBlock()` takes no arguments (`:471`); caller passes no duration (`app.js:10334–10339`) | **Blocks Duration as a truthful runtime parameter.** A 30-minute workflow would still receive ~60 as binding contract text. Must be resolved first |
| **D2** | Canonical DLA cognition block bypassed | `app.js:15996–16001` returns before the injector at `16006`; canonical slot context has no cognition slot (`10340–10347`) | Cognition factors silently lost at the DLA stage. Independent of parameters, but in the same subsystem T-007 will touch |

**D1 is a hard prerequisite for the Duration parameter.** D2 is a correctness defect to schedule, not a parameter blocker.

Both are invisible to the current test suite, because cognition tests call the injector directly and no test asserts that a factor changes emitted prompt text through the live chain (T-005B.2 §9).

---

## 16. Risks and unresolved questions

**Risks**

| # | Risk | Mitigation |
| - | --- | --- |
| R1 | **Parameter creep** — Adjustments regrows into a 41-control catalogue | §14 extensibility rule as a gate; allowlist by default |
| R2 | **Inert parameters** — shipping a control that does not actually work, repeating the documented failure | Truthfulness precondition (§6.7); behavioural test contract (slice 9) |
| R3 | **Instruction overreach** — a natural-language instruction subverts a schema or validator | §7 precedence rules; explicit non-override framing in the injected block; validator precedence unchanged |
| R4 | **Instruction becomes a dumping ground** for things that should be typed parameters | Periodic review; if an instruction pattern recurs, promote it to a typed parameter |
| R5 | **Duration ships untruthfully** if D1 is deprioritised | D1 declared a hard prerequisite |
| R6 | **Two mechanisms confuse users** — unclear when to use a parameter vs an instruction | UX framing work in T-007; the distinction is deterministic-vs-discretionary |
| R7 | **Topology confusion** — a consumer expects a parameter to add assessment | §6.5 and §9: capability is fixed at Create |

**Unresolved questions for T-007**

1. What is the canonical audience/level vocabulary, and which stage owns it?
2. What assessment capability does PRISM genuinely support today, and what is the resulting truthful parameter set?
3. Where exactly is the runtime projection point — the existing augmentation chokepoint, or a new explicit resolution step?
4. Are per-step instructions stored on the step, and how do they survive workflow duplication and export?
5. Does changing a parameter require an explicit "apply/regenerate" affordance for already-generated artefacts, or is it Run-time only?
6. Should per-step instructions be available on every model-driven step in v1, or a subset?
7. What happens to the ~17 no-effect keys — silent retirement, or explicit removal with a note?

---

## 17. Recommended target architecture for T-007

**Planning proposal only — not an approved design.**

**A. Parameter declaration registry.** A single declarative source of truth for workflow parameters, each carrying type, valid values, owning interpretation point and projection. Declaration must be data, not code branches, so §14 holds.

**B. One resolution point producing an effective run context.** A parameter resolver that composes: workflow-invariant commissioning state (frozen `resolvedFactors`) + consumer-supplied parameter values, with parameter values winning within their declared scope. This yields one object consumed downstream — no per-stage re-derivation.

**C. Projection at the existing runtime chokepoints, not via step params.** T-005B/T-005B.2 identified two real chokepoints already reading frozen factors directly: `applyWorkflowStepRuntimePromptAugmentations` (`app.js:15990`) and `resolvePedagogicCognitionBriefContextForPrompt` (`8205–8261`). These are the correct insertion points because they are the only paths proven to reach a model at Run. **Do not revive `[PRISM_STEP_PARAMS]` or the unreachable Studio path.**

**D. Per-step instruction as a delimited, subordinate block.** Stored on the step; injected at the same chokepoint as a clearly-labelled, explicitly subordinate section placed after canonical requirements, with framing that states it may steer discretionary choices only. No new model call.

**E. Deterministic editing path.** Parameter editing must work with no API key. This follows from B and C: resolution is deterministic and projection happens inside the existing step run.

**F. Behavioural test contract.** New tests must assert that changing a parameter changes **emitted prompt text through the live chain**, closing the systematic gap T-005B.2 §9 identified. Tests that call injectors directly do not discharge this.

---

## 18. Proposed implementation slices — planning only

Ordered; **none authorised by this task**.

| Slice | Content | Depends on |
| --- | --- | --- |
| **S1** | Resolve defect **D1** — make DLA timing text derive from resolved duration rather than hardcoded literals | — |
| **S2** | Parameter declaration registry + contract (declaration only, no UI, no consumers) | — |
| **S3** | Parameter resolver → effective run context; projection wired at the existing chokepoint | S2 |
| **S4** | **Topic** end-to-end as the thinnest vertical proof, with behavioural tests | S3 |
| **S5** | **Duration** end-to-end | S1, S3 |
| **S6** | Per-step additional instruction — storage, delimited injection, precedence guard, tests | S3 |
| **S7** | Canonical audience/level vocabulary consolidation; then **Audience** parameter | S3 |
| **S8** | Assessment capability investigation → truthful conditional assessment parameter set | S3 |
| **S9** | Behavioural test contract hardening (live-chain prompt-text assertions) | S4 |
| **S10** | Adjustments UI (two clearly separated mechanisms) | S4, S6 |
| **S11** | Retire dead Settings controls and the misleading summary display | S10 |
| **S12** | Resolve defect **D2** — canonical DLA cognition bypass | — (schedulable independently) |

**Extensibility checkpoint:** after S5, adding a third parameter must require only a registry declaration. If it does not, revise the architecture before S7/S8.

---

## 19. Sprint records updated

- This record (new, authoritative T-006 decision)
- `STATUS.md`, `SPRINT-80-START-HERE.md`, `PLAN.md`, `HANDOVER.md`, `next-chat-briefing.md`, `README.md`
- `decisions.md` — A/B/C/D resolved to **Option C (Adjustments)**
- T-006 marked **DECIDED**; T-007 becomes the next task, **not started**

**No production code. No pack, prompt, Settings, parameter or schema change.**

---

## 20. Exact next action

**S80-T-007 — Target architecture and implementation plan for Adjustments.**

T-007 should produce the detailed design for §17 and a validated slice plan for §18, specifically:

1. the parameter declaration contract (§3, §14);
2. the resolver and effective-run-context design (§17B);
3. the projection design at the existing chokepoints (§17C);
4. the per-step instruction storage and injection design with precedence enforcement (§7, §17D);
5. the behavioural test contract (§17F);
6. sequencing that respects **D1 before Duration** (§15);
7. answers to the seven unresolved questions (§16).

T-007 remains **planning and design**. Implementation begins only when the operator authorises a specific slice.

**STOP — T-006 decision recorded. T-007 not started. No implementation.**
