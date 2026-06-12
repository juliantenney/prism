# Sprint 43 — Educational Salience

**Status:** Open — investigation phase  
**Entry point:** [`handover-from-sprint-42.md`](handover-from-sprint-42.md)  
**First investigation:** [`43-01-investigation-plan.md`](43-01-investigation-plan.md)

**Prior sprint (closed):** [`../2026-06-11-sprint-42-authorial-quality-educational-exposition/`](../2026-06-11-sprint-42-authorial-quality-educational-exposition/)

---

## Sprint purpose

Sprint 43 addresses the **remaining quality gap** identified at Sprint 42 closure: PRISM generates substantial educational structure upstream, but the **final learner page does not consistently foreground that structure** as the learner’s primary experience.

The sprint investigates **educational salience** — how visible, recognisable, and influential inquiry, judgement, progression, metacognition, and independence are in learner-facing outputs — and **narrative authority** — which artefact or layer owns the learner’s reading path.

Sprint 43 is a **decision and validation** sprint. It does not assume that more pedagogy, workflow stages, or framework architecture are required.

---

## Why Sprint 42 closed

Sprint 42 investigated **Authorial Quality / Educational Exposition** through source-ingest parity (42-10), static Design Page provenance audit (42-11A), PEL manifestation audit (42-12), manual Marx workflow review, and synthesis (42-13).

**Key findings:**

| Finding | Source |
| ------- | ------ |
| Workflow is **not missing a stage** | 42-8, handover, 42-10 |
| **Learner journey, exposition, judgement, and transfer exist** upstream | Marx manual run, 42-4B, 42-13 |
| **PEL exists** in DLA/GAM prompts and fields but is **weakly protected** at Design Page | 42-12 Verdict B |
| **Source-ingest parity achieved** — both routes produce `learning_content` before Model Knowledge | 42-10 |
| **Design Page is activity-centred** — hard contracts favour `learning_activities` + preserved materials | 42-11A Verdict A |
| **Rendered pages read activity-led** even when inquiry is strong upstream | Marx manual run, 42-13 |

Sprint 42 closed because the **missing-ingredients hypothesis was disproved**. The open problem is **salience / authority**, not pipeline completeness.

Problem reframing: [`../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/43-00-problem-reframing-educational-salience.md`](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/43-00-problem-reframing-educational-salience.md)

---

## Core problem statement

> Educational structure exists but does not consistently **own** the learner experience.

PRISM already generates inquiry, conceptual structure, capability progression, instructional beats, activities, materials, and metacognitive cues across artefacts. Learners often encounter **Activity → Activity → Activity** rather than **Question → Explanation → Investigation → Judgement → Reflection**.

The shift from Sprint 42 to Sprint 43:

| From | To |
| ---- | -- |
| Generate better educational structure | Make existing structure more **visible, influential, and learner-experienced** |

---

## Scope

Sprint 43 investigates:

| Theme | Focus |
| ----- | ----- |
| **Educational salience** | Whether learners encounter and recognise structures already present |
| **Narrative authority** | Which layer owns page structure and reader expectations |
| **Learner-facing composition** | How Design Page assembles upstream signals into experience |
| **Inquiry visibility** | Governing question and investigation arc as primary frame |
| **Judgement visibility** | Evaluation development across the resource, not only final tasks |
| **Metacognitive visibility** | PEL/self-monitoring as meaningful learner experience |
| **Independence visibility** | Scaffold fade and growing learner agency |

Work may include investigations, benchmark artefact audits, salience rubrics, and decision notes. Implementation slices are **out of scope until** the key decision (see handover) and success criteria are agreed.

---

## Out of scope

Unless explicitly rescoped in a later slice:

- New workflow stages
- Schema redesign
- Renderer replacement or structural renderer redesign
- Removal of DLA or GAM from the pipeline
- Weakening preservation contracts (GAM verbatim merge, PREC-02, table fidelity, activity membership)
- Reopening Sprint 41 EQF/PEL architecture as the primary lever
- Default hypothesis that more pedagogy or missing upstream ingredients explain quality gaps

---

## Key questions

Strategic questions only — not answered at sprint open:

1. **What should be the primary organising unit of a learner page?**
2. **Should inquiry own page structure**, or remain wrapper-level enrichment?
3. **Should activities serve investigations** rather than define them?
4. **Should `learning_content` become an explicit page-level spine** with structural authority?
5. **How should judgement development be recognisable** across the full resource?
6. **How should PEL become learner-visible** without heavy reflective workload or diary tone?
7. **What constitutes sufficient educational salience** for self-study vs facilitated delivery?
8. **What exact learner experience should Design Page be optimising for?** (see handover — decision required before implementation)

---

## Decisions

### 43-02 — Ownership Model Decision

Accepted:

- Primary owner: Investigation
- Secondary owner: Resource

Summary:

For self-directed higher-education resources, PRISM treats the investigation as the primary learner-facing organising unit and the resource as the secondary organising unit. Activities, materials, capability progression, judgement and PEL remain essential supporting structures but are not the primary owners of the learner experience.

Reference:

- [`43-02-ownership-model-decision.md`](43-02-ownership-model-decision.md)

---

## Success criteria

Observable **learner-facing** outcomes — not upstream artefact completeness:

| Criterion | Indicator |
| --------- | --------- |
| Inquiry trajectory | Reviewer can state governing question and arc without inferring only from activity titles |
| Progression recognition | Reviewer can describe capability build across the resource |
| Judgement development | Reviewer can trace deepening evaluation beyond one final task |
| Growing independence | Reviewer can identify scaffold fade and increasing agency |
| Metacognitive meaningfulness | PEL cues are visible and purposeful, not buried labels |
| Structural coherence | Page reads as one investigation with embedded activities |
| Fidelity preserved | Activity membership and materials verbatim preservation remain intact on benchmarks |

Success is judged on **rendered experience** and structured reviewer audit, validated on benchmark workflows (Marx self-study primary; inflation/climate secondary).

---

## Evidence base inherited from Sprint 42

| Document | Role |
| -------- | ---- |
| [`42-13-sprint-synthesis-authorial-quality-findings.md`](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/42-13-sprint-synthesis-authorial-quality-findings.md) | **Authoritative closure synthesis** |
| [`43-00-problem-reframing-educational-salience.md`](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/43-00-problem-reframing-educational-salience.md) | Sprint 43 problem definition |
| [`42-11A-design-page-static-provenance-audit.md`](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/42-11A-design-page-static-provenance-audit.md) | Narrative authority / activity dominance |
| [`42-12-pel-manifestation-audit.md`](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/42-12-pel-manifestation-audit.md) | PEL upstream vs page-level weakness |
| [`42-8-resource-spine-investigation.md`](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/42-8-resource-spine-investigation.md) | LC as intellectual spine; DLA as page organiser |
| [`sprint-42-slice-10-source-ingest-learning-content-parity.md`](../2026-06-11-sprint-42-authorial-quality-educational-exposition/sprint-42-slice-10-source-ingest-learning-content-parity.md) | Route parity implementation |
| Marx manual run artefacts | Highest-confidence learner-experience evidence (prefer over Sprint 30 fixtures) |

**Sprint 41 baseline (do not reopen):** [`../2026-06-11-sprint-41-educational-framework-integration/sprint-41-closure-report.md`](../2026-06-11-sprint-41-educational-framework-integration/sprint-41-closure-report.md)

---

## Key principle

Preserve cognitive activity, materials fidelity, and educational structure Sprint 40–42 established. Improve **how** the learner **encounters and experiences** that structure — not **whether** it exists upstream.
