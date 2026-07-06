# OQ-17 — Knowledge Summary Policy Review

**Sprint:** 56B — Design Page Migration Planning & Architecture Approval  
**Status:** Planning artefact — architecture review  
**Date:** 2026-07-06  
**Governing framework:** [DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md](DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) v1.0  
**Evidence base:** Sprint 56A artefacts (frozen)

**This document does not propose implementation, prompt changes, code changes, or workflow modifications.**

---

## Executive summary

| Question | Finding |
| -------- | ------- |
| Should Design Page **author** knowledge summaries? | **No** — fails Assembly-Time Ownership Test; violates §4 Disallowed (LC/KM re-synthesis) |
| Should Design Page **transport** knowledge summaries? | **Yes, when** LC/KM (or designated upstream artefact) provides a transportable summary body |
| Should Design Page **omit** the section? | **Yes, when** no upstream summary exists or workflow does not bind LC/KM |

**Recommended OQ-17 resolution:** **Transport-or-omit** — **Option A or C**; **Option B rejected.**

---

## 1. Current knowledge-summary-related responsibilities

### Primary matrix items

| ID | Responsibility | Classification | Ownership assumption (as-built) | Dependency assumptions | Assembly-time visibility required? |
| -- | -------------- | -------------- | ------------------------------- | ---------------------- | ---------------------------------- |
| **R-39** | Synthesise orienting summary from KM/LC into `knowledge_summary` | External Candidate | Design Page **authors** via journey `KNOWLEDGE_SUMMARY_LINES` | `knowledge_model`, `learning_content` bound; journey assimilation module | **No** — KM/LC exist before page assembly |
| **R-70** | Include `knowledge_summary` section when LC/KM bound | Secondary | Design Page **organises** section shell | §13 `promptTemplate`; bindings to LC/KM | **Partial** — slot placement in `sections[]` is assembly; **content** is not |
| **R-71** | Preview constraints — avoid glossary dump; preview concepts | External Candidate | Design Page **edits** summary style | Authorial + journey knowledge lines | **No** — editorial rules on summarisation task |
| **R-72** | Anti-restate guard — do not dump full materials in `knowledge_summary` | Core (guardrail) | Design Page **must not** duplicate `materials.*` in summary | L4 archival split; journey knowledge path | **No** — constraint on content choice, not generative trigger |

### Linked responsibilities (not primary but coupled)

| ID / source | Link to knowledge summary | Note |
| ----------- | ------------------------- | ---- |
| **R-02** | Canonical section order includes `knowledge_summary` | Layer 2 organisation — order, not content |
| **R-49** | Rhetoric shapes `knowledge_summary` among wrapper sections | External; fails ownership test same as R-39 if generative |
| **R-37, R-38** | Wrapper sections adjacent to knowledge in page arc | Cross-field bleed risk (matrix competition) |
| **Audit §L** | Author orienting summary from KM/LC | Classification **C** (Conflict) |
| **Audit §4 Layer 3** | No `knowledge_summary` re-authoring — transport or omit | Aligns with this review |
| **Composition contract P4** | `knowledge_summary` optional canonical `section_id` | Renderer/export tolerate omission (`omitIfMissing` patterns) |
| **Domain artefacts §18** | Learner profile may require “substantive summary/content” | **Product constraint** — satisfied by upstream transport or activity-embedded knowledge, not DP authoring |
| **Failure modes A, G** | Summarisation; material elision via wrapper | Driven by R-39-class behaviour |

### Distinction (required by review)

| Dimension | Owner under transport-or-omit policy |
| --------- | -------------------------------------- |
| **Section existence** | Design Page (R-70) — Layer 2 organise when upstream summary is bound and transportable |
| **Section content** | **LC/KM upstream** (or designated summary artefact) — Design Page transports verbatim |
| **Section presentation** | Layer 2 headings/structure (R-04, R-02); not generative summary prose on DP |

---

## 2. Assembly-Time Ownership Test application

**Subject:** `knowledge_summary` **section content** (instructional/orienting summary prose).

### T1 — Could DLA provide this?

| Assessment | **No** as primary owner of page-level knowledge summary |
| ---------- | ------------------------------------------------------- |
| Reasoning | DLA specifies activity obligations and scaffolds; page-level knowledge modelling is not DLA’s verb (pipeline reference). |
| Exception | DLA does not typically emit a dedicated `knowledge_summary` body for the page artefact. |

**LC/KM upstream (T1 analogue):** **Yes.** `learning_content` and `knowledge_model` artefacts exist **before** GAM and Design Page. Substance for an orienting summary is knowable at LC/KM stage.

**Decision rule step 1:** Upstream **LC/KM owns content** → Design Page: **transport only** if section is retained.

### T2 — Could GAM provide this?

| Assessment | **No** |
| ---------- | ------ |
| Reasoning | GAM realises per-activity material bodies (`Content:`). Page-level cross-topic knowledge summary is not a material obligation. Activity-level exposition belongs **in materials**, not in a separate page-level re-synthesis. |

**Decision rule step 2:** Not applicable as owner.

### T3 — Does it require assembled-page visibility?

| Assessment | **No** for summary **substance** |
| ---------- | -------------------------------- |
| Reasoning | Orienting summary from KM/LC does not require knowledge of final activity membership, embedded GAM bodies, or cross-activity order to **exist**. At most, a **thin assembly-time index** (“the activities below cover…”) would require T3 — that is assembly-coherence (OQ-02 allowed table), not knowledge re-synthesis. |
| R-39 behaviour | Synthesises from KM/LC **before** assembly constraints bind — confirms **non-assembly** ownership |

**Decision rule step 3:** T3 = **No** for knowledge summary **content** → Design Page is **not** generative owner.

**Decision rule step 4:** Even if a stakeholder argued T3 = Yes for a thin index, **§4 Disallowed** lists **LC/KM re-synthesis** and **material summaries** — knowledge summary authoring is **disallowed** generative category.

### Test outcome

| Content type | Classification |
| ------------ | -------------- |
| Knowledge summary **body** (orienting/preview prose) | **Upstream-owned (LC/KM)** — transport or omit on DP |
| Knowledge summary **authoring on DP** (R-39, R-71) | **Remove / not required** |
| Section **slot** (R-70) | **DP organise** — conditional on transport availability |
| Anti-restate (R-72) | **Guardrail** — scope reduces if section omitted or transport is non-duplicative |

---

## 3. Natural ownership

| Component | Natural owner | Design Page role |
| --------- | ------------- | ---------------- |
| Knowledge **modelling** | LC / KM steps | None |
| Activity-embedded **exposition** | GAM materials + DLA scaffolds | Transport embed |
| Page-level **summary body** | LC/KM (if produced upstream) | **Transport verbatim** into `knowledge_summary.content` |
| **Section existence** in page JSON | Design Page | Include `section_id: knowledge_summary` when binding + transportable body exist |
| **Section ordering** | Design Page (R-02) | Layer 2 |
| **Generative summary on assembly** | **None** | **Rejected** |

Knowledge summaries **do not survive** the ownership test as a **generative** Design Page obligation. They **may survive** as a **transported section** when upstream supplies the body.

---

## 4. Sprint 56A evidence alignment

| Evidence | Relationship to DP-authored summaries |
| -------- | ------------------------------------- |
| **Failure mode A** (summarisation) | **Reinforced by R-39** — second summarisation layer competes with GAM embed; global page optimisation |
| **Failure mode G** (material elision) | **Reinforced** — knowledge_summary can host previews while materials thinned or referenced elsewhere (matrix: knowledge in two places) |
| **Audit §L** | **Clearest structural conflict** — upstream has LC/KM; DP re-synthesises |
| **Target derivation** — non-responsibility “re-model knowledge” | **Violated** by Option B |
| **P1 Preservation before optimisation** | **Violated** by authoring that shortens or paraphrases upstream |
| **P2 Transport before narration** | **Violated** when summary is composed before/at expense of material embed |
| **Transport-and-organisation identity** | **Violated** by Option B; **aligned** by Option A |

DP-authored summaries **violate** established 56A findings. Transport-or-omit **aligns** with them.

---

## 5. Evaluation of three options

### Option A — Transport

| Criterion | Assessment |
| --------- | ------------ |
| **Architectural fit** | **High** — consistent with ownership test step 1; Layer 1 transport default |
| **Ownership clarity** | **High** — LC/KM owns substance; DP embeds in section |
| **Preservation fidelity** | **High** if verbatim; **Medium** if upstream summary itself is thin (upstream quality issue, not DP scope) |
| **Dependency impact** | Requires **transportable upstream field** or artefact slice; export contract already allows section |
| **Complexity** | **Low** on DP — no generative module; binding + copy |

**Condition:** Upstream must emit (or already contain) a designated summary body suitable for verbatim transport.

### Option B — Author

| Criterion | Assessment |
| --------- | ------------ |
| **Architectural fit** | **None** — fails T1/T3; §4 Disallowed |
| **Ownership clarity** | **Low** — duplicates LC/KM; confuses pipeline verbs |
| **Preservation fidelity** | **Low** — mode A/G; competes with R-17 on same emit path |
| **Dependency impact** | Perpetuates R-39, R-71, R-49, R-72 guardrail stack |
| **Complexity** | **High** — journey + authorial + rhetoric paths |

**Rejected** under Assembly-Time Ownership Test and 56A evidence.

### Option C — Omit

| Criterion | Assessment |
| --------- | ------------ |
| **Architectural fit** | **High** — when no upstream summary; simplest Layer 2 |
| **Ownership clarity** | **High** — knowledge lives in activities/materials only |
| **Preservation fidelity** | **Highest** for materials — removes second summarisation surface |
| **Dependency impact** | `omitIfMissing` compatible; domain §18 may need stakeholder interpretation |
| **Complexity** | **Lowest** — R-70 inactive; R-39/R-71 removed |

**Valid default** when LC/KM do not provide transportable summary or workflow omits binding.

### Comparative summary

| Option | Verdict |
| ------ | ------- |
| **A — Transport** | **Approved** when upstream body exists |
| **B — Author** | **Rejected** |
| **C — Omit** | **Approved** when no transportable upstream |

**Composite policy:** **A ∨ C**, never B.

---

## 6. Recommended OQ-17 resolution

### Preferred option

**Adopt transport-or-omit policy:**

1. **If** `knowledge_model` and/or `learning_content` provides a **designated transportable summary body** → **Option A**: Design Page includes `knowledge_summary` section and **transports content verbatim**.
2. **Else** → **Option C**: **Omit** `knowledge_summary` section; learner knowledge is carried in activities, materials, and upstream artefacts without page-level re-synthesis.

**Option B (Design Page authoring) is excluded** from target architecture.

### Rationale

- Assembly-Time Ownership Test steps 1 and 3 assign content to LC/KM, not Design Page.
- §4 Disallowed explicitly rejects LC/KM re-synthesis.
- 56A audit §L and failure modes A/G identify authoring as structural conflict.
- Transport-or-omit preserves ownership clarity without requiring a generative Layer 3 obligation.

### Confidence level

| Aspect | Confidence |
| ------ | ---------- |
| Reject Option B | **High** |
| Adopt transport-or-omit framework | **High** |
| Option A viable in current workflows | **Medium** — depends on whether LC/KM emit transportable summary fields today |
| Option C as safe default | **High** |

### Unresolved stakeholder questions

| # | Question | Why open |
| - | -------- | -------- |
| SQ-1 | Does LC/KM currently emit a **single transportable summary field**, or must upstream packaging be defined first? | Determines A vs C frequency in live workflows — **upstream packaging**, not DP design |
| SQ-2 | Does domain artefacts §18 “substantive summary/content” for learner profile **require** a `knowledge_summary` section, or is activity-embedded knowledge sufficient? | Product/profile interpretation |
| SQ-3 | OQ-19 radical simplification — knowledge **only** inside activities — still compatible with C as default | Strategic product choice |

---

## 7. Knock-on effects

### R-70 — Section slot

| Effect |
| ------ |
| **Retain** as Layer 2 conditional organise: include section **only when** Option A conditions met |
| **Do not** treat slot existence as mandate to author content |

### R-71 — Preview constraints

| Effect |
| ------ |
| **Remove** from target architecture — editorial rules on a generative task DP no longer performs |
| If upstream summary quality rules needed → **LC/KM ownership** |

### R-72 — Anti-restate guard

| Effect |
| ------ |
| **Demote** from Core identity if section omitted in most workflows |
| **Retain** as **conditional guardrail** when Option A transport used — prevents transported summary from duplicating `materials.*` |
| Scope **shrinks** with Option C prevalence |

### Layer 3 boundary review (Workstream 2)

| Effect |
| ------ |
| W2-07 (knowledge summaries) **unblocked** — disposition: transport-or-omit |
| R-39, R-49 generative paths on `knowledge_summary` → **remove** from Layer 3 |
| Wrapper stack overlap (knowledge in two places) **reduced** |

### Approval tracker

| Field | Proposed update |
| ----- | --------------- |
| New decision **D2** | OQ-17: Transport-or-omit; Option B rejected |
| CP-2 | Knowledge disposition **resolved (planning)** pending SQ-1/SQ-2 |

### Implementation planning readiness

| Gate | Effect |
| ---- | ------ |
| W5 population | Knowledge policy **defined** for §1 Layer 3 disposition |
| OQ-18 (cross-field bleed) | **Largely moot** if Option B removed |
| OQ-19 (activities-only knowledge) | Aligns with **Option C** as strategic default |

---

## Proposed tracker entries

### SPRINT-56B-OPEN-QUESTIONS.md

| Field | Value |
| ----- | ----- |
| **Status** | **Resolved (planning)** — pending SQ-1, SQ-2 stakeholder input |
| **Resolution** | **Transport-or-omit.** Design Page transports `knowledge_summary` content verbatim from LC/KM when a transportable upstream body exists; otherwise omits the section. Design Page **does not author** knowledge summaries (Option B rejected). Governed by [DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md](DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md). |
| **Artefact** | This document |

### SPRINT-56B-ARCHITECTURE-APPROVAL-TRACKER.md

| Decision ID | D2 — OQ-17 Knowledge summary policy |
| Decision | Transport-or-omit; authoring rejected |
| Status | Pending CP-4 (SQ-1, SQ-2) |

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `DESIGN-PAGE-OQ-17-KNOWLEDGE-SUMMARY-POLICY-REVIEW.md` |
| OQ | OQ-17 |
| Consumers | W2-07 · CP-2 · implementation plan §1 |

**Planning and approval artefact only.**
