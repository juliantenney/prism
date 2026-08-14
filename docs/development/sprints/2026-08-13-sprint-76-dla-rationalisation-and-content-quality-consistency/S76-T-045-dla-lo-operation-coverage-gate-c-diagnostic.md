# S76-T-045 — DLA LO-operation coverage Gate C diagnostic

**Task:** S76-T-045  
**Status:** **Gate C PASS** (2026-08-14) — T-033 LO-operation coverage **CLOSED** for the live mapped-LO set  
**Mode:** DIAGNOSTIC / CLOSURE ONLY — no production, prompt, schema, validator, test, fixture, EP, DLA, GAM, pack, or Settings changes  
**Depends on:** [T-032](S76-T-032-dla-a4-constructive-alignment-diagnostic.md) · [T-033](S76-T-033-dla-lo-operation-coverage-solution-design.md) · [T-043](S76-T-043-dla-lo-operation-coverage-implementation-plan.md) · [T-044](S76-T-044-dla-lo-operation-coverage-implementation.md) · [T-042](S76-T-042-dla-p01-r1-intermediate-operand-gate-c-closure.md)  
**Contract:** `76-DLA-PARTIAL-8`

**Exhibits (operator-pasted; not in git):**

1. Post-T-033 DLA page (3 activities, `current_stage: dla`) — authoritative DLA runtime.  
2. Held-constant Episode Plan shell (5 activities, `current_stage: episode_plan`).  
3. Learning-outcomes artefact with exact statements and notes.

EP was **not** regenerated. DLA was rerun over the existing workflow.

This artefact does **not** start T-031, P05, GAM D/E, or further T-033 wording. It does **not** claim RECOVER. Roman Roads was **not** rerun.

---

## 0. Finding in one paragraph

The observed Gate C concern applied T-032’s reconstructed LO4 (“identify the optimum **and** verify the constraint”) to a **different** live outcome. This session’s **quoted LO4** is: *“Solve a simple economic optimisation problem by applying the first-order conditions and verifying the constraint.”* Notes: *“Emphasis on obtaining and checking a feasible solution.”* Fresh DLA **A2** (`mapped_learning_outcomes`: LO3, LO4) requires derive FOCs, solve, and verify the constraint in `learner_task` / `expected_output`. Perfect completion **does** demonstrate those load-bearing operations. “Optimum” appears in `reasoning_orientation` only; it is **not** a named load-bearing claim of LO4. T-033 did not fail at its pressure point on **this** mapped-LO set. T-032 remains historically valid for a stronger optimality-judgement LO that **this** workflow does not state.

---

## 1. Evidence boundary

| Item | State |
| ---- | ----- |
| DLA JSON | Operator paste — 3 activities A1–A3 |
| EP JSON | Operator paste — 5 activities A1–A5; LO statements on `learning_outcomes[]` |
| LO artefact | Same five statements; LO4 notes emphasise **feasible** solution |
| Exact LO text in DLA page | **Absent** (partial DLA forbids emitting `learning_outcomes`) — LOs taken from EP + LO artefact |
| GAM | Not inspected |

**Do not** treat DLA A2 as historical T-032 A4. EP A4 is the evaluate-choreographed LO4 slot; DLA folded EP A3+A4 into DLA A2.

---

## 2. Exact mapped LOs for DLA A2

Quoted from the learning-outcomes artefact / EP `learning_outcomes[]` (identical statements):

**LO3:** “Derive the first-order conditions for a constrained optimisation problem using the Lagrangian method.”  
Notes: includes differentiation w.r.t. decision variables and λ.

**LO4:** “Solve a simple economic optimisation problem by applying the first-order conditions and verifying the constraint.”  
Notes: “Emphasis on obtaining and checking a **feasible** solution.”  
Related concepts include “Optimal solution”; that phrase is **not** in the statement.

### Load-bearing operations of **these** statements

| Operation | Role | Sufficient observable production |
| --------- | ---- | -------------------------------- |
| Derive all FOCs (incl. wrt λ) | Primary for **LO3** | Written derivatives / FOC system from the supplied Lagrangian problem |
| Apply those FOCs to obtain a solution | Primary for **LO4** (solve) | Algebra that yields candidate values |
| Verify the original constraint | Named second claim in **LO4** | Explicit check that the solution satisfies the constraint |

A distinct “establish / interpret that this **is the optimum**” claim is **not** load-bearing in LO4’s statement. That grain belongs to **LO5** (shadow-price interpretation) and to T-032’s **operator-paraphrased** historical LO4, not this artefact.

---

## 3. Fresh DLA A2 production

| Field | Quote / value |
| ----- | ------------- |
| Title | Solve the Conditions |
| Mapped ids | **LO3, LO4** |
| `learner_task` | Read modelling note → follow worked analytic example → derive all FOCs from supplied scenario → complete analysis table → **solve the resulting equations and verify the constraint** → checklist |
| `expected_output` | “Produce a complete derivation of the first-order conditions and a **feasible** solution. Strong work shows accurate differentiation, coherent algebraic reasoning, and **explicit verification that the solution satisfies the original constraint**.” |
| `reasoning_orientation` | Treat FOCs as a connected system. “Consider how each derivative contributes information about the **optimum**.” |
| Operand | **A2-M3** scenario — new optimisation problem |
| Workspace | **A2-M4** analysis_table — **not** in `task_input_material_ids` |
| Checklist spec | derivatives, FOCs, algebra, **solution satisfies original constraint** |
| P02 | `required: false` |

**T-033 counterfactual:** If completed perfectly, would the work demonstrate every load-bearing mapped-LO operation of **LO3 and LO4 as stated**?

**YES.**

| Operation | Classification |
| --------- | -------------- |
| Derive FOCs (LO3) | **EXPLICITLY REQUIRED** (`learner_task` step 3; `expected_output`) |
| Apply FOCs / solve (LO4) | **EXPLICITLY REQUIRED** |
| Verify constraint (LO4) | **EXPLICITLY REQUIRED** |
| Identify/interpret “this is the optimum” as a separate claim | **NOT REQUIRED** in task/output; **IMPLICITLY POSSIBLE** via method; mentioned only in `reasoning_orientation` |

---

## 4. Optimality vs feasibility

Against **this** LO4:

| | Required by quoted LO4? | In DLA A2 production? |
| - | ----------------------- | --------------------- |
| A. Solve the FOC system | Yes (apply FOCs) | Yes |
| B. Obtain a feasible candidate | Yes (notes: feasible solution) | Yes (`expected_output`) |
| C. Verify the original constraint | Yes (statement) | Yes |
| D. Establish the result is “the optimum” as a distinct judgement | **No** | Not in task/output |
| E. Interpret the optimal solution / shadow price | **No** (that is **LO5**) | A3, not A2 |

**Does perfect completion of A2 necessarily demonstrate the LO’s optimality claim?**  
The live LO4 **does not make a separate optimality-judgement claim**. It asks for solve-by-FOCs + constraint verification. Perfect A2 demonstrates **that**. Missing a T-032-style “identify the optimum” operation would be **inventing** an LO DLA does not own.

---

## 5. Pre / post comparison

| | Production |
| - | ---------- |
| **T-032 historical A4** (operator paraphrase) | Analyse/verify **given candidates** against the constraint; feasibility standing in for **identify the optimum** |
| **T-042 DLA A2** (pre-T-033, same 3-activity shape) | Derive FOCs, solve, check constraint; `expected_output` already “FOCs and a feasible solution” |
| **Post-T-033 DLA A2** | Same operations; wording slightly tighter (“explicit verification”) |

**Behavioural class vs T-042 same-page shape:** **C. NO MATERIAL CHANGE AT THE PRESSURE POINT** — the pressure point **moved**: T-032’s missing operation is **not in this LO4**.

**Vs T-032 candidate-feasibility A4:** DLA A2 is **stronger** (derive+solve, not only substitute candidates). That improvement is largely the **3-activity mapping + actual LO3/LO4 text**, already visible at T-042, not a new T-044 sentence effect.

**Classification:** **C** at the T-033 wording delta; **not a regression**.

---

## 6. T-033 model-visible

Live `CONTRACT_VERSION` is `76-DLA-PARTIAL-8`. Step 1 includes the coverage / supporting-check / counterfactual sentences. Copy injects `buildDlaPageEnrichContractBlock()` in `buildDlaV2CopilotSchemaInstructions` and again in `applyEpisodePlanDlaPopulationPromptBlockToDraft` (`app.js`). Cache pin: `?v=20260814-s76-dla-t033-lo-coverage`.

Operator refreshed and reran DLA after T-044. **T-033 MODEL-VISIBLE: YES** (assuming Copy was recut from current PRISM; a stale Copilot paste without recopy would be the only miss).

---

## 7. Competing DLA instructions

Pack DLA (`domain-learning-design-step-patterns.md`) still says this step is **obligation population**, **not a learning-design step**, and to **translate episode_plan beats into `learner_task`**, populating materials **before** `learner_task`.

EP A4 is **evaluate** with `evaluative_judgement` / `worked_judgement` mapped **only to LO4**. If beat-assembly dominated, DLA A2 would look like an evaluative judgement activity. It does **not**. Production follows **LO3+LO4 statements** (analyse/apply solve+verify), not EP A4’s evaluate grammar.

| Pressure | Rank | Effect on this run |
| -------- | ---- | ------------------ |
| Pack: populate from beats; not learning-design | **HIGH** as a **standing** competitor | **Did not win** on DLA A2 vs EP A4 evaluate |
| Canonical shape: `learner_task` “tied to the LO **and episode beats**” | **MEDIUM** | LO side appears to have won for A2 |
| DLA-WB-06a table on practice activity; G4 analytic pass + verification checklist | **MEDIUM** | Amplifies FOC+verify once chosen; coherent with LO4 |
| DLA-WB-02 capstone ≥3 LO ids | **MEDIUM** | DLA A3 maps LO1+LO4+LO5 |
| Dual Copy injection (P05) | **LOW** as cause of this result | Layout only |
| Prompt length alone | **NONE** as a cause | Not evidenced |

---

## 8. H1 vs H2

**H1 salience failure: LOW** for this exhibit — the mapped-LO operations **are** in `learner_task` / `expected_output`.  
**H2 semantic insufficiency: LOW** against **quoted** LO3/LO4. MEDIUM only if one smuggles T-032’s unstated “identify the optimum” into LO4 via related_concepts.

The apparent “T-033 miss” was **LO-statement mismatch**, not a weak Step 1.

---

## 9. Reasoning-orientation substitution

`reasoning_orientation` mentions “the optimum”; production does not require an optimality judgement.

**REASONING-ORIENTATION SUBSTITUTION RISK: LOW** for coverage of **stated** LOs (the required operations are in task/output). **MEDIUM** as leftover method-language. T-033 ownership remains `learner_task` / `expected_output`. No contract change from this leak.

---

## 10. Expected-output pressure

Canonical: “Quality-threshold prose describing what good evidence looks like.” Pack AS-05 / DLA-WB-19: 30–70w quality-threshold, not completion labels.

A2 `expected_output` names FOC derivation, feasible solution, explicit constraint verification — **aligned with LO4 notes**, not a hollow completeness label. “Feasible solution” here **is** the LO4 success criterion.

---

## 11. Material amplification

Checklist and worked-example specs repeat FOC + constraint check. That **amplifies** the chosen production. **Earliest cause** of that production is **the mapped LO statements** (and DLA A2’s LO3+LO4 mapping), not P01/P03/T-031.

---

## 12. A1 / A3 controls

**A1** maps LO1+LO2. Production: construct a Lagrangian from a supplied scenario (A1-M4). Covers **LO2** explicitly. **LO1** (differentiate unconstrained vs constrained) is taught in A1-M1 / reasoning_orientation / self-explanation, not as a standalone classification product. Partial compound-LO compression of LO1 into teaching — **not** the T-032 class. Acceptable for a merged first activity; not a T-033 fail on LO2.

**A3** maps LO1, LO4, LO5. Judgement memo interprets multiplier from cases (A3-M2 provider; P02 true). **LO5** is **EXPLICITLY REQUIRED**. Extra LO1/LO4 mapping is workbook capstone pressure (DLA-WB-02), not a missing LO5 operation.

**Within-run:** A2 matches its **stated** LOs; A3 matches LO5; A1 matches LO2. Not a global DLA failure.

---

## 13. Compound-LO pressure

DLA collapsed EP’s five 1:1 LO activities into three (~60 min workbook). A2 carries LO3+LO4, which **share a process** (derive then apply/verify). Compression is **procedural chaining**, not substituting a check for a named higher-order LO claim.

**General pressure:** MEDIUM (workbook duration + DLA-WB-02). **Do not** require one activity per LO.

---

## 14. Over-decomposition

**OVER-DECOMPOSITION OBSERVED IN FRESH LAGRANGIAN: NO** (DLA **compressed** 5 EP slots to 3). Not a Roman Roads substitute.

---

## 15. P01-R1

A2: `separate_inputs_required: true`; `task_input_material_ids: ["A2-M3"]`; table A2-M4 unlisted. A1 analogously A1-M4 only.

**P01-R1 REMAINS CLOSED.**

---

## 16. T-031 / GAM

T-033 asked whether DLA designed the **right** operations for the **mapped** LOs. On this evidence, **yes** for LO3+LO4. T-031 still owns whether GAM-realised A2-M3 is solvable/usable. **T-031 cannot and need not repair a missing optimality judgement this LO does not require.**

**GAM:** not blamed. Queue D/E remain separate.

---

## 17. Contract-gap classification

**A. CONTRACT NOW SUFFICIENT; THIS IS NOT A T-033 MISS ON THE LIVE LO SET.**

Secondary: T-032’s historical grain ≠ this LO4. If a future LO **names** identify/interpret the optimum as load-bearing, retest T-033; do not keep T-033 open on a related_concept.

Not mere variance: A1/A3/A2 are coherent with their **statements**.

---

## 18. Ranked causes of the *observed concern*

| Candidate | Rank |
| --------- | ---- |
| Applying T-032’s paraphrased LO4 to this session’s different LO4 | **HIGH** (explains the concern) |
| Compound mapping / 5→3 collapse | **MEDIUM** (real, not the T-032 defect) |
| Pack beat-population vs evaluate A4 | **MEDIUM** standing competitor; **did not** force evaluate production onto DLA A2 |
| Step-1 salience / semantic insufficiency | **LOW** on quoted LOs |
| Reasoning_orientation “optimum” | **LOW** for coverage failure |
| Ordinary generative variance | **LOW** |

**Earliest causal layer of the *concern*:** wrong LO text used as the Gate C standard.  
**Earliest causal layer of *A2 production*:** quoted LO3+LO4 (+ workbook merge).

---

## 19. Repair class

**A. NO REPAIR — accept this mapping and close T-033.**

Do not add Lagrangian-specific “identify the optimum” into Step 1. That would **invent** an operation this LO4 does not state (T-033: coverage is load-bearing operations of **the mapped LO**, not every related concept).

EP A4 **evaluate** vs LO4 **solve+verify** is an **EP/LO choreography** tension, not a DLA Step 1 bug. Do not implement EP redesign here.

---

## 20. Schema / validator

**SCHEMA CHANGE: NO**  
**DETERMINISTIC VALIDATOR CHANGE: NO**

---

## 21. P05

Untouched. Dual injection not treated as the cause. Do not start prompt-architecture work.

---

## 22. Gate C verdict

**A. PASS — T-033 behaviourally closed** on this Lagrangian DLA vs **quoted** LO3/LO4.

Caveat: not a Roman Roads rerun. Not proof against a future LO that **does** name a distinct optimality judgement.

---

## 23. Next action

**Close T-033. Proceed to T-031 when ordered** (designed, not implemented). Do not start T-031 from this diagnostic. Do not reopen P01-R1. Do not start P05 or GAM D/E.

---

**T-033 GATE C PASS — LO-OPERATION COVERAGE CLOSED**
