# Sprint 89 — Decision Log

**Sprint status:** **OPEN** — investigation not started  
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
  - No debt item is resolved by this decision. Domain Packs are not removed, and their eventual shape is not decided here.
