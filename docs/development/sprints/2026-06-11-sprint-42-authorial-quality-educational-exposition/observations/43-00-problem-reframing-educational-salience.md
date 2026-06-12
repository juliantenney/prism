# 43-00 — Educational Salience Problem Reframing

**Date:** 2026-06-11  
**Type:** Problem definition for Sprint 43 — analysis and framing only  
**Evidence base:** Sprint 42 closure ([42-13 synthesis](42-13-sprint-synthesis-authorial-quality-findings.md), [42-11A](42-11A-design-page-static-provenance-audit.md), [42-12](42-12-pel-manifestation-audit.md), [42-10](../sprint-42-slice-10-source-ingest-learning-content-parity.md), Marx manual workflow review)

**Does not propose:** solutions, implementation, prompt changes, schema changes, renderer changes, or workflow redesign.

---

## Purpose

Sprint 42 investigated **Authorial Quality / Educational Exposition** expecting that learner-facing pages felt assembled because something important was missing upstream — exposition, journey, judgement, metacognition, or pipeline completeness.

That investigation **did not confirm** a missing-ingredients diagnosis. It confirmed that PRISM already generates substantial educational structure across multiple artefacts, while the **final learner experience** often under-represents that structure.

Sprint 43 must therefore solve a **different problem** than Sprint 42 initially framed. This document defines that problem: **educational salience** — how visible and authoritative existing educational structure is in the learner-facing resource.

Sprint 42 is closed. Sprint 43 opens on decision and validation, not on adding more educational architecture.

---

## What Sprint 42 expected to find

Sprint 42 began from learner-experience symptoms and upstream hypotheses:

| Initial assumption | What it implied |
| ------------------ | --------------- |
| **Missing exposition** | Pages read thin because DLA/GAM do not teach enough |
| **Missing learner journey** | No coherent progression across the resource |
| **Missing judgement** | Evaluation and decision-making not designed in |
| **Missing metacognition** | PEL/EQF intentions not reaching outputs |
| **Missing educational structure** | A workflow stage, spine, or parity gap blocks authored resources |

The working read was: **Activity → Activity → Activity** because something upstream failed to supply **Question → Explanation → Investigation → Judgement → Reflection**.

Sprint 41 had already integrated EQF, PEL contracts, mandatory DLA framing, and Design Page preservation. Sprint 42 asked whether more **ingredients** or better **expression** was needed.

---

## What Sprint 42 actually found

Evidence from static audits, implementation (42-10), and the Marx manual self-study run (“Was Marx Right?”) converges:

| Signal | Finding |
| ------ | ------- |
| **Inquiry** | Survives — strong in `learning_content`; carried through DLA activity progression |
| **Exposition** | Survives — preambles, GAM concept explanations, worked examples, tables, perspectives |
| **Judgement** | Survives — evaluation tasks, decision frameworks, consolidation materials, outcome progression |
| **Transfer** | Survives — transfer/application tasks, episode-plan beats, GAM closure patterns |
| **PEL** | Survives upstream — DLA/GAM prompts and fields; **weakly protected** at Design Page (42-12 Verdict B) |
| **Source-ingest parity** | Achieved — Normalize → Generate Learning Content → `learning_content` → Model Knowledge (42-10) |
| **`learning_content` availability** | Both topic-generated and source-ingest routes now produce LC before KM |

**What did not survive as the learner’s primary frame:** inquiry, progression, judgement arc, and metacognitive movement as **page-level narrative authority**. The rendered page remained **Overview → Learning Outcomes → Learning Activities → Activity 1…N** — a workbook shape even when upstream inquiry was strong.

**42-11A (static):** Verdict **A** — hard contracts centre Design Page on `learning_activities` + preserved `activity_materials`; LC influences wrappers only.

**42-13 (synthesis):** The remaining gap is **salience / authority**, not absence of educational structure.

---

## Core observation

> The workflow generates more educational structure than is immediately apparent from the learner experience.

Upstream artefacts can be educationally coherent while the final page reads as **assembled tasks**. Structure **exists** in JSON and prompts; structure does **not consistently own** what the learner notices first, follows through, or remembers as the resource’s purpose.

This is not a claim that every run is perfect upstream. It is a claim that **the dominant failure mode observed in Sprint 42 is downstream expression**, not upstream absence — especially on the Marx benchmark run.

---

## Problem shift

| From (Sprint 42 opening frame) | To (Sprint 43 frame) |
| ------------------------------ | -------------------- |
| How do we **generate** better educational structure? | How do we make **existing** educational structure more **visible and influential** in the learner experience? |
| Add exposition, journey, judgement, metacognition | Decide what should **own** the learner-facing page |
| Fix missing pipeline ingredients | Fix **composition salience** at Design Page boundary |
| More pedagogy in prompts | Clearer **narrative authority** without weakening fidelity |

Sprint 43 is about **learner-visible educational architecture** — not about discovering whether the architecture exists upstream.

---

## Educational salience

**Educational salience** (for PRISM): the degree to which learners **encounter, recognise, and experience** the educational structures already present within generated resources.

Salience is distinct from **presence** in artefacts. A governing question may exist in `learning_content` and reappear inside activity preambles yet fail to organise how the learner reads the page. A `self_explanation_prompt` may be preserved on an activity row yet be buried below tables and checklists.

### Dimensions of educational salience

| Dimension | What the learner should encounter | Sprint 42 evidence |
| --------- | --------------------------------- | ---------------- |
| **Inquiry salience** | The governing question and investigation arc are obvious before and throughout activities | Strong in LC and DLA upstream; **subordinate** on rendered page |
| **Judgement salience** | Evaluation and decision-making develop across the resource, not only inside isolated tasks | Present in materials and final activities; **activity-local** rather than resource-closing |
| **Progression salience** | Capability growth is recognisable — what was learned earlier enables what comes next | LO, EP, LS, DLA progression exist; learner sees **outcome list + activity sequence** more than arc |
| **Metacognitive salience** | Self-monitoring, uncertainty, and reflection cues are meaningful and noticeable | PEL fields and lightweight EQF exist; **buried** in activity/material layout (42-12) |
| **Independence salience** | Scaffold fades; learner agency and self-direction increase toward transfer | Rhetoric and GAM patterns upstream; **weak page-level** signalling of growing independence |

Low salience does not mean absent content. It means the learner’s **primary reading path** does not foreground the educational intent PRISM already encoded.

---

## Narrative authority

**Narrative authority** is which artefact or layer **owns** the learner’s structural and rhetorical experience of the resource — what organises sections, sets expectations, and frames what “this page is for.”

### Authority types in current PRISM

| Authority | What it controls today | Sprint 42 assessment |
| --------- | ---------------------- | -------------------- |
| **Activity authority** | Page section tree, activity membership, repair path, row order | **Dominant** — hard ACTIVITY MEMBERSHIP, DLA repair (42-11A) |
| **Material authority** | Verbatim bodies inside activity rows; visual weight at render | **Dominant** — GAM preserve, PREC-02 precedence over wrapper thinning |
| **Inquiry authority** | Governing question, theory–evidence–judgement arc | **Present upstream** (`learning_content`); **no hard page mapping**; wrapper assimilation only |
| **Page-level authority** | Overview, learning_purpose, knowledge_summary, study_tips as integrating narrative | **Soft** — prompt-guided; subordinate to materials fidelity; no repair from LC/KM |

### Structure existing vs structure owning the experience

| | Structure **existing** | Structure **owning** the learner experience |
| --- | ---------------------- | --------------------------------------------- |
| **Meaning** | Present in upstream JSON, fields, or wrapper prose | Organises what the learner reads first, how sections relate, and what the resource “is” |
| **Inquiry** | LC sections and DLA progression encode Question → … → Judgement | Learner opens the page and **knows the investigation** before the activity list |
| **Activities** | Correct sequence, strong tasks and materials | Activities **serve** the investigation rather than **define** the page |
| **PEL** | Cognition fields on rows; materials self-checks | Learner experiences **sustained** self-monitoring across the resource |
| **Sprint 42 Marx run** | All of the above **existing** | Activity stack **owning** rendered structure |

Design Page today behaves as a **faithful assembler** under **activity + material authority**, not as a **resource author** under **inquiry + page-level authority**.

---

## Current evidence

Primary example: **Marx manual self-study run** (“Was Marx Right?”), supported by static audits. Visibility ratings describe **learner-facing salience**, not upstream quality.

### learning_content

| Present | Visibility downstream |
| ------- | --------------------- |
| Inquiry spine: Question → Theory → Predictions → Historical/contemporary evaluation → Debate → Judgement; governing inquiry; sections and key concepts | **Low structural authority** — no LC.sections → page.sections mapping; assimilated into overview/knowledge_summary when bound; does not own section tree (42-11A) |

### knowledge_model

| Present | Visibility downstream |
| ------- | --------------------- |
| Conceptual spine: concepts, relationships, processes, misconceptions | **Low–medium** — may inform `knowledge_summary` wrapper; no repair path; subordinate to activity materials |

### learning_outcomes

| Present | Visibility downstream |
| ------- | --------------------- |
| Capability progression: understanding → causal explanation → comparison → evaluation | **Medium** — renders as `learning_purpose` / outcome list; progression readable as bullets, less as narrative arc |

### episode_plans

| Present | Visibility downstream |
| ------- | --------------------- |
| Instructional beats: explanation → worked thinking → guided practice/transfer → verification | **Low on page** — not Design Page input; influence DLA via population only; beat structure not learner-visible as its own spine |

### learning_activities

| Present | Visibility downstream |
| ------- | --------------------- |
| Operational journey through core ideas → mechanism → predictions → comparison → final judgement; framing and cognition fields | **High structural visibility** — owns `learning_activities` section; hard membership and repair; inquiry **inside** activity sequence |

### activity_materials

| Present | Visibility downstream |
| ------- | --------------------- |
| Concept explanations, worked examples, tables, checklists, perspectives, decision framework, transfer and consolidation | **High visual salience** — verbatim preserve inside rows; often dominates scan path over wrappers and PEL fields |

### Design Page

| Present | Visibility downstream |
| ------- | --------------------- |
| Faithful assembly: all activities, preserved materials, copied framing fields; wrapper modules (journey, authorial, rhetoric, EQF) | **Activity-led composition** — inquiry and PEL **present but subordinate**; assembler role confirmed (42-11A, 42-13) |

### Rendered learner page

| Present | Visibility downstream |
| ------- | --------------------- |
| Inquiry, judgement, exposition, and PEL cues **within** activities and materials | **Activity-led experience** — Overview → LO → Activities 1…5; reads as workbook; governing investigation not the primary organising frame |

---

## Questions for Sprint 43

Strategic questions only — **not answered here**.

### Organising unit and structure

- What should be the **primary organising unit** of a learner page — activity, investigation phase, concept arc, or something else?
- Should **inquiry own page structure**, or remain wrapper-level enrichment?
- Should **activities serve investigations** rather than define them?
- Should `learning_content` become an **explicit page-level spine** with structural authority, or remain assimilated into wrappers?
- How should `episode_plans` and `learning_sequence` contribute to **learner-visible progression** without new workflow stages?

### Salience dimensions

- What level of **inquiry salience** is sufficient — named in overview only, or sustained across every section transition?
- How should **judgement development** be recognisable across the resource, not only in the final activity?
- What does **progression salience** look like when LO bullets and activity titles already exist but do not read as an arc?
- How should **PEL become learner-visible** without heavy reflective workload or diary tone?
- What constitutes **sufficient educational salience** for self-study vs facilitated delivery?

### Authority and composition

- How should **narrative authority** be distributed between inquiry, activities, and materials without weakening preservation contracts?
- What is the right relationship between **wrapper prose** and **preserved materials** when PREC-02 favours materials fidelity?
- Should metacognition be **page-level**, **activity-embedded**, or **both** — and how would we know which is working?
- How do we validate salience — manual read, evaluator thresholds, learner-facing benchmarks, or comparative A/B on compose guidance?

### Scope boundaries

- What can change within **prompt-only compose guidance** vs what would implicitly require schema or renderer decisions?
- Which benchmark workflows (Marx, inflation, climate) define success for Sprint 43?

---

## Success criteria for Sprint 43

Observable outcomes only — **not solutions**. Sprint 43 should be able to judge success against criteria like:

| Criterion | Observable indicator |
| --------- | --------------------- |
| **Inquiry trajectory** | A reviewer can state the governing question and investigation arc **without inferring it only from activity titles** |
| **Progression recognition** | A reviewer can describe how capability builds across the resource — not only list learning outcomes |
| **Judgement development** | A reviewer can trace how evaluation deepens — beyond a single final judgement task |
| **Growing independence** | A reviewer can identify where scaffolding fades and learner agency increases |
| **Metacognitive meaningfulness** | PEL-related cues are **visible and purposeful** — not buried labels or generic reflection prompts |
| **Structural coherence** | The page reads as **one investigation with embedded activities**, not **a list of activities with shared topic** |
| **Fidelity preserved** | Activity membership, materials verbatim preservation, and DLA/GAM content depth remain intact on benchmark runs |

Success is defined on **rendered learner experience** and reviewer judgement, not on upstream artefact completeness alone.

**Confidence note:** Sprint 42 established the problem; Sprint 43 must **operationalise** these criteria on benchmark workflows before any implementation slice claims closure.

---

## Explicit non-goals

Sprint 43 problem framing **does not** currently target:

- New workflow stages
- Schema redesign
- Renderer replacement or structural renderer redesign
- Removing DLA or GAM from the pipeline
- Weakening preservation contracts (GAM verbatim merge, PREC-02, table fidelity, activity membership)
- Reopening Sprint 41 EQF/PEL architecture as the primary lever
- Adding more educational ingredients as the default hypothesis

Changes that touch compose guidance may still be in scope **later**, but only after the **decision** in the next section is made and success criteria are agreed.

---

## Decision required

Before implementation work begins, Sprint 43 must decide:

### What exact learner experience should Design Page be optimising for?

This is the **key decision** — not yet answered.

Examples of incompatible optimisations (for illustration only):

- **Workbook optimiser** — correct activities, strong materials, clear tasks; inquiry implied by sequence
- **Investigation optimiser** — governing question owns the page; activities are phases of one inquiry
- **Capability optimiser** — progression and independence are the primary reader frame
- **Judgement optimiser** — evaluation arc closes the resource; activities build evidential and decision capacity

Sprint 42 established that PRISM **can** supply ingredients for multiple optimisations. Sprint 43 must choose **which learner experience is primary** and define **educational salience** accordingly.

Until that decision is made, compose interventions risk improving local prose while leaving the **authority problem** unresolved.

---

## Related documents

| Document | Role |
| -------- | ---- |
| [42-13 Sprint synthesis](42-13-sprint-synthesis-authorial-quality-findings.md) | Sprint 42 closure findings |
| [42-11A Design Page provenance](42-11A-design-page-static-provenance-audit.md) | Static authority map |
| [42-12 PEL manifestation](42-12-pel-manifestation-audit.md) | Metacognitive salience evidence |
| [42-10 LC parity](../sprint-42-slice-10-source-ingest-learning-content-parity.md) | Route convergence |
| [handover-from-sprint-41.md](../handover-from-sprint-41.md) | Historical position through 42-10 |
| [README.md](../README.md) | Sprint 42 scope and constraints |
