# Sprint 88 — Decision Log

**Sprint status:** **OPEN** — Investigation 1 recorded; Product Judgement Pass 1 recorded; not closed  
**Format:** ID · Decision · Status · Rationale · Consequences

No architectural decision about default workflows or Assessment has been taken. The entry below only opens the investigation sprint.

---

## S88-D01 — Open Sprint 88 — Default Product Workflows & Assessment Architecture

- **Decision:** Open Sprint 88 as an **investigation sprint** (not implementation), titled **Default Product Workflows & Assessment Architecture**, to investigate the two questions stated in [SPRINT-88-CHARTER.md](SPRINT-88-CHARTER.md). Those questions remain **hypotheses**. This decision does not approve canonical/default workflows and does not specify Assessment product architecture.

- **Status:** **Accepted** (2026-09-28)

- **Rationale:**
  - Sprint 87 is **COMPLETE / CLOSED**. Alpha development remains **complete**; the first-class gate at alpha close was **339/339**.
  - The questions arose from normal PRISM use as architectural questions worth a bounded investigation before any implementation.
  - Opening the pack records purpose and boundaries. It does not assign task IDs, authorise production changes, or convert working hypotheses into decisions.
  - No existing backlog item is assigned to this opening.

- **Consequences:**
  - Sprint 88 pack is the active programme pointer via [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md).
  - Sprint 82–87 remain **CLOSED** historical record. Sprint 87 remains **COMPLETE / CLOSED**.
  - Production code, prompts, contracts, schemas, Create UI, workflow instantiation, renderer, and learner-page behaviour are **not** authorised to change.
  - Canonical/default product workflows are **not** approved.
  - A future first-class Assessment product is **not** specified.
  - Later planning or implementation remains an **intention** only, and only if investigation later warrants it.
  - Historical debt and pruned backlog residue are **not** automatically active work.

---

## S88-D02 — Authorise Investigation 1 — topology, elicitation, and assessment archaeology

- **Decision:** Accept the operator brief **Sprint 88 — Investigation 1: Default Product Workflow Topology, Elicitation, and Assessment Archaeology**. Authorise investigation and documentation only, recorded as [S88-T-001](PLAN.md) through [S88-T-009](PLAN.md). Findings stay separate from decisions. This decision does **not** choose a workflow architecture, approve canonical/default workflows, or specify an Assessment product.

- **Status:** **Accepted** (2026-09-28)

- **Rationale:**
  - S88-D01 opened the pack with the questions unsettled and with no task breakdown.
  - The operator brief bounds the work to reconstructing what PRISM does and how it got there, then comparing models A/B/C as findings.
  - The brief forbids production changes: code, prompts, contracts, schemas, UI, tests, workflow behaviour, and learner rendering.
  - Task IDs are investigation tasks only. Implementation tasks are not created.

- **Consequences:**
  - Investigation execution is **authorised**.
  - Implementation and production behaviour changes remain **forbidden**.
  - Any recommendation in the investigation report is a **finding**, not an architectural decision.
  - Later planning or implementation still requires its own decision.

- **Evidence:** Operator brief (Investigation 1); task index [PLAN.md](PLAN.md).

---

## S88-D03 — Workshop remains an Interactive variant for current Sprint 88 scope

- **Decision:** For current Sprint 88 scope, Workshop remains a variant of the Interactive Resource product. Its existing workflow variation is adequate for current purposes. Sprint 88 will not redesign Workshop. This does **not** decide that Workshop must permanently remain an Interactive variant. A future investigation may find that Workshop has a sufficiently distinct educational purpose or process to warrant its own first-class product.

  Record this working architectural principle, without adopting a workflow model:

  > A first-class PRISM product should have a coherent, predictable workflow architecture. Legitimate structural variation should be explicit and understandable rather than arising unpredictably from model inference.

  Investigation 1 §16 question 1 is **resolved for current Sprint 88 scope**.

- **Status:** **Accepted** (2026-09-28) — operator product judgement

- **Rationale:**
  - Investigation 1 showed Workshop and Self-study share the Interactive stage family but not the same membership predicates.
  - That difference does not, at this stage, justify a Workshop redesign or a new product.
  - Permanence is deliberately not decided.

- **Consequences:**
  - No Workshop behaviour change is authorised.
  - Sprint 88 planning, if later authorised, must not treat Workshop as an open redesign.
  - A future investigation may reopen whether Workshop is its own product.
  - The working principle is recorded. It is not, by itself, adoption of Investigation 1 Model B or Model C, and it does not approve canonical/default workflows.

- **Evidence:** Operator judgement; [S88-INVESTIGATION-1-REPORT.md](S88-INVESTIGATION-1-REPORT.md) §16 question 1.

---

## S88-D04 — Preserve Design Assessment; do not repair it in Sprint 88

- **Decision:** Do not remove Design Assessment in Sprint 88. Its relationship to a possible future first-class Assessment product remains under investigation. Do not design that product here. Do not fix the dead blueprint arm of `keepDesignAssessmentStep` merely to preserve current behaviour before that Assessment direction is understood.

- **Status:** **Accepted** (2026-09-28) — operator product judgement

- **Rationale:**
  - Investigation 1 distinguished in-resource formative assessment from the older Design Assessment / Generate Assessment Items machinery, and did not decide a future Assessment product.
  - The blueprint arm is a code-order defect, recorded as debt, not as a Sprint 88 repair.

- **Consequences:**
  - Design Assessment stays in the catalogue.
  - No production change, including no repair of `keepDesignAssessmentStep`.
  - Debt: [S88-AD-001](ARCHITECTURAL-DEBT.md).
  - Later Assessment investigation can reconstruct intent from Sprint 23 semantics, the pack contract, S80-T-011, and S80-D07. No further evidence is required before that reconstruction can start. What that stage should become remains open.

- **Evidence:** Operator judgement; [S88-INVESTIGATION-1-REPORT.md](S88-INVESTIGATION-1-REPORT.md) §11; `app.js` `keepDesignAssessmentStep` assignment before `var assessmentBlueprintRequested`.

---

## S88-D05 — Adopt the first-class workflow-family invariant

- **Decision:** Adopt:

  > A first-class PRISM product has a defined workflow family. Normal creation does not ask a model to invent that workflow. Product variants and explicit structural options may select documented topology variants; ordinary requirement detail parameterises the workflow.

  “Workflow family” does not mean exactly one immutable stage array forever. Workshop remains an Interactive variant for current scope under [S88-D03](#s88-d03--workshop-remains-an-interactive-variant-for-current-sprint-88-scope). This decision does not prevent a future investigation from deciding that Workshop warrants its own first-class product.

- **Status:** **Accepted** (2026-09-28) — architectural direction

- **Rationale:** Product Judgement Pass 1 tested this invariant and separated supporting evidence from current contradictory control flow. The operator now adopts it as direction. Adoption does not implement it.

- **Consequences:**
  - Normal first-class creation is specified against documented families in [S88-ARCHITECTURE-PLAN.md](S88-ARCHITECTURE-PLAN.md).
  - Model-driven invention of those families is not the target architecture.
  - No production change is authorised by this decision.
  - S88-D03’s earlier statement that the working principle was not yet a workflow model is superseded by this adoption. S88-D03’s Workshop judgement stands.

- **Evidence:** Operator decision; [S88-PRODUCT-JUDGEMENT-PASS-1.md](S88-PRODUCT-JUDGEMENT-PASS-1.md) §7.

---

## S88-D06 — No distinct elicitation phase for normal first-class create

- **Decision:** Normal first-class product creation has no distinct elicitation phase. PRISM should directly expose the parameters and explicit structural choices the product actually supports, with sensible defaults where appropriate. This is not an instruction to expose every historical factor in a large form. Information a downstream stage can reason about stays that stage’s responsibility. Model-driven requirement interpretation and workflow generation remain appropriate where PRISM must determine the workflow itself, including Custom/Generated workflows.

- **Status:** **Accepted** (2026-09-28) — architectural direction

- **Consequences:**
  - The Create input contract in the architecture plan is the specification.
  - Elicitation and generated-workflow machinery are **not** removed in this pass.
  - No production change is authorised.

- **Evidence:** Operator decision; [S88-PRODUCT-JUDGEMENT-PASS-1.md](S88-PRODUCT-JUDGEMENT-PASS-1.md) §6.

---

## S88-D07 — No PRISM API key to construct a normal first-class workflow

- **Decision:** Instantiating, configuring, saving, inspecting, and copying prompts from a normal first-class workflow must not require a configured PRISM API key merely to determine a known product topology. Model access remains necessary when the author executes model-dependent workflow stages. “PRISM requires a key to construct the workflow” and “the author needs a model to execute prompts” stay distinct.

- **Status:** **Accepted** (2026-09-28) — architectural requirement

- **Consequences:**
  - The key boundary is specified in the architecture plan.
  - The current key gate is **not** changed yet.
  - No production change is authorised.

- **Evidence:** Operator decision; [S88-PRODUCT-JUDGEMENT-PASS-1.md](S88-PRODUCT-JUDGEMENT-PASS-1.md) §5; [S88-INVESTIGATION-1-REPORT.md](S88-INVESTIGATION-1-REPORT.md) §9.

---

## S88-D08 — Expository source topology is the same family plus Normalize

- **Decision:** Authoritative-source Expository uses the same Expository workflow family as topic-created Expository, with Normalize Content as the source-specific prefix. The current source-path divergence is accidental nesting of the Sprint 85 replacement inside older Sprint 27 topic-only logic.

- **Status:** **Accepted** (2026-09-28) — architectural interpretation

- **Consequences:**
  - Later implementation, if authorised, should follow this family, not the accidental fall-through.
  - **Do not fix the nesting yet.**
  - No production change is authorised.

- **Evidence:** [S88-PRODUCT-JUDGEMENT-PASS-1.md](S88-PRODUCT-JUDGEMENT-PASS-1.md) §2; commits `f4b4a439`, `63690073`; [S85-D03](../2026-09-21-sprint-85-expository-resource-implementation/decisions.md).

---

## S88-D09 — Residual stages do not define first-class topology

- **Decision:** The nine stages examined in Product Judgement Pass 1 do not justify model-invented topology for normal first-class creation. Assessment-related stages remain preserved pending the Assessment investigation. Slides, VLE, learning-object, rubric, and QA capabilities must not be silently promoted into canonical first-class topology merely because historical wording or triggers can still reach them.

- **Status:** **Accepted** (2026-09-28) — architectural direction

- **Consequences:**
  - No capability is removed in this pass.
  - Normal first-class families in the architecture plan do not include those stages.
  - No production change is authorised.

- **Evidence:** Operator decision; [S88-PRODUCT-JUDGEMENT-PASS-1.md](S88-PRODUCT-JUDGEMENT-PASS-1.md) §3.

---

## S88-D10 — Open the bounded architecture-planning pass

- **Decision:** Open a bounded Sprint 88 architecture-planning pass to specify the smallest architecture needed to implement S88-D05 through S88-D09 later. The specification is [S88-ARCHITECTURE-PLAN.md](S88-ARCHITECTURE-PLAN.md). This decision does **not** authorise implementation, production changes, or Assessment product design.

- **Status:** **Accepted** (2026-09-28)

- **Consequences:**
  - Planning task [S88-T-011](PLAN.md) is documentation only.
  - Implementation tasks are not created.
  - The current key gate, elicitation machinery, and Expository source nesting stay as they are until a later implementation decision.

- **Evidence:** Operator brief; adopted decisions S88-D05–D09.

---

## S88-D11 — Authorise the first local-instantiation implementation slice

- **Decision:** Authorise implementation of the bounded first slice in [S88-ARCHITECTURE-PLAN.md](S88-ARCHITECTURE-PLAN.md) (“Proposed first implementation boundary”), recorded as [S88-T-012](PLAN.md). New normal Learning Design creates for Interactive (Self-study and Workshop) and Expository instantiate the documented family locally, without an elicitation phase, a design-model call, or a PRISM API key. Saved graphs are not rewritten. Custom/Generated and Research stay on the model path. Residual assessment and delivery stages are not inserted and are not removed. S88-AD-001 is not repaired. The Assessment investigation is not opened.

- **Status:** **Accepted** (2026-09-28) — implementation of this slice only

- **Consequences:**
  - `lib/first-class-workflow-family.js` and the Create routing in `app.js` implement the slice.
  - `ldCreateOutputType` remains a compatibility mirror. `product`, `variant`, and `startingPoint` are the identity written on new workflows.
  - Sprint 88 stays **OPEN**.

- **Evidence:** Operator authorisation; tests `tests/s88-first-class-local-instantiation.test.js`; first-class gate 339/339.

---

## S88-D12 — Authorise the Assessment Architecture Investigation

- **Decision:** Authorise an investigation only, recorded as [S88-T-013](PLAN.md), into whether Assessment is a distinct educational object that could warrant a first-class product. The record is [S88-ASSESSMENT-ARCHITECTURE-INVESTIGATION.md](S88-ASSESSMENT-ARCHITECTURE-INVESTIGATION.md). This decision does **not** design or implement an Assessment product, repair Design Assessment, change Interactive formative assessment, or specify Assessment topology.

- **Status:** **Accepted** (2026-09-28) — investigation only

- **Consequences:**
  - Findings stay separate from product decisions.
  - S88-AD-001 remains unrepaired.
  - Sprint 88 stays **OPEN**.

- **Evidence:** Operator brief; architecture plan §I.

---

## S88-D13 — Adopt Assessment Pack as a first-class Learning Design product

- **Decision:** Assessment Pack is a first-class Learning Design product.

  > An Assessment Pack provides a deliberately designed set of opportunities for learners to demonstrate achievement of intended learning, together with the means by which that evidence can be judged and appropriate feedback provided.

  Its central assessment-design responsibility is:

  > Design the evidence from which a defensible judgement of intended learning could be made.

  The conceptual Learning Design family is:

  ```text
  Learning Design
    Interactive Resource
      Self-study variant
      Workshop variant
    Expository Resource
    Assessment Pack
  ```

  “Means of judgement” means those means are designed into the pack. It does not mean PRISM records or awards a learner’s achievement.

- **Status:** **Accepted** (2026-09-28) — product direction

- **Consequences:**
  - The hierarchy is not implemented in Create in this decision.
  - No production change is authorised.
  - Specification: [S88-ASSESSMENT-PACK-ARCHITECTURE-PLAN.md](S88-ASSESSMENT-PACK-ARCHITECTURE-PLAN.md).

- **Evidence:** Operator decision; [S88-ASSESSMENT-ARCHITECTURE-INVESTIGATION.md](S88-ASSESSMENT-ARCHITECTURE-INVESTIGATION.md).

---

## S88-D14 — Assessment is both a product and a capability

- **Decision:** Assessment is a first-class product when assessment is what the author is creating, and a capability inside another product where that is educationally appropriate. Interactive’s formative activity → evidence → materials/workspace path remains intrinsic to Interactive. It is not absorbed into Assessment Pack. An Interactive Resource does not become an Assessment Pack because it contains formative checking, learner evidence, or feedback.

- **Status:** **Accepted** (2026-09-28) — product direction

- **Consequences:**
  - Interactive is not redesigned in this pass.
  - No production change is authorised.

- **Evidence:** Operator decision; Sprint 72 [S72-D11](../2026-07-31-sprint-72-productising-instructional-architecture/decisions.md); investigation §3 and §7.

---

## S88-D15 — Assessment design and assessment authoring stay distinct

- **Decision:** Assessment design and assessment authoring are distinct intellectual responsibilities. Design determines what evidence would support a defensible judgement of the intended learning. Authoring creates the components that elicit that evidence. This preserves the principle behind the historical Design Assessment → Generate Assessment Items split. It does **not** preserve those stages as the future implementation. The blueprint responsibility remains useful. The existing Design Assessment implementation is obsolete and is not repaired or revived. Generate Assessment Items is assessment authoring, not a complete Assessment Pack. Sprint 80’s items-first alpha path was a simplification, not evidence that assessment design is unnecessary.

- **Status:** **Accepted** (2026-09-28) — product direction

- **Consequences:**
  - S88-AD-001 stays unrepaired.
  - No production change is authorised.

- **Evidence:** Operator decision; Sprint 23 authority model; [S80-T-011](../2026-08-26-sprint-80-settings-discovery-product-value-and-policy-architecture/S80-T-011-design-assessment-topology-and-cai-relationship-diagnostic.md); [S80-D07](../2026-08-26-sprint-80-settings-discovery-product-value-and-policy-architecture/decisions.md).

---

## S88-D16 — Open the Assessment Pack architecture-planning pass

- **Decision:** Open a bounded planning pass that derives Assessment Pack architecture from the responsibilities in S88-D13 through S88-D15. The specification is [S88-ASSESSMENT-PACK-ARCHITECTURE-PLAN.md](S88-ASSESSMENT-PACK-ARCHITECTURE-PLAN.md). This decision does **not** authorise implementation, Create UI, renderer changes, or repair of Design Assessment.

- **Status:** **Accepted** (2026-09-28) — planning only

- **Consequences:**
  - Planning task [S88-T-014](PLAN.md) is documentation only.
  - Sprint 88 stays **OPEN**.

- **Evidence:** Operator brief; S88-D13–D15.

---

## S88-D17 — An existing Interactive Resource may supply Assessment Pack outcomes

- **Decision:** An existing Interactive Resource is a supported Assessment Pack starting point. When the pack is meant to assess learning already represented by that resource, that resource’s established Learning Outcomes are the authoritative inputs to assessment design. Do not regenerate those outcomes from the original brief. The Assessment Pack workflow remains Plan Assessment Evidence → Author Assessment Components. The Interactive workflow is not incorporated into the Assessment workflow. The existing resource supplies structured input to the new product.

  Broader principle, recorded cautiously and not generalised: when an existing PRISM product already contains an authoritative artefact required by another product, prefer passing that artefact forward as an input rather than regenerating it from the original brief. This decision does not authorise a product-composition framework or cross-product infrastructure.

- **Status:** **Superseded for product input** by [S88-D24](decisions.md#s88-d24--product-output-is-source-material) (2026-09-28). The earlier amendment is kept as history. A completed product output is source material for the new product’s own pipeline. Saved Learning Outcomes are not the user-facing input.

- **Consequences:** No production change at the time of this amendment. No composition framework. The shortcut itself is withdrawn by S88-D24.

- **Evidence:** Operator judgement; [S88-ASSESSMENT-PACK-ARCHITECTURE-PLAN.md](S88-ASSESSMENT-PACK-ARCHITECTURE-PLAN.md) §8.

---

## S88-D18 — Topic and source use the established Learning Design prefix

- **Decision:** When Learning Outcomes are not supplied by an existing resource or directly as input, the Assessment Pack uses the established Learning Design pipeline:

  ```text
  [Normalize Content]
  → Generate Learning Content
  → Model Knowledge
  → Define Learning Outcomes
  → Plan Assessment Evidence
  → Author Assessment Components
  ```

  Normalize Content is included only for authoritative source input. There is no Assessment-specific shortcut from topic straight to Learning Outcomes.

- **Status:** **Accepted** (2026-09-28) — architecture amendment

- **Consequences:** Resolves the open prefix question in the Assessment Pack plan. No production change.

- **Evidence:** Operator judgement.

---

## S88-D19 — Diagnostic intent is orthogonal to formative and summative purpose

- **Decision:** Formative and summative describe the principal purpose of the assessment. Diagnostic intent is orthogonal: the pack may deliberately seek to identify strengths, gaps, misconceptions, or partial understanding, and that intent may coexist with formative assessment and, where appropriate, summative assessment. Where diagnostic intent is present, Plan Assessment Evidence specifies what distinctions in learner understanding the planned evidence is intended to reveal, so later components and feedback can be diagnostic rather than merely indicating correctness. Diagnostic intent does not add a workflow stage. UI controls are not specified here.

- **Status:** **Accepted** (2026-09-28) — architecture amendment

- **Consequences:** Formative, summative, and diagnostic are not peer values of one purpose field. No production change.

- **Evidence:** Operator judgement.

---

## S88-D20 — Weighting is optional and separate from purpose

- **Decision:** Weighting is not restricted to summative Assessment Packs. It is optional whenever the assessment design requires components to contribute quantitatively to a combined result, regardless of principal purpose. Most formative packs may not need weighting. Assessment purpose and quantitative scoring stay conceptually separate.

- **Status:** **Accepted** (2026-09-28) — architecture amendment

- **Consequences:** Supersedes the plan’s earlier recommendation that weighting exist only for summative packs. No production change.

- **Evidence:** Operator judgement.

---

## S88-D21 — First implementation forms are not the product’s scope

- **Decision:** Single-answer multiple choice and short constructed response are the first implementation forms only. They are not the definition or the permanent scope of Assessment Pack. The contracts must remain capable of later forms, including multiple-answer multiple choice, longer written responses, essays, learner choice sets, and other forms established later. No complete assessment taxonomy is specified now.

- **Status:** **Accepted** (2026-09-28) — architecture amendment

- **Consequences:** The smallest later implementation slice may still start with those two forms. The architecture must not treat them as the closed set. No production change.

- **Evidence:** Operator judgement.

---

## S88-D22 — Implement the Assessment Pack first slice

- **Decision:** Implement the smallest Assessment Pack slice: a new Learning Design product created locally from an existing Interactive Resource’s saved Learning Outcomes, with exactly Plan Assessment Evidence → Author Assessment Components. Recorded as [S88-T-015](PLAN.md). Topic and source prefixes, later component forms, renderer work, and Design Assessment repair are not included.

- **Status:** **Accepted** (2026-09-28) — this slice only

- **Consequences:** Sprint 88 stays **OPEN**. No saved graph is rewritten.

- **Evidence:** `lib/first-class-workflow-family.js`; `tests/s88-assessment-pack-first-slice.test.js`.

---

## S88-D23 — Assessment Pack starting points are implemented

- **Decision:** Assessment Pack is usable without an existing Interactive Resource. That resource remains an optional route: its saved Learning Outcomes are reused, not regenerated, and the workflow begins at Plan Assessment Evidence. A topic start uses the existing Learning Design stages Generate Learning Content → Model Knowledge → Define Learning Outcomes, then Plan Assessment Evidence → Author Assessment Components. An authoritative-source start prefixes Normalize Content. Purpose, diagnostic intent, and optional weighting change prompt wording, not the graph of a chosen starting point. There is no general workflow-composition framework and no Assessment-specific replacement for the upstream stages.

- **Status:** **Accepted** (2026-09-28) — [S88-T-016](PLAN.md). The saved-Learning-Outcomes route in this decision is **superseded** by [S88-D24](decisions.md#s88-d24--product-output-is-source-material). Topic and ordinary source starts remain.

- **Consequences:** Completes the starting-point limit recorded in S88-D22. Later response forms, a complete renderer, marking, feedback stages, and Design Assessment repair stay out of scope. Sprint 88 stays **OPEN**.

- **Evidence:** `lib/first-class-workflow-family.js`; `tests/s88-assessment-pack-first-slice.test.js`; `npm run test:first-class` **339/339**.

---

## Further decisions

Assessment Pack direction is adopted (S88-D13–D15) and amended (S88-D17–D21). Product input is [S88-D24](decisions.md#s88-d24--product-output-is-source-material): every first-class product is independently creatable, and a completed output of another first-class product may be source material. Design Assessment is not repaired. Interactive is not redesigned. No product-composition framework is authorised. Design Page is not an Assessment Pack stage (S88-D24).

---

## S88-D24 — Product output is source material

- **Decision:** Every first-class PRISM product is independently creatable. A completed output from another first-class product may also be supplied as source material for a new product. The user selects that product output, not an internal workflow artefact. For Assessment Pack, a completed Interactive output or Expository output is authoritative source material and follows Normalize Content → Generate Learning Content → Model Knowledge → Define Learning Outcomes → Plan Assessment Evidence → Author Assessment Components. The upstream workflow is not copied. Saved Learning Outcomes are not extracted. Topic and ordinary source starts remain. Target component count is an author scope constraint passed into Plan Assessment Evidence and then into Author Assessment Components. It does not change topology. Purpose, diagnostic intent, and optional weighting also do not change topology.

- **Status:** **Accepted** (2026-09-28) — [S88-T-017](PLAN.md)

- **Design Page:** Not added. Existing Design Page emits a partial learning page (`artifact_type: page`) whose deterministic assembly expects Interactive activity/material captures or Expository chapter partials already produced upstream. The renderer publishes that page. It has no consumer for `artifact_type: assessment_pack`. Using Design Page for Assessment Pack would require a new page contract and a new renderer path. That is a material architecture change, so Assessment Pack ends at Author Assessment Components.

- **Consequences:** Supersedes the saved-Learning-Outcomes shortcut in S88-D17 and S88-D23. Sprint 88 stays **OPEN**. Later response forms, marking, feedback stages, and a complete assessment renderer stay out of scope.

- **Evidence:** `lib/first-class-workflow-family.js`; `lib/ld-design-page-partial-contract.js`; `lib/page-vnext-assemble.js`; `tests/s88-assessment-pack-first-slice.test.js`.

---

## S88-D25 — Assessment Pack is a formative product with deterministically judged forms

- **Decision:** A real Assessment Pack end-to-end run has assembled and rendered. The product is primarily formative. Two learner-facing uses share that architecture: a formative check ("How well do I understand this?") and a pre-test diagnostic ("What should I concentrate on?"). Recommendations are advisory. PRISM does not skip, lock, unlock, or route content. The initial first-class forms are those PRISM can judge deterministically: single-answer MCQ, multiple-answer MCQ, ordering, classification, and matching. Open constructed responses are deferred until a credible judgement and feedback model exists. Component mix is either PRISM deciding among those forms or an author allocation that must total the target count. Diagnostic summary uses component results mapped to intended learning, not an overall percentage alone.

- **Status:** **Accepted** (2026-09-28)

- **Consequences:** Summative mode is not a first-class create option. Short constructed response is not commissioned by the current family. Sprint 88 stays **OPEN**. Later forms, model-assisted marking, and adaptive routing stay out of scope.

---

## S88-D26 — First generated formative pack: feedback depth and learner-facing outcomes

- **Decision:** A fresh model-generated 12-component formative Assessment Pack completed the pipeline and rendered. Twelve components was a deliberate test size, not an error. The five-form repertoire produced a viable varied assessment. Real use showed thinner feedback on ordering, classification, and matching than on multiple-choice, unexplained internal outcome ids in the summary, and clumsy ordering and classification controls. Author Assessment Components must write substantive learner-facing `feedback_note` text for every supported form. Assembly reads outcome statements from the Learning Outcomes artefact. The page orients with "What this assessment checks" and names outcomes by those statements. No change to Plan Assessment Evidence variety or stimulus kinds.

- **Status:** **Accepted** (2026-09-28)

- **Consequences:** One generated pack is not evidence of a systematic diversity defect. Sprint 88 stays **OPEN**.

---

## S88-D27 — Evidence depth, automatic count, evidence profile, and feedback timing

- **Decision:** Assessment depth is quick, standard, or thorough. It is an alpha hypothesis about how much evidence to seek, not difficulty and not a calibrated scale. Component count stays available because an exact count can be a legitimate design constraint. The default is that PRISM decides the count. Plan Assessment Evidence chooses that count from the outcomes, use, and depth. There is no universal questions-per-outcome rule. An exact count constrains the plan and does not redefine whether the evidence is sufficient. The outcome summary is an evidence profile: successful checked opportunities over checked opportunities, with the count written out, not a mastery report. One successful component is limited evidence. Feedback timing is independent of formative or diagnostic use. After each component and at the end of the assessment are both supported. Later calibration should look at counts from real packs before changing these defaults.

- **Status:** **Accepted** (2026-09-28)

- **Consequences:** Sprint 88 stays **OPEN**. No psychometric model, mastery threshold, or adaptive routing is added.

---

## S88-D28 — No author-controlled component-form allocation in the current Assessment Pack

- **Decision:** The first-class Assessment Pack does not currently expose author-controlled component-form allocation. Plan Assessment Evidence selects among the supported forms according to the intended learning and the evidence plan. An exact component count remains a separate hard limit, and the default is still that PRISM decides the count. Author form constraints may be reconsidered if real use or expert review establishes a concrete need. A custom allocation passed to a new build is ignored, so it does not constrain that pack. Saved workflows keep the prompts they were created with.

- **Status:** **Accepted** (2026-09-28)

- **Consequences:** Sprint 88 stays **OPEN**. This is an alpha scope decision about current usefulness, not a finding that author form constraints are invalid.

