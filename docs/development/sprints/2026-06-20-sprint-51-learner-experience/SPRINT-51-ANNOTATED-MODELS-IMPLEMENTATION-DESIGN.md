# Sprint 51 — Annotated Models Implementation Design

**Mode:** Design only — no implementation in this document  
**Problem:** Learners see model answers and worked examples (**what** good work looks like) but not consistent explanations of **why** they are effective.  
**Constraint:** Minimum change to Sprint 50 architecture — no workflow stages, no new schemas, prefer existing material structures and manifestation grammar.  
**Authority:** [SPRINT-51-ANNOTATED-MODELS-AUDIT.md](./SPRINT-51-ANNOTATED-MODELS-AUDIT.md)

---

# Current State

## What works today

| Layer | State |
| ----- | ----- |
| **DLA** | Declares `required_materials` with `type` (`worked_example`, `sample_output`, `modelling_note`) and `specification` — obligations only, not bodies |
| **GAM** | Realises full markdown bodies; SP-06 mandates step reasoning + `**Bridge:**` on `worked_example`; SP-01–SP-05 cover other types; `buildSelfDirectedGamPelReasoningMaterialPromptBlock()` asks for visible reasoning on modelled materials |
| **Compose** | `page.json` stores bodies in `materials.worked_example`, `materials.sample_output`, etc. — GAM preservation via `lib/page-gam-materials-preserve.js` |
| **Renderer** | Sprint 50 grammar → **Read and model** (Study) for models; `util-worked-example util-material-role-model` wrapper; markdown subsections render as plain prose — **no annotation-specific styling** |

## The gap (fresh Marx verification run)

- `worked_example` bodies are present but often **step lists without expert quality commentary** (e.g. Activity 3: steps + checklist embedded in the same block).
- `sample_output` is **specified in DLA** on some activities but **not always realised** on composed `page.json` — when absent, there is no product exemplar to annotate.
- `modelling_note` / worked judgement is **referenced in `learner_task`** but **missing from materials** on some activities — learners are told to consult expert modelling that was not generated.
- Checklists define **verification criteria** but do not substitute for annotated models.

## Architectural conclusion (from audit)

Quality commentary **already belongs** in material markdown bodies. There is no missing persistence path or renderer capability for inline annotations. The gap is **GAM generation coverage and convention**, not workflow or schema design.

---

# Candidate Approaches

## A. GAM-only — markdown subsection conventions (recommended baseline)

**Idea:** Extend instructional pattern prompt blocks so GAM **must** append a standard commentary subsection after the model body.

| Material | Subsection heading | Content |
| -------- | ------------------ | ------- |
| `sample_output` | `**Why this works:**` | 3–5 bullets naming quality features tied to `expected_output` |
| `worked_example` | `**What experts notice:**` | 2–4 bullets on why the method/steps are effective (distinct from Bridge) |
| `worked_example` (purpose: worked judgement) | `**A weaker response would:**` / `**A stronger response:**` | Contrast pair (aligns with existing `weak_worked_judgement` / `strong_worked_judgement` markers) |
| `modelling_note` (judgement purpose) | Same weak/strong pattern | Already specified in 44-2 §5.3; reinforce in GAM prompt |

**Representation:** Inline markdown after model content, before `**Bridge:**` (worked examples) or after exemplar blockquote (sample outputs).

**Render:** Existing markdown pipeline — no renderer change required for MVP.

| Pros | Cons |
| ---- | ---- |
| Smallest diff; no schema; uses existing storage and grammar | Salience depends on prose alone; models may omit subsection |
| Aligns with 44-2 §5.5 strong realisation | Requires GAM re-run to see effect |

---

## B. GAM + lightweight renderer salience

**Idea:** Same as A, plus post-process rendered material HTML to wrap recognised commentary headings in a semantic callout.

Detect headings (case-insensitive, markdown-rendered or pre-wrap):

- `Why this works`
- `What experts notice`
- `Why each step matters`
- `A weaker response would` / `A stronger response`
- `The key strength here is`

Wrap in:

```html
<aside class="util-model-commentary util-material-role-guidance" role="note">…</aside>
```

Place **inside** existing `util-worked-example` or material block — still one material string, no new fields.

| Pros | Cons |
| ---- | ---- |
| Improves learner visibility without new data model | Slightly more code; heading vocabulary must stay stable |
| Complements Sprint 50 grammar sections | False positives if domain content uses same phrases |

---

## C. New activity-row or materials JSON fields

**Idea:** `quality_annotation`, `model_commentary[]`, or split `body` / `annotation` on materials.

**Rejected for Sprint 51:** Requires schema, compose merge, DLA OUTPUT changes, and renderer ownership — disproportionate to the problem when markdown subsections already work.

---

## D. DLA-authored commentary

**Idea:** DLA generates annotation text; GAM copies it.

**Rejected as primary:** DLA should declare obligations; GAM realises domain-specific exemplar bodies. Commentary must be tied to the model content GAM produces. Optional DLA `specification` hint ("include why-this-works annotation") adds little beyond tightening GAM patterns.

---

## E. Checklist / expected_output as commentary carrier

**Idea:** Move quality explanation into Check section only.

**Rejected:** Checklists teach **verification**, not **exemplar quality**. `expected_output` is deliverable shape, not annotated model. Audit confirms these are complementary, not substitutes.

---

# Recommended Approach

**Two-phase, single ownership principle:** *Generate commentary in GAM material bodies; manifest with existing Sprint 50 Study/Check sections; optionally elevate salience in renderer.*

## 1. Where it should be generated

| Layer | Role |
| ----- | ---- |
| **GAM** | **Primary** — all annotation prose lives in `activity_materials` bodies |
| **DLA** | **No change required** for MVP — existing `required_materials` types suffice; optional future: specification phrase "annotated exemplar" when `sample_output` listed |
| **Design Page / compose** | **Pass-through** — preserve GAM bodies verbatim (existing preserve path) |
| **Renderer** | **Optional Phase 2** — callout wrapper only; no new fields |

## 2. How it should be represented

**Dedicated markdown subsections** inside existing material types — not a new semantic type.

### Canonical subsection vocabulary (GAM prompt enforces)

| Context | Required subsection | Min content |
| ------- | ------------------- | ----------- |
| `sample_output` | `**Why this works:**` | ≥3 bullets using "because / shows / demonstrates / avoids" language |
| `worked_example` | `**What experts notice:**` | ≥2 bullets on method quality (after steps, before `**Bridge:**`) |
| `worked_example` / `modelling_note` with judgement purpose | `**A weaker response would:**` + `**A stronger response:**` | One short weak slogan-style + one criteria-led strong (existing fidelity markers) |

Boundary line (sample_output only):

`Use this as a quality guide, not as text to copy.`

### Material type mapping (unchanged keys)

| Learner sees | `page.json` key | Role family |
| ------------ | --------------- | ----------- |
| Worked example + commentary | `materials.worked_example` | `worked_example` / `worked_judgement_support` |
| Sample output + commentary | `materials.sample_output` | `sample_output` / `model_answer` |
| Judgement contrast | `materials.worked_judgement_weak_strong` or judgement-purpose `modelling_note` | `worked_judgement_support` |

## 3. How it should render

| Phase | Behaviour |
| ----- | --------- |
| **Phase 1 (MVP)** | Commentary renders as markdown inside **Read and model** (`util-instructional-study`) or **Check your work** when `sample_output` is post-check partitioned — no new CSS |
| **Phase 2 (optional)** | `utilityWrapModelCommentarySections(html)` wraps canonical headings in `util-model-commentary` aside; scoped CSS in `app.js` export styles (muted guidance panel, same family as `util-support-note` but under model block) |

Grammar order unchanged: Study → (Explain before you check) → Do → Check.

## 4. Prompt implementation (GAM)

Extend `lib/instructional-pattern-prompt.js`:

| Change | Detail |
| ------ | ------ |
| **SP-06 extension** | After existing Bridge rules, require `**What experts notice:**` subsection on every `worked_example` |
| **SP-07 (new block)** | `sample_output` pattern — annotated exemplar per 44-2 §5.5; require `**Why this works:**` + anti-copy boundary; FM if exemplar has no annotation |
| **Judgement reinforcement** | One bullet in `buildSelfDirectedGamPelReasoningMaterialPromptBlock()` (`app.js`): when `purpose` matches worked judgement, weak/strong subsections required |

Wire SP-07 into `applyInstructionalPatternPromptBlockToDraft` alongside SP-01–SP-06 (same module pattern — **not** a new OUTPUT CONTRACT layer).

Optional advisory gate in `lib/gam-output-format.js`: warn when `sample_output` body lacks `/Why this works/i` — **non-blocking** for MVP to avoid regressions on thin captures.

---

# Files Affected

## Phase 1 — GAM annotation conventions (smallest viable slice)

| File | Change |
| ---- | ------ |
| `lib/instructional-pattern-prompt.js` | Add `SP07_LINES`, `buildSp07PromptBlock`, marker helpers; extend `SP06_LINES`; register in `applyInstructionalPatternPromptBlockToDraft` |
| `app.js` | Extend `buildSelfDirectedGamPelReasoningMaterialPromptBlock()` — judgement weak/strong + annotation cross-ref |
| `tests/workflow-instructional-pattern-prompt.test.js` | SP-07 presence, GOOD shape, FM wording; SP-06 extension tests |
| `tests/sprint-51-annotated-models-generation.test.js` | **New** — fixture GAM draft receives blocks; optional body marker regex tests |

## Phase 2 — Renderer salience (optional, after Phase 1 verified)

| File | Change |
| ---- | ------ |
| `lib/ld-model-commentary-render.js` | **New** — `wrapModelCommentarySectionsInHtml(html)` |
| `app.js` | Call from `utilityTagMaterialBlockHtml` or instructional Study material render path |
| `index.html` | Script tag if new lib |
| `tests/prism-vm-lib-bootstrap.js` | Load lib in VM tests |
| `tests/sprint-51-annotated-models-render.test.js` | **New** — commentary wrapper + grammar section placement |

**Not affected:** DLA libs, workflow gates, compose merge, `page.json` schema, episode plan, ontology.

---

# Example Before/After

*Synthetic example based on fresh-run shape (Activity 3–style worked example). Domain: inflation classification.*

## Before (current generation pattern)

```markdown
### Worked Example

In 2023, rising global commodity prices combined with strong consumer demand led to inflation.

*Step 1:* Identify price pressures.
*Step 2:* Examine affected agents.
*Step 3:* Classify inflation cause(s).
```

**Learner gets:** (a) a model sequence — **not** (b) why the reasoning is strong.

## After (Phase 1 target)

```markdown
### Worked Example

In 2023, rising global commodity prices combined with strong consumer demand led to inflation.

**Step 1:** Identify price pressures — separate cost shocks from demand pressure before labelling a single cause.
**Step 2:** Examine affected agents — note who gains and loses under each mechanism.
**Step 3:** Classify inflation cause(s) — justify with evidence, not headline labels.

**What experts notice:**
- Effective classifications name *both* mechanism and affected agents, not just "inflation went up".
- Strong responses distinguish cost-push and demand-pull when both are present instead of forcing one label.
- Evidence is tied to the scenario details, not generic textbook definitions.

**Bridge:** Apply the same three-step sequence to your assigned scenario — do not copy this case's conclusion.
```

## Sample output after (when DLA lists `sample_output`)

```markdown
### Annotated sample response

> [Parallel scenario response demonstrating structure and depth expected in expected_output…]

**Why this works:**
- Opens with the classification claim, then supports it with scenario-specific evidence
- Names mechanisms separately when hybrid causes are plausible
- Avoids asserting certainty where the scenario leaves ambiguity

Use this as a quality guide, not as text to copy.
```

**Rendered location:** Study section (*Read and model*) under existing grammar — commentary appears immediately below the model body.

---

# Risks

| Risk | Mitigation |
| ---- | ---------- |
| **Annotation spoils learner task** | MP-1 unchanged — parallel item only; anti-copy boundary on sample_output; judgement columns stay empty on tables |
| **Redundancy with checklist** | Commentary explains *exemplar quality*; checklist verifies *learner work* — prompt forbids duplicating checklist bullets verbatim |
| **Compose thinning** | Rely on existing GAM preserve path; verify on capture sync after GAM step |
| **GAM non-compliance** | Phase 1: prompt-only; Phase 1b: optional advisory gate before blocking |
| **Token / length pressure** | Subsection caps in prompt (3–5 bullets max); no second material type |
| **Renderer false-positive wrap** | Phase 2 uses allowlisted heading patterns only |
| **sample_output still absent** | Annotation pattern does not fix missing materials — separate GAM realisation issue; MVP success measured on activities that **have** model materials |

---

# Smallest Viable Slice

## Scope

**Phase 1 only — GAM prompt extension, zero renderer change.**

### Deliverables

1. **SP-07** — `sample_output` annotated exemplar pattern (`**Why this works:**` + bullets + boundary line).
2. **SP-06 extension** — `**What experts notice:**` required on all `worked_example` bodies (in addition to existing Bridge).
3. **One line** in `buildSelfDirectedGamPelReasoningMaterialPromptBlock()` reinforcing weak/strong sections when judgement purpose applies.
4. **Tests** for prompt surface and marker presence.
5. **Verification:** Re-run Marx workflow (or GAM step only on existing DLA); confirm `page.html` shows commentary subsections under **Read and model** / **Check your work**.

### Out of scope for MVP slice

- New JSON fields or DLA schema lines
- Renderer `util-model-commentary` callout (Phase 2)
- Blocking GAM gate on missing annotations
- `rubric` / `quality_criteria` material types
- Changes to Sprint 50 grammar order or compose logic

### Success check

On at least one activity with `worked_example` and one with `sample_output` in composed `page.json`, a learner reading **Read and model** can answer:

> *Why is this model effective — not just what does it show?*

without inferring from step labels alone.

### Estimated touch surface

~120 lines in `instructional-pattern-prompt.js`, ~15 lines in `app.js`, ~80 lines of tests — no `page-role-registry` or instructional grammar changes.

---

# Decision summary

| Question | Answer |
| -------- | ------ |
| Where generated? | **GAM** — markdown subsections in existing material bodies |
| How represented? | **Inline markdown** — `**Why this works:**`, `**What experts notice:**`, weak/strong pairs |
| How rendered? | **Phase 1:** existing Study/Check sections; **Phase 2 (optional):** commentary callout wrapper |
| Smallest proof? | **SP-07 + SP-06 extension** in `instructional-pattern-prompt.js` only |

This satisfies the success criterion with the minimum change to the Sprint 50 architecture: learners see model content **and** expert quality explanation, carried in structures PRISM already owns.

---

*Design v1 — ready for implementation slice approval.*
