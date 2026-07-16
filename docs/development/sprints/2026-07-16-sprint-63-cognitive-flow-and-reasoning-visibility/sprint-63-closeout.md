# Sprint 63 Close-Out

**Sprint:** 63 — Cognitive Flow & Reasoning Visibility  
**Opened:** 2026-07-16  
**Closed:** 2026-07-16  
**Status:** Complete  
**Predecessor:** [Sprint 62 closure](../2026-07-16-sprint-62-coherent-renderer-pass/SPRINT-62-CLOSURE.md)  
**Successor:** [Sprint 64](../2026-07-16-sprint-64-cognitive-structure-preservation-investigation/SPRINT-64-START-HERE.md)

**Companion:** [sprint-63-authoritative-findings.md](sprint-63-authoritative-findings.md) · [sprint-63-to-sprint-64-handover.md](sprint-63-to-sprint-64-handover.md)

---

## Objective

What Sprint 63 set out to investigate:

> Understand the next bottleneck in learning effectiveness after Sprint 62 — whether remaining friction is presentation, orchestration, missing information, or a combination — by mapping activity identity, cognitive families, manifestation feasibility, and archetype-plan preservation without redesigning schemas or production systems.

Working Hypothesis (charter): mismatch between the cognitive process learners must perform and the information explicitly available in the activity.

---

## Evidence Produced

| Artefact | Role |
| -------- | ---- |
| [activity-type-system-inventory.md](activity-type-system-inventory.md) | Distributed activity-identity map |
| [cognitive-activity-manifestation-catalogue.md](cognitive-activity-manifestation-catalogue.md) | Cognitive families + Tier 1–4 model |
| [cognitive-manifestation-experiment-1.md](cognitive-manifestation-experiment-1.md) | Tier 2 manifestation (RNA A1/A2/A6) |
| [cognitive-manifestation-experiment-2-archetype-propagation.md](cognitive-manifestation-experiment-2-archetype-propagation.md) | Mechanism plan propagation |
| [cognitive-structure-preservation-and-manifestation-synthesis.md](cognitive-structure-preservation-and-manifestation-synthesis.md) | Authoritative interpretation |
| [cognitive-structure-final-validation.md](cognitive-structure-final-validation.md) | Generalisation + production reality |
| [experiments/experiment-1/](experiments/experiment-1/) | Non-production HTML variants |
| [experiments/experiment-2/](experiments/experiment-2/) | Mechanism T2/T1 + diagnostic page |
| [experiments/experiment-3/](experiments/experiment-3/) | Process + mental-model T2/T1 |
| [sprint-63-authoritative-findings.md](sprint-63-authoritative-findings.md) | Frozen “what was proved” |
| Charter | [docs/sprints/sprint-63-cognitive-flow-and-reasoning-visibility.md](../../../sprints/sprint-63-cognitive-flow-and-reasoning-visibility.md) |

---

## Key Findings

### Distributed activity identity

No single pedagogic activity-type SoT. Identity is distributed across episode archetypes, instructional archetypes + plans, beat functions, pedagogical beats, material types, interaction types, and assessment types. Learner experience is driven mainly by materials + beats + framing; instructional plans stop before the renderer.

### Cognitive families

Six strongly evidenced families (classification, mechanism/causal, process walkthrough, mental-model/systems, comparison, evaluation). Family ≠ activity ≠ episode archetype ≠ material type. Tier 1–4 confidence model governs safe manifestation.

### Tier 2 manifestation

Render-time multi-signal recombination can differentiate classification / causal / evaluation without schema change. Gains are mainly grouping, labelling, ordering, and relationship exposure of authored content.

### Archetype-plan preservation findings

`instructional_archetype` + `archetype_plan` encode learner-relevant intermediate reasoning structure. Structured fields are consumed by GAM and lost as learner-reachable data at **GAM → assembled `materials[]`**. High-value non-recoverable fields include `required_links`, `stages`, and `key_relationships` / `governing_constraint`.

### Validation findings

Pattern generalises across three Priority-1 archetypes. Flattening boundary is a recurring production-path property (code path + live GAM delivery + assembled-page absence). Outcome A — Architecture Investigation Justified. Schema redesign not justified.

---

## Threshold Assessment

### Manifestation Threshold

**Met** — Experiment 1 showed safe Tier 2 differentiation and educational visibility gains without inventing meaning.

### Propagation Investigation Threshold

**Met** — Experiments 2–3 showed additional archetypes with learner-relevant, non-recoverable plan information and manageable verbatim semantic risk.

### Architecture Investigation Threshold

**Met** — ≥2 independent high-value non-recoverable cases (three archetypes) + production-like boundary confirmation (final validation Outcome A).

### Schema Investigation Threshold

**Not Met** — Required semantics already exist as `archetype_plan`; problem is preservation/manifestation, not missing schema.

---

## Decisions

### Approved

* Close Sprint 63 as discovery/validation complete (Outcome A).  
* Treat synthesis as authoritative interpretation; final validation as generalisation/production confirmation.  
* Open Sprint 64 as **architecture investigation** of smallest viable preservation and manifestation mechanism.  
* Keep Experiments 1–3 as frozen non-production evidence.

### Not Approved

* Schema redesign.  
* Production renderer merge of cognitive manifestations.  
* Production propagation of archetype plans.  
* DLA/GAM semantic rewrite.  
* New activity-type architecture or vocabulary.  
* Inventing instructional content to fill gaps.

### Deferred

* Choice among preservation attachment points.  
* Choice among manifestation contracts.  
* Whether/when any production change is authorised (requires later sprint decision after Sprint 64 investigation).  
* `evaluation_judgement` deep propagation case (optional follow-on evidence).  
* Multi-reviewer blind educational panel.

---

## Sprint Outcome

```text
Outcome A — Architecture Investigation Justified
```

---

## Sprint 63 Close-Out Statement

> Sprint 63 concludes that differentiated cognitive structure is already encoded upstream across multiple Priority-1 archetype plans, that render-time Tier 2 manifestation can surface only part of it, that high-value intermediate reasoning structure (`required_links`, `stages`, `key_relationships`/`governing_constraint`) is systematically lost at the GAM→assembled-materials boundary in production-like paths, and that Sprint 64 is justified to **investigate** — not yet to implement in production — the smallest viable preservation and manifestation mechanism without schema redesign.
