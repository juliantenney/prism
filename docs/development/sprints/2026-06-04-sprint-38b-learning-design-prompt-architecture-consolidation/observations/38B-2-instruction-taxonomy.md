# Slice 38B-2 — Instruction taxonomy

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Inputs:** [38B-1](38B-1-prompt-audit.md), [38B-4](38B-4-materials-and-table-fidelity.md), [probe-38B-2-instruction-taxonomy-seed.md](../fixtures/probe-38B-2-instruction-taxonomy-seed.md)

---

## Success criterion

Recurring LD prompt instruction clusters are classified with source, target layer, duplication, conflict risk, precedence, and consolidation guidance.

---

## Target hierarchy (reference)

```text
L0  Core task
L1  Hard output schema
L2  Source / content fidelity
L3  Activity composition (membership, sequence order)
L4  Structured materials + table fidelity
L5  Pedagogical preservation (fields + materials realisation cues)
L6  Visual affordance metadata (page root only)
L7  Rendering compatibility (math, markdown shape, voice)
L8  Validation / QA checklist
```

---

## Global precedence ladder (mandatory)

Higher layers override lower layers when instructions appear to conflict.

```text
L2 source fidelity
  > L3 activity membership
  > L4 materials fidelity + table fidelity
  > L5 pedagogical enrichment / rhetoric
  > L6 visual affordance metadata
  > L7 style/rhetoric compression
  > overview/synthesis prose (scoped to overview/learning_purpose only)
```

### Required precedence decisions (normative)

| Rule | Norm |
|------|------|
| **Table fidelity** | Overrides brevity, summarisation, and “shorten non-essential prose” for table-shaped content. Pipe tables or structured rows must survive. |
| **Materials fidelity** | Overrides overview/synthesis prose; `activity.materials` must not be thinned for session narrative. |
| **Visual affordances** | Additive page-root metadata only; must **not** replace or summarise `activity.materials`. |
| **Figure duplicate/avoid** | Applies to **generated figures** (`representation_avoid`, `must_not_duplicate`) — **not** to page tables or worksheets. |
| **Math/rendering** | TeX rules must **not** break markdown pipe-table syntax (no code-fencing tables; tables stay in named fields). |
| **Source + membership** | Sit above pedagogical enrichment; omitting activities or inventing content is never justified by rhetoric blocks. |

---

## Duplication score scale

| Score | Meaning |
|-------|---------|
| **0** | Single authoritative statement planned |
| **1** | Light echo (pack + one runtime) |
| **2** | Substantial duplicate (pack notes + template + runtime block) |
| **3** | Heavy redundant (3+ sources or repeated across 4+ steps) |

---

## Cluster registry

### 1. Self-directed 9-block rhetoric stack

| Field | Value |
|-------|--------|
| **Source step(s)** | DLA, GAM, Generate Assessment Items, Design Page (self-directed brief) |
| **Source block / pack** | `app.js`: `buildSelfDirectedLearnerActionRhetoricPromptBlock`, `WorkedExampleFading`, `EmbeddedFeedbackMisconception`, `ConceptProcedureIntegration`, `MetacognitiveJudgement`, `SessionOrientationRhetoric`, `ConceptualTensionDifficulty`, `IntellectualProgression`, `EpistemicSynthesisClosure`, `TransferDurableUnderstanding` via `applySelfDirectedLearnerPageStepScaffoldsToDraft` |
| **Taxonomy category** | style/rhetoric; orientation/progression; closure/transfer; worked example; misconception; concept/procedure (split per block) |
| **Target layer** | **L5** (pedagogical preservation) + **L7** (voice guardrails); session-level blocks scoped to overview/activity fields only |
| **Duplication score** | **3** — same 9 blocks × 4 steps ≈ 36 append instances |
| **Conflict risk** | **HIGH** — “synthesise session”, “closure”, “progression” vs L4 verbatim materials |
| **Precedence** | Subordinate to **L4** materials/table and **L2** source fidelity; rhetoric must not authorise summarising `materials` |
| **Consolidation** | Merge into one `LD-SELF-DIRECTED-RHETORIC` module (~1.5k chars) referenced by step; step-specific riders only for DLA shape vs GAM output vs Design Page copy |

---

### 2. PEL orientation / reasoning guidance

| Field | Value |
|-------|--------|
| **Source step(s)** | DLA, Design Page (orientation); GAM (reasoning + reasoning materials when enrichment IDs active) |
| **Source block / pack** | `app.js`: `buildPelOrientationContractPromptBlock`, `buildPelReasoningContractPromptBlock`, `buildSelfDirectedGamPelReasoningMaterialPromptBlock`; `applyPedagogicEnrichmentContractScaffoldToDraft`; DLA/Design Page pack notes (activity_preamble, reasoning fields) |
| **Taxonomy category** | pedagogical enrichment; orientation/progression |
| **Target layer** | **L5** (field preservation on Design Page); **L5** + GAM realisation for reasoning in materials |
| **Duplication score** | **2** — pack notes + runtime PEL blocks + rhetoric overlap on orientation |
| **Conflict risk** | **MEDIUM** — orientation prose duplicated in overview, study_orientation, session rhetoric block |
| **Precedence** | Below **L4** materials; orientation fields preserved verbatim on activities; overview may synthesise **journey** but not replace materials |
| **Consolidation** | Single `LD-PEL-ORIENTATION` (DLA + Design Page) and `LD-PEL-REASONING-MATERIALS` (GAM only); drop duplicate session-orientation rhetoric sentences |

---

### 3. Pedagogic cognition contract scaffold

| Field | Value |
|-------|--------|
| **Source step(s)** | DLA, GAM (when `contract.active` from brief resolution) |
| **Source block / pack** | `app.js`: `applyPedagogicCognitionContractScaffoldToDraft`, `buildPedagogicCognitionContractPromptBlock`; pack cognition field lists in DLA `defaultPromptNotes` |
| **Taxonomy category** | pedagogical enrichment; schema contract (required fields) |
| **Target layer** | **L5** |
| **Duplication score** | **2** — overlaps PEL + DLA pack cognition bullets + field preservation on Design Page |
| **Conflict risk** | **MEDIUM** — extra required fields vs “do not generate full materials” on DLA |
| **Precedence** | Below **L4** for material bodies; cognition **fields** on activities are L5 verbatim preserve on Design Page |
| **Consolidation** | Keep one cognition checklist in DLA pack; runtime block only if brief activates contract; remove repeated field lists from rhetoric stack |

---

### 4. Materials verbatim / no-summarise rules

| Field | Value |
|-------|--------|
| **Source step(s)** | Design Page (primary); echo in GAM (“no describe/outline”); DLA (specs only) |
| **Source block / pack** | Design Page §13 `promptTemplate`, `defaultPromptNotes` (MATERIALS FIDELITY); `buildDesignPageActivityMaterialsFidelityPromptBlock`; `buildSelfDirectedLearnerPageDesignPageFieldPreservationBlock`; GAM hard-rule “generate full usable content” |
| **Taxonomy category** | content preservation; materials fidelity |
| **Target layer** | **L4** (materials bodies); **L5** (activity field verbatim on Design Page) |
| **Duplication score** | **3** — pack template + pack notes + 2 runtime blocks + GAM echo |
| **Conflict risk** | **HIGH** vs cluster 12 (overview/synthesis) and “summarise when long” |
| **Precedence** | **Overrides** overview/synthesis and brevity for `materials` and learner-facing material fields |
| **Consolidation** | One `LD-MATERIALS-COPY` paragraph in L4; remove duplicate bullets from pack notes and field-preservation block |

---

### 5. Table fidelity / pipe table / row adequacy rules

| Field | Value |
|-------|--------|
| **Source step(s)** | **GAM** (author); DLA (specs); **Design Page** (preserve); not Assessment/MK/Outcomes |
| **Source block / pack** | GAM §6 `promptTemplate` (“complete pipe table… header, divider, rows”); `buildSelfDirectedGamTableRowAdequacyPromptBlock`; DLA pack/template (`pipe tables`, `template`/`analysis_table` types); Design Page pack (named fields, no bullets for tables); materials fidelity (“actual tables”); **gap:** no comma-row / Headers-Rows ban on Design Page |
| **Taxonomy category** | table fidelity |
| **Target layer** | **L4** — GAM emits; Design Page copies; DLA references in `required_materials` |
| **Duplication score** | **2** across GAM+Design Page; **1** on DLA (spec vocabulary only) |
| **Conflict risk** | **HIGH** — Sprint 38 “duplicate table” (cluster 7); summarisation clause; model CSV fallback ([38B-4](38B-4-materials-and-table-fidelity.md)) |
| **Precedence** | **Overrides** brevity/summarisation; **overrides** figure-level duplicate language for page `materials` |
| **Consolidation** | Single `LD-TABLE-FIDELITY` module: pipe example + forbidden comma-row/Headers-Rows; GAM keeps row-adequacy counts; Design Page adds anti-CSV; DLA spec line points to pipe tables in GAM output |

---

### 6. Sprint 38 visual affordance metadata

| Field | Value |
|-------|--------|
| **Source step(s)** | Design Page only |
| **Source block / pack** | Design Page §13 pack (VISUAL AFFORDANCES inline); `buildSprint38VisualAffordanceDesignPagePromptBlock` (~7k + JSON examples) |
| **Taxonomy category** | visual affordance metadata; schema contract |
| **Target layer** | **L6** |
| **Duplication score** | **3** — pack template + pack notes + full runtime block |
| **Conflict risk** | **MEDIUM** — length competes with L4 copy; additive rule sometimes misread as “simplify page” |
| **Precedence** | Subordinate to **L4**; must not reduce `materials`; page-root only |
| **Consolidation** | Pack: schema keys + defer/reject rules only; runtime: one compact L6 section + **one** truncated generate example; move full JSON to fixture reference |

---

### 7. Sprint 38 pedagogical added-value guidance

| Field | Value |
|-------|--------|
| **Source step(s)** | Design Page only |
| **Source block / pack** | `buildSprint38PedagogicalAddedValuePromptLines` (concatenated into Sprint 38 block); `lib/sprint38-representation-pedagogical-value.js` token catalog in prompt |
| **Taxonomy category** | visual affordance metadata; pedagogical enrichment (figures only) |
| **Target layer** | **L6** (figure authoring) |
| **Duplication score** | **2** — overlaps cluster 6 block; repeats “duplicate worksheet/table” |
| **Conflict risk** | **HIGH** for table fidelity if unscoped — **must** say figures only |
| **Precedence** | Below **L4** table fidelity; **figure duplicate/avoid only** |
| **Consolidation** | Merge into L6 as 3 bullets + per-token table appendix (or link to doc); explicit scope: “generated figures only” |

---

### 8. Math-safe output / TeX rendering compatibility

| Field | Value |
|-------|--------|
| **Source step(s)** | DLA, GAM, Generate Assessment Items, Design Page |
| **Source block / pack** | Pack templates per step; `buildMathSafeOutputContractPromptBlock`; `applyMathSafeOutputContractToDraft` |
| **Taxonomy category** | accessibility / maths / rendering compatibility |
| **Target layer** | **L7** |
| **Duplication score** | **3** — pack + runtime × 4 steps |
| **Conflict risk** | **LOW** if tables stay in named fields; **MEDIUM** if math rules encourage code fences that swallow tables |
| **Precedence** | Applies to equations in prose fields; **must not** alter pipe-table lines in `materials.*` |
| **Consolidation** | One global `LD-MATH-RENDER` referenced by all steps; single sentence preserving pipe tables |

---

### 9. Assessment preservation / item fidelity

| Field | Value |
|-------|--------|
| **Source step(s)** | Generate Assessment Items; Design Page (`assessment_check`) |
| **Source block / pack** | Assessment §9 pack (items, stems, options, answer_key); Design Page §13 (all items, `assessment_check.content.items`, feedback_display) |
| **Taxonomy category** | schema contract; content preservation |
| **Target layer** | **L1** (items schema); **L3** (include all items when upstream present) |
| **Duplication score** | **1** — mostly Design Page consumer |
| **Conflict risk** | **LOW** |
| **Precedence** | Below **L4** materials; above optional summarisation of assessment section |
| **Consolidation** | Design Page L3 bullet list; Assessment pack owns generation rules only |

---

### 10. Activity membership / sequence preservation

| Field | Value |
|-------|--------|
| **Source step(s)** | Design Page (membership); Construct Learning Sequence (timeline subset); DLA (activity set design) |
| **Source block / pack** | Design Page pack ACTIVITY MEMBERSHIP, `(U \ X) ⊆ C`; Sequence §10 (no invent activities, material_id refs); `learning_sequence` order-only on Design Page |
| **Taxonomy category** | activity membership; source fidelity |
| **Target layer** | **L3** |
| **Duplication score** | **2** — membership in pack notes + template + validation |
| **Conflict risk** | **MEDIUM** — sequence step may omit activities while Design Page requires full set |
| **Precedence** | **Above** L5–L6; sequence informs order/timing only on Design Page |
| **Consolidation** | L3 single rule block on Design Page; Sequence pack trimmed to facilitator vs self-directed rider |

---

### 11. Learner voice / no facilitator headings

| Field | Value |
|-------|--------|
| **Source step(s)** | GAM (`buildSelfDirectedGamLearnerVoicePromptBlock`); rhetoric stack (all self-directed steps); Design Page pack; PEL orientation |
| **Source block / pack** | GAM material voice; `buildPelOrientationContractPromptBlock`; learner-action rhetoric; GAM output template still includes `Facilitator use:` section |
| **Taxonomy category** | style/rhetoric |
| **Target layer** | **L7** |
| **Duplication score** | **3** — GAM voice + PEL + rhetoric × 4 steps |
| **Conflict risk** | **MEDIUM** — GAM structured output requires “Facilitator use:” lines vs voice block |
| **Precedence** | Voice rules apply to learner-visible strings; facilitator lines stripped at compose/render (existing) not prompt contradiction |
| **Consolidation** | One L7 voice module; GAM template optional facilitator section only when `delivery_context` facilitated |

---

### 12. Overview / synthesis prose

| Field | Value |
|-------|--------|
| **Source step(s)** | Design Page (overview, learning_purpose, study_tips); DLA pack (session arc, study_tips bullets); rhetoric blocks (session orientation, epistemic synthesis) |
| **Source block / pack** | Design Page §13 pack + `page_profile` learner option; `buildSelfDirectedSessionOrientationRhetoricPromptBlock`, `EpistemicSynthesisClosure`, `TransferDurableUnderstanding`; DLA `defaultPromptNotes` |
| **Taxonomy category** | orientation / progression; closure / transfer |
| **Target layer** | **L5** scoped to **overview / learning_purpose / study_tips / activity orientation fields** — **not** `materials` |
| **Duplication score** | **3** — pack + 3+ runtime blocks + page_profile wording |
| **Conflict risk** | **HIGH** — “substantive summary” vs cluster 4 verbatim materials |
| **Precedence** | **Subordinate to L4 materials fidelity**; synthesis allowed only in named overview sections |
| **Consolidation** | Split contract: `SESSION OVERVIEW (L5-top)` vs `MATERIALS (L4)`; remove word “summary” near materials rules |

---

## Cross-cluster overlap matrix

| Cluster A | Cluster B | Duplication | Conflict | Winner |
|-----------|-----------|-------------|----------|--------|
| 4 Materials verbatim | 12 Overview/synthesis | 2 | HIGH | **4** for `materials` |
| 5 Table fidelity | 7 Added-value duplicate table | 1 | HIGH | **5** for page tables; **7** scoped to figures |
| 5 Table fidelity | 4 Summarise when long | 2 | HIGH | **5** |
| 6 Sprint 38 affordances | 4 Materials | 2 | MEDIUM | **4** for materials; **6** root-only |
| 1 Rhetoric stack | 4 Materials | 3 | HIGH | **4** |
| 1 Rhetoric stack | 12 Overview | 3 | MEDIUM | **12** only in overview sections |
| 8 Math | 5 Table pipes | 1 | LOW | **Both** — explicit coexistence sentence |
| 3 Cognition | 2 PEL | 2 | MEDIUM | Merge under L5 |
| 10 Membership | Construct Sequence | 1 | MEDIUM | **10** on Design Page |

---

## Module → layer mapping (consolidation units)

| Module ID | Clusters | Layers |
|-----------|----------|--------|
| `LD-SOURCE-MEMBERSHIP` | 10 | L2–L3 |
| `LD-MATERIALS-COPY` | 4 | L4 |
| `LD-TABLE-FIDELITY` | 5 | L4 |
| `LD-PEL-PRESERVE` | 2, 3 | L5 |
| `LD-SELF-DIRECTED-RHETORIC` | 1, 11 (partial), 7 (partial) | L5–L7 |
| `LD-SPRINT38-AFFORDANCE` | 6, 7 | L6 |
| `LD-MATH-RENDER` | 8 | L7 |
| `LD-ASSESSMENT-PRESERVE` | 9 | L1, L3 |

---

## Outputs

- [x] Twelve cluster registry rows  
- [x] Global precedence ladder + required decisions  
- [x] Cross-cluster matrix  
- [x] Module IDs for 38B-3 / 38B-5 / 38B-7  
- [x] Handoff: Design Page block → layer map in [38B-3](38B-3-design-page-consolidation-plan.md)
