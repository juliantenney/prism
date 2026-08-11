# S75-T-010 — Operator observation synthesis (Domains A, B & C)

> **Historical discovery / evidence artefact (2026-08-10).**  
> Observations and hypotheses below describe the product **as experienced during that walkthrough**. They have **not** been rewritten to match later Sprint 75 Create UX (`S75-D22`–`D25`) or persistence (`S75-D21`) outcomes.  
> **Current product state:** [STATUS.md](STATUS.md) · [decisions.md](decisions.md) · [next-chat-briefing.md](next-chat-briefing.md).

**Evidence type:** Primary operator observation (Julian)  
**Dates recorded:** 2026-08-10 (Domain A Create Workflow); 2026-08-10 (Domain B My Workflows / Run); 2026-08-10 (B→C handover + Domain C Authoring)  
**Mode:** DISCOVERY ONLY — observations and hypotheses only in this document  
**Fulfils:** [S75-T-010](S75-T-010-primary-journey-map-and-domain-a-decomposition.md) §7 operator checklist (Domain A); Domain B Run walkthrough; Domain C Authoring walkthrough (see Parts II–III)  
**Binding context:** [S75-D02](decisions.md#s75-d02--sprint-75-follows-the-product-journey-and-major-product-surfaces-sequentially) · experience-before-implementation

**Structure:** **Part I** — Domain A (Create Workflow). **Part II** — Domain B (My Workflows / Run). **Part III** — B→C handover + Domain C (Authoring). Parts added incrementally 2026-08-10; earlier parts retained as originally recorded.

---

## 1. Observation scenario

| Field | Value |
| ----- | ----- |
| **Domain pack** | Learning Design |
| **Workflow name** | Programme Manager CPD |
| **Design intent** | Create a 60 minute self study resource for programme managers on the topic “Managing Risk” |
| **Audience** | University Staff |
| **Scope / size** | 60 minutes |
| **Starting point** | Generate content |
| **Part I surface** | Domain A — Create Workflow |
| **Part I extent** | Creation → generation → refinement → save/handoff into My Workflows (Run touched post-save; Settings touched during creation) |
| **Part II surface** | Domain B — My Workflows (Run primary; Settings/Edit observed for orientation) |
| **Part II extent** | Entry/orientation → step execution through final page-artefact step |
| **Part III surface** | B→C handover + Domain C — Authoring |
| **Part III extent** | Authoring entry → **Assemble From Current Workflow Run** → preview/inspection → optional enrichment (Graphics / Video / Resources) → export |
| **Primary journey extent (overall)** | Create Workflow → My Workflows / Run → Authoring → enrichment → inspection/export — **substantive pass complete** |
| **Saved workflow shape** | 10 steps (refined from original 8 — see §3.12, §3.20) |

**Explicit non-claim:** This is one experienced-operator pass on one LD workflow. Findings are evidence and hypotheses — not generalised usability verdicts for all users or domains.

---

## 2. Evidence classification key

| Label | Meaning |
| ----- | ------- |
| **OBSERVATION** | What the operator directly experienced |
| **USER EXPECTATION** | What the operator expected or assumed |
| **FRICTION** | Where expectation and experience diverged uncomfortably |
| **HYPOTHESIS** | Possible explanation — not established fact |
| **POSSIBLE IMPROVEMENT** | Candidate direction for later discovery/decision — **not** an accepted design decision |

Positive evidence is recorded explicitly throughout.

---

## 3. Findings by theme

### 3.1 Application entry & orientation (maps to A0)

**Positive (OBSERVATION):**

- On arriving at Create Workflow, the purpose of the surface is understandable.
- The operator expects it to help create a workflow.
- Explanatory/help text on form fields is important to successful use.
- Initial/basic fields are reasonably straightforward.

**FRICTION (OBSERVATION + USER EXPECTATION):**

- A new user does not necessarily know at entry that an OpenAI API key is required to generate a workflow.
- The relationship between the API-key control (header) and Create Workflow is not clear until encountering the disabled **Design workflow** button.

**Journey question:** Can a first-time user start the intended journey without discovering the API prerequisite too late?

**Interaction question:** Should the enabling prerequisite be visible before brief investment?

**Presentation question:** Is the header API control legible as a gate for this tab specifically?

---

### 3.2 Workflow basics / intent capture (maps to A2–A3)

**Positive (OBSERVATION):**

- Users can naturally describe intent in ordinary language.
- PRISM appears capable of interpreting several forms of description.
- Duration, audience, and topic fit naturally into the brief.

**FRICTION — capability visibility (OBSERVATION + USER EXPECTATION):**

- “What are you trying to design or produce?” appears open-ended, but the Learning Design path currently supports a **narrower** set of final output forms.
- Operator understanding of currently meaningful LD choices: **self-study resource** and **workshop**.
- Users may not know output type must be encoded in free-text design intent (e.g. “Create a 60 minute self study resource…”).

**POSSIBLE IMPROVEMENT (not a decision):** Consider making supported output type an explicit choice rather than implying arbitrary output capability through an unrestricted field.

**FRICTION — field decomposition (OBSERVATION):**

- Users naturally repeat information across fields (e.g. “60 minute” in intent and Scope / size).
- **Discovery question:** Should PRISM tolerate information wherever users provide it vs requiring field decomposition literacy?

**FRICTION — later optional fields (OBSERVATION + cognitive load):**

- Input details, Learner-facing page and supporting outputs, Scope and constraints were harder to understand.
- Even the experienced operator was not confident how these steer the content pipeline toward desired resource characteristics.
- **Classification:** INTERACTION / cognitive load / possible engineering-concept leakage.

**Do not conclude:** These fields should be removed.

---

### 3.3 API key gate (maps to A1)

**OBSERVATION:**

- After filling sufficient workflow basics, **Design workflow** remained disabled — no API key loaded.
- The UI did not explain at the disabled action **why** it was disabled or what would enable it.
- Experienced sequence: complete brief → reach Design workflow → action unavailable → no local explanation.

**OBSERVATION (after key loaded):**

- Header exposed Creativity, Response Detail, token counts, approximate cost.
- Generation capability became available.

**HYPOTHESIS — product model (architectural/product strategy — not implementation scope):**

- Create Workflow directly invokes an LLM via API; much of the rest of PRISM follows bring-your-own-LLM patterns.
- Possible future strategic questions ( **outside this task** ): BYO LLM for workflow creation; optional API execution for Run/graphics.
- **UX question preserved:** Does PRISM have a coherent user-facing model for when PRISM performs an AI operation vs when users take prompts to an external LLM?

---

### 3.4 Brief resolution / elicitation (maps to A4–A6)

**OBSERVATION:**

- After **Design workflow**: PRISM resolved the brief; “Resolved workflow brief (complete)” disclosure appeared; PRISM determined whether further elicitation was needed.
- **This run:** no additional pre-generation questions — experienced sequence effectively **Design workflow → Designing… → Ready** rather than distinct user-perceived A4/A5/A6 stages.

**Positive (OBSERVATION):**

- PRISM did not ask unnecessary questions when it had enough information.

**Synthesis (OBSERVATION + assessment):**

- **Elicitation is a mechanism, not necessarily a user-experienced journey stage.**
- Resolved workflow brief exposes PRISM’s interpreted parameters.
- Useful for debugging / experienced inspection; most normal users probably have little reason to inspect most parameters.
- **Positive retained:** transparency has value.
- **Question:** Is current representation appropriate for normal users vs experts?

---

### 3.5 Settings during creation (Domain A/B boundary)

**OBSERVATION:**

- PRISM tells the user they can adjust Settings.
- Workflow not yet saved, yet Settings links/actions can move user into **My Workflows**.
- Blurs boundary between transient/generated workflow design and persisted saved workflow.
- Settings surface can expose many parameters users may not understand.

**Product intent (operator — durable context, not a new decision):**

- **Full elicitation is NOT the target** (deliberately discussed previously).
- Observed workflow exposes **25 Settings**; ~25 elicitation questions would be too lengthy.
- Intended broad model:
  - elicitation obtains enough consequential information for a viable workflow;
  - defaults handle many parameters;
  - Settings exposes deeper parameterisation later;
  - reusable workflows should be configurable without recreating them.

**Do not infer:** All Settings should move into elicitation.

---

### 3.6 Workflows as reusable / parameterised objects

**Product intent (operator — for later discovery):**

- A workflow is not necessarily a one-off design for one topic.
- Workflows may be generic and reusable (e.g. uploaded lecture transcript → follow-up learner resource).
- Desirable to parameterise so topic/input can change while structure remains.

**Discovery distinction (unresolved):**

- creation-time decisions
- reusable workflow defaults
- per-run parameters
- step-specific tuning

**Do not resolve** these boundaries in this document.

---

### 3.7 Settings coverage — open evidence gap (Domain B future)

**OBSERVATION:**

- Operator has **not** systematically exercised Settings surface.
- Cannot confidently say: whether all settings work; how strongly each affects generation; whether labels/descriptions match effect; whether all steps expose needed settings.

**OBSERVATION (example):**

- Observed workflow: 25 Settings exposed.
- Some steps report no pack-declared Settings controls.
- Design Episode Plan (operator knowledge): added later, currently no settings — may be omission.
- Other steps may also have no settings.

**Future Domain B investigation questions (not executed now):**

1. Does each supported workflow step expose settings where appropriate?
2. Are missing settings intentional or implementation omissions?
3. Does each setting actually affect downstream behaviour?
4. Is each effect understandable from the UI?
5. Is the setting at the right level (definition / default / per-run / elicited / not user-facing)?
6. Are settings complete/coherent across the supported step catalogue?

**Note:** Controlled A/B execution (same workflow/input, alter one setting, compare artefact) may be appropriate later — **not** now.

---

### 3.8 Workflow generation / review (maps to A7, A9)

**Positive (OBSERVATION):**

- User can inspect workflow before commitment.
- Step titles / purposes visible.
- Steps can be deleted / lightly edited.

**FRICTION — journey (OBSERVATION + USER EXPECTATION):**

- Most users unlikely to know whether proposed orchestration is “good”.
- No learner-resource preview at this point — workflow not yet run.
- Users need experience or guesswork to infer output quality from internal workflow steps.

**Journey question (OBSERVATION):**

- PRISM asks users to evaluate workflow design before experiencing output of that workflow.
- May suit expert workflow designers; may not suit users whose goal is simply “make me a good 60-minute self-study resource.”

**Do not decide** a solution.

---

### 3.9 Review & suggest improvements — discoverability (maps to A10)

**OBSERVATION:**

- Initially, clicking **Review & suggest improvements** appeared to do nothing.
- Further observation: action **did** work — new elicitation appeared **higher** on the page in Workflow design assistant shell.
- Operator was looking at generated workflow lower on page; new question was **off-screen**.

**FRICTION classification:** Discoverability / navigation / state-feedback — not necessarily broken action.

**Cross-cutting theme:** STATE / LOCATION FEEDBACK.

---

### 3.10 Post-generation review / QA suggestions (maps to A8, A10)

**OBSERVATION:**

- Sequential yes/no suggestions, e.g.:
  - add review step after generating learning content before knowledge modelling;
  - add review step around learning outcomes;
  - add QA step after activity materials.
- Interaction proceeded through several workflow stages.

**FRICTION:**

- Repeated yes/no decisions → cognitive load.
- Users cannot easily judge consequences of accepting a review step.
- Not shown clearly what added step will consume, produce, cost, or require at Run.
- Suggestions expressed in internal workflow-orchestration terms vs desired characteristics of final resource.

**OBSERVATION — state terminology:**

- Status badge showed **Complete** while assistant still asking review questions.
- Record as possible state terminology inconsistency.

**Cross-cutting themes:** CONSEQUENCE VISIBILITY · EXECUTABLE TRUTH (see §3.12).

---

### 3.11 QA / review step provenance (HYPOTHESIS only)

**HYPOTHESIS / provenance question (operator recall — not established fact):**

- QA/review workflow steps may have been explored previously and possibly abandoned; operator cannot currently remember why.
- **Do not claim** QA steps are unsupported.

**Later supporting evidence may need:**

- Are QA/review steps valid supported step types?
- What artefact contracts do they have?
- Why earlier QA work may have been abandoned?
- Why reviewer can currently propose them?

**No architecture/runtime changes from this document.**

---

### 3.12 Refinement / executable-integrity concern (maps to A10, A11, Domain B Run)

**OBSERVATION:**

- Operator accepted review suggestions.
- Refined displayed workflow visibly gained review steps (e.g. Review Learning Content, Review Learning Outcomes).

**OBSERVATION (Run, post-save — initial):**

- Runnable 10-step workflow did **not obviously** reflect promised sequencing.
- Example: PRISM proposed review **after** generated learning content and **before** knowledge modelling; in Run, Step 2 shown as Generate Learning Content rather than expected review stage in understood position.
- Operator belief: review must happen before downstream steps consume artefact, or refinement purpose is defeated.

**OBSERVATION (Run execution — additional evidence, 2026-08-10):** See §3.20. During full Run walkthrough, adjacent steps appeared **effectively identical** rather than one being a meaningful review/refinement operation — strengthens incoherent-refinement hypothesis; does **not** establish root cause.

**HYPOTHESIS (not diagnosed):**

- Refinement insertion/order not preserved correctly, **or**
- Later save/render/run transformation changes sequence.

**Classification:** Potentially workflow-semantic / executable-integrity issue.

**Do not fix or diagnose now.** Implementation inspection **justified later** because observed behaviour requires explanation.

**Cross-cutting theme:** EXECUTABLE TRUTH.

---

### 3.13 Save / workflow identity (maps to A11, Domain B handoff)

**Positive (OBSERVATION):**

- **Save as workflow** creates workflow in My Workflows — handoff fundamentally works.
- Newly created workflow immediately discoverable.

**FRICTION — navigation (OBSERVATION):**

- Saved workflow opened on **Settings** because Settings was last My Workflows sub-tab used earlier during creation.
- Post-save landing state influenced by unrelated prior UI state — can appear to recommend Settings as next task.

**FRICTION — lifecycle (OBSERVATION):**

- Sequence: generate → save → return/refine → save again.
- Second save created **another** workflow with same name rather than clearly updating/versioning original.
- Result: “Programme Manager CPD — 8 steps” and “Programme Manager CPD — 10 steps”.
- User was refining same conceptual workflow, not consciously creating unrelated second workflow.

**Discovery question — workflow identity/lifecycle (not resolved):**

- unsaved design · saved workflow · refined workflow · update · version · duplicate · Save as new

**Cross-cutting theme:** WORKFLOW IDENTITY / LIFECYCLE.

---

## 4. User-experienced journey model (discovery synthesis)

The **A0–A11** decomposition ([T-010 §3](S75-T-010-primary-journey-map-and-domain-a-decomposition.md)) remains useful as an **implementation/state map**.

Operator evidence indicates it is **not** a good representation of twelve distinct **user-experienced** stages.

### 4.1 Provisional five-phase experienced journey

| Phase | User-facing intent | Maps from A0–A11 (indicative) |
| ----- | ------------------ | ------------------------------ |
| **1. DEFINE** | “Tell PRISM what I want to make.” | A0, A2, A3 (+ A1 as prerequisite, not necessarily a “phase”) |
| **2. UNDERSTAND** | “Make sure PRISM has understood what I mean.” | A4, A5, A6 — **may collapse** when no questions needed |
| **3. DESIGN** | “Show me how PRISM proposes to make it.” | A7, A9 |
| **4. IMPROVE** | “Improve the proposed approach before I commit.” | A8, A10 |
| **5. COMMIT** | “Save this as a reusable workflow and continue.” | A11 → Domain B |

**Shorthand:** DEFINE → UNDERSTAND → DESIGN → IMPROVE → COMMIT

**Explicit:** This is **discovery synthesis** — not target IA, not target implementation architecture.

### 4.2 Interpretation notes

- **API gate:** enabling prerequisite, not necessarily a user journey phase.
- **Elicitation / inference / resolution:** mechanisms within UNDERSTAND; may be invisible when sufficient.
- **Generation + generated-workflow review:** DESIGN.
- **Reviewer / post-generation refinement:** IMPROVE.
- **Save / handoff:** COMMIT.

---

## 5. Cross-cutting Domain A themes (from operator pass)

| Theme | Summary |
| ----- | ------- |
| **CAPABILITY VISIBILITY** | PRISM should accurately communicate what output kinds it can currently produce (LD: self-study, workshop). |
| **PROGRESSIVE DISCLOSURE** | Debugging/internal information (resolved brief) may be valuable without belonging in primary novice journey. |
| **CONSEQUENCE VISIBILITY** | Users face decisions without knowing effect on final resource or runnable workflow (review steps, Settings, yes/no suggestions). |
| **EXECUTABLE TRUTH** | Offered workflow improvements must correspond to real executable capability with valid artefact dependencies and ordering (refinement vs Run mismatch — hypothesis). |
| **STATE / LOCATION FEEDBACK** | Important responses can appear off-screen or in another sub-tab without sufficient indication (Review & suggest improvements; post-save Settings landing). |
| **WORKFLOW IDENTITY / LIFECYCLE** | Generated proposal, saved workflow, refinement, update/version, duplicate not clear as user concepts. |
| **PARAMETERISATION** | Settings intentionally separate from full elicitation; completeness, efficacy, placement, comprehensibility **untested** (Domain B gap). |

---

## 6. Provisional alternative discovery slices (not authorised)

Operator evidence suggests proposed **S75-T-011 / T-012 / T-013** boundaries (A0–A3 / A4–A6 / A7–A11) follow **implementation stages too closely**.

**Do not authorise** these tasks. **Do not authorise** the alternatives below unless operator subsequently opens them.

| Provisional slice | Scope (discovery only) |
| ----------------- | ---------------------- |
| **A. Intent, capability & brief formation** | Orientation; supported outputs; field model / help; information duplication; domain; API prerequisite; what must be decided at creation |
| **B. Generated design, refinement & parameterisation** | Generated workflow comprehensibility; basis for judging quality; reviewer/refinement behaviour; supported executable step capability; QA/review provenance/integrity; ordering/artefact dependencies; defaults/settings role; settings coverage/effectiveness questions |
| **C. Workflow commitment & handoff** | Save semantics; workflow identity; update/version/duplicate; transition to My Workflows; post-save landing; when Settings become relevant; clear next action |

**Status of prior proposal:**

| ID | Prior boundary | Status |
| -- | -------------- | ------ |
| S75-T-011 | A0–A3 | **Not authorised** — boundary **under reconsideration** |
| S75-T-012 | A4–A6 | **Not authorised** — boundary **under reconsideration** |
| S75-T-013 | A7–A11 | **Not authorised** — boundary **under reconsideration** |

---

---

# Part II — Domain B: My Workflows / Run

**Walkthrough status:** **Sufficient to close** at My Workflows → Authoring boundary. Remaining Run steps not required merely to repeat already-established Copy → Copilot → return → Next interaction pattern.

---

## 3.14 My Workflows — entry and orientation

**Positive (OBSERVATION):**

- When navigating back to My Workflows, the **previously selected workflow remains selected**.
- Operator assessment: this appears **useful** — preserves working context.

**OBSERVATION — selection vs mode persistence (distinct concerns):**

- Workflow **selection** persistence and **Run / Settings / Edit view** persistence behave as **different** concerns.
- My Workflows can reopen showing whichever sub-interface was last active: **Run**, **Settings**, or **Edit**.
- **First run after workflow creation:** operator observed **Edit** (not Run).
- **Repeat visits:** previously used interface can remain active.

**FRICTION (OBSERVATION + orientation):**

- **Run** provides *some* indication of what to do next.
- **Edit** and **Settings** do **not** make the next action obvious to an inexperienced user.
- Post-save landing on Edit/Settings (also noted in §3.13) compounds first-use orientation weakness.

**POSSIBLE / PROVISIONAL BEHAVIOUR (NOT an accepted decision):**

| Situation | Provisional rule (hypothesis only) |
| --------- | ----------------------------------- |
| Immediately after Create Workflow → Save | Select the workflow just created |
| Subsequent visits | Retain last selected workflow if it still exists |
| No selection history | Select first workflow in default ordering (currently Updated/newest) appears reasonable |
| No workflows exist | Intentional empty state would be required |

**POSSIBLE DIRECTION (NOT a final solution):** Workflow **selection** may reasonably persist while **mode** (Run/Edit/Settings) persistence may need different behaviour.

---

## 3.15 Running a workflow — initial orientation (BYO-LLM execution model)

**OBSERVATION — execution model not obvious to a new user:**

To run a workflow step, the operator currently needs to:

1. Enter **Run**
2. Copy the step prompt
3. Open Copilot
4. Create or use an appropriate Copilot chat
5. Paste the prompt
6. Execute it
7. Return to PRISM
8. Where required, paste generated structured output into PRISM
9. Proceed to the next step

**FRICTION (OBSERVATION):**

- Workflows should be run in a **new Copilot conversation** (operator convention / product expectation).
- Experienced users may learn this; the UI **does not adequately orient** a first-time user to it.

**HYPOTHESIS / UX REQUIREMENT (first-use, not repeated-use):**

- This is primarily a **first-use / onboarding** requirement.
- Once the Copy → external LLM → return convention is established, repeated explanation may be unnecessary.

**Positive (OBSERVATION — §3.16 linked):** After the convention is understood, successive steps follow the same basic pattern — consistency is **positive**.

---

## 3.16 Run step UI — guidance surfaces and Instructions field

**Positive (OBSERVATION):**

- Step execution itself is **consistent** once the execution convention is understood.
- Copy → run in Copilot → return → Next pattern repeats across steps.

**OBSERVATION — dual communication surfaces:**

Two areas appear intended to communicate how to run a step:

1. Explanatory prose **above** the fields
2. **Instructions** textarea

In the observed domain workflow, the **Instructions textarea is almost always empty**.

**FRICTION (OBSERVATION):**

- Empty Instructions alongside prose above produces an **unclear or unnecessary second communication surface**.

**OBSERVATION — variable complexity of explanatory prose:**

- Some steps: relatively understandable descriptions.
- Later steps: implementation-oriented language, e.g.:
  - deterministic assembly/render
  - partial page artefact
  - downstream prompts
  - Copilot conversation context
  - PRISM-injected prior outputs
  - schema/artefact terminology

**HYPOTHESIS / UX DIRECTION (NOT prescribed UI):**

- Operators need **concise, friendly, task-oriented** instructions for what to do **at that step**.
- Implementation detail should **not dominate** primary guidance.
- **Do not yet prescribe** exact UI treatment.

**OPEN INVESTIGATION (NOT a conclusion):**

- **Custom workflows** may depend on author-supplied step guidance via Instructions.
- Hypothetical QA/custom workflow behaviour **not yet established**.
- **Do not conclude** Instructions should simply be removed — verify custom-workflow behaviour in a later review.

---

## 3.17 Step output storage — paste field visibility

**OBSERVATION:**

- The **“Step output artefact (stored)”** field is displayed for steps **whether or not** the output actually needs PRISM runtime persistence.

**FRICTION (OBSERVATION):**

- **Misleading** when paste is not required to continue.
- Example: early **Generate Learning Content** (or similar) steps showed the paste-output field although **no paste was required** to proceed.

**STRONG UX REQUIREMENT / DESIGN DIRECTION (NOT an accepted decision):**

- The paste/store-output interaction should be presented **only when the current step actually requires** PRISM to capture the generated artefact.

**HYPOTHESIS — custom vs domain/runtime-aware steps (verify later):**

- Custom workflow steps may **not** use PRISM internal persisted runtime artefacts the same way as domain/runtime-aware steps.
- Stored-output mechanism may be **irrelevant** to custom steps.
- **Verify later** — not established architecture.

---

## 3.18 Required output, validation, and blocking defect

**OBSERVATION — meaningful persistence distinction:**

- Some runtime-aware steps **genuinely require** generated data returned to PRISM.
- Observed example: **Design Episode Plan** — Copilot-generated page/JSON must be pasted; PRISM validates; operator cannot continue until acceptable data supplied.
- This distinction between **ordinary execution steps** and **persisted-output steps** is **important to UX**.

**OBSERVATION — blocking validation defect (Design Learning Activities, Step 7):**

- During Run of Programme Manager CPD, at **Design Learning Activities**, validation failed with repeated errors of the form:
  - `activities[N].activity_preamble must be enriched when present`
  - (observed across multiple activities — systemic, not isolated malformed item)
- Progression to the next step was **blocked**.

**RECORD (walkthrough exception — NOT part of this documentation pass):**

- A **targeted runtime fix** was **requested during the walkthrough** so testing could continue (exception to observation-only posture for that session).
- Implementation details are **outside** this evidence document.
- **Do not broaden** this documentation update into further implementation work.

---

## 3.19 Copilot response behaviour — follow-up suggestions

**OBSERVATION:**

- After a step completes, Copilot displays the expected step status/output.
- Copilot also generates **suggested follow-up questions/actions**, e.g.:
  - add examples
  - explain related concepts
  - make further refinements

**FRICTION (OBSERVATION):**

- In workflow execution context, these suggestions are **undesirable**.
- They imply the operator may **interactively modify or extend** current-step output.
- Risk: disrupts controlled workflow sequence and/or artefact expected by later steps.

**UX / PRODUCT REQUIREMENT (with scope limit):**

- Where **technically possible**, workflow prompts should **discourage/suppress** unsolicited follow-up suggestions and make completion of the current step feel **terminal**: return to PRISM and continue the workflow.

**DISTINCTION (NOT assumed solved):**

- **Prompt-level mitigation** (may be in scope) vs **Copilot host UI suggestion behaviour** (may not be directly controllable).
- Do not assume Copilot UI suggestions are fully suppressible from PRISM.

---

## 3.20 Refinement / QA step defect — Run execution evidence

**OBSERVATION (links §3.10, §3.11, §3.12):**

- Workflow saved during Create Workflow review contains **10 steps** rather than original **8**.
- Create Workflow assistant had proposed **review/QA steps**; these appeared in the saved refined workflow.

**OBSERVATION (Run execution):**

- During execution, proposed review/QA steps do **NOT** appear as meaningful review stages in intended positions.
- **Duplicated learning-outcomes stage:** adjacent steps appear **effectively identical** rather than one being a meaningful review/refinement operation.

**HYPOTHESIS / PRODUCT-HISTORY (operator recollection — NOT established decision):**

- Supports recollection that explicit inserted QA/review steps had **previously been explored and abandoned for good reasons**.
- **Do NOT reinstate QA steps as a desired solution** from this evidence alone.

**RECORD CAREFULLY:**

| Classification | Content |
| -------------- | ------- |
| **Evidence** | Broken/incoherent refinement behaviour — display vs Run vs operator expectation |
| **NOT a decision** | Reintroducing QA/review steps as product direction |
| **Under investigation** | Earlier assistant behaviour that proposed/injected them |
| **Requirement direction** | Refinement must **not** insert semantically duplicate steps |
| **Requirement direction** | If artefact refinement is ever supported, it must occur **before** downstream steps consume that artefact |

Preserve as observation + product-history hypothesis unless existing decision records establish the earlier abandonment decision explicitly.

---

## 3.21 Settings and step signals (Run context)

**OBSERVATION:**

- Some Run steps display text equivalent to: *“Editable in the Settings tab — open Settings to tune step parameters.”*
- Potentially useful but adds to an **already dense** step interface.

**PRODUCT INTENT (preserved — not new):**

- Full up-front elicitation is **deliberately not** the goal.
- Workflows may expose many settings (**25** observed previously).
- Experienced users may tune them; workflows should be **reusable/parameterisable**.
- Settings **efficacy and comprehensibility** remain an **open Domain B investigation**.

**OPEN INVESTIGATION (preserved from §3.7):**

- Some included steps do **not** expose pack-declared settings controls.
- **Design Episode Plan** cited as example — may be omission.
- **Not solved** in this documentation pass.

---

## 3.22 End of workflow / Authoring handover

**OBSERVATION:**

- Final workflow step eventually produces the **final page artefact** and requires paste/validation in PRISM.
- At that point, the **My Workflows execution journey is effectively complete**.

**FRICTION (OBSERVATION):**

- **What happens next is currently unclear** to the operator.
- Operator needs to move from workflow construction/execution into closing production phase, including **Authoring** and eventually publishing, graphics, video, resources concerns.
- **No sufficiently clear handover / next action** from completed workflow into Authoring.

**OBSERVATION — journey boundary:**

- **My Workflows → Authoring** is a significant boundary.
- Authoring appears as a **separately fenced area** working with data constructed from the currently selected workflow.

**DESIGN HYPOTHESIS (NOT a decision):**

- Successful completion of the final workflow step may be an appropriate point to offer **explicit onward navigation/action** into the next production/authoring phase.
- **Authoring will be examined separately** — do not design handover now.

---

## 4.3 Domain B — emerging pattern (discovery synthesis)

| Element | Operator evidence summary |
| ------- | ------------------------- |
| **Create Workflow** | Establishes and saves a reusable process (Part I) |
| **My Workflows** | Manages, parameterises, and executes it |
| **Settings** | Optional deeper control — not exhaustive elicitation |
| **Run** | Fundamentally **guided orchestration between PRISM and Copilot** (BYO-LLM) |
| **Execution consistency** | Positive once Copy/run/return convention is learned |
| **First-use orientation** | Currently **weak** (execution model, fresh chat, mode landing) |
| **Run UI controls** | Exposed **irrespective** of whether current step needs them (paste field, Instructions) |
| **Operator guidance** | Mixed with **implementation-facing** technical detail on later steps |
| **Refinement / QA steps** | Currently appear **unreliable/incoherent** in Run |
| **Persisted artefacts** | Meaningful for particular runtime-aware steps — needs **clear distinction** in UX |
| **Workflow completion** | Lacks clear transition into **Authoring** |

**Shorthand (programme-level, provisional):**

```text
Create (A) → Manage/Run (B) → Author (C)
     ↑              ↑
  DEFINE…COMMIT   orchestration + optional Settings tuning
```

**Explicit:** Not target IA. Not redesign authorisation.

---

## 5.1 Cross-cutting themes — Domain B additions

| Theme | Summary (Domain B evidence) |
| ----- | --------------------------- |
| **FIRST-USE ORIENTATION** | BYO-LLM execution model and fresh-Copilot-chat convention not surfaced adequately. |
| **MODE VS SELECTION PERSISTENCE** | Useful workflow selection persistence vs confusing Run/Edit/Settings mode persistence. |
| **CONTROL RELEVANCE** | Run UI shows paste/store and Instructions surfaces even when step does not need them. |
| **GUIDANCE LAYERING** | Dual prose + Instructions; empty Instructions; technical implementation language on later steps. |
| **PERSISTENCE DISTINCTION** | Steps that require PRISM artefact capture vs steps that do not — must be obvious. |
| **EXTERNAL LLM TERMINALITY** | Copilot follow-up suggestions undermine controlled step completion. |
| **B→C HANDOFF** | Completion of Run lacks clear onward path to Authoring. |
| **EXECUTABLE TRUTH** | Reinforced by §3.20 — refinement/QA insertion incoherent at Run (links Part I §3.12). |

*(Part I cross-cutting themes in §5 retained.)*

---

## 6.1 Walkthrough closure and next UX-review boundary (2026-08-10 — Part II recorded)

**Closed when Part II was recorded:**

- Domain A Create Workflow operator pass (Part I).
- Domain B My Workflows / **Run** pass through final persisted page-artefact step — **sufficient**; no need to re-run every remaining step to repeat established interaction pattern.

*(Superseded for programme position by §6.2 after Part III recorded.)*

---

# Part III — B→C handover and Domain C: Authoring

**Walkthrough status:** **Recorded** — primary operator journey through output **substantively complete** (see §6.2).

---

## 3.23 B→C handover — My Workflows → Authoring

**OBSERVATION — Run completion is recognisable:**

- A user can know the workflow run has finished because there are **no further workflow steps** to execute.
- The handover problem is primarily **“what next?”** — not inability to recognise that Run itself has ended.

**FRICTION (OBSERVATION — confirms Part II §3.22):**

- The final workflow artefact is **intended to feed Authoring**, but there is **no explicit transition/navigation** from the completed Run journey into that next phase.

**OBSERVATION — first Authoring entry in a session:**

- The **Structured text (JSON)** area is **empty**.
- The user must choose **“Assemble From Current Workflow Run”**.
- It is **not immediately obvious**:
  - why this action is required, or
  - which workflow **“current”** refers to.

**OBSERVATION — subsequent Authoring entry:**

- Authoring may still contain **assembled data from a previously used workflow**.
- The user must **reassemble** if they want the **currently selected** workflow’s data.
- Existing content can therefore **look valid while belonging to a different workflow**.

**FRICTION — continuity / provenance (OBSERVATION + HYPOTHESIS):**

- Authoring does **not** make the identity of the **currently selected workflow** readily apparent.
- If the user has **just run** a workflow, that workflow **remains selected** in My Workflows — which **helps**.
- Otherwise the user may need to return to **My Workflows** to verify or change selection before assembling.

**HYPOTHESIS (NOT a UI prescription):**

- The system has a concept of **“current workflow”**, but Authoring does **not expose that state clearly enough** to the operator.
- This may be an important **continuity/provenance** issue.

**POSSIBLE IMPROVEMENT (NOT a decision):** Do not prescribe a specific UI solution yet.

---

## 3.24 Initial Authoring / assembly

**OBSERVATION — after “Assemble From Current Workflow Run”:**

- Structured JSON is **populated**.
- A **learner-page preview is generated automatically**.
- **“Preview HTML”** nevertheless becomes **visually selected/prominent** even though the initial preview has effectively **already happened**.
- Authoring jobs/tabs become available:
  - Learner Page
  - Graphics
  - Video
  - Resources
- Export/inspection actions become available:
  - HTML only (.html)
  - Learner package (.zip)
  - Open in New Tab
  - Clear

**Positive (OBSERVATION):**

- Assembly is effectively the **gateway** into the rest of Authoring — once performed, downstream surfaces unlock.

**FRICTION / HYPOTHESIS (NOT prescribed UI):**

- The distinction between **“assemble”**, **“preview”**, and the **already-visible automatically generated preview** may not be completely clear to a first-time user.

---

## 3.25 Learner Page / preview

**Positive (OBSERVATION):**

- The assembled learner page can be **inspected directly** in Authoring.
- **Open in New Tab** provides a useful **larger inspection view**.
- Re-running **Preview HTML** refreshes the rendered view after authoring/enrichment changes.
- This interaction appears to work **reasonably well** once assembly has occurred.

**Explicit non-finding:** No additional problems invented beyond what was observed.

---

## 3.26 Graphics authoring

**Positive (OBSERVATION):**

- Graphics exposes **generated graphics jobs**.
- Operator can **copy a graphics prompt** and run it in an external generative tool.
- Once an image is generated, it can be **pasted, dragged in, or uploaded** and assigned to the relevant graphics job.
- **Preview HTML** can be refreshed to inspect the image in context.
- **Open in New Tab** also reflects updated content.
- Operator assessment: this workflow **works reasonably well**.

**STRUCTURAL OBSERVATION (NOT a redesign request):**

- Graphics is **job-driven / generated from workflow output**.
- It is **not quite the same type** of authoring operation as Video or Resources, despite all three appearing as **peer tabs**.

---

## 3.27 Video

**Positive (OBSERVATION):**

- Video is **optional**.
- Operator can provide: section title; optional introductory paragraph/context; provider-supplied embed code; save/remove.
- **One video** is currently permitted.
- Apart from presentation issue below, interaction is **straightforward**.

**Minor UI observation (NOT an implementation task):**

- Duplicated **“Video”** heading — “Video” followed immediately by another “Video”.

---

## 3.28 Resources

**Positive (OBSERVATION):**

- Resources are **optional**.
- Operator can provide optional introductory paragraph.
- **Multiple resources** can be added.
- A file is selected and learner-facing link text supplied.
- Interaction is **relatively simple and understandable**.

**Explicit non-finding:** No significant workflow problem observed.

---

## 3.29 Authoring information architecture (peer tabs)

**OBSERVATION — tabs represent different kinds of activity:**

| Tab | Apparent activity type (operator evidence) |
| --- | --------------------------------------------- |
| **Learner Page** | Assembled/rendered **core artefact** |
| **Graphics** | **Generated jobs** requiring external generation and returned assets |
| **Video** | Optional **manually supplied** embed/enrichment |
| **Resources** | Optional **manually supplied** attachments/enrichment |

**Assessment (OBSERVATION):**

- They work **adequately** in the walkthrough.
- They are **not conceptually equivalent** operations despite peer presentation.

**HYPOTHESIS (NOT a redesign decision):** Evidence for **later IA consideration** — not a current redesign authorisation.

---

## 3.30 Completion / export

**OBSERVATION:**

- Once desired enrichment is complete, practical final actions are **inspection and export**.
- Current outputs:
  - **HTML only (.html)**
  - **Learner package (.zip)**

**Operational distinction (OBSERVATION):**

- **HTML** — usable where no packaged assets need to accompany the page.
- **Learner package** — appropriate where graphics/resources/assets need to travel with the output.

**Positive (OBSERVATION):**

- Operator can **open the result in a new tab** for final inspection.
- Unlike the My Workflows → Authoring handover, the **end of Authoring** did **not** appear to require a strong explicit completion mechanism — available inspection/export actions provide a **reasonably natural endpoint**.

**Explicit:** Observation only — not a final design decision.

---

## 3.31 Future output direction (context only)

**FUTURE PRODUCT CONTEXT (NOT Sprint 75 implementation):**

- **SCORM** is expected eventually to become another output format.
- Authoring/export should **conceptually** allow additional packaging/output formats in future.

**Explicit exclusions:**

- Do **not** implement SCORM from this evidence.
- Do **not** create a Sprint 75 task for SCORM from this evidence.

---

## 4.4 Domain C — overall assessment and experienced sequence

**Overall finding (OBSERVATION + assessment):**

- Central Authoring interactions appear **substantially more coherent** than earlier Create Workflow / Run orientation issues.

**Strongest Domain C issue — at ENTRY (FRICTION summary):**

| Entry concern | Evidence |
| ------------- | -------- |
| Knowing Authoring is the **next phase** after Run | §3.23 — no explicit B→C transition |
| Understanding **“Assemble From Current Workflow Run”** | §3.23 — purpose and “current” unclear on first entry |
| Knowing **which workflow is selected** | §3.23 — not exposed in Authoring |
| Distinguishing displayed data from **selected workflow** | §3.23 — stale assembly possible |
| Knowing **when reassembly is required** | §3.23 — subsequent entry |

**Experienced sequence after assembly (discovery synthesis — NOT proposed navigation labels):**

```text
ASSEMBLE
  → PREVIEW
  → optionally ENRICH (Graphics / Video / Resources)
  → REFRESH / INSPECT
  → EXPORT
```

**Positive areas (OBSERVATION):** Learner preview/inspection (§3.25); Graphics job workflow (§3.26); Video/Resources optional enrichment (§§3.27–3.28); export endpoint (§3.30).

---

## 5.2 Cross-cutting themes — Domain C additions

| Theme | Summary (Domain C evidence) |
| ----- | --------------------------- |
| **B→C HANDOFF** | Run end is recognisable; **what next** and **assemble** entry are weak (extends Part II theme). |
| **WORKFLOW PROVENANCE IN AUTHORING** | “Current workflow” not surfaced; stale assembled JSON can mislead. |
| **ASSEMBLY AS GATEWAY** | Positive — unlocks tabs and export; assemble vs auto-preview vs Preview HTML button may confuse. |
| **PEER TAB IA MISMATCH** | Graphics/Video/Resources/Learner Page are different operation types — adequate but not equivalent. |
| **EXPORT CLARITY** | HTML vs learner package distinction observed as meaningful. |
| **AUTHORING COHERENCE POST-ASSEMBLY** | Stronger than A/B orientation once assembly complete. |

---

## 6.2 Primary operator journey status (2026-08-10 — Part III recorded)

**Substantive primary journey — COMPLETE (operator evidence):**

```text
Create Workflow
  → My Workflows / Run
  → final workflow artefact
  → Authoring (assemble)
  → optional enrichment (Graphics / Video / Resources)
  → preview / inspection
  → export
```

**Explicit:**

- No need to manufacture Video/Resources content merely to prove basic form interactions unless a **later validation-specific investigation** requires it.
- Graphics walkthrough exercised external-generation return path — judged adequate.

**Remaining open / deferred (NOT silently treated as complete):**

| Area | Status |
| ---- | ------ |
| Domain B **Settings efficacy** | Not systematically audited |
| **Custom-workflow Instructions** behaviour | Not verified |
| **Detailed validation** behaviour | Beyond observed blocking defect — not exhaustively audited |
| **Domain D / E** (Prompt Studio / Library) | Not detailed-audited |
| **Domain A** revised discovery slices (T-011/012/013) | Not authorised |
| **Executable integrity** (refinement/QA vs Run) | Hypothesis recorded — not diagnosed |
| **Implementation / redesign** from Sprint 75 evidence | Not authorised |

**No automatic implementation work** from this journey completion.

---

## 6.3 Proposed next UX-review boundary (NOT authorised)

Primary journey A→B→C through export is **evidence-complete for discovery purposes**. Proposed **deferred** investigations (operator to prioritise — **not tasks**):

1. Domain B **Settings** efficacy and missing step controls  
2. **Custom-workflow** Instructions and stored-output behaviour  
3. **Domain A** revised discovery boundary decision (T-011/012/013 vs alternative slices)  
4. **Domains D–E** — Prompt Studio / Library role and discoverability  
5. **Executable integrity** — refinement/QA step provenance (supporting inspection, not UX-only)  
6. Specialist / secondary journeys as separately scoped

**Do not** assume any of the above is automatically next.

---

## 7. Explicit non-findings

**Part I (unchanged intent):**

- No design decisions accepted from Domain A pass alone
- No implementation tasks opened from documentation
- No claim that QA steps are unsupported
- Positive findings retained alongside friction

**Part II additions:**

- No Run UI redesign authorised
- No conclusion that Instructions field should be removed
- No established architecture decision on custom vs runtime-aware stored-output behaviour
- No detailed Settings efficacy pass executed
- Blocking DLA validation defect **recorded**; fix **not documented here**
- Domain D/E still not detailed-audited

**Part III additions:**

- No Authoring handover / assembly UX redesign authorised
- No SCORM implementation or Sprint 75 task from future-output context
- No Video duplicated-heading fix authorised as task
- No peer-tab IA restructure authorised
- Video/Resources form interactions not exhaustively validated beyond observed pass

---

## 8. Related documents

- Implementation/state decomposition: [S75-T-010-primary-journey-map-and-domain-a-decomposition.md](S75-T-010-primary-journey-map-and-domain-a-decomposition.md)  
- T-010 addenda: same file §11 (Domain A) · §12 (Domain B Run) · §13 (B→C + Domain C)  
- Programme status: [STATUS.md](STATUS.md) · [PLAN.md](PLAN.md) · [HANDOVER.md](HANDOVER.md)

**Supersedes for programme position (2026-08-10):** §6.2–§6.3 deferred lists where noted in [S75-T-020 §13](S75-T-020-cross-journey-ux-evidence-synthesis-and-intervention-framing.md#13-documentation-contradictions-noted). Historical observations above are **not rewritten**.

**Later disposition (do not rewrite observations above):** Generic Create Workflow **Review & suggest improvements** path retired under [`S75-D03`](decisions.md#s75-d03--retire-generic-create-workflow-workflow-review-step-insertion); future closed-loop QA → [PB-FA-006](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-006--qa--workflow-and-resource-refinement-lifecycle).

---

## 9. Stop condition

**Primary operator journey (A→B→C through export):** Evidence **recorded** — substantive discovery pass **complete** for programme-map purposes.

**Domain A:** Revised discovery boundaries still **pending operator decision** — T-011/012/013 **not authorised**.

**Deferred areas:** See §6.2 — Settings efficacy, custom workflows, D/E, etc. **Not authorised** as tasks by this document. Executable-integrity / generic-reviewer root cause: **established and retired** (`S75-D03`); lifecycle design remains **PB-FA-006**.

No implementation task opened by this synthesis alone.
