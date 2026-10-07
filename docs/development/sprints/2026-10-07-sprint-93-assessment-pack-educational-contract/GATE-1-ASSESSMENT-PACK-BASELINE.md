# Gate 1 — Current Assessment Pack baseline

**Sprint:** 93 — Assessment Pack Educational Contract  
**Gate:** 1 — COMPLETE  
**Date:** 2026-10-07  
**Status:** Descriptive inventory only — **not a redesign**  
**Opening:** [S93-D01](decisions.md#s93-d01--open-sprint-93--assessment-pack-educational-contract)  
**Invariant:** NON-SUMMATIVE (see [SPRINT-93-START-HERE.md](SPRINT-93-START-HERE.md))

Purpose: establish exactly what Assessment Pack **currently is** before Learning Journey evidence challenges it.

---

## 1. First-class family definition

Source: `lib/first-class-workflow-family.js`

| Field | Current value |
| ----- | ------------- |
| `product_id` / family `id` | `assessment_pack` |
| Label | Assessment Pack |
| Create value | `assessment_pack` |
| `promptRoute` | `assessment` |
| `publishRoute` | `assessment_pack` |
| `parameterHook` | `assessment_pack` |
| `acceptsCommission` | `true` |
| `acceptsProductOutputFrom` | `interactive`, `expository` (not Situated Task at family level) |

**Note:** Shared page-based LearnerPackage publish routes include `learner_page` / `expository_page` / `situated_task_page` — **not** `assessment_pack`. Assessment uses a dedicated assemble/publish path.

---

## 2. Predetermined pipeline (current)

### Upstream Learning Design prefix

| Starting point | Prefix steps |
| -------------- | ------------ |
| Topic (default) | Generate Learning Content → Model Knowledge → Define Learning Outcomes |
| Authoritative source / product_output | Normalize Content + the three above |

### Assessment-specific stages

| Title | `canonical_step_id` | `outputName` | Role |
| ----- | ------------------- | ------------ | ---- |
| Plan Assessment Evidence | `step_plan_assessment_evidence` | `evidence_plan` | Design evidence; do not write questions |
| Author Assessment Components | `step_author_assessment_components` | `assessment_pack` | Author learner-facing components |
| Design Page | `step_design_page` | `assessment_design_page` | Learner-facing presentation; do not rewrite components |

Stages are continuous-conversation model work for intellectual design; assembly after Design Page is deterministic.

### Create / delivery-seed parameters (current)

| Parameter | Values (current) | Default |
| --------- | ---------------- | ------- |
| Intent | `formative_check`, `pretest_diagnostic` | `formative_check` |
| Depth | `quick`, `standard`, `thorough` | `standard` |
| Feedback timing | `per_component`, `end_of_pack` | `per_component` |
| Component count | `auto` or exact integer | auto (PRISM decides) |
| Weighting | boolean | off |
| Seeded purpose | `assessment_purpose: "formative"` | always |

Depth is framed as **evidence ambition**, not difficulty or Bloom level.

---

## 3. Stage prompt contract (current assumptions)

Visible repeatedly in family Assessment prompts:

- Formative product; gathers **interpretable evidence**; supports **deterministic checking**; may later recommend what to concentrate on.
- **Does not control** the learner’s subsequent pathway (no skips, locks, routes, or remediation loops).
- Diagnostic recommendations are **advisory only**.
- Component mix: PRISM decides among **supported forms only**.
- Author stage **forbids** short constructed responses, essays, numeric entry, and any form outside the supported list.
- Design Page must not invent stimuli, knowledge summaries, study tips, or closing sections; must not rewrite component bodies.
- `feedback_note` must explain concept/relationship/distinction (not bare “correct” / answer lists).

---

## 4. Canonical artefact shapes (current)

### Plan — `artifact_type: "evidence_plan"`

Includes: `outcome_coverage`, `planned_component_count`, `count_basis`, `evidence_rationale`, `planned_component_forms[{form,count,outcome_ids}]`, `judgement_means`.

### Author — `artifact_type: "assessment_pack"`

Includes: `evidence_plan_ref` (incl. `assessment_intent`), `components[]` with `id`, `form`, `mapped_learning_outcomes` (ids only), `prompt`, `judgement`, `feedback_note`, `representation`.

### Design Page — `artifact_type: "assessment_design_page"`

Includes: `title`, `attempt_instructions`, `framing`, `assessment_intent`. **No components.**

### Assembled learner page — via `lib/assessment-pack-publish.js` → `assembleAssessmentPackPage`

Ordinary shared page envelope with Assessment-specific payload:

```text
artifact_type: "page"
schema_version: "2.0.0"
page_kind: "assessment"
activities: []
assessment_check: { items: [...] }
learning_outcomes: [{id, statement}]
attempt_instructions, framing, assessment_intent, feedback_timing
assembly_state.enriched_by includes assessment_pack + design_page
```

Items carry `item_type` (= component `form`), stem, auto_checkable, feedback_note, mapped outcomes, full prompt/judgement, optional realised representation.

**Product identity** remains workflow/product `assessment_pack`; learner page stamps `page_kind: "assessment"` / `data-page-kind="assessment"`.

---

## 5. Currently supported assessment / item forms

Source: `lib/assessment-component-forms.js` — `SUPPORTED_FORMS`

1. `single_answer_mcq`
2. `multiple_answer_mcq`
3. `ordering`
4. `classification`
5. `matching`

All authoring prompts require **`auto_checkable: true`** with deterministic judgement keys / orders / maps / assignments.

Optional representation: currently realised as SVG `data_figure` from authoritative data (fail-closed if unrealisable). Not the shared Interactive visual-affordance image path.

Module comment: “Deterministic judgement only. Not a plugin framework.”

---

## 6. Feedback semantics (current)

- **Deterministic only** — client-side check; no model call at attempt time; no pathway routing.
- **`per_component`:** Check after each item; optional “Summarise this assessment” builds an outcome evidence profile.
- **`end_of_pack`:** Finish runs checks then summary; per-item Check withheld.
- Summary reports successful/checked coverage per named learning outcome.
- Pretest adds advisory language: recommendation does not change what the learner can study and does not certify.
- Sources: `lib/learner-renderer-vnext/assessment-runtime.js`, `assessment-interactive.js`.

---

## 7. Learner interaction / workspace behaviour

- Assessment-only page body: header + intro (framing / attempt instructions) + assessment region.
- Items render as `data-workspace-kind="assessment_selection"` with form-specific controls.
- Correctness attributes embedded for client check (`data-assessment-correct`, `-correct-set`, `-correct-order`, `-correct-map`).
- Class / stamp: `util-page--assessment`, `data-page-kind="assessment"`.

---

## 8. Persistence behaviour (current)

Browser-local draft stack (`learner-draft-*.js`):

- Kind: `assessment_selection`.
- Adapter serialises **primarily** single-answer radio selections (`input[type="radio"][data-assessment-option]`).
- Multi-select, ordering, classification, and matching are interactive in UI but **not fully covered** by this adapter shape.
- Same-origin local draft only — not account / LMS / cross-device / LJ learner-state transport.

---

## 9. Publishing / package behaviour (current)

- Standalone: Design Page + pack + LOs → `assembleAssessmentPackPage` → shared learner render/export path for Assessment pages.
- Learning Journey ZIP currently **rejects** Assessment Pack constituents with `assessment_pack_unsupported_for_journey_zip` (“not yet included in Learning Journey learner packages”).
- Production/Authoring/Complete status derivation **does** recognise Assessment Pack terminal captures for LJ Preview status ladders.

---

## 10. Learning Journey commissioning behaviour (current)

- `assessment_pack` is on the LJ supported-product allow-list (`acceptsCommission: true`).
- Shared commission intake creates an ordinary Assessment Pack workflow with provenance.
- Intake does **not** currently pass Assessment-specific intent/depth/timing from commission envelopes — family defaults apply (`formative_check`, `standard`, `per_component`, topic start).
- **Educational vs shippable tension:** LJ commissioning prompt language may describe Assessment Pack as able to require essays / constructed performance; authoring prompts **forbid** those forms. Commission space is currently wider than what the product can produce.

---

## 11. Current product-boundary assumptions (embedded)

| Assumption | Where visible |
| ---------- | ------------- |
| Formative / non-pathway-controlling | Stage prompts; delivery seed `assessment_purpose: "formative"` |
| Interpretable evidence of capability mapped to learning outcomes | Evidence plan + LO mapping + summary |
| Deterministic auto-checkable forms only | Forms module + author prompts |
| Two intents only (`formative_check`, `pretest_diagnostic`) | Family resolve + Create parameters |
| Grounding from topic / source / Interactive or Expository product output | `acceptsProductOutputFrom`; starting points |
| Not Situated Task as product-output grounding (family list) | `acceptsProductOutputFrom` |
| Not nested in LJ learner ZIP yet | `app.js` journey package guard |

Sprint 88 closed Assessment Pack as a sibling first-class product with this architecture ([SPRINT-88-CLOSURE.md](../2026-09-28-sprint-88-default-product-workflows-and-assessment-architecture/SPRINT-88-CLOSURE.md)). Real-use calibration and a later educational revisit were already deferred to backlog.

---

## 12. Couplings: educational semantics ↔ current MCQ-oriented implementation

1. **Product job** is framed as evidence of capability; **runtime** is closed-form auto-check with key/order/map equality.
2. **LJ language** can ask for constructed/essay performance; **author stage** cannot ship it.
3. Learner payload reuses `assessment_check.items` with form names that are mostly MCQ-family interaction patterns.
4. Draft persistence is single-answer radio–centric despite five authored forms.
5. Evidence profile / LO mapping is the “diagnostic layer”; not mastery %, marks, or pathway control.
6. Publish isolation and LJ ZIP exclusion keep Assessment off the shared page-based package path used by Interactive / Expository / Situated Task.
7. Intent vocabulary collapses educational stopping-point roles into two buckets (`formative_check` / `pretest_diagnostic`) — insufficient to express prediction, opinion, reflection, self-review, etc., if those prove necessary.

---

## 13. Current capabilities (honest summary)

- Create Assessment Pack as first-class product.
- Plan evidence against learning outcomes; author five auto-checkable forms; Design Page framing.
- Deterministic check + explanatory `feedback_note` + optional outcome summary.
- Formative check and pretest-diagnostic intents (advisory).
- Optional exact component count / depth / feedback timing / weighting.
- Commission from Learning Journey (workflow creation + status); standalone publish.
- Optional SVG data-figure stimuli.

---

## 14. Apparent limitations (for Gate 2 to pressure-test — not defects yet)

- No supported constructed response, essay, reflection, opinion, confidence, or free-text comparison flows.
- No explicit educational-role abstraction distinct from item form / intent enum.
- No post-elicitation treatments beyond deterministic correctness + fixed feedback note + LO summary.
- Weak draft coverage for non-radio forms.
- Assessment Pack not yet nestable in LJ learner ZIP.
- Commission intake does not carry rich Assessment parameters from LJ commissions.
- Family product-output grounding excludes Situated Task.
- Possible mismatch between “stopping point / elicitation” hypothesis and current “check against LOs with closed forms” implementation.

---

## 15. Uncertainties Learning Journey evidence (Gate 2) should test

1. Where do assessment-shaped experiences naturally arise in substantial journeys (not only at the end)?
2. Which **educational roles** recur, and are they distinct from item forms?
3. When is deterministic correctness essential vs inappropriate (opinion, prediction, reflection)?
4. What must happen **after** elicitation beyond correct/incorrect + explanation?
5. What should survive as learner trace, and for whom?
6. Assessment Pack vs Interactive vs Situated Task boundary cases (especially production-for-learning vs production-for-checking).
7. What educational handoffs from prior constituents are required without assuming response-value transport?
8. Which commissions the **current** pack can fulfil vs which fail for missing educational responsibility (not missing widgets)?
9. Whether two intents + five forms are nearly enough, or whether the educational contract is materially wider.
10. Whether LJ ZIP exclusion and Situated Task grounding gaps are packaging gaps or education-contract gaps.

---

## Key file index

| Area | Path |
| ---- | ---- |
| Family / pipeline / prompts | `lib/first-class-workflow-family.js` |
| Forms | `lib/assessment-component-forms.js` |
| Assemble / publish | `lib/assessment-pack-publish.js` |
| Renderer | `lib/learner-renderer-vnext/build-page-model.js`, `render-page.js`, `assessment-interactive.js`, `assessment-runtime.js` |
| Draft | `lib/learner-renderer-vnext/learner-draft-*.js` |
| LJ commission | `lib/learning-journey-design-page.js`, `learning-journey-sibling-prompts.js`, `first-class-commission-intake.js` |
| Sprint 88 | `docs/development/sprints/2026-09-28-sprint-88-…/` |
| Backlog | PB-FA-017; Assessment Pack real-use calibration |

---

## Gate 1 sign-off

| Item | State |
| ---- | ----- |
| Baseline documented | **COMPLETE** |
| Redesign proposed | **No** (forbidden) |
| Production code changed | **No** |
| Gate 2 authorised | **Not yet** — await review of this baseline |
