# Sprint 07 — Workflow Generation Rationalisation Review

**Working title:** Sprint 07 — Workflow Generation Rationalisation Review

## Purpose

Prepare and execute a **review-first** bounded sprint that maps the **workflow generation pipeline** against PRISM **v1.0 stabilisation foundations** (Sprints 03–06: runtime/definition boundaries, validation vocabulary, workflow-definition ownership, compatibility semantics, continuity discipline). The goal is **rationalisation clarity** before any implementation work—not feature expansion.

Outputs should support later decisions on domain packs, brief capture, elicitation, and generated workflow quality **without** committing to a generator rewrite in this sprint.

## Context

- Manual Workflow Builder, Prompt Library attachment semantics, and import/export compatibility paths are documented and verified through Sprint 06.
- Workflow **generation** today spans UI (workflow factory / design surfaces), `app.js` orchestration, `workflowGenerationContext.js` (domain/platform context), domain markdown under `domains/`, and external or in-app LLM-assisted flows.
- Sprint 03 explicitly deferred workflow-generation and domain-pack redesign; Sprint 07 **re-opens that topic only at the review and audit layer**.

## Scope

Review and document (no implementation in Sprint 07 unless explicitly rescoped):

1. **Domain-pack structure** — `domains/domain-manifest.json`, per-domain artefacts, step patterns, prompt rules; options for reset/rebuild vs incremental rationalisation (decision support only).
2. **Domain-specific logic audit** — Where domain assumptions live (`workflowGenerationContext.js`, `app.js` workflow-design paths, domain markdown); flag leakage of domain-specific rules into **general** app/runtime paths (anti-pattern to preserve).
3. **Elicitation lifecycle** — How design chat / elicitation phases relate to draft vs refined versions, persistence, and handoff to “save designed workflow.”
4. **Workflow brief form** — Workflow factory / brief fields (intent, audience, scale, inputs, outputs, constraints); gaps vs what generated steps later require.
5. **Generated workflow quality vs canonical contracts** — Alignment of generated steps with normalized workflow-definition expectations (step identity, prompt attachment modes, bindings, outputs).
6. **Balance: brief vs elicitation vs step settings** — Especially for **learning design (LD)** workflows: generated flows often mix **learning activities** and optional **assessment**; the review should ask whether **more design-relevant information should be captured up front** instead of over-relying on long elicitation chats or burying configuration in generated step settings.

## Non-Goals

- No generator rewrite.
- No domain-pack rewrite or wholesale reset **in this sprint** (review may recommend a later bounded implementation sprint).
- No `app.js` restructuring.
- No execution-engine / run-mode redesign.
- No new v1 feature expansion disguised as “rationalisation.”
- No addition of domain-specific logic into **general** app/runtime code paths as part of this sprint.

## Constraints

- **Prepare and review only** unless a separate chat explicitly approves implementation.
- Preserve v1.0 **behavior and compatibility** posture until a follow-on sprint scopes changes.
- Domain-pack and generation changes remain **explicitly chosen** after the audit—not implied by review prose.
- **No domain-specific logic** should be added to general app/runtime code during any follow-on unless architecture explicitly isolates it (e.g. domain modules only).

## Review Questions

1. What are the **pipeline stages** from brief → elicitation → generated scaffold → `normalizeWorkflowForV1` → saved workflow, and who owns each stage?
2. Which assumptions are **domain-pack authored** vs **hard-coded in app** vs **prompt-template** driven?
3. Where does **LD** (learning design) encode activities vs assessments in patterns, and does the **brief form** surface enough for that split without chat-only discovery?
4. How does elicitation **version state** (`draft` / `refined`) interact with save and with Prompt Library hydration boundaries?
5. What mismatches exist between **generated** step shapes and **canonical** workflow-definition contracts documented in Sprint 04?
6. What would a **minimal** domain-pack rationalisation look like vs a **full** reset—and what breaks compatibility for existing users?

## Recommended First Task

Run a **workflow generation architecture audit** and capture a single table (spreadsheet or markdown) with at least these columns:

| Column | Description |
|--------|-------------|
| **Pipeline stage** | e.g. brief capture, domain select, context load, elicitation turn, scaffold build, normalize, persist |
| **Current owner / file** | Primary module or doc (e.g. `app.js` region, `workflowGenerationContext.js`, `domains/...`) |
| **Domain-specific assumptions** | Yes/no + notes (LD vs general vs research) |
| **Inputs / outputs** | Data passed between stages |
| **Relationship to canonical workflow definitions** | Fit with `step.id`, prompt attachment modes, bindings, `normalizeWorkflowForV1` |
| **Elicitation / brief dependencies** | Which fields or chat outcomes this stage assumes |
| **Ambiguity or mess** | Duplication, hidden defaults, unclear ownership |
| **Recommended next action** | e.g. “doc only,” “defer,” “bounded implementation in Sprint 0x,” “domain-pack only” |

Do **not** start implementation until the audit is reviewed and follow-on work is explicitly scoped.

## Success Criteria

- Sprint 07 planning and starter-pack materials exist and are internally consistent with continuity docs.
- The audit table exists (or a clear placeholder section in this doc linking to the audit artefact) with initial rows filled for every major stage.
- **No** application code changes in Sprint 07 **preparation** phase; review phase remains bounded to audit + written recommendations unless rescoped.
- Clear separation between **review conclusions** and **implementation backlog** for a later sprint.

## Expected Outputs

1. This planning document kept current with a short “Review log” subsection (dates, decisions, links).
2. Workflow generation architecture audit table (markdown or linked file under `docs/consolidation/` or `docs/workflow/` as agreed).
3. Optional: short “LD brief gap” note listing fields or questions that could move **up front** vs stay in elicitation or step metadata.
4. Updated backlog entries under `docs/backlog/` for any implementation follow-ups (documentation-only pointer creation is acceptable if it helps discipline).

## Key Design Concern (LD)

For **learning design** workflows, generated workflows usually include **learning activities** and optionally **assessment**-shaped steps. The system should bias toward capturing **design-relevant information in the brief (or structured pre-steps)** where appropriate, rather than:

- relying too heavily on **long elicitation chats** alone, or
- forcing users to discover configuration needs **only inside generated step settings**.

Sprint 07 should **analyse** where that balance sits today and what rationalisation options exist—**not** implement new brief fields in this sprint unless explicitly out of scope and approved separately.

## Related References

- `workflowGenerationContext.js`
- `app.js` (workflow factory / design / save-designed-workflow regions — reference only for review)
- `domains/` (manifest, per-domain markdown)
- `docs/workflow/workflow-generation-template.md`
- `docs/consolidation/sprint-04-workflow-definition-review.md`
- `docs/development/shared-vocabulary.md`

## Review log

- **2026-05-12** — Recorded Sprint 07 review findings below (conceptual model, brief/form, early elicitation hypothesis, student-facing output, form vs chat framing, review-only constraint, backlog candidates). No implementation; no source or domain-pack edits.
- **2026-05-12 (full generation review)** — First full **workflow-generation review** session documented under **Workflow Review Findings — Learner-Facing Page Generation Pass** (architectural conclusions, page-as-assembly-surface, learner orientation, delivery context, desired outputs, assessment planning, step-configuration diagnosis, compactness, artefact integrity note, stable vs unstable matrix, synthesis framing). Review/documentation only.
- **2026-05-12 (composition model)** — Added **Page composition model (emerging)** under the same pass: orientation / learning activities / assessment, valid page variants, and conceptual link from desired outputs to composition questions. Review/documentation only.
- **2026-05-12 (closing mental model)** — Added **Current Mental Model After Workflow Review** closing section (primary LD model, composition layers, valid variants, assessment as planning dimension, step-configuration finding, stable vs unstable summary, closing synthesis). Review-only.
- **2026-05-12 (planning resolution model)** — Added **Planning Resolution and Workflow-Aware Configuration Model** (six-phase lifecycle, governing principles, four-way classification, phase-two clarification, terminology rationalisation table). Review-only.
- **2026-05-12 (pedagogic dimensions review)** — Added **Candidate Structural Pedagogic Dimensions Review** (governing question, classification table, per-dimension notes, synthesis). Review-only.
- **2026-05-12 (sequencing dimensions review)** — Added **Pedagogic Sequencing Dimensions Review** (emerging insight, observed patterns, candidate table, assembly/generation notes, caution, synthesis). Review-only.
- **2026-05-12 (Sprint 07 closeout)** — Added **Open Questions and Deferred Implementation Areas** plus **Sprint 07 closing conclusion**. Review-only; no implementation.

## Sprint 07 review findings

These are **review observations and hypotheses only**. They do not authorise implementation, new brief fields, generator changes, or domain-pack edits. Any follow-on work must be **explicitly scoped** in a later sprint and kept separate from this document’s findings.

### 1. Conceptual model finding

Workflow generation has become **more complex** in part because the **mental model evolved during implementation** rather than being fixed up front. The live system currently **mixes** several distinct ideas:

- **Lightweight scaffold generation** — quick structural workflow skeletons.
- **Prompt-orchestration / refinement chat** — conversational refinement layered on top of scaffolds.
- **Declarative domain planning** — learning-design (LD) expectations expressed via the domain pack (patterns, artefacts, rules).

That mixture can **explain** perceived code and process mess: responsibilities and entry points multiplied as each layer accreted. Sprint 07 should stay **open-minded** about outcomes: **reset or deeper rationalisation** may be appropriate in places; **incremental patching alone** should not be assumed sufficient until the audit table and tradeoffs say otherwise.

### 2. Brief / form finding

The **initial workflow brief form** may **not work well** today because it largely **predates** the clearer **LD workflow model** now implied by packs and generation behaviour. This is a **review judgment**, not a specification for new UI.

**Do not** treat the following as implementation: no new fields are proposed here. The finding is only that the form should be **reviewed from first principles** against current LD generation needs, elicitation behaviour, and canonical workflow-definition contracts—when a future sprint chooses to do that work.

### 3. Early elicitation hypothesis

**Hypothesis:** *Many current step-level settings are actually workflow-planning decisions that should be resolved before step generation.*

Some **high-value factors** are relatively **predictable** once the design intent is known. They should **probably** be surfaced earlier through **lightweight structured elicitation** (or brief-adjacent structure), rather than being deferred to **long open-ended chat** or **per-step configuration** after steps exist.

Illustrative examples (for audit discussion only—not a field list for implementation):

- Whether **assessment** is required.
- **Source content** vs **generate from topic** (input strategy).
- **Learner level**.
- **Scope**: activity / session / sequence / module.
- **Delivery context** (where/how the learning experience is consumed).
- **Activity pattern** (pedagogical shape).
- **Assessment type**, item count, feedback needs.
- **Final output / page profile** (what “done” looks like for the primary artefact).

### 4. Student-facing output realisation

**Strategic architecture note (review):** PRISM’s **primary LD generation path** appears to be **student-facing HTML learning-page generation** (the main artefact learners interact with).

Clarifications for downstream planning (still review-only):

- **Facilitator / tutor** outputs still matter, but are usually **supporting context**, not the default **primary** deliverable.
- The **design goal** is to **enhance the student learning process**; the student-facing page is the natural centre of gravity.
- **Sequencing / facilitation guidance** may be **embedded** in that experience or used to **improve** the student-facing page, rather than competing with it as an equal primary output.
- **Assessment, feedback, activities, and outcomes** should be treated as **upstream design artefacts** that **support** the final learning page **where relevant**—not as afterthoughts bolted only at step level without a clear line to the page.

### 5. Form vs chat framing

A **chat-only** workflow builder is **theoretically possible**, but likely **haphazard** unless it **reliably elicits known structural factors** that the system already depends on.

The likely direction is **not** a binary “**form vs chat**” choice, but:

> **Lightweight structured brief** (or equivalent) for **predictable planning decisions**, followed by **targeted elicitation** where **design judgement** is genuinely required and cannot be reduced to a short structured capture.

### 6. Review-only constraint (reinforced)

Everything in **Sprint 07 review findings** is **documentation of review conclusions and hypotheses**. **Do not** convert these into backlog **implementation tasks** inside this sprint except as **clearly separated future candidates** (see below). No automatic promotion to build work.

### 7. Backlog candidates (unscoped future work only)

The following are **not committed**, **not scoped**, and **not prioritised**—only **candidates** for a later backlog when someone explicitly opens an implementation or design sprint:

- Review / reset the **workflow brief model** from first principles (aligned with LD and generation pipeline).
- Define **primary LD output assumptions** explicitly (e.g. student-facing page as default primary artefact; supporting outputs documented).
- Decide which **factors** belong **up-front**, in **elicitation**, or in **step configuration** (after audit table is complete).
- **Test** generated workflows against **student-facing page quality** (method TBD in a future sprint).
- Review whether **Design Page** (or equivalent) should be treated as the **default LD assembly target** for generation outputs.

---

## Workflow Review Findings — Learner-Facing Page Generation Pass

This section captures outcomes from the **first full workflow-generation review session**, evaluated through a **learner-facing educational** lens. Same Sprint 07 constraints apply: **review and documentation only**—no implementation, no brief-field specs, no renderer work in Sprint 07 scope.

### 1. Overall architectural conclusion

The workflow-generation architecture performed **substantially better than expected** once judged through learner-facing educational criteria.

Observed strengths:

- The workflow pipeline remained **coherent** along a pedagogically meaningful chain: **normalized content → knowledge model → outcomes → activities → materials → assessment → final page**.
- The workflow stayed **compact** and **pedagogically meaningful** (not bloated into generic task lists).
- **Artefact chaining** was **strong**—upstream outputs fed later stages credibly.
- Overall behaviour resembled a **pedagogic synthesis pipeline** more than a **generic workflow generator**.

### 2. Major realisation: page as educational assembly surface

**Strategic architecture note:** The generated **HTML page** should be treated as the **primary educational assembly surface**—not merely a renderer target or an arbitrary bucket for “workflow output.”

Clarifications:

- **Upstream artefacts** naturally feed **learner-page assembly** (they compose toward the page rather than competing with it as unrelated deliverables).
- **Activities, materials, outcomes, assessment, and summaries** behave as **supporting educational artefacts** for the **learner-facing page**.
- **Facilitator guidance** is **secondary / supporting** unless a design explicitly foregrounds it.
- **Renderer implementation concerns** remain **out of scope for Sprint 07**; this finding is about **architectural role of the page**, not UI/engine tickets.

### Page composition model (emerging)

**Emerging learner-facing page model** (review vocabulary—not a schema or UI spec):

| Layer | Role in review pass |
|-------|---------------------|
| **Orientation** | Currently handled **automatically** and appears **broadly acceptable** as framing for the learner. |
| **Learning activities** | Generally **strong** from the current workflow pipeline. |
| **Assessment** | **Main source of conditional complexity** and **detailed planning parameters** when present. |

**Valid page variants** (composition outcomes to reason about in planning UX—not implementation toggles in Sprint 07):

1. **Orientation only** — minimal page; framing without activities or assessment blocks.
2. **Orientation + learning activities** — typical learning experience without a separate assessment block (formative hooks may still exist inside activities per design).
3. **Orientation + assessment** — rarer in review discussion but valid as a composition shape when activities are implicit or minimal.
4. **Orientation + learning activities + assessment** — full composition; **assessment** is where **early resolution** of planning parameters (see §6) matters most.

**Conceptual replacement for “desired outputs” (review only):** The legacy **desired outputs** framing may be **superseded in planning terms** by **page composition decisions**:

- Does the learner page **need learning activities**?
- Does it **need assessment** (as a distinct composition block)?
- If **assessment is included**, which **assessment-planning factors** (see §6) **must be resolved early** so synthesis does not bury them in downstream steps?

No field changes, no renderer work, no generator changes—**documentation of an emerging mental model** for later brief / elicitation / UX alignment.

### 3. Learner-facing orientation

The reviewed generated workflow **consistently prioritised**:

- learner **understanding**
- **conceptual progression**
- **observable** learner outputs
- **activity structure**
- **formative assessment** where appropriate
- **learner interaction**

…rather than facilitator-, admin-, or generic **process-oriented** outputs as the centre of gravity.

This **validates** the emerging **learner-experience-first** architecture model described elsewhere in this sprint’s findings.

### 4. Delivery-context finding

**“Delivery context”** increasingly appears to be a **weak or legacy abstraction** relative to what actually drove useful structure in the review pass.

Observations:

- Generated **pedagogic structures** were largely **transferable across environments** (the same design logic did not hinge on venue labels).
- The more meaningful design dimension appeared to be **learner interaction mode** and **activity structure** (how learners engage with ideas and each other).

Illustrative **high-signal** interaction patterns (examples for vocabulary, not a spec):

- small-group **conceptual analysis**
- **independent study**
- **collaborative interpretation**
- **workshop** interaction

…as opposed to treating **face-to-face / online / classroom** as the primary axis of design.

**Do not redesign** delivery-context handling in this sprint; **record only** as a review finding for later UX / brief / domain alignment.

### 5. Desired outputs finding

**“Desired outputs”** appears **conceptually unstable** in the current architecture when compared to how the reviewed workflow actually behaved.

Observed behaviour:

- The **workflow-planning model** itself largely **determined which educational artefacts were necessary**.
- Users tended to describe **learner intent** and **learning-experience goals** rather than **enumerating artefacts** up front.
- **Activities, assessments, materials, summaries, and page sections** **emerged naturally** from pedagogic planning rather than from a stable pre-listed “outputs” checklist.

**Cross-reference:** An alternative planning vocabulary is the **page composition model** (orientation / activities / assessment) and valid **page variants** documented above—**conceptually** this may replace “enumerate desired outputs” without implying new form fields in Sprint 07.

Record as an **architecture / framing** finding only—not a mandate to add or remove fields in this sprint.

### 6. Assessment-planning finding

**Principle (review):** *If a parameter **materially affects** workflow structure, artefact selection, learner interaction, assessment behaviour, or learner-page assembly, it should **usually be resolved before workflow synthesis** rather than buried in downstream step configuration.*

In the review pass, **assessment** clearly behaved as a **planning dimension**, not merely a workflow output or a late cosmetic step.

**Assessment-planning factors** that materially shaped generation (examples; not an elicitation form design):

- assessment **type**
- **item count**
- **cognitive difficulty**
- **sequencing** and **coverage**
- **formative vs summative** intent
- **feedback** expectations
- **individual vs collaborative** mode

Implications (review wording only):

- These factors **materially shape** workflow generation and page assembly.
- They should **likely** be surfaced during **early, targeted elicitation** once assessment is flagged as necessary.
- This does **not** imply **giant upfront forms** or exposing **workflow internals** to end users—only that **timing and ownership** of these decisions belong in planning semantics, not hidden in step chrome by default.

### 7. Workflow-step configuration finding

**Emerging diagnosis:** The problem is **not** that users should configure **fewer** workflow steps in principle. The problem is that **some workflow steps currently hold unresolved pedagogic planning state** that should have been settled earlier.

Examples of where that “unresolved planning in a step” showed up in discussion (illustrative, not exhaustive):

- **Design Assessment** (and similar) carrying planning weight without prior commitment on assessment intent.
- **Page-profile** assumptions left implicit until late.
- **Sequencing** assumptions distributed without a clear planning anchor.
- **Activity-mode** assumptions (how learners work) deferred into step text instead of planning.

Record as a **major Sprint 07 insight** for later UX / elicitation / brief alignment—not a step-count prescription.

### 8. Compactness finding

The reviewed workflow remained:

- **compact**
- **coherent**
- **operationally usable**

…without:

- **excessive decomposition**
- **workflow explosion**
- **bureaucratic overproduction** of steps

**Compactness** is therefore treated as a **major architectural strength** to **protect** in future rationalisation (avoid “more steps” as a default fix for planning gaps).

### 9. Structured artefact integrity note

**Smaller finding:** Structured artefacts are **highly useful** and **pedagogically meaningful**, but may still contain **unresolved internal references** or **schema inconsistencies** (e.g. relationship references pointing at **undefined concepts**).

Treat as a **future artefact-integrity review** area—**distinct from** workflow-definition validation (Sprint 04 vocabulary). No Sprint 07 remediation.

### 10. Updated likely stable vs unstable areas

| **Likely stable (review judgment)** | **Needs realignment (review judgment)** |
|-------------------------------------|----------------------------------------|
| Declarative LD planning direction | UX **terminology** |
| Learner-facing **page-first** model | Workflow **brief semantics** |
| Strong **artefact chaining** | **Delivery-context** abstraction |
| **Compact workflow** philosophy | **Desired-output** framing |
| **Targeted elicitation** (when design judgement is needed) | **Factor timing** (what must be decided when) |
| Assessment / activity **integration** in the pipeline | **Workflow abstraction leakage** into UX (users seeing plumbing instead of planning intent) |

Matrix is **hypothesis for planning**—not a commitment to freeze or rewrite any subsystem in Sprint 07.

### 11. Updated architecture framing

**Synthesis (review):** PRISM is evolving into a **learner-experience planning and synthesis system** whose **primary output** is a **student-facing HTML learning page**, **assembled** from **pedagogically meaningful upstream artefacts**.

Supporting clarifications:

- **Workflows** remain **orchestration infrastructure**—they coordinate synthesis; they are not the learner’s primary artefact.
- The **key architectural challenge ahead** is increasingly **planning semantics and UX alignment** (what to ask, when, and how to name it)—rather than **core generation capability**, which performed better than expected in this pass.

---

## Current Mental Model After Workflow Review

**Sprint 07 closing documentation**—consolidates the learner-facing review pass and page composition model into a single mental model for continuity. **Review only**; no implementation, renderer work, or domain-pack edits.

## Primary LD generation model

PRISM’s **primary LD generation path** is now understood as:

- **Student-facing HTML learning-page generation**
- **Assembled** from **pedagogically meaningful upstream artefacts**
- **Supported by** **compact workflow orchestration**

Clarifications:

- **Workflows** are **orchestration infrastructure** (they coordinate; they are not the learner’s primary artefact).
- The **learner-facing page** is the **educational assembly surface** (see also **Page composition model (emerging)** earlier in this document).
- **Renderer concerns** remain **out of scope for Sprint 07**; this section describes **product and planning architecture**, not UI engine tickets.

---

## Common learner-page composition model

Emerging **learner-page structure** (three layers):

1. **Orientation**
2. **Learning activities**
3. **Assessment**

### Orientation

Typically includes:

- **Overview** and **framing**
- **Key ideas** and **learning purpose**
- **Outcomes**
- **Source grounding**

**Observation:** Orientation is **currently generated automatically** and is **broadly successful** in review.

### Learning activities

Typically includes:

- **Learner tasks** and **interaction structure**
- **Templates / materials**
- **Expected outputs**
- **Collaborative or independent** activity guidance

**Observation:** Learning activities produced by the **current workflow pipeline** are **generally strong** and **pedagogically coherent**.

### Assessment

Typically includes:

- **Formative checks**
- **Applied questions** and **case-study tasks**
- **Feedback-oriented prompts**
- **Concept differentiation**
- **Retrieval / application** tasks

**Observation:** Assessment is the **main source of conditional workflow complexity** and **planning detail** when present on the page.

---

## Valid page variants

Valid **learner-page** composition variants (same set as the emerging model; repeated here for closing clarity):

- **Orientation only**
- **Orientation + learning activities**
- **Orientation + assessment**
- **Orientation + learning activities + assessment**

**Framing note:** The older **“desired outputs”** vocabulary may **no longer accurately describe** how workflows are **actually planned** in practice—planning aligns more naturally with **page composition** (activities? assessment? which assessment parameters?) than with enumerating artefact types up front. **Conceptual** shift only for Sprint 07.

---

## Assessment-planning insight

### Assessment as a planning dimension

**Assessment** materially affects:

- **Workflow structure**
- **Artefact selection**
- **Learner interaction**
- **Sequencing**
- **Page composition**
- **Feedback generation**
- **Cognitive progression**

**Therefore (review):** **Assessment-planning parameters** should **likely** be resolved during **early, targeted elicitation** once assessment is **flagged as required**—rather than left entirely implicit until downstream steps.

**Examples** of such parameters (illustrative, not a form spec):

- Assessment **type**
- **Item count**
- **Cognitive difficulty**
- **Coverage**
- **Sequencing**
- **Formative vs summative** intent
- **Feedback** expectations
- **Collaborative vs individual** assessment mode

**Clarification:** This does **not** imply **large upfront forms** or **exposing workflow internals** to end users.

---

## Workflow-step configuration finding

**Key finding:** Some workflow steps **still contain unresolved pedagogic planning state**.

**Clarification:** The issue is **not** that there are **too many** workflow steps in principle. The issue is that **certain pedagogically important planning decisions** remain **hidden inside downstream step configuration** instead of being owned earlier in planning / elicitation.

**Examples** (illustrative):

- **Design Assessment**
- **Sequencing** assumptions
- **Page-profile** assumptions
- **Activity-mode** assumptions

---

## Stable vs unstable areas

| **Likely stable (review judgment)** | **Needs realignment (review judgment)** |
|-------------------------------------|----------------------------------------|
| Declarative LD planning direction | UX **terminology** |
| **Compact workflow orchestration** | Workflow **brief semantics** |
| **Artefact chaining** | **Desired-output** framing |
| Learner-facing **page-first** model | **Delivery-context** abstraction |
| **Learning activity** generation | **Factor timing** (when decisions must land) |
| **Targeted elicitation**; **assessment integration** in the pipeline | **Workflow abstraction leakage** into UX (users see plumbing instead of planning intent) |

Matrix remains **hypothesis for planning**—not a freeze or rewrite commitment in Sprint 07.

---

## Sprint 07 closing synthesis

**Synthesis:** PRISM is evolving into a **learner-experience planning and synthesis system** whose **primary output** is a **student-facing HTML learning page** assembled from **pedagogically meaningful upstream artefacts**.

The **main architectural challenge** is now **semantic and planning-layer alignment** (briefs, elicitation, UX naming, factor timing)—rather than **core workflow-generation capability**, which has shown **strong** learner-facing behaviour in review.

---

## Planning Resolution and Workflow-Aware Configuration Model

**Architecture clarification (Sprint 07 review only)**—extends the learner-facing mental model with an explicit **planning-resolution** and **workflow-aware configuration** framing. Not an implementation spec, UI design, or domain-pack change.

### Core workflow-planning lifecycle

The **emerging workflow lifecycle** is now understood as:

1. **Brief**
2. **Pre-synthesis planning elicitation**
3. **Workflow synthesis**
4. **Post-synthesis workflow-aware configuration**
5. **Learner-page assembly**
6. **Rendering / presentation**

#### Brief

**Captures:**

- **Learner intent**
- **Audience**
- **Source basis**
- **Broad learning goals**
- **Obvious constraints**

**At this stage:**

- **No workflow exists yet** — nothing to bind step-level UI to.
- **No step-specific configuration** is possible in a meaningful sense.

#### Pre-synthesis planning elicitation

**Purpose:** Resolve **pedagogically structural** decisions that **materially affect** workflow generation **or** learner-page composition **before** a concrete step graph exists.

**Examples** (illustrative):

- Whether **activities** are required.
- Whether **assessment** is required.
- **Learner interaction mode** (how learners work with ideas and each other—not venue labels alone).
- **Learner level**.
- **Learner effort / duration** expectations.
- **Source-content mode** (e.g. supplied material vs generate-from-topic).

**Clarification:** This stage should remain **lightweight** and **targeted**—not a dump of every possible parameter.

#### Workflow synthesis

**Purpose:** Generate **compact pedagogic orchestration** and **discover** the pedagogic structure required for the **learner-facing page**.

**Clarification:** The **workflow** is treated as a **discovered pedagogic structure**—not merely execution plumbing. Synthesis reveals what must exist before fine-grained configuration can attach.

#### Post-synthesis workflow-aware configuration

**Purpose:** Configure **workflow-dependent pedagogic details** that only become **meaningful** once **generated steps** (and their relationships) exist.

**Examples** (illustrative):

- **Assessment type**
- **Item count**
- **Assessment difficulty** profile
- **Coverage**
- **Sequencing detail**
- **Feedback mode**

**Clarifications:**

- This phase is **not** merely “**optional refinement chat**.” It exists because **some** pedagogic configuration decisions **cannot** be made responsibly **before** workflow synthesis exposes structure.
- The phase may require **zero** questions, **minimal** questions, or **deeper targeted configuration**—depending on **generated workflow complexity** and what the brief + pre-synthesis pass already fixed.

#### Learner-page assembly

**Purpose:** Assemble the **student-facing HTML learning experience** from **generated pedagogic artefacts** and resolved planning state.

#### Rendering / presentation

**Clarification:** Renderer concerns remain **downstream implementation** matters and are **out of scope for Sprint 07** documentation beyond naming the phase.

---

### Governing architecture principle

> **Resolve pedagogically structural decisions as early as possible.**  
> **Resolve implementation and presentation detail as late as possible.**

**Corollary (review):** If a parameter **materially affects** workflow structure, artefact generation, learner interaction, assessment behaviour, or learner-page composition, it should **usually** be resolved **before or immediately after workflow synthesis**—rather than **hidden inside local step configuration** as if it were minor tuning.

---

### Planning-resolution classification model

Four **categories** for classifying planning and configuration work (review vocabulary—not enforced enums in product).

#### 1. System defaults / hidden assumptions

**Examples:**

- Learner-facing **page** as **primary** output assumption.
- **Page profile** oriented to learner (not facilitator-first) unless explicitly foregrounded.
- **Orientation** included by default where the model assumes it.
- **Session materials** include page assembly where the pipeline assumes it.

**Clarify:** These should **not** normally **burden** users in the brief; they remain **documented assumptions** for rationalisation work.

#### 2. Pre-synthesis planning factors

**Examples:**

- **Source-content mode**
- **Learner level**
- **Learner effort / duration**
- **Activities included** (yes/no / shape)
- **Assessment included** (yes/no at composition level)
- **Learner interaction mode**

**Clarify:** These **shape** workflow structure and learner-page composition; they belong in **brief + pre-synthesis elicitation**, not after synthesis unless genuinely unknowable earlier.

#### 3. Post-synthesis workflow-aware configuration

**Examples:**

- **Assessment type**
- **Item count**
- **Difficulty profile**
- **Assessment coverage**
- **Sequencing detail**
- **Feedback expectations**

**Clarify:** These **configure generated pedagogic structures** once they exist; they are **conditional** on what synthesis produced.

#### 4. Local step tuning / presentation detail

**Examples:**

- **Wording tone**
- **Formatting preferences**
- **Prompt phrasing** tweaks
- **Export options**
- **Renderer / layout** details

**Clarify:** These should remain **local** or **downstream** concerns—not confused with structural planning.

---

### Phase-two clarification

The **second** elicitation / configuration phase should **not** be framed as generic **optional refinement**.

**Instead:** It should be understood as **conditional workflow-aware configuration**—it runs **only when** generated workflow structures **require additional** pedagogic decisions that **depend on** discovered steps and dependencies.

**Why two stages exist:** Before workflow synthesis, **workflow-dependent structures do not yet exist**—so parameters that only make sense **relative to generated steps** cannot be the primary burden of the first pass.

---

### Updated terminology review

**Rationalisation table (review findings only—not implementation decisions):**

| Current term | Emerging replacement framing |
|--------------|------------------------------|
| **Desired outputs** | **Learner-page composition** (orientation / activities / assessment and valid variants) |
| **Delivery context** | **Learner interaction mode** (and related activity-structure vocabulary) |
| **Workflow configuration** | **Pedagogic planning / configuration** (lifecycle-aligned, not “plumbing knobs”) |
| **Step configuration** | **Local tuning** (wording, phrasing, minor presentation)—distinct from structural planning |
| **Deep refinement** | **Workflow-aware pedagogic configuration** (conditional, post-synthesis where structure-dependent) |

These mappings are for **documentation and UX language alignment** in future sprints—not commitments to rename fields or UI labels in Sprint 07.

---

## Candidate Structural Pedagogic Dimensions Review

**Purpose:** Identify **pedagogic dimensions** that may **materially affect** workflow structure, learner interaction, assessment behaviour, or learner-page composition.

**Clarification:** This is an **architecture-review exercise only**. These are **not** implementation decisions, field specs, or domain-pack edits.

### Governing review question

> A pedagogic dimension should be treated as **structurally significant** if changing it would **materially alter** workflow topology, generated artefacts, learner interaction structure, assessment behaviour, or learner-page composition.

---

### Classification table

| Pedagogic dimension | Likely structural significance | Current handling | Observed issues | Likely future handling | Review status |
|---------------------|-------------------------------|------------------|-----------------|-------------------------|---------------|
| **Assessment presence** | High | Partially inferred; additional detail post-synthesis | Materially changes workflow shape, assessment generation, feedback structures, page composition | Resolve during **pre-synthesis** planning elicitation | Strong evidence (workflow review) |
| **Assessment type** | High | Post-synthesis configuration | Changes generated assessment structures and pedagogic approach | **Workflow-aware** post-synthesis configuration | Strong evidence (workflow review) |
| **Learner interaction mode** (individual / pair / group / class) | High | Weakly via delivery-context assumptions | Interaction structure more meaningful than environment labels | **Replace or repurpose** delivery-context framing toward interaction-mode planning | Strong evidence (workflow review) |
| **Learner effort / duration** | High | Inconsistent via constraints / duration fields | Affects compactness, activity scope, page density | **Explicit pre-synthesis** planning factor | Strong evidence (workflow review) |
| **Source-content mode** (provided vs topic generation) | High | Partially early | Changes normalization and knowledge-modelling | **Retain** as pre-synthesis planning factor | Stable |
| **Learner level** | High | Early-stage input | Affects abstraction, terminology, cognitive demand | **Retain** as core planning factor | Stable |
| **Activity inclusion** | High | Partially inferred | Changes page composition and workflow topology | **Page-composition** planning factor | Needs further review |
| **Guidance intensity** (guided vs exploratory) | Potentially high | Mostly implicit / emergent | May affect activity structure, sequencing, scaffolding | Further **architecture review** | Open question |
| **Retrieval vs application emphasis** | Potentially high | Implicit in activity/assessment generation | May affect assessment strategy, task design, cognitive sequencing | Further review | Open question |
| **Reflection vs production emphasis** | Potentially moderate / high | Implicit | May affect learner outputs and activity design | Further review | Open question |
| **Facilitation visibility** (learner-only vs facilitator-supported) | Potentially moderate | Implicit learner-first | Facilitator guidance secondary today | **Optional overlay / support** model | Emerging direction |
| **Tone / style preferences** | Low | Local output variation | Does not materially alter workflow structure | **Local tuning** only | Stable |
| **Formatting / presentation preferences** | Low | Renderer / presentation | Not pedagogically structural | **Downstream** only | Stable |

---

### Dimension notes (same content as table, expanded)

#### Assessment presence

- **Likely structural significance:** High  
- **Current handling:** Partially inferred; additional detail resolved post-synthesis.  
- **Observed issues:** Assessment materially changes workflow shape, assessment generation, feedback structures, and learner-page composition.  
- **Likely future handling:** Resolve assessment presence during **pre-synthesis planning elicitation**.  
- **Review status:** Strong evidence from workflow review.

#### Assessment type

- **Likely structural significance:** High  
- **Current handling:** Resolved during post-synthesis configuration.  
- **Observed issues:** Changes generated assessment structures and pedagogic approach.  
- **Likely future handling:** **Workflow-aware** post-synthesis configuration.  
- **Review status:** Strong evidence from workflow review.

#### Learner interaction mode

**Examples:** individual / pair / group / class.

- **Likely structural significance:** High  
- **Current handling:** Weakly represented through delivery-context assumptions.  
- **Observed issues:** Interaction structure appears more educationally meaningful than delivery environment labels.  
- **Likely future handling:** Replace or repurpose delivery-context framing toward **interaction-mode planning**.  
- **Review status:** Strong evidence from workflow review.

#### Learner effort / duration

- **Likely structural significance:** High  
- **Current handling:** Captured inconsistently through constraints / duration fields.  
- **Observed issues:** Directly affects workflow compactness, activity scope, and page density.  
- **Likely future handling:** Explicit **pre-synthesis** planning factor.  
- **Review status:** Strong evidence from workflow review.

#### Source-content mode

**Examples:** provided content vs topic generation.

- **Likely structural significance:** High  
- **Current handling:** Already partially resolved early.  
- **Observed issues:** Changes normalization and knowledge-modelling behaviour.  
- **Likely future handling:** Retain as **pre-synthesis** planning factor.  
- **Review status:** Stable.

#### Learner level

- **Likely structural significance:** High  
- **Current handling:** Already early-stage planning input.  
- **Observed issues:** Affects abstraction level, terminology, and cognitive demand.  
- **Likely future handling:** Retain as **core** planning factor.  
- **Review status:** Stable.

#### Activity inclusion

- **Likely structural significance:** High  
- **Current handling:** Partially inferred.  
- **Observed issues:** Changes learner-page composition and workflow topology.  
- **Likely future handling:** **Page-composition** planning factor.  
- **Review status:** Needs further review.

#### Guidance intensity

**Examples:** guided vs exploratory learning.

- **Likely structural significance:** Potentially high  
- **Current handling:** Mostly implicit / emergent.  
- **Observed issues:** May materially affect activity structure, sequencing, and scaffolding.  
- **Likely future handling:** Needs further **architecture review**.  
- **Review status:** Open question.

#### Retrieval vs application emphasis

- **Likely structural significance:** Potentially high  
- **Current handling:** Implicit within activity / assessment generation.  
- **Observed issues:** May affect assessment strategy, task design, and cognitive sequencing.  
- **Likely future handling:** Needs further review.  
- **Review status:** Open question.

#### Reflection vs production emphasis

- **Likely structural significance:** Potentially moderate / high  
- **Current handling:** Implicit.  
- **Observed issues:** May affect learner outputs and activity design.  
- **Likely future handling:** Needs further review.  
- **Review status:** Open question.

#### Facilitation visibility

**Examples:** learner-only vs facilitator-supported pages.

- **Likely structural significance:** Potentially moderate  
- **Current handling:** Implicit learner-first assumptions.  
- **Observed issues:** Facilitator guidance currently secondary and lightweight.  
- **Likely future handling:** Optional **overlay / support** model.  
- **Review status:** Emerging direction.

#### Tone / style preferences

- **Likely structural significance:** Low  
- **Current handling:** Local output variation.  
- **Observed issues:** Does not materially alter workflow structure.  
- **Likely future handling:** **Local tuning** only.  
- **Review status:** Stable.

#### Formatting / presentation preferences

- **Likely structural significance:** Low  
- **Current handling:** Renderer / presentation layer.  
- **Observed issues:** Not pedagogically structural.  
- **Likely future handling:** **Downstream** concern only.  
- **Review status:** Stable.

---

### Review synthesis

The review suggests that future workflow rationalisation should focus **less** on arbitrary **workflow outputs** as a framing device and **more** on identifying **pedagogically structural dimensions** that meaningfully alter **learner-page composition**, **interaction structure**, **assessment behaviour**, or **workflow topology**.

**Clarification:** Many existing **legacy abstractions** (for example **delivery context** or **desired outputs**) may be **indirect representations** of **deeper pedagogic dimensions**—worth unpacking in later review or implementation sprints, not collapsed into Sprint 07 build work.

---

## Pedagogic Sequencing Dimensions Review

**Purpose:** Capture emerging findings that **sequencing strategy** may represent a **deeper pedagogic structure layer** within workflow generation and learner-page assembly.

**Clarification:** **Architecture-review exercise only.** **No** implementation decisions, sequencing engine changes, UI controls, or domain-pack edits.

### Emerging sequencing insight

The workflow review suggests that **pedagogic sequencing** may be **one of the most structurally significant** educational dimensions in the system.

**Observed behaviour** indicates that generated workflows already demonstrate **implicit sequencing intelligence** across:

- **Conceptual progression**
- **Cognitive difficulty**
- **Learner interaction**
- **Activity structure**
- **Assessment placement**
- **Scaffolding**

**Clarification:** Sequencing currently appears **mostly implicit / emergent** rather than **explicitly represented** in workflow-planning semantics or user-facing planning vocabulary.

### Observed sequencing patterns

From **workflow review examples**, coherent patterns appeared **without explicit user configuration**, for example:

- definitions → relationships → **causal analysis** → differentiation  
- **retrieval** → explanation → **application**  
- **guided activity** → independent response  
- **conceptual grounding** → assessment application  

These patterns read as **pedagogically coherent** despite **not** being named or toggled as “sequencing modes” in the brief.

### Candidate pedagogic sequencing dimensions

| Sequencing dimension | Educational role | Likely structural significance | Current handling | Likely future handling | Review status |
|----------------------|------------------|--------------------------------|------------------|------------------------|---------------|
| **Cognitive scaffolding progression** (e.g. easy→difficult; concrete→abstract) | Cognitive load management; conceptual development | High | Implicit/emergent via generation and step ordering | Primarily **inferred/default** sequencing intelligence; possible **lightweight** pedagogic steering | Strong evidence (workflow review) |
| **Interaction progression** (e.g. individual→pair→group; independent→collaborative) | Social learning; participation structure | High | Weakly via delivery-context assumptions | **Interaction-mode-aware** sequencing review | Emerging evidence |
| **Retrieval → application progression** | Reinforcement before transfer | Potentially high | Implicit in activity/assessment generation | Further sequencing review | Open question |
| **Guided → independent progression** | Autonomy; fading scaffolds | Potentially high | Mostly implicit | Possible **pedagogic-strategy** dimension | Open question |
| **Example → practice → transfer progression** | Skill acquisition and transfer | Potentially high | Implicit/emergent | Further architecture review | Open question |
| **Reflection → production progression** | Metacognition; synthesis | Potentially moderate/high | Implicit | Further pedagogic review | Open question |

#### Cognitive scaffolding progression

**Examples:** easy → difficult; concrete → abstract.

- **Educational role:** Supports cognitive load management and conceptual development.  
- **Likely structural significance:** High  
- **Current handling:** Implicit/emergent through workflow generation and activity ordering.  
- **Likely future handling:** Primarily inferred/default sequencing intelligence with possible lightweight pedagogic steering.  
- **Review status:** Strong evidence from workflow review.

#### Interaction progression

**Examples:** individual → pair → group; independent → collaborative.

- **Educational role:** Structures social learning and learner participation.  
- **Likely structural significance:** High  
- **Current handling:** Weakly represented through delivery-context assumptions.  
- **Likely future handling:** Interaction-mode-aware sequencing review required.  
- **Review status:** Emerging evidence.

#### Retrieval → application progression

- **Educational role:** Supports reinforcement before transfer/application tasks.  
- **Likely structural significance:** Potentially high  
- **Current handling:** Implicit in activity and assessment generation.  
- **Likely future handling:** Further sequencing review required.  
- **Review status:** Open question.

#### Guided → independent progression

- **Educational role:** Supports learner autonomy and fading scaffolds.  
- **Likely structural significance:** Potentially high  
- **Current handling:** Mostly implicit.  
- **Likely future handling:** Possible pedagogic-strategy dimension.  
- **Review status:** Open question.

#### Example → practice → transfer progression

- **Educational role:** Supports skill acquisition and transfer.  
- **Likely structural significance:** Potentially high  
- **Current handling:** Implicit/emergent.  
- **Likely future handling:** Needs further architecture review.  
- **Review status:** Open question.

#### Reflection → production progression

- **Educational role:** Supports metacognition and synthesis.  
- **Likely structural significance:** Potentially moderate/high  
- **Current handling:** Implicit.  
- **Likely future handling:** Further pedagogic review required.  
- **Review status:** Open question.

### Sequencing and learner-page assembly

The review suggests that **sequencing strategy** may influence **learner-page composition** more strongly than several **legacy abstractions** (e.g. **delivery context** or **desired outputs**).

**Examples** of structures that appeared closer to the **real pedagogic architecture** of the learner experience than environment labels such as “face-to-face” or “online”:

- **Interaction progression**
- **Scaffolding progression**
- **Cognitive sequencing**
- **Assessment placement**
- **Activity transitions**

### Sequencing and workflow generation

Generated workflows already appear to encode **implicit sequencing intelligence** through:

- **Canonical workflow ordering**
- **Artefact dependencies**
- **Activity generation**
- **Assessment positioning**
- **Progression across cognitive demand**

This suggests sequencing behaviour may already exist as **emergent workflow-policy behaviour** even though it is **not yet explicit** in workflow-planning semantics.

### Important caution

The review does **not** support exposing **detailed sequencing graphs** or **highly granular sequencing controls** to users in the current posture.

**Compactness** and **lightweight elicitation** remain **major strengths** to preserve.

Any future sequencing support should likely prioritise:

- **Inferred / default** pedagogic sequencing  
- **Lightweight** pedagogic steering  
- **Conditional refinement** only where educationally necessary  

…rather than **explicit workflow-level sequencing configuration** as a default.

### Review synthesis (sequencing dimensions)

The review suggests that many **planning abstractions** may be **indirect representations** of deeper **pedagogic sequencing strategies**.

**Sequencing** may therefore represent a **foundational educational-architecture layer** cutting across:

- activity generation  
- assessment integration  
- interaction structure  
- learner-page assembly  
- scaffolding  
- cognitive progression  

**Further review** is required before any implementation decisions.

---

## Open Questions and Deferred Implementation Areas

**Purpose:** Capture **unresolved architectural questions** and **explicitly defer** implementation decisions **beyond Sprint 07**.

**Clarification:** Sprint 07 was a **review / rationalisation sprint** focused on **architectural understanding**, not implementation. Nothing in this section authorises build work, domain-pack edits, or generator rewrites.

### Open questions

#### 1. Future workflow brief structure

**Open questions:**

- **Exact brief-field design** (what exists vs what should exist).
- **Balance** between freeform briefing and structured planning.
- How **page composition** should be **represented** in planning UX (if at all explicitly).
- How much should remain **implicit / defaulted** vs user-facing.

**Status:** **Deferred** to a future implementation / planning sprint.

#### 2. Pre-synthesis vs post-synthesis elicitation boundaries

**Open questions:**

- **Exact separation** of planning factors across the lifecycle.
- Which factors **must** be resolved **before** workflow synthesis.
- Which factors should remain **workflow-aware post-synthesis configuration**.
- When post-synthesis configuration should **trigger automatically** (if ever).

**Status:** **Architecture direction** clarified in this document; **implementation deferred**.

#### 3. Assessment-planning triggers

**Open questions:**

- When assessment should be **inferred automatically** vs elicited.
- What constitutes **assessment vs activity** at composition boundaries.
- Which assessment **dimensions** require **explicit** user resolution.
- **Default** assessment behaviours when users under-specify.

**Status:** Requires future **workflow-planning implementation review**.

#### 4. Pedagogic sequencing representation

**Open questions:**

- Which sequencing dimensions should remain **implicit**.
- Whether **lightweight sequencing steering** is needed (and where).
- How sequencing strategy should **influence learner-page assembly** explicitly.
- Relationship between **sequencing** and **interaction mode**.

**Status:** **Further review** required before implementation.

#### 5. Interaction-mode modelling

**Open questions:**

- How learner **interaction structures** should be represented in planning semantics.
- Relationship between **interaction mode** and **delivery context**.
- Whether **delivery-context** terminology should be **retired**, **repurposed**, or layered.

**Status:** **Deferred**.

#### 6. Hidden planning state in workflow steps

**Open questions:**

- Which current **step settings** represent **unresolved pedagogic planning state** vs legitimate local tuning.
- Which settings should remain **local tuning** only.
- How much **configurability** should remain exposed vs folded into planning.

**Status:** **Future rationalisation** required.

#### 7. Implicit pedagogic intelligence

**Open questions:**

- Which pedagogic behaviours should remain **inferred / defaulted**.
- Which should become **explicit planning controls** (if any).
- How to preserve **workflow compactness** while increasing pedagogic steerability.

**Status:** **Future review** required.

---

## Sprint 07 closing conclusion

Sprint 07 established that the **core workflow-generation and pedagogic orchestration architecture** is **substantially coherent** and already **aligns strongly** with **learner-facing page synthesis**.

The **primary architectural challenges** are now concentrated in:

- **Planning semantics**
- **Elicitation timing**
- **Terminology**
- **Sequencing representation**
- **Assessment-planning surfacing**
- **Legacy abstraction alignment**

The review does **not** support **major generator rewrites**, **execution-engine redesign**, or **domain-pack restructuring** at this stage.

**Future work** should focus on **rationalisation and semantic alignment** while preserving:

- **Compact workflows**
- **Strong artefact chaining**
- **Learner-facing coherence**
- **Lightweight elicitation**
- **Emergent pedagogic sequencing behaviour**

---

## Portable sprint pack

- `docs/development/sprints/2026-05-12-sprint-07-workflow-generation-rationalisation-review/` (includes `context-files/` with physical copies for chat bootstrap)
