# PRISM Product Backlog

**Canonical location:** `docs/backlog/PRODUCT-BACKLOG.md`  
**Status:** Active — **alpha-use period** (Alpha development complete, 2026-09-02)  
**Last updated:** 2026-11-25 (**Sprint 105 — Learning Journey Progressive Capture and Assembly CLOSED — COMPLETE** [`4b698db`–`a7ad249`, `S105-D04`]; **Sprint 104 — Workload Fidelity and Proportionate Authoring** formally resumed at live acceptance per `S104-D05`: M1 integrated acceptance, M6 Practice probes, M7 Economics completion/QA/runtime)  
**Open sprint:** [Sprint 104 — Workload Fidelity and Proportionate Authoring](../development/sprints/2026-11-24-sprint-104-workload-fidelity-and-proportionate-authoring/SPRINT-104-START-HERE.md) — **OPEN — RESUMED AT LIVE ACCEPTANCE (`S104-D05`)** (M1–M5 committed `f1f1269`; M1/M6/M7 live acceptance active ahead of Connect More; `PB-FA-025`).  
**Last closed sprint:** [Sprint 105 — Learning Journey Progressive Capture and Assembly](../development/sprints/2026-11-25-sprint-105-learning-journey-progressive-capture-and-assembly/SPRINT-105-CLOSURE.md) — **CLOSED — COMPLETE**. Prior: [Sprint 103](../development/sprints/2026-11-23-sprint-103-learning-journey-runtime-continuity-and-commissioning-fidelity/SPRINT-103-CLOSURE.md) · [Sprint 102](../development/sprints/2026-11-20-sprint-102-learning-journey-owned-outcomes/SPRINT-102-CLOSURE.md) · [Sprint 101](../development/sprints/2026-11-19-sprint-101-practice-as-a-learning-journey-component/SPRINT-101-CLOSURE.md) · [Sprint 97](../development/sprints/2026-11-12-sprint-97-learning-journal-and-design-pattern-foundations/SPRINT-97-CLOSURE.md) (PB-FA-028 delivered).  
**Architectural policy:** [S103-D01 — Learning Journey-first architecture](../development/sprints/2026-11-20-sprint-102-learning-journey-owned-outcomes/decisions.md#s103-d01--learning-journey-first-architecture) — **Accepted**; commissioning alignment verified in Sprint 103.

This file answers: **what might we actually choose to work on next?**

It is **not** a catalogue of every historical observation. Sprint debt ledgers and governance records remain historical evidence; they are not automatically planning obligations.

**Planning principle:** A backlog item should only enter a sprint when it has a concrete implementation approach, clear ownership and acceptance criteria. Do **not** pre-assign a sprint number until a sprint pack is opened.

**How next work is selected:** Deliberately from this backlog and/or **evidenced alpha-use findings**. Open a new sprint only via an explicit opening decision.

---

## 1. Significant product investigations / capabilities

### PB-FA-011 — Expository Resource

**Status:** First-class Expository Resource **implemented** ([Sprint 85 COMPLETE / CLOSED](../development/sprints/2026-09-21-sprint-85-expository-resource-implementation/SPRINT-85-CLOSURE.md)).

A high-quality, richly written and illustrated explanatory learning resource analogous to a strong book chapter, designed for understanding through exposition rather than learner activity.

**Delivered (S83–S85):** investigation → planning → implementation of Create product `expository_resource`, sibling EJP/XD/XM pedagogy, ordered exposition sections, shared graphics/formal-notation/assembly/render/export path, Adjustments Scope / extent, learner closing paragraph — Interactive baseline protected.

**Closure distinction (S85):** establishes **functional** first-class Expository capability; does **not** claim learner-facing presentation is polished or final. Non-blocking polish/refinement observations remain observations only — not an automatic follow-on programme.

**Key architectural hypothesis (still open):** Expository Resource may also be a rich realised-content input to other PRISM products (e.g. Interactive generation after grounded exposition; later Podcast/Presentation). That relationship is **not** resolved by S85.

**Unresolved relationship to Research Synthesis** (remains open — do not treat as delivered):

> Is Research Synthesis a distinct PRISM product/domain, or is it a specialised source/provenance treatment of Expository Resource?

A possible distinction: Research Synthesis may require stronger multi-source synthesis, provenance, evidence and citation semantics; Expository Resource is concerned more generally with producing a rich, coherent explanation. Former **PB-FA-009** (Research domain pack maturation) is **merged into this open question** — not retained as an independent future product.

**Sprint allocation:** **Sprint 83 CLOSED** (investigation). **Sprint 84 CLOSED** — [Planning](../development/sprints/2026-09-21-sprint-84-expository-resource-planning/SPRINT-84-CLOSURE.md). **Sprint 85 CLOSED** — [Implementation](../development/sprints/2026-09-21-sprint-85-expository-resource-implementation/SPRINT-85-CLOSURE.md) ([S85-D08](../development/sprints/2026-09-21-sprint-85-expository-resource-implementation/decisions.md#s85-d08--close-sprint-85--expository-resource-implementation-complete)). Gates at close: focused **78/78** · first-class **339/339**. Binding remains accepted [S84 design](../development/sprints/2026-09-21-sprint-84-expository-resource-planning/S84-EXPOSITORY-RESOURCE-DESIGN.md) · [S83-D04](../development/sprints/2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline).

**Remaining planning interest under this ID:** Research Synthesis relationship question only — not unimplemented Expository product work. Editorial quality of delivered Expository Resources was investigated and first-sliced under [PB-FA-012](#pb-fa-012--expository-editorial-quality--qa) (Sprint 86–87 — **CLOSED**).

### PB-FA-012 — Expository Editorial Quality & QA

Investigate and design the **editorial** quality layer for first-class Expository Resources — distinct from the instructional architecture already delivered in Sprint 85 — then implement and validate the bounded first successor slice.

**Problem frame:** A resource can be factually correct, pedagogically sensible and technically valid yet still feel editorially mediocre (assembled from competent components rather than authored as a coherent intellectual reading experience).

**Scope sketch:** general editorial quality model; repeatable Expository QA process (qualitative human judgement — not a numerical score programme); small diverse generated evidence set; pipeline responsibility map on the **existing** Expository topology; XD→XM prose/representation integration finding; typography/editorial rendering requirements; bounded successor implementation design; first-slice implementation + live validation.

**Explicit non-scope (never first-slice acceptance):** full T-009 Option B; semantic H3 programme; font/serif programme; callout kit; post-XM rewrite stage; mandatory material↔figure 1:1; broad design-system programme; CAS/per-cell table maths; Interactive prompt generalisation; Research Synthesis identity; Expository→Interactive architecture.

**Sprint allocation:** **Sprint 86 COMPLETE / CLOSED** (investigation/design). **Sprint 87 COMPLETE / CLOSED** (first-slice implementation + validation) — [T-008](../development/sprints/2026-09-22-sprint-87-expository-quality-first-successor-implementation/T-008-SPRINT-87-CLOSURE.md).

**Readiness:** **CLOSED** with Sprint 87. Deferred capabilities above remain future/backlog only if later authorised — not incomplete PB-FA-012 delivery.

### PB-FA-002 — Programming / code learning-resource support

**Status:** Open — unallocated. **Not sprint-allocated.**

Genuine missing future capability for programming learning resources. Programming-specific learner work, language-aware presentation, evidence and feedback remain potential distinct requirements. **No solution architecture has yet been agreed.**

**Scope sketch:** learner code handling; programming-specific workspaces; language-aware rendering; programming evidence and feedback.

**Evidence basis:** `S71-F-014` (Confirmed). Former research question PB-R-002 (which languages / IO affordances first) is absorbed here as discovery work when this item is planned — not a separate standing research theme.

**Readiness:** Evidence of need exists; approach and acceptance criteria not yet written — **not sprint-allocated**.

### PB-S-005 — Release / deployment packaging

**Status:** Open — **high priority for operational readiness.** **Not sprint-allocated.** Do **not** claim a release process is implemented.

Establish a repeatable path from active development to a **known-good stable release**, emphasising **reproducible deployment packages from a verified source state**, with version/build identity, release checklist, regression gate, and rollback/update procedure.

**Evidence:** Sprint 75 operator/debug experience; governance [D-006](../development/governance/ARCHITECTURAL-DEBT.md#d-006--release-packaging) (High, post-alpha planning → this item).

**Immediate concern:** a clean, reproducible deployment folder/package that separates what a deployable PRISM build needs from development and repository material. D-006 already states this: produce a package from known-good source rather than deploying the working project folder, and record what is shipped and from which verified state.

**Boundary:** Do not use this item to design hosting, authentication, publishing, server-side user persistence, or other production infrastructure. Those are separate questions. Authentication remains [PB-S-006](#pb-s-006--institutional-authentication-university-of-nottingham) — preserve the boundary between deployment packaging and authentication.

**Readiness:** Problem documented; approach and acceptance criteria not yet written — **not sprint-allocated**.

### PB-FA-018 — Shared data and mathematical visualisation

**Status:** Open — linked to [PB-FA-020](#pb-fa-020--precision-graphics-and-structured-visual-specifications) and [PB-FA-021](#pb-fa-021--expository-editorial-integration-and-publication-quality). **Not sprint-allocated.** Statistical-representation (scatterplot) investigation recorded below; **deferred until after Connect More**.  
**Scope:** Cross-product platform capability. Does **not** change Sprint 93’s Assessment Pack educational contract.

Establish a shared, accessible, **deterministic** visualisation capability available to all PRISM products, supporting authored data, charts, plotting, and learner-responsive interactions.

**Distinction from PB-FA-020:**

- **PB-FA-018** — deterministic rendering, charts, plotting, and learner-responsive visualisation.
- **PB-FA-020** — precision-aware visual specifications and validation of scientific/mathematical accuracy.

Do **not** merge the two items. Do **not** commit to a specific charting or maths library from this note.

**Educational opportunity:** Learners inspect, manipulate, and reason with visual representations of data and mathematical relationships, rather than relying only on static graphics. Charting and deterministic diagramming sit alongside mathematical visualisation. They do not retire generative image briefs.

Potential applications include:

- Interactive normal distributions, skewness, sampling distributions, and confidence intervals.
- Statistical plots, regression, and other research-methods visualisations.
- Learner-responsive spidergrams and formative feedback profiles.
- Charts based on learner-generated observations and data.
- Accessible visual explanations in Expository and evidence inspection in Assessment Pack.
- Deterministic concept maps and relationship diagrams whose nodes, labels, and connector conventions are authored as data.
- Learner-responsive visualisations that update from learner action in Expository, Interactive, **Practice**, Assessment Pack, and Situated Task.

**Architectural principles:**

- One shared capability, available to all products.
- Product identity remains determined by educational responsibility.
- Authoritative data and mathematically correct computations.
- Declarative specifications wherever possible; no routine generation of bespoke JavaScript.
- Browser-side interactivity without runtime AI or backend dependencies.
- Accessibility by design: keyboard interaction, meaningful descriptions, numerical and tabular alternatives.
- Consistent behaviour in Preview, standalone HTML, and Learning Journey packages.
- Explicit versioning and validation of supported visualisation specifications.

**Existing foundation:** Assessment Pack already compiles a deterministic horizontal-bar SVG from `data_figure` and authoritative numeric data (`lib/assessment-pack-publish.js` · `realiseDataFigure`). That path should inform the shared architecture. It is not a general charting library, and it is not discarded by this item. Generated image briefs remain pictures, not data-bound charts. Optional maths follow-ons stay [PB-M-001](#pb-m-001--future-maths-capabilities).

**Sprint discovery questions:**

1. Which charting and mathematical libraries best fit PRISM’s offline, self-contained publishing model?
2. What common specification can support fixed and learner-responsive visualisations?
3. How should learner workspace data bind to charts safely?
4. What accessible alternatives and interactions must every visualisation provide?
5. How should all Design Page pipelines discover and use the shared capability?

**Initial acceptance demonstrations:**

- An accessible, parameter-adjustable normal distribution in an Interactive experience.
- A learner-responsive diagnostic spidergram in Assessment Pack.
- A fixed statistical chart in Expository.
- Equivalent functionality in Preview and exported learner packages.

**Out of scope:** A comprehensive statistical analysis package; arbitrary generated JavaScript; changes to Sprint 93’s educational contract; merging into PB-FA-020.

#### Shared deterministic statistical representations — C01 investigation (2026-11-24)

**Classification:** Future architectural enhancement. **Not a production defect.** **Deferred until after Connect More (Wed 2 Dec 12:00)**; the feature freeze applies. Cross-references: [PB-FA-020](#pb-fa-020--precision-graphics-and-structured-visual-specifications) (precision graphics and validated specifications) and [PB-FA-021](#pb-fa-021--expository-editorial-integration-and-publication-quality) (editorial integration and intra-section representation placement).

**Context and motivation.** During the November 2026 Learning Journey QA exercise, *C01 — Interpreting relationships in economic data* scored **88/100**. Its principal educational limitation is that five economic datasets are presented as **character-based scatterplots**, although both learning outcomes (LO1 interpret scatterplots by direction, strength, form and variation; LO2 interpret supplied Pearson coefficients alongside graphical evidence) depend directly on reading graphical evidence. *C02 — What does a causal claim actually mean?* showed that deterministic SVG scatterplots rendered from structured specifications are accurate and contribute to its improvement from **69/100 to 90/100** after publishing corrections. The objective is a **shared, product-independent** capability to commission, author, validate and render accurate disciplinary representations. It must not become a Practice-specific scatterplot feature.

**Findings (investigation completed 2026-11-24; code references are to commit `acbe401`, line numbers approximate).**

1. **Origin of the C01 plots.** The plots are authored Markdown text, not failed graphical output. Each is a fenced ```` ```text ```` block inside a Markdown `body` string (`body_format: "markdown"`) of a `data_table` or `worked_example` material. They render as `<div class="util-fenced-text"><pre>…</pre></div>` (`lib/learner-renderer-vnext/render-html-utils.js` ~231) with no role, name or description, so assistive technology reads a stream of `●`, `|` and `-` characters. The semantic Markdown tables beside each plot are the only accessible equivalent. The Design Page contains **no** `scatterplot`, `x_axis`, `y_axis`, `observations` or `accessible_description` keys. `required_materials[].specification` and `evidence_requirement` are prose only.
2. **Practice has no structured scatterplot authoring contract.** No Practice, GAM or Design Page contract in `lib/` mentions scatterplots. `buildMaterialModel` (`lib/learner-renderer-vnext/parse-material.js` ~582) JSON-stringifies object bodies; `renderMaterialBody` (`render-material.js` ~390) renders `data_table` through Markdown with `wrapTables`, and `worked_example` through plain Markdown. `validate-input.js` does not constrain material body shape, so extra keys are accepted. There are two precedents for structured Practice payloads: `checklist` (object body with `body_format: "json"`) and `selection` (sibling `selection` object on the material).
3. **Expository has a working deterministic renderer.** In `lib/learner-renderer-vnext/expository-structured-materials.js`: `buildExpositionStructuredMaterial` (~1278) detects the shape through `extractScatterplotSpec` (~3697, duck-typed: an object body with `scatterplot`, or `x_axis`/`y_axis`, plus at least two `observations`/`points`), `normalizeScatterplotAxis`, `normalizeScatterplotMaterial` (type `expository_structured_scatterplot`) and `renderScatterplot` (~3888). `renderExpositionStructuredMaterial` (~4123) is the only exported renderer entry point. It is wired solely into Expository (`build-page-model.js` ~72, `render-page.js` ~279). Spec shape: `{ title, context, source_note, scatterplot: { title, x_axis: { label, minimum, maximum, tick_interval, scale }, y_axis: {…}, observations: [{ label, x, y }], caption, accessible_description }, table }`. Behaviour: inline SVG, separate equally prominent points, **no trend or regression line**, per-point `<title>` of the form `label: (x, y)`, `<desc>` only from an authored `accessible_description` (the renderer never synthesises interpretive text), optional companion table. Regression coverage: `tests/qa-c02-expository-structured-rendering.test.js` (M01 education/earnings, M04 prices/sales; two SVGs asserted in standalone and unified Learning Journey packages).
4. **Existing C01 content cannot be upgraded automatically.** The observations and axis labels exist only in the Markdown tables and in the plots' own text. Axis ranges, ticks, scale intent and the H09 emphasis exist nowhere as structured data. Deriving a specification from the tables or the character plots would be heuristic inference, which this item **excludes**. Upgrading C01 therefore requires newly authored specifications (regeneration, or hand-authored fixtures).
5. **Renderer gaps for C01.**
   - All points render identically, so the additional household H09 cannot be distinguished without a per-observation emphasis or series and a key.
   - With no explicit axis `minimum`/`maximum`, points sit on the plot edges, so authors must supply padded ranges. Explicit ranges are also what gives **identical scales** across related plots.
   - `renderScatterplot` emits Expository-named shell markup (`materialShellOpen`, `util-exposition-scatterplot`), so Practice needs a figure-only function.
   - Caption, context and source-note styles are scoped to the Expository publishing CSS (`app.js` `getUtilityExpositoryPublishingCss`). The SVG itself is inline-styled and is unaffected.
6. **Placement limitation (see [PB-FA-021](#pb-fa-021--expository-editorial-integration-and-publication-quality)).** A2-M3 and A2-M7 each interleave heading, plot, table and coefficient for two datasets within one material. A single sibling payload cannot be interleaved with body sections. This is the same missing-anchor limitation found in Expository: a material carries no authored intra-section position.
7. **Accessible-description risk is an authoring risk, not a renderer one.** Because the renderer only emits authored descriptions, leakage arises only if an author writes pattern language. Any rule that depends on judging wording as neutral would be a text heuristic. See the description policy below.

**C01 acceptance reference.**

- **Identifiers:** workflow `cc3cfb04-c02e-41c2-9691-90afa4f97350`; commission `C01`; page `learner-page--c01`; workflow name *Interpreting relationships in economic data*; Design Page schema `2.0.0`; source corpus `ECON-CORR-01` (synthetic teaching evidence). The plot instances are in `activities[].materials[]` (`A1-M*`, `A2-M*`).
- **Fixture locations:** the assembled Design Page JSON and the learner package (`interpreting-relationships-in-economic-data (4).zip`, containing `learner-page.html`; nine `<pre>` plots confirmed) were supplied during QA and are **not stored in the repository**. Retain or recreate them as a committed fixture when implementation is scheduled. The C02 reference fixture is `buildC02AssembledPage` in `tests/qa-c02-expository-structured-rendering.test.js`. Related QA suites: `tests/qa-practice-workspace-sequencing.test.js`, `tests/qa-disclosure-and-table-presentation.test.js`, `tests/s87-expository-wide-table-overflow.test.js`.
- **Plot inventory (9 instances, 7 materials, 5 datasets):**

| Material | Type | Dataset(s) | Plots | Pedagogical function |
|---|---|---|---|---|
| A1-M2 | worked_example | D01 | 1 | Worked interpretation (patterns may be explained) |
| A1-M3 | data_table | D02 | 1 | Guided evidence before A1-M4 (feedback after attempt) |
| A1-M5 | data_table | D03 | 1 | **Independent operand**; withhold interpretation until A1-M6/M7 complete |
| A2-M2 | worked_example | D01 | 1 | Worked; learner predicts sign and strength before the coefficient is revealed |
| A2-M3 | data_table | D02 + D03 | 2 | Guided comparison with supplied coefficients (r = −0.94, −0.04) |
| A2-M5 | data_table | D04 | 1 | **Independent operand**; the U-shape must not be disclosed |
| A2-M7 | data_table | D01 + D05 | 2 | **Independent operand**; identical scales; H09 emphasised |

- **Authoritative datasets (observation, x, y):**
  - **D01** *Household disposable income vs consumption expenditure* (GBP per month; 8 households): H01 (1500, 1400), H02 (2000, 1900), H03 (2500, 1800), H04 (3000, 2300), H05 (3500, 2200), H06 (4000, 2700), H07 (4500, 2600), H08 (5000, 3100). Supplied r = 0.96.
  - **D02** *Retail price per item (GBP) vs weekly quantity sold (items)*, 7 outlets: R01 (2, 120), R02 (2.5, 110), R03 (3, 115), R04 (3.5, 95), R05 (4, 85), R06 (4.5, 90), R07 (5, 75). Supplied r = −0.94.
  - **D03** *Standard delivery charge (GBP) vs weekly orders (orders)*, 7 retailers: O01 (1, 100), O02 (2, 120), O03 (3, 90), O04 (4, 110), O05 (5, 130), O06 (6, 80), O07 (7, 110). Supplied r = −0.04.
  - **D04** *Monthly production (thousands of units) vs average production cost (GBP per unit)*, 7 factories: F01 (10, 14), F02 (20, 9), F03 (30, 6), F04 (40, 5), F05 (50, 6), F06 (60, 9), F07 (70, 14). Supplied r = 0.00.
  - **D05** is D01 plus H09 (5500, 1200), 9 households. Supplied r = 0.35. A2-M7 requires D01 and D05 to share identical axes (the current character plots both span income 1500–5500 and expenditure 1200–3100). The coefficients are supplied authored values; the renderer must not compute or infer them.
- **Current learner journey references that depend on the plots:** `task_material_decision.task_input_material_ids`, `evidence_decision.provider_material_ids`, `practice_independence.attempt_operand_material_ids`, and the A1-S06/S07 and A2-S05/S06/S07 study-flow steps. Splitting a bundled material changes these references.

**Future requirements.**

- Shared structured representation contracts across product types, not tied to Practice or Expository.
- Deterministic rendering from authoritative data, without generative image production.
- Exact observation fidelity; explicit axis ranges, units, ticks and labels.
- Consistent scales across related representations to support comparative reasoning.
- Selective point emphasis and meaningful graphical annotations.
- Semantic companion data tables without unnecessary duplication.
- Explicit authored placement within the instructional or explanatory sequence (dependent on the [PB-FA-021](#pb-fa-021--expository-editorial-integration-and-publication-quality) anchor decision).
- Responsive presentation and functional accessibility.
- Backward compatibility with existing authored and published resources; the character-plot fallback must keep rendering.
- Extensibility to other disciplinary representations in mathematics, economics, engineering, geography and the sciences.

**Accessible-description principle.** Descriptions follow pedagogical function. Worked examples may explain patterns. Independent interpretation tasks must provide access to the evidence without revealing the interpretation learners are expected to construct. Pre-attempt guided evidence and prediction steps (A1-M3, A2-M2) should likewise be non-revealing; this classification is a design decision still to be confirmed. Avoid heuristic parsing of character-based plots, Markdown tables or explanatory prose.

**Unresolved design decisions.**

1. **Carrier for the specification.** Options: a sibling payload on the material, mirroring `selection` and using the Expository spec shape unchanged (recommended in the investigation), or an object body with `body_format: "json"` as `checklist` does.
2. **Bundled materials (A2-M3, A2-M7).** Options: split into one material per dataset at regeneration (changes IDs and the references listed above); render grouped figures above the body (loses interleaving); or add an anchor token (a real contract addition shared with PB-FA-021).
3. **Description policy.** Options: a description generated only from the structured spec (variables, units, axis ranges, observation count, pointer to the table), which cannot describe a pattern; or no `<desc>` on independent operands, relying on the semantic table. Whether authored descriptions are permitted for worked examples must also be decided. Neutrality must not be judged by wording heuristics.
4. **Point emphasis.** A per-observation emphasis or series field with a key (needed for H09), and the wider annotation vocabulary.
5. **Companion tables.** Render the table from the structured data (single source of truth) rather than authoring it twice. Cross-checking an authored Markdown table against the payload is excluded because it would require parsing Markdown tables.
6. **Shared module boundary.** Extract a figure-only function and spec normaliser from the Expository module into a product-neutral module, keeping Expository output unchanged.
7. **Producer guidance.** GAM and Design Page guidance to emit the payload and omit the character plot, and the validation required (explicit axes mandatory, minimum observations, identical-scale constraints for related plots).
8. **Handling of existing published resources.** Backward-compatibility policy for resources that carry fenced character plots.

**Proposed implementation approach (provisional).**

1. Extract a figure-only scatterplot function and spec normaliser from `expository-structured-materials.js`, protected by the existing C02 tests.
2. Add a Practice hook in `buildMaterialModel` and `renderMaterialBody` for `data_table` and `worked_example`, with a hand-authored C01 acceptance fixture.
3. Add per-point emphasis and key, consistent-scale authoring and the spec-only neutral description.
4. Add the authoring contract, producer guidance and validation.
5. Add placement once the PB-FA-021 anchor decision is made.
6. Later: further representation types (function plots, histograms, bar charts, distributions, maps, engineering diagrams) on the same shared contract.

**Provisional estimate (to be re-validated).** About **3–4 engineering days** for the initial scatterplot capability: figure extraction about 0.5 day; Practice hook and tests 0.5–1 day; H09 emphasis about 0.5 day; neutral default description about 0.25 day; Practice-scoped CSS and bundle rebuild about 0.25 day; producer guidance about 1 day. The **authoring contract and producer changes carry most of the risk.**

**Acceptance fixture (concrete references: the economics Learning Journey and C01).** A future implementation should demonstrate:

- Accurate conventional scatterplots for all nine existing plot instances.
- Preservation of all five authoritative datasets.
- Identical scales for the original (D01) and extended (D05) household datasets.
- Distinct emphasis of the additional H09 observation.
- Appropriate representation placement.
- Accessible descriptions that do not compromise independent interpretation (A1-M5, A2-M5, A2-M7).
- No regression in C02 Expository rendering (`tests/qa-c02-expository-structured-rendering.test.js`) or in existing Practice functionality.

**C06 Assessment Pack cross-reference (2026-11-24).** An Assessment Pack elicitation carried an authored scatterplot (dataset D09: eight observations, axis bindings, accessible data table, alt text and an r summary) in `elicitation.representation` that never reached the learner. A narrow interim correction now publishes it (`assessment-evidence-hydration.js` and `render-assessment-evidence.js`, reusing a shell-free `renderScatterplotEvidence` split out of `expository-structured-materials.js`, with Expository output unchanged). It maps only through the authored `plot_specification.*.variable_id` bindings, parses nothing from prose and fails closed if the table, observations, declared sample size or axis bindings disagree. This is a second consumer of the figure extraction in step 1 above (design decision 6 is therefore partly exercised) and a concrete acceptance case: the authored alt text states the variables and axes but no interpretation, which supports decision 3. Regression: `tests/qa-c06-assessment-evidence-and-artefact.test.js`.

**Deferred under this item: generic statistical-coefficient validation.** The C06 coefficient (r = 0.92, recomputed as 0.9182 from D09) was verified in that test only. Recomputing a declared statistic from the authoritative observations at publish time (Pearson r and other summaries, `display_precision` and rounding, `calculation_basis`, variable bindings) is **not** implemented and belongs to the shared deterministic representation work, so it is designed once for all representation types rather than special-cased for scatterplots.

**Readiness:** Proposed from the 2026-10-08 charting audit; Practice added among potentially supported products 2026-11-23; C01 statistical-representation investigation recorded 2026-11-24 (approach proposed, design decisions open); C06 interim Assessment Pack scatterplot publication and coefficient-validation deferral recorded 2026-11-24. Approach not yet chosen — **not sprint-allocated**. **Deferred until after Connect More.**

### PB-FA-019 — Interactive V2: educational solution design and interaction surfaces

**Status:** **Retired — superseded by Practice and Learning Journey-first architecture** (2026-11-23).  
**Type:** Major product discovery → later implementation (discovery first). Historical entry preserved.  
**Priority:** n/a (retired).

**Retirement (2026-11-23):** Practice ([Sprint 101](../development/sprints/2026-11-19-sprint-101-practice-as-a-learning-journey-component/SPRINT-101-CLOSURE.md)) has realised the principal educational direction previously envisaged for Interactive V2 — lean, control-first, activity-oriented engagement commissioned inside Learning Journeys. Learning Journeys now organise progression across specialised products (Expository, Practice, Assessment Pack, Situated Task) under the accepted Learning Journey-first direction ([S103-D01](../development/sprints/2026-11-20-sprint-102-learning-journey-owned-outcomes/decisions.md#s103-d01--learning-journey-first-architecture); policy accepted, not implemented as product defaults). Outstanding interaction-surface ambition continues under [PB-FA-030](#pb-fa-030--practice-interaction-surfaces), not as an Interactive product redesign. **Standalone Interactive remains supported.** This retirement is not a removal or migration decision.

**Historical rationale (preserved):** The original Interactive workflow was designed to support a complete learning experience within a standalone resource. Learning Journeys provide a stronger mechanism for orchestrating pedagogical progression across resources. Interactive v2 had been proposed to adopt the educational-solution design approach already working well for Assessment Packs and other Learning Journey components.

**Historical design principle:** *Learning Journeys orchestrate progression between learning experiences; Interactive designs the pedagogy within an individual experience.*

**Historical central question:** How should Interactive be redesigned when Learning Journey establishes educational context, progression, commissioning brief, and (when present) authoritative shared material, so Interactive concentrates on designing and realising the consequential engagement required inside one experience?

**Historical proposed direction:**

- Commission Interactive to design an educational solution from learning purpose, audience, context and constraints.
- Allow the designer to select appropriate interaction capabilities rather than prescribe a fixed structure.
- Develop a small, reusable repertoire of accessible, tested **interaction surfaces** (candidates: data exploration, decision-making scenarios, simulations, classification, annotation, constructed responses).
- Allow surfaces to be combined where pedagogically appropriate.
- Support authoritative shared datasets and scenarios inherited from Learning Journeys, while retaining standalone resource generation.
- Reduce duplication of pedagogical decisions already made at Learning Journey level.
- Related platform capability where visuals/data apply: [PB-FA-018](#pb-fa-018--shared-data-and-mathematical-visualisation).

**Historical dependencies (at proposal time):** Learning Journey commissioning model; shared-material Phase 1 handoff; Assessment Pack educational-contract pattern ([PB-FA-017](#pb-fa-017--assessment-pack-first-class-product-revisit) — CLOSED — ACCEPTED).

**Historical guardrails (preserved for context):** Preserve standalone Interactive capability; no routine stochastic JavaScript generation; Interactive Learning Sequence study-flow fidelity residual ([D-015](../development/governance/ARCHITECTURAL-DEBT.md#d-015--interactive-learning-sequence-study-flow-fidelity)) was not automatically absorbed into this item.

This was a revisit of the existing Interactive product, not a new first-class product under [PB-FA-015](#pb-fa-015--additional-first-class-learning-resource-pipelines).

**Readiness:** **Retired** — do not allocate. See [PB-FA-030](#pb-fa-030--practice-interaction-surfaces).

### PB-FA-020 — Precision graphics and structured visual specifications

**Status:** Proposed — unassigned. **Not sprint-allocated.**  
**Type:** Capability investigation (not an implementation commitment).

Author explicit visual structure — nodes, relationships, labels, visual conventions, and constraints — and extend that concern to **precision-aware technical and scientific graphics**, so authored structure can drive faithful generative briefs and/or deterministic render paths rather than relying on unstructured prose alone.

**Motivating example:** Lagrangian / constrained-mechanics diagram fidelity problems — cases where approximate or illustrative image generation fails to preserve exact geometry, spatial relationships, mathematical meaning, or disciplinary drawing conventions that the learning demand requires.

**Requirements direction:**

- Distinguish **illustrative imagery** (atmosphere, scene, non-critical layout) from **precision graphics** where exact geometry, spatial relationships, mathematical meaning, or disciplinary conventions are essential.
- Explore deterministic approaches such as SVG, programmatic plotting, and structured geometric specifications, with validation of underlying data and relationships.
- **SVG alone does not guarantee correctness** — markup without validated geometry/data can still be wrong.
- Generative graphics remain a valid rendering route where illustration (not precision) is sufficient; structured authorship makes generative briefs more faithful when generation is retained.

**Related:** Charting and deterministic diagramming, including concept maps, relationship diagrams, and learner-responsive visualisations across products, belong to [PB-FA-018](#pb-fa-018--shared-data-and-mathematical-visualisation). This item supplies structured authorship and precision-graphics investigation; it does not absorb general charting into a single implementation programme.

**C01 cross-reference (2026-11-24):** The C01 scatterplot investigation supplies a concrete data-bound case for this item's validation requirement: exact observation fidelity, explicit axes, units and ticks, consistent scales across related plots, and no inference of a specification from character plots, Markdown tables or prose. Findings, datasets and acceptance fixture are recorded under [PB-FA-018](#pb-fa-018--shared-data-and-mathematical-visualisation) (*Shared deterministic statistical representations*). They are not duplicated here.

**Readiness:** Proposed 2026-10-08; scope strengthened 2026-11-23 for precision-aware technical/scientific graphics. Approach not yet chosen — **not sprint-allocated**. Capability investigation only — no implementation commitment.

### PB-FA-021 — Expository editorial integration and publication quality

**Status:** Open — **verification first.** **Not sprint-allocated.**

Author and publish Expository resources with a coherent editorial hierarchy, so the learner experience reads as a deliberately edited educational publication rather than an assembly of authored components.

**Reconciliation (2026-11-23):** Before commissioning further development, **verify whether meaningful editorial-quality issues remain** after earlier Expository improvements ([PB-FA-012](#pb-fa-012--expository-editorial-quality--qa) closed; later publication hygiene). The first future action may be a **bounded verification task** rather than an implementation sprint. Do **not** presume the issue is resolved, and do **not** presume substantial development is required.

**Context:** *Choosing a Clinical Study Design: Questions, Evidence and Trade-offs* scored 84/100 on PRISM Expository Resource Quality Benchmark v1.2, with no identified Critical or Major production defects. Its educational purpose, intellectual progression, and disciplinary reasoning are strong. The principal remaining weakness at that evidence point was editorial integration: diagrams, captions, explanatory tables, descriptive equivalents, and prose sometimes compete for attention.

**Desired capability (if verification confirms remaining need):**

- Each representation has a clear, distinct educational purpose.
- Figures, tables, captions, and prose complement rather than unnecessarily repeat one another.
- Supporting materials are proportionate to the intellectual argument.
- Section transitions and explanatory emphasis support a continuous reading experience.
- Legitimate accessible descriptions and alternative representations are preserved, with appropriate presentation rather than indiscriminate removal.
- Learner-facing output feels like a deliberately edited educational publication.

**Deferred requirement (2026-11-24) — intra-section placement:** The revised *What does a causal claim actually mean?* (C02) resource improved from 69/100 to 90/100 under QA. The remaining weakness is that supporting representations (tables, figures, and similar materials) are appended to their section rather than placed at the point where the explanatory prose needs them. Investigation found the cause is **specification-level, not a renderer defect**: the Expository materials contract (`materials_commission[]` and `materials[]` in `lib/expository-contracts.js`) carries `section_id` only, with no anchor or position field. `lib/page-vnext-assemble.js` attaches materials by section, `render-page.js` places them before or after the whole exposition block, and the visual-affordance placement layer only offers `section-after-content`. Resolving this requires a bounded contract extension (an explicit, authored intra-section anchor) and must not be implemented as a universal materials-before-prose rule or by text-matching heuristics. Accepted at 90/100 and deferred pending a decision on this contract extension. **Dependency (2026-11-24):** the same missing anchor blocks interleaving multiple representations with explanatory prose inside one Practice material (C01 A2-M3 and A2-M7). The anchor decision should be taken once for both products; see [PB-FA-018](#pb-fa-018--shared-data-and-mathematical-visualisation) (*Shared deterministic statistical representations*, unresolved decision 2).

**Evidence:** Benchmark v1.2: 84/100. Representation 76, Information Architecture 78, Typography/Hierarchy 78. No production cap. Strong educational foundations should be preserved.

**Acceptance direction:** Compare actual published learner experiences with their intended educational purpose. Identify where editorial structure adds to or detracts from understanding. Evaluate through live publication inspection and independent QA. Aim for consistent 90+ quality without treating the score itself as the optimisation target.

**Boundaries:** Do not modify benchmark workflows or scoring rules. Do not weaken accessibility to make pages visually simpler. Do not reopen the recently fixed metadata leakage or alt-text defects unless new evidence warrants it. This is not shared graphics, deterministic diagramming, or structured visual specification — those remain [PB-FA-018](#pb-fa-018--shared-data-and-mathematical-visualisation) and [PB-FA-020](#pb-fa-020--precision-graphics-and-structured-visual-specifications).

**Related:** First-class Expository capability is [PB-FA-011](#pb-fa-011--expository-resource). The earlier editorial-quality investigation and first slice are closed under [PB-FA-012](#pb-fa-012--expository-editorial-quality--qa). This item does not reopen that delivery.

**Readiness:** Proposed 2026-10-08; verification-first posture 2026-11-23 — **not sprint-allocated**.

### PB-FA-025 — Duration fidelity: learner workload budgeting

**Status:** **Retain — open.** Partially advanced in Sprint 103 (guidance refinement only). **Not formally closed.**  
**Priority:** Medium–high (recurring, systemic instructional-design issue).

**Problem:** PRISM frequently generates resources whose actual learner workload substantially exceeds the duration specified during commissioning. The issue is insufficient control of cumulative learner workload, not poor activity quality.

**Reconciliation (2026-11-23):** Learning Journey commissioning has demonstrated coherent **planned** duration allocation across components, but **actual learner workload fidelity remains unverified**. Distinguish **planned duration** from **observed learner workload**. Do **not** mark this item complete based solely on component durations summing to the requested journey length.

**Sprint 103 progress (not completion):** The Sprint 100 advisory workload stack already covered most indicative planning behaviour. Sprint 103 made the smallest coherent refinement: a **familiar/revisit** reading band (distinct from first-pass evidence engagement), adapter inference for bring-forward / earlier-work language, commissioning-prompt duration-fidelity guidance, and advisory wording that prefers workload/staging/feedback adjustments over rewriting authoritative allocations. Focused automated tests pass. This does **not** validate measured learner completion times and does **not** alter the clinical journey’s authoritative 180-minute total or 40-minute final assessment allocation.

**Evidence:** *The Impossible Alibi: The Blackthorn Notebook Mystery* was commissioned as a 25-minute standalone Interactive resource, but review of the complete experience suggests approximately 60–85 minutes of learner activity (QA benchmark 88/100). The same overshoot pattern has been observed repeatedly across PRISM resources. Sprint 103 clinical Assessment Pack authoring and Learning Journey QA both flagged a commissioned 40-minute independent judgement as potentially tight for a 500–700-word argument — **indicative workload judgements**, not timed learner runs.

**Proposed direction:** Continue a lightweight, cross-resource approach using existing workflow stages and generation contracts. Treat commissioned duration as a meaningful design constraint; account for reading, evidence examination, cognitive processing, response production and self-review; distinguish familiar revisit from initial engagement; prevent later material generation from expanding workload beyond the original allocation; check cumulative duration plausibility at Design Page and QA; eventually validate against observed or inspected learner workload across several resources.

**Avoid:** Simplistic word-count calculations; rigid timing formulas; new estimation engines / workflow stages; unnecessary architectural complexity; equating planned journey totals with verified learner workload; closing this item on guidance refinement alone.

**Acceptance criteria (eventual implementation):**

1. Generated activity workloads are plausibly consistent with the commissioned duration.
2. Time allocations account for learner actions, not just content volume.
3. Later generation stages preserve the agreed workload budget.
4. Verification identifies material duration mismatches against observed or inspected learner workload — not only arithmetic of planned component durations.
5. Existing resource types and workflows remain compatible.

**Boundaries:** Backlog investigation / eventual contract and QA improvements. Do not absorb into the retired Interactive V2 programme ([PB-FA-019](#pb-fa-019--interactive-v2-educational-solution-design-and-interaction-surfaces)) as a substitute for this cross-resource concern.

**Readiness:** Proposed 2026-11-09; open after LJ duration-allocation observation 2026-11-23; Sprint 103 guidance refinement recorded — **measured validation and remaining fidelity work still open**.

### PB-FA-026 — Assisted brief development: from teaching intention to learning experience

**Status:** **Retain — lower priority.** **Not sprint-allocated.**  
**Priority:** Lower (authoring assistance; not an immediate implementation priority).

**Problem:** PRISM’s commissioning form captures structured requirements well, but offers limited support for authors who have a teaching intention without a clear learning experience in mind. Creative briefs that unlock sophisticated generation can emerge through conversation outside PRISM rather than through the commissioning interface.

**Reconciliation (2026-11-23):** Reframe explicitly around helping authors develop **sufficiently detailed briefs for creating effective Learning Journeys**. This is **authoring assistance**, not a separate pedagogical pattern catalogue (former [PB-FA-029](#pb-fa-029--pedagogical-design-pattern-catalogue) is retired).

**Evidence:** The *Impossible Alibi* experiment showed PRISM can construct detailed, internally coherent fictional scenarios. The enabling creative brief was developed conversationally outside PRISM.

**Proposed direction:** Explore an optional conversational brief-development experience that helps authors move from an initial teaching problem or intention towards a well-defined **Learning Journey** (and related resource) commission. It could help clarify what learners should understand, practise, decide or produce; explore pedagogical approaches; identify contexts, evidence, decisions, tensions or uncertainties; develop a promising idea into a structured commission compatible with existing workflows; and review/refine the brief before proceeding. Support different disciplines. Do not privilege fictional scenarios over other appropriate approaches.

**Design principles:**

- Optional — retain direct access to the existing commissioning form.
- Conversational and exploratory rather than another lengthy questionnaire.
- Support author agency and creative choice.
- Ground suggestions in intended learning, audience and constraints.
- Produce structured outputs compatible with existing commissioning requirements.
- Avoid duplicating existing generation stages or introducing unnecessary architectural complexity.
- Preserve the distinction between developing a brief and generating the resource.
- Do not recreate a standing pedagogical pattern catalogue.

**Potential acceptance criteria:**

1. An author can begin with an incomplete teaching intention and explore plausible Learning Journey / learning-design approaches.
2. The author can compare, select and refine ideas before committing to a commission.
3. The resulting brief can populate or inform PRISM’s existing commissioning process.
4. Authors can inspect and edit the brief before generation.
5. Existing direct commissioning workflows remain unchanged.

**Boundaries:** Backlog investigation only until sprint-allocated. Do not redesign the commissioning form or change generation contracts under this entry alone. Distinct from retired Interactive V2 ([PB-FA-019](#pb-fa-019--interactive-v2-educational-solution-design-and-interaction-surfaces)), duration fidelity ([PB-FA-025](#pb-fa-025--duration-fidelity-learner-workload-budgeting)), and retired pattern catalogue ([PB-FA-029](#pb-fa-029--pedagogical-design-pattern-catalogue)).

**Readiness:** Proposed 2026-11-10; reframed lower-priority LJ authoring assistance 2026-11-23 — **not sprint-allocated**.

### PB-FA-027 — Learning Design Extraction: technology-independent designs from completed resources

**Status:** **Retain — open.** **Not sprint-allocated.**  
**Priority:** Medium (future capability / proposed enhancement; not an immediate implementation priority).

**Objective:** Enable a **custom workflow** that takes an existing PRISM Learning Journey and extracts a **generic, technology-independent learning design** that an educator can implement using other tools, platforms or methods — including face-to-face delivery.

The extracted design should preserve educational intent, progression, learner activities, evidence and assessment logic **without requiring PRISM-specific components**. This is **distinct from exporting a runnable PRISM package**.

**Problem:** Completed PRISM resources and Learning Journeys embody substantial pedagogical design (outcomes, sequence, activities, dependencies, assessment, reflection), but that design is currently bound to PRISM’s product forms and delivery mechanisms. Educators who want to reuse the *learning design* elsewhere lack a readable, technology-independent specification that separates pedagogically essential features from implementation-specific choices.

**Proposed scope:**

- Identify intended learning outcomes and the overall pedagogical approach.
- Extract the learning sequence, learner activities, expected learner outputs, feedback, assessment and reflection.
- Identify essential dependencies, including activity ordering, staged information disclosure and opportunities for learners to reconsider earlier judgements.
- Describe the role of case materials, evidence and other supporting resources.
- Distinguish pedagogically essential features from implementation-specific choices.
- Distinguish directly observable design features from inferred educational rationale; avoid presenting inferred intentions as established facts.
- Produce a readable, implementation-independent specification suitable for adaptation by educators.

**Illustrative use case:** Given the completed Learning Journey *The Decision That Went Wrong*, PRISM extracts a design that an educator could implement as a face-to-face seminar, blended workshop, Moodle course, Xerte resource or another suitable format, while preserving the essential progression from initial judgement through evidence appraisal, reconsideration, stakeholder evaluation and independent recommendation.

**Acceptance criterion (eventual implementation):** An educator unfamiliar with PRISM can use the extracted specification to plan an alternative implementation without reproducing the original technology, while retaining the essential learning activities, dependencies, assessment and pedagogical intent evident in the source.

**Boundaries:** Future capability investigation only until sprint-allocated. Do not implement extraction workflows, schemas or generation changes under this entry alone. Distinct from assisted brief development ([PB-FA-026](#pb-fa-026--assisted-brief-development-from-teaching-intention-to-learning-experience)) — that item helps authors *compose* a commission; this item *abstracts* a design from a completed journey. Distinct from unified Learning Journey shell delivery ([PB-FA-022](#pb-fa-022--learning-journey-continuity-contract)–[PB-FA-024](#pb-fa-024--unified-learning-journey-experience--compatibility)) and from Course Home reconciliation ([PB-FA-016](#pb-fa-016--course-home--course-assembly)). Not a runnable-package export substitute.

**Readiness:** Proposed 2026-11-10; custom-workflow clarification 2026-11-23 — **not sprint-allocated**. Not implemented.

### PB-FA-030 — Practice interaction surfaces

**Status:** Proposed — unassigned. **Not sprint-allocated.**  
**Type:** Incremental Practice capability (investigation → bounded implementation when authorised).

**Objective:** Extend Practice’s existing control-first interaction architecture with educationally meaningful learner interaction surfaces.

**Candidate interactions:** ordering, ranking, matching, sorting, classification, and variable manipulation (illustrative — not a closed taxonomy).

**Requirements:**

- Make learner decisions and reasoning inspectable.
- Support appropriate attempt-before-feedback behaviour.
- Reuse existing Practice evidence, feedback, persistence and journal contracts.
- Support accessible keyboard operation and non-drag alternatives.
- Add interaction types incrementally in response to demonstrated educational needs.

**Relationship to retired Interactive V2:** This item replaces the outstanding interaction-development ambition of [PB-FA-019](#pb-fa-019--interactive-v2-educational-solution-design-and-interaction-surfaces) without reopening that Interactive product redesign. Standalone Interactive remains supported.

**Boundaries:** Do **not** implement controls under this entry alone. Do not reopen Interactive V2. Do not invent a parallel evidence/persistence system.

**Readiness:** Proposed 2026-11-23 from inter-sprint backlog reconciliation. Approach and acceptance criteria not yet written — **not sprint-allocated**.

### PB-FA-031 — Workspace folders

**Status:** Proposed — unassigned. **Not sprint-allocated.**  
**Provisional priority:** Medium–high.  
**Type:** Author workspace organisation capability.

**Objective:** Allow authors to organise growing collections of Learning Journeys, commissioned components and standalone resources.

**Initial scope:**

- Create, rename and organise folders.
- Move existing resources between folders.
- Provide navigation and an unfiled-resources view.
- Preserve resource identity and Learning Journey commission relationships.
- Keep workspace organisation distinct from learner-facing Learning Journey structure.
- Avoid destructive cascading deletion of resources.

**Boundaries:** Do **not** implement folders under this entry alone. Workspace folders are **authoring organisation only** — distinct from the delivered unified Learning Journey shell ([PB-FA-016](#pb-fa-016--course-home--course-assembly) reconciled; [PB-FA-023](#pb-fa-023--unified-learning-journey-runtime)–[PB-FA-024](#pb-fa-024--unified-learning-journey-experience--compatibility) complete).

**Readiness:** Proposed 2026-11-23 from inter-sprint backlog reconciliation. Approach and acceptance criteria not yet written — **not sprint-allocated**.

### PB-FA-032 — Situated Task structured progressive capture and pipeline alignment

**Status:** Proposed — unassigned. **Deferred until after Connect More.** **Not sprint-allocated. Not an S104 closure dependency.**  
**Type:** Authoring pipeline & structured-capture architectural alignment.

**Context:** Situated Task Stages 1–4 (*Situation*, *Activity*, *Support*, *Learning Return*) currently produce prose in a continuous conversation, with a structured JSON page artefact produced only at Stage 5 (*Design Page*). By contrast, Learning Journey (Sprint 105) and Practice/Interactive use structured progressive capture with per-stage validation, deterministic handoffs, and earlier feasibility checks.

**Future design scope to consider:**

- Explicit structured JSON contracts at appropriate intermediate stages.
- Semantic capture validation at each structured stage.
- Authoritative upstream artefacts and deterministic downstream handoffs between stages.
- Earlier workload feasibility assessment before final page synthesis.
- Dependency management and downstream invalidation when an upstream stage is revised.
- Compatibility with future automated orchestration.

**Educational boundary (mandatory):** Preserve the distinctive educational architecture of Situated Task (`situated_learning` purpose/activity/record/reconnection semantics, learner-owned enactment, `activities: []`, ordered learner-facing `sections[]`, and optional embedded/consolidated/hybrid recording). Do not flatten Situated Task into Interactive or Practice activity templates.

**Boundaries:** Backlog work only — do **not** undertake the pipeline migration before Connect More. This item is **not** a Sprint 104 closure dependency.

**Readiness:** Recorded 2026-11-26 following C4 Situated Task authoring and QA review. Approach and acceptance criteria not yet written — **not sprint-allocated**.

### PB-FA-033 — Expository downstream workload feasibility assessment

**Status:** Proposed — unassigned. **Deferred until after Connect More.** **Not sprint-allocated. Not an S104 closure dependency.**  
**Type:** Workload-feasibility coverage parity (Expository Resource).

**Context:** Learning Journey (upstream commissions), Practice/Interactive, Assessment Pack, and Situated Task (Stage 5) now have downstream workload feasibility adapters wired into PRISM's non-blocking advisory warning lifecycle. Expository Resource does not yet have a dedicated downstream workload feasibility adapter assessing concrete authored `sections[]` reading volume, structured materials, and embedded formative checks against an inherited commissioned duration.

**Initial scope to consider:**

- Add a dedicated Expository downstream workload feasibility adapter reusing `lib/workload-feasibility-estimator.js`.
- Assess concrete authored exposition reading volume, structured materials (tables, scatterplots, worked examples), and embedded formative checks against the workflow's authoritative inherited duration (when commissioned inside a Learning Journey; standalone Expository continues to use `Scope/extent` rather than `Duration`).
- Integrate with the shared non-blocking advisory warning lifecycle (capture, reload restoration, replacement, invalidation, clearing) without mutating schemas or duration locks.
- Preserve explicit `insufficient_evidence` / `duration_unavailable` status distinction.

**Boundaries:** Backlog item only — **no implementation now**. Deferred until after Connect More; **not** a Sprint 104 closure dependency.

**Readiness:** Recorded 2026-11-26 following C4 Situated Task workload-feasibility implementation. Approach and acceptance criteria not yet written — **not sprint-allocated**.

### PB-FA-034 — Assessment Pack progressive capture and deterministic assembly

**Status:** Proposed — unassigned. **Deferred until after Connect More.** **Not sprint-allocated. Not an S104 closure dependency.**  
**Type:** Authoring pipeline, stage ownership & deterministic assembly alignment (Assessment Pack).

**Investigation findings (2026-11-26):**

- Stage 4 (*Design Page*) unnecessarily replays structured content (`purpose`, `learner_context`, `elicitations[]`, `formative_return`, `pack_forward_orientation`) already captured in Stages 1–3 (`assessment_evidence_purpose`, `assessment_evidence_elicitation`, `assessment_formative_return`).
- Canonical publication (`resolveAssessmentPackPublishPage`) validates Stage 4 in isolation and does not reconcile Stage 4 against those authoritative upstream captures.
- Intermediate stages (Stages 1–3) lack comprehensive semantic capture validation (Stage 1 has no capture schema gate; Stages 2–3 run determinate-key and structured-stimulus checks only).
- Upstream edits to Stages 1–3 do not reliably invalidate downstream captures.

**Future architectural scope to consider:**

- Explicit per-stage field ownership across Stages 1–4.
- Authoritative intermediate captures with semantic validation at each stage.
- Deterministic assembly from Stages 1–3 into the published Assessment Pack page, paired with a thin editorial Design Page stage (drawing on the established Sprint 105 progressive capture and assembly approach where appropriate).
- Downstream invalidation when upstream stages are edited or cleared.

**Educational boundary (mandatory):** Preserve Assessment Pack's distinctive educational and assessment architecture (epistemic-class freezing between determinate and non-determinate elicitations, non-summative formative return, authentic `constructed_performance` fidelity, optional closed `output_specification`, and separate `editorial_opening_image` contract).

**Boundaries:** Backlog work only — do **not** implement this wider migration now. Deferred until after Connect More; **not** a Sprint 104 closure dependency.

**Readiness:** Recorded 2026-11-26 following Assessment Pack assembly contract investigation. Approach and acceptance criteria not yet written — **not sprint-allocated**.

### PB-FA-035 — Shared Structured Representations and Native SVG Rendering

**Status:** Proposed — unassigned. **Deferred until after Connect More.** **Not sprint-allocated. Not an S104 closure dependency.**  
**Type:** Cross-family visual representation architecture & deterministic SVG rendering (all product families).  
**Cross-references:** Programme `docs/development/governance/ARCHITECTURAL-DEBT.md` **`D-016`** (Native deterministic number-line and quantitative scale rendering); `PB-FA-034`.

**Strategic objective:** Reduce unnecessary generative image production while improving representational precision, accessibility, consistency, and authoring efficiency across all product families by consolidating structured data/diagram representation contracts and expanding deterministic native SVG rendering.

**Read-only codebase capability audit (2026-11-26):**

| Capability / Path | Representation Type | Scope & Product Families | Native SVG vs Rasterised | Validation, Sanitisation & Accessibility |
| --- | --- | --- | --- | --- |
| `expositoryMaterials.renderScatterplotEvidence()` (`lib/learner-renderer-vnext/expository-structured-materials.js`) | Structured scatterplots (single-panel; multi-panel in Assessment Pack via `representation.panels[]`) | **Representation-specific, shared across 3 families:** Expository (`expository_structured_scatterplot`), Practice (`render-material.js` sibling `scatterplot`), Assessment Pack (`render-assessment-evidence.js` `kind: "data_figure", figure_type: "scatterplot"`). Not yet exposed to Situated Task or Interactive legacy paths | **Native inline SVG** (`<svg role="img" aria-labelledby="...">`) paired with semantic HTML data table | Strict fail-closed numeric/axis/table validation (`assessment-evidence-hydration.js`, `assessment-pack-canonical.js`, `expository-structured-materials.js`); deterministic `<title>`/`<desc>`, axis ticks, point labels, and cell-for-cell accessible table |
| `assessment-interactive.js` `renderStimulus()` (`lib/learner-renderer-vnext/assessment-interactive.js:591`) | Arbitrary inline SVG stimulus (`representation.media.format === "svg"`) | **Product-family-specific (legacy/interactive assessment items only)** | **Native inline SVG** inside `<figure class="util-assessment-stimulus">` | Minimal guard only (`markup.indexOf("<script") !== -1`); does **not** use `PRISM_VISUAL_ASSETS` full sanitiser; `figcaption` from `alt_text` |
| Visual Jobs SVG intake (`lib/prism-visual-assets.js:326` + `app.js:63487` `rasterizeSvgFileToPngForVisualJob`) | Any user-uploaded or pasted `.svg` / `image/svg+xml` graphic (e.g. `number_line_segments`, custom diagrams) | **Generic across all product families** using Visual Jobs | **Rasterised to 2× PNG** (capped at 2400px) before attachment/publication; **not** retained or published as native SVG | Full security validation (`SVG_FORBIDDEN_TAG_RE`, `SVG_EVENT_HANDLER_RE`, `SVG_JS_URI_RE`, `SVG_EXTERNAL_HREF_RE`, root `<svg>` & dimension/viewBox normalisation) — currently only used pre-rasterisation |
| `number_line_segments` & conceptual diagrams (`lib/sprint38-visual-affordances.js`, `lib/utilities-visual-jobs-workspace.js`, `lib/learner-renderer-vnext/expository-structured-materials.js`) | Quantitative number lines / scales (`number_line_segments`) and node/edge conceptual diagrams (`expository_diagram_specification`) | Expository, Practice, Situated Task, Interactive (via Visual Jobs) | **External image production** (image brief allows PNG or SVG upload, which is rasterised to PNG); no native SVG renderer yet (`D-016`) | `sprint38-visual-affordances.js` enforces `requires_exact_data_match: true` for `number_line_segments`; `expository-structured-materials.js` suppresses unrendered diagram specs cleanly or fails closed if no faithful learner-facing fallback exists |

**Key investigation findings:**

1. **Only scatterplots have mature deterministic native SVG rendering**, and `renderScatterplotEvidence()` is already reused across **Expository, Practice, and Assessment Pack** — demonstrating the viability of a shared cross-family renderer.
2. **Input schemas for scatterplots are currently fragmented across families:** Expository/Practice use `{ title, x_axis, y_axis, observations: [{ label, x, y }], table }`, while Assessment Pack uses `{ kind: "data_figure", figure_type: "scatterplot", authoritative_data: { columns, observations }, plot_specification: { x_axis, y_axis }, accessible_equivalent: { column_headers, rows } }` (plus `panels[]`).
3. **Arbitrary validated SVG cannot currently be retained and published natively via Visual Jobs:** `lib/prism-visual-assets.js` already validates and normalises SVG safely, but `app.js` always rasterises it to 2× PNG via `<canvas>`. Meanwhile, `assessment-interactive.js` renders raw `media.format === "svg"` natively with only a `<script` substring check.
4. **Visual planning does not yet route eligible precision visuals to native SVG instead of generative image production:** `sprint38-visual-affordances.js` and `utilities-visual-jobs-workspace.js` treat `number_line_segments` and quantitative/structural diagrams as external image briefs (only mentioning SVG as an optional upload format to the image job), rather than offering a deterministic native-SVG fulfilment route.
5. **Prompt communication of native SVG capabilities is uneven:** Practice GAM (`ld-gam-page-enrich-contract.js`), Expository XM, and now Assessment Pack Stages 2/4 explicitly document native scatterplot JSON contracts and forbid raw `<svg>` in Markdown (`GAM-SVG-01`), whereas Situated Task and cross-family visual planning lack a unified representation catalogue.

**Future architectural scope to consider (post-Connect More):**

- **Unified cross-family structured representation registry & renderer:** Consolidate canonical representation schemas (or clean shared adapters) across Expository, Practice, Assessment Pack, Situated Task, and Interactive so one deterministic renderer layer serves all families.
- **Native deterministic SVG renderers for high-value precision types:** Starting with **`D-016` (`number_line_segments` / quantitative scales)**, then bar/line charts, comparative distributions, and simple structured node-edge/flow diagrams — each paired with mandatory accessible tables/descriptions and fail-closed data/table consistency validation.
- **Visual-planning routing decision:** Enable visual planning (`sprint38-visual-affordances.js`) to distinguish *native deterministic SVG* (no external image generation required) from *external raster/editorial illustration*, reducing unnecessary generative image production.
- **Safe native SVG asset retention (optional):** Evaluate retaining validated, sanitised SVG natively (reusing and hardening `lib/prism-visual-assets.js` sanitisation, and upgrading `assessment-interactive.js`'s `<script`-only check) instead of mandatory 2× PNG rasterisation when vector fidelity and accessibility are preferable.

**Boundaries:** Backlog item only — **no implementation before Connect More**. **Not** an S104 closure dependency.

**Readiness:** Recorded 2026-11-26 following bounded read-only SVG capability audit. Approach and acceptance criteria not yet written — **not sprint-allocated**.

---

## 2. Optional engineering / capability follow-ons

### PB-FA-010 — Prompt-contract consistency

**Status:** Retain — **optional maintenance.** **Not sprint-allocated.**

Optional consistency / standardisation exercise: use **targeted per-prompt rationalisation** to the structured prompt-contract format established for DLA/GAM **where this improves consistency, inspectability and testability**.

**Not:** architectural uncertainty, an alpha issue, a required system-wide rewrite, or wholesale migration of established prompt contracts. Rationalise prompts individually in later bounded work if chosen.

**Readiness:** Method proven on DLA (Sprint 77); optional maintenance follow-on — **not sprint-allocated**.

### PB-M-001 — Future maths capabilities

**Status:** Retain — **exploratory / post-alpha.** **No commitment or scheduling.**

Light future capabilities:

| Capability | Notes |
| ---------- | ----- |
| Mixed prose + maths editing | Rich editor spanning prose and mathematics |
| Per-cell maths in table-style response surfaces | Table cells with `input_modality: math` |
| CAS / symbolic correctness support | Symbolic checking beyond TeX entry/display |

Sprint 82 delivered first-class MathLive entry + MathJax display for dedicated maths fields. These remain optional post-alpha follow-ons. Preserve separation from visualisation work: shared data and mathematical **visualisation** (charts, distributions, learner-responsive plots) is [PB-FA-018](#pb-fa-018--shared-data-and-mathematical-visualisation); precision graphics/specs are [PB-FA-020](#pb-fa-020--precision-graphics-and-structured-visual-specifications).

### Assessment Pack real-use calibration (Sprint 88 remainder)

**Status:** **Not done.** Not a new architecture. Sprint 89 is closed and did not do this work.

Sprint 88 closed with the Assessment Pack architecture in place. Further real use was not completed. Remaining acceptance, before any change to depth, count, or form-selection defaults:

- exercise fresh Assessment Packs;
- observe what automatic component count actually chooses;
- compare Quick, Standard, and Thorough (still an uncalibrated hypothesis);
- inspect Plan Assessment Evidence rationale and form selection;
- inspect the learner experience;
- fix only concrete findings from that use.

Record: [Sprint 88 closure](../development/sprints/2026-09-28-sprint-88-default-product-workflows-and-assessment-architecture/SPRINT-88-CLOSURE.md). Sprint 89 did not reopen Assessment architecture.

This calibration remains about exercising depth, count, and form-selection defaults. Sprint 93 closed the evidence-led product revisit as [PB-FA-017](#pb-fa-017--assessment-pack-first-class-product-revisit). That acceptance does not complete this calibration.

**Distinct (2026-11-16 post–Sprint 99):** a four-case Assessment Pack *instructional quality* review was **accepted without substantive implementation**; the planned Sprint 100 stub is **superseded** ([sprint-100](../sprints/sprint-100-assessment-pack-instructional-quality.md) · [NEXT-SPRINT](../sprints/NEXT-SPRINT.md)). That acceptance does **not** complete this depth/count/form calibration. Optional non-blocking follow-ups (APE alignment; manual answer-disclosure checking) are recorded on the superseded stub only.

### PB-S-007 — Broad-suite renderer/page-render failure reconciliation

**Status:** **Complete** (2026-10-05). Diagnostic + remediation done. Not sprint-allocated (no sprint opened; Sprint 89 remains CLOSED).

**Record:** [PB-S-007-broad-suite-failure-reconciliation.md](../development/governance/PB-S-007-broad-suite-failure-reconciliation.md) (§12 remediation)  
**Prior ancestor:** [D-014](../development/governance/D-014-test-suite-confidence-diagnostic.md)

| | Tests | Passed | Failed | Skipped |
| - | ----: | -----: | -----: | ------: |
| Sprint 89 Slice 4 baseline | 4220 | 3702 | 517 | 1 |
| After PB-S-007 remediation | **3705** | **3704** | **0** | **1** |
| First-class gate | **339** | **339** | **0** | 0 |

The 517 failures were not 517 product bugs. Remediation fixed harness gaps (GAM assembler + first-class family inject; DOM stubs; sections→activities test convert), retired superseded HTML/golden/prompt archaeology, and updated stale current-contract asserts. **No production `app.js` / `lib/` changes.** Suspected “A” Expository KS and Assessment Pack publish failures were harness/identity gaps, not renderer defects.

**Outcome:** Broad suite green; first-class still 339/339; confidence restored without restoring obsolete architecture.

### PB-S-008 — Full-suite pre-existing failures (technical debt)

**Status:** **Open — recorded 2026-11-24, not investigated, not sprint-allocated.** Deferred until after Connect More unless a failure is found to mask a real defect.

**Record:** [PB-S-008-full-suite-failure-baseline-2026-11-24.md](../development/governance/PB-S-008-full-suite-failure-baseline-2026-11-24.md) (complete list by file)  
**Prior work:** [PB-S-007](#pb-s-007--broad-suite-rendererpage-render-failure-reconciliation) cleared the 517-failure estate in October; failures have re-accumulated since Sprints 95–103.

Running `node --test --test-concurrency=4 tests/*.test.js` at committed HEAD (`2b572ec`) fails **86 of 4956** tests; **84 are stable across three runs** in 52 test files (largest groups: `s75-run-capture-migration` 10, `mathjax-delimiter-preservation` 9, `sprint-70-slice-8d-file-picker-browser-e2e` 4). They exist independently of the C06 Assessment Pack changes (none introduced there). Two further tests fail only while the committed vNext browser bundle is stale against source and pass after a rebuild: a release-hygiene check, not a defect.

**Not yet classified.** Each failure needs triage as stale assertion, environment/harness (IndexedDB, file-picker and browser E2E), or genuine defect, using the PB-S-007 method. Do not weaken tests to pass; escalate any genuine defect separately.

**Operational note:** several `s96` browser tests regenerate Sprint 96 evidence PNGs as a side effect of running; revert them unless a refresh is intended.
---

## 3. Lightweight future product ideas

Concise only. **No implementation commitment.**

| Idea | Note |
| ---- | ---- |
| **Audiovisual / podcast script** | Adaptation of an existing learning resource into a production-ready educational script. A Custom workflow has already shown a credible sequence: Expository Resource → Design Media Adaptation → Author Audiovisual Script (spoken treatment, semantic speech intent, purposeful visual direction). The intellectual workflow is prototyped. A later question is whether this deserves a first-class capability, and how production would be handled if it does. Keep script and design separate from production infrastructure (TTS, audio rendering, video assembly, hosting). Not TTS of an Expository Resource, and not a committed product. |
| **Presentation / slideshow** | Distinct visual/presenter treatment. Hypothesis only: may be downstream of Expository Resource. **Not** PRISM's next architecture extensibility test (former PB-FA-008 superseded). |

---

## 4. Research

### PB-R-011 — Expository vs Interactive comparison

**Status:** **Retired — superseded by Learning Journey-first architecture** (2026-11-23).

**Retirement (2026-11-23):** The original comparison treats Expository and Interactive as competing complete-resource approaches. The current direction ([S103-D01](../development/sprints/2026-11-20-sprint-102-learning-journey-owned-outcomes/decisions.md#s103-d01--learning-journey-first-architecture) — accepted architectural **policy**, not an implemented product default) uses complementary specialist components within Learning Journeys (Expository, Practice, Assessment Pack, Situated Task). Historical research rationale is preserved below. Future evaluation of Learning Journey effectiveness, learner judgement, capability and transfer may be proposed separately — do **not** create a new research project from this retirement, and do **not** imply such evaluation has already been conducted.

**Historical research question:** Given comparable Expository and Interactive resources derived from the same Content, Model Knowledge and Learning Outcomes:

1. which do **learners** prefer;
2. which produces better demonstrated **learning, retention and/or transfer**;
3. which do **educators** actually choose to create and deploy?

The educator question concerned **actual behaviour**, not merely stated pedagogical preference. Historically informed [PB-FA-011](#pb-fa-011--expository-resource).

**Readiness:** **Retired** — do not allocate as an open research programme.

---

## 5. Exploratory future directions

**Not sprint-allocated. Not committed roadmap items.** Captured so the current line of thought is still intelligible later. Opening a sprint still requires an explicit decision and a concrete approach. Do not treat these as designs.

### PB-FA-013 — PRISM-aware model context

**Status:** Retain — **exploratory.** **Not sprint-allocated.**

Explore what contextual understanding of PRISM itself should be available to model stages during a workflow: the product, its educational purposes, its terminology, and the relevant workflow boundaries.

The aim is better PRISM-aware reasoning, not larger prompts or indiscriminately more context. **No new context subsystem is authorised** from this note. Further work requires a specific demonstrated problem and a bounded proposal.

### PB-FA-014 — Outcomes Map

Explore a first-class planning capability whose backbone is intended learning. Developed in Sprint 90 under the name **Learning Journey**.

**Foundations status:** [Sprint 90 — COMPLETE / CLOSED](../development/sprints/2026-10-05-sprint-90-learning-journey-foundations/SPRINT-90-CLOSURE.md) · authoritative record [LEARNING-JOURNEY-FOUNDATIONS.md](../development/sprints/2026-10-05-sprint-90-learning-journey-foundations/LEARNING-JOURNEY-FOUNDATIONS.md)

**Implementation:** [Sprint 91 — COMPLETE / CLOSED](../development/sprints/2026-10-06-sprint-91-learning-journey-first-class-implementation/SPRINT-91-CLOSURE.md) · [IMPLEMENTATION-MAP.md](../development/sprints/2026-10-06-sprint-91-learning-journey-first-class-implementation/IMPLEMENTATION-MAP.md)

**Live E2E (S91):** Learning Journey → supported commissions → ordinary constituent workflows → derived Complete status → deterministic learner ZIP (Journey Home + nested `cN/` packages) — **PASSED**. Architecture recorded in the Sprint 91 closure.

**Working principle:** Learning Journey designs the progression of learning experiences required to move a particular group of learners towards intended learning, within learning time and duration constraints. Outcomes describe where learners need to get to; the journey describes how learning should develop to get them there.

Foundations conclusions (see foundation document for Established / Working hypothesis / Open question):

- PRISM should derive appropriate intended learning where authoritative outcomes are not supplied; do not mandate outcomes as an elicitation field.
- Learning time and duration are distinct author-owned constraints; do not organise primarily by week/session/course abstractions.
- Source structure must not automatically become learning structure.
- Dynamic composition belongs between products; deterministic process belongs within first-class products.
- Every required learning element must ultimately be realisable through one or more learner-facing PRISM product outputs; unsupported commissions stay visible rather than becoming invisible non-product activity.
- Product-family note: Expository, Interactive, Situated Task (**implemented**, Sprint 92 / `situated_task`), Assessment Pack — see [PB-FA-015](#pb-fa-015--additional-first-class-learning-resource-pipelines). (Sprint 90 “Independent Task” was the discovery label for the Situated Task educational job.)

**Optional author-supplied meta-design:** An author may specify a higher-level pedagogical pattern (for example diagnostic → exposition → application → formative check; problem-first; case-centred; worked example → scaffolded practice → independent performance; or another sequence they define). PRISM should derive a sensible design when no pattern is supplied, and respect one when it is. Do not hard-code a single pedagogical sequence as the Learning Journey architecture.

Do not redesign Learning Journey architecture from this note. Foundations are closed under Sprint 90; first-class implementation and final learner package are closed under Sprint 91. Richer Course Home / programme assembly remains related to [PB-FA-016](#pb-fa-016--course-home--course-assembly).

**Continuity (Sprint 94):** Independently generated constituents must preserve essential shared context and know what earlier components asked learners to do. That work is [PB-FA-022](#pb-fa-022--learning-journey-continuity-contract) — **Complete**. It does not reopen Sprint 91.

**Unified runtime (Sprint 95):** Single-document Learning Journey delivery with container-scoped resource lifecycle and explicit artefact handoff. That work is [PB-FA-023](#pb-fa-023--unified-learning-journey-runtime) — **Complete**.

### PB-FA-022 — Learning Journey continuity contract

**Status:** **Complete — Sprint 94 CLOSED — ACCEPTED** ([SPRINT-94-CLOSURE.md](../development/sprints/2026-11-02-sprint-94-learning-journey-continuity/SPRINT-94-CLOSURE.md)). Do **not** reopen.

Make Learning Journey continuity a reliable commissioning contract so later independently generated components preserve essential shared scenario facts and understand what earlier components asked learners to do.

Constituents remain standalone. Sprint 94 intentionally excluded cross-component learner-response sharing and unified runtime (see [PB-FA-023](#pb-fa-023--unified-learning-journey-runtime)).

**Delivered:** required continuity surviving Design Page and product intake; preceding-activity descriptions; binding first-stage prompts; author inspectability; WP6 regression evidence.

**Out of scope (unchanged):** Interactive V2 ([PB-FA-019](#pb-fa-019--interactive-v2-educational-solution-design-and-interaction-surfaces) — **Retired**); home-page redesign; Assessment Pack calibration; Course Home; unified runtime.

### PB-FA-023 — Unified Learning Journey runtime

**Status:** **Complete — Sprint 95 CLOSED — ACCEPTED** ([SPRINT-95-CLOSURE.md](../development/sprints/2026-11-03-sprint-95-unified-learning-journey-runtime/SPRINT-95-CLOSURE.md)). Do **not** reopen.  
**Type:** Architectural foundations → bounded implementation.  
**Pack:** [Sprint 95](../development/sprints/2026-11-03-sprint-95-unified-learning-journey-runtime/SPRINT-95-START-HERE.md)

Establish foundations for a unified, accessible, single-document Learning Journey runtime: persistent navigation, one active mounted resource, container-scoped init/dispose, explicit learner-artefact produce/reference handoff — while preserving standalone publishing and (until superseded) multi-document Journey packages.

**Delivered:** M1 Assessment Pack lifecycle; M2 additive unified shell; M3 explicit artefact handoff; M4 wider compatibility (qualified); M5 author-facing **Download Unified Learning Journey** with automatic artefact proposal; live *Deciding Under Uncertainty* verified.

**Deferred items absorbed and largely delivered by Sprint 96 / [PB-FA-024](#pb-fa-024--unified-learning-journey-experience--compatibility)** (CLOSED — ACCEPTED). Residual a11y / maths VK / QA cross-journey debt remains on the Sprint 96 debt ledger — not a reopen of Sprint 95.

**Out of scope (unchanged):** iframes; server learner accounts; AI marking; new application framework; regenerating existing journeys; Interactive V2; Course Home.

### PB-FA-024 — Unified Learning Journey experience & compatibility

**Status:** **Complete — Sprint 96 CLOSED — ACCEPTED** ([SPRINT-96-CLOSURE.md](../development/sprints/2026-11-03-sprint-96-unified-learning-journey-experience/SPRINT-96-CLOSURE.md)). Do **not** reopen.

**Type:** Bounded implementation — experience polish + mathematics compatibility + publishing default gate.  
**Pack:** [Sprint 96](../development/sprints/2026-11-03-sprint-96-unified-learning-journey-experience/SPRINT-96-START-HERE.md)  
**Baseline:** `c5d93e85cb4bf1457f499ccac76763d75d272dad`

**Delivered:** Unified-only LJ download; navigation/layout; visual coherence; resource fidelity; contextual guidance (qualified); viewport-centred reading (qualified); mathematics packaging (qualified); M5 acceptance (qualified).

**Deferred (not reopen triggers):** comprehensive a11y / AT; MathLive VK residual; stored C5/C6 transfer-prose cleanup; QA v1.2 cross-journey validation — see Sprint 96 [ARCHITECTURAL-DEBT.md](../development/sprints/2026-11-03-sprint-96-unified-learning-journey-experience/ARCHITECTURAL-DEBT.md) and [SPRINT-96-CLOSURE.md](../development/sprints/2026-11-03-sprint-96-unified-learning-journey-experience/SPRINT-96-CLOSURE.md) next-phase priorities.

**Out of scope (unchanged):** regenerating journeys as part of S96; new frameworks; server learner storage; AI marking; Interactive V2; Course Home; accepting MathLive via textarea fallback alone.

### PB-FA-028 — Learning Journal (unified Learning Journeys)

**Status:** **Delivered — Sprint 97 CLOSED — ACCEPTED** (qualified; Level 3 pipeline journals deferred).  
**Type:** Bounded foundations — unified-shell Learning Journal.  
**Pack:** [Sprint 97 closure](../development/sprints/2026-11-12-sprint-97-learning-journal-and-design-pattern-foundations/SPRINT-97-CLOSURE.md)  
**Baseline:** `a8c2fd3b6e7dbeaa11bb418c71bf4eb472f150c5`

**Objective:** A permanent read-only **Your Learning Journal** destination in the unified Learning Journey TOC (beneath constituent resources). Ordered entries are designed by the Learning Journey pipeline; each entry has a learner-facing title, authored framing, and a reference to a declared constituent learner artefact. Entries populate from existing same-browser saved drafts. A notification count indicates new/updated entries since last view. Missing artefacts are represented truthfully.

**Pedagogical north star (S97-D04):** PRISM aims at better judgement, better capability, or both. The journal makes intended progression inspectable via learner-produced evidence; it must not claim improvement without evidence.

**Reuse / incremental:** Existing artefact contract, draft storage, and unified shell — no new persistence system. Journal iteration must not force full Learning Journey or unchanged-constituent regeneration (S97-D04 Levels 1–3). Journey data contracts (constituents, artefacts, references, journal) evolve additively and stay separable from shell presentation (S97-D05 compatibility principle).

**Non-goals:** Journal editing, branching, export, journal-specific assessment, AI interpretation, regenerating unchanged constituents for journal work, new caching/regeneration frameworks, conditional/adaptive pathways or rules engines in Sprint 97, changing standalone or carry-forward behaviour.

**Related:** Former pattern catalogue [PB-FA-029](#pb-fa-029--pedagogical-design-pattern-catalogue) — **Retired** (superseded by exemplars corpus). Assisted brief development remains [PB-FA-026](#pb-fa-026--assisted-brief-development-from-teaching-intention-to-learning-experience).

### PB-FA-029 — Pedagogical design-pattern catalogue

**Status:** **Retired — superseded by the established exemplars corpus** (2026-11-23).  
**Type:** Version-controlled catalogue foundations. Historical entry preserved.  
**Pack:** [Sprint 97 closure](../development/sprints/2026-11-12-sprint-97-learning-journal-and-design-pattern-foundations/SPRINT-97-CLOSURE.md) (deferred from Sprint 97; not delivered)

**Retirement (2026-11-23):** The established exemplars corpus already provides worked pedagogical exemplars and surfaces reusable design patterns. Further corpus development will be identified as required rather than maintained as a separate standing backlog commitment. **Do not create** `docs/design-patterns/`. Sprint 97 M4 deferral history is preserved below.

**Sprint 97 deferral history (preserved):** Open — carry forward after Sprint 97 M4 deferred; catalogue not created. Intended durable location had been locked as `docs/design-patterns/` (S97-D03 Q6). Deferred tasks S97-T-010…T-012 remained not started at Sprint 97 close.

**Historical objective:** A central catalogue of Learning Journey pedagogical design patterns, starting with:

1. Progressive Evidence Disclosure — *The Decision That Went Wrong* / DUU.  
2. Draft, Judge, Revise — *Explaining Research: From First Draft to Better Judgement*.  
3. Ten provisional, pedagogically distinct candidate patterns.

Each pattern was to use a standard specification (purpose, cognitive mechanism, sequence, artefacts, journal opportunities, constraints, examples). Demonstrators were to use a standard pack including commissioning fields, rationale, cognitive map, artefact/journal map, adaptation guidance, and a copyable Create Your Own LLM prompt. Pattern specs were to be informed by PRISM’s pedagogical north star (better judgement and/or capability; inspectable learner evidence — S97-D04).

**Historical non-goals:** Demonstrator website; in-product AI brief-development service (see [PB-FA-026](#pb-fa-026--assisted-brief-development-from-teaching-intention-to-learning-experience)).

**Related:** Learning Journal [PB-FA-028](#pb-fa-028--learning-journal-unified-learning-journeys) (delivered).

### PB-FA-016 — Course Home / course assembly

**Status:** **Reconciled with the delivered unified Learning Journey shell** (2026-11-23). Not a separate proposed product architecture. **Not sprint-allocated** as a new Course Home product.

**Established implementation direction:** The unified Learning Journey shell ([PB-FA-023](#pb-fa-023--unified-learning-journey-runtime) · [PB-FA-024](#pb-fa-024--unified-learning-journey-experience--compatibility) — both **Complete**) is the established way learners encounter a whole journey: Journey Home / TOC, single-document navigation, one active mounted constituent, artefact handoff, and (with [PB-FA-028](#pb-fa-028--learning-journal-unified-learning-journeys)) Learning Journal. Continuity of commissioned context is [PB-FA-022](#pb-fa-022--learning-journey-continuity-contract) — **Complete**. Do **not** treat the original Course Home concept as wholly outstanding.

**Historical context (preserved):** This item emerged from [PB-FA-014](#pb-fa-014--outcomes-map) / Learning Journey experiments as a learner-facing way to represent and publish the whole journey — not only individual resources. Historical working hypothesis: Outcomes Map as design layer; first-class resources as production layer; Course Home / course assembly as assembly and delivery layer — not another first-class learning-resource product beside Expository, Interactive, and Assessment.

**Evidenced remaining gaps (do not invent further gaps; do not mark unverified capabilities complete):**

- Sprint 96 residual unified-shell debt (comprehensive a11y / AT; MathLive virtual-keyboard residual; stored transfer-prose cleanup; QA v1.2 cross-journey validation) remains on the Sprint 96 ledger — not a reopen of Course Home as a product.
- Author workspace organisation of many journeys/resources is a separate concern: [PB-FA-031](#pb-fa-031--workspace-folders).
- Broader programme-of-study / multi-journey catalogue assembly, LMS integration, tracking, and authentication were never prescribed by this item and are not claimed delivered or required by this reconciliation.

**Product-discovery principle (historical):** A new first-class product still has to be justified by a materially different design process. See [PB-FA-015](#pb-fa-015--additional-first-class-learning-resource-pipelines) (retired as a standing proposal). Sprint 90 commissioning invariant retained: every required Learning Journey element must ultimately be realisable through one or more learner-facing PRISM product outputs ([LEARNING-JOURNEY-FOUNDATIONS.md](../development/sprints/2026-10-05-sprint-90-learning-journey-foundations/LEARNING-JOURNEY-FOUNDATIONS.md)).

### PB-FA-017 — Assessment Pack first-class product revisit

**Status:** **Complete — Sprint 93 CLOSED — ACCEPTED** ([SPRINT-93-CLOSURE.md](../development/sprints/2026-10-07-sprint-93-assessment-pack-educational-contract/SPRINT-93-CLOSURE.md)). Do **not** reopen.

Revisit Assessment Pack using the evidence-led first-class product design method now established through Learning Journey and Sprint 92 (historical discovery pattern recorded under [PB-FA-015](#pb-fa-015--additional-first-class-learning-resource-pipelines) — retired as a standing proposal).

#### Motivation

The current Assessment Pack provides useful but limited functionality.

Rather than extending it feature-by-feature from its existing implementation, the future sprint should **re-elicit the educational requirements for assessment** using that product-discovery / design method.

Treat the existing Assessment Pack implementation as:

- evidence of current capability;
- a source of compatibility / migration constraints;
- implementation that may contain useful reusable components;

but **not** as the specification of what the mature first-class Assessment product must be.

Near-term calibration of the current pack remains [Assessment Pack real-use calibration](#assessment-pack-real-use-calibration-sprint-88-remainder) — a different, narrower concern.

#### Proposed discovery method

Use Learning Journey as an evidence-generating environment.

Design several materially different, authentic Learning Journeys in which assessment is genuinely required. Potential contexts (illustrative — **not** a predetermined Assessment taxonomy):

- undergraduate / module learning;
- workplace or professional learning;
- practical / performance-oriented learning;
- formative learning / checkpoint contexts.

Inspect what assessment experiences those journeys actually require. Use the evidence to determine discovery questions such as:

- What educational job is the assessment performing?
- What learner performance or evidence needs to be elicited?
- What makes that evidence interpretable?
- Who or what needs to interpret / judge it?
- What feedback relationship is required?
- What distinctions between formative and summative purposes matter to product design?
- Does assessment concern an artefact, judgement, performance, process, reflection, or combinations?
- What does the assessment need from preceding learning?
- What happens educationally after the assessment?

Do **not** answer these questions in this backlog item. They are discovery questions for the future sprint.

#### Product-design method

If the evidence justifies redesign, apply the same disciplined sequence:

Purpose → sibling-product boundary → learner / assessment contract → authoring / design responsibilities → product invariants → predetermined pipeline → structured artefact contract → implementation and integration.

#### Situated / Assessment boundary (existing principle to investigate further)

> Situated activity principally asks the learner to act because carrying out the activity develops learning.

> Assessment principally elicits performance / evidence so learner capability can be interpreted or judged.

A Learning Journey may legitimately require both, including sequences such as situated learning activity → consequential learning / record → subsequent Assessment performance.

The future Assessment Pack work should use such cases to sharpen requirements rather than collapsing authentic learning activity and assessment into one product. See also Sprint 92 Gate 2 ([S92-D03](../development/sprints/2026-10-07-sprint-92-situated-learning-activity-first-class-product/decisions.md#s92-d03--product-design-gate-2--boundary-against-sibling-products)).

#### Scope posture

**Sprint 93** completed this revisit. Hard invariant: Assessment Pack remains **NON-SUMMATIVE**. Do **not** reopen Sprint 93 or Sprint 92. Near-term calibration of depth, count, and form-selection defaults remains the separate narrower item above.

#### Sprint 93 outcome

Accepted first-class Assessment Pack. Close: [S93-D12](../development/sprints/2026-10-07-sprint-93-assessment-pack-educational-contract/decisions.md#s93-d12--close-sprint-93--assessment-pack-accepted). Record: [SPRINT-93-CLOSURE.md](../development/sprints/2026-10-07-sprint-93-assessment-pack-educational-contract/SPRINT-93-CLOSURE.md).

### PB-S-006 — Institutional authentication (University of Nottingham)

**Status:** Retain — **investigation.** **Not sprint-allocated.**

Investigate the University of Nottingham’s supported authentication integration route for making PRISM available to authenticated UoN users — **before selecting an implementation**.

**Working intent:** If you can authenticate with a UoN account, you can use PRISM.

The initial requirement is an institutional identity gate, not a PRISM allow-list, invitation system, approval process, role hierarchy, or administration system. The next step is to find the University's supported integration or application-registration route, not to infer a protocol or implement authentication speculatively.

Keep this item to authentication. Do **not** expand into publishing, server-side user-owned persistence, roles, administration, or broader multi-user architecture. Deployment packaging remains [PB-S-005](#pb-s-005--release--deployment-packaging).

### PB-FA-015 — Additional first-class learning-resource pipelines

**Status:** **Retired as a standing proposal** (2026-11-23). Historical record preserved. This does **not** prohibit future product types.

**Retirement (2026-11-23):** The current four Learning Journey–commissionable product types are considered **sufficient for now**:

1. Expository  
2. Practice  
3. Assessment Pack  
4. Situated Task  

Standalone Interactive remains supported for legacy/standalone authoring ([S103-D01](../development/sprints/2026-11-20-sprint-102-learning-journey-owned-outcomes/decisions.md#s103-d01--learning-journey-first-architecture) — accepted **policy**, not implemented product defaults). Future product discovery should be **evidence-led** and reopened only if a genuine educational requirement cannot be met through these products.

**Historical delivery preserved — Situated Task (Sprint 92 COMPLETE / CLOSED):** [Situated Task First-Class Product](../development/sprints/2026-10-07-sprint-92-situated-learning-activity-first-class-product/SPRINT-92-CLOSURE.md) — `situated_task`; Situation → Activity → Support → Learning Return → Design Page; LJ commissionable. Sprint 90 working label **Independent Task** superseded as delivery name by Situated Task.

**Historical exploratory candidates (not agreed products; not standing commitments):** Scenario Resource; Problem Resource; Guided practice / worked example hypothesis. Retain as historical discovery vocabulary only.

**Historical working criterion:** A new first-class product should exist because achieving its educational purpose needs a materially different design process, not because the finished resource has a familiar format. Do not open a backlog row for every named format.

**Historical discovery pattern (preserved for evidence-led reopen):** Prefer demonstrated Learning Journey demand over taxonomy completion; treat unsupported commissions as evidence; guard against product proliferation; product discovery remains a human/product-development activity; once first-class, pipelines stay predetermined (S89-D02).

---

## 6. Retired / superseded (planning authority only)

These IDs are **no longer live planning items**. Historical detail remains in prior backlog revisions, sprint packs, and governance records.

| Former ID | Disposition |
| --------- | ----------- |
| **PB-FA-001** | **Retired** — Workflow Resources core closed in Sprint 73; no standing FA theme |
| **PB-FA-003** | **Retired** — pipeline integrity not permanently open work; handle evidenced defects from alpha use |
| **PB-FA-004** | **Retired** — manually uploaded graphics; current graphics authoring sufficient |
| **PB-FA-005** | **Retired** — old Settings/parameterisation problem; Sprint 80 Adjustments answered the architectural question |
| **PB-FA-006** | **Retired** — QA/refinement productisation; operating QA is Part 1 Benchmark + Part 2 Validation as custom ChatGPT workflow |
| **PB-FA-007** | **Retired** — user-controlled storage management; workflow deletion is sufficient practical control |
| **PB-FA-008** | **Superseded** — Slideshow-as-architecture-test; Presentation remains a lightweight idea only (§3) |
| **PB-FA-009** | **Merged** into PB-FA-011 Research Synthesis relationship question |
| **PB-FA-015** | **Retired as a standing proposal** (2026-11-23). Four LJ-commissionable types (Expository, Practice, Assessment Pack, Situated Task) considered sufficient for now; evidence-led reopen only. Historical Situated Task delivery + exploratory candidates preserved in §5 |
| **PB-FA-019** | **Retired — superseded by Practice and Learning Journey-first architecture** (2026-11-23). Historical entry preserved in §1. Standalone Interactive remains supported. Interaction-surface follow-on: [PB-FA-030](#pb-fa-030--practice-interaction-surfaces) |
| **PB-FA-029** | **Retired — superseded by the established exemplars corpus** (2026-11-23). Historical Sprint 97 M4 deferral preserved in §1. Do not create `docs/design-patterns/` |
| **PB-R-011** | **Retired — superseded by Learning Journey-first architecture** (2026-11-23). Historical Expository-vs-Interactive research rationale preserved in §4. Does not create a new LJ-effectiveness evaluation project |
| **PB-S-001…PB-S-004** | **Retired** from canonical planning (historical suite/UX notes; not current “what next” items) |
| **PB-R-001** | **Retired** from canonical planning (conversation-attachment store) |
| **PB-R-002** | **Absorbed** into PB-FA-002 discovery when planned |
| **PB-R-003** | **Retired** — raise-the-ceiling measurement; addressed operationally by Benchmark Part 1 + Validation Part 2 |
| **PB-R-004** | **Merged** into Expository Resource richness (PB-FA-011); not a distinct page-type programme |
| **PB-R-005** | **Retired** — progressive-disclosure elicitation; no concrete current product problem stated |
| **PB-R-006** | **Retired** from canonical planning |
| **PB-R-007** | **Retired** — Benchmark/Validation instrument homes; custom workflow is accepted operating architecture |
| **PB-R-008** | **Retired** from canonical planning (orphan Workflow Resources cleanup) |
| **PB-R-009** | **Retired** — per-run configuration/profile; Adjustments substantially answered the need |
| **PB-R-010** | **Retired** — QA feedback destination; with PB-FA-006 |

**Not promoted into this backlog:** Sprint 81 debt (S81-D-001…007), RC3–RC8 (D-014 residue), Group F tooling, and older governance D-IDs remain in their historical ledgers unless alpha use produces a concrete new requirement.

---

## Related

- Programme pointer: [docs/sprints/NEXT-SPRINT.md](../sprints/NEXT-SPRINT.md) — **no open sprint** (feature freeze until Connect More); Sprint 103 closed  
- Architectural policy: [S103-D01 — Learning Journey-first architecture](../development/sprints/2026-11-20-sprint-102-learning-journey-owned-outcomes/decisions.md#s103-d01--learning-journey-first-architecture) — **Accepted**; commissioning alignment verified in Sprint 103  
- Alpha close: [SPRINT-82-CLOSURE.md](../development/sprints/2026-09-01-sprint-82-maths-entry-and-alpha-completion/SPRINT-82-CLOSURE.md) · [S82-D04](../development/sprints/2026-09-01-sprint-82-maths-entry-and-alpha-completion/decisions.md#s82-d04--alpha-development-complete)  
- Legacy notes (non-planning): [ideas.md](ideas.md) · [known-issues.md](known-issues.md) · [future-directions.md](future-directions.md)  
