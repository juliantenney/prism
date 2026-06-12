# Handover from Sprint 42 → Sprint 43

**From:** Sprint 42 — Authorial Quality / Educational Exposition (closed)  
**To:** Sprint 43 — Educational Salience (open)

**Authoritative Sprint 42 closure:** [`../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/42-13-sprint-synthesis-authorial-quality-findings.md`](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/42-13-sprint-synthesis-authorial-quality-findings.md)

**Problem reframing for Sprint 43:** [`../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/43-00-problem-reframing-educational-salience.md`](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/43-00-problem-reframing-educational-salience.md)

---

## Executive summary

Sprint 42 began expecting learner pages felt **assembled rather than authored** because something upstream was missing — exposition, journey, judgement, metacognition, or pipeline completeness.

Investigation through Slice 42-12 and a **manual Marx self-study run** (“Was Marx Right?”) **disproved** that diagnosis. PRISM produces a coherent educational journey distributed across artefacts. The final rendered page still reads **activity-led** — Overview → Learning Outcomes → Learning Activities → Activity 1…N.

**Sprint 43 starts from a reframed problem:** educational **salience** and **narrative authority** at the Design Page boundary — not missing educational ingredients.

> PRISM no longer primarily needs more educational ingredients. It needs stronger learner-facing **expression** of the ingredients it already generates.

---

## What Sprint 42 disproved

| Hypothesis | Status | Evidence |
| ---------- | ------ | -------- |
| Missing workflow stage | **Disproved** | 42-8; GLC → KM on both routes after 42-10 |
| Missing learner journey | **Disproved** | Marx run; LO, EP, DLA progression preserved |
| Missing exposition | **Largely disproved** | Marx GAM materials; 42-1 baseline; preamble/exposition modules |
| Missing judgement | **Largely disproved** | Evaluation archetype; decision framework; outcome progression |
| DLA destroys inquiry | **Disproved** | Marx DLA: core ideas → mechanism → predictions → comparison → judgement |
| GAM collapses depth | **Disproved** | Marx GAM usable exposition; 42-7 preservation audit |
| Missing source-ingest parity | **Resolved** | 42-10: Normalize → GLC → `learning_content` → Model Knowledge |

**Partially disproved (upstream yes, downstream weak):**

| Hypothesis | Status |
| ---------- | ------ |
| Missing PEL / metacognition | Upstream **present**; page-level **weak** (42-12 Verdict B) |

---

## What Sprint 42 confirmed

1. **`learning_content`** is the strongest candidate for the **intellectual / inquiry spine** of a learner resource.
2. **`knowledge_model`** is the strongest **conceptual spine**.
3. **DLA** is the strongest **activity spine** and **Design Page structural authority**.
4. **GAM** is the strongest **instructional / explanatory materials spine**.
5. **Design Page** is a **faithful assembler** of activities and preserved materials — not yet a strong **educational author** of learner-visible structure.
6. **The remaining gap is composition salience**, not missing pedagogy or stages.

**Static confirmation (42-11A Verdict A):** Hard contracts — activity membership, DLA repair, GAM verbatim preserve, PREC-02 — centre the composed page on `learning_activities` + `activity.materials.*`. `learning_content` influences wrapper assimilation only; no structural mapping or repair path.

---

## Manual Marx workflow findings

Primary evidence: **manual end-to-end self-study run** for “Was Marx Right?” (higher confidence than Sprint 30 fixtures or harness captures per Sprint 42 handover evidence note).

| Stage | Educational structure present | Learner-visible salience downstream |
| ----- | ------------------------------ | ----------------------------------- |
| **GLC** (`learning_content`) | Strong inquiry arc: Question → Theory → Predictions → Historical/contemporary evaluation → Debate → Judgement; governing inquiry; sections and key concepts | **Low structural authority** on final page — assimilated into wrappers when bound; does not own section tree |
| **KM** (`knowledge_model`) | Concepts, relationships, processes, misconceptions | **Low–medium** — may inform `knowledge_summary`; no compose repair |
| **LO** (`learning_outcomes`) | Progression: understanding → causal explanation → comparison → evaluation | **Medium** — outcome list / `learning_purpose`; less narrative arc |
| **DEP** (`episode_plans`) | Beats: explanation → worked thinking → guided practice/transfer → verification | **Low on page** — not Design Page input; influences DLA population only |
| **DLA** (`learning_activities`) | Operational journey through ideas → mechanism → predictions → comparison → final judgement; framing and cognition fields | **High** — owns page activity section; inquiry inside activity sequence |
| **GAM** (`activity_materials`) | Concept explanations, worked examples, tables, checklists, perspectives, decision framework, transfer and consolidation | **High visual weight** — verbatim inside rows; dominates scan path |
| **CLS** (`learning_sequence`) | Facilitation timeline; progression and transition signals | **Low–medium on learner page** — primarily order/timing for activities; transition language prompt-level only (42-6 assimilation) |
| **Design Page** | Faithful assembly; preserved materials and framing fields; wrapper modules (journey, authorial, rhetoric, EQF) | **Activity-led composition** — inquiry and PEL present but subordinate |
| **Rendered page** | Inquiry, judgement, exposition, PEL cues within activities and materials | **Activity-led experience** — workbook shape; governing investigation not primary organising frame |

**Reader experience:** The inquiry **exists**; the activity stack **owns** what the learner notices first.

---

## Narrative authority finding

**Sources:** 42-11A static audit; Marx manual run (artefact + render).

| Authority type | Sprint 42 assessment |
| -------------- | -------------------- |
| **Activity authority** | **Dominant** — ACTIVITY MEMBERSHIP hard contract; DLA-only repair |
| **Material authority** | **Dominant** — GAM verbatim preserve; PREC-02 over wrapper thinning |
| **Inquiry authority** | **Present upstream**; **no hard page mapping**; wrapper assimilation only |
| **Page-level authority** | **Soft** — overview, learning_purpose, knowledge_summary, study_tips; subordinate to materials |

**Distinction:**

- **Structure existing** — inquiry, progression, and PEL encoded across artefacts ✓ (Marx run)
- **Structure owning the learner experience** — governing question and arc frame the page ✗ (rendered read)

Design Page optimises for **faithful assembly** under activity + material authority, not **resource-first investigation** under inquiry authority.

---

## PEL manifestation finding

**Source:** 42-12 — Verdict **B: PEL implemented but weakly protected**

| Layer | PEL strength |
| ----- | ------------ |
| **DLA** | Strong — mandatory preamble + cognition fields; PEL orientation/reasoning blocks; capture validation |
| **GAM** | Strong guidance — PEL reasoning materials, closure, self-check patterns |
| **Design Page** | Weak at generation — no PEL PEC injection; preserves upstream fields; EQF metacognition explicitly “lightweight” |
| **Rendered experience** | PEL can exist upstream but be **buried** inside activity/material layout |

Confidence, uncertainty, progress awareness, decision reflection, and independence are present in contracts and fields but appear **weakly** in final learner experience — row-level cues rather than sustained metacognitive spine.

---

## Revised problem statement

> PRISM already generates substantial educational structure, but the final learner page does not consistently foreground that structure as the learner’s primary experience.

The next problem is **how Design Page should make inquiry, judgement, PEL, and progression visible** without:

- new workflow stages
- schema changes
- renderer redesign
- weakening DLA/GAM fidelity

This is a **salience / authority** problem at the boundary between upstream artefacts and learner-visible structure.

---

## Recommended starting position for Sprint 43

1. **Accept Sprint 42 evidence base** — do not default to missing-ingredients diagnosis.
2. **Begin with investigation, not implementation** — see [`43-01-investigation-plan.md`](43-01-investigation-plan.md).
3. **Decide learner experience target** before compose interventions — what should Design Page optimise for?
4. **Use Marx manual run artefacts** as primary validation; inflation/climate as secondary benchmarks.
5. **Preserve constraints** from Sprint 41–42 — materials fidelity, activity membership, EQF/PEL architecture closed unless explicitly rescoped.

**Sprint 42 implementation retained (do not regress):**

- 42-6 journey assimilation (`lib/ld-journey-assimilation.js`)
- 42-10 source-ingest LC parity
- 42-2/42-3 authorial and preamble exposition modules

---

## Risks

| Risk | Detail |
| ---- | ------ |
| **Reopening wrong problem** | Treating salience gap as missing pedagogy → more prompts/stages without authority decision |
| **Salience vs fidelity trade-off** | Compose changes that thin materials or drop activities to foreground wrappers |
| **Fixture over-confidence** | Sprint 30 / hand-edited fixtures may not reflect current pipeline; prefer fresh manual runs |
| **Field presence ≠ salience** | PEL fields preserved on rows may still be invisible below tables/checklists |
| **Premature implementation** | Compose guidance before success criteria and learner-experience decision are agreed |
| **Impression vs measurement** | Manual read necessary; needs structured rubric for repeatability (43-01) |

---

## Open questions

| Question | Why open |
| -------- | -------- |
| What should own the learner page? | Not decided — key Sprint 43 decision |
| Is LC spine a prompt-only or structural authority change? | Requires decision; schema/renderer implications unclear until framed |
| How much salience is enough? | No agreed rubric or threshold yet |
| Does salience differ by delivery mode? | Self-directed vs facilitated not fully compared in Sprint 42 |
| Will compose-only guidance suffice? | Not established — 43-01 should test before implementation slices |
| Marx run generalisation | Single high-quality manual run; inflation/climate may differ |

---

## Recommended first investigation

**Slice 43-01 — Educational Salience Baseline** ([`43-01-investigation-plan.md`](43-01-investigation-plan.md))

Establish a **structured salience audit** on Marx manual run artefacts (and optionally benchmark fixtures) measuring:

- presence vs **salience** of inquiry, judgement, progression, PEL, and independence
- activity/material dominance vs wrapper authority
- gap between upstream artefact quality and rendered learner experience

**Do not prescribe implementation.** Output should be an observation document with decision-ready evidence for:

- what exact learner experience Design Page should optimise for
- whether the gap is primarily structural authority, visual weight, or prose assimilation weakness

---

## Sprint 42 slice index (reference)

| ID | Focus | Type |
| -- | ----- | ---- |
| 42-1 | Exposition baseline | Investigation |
| 42-2/42-3 | Authorial / preamble exposition | Implementation |
| 42-4 | Live validation / Marx journey | Investigation |
| 42-5 | Design Page journey context | Investigation |
| 42-6 | Journey assimilation | Implementation |
| 42-7 | GAM preservation | Investigation |
| 42-8 | Resource spine | Investigation |
| 42-9 | Generate vs Normalise parity | Investigation |
| 42-10 | Source-ingest LC parity | Implementation |
| 42-11A | Design Page static provenance | Investigation |
| 42-12 | PEL manifestation | Investigation |
| 42-13 | Sprint synthesis | Closure |
| 43-00 | Problem reframing (Sprint 43 entry) | Framing |
