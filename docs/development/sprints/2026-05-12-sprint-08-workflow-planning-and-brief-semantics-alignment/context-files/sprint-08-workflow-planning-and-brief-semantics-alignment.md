# Sprint 08 — Workflow Planning and Brief Semantics Alignment

**Working title:** Sprint 08 — Workflow Planning and Brief Semantics Alignment

## Purpose

Sprint 08 **translates Sprint 07 review findings** into a **bounded planning sprint** (documentation and tables): align **workflow brief**, **elicitation model**, and **planning semantics** with the clarified **learner-facing page** mental model—**without** assuming a **generator rewrite** in this sprint.

The clarified mental model (from Sprint 07 documentation):

- **PRISM LD generation** primarily produces **learner-facing pages** (typically student-facing HTML output).
- **Workflows** are **orchestration infrastructure** for pedagogic synthesis—not the learner’s primary artefact on the **learner-facing page**.
- **Page composition** on that page is commonly **Orientation + Learning Activities + Assessment** (with valid variants documented in Sprint 07).
- **Assessment planning** and **sequencing semantics** are the main **conditional complexity** areas—they are **not** assumed **heavyweight elicitation** defaults for every learning design.
- **Renderer** work remains **out of scope** for Sprint 08 unless explicitly rescoped; **renderer**-stage layout and assembly stay separate from pedagogic planning semantics (see boundary notes below).

## Context

**Sprint 07** (`docs/consolidation/sprint-07-workflow-generation-rationalisation-review.md`) established that:

- **Core workflow generation** is **substantially coherent** and aligns strongly with learner-facing synthesis.
- **Likely stable:** **compact workflows**, **artefact chaining**, **learner-facing coherence**, **lightweight elicitation**, **emergent pedagogic sequencing behaviour**.
- **Likely unstable / needs realignment:** brief semantics, **desired-output** framing, **delivery-context** framing, **factor timing**, hidden **planning state** in steps, UX terminology, workflow abstraction leakage into UX.

Sprint 08 **does not re-litigate** the full generation review; it **maps** those conclusions onto **brief fields**, **elicitation boundaries**, and **planning-factor ownership**.

## Scope

Review and **prepare documentation toward a future implementation plan** (tables + backlog separation + boundary notes)—**planning-only** in Sprint 08—for:

1. **Workflow brief field semantics** — what each field means today vs what it should mean under the **page composition** model.
2. **Desired outputs → page composition framing** — conceptual migration path (not necessarily immediate UI rename).
3. **Delivery context → learner interaction / progression mode and sequencing semantics** — how legacy labels relate to **learner interaction / progression mode** and **sequencing semantics** vocabulary.
4. **Pre-synthesis elicitation boundaries** — which factors must be resolved before synthesis.
5. **Post-synthesis configuration** boundaries (workflow-aware) — which factors legitimately depend on generated structure.
6. **Assessment planning** surfacing — triggers, defaults, and user-visible vs inferred behaviour.
7. **Sequencing semantics** and **learner interaction / progression mode** — **lightweight elicitation**-aligned steering vs implicit defaults (no granular sequencing product in Sprint 08 unless rescoped).
8. **Step settings vs planning state** — which settings remain **local step tuning** vs unresolved **pedagogic planning** that should move earlier.

## Non-goals

- No **generator rewrite**.
- No **domain-pack rewrite** (content or structure overhaul).
- No **renderer redesign** or generated-page rendering behaviour change **in this sprint** unless explicitly rescoped.
- No **execution-engine redesign**.
- No **major `app.js` restructuring**.
- No **broad feature expansion** disguised as “alignment.”

**Scope-boundary reminder:** these **non-goals** stand unless a **later sprint** explicitly rescopes them. Sprint 08 consolidation treats **no generator rewrite**, **no domain-pack rewrite**, **no renderer redesign**, **no execution-engine redesign**, and **no major `app.js` restructuring** as **fixed planning boundaries**—not deferred implementation commitments.

## Deliverables

1. **Current brief-field audit table** — inventory of factory/brief fields and how they bind to generation today.
2. **Proposed planning-factor classification table** — map factors to **default** / **brief** / **pre-synthesis elicitation** / **post-synthesis configuration** / **local step tuning** / **renderer** (documentation-only classification).
3. **Proposed future brief semantics model** — narrative + optional diagram/table of the target brief shape (not a commitment to exact fields until reviewed).
4. **Pre-synthesis vs post-synthesis elicitation boundary note** — explicit rules-of-thumb and open questions carried from Sprint 07.
5. **Assessment-planning trigger / configuration note** — what must be inferred vs elicited vs **post-synthesis configuration**.
6. **Sequencing and learner-interaction modelling note** — relationship to **learner-facing page** assembly; preserve **compact workflows** per Sprint 07 caution.
7. **Implementation backlog candidates** — **separated** from **decisions** (no accidental “approved build” language).
8. **Possible optional scoped implementation outline** — for a **later** pass only, if a follow-on sprint is chartered; explicit risk and blast-radius notes (**exploration**, not Sprint 08 commitment).

## First task

Build a **“current field and factor audit”** table with columns:

| Column | Description |
|--------|-------------|
| **Current field/factor** | Name as seen in UI, prompts, or code today |
| **Current location** | e.g. brief form, elicitation transcript, step row, domain pack, generator prompt |
| **Current meaning** | Short plain-language description |
| **Issue identified in Sprint 07** | Link to review finding (legacy framing, timing, leakage, etc.) |
| **Proposed future framing** | Under **page composition** + planning lifecycle vocabulary |
| **Stage** | `default` / `brief` / `pre-synthesis elicitation` / `post-synthesis configuration` / `local step tuning` / `renderer` |
| **Implementation risk** | Low / medium / high + note (compatibility, UX disruption, hidden coupling) |
| **Recommended next action** | e.g. doc-only, spike, narrow UI copy pass, defer |

**Include at minimum** these rows (initial cells may be placeholders until the audit session fills them):

- desired outputs  
- delivery context  
- scope and constraints  
- learner level  
- topic / source content  
- duration / learner effort  
- assessment required  
- assessment type  
- assessment item count  
- difficulty / cognitive demand  
- coverage  
- feedback mode  
- learning activities  
- learner interaction mode  
- page profile  
- session materials / page output  
- sequencing granularity  
- tone / style  
- step settings  
- renderer / layout settings  

## Current field and factor audit

Documentation-only **planning traceability** table. **Locations** are indicative (workflow factory / elicitation / steps / prompts); confirm against `app.js` and UI when an implementation sprint is scoped. **Stages** use Sprint 08 lifecycle vocabulary: `default` | `brief` | `pre-synthesis elicitation` | `post-synthesis configuration` | `local step tuning` | `renderer`.

| Current field/factor | Current location | Current meaning | Issue identified in Sprint 07 | Proposed future framing | Stage | Implementation risk | Recommended next action |
|----------------------|------------------|-----------------|------------------------------|---------------------------|-------|----------------------|-------------------------|
| **Desired outputs** | Workflow Factory (`wfDesignDesiredOutputs` and related); export/import copy | User-facing list of artefacts/deliverables expected from the run | **Desired outputs** framing unstable; planning model often **infers** necessary artefacts from pedagogic intent | **Page composition** questions for the **learner-facing page** (orientation / activities / assessment; what must exist on the page) | **brief** (high-level intent) + **pre-synthesis elicitation** (composition flags) | **Medium** (copy, migration path, saved bundles) | Terminology + semantics doc pass; optional narrow UI copy later (**candidate**, not approved) |
| **Delivery context** | Brief / hints; sometimes conflated with “mode” | Venue/channel labels (e.g. online, classroom) | Weak **legacy abstraction**; **interaction structure** more educationally meaningful than environment labels | **Learner interaction / progression mode** (individual, pair, group; guided→independent signals) | **pre-synthesis elicitation** (primary); **brief** for coarse signal only | **Medium–high** (rename/repurpose without breaking saves) | Reframing note + compatibility audit (**candidate**) |
| **Scope and constraints** | Workflow Factory scope/constraints fields; merged into workflow output spec on save | Free-text scope, constraints, sometimes patch lines | Can mix **structural** and **presentation** concerns; timing unclear | Split **planning constraints** (**brief** / **pre-synthesis elicitation**) vs **downstream detail** (**post-synthesis configuration** / **local step tuning**) | **brief** + **pre-synthesis elicitation** | **Medium** | Classify sub-clauses in audit follow-up; doc-only guidance first |
| **Learner level** | Brief (audience/level signals) | Target learner sophistication | **Stable** early factor; affects language and cognitive demand | Retain as **core planning factor** | **brief** | **Low** | Keep; clarify wording in brief semantics model (**candidate**) |
| **Topic / source content** | Brief inputs; starting artefact / source grounding | Whether learning is anchored in supplied content vs generated-from-topic | **High** structural significance; affects normalisation / knowledge model | **Source-content mode** as explicit **pre-synthesis elicitation** planning factor | **brief** + **pre-synthesis elicitation** | **Medium** | Retain early capture; tighten semantics in planning doc (**candidate**) |
| **Duration / learner effort** | Brief constraints; duration-like hints | Expected effort / length | Affects **compactness**, activity scope, page density; captured inconsistently | Explicit **planning factor** for scope density | **brief** or **pre-synthesis elicitation** | **Medium** | Normalise meaning in brief model (**candidate**) |
| **Assessment required** | Inferred from chat + brief; sometimes implicit until steps | Whether assessment block is part of page composition | **Conditional complexity**; materially affects topology and page | **Page composition** flag: assessment **on/off** + triggers for follow-on questions | **pre-synthesis elicitation** (once intent known) | **High** | Assessment trigger note + elicitation flow design later (**candidate**) |
| **Assessment type** | Post-design configuration; step text (`Design Assessment` etc.) | Rubric/MCQ/applied tasks etc. | Shapes generated **assessment structures**; often only knowable after scaffold | **Workflow-aware post-synthesis configuration** | **post-synthesis configuration** | **High** | Keep **post-synthesis configuration**; clarify defaults (**candidate**) |
| **Assessment item count** | Post-synthesis / step configuration | Number of items / checks | Structural for workload and page layout | **Post-synthesis configuration** tied to generated assessment step | **post-synthesis configuration** | **Medium** | Defaults + conditional elicitation (**candidate**) |
| **Difficulty / cognitive demand** | Spread across brief, steps, generation | Cognitive load / challenge level | Can be **implicit** in activities; timing mixed | Prefer **pre-synthesis elicitation** intent band + **post-synthesis configuration** fine tuning | **pre-synthesis elicitation** + **post-synthesis configuration** | **Medium–high** | Split coarse vs fine in classification (**candidate**) |
| **Coverage** | Often implicit in assessment / activity steps | How much of content/skills must be assessed | Affects assessment shape and length | **Post-synthesis configuration** once assessment exists | **post-synthesis configuration** | **Medium** | Document defaults (**candidate**) |
| **Feedback mode** | Assessment-related prompts / steps | Formative vs summative feedback emphasis | Affects assessment and page sections | **Post-synthesis configuration** (structure-dependent) | **post-synthesis configuration** | **Medium** | Elicitation triggers when assessment on (**candidate**) |
| **Learning activities** | Inferred from synthesis; partial brief capture | Whether activities are first-class on the **learner-facing page** | Affects **page composition** and topology | **Page composition** planning: activities required / shape | **pre-synthesis elicitation** | **High** | Needs further review per Sprint 07 dimension table (**candidate**) |
| **Learner interaction mode** | Weakly via delivery context; rarely explicit | Individual / pair / group / class participation | **High** structural significance; misaligned with delivery-context labels | Explicit **learner interaction / progression mode** planning factor | **pre-synthesis elicitation** | **High** | **Possible** reframe delivery context → **learner interaction / progression mode** (**candidate**) |
| **Page profile** | Defaults + occasional step assumptions | Learner-first vs facilitator-heavy **learner-facing page** | Tied to **assembly** assumptions; can hide in steps | Default **learner-facing page** profile + explicit overlay **candidate** | **default** + **post-synthesis configuration** | **Medium** | Vocabulary exploration (**candidate**) |
| **Session materials / page output** | Desired outputs / artefacts lists; generator prompts | What artefacts session “must” produce | Overlaps **desired outputs** instability; conflates planning with catalogue | Map to **page composition** + **assembly** outputs (**learner-facing page** vs supporting) | **brief** + **pre-synthesis elicitation** | **Medium** | Align wording with **learner-facing page** model (**candidate**) |
| **Sequencing granularity** | Emergent in generator ordering; not a user field today | How tightly **sequencing semantics** are controlled | Sprint 07: **preserve compactness**; **sequencing semantics** often **implicit intelligence** | **Default** inferred **sequencing semantics** + **lightweight elicitation**-aligned steering only if needed | **default** (+ rare **pre-synthesis elicitation** for coarse strategy) | **High** if exposed as heavy UI | **Do not** add granular controls without new review (**candidate**: doc only) |
| **Tone / style** | Prompt bodies; local step edits | Voice, register, formatting taste | **Low** structural significance for topology | **Local step tuning** / prompt phrasing | **local step tuning** | **Low** | Keep local; avoid promoting to planning (**candidate**) |
| **Step settings** | Per-step fields in Workflow Builder / generated steps | Mix of **planning residue** and legitimate **local step tuning** | **Hidden pedagogic planning state** (Sprint 07 diagnosis) | Audit each setting: relocate planning upstream vs keep **local step tuning** | **local step tuning** (today); **target split** → **brief** / **pre-synthesis elicitation** / **post-synthesis configuration** per audit | **High** | Dedicated step-settings audit (**candidate**) |
| **Renderer / layout settings** | Rendering/export pipeline (out of Sprint 08) | HTML layout, chrome, export formatting | Sprint 08 **non-goal**: renderer behaviour | Remain **renderer** concerns | **renderer** | **Low** for Sprint 08 (explicitly out of scope) | Defer to renderer sprint; no Sprint 08 change |

## Planning-factor classification

Maps **planning factors** (conceptual) to **primary lifecycle stage** and risk posture. **Stable Sprint 07 behaviours** to preserve on paper: **compact workflows**, **artefact chaining**, **learner-facing coherence**, **lightweight elicitation**, **emergent pedagogic sequencing behaviour**.

| Planning factor | Primary lifecycle stage | Why resolved there | Stable/defaultable? | Hidden coupling risk | Notes / open questions |
|-----------------|-------------------------|--------------------|---------------------|----------------------|-------------------------|
| **Learner-facing page as primary output** | **default** | Product architecture default | Yes (default assumption) | Low | Do not burden brief; document only |
| **Orientation included** | **default** | Sprint 07: broadly successful automatic orientation | Yes | Low | Renderer assembly details still **renderer** |
| **Page composition (O / A / Assessment)** | **pre-synthesis elicitation** | Determines valid learner-page variants | Partially (some inference OK) | **High** if only captured late | Tie to assessment presence + activities flags |
| **Learner level** | **brief** | Shapes language and demand early | Largely stable | Medium | Keep as core planning factor |
| **Source-content mode** | **brief** / **pre-synthesis elicitation** | Anchors normalisation / knowledge model | Largely stable | High | Confirm early capture in all paths |
| **Learner effort / duration** | **brief** / **pre-synthesis elicitation** | Density and compactness driver | Partially defaultable | Medium | Avoid burying only in constraints text |
| **Learner interaction / progression mode** | **pre-synthesis elicitation** | Structures participation; more salient than venue | Emerging | **High** vs legacy delivery context | **Possible** replace/repurpose delivery-context framing (**candidate**) |
| **Assessment presence** | **pre-synthesis elicitation** | Conditional complexity gate | Partially inferable | **High** | When to infer vs ask remains open |
| **Assessment type / items / coverage / feedback** | **post-synthesis configuration** | Structure-dependent on generated assessment | No | **High** | Must refine coherent scaffold, not rescue missing intent |
| **Cognitive demand (fine)** | **post-synthesis configuration** | Often depends on generated task shapes | Partially | Medium | Coarse band may sit in **pre-synthesis elicitation** |
| **Sequencing strategy (coarse)** | **default** + implicit generator policy | Preserves **compact workflows** | Mostly inferred | **High** if exposed as heavy controls | **Lightweight elicitation**-aligned steering only (Sprint 07 caution) |
| **Tone / style** | **local step tuning** | Presentation / voice | Yes as local | Low | Keep out of structural planning |
| **Renderer / layout** | **renderer** | Out of Sprint 08 scope | N/A | Medium if conflated with pedagogy | Explicit **renderer**-stage boundary; not **assessment planning** or **sequencing semantics** |

## Pre-synthesis vs post-synthesis elicitation boundary note

Principles (documentation-only; **no** behaviour change implied):

1. **Pedagogic structure** (what the learning experience *is*—activities vs assessment, coarse **learner interaction / progression mode**, effort/scope, source mode) belongs **before or around synthesis**, so synthesis can produce a **coherent** **compact workflow** with **artefact chaining**.

2. **Local generation controls** (wording, minor prompt phrasing, small step-level tweaks that do not alter topology) belong in **local step tuning**—not in the brief as faux “planning.”

3. **Renderer / layout controls** remain **renderer**-stage, **renderer-only**, and **out of Sprint 08 scope**; do not load presentation concerns into the brief unless they are true planning inputs (they usually are not).

4. **Assessment planning** is **conditional complexity**: it may legitimately span **brief** (intent), **pre-synthesis elicitation** (presence / coarse intent), and **post-synthesis configuration** (type, counts, coverage, feedback once structure exists). The split must stay explicit to avoid “everything in the last chat.”

5. **Sequencing semantics** should stay **lightweight elicitation**-aligned to preserve **compact workflows** and **emergent pedagogic sequencing behaviour** (Sprint 07 stable strength). Prefer **inferred/default** pedagogic **sequencing semantics** and **targeted** clarification only when educationally necessary—not a general-purpose sequencing editor.

6. **Post-synthesis configuration** should **refine a coherent structure**, not **rescue** an underspecified plan. If synthesis lacks essential planning inputs, the fix is earlier planning semantics—not heavier post-hoc step chrome.

**Sprint 07 stable behaviours** (explicit preservation on paper): **compact workflows**, **strong artefact chaining**, **learner-facing coherence**, **lightweight elicitation**, and **emergent pedagogic sequencing behaviour** where explicit micromanagement is avoided.

## Assessment-planning trigger / configuration note

**Assessment planning** (triggers, defaults, lifecycle placement). Documentation-only. **Not** approved implementation, **not** UI or generator change guidance—planning semantics for a **possible** future design sprint (**candidate**).

### 1. Purpose

Clarify **which assessment planning inputs** should be resolved **where** in the Sprint 08 lifecycle vocabulary:

- **Brief** + **pre-synthesis elicitation** (before synthesis) — only the **minimum** structural commitments needed so synthesis can produce a **coherent** assessment-capable **compact workflow** (without rescuing intent later).
- **Through inference / defaults** (often **default** policy) — where strong product defaults or domain patterns can carry **predictable** assessment posture **without** user burden (must stay explicit in docs so it is not “mystery behaviour”).
- **Post-synthesis configuration** (“after synthesis”) — **workflow-aware refinement**: type, counts, rubric shape, feedback detail, etc., once generated steps and dependencies exist.
- **Local step tuning** only — phrasing, minor item wording, presentation-level tweaks that **do not** change assessment **structure** or **learner-facing page** **topology**.

### 2. Assessment lifecycle classification table

Stages: **default** | **brief** | **pre-synthesis elicitation** | **post-synthesis configuration** | **local step tuning** | **renderer**.

| Assessment factor | Recommended lifecycle stage | Reason | Risk if misplaced | Recommended handling |
|-------------------|-------------------|--------|-------------------|------------------------|
| **Assessment required** (on/off for assessment in **page composition** on the **learner-facing page**) | **pre-synthesis elicitation** (often inferable from brief intent) | Gates topology, artefact selection, and **page composition** | **High** if only discovered in late steps | Prefer **early** explicit or inferred flag; avoid burying in `Design Assessment`-style steps alone (**candidate** future UX) |
| **Formative vs summative purpose** | **brief** (coarse intent) + **pre-synthesis elicitation** (if ambiguous) | Shapes assessment **role** on the page and feedback design | **High** if left implicit until post-synthesis | Capture coarse purpose early; refine after scaffold (**candidate**) |
| **Feedback expectation** | **pre-synthesis elicitation** (broad) + **post-synthesis configuration** (detail) | Broad expectation influences structure; detail depends on generated tasks | **Medium** if only post-hoc | **Minimal pre-synthesis set** (below) + conditional refinement (**candidate**) |
| **Assessment weighting / significance** | **pre-synthesis elicitation** (coarse) + **post-synthesis configuration** (fine) | Affects density and placement relative to activities | **High** if conflated with item count only | Separate “how much assessment matters” from “how many items” (**candidate**) |
| **Assessment type** | **post-synthesis configuration** | Type often depends on generated structure and task genre | **High** if forced pre-synthesis without scaffold | Default + refine after synthesis (**candidate**) |
| **Assessment item count** | **post-synthesis configuration** | Count is structure-dependent | **Medium** if treated as primary planning lever | Keep **post-synthesis configuration**; avoid mistaking for pedagogy (**see risks**) |
| **Rubric requirements** | **post-synthesis configuration** (sometimes **brief** hint only) | Rubric shape follows task design | **Medium** if required before tasks exist | Optional brief hint; full rubric after scaffold (**candidate**) |
| **Peer / self assessment** | **pre-synthesis elicitation** (mode) + **post-synthesis configuration** (mechanics) | Interaction architecture decision + task mechanics | **High** if implicit in “delivery context” only | Tie to **learner interaction / progression mode** planning (**candidate**) |
| **Retry / adaptive behaviour** | **post-synthesis configuration** or **default** (product policy) | Often policy- or task-bound | **Medium** if hidden in prompts | Document defaults; refine with structure (**candidate**) |
| **Marking detail** | **local step tuning** (wording) + **renderer** (presentation) | Marks display is not structural planning | **Low** for topology; **medium** for UX confusion | Keep out of structural gates (**candidate**) |

### 3. Minimal pre-synthesis assessment set

Smallest **useful** early capture (documentation target—not a field spec):

1. **Whether assessment exists** on the **learner-facing page** (composition-level yes/no / strong inference path).
2. **Broad assessment purpose** (formative emphasis vs summative emphasis at a coarse level).
3. **Approximate difficulty / cognitive demand** (band, not fine rubric detail).
4. **Broad feedback expectation** (e.g. immediate explanatory vs deferred; qualitative, not item-level copy).

Anything finer (type, counts, rubric grids, peer mechanics detail) should default to **post-synthesis configuration** unless a future sprint proves a narrow early exception.

### 4. Compactness preservation principle

Assessment complexity **must not** force every generated learning-design workflow into **heavyweight elicitation**. The system should preserve Sprint 07 **stable strengths** on paper: **compact workflows**, **artefact chaining**, **learner-facing coherence**, and **lightweight elicitation**. Post-synthesis and defaults should carry much of the detail burden; pre-synthesis should stay **minimal but sufficient** to avoid rescuing structure later.

### 5. Hidden planning-state risks

Current **documentation risks** (not accusations of bugs—planning/traceability hazards):

- **Assessment intent buried in step settings** (especially assessment-shaped steps) instead of appearing as planning state.
- **Inferred assessment density** without an auditable default path (users cannot see what was assumed).
- **Implicit sequencing dependencies** between activities and assessment that are emergent rather than named.
- **Hidden defaults in domain prompts** that encode assessment posture without a corresponding planning factor.
- **Item-count controls mistaken for pedagogic planning** (count is not a substitute for purpose, weighting, or mode).

### 6. Open questions

- Should **assessment required** remain strictly **binary**, or allow a graded / “light touch” mode—and how would that compose with page variants?
- When should **assessment type** become **explicit** to the user (always post-synthesis vs occasional pre-synthesis hint)?
- How much **assessment sequencing** (placement relative to activities) belongs **pre-synthesis elicitation** vs stays **default** / inferred?
- Should **page composition vocabulary** express assessment intent more clearly than legacy **workflow-output** terminology?
- Which assessment-adjacent controls are genuinely **local step tuning** vs misplaced structural knobs?

**Backlog candidates** for assessment work remain in **Backlog candidates, not decisions** above—this note does **not** add approved scope.

## Sequencing and learner-interaction modelling note

This note situates **learner progression** (how a learner moves through a coherent **learner-facing page** experience) relative to **sequencing semantics** (coarse pedagogic order and gates), **learner interaction / progression mode** (who participates, how, and how pace/order is owned), legacy **delivery context** terminology, **page composition** (orientation / activities / assessment and valid variants), and **compact workflows** (orchestration graphs that preserve **artefact chaining** toward **learner-facing coherence**).

Documentation-only, **architectural / planning-focused**. **Not** approved implementation, **not** a generator or workflow-engine redesign proposal, **not** renderer or runtime behaviour guidance.

### 1. Core positioning

- **Workflows** remain **orchestration infrastructure** for synthesis and assembly—not the learner’s primary learning artefact.
- **Learner-facing pages** remain the **primary learning artefact** under the Sprint 07 / Sprint 08 mental model.
- **Sequencing semantics** exist to support **learner progression** and **pedagogic coherence** on those pages; they should **not** exist primarily to **expose workflow mechanics** to authors or learners as a product surface.
- **Sequencing** should stay **lightweight** (defaults, inference, targeted clarification) unless a **future, explicitly scoped** sprint expands that surface after review—Sprint 08 does **not** assume that expansion.

### 2. Delivery context vs learner interaction

Today’s **“delivery context”** terminology **partially mixes** several distinct concerns:

- **Environment / platform assumptions** (where or through which channel delivery is imagined).
- **Learner interaction / progression mode** (who participates, how, and in what social configuration).
- **Sequencing semantics** (how tightly ordered the experience is, who drives pace, what gates exist).
- **Progression style** (guided vs independent, synchronous cadence vs self-paced, etc.).

A **possible future framing** (terminology and planning vocabulary only—**no** implementation commitment) is **“learner interaction / progression mode”**, which could cluster progression and participation intent separately from raw venue labels. Illustrative **examples** (illustrative only, not field specs):

- **Instructor-guided synchronous progression** (live cohort, facilitator-led cadence).
- **Self-paced independent progression** (learner drives order and pace within a coherent page).
- **Collaborative workshop progression** (group work phases, shared artefacts).
- **Blended progression** (mix of synchronous touchpoints and self-paced segments—planning sense only).

Any rename, UI change, or save-format impact remains a **backlog candidate**, not a decision.

### 3. Sequencing lifecycle classification

Stages: **default** | **brief** | **pre-synthesis elicitation** | **post-synthesis configuration** | **local step tuning** | **renderer**.

| Sequencing factor | Recommended lifecycle stage | Why resolved there | Compactness risk | Notes / open questions |
|-------------------|----------------------------|--------------------|------------------|-------------------------|
| **Sequencing required** (whether strict order is part of the design) | **default** (often “yes” implicitly) + **pre-synthesis elicitation** when it gates topology | Coarse need for ordered vs exploratory flows affects synthesis | **High** if elevated to a heavy “flow author” | Prefer defaults + rare clarification; avoid new mandatory wizarding (**candidate**) |
| **Sequencing granularity** | **default** + implicit generator policy; rare **pre-synthesis elicitation** for coarse strategy only | Sprint 07 strength: **compact workflows** + emergent order | **High** if exposed as fine controls | **Do not** imply a general-purpose sequencing editor (**candidate**) |
| **Progression pacing** | **brief** (intent) + **pre-synthesis elicitation** (if ambiguous) | Shapes how activities and assessment feel over time | **Medium** | Distinguish pacing from venue labels (**candidate**) |
| **Collaborative vs individual progression** | **pre-synthesis elicitation** | Structural participation model; ties to **page composition** and tasks | **High** if only inferred late | Align with **learner interaction / progression mode** vocabulary (**candidate**) |
| **Synchronous vs asynchronous progression** | **brief** / **pre-synthesis elicitation** | Affects cadence, prompts, and facilitator overlays—not **renderer**-stage HTML minutiae | **Medium** | Keep distinct from **renderer** ordering (**candidate**) |
| **Branching / adaptive progression** | **post-synthesis configuration** (often) + **default** product policy | May depend on generated step graph and assessment hooks | **High** if pretended to be fully pre-specified | Default paths + structure-aware refinement (**candidate**) |
| **Facilitator-controlled progression** | **pre-synthesis elicitation** (mode) + **post-synthesis configuration** (detail) | Who “owns” advance—learner vs facilitator—shapes scaffolding | **Medium** | Overlay vs learner-first page profile (**candidate**) |
| **Assessment-linked sequencing** | **pre-synthesis elicitation** (coarse: assessment on page) + **post-synthesis configuration** (fine: placement, gates, retries) | Depends on assessment presence and generated assessment shape | **High** if every assessment knob becomes a sequencing knob | Keep assessment note and this table aligned; no merge into one mega-factor (**candidate**) |
| **Navigation / layout sequencing** | **renderer** | Fine **navigation** and **layout order** are assembly/presentation concerns | **Medium** if pulled into “pedagogic planning” | Explicitly **out of Sprint 08 scope** for granular product work |
| **Renderer ordering** | **renderer** | DOM / section order, export chrome—not orchestration pedagogy | **Low** for topology; **high** if conflated with pedagogy | Hard boundary: rendering ≠ pedagogic sequencing intent |

### 4. Compactness preservation principle

- **Sequencing semantics** must **not** force **heavyweight instructional-flow authoring** into the LD path by default.
- **Compact workflows** remain a **stable Sprint 07 behaviour** on paper and should not be traded for explicit flow diagrams unless a future sprint deliberately accepts that blast radius.
- Preserve on paper **strong artefact chaining** and **lightweight elicitation**: sequencing choices should not add a parallel “flow authoring” burden alongside the existing brief and elicitation surfaces.
- **Sequencing** should **guide synthesis** and preserve **learner-facing coherence**; it should **not** become a **full sequencing product** inside workflow authoring.
- Prefer **implicit / default coherence** plus **targeted** clarification over replacing emergent quality with **excessive configuration burden**.

### 5. Hidden complexity risks

- **Sequencing intent hidden in step settings** instead of traceable planning vocabulary.
- **Sequencing inferred from “delivery context”** without a clear, auditable mapping to progression or interaction.
- **Assessment-driven sequencing expansion** (every assessment rule becomes a global flow rule).
- **Renderer concerns leaking into planning semantics** (e.g. treating section order as “the pedagogy”).
- **Workflow topology becoming user-facing** (learners or authors asked to reason about steps rather than **learner-facing pages**).

### 6. Boundary clarification

- **Pedagogic sequencing** (what should happen in what **educational** order, at coarse or structure-aware level) belongs **before or around synthesis**, so synthesis can emit a **coherent** **compact workflow** with **artefact chaining**.
- **Rendering order** (how assembled HTML presents blocks) belongs to **renderer**-stage concerns and must not silently stand in for pedagogic intent.
- **Fine-grained navigation behaviour** (micro-interactions, deep navigation UX) is **out of Sprint 08 scope** as a planning deliverable unless explicitly rescoped.
- **Sequencing refinement** may legitimately occur in **post-synthesis configuration** only when **structure-dependent** (e.g. branch points after scaffold exists)—still **not** a licence to rescue missing coarse intent with late chrome.

### 7. Open questions

- Should **sequencing** ever become **explicit** in **compact workflows**, or should explicitness remain the exception?
- How much **sequencing control** is **pedagogically useful** vs **harmful** to compactness?
- Should **learner interaction / progression mode** **replace** **delivery context** terminology, or coexist during a transition—**documentation and compatibility first**?
- What **sequencing assumptions** should **remain inferred** by default (and documented as such)?
- How should **assessment-linked progression** be **represented** without **expanding workflow complexity** for typical runs?

**Backlog candidates** for sequencing and interaction work remain in **Backlog candidates, not decisions** below—this note does **not** add approved scope.

## Backlog candidates, not decisions

The following are **backlog candidates only**. They are **not** approved implementation, **not** committed scope, and **not** Sprint 08 sign-off to build.

- **Possible terminology rationalisation** for “desired outputs” toward **page composition** vocabulary for the **learner-facing page** (copy + docs first).
- **Possible delivery-context reframing** toward **learner interaction / progression mode** (compatibility and save-format audit required before any UI change).
- **Audit of step settings** for **hidden pedagogic planning state** vs legitimate **local step tuning** (likely multi-session; high coupling).
- **Assessment trigger / configuration refinement** (when to infer, when to elicit, defaults)—design sprint candidate after tables are stable; **superseded in part by** the **Assessment-planning trigger / configuration note** in this doc (still **not** approved work).
- **Lightweight sequencing semantics clarification** (documentation and generator prompts—not granular user sequencing controls by default); **superseded in part by** the **Sequencing and learner-interaction modelling note** in this doc (still **not** approved work).
- **Possible page profile vocabulary exploration** (learner-first default vs facilitator overlay)—keep aligned with page assembly model.

---

## Success criteria

Sprint 08 succeeds if:

- The **planning model** is mapped clearly enough to support **narrow**, review-led implementation later.
- **Legacy field semantics** are identified and traced (no silent redefinition).
- **Assessment planning** and **sequencing semantics** as **conditional complexity** are **explicitly accounted for** in the classification and boundary notes—not treated as default heavyweight requirements.
- **No stable Sprint 07 behaviours** are destabilised on paper—implementation remains explicitly bounded when it starts.
- **Implementation** stays **bounded and review-led** (tables and backlog first; code only when a follow-on sprint scopes it).

## Sprint 08 closure summary

Sprint 08 is **closed** as a **completed planning / documentation sprint**. The following artefacts were delivered and consolidated in this document:

- **Current field and factor audit** (traceability table).
- **Planning-factor classification** (lifecycle mapping and risk posture).
- **Pre-synthesis vs post-synthesis elicitation boundary** clarification.
- **Assessment-planning trigger / configuration note** (assessment planning semantics, minimal pre-synthesis set, risks, open questions).
- **Sequencing and learner-interaction modelling note** (sequencing semantics, **learner interaction / progression mode**, risks, open questions).
- **Terminology rationalisation** and **consolidation pass** across sections (aligned **learner-facing page**, **page composition**, lifecycle vocabulary, **renderer** boundary).
- **Backlog separation** — **Backlog candidates, not decisions** remains the only home for speculative work; nothing in Sprint 08 is treated as approved build scope.
- **Continuity alignment** — development **current-state**, session **handover**, and portable Sprint 08 snapshots updated to record closure and next focus (**documentation-only** updates).

**Explicit closure statements:**

- Sprint 08 remained **documentation-first**; it produced **planning foundations only**.
- **No** source, runtime, domain-pack **content**, **renderer**, or **generation behaviour** changes were made under this sprint.
- **Sprint 07 stable behaviours** were **intentionally preserved on paper**: **compact workflows**, **artefact chaining**, **learner-facing coherence**, **lightweight elicitation**, **emergent pedagogic sequencing behaviour**.

## Potential follow-on implementation candidates (not approved)

The table below lists **possible** future work for a **separately chartered**, **review-led** implementation sprint. Items are **candidates** and **exploratory** only—**not** approved implementation, **not** Sprint 08 sign-off, **not** automatic backlog commitment.

| Candidate | Problem addressed | Estimated risk | Likely scope boundary | Notes |
|-----------|--------------------|----------------|----------------------|--------|
| **Workflow Factory terminology alignment pass** | Drift between UI labels and **page composition** / **learner-facing page** planning vocabulary | **Medium** | Copy, field labels, export/import strings; compatibility review if labels bind to saves | **Exploratory**; may stay docs-only until a sprint picks one surface |
| **Desired outputs → page composition semantics alignment** | Legacy “desired outputs” framing vs **learner-facing page** composition intent | **Medium–high** | Workflow Factory + saved bundle semantics audit before behaviour change | **Future scoped**; semantics-first |
| **Delivery context → learner interaction / progression terminology pass** | Venue-style **delivery context** vs **learner interaction / progression mode** | **Medium–high** | Terminology + save-format / elicitation compatibility | **Candidate** only; no rename without audit |
| **Hidden planning-state audit in step settings** | Planning residue vs legitimate **local step tuning** in step chrome | **High** | Read paths, step settings inventory, traceability to planning lifecycle | Multi-session **exploration** likely |
| **Assessment-trigger refinement** | When to infer vs elicit **assessment planning** inputs; defaults | **High** | Elicitation flow, optional narrow UI—bounded by Sprint 08 notes | Superseded **in part** by assessment note in this doc; still **not** approved |
| **Lightweight sequencing semantics surfacing** | Making **sequencing semantics** auditable without a sequencing product | **High** | Docs, prompts, **lightweight elicitation** posture—avoid flow authoring | Superseded **in part** by sequencing note; still **not** approved |
| **Brief-field restructuring exploration** | Target brief shape vs today’s fields (planning-only target model) | **Medium–high** | Design spike / doc prototype; no schema commitment | **Exploration**; charter must bound blast radius |

## Recommended Sprint 09 direction

A **future Sprint 09** (or similarly named follow-on) should be:

- **Tightly scoped** — one primary theme (e.g. terminology pass **or** step-settings audit **or** a single Factory semantics slice), not “all of Sprint 08 at once.”
- **Review-led** — explicit review of blast radius, save-format impact, and UX before code.
- **Implementation-bounded** — charter names what is in and out (no silent **generator rewrite**, **domain-pack rewrite**, **renderer redesign**, **execution-engine redesign**, or **major `app.js` restructuring** unless explicitly reopened).
- **Semantics-first** — align behaviour and copy to the planning model in this doc; preserve Sprint 07 stable strengths: **compact workflows**, **artefact chaining**, **learner-facing coherence**, **lightweight elicitation**, **emergent pedagogic sequencing behaviour**.

**Sprint 08 does not approve any implementation automatically.** Choosing a row from **Potential follow-on implementation candidates** requires a **new** sprint charter and review; this document remains a **planning foundation** only.

## Related references

- `docs/consolidation/sprint-07-workflow-generation-rationalisation-review.md`
- `docs/workflow/workflow-spec.md`
- `docs/workflow/workflow-authoring.md`
- `docs/workflow/pattern-library.md`
- `docs/workflow/workflow-generation-template.md`
- `domains/domain-manifest.json` and `domains/learning-design/`

## Review log

- **2026-05-12** — Documentation-only planning artefacts added to this doc: **Current field and factor audit** table, **Planning-factor classification** table, **Pre-synthesis vs post-synthesis elicitation boundary** note, and **Backlog candidates, not decisions** list. No source, runtime, renderer, generation, or domain-pack **content** changes.
- **2026-05-12** — Added **Assessment-planning trigger / configuration note** (purpose, assessment lifecycle classification table, minimal pre-synthesis assessment set, compactness principle, hidden planning-state risks, open questions). Documentation-only planning artefact; **not** approved implementation.
- **2026-05-12** — Added **Sequencing and learner-interaction modelling note** (core positioning, delivery context vs interaction, sequencing lifecycle classification table, compactness principle, hidden complexity risks, boundary clarification, open questions). Documentation-only planning artefact; **not** approved implementation; no generator or workflow-engine redesign implied.
- **2026-05-12** — **Consolidation / rationalisation pass:** terminology (**learner-facing page**, **page composition**, **learner interaction / progression mode**, **sequencing semantics**, **assessment planning**, **local step tuning**, **post-synthesis configuration**, **compact workflows**, **lightweight elicitation**), full lifecycle stage names in tables/notes, backlog-vs-decision wording, Sprint 07 stable-behaviour preservation, **conditional complexity** phrasing for assessment/sequencing, **renderer**-boundary emphasis, and **non-goal** boundary reminder. Documentation only; no new implementation scope or backlog items.
- **2026-05-12** — **Sprint 08 closure:** planning and consolidation **complete**; added **Sprint 08 closure summary**, **Potential follow-on implementation candidates (not approved)** table, and **Recommended Sprint 09 direction**. Implementation candidates **extracted for future chartering only**—**no implementation approved**, **no** runtime, domain-pack **content**, **renderer**, or **generation behaviour** changes. Continuity: `docs/development/current-state.md`, `docs/development/session-handovers/2026-05-12-session-handover.md`, portable Sprint 08 `CURRENT-STATE.md`, `HANDOVER.md`, `SPRINT-CONTEXT.md`, and `context-files/` copies refreshed (**documentation only**).
