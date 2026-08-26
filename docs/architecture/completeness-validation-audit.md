# Completeness Validation — Architecture and Artefact Audit

**Kind:** Architecture / artefact audit (not a sprint task)  
**Status:** COMPLETE (2026-08-26)  
**Mode:** DIAGNOSTIC ONLY — no production code, prompts, schemas, validators, or workflow behaviour changed  
**Sprint 78:** remains **CLOSED**  
**Upstream hand-off:** [augmentation-paths-diagnostic.md](augmentation-paths-diagnostic.md) (Decision B)  
**Related historical spec (Sprint 78 pack, not reopened):** [COMPLETENESS-VALIDATION-ALPHA-1.0.md](../development/sprints/2026-08-17-sprint-78-learner-resource-quality-recovery/COMPLETENESS-VALIDATION-ALPHA-1.0.md)

---

## Verdict (executive)

PRISM already has a **substantial deterministic completeness stack** at stage capture (especially DLA commission graph + GAM 1:1 fulfilment + blank-cell / OPS gates) and a **learner-ready + vNext model** gate at export.

**Freshness** (derived/associated content still matching current source) is largely **untracked by fingerprint** — as the Augmentation Paths diagnostic noted. For pre-alpha this is a **bounded MEDIUM** operational risk (wrong image / stale tips / stale downstream capture), not a missing structural completeness architecture.

**Learner-action completeness** is **partially protected**: S78-WS-1 fail-closes unbound production when the heuristic classifier recognises a table/text production step; generic “classify … then Check your response” without table-surface language can still escape (Hydrology-class gap; workspace interactivity remains PARKED).

**Decision: B — SMALL HYGIENE.** Coverage is fundamentally sound for Alpha structural/referential completeness. Bounded docs + optional later targeted checks beat a dedicated completeness sprint or fingerprint programme.

---

## Distinctions used in this audit

| Term | Meaning |
| ---- | ------- |
| **COMPLETENESS** | Required owned information is present and structurally connected |
| **CONSISTENCY** | Related fields/references do not contradict each other |
| **FRESHNESS** | Downstream/associated information still corresponds to the current canonical source |

Do not conflate these with **semantic suitability** (OPS) or **disciplinary QA**.

---

## 1. Working definition of completeness (from current architecture)

Derived from live validators and the Alpha 1.0 completeness specification (preserved in Sprint 78 docs):

> Completeness Validation asks whether the instructional design **commissioned** by PRISM was **structurally fulfilled and preserved** through the pipeline — not whether content is pedagogically excellent.

Kinds of “complete” PRISM currently recognises:

| Kind | Where | Conditional? |
| ---- | ----- | ------------ |
| Stage output complete enough for capture | EP V1/shell; DLA enriched/partial; GAM enriched/partial; Design Page partial | Stage-specific required fields |
| Partial enrichment complete enough for next stage | `assembly_state.current_stage` + `enriched_by`; empty `page_synthesis` until Design Page | Yes — progressive enrich |
| Cross-reference closure | Evidence providers, task inputs, practice_independence operands, response_fulfilment binds, material 1:1 | Required when those contracts are present |
| Assembled page complete enough for render/export | `validateAssembledPageForRender` + `assessAssembledPageLearnerReady` + vNext `buildPageModel` | Yes — EP shell alone fails export |
| Learner-production capability where classified | DLA `appendResponseFulfilmentValidationErrors` | **Heuristic** on `learner_task` / `expected_output` wording |
| Generated material fulfilment | GAM materials 1:1 with `required_materials`; blank-cell gate | Required for commissioned rows |
| Visual planning complete | Design Page VA shape when planning present; planner validates generate affordances | Planning optional; generate rows require shape |
| Visual **assets** complete | Package warns on missing durable assets; does not block HTML | **Optional** for export |
| Synthesis / closure | `knowledge_summary` required at Design Page; `study_tips` omit-when-none; GAM closure via prompt (S78-D04) | Closure substance optional when none; knowledge_summary mandatory |
| Verification/review complete | OPS gate when obligations exist | Skipped when no obligated materials |

**Deliberately conditional / optional:** study_tips; transfer when no transfer intent; images; timing/grouping polish; OPS when no obligations; teaching-only activities without production.

---

## 2. Completeness gate inventory (coverage matrix)

| Stage | Primary validators | Checks | Mode | Next stage depends? |
| ----- | ------------------ | ------ | ---- | ------------------- |
| **EP** | `validateEpisodePlanV1` / container / shell (`episode-plan-v1-validation.js`, `page-shell-create.js`) | Archetype, beats, FunctionEnum, placeholder shell, empty materials | FC | Yes |
| **DLA** | `validateDlaEnrichedPage` / partial (`page-dla-enrich.js`); evidence closure; `dla-production-fulfilment`; `dla-practice-independence`; `dla-diagnostic-review` | Commission graph, evidence providers, WS1/WS2/WS3 | FC (+ evidence quality **W**) | Yes |
| **GAM** | `validateGamEnrichedPage` / partial (`page-gam-enrich.js`); blank cells (`gam-workspace-fulfilment.js`); pack-text tiers (`gam-output-format.js`) | 1:1 materials, bodies, DLA immutability, workspace blanks | FC (Tier3 soft) | Yes |
| **Verify** | `gam-operational-suitability-review.js` | Semantic suitability of obligated rows | FC when obligated | Soft product dependency (temporary) |
| **Design Page** | `validateDesignPagePartialPageCapture`; `visual-planning-contract.js` | knowledge_summary; VA planning shape/anchors | FC when fields present | Soft for assets |
| **Composition** | `applyPedagogicCognitionSemanticsToComposedPage` → A6 preserve; materials/activity/beat closure validators | Restore GAM bodies; warn/fail materials closure | Mixed (export can block on materials fail) | Export quality |
| **Assembly** | `assembleVNextPageFromPartials`; `validateAssembledPageForRender`; `assessAssembledPageLearnerReady` | Structure + non-shell | FC | Export |
| **Graphics** | `planPrismVisualJobs`; asset attach validation | Planning contract; mime/size; missing_brief_ids in manifest | FC for invalid planning; soft for missing assets | Preview |
| **Export** | `runUtilityPageExportPipeline`; vNext validateInput/model; `buildLearnerPackage` | Learner-ready + renderable HTML; assets warn | FC empty HTML; **W** assets | — |

Capture orchestration: `app.js` `validatePartialPageCaptureForStep` and related routers.

---

## 3. Recent specimen audit (Sprint 78 evidence — no new generation)

| Specimen / class | Would current validation detect? | Notes |
| ---------------- | -------------------------------- | ----- |
| DLA provider without complete `evidence_requirement` | **Yes** — evidence decision closure FC | T-009/T-050 class |
| GAM malformed / E2 | **Yes** — capture fail-closed | Not completeness; structural |
| Workspace pre-filled / blank-cell | **Yes** — GAM blank-cell gate + WS1 | T-007/T-008 |
| Missing `practice_independence` on model→attempt | **Yes** — WS2 FC | T-011/T-013 |
| Transfer/closure leak into `transfer_prompt` | **Prompt / T-055 salience** — **no** deterministic “closure forbidden in transfer body” capture gate | Composition may still show until regen |
| Lagrangian 94 / HR 92 success shapes | Pass stage gates + export | Corroborates stack works end-to-end |
| Hydrology classify + “Check your response” without response surface | **Often no** at DLA if step not classified as table/text production | PARKED workspace; classifier blind spot (§6) |
| Pre–T-047 image claim extras | Not a completeness gate — QA / image fidelity | Outside this audit’s FC stack |

---

## 4. Stage-boundary coverage

| Boundary | What must be true to proceed safely? | Validation today |
| -------- | ------------------------------------ | ---------------- |
| LO → EP | Valid plan shell | **STRONG** |
| EP → DLA | Plans + population contract | **ADEQUATE** |
| DLA → GAM | Coherent commission graph | **STRONG** for shape/refs; **PARTIAL** for production heuristic |
| GAM → Verify | Suitable particulars | **ADEQUATE** (temporary semantic; not completeness) |
| GAM → Design Page | Materials present | **ADEQUATE** (capture); thinning mitigated by A6 |
| Design Page → Assembly/Utilities | Synthesis + optional VA | **ADEQUATE**; study_tips not required |
| Planning → Asset → Export | Assets for generate jobs | **PARTIAL** — missing assets warn, not FC |
| Any → Export | Learner-ready page + render | **STRONG** structure; **PARTIAL** operational/freshness |

Deterministic vs not:

- **Deterministic:** IDs, 1:1 materials, evidence closure, blank cells, shell rejection, vNext model.  
- **Temporary semantic:** OPS.  
- **Independent QA:** disciplinary quality, holistic pedagogy.  
- **Prompt salience only:** culminating transfer “when appropriate”; closure host vessel; tips transport fidelity.

---

## 5. Cross-reference closure audit (patterns)

| Pattern | A exists | B type/shape | C reciprocal | D duplicates | E stale version |
| ------- | -------- | ------------ | ------------ | ------------ | --------------- |
| activity_id across stages | Yes | Yes (merge unknown id fails) | — | Uniqueness in vNext input | Downstream capture can persist after upstream regen |
| material_id DLA↔GAM | Yes 1:1 | Yes | Commission↔body | Capture rejects gaps | Re-GAM replaces |
| evidence provider ids | Yes | evidence_requirement shape | providers ⊆ task inputs when required | — | — |
| practice_independence operands | Yes | not models | binding required when model+attempt | — | — |
| response_fulfilment binds | Yes when classified | compatible material_type | covers production kinds | ambiguous step binds rejected | — |
| visual evidence anchors | Path shape | Full contract needs real activity ids | — | duplicate affordance ids | — |
| brief_id → asset | Manifest lists missing | mime/size | — | replace per brief | **Stale asset can survive** if brief_id reused or orphaned |
| study_tips ← closure | No ID link | Soft | No reciprocal check | — | **Stale tips can survive** |

Generic finding: **referential existence/shape is strong inside a stage capture**; **cross-time freshness of derived associations is weak**.

---

## 6. Learner-action completeness

Invariant under audit:

> If learner production is required, some operational response surface must exist.

### Trace

```text
learner_task / expected_output
  → classifyLearnerProductionSteps (heuristic)
  → productionKinds?
       → require required_materials[].response_fulfilment + compatible type  (FC)
  → GAM hydrate materials (blank cells if workspace table)
  → compose/render workspaces
```

### Hydrology-class case

Wording such as “classify the items” **without** “classification table/grid” language does **not** match `TABLE_CLASSIFY_STEP_RE`.  
“Check your response” matches **VERIFY** heuristics → treated as non-production.  
Result: **no** `S78_WS_UNBOUND_PRODUCTION` → missing surface reaches renderer/QA.

### Classification

| Mode | Status |
| ---- | ------ |
| Fail-closed when classifier fires | **Yes** |
| Partial protection | **Yes** — table/text patterns + expected_output inferences |
| Detectable only at renderer/QA when classifier misses | **Yes** |
| Unvalidated for non-table interactive classify/match | **Yes** — intentional PARK for richer surfaces |

**Do not** expand this into interaction-type design here.

---

## 7. Transfer / closure completeness (post–T-055)

| Expectation | Prompt salience | Deterministic validation |
| ----------- | --------------- | ------------------------ |
| Culminating `transfer_prompt` when appropriate | T-041 DLA/GAM | **No** hard “must commission” (conditional pedagogy) |
| Transfer = production not consolidation | T-041 / T-055 | **No** body classifier forbidding closure heading |
| Closure section upstream when desired | S78-D04 GAM packaging | Soft — not required for capture |
| Transport into `study_tips` | Design Page contract | **knowledge_summary** required; **study_tips** omit-ok |
| Closure not in `transfer_prompt` | T-055 NEVER host | **No** capture strip/gate |

**Remaining gap:** separation is **contract/prompt-backed**, not FC body validation. Acceptable for conditional pedagogy; residual risk is model non-compliance until regen (T-055 documented).

---

## 8. Visual completeness

```text
Design Page VA → planPrismVisualJobs → compile briefs → attach asset → package/render
```

| Question | Finding |
| -------- | ------- |
| Must every generate affordance have an asset? | **Product:** desired for release polish; **Export:** missing assets → **warnings**, HTML still packages |
| Duplicate/mismatched brief ids | Planning rejects duplicate affordance ids; attach keyed by `brief_id` |
| Stale assets after affordance/brief change | **Yes risk** — association by `brief_id`; no content fingerprint (Augmentation A9) |
| Intentionally deferred vs accidentally missing | Planner supports defer/reject decisions; missing attached assets are soft at package |

---

## 9. Freshness audit (Augmentation hand-off)

| Relationship | Behaviour today | Fingerprint? | User/product consequence | Risk |
| ------------ | --------------- | ------------ | ------------------------ | ---- |
| **Graphics assets** | Remain associated by `brief_id`; replace/remove manual; manifest `missing_brief_ids` | No | Wrong/outdated image can export silently if id still maps | **MEDIUM** |
| **study_tips** | Survives until Design Page re-run | No | Stale consolidation vs new GAM closure | **MEDIUM** |
| **Downstream captures** | Operator must re-run stages; `enriched_by`/`current_stage` are provenance labels, not invalidation | No | Stale GAM/DP after DLA change until re-capture | **MEDIUM** (operator workflow) |
| **A6 preserve** | Runs inside `applyPedagogicCognitionSemanticsToComposedPage` on composition paths; Utilities Generate validates composition **before** render; snapshot export often sets `applyCompositionValidation: false` assuming prior compose | N/A | Thin page without prior A6 can under-serve materials if alternate paste/export path skips composition | **MEDIUM** (path-dependent) |

**Pre-alpha judgment:** Freshness is a **real but bounded** risk — not evidence that structural completeness architecture is missing. Fingerprinting is “nice,” not required for Decision escalation.

---

## 10. Export / package completeness

`runUtilityPageExportPipeline` requires:

1. `artifact_type: page`  
2. Assembled or learner-ready page (not EP shell)  
3. Successful vNext model + HTML  
4. Optional: composition materials closure fail can block (when validation applied)

| Condition | Export behaviour |
| --------- | ---------------- |
| Missing activities / shell-only | **FC** |
| Missing GAM materials (unassembled thin) | Likely fail learner-ready / render emptiness |
| Incomplete workspaces | May still export if DLA/GAM gates were bypassed or classifier missed |
| Unresolved refs | Usually caught earlier; renderer FC on model |
| Missing synthesis knowledge_summary | Caught at Design Page capture if that stage used |
| Missing required visual assets | **Warn**, package HTML |
| Stale but valid assets | **Proceeds** |
| Absent timing/grouping | Proceeds (optional) |
| Verification failed/absent | Not re-checked at export |

**Valid optional omission** ≠ **incomplete resource:** tips, images, transfer-when-inappropriate, OPS-when-no-obligations.

---

## 11. Validation-layer model

| Layer | Belongs where today? | Appropriate? |
| ----- | -------------------- | ------------ |
| Schema/shape | Stage capture + vNext | **Yes** |
| Referential completeness | DLA/GAM/VPC | **Yes** |
| Operational completeness | DLA WS1 (heuristic) + GAM blanks | **Mostly**; classifier gap |
| Semantic suitability | Temporary OPS | **Yes** (temporary) |
| Disciplinary quality | Independent QA + S78-DP prompts | **Yes** |
| Freshness | Largely absent | **Acceptable gap** for pre-alpha; track in completeness hygiene |
| Independent QA | Benchmark | **Yes** |

Do **not** expand OPS into freshness or completeness fingerprinting.

---

## 12. Over-validation risks

Do **not** force:

| Optional / conditional | Why protected |
| ---------------------- | ------------- |
| Images always | Generate/defer/reject; package soft-missing |
| Study tips always | Omit-when-none (S78-D04) |
| Transfer always | “Where pedagogically appropriate” (T-041) |
| Evidence always | `evidence_decision.required` |
| Grouping/timing | Metadata restore, not FC completeness |
| Workspaces for pure study activities | WS1 ignores study/verify-only steps |

Any future check must preserve this conditionality.

---

## 13. Completeness scorecard

| Boundary | Structural | Referential | Operational | Freshness | Verdict |
| -------- | ---------- | ----------- | ----------- | --------- | ------- |
| EP | Strong | Strong | N/A | N/A | **SOUND** |
| DLA | Strong | Strong | Partial (heuristic) | N/A | **MINOR GAP** |
| GAM | Strong | Strong | Strong (blanks) | N/A | **SOUND** |
| Verify | N/A | N/A | Semantic (OPS) | Fingerprint of review scope | **SOUND** (as temp) |
| Design Page | Adequate | Adequate (VA) | Soft tips | Soft | **MINOR GAP** |
| Composition / A6 | Adequate | Adequate | Restore | Path-dependent | **MINOR GAP** |
| Graphics / assets | Soft | brief_id | Soft | Medium stale risk | **MINOR GAP** |
| Export | Strong | Soft assets | Soft | Soft | **SOUND** with noted soft edges |

No row rises to **ARCHITECTURAL RISK** for pre-alpha completeness architecture as a whole.

---

## 14. Decision

**B. SMALL HYGIENE**

Existing deterministic completeness validation is **fundamentally sufficient** for pre-alpha when paired with independent QA and temporary OPS. Bounded gaps (production classifier coverage, freshness documentation, A6 path assumptions, transfer/closure prompt-only separation) do **not** justify Decision C/D solely for theoretical fingerprinting or a completeness mega-sprint.

---

## 15. GAM reorganisation — preserve / defer

**MUST preserve**

- 1:1 `required_materials` ↔ materials fulfilment  
- Empty `page_synthesis` at GAM  
- Blank-cell gate for workspace tables  
- Evidence requirement re-shape on required rows  
- T-055 transfer ≠ closure host rules (prompt/contract)  
- Fail-closed capture (no silent sanitiser — R-006)

**Coupled to prompt/section structure**

- Runtime prompt augmentation order (behavioural equivalence under restructure)  
- Pack-text Tier gates if still used on alternate paths  

**Make easier to reason about**

- Named completeness “commission graph” checks vs narrative pack sections  
- Explicit list of FC vs W diagnostics  

**Defer until after restructure**

- New transfer/closure body scanners  
- Freshness fingerprints  
- Broadening WS1 classifier (coordinate with workspace-surfaces sprint)

---

## 16. Workspace-surfaces planning hand-offs

When that sprint opens, completeness requirements to honour:

1. **Production required → operational response surface required** (strengthen detection beyond current table/text heuristics as surfaces expand).  
2. Structured responses must remain **commissionable, capturable, persistable**.  
3. Check/revision still needs an **attempt surface** to bind against (`diagnostic_review` / WS3 patterns).  
4. Do **not** invent interaction types in completeness validation alone.

---

## 17. Smallest justified next action (B)

1. Keep **this audit** as the programme reference alongside the Augmentation Paths diagnostic.  
2. Optionally add a short shared-vocabulary note: completeness vs consistency vs freshness vs OPS vs QA.  
3. When completeness hygiene is authorised later (not now):  
   - document WS1 classifier blind spots (classify/check without table language);  
   - document which export paths assume prior composition (A6);  
   - include A8/A9 freshness in operator checklists / completeness audit tooling — **without** implementing fingerprints yet.  
4. **Do not** open a sprint solely for completeness architecture from this audit.

---

## 18. Files inspected (representative)

- `app.js` — capture routers, composition/A6, Utilities export (`runUtilityPageExportPipeline`, composition flags)  
- `lib/page-dla-enrich.js`, `lib/dla-production-fulfilment.js`, `lib/dla-practice-independence.js`, `lib/dla-diagnostic-review.js`  
- `lib/page-gam-enrich.js`, `lib/gam-workspace-fulfilment.js`, `lib/gam-operational-suitability-review.js`  
- `lib/page-vnext-assemble.js`, `lib/page-gam-materials-preserve.js`  
- `lib/visual-planning-contract.js`, `lib/prism-visual-jobs-planner.js`, `lib/utilities-visual-jobs-workspace.js`, `lib/learner-package.js`  
- `docs/architecture/augmentation-paths-diagnostic.md`  
- Sprint 78: `COMPLETENESS-VALIDATION-ALPHA-1.0.md`, T-005/T-045/T-055 notes, gate inventory via live libs  

---

## 19. Files changed (docs only)

- This record: `docs/architecture/completeness-validation-audit.md`

---

## 20. Sprint 78 confirmation

**Sprint 78 remains CLOSED.** This audit does not reopen it, does not add Sprint 78 tasks, and does not alter Final Gate / T-013 dispositions.
