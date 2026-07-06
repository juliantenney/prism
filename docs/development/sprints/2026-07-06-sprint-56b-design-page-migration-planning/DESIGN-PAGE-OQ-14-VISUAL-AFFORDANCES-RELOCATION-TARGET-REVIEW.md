# OQ-14 — Visual Affordances Relocation Target Review

**Sprint:** 56B — Design Page Migration Planning & Architecture Approval  
**Status:** Planning artefact — architecture review  
**Date:** 2026-07-06  
**Governing inputs:**
- [DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md](DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) v1.0
- [DESIGN-PAGE-PRESENTATION-INFERENCE-CONSTRAINT.md](DESIGN-PAGE-PRESENTATION-INFERENCE-CONSTRAINT.md) v1.0
- [DESIGN-PAGE-OQ-13-VISUAL-AFFORDANCES-OWNERSHIP-REVIEW.md](DESIGN-PAGE-OQ-13-VISUAL-AFFORDANCES-OWNERSHIP-REVIEW.md)

**Provisionally resolved (not revisited):** OQ-02 · OQ-17 · OQ-13

**Evidence base:** Sprint 56A artefacts (frozen); Sprint 57 architecture state (as-built reference only)

**This document does not propose implementation, prompt changes, code changes, renderer changes, schemas, or workflow modifications.**

---

## Executive summary

| Question | Finding |
| -------- | ------- |
| What is unowned after OQ-13? | **Visual specification** (R-56–R-59 generative work); **validation locus** (R-60) follows specification owner |
| Do all four VA concerns share one owner? | **No** — intent/specification/transport/rendering have different natural owners |
| Preferred OQ-14 resolution | **Layered ownership:** DLA/GAM upstream for **intent and substance**; **renderer inference** as **default** specification target; **dedicated VA artefact** only if explicit portable metadata is product-required |
| Does VA survive as mandatory first-class architecture? | **No** — demoted to **optional** explicit-metadata path |
| Confidence | **High** on default renderer-inference target; **Medium** on conditional dedicated-artefact path |

---

## 1. Define the ownership problem

### What VA currently does (as-built)

| Function | Description | Matrix |
| -------- | ----------- | ------ |
| Schema emission | `visual_affordances[]`, `activities_visual_review[]`, schema 38.4 on page root | R-55 |
| Per-affordance decisions | `visual_decision` generate/defer/reject with enum rationale | R-56 |
| Per-activity review | `activity_visual_value` decision | R-57 |
| Added-value reasoning | `pedagogical_added_value` — whether a figure adds beyond existing materials | R-58 |
| Path citations | `source_basis` referencing upstream field paths | R-59 |
| Post-capture validation | Normalise and validate VA records | R-60 |

VA turns the Design Page emit path into a **renderer instruction generator** (audit §I) — specification-writing that competes with GAM material embedding on the same LLM call.

### Why OQ-13 removed generative VA from Design Page

| Reason | Source |
| ------ | ------ |
| VA is **renderer specification**, not learner content or assembly-coherence prose | OQ-13 §2; Assembly-Time Ownership Test §4 |
| T3 visibility (composed page) is **targeting input**, not ownership proof | OQ-13 §3 |
| R-59 `source_basis` enables **index-without-embed** (failure modes E, G) | Matrix; failure modes |
| Largest non-transport generative load on DP | Audit §I; dependency C8 |
| Current HTML export **does not consume** VA metadata | `renderer-export-behavior.md`; DQ-01 partial |

### What remains unowned after OQ-13

| Concern | Status after OQ-13 |
| ------- | ------------------ |
| **Visual intent** | Partially owned upstream (DLA table/spec roles; GAM material authoring) — not formalised as “VA” |
| **Visual specification** | **Unowned** — R-56–R-59 generative obligation has no designated stage |
| **Visual transport** | **Unresolved carrier** — page JSON may passively carry metadata (shared contract decision); DP does not author |
| **Visual rendering** | Implicitly renderer/UI — no explicit ownership decision recorded |
| **Validation** (R-60) | Orphaned from DP identity — must follow specification locus |

### Four-concern distinction

| Concern | Definition | Example |
| ------- | ---------- | ------- |
| **Visual intent** | Pedagogical judgement that visual support is valuable for an activity or concept | “This comparison benefits from a diagram.” |
| **Visual specification** | Structured metadata records describing generate/defer/reject decisions and rationale | `visual_affordances[]` rows with enums |
| **Visual transport** | Carrying metadata through artefacts without authoring it | Page root keys populated from bound upstream VA artefact |
| **Visual rendering** | How presentation layer uses materials and metadata to produce learner-visible output | Typography, figure placement, activity boundaries |

OQ-13 resolved **where VA must not live** (Design Page generative). OQ-14 resolves **where each concern should live**.

---

## 2. Candidate owners

### A. DLA

| Dimension | Assessment |
| --------- | ---------- |
| **Natural responsibilities** | Activity-level **visual intent** in specification: `required_materials`, table structure intent (`LD-TABLE-FIDELITY` spec role), scaffold signals that an activity needs tabular or diagrammatic support |
| **Information available** | Learning design intent **before** GAM realisation; no GAM `Content:` bodies; no assembled page |
| **Architectural fit** | **Strong for intent (T1)** — consistent with “DLA specifies” |
| **Risks** | Cannot own **specification records** requiring comparison to realised materials (R-58); cannot own renderer enums; would duplicate GAM body authoring if pushed beyond intent |

### B. GAM

| Dimension | Assessment |
| --------- | ---------- |
| **Natural responsibilities** | **Visual substance** — figures, tables, diagrams **embedded in `materials.*` Content**; table fidelity preservation |
| **Information available** | Full material bodies at GAM completion; per-activity realisation context |
| **Architectural fit** | **Strong for visual content (T2)** — instructional visuals that learners consume belong in materials |
| **Risks** | Conflates **learner content** with **renderer metadata** if asked to emit `visual_affordances[]`; GAM already carries core preservation burden; “generate figure beyond materials” (R-58) is **post-GAM** judgement |

### C. Dedicated VA step / artefact

| Dimension | Assessment |
| --------- | ---------- |
| **Natural responsibilities** | **Visual specification** — explicit `visual_affordances[]` records; per-activity review; added-value reasoning **after** GAM bodies exist |
| **Information available** | GAM materials (required for R-58); activity set; optionally page assembly context for cross-activity targeting |
| **Architectural fit** | **Strong for explicit metadata** — mirrors **DEP → Design Page transport** pattern (design upstream, transport on DP) |
| **Risks** | New pipeline binding; R-59 cite-path risk persists if specification substitutes for embed; approval and migration complexity; may be **unnecessary** if renderer infers from materials (DQ-01) |

### D. Renderer inference

| Dimension | Assessment |
| --------- | ---------- |
| **Natural responsibilities** | **Visual rendering**; infer presentation needs from `sections[]`, `materials.*`, activity structure |
| **Information available** | Full composed page at render/export time — maximum visibility |
| **Architectural fit** | **Strong for presentation** — natural consumer; aligns with Sprint 57 product layer focus |
| **Risks** | No portable explicit audit trail of generate/defer/reject; Sprint 57 OQ-03 (cognition vs clutter) harder to measure without structured records; “can see everything” must not be confused with needing **specification artefact** |

### E. Shared contract only (no generative owner)

| Dimension | Assessment |
| --------- | ---------- |
| **Natural responsibilities** | Schema definitions; optional page JSON key shapes; **no** generative obligation |
| **Information available** | N/A — contract layer is not a pipeline stage |
| **Architectural fit** | **Valid only if explicit VA records are eliminated** — materials + renderer suffice |
| **Risks** | Orphan schema without producer; future consumers expecting `visual_affordances[]` on every page (OQ-16) |

---

## 3. Ownership analysis

**Principle applied:** The component that **can see** information is not automatically the owner. Ownership follows **pipeline verbs** and **information first-knowable time** (Assembly-Time Ownership Test §1).

| Candidate | Required information? | Creates or consumes VA? | Preserves boundaries? | Coupling |
| --------- | --------------------- | ----------------------- | --------------------- | -------- |
| **DLA** | Yes for **intent** only | Creates intent signals, not VA records | **Yes** — stays in specify phase | Low |
| **GAM** | Yes for **substance** | Creates visual **content** in materials; should not create VA metadata | **Yes** if limited to bodies | Low–medium |
| **Dedicated VA step** | Yes for **specification** | **Creates** VA records | **Yes** — removes load from DP | Medium — new artefact binding |
| **Renderer inference** | Yes for **rendering** | **Consumes** materials + structure; may infer without explicit records | **Yes** — decouples compose from presentation | Low |
| **Shared contract only** | N/A | Neither creates nor consumes — defines shape | **Yes** if no producer needed | Lowest |

### Assembly-Time principles applied to specification

| Question | Answer |
| -------- | ------ |
| Could DLA own **specification records**? | **No** — R-58 requires GAM bodies |
| Could GAM own **specification records**? | **Partially reject** — bodies yes; generate/defer/reject enums are not material content |
| Does specification require **assembled page** visibility? | **Partial** — per-activity decisions need GAM output; cross-activity targeting benefits from assembly but is not sufficient reason to place ownership on DP |
| Default when substance is in GAM materials? | **Transport content (Layer 1)**; presentation is **renderer concern** |

---

## 4. Separate four concerns — ownership map

| Concern | Natural owner | Rationale |
| ------- | ------------- | --------- |
| **A. Visual intent** | **DLA** (specify) + **GAM** (realise in materials) | T1/T2 — intent before GAM; substance in `Content:` bodies |
| **B. Visual specification** | **Renderer inference (default)** OR **Dedicated VA artefact (conditional)** | Explicit records only if product requires portable metadata beyond materials |
| **C. Visual transport** | **Design Page (passive only)** IF VA artefact bound — same pattern as episode plans (R-61–R-63); **omit** if no explicit artefact | Layer 2 organise — carrier, not author |
| **D. Visual rendering** | **Renderer / UI layer** | Natural consumer; Sprint 57 product scope |

**Different concerns → different owners.** A single “VA owner” is architecturally imprecise; the pipeline should distribute concerns by phase.

---

## 5. Sprint 56A alignment

| Finding | Best-supported candidate |
| ------- | ------------------------ |
| Transport-and-organisation identity | **Renderer inference** + **GAM substance** — DP not in specification path |
| Layer 1 preservation | **GAM materials** as visual source of truth; eliminates R-59 cite-without-embed on DP |
| Layer 2 organisation | DP **passive transport** only if VA artefact exists |
| Layer 3 narrowing | Removes C8 generative stack from DP optional layer |
| Failure modes E, G | **Renderer inference** + full embed — no `source_basis` substitution on compose |
| Audit §I demotion | “Separate step **or** renderer inference” — both off DP critical path |
| Audit recommendation | “Never on critical path for materials” |

**Dedicated VA step** aligns with 56A if explicit metadata is required, but **renderer inference** aligns **more strongly** with preservation and current export reality (DQ-01).

---

## 6. Relocation options — comparative analysis

### Option 1 — DLA owns VA

| Criterion | Score | Notes |
| --------- | ----- | ----- |
| Ownership clarity | Low | Mixes specify-phase with post-GAM judgement |
| Architectural coherence | Low | Violates T2 for substance and R-58 |
| Preservation fidelity | Medium | Intent early; no guarantee of embedded bodies |
| Maintainability | Medium | Spreads visual concern into DLA scope |
| Approval complexity | Low | No new stage |

**Verdict:** **Reject** as specification owner. **Accept** DLA for **intent only**.

### Option 2 — GAM owns VA

| Criterion | Score | Notes |
| --------- | ----- | ----- |
| Ownership clarity | Medium | Clear for content; unclear for metadata enums |
| Architectural coherence | Medium | Strong for bodies; weak for `visual_affordances[]` |
| Preservation fidelity | **High** | Figures in materials |
| Maintainability | Medium | GAM load increase if metadata added |
| Approval complexity | Low | No new stage |

**Verdict:** **Accept** GAM for **visual substance in materials**. **Reject** GAM as owner of **specification records**.

### Option 3 — Dedicated VA step / artefact

| Criterion | Score | Notes |
| --------- | ----- | ----- |
| Ownership clarity | **High** | Explicit specification locus |
| Architectural coherence | **High** | DEP analogue; off DP critical path |
| Preservation fidelity | Medium | R-59 risk if step cites instead of requiring embed |
| Maintainability | Medium | Additional artefact lifecycle |
| Approval complexity | Medium | OQ-16, workflow binding decisions |

**Verdict:** **Conditional accept** — when programme requires **portable explicit VA metadata** for non-renderer consumers or structured audit (Sprint 57 PR-06 class questions).

### Option 4 — Renderer inference

| Criterion | Score | Notes |
| --------- | ----- | ----- |
| Ownership clarity | Medium–High | Presentation owns presentation |
| Architectural coherence | **High** | Consumer owns consumption; materials are SSOT |
| Preservation fidelity | **High** | No parallel specification competing with embed |
| Maintainability | **High** | Fewest generative moving parts |
| Approval complexity | **Low** | Aligns with current export behaviour |

**Verdict:** **Recommended default** relocation target for **visual specification** when explicit records are not product-required.

### Option 5 — Shared contract only (no owner)

| Criterion | Score | Notes |
| --------- | ----- | ----- |
| Ownership clarity | Low without producer | Schema without stage |
| Architectural coherence | High **if** VA records eliminated | Materials + renderer suffice |
| Preservation fidelity | **High** | No specification layer |
| Maintainability | **High** | Simplest model |
| Approval complexity | Low | Requires OQ-16 scope decision |

**Verdict:** **Accept** as **contract layer** for optional page keys; **not** a substitute for specification owner when records are required.

### Summary matrix

| Option | Intent | Specification | Transport | Rendering | Overall |
| ------ | ------ | ------------- | --------- | --------- | ------- |
| DLA | ✓ | ✗ | — | — | Partial |
| GAM | partial | ✗ (content only) | — | — | Partial |
| Dedicated VA step | — | ✓ (conditional) | via DP | — | Conditional |
| Renderer inference | — | ✓ (default) | — | ✓ | **Preferred** |
| Shared contract only | — | — | ✓ (passive) | — | Supporting |

---

## 7. Recommended OQ-14 resolution

### Preferred ownership target

**Layered resolution (not a single monolithic owner):**

| Concern | Owner |
| ------- | ----- |
| Visual **intent** | **DLA** (specify) |
| Visual **substance** | **GAM** (realise in `materials.*`) |
| Visual **specification** | **Renderer inference** — **default** |
| Visual **specification** (explicit records) | **Dedicated VA artefact/step** — **conditional** only if SQ-VA-4 confirms product need |
| Visual **transport** | **Design Page** — **passive verbatim carry** when VA artefact bound; otherwise **omit** |
| Visual **rendering** | **Renderer / UI layer** |
| R-60 validation | Follows specification locus (renderer path or VA artefact path) |

### Rationale

1. **Preservation first:** Layer 1 invariant requires visual teachable content in **embedded materials**, not parallel metadata (OQ-13; failure mode G).
2. **Current product reality:** HTML export does not consume `visual_affordances[]` (DQ-01) — explicit specification is **not** architecturally required today.
3. **Pipeline verbs:** DLA specifies intent; GAM realises bodies; Design Page transports and organises; Renderer presents — specification enums on DP violated this sequence (OQ-13).
4. **Visibility ≠ ownership:** Renderer has maximum visibility at export time — appropriate for **inference**, not proof that DP should have authored records earlier.
5. **Audit alignment:** “Separate step **or** renderer inference” — renderer inference is the **lower-risk default**; dedicated step reserved for explicit-metadata product requirements.
6. **DEP precedent:** If explicit VA artefact is adopted, **design owns specification, DP transports** — never DP generative.

### Clear statements

| Question | Answer |
| -------- | ------ |
| Should VA become a **dedicated architecture concern**? | **Optional only** — not mandatory pipeline stage |
| Should VA **disappear entirely**? | **As generative compose obligation — yes.** As a concept — **no**; survives as **GAM content + renderer presentation**, with **optional** explicit metadata path |
| Should VA be **inferred downstream**? | **Yes — default** for specification/rendering |
| Should VA be **owned upstream**? | **Yes — for intent (DLA) and substance (GAM)** |

### Confidence level

| Aspect | Confidence |
| ------ | ---------- |
| Renderer inference as default specification target | **High** |
| DLA/GAM split for intent/substance | **High** |
| DP passive transport when artefact bound | **High** |
| Conditional dedicated VA artefact | **Medium** — pending SQ-VA-4 |
| Elimination of mandatory schema 38.4 on every page | **High** (supports OQ-16 direction) |

### Stakeholder questions (defer)

| ID | Question |
| -- | -------- |
| SQ-VA-4 | Does any **planned** consumer require portable `visual_affordances[]` on page JSON (non-HTML pipelines, audit tooling)? |
| SQ-VA-5 | If dedicated artefact adopted, does it bind **pre-** or **post-** page assembly? (Planning only — affects transport, not DP authorship) |

---

## 8. Knock-on effects

### OQ-15 (`source_basis`)

| Effect |
| ------ |
| **Largely resolved** — R-59 not on DP; default renderer-inference path has **no `source_basis` cite-without-embed** on compose |
| If dedicated VA artefact: OQ-15 reopens as **artefact policy** (cite vs require embed) — **reject cite substitution** per Layer 1 |

### W2-09 (VA boundary review)

| Effect |
| ------ |
| **Complete** for planning — disposition: layered ownership; DP generative VA removed; transport passive-only |

### Approval tracker

| Update |
| ------ |
| **D4** — OQ-14: layered resolution; renderer inference default |
| **F3e** — VA relocation target (pending CP-4) |

### CP-2 / CP-4

| Effect |
| ------ |
| **CP-2** VA disposition **substantively complete** — pending SQ-VA-4 for conditional path |
| **CP-4** can approve target architecture with VA demoted from DP critical path |

### Implementation planning readiness

| Effect |
| ------ |
| W3 dependency impact: trace **GAM materials** as visual SSOT; **renderer** as presentation owner |
| OQ-16 (schema 38.4 scope): **not required on every page** under default path |
| Sprint 57 architecture state (`SPRINT-57-ARCHITECTURE-STATE.md` lists DP as VA owner) — **superseded for planning** by 56B OQ-13/OQ-14; record as **as-built vs target** tension at CP-4 |

### Remaining open questions

| ID | Status after OQ-14 |
| -- | ------------------ |
| OQ-14 | **Resolved (planning)** — layered; renderer inference default |
| OQ-15 | **Resolved (planning)** under default path |
| OQ-16 | **Narrowed** — schema optional, not universal |
| DQ-01 | **Answered** for current HTML — VA not required |

---

## Proposed tracker entries

### SPRINT-56B-OPEN-QUESTIONS.md — OQ-14

| Field | Value |
| ----- | ----- |
| **Status** | **Resolved (planning)** — pending SQ-VA-4, CP-4 |
| **Resolution** | **Layered ownership.** Default: **renderer inference** for specification/rendering; **DLA** intent; **GAM** substance in materials; **DP passive transport** only if VA artefact bound. **Dedicated VA artefact** conditional on explicit portable metadata need. VA **not** mandatory first-class pipeline concern. |
| **Artefact** | This document |

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `DESIGN-PAGE-OQ-14-VISUAL-AFFORDANCES-RELOCATION-TARGET-REVIEW.md` |
| OQ | OQ-14 |
| Consumers | W2-09 · OQ-15 · OQ-16 · CP-2 · CP-4 · W3 |

**Planning and approval artefact only.**
