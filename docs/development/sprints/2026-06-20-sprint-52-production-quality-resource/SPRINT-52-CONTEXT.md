# Sprint 52 Context

**Optimised for:** Fresh chat continuing PRISM learner-experience work **without Sprint 50/51 reconstruction**  
**Read order:** This file → open [`rendered-page-sprint-51-final.html`](./rendered-page-sprint-51-final.html) → [`SPRINT-52-HANDOVER-PACK.md`](SPRINT-52-HANDOVER-PACK.md) → [`SPRINT-52-CHARTER.md`](SPRINT-52-CHARTER.md)  
**Predecessor:** Sprint 51 — closed [`../2026-06-20-sprint-51-learner-experience/SPRINT-51-CLOSURE-REPORT.md`](../2026-06-20-sprint-51-learner-experience/SPRINT-51-CLOSURE-REPORT.md)

---

## One-line frontier

**Make the learner page an excellent learner-facing resource — within settled architecture.**

---

# What PRISM Is

PRISM is a **human-mediated pedagogic assembly environment**. It helps authors design and generate structured learning resources through explicit workflow stages, prompt contracts, and HTML-first rendering — but it does **not** autonomously teach, deliver, or manage learners.

## What PRISM does

| Capability | Meaning |
| ---------- | ------- |
| **Pedagogic assembly** | Chains workflow stages so upstream artefacts (knowledge, outcomes, activities, materials) compose into a learner page model |
| **Instructional design generation** | DLA and related stages emit activity rows with framing, cognition, and task specifications |
| **Material generation** | GAM emits pedagogic bodies (exposition, models, checklists, scenarios, etc.) under instructional pattern contracts |
| **Learner experience composition** | Design Page merges upstream captures into authoritative `page.json` with PEL field echo and GAM body preservation |
| **Manifestation** | Renderer converts `page.json` into learner-readable HTML with instructional grammar and pedagogic salience |

## What PRISM does NOT do

| Not PRISM | Implication |
| --------- | ------------- |
| **Automatically execute workflows** | A human runs each step, reviews captures, and advances the workflow |
| **Retain generated artefacts** | Outputs exist in the current session / export path only — PRISM has no memory of prior runs |
| **Know about previous workflow runs** | Each evaluation must use **fresh outputs from the current codebase** |
| **Optimise visual design** | Renderer provides restrained instructional styling, not brand/LMS polish |
| **Act as an LMS** | No enrolment, progress tracking, submission, or analytics — export is the deliverable |

**Operating assumption:** PRISM augments prompt orchestration and validates structure. Quality judgement remains human-led, informed by rendered learner pages.

---

# Learning Design Foundations

Durable educational conclusions from Learning Design work (Sprints 41–43 and subsequent learner-experience sprints). These explain **why** the current architecture exists — not how it was built.

## 1. Why instructional design matters in PRISM

PRISM is not merely content generation. Its purpose is to **assemble learner experiences** — structured journeys in which subject matter is introduced, modelled, practised, checked, reflected on, and applied.

Learning quality depends on **instructional structure** (sequence, function, coaching, models) at least as much as on subject-matter coverage. A resource can contain correct content and still fail if the learner cannot see why they are working, how to think, or what good work looks like. PRISM therefore treats instructional design as a first-class output, not an emergent side effect of prose generation.

## 2. PEL rationale

The **Pedagogic Enrichment Layer (PEL)** adds explicit learner-experience fields to activity rows — separate from task instructions and material bodies.

**Why:** Task text alone cannot carry orientation, reasoning guidance, coherence, or metacognitive support without crowding out the task. PEL fields give each function a dedicated owner on the activity row.

**What they support:**

| Function | Example PEL fields |
| -------- | ------------------ |
| **Orientation** | `activity_preamble`, page inquiry frame — why this activity matters |
| **Reasoning guidance** | `reasoning_orientation` — how to think disciplinarily |
| **Coherence** | `intellectual_coherence_bridge` — what carries forward from prior activities |
| **Transfer** | `transfer_or_application_task` — where else this applies |
| **Self-explanation** | `self_explanation_prompt` — articulate reasoning before or after checking |
| **Metacognition** | uncertainty, scaffold, evidence-use prompts — how to monitor and improve thinking |

PEL answers: *Why am I here? How should I think? How does this connect?* — before the learner reaches materials and tasks.

## 3. Meta-instruction

**Distinction:**

| Telling learners what to do | Teaching learners how to think |
| ----------------------------- | ------------------------------ |
| Task instructions, steps, deliverables | Reasoning orientation, modelling moves, quality criteria, expert lenses |
| Procedural compliance | Intellectual approach |
| "Complete the table" | "Compare texts as intellectual projects — trace author aim and defensible contrast" |

Meta-instruction became a design priority because Marx and similar audits showed **competent tasks with weak thinking guidance**: learners knew *what* to produce but not *how* to reason. PEL and cognition-orientation modules exist to make intellectual approach explicit **before** execution, not buried inside material prose.

## 4. Evaluative capability

A recurring finding: learners need support to **recognise quality**, not only to complete tasks.

Showing a model answer is insufficient. Learners also need:

| Capability | Rationale |
| ---------- | --------- |
| **Annotated models** | Expose *why* the model is strong and *what experts notice* |
| **Common mistakes** | Name weak patterns to avoid — diagnostic, not another checklist |
| **Revision guidance** | Actionable coaching when checks are not met |
| **Comparative judgement** | Weak vs strong contrasts that teach criteria, not just outcomes |

Evaluative capability turns models and checks from **templates to copy** into **quality references to understand**. Sprint 51 implemented generation and salience for the first three; comparative judgement remains prompt-level with optional renderer salience (P3).

## 5. Learner inference burden

**Principle:** Important pedagogy should be **visible**. Learners should not have to infer:

- **Why** an activity exists  
- **What** good work looks like  
- **How** experts think  
- **How** to improve when work is weak  

Inference burden drove three design responses: PEL for Orient/Think, evaluative materials for quality recognition, and manifestation/salience work so structure and coaching **read clearly** in the rendered page — not only exist in JSON. Sprint 52 continues this work at the **quality and consistency** layer.

## 6. Teaching presence

Resources should feel **taught**, not merely **presented**.

A taught resource has coaching voice, expert reasoning, guidance at decision points, and an sense that someone designed the learning path — not that content was assembled into activities. Teaching presence requires:

- **Coaching** — substantive guidance, not procedural filler  
- **Expert reasoning** — visible moves, not answer-only models  
- **Instructional voice** — consistent disciplinary tone across activities  

Sprint 43 confirmed: pedagogy often **survived generation** but **lost salience** at compose/render. Sprints 50–51 addressed structure and visibility; Sprint 52 addresses whether the whole resource **reads as well taught**.

## 7. Reflection and self-regulation

Current understanding:

| Ingredient | Role |
| ---------- | ---- |
| **Reflection** | Consolidate what was learned — post-check takeaway, closure, page-level synthesis |
| **Self-explanation** | Generative retrieval — explain reasoning before consulting a model or checklist |
| **Self-monitoring** | Checklists plus evaluative coaching — verify work *and* recognise weaknesses |
| **Metacognitive support** | Prompts for uncertainty, revision, evidence use, scaffold sequences |

These are **architecturally supported** (PEL fields, GAM materials, grammar sections). **Reflection quality** — authenticity, depth, avoidance of checkbox compliance — remains an **active Sprint 52 P1 concern**. Presence of a reflection prompt does not guarantee good reflection.

---

# What Sprint 51 Added

Sprint 51 added **deliberate learner-experience capabilities** on top of the Sprint 50 manifestation model. Treat these as designed ingredients, not incidental markdown headings.

## Annotated Models (generation)

Expert commentary inside existing material bodies:

| Section | Material | Learner function |
| ------- | -------- | ---------------- |
| **`## What experts notice`** | `worked_example` | Expert judgement — how experts read the model |
| **`## Why this works`** | `sample_output` | Quality commentary — why the exemplar is strong |

Prompt contracts: SP-06 (FM-12), SP-07 (FM-11). Weak/strong comparative headings reinforced in PEL material block.

## Evaluative Coaching (generation)

Self-regulation support inside checklists:

| Section | Learner function |
| ------- | ---------------- |
| **`## Common mistakes`** | Diagnostic warnings — weaknesses to avoid in own work |
| **`### If any check is not met:`** | Revision coaching — how to improve |

Prompt contract: SP-05 (FM-13, FM-14). Verification items remain criteria checks; mistakes and revision are **not** tick-box items.

## Preservation (compose)

GAM pedagogic bodies are **authoritatively preserved** through Design Page compose:

- Post-compose merge prefers upstream GAM when bodies differ or pedagogic richness is lost  
- Sprint 51 section markers (`What experts notice`, `Why this works`, `Common mistakes`, revision block) protected by fidelity contracts  
- Checklists upgraded from placeholder-only merge to substantive preservation  

Without this, generation improvements would be thinned before render.

## Pedagogic Salience (renderer)

Sprint 51 sections are **visually distinct** in the learner page:

| Callout | Cue | Learner reads it as |
| ------- | --- | ------------------- |
| **Expert insight** | How experts think | Expert lens on the model |
| **Quality commentary** | Why the model is strong | Why the exemplar works |
| **Diagnostic** | Weaknesses to avoid | Mistakes to watch for |
| **Revision** | How to improve | Concrete steps to strengthen work |

Implementation: `lib/ld-pedagogic-salience-render.js` — checklist split before checkbox conversion; callouts inside existing Study/Check grammar buckets. Renderer-only; no new top-level sections.

---

# Current System State

30-second orientation — what is done vs what Sprint 52 improves.

## Settled

- Seven-function instructional grammar  
- Manifestation architecture  
- Compose authority  
- GAM authority  
- PEL merge strategy  
- GAM preservation strategy  
- Annotated Models  
- Evaluative Coaching  
- Pedagogic Salience  
- Learner journey coherence  

## Open

**P1**

- Coverage consistency  
- Reflection quality  
- Teaching voice consistency  
- Model depth consistency  
- Check quality consistency  

**P2**

- Transfer authenticity review  
- Activity arc polish  
- Visual hierarchy and manifestation polish  

**P3**

- Weak/strong judgement salience (optional)  

---

# Sprint 52 Work Pattern

Sprint 52 follows a **production-quality improvement cycle**:

```
Review learner page
  → Identify quality issue
  → Design smallest viable improvement
  → Implement
  → Generate fresh artefact
  → Compare learner experience
```

**Guiding principle:** Evidence-led, minimally invasive improvements.

Do **not** redesign architecture to solve production-quality issues. Start from the [reference learner artefact](#reference-learner-artefact); validate fixes on a fresh run.

---

# Known Failure Modes

Avoid the following patterns (lessons from Sprint 51 handover):

1. **Reopening settled architecture questions** — If a learner-experience issue is observed, first assume the architecture is correct. Investigate content, generation, manifestation, coverage, or consistency before proposing architectural change.

2. **Using historical artefacts as current evidence** — Only fresh outputs from the current codebase are valid evidence.

3. **Confusing PRISM with workflow execution** — PRISM defines workflows and assembly logic. It does not execute workflows or retain generated artefacts.

4. **Starting from implementation before reviewing the learner page** — Always review the learner experience first.

5. **Proposing architecture changes before proving a learner-facing problem** — Quality issues should normally produce small instructional improvements, not architectural redesign.

6. **Solving multiple quality concerns in a single slice** — Prefer: review → **one finding** → **one fix** → fresh run → compare.

---

# Settled Architecture

These are **decisions**, not open questions. Do not reopen without explicit charter amendment and new evidence.

## Overarching learning arc

Self-directed learner pages follow a **capability arc**:

1. **Page-level orient** — inquiry, purpose, conceptual orientation (Design Page wrapper sections)
2. **Per-activity instructional journey** — Orient → Think → Study → Do → Check → Reflect → Transfer
3. **Cross-activity coherence** — bridges carry forward; final activities may carry transfer/closure

Logistics (duration, grouping) are metadata — not part of the instructional grammar.

## Seven-function instructional grammar

Accepted function model (Sprint 50, D-50-02):

| Function | Learner-facing label (grammar) | Primary owners |
| -------- | ------------------------------ | -------------- |
| **Orient** | Why this activity | DLA preamble fields; page wrapper |
| **Think** | How to approach this | DLA cognition-orientation fields |
| **Study** | Read and model | GAM materials (text, worked_example, sample_output, scenarios) |
| **Do** | What to do | DLA `learner_task`; practice materials |
| **Check** | Check your work | GAM checklist + DLA `expected_output` (unified) |
| **Reflect** | What to take away / Explain before you check | DLA cognition prompts; optional pre-check branch |
| **Transfer** | Apply elsewhere | DLA `transfer_or_application_task`; GAM transfer materials |
| **Support** (optional) | Watch for this mistake | DLA `support_note` |

**Sequencing (D-50-06):** Why → How → Study → Do → Check → Reflect → Transfer  
**Study before Do** when study materials exist (D-50-07).  
**Unified Check** — checklist and expected output in one section (D-50-08).

## Manifestation architecture

| Layer | Role | Authority |
| ----- | ---- | --------- |
| **Generation** | DLA + GAM emit pedagogic fields and material bodies | Prompt contracts in `lib/ld-*.js`, `lib/instructional-pattern-prompt.js` |
| **Compose** | Design Page builds `page.json`; PEL merge; GAM preservation overlay | `app.js` compose path; `lib/page-gam-materials-preserve.js` |
| **Renderer** | Instructional grammar sections + material role styling + pedagogic callouts | `lib/ld-instructional-manifestation-render.js`, `lib/ld-pedagogic-salience-render.js`, `app.js` |

**Layout (D-50-03):** Single-column instructional document per activity — not a persistent two-column companion sidebar.  
**Compass (D-50-09):** Progress-only (`Step N of M`) — no duplicate Orient/Think/Transfer prose.

## Compose authority

| Rule | Detail |
| ---- | ------ |
| **`page.json` is the render authority** | What the renderer reads must reflect composed + preserved state |
| **PEL merge** | DLA framing/cognition fields merge onto activity rows when upstream available |
| **GAM preservation** | Post-compose merge **authoritatively prefers upstream GAM** for learner-facing material keys when bodies differ or pedagogic richness is lost |
| **Design Page LLM** | May paraphrase/thin — preservation layer corrects; do not rely on compose alone for Sprint 51 bodies |

## GAM authority

| Rule | Detail |
| ---- | ------ |
| **GAM owns material bodies** | `worked_example`, `sample_output`, `checklist`, scenarios, tables, etc. |
| **D-49-01** | `materials.text` = connective exposition only; cognition cues on **non-text** materials |
| **Instructional patterns** | SP-01–SP-07 auto-applied on self-directed GAM (facilitator steps excluded) |
| **Sprint 51 sections** | `## What experts notice`, `## Why this works`, `## Common mistakes`, `### If any check is not met:` — generated in GAM, preserved in compose, salient in renderer |

## Preservation strategy

1. **Generate** full pedagogic bodies in GAM  
2. **Compose** into page model (may thin)  
3. **Preserve** via `applyComposedPageGamMaterialsPreserve()` — richness detection + authoritative merge  
4. **Render** with grammar + salience  

Do not assume field presence in DLA JSON alone proves learner visibility — verify `page.json` **and** rendered HTML.

## Instructional manifestation principles

1. **One primary owner per function** — avoid duplicate Orient/Think signals across Compass, framing, and materials  
2. **Function order is readable** — learner meets Why and How before What to do  
3. **Same grammar, richer semantics inside materials** — callouts sit inside Study/Check buckets, not new top-level sections  
4. **Quiet salience** — restrained borders and labels; distinguish functions without visual clutter  
5. **Evidence-led slices** — each change traces to a learner-experience finding on a **fresh run**

---

# Do Not Reinvestigate

The following are **resolved** unless new evidence (regression test failure, data-loss proof, or user charter amendment) emerges:

| Area | Resolution |
| ---- | ---------- |
| **Instructional sequencing architecture** | Seven-function grammar; fixed order; Study before Do |
| **Orient visibility architecture** | Per-activity *Why this activity* in grammar; page wrapper for inquiry |
| **Think visibility architecture** | *How to approach this* in grammar; cognition fields on DLA rows |
| **Transfer visibility architecture** | Transfer function in grammar + GAM/ DLA owners |
| **Manifestation architecture** | Compose + Renderer ownership; single-column grammar |
| **Sprint 50 preservation decisions** | Phase 1 compose fidelity, Phase 1B persistence path |
| **Compose authority decisions** | PEL merge + GAM preservation overlay |
| **Major learner journey coherence** | Journey assimilation + intellectual coherence bridge pattern established |
| **OUTPUT CONTRACT expansion** | Rejected — schema + modules suffice |
| **Prompt architecture redesign** | Generation layer frozen unless Sprint 52 slice requires narrow generation tweak |
| **Workflow gate redesign** | DLA Framing Gate v1 stable |
| **Auto-repair systems** | Rejected Sprint 49 |
| **Two-column layout reopen** | Single-column accepted |
| **“Is pedagogy preserved?”** | Answered yes for reviewed activities — focus on **quality**, not preservation archaeology |

**Exception rule:** Targeted **bug fixes** (data loss, grammar regression, preservation failure) are in scope. **Redesigns** are not.

---

# Valid Evidence

PRISM **does not retain artefacts**. Session outputs are ephemeral unless the human exports them.

## Rules for learner-experience judgement

| Do | Don't |
| -- | ----- |
| Run a **fresh workflow** from the current codebase | Treat stale exports as current truth |
| Export / capture `page.json` and `page.html` from **this run** | Default to `marx-run-artefacts-run2` for current-state claims |
| Walk rendered HTML as a learner first | Infer quality from JSON field presence alone |
| Cite finding → slice → test | Reopen Sprint 50/51 architecture investigations |

## Historical corpora (analysis only)

| Corpus | Path | Use |
| ------ | ---- | --- |
| Pre-fix Marx run | `docs/.../marx-run-artefacts-run2/` | Historical gap baseline — **not** current behaviour |
| Sprint 50 verification | `docs/.../verification-runs/2026-06-18-marx-self-study/` | Post-Sprint-50 grammar verification — **not** post-Sprint-51 default |

Use historical folders only when explicitly performing **before/after** or **regression archaeology** — label them as such.

---

# Reference Learner Artefact

**Primary reference artefact:** [`rendered-page-sprint-51-final.html`](./rendered-page-sprint-51-final.html)

This artefact is the **primary learner-experience baseline for Sprint 52**. Future reviews should **begin with this artefact** before examining implementation details. **The learner page is the review unit for Sprint 52.**

The Sprint 51 reference artefact is **retained as the baseline learner experience used for comparison**. It is **not current evidence**. Current evidence must always come from **fresh workflow outputs** generated from the current codebase.

| Artefact type | Role |
| ------------- | ---- |
| **Baseline comparison** | `rendered-page-sprint-51-final.html` — starting point for P1 audit; before/after comparison anchor |
| **Current validation** | Fresh `page.html` from a run on the **current codebase** — proof that a slice improved the learner experience |

It represents the rendered page after:

- Sprint 50 instructional manifestation work  
- Sprint 51 Annotated Models  
- Sprint 51 Evaluative Coaching  
- Sprint 51 GAM Material Preservation  
- Sprint 51 Pedagogic Salience  

| Role | Authority |
| ---- | --------- |
| **Initial quality audit / comparison baseline** | This artefact — walk as a learner; audit against P1 backlog |
| **Architecture decisions** | [Settled Architecture](#settled-architecture) and [SPRINT-52-DECISION-LOG.md](./SPRINT-52-DECISION-LOG.md) — not the HTML file |
| **Post-slice verification** | Fresh workflow run — new export is current evidence |

---

# Clean Break From Sprint 51

Sprint 52 starts from a **stable learner-experience baseline**. Do not spend time reconstructing:

- why the seven-function grammar exists  
- whether pedagogy is preserved  
- whether Sprint 51 capabilities are deliberate  
- whether PRISM retains generated artefacts  
- whether old Marx runs are current evidence  

Those questions are answered in this bootstrap pack.

**Begin Sprint 52 with production-quality review of the [reference learner artefact](#reference-learner-artefact)** — then propose narrow, evidence-led slices.

---

# Workflow Stage Responsibilities

Standard self-directed learner-page pipeline (Marx reference workflow):

## Knowledge Model

| | |
| - | - |
| **Purpose** | Structure domain concepts, relationships, and dependencies |
| **Inputs** | Learning content / source material |
| **Outputs** | `knowledge_model.json` (or equivalent) |
| **Authority** | Upstream conceptual structure for LO and activity design |
| **Must not** | Emit learner-facing page prose; substitute for activity design |

## Learning Outcomes

| | |
| - | - |
| **Purpose** | Define measurable capabilities the resource develops |
| **Inputs** | Knowledge model, learning content |
| **Outputs** | `learning_outcomes.json` |
| **Authority** | Outcome statements referenced by episode and activity design |
| **Must not** | Generate materials or page layout |

## Episode Planning

| | |
| - | - |
| **Purpose** | Group outcomes into episodes / phases of the learning journey |
| **Inputs** | Learning outcomes, knowledge model |
| **Outputs** | `episode_plans.json` |
| **Authority** | Episode structure and pacing intent |
| **Must not** | Write activity-level materials or learner page HTML |

## Learning Activity Design (DLA)

| | |
| - | - |
| **Purpose** | Specify each activity: framing, cognition, task, output, required materials |
| **Inputs** | Outcomes, sequence, episode context |
| **Outputs** | `learning_activities.json` |
| **Authority** | Activity rows, PEL fields, `required_materials[]`, task specifications |
| **Must not** | Emit final material bodies (GAM owns materials); include facilitator-only fields on learner pages |

## Material Generation (GAM)

| | |
| - | - |
| **Purpose** | Realise pedagogic material bodies per activity |
| **Inputs** | DLA row, required materials, instructional patterns |
| **Outputs** | `activity_materials.md` / structured GAM capture |
| **Authority** | All `materials.*` bodies including Sprint 51 commentary sections |
| **Must not** | Redefine activity tasks; embed cognition cues in `text` exposition (D-49-01) |

## Learning Sequence

| | |
| - | - |
| **Purpose** | Order activities and articulate progression rationale |
| **Inputs** | Learning activities, outcomes |
| **Outputs** | `learning_sequence.json` |
| **Authority** | Activity order and sequence narrative |
| **Must not** | Compose final page or render HTML |

## Design Page (Compose)

| | |
| - | - |
| **Purpose** | Assemble learner page model from upstream captures |
| **Inputs** | DLA, GAM, sequence, journey wrapper inputs |
| **Outputs** | `page.json` |
| **Authority** | Section structure, activity membership, merged PEL echo, preserved GAM bodies |
| **Must not** | Be sole authority for material body fidelity (preservation overlay required); emit final HTML |

## Renderer

| | |
| - | - |
| **Purpose** | Manifest `page.json` as learner-readable HTML |
| **Inputs** | Composed `page.json` |
| **Outputs** | `page.html` (export) |
| **Authority** | Instructional grammar order, material role styling, pedagogic callouts |
| **Must not** | Invent pedagogic content not in the model; create new instructional functions outside grammar |

---

# Pedagogic Capability Inventory

Instructional **ingredients** currently available in PRISM. Sprint 52 improves **how well** they are used — not whether the architecture supports them.

## Activity-row (DLA / PEL)

| Ingredient | Typical function |
| ---------- | ---------------- |
| `activity_preamble` / orienting fields | Orient — why this activity |
| `reasoning_orientation` | Think — disciplinary approach |
| `self_explanation_prompt` | Reflect (pre-check) / metacognition |
| `intellectual_coherence_bridge` | Cross-activity coherence |
| `prior_knowledge_activation` | Orient — activation |
| `conceptual_contrast_prompt` | Think — key distinction |
| `uncertainty_tension_prompt` | Think — productive uncertainty |
| `argument_structure_hint` | Think — response structure |
| `transfer_or_application_task` | Transfer |
| `evidence_use_prompt` | Think — evidence discipline |
| `scaffold_hint_sequence` | Think — procedural scaffold |
| `learner_task` | Do |
| `expected_output` | Check — deliverable spec |
| `support_note` | Support — misconception guard |

## GAM materials

| Ingredient | Typical function |
| ---------- | ---------------- |
| `materials.text` | Study — connective exposition |
| `materials.worked_example` | Study — modelled method (+ `## What experts notice`) |
| `materials.sample_output` | Study/Check — quality exemplar (+ `## Why this works`) |
| `materials.checklist` | Check — verification (+ `## Common mistakes`, revision block) |
| `materials.scenario(s)` | Study/Do — contextual case |
| `materials.prompt_set` | Do/Study — inquiry prompts |
| `materials.template` / tables | Do — practice structure |
| `materials.transfer_prompt` | Transfer |
| `materials.consolidation_summary` | Reflect/closure |
| `materials.reflection_prompt` | Reflect |
| `materials.modelling_note` | Study — reasoning support |
| Weak/strong judgement headings | Study — comparative judgement (prompt-level; salience optional P3) |

## Page wrapper (Design Page)

| Ingredient | Typical function |
| ---------- | ---------------- |
| Overview / inquiry frame | Page Orient |
| Learning purpose | Page Orient |
| Knowledge summary | Conceptual orientation |
| Study tips | Page-level Reflect/closure |
| Learning sequence timeline | Journey structure |

## Renderer manifestation

| Ingredient | Typical function |
| ---------- | ---------------- |
| Instructional grammar sections | Function labels and order |
| Material role styling | Model, practice, checklist, scenario, deliverable |
| Pedagogic callouts | Expert insight, quality commentary, diagnostic, revision |
| Journey compass (progress) | Step position only |
| Support note aside | Watch for this mistake |

---

# Sprint 52 Mission

Sprint 52 is **NOT**:

- an architecture sprint  
- a workflow redesign sprint  
- a pedagogic theory sprint  

Sprint 52 **IS**:

> A **production-quality learner experience** sprint — take the current learner page and make it an **excellent learner-facing resource** within settled architecture.

**Success:** A learner can move through a freshly generated resource with minimal inference about why, how, what quality looks like, how to check success, and how learning transfers — **consistently across activities**, with **excellent teaching voice** and **appropriate depth**.

---

# Current Backlog (from Sprint 51 learner-page review)

Review against [`rendered-page-sprint-51-final.html`](./rendered-page-sprint-51-final.html) unless verifying a fix on a fresh run.

## P1 — Production quality foundations

| Priority | Item | Question |
| -------- | ---- | -------- |
| P1 | **Coverage consistency** | Do all activities receive comparable Orient/Think/Study/Check/Reflect/Transfer treatment? |
| P1 | **Reflection quality** | Do reflection prompts consolidate learning, not checkbox compliance? |
| P1 | **Teaching voice consistency** | Is coaching tone disciplinary, substantive, and consistent across activities? |
| P1 | **Model depth consistency** | Do worked examples and sample outputs teach method with comparable depth? |
| P1 | **Check quality consistency** | Are checklists criteria-led with useful coaching, not procedural tick-lists? |

## P2 — Polish and authenticity

| Priority | Item | Question |
| -------- | ---- | -------- |
| P2 | **Transfer authenticity review** | Are transfer prompts genuine application opportunities? |
| P2 | **Activity arc polish** | Does the full page read as one coherent learning journey? |
| P2 | **Visual hierarchy and manifestation polish** | Is salience consistent without clutter? |

## P3 — Optional enhancement

| Priority | Item | Question |
| -------- | ---- | -------- |
| P3 | **Weak/strong judgement salience** | Should `## A weaker/stronger response would` receive dedicated callout rendering? |

---

# How to Evaluate Learner Pages

1. **Generate fresh** — full workflow or targeted stage refresh from current code  
2. **Open `page.html`** — walk one activity as a learner  
3. **Apply rubric** — Orient, Think, Study, Do, Check, Reflect, Transfer, voice, depth, inference burden  
4. **Document finding** — activity ID, observed gap, proposed slice layer (generation / preservation / renderer)  
5. **Implement narrowly** — one finding → one slice → regression tests  
6. **Re-render and re-walk** — confirm learner experience improved  

---

# Key Code (reference — not redesign targets)

| Concern | Location |
| ------- | -------- |
| Instructional patterns | `lib/instructional-pattern-prompt.js` |
| GAM preservation | `lib/page-gam-materials-preserve.js` |
| Pedagogic salience | `lib/ld-pedagogic-salience-render.js` |
| Instructional grammar | `lib/ld-instructional-manifestation-render.js` |
| DLA preamble / cognition | `lib/ld-activity-preamble-exposition.js`, `lib/ld-cognition-orientation.js` |
| Compose + render | `app.js` |

---

# Regression Anchors

Run before/after every Sprint 52 slice:

```bash
node --test tests/sprint-52-*.test.js
node --test tests/sprint-51-pedagogic-salience-render.test.js
node --test tests/sprint-51-gam-material-preservation.test.js
node --test tests/sprint-51-annotated-models-generation.test.js
node --test tests/sprint-51-evaluative-coaching-generation.test.js
node --test tests/sprint-50-phase-2-renderer-instructional-grammar.test.js
```

---

# Operating Principle

Sprint 52 assumes:

- the architecture is stable  
- the instructional grammar is stable  
- pedagogic preservation is working  
- pedagogic salience is working  

The primary question is no longer *“Is the pedagogy present?”*

The primary question is: **“How good is the learner experience?”**

**To begin Sprint 52 work:** Read this document → open [`rendered-page-sprint-51-final.html`](./rendered-page-sprint-51-final.html) → audit learner experience → identify **one** improvement slice. Do not reconstruct Sprint 50 or Sprint 51.

---

*Context v2 — Sprint 52 operating manual. Start here.*
