# Wave 2b — Design Learning Activities (DLA) authority review

**Date:** 2026-06-04  
**Phase:** Planning **COMPLETE** · Pack trim **DONE** — [38B-W2B-1](38B-W2B-1-DLA-pack-authority-trim.md) · Runtime spec wire **DONE** — [38B-W2B-2](38B-W2B-2-dla-table-spec-role.md) (PR-W2b-2)  
**Charter:** [EXECUTION-CHARTER-WAVE-1](../EXECUTION-CHARTER-WAVE-1-SHARED-MODULE-CONSOLIDATION.md) (Wave 1 **COMPLETE** — [38B-W1-5](38B-W1-5-wave-1-exit-gate.md))  
**Predecessor:** [38B-W2A](38B-W2A-GAM-authority-review.md) (GAM table **author**); [38B-W2A-1](38B-W2A-1-GAM-pack-authority-trim.md) (**PR-W2a-1 DONE**)  
**Inputs:** [38B-5](38B-5-workflow-wide-review.md) · [38B-2](38B-2-instruction-taxonomy.md) · [38B-4](38B-4-materials-and-table-fidelity.md) · [B4-CLOSURE-REVIEW](B4-CLOSURE-REVIEW.md) · [38B-6](38B-6-regression-validation-plan.md) · [38B-7](38B-7-governance-and-maintenance.md)

---

## 1. Executive summary

| Question | Answer |
|----------|--------|
| **What is DLA authoritative for?** | **Specifications only** — `learning_activities` JSON: tasks, outcomes mapping, `required_materials` **types** and **specification** text, cognition/orientation **field keys** — **not** full material bodies or pipe-table **authoring**. |
| **What is DLA not authoritative for?** | Table **realisation** (GAM + `LD-TABLE-FIDELITY` author), materials **copy** (GAM/Design Page + `LD-MATERIALS-COPY`), page **compose** (Design Page), figure affordances (Sprint 38 L6). |
| **Largest architectural debt?** | Runtime **OUTPUT CONTRACT** + **activity framing** + pack output schema **triple-list** cognition fields (optional PR-W2b-3). **`LD-TABLE-FIDELITY` spec role wired** — [38B-W2B-2](38B-W2B-2-dla-table-spec-role.md). |
| **B4 relevance?** | DLA supplies `required_materials` **vocabulary** — weak specs → GAM invents ambiguous shapes ([38B-4](38B-4-materials-and-table-fidelity.md) H5). B4 programme **MONITORING** — Wave 2b improves **upstream spec clarity**, not live table author. |
| **Wave 2b objective** | **Authority and ambiguity removal** (mirror Wave 2a) — not further size collapse (Wave 1 already cut DLA **−54%**). |
| **Smallest safe scope?** | Pack dedupe (**DONE** — [38B-W2B-1](38B-W2B-1-DLA-pack-authority-trim.md)) + runtime **`LD-TABLE-FIDELITY` (dla)** (**DONE** — [38B-W2B-2](38B-W2B-2-dla-table-spec-role.md)); optional PR-W2b-3 scaffold merge. |

---

## 2. DLA role in the materials / table chain

```text
DLA — spec vocabulary + activity structure + cognition field emission (L0, L3, L5)
  ↓ required_materials[].type + specification (must name table types explicitly)
GAM — PRIMARY table author (L4) — LD-TABLE-FIDELITY author role
  ↓ activity_materials
Design Page — preserve merge (L4) — LD-TABLE-FIDELITY preserve role
  ↓ learning_activities[].materials
Renderer — frozen
```

| Layer | DLA duty | Downstream consumer |
|-------|----------|---------------------|
| **L0** | Executable activities JSON schema | GAM, Design Page, Sequence |
| **L3** | Activity membership, grouping, duration | Design Page membership tests |
| **L4 (spec only)** | `required_materials` type + specification — **no full Content** | GAM realisation |
| **L5** | `activity_preamble`, PEL/cognition fields on activity rows | GAM (do not repeat in materials), Design Page (verbatim preserve) |
| **L7** | Learner-facing markdown subset + TeX in **activity fields** | Renderer on composed page |

**Normative boundary (post GAM Wave 2a):** If instruction says “generate pipe table body” or “full usable material content”, it belongs on **GAM**, not DLA. DLA may say “type: `analysis_table`; specification: columns X,Y,Z; realise as pipe table in GAM per LD-TABLE-FIDELITY”.

---

## 3. Current DLA prompt architecture (post Wave 1 + GAM trim)

### 3.1 Augmentation chain (`applyWorkflowStepRuntimePromptAugmentations`)

Order for DLA (self-directed learner-page brief, probe `wfSelfDirected`):

| # | Source | Applies to DLA? | Marker / visibility |
|---|--------|-----------------|---------------------|
| 1 | Pedagogic cognition contract | If `contract.active` from brief packs | **`Pedagogic cognition contract (auto-applied)`** |
| 2 | Self-directed scaffolds (`applyDlaScaffolds`) | Yes | Material shape · Activity framing · Timeline · OUTPUT CONTRACT* · JSON example* |
| 3 | `applyLdTableFidelityContractToDraft` | **Yes** — `{ role: "dla" }` when material-shape scaffold applies | **`LD-TABLE-FIDELITY (auto-applied)`** — [38B-W2B-2](38B-W2B-2-dla-table-spec-role.md) |
| 4 | `applyLdMaterialsCopyContractToDraft` | **No** (GAM only) | — |
| 5 | PEL orientation / reasoning | If `resolvePedagogicEnrichmentContractIds` non-empty | **`Pedagogic enrichment — … (auto-applied)`** |
| 6 | Sprint 38 / Design Page materials fidelity | No | — |
| 7 | `applyLdSelfDirectedRhetoricContractToDraft` | Yes | **`LD-SELF-DIRECTED-RHETORIC (auto-applied)`** |
| 8 | `applyMathSafeOutputContractToDraft` | Yes | **`LD-MATH-RENDER (auto-applied)`** |

\*OUTPUT CONTRACT and JSON example blocks lack `(auto-applied)` in their titles — **under-counted** by [probe-38b1](../scripts/probe-38b1-ld-workflow-prompt-audit.js) marker regex.

**Probe snapshot (2026-06-04):** DLA **18,054** augmented chars · **5** counted markers · seeded **3,470** · pack template **3,805** + notes **2,703**.

### 3.2 Pack source (`domain-learning-design-step-patterns.md` §5)

| Asset | Approx. chars (probe) | Role |
|-------|----------------------:|------|
| `promptTemplate` | 3,805 | L0 task, JSON output schema, facilitator_moves gating, markdown/TeX subset, `required_materials` shape |
| `defaultPromptNotes` | 2,703 | L5 rhetoric scaffolding, worked/faded/transfer, cognition field guidance, timeline spec hint, TeX repeat |

**Overlap with GAM §6 (post W2a-1):** GAM pack now **delegates** L4/L5 to modules; DLA pack still **embeds** the pre-consolidation rhetoric and scaffolding prose that GAM notes removed.

---

## 4. DLA authority map

Legend: **Keep** = retain at DLA; **Ref** = one-line module cross-reference; **Consolidate** = merge runtime blocks; **Move** = belongs on another step/module; **Remove** = duplicate delete.

| Instruction group | Primary source | Taxonomy | Owner | Module coverage | DLA-only? | Recommendation |
|-------------------|----------------|----------|-------|-----------------|-----------|----------------|
| Design executable activities JSON | Pack §5 template | L0 | DLA | — | **Yes** | **Keep** |
| Map to outcomes; grouping; duration | Pack §5 template | L0/L3 | DLA | — | **Yes** | **Keep** |
| `required_materials[]` schema (id, type, purpose, specification) | Pack §5 output | L0/L4 spec | DLA | Partial table types in template | **Yes** | **Keep** — strengthen table **type** enum |
| Do not generate full material content | Pack §5 template | L4 boundary | DLA | `LD-MATERIALS-COPY` author on GAM | **Yes** | **Keep** + **Ref** “author is GAM” |
| `facilitator_moves` / `failure_mode` omit self-directed | Pack §5 + OUTPUT CONTRACT | L7 | DLA | Rhetoric facilitator ban | **Yes** | **Keep** (brief-gated) |
| Learner markdown subset in activity fields | Pack §5 template | L7 | DLA | `LD-MATH-RENDER` | Partial | **Ref** math to module; **Keep** markdown subset once |
| TeX delimiters in learner fields | Pack §5 + notes + runtime | L7 | DLA | `LD-MATH-RENDER` | No | **Remove** pack/notes dupes → **Ref** only |
| Material types: template, analysis_table, … | Pack §5 output `type` list | L4 spec | DLA | `LD-TABLE-FIDELITY` SPEC_LINES | **Yes** | **Keep** vocabulary; **Ref** realisation → GAM |
| Pipe-table realisation in GAM | Material-shape 1-line | L4 | GAM | `LD-TABLE-FIDELITY` spec | No | **Move** to runtime **`LD-TABLE-FIDELITY` (role: dla)** |
| Multiline markdown / table line breaks in specs | Material-shape block | L4/L7 | DLA | — | **Yes** | **Keep** (spec formatting hints) |
| Integrated template vs duplicate task_cards | Material-shape block | L4 spec | DLA | — | **Yes** | **Keep** |
| Chronological / mixed event list in specification | Material-shape + timeline + pack notes | L4/L5 | DLA + GAM | Timeline on both steps | Shared | **Consolidate** → single **`LD-TIMELINE-SEQUENCING`** ref or GAM-only with DLA one-liner |
| activity_preamble required | Pack + framing + OUTPUT CONTRACT | L5 | DLA | `LD-SELF-DIRECTED-RHETORIC` | **Yes** | **Consolidate** — one authoritative list |
| Cognition field keys (PEL/reasoning) | Pack output + OUTPUT CONTRACT + PEL blocks | L5 | DLA | `LD-PEL-PRESERVE` (future) | **Yes** | **Consolidate** field catalog; **Keep** PEL conditional blocks |
| study_orientation / intellectual_frame / bridge | OUTPUT CONTRACT + PEL orientation | L5 | DLA | Rhetoric module | **Yes** | **Consolidate** — remove triple definitions |
| Worked → faded → transfer sequencing | Pack notes | L5 | DLA (spec) | `LD-SELF-DIRECTED-RHETORIC` | Spec cue only | **Ref** module; **Remove** long notes duplicate |
| support_note / Check your thinking | Pack notes | L5/L7 | DLA | Rhetoric misconception lines | **Yes** | **Keep** one pack line; **Ref** rhetoric |
| expected_output evidence not coverage | Pack notes | L5 | DLA | Rhetoric | **Yes** | **Ref** |
| Self-directed 9-block rhetoric | Runtime module | L5/L7 | Shared | `LD-SELF-DIRECTED-RHETORIC` | No | **Keep** runtime; **Remove** pack notes echo |
| OUTPUT CONTRACT override block | Runtime | L1/L5 | DLA | Duplicates pack `Output:` | **Yes** | **Consolidate** with pack trim |
| JSON example (Marx comparison) | Runtime | L8 | DLA | — | **Yes** | **Keep** one compact example (fixture link per MR-05) |
| Pedagogic cognition contract | Runtime conditional | L5 | Brief-driven | Overlaps PEL field list | Partial | **Keep** when packs active; dedupe field IDs with OUTPUT CONTRACT |
| PEL orientation contract | Runtime conditional | L5 | DLA / Design Page | Overlaps rhetoric + OUTPUT CONTRACT | No | **Keep** conditional; **Remove** duplicate sentences vs OUTPUT CONTRACT |
| PEL reasoning contract | Runtime conditional | L5 | DLA / GAM | GAM adds reasoning materials block | No | **Keep** on DLA; **Remove** pack duplication |
| `LD-TABLE-FIDELITY` full spec role | **Gap** — not in `applyLdTableFidelityContractToDraft` for DLA | L4 | Materials | SPEC_LINES in lib | No | **Keep** — **wire runtime** `role: "dla"` |
| `LD-MATERIALS-COPY` | N/A at DLA | L4 | GAM | Author only | No | **Ref** one line in pack (“content in GAM”) |
| `LD-MATH-RENDER` | Runtime | L7 | Shared | Canonical | No | **Keep** |
| `LD-SELF-DIRECTED-RHETORIC` | Runtime | L5/L7 | Shared | `ROLE_RIDERS.dla` empty | DLA rider TBD | **Keep**; optional **DLA rider** for spec-only cues |

---

## 5. Duplication vs canonical modules

| Module | What DLA still duplicates | Canonical owner | Action |
|--------|---------------------------|-----------------|--------|
| **`LD-TABLE-FIDELITY`** | Pack: “simple pipe tables” in learner fields; notes: table completion in expected_output; material-shape: one-line spec ref only | GAM **author**; DLA **spec** | **Wire** `buildLdTableFidelityPromptBlock({ role: "dla" })` on DLA; **Ref** in pack; require `type` ∈ table enum |
| **`LD-MATERIALS-COPY`** | “Do not generate full material content”; “specifications only” (×3) | GAM author | **Keep** DLA boundary sentence once; **Remove** repeats |
| **`LD-MATH-RENDER`** | Template + notes TeX blocks (~400 chars) | `LD-MATH-RENDER` | **Remove** pack TeX → **Ref** module |
| **`LD-SELF-DIRECTED-RHETORIC`** | Entire `defaultPromptNotes` scaffolding paragraph (~1.5–2k): worked/faded, misconception, closure, transfer, study_tips caps | Module CORE_LINES | **Remove** notes bulk → **Ref**; optional short DLA rider in lib |
| **PEL orientation / reasoning** | Pack notes + OUTPUT CONTRACT + PEL blocks + activity framing | `LD-PEL-PRESERVE` (planned) | **Consolidate** to field catalog + conditional PEL; drop repeated field definitions |
| **Timeline sequencing** | Pack notes + material-shape + timeline block (shared with GAM) | GAM realise + DLA spec | **Ref** shared block ID; DLA keeps **specification** wording only |

**Estimated pack dedupe savings (§5 only):** **~1.8–2.8k** chars from `defaultPromptNotes` + template TeX/rhetoric echoes (similar magnitude to PR-W2a-1 GAM pack **−564** augmented — DLA seeded pack is larger so augmented delta may be **~400–1,200** chars if runtime unchanged).

---

## 6. Thematic analysis

### 6.1 PEL orientation blocks

| Aspect | Finding |
|--------|---------|
| **Runtime** | `buildPelOrientationContractPromptBlock` appends on DLA when self-directed enrichment IDs active (~12 lines). |
| **Overlap** | Same themes as OUTPUT CONTRACT (`study_orientation`, `intellectual_frame`, `intellectual_coherence_bridge`) and `LD-SELF-DIRECTED-RHETORIC` session journey lines. |
| **DLA-only duty** | Emit non-empty JSON fields on activity rows — not page `overview` (Design Page composes overview from upstream). |
| **Recommendation** | **Keep** PEL blocks conditional; **Consolidate** field requirements into **one** DLA “orientation + reasoning field catalog” appendix; strip duplicate prose from pack notes. |

### 6.2 Output contract bulk

| Block | ~Lines | Issue |
|-------|--------|-------|
| Pack `Output:` activity field list | ~15 | Baseline schema |
| `OUTPUT CONTRACT (self-directed learner page — overrides…)` | ~22 | Re-lists all cognition fields with rules |
| `augmentSelfDirectedDlaDraftOutputSection` pointer | 1 | Injects into pack `Output:` |
| JSON example | ~15 | Good MR-05 pattern |

**Debt:** OUTPUT CONTRACT **overrides** pack output list — model sees **two** schemas. Wave 2b should **merge** into pack `Output:` for self-directed profiles and shrink override to “see LD-SELF-DIRECTED-RHETORIC + field catalog” (**Consolidate**).

### 6.3 Material-shape guidance

| Content | Authority |
|---------|-----------|
| Markdown line breaks, multiline tables in **specifications** | **DLA** — helps GAM parse intent |
| Pipe-table **realisation** | **GAM** — material-shape must not imply DLA authors table bodies |
| `required_materials` table types → GAM | **DLA spec** — **Keep**; align with Inflation fixture types (`classification_table`, `comparison_table`, `analysis_table`, `impact_table`) |

### 6.4 Activity structure guidance

| Content | Recommendation |
|---------|----------------|
| `learner_task` / `expected_output` / `grouping` / `duration_minutes` | **Keep** in pack |
| `activity_interaction_type` + `ordering` for sequencing | **Keep** — ties to timeline block |
| Facilitator vs self-directed field omission | **Keep** — brief-gated in template + OUTPUT CONTRACT |

### 6.5 Learner-facing requirements

| Source | Recommendation |
|--------|----------------|
| Pack: observable verbs, evidence-based `expected_output` | **Ref** → `LD-SELF-DIRECTED-RHETORIC` |
| Activity framing block | **Consolidate** with OUTPUT CONTRACT preamble rules |
| Facilitator ban | **Keep** — DLA-specific gating |

---

## 7. Remaining DLA-specific architectural debt (ranked)

| Rank | Debt | Severity | Wave 2b fix |
|------|------|----------|-------------|
| 1 | ~~**`LD-TABLE-FIDELITY` spec role not appended**~~ | **Resolved** — [38B-W2B-2](38B-W2B-2-dla-table-spec-role.md) | — |
| 2 | Pack **`defaultPromptNotes`** rhetoric duplicates **`LD-SELF-DIRECTED-RHETORIC`** | **HIGH** (signal/noise) | Pack trim PR-W2b-1 |
| 3 | **OUTPUT CONTRACT** + pack output + activity framing **triple** cognition definitions | **MEDIUM** | Consolidate field catalog |
| 4 | Pack **TeX** duplicates **`LD-MATH-RENDER`** | **LOW** | Pack ref only |
| 5 | **Timeline** block duplicated DLA + GAM | **LOW** | Shared ref or DLA spec-only line |
| 6 | **`LD-PEL-PRESERVE`** not extracted — PEL + rhetoric + OUTPUT CONTRACT overlap | **MEDIUM** | Defer module extract to Wave 2b/3 boundary; dedupe prose in 2b |
| 7 | Weak `required_materials.type` for tables (description-only specs) | **HIGH** (38B-4 H5) | Pack + spec module: require typed table materials |
| 8 | Probe under-reports DLA blocks (no `(auto-applied)` on OUTPUT CONTRACT) | **LOW** (governance) | PROBE follow-up — not blocking planning |

---

## 8. B4 and programme gates (read-only)

| Item | Wave 2b contribution |
|------|---------------------|
| [B4-CLOSURE-REVIEW](B4-CLOSURE-REVIEW.md) | **MONITORING** — DLA improves **spec vocabulary**; does not close B4 |
| [38B-6](38B-6-regression-validation-plan.md) L4-07 | GAM upstream — DLA must emit typed `analysis_table` etc. |
| Wave 3 Inflation gate | Depends on GAM + DP; DLA quality reduces ambiguous GAM inputs |
| **38B-6 Wave 2b gate (proposed)** | DLA augmented ≤**17,500** chars (optional); **`LD-TABLE-FIDELITY` marker** on self-directed DLA; pack §5 dedupe; Marx/Inflation DLA fixture: every table activity has typed `required_materials` |

---

## 9. Proposed DLA consolidation plan (implementation preview)

### 9.1 Current vs target structure (self-directed)

**Current:**

```text
Pack §5 (template + heavy defaultPromptNotes)
  + Pedagogic cognition (conditional)
  + Material shape [marker]
  + Activity framing [marker]
  + OUTPUT CONTRACT + JSON example (no marker)
  + Timeline [marker]
  + LD-SELF-DIRECTED-RHETORIC [marker]
  + LD-MATH-RENDER [marker]
  + PEL orientation + reasoning (conditional, not in probe blockTitles*)
```

**Target (Wave 2b — authority-first):**

```text
Pack §5 (slim seed)
  - L0: activity JSON + required_materials spec-only
  - L4: one-line refs: LD-TABLE-FIDELITY (spec), LD-MATERIALS-COPY (GAM author)
  - L5: one-line ref: LD-SELF-DIRECTED-RHETORIC
  - L7: one-line ref: LD-MATH-RENDER
  - Output: single self-directed field catalog (no duplicate list)
  + Pedagogic cognition (conditional, deduped field IDs)
  + LD-TABLE-FIDELITY (spec/dla) [marker] — table type vocabulary
  + LD-DLA-ACTIVITY-SHAPE (proposed) [marker] — material-shape + framing + slim output rules
  + LD-TIMELINE-SEQUENCING or cross-ref (spec side only on DLA)
  + LD-SELF-DIRECTED-RHETORIC [marker]
  + LD-MATH-RENDER [marker]
  + PEL blocks (conditional, unchanged IDs)
```

\*Probe uses `(auto-applied):` suffix — governance should extend probe or document uncounted blocks ([38B-7](38B-7-governance-and-maintenance.md) MR-07).

### 9.2 Append count target

| Metric | Current (probe) | Target | Notes |
|--------|----------------:|-------:|-------|
| Counted markers | **5** | **≤5** (stretch **≤4** with merge) | Merge shape + framing → `LD-DLA-ACTIVITY-SHAPE` optional |
| `LD-TABLE-FIDELITY` on DLA | **0** (marker) | **1** | Spec role required for B4 upstream |
| Pack table lines | Implicit + notes | **1** cross-ref + typed enum | MR-04 |

### 9.3 Authority boundaries (normative)

| Concern | Authoritative | DLA must not |
|---------|---------------|--------------|
| `required_materials[].type` for tables | **DLA** | Emit pipe table **bodies** |
| `specification` text (columns, row counts, unordered events) | **DLA** | Replace GAM Content generation |
| Pipe table bodies | **GAM** | Copy GAM materials into DLA output |
| Cognition JSON fields | **DLA** | Duplicate full text in `specification` |
| Preserve fields on page | **Design Page** | N/A at DLA |

---

## 10. Footprint estimates

| Metric | Chars | Source |
|--------|------:|--------|
| **38B-1 baseline** (pre–Wave 1) | **39,201** | [38B-W1-5](38B-W1-5-wave-1-exit-gate.md) |
| **Wave 1 exit (current)** | **18,054** | Probe 2026-06-04 |
| Pack template + notes (raw) | **6,508** | Probe |
| Seeded (post options) | **3,470** | Probe |
| Runtime delta (augmented − seeded) | **~14,584** | Probe |
| Facilitated DLA | **4,690** | Probe — math only |

### 10.1 Achievable footprint (Wave 2b planning)

| Scenario | Augmented target | Δ vs 18,054 | Assumptions |
|----------|------------------|-------------|-------------|
| **Pack trim only (PR-W2b-1)** | **~17,400–17,900** | **−150–650** | Mirror GAM W2a-1; no runtime merge |
| **Pack + wire `LD-TABLE-FIDELITY` (dla)** | **~17,900–18,200** | **−150 to +150** | +~350 spec module; −pack dupes |
| **Pack + runtime consolidate (shape/framing/OUTPUT)** | **~16,000–17,200** | **−850–2,050** | Implementation PR-W2b-2 — higher regression risk |
| **Aggressive (PEL/rhetoric dedupe + merge blocks)** | **~15,500–16,500** | **−1,550–2,550** | Requires validation on Marx + Inflation DLA fixtures |

**Programme guidance:** Wave 2b success metric = **authority clarity** (spec vs author), not re-hit Wave 1 **−54%**. Likely Wave 2b reduction: **~400–1,200** chars on **pack-only** path; up to **~2k** if OUTPUT CONTRACT consolidation approved.

### 10.2 Production caveat

Inflation Factory briefs with **pedagogic cognition packs** add **`Pedagogic cognition contract`** bulk not always reflected in standard probe. PEL blocks add **~2–2.5k** when enrichment IDs active. Footprint reviews should use **probe + one Factory capture** per [38B-7](38B-7-governance-and-maintenance.md) MR-12.

---

## 11. Recommended implementation sequence

| PR | Scope | Change class | Owner |
|----|-------|--------------|-------|
| **PR-W2b-1** | Pack §5 dedupe only (rhetoric, math, materials boundary refs) | CC-CONTRACT | DLA step owner |
| **PR-W2b-2** | Runtime: append `LD-TABLE-FIDELITY` `{ role: "dla" }` for self-directed DLA | CC-MODULE ref | DLA + materials fidelity |
| **PR-W2b-3** (optional) | Merge material-shape + activity framing + slim OUTPUT CONTRACT | CC-RUNTIME | DLA step owner + LD maintainer |
| **EV-38B4-DLA** (optional) | Capture `learning_activities` JSON — assert table `type` on Inflation A1–A4 | MANUAL | Closes B4 upstream spec path |

**Order:** **PR-W2b-1** → **PR-W2b-2** → validate 38B-6 DLA row → optional **PR-W2b-3**.

**Explicitly out of scope (Wave 2b planning):** `app.js` behaviour change in this document; Design Page; GAM; canonical `lib/ld-*` CORE_LINES edits.

---

## 12. Sign-off

| Item | Status |
|------|--------|
| Wave 2b planning | **COMPLETE** |
| PR-W2b-1 pack trim | **DONE** — notes **−1,769** chars; template +canonical contracts **+253** seeded |
| PR-W2b-2 spec wire | **DONE** — DLA **+1,967** augmented; **6** markers; authority chain active |
| Next programme step | Optional **PR-W2b-3** → **Wave 3** Design Page |

**Cross-reference:** [38B-5](38B-5-workflow-wide-review.md) Wave 2b row updated to point here.
