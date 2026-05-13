# Sprint 11 — Fixture candidate inventory (documentation only)

**Purpose:** Inventory **likely** fixture / regression artefact targets for Sprint 11. **No** fixture files, **no** tests, **no** code changes are implied by this document.

**Grounding:** Sprint 10 audit `docs/consolidation/sprint-10-contract-audit.md` (especially §§3–8); repo layout `app.js`, `workflowGenerationContext.js`, `domains/**`, `library.js` (import/export).

**Sensitivity legend** (each candidate uses one or more):

| Tag | Meaning |
|-----|---------|
| **Deterministic** | Same inputs → same observable output (modulo explicit stripping of volatile fields). |
| **Heuristic-sensitive** | Regex / blob / `applyWorkflowDesignHeuristics` / normalizer branches can change without schema change. |
| **Prompt-sensitive** | Model-visible text, section order, or file-list embedding (WGC + design pipeline). |
| **Domain-sensitive** | Depends on manifest paths, pack markdown/JSON, `selectedDomains`, first-structured-domain rules. |

**Cost legend:** **Low** = small isolated snapshot or JSON slice; **Medium** = multiple modules or stubbed `fetch`; **High** = full pipeline, mixed stores, or heavy prompt text.

---

## 1. Minimal workflow brief

| Field | Detail |
|-------|--------|
| **Purpose** | Baseline **`briefLines` → `brief`** string (and matching `base`) with only required / minimal lines — detects ordering regressions and accidental omission of always-on lines (audit §3.1). |
| **Likely source paths** | `app.js` — `continueWorkflowDesignGeneration` (~5310+), `handleStartWorkflowDesign` (builds `base`); optionally `workflowGenerationContext.js` — `buildWorkflowGenerationContext({ brief })` (~176+). |
| **Likely regression value** | Catches BL prefix / join-order drift; smoke path for “empty optional fields”. |
| **Likely blast radius covered** | Factory → design prompt entry; WGC `## WORKFLOW BRIEF` section. |
| **Cost** | **Low** |
| **Sensitivity** | **Deterministic** (given fixed `base`), **domain-sensitive** (if `selectedDomains` affects downstream text), **prompt-sensitive** (tail of user message). |

---

## 2. Maximal workflow brief

| Field | Detail |
|-------|--------|
| **Purpose** | Full **`briefLines`** row set when optional fields + merged constraints present — exercises BL-01–BL-09 / BL-C interactions and compressor path (audit §3.1, §3.5). |
| **Likely source paths** | `app.js` — same as §1; `compressWorkflowConstraints` / merged constraint patch merge (~12469+ per audit). |
| **Likely regression value** | Catches ordering after BL-08, BL-09 vs `mergedConstraints`, dual encoding `scope_scale` vs narrative (audit §3). |
| **Likely blast radius covered** | Brief string + persistence-bound `scopeAndConstraints` / patches on design save (§8.5, §8.9). |
| **Cost** | **Medium** |
| **Sensitivity** | **Deterministic** (fixed inputs), **heuristic-sensitive** (compressor), **prompt-sensitive**, **domain-sensitive**. |

---

## 3. Cross-domain workflow brief

| Field | Detail |
|-------|--------|
| **Purpose** | **`selectedDomains`** with **general + LD** and **general + research** (and order permutations) — documents **normalizer collapse** vs design-time multi-load (audit §8.4, §7.8). |
| **Likely source paths** | `app.js` — `normalizeWorkflowForV1` (~12609+, `selectedDomains` collapse ~12713–12721); WGC `buildWorkflowGenerationContext` with domain file lists; `domains/domain-manifest.json` + per-domain files under `domains/learning-design/`, `domains/research/`, `domains/general/`. |
| **Likely regression value** | Prevents silent “multi-domain at design, single structured at rest” surprises on reload/export. |
| **Likely blast radius covered** | Persistence shape, import round-trip, WGC file set, first-structured `workflowBriefConfig` (§6.6, §7.8). |
| **Cost** | **Medium** |
| **Sensitivity** | **Deterministic** for normalizer output given fixed input array; **domain-sensitive**; **heuristic-sensitive** (which domain wins brief config). |

---

## 4. Learning-design workflow

| Field | Detail |
|-------|--------|
| **Purpose** | Workflow authored with **learning-design** as first structured domain — pins LD **`workflowBriefConfig`**, step-patterns, policy, and mapping vocabulary (audit §7). |
| **Likely source paths** | `domains/learning-design/*.md` (manifest-listed); `workflowGenerationContext.js` — `getWorkflowBriefConfig`, `getWorkflowPolicy`, `getStepPatternCatalog`; `app.js` — Factory + extraction + mappings. |
| **Likely regression value** | LD-specific factor ids, `mappingRules`, trigger vocabulary vs extractor (§4, §7). |
| **Likely blast radius covered** | Elicitation, design heuristics, saved `workflowBriefResolution`, step titles from catalog. |
| **Cost** | **Medium** |
| **Sensitivity** | **Domain-sensitive**, **heuristic-sensitive**, **prompt-sensitive** (pack text in WGC). |

---

## 5. Research workflow

| Field | Detail |
|-------|--------|
| **Purpose** | Same as §4 for **research** domain — **`objective_type`** and research-only factors (audit §4, §7.6). |
| **Likely source paths** | `domains/research/*.md`; same WGC / `app.js` surfaces as §4 with `selectedDomains` prioritising research. |
| **Likely regression value** | Research vs LD extractor overlap and `generalOnly` paths (audit §4). |
| **Likely blast radius covered** | Factor extraction, policy first-wins file order across domains. |
| **Cost** | **Medium** |
| **Sensitivity** | **Domain-sensitive**, **heuristic-sensitive**, **prompt-sensitive**. |

---

## 6. General fallback workflow

| Field | Detail |
|-------|--------|
| **Purpose** | **`getWorkflowBriefConfig`** returns null / **general-only** path — exercises **`getGeneralFallbackBriefConfig()`** (~3163+ per audit) vs pack-driven config. |
| **Likely source paths** | `app.js` — fallback brief config; `domains/general/*.md` (always-on markdown); no LD/research structured JSON block scenario. |
| **Likely regression value** | Ensures baseline Factory behaviour when packs missing or general-only selection; split **app vs pack** contract (§7.7). |
| **Likely blast radius covered** | Required factor set, labels, elicitation defaults. |
| **Cost** | **Low** |
| **Sensitivity** | **Deterministic** for fixed app fallback version; **heuristic-sensitive** if extraction still runs on blob; **prompt-sensitive** (WGC still loads general files). |

---

## 7. explicitBriefFactors extraction output

| Field | Detail |
|-------|--------|
| **Purpose** | Snapshot of **`extractWorkflowBriefExplicitFactors(base)`** return object (subset of keys) — pins regex/blob behaviour without calling OpenAI (audit §4). |
| **Likely source paths** | `app.js` — `extractWorkflowBriefExplicitFactors` (~3387+); inputs built from fixed `base` mirroring Factory fields. |
| **Likely regression value** | High-value guard for silent factor drift before any `briefLines` rename. |
| **Likely blast radius covered** | All downstream consumers of explicit factors (resolution, heuristics, persistence via design save). |
| **Cost** | **Low–medium** |
| **Sensitivity** | **Deterministic** for fixed `base`; **heuristic-sensitive** (regex, `generalOnly`); weak **domain-sensitive** unless `base` includes pack-derived hints. |

---

## 8. workflowBriefResolution output

| Field | Detail |
|-------|--------|
| **Purpose** | Persisted **`workflowBriefResolution`** object (or slice: `resolvedFactors`, `mappedBindings`) after elicitation — **design-save** path vs **gather-save** omission (audit §8.3, §8.9). |
| **Likely source paths** | `app.js` — `handleSaveDesignedWorkflow` (~13154+), `gatherWorkflowDetailFormData` (~11801+), `handleSaveWorkflow` (~11946+). |
| **Likely regression value** | Detects accidental drop of resolution on Workflows tab save; documents **two save semantics**. |
| **Likely blast radius covered** | Persistence, re-open behaviour, mapping patches, BL-09 / constraint merge. |
| **Cost** | **Medium** |
| **Sensitivity** | **Deterministic** per path if inputs fixed; **heuristic-sensitive** (resolution content); **domain-sensitive**. |

---

## 9. workflowGenerationContext output

| Field | Detail |
|-------|--------|
| **Purpose** | Full or hashed **`buildWorkflowGenerationContext`** string (or structured checks: section order, `### File:` count) — pins manifest-driven context (audit §5.1 PA-WGC, §6). |
| **Likely source paths** | `workflowGenerationContext.js` — `buildWorkflowGenerationContext` (~176+), `loadManifest` (~78+), `section()` helpers; `domains/**` + `docs/workflow/*.md` from `domain-manifest.json`. |
| **Likely regression value** | Catches file-order, cache, and fallback manifest changes; primary **prompt-sensitive** regression surface. |
| **Likely blast radius covered** | Initial design generation, any consumer of `promptContext`. |
| **Cost** | **Medium–high** (stub `fetch` for files unless using cached text fixtures). |
| **Sensitivity** | **Prompt-sensitive**, **domain-sensitive**; mostly **deterministic** once file bodies fixed; pack edits = baseline bump. |

---

## 10. Prompt-context excerpts

| Field | Detail |
|-------|--------|
| **Purpose** | **Redacted** slices of user/system messages: headers `## PLATFORM CONTEXT` / `## DOMAIN CONTEXT` / `## WORKFLOW BRIEF`, plus **`buildWorkflowCompactDirective`** tail (audit §5.1 PA-DES-USER). |
| **Likely source paths** | `app.js` — `callOpenAIForWorkflowDesign` / `requestWorkflowDesign` (~8943+ per audit); composed from WGC output + directive. |
| **Likely regression value** | Detects reordering, dropped sections, directive vocabulary drift vs `briefLines`. |
| **Likely blast radius covered** | Model-facing design contract; BL vs F-INT vs RC prefix families (§3.3, §5.6). |
| **Cost** | **Medium** |
| **Sensitivity** | **Prompt-sensitive**; **deterministic** with frozen WGC input + mode; **heuristic-sensitive** if directive includes resolved factors. |

---

## 11. Import / export round-trip bundles

| Field | Detail |
|-------|--------|
| **Purpose** | **`version: 1`** bundle JSON: `exportAllData` / `buildWorkflowBundle` → `importWorkflowsAndPrompts` with `normalizeWorkflowForV1` on each workflow (audit §8.2). |
| **Likely source paths** | `app.js` — `exportAllData` (~10418+), `buildWorkflowBundle` (~12834+), `importWorkflowsAndPrompts` (~12923+), `handleImportChange` / heuristics (~12886+); `normalizeWorkflowForV1` (~12609+). |
| **Likely regression value** | **Highest leverage** for persistence + merge policy; catches `updatedAt` / id replace / normalizer regressions. |
| **Likely blast radius covered** | Full workflow document shape, steps, `selectedDomains` collapse, Library coupling. |
| **Cost** | **Medium** |
| **Sensitivity** | **Deterministic** for fixed bundle + clock; **heuristic-sensitive** (import shape detection); **domain-sensitive** (post-load WGC refresh). |

---

## 12. Mixed provenance bundles

| Field | Detail |
|-------|--------|
| **Purpose** | Export including **library prompts** referenced by steps (`collectPromptsForWorkflows`) — import order prompts-before-workflows (audit §8.2–8.3). |
| **Likely source paths** | `app.js` — `buildWorkflowBundle`, `importWorkflowsAndPrompts`; `library.js` — `importPromptsFromEntries`, `getAllPrompts`. |
| **Likely regression value** | Catches missing prompt on target machine, `library_prompt` resolution, `newerWins` skip logic. |
| **Likely blast radius covered** | Step `promptId`, `resolveStepPromptText`, duplicate / stale prompt bodies. |
| **Cost** | **High** (two stores + IDB or dual localStorage in tests). |
| **Sensitivity** | **Deterministic** with stubbed Library; else **heuristic-sensitive** on merge timestamps. |

---

## 13. Prompt attachment preservation

| Field | Detail |
|-------|--------|
| **Purpose** | Round-trip **`canonicalizeWorkflowStepPromptAttachment`** + `prompt_source` / `prompt_source_type` / `library_prompt` invariants (audit §8.4 steps block, §8.5). |
| **Likely source paths** | `app.js` — `canonicalizeWorkflowStepPromptAttachment` (~10899+), `handleSaveWorkflow`, `normalizeWorkflowForV1` step normalisation (~12632+). |
| **Likely regression value** | Prevents silent loss of attachment metadata or bad normalisation on save/import. |
| **Likely blast radius covered** | Step execution, Library link, export subset. |
| **Cost** | **Low–medium** |
| **Sensitivity** | **Deterministic** for fixed step objects; **heuristic-sensitive** if normalizer strips fields. |

---

## 14. Workflow reload preservation

| Field | Detail |
|-------|--------|
| **Purpose** | **`loadWorkflows` → normalize → `populateWorkflowDetail`** observable fields before/after (spot subset: `workflowBriefResolution` presence, `selectedDomains`, step count) — audit §8.3. |
| **Likely source paths** | `app.js` — `loadWorkflows` (~10464+), `populateWorkflowDetail` (~10570+). |
| **Likely regression value** | End-user visible integrity after disk round-trip without export. |
| **Likely blast radius covered** | `normalizeWorkflowForV1` soft migrations, `selectedDomains` collapse, gather vs design field retention. |
| **Cost** | **Medium** |
| **Sensitivity** | **Deterministic** on fixed stored JSON; **heuristic-sensitive** via normalizer; **domain-sensitive** on re-fetch of catalogs. |

---

## 15. Render-plan preservation

| Field | Detail |
|-------|--------|
| **Purpose** | **`resolveUtilityRenderPlan`** output stability for fixed workflow artefact + format — render catalogue is **runtime-only** from WGC (audit §8.7, §10); fixtures document **behaviour**, not persisted JSON. |
| **Likely source paths** | `app.js` — `resolveUtilityRenderPlan` (~18631+); `workflowGenerationContext.js` — `getArtefactRenderCatalog` (~752+). |
| **Likely regression value** | Catches utilities drift when packs change; **orthogonal** to workflow JSON unless workflow references artefact ids. |
| **Likely blast radius covered** | Utilities export HTML / render pipeline; **not** saved workflow shape. |
| **Cost** | **Medium** (WGC + optional `{}` vs domain-filtered catalog per audit §6). |
| **Sensitivity** | **Domain-sensitive**, **prompt-sensitive** (catalog text); **deterministic** if catalog snapshot frozen; pack change = baseline bump. |

---

## Cross-reference

| Sprint 11 charter / checklist | Use |
|-------------------------------|-----|
| `docs/consolidation/sprint-11-workflow-generation-fixture-regression-foundations.md` | Scope, non-goals, exit criteria |
| `docs/consolidation/sprint-11-working-checklist.md` | Preparation tasks before creating files |

## Review log

- **2026-05-12** — **Inventory created** (documentation only): candidate categories, paths, costs, sensitivity tags; **no** fixtures or tests added.
