# Sprint 44 Chat Handover Pack

**Date:** 2026-06-15  
**Type:** Continuation handover only — not a sprint history or investigation proposal  
**Audience:** Fresh chat continuing Sprint 44 implementation and material-quality work  
**Supersedes for new chats:** Sprint 43 handover packs for **starting point** — use **this document** as the Sprint 44 entry point

**Authoritative slice docs:**

- 44-1: [`../2026-06-13-sprint-44-gam-capture-validation-gate/sprint-44-slice-1-tiered-gam-capture-gate.md`](../2026-06-13-sprint-44-gam-capture-validation-gate/sprint-44-slice-1-tiered-gam-capture-gate.md)
- 44-2: [`../2026-06-15-sprint-44-instructional-depth-contracts/sprint-44-2-instructional-depth-contracts.md`](../2026-06-15-sprint-44-instructional-depth-contracts/sprint-44-2-instructional-depth-contracts.md)

**Sprint 43 reference (closed):** [`../2026-06-12-sprint-43-educational-salience/`](../2026-06-12-sprint-43-educational-salience/)

---

## Read This First — Start From Sprint 44

Sprint 43 is **closed**. A fresh chat must **not** restart the ownership or salience investigation.

**Start from:**

1. **44-1** — tiered GAM capture validation gate (designed, ready for implementation)
2. **44-2** — instructional depth contracts (Draft 1 accepted as reference)
3. Material realisation evaluation on Marx and Photosynthesis using 44-2

If the user pastes this pack, treat every **Settled** and **Do Not Reopen** section as authoritative.

---

## Settled From Sprint 43

| Finding | Status |
| ------- | ------ |
| **Presence ≠ salience** | Structure in upstream JSON ≠ structure owning learner experience |
| **Investigation-primary ownership** | Accepted (43-02) |
| **Resource-secondary ownership** | Accepted (43-02) |
| **Supporting structures only** | Activities, materials, capability, judgement, and PEL support the investigation — they do not own it |
| **Two-column manifestation model** | Accepted for learner-facing prototypes (journey compass left, disciplinary resource right) |
| **Marx prototype** | Demonstrated what a stronger learner-facing manifestation can look like; blind review 8–9/10 on educational quality; not an implementation proposal |
| **Photosynthesis comparison** | Architecture generalises across domains; instructional material weakness exposed more clearly than architectural failure |
| **Remaining quality gap** | **Instructional material realisation** — not workflow architecture, missing stages, or missing upstream pedagogy |

**Closed diagnosis (do not re-derive):**

> Educational architecture is stable. Learner-facing materials often fail to perform their instructional function even when structure and ownership targets are right.

Reference: [`../2026-06-12-sprint-43-educational-salience/43-02-ownership-model-decision.md`](../2026-06-12-sprint-43-educational-salience/43-02-ownership-model-decision.md), [`../2026-06-12-sprint-43-educational-salience/43-05-seamless-chat-handover-pack.md`](../2026-06-12-sprint-43-educational-salience/43-05-seamless-chat-handover-pack.md)

---

## Sprint 44 Purpose

Sprint 44 focuses on **improving learner-facing instructional material quality**.

The frontier is now:

| Theme | Sprint 44 focus |
| ----- | --------------- |
| GAM capture safety | Block structurally bad captures before Design Page |
| Instructional depth contracts | Explicit educational standards per material type |
| Material realisation quality | Whether materials perform their instructional move |
| Worked examples | Modelled reasoning before practice |
| Explanation quality | Text exposition that connects ideas |
| Misconception repair | Learner-facing error interruption |
| Transfer prompts | Own-context application |
| Consolidation summaries | Closure without spoiling learner production |
| Judgement criteria and rubrics | Criteria before learner judgement |

This is **implementation-oriented** work on capture gates, evaluation rubrics, and (later) pattern libraries — not a reopening of Sprint 43 architecture.

---

## Sprint 44 Active / Planned Slices

### 44-1 — Tiered GAM Capture Validation Gate

**Status:** Designed — ready for implementation  
**Spec:** [`sprint-44-slice-1-tiered-gam-capture-gate.md`](../2026-06-13-sprint-44-gam-capture-validation-gate/sprint-44-slice-1-tiered-gam-capture-gate.md)

**Purpose:** Prevent structurally bad GAM captures from silently entering learner-page composition.

**Key decisions:**

- Self-directed learner-page GAM step only
- Structural failures (JSON stub, missing pack format) **block** progression
- Coverage failures (missing materials vs upstream DLA) **block** when DLA available
- Thin material bodies **warn only** — do not block
- EV-38L / inflation-specific checks (FMT-06/07/08) are **not** universal gates
- No LLM repair, no renderer changes, no prompt changes

---

### 44-2 — Instructional Depth Contracts

**Status:** Draft 1 accepted as reference  
**Spec:** [`sprint-44-2-instructional-depth-contracts.md`](../2026-06-15-sprint-44-instructional-depth-contracts/sprint-44-2-instructional-depth-contracts.md)

**Purpose:** Make implicit instructional contracts explicit as educational design standards.

**Key point:** Educational design artefact — **not** an implementation spec. Defines minimum, strong, and failed realisation per type. Does not claim current generators consistently meet the bar.

**Material types covered:**

`text` · `worked_example` · `modelling_note` · `misconception_note` · `sample_output` · `decision_table` · `checklist` · `transfer_prompt` · `consolidation_summary` · `rubric` · `quality_criteria`

---

### 44-3 — Instructional Pattern Library

**Status:** Planned — not yet designed  
**Trigger:** After 44-2 contracts are used to evaluate Marx and Photosynthesis and shown to discriminate effectively

---

## Do Not Reopen

Unless the user **explicitly** requests it, a fresh chat must **not**:

| Do not… | Because… |
| ------- | -------- |
| Re-argue **ownership decision** | 43-02 accepted — Investigation primary, Resource secondary |
| Re-decide **two-column model** | Settled prototype manifestation direction |
| Re-diagnose **Sprint 43 salience problem** | Closed — gap shifted to material realisation |
| Ask whether **pedagogy exists upstream** | Settled — it does; realisation is the gap |
| Ask whether **workflow stages are missing** | Disproved in Sprint 42–43 |
| Treat **visuals / diagrams / charts** as Sprint 44 instructional-depth work | Separate workflow via page artefact visual affordances |

Sprint 44 improves **what materials achieve educationally** and **whether bad GAM captures are blocked** — not page ownership architecture or visual design.

---

## Marx and Photosynthesis — Carry Forward

### Marx

- Manual workflow run reviewed in Sprint 42–43; GAM materials substantively strong upstream
- **Marx Resource Prototype** (v3+) showed investigation-owned manifestation can score 8–9/10 educationally
- v4 design targets: synthesis, metacognitive depth, tutorial voice, explicit judgement criteria — informs 44-2 evaluation, not Sprint 43 reopening

### Photosynthesis

- Cross-domain comparison confirmed architecture generalises without domain-specific redesign
- Instructional material realisation weaker than structural coherence — tables/activities present but exposition, modelling, and closure moves often thin or collapsed
- Use as second evaluation domain for 44-2 contracts alongside Marx

---

## Immediate Next Task

**Recommended sequence for a fresh chat:**

1. **Implement or review implementation plan for 44-1** — tiered GAM capture gate per design spec
2. **Evaluate Marx and Photosynthesis material realisation** using 44-2 contracts (minimum / strong / failed per material type)
3. **Design 44-3 Instructional Pattern Library** if contracts discriminate effectively between weak and strong examples

Do not begin by re-running Sprint 43 investigation or requesting full Marx artefact re-paste unless the user explicitly asks.

---

## Quick Links

| Need | Document |
| ---- | -------- |
| Sprint 44 index | [`README.md`](README.md) |
| Current frontier | [`sprint-44-current-frontier.md`](sprint-44-current-frontier.md) |
| Slice index | [`sprint-44-slice-index.md`](sprint-44-slice-index.md) |
| Sprint 43 closure | [`../2026-06-12-sprint-43-educational-salience/README.md`](../2026-06-12-sprint-43-educational-salience/README.md) |
