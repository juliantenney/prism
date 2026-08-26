# S79-T-008 — Mandatory temporary rollback / legacy retirement

**Sprint:** 79 — GAM Architecture and Maintainability  
**Status:** COMPLETE  
**Date:** 2026-08-26  
**Mode:** MANDATORY CLEANUP — strict text preservation; no prompt retune; no T-009  
**Depends on:** [S79-T-007](S79-T-007-fresh-behavioural-benchmark.md) ACCEPTED (A — NO MATERIAL REGRESSION)  
**Next:** **S79-T-009** — Final regression + closure gate

---

## 1. Executive conclusion

Temporary OLD GAM production fallbacks and obsolete inline normative owners are **retired**. Live Copy/Studio have **one** canonical normative assembly authority (`lib/gam-canonical-assembler.js`). Missing assembler **fails closed**. Live prompts still **byte-match** T-002 goldens. Genuine compatibility and required path wrappers retained. DLA dual-path **untouched**. Image-generation fidelity issue **deferred** (not in T-008 scope).

**Acceptance:** MET.

---

## 2. Before-cleanup retirement inventory (verified)

| Element | Class | Action |
| ------- | ----- | ------ |
| Copy assembler-miss fallthrough to OLD inline V2 | **TEMPORARY ROLLBACK** | **Removed** — fail-closed |
| Studio graft TEMPORARY FALLBACK append body | **TEMPORARY ROLLBACK** | **Removed** — fail-closed |
| OLD V2 Copy construction inside `buildWorkflowStepInstructions` | **OBSOLETE NORMATIVE OWNER** | **Deleted** (V2 branch) |
| Duplicate authoring brief / commission / upstream embed bodies in `app.js` | **OBSOLETE NORMATIVE OWNER** | **Thin-wrapped** to assembler |
| Duplicate gate insertion on Studio fallback | **OBSOLETE NORMATIVE OWNER** | **Deleted** with fallback |
| Studio full scaffold chain | **STILL REQUIRED PATH WRAPPER** | **Retained** |
| Copy archetype + math + pipeline post | **STILL REQUIRED PATH WRAPPER** | **Retained** |
| `gam-output-format` / `page-gam-materials-preserve` | **GENUINE COMPATIBILITY** | **Retained** |
| `PRISM_GAM_CANONICAL_ASSEMBLER` + `LIVE_PRODUCTION` | **KEEP / INFRASTRUCTURE** | **Retained** (status marker) |
| Non-V2 pack GAM Copilot contract line | **LEGACY NON-V2 PATH** | **Retained** (page-enrichment-off) |
| T-002…T-006 harnesses / goldens | **TEST-ONLY KEEP** | **Retained** (reframed where needed) |

---

## 3. Copy fallback retirement

- V2 Copy **always** `return buildLiveGamV2CopyPromptViaCanonicalAssembler(...)`.
- `requireGamCanonicalAssemblerLib()` throws `Canonical GAM assembler unavailable` if missing.
- Empty assembly throws `Canonical GAM assembly produced empty prompt`.
- No silent OLD reactivation.

## 4. Studio fallback retirement

- `applyGamPageEnrichPromptBlockToDraft` uses `requireGamCanonicalAssemblerLib()` + `applyGamStudioGraft` only.
- OLD contract/shape/gate append fallback body **deleted**.
- Pre-graft scaffolds unchanged.

## 5. Obsolete normative owners removed / consolidated

| Was duplicate in `app.js` | Now |
| ------------------------- | --- |
| Inline `buildGamV2CopyMaterialAuthoringBrief` text | Thin-wrap → `asm.buildSectionAuthoringBrief` |
| `projectGamAuthoritativeDlaCommissionFromPage` body | Thin-wrap → assembler |
| `buildAuthoritativeDlaMaterialCommissionSectionFromPage` body | Thin-wrap → `asm.buildSectionCommission` |
| `buildUpstreamDlaPageEmbedSectionForGamCopy` body | Thin-wrap → commission / `buildSectionUpstreamFullEmbed` |
| `buildGamV2ActivityCountInvariantSection` | **Deleted** (assembler owns invariant) |
| V2 framing + contract + embed in Copy fallthrough | **Deleted** |

Text unchanged — implementation authority only.

## 6. Canonical ownership after cleanup

| Concern | Owner |
| ------- | ----- |
| Normative GAM prompt assembly | `lib/gam-canonical-assembler.js` |
| Gate text SSOT | `ld-gam-page-enrich-contract.js` |
| Gate insertion | `buildSectionPreEmitGate` |
| Live contract/shape adapter (guided-review VM) | `buildGamV2CopilotSchemaInstructions` (still live adapter into assembler) |
| Copy path wrappers | archetype → math → pipeline close |
| Studio path wrappers | full scaffold chain → canonical graft last |

## 7. Genuine compatibility retained

| Module | Why |
| ------ | --- |
| `lib/gam-output-format.js` | Pack-text / historical capture validation — product-required |
| `lib/page-gam-materials-preserve.js` | Composition merge — product-required |

Assembler does **not** import these.

## 8. Required path wrappers retained

Copy: archetype, math-safe, pipeline completion.  
Studio: EQF, table fidelity, materials-copy, archetype, math, other scaffolds, graft last.

## 9. `PRISM_GAM_CANONICAL_ASSEMBLER` disposition

**Retained.** Bootstrap/global module exposure. `LIVE_PRODUCTION` status marker only. Not a feature flag. Cannot reactivate OLD by flipping marker. Version: `S79-T-008-RETIREMENT-1`.

## 10. Fail-closed behaviour

Missing assembler → throw `Canonical GAM assembler unavailable` on Copy build, Studio graft, and thin wrappers. No silent omit / OLD rebuild. Proven by T-008 tests.

## 11. Tests retained / retired / rewritten

| Suite | Disposition |
| ----- | ----------- |
| T-002 goldens + equivalence | **KEEP** |
| T-003 assembler | **KEEP** (version regex allows T-008) |
| T-005 live switch | **KEEP**; fallback inventory test → **rewritten** (retired markers) |
| T-006 integration | **KEEP**; fallback route test → **rewritten** (fail-closed) |
| T-008 retirement | **NEW** (9 tests) |
| `page-gam-enrich` | Bootstrap **updated** to load assembler |

## 12. Proof no OLD live GAM assembly remains

Repository search after cleanup:

- **No** `TEMPORARY FALLBACK` in `app.js`
- **No** Copy `if (canonicalCopyPrompt) return` fallthrough
- **No** Studio appendParts OLD graft body
- V2 Copy: single early return to canonical builder
- Remaining commission/brief helpers are thin wrappers only

Statement: **There is no remaining live OLD GAM normative assembly path** under page-enrichment V2.

(Non-V2 pack path retains a generic Copilot JSON contract line only — not V2 normative assembly.)

## 13. Live baseline equivalence

| Path | Result |
| ---- | ------ |
| LIVE Copy == T-002 `run-copy-partial-baseline.txt` | **BYTE-IDENTICAL** |
| LIVE Studio == T-002 `studio-partial-baseline.txt` | **BYTE-IDENTICAL** |

## 14. Files changed

| File | Change |
| ---- | ------ |
| `app.js` | Fail-closed; remove fallbacks/OLD V2; thin-wrap owners |
| `lib/gam-canonical-assembler.js` | Version T-008; header |
| `tests/s79-t-008-gam-legacy-retirement.test.js` | **NEW** |
| `tests/s79-t-005-*.test.js` | Rewrite fallback test |
| `tests/s79-t-006-*.test.js` | Rewrite fallback test |
| `tests/s79-t-003-*.test.js` | Version regex |
| `tests/page-gam-enrich.test.js` | Bootstrap assembler |
| Sprint records | T-007 accept; this record; nav |

## 15. Tests run

**203/203 pass, 0 fail** — T-008 (9) + T-002/3/5/6 + page-gam-enrich + gam-output-format + materials-preserve + T-051 + T-055 + blank-cell + T-042 + T-032 + practice independence + OPS prompt + disciplinary salience.

## 16. DLA untouched

`isDlaCanonicalAssemblerEnabled` / `dlaCanonicalAssembler` rollback flag **unchanged**. No DLA Phase D cleanup.

## 17. Deferred image-generation fidelity

T-007: downstream image model rendered incorrect ratio for a correct derivative relation; visual-only correction restored 91/100. **Follow-up / deferred diagnostic** — not fixed in T-008.

## 18. Remaining risks

1. Non-V2 pack GAM path still exists (intentional legacy mode).  
2. Guided-review Node vs live VM drift remains (pre-existing).  
3. Thin wrappers still exist for test API — fail closed if assembler missing.  
4. T-009 final closure not yet run.

## 19. Acceptance criteria

| # | Criterion | Met? |
| - | --------- | ---- |
| 1 | Copy temporary fallback removed | **Yes** |
| 2 | Studio temporary fallback removed | **Yes** |
| 3 | Obsolete OLD normative assembly removed | **Yes** |
| 4 | One live canonical normative authority | **Yes** |
| 5 | Missing assembler fails explicitly | **Yes** |
| 6 | Genuine compatibility intact | **Yes** |
| 7 | Path wrappers intact | **Yes** |
| 8 | Live == T-002 baselines | **Yes** |
| 9 | Regression suite passes | **Yes** (203/203) |
| 10 | DLA untouched | **Yes** |
| 11 | No new rollback flag / alternate route | **Yes** |

**S79-T-008 acceptance: MET.**

## 20. Exact recommended next task

**S79-T-009** — Final regression + closure gate.
