# Slice 38B-3 — Design Page consolidation plan

**Date:** 2026-06-04  
**Status:** **COMPLETE** (planning scope — see [Planning closure §38B-3](../PLANNING-CLOSURE-SUMMARY.md#38b-3-design-page-consolidation-plan))  
**Checklist:** [probe-38B-3-design-page-before-after-checklist.md](../fixtures/probe-38B-3-design-page-before-after-checklist.md)  
**Depends on:** 38B-1, 38B-2, 38B-4  
**Wave 3 authority review:** [38B-W3-design-page-authority-review.md](38B-W3-design-page-authority-review.md) (2026-06-04) — revises metrics post Wave 1/2.

---

## Success criterion

A documented target contract shape and migration approach for Design Page prompts — **no implementation** in planning phase.

---

## Current problem

Design Page receives:

1. Large pack `promptTemplate` + `defaultPromptNotes` (includes Sprint 38 + materials fidelity notes)  
2. Multiple runtime blocks appended in fixed order via `applyWorkflowStepRuntimePromptAugmentations`  

Result: high token load, duplicated constraints, and model behaviour that compresses structured tables.

---

## Target hierarchy (consolidated contract)

```text
Core task
  Assemble profile-aware page from upstream; read-only composition.

1. Hard output schema
  sections[], page root keys, activity object keys, assessment_check shape,
  visual_affordance_schema_version 38.4 + reviews + affordances[].

2. Source-material fidelity
  Ground in upstream only; source_artefacts booleans; no fabricated content.

3. Activity composition rules
  Full membership; learning_sequence order only; omissions in generation_notes.

4. Structured material and table rules
  materials{} named fields; markdown tables in field values;
  merge activity_materials per activity_id;
  forbid placeholder-only labels;
  forbid comma-row pseudo-tables; require pipe tables or structured rows.

5. Pedagogical preservation rules
  Verbatim cognition/orientation fields; PEL reasoning on activities;
  worked examples, faded templates, closure bullets in materials.

6. Visual affordance metadata rules
  Sprint 38 generate/defer/reject; additive page root only;
  pedagogical_added_value; representation_avoid for figures.

7. Rendering compatibility rules
  Math delimiters; markdown not inside bullet strings; internal enum sanitisation.

8. Final validation checklist
  (U \ X) ⊆ C; materials objects; affordance types; no malformed tables.
```

---

## Current block → target layer mapping (Design Page)

**Taxonomy:** [38B-2](38B-2-instruction-taxonomy.md). **Precedence:** L4 materials/table beats L5–L7 rhetoric and overview synthesis.

### Pack sources (§13 Prompt Factory)

| Current source | Chars (approx) | Clusters | Target layer | Action |
|----------------|---------------:|----------|--------------|--------|
| `promptTemplate` core + output | **7,915** (was 9,818) | 4,5,6,9,10,12 | L0–L1, L3–L4, L6 | **PR-W3-1 done** — authority refs; Sprint 38 detail in runtime — [38B-W3-1](38B-W3-1-design-page-pack-dedupe.md) |
| `defaultPromptNotes` | **1,461** (was 8,476) | 4,5,6,10,12 | L1–L4, L6 | **Trimmed** (runner); defers to runtime modules |
| `userOptions` (`page_profile` learner) | — | 12 | L5 (overview scope) | Keep; clarify “session overview not materials summary” |
| `runnerInstructions` | — | 8, 10 | L8 | Do not inject into LLM prompt if duplicated |

### Runtime blocks (self-directed — 15 markers today)

| Current runtime block | Cluster | Target layer | Consolidated into |
|----------------------|---------|--------------|-------------------|
| Self-directed page activity field preservation | 4, 2 | L5 | `LD-PEL-PRESERVE` + L4 pointer |
| Learner-action rhetoric | 1, 11 | L7 | `LD-SELF-DIRECTED-RHETORIC` |
| Worked-example and faded-support | 1 | L5 | same module § worked |
| Embedded feedback and misconception interruption | 1 | L5 | same § misconception |
| Concept/procedure integration | 1 | L5 | same § concept/procedure |
| Metacognitive closure and evaluative judgement | 1, 12 | L5 | same § closure (overview-safe) |
| Session orientation rhetoric | 1, 12 | L5 (overview fields) | same § orientation |
| Conceptual tension and difficulty framing | 1, 12 | L5 | same § tension |
| Intellectual progression signalling | 1, 12 | L5 | same § progression |
| Epistemic synthesis and closure | 1, 12 | L5 | same § synthesis — **not materials** |
| Transfer and durable understanding | 1, 12 | L5 | same § transfer |
| Sprint 38 visual affordance authoring contract | 6 | L6 | `LD-SPRINT38-AFFORDANCE` |
| Sprint 38 pedagogical added-value contract | 7 | L6 | same — figures only |
| Design Page activity materials fidelity | 4, 5 | L4 | `LD-MATERIALS-COPY` + `LD-TABLE-FIDELITY` |
| Math notation output contract | 8 | L7 | `LD-MATH-RENDER` (global ref) |

### Conditional runtime (not in 15-block probe count)

| Current source | Cluster | Target layer | Action |
|----------------|---------|--------------|--------|
| Pedagogic enrichment — orientation contract | 2 | L5 | Merge with field preservation when brief active |
| Pedagogic cognition contract | 3 | L5 | Brief-gated only; dedupe with PEL |

### Target append units after consolidation (≤3)

| Unit | Layers | Est. chars |
|------|--------|------------|
| `LD-DESIGN-PAGE-COMPOSE-CONTRACT` | L0–L4, L8 | ~6–8k |
| `LD-SPRINT38-AFFORDANCE` (Design Page rider) | L6 | ~2–3k (one example) |
| `LD-SELF-DIRECTED-RHETORIC` (brief rider) | L5, L7 | ~1.5–2k |

**Removed from Design Page append chain:** 11 separate rhetoric markers → single module; duplicate Sprint 38 pack text; duplicate materials bullets in notes.

---

## Consolidation strategies (evaluate)

| Strategy | Pros | Cons |
|----------|------|------|
| **A. Pack-only single contract** | One source of truth; easier diff | Loses per-step runtime gating |
| **B. Thin pack + one runtime “LD compose contract”** | Shorter seed; gated by step | Requires careful merge of 35–38 |
| **C. Layered includes (generated)** | Build from taxonomy modules | Tooling investment |
| **D. Keep blocks but numbered precedence** | Low initial churn | Still long until merged |

**Planning decision (2026-06-04):** Adopt **Strategy B** — thin pack seed + one runtime consolidated compose contract (`LD-DESIGN-PAGE-COMPOSE-CONTRACT`) plus ≤2 brief-gated riders (`LD-SPRINT38-AFFORDANCE`, `LD-SELF-DIRECTED-RHETORIC` ref). Implementation names functions later.

### Deferred to implementation (not planning blockers)

| Item | Owner doc |
|------|-----------|
| Full layer-by-layer contract prose (`LD-DESIGN-PAGE-COMPOSE-CONTRACT` text) | Implementation Wave 3 |
| Side-by-side Inflation prompt diff | 38B-6 §8 step 2–3 |
| Pack `defaultPromptNotes` trim execution | CC-CONTRACT |

---

## Before / after metrics (to capture)

| Metric | Before (38B-1) | Current (post W1/W2) | After (target) |
|--------|----------------|----------------------|----------------|
| Augmented prompt chars | **45,791** | **27,345** | **≤22,000** |
| Distinct auto-applied markers | **15** | **6** | **≤3** |
| Duplicate rule count | **12+ clusters** | Pack template L4/L6 dupes remain | **1× per layer** |
| Inflation table pass (38B-6) | FAIL | **MONITORING** ([B4-CLOSURE-REVIEW](B4-CLOSURE-REVIEW.md)) | PASS at Wave 3 gate |

---

## Post Wave 1 + Wave 2 revision (2026-06-04)

Full analysis: [38B-W3-design-page-authority-review.md](38B-W3-design-page-authority-review.md).

| Planning item | Original (38B-1) | Revised |
|---------------|------------------|---------|
| Baseline augmented | 45,791 | **27,345** (Wave 1 −40.3%) |
| Table failure locus | DLA + GAM + DP merge | **Chain active:** DLA spec → GAM author → DP preserve |
| Rhetoric on DP | 15 markers → W1 collapse | **6** markers — merge to ≤3 in W3, not re-collapse |
| Primary Wave 3 work | Consolidation (Strategy B) | **Consolidation + pack template dedupe** (remove MATERIALS/VISUAL duplicate prose) |
| Realistic augmented Δ | −18k (estimate) | **−4k to −7k** from 27,345 |
| B4 programme | OPEN at planning | **MONITORING** — Wave 3 delivers preserve gate + PREC evidence |

**Strategy B unchanged:** thin pack seed + `LD-DESIGN-PAGE-COMPOSE-CONTRACT` + ≤2 riders.

---

## Migration sketch (planning only)

1. Inventory → taxonomy (38B-1, 38B-2)  
2. Draft consolidated markdown/JSON contract section per layer  
3. Side-by-side prompt diff on Inflation seed  
4. 38B-6 validation checklist on anchors  
5. Implementation PR: replace append chain with single block + pack trim  
6. Remove redundant blocks only when tests prove parity  

---

## Non-goals

- Changing Sprint 38 schema or compose validator  
- Removing pedagogical enrichment — only reorganising  

---

## Planning completeness (closure review)

| Planning deliverable | Status |
|---------------------|--------|
| Target 8-layer hierarchy | **Done** |
| Pack + runtime block → layer map | **Done** |
| Target ≤3 append units + char targets | **Done** |
| Strategy evaluation + adopted path (B) | **Done** |
| Migration sketch + non-goals | **Done** |
| Layer 4 table anti-patterns | **Done** (requirements in [38B-4](38B-4-materials-and-table-fidelity.md) § consolidation) |

**No planning blockers remain.** Consolidated contract **draft text** is an implementation prerequisite, not a 38B-3 gap.

### Post W3-2 implementation note (2026-06-04)

- **PR-W3-2 complete:** [38B-W3-2](38B-W3-2-design-page-compose-contract.md) — compose contract; augmented **25,331** (5 markers).
- **PR-W3-3 complete:** [38B-W3-3](38B-W3-3-sprint38-prompt-slimming.md) — Sprint 38 examples + catalog dump slimmed; augmented **24,771** (5 markers). **22k–23.5k** band not met — L4 embed + rhetoric dominate; schema/validation unchanged.
- **PR-W3-4 complete:** [38B-W3-4](38B-W3-4-inflation-gate-evidence.md) — Inflation gate **PASS** on EV-38B4-01 + golden + CSV negative control; **730** tests; four-step **71,960**; B4 **MONITORING**; Wave 3 **COMPLETE**.
