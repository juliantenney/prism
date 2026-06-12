# Sprint 42-10 — Source Ingest Learning Content Parity

**Date:** 2026-06-11  
**Type:** Orchestration + prompt contract (no schema, renderer, or step merge)  
**Builds on:** [42-8 resource spine](observations/42-8-resource-spine-investigation.md), [42-9 Generate vs Normalise parity investigation](observations/42-9-generate-normalise-content-parity-investigation.md) (conversation)

---

## Goal

Converge source-ingest workflows on `learning_content` before Model Knowledge:

```text
Before: Normalize Content → normalized_content → Model Knowledge
After:  Normalize Content → Generate Learning Content → learning_content → Model Knowledge
```

Topic route unchanged:

```text
Generate Learning Content → learning_content → Model Knowledge
```

---

## Changes

### 1. Workflow orchestration (`app.js`)

| Change | Detail |
| ------ | ------ |
| **Removed GLC stripping** | Deleted three fail-safes that removed Generate Learning Content from authoritative-source / ingest workflows |
| **`allowGenerateLearningContent`** | Extended with `shouldIncludeNormalizeForSourcePosture()` so source-ingest paths allow GLC inclusion |
| **`providedArtefacts.learning_content` hack removed** | `provided_source_content` starting artefact no longer pretends `learning_content` is already provided |
| **`ensureSourceIngestLearningContentAfterNormalize`** | When authoritative source is present and Normalize exists but GLC is missing, inserts GLC between Normalize and Model Knowledge |

### 2. Workflow policy (`domain-learning-design-step-patterns.md`)

| Change | Detail |
| ------ | ------ |
| **Precedence rule** | `["Normalize Content", "Generate Learning Content"]` added before existing GLC → MK rule |

### 3. Generate Learning Content prompt (§2)

Tightened when `source_material` is `normalized_content`:

- Preserve source meaning; do not invent unsupported ideas
- Convert to teaching-ready `learning_content` JSON (not Normalize-style headings)
- Governing question / central inquiry in `title` or first section
- Intellectual progression in section titles
- Strict output keys: `title`, `sections[{title, content}]`, `key_concepts[]`, `examples[{title, description}]`

### 4. Model Knowledge prompt (§3)

- When `learning_content` is bound, treat it as **primary** structured source; use `normalized_content` only when LC is absent

### 5. Normalize Content (§1)

**Unchanged** — remains fidelity/cleaning (`structured_markdown`, `normalized_content`, no pedagogic generation).

---

## Required verdict

### 1. Do both topic and source routes now produce `learning_content`?

**Yes.** Topic routes retain Generate Learning Content before Model Knowledge. Source-ingest routes now run **Normalize → Generate Learning Content → Model Knowledge**, producing `learning_content` before KM.

### 2. Does Normalize remain fidelity-only?

**Yes.** No changes to Normalize prompt, output artefact (`normalized_content`), or `structured_markdown` format. Pedagogic interpretation is confined to Generate Learning Content.

### 3. Was any schema, renderer, or workflow-stage redesign required?

**No.**

| Constraint | Status |
| ---------- | ------ |
| Artefact schemas | Unchanged (`normalized_content`, `learning_content`, `knowledge_model` shapes) |
| Renderer | Untouched |
| Merge Normalize + GLC | Not done — separate steps preserved |
| New workflow stages | None — re-enabled existing GLC in ingest topology |

Changes are **orchestration heuristics** + **prompt contracts** + **precedence rule** only.

### 4. Test results

| Suite | Result |
| ----- | ------ |
| `tests/workflow-ld-orchestration.test.js` | **28/28 pass** (includes updated ingest test) |
| `tests/workflow-ld-epistemic-grounding.test.js` | included above |
| `tests/workflow-ld-source-ingest-learning-content-parity.test.js` | **7/7 pass** (new) |
| `tests/workflow-sprint27-post-stabilisation-observation.test.js` | included above — transcript-source brief now `Normalize → GLC → MK` |
| `tests/workflow-ld-rna-sparse-brief-topology.test.js` | included above |
| Sprint 41/42 regression (journey, authorial exposition, preamble, PEL, compose, cognition) | **87/87 pass** |

**Total for this slice:** 28 workflow/parity + 87 regression = **115 pass, 0 fail**.

---

## Files touched

| File | Role |
| ---- | ---- |
| `app.js` | Ingest orchestration: stop stripping GLC; insert GLC after Normalize |
| `domains/learning-design/domain-learning-design-step-patterns.md` | Precedence rule; GLC + MK prompt tightening |
| `tests/workflow-ld-orchestration.test.js` | Ingest topology expectation |
| `tests/workflow-ld-epistemic-grounding.test.js` | P27-04 upload brief |
| `tests/workflow-sprint27-post-stabilisation-observation.test.js` | Transcript-source observation |
| `tests/workflow-ld-source-ingest-learning-content-parity.test.js` | New parity tests |

---

## Downstream effect

Design Page and `LD-JOURNEY-ASSIMILATION` can now rely on bound `learning_content` on **both** major entry paths (topic-first and source-ingest), subject to runtime capture quality and GLC prompt adherence.
