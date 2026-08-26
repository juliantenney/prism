# S79-T-006 — Deterministic integration + genuine compatibility isolation + pre-emit ownership

**Sprint:** 79 — GAM Architecture and Maintainability  
**Status:** COMPLETE  
**Date:** 2026-08-26  
**Mode:** INTEGRATION HARDENING — strict text preservation; no prompt retune; no T-007/T-008

**Depends on:** [S79-T-005](S79-T-005-atomic-live-path-switch-to-canonical-gam-assembly.md)  
**Next:** **S79-T-007** — Fresh behavioural benchmark

---

## 1. Executive conclusion

Post-T-005 live GAM integration is deterministic and test-protected:

- Normal live execution uses canonical assembly only (assembler present).
- `PRISM_GAM_CANONICAL_ASSEMBLER` / `LIVE_PRODUCTION` classified (not a feature flag).
- Final pre-emit gate has singular textual SSOT + singular live insertion owner.
- Pack-text / materials-preserve remain genuine compatibility, outside the assembler.
- TEMPORARY FALLBACK / obsolete owners inventoried for **mandatory T-008**.
- Live Copy/Studio still byte-match T-002 goldens; Sprint 78 regressions green.

**Acceptance:** MET.

---

## 2. Live integration topology

### Run/Copy

```text
buildWorkflowStepInstructions
  → isGamPageEnrichmentV2CopyStep?
  → buildLiveGamV2CopyPromptViaCanonicalAssembler
       → assembleGamCanonicalPrompt(copy_v2_*)
       → applyLdInstructionalArchetypeRoutingToDraft  [path wrapper]
       → applyMathSafeOutputContractToDraft           [path wrapper]
       → pipeline completion directive                [path wrapper]
  → else TEMPORARY FALLBACK (assembler missing) — T-008
```

### Studio

```text
applyWorkflowStepRuntimePromptAugmentations
  → full live scaffold chain (EQF, table fidelity, materials-copy, archetype, math, …)
  → applyGamPageEnrichPromptBlockToDraft
       → asm.applyGamStudioGraft                      [canonical]
  → else TEMPORARY FALLBACK graft body — T-008
```

**No second live normative path** when assembler is loaded.

---

## 3. Canonical authority proof

| Check | Result |
| ----- | ------ |
| `isGamCanonicalAssemblerLiveEnabled()` | true |
| LIVE Copy == T-002 Copy golden | **BYTE-IDENTICAL** |
| LIVE Studio == T-002 Studio golden | **BYTE-IDENTICAL** |
| Direct `buildLiveGamV2CopyPromptViaCanonicalAssembler` == golden | **Yes** |
| `asm.applyGamStudioGraft` used by Studio graft | **Yes** |

---

## 4. `PRISM_GAM_CANONICAL_ASSEMBLER` classification

| Aspect | Classification |
| ------ | -------------- |
| What it is | Bootstrap/global module API exposure (`root.PRISM_GAM_CANONICAL_ASSEMBLER`) |
| `LIVE_PRODUCTION` | **Status marker only** — not read by live routing |
| Who reads the global | `resolveGamCanonicalAssemblerLib()` in `app.js` |
| Feature flag? | **No** — no `workflowOutputSpec.gamCanonicalAssembler` |
| Can changing `LIVE_PRODUCTION` reactivate OLD? | **No** |
| What reactivates OLD? | Only **absence** of the module (TEMPORARY FALLBACK) |
| After T-008? | Global may remain as canonical module; **fallback branches** retire; marker may stay as metadata |

---

## 5. Final pre-emit ownership

| Role | Owner |
| ---- | ----- |
| **Textual SSOT** | `lib/ld-gam-page-enrich-contract.js` → `GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE` |
| **Canonical insertion owner** | `buildSectionPreEmitGate` in `lib/gam-canonical-assembler.js` |
| Copy placement | Brief ends with gate; assembler ensure-before-override |
| Studio placement | Graft appends gate once if absent |
| Live adapters | Gate adapter **removed** in T-006 (insertion via assembler SSOT resolve) |
| Contract/shape adapter | **Retained** (guided-review live VM parity) |
| TEMPORARY FALLBACK | May duplicate insertion — **not** live normative ownership |
| Late math/archetype | Marker-deduped; do not displace gate relative to completion override |

`GATE_TEXT_SSOT` export documents ownership. Gate appears **once** on live Copy and Studio.

---

## 6. Compatibility isolation

| Path | Entry / consumer | Model-visible? | Normative for V2? | After T-008 |
| ---- | ---------------- | -------------- | ----------------- | ----------- |
| `gam-output-format` (pack-text) | Capture / legacy pack validation | Capture path | **No** (compat) | **Retain** |
| `page-gam-materials-preserve` | Composition merge | Composition | **No** (compat) | **Retain** |

Assembler does **not** import these modules. Canonical ≠ compatibility.

---

## 7. Temporary rollback / obsolete-owner inventory

| Element | Class | T-008 |
| ------- | ----- | ----- |
| Copy assembler-miss early-return fallthrough to inline OLD | **TEMPORARY ROLLBACK** | Remove |
| Studio graft TEMPORARY FALLBACK body | **TEMPORARY ROLLBACK** | Remove |
| Unreachable OLD inline GAM Copy branch (when assembler present) | **OBSOLETE NORMATIVE OWNER** | Delete |
| `buildGamV2CopyMaterialAuthoringBrief` / commission helpers still in `app.js` | **OBSOLETE NORMATIVE OWNER** (tests/adapters/legacy) | Thin-wrap or delete |
| Duplicate gate ensure in OLD Copy branch | **OBSOLETE NORMATIVE OWNER** | Delete with branch |
| Studio full scaffold chain | **STILL REQUIRED PATH WRAPPER** | Keep |
| Copy archetype + math + pipeline post | **STILL REQUIRED PATH WRAPPER** | Keep (or deliberate fold later) |
| Pack-text / materials-preserve | **GENUINE COMPATIBILITY** | Keep |
| `PRISM_GAM_CANONICAL_ASSEMBLER` global | **STILL REQUIRED** module exposure | Keep |
| `LIVE_PRODUCTION` boolean | Status metadata | Keep or drop as docs-only |
| T-002…T-006 harnesses | **TEST-ONLY** | Keep |

---

## 8. Copy/Studio ordering evidence

Live Copy: contract → commission → brief → gate → override → footer → math → pipeline — **PASS** (T-006).  
Studio: scaffolds before `applyGamStudioGraft` — **PASS**.

---

## 9. Capture / validation / composition integration

| Suite | Result |
| ----- | ------ |
| `page-gam-enrich.test.js` | pass |
| `gam-output-format.test.js` | pass |
| `sprint-51-gam-material-preservation.test.js` | pass |
| Blank-cell / T-042 workspace | pass |

Validators unchanged.

---

## 10. Sprint 78 deterministic regression evidence

| Suite | Result |
| ----- | ------ |
| T-051 pre-emit | pass |
| T-032 closure packaging | pass |
| T-055 transfer/closure | pass |
| WS2 practice independence | pass |
| Blank-cell workspace | pass |
| T-042 workspace fidelity | pass |

Combined T-006 acceptance run: **145/145 pass** (see §15).

---

## 11. Guided-review status

Pre-existing Node vs live VM drift unchanged; live adapters for **contract/shape** preserved; gate no longer needs a separate adapter. Not worsened.

---

## 12. Policy-ingress status

`resolveGamPolicyIngress` / `NEUTRAL_POLICY_INGRESS` — behaviour-neutral; `settingsEffective` forced false; not schema-bound; not PB-FA-005. T-006 test proves text unchanged under hypothetical policy.

---

## 13. Workspace-ownership status

S78-T-042 / blank-cell / template `**Label:**` rules remain in contract + authoring brief (canonical normative). Capabilities unchanged; no surface redesign.

---

## 14. Files changed

| File | Change |
| ---- | ------ |
| `lib/gam-canonical-assembler.js` | Gate SSOT metadata; LIVE_PRODUCTION docs; version T-006 |
| `app.js` | Clarify assembler resolve; remove live gate adapter; fallback comments |
| `tests/s79-t-006-gam-integration-hardening.test.js` | **NEW** |
| `tests/s79-t-003-*.test.js` | Version regex allow T-006 |
| Sprint nav + this record | Updated |

---

## 15. Tests run

**145/145 pass, 0 fail** across:

| Suite | Role |
| ----- | ---- |
| `s79-t-006-gam-integration-hardening.test.js` | T-006 integration (9) |
| `s79-t-005-gam-live-canonical-switch.test.js` | Live switch |
| `s79-t-002-gam-equivalence-baseline.test.js` | Equivalence goldens |
| `s79-t-003-gam-canonical-assembler.test.js` | Assembler |
| `page-gam-enrich.test.js` | Capture / enrich |
| `gam-output-format.test.js` | Pack-text compat |
| `sprint-51-gam-material-preservation.test.js` | Materials preserve |
| `s78-t-051-gam-first-pass-consistency-hardening.test.js` | T-051 |
| `s78-gam-learner-closure-packaging.test.js` | T-032 |
| `s78-t-055-transfer-closure-markdown-form.test.js` | T-055 |
| `s78-gam-practice-independence-prompt.test.js` | Model/practice independence |
| `s78-gam-workspace-blank-cell.test.js` | Workspace blank-cell |
| `s78-t-042-learner-workspace-authoring-fidelity.test.js` | T-042 |

**Out of suite / not treated as T-006 blocker:** `s78-dla-practice-independence.test.js` “prompt size delta…” asserts DLA contract length ≤26400 but current DLA text is ~30412 — pre-existing DLA size bound, unrelated to GAM canonical switch.

---

## 16. Remaining T-008 obligations

1. Remove TEMPORARY FALLBACK branches (Copy + Studio).  
2. Delete unreachable OLD inline GAM Copy construction.  
3. Consolidate obsolete `app.js` normative builders.  
4. Keep compatibility + Studio scaffolds + Copy post wrappers.  
5. Re-run deterministic suite after retirement.

---

## 17. Unresolved risks

1. Fallback still reachable if script fails to load.  
2. Obsolete owners remain until T-008.  
3. Guided-review bootstrap drift deferred.  
4. T-007 behavioural benchmark not yet run (by design).

---

## 18. Acceptance criteria

| Criterion | Met? |
| --------- | ---- |
| Deterministic live integration protected | **Yes** |
| No mixed normative authority in normal live exec | **Yes** |
| Compatibility isolated + preserved | **Yes** |
| Singular pre-emit ownership | **Yes** |
| Ordering preserved | **Yes** |
| Capture/validation/composition green | **Yes** |
| S78 regressions green | **Yes** |
| Settings/workspace unchanged | **Yes** |
| T-008 inventory explicit | **Yes** |
| No semantic retune / no benchmark | **Yes** |

**S79-T-006 acceptance: MET.**

---

## 19. Exact recommended next task

**S79-T-007** — Fresh behavioural benchmark (Lagrangian primary; HR corroborative as needed). Do **not** start T-008 until T-007 shows no material regression.
