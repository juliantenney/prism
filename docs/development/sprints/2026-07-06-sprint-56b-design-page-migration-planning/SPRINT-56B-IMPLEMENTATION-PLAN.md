# Sprint 56B — Implementation Plan

**Sprint:** 56B — Design Page Migration Planning & Architecture Approval  
**Status:** **CP-5 populated** — pending CP-6 approval  
**Execution sprint:** Sprint 56C  
**Successor:** [Sprint 56C](../2026-07-06-sprint-56c-design-page-migration-execution/SPRINT-56C-START-HERE.md)  
**Date:** 2026-07-06  

**Authority:** [SPRINT-56B-CP-4-ARCHITECTURE-APPROVAL-BRIEF.md](SPRINT-56B-CP-4-ARCHITECTURE-APPROVAL-BRIEF.md) (CP-4 approved)  
**Guardrails:** [SPRINT-56B-ARCHITECTURE-GUARDRAILS.md](SPRINT-56B-ARCHITECTURE-GUARDRAILS.md)  
**Sequencing evidence:** [DESIGN-PAGE-MIGRATION-STRATEGY.md](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-MIGRATION-STRATEGY.md)  
**Approval tracker:** [SPRINT-56B-ARCHITECTURE-APPROVAL-TRACKER.md](SPRINT-56B-ARCHITECTURE-APPROVAL-TRACKER.md)

**This document is implementation planning only. It does not modify prompts, code, workflows, or execute migration.**

---

## Document control

| Field | Value |
| ----- | ----- |
| Version | 1.0 |
| Created | 2026-07-06 |
| CP-4 reference | Approved 2026-07-06 — target architecture frozen |
| CP-6 approval | Pending |
| Implementation sprint | **Sprint 56C** |

---

## 1. Purpose

Sprint 56B established the **target Design Page architecture** through evidence review (Sprint 56A) and ownership decisions (OQ-02, OQ-17, OQ-13–16, boundary consolidation).

**CP-4 approved** that target architecture on 2026-07-06. The architecture is **frozen** — governing principles may not be reinterpreted during implementation.

**Sprint 56C** will **implement** approved changes against the as-built system. This plan governs **implementation sequencing**, **dependencies**, **validation**, and **compliance** — not code-level design.

**Checkpoint flow:** CP-5 (this plan) → CP-6 (plan approval) → **Sprint 56C** execution → architecture compliance review (Wave 4).

---

## 2. Scope

### In scope

| Area | Description |
| ---- | ----------- |
| **Design Page migration** | Align emit path, contracts, and responsibilities with CP-4 identity |
| **Wrapper simplification** | Collapse triple stack to single thin assembly-coherence bridge (D6) |
| **Knowledge ownership** | Transport-or-omit policy; remove DP synthesis (D2, OQ-17) |
| **VA ownership** | Remove generative VA from DP; layered relocation (D3–D5, OQ-13–16) |
| **Brevity / optimisation removal** | Remove brevity params as content-shaping controls (D7) |
| **Guardrail alignment** | Narrow R-83; retain preservation guardrails (R-22, R-24, R-46, R-50) |
| **Validation readiness** | Fixture definitions, dual-path review framework, compliance checks (OQ-24, OQ-25) |

### Out of scope

| Area | Rationale |
| ---- | --------- |
| **New architecture discovery** | CP-4 closed; frozen principles |
| **Reopening approved decisions** | See §11 Non-Goals |
| **Assessment architecture** | Future topic — [guardrails §E](SPRINT-56B-ARCHITECTURE-GUARDRAILS.md) |
| **New feature development** | Migration programme only |
| **Renderer enhancement work** | Presentation may continue under Presentation Inference Constraint; no new authoring |
| **Upstream step redesign** | LC/KM/GAM/DLA changes limited to packaging needed for transport (SQ-1, SQ-2) |

---

## 3. Approved architecture baseline

Implementation must conform to the following **frozen** baseline ([CP-4 brief](SPRINT-56B-CP-4-ARCHITECTURE-APPROVAL-BRIEF.md) §3–4).

### Identity

> **Design Page = Transport-and-Organisation First**

Limited **Assembly-Coherence** responsibilities only where [Assembly-Time Ownership Test](DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) permits.

### Layers

| Layer | Name | Implementation obligation |
| ----- | ---- | ------------------------- |
| **1** | Preserve & Embed | Verbatim GAM/DLA/assessment/DEP transport — **non-negotiable** |
| **2** | Organise | Schema, membership, ordering, metadata, passive carry |
| **3** | Assembly-Coherence Support | **Bounded** thin prose + reduced guardrails — not authoring stack |

### Governing principles

| Principle | Requirement |
| --------- | ----------- |
| **Assembly-Time Ownership** | DP generative prose only when T3 = Yes **and** §4 Allowed categories apply |
| **Preservation First** | Educational substance authored upstream; DP transports |
| **Presentation Inference Constraint** | DP and renderer: organise/present — not instruct, summarise, or reinterpret |
| **Renderer Independence Principle** | Learner output must not depend on API-key-backed or downstream generative services |

### Acceptance invariant (from 56A audit)

> Can a learner complete the journey using only the page JSON, with no dereferencing and no upstream recovery?

All migration waves assess compliance against this invariant using **artefact-structure review** (page JSON). Runtime generation quality is out of scope for Prism/Cursor — see [Generation Visibility Constraint](SPRINT-56C-GENERATION-VISIBILITY-CONSTRAINT.md).

---

## 4. Migration inventory

Matrix references: [DESIGN-PAGE-RESPONSIBILITY-MATRIX.md](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-RESPONSIBILITY-MATRIX.md). Disposition authority: CP-4 decisions + ownership reviews.

### A. Remove

Responsibilities **explicitly rejected** by CP-4. Must not survive on Design Page emit path.

| ID / item | What | Rationale | Governing artefact |
| --------- | ---- | --------- | ------------------ |
| **R-39** | Knowledge summary **authoring** on DP | Upstream-owned; failure mode A | [OQ-17](DESIGN-PAGE-OQ-17-KNOWLEDGE-SUMMARY-POLICY-REVIEW.md) |
| **R-71** | Knowledge summary editorial / preview rules on DP | No generative task to bound | OQ-17 |
| **R-41** | Study tips / closure **synthesis** from GAM signals | GAM-owned bodies — transport only | [Assembly-Time Test](DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) §6 R-41 |
| **R-42** | GAM reference in study tips without embed | Mode G dual treatment | Assembly-Time Test §6 |
| **R-43** | Authorial exposition — coherent experience mandate | Triple stack; meta-authoring | CP-4 §6; D6 |
| **R-49** | Self-directed rhetoric wrapper shaping | Third wrapper layer | D6; [guardrails §A](SPRINT-56B-ARCHITECTURE-GUARDRAILS.md) |
| **R-51** | Wrapper rhetoric substance (progression vocabulary, etc.) | Disallowed §4 category | Assembly-Time Test |
| **R-35** | Journey upstream signal assimilation for **generative** wrapper | Demoted with stack collapse | D6 |
| **R-53** | EQF principles on DP emit path | Unrelated to transport | 56A audit demotion table |
| **R-56–R-59** | Generative VA specification on DP | Not DP identity | [OQ-13](DESIGN-PAGE-OQ-13-VISUAL-AFFORDANCES-OWNERSHIP-REVIEW.md) |
| **R-55** (generative) | Mandatory schema 38.4 / empty-array emission | Deprecated universal mandatory | [OQ-16](DESIGN-PAGE-OQ-15-16-VA-CLEANUP-CLOSURE-REVIEW.md) |
| **R-59** | `source_basis` on default path | Mode G; remove | OQ-15 |
| **R-78–R-80** | Brevity / density params as compose content-shaping | Conflicts preservation | D7; CP-4 |
| **Triple wrapper stack** | Journey + authorial + rhetoric as separate generative modules | OQ-09 approved merge | D6 |
| **Pedagogical R-36 / R-37** | Inquiry arc and overview **instructional** authoring | Split — structural only may remain | [Consolidation](DESIGN-PAGE-REMAINING-STAKEHOLDER-DECISIONS-CONSOLIDATION-REVIEW.md) |

### B. Retain

Responsibilities **approved** for target architecture.

| ID / item | What | Layer | Governing artefact |
| --------- | ---- | ----- | ------------------ |
| **R-01–R-09** | Page schema, artefact type, profiles (organisational) | 2 | Target derivation |
| **R-17–R-23** | GAM material embed, multi-material, self-contained invariant | 1 | CP-4; guardrails |
| **R-27–R-31** | DLA membership, field preservation, sequence order | 1–2 | Fundamentals |
| **R-40** | Wrapper transition prose (thin, assembly-coherence) | 3 | Assembly-Time Test §6 |
| **R-44** | Role separation (one job per wrapper section) | 3 | Assembly-Time Test §4 |
| **R-45** | Transition quality across arc (bounded) | 3 | Assembly-Time Test |
| **R-47** | Anti-redundancy across wrapper slots | 3 | Editorial discipline |
| **R-70** | `knowledge_summary` **section slot** (organisational) | 2 | OQ-17 — slot only |
| **R-61–R-64** | Episode plan transport | 1 (conditional) | 56A C4 |
| **R-66–R-69** | Assessment transport | 1 (conditional) | 56A |
| **R-22, R-24** | Complete payload / materials fidelity guardrails | Guardrail | Guardrails |
| **R-46, R-50** | Preservation boundaries (wrapper vs archival) | Guardrail | Guardrails |
| **R-83** (narrowed) | Readable assembly as **Layer 2 delimiter** only | Guardrail | Consolidation §6 |
| **R-10, R-73** | Workflow plumbing / governance SSOT | Plumbing | ADR-06 |
| **C10 validation** | PRISM repair tier (subject to OQ-24 policy) | Quality layer | OQ-24 |

### C. Relocate

Responsibility **locus changes** — not removed from pipeline, removed from **DP generative identity**.

| Concern | From | To | Governing artefact |
| ------- | ---- | -- | ------------------ |
| **Knowledge substance** | DP synthesis | LC/KM upstream; DP transport-or-omit | OQ-17 |
| **Visual intent** | DP VA authoring | DLA specification | OQ-14 |
| **Visual substance** | DP / VA metadata | GAM `materials.*` bodies | OQ-14 |
| **Visual specification** | DP | Renderer inference (default); optional VA artefact (SQ-VA-4) | OQ-14 |
| **Visual rendering** | DP compose | Renderer / UI | OQ-14; Presentation Inference Constraint |
| **Learning purpose body** | DP authoring | LO/LC upstream transport | Assembly-Time Test §6 R-38 |
| **Voice (R-48)** | DP wrapper modules | Workflow brief + `page_profile` policy | Consolidation §5 |
| **Facilitator content (R-84)** | DP emphasis | Profile variant + upstream transport | Consolidation §7; SQ-F1 |
| **Support notes body (R-85)** | DP authoring | Upstream transport-or-omit | Consolidation §7; SQ-F2 |
| **Study tips body** | DP synthesis | GAM material transport | Assembly-Time Test §6 R-41 |

---

## 5. Migration waves

Waves are **sequenced programmes** for Sprint 56C. Each wave ends with a compliance checkpoint (§8).

### Wave 1 — Architecture cleanup

**Objective:** Remove responsibilities **explicitly rejected** by CP-4.

| Work package | Inventory | Compliance trace |
| ------------ | --------- | ---------------- |
| W1.1 Knowledge synthesis removal | R-39, R-71 | OQ-17; guardrails §A |
| W1.2 Wrapper stack demotion | R-35, R-43, R-49, R-51; triple stack | D6; CP-4 §6 |
| W1.3 Study tips synthesis removal | R-41 synthesis, R-42 | Assembly-Time Test §6 |
| W1.4 VA generative removal | R-55–R-59 generative; mandatory 38.4 | OQ-13–16 |
| W1.5 Brevity / optimisation removal | R-78–R-80 on DP path | D7; guardrails §A |
| W1.6 EQF on DP emit | R-53 | 56A demotion |

**Wave 1 exit:** No removed responsibility remains as generative mandate on Design Page emit path (compliance review §8.1).

---

### Wave 2 — Boundary refactoring

**Objective:** Align **retained** responsibilities to approved ownership model.

| Work package | Inventory | Compliance trace |
| ------------ | --------- | ---------------- |
| W2.1 Layer 1 affirmation | R-17–R-23, R-28–R-30 | CP-4 baseline; guardrails §C |
| W2.2 Layer 2 organisation | R-01–R-09, R-27, R-31, R-70 slot | Target derivation |
| W2.3 Assembly-coherence contract | R-40, R-44, R-45, R-47; thin R-36/R-37 structural only | Assembly-Time Test §4 |
| W2.4 Knowledge transport-or-omit | R-70 + OQ-17 policy | OQ-17; SQ-1/SQ-2 as packaging enablers |
| W2.5 R-83 narrowing | Readable assembly delimiter wording | Consolidation §6 |
| W2.6 R-38 transport-only | `learning_purpose` from upstream | Assembly-Time Test §6 |
| W2.7 Facilitator profile alignment | R-84, R-85 per transport-or-omit | SQ-F1, SQ-F2 |
| W2.8 VA relocation alignment | Passive carry only if artefact bound; renderer path default | OQ-14 |

**Wave 2 exit:** Retained responsibilities match approved layer placement; no instructional authoring in wrapper (compliance review §8.2).

---

### Wave 3 — Validation preparation

**Objective:** Establish validation readiness and acceptance-test framework before declaring architecture compliance complete.

| Work package | Topic | Dependency |
| ------------ | ----- | ------------ |
| W3.1 Fixture baseline | OQ-25 canonical workflow **definitions** | Required for acceptance-test preparation |
| W3.2 Dual-path strategy | OQ-24 Copilot vs PRISM **review framework** | Defines architecture compliance criteria per path (structural — not runtime output quality) |
| W3.3 Failure-mode test map | Modes A–G per fixture | 56A failure modes — structural review checklist |
| W3.4 Export contract impact | C5, C14 downstream shapes | CP-3 dependency review |
| W3.5 Regression inventory | Existing tests vs target guardrails | OQ-25 |

**Wave 3 exit:** Validation readiness documented; fixtures identified; dual-path review framework decided (compliance review §8.3). Runtime output evaluation delegated to Copilot capture workflows where required.

---

### Wave 4 — Architecture compliance review

**Objective:** Verify implemented state against CP-4 decisions.

| Work package | Activity |
| ------------ | -------- |
| W4.1 Guardrails audit | Full [SPRINT-56B-ARCHITECTURE-GUARDRAILS.md](SPRINT-56B-ARCHITECTURE-GUARDRAILS.md) checklist |
| W4.2 Ownership test audit | Sample pages through Assembly-Time Ownership Test |
| W4.3 Inventory reconciliation | Remove / Retain / Relocate vs as-built |
| W4.4 CP-4 brief sign-off reconciliation | D1–D7 implemented intent |
| W4.5 Stakeholder follow-up closure | SQ-1, SQ-2, SQ-F1, SQ-F2 recorded |

**Wave 4 exit:** Compliance report; Sprint 56C completion criteria (§10) met.

---

## 6. Dependency analysis

### Dependency map

```
CP-4 freeze (prerequisite for all waves)
    │
    ├─► Wave 1: Cleanup
    │       ├─► W1.1 R-39/R-71 removal ──► enables OQ-17 compliance validation
    │       ├─► W1.4 VA removal ──► enables OQ-14 compliance review
    │       └─► W1.5 brevity removal ──► enables R-83 narrowing (Wave 2)
    │
    ├─► Wave 2: Boundary refactor (requires Wave 1 complete)
    │       ├─► W2.3 single bridge ──► depends on W1.2 stack removal
    │       ├─► W2.4 knowledge transport ──► depends on W1.1; may need SQ-1 upstream
    │       └─► W2.8 VA alignment ──► depends on W1.4
    │
    ├─► Wave 3: Validation (parallel with Wave 2 after W1.1 + W1.4 started)
    │       ├─► OQ-25 fixtures ──► required before Wave 4 sign-off
    │       └─► OQ-24 dual-path ──► required before Wave 4 PRISM/Copilot criteria
    │
    └─► Wave 4: Compliance (requires Waves 1–3)
            └─► CP-6 implementation complete assessment
```

### Blockers and prerequisites

| Item | Type | Blocks | Notes |
| ---- | ---- | ------ | ----- |
| **CP-6 plan approval** | Prerequisite | Sprint 56C execution start | This plan |
| **Wave 1 before Wave 2** | Sequencing | Boundary refactor | Cannot narrow wrapper while synthesis modules active |
| **R-39 removal before OQ-17 validation** | Dependency | Knowledge compliance | Transport-or-omit test invalid if synthesis remains |
| **VA cleanup before OQ-14 review** | Dependency | VA compliance | Generative VA must be gone before relocation verified |
| **Brevity removal before R-83 compliance** | Dependency | Readable assembly audit | Brevity params confound R-83 interpretation |
| **SQ-1** | Enabler (non-blocking CP-4) | OQ-17 Option A frequency | Upstream packaging |
| **OQ-25** | Blocker for Wave 4 complete | Acceptance-test readiness | Fixture definitions + review framework |
| **OQ-24** | Blocker for Wave 4 complete | Dual-path review framework | Validation preparation (not runtime proof) |
| **CP-3 dependency matrix** | Recommended | Export contract certainty | W3.4 |

### Sequencing constraints (Sprint 56C)

1. **Remove before retain-align** — cleanup precedes positive contract consolidation.
2. **Layer 1 invariant frozen throughout** — no wave may weaken R-17 embed.
3. **Validation parallel not substitute** — Wave 3 runs alongside Wave 2 but Wave 4 requires both.
4. **Sprint 57** is reserved for future roadmap work — not part of this migration programme.

---

## 7. Validation strategy

**Scope boundary:** Prompt execution occurs in **Copilot**. Prism/Cursor validates architecture, prompts, implementation alignment, and artefact structures — not runtime generation behaviour or output quality. See [Generation Visibility Constraint](../2026-07-06-sprint-56c-design-page-migration-execution/SPRINT-56C-GENERATION-VISIBILITY-CONSTRAINT.md).

### References

| ID | Topic | Planning status |
| -- | ----- | --------------- |
| **OQ-24** | Copilot-primary vs PRISM-repair **review framework** | Open — decide in Wave 3 |
| **OQ-25** | Canonical acceptance fixture **definitions** | Open — identify in Wave 3 |

### Architecture compliance checks (Prism/Cursor scope)

| Check | Method | Pass criteria |
| ----- | ------ | ------------- |
| **Layer 1 embed** | Fixture page JSON **structural** review | Full GAM `Content:` in `materials.*`; no placeholder substitution in artefact |
| **No DP synthesis** | Prompt/contract + section-body audit | No `knowledge_summary` / `study_tips` / overview **authoring obligations** on DP path |
| **No VA generative** | Page root keys audit | No mandatory `visual_affordances[]` emission; no `source_basis` on default path |
| **Assembly-coherence bound** | Wrapper contract + prompt audit | Thin navigation/sequencing only; §4 Allowed categories in contracts |
| **Presentation Inference** | Renderer **implementation** review (export path) | No new instructional prose obligations in renderer code/prompts |
| **Acceptance invariant** | Fixture artefact review | Page JSON is learner-completable without dereferencing (structural — not runtime generation quality) |

### Fixture requirements (OQ-25)

Minimum fixture set for Sprint 56C **acceptance-test preparation** (definitions and structural review — runtime capture in Copilot where artefacts are sourced):

| Fixture class | Purpose |
| ------------- | ------- |
| **Multi-activity learner page** | Membership, ordering, material embed (modes C, multi-material) |
| **Inflation / communication workshop** | Historical failure mode A/G structural regression checklist |
| **Knowledge-bound workflow** | OQ-17 transport-or-omit path review |
| **Assessment-profile page** | Structured item transport |
| **Facilitator-profile page** | R-84/R-85 policy (SQ-F1/F2) |
| **Copilot-generated capture** | OQ-24 dual-path review framework (artefact source) |
| **PRISM-repaired capture** | OQ-24 dual-path review framework (artefact source) |

*Exact workflow IDs to be recorded when OQ-25 closes. Structural compliance reviewable in Prism/Cursor; runtime generation quality evaluated in Copilot.*

### Dual-path review framework (OQ-24)

Defines **architecture compliance criteria** per path for acceptance-test preparation — not proof of runtime output correctness.

| Path | Review framework requirement |
| ---- | ---------------------------- |
| **Copilot** | Layer 1 structural compliance criteria documented **OR** documented accepted risk with repair backstop |
| **PRISM** | Repair must not mask transport failures without traceable `generation_notes` (structural/contract review) |
| **Equivalence** | Layer 1 **artefact** outcomes comparable across paths for canonical fixtures |

Decision required in Wave 3 before Wave 4 sign-off. Runtime output evaluation occurs in Copilot.

---

## 8. Compliance framework

Every Sprint 56C migration activity must trace to **at least one** governing artefact.

### 8.1 CP-4 Approval Brief compliance

| CP-4 element | Compliance question |
| ------------ | ------------------- |
| Transport-and-organisation identity | Is DP still primarily transport + organise? |
| D1–D7 decisions | Is each decision reflected in as-built behaviour? |
| Wrapper collapse | Is triple stack removed? |
| VA demotion | Is generative VA off DP? |
| R-83 definition | Is readable assembly Layer 2 only? |

### 8.2 Architecture Guardrails compliance

Use [SPRINT-56B-ARCHITECTURE-GUARDRAILS.md](SPRINT-56B-ARCHITECTURE-GUARDRAILS.md) §A–D as **per-activity checklist** during code/prompt review in Sprint 56C.

| Section | Sprint 56C review gate |
| ------- | --------------------- |
| §A Design Page must not | Every DP emit change |
| §B Renderer must not | Every export/renderer change touching learner content |
| §C Design Page may | Positive capability check |
| §D Renderer may | Presentation-only verification |

### 8.3 Assembly-Time Ownership Test compliance

For any **remaining** generative prose on Design Page:

1. Apply T1 → T2 → T3 → §4 Allowed/Disallowed.
2. Document classification in compliance log.
3. Reject if Disallowed — even when T3 = Yes.

### Traceability matrix (summary)

| Wave | Primary artefacts |
| ---- | ----------------- |
| Wave 1 | Guardrails §A; OQ-17; OQ-13–16; CP-4 §6 |
| Wave 2 | Assembly-Time Test; OQ-17; Consolidation review; CP-4 §3 |
| Wave 3 | OQ-24; OQ-25; 56A failure modes |
| Wave 4 | CP-4 brief; Guardrails full; Assembly-Time Test audit |

---

## 9. Risk register

| ID | Risk | Likelihood | Impact | Mitigation |
| -- | ---- | ---------- | ------ | ---------- |
| **RK-01** | Accidental wrapper re-expansion (new modules on emit) | Medium | High | Guardrails §A; single-bridge contract; compliance review |
| **RK-02** | Knowledge/study-tip synthesis reintroduced | Medium | High | OQ-17 tests; remove R-39/R-41 from contracts |
| **RK-03** | Renderer authoring creep (presentation → pedagogy) | Medium | High | Presentation Inference Constraint; guardrails §B |
| **RK-04** | Ownership drift (visibility → ownership confusion) | Medium | Medium | Assembly-Time Test on every new obligation proposal |
| **RK-05** | PRISM repair masks Copilot transport failure | Medium | High | OQ-24 explicit policy; dual-path fixtures |
| **RK-06** | SQ-1/SQ-2 unresolved → ambiguous knowledge sections | Medium | Medium | Default to omit when no transportable upstream body |
| **RK-07** | VA schema residue (empty arrays, compose step 4) | Medium | Medium | OQ-15/16 compliance; Wave 1.4 verification |
| **RK-08** | R-83 over-broad interpretation persists | Medium | High | Approved narrow definition in contracts; Wave 2.5 |
| **RK-09** | Scope creep beyond migration inventory | Medium | Medium | Execution checklist; frozen architecture reference |
| **RK-10** | Undocumented stakeholder assumptions | Low | Medium | Record SQ-* outcomes in tracker; no silent policy |

---

## 10. Completion criteria

Sprint 56C implementation work is **complete** when **architecture outcomes** below are true — not merely when tasks are closed.

| # | Criterion | Evidence |
| - | --------- | -------- |
| 1 | **Wave 1 complete** — all §4A Remove items absent as DP generative obligations | Compliance checklist §8.1 |
| 2 | **Wave 2 complete** — §4B Retain items aligned to layers; §4C Relocate reflected | Inventory reconciliation |
| 3 | **Wave 3 complete** — OQ-24 and OQ-25 decided; fixtures identified; acceptance-test framework prepared | Validation readiness log |
| 4 | **Wave 4 complete** — guardrails audit pass | §8.2 signed review |
| 5 | **Acceptance invariant** holds on canonical fixtures (structural artefact review) | OQ-25 baseline |
| 6 | **No CP-4 principle violation** in sample audit | Assembly-Time Test + Presentation Inference |
| 7 | **Stakeholder follow-ups recorded** — SQ-1, SQ-2, SQ-F1, SQ-F2 | Tracker update |
| 8 | **CP-6** implementation plan outcomes assessed | Tracker CP-6 sign-off |

**Not required for architecture completion:** optional VA artefact path (SQ-VA-4); assessment interactivity architecture; full renderer redesign.

---

## 11. Explicit non-goals

Sprint 56C **must not:**

| Non-goal | Authority |
| -------- | --------- |
| Reopen **OQ-02** (assembly-time ownership frame) | CP-4 freeze |
| Reopen **OQ-17** (transport-or-omit; Option B rejected) | CP-4 D2 |
| Reopen **OQ-13–16** (VA ownership and cleanup) | CP-4 D3–D5 |
| Introduce **new Design Page authoring** obligations | Guardrails §A |
| Introduce **renderer authoring** of educational content | Guardrails §B; Presentation Inference Constraint |
| Reinterpret **Preservation First** or **Renderer Independence** | CP-4 §4 |
| Design **assessment interactivity architecture** | Guardrails §E — future topic |
| Expand scope via **SQ-VA-4** without new architecture decision | CP-4 post-approval note |

Changes to governing principles require a **new architecture decision** — not a Sprint 56C implementation ticket.

---

## 12. Sprint 56C recommendation

### Recommended execution sequence

| Order | Activity | Wave | Checkpoint |
| ----- | -------- | ---- | ---------- |
| 1 | CP-6 approve this plan | — | CP-6 sign-off |
| 2 | Establish fixture shortlist (OQ-25) | 3 | W3.1 |
| 3 | Wave 1 cleanup programme | 1 | W1 exit review |
| 4 | Decide dual-path policy (OQ-24) | 3 | W3.2 |
| 5 | Wave 2 boundary alignment | 2 | W2 exit review |
| 6 | Complete validation readiness (fixtures + acceptance-test framework) | 3 | W3 exit review |
| 7 | Architecture compliance review | 4 | W4 exit / Sprint 56C close |
| 8 | Record SQ-* outcomes | 4 | Tracker |

### Approval checkpoints (Sprint 56C programme)

| Checkpoint | When | Owner |
| ---------- | ---- | ----- |
| **CP-6** | Before Sprint 56C execution | Planning lead |
| **W1 exit** | After cleanup wave | Technical review |
| **W2 exit** | After boundary refactor | Technical review |
| **W3 exit** | After validation prep | Technical review |
| **W4 / Sprint 56C close** | Architecture compliance | Planning + technical review |

### Programme coordination

- **Sprint 56C** executes this migration programme exclusively.
- **Sprint 57** is **reserved** for future roadmap work and is out of scope for Design Page migration (OQ-23 resolved).
- As-built reference: [Sprint 57 architecture state](../2026-07-01-sprint-57-learner-experience-product-quality/SPRINT-57-ARCHITECTURE-STATE.md) is **superseded** for DP/VA ownership by CP-4 target.
- **DP emit changes** follow wave sequence in §5.

---

## References

| Document | Role |
| -------- | ---- |
| [SPRINT-56B-CP-4-ARCHITECTURE-APPROVAL-BRIEF.md](SPRINT-56B-CP-4-ARCHITECTURE-APPROVAL-BRIEF.md) | Approved architecture |
| [SPRINT-56B-ARCHITECTURE-GUARDRAILS.md](SPRINT-56B-ARCHITECTURE-GUARDRAILS.md) | Implementation guardrails |
| [DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md](DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) | Ownership governance |
| [DESIGN-PAGE-PRESENTATION-INFERENCE-CONSTRAINT.md](DESIGN-PAGE-PRESENTATION-INFERENCE-CONSTRAINT.md) | Downstream bounds |
| [DESIGN-PAGE-OQ-17-KNOWLEDGE-SUMMARY-POLICY-REVIEW.md](DESIGN-PAGE-OQ-17-KNOWLEDGE-SUMMARY-POLICY-REVIEW.md) | Knowledge policy |
| [DESIGN-PAGE-OQ-13 through OQ-15/16 reviews](.) | VA policy |
| [DESIGN-PAGE-REMAINING-STAKEHOLDER-DECISIONS-CONSOLIDATION-REVIEW.md](DESIGN-PAGE-REMAINING-STAKEHOLDER-DECISIONS-CONSOLIDATION-REVIEW.md) | Wrapper disposition |
| [DESIGN-PAGE-MIGRATION-STRATEGY.md](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-MIGRATION-STRATEGY.md) | 56A sequencing evidence |
| [DESIGN-PAGE-RESPONSIBILITY-MATRIX.md](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-RESPONSIBILITY-MATRIX.md) | R-01–R-86 inventory |
| [SPRINT-56C-GENERATION-VISIBILITY-CONSTRAINT.md](../2026-07-06-sprint-56c-design-page-migration-execution/SPRINT-56C-GENERATION-VISIBILITY-CONSTRAINT.md) | Validation scope boundary |

---

## Sign-off (CP-6)

| Role | Name | Date | Notes |
| ---- | ---- | ---- | ----- |
| Planning lead | | | |
| Technical review | | | |

**Do not begin Sprint 56C implementation until CP-6 marks this plan APPROVED.**
