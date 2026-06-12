# Sprint 43-02 — Ownership Model Decision

**Date:** 2026-06-12  
**Type:** Decision record only — no implementation, prompt, schema, renderer, or workflow changes  
**Prerequisite reading:** [`README.md`](README.md), [`handover-from-sprint-42.md`](handover-from-sprint-42.md), [43-00 problem reframing](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/43-00-problem-reframing-educational-salience.md), [`43-01-investigation-plan.md`](43-01-investigation-plan.md)

---

## Status

**Accepted**

---

## Purpose

Sprint 42 closed with a reframed diagnosis: PRISM generates substantial educational structure upstream, but the final learner page does not consistently **foreground** that structure as the learner's primary experience. The remaining gap is **educational salience** and **narrative authority**, not missing workflow stages or missing pedagogy.

Before any implementation discussion, Sprint 43 required an explicit answer to the question Sprint 42 left open:

> **What should own the learner experience?**

Without that decision, compose interventions risk improving local prose while leaving the **authority problem** unresolved (43-00). Slice 43-01 establishes how to **measure** salience; this document records **what salience is for** — which ownership model self-directed higher-education resources should optimise toward.

This is a decision record, not an implementation plan.

---

## Context

### Sprint 42 findings

Sprint 42 investigated Authorial Quality / Educational Exposition through static audits (42-11A, 42-12), implementation (42-10 source-ingest parity), and a **manual Marx self-study workflow run** ("Was Marx Right?") — the highest-confidence learner-experience evidence in the sprint (42-13, handover).

| Finding | Status | Evidence |
| ------- | ------ | -------- |
| Workflow stage not missing | **Disproved** | 42-8; GLC → KM on both routes after 42-10 |
| Source-ingest parity achieved | **Resolved** | 42-10: Normalize → GLC → `learning_content` → Model Knowledge |
| `learning_content` available on both routes | **Confirmed** | 42-10; topic-generated and source-ingest converge before KM |
| Inquiry survives | **Confirmed upstream** | Strong in LC and DLA progression on Marx run (42-13) |
| Exposition survives | **Largely confirmed** | GAM materials, preambles, exposition modules (42-1, 42-7) |
| Judgement survives | **Largely confirmed** | Evaluation tasks, decision frameworks, outcome progression (42-13) |
| Transfer survives | **Confirmed** | Transfer/application tasks, episode-plan beats, GAM closure (43-00) |
| PEL survives | **Confirmed upstream; weak downstream** | DLA/GAM prompts and fields; page-level weakness (42-12 Verdict B) |
| Final pages remain activity-led | **Confirmed** | Marx render; 42-11A Verdict A; 42-13 synthesis |

Sprint 42 disproved the **missing-ingredients hypothesis**. The Marx manual run is instructive: every major upstream artefact was educationally coherent; the rendered experience still **felt activity-led** — Overview → Learning Outcomes → Learning Activities → Activity 1…N (42-13).

### Presence vs salience

**Presence** — a signal exists in upstream JSON, fields, or prompts.

**Salience** — a learner or reviewer can **encounter, recognise, and experience** the signal as organising the resource on a normal read.

Sprint 42 established high **presence** and variable **salience**. Example: a governing question may exist in `learning_content` and reappear in activity preambles yet fail to organise how the learner reads the page (43-00). A `self_explanation_prompt` may be preserved on an activity row yet be buried below tables and checklists (42-12).

### Structure existing vs structure owning the experience

| | Structure **existing** | Structure **owning** the learner experience |
| --- | ---------------------- | --------------------------------------------- |
| **Meaning** | Present in upstream artefacts, fields, or wrapper prose | Organises what the learner reads first, how sections relate, and what the resource "is" |
| **Sprint 42 Marx run** | Inquiry, progression, judgement, PEL, exposition **present** across artefacts | Activity stack **owns** rendered structure; governing investigation not the primary organising frame |

The workflow generates more educational structure than is immediately apparent from the learner experience (43-00). The dominant failure mode observed in Sprint 42 is **downstream expression**, not upstream absence.

### The question this decision answers

Sprint 42 confirmed **what exists**. Sprint 43 must decide **what should own** the learner-facing page for self-directed higher-education resources — before implementation slices claim closure against success criteria in [`README.md`](README.md).

---

## Ownership models considered

The following models were evaluated during early Sprint 43 planning, grounded in Sprint 42 evidence (42-8, 42-11A, 42-13, 43-00) and the Marx manual run. Summaries only — not a full re-analysis.

### Activity-owned

**Definition:** The activity stack (`learning_activities` + preserved `activity_materials`) is the primary organising unit. The learner frame is "a sequence of learning activities to work through."

| Strengths | Weaknesses |
| --------- | ---------- |
| Matches current Design Page hard contracts (42-11A Verdict A) | Inquiry, judgement arc, and PEL tend to be **implied** rather than **owned** |
| Clear task boundaries; strong DLA/GAM fidelity on Marx run | First impression is "tasks about a topic," not "one educational journey" |
| Aligns with preservation architecture Sprint 40–42 established | Conflicts with Sprint 42 stated desirable experience (42-13) |

**Sprint 42 status:** Current default experience.

### Investigation-owned

**Definition:** The governing inquiry and its arc (question → theory → evidence → comparison → judgement → reflection) own the learner's structural and rhetorical frame. Activities are **phases of one investigation**.

| Strengths | Weaknesses |
| --------- | ---------- |
| Direct match to desired arc: Question → Explanation → Investigation → Judgement → Reflection (42-13) | Inquiry frame alone does not supply exposition voice (42-1) |
| Aligns with LC as intellectual/inquiry spine (42-8, handover) | Risk of wrapper-only inquiry when LC has no hard page mapping (42-11A) |
| Matches Marx upstream inquiry arc and DLA operational journey (42-13) | Judgement and PEL remain activity-local without explicit subordinate framing |

### Resource-owned

**Definition:** The resource reads as a **coherent self-study text** — continuous teaching narrative with activities embedded as practice within that text.

| Strengths | Weaknesses |
| --------- | ---------- |
| Matches LC as self-study chapter analogue (42-8) | Sprint 42 headline gap is inquiry **authority**, not missing narrative upstream |
| Handover desired inversion: Resource → activities embedded within investigation | Resource sections alone risk "preface to a workbook" (42-1) |
| Benchmark exemplar `marx-self-study-page.json` is resource-shaped (42-1, 42-8) | LO/KM alone supply checklist or conceptual lists, not full narrative arc |

### Capability-owned

**Definition:** Capability development and growing independence own the page. The learner frame is "you are building from foundational understanding toward evaluative independence."

| Strengths | Weaknesses |
| --------- | ---------- |
| LO progression exists on Marx run (42-13) | LO is **list spine, not narrative spine** (42-8) |
| Faded scaffolding in exemplar fixture is pedagogically sound (42-1) | Observed page expression is outcome list + activity sequence, not capability arc |
| Independence is a stated salience dimension (43-00) | Not the organising frame Sprint 42 named repeatedly (42-13) |

### Judgement-owned

**Definition:** The development of evaluative capacity — evidence weighing, criteria, decision-making — owns the resource frame.

| Strengths | Weaknesses |
| --------- | ---------- |
| Judgement survives upstream on Marx run (42-13) | Judgement materials are **activity-local** today (42-11A) |
| Natural for evaluation-heavy self-study topics | Can over-emphasise closure without investigation/resource voice |
| Aligns with judgement salience dimension (43-00) | Sprint 42 desired arc places Question and Investigation before Judgement as organising logic |

### Material-owned

**Definition:** Preserved instructional materials (tables, explanations, worked examples) dominate the learner's visual and rhetorical experience.

| Strengths | Weaknesses |
| --------- | ---------- |
| Delivers rich exposition; GAM quality confirmed on Marx run (42-7, 42-13) | **No integrative frame** — content-rich, structurally opaque |
| Protected by fidelity contracts | PEL and bridges buried below visual weight (42-12) |
| Strong scan-path salience | Not a designed ownership target — **perceptual consequence** of material authority (42-11A) |

**Sprint 42 status:** Accidental dominance within activity-owned pages, not desirable primary owner.

### Hybrid

**Definition:** Authority distributed across two or more owners (e.g. investigation + resource, investigation + capability).

| Strengths | Weaknesses |
| --------- | ---------- |
| Reflects Sprint 42 finding that educational structure is **distributed** across artefacts (42-13) | Without explicit **priority**, activity + material authority wins (42-11A) |
| Sprint 42 handover names a hybrid target: Resource → activities within investigation | Unprioritised hybrid reproduces Marx outcome: all ingredients, no owner |
| Resolves tension between multiple upstream spines (42-8) | Harder to validate without a primary frame for first-impression read (43-01) |

**Sprint 43 resolution:** Accept a **prioritised hybrid** — Investigation primary, Resource secondary — not equal co-ownership.

---

## Decision

### Primary owner

**Investigation**

**Definition:** The governing inquiry is the primary organising unit of the learner experience.

The learner should experience:

**Question → Explanation → Investigation → Judgement → Reflection**

Activities exist as **phases within the investigation**, not as the definition of what the resource is.

The governing question and investigation arc should be obvious **before and throughout** activities (inquiry salience, 43-00). A reviewer should be able to state the governing question and arc **without inferring it only from activity titles** (Sprint 43 success criteria, [`README.md`](README.md)).

### Secondary owner

**Resource**

**Definition:** The learner experiences a **coherent self-study resource** that teaches while the investigation unfolds.

The resource voice supports:

- orientation
- explanation
- conceptual development
- synthesis

without replacing activities.

Resource ownership supplies the **Explanation** step in the desired arc and the **authored voice** self-study requires — teach before task, because no live tutor repairs thin orientation (42-1). Activities remain essential embedded learning moments; the resource provides the continuous teaching frame within which they operate.

---

## Supporting structures

The following remain **essential** to PRISM's educational architecture. They are **not** primary page owners under this decision. Their role is to **serve** the investigation-and-resource frame.

### Capability

**Role:** Traceable progression of what the learner can do — understanding → explanation → comparison → evaluation on the Marx run (42-13).

**Upstream home:** `learning_outcomes`, episode-plan beats, `learning_sequence` transitions, faded scaffolding in DLA/GAM (42-8, 42-1).

**Subordinate framing:** Capability progression is what the investigation **develops**. It should be **salient** (progression and independence salience, 43-00) but does not define the page's primary organising logic. LO composes as outcome list today; under this decision, progression should read as **moves within the investigation**, not as a standalone checklist frame.

### Judgement

**Role:** Deepening evaluation across the resource — evidence weighing, criteria application, decision-making, reflective closure.

**Upstream home:** Evaluation tasks, GAM decision frameworks and perspectives, LO evaluation outcomes, final consolidation materials (42-13, 42-11A).

**Subordinate framing:** Judgement is a **movement of the investigation**, not an isolated final task. Sprint 42 confirmed judgement **survives** upstream but is often **activity-local** on the rendered page. Under this decision, judgement development should be traceable across the full resource while remaining embedded in activities and materials.

### PEL

**Role:** Metacognitive self-monitoring — confidence, uncertainty, progress awareness, decision reflection, independence (42-12, 43-00).

**Upstream home:** DLA cognition fields and preamble; GAM self-check and closure patterns; lightweight EQF metacognition at Design Page (42-12 Verdict B).

**Subordinate framing:** PEL should support **sustained** reasoning across the investigation, not appear only as buried row-level labels. PEL is a **supporting spine**, not the primary organising unit. Sprint 42 confirmed PEL is **implemented but weakly protected** at page level — a salience problem, not an absence problem.

### Activities

**Role:** Operational learning journey — the executable phases through which the learner pursues the investigation.

**Upstream home:** `learning_activities` (DLA) — strongest activity spine and current Design Page structural authority (42-8, 42-11A).

**Subordinate framing:** Activities **serve** the investigation rather than **define** the page. Sprint 42 disproved that DLA destroys inquiry: Marx DLA progressed core ideas → mechanism → predictions → comparison → judgement (42-13). Activity membership and framing preservation remain essential fidelity constraints; activity authority is **reclassified** from primary owner to **essential supporting structure** under this decision.

### Materials

**Role:** Instructional exposition inside activities — concept explanations, worked examples, tables, checklists, perspectives, decision frameworks, transfer and consolidation (42-13).

**Upstream home:** `activity_materials` (GAM) — strongest instructional/exposition spine; high visual salience at render (42-11A, 42-7).

**Subordinate framing:** Materials deliver exposition **within** investigation phases. GAM verbatim preservation and PREC-02 precedence remain non-negotiable (Sprint 42 constraints). Materials must not **accidentally** become the primary owner through visual dominance alone; they support the investigation under resource voice and activity phase structure.

---

## Why Activity-owned was not selected

Sprint 42 established that activity-owned is the **current** experience, not the **desired** experience.

**Activity authority already dominates.** 42-11A Verdict A: hard ACTIVITY MEMBERSHIP contract, DLA-only repair, GAM verbatim preserve, PREC-02 materials precedence over wrapper thinning. Design Page is structurally organised around `learning_activities` (42-13 narrative authority finding).

**Inquiry becomes subordinate.** On the Marx manual run, inquiry was strong in `learning_content` and carried through DLA progression, but had **low structural authority** on the final page — assimilated into wrappers when bound; no LC → page section mapping (handover, 42-11A). The inquiry **exists**; the activity stack **owns** what the learner notices first.

**Learner experience becomes workbook-shaped.** 42-13: even when inquiry is good, the page reads as a **workbook** — correct sequence, strong materials, activity-owned structure — rather than an **authored investigation** where activities are embedded inside a larger question. 42-1: the learner experiences **correct pedagogy in the wrong genre** — workbook engineering visible, textbook voice absent.

Selecting activity-owned would **accept the Sprint 42 gap** as the target state. Sprint 42 closed because that gap is the problem to solve, not the standard to preserve.

---

## Why Capability-owned was not selected

Sprint 42 confirmed capability progression is **important** and **present upstream**. It is not the **primary organising frame** for self-directed higher-education resources in the evidence base.

**Capability progression remains important.** Marx LO: understanding → causal explanation → comparison → evaluation (42-13). Faded scaffolding in the benchmark exemplar (modelled row → partial table → independent application) is **authored sequencing** worth preserving (42-1). Progression and independence are explicit salience dimensions in 43-00.

**LO functions as a progression spine upstream, not as a page owner.** 42-8: LO composes into `learning_purpose` as bullets — **checklist spine, not narrative spine**. On the Marx rendered page, progression appeared as **outcome list + activity sequence** more than arc (43-00 progression salience).

**Capability does not adequately express the desired investigation-led learner experience.** Sprint 42 repeatedly named the target as **Question → Explanation → Investigation → Judgement → Reflection** and **one investigation with embedded activities** (42-13, 43-00, handover) — not "outcome list → activities." Capability describes **what develops**; investigation describes **what the resource is**.

Capability-owned remains valuable as a **supporting salience dimension**, not as primary page owner.

---

## Why Investigation + Resource was selected

This decision uses only Sprint 42 and early Sprint 43 evidence. No implementation is implied.

### Alignment with `learning_content`

Sprint 42 named `learning_content` the strongest candidate for the **intellectual / inquiry spine** of a learner resource (handover, 42-8, 42-13). LC holds sectioned inquiry arcs and is the only upstream artefact that natively reads as a **continuous teaching narrative** rather than a task catalogue (42-8). Investigation-owned primary authority aligns with LC's upstream role; resource-owned secondary authority aligns with LC's exposition and chapter-like form.

### Alignment with the Marx manual run

The Marx run is Sprint 42's highest-confidence end-to-end evidence. Upstream: strong LC inquiry arc; DLA operational journey through ideas → mechanism → predictions → comparison → final judgement; rich GAM exposition and judgement materials (42-13, handover). Rendered: **activity-led experience** — workbook shape; governing investigation not primary organising frame.

The gap is not missing inquiry but inquiry **not owning** the experience. Investigation + Resource names the ownership shift the Marx evidence implies: elevate inquiry frame and resource voice; subordinate activity stack as embedded phases.

### Alignment with the stated desired learner experience

42-13 opening concern: desired experience is closer to **Question → Explanation → Investigation → Judgement → Reflection** — a resource that reads as a **coherent investigation**, not a workbook of discrete tasks.

Handover desired inversion:

```text
Current:   Activities → Resource
Desired:   Resource → Activities embedded within a larger investigation
```

Investigation is the **embedding container**; Resource is the **delivery voice**. Together they match Sprint 42's stated target more closely than any single alternative model.

### Alignment with self-directed higher-education learning

42-1: self-study voice must **teach before task** because no live tutor repairs thin orientation. Workshop voice may rely on facilitation; self-study cannot. Resource-owned secondary authority encodes that requirement. Investigation-owned primary authority encodes that self-study resources pursue a **governing question** across a sustained arc — the genre Sprint 42 contrasted with activity workbooks.

The benchmark exemplar `marx-self-study-page.json` — cited as the target "authored" quality bar — combines **conceptual spine before activities** (resource signal) with **intellectual progression through application** (investigation signal) (42-1, 42-8). Investigation + Resource is the ownership model that unifies those exemplar qualities as **primary and secondary authority**, not accidental fixture shape.

---

## Consequences

This decision is **conceptual**. It defines what Sprint 43 optimises toward and how salience should be judged. It does not prescribe how to achieve it.

| Consequence | Meaning |
| ----------- | ------- |
| **Salience evaluation** | Educational salience should be evaluated against **investigation authority** — whether the governing question and arc organise the learner's primary reading path (43-01 calibration anchor) |
| **Resource evaluation** | Resource composition (orientation, explanation, conceptual development, synthesis) should be evaluated against whether it **serves and sustains** the investigation — not whether it replaces activities |
| **Activity interpretation** | Activities should be interpreted as **phases within the investigation**, not as the definition of the resource. Activity membership and materials fidelity remain essential; activity authority is no longer the **target** owner |
| **Capability and judgement** | Remain important and must become more **salient** where Sprint 42 found them subordinate — but as **movements within the investigation**, not as competing primary frames |
| **PEL interpretation** | PEL should read as **sustained self-monitoring across the investigation**, not buried row-level cues (42-12) |
| **43-01 baseline** | Slice 43-01 should rate presence vs salience against **investigation-primary / resource-secondary** targets; high scores on activity-owned dimensions alone do not satisfy this decision |
| **Success criteria** | Sprint 43 closure in [`README.md`](README.md) — inquiry trajectory, structural coherence ("one investigation with embedded activities"), progression/judgement/PEL salience — should be read in light of this ownership model |
| **Explicit non-goal** | This decision does **not** demote DLA, GAM, LO, or PEL from the pipeline. It reassigns **narrative authority** for learner-facing self-study resources |

---

## Explicit non-decisions

This document does **not** decide:

| Topic | Status |
| ----- | ------ |
| Implementation approach | **Not decided** — no compose, prompt, or code intervention specified |
| Prompt changes | **Not decided** |
| Schema changes | **Not decided** |
| Renderer changes | **Not decided** |
| Composition mechanisms | **Not decided** — including whether `learning_content` gains structural page authority, how wrappers relate to materials under PREC-02, or how episode plans contribute to learner-visible progression |
| Salience thresholds | **Not decided** — 43-01 may propose ratings; this document does not set pass/fail bars |
| Facilitated delivery ownership | **Not decided** — Sprint 42 evidence emphasises self-study; inflation/climate benchmarks may differ (43-01 open question) |
| Generalisation beyond Marx | **Not decided** — single high-confidence manual run; secondary benchmarks may revise confidence |

Implementation slices remain **out of scope** until this decision and Sprint 43 success criteria are applied through investigation evidence (43-01) and any subsequent decision notes.

---

## Decision statement

For self-directed higher-education resources, PRISM will treat the **investigation** as the primary learner-facing organising unit and the **resource** as the secondary organising unit. Activities, materials, capability progression, judgement, and PEL remain essential supporting structures but are not the primary owners of the learner experience.

---

## Related documents

| Document | Role |
| -------- | ---- |
| [`README.md`](README.md) | Sprint 43 scope and success criteria |
| [`handover-from-sprint-42.md`](handover-from-sprint-42.md) | Sprint entry context |
| [43-00 problem reframing](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/43-00-problem-reframing-educational-salience.md) | Salience and authority definitions |
| [`43-01-investigation-plan.md`](43-01-investigation-plan.md) | Salience baseline investigation — calibrates against this decision |
| [42-13 synthesis](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/42-13-sprint-synthesis-authorial-quality-findings.md) | Authoritative Sprint 42 closure |
| [42-11A provenance audit](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/42-11A-design-page-static-provenance-audit.md) | Current authority map |
| [42-8 resource spine](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/42-8-resource-spine-investigation.md) | LC and spine candidates |
