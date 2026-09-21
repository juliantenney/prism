# Sprint 84 — Expository Resource Design

**Sprint:** 84 — Expository Resource Planning  
**Status:** **ACCEPTED** — Sprint 84 **COMPLETE / CLOSED** ([S84-D12](decisions.md#s84-d12--accept-refined-planning-design-and-close-sprint-84))  
**Authoritative design (this document):** accepted Planning handoff to a later implementation sprint  
**Closure:** [SPRINT-84-CLOSURE.md](SPRINT-84-CLOSURE.md)  
**Binding constraints:** [S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline) · S84 principles A–C  
**Evidence base:** [S83-INVESTIGATION-REPORT.md](../2026-09-21-sprint-83-expository-resource-investigation/S83-INVESTIGATION-REPORT.md)  
**Decisions:** [decisions.md](decisions.md) S84-D03…D12  
**Date:** 2026-09-21

> This document is the smallest coherent, implementation-ready **design** for first-class Expository Resource. It does **not** authorise implementation, production prompt authoring, or Interactive prompt modification.
>
> Operator review refinement (2026-09-21): instructional-design north star ([S84-D10](decisions.md#s84-d10--expository-instructional-design-north-star)) and ordered exposition **sections** as semantic primary structure ([S84-D11](decisions.md#s84-d11--ordered-exposition-sections-as-semantic-primary-structure)). Wider accepted architecture unchanged.
>
> Sprint 84 closed 2026-09-21: design accepted as-is ([S84-D12](decisions.md#s84-d12--accept-refined-planning-design-and-close-sprint-84)). Implementation must be opened separately.

---

## 1. Product definition

### 1.1 Working definition

> An **Expository Resource** develops a learner's understanding of a body of knowledge through a deliberately structured, sufficiently rich explanation.

Approximately: an excellent illustrated educational book chapter.

**Not:** an Interactive Learning Resource (Self-study / Workshop page) with activities removed.

### 1.2 First-class Create representation

| Decision | Choice |
| -------- | ------ |
| Create product option | Add **Expository Resource** as a third Learning Design Create product alongside Self-study resource and Workshop |
| Product id (provisional) | `expository_resource` |
| What it initiates | An Expository workflow topology (sibling pedagogical family) producing a predominantly reading/viewing learner resource |
| Distinguisher vs Self-study | Self-study = Interactive activity-centred learner page (production, evidence, workspaces). Expository = understanding through structured rich explanation without required learner evidence/workspaces |
| Distinguisher vs Workshop | Workshop = facilitated Interactive delivery. Expository = asynchronous intellectual chapter (not live facilitation choreography) |

### 1.3 First implementation promises / non-promises

**Promises (first implementation):**

- Create → Run → assemble → render/export a coherent Expository Resource for a commissioned topic/source.
- Sibling Expository prompts/contracts for journey planning, development, and materials.
- Reuse of shared PRISM capabilities (MK, LO, LC path, graphics, maths display, assembly, renderer, grounding disciplines) without weakening Interactive.
- Manual first-class journey + engineering gate as defined in §13.

**Does not promise (first implementation):**

- Expository → Interactive transformation;
- Workshop “read this then attend” packaging as a product feature;
- Podcast / Presentation;
- Research Synthesis identity resolution;
- Formal WCAG conformance beyond established alpha baseline;
- Mixed Expository+Interactive hybrid pages;
- Generic multi-product extensibility framework.

**Decision:** [S84-D03](decisions.md#s84-d03--expository-product-definition--create-representation)

---

## 2. Design principles (binding)

### A. Protected Interactive baseline

Existing Interactive prompts and pedagogical behaviour are a **protected baseline**. They must not be modified to make Expository possible. No Expository conditionals in Interactive prompts; no generalising Interactive contracts merely to avoid siblings.

### B. Sibling pedagogical family

Where instructional responsibility differs, Expository receives its **own coherent sibling** prompts/stage semantics/contracts. Study Interactive hard-won quality principles; express them independently for Expository.

### C. PRISM capability preservation

Adding Expository must not create a reduced-capability path. Reuse genuinely shared capabilities; add sibling pedagogy; use additive shared-infra only when product-independent and Interactive-preserving.

**Repeated test:** Is this shared because the responsibility is genuinely the same, or merely because sharing looks tidy?

### Richness

> Expository richness is sufficient explanatory, evidential, representational and contextual material for constructing useful understanding — not quantity of content.

### Engagement distinction

> Expository may invite thought; Interactive requires and supports learner action.

### D. Expository instructional-design north star

> An Expository Resource should progressively construct a coherent mental model of its subject, moving the learner from appropriate orientation and foundational understanding towards increasingly connected, discriminating, qualified and usable understanding.

This is the Expository counterpart to deliberate pedagogical progression in Interactive resources — with a **different instructional grammar**:

| Family | Progressive development of |
| ------ | -------------------------- |
| Interactive | What learners can **do** with knowledge, through deliberately sequenced learner **activity** |
| Expository | The learner's **understanding** of knowledge, through deliberately sequenced **explanation, elaboration, representation, connection and synthesis** |

**Not** an Expository beat sequence. There is no mandatory universal order such as orientation → explanation → example → comparison → application → synthesis. Those may be useful moves; the appropriate intellectual journey depends on knowledge structure, conceptual dependencies, Learning Outcomes, audience, prior knowledge, explanatory difficulty, productive contrasts, representations, where examples/evidence/cases help, where qualification is necessary, and opportunities for cumulative integration.

**Governing question for Expository Journey Plan:**

> What intellectual journey will allow this audience to construct the understanding represented by these Learning Outcomes?

Not merely: “What sections will cover these Learning Outcomes?”

**Tendency (not taxonomy):** understanding often becomes more sophisticated through moves such as encounter/orient → understand → distinguish → relate → see operating in examples/cases → qualify/understand limits → integrate into a larger mental model. This is **not** a required schema, fixed ordering, or beat template.

**Avoid serial explanation:** a strong Expository Resource is not merely a good explanation of A, then B, then C. The whole resource should leave a more structured and integrated understanding than the sum of its individual explanations. Connections, distinctions, recurrence, dependencies, qualifications and synthesis are part of instructional design — not optional polish.

**Responsibility decomposition under this north star:**

| Stage | Owns |
| ----- | ---- |
| **Expository Journey Plan** | *What intellectual journey will construct the intended understanding?* Progressive construction across the whole resource; ordering and relationships of learner-facing **sections**; where concepts are established, distinctions arise, relationships are made, ideas recur, examples/representations become useful, complexity increases, qualifications appear, synthesis occurs. Does **not** write the full exposition. |
| **Expository Development** | *How should each step in that journey be explained so the learner can make the intended conceptual move?* Explanatory treatment per planned **section** (judgement, not checklist), respecting the whole-resource journey rather than independently optimising each section. |
| **Expository Materials** | *What actual intellectual material is required to make that explanation work?* Realises XD commissions under commission lock; preserves grounding, formal fidelity, recurrence and consistency — without Interactive activity semantics. |

**Cascade (north star + primary structure):**

```text
Resource
  → intellectual journey (EJP)
    → ordered sections
      → explanatory treatment (XD)
        → supporting intellectual materials (XM)
```

Section structure **expresses** the planned intellectual journey; it must not replace journey-planning responsibility. Section order alone does not constitute narrative continuity — EJP remains owner of whole-resource progression and coherence.

No named external instructional-design model is adopted. The PRISM Expository model is expressed in the pedagogical responsibilities PRISM needs.

**Decision:** [S84-D10](decisions.md#s84-d10--expository-instructional-design-north-star) · primary structure [S84-D11](decisions.md#s84-d11--ordered-exposition-sections-as-semantic-primary-structure)

---

## 3. Proposed first-class workflow / topology

```text
[Normalize Content?] → Generate Learning Content → Model Knowledge → Learning Outcomes
  → Expository Journey Plan
  → Expository Development
  → Expository Materials
  → Design Page (Expository sibling prompt)
  → deterministic assembly → learner-renderer-vnext
```

### Topology decisions (summary)

| Current Interactive position | Expository disposition |
| ---------------------------- | ---------------------- |
| Normalize Content | **Reuse unchanged** (when source supplied) |
| Generate Learning Content | **Same machinery + Expository sibling prompt** (richness-preserving teaching content) |
| Model Knowledge | **Reuse unchanged** (conceptual graph; not proto-textbook) |
| Learning Outcomes | **Reuse contract; Expository sibling prompt emphasis** (understanding-oriented, still assessable) |
| Design Episode Plan | **Bypass Interactive EP**; replace with sibling **Expository Journey Plan** |
| Design Learning Activities (DLA) | **Bypass**; replace with sibling **Expository Development** |
| Generate Activity Materials (GAM) | **Bypass Interactive GAM**; replace with sibling **Expository Materials** (may reuse body-authoring *machinery* behind a sibling contract) |
| Construct Learning Sequence | **Bypass** for first implementation (not a timed Interactive session) |
| Design Page | **Same machinery + Expository sibling prompt** (orientation, synthesis transport, visual planning) |
| Deterministic assembly | **Shared with additive adaptation** for Expository stage keys / page shape |
| Learner renderer | **Reuse** — no new renderer architecture |

**Decision:** [S84-D05](decisions.md#s84-d05--expository-topology--sibling-stage-names)

---

## 4. Authority / data flow

```text
Source / attachments
    │
    ▼
Normalize (optional) ──► Generate Learning Content ──► learning_content
                              │                              │
                              ▼                              │
                     Model Knowledge ◄───────────────────────┘
                     (conceptual graph; fidelity to LC/source)
                              │
                              ▼
                     Learning Outcomes
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
     Expository Journey Plan consumes: LO + MK + LC (+ source refs)
              │
              ▼
     Expository Development consumes: Journey Plan + LO + LC (+ MK for fidelity)
              │ commissions supporting artefacts
              ▼
     Expository Materials realises commissioned artefact bodies
              │
              ▼
     Design Page: title / page_synthesis / visual_affordances (transport + thin glue)
              │
              ▼
     Assembly merges Expository partials → Page → Renderer / export
```

### Ownership rules

| Artefact / stage | Owns | Must not |
| ---------------- | ---- | -------- |
| Source / attachments | Authoritative supplied content | Be silently contradicted downstream |
| `learning_content` | Explanatory richness spine (sections, examples, progression) | Be discarded in favour of MK-only |
| Model Knowledge | Concepts, relationships, processes, misconceptions (graph) | Become a textbook; be the sole richness store |
| Learning Outcomes | Intended understanding / competence targets | Require Interactive production evidence |
| Expository Journey Plan | Progressive construction of understanding across ordered learner-facing **sections** (intellectual journey) | Invent Interactive activity choreography; write full exposition; treat TOC coverage as sufficient |
| Expository Development | Explanatory treatment per section so the learner can make the planned conceptual move; material commissions; invitations to think | Commission workspaces/evidence/diagnostic review; independently replan the whole journey |
| Expository Materials | Bodies of commissioned intellectual artefacts for relevant section(s) | Invent commissions; invent Interactive tasks |
| Design Page | Learner-facing title, orientation/synthesis transport, visual planning | Rewrite section exposition bodies for “coherence” |
| Assembly | Deterministic merge of ordered sections + materials | Invent pedagogy |

**Decision:** [S84-D04](decisions.md#s84-d04--authority--knowledge-flow)

---

## 5. Stage responsibility table

| Stage | Kind | Pedagogical / architectural job |
| ----- | ---- | ------------------------------- |
| Normalize Content | Shared | Clean/segment supplied source |
| Generate Learning Content | Shared infra + **Expository sibling prompt** | Produce teaching-ready `learning_content` that preserves explanatory richness for exposition |
| Model Knowledge | Shared | Conceptual model for planning fidelity and dependencies |
| Learning Outcomes | Shared contract + **Expository sibling prompt** | State what understanding the chapter aims at |
| **Expository Journey Plan** | **Sibling stage** | Design the progressive intellectual journey across ordered learner-facing **sections** (north star: construct coherent understanding) |
| **Expository Development** | **Sibling stage** | Decide how each **section** is explained for the intended conceptual move; commission supporting artefacts |
| **Expository Materials** | **Sibling stage** | Realise commissioned supporting artefacts associated with relevant section(s) |
| Design Page | Shared infra + **Expository sibling prompt** | Title, orientation, synthesis transport, visual affordances (no section-body rewrite) |
| Assembly | Shared + additive | Deterministically construct ordered sections + materials into the resource |
| Renderer | Shared | Present reading/viewing resource |

---

## 6. Prompt-family responsibility map

**No production prompt text is authored in Planning.** The following guides later authoring.

### 6.1 Generate Learning Content (Expository sibling)

| Item | Specification |
| ---- | ------------- |
| Decide/produce | `learning_content` with sections, key ideas, examples, definitions, progression suitable as exposition raw material |
| Inputs | Topic / normalized content / attachments |
| Preserve | Source fidelity; examples/qualifications present in source |
| Must not invent | Unsupported claims; Interactive activity design |
| Downstream | MK, Journey Plan, Development |
| Carry across | Grounding, source fidelity, instructional depth, attachment honesty |
| Differs from Interactive | Emphasises explanatory richness preservation for chapter use, not activity prep alone |

### 6.2 Model Knowledge (shared)

| Item | Specification |
| ---- | ------------- |
| Decide/produce | Conceptual graph (`concepts`, `relationships`, `groupings`, `processes`, `misconceptions`) |
| Inputs | Prefer `learning_content` |
| Preserve | Conceptual structure; no external invention beyond source/LC |
| Must not | Expand into full exposition prose |
| Downstream | LO, Journey Plan (dependencies/emphasis), Development (fidelity) |
| Differs from Interactive | **No material difference required** at first implementation |

### 6.3 Learning Outcomes (Expository sibling prompt)

| Item | Specification |
| ---- | ------------- |
| Decide/produce | Assessable understanding-oriented outcomes aligned to MK |
| Inputs | MK (+ LC context as needed) |
| Preserve | Measurable intent without requiring Interactive production |
| Must not | Invent activity/evidence requirements |
| Downstream | Journey Plan, Development |
| Differs from Interactive | Voice/emphasis toward understanding; avoid production-obliged wording |

### 6.4 Expository Journey Plan (new sibling)

| Item | Specification |
| ---- | ------------- |
| Decide/produce | The **intellectual journey** expressed as an ordered set of learner-facing **sections**: purpose of each section in the progressive construction of understanding; knowledge focus; conceptual dependencies; where distinctions, relationships, recurrence, representation, qualification and synthesis belong; links between sections. Answers: *What intellectual journey will allow this audience to construct the understanding represented by these Learning Outcomes?* |
| Inputs | LO + MK + LC |
| Preserve | Whole-resource progressive coherence; LO-driven understanding targets; MK dependencies; planned connections beyond serial coverage |
| Must not | Emit Interactive beats (`guided_practice`, `independent_performance`, …); invent material bodies; reduce to a TOC that merely covers LOs; impose a fixed universal beat template |
| Downstream | Expository Development (must follow journey; not replan wholes) |
| Carry across | Authority clarity; claim scope; proportional support |
| Differs from EP | Progressive construction of **understanding** via ordered sections — not Interactive activity choreography |

### 6.5 Expository Development (new sibling)

| Item | Specification |
| ---- | ------------- |
| Decide/produce | For each planned **section**: explanatory treatment appropriate to that step in the journey (what/why/how/relations/limits as needed); pedagogical elaboration commissions (examples, non-examples, comparisons, cases, demonstrations, evidence, analogy, boundary cases, misconceptions, representation, invitations to think — as **judgements**, not checklist); continuity hooks to prior/next sections that respect the whole-resource journey |
| Inputs | Journey Plan + LO + LC (+ MK) |
| Preserve | Journey structure and intended conceptual moves; source/LC grounding; claim warrant; whole-resource progression (do not independently optimise sections) |
| Must not | `learner_task` / `expected_output` / `evidence_decision` / `response_fulfilment` / diagnostic review / transfer-as-production |
| Downstream | Expository Materials |
| Carry across | Depth, claim scope, formal fidelity, delayed disclosure where applicable, attachment honesty |
| Differs from DLA | Explanation design + intellectual artefact commission for a **section** in a journey — not learner production design |

### 6.6 Expository Materials (new sibling)

| Item | Specification |
| ---- | ------------- |
| Decide/produce | Bodies for commissioned intellectual artefacts associated with the relevant **section(s)** (prose, examples, cases, tables, worked demonstrations, evidence extracts, etc.) |
| Inputs | Development commissions (embedded, GAM-like pattern) + LC/source as needed |
| Preserve | Commission lock (no invent/delete/reassign); grounding; formal consistency; recurrence consistency with journey |
| Must not | Invent Interactive tasks/workspaces; invent new commission rows |
| Downstream | Assembly / renderer |
| Carry across | Material quality, instructional depth, formal fidelity, maths, graphics constraints, simulation honesty |
| Differs from GAM | Section-scoped intellectual artefacts, not activity `required_materials` fulfilment |

### 6.7 Design Page (Expository sibling)

| Item | Specification |
| ---- | ------------- |
| Decide/produce | Title; `page_synthesis` (overview, purpose, knowledge_summary, tips) as **transport/thin orientation**; visual affordances / claim bounds |
| Inputs | Upstream Expository partials |
| Preserve | Upstream exposition; do not rewrite bodies for coherence |
| Must not | Re-author chapter content; invent Interactive study-tips-as-transfer |
| Carry across | Thin-assembly coherence discipline; visual claim-scope; a11y figure/caption norms |
| Differs from Interactive DP | Voice for reading chapter; no activity-closure choreography |

---

## 7. Contract strategy

| Contract / artefact | Strategy | Reason |
| ------------------- | -------- | ------ |
| Normalize / source handling | **Reuse unchanged** | Product-independent |
| `learning_content` | **Reuse**; Expository prompt selects richness emphasis | Richness spine; no need for new LC schema at first cut |
| `knowledge_model` | **Reuse unchanged** | Conceptual graph fits; do not extend into textbook in v1 |
| `learning_outcomes` | **Reuse unchanged** | Product-independent enough; prompt emphasis only |
| Episode Plan V1 | **Not used** in Expository topology | Interactive choreography |
| DLA page-enrich contract | **Not used** | Production/evidence/workspace-bound |
| GAM page-enrich contract | **Not used as Interactive contract**; body-authoring *patterns* may be studied for sibling XM | Activity commission lock is Interactive-shaped |
| **Expository Journey Plan** | **Sibling contract** | Intellectual journey across ordered **sections** |
| **Expository Development** | **Sibling contract** | Per-section explanation + commissions without Interactive fields |
| **Expository Materials** | **Sibling contract** | Section-scoped artefact bodies |
| Page schema 2.0.0 | **Additive support for ordered exposition sections** | Semantic primary structure is **sections** ([S84-D11](decisions.md#s84-d11--ordered-exposition-sections-as-semantic-primary-structure)); field names/IDs/nesting are implementation detail; reject fake Interactive activities / thin activity-compatible shells as primary structure |
| Assembly stage keys | **Additive** | Register Expository stage order alongside Interactive — do not rewrite Interactive path |
| Renderer contracts | **Reuse** | Display already supports study artefacts |

**Field-by-field schemas** are deferred to implementation except as needed to keep authority boundaries clear. Planning requires sibling contracts to exist as distinct artefacts and requires ordered **sections** as the semantic primary learner-facing structure; exact fields, IDs, nesting, capture/enrich and renderer plumbing are implementation detail within these boundaries.

**Decision:** [S84-D08](decisions.md#s84-d08--contract-strategy) · primary structure [S84-D11](decisions.md#s84-d11--ordered-exposition-sections-as-semantic-primary-structure)

---

## 8. Narrative continuity model

### Question answered

> Who owns the chapter?

### Model

| Layer | Owner | Role |
| ----- | ----- | ---- |
| **Progressive construction of understanding (whole resource)** | **Expository Journey Plan** | Designs the intellectual journey across ordered **sections** — dependencies, distinctions, relationships, recurrence, qualification, synthesis, increasing connectedness. Not a TOC; not serial LO coverage. |
| **Section realisation + local continuity** | **Expository Development** | Explains each section as a step in that journey; transitions/callbacks as needed; must not replan the whole |
| **Material-level continuity** | **Expository Materials** | Keeps recurring examples/cases consistent with commissions for relevant section(s) |
| **Orientation / thin glue** | **Design Page** | Overview/purpose/summary transport; signposting only — no section-body rewrite |
| **Merge** | **Assembly** | Deterministic construction of ordered sections + materials; no pedagogical rewrite |

### Relationship to primary structure

```text
Resource / chapter
  → intellectual journey (EJP)
    → ordered learner-facing sections
      → explanatory treatment (XD)
        → supporting intellectual materials (XM)
```

Section structure expresses the journey; section order alone is not continuity. EJP remains owner of whole-resource progression and coherence ([S84-D10](decisions.md#s84-d10--expository-instructional-design-north-star), [S84-D11](decisions.md#s84-d11--ordered-exposition-sections-as-semantic-primary-structure)).

### Explicitly rejected

- Independently good chunks + thin assembly as the sole continuity strategy.
- Serial “good explanation of A, then B, then C” without integrated understanding.
- A final unrestricted LLM “make this coherent” rewrite that compromises stage authority or grounding.
- Treating section generation as sufficient without a deliberate intellectual journey.

**Decision:** [S84-D06](decisions.md#s84-d06--narrative-continuity-model) refined by [S84-D10](decisions.md#s84-d10--expository-instructional-design-north-star)

---

## 9. Supporting-material / representation model

### Commissioning

**Expository Development** commissions supporting intellectual artefacts as judgements about what will make the idea intelligible **for that section’s place in the journey** (examples, non-examples, cases, comparisons, worked demonstrations, evidence extracts, tables, diagrams, timelines, equations, conceptual models, annotated representations, etc.).

**Not** a mandatory ingredient checklist.

### Realisation

**Expository Materials** realises commission rows 1:1 (commission lock), associated with the relevant **section(s)** — analogous in *discipline* to GAM but **not** using Interactive activity material semantics.

### Graphics / maths / a11y

- Visual planning may use Design Page visual-affordance pattern (claim bounds, caption/alt) attached to **sections** rather than Interactive activity IDs.
- Maths display (MathJax) and formal-fidelity protections remain available.
- Accessibility authoring baseline preserved (alpha baseline; no formal WCAG claim).

**Decision:** [S84-D07](decisions.md#s84-d07--materials--pageassemblyrenderer-strategy) (with §10) · sections [S84-D11](decisions.md#s84-d11--ordered-exposition-sections-as-semantic-primary-structure)

---

## 10. Page / assembly / renderer strategy

### Semantic primary structure (settled)

> The first-class Expository Resource is semantically organised as an **ordered set of learner-facing exposition sections**.

```text
Resource / chapter
    ↓
ordered sections
    ↓
explanation + supporting intellectual materials
```

The **section** is the primary learner-facing structural unit. Do **not** introduce an abstract `exposition unit` layer unless later implementation evidence shows a real need beyond sections. Explicitly **reject** fake Interactive activities or a thin activity-compatible shell as the primary Expository structure merely for implementation convenience.

| Concern | Strategy |
| ------- | -------- |
| Renderer architecture | **Reuse** learner-renderer-vnext — no new renderer |
| Page representation | **Ordered exposition sections** + associated materials; additive schema support; field names/IDs/nesting = implementation detail |
| Workspaces / evidence | **Absent** by design; validation must not require them for Expository |
| Assembly | Additive stage order for Expository partials; deterministically construct ordered sections; Interactive path untouched |
| Zero-activity / zero-workspace page | Allowed for Expository; Interactive path unchanged |
| Graphics / MathJax / prose / tables / a11y | Remain available; bind visual claim-scope to sections |

Implementation must verify validation/certification assumptions for section-based Expository pages without altering Interactive gates.

**Decision:** [S84-D07](decisions.md#s84-d07--materials--pageassemblyrenderer-strategy) · [S84-D11](decisions.md#s84-d11--ordered-exposition-sections-as-semantic-primary-structure)

---

## 11. Capability-preservation matrix

| Capability | Classification |
| ---------- | -------------- |
| Source / attachment handling | **Shared unchanged** |
| Normalize Content | **Shared unchanged** |
| Generate Learning Content machinery | **Shared with Expository sibling prompt** |
| Grounding / authority / source fidelity | **Shared principles → expressed in Expository siblings** |
| Model Knowledge | **Shared unchanged** |
| Learning Outcomes artefact | **Shared unchanged** (sibling prompt emphasis) |
| Episode Plan V1 / Interactive derive | **Interactive-specific / not applicable** |
| DLA production/evidence/workspace contract | **Interactive-specific / not applicable** |
| GAM Interactive commission contract | **Interactive-specific / not applicable** |
| Body-authoring discipline (depth, formal fidelity) | **Expository sibling behaviour** (learn from GAM) |
| Learning Sequence (timed session) | **Interactive-specific / not applicable** (first cut) |
| Design Page / thin-assembly coherence | **Shared with Expository sibling prompt** |
| Deterministic partial assembly | **Shared with additive adaptation** |
| Learner renderer (prose, tables, figures, MathJax, study moments) | **Shared unchanged** |
| Graphics visual claim-scope | **Shared with additive adaptation** (bind to **sections**) |
| Maths entry (MathLive) | **Deferred / not applicable** to first Expository (display Maths still shared) |
| Export / learner package | **Shared with additive adaptation** if package assumes Interactive workspaces |
| Accessibility authoring baseline | **Shared unchanged** (alpha baseline) |
| Facilitated workshop delivery semantics | **Interactive-specific / not applicable** |
| Assessment Interactive path | **Interactive-specific / not applicable** |
| Adjustments / Settings | **Shared unchanged** where product-independent; Expository-specific Adjustments **Deferred** |
| Provenance / claim-scope protections | **Shared principles → Expository siblings** |

---

## 12. Naming decisions

| Responsibility | Planning name | Notes |
| -------------- | ------------- | ----- |
| Product | **Expository Resource** | Create label |
| Product id | `expository_resource` | Provisional |
| Journey planning stage | **Expository Journey Plan** | Not “Episode Plan”; owns progressive construction of understanding |
| Detailed pedagogical development | **Expository Development** | Not “DLA”; per-**section** explanatory treatment |
| Supporting artefact realisation | **Expository Materials** | Not “GAM”; section-associated commissions |
| Learner-facing structural unit | **Section** (exposition section) | Semantic primary structure; not “activity”; not abstract “exposition unit” |
| Shared upstream | Model Knowledge, Learning Outcomes, Generate Learning Content | Keep shared names |
| Learner-facing container | Page (Expository profile: ordered sections) | No new renderer name |

Abbreviations for docs/impl: EJP, XD, XM — optional; full names preferred in product-facing text.

---

## 13. Quality / acceptance framework

### 13.1 Judgement dimensions (not ingredient counts)

| Dimension | Question |
| --------- | -------- |
| Progressive construction of understanding | Does the resource take the learner through a deliberate intellectual journey that builds increasingly coherent, connected, discriminating, qualified and usable understanding — not merely serial competent sections? |
| Conceptual coherence | Is there a deliberate intellectual journey, not a bag of facts or a TOC covering LOs? |
| Explanatory sufficiency | Are key ideas unpacked (what/why/how/relations/limits) where needed for the intended conceptual moves? |
| Appropriate elaboration | Are examples/cases/contrasts/etc. chosen for intelligibility at that point in the journey, not checklist completion? |
| Representation | Are diagrams/tables/equations used because they aid understanding? |
| Grounding / fidelity | Are claims warranted by source/LC; qualifications preserved? |
| Narrative continuity | Does the chapter feel authored as a whole, with connections/recurrence/synthesis beyond independently good sections? |
| Audience appropriateness | Is depth/register suitable? |
| Formal / mathematical correctness | Where relevant, are formalisms consistent? |
| Accessibility baseline | Established alpha baseline preserved; no formal WCAG claim |
| No accidental Interactive obligations | No required workspaces, evidence capture, or fake tasks |
| Capability preservation | Applicable shared PRISM capabilities remain available |
| Structurally honest representation | Resource is organised as ordered **sections**, not fake Interactive activities |

### 13.2 Not sufficient alone

A resource is **not** first-class merely because:

- all Learning Outcomes are mentioned;
- every section is individually competent;
- content is factually grounded;
- the renderer works.

Manual review must inspect the **intellectual journey across the resource as a whole** against the north star ([S84-D10](decisions.md#s84-d10--expository-instructional-design-north-star)).

### 13.3 First-class manual journey (later implementation)

Create Expository Resource → supply topic/source → Run Expository topology → assemble → open learner resource → export package. Confirm reading/viewing experience, richness, **progressive construction of understanding across ordered sections**, continuity judgement, no Interactive chrome obligations.

### 13.4 Engineering gate (later implementation)

- Focused Expository regression tests (assembly of ordered sections, validation without workspaces, sibling stage capture).
- Existing Interactive first-class gate remains green (**339/339** class) — Interactive baseline protected.
- No Interactive prompt diffs required for Expository to work.

Do **not** run these gates in Planning. Do **not** quantify journey quality with mechanical counts or a rigid rubric.

**Decision:** [S84-D09](decisions.md#s84-d09--qualityacceptance--implementation-handoff) · north star [S84-D10](decisions.md#s84-d10--expository-instructional-design-north-star)

---

## 14. Explicit non-goals / deferred relationships

| Item | Disposition |
| ---- | ----------- |
| Expository → Interactive transformation | Deferred — valuable later; not a first-implementation requirement |
| Expository → Workshop packaging | Deferred — “read then attend” pattern noted only |
| Research Synthesis identity | **Remains open** — distinct product vs specialised Expository treatment |
| Podcast / Presentation | Out of scope |
| Generic product extensibility framework | Out of scope |
| MK schema expansion into textbook | Not for first design |
| Learning Sequence for Expository | Not for first design |
| Formal WCAG programme | Out of scope |

---

## 15. Implementation handoff

### 15.1 What would be built

1. Create product option `expository_resource` + factor seed / topology selection.  
2. Expository sibling prompts for: Generate Learning Content, Learning Outcomes, Journey Plan, Development, Materials, Design Page — authored against the **instructional-design north star** ([S84-D10](decisions.md#s84-d10--expository-instructional-design-north-star)), not Interactive beat templates.  
3. Sibling contracts + capture/enrich paths for EJP, XD, XM with **ordered sections** as the semantic primary structure ([S84-D11](decisions.md#s84-d11--ordered-exposition-sections-as-semantic-primary-structure)).  
4. Additive assembly stage registration and **section-based** Expository page support (field-level schema = implementation detail).  
5. Validation paths that allow zero-workspace Expository pages.  
6. Tests protecting Interactive baseline + Expository regressions.  
7. Manual journey + engineering gate per §13 — including whole-resource **progressive construction of understanding**, not merely successful section generation.

### 15.2 Reused machinery

Normalize; LC/MK/LO artefacts; Design Page infrastructure; deterministic assembly pattern; learner-renderer-vnext; graphics/maths/a11y display; product routing pattern (Create → factors → topology → prompts).

### 15.3 Sibling additions

EJP, XD, XM prompts + contracts; Expository sibling prompts for LC/LO/Design Page; Expository topology rules; section-organised learner resource representation.

### 15.4 Additive shared infrastructure (expected)

- Product routing / prompt selection for Expository siblings.  
- Assembly stage keys for Expository partials.  
- Schema/validation support for ordered exposition **sections** (exact fields deferred).  
- Possible package-export tolerance for non-Interactive pages.

**Must preserve Interactive behaviour** — no Interactive prompt edits; no weakening of Interactive contracts.

### 15.5 Protected Interactive behaviour

All existing Self-study / Workshop prompts, DLA/GAM/EP contracts, and Interactive first-class gate remain baseline.

### 15.6 Suggested implementation work packages (not a sprint open)

| WP | Focus | Depends on |
| -- | ----- | ---------- |
| WP1 | Create product + topology wiring (no pedagogy prompts yet) | Design acceptance |
| WP2 | EJP contract + prompt + capture (journey across ordered sections) | WP1 |
| WP3 | XD contract + prompt + capture (per-section explanatory treatment) | WP2 |
| WP4 | XM contract + prompt + capture (section-associated materials) | WP3 |
| WP5 | LC/LO/Design Page Expository sibling prompts | WP1 |
| WP6 | Assembly + section-based page shape + validation | WP2–4 |
| WP7 | Manual journey (north-star review) + tests + Interactive non-regression | WP1–6 |

Do **not** open an implementation sprint from this document.

---

## 16. Open questions (genuine only)

1. **Field-level section/page schema mechanics** — exact field names, IDs, nesting, capture/enrich, renderer plumbing for ordered sections. Semantic primary structure is **settled** ([S84-D11](decisions.md#s84-d11--ordered-exposition-sections-as-semantic-primary-structure)); only implementation representation remains.  
2. **How much GAM body-authoring code can be shared behind XM** without coupling to Interactive contracts — implementation spike.  
3. **Research Synthesis** — still open (distinct vs specialised Expository).  
4. **Whether Expository Adjustments** are needed in first cut — deferred unless Create/Run evidence demands.  
5. **Export package edge cases** for zero-workspace resources — verify in WP6/WP7.

---

## Alternatives considered (selected design)

| Alternative | Why not selected |
| ----------- | ---------------- |
| Prompt-only reuse of DLA/GAM/EP | S83: Interactive contracts are constitutional; violates S83-D04 |
| Single generic pedagogical prompt family | Weakens Interactive; fails protected baseline |
| Force all richness through extended MK | Turns MK into proto-textbook; loses LC spine; S83 advises against |
| Final LLM coherence rewrite | Compromises stage authority/grounding |
| New renderer | S83: display path sufficient |
| Keep DLA/GAM names for Expository stages | Obscures responsibility; fails naming principle |
| Expository beat-sequence template (Interactive analogue) | Wrong instructional grammar; north star is progressive understanding, not fixed beats ([S84-D10](decisions.md#s84-d10--expository-instructional-design-north-star)) |
| Abstract `exposition unit` layer or fake-activity shell | Structurally dishonest / unnecessary; **section** is primary ([S84-D11](decisions.md#s84-d11--ordered-exposition-sections-as-semantic-primary-structure)) |

**Smallest coherent choice:** shared upstream (LC/MK/LO) + three sibling pedagogical stages (Journey Plan, Development, Materials) under the instructional-design north star + ordered **sections** as semantic primary structure + sibling prompts on LC/LO/Design Page + additive assembly/page support + reused renderer — Interactive untouched.
