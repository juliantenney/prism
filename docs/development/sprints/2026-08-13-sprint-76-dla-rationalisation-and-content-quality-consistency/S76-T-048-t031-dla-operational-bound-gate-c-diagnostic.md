# S76-T-048 — T-031 DLA operational-bound Gate C diagnostic

**Task:** S76-T-048  
**Status:** **Gate C PASS** (2026-08-14) — T-031 operational suitability **CLOSED**  
**Mode:** DIAGNOSTIC / CLOSURE ONLY — no production, prompt, schema, validator, test, fixture, EP, DLA, GAM, pack, or Settings changes  
**Depends on:** [T-030](S76-T-030-generated-operand-operational-suitability-diagnostic.md) · [T-031](S76-T-031-generated-operand-operational-suitability-solution-design.md) · [T-046](S76-T-046-generated-operand-operational-suitability-implementation-plan.md) · [T-047](S76-T-047-generated-operand-operational-suitability-implementation.md) · [T-045](S76-T-045-dla-lo-operation-coverage-gate-c-diagnostic.md) · [T-042](S76-T-042-dla-p01-r1-intermediate-operand-gate-c-closure.md)  
**Contract under test:** `76-DLA-PARTIAL-9`

**Evidence limitation:** This diagnostic message did **not** include a pasted DLA/GAM JSON body. Exact field quotes below that are marked **operator-reported** are taken from the Gate C brief, not from a captured artefact in git. Pre-T-031 DLA from T-045 is **not** substituted as this run. Workflow LO statements from T-045 remain the last quoted LO set for this Lagrangian session.

This artefact does **not** implement a DLA residual. It does **not** reopen T-033 or P01-R1. It does **not** investigate GAM D/E. It does **not** claim RECOVER.

---

## 0. Finding in one paragraph

The preliminary “DLA specification failed because it did not say interior-solvable / taught-method-only” **collapses** against T-031’s accepted split. The challenge commission (operator-reported: objective, equality constraint, numerical values, derivation, solution, verification) names the **operation** (derive / solve / verify). Whether a realised stem can actually be derived, solved, and verified under that operation is **inherent GAM executability**, now contracted by: *“Realised particulars must support the commissioned learner operation within those bounds; do not substitute a different method or extra unstated reasoning.”* A lucky good GAM draw does not prove DLA; independently, a structural DLA spec does **not** fail T-031 if no additional pedagogical X-vs-Y choice was omitted. Historical Problem B is **Case 1** (cannot perform the commissioned solve). Construction control (operator: exclude derivative calculations) is **PASS**. **Do not** add a generic “must be solvable” sentence to every DLA specification — that would restate GAM’s duty and blur ownership.

---

## 1. Fresh Gate C evidence

| Item | State |
| ---- | ----- |
| Post-T-047 DLA JSON | **Not in this message / not in git** |
| Post-T-047 GAM JSON | **Not in this message / not in git** |
| Operator Gate C summary | Anti-over-spec **PASS**; operand ID **PASS**; GAM suitability **PASS** this run; DLA bound **apparent FAIL/PARTIAL** (the question under test) |
| Construction exclusion (operator) | Equivalent to **“exclude derivative calculations”** — exact string unverified |
| Challenge specification (operator) | Approximately: objective; equality constraint; numerical values; derivation; solution; verification — exact string unverified |

**Construction control (A)** — earlier/simple construction activity (ids/titles not in this paste; historically DLA A1 “construct Lagrangian”, not assumed here).

Operator: specification excludes derivative calculations (this operation only).

**Derive/solve challenge (B)** — later activity (historically DLA A2 “Solve the Conditions”; ids not assumed).

Operator: operand commissioned with objective, equality constraint, numbers, plus derivation/solution/verification. GAM realised a suitable optimisation problem on this run.

P01-R1: operator **PASS** (operand identified). P02: not reopened; ordinary practice expected `required: false` as in T-045 A2, **not re-quoted**.

---

## 2. Construction control

Operator reports an exclusion equivalent to **exclude derivative calculations**. That is a bound **for this commissioned operation only** (construct, not differentiate/solve). GAM honoured it (operator).

**CONSTRUCTION CONTROL: PASS** (operator-confirmed; exact wording unverified).

This is positive evidence that *“State bounds for this commissioned operation only”* is model-visible and behaviourally active.

---

## 3. Challenge commission

**Operator-reported specification shape:** objective; equality constraint; numerical values; derivation; solution; verification.

Does this state the T-030 **pedagogical** interior-vs-boundary exclusion? **No** (on the reported shape).

Would a GAM-compliant operand still be possible that has obj/constraint/numbers, supports writing derivatives, but admits **no usable solution** under the intended procedure? **Structurally yes** relative to *that specification text alone*. **Contractually no** relative to the **live GAM sentence**, which requires particulars to **support the commissioned learner operation** (derive + solve + verify). An inconsistent/degenerate stem that cannot be solved is a **GAM** breach even if DLA never wrote “solvable.”

**DLA BOUND SUFFICIENT: YES** for T-031’s DLA job (name pedagogical choices that are not implied by the named operation). The reported spec plus the activity’s derive/solve/verify production **is** the operation. Extra “interior-only / KKT-out” is a **further** scope choice; it is not proven as a load-bearing DLA omission on this LO set (T-045 LO4 is apply FOCs + verify constraint / feasible solution — not “exclude corners”).

---

## 4. Independent DLA / GAM verdicts

| Question | Verdict |
| -------- | ------- |
| DLA: did the commission **exclude** all operationally unsuitable particulars by extra method prose? | **No extra method prose** (operator). **Not required** if GAM owns executability under the named operation. |
| GAM: was **this run’s** particular operationally suitable? | **PASS** (operator). |

A good GAM draw does **not** prove DLA. A structural DLA spec does **not** fail GAM. Both recorded independently.

---

## 5. Literal Step 3 test

Live Step 3 (`76-DLA-PARTIAL-9`):

> Include any pedagogically chosen method, condition, assumption, boundary, or exclusion the commissioned operation depends on. If omitting it would permit an operand that requires a different operation or untaught reasoning, the specification is insufficient. State bounds for this commissioned operation only.

| | Question | Answer |
| - | -------- | ------ |
| **A** | Pedagogically load-bearing method/condition for **this** operation? | **YES** — the operation itself is derive/solve/verify via FOCs (workflow LO3/LO4). Interior vs KKT is a **possible** extra scope, not shown as chosen in the reported spec. |
| **B** | Was an extra method/scope bound **stated in specification**? | **NO** (operator-reported spec is structural + production verbs). |
| **C** | If omitted, could GAM **legally** emit a structurally compliant operand requiring different/untaught reasoning? | **NO** under **current** GAM: must support the commissioned operation; must not substitute a different method or extra unstated reasoning. Pre-T-047: **YES** (T-030). |
| **D** | Should DLA have added a bound **according to Step 3**? | **NO** for restating inherent solvability. **YES** only if DLA had independently chosen interior-only vs include-corners as pedagogy **beyond** the named FOC solve. That choice is **not evidenced** as missing from learner production (T-045). |

---

## 6. Missing-bound concept

**Fresh activity (behavioural):** DLA did not write “the stem must admit a consistent solution under the taught FOC procedure.” GAM still emitted a usable problem.

**Generalisation:** The suspected “missing” sentence is **inherent executability of the named operation**, not an unstated X-vs-Y pedagogical fork.

Closest concept: **“be executable using the operation the learner is asked to perform.”** That is T-031 **GAM** ownership, not a DLA theorem list.

DLA should **not** prove the mathematics of every instance.

---

## 7. Is this a DLA failure?

Competing reading (accepted): commissioning derivation, solution, and verification **is** DLA stating the operation. Admitting such a solution is GAM.

T-031 §C: DLA owns pedagogical **choice** among legitimate treatments. T-031 §D / live GAM: particulars must **support** the commissioned operation; do not substitute method Y.

**DLA FAILURE CONFIRMED: NO**

Preliminary PARTIAL treated “no solvability clause in specification” as DLA miss. That restates GAM’s inherent duty.

---

## 8. Named operation vs named method

| | Fresh challenge (operator + T-045 LO context) |
| - | --------------------------------------------- |
| **Operation explicit?** | **YES** — derive, solve, verify (reported spec verbs; T-045 learner_task pattern). |
| **Specific method pedagogically intended?** | FOC / Lagrangian method is the **operation’s method**, named in LO3/LO4, not a silent alternative to KKT in the LO text. Interior-only vs corners **not** in LO4. |
| **Where established?** | Production (`learner_task` / `expected_output`) and LOs — **not** (on this evidence) the operand `specification`. Teaching/WE likely models FOCs; exact WE body not in this paste. |
| **Does GAM see the method from the commission?** | **YES** if GAM Copy has the DLA page: `learner_task` + purpose/specification + WE rows. GAM is not specification-only. |

---

## 9. LO / learner production (T-033 stays CLOSED)

T-045 quoted LO3/LO4: derive FOCs using the Lagrangian method; solve by applying FOCs and verifying the constraint (feasible solution). Production is **not** “pick among solving theories.” Step 3 should **not** invent an interior/KKT fork the LO does not name. **Do not reopen T-033.**

---

## 10. Teaching / worked-example context

Not inspectable without this run’s JSON. T-045 A2 commissioned a worked analytic example **before** practice. If this run kept that pattern, the FOC procedure is modelled upstream of the operand. Step 3 **need not** copy that method into the operand spec if `learner_task` already names derive/solve FOCs. **Not GAM D.**

**Teaching-context finding:** method is expected in production/teaching; **not** shown as absent; **not** shown as a specification-only gap.

---

## 11. Model visibility

Live `CONTRACT_VERSION` **`76-DLA-PARTIAL-9`**. Step 3 T-031 sentences are in `lib/ld-dla-page-enrich-contract.js`. Copy still dual-injects contract+shape (`app.js` `buildDlaV2CopilotSchemaInstructions` and `applyEpisodePlanDlaPopulationPromptBlockToDraft`). Pin: `lib/ld-dla-page-enrich-contract.js?v=20260814-s76-dla-t031-opsuit`.

Construction exclusion (this-operation-only) appearing in the fresh DLA is **behavioural** evidence the T-031 DLA sentences were seen.

**T-031 DLA RULE MODEL-VISIBLE: YES** (assuming Copy was recut after the T-047 pin; a stale paste would be the only miss).

---

## 12. Competing DLA instructions

Same Step 3 parenthetical **before** the T-031 sentences:

> specification (binding GAM bounds: content, load-bearing count/variation/constraints/exclusions; not body prose)

That frames specification as **content/count/variation/shape**, then operational sentences follow.

**Rank: MEDIUM** as a priming pressure toward structural specs. **Not HIGH:** construction activity still emitted an operational exclusion. Do not blame length.

No instruction tells DLA to leave **all** executability to GAM except T-031’s own split (DLA pedagogical choice vs GAM inherent fulfilment) — which is **correct**, not competing.

---

## 13. Local Step-3 salience

**LOCAL STEP-3 SALIENCE ISSUE: MEDIUM**

Parenthetical “content, count/variation/constraints/exclusions” can be read as the definition of specification; T-031 then looks like a gloss. Construction control shows the gloss **can** fire. Salience does **not** by itself justify a residual if DLA’s job was already done by naming the operation.

---

## 14. Semantic sufficiency

Step 3 “different operation or untaught reasoning” covers **wrong method** more clearly than **inconsistent/unsolvable under the named method**.

The **GAM** sentence covers unsolvability: particulars must **support** the commissioned operation.

**STEP-3 SEMANTIC GAP: MEDIUM** (DLA wording vs degenerate stems) **and not a DLA residual** — degenerate stems are Case 1 GAM.

---

## 15. DLA vs GAM executability

If DLA says “problem for learners to derive, solve and verify” and no X-vs-Y pedagogy is required, **GAM is already obligated** to emit a problem that can be derived, solved, and verified.

**Therefore Gate C can PASS** without a DLA “must be solvable” clause.

---

## 16. Counterfactuals

**CASE 1:** DLA commissions operation X, no extra method choice. GAM emits an operand on which X cannot be performed. **GAM in breach** under the current GAM sentence. **YES.**

**CASE 2:** DLA intends method X not Y, omits that choice. GAM emits executable Y. **DLA failed first.**

**Fresh challenge: closer to Case 1.** Reported spec names derive/solve/verify (operation X). Historical worry is unsolvable-under-X, not a well-posed Y.

---

## 17. Historical T-030

Problem B: FOCs writable, not simultaneously solvable; resolving it needs boundary/KKT — a **different method**, but the **immediate** failure is that the commissioned **solve** cannot be completed.

T-031 treated interior-only as a DLA pedagogical bound **and** consistent FOCs as inherent GAM once the method is named.

Post-T-047 GAM text (“support the commissioned learner operation”; “do not substitute a different method”) makes Problem B a **GAM breach** even without DLA writing “interior-only,” provided `learner_task` already commissions derive/solve FOCs.

**Historical T-030: primarily Case 1**, with a Case 2 colour (untaught boundary as the only rescue). The **decisive live repair** is the GAM sentence. DLA Step 3 remains useful for true X-vs-Y pedagogy and for anti-over-specification (construction control).

---

## 18. Hypothesis ratings

| ID | Hypothesis | Rating |
| -- | ---------- | ------ |
| **H1** | No residual: DLA sufficient; solvability is GAM; GAM passed | **HIGH** |
| **H2** | DLA salience: should have stated a pedagogical bound | **LOW** |
| **H3** | Step 3 semantic gap on unsolvability | **MEDIUM** (wording quality; GAM covers it) |
| **H4** | Upstream method never chosen | **LOW** (LO/production name FOC solve) |
| **H5** | Competing prompt suppresses the rule | **MEDIUM** (parenthetical priming; not causal of a miss) |

---

## 19. Gate C classification

**A. PASS**

DLA states pedagogical bounds where they belong to **this** operation (construction: no derivatives). Challenge spec names the operation. Inherent executability is GAM-owned; GAM passed this run. Historical unusable Problem B is now a GAM contract breach.

Do not keep preliminary PARTIAL.

---

## 20–21. Residual / close

**No DLA residual.** A generic DLA “must be solvable” line would duplicate GAM and invite over-specification (copying solvability onto construction activities — the control this run **passed**).

T-031 closes on: construction control PASS; DLA operation/bounds sufficient; GAM executable particulars this run; new GAM rule classifies Problem B as a breach.

---

## 22. GAM D / E

**GAM D: SEPARATE**  
**GAM E: PARTIAL OVERLAP** (unusable consequence only; mechanism not absorbed)

---

## 23. P01 / T-033 / P02

**P01-R1: CLOSED** (operator operand-ID PASS; no Step 2 issue)  
**T-033: CLOSED**  
**P02: UNCHANGED**

---

## 24. Schema / validator

**SCHEMA CHANGE: NO**  
**DETERMINISTIC VALIDATOR CHANGE: NO**

---

## 25. Next action

**Close T-031.** Order remaining Sprint 76 work (P05, GAM D/E, decision gate) when the operator chooses. Do not start those from this diagnostic. Do not implement a DLA “solvable” add.

If the operator later pastes JSON whose `learner_task` does **not** name derive/solve/verify, this ownership reading should be re-checked — that is a paste gap, not an open residual.

---

**T-031 GATE C PASS — OPERATIONAL SUITABILITY CLOSED**
