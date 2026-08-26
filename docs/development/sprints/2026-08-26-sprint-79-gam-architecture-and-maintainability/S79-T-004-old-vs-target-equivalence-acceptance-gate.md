# S79-T-004 — Formal OLD vs TARGET equivalence acceptance gate

**Sprint:** 79 — GAM Architecture and Maintainability  
**Status:** COMPLETE (gate recorded)  
**Date:** 2026-08-26  
**Mode:** GATE / EVIDENCE ONLY — no production switch; no prompt retune; no TARGET edit

**Depends on:** [S79-T-002](S79-T-002-canonical-gam-section-inventory-and-equivalence-baseline.md), [S79-T-003](S79-T-003-off-path-canonical-gam-section-builder.md)  
**Next:** **S79-T-005** — live-path atomic switch (authorized by this gate; **not performed here**)

---

## 1. Executive gate conclusion

Same-path whole-prompt byte identity holds for every committed T-002 representative case:

| Case | OLD == TARGET == committed golden |
| ---- | --------------------------------- |
| Copy V2 partial | **Yes** (31 989 bytes) |
| Studio V2 partial | **Yes** (20 333 bytes) |
| Shared contract+shape | **Yes** |
| Shared pre-emit gate | **Yes** |
| Authoritative commission (+ WS2/OPS) | **Yes** |

High-salience Copy ordering is explicitly preserved. Studio path-specific exclusions (no partial commission / completion override) are preserved. Production remains on OLD. Compatibility adapters remain separate.

**Studio scaffolds caveat (resolved):** TARGET is architecturally complete for the T-002-proven Studio branch and can reproduce the full live Studio chain when scaffolds are supplied via `applyStudioRuntimeScaffolds` (or when T-005 keeps live scaffolds in `app.js` and only swaps the GAM graft). Default EQF+math helpers cover the committed golden; conditional scaffolds (table fidelity, materials-copy, archetype, etc.) are **live path-wrapper responsibilities** that T-005 **must wire**, not TARGET normative defects hidden from this gate.

**Copy archetype post-assembly:** absent on T-002 baseline (no plans); live OLD applies it when plans exist; TARGET `assembleCopyV2` currently ends with math + pipeline close. T-005 **must** retain live `applyLdInstructionalArchetypeRoutingToDraft` as an external post-step (as T-003 topology already anticipated) or extend TARGET with an equivalent post-hook **before/during** the switch — wiring only, not semantic rewrite.

### S79-T-004 GATE DECISION

**ACCEPTED**

Production switch under S79-T-005 is authorized, but has not yet been performed.

---

## 2. OLD vs TARGET section / invariant ledger

| Section / responsibility | OLD owner | TARGET owner | Copy | Studio | Requirement | Evidence | Result |
| ------------------------ | --------- | ------------ | ---- | ------ | ----------- | -------- | ------ |
| Pipeline opening | `getPipelineExecutionOpeningDirective` | `buildSectionPipelineOpening` | Y | N | byte/text | Copy golden | **BYTE-IDENTICAL** |
| Step / mode framing | `buildWorkflowStepInstructions` GAM branch | `buildSectionCopyModeFraming` | Y | N | byte/text | Copy golden | **BYTE-IDENTICAL** |
| Output contract | `buildGamPageEnrichContractBlock` | `buildSectionOutputContract` | Y | Y | byte | shared golden + both prompts | **BYTE-IDENTICAL** |
| Canonical shape | `buildCanonicalGamMaterialShapeSnippet` | same | Y | Y | byte | shared golden | **BYTE-IDENTICAL** |
| Guided-review lines (live) | contract via live VM fallback | live adapter / same contract | Y | Y | preserve live | guided-review note + T-003 | **BYTE-IDENTICAL** (live path) |
| Instructional depth (in contract) | contract block | same | Y | Y | byte | contract golden | **BYTE-IDENTICAL** |
| Authoritative commission | `buildAuthoritativeDlaMaterialCommissionSectionFromPage` | `buildSectionCommission` | partial Y | partial N | byte when present | commission golden; Studio excludes | **BYTE-IDENTICAL** / **PATH-SPECIFIC AND PRESERVED** |
| WS2 model/practice | `gam-practice-independence-prompt` | same via commission | with commission | N (partial) | byte when present | commission golden | **BYTE-IDENTICAL** |
| OPS suitability prompt | `gam-operational-suitability-prompt` | same via commission | with commission | N (partial) | byte when present | commission golden | **BYTE-IDENTICAL** |
| Material authoring brief | `buildGamV2CopyMaterialAuthoringBrief` | `buildSectionAuthoringBrief` | Y | N | byte | Copy golden | **BYTE-IDENTICAL** / **PATH-SPECIFIC AND PRESERVED** |
| Workspace / template / table instructions | contract + brief + optional L4 scaffolds | contract/brief + Studio scaffold adapter | Y | cond. | preserve | golden + ledger | **BYTE-IDENTICAL** (normative text); scaffolds **PATH-SPECIFIC AND PRESERVED** via T-005 wiring |
| Evidence relationships | contract + brief | same | Y | Y (contract) | byte | goldens | **BYTE-IDENTICAL** |
| Diagnostic / check-revision | contract guided-review + commission fields | same | Y | Y | preserve live | goldens | **BYTE-IDENTICAL** |
| Transfer | contract + brief (S78-T-041) | same | Y | Y | byte | T-055 + goldens | **BYTE-IDENTICAL** |
| Closure | contract + brief (S78-D04/T-055) | same | Y | Y | byte | T-032/T-055 + goldens | **BYTE-IDENTICAL** |
| Disciplinary fidelity | S78-DP lines | same | Y | Y | byte | goldens | **BYTE-IDENTICAL** |
| Quantitative consistency (gate) | `GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE` | `buildSectionPreEmitGate` | Y | Y | byte | gate golden; T-051 | **BYTE-IDENTICAL** |
| Final silent pre-emit placement | brief end + ensure; Studio graft | same ownership | Y | Y | order | T-003 order test | **ORDER-EQUIVALENT** |
| Completion override | inline Copy | `buildSectionCompletionOverride` | Y | N | byte | Copy golden | **BYTE-IDENTICAL** / **PATH-SPECIFIC AND PRESERVED** |
| `STEP N OUTPUT` footer | Copy footer block | `buildSectionStepFooter` | Y | N | literal | Copy golden | **BYTE-IDENTICAL** / **PATH-SPECIFIC AND PRESERVED** |
| Runner guidance / input artefacts | Copy chrome | Copy sections | Y | N | byte | Copy golden | **BYTE-IDENTICAL** |
| Post math (LD-MATH-RENDER) | Copy post + Studio chain | Copy post; Studio scaffold | Y | Y | byte on baseline | goldens | **BYTE-IDENTICAL** |
| Archetype routing (conditional) | live post-apply when plans | **not inside assembleCopyV2**; T-005 external post | cond. | cond. | preserve when present | baseline absent both | **PATH-SPECIFIC AND PRESERVED** (T-005 binding; baseline N/A) |
| Pipeline close | completion directive | `buildSectionPipelineCompletion` | Y | N | byte | Copy golden | **BYTE-IDENTICAL** |
| Studio library body | override/library | `studio.library_body` | N | Y | byte | Studio golden | **BYTE-IDENTICAL** |
| Studio runtime scaffolds | full `applyWorkflowStepRuntimePromptAugmentations` pre-graft | default EQF+math **or** `applyStudioRuntimeScaffolds` | N | Y | preserve live | golden + full-adapter proof | **PATH-SPECIFIC AND PRESERVED** (see §7) |
| Studio GAM graft | `applyGamPageEnrichPromptBlockToDraft` | `applyGamStudioGraft` | N | Y | byte | Studio golden | **BYTE-IDENTICAL** |
| Policy-ingress seam | n/a (OLD) | `resolveGamPolicyIngress` | both | both | behaviour-neutral | T-003 test | **BYTE-IDENTICAL** (no text effect) |
| Pack-text compatibility | `gam-output-format` | not absorbed | n/a | n/a | untouched | T-003 test | **COMPATIBILITY UNAFFECTED** |
| Materials preserve | `page-gam-materials-preserve` | not absorbed | n/a | n/a | untouched | T-003 test | **COMPATIBILITY UNAFFECTED** |
| Non-partial upstream embed | `buildUpstreamDlaPageEmbedSectionForGamCopy` | `buildSectionUpstreamFullEmbed` | mode | mode | byte section | T-002 embed golden via commission path tests | **BYTE-IDENTICAL** (section builder; whole-prompt non-partial not a T-002 whole-prompt golden) |

No **FAIL** rows on committed representative cases.

---

## 3. Copy whole-prompt equivalence

| Artefact | Bytes | SHA-256 |
| -------- | ----- | ------- |
| Committed `run-copy-partial-baseline.txt` | 31989 | `d31c92d2a4b7190baea0c516f776f62cad03e7fc26a9f75c2f0976b9e4b790aa` |
| LIVE OLD `buildWorkflowStepInstructions` | 31989 | same |
| TARGET `assembleGamCanonicalPrompt(copy_v2_partial)` | 31989 | same |

**OLD COPY == TARGET COPY == committed golden** (byte-for-byte).

---

## 4. Studio whole-prompt equivalence

| Artefact | Bytes | SHA-256 |
| -------- | ----- | ------- |
| Committed `studio-partial-baseline.txt` | 20333 | `9beeab4500c20ef8da1e06dfa60f43766905a9ce5c07f48108ab8f22f878ad8b` |
| LIVE OLD `applyWorkflowStepRuntimePromptAugmentations` | 20333 | same |
| TARGET Studio (default and full-adapter) | 20333 | same |

**OLD STUDIO == TARGET STUDIO == committed golden** (byte-for-byte).

Copy was **not** compared to Studio for equality (path-specific by design).

---

## 5. Baseline-independence proof

| Check | Result |
| ----- | ------ |
| T-002 goldens committed in `dbdce21` (2026-08-26 10:50 +0100) *before* untracked T-003 `lib/gam-canonical-assembler.js` | **Pass** |
| T-003 tests read goldens with `assert.equal`; do not write/refresh | **Pass** |
| T-002 refresh only when `UPDATE_S79_BASELINES=1` | **Pass** |
| Gate run: `UPDATE_S79_BASELINES` unset | **Pass** |
| After gate suite: `tests/fixtures/s79-t-002/` clean (no modifications) | **Pass** |
| Goldens not regenerated from TARGET | **Pass** |

---

## 6. High-salience ordering evidence

### Copy / Run (PASS)

| Relationship | Result |
| ------------ | ------ |
| Contract/shape before commission | **PASS** |
| Commission before authoring brief | **PASS** |
| Gate before completion override | **PASS** |
| Completion override before literal `STEP N OUTPUT` footer (verbatim block) | **PASS** |
| Math after footer; pipeline close after math | **PASS** |
| Whole-prompt byte identity implies order identity for baseline | **PASS** (plus explicit T-003 order assertions) |

### Studio (PASS)

| Relationship | Result |
| ------------ | ------ |
| Library body first | **PASS** |
| Runtime scaffolds before GAM graft | **PASS** |
| Contract/shape then gate in graft; no partial commission | **PASS** |
| No completion override / Run footer | **PASS** |

---

## 7. Studio scaffolds caveat resolution

### What OLD Studio assembles

`applyWorkflowStepRuntimePromptAugmentations` (ordered): guided scaffold (cond.) → cognition → **EQF** → patterns (cond.) → self-directed → **table fidelity** → **materials-copy** → instructional depth apply → **archetype** → PEL → DP (n/a) → thin → VA → **math** → strict JSON → DLA block → **GAM graft**.

### What TARGET represents

- **GAM graft:** `applyGamStudioGraft` (canonical).
- **Default scaffolds:** EQF + math (sufficient for T-002 golden).
- **Full scaffolds:** optional `adapters.applyStudioRuntimeScaffolds` (proven: full live pre-graft + TARGET graft ⇒ byte-identical to OLD).

### What the T-002 Studio golden proves

For the representative workflow, `shouldApplySelfDirectedLearnerPageGamMaterialScaffold` is **false**; table-fidelity / materials-copy / archetype blocks do **not** inject. Observed model-visible Studio chrome on the golden is library body + EQF + math + GAM contract/shape/gate (depth text comes from the contract block). Classification JSON’s `table_fidelity_marker: true` reflects substring mention inside math/contract text, **not** a separate `LD-TABLE-FIDELITY (auto-applied)` block.

### What is NOT a TARGET equivalence defect

Conditional Studio scaffolds beyond the golden are **live path wrappers**. TARGET exposes an adapter seam; T-003 topology allows keeping scaffolds in `app.js` and swapping only the graft.

### T-005 binding constraint (required)

T-005 Studio routing **must**:

1. Keep the full live pre-graft augmentation chain and call TARGET `applyGamStudioGraft` last, **or**
2. Pass an `applyStudioRuntimeScaffolds` adapter that is behaviour-equivalent to that chain,

and **must not** ship default EQF+math-only as the sole Studio production path if that would drop conditional live augmentations on other workflows.

This is **wiring**, not missing TARGET normative ownership for the accepted baselines.

---

## 8. Guided-review drift assessment

| Aspect | Finding |
| ------ | ------- |
| Drift exists OLD? | Yes — Node require can include full guided-review; live VM uses fallback unless bootstrapped (`guided-review-bootstrap-note.json`) |
| TARGET introduces new drift? | **No** — equivalence uses live adapters; TARGET matches live OLD fallback |
| Behaviour change? | **None** for this gate |
| Treatment | Pre-existing; deferred; not a T-004 blocker |

---

## 9. Protected-invariant assessment

Assembly-level preservation (text present in TARGET goldens / shared core):

| Invariant | Assessment |
| --------- | ---------- |
| 1:1 required_materials fulfilment instructions | **Preserved** |
| No uncommissioned substitution | **Preserved** |
| Empty GAM synthesis / no page_synthesis ownership | **Preserved** |
| Workspace/template/table authoring rules | **Preserved** (normative); L4 scaffolds per §7 |
| Evidence reshape rules | **Preserved** |
| Model/practice independence (WS2) | **Preserved** when commission present |
| Diagnostic check/revision | **Preserved** (live guided-review surface) |
| Transfer + closure + separation | **Preserved** (T-032/T-055 green) |
| Disciplinary fidelity | **Preserved** |
| Quantitative / final pre-emit semantics | **Preserved** (T-051 green) |
| Settings / workspace capabilities / schemas / validators / OPS / DLA / DP ownership | **Unchanged** (no production edits in T-004) |

---

## 10. Compatibility assessment

| Path | Classification |
| ---- | -------------- |
| `lib/gam-output-format.js` (pack-text) | **GENUINE COMPATIBILITY — PRESERVED** |
| `lib/page-gam-materials-preserve.js` | **GENUINE COMPATIBILITY — PRESERVED** |
| Temporary GAM dual-assembly rollback | **Not introduced** in T-003/T-004; if T-005 adds any temporary aid, **T-008 must retire it** |

---

## 11. Canonical ownership assessment

TARGET (`lib/gam-canonical-assembler.js`) provides one obvious owner per normative family for assembly, with explicit Copy/Studio profiles.

| Finding | Status |
| ------- | ------ |
| Shared contract/shape/gate single TARGET surface | **Coherent** |
| Commission / brief / override / footer Copy-owned | **Coherent** |
| Studio graft single TARGET surface | **Coherent** |
| Duplicated model-visible wording (contract ↔ brief) | **Preserved intentionally** (strict text preservation); not TARGET dual owners of conflicting text |
| OLD `app.js` still duplicates owners | **Expected** until T-005/T-008 |
| Conditional archetype / Studio L4 scaffolds | Path wrappers; T-005 wiring (see §7) — not conflicting TARGET normative owners |

---

## 12. Atomic-switch readiness

**ATOMIC** Run/Copy + Studio remains the plan.

Expected T-005 routing (high level — not implemented):

```text
OLD Copy:  buildWorkflowStepInstructions (GAM V2 branch)
  → TARGET assembleGamCanonicalPrompt({ profile: copy_v2_* , … })
  → retain applyLdInstructionalArchetypeRoutingToDraft when plans present (external post)

OLD Studio: applyWorkflowStepRuntimePromptAugmentations … applyGamPageEnrichPromptBlockToDraft
  → keep live scaffolds OR adapter
  → TARGET applyGamStudioGraft / assembleStudioV2 last
```

| Question | Answer |
| -------- | ------ |
| Only routing/wiring? | **Yes**, for accepted TARGET + binding post-hooks |
| Semantic construction still required? | **No** for T-002-proven surfaces |
| Missing builder work blocking gate? | **No** — constraints are wiring obligations for T-005 |

---

## 13. Production isolation proof

| Check | Result |
| ----- | ------ |
| `app.js` contains no `PRISM_GAM_CANONICAL_ASSEMBLER` / `assembleGamCanonicalPrompt` / `gamCanonicalAssembler` | **Pass** |
| Assembler `LIVE_PRODUCTION === false` | **Pass** |
| T-004 made no production behaviour changes | **Pass** (docs only) |

---

## 14. Files changed (this task)

| File | Change |
| ---- | ------ |
| `S79-T-004-old-vs-target-equivalence-acceptance-gate.md` | **NEW** (this record) |
| Sprint nav: `STATUS.md`, `PLAN.md`, `HANDOVER.md`, `next-chat-briefing.md`, `SPRINT-79-START-HERE.md` | T-004 complete → next T-005 |
| `decisions.md` | Gate decision entry |

**Production / assembler / goldens:** unchanged.

---

## 15. Tests run

| Suite | Result |
| ----- | ------ |
| `tests/s79-t-002-gam-equivalence-baseline.test.js` | **7/7 pass** |
| `tests/s79-t-003-gam-canonical-assembler.test.js` | **11/11 pass** |
| `tests/s78-t-051-gam-first-pass-consistency-hardening.test.js` | **pass** |
| `tests/s78-t-055-transfer-closure-markdown-fix.test.js` | **pass** |
| `tests/s78-gam-learner-closure-packaging.test.js` | **pass** |
| **Combined** | **37/37 pass, 0 fail** |

`UPDATE_S79_BASELINES` unset; T-002 fixtures unmodified after run.

---

## 16. Unresolved risks / issues (non-blocking)

1. **T-005 must wire** Studio full scaffold chain (or equivalent adapter) and Copy archetype post when plans exist.
2. Guided-review Node vs live VM drift remains pre-existing / deferred.
3. Non-partial whole-prompt golden not in T-002 suite (embed section covered); T-005 should include a smoke check for non-partial profiles.
4. Authoring brief remains duplicated in OLD `app.js` until cutover/T-008 retirement.

---

## 17. Acceptance criteria checklist

| Criterion | Met? |
| --------- | ---- |
| OLD vs TARGET ledger | **Yes** |
| Byte/text where strict preservation expected | **Yes** |
| High-salience ordering explicit | **Yes** |
| Same-path whole-prompt equivalence | **Yes** |
| Studio scaffolds caveat resolved | **Yes** |
| Explicit ACCEPTED / NOT ACCEPTED | **Yes — ACCEPTED** |
| No production switch | **Yes** |

---

## 18. Exact recommended next task

**S79-T-005 — Live-path switch to canonical assembly (ATOMIC)**

Wire Run/Copy and Studio to TARGET together under the binding constraints in §7 and §12. Do not retune prompts. Bound any temporary dual-path tightly for mandatory **S79-T-008** retirement.
