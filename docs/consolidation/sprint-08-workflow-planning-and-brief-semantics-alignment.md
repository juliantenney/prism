# Sprint 08 — Workflow Planning and Brief Semantics Alignment

**Working title:** Sprint 08 — Workflow Planning and Brief Semantics Alignment

## Purpose

Sprint 08 **translates Sprint 07 review findings** into a **bounded implementation-planning sprint**: align **workflow brief**, **elicitation model**, and **planning semantics** with the clarified **learner-facing page** mental model—**without** assuming a generator rewrite in this sprint.

The clarified mental model (from Sprint 07 documentation):

- **PRISM LD generation** primarily produces **student-facing HTML learning pages**.
- **Workflows** are **orchestration infrastructure** for pedagogic synthesis—not the learner’s primary artefact.
- **Common page composition** is **Orientation + Learning Activities + Assessment** (with valid variants documented in Sprint 07).
- **Assessment** and **sequencing** are the main **conditional complexity** areas.
- **Renderer work** remains **out of scope** for Sprint 08 unless explicitly rescoped.

## Context

**Sprint 07** (`docs/consolidation/sprint-07-workflow-generation-rationalisation-review.md`) established that:

- **Core workflow generation** is **substantially coherent** and aligns strongly with learner-facing synthesis.
- **Likely stable:** compact workflows, artefact chaining, learner-facing coherence, lightweight elicitation, emergent pedagogic sequencing behaviour.
- **Likely unstable / needs realignment:** brief semantics, **desired-output** framing, **delivery-context** framing, **factor timing**, hidden **planning state** in steps, UX terminology, workflow abstraction leakage into UX.

Sprint 08 **does not re-litigate** the full generation review; it **maps** those conclusions onto **brief fields**, **elicitation boundaries**, and **planning-factor ownership**.

## Scope

Review and **prepare an implementation plan** (documentation + tables + backlog separation) for:

1. **Workflow brief field semantics** — what each field means today vs what it should mean under the page-composition model.
2. **Desired outputs → page composition framing** — conceptual migration path (not necessarily immediate UI rename).
3. **Delivery context → learner interaction / sequencing framing** — how legacy labels relate to interaction mode and sequencing vocabulary.
4. **Pre-synthesis elicitation boundaries** — which factors must be resolved before synthesis.
5. **Post-synthesis workflow-aware configuration boundaries** — which factors legitimately depend on generated structure.
6. **Assessment-planning surfacing** — triggers, defaults, and user-visible vs inferred behaviour.
7. **Sequencing / interaction-mode planning semantics** — lightweight steering vs implicit defaults (no granular sequencing product in Sprint 08 unless rescoped).
8. **Step settings vs planning state** — which settings remain **local tuning** vs unresolved **pedagogic planning** that should move earlier.

## Non-goals

- No **generator rewrite**.
- No **domain-pack rewrite** (content or structure overhaul).
- No **renderer redesign** or generated-page rendering behaviour change **in this sprint** unless explicitly rescoped.
- No **execution-engine redesign**.
- No **major `app.js` restructuring**.
- No **broad feature expansion** disguised as “alignment.”

## Deliverables

1. **Current brief-field audit table** — inventory of factory/brief fields and how they bind to generation today.
2. **Proposed planning-factor classification table** — map factors to default / brief / pre-synthesis / post-synthesis / local tuning / renderer (documentation-only classification).
3. **Proposed future brief semantics model** — narrative + optional diagram/table of the target brief shape (not a commitment to exact fields until reviewed).
4. **Pre-synthesis vs post-synthesis elicitation boundary note** — explicit rules-of-thumb and open questions carried from Sprint 07.
5. **Assessment-planning trigger / configuration note** — what must be inferred vs elicited vs post-synthesis.
6. **Sequencing and learner-interaction modelling note** — relationship to page assembly; preserve compactness per Sprint 07 caution.
7. **Implementation backlog candidates** — **separated** from **decisions** (no accidental “approved build” language).
8. **Optional scoped implementation proposal** — for a **later** pass only, with explicit risk and blast-radius notes.

## First task

Build a **“current field and factor audit”** table with columns:

| Column | Description |
|--------|-------------|
| **Current field/factor** | Name as seen in UI, prompts, or code today |
| **Current location** | e.g. brief form, elicitation transcript, step row, domain pack, generator prompt |
| **Current meaning** | Short plain-language description |
| **Issue identified in Sprint 07** | Link to review finding (legacy framing, timing, leakage, etc.) |
| **Proposed future framing** | Under page-composition + planning lifecycle vocabulary |
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

## Success criteria

Sprint 08 succeeds if:

- The **planning model** is mapped clearly enough to support **narrow**, review-led implementation later.
- **Legacy field semantics** are identified and traced (no silent redefinition).
- **Assessment** and **sequencing** complexity are **explicitly accounted for** in the classification and boundary notes.
- **No stable Sprint 07 behaviours** are destabilised on paper—implementation remains explicitly bounded when it starts.
- **Implementation** stays **bounded and review-led** (tables and backlog first; code only when a follow-on sprint scopes it).

## Related references

- `docs/consolidation/sprint-07-workflow-generation-rationalisation-review.md`
- `docs/workflow/workflow-spec.md`
- `docs/workflow/workflow-authoring.md`
- `docs/workflow/pattern-library.md`
- `docs/workflow/workflow-generation-template.md`
- `domains/domain-manifest.json` and `domains/learning-design/`

## Review log

- *(Add dated entries as Sprint 08 planning and audit artefacts land.)*
