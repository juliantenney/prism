# PRISM Executive Summary — Sprint 44 Entry Point

**Date:** 2026-06-15  
**Audience:** Fresh contributors continuing Sprint 44 without prior chat history  
**Status:** Authoritative continuation context — Sprint 43 closed, Sprint 44 open

---

## What PRISM Is Doing Now

PRISM is a learning-design workflow that produces self-directed higher-education learner resources through a chain of artefacts: learning content, knowledge model, outcomes, episode plans, learning activities, activity materials, learning sequence, and composed learner page.

Through Sprints 40–43, the programme established that the workflow generates substantial educational structure upstream. The open problem is no longer “missing pedagogy” or “missing workflow stages.” The open problem is whether learner-facing **materials perform their instructional function** — and whether structurally invalid material captures can reach composition silently.

**Sprint 44** addresses that layer: GAM capture safety, explicit instructional depth contracts, and cross-domain evaluation of material realisation.

---

## What Sprint 43 Was Trying to Solve

Sprint 42 closed with a reframed diagnosis. PRISM produced coherent inquiry, exposition, judgement, transfer, and metacognitive structure across upstream artefacts, but final learner pages often read as **Activity → Activity → Activity** rather than **Question → Explanation → Investigation → Judgement → Reflection**.

Sprint 43 named this gap **educational salience** and **narrative authority**:

- **Salience** — can the learner encounter and recognise structure as organising the resource on a normal read?
- **Authority** — which layer owns what the resource “is” for the learner?

Sprint 43 did not assume more workflow stages, schemas, or pedagogy packs were needed. It investigated **what should own the learner experience** and **how stronger manifestation could be validated** before implementation.

---

## What Was Investigated

| Investigation | Outcome |
| ------------- | ------- |
| Manual Marx self-study workflow (“Was Marx Right?”) | Highest-confidence end-to-end evidence: upstream artefacts educationally coherent; rendered page activity-led |
| Design Page static provenance audit (42-11A) | Activity stack and preserved materials dominate structure and visual weight |
| PEL manifestation audit (42-12) | PEL strong at DLA/GAM; weakly protected at page level |
| Source-ingest parity (42-10) | Both routes produce learning content before knowledge model — resolved |
| Ownership models (activity, investigation, resource, capability, judgement, material, hybrid) | Prioritised hybrid accepted: Investigation primary, Resource secondary |
| Marx Resource Prototype (v3+) | Manual two-column manifestation using real GAM materials; blind educational review 8–9/10 |
| Cross-domain comparison (Photosynthesis) | Architecture generalises; material realisation gaps more visible than architectural failure |
| Implicit instructional contracts in system | Distributed across prompts, validators, preservation — consolidated in Sprint 44-2 |

---

## What Became Settled

### Educational architecture

- **Investigation-primary ownership** — governing inquiry organises the learner experience
- **Resource-secondary ownership** — coherent self-study voice teaches while investigation unfolds
- **Supporting structures only** — activities, materials, capability progression, judgement development, and PEL serve the investigation-and-resource frame; they do not own it

### Salience diagnosis

- **Presence ≠ salience** — structure in JSON, fields, or prompts does not guarantee the learner experiences it as organising the resource
- **Desired learner arc:** Question → Explanation → Investigation → Judgement → Reflection
- **Confirmed pipeline arc (pre-manifestation):** Overview → Learning Outcomes → Learning Activities → Activity 1…N

### Manifestation direction

- **Two-column learner-facing model accepted** for prototypes: lightweight journey compass (left) + full disciplinary resource (right)
- Marx prototype demonstrated that investigation-owned presentation can score strongly educationally without changing upstream GAM substance

### Cross-domain

- **Marx** — strong upstream materials; manifestation was the bottleneck; prototype validated ownership direction
- **Photosynthesis** — workflow architecture holds across domain; instructional material weakness exposed clearly

### Visuals

- Diagrams, charts, and visual summaries are handled by a **separate workflow** using visual affordances from page artefacts — not part of Sprint 44 instructional-depth work

### Current quality gap (frontier)

- **Instructional material realisation** — whether text, worked examples, checklists, transfer prompts, consolidation, rubrics, and related types actually perform their educational move
- This supersedes the Sprint 43 framing of “salience / manifestation bottleneck” as the **primary** open work item for Sprint 44, while salience findings remain settled background

---

## What Was Disproven

| Hypothesis | Status |
| ---------- | ------ |
| Workflow is missing a stage | **Disproved** |
| Pedagogy is missing upstream | **Disproved** |
| DLA destroys inquiry | **Disproved** |
| GAM collapses instructional depth (on Marx) | **Disproved** |
| Source-ingest route lacks learning content | **Resolved** (42-10) |
| Problem is only Design Page composition | **Refined** — manifestation mattered in Sprint 43; material realisation is now the sharper frontier |
| Default fix is “add more pedagogy” | **Disproved** |

---

## What Remains Open

| Open item | Sprint 44 response |
| --------- | ------------------- |
| Structurally bad GAM captures reaching Design Page | **44-1** — tiered capture validation gate (designed, ready for implementation) |
| No unified educational spec for material types | **44-2** — instructional depth contracts (Draft 1 accepted as reference) |
| Uneven material quality on benchmarks | Post-44-2 evaluation on Marx and Photosynthesis |
| Reusable strong-realisation patterns | **44-3** — instructional pattern library (planned, not yet designed) |
| Pipeline manifestation matching prototype salience | Out of Sprint 44 scope unless user rescopes — settled as direction, not current implementation target |
| Whether depth contracts discriminate effectively | Empirical question for 44-2 evaluation |

---

## Why Sprint 44 Exists

Sprint 43 closed the architectural investigation. Ownership, salience diagnosis, two-column manifestation direction, and cross-domain generalisation are settled.

Sprint 44 shifts from **what should own the learner experience** to **what each learner-facing material must achieve educationally** and **whether capture-layer safety prevents silent structural failure**.

Three problems converge:

1. **Capture safety** — JSON stubs and under-covered GAM output can enter composition without blocking the workflow step
2. **Contract dispersion** — instructional expectations for material types exist but are not expressed as one educational specification reviewers can apply
3. **Realisation gap** — Marx and Photosynthesis both show materials present in structure but often thin, collapsed, or functionally wrong (synopsis not exposition, template not worked example, prompt_set not consolidation)

Sprint 44 is **implementation-oriented** on capture gates and **design-oriented** on depth contracts — not a reopening of Sprint 43 ownership or salience debates.

---

## Sprint 44 at a Glance

| Slice | Status | Purpose |
| ----- | ------ | ------- |
| **44-1** Tiered GAM capture validation gate | Designed — ready for implementation | Block structural/coverage failures; warn on thin bodies |
| **44-2** Instructional depth contracts | Draft 1 accepted as reference | Educational standards for eleven material types |
| **44-3** Instructional pattern library | Planned | Strong-realisation patterns if 44-2 discriminates |

**Recommended continuation order:** implement or plan 44-1 → evaluate Marx and Photosynthesis with 44-2 → design 44-3 if warranted.

---

## How to Use This Pack

Read in order:

1. This executive summary
2. Settled decisions register
3. Evidence pack
4. Current educational theory
5. Current frontier
6. Fresh chat bootstrap (paste into new ChatGPT conversation)

Do not restart Sprint 43 investigations. Start from Sprint 44.
