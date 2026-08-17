# S78-T-013 Candidate 5 — Operational-suitability verifier coverage diagnostic

**Task:** Bounded diagnostic within **S78-T-013** (subordinate record; not T-019 / T-023 / T-024 / T-025)  
**Status:** **COMPLETE** (2026-08-17)  
**Mode:** DIAGNOSIS ONLY — no implementation  
**Candidate:** Fresh post-T-022 T-013-path Lagrangian  
**Trigger:** Operational-suitability review **PASS** with only **A4-M1** and **A4-M2**, despite load-bearing generated particulars described in A1–A5

**Production / prompt / validator / test / schema / assembly / renderer changes:** **NO**

QA on this candidate is **in progress independently**. This record is **instrumentation evidence**. Do not interpret QA. Do not change candidate status.

---

## 0. Evidence inspected

### 0.1 Review artefact (operator-supplied — preserved verbatim)

```json
{
  "artifact_type": "gam_operational_suitability_review",
  "schema_version": "1.0.0",
  "gam_fingerprint": "1a472e4d",
  "verdicts": [
    {
      "activity_id": "A4",
      "material_id": "A4-M1",
      "suitable": true,
      "failure_class": "none",
      "reason": ""
    },
    {
      "activity_id": "A4",
      "material_id": "A4-M2",
      "suitable": true,
      "failure_class": "none",
      "reason": ""
    }
  ]
}
```

### 0.2 Exact fresh DLA / GAM for this candidate

**Not present** in the Sprint 78 pack, repo fixtures, or session evidence at diagnosis time. Fingerprint `1a472e4d` has no prior match in the repository.

Operator-established material roles for this candidate (not JSON):

| ID | Operator-described role |
| -- | ----------------------- |
| A1-M1 | Scenario: optimisation situations learners classify |
| A2-M1 | Worked example: model Lagrangian construction |
| A2-M2 | Independent task operand: construct Lagrangian from |
| A3-M1 | Distinct solved/modelled FOC example (promises solved path including verification) |
| A3-M2 | Independent constrained-optimisation problem learners must solve |
| A4-M1 | Solved optimisation outcome for interpretation |
| A4-M2 | Learner text-production response surface |
| A5-M1 | Generated explanatory material introducing shadow price |
| A5-M2 | Generated multiplier-value cases learners must interpret |
| A5-M3 | Learner comparison workspace |

### 0.3 Analogues used (not this candidate)

| Artefact | Use |
| -------- | --- |
| [S78-T-008-candidate-1-fresh-dla-exhibit.json](S78-T-008-candidate-1-fresh-dla-exhibit.json) | Ran current `collectSuitabilityObligationsFromPage` — proves activity-gate skip of load-bearing `task_input` operands when `learner_task` is an unnumbered study-prefixed paragraph |
| T-015 `candidate1ShapedPage()` in `tests/s78-gam-operational-suitability-prompt.test.js` | Numbered Study/Solve fixture that **does** collect model + solve operand |
| [S78-T-013-candidate-1-gam-mathematical-operand-validity-diagnostic.md](S78-T-013-candidate-1-gam-mathematical-operand-validity-diagnostic.md) | Historical A4-M2 invalid solve operand |
| [S78-T-013-candidate-4-post-t015-operational-suitability-fail.md](S78-T-013-candidate-4-post-t015-operational-suitability-fail.md) | Historical A4 practice operand + A3 model inconsistency; full JSON operator-held |

### 0.4 Implementation traced (current production)

- `lib/gam-operational-suitability-prompt.js` — `activityRequiresOperationalSuitability`, `collectSuitabilityObligationsFromPage`
- `lib/gam-operational-suitability-review.js` — `collectOperationalSuitabilityReviewScope`, `validateReviewArtefact`, `evaluateReviewGate`
- `lib/dla-production-fulfilment.js` — `classifyLearnerProductionSteps`, `TEXT_COMPOSE_STEP_RE`, study/verify prefixes
- `lib/learner-renderer-vnext/parse-learner-task.js` — numbered vs unnumbered / `Then` splitting
- `lib/dla-diagnostic-review.js` — T-022; **does not call** the collector

---

## 1. Collector output vs Stage-2 scope

### 1.1 Could not execute collector on the exact candidate

Exact DLA JSON is unavailable. Analysis below uses (a) the review artefact + gate identity rules and (b) the current collector implementation.

### 1.2 T-017 received exactly two obligations

Stage-2 **does not filter** collector output.

`collectOperationalSuitabilityReviewScope(dla, gam)` = T-015 `collectSuitabilityObligationsFromPage(dla)` joined to GAM bodies. T-017A fingerprint hashes that scope. `validateReviewArtefact` requires:

- every verdict `material_id` ∈ obligated ids;
- every obligated id has a verdict;
- `activity_id` matches the obligated activity;
- `gam_fingerprint` equals the current scope fingerprint.

Therefore a two-verdict PASS with ids **A4-M1**, **A4-M2** and fingerprint **`1a472e4d`** is possible **only if** the collector returned **exactly those two rows**. No later review-scope stage removed A1–A3/A5.

### 1.3 Inferred obligation set T-017 received

| activity_id | material_id | material_type | role | commission_mode | trigger reason | learner_task / expected_output / purpose / specification |
| ----------- | ----------- | ------------- | ---- | --------------- | -------------- | -------------------------------------------------------- |
| A4 | A4-M1 | not in review JSON (likely `scenario` by operator description) | `learner_operand` (inferred from collector rules + A4-M2 being a response surface) | not in review JSON (default `determinate` unless open-ended/insufficiency regex matched) | Activity A4 passed the activity-level gate; row included as task-input and/or operand-family | Exact strings not in pack |
| A4 | A4-M2 | not in review JSON (operator: learner text-production response surface → typically `prompt_set`) | `learner_operand` (operand-family include; `prompt_set` is in `OPERAND_MATERIAL_TYPES`) | same | Same activity gate; **not** because it is a generated operand | Exact strings not in pack |

Exact `material_type` / `role` / purpose / specification for these two rows cannot be restated from the review artefact. The **id set** is proven.

---

## 2. How the collector actually works

Two layers. **Activity-level gate first.** `task_input_material_ids` are consulted **only after** the activity is admitted.

### 2.1 Activity-level (`activityRequiresOperationalSuitability`)

TRUE if any of:

1. **B:** any required-material `purpose`/`specification` matches `COMPLETE_WORKED_COMMISSION_RE` (`complete worked…`, `fully worked`, `identifying the optimal`, `determining the optimal values`, …). **Not** merely the word “solved” or “model”.
2. **A-classifier:** `classifyLearnerProductionSteps(...).productionKinds.length > 0`. Production kinds are **narrow**: table-complete/compare/classify/plan **or** step text matching `TEXT_COMPOSE_STEP_RE` (`write|draft|produce|explain|justify|summarise|compose|record your…` at **start** of the step). **Construct / Derive / Solve / Classify / Interpret** do **not** produce a kind.
3. **A-fallback:** ≥1 parsed step that is **not** study/verify-prefixed, **and** (`expected_output` nonempty **or** `task_input_material_ids` nonempty).

Study/verify prefixes (`STUDY_STEP_RE` / `VERIFY_STEP_RE`): `study|read|review|work through|examine|look at|…` at the **start of the parsed step**.

`parseLearnerTask` keeps an unnumbered paragraph as **one step** unless `Then` / `Finally` / `Next` / … follows sentence punctuation. Combined “Examine X. Derive/solve Y” is therefore **one study-prefixed step**. The later action clause is never seen. `task_input_material_ids` on that activity are then **ignored**.

### 2.2 Material-level (only if activity gate TRUE)

| Include | Role |
| ------- | ---- |
| `worked_example` / `modelling_note` | `model_complete` if regex B matches that row, else `model_demonstration` |
| `material_id` ∈ `task_input_material_ids` **or** (`OPERAND_MATERIAL_TYPES` and not `WORKSPACE_MATERIAL_TYPES`) | `learner_operand` |

`OPERAND_MATERIAL_TYPES`: `scenario`, `task_card`, `scenarios`, `task_cards`, `study_scenarios`, **`prompt_set`**.

`WORKSPACE_MATERIAL_TYPES`: `template`, `analysis_table`, `comparison_table`, `decision_table`, `classification_table`, `planning_table`, `data_table`, `impact_table`.

**Never included** unless they are also task inputs: `text`, `checklist`, workspace types, and (typically) `response_fulfilment` tables. **`prompt_set` is included as an operand even when it is a blank learner response surface.**

`practice_independence` and `response_fulfilment` are copied onto obligation objects if present; they **do not** decide inclusion. T-017A excludes their contents from the fingerprint.

---

## 3. A1–A5 row-by-row (code path, not type-guessing)

**Legend.** Load-bearing = T-014 sense (generated particulars needed for the commissioned action/result). Collector TRUE/FALSE for **this** candidate: FALSE for all non-A4 rows is **proven** by the two-row review. Exact per-row *reason* for A1–A3/A5 uses operator roles + the only code paths that can produce an A4-only set. Exact `learner_task` strings remain unavailable.

| activity | material | type (operator / typical DLA) | purpose (operator) | load-bearing (T-014) | T-015 role if included | collector | exact inclusion/exclusion path | Stage-2 |
| -------- | -------- | ----------------------------- | ------------------ | -------------------- | ---------------------- | --------- | ------------------------------ | ------- |
| A1 | A1-M1 | scenario | classification situations | **Yes** — learners cannot classify correctly if situations are contradictory/unusable | would be `learner_operand` if activity admitted | **FALSE** | Activity gate FALSE (otherwise a `scenario` is always included via operand family / task input). Most likely: unnumbered `Read`/`Study`/`Examine`-prefixed combined clause → no productionKinds (Classify ≠ TEXT_COMPOSE) → `hasLearnerActionSteps` false → **task_input never followed** | No |
| A2 | A2-M1 | worked_example | model Lagrangian construction | **Yes** if commissioned as a complete modelled result; **weaker** if spec is demonstration-only / “stop before solving” | would be `model_complete` or `model_demonstration` if activity admitted | **FALSE** | Models are included **whenever the activity is admitted**. Absence from review **proves A2 activity gate FALSE**. Regex B likely missed (“model construction” / “stop before solving” ≠ `fully worked` / `complete worked`). Unnumbered `Study the worked example and construct…` without a `Then` split would skip the whole activity | No |
| A2 | A2-M2 | task_card / scenario | independent construct-Lagrangian operand | **Yes** | would be `learner_operand` | **FALSE** | Same activity-gate skip. This is the “classifier may see production in prose, but collector never follows `task_input_material_ids`” path | No |
| A3 | A3-M1 | worked_example / modelling_note | distinct solved FOC model including verification | **Yes** if purpose/spec promises a complete worked result | would be model role if admitted | **FALSE** | Same: models would appear if A3 admitted. `COMPLETE_WORKED_COMMISSION_RE` does **not** treat “solved example” / “including verification” as complete-worked unless the regex phrases appear. T-008 analog A3 (`Examine the supplied… Derive…`) **requires=false** on current collector | No |
| A3 | A3-M2 | scenario / task_card | independent solve operand (C1/C4 failure class) | **Yes** | would be `learner_operand` | **FALSE** | Same activity-gate skip. **This is the load-bearing class Stage-2 previously caught when the activity was admitted** | No |
| A4 | A4-M1 | scenario (typical) | solved outcome for interpretation | **Yes** | `learner_operand` | **TRUE** | A4 activity gate TRUE. Row is task-input and/or operand-family (`scenario`) | **Yes** |
| A4 | A4-M2 | prompt_set (typical WS1 text surface) | learner-owned response surface | **No** (blank surface; WS1 structural usability, not generated particulars) | `learner_operand` (side-effect of `prompt_set` ∈ OPERAND types) | **TRUE** | Activity admitted; `prompt_set` treated as operand even with `response_fulfilment` | **Yes** |
| A5 | A5-M1 | text | explanatory shadow-price intro | Usually **no** as generated *operand* (teaching text); still generated content | none | **FALSE** | Even if A5 admitted, `text` is not operand-family and is included only if listed in `task_input_material_ids` | No |
| A5 | A5-M2 | scenario (if cases) or `data_table`/`comparison_table` | multiplier-value cases to interpret | **Yes** if generated cases are the operand | would be `learner_operand` if admitted **and** type is operand/task-input, **not** if type is workspace table | **FALSE** | Either A5 activity gate FALSE (Read-prefixed combined clause — T-008/A5-shaped) **or** cases commissioned as workspace/table type (excluded unless task-input). Without JSON, both remain possible; activity-gate skip is the path that also explains A1–A3 | No |
| A5 | A5-M3 | comparison_table / template | learner comparison workspace | **No** for Copilot semantic review (WS1 blank-cell concern) | none (workspace exclusion) | **FALSE** | Workspace types excluded unless they are task inputs. Intended T-015 exclusion | No |

### 3.1 Why only A4 can survive this collector

If A2 or A3 had been admitted, their **model rows would have been included** (`worked_example` / `modelling_note` are unconditional once the activity gate is true). They are absent. Therefore A2 and A3 failed the **activity** gate, not a later material-type filter.

If A1 had been admitted and A1-M1 is a `scenario`, A1-M1 would have been included. It is absent. Therefore A1 failed the activity gate (or A1-M1 is unexpectedly `text` — weaker, not the operator description).

A4 survived because its `learner_task` almost certainly starts a parsed step with a TEXT_COMPOSE verb (`Explain` / `Write` / …), unlike A1–A3/A5 study-prefixed combined clauses.

---

## 4. Particular rows

### A1-M1 — excluded

Load-bearing for classification. Excluded because the **activity** never entered collection, so `task_input_material_ids` were not followed. Classify/identify wording does not yield `productionKinds`. A combined “Read the situations. Classify…” paragraph is one study step.

**T-014 class:** **D** collector under-coverage (if situations are generated particulars). Not C (T-015 did not settle “skip classification operands”).

### A2-M1 — excluded

Model completeness does **not** automatically create an obligation. Regex B must match purpose/specification, **or** the activity must already be admitted. “Model construction” / “stop before solving” typically fails B. Absence of A2-M1 from the review proves the activity was not admitted, so the model row was never reached.

If the commission is demonstration-only (construct, do not solve), T-014 model-completeness is weaker (**A** possible). If it promises a complete modelled construction including the Lagrangian expression, exclusion is **D**.

### A2-M2 — excluded

Prima facie load-bearing independent operand. Excluded solely because A2’s activity gate failed; the collector does not follow `task_input_material_ids` on skipped activities. **D**.

### A3-M1 — excluded

Current model-completeness trigger does **not** recognise “solved modelling path including verification” unless regex B phrases appear. Combined with an `Examine`/`Study`-prefixed unnumbered `learner_task`, the activity is skipped and the model is never included. **D** vs T-014 §3.4 if the commission promises a complete worked result. **E** for the exact purpose/specification strings.

### A3-M2 — excluded

Same class as Candidate 1 / Candidate 4 invalid mathematical operands. Excluded by the activity-level study-prefix skip, not because it is out of scope. **D**. This is the highest-severity under-coverage for T-013.

### A4-M1 — included

Activity A4 admitted. Generated solved outcome is a `learner_operand` (task input and/or `scenario`). **Correct inclusion** vs T-014.

### A4-M2 — included

Included because `prompt_set` (typical text-production surface) is in `OPERAND_MATERIAL_TYPES`, not because it carries generated load-bearing particulars. `response_fulfilment` does not suppress inclusion.

A learner-owned blank response surface **should not** be a Copilot semantic-suitability obligation. It needs WS1 structural usability (T-007), not Stage-2 contradiction/insufficiency judgement. **Over-coverage / false positive** relative to T-014. Side-effect of trigger logic intended for generated operands.

### A5-M1 — excluded

`text` explainer: not operand-family. **A** or **C** (teaching text; T-015 operand/model focus). Correct unless it is secretly the only carrier of the cases.

### A5-M2 — excluded

Prima facie load-bearing. Same activity-gate skip as A1/A3, **or** commissioned as a workspace table. **D** if `scenario`/`task_card` + task input; **E** until JSON confirms type.

### A5-M3 — excluded

Learner comparison workspace. **C** — T-015 explicitly keeps workspaces out of semantic review. Correct.

---

## 5. T-014 invariant vs collector

Canonical T-014:

> When GAM generates load-bearing particulars for a commissioned learner action or worked-model result, those particulars must be mutually consistent and sufficient for that commissioned action/result to be completed as specified, within intended scope.

The collector does **not** implement that invariant. It implements a **two-layer proxy**: (1) WS1 production-kind / study-prefix / narrow complete-worked regex at **activity** grain; (2) material-type whitelist at **row** grain.

| Row | Class |
| --- | ----- |
| A1-M1 | **D** under-coverage |
| A2-M1 | **D** if complete modelled result commissioned; **A** if demonstration-only; **E** on exact spec |
| A2-M2 | **D** |
| A3-M1 | **D** if complete worked promised; **E** on exact spec |
| A3-M2 | **D** |
| A4-M1 | correctly inside |
| A4-M2 | over-coverage (not T-014 generated particulars) |
| A5-M1 | **A** / **C** |
| A5-M2 | **D** or **E** |
| A5-M3 | **C** intended workspace exclusion |
| Indirect cover of A3-M2 by A4-M1 | **No** — different activity, different operand |

T-015 §4 “study-only pages without load-bearing production emit no block” is the **intended** exclusion. The defect is classifying **study-prefixed combined do-clauses** and **non-TEXT_COMPOSE production** (construct/solve/classify) as study-only.

---

## 6. Activity signals → material obligations

Proven sequence:

1. WS1 classifier often **does not** identify construct/solve/classify as production (`productionKinds` empty).
2. Fallback `hasLearnerActionSteps` is **false** when the only parsed step starts with Read/Review/Examine/Study, even if later sentences commission independent production.
3. Collector **never reaches** `task_input_material_ids`.
4. When the activity **is** admitted, **response surfaces** of type `prompt_set` are selected as `learner_operand`; workspaces are not; `text` is not.

This is **not** documented as intentional T-014 behaviour. T-015 tests hide it by using **numbered** `1. Study… 2. Solve…` (second step is not study-prefixed).

---

## 7. `task_input_material_ids` vs other bindings

| Binding | Collector use |
| ------- | ------------- |
| `task_material_decision.task_input_material_ids` | Used **only after** activity admission, as an include-or with the operand-type whitelist |
| `response_fulfilment` | Not used for inclusion; `prompt_set` still included via type |
| `practice_independence` | Copied if present; not used for inclusion or fingerprint |
| `diagnostic_review` (T-022) | Unused by collector |
| Model vs attempt | Collector does not read WS2 bindings; it uses material_type model set vs operand set |

The collector **can** confuse:

- operand the learner works **from** (`task_input`);
- surface the learner writes **into** (`prompt_set` / workspace);
- model the learner **studies**;
- diagnostic checklist.

On this candidate it treated A4-M2 (write-into) as an operand and omitted A2-M2 / A3-M2 (work-from).

### T-008 analog (executed)

Current collector on the preserved T-008 DLA:

| Activity | `requires` | `task_input` | Collected |
| -------- | ---------- | ------------ | --------- |
| A1 | true (`Then compose` → `text_compose`) | `[]` | **A1-M2 `prompt_set`** (response surface); A1-M1 `text` excluded |
| A2 | true (non-study “construct…” + expected_output; A2-M2 spec has `fully worked`) | A2-M1 | A2-M1 task_card + A2-M2 worked_example |
| A3 | **false** (`Examine the supplied…` one study step) | **A3-M1** | **none** — including the solve operand |
| A4 | **false** (`Review the solved…` one study step) | **A4-M1** | **none** |

That is the same skip that would hide Candidate 1/4’s solve-operand class whenever DLA uses T-008-style unnumbered Examine/Review prose.

---

## 8. T-022 interaction

**Collector code:** T-022 did not modify `gam-operational-suitability-prompt.js` or `gam-operational-suitability-review.js`. `dla-diagnostic-review.js` has no suitability import. Checklists remain teaching-only and are not collected.

**Hypothesis (orthogonal):** T-022 should not change T-015 output.

**Verified for code path:** yes.

**Indirect DLA wording:** possible that WS-3 commissioning increased “Review / Use the checklist” prose, which would **increase** study/verify-prefixed skips. **Insufficient evidence** without this candidate’s `learner_task` strings. Not classified as a T-022 collector regression.

---

## 9. Why the two-row review PASSed

Given collector output `{A4-M1, A4-M2}`:

- verdict ids **exactly** match obligated ids;
- fingerprint `1a472e4d` bound that two-row review scope + those GAM bodies;
- both `suitable: true`, `failure_class: "none"`;
- `evaluateReviewGate` therefore **accepted**.

**Gate behaved correctly given the collector output.**

Do **not** call T-017 / T-017A / T-018 broken because the upstream obligation set is incomplete.

---

## 10. Historical Candidate 1 / Candidate 4

| Candidate | What was reviewed / failed | Collector implication |
| --------- | -------------------------- | --------------------- |
| 1 | A4-M2 invalid **solve operand**; A4-M1 incomplete model | Those rows were **in** human/diagnostic scope; T-015 fixture uses numbered `1. Study 2. Solve` which **collects** model + `task_card` |
| 4 | A4 practice operand inconsistent λ; A3 worked model inconsistent | Again A3/A4 **solve/model** class — in scope when activities admitted |
| 5 (this) | Review only A4 interpretation outcome + A4 response surface | Solve operands A2-M2 / A3-M2 **not in Stage-2 scope** |

This is **not** a new T-022 collector regression. It is an **old collector limitation** that T-015 numbered fixtures and earlier A4-solve-shaped `learner_task`s hid. A change toward T-008-like unnumbered study+do prose, or A4 becoming an Explain-prefixed interpretation activity, would surface it.

---

## 11. Cross-disciplinary consequence

The same activity-gate skip misses load-bearing operands whenever `learner_task` is a study-prefixed combined clause **or** production is not table/TEXT_COMPOSE-shaped:

| Domain | Example wording that would skip | Operand that would be missed |
| ------ | ------------------------------- | ---------------------------- |
| Programming | “Read the specification. Implement the function and run the tests.” | `task_card` spec + tests |
| Data analysis | “Examine the dataset. Compute the requested statistics.” | generated dataset |
| Scenario interpretation | “Review the case. Recommend a decision.” | case particulars |
| Humanities | “Read the source. Write an interpretation.” — **unless** `Then write` splits or step 2 is numbered `Write` | passage/source (openHumanitiesPage numbered `2. Write` **does** collect) |
| Design briefs | “Study the brief. Produce a proposal.” | brief constraints |

T-015 already has a **numbered** programming fixture that collects. Unnumbered Read/Examine prose would not. Any repair must stay on **authoritative DLA bindings**, not domain heuristics.

---

## 12. False-positive side

The two-row scope **simultaneously** shows:

- **False negatives:** A1-M1, A2-M2, A3-M2, likely A5-M2 (generated operands / models).
- **False positives:** A4-M2 learner-owned response surface selected as `learner_operand`.

A blank `prompt_set` cannot be “contradictory” or “insufficient” in the T-014 sense except by judging empty structure. Copilot `suitable: true` here is not evidence that generated operands are sound.

---

## 13. Earliest proven causal layer

**T-015 obligation collection** (`activityRequiresOperationalSuitability` + material include rules).

Not: Stage-2 projection, review prompt, review gate, T-022 capture, material-role inference *after* admission (except A4-M2 type-whitelist over-include, which is the same collector layer).

---

## 14. Classification

**Both** verifier instrumentation **under-coverage** and **over-coverage**.

- **Not** “no defect / intended behaviour” relative to T-014.
- **Not** a T-022 collector regression.
- **Previously existing limitation**, hidden by numbered T-015 fixtures and by earlier candidates whose failing rows sat in admitted A3/A4 solve activities.
- Exact `learner_task` strings for Candidate 5: **insufficient evidence**; the **two-row obligation set** is proven.

S78-D02: T-017–T-018 is temporary instrumentation. That does not make this coverage gap ignorable while the instrumentation is used as evidence.

---

## 15. Repair decision (not implemented)

**Justified** as an instrumentation correction so remaining Sprint 78 evidence is trustworthy.

**Not** justified as permanent product architecture.

Smallest **general** direction (characterisation only):

1. Treat `task_input_material_ids` as authoritative load-bearing operands **without** requiring the activity to pass the study-prefix / TEXT_COMPOSE gate.
2. Include model rows when purpose/specification (or WS2 model binding) commissions a complete worked/modelled result — without relying on a narrow phrase regex as the only B trigger, and without inspecting GAM body text in JS.
3. **Exclude** rows whose `response_fulfilment` marks them as learner-owned surfaces (`learner_text_production` / `learner_workspace`) from semantic review.
4. Do **not** use material-type whitelists as a substitute for task-input identity (`prompt_set` must not imply generated operand).
5. Do **not** add action-verb regexes, mathematical heuristics, or domain lists.

**Proportionate:** **Yes** to a small collector-binding fix while T-017–T-018 remains the evidence instrument. **No** to expanding the verifier into steady-state architecture. Removal of the verifier later does not require keeping a misleading obligation set now.

---

## 16. QA independence

Operator QA is running. Not interpreted here. Instrumentation PASS ≠ operand soundness on unreviewed rows. Learner-resource QA ≠ collector coverage.

---

## 17. Files

**Inspected:** listed in §0.4 plus T-014, T-015, T-016, T-017, T-017A, T-018, T-022 records; T-008 DLA exhibit; C1/C4 diagnostics; T-013 workstream record; `tests/s78-gam-operational-suitability-prompt.test.js`.

**Changed:** this record; STATUS / PLAN / START-HERE / T-013 pointers only.

**Production / prompt / test / schema / validator / assembly / renderer:** **ALL NO**.

---

## 18. Recommended next action (after QA evidence arrives)

1. Keep QA score as **learner-resource** evidence; this diagnostic as **instrumentation** evidence.
2. If QA later flags unusable A1 situations, A2/A3 operands, or A5 cases, treat that as confirming the collector gap — do not treat the two-row review PASS as contrary evidence.
3. Do **not** start T-019. Do **not** reopen T-022. Do **not** regenerate from this diagnostic.
4. When authorised: a **bounded T-015 collector-binding repair** (design then implement) so `task_input` operands and commissioned complete models are in scope and `response_fulfilment` surfaces are not — then continue T-013 with trustworthy instrumentation. Do not promote that repair to permanent architecture.
