# S79-T-005 — Atomic live-path switch to canonical GAM assembly

**Sprint:** 79 — GAM Architecture and Maintainability  
**Status:** COMPLETE  
**Date:** 2026-08-26  
**Mode:** LIVE ROUTING / WIRING — strict text preservation; no prompt retune

**Depends on:** [S79-T-004](S79-T-004-old-vs-target-equivalence-acceptance-gate.md) (**ACCEPTED**)  
**Next:** **S79-T-006** — COMPLETE → proceed to **S79-T-007** behavioural benchmark

---

## 1. Executive conclusion

Run/Copy and Studio both now assemble live GAM prompts through `lib/gam-canonical-assembler.js` (**atomic** final state).

| Path | Live entry | Canonical ownership |
| ---- | ---------- | ------------------- |
| **Run/Copy V2** | `buildWorkflowStepInstructions` → `buildLiveGamV2CopyPromptViaCanonicalAssembler` | `assembleGamCanonicalPrompt(copy_v2_*)` + live archetype/math/pipeline post |
| **Studio** | `applyWorkflowStepRuntimePromptAugmentations` (full scaffolds) → `applyGamPageEnrichPromptBlockToDraft` | `applyGamStudioGraft` |

**LIVE Copy == T-002 Copy golden** and **LIVE Studio == T-002 Studio golden** (byte-for-byte). Path-specific differences preserved. No product feature flag. No semantic retune.

**Acceptance:** MET.

---

## 2. Files inspected

- Sprint 79 T-002 / T-003 / T-004 / PLAN / decisions
- `lib/gam-canonical-assembler.js`
- `app.js` (`buildWorkflowStepInstructions`, `applyGamPageEnrichPromptBlockToDraft`, runtime augmentations)
- `tests/fixtures/s79-t-002/*`
- `index.html`, `tests/prism-vm-lib-bootstrap.js`

---

## 3. Run/Copy live switch

### Before
`buildWorkflowStepInstructions` built GAM V2 inline (framing, contract, commission, brief, gate, override, footer, archetype, math, pipeline).

### After
1. Detect `isGamPageEnrichmentV2CopyStep`.
2. Call `buildLiveGamV2CopyPromptViaCanonicalAssembler`:
   - resolve DLA page / bindings / runner guidance / notes;
   - `assembleGamCanonicalPrompt({ profile: copy_v2_partial|nonpartial, includeCopyMath:false, includePipelineClose:false, adapters: live contract+gate })`;
   - `applyLdInstructionalArchetypeRoutingToDraft` (T-004 binding);
   - `applyMathSafeOutputContractToDraft`;
   - append pipeline completion directive.
3. If assembler missing → **TEMPORARY FALLBACK** to OLD inline path (T-008 retirement).

---

## 4. Studio live switch

### Before
Full `applyWorkflowStepRuntimePromptAugmentations` ending in inline `applyGamPageEnrichPromptBlockToDraft`.

### After
1. **Unchanged** full pre-graft chain (EQF, cognition, patterns, self-directed, **table fidelity**, **materials-copy**, depth, archetype, PEL, VA, **math**, strict JSON, …).
2. Final graft: `applyGamPageEnrichPromptBlockToDraft` → `asm.applyGamStudioGraft` with live contract+gate adapters.
3. Partial mode still omits commission / completion / footer.
4. Assembler missing → TEMPORARY OLD graft body (T-008).

---

## 5. Full Studio scaffold preservation

| Evidence | Result |
| -------- | ------ |
| Live augmentation function still calls table fidelity, materials-copy, archetype, EQF, math, then GAM graft last | **Pass** (T-005 source assertion) |
| T-002 Studio golden still matches live after switch | **Pass** |
| Branch test exercises table/materials applies + canonical graft | **Pass** |
| Default `assembleStudioV2` EQF+math-only **not** used as live Studio production path | **Confirmed** — live uses full chain + graft only |

---

## 6. Canonical live authority after switch

- Module: `PRISM_GAM_CANONICAL_ASSEMBLER` (`LIVE_PRODUCTION: true`, version `S79-T-005-LIVE-1`).
- Loaded in `index.html` and VM bootstrap.
- Live contract/shape/gate text still resolved via existing live resolvers (guided-review parity).
- Brief/commission/override/footer/framing owned by assembler section builders on Copy path.

---

## 7. Live OLD-baseline equivalence

| Case | Bytes | SHA-256 | Result |
| ---- | ----- | ------- | ------ |
| LIVE Copy vs `run-copy-partial-baseline.txt` | 31989 | `d31c92d2…790aa` | **BYTE-IDENTICAL** |
| LIVE Studio vs `studio-partial-baseline.txt` | 20333 | `9beeab45…8ad8b` | **BYTE-IDENTICAL** |

Goldens not regenerated. `UPDATE_S79_BASELINES` unset.

---

## 8. High-salience ordering

Copy live: schema → commission → brief → gate → override → footer → archetype (cond.) → math → pipeline close — preserved (golden + gate-before-override assert).

Studio live: body → scaffolds → graft (contract/shape/gate) — preserved.

---

## 9. Guided-review treatment

Pre-existing Node vs live VM drift unchanged. Live adapters keep fallback surface. No new difference introduced.

---

## 10. Compatibility treatment

| Path | Classification |
| ---- | -------------- |
| `gam-output-format` (pack-text) | **GENUINE COMPATIBILITY — PRESERVED** |
| `page-gam-materials-preserve` | **GENUINE COMPATIBILITY — PRESERVED** |

---

## 11. Temporary rollback / obsolete-owner inventory

| Element | Class | T-008 action |
| ------- | ----- | ------------ |
| Inline OLD body inside `applyGamPageEnrichPromptBlockToDraft` after assembler miss | **TEMPORARY ROLLBACK** | Remove fallback; require assembler |
| Inline OLD GAM branch in `buildWorkflowStepInstructions` after assembler miss | **TEMPORARY ROLLBACK** | Remove fallback; require assembler |
| `buildGamV2CopyMaterialAuthoringBrief` / commission builders still in `app.js` | **OBSOLETE NORMATIVE OWNER** (still used by adapters/tests/legacy callers) | Retire or thin-wrap to assembler |
| Duplicate inline GAM completion/footer/gate ensure in OLD Copy branch | **OBSOLETE NORMATIVE OWNER** (unreachable when assembler present) | Delete with OLD branch |
| Studio full scaffold chain in `app.js` | **STILL REQUIRED PATH WRAPPER** | Keep (not temporary rollback) |
| Archetype + math post on Copy | **STILL REQUIRED PATH WRAPPER** | Keep or fold into assembler post-hooks deliberately |
| Pack-text / materials-preserve | **GENUINE COMPATIBILITY** | Keep |
| T-002/T-003 harnesses | **TEST-ONLY** | Keep |

**No product `gamCanonicalAssembler` feature flag** was introduced.

---

## 12. T-008 retirement obligations

1. Remove TEMPORARY FALLBACK branches in Copy early-return and Studio graft.
2. Delete unreachable OLD inline GAM Copy construction once fallback gone.
3. Consolidate obsolete `app.js` normative builders into assembler-only (or thin delegates).
4. Do **not** remove pack-text / materials-preserve / Studio scaffold wrappers.
5. Re-run deterministic GAM suites after retirement.

---

## 13. Files changed

| File | Change |
| ---- | ------ |
| `lib/gam-canonical-assembler.js` | `LIVE_PRODUCTION=true`; `includePipelineClose`; version bump |
| `app.js` | Live Copy + Studio routing; resolvers; TEMPORARY fallbacks |
| `index.html` | Load `gam-canonical-assembler.js` |
| `tests/prism-vm-lib-bootstrap.js` | Bootstrap assembler |
| `tests/s79-t-005-gam-live-canonical-switch.test.js` | **NEW** |
| `tests/s79-t-002-*.test.js` / `tests/s79-t-003-*.test.js` | Adjust post-switch assertions |
| Sprint nav + this record | Updated |

---

## 14. Tests run

| Suite | Result |
| ----- | ------ |
| `tests/s79-t-005-gam-live-canonical-switch.test.js` | **8/8 pass** |
| `tests/s79-t-002-gam-equivalence-baseline.test.js` | **7/7 pass** |
| `tests/s79-t-003-gam-canonical-assembler.test.js` | **11/11 pass** |
| T-051 / T-032 closure / T-055 | **pass** |
| **Combined** | **45/45 pass, 0 fail** |

---

## 15. Acceptance criteria

| Criterion | Met? |
| --------- | ---- |
| Run/Copy live on canonical | **Yes** |
| Studio live on canonical graft | **Yes** |
| Atomic final state | **Yes** |
| Path-specific differences preserved | **Yes** |
| Full reachable Studio scaffolds preserved | **Yes** |
| Live == T-002 goldens | **Yes** |
| No semantic retune | **Yes** |
| Compatibility intact | **Yes** |
| Temporary rollback bounded + recorded for T-008 | **Yes** |
| Deterministic regressions pass | **Yes** |

**S79-T-005 acceptance: MET.**

---

## 16. Remaining risks

1. TEMPORARY fallbacks still exist if script fails to load — must retire in T-008.
2. Obsolete normative functions remain in `app.js` until T-008 cleanup.
3. Guided-review Node vs live drift still deferred.
4. Non-partial whole-prompt smoke remains light (profile supported; T-002 embed covered).

---

## 17. Exact recommended next task

**S79-T-006** — Deterministic integration + genuine compatibility isolation + pre-emit ownership hardening (no Settings / no DLA Phase D / no T-008 yet unless scoped inside T-006 plan).
