# Wave 3 — Design Page authority review

**Date:** 2026-06-04  
**Phase:** Planning **COMPLETE** · Implementation **COMPLETE** (W3-1–4) · [W3-4 gate](38B-W3-4-inflation-gate-evidence.md)  
**Charter:** [38B-3](38B-3-design-page-consolidation-plan.md) (revised § post-Wave 1/2)  
**Inputs:** [38B-1](38B-1-prompt-audit.md) · [38B-2](38B-2-instruction-taxonomy.md) · [38B-5](38B-5-workflow-wide-review.md) · [38B-W1-5](38B-W1-5-wave-1-exit-gate.md) · [38B-W2A](38B-W2A-GAM-authority-review.md) · [38B-W2B](38B-W2B-DLA-authority-review.md) · [B4-CLOSURE-REVIEW](B4-CLOSURE-REVIEW.md) · [38B-6](38B-6-regression-validation-plan.md) · [38B-7](38B-7-governance-and-maintenance.md)

---

## 1. Executive summary

| Question | Answer |
|----------|--------|
| **What does Design Page genuinely own?** | **Read-only page composition** — merge upstream into `page` JSON: **L0–L3** structure/membership, **L4 preserve** merge of `activity_materials` → `activity.materials`, **L5** verbatim activity-field + overview framing from upstream, **L6** page-root Sprint 38 affordances, **L7** render-safe markdown/math, **L8** validation checklist. |
| **What it must not own?** | Table **authoring** (GAM), material **specs** (DLA), assessment **generation**, pedagogy **redesign**, figure rules that thin `materials`. |
| **Largest remaining debt?** | Pack §13 **`promptTemplate`** (~9.8k) **duplicates** runtime **materials fidelity** + **Sprint 38** blocks; **`defaultPromptNotes`** (~8.5k) duplicates template for **runner** (not in probe seed) but risks drift; Sprint 38 runtime carries **three full JSON examples**. |
| **Wave 3 character?** | **Primarily consolidation** (authority + dedupe + ≤3 append units), with **moderate simplification** (pack template trim, example collapse) — **not** a second Wave 1–scale rhetoric collapse (already done). |
| **Realistic reduction from 27,345?** | **~4,000–7,000** chars augmented → target band **~20,000–23,000**; original **≤22,000** remains **achievable** with pack trim + Sprint 38 slim + compose contract merge. |
| **38B-3 plan still valid?** | **Yes** — Strategy B (thin pack + `LD-DESIGN-PAGE-COMPOSE-CONTRACT` + riders) **strengthened** by Wave 2 chain; metrics and block inventory **updated** below. |

---

## 2. Programme context (post Wave 1 + Wave 2)

| Milestone | Four-step augmented sum | Design Page |
|-----------|------------------------:|------------:|
| 38B-1 baseline | **152,782** | **45,791** |
| Wave 1 exit | **72,878** | **27,345** (−40.3%) |
| Wave 2 exit (probe) | **74,534** | **27,345** (unchanged) |
| Wave 3 exit (post W3-4) | **71,960** (four-step) | **24,771** (−9.4% vs 27,345) |

Wave 2 shifted **authority** upstream (GAM author, DLA spec); Design Page probe size **did not grow** during Wave 2 — correct, because Wave 2 was pack/runtime on DLA/GAM only.

**B4:** **MONITORING** — [38B-W3-4](38B-W3-4-inflation-gate-evidence.md) Inflation gate **PASS** on EV + golden; formal **CLOSE** still per [B4-CLOSURE-REVIEW](B4-CLOSURE-REVIEW.md) (live Factory post-W3, `section_id`, L4 AUTO*).

---

## 3. Prompt source inventory

### 3.1 Pack §13 (`domain-learning-design-step-patterns.md`)

| Asset | Chars (probe) | In LLM seed? | Role |
|-------|-------------:|:------------:|------|
| `promptTemplate` | **7,915** (was 9,818) | **Yes** (seeded **7,745**) | L0–L1 compose + L3 membership + **authority refs** to L4/L6/L7 modules — [PR-W3-1](38B-W3-1-design-page-pack-dedupe.md) |
| `defaultPromptNotes` | **1,461** (was 8,476) | **No** (runner / `what_to_check` only) | Trimmed for drift; defers detail to runtime — **no** probe delta |
| `userOptions` (`page_profile`, include_answers, …) | — | Partial (options in template) | L1/L5 profile gates |
| `runnerInstructions` | — | No | L8 human checklist |

**Note:** Probe `seededChars` ≈ template + resolved options only; **not** `defaultPromptNotes`.

### 3.2 Runtime augmentation chain (self-directed)

Order in `applyWorkflowStepRuntimePromptAugmentations`:

| # | Function | Design Page? | Marker / visibility |
|---|----------|:------------:|---------------------|
| 1 | `applyPedagogicCognitionContractScaffoldToDraft` | If `contract.active` | Pedagogic cognition contract |
| 2 | `applySelfDirectedLearnerPageStepScaffoldsToDraft` | Field preservation + rhetoric | See §3.3 |
| 3 | `applyLdTableFidelityContractToDraft` | **No append** (GAM/DLA only) | Preserve via materials fidelity embed |
| 4 | `applyLdMaterialsCopyContractToDraft` | **No** (GAM only) | Preserve via materials fidelity embed |
| 5 | `applyPedagogicEnrichmentContractScaffoldToDraft` | Orientation if enrichment IDs | PEL orientation |
| 6 | `applySprint38VisualAffordanceContractToDraft` | **Yes** | Sprint 38 visual + pedagogical added-value |
| 7 | `applyLdDesignPageComposeContractToDraft` | **Yes** | `LD-DESIGN-PAGE-COMPOSE-CONTRACT` (field preservation + L4 embed) — [38B-W3-2](38B-W3-2-design-page-compose-contract.md) |
| 8 | `applyMathSafeOutputContractToDraft` | **Yes** | `LD-MATH-RENDER` |

**Probe (2026-06-04 post PR-W3-4):** **24,771** augmented · **5** markers · [38B-W3-3](38B-W3-3-sprint38-prompt-slimming.md) · gate [38B-W3-4](38B-W3-4-inflation-gate-evidence.md).

```text
LD-SELF-DIRECTED-RHETORIC (auto-applied)
Sprint 38 visual affordance authoring contract (auto-applied)
Sprint 38 pedagogical added-value contract (auto-applied)
LD-DESIGN-PAGE-COMPOSE-CONTRACT (auto-applied)
LD-MATH-RENDER (auto-applied)
```

**Facilitated:** **22,560** augmented · **4** markers (no field preservation, no rhetoric).

### 3.3 Inside `applySelfDirectedLearnerPageStepScaffoldsToDraft` (Design Page)

| Block | Cluster | Layer | Est. chars |
|-------|---------|-------|----------:|
| `buildSelfDirectedLearnerPageDesignPageFieldPreservationBlock` | 2, 4 | L5 | ~700 |
| `applyLdSelfDirectedRhetoricContractToDraft` (`role: design_page`) | 1, 11, 12 | L5/L7 | ~3,604 |

### 3.4 Embedded in materials fidelity wrapper

| Module | Role on DP | Marker |
|--------|------------|--------|
| `LD-MATERIALS-COPY` | **preserve** | No (embedded) |
| `LD-TABLE-FIDELITY` | **preserve** | No (embedded) |

Combined embed ≈ **4,155** chars + ~250 wrapper lines.

### 3.5 Sprint 38 runtime

| Block | Layer | Est. chars |
|-------|-------|----------:|
| `buildSprint38VisualAffordanceDesignPagePromptBlock` | L6 | ~5,500–6,500 (incl. 3 JSON examples) |
| `buildSprint38PedagogicalAddedValuePromptLines` | L6/L7 scope | ~1,200–1,500 |

### 3.6 Conditional (not in probe block list)

| Block | When | Overlap |
|-------|------|---------|
| PEL orientation | Self-directed enrichment | Overview/activity fields — overlaps field preservation + rhetoric rider |
| Pedagogic cognition | Brief packs active | Field list — overlaps DLA output schema |

---

## 4. Authority chain (materials / tables) — post Wave 2

```text
DLA spec (LD-TABLE-FIDELITY dla)     → required_materials types
GAM author (LD-TABLE-FIDELITY author) → activity_materials pipe bodies
Design Page preserve (LD-TABLE-FIDELITY preserve, embedded)
  → learning_activities[].materials.<table_key> verbatim
Renderer → frozen
```

Design Page **must not** re-author tables; **must** reject comma-row / Headers+Rows when upstream already has pipes ([B4-CLOSURE-REVIEW](B4-CLOSURE-REVIEW.md) Wave 3 gate).

---

## 5. Design Page authority map

Legend: **Keep** · **Consolidate** · **Move** (authority elsewhere) · **Remove** (duplicate delete)

### 5.1 L0 — Core task (compose only)

| Instruction cluster | Source | Owner | Duplication | Action |
|----------------------|--------|-------|-------------|--------|
| Assemble `artifact_type = page` read-only | Pack template | **DP** | — | **Keep** |
| Do not redesign pedagogy | Pack template | **DP** | — | **Keep** |
| Hard constraints from brief | Pack template | **DP** | — | **Keep** |

### 5.2 L1 — Page JSON schema

| Instruction cluster | Source | Owner | Duplication | Action |
|----------------------|--------|-------|-------------|--------|
| `sections[]` with `section_id`, `heading`, `content` | Pack template + notes (runner) | **DP** | Notes echo | **Keep** template; **Remove** duplicate from notes |
| Page root: `visual_affordance_schema_version` 38.4, reviews, affordances | Pack template + Sprint 38 runtime | **DP** / **Sprint 38** | **Score 3** | **Consolidate** → L6 rider only in LLM prompt |
| `assessment_check.content.items` | Pack template | **DP** | — | **Keep** |
| `generation_notes`, `source_artefacts` | Pack template | **DP** | — | **Keep** |
| Activity object key list | Pack template + notes | **DP** | Partial | **Keep** one canonical list in compose contract |

### 5.3 L2 — Source fidelity

| Instruction cluster | Source | Owner | Duplication | Action |
|----------------------|--------|-------|-------------|--------|
| Ground in upstream only | Pack template | **DP** | — | **Keep** |
| No fabricated content | Pack template | **DP** | — | **Keep** |

### 5.4 L3 — Activity composition / membership

| Instruction cluster | Source | Owner | Duplication | Action |
|----------------------|--------|-------|-------------|--------|
| `(U \ X) ⊆ C` membership validation | Pack template | **DP** | — | **Keep** |
| `learning_sequence` order only | Pack template | **DP** | — | **Keep** |
| `activities_omitted[]` trace | Pack template | **DP** | — | **Keep** |
| Activity structure emit | — | **DLA** | N/A at DP | **Move** — consume only |

### 5.5 L4 — Materials merge / table preserve

| Instruction cluster | Source | Owner | Duplication | Action |
|----------------------|--------|-------|-------------|--------|
| Merge `activity_materials` per `activity_id` | Pack + materials fidelity | **DP** | **Score 3** | **Consolidate** → `LD-DESIGN-PAGE-COMPOSE-CONTRACT` + module embed |
| `materials{}` named fields, no blob | Pack template | **DP** | — | **Keep** |
| No placeholder-only labels | Pack + `LD-MATERIALS-COPY` | **DP** / module | **Score 2** | **Remove** pack bullets → **Ref** module |
| Pipe table preserve / no comma-row | Pack + `LD-TABLE-FIDELITY` | **DP** / module | **Score 2** | **Remove** pack MATERIALS FIDELITY section → module |
| `representation_avoid` figures not materials | Pack + Sprint 38 PAV | **DP** / L6 | **Score 2** | **Keep** one scoped sentence in compose |
| Table **authoring** / row adequacy | — | **GAM** | Must not appear | **Remove** if any pack echo |
| `required_materials` spec | — | **DLA** | N/A | **Move** |

### 5.6 L5 — Pedagogical field preservation

| Instruction cluster | Source | Owner | Duplication | Action |
|----------------------|--------|-------|-------------|--------|
| Verbatim cognition fields on activity rows | Field preservation block | **DP** | PEL/orientation overlap | **Keep**; **Consolidate** with PEL when both active |
| Overview / `learning_purpose` journey compose | Pack template + rhetoric rider | **DP** | **Score 2** | **Keep** DP-specific; **Ref** `LD-SELF-DIRECTED-RHETORIC` for rhetoric bans |
| `study_tips` / closure bullets | Pack + rhetoric | **DP** | **Score 2** | **Keep** compose duty; **Remove** pack prose duplicate |
| Worked/faded/misconception **in materials** | — | **GAM** | DP copies only | **Move** |

### 5.7 L6 — Visual affordances (page root)

| Instruction cluster | Source | Owner | Duplication | Action |
|----------------------|--------|-------|-------------|--------|
| generate/defer/reject schema | Pack template + Sprint 38 runtime | **Sprint 38** / **DP** | **Score 3** | **Consolidate** → `LD-SPRINT38-AFFORDANCE` slim + **one** example |
| `pedagogical_added_value` | Runtime PAV lines | **Sprint 38** | In visual block | **Keep** in L6 unit |
| Full JSON examples ×3 | Runtime | **Sprint 38** | MR-05 violation | **Remove** 2 examples → fixture link |

### 5.8 L7 — Rendering

| Instruction cluster | Source | Owner | Duplication | Action |
|----------------------|--------|-------|-------------|--------|
| TeX delimiters | Pack + `LD-MATH-RENDER` | Module | **Score 2** | **Ref** module in pack |
| Markdown tables not in bullet strings | Pack template | **DP** | Also in table module | **Keep** one line in compose |

### 5.9 L8 — Validation

| Instruction cluster | Source | Owner | Duplication | Action |
|----------------------|--------|-------|-------------|--------|
| Pre-return JSON checks | Pack template output section | **DP** | — | **Keep** in compose contract |
| `runnerInstructions.what_to_check` | Pack | QA human | Duplicates template | **Consolidate** notes to pointer to template |

---

## 6. Instructions owned elsewhere (do not re-expand on DP)

| Owner | What Design Page receives | DP must |
|-------|---------------------------|---------|
| **`LD-TABLE-FIDELITY` (GAM)** | Pipe tables in `activity_materials` | **Preserve** only |
| **`LD-TABLE-FIDELITY` (DLA)** | Typed `required_materials` | Trust upstream; do not invent types |
| **`LD-MATERIALS-COPY` (GAM)** | Full material bodies | Merge verbatim |
| **`LD-SELF-DIRECTED-RHETORIC`** | Rhetoric on **activity/page fields** | Compose overview; preserve fields; do not thin `materials` |
| **`LD-MATH-RENDER`** | Delimiter rules | Apply on composed JSON strings |
| **DLA** | `learner_task`, cognition fields, specs | Copy onto page activity rows |
| **GAM** | Material content | Merge into `materials.*` |
| **Assessment** | `assessment_items` | Copy into `assessment_check` |
| **Sprint 38 lib** | Token catalog | Reference in slim L6 block; figures only |

---

## 7. True Design Page responsibilities (normative)

| Responsibility | Layer | Non-goals |
|----------------|-------|-----------|
| **Page composition** | L0 | Redesign activities, change pedagogy |
| **Section structure** | L1 | Alternate wrapper shapes |
| **Activity placement / membership** | L3 | Drop activities silently |
| **Sequence order / timing** | L3 | Use sequence as membership filter |
| **Field preservation** (PEL/cognition on rows) | L5 | Summarise `activity_preamble` into materials |
| **Materials merge** | L4 | Regenerate simplified tables |
| **Affordance attachment** | L6 | Replace or shorten `materials` |
| **Overview / learning_purpose framing** | L5 (page sections) | Duplicate full materials in overview |
| **Assessment section assembly** | L1 | Invent items |
| **Render-safe shape** | L7 | Break pipe tables with TeX fences |
| **Final validation checklist** | L8 | — |

---

## 8. Footprint analysis

### 8.1 Current (probe 2026-06-04)

| Component | Chars | % of augmented |
|-----------|------:|---------------:|
| Pack seed (`promptTemplate` + options) | **9,648** | 35% |
| Runtime append | **17,697** | 65% |
| **Total augmented** | **27,345** | 100% |

**Runtime append breakdown (estimate):**

| Block | Est. chars |
|-------|----------:|
| Sprint 38 visual (+ 3 examples) | ~6,000 |
| Materials fidelity + L4 embeds | ~4,400 |
| `LD-SELF-DIRECTED-RHETORIC` | ~3,604 |
| `LD-MATH-RENDER` | ~1,220 |
| Field preservation | ~700 |
| Sprint 38 pedagogical added-value | ~1,400 |
| **Total** | ~17,324 |

### 8.2 Unavoidable footprint (post-consolidation target)

| Unit | Est. chars |
|------|----------:|
| Thin pack seed (compose L0–L3, L1 output, refs) | ~5,500–6,500 |
| `LD-DESIGN-PAGE-COMPOSE-CONTRACT` (L4 preserve refs + L5 field list + L8 checks) | ~2,500–3,500 |
| Embedded `LD-MATERIALS-COPY` + `LD-TABLE-FIDELITY` preserve | ~4,150 |
| `LD-SPRINT38-AFFORDANCE` (one example) | ~2,500–3,000 |
| `LD-SELF-DIRECTED-RHETORIC` (design_page rider) | ~3,600 |
| `LD-MATH-RENDER` | ~1,220 |
| **Total** | **~19,500–21,000** |

### 8.3 Removable footprint

| Target | Est. savings | Mechanism |
|--------|-------------:|-----------|
| Pack template MATERIALS FIDELITY + VISUAL AFFORDANCES prose | **~2,500–3,500** | Ref canonical modules / L6 rider |
| Sprint 38 duplicate examples (keep 1) | **~1,500–2,000** | MR-05 fixture link |
| Materials fidelity wrapper duplicate preamble | **~300–500** | Merge into compose contract header |
| Field preservation vs PEL orientation (conditional) | **~400–800** | Single L5 appendix when enrichment on |
| Pack `defaultPromptNotes` (runner) | **~8,476** file size | Runner pointer only — **no** probe delta |
| **Augmented removable (realistic)** | **~4,000–7,000** | Pack trim + runtime merge |

### 8.4 Likely Wave 3 reduction

| Scenario | Augmented target | Δ vs 27,345 |
|----------|----------------:|------------:|
| **Pack template dedupe only** | ~24,000–25,000 | −2,000–3,500 |
| **Pack + Sprint 38 example trim** | ~22,000–23,500 | −3,800–5,300 |
| **Full Strategy B (compose contract + ≤3 units)** | **~20,000–22,000** | **−5,300–7,300** |
| **Match 38B-3 original ≤22,000** | **Achievable** | Aligns with full Strategy B |

**Wave 3 is not primarily another −40% step** — Wave 1 already removed nine rhetoric markers. Further gains are **deduplication and authority**, not module invention.

---

## 9. 38B-3 plan revision (post Wave 1 + 2)

| 38B-3 assumption (2026-06-04) | Still valid? | Revision |
|--------------------------------|--------------|----------|
| Strategy B: thin pack + compose contract | **Yes** | **Strengthened** — Wave 2 clarifies L4 is preserve-only on DP |
| Target ≤22k augmented | **Yes** | Current **27,345**; gap **~5.3k** — matches §8.3 |
| ≤3 append units | **Yes** | Current **6** markers → merge to **3** |
| Layer 4 table anti-patterns in compose | **Yes** | Use `LD-TABLE-FIDELITY` preserve embed; forbid re-author |
| Remove 11 rhetoric markers | **Done** (Wave 1) | Do **not** re-count; single `LD-SELF-DIRECTED-RHETORIC` stays |
| DLA/GAM table hypothesis | **Superseded** | Chain **active** — DP focus is **merge + PREC** |
| `defaultPromptNotes` trim | **Yes** | Runner dedupe; optional for LLM size |
| Side-by-side Inflation diff | **Still required** | [38B-6](38B-6-regression-validation-plan.md) Wave 3 gate |

**Wave 3 primary mode:** **Consolidation** (authority map + compose contract + pack dedupe) with **simplification** (Sprint 38 example diet), not greenfield redesign.

---

## 10. Recommended implementation sequence (preview)

| PR | Scope | Change class |
|----|-------|--------------|
| **PR-W3-1** | Pack §13 template dedupe — refs to `LD-MATERIALS-COPY`, `LD-TABLE-FIDELITY`, `LD-MATH-RENDER`, slim Sprint 38 in template | CC-CONTRACT |
| **PR-W3-2** | Introduce `LD-DESIGN-PAGE-COMPOSE-CONTRACT` runtime block; merge field preservation + membership + L8 | CC-MODULE ref |
| **PR-W3-3** | Slim `LD-SPRINT38-AFFORDANCE` — one example; drop duplicate pack VISUAL prose | CC-SCHEMA adjacent / pack |
| **PR-W3-4** | Inflation Factory gate + EV page JSON (`section_id`) per [B4-CLOSURE-REVIEW](B4-CLOSURE-REVIEW.md) §9 | MANUAL + validation |

**Out of scope Wave 3 planning:** Renderer, VEU, compose validator schema, Sprint 39 cues.

---

## 11. Success criteria mapping

| Criterion | Outcome |
|-----------|---------|
| What DP truly owns | §7 |
| What remains duplicated | §5, §8.3 — pack template vs runtime L4/L6 |
| Consolidation vs simplification | **Both**; consolidation dominant |
| Realistic reduction from 27,345 | **~4k–7k** → **~20k–23k** |
| 38B-3 plan revised? | §9 — **yes**, metrics updated; Strategy B unchanged |

---

## 12. Sign-off

| Item | Status |
|------|--------|
| Wave 3 planning | **COMPLETE** |
| PR-W3-1 pack dedupe | **COMPLETE** — [38B-W3-1](38B-W3-1-design-page-pack-dedupe.md) |
| PR-W3-2 compose contract | **COMPLETE** — [38B-W3-2](38B-W3-2-design-page-compose-contract.md) |
| PR-W3-3 Sprint 38 prompt slim | **COMPLETE** — [38B-W3-3](38B-W3-3-sprint38-prompt-slimming.md) |
| PR-W3-4 Inflation gate evidence | **COMPLETE** — [38B-W3-4](38B-W3-4-inflation-gate-evidence.md) |
| Wave 3 programme | **COMPLETE** — size ≤22k **waived**; B4 **MONITORING** |

**Cross-reference:** [38B-3](38B-3-design-page-consolidation-plan.md) § Post Wave 1/2 revision · [38B-5](38B-5-workflow-wide-review.md) Wave 3 row.
