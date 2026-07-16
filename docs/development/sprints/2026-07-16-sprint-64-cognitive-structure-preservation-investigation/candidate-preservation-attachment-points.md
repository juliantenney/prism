# Preservation Attachment Point Investigation

**Sprint:** 64 — Task 1 (S64-BL-001)  
**Type:** Architecture investigation (descriptive mapping only)  
**Date:** 2026-07-16  
**Status:** Complete  

**Authority:** Sprint 63 synthesis + final validation. This document maps the **solution space**; it does **not** select or implement a preservation mechanism.

**Related:** [architecture-notes.md](architecture/architecture-notes.md) · [sprint-64-investigation-charter.md](sprint-64-investigation-charter.md) · [sprint-63-authoritative-findings.md](../2026-07-16-sprint-63-cognitive-flow-and-reasoning-visibility/sprint-63-authoritative-findings.md)

---

## Objective

Identify and evaluate candidate locations where learner-relevant cognitive structure (`required_links`, `stages`, `key_relationships`, `governing_constraint`, and related plan fields) could remain available beyond the Sprint 63 flattening boundary:

```text
GAM → assembled materials[]
```

Question:

> Where could cognitive structure survive if preservation were desired?

---

## Current Pipeline

```text
Instructional intent
→ DLA
→ required_materials[]
→ instructional_archetype + archetype_plan
→ GAM (routing block consumes plan)
→ realised content (materials[].body)
→ assembly
→ preserve (page-gam-materials-preserve)
→ normalize (page-render-normalize)
→ renderer
→ learner
```

| Stage | Structure Present | Structure Type | Consumer | Preserved? |
| ----- | ----------------- | -------------- | -------- | ---------- |
| Instructional intent / Episode Plan | Episode archetype + beats (Bloom shell) | Episode structure | Page compose / framing | Partially (often shortened beats) |
| DLA | `required_materials[].instructional_archetype` + `archetype_plan` | Structured Priority-1 plan | Validation; later GAM routing | **Yes** (SoT) |
| DLA framing | `learner_task`, `expected_output`, preamble, purpose/specification | Task/output prose | Renderer (when present) | Yes — but **not** high-value plan fields |
| GAM prompt | Plan JSON + RULES in routing block | Ephemeral prompt text | LLM generation | Transient only |
| GAM realised content | Meaning may appear in `materials[].body` | Natural-language prose | Preserve / renderer | Lossy; **not** structured fields |
| GAM / assembly page object | `materials[]` hydrated; `required_materials[]` **may** remain on full-page path | Bodies ± orphaned plans | Preserve / normalize / renderer | Bodies yes; structured plan on materials **No** |
| Preserve | Merges GAM bodies into page materials | Body fidelity merge | Downstream render | Bodies preserved; **no** plan field handling |
| Normalize | Array→map materials for render view | Presentation shape | Renderer | No plan fields added/read |
| Renderer | Material types, beats, framing fields | UI | Learner | No instructional-plan branch |
| Learner | Journey labels + material chrome + bodies | Experience | — | Structured plan absent |

### High-value fields across stages (when authored)

| Field | Present at DLA? | Present in GAM prompt? | Present as structured field on `materials[]`? | Recoverable at renderer from Tier 2 signals? |
| ----- | --------------- | ---------------------- | --------------------------------------------- | -------------------------------------------- |
| `required_links` | Yes | Yes | **No** (Sprint 63 Exp 2) | **No** |
| `stages` | Yes | Yes | **No** (Exp 3) | **No** (esp. middle stages) |
| `key_relationships` | Yes | Yes | **No** (Exp 3) | **No** |
| `governing_constraint` | Yes | Yes | **No** (Exp 3) | **No** |

**Evidence:** `lib/ld-dla-page-enrich-contract.js`; `lib/ld-instructional-archetype.js` (`validatePageArchetypePlans`, `buildArchetypeRoutingBlock`, `planPayloadForPrompt`); `app.js` `buildGamV2CopyMaterialAuthoringBrief` / upstream DLA embed; `lib/page-gam-materials-preserve.js`; `lib/page-render-normalize.js`; `lib/ld-instructional-manifestation-render.js` (no plan consumers); Sprint 63 Experiments 2–3.

---

## High-Value Cognitive Structures

From Sprint 63 (authoritative):

| Archetype | High-value non-recoverable structure |
| --------- | ------------------------------------ |
| `mechanism_explanation` | `required_links` |
| `process_walkthrough` | `stages` (esp. intermediate) |
| `mental_model_building` | `key_relationships`, `governing_constraint` |

Shared class: **named intermediate reasoning structure**. Endpoint/overlap fields (`start`/`outcome`/`process_goal`/contrast labels) can partially appear in task wording and are lower novelty for preservation urgency.

---

## Attachment Point Inventory

Only locations that **already exist** in the current pipeline:

| ID | Attachment Point | What exists today |
| -- | ---------------- | ----------------- |
| **A** | DLA output / page `required_materials[]` | Authoritative SoT for `instructional_archetype` + `archetype_plan` (`page-shell-create.js`; DLA contract) |
| **B** | GAM routing / final prompt | Ephemeral `LD-INSTRUCTIONAL-ARCHETYPE-ROUTING` block; observability via `__PRISM_FINAL_GAM_PROMPT` |
| **C** | GAM output `materials[]` | Hydrated bodies (`material_id`, `material_type`, `body`, optional `purpose`); partial-page contract emits **materials only** |
| **D** | Retained `required_materials[]` on post-GAM page | Full-page GAM path instructs: copy `required_materials` character-for-character; partial path does **not** emit them |
| **E** | Assembled activity metadata | `learner_task`, `expected_output`, preamble, cognition fields, `episode_plan` — no plan keys |
| **F** | Assembled material metadata | Ids, types, titles, bodies — **no** production consumers of plan keys on materials |
| **G** | Preserve / normalize layer | Transform stage that merges/normalises materials; **no** plan field logic |
| **H** | Renderer input (normalized page view) | Beat-first materials + framing; no instructional-plan branch |

Experimental-only (Sprint 63 diagnostic, **not** production pipeline): `debug_instructional_contract` / `experimental_metadata` on experiment pages — listed for completeness as a proven *visibility* pattern, not a production attachment point.

---

## Information Survival Analysis

| Attachment Point | Full Plan Available | High-Value Fields Available | Already Exists | Requires New Schema | Notes |
| ---------------- | ------------------- | --------------------------- | -------------- | ------------------- | ----- |
| **A** DLA `required_materials` | Yes (when authored) | Yes | **Yes** | **No** | Earliest intact structured form; Sprint 60 SoT |
| **B** GAM prompt | Yes (serialised) | Yes | **Yes** (ephemeral) | No | Consumed for generation; not a durable page artefact |
| **C** GAM `materials[]` bodies | No (as structure) | Only if inferred from prose | **Yes** (bodies) | No | Structure flattened into prose; anti-rubric rules discourage plan-shaped headings |
| **D** Retained `required_materials` post-GAM | Yes **if** full-page path kept them | Yes if retained | **Sometimes** | No | Orphaned relative to renderer; absent on RNA assembled fixture; partial GAM omits |
| **E** Activity metadata | No | No (only partial endpoint overlap in task text) | Yes | No | Cannot recover links/stages/relationships safely |
| **F** Material metadata (current) | No | No | Yes (other fields) | No* | *Copying **existing** plan keys onto materials would reuse known fields — not a new schema vocabulary; still a behaviour/contract change if done |
| **G** Preserve / normalize | Only if inputs still carry plans | Same | Yes (layer) | No* | Natural place to *copy* A→F without inventing fields; currently does not |
| **H** Renderer input | Only if upstream still carries | Same | Yes | No | Currently cannot surface what never arrived |

### Survival summary

* **Survives naturally as structure:** A (DLA); B (prompt, transient); D (conditional orphan).  
* **Already consumed:** B → generation.  
* **Already flattened (materials channel):** C — structured high-value fields not on `materials[]`.  
* **Impossible to recover at E/H from Tier 2 alone:** `required_links`, intermediate `stages`, `key_relationships`, `governing_constraint` (Sprint 63).

---

## Preservation Granularity Analysis

| Scope | Information Retained | Complexity | Coupling | Risk |
| ----- | -------------------- | ---------- | -------- | ---- |
| **1. Full plan** (`instructional_archetype` + full `archetype_plan`) | All authored keys per Priority-1 shape | Medium (four shapes) | Medium–High (renderer/manifestation must know shapes) | Low semantic if verbatim; higher coupling/maintenance |
| **2. High-value subset** (e.g. links / stages / relationships+constraint) | Sprint 63 non-recoverable learner-value core | Lower than full | Medium | Low if verbatim; must not silently drop other authored fields if still needed for generation |
| **3. Minimal cognitive contract** (only learner-relevant ∩ non-recoverable ∩ manifestation-useful) | Appears to **exist as a category** (Sprint 63 demonstrated the intersection) | Lowest information surface | Lower if narrowly typed | Category plausible; **contract not defined here** |

**Assessment:** Full-plan preservation is **not proven necessary** for manifestation of the Sprint 63 gains. A smaller high-value / minimal contract category is **plausible**. Defining that contract is a later investigation — not this task.

---

## Trade-Off Analysis

| Attachment Point | Technical complexity | Semantic safety | Coupling | Maintainability | Evidence confidence |
| ---------------- | -------------------- | --------------- | -------- | --------------- | ------------------- |
| **A** DLA `required_materials` | Low (already SoT) | Low risk (authored) | Low at DLA | High | **High** |
| **B** GAM prompt | Low to observe; High as durable store | Low if verbatim | High (prompt lifecycle) | Low as persistence | **High** (ephemeral) |
| **C** Body prose only | N/A as structure | High risk if parsing/inventing | Medium | Low for structure | **High** (unsuitable) |
| **D** Retain `required_materials` | Low–Medium (path-dependent) | Low if untouched | Medium (dual arrays) | Medium (partial vs full GAM) | **Medium** (full-page yes; partial/RNA no) |
| **E** Activity metadata | Would require inventing fields → out of scope | — | — | — | N/A as plan store |
| **F** Material metadata carry of **existing** keys | Medium | Low if verbatim copy | Medium–High if renderer binds | Medium (four shapes) | **Medium–High** |
| **G** Preserve/normalize copy step | Medium | Low if verbatim | Medium | Medium | **High** that layer exists; **High** that it currently ignores plans |
| **H** Renderer-only inference | High (unsafe) | **High risk** | High | Low | **High** (Sprint 63 forbids) |

---

## Earliest and Latest Viable Points

### Earliest point where high-value structure exists

**DLA `required_materials[]` with validated `archetype_plan`** — when DLA emits a Priority-1 contract.

Evidence: `ld-dla-page-enrich-contract.js`; `validateMaterialArchetypePlan` / `PLAN_KEYS`; Sprint 60 mixed DLA fixture; Sprint 63 traces.

### Latest point where high-value structure remains intact

**Still as structured fields on `required_materials[]` whenever that array is retained on the page object after GAM** (full-page enrich path), **or** immediately prior in the **GAM routing block** (intact but ephemeral).

After hydration, **`materials[]` does not carry those structured fields** in production paths examined. Therefore the latest *durable page-object* intact form is **orphaned `required_materials`**, not learner materials.

Evidence: `buildUpstreamDlaPageEmbedSectionForGamCopy` (“Copy … required_materials … character-for-character”); `buildGamV2CopyMaterialAuthoringBrief` (partial: `activities[]` with `materials[]` only); RNA fixture lacks `required_materials`; preserve merges bodies, not plans.

### Point where irreversible flattening occurs

**GAM material hydration into `materials[]` for the materials channel** — structured plan is not emitted on material objects; meaning may enter prose only.

This is the Sprint 63 boundary, refined:

```text
Irreversible for materials[] structured availability:
  GAM realisation → materials[].body (prose) without plan keys

Conditional survival off the materials channel:
  required_materials[] may still hold the plan (unused by renderer)
```

Evidence: GAM authoring brief material fields list; RULES anti-label guidance; preserve/normalize/renderer lack of plan consumers; Experiments 2–3.

---

## Candidate Preservation Zones

### Viable

* **A — DLA `required_materials`** (already the SoT; structure exists here)  
* **D — Retained `required_materials` through assembly** (when full-page path keeps it; makes structure available *on the page* without new fields)  
* **G — Preserve/normalize as a copy/bridge locus** (existing layer that already reconciles GAM materials with the page; could bridge A/D → materials-side availability without new schema vocabulary)

### Potentially Viable

* **F — Assembled material metadata** carrying **existing** plan keys (or a documented subset) alongside body — same vocabulary as DLA; behaviour change, not new schema types  
* **H — Renderer input** *if and only if* structured fields already arrived from upstream (consumer, not source)

### Unlikely

* **B — GAM prompt** as the preservation store (ephemeral; observability only)  
* **E — Activity-level metadata** as the plan store (plans are material-level today; activity fields do not hold them)

### Not Viable

* **C — Prose-only recovery** from realised bodies as a substitute for structured preservation (Sprint 63: invention risk)  
* Renderer inference of high-value fields from Tier 2 signals alone

**No ranking. No winner selected.**

---

## Findings

1. High-value structure **already has a home**: DLA `required_materials[].archetype_plan`.  
2. The materials channel **flattens** that structure at GAM hydration; preserve/normalize/renderer do not restore it.  
3. A second channel — **retained `required_materials`** — may keep the plan intact but **orphaned** (path-dependent; absent on important assembled fixtures).  
4. Realistic preservation zones cluster around **keeping or bridging existing plan fields**, not inventing new layers.  
5. Full-plan vs high-value subset vs minimal contract are all **conceptually available**; Sprint 63 gains did not require every plan field.  
6. Nothing in this mapping **challenges** Sprint 63 conclusions; it **refines** the boundary into materials-channel flatten vs possible orphaned retention on `required_materials`.

---

## Open Questions

1. How often do production post-GAM pages retain populated `required_materials` with plans vs partial materials-only captures?  
2. If `required_materials` is retained, is “consume existing orphan” enough, or must fields also appear on `materials[]`?  
3. What is the smallest field subset that still supports safe manifestation across the three validated archetypes?  
4. Should any bridge live in preserve vs assemble vs an explicit diagnostic contract (mechanism choice — next investigation)?

---

## Recommendation For Next Investigation

**Next (S64-BL-002):** Compare **candidate preservation mechanisms** that operate only within the **Viable / Potentially Viable** zones above — e.g. rely on retained `required_materials`, bridge copy in preserve/normalize, or carry existing keys onto `materials[]` — documenting trade-offs only.

Do **not** yet define a manifestation contract or pick an implementation winner.

---

## Evidence index

| Claim | Source |
| ----- | ------ |
| Plan SoT on DLA required_materials | `lib/ld-dla-page-enrich-contract.js`; Sprint 60 decisions |
| GAM consumes via routing block | `lib/ld-instructional-archetype.js` `buildArchetypeRoutingBlock` |
| Partial GAM = materials only | `app.js` `buildGamV2CopyMaterialAuthoringBrief` |
| Full-page GAM retains required_materials textually | `app.js` `buildUpstreamDlaPageEmbedSectionForGamCopy` |
| Preserve merges bodies, not plans | `lib/page-gam-materials-preserve.js` |
| Normalize has no plan consumers | `lib/page-render-normalize.js` |
| Renderer has no plan branch | `lib/ld-instructional-manifestation-render.js`; inventory |
| Non-recoverable high-value fields | Sprint 63 Exp 2–3 / final validation |
