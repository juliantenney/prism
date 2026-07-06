# OQ-13 — Visual Affordances Ownership Review

**Sprint:** 56B — Design Page Migration Planning & Architecture Approval  
**Status:** Planning artefact — architecture review  
**Date:** 2026-07-06  
**Governing frameworks:**
- [DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md](DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) v1.0
- [DESIGN-PAGE-OQ-17-KNOWLEDGE-SUMMARY-POLICY-REVIEW.md](DESIGN-PAGE-OQ-17-KNOWLEDGE-SUMMARY-POLICY-REVIEW.md)

**Evidence base:** Sprint 56A artefacts (frozen)

**Scope note:** The review request listed R-61–R-63 alongside VA items. In the responsibility matrix, **R-61–R-63 are episode plan transport** (cluster C4), not visual affordances. They are referenced briefly in §1 for inventory accuracy but are **out of scope** for OQ-13. VA inventory is **R-55–R-60**.

**This document does not propose implementation, prompt changes, code changes, renderer changes, or workflow modifications.**

---

## Executive summary

| Question | Finding |
| -------- | ------- |
| What type of responsibility is VA? | **Primarily renderer specification (D)** with **presentation metadata (C)** — mixed **E** |
| Does VA pass Assembly-Time Ownership as a **generative DP obligation**? | **No** — visibility at assembly (T3) does not confer ownership |
| Does VA survive as a **Design Page generative responsibility**? | **No** |
| Recommended OQ-13 resolution | **Option B** — move VA **specification ownership** out of Design Page; page artefact may **carry** metadata under shared contract (hybrid organisational carry only) |

---

## 1. Inventory — current VA-related responsibilities

### Visual affordances (in scope)

| ID | Purpose | Current owner (as-built) | Dependency assumptions | Affects |
| -- | ------- | ------------------------ | ------------------------ | ------- |
| **R-55** | Emit VA schema 38.4: `visual_affordances[]`, `activities_visual_review[]` | Design Page emit (Sprint 38 block; §13 keys) | Composed activity set; materials/rows present | **Structure** + **presentation metadata** on page JSON |
| **R-56** | Per-affordance `visual_decision` generate/defer/reject with full enum | Design Page LLM specification | GAM materials; DLA rows; activity_ids | **Renderer specification** (not learner body content) |
| **R-57** | Per-activity `activity_visual_value` decision and rationale | Design Page | Activity membership set | **Presentation metadata** |
| **R-58** | `pedagogical_added_value` reasoning — figure adds beyond materials | Design Page | Material bodies for comparison | **Renderer specification** + **content judgement** |
| **R-59** | `source_basis` path citations to upstream fields | Design Page | GAM/DLA field paths | **Presentation metadata** — **preservation risk** (substitute for embed) |
| **R-60** | Post-capture VA validate/normalise | PRISM composition pipeline (`sprint38-visual-affordances.js`) | Page JSON with VA keys | **Rendering pipeline** quality layer — not generative |

### Linked references (not separate matrix rows)

| Reference | Role |
| --------- | ---- |
| Audit §I | Largest non-transport load; renderer instruction generator |
| Dependency cluster **C8** | VA emit path; compose pipeline step 4 |
| Validation audit §3.6 | Prompt + code pair for schema enforcement |
| `DESIGN-PAGE-EPISODE-PLANS-SCHEMA.md` | Episode metadata not HTML — analogous portability pattern for page-root metadata |
| `renderer-export-behavior.md` | **No** `visual_affordance` references — current HTML export does not consume VA |
| Matrix R-65 | Episode plans input auto-binding — wiring, not VA |
| §13 `defaultOutputStructure` | Optional top-level VA keys on page object |

### Episode plans R-61–R-63 (out of scope — inventory correction)

| ID | Purpose | Relation to OQ-13 |
| -- | ------- | ----------------- |
| R-61–R-63 | Verbatim DEP transport to `episode_plans[]` / per-row `episode_plan` | **Not VA** — Layer 1 conditional transport (C4); renderer treats as metadata not learner HTML |
| R-64 | Episode plans excluded from section prose | Guardrail on C4, not VA |

---

## 2. Classify VA type

| Type | Applies? | Evidence |
| ---- | -------- | -------- |
| **A — Content** | **No** (primary) | VA does not teach concepts; learner bodies remain in `materials.*` and sections |
| **B — Organisation** | **Partial** | R-55 places metadata keys on page root — organisational **carrier** only |
| **C — Presentation metadata** | **Yes** | `visual_affordances[]`, `activities_visual_review[]` — describe presentation intent |
| **D — Renderer specification** | **Yes (primary)** | R-56 generate/defer/reject; R-58 added-value; audit: “renderer instruction generator” |
| **E — Mixed** | **Yes** | Specification-writing on DP emit + schema on page + PRISM validation (R-60) |

**Conclusion:** VA is **not Layer 1 learner content**. It is **downstream presentation/rendering concern** optionally **carried** on the page artefact schema.

---

## 3. Assembly-Time Ownership Test application

**Subject:** VA **generative specification** (R-55–R-59). R-60 is post-generative validation — evaluated under quality layer, not ownership of specification.

### Per-responsibility evaluation

| ID | T1 (DLA)? | T2 (GAM)? | T3 (assembled page visibility)? | Visibility ≠ ownership |
| -- | --------- | --------- | ------------------------------- | ---------------------- |
| **R-55** | Partial — DLA may specify table **intent** (`LD-TABLE-FIDELITY` spec role) | Partial — GAM authors figures **in materials** | **Yes** — schema emission follows composed activity set | **Yes** — page may **carry** schema without **authoring** VA records on DP |
| **R-56** | No — not activity specification | Partial — “generate figure” could mean embed in GAM material | **Yes** — decision per composed affordance target | **Yes** — seeing activities ≠ DP should specify renderer enums |
| **R-57** | No | No | **Yes** — per-activity review needs final membership | **Yes** — visibility for **indexing**; owner is VA spec layer or renderer |
| **R-58** | No | **Yes** — compares to material bodies GAM produced | **Yes** — needs embedded materials to judge “adds beyond” | **Yes** — judgement belongs **after** GAM bodies exist, not on assembly step |
| **R-59** | No | No | **Yes** — paths reference composed field locations | **Yes** — citations are **index substitutes** (mode G); not DP ownership |

### Decision rules applied

| Step | Result |
| ---- | ------ |
| 1 — T1 | **Partial** for visual **intent** only → DLA/GAM upstream roles; **not** VA enum specification |
| 2 — T2 | **Partial** — instructional figures belong **in GAM materials** as content; added-value reasoning is **post-GAM assessment** |
| 3 — T3 | **Yes** for targeting — but per ownership test corollary 1: **transport default** does not apply (VA is not upstream prose) |
| 4 — T3 + §4 | VA generative work is **not** assembly-coherence prose (OQ-02 allowed table). It is **specification-writing** — **not** a permitted DP generative category |

### Critical distinction (OQ-13 specific)

| Confusion | Correction |
| --------- | ---------- |
| “Design Page **can see** composed activities and materials” | True — required to **target** VA decisions |
| “Design Page **should own** VA specification” | **False** — visibility is **input** to a downstream concern, not proof of pipeline-stage ownership |
| Analogy | Episode plans require composed `activity_id` alignment (T3) but **DEP owns design**; DP **transports** (R-61–R-63). VA has no equivalent “upstream VA artefact” today — specification is **invented on DP**, which is the architectural error |

**Parallel to OQ-17:** KM/LC content exists upstream → DP must not author. VA specification does **not** exist upstream → DP must not **invent** it on the transport step; another layer must own it.

---

## 4. Architectural placement evaluation

| Placement | Advantages | Risks | Coupling | Preservation |
| --------- | ---------- | ----- | -------- | -------------- |
| **Design Page (status quo)** | Single artefact; self-describing page JSON | Largest non-transport load; token competition; R-59 vs R-17 (modes G, E); blurs DP identity | Hard-wired compose pipeline step 4; Sprint 38 prompt on emit | **Weakens** — `source_basis` substitutes for embed |
| **GAM** | Materials already contain teachable visuals; GAM-PRES depth | Conflates body authoring with renderer metadata; not all pages need figures | GAM already heavy | **Improves** if figures are **in** materials |
| **Renderer / UI layer** | Natural consumer; `renderer-export-behavior.md` already ignores VA for HTML | Inference may lag explicit spec; needs material inputs | Decouples from compose LLM | **Improves** — no cite-without-embed on DP |
| **Shared contract layer** | Schema 38.4 as cross-cutting contract; page as **carrier** only | Two-step workflow if spec separate from page | Export/page JSON schema stability | Neutral if carrier only |
| **Separate VA specification artefact / step** | Clear ownership; preserves DP transport identity; matches audit demotion | Migration sequencing; workflow graph change (planning only) | Medium — new binding | **Improves** — removes competition on emit |

---

## 5. Alignment with Sprint 56A findings

| Finding | VA on Design Page (generative) |
| ------- | ------------------------------ |
| **Transport-and-organisation identity** | **Violates** — turns DP into renderer instruction generator (audit §I) |
| **Layer 1 preservation** | **Weakens** — competes for attention with R-17 embed; failure modes A, D |
| **Layer 2 organisation** | **Partial fit** — schema keys only (R-55 carrier) |
| **Layer 3 optional/supporting** | **Misplaced** — VA is not assembly-coherence prose; should not expand Layer 3 |
| **Failure mode E** | R-59 reinforces index mental model |
| **Failure mode G** | R-59 + empty materials — matrix competition R-23 vs R-59 |
| **External Candidate classification** | R-55–R-59 already External in matrix |
| **Target derivation non-responsibility** | “Specify visual affordances” explicitly outside identity |

**Boundary clarity:** Removing generative VA from DP **strengthens** boundary clarity. Retaining it **preserves** the largest non-transport ambiguity on the step.

---

## 6. Ownership options

### Option A — Keep VA on Design Page

| Criterion | Assessment |
| --------- | ------------ |
| Architectural coherence | **Low** — conflicts with transport-and-organisation identity |
| Ownership clarity | **Low** — renderer spec on assembly step |
| Future maintainability | **Low** — prompt + pipeline + schema triple coupling |
| Approval complexity | **Low** (status quo) — but **high** fidelity risk |

**Verdict:** **Not recommended** as target architecture.

### Option B — Move VA ownership out of Design Page

| Criterion | Assessment |
| --------- | ------------ |
| Architectural coherence | **High** — DP remains transport + organise |
| Ownership clarity | **High** — VA spec owned by dedicated artefact/step or renderer |
| Future maintainability | **High** — decoupled emit paths |
| Approval complexity | **Medium** — requires OQ-14 target choice; dependency impact review (W3) |

**Verdict:** **Recommended.** Generative specification (R-56–R-58, R-59) **not** on DP.

### Option C — Hybrid model

| Element | Owner |
| ------- | ----- |
| Page JSON **schema slots** for VA (optional keys) | **Shared contract / Layer 2 organise** — carrier only |
| VA **record authoring** | **Separate VA specification artefact or renderer inference** |
| R-60 validation | Follows wherever records are authored; **quality layer** |

| Criterion | Assessment |
| --------- | ------------ |
| Architectural coherence | **Medium–High** — if carrier is passive and spec is external |
| Ownership clarity | **Medium** — risk of reverting to Option A if DP regains generative duty |
| Future maintainability | **Medium** |
| Approval complexity | **Medium** |

**Verdict:** **Acceptable** only if hybrid strictly limits DP to **empty/pass-through metadata** populated by downstream process — not LLM VA authoring on DP emit.

---

## 7. Recommended OQ-13 resolution

### Preferred option

**Option B — Move VA specification ownership out of Design Page**, with **contractual allowance** for optional VA keys on page JSON under **shared contract layer** (organisational carry) if future consumers require a self-describing artefact — **without** Design Page performing generative VA specification.

### Rationale

1. VA is **renderer specification (D)**, not learner content — outside Assembly-Time Ownership permitted generative categories (OQ-02).
2. T3 visibility is **necessary for targeting** but does **not** establish DP ownership (§3).
3. Sprint 56A audit §I, matrix External Candidate classification, and failure modes G/E identify VA on DP as **preservation risk**.
4. Current HTML export (`renderer-export-behavior.md`) **does not consume** VA — DP ownership not required for present renderer (DQ-01 partial answer).
5. Aligns with OQ-17 precedent: **upstream or downstream owns substance**; DP does not invent parallel specification on the transport step.

### Does VA survive as a Design Page responsibility?

| VA facet | Survives on DP? |
| -------- | --------------- |
| **Generative specification** (R-56, R-58, R-59, generative R-55) | **No** |
| **Organisational schema carry** (passive optional keys) | **Optional** — contract decision, not identity |
| **Validation** (R-60) | **Not DP identity** — quality layer wherever VA records exist |

**Clear answer:** VA **does not survive** as a **generative** Design Page responsibility. It may survive **only** as **non-generative page JSON structure** if the shared contract requires it.

### Confidence level

| Aspect | Confidence |
| ------ | ---------- |
| Reject generative VA on DP | **High** |
| Option B as target ownership | **High** |
| Hybrid carrier-only on page JSON | **Medium** — depends on OQ-14 and future consumer audit |
| Current renderer requires VA on page | **High** that it does **not** (export doc silent; DQ-01) |

### Unresolved stakeholder questions (defer to OQ-14)

| ID | Question |
| -- | -------- |
| SQ-VA-1 | Relocate to **separate workflow step** vs **renderer inference**? (OQ-14) |
| SQ-VA-2 | Must page JSON remain **self-describing** with VA keys for non-HTML consumers? |
| SQ-VA-3 | Schema 38.4 — contract version owned where? (shared contract layer) |

---

## 8. Knock-on effects

### Layer 3 boundary review

| Effect |
| ------ |
| C8 **generative** obligations **removed** from Layer 3 identity |
| Layer 3 further **narrows** to assembly-coherence prose (OQ-02) + guardrails + validation |
| R-59 elision risk **reduced** on DP emit path |

### Workstream 2

| Item | Effect |
| ---- | ------ |
| **W2-09** (VA boundary review) | **Unblocked** — disposition: move spec ownership out of DP |
| **W2-06** (profiles) | Unchanged |
| Guardrail mapping (C9) | Less coupling to C8 generative stack |

### Approval tracker

| Update |
| ------ |
| **D3** — OQ-13: Option B; generative VA not DP identity |
| **F3d** — VA ownership resolution (pending OQ-14, CP-4) |

### Implementation planning readiness

| Gate | Effect |
| ---- | ------ |
| W3 dependency impact | Must trace VA relocation vs page schema (C14) |
| OQ-14 becomes **next** VA planning decision |
| OQ-15 (`source_basis`) largely **moot** on DP if R-59 moves |
| OQ-16 (schema 38.4 scope) → **shared contract** question |

### Remaining open questions

| ID | Status after OQ-13 |
| -- | ------------------ |
| OQ-13 | **Resolved (planning)** — generative VA not on DP |
| OQ-14 | **Active** — relocation target |
| OQ-15 | **Subsumed** if R-59 not on DP |
| OQ-16 | **Active** — contract scope |
| DQ-01 | **Partially answered** — current export does not require VA |

---

## Proposed tracker entries

### SPRINT-56B-OPEN-QUESTIONS.md — OQ-13

| Field | Value |
| ----- | ----- |
| **Status** | **Resolved (planning)** — pending OQ-14, CP-4 |
| **Resolution** | **Option B.** VA **specification ownership** moves out of Design Page. DP does **not** perform generative VA (R-56–R-59). Optional passive VA schema keys on page JSON remain a **shared contract** decision, not DP generative identity. R-60 follows VA ownership locus. Governed by this review + Assembly-Time Ownership Test. |
| **Artefact** | This document |

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `DESIGN-PAGE-OQ-13-VISUAL-AFFORDANCES-OWNERSHIP-REVIEW.md` |
| OQ | OQ-13 |
| Consumers | W2-09 · OQ-14 · CP-2 · W3 |

**Planning and approval artefact only.**
