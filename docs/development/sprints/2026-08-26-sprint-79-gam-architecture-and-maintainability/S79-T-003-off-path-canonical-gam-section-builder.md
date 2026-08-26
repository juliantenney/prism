# S79-T-003 — Off-path canonical GAM section-builder

**Sprint:** 79 — GAM Architecture and Maintainability  
**Status:** COMPLETE  
**Date:** 2026-08-26  
**Mode:** OFF-PATH implementation + equivalence tests — **no production switch**

**Depends on:** [S79-T-002](S79-T-002-canonical-gam-section-inventory-and-equivalence-baseline.md)  
**Next:** **S79-T-004** — OLD vs TARGET equivalence acceptance gate (formal operator acceptance; no live switch)

---

## 1. Executive conclusion

Introduced `lib/gam-canonical-assembler.js` as the **off-path** TARGET canonical GAM ownership/assembly surface.

- **Whole-prompt byte identity** achieved for T-002 fixtures:
  - OLD Copy vs TARGET Copy (`run-copy-partial-baseline.txt`)
  - OLD Studio vs TARGET Studio (`studio-partial-baseline.txt`)
- Shared normative core (contract+shape+gate) byte-identical to live OLD / T-002 goldens.
- Path-specific Copy vs Studio composition is **explicit** (profiles) — Studio does **not** inherit Copy-only commission/completion/footer.
- Production `app.js` still uses OLD assembly; `LIVE_PRODUCTION === false`; no `gamCanonicalAssembler` flag.
- Topology for later **ATOMIC** T-005 switch is documented; temporary rollback retirement remains mandatory in **T-008**.

**Acceptance:** MET — sufficient to proceed to formal T-004 acceptance (do not switch yet).

---

## 2. Architecture implemented

```text
createGamAssemblyContext(raw)
  → resolveGamPolicyIngress(ctx)     // behaviour-neutral seam
  → profile-selected assembler:
       copy_v2_partial | copy_v2_nonpartial
       studio_v2_partial | studio_v2_nonpartial
  → section builders (canonical owners) + path wrappers
  → { text, sections, sectionOrder, liveProduction:false }
```

Layers:

1. **Internal assembly context** — only fields needed to reproduce current behaviour (not Settings schema / PB-FA-005).
2. **Neutral policy-ingress** — `resolveGamPolicyIngress`; `settingsEffective` forced false; **no text effect**.
3. **Canonical section builders** — output contract/shape, gate, commission (+WS2/OPS), authoring brief, completion override, footer, framing, upstream embed.
4. **Explicit path profiles** — Copy vs Studio wrappers; no flattening.
5. **Single pre-emit gate owner** — `buildSectionPreEmitGate` + Copy ensure-before-override + Studio graft append.
6. **Compatibility** — pack-text / materials-preserve **not** absorbed into assembler.

---

## 3. Canonical builder / API topology

| Export | Role |
| ------ | ---- |
| `PROFILES.*` | `copy_v2_partial`, `copy_v2_nonpartial`, `studio_v2_partial`, `studio_v2_nonpartial` |
| `createGamAssemblyContext` | Internal input boundary |
| `resolveGamPolicyIngress` | Neutral future Settings seam |
| `buildSectionOutputContract` / `buildSectionPreEmitGate` | Shared normative core |
| `buildSectionCommission` / `buildSectionAuthoringBrief` | Copy-owned normative sections |
| `buildSectionCompletionOverride` / `buildSectionStepFooter` | Copy-only late authority |
| `applyGamStudioGraft` | Studio GAM graft (contract+shape+gate; non-partial upstream) |
| `assembleCopyV2` / `assembleStudioV2` | Profile assemblers |
| `assembleGamCanonicalPrompt` | Single entry for tests / future T-005 |

**Adapters (optional):** `buildOutputContractAndShape`, `buildPreEmitGate`, `buildAuthoringBrief`, `buildCommissionSection`, `applyStudioRuntimeScaffolds`, pipeline open/close strings.

Equivalence tests inject **live VM** contract builders so TARGET matches live guided-review **fallback** resolution (see §10).

---

## 4. Canonical ownership / section map

| Section ID | TARGET owner | Notes |
| ---------- | ------------ | ----- |
| `output.contract_shape` | `buildSectionOutputContract` → `ld-gam-page-enrich-contract` (or live adapter) | Shared |
| `gate.pre_emit` | `buildSectionPreEmitGate` → `GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE` | Single owner |
| `commission.authority` | `buildSectionCommission` + WS2/OPS libs | Copy partial; not Studio partial |
| `authoring.brief` | `buildSectionAuthoringBrief` (gate at end) | Copy only |
| `completion.override` | `buildSectionCompletionOverride` | Copy only |
| `footer.step_n` | `buildSectionStepFooter` | Copy only |
| `copy.mode_framing` / runner / artefacts | Copy path wrapper | Run chrome |
| `studio.library_body` + `studio.runtime_scaffolds` | Studio path wrapper | EQF/math (or adapter chain) |
| `post.math` | Copy post-assembly | Marker-deduped |
| `pipeline.open` / `pipeline.close` | Copy framing | Defaults match live fallbacks |

Duplicated model-visible wording (contract vs brief) **preserved** under strict text preservation.

---

## 5. Copy TARGET assembly

Order (`COPY_V2_PARTIAL_SECTION_ORDER`):

pipeline.open → step.title → copy.mode_framing → output.contract_shape → commission.authority → runner_guidance → input_artefacts → authoring.brief → gate ensure → completion.override → footer.step_n → post.math → pipeline.close

---

## 6. Studio TARGET assembly

Order (`STUDIO_V2_PARTIAL_SECTION_ORDER`):

studio.library_body → studio.runtime_scaffolds → GAM graft (contract+shape + gate)

Partial mode: **no** AUTHORITATIVE commission; **no** completion override / Run footer.

---

## 7. Policy-ingress seam

`resolveGamPolicyIngress` / `NEUTRAL_POLICY_INGRESS`. Test proves injecting hypothetical settings keys does **not** change assembled text. No Settings catalogue; no PB-FA-005.

---

## 8. Final pre-emit gate ownership

- Single builder: `buildSectionPreEmitGate`.
- Copy: brief ends with gate; assembler re-ensures before completion override.
- Studio: graft appends gate once if absent.
- Gate text unchanged.

---

## 9. Compatibility treatment

| Path | Treatment |
| ---- | --------- |
| `gam-output-format` (pack-text) | Untouched; not imported by assembler |
| `page-gam-materials-preserve` | Untouched |
| Temporary dual assembly for migration | **Not created** in T-003; if T-005 needs a short-lived cutover aid, **T-008 must retire it** |

---

## 10. Guided-review drift treatment

T-002 finding preserved: Node `require(ld-gam-page-enrich-contract)` can resolve full guided-review; live VM uses fallback unless bootstrapped.

TARGET equivalence uses **live adapters** so TARGET matches live fallback. No opportunistic fix. Decision deferred (bootstrap always / accept Node-full as future SSOT) — out of T-003 behaviour change.

---

## 11. OLD vs TARGET equivalence results

| Case | Result |
| ---- | ------ |
| contract+shape | BYTE-IDENTICAL vs live + T-002 golden |
| gate | BYTE-IDENTICAL |
| commission section | BYTE-IDENTICAL vs T-002 golden |
| Copy whole prompt | BYTE-IDENTICAL vs `run-copy-partial-baseline.txt` |
| Studio whole prompt | BYTE-IDENTICAL vs `studio-partial-baseline.txt` |
| Copy ≠ Studio | Asserted (path-specific) |

Committed T-002 goldens were **not** regenerated from TARGET.

---

## 12. High-salience ordering results

Protected on TARGET Copy: schema before commission; commission before brief; gate before completion override; completion before literal footer; math after footer; pipeline completion last.

---

## 13. Production-path isolation proof

- `app.js` has no `assembleGamCanonicalPrompt` / `PRISM_GAM_CANONICAL_ASSEMBLER` / `gamCanonicalAssembler`.
- OLD functions remain the live assembly path.
- Assembler `LIVE_PRODUCTION === false`.

---

## 14. Files changed

| File | Change |
| ---- | ------ |
| `lib/gam-canonical-assembler.js` | **NEW** off-path assembler |
| `tests/s79-t-003-gam-canonical-assembler.test.js` | **NEW** OLD vs TARGET harness |
| This task record + sprint nav | Updated |

**Production behaviour:** unchanged.

---

## 15. Tests run

| Suite | Result |
| ----- | ------ |
| `tests/s79-t-003-gam-canonical-assembler.test.js` | **11/11 pass** |
| `tests/s79-t-002-gam-equivalence-baseline.test.js` | **7/7 pass** (with combined run) |
| `tests/s78-t-051-*.test.js` | pass |
| `tests/s78-t-055-*.test.js` | pass |
| `tests/s78-gam-learner-closure-packaging.test.js` | pass |

Exact combined run at close: **37/37 pass** (T-003 11 + T-002 7 + T-051 + T-032 closure + T-055).

---

## 16. Topology for atomic T-005

**T-005 should be a small routing change:**

1. **Copy:** `buildWorkflowStepInstructions` GAM V2 branch → `assembleGamCanonicalPrompt({ profile: copy_v2_*, ... })` (wire live deps: dla page resolve, math/archetype post if still external).
2. **Studio:** replace `applyGamPageEnrichPromptBlockToDraft` (+ optionally fold scaffolds into studio profile) → `assembleGamCanonicalPrompt({ profile: studio_v2_*, libraryBody, adapters })` **or** keep non-GAM scaffolds in `applyWorkflowStepRuntimePromptAugmentations` and call `applyGamStudioGraft` last.
3. Prefer **one shared call site family**; both paths flip together (**ATOMIC** per T-002).

**Obsolete after T-005 (candidates for T-008):** duplicated inline authoring brief / commission / gate ensure / completion override text in `app.js` once TARGET is sole owner; any temporary dual-call rollback helper.

**T-008 obligations:** remove temporary rollback dual-path if introduced; delete obsolete owners; keep genuine compatibility adapters.

**Do not** introduce a long-lived feature flag in T-003/T-005 for convenience.

---

## 17. Remaining risks / questions

1. Studio runtime scaffolds beyond EQF/math (table fidelity, materials-copy, archetype, …) are adapter-capable; default profile covers T-002 fixture — T-005 must wire full live scaffold parity or keep scaffolds in app.js with TARGET graft-only.
2. Guided-review bootstrap decision still open.
3. Non-partial enrich-in-place profile implemented but not whole-prompt golden-compared beyond T-002 embed section (embed builder present).
4. Authoring brief still duplicated vs live `app.js` until T-005/T-008 ownership cutover.

---

## 18. Acceptance criteria

| Criterion | Met? |
| --------- | ---- |
| Off-path canonical builder exists | **Yes** |
| Explicit Copy/Studio profiles | **Yes** |
| Policy-ingress neutral | **Yes** |
| Single gate owner + protected order | **Yes** |
| OLD vs TARGET equivalence evidence | **Yes** (whole-prompt same-path) |
| Production still OLD | **Yes** |
| Compatibility untouched | **Yes** |
| Atomic T-005 topology documented | **Yes** |

**S79-T-003 acceptance: MET.**

---

## 19. Exact recommendation for T-004

**S79-T-004 — OLD vs TARGET equivalence acceptance gate**

Formal gate using this evidence:

- Accept same-path whole-prompt byte identity for Copy and Studio T-002 baselines.
- Accept shared normative core + ordering ledger.
- Explicitly **do not** require Copy≡Studio.
- Record guided-review drift as known deferred (not a T-004 blocker if live adapters/VM path is the accepted OLD).
- On **ACCEPTED**, authorize T-005 atomic routing switch only — no prompt retune.
