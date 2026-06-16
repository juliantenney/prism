# Current Educational Theory — PRISM (Post Sprint 44)

**Date:** 2026-06-18  
**Type:** Educational model for Sprint 45 continuation  
**Scope:** Theory only — no implementation, no prompts, no code

---

PRISM's educational theory describes how self-directed higher-education resources should be **owned**, **experienced**, and **instructionally realised**. Sprint 45 adds: how **validated patterns** operationalise that theory at the **material generation** layer — without reopening architecture.

---

## Ownership Model (Settled)

### Primary: Investigation

The governing inquiry organises the learner experience:

**Question → Explanation → Investigation → Judgement → Reflection**

### Secondary: Resource

Continuous self-study voice — orientation, explanation, conceptual development, synthesis — while the investigation unfolds.

### Supporting structures (non-owning)

Activities, materials, capability progression, judgement development, and PEL are essential but subordinate.

**Sprint 45 constraint:** Pattern injection must preserve learner ownership mechanisms — patterns scaffold; they do not complete the learner's investigation.

---

## Patterns as Operational Manifestations

Sprint 44 patterns are not a parallel pedagogy system. They are **operational shapes** that satisfy 44-2 contracts within the settled architecture:

| Layer | Role |
| ----- | ---- |
| **44-2 contracts** | What each material type must achieve educationally |
| **Patterns (SP-01–SP-06)** | Reusable strong-realisation shapes evidenced on benchmark corpus |
| **Meta-principles (MP-1–MP-8)** | Cross-pattern regularities — orientation only |
| **Failure modes (FM-02–FM-11)** | Named under-realisation shapes to avoid |

Patterns translate abstract contract requirements into **concrete material-body features** — partial exemplar rows, operational completion criteria, criteria-linked checklist rows — that a generation experiment can target and an evaluator can detect.

Patterns do **not** replace contracts. Evaluation verdicts remain governed by 44-2 §5.x.

---

## Scaffold ≠ Deliverable (MP-1)

The most important cross-pattern principle for Sprint 45:

- Materials may **scaffold** learner production without **delivering** the answer
- Decision tables model one row; learner completes judgement cells
- Transfer prompts specify completion criteria; learner selects context and writes transfer
- Consolidation scaffolds angles; learner synthesises — no pre-written capstone

**Generation risk:** Pattern injection that "helps" by filling learner-owned cells or pre-writing transfer answers violates the educational model even if surface structure matches the pattern.

**Detection:** Pattern entries include weak-pattern guards and learner-ownership checks in Detection Signals sections.

---

## Learner Ownership

Learner ownership means the material prepares the learner to **perform the move independently** — not that the material performs it for them.

| Material move | Learner owns |
| ------------- | ---------- |
| Decision / judgement | Evaluative conclusion in empty cells |
| Transfer | Own-context selection and written application |
| Consolidation | Synthesis across angles — not supplied answer |
| Worked example | Parallel task after modelled reasoning |
| Verification checklist | Self-check against criteria — not author completion |

Sprint 45 success requires **no regression** in learner ownership — measurable alongside pattern signal presence.

---

## Criteria Linkage (MP-4)

Strong materials often **link explicitly** to criteria established in adjacent materials:

- Checklists reference decision-table dimensions or rubric criteria
- Transfer prompts reference evaluative standards from prior activities
- Verification moves test reasoning quality, not row completeness alone (MP-6)

Pattern injection should preserve **cross-material coherence** within an activity — not optimise a single body in isolation.

---

## Modelling Without Completing Learner Judgement (MP-2)

Worked examples and decision tables **model the move** before independent production:

- Partial exemplar row shows reasoning on one case; other rows await learner judgement
- Worked example shows visible reasoning chain; parallel task follows

**Anti-pattern:** Full exemplar tables where every row is pre-filled; worked examples that are answer keys without bridge to learner task.

SP-02 and SP-06 encode this distinction; SP-02 is the clearer generation target for Sprint 45 first slice.

---

## Transfer With Learner-Context Selection (SP-03)

Strong transfer prompts require:

- Substantive body (not thin procedural stub — FM-02)
- Learner selects own context (not third-person hypothetical only — FM-03)
- Operational completion criteria (MP-5) — what "done" looks like
- No pre-written transfer answer

Failed Photosynthesis M14 is the canonical contrast: presence of transfer slot without instructional function.

---

## Body Quality vs Composition Channel

Two distinct quality channels must not be conflated:

| Channel | What it measures | Example issues |
| ------- | ---------------- | -------------- |
| **GAM material body** | Instructional realisation per 44-2 | FM-04 table shell; FM-02 thin transfer |
| **Capture emission** | Stub or invalid body at source | FM-01 `"as above"` |
| **Page composition** | Material lost or thinned at compose | FM-12 page-composition loss |

Sprint 45 pattern experiments target **GAM body generation**. Composition and capture issues may be addressed by 44-1 implementation or 45-4 repair — but scoring them as instructional pattern failure is a method error.

---

## Salience and Manifestation (Background)

Sprint 43 settled that pipeline pages read activity-led while prototypes can manifest investigation-owned structure. Sprint 44 reframed the active frontier as **material realisation**.

Sprint 45 does not reopen manifestation work unless explicitly rescoped. Pattern-guided generation operates on **material bodies** within the settled architecture.

---

## Theory Statement for Sprint 45

> Validated instructional patterns are evidence-backed operational shapes that help GAM produce material bodies meeting 44-2 strong-realisation signals — while preserving investigation-primary ownership and learner production of judgement, transfer, and synthesis.

Sprint 45 tests whether that statement holds in practice — it does not assume it.

---

## Reference Documents

| Document | Role |
| -------- | ---- |
| [`../../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md`](../../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md) | Contract theory per material type |
| [`../../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md`](../../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md) | Pattern architecture + MPs |
| [`../../2026-06-15-sprint-44/patterns/`](../../2026-06-15-sprint-44/patterns/) | Operational pattern specs |
