# Augmentation Paths — Architecture Diagnostic

**Kind:** Architecture diagnostic (not a sprint task)  
**Status:** COMPLETE (2026-08-26)  
**Mode:** DIAGNOSTIC ONLY — no production code, prompts, schemas, validators, or tests changed  
**Sprint 78:** remains **CLOSED** (unaffected)  
**Location:** Programme architecture record under `docs/architecture/`

---

## Verdict (executive)

PRISM does **not** have a single product feature named “augment artefact.”

In live code, **“augment” almost always means runtime prompt assembly** (injecting contract blocks into Copy/Studio drafts before generation). That is **not** post-authorship mutation of a captured page.

Genuine **post-primary** behaviours that retain an existing artefact while adding or restoring content fall into three coherent families:

1. **Progressive stage enrich** (DLA / GAM / LS / Design Page / GAI) — sequential **partial-page authorship** of one page shell (`assembly_state.enriched_by`), not an after-the-fact enhance button.  
2. **Deterministic capture / composition preserve-and-repair** — normalize, overlay GAM materials, restore upstream fields when a later stage thins the page.  
3. **Associative visual asset intake** — Utilities Graphics jobs: plan/compile briefs from the assembled page, attach operator-supplied images by `brief_id`.

There is **no** general model-driven “augment this finished page” verb in the live Learning Design workflow UI.

**Decision: B — SMALL HYGIENE** (see §16). Architecture is sound once families are distinguished; terminology overload and a few bounded risks (especially visual-asset staleness; materials-preserve as intentional compensation) deserve documentation and optional hygiene outside a sprint. No dedicated sprint is justified by this investigation alone.

---

## 1. Working definition of augmentation in PRISM

### What the repository actually calls “augment”

| Usage | Meaning in implementation | Artefact mutation? |
| ----- | ------------------------- | ------------------ |
| `applyWorkflowStepRuntimePromptAugmentations` | Append contract scaffolds to the **prompt draft** before the model runs | **No** |
| `enrichDlaLearnerPageAugmentContext` / `buildWorkflowStepPromptAugmentContextFromStep` | Flags/context for which prompt scaffolds apply | **No** |
| `augmentWorkflowBriefConfig*` / unified-settings “augment” | Merge cognition/assessment semantics into brief config | Config only |
| `augmentSelfDirectedDlaDraftOutputSection` | Prompt-text pointer rewrite | **No** |
| Comment on visual affordance HTML hooks | “downstream visual augmentation” = DOM hooks for later graphics | HTML only |

Historical sprint docs (38B, 56, 57) use **“augmented prompt”** for **seeded + runtime-injected character count**. That vocabulary is **prompt engineering**, not page enrichment.

### Distinctions (implementation-led)

| Not augmentation (for this diagnostic) | Why |
| -------------------------------------- | --- |
| Canonical stage authorship (EP → DLA → GAM → Design Page) | Primary generation for that stage’s owned fields |
| `assembleVNextPageFromPartials` | Deterministic merge of stage partials for a coherent page |
| Renderer / MathJax / guided-review UI `enhance(root)` | Presentation / learner interaction |
| Validators / OPS review gate | Accept/reject; do not add content |
| Full GAM regenerate after verification FAIL | Replacement generation, not additive augment |
| Operator hand-edit of JSON | Manual editing |
| Capture fence/normalize (`workflow-page-capture-normalize`) | Compatibility/parse repair |

### Concise architectural definition (fits the live system)

> An **augmentation path** in PRISM is an operation that **retains a previously authored artefact identity** and **adds, restores, or associates** additional information **without** constituting that artefact’s primary stage authorship.
>
> **Prompt augmentation** is a related but distinct term: it augments the **instructions** sent to a model, not the captured page.

Under that definition, live candidates are: stage **partial enrich** (borderline — sequential authorship of the same shell), **deterministic preserve/repair**, and **visual asset association**. Prompt-runtime “augmentation” is excluded from the artefact inventory but recorded so the name collision is explicit.

There is **no** pre-existing single canonical definition of “artefact augmentation” in `docs/architecture/` or `shared-vocabulary.md`. Progressive enrich is documented as **page enrichment v2** / partial contracts; whole-page progressive LLM enrichment is **retired** ([R-001](../development/governance/ARCHITECTURAL-DEBT.md#r-001--whole-page-progressive-llm-enrichment)).

---

## 2. Augmentation-path inventory (compact architecture table)

| ID | Path / name | Operator trigger | Source | Owner of added info | Model? | Preserve vs rewrite | Storage | Downstream | Optional / repeatable |
| -- | ----------- | ---------------- | ------ | ------------------- | ------ | ------------------- | ------- | ---------- | --------------------- |
| **P0** | Runtime **prompt** augmentation | Copy / resolve step prompt | Step + workflow + brief flags | Prompt assembly (not page owner) | N/A (pre-model) | N/A | Ephemeral prompt string | Model generation | Always on live path; re-run rebuilds prompt |
| **A1** | DLA page enrich (partial) | Design Learning Activities capture | EP shell | DLA (activities pedagogy, `enriched_by: dla`) | Yes + det. normalize | Rewrites DLA-owned fields; preserves shell identity | Captured page / partial | GAM, assembly | Stage once; re-capture replaces stage |
| **A2** | GAM page enrich (partial) | Generate Activity Materials | DLA baseline | GAM (`materials`, `enriched_by: gam`) | Yes + det. merge | Fills materials; must not own `page_synthesis` | Captured page / partial | LS, Design Page, assembly, renderer | Stage once; re-capture replaces materials |
| **A3** | Learning Sequence enrich | LS step (v2) | GAM page | LS (`learning_sequence`) | Yes | Adds LS; preserves activities/materials | Captured page | Design Page / assembly | Stage once |
| **A4** | Design Page partial enrich | Design Page | Upstream page | Design Page (`title`, `page_synthesis`, VA planning); transport of study_tips | Yes + det. composition | Must not regenerate materials; may thin bodies (then A6) | Captured page | Utilities Graphics, assemble, export | Stage once |
| **A5** | GAI / assessment enrich contract | Generate Assessment Items | Page | Assessment items stage | Yes (contract) | Assessment fields | Partial | Assembly | Stage once |
| **A6** | GAM materials preserve / overlay | Design Page (or page) composition validation | Upstream GAM + composed page | Deterministic composition (restore GAM L4 bodies) | No | Overlay authoritative GAM materials when page thinned | Composed page + `metadata.gam_materials_preserve_*` | Renderer / export | Re-runs on each composition pass |
| **A7** | DLA / learner composition repair | Capture / composition | Upstream captures | Deterministic repair | No | Restores missing activities / framing; scaffold repair | Captured/composed page | Downstream | Re-runs on capture/composition |
| **A8** | Study tips transport | Design Page authorship | GAM `### Page learner-resource closure` | Design Page transport of GAM substance (S78-D04) | Yes (instructed copy) | Verbatim transport into `page_synthesis.study_tips` | `page_synthesis.study_tips` | Renderer Study tips | Re-run DP re-transports; no separate engine |
| **A9** | Utilities Graphics / visual jobs | Utilities → Graphics; Copy human prompt; Choose/Remove image | Assembled page VA planning | Visual asset association (operator image + brief identity) | Briefs det.; image external | Associative attach/replace by `brief_id` | Workspace + `workflow_page_resources` | Preview / export | Optional; replace/remove supported |
| **A10** | OPS suitability review | Verify generated materials | GAM materials | Review artefact only | Yes (review JSON) | **Does not** mutate page | Separate review state | Gate advance | Repeatable; FAIL → regenerate GAM |
| **A11** | Standalone HTML enhance | Viewer / export HTML | Rendered HTML | Presentation | No | HTML post-process | HTML only | Learner viewer | Re-apply on HTML |
| **L1** | VEU (Visual Enhancement Utility) | Separate workflow JSON / historical export path | Rendered HTML hooks | External utility | Yes (legacy workflow) | Image queue / package | Utility artefacts | Parallel | **Legacy / parallel**; not in-app LD button |
| **L2** | `applySprint38VisualAffordancesToComposedPage` | (production call path absent) | Composed page | VA metadata normalize | No | Would mutate VA fields | Page | — | **Test-only / effectively dead** in production |

**P0** is listed only to prevent confusion with artefact paths.

---

## 3. Live-path maps

### P0 — Prompt augmentation (not artefact)

```text
UI Copy / resolveStepPromptText
  → buildWorkflowStepPromptAugmentContextFromStep (+ enrichDlaLearnerPageAugmentContext)
  → applyWorkflowStepRuntimePromptAugmentations
      (guided scaffold → cognition → EQF → patterns → self-directed → table/materials/GAM depth
       → archetype → PEL → Design Page partial → thin assembly → VA → math → strict JSON
       → EP→DLA population → GAM enrich contract)
  → prompt string → operator/model
```

Canonical DLA assembler may short-circuit to a dedicated population block when enabled.

### A1–A5 — Progressive partial enrich (canonical pipeline)

```text
EP shell capture
  → DLA Copy (upstream EP embed) → model → DLA capture normalize/validate → assembly_state.enriched_by += dla
  → GAM Copy (upstream DLA) → model → merge materials → enriched_by += gam
  → optional LS / assessment
  → Design Page Copy → model partial (title, page_synthesis, VA) → composition validation
  → assembleVNextPageFromPartials (deterministic)
```

This is the **live Learning Design product path**. Whole-page “replay the entire growing JSON every stage” is **retired (R-001)**; current design is **partial enrich + deterministic assembly**.

### A6–A7 — Preserve / repair (post-stage, deterministic)

```text
Design Page (or page) capture
  → applyPageCompositionValidationForCapturedPage
  → repairLearnerPageCompositionFromUpstream
  → applyComposedPageGamMaterialsPreserve
      → page-gam-materials-preserve.applyGamMaterialsToComposedPage
  → composed page with metadata flags
```

DLA path also applies scaffold/placeholder repairs on capture (`repairGuidedLearningScaffoldOnDlaCapture`, etc.).

### A8 — Study tips

```text
GAM authors ### Page learner-resource closure in materials Markdown
  → Design Page prompt: transport verbatim → page_synthesis.study_tips
  → renderer Study tips moment
```

No separate post-DP injector; model is the transport path (with S78-T-055 separation from `transfer_prompt`).

### A9 — Visual jobs

```text
Assembled page in Utilities
  → refreshUtilitiesOutputWorkspaceFromPage
  → buildVisualJobsWorkspaceState / planPrismVisualJobs / compilePrismImageBriefs
  → operator Copy human prompt → external image model
  → Choose image → createVisualAssetAssociation / attachVisualAssetToWorkspace
  → workflow_page_resources / manifest
  → preview/export
```

### A10 — OPS review

```text
GAM accepted structurally
  → Copy verification prompt → model review JSON → Check verification
  → evaluateReviewGate (fail-closed advance)
  → on FAIL: regenerate GAM (full replacement), not patch
```

### Dead / legacy

- **L1 VEU:** retained utility JSON + tests; Sprint 70 Graphics is the integrated in-app path.  
- **L2 Sprint 38 `applyToComposedPage`:** not on live composition path (test references only).

---

## 4. Ownership analysis

| Path | Owns added information? | Trade-off / compensation? |
| ---- | ----------------------- | ------------------------- |
| A1 DLA | Yes — activity design substance | Canonical stage |
| A2 GAM | Yes — materials fulfilment | Canonical stage |
| A3 LS | Yes — sequence timing/structure | Canonical stage |
| A4 Design Page | Yes — synthesis, title, visual **planning** metadata | Must not steal GAM materials authorship |
| A5 GAI | Yes — assessment items | Canonical when step present |
| A6 Materials preserve | **Restores** GAM-owned bodies into composed page | **Yes — compensates** for Design Page thinning / synopsis loss. Intentional fail-soft for learner-facing fidelity, not a second author of materials |
| A7 Composition repair | Restores upstream-owned fields | Compensates incomplete/lossy later captures |
| A8 Study tips | GAM owns substance; DP owns transport slot | Aligned with S78-D04 |
| A9 Visual assets | Operator + brief identity own **asset**; Design Page owns planning | Correct associative boundary |
| A10 OPS | Owns review judgement only | Temporary instrumentation (S78-D02); not page ownership |
| P0 | Owns prompt instructions | Must not be mistaken for page ownership |

**Flag:** A6/A7 are legitimate **composition-time compensation** for known stage boundary failure modes. They are not silent pedagogical authorship transfers if metadata (`gam_materials_preserve_applied`) and upstream GAM remain authoritative for materials substance.

---

## 5. Source / context fidelity (model-driven paths)

| Path | Model receives | Gap risk |
| ---- | -------------- | -------- |
| A1 DLA | EP shell embed + DLA contract (+ runtime prompt augmentations) | Bounded by EP→DLA population contract |
| A2 GAM | Upstream DLA page embed + GAM enrich contract + ops salience | Materials must fulfil DLA; not full Design Page |
| A4 Design Page | Upstream page + thin-assembly / partial contracts; materials-copy cues | Instructed **not** to regenerate materials; may still under-copy bodies → A6 |
| A8 | Closure body inside upstream materials Markdown | Relies on heading being present; transport is prompt-driven |
| A9 image gen | Compiled **human brief** from page VA planning (not full page JSON to the image model in-app) | Brief fidelity depends on Design Page `allowed_claims` / house style |
| A10 | Review prompt + obligated material rows | Separate from page body; does not receive “fix this JSON in place” |

**Especially after Sprint 78:** boundary fidelity depends on **prompt salience + deterministic gates**, not on a post-hoc augment that invents missing context. No live path was found that claims to “augment” semantics the model was never given—except the **risk** that Design Page is asked to preserve materials it may not fully re-emit (mitigated by A6).

---

## 6. Preservation / authority classification

| Path | Class | Authoritative after operation |
| ---- | ----- | ----------------------------- |
| P0 | OTHER (prompt assembly) | Prompt ephemeral; page unchanged |
| A1–A5 | **C REFINING** of stage-owned fields on shared shell; or **D REPLACEMENT** of that stage’s prior capture | Latest successful stage capture for owned fields; assembly merges stages |
| A6 | **A ADDITIVE / restore** (overlay) of GAM bodies | GAM materials remain substance authority; composed page is presentation-complete |
| A7 | **A / B** restore or derive from upstream | Upstream capture preferred |
| A8 | **A** into `study_tips` (copy) | `study_tips` for renderer; GAM closure section remains source of truth for re-transport |
| A9 | **E ASSOCIATIVE** | Asset linked by `brief_id`; replace keeps association identity via `replaceVisualAssetAssociation` |
| A10 | OTHER (gate artefact) | Page unchanged; review gate state |
| A11 | **B DERIVED** HTML | HTML only |

Downstream generally **does not** label “original vs augmented” fields on the page JSON except A6 metadata flags and visual asset `provenance.source = manual-visual-job-intake`.

---

## 7. Repeatability / idempotence

| Path | Re-run behaviour | Compounding? |
| ---- | ---------------- | ------------ |
| P0 | Rebuilds prompt from current step/workflow | No (ephemeral) |
| A1–A5 | New capture **replaces** that stage’s contribution | No append of duplicate stages if operator replaces capture |
| A6 | Re-applies overlay; metadata flags set true | Idempotent in intent; not a second materials author |
| A7 | Re-applies repairs | Should be idempotent if upstream stable |
| A8 | Depends on model re-copying heading | Possible drift if DP re-authors tips without source |
| A9 | Attach **replaces** per `brief_id`; remove clears | No automatic append of duplicate assets for same brief |
| A10 | New review replaces prior review evaluation | No page compounding |

**Accidental compounding:** not observed as a first-class “append another augmentation blob” product. Risk is mainly **operator re-capture** of a stage with divergent content, or **stale visual assets** keyed to brief ids after planning refresh (see §8).

---

## 8. Staleness

| Path | Source changes after “augment” | Current behaviour | Risk |
| ---- | ------------------------------ | ----------------- | ---- |
| A1–A5 | Upstream changed; downstream not re-run | Stale downstream captures can remain until operator regenerates | **Known pipeline freshness** — hand to completeness audit |
| A6 | Fresh composition pass uses current upstream GAM | Re-overlay on compose | Low if compose re-runs |
| A8 | GAM closure changed; DP not re-run | `study_tips` can stale | Medium — no fingerprint |
| A9 | Page/VA planning rebuilt | Workspace rebuilds briefs; assets map by `brief_id`; rehydrate from `workflow_page_resources` | **If `brief_id` identity drifts, assets can orphan or attach to wrong job; no content fingerprint of source prose** |
| A10 | GAM regenerated | New review required | Gate re-run |
| P0 | N/A | Prompt rebuilt | None |

**No** general invalidation / freshness UI for “re-augment needed” was found for visual assets or study_tips. Assembly does **not** compare augmentation fingerprints to source hashes.

---

## 9. Validation

| Path | Schema / structural | Semantic | Source consistency | Fail mode |
| ---- | ------------------- | -------- | ------------------ | --------- |
| A1 | DLA validate enrich | practice_independence, production fulfilment, P02, etc. | EP population | Fail-closed capture |
| A2 | GAM validate enrich | OPS review (temporary), pack validation | vs DLA commission | Fail-closed / gate |
| A4 | Composition validation | Thin-assembly / materials preserve checks | Upstream materials | Fail-closed or repair then continue (preserve) |
| A6 | Metadata + G9-style checks in preserve module | Overlay heuristics | vs upstream GAM | Preserve path is restorative |
| A9 | Image input validation (mime/size) | Brief identity required | Missing briefs listed in manifest | Attach fails closed per asset; page can export with missing images |
| A10 | Review JSON shape | Suitability semantics | Obligated rows | Fail-closed advance |
| P0 | N/A | N/A | N/A | Bad prompt → bad generation (caught later) |

Aligned with Sprint 78 reliability stance: prefer **fail-closed generation validation** over silent sanitiser of authoritative content (R-006). A6 is restorative overlay from an authoritative upstream, not sanitiser of malformed JSON.

---

## 10. Canonical-pipeline relationship

```text
Brief / settings
  → Episode Plan (shell)
  → DLA enrich (partial authorship)     ┐
  → GAM enrich (partial authorship)     │  progressive enrich = normal pipeline
  → optional LS / assessment            │
  → Design Page enrich (partial)        ┘
  → deterministic composition preserve/repair (A6/A7)   ← post-stage fidelity
  → assemble partials → learner render/export
  → optional Utilities Graphics asset association (A9)  ← associative augmentation
```

**Prompt augmentation (P0)** wraps **every** model stage’s Copy path; it is an **instruction layer**, not a pipeline stage.

**Classification of “augmentation” as a layer:**

| Claim | Finding |
| ----- | ------- |
| Coherent architectural layer named Augmentation | **No** |
| Several unrelated conveniences sharing a name | **Partially** — name collision (prompt vs artefact) |
| Mixture | **Yes** — progressive enrich + preserve/repair + associative graphics + overloaded “augment” vocabulary |

---

## 11. Architectural consistency table

| Principle | Classification | Notes |
| --------- | -------------- | ----- |
| 1. Clear canonical owner | **SOUND** for stages; **MINOR** for A6 (restorative, documented in metadata) | |
| 2. Sufficient source context | **SOUND** for stage embeds; **MINOR** for image briefs (compiled subset) | |
| 3. No silent semantic ownership transfer | **SOUND** if A6 understood; **MINOR** if operators think DP authored restored materials | |
| 4. Predictable replace/merge | **SOUND** for stage re-capture and asset replace | |
| 5. Safe repeated execution | **SOUND** overall; **MINOR** for model transport A8 drift | |
| 6. Stale augmentation detectable/bounded | **ARCHITECTURAL CONCERN** (bounded) for A9 brief_id / no source fingerprint; pipeline freshness generally | Hand to completeness audit — not S78 |
| 7. Validation appropriate to risk | **SOUND** | |
| 8. Downstream coherent artefact | **SOUND** (assembly + preserve) | |
| 9. Not undocumented repair for upstream gaps | **MINOR INCONSISTENCY** | A6 is intentional compensation; needs vocabulary so it is not “hidden architecture” |

**INSUFFICIENT EVIDENCE:** stochastic rates of Design Page materials thinning in current packs (A6 frequency).

---

## 12. Useful future augmentation opportunities (evidence-led, not designs)

Only after current behaviour:

1. **Optional post-GAM “materials QA augment”** that proposes patches without replacing capture — **not recommended now**; OPS review already gates without mutating. Prefer upstream hardening (S78 direction).  
2. **Deterministic study_tips transport** (no model copy) — would reduce A8 drift; would be a small implementation if completeness audit demands it; not required by this diagnostic alone.  
3. **Workspace-surface packs** (future sprint) — optional associative or derived enhancements (e.g. attach interaction templates) fit **E ASSOCIATIVE / B DERIVED** better than stuffing into primary GAM generation.  
4. **Visual re-brief when page claims change** — operator-facing “briefs outdated” would address A9 staleness; belongs with completeness/freshness, not a new pedagogy stage.

Do **not** invent a general “Augment page” LLM stage: conflicts with R-001/R-002 and current partial+assemble model.

---

## 13. GAM reorganisation implications

Preserve / expose / clean up:

| Item | Guidance for behaviour-preserving GAM restructure |
| ---- | ------------------------------------------------- |
| Enrich-in-place partial contract | Keep: GAM owns materials; forbidden `page_synthesis` |
| Runtime prompt augmentation chain | Keep behavioural equivalence of injected contracts; prefer clearer DLA-like composition of **named blocks** without renaming the product “augment artefact” |
| Page learner-resource closure | Keep host-vessel rules (not inside `transfer_prompt`) |
| Materials preserve (A6) | Remains a **composition** concern, not GAM pack text — do not “fix thinning” by making GAM re-emit Design Page |
| OPS review | Remains temporary gate; not an in-place mutate path |
| Vocabulary | Prefer “GAM enrich / fulfilment” over “augment” in new docs to avoid P0 collision |

---

## 14. Learner workspace surface implications

Augmentation is **relevant later** as:

- optional **associative** attachment of interaction templates/assets to commissioned materials;  
- or **derived** renderer affordances from canonical material types;

not as a substitute for DLA commissioning of response surfaces.

Do **not** design those surfaces here. Hand planning to the dedicated workspace sprint.

---

## 15. Completeness-validation audit hand-offs

Hand off (do not solve here):

1. Freshness when upstream stages change after downstream capture (A1–A5 chain).  
2. `study_tips` vs current GAM closure heading consistency.  
3. Visual job `brief_id` stability vs attached assets when VA planning or synthesis claims change.  
4. Whether composition always re-runs A6 before export (operator path coverage).  
5. Missing-image export acceptability vs Release readiness.  
6. Whether `assembly_state.enriched_by` is sufficient provenance for “what stages contributed.”

---

## 16. Decision

**B. SMALL HYGIENE**

Architecture is **sound** when progressive enrich, prompt augmentation, preserve/repair, and visual association are not collapsed into one concept. Bounded documentation/terminology issues and staleness exposure are worth addressing **outside a sprint**. No concrete production defect found that demands immediate implementation (**not C**). No fragmented “augmentation product” requiring a dedicated sprint (**not D**). Not **A** only because the name collision and A6/A9 risks should not be left solely in sprint archaeology.

---

## 17. Smallest justified next action (if B)

1. Keep **this record** as the programme reference for “augmentation.”  
2. Optionally add 5–10 lines to `docs/development/shared-vocabulary.md` distinguishing **prompt augmentation** vs **page enrich** vs **asset association** vs **composition preserve** (docs only).  
3. Route A9/A8 freshness questions into the **completeness-validation audit** backlog note when that work opens.  
4. **Do not** implement freshness tracking, new augment capabilities, or GAM redesign from this diagnostic.

---

## 18. Files inspected (representative)

- `app.js` — `applyWorkflowStepRuntimePromptAugmentations`, composition/preserve, Utilities refresh, OPS wiring  
- `lib/ld-dla-page-enrich-contract.js`, `lib/page-dla-enrich.js`  
- `lib/ld-gam-page-enrich-contract.js`, `lib/page-gam-enrich.js`  
- `lib/page-gam-materials-preserve.js`  
- `lib/page-vnext-assemble.js`  
- `lib/ld-design-page-partial-contract.js`, `lib/ld-thin-assembly-coherence.js`  
- `lib/utilities-visual-jobs-workspace.js`, `lib/prism-visual-assets.js`, `lib/prism-visual-jobs-planner.js`  
- `lib/gam-operational-suitability-review.js`  
- `lib/sprint38-visual-affordances.js`  
- `docs/development/governance/ARCHITECTURAL-DEBT.md` (R-001, R-002, R-006)  
- `docs/architecture/episode-plan-ownership-boundary.md`  
- Sprint 38/56/57 prompt-augmentation audits (historical vocabulary)  
- Explore pass over UI labels / workflow actions (no “Augment” button)

---

## 19. Files changed (docs only)

- This record: `docs/architecture/augmentation-paths-diagnostic.md`

---

## 20. Sprint 78 confirmation

**Sprint 78 remains CLOSED.** This diagnostic does not reopen it, does not add Sprint 78 tasks, and does not alter T-013 / Final Gate dispositions.
