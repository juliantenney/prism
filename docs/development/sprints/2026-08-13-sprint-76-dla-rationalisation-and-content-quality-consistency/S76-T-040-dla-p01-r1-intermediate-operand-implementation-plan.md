# S76-T-040 — DLA-P01-R1 intermediate-operand salience implementation plan

**Task:** S76-T-040  
**Status:** **Planning complete** (2026-08-14) — **no implementation authorised**  
**Mode:** IMPLEMENTATION PLANNING ONLY — no production code, prompt, schema, validator, test, fixture, EP, DLA, GAM, pack, or Settings changes  
**Depends on (accepted):** [T-039](S76-T-039-dla-p01-r1-intermediate-operand-solution-design.md) (Option 2) · [T-038](S76-T-038-dla-p01-r1-a3-operand-workspace-diagnostic.md) · [T-028](S76-T-028-dla-p01-residual-operand-closure-implementation.md) · [T-037](S76-T-037-dla-p04-gate-c-rebenchmark.md)  
**Owning surface:** `lib/ld-dla-page-enrich-contract.js` commissioning-order **step 2** only

**IMPLEMENTATION PLAN ONLY**  
**NO IMPLEMENTATION AUTHORISED**

---

## 0. Accepted T-039 design

Operand = what **this activity’s operation** acts upon: conventional problem/case/dataset/source **or** an already-formed object/state, when the **system must supply** it and it is not already fully contained in `learner_task`. Workspace = place/structure to record work. Learner-owned prior-activity product is **not** a new GAM commission. Absence test **unchanged**. A3: `true` + commission supplied L row + list only that id; WE/table/checklist unlisted; P02 false. No Lagrangian-specific live wording. DLA-WB unchanged. Schema/validator/GAM unchanged.

---

## 1. Exact current Step 2 (live `76-DLA-PARTIAL-6`)

Measured 2026-08-14 from `buildDlaPageEnrichContractBlock()` (1,219 characters):

> 2) Decide whether separate task operands/stimuli are required. A task input is the particular content upon which the learner performs the required operation (solve, calculate, classify, diagnose, analyse, compare, interpret, evaluate, transform, or construct from supplied particulars) when not already fully contained in learner_task. Set task_material_decision. If separate_inputs_required is true, commission those operands in required_materials and list only their material_ids in task_input_material_ids. If false, ids must be empty; teaching/model/workspace/scaffold may still be commissioned. Roles (not type-absolute): operand/stimulus = problem, case, data, values, source, passage, object or other particulars acted upon; model = shows how; workspace = place/structure to record or manipulate, including blank tables; scaffold = prompts, supports or checks. Used during the activity ≠ automatically a task input. Absence test: if removing it leaves the learner without the particulars needed to operate, it is a task input; if they lose only an example of how, a place to write, guidance, or a checklist, it is not. Listing a task input does not set evidence_decision.required; P01 and P02 remain independent.

**Do not change** steps 1 or 3. Canonical shape JSON unchanged. Payload bullets unchanged.

---

## 2. Proposed wording (candidate — not applied)

**Mechanical change:** insert three sentences **after** the role list (`scaffold = prompts, supports or checks.`) and **before** `Used during the activity ≠ automatically a task input.`

**Insert (264 unique characters, including the leading space):**

>  An operand may also be an already-formed object or state this activity’s operation acts on when the system must supply it. Recording work in a workspace does not make the workspace the operand. The learner’s own prior-activity product is not a new GAM commission.

`learner_task` “not already fully contained” remains in the existing first sentence (not repeated). Apostrophe in `activity’s` / `learner’s` matches live step 4 (`activity’s`).

### Conceptual before → after (role-list junction only)

**Before:**

`… scaffold = prompts, supports or checks. Used during the activity ≠ automatically a task input. …`

**After:**

`… scaffold = prompts, supports or checks. An operand may also be an already-formed object or state this activity’s operation acts on when the system must supply it. Recording work in a workspace does not make the workspace the operand. The learner’s own prior-activity product is not a new GAM commission. Used during the activity ≠ automatically a task input. …`

### Full candidate Step 2 (for implementer copy)

> 2) Decide whether separate task operands/stimuli are required. A task input is the particular content upon which the learner performs the required operation (solve, calculate, classify, diagnose, analyse, compare, interpret, evaluate, transform, or construct from supplied particulars) when not already fully contained in learner_task. Set task_material_decision. If separate_inputs_required is true, commission those operands in required_materials and list only their material_ids in task_input_material_ids. If false, ids must be empty; teaching/model/workspace/scaffold may still be commissioned. Roles (not type-absolute): operand/stimulus = problem, case, data, values, source, passage, object or other particulars acted upon; model = shows how; workspace = place/structure to record or manipulate, including blank tables; scaffold = prompts, supports or checks. An operand may also be an already-formed object or state this activity’s operation acts on when the system must supply it. Recording work in a workspace does not make the workspace the operand. The learner’s own prior-activity product is not a new GAM commission. Used during the activity ≠ automatically a task input. Absence test: if removing it leaves the learner without the particulars needed to operate, it is a task input; if they lose only an example of how, a place to write, guidance, or a checklist, it is not. Listing a task input does not set evidence_decision.required; P01 and P02 remain independent.

Implementer may tighten punctuation only; do not add noun taxonomy, subject examples, a new numbered step, a second canonical JSON, or an audit.

---

## 3. Prompt cost

Measured **now** (same basis as T-036):

| Series | Current |
| ------ | ------: |
| Contract block | 11,275 |
| Shape snippet | 6,698 |
| **A unique** | **17,973** |
| **B assembled ×2** | **35,946** |
| Step 2 only | 1,219 |

| Candidate | Unique | Assembled ×2 |
| --------- | -----: | -----------: |
| Insert | **264** | **528** |
| Unique after (est.) | **18,237** | **36,474** |
| T-039 target | 180–280 | 360–560 |
| T-039 ceiling | 400 | 800 |

**Within target.** If live edit exceeds 400 unique, tighten before shipping; do not pad. Do not count P05.

---

## 4. Contract version / cache pin

**BUMP.**

T-023 / T-024 / T-028 / T-036: DLA prompt-contract edits bump `CONTRACT_VERSION` without schema change.

| Item | Current | Proposed |
| ---- | ------- | -------- |
| `CONTRACT_VERSION` | `76-DLA-PARTIAL-6` | **`76-DLA-PARTIAL-7`** |
| `schema_version` | `2.0.0` | unchanged |
| `index.html` contract pin | `lib/ld-dla-page-enrich-contract.js?v=20260813-s76-dla-p04-evidence` | e.g. **`?v=20260814-s76-dla-p01-r1-intermediate`** |
| `page-dla-enrich.js` pin | `?v=20260813-s76-dla-p01-p02-p03` | **DO NOT TOUCH** |

Tests that equal `76-DLA-PARTIAL-6` must update (§5).

---

## 5. Test plan — presence

Update `tests/ld-dla-evidence-decision-consistency-prompt.test.js` (keep existing P01-R1 / P04 / step 1+3 tests).

**Add** `S76 P01-R1: intermediate object/state may be a system-supplied task input` asserting `buildDlaPageEnrichContractBlock()` matches:

- `/already-formed object or state/`  
- `/this activity.s operation acts on/` (allow curly apostrophe)  
- `/when the system must supply it/`  
- `/Recording work in a workspace does not make the workspace the operand/`  
- `/prior-activity product is not a new GAM commission/`  
- retain `/P01 and P02 remain independent/`  
- retain absence test `/if they lose only an example of how, a place to write/`

Bump `CONTRACT_VERSION` assertion to `76-DLA-PARTIAL-7` in:

- `tests/ld-dla-evidence-decision-consistency-prompt.test.js`  
- `tests/ld-instructional-archetype-production-planning.test.js`

Substring assertions only. No whole-prompt snapshot.

---

## 6. Test plan — absence / non-accretion

In the same prompt file, `doesNotMatch` / retain:

- `/Lagrangian/` in the **contract block** (no subject-specific live wording)  
- `/FINAL PRE-EMIT AUDIT/` · `/FINAL PER-ACTIVITY EVIDENCE-DECISION CONSISTENCY AUDIT/` (P04)  
- no second `"activity_id": "A2"` (or equivalent) full activity JSON in `buildCanonicalDlaPageShapeSnippet` — keep **one** evidence-true example + existing P02-false contrast line  
- `domains/learning-design/domain-learning-design-step-patterns.md` DLA-WB tokens unchanged (existing workbook tests suffice; **do not edit pack**)

Do **not** add a validator that infers intermediate operands from `learner_task` prose.

---

## 7. Regression cases

| Case | How to prove | Not |
| ---- | ------------ | --- |
| **A2** conventional operand | Existing P01-R1 test still requires `problem` in the operand list, WE/workspace/scaffold roles, `P01 and P02 remain independent`. Existing `tests/s76-dla-p01-p02-p03-contract.test.js` ordinary-practice fixture (`true` + problem id, P02 false) **unchanged** | No new generation fixture |
| **A3** intermediate operand | New prompt-contract assertions in §5 (semantics support a supplied object/state as operand; workspace fusion sentence present) | **No** deterministic semantic validator |
| **Prior product** | Prompt contains “prior-activity product is not a new GAM commission” | No activity-graph schema |

Keep `tests/s76-dla-procedural-task-evidence-validation.test.js` and `tests/s75-dla-evidence-decision-false-positive.test.js` as P02 false-positive regression (untouched validators).

---

## 8. Validator / schema / GAM

**SCHEMA CHANGE: NO**  
**VALIDATOR CHANGE: NO**  
**GAM CHANGE: NO**

**Do not touch:**

- `lib/page-dla-enrich.js`  
- `lib/page-gam-enrich.js`  
- `lib/ld-gam-page-enrich-contract.js`  
- EP contracts  
- `app.js` (injection count must remain 2)  
- schemas  

---

## 9. DLA-WB confirmation

Pack `domain-learning-design-step-patterns.md` has **no** `task_input_material_ids` instruction. DLA-WB-06a requires commissioning a practice **table**, not listing it as the task input. **No pack edit in this change-set.**

No direct contradiction found that would make Option 2 ineffective. If implementation discovers one, **STOP** and report; do not edit DLA-WB from this plan.

**DLA-WB CHANGE: NO**

---

## 10. T-031 / T-033 protection

| Step | Opening (must remain verbatim) | Later design |
| ---- | ------------------------------ | ------------ |
| 1 | `1) Define the learner production obligation (expected_output and learner_task intent).` | T-033 |
| 3 | `3) Commission every required material. required_materials must be an array. … specification must not be only the material_type token.` | T-031 |

This plan edits **step 2 only**. Existing test `S76 P04: protected step 1 and step 3 openings survive` must stay.

---

## 11. Implementation sequence

1. Record before-size (script in §3; expect unique **17,973**).  
2. Edit step 2 only in `buildDlaPageEnrichContractBlock`.  
3. Bump `CONTRACT_VERSION` to `76-DLA-PARTIAL-7`; bump contract cache pin in `index.html`.  
4. Update prompt tests (§5–§6).  
5. Run targeted tests: `ld-dla-evidence-decision-consistency-prompt.test.js`, `ld-instructional-archetype-production-planning.test.js`.  
6. Measure after unique / ×2.  
7. Run `tests/s76-dla-p01-p02-p03-contract.test.js`, procedural/S75 P02 suites, `tests/page-dla-enrich.test.js` dual-injection.  
8. Write implementation record. **Stop before generation.**

---

## 12. Review gates

### GATE A — semantic shape

Step 2 contains the three new sentences; absence test intact; prior-product boundary intact; steps 1/3 unchanged; `76-DLA-PARTIAL-7`; targeted prompt tests pass.

**Stop if:** steps 1–3 rewritten; Lagrangian nouns added; validators edited.

### GATE B — regression / size

P01/P02/P03 suites pass; no schema/validator/GAM/pack diffs; unique delta **≤400**; Copy still **exactly 2** contract and **2** shape call sites; P05 untouched.

**Stop if:** unique add >400 without a documented necessity; injection count ≠ 2.

### GATE C — operator generation (later)

Not this task. After operator authorisation: Lagrangian A2 + A3. A3 should commission supplied practice Lagrangian operand(s); derivation table workspace-only; P02 false. A2 non-regression.

---

## 13. Expected files to change

| Path | Change |
| ---- | ------ |
| `lib/ld-dla-page-enrich-contract.js` | Step 2 insert + `76-DLA-PARTIAL-7` |
| `index.html` | Contract cache pin only |
| `tests/ld-dla-evidence-decision-consistency-prompt.test.js` | Presence/absence + version |
| `tests/ld-instructional-archetype-production-planning.test.js` | Version pin |
| Sprint 76 implementation record + pointers | After live implementation |

**Do not touch:** validators, schemas, GAM, DLA-WB, EP, T-031/T-033 wording, `app.js` injection logic.

---

## 14. Stop conditions

- Unique add >400 without stopping to tighten.  
- Any DLA-WB / validator / GAM edit.  
- Step 1 or 3 rewrite.  
- Second full canonical activity example.  
- Starting Gate C, P05, T-031, or T-033 from the implementation change-set.

---

**P01-R1 INTERMEDIATE-OPERAND IMPLEMENTATION PLAN READY FOR OPERATOR REVIEW**

*End of S76-T-040. No implementation authorised.*
