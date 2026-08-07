# S74B-T-020 — Compose vs Partial Contract Role Documentation

**Sprint:** 74B — Generation-contract & capture-validator hygiene  
**Task:** S74B-T-020  
**Status:** **Done** (2026-08-07)  
**Mode:** Documentation / architecture clarification only — **no runtime or test changes**  
**Authority:** [S74B-T-010](S74B-T-010-generation-pipeline-architectural-discovery.md) · [SPRINT-74B-CHARTER.md](SPRINT-74B-CHARTER.md) · [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)  
**Source revision:** `9a28e7b26e5c2ec45023703199ea3ae2f716af81`  
**Evidence time (UTC):** 2026-08-07T08:10:27Z  
**Evidence class:** Repository call-path tracing (browser-runtime source); Node tests = supporting inventory only

---

## 1. Executive summary

**Operator hypothesis — confirmed with refinement.**

The current **supported** Learning Design page-construction architecture is:

1. **`partialPageOutputs` (+ `pageEnrichmentV2`)** during workflow run  
2. **Deterministic assembly** via `PRISM_PAGE_VNEXT_ASSEMBLE.assembleVNextPageFromPartials`  
3. **Post-assembly composition validation** before renderer hand-off  

**Full-page Design Page compose** (`lib/ld-design-page-compose-contract.js` / `LD-DESIGN-PAGE-COMPOSE-CONTRACT`) is **not** a parallel supported product architecture. It is an **earlier alternative** retained in code and tests as **rollback / legacy**, and for Learning Design **Sprint 58 page-pipeline** workflows it is **effectively eliminated on load** by `migrateWorkflowToSprint58PageArtefactContract` (forces both flags true).

| Path | Classification |
| ---- | -------------- |
| Partial + assemble | **Supported** |
| Full compose | **Obsolete but still reachable** (in-memory / test / pre-migration objects); **not** a current product Compatibility requirement |

**No compose-only required product behaviour** was evidenced on the supported path. Materials, activities, sequence, and assessment content are owned by upstream partial stages + assembly; Design Page partial owns title / `page_synthesis` / visual planning.

**Removals are not executed here.** T-030 should plan removal/consolidation only after a binding decision (proposed below).

> **Policy note (2026-08-07):** Discovery text above recorded compose as “rollback / legacy” retention in code/tests. Under accepted [S74-D09](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d09--pre-release-compatibility-is-not-a-default-requirement) / [S74B-D03](decisions.md#s74b-d03--historical-pre-release-workflowrunstate-compatibility-does-not-block-rationalisation), that historical reachability is **not** a Compatibility product requirement. Compose rollback, `partialPageOutputs: false`, and legacy capture accept are removal candidates for T-040; old local runstate may require re-run. Evidence rows below are **not rewritten**.

---

## 2. Source revision / evidence provenance

| Item | Value |
| ---- | ----- |
| HEAD | `9a28e7b` |
| Method | Static tracing of `app.js`, `lib/ld-design-page-*-contract.js`, `lib/page-vnext-assemble.js`, domain step patterns, focused tests |
| Production authority | Browser-only; static `index.html` (no UI toggle for these flags) |
| Not used as proof | Historical sprint narrative alone; `@deprecated` labels alone |
| Disciplines | Ownership before change; inventory before removal; do not trust filenames/comments as architectural truth |

---

## 3. Historical intent vs current architecture

| Era | Intent | Evidence |
| --- | ------ | -------- |
| Pre–Sprint 58 / Sprint 38-B | Design Page LLM **composes** a complete page from upstream conversation artefacts (materials fidelity, membership, field preservation) | `lib/ld-design-page-compose-contract.js` header: “canonical Design Page read-only compose”; owns page schema / membership / L4 preserve |
| Sprint 58 | Introduce **partial stage outputs** + **deterministic assemble**; Design Page emits owned fields only | `lib/ld-design-page-partial-contract.js`; `lib/page-vnext-assemble.js`; pack §13 notes |
| Current (post-58 + 70 DP) | Pack and gates name **partial authoritative**; compose **rollback/legacy only** | `domains/learning-design/domain-learning-design-step-patterns.md`; `tests/sprint-58-phase1-design-page-domain-gates.test.js` |

Module header on compose still says “Lifecycle: canonical (PR-W3-2)” — that **filename/comment lifecycle claim is stale relative to Sprint 58 product architecture**. Partial header correctly says “canonical for `partialPageOutputs`.”

---

## 4. `partialPageOutputs` lifecycle

### 4.1 Where is it set?

| Location | Behaviour |
| -------- | --------- |
| `handleSaveDesignedWorkflow` (~31503–31506) | **Forces** `pageEnrichmentV2 = true` and `partialPageOutputs = true` for newly generated workflows (“Sprint 58 default”) |
| Seeded Design Page / step prompts (~31444–31450) | Seed uses both flags true |
| `normalizeWorkflowOutputSpec` (~30398–30426) | Normalises bools; **missing → false** (does not invent true) |
| `migrateWorkflowToSprint58PageArtefactContract` (~30446–30457) | If workflow has Sprint 58 page-pipeline steps and **either** flag is false → **sets both true** |
| `loadWorkflows` (~27097–27104) | Runs normalize + **Sprint 58 migration**; persists if changed |
| `mergeSprint58WorkflowFlags` / `resolveWorkflowForUpstreamArtefacts` | Merges explicit vs persisted flags for run resolution (first explicit wins) |

### 4.2 Default for newly created supported LD workflows?

**Yes.** Create-Workflow save path hard-sets both flags true. There is **no** `index.html` control to disable them.

### 4.3 Can a newly created supported workflow legitimately run with it disabled?

**Not through the normal Create → Save → Load product path.**  
A newly created workflow is saved with both true. Even if a caller later cleared flags, **load migration** re-enables them for Sprint 58 page-pipeline step sets.

**In-memory / test construction** can still set `pageEnrichmentV2: true, partialPageOutputs: false` and exercise compose injection (`sprint-58-phase0-design-page-partial-gates.test.js` “rollback v2 mode”). That is **not** the Create Workflow product path.

### 4.4 Gate function

```text
isPartialPageOutputWorkflowEnabled(wf)
  = isPageEnrichmentV2WorkflowEnabled(wf)
    && readWorkflowOutputSpecFlag(wf, "partialPageOutputs")
```

Both required. Partial contract injects only when enabled; compose injects only when **not** enabled (Design Page step).

---

## 5. Compose call path (P5a / P11)

```text
Design Page Copy
  → applyWorkflowStepRuntimePromptAugmentations
    → applyLdDesignPagePartialContractToDraft  (no-op if !partial)
    → applyLdDesignPageComposeContractToDraft  (no-op if partial)
         → buildLdDesignPageComposePromptBlock  (lib)
```

When compose is active (`!isPartialPageOutputWorkflowEnabled`):

- Prompt instructs LLM to **emit a complete page**, consuming upstream GAM/DLA from conversation.  
- `resolvePageForRenderOrAssembly`: if partial disabled → **skips assemble**; returns page with identity attach only (expects capture ≈ full page).

**Deprecated alias:** `applyDesignPageActivityMaterialsFidelityContractToDraft` → compose apply (PR-W3-2).

---

## 6. Partial call path (P5a / P8–P9 / P11 / P11a)

```text
Stage Copy (DLA/GAM/LS/DA/GAI/DP)
  → partial contracts / stage briefs (DP: LD-DESIGN-PAGE-PARTIAL-CONTRACT)
  → external Copilot → paste capture
  → validatePartialPageCaptureForStep / stage validators
  → runstate
Authoring Assemble / Preview
  → resolvePageForRenderOrAssembly
    → assembleVNextPageFromPartials (STAGE_ORDER)
  → applyPageCompositionValidationForUtilitiesPage (P11a)
  → runLearnerRendererVNextExport  (P12 — out of scope)
```

Design Page partial owns: `title`, `page_synthesis`, visual planning fields (`DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS` in assemble). Upstream stages own activities/materials/sequence/assessment partials.

---

## 7. Ownership matrix

| Concern | Compose owner (historical path) | Partial / current owner | Current **supported** owner | Evidence | Action implication |
| ------- | ------------------------------- | ----------------------- | --------------------------- | -------- | ------------------- |
| Page structure (shell / envelope) | Compose prompt (full page emit) | EP shell partial + assemble | **EP + assemble** | `page-vnext-assemble.js` STAGE_ORDER | Keep assemble; do not restore compose for structure |
| Activity content | Compose membership / field preserve | DLA partial | **DLA partial + assemble** | Partial contract forbids `activities[]` regen | Compose not needed |
| Materials bodies | Compose + LD-MATERIALS-COPY preserve | GAM partial | **GAM partial + assemble** | Pack + partial forbidden list | Compose materials bridge obsolete on supported path |
| Learning sequence | Compose consume LS | LS partial | **LS partial + assemble** | STAGE_ORDER | |
| Assessment data | Compose membership / assessment_check | DA / GAI partials | **DA/GAI + assemble** | STAGE_ORDER | |
| Titles / labels (page) | Compose title rules | Design Page partial `title` | **DP partial** | Partial contract + assemble owned fields | |
| Activity titles | Compose preserve DLA | DLA partial (DP forbidden to rename) | **DLA** | Partial forbidden: rename activities | |
| Identifiers (`activity_id`, etc.) | Compose membership invariants | Stage partials + assemble merge | **Stage partials + assemble** | assemble merge rules | |
| Schema completeness (page 2.0.0) | Compose emit complete artefact | Assemble + `validateAssembledPageForRender` | **Assemble + validators** | `resolvePageForRenderOrAssembly` | |
| Cross-stage consistency | Compose conversation merge | Deterministic merge order | **Assemble** | STAGE_ORDER | |
| Final page completeness | Compose “page is final learner output” | Assemble completeness + materials closure | **Assemble + P11a** | `applyPageCompositionValidationForUtilitiesPage` | |
| Composition / materials closure | Compose prompt rules | P11a materials closure | **P11a** | `pageMaterialsClosureBlocksExport` | |
| `page_synthesis` / wrapper prose | Compose transport + thin-assembly | DP partial + thin-assembly | **DP partial** | Partial contract | |
| Visual planning (VA) | Compose-era + Sprint 38 blocks | DP partial (Sprint 70) | **DP partial** | Partial contract VA section | |
| Prompt contract injection (DP) | `applyLdDesignPageComposeContractToDraft` | `applyLdDesignPagePartialContractToDraft` | **Partial apply** when flags on | Mutual gating ~13467–13559 | Compose apply = residual |

---

## 8. Behaviour / functionality parity matrix

| Responsibility formerly in compose | Replaced on supported path? | By what? |
| ---------------------------------- | --------------------------- | -------- |
| Full-page LLM compose | Yes | Partials + assemble (no LLM full replay) |
| Verbatim materials embed | Yes | GAM partial bodies + assemble + materials closure |
| Activity membership | Yes | DLA partial + assemble |
| Wrapper prose / synthesis | Yes | DP partial `page_synthesis` |
| Title authorship | Yes | DP partial `title` |
| Visual affordance authorship | Yes | DP partial + Sprint 38 authoring block |
| “Incomplete page must not emit” | Yes | Assemble validation + P11a export gates |
| Conversation-context materials resolve at DP | **Intentionally removed** on partial | Partial forbids resolving `activity_materials` from chat at DP |

**Compose-only residual behaviours** (exist only when compose path is forced):

- Injecting `LD-DESIGN-PAGE-COMPOSE-CONTRACT` prompt text  
- Expecting Design Page capture ≈ complete page (assemble bypass)  
- Conversation-time full materials re-bind at Design Page  

These are **not** required on the supported partial path.

---

## 9. Persisted-workflow implications

| Question | Answer |
| -------- | ------ |
| Can old saved workflows lack `partialPageOutputs`? | Yes historically (missing → normalize false). |
| What does migration do? | For Sprint 58 **page-pipeline** step sets: if v2 **or** partial is false → set **both true** and persist on load. |
| Can opening/running an old LD pipeline workflow still select compose? | **Not after successful load migration.** Flags become partial+v2. |
| Can compose still be selected? | Yes for **in-memory** objects / tests / `resolveWorkflowForUpstreamArtefacts` with explicit `partialPageOutputs: false` (first-source wins in merge). |
| UI to choose compose? | **None.** |
| Would removal need a migration rule? | Load migration already defaults pipeline workflows to partial. T-030/T-040 should still document: keep or strengthen defaulting; decide fate of explicit-false API/test surfaces. |
| Implement migration in T-020? | **No.** |

**Non-pipeline workflows** (no EP/DLA/GAM/… steps): migration does not force flags. Compose inject still requires a Design Page step + `!isPartialPageOutputWorkflowEnabled`. That is a narrow edge case, not the supported LD learner-page spine.

---

## 10. Test / fixture inventory

| Suite / area | Covers | Compose-oriented classification |
| ------------ | ------ | ------------------------------- |
| `tests/sprint-58-phase0-design-page-partial-gates.test.js` | Mutual gating: partial vs compose inject | **Migration/rollback evidence** — protects gate behaviour; compose branch is rollback harness |
| `tests/sprint-58-phase1-design-page-domain-gates.test.js` | Pack: partial authoritative; compose rollback-only | **Protects current supported docs/pack** |
| `tests/sprint-58-flag-preservation-gates.test.js` | Flag merge / explicit false not overwritten by persisted true | **Compatibility/resolution evidence** — not product compose UX |
| `tests/page-vnext-assemble.test.js` | Assemble; partial enabled; rollback bypasses assemble | Partial = **current supported**; rollback bypass = **historical/rollback** |
| `tests/page-partial-capture-validate.test.js` | Partial validators; `legacyWf` with both false | Partial = supported; legacyWf = **historical** |
| `tests/ld-design-page-compose-contract.test.js` | Compose module text contracts | **Historical / obsolete module guardian** — candidate later replace/remove with partial+assemble guardians |
| `tests/page-episode-plans-closure.test.js` | Compose episode-plan markers | **Compose-era** — review in T-030 |
| `tests/design-page-materials-fidelity.test.js` | Materials + VA coexistence | Mixed; often compose-era framing — classify per assertion in T-030 |
| `tests/workflow-design-page-live-prompt-unification.test.js` | Live prompt unification with partial true | **Current supported** |
| Fixtures with `partialPageOutputs: true` | e.g. educational-psychology, heteroscedasticity | **Current supported** |
| Learner-renderer `compose-*` tests | Moment composition inside vNext | **Unrelated** (renderer; not Design Page compose contract) |

**Do not change tests in T-020.**

---

## 11. Duplicate-ownership findings

| Finding | Detail |
| ------- | ------ |
| Dual Design Page contracts | Both modules load; mutual no-ops — **same Design Page prompt-injection responsibility**, alternative implementations |
| Stale compose “canonical” header | Conflicts with Sprint 58 pack + partial header |
| Materials fidelity | Compose embeds materials-preserve rules; supported path uses GAM + assemble + P11a — **duplicate conceptual ownership** if both kept active |
| Deprecated PR-W3-2 aliases | Still point at compose; test API exposes them — plausible-but-wrong surface |
| Flag merge vs load migration | Explicit false can win in resolve merge; load migration forces true for pipeline WFs — **two stories** about “can compose still run?” |

---

## 12. Supported-path classification

### Partial path (`pageEnrichmentV2` + `partialPageOutputs`)

**Supported** — default Create Workflow save; pack authoritative; assemble path; production Learning Design spine.

### Full compose path (`!isPartialPageOutputWorkflowEnabled` on Design Page)

**Obsolete but still reachable**

- Reachable via: in-memory / test workflows with `partialPageOutputs: false` (and typically `pageEnrichmentV2: true` “rollback”), or non-migrated objects.  
- **Not** Supported.  
- **Not** Compatibility with a current product requirement (no UI; load migration removes it for LD page-pipeline persisted workflows).  
- Documented in pack/tests as **rollback/legacy**.  
- Historical existence ≠ product requirement (`S74-D07`).

### Operator hypothesis evaluation

| Claim | Verdict |
| ----- | ------- |
| Partial during run is supported | **Confirmed** |
| Deterministic assemble is supported | **Confirmed** |
| Full compose retained only as historical / rollback / obsolete residue | **Confirmed** (refined: still code-reachable; not product-required; load-migrated away for pipeline WFs) |

---

## 13. Recommendation for T-030

T-030 should produce an **exact removal/consolidation plan** addressing:

1. **Binding decision (proposed — not accepted here):**  
   **S74B-D02 (proposed):** Partial + deterministic assembly is the sole definitive Design Page / page-construction architecture for Learning Design Sprint 58 page-pipeline workflows. Full compose is obsolete; remove after call-site/test inventory unless a current Compatibility requirement is evidenced. Repository history archives the implementation.

2. Inventory all callers of compose builders/apply paths and PR-W3-2 aliases (incl. `prismTestApi`).  
3. Classify compose-oriented tests: keep gate tests (rewritten as “partial only”), delete/replace obsolete module guardians.  
4. Confirm load migration already defaults pipeline WFs; decide whether to remove the compose inject branch entirely or leave a hard error if `partialPageOutputs === false` on pipeline WFs.  
5. Do **not** remove `assembleVNextPageFromPartials` or partial contract.  
6. Residue sweep: comments claiming compose “canonical”; pack already says rollback — align compose module header if retained temporarily.

**T-030 question (concrete):**  
> Given T-020 classification “Obsolete but still reachable,” what is the smallest reversible commit sequence to remove Design Page full-compose injection and exclusive tests while preserving partial + assemble + P11a, without regressing Authoring export?

---

## 14. Removals / consolidations that appear justified (NOT executed)

| Item | Why justified | Blocker until T-030/T-040 |
| ---- | ------------- | ------------------------- |
| `applyLdDesignPageComposeContractToDraft` live inject for DP | No supported product path after migration | Binding decision + caller/test matrix |
| `buildLdDesignPageComposePromptBlock` / compose module | Exclusive to obsolete path | Same; check non-DP accidental imports |
| PR-W3-2 deprecated aliases | Alias to compose only | Call-site proof |
| Compose-only test guardians | Protect obsolete behaviour | Replace with partial/assemble coverage where needed |
| Stale “Lifecycle: canonical” on compose module | Misleading ownership | Doc/header fix or delete with module |

---

## 15. Risks / unresolved questions

| Risk / question | Note |
| --------------- | ---- |
| Non-pipeline workflows with Design Page | Migration may not force flags — edge inventory in T-030 |
| Explicit `partialPageOutputs: false` in resolve merge | Still used by tests; product has no UI — treat as test/API residue |
| Research domain / other packs | T-020 focused on Learning Design supported spine; spot-check T-030 |
| Compose module still imported by some episode-plan tests | May share prompt text helpers — do not delete blindly |
| Proposed S74B-D02 | **Not accepted in T-020** — report for operator/T-030 |

---

## 16. Acceptance contribution

| Charter AC | Contribution |
| ---------- | ------------ |
| AC-01 | Ownership of compose vs partial documented before removal |
| AC-02 | Surfaces inventoried with callers/gates |
| AC-07 | Compose vs partial **roles** documented (this task) |
| AC-03… | Enables evidenced consolidation planning in T-030 |
| AC-11 | No 74C; no runtime change |

---

## 17. Stop statement

S74B-T-020 is **Done**. Runtime and tests are **unchanged**. No compose/partial code removed. Next task: **S74B-T-030** (removal/consolidation plan) — **not begun**. Sprint 74C remains **Not opened**.

**Proposed decision S74B-D02** is recorded for operator acceptance before implementation removals.
