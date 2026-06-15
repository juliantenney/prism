# Current Educational Theory — PRISM (Post Sprint 43)

**Date:** 2026-06-15  
**Type:** Educational model emerged from Sprints 40–43 and Sprint 44-2 consolidation  
**Scope:** Theory only — no implementation, no prompts, no code

---

PRISM’s current educational theory describes how self-directed higher-education learning resources should be **owned**, **experienced**, **manifested**, and **instructionally realised**. It is the lens Sprint 44 applies to material quality work.

---

## Ownership Model

### Primary owner: Investigation

The **governing inquiry** organises the learner experience. The resource answers a disciplinary question through an arc:

**Question → Explanation → Investigation → Judgement → Reflection**

Activities are **phases within** that investigation — not the definition of what the resource is. A reviewer should state the governing question and arc without inferring them only from activity titles.

### Secondary owner: Resource

The learner experiences a **coherent self-study resource** — continuous teaching voice, orientation, explanation, conceptual development, and synthesis — while the investigation unfolds. The resource supplies **Explanation** in the arc. Activities remain essential embedded moments; the resource provides the frame.

### Supporting structures (non-owning)

| Structure | Role |
| --------- | ---- |
| **Activities** | Operationalise beats; carry learner tasks and expected evidence |
| **Materials** | Perform instructional moves (exposition, modelling, verification, closure) within activities |
| **Capability** | Trace what the learner can do across the resource (outcomes, progression, fade) |
| **Judgement** | Develop evaluative capacity — criteria, evidence weighing, decision-making |
| **PEL** | Personal epistemic learning — confidence, uncertainty, self-monitoring, reflection |

Supporting structures are **essential** but **subordinate** to investigation-and-resource ownership.

### Prioritised hybrid

PRISM rejects equal co-ownership among activity, material, and inquiry layers. It accepts a **prioritised hybrid**: Investigation primary, Resource secondary. Unprioritised hybrid reproduces activity-led pages with all ingredients present and no owner.

---

## Salience Model

### Definitions

- **Presence** — signal exists in upstream JSON, fields, prompts, or material rows
- **Salience** — learner or reviewer encounters signal as **organising** the resource on a normal read

### Theory statement

PRISM generates high **presence** and variable **salience**. Educational quality failures often occur at the boundary between **what exists** and **what the learner experiences as authoritative**.

Salience depends on:

1. Which layer owns first impression and section logic
2. Whether inquiry language is structural or wrapper-only
3. Whether materials perform instructional moves or merely occupy slots
4. Whether metacognitive cues are journey-level or buried in activity blocks

### Sprint 44 refinement

Salience theory remains valid for pipeline manifestation. Sprint 44 adds **instructional depth**: even when architecture is right, materials may **fail their educational function** — a distinct failure mode from salience alone.

---

## Manifestation Model

### Pipeline manifestation (current)

Design Page assembles preserved activities and materials into:

Overview → Learning Outcomes → Learning Activities → Activity 1…N

Design Page behaves as a **faithful assembler** — high fidelity to DLA/GAM, not yet a strong educational author of inquiry-first structure.

### Prototype manifestation (accepted direction)

**Two-column model** for learner-facing prototypes:

| Column | Function |
| ------ | -------- |
| **Left — journey compass** | Lightweight signposting: inquiry orientation, phase focus, progress, judgement cues, reflection/transfer readiness. Not a second lesson. |
| **Right — disciplinary resource** | Full teaching substance: exposition, worked examples, activities, tables, tasks, checklists, closure scaffolds |

**Principle:** Guidance lives **beside** the resource, **not instead of** it.

Marx Resource Prototype validated this direction educationally (8–9/10 blind review). It is **manifestation theory**, not current pipeline output.

---

## Investigation Model

An investigation is a **governing question** pursued through evidence, mechanism, comparison, and judgement — not a list of activities about a topic.

### Beats (typical arc)

1. **Orient** — why the question matters
2. **Explain** — concepts and frameworks needed
3. **Investigate** — apply, analyse, compare using cases and data
4. **Judge** — evaluate alternatives with explicit criteria
5. **Reflect / transfer** — what changed; apply to own context

### Episode plans and DLA

Upstream episode plans supply authoritative instructional-function beats. DLA **populates obligations** per beat — it does not replan the arc. Activities inherit archetype and beat order from episode plans.

### Investigation vs activity framing

| Investigation framing | Activity framing (legacy pipeline feel) |
| --------------------- | --------------------------------------- |
| “Where are we in answering X?” | “Complete Activity 3” |
| Phase of one inquiry | Discrete workbook unit |
| Criteria-led judgement as arc culmination | Judgement as final task only |

---

## Resource Model

A PRISM self-study **resource** is a solo-learner text that **teaches while tasking** — exposition before demand, modelling before independent practice, verification before progression, closure without spoiling learner production.

### Genre discriminator

Self-study workbook (target genre) requires:

- Enough **exposition** for solo understanding
- **Practice arc** with fading support
- **Verification** points tied to criteria
- **Closure** with summarised takeaways and integrative output where required

Not sufficient: activity sheet (tasks only), reference notes (lookup only), table-only session.

### Resource voice qualities (target)

- Connects ideas in prose — not only definitions in grids
- Step → meaning pairs in modelled work
- Tutorial framing — why this matters now
- Criteria before judgement
- Scaffold ≠ learner deliverable

---

## Instructional Depth Model

### Core premise

Learner-facing materials are **instructional moves**, not containers. Each material type performs one educational function. Success is judged by **learner cognitive effect**, not label presence.

### Material types (eleven)

`text` · `worked_example` · `modelling_note` · `misconception_note` · `sample_output` · `decision_table` · `checklist` · `transfer_prompt` · `consolidation_summary` · `rubric` · `quality_criteria`

### Cross-cutting depth principles

| Principle | Meaning |
| --------- | ------- |
| Function before format | Label present ≠ move performed |
| One move per material | No collapse of exposition + closure + criteria into one block |
| Scaffold ≠ deliverable | Support must not complete learner-assigned output |
| Procedure linked to meaning | Steps state conceptual significance |
| Fading arc | Modelled → partial → independent |
| Learner-check retrieval | Checklist verifies criteria, not feelings only |
| Own-context transfer | Learner’s setting, not third-person only |
| Criteria before judgement | Rubric before rank/compare |

### Realisation levels

| Level | Meaning |
| ----- | ------- |
| **Failed** | Slot present; function not performed or actively undermined |
| **Minimum** | Function performed at educational threshold |
| **Strong** | Disciplinary precision, fading respect, clear learner agency |

### Contract status

Sprint 44-2 Draft 1 consolidates implicit system intent into explicit educational standards. Contracts are **normative** — they do not claim current generators consistently satisfy them.

---

## Visual Affordance Model

Visuals (diagrams, charts, annotated figures) are **adjunct supports** selected through a **separate workflow** using page artefact visual affordances — defer/render decisions tied to whether textual materials already suffice (e.g. worked_example_sufficient_first).

Visual affordances are **not** part of instructional-depth material contracts in Sprint 44. Textual material quality and visual enrichment are parallel tracks.

---

## Current Assumptions

A fresh chat should adopt these unless the user explicitly rescopes:

1. **Self-directed higher education** is the primary delivery context for this theory.
2. **Investigation-primary / resource-secondary** ownership is correct for target resources.
3. **Upstream pedagogy is present** — default quality work is realisation and capture safety, not new workflow stages.
4. **Presence ≠ salience** — improving materials and capture does not automatically fix pipeline manifestation; manifestation work is deferred unless rescoped.
5. **Two-column model** is accepted prototype direction, not implemented pipeline behaviour.
6. **Marx + Photosynthesis** are the evaluation pair for material depth.
7. **44-2 contracts** are the educational reference for “what good looks like” per material type.
8. **44-1 gate** addresses structural/coverage capture failure only — not full educational depth enforcement.
9. **Visuals** are out of scope for Sprint 44 instructional-depth slices.
10. **Fidelity contracts** (GAM preservation, activity membership, table fidelity) remain valuable — depth work must not be framed as weakening them unless explicitly rescoped.

---

## Theory Summary (One Paragraph)

PRISM resources should read as **one investigation** taught by a **coherent self-study voice**, with activities and materials as supporting moves. Learners should encounter inquiry and teaching as salient — and each material should perform its instructional function at minimum depth. Pipeline output today is activity-led with high upstream presence; prototype manifestation and explicit depth contracts describe where quality work is headed without claiming it is already implemented.
