# Sprint 56B — CP-4 Architecture Approval Brief

**Sprint:** 56B — Design Page Migration Planning & Architecture Approval  
**Checkpoint:** **CP-4** — Derived architecture approval  
**Status:** **Approved** (2026-07-06)  
**Date:** 2026-07-06  

**Purpose:** Consolidate Sprint 56B findings into a single architecture approval package for stakeholder decision. This brief is **not** an implementation plan.

**Governing artefact index:** [SPRINT-56B-ARCHITECTURE-APPROVAL-TRACKER.md](SPRINT-56B-ARCHITECTURE-APPROVAL-TRACKER.md)

---

## 1. Executive recommendation

**Approve the Sprint 56B target architecture.**

Approve Design Page as a **Transport-and-Organisation Stage** with **limited Assembly-Coherence** responsibilities.

**Approve transition to Sprint 56C implementation** — **CP-4 approved** 2026-07-06.

---

## 1.1 CP-4 approval assessment

**CP-4 Architecture Approval: Approved.**

No unresolved item currently appears capable of materially altering the target architecture. Remaining questions concern:

- **SQ-1 / SQ-2** — upstream knowledge-summary packaging
- **SQ-F1 / SQ-F2** — facilitator profile and `support_notes` policy
- **SQ-VA-4** — optional explicit VA metadata consumers
- **OQ-24 / OQ-25** — validation and fixture planning

These do not invalidate CP-4 approval.

**Target architecture freeze:** Sprint 56B Target Architecture is **frozen** as of CP-4 approval. Any change to a governing principle requires a **new architecture decision**, not an implementation detail.

**Guardrails:** [SPRINT-56B-ARCHITECTURE-GUARDRAILS.md](SPRINT-56B-ARCHITECTURE-GUARDRAILS.md)

**Tracker:** [SPRINT-56B-ARCHITECTURE-APPROVAL-TRACKER.md](SPRINT-56B-ARCHITECTURE-APPROVAL-TRACKER.md)

---

## 2. Architecture before Sprint 56B

Design Page contained multiple overlapping responsibilities:

- preservation
- organisation
- wrapper authoring
- knowledge summarisation
- study-tip synthesis
- journey rhetoric
- visual affordance generation
- optimisation behaviours
- readability shaping

**Resulting concerns:**

- ownership ambiguity
- content duplication
- knowledge re-synthesis
- fidelity risk
- wrapper accretion
- unclear Layer 3 scope

Sprint 56A identified these issues through:

- [failure modes](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-FAILURE-MODES.md)
- [architecture audit findings](../2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/DESIGN-PAGE-ARCHITECTURE-AUDIT.md)
- [target derivation analysis](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-TARGET-ARCHITECTURE-DERIVATION.md)
- [dependency mapping](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-DEPENDENCY-ANALYSIS.md)

---

## 3. Architecture after Sprint 56B

Design Page responsibilities are reduced to:

| Layer | Name | Scope |
| ----- | ---- | ----- |
| **Layer 1** | Preserve & Embed | Verbatim transport of upstream bodies |
| **Layer 2** | Organise | Schema, membership, ordering, metadata, passive carry |
| **Layer 3** | Assembly-Coherence Support | **Bounded** — thin prose only where assembly-time visibility requires it |

**Design Page identity:**

> **Transport-and-Organisation First**

---

## 4. Approved architecture principles

### 4.1 Assembly-Time Ownership

Design Page may create learner-facing content **only** when that content depends on information that becomes available for the first time during page assembly.

**Normative artefact:** [DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md](DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) v1.0

### 4.2 Preservation First

Educational substance is authored **upstream**.

Design Page does **not** re-author educational substance.

### 4.3 Presentation Inference Constraint

Design Page and renderers **may:**

- organise
- transport
- validate
- structure
- present

They **may not:**

- summarise
- explain
- reinterpret
- create pedagogy
- generate instructional content

**Normative artefact:** [DESIGN-PAGE-PRESENTATION-INFERENCE-CONSTRAINT.md](DESIGN-PAGE-PRESENTATION-INFERENCE-CONSTRAINT.md) v1.0

### 4.4 Renderer Independence Principle

Renderers must **not** require external generative services to create educational content.

Removal of an API key or optional metadata path must **not** alter educational substance. Learner-completable output depends on **embedded upstream bodies**, not downstream invention.

---

## 5. Major decisions

### Decision D1 — OQ-02 Assembly-Time Ownership

| Field | Value |
| ----- | ----- |
| **Approved direction** | Bounded Assembly-Time Ownership |
| **Outcome** | Thin assembly-coherence prose allowed; instructional authoring denied |
| **Artefact** | [Assembly-Time Ownership Test](DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) |
| **Tracker** | D1 — pending CP-4 sign-off |

---

### Decision D2 — OQ-17 Knowledge Summary Policy

| Field | Value |
| ----- | ----- |
| **Approved direction** | **Transport-or-Omit** |
| **Outcome** | DP-authored summaries removed; upstream transport permitted; omission permitted |
| **Artefact** | [OQ-17 review](DESIGN-PAGE-OQ-17-KNOWLEDGE-SUMMARY-POLICY-REVIEW.md) |
| **Tracker** | D2 — pending CP-4 sign-off |

---

### Decision D3 — OQ-13 Visual Affordance Ownership

| Field | Value |
| ----- | ----- |
| **Approved direction** | Remove generative VA from Design Page |
| **Outcome** | VA not part of DP identity |
| **Artefact** | [OQ-13 review](DESIGN-PAGE-OQ-13-VISUAL-AFFORDANCES-OWNERSHIP-REVIEW.md) |
| **Tracker** | D3 — pending CP-4 sign-off |

---

### Decision D4 — OQ-14 Visual Affordance Relocation

| Field | Value |
| ----- | ----- |
| **Approved direction** | **Layered ownership** |
| **Default** | Intent → upstream · Substance → upstream · Presentation → renderer |
| **Outcome** | Renderer inference permitted; renderer authoring prohibited |
| **Artefact** | [OQ-14 review](DESIGN-PAGE-OQ-14-VISUAL-AFFORDANCES-RELOCATION-TARGET-REVIEW.md) |
| **Tracker** | D4 — pending CP-4 sign-off |

---

### Decision D5 — OQ-15 `source_basis`

| Field | Value |
| ----- | ----- |
| **Approved direction** | **Remove** from default architecture |
| **Outcome** | No `source_basis` cite-without-embed on compose path |
| **Artefact** | [OQ-15/16 closure](DESIGN-PAGE-OQ-15-16-VA-CLEANUP-CLOSURE-REVIEW.md) |
| **Tracker** | D5 (tracker) — closed (planning) |

---

### Decision D6 — OQ-16 Schema 38.4

| Field | Value |
| ----- | ----- |
| **Approved direction** | **Conditional only** — not mandatory Design Page scope |
| **Outcome** | Universal empty-array emission deprecated; optional path only |
| **Artefact** | [OQ-15/16 closure](DESIGN-PAGE-OQ-15-16-VA-CLEANUP-CLOSURE-REVIEW.md) |
| **Tracker** | D5 (tracker) — closed (planning) |

---

### Additional decisions (boundary package)

| ID | Decision | Approved direction | Tracker |
| -- | -------- | ------------------ | ------- |
| **D6†** | OQ-09 Wrapper stack | Collapse to **single thin assembly-coherence bridge**; remove journey / rhetoric / secondary author layers | D6 |
| **D7†** | Brevity params on DP | **Remove** from Design Page emit path | D7 |

† Tracker IDs D6/D7 — distinct from brief D5/D6 (OQ-15/OQ-16).

---

## 6. Boundary review outcomes

| Area | Approved direction |
| ---- | ------------------ |
| **Wrapper stack** | Collapse to single thin assembly-coherence bridge. **Remove:** journey stack, rhetoric stack, secondary author layer |
| **Knowledge layer** | Transport-or-omit. **No** Design Page synthesis |
| **Visual affordances** | **Not** a Design Page responsibility |
| **Readable assembly (R-83)** | Self-contained, well-structured **Layer 2** artefact with correct membership, defensible ordering, meaningful headings, complete transport — **without** rewriting, summarising, condensing, or optimising educational content |

**Detail:** [Remaining stakeholder decisions consolidation](DESIGN-PAGE-REMAINING-STAKEHOLDER-DECISIONS-CONSOLIDATION-REVIEW.md)

### Wrapper and guardrail splits (R-36–R-48, R-84–R-85)

| ID | Disposition |
| -- | ----------- |
| R-36 | Split — structural journey framing only; pedagogical inquiry arc upstream |
| R-37 | Split — structural overview optional/thin; pedagogical overview transport-or-omit |
| R-48 | Relocate — voice to brief/`page_profile` policy; not DP content |
| R-84 | Page variant — facilitator profile; transport upstream run guidance |
| R-85 | Section slot + transport-or-omit for `support_notes` body |

---

## 7. Remaining stakeholder decisions

These **do not reopen** Design Page ownership. They concern **upstream packaging** and **product policy**.

| ID | Question |
| -- | -------- |
| **SQ-1** | Does LC/KM emit a **transportable** knowledge summary field? |
| **SQ-2** | Are learner-profile knowledge summaries **mandatory**? |
| **SQ-F1** | Minimum facilitator-content requirements (domain §18 vs upstream-only transport) |
| **SQ-F2** | Source of `support_notes` content for transport |

**Action at CP-4:** Record decisions or accepted deferral with owner.

---

## 8. Non-blocking deferred items

| ID | Topic | Affects |
| -- | ----- | ------- |
| **SQ-VA-4** | Future consumers of explicit VA metadata | Optional VA artefact path |
| **OQ-24** | Dual-path validation strategy (Copilot vs PRISM repair) | CP-3 validation planning |
| **OQ-25** | Fixtures and validation baseline | CP-3 / CP-5 implementation plan |

These affect **validation and implementation planning**. They **do not** block target architecture approval at CP-4.

---

## 9. Sprint 56C recommendation

Upon **CP-4 approval:**

1. **Freeze** target architecture.
2. Treat Sprint 56B ownership decisions as **authoritative**.
3. Use the **Assembly-Time Ownership Test** and **Presentation Inference Constraint** as governance artefacts.
4. **Execute** migration via **Sprint 56C** per [implementation plan](SPRINT-56B-IMPLEMENTATION-PLAN.md).
5. **Validate** migration through fixtures (OQ-25) and dual-path review (OQ-24).

**Programme note:** Sprint **56C** is the Design Page migration execution sprint. Sprint **57** is reserved for future roadmap work and is not part of this migration.

**As-built reference:** [Sprint 57 architecture state](../2026-07-01-sprint-57-learner-experience-product-quality/SPRINT-57-ARCHITECTURE-STATE.md) lists DP as VA owner — **superseded** by CP-4 target architecture for migration planning.

---

## 10. Approval request

### Requested CP-4 decision

| # | Request |
| - | ------- |
| 1 | **Approve** Sprint 56B target architecture |
| 2 | **Approve** Design Page as a transport-and-organisation stage with bounded assembly-coherence responsibilities |
| 3 | **Approve** transition into **Sprint 56C** implementation |
| 4 | **Record** SQ-1, SQ-2, SQ-F1, SQ-F2 as stakeholder follow-ups |
| 5 | **Record** OQ-24, OQ-25, SQ-VA-4 as non-blocking deferred items |

### Sign-off

| Role | Name | Date | Notes |
| ---- | ---- | ---- | ----- |
| Planning lead | Sprint 56B planning | 2026-07-06 | **Approved** — subject to follow-ups in §1.1 |
| Technical review | Sprint 56B planning | 2026-07-06 | Target architecture frozen |

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `SPRINT-56B-CP-4-ARCHITECTURE-APPROVAL-BRIEF.md` |
| Checkpoint | CP-4 |
| Supersedes | Ad-hoc approval discussions — single consolidated package |

**Planning and approval artefact only. No implementation implied.**
