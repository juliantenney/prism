# Objective

Run the smallest experiment testing whether a **path-gated ephemeral verbatim envelope** can reproduce Sprint 63–style Tier 1 manifestation outputs while preserving exact provenance and avoiding semantic invention — without production, schema, or renderer changes.

**Core question:** Can a path-gated ephemeral verbatim envelope reproduce the learner-facing gains observed in Sprint 63 while preserving exact provenance and avoiding semantic invention?

**Location:** Combination 6 (experiment-only) — [preservation-and-manifestation-location-comparison.md](preservation-and-manifestation-location-comparison.md)

**Artefacts:** [experiments/ephemeral-verbatim-envelope/](experiments/ephemeral-verbatim-envelope/)

---

# Eligibility Rules

All required:

```text
source exists
realised material exists
material_id on both sides
exact 1:1 correlation (same id)
validated plan with high-value keys
supported archetype ∈ {mechanism_explanation, process_walkthrough, mental_model_building}
path supported (not partial/material-only alone)
```

On failure:

```text
Tier 1 absent
Tier 2 only
diagnostic reason recorded
```

No title / position / type matching. Fail closed.

---

# Samples

## Eligible (3)

| ID | Sample | Archetype | High-value fields |
| -- | ------ | --------- | ----------------- |
| E1 | Exp2 enzymes A2-M1 | `mechanism_explanation` | `required_links` |
| E2 | Mixed DLA A4-M1 + stand-in | `process_walkthrough` | `stages` |
| E3 | Mixed DLA A3-M1 + stand-in | `mental_model_building` | `key_relationships`, `governing_constraint` |

See [eligible-samples.json](experiments/ephemeral-verbatim-envelope/eligible-samples.json).

## Excluded (4)

| ID | Reason |
| -- | ------ |
| X1 gam-partial | `unsupported_path` |
| X2 RNA assembled | `unsupported_path` |
| X3 mixed A1 ordinary | `no_archetype` |
| X4 Ed Psych/Marx GAM alone | `unsupported_path` (no plans / no source on GAM artefact) |

See [excluded-samples.json](experiments/ephemeral-verbatim-envelope/excluded-samples.json).

---

# Envelope Construction

Ephemeral diagnostic shape (not a schema):

```json
{
  "source_material_id": "A2-M1",
  "realised_material_id": "A2-M1",
  "instructional_archetype": "mechanism_explanation",
  "authored_structure": { "required_links": ["…"] },
  "provenance": { "correlated": true, "eligible": true }
}
```

* Built only for eligible samples.  
* Not written to canonical page/materials.  
* Stored only under `experiments/ephemeral-verbatim-envelope/envelopes.ephemeral.json`.

High-value keys only (Contract B / Sprint 63):

| Archetype | Authored structure keys |
| --------- | ----------------------- |
| mechanism | `required_links` |
| process | `stages` |
| mental model | `key_relationships`, `governing_constraint` |

---

# Tier 1 vs Tier 2 Comparisons

Full write-up: [tier1-tier2-comparisons.md](experiments/ephemeral-verbatim-envelope/tier1-tier2-comparisons.md).

| Sample | Tier 2 | Tier 1 delta (verbatim only) |
| ------ | ------ | ---------------------------- |
| E1 | Preamble, goal, success, overview; no named links | Adds Causal link 1–3 from `required_links[]` |
| E2 | Same shell; no named stages | Adds Stage 1–4 from `stages[]` |
| E3 | Same shell; unnamed relationships/constraint | Adds Key relationships 1–3 + Governing constraint |

Structural phase labels follow Sprint 63 Exp 2/3 validated patterns. **No paraphrased science.**

---

# Provenance Traces

Every T1-only element:

```text
learner element → source field → source value → source material_id → realised material_id
```

See [provenance-traces.json](experiments/ephemeral-verbatim-envelope/provenance-traces.json).

Example (E1):

| Learner element | Source field | Source value |
| --------------- | ------------ | ------------ |
| Causal link 1 | `archetype_plan.required_links[0]` | molecular kinetic energy and collision frequency |
| Causal link 2 | `…[1]` | enzyme-substrate complex formation |
| Causal link 3 | `…[2]` | disruption of enzyme structure at high temperature |

---

# Excluded Cases

Unsupported / ineligible samples produced **no Tier 1 envelope**. Tier 2-only behaviour recorded with reason codes (`unsupported_path`, `no_archetype`). No degraded matching attempted.

---

# Evaluation

See [evaluation.md](experiments/ephemeral-verbatim-envelope/evaluation.md).

| Criterion | Result |
| --------- | ------ |
| Exact provenance | **Met** |
| No semantic invention | **Met** |
| Fail-closed gating | **Met** |
| Validated samples → T1 | **Met** (3/3) |
| Unsupported → T2 only | **Met** |
| No production structures modified | **Met** |

Pedagogical “improvement” was **not** a success criterion; visibility deltas match Sprint 63 T1 pattern by construction.

---

# Findings

1. Path-gated ephemeral envelopes **can** drive bounded T1 manifestation for all three validated archetypes.  
2. Exact provenance was maintained for every T1-only element.  
3. Fail-closed gating kept unsupported paths at Tier 2.  
4. No production code, schema, or renderer changes were required.  
5. Results **support** Sprint 63 conclusions (non-recoverable high-value fields become learner-visible only when preserved/projected verbatim).  
6. Prototype does **not** justify production architecture by itself — it justifies continuing to a Sprint 64 recommendation with clear constraints.

---

# Limitations

* E2/E3 use ID-aligned diagnostic material stand-ins (not live GAM bodies).  
* Sample size small (3 eligible).  
* `evaluation_judgement` not exercised.  
* Same-artefact both-arrays live captures remain rare (E1 is diagnostic).  
* Structural labels (“Causal link N”) are Exp 2/3 chrome, not new science — still a presentation choice.

---

# Recommendation

**Success condition met.**

Proceed to **S64-BL-005 — Sprint 64 recommendation**: synthesise investigation + prototype into an evidence-based close recommendation (further investigate / bounded follow-on / stop) — still **without** authorising production merge, schema redesign, or renderer coupling.

---

# Report metadata

**Sprint:** 64 · **Task:** S64-BL-004b · **Date:** 2026-07-16 · **Status:** Complete
