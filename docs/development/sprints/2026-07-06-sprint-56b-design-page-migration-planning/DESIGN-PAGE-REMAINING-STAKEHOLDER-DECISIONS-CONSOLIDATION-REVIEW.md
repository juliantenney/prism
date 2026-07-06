# Remaining Stakeholder Decisions — Consolidation Review

**Sprint:** 56B — Design Page Migration Planning & Architecture Approval  
**Status:** Planning artefact — CP-4 preparation review  
**Date:** 2026-07-06  

**Governing inputs (not reopened):**
- [DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md](DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) v1.0 (OQ-02)
- [DESIGN-PAGE-PRESENTATION-INFERENCE-CONSTRAINT.md](DESIGN-PAGE-PRESENTATION-INFERENCE-CONSTRAINT.md) v1.0
- [DESIGN-PAGE-OQ-17-KNOWLEDGE-SUMMARY-POLICY-REVIEW.md](DESIGN-PAGE-OQ-17-KNOWLEDGE-SUMMARY-POLICY-REVIEW.md)
- [DESIGN-PAGE-OQ-13-VISUAL-AFFORDANCES-OWNERSHIP-REVIEW.md](DESIGN-PAGE-OQ-13-VISUAL-AFFORDANCES-OWNERSHIP-REVIEW.md)
- [DESIGN-PAGE-OQ-14-VISUAL-AFFORDANCES-RELOCATION-TARGET-REVIEW.md](DESIGN-PAGE-OQ-14-VISUAL-AFFORDANCES-RELOCATION-TARGET-REVIEW.md)
- [DESIGN-PAGE-OQ-15-16-VA-CLEANUP-CLOSURE-REVIEW.md](DESIGN-PAGE-OQ-15-16-VA-CLEANUP-CLOSURE-REVIEW.md)

**Evidence base:** Sprint 56A artefacts (frozen)

**This document does not propose implementation, prompt changes, code changes, workflow changes, or renderer changes.**

---

## Executive summary

Six matrix responsibilities flagged at OQ-02 §8 remain **stakeholder-facing** after ownership tests. None reopen settled OQ-02/OQ-13–OQ-17 decisions. They require **narrowing, splitting, or product policy** choices before CP-4.

| Item | Recommended disposition | CP-4 action |
| ---- | ----------------------- | ----------- |
| **R-83** | **Narrow** to Layer 2 structure delimiter | **Approve** narrowed definition |
| **R-36** | **Split** — structural framing only | **Approve** split; remove pedagogical arc |
| **R-37** | **Split** — structural overview vs transport-only substance | **Approve** split; reject pedagogical authoring |
| **R-48** | **Relocate** to profile/brief policy | **Approve** — not DP content ownership |
| **R-84** | **Split** — profile variant policy | **Escalate** facilitator minimums (SQ-F1) |
| **R-85** | **Split** — section slot + transport-or-omit | **Approve** with SQ-F2 |

**Minimum CP-4 stakeholder package:** 8 decisions (see §9). OQ-24/OQ-25 are **CP-3** validation gates — not architecture-boundary blockers for CP-4.

---

## 1. Remaining decision inventory

| ID | Purpose | Current responsibility | Ambiguity | Dependencies | Ownership assumption (post-OQ-02) |
| -- | ------- | ---------------------- | --------- | ------------ | ----------------------------------- |
| **R-36** | Express Q→I→E→J inquiry arc in wrapper | Journey `CORE_LINES` | Pedagogical arc vs structural journey label | R-35, R-37, R-38; Sprint 42–43 | Thin structural framing **may** be DP assembly-owned; pedagogical arc is upstream |
| **R-37** | Author `overview` section | Journey + authorial + rhetoric | Instructional front-load vs navigation framing | R-36, R-38, R-43, R-49; LC/LO | Split: transport vs thin assembly-coherence |
| **R-48** | Self-study vs workshop voice on wrapper | `VOICE_*_LINES` | Content style vs presentation vs profile gate | R-77, R-84, `page_profile`; C11 | Not instructional substance; policy/presentation |
| **R-83** | Readable assembly scope | Pack + compose boundary rule | Structure delimiter vs global optimise licence | R-22, R-24, R-80, R-37–R-38; C9 | Guardrail on Layer 2 — **not** authoring mandate |
| **R-84** | Facilitator profile content emphasis | §13 facilitator `promptInstruction` | Separate deliverable vs page variant | R-03, R-68, C11; domain §18 | Profile-shaped **transport** assembly |
| **R-85** | `support_notes` section | §13 section ordering | Author on DP vs transport upstream | R-84, facilitator artefacts; domain §18 | Organisational slot; body transport-or-omit |

### Linked dependencies (not in scope list but affected)

| ID | Link |
| -- | ---- |
| R-35 | Upstream signal feed for R-36/R-37 — demote with wrapper stack (OQ-09) |
| R-38 | **Resolved:** transport-only per ownership test §6 |
| R-39/R-71 | **Resolved:** transport-or-omit per OQ-17 |
| R-43, R-49, R-51 | **Remove/merge** per OQ-09 single-bridge direction |
| R-80 | Brevity params — **remove from DP** (D7); interacts with R-83 over-broad reading |
| R-46, R-50 | Guardrails — remain; scope shrinks if wrapper generative scope narrows |

---

## 2. Assembly-Time principles (what remains unresolved)

Ownership categories are **settled**. Remaining questions are **scope, split, and product policy** — not *who may own instructional substance*.

| Item | T3 visibility? | Organisational | Instructional | Presentation | Product/policy |
| ---- | -------------- | -------------- | ------------- | ------------ | -------------- |
| R-36 | Partial | Partial | **Yes (risk)** | Partial | Partial (salience goals) |
| R-37 | **Yes** (arc) | Partial | **Yes (risk)** | Partial | Partial |
| R-48 | No | Partial | No | **Yes** | **Yes** |
| R-83 | N/A (guardrail) | **Yes** | **Risk if over-broad** | Partial | No |
| R-84 | Partial | **Yes** | Partial (upstream) | Partial | **Yes** |
| R-85 | Partial | **Yes** | Partial (upstream) | No | **Yes** |

**Presentation Inference Constraint applies:** neither DP nor renderer may use any remaining item to author instructional substance.

---

## 3. R-36 — Inquiry arc framing

### Multiple concerns identified

| Concern | Description | Natural owner |
| ------- | ----------- | ------------- |
| **A. Structural journey framing** | Labels the composed journey shape (e.g. “You will investigate, then judge”) without teaching concepts | **DP assembly-coherence** (thin, optional) |
| **B. Pedagogical inquiry framing** | Q→I→E→J as instructional narrative with stakes, evidence types, judgement criteria | **Upstream** — LC, LO, DLA, or activity scaffolds |

### Assessment

| Test | Structural (A) | Pedagogical (B) |
| ---- | -------------- | ----------------- |
| T1 | Partial — sequence signals upstream | **Yes** — inquiry design is specification |
| T3 | **Yes** — arc across **composed** activity set | No — substance exists before assembly |
| §4 Allowed | Sequencing, assembly coherence | **Disallowed** — instructional explanations |

### Recommendation

| Action | Detail |
| ------ | ------ |
| **Split** | **Approve A only** as optional thin assembly-coherence obligation |
| **Remove** | **B from Design Page** — transport from LC/LO where present; do not author inquiry pedagogy on overview/wrapper |
| **Merge** | Fold A into single assembly-coherence contract (OQ-09); do not retain standalone R-36 module identity |

**Disposition:** **Split + narrow.** Pedagogical inquiry arc is **not** a Design Page responsibility.

**Confidence:** **High**

---

## 4. R-37 — Overview authoring

### Multiple concerns identified

| Concern | Description | Natural owner |
| ------- | ----------- | ------------- |
| **A. Structural overview** | Page-level navigation: what the resource contains, activity sequence pointers, where to start | **DP assembly-coherence** (thin) |
| **B. Pedagogical overview** | Inquiry stakes, concept front-loading, journey narrative duplicating activity content | **Upstream** — LC/LO; or **omit** |

### Assessment

Ownership test §6 already classifies R-37 as **stakeholder split**. Failure mode **A** (summarisation) arises when B is treated as DP authoring.

| Concern | T3 | §4 |
| ------- | -- | -- |
| A — structural | **Yes** | Allowed: navigation, sequencing |
| B — pedagogical | Partial | **Disallowed:** instructional explanations |

### Recommendation

| Action | Detail |
| ------ | ------ |
| **Split** | **A:** optional thin `overview` — assembly-coherence only |
| **Transport-or-omit** | **B:** if LC/LO provide overview-suitable excerpt → transport verbatim; else omit instructional front-load |
| **Reject** | Overview as second teaching layer over activities |
| **Align** | With OQ-17 pattern — no DP synthesis |

**Disposition:** **Split.** Structural overview optional and thin; pedagogical overview **upstream transport or omit**.

**Confidence:** **High**

---

## 5. R-48 — Voice variants

### Classification

| Candidate type | Applies? |
| -------------- | -------- |
| Content behaviour | **No** — voice must not change instructional substance |
| Presentation behaviour | **Partial** — register/tone of **existing** thin framing |
| Profile behaviour | **Yes** — gated by `page_profile`, facilitator context (R-77) |
| Product policy | **Yes** — self-study vs workshop is deliverable positioning |

### Should Design Page own voice?

| Aspect | Owner |
| ------ | ----- |
| **Whether** learner wrapper modules apply | **Organisational** — profile gate (R-77) |
| **Register/tone** of permitted assembly-coherence prose | **Workflow brief / product policy** — not generative content mandate |
| **Rendered voice** (typography, formality cues) | **Renderer / presentation** — Presentation Inference Constraint |

### Recommendation

| Action | Detail |
| ------ | ------ |
| **Relocate** | Voice selection to **brief + `page_profile` policy** |
| **Remove** | R-48 as standalone DP **content** responsibility |
| **Retain** | Profile gate only — facilitator profile may suppress learner wrapper stack |

**Disposition:** **Relocate** — not a Design Page content ownership item.

**Confidence:** **High**

---

## 6. R-83 — Readable assembly (high priority)

### What “readable assembly” means today (as-built)

Matrix: *“Apply readable assembly to structure, headings, ordering, wrapper — not materials bodies.”*

Domain pack step description: *“assemble a profile-aware **readable page** artefact”* — organisational deliverable goal, not a licence to condense bodies.

### Interpretations

| Interpretation | Acceptable? | Risk |
| -------------- | ----------- | ---- |
| **A. Layer 2 structure delimiter** — valid schema, section slots, membership, ordering, legible headings, self-contained page | **Yes** — target | Aligns with transport-and-organisation identity |
| **B. Wrapper readability optimisation** — shorten, polish, or “improve” wrapper prose for readability | **No** | Mode A summarisation; competes with embed |
| **C. Global page optimisation** — condense payloads for token/size/readability | **No** | Modes A, D; conflicts R-22, R-17 |
| **D. Presentation readability** — typography, hierarchy at render | **Renderer** — not R-83 on DP |

### Architecture risk

R-83 listed as **Core** inflated identity (56A core reduction). Wording historically licensed **B and C** when read alongside brevity params (R-80) and wrapper modules — **failure mode A** driver.

### Recommended narrowed definition (CP-4 approval wording)

> **Readable assembly** means producing a **self-contained, well-structured page artefact** at Layer 2: correct schema and `page_profile`, complete activity membership, defensible ordering, meaningful section headings, and **verbatim transport** of upstream bodies — **without** condensing, summarising, paraphrasing, or rewriting archival `learning_activities.content[].materials.*`, DLA scaffold fields, or assessment items.

**Explicit exclusions:** wrapper prose optimisation; brevity-driven shortening; “readable” as excuse in `generation_notes` for thin materials.

### Recommendation

| Action | Detail |
| ------ | ------ |
| **Narrow** | R-83 from optimise licence to **guardrail delimiter** |
| **Reclassify** | Target architecture: **guardrail** (Layer 2 boundary), not generative Core identity |
| **Remove** | “wrapper” from scope of readability optimisation |
| **Approve** | Narrowed definition at CP-4 |

**Disposition:** **Narrow** — highest-priority CP-4 approval item.

**Confidence:** **High**

---

## 7. R-84 / R-85 — Facilitator scope

### Model options assessed

| Model | Fit |
| ----- | --- |
| Separate deliverable / pipeline stage | **Weak** — same `artifact_type: page`, different emphasis |
| **Page variant** via `page_profile` | **Strong** — domain §18; C11 profiles |
| Profile overlay on learner page | **Weak** — mixes audiences on one artefact |
| Upstream facilitator artefact only | **Partial** — content may exist upstream; DP still assembles |

### Domain §18 requirements (evidence)

| Profile | Minimum (domain artefacts) |
| ------- | --------------------------- |
| `learner` | Substantive summary/content + learner tasks |
| `facilitator` | Run/session guidance + sequencing/logistics/facilitation notes |
| `assessment` | Structured items; no narrative flattening |

### R-84 — Facilitator profile content

| Aspect | Recommendation |
| ------ | -------------- |
| Nature | **Page variant policy** — not separate architecture stage |
| DP role | **Organise** facilitator-appropriate sections; **transport** upstream facilitator/run guidance |
| Not DP role | Invent logistics, facilitation moves, or session plans on compose |
| Linked | R-77 profile gate; R-48 voice suppressed for facilitator where appropriate |

**Disposition:** **Split** — profile policy (**product**); assembly = transport + section emphasis only.

**Escalation:** **SQ-F1** — confirm minimum facilitator sections vs upstream-only transport (domain §18 vs OQ-17 transport-or-omit pattern).

### R-85 — Support notes section

| Aspect | Recommendation |
| ------ | -------------- |
| Nature | **Organisational section slot** (`support_notes`) |
| Body | **Transport-or-omit** — same policy pattern as OQ-17: transport upstream facilitator/support body if present; **omit** section if not |
| Not DP role | Author misconception guards or facilitation prose on compose |

**Disposition:** **Split** — slot = Layer 2 organise; body = upstream transport-or-omit.

**Escalation:** **SQ-F2** — identify upstream artefact field for support notes transport (if any).

**Confidence:** **Medium** on facilitator minimums (SQ-F1); **High** on transport-or-omit pattern for R-85.

---

## 8. Approval readiness assessment

| Item | Classification | Rationale |
| ---- | -------------- | --------- |
| **R-83** narrowed definition | **Ready for approval** | High consensus in 56A; clear failure-mode link; wording proposed |
| **R-36** split | **Ready for approval** | Ownership test + Presentation Inference Constraint determine split |
| **R-37** split | **Ready for approval** | Same; aligns OQ-17 transport-or-omit pattern |
| **R-48** relocate | **Ready for approval** | Profile/brief policy; not architecture identity |
| **R-84** facilitator variant | **Requires stakeholder decision** | SQ-F1 — domain §18 minimums vs upstream-only |
| **R-85** support notes | **Requires narrowing** | Slot approved; SQ-F2 for transport source |
| **OQ-09** wrapper merge | **Ready for approval** | Pre-answered: single assembly-coherence bridge |
| **D7** brevity on DP | **Ready for approval** | **Remove** — aligns with narrowed R-83 |
| **SQ-1 / SQ-2** (OQ-17) | **Requires stakeholder decision** | Upstream packaging + learner profile summary requirement |
| **SQ-VA-4** (optional) | **Optional at CP-4** | Does not block architecture boundary approval |
| **OQ-24 / OQ-25** | **Escalate to CP-3** | Validation/fixtures — not Layer 3 boundary |

---

## 9. CP-4 preparation summary

### Minimum stakeholder decisions for architecture approval

| # | Item | Recommended disposition | Confidence | CP-4 action |
| - | ---- | ----------------------- | ---------- | ----------- |
| 1 | **Target architecture** (F3–F5) | Approve transport-and-organisation identity + 3 layers + P1–P6 | High | **Sign-off** |
| 2 | **OQ-02** (D1) | Adopt Assembly-Time Ownership Test | High | **Sign-off** |
| 3 | **OQ-17** (D2) | Transport-or-omit; Option B rejected | High | **Sign-off** (+ SQ-1/SQ-2 recorded) |
| 4 | **VA bundle** (D3–D5) | OQ-13–16 resolutions + Presentation Inference Constraint (F3h) | High | **Sign-off** |
| 5 | **R-83** | Narrow to Layer 2 structure delimiter (§6 wording) | High | **Approve** definition |
| 6 | **R-36 / R-37** | Split: structural assembly-coherence only; no pedagogical authoring | High | **Approve** split |
| 7 | **R-48** | Relocate to brief/profile policy; not DP content | High | **Approve** |
| 8 | **OQ-09 / wrapper** (D6) | Merge to single thin assembly-coherence contract; remove triple stack | High | **Approve** |
| 9 | **Brevity params** (D7) | Remove from Design Page emit path | High | **Approve** |
| 10 | **R-84 / R-85** | Page variant + transport-or-omit; SQ-F1/SQ-F2 | Medium | **Escalate** facilitator policy |
| 11 | **SQ-1 / SQ-2** | LC/KM transportable field; learner profile summary requirement | Medium | **Record** decision or defer with risk |
| 12 | **SQ-VA-4** | Optional explicit VA metadata consumers | Low urgency | **Defer** acceptable at CP-4 |

### Items **not** required for CP-4 architecture boundary

| Item | Gate |
| ---- | ---- |
| OQ-24 dual-path validation | CP-3 |
| OQ-25 canonical fixtures | CP-3 |
| OQ-23 Sprint 57 sequencing | Programme coordination |
| As-built contract residue (domain pack §13 VA keys, wrapper modules) | Implementation planning (CP-5+) |

### CP-4 approval package (consolidated)

**Approve as architecture (high confidence):**
- Transport-and-organisation identity
- Assembly-Time Ownership Test + Presentation Inference Constraint
- Knowledge summary transport-or-omit
- VA layered ownership (OQ-13–16)
- R-83 narrowed definition
- R-36/R-37 split (structural only)
- R-48 relocate
- OQ-09 single bridge + brevity removal from DP

**Stakeholder decisions to record at CP-4 (medium confidence):**
- SQ-1, SQ-2 (knowledge summary upstream packaging)
- SQ-F1, SQ-F2 (facilitator profile minimums and support_notes transport)

**Defer without blocking CP-4:**
- SQ-VA-4

---

## 10. Tracker updates

| Tracker entry | Value |
| ------------- | ----- |
| **W2 boundary review** | **Complete** for planning — pending CP-4 sign-off on §9 package |
| **CP-2** | Substantively complete when §9 items 1–9 approved |
| **F4** | Stakeholder wrapper disposition — R-36/R-37/R-48/R-83 recommendations |
| **D6** | Pre-filled: merge single bridge — pending CP-4 |
| **D7** | Pre-filled: remove brevity from DP — pending CP-4 |

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `DESIGN-PAGE-REMAINING-STAKEHOLDER-DECISIONS-CONSOLIDATION-REVIEW.md` |
| Consumers | CP-4 · W2 · Sprint 57 planning |
| Change policy | Planning revision only |

**Planning and approval artefact only.**
