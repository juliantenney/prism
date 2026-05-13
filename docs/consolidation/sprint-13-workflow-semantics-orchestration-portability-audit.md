# Sprint 13 — workflow semantics and orchestration portability audit

**Date:** 2026-05-13  
**Path:** `docs/consolidation/sprint-13-workflow-semantics-orchestration-portability-audit.md`

**Role:** Map where **workflow generation**, **orchestration**, **refinement**, and **workflow semantics** implicitly depend on **specific domains** or **domain-shaped assumptions**. **Read-only audit documentation.**

**Confirmation — no implementation occurred:** **No** edits to **`app.js`**, **`workflowGenerationContext.js`**, domain packs, prompts, persistence, import/export, orchestration code, or Sprint 12 artefacts were made to produce this document.

**Out of scope for this pass:** Exhaustive line-by-line catalogue of every **`handleWorkflowAnswer`** branch; full Prompt Library semantics; **full drop-in portability** completion claims.

---

## 1. Inventory of orchestration / workflow-semantic coupling points

| # | Coupling point | Domain or shape assumption | Primary role |
|---|----------------|------------------------------|--------------|
| 1 | **`handleStartWorkflowDesign`** | **`shouldRecommendLearningDesignDomain`** — regex on design text suggests **Learning Design** before generation starts | Blocks auto-start; sets **`workflowDomainSuggestionPending`**; user “yes” forces **`learning-design`** on `<select>` (**`handleWorkflowAnswer`**) |
| 2 | **`buildWorkflowDesignBase` / `buildWorkflowDesignBrief`** | **`briefLines`** use **fixed English prefixes**; **`resolvedState.resolvedFactors.input_strategy`** merges into **starting artefact** line | Model-facing brief assembly; **not** driven by pack `uiHints` keys |
| 3 | **`continueWorkflowDesignGeneration`** | **`selectedDomains`** drives **`buildWorkflowGenerationContext`**, **`getStepPatternCatalog`**, **`getWorkflowPolicy`**; passes **`explicitBriefFactors`** / **`resolvedBriefFactors`** / **`mappedBindings`** into **`callOpenAIForWorkflowDesign`** | Central generation orchestration |
| 4 | **Post-generation elicitation queue** | **`state.workflowBriefElicitation`** uses **`domainId: getFirstStructuredDomainId(base.selectedDomains)`**; **`activeRefinementProfileId`** branches on **`design_page`**, **`learner_page_pack`** for copy | **LD-shaped** page/assessment refinement narrative |
| 5 | **`isGraphAffectingPostGenerationFactorId`** | Hard-coded factor ids (**`input_strategy`**, **`design_scope`**, **`assessment_required`**, **`session_materials`**, **`learning_environments`**) | Determines whether post-gen answers force **`continueWorkflowDesignGeneration`** regeneration |
| 6 | **`extractWorkflowBriefExplicitFactors`** | After **`generalOnly`**, blob regexes infer **duration**, **learner_level**, **delivery_mode**, **assessment_type**, **page_profile**, MCQ/essay cues, etc. | **Pedagogy / assessment** vocabulary — not generic for all future domains |
| 7 | **`getGeneralFallbackBriefConfig`** | Embedded **`requiredFactors`**, **`mappingRules`** to **`workflow.workflowOutputSpec.*`** | **General-only** brief schema when pack config absent |
| 8 | **`renderWorkflowFactoryDomainUiHints`** | If **`learning-design`** in selection, **overrides** default hint strings for outputs/constraints | **Domain-id branch** in core UI copy |
| 9 | **`renderWorkflowFactoryStartingArtefactOptions`** | **`STARTING_ARTEFACT_ALLOWLIST`** keyed **`general`** vs **`learning-design`**; **`visibleDomainId === "learning-design"`** forces **hard-coded trio** (generate_from_topic, …) ahead of brief-config / artefact catalogue | **LD-specific** starting-point UX |
| 10 | **`getFirstStructuredDomainId`** | First non-**`general`** id — pairs with WGC **first structured domain** for **`getWorkflowBriefConfig`** | **Single** structured domain semantics |
| 11 | **`pickCanonicalWorkflowStepTitle` / `getPatternByCanonicalWorkflowTitle`** | **Title** and **alias** matching against **catalog** from **`getStepPatternCatalog({ selectedDomains })`** | Heuristic **title → pattern** binding when **`canonical_step_id`** missing |
| 12 | **`getStructuredDomainVersionForWorkflow`** | Uses first structured domain + pattern **`domain_version`** | Step metadata when saving designed workflow |
| 13 | **Prompt Studio refinement** | **`buildPromptRefinementContext({ selectedDomains: state.workflowSelectedDomains || ["general"], leanMode: !!state.promptFactoryWorkflowContext })`** | **Session** domain selection, not workflow JSON **`wf.selectedDomains`** |
| 14 | **Workflow runner / step UI** (representative) | **`clsDomains`** may inject **`learning-design`** for styling when steps imply LD (**~11282–11284**) | Presentation coupling |
| 15 | **`normalizeWorkflowBriefConfig` / mapping application** | Interpret **`mappingRules`** targets **`workflow.workflowOutputSpec.*`** | **Generic** rule engine shape; **semantics** of factors come from pack or **`getGeneralFallbackBriefConfig`** |

---

## 2. File / function references

| Concern | Location (`app.js` unless noted) |
|---------|----------------------------------|
| **Design start orchestration** | **`handleStartWorkflowDesign`** (~5656+); **`handleWorkflowAnswer`** domain suggestion (~13488–13502) |
| **LD text recommendation** | **`shouldRecommendLearningDesignDomain`** (~3159–3167) |
| **First structured domain** | **`getFirstStructuredDomainId`** (~3150–3157); used in **`continueWorkflowDesignGeneration`** hints (~5609), brief config promise consumers, **`renderWorkflowFactoryStartingArtefactOptions`** via **`getVisibleDomainId`** |
| **Brief assembly** | **`buildWorkflowDesignBase`** (~5316–5334), **`buildWorkflowDesignBrief`** (~5336–5383) |
| **Generation + post-gen** | **`continueWorkflowDesignGeneration`** (~5385+); post-gen **`state.workflowBriefElicitation`** (~5607+) |
| **Explicit / inferred factors** | **`extractWorkflowBriefExplicitFactors`** (~3393+); **`interpretWorkflowBriefText`** / session materials (~3385+) |
| **General fallback brief** | **`getGeneralFallbackBriefConfig`** (~3169–3205) |
| **Factory UI / starting points** | **`renderWorkflowFactoryDomainUiHints`** (~2625+ with LD branch ~2648–2658); **`renderWorkflowFactoryStartingArtefactOptions`** (~2821–2997) |
| **Brief config normalisation** | **`normalizeWorkflowBriefConfig`** (~3207+) |
| **Step pattern heuristics** | **`pickCanonicalWorkflowStepTitle`**, **`getPatternByCanonicalWorkflowTitle`**, **`scoreWorkflowTitleMatch`** (~5963–6032+) |
| **Prompt Studio + WGC** | **`app.js`** refinement path (~8497–8526); **`workflowGenerationContext.js`** **`buildPromptRefinementContext`**, **`buildWorkflowGenerationContext`**, **`getWorkflowBriefConfig`**, **`getStepPatternCatalog`**, **`getWorkflowPolicy`** |

---

## 3. Separation: generic vs domain-aware vs domain-specific orchestration

| Layer | Meaning | Examples in this codebase |
|-------|---------|---------------------------|
| **Generic orchestration** | Flow control that does not hard-code a domain id | **`continueWorkflowDesignGeneration`** Promise chain; **`normalizeWorkflowBriefConfig`** shape; elicitation queue walk when driven only by **config-derived** factor lists |
| **Domain-aware orchestration** | Uses **`selectedDomains`** / **first structured id** to **load** pack content but does not embed one domain’s prose | WGC-backed **`getStepPatternCatalog`**, **`getWorkflowPolicy`**, **`getWorkflowBriefConfig`** keyed by selection |
| **Domain-specific orchestration** | **Core** encodes **Learning Design** (or similar) **ids**, **copy**, **heuristics**, or **allowlists** | **`shouldRecommendLearningDesignDomain`**; **`learning-design`** hint overrides; **`STARTING_ARTEFACT_ALLOWLIST`** + LD trio; **`design_page` / `learner_page_pack`** post-gen messaging; **`extractWorkflowBriefExplicitFactors`** pedagogy regexes; **`isGraphAffectingPostGenerationFactorId`** id list; forced `<select>` to **`learning-design`** on user yes |

---

## 4. Which semantics are manifest-owned, pack-owned, `app.js`-owned, or WGC-owned

| Owner | Semantics |
|-------|-----------|
| **Manifest-owned** | Which **domain ids** exist; **`label`**; ordered **`files[]`** per domain |
| **Pack-owned** (markdown + embedded JSON) | **Step patterns**, titles, aliases, **`domain_version`**, **`workflowBriefConfig`**, **`uiHints`**, **`intentClasses`**, policies, artefact catalogues consumed by WGC parsers |
| **WGC-owned** | **Which files load** for a selection; **first structured domain** rule for **`getWorkflowBriefConfig`**; refinement vs design **file filters**; text extraction helpers |
| **`app.js`-owned** | **`briefLines`** prefixes; **`getGeneralFallbackBriefConfig`**; **LD recommendation** and **starting-point allowlist / trio**; **title-similarity** thresholds; **post-gen** profile-specific strings; **`callOpenAIForWorkflowDesign`** compact directive and hint object assembly; Prompt Studio **`state.workflowSelectedDomains`** |

---

## 5. Risks for portable domain packs

1. **Hidden LD coupling:** New packs may still hit **LD-flavoured** heuristics, **allowlists**, and **post-gen** copy unless those paths are generalised or explicitly documented as LD-only.
2. **First-structured-domain ceiling:** Brief config and several UX paths assume **one** structured domain; multi-domain semantics are not orchestration-neutral.
3. **Title-based binding:** **`pickCanonicalWorkflowStepTitle`** remains a **compatibility** path; packs that rename titles risk drift unless **`canonical_step_id`** is always stable.
4. **Dual sources for starting points:** Brief-config **`input_strategy`** choices vs **LD hard-coded trio** vs **artefact catalogue** — precedence order is **complex**; new domains can misalign silently.
5. **Refinement vs design domain state:** Prompt Studio uses **`state.workflowSelectedDomains`**, not necessarily the workflow record under edit — semantic mismatch risk (also noted in persistence audit).
6. **`extractWorkflowBriefExplicitFactors`:** Rich inference assumes **education / assessment** language; **research** or **media** packs may get **wrong** inferred factors or noise unless **`generalOnly`** short-circuits.

---

## 6. Candidate future slices (audit-only)

| Slice | Meaning |
|-------|---------|
| **Documentation only** | Document which orchestration branches are **LD-specific** vs **config-driven** for operators and charter authors. |
| **Parity-safe extraction** | Extract pure helpers (e.g. queue walking) **only** with identical behaviour tests — no semantic rename of factors without charter. |
| **Orchestration contract definition** | Written contract: inputs/outputs of **`continueWorkflowDesignGeneration`**, elicitation stages, and required **config** hooks per domain — **documentation / ADR** level, not code in this audit. |
| **Unsafe without architecture / schema work** | Removing **`learning-design`** special cases, changing **first-structured** policy, or replacing title heuristics with new identity rules **without** migration and pack alignment. |

---

## 7. Required evidence before implementation

- **Decision matrix:** For each **`learning-design`** string branch in **`app.js`**, classify **remove / generalise / pack-move** and cite owning charter.
- **Factor-id inventory:** List all **`isGraphAffectingPostGenerationFactorId`** ids and other **hard-coded** post-gen factor ids vs **`workflowBriefConfig`** ids in each pack.
- **Starting-point flow diagram:** **`renderWorkflowFactoryStartingArtefactOptions`** branches (brief config → LD trio → artefact list).
- **Golden traces:** One **general-only** and one **learning-design** design run: log **`selectedDomains`**, **`resolvedFactors`**, **`mappedBindings`**, post-gen queue ids, and model **hint** payload keys.
- **Cross-link:** **`sprint-13-persistence-export-portability-audit.md`** for fields that must survive orchestration edges.

---

## 8. Stop conditions

- Do **not** remove or generalise **LD-specific** branches **without** replacement behaviour specified for existing LD workflows and packs.
- Do **not** change **`getFirstStructuredDomainId`** / WGC first-structured pairing **without** multi-domain policy (**S13-02** gate) and migration notes.
- **Sprint 12** — **not** reopened from this audit.

---

## 9. Explicit deferred items

- **S13-02 / S13-03** and starting-artefact decision artefacts remain **gated** per **`sprint-13-index.md`**.
- **Pragmatic target** (**`sprint-13-pragmatic-domain-pack-portability-target.md`**) states desired **registration vs archaeology** posture; this audit maps **where archaeology already exists** in orchestration — **no** merge into closure claims.
- **Persistence / export** field-loss topics — **`sprint-13-persistence-export-portability-audit.md`**.

---

## 10. Confirmation that no implementation occurred; no portability completion claim

This file is **audit documentation only**. No repository implementation was performed to author it.

**Full drop-in domain-pack portability** is **not** claimed, implied, or scheduled by this audit.

---

## Related artefacts

| Topic | File |
|-------|------|
| Prompt / config channels | [`sprint-13-prompt-config-portability-tracing-audit.md`](sprint-13-prompt-config-portability-tracing-audit.md) |
| Persistence / export | [`sprint-13-persistence-export-portability-audit.md`](sprint-13-persistence-export-portability-audit.md) |
| Starting artefact / LD starting-point | [`sprint-13-starting-artefact-ld-starting-point-portability-audit.md`](sprint-13-starting-artefact-ld-starting-point-portability-audit.md) |
| Pragmatic portability target | [`sprint-13-pragmatic-domain-pack-portability-target.md`](sprint-13-pragmatic-domain-pack-portability-target.md) |

---

## Review log

- **2026-05-13** — Workflow semantics and orchestration portability audit drafted (`sprint-13-workflow-semantics-orchestration-portability-audit.md`).
