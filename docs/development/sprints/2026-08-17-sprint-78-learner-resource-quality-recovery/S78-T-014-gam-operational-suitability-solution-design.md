# S78-T-014 — GAM operational suitability / operand validity solution design

**Task:** S78-T-014  
**Status:** **DESIGN COMPLETE** (2026-08-17)  
**Mode:** DESIGN ONLY — no implementation  
**Depends on:** S78-T-013 Candidate 1 diagnostic, S78-T-012, S78-T-011, S77-T-021, S76-T-031/T-048  
**Out of scope:** code/prompt/schema/validator/test changes, regeneration, T-013 execution, T-003 diagnostic

---

## 1. Design objective

Preserve proven WS2 independence (`MODEL ≠ ATTEMPT`) and add the smallest additional guarantee so generated particulars are **fit for the commissioned operation**.

Candidate 1 establishes:

- WS2 semantic separation passes (A2/A3/A4 distinct operands).
- A4-M2 independent operand is invalid.
- A4-M1 worked model is partially fulfilled vs "complete worked solution".

So Workstream 2 needs a second invariant:

```text
GENERATED PARTICULARS / OPERANDS → OPERATIONALLY SUITABLE FOR COMMISSIONED PURPOSE
```

---

## 2. Canonical invariant (proposed)

> When GAM generates load-bearing particulars for a commissioned learner action or worked-model result, those particulars must be **mutually consistent** and **sufficient** for the commissioned action/result to be completed as specified, within the intended operation scope.

This is intentionally:

- **domain-general** (not Lagrangian-specific);
- **commission-relative** (depends on learner_task, expected_output, purpose, specification);
- **Stage-1 prompt-contract** (not deterministic semantic parsing).

---

## 3. Concept definitions

### 3.1 Internal consistency

Particulars do not contradict each other in a way that makes the commissioned action impossible.

### 3.2 Sufficiency

Particulars include enough information/relations to carry out the commissioned action/result at the required level.

### 3.3 Task answerability

Given commissioned task materials plus allowed method/scope, the learner can produce the expected output.

### 3.4 Model completeness

If a model row is commissioned as complete (or equivalent), the authored body reaches the promised result/process, not only a partial precursor.

### 3.5 Relationship

Task answerability is the learner-facing outcome; internal consistency + sufficiency are core conditions; model completeness applies to worked/model rows. These should remain distinct concepts under one suitability umbrella.

---

## 4. Open-ended and deliberate ambiguity handling

The invariant is **relative to commission**:

- If commission asks for open interpretation/competing arguments, non-uniqueness is valid.
- If commission asks learner to identify missing information or diagnose insufficiency, incomplete particulars can be intentionally correct.

So suitability is **not** "always unique answer" or "always complete dataset." It is "fit for what this row/task asks learners to do."

---

## 5. Ownership boundary

### 5.1 Canonical owner

- **DLA owns**: commissioned purpose, learner operation, expected output, scope bounds.
- **GAM owns**: instantiation of concrete particulars that satisfy those commissions.

### 5.2 DLA metadata change decision

**No new DLA schema/metadata needed in Stage 1.**

Existing fields are sufficient:

- `learner_task`
- `expected_output`
- `required_materials[].purpose`
- `required_materials[].specification`
- `required_materials[].material_type`
- existing archetype cues where present

Rationale: Candidate 1 failure is not missing structure; it is GAM fulfilment reliability/salience at authoring surface.

---

## 6. Existing Case 1 guarantee and evolution

### 6.1 Current Case 1 (S77-T-021)

Live `buildGamV2CopyMaterialAuthoringBrief` already includes:

- enough coherent information for operation;
- do not emit contradictory/underdetermined particulars when identifying/solving result.

### 6.2 Why insufficient in Candidate 1

Evidence indicates not missing semantics entirely, but **remote salience** in a long global brief; no local per-material reinforcement where invalid operand was authored.

### 6.3 Evolution decision

Do not invent a parallel contract. Reuse and operationalize existing Case 1 semantics with **authoring-local salience**.

---

## 7. Authoring-surface design (Stage 1, prompt-contract only)

### 7.1 Placement

Adopt the same pattern used successfully in T-009 and T-012:

- compact auto-applied block adjacent to authoritative DLA commission JSON in GAM prompt assembly path.

### 7.2 Trigger

Apply when commission implies load-bearing result execution, including:

1. learner action requires derive/solve/calculate/determine/debug/compute/verify class output from supplied particulars; or
2. model row is commissioned as complete worked solution/result; or
3. operand row is the load-bearing input to such commissioned action.

This is not a blanket rule for purely explanatory/display rows.

### 7.3 Information available

From authoritative commission already injected:

- activity `learner_task`
- `expected_output`
- `required_materials[].material_id`
- `material_type`
- `purpose`
- `specification`
- existing `practice_independence` (if present)
- existing `response_fulfilment` (for workspace coupling context)

### 7.4 Normative semantics (compact)

Proposed compact semantics to appear near affected rows:

- particulars must support commissioned operation/result as written;
- do not emit contradictory conditions that prevent completion;
- do not omit required information/relations for commissioned completion;
- if row is commissioned as complete worked model, body must reach promised completion;
- if task is intentionally open-ended/ambiguity-diagnostic, preserve that intended openness.

No Lagrangian-specific wording.

---

## 8. Trigger design details

Avoid verb-only heuristics. Use commission context:

- learner_task + expected_output intent,
- purpose/specification on specific rows,
- whether row is model/operand/workspace,
- whether completion/result is explicitly commissioned.

This keeps trigger broad enough for cross-disciplinary fit but bounded away from non-load-bearing explanatory content.

---

## 9. Relationship to WS1 / WS2 / P02

### 9.1 WS1

WS1 remains:

```text
PRODUCTION → OPERATIONAL RESPONSE SURFACE
```

Suitability does not replace workspace binding; it composes with it.

### 9.2 WS2

WS2 remains:

```text
MODEL OPERAND ≠ INDEPENDENT ATTEMPT OPERAND
```

Suitability adds:

```text
VALID(MODEL PARTICULARS) ∧ VALID(ATTEMPT PARTICULARS)
```

Both required.

### 9.3 P02

P02 (evidence/provider closure) is separate. Intersections may occur in evidence-based tasks, but contracts remain distinct and should not be merged.

---

## 10. GAM capture-validation strategy

### 10.1 Stage 1

**Prompt-contract + regeneration evidence only.**

No deterministic semantic validator is currently safe/generic without heavy domain-specific parsing.

### 10.2 Deterministic check decision

Current deterministic checks are structural/shape plus math-markup integrity, not semantic executability. Keep this boundary.

### 10.3 Future revisit threshold

Revisit Stage 2 only if post-salience fresh runs still show repeated suitability failures despite clear commissions and local authoring instruction.

---

## 11. Coverage of Candidate 1 classes

### 11.1 A4-M2 class (invalid learner operand)

Covered by consistency+sufficiency + answerability semantics.

### 11.2 A4-M1 class (incomplete worked fulfilment)

Covered by explicit model-completeness semantics for rows commissioned as complete worked solution.

---

## 12. Cross-disciplinary examples (design checks)

### Mathematics

If commission requests determinate calculation/solution, givens must permit that completion.

### Data/statistics

If commission requests metric comparison/inference, required variables/observations and coherence must be present.

### Programming

If commission requests implementation/debug against supplied conditions, specification/test context must be sufficient and non-contradictory for intended task.

### Humanities (open interpretation)

If commission is open interpretation, multiple defensible answers are valid; non-uniqueness is not failure.

### Deliberate insufficiency

If task asks learner to identify what information is missing, incomplete particulars are intentionally valid.

---

## 13. Regression design (Stage 1 prompt-contract expectations)

R1 valid determinate practice operand → PASS  
R2 contradictory particulars preventing commissioned result → FAIL authoring expectation  
R3 insufficient particulars for commissioned determinate result → FAIL authoring expectation  
R4 complete worked model reaches promised result → PASS  
R5 complete worked model stops short of promised result → FAIL authoring expectation  
R6 open-ended multi-answer task → PASS  
R7 deliberate ambiguity/insufficiency task → PASS  
R8 WS2 distinct operands + both suitable → PASS  
R9 WS1 workspace coexistence preserved → PASS  
R10 Lagrangian-shaped Candidate 1 class explicitly forbidden by local suitability block without domain-specific rules → PASS (contract test)

All above are prompt-contract and regeneration-verification criteria, not deterministic runtime semantic checks.

---

## 14. Prompt-size strategy

Prefer one compact conditional block plus small cross-reference, reusing Case 1 language.

Target bounded delta:

- WS2-style local block: roughly +600 to +1100 chars when triggered
- no large new global prose section
- avoid duplicating full SP content

If size rises materially, prioritize replacing/repointing existing lines over adding parallel sections.

---

## 15. T-013 continuation strategy

Use this sequence:

1. Preserve Candidate 1 as WS2-positive / validity-negative evidence.
2. Implement bounded suitability salience repair (separate task).
3. Resume fresh T-013 generation.
4. Verify both WS2 and suitability invariants in same run.
5. Then run clean QA.

Do not re-prove already-established facts beyond needed regression checks.

---

## 16. Proposed implementation decomposition (for later authorisation)

Single bounded implementation task is sufficient:

> **S78-T-015 — GAM operational suitability authoring salience implementation**

Scope (anticipated):

- extend/reposition existing Case 1 semantics at local authoring surface in GAM prompt assembly;
- add focused prompt-contract tests for R1–R10 expectations;
- no schema/validator/renderer/assembly changes.

Then return to T-013 fresh regeneration verification.

---

## 17. Relationship to T-003 and deferred issues

- Preserve T-003 observation on compound production + unified review, but no T-003 work in this task.
- Keep minor UI/presentation issues deferred per Sprint 78 boundaries.

---

## 18. Verification and boundaries

This task is design-only. No production behavior is changed by this document.

---

## 19. Files changed (this task)

- `S78-T-014-gam-operational-suitability-solution-design.md` (new)
- sprint status docs updated to reflect T-014 design completion and T-013/T-015 sequencing

**Production/test/prompt/schema/validator/assembly/renderer changes:** **NO**

---

## 20. Exact recommended next task

> **S78-T-015 — GAM operational suitability authoring salience implementation (bounded), then resume S78-T-013 fresh-generation verification.**

Do not regenerate Lagrangian in T-014.
