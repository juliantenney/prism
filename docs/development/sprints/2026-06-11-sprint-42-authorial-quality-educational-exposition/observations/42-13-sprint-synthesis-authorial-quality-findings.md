# Sprint 42-13 — Authorial Quality Synthesis

**Date:** 2026-06-11  
**Type:** Synthesis note only — no implementation, schema, renderer, or workflow changes  
**Closes:** Sprint 42 investigation arc through Slice 42-12 and Marx manual workflow review

---

## Purpose

This note synthesises what Sprint 42 has **actually established** after a chain of investigations (42-1 through 42-12), selective implementation (notably 42-10 source-ingest parity), static provenance audits (42-11A), PEL manifestation audit (42-12), and a recent **manual Marx self-study workflow run** (“Was Marx Right?”).

It records which hypotheses have been weakened or disproved, what problem remains, and what a future sprint should decide — without proposing fixes.

**Prior synthesis inputs:**

| Slice | Deliverable | Role |
| ----- | ----------- | ---- |
| 42-8 | `42-8-resource-spine-investigation.md` | LC as intellectual spine; DLA as page organiser |
| 42-10 | `sprint-42-slice-10-source-ingest-learning-content-parity.md` | Both routes produce LC before KM |
| 42-11A | `42-11A-design-page-static-provenance-audit.md` | Static DLA/activity dominance |
| 42-12 | `42-12-pel-manifestation-audit.md` | PEL implemented but weakly protected |

---

## Original concern

Sprint 42 began from a learner-experience concern, not a missing-pipeline concern:

- Final learner-facing pages felt **structurally correct but assembled rather than authored**.
- The visible reading pattern tended toward **Activity → Activity → Activity**.
- The desired experience was closer to **Question → Explanation → Investigation → Judgement → Reflection** — a resource that reads as a coherent investigation, not a workbook of discrete tasks.

Sprint 41 had already integrated EQF, PEL contracts, mandatory DLA framing, and Design Page field preservation. Sprint 42 asked whether the remaining gap was **missing educational ingredients** or **how those ingredients are expressed** on the final page.

---

## Hypotheses investigated

| Hypothesis | Status | Evidence |
| ---------- | ------ | -------- |
| **Missing workflow stage** | **Disproved** | 42-8, handover Current Position; GLC → KM path exists on both routes after 42-10 |
| **Missing learner journey** | **Disproved** | Marx manual run: progression preserved across LC, LO, EP, DLA; 42-4B journey preservation |
| **Missing exposition** | **Weakened / largely disproved** | Marx GAM: concept explanations, worked examples, tables, perspectives; 42-1 baseline; preamble/exposition modules (42-2/42-3) |
| **Missing judgement** | **Weakened / largely disproved** | Marx: evaluation archetype through activities; decision framework and consolidation in materials; judgement in EQF/DLA contracts |
| **Missing PEL / metacognition** | **Partially disproved upstream; confirmed weak downstream** | 42-12 Verdict **B**: PEL in DLA/GAM prompts and fields; not page-level spine; lightweight EQF metacognition |
| **Missing source-ingest parity** | **Resolved (42-10)** | Source route: Normalize → GLC → `learning_content` → Model Knowledge |
| **DLA destroys the inquiry** | **Disproved** | Marx manual run: activities progressed core ideas → mechanism → predictions → comparison → judgement |
| **GAM collapses instructional depth** | **Disproved** | Marx GAM: usable exposition depth; 42-7 preservation audit — materials fidelity is strong, not thin |
| **Design Page composition is the remaining bottleneck** | **Confirmed** | 42-11A Verdict **A** (static); Marx rendered page activity-led despite good upstream inquiry |

---

## What Sprint 42 disproved or weakened

The evidence **does not support** a diagnosis that PRISM lacks educational architecture.

**Weakened or disproved:**

- The workflow is **not missing a stage** that would unlock authored resources.
- The **learner journey exists** upstream — in `learning_content`, outcomes, episode plans, sequence, and DLA progression.
- **Exposition exists** — in preambles, GAM materials, and cognition-oriented fields; not merely as labels.
- **Judgement exists** — embedded in task design, expected outputs, and evaluation-oriented materials.
- **PEL exists in prompts and contracts** — orientation/reasoning blocks, mandatory cognition fields, EQF metacognition line — even when final pages do not foreground it.
- **Source-ingest parity** was a real gap and was **addressed in 42-10** without schema or renderer change.
- **DLA and GAM are not weak** in the Marx manual run; they carried inquiry, exposition, and judgement forward.

What remains is **not** “add more pedagogy” as the default explanation. The Marx run is instructive: every major artefact was educationally coherent; the final rendered experience still **felt activity-led**.

---

## What Sprint 42 confirmed

PRISM can produce a **coherent educational journey distributed across artefacts**. The Marx self-study manual run is the strongest end-to-end example in this sprint.

| Artefact | Observed role |
| -------- | --------------- |
| **learning_content** | Inquiry / resource spine — Question → Theory → Predictions → Historical/contemporary evaluation → Debate → Judgement |
| **knowledge_model** | Conceptual spine — concepts, relationships, processes, misconceptions |
| **learning_outcomes** | Capability progression — understanding → causal explanation → comparison → evaluation |
| **episode_plans** | Instructional beat structure — explanation → worked thinking → guided practice/transfer → verification |
| **learning_activities** | Operational learning journey — core ideas through mechanism, predictions, comparison, final judgement |
| **activity_materials** | Explanatory / worked / judgement materials — concept explanations, worked examples, tables, checklists, perspectives, decision framework, transfer and consolidation |
| **Design Page** | Faithful activity/material assembly — preserved sequence and content; inquiry and judgement present but structurally subordinate |
| **Rendered page** | Activity-led learner experience — Overview → Learning Outcomes → Learning Activities → Activity 1…5 |

**Caveat:** Marx manual evidence is **higher confidence** than Sprint 30 fixtures or harness captures for learner-experience judgements (per handover evidence note). Static audits (42-11A, 42-12) are **necessary but not sufficient** for salience claims; they align with the manual run but do not replace it.

---

## Core finding

The remaining quality gap is **not primarily absence of educational structure**. It is a **salience / authority problem**.

> PRISM already generates substantial educational structure, but the final learner page does not consistently foreground that structure as the learner’s primary experience.

**What survives but is subordinate:**

| Signal | Upstream | On final page |
| ------ | -------- | --------------- |
| **Inquiry** | Strong in `learning_content` and DLA progression | Present inside activity stack; not the dominant structural frame |
| **PEL** | Authored at DLA/GAM | Preserved on rows; weakly protected; not a page-level metacognitive spine (42-12) |
| **Judgement** | In tasks, materials, outcomes | Usually **activity-local** rather than resource-closing |
| **learning_content** | Best intellectual spine candidate | Influences wrapper prose; **does not own** page structure (42-11A) |

**Design Page role:** A **faithful assembler** of activities and preserved materials — not yet a **strong educational author** that elevates inquiry, progression, and reflection to the learner’s primary reading path.

---

## Narrative authority finding

**42-11A (static)** and the **Marx manual run (artefact + render)** converge on the same picture:

- Design Page is **structurally organised around `learning_activities`** — hard activity membership, DLA repair, GAM verbatim preservation, PREC-02 materials precedence.
- **`activity_materials` dominate fidelity and typical visual weight** — tables, worked examples, and checklists render inside task blocks; wrappers are not length-guaranteed.
- **`learning_content` has no hard section mapping or repair path** at compose — optional enrichment and assimilation into overview/bridges/study_tips, not structural spine authority.
- **`learning_sequence`** primarily orders activities; transition language is prompt-level aspiration (42-6 assimilation), not a standalone movement spine.

**Learner read:** Even when inquiry is good, the page reads as a **workbook** — correct sequence, strong materials, activity-owned structure — rather than an **authored investigation** where activities are embedded inside a larger question.

---

## PEL manifestation finding

**42-12** complements the narrative-authority finding:

| Layer | PEL strength |
| ----- | ------------ |
| **DLA** | Strong — mandatory preamble + cognition fields; PEL orientation/reasoning prompt blocks; capture validation on learner-page workflows |
| **GAM** | Strong guidance — PEL reasoning materials, closure depth, self-check patterns on self-directed pages |
| **Design Page** | Weak at generation — **no PEL PEC injection**; preserves upstream fields; EQF metacognition explicitly **“lightweight”** |
| **Rendered experience** | PEL can **exist upstream but be buried** inside activity/material structures |

Dimensions such as **confidence, uncertainty, progress awareness, decision reflection, and independence** are present in contracts and fields but appear **only weakly** in final learner experience — more as optional row-level cues than as sustained self-monitoring across the resource.

This is consistent with **B: implemented but weakly protected**, not with PEL being largely absent from the system.

---

## Revised problem statement

> PRISM no longer primarily needs more educational ingredients. It needs stronger learner-facing **expression** of the educational ingredients it already generates.

The next problem is **how Design Page should make inquiry, judgement, PEL, and progression visible** without introducing new workflow stages, schemas, renderer redesigns, or weakening DLA/GAM fidelity.

This is a **composition and salience** problem at the boundary between upstream artefacts and learner-visible structure — not a pipeline completeness problem.

---

## Implications for next sprint

Do not treat the following as implementation plans. They are **decision themes** for a follow-on sprint.

**Possible Sprint 43 framing:**

| Theme | Question it raises |
| ----- | ------------------ |
| **Educational Salience** | What should the learner notice first — the governing question or the activity list? |
| **Narrative Authority** | Who “authors” the page — the activity stack or the inquiry spine? |
| **Learner Experience Composition** | How should wrappers, sections, and transitions relate to preserved materials? |
| **Resource-first Page Composition** | Can activities be **embedded within** an investigation rather than **dominating** it? |

**The next sprint should decide:**

1. **Primary organising unit** — What should be the main structural frame of a learner page?
2. **`learning_content` as page-level spine** — Whether LC should become an **explicit** compose authority (section mapping, repair, precedence) rather than optional wrapper influence.
3. **Activity embedding** — How activities sit **inside** an investigation narrative without breaking membership or materials preservation.
4. **PEL surfacing** — How metacognitive self-monitoring appears as **learner-visible progression** without heavy reflective workload or diary tone (Sprint 42 rhetoric constraints still apply).

**Out of scope for that decision (unless explicitly reopened):**

- New workflow stages
- Schema changes
- Renderer structural redesign
- Weakening GAM materials preservation or PREC-02
- Reopening Sprint 41 EQF/PEL architecture wholesale

---

## Recommended next action

**Close Sprint 42 investigation** with this synthesis as the authoritative findings record.

**Open a new sprint or decision note** focused on **Design Page educational salience / narrative authority** — using Marx (and optionally inflation/climate benchmarks) as validation workflows, with clear success criteria for **learner-visible structure** rather than upstream artefact quality alone.

Suggested entry artefacts for Sprint 43 planning:

- This document (42-13)
- `42-11A-design-page-static-provenance-audit.md`
- `42-12-pel-manifestation-audit.md`
- Marx manual run captures (composed `page.json` + rendered HTML)
- `42-8-resource-spine-investigation.md`

---

## Constraints preserved

This synthesis **does not recommend:**

- New workflow stages
- Schema changes
- Renderer redesign
- Weakening materials preservation (GAM verbatim merge, PREC-02, table fidelity)
- Reopening Sprint 41 EQF/PEL architecture as the primary lever

Sprint 42’s implementation work (42-6 journey assimilation, 42-10 LC parity, exposition modules) assumed **preserve upstream fidelity, improve expression**. That constraint carries forward.

---

## Confidence summary

| Finding | Confidence |
| ------- | ---------- |
| Upstream educational structure exists (Marx) | **High** — manual end-to-end run |
| Design Page activity-centrism (static contracts) | **High** — 42-11A hard contracts |
| PEL weak at page level (static) | **High** — 42-12 |
| Salience gap is the remaining problem (synthesis) | **Medium-high** — converges static + manual; not yet A/B tested with compose interventions |
| Specific compose intervention that fixes salience | **Not established** — requires Sprint 43 decision and validation |
