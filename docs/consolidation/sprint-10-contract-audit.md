# Sprint 10 — Workflow Brief Contract Audit (Bootstrap)

**Working title:** Sprint 10 — Workflow Brief Contract Rationalisation  
**Document type:** **Audit / architecture artefact** — documentation only  
**Status:** **Bootstrap + audit synthesis (§§9–12)** — inventories **§§3–8** are populated; **§§9–12** record architecture/governance synthesis from that evidence. This file **still does not** charter implementation, approve migrations, or authorise edits to production code or domain packs.

## Authority and read order

This audit doc **extends** the Sprint 10 bootstrap posture:

- `docs/consolidation/sprint-09-pass-1-closure.md` — what Sprint 09 shipped, what it **froze** as contract surface, commits **`3d88600`** / **`4b9f5ca`**, rationale for **not** mixing UI semantics with contract changes.
- `docs/consolidation/sprint-10-workflow-brief-contract-rationalisation-bootstrap.md` — recommended goals, non-goals, first audit task order, risks, regression/fixture ideas, governance posture.
- `docs/consolidation/sprint-08-workflow-planning-and-brief-semantics-alignment.md` — planning lifecycle vocabulary, brief/factor audit **intent**, pre/post-synthesis boundaries (planning foundation; **not** implementation approval).
- `docs/consolidation/sprint-07-workflow-generation-rationalisation-review.md` — pipeline mental model, stable behaviours to preserve, review questions for generation architecture.
- **This document** — read **§§3–8** for evidence-backed inventories; **§§9–12** for cross-system synthesis, migration-option families (not recommendations), and architectural conclusions.

**Sprint 07 strengths** (carry forward as design constraints per bootstrap): compact workflows, artefact chaining, learner-facing coherence, lightweight elicitation, emergent pedagogic sequencing behaviour — unless a **future** chartered exception documents trade-offs.

---

## 1. Scope and governance boundary

### What Sprint 10 audit **is**

- **Inventory and classify** the **workflow-generation contract**: how author and domain inputs become text and structured factors that **models** and **persistence** depend on.
- **Trace** planning semantics from Sprint 08 (brief vs elicitation vs post-synthesis configuration) onto **actual code paths** named in Sprint 09 governance — when a future charter permits implementation.
- **Prepare** compatibility matrices, regression concerns, fixture concepts, **contract classification**, **migration-option analysis** (strategy families), and **governance synthesis** as **discussion artefacts** only (§§9–12).

### What Sprint 10 audit **is not** (until explicitly re-chartered)

- **No** implementation: no renames of ids, labels, prefixes, or persisted fields; no generator, domain-pack, or runtime edits — consistent with Sprint 09 closure and Sprint 10 bootstrap **non-goals** (no renderer redesign, no sequencing-engine redesign, no domain-pack wholesale rewrite, no broad workflow-engine rewrite, no uncontrolled feature expansion).

### Boundary established in Sprint 09

Sprint 09 **separated**:

- **UI semantics alignment** (author-visible copy, placeholders, ARIA, display-only hints in `index.html` / `app.js` where **not** concatenated into prompts or saved brief assembly), from  
- **Workflow-generation contract semantics** — the **single prompt-and-extraction contract** spanning `briefLines`, `extractWorkflowBriefExplicitFactors`, step-context / prompt assembly, `workflowGenerationContext.js`, and domain-pack factor ids/labels/values (and prompt-coupled hints) where they affect generation or persisted brief meaning.

Sprint 10 audit work **lives entirely** on the **contract** side of that boundary. Findings here **do not** retroactively widen Sprint 09; they inform a **future** implementation charter.

### Governance posture (from bootstrap)

- **Audit before diff** — **bootstrap posture:** avoid production contract change **without** a row in a contract table (factor id, field, old/new semantics, blast radius, rollback) **if** contract work is pursued.
- **Explicit charter** — passes (e.g. audit-only → pilot → migrate) **typically** involve sign-off; **this document is not charter**.

---

## 2. Workflow-generation contract surface definition

The following **together** constitute the **workflow-generation contract surface** for PRISM v1 stabilisation purposes (aligned with `docs/consolidation/sprint-09-pass-1-closure.md` **Governance outcome** and Sprint 09 canonical **Sprint 09 governance**):

| Surface element | Role in contract (summary) |
|-----------------|----------------------------|
| **`briefLines` assembly** | Ordered text lines with **stable string prefixes** (e.g. goal, starting artefact, desired outputs, inputs/artefacts, constraints) that feed elicitation and/or design prompts; **prefix coupling** is a known risk (bootstrap). |
| **`extractWorkflowBriefExplicitFactors`** | Derives structured factors from brief text and related state; may use **synthetic brief blob lines**; interacts with domain **`workflowBriefConfig`** / factor ids. |
| **Step-context / prompt assembly** | Builders that push lines or fragments into prompts (e.g. scaffolding echoing brief or output spec); **mirrors** Factory vocabulary at risk of drift from UI-only changes. |
| **`workflowGenerationContext.js`** | Manifest / brief config extraction, defaults, and paths that connect **domain** assets to generation inputs. |
| **Domain-pack contract fields** | Factor **ids**, **labels**, **choice values**, **`uiHints`**, **`helpText`**, and prompt bodies where they **feed generation** or **persisted brief semantics** — distinct from Sprint 09’s **display-only** `app.js` overrides that did **not** alter pack files. |

**Planning lifecycle lens (Sprint 08):** contract surfaces **could in principle** be mapped to stages such as `brief`, `pre-synthesis elicitation`, `post-synthesis configuration`, `local step tuning`, and `renderer` — **classification aspiration** from Sprint 08 planning docs; **not** a commitment of this audit; **no** field rename implied.

**Out of scope for this definition table:** pure learner-surface **renderer** layout (Sprint 08 boundary); **sequencing engine** internals — except where prompt text or brief factors **implicitly** encode sequencing assumptions (note under risks).

---

## 3. `briefLines` inventory (populated — Sprint 10 audit pass)

**Sources:** `app.js` (line references **approximate** as of repository read during this audit), `workflowGenerationContext.js` (brief embedding only). **No code was modified.**

**Legend — “Feeds” column (short codes):**

| Code | Meaning |
|------|---------|
| **P** | Contributes to **LLM user/system-visible** workflow-design prompt (directly or inside `promptContext`). |
| **F** | Contributes to **factor extraction / interpretation** (`extractWorkflowBriefExplicitFactors`, `interpretWorkflowBriefText`, or regex `blob` built from the same Factory fields). |
| **W** | Passed into **`workflowGenerationContext.js`** `buildWorkflowGenerationContext` as `opts.brief` (embedded under `## WORKFLOW BRIEF`). |
| **PE** | Affects or mirrors **persisted workflow JSON / save path** (structured fields or merged constraint text), or **import/export** payloads that include those fields. |
| **UI** | **Presentation-only** (DOM `textContent` / clipboard helper text); **not** the canonical Factory `briefLines` array, but **reuses similar prefixes** → coupling risk. |

**Contract tier (per governance: default Contract unless proven display-only):**

| Tier | Meaning here |
|------|----------------|
| **Contract** | Prefix + shape assumed by prompts, extraction heuristics, or persisted mirrors. |
| **Hybrid** | Same human-readable label used in both model context and UI-only surfaces. |
| **Presentation** | Documented as display-oriented in source comments **and** no evidence of feeding P/F/W (still flag **possible implicit** if authors copy text into Factory). |

---

### 3.1 Canonical Factory design brief — `briefLines` array → `brief` string

**Assembly site:** `continueWorkflowDesignGeneration` (`app.js`, ca. **5310–5419**).  
**Variable:** local `briefLines` → `var brief = briefLines.join("\n")` (ca. **5342–5357**).  
**Join separator:** single newline `\n` (order **is** significant).

**Callers of `continueWorkflowDesignGeneration` (known):** post-domain / post-elicitation paths (e.g. ca. **5750**, **5843**), inference continuation (**13613**), elicitation completion (**13980**, **14004**), post-generation refinement continuation (**13497** — verify exact line in file if needed). **Entry from UI:** `handleStartWorkflowDesign` builds a `base` object and eventually reaches this function after resolution / domain flows (ca. **5618+**).

| ID | Literal prefix / pattern | Source (function; file) | State / inputs | Conditional / ordering | User vs synthetic | Known consumers (direct chain) | Feeds | Domain-pack influence | Tier | Risk if changed | Notes / coupling |
|----|---------------------------|-------------------------|----------------|------------------------|-------------------|--------------------------------|-------|------------------------|------|-----------------|-------------------|
| **BL-01** | `Name: ` | `continueWorkflowDesignGeneration`; `app.js` ~5343 | `base.name` | **Always first** push; unconditional | User-derived | `brief` → `WorkflowGenerationContext.buildWorkflowGenerationContext({ brief })` (~5363–5365) → `promptContext` section `WORKFLOW BRIEF` (`workflowGenerationContext.js` ~176–219); fallback same string to `callOpenAIForWorkflowDesign` (~5405–5407) | P, W; PE **indirect** (`wf.name` on save, **not** this exact prefixed line — **semantic** alignment only) | Indirect via domain choice affecting rest of prompt | **Contract** | **High** | Sprint 09 **explicitly** left prefix untouched. Models may anchor on `Name:` line ordering. |
| **BL-02** | `Task / design intent: ` | same; ~5344 | `base.designIntent` | **If** `designIntent` truthy; emitted **before** goal line when present | User-derived | Same chain as BL-01 | P, W; F **indirect** (same text in `base` drives `blob` / synthetic blob in **F-INT** — not by parsing this line) | Same | **Contract** | **High** | Ordering: appears **above** BL-03 when both exist. |
| **BL-03** | `Goal / outcome: ` | same; ~5345 | `(goal \|\| designIntent)` where `goal` from `base.goal` | **Always** pushed (value can duplicate design intent when Factory sets `goal = designIntent` in `handleStartWorkflowDesign` ~5629) | Hybrid user/default | Same + `callOpenAIForWorkflowDesign` hints `goal: goal \|\| designIntent` (~5408) | P, W, F (field + blob); PE indirect (`workflowOutputSpec.goal` on save uses design intent path ~13328) | Same | **Contract** | **High** | **Critical mismatch elsewhere:** synthetic interpret blob uses **`Goal: `** without “/ outcome” (**F-INT**, ~3399). Same semantics, **different prefix** → dual contract. |
| **BL-04** | `Audience: ` | same; ~5346 | `base.audience` | If truthy | User-derived | Same | P, W; F; PE indirect | Same | **Contract** | **High** | Mirrors Prompt Factory / run summary vocabulary (**RC-**, **PF-**, **RM-**). |
| **BL-05** | `Scope / scale: ` | same; ~5347 | `base.scopeScale` | If truthy | User-derived | Same | P, W; F; PE indirect (`scope_scale:` injected into `scopeAndConstraintsCombined` on save ~13347–13350 — **different** encoding than this line) | Same | **Contract** | **High** | **Dual encoding:** narrative line here vs `scope_scale: …` inside persisted `scopeAndConstraints` string. |
| **BL-06** | `Inputs / artefacts: ` | same; ~5348 | `base.inputs` | If truthy | User-derived | Same | P, W; F; PE indirect (`artefacts`, `workflowInputs`) | Same | **Contract** | **High** | Synthetic interpret blob uses **`Inputs: `** only (**F-INT** ~3401) — **another prefix mismatch** vs BL-06. |
| **BL-07** | `Starting artefact: ` | same; ~5349 | `effectiveStartingArtefact` = `startingArtefact \|\| resolvedState.resolvedFactors.input_strategy` (~5319–5326) | If truthy | **Hybrid** (user field or elicitation-resolved factor) | Same | P, W; F (`input_strategy` from `base.startingArtefact` ~3406–3415); PE (`wf.startingArtefact`) | **Yes** — domain extra fields / LD starting-point options shape **values**; prefix is app-owned | **Contract** | **High** | Merges UI starting artefact with **resolved** `input_strategy`; ordering after BL-06. |
| **BL-08** | `Desired outputs: ` | same; ~5350 | `base.desiredOutputs` | If truthy | User-derived | Same | P, W; F (`desired_outputs`, `blob`); PE (`workflowOutputs` list) | Values reflect domain Factory hints (Sprint 09 changed **display** hints only) | **Contract** | **High** | Sprint 09 closure: **frozen** prefix. **F-INT** repeats `Desired outputs: ` (~3400) — consistent here only. |
| **BL-09** | `Scope and constraints (compressed): ` | same; ~5351–5355 | `compressWorkflowConstraints(mergedConstraints).compact` | Only if `mergedConstraints` truthy **and** `compact` non-empty | **Synthetic** (compressor output) | Same | P, W; F **indirect** (`scope` / `base.scopeConstraints` and patch keys already in `blob`; this line adds **compressed** form); PE **parallel** (`scopeAndConstraints` + patch merge on save ~13336–13345) | Patch **keys** come from domain/elicitation mapping (`workflowConstraintPatch`); prefix is app-owned | **Contract** | **High** | **Ordering:** always **after** BL-01–BL-08 block. Compressor strips bullets, splits on `;` / newlines (`compressWorkflowConstraints` ~12469+). |
| **BL-C** | `«constraintKey» + ": " + «value»` (per key) | same; ~5334–5337 | `resolvedState.mappedBindings.workflowConstraintPatch` | Each object key `k` → line `k + ": " + mappedConstraints[k]` joined later with `"; "` into `mergedConstraints` | **Synthetic** (elicitation / mapping) | Feeds BL-09 path only (not separate `briefLines` rows unless compressed into BL-09) | P, W (via merged text); F (raw scope + patch text in `base.scopeConstraints` / inferred blob); PE | **Yes** — keys are domain-defined factor ids / constraint ids | **Contract** | **High** | **No stable human prefix** beyond `": "` — key namespace is part of contract. |
| **BL-J** | *(joiner)* `\n` between all pushed lines | same; ~5357 | N/A | Fixed join | N/A | Entire string is one document | P, W | N/A | **Contract** | **Medium** | Some consumers split briefs by newline heuristically **elsewhere** (possible implicit dependency). |

**Downstream from `brief` (same function, immediate):**

- `buildWorkflowGenerationContext({ selectedDomains, brief })` (~5363–5365): **`workflowGenerationContext.js`** wraps `brief` in `section("WORKFLOW BRIEF", brief || "No brief provided.")` (~216) inside larger `promptContext`.
- `callOpenAIForWorkflowDesign(ctx.promptContext \|\| brief, hints)` (~5405–5418): user message body prefix is **`String(promptContext || "") + "\n\n" + buildWorkflowCompactDirective(mode)`** (`callOpenAIForWorkflowDesign` ~8943–8949). So **P** always includes full platform+domain+brief context when WGC succeeds.
- `extractWorkflowBriefExplicitFactors(base)` (~5415): **does not receive `brief` string**; consumes **parallel** `base` object. **F** path is **not** line-parser based for most factors — regexes use **`blob`** from raw fields (~3395), while **`interpretWorkflowBriefText`** uses a **different** synthetic multiline string (**F-INT** below).

---

### 3.2 Synthetic interpret blob (not `briefLines`, same sprint contract family)

**Assembly site:** `extractWorkflowBriefExplicitFactors` → `interpretWorkflowBriefText(...)` (`app.js` ~**3396–3403**).  
**Purpose:** derive `session_materials` / `learning_environments` via substring heuristics (`extractSessionMaterialsFromBriefText` / `extractLearningEnvironmentsFromBriefText`, ~3278+ / ~3351+).

| ID | Literal lines (exact joined fragment) | Source | Inputs | User vs synthetic | Feeds | Tier | Risk | Notes |
|----|----------------------------------------|--------|--------|-------------------|-------|------|------|-------|
| **F-INT** | `What are you trying to design: ` + designIntent newline `Goal: ` + goal newline `Desired outputs: ` + desiredOutputs newline `Inputs: ` + inputs newline `Constraints: ` + scope | `extractWorkflowBriefExplicitFactors`; `app.js` ~3397–3403 | Same `base` fields as BL-02,3,6,8 + `scopeConstraints` | **Synthetic scaffolding** (not shown to user as a single block) | **F** only (`interpretWorkflowBriefText`) | **Contract** | **High** | **Prefix drift vs BL-03 / BL-06 / BL-09:** `Goal:` vs `Goal / outcome:`; `Inputs:` vs `Inputs / artefacts:`; `Constraints:` vs merged/compressed constraint story. **Possible implicit dependency:** any future code assuming one string is substring of the other. |

---

### 3.3 Persisted workflow → summary / runtime / Prompt Factory text (reuse of brief-like prefixes)

These paths **do not** read the Factory `briefLines` variable; they **reconstruct** narrative from **`wf`** / **`ctx`** fields. They still form a **second lexical contract** (Sprint 09 “single prompt-and-extraction contract” **family** — audit flags overlap).

| ID | Representative literal | Source (`app.js`) | Inputs | Feeds | Tier | Risk | Notes |
|----|------------------------|-------------------|--------|-------|------|------|-------|
| **WS-01** | `Workflow: ` | `buildWorkflowSummaryText` ~12165 | `wf.name` | Clipboard copy (`handleCopyWorkflowSummary` ~12404+); **not** LLM by default | **Hybrid** | Medium | Different header than `Name:` (BL-01). |
| **WS-02** | `Workflow inputs / artefacts:` then raw `wf.artefacts` on next line | ~12169–12172 | `wf.artefacts` | Same | **Hybrid** | Medium | Label differs from BL-06 line structure (header + body lines). |
| **WS-03** | `Starting artefact: ` | ~12174–12175 | `wf.startingArtefact` | Same | **Contract** | High | Same prefix as BL-07. |
| **WS-04** | `Workflow outputs (list):` | ~12177–12180 | `wf.workflowOutputs` | Same | **Hybrid** | Medium | Not identical to BL-08 (“Desired outputs”). |
| **WS-05** | `Workflow output spec:` / `Audience:` / `Goal / outcome:` / `Constraints and must haves: ` | ~12188–12192 | `normalizeWorkflowOutputSpec(wf.workflowOutputSpec)` | Same | **Contract** | High | **`Goal / outcome:`** matches BL-03 prefix; **constraints** label differs from BL-09. |
| **RC-01** | `Goal: ` *(not `Goal / outcome:`)* | `buildWorkflowRuntimeContextText` ~12274–12278 | `outputSpec.goal` (possibly sanitized) | Prepended to **step copy** text in run mode (~11379–11387) → external LLM / Copilot | **Contract** | **High** | **Third** goal prefix variant in workflow subsystem. |
| **RC-02** | `Audience: ` | ~12279 | `outputSpec.audience` | Same | **Contract** | High | Matches BL-04 / WS-05 audience line. |
| **RC-03** | `Constraints: ` | ~12281–12289 | `outputSpec.constraints` (line-filtered when upstream) | Same | **Contract** | High | Differs from BL-09 / WS-05 constraint wording. |
| **RC-04** | `Inputs: ` | ~12291 | `workflowInputs` list | Same | **Contract** | High | **Fourth** variant vs `Inputs / artefacts:` (BL-06) and `Inputs:` in F-INT. |
| **RC-05** | `Desired outputs: ` | ~12296–12298 | `workflowOutputs` joined | Same | **Contract** | High | Prefix **matches** BL-08 / F-INT desired line. |
| **RC-06** | `Step boundary: For this upstream step...` | ~12301–12303 | `suppressAssessmentCues` branch | Same | **Contract** | Medium | Behavioural guardrail line; ordering after RC-* block. |
| **RM-01** | `Inputs / artefacts: ` / `Audience: ` / `Goal / outcome: ` / `Output constraints: ` | `updateWorkflowDetailModeUI` (run header) ~8147–8155 | DOM workflow fields | **UI** (`textContent` only) | **Presentation** (per comment path) | Low–Medium | **Hybrid risk:** users read same words as BL-* / RC-*; **possible implicit** copy-paste into prompts. |
| **PF-01** | `Workflow goal: ` / `Workflow inputs / artefacts: ` / `Workflow inputs: ` / `Workflow outputs: ` | `buildPromptFactoryWorkflowContextText` ~12556–12565 | `ctx` from Prompt Factory | Prompt Studio / step refinement payloads | **Contract** | High | Parallel vocabulary to Factory lines. |
| **PF-02** | `Workflow-owned brief parameters:` / `- Audience: ` / `- Goal / outcome: ` / `- Constraints (compressed): ` | ~12596–12603 | `ctx.workflowOutputSpec` + `compressWorkflowConstraints` | Same | **Contract** | High | Uses **`Goal / outcome:`** (matches BL-03) and **compressed** constraints label distinct from BL-09. |
| **PS-*** | `Audience: `, `Goal / outcome: `, `Constraints & must-haves: `, etc. | `buildRefinementBriefParts` ~7708–7746; `buildRefinementUserContentFromBrief` ~7749–7763; `buildBriefSummaryForExternalTool` ~7766+ | Prompt Studio `brief` snapshot | Prompt refinement / external tool copy | **Presentation** vs **Contract** boundary: model-facing refinement (**P**) | Medium | Comments state “model-facing runtime shaping, not canonical state” (~7709) — still **P** for refinement sessions. |

---

### 3.4 Ordering dependency (canonical Factory `briefLines` when all optional fields present)

1. `Name:`  
2. `Task / design intent:` *(if designIntent)*  
3. `Goal / outcome:` *(always)*  
4. `Audience:` *(if audience)*  
5. `Scope / scale:` *(if scopeScale)*  
6. `Inputs / artefacts:` *(if inputs)*  
7. `Starting artefact:` *(if effectiveStartingArtefact)*  
8. `Desired outputs:` *(if desiredOutputs)*  
9. `Scope and constraints (compressed):` *(if compressor returns compact)*  

**Transformations before BL-09:** `mergedConstraints` = `scopeConstraints` from `base.scopeConstraints` concatenated with **`"; "`**-joined **BL-C** lines (~5338–5340), then passed to **`compressWorkflowConstraints`** (~5352–5354).

---

### 3.5 Observed coupling patterns and audit implications

1. **Multiple parallel “brief” lexicons:** The same author facts flow through **BL-*** (Factory design `briefLines`), **F-INT** (synthetic interpret blob with **different** goal/inputs/constraints prefixes), **RC-*** (run-time step context with **`Goal:`** and **`Inputs:`**), **WS-*** (workflow summary copy), **PF-*** (Prompt Factory context), and **RM-*** (run-mode DOM summary). **Audit implication:** **if** prefix normalisation were ever chartered, it **would need to be** **cross-indexed** across all rows above, not only `continueWorkflowDesignGeneration`.

2. **`extractWorkflowBriefExplicitFactors` vs `briefLines`:** Most inferred factors are driven by a **lowercased `blob`** of raw field text (~3395), **not** by parsing the joined `brief` string. **`interpretWorkflowBriefText`** is the main consumer of **line-shaped** synthetic scaffolding (**F-INT**). **Audit implication:** changing BL-* lines does **not** automatically update F-INT; the pair can drift silently.

3. **`compressWorkflowConstraints` is a shared semantic compressor:** Used for **BL-09**, **PF-02**, Prompt wizard hint (**`renderWorkflowPromptWizardNotice`** ~7471–7473), and indirectly influences what authors see vs what models read. **Audit implication:** one algorithm change alters **multiple** surfaces (P/UI).

4. **Persistence does not store `briefLines` verbatim:** Save path (`handleSaveDesignedWorkflow` ~13154+) stores **structured** `name`, `artefacts`, `workflowOutputSpec`, `scopeAndConstraints` (including **`scope_scale:`** patch suffix ~13347–13350), `workflowBriefResolution`, etc. **Audit implication:** import/export compatibility is **field-level**, while LLM contracts are **string-level** — regression tests need **both** views.

5. **`workflowGenerationContext.js` treats `brief` as opaque prose:** It does **not** re-parse prefixes; the entire joined string is dropped under **`## WORKFLOW BRIEF`**. **Audit implication:** platform/domain markdown and brief share one prompt surface; blast radius of brief edits is **full** design prompt.

6. **Domain-pack influence is mostly value-side for BL-***:** Sprint 09 avoided pack edits; LD hints changed **display** strings in UI. **Values** (`domainExtraValues`, starting artefact options) still flow into **`base`** and thus **BL-*** and **F**. **Audit implication:** domain **ids/labels/values** remain contract-coupled per Sprint 09 governance.

7. **Elicitation chat text is out-of-table but coupled:** `buildWorkflowBriefQuestionText` (~4277+) builds **questions**, not BL lines, but governs **what** gets mapped into **`workflowConstraintPatch`** / factors that later appear in **BL-C** / **BL-09**. **Possible implicit dependency** between question wording and user free-text that becomes constraints.

**No implementation changes are proposed by this section** — inventory and implications only.

---

## 4. `extractWorkflowBriefExplicitFactors` inventory (populated — Sprint 10 audit pass)

**Sources:** `app.js` (function and callers), `workflowGenerationContext.js` (`getWorkflowBriefConfig` / `extractWorkflowBriefConfigFromText`), `domains/domain-manifest.json`, `domains/learning-design/domain-learning-design-step-patterns.md` and `domains/research/domain-research-step-patterns.md` (**`### Workflow Brief Config`** JSON blocks). **No source code was modified.**

**Default tier/risk posture (per Sprint 09 closure + Sprint 10 bootstrap):** treat **factor ids** and **synthetic extraction scaffolding** as **Contract** / **High** blast radius unless explicitly display-only.

---

### 4.1 Function location and callers

| Item | Detail |
|------|--------|
| **Definition** | `function extractWorkflowBriefExplicitFactors(base)` — `app.js` ca. **3387–3576**. |
| **Helpers used** | `interpretWorkflowBriefText` (~3377–3384) → `extractSessionMaterialsFromBriefText` / `extractLearningEnvironmentsFromBriefText`; `mergeUniqueStringList` (~3367+); `isGeneralOnlySelection` (~3059–3065). |
| **Call site C1** | `continueWorkflowDesignGeneration` — passed as `explicitBriefFactors: extractWorkflowBriefExplicitFactors(base)` into `callOpenAIForWorkflowDesign` hints (~**5415**). |
| **Call site C2** | Post-generation elicitation setup — `state.workflowBriefElicitation = { … explicitValues: extractWorkflowBriefExplicitFactors(base) … }` (~**5573**). |
| **Call site C3** | Pre-generation resolution path — `var explicitValues = extractWorkflowBriefExplicitFactors(base)` before `applyWorkflowBriefInferenceRules` + `resolveWorkflowBriefFactors` (~**5755**). |

`workflowGenerationContext.js` **does not** call this function; it loads **`workflowBriefConfig`** separately for UI/elicitation (`getWorkflowBriefConfig`).

---

### 4.2 Inputs and expected shapes

**Parameter:** `base` — plain object assembled from Workflow Factory UI in `handleStartWorkflowDesign` (~**5698–5710** and variants). Expected fields read by the extractor (all optional except behaviour depends on presence):

| Field on `base` | Role |
|-----------------|------|
| `goal`, `designIntent`, `audience`, `scopeScale`, `inputs`, `desiredOutputs`, `scopeConstraints` | Coerced with `String(...).trim()`; concatenated into **`blob`** (lowercased join with `\n`, ~**3395**). |
| `startingArtefact` | Maps to `input_strategy` when non-empty (~**3406–3412**); also merged into effective starting artefact in `continueWorkflowDesignGeneration` for **BL-07** (separate from this function). |
| `domainExtraValues` | Object from `collectWorkflowDomainExtraFieldValues()` — keys = **`data-factor-id`** from domain **`extraFields`** (~**2733–2744**, merged into `base` at ~**5707**). |
| `selectedDomains` | Array; drives **`isGeneralOnlySelection`** (~**3434–3436**) — **no** structured domain ⇒ early return before LD-style heuristics. |

**Implicit coupling:** `blob` **does not** include `startingArtefact` text for regex heuristics (only the listed seven fields). Starting strategy heuristics at ~**3569–3572** use `blob` only.

---

### 4.3 Outputs, downstream consumers, and precedence

**Return value:** flat object `out` — keys are **snake_case** factor ids or domain extra ids. Consumption chain:

1. **`resolveWorkflowBriefFactors(config, explicitValues, elicitedValues, inferredValues, baseBrief)`** (~**3620–3689**): **`explicitValues`** channel has **strict precedence** over `elicited` and `inferred` for declared factors (`explicit[id] !== ""` wins first).  
2. **Special passthrough** (~**3670–3688**): `include_answers` and `include_feedback_guidance` are copied from explicit even if **not** listed in `workflowBriefConfig` factors — **implicit extension** of the domain schema.  
3. **`callOpenAIForWorkflowIntentInterpretation`** merges AI factors with **`applyWorkflowBriefInferenceRules`** output; merge order is `Object.assign({}, aiFactors, ruleInferredValues)` (~**5772**) — **deterministic rules overwrite AI** for colliding keys. **`explicitValues` are not overwritten here** — they enter resolution separately and trump inferred in `resolveWorkflowBriefFactors`.  
4. **`callOpenAIForWorkflowDesign`** — `hints.explicitBriefFactors` consumed in **`applyWorkflowDesignHeuristics`** (~**6169+**), notably **`explicitBriefFactors.session_materials`** for step shaping (~**6191–6198**).  
5. **Persistence** — resolved/mapped outputs flow through save path (`workflowBriefResolution`, patches) — **indirect**; extractor output alone is **not** written raw to disk.

**Collision / overwrite *inside* `extractWorkflowBriefExplicitFactors` (sequential assignment order):**

| Mechanism | Behaviour |
|-----------|-----------|
| `domainExtraValues` loop (~**3420–3426**) | **Last write wins** per duplicate key if DOM duplicated ids (unlikely). Can **overlap** keys with inferred factors (e.g. domain extra id equals a heuristic key) — later stages may overwrite. |
| `interpreted.session_materials` (~**3427–3428**) | **Replaces** `out.session_materials` with a **copy** of interpreted array when non-empty. |
| `interpreted.learning_environments` (~**3430–3431**) | **`mergeUniqueStringList`** merges into `out.learning_environments`. |
| `assessment_required` (~**3455–3456**) | Two independent `if` tests — if blob matches **both** positive and negative cues, **`false` wins** (second assignment). |
| `page_profile` (~**3458–3463**) | `if / else if` — **first** regex match wins. |
| `assessment_type` (~**3466–3470**) | `if / else if` chain — **first** match wins. |
| `include_answers` / `include_feedback_guidance` / `feedback_required` (~**3477–3488**) | Mutually exclusive branches: **hide-answers** regex branch **forces** `include_answers=false`, `include_feedback_guidance=false`, `feedback_required="none"`; else branch **additively** sets true flags. |
| `objective_type` (~**3560–3563**) | **Separate** `if` statements — **last** matching pattern in file order **wins** (e.g. both “analysis” and “briefing” could match; later overwrites). |
| `input_strategy` (~**3569–3572**) | Only runs if `!out.input_strategy` — explicit `startingArtefact` or earlier **`provided_source_content`** shortcut (~**3414–3415**) **blocks** heuristic topic/source detection. |

---

### 4.4 All extracted / emitted factor ids (deterministic function body)

**Always considered (may be absent from output if empty / skipped):**

| Output key | Origin | When omitted |
|------------|--------|--------------|
| `design_intent` | `base.designIntent` if truthy | Omitted if empty |
| `audience` | `base.audience` | Omitted if empty |
| `scope_scale` | `base.scopeScale` | Omitted if empty |
| `desired_outputs` | `base.desiredOutputs` | Omitted if empty |
| `input_strategy` | `base.startingArtefact` **or** `"provided_source_content"` if `inputs` non-empty and no strategy yet (~**3414–3415**) | Heuristic branch may set again later (~**3569–3572**) only if still unset |
| `«extraFieldId»` | Each key from `base.domainExtraValues` | Skipped if `v == null` or empty string (non-array); **arrays** pass through without trim check |
| `session_materials` | `interpretWorkflowBriefText` and/or fallback `extractSessionMaterialsFromBriefText(blob)` (~**3555–3557**) | May be absent |
| `learning_environments` | `interpretWorkflowBriefText` merge | May be absent |

**Only if `!isGeneralOnlySelection(base.selectedDomains)`** (i.e. at least one domain ≠ `"general"` after trim, ~**3059–3065**):

| Output key | Trigger (summary) |
|------------|-------------------|
| `duration_minutes` | Regex on `blob` for minutes (~**3439–3442**) |
| `learner_level` | Regex word match (~**3445–3447**) |
| `delivery_mode` | `async` / `seminar` / `live_workshop` cues (~**3450–3452**) — **mutually exclusive** else-if |
| `assessment_required` | `true` / `false` from blob cues (~**3455–3456**) |
| `page_profile` | `assessment` / `facilitator` / `learner` string (~**3458–3463**) |
| `assessment_type` | essay / short_answer / case_study / problem / mcq (~**3466–3470**) |
| `include_answers`, `include_feedback_guidance`, `feedback_required` | Answer/feedback/hide regex families (~**3477–3488**) |
| `assessment_total_items` | `firstAssessmentItemCountFromText(blob)` (~**3537–3539**) |
| `topic` | Subject regex on `goalLower` (~**3542–3552**) |
| `workshop_subject` | **Same value as `topic`** — comment: *Backward-compatible alias for older domain configs* (~**3550–3551**) |
| `objective_type` | summary / analysis / briefing / questions (~**3560–3563**) |
| `output_depth` | concise / detailed / standard (~**3565–3567**) |

**Tier / risk (aggregate):** any key that appears in **`workflowBriefConfig`** (LD/research) or in **`applyWorkflowDesignHeuristics`** — **Contract**, **High** if changed without coordinated domain + save + prompt tests.

---

### 4.5 Synthetic lines, blobs, and prefix assumptions

| Artefact | Content | Prefix / shape assumptions |
|----------|---------|------------------------------|
| **`blob`** | `[goal, designIntent, audience, scopeScale, inputs, desiredOutputs, scope].join("\n").toLowerCase()` | **No** line prefixes — **whole-field** semantics; order of fields in join is **fixed**; all lowercased. |
| **F-INT synthetic block** (passed to `interpretWorkflowBriefText`) | Join of lines: `What are you trying to design: `, `Goal: `, `Desired outputs: `, `Inputs: `, `Constraints: ` (~**3397–3403**) | **Not** aligned with canonical **`briefLines`** prefixes (`Goal / outcome:`, `Inputs / artefacts:`, `Scope and constraints (compressed):`) — see **§3** in this doc. **Contract** for `interpretWorkflowBriefText` path only; **possible implicit** coupling if someone assumes parity with BL. |

**`interpretWorkflowBriefText` and substring helpers:** `extractSessionMaterialsFromBriefText` / `extractLearningEnvironmentsFromBriefText` operate on **normalized lowercase prose** with **keyword** regexes (~**3278+**, ~**3351+**) — they do **not** parse `Name:` / `Goal:` line labels; F-INT prefixes are **cosmetic scaffolding** for human-readable-ish blob.

---

### 4.6 Normalisation behaviour

| Stage | Rule |
|-------|------|
| All scalar inputs | `String(...).trim()` |
| `blob` | Join with `\n`, then **`.toLowerCase()`** on entire string |
| `goalLower` (topic extraction) | `[goal, designIntent].join(" ").toLowerCase()` (~**3542**) |
| Session materials from interpreted | `.map(... toLowerCase trim)` in **`applyWorkflowDesignHeuristics`** only (~**6193–6196**), not inside extractor |
| `mergeUniqueStringList` | Dedupes case-sensitive? Uses string equality on trimmed values — see helper (~**3367–3374**) |

---

### 4.7 Empty / null / missing handling

| Case | Behaviour |
|------|-----------|
| `base` null/undefined | Coercions yield `""`; `blob` may be empty string; interpreted blob still built from empty fields |
| All-empty fields | `out` may be `{}` until domain extras; **`generalOnly`** still returns early **after** interpreted + extras (~**3434–3436**) |
| `domainExtraValues[k]` null or `""` (non-array) | Skipped (~**3423–3424**) |
| `interpreted` arrays empty | Skipped; `session_materials` may still be filled later from **`blob`** alone (~**3555–3557**) |
| Regex mismatch | Property omitted — **no** explicit “unset” sentinel |

---

### 4.8 Domain `workflowBriefConfig` dependencies

**Loading (runtime):** `workflowGenerationContext.getWorkflowBriefConfig` (~**851–891**) loads **first structured domain** in manifest order (skips `"general"`); reads **step-patterns** markdown; **`extractWorkflowBriefConfigFromText`** parses JSON under markdown heading **`### Workflow Brief Config`** (~**542–591**). **MVP rule:** no merge across domains — single domain config surface.

| Domain file (via manifest) | `workflowBriefConfig` present | Notable factor ids (non-exhaustive) |
|----------------------------|-------------------------------|-------------------------------------|
| `domains/learning-design/domain-learning-design-step-patterns.md` | Yes (~**324+**) | `topic`, `learner_level`, `design_scope`, `delivery_pattern`, `input_strategy`, `duration_minutes`, `delivery_mode`, `delivery_context`, `session_materials`, `page_profile`, `assessment_required`, `learning_environments`, refinement ids (`coverage_scope`, `cognitive_demand`, `assessment_type`, …) |
| `domains/research/domain-research-step-patterns.md` | Yes (~**137+**) | `objective_type`, `audience`, `output_depth`, optional `citation_style`, **`inferenceRules`**, **`mappingRules`** |
| `domains/general/*` | **None** in repo grep | `getWorkflowBriefConfig` returns **null** for general-only; app uses **`getGeneralFallbackBriefConfig()`** in `app.js` (~**5729–5731**, ~**3200** area) |

**Extractor vs pack vocabulary drift (author-facing vs contract):**

- LD pack uses factor id **`delivery_context`** (pedagogic delivery context choices). Extractor sets **`delivery_mode`** (`async` / `seminar` / `live_workshop`) from **different** prose cues — **parallel semantics**, not the same id. **Risk:** authors think “delivery” in UI maps 1:1 to extractor output; **it does not**.  
- LD **`delivery_pattern`** (`face_to_face` / `blended` / `mostly_online`) is **not** set by `extractWorkflowBriefExplicitFactors` at all — **rely** on elicitation/AI/rule inference.  
- Research **`objective_type`** is a **required** pack factor; extractor **`objective_type`** heuristics (~**3560–3563**) fire only when **not** `generalOnly` — **overlap** for research domain; for LD, `objective_type` on `out` may exist **without** a matching LD factor row → **possible dead / shadow** data in resolution unless mapped.

**UI compensation:** Domain **`uiHints`** (e.g. research ~**173–179**) shape author wording in Factory; **Sprint 09** changed some LD hints in **`app.js`** display only — **extractor regexes still target English cue words** in free text (`blob`). **Flag:** extractor appears to **compensate for unstructured authoring** (regex inference) rather than for **post–Sprint 9 label polish**; label polish **does not** update heuristics.

---

### 4.9 Relationship to other contract surfaces

| Surface | Relationship |
|---------|----------------|
| **Canonical `briefLines`** | **Parallel transport** — same underlying `base` fields; **not** parsed by this function. **Prefix mismatch** with F-INT synthetic block (**§3.2**). **Parallel contract.** |
| **`buildWorkflowGenerationContext`** | Receives **`brief`** string (`briefLines.join("\n")`); **does not** receive extractor return value. **Independent** embedding of narrative brief. |
| **Prompt assembly** | (1) User prompt text = `promptContext` + compact directive. (2) **`hints.explicitBriefFactors`** used in **`applyWorkflowDesignHeuristics`** for step canonicalization / session material policy. **Dual injection** of brief semantics into model-facing path. |
| **Persistence / import / export** | Extractor feeds **resolution → mappings → patches** (`workflowOutputSpecPatch`, `workflowConstraintPatch`, `stepParamPatch`) — not raw `out` object. **`workflowBriefResolution`** stored on designed workflow (~**13362**). **Implicit compatibility:** older workflows lack new inferred keys — **partial migration** tolerated by optional factor defaults. |

---

### 4.10 Inferred prompt-coupled semantics (documentation judgement)

| Signal | Interpretation |
|--------|----------------|
| `page_profile`, `assessment_type`, `assessment_total_items`, `session_materials` | Strongly steer **downstream LLM** step templates via `applyWorkflowDesignHeuristics` — **prompt-coupled** even though derived without calling the chat model in the extractor itself. |
| `topic` / `workshop_subject` | Feed resolution → domain **`topic`** factor; influences elicitation and generation **indirectly**. |
| `include_answers` / `include_feedback_guidance` | Explicit pass-through in **`resolveWorkflowBriefFactors`** — **generation semantics** even if absent from domain factor list. |

---

### 4.11 Duplicated semantic vocabularies and “contract health” flags

| Pattern | Evidence |
|---------|----------|
| **Parallel contracts** | **BL-* `briefLines`** vs **F-INT synthetic** vs **`blob`** regex vs **`applyWorkflowDesignHeuristics`** `intentBlob` / `hasIntent` (~**6245+**) — multiple independent string worlds over the same author intent. |
| **Fallback contracts** | `getGeneralFallbackBriefConfig()` when domain config missing (~**5729–5731**); `passthroughResolved` empty mapping (~**5734–5750**) still calls **`continueWorkflowDesignGeneration`**. |
| **Dead / shadow contracts** | `workshop_subject` duplicate of `topic`; **`objective_type`** on LD paths may be unused by LD `workflowBriefConfig`; duplicate `var resolvedBriefFactors` assignment in **`applyWorkflowDesignHeuristics`** (~**6178–6190**) — second declaration **shadows** first (**possible dead assignment / maintenance hazard**). |
| **Partial migrations** | `generalOnly` short-circuit skips LD heuristics but still runs **interpret** + extras; saved workflows round-trip **without** storing raw extractor output. |
| **Presentation → generation leak** | Sprint 09 updated **author-facing** strings; **heuristic cues** still depend on **legacy English tokens** in free text (`blob`) — **generation semantics coupled to author vocabulary**, not to UI labels. |

Per-factor **tier** defaults to **Contract**; **risk** defaults to **High** for ids shared with domain packs or `applyWorkflowDesignHeuristics`; **Medium** for extras that only affect elicitation ordering; research-only **`citation_style`** etc. come only via **`domainExtraValues`**, not heuristics.

---

### 4.12 Observed extraction architecture patterns

1. **Authority boundary split:** **`extractWorkflowBriefExplicitFactors`** = **deterministic, client-side, field-and-regex** interpretation; **`applyWorkflowBriefInferenceRules`** = **domain-pack declarative** rules; **`callOpenAIForWorkflowIntentInterpretation`** = **model inference** — merged under explicit precedence rules (~**5768–5773**, ~**3620–3657**). **Risk:** three authorities can disagree; explicit extractor values are **hard to override** downstream.

2. **Semantic duplication by design:** Same author text is summarized as **`briefLines`**, shredded into **`blob`**, re-lined as **F-INT**, and re-scanned in **`applyWorkflowDesignHeuristics`** — **no single source of truth** for “what the author meant.”

3. **Implicit compatibility guarantees:** Resolver logic **appears to** expect factor **ids** in `out` **to match** `workflowBriefConfig` factor **ids** from markdown; **unknown keys** in `out` still ride into **`resolveWorkflowBriefFactors`** only if the factor exists in config **or** via the **`include_answers` / `include_feedback_guidance`** exception list.

4. **Hidden migration risk:** Adding a new **required** domain factor **does not** automatically add extractor coverage — **gap** until explicit values or elicitation fills it. Conversely, new heuristic keys can **silently appear** on `out` and affect **`applyWorkflowDesignHeuristics`** before pack authors document them.

5. **General-domain suppression:** `isGeneralOnlySelection` gates **LD-style heuristics** but **not** domain extra passthrough — behaviour differs for “general + LD” vs “LD only” in ways authors may not perceive.

**No implementation changes are proposed by this section.**

---

## 5. Step-context / prompt assembly inventory (populated — Sprint 10 audit pass)

**Sources:** `app.js`, `workflowGenerationContext.js`, `domains/domain-manifest.json` (file lists embedded via WGC), domain markdown under `domains/**` (principles, artefacts, **step-patterns** JSON blocks, **prompt-rules**). **No source edits.**

### 5.0 Legend — “Source kind” of emitted text

| Tag | Meaning |
|-----|---------|
| **CB** | Canonical **`briefLines.join("\n")`** narrative (§3 BL-*). |
| **EF** | **`extractWorkflowBriefExplicitFactors`** output (object fields / synthetic interpret path). |
| **RF** | **Resolved** brief factors / **`applyWorkflowBriefMappings`** patches (post `resolveWorkflowBriefFactors`). |
| **DP** | **Domain-pack** prose or JSON-derived strings (markdown files, `workflowBriefConfig` factor `question`/`label`/`choices`/`helpText`/`plainEnglish`, `promptFactory` templates, `runnerInstructions`). |
| **HE** | **Heuristic** app logic (`applyWorkflowDesignHeuristics`, regex intent blobs, `buildWorkflowCompactDirective`). |
| **FB** | **Fallback / default** English scaffolding when domain data missing (`"No … loaded"`, `getRunnerInstructionsForStep` defaults). |

**“Feeds” (stages):** **A** = initial design generation (workflow JSON); **B** = planning / brief resolution (intent + extraction APIs); **C** = post-generation elicitation UX (log + optional help); **D** = step-level generation (seeded override body); **E** = run-mode / external Copilot copy pack; **F** = Prompt Studio refinement (separate product surface but shares domain context).

---

### 5.1 Master table — model-facing and tightly coupled assemblies

| ID | Location (`file` ~lines) | Inputs consumed | Emitted / assembled text (summary) | Order / structure | Source kinds | UI copy reuse? | Domain labels/help in output? | Transforms / filters | Model / consumer | Feeds stage | Tier | Risk | Dependent surfaces |
|----|--------------------------|-----------------|--------------------------------------|-------------------|--------------|----------------|----------------------------------|---------------------|------------------|--------------|------|------|---------------------|
| **PA-WGC** | `workflowGenerationContext.js` `buildWorkflowGenerationContext` ~176–223 | `opts.brief` (BL string), `opts.selectedDomains`, manifest `platformFiles` + domain files | `## PLATFORM CONTEXT` → each platform file as `### File: path` + body; `====================`; `## DOMAIN CONTEXT` + selected domain list + domain files; `====================`; `## WORKFLOW BRIEF` + brief or `"No brief provided."` | Fixed: platform → domain → brief | **CB** + **DP** (full markdown) | No (file paths are technical) | Entire pack text (includes `uiHints` **only** as characters inside markdown, not separately injected) | Trim file text; `section()` wraps `## title` | **`callOpenAIForWorkflowDesign`** user message prefix (via `ctx.promptContext`) | **A** | **Contract** | **High** | **If** fixtures assert this path, **they may need to** pin loaded file set; import N/A; shape of `promptContext` |
| **PA-DES-SYS** | `app.js` `WORKFLOW_DESIGN_SYSTEM_PROMPT` ~49–72 | (static) | JSON shape + compactness rules | Single system message | **FB** (product-owned template) | N/A | N/A | None | `callOpenAIForWorkflowDesign` → OpenAI Responses API | **A** | **Contract** | **High** | Any workflow design fixture |
| **PA-DES-USER** | `app.js` `callOpenAIForWorkflowDesign` `requestWorkflowDesign` ~8943–8949 | `promptContext` (= PA-WGC output or raw `brief` fallback ~5406–5407) | Full WGC string **then** `\n\n` **then** `buildWorkflowCompactDirective(mode)` | User message = context + directive | **CB** (+ embedded **DP**); tail = **HE** + **RF** (`design_scope` from `hints.resolvedBriefFactors` ~8920–8937) | Directive vocabulary **not** aligned with Factory field labels (“single_activity” is id, not UI string) | No | `String(promptContext)`; directive lines joined `\n` | Same | **A** | **Contract** | **High** | Same + **vocabulary drift** vs BL (`Goal / outcome` in brief vs no echo in directive) |
| **PA-DES-HINTS** | `app.js` `applyWorkflowDesignHeuristics` ~6169+ | `hints`: `goal`, `inputs`, `desiredOutputs`, `startingArtefact`, `explicitBriefFactors`, `resolvedBriefFactors`, `mappedBindings`, `stepPatternCatalog` | **No new user message** — mutates parsed **steps** in memory (titles, canonical ids, step removals/additions per heuristics) | N/A (post-parse) | **EF**, **RF**, **HE**; catalog = **DP** | Uses lowercase blobs; some regexes mention `"starting artefact"` phrase (~6236–6243) — **partial** overlap with BL-07 wording | Indirect via catalog titles | Many string lowercases / regex; `normalizeSessionMaterials` etc. | Same design response pipeline | **A** (output shape) | **Contract** | **High** | **Generated workflow shape**, saved JSON after save, tests on step titles |
| **PA-REPAIR** | `app.js` `repairWorkflowJsonFromRaw` ~9000–9017 | Malformed model text | System: repair instruction + required JSON shape; User: `"Repair this into valid JSON…\n\n" + raw` | system then user | **FB** | N/A | N/A | Raw passthrough | OpenAI Responses (repair) | **A** (recovery) | **Contract** | **Medium** | Fixture for malformed JSON path |
| **PA-INTENT** | `app.js` `callOpenAIForWorkflowIntentInterpretation` ~4612–4688 | `base` (Factory fields → JSON keys `design_intent`, `desired_outputs`, … ~4661–4672), `normalizedFactors` from **`getWorkflowBriefAllFactors(cfg)`** (`label`, `question`, `choices` from **DP** `workflowBriefConfig`) | System: fixed interpreter instructions; User: **JSON.stringify(payload)** | system then user | **CB** (as structured JSON keys — **different** names than BL prefixes: `design_intent` vs “Task / design intent”) + **DP** | Payload keys are **API-shaped**, not author-facing BL lines | **Yes** — factor `question`, `label`, `choices` serialized into user JSON | `String()` trims on fields | OpenAI Responses | **B** | **Contract** | **High** | Planning resolution; drift vs BL/F-INT |
| **PA-EXTRACT** | `app.js` `callOpenAIForWorkflowBriefExtraction` ~4484–4560 | `rawAnswer` (chat text); `remainingFactors` (**DP** metadata: `question`, `plainEnglish`, `choices`); `resolveWorkflowBriefFactors` snapshot `currently_resolved_factors` | System: fixed extraction rules (includes hard-coded **topic** stripping rules ~4535–4536); User: JSON with `user_message`, `unresolved_factors`, `currently_resolved_factors` | system then user | **RF** + **DP** (factor definitions) + user free text | Instruction text is app-owned; factor **questions** echo pack | **Yes** — `choice.label`, `choice.description` / `helpText` / `gloss` paths in normalization ~4497–4504 | JSON serialization; confidence threshold ~4597–4599 | OpenAI Responses | **B** (+ **C** UX loop) | **Contract** | **High** | Elicitation quality; **presentation** `helpText` becomes model-visible in `unresolved_factors` |
| **PA-REVIEW** | `app.js` `callOpenAIForWorkflowReview` ~9196–9234 | `design` object (summary + steps JSON) | System: `reviewerPrompt` (inline template ~9209–9229); User: `JSON.stringify(design)` | system then user | **FB** + persisted **generated shape** (indirect **RF**/steps) | N/A | Step titles may reflect **DP** canonical names | None on system string | OpenAI Responses | **A** (advisory pass) | **Contract** | **Medium** | Review UX only unless user applies changes |

---

### 5.2 Step prompt body assembly (designed workflow → step execution text)

| ID | Location | Inputs | Emitted fragments | Order | Source kinds | UI reuse? | Domain? | Transforms | Consumer | Feeds | Tier | Risk | Surfaces |
|----|----------|--------|---------------------|-------|--------------|-----------|---------|------------|----------|--------|------|------|----------|
| **PA-SEED** | `app.js` `buildSeededStepPromptForWorkflowStep` ~1334–1417 | `workflowName`, `workflowGoal`, `workflowInputs`, `workflowOutputs`, `workflowOutputSpec`, `step`, `matchedPattern` | Resolves **template** from **`promptFactory`** (**DP** JSON in step-patterns) via `resolveWorkflowStepPromptTemplate` / `applyWorkflowStepPromptTemplate` | Template-driven `{{vars}}` | **CB**-derived fields passed as **syntheticCtx** (not BL string); **DP** template | Template vars include `stepTitle`, `stepNotes` (stripped param block) | **Yes** — full prompt template body from pack | `stripWorkflowStepParamBlock`, schema lists | Saved **`override_prompt_body`** on new workflow (~13318+) | **D** | **Contract** | **High** | `prompt_templates` in JSON; saved workflow; export |
| **PA-FALL** | `app.js` `buildWorkflowStepPromptFallback` ~1264–1331 | `cfg` (**DP** `defaultPromptNotes`, `preferredOutputFormat`, option rows), `syntheticCtx` | Fixed English scaffold: `"Context:"`, `"You are provided with…"`, `"Task:"`, `"Instructions:"`, `"Output:"`, optional constraint bullets | Fixed sequence | **CB**-derived ctx + **DP** cfg + **FB** scaffold | Uses canonical step title string | `cfg.defaultPromptNotes`, `opt.label` | Joins options as `"label: value"` | Used when template missing / empty | **D** | **Hybrid** | **High** | Same + **default English** shapes model behaviour |
| **PA-RUNNER** | `app.js` `getRunnerInstructionsForStep` ~735–785 | Step + **`workflowStepPatternCatalog`** (**DP**) | Prefer `runnerInstructions` from pack; else `defaultPromptNotes`; else **fallback** English using `roleLabel` / `title` / `outputName` (~770–782) | Field priority chain | **DP** + **FB** | Fallback uses `"this step"` / generic pedagogy lines | **Yes** | Trim | Wrapped by **PA-STEP** | **E** | **Hybrid** | **Medium–High** | Run copy UX; external LLM behaviour |
| **PA-STEP** | `app.js` `buildWorkflowStepInstructions` ~12308–12401 | `step`, bindings, `resolveStepPromptText` | Autonomous execution preamble; title/role; **Runner guidance** labels (`What this step does:` …); input kind label; `STEP n OUTPUT:` convention; bindings; designer notes; **core prompt** body | Fixed sandwich around `promptBody` | **FB** frame + **PA-RUNNER**/**DP** + **CB**-adjacent notes + library/local body | Kind labels (`Upload file` / …) are **app English**, not Factory | Runner + optional **`promptBody`** from Library or override | `stripWorkflowStepParamBlock` on notes | Clipboard / external runner (~11373+); prepended by **PA-RT** in run mode | **E** | **Contract** | **High** | Saved steps; export; Copilot fixtures |
| **PA-RT** | `app.js` `buildWorkflowRuntimeContextText` ~12266–12305 | `wf` persisted fields, `step` | **Vocabulary divergent from BL** (`Goal:` not `Goal / outcome:`; `Inputs:` not `Inputs / artefacts:`) — see §3 **RC-*** | Block then `\n\n---\n\n` + step text | **RF**/persisted spec + **HE** (sanitize filters) | **Explicit drift** from BL | Values only | `sanitizeAssessmentCuesForUpstreamContext`, line filters | Prepended to **PA-STEP** output in run mode ~11379–11387 | **E** | **Contract** | **High** | Run-mode regression |

---

### 5.3 Prompt Studio refinement (workflow-step mode) — shared domain file load

| ID | Location | Inputs | Emitted | Order | Source kinds | Notes |
|----|----------|--------|---------|-------|--------------|-------|
| **PA-PREF** | `workflowGenerationContext.js` `buildPromptRefinementContext` ~228–293 | `selectedDomains`, `promptTask`, `leanMode` | Lean: domain **prompt-rules** + **artefacts** only; full: platform subset (`workflow-authoring|workflow-spec|pattern-library`) + domain files matching regex; `## PROMPT TASK CONTEXT` + task string | Platform (optional) → domain → task | **DP** + **FB** task string (~8477–8478) | **Contract** |
| **PA-REFINE-WRAP** | `app.js` `beginRefinement` ~8434–8444 | `combinedUserContent` + `domainContextText` from **PA-PREF** | Appends `\n\nDomain and platform context:\n` + context | After user brief/task | **DP** | User message to **`SYSTEM_PROMPT`** session (~8442–8443) | **F** | **Contract** |

---

### 5.4 Planning UI strings (not always model input — coupling via user replies)

| ID | Location | Role | Source kinds | Model? |
|----|----------|------|--------------|--------|
| **PA-QTXT** | `buildWorkflowBriefQuestionText` ~4277–4342 | Log + chat assistant text from **`factor.question`**, **`label`**, **`choices`**, `plainEnglish`/`gloss` (**DP**); assessment **profile overrides** in code | **DP** + **FB** overrides | Usually **user reads** then types answer → **PA-EXTRACT** |
| **PA-QHELP** | `buildWorkflowBriefOptionHelpText` ~4345–4391 | Optional help bubbles; emits `choice.description` / **`helpText`** / `gloss` (**DP**) into human-readable lines | **DP** | Same indirect chain |

**Flag:** **`uiHints`** in `workflowBriefConfig` primarily affect **Factory DOM** (`renderWorkflowFactoryDomainUiHints`); **PA-INTENT** / **PA-EXTRACT** instead receive **`question`/`label`/`choices`/`helpText` on factors** — **two channels** from pack to author vs model.

---

### 5.5 `applyWorkflowBriefMappings` — data path into later **CB** text (not direct LLM)

| ID | Location | Output | Effect on prompts |
|----|----------|--------|---------------------|
| **PA-MAP** | `app.js` ~4019+ | `workflowOutputSpecPatch`, `workflowConstraintPatch`, `stepParamPatch` | Patches merge into **`continueWorkflowDesignGeneration`** `mergedConstraints` / step params → **BL-C** / **BL-09** and seeded prompts — **indirect** prompt assembly |

---

### 5.6 Multi-channel vocabulary (same planning concept, different strings)

Documented overlaps (non-exhaustive):

| Concept | Channels |
|---------|----------|
| **Goal / intent** | BL `Goal / outcome:` / `Task / design intent:`; F-INT `Goal:` / `What are you trying to design:`; **PA-INTENT** JSON `goal` + `design_intent`; **PA-RT** `Goal:`; **PA-PF** `Workflow goal:` / `Goal / outcome:` (§3) |
| **Inputs / artefacts** | BL `Inputs / artefacts:`; F-INT `Inputs:`; **PA-RT** `Inputs:`; **PA-FALL** “artefacts” wording |
| **Constraints** | BL `Scope and constraints (compressed):`; F-INT `Constraints:`; intent payload `constraints`; compressor output elsewhere |

**Fixture risk:** tests that match **one** string family **may** miss regressions in **parallel** families.

---

### 5.7 Domain markdown as **opaque model context** (presentation ↔ generation leak)

All loaded **`domains/.../*.md`** and **`docs/workflow/*.md`** in **PA-WGC** are pasted **verbatim** into the design prompt. Therefore:

- **`uiHints`** text inside JSON code blocks in markdown is **not** “display only” once the file loads — it becomes **model-visible** alongside `workflowBriefConfig` and step pattern prose.
- **`helpText`** on factors is both **elicitation UI** (via **PA-QTXT** / **PA-QHELP**) and, in the file body, part of the **same document** loaded into **PA-WGC**.

---

### 5.8 Observed prompt assembly architecture patterns

1. **Source-of-truth ambiguity:** Initial design consumes **(A)** full markdown context + **(B)** canonical `briefLines` string + **(C)** `hints` object processed only **after** the model returns (**`applyWorkflowDesignHeuristics`**). The model **never** receives structured `hints` as JSON in the HTTP body — yet heuristics depend on them — **dual channel** (narrative vs structured sidecar).

2. **Duplicate semantic channels:** Same brief appears as **prose** (`briefLines` / WGC), as **structured** `brief` object (**PA-INTENT**), as **`blob`** heuristics inside **EF**, and again inside **`applyWorkflowDesignHeuristics`** intent regexes — **four** partially overlapping representations.

3. **Prompt-coupled labels:** `buildWorkflowCompactDirective`, **PA-STEP** framing, **PA-FALL** scaffold, and **PA-REPAIR** instructions are **hard-coded English** that **shape JSON** or execution behaviour — **Contract** tier.

4. **Ordering dependencies:** **PA-WGC** order (platform → domain → brief) anchors how models read constraints; **PA-DES-USER** always appends compact directive **after** full context — changing order would shift emphasis.

5. **Hidden compatibility:** Design models may rely on **literal section headers** (`## WORKFLOW BRIEF`) or file path markers (`### File:`) when reasoning — **not** validated at runtime.

6. **Fixture design risks:** Golden tests **that assert only one surface** (e.g. step titles) **may** miss regressions in **other** channels (WGC file list, `briefLines`, post-heuristic steps, run-mode **PA-RT**+**PA-STEP** bundle). **Partial migrations** (e.g. BL prefix change without WGC re-parse) **may** likewise escape narrow fixtures — **interpretation**, not a claim about existing test coverage.

**No implementation changes are proposed by this section.**

---

## 6. `workflowGenerationContext.js` (WGC) responsibility map (populated — Sprint 10 audit pass)

**Role:** `workflowGenerationContext.js` is a **browser-side boundary layer** between **`domains/domain-manifest.json` + domain markdown/JSON-in-markdown** and **`app.js`**. It **fetches**, **normalises**, **caches**, and **parses** pack artefacts into **structured objects** and/or **large prompt-context strings**. It **does not** own workflow runtime execution, persistence writes, or elicitation state machines — but its outputs **permeate** generation prompts, Factory UI, and utilities.

**Sources:** `workflowGenerationContext.js` (full module), `app.js` consumer grep, `domains/domain-manifest.json` (paths align with `fallbackManifest` when fetch fails). **No code edits.**

---

### 6.1 Public API (`window.WorkflowGenerationContext`)

| Export | Responsibility summary |
|--------|-------------------------|
| **`loadManifest`** | Returns **singleton promise** `manifestPromise` — fetch `MANIFEST_PATH`, `normalizeManifest`, or **catch** → **`fallbackManifest` clone** (`workflowGenerationContext.js` ~78–91). |
| **`getDomainOptions`** | Maps manifest `domains` → `{ id, label, alwaysOn }[]` for UI (~94–104). |
| **`buildWorkflowGenerationContext`** | Loads **all platform + selected domain files** (per manifest), wraps in markdown-ish sections, appends **`WORKFLOW BRIEF`** (~176–225). |
| **`buildPromptRefinementContext`** | Subset loader for Prompt Studio workflow-step refinement — filtered platform list + filtered domain files + optional `PROMPT TASK CONTEXT` (~228–295). |
| **`getStepPatternCatalog`** | Loads `*step-patterns*` files, **`extractStepPatternCatalogFromText`**, dedupes, stamps `domainId` / `domainVersion` (~793–826). |
| **`getDomainArtefactOptions`** | Loads `*artefacts*` files, **`extractArtefactCatalogFromText`**, merges options with `domainId` inferred from path (~714–749). |
| **`getArtefactRenderCatalog`** | Loads artefact files, **`extractArtefactRenderCatalogFromText`**, merges `renderHints` (~752–790). **Special:** if `selectedDomains` **omitted** (not an array on `opts`), normalises to **`Object.keys(manifest.domains)`** — **all domains** (~755–757). |
| **`getWorkflowPolicy`** | First matching **`workflowPolicy`** JSON from step-patterns text (~829–848). |
| **`getWorkflowBriefConfig`** | **First structured domain** (not `general`) only; single step-patterns file; **`extractWorkflowBriefConfigFromText`** (~851–891). |
| **`persistSelectedDomains`** | `localStorage` key **`DOMAIN_CACHE_KEY`** (~159–162). |
| **`loadPersistedDomains`** | Read same key (~165–173). |

---

### 6.2 Internal helpers (non-exported)

| Helper | Role |
|--------|------|
| **`clone`** | JSON clone with catch passthrough (~49–54). |
| **`normalizeManifest`** | Ensures `platformFiles`, `alwaysOnDomains`, `domains`; **fills gaps** from `fallbackManifest` keys (~57–75). |
| **`normalizeSelectedDomains`** | Union of caller-selected ids **∩ manifest** plus **`alwaysOnDomains`** (~107–115). |
| **`readTextFile`** | `fetch` + **`textCache[path]`** memo (~118–131). |
| **`loadFiles`** | Sequential `readTextFile` chain; collects `loaded` + `missing` (~134–152). |
| **`section(title, body)`** | `## title` + body — **hard-coded delimiter shape** for prompt assembly (~155–157). |
| **`extractStepPatternCatalogFromText`** | **Line-state markdown parser** for `## N. Title`, `###` fields, aliases, **`### Prompt factory`** fenced JSON → `promptFactory` object; **slugifies** default `canonicalStepId` / `canonicalPromptId` if missing (~298–483). |
| **`extractWorkflowPolicyFromText`** | `###` heading **`workflow policy`** (case-insensitive via `toLowerCase`) + fenced JSON (~486–539). |
| **`extractWorkflowBriefConfigFromText`** | Same heading-matching pattern as policy; accepts root object or `{ workflowBriefConfig }` (~542–591). |
| **`extractArtefactCatalogFromText`** | Heading-based id scan; label = id with `_` → space (~594–614). |
| **`extractArtefactRenderCatalogFromText`** | `### Render hints` per artefact section + JSON (~617–711). |

---

### 6.3 Inputs, outputs, normalisation, caching

| Concern | Behaviour |
|---------|-----------|
| **Inputs** | Options objects carry **`selectedDomains`** (arrays, sometimes omitted for `getArtefactRenderCatalog`). `buildWorkflowGenerationContext` takes **`brief`** string + domains. `buildPromptRefinementContext` takes **`promptTask`**, **`leanMode`**. |
| **Outputs** | Context builders return `{ promptContext, loadedFiles, missingFiles, selectedDomains }`. Catalog getters return **arrays** or **policy object** or **`{ domainId, config }`**. |
| **Normalisation** | Manifest merge; `String(text).trim()` on file bodies; heading strings **lower**cased for section detection; `supportedFormats` lowercased in render hints (~660–663); slugify lowercases + non-alnum → `_` (~322–327). |
| **Caching** | **`manifestPromise`** — first load wins for app lifetime (no invalidation on manifest edit without reload). **`textCache`** — **per-path permanent** in-memory cache after first successful fetch. |
| **Fallback** | Manifest fetch failure → **`fallbackManifest`**. Missing files → `missing[]` but context still built with **“No … loaded.”** strings (~205–206, ~212–213, ~273, ~281). |

---

### 6.4 Manifest resolution

| Aspect | Detail |
|--------|--------|
| **Authoritative file** | `MANIFEST_PATH` = **`domains/domain-manifest.json`** (~4). |
| **Soft contract** | Runtime **need not** match embedded `fallbackManifest` — divergence only visible when **offline** or fetch fails; then **stale embedded paths** apply. |
| **Domain union** | `normalizeSelectedDomains` **always injects** `alwaysOnDomains` (e.g. `general`) even if user deselects — **hidden coupling** to “general always present” invariants in `app.js`. |

---

### 6.5 Domain-pack loading

| Path | Rule |
|------|------|
| **Design context** | **All** `platformFiles` + **all files** listed for **each** selected domain (concat lists, no dedupe of paths across domains) (~181–189). |
| **Refinement context** | Platform: regex filter `workflow-authoring|workflow-spec|pattern-library` or full list if empty (~235–241). Domain: regex on path (`leanMode` narrows to `prompt-rules|artefacts`) (~247–255). |
| **Step patterns** | Files matching **`/step-patterns/i`** per selected domain (~798–803, ~833–838). |
| **Artefacts** | Files matching **`/artefacts/i`** (~722–724, ~762–764). |

**Permeability flag:** Entire markdown — including narrative docs, examples, and JSON blocks with **`uiHints` / `helpText`** — is pasted into **`promptContext`** for design/refinement. **Presentation-oriented prose becomes generation-visible** with **no** separate sanitisation layer.

---

### 6.6 `workflowBriefConfig` responsibilities

| Item | Detail |
|------|--------|
| **Extraction** | **Convention:** `###` heading whose **lower**cased title is **`workflow brief config`**, then fenced JSON (~566–591). **Soft contract** — invalid JSON silently yields `null`. |
| **Domain selection** | **“MVP rule: first structured domain only, ignore general and no merging.”** (~855–858). Multi-domain selection in UI **does not** merge configs here — **authority** is “first non-general”. |
| **Output** | `{ domainId, config }` where `config` may be `null` (~859–889). |

**Obscured source-of-truth:** `app.js` may show multiple selected domains, but **brief config semantics** for elicitation are **single-domain** from WGC — **architectural ambiguity** for authors.

---

### 6.7 Prompt-context responsibilities

| Builder | Section order | Delimiter |
|---------|---------------|-----------|
| **`buildWorkflowGenerationContext`** | `PLATFORM CONTEXT` → `DOMAIN CONTEXT` → `WORKFLOW BRIEF` | `\n\n====================\n\n` between parts (~219). |
| **`buildPromptRefinementContext`** | Optional `PLATFORM CONTEXT FOR PROMPT REFINEMENT` → `DOMAIN CONTEXT FOR PROMPT REFINEMENT` → optional `PROMPT TASK CONTEXT` | Same (~289). |

**Hidden assumption:** Models may treat `##` headings and `====================` as **semantic boundaries** — **ordering dependencies** for prompt engineering (§5 **PA-WGC**).

---

### 6.8 “Template selection” (interpretation)

WGC **does not** pick among multiple alternative prompt **templates** for workflow design. It **does**:

- **Select files** by manifest + regex filters (**file-level template selection**).
- **`extractStepPatternCatalogFromText`** chooses the **first** fenced `promptFactory` JSON per step section; **`getStepPatternCatalog`** dedupes by **`(canonicalStepId || title).toLowerCase()`** — **first file / first pattern wins** for a key (~808–814).

**Soft contract:** Canonical ids **default** to `step_` + slugified title if JSON omits them (~471–481) — **convention**, not schema validation.

---

### 6.9 `app.js` consumers and call chains (verified)

| Consumer region (approx) | API used | Purpose |
|--------------------------|----------|---------|
| **`renderWorkflowFactoryDomainUiConfig`** ~2747–2787 | `getWorkflowBriefConfig` | Load `uiHints` + `extraFields` for Factory DOM |
| **`renderWorkflowFactoryStartingArtefactOptions`** ~2937–2986 | `getWorkflowBriefConfig` → `input_strategy` choices; fallback **`getDomainArtefactOptions`** | Starting artefact `<select>` |
| **`renderWorkflowDetailDomainUiHints`** ~3021+ | `getWorkflowBriefConfig` | Workflows tab hints |
| **`handleWorkflowDomainSelectionChange`** ~3048–3051 | `persistSelectedDomains` | Persist domain picker |
| **`initWorkflowDomainSelector`** ~3077–3094 | `getDomainOptions` | Populate domain UI |
| **`refreshWorkflowStepPatternCatalogForDomains`** ~3097–3115 | `getStepPatternCatalog` | `state.workflowStepPatternCatalog` |
| **`continueWorkflowDesignGeneration`** ~5361–5389 | `buildWorkflowGenerationContext`, `getStepPatternCatalog`, `getWorkflowPolicy` | Design prompt + hints for heuristics |
| **`handleStartWorkflowDesign` briefConfigPromise** ~5712–5719 | `getWorkflowBriefConfig` | Planning / elicitation resolution |
| **Prompt Studio refinement** ~8463–8483 | `buildPromptRefinementContext` | Domain context appended to refinement user message |
| **`populateWorkflowDetail`** ~10574–10605 | `getDomainOptions` (fallback widen domains) + `refreshWorkflowStepPatternCatalogForDomains` | Runner guidance / step interactivity when catalog thin |
| **`resolveUtilityRenderPlan`** ~18641–18651 | **`getArtefactRenderCatalog({})`** — **empty opts** → **all domains’** artefact render metadata | Utilities HTML pipeline |

---

### 6.10 Duplication / split ownership with `app.js`

| Concern | WGC | `app.js` overlap |
|---------|-----|------------------|
| **Brief config when WGC missing** | Returns `null` | **`getGeneralFallbackBriefConfig()`** (defined ~3163, used e.g. ~5730) — **parallel fallback** |
| **Domain labels** | `getDomainOptions` uses manifest `label` | Hardcoded `fallbackDomains` in **`initWorkflowDomainSelector`** (~3068–3071) if API missing |
| **`domainId` from path** | Regex `domains/([^/]+)/` in artefact loaders (~732, ~770, ~817) | Similar path logic may exist elsewhere for display — **convention coupling** to folder names |
| **Step pattern consumption** | Parses markdown | **`app.js`** owns canonicalisation, matching, **`applyWorkflowDesignHeuristics`**, save — **split brain** |

---

### 6.11 Presentation-facing vs generation-facing (per export)

| Export | Primary face | Notes |
|--------|--------------|-------|
| `getDomainOptions` | **Presentation** (select labels) | Still **Contract** for ids shown to user |
| `getWorkflowBriefConfig` | **Both** | Drives **DOM hints** and **PA-INTENT** / elicitation JSON shape |
| `buildWorkflowGenerationContext` / `buildPromptRefinementContext` | **Generation** | Full markdown → models |
| `getStepPatternCatalog` / `getWorkflowPolicy` | **Generation + save-time behaviour** | Steps and policy heuristics |
| `getDomainArtefactOptions` | **Presentation** (dropdown) | Values become **`input_strategy`** / artefact semantics |
| `getArtefactRenderCatalog` | **Utilities / render** | **Generation-adjacent** metadata, not LLM prompt text by default |
| `persistSelectedDomains` / `loadPersistedDomains` | **UX persistence** | Affects next session’s **which domain files load** — indirect generation impact |

---

### 6.12 Authority / advisory / fallback / legacy / partial migration tags

| Mechanism | Tag |
|-----------|-----|
| **Manifest fetch success** | **Authoritative** for file lists (until page reload). |
| **`fallbackManifest` on fetch failure** | **Fallback** — may **diverge** from repo `domain-manifest.json` (**legacy / drift hazard**). |
| **`getWorkflowPolicy` “first non-null wins”** | **Advisory merge** across files (~841–845). |
| **`getWorkflowBriefConfig` single-domain** | **Partially migrated** mental model vs multi-select UI (**soft contract**). |
| **Slugified canonical ids** | **Fallback derivation** when pack JSON omits explicit ids. |

---

### 6.13 Contract-tier surfaces exposed through WGC (default **Contract**)

| Surface | Via |
|---------|-----|
| **Markdown bodies** | Full file text in `promptContext` |
| **Manifest domain ids / labels** | `getDomainOptions`, `normalizeSelectedDomains` |
| **Parsed JSON** | `workflowBriefConfig`, `workflowPolicy`, `promptFactory`, `renderHints` |
| **Synthetic labels** | `extractArtefactCatalogFromText` `label` from id (~612) |
| **Template metadata** | `promptFactory` object attached to catalog patterns |
| **`uiHints` / help** | Inside markdown/JSON as loaded — **generation-visible** |

---

### 6.14 Ordering dependencies and hidden assumptions

1. **File order in manifest arrays** influences merge order in catalogs (first-wins dedupe).
2. **`====================` separator** is part of the **implicit** “section contract” for models.
3. **`alwaysOnDomains` injection** can load **extra domain files** the user did not explicitly toggle — changes global prompt weight.
4. **`textCache` + `manifestPromise`** mean **no hot-reload** of edited pack files without full page refresh.

---

### 6.15 Risks if responsibilities move later

| Risk | Blast radius |
|------|----------------|
| Change manifest shape | All loaders, `app.js` fallbacks, tests fixing paths |
| Split WGC into modules | **Global** `window.WorkflowGenerationContext` **single object** contract — many guards `typeof … === "function"` |
| Invalidate caches | Token/prompt drift; need cache-bust strategy |
| Merge multi-domain brief configs | Elicitation + `resolveWorkflowBriefFactors` **would likely need** coordinated redesign |
| Remove slugified canonical defaults | Saved workflows / matching heuristics break |

**Dependent surfaces summary:** prompt assembly (§5), generation behaviour, saved workflows (domainVersion, canonical ids), import/export (paths not in JSON but in runtime), domain packs, elicitation, refinement, utilities render.

---

### 6.16 Major responsibilities: contract tier, risk level, dependent surfaces

**Convention:** **Contract** unless noted. **Risk:** *H* high / *M* medium / *L* low (migration + silent drift). **Deps:** shorthand for dependent surfaces.

| Major responsibility | Contract tier | Risk | Dependent surfaces (deps) |
|----------------------|---------------|------|----------------------------|
| **Manifest fetch + `normalizeManifest` merge** | Contract (file graph) | *H* | Prompt assembly (which files embed), domain packs, tests/fixtures (fetch stub order), generation behaviour |
| **`manifestPromise` singleton** | Contract (session-stable graph) | *M* | All WGC consumers; elicitation/refinement if manifest hot-fixed without reload |
| **`textCache` per path** | Contract (cached bytes) | *H* | Same as loaded markdown; saved workflows indirect (semantics from stale pack text) |
| **`normalizeSelectedDomains` + `alwaysOnDomains`** | Contract | *M* | Prompt assembly, generation, domain packs (implicit `general`) |
| **`buildWorkflowGenerationContext`** (platform + domain + brief sections) | Contract | *H* | Prompt assembly, generation behaviour, refinement N/A |
| **`buildPromptRefinementContext`** (regex-filtered files + task) | Contract | *M* | Refinement, prompt assembly (Prompt Studio path) |
| **`getStepPatternCatalog` + `extractStepPatternCatalogFromText`** | Contract (parsed steps + `promptFactory`) | *H* | Generation behaviour, saved workflows (canonical ids / `domainVersion` stamped `"1"`), import/export (step identity), elicitation (indirect via design), tests/fixtures |
| **`getWorkflowPolicy`** (first file with policy wins) | Contract | *M* | Generation behaviour (`app.js` heuristics), domain packs |
| **`getWorkflowBriefConfig`** (first structured domain, no merge) | Contract | *H* | Elicitation, prompt assembly (factors), saved workflows / persistence (factor ids), presentation (Factory hints), refinement indirect |
| **`getDomainArtefactOptions`** | Contract (ids + synthetic labels) | *M* | Presentation (dropdowns); generation when choices feed brief / `input_strategy` |
| **`getArtefactRenderCatalog`** (all domains if `selectedDomains` not array) | Contract | *H* | Utilities render (`resolveUtilityRenderPlan`); fixture surprise if callers rely on domain filter |
| **`getDomainOptions`** | Contract | *L* | Presentation; `persistSelectedDomains` / pack load set |
| **`persistSelectedDomains` / `loadPersistedDomains`** | Contract (localStorage key) | *M* | Presentation + next-session file load → generation |
| **Heading/regex parsers (`### …`, `/step-patterns/i`, etc.)** | *Soft contract* (convention) | *H* | All deps above; **no explicit schema** at runtime |

---

### 6.17 Observed workflowGenerationContext architecture patterns

1. **Authority boundaries:** WGC is **authoritative for “which files load”** and **first-pass parsing** into JS objects, but **`app.js`** is authoritative for **how** those objects change runtime, persistence, and second-pass heuristics — **split authority**.

2. **Semantic ownership:** **True semantics** of factors and steps still live in **markdown + JSON fragments** in packs; WGC **does not interpret** meaning — it **transports** prose. **Source-of-truth remains the pack files**, but **obscured** behind cached text and parsers.

3. **Hidden coupling:** `normalizeSelectedDomains` + manifest **`alwaysOnDomains`** couple **general** pack content into **almost every** design/refinement context.

4. **Contract permeability:** No firewall between **authoring docs**, **uiHints**, and **model context** — **permeability is total** for loaded files.

5. **Migration hazards:** `fallbackManifest` embedded copy; `textCache`; single-domain brief config; slug defaults — all **migration cliffs**.

6. **Fixture implications:** **Where** automated tests cover WGC, **they may need to** stub **`fetch`** for manifest + each file path, or inject a shim `WorkflowGenerationContext`; **ordering** and **which domain is “first structured”** **are** material to outcomes — **interpretation** for test design, not a mandate on the codebase.

**No implementation changes are proposed by this section.**

---

## 7. Domain-pack contract matrix (populated — Sprint 10 audit pass)

**Sources:** `domains/domain-manifest.json`; every **manifest-listed** path under `domains/general/`, `domains/learning-design/`, `domains/research/`; `workflowGenerationContext.js` (load, `section`, parsers); `app.js` (Factory UI, `briefLines`, `extractWorkflowBriefExplicitFactors`, `resolveWorkflowBriefFactors`, design generation, utilities render). **No domain-pack edits** and **no renames** of live ids/labels/headings in this document — values below are **as implemented in repo**.

**Scope boundary:** `domains/research/domain-research-readme.md` exists on disk but is **not** referenced by `domain-manifest.json` → **not loaded by WGC** and **not embedded** in `DOMAIN CONTEXT` for normal runs. Treat as **author documentation only** unless added to the manifest.

**Cross-cutting WGC rules (affects every file row):**

- **Full-file markdown** for all manifest paths is concatenated into **`buildWorkflowGenerationContext`** / **`buildPromptRefinementContext`** (subject to refinement regex filters) — **presentation prose, examples, and JSON fences are generation-visible** with no stripping layer.
- **`getWorkflowBriefConfig`** uses **first structured domain** (first selected domain whose id is not `general`), **one** `*step-patterns*` file, heading **`### Workflow Brief Config`** (title matched case-insensitively after `toLowerCase`) + fenced JSON — **no merge** across domains; multi-select UI **does not** combine LD + research configs.
- **`getWorkflowPolicy`:** **first** `*step-patterns*` file (in manifest path order for selected domains) that contains a parseable **`### Workflow policy`** block wins; remaining files **shadowed**.
- **General** `domain-general-step-patterns.md` documents policy **narratively** (`## Workflow Policy Contract`) but has **no** `### Workflow policy` JSON block → **does not** supply `getWorkflowPolicy` by itself; policy comes from **LD** or **research** step-patterns when those domains are selected and ordered **before** a null scan ends (implementation: first loaded file with policy).

---

### 7.1 Manifest domain ids and file paths (authoritative graph)

| Domain id | Manifest `label` | Paths (manifest order) |
|-----------|------------------|-------------------------|
| **`general`** | General | `domains/general/domain-general-principles.md`, `domain-general-artefacts.md`, `domain-general-step-patterns.md`, `domain-general-prompt-rules.md` |
| **`learning-design`** | Learning Design | `domains/learning-design/domain-learning-design-principles.md`, `domain-learning-design-artefacts.md`, `domain-learning-design-step-patterns.md`, `domain-learning-design-prompt-rules.md` |
| **`research`** | Research | `domains/research/domain-research-principles.md`, `domain-research-artefacts.md`, `domain-research-step-patterns.md`, `domain-research-prompt-rules.md` |

**Platform files** (same manifest): `docs/workflow/workflow-spec.md`, `workflow-authoring.md`, `workflow-generation-template.md`, `pattern-library.md` — embedded as **PLATFORM CONTEXT** for design; refinement uses a **subset** per `workflowGenerationContext.js` regex rules (§6).

---

### 7.2 Pack files → machine surfaces (what the runtime actually consumes)

Legend — **Consumed by:** **UI** = Factory / Workflows hints or extra fields; **Ext** = `extractWorkflowBriefExplicitFactors` and related interpretive helpers in `app.js`; **WGCctx** = full markdown in WGC prompt context; **Design** = workflow design generation path using WGC + catalog/policy; **Refine** = `buildPromptRefinementContext`; **Render** = `getArtefactRenderCatalog` / `resolveUtilityRenderPlan`; **Persist** = values that flow into `domainExtraValues`, resolved factors, `workflowOutputSpec` / `stepParams` via `mappingRules`, or saved workflow JSON.

| Domain | File | Structured extracts (WGC / app) | Consumed by | Contract tier | Stability | Risk if changed | Dependent surfaces | Notes |
|--------|------|----------------------------------|---------------|----------------|-----------|-----------------|---------------------|-------|
| all | `*-principles.md` | None (markdown only) | WGCctx (**design** `buildWorkflowGenerationContext` only); **not** included in **`buildPromptRefinementContext`** domain file set (refinement uses only path regexes `prompt-rules|artefacts|step-patterns`) | Contract (prompt text) | High | Model behaviour / author framing shifts | Prompt assembly, generation | **Hidden split:** principles shape **design** prompts but **not** refinement domain appendix (unless duplicated elsewhere). |
| all | `*-prompt-rules.md` | None | WGCctx; **Refine** (domain files always match `prompt-rules`) | Contract | High | Prompt-studio and refinement drift | Refinement, generation | Lean mode still includes `prompt-rules`. |
| `general` | `domain-general-artefacts.md` | `### heading` artefact ids (`extractArtefactCatalogFromText`); labels synthetic (`id` with `_` → space) | WGCctx; Design; Refine; **Render** (if `getArtefactRenderCatalog` loads file — **no `### Render hints`** in this file → catalogue rows without render metadata) | Contract (ids) / Presentation (labels) | High | Dropdown + render match break | UI options, utilities | **Shadowing:** LD/research may define same artefact id with richer rows; **first-wins** in `getDomainArtefactOptions` (`seen` by id). |
| `learning-design` | `domain-learning-design-artefacts.md` | Same + **`### Render hints`** JSON for **`slide_deck`**, **`page`** | WGCctx; Design; Refine; Render | Contract + **Hybrid** (render labels in UI errors) | High | Utilities HTML pipeline | Render planning, tests | **Render catalogue:** `renderHints.renderable`, `supportedFormats`, `rendererType` / `rendererVariant`, `renderConfig.*` validated in `app.js` (~18660+). |
| `research` | `domain-research-artefacts.md` | Artefact ids; **no** `### Render hints` blocks found | WGCctx; Design; Refine; Render (rows without hints) | Contract | High | Research utility render gaps | Render planning | Render-dependent features rely on **LD/general** overlap or future hints. |
| `general` | `domain-general-step-patterns.md` | `## N.` patterns if present; **no** `### Workflow policy` JSON | WGCctx; Design; Refine (`step-patterns` in non-lean); step catalogue | Contract | High | Policy source shifts to other domain files | `getWorkflowPolicy`, heuristics | **Unused for policy JSON:** narrative “Workflow Policy Contract” is **not** the WGC parser anchor. |
| `learning-design` | `domain-learning-design-step-patterns.md` | **`workflowPolicy`** JSON; **`workflowBriefConfig`** JSON; `## N.` + `### Prompt factory` JSON per step | WGCctx; Design; Refine; UI (`getWorkflowBriefConfig` when LD is first structured domain); Ext (factors + `mappingRules`); Persist | Contract (+ Hybrid for `uiHints` / `helpText` / `question`) | **Critical** | Saved workflows, elicitation, assessment intent | Elicitation, extraction, generation, persistence, refinement | **First-structured-domain only** for brief config. **`intentClasses`**, **`stepRefinementProfiles`** consumed in `app.js` (`normalizeWorkflowBriefConfig`, `resolveAssessmentIntentClassMetadata`, ~5002). |
| `research` | `domain-research-step-patterns.md` | Same pattern types | Same consumption classes when **research** is first structured domain | Contract + Hybrid | Critical | Cross-domain brief mismatch if users expect LD questions | Same | **`runnerInstructions`** in prompt factory JSON: user-facing strings also embedded in pack text → **generation-visible**. |
| — | `domain-research-readme.md` | — | **None** in current manifest | N/A | N/A | Confusion if authors treat it as runtime contract | Docs | **Orphan file** relative to manifest. |

---

### 7.3 `workflowBriefConfig` — factor and extension inventory

**Persistence / mapping (both domains):** `mappingRules[].factor` and `mapsTo[]` tie factors to `workflow.workflowOutputSpec.*` and `workflow.workflowOutputSpec.constraints.*` (and LD also maps many factors to `stepParams.step_*` paths). Changing factor **ids** without a coordinated migration story **can** break **saved workflows**, **import/export**, and **mappingRules** alignment **in practice**.

#### 7.3.A Learning Design (`domain-learning-design-step-patterns.md` — `workflowBriefConfig`)

| Factor / extension id | Label (pack) | Type / choices (summary) | `question` / help | Consumed by | Tier | Drift / ambiguity |
|----------------------|--------------|---------------------------|---------------------|--------------|------|---------------------|
| `topic` | Topic | text | question text | UI, Ext, WGCctx, Design, Persist | Contract | Extraction sets `topic` / alias `workshop_subject` from goal text (`app.js` ~3547–3552). |
| `learner_level` | Learner level | select: beginner…postgraduate | question | UI, Ext, WGCctx, Design, Persist | Contract | Also inferred from free-text cues in `extractWorkflowBriefExplicitFactors` (~3445–3447, 3455+); **pack + extractor both** influence value. |
| `design_scope` | Design scope | select: single_activity, session, sequence, module | question | UI, Ext, WGCctx, Design, Persist | Contract | Inference rules in pack + blob heuristics in extractor. |
| `delivery_pattern` | Delivery pattern | select: face_to_face, blended, mostly_online | question | UI, Ext, Design, Persist | Contract | |
| `input_strategy` | Input strategy | select with value/label objects | question | UI, Ext, Design, Persist | Contract | Overlaps Factory **starting artefact** and `extractWorkflowBriefExplicitFactors` `input_strategy` (~3406–3415, 3569–3573). |
| `duration_minutes` | Session duration (minutes) | number min/max | question | UI, Ext, Design, Persist | Contract | Regex duration extraction in extractor (~3439–3442) can **pre-fill** without elicitation. |
| `delivery_mode` | Delivery mode | live_workshop, seminar, async | question | UI, Ext, Design, Persist | Contract | Heuristic blob classification (~3450–3452). |
| `delivery_context` | Delivery context | in_person…self_directed | question | UI, Ext, Design, Persist | **Hybrid** | **Duplicate id:** also appears under **`extraFields`** as `delivery_context` (LD pack). `optionalFactors` entry and **`extraFields`** entry target **same id** — values merge via **`domainExtraValues`** (`collectWorkflowDomainExtraFieldValues`) and `resolveWorkflowBriefFactors`; **source-of-truth ambiguity** (elicitation path vs extra-field DOM). |
| `session_materials` | Session-level materials | multi_select page, slide_deck | question | UI, Ext, Design, Persist | Contract | Extractor `interpretWorkflowBriefText` / session material signals (~3278+). |
| `page_profile` | Page profile | learner / facilitator / assessment | question | UI, Ext, Design, Persist | Contract | Heuristic `page_profile` in extractor (~3457–3463). |
| `assessment_required` | Assessment required | boolean | question | UI, Ext, Design, Persist | Contract | Heuristic assessment cues (~3454–3456). |
| `learning_environments` | Learning environments | multi_select | question | UI, Ext, Design, Persist | Contract | `interpretWorkflowBriefText` learning environment cues. |
| `assessment_strategy` | Assessment strategy | none…mixed | question | UI, Design, Persist | Contract | |
| *refinementFactors* | coverage_scope, cognitive_demand, question_style_mix, assessment_type, feedback_required, difficulty_profile, assessment_total_items, activity_pattern_mix, sequencing_granularity, assessment_cadence, tone_style, depth_level, include_examples, include_practice_tasks, compact_vs_detailed | various | question + `plainEnglish` | UI (refinement), Ext (predicates), Design, Persist | Contract / Hybrid | **`include_answers`**, **`include_feedback_guidance`** enforced in `resolveWorkflowBriefFactors` even if **not** declared as pack factors (~3666–3687) — **app-owned contract extension**. |
| `uiHints` | keys: `design_intent`, `audience`, `scope_scale`, `inputs`, `desired_outputs`, `constraints` | string hints | n/a | UI (Factory hints from `renderWorkflowFactoryDomainUiConfig`); **WGCctx** (same strings inside embedded JSON) | **Hybrid** | **`briefLines`** uses different literals: `Task / design intent:`, `Goal / outcome:`, `Inputs / artefacts:`, `Desired outputs:` (`app.js` ~5342–5350) — **terminology mismatch** vs pack `uiHints` key names and copy. Sprint 09 noted display overrides for LD in `app.js` for some hints — **second source** beside pack. |
| `extraFields` | `delivery_context` (optional duplicate channel) | select + `helpText` | helpText | UI (extra field group), Ext via `domainExtraValues` | Hybrid | Same id as optional factor — see above. |
| `inferenceRules` | — | `whenGoalMentionsAnyOf` / `whenInputsMentionAnyOf` + `set` | n/a | Ext (`applyWorkflowBriefInferenceRules`), Design | Contract | Keyword lists are **soft contracts**; substring goals/inputs. |
| `mappingRules` | per-factor | `mapsTo` arrays | n/a | Persist / step param patch pipeline | Contract | Many LD factors map to both `workflowOutputSpec` and `stepParams`. |
| `intentClasses.assessment_pack` | nested | `stepIncludes`, `detection`, `elicitation`, `stepBiasHints` | n/a | Ext (`resolveAssessmentIntentClassMetadata`), Design | Contract | **`stepIncludes`** uses slug-like ids (`generate_assessment_items`) while **`workflowPolicy.canonicalSteps`** uses **display titles** (`Generate Assessment Items`) — **id/title duality** across pack sections. |
| `stepRefinementProfiles` | `assessment_pack` tier | `questionText`, `parseHints`, `aliases` | question strings | Design / refinement flows (~5002+) | Contract | Author-facing **question text** is duplicated conceptually with factor `question` fields — **parallel wording surfaces**. |

#### 7.3.B Research (`domain-research-step-patterns.md` — `workflowBriefConfig`)

| Factor id | Label | Type / choices | Notes | Consumed by | Tier |
|-----------|-------|----------------|-------|--------------|------|
| `objective_type` | Research objective type | summary, analysis, briefing, questions | Drives `workflowPolicy.triggerRules` in same file | UI, Ext, Design, Persist | Contract |
| `audience` | Audience | text | Maps to `workflowOutputSpec.audience` | UI, Ext, Design, Persist | Contract |
| `output_depth` | Output depth | concise, standard, detailed | Aligns with extractor heuristic `output_depth` (~3565–3567) | UI, Ext, Design, Persist | Contract |
| `citation_style` | Citation style | apa, mla, chicago, none | optional | UI, Design, Persist | Contract |
| `uiHints` | same key shape as LD | strings | **Hybrid** — Factory + embedded in WGC markdown | Hybrid |
| `extraFields` | `evidence_rigour` | exploratory, standard, strict + `helpText` | **UI + `domainExtraValues` → Ext** | Hybrid |
| `inferenceRules` | e.g. brief → `objective_type: briefing` | | Soft keyword contract | Contract |

---

### 7.4 Step-pattern and policy metadata (titles, `promptFactory`, runner text)

| Surface | Where defined | Consumed by | Tier | Risk / flag |
|---------|---------------|-------------|------|----------------|
| **`workflowPolicy`** (canonical step **titles**, dependencies, `triggerRules`, `stepRoleAnchors`) | LD + research step-patterns JSON | `getWorkflowPolicy` → design heuristics (`applyWorkflowDesignHeuristics` path) | Contract | **First-wins** file choice; **risk:** trigger vocabulary **may** fall out of alignment with **extracted factor ids** (`whenResolvedFactorsInclude`) **if** either side changes independently |
| **`## N. Title`** step sections + **`### Prompt factory`** fenced JSON | Same files | `getStepPatternCatalog`; prompt templates in design/repair | Contract | Default **`canonicalStepId` / `canonicalPromptId`** slugified from title if JSON omits them (`workflowGenerationContext.js` ~471–481) — **convention**. |
| **`runnerInstructions`** inside `promptFactory` | Pack JSON | Parsed into catalog; **shown** in run UI when present; also in raw markdown context | **Hybrid** | User-facing copy is **also** in model context via full-file embed. |
| **General step-pattern prose** | `domain-general-step-patterns.md` | WGCctx only for policy *documentation* | Advisory | **Not** parsed as `workflowPolicy` JSON. |

---

### 7.5 Artefact ids and render catalogue (learning-design)

**Extraction:** `## N. artefact_id` and some `### id` headings in artefact docs → ids: e.g. `normalized_content`, `knowledge_model`, … `page`, `slide_deck`, `marking_rubric` (see `domain-learning-design-artefacts.md` structure).

**Render metadata (contract for utilities):** Under **`### Render hints`**, JSON supplies `renderHints` for **`slide_deck`** and **`page`** (see ~256–278 and ~478–501 in that file). **`getArtefactRenderCatalog({})`** in `app.js` loads **all domains** — first domain to register an id wins; later files **fill in** `renderHints` only if missing (`workflowGenerationContext.js` ~775–785).

---

### 7.6 `briefLines` / extractor terminology vs pack

| Pack / UI concept | `briefLines` / extractor | Note |
|-------------------|--------------------------|------|
| `uiHints.design_intent` | `Task / design intent:` line | Same underlying Factory field; **different prefix string** for the model. |
| `goal` / outcome | `Goal / outcome:` | Combines `goal` or falls back to `designIntent`. |
| `inputs` | `Inputs / artefacts:` | Label says “artefacts”; pack hint key is `inputs`. |
| `desired_outputs` | `Desired outputs:` | Stable prefix per Sprint 09 governance. |
| Free-text cues (duration, level, assessment language) | `extractWorkflowBriefExplicitFactors` regex and word lists | **Not** duplicated verbatim in pack JSON — **parallel heuristic contract** in `app.js`. |

---

### 7.7 General fallback **outside** pack ownership

When **`getWorkflowBriefConfig`** returns `config: null` (e.g. **general-only** selection, fetch failure, or missing JSON block), `app.js` uses **`getGeneralFallbackBriefConfig()`** (~3163+) — **hard-coded** required factors (`design_intent`, `audience`, `scope_scale`, …) and mapping rules. This is **not** sourced from `domains/general` packs — **explicit split** between **pack-first** structured domains and **app fallback** for baseline Factory behaviour.

---

### 7.8 Observed domain-pack contract patterns

1. **Markdown-as-contract:** Pack files are **simultaneously** human docs and **LLM context**; any heading or fenced JSON is a **latent runtime API** once WGC loads the file.
2. **Presentation / generation permeability:** `uiHints`, `question`, `plainEnglish`, `helpText`, and **`runnerInstructions`** appear in **UI** and in **embedded pack JSON inside WGC markdown** — **Hybrid** at minimum; treat as **Contract** for ids/values/keys per Sprint 10 instructions unless proven display-only.
3. **First-structured-domain:** Only **one** domain’s `workflowBriefConfig` drives elicitation for a given design session selection order; **other selected domains’** `workflowBriefConfig` blocks are **shadowed** for that API (still loaded as markdown).
4. **First-wins elsewhere:** `getWorkflowPolicy`, `getDomainArtefactOptions` id dedupe, `getArtefactRenderCatalog` merge, `getStepPatternCatalog` dedupe by `canonicalStepId || title`.
5. **General domain:** Always merged into selected domains for file load (`alwaysOnDomains`) — **general pack content is always prompt-visible** alongside structured domains.
6. **General fallback config:** **`getGeneralFallbackBriefConfig`** is an **app.js contract** parallel to packs — risk of **divergence** from LD/research `workflowBriefConfig` (different factors, labels, questions).
7. **Hidden dependencies:** `workflowPolicy.triggerRules` and extractor heuristics **appear to** rely on **stable factor ids** (`assessment_required`, `session_materials`, `delivery_context`, etc.); changing wording without changing ids **may** still shift **model** interpretation; changing ids **can** break **logic** **downstream**.
8. **Fixture implications:** **If** golden-style tests aim to stabilise pack-driven behaviour, **they may need to** pin **manifest order**, **selectedDomains order**, **which domain is “first structured”**, and **whether `getArtefactRenderCatalog` is called with `{}`** — **interpretation** for fixture design, not a product requirement.

**No implementation changes are proposed by this section.**

---

## 8. Persistence / import / export compatibility touchpoints (populated — Sprint 10 audit pass)

**Grounding:** Sprint 09 **Preserved constraints** — persistence field names, document shapes, import/export merge behaviour (`docs/consolidation/sprint-09-pass-1-closure.md`). **Sources:** `app.js` (`WORKFLOW_STORAGE_KEY`, `loadWorkflows` / `saveWorkflows`, `normalizeWorkflowForV1`, `importWorkflowsAndPrompts`, `handleImportChange`, `exportAllData`, `buildWorkflowBundle`, `handleSaveDesignedWorkflow`, `handleSaveWorkflow`, `gatherWorkflowDetailFormData`, `canonicalizeWorkflowStepPromptAttachment`, `resolveStepPromptText`), `library.js` (IndexedDB / `localStorage` fallback, `importPromptsFromEntries`), `workflowGenerationContext.js` (`DOMAIN_CACHE_KEY` for domain selection). **No code or pack edits.**

---

### 8.1 Persistence surfaces

| Surface | Mechanism | What is stored | Contract notes |
|---------|-----------|----------------|------------------|
| **Workflow definitions** | `localStorage` key **`promptr.workflows.v1`** (`app.js` ~198); `JSON.stringify(state.workflows)` — **raw JSON array** of workflow objects (~10488–10491). | Per workflow: at minimum `id`, `name`, `steps[]`, `workflowOutputSpec`, `selectedDomains`, `workflowInputs` / `workflowOutputs`, timestamps; optionally `workflowBriefResolution`, `startingArtefact`, `artefacts`, `scopeAndConstraints`, step `canonical_step_id`, `domain_version`, `promptId`, `override_prompt_body`, `prompt_bindings`, etc. | **No top-level `version` field** on the stored array — **implicit schema** by reader code. |
| **Prompt Library assets** | **`library.js`**: primary **IndexedDB** `promptRefinerDB` v1 / store `prompts`; fallback **`localStorage`** key **`promptRefiner.prompts`** (array JSON). | `id`, `title`, `body`, model params, `tags`, `createdAt`, `updatedAt`, `usageCount`, `source`, `versions[]`, optional `notes`, optional embedded **`brief`** from Prompt Studio (`getCurrentBriefSnapshot` ~7669–7705). | Prompt `id` links workflow steps (`library_prompt`); **`brief` snapshot uses Prompt Studio field names** (not Factory / `briefLines` prefixes). |
| **Factory domain selection** | `workflowGenerationContext.persistSelectedDomains` → **`localStorage`** `promptr.workflowFactory.domains.v1` (see §6). | Array of selected domain ids for next session. | Affects which domain files load — **indirect** contract on generation. |
| **In-memory only (not durable)** | `state.*` e.g. `workflowBriefResolved`, `workflowBriefElicitation`, `workflowStepGenerationContext`, `workflowStepPatternCatalog`, run navigation (`workflowRunVisibleStepId`, …). | Transient elicitation, WGC last-build context, catalog cache for UI. | Lost on reload; **rehydration** depends on **re-running** WGC + elicitation or **reading** saved workflow fields. |

---

### 8.2 Import / export paths

| Path | Format | Merge / precedence | Missing or unknown fields |
|------|--------|-------------------|---------------------------|
| **Export all (Prompt Library op)** | `exportAllData` → `{ version: 1, prompts: [...], workflows: [...] }` (~10418–10428). | N/A (download only). | Prompts from `Library.getAllPrompts()`; workflows from **`state.workflows`** (already normalised in memory). |
| **Export single workflow** | `buildWorkflowBundle([wf])` → same shape with **subset** `prompts`: `collectPromptsForWorkflows` pulls **`state.prompts`** entries referenced by step `promptId` (~12814–12840). | N/A. | If library body changed after export, bundle can be **stale** vs live Library. |
| **Import file (`handleImportChange`)** | Heuristic JSON detection (~12886–12905): (1) **object** with `workflows` and/or `prompts` arrays → `newerWins: true`; (2) **array** of objects with **`steps`** → workflows only, `newerWins: true`; (3) **array** with `title` + `body` → prompts only, `newerWins: true`. | **Workflows:** `importWorkflowsAndPrompts` — each item **`normalizeWorkflowForV1` first**, `validateWorkflow` (warnings only), then **by `id`**: replace existing row or push (~12949–12991). If `newerWins` and **`updatedAt`** on disk ≤ existing → **skip** (~12970–12978). **Prompts:** `Library.importPromptsFromEntries(entries, { newerWins })` — skip when imported `updatedAt` ≤ existing (~389–398 in `library.js`). | Unrecognized top-level shape → toast **“format not recognized”** (~12900). Prompt entries missing `id`/`title`/`body` → **skipped** (~383–385). |
| **Standalone prompt import** | `library.js` `importPrompts` uses **`newerWins: false`** (~491). | Imports always upsert eligible rows. | Different policy than bundle import. |

**Convention-based import:** No manifest of supported export versions beyond numeric **`version: 1`** on bundles; **workflows-only** historical saves may be a **bare array** with **no** version key (`loadWorkflows` ~10464–10465).

---

### 8.3 Rehydration paths

| Flow | Behaviour | Contract-sensitive rehydration |
|------|-----------|--------------------------------|
| **App init** | `loadWorkflows` → `JSON.parse` → **map** each `wf` through **`normalizeWorkflowForV1(wf, [])`** (~10466–10467). | **Soft migration** in normalizer (below). |
| **Select workflow / detail** | `populateWorkflowDetail(wf)` — DOM from `wf` fields; `refreshWorkflowStepPatternCatalogForDomains` + WGC (~10570+). | **`selectedDomains` collapsed** by normalizer on every load (§8.4). |
| **Design → first save** | `handleSaveDesignedWorkflow` builds new `wf` with **`workflowBriefResolution`**, `scopeAndConstraints`, `startingArtefact`, seeded steps, then **`normalizeWorkflowForV1`** (~13352–13369). | Full brief resolution object persisted **if** user saves from Factory path. |
| **Workflows tab save** | `handleSaveWorkflow` ← **`gatherWorkflowDetailFormData`** (~11801–11913) then step canonicalization (~11946–11983). | **Gather object omits** `workflowBriefResolution`, **`startingArtefact`**, **`scopeAndConstraints`** (and any other fields only set on the design-save object). **`artefacts`** **is** gathered from the Workflows inputs field. **Replacing** `state.workflows[idx] = data` (~12013) **drops** fields not returned by gather — **silent loss** of design-time brief metadata (`workflowBriefResolution`, combined scope string, starting artefact) when editing an existing workflow from the Workflows tab. **Flag:** persisted semantics **diverge** between “save designed workflow” and “save from Workflows editor”. |
| **Run mode** | Run UI reads **current** `wf` + `resolveStepPromptText`; navigation state in **`state`** only (~7979+). | **Not persisted** — reload resets run position. |
| **Prompt attachment** | `resolveStepPromptText` resolves **`library_prompt`** via **`findPromptById`** on **`state.prompts`** (~10953–10977). | Import order: prompts imported **before** workflow merge in `importWorkflowsAndPrompts` (~12928–12937) so ids can resolve. |

---

### 8.4 `normalizeWorkflowForV1` — durable “soft migration” rules

| Rule | Effect | Risk |
|------|--------|------|
| **Steps** | Assign `id`, normalize **`prompt_source` / `prompt_source_type`**, **`canonicalizeWorkflowStepPromptAttachment`**, strip **`canonical_prompt_id` / `canonical_prompt_version`** fields from stored step (~12632–12640). | **Deleted prompt metadata** on round-trip — re-derive only from `promptFactory` in live catalog if needed. |
| **`depends_on` → `inputBindings`** | Legacy dependency arrays converted to **`inputBindings`**; synthetic `artifactName` when missing output (~12652–12704). | Warnings pushed to import path; **silent** fallbacks for names. |
| **`selectedDomains` collapse** | Non-empty domains filtered → **at most one** non-`general` domain kept: `["general", firstStructured]` or `["general"]` (~12713–12721). | **Multi-domain selection not round-tripped** — **compatibility drift** vs author intent and vs WGC multi-load at design time. |
| **Legacy top-level fields** | `scopeAndConstraints` / `description` folded into **`workflowOutputSpec`** then **deleted** (~12723–12734). | One-way shape change in memory after load. |

---

### 8.5 Contract-sensitive fields (persisted / exported / merged)

Treat as **Contract** unless proven ephemeral: **`workflow.id`**, step **`id`**, **`canonical_step_id`**, **`domain_version`**, factor keys in **`workflowBriefResolution.resolvedFactors`** / **`mappedBindings`**, **`workflowOutputSpec`**, **`promptId`**, `prompt_source_type`, **`override_prompt_body`**, **`briefLines` prefixes** when reproduced on design (§3–§5), **`brief`** object keys on Library entries.

**Heuristic / wording coupling:** `extractWorkflowBriefExplicitFactors` outputs persisted only through **design save** paths that copy **`initialBrief`** / resolution; **re-extraction on reload does not automatically re-run** on the saved workflow unless user re-enters Factory flow. **`mappedBindings.workflowConstraintPatch`** stores **key: value** lines merged into **`scopeAndConstraints`** string on design save — **string concatenation contract** alongside structured factors.

---

### 8.6 Version assumptions

| Area | Observation |
|------|-------------|
| **Explicit versioning** | Export bundle **`version: 1`** only; workflows array in `localStorage` has **no** version property. |
| **`library.js` DB** | `DB_VERSION = 1` — **no** upgrade hooks beyond store creation. |
| **`updatedAt` merge** | Import “newer wins” depends on **numeric timestamps**; missing `updatedAt` → **0** → import often **wins** or loses predictably. |
| **First-wins / shadowing** | Same workflow `id` → **full replace** with normalized import row. |

---

### 8.7 Risks if changed (summary)

| Risk | Trigger |
|------|---------|
| **Saved workflow breakage** | Rename factor ids, `canonical_step_id`, or `workflowOutputSpec` paths referenced by `mappingRules`. |
| **Silent semantic drift** | Change `briefLines` or extractor without updating saved `workflowBriefResolution` or re-save path. |
| **Export/import mismatch** | Export subset of prompts; import on machine missing Library entries → **unresolved `library_prompt`**. |
| **Cross-domain incompatibility** | Normalizer **effectively** leaves **at most one** structured domain — exports authored with multiple structured domains (if ever in raw JSON) **collapse** on load. |
| **Prompt-context drift** | WGC / pack reload; **`textCache`** (§6) — different session, same saved `id`. |
| **Render-plan mismatch** | `getArtefactRenderCatalog` not persisted — **runtime-only**; pack edits change utilities without touching workflow JSON. |
| **Refinement mismatch** | `workflowBriefResolution` dropped on Workflows save — post-save refinement / audit UI may not match design-time mappings. |

---

### 8.8 Dependent surfaces

Prompts and **step `override_prompt_body`**; **generation** (design uses saved `workflowBriefResolution` only if still on object); **tests/fixtures** (import file shapes, `updatedAt`, id collisions); **domain packs** (catalog/policy at run time); **workflow replay** (step order, `inputBindings`); **future migrations** (normalizer is the de facto migrator).

---

### 8.9 Observed persistence and compatibility architecture patterns

1. **Durable contract surfaces** split across **three stores**: workflow array (`promptr.workflows.v1`), prompt entries (IDB / `promptRefiner.prompts`), Factory domains (`promptr.workflowFactory.domains.v1`) — **no unified version header** across them.

2. **Hidden migration assumptions:** **`normalizeWorkflowForV1`** is the **sole** declared “translate legacy/variant … **no migration framework**” owner (~12609–12612); every load/import funnels through it.

3. **Silent compatibility guarantees are partial:** validation is **warning-only** on import and on Workflows save (~12957–12961, ~11990–11992); **bad graphs can still persist**.

4. **Import/export fragility:** Detection by **object/array shape** and `steps` vs `title`/`body` heuristics — **soft protocol**; mixed bundles rely on **`newerWins`** timestamps being trustworthy.

5. **Provenance ambiguity:** Steps may be **`library_prompt`** (external body), **`local_override`** (inline body), or **`none`**; exports can embed **copies** of prompts while live Library evolves — **two truths**.

6. **Save-path split (critical):** **Factory “Save workflow”** persists a **rich** object including **`workflowBriefResolution`**; **Workflows tab “Save”** persists **gather-only** fields and can **strip** resolution / starting artefact / string fields not in gather — **compatibility hazard** and **observable mismatch** with §5 prompt assembly that referenced stored mappings (~897–901 `stepParamPatch` reader).

7. **Fixture implications (candidate themes, not a test plan):** scenarios **worth considering** if fixtures are later authored include **(a)** bare workflow array import, **(b)** `{ version:1, workflows, prompts }`, **(c)** `newerWins` skip branches, **(d)** post-save gather round-trip **loss** of `workflowBriefResolution`, **(e)** `selectedDomains` collapse.

**No implementation changes are proposed by this section.**

---

## 9. Cross-system compatibility matrix (synthesis from §§3–8)

**Evidence vs interpretation:** Row facts trace to **§§3–8** inventories. Column **“Dominant coupling type”** and the right-hand column are **interpretive summaries** of observed dependencies, not independent measurements.

**How to read:** Each row notes **observed dependencies** that **would plausibly** need to remain coherent **for** stable author-visible behaviour; it is **not** a guarantee of how the product **ought to** behave. This table **does not** add new technical claims beyond cited §§.

| Lifecycle / surface | Primary artefacts | Explicit version / schema? | Dominant coupling type (audit vocabulary) | If contract drifts, plausible failure modes (non-exhaustive) |
|----------------------|---------------------|------------------------------|---------------------------------------------|--------------------------------------|
| **Saved workflows** (`promptr.workflows.v1`, §8) | Normalised workflow JSON; steps with `canonical_step_id`, attachments, optional `workflowBriefResolution` | **No** array-level version; **`normalizeWorkflowForV1`** acts as **implicit** normaliser on load | **Behaviour-based** compatibility; **partially layered** gather vs design-save | **Possible:** reload-side semantic shifts; **gather-save may drop** resolution metadata (§8.3); **selectedDomains** collapsed to `general` + one structured (§8.4) |
| **Exported bundles** (`version: 1`, §8.2) | `{ workflows, prompts }`; single-workflow export embeds **subset** of Library | Bundle **`version: 1`** only; **no** workflow-generation contract version | **Convention-based** file shape detection on import; **mixed provenance** | **Possible:** stale prompt bodies vs live Library; missing prompts on import machine |
| **Imports** (§8.2) | Same + **`newerWins`** by `updatedAt` | Heuristic recognition of array vs object; **soft** protocol | **First-wins** / skip-by-timestamp; validation **warning-only** | **Possible:** silent partial merge; skipped rows without hard failure |
| **Prompt refinement** (§5.3, §6) | `buildPromptRefinementContext` + Prompt Studio **`brief`** snapshot (§3.3 **PS-***) | No contract version in refinement payload | **Multi-channel** vs Factory `briefLines`; **excludes** `*-principles.md` from domain set | **Possible:** different model context than design; author confusion **if** text is copied across contexts |
| **Workflow replay / step execution** (§5.2, §5.8) | `resolveStepPromptText`; `workflowOutputSpec`; step notes / bindings | Attachment rules in **`canonicalizeWorkflowStepPromptAttachment`** (behaviour) | **Heuristic** cue lines in run context (**RC-***, §3.3) vs BL-* | **Possible:** empty step text **if** a library prompt body cannot be resolved |
| **Run mode** (§8.3) | In-memory navigation; DOM from `wf` | Not persisted | **Ephemeral** — replay depends on latest `wf` + Library | **Observed:** run navigation is session state; UX resets on reload |
| **Render planning** (§7.5, §6) | **`getArtefactRenderCatalog`** at runtime; LD **`renderHints`** | Not stored in workflow JSON | **Domain-pack evolution** + **first-wins** catalogue merge | **Possible:** utilities behaviour changes **if** pack hints change; `{}` loads **all** domains (§6) |
| **Cross-domain** (§7, §8.4) | `selectedDomains`; WGC `alwaysOnDomains` | Normalizer **collapses** to ≤1 structured domain on load (§8.4) | **Hidden coupling** to **general**; **first-structured-domain** brief config | **Possible:** multi-domain author intent not round-tripped |
| **Domain-pack evolution** (§6–§7) | Manifest paths; markdown + fenced JSON | **No** pack semver in runtime; **`textCache` / `manifestPromise`** (§6) | **Prompt-driven** + **convention-based** headings | **Possible:** stale cached text until full reload; offline **`fallbackManifest`** drift vs live manifest |
| **Fallback behaviour** (§7.7, §4, §6) | `getGeneralFallbackBriefConfig`; extractor when general-only; WGC fetch catch | App-owned vs pack-owned **split** | **Fallback-driven** elicitation when pack config null | **Possible:** pack vs app fallback divergence **without** loud failure |

### 9.2 Regression checklist and fixture implications

**Regression concerns** (carry-forward from bootstrap; **re-stated** against §§3–8 — **not** a committed test backlog):

- Saved workflow **reload** after any contract change — **candidate** focus: **`normalizeWorkflowForV1`** branches and **selectedDomains** collapse (§8.4).
- **Export / import** round-trip, including **mixed provenance** (Library `promptId` vs `local_override` bodies) and **`newerWins`** skip paths (§8.2).
- **Design-from-brief** with minimal, full, and edge-case optional fields — **candidate** alignment checks across **`briefLines`**, **F-INT**, and **resolution → mapping → save** (§3–§5, §8.3).
- **Cross-domain** behaviour when manifest or pack order changes — **first-structured-domain** brief config and WGC file order (§6–§7).
- **Generated step shape** under fixed brief fixtures — **canonical_step_id** / title matching and **stepParamPatch** application (§5, §8).
- **Workflows-tab save** after design save — **gather round-trip** vs **`workflowBriefResolution`** retention (§8.9).
- **Utilities render** when **`getArtefactRenderCatalog({})`** and pack **`renderHints`** evolve (§6–§7).

| Fixture / test concept | Purpose (audit-linked) |
|------------------------|-------------------------|
| **Golden brief fixtures** | Canonical `base` objects and **`briefLines`** arrays per domain; assert **order** and **BL-** prefixes (§3). |
| **Extraction snapshots** | Expected **`extractWorkflowBriefExplicitFactors`** output; separate **general-only** vs structured runs (§4). |
| **Prompt channel excerpts** | Redacted **P** text for design vs refinement vs run — detect **RC-** vs **BL-** drift (§3.3, §5). |
| **Persistence round-trips** | JSON **before/after** `normalizeWorkflowForV1` and after **simulate gather-save** (§8). |
| **Extended manual smoke** | Sprint 09 baseline **plus** design-from-brief, import bundle, run-mode, utilities when touching contract paths (bootstrap). |

**No implementation changes are proposed by this section.**

---

## 10. Contract-surface classification, stability, governance, and open questions

**Evidence vs interpretation:** §**10.1** tables mix **cited code paths** (evidence) with **judgement columns** (blast radius, migration difficulty, “authority source”) — those judgements are **audit opinion**, not measurements. **Presentation / Hybrid / Contract** tiers follow the **same convention** as §3: default **Contract** unless the inventory showed a display-only path; **Hybrid** flags dual use **as observed** in §§3–8.

### 10.1 Contract-surface classification summary (major families)

**Tier legend:** **Presentation** — author-visible without model/persistence obligation in the audited path; **Hybrid** — same strings or ids in UI **and** model or persistence; **Contract** — models, extraction, mapping, persistence, or import/export depend on shape or literals.

| Surface family | Authority source (where meaning is **primarily encoded** in code/docs, per §§3–8) | Primary consumers | Durability | Blast radius (qualitative) | Migration difficulty (qualitative) | Hidden coupling | Known drift (evidence) | Fixture requirements |
|----------------|----------------------------------------------|---------------------|------------|--------------|------------------------|----------------|------------------------|------------------------|
| **`briefLines`** | **`app.js`** `continueWorkflowDesignGeneration` assembly order | Design LLM via WGC `WORKFLOW BRIEF`; parallel **F** uses `base` blob not line parse (§3–§4) | **Ephemeral** string unless echoed into saved fields indirectly | **High** | **High** — multi-file prefix lexicon (**BL-**, **F-INT**, **RC-**, **WS-**, **PF-***, §3) | **Multi-channel** vocabulary | **F-INT** vs **BL-*** prefix mismatch (§3.2, §3.5) | Golden line order + joiner; cross-check RC/PF |
| **Extraction factors** | **`extractWorkflowBriefExplicitFactors`** + `interpretWorkflowBriefText`; domain rules in **`applyWorkflowBriefInferenceRules`** | Elicitation resolution; design hints; `explicitBriefFactors` passed to design API (§4, §5) | Partially **recomputable** from `base`; not stored as one blob | **High** | **High** — regex + keyword lists | **Heuristic** coupling to free text; **parallel** to pack `inferenceRules` | General-only early return vs structured heuristics (§4) | Blob text fixtures per domain; edge-case keywords |
| **`workflowGenerationContext.js`** | **`domains/domain-manifest.json`** + embedded **`fallbackManifest`**; parsers by heading/regex | Design + refinement context; catalog getters; Factory config (§6) | **Session caches** (`textCache`, `manifestPromise`) | **High** | **Medium–high** | **alwaysOnDomains**; **first-wins** policy/brief file choice | Pack vs fallback manifest (§6, §7) | Fetch stub order; first-structured-domain selection |
| **Domain-pack metadata** | Markdown + JSON **in repo files** (manifest-listed) | WGC loaders; **`getWorkflowBriefConfig`** (single domain); utilities render (§7) | **Git-authored** pack content; runtime holds **cached** text | **High** | **High** without reload story | **Markdown-as-contract**; **uiHints** in embed | `uiHints` keys vs **`briefLines`** labels (§7.6); duplicate `delivery_context` id paths (§7.3) | Pack snapshots + manifest pins |
| **Prompt assembly** (step + run + factory) | Multiple builders in **`app.js`** (§5) | LLM calls; copy-to-clipboard; run prep | Mostly **ephemeral** per call; some mirrored in saved steps | **High** | **High** | **Compressor** shared across BL / PF / UI (§3.5) | **RC-01** `Goal:` vs **BL-03** `Goal / outcome:` (§3.3) | Full prompt channel matrix per scenario |
| **Persistence / import / export** (§8) | **`normalizeWorkflowForV1`** + `gatherWorkflowDetailFormData` vs design-save shapes | `localStorage`; file bundles; Library IDB/LS | **Durable** | **Critical** | **High** — no explicit WG contract version | **Save-path split** | Resolution object **not** in gather (§8.3, §8.9) | Import shapes; `newerWins`; gather round-trip |
| **Heuristic outputs** | Substring rules in extractor + **`compressWorkflowConstraints`** + policy **`triggerRules`** keyword lists | Factors; step inclusion; UI compression | Mix of **derived** and **persisted** | **Medium–high** | **High** — tacit keyword contracts | Policy titles vs slug ids (§7.4) | Assessment / page profile cues (§4) | Keyword corpora fixtures |
| **`workflowBriefConfig`** | First structured domain’s **step-patterns** JSON block | Elicitation; mapping; optional profiles (§6–§7) | In pack files; **not** duplicated in workflow JSON wholesale | **High** | **High** | **MVP single-domain** vs multi-select UI (§6, §7) | App **`getGeneralFallbackBriefConfig`** parallel contract (§7.7) | Domain order; LD vs research |
| **Prompt-visible markdown** (pack + platform docs) | Authors + workflow docs in **`docs/workflow`** and **`domains/**`** | Entire files in **`promptContext`** (§6) | Git + browser cache | **Very high** for model behaviour | **Medium** to strip; **high** to evolve safely | **No firewall** between docs and model | Presentation prose **is** generation-visible (§5.7, §6) | Redacted prompt excerpts (bootstrap) |

\* **Blast radius** and **migration difficulty** in the table above are **qualitative audit judgements**, not calibrated risk scores.

**Architectural-behaviour tags (interpretation of §§3–8):** the implementation **appears** predominantly **convention-based** (import shape heuristics, markdown headings, regex file picks), **multi-channel** (parallel prefix families in §3.3), **first-wins** (WGC policy, catalog dedupe, step pattern keys — §6–§7), **fallback-driven** (manifest catch, general brief config, extractor defaults — §4, §6, §7.7), **heuristic** (extraction and trigger keyword lists — §4, §7), **partially layered** (gather vs design save, F vs BL, Library vs inline body — §8), **soft-schema** (no JSON schema for workflows at rest; normalizer comments acknowledge “no migration framework” — §8.4). **Much of** compatibility **as described in this audit** depends on **reader behaviour** (`normalizeWorkflowForV1`, import detectors, WGC parsers) **rather than** on an explicit versioned schema **alone**.

### 10.2 Stability expectations (governance-level, not a commitment)

| Tier | Expectation |
|------|-------------|
| **Frozen by Sprint 09 governance** | `briefLines` **prefix literals** named in Sprint 09 closure; factor **ids** and persisted **field names**; import/export **merge semantics** until a chartered change. |
| **Stable in practice, soft-specified** | `normalizeWorkflowForV1` output shape; **`version: 1`** export envelope; Library prompt entry required fields (`id`, `title`, `body`). |
| **Volatile across sessions** | WGC **`textCache`** / **`manifestPromise`**; run-mode UI state; in-memory elicitation (`state.workflowBriefResolved`). |
| **Author-controlled volatility** | Domain markdown and JSON-in-markdown — intentional edits change generation **without** any semver gate. |

### 10.3 Candidate governance checks (non-binding; no charter implied)

These are **pre-charter checks** suggested by the audit evidence — **not** decisions, **not** approval, **not** Sprint 10 implementation scope.

1. **Preserve Sprint 09 boundary:** changes touching **P/F/W/PE** columns in §3 tables, **factor ids**, **`workflowBriefResolution`** semantics, or **`normalizeWorkflowForV1`** **fall on the contract side** of Sprint 09’s split (§1) — **not** “UI copy” by default, regardless of file (`index.html` vs `app.js` vs packs). **Per Sprint 09 closure**, such edits **would be** charter-gated **if** pursued; they are **outside** Pass 1’s UI-only remit — **not** authorised by this audit.

2. **Compatibility matrix (§9):** **if** a future charter opens, that matrix **could** inform a pre-flight checklist: each row **may** map to “old semantics / new semantics / blast radius / rollback” tables (bootstrap audit-before-diff).

3. **Save-path semantics are underspecified in code** (§8.9): Factory design save vs Workflows gather-save **currently** produce **different durable subsets**. **Without** an explicit charter definition, a **single** save semantics **could** be **implicitly** read into the product — **not** warranted by this audit alone.

4. **Smoke and fixtures (if pursued):** Sprint 09 smoke remains the **recorded** baseline; **possible** extensions (design-from-brief, import bundle, run-mode, utilities) are **bootstrap echoes**, **not** obligations of this audit.

5. **Versioning policy:** bootstrap “version tagging” is **not** implemented for the workflows array (§8.6); any policy remains a **future charter** topic — **not** implied here.

### 10.4 Open architectural questions (refined with §§3–8 evidence)

| # | Question | Why it remains open after audit |
|---|------------|----------------------------------|
| Q1 | Is **`workflowBriefResolution`** intended to be a **durable** part of the workflow contract, or a **design-time cache** only? | Design save persists it; Workflows gather-save can **drop** it (§8.3, §8.9). |
| Q2 | Should **multi-domain** selection ever be a **first-class** persisted state, or is **normalizer collapse** to `general` + one domain **possibly** the **intended** behaviour? | Evidence of both author-facing multi-select and load-time collapse (§8.4, §7.8); **intent is not resolved** in this audit. |
| Q3 | Where should **prefix canonicalisation** land if ever chartered — single generator for all **BL / F-INT / RC / PF** lines, or accept multi-channel with explicit mapping tables? | §3.5 documents parallel lexicons without a single owner. |
| Q4 | Should **pack semver** or **manifest `contractVersion`** exist, or is **git + full reload** the only supported evolution story? | No runtime pack version (§6–§8). |
| Q5 | How should **render metadata** relate to workflows — remain **runtime-only** from packs, or be snapshotted for reproducible utilities? | Render catalogue not in saved workflow JSON (§7.5, §8). |
| Q6 | What is the **compatibility story** for **`fallbackManifest`** vs live `domain-manifest.json` when offline? | Drift hazard documented (§6). |

*(Sprint 07 / 08 carry-over items in prior §10 remain **related**; they are not duplicated here.)*

### 10.5 Residual risk themes (bootstrap; unchanged intent)

- **Silent semantic migration** — export shape unchanged, model interpretation changed (still applies: §5–§6).
- **Prefix coupling** — models or downstream logic assuming literals (e.g. **`Desired outputs: `** — Sprint 09 governance).
- **Factor id renames** — breaking saved JSON, overrides, partial imports (§4, §7–§8).
- **Split brain** — `app.js` defaults vs domain **`uiHints`** vs prompt bodies (§7, §7.7).
- **Elicitation vs synthesis** — changing one path without the other (§5, §8.3).
- **Scope creep** — isolated string change without coordinated extraction, fixtures, and docs (§3–§4).

---

## 11. Migration-option analysis (strategic alternatives — not recommendations)

Each **option** is an **architecture strategy family** for a **hypothetical** future charter. **None** is selected, ordered, or scoped. **Per Sprint 09 closure**, “audit before diff” and “explicit charter” rules **remain** the **stated** baseline for follow-on contract work — **not** superseded by this audit.

### Option A — Freeze and document current contract

| Dimension | Assessment |
|-----------|------------|
| **Benefits** | **Possible** lowest operational risk among the four families; **can align** with Sprint 09 **freeze** posture; §§3–8 **can serve** as a descriptive inventory of behaviour-as-observed (not a normative “spec”). |
| **Risks** | **Silent drift** continues (caches, heuristics, multi-channel prefixes); technical debt **visible** but **unchanged**. |
| **Operational complexity** | Low — documentation and smoke discipline only. |
| **Compatibility implications** | **Leaves** current behaviour-based quirks **as implemented today** (not a warranty of future stability). |
| **Fixture requirements** | **If** characterisation is desired: tests or manual matrices **may** record current behaviour as baseline (§9–§10.1). |
| **Rollback implications** | N/A — no rollout. |
| **Likely Sprint scope** | **Indicative only (not a plan):** small documentation/governance effort **if** bounded. |
| **Preconditions missing?** | **None** for **using this audit as-is** — **no** strategy option (A–D) is **selected** by this document; “Option A” here is only a **labelled family**, not a decision. |

### Option B — Additive v2 semantic layer

| Dimension | Assessment |
|-----------|------------|
| **Benefits** | New fields or parallel prefixes **could** be introduced **without** removing v1 literals immediately; **may** reduce “big bang” pressure **if** adopted consistently. |
| **Risks** | **Dual read** burden on all consumers (extraction, prompts, persistence); risk of **inconsistent** adoption across BL / F-INT / RC channels. |
| **Operational complexity** | **Medium–high** — every channel in §3.3 **would need to be** enumerated **if** such a layer were chartered. |
| **Compatibility implications** | Saved workflows and imports **would need** a defined story: ignore v2 safely, **opt in**, or equivalent — **mixed** bundles **would** become more complex. |
| **Fixture requirements** | **Pairs** of fixtures (v1-only, v1+v2, v2-only readers). |
| **Rollback implications** | Feature-flag style disable of v2 readers/writers — **if** such machinery exists (it does **not** today). |
| **Likely Sprint scope** | **Indicative only (not a plan):** **medium** pilot scope **per surface family**, **if** chartered. |
| **Preconditions missing?** | **Yes** — no explicit **feature flag** or **reader version** in storage today (§8.6); **if** dual-write were chartered, **a** charter **could** define **where** v2 lives (object field vs new file). |

### Option C — Transitional dual-read / dual-write

| Dimension | Assessment |
|-----------|------------|
| **Benefits** | Allows **renamed factor ids** or **prefix migrations** with a bounded overlap window (bootstrap alternative (2)). |
| **Risks** | Longest window of **highest bug density**; **`normalizeWorkflowForV1`** would grow in responsibility without a formal migration framework (§8.4 already notes absence). |
| **Operational complexity** | **High** — **would require** coordinated changes across WGC, packs, extractor, **`briefLines`**, and persistence **if** pursued as one programme. |
| **Compatibility implications** | Import **might need to** accept **both** shapes; export policy (“normalise to latest”) **would need to be** explicit **if** dual-write were adopted. |
| **Fixture requirements** | **Matrix** across read/write modes; **time-travel** imports from older exports. |
| **Rollback implications** | **Would need** a **stored marker** of which branch wrote a record — **not** present today. |
| **Likely Sprint scope** | **Indicative only (not a plan):** **large**; **plausibly** multi-sprint **if** such a programme were chartered. |
| **Preconditions missing?** | **Yes** — explicit **documented compatibility matrix** (§9) and **per-row migration decisions** (bootstrap “contract table”); test harness; possibly **minimum reader version** policy. |

### Option D — Explicit versioned workflow-generation contract

| Dimension | Assessment |
|-----------|------------|
| **Benefits** | Clear **schema-driven** boundary for what “workflow generation contract” means at rest and on the wire; enables tooling, validation **beyond** warning-only import. |
| **Risks** | Highest **up-front** design cost; risk of **paper schema** diverging from prompts unless **generated** or **cross-validated**. |
| **Operational complexity** | **Very high** initially; **lower** long-run if successful. |
| **Compatibility implications** | **`normalizeWorkflowForV1`** might become a **versioned** pipeline with explicit steps; breaking changes become **visible** as version bumps. |
| **Fixture requirements** | Schema validators + golden JSON per version; contract tests against **prompt excerpts** (not only JSON). |
| **Rollback implications** | Version downgrade policy **would need to be** defined — **not** in product today. |
| **Likely Sprint scope** | **Indicative only (not a plan):** **very large**; **plausibly** multi-sprint and charter-gated **if** pursued. |
| **Preconditions missing?** | **Yes** — agreed **canonical model** (single source of truth for factors vs lines vs packs); ownership for **prompt text** vs **JSON** (audit shows **split authority**, §6.17, §10.1); investment in **non-warning** validation policy. |

### 11.1 Relation to staged pass table (process, not strategy)

The **process** stages **Audit complete → Compatibility design → Pilot → Broaden/rollback** (bootstrap) **may be referenced as** **governance sequencing vocabulary** for **whichever** strategy option (A–D) a future charter selects — **not** as a commitment to run those stages. §11 options are **strategy families**; they are **orthogonal** to that vocabulary.

| Process stage | Status (this document) | Explicitly **not** decided here |
|---------------|------------------------|----------------------------------|
| **Audit complete** | **§§3–8** populated; **§§9–12** synthesis added | Any code or pack change |
| **Compatibility design** | **Not started** — **if** pursued, **would be** charter-gated **with** per-row tables (bootstrap vocabulary) | Production rollout |
| **Pilot** | **Not started** | Full cutover |
| **Broaden / rollback** | **Not started** | Implicit “big bang” |

**Alternatives to discuss** (from prior §11, unchanged in intent): (1) prefix versioning vs stable prefixes with new optional lines; (2) dual-read for renamed factors; (3) import adapters only vs write-path migration. **No** selection is implied by this document.

**Process stages are not a delivery schedule:** the labels **Audit complete**, **Compatibility design**, **Pilot**, **Broaden / rollback** describe **bootstrap governance vocabulary** only; they **do not** commit PRISM to run those stages, or to run them in a fixed calendar order, without a separate charter.

---

## 12. Architectural conclusions from Sprint 10 bootstrap audit

**Nature of this section:** Numbered statements below are **audit interpretations** grounded in §§3–8; they are **not** product requirements, **not** defect findings, and **not** an implementation charter.

1. **Single authoritative contract (interpretation):** The evidence in §§3–8 **does not** depict a **single** unified, schema-backed “workflow generation contract” **as one artefact**. **Instead**, authority **appears split** across **`briefLines`** builders, **synthetic F-INT**, **extractor heuristics**, **WGC** (file graph + parsers), **domain packs**, **`normalizeWorkflowForV1`**, **`getGeneralFallbackBriefConfig`**, and **persistence gather paths** (§3–§8, §10.1). Semantic authority **appears to reside** in **runtime behaviour** (code paths + markdown prose) **more than** in one machine-readable schema.

2. **Schema-driven vs prompt-driven (interpretation):** The system **appears primarily prompt-driven** for author intent delivery to models: large **opaque markdown** contexts and **line conventions** dominate (§5.7, §6, §7.8). **Soft-schema** JSON fragments (packs, `workflowBriefResolution`) sit **beside** that, not **above** it.

3. **Incremental change and blast radius (interpretation):** **Even** changes that look “small” **can** touch **high–blast-radius** surfaces because of **multi-channel** prefixes and **cached** pack text (§3, §6). **If** contract work were chartered, **plausible** preconditions **include** explicit channel maps and fixtures aligned to §9 — **not** assessed here as feasible or infeasible to deliver.

4. **Prerequisites before any implementation charter (governance discussion points, not a task list):**

   - Clarified **intent** for **save-path semantics** (what is durable vs ephemeral — §8.9, §10.4 Q1).
   - **If** migrations are ever chartered: per-surface compatibility rows with **rollback** story (bootstrap audit-before-diff).
   - **If** automated tests are pursued: fixture themes sketched in §9–§10.1 (import shapes, domain order, first-structured-domain brief config — §7.8, §9).
   - Explicit policy choice on **version markers** vs **behavioural** compatibility (§8.6; Option B–D **are** unselected illustrations only).
   - A charter that **preserves** Sprint 09’s UI vs contract boundary (§1).

5. **No implementation recommendation:** This section does **not** select a migration strategy. **Possible** governance follow-ups **include** charter discussion **among other** portfolio choices; **none** is implied as mandatory by this audit.

### 12.1 Governance posture after bootstrap audit

- **Sprint 09 boundary holds:** UI-semantics work and workflow-generation contract work remain **separate classes**; this document **does not** authorise contract edits.
- **§§3–8 = evidence inventories; §§9–12 = synthesis:** **this audit invites readers to** treat tables in §§9–11 as **structured opinion** anchored to §§3–8, not as new runtime specifications.
- **Options A–D are non-selected families**; the process-stage table (§11.1) is **sequencing vocabulary** for a **hypothetical** future charter — **not** an execution plan.
- **Out-of-scope reminders (bootstrap / Sprint 09):** renderer redesign, sequencing-engine redesign, domain-pack wholesale rewrite, and broad workflow-engine rewrite remain **outside** this audit’s implied scope unless a **new** charter explicitly widens it.
- **High-risk observations** (e.g. save-path subset mismatch, prefix multi-channeling) are **architectural facts / interpretations** for charter input — **not** mandates to patch immediately.

---

## Related artefacts

- `docs/consolidation/sprint-09-workflow-brief-semantics-alignment-pass-1.md` — Sprint 09 audit table, implementation log, governance, verification.
- `docs/development/sprints/2026-05-12-sprint-10-workflow-brief-contract-rationalisation/GPT-BOOTSTRAP-PROMPT.md` — fresh architectural chat bootstrap.

## Review log

- **2026-05-12** — **Final governance-language skim (documentation):** normative/roadmap token pass (`must` / `should` / `will` / `required` / `need` / `require` / `forces` / `breaks` / `assume` where not UI or code fact); residual wording softened toward **possible / may / could / if chartered / appears to**; **no** implementation charter implied; audit-only posture **may** read consistently end-to-end. **No** source-code changes.
- **2026-05-12** — **Bootstrap governance review (documentation):** tightened evidence vs interpretation language in §§9–12; softened imperative / sequencing wording; added §12.1 **Governance posture after bootstrap audit**; removed duplicate `## Related artefacts` then **restored** a single heading before artefact bullets; aligned Option A/D and process-table language with “non-selected / indicative only”; light touch on §§3, §5–§7 wording where audit read as prescriptive. **No** source-code changes.
- **2026-05-12** — **§§9–12 synthesis added:** cross-system compatibility matrix; contract-surface classification (major families); stability expectations; **candidate governance checks** (§10.3); open questions (evidence-refined); migration options **A–D** (benefits/risks/complexity/fixtures/rollback/preconditions/sprint-scale); process staging table; **Architectural conclusions from Sprint 10 bootstrap audit**; **documentation only** (no implementation recommendation).
- **2026-05-12** — **Section 8 populated:** persistence (`promptr.workflows.v1`, Library IDB/LS, Factory domain cache), export bundles, import heuristics and `newerWins`, `normalizeWorkflowForV1` soft migrations, rehydration vs gather/save path divergence, contract fields and risks; **documentation only**.
- **2026-05-12** — **Section 7 populated:** domain-pack contract matrix from `domains/domain-manifest.json`, all manifest-listed pack files, `workflowGenerationContext.js` load/parse rules, and `app.js` consumption paths; **documentation only** (no pack edits).
- **2026-05-12** — **Section 6 populated:** `workflowGenerationContext.js` responsibility map (public API, internals, manifest/domain loading, brief config, prompt context, template/file selection, fallbacks, `app.js` consumers and duplication, presentation vs generation, tier/risk/dependents matrix, patterns); **documentation only**.
- **2026-05-12** — **Section 5 populated:** step-context / prompt assembly (WGC, design/repair/review/intent/extraction APIs, heuristics, step/run/refinement paths, domain file embedding, multi-channel vocabulary); **documentation only**.
- **2026-05-12** — **Section 4 populated:** `extractWorkflowBriefExplicitFactors` contract (callers, inputs/outputs, synthetic F-INT, heuristics, domain `workflowBriefConfig` via manifest + LD/research step-patterns, precedence, drift vs `briefLines` / WGC / persistence); **documentation only**.
- **2026-05-12** — **Section 3 populated:** `briefLines` and parallel brief-shaped line assemblies traced in `app.js` / `workflowGenerationContext.js` (audit pass; **no** code changes).
- **2026-05-12** — **Created:** Sprint 10 contract audit scaffold (sections 1–12 structure); governance and scope aligned to Sprint 09 closure and Sprint 10 bootstrap; **documentation only**.
