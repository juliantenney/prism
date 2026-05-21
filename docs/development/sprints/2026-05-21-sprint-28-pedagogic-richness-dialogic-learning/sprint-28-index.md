# Sprint 28 index — Pedagogic richness & cognitive engagement architecture

**Pack path:** `docs/development/sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/`  
**Title:** Sprint 28 — Pedagogic Richness & Cognitive Engagement Architecture  
**Date:** 2026-05-21  
**Status:** **Closed** (2026-05-21) — 28-5a–5d + stabilisation; test floor **350** — [`sprint-28-closure.md`](sprint-28-closure.md)

**Verification floor (carry-forward):** **311 passed** (`node --test tests/*.test.js`) — Sprint 27 stabilised baseline

---

## Framing

Sprint 27 answered: **“How does PRISM model and preserve pedagogical assessment intent?”**

Sprint 28 asks:

**“Can PRISM move from instructional orchestration to pedagogically intelligent learning-experience generation?”**

Investigation strands (retained + expanded):

| Strand | Focus |
|--------|--------|
| **Cognitive engagement architecture** | Learner cognition in materials: scaffolding, misconception repair, progression, self-explanation |
| **Dialogic / workshop quality** | Seminars and peer formats as **stress-tests** for gaps that also harm **self-study** |
| **Self-study & learner-facing resources** | **Primary strategic** use-case — no tutor recovery when materials are weak |

Layers **E → O → G → C → R** remain the trace model. Sprint 27 assessment/feedback semantics are **stabilised** and out of scope for re-litigation.

---

## Programme context

| Prior sprint | Outcome | Relevance to 28 |
|--------------|---------|-----------------|
| [Sprint 27 assessment semantics](../2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/) | E→O→G→C→R for assessment/feedback; epistemic grounding; item count; negative assessment intent | Topology and visibility **stable**; climate seminar is primary carry-forward case |
| [Sprint 26 pedagogical intent](../2026-05-20-sprint-26-pedagogical-intent-elicitation-orchestration/) | `activities_required`, activity chain preservation | Activity **structure** largely fixed; **richness** still open |
| [Sprint 26 renderer](../2026-05-20-sprint-26-renderer-presentation-consolidation/) | Task card split, typed materials render | Presentation can show structure; does not guarantee generative **depth** |

---

## Pack inventory

| File | Purpose |
|------|---------|
| [`sprint-28-index.md`](sprint-28-index.md) | This index |
| [`sprint-28-charter.md`](sprint-28-charter.md) | Scope, hypotheses H1–H6, non-goals, investigation slices |
| [`HANDOVER.md`](HANDOVER.md) | New-chat entry point |
| [`CURRENT-STATE.md`](CURRENT-STATE.md) | Live status (prepared) |
| [`investigation-plan.md`](investigation-plan.md) | Phased read-only investigation steps |
| [`pedagogic-richness-evidence-matrix.md`](pedagogic-richness-evidence-matrix.md) | Cross-layer evidence + gap list |
| [`activity-materials-quality-notes.md`](activity-materials-quality-notes.md) | Quality dimensions, rubric, ontology draft |
| [`workflow-probe-catalogue.md`](workflow-probe-catalogue.md) | Brief templates and capture checklist |
| [`slice-28-4-charter.md`](slice-28-4-charter.md) | **Implementation charter** (28-5 programme) |
| [`review-log.md`](review-log.md) | Decisions R28-001+ |

---

## Core hypotheses (H1–H12)

| ID | Hypothesis |
|----|------------|
| **H1** | Activity **structure** is now preserved, but activity **materials** may remain shallow |
| **H2** | Task cards are often procedurally correct but lack **authentic scenario richness** |
| **H3** | Facilitator guidance gives broad advice but not enough **adaptive scaffolding logic** (contingent “if learners say X…”) |
| **H4** | Discussion prompts often ask for analysis but do not sustain **productive uncertainty** / cognitive tension |
| **H5** | Assessment and feedback may now be **richer than activity materials** (post–Sprint 27) |
| **H6** | **Cognitive progression** is under-modelled inside materials (workflow sequencing ≠ learner phase design) |
| **H7** | PRISM models **instructional artefacts** more strongly than **learner cognition** |
| **H8** | **Lean retrieval** topology prunes activity-chain cognition (mechanical MCQ loops) |
| **H10** | Pedagogic **cognition weakly typed** vs assessment semantics (28-2) |
| **H11** | Activity prompts **rhetorical**, not structurally rich (28-2) |
| **H12** | Composition **privileges assessable** artefacts (28-2; **weakened** 28-3 live) |
| **H13** | **Representation ceiling** — LLMs elaborate pedagogy within strongest typed structures (28-3) |

**Programme verdicts:** See [`pedagogic-richness-evidence-matrix.md`](pedagogic-richness-evidence-matrix.md) — H10 **Supported**; H11/H12/H13 **Partial**; H7 **Supported** (weakened on explicit briefs); H9 **strengthened** (P28-02).

---

## Primary evidence case (carry-forward)

| Case | Role | Sprint 27 / fixture anchors |
|------|------|-----------------------------|
| **Climate misconception seminar** | **Primary stress-test** — exposes scaffolding / learner-model gaps | `ld-climate-misconception-discussion-page.json`; observation harness tutor-led |
| **Self-study revision / explainer pages** | **Primary strategic** — solo path must carry cognition | Observation harness retrieval-quiz, no-assessment Bayesian |
| Peer instruction (prediction → discussion → revision) | **Reasoning revision cycle** probe | P28-02; observation harness peer scenario |
| RNA/transcript workshop | Source → activities + cognition in materials | P28-07; sparse brief fixtures |

---

## Suggested investigation slices (28-x)

| Slice | Focus | Status |
|-------|--------|--------|
| **28-1** | Evidence matrix + artefact audit (read-only) | **Complete** (Cases 1–5) |
| **28-2** | Elicitation & pedagogic ontology audit | **Complete** (2026-05-21) |
| **28-3** | Workflow probes + artefact captures | **Complete** — P28-01/02/07 live |
| **28-4** | Implementation charter (documentation) | **Draft complete** — [`slice-28-4-charter.md`](slice-28-4-charter.md) |
| **28-5a** | Ontology / cognition factors + packs | **Complete** — R28-021/022 |
| **28-5b** | Cognition-aware orchestration | **Complete** — R28-023/024 |
| **28-5c** | Activity schemas / contracts | **Complete** — R28-025/026 |
| **28-5d** | Composition parity | **Complete** — R28-027/028 |
| **28-5e** | Evaluation harness / rubric automation | **Deferred** |
| **Stabilisation** | Post-5d live probes + closure | **Complete** — R28-029/030 |

---

## Implementation programme (28-5 — after charter approval)

See [`slice-28-4-charter.md`](slice-28-4-charter.md): **typed pedagogic cognition**, activity cognition packs, topology guards, G contracts, composition parity, harness automation. **Preserve** Sprint 27 assessment semantics.

---

## Non-goals (until 28-5 implementation)

- No `app.js`, pack JSON, or prompt template changes  
- No new Factory factors without ontology review  
- No renderer/CSS sprint  
- No reassessment of Sprint 27 assessment visibility contracts (unless probe proves regression)  
- No **autonomous tutoring** or **adaptive runtime personalisation** product claims  
- No assertion that **dynamic learner models** exist in production (investigation targets **architecture**, not shipped features)

---

## Entry points

| Audience | Start here |
|----------|------------|
| New session | [`HANDOVER.md`](HANDOVER.md) |
| Investigator | [`investigation-plan.md`](investigation-plan.md) → [`pedagogic-richness-evidence-matrix.md`](pedagogic-richness-evidence-matrix.md) |
| Probe runner | [`workflow-probe-catalogue.md`](workflow-probe-catalogue.md) |
