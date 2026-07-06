# Sprint 56C — Wave 2 Thin Assembly-Coherence Bridge Definition

**Sprint:** 56C — Design Page Migration Execution  
**Wave:** 2 — Boundary refactoring (architecture definition)  
**Date:** 2026-07-06  
**Status:** **Frozen target** — pending implementation authorisation  
**Type:** Governance / architecture definition — **no implementation**

**Authority:** [Wave 2 Discovery](SPRINT-56C-WAVE-2-ASSEMBLY-COHERENCE-DISCOVERY.md) · [Wave 1 Closure](SPRINT-56C-WAVE-1-CLOSURE-SUMMARY.md) · [CP-4 Brief](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-CP-4-ARCHITECTURE-APPROVAL-BRIEF.md) · [Guardrails §A–C](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-ARCHITECTURE-GUARDRAILS.md) · [Assembly-Time Ownership Test](../2026-07-06-sprint-56b-design-page-migration-planning/DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) (OQ-02)

**Supersedes for Wave 2 planning:** Any pre–Wave 1 wrapper-module behaviour (journey assimilation, authorial exposition, rhetoric, EQF) as Design Page identity. Implementers must not infer obligations from removed modules or lib soak.

---

## Section 1 — Problem statement

### 1.1 Context

Wave 1 closed with Design Page as **transport-first**. The triple wrapper stack and all rejected generative mandates were removed from the runtime path. Layer 1 (preserve & embed) and Layer 2 (organise) are fully contracted.

Wave 2 discovery found a **specification gap**: CP-4 Decision **D6** (OQ-09) approves a **single thin assembly-coherence bridge**, but post–Wave 1 the emit path carries only an **R-40 label** on `overview` / `learning_purpose` inside compose/materials wording. Responsibilities **R-44, R-45, R-47** exist in deprecated lib modules and are **not injected**.

Without a frozen definition, Wave 2 implementation risks:

- Re-introducing the removed wrapper stack under a new name
- Confusing **transport** with **assembly-coherence**
- Using “readable assembly” (R-83) as licence to optimise or summarise payloads
- Duplicating DLA-owned per-activity continuity in page wrapper prose

### 1.2 Problem to solve

Define **one** bounded generative obligation — the **thin assembly-coherence bridge** — such that a future implementer can answer:

> **“What can Design Page still do after Wave 1?”**

without referring to journey assimilation, authorial exposition, rhetoric, or any other removed architecture.

### 1.3 Non-goals (Wave 2 definition scope)

This document does **not** authorise implementation, prompt edits, or runtime changes. It does **not** reopen CP-4 decisions D1–D7, OQ-17, or OQ-13–16.

---

## Section 2 — Thin bridge definition

### 2.1 Precise definition

The **thin assembly-coherence bridge** is the **sole** Design Page **generative prose** contract (Layer 3). It exists to make a **multi-source assembled page** navigable and structurally legible **after** upstream bodies are bound to final membership and order.

It may emit **only**:

- **Navigation** — where the learner starts and how to move through the composed page
- **Sequencing** — order-dependent framing between **composed** activities at page level
- **Structural framing** — one rhetorical job per wrapper section; deduplication across wrapper slots
- **Assembly-level continuity** — minimal connective glue between wrapper sections **without** restating archival or transported payloads

It operates under a **transport-first rule**: for every wrapper section (`overview`, `learning_purpose`, and optionally `study_tips` / `knowledge_summary` **bodies**), **transport upstream text verbatim when present**; emit bridge prose **only** to fill gaps where upstream provides no suitable body **and** the [Assembly-Time Ownership Test](#section-5--assembly-time-ownership-test) passes.

### 2.2 What it is not

| Not the bridge | Belongs to |
| -------------- | ---------- |
| Instructional explanations, concept teaching, inquiry substance | LC, LO, DLA, GAM materials |
| Per-activity orientation and reasoning scaffolds | DLA activity-row fields (transport) |
| Per-activity intellectual continuity | `intellectual_coherence_bridge` on DLA (transport) |
| Knowledge preview or glossary synthesis | LC/KM (transport-or-omit) |
| Closure / epistemic synthesis bullets | GAM consolidation bodies → `study_tips` (transport-or-omit) |
| Materials bodies, tables, scenarios | GAM `activity.materials.*` (transport) |
| Pedagogical quality framework guidance | EQF (removed from DP) |
| Voice polish, rhetoric, learner-arc authoring | Removed rhetoric / authorial stack |
| Visual affordance specification | Renderer inference / upstream VA artefact |
| Page structure schema, membership, ordering | Layer 2 organise (non-generative) |
| Anti-condense / complete-payload rules | R-83 / F40 guardrails (non-generative) |

### 2.3 Architecture questions — answers

| # | Question | Answer |
| - | -------- | ------ |
| **1** | What is the thin assembly-coherence bridge? | The **only** DP generative contract: minimal page-level navigation, sequencing, and wrapper-slot discipline after assembly, **transport-first**, volume-capped, no instructional substance. |
| **2** | What inputs may it inspect? | **Read-only:** final composed activity membership and order; `learning_sequence` timing/order signals; upstream bodies for wrapper slots (LC, LO, LC/KM, LS `transition_to_next`); section schema slots; `page_profile`; workflow brief resolution (profile/facilitator policy only — not content invention). **Must not** inspect GAM `Content:` bodies to summarise them into wrapper prose. |
| **3** | What outputs may it create? | Prose in **wrapper transport slots only**: primarily `overview` and `learning_purpose` section bodies when upstream gap exists; optional **verbatim placement** of upstream transition text into permitted slots; **section headings** (structural labels). It may **not** create new schema fields. |
| **4** | What outputs are prohibited? | Instructional explanations; summaries of materials or activities; synthesized `knowledge_summary` or `study_tips`; new cognition demands; rhetoric/voice/facilitator choreography; VA rows; paraphrases of GAM/DLA payloads; scheduling-only transitions; content in `activity.materials.*` or activity-row scaffold fields. |
| **5** | What assembly-time information justifies existence? | **Final** activity set C and composed order; visibility of which activities are included/excluded; cross-activity dependencies knowable only after membership closure; empty wrapper slots when upstream omitted body. **Not justified** when upstream already supplies the wrapper body. |
| **6** | What distinguishes it from authorial exposition? | Authorial exposition **authored educational wrapper substance** (stakes, inquiry arc, voice, closure synthesis). The bridge **does not teach**; it **orients navigation** and **prevents wrapper-slot collision**. No learner-arc mandate, no rhetorical polish, no “compose a coherent authored learning experience.” |
| **7** | How does it interact with R-40? | R-40 is the **inventory anchor** for wrapper transition / thin continuity. The bridge **is** the consolidated implementation vehicle for R-40, merged with structural constraints from R-44, R-45, R-47 — **not** a separate transition module. |
| **8** | How does it interact with narrowed R-83? | R-83 is a **non-generative guardrail** on Layer 2 assembly quality (complete transport, no condense). The bridge **must not** invoke R-83 to optimise wrapper prose or shorten payloads. R-83 bounds **whether** the page is valid; the bridge bounds **optional thin prose** in wrapper gaps. |
| **9** | How does it preserve transport-first identity? | **Order of operations:** (1) bind upstream bodies to slots; (2) omit optional sections when no upstream body; (3) only then apply bridge fallback in remaining gaps; (4) never override transported text for “coherence.” |

### 2.4 Volume and surface constraints (normative)

| Constraint | Rule |
| ---------- | ---- |
| **Surfaces** | Wrapper section bodies: `overview`, `learning_purpose` (primary). `knowledge_summary`, `study_tips`: **transport-or-omit only** — bridge **must not** synthesize. |
| **Per-gap fallback cap** | When bridge prose is required, each affected wrapper section: **≤ 80 words** unless verbatim upstream transport (no cap on transported text). |
| **Cross-activity pointer** | **≤ 60 words** per inter-activity continuity insert in wrapper (R-40 historical band). |
| **Token budget** | Bridge contract block in prompt: **materially smaller** than removed authorial + journey modules combined. |
| **Forbidden patterns** | Scheduling-only transitions; facilitator voice; “In this session we will”; epistemic closure bullets; recap of task lists; paraphrase of material titles. |

---

## Section 3 — Allowed responsibilities

The bridge **may** require the model to perform the following when **transport-first** conditions are met:

| ID | Responsibility | Description |
| -- | -------------- | ----------- |
| **AC-01** | Transport-first gate | Use upstream wrapper bodies verbatim when present; omit section when policy says omit and no body exists. |
| **AC-02** | Page-level navigation | State what the assembled resource contains and recommended entry point (structural, not instructional). |
| **AC-03** | Composed sequencing pointer | Reference **composed** activity order / section flow when membership differs from upstream enumeration. |
| **AC-04** | Upstream transition placement | Place `learning_sequence.transition_to_next` (or equivalent upstream text) into wrapper **verbatim** when provided. |
| **AC-05** | Wrapper slot discipline | One job per section: overview ≠ learning_purpose (R-44 merged). |
| **AC-06** | Wrapper de-duplication | Do not repeat the same upstream substance in multiple wrapper slots (R-47 merged). |
| **AC-07** | Continuity without payload restatement | Minimal glue between wrapper sections when gaps exist — **no** restatement of activity or material bodies (R-40/R-45 merged). |
| **AC-08** | Structural headings | Meaningful `heading` strings on `sections[]` — organisation labels, not lessons. |

**Layer 2 responsibilities** (organise) remain **outside** the bridge but are co-required for a valid page: membership, ordering, schema, episode-plan transport, assessment transport.

---

## Section 4 — Prohibited responsibilities

The bridge **must not** require, imply, or encode:

| ID | Prohibition | Former / related removed architecture |
| -- | ----------- | ------------------------------------- |
| **PB-01** | Journey assimilation / inquiry arc authoring | `LD-JOURNEY-ASSIMILATION` |
| **PB-02** | Authorial exposition / wrapper educational authorship | `LD-AUTHORIAL-EXPOSITION` |
| **PB-03** | Rhetoric, voice, learner-arc polish | `LD-SELF-DIRECTED-RHETORIC` |
| **PB-04** | EQF developmental framing on DP | `EDUCATIONAL-QUALITY-FRAMEWORK` on `step_design_page` |
| **PB-05** | `knowledge_summary` synthesis from KM/LC | R-39, R-71 |
| **PB-06** | `study_tips` synthesis from GAM signals | R-41 synthesis |
| **PB-07** | VA generation or schema 38.4 mandate | Sprint 38 VA on DP |
| **PB-08** | Brevity / density optimisation | R-78–R-80 |
| **PB-09** | Assimilate `intellectual_coherence_bridge` into wrapper | Journey / authorial preservation boundary violations |
| **PB-10** | Rewrite, summarise, or paraphrase archival fields | R-22, R-24, R-46, R-50 |
| **PB-11** | Instructional overview front-loading concepts | R-37 substantive |
| **PB-12** | Facilitator choreography in learner `page_profile` | R-48 relocated |
| **PB-13** | “Readable assembly” as excuse to condense materials | R-83 misread |

---

## Section 5 — Assembly-time ownership test

Source: [DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md](../2026-07-06-sprint-56b-design-page-migration-planning/DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) (OQ-02).

### 5.1 Bridge application procedure

For any candidate bridge output **X**:

```
Step 1 (T1): Does upstream already provide substance for this wrapper slot?
  → YES: Transport verbatim. Bridge STOP for that slot.
  → NO:  Continue.

Step 2 (T2): Is X material-body or activity-row scaffold content?
  → YES: PROHIBITED — upstream DLA/GAM owns. Bridge STOP.
  → NO:  Continue.

Step 3 (T3): Is X only meaningful after final membership C and composed order?
  → NO:  PROHIBITED — relocate upstream or omit.
  → YES: Continue.

Step 4 (§4 Allowed): Is X in {navigation, sequencing, relationships, structural framing,
                      assembly-level coherence without payload restatement}?
  → NO:  PROHIBITED — even if T3=Yes.
  → YES: ALLOWED with volume caps (§2.4).
```

### 5.2 Distinction from authorial exposition

| Dimension | Authorial exposition (removed) | Thin bridge (approved) |
| --------- | ------------------------------ | ---------------------- |
| **Purpose** | Shape an “authored learning experience” | Make assembled artefact navigable |
| **Substance** | Stakes, inquiry, capability narrative, closure synthesis | Pointers, order, slot discipline |
| **Surfaces** | overview, purpose, knowledge_summary, study_tips, high-level framing | overview, learning_purpose gaps only (others transport-or-omit) |
| **Activity rows** | Could inform preamble/bridge phrasing | **Never** rewrite or assimilate row fields |
| **Volume** | Unbounded wrapper prose | Capped fallback |
| **Voice** | Learner arc, anti-formulaic editorial rules | Neutral navigation; no rhetoric module |
| **Test outcome** | Failed D6 — collapsed | Passes T3 + §4 Allowed only |

---

## Section 6 — R-40 disposition

| Field | Disposition |
| ----- | ----------- |
| **Status** | **Retained** — sole generative inventory item for wrapper continuity |
| **Implementation** | **Merged into thin bridge** — not a separate runtime module or reinjection of journey `TRANSITION_LINES` |
| **Meaning** | Order-dependent **page-level** framing between composed units when upstream transition text is absent |
| **Transport rule** | When `learning_sequence` or upstream provides transition prose → **verbatim transport** to permitted wrapper slot; bridge does not paraphrase |
| **Prohibited reading** | 30–60 word “conceptual continuity” that **teaches** or **summarises** activity/material content — continuity is **navigational**, not instructional |
| **Relation to R-45** | R-45 **constraints** (intellectual momentum, no formulaic openers) may appear as **forbidden patterns** in bridge — not a separate generative mandate |

---

## Section 7 — R-83 disposition

| Field | Disposition |
| ----- | ----------- |
| **Status** | **Retained narrowed** — **guardrail**, not part of bridge generative identity |
| **Approved definition** | Self-contained, well-structured **Layer 2** artefact: correct schema, complete membership, defensible ordering, meaningful headings, **verbatim transport** — **without** condensing, summarising, paraphrasing, or rewriting archival payloads |
| **Separate from bridge** | R-83 answers “Is the page assembly valid and complete?” Bridge answers “What minimal wrapper prose fills gaps?” |
| **Interaction** | Bridge prose **must not** cite R-83 to shorten materials or “improve readability” of wrapper bodies |
| **Wave 2 alignment task** | Codify R-83 in domain §13 and compose as **delimiter** wording; remove ambiguous “readable page” optimise cues (W2.5) — **orthogonal** to bridge lib module |
| **Enforcement locus** | `LD-MATERIALS-COPY` F40 / PREC-02 (existing) + explicit R-83 delimiter text (planned) |

---

## Section 8 — Future implementation constraints

When implementation is authorised, it **must** satisfy:

| # | Constraint |
| - | ---------- |
| **IC-01** | **One** bridge contract module (or one embedded block) — single inject point on DP augment path |
| **IC-02** | **No** reinjection of `LD-AUTHORIAL-EXPOSITION`, `LD-JOURNEY-ASSIMILATION`, or `LD-SELF-DIRECTED-RHETORIC` on DP |
| **IC-03** | Bridge appended **after** compose + L4 preserve blocks; must reference preservation boundary by pointer only |
| **IC-04** | Domain §13 and compose `FIELD_AUTHORIZING_LINES` defer to bridge SSOT — remove duplicate contradictory wrapper mandates |
| **IC-05** | Tests: assert bridge marker present; assert removed markers absent; assert transport-first ordering in contract text |
| **IC-06** | Deprecation register: record bridge as **replacement** for R-40/R-44/R-45/R-47 **on DP path** — lib soak unchanged until later cleanup |
| **IC-07** | Generation Visibility: validate contract/prompt alignment only — not Copilot output quality |
| **IC-08** | Volume caps and forbidden patterns encoded in contract — not left to model discretion alone |
| **IC-09** | `knowledge_summary` and `study_tips` remain **transport-or-omit** — bridge contract must state **no synthesis** explicitly |
| **IC-10** | Facilitator `page_profile`: bridge navigation only; no invention of logistics (SQ-F1 deferred policy) |

---

## Section 9 — Recommended implementation scope

### 9.1 In scope (Wave 2 W2.3 + W2.5)

| Package | Deliverable |
| ------- | ----------- |
| **W2.3** | New `LD-THIN-ASSEMBLY-COHERENCE` (or equivalent) lib contract + single `app.js` inject on DP path |
| **W2.3** | Merge R-40, R-44, R-45, R-47 **constraints** into one block; remove R-40 label-only duplication where SSOT moves |
| **W2.5** | R-83 narrowed delimiter in domain §13 + compose cross-reference |
| **Tests** | Gate suite: bridge present; removed stack absent; transport-first language; forbidden patterns listed |

### 9.2 Out of scope for bridge implementation

| Item | Wave / owner |
| ---- | ------------ |
| SQ-1 / SQ-2 upstream packaging | W2.4 |
| R-38 `learning_purpose` transport policy | W2.6 |
| Facilitator R-84/R-85 | W2.7 |
| Lib soak deletion (authorial/journey modules) | Optional post-soak |
| Renderer changes | Not DP bridge |
| Copilot runtime proof | Out of Prism scope |

### 9.3 Success criteria (definition freeze)

A future implementer can answer **without removed architecture**:

| Question | Answer source |
| -------- | ------------- |
| What can DP still generate? | §2.1, §3 — thin bridge in wrapper gaps only |
| What must DP transport? | Layer 1–2 inventory in discovery §1.1 |
| What is forbidden? | §4 |
| How to decide allow vs deny? | §5 procedure |
| What are R-40 and R-83? | §6, §7 |

---

## Appendix A — Candidate responsibility decision table

Classification key:

- **Allowed** — legitimate bridge or Layer 2 organise responsibility
- **Allowed with constraints** — permitted only under stated conditions
- **Prohibited** — not bridge; transport, upstream, renderer, or removed

| Candidate responsibility | Classification | Conditions / locus |
| ---------------------- | -------------- | ------------------ |
| **Section delimiters** | **Allowed** | Layer 2 — `sections[]` schema, `section_id`, ordering; non-generative structure |
| **Organisational labels** | **Allowed with constraints** | `heading` strings: structural labels only; **not** concept teaching or lesson titles that front-load instruction |
| **Navigation pointers** | **Allowed with constraints** | Page-level “start here / proceed to activities”; ≤80 words per gap; no facilitator choreography |
| **Membership signalling** | **Allowed** | Layer 2 — which activities appear, `activities_omitted[]`, order in `learning_activities.content[]`; non-generative |
| **Source references** | **Allowed with constraints** | `source_artefacts`, provenance metadata — **not** “see upstream” instead of embedding GAM bodies (R-22) |
| **Transitions** | **Allowed with constraints** | Verbatim upstream `transition_to_next` **or** thin navigational glue ≤60 words; **prohibited:** scheduling-only (“Next complete Activity 2”) |
| **Summaries** | **Prohibited** | Any synopsis of materials, activities, or KM — includes `knowledge_summary` synthesis (OQ-17) |
| **Learning guidance** | **Prohibited** | Instructional guidance belongs in DLA scaffolds + GAM materials — DP transports |
| **Study tips** | **Prohibited** (as bridge output) | **Transport-or-omit** from GAM closure bodies only — bridge must not author |
| **Explanatory prose** | **Prohibited** | Concept explanation in wrapper = R-37 substantive / mode A |
| **Connective narrative** | **Allowed with constraints** | **Wrapper-only**, ≤80 words, **navigational** continuity between sections; must not restate payloads or teach concepts |
| **Coherence commentary** | **Allowed with constraints** | Meta-level slot discipline (overview vs purpose dedup) — **not** epistemic synthesis or “what you should now understand” |
| **Intellectual bridge content** | **Prohibited** on DP | `intellectual_coherence_bridge` is **DLA-owned** — copy verbatim on activity row; **never** assimilate to wrapper |

---

## Appendix B — What Design Page can still do after Wave 1

*Self-contained summary for implementers — no removed-module references required.*

| Layer | Design Page may |
| ----- | ---------------- |
| **1 — Preserve & embed** | Copy GAM `Content:` into `activity.materials.*`; copy DLA activity-row fields; transport episode plans and assessment items; transport-or-omit `knowledge_summary` and `study_tips` bodies |
| **2 — Organise** | Emit valid page schema; set `page_profile`; close activity membership; order activities; assign section slots and structural headings; record `source_artefacts` and `generation_notes` |
| **3 — Thin bridge (Wave 2)** | When wrapper upstream body absent and T3 passes: emit minimal navigation/sequencing prose in `overview` / `learning_purpose` under volume caps |
| **Guardrails** | Enforce complete payload (R-22, R-24, F40); enforce readable assembly delimiter (R-83); never condense archival fields for page size |
| **Quality (PRISM)** | Post-compose repair and structural validators — restore upstream omissions; not generative authoring |

**Design Page may not:** teach, summarise, synthesize, rhetorically polish, generate VA, apply EQF, or re-author any upstream educational substance.

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `SPRINT-56C-WAVE-2-THIN-ASSEMBLY-COHERENCE-BRIDGE-DEFINITION.md` |
| Type | Frozen Wave 2 target architecture |
| Implementation | **Not authorised** by this document |
| Runtime changes | **None** |
| Next step | Wave 2 implementation planning / W2.3 authorisation |
