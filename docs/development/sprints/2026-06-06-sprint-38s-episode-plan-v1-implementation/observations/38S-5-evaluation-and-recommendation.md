# 38S-5 — Evaluation and recommendation

**Date:** 2026-06-06  
**Status:** **COMPLETE**  
**Type:** Evaluation phase — docs only; no code changes  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38S-5  
**Inputs:** [38S-4 proof execution](38S-4-proof-execution.md) · [38R-4 Proceed/Hold](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-4-proof-validation-design.md) · [38R-5 recommendation](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-5-implementation-recommendation.md) · [38Q-3 gaps](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)  
**Successor:** [38S-6 Closure](38S-6-sprint-closure.md)

---

## Executive summary

**Primary question:**

> Did 38S validate the Episode Plan architecture strongly enough to justify continued implementation?

**Answer: Yes — with high confidence on architecture; fidelity failure is implementation, not design.**

**Recommendation: Proceed after remediation**

Episode Plan V1 and the population contract **delivered the educational outcomes 38Q and 38R predicted** (G3/G5/G4 on merged DLA). The sprint **did not** satisfy the fidelity hard gate (Claim D). Root cause is **destructive merge integration** and an **incomplete proof pipeline**, not invalidity of V1 or the plan→obligation model.

**38Q and 38R are not contradicted.** No return to design sprint is warranted unless additive-merge remediation fails a targeted re-proof.

---

## Task 1 — Re-evaluate Claims A–E

| Claim | Result | Confidence | Rationale |
|-------|:------:|:----------:|-----------|
| **A — G3 reduction** | **PASS** | **High** | M-01 100%; T1–T5 Pass on gate set; vs EV-38M ~0% transition coverage ([38S-4](38S-4-proof-execution.md)) |
| **B — G5 reduction** | **PASS** | **High** | M-02/M-03/M-04 100%; M-07 0; plan-ordered tagged obligations vs parallel bundles (GAP-13) |
| **C — G4 reduction** | **PASS** | **High** | M-05 0 on merged lane; raw LLM M-05 34 — contract enforcement required |
| **D — fullOk preserved** | **FAIL** | **High** | EV-38S: fullOk/proofOk/roleOk false; EV-38P baseline true — failure is measured, not inferred |
| **E — No prompt-accretion dependency** | **PASS** | **High** | Raw LLM fails structural gate; plan + merge passes; V1 unchanged; SC-7 preserved at design level |

**Confidence note:** Claim D failure confidence is **high** because the replay artefact and run-log are explicit. Educational claim confidence is **high** because metrics are computed from inspectable JSON, not subjective review. M-06 A4 partial (1.25×) does not weaken A–C — **low** impact on architecture verdict.

---

## Task 2 — Architecture vs implementation assessment

## Architecture vs implementation assessment

| Dimension | Architecture findings | Implementation findings |
|-----------|----------------------|-------------------------|
| **Plan schema** | V1 (`archetype` + ordered `function`) sufficient for A1–A4 + T3-MICRO | Plan derived from LO templates; gate active — **works** |
| **Transition coverage** | T1–T5 expressible and **achieved** on merged DLA (100%) | T-families not achieved on raw LLM without contract |
| **Beat survival** | Every beat maps to ≥1 obligation — **100%** | Merge preserves tags; raw LLM untagged |
| **Order authority** | Beat order = obligation order — **100%** | `materials_order` + `plan_beat_index` populated |
| **Anti-collapse** | AC-01–AC-10 **0 violations** post-merge | Pre-merge: 34 violations |
| **Fidelity path** | 38M–38P machinery **unchanged**; 76/76 suite Pass | EV-38S replay: fullOk false; RF-8; incomplete page |
| **38L coexistence** | Not an architecture concern — depth is DLA/GAM layer | **Replace merge** drops DLA-WB-27/28/31 rows — **implementation bug** |
| **Proof pipeline** | Dual-lane proof design valid (structural + fidelity) | Harness abort + continue-path split — **harness gap** |

### Rule applied

**Implementation defects do not invalidate proven architecture.**

Evidence: raw LLM DLA passes 38L **and** fails 38R-4 educational metrics; merged DLA passes 38R-4 **and** fails 38L. The correct integration must **combine** both — annotate, not replace.

---

## Task 3 — Root-cause review

| Failure | Root cause | Category |
|---------|------------|----------|
| **PF-06 — fullOk regression** | EV-38S page replay incomplete (missing 4 activities); no 38P `applyGamMaterialsToComposedPage` on generated page; dual-lane split | **Harness** + **Implementation** |
| **RF-8 — material_role_index loss** | Generated design-page not merged through 38P compose path; role index never attached | **Harness** + **Implementation** |
| **38L depth loss (A3 WB-27, A4 WB-28/31)** | `mergePopulationScaffoldWithLlmActivity` **replaces** `required_materials[]` with scaffold rows; drops worked analytic pass / independent judgement template types | **Implementation** |
| **38L page preservation fail** | Composed page missing learning_activities section content for all four activities | **Harness** |
| **Harness abort post-merge** | 38L validator runs after destructive merge on single-lane pipeline | **Implementation** |
| **M-06 A4 partial (1.25×)** | EV-38M A4 already had 8 materials; plan OBL-M target 10 — ratio below 1.5× threshold | **Unknown** (metric sensitivity; non-blocking) |
| **KM capture prose-after-fence** | LLM output format | **Prompt** / operational |
| **proofOk false on replay** | Downstream of page incompleteness + 38L preserve fail — not 38M body regression on complete artefact | **Harness** |

### Origin summary

| Source | Failures attributed |
|--------|---------------------|
| **Episode Plan (architecture)** | **None** |
| **Integration behaviour** | 38L depth loss, merge strategy, post-merge gate ordering |
| **Harness / proof execution** | Incomplete page, dual-lane split, missing 38P merge on generated output |
| **Prompt** | KM capture flake (mitigated by seed) |

**Conclusion:** Failures originate from **integration and proof execution**, not from Episode Plan V1 or the population contract design.

---

## Task 4 — Merge strategy assessment

### Current strategy (38S-3)

```text
Episode Plan scaffold  →  REPLACES  →  LLM required_materials[]
```

**Observed:**

| Lane | Educational impact | Fidelity impact |
|------|-------------------|-----------------|
| **Replace (current)** | **Strong** — M-01–M-05 Pass | **Destructive** — 38L Fail; forces dual-lane proof |

### Alternative strategy (recommended)

```text
Episode Plan scaffold  →  ANNOTATES + REORDERS  →  LLM required_materials[]
```

**Proposed behaviour:**

1. Match LLM rows to plan beats by `instructional_function` / purpose / index.  
2. Inject `instructional_function`, `plan_beat_index`, `materials_order` on matched rows.  
3. Insert **missing** plan beats as scaffold-only rows (no type overwrite on matched rows).  
4. Preserve unmatched 38L depth rows (checklist, template, worked analytic pass) as supplementary materials with orphan guard or explicit `supplementary: true` metadata.  
5. Reorder to plan sequence without dropping bodies/types.

| Strategy | Educational impact | Fidelity impact |
|----------|-------------------|-----------------|
| **Replace (current)** | Strong | **Breaks** 38L + compose |
| **Annotate + reorder (proposed)** | **Expected strong** — tags + order from plan; AC rules on tagged set | **Expected preserved** — raw 38L rows survive |

**Assessment:** **Additive merge is sufficient.** No V1 change, no DLA object redesign, no prompt expansion required. This aligns with [38R-3 Mostly B](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-3-plan-to-dla-mapping.md) — obligation metadata + gate, not activity redesign.

---

## Task 5 — Re-proof requirement

| Option | Description | Confidence | Cost |
|--------|-------------|:----------:|:----:|
| **A — No re-proof** | Close on educational lane only | **Low** — Claim D blocking per [38R-4](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-4-proof-validation-design.md) | None |
| **B — Targeted re-proof** | Fix additive merge; single-lane harness; re-run EV-38S-AFTER-2 through DLA→GAM→Page→replay | **High** — isolates fix; sufficient for Claim D | **Medium** — one LLM pipeline + replay |
| **C — Full replay** | Re-run from KM/LC + full workbook | **High** but unnecessary | **High** |

### Recommendation: **Option B — Targeted re-proof**

**Minimum evidence before production readiness:**

1. Single-lane `EV-38S-AFTER-2` (or equivalent) — no dual-lane split.  
2. Merged DLA passes **both** `validateLearningActivitiesPopulationContract` **and** `validateDla38LObligations`.  
3. Full harness: DLA → GAM → Page → `applyGamMaterialsToComposedPage` → `ev-38s-proof-replay.mjs`.  
4. **fullOk: true**, RF-1..RF-8 Pass, 58/58 Pass.  
5. M-01–M-05 remain Pass (regression check on educational lane).

Educational proof from 38S-4 **does not need repeating** if merge fix is verified by unit/integration tests plus item 5 on re-run.

---

## Task 6 — Production readiness assessment

| Area | Status | Notes |
|------|:------:|-------|
| **Episode Plan V1** | **Ready** | Frozen; A1–A4 + T3-MICRO validated |
| **Population contract** | **Needs remediation** | Logic correct; merge function must become additive |
| **DLA integration** | **Needs remediation** | Gate + prompt block OK; post-capture merge destructive |
| **Proof framework** | **Ready** | Metrics, evaluation, replay scripts exist |
| **Educational improvement** | **Ready** (evidenced) | G3/G5/G4 reduced vs EV-38M on merged lane |
| **Fidelity preservation** | **Not ready** | fullOk false on EV-38S; not a machinery regression |

---

## Task 7 — Recommendation

### Verdict: **Proceed after remediation**

| Option | Selected? | Evidence |
|--------|:---------:|----------|
| **Proceed** (unconditional) | No | Claim D Fail — [38R-4 Hold](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-4-proof-validation-design.md) criteria 1, 6 |
| **Proceed after remediation** | **Yes** | Architecture validated; failure localized to merge + harness |
| **Hold** (indefinite) | No | No architecture contradiction |
| **Return to design** | No | 38Q Option F and 38R V1 stand; no new primitives justified |

### Justification

1. **38S validated the core hypothesis:** ordered Episode Plan → traceable obligations reduces G3/G5/G4 — **demonstrated**, not theorised.  
2. **Fidelity failure is not architectural:** 58/58 Pass; EV-38P machinery intact; failure is artefact/pipeline completion + replace merge.  
3. **38R-5 "Proceed with constraints" remains correct** — constraint is now **additive merge + targeted re-proof**, not schema change.  
4. **38Q is not contradicted** — worksheet-oriented collapse is reversed on merged DLA; fidelity path was always a separate lane in 38R-4.

---

## Task 8 — Minimum remediation plan

## Minimum remediation plan

**Scope:** Smallest corrective action before closure. **No V1 redesign. No DLA object redesign. No prompt expansion.**

### R1 — Additive merge (Critical)

**File:** `lib/episode-plan-dla-integration.js` — `mergePopulationScaffoldWithLlmActivity`

| Step | Action |
|------|--------|
| 1 | Match existing LLM materials to plan beats; apply tags + reorder |
| 2 | Insert scaffold rows **only** for beats with no LLM match |
| 3 | Preserve unmatched LLM rows (38L depth) after ordered plan block or tagged as supplementary |
| 4 | Never overwrite `type` on matched rows |

**Acceptance:** Raw 38L Pass **and** population contract Pass on same artefact.

### R2 — Single-lane harness (High)

**File:** `ev-38l-inflation-pipeline-capture-once.mjs`

| Step | Action |
|------|--------|
| 1 | Remove dual-lane split (no fidelity-lane fork) |
| 2 | Run 38L check after additive merge |
| 3 | Proceed to GAM → Page only on combined pass |

### R3 — Full 38P compose on generated page (High)

**File:** `ev-38s-proof-replay.mjs` / harness Page step

| Step | Action |
|------|--------|
| 1 | Ensure design-page includes four `learning_activities` rows |
| 2 | Run `applyGamMaterialsToComposedPage` before replay (as EV-38P) |
| 3 | Verify `material_role_index` populated (RF-8) |

### R4 — Unit tests (Medium)

| Test | Assert |
|------|--------|
| Additive merge | 38L + population contract both Pass on fixture collapsed bundle |
| Order | M-03 Pass after merge |
| Preservation | A3 worked analytic pass type survives merge |

### Explicitly excluded

- V1 schema fields  
- New workflow step (optional later; LO derivation sufficient for proof)  
- DLA prompt IFP expansion  
- GAM/Page compose redesign  

---

## Task 9 — Success criteria review

| SC | Status | Notes |
|----|:------:|-------|
| **SC-1** Episode Plan V1 integrated | **Passed** | LO → derive plans → DLA path ([38S-1](38S-1-episode-plan-v1-integration.md)) |
| **SC-2** Plan-before-populate gate | **Passed** | M-13 / PF-11 active |
| **SC-3** `instructional_function` tagging | **Passed** | On merged DLA; 7–10 tags per activity |
| **SC-4** P1–P10 enforced | **Passed** | Structural validators Pass |
| **SC-5** AC-01–AC-10 enforced | **Passed** | M-05 0 on merged lane |
| **SC-6** Claims A–E evaluated | **Passed** | This document + [38S-4](38S-4-proof-execution.md) |
| **SC-7** `fullOk` remains true | **Blocked** | EV-38S false — remediation + re-proof required |
| **SC-8** 58/58 suite preserved | **Passed** | 76/76 including 38S tests |
| **SC-9** Implementation recommendation | **Passed** | This document |

**Summary:** 7 Passed · 1 Blocked (SC-7) · 0 Pending (SC-9 complete with this deliverable)

SC-7 unblock path: R1–R3 + targeted re-proof (Option B).

---

## Task 10 — Closure inputs

## Closure inputs

### Architecture verdict

**VALIDATED — proceed with V1 frozen.**

Episode Plan V1 + population contract delivers G3/G5/G4 reduction as 38Q and 38R predicted. Transition families, beat survival, order, and anti-collapse are **proven on implementation**.

### Implementation verdict

**INCOMPLETE — merge strategy must change before production readiness.**

Destructive replace merge breaks 38L depth and forced an invalid dual-lane proof. Fidelity replay failed due to incomplete page + missing 38P merge — harness gap, not fidelity machinery regression.

### Remediation requirements

1. **R1** Additive merge (Critical)  
2. **R2** Single-lane harness (High)  
3. **R3** Full 38P compose path on generated output (High)  
4. **R4** Unit tests (Medium)

### Re-proof requirements

**Option B — Targeted re-proof:** `EV-38S-AFTER-2` single-lane; Claim D + SC-7; educational metrics regression check.

### Production readiness status

| Ready now | After remediation |
|-----------|-------------------|
| V1 schema, proof framework, educational contract | fullOk, single-lane pipeline, production DLA merge |

**Production readiness cannot be claimed at 38S-5 closure.** It can be claimed at **38S-6** if targeted re-proof passes.

---

## Success condition assessment

> "Did 38S validate the Episode Plan architecture, and what must happen before production readiness can be claimed?"

**Architecture:** **Yes.** 38S provides strong empirical validation that V1 + population contract achieves the educational improvements 38Q and 38R specified. Confidence: **High**.

**Before production readiness:**

1. Implement additive merge (R1).  
2. Re-run single-lane proof with full 38P replay (Option B).  
3. Achieve **fullOk: true** on plan-driven workbook.  
4. Close SC-7 at 38S-6.

**Do not reopen 38Q or 38R** unless additive-merge re-proof fails both educational and fidelity lanes — which would indicate an **integration design** issue, still not V1 schema invalidity.

---

## Formal recommendation

| Field | Value |
|-------|-------|
| **Recommendation** | **Proceed after remediation** |
| **Architecture** | **Validated** |
| **Implementation** | **Remediate then re-proof** |
| **38Q / 38R** | **Affirmed — not contradicted** |
| **Next phase** | [38S-6 Closure](38S-6-sprint-closure.md) — conditional on re-proof or document Hold if remediation deferred |

---

## Status

| Field | Value |
|-------|-------|
| Phase | 38S-5 |
| Status | **COMPLETE** |
| Next | [38S-6 Closure](38S-6-sprint-closure.md) |
