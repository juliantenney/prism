# Design Page — Assembly-Time Ownership Test

**Sprint:** 56B — Design Page Migration Planning & Architecture Approval  
**Status:** Planning artefact — normative test for boundary review  
**Date:** 2026-07-06  
**Version:** 1.0  
**Supersedes as OQ-02 decision frame:** “Author vs Organise” binary

**Evidence base:** [Sprint 56A findings](../2026-07-06-sprint-56a-design-page-simplification-planning/SPRINT-56A-CLOSURE-REPORT.md)  
**Related:** [DESIGN-PAGE-TARGET-ARCHITECTURE-DERIVATION.md](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-TARGET-ARCHITECTURE-DERIVATION.md), [DESIGN-PAGE-RESPONSIBILITY-MATRIX.md](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-RESPONSIBILITY-MATRIX.md), [DESIGN-PAGE-PRESENTATION-INFERENCE-CONSTRAINT.md](DESIGN-PAGE-PRESENTATION-INFERENCE-CONSTRAINT.md)

**Citable during:** OQ-02 resolution · OQ-17 review · OQ-13 review · Workstream 2 boundary reviews · Architecture approval checkpoint **CP-2**

**This document does not propose implementation, prompt changes, code changes, or workflow modifications.**

---

## 1. Purpose

### Why “Author vs Organise” is insufficient

Sprint 56A established that Design Page is fundamentally a **read-only transport-and-organisation stage**. The initial OQ-02 framing — *should Design Page author new prose or only organise upstream prose?* — forces a binary that misclassifies legitimate obligations:

| Problem with binary | Consequence |
| ------------------- | ----------- |
| **“Organise only”** treats all new learner-facing text as forbidden | Excludes prose that genuinely depends on the composed page artefact (activity order, section grouping, cross-activity relationships) |
| **“Author”** bundles assembly-coherence prose with instructional authoring | Conflates low-risk navigation framing with high-risk summarisation, KM/LC re-synthesis, and GAM paraphrase (failure modes A, G) |
| **Historical responsibility** (wrapper modules on Design Page emit path) is used as proxy for architectural fit | Perpetuates triple-stack modules (journey, authorial, rhetoric) that 56A evidence attributes to fidelity failures |
| **No test for information availability** | Cannot distinguish *transport* from *generation* when upstream artefacts already contain the substance |

The binary therefore **blocks clear planning decisions**: stakeholders must choose between an unrealistically strict “zero prose” model and the status quo that 56A proved unsafe.

### Why ownership should follow information availability

Sprint 57 pipeline ownership is stage-based for a reason: **DLA specifies**, **GAM realises bodies**, **Design Page assembles**. Architectural fit is determined by **when information becomes knowable**, not by which step currently hosts a prompt module.

| Principle | Implication |
| --------- | ----------- |
| Content knowable before GAM completes | Must not be invented on Design Page; DLA or upstream artefacts own it |
| Material substance knowable when GAM completes | GAM owns bodies; Design Page transports |
| Relationships knowable only after membership, ordering, and embedding are fixed | Design Page may own **assembly-coherence** obligations only |

Ownership by information availability aligns with 56A findings: failures occur when Design Page **generates** content that upstream already contains or that constitutes instructional substance, while **competing** with transport mandates on the same emit path.

---

## 2. Core principle

### Normative statement

> **Design Page may create learner-facing content only when that content depends on information that becomes available for the first time during page assembly** — final activity membership, canonical section grouping, embedded material placement, cross-activity order, and whole-page journey coherence.

### Corollaries

1. **Transport default:** If equivalent substance exists in an upstream artefact, Design Page **transports** it verbatim into the appropriate page field or section; it does not re-express it.
2. **Assembly-coherence exception:** Prose that describes **relationships, sequencing, dependencies, navigation, or assembly-level framing** — and that cannot be finalised until the page is composed — is a **candidate** Design Page obligation subject to the three-test procedure (§3).
3. **Explicit denial:** Design Page must not generate instructional explanations, material-body summaries, LC/KM re-synthesis, alternative pedagogy, motivational or editorial filler, or paraphrase of GAM `Content:` bodies — regardless of wrapper section slot.
4. **Downstream symmetry:** The same denial applies to renderer inference and presentation — see [Presentation Inference Constraint](DESIGN-PAGE-PRESENTATION-INFERENCE-CONSTRAINT.md). Educational intent and substance remain upstream; rendering remains downstream.

### Alignment with Sprint 56A

| 56A conclusion | How this principle expresses it |
| -------------- | --------------------------------- |
| Transport-and-organisation identity | T1/T2 affirmative → not Design Page |
| P2 Transport before narration | Assembly-coherence prose is subordinate to Layer 1 embed |
| P5 Archival vs authorable | Activity rows and `materials.*` remain archival; only assembly-coherence candidates may be generative |
| P6 Upstream authority for bodies | T1/T2 capture upstream ownership |

---

## 3. Assembly-Time Ownership Test

### Definitions

| Test | Question |
| ---- | -------- |
| **T1** | Could **DLA** (or upstream specification artefacts bound before GAM) legitimately create this content? |
| **T2** | Could **GAM** legitimately create this content while realising material bodies? |
| **T3** | Does this content **require visibility** of the assembled page artefact — final activity membership, section grouping, which materials are included per activity, cross-activity order, and whole-page learner journey? |

**“Legitimately”** means: consistent with pipeline verbs (DLA specifies, GAM realises) and without requiring page-level structure that does not exist until assembly.

### Decision rules

Apply in order:

```
1. If T1 = Yes  →  DLA owns (or upstream LC/LO/KM if not DLA field).
                  Design Page: transport only. Stop.

2. If T2 = Yes  →  GAM owns.
                  Design Page: transport only. Stop.

3. If T3 = No   →  Design Page is NOT owner.
                  Options: transport from upstream, omit, or relocate to earlier stage.
                  Stop.

4. If T3 = Yes  →  Candidate Design Page assembly-time obligation.
                  Apply §4 Allowed vs Disallowed tables.
                  If disallowed category → reject even if T3 = Yes.
                  If allowed category → accept as bounded Layer 3 obligation.
                  If mixed → split obligation or escalate to stakeholder (§8).
```

### Classification outcomes

| Outcome label | Meaning |
| ------------- | ------- |
| **DLA-owned** | Create or specify on DLA; Design Page copies/transports |
| **GAM-owned** | Create on GAM; Design Page embeds `Content:` |
| **Upstream-owned** | LC/KM/LO/assessment/DEP artefact; Design Page transports when bound |
| **DP assembly-owned** | Assembly-coherence obligation; bounded generative prose permitted |
| **Remove / not required** | No legitimate owner on Design Page; delete, merge, or satisfy via transport |
| **Stakeholder decision** | T3 or allow/disallow ambiguous; product or profile judgement required |

### Guardrails and plumbing

Responsibilities that **bound** generation (e.g. R-46, R-50, R-24) are not subject to T1–T3 as *content* — they are **constraints on** candidate DP assembly-owned prose. If no assembly-owned prose remains, associated guardrails **diminish in scope** (56A core reduction Cluster F).

---

## 4. Allowed vs disallowed Design Page generation

Apply **only** when decision rules reach step 4 (T3 = Yes candidate).

### Allowed — assembly-coherence generation

| Category | Description | Typical matrix anchors | 56A principle |
| -------- | ----------- | ---------------------- | ------------- |
| **Navigation** | How to move through the composed page; where to start; section pointers | R-04 headings (structural) | P3 final output |
| **Sequencing** | Order-dependent framing between activities **as composed** | R-40, R-45 | P2 transport before narration |
| **Activity relationships** | Dependencies between activities visible only after membership closure | Thin overview links | P4 read-only assembly |
| **Cross-activity dependencies** | “After completing A, you will…” when A and B membership is final | R-40 | Layer 2 membership |
| **Assembly-level coherence** | Conceptual continuity between wrapper sections without restating payloads | R-44, R-47 | P5 archival boundary |
| **Structural framing** | Section role discipline; non-schema headings; deduplication across wrapper slots | R-44, R-47, R-04 | Layer 2 organise |

**Volume expectation (planning):** Assembly-coherence prose is **thin** relative to transported payloads. It must not compete with GAM/DLA embed for token budget (56A audit §2; failure mode A).

### Disallowed — Design Page generation

| Category | Description | Typical matrix anchors | Failure / evidence |
| -------- | ----------- | ---------------------- | ------------------ |
| **Instructional explanations** | Teaching concepts that belong in materials or scaffolds | R-37 substantive overview | Mode A |
| **Material summaries** | Synopsising GAM `Content:` in any field | R-41 synthesis, R-72 risk | Modes A, D, G |
| **LC/KM re-synthesis** | Authoring `knowledge_summary` from knowledge model | R-39, R-71 | Audit §L; mode A |
| **Alternative pedagogy** | Replanning, reframing tasks, new cognitive demands | R-43 meta-authoring | P4; R-16 |
| **Motivational / editorial filler** | Progression vocabulary, epistemic closure bullets, rhetoric polish | R-51, R-49 | Audit §G |
| **Re-authoring GAM outputs** | Paraphrasing consolidation/transfer instead of transporting | R-41, R-42 | Modes A, G |
| **Metadata as payload** | Purpose/type labels substituting for `Content:` | — | Mode B |
| **Brevity-driven condensation** | Shortening for page size or readability | R-80, ambiguous R-83 | Modes A, D |

**Hard rule:** Disallowed categories are **rejected even when T3 = Yes**. Assembly-time visibility does not licence instructional authoring.

---

## 5. Relationship to layer model

Source: [DESIGN-PAGE-TARGET-ARCHITECTURE-DERIVATION.md](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-TARGET-ARCHITECTURE-DERIVATION.md) Phase 3.

| Layer | Relationship to ownership test |
| ----- | ------------------------------ |
| **Layer 1 — Preserve & embed** | **Not generative.** T1/T2 outcomes land here as transport. Test steps 1–2 assign ownership upstream; Design Page embeds. No assembly-time prose. |
| **Layer 2 — Organise** | **Primarily non-generative.** Schema, membership, order, metadata, provenance. R-70 (section slot) is organisational — *whether* a section exists, not *authoring* its instructional body. Headings (R-04) are the lightest assembly-owned presentation on Layer 2/3 boundary. |
| **Layer 3 — Optional / supporting** | **Narrowed by this test** — not expanded. Only **DP assembly-owned** candidates from step 4 survive. Triple wrapper stack, knowledge authoring, rhetoric substance, brevity params fail allow/disallow or T3/no-T3 rules. Guardrails remain Layer 3 **constraints** while generative modules exist. |

### Effect on Layer 3 scope

```
Before test (as-built):  Journey + Authorial + Rhetoric + Knowledge author + VA + guardrails + brevity
After test (planning):   Thin assembly-coherence contract + guardrails (reduced) + VA (OQ-13 separate)
                         + validation/plumbing (non-generative)
```

The test **does not** create a new authoring mandate. It **filters** Layer 3 to obligations that pass T3 **and** the allowed table, and **rejects** the majority of current wrapper responsibilities (matrix R-35, R-39, R-41–R-43, R-49, R-51, R-53, R-71, R-78–R-80).

---

## 6. Worked examples

### R-40 — Wrapper transition prose

| Test | Result | Reasoning |
| ---- | ------ | --------- |
| T1 | Partial | `learning_sequence` exists upstream; per-activity transitions may be specified |
| T2 | No | Not material body content |
| T3 | **Yes** | Placement of 30–60 word continuity **in page wrapper** between composed units requires final order and section grouping |

**Classification:** **DP assembly-owned** (allowed: sequencing, assembly-level coherence)  
**Constraint:** Must not restate activity or material bodies; transport upstream transition text where it already exists verbatim.

---

### R-39 — Knowledge summary authoring

| Test | Result | Reasoning |
| ---- | ------ | --------- |
| T1 | **Yes** (LC/KM upstream) | `knowledge_model` / `learning_content` exist before assembly |
| T2 | No | Not GAM material obligation |
| T3 | No | Summary substance does not require composed page — only upstream models |

**Classification:** **Remove / not required on Design Page** — **Upstream-owned (LC/KM)**  
**Design Page obligation:** Transport verbatim excerpt if section required (R-70 slot), or omit section (OQ-17). **Disallowed:** re-synthesis (§4).

---

### R-38 — Learning purpose authoring

| Test | Result | Reasoning |
| ---- | ------ | --------- |
| T1 | **Yes** | `learning_outcomes` available before GAM; capability framing is specification-level |
| T2 | No | |
| T3 | Partial | Page-level emphasis possible, but substance is not assembly-dependent |

**Classification:** **DLA-owned / upstream-owned** — **transport only**  
**Design Page obligation:** Emit `learning_purpose` section content from LO/LC/DLA upstream fields without re-authoring capability narrative.

---

### R-37 — Overview section authoring

| Test | Result | Reasoning |
| ---- | ------ | --------- |
| T1 | Partial | LC/LO may contain inquiry framing and stakes |
| T2 | No | |
| T3 | **Yes** for page-level arc | Inquiry/stakes **across all included activities** require final membership and order |

**Classification:** **Stakeholder decision** — **split obligation**  
- **Transport portion:** LC/LO/LA substance → not generative on DP  
- **Assembly portion:** Thin navigation/journey framing across composed activities → **DP assembly-owned** if stakeholder accepts  
**Risk:** Audit §E — overview front-loading duplicates activity content (mode A). Disallowed table rejects instructional explanations.

---

### R-41 — Study tips / closure synthesis

| Test | Result | Reasoning |
| ---- | ------ | --------- |
| T1 | No | |
| T2 | **Yes** | GAM consolidation/transfer materials are material bodies |
| T3 | Partial | Section placement is assembly; **substance** is not |

**Classification:** **GAM-owned** — **transport only**  
**Design Page obligation:** If `study_tips` section exists, populate from GAM consolidation/transfer `Content:` verbatim (or dedicated materials field), not synthesis. **Disallowed:** re-authoring GAM outputs (§4). R-42 (reference without embed) **Remove**.

---

## 7. Impact on OQ-02

### Proposed resolution — for SPRINT-56B-OPEN-QUESTIONS.md

| Field | Value |
| ----- | ----- |
| **ID** | OQ-02 |
| **Status** | **Resolved (planning)** — pending CP-4 stakeholder sign-off |
| **Resolution** | Design Page ownership is governed by the **Assembly-Time Ownership Test** ([DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md](DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md)). Design Page remains transport-and-organisation first (Layer 1–2). It may emit **assembly-coherence prose** only where T3 = Yes and the obligation appears in §4 Allowed categories. All instructional and material substance is satisfied by upstream transport (DLA, GAM, LC/KM). Current triple wrapper stack responsibilities that fail the test are **not** architectural identity. |
| **Supersedes** | “Author vs Organise” binary |
| **Date** | 2026-07-06 |

### Proposed entry — for SPRINT-56B-ARCHITECTURE-APPROVAL-TRACKER.md

| Field | Value |
| ----- | ----- |
| **Decision ID** | D1 |
| **Question** | OQ-02 — Assembly-time ownership |
| **Decision** | **Adopt Assembly-Time Ownership Test** as normative boundary rule for Layer 3 and wrapper review |
| **Options rejected** | (a) Organise-only — zero generative prose; (b) Status quo — retain triple wrapper stack as identity |
| **Status** | **Pending CP-4 sign-off** |
| **Artefact** | This document v1.0 |
| **Checkpoint** | CP-2 Layer 3 boundary disposition |

---

## 8. Open risks — remaining stakeholder decisions

The test **resolves** most wrapper inventory; the following require **stakeholder judgement** at CP-2 or CP-4:

| ID | Responsibility | Issue | Why stakeholder |
| -- | -------------- | ----- | --------------- |
| **R-36** | Inquiry arc framing (Q→I→E→J) | Page-level arc vs LC/LO duplication | T3 partial; allowed only if thin structural framing — substance may belong upstream |
| **R-37** | Overview section authoring | Split transport vs assembly-coherence | Highest mode A risk if “overview” becomes instructional front-load |
| **R-48** | Wrapper voice variants | Self-study vs workshop voice on assembly prose | Brief-level vs DP-level; facilitator profile interaction |
| **R-83** | Readable page assembly scope | Wording spans structure **and** wrapper optimisation | Must narrow to Layer 2 structure only; ambiguous licence for condensation (mode A) |
| **R-84** | Facilitator profile content | Logistics/run guidance deliverable | Different `page_profile`; may be assembly-time or separate artefact — product decision |
| **R-85** | Support notes section | Section slot vs facilitator upstream transport | Profile-specific; transport path unclear |

### Secondary risks (not blockers for test adoption)

| Risk | Note |
| ---- | ---- |
| Domain artefacts §18 profile rules | “Substantive summary” on learner profile may require **upstream** summary field, not DP authoring |
| OQ-09 wrapper merge | Largely pre-answered: merge to **single assembly-coherence contract**; OQ-09 reduces to *word budget* |
| OQ-13 VA | Orthogonal — specification metadata, not prose; T3 applies to activity-set visibility only |
| Product evidence on thin overview value | May inform R-37 stakeholder split; not required to adopt test |

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md` |
| Version | 1.0 |
| Owner sprint | 56B |
| Consumers | W2 boundary review · OQ-17 · OQ-13 · CP-2 · CP-4 |
| Change policy | Planning revision only; no implementation implied |

**Planning and approval artefact only.**
