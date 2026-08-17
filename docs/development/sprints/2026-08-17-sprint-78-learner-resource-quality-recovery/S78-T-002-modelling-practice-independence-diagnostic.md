# S78-T-002 — Modelling / practice independence diagnostic

**Task:** S78-T-002  
**Status:** **COMPLETE** (2026-08-17)  
**Mode:** DIAGNOSTIC ONLY — no implementation  
**Workstream:** 2 — Modelling / practice independence  
**Historical exhibit:** [POST-S77-lagrangian-qa-baseline-2026-08-14.md](../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/POST-S77-lagrangian-qa-baseline-2026-08-14.md) Major 2  
**Fresh comparator:** S78-T-008 fresh Lagrangian QA — operator-reported **87/100**, 0 Critical, 0 Major

---

## Executive summary

The repository **can** produce good model→practice independence (Roman Roads Scaffolding **92**; fresh Lagrangian **88** / Independent Study **91**) but **does not architecturally guarantee** it.

The historical POST-S77 failure is **exact same optimisation problem instance** modelled with a **complete worked solution** immediately before the learner is asked to solve that **same** problem independently — not a superficial string-difference issue.

**Earliest proven causal layer:** **DLA commissioning** commissions model and practice **roles** without a fail-closed **problem-instance independence** invariant between them.

**Primary classification:** **B — Independence commissioned ambiguously**  
**Secondary:** **G — Existing guarantee present but ineffective/non-salient** (GAM SP-06/SP-07 MP-1; DLA IFP-06 anti-spoiler — prompt-only, narrow scope)

**Canonical repair owner (design only):** **DLA commissioning** (paired model/practice binding) **+ GAM authoring contract** (structurally salient at material generation).

---

## 1. Exact historical learner-facing failure

**Source:** POST-S77 Lagrangian QA baseline (2026-08-14), uncapped **70/100**, Major 2.

> Activity 3 — independent practice spoiled. A **complete worked solution** to the **identical** constrained-optimisation problem is provided immediately before learners are asked to solve it. Intended independent problem solving is removed.

**Failure type (evidenced):** **Same problem instance + full solution disclosure** — not merely similar wording or shared method family.

**Preserved separately:** Activity 3 **moderate** workspace-form finding (Markdown-like scaffolding in free-text fields) — **out of scope** for this diagnostic per charter.

**Note:** Exact EP/DLA/GAM JSON for the 70/100 package is **not in git**. Learner-facing QA finding is the authoritative historical exhibit.

---

## 2. Model content / problem (historical exhibit)

| Dimension | Historical Activity 3 (inferred from QA + sprint exhibits) |
| --------- | ---------------------------------------------------------- |
| **What is demonstrated** | Full constrained optimisation solution path: Lagrangian or FOC derivation through algebraic solution to optimal values |
| **Problem/case used** | A specific utility-maximisation (or equivalent) constrained optimisation instance |
| **Reasoning exposed** | Complete expert execution — all intermediate and final numerical/logical steps |
| **Answer/conclusion revealed** | **Yes — full optimal allocation and multiplier values** |
| **Materials (typical commission)** | `worked_example` and/or `modelling_note` carrying the model; often adjacent to `scenario`, `task_card`, or workspace bound to the **same** problem statement |

---

## 3. Practice content / problem (historical exhibit)

| Dimension | Historical Activity 3 |
| --------- | --------------------- |
| **Learner ask** | Derive FOCs, solve, verify — independent performance on the optimisation problem |
| **Problem/case used** | **The same instance** as the preceding worked model |
| **Reasoning required** | Nominal: full independent derivation and solution; **actual:** reproduction of already-visible reasoning |
| **Output** | Completed optimisation workspace / written solution |
| **Materials** | Task operand (`scenario` / `task_card`) + learner workspace (`analysis_table` / `template` / `prompt_set`) |

---

## 4. Semantic independence assessment

| Criterion | Assessment |
| --------- | ---------- |
| Different problem instance | **NO** — identical instance (QA explicit) |
| Different numerics only | N/A — same instance |
| Method continuity with problem independence | **Violated** — method shown **on the target problem** with full answer |
| Answer already visible | **YES** |
| Reasoning path already completed | **YES** |
| Genuine independent reasoning required | **NO** — attempt is structurally spoiled |

Desired invariant (**method continuity + genuinely independent attempt**) was **not** met.

---

## 5. Archetype / planning guarantee

**Apply / Analyse archetype sequences** (`lib/learner-renderer-vnext/archetype-canonical-binding.js`, `lib/episode-plan-v1-archetype-grammar.js`) prescribe beats such as:

```text
worked_thinking → guided_practice → independent_performance → verification
```

**What this guarantees:** Sequential **instructional functions** and suggested **material types** per beat (e.g. `worked_example` on `worked_thinking`; `task_card` on `independent_performance`).

**What it does NOT guarantee:**

- Distinct underlying problem instances between model and practice materials  
- Non-disclosure of the practice problem’s solution in the model material  
- Cross-material identity binding at Episode Plan or DLA layer  

**Verdict:** **Archetype prescribes MODEL → ATTEMPT sequencing only.** Independence semantics **do not propagate** into DLA/GAM contracts as enforceable invariants → supports secondary classification **D** (planning intention without downstream propagation), but **earliest proven gap is still DLA commissioning (B)**.

---

## 6. DLA commission

**Inspected surfaces:** `lib/ld-dla-page-enrich-contract.js` (§4 production, §5 task inputs, §6 commissioning, §9 workbook overlay), `lib/ld-self-directed-rhetoric.js`, legacy pack IFP-06 / DLA-WB rows.

### What DLA does commission

| Mechanism | Independence relevance |
| --------- | ---------------------- |
| Separate material **roles** | `worked_example` / `modelling_note` (model) vs `scenario` / `task_card` (operand) vs workspace rows |
| IFP-06 ANTI-SPOILER | `sample_output not copy target`; consolidation memo not pre-written — **narrow** |
| DLA-WB-23 (Apply) | `worked_example` before independent practice — **sequencing only** |
| DLA-WB-08 | `worked_example` + `sample_output`; study-before-practice — **sequencing only** |
| G4 (Analyse) | Worked analytic pass before `analysis_table`; partial exemplar row — **not** full-problem independence |
| Evidence P02 analogous case | Distinct analogous case for **evidence providers only** — not general model/practice |
| INF-05 | Exemplar models reasoning not single answer — **population inference**, weak |

### What DLA does NOT commission

- Explicit **“practice operand must be a distinct problem instance from the model material”** invariant  
- Paired metadata linking model row ↔ practice operand row with independence obligation  
- Fail-closed capture validation for model/practice problem identity  

### Can DLA legally commission the historical failure?

**YES.** Nothing in `validateDlaPartialPageCapture` / `validateDlaEnrichedPage` rejects:

- `worked_example` specification describing the **same** optimisation problem the learner must solve  
- Full-solution modelling on that problem alongside a `scenario`/`task_card` task input referencing identical constraints/objective  

**Verdict:** **B — roles exist; independence not guaranteed.**

---

## 7. GAM realisation

**Inspected surfaces:** `lib/instructional-pattern-prompt.js` (SP-06, SP-07), `lib/ld-gam-page-enrich-contract.js`, `lib/gam-output-format.js`, `lib/page-gam-enrich.js` validators.

### Authoritative GAM prompt guarantees (prompt-only)

| Pattern | Rule |
| ------- | ---- |
| **SP-06 / WE-SP-01** | Worked example uses model item **distinct from learner deliverable**; **Bridge** applies same **method**, not answer (MP-1, MP-3); FM-05 if model ends without bridge |
| **SP-07 / SO-SP-01** | Sample output **parallel but not identical** when independent production required (MP-1) |
| **Evidence delayed disclosure** | Pre-task materials must not state target inference — **evidence-context** |

### GAM validation

`validateGamPartialPageCapture` / `validateGamEnrichedPage` enforce:

- Field preservation, material coverage, evidence shape, **S78-WS-1 blank cells**  
- **No** model/practice problem-identity or answer-leakage check between paired materials  

### Can GAM collapse correctly commissioned independence?

**YES**, when DLA specifications do not bind distinct instances — GAM is instructed to fulfil `required_materials[].specification` and may author a **complete worked solution on the practice problem** because nothing structurally forbids it at capture time.

**Verdict:** **G — SP-06/07 exist but are non-salient for within-activity math worked_example → same scenario flows; not validator-enforced.**

---

## 8. Assembly behaviour

**Inspected:** Standard page merge preserves `activities[].materials[]` order and bodies; no model/practice rewriting.

**Verdict:** Assembly **preserves** authored relationship; does **not** cause contamination. **Not E.**

---

## 9. Renderer behaviour

**Inspected:** `lib/learner-renderer-vnext/` renders material bodies in activity order; worked examples and task materials display sequentially.

**Verdict:** Renderer **surfaces** what GAM authored; does **not** inject answers. **Not F.**

---

## 10. Existing relevant contract / guarantee

| Guarantee | Layer | Scope | Enforced? |
| --------- | ----- | ----- | --------- |
| SP-06 MP-1 / FM-05 | GAM instruction pattern | `worked_example` distinct from deliverable | Prompt only |
| SP-07 MP-1 | GAM instruction pattern | `sample_output` not pre-answered | Prompt only |
| IFP-06 | DLA workbook overlay | `sample_output` not copy target; consolidation anti-spoiler | Prompt only |
| DLA-WB-23 / WB-08 | DLA overlay | Model before practice | Sequencing only |
| Evidence analogous case | DLA §7/§8 | Evidence providers | Validator (P02) — **different concern** |
| Archetype beat grammar | EP / renderer binding | Function sequence | Planning only |

**No fail-closed cross-material model/practice independence validator exists.**

---

## 11. Validation / enforcement status

| Check | Present? |
| ----- | -------- |
| DLA capture rejects same-problem model+practice | **NO** |
| GAM capture rejects full solution before identical practice | **NO** |
| SP-06/07 automated on paste | **NO** |
| QA / human benchmark | **YES** (detected Major 2) |

---

## 12. Can historical failure still pass current validation? — **YES**

After S78-T-005/T-007/T-009, validators still do **not** inspect model/practice problem-instance independence. A POST-S77-equivalent commission + GAM bodies would **pass capture** today.

---

## 13. Fresh 87-run positive comparator (operator-reported)

| Measure | Value |
| ------- | ----- |
| Overall | **87/100**, 0 Critical, 0 Major |
| Scaffolding & Independence | **88** |
| Independent Study Effectiveness | **91** |

**Observed structure (operator + S78-T-008 DLA exhibit pattern):**

| Activity | Model | Practice | Independence |
| -------- | ----- | -------- | -------------- |
| **A2** (Apply) | `A2-M2` `worked_example` — Lagrangian construction on an **introductory example** | `A2-M1` `task_card` — **three separate** construction problems | **Yes** — distinct instances |
| **A3** (Analyse/Apply) | `A3-M2` `modelling_note` — process walkthrough (method stages) | `A3-M1` `scenario` — utility-maximisation **operand**; `A3-M3` workspace | **Likely yes** — process model vs problem operand (not full solution disclosure on operand) |

Preserved DLA exhibit: [S78-T-008-candidate-1-fresh-dla-exhibit.json](S78-T-008-candidate-1-fresh-dla-exhibit.json) (rejected at A4 evidence — commission structure for A2/A3 still informative).

---

## 14. Why fresh run succeeds

1. **Cross-material / cross-activity separation:** Modelled example on **one** problem configuration; learner practice on **different** problems or operands.  
2. **Material-role discipline:** `modelling_note` / `worked_example` used as **method** surfaces; `scenario` / `task_card` as **operands**.  
3. **Copilot stochastic compliance** with SP-06 bridge / IFP-06 / plausible specifications — **not** deterministic enforcement.

---

## 15. Does architecture guarantee fresh-run success? — **NO**

Good outcomes are **capability evidence** (also Roman Roads Scaffolding **92**, S76 Gate C). No capture validator or DLA output invariant prevents recurrence of POST-S77 Major 2.

---

## 16. Historical / regression evidence

| Question | Finding |
| -------- | ------- |
| Guarantee removed recently? | **No evidence** — model/practice independence was never fail-closed |
| Wording weakened? | P04 rationalisation removed redundant **evidence** audits; did not remove SP-06 |
| Prompt growth reduced salience? | Possible contributor; SP-06 remains in GAM pattern injection but competes with ~40k DLA Copy path |
| Weakness predates Sprint 77? | **Yes** — SP-06/IFP-06 predate canonical assembler; never had capture enforcement |
| Regression? | **No** — intermittent good runs (Gate D, Roman Roads, fresh 87) vs bad (POST-S77 70) |

**Tension note:** [S77-T-017 Gate D](S77-T-017-dla-canonical-architecture-lagrangian-gate-d.md) reported DLA A3 “complete FOC worked example; **independent** … problem” at **commission** level on a **5-activity** run, while POST-S77 QA judged **learner-facing** identity on the **Friday 4-activity package**. Supports **C** as a **secondary** mechanism on specific runs (GAM may still fully solve the commissioned practice problem in the model material even when rows are separate).

---

## 17. Earliest proven causal layer

**DLA commissioning (Workstream 2 owner)** — fails to require **problem-instance independence** between model materials and practice operands in the same activity (or explicitly paired rows).

GAM SP-06 is a **downstream, prompt-only** partial mitigation that does not close the gap deterministically.

---

## 18. Root-cause classification

| Code | Applicability |
| ---- | ------------- |
| **A** | Partial — roles are commissioned, not wholly absent |
| **B** | **PRIMARY** — distinct roles; independence not guaranteed |
| **C** | Secondary on some runs — GAM may collapse if specs allow same instance |
| **D** | Secondary — archetype sequence does not propagate to DLA/GAM |
| **E/F** | Not evidenced |
| **G** | **SECONDARY** — SP-06/IFP-06 prompt guarantees too narrow / non-salient |
| **H** | **NO** — enforceable guarantee not proven |
| **I** | — |

---

## 19. Canonical repair owner (design only)

**Joint: DLA commissioning + GAM paired authoring**

- **DLA** must express a **paired invariant** when an activity (or beat group) commissions both a model surface (`worked_example` / `modelling_note`) and an independent-practice operand (`scenario` / `task_card` / workspace-bound production): practice operand **must be an isomorphic but distinct problem instance**; model **must not** disclose the practice instance’s final answer or complete reasoning path.  
- **GAM** must receive enough **structural salience** (commission flags or specification pattern) to author model on **analogous instance A** and reserve **instance B** for learner attempt — SP-06 bridge at material-authoring surface.  
- **Optional later:** fail-closed capture check (specification keywords / explicit `practice_independence` metadata) — **not** part of this diagnostic.

---

## 20. Smallest repair direction — DESIGN ONLY

1. **DLA §6/§10 conditional row invariant** (mirror S78-T-009 P02 pattern): when `worked_example`/`modelling_note` and independent-practice operand coexist on an activity, specification **MUST** state distinct-instance requirement; model specification **MUST NOT** include complete solution to the practice operand.  
2. **Compact pre-output checklist item** in DLA §10: verify model/practice instance independence before emit.  
3. **GAM material-authoring block** colocated with SP-06: when fulfilling a model row paired to a task-input operand in the same activity, **forbid** using the operand’s exact problem statement/ numerics in the worked body.  
4. **Defer** cross-material cryptographic/fingerprint validation until after prompt-contract repair proves insufficient.

Preserve: **same method / intended transfer + genuinely independent reasoning** — not arbitrary topic change.

---

## 21. T-003 preservation

Fresh QA: A4 guided review strong; A2 Check weak; F&S not distributed — **record only** for S78-T-003. Not analysed here.

---

## 22. Files changed

| File | Change |
| ---- | ------ |
| `S78-T-002-modelling-practice-independence-diagnostic.md` | Completed (this record) |
| `STATUS.md` | T-002 complete; T-008/WS1 closed; fresh benchmark recorded |
| `PLAN.md` | Programme phase + T-002 section |
| `SPRINT-78-START-HERE.md` | Immediate priority → T-003 |
| `S78-T-008-workstream-1-integration-verification.md` | WS1 closed + 87 benchmark |

**Production / test / prompt / schema / validator / assembly / renderer:** **NO**

---

## 23. Exact recommended next task

**S78-T-010 — Modelling/practice independence solution design** (bounded; DLA paired invariant + GAM SP-06 salience; design only unless operator authorises implementation).

Alternative if operator prefers Workstream 3 first: **S78-T-003 — Check/revision architecture diagnostic** (already queued).

**Do not implement repair in T-002.**
