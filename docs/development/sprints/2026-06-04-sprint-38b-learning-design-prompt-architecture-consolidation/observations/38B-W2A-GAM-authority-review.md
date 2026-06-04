# Wave 2a — Generate Activity Materials (GAM) authority review

**Date:** 2026-06-04  
**Phase:** Planning **COMPLETE** · Pack trim **DONE** — [38B-W2A-1](38B-W2A-1-GAM-pack-authority-trim.md) (PR-W2a-1)  
**Charter:** [EXECUTION-CHARTER-WAVE-1](../EXECUTION-CHARTER-WAVE-1-SHARED-MODULE-CONSOLIDATION.md) (Wave 1 **COMPLETE** — [38B-W1-5](38B-W1-5-wave-1-exit-gate.md))  
**Inputs:** [38B-4](38B-4-materials-and-table-fidelity.md) · [38B-2](38B-2-instruction-taxonomy.md) · [38B-5](38B-5-workflow-wide-review.md) · [38B-6](38B-6-regression-validation-plan.md) · [38B-7](38B-7-governance-and-maintenance.md)

---

## 1. Executive summary

| Question | Answer |
|----------|--------|
| **Is GAM the true table authority?** | **Yes** — primary **author** of table-shaped content in `activity_materials` (cluster 5, L4). Design Page is **preserve-only** for pipes already emitted upstream. |
| **Which instructions survive?** | Pack: task shape, material-type realisation, output sectioning (must drop facilitator template for self-directed). Runtime: **`LD-TABLE-FIDELITY` (author)**, **`LD-MATERIALS-COPY` (author, embedded)**, **`LD-MATH-RENDER`**, **`LD-SELF-DIRECTED-RHETORIC` (GAM rider)**, GAM-only **reading sufficiency** + **learner voice** + **timeline** (merge candidate). |
| **Which are redundant?** | Pack + `defaultPromptNotes` duplicates of all four Wave 1 modules; legacy “table row adequacy” (in module); vague “malformed table-like text” (replace with module cross-ref). |
| **Can B4 close in Wave 2a alone?** | **Partially** — if live failures originate at GAM, Wave 2a pack trim + authority clarity + **L4-07** upstream capture can close **B4-01/B4-02 at author**. **Design Page merge** failures still need **Wave 3** (preserve contract + PREC live gate). |
| **Smallest safe implementation scope?** | **CC-CONTRACT** pack §6 trim (dedupe only) + optional **one** merged GAM-specific scaffold marker + **MANUAL** Inflation GAM artefact check — **no** canonical `LD-*` text edits without materials/GAM owner review. |

**Wave 2a objective alignment:** Focus is **authority and ambiguity removal**, not further prompt size reduction (Wave 1 already reduced GAM augmented prompt to **16,370** chars).

---

## 2. Current GAM prompt architecture (post Wave 1)

### 2.1 Augmentation chain (`applyWorkflowStepRuntimePromptAugmentations`)

Order for GAM (self-directed learner page brief):

| # | Source | Applies to GAM? | Marker visible? |
|---|--------|-----------------|-----------------|
| 1 | Pedagogic cognition contract | If brief activates contract | Yes |
| 2 | Self-directed scaffolds (DLA-only blocks skipped) | Partial | Mixed |
| 3 | `applyLdTableFidelityContractToDraft` | **Yes** | **`LD-TABLE-FIDELITY (auto-applied)`** |
| 4 | `applyLdMaterialsCopyContractToDraft` | **Yes** | **No** — `includeMarker: false` |
| 5 | PEL orientation / reasoning enrichment | If enrichment IDs active | Yes |
| 6 | PEL GAM reasoning materials | If enrichment + GAM | Yes |
| 7 | Sprint 38 | No | — |
| 8 | Design Page materials fidelity | No | — |
| 9 | `applyMathSafeOutputContractToDraft` | **Yes** | **`LD-MATH-RENDER (auto-applied)`** |

Inside `applySelfDirectedLearnerPageStepScaffoldsToDraft` (when `applyGamScaffolds`):

| Block | Marker | Role |
|-------|--------|------|
| `LD-TABLE-FIDELITY` | Yes (also via step 3 — idempotent) | L4 table **author** |
| `LD-MATERIALS-COPY` | Embedded via step 4 | L4 full content |
| Reading sufficiency | Yes | L4 density / reading length |
| Material voice | Yes | L7 facilitator ban |
| Timeline sequencing | Yes | L4/L5 ordering tasks |
| `LD-SELF-DIRECTED-RHETORIC` | Yes | L5/L7 rhetoric |

**Probe (2026-06-04):** GAM **16,370** augmented chars · **6** distinct auto-applied markers.

### 2.2 Pack source (`domain-learning-design-step-patterns.md` §6)

| Asset | Approx. role | Wave 1 overlap |
|-------|--------------|----------------|
| `promptTemplate` | Full task + hard rules + output organisation (`Activity:` / `Material:` / **`Facilitator use:`**) | Duplicates **LD-MATERIALS-COPY**, **LD-TABLE-FIDELITY**, **LD-MATH-RENDER**, rhetoric |
| `defaultPromptNotes` | Self-directed materials quality bullets | Duplicates **LD-SELF-DIRECTED-RHETORIC** + partial **LD-TABLE-FIDELITY** / materials |

**Critical conflict:** Pack still mandates **`Facilitator use:`** in output structure while runtime **material voice** forbids facilitator headings — model receives contradictory signals on self-directed briefs.

---

## 3. GAM authority map (table-related and fidelity)

Legend: **Keep** = retain in pack or runtime; **Move** = relocate to module or GAM rider; **Remove** = delete as duplicate; **Ref** = one-line cross-reference to canonical module.

| Instruction (paraphrased) | Source location | Layer | Owner | Recommendation |
|---------------------------|-----------------|-------|-------|----------------|
| Complete pipe table: header, divider, rows | Pack §6 `promptTemplate` | L4 | GAM + materials | **Ref** → `LD-TABLE-FIDELITY`; keep one-line in pack |
| Avoid malformed table-like text | Pack §6 `promptTemplate` | L4 | GAM | **Remove** → replace with “follow LD-TABLE-FIDELITY” |
| Hard rule: generate full usable content | Pack §6 `promptTemplate` | L4 | Materials | **Ref** → `LD-MATERIALS-COPY` |
| No placeholders / describe-only | Pack §6 + usability bullets | L4 | Materials | **Ref** → `LD-MATERIALS-COPY` |
| PREC-01 pipe vs comma-row | `LD-TABLE-FIDELITY` core | L4 | Materials | **Keep** (canonical) |
| FORBIDDEN comma-row / Headers+Rows | `LD-TABLE-FIDELITY` core | L4 | Materials | **Keep** (canonical) |
| GOOD pipe example (≤6 lines) | `LD-TABLE-FIDELITY` core | L4 | Materials | **Keep** (canonical) |
| Author: realise analysis_table etc. as pipes in `activity_materials` | `LD-TABLE-FIDELITY` AUTHOR_LINES | L4 | GAM | **Keep** (canonical) |
| Row adequacy / mapping rows / timeline template rows | `LD-TABLE-FIDELITY` AUTHOR_LINES | L4 | GAM | **Keep** (canonical) |
| Author: full usable materials | `LD-MATERIALS-COPY` AUTHOR_LINES | L4 | Materials | **Keep** (embedded, no marker) |
| Table-shaped → see LD-TABLE-FIDELITY | `LD-MATERIALS-COPY` core | L4 | Materials | **Keep** (canonical) |
| TeX delimiters in material text | Pack §6 + `LD-MATH-RENDER` | L7 | Renderer | **Ref** → `LD-MATH-RENDER` only in pack |
| Worked example / faded / misconception / closure in materials | Pack `defaultPromptNotes` | L5 | Rhetoric | **Ref** → `LD-SELF-DIRECTED-RHETORIC` |
| Chronological lists mixed for ordering tasks | Pack notes + timeline block | L4/L5 | GAM | **Keep** timeline block or **Move** into GAM rider |
| No facilitator headings in materials | `buildSelfDirectedGamLearnerVoicePromptBlock` | L7 | GAM | **Keep** (GAM-specific) |
| Reading 150–300+ words | `buildSelfDirectedGamReadingSufficiencyPromptBlock` | L4 | GAM | **Keep** or merge into GAM rider |
| Reasoning materials in tables/spans | `buildSelfDirectedGamPelReasoningMaterialPromptBlock` | L5 | PEL/GAM | **Keep** (conditional, enrichment-gated) |
| Material-type: template, analysis_table | Pack type guidance | L0/L4 | GAM | **Keep** (authoring vocabulary) |
| Output: `Facilitator use:` section | Pack `promptTemplate` | L0/L7 | GAM | **Remove** or brief-gate for self-directed |
| Preserve upstream pipes | N/A at GAM (author step) | — | Design Page | **N/A** — preserve lines belong on Design Page only |

---

## 4. Duplication superseded by Wave 1 modules

| Duplicated theme | Pack / runtime copies | Canonical owner |
|------------------|----------------------|-----------------|
| Pipe tables | §6 template (~3 lines) | `LD-TABLE-FIDELITY` |
| Anti-placeholder / full content | §6 template (~8 lines) | `LD-MATERIALS-COPY` |
| Maths delimiters | §6 + notes (~2 lines) | `LD-MATH-RENDER` |
| Worked/faded/misconception/closure | `defaultPromptNotes` (~6 lines) | `LD-SELF-DIRECTED-RHETORIC` |
| Row adequacy | Was standalone block pre-W1-1 | `LD-TABLE-FIDELITY` author role |

**Estimated pack dedupe savings (implementation):** ~1.2–2.0k chars in seeded pack body — **not** a Wave 2a success metric per programme direction; improves **signal-to-noise** for table authority.

---

## 5. B4 risk analysis — causes inside GAM

| Failure mode | B4 case | Likely GAM contribution | Evidence |
|--------------|---------|-------------------------|----------|
| **Comma-row outputs** (`Scenario 1,,,`) | B4-01 | **High** — model compresses tables under long stack; pack says “pipe table” but also “malformed table-like” without forbidden list | Fixture shows GAM **can** emit pipes; live bad shapes match **author** compression |
| **Headers / Rows prose** | B4-02 | **High** — pseudo-spreadsheet serialisation when field shape ambiguous; pack does not forbid by name | No Headers/Rows ban in pack (only in `LD-TABLE-FIDELITY`) |
| **Table flattening** (CSV in prose) | B4-01 | **High** — same as comma-row | PREC-01 in module; pack lacks PREC-01 |
| **Partial table preservation** | B4-03 | **Low at GAM** — author step creates artefacts; partial = scenarios OK, table still bad | Preservation is **Design Page** duty |
| **Markdown pipe-table generation** | B4-01/02 fix | **High when spec types are `analysis_table` / `comparison_table`** | DLA supplies types; GAM must realise in `Content:` body as **named field** in downstream JSON/text conventions |

### 5.1 Hypothesis ranking (GAM-only lens)

1. **Pack ambiguity** — “malformed table-like” weaker than module FORBIDDEN list; facilitator section invites non-learner shapes.  
2. **Output organisation** — Materials dumped under `Content:` as prose sections instead of `materials.<key>` field names in structured export (workflow output shape dependency).  
3. **Token pressure** — Less severe post Wave 1 (16k vs 34k) but still multi-block.  
4. **DLA spec weakness** — `required_materials` may describe tables without requiring `type: analysis_table` + column keys (Wave 2b).  
5. **No post-GAM structural validator** — `sanitizeSelfDirectedGamMaterialsOutput` exists in runtime API; scope for Wave 2a implementation review (not changing in this audit).

### 5.2 What Wave 2a can vs cannot fix

| Outcome | Wave 2a alone | Needs Wave 3 |
|---------|---------------|--------------|
| B4-01/B4-02 **upstream GAM** pipes in `activity_materials` | **Target** — pack authority + L4-07 MANUAL | — |
| B4-01/B4-02 on **composed page** `activity.materials` | Unlikely | **Yes** — preserve + PREC |
| B4-03 scenarios | Already partial | Continued materials copy |
| Programme **B4 closed** claim | **No** | Live Inflation rerun both steps |

---

## 6. Proposed GAM consolidation plan (implementation preview)

### 6.1 Current vs target structure

**Current (self-directed GAM):**

```text
Pack §6 (large template + notes)
  + Pedagogic cognition (conditional)
  + LD-TABLE-FIDELITY [marker]
  + LD-MATERIALS-COPY [embedded, no marker]
  + PEL blocks (conditional)
  + Reading sufficiency [marker]
  + Material voice [marker]
  + Timeline [marker]
  + LD-SELF-DIRECTED-RHETORIC [marker]
  + LD-MATH-RENDER [marker]
```

**Target (Wave 2a — authority-first):**

```text
Pack §6 (slim seed)
  - L0: realise required_materials → activity_materials (unchanged intent)
  - L4: one-line refs: LD-TABLE-FIDELITY, LD-MATERIALS-COPY, LD-MATH-RENDER
  - L5: one-line ref: LD-SELF-DIRECTED-RHETORIC
  - Output organisation: learner-facing sections only (no Facilitator use for self_directed)
  + Pedagogic cognition (conditional, unchanged)
  + LD-TABLE-FIDELITY (author) [marker] — sole table authority
  + LD-MATERIALS-COPY (author) [marker OR embedded — pick one visibility rule]
  + LD-GAM-SELF-STUDY-MATERIALS (proposed) [marker] — reading + voice + timeline
  + LD-SELF-DIRECTED-RHETORIC (role: gam) [marker]
  + LD-MATH-RENDER [marker]
  + PEL reasoning materials (conditional, unchanged)
```

### 6.2 Append count target (38B-6 Wave 2a gate)

| Metric | Current | Target | Notes |
|--------|--------:|-------:|-------|
| Distinct auto-applied markers | **6** | **≤4** (stretch **≤3** with merge) | 38B-6 criterion written pre–rhetoric collapse; **1** rhetoric marker already |
| Canonical module markers | 3 visible + 1 embedded | 3–4 visible | Materials copy visibility is governance choice |
| Pack table authority lines | ~5+ explicit | **1** cross-ref | MR-04 single authority |

**Recommended merge (implementation PR):** `Reading sufficiency` + `Material voice` + `Timeline` → **`LD-GAM-SELF-STUDY-MATERIALS (auto-applied)`** (~25 lines) — GAM step owner owned, not a fifth global `LD-*` module unless promoted later.

### 6.3 Authority boundaries (normative)

| Concern | Authoritative layer | Must not |
|---------|---------------------|----------|
| Pipe table shape in `activity_materials` | **GAM** + `LD-TABLE-FIDELITY` (author) | Design Page re-authoring tables |
| Verbatim copy of upstream tables | **Design Page** + `LD-TABLE-FIDELITY` (preserve) | GAM rewriting on compose |
| Placeholder-only materials | **GAM** + `LD-MATERIALS-COPY` | Overview prose |
| Figure duplicate-table language | **Sprint 38 L6** (figures only) | L4 modules |
| `required_materials` table **types** | **DLA** (Wave 2b) | GAM inventing new activity structure |

---

## 7. Impact estimates

### 7.1 B4-01 / B4-02

| Case | Wave 2a impact | Confidence |
|------|----------------|------------|
| **B4-01** comma-row | **High** if GAM output is the corruption source | Medium — needs EV-38B4-03 |
| **B4-02** Headers/Rows | **High** — forbidden list is GAM-authoritative today but pack still allows prose tables | Medium |

### 7.2 Wave 3 Design Page

| Effect | Detail |
|--------|--------|
| **Dependency** | Wave 3 preserve contract assumes **upstream pipes exist** — Wave 2a improves upstream quality |
| **Scope unchanged** | Design Page still needs anti-flatten, PREC live gate, ≤22k target |
| **Risk if Wave 2a skipped** | Design Page cannot preserve pipes that were never authored |

### 7.3 Validation (38B-6)

| ID | Wave 2a plan |
|----|----------------|
| **L4-07** | **MANUAL** — Inflation workflow: capture `activity_materials` per activity; assert `\| --- \|` in table fields |
| **L4-04–06** | Optional AUTO* in implementation PR if materials owner approves |
| **L8-01** | Regression guard after pack trim |
| **PROBE** | Confirm marker count ≤ target; **no** required size reduction |

---

## 8. Smallest safe Wave 2a implementation scope (recommended PR)

| # | In scope | Out of scope |
|---|----------|------------|
| 1 | Pack §6 **CC-CONTRACT** dedupe: table/materials/math/rhetoric → module refs | Rewriting `LD-TABLE-FIDELITY` canonical text |
| 2 | Remove or self-directed-gate **`Facilitator use:`** output section | Sprint 38 / renderer / schema |
| 3 | Merge GAM scaffolds (reading + voice + timeline) to **one** marker | Wave 2b DLA |
| 4 | Optional: show **`LD-MATERIALS-COPY`** marker on GAM for probe clarity | Design Page compose contract |
| 5 | **EV-38B4-03** + **L4-07** checklist on Inflation GAM output | Claim B4 programme-closed |
| 6 | Update domain step patterns + changelog in 38B-7 **CC-PROMPT** record | `app.js` bootstrap removal |

**Change class:** **CC-CONTRACT** (pack) + optional **CC-MODULE** (GAM rider merge) + **CC-DOC** (this review).

---

## 9. Success criteria checklist (review pass)

| Criterion | Met in review? |
|-----------|----------------|
| GAM is true table authority | **Yes** |
| Exact surviving vs redundant instructions | **Yes** — §3–§4 |
| B4 solvable in 2a vs 3 | **Yes** — §5.2 |
| Smallest safe scope | **Yes** — §8 |
| No implementation in this pass | **Yes** |

---

## 10. References

| Asset | Path |
|-------|------|
| Pack §6 | `domains/learning-design/domain-learning-design-step-patterns.md` |
| Runtime chain | `app.js` → `applyWorkflowStepRuntimePromptAugmentations`, `applyLdTableFidelityContractToDraft`, `applyLdMaterialsCopyContractToDraft` |
| Canonical modules | `lib/ld-table-fidelity.js`, `lib/ld-materials-copy.js`, `lib/ld-math-render.js`, `lib/ld-self-directed-rhetoric.js` |
| Good upstream tables | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` (`activity_materials`) |
| Probe | `scripts/probe-38b1-ld-workflow-prompt-audit.js` |

**Implementation status:** **PR-W2a-1** pack trim merged in `domain-learning-design-step-patterns.md` §6 — see [38B-W2A-1](38B-W2A-1-GAM-pack-authority-trim.md). **Next:** PR-W2a-2 (optional runtime scaffold merge) + **L4-07** / EV-38B4-03.
