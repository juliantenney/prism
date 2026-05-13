# Sprint 13 — prompt / config portability tracing audit

**Date:** 2026-05-13  
**Role:** Trace how **domain-pack content**, **`workflowBriefConfig`** (including **`uiHints`**), **manifest**, and related metadata become **prompt-facing**, **model-facing**, **persisted**, or **exported**. **Read-only audit documentation.**

**Confirmation — no implementation occurred:** **No** edits to **`workflowGenerationContext.js`**, **`app.js`**, domain packs, prompts, persistence, import/export, orchestration, tests, Sprint 12 artefacts, or other consolidation notes were made to produce this document.

**Out of scope for this pass:** Line-by-line inventory of every **`app.js`** consumer of **`getStepPatternCatalog`** / **`getWorkflowPolicy`**; Sprint 12 reopening; **full drop-in portability** completion claims.

---

## 1. Inventory of prompt-facing / config-facing paths

| # | Path | Inputs → output / consumer | Pack / manifest involvement |
|---|------|----------------------------|------------------------------|
| 1 | **`loadManifest`** → **`normalizeManifest`** | Fetched **`domains/domain-manifest.json`** (or **`fallbackManifest`** on failure); merges missing domain keys from embedded fallback. | **Manifest JSON** (+ **WGC-embedded** fallback object). |
| 2 | **`buildWorkflowGenerationContext`** | **`loadManifest`** → **`normalizeSelectedDomains`** → collect **all** `platformFiles` + selected domains’ **`d.files`** → **`loadFiles`** → concatenate full markdown bodies into **`promptContext`** (`## PLATFORM CONTEXT`, `## DOMAIN CONTEXT` incl. full file text, `## WORKFLOW BRIEF` = user **`brief`** string). | **Entire** listed markdown files for platform + selected domains enter **`promptContext`**. |
| 3 | **Workflow design API call** | **`continueWorkflowDesignGeneration`** passes **`ctx.promptContext`** (if present) else **`brief`** string to **`callOpenAIForWorkflowDesign`**; user message = **`promptContext` + compact directive** (`app.js` ~5443–5444, ~8981–8987). | Domain markdown **inside** **`promptContext`** is **model-visible** (same channel as platform docs). |
| 4 | **`buildPromptRefinementContext`** | **`loadManifest`** → filtered **platform** + **domain** paths (`prompt-rules`, `artefacts`, optionally `step-patterns` / platform subset) → **`promptContext`** for refinement + optional **`promptTask`** section. | Subset of pack files; still **full file text** for included paths. |
| 5 | **Prompt Studio refinement begin** | When workflow-step refinement injects domain context, **`buildPromptRefinementContext`** result’s **`promptContext`** feeds **`beginRefinement`** (`app.js` ~8512–8521). | Same as row 4 for that entry path. |
| 6 | **`getWorkflowBriefConfig`** | **`loadManifest`** → first **structured** domain (non-`general`) → find **`*step-patterns*`** path → **`readTextFile`** → **`extractWorkflowBriefConfigFromText`** parses `### Workflow brief config` JSON → returns **`{ domainId, config }`**. | **`workflowBriefConfig`** object (incl. **`uiHints`**, factors, **`intentClasses`**, etc.) is **parsed from domain markdown**; **not** the whole file returned here, but the **same file** is typically also loaded in row 2 when domain selected. |
| 7 | **Factory UI from `cfg`** | **`renderWorkflowFactoryDomainUiConfig`** uses **`cfg.uiHints`**, **`cfg.extraFields`** for DOM (`app.js`). | **Config subset** drives **display**; **does not** replace row 2’s inclusion of full markdown. |
| 8 | **`buildWorkflowDesignBase` / `buildWorkflowDesignBrief`** | Factory **form `.value`** fields → **`base`** → **`briefLines`** with **fixed English prefixes** (`Task / design intent:`, `Desired outputs:`, …) → **`brief`** string. | **Prefixes** are **`app.js`-owned**; **values** are user text, **not** `uiHints` strings. |
| 9 | **`extractWorkflowBriefExplicitFactors`** | Regex / heuristics over **`base`** fields (design intent, goal, …) for elicitation (`app.js`). | **Indirect** coupling to how Factory labels/hints train authors; **not** direct pack string import. |
| 10 | **Design-time resolved state** | **`workflowBriefResolved`**, **`mappedBindings`**, elicitation queues — built from **brief config** + user answers (`app.js` large surface). | **Domain-pack factor ids / mappingRules** semantics drive behaviour when LD (or other) **`workflowBriefConfig`** is active. |
| 11 | **Save designed workflow** | **`handleSaveDesignedWorkflow`** persists **`workflowBriefResolution`**, **`selectedDomains`**, **`startingArtefact`**, **`workflowOutputSpec`**, steps (incl. **`domain_version`**), etc. (`app.js`). | **Persisted** shape is **workflow JSON**, **not** raw markdown; **references** domain ids / canonical step ids tied to catalog. |
| 12 | **`buildWorkflowBundle` / export** | Workflows + related prompts serialised (`app.js`). | Exports **saved** workflow objects; domain packs **not** embedded wholesale. |
| 13 | **`getDomainOptions` / `getStepPatternCatalog` / `getDomainArtefactOptions` / `getWorkflowPolicy`** | Various loaders over manifest paths + parsers. | Feed **UI** and **generation helpers**; catalog/policy text can reach models **via** design/refinement paths that assemble prompts from patterns (cross-coupling with step payloads — bounded mention only here). |

---

## 2. File / function references (primary)

| Concern | Location |
|---------|----------|
| **`loadManifest`**, **`normalizeManifest`**, **`readTextFile`**, **`loadFiles`**, **`normalizeSelectedDomains`** | `workflowGenerationContext.js` (~57–116, ~78–92, ~118–153, ~107–116) |
| **`buildWorkflowGenerationContext`** | `workflowGenerationContext.js` (~176–226) |
| **`buildPromptRefinementContext`** | `workflowGenerationContext.js` (~228–296) |
| **`extractWorkflowBriefConfigFromText`** | `workflowGenerationContext.js` (~542–592) |
| **`getWorkflowBriefConfig`** | `workflowGenerationContext.js` (~851–892) |
| **`buildWorkflowDesignBase`**, **`buildWorkflowDesignBrief`** | `app.js` (~5316–5382) |
| **`continueWorkflowDesignGeneration`**, **`callOpenAIForWorkflowDesign`** | `app.js` (~5385+, ~8948+) |
| **Prompt Studio refinement** (`buildPromptRefinementContext` caller) | `app.js` (~8495–8526) |
| **`renderWorkflowFactoryDomainUiConfig`** (uses **`cfg.uiHints`**) | `app.js` (~2757–2797) |
| **`extractWorkflowBriefExplicitFactors`** | `app.js` (~3393+) |
| **Persistence / export** (representative) | `app.js` **`handleSaveDesignedWorkflow`**, **`gatherWorkflowDetailFormData`**, **`buildWorkflowBundle`**, **`exportAllData`** (see grep / closure docs) |

---

## 3. Separation: display-only vs workflow semantics vs prompt/model-facing vs persisted/exported

| Kind | Examples | Notes |
|------|-----------|--------|
| **Display-only (narrow sense)** | **`uiHints`** applied to Factory helper `<p>` / placeholders via **`renderWorkflowFactoryDomainUiHints`** | **Does not** by itself put hint text into **`briefLines`**; user **typed** values do. |
| **Hybrid (display + model)** | Same **domain markdown** file that contains **`workflowBriefConfig` / `uiHints` JSON** is also concatenated **verbatim** into **`buildWorkflowGenerationContext.promptContext`** when the domain is selected | **`uiHints`** strings appear **both** on DOM (parsed object) **and** inside **full file text** sent to the model — **not** “display-only” in the global sense. |
| **Workflow semantics** | **`mappingRules`**, **`requiredFactors`**, **`intentClasses`**, elicitation behaviour, **`startingArtefact`** resolution | Drives **authoring** flow and **resolved** objects; shapes **what** gets asked and **what** lands in **`workflowBriefResolution`**. |
| **Prompt / model-facing** | **`promptContext`** from **`buildWorkflowGenerationContext`** or **`buildPromptRefinementContext`**; **`callOpenAIForWorkflowDesign`** user content; system **`WORKFLOW_DESIGN_SYSTEM_PROMPT`** (`app.js` constant) | Model sees **concatenated docs + brief**; system prompt is **repo-owned**, not manifest. |
| **Persisted / exported** | **`workflow`** objects: **`selectedDomains`**, **`startingArtefact`**, **`workflowBriefResolution`**, **`workflowOutputSpec`**, steps | **Not** full domain markdown; **references** ids / resolution payloads. |

---

## 4. Which domain data is manifest-owned, markdown-owned, `app.js`-owned, or WGC-owned

| Layer | Owner | Examples |
|-------|--------|----------|
| **Manifest-owned** | Repo file **`domains/domain-manifest.json`** | `platformFiles`, `alwaysOnDomains`, `domains[id].label`, `domains[id].files[]` |
| **Markdown-owned** | Git-tracked **`domains/*/*.md`** (+ platform **`docs/workflow/*.md`**) | Narrative prose, JSON blocks (`workflowBriefConfig`, **`uiHints`**, step patterns, policies, artefact catalogues) |
| **WGC-owned (runtime loader / parsers)** | **`workflowGenerationContext.js`** | **`loadManifest`**, **`normalizeManifest`**, **`fallbackManifest`**, **`extractWorkflowBriefConfigFromText`**, **`buildWorkflowGenerationContext`**, **`buildPromptRefinementContext`**, **`getWorkflowBriefConfig`**, path filters for refinement |
| **`app.js`-owned** | **`app.js`** | **`briefLines` prefix strings**; **`WORKFLOW_DESIGN_SYSTEM_PROMPT`**; Factory form wiring; **`extractWorkflowBriefExplicitFactors`** heuristics; Prompt Studio refinement orchestration; persistence/export **glue** |

---

## 5. Current coupling risks for portable domain packs

1. **Total markdown permeability:** Any prose or JSON in a loaded domain file is **eligible** to appear in **`promptContext`** — packs cannot assume “**`uiHints`** is UI-only.”
2. **`briefLines` prefix mismatch:** Line prefixes are **fixed in `app.js`**, while packs use **`uiHints`** keys and different copy — **split brain** between author-facing hints and **model-facing** brief labels (documented in Sprint 10 audit).
3. **First-structured-domain rule:** **`getWorkflowBriefConfig`** reads **one** domain’s `*step-patterns*` file; multi-domain **merge** of brief configs is **not** present — portability must account for **which** file wins.
4. **Fallback manifest merge:** **`normalizeManifest`** backfills missing domain keys from **`fallbackManifest`** — shipped packs and embedded fallback can **diverge** if not kept aligned.
5. **Persisted vs live pack:** Saved workflows store **resolution** and **ids**, not pack text; **replay** after pack edits depends on **versioning / compatibility** posture (not audited numerically here).
6. **Refinement subset vs design superset:** **`buildPromptRefinementContext`** uses **different** path filters than **`buildWorkflowGenerationContext`** — authors and reviewers may **assume** parity of loaded docs between modes.

---

## 6. Candidate future slices (audit-only labels)

| Slice | Meaning |
|-------|---------|
| **Documentation only** | Describe channels (this audit style) in charters / operator docs; **no** code movement. |
| **Parity-safe extraction** | Move **`briefLines`** prefixes or hint wiring only with **proven** no semantic drift (requires fixtures + model-input diff strategy — not evidenced here). |
| **Manifest / schema extension** | Add explicit fields (e.g. brief line templates) **in manifest** — **high** governance; touches loaders and possibly **`app.js`** readers. |
| **Unsafe without architecture work** | “Firewall” domain docs so **`uiHints`** never appear in **`promptContext`**, or split files into **UI-only** vs **model-only**, without a **storage + loader + test** architecture — **unsafe** as a blind refactor. |

---

## 7. Required evidence before implementation

- **Per-channel matrices:** For each of **`buildWorkflowGenerationContext`**, **`buildPromptRefinementContext`**, **`getWorkflowBriefConfig`**, list **exact file paths** loaded per **`selectedDomains`** tuple (general-only, general+LD, general+research, multi-structured if ever allowed).
- **Diff proof** between **`briefLines.join`** output and **`promptContext`** for representative Factory sessions.
- **Fixture set** for **`extractWorkflowBriefExplicitFactors`** when pack copy changes (if touching hints or labels).
- **Persistence round-trip** tests plan for **`workflowBriefResolution`** when **`workflowBriefConfig`** schema or factor ids change.
- **Charter** explicitly listing **forbidden** edits (prompts, packs, persistence) per pass.

---

## 8. Explicitly deferred items

- **S13-01** delivered slice — limited to **`#wfDesignDomainSelect`**; **does not** cover this audit’s broader prompt/config surface.
- **S13-02 / S13-03** — remain on their own decision artefacts.
- **Starting artefact / LD starting-point** — see `docs/consolidation/sprint-13-starting-artefact-ld-starting-point-portability-audit.md` and decision framing note.
- **Sprint 12** — **not** reopened.
- **Full portability** — **not** claimed (§9).

---

## 9. Confirmation that no implementation occurred

This file is an **audit** only. **No** repository implementation was performed to author it.

---

## 10. No full portability claim

**Full drop-in domain-pack portability** is **not** claimed, implied, or scheduled as an outcome of this audit.

---

## Review log

- **2026-05-13** — Prompt / config portability tracing audit drafted (`sprint-13-prompt-config-portability-tracing-audit.md`).
