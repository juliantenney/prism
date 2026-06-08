# 38S — Design Page Post-Sanitisation Architecture Audit (Read Only)

**Date:** 2026-06-08  
**Status:** **COMPLETE — audit only; no prompt, code, or contract changes**  
**Type:** Post-38S ownership review — Design Page (`step_design_page`)  
**Authority:** [38S-continuation-handover-pack.md](./38S-continuation-handover-pack.md) · [38S-phase-2c-page-responsibility-audit.md](../phase-2/38S-phase-2c-page-responsibility-audit.md) · [38S-page-rendering-audit.md](../phase-2/38S-page-rendering-audit.md)  
**Probe:** `scripts/probe-38b1-design-page-prompt-size.js` (2026-06-08)  
**Pack:** `domains/learning-design/domain-learning-design-step-patterns.md` §13 Design Page  
**Runtime:** `app.js` → `applyWorkflowStepRuntimePromptAugmentations` · `lib/ld-design-page-compose-contract.js` · `lib/page-gam-materials-preserve.js`

**Scope boundary:** Architecture and compose-contract alignment only. No pedagogy, PEL depth, teacherly reasoning, or instructional-depth recommendations.

---

## Executive summary

**Question:** After Episode Plan V1, DLA population-only sanitisation, GAM realisation validation, PF-11 remediation, and Page Rendering Phase A, does **Design Page** still hold architecture debt that must be fixed before Sprint 38S closure?

**Answer: No architecture blockers.** Design Page correctly operates as **read-only compose/render assembly**. It does not replan beats, populate obligations, or author GAM material bodies. Post–Phase 2C-a pack language is **strict verbatim** for `activity.materials.*`; manual Inflation evidence shows **GAM bodies largely preserved** to Page JSON, with remaining defects primarily **renderer** (Phase A addressed) or **optional compose metadata** (`activity_preamble`, `materials_order`).

**Residual debt is prompt hygiene and deferred compose metadata — not frozen-architecture violations.**

| Verdict | Detail |
|---------|--------|
| **Ownership alignment** | **Aligned** — compose/preserve only |
| **Cross-step duplication** | **Moderate sediment** — preserve + VA rules repeated 3–5× (~40% of augmented prompt) |
| **Obsolete pre-38S planning** | **Not found** on Design Page (no `episode_plans`, no beat replan) |
| **Closure blocker?** | **No** — defer Design Page pack cleanup until after architecture closure unless Inflation re-run regresses |

---

## Current ownership assessment

### Frozen pipeline role (expected)

| Owner | Responsibility | Design Page must |
|-------|----------------|------------------|
| Episode Plan | Archetype + beat order | **Not** consume or replan |
| DLA | `required_materials` population | **Not** populate obligations |
| GAM | `activity_materials` bodies | **Not** author/realise bodies |
| Design Page | Section assembly + merge/preserve | **Yes** — sole scope |
| Renderer (`app.js`) | HTML presentation | **Not** in prompt scope |

### Measured prompt surface (2026-06-08 probe)

| Layer | Chars | Notes |
|-------|------:|-------|
| Pack `promptTemplate` | 9,519 | Post–2C-a strict verbatim + FORBIDDEN collapse examples |
| Pack `defaultPromptNotes` | 1,783 | Duplicates preserve + VA requirements |
| Seeded (self-directed) | 9,349 | |
| **Augmented (self-directed)** | **27,092** | Δ +17,743 runtime |
| LD-DESIGN-PAGE-COMPOSE + L4 embed | ~6,196 | Canonical compose owner |
| Sprint 38 VA + pedagogical added-value | ~6,601 | Page-root metadata |
| LD-SELF-DIRECTED-RHETORIC (`design_page`) | ~3,726 | Overview/journey; anti-summarise materials |

### Runtime augmentation order (Design Page)

```
Pedagogic cognition (conditional)
→ LD-SELF-DIRECTED-RHETORIC (design_page)
→ LD-TABLE-FIDELITY (GAM-only path — no standalone on Page)
→ LD-MATERIALS-COPY (GAM-only path — preserve via compose embed)
→ PEL orientation/reasoning (non-workshop only)
→ Sprint 38 visual affordance + pedagogical added-value
→ LD-DESIGN-PAGE-COMPOSE-CONTRACT (+ embedded L4 preserve)
→ LD-MATH-RENDER
```

**Compose contract still appends after Sprint 38 block** — attention competition remains (Phase 2C-b reorder not implemented).

### Post-capture compose (code — not prompt)

| Module | Role | Architecture fit |
|--------|------|------------------|
| `applyPageCompositionValidationForCapturedPage` | Cognition merge + closure | **OK** |
| `applyGamMaterialsToComposedPage` | Overlay GAM bodies when page thins | **Backstop** — not primary manual-workflow fix |
| `buildMaterialRoleIndex` | Sets `material_role_index` post-merge | **Correct** — code authority, not LLM |
| `applyA3MaterialsSequencingToComposedPage` | `materials_order` for A3 Analyse only | **Partial** — not generalised to all LO activities |

### Evidence since Phase 2C-a

| Source | Finding |
|--------|---------|
| [38S-page-rendering-audit.md](../phase-2/38S-page-rendering-audit.md) | Page JSON carries full GAM type-nested materials; collapse largely resolved |
| `EV-38S-AFTER-4` harness | `fullOk: true` through Page replay path |
| Phase A renderer fixes | Ordering, M-id headings, table unwrap — **renderer**, not Design Page prompt |
| Inflation capture (2026-06-08) | No `activity_preamble` / PEL orientation fields — **upstream DLA + compose copy gap**, not role confusion |

---

## Findings table

| ID | Finding | Severity | Class | Evidence |
|----|---------|----------|:-----:|----------|
| **DP-01** | Design Page task framed as read-only compose; no redesign pedagogy | — | **E** | Pack §13: *“read-only composition step; do not redesign pedagogy”* |
| **DP-02** | Context inputs: `learning_activities`, `activity_materials`, `learning_sequence` — **no `episode_plans`** | — | **E** | Pack `promptTemplate` Context line; policy `requiresAnyOf` |
| **DP-03** | No beat replanning, archetype selection, or `required_materials` authoring | — | **E** | No IFP/episode language in §13 |
| **DP-04** | No GAM realisation ownership — merge/preserve only | — | **E** | *“GAM authors bodies”* absent; LD-MATERIALS-COPY **preserve** role only |
| **DP-05** | Phase 2C-a strict verbatim implemented — no `near-verbatim` / shorten-non-essential on materials | Low | **E** | Pack FORBIDDEN inflation-collapse list; *“Do not shorten activity.materials.*”* |
| **DP-06** | ACTIVITY MEMBERSHIP rule correct: `(U \ X) ⊆ C`; `learning_sequence` timing/order only | — | **E** | Pack + `LD-DESIGN-PAGE-COMPOSE-CONTRACT` |
| **DP-07** | Materials preservation triplicated: pack + `defaultPromptNotes` + `runnerInstructions.what_to_check` + compose + L4 embed | Medium | **B** | ~15k preserve-intent chars; signal competition |
| **DP-08** | Sprint 38 VA rules inline in pack **and** ~6.6k runtime block | Medium | **B** | Pack VISUAL AFFORDANCES paragraph + runtime contract |
| **DP-09** | Runtime order: Sprint 38 VA **before** `LD-DESIGN-PAGE-COMPOSE-CONTRACT` | Medium | **B** | `app.js` ~9943–9948; 2C-b reorder deferred |
| **DP-10** | `buildSelfDirectedLearnerPageDesignPageFieldPreservationBlock()` defined but **never injected** | Low | **B** | `app.js` ~9377; field rules live in compose contract |
| **DP-11** | PEL orientation/reasoning injected on non-workshop Design Page | Low | **B** | Duplicates DLA OUTPUT CONTRACT / overview duties |
| **DP-12** | `materials_order` **not** in pack or `defaultOutputStructure` | Medium | **C** | No grep hits in §13; DLA/EP set via population contract; A3 helper only |
| **DP-13** | `material_role_index` set **post-capture** by `page-gam-materials-preserve.js`, not prompt | Low | **C** | Correct split: code owns render precedence when GAM synced |
| **DP-14** | `activity_preamble` / cognition fields listed for preservation but often absent on Inflation Page JSON | Medium | **C** | Rendering audit §4; upstream DLA population — not Page planning |
| **DP-15** | VA metadata (`visual_affordance_schema_version`, `activities_visual_review`) may land in `sections[]` | Low | **C** | Page rendering audit; renderer Phase A mitigates leakage |
| **DP-16** | `applyGamMaterialsToComposedPage` merge is partial backstop — synopsis-shaped bodies may skip overlay | Medium | **C** | Phase 2C audit §4; code path, not pack architecture violation |
| **DP-17** | Task frame *“readable, self-contained page”* coexists with strict verbatim | Low | **B** | Residual readability cue; outweighed by 2C-a FORBIDDEN list |
| **DP-18** | `LD-SELF-DIRECTED-RHETORIC` `design_page` rider: overview/journey + anti-summarise materials | — | **E** | Correct Page-owned rhetoric; not GAM body authoring |
| **DP-19** | Overview / `learning_purpose` synthesis — legitimate Page compose (not materials bodies) | — | **E** | Distinct from GAM/DLA material ownership |
| **DP-20** | Augmented prompt ~27k chars — attention decay risk for LLM manual Copy | Medium | **B** | Probe 2026-06-08; hygiene not architecture |

**Class legend:** **A** Architecture blocker · **B** Closure-relevant cleanup · **C** Deferred compose work · **D** Deferred pedagogy · **E** No action required

**Architecture blockers (A): none identified.**

---

## Audit focus — detailed answers

### 1. Page ownership alignment

Design Page **does** operate as compose/render:

- Assembles `sections[]`, membership, assessment_check, page-root VA metadata.
- Merges `activity_materials` → `activity.materials` with verbatim preservation rules.
- Does **not** instruct beat replanning, obligation population, or GAM body generation.

**Does not** attempt planning, population, or GAM realisation. **Borderline:** overview/`learning_purpose` synthesis and learner-profile framing — **valid Page compose**, not Episode Plan or DLA beat work.

**Pedagogic enhancement:** PEL blocks on non-workshop briefs add session-journey language to Page — **duplicate of DLA/Page orientation split** (class **B**, not a role violation).

### 2. Responsibility duplication

| Duplicated from | Present on Design Page? | Verdict |
|-----------------|-------------------------|---------|
| Episode Plan (beats, archetypes) | **No** | **E** |
| DLA (obligation population, `required_materials`) | **No** | **E** |
| GAM (GAM-PRES body floors, material authoring) | **No** — preserve refs only | **E** |
| DLA cognition field definitions | **Preserve-only** pointers | **E** |
| GAM table/material copy | **L4 preserve embed** — correct handoff | **E** (dedupe wording **B**) |

**Obsolete after 38S:**

- Pre-2C-a `near-verbatim` / shorten clauses — **removed** (DP-05).
- No residual IFP / session-arc / archetype language in §13.

### 3. Compose contract review

| Contract element | Pack expectation | Code/post-capture | Gap |
|------------------|------------------|-------------------|-----|
| **Materials verbatim** | Strict; FORBIDDEN collapse shapes | `LD-DESIGN-PAGE-COMPOSE` + L4 embed; `design-page-materials-fidelity.js` | **Aligned** post–2C-a |
| **`materials_order`** | Not specified | DLA `required_materials` order in population contract; A3 compose helper only; renderer type-bucket fallback (Phase A) | **C** — optional compose enrichment |
| **`material_role_index`** | Not specified | `page-gam-materials-preserve.js` after GAM merge | **C/E** — code-owned; prompt omission OK |
| **`activity_preamble`** | Preserve when upstream present | DLA notes require; Inflation capture often empty | **C** — upstream + copy, not Page replan |
| **Metadata (VA)** | Page-root keys required | May also appear in `sections[]` | **C** + renderer fix |
| **GAM body preservation** | Hard verbatim | Post-capture merge + harness green | **Working**; merge heuristics partial |

### 4. Prompt surface review

| Category | Examples | Class |
|----------|----------|:-----:|
| **Obsolete rules** | `near-verbatim`, materials shorten — **gone** post–2C-a | **E** |
| **Duplicated rules** | Preserve ×3; VA ×2; membership in pack + compose | **B** |
| **Contradictory rules** | *Readable* vs strict verbatim — **weak** after FORBIDDEN list | **B** (low) |
| **Dead instructions** | Unused `buildSelfDirectedLearnerPageDesignPageFieldPreservationBlock` | **B** |
| **Legacy pre-38S** | No episode-plan or DLA-planning sediment in §13 | **E** |

### 5. Closure relevance classification summary

| Class | Count | Must fix before 38S closure? |
|-------|------:|:----------------------------:|
| **A** Architecture blocker | 0 | — |
| **B** Closure-relevant cleanup | 6 | **Optional** — prompt hygiene; not in closure criteria |
| **C** Deferred compose work | 4 | **No** — post-closure or next compose tranche |
| **D** Deferred pedagogy | 0 | **No** (explicitly out of scope) |
| **E** No action required | 10 | — |

---

## Closure impact assessment

Sprint 38S closure criteria ([continuation handover](./38S-continuation-handover-pack.md)) require:

1. Page Rendering Phase A — **renderer** (complete in implementation tranche).
2. GAM Wave A — **GAM pack** (outstanding).
3. Manual Inflation re-run — end-to-end validation.
4. No open **High** Page defects (PAGE-01/02/06) — **renderer**.
5. Architecture closure note.

**Design Page prompt debt does not appear in closure criteria.** Evidence supports:

- **GAM → Page body preservation** is working at architecture level (rendering audit, harness).
- **Design Page does not violate** frozen Episode Plan / DLA / GAM boundaries.
- Remaining gaps (`activity_preamble`, `materials_order`, VA section placement) are **compose metadata** and **renderer** concerns — mitigated by Phase A renderer fallback and post-capture `material_role_index` when GAM is synced.

**Risk if deferred:** LLM manual Copy may still produce valid JSON while under-populating optional metadata fields; **not** a frozen-architecture regression if materials bodies remain verbatim.

**Recommendation:** **Proceed to Sprint 38S closure** without a Design Page implementation pass. Schedule Design Page **pack dedupe + compose-before-VA reorder** as **post-closure hygiene** (class **B**) unless Inflation re-run shows materials collapse recurrence.

---

## Recommended actions (audit only — not implemented)

### If pursuing before closure (optional, low priority)

| Priority | Action | Class | Risk |
|----------|--------|:-----:|:----:|
| 1 | Trim `defaultPromptNotes` + `runnerInstructions.what_to_check` to pointers (no second preserve essay) | **B** | Low |
| 2 | Remove inline Sprint 38 VA prose from pack; retain one-line runtime ref | **B** | Low |
| 3 | Delete or wire `buildSelfDirectedLearnerPageDesignPageFieldPreservationBlock` | **B** | Low |

### Defer until after architecture closure

| Action | Class | Notes |
|--------|:-----:|-------|
| Reorder runtime: compose contract before Sprint 38 VA | **B** | 2C-b; test VA still emitted |
| Generalise `materials_order` compose from episode plan / DLA order | **C** | Phase B; renderer fallback exists |
| Strengthen `activity_preamble` upstream on DLA + Page copy enforcement | **C** | Not closure gate |
| Extend `page-gam-materials-preserve` merge for generic teaching keys | **C** | Code backstop only |
| Remove PEL orientation/reasoning from Design Page augmentation | **B** | Dedupe; workshop already gated |

### Explicitly not recommended in this tranche

- Episode Plan, DLA, GAM pack, population contract, or workflow chaining changes.
- Pedagogy / depth / PEL enhancement programmes.
- Page Phase B implementation **unless** Inflation re-run proves materials collapse — **not** indicated by current evidence.

---

## Verification references

```bash
node scripts/probe-38b1-design-page-prompt-size.js
node --test tests/ld-design-page-compose-contract.test.js
node --test tests/design-page-materials-fidelity.test.js
node --test tests/page-38s-phase-a-render-fixes.test.js
```

**Related artefacts:** [38S-phase-2c-page-responsibility-audit.md](../phase-2/38S-phase-2c-page-responsibility-audit.md) · [38S-page-rendering-audit.md](../phase-2/38S-page-rendering-audit.md) · `lib/ld-design-page-compose-contract.js` · `lib/page-gam-materials-preserve.js` · `lib/page-a3-materials-sequencing.js`

---

*End of Design Page post-sanitisation architecture audit (read-only).*
