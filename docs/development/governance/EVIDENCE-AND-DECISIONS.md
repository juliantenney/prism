# Prism Evidence and Decisions

**Status:** Programme-level Governance artefact  
**Purpose:** Preserve durable project knowledge that should survive individual sprint histories.

---

## Status vocabulary

- **PROVEN** — supported by implementation and/or behavioural evidence.
- **DECISION** — deliberately adopted project/product/architecture rule.
- **SUPPORTED** — evidence supports the claim, but its scope is bounded.
- **HYPOTHESIS** — plausible and useful, but not yet proven.
- **SUPERSEDED** — historically valid mechanism or decision replaced by later architecture.

---

# Durable principles

## ED-001 — Educational intent must be explicit enough to survive the pipeline

**Status:** PROVEN

Important cognition, pedagogical function, identity, role and binding should not depend on downstream inference from prose.

Typed semantics and stable identity are preferred where preservation matters.

---

## ED-002 — Pedagogy is proportional, not maximalist

**Status:** DECISION

Not every activity requires every pedagogical scaffold or function.

Instructional support should discriminate according to learning outcome, intellectual operation, archetype, task complexity and context.

Completeness is therefore conditional, not component-count based.

---

## ED-003 — The learning journey is the primary educational design unit

**Status:** DECISION

Prism should optimise for coherent capability-building journeys rather than collections of individually strong activities.

Session-level progression, synthesis and closure matter independently of within-activity quality.

---

## ED-004 — Prism develops capability, not merely content exposure

**Status:** DECISION

The educational repertoire includes, where appropriate:

- understanding;
- disciplinary reasoning;
- judgement;
- decision-making;
- critique;
- application;
- creation;
- evaluative judgement;
- metacognition;
- progressive independence.

---

## ED-005 — Episode Plan owns instructional sequencing

**Status:** DECISION

Episode Plan selects the instructional archetype and ordered function beats.

Beat order is pedagogically authoritative.

DLA populates the plan rather than replanning it.

---

## ED-006 — Pedagogical function realisation is surface-polymorphic

**Status:** PROVEN / DECISION

One Episode Plan beat does not imply one material.

A function may legitimately be realised through:

- activity prose;
- learner task;
- material;
- workspace;
- review/check;
- bridge;
- multiple coordinated surfaces.

Validation should establish function realisation rather than count materials.

---

## ED-007 — Episode Plan → DLA lineage was designed to be inspectable

**Status:** PROVEN HISTORICAL IMPLEMENTATION

Sprint 38S required a reviewer to be able to trace Episode Plan beat → DLA obligation without reading prompts.

Historical machinery included canonical instructional-function identity, beat indices, learner-task segments, population traces, Episode Plan references and anti-collapse rules.

**Current implementation status:** requires repository verification.

---

## ED-008 — Pedagogical collapse is distinct from omission

**Status:** PROVEN / DECISION

A downstream artefact can nominally contain relevant content while collapsing distinct instructional moves into one shallow obligation.

Conformance should distinguish:

- missing;
- misbound;
- wrong order;
- merged/collapsed;
- wrong surface;
- shallow substitution.

---

## ED-009 — Presence, preservation, manifestation, salience and quality are different properties

**Status:** PROVEN

A pedagogical feature can:

1. be generated;
2. survive structurally;
3. appear to the learner;
4. be educationally salient;
5. be high quality.

Success at one layer does not prove success at the next.

---

## ED-010 — Worked modelling should lead toward independent learner production

**Status:** DECISION

Models/worked examples should expose reasoning and bridge toward learner performance.

Model/example content must not substitute for the independent task.

---

## ED-011 — Verification is deeper than checklist presence

**Status:** DECISION

Verification should support quality judgement and, where appropriate, repair/revision.

A structurally present checklist does not by itself establish successful verification.

---

## ED-012 — Reflection and consolidation are semantically distinct

**Status:** DECISION

Reflection is learner-generated metacognitive work.

Consolidation/synthesis may support closure but should not silently substitute for learner reflection where reflection is planned.

---

## ED-013 — Transfer is a first-class instructional function

**Status:** PROVEN HISTORICAL INTENT

Transfer/application appears before Episode Plan and later becomes an explicit instructional function/pattern.

Where selected, it should require meaningful reapplication rather than generic closing prose.

This does not make Transfer mandatory in every activity/resource.

---

## ED-014 — Epistemic closure is distinct from procedural completion

**Status:** DECISION

A strong session ending should, where appropriate, clarify what distinction, judgement, reasoning move or misconception has changed for the learner.

Historical `study_tips` sometimes carried this synthesis/closure role; the function is more important than the legacy field name.

---

## ED-015 — Scaffold saturation is a recognised failure mode

**Status:** DECISION

Prism should not add every available pedagogical support to every activity.

Historical work explicitly deferred additional scaffolding where the benefit did not justify complexity.

---

# Architecture and engineering

## ED-016 — Deterministic work belongs in deterministic code

**Status:** PROVEN / DECISION

LLMs should not own deterministic copying, large-state preservation, final structural joins or renderer inference where code can perform those operations reliably.

---

## ED-017 — Whole-page progressive LLM enrichment is not the canonical architecture

**Status:** PROVEN / SUPERSEDED

Real end-to-end testing showed that complete-page preservation degraded at realistic sizes despite prompt hardening.

Stage-owned partial artefacts plus deterministic assembly replaced the approach.

---

## ED-018 — Stage ownership should be explicit

**Status:** DECISION

Canonical high-level ownership:

- Episode Plan — instructional planning / shell;
- DLA — learner/activity/material obligations;
- GAM — commissioned material bodies;
- other stages — their owned partials;
- assembly — deterministic merge;
- renderer — deterministic presentation.

Do not casually move responsibilities across these boundaries.

---

## ED-019 — The renderer renders; the pipeline authors

**Status:** PROVEN / DECISION

The renderer should not invent missing pedagogy, infer semantics from prose or compensate for upstream generation defects.

Missing instructional meaning should be repaired at its owning boundary.

---

## ED-020 — Preserve exact identity/provenance where lineage matters

**Status:** DECISION

Prefer stable IDs and explicit bindings over fuzzy correlation by title, position or approximate type.

Fail closed when authoritative correlation cannot be established.

---

## ED-021 — Diagnose first loss before repairing

**Status:** PROVEN METHODOLOGY

The location where a defect becomes visible is not automatically the causal stage.

Identify the earliest proven degradation before changing code or prompts.

---

## ED-022 — Prove contract delivery before judging generation

**Status:** PROVEN METHODOLOGY

Before concluding that an LLM ignored a contract, establish that the intended instruction actually reached the generation boundary responsible for realising it.

---

## ED-023 — Fresh behavioural evidence outranks architectural intuition

**Status:** DECISION

Historical intent and code inspection provide context.

Current runtime behaviour must be established with fresh representative runs when making behavioural claims.

---

## ED-024 — Fail closed on malformed authoritative artefacts

**Status:** DECISION

Do not silently sanitise malformed generated artefacts into plausible state.

Preserve evidence and diagnose provenance.

---

## ED-025 — Prompt engineering is architecture

**Status:** PROVEN / DECISION

Model-visible contracts have ownership, ordering, salience, duplication, interaction and regression risk.

Prompt changes should be treated as architectural changes and behaviourally gated.

---

## ED-026 — Safe prompt restructuring requires semantic equivalence control

**Status:** DECISION

Preferred method:

```text
inventory
→ canonical ownership
→ equivalence ledger
→ assemble once
→ atomic switch
→ behavioural gate
```

Avoid append-now/rationalise-later development.

---

# Evidence and quality

## ED-027 — QA diagnostics are evidence, not automatic truth

**Status:** DECISION

A numerical QA score cannot prove structural completeness, correct lineage, correct binding or absence of silent omission.

Use QA to evaluate instructional quality after/beside conformance.

---

## ED-028 — Improve the learner resource, not the benchmark score

**Status:** DECISION

Do not mechanically optimise generation against diagnostic metrics.

Metrics support judgement; they do not replace it.

---

## ED-029 — Experimental feasibility is not production readiness

**Status:** DECISION

A capability being technically possible does not establish that it is valuable, maintainable, safe or worth shipping.

---

## ED-030 — Negative knowledge is programme knowledge

**Status:** DECISION

Preserve disproven approaches and the evidence that retired them so future work does not accidentally rediscover them.

---

# Current programme hypotheses

## H-001 — Current EP → DLA lineage guarantees may have weakened or changed

**Status:** HYPOTHESIS

Historical S38S lineage machinery is stronger and more explicit than what is visible in recent artefacts.

Repository verification is required before assigning regression.

---

## H-002 — Some current resource omissions may originate in Episode Plan selection

**Status:** HYPOTHESIS

Orientation-only Episode Plans observed in a recent Hydrology run may indicate underplanning, but could also represent legitimate pedagogical discrimination or generation variability.

Judge against learning intent, not beat count.

---

## H-003 — DLA overhaul may have exposed and/or introduced semantic problems

**Status:** HYPOTHESIS

Recent issues may combine:

- genuine regressions from DLA restructuring;
- older prompt/ownership weaknesses made more visible by the restructuring.

Use artefact-grounded first-loss diagnosis rather than assuming either explanation.

---

# Evidence discipline

When adding an entry:

1. state the claim narrowly;
2. assign a status;
3. distinguish historical intent from current implementation;
4. record evidence/provenance in the relevant sprint or forensic record;
5. promote hypotheses only when evidence justifies it;
6. mark replaced mechanisms `SUPERSEDED` rather than deleting their rationale.

This register should remain small. Sprint-local implementation detail belongs in sprint records.
