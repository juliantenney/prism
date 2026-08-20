# Prism Programme Synthesis — Sprints 28–78

**Status:** Working programme-level synthesis  
**Evidence base:** Six curated historical reviews covering S28–37, S38, S39–48, S49–58, S59–68 and S69–78  
**Purpose:** Provide a compact, durable account of Prism's architectural trajectory, educational intent, proven principles, retired directions, unresolved debt, Alpha implications and immediate forensic questions.  
**Authority:** This synthesis is derived from curated sprint evidence. It does not replace canonical sprint records or repository verification where current implementation status is uncertain.

---

# 1. Executive synthesis

Across Sprints 28–78, Prism has followed a surprisingly coherent development trajectory.

The central story is not repeated reinvention.

It is:

> **Progressively moving educational intent out of fragile prose and implicit model behaviour into explicit, owned, traceable, testable and increasingly deterministic contracts.**

The programme began by making learner cognition durable data, then made that cognition learner-visible, added pedagogical orientation/reasoning contracts, refined page rhetoric and session pedagogy, and formalised instructional sequencing through Episode Plan.

It then learned that rich educational intent can still disappear at pipeline boundaries. This led to explicit fidelity analysis, first-loss localisation, deterministic ownership, stage-owned partial artefacts, deterministic assembly and a deterministic learner renderer.

More recently, Prism has concentrated on the remaining probabilistic surface: the **prompt pipeline itself**. DLA semantic ownership, prompt-contract structure, learner production, model/practice independence, diagnostic review and operational suitability have all been hardened.

The current pre-Alpha challenge is therefore best described as:

> **Can Prism reliably carry an appropriate instructional plan through stage-owned generation, preserve its semantic lineage, assemble the full intended package, and manifest it as a consistently strong learner resource?**

That is a narrower and more mature problem than "can Prism generate a good resource?"

---

# 2. Programme trajectory

## Phase A — Durable pedagogical semantics (S28–30)

### S28 — cognition becomes durable

Learner cognition moved from prompt prose into typed contracts with stable IDs and cross-stage preservation.

Key principle:

> Important learner reasoning cannot live only in prose if it must survive a multi-stage generation pipeline.

### S29 — cognition becomes learner-visible

The renderer surfaced authoritative cognition semantics rather than inferring them from generic prose.

Early durable rule:

> **Render authoritative pedagogy; do not reconstruct it.**

### S30 — Pedagogic Enrichment Layer

Prism added explicit orientation and reasoning contracts, including:

- study orientation;
- intellectual framing;
- coherence bridges;
- disciplinary reasoning prompts;
- conceptual contrast;
- evidence-use guidance;
- transfer/application.

Pedagogy was deliberately proportional. Metacognitive expansion was bounded to avoid scaffold saturation.

---

## Phase B — Learner experience and session pedagogy (S31–37)

Prism increasingly treated the page and session as educational experiences rather than containers for generated activity data.

Important developments included:

- page rhetoric and hierarchy;
- pedagogical visualisation;
- worked examples;
- faded support;
- embedded feedback;
- misconception interruption;
- evaluative judgement;
- phase cues and pacing;
- study-tip / epilogue treatment;
- intellectual progression;
- synthesis;
- epistemic closure;
- transfer and durable understanding.

By S37, the diagnosed problem was no longer weak within-activity pedagogy.

It was:

> **Strong activities can still fail to form a strong session-level learning journey.**

This phase establishes that richness in Prism is historically **intentional but bounded**.

The goal was never maximal numbers of components.

The goal was sufficient pedagogical support for the learning journey, with support proportional to task complexity.

---

## Phase C — Episode Plan formalises instructional planning (S38)

Sprint 38 is a major architecture programme.

It introduced:

```text
LO → Episode Plan → DLA → GAM → Page
```

with a deliberately minimal Episode Plan:

```text
archetype
ordered function beats
```

Two rules are fundamental:

> **Beat order is pedagogically authoritative.**

and:

> **DLA populates Episode Plan; it does not replan it.**

Most importantly, S38S implemented an explicit Episode Plan → DLA population contract.

The design target was:

> **A reviewer must trace Episode Plan beat → DLA obligation without reading prompts.**

The lineage machinery included concepts such as:

- canonical `instructional_function`;
- `plan_beat_index`;
- learner-task segments;
- population trace;
- Episode Plan references;
- beat-trace matrices;
- ordered material/function preservation;
- anti-collapse rules.

A beat was **not** expected to equal one material.

A pedagogical function could legitimately manifest through:

- prose/activity content;
- learner task;
- material;
- workspace;
- multiple coordinated surfaces.

This is crucial to the modern completeness problem.

### Anti-collapse intent

Sprint 38 explicitly protected pedagogical distinctions such as:

```text
worked thinking
→ guided practice
→ independent performance
```

```text
independent performance
→ verification
→ reflection
```

```text
evaluative judgement
→ transfer
→ reflection
```

It also rejected shallow substitutions such as:

- reflection → consolidation summary;
- criteria construction → exposition;
- evaluative judgement → template only;
- verification → shallow checklist;
- perspective construction → passive scenario list.

This means **pedagogical lineage was explicitly designed as a testable architecture**, not merely a prompt preference.

---

## Phase D — Educational Quality Programme (S39–48)

After Episode Plan V1, the architecture was deliberately frozen so educational quality could be studied separately from ownership redesign.

The programme established a North Star around:

- coherent capability-building learning journeys;
- understanding;
- capability;
- judgement;
- independence;
- metacognition;
- evaluative judgement;
- progressive independence.

A critical principle emerged:

> **Presence does not equal salience.**

A pedagogical feature may exist structurally yet still fail educationally if the learner cannot perceive or use it.

Sprint 44 converted strong educational realisation into evidence-backed patterns including:

- connective exposition;
- partial exemplars;
- transfer prompts;
- consolidation scaffolds;
- criteria-linked verification;
- visible-reasoning worked examples.

By Sprint 48, selected patterns were entering bounded runtime generation.

This phase is the historical source of much of Prism's current learner-resource richness.

---

## Phase E — Fidelity and first-loss diagnosis (S49–55)

The programme then discovered a systems problem:

> Rich pedagogy can be generated correctly and still be lost, thinned or poorly manifested downstream.

Several properties were explicitly separated:

```text
generation
≠ preservation
≠ manifestation
≠ salience
≠ quality
```

Sprint 50 also formalised a learner-facing instructional sequence:

```text
Orient → Think → Study → Do → Check → Reflect → Transfer
```

The later fidelity programme established **first-loss localisation**:

> Identify the earliest stage at which intended instructional state ceases to be preserved before assigning cause.

This is an important ancestor of current artefact-grounded generation forensics.

---

## Phase F — Deterministic ownership replaces whole-page LLM preservation (S56–58)

Design Page had become overloaded with:

- copying;
- transport;
- merging;
- coherence;
- composition;
- presentation inference.

The S56 programme decomposed those responsibilities and recognised that deterministic copy/join work is a poor fit for LLM ownership.

### S56F hypothesis

The project proposed a seemingly elegant architecture:

```text
Episode Plan
→ DLA enrichs same complete page
→ GAM enriches same complete page
→ later stages enrich same complete page
```

### S57A falsification

Real end-to-end testing disproved it.

At realistic page sizes, LLM stages:

- omitted later activities;
- rewrote non-owned fields;
- summarised/pruned upstream state;
- emitted meta-output;
- failed preservation despite prompt hardening.

The resulting durable conclusion is:

> **Probabilistic generation should not own deterministic preservation of complete cross-stage state.**

### S58 architecture

The modern architecture was therefore implemented:

```text
Episode Plan full shell
→ DLA partial
→ GAM partial
→ other stage partials
→ deterministic assembly
→ render
```

Canonical ownership:

- Episode Plan: page shell, LOs, episode plans, activity skeletons;
- DLA: activity instructional fields;
- GAM: material bodies;
- other stages: their owned partials;
- assembly: deterministic merge;
- renderer: presentation.

This is the direct foundation of present-day Prism.

---

## Phase G — Semantic contracts and deterministic presentation (S59–68)

With whole-page preservation removed from LLM responsibility, the programme could investigate more subtle semantic quality.

### Instructional archetypes

Prism separated:

> **what instructional work a material performs**

from:

> **what representation/type the material uses.**

Archetype intent became explicit production state with delivery observability.

A key methodological rule:

> Do not judge an instructional contract until you have proven it actually reached the generation boundary that was supposed to realise it.

### Semantic flattening

Sprint 63 proved that valuable upstream reasoning structure could still flatten at GAM → assembly and become unrecoverable downstream.

The durable failure class is:

```text
upstream intent exists
→ boundary loses semantic structure
→ downstream lacks authority to reconstruct it
```

### Renderer maturity

S62 and S65–68 established a clean boundary:

> **The renderer renders. The pipeline authors.**

The vNext renderer became:

```text
validated learner-page model
→ deterministic HTML
```

No heuristic beat scoring, content invention or post-render semantic insertion.

This is why renderer defects are now comparatively tractable.

---

## Phase H — Canonicalisation, consolidation and pre-Alpha hardening (S69–78)

### S69

Episode Plan grammar became a shared canonical validation route.

### S70–72

Quality diagnosis became evidence-led, with causal ownership and cross-domain benchmarking.

Educational principles were productised into explicit contracts including:

- evidence decisions/providers;
- delayed-answer disclosure;
- coherence bridges;
- diagnostic review;
- Transfer after Check.

### S73–75

Workflow resources, persistence, definitive paths and operator UX substantially matured.

### S76–77

Attention shifted decisively toward **prompt architecture**.

DLA semantic ownership was rationalised.

Prompt construction was recognised as architecture rather than prose accumulation.

The safe restructuring method became:

```text
inventory
→ canonical ownership
→ equivalence ledger
→ assemble once
→ atomic switch
→ behavioural gate
```

### S78

Learner-resource quality recovery added/hardened:

- response fulfilment;
- model/practice independence;
- diagnostic review;
- operational suitability;
- fail-closed malformed-output handling;
- disciplinary precision.

Late S78 then exposed the current pre-Alpha questions:

- whole-resource conformance/completeness;
- EP → DLA pedagogical lineage;
- artefact-grounded generation forensics;
- project-level Governance;
- explicit Alpha v1.0 milestone definition.

---

# 3. Consolidated durable principles

The batch-level evidence/decision lists contain many overlapping entries. The programme-level set can be compressed to the following durable principles.

## P01 — Educational intent must be explicit enough to survive the pipeline

Important cognition, pedagogical function, role, identity and binding should not depend on prose inference.

---

## P02 — Pedagogy is proportional, not maximalist

Not every activity needs every scaffold or pedagogical function.

The plan should discriminate according to:

- learning outcome;
- intellectual operation;
- archetype;
- task complexity;
- domain/context.

Completeness must therefore be conditional.

---

## P03 — The learning journey is the primary educational design unit

Individual activities can be strong while the session remains weak.

Prism should develop coherent capability, judgement and independence across the resource.

---

## P04 — Episode Plan owns instructional sequencing

Episode Plan selects the archetype and ordered pedagogical functions.

Beat order is authoritative.

DLA should populate, not replan.

---

## P05 — Pedagogical function realisation is polymorphic

One beat does not equal one material.

A function may be realised through prose, task, material, workspace, review, bridge or combined surfaces.

Validation must prove function realisation, not count components.

---

## P06 — Prevent pedagogical collapse, not only structural omission

A nominally present downstream element can still collapse two distinct intended functions.

Conformance must be capable of distinguishing:

- missing;
- misbound;
- merged/collapsed;
- wrong order;
- wrong surface;
- shallow substitution.

---

## P07 — Presence, preservation, manifestation, salience and quality are different properties

A learner-facing feature can fail at several different layers.

These should not be collapsed into one QA judgement.

---

## P08 — Deterministic work belongs in deterministic code

LLMs should not own:

- large-state copying;
- deterministic joins;
- whole-page preservation;
- final structural assembly;
- renderer inference.

Stage-owned partials + deterministic assembly is a proven architectural response to real LLM limitations.

---

## P09 — The renderer manifests authoritative meaning; it does not invent it

Missing pedagogy belongs upstream.

Renderer fixes should remain bounded to deterministic presentation of authoritative data.

---

## P10 — Preserve exact identity/provenance across semantic boundaries

Where lineage matters, exact IDs/bindings are preferred over fuzzy title/position/type correlation.

Fail closed where authoritative correlation is unavailable.

---

## P11 — Diagnose first loss before repairing

The stage where a problem becomes visible is not automatically causal.

Use the earliest proven degradation point.

---

## P12 — Fresh behavioural evidence outranks architectural intuition

Architecture/design proposals must survive realistic end-to-end generation.

Historical artefacts provide context, not proof of current runtime behaviour.

---

## P13 — Fail closed rather than silently rescue authoritative artefacts

Malformed or structurally invalid generation should not be sanitised into plausible state.

Preserve evidence and diagnose provenance.

---

## P14 — Experimental feasibility is not production readiness

"Possible" is different from:

- valuable;
- frequent;
- maintainable;
- safe;
- worth shipping.

---

## P15 — Prompt engineering is architecture

Model-visible contracts have:

- ownership;
- ordering;
- salience;
- duplication;
- interaction;
- regression risk.

Do not use append-now/rationalise-later as the default development model.

---

## P16 — Improve the learner resource, not the benchmark score

QA and diagnostics are evidence instruments.

Do not optimise mechanically to the metric.

---

## P17 — Curate project knowledge

Programme memory should preserve both:

- what works and why;
- what was disproven and why.

This is a core Governance requirement.

---

# 4. Educational intent that should survive historical compression

The following educational goals recur strongly enough to belong in programme memory.

Prism is intended to support, when appropriate:

- orientation and intellectual framing;
- disciplinary reasoning;
- evidence use;
- conceptual contrasts;
- misconception confrontation;
- visible worked thinking;
- guided/faded support;
- independent learner production;
- evaluative judgement;
- verification/checking;
- revision/repair;
- reflection/metacognition;
- consolidation/synthesis;
- transfer/application;
- intellectual progression and coherence;
- epistemic closure;
- progressive independence.

These are **not universal mandatory components**.

They are the repertoire from which the instructional plan should deliberately select.

---

# 5. Current architecture — programme-level view

The current intended ownership model can be summarised as:

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
  realises generated material particulars
    ↓
other stage-owned partials
    ↓
deterministic validation / assembly
    ↓
LearnerPageModel
    ↓
deterministic renderer
```

Cross-cutting concerns include:

- evidence/provenance;
- response fulfilment;
- learner production;
- practice independence;
- diagnostic review;
- operational suitability;
- structural validity;
- semantic lineage.

---

# 6. Retired, disproven or superseded directions

These should remain in programme memory specifically so they are not accidentally rediscovered as attractive simplifications.

## R01 — Whole-page LLM progressive enrichment

**Status:** RETIRED / empirically disproven

"Return the whole page with only your fields changed" failed under realistic page sizes even after prompt hardening.

Do not reintroduce without materially new evidence/capability.

---

## R02 — LLM-owned final merge/composition

**Status:** RETIRED

Design Page no longer owns deterministic whole-page merge.

Code-owned assembly is canonical.

---

## R03 — Parallel/legacy learner renderer

**Status:** RETIRED

vNext became the sole learner rendering path.

---

## R04 — Heuristic renderer recovery of pedagogy

**Status:** REJECTED

Do not infer missing instructional meaning from prose, titles, activity IDs or approximate matching.

---

## R05 — Maximal pedagogical ontology / scaffold saturation

**Status:** REJECTED design direction

The programme repeatedly chose bounded, proportional pedagogical structure.

---

## R06 — Automatic repair of malformed authoritative generation

**Status:** REJECTED

Fail closed; preserve evidence; regenerate from the correct upstream boundary where appropriate.

---

## R07 — Prompt append-now / rationalise-later

**Status:** REJECTED engineering habit

Prompt architecture must be intentional, owned and behaviourally gated.

---

# 7. Superseded historical mechanisms that should not automatically become backlog

Several historical ideas were valuable in context but may have been replaced by later architecture.

Examples:

- older Design Page ownership/validation mechanisms;
- two-column manifestation prototypes;
- legacy renderer support;
- some early pattern-library coverage gaps;
- earlier generic cognitive-projection experiments;
- pre-vNext rendering affordances.

Governance should distinguish:

> historical rationale worth preserving

from:

> historical mechanism that should be restored.

---

# 8. Open architectural debt and unresolved hypotheses

## D01 — EP → DLA population lineage

**State:** HIGH-PRIORITY REPOSITORY VERIFICATION

Historical evidence shows S38S had explicit machine-traceable beat → obligation architecture.

Current S78 artefacts do not obviously expose the full historical trace machinery.

Need to establish what happened to:

- canonical instructional-function identity;
- beat-index lineage;
- learner-task segmentation;
- population trace;
- Episode Plan references;
- beat trace matrix;
- anti-collapse rules.

This is not yet a proven current defect.

---

## D02 — Episode Plan selection adequacy

**State:** QUALITY / GENERATION QUESTION

The Hydrology and Lagrangian runs show materially different EP richness.

Need to distinguish:

- legitimate pedagogical discrimination;
- underplanning;
- generation variability;
- contract weakness.

Do not judge by number of beats alone.

---

## D03 — Whole-resource conformance and lineage validation

**State:** PRE-ALPHA REQUIREMENT / LIKELY BLOCKER

Prism needs deterministic evidence that required obligations:

1. were selected/commissioned;
2. were emitted by their owning stage;
3. retained correct identity/binding;
4. survived capture/assembly;
5. reached the final learner resource;
6. manifest the intended instructional function where deterministically testable.

This is more precise than "completeness validation".

---

## D04 — GAM E2 malformed-output recurrence

**State:** OPEN / INTERMITTENT

Known malformed-output family.

Fail closed.

No sanitisation.

Upstream provenance is partially narrowed but model-generation vs Copilot/rendering remains unresolved in some cases.

---

## D05 — Temporary operational-suitability verifier

**State:** TEMPORARY INSTRUMENTATION

Useful while discovering systemic GAM failure classes.

The target state remains first-pass suitable GAM.

---

## D06 — Activity timing/duration

**State:** QUEUED / NOT YET PROMOTED

If pursued, trace lineage from expected duration through planning/generation/assembly rather than assigning the renderer by default.

---

## D07 — Release packaging

**State:** PRE-ALPHA RELEASE PREREQUISITE

Need a reproducible deployment package/folder from known-good source state.

---

## D08 — GAM restructure

**State:** CONDITIONAL / POST-ALPHA BY DEFAULT

Do not start while DLA/conformance architecture remains unsettled.

Promote pre-Alpha only if evidence shows current GAM architecture blocks Alpha or the value proposition becomes overwhelming.

---

## D09 — Image consistency

**State:** POST-ALPHA BY DEFAULT

Promote only if benchmark evidence shows it invalidates Alpha quality/usability.

---

## D10 — Settings

**State:** POST-ALPHA

Not required for current Alpha milestone.

---

## D11 — Slideshow / narrated MP4 workflow

**State:** POST-ALPHA NEW CAPABILITY

Valuable expansion, not Alpha completion work.

---

## D12 — Formal Governance / Generation Forensics workflows

**State:** USE AS METHODS NOW; PRODUCTISE LATER

Their value can be realised manually before formal Prism integration.

---

# 9. Current Alpha implications

The historical evidence supports the current view that Prism is in **pre-Alpha hardening**, not foundational product construction.

Most core capabilities exist.

The dominant remaining route is:

```text
prompt-pipeline reliability
    +
semantic lineage
    +
whole-resource conformance
    +
operational suitability
    +
repeatable instructional quality
    +
safe failure
    +
release packaging
```

Alpha should not be defined by backlog exhaustion.

---

# 10. Alpha correctness model

A useful five-layer model emerges from the history.

## Layer 1 — Planning adequacy

Did Prism select an instructional journey appropriate to the LOs, archetypes and learning context?

This is primarily Episode Plan quality.

---

## Layer 2 — Population/generation fidelity

Did each owning stage emit the obligations required by that plan?

This includes EP → DLA population and DLA → GAM commission realisation.

---

## Layer 3 — Structural preservation / assembly

Did valid obligations survive capture, identity/binding and deterministic assembly without loss or corruption?

---

## Layer 4 — Operational learner manifestation

Can the learner actually perform the intended work using the materials, workspaces, evidence, models, checks and guidance provided?

---

## Layer 5 — Instructional quality

Is the resulting learning experience good?

This remains QA territory.

---

# 11. Refined definition of whole-resource completeness

The historical record supports the following definition:

> **A Prism resource is complete when an educationally appropriate instructional journey has been planned; every selected pedagogical function has been populated by its owning stage; every required obligation survives identity, validation and deterministic assembly; and the final learner resource manifests those obligations sufficiently for the learner to perform the intended cognitive work.**

Properties:

- conditional, not maximalist;
- supports lean and rich resources;
- based on authoritative selection;
- traceable by stage ownership;
- distinguishes omission from collapse;
- separates conformance from subjective instructional quality.

---

# 12. QA and Alpha threshold

Historical evidence strongly supports keeping QA separate from conformance.

A high QA score cannot prove:

- activity completeness;
- correct upstream lineage;
- absence of silent omissions;
- correct binding;
- intended pedagogical function coverage.

The eventual Alpha QA threshold should therefore be calibrated against a corpus where conformance is known independently.

The numerical threshold remains deliberately unset.

---

# 13. Immediate bounded repository-verification questions

When Cursor becomes available, avoid a broad audit.

The highest-value questions are now very specific.

## Q1 — What happened to the Sprint 38S EP → DLA population contract?

Verify current status/history of:

- `instructional_function`;
- `plan_beat_index`;
- `_learner_task_segments[]`;
- `_population_trace[]`;
- `episode_plan_ref`;
- `buildBeatTraceMatrix(...)`;
- P1–P10 population rules;
- AC anti-collapse rules.

Classify each:

```text
CURRENT
RELOCATED
SUPERSEDED
REMOVED DELIBERATELY
REGRESSED
UNKNOWN
```

Then identify what current mechanism, if any, preserves the same guarantee.

---

## Q2 — Did S69 canonical grammar preserve the S38S manifestation guarantees?

S69 canonicalised function/archetype grammar.

Verify whether this was:

- vocabulary/validation consolidation only;
- a complete preservation of population semantics;
- a semantic weakening;
- or replacement by another mechanism.

---

## Q3 — Could current DLA PASS while selected EP functions lack accountable manifestations?

Use current validators/contracts.

Test a small representative set:

- revision;
- reflection;
- transfer;
- guided inquiry;
- criteria construction;
- misconception confrontation.

Do not create a one-material-per-beat requirement.

---

## Q4 — Can current deterministic assembly prove whole-stage membership/identity preservation?

Determine what is already mechanically guaranteed for:

- activity IDs;
- materials;
- response surfaces;
- evidence providers;
- page-level synthesis;
- learner-resource elements.

This bounds the remaining completeness-validator work.

---

## Q5 — Which missing final-page elements are schema/contract obligations versus historical optional features?

Specifically investigate:

- page/session closure;
- study tips / epistemic synthesis;
- transfer;
- timing;
- wrap-up/consolidation.

The historical existence of a feature does not make it universally mandatory.

Find the current selection/ownership authority.

---

# 14. Governance memory model

The synthesis suggests that the permanent project-level layer should be small.

Recommended durable artefacts:

## PROJECT-TRAJECTORY.md

A compressed architectural narrative like Sections 1–2 of this synthesis.

Update only at significant architectural/milestone transitions.

---

## EVIDENCE-AND-DECISIONS.md

Contains durable principles/claims with status:

- **PROVEN**
- **DECISION**
- **SUPPORTED**
- **HYPOTHESIS**
- **SUPERSEDED**

Do not carry every sprint task upward.

---

## ARCHITECTURAL-DEBT.md

Contains:

- temporary mechanisms;
- unresolved hypotheses;
- accepted debt;
- conditional/post-milestone work;
- retired directions that must not be rediscovered.

---

## MILESTONES.md

Contains:

- current milestone;
- exit conditions;
- evidence state;
- blockers;
- accepted limitations;
- release prerequisites.

Detailed milestone definitions can remain separate documents.

---

## BACKLOG.md

Remains the place for candidate future work.

It should not be confused with milestone requirements.

---

# 15. Sprint closure curation model

Future Governance should avoid repeating this fifty-sprint archaeology.

At sprint closure, ask:

> **What changed at programme level?**

Only record deltas in the following categories.

### Trajectory

Did the sprint materially change how Prism works or how the project understands its architecture?

### Evidence / decision

What durable principle, proof or decision should survive beyond the sprint?

### Debt

What temporary mechanism, unresolved hypothesis or accepted compromise was created, retired or changed?

### Milestone

Which milestone condition moved, and what evidence now exists?

### Retired direction

What was disproved or deliberately stopped and should not be rediscovered?

Most sprint implementation detail should remain in the sprint folder only.

---

# 16. The programme story in one paragraph

> Prism evolved from a functioning multi-stage generation workflow into a deliberately pedagogical learning system by progressively making learner cognition, orientation, reasoning, modelling, judgement, reflection, transfer and session coherence explicit. Episode Plan then formalised instructional sequencing and originally provided traceable beat-to-DLA population semantics. As the educational system became richer, the project discovered that LLM stages could generate good pedagogy yet lose or distort it during cross-stage preservation. Repeated fidelity investigations eventually disproved whole-page LLM preservation and moved structural integration into deterministic partial-artifact assembly, followed by a deterministic learner renderer. With those foundations stable, recent work has concentrated on the remaining probabilistic surface: semantic ownership and prompt-contract reliability, especially in DLA and GAM. The current pre-Alpha task is therefore not to invent the product, but to prove that the educational intent Prism already knows how to plan can be carried reliably through its stage-owned prompt pipeline, assembled completely, manifested operationally and delivered at a repeatably high instructional standard.

---

# 17. Current programme judgement

Based on the reviewed S28–78 evidence:

## The architecture is substantially proven

The modern core architecture has survived several rounds of empirical challenge and was often adopted specifically because predecessor approaches failed under realistic conditions.

## The educational vision is substantially coherent

Prism's richness is not a recent collection of prompt patches. Its major pedagogical ideas have a long, traceable design ancestry.

## The remaining pre-Alpha risk is concentrated

The most important uncertainty is now **reliability of semantic manifestation through the probabilistic stages**, especially where older explicit lineage mechanisms may have been weakened or superseded.

## Convergence is visible

The history does not read like a project repeatedly returning to zero.

It reads like successive uncertainty being converted into:

- explicit semantics;
- ownership;
- validation;
- deterministic boundaries;
- behavioural evidence.

That is a strong sign of convergence toward Alpha.

---

# 18. Status of this synthesis

This document should remain a **review synthesis** until checked by the project/design authority.

Recommended next step:

1. review this synthesis for accuracy/emphasis;
2. revise where necessary;
3. then split the approved content into the permanent programme-level Governance artefacts;
4. retain the six batch curation drafts as historical source summaries;
5. use the five bounded repository questions above when Cursor returns.

Do not delete or replace canonical sprint history.
