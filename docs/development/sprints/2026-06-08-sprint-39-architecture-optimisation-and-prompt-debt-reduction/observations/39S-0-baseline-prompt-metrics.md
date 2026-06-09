# 39S Step 1 — Baseline Prompt Metrics

**Date:** 2026-06-09  
**Status:** **COMPLETE — read-only baseline; no code or prompt changes**  
**Type:** Pre-implementation measurement  
**Sprint:** [Sprint 39 — Architecture optimisation and prompt debt reduction](../README.md)  
**Authority:** [sprint-39-handover-pack.md](../sprint-39-handover-pack.md) · [sprint-39-plan.md](../sprint-39-plan.md) · [sprint-39-work-packages.md](../sprint-39-work-packages.md)  
**Probe:** `scripts/probe-39s-baseline-prompt-metrics.mjs` (vm load of `app.js` + LD libs; inflation self-directed workshop brief)

---

## Executive summary

Sprint 39 Step 1 establishes the **authoritative before-state** for optimisation work. All three workflow steps were probed under the same `inflation_self_directed` scenario used in 38S audits.

**Headline:** Pack sizes are **unchanged from 38S closure** (GAM post–Wave A, DLA post–final sanitisation, Design Page stable). **Runtime augmentation deltas are the primary apples-to-apples metric** — GAM runtime is at the low end of the 38S range; Design Page runtime grew modestly (+815 chars); DLA runtime is **unchanged** at 17,699 chars.

**GAM Wave B** should target the **self-directed scaffolds layer** (~11.3k chars, 90% of GAM runtime) — specifically reading sufficiency + material voice + timeline merge, inactive PEL reasoning removal, and PEL reasoning materials block rewrite/removal.

---

## Measurement methodology

| Parameter | Value |
|-----------|-------|
| Scenario | `inflation_self_directed` — `delivery_context: self_directed`, `learning_environments: [self_study]` |
| Pack source | `domain-learning-design-step-patterns.md` Prompt Factory JSON (§5 DLA, §6 GAM, §13 Design Page) |
| Seeded prompt | `buildSeededStepPromptForWorkflowStep` (pack template + notes + workflow seeding) |
| Augmented prompt | `applyWorkflowStepRuntimePromptAugmentations` (production augmentation path) |
| Runtime Δ | `augmentedChars − seededChars` |
| Layer attribution | Incremental application of augmentation helpers (orthogonal to production order; used for contributor ranking) |

**Note on augmented totals vs 38S closure:** 38S handover cites **full augmented** sizes that included a **larger pre-sanitisation DLA seeded prompt** (~24,491 chars) and **pre–Wave A GAM seeded prompt** (~20k chars). After 38S pack work, **seeded prompts shrank** while **runtime deltas stayed stable**. Comparisons below separate pack, seeded, augmented, and runtime Δ.

---

## Current measurements (2026-06-09)

### Summary table

| Step | Pack combined | Seeded | Augmented | Runtime Δ | Runtime % of augmented |
|------|-------------:|-------:|----------:|----------:|-----------------------:|
| **GAM** | 15,712 | 15,145 | **27,659** | **12,514** | 45.2% |
| **Design Page** | 11,302 | 9,349 | **27,907** | **18,558** | 66.5% |
| **DLA** | 13,983 | 12,914 | **30,613** | **17,699** | 57.8% |

### Pack breakdown

| Step | `promptTemplate` | `defaultPromptNotes` | Pack combined |
|------|-----------------:|---------------------:|--------------:|
| GAM | 15,241 | 471 | 15,712 |
| Design Page | 9,519 | 1,783 | 11,302 |
| DLA | 13,189 | 794 | 13,983 |

### Artefacts

| Step | File |
|------|------|
| GAM | [artefacts/EV-39S-GAM-RUNTIME-BASELINE.json](../artefacts/EV-39S-GAM-RUNTIME-BASELINE.json) |
| Design Page | [artefacts/EV-39S-DESIGN-PAGE-BASELINE.json](../artefacts/EV-39S-DESIGN-PAGE-BASELINE.json) |
| DLA | [artefacts/EV-39S-DLA-RUNTIME-BASELINE.json](../artefacts/EV-39S-DLA-RUNTIME-BASELINE.json) |

---

## Comparison against Sprint 38S closure values

### GAM

| Metric | 38S closure | 39S baseline | Δ | Interpretation |
|--------|-------------:|-------------:|--:|----------------|
| Pack combined | 15,712 (post–Wave A) | 15,712 | 0 | Pack frozen ✓ |
| Augmented (SD) | 32,692–35,349 | 27,659 | −5,033 to −7,690 | **Expected** — Wave A pack reduction flows through seeded base |
| Runtime Δ | 12,514–15,171 | 12,514 | at floor | **Stable** — Wave B target surface unchanged |

GAM augmented dropped ~5–8k chars **because seeded shrank after Wave A**, not because runtime augmentation was trimmed. Runtime contribution remains **~12.5k chars (45% of augmented prompt)**.

### Design Page

| Metric | 38S closure | 39S baseline | Δ | Interpretation |
|--------|-------------:|-------------:|--:|----------------|
| Pack combined | 11,302 | 11,302 | 0 | Pack frozen ✓ |
| Pack template | 9,519 | 9,519 | 0 | |
| Pack notes | 1,783 | 1,783 | 0 | |
| Augmented (SD) | 27,092 | 27,907 | **+815** | Modest growth — see contributors |
| Runtime Δ | 17,743 | 18,558 | **+815** | Likely `LD-DESIGN-PAGE-COMPOSE-CONTRACT` growth (6,208 → 7,011 standalone) |

Design Page pack is unchanged; **runtime grew ~4.6%** since 38S Phase 2C probe. Hygiene work (Package 2) should recover this and more via dedupe.

### DLA

| Metric | 38S closure | 39S baseline | Δ | Interpretation |
|--------|-------------:|-------------:|--:|----------------|
| Pack combined | 13,983 (post–final sanitisation) | 13,983 | 0 | Pack frozen ✓ |
| Seeded | ~24,491 (pre-final pack) | 12,914 | −11,577 | Final sanitisation effect |
| Augmented (SD) | 42,190 | 30,613 | −11,577 | Tracks seeded shrink; **not** a runtime trim |
| Runtime Δ | 17,699 | 17,699 | 0 | **Stable** — optional Sprint 39 trim target unchanged |

The 42,190 figure in 38S handover was **pack 24,491 seeded + 17,699 runtime** (pre-final sanitisation seeded size). Post-sanitisation **total augmented is now 30,613** with **identical runtime debt**.

---

## Largest remaining runtime contributors

### GAM — runtime Δ 12,514 chars

**Augmentation layers (production path):**

| Layer | Δ chars | Cumulative | Share of runtime |
|-------|--------:|-----------:|-----------------:|
| `self_directed_scaffolds` | **11,294** | 26,439 | **90.3%** |
| `math_render` | 1,220 | 27,659 | 9.7% |

**Auto-applied block titles (in augmented prompt):**

1. LD-TABLE-FIDELITY (auto-applied)
2. Self-directed learner-page reading sufficiency (auto-applied)
3. Self-directed learner-page material voice (auto-applied)
4. Self-directed timeline sequencing alignment (auto-applied)
5. LD-SELF-DIRECTED-RHETORIC (auto-applied)
6. LD-MATH-RENDER (auto-applied)

**Standalone block sizes (GAM-relevant helpers):**

| Block | Chars | Wave B relevance |
|-------|------:|------------------|
| `ld_self_directed_rhetoric_gam` | 3,534 | Keep — correct scope; trim only if rhetoric overlaps merged marker |
| `ld_table_fidelity_author` | 2,693 | **Keep** — pack ref + runtime author; no dedupe |
| `gam_pel_reasoning_materials` | 2,039 | **Rewrite or remove** — thinness cues (*short*, *concise*) |
| `ld_materials_copy_preserve` | 3,238 | Not GAM-author path — listed for cross-step context |
| `gam_learner_voice` | 1,406 | **Merge** into combined self-study marker |
| Reading sufficiency (embedded) | ~2,500–3,000 (est.) | **Merge** — preserve depth bullets |
| Timeline alignment (embedded) | ~1,500 (est.) | **Merge** |
| `ld_math_render` | 1,220 | Keep |
| `pel_orientation` / `pel_reasoning` | 965 / 618 | **Not auto-applied on GAM** — verify no silent injection; remove if path reopens |

**PEC contract IDs:** `[]` (empty — PEC pedagogic enrichment gate inactive for this scenario).

---

### Design Page — runtime Δ 18,558 chars

**Augmentation layers:**

| Layer | Δ chars | Cumulative | Share of runtime |
|-------|--------:|-----------:|-----------------:|
| `design_page_compose` | **7,011** | 26,687 | **37.8%** |
| `sprint38_visual_affordance` | **6,601** | 19,676 | **35.6%** |
| `self_directed_scaffolds` | 3,726 | 13,075 | 20.1% |
| `math_render` | 1,220 | 27,907 | 6.6% |

**Auto-applied block titles:**

1. LD-SELF-DIRECTED-RHETORIC (auto-applied)
2. Sprint 38 visual affordance authoring contract (auto-applied)
3. Sprint 38 pedagogical added-value contract (auto-applied)
4. LD-DESIGN-PAGE-COMPOSE-CONTRACT (auto-applied)
5. LD-MATH-RENDER (auto-applied)

**Hygiene targets (Package 2 — not Wave B):**

| Block | Chars | Action |
|-------|------:|--------|
| `ld_design_page_compose` / materials fidelity | 7,011 | Keep semantics; dedupe pack preserve essays |
| `sprint38_va_design_page` | 6,601 | Keep emission; remove inline pack VA prose |
| `ld_self_directed_rhetoric_design_page` | 3,534 | Keep anti-summarise rider |
| `pel_orientation` / `pel_reasoning` | 965 / 618 | Remove from Design Page path (dedupe DLA OUTPUT CONTRACT) |
| Dead `buildSelfDirectedLearnerPageDesignPageFieldPreservationBlock` | — | Delete or wire |

**Runtime ordering issue (38S audit DP-09):** VA block currently precedes compose contract in attention order — reorder compose before VA in `applyWorkflowStepRuntimePromptAugmentations`.

---

### DLA — runtime Δ 17,699 chars (optional Package 3)

**Augmentation layers:**

| Layer | Δ chars | Cumulative | Share of runtime |
|-------|--------:|-----------:|-----------------:|
| `self_directed_scaffolds` | **14,512** | 27,426 | **82.0%** |
| `ld_table_fidelity` | 1,967 | 29,393 | 11.1% |
| `math_render` | 1,220 | 30,613 | 6.9% |

**Auto-applied block titles:**

1. Self-directed learner-page material shape (auto-applied)
2. Self-directed learner-page activity framing (auto-applied)
3. Self-directed timeline sequencing alignment (auto-applied)
4. LD-SELF-DIRECTED-RHETORIC (auto-applied)
5. LD-TABLE-FIDELITY (auto-applied)
6. LD-MATH-RENDER (auto-applied)

**38S residual audit verdicts (runtime only):**

| Block | ~Chars | Verdict |
|-------|-------:|---------|
| Self-directed scaffolds (material shape + framing + OUTPUT CONTRACT) | ~14,512 | **MERGE** — duplicates pack IFP-09/10 |
| LD-TABLE-FIDELITY (spec) | 1,967 | **KEEP** |
| LD-SELF-DIRECTED-RHETORIC | 3,534 | **MERGE** — trim session journey on DLA |
| LD-MATH-RENDER | 1,220 | **KEEP** |
| PEL orientation / reasoning | 965 / 618 | **REMOVE on DLA** (not in current auto-applied list — confirm path) |

DLA runtime trim is **optional** in Sprint 39; baseline confirms **17,699 chars** unchanged since 38S audit.

---

## Recommended optimisation targets — GAM Wave B

Authority: [38S-final-gam-cleanup-audit.md](../../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-2/38S-final-gam-cleanup-audit.md) § Wave B · [sprint-39-work-packages.md](../sprint-39-work-packages.md) Package 1

### Priority order

| ID | Target | Est. saving | Risk | Notes |
|:--:|--------|------------:|:----:|-------|
| **GAM-B2** | Merge reading sufficiency + material voice + timeline into single self-study materials marker | **~500+** net | Low | Preserve all depth bullets; GAM-PRES-08 back-ref required |
| **GAM-B3** | Remove `buildPelReasoningContractPromptBlock` from GAM augmentation path | **~600** | Low | Dup of DLA OUTPUT CONTRACT pointer |
| **GAM-B4** | Rewrite or remove `buildSelfDirectedGamPelReasoningMaterialPromptBlock` (2,039 chars standalone) | **~1,500–2,000** if removed | Med | Must not leave thinness cues; if retained, PRES-08 back-refs only |
| **GAM-B5** | Verify single `LD-MATERIALS-COPY` / `LD-TABLE-FIDELITY` injection | 0 (guard) | Low | Dedup guard behaviour unchanged |
| — | **Do not trim** `LD-TABLE-FIDELITY` author body | — | — | Required for table realisation |
| — | **Do not trim** `LD-MATH-RENDER` | — | — | Renderer contract |
| — | **Defer** `LD-SELF-DIRECTED-RHETORIC` major rewrite | — | — | Correct GAM scope; merge interaction only |

### Projected post–Wave B (conservative)

| Metric | 39S baseline | Wave B target (A+B from 38S audit) |
|--------|-------------:|-----------------------------------:|
| GAM pack | 15,712 | 15,712 (unchanged) |
| GAM augmented | 27,659 | **~24,500–26,500** |
| GAM runtime Δ | 12,514 | **~9,500–10,500** (−2,000 to −3,000) |

**Validation floor:** augmented reduction ≥500 chars (conservative) or documented justification; `tests/workbook-contract-prompt-surface.test.js`; `ev-38s-production-pipeline-chase.mjs` `fullOk: true`; GAM-PRES-07/08/09/10 semantics preserved.

### Out of scope for Wave B

- GAM pack §6 `promptTemplate` edits
- PEC workshop gate logic
- `gam-output-format.js` validator changes
- Episode Plan / DLA / Design Page packs
- Pedagogy / North Star depth expansion

---

## Next steps

| Step | Work package | Depends on |
|:----:|--------------|------------|
| 2 | **GAM Wave B implementation** (GAM-B1–B6) | This baseline ✓ |
| 3 | Design Page hygiene (DP-B1–B8) | Baseline ✓ (DP-B1 satisfied by `EV-39S-DESIGN-PAGE-BASELINE.json`) |
| 4 | Architecture inventory | Parallel |
| 5 | Optional DLA runtime trim | Baseline ✓ |

**Do not implement Wave B until this observation is accepted as the Sprint 39 before-state.**

---

## Related artefacts

- [38S-architecture-closure-note.md](../../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-3/38S-architecture-closure-note.md)
- [EV-38S-WAVE-A-gam-prompt-metrics.json](../../2026-06-06-sprint-38s-episode-plan-v1-implementation/artefacts/EV-38S-WAVE-A-gam-prompt-metrics.json)
- [EV-38S-final-dla-prompt-metrics.json](../../2026-06-06-sprint-38s-episode-plan-v1-implementation/artefacts/EV-38S-final-dla-prompt-metrics.json)
- [38S-final-gam-cleanup-audit.md](../../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-2/38S-final-gam-cleanup-audit.md)
- [38S-phase-2c-page-responsibility-audit.md](../../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-2/38S-phase-2c-page-responsibility-audit.md)
- [38S-final-dla-residual-architecture-audit.md](../../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-2/38S-final-dla-residual-architecture-audit.md)
