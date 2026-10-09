# Assessment Pack — output-to-spec contract

**Sprint:** 93 — Assessment Pack Educational Contract  
**Status:** Slices 1–4 implemented (2026-10-09): validation, omission of the legacy summary control, browser-local persistence, learner artefact assembly, and Design Page authoring of `output_specification`. Gate 10 is not complete.  
**Depends on:** Gate 9 `assessment_evidence` (PASSED). Does not replace Gate 9 and does not reopen Gates 1–8.  
**Decision:** [S93-D11](decisions.md#s93-d11--assessment-pack-output-to-spec-contract)  
**Invariant:** NON-SUMMATIVE · client-side HTML/CSS/JS only · no runtime model call · no new product

This document is the contract. Slice 1 validates `output_specification` and omits the legacy summary control. Slice 2 persists every supported response in the existing browser-local draft. Slice 3 assembles that specification into an editable, copyable artefact. Slice 4 teaches the existing four authoring stages to design that artefact backwards from the commission and to emit it from Design Page. None of these slices changes the stored clinical workflow or Learning Journey intake.

---

## 1. Educational purpose and boundaries

An educator commissions an Assessment Pack by stating what the inquiry should accomplish and, when wanted, what learner-owned artefact it should produce. PRISM designs elicitations that gather the information that artefact needs. After publication, the page assembles an editable, copyable result from the learner’s actual responses.

```text
commissioned purpose + optional artefact
        ↓
authored elicitations (existing Assessment Pack)
        ↓
learner responses, stored on the device
        ↓
deterministic assembly into the specified artefact
        ↓
learner reviews, edits, and copies
```

The product remains **Assessment Pack**. This contract does not add a product, a page `artifact_type`, an adaptive engine, or a runtime path into Learning Journey.

**In scope**

- An optional canonical object, `output_specification`, on `assessment_evidence`.
- Assembly by copying named responses, or by reporting a determinate check the page has already performed.
- Learner review, edit, and copy of that assembly.
- Browser-local persistence for every supported response the assembly may read.
- Omitting the legacy “Summarise this assessment” control on Assessment Pack pages that have no output specification.

**Out of scope**

- Runtime model calls, hidden interpretation of free text, generated prose, or generated code.
- Quality, proficiency, grade, or remediation claims about unmarked writing.
- Overriding learner-stated priorities with inferred deficiencies.
- Transporting the artefact into Learning Journey. The learner copies it. Gate 9 §8 and §17.8 still forbid runtime state transport.
- Changing `renderAssessment` for self-study pages. That path may keep its learning-outcome summary.
- Retrofitting the accepted clinical pack *Can We Claim the Intervention Worked?*.

`purpose.role` stays the Gate 9 set (`R1`, `R2`, `R1_and_R2`). A requirements-elicitation pack still uses that object. Its `visibility_claim` describes what the learner will state, not a proficiency the runtime has judged. Self-report and priority asks are `non_determinate` `constructed_performance` units, so they cannot carry an authored correct key.

---

## 2. Proposed canonical shape

**Name.** `output_specification`. “Summary” is the legacy learning-outcome control and must not be reused. “Brief” would privilege one purpose. The page is already the artefact; this object specifies the learner-owned result.

**Placement.** Optional object on `assessment_evidence`, beside `elicitations`. Absence means the pack produces no generated artefact. An empty object is invalid.

```text
assessment_evidence
├── purpose
├── learner_context
├── elicitations[]
├── pack_forward_orientation
├── delivery_preferences?
└── output_specification?          # omit the key when no artefact is required
    ├── specification_id           # stable id, unique on the page
    ├── artefact_title             # learner-facing title of the result
    ├── audience                   # who the result is for
    ├── purpose                    # learner-facing purpose of the result
    ├── action_label               # button label that builds or refreshes the result
    ├── missing_response_text      # exact text used when a referenced response is absent
    └── sections[]                 # length ≥ 1, assembled by section order
        ├── section_id
        ├── order                  # sections only
        ├── heading
        └── contributions[]        # length ≥ 1, assembled in array order
            ├── contribution_id
            ├── label              # printed when responses are combined
            ├── elicitation_id     # existing elicitation
            ├── item_id?           # required for auto_checkable items; forbidden otherwise
            ├── response_part      # closed set below
            └── missing_response_text?   # optional override of the pack sentence
```

### Closed `response_part` set

| `response_part` | Allowed source | What assembly inserts |
| --- | --- | --- |
| `selected_options` | `determinate` unit, `delivery.kind = auto_checkable_items`, one of the five forms | Verbatim rendering of the current selection (below). No correctness word. |
| `check_result` | Same determinate item | The result already computed for that item, plus the authored feedback appropriate to that result where the existing item model has it. Today that model is one `feedback_note`, shown with the check as the item rationale. Assembly may repeat that note. It must not invent further advice, and it must not add a rules engine for incomplete selections or other runtime hints. |
| `response_text` | `constructed_performance` | The current response textarea, verbatim. |
| `identified_weakness` | `constructed_performance` whose `formative_return.revision.offered` is true | The current weakness textarea, verbatim. |

No other `response_part` is valid. A contribution has one part. A section that needs both the learner’s words and a check uses two contributions.

**Verbatim selection rendering** (deterministic, not a template language):

| Form | Inserted text |
| --- | --- |
| `single_answer_mcq` | The selected option’s learner-facing label. |
| `multiple_answer_mcq` | Selected option labels, in display order, separated by `; `. |
| `ordering` | The learner’s current order, as numbered option labels. |
| `classification` | Each row as `row label: chosen category label`, one line each. |
| `matching` | Each pair as `left label: right label`, one line each. |

Unselected options are omitted. Empty or whitespace-only text, an empty selection, and a `check_result` whose item has not been checked all use `missing_response_text` (contribution override, otherwise the specification sentence). The runtime must not invent a substitute sentence.

**Assembly order.** Sort sections by `order`. Contributions have no `order` field; they follow array order. Prepend three authored lines, then the sections:

1. `artefact_title`
2. `For: ` + `audience`
3. `purpose`
4. For each section: `heading`, then each contribution’s `label` and either its value or its missing-response sentence.

That is concatenation. It is not a prose generator.

### Design case — Learning Journey commissioning brief

The pack elicits stated requirements. It does not assess competence. Every contribution below is `response_text` on a `non_determinate` constructed elicitation. None use `check_result`. Prior experience is the learner’s report. Priorities are copied as stated.

```text
output_specification:
  specification_id: journey-commissioning-brief
  artefact_title: Learning Journey commissioning brief
  audience: The person commissioning this learner's Learning Journey
  purpose: State the learner's goals, context, constraints, priorities, and open questions for a Learning Journey commission.
  action_label: Prepare commissioning brief
  missing_response_text: Not stated.
  sections:
    - section_id: goals
      order: 1
      heading: Intended learning goals
      contributions:
        - contribution_id: goals-text
          label: Goals
          elicitation_id: goals
          response_part: response_text
    - section_id: context
      order: 2
      heading: Context and prior experience
      contributions:
        - contribution_id: context-text
          label: Context
          elicitation_id: context
          response_part: response_text
        - contribution_id: prior-experience-text
          label: Prior experience (self-reported)
          elicitation_id: prior_experience
          response_part: response_text
    - section_id: constraints
      order: 3
      heading: Constraints and preferences
      contributions:
        - contribution_id: constraints-text
          label: Constraints and preferences
          elicitation_id: constraints
          response_part: response_text
    - section_id: priorities
      order: 4
      heading: Learner-identified priorities
      contributions:
        - contribution_id: priorities-text
          label: Priorities
          elicitation_id: priorities
          response_part: response_text
    - section_id: open-questions
      order: 5
      heading: Unanswered questions or missing information
      contributions:
        - contribution_id: open-questions-text
          label: Open questions
          elicitation_id: open_questions
          response_part: response_text
```

The copied brief is suitable to paste into the existing Learning Journey envelope field `specificationText` (`normalizeCommissionEnvelope` in `lib/first-class-commission-intake.js`). The learner may also paste portions into `focus`, `sourceContext`, `constraints`, or `journeyContextText`. The page does not write those fields. It must not add lines about gaps the learner did not write. `Not stated.` is the authored missing sentence, not a remediation plan.

---

## 3. Validation rules

Apply only when the key is present. A missing key is valid and means “no artefact”.

Fail closed when:

1. **Empty specification.** `output_specification` is not an object, or any required field is missing or blank: `specification_id`, `artefact_title`, `audience`, `purpose`, `action_label`, `missing_response_text`, `sections`.
2. **Empty sections.** `sections` is missing, not an array, or empty. A section with no contributions is invalid.
3. **Duplicate ids.** `section_id` values collide. `contribution_id` values collide anywhere in the specification. Section `order` values collide. Contributions are not ordered by a field; a `order` key on a contribution is an unsupported key.
4. **Invalid response reference.** `elicitation_id` does not match an elicitation. `item_id` is missing on an `auto_checkable_items` contribution, does not match an item in that elicitation, or is present on a `constructed_performance` contribution.
5. **Unsupported source type.** `response_part` is outside the closed set. `selected_options` or `check_result` is used on a unit that is not `determinate` `auto_checkable_items`. `response_text` is used on an auto-checkable item. `identified_weakness` is used when `revision.offered` is not true, or on a determinate item.
6. **Duplicate source in one section.** The same `elicitation_id` + `item_id` + `response_part` appears twice in one section. The same response may appear in two different sections.
7. **Unsupported structured fields.** Any key that is not in the closed shape above is rejected. That includes score, grade, proficiency, remediation, and inferred-gap fields. The validator does not scan heading, label, purpose, or other learner-facing prose for prohibited words. `check_result` on a non-determinate elicitation is rejected as an incompatible response part. A contribution cannot name `evidence_ask` or formative material as a response source, because those keys are not in the contribution shape.
8. **Legacy control reused as the action.** `action_label` is exactly `Summarise this assessment`.
9. **Summative payload.** Gate 9’s summative ban still applies inside this object.

The validator cannot prove that a question’s wording actually collects the section’s educational content. That remains an authoring duty: if the commission asks for an artefact, Design Page emits an `output_specification` whose every contribution ids an elicitation the pack asks, and self-report units stay `non_determinate`.

---

## 4. Learner runtime and persistence semantics

No network and no model call. Standalone HTML and the ZIP carry the same assembly script they already carry for checks (`getAssessmentRuntimeScript` inlined by `render-page.js`; ZIP entry `learner-page.html`).

### When there is no specification

`renderAssessmentEvidence` does not emit `[data-assessment-review]` or “Summarise this assessment”. Pack forward orientation still renders. `renderAssessment` in `render-page.js` is unchanged for pages that are not an Assessment Pack: a self-study assessment with a section heading may still build its learning-outcome profile from `data-assessment-outcome-index`.

### When a specification is present

The control’s label is `action_label`. Activation assembles the artefact into its own editable text area. A Copy control copies the current text of that area, including learner edits. There is no file export and no write-back into workflow state in this contract.

The artefact is a separate `text_entry` workspace, id `assessment-output-` + `specification_id`. Its draft stores:

- `text` — what the learner currently sees
- `assembled_snapshot` — the last deterministic assembly

**Editing is independent of source responses.**

| Learner action | Result |
| --- | --- |
| First activation | Write the assembly into `text` and `assembled_snapshot`. |
| Activate again while `text` equals `assembled_snapshot` | Replace both with a fresh assembly. |
| Edit the artefact, then change a source answer | Leave the edited artefact unchanged. |
| Activate `action_label` while `text` differs from `assembled_snapshot` | Do not overwrite. |
| Explicit second action, **Replace with current responses** | Fresh assembly replaces `text` and `assembled_snapshot`. |

There is no field-level merge. The existing “Clear saved responses for this page” control clears source workspaces and this artefact workspace together.

### Persistence required before assembly is trustworthy

Today `serializeAssessmentSelection` stores one checked radio only. Multi-select, ordering, classification, and matching do not survive reload, so a later assembly would treat them as missing. Before the output control is published, browser-local drafts must store the current value of every supported form, keyed by the existing workspace id (`assessment-` + `item_id`, `assessment-constructed-` + `elicitation_id`, and `…-weakness` when that field is rendered):

| Source | Persisted value |
| --- | --- |
| `single_answer_mcq` | Selected option value. |
| `multiple_answer_mcq` | Selected option values. |
| `ordering` | Current id order. |
| `classification` | Map of row id to chosen category id. |
| `matching` | Map of left id to chosen right id. |
| `response_text` | Textarea string. |
| `identified_weakness` | Textarea string. |

On restore, recompute `data-assessment-last-result` from the restored selection and the authored judgement already in the page. Do not persist a separate score. Draft envelope, key prefix `learner-renderer-vnext:draft:`, and page identity from `buildLearnerDraftPageIdentity` stay as they are.

---

## 5. Clinical-pack generality check

Design check only. Do not write this specification into workflow `e50c39b5-0c33-4869-bf5a-4fc2cef07c70`.

The same object can describe a formative evidence record:

- Each determinate evidence check (the five auto-checkable items) may contribute `selected_options`, `check_result`, or both. `check_result` repeats that item’s computed result and, when the item has one, its authored `feedback_note`. It does not add an ability claim or extra formative advice.
- The constructed methodological judgement (elicitation `E6`, `response_text`) is quoted under a heading such as “Your methodological judgement”.
- The weakness textarea (`identified_weakness`) may be quoted under “Weakness you identified”, because revision is offered and the words are the learner’s.
- A `check_result` contribution on `E6` is invalid under §3.5 and §3.7.
- The record shows one current judgement. It cannot show an original beside a revision, because the page keeps one response textarea.
- No section evaluates whether the argument is sound. Headings and labels stay descriptive. The missing sentence is an absence marker such as `Not yet answered.`, not a comment on quality.

That is the same contract as the commissioning brief. The difference is authoring: the clinical record is allowed to include `check_result` because those items are determinate; the brief is not, because its answers are stated requirements.

---

## 6. Implementation sequence

Do not start this sequence from this document alone. Each step stays inside Assessment Pack.

1. **Validator and legacy control.** Accept a missing `output_specification`. Reject the §3 cases. When the key is absent, Assessment Pack rendering omits “Summarise this assessment”. Do not assemble an artefact in this step. **Done in slice 1.**
2. **Draft coverage.** Persist and restore all five determinate forms, constructed text, and the weakness field. Recompute check results from authored keys. No output UI in this step. **Done in slice 2.**
3. **Publish.** If the key is absent, Assessment Pack omits “Summarise this assessment”. If present, render `action_label`, the editable artefact, Copy, and Replace with current responses. Same script in preview, standalone HTML, and ZIP. **Done in slice 3.**
4. **Authoring.** When the commission asks for an artefact, Design Page may emit `output_specification` grounded in the elicitations it designed. Packs with no requested artefact omit the key. Do not emit the legacy summary label. **Done in slice 4.** The four existing stages design backwards from the artefact. Design Page is the stage that emits the object.
5. **Tests.** Invalid and duplicate references, empty object, `check_result` on a non-determinate id, missing-response sentence, multi-select restore, omitted button, edited artefact not overwritten by a later source edit. The stored clinical workflow is not a fixture to be rewritten.

**Still out of scope for that sequence:** Learning Journey redesign, envelope auto-fill, a sixth product, scoring unmarked writing, and any edit to the accepted clinical page.
