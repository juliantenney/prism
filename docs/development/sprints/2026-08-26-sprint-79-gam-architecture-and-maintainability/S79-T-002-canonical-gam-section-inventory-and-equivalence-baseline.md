# S79-T-002 — Canonical GAM section inventory + equivalence baseline

**Sprint:** 79 — GAM Architecture and Maintainability  
**Status:** COMPLETE  
**Date:** 2026-08-26  
**Mode:** DESIGN + TESTS ONLY — no production path switch; no prompt retune; no schema/validator/DLA/DP/OPS/Settings/workspace capability changes

**Depends on:** [S79-T-001](S79-T-001-sprint-open-architecture-diagnostic-target-design-and-implementation-plan.md)  
**Next:** **S79-T-003** — off-path canonical section-builder module

---

## 1. Executive conclusion

Current live GAM assembly is **two entry points sharing some builders, not one assembler**:

| Path | Entry | Shared normative core | Path-specific wrappers |
| ---- | ----- | -------------------- | ---------------------- |
| **Run/Copy V2** | `buildWorkflowStepInstructions` | `buildGamV2CopilotSchemaInstructions` + gate | framing, AUTHORITATIVE commission (partial), authoring brief, completion override, footer, selective post-assembly (archetype + math), pipeline directives |
| **Studio** | `resolveStepPromptText` → `applyWorkflowStepRuntimePromptAugmentations` → `applyGamPageEnrichPromptBlockToDraft` | same contract+shape+gate builders | library/override body + full runtime augmentation chain; **no** AUTHORITATIVE commission in partial mode; **no** GAM completion override |

**T-004 must not require whole-prompt byte identity.** Narrow byte-identical boundary:

`buildGamV2CopilotSchemaInstructions()` + `GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE` + protected Copy ordering (gate before completion override).

**Run/Copy vs Studio switch recommendation: A — ATOMIC** (see §11), with a single shared canonical builder as the migration target. Sequential dual-path is possible but higher mixed-authority risk; defer only topology details of *how* the shared builder is factored to T-003, not *whether* both paths should share it.

**Acceptance:** inventory, anatomies, baselines, equivalence classification, ordering ledger, test map, and switch recommendation are repository-backed. Production behaviour unchanged.

---

## 2. Investigation scope / files inspected

- `app.js` — `buildWorkflowStepInstructions` (GAM branch), `buildGamV2CopyMaterialAuthoringBrief`, `buildGamV2CopilotSchemaInstructions`, `buildUpstreamDlaPageEmbedSectionForGamCopy`, `buildAuthoritativeDlaMaterialCommissionSectionFromPage`, `applyGamPageEnrichPromptBlockToDraft`, `applyWorkflowStepRuntimePromptAugmentations`, post-assembly archetype/math inject, `publishFinalGamPromptSnapshot`
- `lib/ld-gam-page-enrich-contract.js`
- `lib/page-gam-enrich.js` (validation counterpart — not prompt assembly)
- `lib/page-gam-materials-preserve.js` (composition — not model-visible GAM prompt)
- `lib/workflow-page-capture-normalize.js`
- `lib/page-vnext-assemble.js`
- `lib/gam-output-format.js` (pack-text compatibility)
- `lib/ld-materials-copy.js`, `lib/ld-table-fidelity.js` (Studio runtime chain)
- `lib/gam-practice-independence-prompt.js`, `lib/gam-operational-suitability-prompt.js`
- `lib/guided-review-generation-contract.js` (via drift finding)
- `tests/prism-vm-lib-bootstrap.js` + existing S78 GAM suites
- Sprint 79 plan / T-001 (method constraints)

---

## 3. Current Run/Copy assembly anatomy (V2, live)

Entry: `buildWorkflowStepInstructions(step, index, domElement)` when step is Generate Activity Materials and `pageEnrichmentV2`.

Ordered model-visible assembly (partial mode — primary current product path):

| # | Section | Source | Notes |
| - | ------- | ------ | ----- |
| 1 | Pipeline opening directive | `getPipelineExecutionOpeningDirective()` | Framing |
| 2 | Step title line | inline | Framing |
| 3 | Partial-mode framing lines | inline GAM branch | Partial vs enrich-in-place diverge |
| 4 | Copilot output contract + exact footer mention | inline | Mentions `STEP N OUTPUT` early |
| 5 | GAM schema contract + canonical shape | `buildGamV2CopilotSchemaInstructions()` | Normative |
| 6 | AUTHORITATIVE DLA MATERIAL COMMISSION (+ WS2/OPS when bindings) | `buildUpstreamDlaPageEmbedSectionForGamCopy` → commission section | Derived authority; **partial only** |
| 7 | Optional designer notes | `step.notes` (params stripped) | Contextual |
| 8 | Material authoring guidance + brief (+ gate at end of brief) | `buildGamV2CopyMaterialAuthoringBrief()` | Normative authoring |
| 9 | Gate re-ensure (if missing) | `resolveGamFinalSilentPreEmitConsistencyGate()` | Deduped |
| 10 | GAM completion override | inline | High-salience late authority |
| 11 | Literal `STEP N OUTPUT: …` footer block | inline | Footer contract |
| 12 | Archetype routing (conditional) | `applyLdInstructionalArchetypeRoutingToDraft` | Post-assembly |
| 13 | LD-MATH-RENDER (V2 Copy) | `applyMathSafeOutputContractToDraft` | Post-assembly; marker-deduped |
| 14 | Pipeline completion directive | `getPipelineExecutionCompletionDirective()` | Framing |

**Non-partial enrich-in-place:** step 6 becomes full `### Upstream DLA page` embed + activity-count invariant instead of AUTHORITATIVE commission.

**Late mutation:** yes — archetype and math after footer; completion override after gate. Do not treat pre-footer text as final authority without these.

---

## 4. Current Studio assembly anatomy (live)

Entry: library/override body → `applyWorkflowStepRuntimePromptAugmentations(draft, step, wf)`.

Ordered chain (GAM step):

| # | Section | Source | Notes |
| - | ------- | ------ | ----- |
| 0 | Library / override body | step prompt source | Path-specific |
| 1–n | Shared runtime scaffolds | guided scaffold (cond.), cognition, EQF, patterns (cond.), self-directed, **table fidelity**, materials-copy, instructional depth, archetype, PEL, Design Page (n/a), thin assembly, VA, **math**, strict JSON | Many are no-ops for typical GAM; table fidelity observed on baseline fixture |
| last graft | GAM contract + shape | `applyGamPageEnrichPromptBlockToDraft` | Same builders as Copy |
| last graft | Upstream DLA embed | only if **not** partial mode | **Partial: omitted** |
| last graft | Final silent pre-emit gate | same resolver; skip if present | Normative |

Studio does **not** add GAM completion override or Run pipeline footer via this chain. Operator Copy of Studio draft may later go through `buildWorkflowStepInstructions` / publish snapshot depending on UI path — observability via `publishFinalGamPromptSnapshot` on Run Copy.

---

## 5. Canonical section / ownership ledger

| ID | Owner / function | File | Paths | Class | Dup? | Model-visible | Strict preserve? | Validation/tests | Downstream invariant | Future family (T-003) |
| -- | ---------------- | ---- | ----- | ----- | ---- | ------------- | ---------------- | ---------------- | -------------------- | --------------------- |
| `gam.pipeline.open` | `getPipelineExecutionOpeningDirective` | `app.js` | Copy | framing | no | yes | text preserve | pipeline suites | autonomous execution | routing |
| `gam.step.framing` | GAM branch lines in `buildWorkflowStepInstructions` | `app.js` | Copy | framing | no | yes | yes (mode-specific) | Copy delivery tests | partial vs enrich-in-place | routing |
| `gam.output.envelope` | `buildGamPageEnrichContractBlock` | `ld-gam-page-enrich-contract.js` | Copy+Studio | normative + output contract | yes (shared builder) | yes | **byte** | enrich + S78 suites | shape/forbidden fields | output contract |
| `gam.output.shape` | `buildCanonicalGamMaterialShapeSnippet` | same | Copy+Studio | normative example | yes | yes | **byte** | enrich tests | capture shape | output contract |
| `gam.guided_review` | contract concat + `guided-review-generation-contract` | contract file (+ optional lib) | Copy+Studio | normative | **bootstrap drift** | yes | yes when live | guided-review tests | checklist bodies | diagnostic |
| `gam.instructional_depth` | lines inside contract (+ Studio `applyLdGamInstructionalDepthContractToDraft`) | contract / depth lib | both (Studio may double-apply with marker) | normative | partial | yes | yes | depth tests | body richness | material authoring |
| `gam.closure` | S78-D04/T-055 lines in contract + brief | contract + brief | both | normative | yes (contract+brief overlap) | yes | yes | T-032/T-055 | study_tips transport | closure |
| `gam.transfer` | T-041 lines | contract + brief | both | normative | yes | yes | yes | T-041/T-055 | transfer production | transfer |
| `gam.workspace` | T-042 + blank-cell lines | contract + brief | both | normative | yes | yes | yes | T-042/T-007 | template/table blanks | workspace |
| `gam.evidence` | evidence fulfilment lines | contract + brief | both | normative | yes | yes | yes | evidence suites | provider bodies | evidence |
| `gam.disciplinary` | S78-DP lines | contract + brief | both | normative | yes | yes | yes | T-026 | claim strength | disciplinary |
| `gam.commission.authority` | `buildAuthoritativeDlaMaterialCommissionSectionFromPage` | `app.js` | Copy partial; Studio non-partial only | derived upstream | path-specific | yes | payload deterministic | E1/WS tests | 1:1 fulfilment | commission interpretation |
| `gam.ws2` | `buildS78Ws2OperandAwareAuthoringBlock` | `gam-practice-independence-prompt.js` | with commission | normative conditional | no | yes | yes | WS2 tests | model≠attempt | model/practice |
| `gam.ops_prompt` | `buildOperationalSuitabilityAuthoringBlock` | `gam-operational-suitability-prompt.js` | with commission | normative conditional | no | yes | yes | OPS prompt tests | suitability | quantitative/ops |
| `gam.upstream.full_embed` | non-partial DLA page embed + count invariant | `app.js` | Copy+Studio when non-partial | derived | path | yes | page JSON | enrich-in-place | full-page preserve | commission / compatibility |
| `gam.authoring.brief` | `buildGamV2CopyMaterialAuthoringBrief` | `app.js` | Copy only | normative authoring | no | yes | **byte** for brief | T-051 | hydration rules | material authoring |
| `gam.gate.pre_emit` | `GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE` | contract constant | both | final gate | yes (deduped) | yes | **byte** | T-051 | role+quant consistency | final gate |
| `gam.completion.override` | inline | `app.js` | Copy only | late authority | no | yes | yes | T-051 order | anti-refusal | footer/completion |
| `gam.footer.step_n` | exact footer | `app.js` | Copy | footer | no | yes | literal | strict JSON suites | runner | footer |
| `gam.post.archetype` | archetype routing | archetype lib via app | both when plans present | routing | shared apply | yes | conditional | archetype GAM tests | plan realisation | routing |
| `gam.post.math` | LD-MATH-RENDER | math lib via app | Copy V2 + Studio chain | normative shared | yes | yes | yes | T-028/T-029 | math delimiters | material authoring |
| `gam.pipeline.close` | completion directive | `app.js` | Copy | framing | no | yes | yes | — | stop after emit | routing |
| `gam.compat.pack_text` | `gam-output-format` | lib | capture/compat | compatibility | n/a | not primary V2 prompt | preserve if product path | pack-text tests | legacy capture | compatibility adapter |
| `gam.studio.library_body` | override/library | step | Studio | path-specific | — | yes | content varies | Studio tests sparse | seed text | contextual |

**Taxonomy mismatch vs T-001:** T-001 families still fit, but live code also needs explicit **routing/framing**, **bootstrap-dependent guided-review depth**, and **path-specific commission injection** as first-class ledger rows — not only “material authoring.”

---

## 6. Run/Copy vs Studio equivalence findings

| Surface | Classification | Evidence |
| ------- | -------------- | -------- |
| Live contract+shape (`buildGamV2CopilotSchemaInstructions`) | **BYTE-IDENTICAL** on both live paths | Shared API builder; baselines include both |
| Pre-emit gate | **BYTE-IDENTICAL** | Same constant/resolver; once per path |
| AUTHORITATIVE commission (partial) | **PATH-SPECIFIC BY DESIGN** | Copy yes; Studio graft skips in partial mode |
| Authoring brief | **PATH-SPECIFIC BY DESIGN** | Copy only |
| Completion override + STEP footer + pipeline wrappers | **PATH-SPECIFIC BY DESIGN** | Copy/Run instructions |
| Full DLA embed (non-partial) | **PATH-SPECIFIC / mode** | Both can get it when not partial |
| Node `require(contract)` vs live VM contract guided-review lines | **SUSPECTED DRIFT / REQUIRES DECISION** | `guided-review-bootstrap-note.json` — full vs fallback |
| LD-TABLE-FIDELITY marker on baseline fixture | both true | Not a Copy/Studio split for this fixture |
| LD-MATERIALS-COPY | both absent | — |
| Archetype routing on baseline fixture | both absent (no plans) | Delivery fix still required when plans exist |

**T-004 narrower equivalence boundary (required):**

1. Live `buildGamV2CopilotSchemaInstructions()` text  
2. `GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE` text  
3. Copy ordering: gate before `GAM completion override`  
4. Commission projection determinism for a given DLA page (when path includes it)

Whole assembled Copy vs Studio prompts are **not** byte-comparable.

---

## 7. High-salience ordering ledger

| Constraint | Status |
| ---------- | ------ |
| Schema/shape before upstream authority | **semantically required** + regression-useful |
| Commission embed before authoring brief | **semantically required** (Copy) |
| Gate at end of authoring brief / before completion override | **semantically required** + **T-051 protected** |
| Completion override before literal footer | **semantically required** |
| Archetype/math after main body (Copy) | **regression-protected delivery**; order after footer is incidental historically but must remain present |
| Pipeline completion last | **semantically required** (stop rule) |
| Studio: runtime scaffolds before GAM graft | **incidental to product** except marker-dedupe; graft last is **required** for current design |
| WS2/OPS after commission JSON | **semantically required** when present |

---

## 8. Baseline harness / tests added

| Artefact | Role |
| -------- | ---- |
| `tests/s79-t-002-gam-equivalence-baseline.test.js` | Live Copy + Studio capture; shared builder stability; classification; commission; non-partial embed; no production flag |
| `tests/fixtures/s79-t-002/dla-commission-baseline.json` | Representative DLA commission (WS2, workspace table+template, checklist, transfer, closure host) |
| `tests/fixtures/s79-t-002/run-copy-partial-baseline.txt` | Golden Copy assembled prompt |
| `tests/fixtures/s79-t-002/studio-partial-baseline.txt` | Golden Studio augmented prompt |
| `tests/fixtures/s79-t-002/shared-live-contract-shape.txt` | Golden live contract+shape |
| `tests/fixtures/s79-t-002/shared-pre-emit-gate.txt` | Golden gate |
| `tests/fixtures/s79-t-002/authoritative-commission-section.txt` | Golden commission (+ WS2/OPS) |
| `tests/fixtures/s79-t-002/upstream-dla-embed-nonpartial.txt` | Golden non-partial embed |
| `tests/fixtures/s79-t-002/equivalence-classification.json` | Machine-readable classification |
| `tests/fixtures/s79-t-002/guided-review-bootstrap-note.json` | Guided-review drift note |

Refresh goldens intentionally: `UPDATE_S79_BASELINES=1 node --test tests/s79-t-002-gam-equivalence-baseline.test.js`

---

## 9. Existing regression coverage and gaps

**Strong:** enrich/capture (`page-gam-enrich`, capture gates); T-051 gate; T-032/T-055 closure/transfer; WS2/OPS prompts; blank cells; archetype Copy delivery; materials preserve/composition/export suites.

**Gaps:**

- Few Studio-specific end-to-end GAM prompt baselines before T-002 (now addressed for partial mode).  
- Guided-review full contract may not be on live VM path without bootstrap (drift recorded).  
- Pack-text compatibility not in model-visible V2 baseline (correct — separate adapter).  
- No single “section ledger” test before T-002 (docs + classification JSON now).

**Do not delete/weaken** existing S78 guards.

---

## 10. Genuine compatibility vs temporary/legacy

| Kind | Finding |
| ---- | ------- |
| Pack-text (`gam-output-format`) + materials preserve | **GENUINE COMPATIBILITY / composition** — keep; not temporary GAM assembler rollback |
| Copy vs Studio dual assembly today | **LIVE dual authority** (pre-migration) — target for unification; temporary rollback machinery for S79 migration must be retired in **T-008**, not left as Phase D |
| DLA `dlaCanonicalAssembler: false` | **Separate deferred** — not touched |
| Guided-review Node vs VM resolution | **Bootstrap/live drift** — decide in T-003 whether canonical builder must always load full guided-review SSOT |

---

## 11. Atomic vs sequential switch recommendation

**Recommendation: A — ATOMIC** for T-005.

Reasons:

- Shared builders already exist for the normative core; the problem is dual **wrappers**, not two unrelated rule languages.  
- Sequential switch leaves Copy with commission+completion override while Studio lacks them (or vice versa) — high mixed-authority risk.  
- Rollback isolation is cleaner if both routes call one new function behind a single cutover.  
- Test coverage now baselines both; T-004 can accept shared core before atomic switch.

**T-003 must still resolve:** exact module/API shape of the shared assembler (section builders + path wrappers), and whether Studio partial mode should *gain* commission projection as part of unification or remain intentionally path-specific (product decision — record explicitly; default for maintainability is to **share commission projection** when DLA capture exists, but that would be a **behaviour change** and is **out of T-002/T-003 off-path** until operator-accepted — for T-003 off-path, preserve current path differences as wrapper options).

**Not deferred:** preference for atomic switch.  
**Deferred to T-003 only:** concrete builder topology / wrapper option API.

---

## 12. Files changed

- `tests/s79-t-002-gam-equivalence-baseline.test.js` (new)
- `tests/fixtures/s79-t-002/*` (new fixtures + goldens)
- `docs/development/sprints/2026-08-26-sprint-79-gam-architecture-and-maintainability/S79-T-002-canonical-gam-section-inventory-and-equivalence-baseline.md` (this record)
- Sprint nav: `STATUS.md`, `PLAN.md`, `HANDOVER.md`, `next-chat-briefing.md`, `SPRINT-79-START-HERE.md` (task status)

**Production code:** unchanged.

---

## 13. Tests run

| Suite | Result |
| ----- | ------ |
| `tests/s79-t-002-gam-equivalence-baseline.test.js` | **7/7 pass** |
| `tests/s78-t-051-gam-first-pass-consistency-hardening.test.js` | **pass** (with sibling run) |
| `tests/s78-gam-learner-closure-packaging.test.js` | **pass** |
| `tests/s78-t-055-transfer-closure-markdown-fix.test.js` | **pass** |
| Combined related run | **19/19 pass** |

---

## 14. Unresolved questions / risks

1. Should Studio partial mode eventually receive AUTHORITATIVE commission (behaviour change) or remain path-specific forever?  
2. Should live app bootstrap always load `guided-review-generation-contract` so contract text matches Node require?  
3. Authoring brief vs contract duplication — preserve both under strict text preservation until a dedicated semantic consolidation slice (not default).  
4. Non-partial enrich-in-place still live — include in T-003 wrappers.

---

## 15. Acceptance criteria

| Criterion | Met? |
| --------- | ---- |
| Section inventory | **Yes** |
| Run/Copy + Studio anatomies | **Yes** |
| Equivalence baseline harness + goldens | **Yes** |
| Equivalence classification | **Yes** |
| Ordering ledger | **Yes** |
| Test map + gaps | **Yes** |
| Atomic vs sequential recommendation | **Yes (ATOMIC)** |
| No production switch / no semantic retune | **Yes** |
| Sprint record | **Yes** |

**S79-T-002 acceptance: MET.**

---

## 16. Exact recommended next task

**S79-T-003 — Introduce canonical GAM section-builder module (off-path only)**  
Implement TARGET assembler behind unused path; consume this ledger + goldens; no live switch; prepare T-004 OLD vs TARGET acceptance.
