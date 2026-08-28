# S81-T-002 — Learner-action, evidence & feedback model

**Sprint:** 81 — Learner Workspace Investigation & Surface Architecture  
**Status:** **COMPLETE — ACCEPTED** (operator 2026-08-28)  
**Executed:** 2026-08-28  
**Mode:** Investigation / modelling only — **no** product implementation; **no** surface-family architecture; **no** A/B/C/D  
**Authority:** operator acceptance of [S81-T-001](S81-T-001-forensic-current-state-activity-inventory.md) + authorisation of this task  
**Predecessor:** S81-T-001 (ACCEPTED)  
**Follow-on:** [S81-T-003](S81-T-003-current-learner-interaction-needs-assessment.md) — COMPLETE (awaiting operator review of T-003)

---

## 1. Purpose

Transform T-001’s forensic production inventory into a **small, evidence-backed model** of:

1. what learners are asked to **do**;  
2. what **evidence** those actions produce;  
3. what **feedback / review** relationship currently exists.

**Unit of analysis:** learner behaviour — **not** technical material types, beat functions, or episode archetypes.

---

## 2. Binding correction from T-001 (carried forward)

| Claim | Status in this model |
| ----- | -------------------- |
| `diagnostic_review` is DLA/GAM **commission / structural** authority | **Preserved** — never treated as runtime diagnosis of learner responses |
| No vNext consumer joins text/table drafts to `covers_response_material_ids` | **Preserved** — no invented feedback consumer |
| Guided review / flat checklist = **self-attestation**, not automated scoring | **Preserved** |
| Ordering exact-match and MCQ/TF correctness = **deterministic local** checks of learner evidence | **Preserved** |
| Text/table production drafts = persisted, **not submitted**, **not auto-scored** | **Preserved** |
| Debt S81-D-001…D-005 (and D-006/D-007) | **Context only** — not solved here |

---

## 3. Modelling decisions (explicit)

### 3.1 Study-only content → learner action **LA-study**

**Decision:** Non-response learning materials constitute a first-class learner-action type **study** (read / inspect / follow a worked model), **not** merely “surrounding chrome.”

**Why (evidence):** T-001 §6.1 shows first-class production regularly presents prose, scenarios, worked examples, samples, reference tables, and consolidations with **no** learner-produced evidence. That is still something the learner is asked to do. Treating it only as “content around actions” would erase a large share of the live page.

**Boundary:** When the same material type is interactive production (e.g. completion table) or interactive self-check, it is **not** LA-study.

### 3.2 Collapse rules (smallest useful set)

| Do **not** split merely because… | Do **split** when… |
| -------------------------------- | ------------------ |
| `material_type`, beat function, episode archetype, instructional archetype, or wording differs | Evidence shape, what feedback consumes, or the behavioural affordance is materially different |

### 3.3 Derived set (six action types)

| ID | Learner action (provisional label) | Collapse / keep rationale |
| -- | ---------------------------------- | ------------------------- |
| **LA-study** | Study / read / inspect | Distinct: **no** learner evidence |
| **LA-compose** | Compose written response(s) | One action: free text evidence + no auto-score; variants for field shape / prompt role |
| **LA-table** | Complete / construct table cells | One action: structured cell map + no auto-score; many material types collapse |
| **LA-self-review** | Review own work against criteria | One action: self-attestation; variants flat vs guided |
| **LA-order** | Order / sequence / rank items | Distinct evidence + **deterministic order** feedback |
| **LA-select** | Select an objective answer | Distinct evidence + **deterministic correctness** (+ optional rationale) |

**Not promoted to action types (yet):**

| Candidate | Disposition |
| --------- | ----------- |
| Matching / multi-select (general) | **Recognised but unsupported** (S81-D-002) — not a current learner action in first-class runtime |
| “Answer short_answer / essay interactively” | Pack-supported types often render **static**; no proven interactive compose-from-CAI path in T-001 — **unknown / not modelled as LA-compose** unless production emits a text workspace |
| Static checklist (no criteria interaction) | Modelled as **LA-study** (criteria as readable content) |
| Moments Orient/Learn/Do/Check | Composition frames, not actions |

---

## 4. Concise learner-action model

### LA-study — Study / read / inspect

| Facet | Model |
| ----- | ----- |
| **A. Action** | Read, inspect, or follow authored teaching content (explanations, scenarios, worked models, samples, reference tables, consolidations, static criteria lists). |
| **B. Stimulus** | Authored prose / tables / examples / criteria presented as content. |
| **C. Evidence** | **None** (no learner-produced artefact required). |
| **D. Surface** | Static material rendering in composed moments (typically Learn / Orient / parts of Check). |
| **E. Feedback / review** | **none** (for the study act itself). Adjacent LA-self-review may appear later in the activity. |
| **F. Pedagogical info that must survive** | The teaching content itself (claims, examples, contrasts, reference structure); ordering of exposition relative to later production when the activity depends on it. |
| **G. Production support** | **First-class** |

**T-001 map:** §6.1; teaching-only material types; static `reference_table`; static checklist without interactive criteria.

---

### LA-compose — Compose written response(s)

| Facet | Model |
| ----- | ----- |
| **A. Action** | Produce written response(s) in one or more text fields. |
| **B. Stimulus** | Prompt(s), task instruction, scenario/task card, transfer or reflection prompt, and/or labelled template sections. |
| **C. Evidence** | **Persisted free text** per field (`text_entry` draft `{ text }`). Local device only; not submitted. |
| **D. Surface** | `text_entry` workspace(s). |
| **E. Feedback / review** | **none** on the text itself. May be **followed by** LA-self-review (self-attestation against authored criteria) that does **not** read the draft. |
| **F. Pedagogical info that must survive** | What the learner is asked to produce; prompt/task wording; for multi-field forms, **labelled response locations** and their intended roles; relationship to any later self-review criteria covering that production. |
| **G. Production support** | **First-class** (`text_compose` → prompt_set / template / task_card; transfer/reflection prompts; unbound text_compose steps) |

**Variants (same action — not separate types):**

| Variant | Behaviour / evidence effect | Keep as variant because… |
| ------- | --------------------------- | ------------------------- |
| V-compose-single | One prompted field | Same evidence class + feedback |
| V-compose-labelled | Several labelled fields (template sections) | Same class; structure is stimulus/layout of fields |
| V-compose-transfer | Transfer / application prompt | Same class; pedagogical role of prompt differs, not the act |
| V-compose-reflect | Reflection prompt | Same class |

Different pedagogical content (analyse vs evaluate wording) is **content variation**, not a new action.

---

### LA-table — Complete / construct table information

| Facet | Model |
| ----- | ----- |
| **A. Action** | Enter or construct information in blank / editable table cells (compare, decide, classify, plan, complete, etc.). |
| **B. Stimulus** | Table structure (headers, rows, fixed cells, blank cells) plus surrounding instructions / scenarios. |
| **C. Evidence** | **Persisted structured cells** (`table_entry` draft `{ cells }`). Local only; not submitted. |
| **D. Surface** | `table_entry` workspace. |
| **E. Feedback / review** | **none** on cell contents. May be followed by LA-self-review that does **not** read cells. |
| **F. Pedagogical info that must survive** | Grid semantics (what each row/column means); which cells are learner-owned; any fixed exemplar/reference cells; link to later self-review criteria if commissioned. |
| **G. Production support** | **First-class** (table_* response_kinds → table family materials; blank-cell / unconditional rules) |

**Variants:** comparison vs decision vs classification vs planning, etc. = **stimulus / column semantics**, not different actions — same evidence + feedback pattern (T-001 multiplicity §8.1).

If a table material has **no** learner blanks and is not an unconditional completion type → **LA-study**, not LA-table.

---

### LA-self-review — Review own work against criteria

| Facet | Model |
| ----- | ----- |
| **A. Action** | Compare one’s own prior production (in mind / on screen) to authored criteria and **confirm** progress or completion. |
| **B. Stimulus** | Criteria statements; optionally why-it-matters, look-for / if-missing features, revision instruction (guided). |
| **C. Evidence** | **Self-attestation** — persisted checkbox / confirmation state (`checklist_entry`). Does **not** encode whether production actually meets criteria. |
| **D. Surface** | Interactive checklist **or** guided-review panels (same `checklist` material type, different body modes). |
| **E. Feedback / review** | **self-attestation** / **self-review** (authored guidance). **Not** automated diagnosis. Does **not** consume text/table/ordering drafts. Generation contract forbids claiming Prism assessed free-text (T-001 §7). |
| **F. Pedagogical info that must survive** | Criteria (and guided features/repairs when used); intended coverage of prior production (commission may bind material ids — **structural**, not runtime); that review is learner-judged. |
| **G. Production support** | **First-class** when interactive / guided; static criteria-only lists → LA-study |

**Variants:**

| Variant | Difference | Same action? |
| ------- | ---------- | ------------ |
| V-review-flat | Flat interactive criteria ticks | Yes — attestation without guided panels |
| V-review-guided | Progressive criterion panels + confirm | Yes — richer stimulus; same evidence class + non-consumption of drafts |

**Commission note (not a feedback mechanism):** `diagnostic_review.covers_response_material_ids` may require a checklist covering production materials. That is **authoring closure** (S81-D-001), not a runtime join.

---

### LA-order — Order / sequence / rank

| Facet | Model |
| ----- | ----- |
| **A. Action** | Arrange a set of items into an order (sequence / rank / priority / chronology as normalised). |
| **B. Stimulus** | Item set + interaction metadata (`activity_interaction_type` / `ordering` schema). |
| **C. Evidence** | **Deterministic ordering state** — persisted `itemOrder` (`ordering` draft). |
| **D. Surface** | `ordering` workspace. |
| **E. Feedback / review** | **deterministic structural/order check** when validation mode is exact-order (local compare to expected order). Independent of `diagnostic_review`. |
| **F. Pedagogical info that must survive** | Items; intended correct order (when check is part of the design); learner-facing task to reorder. |
| **G. Production support** | **Supported but first-class emission unclear** (S81-D-003) — renderer + fixtures proven; DLA `RESPONSE_KINDS` omit ordering |

---

### LA-select — Select an objective answer

| Facet | Model |
| ----- | ----- |
| **A. Action** | Choose among options for an assessment item (single-answer MCQ or true/false). |
| **B. Stimulus** | Stem + options (TF may synthesise True/False). |
| **C. Evidence** | **Deterministic answer state** — persisted `assessment_selection` (`selectedOption`, whether checked). |
| **D. Surface** | Assessment interactive radios (`assessment_selection`) — **not** the unimplemented `single_select` response-part surface. |
| **E. Feedback / review** | **deterministic correctness** + optional **explanatory rationale** (local). |
| **F. Pedagogical info that must survive** | Stem, options, evaluable correct answer, rationale/explanation when intended for learner feedback. |
| **G. Production support** | **First-class** for evaluable MCQ/TF on CAI path |

**Not in this action (current evidence):**

- `multiple_answer_mcq` interactive multi-select — **unknown / debt** (S81-D-005)  
- Pack `short_answer` / `essay` / renderer `open_response` as interactive selection — typically **non-interactive**; do not force into LA-select or LA-compose without further production evidence  
- General `matching` / `multi_select` workspaces — **recognised but unsupported** (S81-D-002)

---

## 5. Action → evidence → surface → feedback matrix

| Action | Evidence produced | Persisted? | Current surface | Feedback / review class | Feedback depends on learner evidence? |
| ------ | ----------------- | ---------- | --------------- | ----------------------- | ------------------------------------- |
| LA-study | None | n/a | Static materials | **none** | n/a |
| LA-compose | Free text field(s) | Yes (local) | `text_entry` | **none** on text; optional later **self-attestation** | **No** (self-review does not read text) |
| LA-table | Cell map | Yes (local) | `table_entry` | **none** on cells; optional later **self-attestation** | **No** |
| LA-self-review | Attestation booleans | Yes (local) | Checklist / guided-review | **self-review / self-attestation** | Consumes **checkbox state** only; **not** production drafts |
| LA-order | Item order | Yes (local) | `ordering` | **deterministic order check** | **Yes** — compares learner order to expected |
| LA-select | Selected option (+ checked) | Yes (local) | Assessment interactive | **deterministic correctness** (+ rationale) | **Yes** — compares selection to correct answer |

---

## 6. Feedback dependency map

```text
LA-study
  → evidence: none
  → feedback: none
  → consumes: n/a

LA-compose
  → evidence: free text (local draft)
  → feedback on evidence: NONE
  → optional adjacent LA-self-review:
        stimulus = authored criteria (possibly commissioned via diagnostic_review bind)
        consumes = learner confirmations only
        does NOT consume text draft
  → structural metadata diagnostic_review: commission only (not runtime)

LA-table
  → evidence: cells (local draft)
  → feedback on evidence: NONE
  → optional adjacent LA-self-review: same as compose (no cell read)

LA-self-review
  → evidence: self-attestation
  → feedback class: self-review / self-attestation (+ authored look-for / repair prose)
  → consumes: checkbox/confirm UI state; authored criterion content
  → does NOT consume: text_entry, table_entry, ordering drafts
  → does NOT equal: runtime diagnostic_review

LA-order
  → evidence: itemOrder
  → feedback: deterministic exact-order (when configured)
  → consumes: current order vs embedded expected order
  → independent of diagnostic_review / feedback_pack

LA-select
  → evidence: selectedOption
  → feedback: deterministic correctness + optional rationale
  → consumes: selection vs correct answer attrs
  → independent of diagnostic_review / feedback_pack

feedback_pack / Design Feedback
  → not on first-class CAI→vNext path (S81-D-004)
  → no consumer in this model
```

### Summary of feedback kinds in live first-class use

| Kind | Used by | Based on learner evidence? |
| ---- | ------- | -------------------------- |
| none | LA-study; LA-compose; LA-table (production itself) | — |
| self-review / self-attestation | LA-self-review | Only attestation state; **not** production content |
| deterministic order check | LA-order | **Yes** |
| deterministic correctness (+ rationale) | LA-select | **Yes** |
| structural commissioning (`diagnostic_review`) | Authoring/validation | **No** learner evidence at runtime |
| `feedback_pack` | Not first-class path | — |

---

## 7. Variants / collisions to preserve

1. **LA-compose field shape** (single vs labelled multi-field) — same action; different stimulus structure.  
2. **LA-table column semantics** (compare/decide/classify/…) — same action; different grid meaning.  
3. **LA-self-review flat vs guided** — same action; different criterion presentation.  
4. **Same checklist material_type** → LA-study (static) **or** LA-self-review (interactive/guided).  
5. **Same table material_type** → LA-study (no blanks / reference) **or** LA-table (workspace).  
6. **Select-like UX** exists only as LA-select (assessment); general `single_select` / `multi_select` / matching are **not** current actions (S81-D-002).  
7. **Self-attestation draft** shares persistence machinery with production drafts — must not be read as “production was diagnosed.”  
8. **Pedagogical archetype / beat / moment** change content and placement, not the six action types.

---

## 8. Source / evidence mapping (T-001 → model)

| Model element | Primary T-001 anchors |
| ------------- | --------------------- |
| Six-action set | §3, §6.1–§6.6, §8 |
| No runtime diagnostic_review | §3, §7, S81-D-001 |
| Compose / table no auto-score | §6.2–§6.3, §7 |
| Self-review non-consumption of drafts | §6.4, §7 |
| Order / select evidence-based feedback | §6.5–§6.6, §7 |
| Ordering emission uncertainty | §6.5, §10.1, S81-D-003 |
| Assessment gaps (multi-answer, short/essay) | §6.6, §10, S81-D-005 |
| Dual vocabulary note | §8.8, S81-D-007 |

---

## 9. Unknowns

1. How often first-class Create→DLA→GAM currently emits **LA-order** (capability vs routine generation).  
2. Whether `diagnostic_review` checklists are **usually** guided vs flat in live GAM output.  
3. Whether pack **short_answer / essay** ever appear as **LA-compose** workspaces on the learner page, or only as static stems.  
4. Whether **multiple_answer_mcq** should eventually become a distinct select-many action — **not modelled** until runtime exists (S81-D-005).  
5. Any non-vNext consumer of coverage ids (tutor tools, etc.) — unknown; does not change learner-facing model.  
6. Default CAI mix of item formats on live Create — only MCQ/TF interactive path is firmly modelled as LA-select.

---

## 10. Implications / questions for the NEXT surface-family investigation

These are questions only — **not** surface designs or A/B/C/D:

1. Given only **six** learner actions, and only **two** with evidence-consuming feedback (order, select), what would a “surface family” even partition — by **action**, by **evidence shape**, or by **feedback class**?  
2. For LA-compose and LA-table, the educational critical path today is **production + optional self-review**, not automated diagnosis. Any future specialised widget must preserve (a) response structure and (b) criteria for self-review — without implying a new diagnostic engine unless separately authorised.  
3. Should LA-order be treated as an equal peer in surface planning, or as **capability-class / uncertain emission** until generative frequency is known?  
4. Is LA-study’s “surface” simply content layout, or does investigation need a explicit **non-interactive content** family so production surfaces are not overfitted?  
5. Where variants (labelled compose vs single field; guided vs flat review) need **representation choice**, what stays invariant: evidence class, feedback class, or both?  
6. Do not use unimplemented matching/multi-select (S81-D-002) to invent action types for family design.

---

## 11. Recommended next task (not executed)

### S81-T-003 — Candidate surface-family options from learner-action model

- **Mode:** investigation / options only — still **no** product implementation; still **no** forced A/B/C/D pick in the task body beyond framing options.  
- **Input:** this T-002 model + T-001 inventory.  
- **Job:** propose **candidate** surface-family partitions (including the legitimate null/“retain current surfaces” option) mapped from LA-* actions, evidence shapes, and feedback classes; list mapping alternatives and what each would need to preserve from §4.F / §10.  
- **Explicitly out of scope:** implementing widgets; claiming diagnostic_review becomes a runtime engine; selecting final A/B/C/D (that remains a later recommendation task).

---

## 12. Acceptance check

| Question | Answer from this model |
| -------- | ---------------------- |
| What fundamentally different things does PRISM ask a learner to do? | **Study; compose text; complete table; self-review; order; select objective answer** (six). |
| What evidence does each produce? | None; free text; cell map; attestation; item order; selected option — see §5. |
| How does the learner get feedback/review? | None / self-attestation against authored criteria / deterministic order check / deterministic MCQ-TF (+ rationale). **Not** runtime `diagnostic_review` of free responses. |

Renderer material types and beat functions are **production means**, not the pedagogical action set.

---

## 13. Out of scope (confirmed not done)

Surface-family architecture; widget invention; representation authority; A/B/C/D recommendation; production code; solving S81-D-001…D-007.
