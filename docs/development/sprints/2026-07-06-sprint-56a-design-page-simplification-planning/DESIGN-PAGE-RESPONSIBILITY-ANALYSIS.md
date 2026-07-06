# Design Page — Responsibility Analysis

**Sprint:** 56A — Design Page Simplification Planning  
**Status:** Planning analysis — does not prescribe implementation  
**Primary source:** [DESIGN-PAGE-ARCHITECTURE-AUDIT.md](../2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/DESIGN-PAGE-ARCHITECTURE-AUDIT.md)

---

## Purpose

Identify what Design Page **currently does**, classify responsibilities by type, and analyse what **belongs on Design Page** vs elsewhere — without yet deciding implementation changes.

---

## Responsibility types

### 1. Transport responsibilities

**Definition:** Verbatim movement of upstream learner-facing payloads into page JSON fields.

| Responsibility | Upstream | Destination | Belongs on DP? |
| -------------- | -------- | ----------- | -------------- |
| GAM material bodies | `activity_materials` Content: | `activity.materials.*` | **Yes — core** |
| DLA activity scaffolds | `learning_activities` | Row fields (preamble, tasks, cognition) | **Yes — core** |
| Assessment items | `assessment_items` | `assessment_check.content.items[]` | **Yes** |
| Episode plans | `episode_plans` | `episode_plans[]` + per-row `episode_plan` | **Yes** (verbatim) |
| Sequence timing | `learning_sequence` | Order/timing metadata | **Yes** (organisational facet) |
| Math notation | All upstream | Preserved in copied strings | **Yes** (pass-through) |

**Simplification candidate:** None for core payloads — this **is** the primary job.

**Conflict risk:** Low when isolated; high when combined with authoring on same fields.

---

### 2. Organisational responsibilities

**Definition:** Structure, membership, ordering, and schema — without transforming payload bodies.

| Responsibility | Detail | Belongs on DP? |
| -------------- | ------ | -------------- |
| Page JSON schema | `artifact_type`, `sections[]`, keys | **Yes — essential** |
| Section ordering | overview → activities → assessment | **Yes** |
| Activity membership | All upstream `activity_id` in content | **Yes** |
| Activity ordering | From `learning_sequence` | **Yes** |
| `page_profile` selection | learner / facilitator / assessment | **Yes** |
| `source_artefacts` provenance | Audit trail | **Yes** |
| `generation_notes` | Gaps and omissions | **Yes** (with strict non-excuse rules) |

**Simplification candidate:** Canonical section set could narrow if wrapper sections demoted.

**Conflict risk:** Medium — `activities_omitted[]` and size limits can conflict with membership.

---

### 3. Authoring responsibilities

**Definition:** Generating new or derived learner-facing prose not present verbatim upstream.

| Responsibility | Module / source | Belongs on DP? |
| -------------- | --------------- | -------------- |
| Overview / inquiry arc | LD-JOURNEY-ASSIMILATION | **Disputed** — optional bridge |
| Learning purpose | Journey + authorial | **Disputed** |
| Knowledge summary | Journey (from KM/LC) | **Conflict** — re-authors upstream |
| Study tips / closure | Journey + authorial + rhetoric | **Disputed** |
| Wrapper transitions | Journey, scaffold, authorial | **Disputed** |
| Section headings (non-schema) | Pack template | **Yes** (light) |

**Simplification candidate:** **High** — merge triple wrapper stack into one thin module or remove for v1 transport-only.

**Conflict risk:** **High** — primary driver of summarisation and material elision (see failure modes A, G).

---

### 4. Presentation responsibilities

**Definition:** Metadata and instructions for how content should be rendered or augmented visually.

| Responsibility | Module / source | Belongs on DP? |
| -------------- | --------------- | -------------- |
| Visual affordances schema 38.4 | Sprint 38 block | **Disputed** |
| `visual_decision` generate/defer/reject | Sprint 38 | **Likely elsewhere** |
| `activities_visual_review` | Sprint 38 | **Likely elsewhere** |
| `pedagogical_added_value` reasoning | Sprint 38 | **Likely elsewhere** |
| `source_basis` path citations | Sprint 38 examples | **Conflict** with embedded materials |
| Meaningful headings | Pack | **Yes** (light) |

**Simplification candidate:** **High** — move to separate step or renderer inference.

**Conflict risk:** **High** — specification-writing competes with GAM paste for tokens and attention.

---

### 5. Workflow responsibilities

**Definition:** Brief constraints, profile params, elicitation, and cross-step policy — not page content per se.

| Responsibility | Source | Belongs on DP? |
| -------------- | ------ | -------------- |
| Component quantity / exclusion constraints | Workflow brief | **Yes** (enforce) |
| `tone_style`, `depth_level`, `output_density` | Step params | **Conflict** — brevity |
| Assessment visibility flags | `include_answers`, etc. | **Yes** |
| Intent-class refinement | `design_page` intent | **Elsewhere** (brief design) |
| EQF principles block | Shared L5 | **Elsewhere** (upstream steps) |
| Context access / Copilot history | Compose CONTEXT_ACCESS | **Yes** (consumption policy) |
| Read-only compose policy | Compose contract | **Yes** |

**Simplification candidate:** Medium — remove brevity params from Design Page; keep constraint enforcement.

**Conflict risk:** Medium — `output_density` directly opposes material preservation.

---

## Cross-type analysis

### What clearly belongs on Design Page

| Layer | Responsibilities |
| ----- | ---------------- |
| **Hard transport** | GAM materials, DLA rows, assessment, episode plans |
| **Organise** | Schema, membership, order, profile, provenance |
| **Consume** | Conversation history access, per-binding routing |

### What may belong elsewhere

| Responsibility | Proposed owner |
| -------------- | -------------- |
| Material body authoring | GAM (already) |
| Scaffold authoring | DLA (already) |
| Knowledge modelling / summary authoring | LC / KM steps |
| Visual affordance specification | Separate step or renderer |
| Pedagogic quality principles (EQF) | DLA, GAM, LC |
| Brief refinement / density | Workflow brief, not compose |

### Simplification candidates (priority order)

| Priority | Candidate | Rationale |
| -------- | --------- | --------- |
| 1 | Visual affordance authoring on DP | Largest non-transport load; `source_basis` substitution risk |
| 2 | Knowledge summary authoring | Explicit second summarisation layer |
| 3 | Triple wrapper stack merge/remove | Duplicated journey + authorial + rhetoric |
| 4 | Brevity step params on DP | Direct conflict with preservation |
| 5 | EQF on DP emit path | Abstract pressure unrelated to transport |
| 6 | DLA generation scaffold on compose | Partially fixed (compose-only slice); verify sufficient |

### What must not be simplified away

| Responsibility | Reason |
| -------------- | ------ |
| Full GAM Content embedding | Core learner deliverable |
| Multi-material enumeration | Per-activity payload completeness |
| Activity membership | Journey integrity |
| DLA field preservation | Task framing is learner-facing |
| Self-contained page invariant | No dereference |
| Context access from chat history | Copilot workflow viability |

---

## Alignment with pipeline model

Sprint 57 architecture state defines:

```
DLA specifies  →  GAM realises  →  Design Page assembles
```

**Still valid at stage level.** Sprint 56A challenge is **internal to Design Page**:

- "Assembles" has been interpreted as **assemble + author + specify + optimise**
- Target interpretation: **assemble = transport + organise** (+ optional thin bridge)

Stage ownership map does not need reversal — it needs **narrowing Design Page's internal scope**.

---

## Relationship to failure modes

| Failure mode | Primary responsibility type |
| ------------ | --------------------------- |
| A Summarisation | Authoring + workflow (brevity) |
| B Metadata substitution | Transport (failed) + authoring |
| C Multi-material omission | Organisational + optimiser |
| D Truncation | Transport (failed) + optimiser |
| E Placeholder substitution | Organisational (wrong deliverable model) |
| F Context denial | Workflow (consumption) |
| G Material elision | Authoring + presentation (VA paths) |

---

## Next step

Populate responsibility matrix in [SPRINT-56A-IMPLEMENTATION-PLAN.md](SPRINT-56A-IMPLEMENTATION-PLAN.md) §1 after open questions OQ-01–OQ-24 are triaged.

**This document does not prescribe implementation changes.**
