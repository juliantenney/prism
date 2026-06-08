# 38S — Remediation status audit

**Date:** 2026-06-06  
**Type:** Status audit only — no code changes, no proof runs  
**Authority:** [38S-5 evaluation](38S-5-evaluation-and-recommendation.md) minimum remediation plan (R1–R4)  
**Question:** What remains between the current codebase and an unblock of SC-7?

---

## Executive summary

| Field | Status |
|-------|--------|
| **Remediation overall** | **Incomplete** — R1 partial; R2/R3 split across scripts; R4 not started |
| **Re-proof readiness** | **NOT READY** |
| **SC-7** | **Blocked** (Implementation + Harness) |
| **Recommended next action** | **Complete remediation first** |

Architecture verdict from 38S-5 stands. SC-7 cannot be unblocked until R1 is finished and a single-lane proof path is verified.

---

## Task 1 — Remediation action status

| Remediation | Status | Evidence |
|-------------|:------:|----------|
| **R1 — Additive merge** | **In progress** | `mergePopulationScaffoldWithLlmActivity` matches LLM rows to scaffold beats and preserves `type`/`content` on matches (`lib/episode-plan-dla-integration.js` L99–147), but output is **only** `scaffolded.required_materials.map(...)` — unused LLM rows are never appended. 38S-4: merged DLA fails `validateDla38LObligations`; raw LLM passes ([38S-4](38S-4-proof-execution.md) §Run summary). |
| **R2 — Single-lane harness** | **In progress** | Main capture harness (`ev-38l-inflation-pipeline-capture-once.mjs` v38S-3a) is single-lane intent: derive plans → merge → population + 38L gates → GAM → Page (L446–515). **Dual-lane remains** in `ev-38s-proof-continue.mjs` L177–189: writes `-fidelity-lane.json`, GAM/Page fed from raw LLM DLA. EV-38S proof used continue path after 38L gate failure. |
| **R3 — Full 38P compose replay** | **In progress** | `ev-38s-proof-replay.mjs` calls `applyGamMaterialsToComposedPage` + `applyA3MaterialsSequencingToComposedPage` (L170–171). Main capture harness does **not** apply 38P compose before writing `design-page.json` (L567–667). No single script chains capture → 38P merge → fullOk replay. EV-38S replay failed fullOk on incomplete continue-path page ([38S-4](38S-4-proof-execution.md)). |
| **R4 — Combined validation tests** | **Not started** | `tests/episode-plan-dla-integration.test.js` covers population contract + M-03 on merge; **no** test calls `validateDla38LObligations` on merged artefact; **no** test asserts 38L depth row survival (DLA-WB-27 worked analytic pass, DLA-WB-28/31 independent judgement template). |

---

## Task 2 — Merge implementation inspection

### Current behaviour: **C — Hybrid (scaffold-authoritative replace with selective LLM preservation)**

Evidence in `lib/episode-plan-dla-integration.js`:

```99:147:lib/episode-plan-dla-integration.js
  function mergePopulationScaffoldWithLlmActivity(llmActivity, episodePlan) {
    // ...
    out.required_materials = scaffolded.required_materials.map(function (scaffoldMat) {
      // match LLM row by instructional_function / purpose / plan_beat_index
      // ...
      if (match) {
        if (match.type) merged.type = match.type;
        if (match.specification) merged.specification = match.specification;
        // ...
      }
      return merged;
    });
    // no append of unmatched llmMats (used[] tracked but never consumed)
```

| Aspect | Replace (38S-3) | Additive (38S-5 target) | Current |
|--------|-----------------|---------------------------|---------|
| Output row count | Scaffold only | Scaffold + preserved LLM extras | Scaffold only |
| Match preserves LLM body/type | No | Yes | **Yes** (partial) |
| Unmatched LLM rows kept | No | Yes | **No** |
| Unmatched beats get scaffold | Yes | Yes | Yes |

### Does implementation still remove valid 38L structures?

**Yes — when LLM depth rows do not map 1:1 to a plan beat**, they are dropped from `required_materials[]`.

38L checks types/purposes the scaffold may not emit:

- A3: `worked_example` / `modelling_note` with purpose matching `worked analytic pass` before `analysis_table` (`lib/dla-38l-obligation-check.js` L82–94)
- A4: `template` / `task_cards` with `independent judgement` purpose (L46–54, L97–101)

38S-4 documented loss: A3 DLA-WB-27, A4 DLA-WB-28/31 on merged lane; raw lane passed.

---

## Task 3 — Harness status

## Harness status

| Path | Single lane? | Episode Plan → DLA → GAM → Page → 38P replay | Notes |
|------|:------------:|:---------------------------------------------:|-------|
| `ev-38l-inflation-pipeline-capture-once.mjs` (38S-3a) | **Yes** (design) | **Partial** — stops at 38L if merge fails; no 38P compose on saved page | Population + 38L gates on **same** merged DLA (L505–515) |
| `ev-38s-proof-continue.mjs` | **No** | **Partial** — GAM/Page from raw fidelity lane | Dual artefact write (L181–189) |
| `ev-38s-proof-replay.mjs` | N/A (replay only) | **38P replay only** — reads GAM + raw page from artefacts | Applies compose; did not pass fullOk on EV-38S |
| `ev-38s-proof-evaluation.mjs` | N/A | Educational metrics on merged DLA only | No fidelity gate |

**Verdict:** No end-to-end single-lane path currently produces one DLA artefact that flows through GAM → Page → 38P replay → fullOk. Dual-lane behaviour **persists** in the continue script used for EV-38S recovery.

---

## Task 4 — Validation status

## Validation status

| Validator | Artefact used in EV-38S proof | Can run on same merged DLA? |
|-----------|------------------------------|----------------------------|
| Population contract (P1–P10, AC-01–AC-10) | Merged `-dla-learning-activities.json` | **Yes** — Pass ([38S-4](38S-4-proof-execution.md)) |
| 38L obligations (DLA-WB-26..31) | Raw LLM (fidelity lane) for GAM; merged **failed** | **No** — mutually exclusive today |
| 38P replay (RF-1..RF-8, fullOk) | Page from fidelity lane (incomplete) | **No** — not driven from merged lane |
| 38L page GAM preservation | Continue-path page | **Fail** — incomplete four-activity page |

**Verdict:** Validations still operate on **divergent artefacts**. A single artefact cannot simultaneously satisfy population contract **and** 38L obligations **and** 38P replay requirements until R1 completes and R2/R3 unify the pipeline.

---

## Task 5 — Re-proof readiness

### Assessment: **NOT READY**

| Criterion | Ready? | Evidence |
|-----------|:------:|----------|
| Additive merge complete | No | Unmatched LLM rows discarded (Task 2) |
| Single-lane harness | No | Continue script dual-lane (Task 3) |
| Combined validation tests | No | R4 not started |
| Prior EV-38S fullOk | No | fullOk false ([38S-4](38S-4-proof-execution.md)) |
| 58/58 machinery | Yes | 76/76 suite pass — replay **machinery** intact; not proof-path ready |

Targeted re-proof (Option B from 38S-5) would fail at 38L gate on merged DLA or reproduce dual-lane split if continue script is used.

---

## Task 6 — SC-7 blocker review

| Blocker | Category | Explicit cause |
|---------|----------|------------------|
| **Primary** | **Implementation** | Hybrid merge drops 38L depth rows → merged DLA fails `validateDla38LObligations` |
| **Secondary** | **Harness** | Dual-lane continue path; incomplete page; 38P compose not in capture harness end-to-end |
| **Not blocking** | Architecture | V1 + population contract validated in 38S-5 |
| **Not blocking** | Prompt | KM prose-after-fence mitigated by seed in 38S-4 |

**SC-7 is blocked by Implementation + Harness**, not by Episode Plan architecture.

---

## Task 7 — Minimal remaining work

Before targeted re-proof (no V1 / prompt / architecture changes):

1. **R1 finish** — After scaffold map, append unused `llmMats` (preserve types/purposes; optional `supplementary: true` for orphan guard). Never overwrite `type` on matched rows (already correct).
2. **R2 finish** — Remove fidelity-lane fork from `ev-38s-proof-continue.mjs` or retire continue path once main harness passes 38L on merged DLA.
3. **R3 finish** — Either apply `applyGamMaterialsToComposedPage` in capture harness before page write, or add unified proof driver: capture → replay in one command with merged artefacts only.
4. **R4 add** — Test: merged fixture passes **both** `validateLearningActivitiesPopulationContract` and `validateDla38LObligations`; assert A3 worked analytic pass and A4 independent judgement types survive merge.
5. **Then** run `EV-38S-AFTER-2` single-lane + replay; require fullOk true for SC-7.

---

## Task 8 — Recommendation

### **Complete remediation first**

| Option | Selected? | Rationale |
|--------|:---------:|-----------|
| Proceed to targeted re-proof | No | R1 incomplete; proof would fail or reintroduce dual-lane |
| **Complete remediation first** | **Yes** | Smallest delta (R1–R4) before Option B re-proof |
| Return to design | No | Architecture validated; failure localized to merge/harness |

---

## Success condition

> "Are we ready to execute the targeted re-proof that could unblock SC-7?"

**No.** Remediation R1 is partially implemented but not sufficient; R2/R3 are split across scripts; R4 is absent. Complete R1–R4, then execute targeted re-proof.

---

## Status

| Field | Value |
|-------|-------|
| Audit | **COMPLETE** |
| SC-7 | **Blocked** |
| Next | Implement R1–R4 → targeted re-proof → 38S-6 closure |
