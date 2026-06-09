# 39S Workstream D — DLA Runtime Trim Decision Audit

**Date:** 2026-06-09  
**Status:** **COMPLETE — decision audit only; no implementation**  
**Type:** Read-only pre-implementation decision audit  
**Sprint:** [Sprint 39](../README.md)  
**Authority:** [sprint-39-handover-pack.md](../sprint-39-handover-pack.md) · [sprint-39-plan.md](../sprint-39-plan.md) · [sprint-39-work-packages.md](../sprint-39-work-packages.md) Package 4 · [39S-0-baseline-prompt-metrics.md](39S-0-baseline-prompt-metrics.md) · [sprint-39-artefact-pathway-inventory.md](../sprint-39-artefact-pathway-inventory.md)  
**Predecessor audits:** [38S-final-dla-residual-architecture-audit.md](../../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-2/38S-final-dla-residual-architecture-audit.md) · [38S-prompt-sanitisation-phase-2b-b-pel-audit.md](../../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-2/38S-prompt-sanitisation-phase-2b-b-pel-audit.md)  
**Metrics source:** [artefacts/EV-39S-DLA-RUNTIME-BASELINE.json](../artefacts/EV-39S-DLA-RUNTIME-BASELINE.json) (re-probed 2026-06-09 post WS-A/B)

---

## Executive summary

Workstreams A (GAM Wave B), B (Design Page hygiene), and C (architecture inventory) are complete with harness green. DLA runtime augmentation on the Step 1 inflation self-directed scenario remains **unchanged at 17,699 chars** (~58% of augmented prompt) since the 38S final audit.

**Recommendation: OPTION B — Close Sprint 39 without Workstream D.**

Bounded Package 4 scope would yield **modest savings on the primary production-chase path** (estimated **0–2,000 chars** augmented; PEL blocks are suppressed when the brief contains `workshop`), while the largest duplication (pack IFP sediment vs runtime OUTPUT CONTRACT) is **explicitly out of scope** and deferred to ARCH-06. The validation burden and cognition-field regression risk outweigh the incremental attention gain at this sprint boundary.

If a future programme pursues DLA prompt debt, combine **ARCH-05 (PEC gate policy)**, **ARCH-06 (pack trim)**, and bounded runtime dedupe in one coordinated pass rather than executing Package 4 in isolation.

---

## 1. Current DLA state

### Measured prompt surface (inflation_self_directed — Step 1 / production chase)

| Metric | Value | Notes |
|--------|------:|-------|
| Pack combined (`promptTemplate` + `defaultPromptNotes`) | **13,983** | Post–38S final sanitisation; unchanged in WS-A/B |
| Seeded (pack in workflow runner) | **12,914** | |
| Augmented (pack + runtime) | **30,613** | |
| **Runtime Δ** | **17,699** | **57.8%** of augmented |
| Augmented vs 38S handover probe (~42,190) | −11,577 | **Seeded-size difference**, not runtime trim — runtime Δ is apples-to-apples identical |

### Runtime augmentation layers (post WS-A/B)

| Layer | Δ chars | Cumulative | Share of runtime Δ |
|-------|--------:|-----------:|-------------------:|
| `self_directed_scaffolds` | **14,512** | 27,426 | **82.0%** |
| `ld_table_fidelity` | 1,967 | 29,393 | 11.1% |
| `math_render` | 1,220 | 30,613 | 6.9% |

**Auto-applied block titles (inflation path):**

1. Self-directed learner-page material shape (auto-applied)
2. Self-directed learner-page activity framing (auto-applied)
3. Self-directed timeline sequencing alignment (auto-applied)
4. LD-SELF-DIRECTED-RHETORIC (auto-applied)
5. LD-TABLE-FIDELITY (auto-applied)
6. LD-MATH-RENDER (auto-applied)

**Not injected on inflation path:** PEL orientation / reasoning (`pecContractIds: []`) — brief goal contains *“workshop”*, which suppresses PEC via `isWorkflowBriefFacilitatedDeliveryIntent()` ([38S PEL audit](../../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-2/38S-prompt-sanitisation-phase-2b-b-pel-audit.md)).

**Episode Plan population block:** Applied at the tail of `applyWorkflowStepRuntimePromptAugmentations` when upstream `episode_plans` exist (~789 chars standalone). The Step 1 probe omits upstream captures, so this layer does not appear in layer deltas — but it remains active in full pipeline runs.

### Current ownership model (frozen 38S — must not contradict)

| Step | Responsibility | DLA-relevant enforcement |
|------|----------------|--------------------------|
| **Episode Plan** | Plans archetype + beat order | Upstream JSON injected at runtime; no replan verbs |
| **DLA** | Populates obligations only | Pack IFP + runtime OUTPUT CONTRACT + population merge/tag |
| **GAM** | Realises material bodies | DLA emits `required_materials` specs; LD-TABLE-FIDELITY spec role |
| **Design Page** | Compose / preserve | Cognition fields preserved via compose contract (WS-B) |
| **Render** | Presentation | LD-MATH-RENDER |

**Code authority (not prompt):**

- `lib/episode-plan-population-contract.js` — `FUNCTION_SPECS`, beat→obligation, depth semantics
- `lib/episode-plan-dla-integration.js` — merge, tagging, PF-11 gate, population prompt block
- Post-capture validators / `ev-38s-production-pipeline-chase.mjs`

### Confirmations

| Assertion | Status | Evidence |
|-----------|:------:|----------|
| **DLA population contract remains authoritative** | ✓ | `applyEpisodePlanDlaPopulationPromptBlockToDraft` retained; merge path in `episode-plan-dla-integration.js` unchanged in WS-A/B |
| **Population-only architecture intact** | ✓ | No replanning ownership reopened; WS-A/B removed PEL from GAM/Page paths only; DLA pack + population block still forbid beat replanning |
| **Package 4 would not touch population contract** | ✓ | [sprint-39-work-packages.md](../sprint-39-work-packages.md) Package 4 OUT list |

---

## 2. Remaining duplication inventory

Scope boundary: Package 4 covers **runtime-only** dedupe — trim PEL on DLA when PEC-active, consolidate material-shape with pack pointers. **Out of scope:** pack §5 rewrites, IFP removal, population contract / merge code ([Package 4](../sprint-39-work-packages.md)).

### 2.1 Remaining runtime augmentation blocks

| Block | ~Size (chars) | In inflation path? | Duplicates | 38S verdict |
|-------|-------------:|:------------------:|------------|-------------|
| Material shape | ~1,450 | ✓ | Pack IFP-09 table/type rows; LD-TABLE-FIDELITY one-liner | **MERGE** |
| Activity framing | ~1,050 | ✓ | OUTPUT CONTRACT field coverage | **MERGE** |
| OUTPUT CONTRACT override | ~2,850 | ✓ | Pack activity schema + PEL semantics | **MERGE** (bounded) |
| OUTPUT CONTRACT example | ~2,200 | ✓ | IFP-09 depth demo; embeds thinness cues in demo strings | **KEEP** (trim only) |
| Timeline sequencing | ~1,522 | ✓ | Unique DLA→GAM cognitive spec | **KEEP** |
| LD-SELF-DIRECTED-RHETORIC (`stepRole: dla`) | **3,534** | ✓ | OUTPUT CONTRACT study_orientation / bridges; session journey | **MERGE** — trim journey |
| LD-TABLE-FIDELITY (spec role) | **1,967** | ✓ | Pack one-line ref only | **KEEP** |
| LD-MATH-RENDER | **1,220** | ✓ | Pack ref | **KEEP** |
| PEL orientation | **965** | ✗ (PEC suppressed) | OUTPUT CONTRACT + LD-SELF-DIRECTED-RHETORIC | **REMOVE on DLA** when PEC active |
| PEL reasoning | **618** | ✗ (PEC suppressed) | OUTPUT CONTRACT cognition rules | **REMOVE on DLA** when PEC active |
| Episode Plan population block | ~789 | Conditional | Unique 38S authority | **KEEP** |

*Sub-block sizes from [38S-final-dla-residual-architecture-audit.md](../../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-2/38S-final-dla-residual-architecture-audit.md) and [EV-39S-DLA-RUNTIME-BASELINE.json](../artefacts/EV-39S-DLA-RUNTIME-BASELINE.json) `standaloneBlockSizes`. The `self_directed_scaffolds` layer (14,512) composes material shape + framing + OUTPUT CONTRACT + example + timeline + rhetoric (~3,534).*

### 2.2 Duplication categories — size / risk / complexity / expected gain

#### A. PEL-related duplication (orientation + reasoning)

| Item | Size | Risk | Complexity | Expected gain |
|------|-----:|:----:|:----------:|-------------:|
| PEL orientation on DLA | 965 | **Low** — Page already deduped (WS-B); OUTPUT CONTRACT is canonical field source | **Low** — mirror GAM-B3 / DP-B7 pattern | **0** on inflation chase; **~965** on PEC-active briefs |
| PEL reasoning on DLA | 618 | **Low** — semantics duplicated in OUTPUT CONTRACT | **Low** | **0** inflation; **~618** PEC-active |
| **Subtotal PEL** | **1,583** | Low | Low | **0–1,583** depending on brief gate |

#### B. Output-contract duplication (framing + override + example)

| Item | Size | Risk | Complexity | Expected gain |
|------|-----:|:----:|:----------:|-------------:|
| Activity framing vs OUTPUT CONTRACT | ~1,050 | **Medium** — preamble/coverage rules may weaken if over-trimmed | **Medium** — must retain one authoritative cognition schema | **400–800** (pointer to OUTPUT CONTRACT) |
| OUTPUT CONTRACT override vs pack IFP-09/10 | ~2,850 | **High** if pack not also trimmed — model may lose field definitions | **High** — pack/runtime coordination required (ARCH-06) | **0–1,200** within Package 4 bounds; **2,000+** only with pack pass |
| OUTPUT CONTRACT example trim | ~2,200 | **Low–Medium** — example is shape anchor | **Low** | **100–300** (demo string hygiene only) |

#### C. Orientation / session-journey duplication

| Item | Size | Risk | Complexity | Expected gain |
|------|-----:|:----:|:----------:|-------------:|
| LD-SELF-DIRECTED-RHETORIC session journey on DLA | 3,534 (full block) | **Medium** — progression/closure cues support multi-activity pages | **Medium** — need DLA-specific rider vs Page/GAM riders | **500–1,200** (trim journey lines; keep field-preservation pointers) |
| Material shape checklist cap (~4 items) vs pack IFP-09 ≥4 verification | ~1,450 | **Medium** — known architecture conflict ([38S residual audit](../../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-2/38S-final-dla-residual-architecture-audit.md) C-table) | **Medium** — requires pack alignment | **300–600** (pointer consolidation only) |

#### D. Non-duplicative runtime (KEEP — not Package 4 targets)

| Item | Size | Rationale |
|------|-----:|-----------|
| LD-TABLE-FIDELITY spec | 1,967 | Unique DLA→GAM pipe-table obligation handoff |
| Timeline sequencing | ~1,522 | Unique cognitive-task alignment for GAM |
| LD-MATH-RENDER | 1,220 | Renderer contract |
| Episode Plan population | ~789 | Unique PF-11 / populate-only authority |

### 2.3 Pack-side duplication (deferred — not Workstream D)

The 38S residual audit identified **~8–12k chars** of pack sediment (IFP replan verbs, DLA-WB-25 session arc, triple gate stack) that **duplicate** runtime obligations but are **OUT of Package 4 scope**. Deferred as **ARCH-06** in [sprint-39-deferred-items.md](../sprint-39-deferred-items.md). Workstream D alone cannot resolve the largest DLA attention-competition source without reopening pack edits.

---

## 3. Risk assessment

### 3.1 Risk of weakening population behaviour

| Factor | Severity | Notes |
|--------|:--------:|-------|
| Trimming OUTPUT CONTRACT / activity framing | **High** if aggressive | Cognition fields (`activity_preamble`, `reasoning_orientation`, etc.) are how DLA emits obligation-rich activities; merge must preserve schema authority |
| Trimming material-shape / IFP pointer misalignment | **Medium** | Checklist cap vs IFP-09 ≥4 verification is a known conflict — careless merge could drop row-quality gates |
| Removing population block or merge path | **N/A** | Out of Package 4 scope — must not occur |
| Pack/runtime split edits without coordination | **High** | Package 4 forbids pack §5 rewrites — runtime-only OUTPUT CONTRACT dedupe risks orphan pointers |

**Mitigation if D were executed:** Keep population block + merge code untouched; one canonical OUTPUT CONTRACT surface; harness + `workflow-ld-episode-plan-step.test.js` + framing adoption tests.

### 3.2 Risk of reintroducing PF-11-adjacent confusion

| Factor | Severity | Notes |
|--------|:--------:|-------|
| Upstream `episode_plans` JSON salience | **Low** if population block kept at tail | WS-A/B did not move injection order |
| Replan language in pack IFP | **Medium** (pre-existing) | Not addressed by D — remains pack debt |
| Dev fallback derive messaging | **Low** | Unchanged |

### 3.3 Risk of removing useful instructional signals

| Factor | Severity | Notes |
|--------|:--------:|-------|
| LD-SELF-DIRECTED-RHETORIC journey trim | **Medium** | Session progression cues help multi-activity self-study pages |
| OUTPUT CONTRACT example | **Low** if only demo strings trimmed | Full removal would weaken JSON shape anchoring |
| PEL removal on PEC paths | **Low** | OUTPUT CONTRACT already defines field semantics; GAM realises via reasoning-materials block |

### 3.4 Validation burden

| Suite | Relevance to D |
|-------|----------------|
| `ev-38s-production-pipeline-chase.mjs` (`fullOk`, `proofOk`, `roleOk`) | **Mandatory** |
| `tests/workflow-ld-episode-plan-step.test.js` | **High** — population / PF-11 |
| `tests/workflow-self-directed-activity-framing-adoption.test.js` | **High** — OUTPUT CONTRACT fields |
| `tests/workflow-pel-orientation.test.js` / `workflow-pel-reasoning.test.js` | **Medium** — PEC-active paths |
| `tests/ld-self-directed-rhetoric.test.js` | **Medium** — DLA rider trim |
| PEC gate matrix (workshop vs self-study briefs) | **High** — inflation vs Marx PEC scenarios |

Estimated engineering cost: **medium** (2–4 focused edits + probe artefact + full regression) for **low primary-path char return**.

---

## 4. Estimated benefit

### 4.1 Reduction scenarios (runtime Δ and augmented)

| Scenario | Scope | Δ runtime | Δ augmented | % of current runtime Δ (17,699) |
|----------|-------|----------:|------------:|--------------------------------:|
| **Conservative** | PEL on PEC paths only + minor example trim | **0** inflation / **~800** PEC | **0 / ~800** | **0% / ~4.5%** |
| **Realistic** | Above + framing pointer + partial rhetoric trim + material-shape pointers | **~1,200–2,000** | **~1,200–2,000** | **~7–11%** |
| **Best case (Package 4 ceiling)** | Full bounded merge without pack IFP rewrite | **~2,500–3,500** | **~2,500–3,500** | **~14–20%** |
| **Best case (38S step 8 + pack — not Package 4)** | Runtime + pack coordination (ARCH-06) | **~3,500–5,000+** | **~5,000–8,000+** | Out of Sprint 39 D scope |

### 4.2 Meaningfulness vs completed workstreams

| Workstream | Primary-path Δ augmented | Primary-path Δ runtime | Architecture value |
|------------|-------------------------:|-----------------------:|-------------------|
| **A — GAM Wave B** | **−117** (27,659 → 27,542) | **−117** | **High** — single self-study marker; PEL off GAM; PRES-08 alignment |
| **A — GAM Wave B (Marx PEC)** | est. **−513** | est. **−513** | PEC-active path cleanup |
| **B — Design Page hygiene** | **−379** (pack-driven) | **0** | **High** — compose-before-VA ordering; PEL off Page; dead code removed |
| **D — Realistic trim** | **~−1,200 to −2,000** | same | **Medium** — incremental dedupe; largest dupes remain in pack |

**Interpretation:**

- Workstream D **realistic** savings are **larger in absolute chars** than A/B on the inflation path, but **smaller as a fraction of remaining debt** (runtime Δ still ~15.7k–16.5k after trim).
- A/B delivered **ownership clarity** (which step owns PEL, which block is authoritative) — gains not fully captured by char counts.
- DLA augmented prompt (**30,613**) remains the **largest** step prompt on the primary pathway after A/B; however, **~82% of runtime** is the `self_directed_scaffolds` blob where **functional** OUTPUT CONTRACT schema dominates — not inert sediment.
- **Primary chase sees zero gain from PEL removal** — the main Package 4 quick win is inactive on inflation workshop runs.

### 4.3 Cost–benefit summary

| Criterion | Assessment |
|-----------|------------|
| Char reduction on production chase | **Low** (0 from PEL; **~1–2k** realistic from merge trim) |
| Architecture clarity | **Medium** — partial; full clarity needs ARCH-06 pack pass |
| Regression risk | **Medium–High** for OUTPUT CONTRACT / framing merges |
| Sprint 39 charter fit | **Optional** — A/B/C satisfy finite optimisation goals |

---

## 5. Recommendation

### **OPTION B — Close Sprint 39 without Workstream D**

### Justification

1. **Charter satisfied.** Sprint 39's mandated outcomes — GAM Wave B runtime clarity, Design Page hygiene, architecture inventory — are complete with harness green. Package 4 is explicitly optional: *“sprint can close without this package if WS-A/B complete and harness green”* ([sprint-39-work-packages.md](../sprint-39-work-packages.md)).

2. **Primary-path ROI is weak.** The production chase scenario (`inflation_self_directed`) suppresses PEC blocks (`pecContractIds: []`), so the lowest-risk Package 4 item (PEL removal on DLA) saves **0 chars** on the path that gates sprint closure. Realistic inflation-path savings (**~1.2–2.0k**, **~4–7%** of augmented DLA) do not materially change the **~58% runtime share** or address pack-side IFP sediment.

3. **Largest duplication is out of scope.** OUTPUT CONTRACT vs pack IFP-09/10 / DLA-WB gate stack accounts for most **semantic** duplication but requires **ARCH-06 pack trim** — deferred and incompatible with Package 4 boundaries. Executing D alone risks partial merges that **increase** pointer fragmentation without coordinated pack edits.

4. **Risk asymmetry.** OUTPUT CONTRACT and activity framing blocks are **functional authority** for cognition-field emission — not inert duplication like removed Page PEL or merged GAM reading/voice blocks. Medium regression risk across population, framing, and PEC test matrices for incremental gain.

5. **A/B already normalised cross-step PEL ownership.** GAM and Design Page no longer inject PEL reasoning/orientation; DLA retains OUTPUT CONTRACT as the canonical cognition schema. Remaining PEL on DLA is **PEC-gated** and **inactive on workshop briefs** — a **policy** question (ARCH-05), not an urgent architecture defect.

6. **Better sequencing exists.** A future pass combining **ARCH-05** (PEC gate review), **ARCH-06** (pack IFP compaction), and bounded runtime dedupe can target **~10–20%** total DLA reduction with coherent pack/runtime pointers — versus **~7–11%** runtime-only in isolation.

### When OPTION A would be justified

Proceed with Workstream D only if:

- The team prioritises **PEC-active briefs** (e.g. Marx self-study) where PEL-on-DLA removal saves **~1,583 chars** at low risk; **and/or**
- There is appetite for a **bounded rhetoric + framing pointer** pass accepting **~1.2–2.0k** inflation-path savings and full regression cost; **and**
- Sprint 39 closure is delayed specifically for DLA prompt debt rather than handing off to a follow-on optimisation sprint.

Absent those conditions, **closure without D** is the evidence-based choice.

---

## 6. Decision record

| Field | Value |
|-------|-------|
| **Decision** | **OPTION B** — Close Sprint 39 without Workstream D |
| **Date** | 2026-06-09 |
| **DLA runtime Δ (baseline)** | 17,699 chars (unchanged post WS-A/B) |
| **Estimated D savings (inflation, realistic)** | ~1,200–2,000 chars augmented |
| **Estimated D savings (PEC-active, PEL only)** | ~1,583 chars |
| **Deferred follow-on** | ARCH-05 + ARCH-06 + coordinated runtime trim |
| **Implementation** | **None** — this document is the deliverable |

---

## References

| Document | Role |
|----------|------|
| [39S-0-baseline-prompt-metrics.md](39S-0-baseline-prompt-metrics.md) | Step 1 DLA baseline |
| [39S-1-gam-wave-b-implementation.md](39S-1-gam-wave-b-implementation.md) | WS-A measured deltas |
| [39S-2-design-page-hygiene.md](39S-2-design-page-hygiene.md) | WS-B measured deltas |
| [sprint-39-artefact-pathway-inventory.md](../sprint-39-artefact-pathway-inventory.md) | WS-C ownership inventory |
| [sprint-39-deferred-items.md](../sprint-39-deferred-items.md) | ARCH-05, ARCH-06 deferrals |
| [38S-final-dla-residual-architecture-audit.md](../../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-2/38S-final-dla-residual-architecture-audit.md) | Duplication taxonomy + step 8 estimate |
| [EV-39S-DLA-RUNTIME-BASELINE.json](../artefacts/EV-39S-DLA-RUNTIME-BASELINE.json) | Frozen metrics artefact |

---

*End of Workstream D decision audit.*
