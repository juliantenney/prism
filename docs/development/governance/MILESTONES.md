# Prism Milestones

**Status:** Programme-level Governance artefact  
**Purpose:** Keep sprint work aligned with the next meaningful product state rather than with backlog exhaustion.

---

# Current milestone — Alpha v1.0

**Programme status (2026-09-02):** **Alpha development complete** — [S82-D04](../sprints/2026-09-01-sprint-82-maths-entry-and-alpha-completion/decisions.md#s82-d04--alpha-development-complete) · [SPRINT-82-CLOSURE](../sprints/2026-09-01-sprint-82-maths-entry-and-alpha-completion/SPRINT-82-CLOSURE.md)

First-class journeys have been manually exercised and engineering-gated (`npm run test:first-class` → **339/339**). Known remaining issues and deferred capabilities are documented for post-alpha work. This is **not** a claim of production-ready, formally WCAG conformant, bug-free, or feature-complete status for every future output type.

## Milestone intent

Alpha v1.0 is the point at which Prism's existing core product architecture can repeatedly produce complete, operational and instructionally credible learner resources through the intended workflow, with failures exposed safely enough for continued controlled development.

Alpha is **not** the point at which every planned product feature exists.

The current phase was **pre-Alpha hardening** until Sprint 82 close (2026-09-02). **Alpha development is now complete** — see programme status above.

---

## Alpha v1.0 — required properties

### 1. Core workflow is operational

The principal learner-resource workflow completes through the intended current architecture:

```text
Learning Outcomes
→ Episode Plan
→ DLA
→ GAM
→ stage-owned partials
→ deterministic assembly
→ LearnerPageModel
→ deterministic renderer
```

No dependency on retired legacy/parallel paths for normal operation.

---

### 2. Architecture and ownership are stable enough for Alpha

The current stage-owned partial artefact architecture and deterministic assembly remain canonical.

No major architectural redesign is required unless evidence demonstrates a genuine Alpha blocker.

Prompt-pipeline hardening is preferred over unnecessary architecture churn.

---

### 3. Whole-resource conformance is demonstrable

Prism can establish that required instructional obligations survive the workflow.

Conformance should cover, as appropriate:

- activity identity and membership;
- Episode Plan → DLA obligations;
- material commissions and bodies;
- response/workspace bindings;
- evidence providers;
- learner production requirements;
- model/practice independence;
- diagnostic review;
- page/session-level obligations;
- deterministic assembly membership.

Validation must be conditional on authoritative planning/commissioning.

It must not require every possible pedagogical feature on every resource.

---

### 4. Pedagogical lineage is sufficiently trustworthy

Where Episode Plan selects an instructional function, the pipeline must have an accountable mechanism for its downstream realisation.

Before Alpha closure, resolve the current uncertainty around the historical S38S Episode Plan → DLA population guarantees:

- establish what remains current;
- identify what was deliberately superseded;
- repair any proven regression that materially undermines Alpha conformance.

---

### 5. Learner resources are operationally suitable

Learners receive the materials, evidence, workspaces and instructions necessary to perform the commissioned activity.

Systemic first-pass generation defects that make tasks impossible or misleading are Alpha blockers.

Temporary diagnostic instrumentation may remain where necessary, but should not conceal unsuitable first-pass generation.

---

### 6. Model/practice independence is protected

Worked examples/models must not disclose or solve the learner's independent target task where independent production is intended.

This is a core instructional integrity requirement.

---

### 7. Failure is safe and diagnosable

Malformed authoritative generation fails closed.

Prism should preserve sufficient evidence/provenance to investigate generation/capture failures rather than silently creating plausible but corrupted state.

---

### 8. Instructional quality is repeatable enough for Alpha

Representative cross-domain resources should demonstrate consistently credible instructional quality.

The exact numerical QA pass threshold is **not yet fixed**.

Reason:

A corpus is required to determine what score corresponds to resources that are genuinely good enough. Historical evidence shows that apparently high scores can coexist with serious defects.

Alpha quality judgement should combine:

- known conformance;
- representative resource review;
- QA evidence;
- failure-mode analysis.

Do not optimise mechanically to a target score.

---

### 9. Release packaging exists

There is a reproducible way to create a deployment package/folder from known-good source state.

Alpha should not require deploying the working project folder directly.

The release process must make the shipped state explicit.

---

## Alpha v1.0 — currently excluded by default

The following are not Alpha requirements unless new evidence shows they materially block Alpha quality/usability.

### Settings

Deferred to Beta/v1.0 territory.

### Image consistency

Post-Alpha by default. Promote only if benchmark evidence shows it invalidates Alpha.

### GAM restructure

Post-Alpha by default. Promote only if current architecture is proven to block Alpha or the value proposition becomes overwhelming.

### Slideshow / narrated MP4 workflow

New capability; post-Alpha.

### Full product integration of Governance

Governance can operate as prompts/workflows and curated artefacts during Alpha.

### Full product integration of Generation Forensics

Forensics can operate as an investigative method using Copilot/LLM diagnosis plus bounded Cursor verification.

---

## Alpha v1.0 — evidence still required

Current priority evidence:

1. repository verification of S38S → current EP/DLA lineage;
2. representative conformance validation across several resources/domains;
3. fresh evidence for remaining GAM malformed-output/operational-suitability issues;
4. QA corpus sufficient to make a defensible "good enough for Alpha" judgement;
5. working release-package process.

---

## Alpha decision rule

Alpha should be declared when the evidence supports:

> **Prism substantially does what the current product vision says it does, through the intended architecture, repeatedly enough to be a credible Alpha rather than a successful demonstration.**

Known limitations may remain if they are:

- explicit;
- non-destructive;
- non-blocking;
- diagnostically visible;
- appropriate for Alpha maturity.

---

# Next milestone — Beta

**Definition maturity:** intentionally provisional

Beta should move beyond proving the core product toward broader usability, configurability and sustained use.

Likely candidates include:

- Settings/configuration;
- stronger image consistency if still required;
- more mature release/deployment process;
- broader workflow coverage;
- reduced need for diagnostic instrumentation;
- improved operational polish;
- stronger repeatability across domains/use cases.

Do not treat this list as committed scope until Alpha evidence informs the milestone.

---

# Later milestone — v1.0

**Definition maturity:** intentionally provisional

v1.0 should represent a product suitable for intended routine use rather than experimental/controlled development.

Possible concerns include:

- mature configuration;
- dependable release/deployment;
- robust cross-domain quality;
- stable operational workflows;
- resolved or explicitly accepted architectural debt;
- sustainable Governance/QA/forensic practices.

New capabilities such as narrated slideshow/video workflows may enter the roadmap independently of core v1.0 requirements.

Do not define v1.0 by feature accumulation.

---

# Milestone governance

At the beginning of a sprint:

1. identify the current milestone;
2. identify which milestone condition the sprint is intended to move;
3. state the evidence expected at sprint closure;
4. challenge work that is merely interesting but does not serve the milestone or an explicit investigation.

At sprint closure:

1. record what milestone evidence changed;
2. distinguish implementation completion from demonstrated behaviour;
3. update blockers/accepted limitations;
4. promote/defer backlog items only on evidence;
5. reassess whether the milestone definition itself needs revision.

Mid-sprint Governance should be triggered only by meaningful events such as:

- evidence falsifies a sprint assumption;
- a proposed fix implies architectural change;
- scope expands materially;
- a blocker threatens the milestone;
- a retired direction is being reconsidered;
- new evidence changes what "good enough" means.

The purpose is alignment, not continuous oversight.
