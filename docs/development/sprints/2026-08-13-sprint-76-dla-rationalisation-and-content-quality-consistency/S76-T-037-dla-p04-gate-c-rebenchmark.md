# S76-T-037 — DLA-P04 Gate C rebenchmark

**Task:** S76-T-037  
**Status:** **Complete** (2026-08-13) — documentation / status only  
**Mode:** RECORD ONLY — no production code, prompt, schema, validator, test, fixture, runtime, or benchmark-artefact changes  
**Depends on:** [T-034](S76-T-034-dla-p04-evidence-guidance-rationalisation-solution-design.md) · [T-035](S76-T-035-dla-p04-evidence-guidance-rationalisation-implementation-plan.md) · [T-036](S76-T-036-dla-p04-evidence-guidance-rationalisation-implementation.md)  
**Pre-P04 implementation boundary:** `4de920e`  
**Contract under test:** `76-DLA-PARTIAL-6`

**Out of scope (not started from this artefact):** P05 · T-031 / T-033 live wording · diagnostics of new GAM findings · further generation · Settings

This artefact records operator-run Gate C evidence after P04 Option 2. It does **not** claim RECOVER. It does **not** mark Sprint 76 closed. It does **not** authorise the next implementation.

---

## 1. Purpose and isolation

P04’s authorised purpose was to **rationalise DLA evidence/self-audit guidance** while preserving already-established semantic responsibilities (Sprint 72 evidence product; P01/P02/P03 contracts; P01-R1 operand vs model/workspace/scaffold).

Gate C asks only: after that deletion/consolidation, did evidence-role semantics remain coherent on the two benchmark pages?

**Isolation — do not treat as P04 regressions unless direct evidence says so:**

- A3 missing operand / workspace substitution  
- A3 GAM learner-facing corruption  
- A4 missing worked-example fulfilment  
- T-031 operational suitability  
- T-033 LO-operation coverage  
- visual pre-emption  
- authentic-source richness limits  

T-035: scores need not rise. P05 dual-injection was **not** fixed before this run (Copy still injects contract+shape twice).

**Limitation:** exact runtime EP / DLA / GAM JSON for these runs is **not persisted in git**. Findings below are **operator-reported** inspection + QA scores. Live JSON was not altered by this task.

---

## 2. P04 size context (accepted T-036 measurements)

| Series | Before | After | Delta |
| ------ | -----: | ----: | ----: |
| Unique contract+shape | 24,103 | 17,973 | **−6,130** |
| Assembled ×2 | 48,206 | 35,946 | **−12,260** |
| Pack evidence extension | 3,051 | 242 | **−2,809** |
| `what_to_check` | 507 | 213 | **−294** |
| Unique instructional (A + pack evidence + what_to_check) | | | **−9,233** |

Unique after sits **+473** above T-035’s preferred 17,500 ceiling (justified: protected steps 1–3, compact P02 core, Sprint 72 source-use/provider-authoring, title/archetype still inside unique A). P05 not counted as P04 savings.

---

## 3. Roman Roads — DLA / GAM findings

Post-P04 Roman Roads DLA/GAM generation inspected.

| Activity | Evidence / material roles |
| -------- | ------------------------- |
| **A1 / A2** | `evidence_decision.required` **false**. Teaching, worked examples, tables, checklists were **not** treated as evidence providers. |
| **A3** | Scenario is task input **and** evidence provider. Comparison table / modelling note remain support/workspace. |
| **A4** | Evidence cases are task input and provider. Criteria text, sample output, decision table, template, checklist, transfer prompt remain non-provider support. |
| **A5** | Roman Britain scenario is task input/provider. Planning table / consolidation summary / checklist / transfer remain support. |

P01/P02 separation remained coherent. No systematic noun-driven evidence inflation was reported.

---

## 4. Roman Roads — QA

| Field | Operator-reported |
| ----- | ----------------- |
| Weighted score | **86 / 100 — Strong** |
| Critical / Major / Moderate production defects | **none** |

| Dimension | Score |
| --------- | ----: |
| Instructional Architecture | 91 |
| Constructive Alignment | 91 |
| Scaffolding & Independence | 92 |
| Feedback & Self-Regulation | 90 |
| Independent Study Effectiveness | 91 |
| Subject & Disciplinary Quality | 75 |
| Evidence & Content Richness | 69 |

**Main weakness:** historical evidence was predominantly short simulated cases rather than richer authentic primary/archaeological material.

**Minor visual:** Figure 4 partially pre-empts evaluative reasoning by supplying substantial strengths/limitations learners are meant to determine. Not a P04 evidence-role failure.

**P04 reading:** **positive signal.** Evidence semantics remained stable after substantial prompt deletion. Remaining weakness is disciplinary authenticity/richness, not evidence-role closure.

Prior Roman Roads Gate C (pre-T-028, operator-reported): **87**. This run **86**. Score need not rise for P04 PASS.

---

## 5. Lagrangian — DLA / GAM findings

Post-P04 Lagrangian EP/DLA/GAM generation inspected.

### 5.1 DLA — P04-relevant positives

| Activity | Finding |
| -------- | ------- |
| **A2** | Task input is explicit practice problems. P02 **false**. Worked example/checklist are not operands. |
| **A4** | Task input is optimisation scenario. `learner_task` requires full solve + interpretation. Previous feasibility-only T-033 failure **did not recur** in this generation. |
| **A5** | Task input is numerical shadow-price scenario. `evidence_decision` **true**. Scenario is provider. Decision table remains workspace/support. |

Evidence-provider richness and P01-true / P02-false procedural behaviour survived on A2/A5.

### 5.2 Known deferred (not P04; not implemented)

- **T-031** generated-operand operational suitability  
- **T-033** LO-operation coverage  

### 5.3 Residual / new (not diagnosed here)

**A3 P01-R1 residual**

- DLA sets `separate_inputs_required` true  
- `task_input_material_ids` contains `A3-M3`  
- `A3-M3` is an analysis_table / workspace  
- DLA `expected_output` refers to supplied Lagrangian functions  
- no separate practice Lagrangian operand was commissioned  
- GAM `A3-M3` contains a derivation table and a row labelled “Additional practice problem” but **no actual additional Lagrangian function**

This is the same **class** as T-026 (true + list workspace instead of operand). It is **not** treated as a P04 evidence-guidance regression.

**A3 GAM content-integrity (separate)**

- A3 worked derivation is visibly corrupted/mangled in learner-facing text  
- Do **not** assume the same root cause as A4 fulfilment  

**A4 GAM pedagogical-function fulfilment (new bounded class)**

- DLA commissions `A4-M2` as a `worked_example` with a full expert solution using an analogous case  
- GAM output titled “Analogous Solved Example” contains only a six-step procedural list  
- no analogous problem, equations, calculation, solution values, or worked reasoning  
- a material row can exist and be fulfilled **1:1 structurally** while failing the pedagogical function DLA commissioned  

**Not diagnosed or solved in this task.**

---

## 6. Lagrangian — QA

| Field | Operator-reported |
| ----- | ----------------- |
| Uncapped | **76 / 100** |
| Release | **69 / 100** |
| Band | Adequate after production cap |

Two **Major** production defects (trigger the 69 release cap):

1. Corrupted worked derivation in “Derive the Conditions” (A3).  
2. Missing worked content in “Analogous Solved Example” (A4).

| Dimension | Score |
| --------- | ----: |
| Instructional Architecture | 78 |
| Constructive Alignment | 76 |
| Scaffolding & Independence | 75 |
| Cognitive Design | 80 |
| Feedback & Self-Regulation | 78 |
| Subject & Disciplinary Quality | 68 |
| Technical Integrity | 55 |

**Strong:** A1, A2, A5.  
**Defective:** A3 (corrupted model); A4 (promised worked solution absent).

QA still identifies the overall recognition → construction → derivation → solution → interpretation sequence as a strongest feature.

Prior Lagrangian scores (operator-reported, JSON not in git): first Gate C **88** (P01 mixed); post-T-028 **84**. This run **76 / 69**. The drop tracks A3/A4 Majors in §5.3, not P02/evidence-role collapse (A2/A5 remained coherent).

---

## 7. Defect separation

| ID | Issue | Class | P04? |
| -- | ----- | ----- | ---- |
| A | A3 workspace selected where practice operands were needed | P01-R1 residual (same class as T-026) | **No** |
| B | T-031 operational suitability | Designed; unimplemented | **No** (deferred) |
| C | T-033 LO-operation coverage | Designed; unimplemented | **No** (deferred). This run: A4 full solve+interpretation **did** appear — T-033 still not implemented |
| D | GAM material pedagogical-function fulfilment | **New** — A4 worked_example structurally emitted, not actually worked | **No** — not diagnosed |
| E | GAM learner-facing content corruption | **New / separate** — A3 derivation mangling | **No** — do not assume same cause as D |
| F | P05 dual Copy contract+shape injection | Open; not implemented | **No** — isolation confirmed (count = 2) |
| G | Graphics/image lifecycle | Stale images survive Clear Run Data; unrelated image-generation availability limit during manual benchmark (graphics produced separately) | **No** — keep separate |

Roman Roads visual pre-emption (Figure 4) and authentic-source richness (Evidence & Content Richness 69) are **not** P04 evidence-role failures.

---

## 8. P04-specific causal interpretation

P04 deleted redundant self-audit (PRE-EMIT, per-activity consistency audit, INVALID/VALID, noun force-true) and compacted P02 + provider-authoring + source-use. The risk was evidence-role collapse, noun-driven inflation, or source-bound loss.

**Observed:**

- Roman Roads P02 false/true distinctions remained coherent (A1/A2 false; A3–A5 providers vs support).  
- Lagrangian A2 remains P01 true / P02 false.  
- Lagrangian A5 retains valid evidence-true behaviour with provider ≠ workspace.  
- Evidence-provider richness survives on activities that need it.  
- Source/evidence semantics did not collapse.  
- No systematic noun-driven evidence inflation returned.  
- No broad learner-facing coherence collapse **attributable to P04**. Roman Roads stayed Strong (86). Lagrangian defects are A3 operand/GAM and A4 GAM fulfilment.  
- Prompt is materially smaller (−6,130 unique; −9,233 unique instructional).

Lagrangian score drop is **not** evidence that P04 failed its authorised purpose.

P04 does **not** solve remaining Sprint 76 quality issues.

---

## 9. Gate C verdict

**DLA-P04 GATE C: PASS**

Roman Roads is a positive control after prompt deletion. Lagrangian evidence-role behaviour on A2/A5 held. Remaining Lagrangian Majors and the A3 P01 residual are recorded as **open, not-P04** issues.

Sprint 76 remains **OPEN**. **RECOVER** remains a hypothesis. P05, T-031, and T-033 remain unimplemented.

---

## 10. Next-session decision queue

**OPEN / NOT YET ORDERED.** First review this Gate C verdict, then decide ordering among A–F. G stays separate from P04.

| ID | Item | State |
| -- | ---- | ----- |
| **A** | P01-R1 residual — A3 workspace where practice operands were needed | OPEN |
| **B** | T-031 generated-operand operational suitability | Design complete; implementation deferred until after P04 |
| **C** | T-033 LO-operation coverage | Design complete; implementation deferred until after P04 |
| **D** | NEW — GAM material pedagogical-function fulfilment (A4 worked_example not actually worked) | OPEN — diagnostic needed; **not started** |
| **E** | NEW / SEPARATE — GAM learner-facing content corruption (A3 derivation mangling) | OPEN — do not assume same root cause as D; **not started** |
| **F** | P05 — remove duplicate Copy contract+shape injection | Not implemented |
| **G** | Graphics/image lifecycle (stale images after Clear Run Data; unrelated generation-availability limit) | Keep separate from P04 |

Do **not** start A–G from this artefact.

---

*End of S76-T-037. Documentation only. Sprint 76 remains OPEN.*
