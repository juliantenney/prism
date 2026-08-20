# Prism Project Trajectory

**Status:** Programme-level Governance artefact  
**Coverage:** Sprints 28–78  
**Purpose:** Maintain a compact account of how Prism arrived at its current architecture and why the major architectural boundaries exist.

---

## Current trajectory

Prism's development has followed a consistent direction:

> **Move educational intent out of fragile prose and implicit model behaviour into explicit, owned, traceable, testable and increasingly deterministic contracts.**

The product has progressively reduced the amount of work for which an LLM is responsible when that work is fundamentally deterministic, while making the genuinely generative instructional responsibilities more explicit.

The current pre-Alpha task is therefore not to invent Prism's product architecture. It is to make the remaining probabilistic prompt pipeline sufficiently reliable that Prism can repeatedly realise the educational product already defined by the architecture.

---

## 1. Durable pedagogical semantics — S28–30

Sprint 28 moved learner cognition from prompt prose into typed, durable structures capable of surviving a multi-stage pipeline.

Sprint 29 made those semantics learner-visible while establishing an enduring renderer principle:

> **Render authoritative pedagogy; do not infer or reconstruct it.**

Sprint 30 introduced the Pedagogic Enrichment Layer, including orientation, intellectual framing, coherence and disciplinary reasoning. Pedagogical support was deliberately proportional rather than maximal: Prism should provide the scaffolding an activity needs without saturating every activity with every possible support.

---

## 2. Learner experience and session pedagogy — S31–37

Prism increasingly treated the assembled page and session as educational experiences rather than containers for generated activity data.

The programme developed:

- page rhetoric and hierarchy;
- worked examples and visible reasoning;
- faded support;
- feedback and misconception interruption;
- evaluative judgement;
- instructional pacing and phase cues;
- intellectual progression;
- synthesis and epistemic closure;
- transfer and durable understanding.

By Sprint 37, individual activities could be pedagogically strong while the session-level learning journey remained weak. This established the need for explicit instructional planning above individual materials and activities.

---

## 3. Episode Plan and explicit instructional lineage — S38

Sprint 38 formalised instructional sequencing:

```text
Learning Outcomes
    ↓
Episode Plan
    ↓
DLA
    ↓
GAM
    ↓
Page
```

Episode Plan was deliberately minimal:

```text
archetype
ordered function beats
```

Two architectural rules were established:

> **Beat order is pedagogically authoritative.**

> **DLA populates Episode Plan; it does not replan it.**

Sprint 38S also implemented explicit Episode Plan → DLA lineage. The design requirement was that a reviewer should be able to trace an Episode Plan beat to its DLA obligation without reading prompts.

A pedagogical function could be realised through prose, learner task, material, workspace or coordinated surfaces. Therefore one beat was never intended to mean one material.

Anti-collapse rules protected distinctions such as:

```text
worked thinking
→ guided practice
→ independent performance
```

and:

```text
independent performance
→ verification
→ reflection
```

This is an important ancestor of current whole-resource conformance work.

---

## 4. Educational Quality Programme — S39–48

After Episode Plan V1, architecture was deliberately stabilised while educational quality was investigated.

Prism's educational North Star was framed around coherent capability-building learning journeys involving, where appropriate:

- understanding;
- capability;
- judgement;
- independence;
- metacognition;
- evaluative judgement;
- progressive independence.

A crucial distinction emerged:

> **Presence does not equal salience.**

Pedagogical features can exist structurally without functioning effectively for the learner.

Evidence-backed instructional patterns were developed for exposition, worked examples, partial exemplars, transfer, consolidation and verification. Selected patterns subsequently entered bounded runtime generation.

Much of the apparent richness of modern Prism resources originates in this deliberate educational programme.

---

## 5. Fidelity and first-loss diagnosis — S49–55

The programme then established that strong pedagogy can be generated correctly yet lost or weakened downstream.

The following properties became explicitly distinct:

```text
generation
≠ preservation
≠ manifestation
≠ salience
≠ quality
```

The learner-facing grammar:

```text
Orient → Think → Study → Do → Check → Reflect → Transfer
```

made instructional manifestation increasingly explicit.

A durable diagnostic principle emerged:

> **Find the earliest point at which intended state is lost before assigning cause.**

This is the ancestor of current artefact-grounded Generation Forensics.

---

## 6. Deterministic ownership and assembly — S56–58

Design Page had accumulated deterministic transport, copying and merge responsibilities alongside generative composition work.

A progressive full-page enrichment architecture was tested:

```text
Episode Plan
→ DLA enriches complete page
→ GAM enriches complete page
→ later stages enrich complete page
```

Real end-to-end testing falsified the approach. At realistic sizes, LLM stages omitted state, rewrote non-owned fields and pruned upstream content despite prompt hardening.

The resulting architectural conclusion was:

> **Probabilistic generation should not own deterministic preservation of complete cross-stage state.**

Prism moved to stage-owned partial artefacts plus deterministic assembly:

```text
Episode Plan shell
→ DLA partial
→ GAM partial
→ other owned partials
→ deterministic assembly
→ render
```

This remains a foundational architectural boundary.

---

## 7. Semantic contracts and deterministic presentation — S59–68

With structural preservation moved out of the LLM, attention shifted toward semantic fidelity.

Instructional archetypes separated the instructional work a material performs from its representation/type.

Semantic-delivery observability established another diagnostic rule:

> **Do not judge a contract until it is proven to have reached the generation boundary responsible for realising it.**

Semantic-flattening investigations showed that upstream reasoning structure can still be lost at stage boundaries even when structural assembly succeeds.

The learner renderer then matured into a deterministic transformation:

```text
validated LearnerPageModel
→ deterministic HTML
```

The renderer presents authoritative state; the pipeline authors it.

---

## 8. Canonicalisation and pre-Alpha hardening — S69–78

Episode Plan grammar was canonicalised and quality diagnosis became increasingly evidence-led and cross-domain.

Educational principles were productised into stronger contracts for:

- evidence decisions/providers;
- delayed-answer disclosure;
- coherence bridges;
- diagnostic review;
- Transfer after Check;
- response fulfilment;
- learner production;
- model/practice independence;
- operational suitability;
- disciplinary precision.

Workflow resources, persistence, definitive paths and operator UX also matured.

Sprints 76–77 established that prompt construction itself must be treated as architecture:

```text
inventory
→ canonical ownership
→ equivalence ledger
→ assemble once
→ atomic switch
→ behavioural gate
```

Sprint 78 exposed the remaining pre-Alpha concerns:

- whole-resource conformance and lineage;
- Episode Plan → DLA fidelity;
- prompt-pipeline reliability;
- operational suitability;
- artefact-grounded Generation Forensics;
- project-level Governance;
- release packaging.

---

## Current architecture

```text
Learning Outcomes
    ↓
Episode Plan
  plans archetype + ordered pedagogical functions
    ↓
DLA
  populates learner/activity/material obligations
    ↓
GAM
  realises commissioned material particulars
    ↓
other stage-owned partials
    ↓
deterministic validation / assembly
    ↓
LearnerPageModel
    ↓
deterministic renderer
```

Cross-cutting concerns include provenance, response fulfilment, learner production, practice independence, diagnostic review, operational suitability, structural validity and semantic lineage.

---

## Current programme position

Prism is in **pre-Alpha hardening**.

The architecture is substantially proven and the educational vision is coherent. The dominant remaining uncertainty is concentrated in the probabilistic stages: whether appropriate instructional intent is selected, populated and realised consistently enough to survive into a complete, operational and instructionally strong learner resource.

The programme is converging by progressively converting uncertainty into explicit semantics, ownership, validation, deterministic boundaries and behavioural evidence.
