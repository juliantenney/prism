# S79-T-007 — Fresh behavioural benchmark

**Sprint:** 79 — GAM Architecture and Maintainability  
**Status:** **COMPLETE — ACCEPTED (A — NO MATERIAL REGRESSION)**  
**Date opened (repo prep):** 2026-08-26  
**Date accepted:** 2026-08-26  
**Mode:** BEHAVIOURAL EVIDENCE — operator-led generation + external QA  
**Depends on:** [S79-T-006](S79-T-006-deterministic-integration-compatibility-isolation-pre-emit.md) COMPLETE  
**Authorizes:** **S79-T-008** (mandatory GAM temporary rollback / legacy retirement)

---

## Purpose

Show whether the post–T-005 / T-006 live canonical GAM assembly introduces **material learner-resource regression** relative to the Sprint 78 continuity benchmark (Lagrangian **94/100**).

This task is **not** prompt retuning. Deterministic suites do **not** substitute for behavioural QA.

**Cursor / repository role:** preparation, live-path confirmation, deterministic sanity, handoff record.  
**Operator role:** PRISM workflow generation + external QA benchmarker.  
**Cursor does not** run or simulate the external QA benchmarker.

---

## Explicit completion

| Item | Status |
| ---- | ------ |
| Repository-side preparation | **DONE** |
| Operator Lagrangian generation | **DONE** (operator) |
| External QA result | **DONE** — see §5 |
| Behavioural conclusion | **A — NO MATERIAL REGRESSION** |
| T-007 COMPLETE | **YES** |
| T-008 authorized | **YES** |

---

## 1. Lagrangian benchmark reference / provenance (pre–Sprint 79 continuity)

| Field | Repository evidence | Notes |
| ----- | ------------------- | ----- |
| Topic | **Lagrangian Multipliers** (favourable primary regression topic) | [SPRINT-78-CHARTER](../2026-08-17-sprint-78-learner-resource-quality-recovery/SPRINT-78-CHARTER.md) |
| Prior score | **94/100** uncapped; **0 Critical**; **0 Major** | [S78-T-056](../2026-08-17-sprint-78-learner-resource-quality-recovery/S78-T-056-sprint-78-closure.md) §6 |
| Package label in records | **Post–T-037 Lagrangian package** | Closure Final Gate evidence |
| QA instrument | **PRISM Resource Quality Benchmark v2.2** (independent / operator QA) | Same instrument family as S78 CONTEXT / T-056 |
| Generation path (described) | Fresh **EP → DLA → GAM → Verify → assembly → learner package → independent QA** | T-056 / T-052 / CHARTER |
| QA / evaluation record location | Administrative verdict in **S78-T-056**; programme closeout in `docs/sprints/sprint-78-closeout.md`; S79 briefing cites 94/100 | Full raw QA report body is **operator-held** if not pasted into sprint docs |
| Exact workflow/input JSON in git? | **Not found / not committed** | Historical S76/S78 pattern: Lagrangian EP/DLA/GAM JSON often **operator-held**, not in repository |
| Exact model/runtime config for the 94 run | **Not recorded in repository** beyond normal live PRISM workflow at time of run | Do not invent |
| Opening contrast baseline (not T-007 target) | Post–S77 Lagrangian **70/100** (2026-08-14) | [POST-S77-lagrangian-qa-baseline](../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/POST-S77-lagrangian-qa-baseline-2026-08-14.md) — historical only |
| HR Essentials corroboration (not primary) | **92/100** | Contingency only for T-007 — see §6 |

**Continuity intent for T-007:** re-run the **same favourable topic** under **current live** post–T-006 code, fresh from top, then external QA — compare against **94/100** as the pre-refactor continuity reference, not as a score to engineer toward via retuning.

---

## 2. Current live canonical route (fresh run today)

Under normal loaded conditions (assembler script present):

### Run/Copy (GAM V2)

```text
buildWorkflowStepInstructions
  → isGamPageEnrichmentV2CopyStep?
  → buildLiveGamV2CopyPromptViaCanonicalAssembler
       → assembleGamCanonicalPrompt(copy_v2_*)
       → archetype (when applicable)
       → math-safe contract
       → pipeline completion directive
```

### Studio (GAM graft)

```text
applyWorkflowStepRuntimePromptAugmentations
  → full live scaffold chain
  → applyGamPageEnrichPromptBlockToDraft
       → asm.applyGamStudioGraft  (canonical)
```

| Check | Expectation |
| ----- | ----------- |
| Canonical assembler | `lib/gam-canonical-assembler.js` via `PRISM_GAM_CANONICAL_ASSEMBLER` |
| Normal live route | Canonical — **not** TEMPORARY FALLBACK |
| Product feature flag switching OLD | **None** (`LIVE_PRODUCTION` is status marker only) |
| Hidden OLD production route when assembler loaded | **No** (fallback only if module missing) |

No code changes were made solely for this benchmark preparation.

---

## 3. Deterministic pre-benchmark sanity

**Date:** 2026-08-26  
**Command:**

```text
node --test ^
  tests/s79-t-006-gam-integration-hardening.test.js ^
  tests/s79-t-005-gam-live-canonical-switch.test.js ^
  tests/s79-t-002-gam-equivalence-baseline.test.js ^
  tests/s79-t-003-gam-canonical-assembler.test.js
```

**Result: 35/35 pass, 0 fail**

Establishes:

- live canonical path active;
- Copy / Studio still match committed T-002 baselines (byte identity where those suites assert);
- pre-emit / ordering / fallback-not-normal protected;
- no regression since T-006 on this gate set.

**GO for operator behavioural generation** (repository-side).

---

## 4. Operator benchmark run sheet — PRIMARY: Lagrangian

### A. Preconditions (operator)

1. Use the **current live PRISM** build that includes Sprint 79 **T-005 + T-006** (canonical GAM live).
2. Confirm no intentional disable/unload of `lib/gam-canonical-assembler.js`.
3. Leave Settings / workflow settings at **current default product behaviour** — do **not** change Settings for this benchmark; S79 does not implement PB-FA-005.
4. Do **not** manually edit prompts, GAM text, or learner package content before QA.

### B. Source / input (operator procedure)

| Item | Instruction |
| ---- | ----------- |
| Topic | **Lagrangian Multipliers** (same favourable primary topic as S78 Final Gate) |
| Exact EP brief / seed file in repo | **Not present** — use the operator’s normal Lagrangian Multipliers brief / workflow input as used for prior from-top S78 runs |
| Mode | **Fresh from-top** generation (do not reuse a pre-switch package as the “new” artefact) |

Label: **operator procedure** — Cursor cannot verify the operator’s local brief file.

### C. Workflow path (repository-evidenced)

Follow the same end-to-end path documented for S78 Final Gate evidence:

**EP → DLA → GAM → Verify → assembly → learner package → independent QA**

Use normal PRISM Run/Copy (and Studio only if that is part of the operator’s usual packaging path for this benchmark). Do not invent alternate UI sequences beyond this documented pipeline.

### D. Artefacts to save (operator)

Save and retain at least:

- final learner package / export used for QA;
- intermediate stage artefacts if normally retained (EP / DLA / GAM captures);
- any first-pass verify outcomes the operator usually records;
- generation date/time and PRISM build/commit identifier if known.

### E. Provenance fields to record

Fill §5 template. Especially confirm:

- generated **after** S79-T-006;
- live canonical GAM (no deliberate OLD fallback);
- **no manual content edits** before QA.

### F. QA

Run **external** PRISM Resource Quality Benchmark (**v2.2** family, consistent with S78) via the operator’s normal QA process.  
Paste / attach results into §5. Do **not** ask Cursor to score the package.

---

## 5. QA result template — COMPLETED

| Field | Operator entry |
| ----- | -------------- |
| Generated artefact | Fresh post–T-006 Lagrangian (operator-held) |
| Confirmed generated after T-006? | **Y** |
| QA instrument / version | Benchmark **v2.2** |
| **QA score (uncapped)** | **91/100** (corrected post-image-fidelity fix) |
| Pre-S79 continuity reference | **94/100** |
| Critical / Major | **0 / 0** |
| Judgement | **Excellent**; High confidence; Release ready with minor revisions; no production defect cap |
| Activity ratings | All five activities **Strong** overall; no Weak / Missing / Defective |
| GAM semantic regression? | **No** |
| Image-generation note | Initial lower score traced to **downstream image-generation mathematical-fidelity** (derivative rendered as incorrect ratio). Correcting **only that visual** restored **91/100**. **Not** a GAM semantic regression. |
| Operator verdict vs 94 | **A — NO MATERIAL REGRESSION** |

**Behavioural conclusion:** **A — NO MATERIAL REGRESSION.** HR Essentials not required.

---

## 6. HR Essentials contingency

| Item | Value |
| ---- | ----- |
| Prior HR score | **92/100** |
| Fresh HR for T-007? | **Not run** — Lagrangian clearly continuity-acceptable |

---

## 7. T-008 authorization status

**S79-T-008 is AUTHORIZED.**

Proceed to mandatory temporary rollback / legacy retirement. Do not defer.

---

## 8. Files inspected (prep)

- Sprint 79: PLAN, STATUS, T-001, T-006, HANDOVER, briefing, START-HERE, decisions  
- Sprint 78: S78-T-056, S78-T-052, CHARTER, closeout, CONTEXT, START-HERE  
- Live: `app.js` (Copy/Studio routing), `lib/gam-canonical-assembler.js`  
- Tests: T-002 / T-003 / T-005 / T-006

## 9. Files changed (prep)

| File | Change |
| ---- | ------ |
| This record | **NEW** — T-007 prep + awaiting operator |
| `STATUS.md` | T-007 → IN PROGRESS (awaiting operator) |
| `PLAN.md` | T-007 status note |
| `HANDOVER.md` / `next-chat-briefing.md` / `SPRINT-79-START-HERE.md` | Point to operator benchmark |

No production GAM/prompt/schema changes in this prep.

---

## 10. Next action after operator returns QA

1. Paste §5 results into this record (or attach).  
2. Record continuity judgement vs **94/100**.  
3. Only then: mark T-007 COMPLETE **or** document remediation.  
4. Only after no-material-regression acceptance: authorize **S79-T-008**.

**STOP — repository-side T-007 preparation ends here.**
