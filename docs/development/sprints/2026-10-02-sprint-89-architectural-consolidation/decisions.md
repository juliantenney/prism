# Sprint 89 — Decision Log

**Sprint status:** **COMPLETE / CLOSED** — [S89-D08](decisions.md#s89-d08--close-sprint-89--architectural-consolidation-complete)  
**Format:** ID · Decision · Status · Rationale · Consequences  
**Charter:** [SPRINT-89-CHARTER.md](SPRINT-89-CHARTER.md)

---

## S89-D01 — Open Sprint 89 — Architectural Consolidation

- **Decision:** Open Sprint 89 to bring the implementation into alignment with the established first-class product and pipeline model before extending that model. Opening does not authorise implementation. The first substantive activity is a diagnostic trace of a hypothetical fourth sibling product. Sprint 88 is **COMPLETE / CLOSED** for its architecture; its unfinished Assessment real-use calibration stays outside this sprint.

- **Status:** **Accepted** (2026-10-02)

- **Consequences:** No architectural investigation has been performed by this decision. S88-AD-001 through S88-AD-006 are inputs, not resolutions. Outcomes Map, Course Home, and PB-FA-015 candidates remain backlog directions. [S89-D02](#s89-d02--first-class-product-pipelines-are-predetermined) replaces the investigation order stated above. It does not reopen this opening.

---

## S89-D02 — First-class product pipelines are predetermined

- **Decision:** First-class PRISM products have predetermined pipelines. Workflow elicitation is not part of first-class product creation. This follows from the already-established principle: known process → encode it; unknown process → reason about it. Interactive Resource, Expository Resource, and Assessment Pack are products with defined pipelines, not products with merely preferred or default pipelines. This is an architectural decision, not a hypothesis for Sprint 89 to test.

- **Status:** **Accepted** (2026-10-02)

- **Consequences:**
  - For a first-class product, the product determines the workflow structure. PRISM does not elicit or generate that workflow at runtime.
  - Author inputs may parameterise the predetermined pipeline. Supported input modes may select legitimate predetermined branches. Source-based and topic or focus-based creation may use different known entry paths. Product-specific options may change behaviour inside the pipeline. None of that is eliciting the workflow.
  - Asking the author for information a known pipeline needs — topic or focus, source material, audience or context, product parameters, constraints, preferences — is **input acquisition**. It is not **workflow elicitation**. The obsolete idea is that PRISM must reason with the author to discover the structure of the workflow for a known first-class product.
  - Custom remains distinct. It is for a process the author deliberately specifies or explores outside the established first-class pipelines. Workflow variability still matters there, and for exploratory processes that have not yet matured into first-class products. A process becomes a first-class product when its educational purpose and design process are understood well enough for PRISM to encode its pipeline. That sentence is not an implementation architecture.
  - If old elicitation or workflow-generation machinery exists only to determine the runtime workflow of a known first-class product, Sprint 89 may treat that responsibility as legacy architecture. Whether any particular code serves only that purpose is still for the repository investigation. This decision does not inspect or delete code. Generated and custom machinery may still have legitimate work outside first-class product creation.
  - No debt item is resolved by this decision. Domain Packs are not removed, and their eventual shape is not decided here. [S89-D03](#s89-d03--custom-means-a-manually-assembled-workflow) states what Custom means. It is not the generated-workflow path.

---

## S89-D06 — Authorise consolidation implementation

- **Decision:** Sprint 89 implementation may delete obsolete architecture that the investigations showed is not used by the three first-class products or by manually assembled Custom workflows. The authorised areas are: generated and elicited workflow topology; old Interactive assessment-question stages and their policy; Domain Pack material that exists only for those; authoritative product identity; Interactive behaviour that was applied by fall-through; and a small routing boundary for the three real products. This is not a plugin system, a universal assembler, or a new product.

- **Status:** **Accepted** (2026-10-02)

- **Consequences:** S88-AD items are resolved only when the corresponding code is actually gone. Outcomes Map, Course Home, and a Research product are not part of this work.

---

## S89-D03 — Custom means a manually assembled workflow

- **Decision:** Custom means a workflow the author assembles from prompts created in Prompt Studio. It does not mean “anything that is not a first-class product”, a generated workflow, an elicited workflow, or Research. Those may currently share code, but they are distinct and must be traced separately.

- **Status:** **Accepted** (2026-10-02)

- **Consequences:** This refines the Custom sentence in S89-D02. It does not remove Custom. It does not delete generated-workflow code.

---

## S89-D04 — Research is not a current architectural requirement

- **Decision:** Learning Design is the only domain that is established for current PRISM product work. Research remains speculative. Expository Resource may already cover much of the synthesis-shaped purpose that motivated a Research domain. Supporting the idea of more than one domain does not require keeping a second operational domain as proof of that idea.

- **Status:** **Accepted** (2026-10-02)

- **Consequences:** Do not cite current Research code as a reason to preserve architecture. Do not design a Research product or domain in Sprint 89. Do not remove the existing Research implementation in this investigation. It may later remain, simplify, be archived, or disappear when there is evidence.

---

## S89-D05 — Interactive does not own formative assessment questions

- **Decision:** Interactive Resource does not carry an optional formative-assessment-question capability. Its formative role is the diagnostic and formative feedback already inside the interactive learning experience. Structured questions and components whose purpose is interpretable evidence of learning belong to Assessment Pack.

- **Status:** **Accepted** (2026-10-02)

- **Consequences:** Older Interactive options, stages, policies, prompts, or heuristics whose job is to add formative assessment questions are legacy candidates. They are not removed by this decision. Interactive feedback itself stays. Assessment Pack stays the first-class assessment product. S88-AD-001 is not marked resolved; this decision may mean that item is narrower than the full legacy surface.

---

## S89-D07 — First-class products share one declaration

- **Decision:** Interactive, Expository, and Assessment are the only first-class products. Their declaration lives in `lib/first-class-workflow-family.js` together with the predetermined pipelines. Shared Create, prompt routing, and publishing ask that declaration. Product-specific prompts, parameters, and publishers stay in their own code. Custom is not a member.

- **Status:** **Accepted** (2026-10-02)

- **Consequences:** S88-AD-005 is resolved by [S89-IMPLEMENTATION-SLICE-4.md](S89-IMPLEMENTATION-SLICE-4.md). This is not a plugin system or a universal assembler. A later product is added by extending the declaration and adding its own implementation.

---

## S89-D08 — Close Sprint 89 — Architectural Consolidation complete

- **Decision:** Close Sprint 89. Slices 1–4 are accepted. S88-AD-001 through S88-AD-006 are resolved for this sprint. The broad suite is not green: 517 learner-renderer and page-render failures remain for later classification, recorded as PB-S-007. No further implementation slice is part of this close. No successor sprint is opened.

- **Status:** **Accepted** (2026-10-02)

- **Consequences:** [SPRINT-89-CLOSURE.md](SPRINT-89-CLOSURE.md) is the closure record. Assessment Pack real-use calibration stays on the backlog. Outcomes Map, Course Home, new products, Research, and renderer repair are not started by this decision.
