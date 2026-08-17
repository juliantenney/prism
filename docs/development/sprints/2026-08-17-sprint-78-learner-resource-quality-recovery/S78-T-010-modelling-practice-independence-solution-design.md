# S78-T-010 — Modelling / practice independence solution design

**Task:** S78-T-010  
**Status:** **DESIGN COMPLETE** (2026-08-17)  
**Mode:** DESIGN ONLY — no implementation  
**Workstream:** 2 — Modelling / practice independence  
**Depends on:** [S78-T-002](S78-T-002-modelling-practice-independence-diagnostic.md) (diagnostic complete)  
**Production / tests / prompts / schema / validators / renderer / assembly:** **UNCHANGED by this task**

---

## 0. Accepted T-002 diagnosis (not reopened)

See [S78-T-002](S78-T-002-modelling-practice-independence-diagnostic.md). Summary:

- **Historical failure:** Activity 3 — complete worked solution to the **identical** constrained-optimisation problem immediately before independent practice on that same problem.
- **Earliest proven layer:** **DLA commissioning** (Primary **B**).
- **Secondary:** **G** (SP-06/IFP-06 prompt-only, narrow); **D** (archetype sequence does not propagate).
- **Fresh 87/100 run:** capability evidence only — **not** architectural guarantee.
- **Historical failure still passes current validation:** **YES**.

This design **makes an intended instructional relationship authoritative** — it does **not** restore a removed fail-closed validator.

---

## 1. Recommended repair architecture (single decision)

**Name:** **Model–practice operand independence binding (S78-WS-2)**

| Element | Decision |
| ------- | -------- |
| **Canonical owner** | **DLA commissioning contract** + **DLA partial-page capture validator** (shape/closure gate) |
| **Authoritative invariant** | When DLA commissions a **model surface** paired with an **independent learner attempt** on a procedural operand, the model and attempt **MUST** use **distinct operands** such that the model does **not** disclose or substantially complete the attempt operand’s target solution. |
| **Secondary owner** | **GAM authoring contract** — honour projected binding at material generation (SP-06 salience keyed to operand ids) |
| **Enforcement boundary (Stage 1)** | DLA capture: binding **shape + id closure**; prompt-contract tests. GAM: **prompt-only** operand-aware SP-06 block. |
| **Enforcement boundary (Stage 2 — deferred)** | Cross-material semantic leak detection (specification/body fingerprinting) — **only if Stage 1 proves insufficient** |
| **Assembly / renderer** | **No change** — preserve/display authored content |
| **Archetype** | **Normative clarification only** — does not replace DLA as earliest authoritative owner |

---

## 2. Design decisions (D1–D8)

### D1. Canonical invariant

> **S78-WS-2:** Where a worked model material is followed by an **independent learner attempt** targeting the **same capability**, the model **MUST** demonstrate that capability on **operand A**; the attempt **MUST** require the learner to apply that capability to **operand B**, where:
>
> 1. **A and B are distinct problem instances** (distinct operands — not merely different material rows or rephrased wording of the same case).
> 2. The model **MUST NOT** disclose B’s target solution, final evaluative conclusion, or the load-bearing reasoning steps the learner must still perform for the independent attempt.
> 3. **Method/capability continuity** is preserved — B is a **near-transfer** instance of the same capability class as demonstrated on A, not an unrelated topic change.

**Normative shorthand:** **method continuity + operand independence**.

This is **not** “numbers must differ” and **not** “context must be novel”. It is **operand-instance independence with preserved transfer intent**.

### D2. Earliest authoritative owner

**DLA commissioning** — the relationship first becomes authoritative when DLA emits paired `required_materials[]` rows with explicit binding and specification obligations **before GAM runs**.

Archetype beat grammar (`worked_thinking → guided_practice → independent_performance`) remains **planning context** only until DLA encodes the pairing.

### D3. Representation — existing fields vs new metadata

| Option | Verdict |
| ------ | ------- |
| **A. Specification prose only** | **Rejected as sole mechanism** — same failure mode as pre–S78-WS-1: cross-row references in free-text specifications are fragile at JSON emit time; GAM cannot reliably key SP-06 to the attempt operand. |
| **B. Lightweight row metadata on model materials** | **Selected** — parallel to `response_fulfilment` / `evidence_requirement`. |
| **C. Activity-level metadata only** | **Rejected** — loses clarity when multiple model or operand rows coexist (R7); row-level on the **model** row is the natural “must not leak” anchor. |
| **D. Other** | — |

### D4. GAM propagation

GAM receives `practice_independence` via the existing T-023 projection path (`copyOwnFieldIfPresent` in `app.js`, same as `response_fulfilment`).

When present on a model row, GAM **MUST**:

1. Author the model body on a **distinct operand** from every id in `attempt_operand_material_ids`.
2. **MUST NOT** embed the attempt operand’s problem statement, data values, or target solution in the model body.
3. End worked examples with **Bridge:** applying the **method** to the learner’s operand — not pre-answering it (existing SP-06 MP-3, made **locally salient** by operand id reference).

GAM **must not** infer pairing from task verbs alone when DLA has supplied binding.

### D5. Prompt salience (output surface)

Mirror [S78-T-009](S78-T-009-dla-p02-provider-row-output-shape-salience-repair.md):

| Surface | Change (future implementation) |
| ------- | ------------------------------ |
| **§6 Commissioning** | `practice_independence` field shape + conditional MUST when model + independent attempt coexist |
| **§4 Production** | After learner_task classification: when independent procedural production exists alongside model materials, binding is **mandatory** |
| **§10 OUTPUT** | Conditional **MP-1 closure invariant** + compact pre-output checklist item (bounded — target **≤600 chars** net in §10) |
| **GAM contract / SP-06 injection** | Operand-aware block when projected binding present |

### D6. Enforcement — now vs deferred

| Stage | Scope | Mechanism |
| ----- | ----- | --------- |
| **Stage 1 (implement first)** | Binding presence, shape, id closure, type compatibility, prompt-contract tests, GAM prompt salience | DLA capture + tests; GAM prompt only |
| **Stage 2 (deferred)** | Semantic same-operand / solution-leak detection across specification or authored bodies | Cross-material validator — **only if** regeneration after Stage 1 still produces POST-S77-class failures |

**Deferred runtime semantic validation because:** brittle string/number inequality would reject legitimate near transfer; safe deterministic semantics require operand abstraction not yet extractable without LLM-assisted or domain-specific parsers.

### D7. Partial / guided practice — avoiding false positives

| Beat / mode | Operand relationship | `practice_independence` |
| ----------- | -------------------- | ------------------------- |
| **Worked model** | Distinct operand A; full or substantial method demonstration | Binding **required** when independent attempt follows |
| **Guided practice** | May scaffold **on the learner operand B** with partial steps, hints, fixed exemplar rows | Binding **not required** for guided-only rows; existing `allows_partial_exemplar` + G4 partial exemplar rules apply |
| **Independent performance** | Learner completes load-bearing reasoning on B | Operand B **must not** be pre-solved by preceding model |

**Classification rule (DLA):** Emit `practice_independence` only when the activity’s classified production includes **independent** procedural performance (not study-only, not guided-only-without-independent-step). Guided practice on B **does not** trigger the binding; model → **independent** attempt does.

**IFP-06 / SP-07** remain scoped to consolidation / sample_output anti-spoiler — unchanged.

### D8. Regression strategy

See §12 — cases R1–R8.

---

## 3. Operand abstraction (minimal, cross-disciplinary)

**Operand:** the authoritative **problem/case/task instance** the learner (or model) operates on — the smallest unit whose **target solution** must remain undisclosed in the model when that same instance is the independent attempt target.

DLA expresses operands in **`specification`** on operand-bearing rows (`scenario`, `task_card`, `prompt_set` problems, etc.). S78-WS-2 does **not** introduce a universal operand ontology or domain-specific schema.

| Domain | Operand (examples) | Distinct-instance intuition |
| ------ | ------------------- | --------------------------- |
| **Mathematics / economics** | Objective + constraint set + decision variables for one optimisation instance | Different coefficients/constraints/objective — same method family |
| **Humanities / source analysis** | A specific passage, extract, or case file | Different text/case — same analytic method |
| **Programming / professional** | A specific program spec, client scenario, or input dataset | Different spec/data — same procedure |

**Sufficient independence criteria (semantic, for QA and future Stage 2):**

1. Distinct underlying operand (not the same instance re-labelled).
2. Target solution / final evaluative conclusion not already visible in model materials.
3. Learner must perform load-bearing reasoning steps for the attempt — not copy-substitute from model.
4. Near transfer permitted — B structurally comparable to A for the same capability.
5. Output cannot be produced by trivial transcription from model to attempt.

**Insufficient (prohibited):** exact operand reuse; superficial restatement with same data and disclosed solution path.

---

## 4. Archetype responsibility

**Current state:** Apply/Analyse sequences prescribe `worked_thinking → guided_practice → independent_performance` with material-type hints only ([S78-T-002](S78-T-002-modelling-practice-independence-diagnostic.md) §5).

**Design addition (documentation-level, non-blocking):**

> **`independent_performance`** in archetype grammar **means** the learner must perform the target capability on an operand whose target solution has **not** already been supplied by preceding model materials in the same activity.

**Propagation choice:** **Do not** add archetype-only metadata as the authoritative carrier. DLA derives pairing from:

- model material types (`worked_example`, `modelling_note`);
- independent production classification from `learner_task` / `expected_output`;
- operand rows in `task_material_decision.task_input_material_ids`.

Optional one-line cross-reference in archetype grammar docs — **not** a separate implementation task unless operator requests.

---

## 5. DLA design (commissioning)

### 5.1 When binding is required

Emit `practice_independence` on **model rows** (`worked_example`, `modelling_note`) when **all** hold:

1. Same activity commissions ≥1 model row (above types).
2. Same activity commissions ≥1 **independent** procedural attempt operand (`scenario`, `task_card`, or task input bound to `response_fulfilment` with independent production).
3. `learner_task` classified production is **not** study/read/verify-only.

### 5.2 When binding is forbidden / omitted

| Case | Rule |
| ---- | ---- |
| **R5 — model only** | No independent attempt — omit `practice_independence` |
| **R6 — independent without model** | No model row — omit |
| **R4 — guided only on operand** | Guided scaffold without independent step — omit binding; partial exemplar rules apply |
| **Evidence activities** | Evidence P02 analogous-case rules **unchanged** — separate concern |
| **Teaching rows** | `text`, `checklist`, `sample_output` — never carry `practice_independence` |

### 5.3 New structured field: `practice_independence` (on model `required_materials[]` rows only)

Parallel to `response_fulfilment` — optional object, **required** when §5.1 conditions hold.

```json
"practice_independence": {
  "attempt_operand_material_ids": ["A3-M1"]
}
```

| Subfield | Rule |
| -------- | ---- |
| `attempt_operand_material_ids` | Non-empty array of `material_id` strings referencing operand rows in the **same activity** that define the independent attempt problem/case/task set |

**Specification obligations (same row, normative prose):**

- Model `specification` **MUST** state that the demonstrated instance is **distinct from** every bound attempt operand and **MUST NOT** include the attempt operand’s target solution or complete reasoning path.
- Each bound operand `specification` **MUST** define a **distinct instance** from the paired model (near-transfer comparable capability).

**Method continuity:** Preserved via shared `learner_task` / LO capability — binding ids **link** rows; it does not require arbitrary topic change.

### 5.4 DLA answers (T-010 brief §6)

| # | Answer |
| - | ------ |
| 1. How does DLA know these form a model→attempt pair? | Model row type + independent production classification + operand ids in `task_material_decision` / workspace binding → emit `practice_independence.attempt_operand_material_ids`. |
| 2. Distinct practice operand? | Binding + specification MUSTs above. |
| 3. Method continuity? | Same activity `learner_task` / capability; specifications require structurally comparable near-transfer instance. |
| 4. Prevent model solving attempt operand? | Model specification MUST NOT complete attempt solution; GAM SP-06 operand block enforces at authoring. |
| 5. Visible to GAM? | T-023 projection of `practice_independence` on model rows. |
| 6. Modelling but no independent attempt? | Omit binding (R5). |
| 7. Independent performance without worked example? | Omit binding (R6). |

### 5.5 Stage 1 DLA capture gate (shape + closure)

Fail-closed checks (analogous to P02 / S78-WS-1):

| Code | Condition |
| ---- | --------- |
| `S78_WS2_MISSING_BINDING` | §5.1 conditions hold but no model row carries `practice_independence` |
| `S78_WS2_INVALID_SHAPE` | `practice_independence` on non-model row or malformed object |
| `S78_WS2_OPERAND_CLOSURE` | `attempt_operand_material_ids` references missing id or non-operand row type |
| `S78_WS2_FORBIDDEN_ON_ROW` | `practice_independence` on teaching/checklist rows |

**Not in Stage 1:** semantic same-operand detection from specification text.

---

## 6. DLA output-surface salience (§10 design)

**Conditional MP-1 closure invariant** (normative text for future `buildDlaSectionOutput`):

```text
When any required_materials[] row has material_type worked_example or modelling_note AND
this activity commissions independent procedural production on a task operand:
  • That model row MUST carry practice_independence.attempt_operand_material_ids listing
    every operand material_id the learner must independently work on.
  • Model specification MUST require a distinct operand instance from each listed id;
    MUST NOT include the attempt operand’s target solution or complete load-bearing reasoning.
  • Each listed operand specification MUST define a distinct near-transfer instance.
  • practice_independence MUST NOT appear on non-model rows.
When no independent attempt is commissioned, omit practice_independence on all rows.
```

**Pre-output checklist item** (append to existing 4-item list):

```text
5. MP-1 closure: for every model row paired with independent attempt, practice_independence
   lists all attempt operand ids; specifications state distinct instances; model spec forbids
   completing the attempt operand.
```

Target: **≤600 characters** net addition to §10 (T-009 lesson: salience without bloat).

---

## 7. GAM design (authoring)

### 7.1 Receives from DLA

| Field | GAM use |
| ----- | ------- |
| `practice_independence.attempt_operand_material_ids` | Key SP-06 / material-authoring block to named operand rows |
| Operand row `specification` | GAM reads but does not re-commission — fulfils as authored |
| Model row `specification` | Bounds model operand content |

### 7.2 Operand-aware SP-06 block (when binding projected)

Inject at material authoring surface (colocated with existing SP-06):

```text
S78-WS-2 (operand binding): This worked_example/modelling_note is paired with independent
attempt operand(s): {ids}. Author the model on a DISTINCT problem/case instance. MUST NOT
include those operands’ problem statements, data values, or target solutions. Bridge applies
the METHOD to the learner’s operand — do not pre-answer it.
```

### 7.3 Same method vs same operand

| Concept | GAM rule |
| ------- | -------- |
| **Same method** | Required — bridge and model steps demonstrate transferable procedure |
| **Same operand** | **Forbidden** between model and independent attempt when binding present |

### 7.4 Partial modelling

- **Process-only `modelling_note`** (A3 fresh pattern): may describe stages without solving the attempt operand — **PASS** if binding + specs honoured.
- **Full worked example on attempt operand** — **FAIL** at authoring intent (Stage 1 prompt; Stage 2 body check if needed).

### 7.5 Stage 1 GAM capture

**No new capture validator** for independence semantics in Stage 1 — defence matches pre–Stage 2 S78-WS-1 GAM scope (prompt + existing SP-06 FM codes). Optional Stage 2: reject model bodies containing operand specification echo — deferred.

---

## 8. Cross-layer responsibility contract

```text
Independent attempt required (learner_task + expected_output)
  → DLA commissions model row + operand row(s) + practice_independence on model row
  → [GATE: validateDlaPartialPageCapture S78-WS-2 shape/closure]
  → GAM authors model on operand A; operand B in separate material; Bridge → method
  → [Stage 2 optional: GAM capture semantic leak gate]
  → Assembly preserves materials in order
  → Renderer displays sequentially — no leakage injection
```

| Layer | Must do | Must not do |
| ----- | ------- | ----------- |
| **DLA** | Bind model→attempt operands; distinct-instance specification MUSTs | Emit independent attempt paired with model on same instance without binding |
| **DLA validator** | Fail-closed missing binding / id closure | Heuristic “similarity” rejection in Stage 1 |
| **GAM** | Honour binding at model authoring | Re-solve attempt operand in model body |
| **Assembly / renderer** | Transport fidelity | Fix model/practice contamination |
| **Archetype** | Document independent_performance semantics | Replace DLA authority |

---

## 9. Relationship to exhibits

### 9.1 Historical POST-S77 failure (70/100, Major 2)

**Becomes illegal at DLA capture (Stage 1)** when:

- A3 commissions `modelling_note` or `worked_example` + `scenario` task input + independent workspace production;
- DLA omits `practice_independence` **or** model specification fails distinct-instance MUST.

Even if copilot ignores specification prose, **missing binding** fails capture — closing the T-002 “still passes validation: YES” gap for the **structural** failure class (exact paired model + independent attempt without binding).

**Note:** A commission that **includes binding** but **violates** distinct-instance prose could still pass Stage 1 — regeneration testing determines if Stage 2 is needed.

### 9.2 Fresh 87/100 comparator (capability target)

| Activity | Pattern S78-WS-2 encodes |
| -------- | ------------------------- |
| **A2** | `A2-M2` worked_example on introductory instance; `A2-M1` task_card with **three distinct** problems → binding `{ "attempt_operand_material_ids": ["A2-M1"] }` |
| **A3** | `A3-M2` modelling_note (process); `A3-M1` scenario operand → binding ensures model does not solve `A3-M1` |

Design goal: make this separation **reliable**, not stochastic.

---

## 10. Historical / lost-guarantee

**No fail-closed guarantee ever existed** for general model/practice independence ([S78-T-002](S78-T-002-modelling-practice-independence-diagnostic.md) §16). SP-06/IFP-06 were prompt-only and narrow. This design **introduces** authoritative binding — not restoration.

---

## 11. Validation strategy (staged)

### Stage 1 — prompt-contract + structural capture

1. DLA §4 / §6 / §10 contract text + `practice_independence` shape.
2. DLA capture: binding presence, shape, operand id closure.
3. T-023 projection includes field on GAM copy path.
4. GAM operand-aware SP-06 injection.
5. Prompt-contract tests (§12).
6. Fresh regeneration + operator QA — compare Scaffolding & Independence / Independent Study subscores.

### Stage 2 — deferred semantic validation

Consider **only if** Stage 1 regeneration still produces:

- exact operand reuse with binding present; or
- model body echoing attempt operand specification values.

Candidate mechanisms (design placeholders — **not implemented**):

- Normalised specification token overlap threshold with near-transfer allowlist — **high false-positive risk**; needs domain-aware operand extraction.
- Explicit `model_operand_label` / `attempt_operand_label` in binding — **rejected for Stage 1** as unnecessary if specifications are authoritative.

**Recommendation:** defer Stage 2 until Gate evidence requires it.

---

## 12. Regression matrix (R1–R8)

| # | Scenario | Expected (Stage 1) |
| - | -------- | ------------------ |
| **R1** | Valid near transfer — model on instance A, attempt on comparable B | **PASS** capture + prompt tests |
| **R2** | Exact operand reuse — model fully solves same problem as independent attempt | **FAIL** DLA if binding omitted; binding present but same spec — **may PASS Stage 1** (Stage 2 candidate) |
| **R3** | Superficial restatement — different material ids, same operand in specs | **FAIL** ideally; Stage 1 may **PASS** — monitor in Gate |
| **R4** | Legitimate guided practice — partial scaffold on learner operand, no independent step | **PASS** — no `practice_independence` required |
| **R5** | Model only — no independent attempt | **PASS** — binding omitted |
| **R6** | Independent task without model | **PASS** — binding omitted |
| **R7** | One model, multiple practice problems in one `task_card` | **PASS** — single binding id referencing task_card row |
| **R8** | Fresh Lagrangian pattern — worked model on one optimisation instance, learner solves another | **PASS** — reference fixture in prompt tests (generic labels, not hard-coded Lagrangian coefficients in validator strings) |

**Test levels:** prompt-contract tests first (`tests/ld-dla-*`, `tests/ld-gam-*` or instructional-pattern tests); DLA capture fixture tests; manual Lagrangian Gate after implementation tranche.

---

## 13. Cross-disciplinary robustness (conceptual)

| Domain | Model (A) | Attempt (B) | Binding check |
| ------ | --------- | ------------- | ------------- |
| **Mathematics** | Solve optimisation with budget 100, goods x,y | Solve optimisation with budget 120, goods x,y | Distinct coefficients — same Lagrangian method |
| **Humanities** | Analyse rhetoric in **Extract 1** | Analyse rhetoric in **Extract 2** | Distinct sources — same analytic lens |
| **Programming** | Trace execution on **Sample A** | Trace execution on **Sample B** | Distinct inputs — same tracing procedure |

Design does **not** encode “different numbers” as the general rule — specifications carry domain content; binding carries **structural** obligation.

---

## 14. Rejected alternatives

| Alternative | Why rejected |
| ----------- | ------------ |
| **GAM-only SP-06 strengthening** | Does not fix earliest causal layer (T-002 **B**) |
| **Archetype-only guarantee** | Does not propagate to capture today (**D**) |
| **Specification magic string** (`DISTINCT_FROM:A3-M1`) without structured field | Weaker projection/diagnostics than `practice_independence` |
| **Stage 1 string/number inequality validator** | Rejects legitimate near transfer; brittle |
| **Renderer side-by-side hiding** | Compensates for bad authoring; violates non-ownership |
| **Lagrangian-specific prompt tuning** | Violates charter — architecture must generalise |
| **Universal operand ontology schema** | Over-engineered for T-010 scope |

---

## 15. Non-scope (preserved)

- S78-T-003 Check/revision architecture  
- Activity time display, blank lines, A3 math workspace form, shadow-price visuals  
- EP / Design Page changes (receive fixed commissions)

---

## 16. Recommended implementation decomposition

Implement in order — **each task authorised separately**:

| Task | Scope | Anticipated files |
| ---- | ----- | ----------------- |
| **S78-T-011** | DLA contract §4/§6/§10; `practice_independence` shape; Stage 1 capture gate; T-023 projection; prompt + capture tests | `lib/ld-dla-page-enrich-contract.js`, `lib/page-dla-enrich.js`, small helper module (mirror `dla-production-fulfilment.js`), `app.js`, `tests/ld-dla-*` |
| **S78-T-012** | GAM operand-aware SP-06 / contract salience when binding projected; prompt tests | `lib/instructional-pattern-prompt.js`, `lib/ld-gam-page-enrich-contract.js`, tests |
| **S78-T-013** | WS2 integration verification + fresh Lagrangian benchmark (operator QA); regression R1–R8 | sprint Gate record, test fixtures |

**Coupling note:** T-011 and T-012 are **tightly coupled for end-to-end reliability** but should land as **sequential commits** (DLA before GAM) following WS1 discipline. T-012 is **prompt-only** in Stage 1 — no GAM capture validator unless Stage 2 authorised.

**Contract version label (proposed):** `78-DLA-WS-2` (DLA); GAM contract patch note only unless version bump required.

**Gate:** Sprint 78 exit remains ≥ **90** uncapped — WS2 verification contributes; does not replace Final Gate.

---

## 17. Verification

| Criterion | Met? |
| --------- | ---- |
| D1–D8 resolved | Yes |
| Smallest representation chosen with evidence | Yes — row-level `practice_independence` |
| T-009 salience lesson applied | Yes — §10 + checklist |
| Stage 2 appropriately deferred | Yes |
| No implementation in T-010 | Yes |
| Sprint 78 remains OPEN | Yes |

---

## 18. References

- [S78-T-002](S78-T-002-modelling-practice-independence-diagnostic.md)  
- [S78-T-004](S78-T-004-learner-production-workspace-fulfilment-solution-design.md) — S78-WS-1 pattern  
- [S78-T-009](S78-T-009-dla-p02-provider-row-output-shape-salience-repair.md) — §10 salience pattern  
- [S78-T-008-candidate-1-fresh-dla-exhibit.json](S78-T-008-candidate-1-fresh-dla-exhibit.json)  
- `lib/ld-dla-page-enrich-contract.js` · `lib/instructional-pattern-prompt.js` · `lib/episode-plan-v1-archetype-grammar.js`

---

## 19. Files changed (this task)

| File | Change |
| ---- | ------ |
| `S78-T-010-modelling-practice-independence-solution-design.md` | Created (this record) |
| `STATUS.md` | T-010 complete; WS2 design ready |
| `PLAN.md` | T-010 section + programme phase |
| `SPRINT-78-START-HERE.md` | Immediate priority updated |

**Production / test / prompt / schema / validator / assembly / renderer:** **NO**

---

## 20. Exact recommended next task

**S78-T-011 — DLA model/practice independence commissioning contract** (implementation — **not authorised** until operator approves).

Alternative if operator prioritises Workstream 3: **S78-T-003 — Check/revision architecture diagnostic** remains queued and independent of WS2 implementation.

**STOP — do not implement repair without explicit authorisation.**
