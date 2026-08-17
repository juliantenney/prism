# S78-T-003 — Check / revision architecture diagnostic

**Task:** S78-T-003  
**Status:** **DIAGNOSTIC COMPLETE** (2026-08-17)  
**Mode:** **DIAGNOSTIC ONLY** — no implementation  
**Workstream:** 3 — Check / revision architecture  
**Production / tests / schema / validators / prompts / assembly / renderer:** **UNCHANGED**

Sprint 78 remains **OPEN**. T-013 remains **OPEN**. Solution design: [S78-T-021](S78-T-021-check-revision-architecture-solution-design.md) (**complete**). Do **not** start S78-T-022 in this diagnostic.

---

## 0. Exhibit identity

### Primary exhibit (this diagnostic)

Operator-reported **fresh post-S78 Lagrangian** QA (PRISM Resource Quality Benchmark v2.2), supplied in the T-003 authorisation:

| Measure | Result |
| ------- | ------ |
| Weighted QA | **88/100 — Strong** |
| Confidence | High |
| Critical / Major / Moderate production | **0 / 0 / 0** |
| Instructional Architecture | 91 |
| Constructive Alignment | 94 |
| Scaffolding & Independence | 90 |
| **Feedback & Self-Regulation** | **78** |
| Independent Study Effectiveness | 88 |
| Technical Integrity | 94 |

Activity Check audit:

| Activity | Check |
| -------- | ----- |
| A1 | **Weak** |
| A2 | **Weak** |
| A3 | **Weak** |
| A4 | **Weak** |
| A5 | **Strong** |

QA names A5 as the positive comparator: guided review with rationale, observable features, targeted repair, and an invitation to revise/confirm. A1–A4 supply production criteria/specifications without an equivalent diagnostic comparison-and-revision mechanism.

**Candidate/run:** the latest T-013-path fresh generation that reached independent QA at **88/100** (five activities; A5 interpretation). This is **not** T-008 (87/100, four activities) and **not** POST-S77 (70/100, F&S 30).

### Artefact preservation status

| Artefact | Status |
| -------- | ------ |
| QA scores / Check audit | **Preserved here** (operator exhibit) |
| EP / DLA / GAM / assembled page JSON for the 88/100 run | **Not found** in the Sprint 78 pack, repo fixtures, or Downloads at diagnostic time |
| Last committed DLA structure | [S78-T-008-candidate-1-fresh-dla-exhibit.json](S78-T-008-candidate-1-fresh-dla-exhibit.json) — **four** activities; **rejected** for P02; used only as a **commissioning-shape comparator** |
| T-008 live QA | 87/100; T-002 recorded **A4 Check strong / A2 Check weak** |

The 88/100 EP/DLA/GAM JSON should be filed into this pack if still operator-held. The **earliest causal class does not depend on recovering that JSON**: live contracts already permit A1–A4-style omission, and two successive strong runs show the same pattern (strong Check on the **capstone** activity only).

Do not regenerate. Do not score-chase.

---

## 1. Executive conclusion

**Primary class: A — episode/archetype does not require check/revision.**

Every frozen archetype (`understand`, `apply`, `analyse`, `evaluate`) treats `verification` as **optional** (`cardinality` min **0**) and satisfies **closure** with **any one of** `verification` | `reflection` | `transfer` | `transition`. A legal Apply/Understand activity can close on a **transition beat alone**. Attempt → diagnostic review → revision is **not** a required educational sequence.

**Secondary class: B — DLA commissioning lacks a fail-closed activity-level review guarantee.**

A packed prompt rule (G1 / DLA-WB-26) says every activity MUST emit `checklist`. The **salient commissioning slot** only says: *if* a checklist row exists, specify diagnostic criteria. Live DLA capture (`page-dla-enrich`) does **not** call `validateDla38LObligations`. The T-008 DLA exhibit passed capture with checklists on **A4 only**.

**Not causal:** assembly, renderer, T-017/T-018 operational-suitability verifier, WS1 blank-cell fulfilment, WS2 operand independence.

**A5 is not a unique architecture.** It is the activity that **happened to commission** a `checklist` that GAM then authored as `guided_criteria`. The same machinery produced T-008 A4 Strong Check when A4 was the capstone.

**Multiple-response hypothesis: B — correlated, not causal.** Compound production co-occurs with weak Check because those activities are typically Apply/construct/solve without a checklist row. Single-response interpretation (T-008 A4; 88/100 A5) is Strong when a checklist is commissioned.

---

## 2. A1–A5 learner-facing comparison

Sources: 88/100 QA inventory (Check ratings + A5 praise); T-008 DLA commissioning shape as structural analogue (four-activity predecessor; interpretation then sat on A4). Exact 88/100 material ids/bodies were not in-repo.

| | A1 | A2 | A3 | A4 | A5 |
| - | -- | -- | -- | -- | -- |
| **QA production (this run)** | classification / table | construction | multi-part mathematical | simultaneous solve | interpretation |
| **Check (QA)** | Weak | Weak | Weak | Weak | **Strong** |
| **Typical production surfaces (T-008 analogue)** | text_compose (explanation + two identifications) | table_complete (several columns × problems) | table_complete (Lagrangian, FOCs, algebra, values, constraint) | text_compose (T-008) / solve (this run) | text_compose + **checklist** (T-008 A4) |
| **Success criteria / expected_output** | Yes (A — production spec) | Yes | Yes | Yes | Yes |
| **Diagnostic review (C)** | No (QA) | No (QA) | No (QA) | No (QA) | **Yes** — guided review |
| **Why it matters (C)** | No | No | No | No | **Yes** (QA) |
| **What to inspect (C)** | Production spec only | Production spec only | Production spec only | Production spec only | **Yes** — observable features |
| **Repair guidance (D)** | No | No | No | No | **Yes** (QA) |
| **Revise/confirm (E)** | No | No | No | No | **Yes** (QA) |
| **Learner-facing diagnostic-review sections** | 0 | 0 | 0 | 0 | **1** (activity-level guided review) |

A/B (what to produce; what good work contains) are present on weak activities. C/D/E are what QA treats as Check. **Do not treat A/B as equivalent to C/D/E.**

---

## 3. Educational invariant — assessment

Candidate formulation:

> When an activity requires substantive learner production, the activity should provide one coherent post-attempt diagnostic review that helps the learner inspect and improve that production. The review may contain multiple criteria mapped to multiple response components, but remains one activity-level review.

| Case | Fits? |
| ---- | ----- |
| A1 classification/table | **Yes** — one review of the completed table/classification, criteria per column/judgement |
| A2 construction | **Yes** — one review of constructed Lagrangians / λ role |
| A3 multi-part maths | **Yes** — one review covering FOCs, algebra, feasibility; not one panel per cell |
| A4 simultaneous solve | **Yes** — one review of the joint solution |
| A5 interpretation | **Yes** — already realised |
| Single-response | **Yes** — one review, fewer criteria |
| Compound/multiple-response | **Yes** — still one review, more criteria |

**Scope limits:** not every read/study-only step; not automated grading of unrestricted prose; not one review widget per field or per material.

**Verdict on one-review-per-activity:** **YES**, when the activity has **substantive independent production** (load-bearing `response_fulfilment` / independent attempt). **Not** a large review panel on trivial orientation.

Trigger should depend on **substantive production**, not on activity index, not on “Evaluate only”, and not on field count.

---

## 4. A5 positive path (live architecture)

```text
EP Evaluate (typical capstone)
  → closure group may include verification (optional)
DLA required_materials[] includes material_type checklist
  → commissioning slot: 3–4 diagnostic criteria in specification
GAM (ld-gam-page-enrich-contract)
  → if checklist: body_format json, review_mode guided_criteria
  → criteria[].statement, why_it_matters, features[].expected/repair, confirmation_label
Assembly
  → preserves materials[] one-to-one with required_materials
Renderer (render-material.js renderGuidedReviewBody)
  → Why this matters / What to look for / If something is missing / confirm checkbox
```

| Field | Owner | Commissioned | Projected | Authored | Assembled | Rendered |
| ----- | ----- | ------------ | --------- | -------- | --------- | -------- |
| `verification` beat | EP grammar | optional | DLA maps beat → type `checklist` **if beat present** | — | — | — |
| `required_materials[].material_type: checklist` | DLA | optional in practice | GAM obligation iff row exists | — | kept | — |
| checklist `specification` (criteria names) | DLA | when row exists | GAM | — | kept | not learner-facing as-is |
| `body.review_mode: guided_criteria` | GAM | — | — | required for json checklist | kept | parsed |
| `criteria[].why_it_matters` | GAM | — | — | required for quality | kept | “Why this matters” |
| `features[].expected` / `repair` | GAM | — | — | required | kept | “What to look for” / “If something is missing” |
| `confirmation_label` | GAM | — | — | typical | kept | checkbox |

**Why A5 is Strong:** **material commission** of a verification checklist, then **reliable GAM + renderer** for that shape — **not** an architectural guarantee that every productive activity receives it. Not renderer luck. Not a second review schema unique to interpretation. Stochastic only in **whether DLA emits the row**, not in whether GAM/renderer can realise it once commissioned (T-008 A4 and 88/100 A5 both Strong).

---

## 5–8. A1–A4 negative paths

Same chain. Earliest break is **before GAM**.

| Question | A1 | A2 | A3 | A4 (this run) |
| -------- | -- | -- | -- | ------------- |
| Diagnostic review commissioned at DLA? | **Typically no** (T-008: no checklist row) | **No** (T-008) | **No** (T-008) | **No** on this run (QA Weak; T-008 A4 *had* a row when it was capstone) |
| Activity-level vs field-level? | N/A — absent | N/A | N/A | N/A |
| Projected into GAM? | No row → no guided-review obligation | No | No | No |
| GAM authoring obligation? | Ordinary markdown materials only | Same | Same | Same |
| GAM authored review? | No | No | No | No |
| Assembly dropped it? | **No** — nothing to drop | No | No | No |
| Renderer hid it? | **No** | No | No | No |
| Contract aggregating compound production into one review? | **None** | None | None | None |
| Review criteria optional? | **Yes** — entire checklist optional | Yes | Yes | Yes |
| “Check” meaning? | Completion / expected_output (A/B) | Same | Modelling-note “check constraint” is **procedure**, not diagnostic review | Same |
| Production criteria vs diagnostic revision distinguished? | **No fail-closed distinction** | No | No | No |

**They share one cause.** A4’s flip from T-008 Strong → this-run Weak is the proof: when interpretation/checklist moved to A5, A4 lost the review. That is **commission placement**, not four independent GAM failures.

T-008 A1–A3 (committed DLA): no `checklist` rows. A4-M4 was the only checklist (`purpose`: “Support review of the economic interpretation”; specification listed four diagnostic criteria). That is the positive shape A5 now occupies.

---

## 9. Multiple-response hypothesis

**Verdict: B — correlated, not causal.**

| Activity | Production multiplicity | Review |
| -------- | ---------------------- | ------ |
| A1 | Compound in one surface (T-008: explanation + two identifications; this run: table/classification) | Weak |
| A2 | Multi-cell table | Weak |
| A3 | Multi-section workspace | Weak |
| A4 this run | Multi-part solve | Weak |
| T-008 A4 / 88/100 A5 | **Single** interpretive text_compose | **Strong** iff checklist commissioned |

`response_fulfilment.binds_production_steps` can bind several task steps to **one** surface. There is **no** branch that says “if more than one field, skip review.” GAM guided-review is keyed to **`material_type === checklist`**, not to response arity.

Correlation: compound Apply/solve activities are the ones **least** likely to get Evaluate/capstone checklist packing (DLA-WB-22). That is why multiplicity and weak Check travel together.

---

## 10. Archetype / beat findings

Live grammar: `lib/episode-plan-v1-archetype-grammar.js`.

| Archetype | `verification` cardinality | Closure group (min 1) | `revision` |
| --------- | -------------------------- | --------------------- | ---------- |
| understand | **0–1** | verification **or** reflection **or** transition | not in close set |
| apply | **0–1** | verification **or** reflection **or** transfer **or** transition | **0–1**, not required |
| analyse | **0–1** | same OR pattern | optional |
| evaluate | **0–1** | same OR pattern | not required |

- Check/revision **is** represented (`verification` role `"check"`; `revision` role `"check"`).
- It is **not** required. Closure can be a **transition**.
- Population contract T5 (`independent_performance → verification → reflection`) is a **relative-order** chain **when those beats appear**, not a requirement that they appear.
- AC-02 only rejects a verification checklist that **exists** but lacks diagnostic spec. It does not require the beat.
- Apply does **not** guarantee attempt → check → revision.
- Evaluate does **not** guarantee guided review; DLA-WB-22 Evaluate pack *mentions* checklist, still prompt-only.
- Consolidation/`reflection` is a **different** beat (metacognition / summary), not diagnostic review of production.
- A5 is Strong because a checklist was commissioned, not because Evaluate uniquely requires `verification`.

**Do not change the grammar in this task.** Repair direction: closure must not be satisfiable by transition-only **when substantive independent production exists**.

---

## 11. DLA commissioning findings

Relevant fields (live `ld-dla-page-enrich-contract.js` + T-008 exhibit):

| Concern | Representation today |
| ------- | -------------------- |
| Learner production | `learner_task`, `expected_output`, `response_fulfilment` |
| Workspace | material types + `response_fulfilment` (WS1) |
| Success criteria | `expected_output`; optional checklist spec |
| Diagnostic feedback / guided review | **`material_type: checklist` row** — optional |
| Activity-level “one review of complete production” | **No authoritative field** |
| Revision action | not a DLA object; GAM confirmation checkbox only if review authored |

**There is no DLA object that means:** “this activity requires one diagnostic review covering the learner’s complete production.”

What exists:

1. **Packed G1 / DLA-WB-26** (obligation-population essay): every activity MUST list type `checklist` with repair/revise. **Prompt-only. Not on Copy capture fail-closed path.**
2. **Commissioning slot (salient):** “Verification checklist diagnostic specification **(when required_materials includes type checklist)**” — **conditional on a row the model is not required to emit**.
3. `validateDla38LObligations` (`lib/dla-38l-obligation-check.js`) — harness/smoke; **not called from `page-dla-enrich`**. Also reads `m.type`, not v2 `material_type`.
4. Checklist rows are **forbidden** from carrying `response_fulfilment` (correct — review is not the production surface). Nothing then **binds** the checklist to the production rows it should diagnose.

**Why A1–A4 did not realise DLA-WB-26:** the MUST sits in a long packed block (same class as other S77/S78 salience failures). The construction-surface rule is “if checklist, specify criteria.” Capture accepts omission.

---

## 12–13. GAM commissioning and assembled-prompt salience

`lib/ld-gam-page-enrich-contract.js` + `lib/guided-review-generation-contract.js` (`71-GUIDED-REVIEW-QUALITY-2`):

- Guided-review authoring is **conditional on checklist materials**.
- When present: `review_mode: guided_criteria`; 3–4 criteria; why / expected / repair; confirmation; generic-repair forbidden.
- **Markdown checklists remain allowed** for “non-guided/legacy” — a second, weaker realisation if DLA emits checklist without forcing json guided form.
- A5 does not get a **different** GAM contract from A1–A4. It gets a **row** they lack.
- Multiple response components do not fragment GAM review authoring; GAM never sees an activity-level review obligation unless a checklist id exists.
- Assembled GAM salience for review is **high once the row exists** (dedicated block + capture validation for json checklists). It is **zero** if DLA omitted the row. A rule “somewhere in DLA packed G1” does not reach GAM.

---

## 14. Assembly findings

**Non-causal.** GAM contract requires one-to-one `materials[]` coverage of `required_materials[]`. No evidence that assembly drops checklists or splits one review into per-field widgets. T-008/A5 success shows preservation when the row exists.

---

## 15. Renderer findings

**Non-causal.** `renderGuidedReviewBody` implements exactly the A5 quality bar (statement, why, expected, repair, confirm). Simple markdown checklists render as weaker tick-lists. Hidden/progressive panels are inspectable (QA gate already requires this). Renderer does not invent a review when GAM supplied none, and does not hide a guided_criteria body.

---

## 16. Structural absence vs weak content

| Activity | Class |
| -------- | ----- |
| A1 | **A — no diagnostic review commissioned** |
| A2 | **A** |
| A3 | **A** |
| A4 (88/100) | **A** |
| A5 | **E — strong A5-quality diagnostic review** |
| T-008 A4 | **E** (same class as this-run A5) |

Not B (commissioned but not authored) for A1–A4. Not C (lost in assembly). Not D (rendered but weak) as the primary 88/100 pattern.

---

## 17. WS1 relationship

WS1 guarantees **blank operational response surfaces** for load-bearing production (`response_fulfilment`).

Diagnostic review should **consume the same production representation**: the bound workspace/text is what the learner inspects. `binds_production_steps` already lists which task steps a surface fulfils; an activity-level review can say “cover all bound production” without a new production model.

**Do not alter WS1.** Review is post-attempt diagnosis, not a second workspace.

Additional metadata is **not** required to *identify* production. It **is** required to *require* a review of that production (see §19).

---

## 18. WS2 relationship

WS2: model on distinct operand; do not spoil the attempt.

Guided-review criteria may **use the modelled method** (what a good Lagrangian construction contains) **without disclosing the attempt instance’s answer**. That is compatible with WS2. **Do not merge WS2 with feedback architecture.** No WS2 changes.

---

## 19. Operational-suitability verifier boundary

| | T-017 / T-018 verifier | T-003 |
| - | ---------------------- | ----- |
| Question | Can the commissioned action be **completed from generated particulars**? | After attempting, can the learner **diagnose and improve** the response? |
| When | Before the learner works | After the learner produces |
| Owner | Temporary GAM instrumentation | Check/revision architecture |

**The verifier is not the T-003 solution.** Do not extend it. Do not treat verification-PASS as Check/revision.

---

## 20. Historical recurrence

| Run | F&S | Check pattern |
| --- | --- | ------------- |
| POST-S77 | **30** | All activities: no substantive Check |
| T-008 87/100 | improved; A2 still weak | **A4 Strong** (then the capstone + checklist) |
| This 88/100 | **78** | **A1–A4 Weak; A5 Strong** |

**Not a regression of a former guarantee.** The guarantee **never existed**. Capstone Strong Check is **intermittent commission success**, not intermittent GAM authoring of an always-commissioned review.

---

## 21–22. Root-cause classification

**Primary: A** — episode/archetype does not require check/revision (closure OR-group; `verification` min 0).

**Secondary: B** — DLA has no fail-closed activity-level review representation; G1/DLA-WB-26 is non-salient and unenforced on Copy capture.

**Not chosen as primary:**

| Class | Why not |
| ----- | ------- |
| C | Compound production is not split by a review-binding field; review is simply absent |
| D/E | GAM/prompt realise A5-quality when a checklist exists |
| F/G | Assembly/renderer faithful |
| H | Stochastic only at **whether the row is commissioned** |
| I | — |

---

## 23. One-review-per-activity verdict

**YES**, scoped:

- **When:** substantive independent learner production (WS1 `response_fulfilment` / independent attempt).
- **What:** one activity-level diagnostic review; multiple criteria allowed.
- **Not:** every orientation/read step; not per-field panels; not auto-grading prose; not Evaluate-only.

---

## 24. Likely metadata requirement

**B — existing metadata can work with a lightweight binding.**

Existing **sufficient realisation:** `checklist` + GAM `guided_criteria` (already A5-quality).

**Missing:** a fail-closed **commission** that that row exists and covers **all** load-bearing production on the activity.

Do not invent a second review schema. Do not implement metadata here. **T-021 selected:** DLA capture gate “production ⇒ one checklist” **plus** explicit bind `diagnostic_review.covers_response_material_ids` → `response_fulfilment` ids. **Not selected:** required EP `verification` beat when production exists (clarification-only at EP).

---

## 25. Cross-disciplinary assessment

The invariant is domain-neutral:

| Domain | One review of compound production |
| ------ | --------------------------------- |
| Mathematics | derivation + feasibility + interpretation criteria |
| Humanities | claims + evidence use + qualification |
| Programming | behaviour + explanation/debug rationale |
| Data/stats | computation + interpretation |
| Design | artefact qualities + rationale |

No mathematical answer-checker. Criteria name **observable features of the learner’s production**.

---

## 26. Smallest repair direction (characterisation only)

**Owner: DLA activity-level commissioning.** T-021 **did not** adopt EP closure tightening (`verification` remains optional). Transition-only EP closure cannot satisfy diagnostic review; DLA still fail-closes the missing checklist.

1. When an activity has load-bearing **independent** production, DLA **must** commission **one** `checklist` with `diagnostic_review` covering all bound production (criteria may map to components).
2. Make that rule **fail-closed on Copy capture** (same class as WS1/WS2), not packed G1 prose. G1/DLA-WB-26 is **replaced** by S78-WS-3.
3. Keep GAM `guided_criteria` as the authoring realisation; do not add a parallel review framework.
4. EP: **clarification only** — do **not** require `verification` in the closure group. See [T-021](S78-T-021-check-revision-architecture-solution-design.md).

**Not:** renderer work; verifier extension; WS1/WS2 edits; per-field review widgets.

---

## 27. Benchmark implication

Repairing this architecture should address the **specific** 88/100 finding: F&S **78**; A1–A4 Weak Check; A5 Strong Check — by making A5-quality review the **default for productive activities**, not the capstone lottery.

It should **not** be expected to manufacture ≥90 by itself (other dimensions already 88–94). Score movement is **secondary evidence**. Do not tune criterion count to the rubric.

---

## 28. Files changed

| File | Change |
| ---- | ------ |
| This record | Diagnostic complete |
| `STATUS.md` | T-003 complete; 88/100 exhibit noted |
| `PLAN.md` | T-003 complete; T-021 later completed in [S78-T-021](S78-T-021-check-revision-architecture-solution-design.md) |
| `SPRINT-78-START-HERE.md` | T-003 complete |
| `S78-T-013-workstream-2-integration-verification.md` | Cross-ref: 88/100 used by T-003; T-013 still OPEN |

**Production / test / prompt / schema / validator / assembly / renderer:** **ALL NO**

---

## 29. Recommended next task

**S78-T-021 is complete.** Next implementation: **S78-T-022** (DLA diagnostic-review commissioning + capture). Do **not** start T-022 from this diagnostic record.

Do **not** start T-019.  
**T-013 remains OPEN** (WS2 / operational suitability). Resume that operator path separately; 88/100 does **not** close T-013.
