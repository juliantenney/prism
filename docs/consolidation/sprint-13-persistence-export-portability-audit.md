# Sprint 13 — persistence / export portability audit

**Date:** 2026-05-13  
**Path:** `docs/consolidation/sprint-13-persistence-export-portability-audit.md`

**Role:** Map how **domain selection**, **workflow domain metadata**, **starting artefact** choices, **brief resolution**, and **domain-scoped workflow fields** are **persisted**, **imported**, **exported**, or **bundled**. **Read-only audit documentation.**

**Confirmation — no implementation occurred:** **No** edits to **`app.js`**, **`workflowGenerationContext.js`**, domain packs, prompts, persistence keys, import/export handlers, orchestration, or Sprint 12 artefacts were made to produce this document.

**Out of scope for this pass:** Exhaustive enumeration of every **`Library`** prompt persistence field; line-by-line audit of **`resolveStepPromptText`**; **full drop-in portability** completion claims.

---

## 1. Inventory of persisted / exported domain-related fields

**Primary durable store:** `localStorage` key **`promptr.workflows.v1`** (`WORKFLOW_STORAGE_KEY` in **`app.js`**) — JSON array of workflow objects, each passed through **`normalizeWorkflowForV1`** on **load** and on **import**.

**Workflow object fields with domain / brief / starting-point relevance (as observed in code paths):**

| Field / area | Set on which path | Notes |
|--------------|-------------------|--------|
| **`selectedDomains`** | **`handleSaveDesignedWorkflow`** (from **`getSelectedWorkflowDomains()`**); **`handleSaveWorkflow`** / **`gatherWorkflowDetailFormData`** (also **`getSelectedWorkflowDomains()`** — **not** from `wf.selectedDomains` DOM) | **`normalizeWorkflowForV1`** coerces to **`["general"]`** or **`["general", <first non-general id>]`** — extra structured domains **dropped**. |
| **`startingArtefact`** | **`handleSaveDesignedWorkflow`** reads Factory **`#wfDesignStartingArtefact`** | **Detail tab** populates **`els.workflowStartingArtefact`** from `wf` (**`populateWorkflowDetail`**), but **`gatherWorkflowDetailFormData`** does **not** return **`startingArtefact`**; **`handleSaveWorkflow`** replaces the stored workflow with the gather result **without** merging these fields — see §5. |
| **`workflowBriefResolution`** | **`handleSaveDesignedWorkflow`** copies **`state.workflowBriefResolved`** into persisted **`workflowBriefResolution`** | Same **`handleSaveWorkflow`** replacement gap as **`startingArtefact`** if those keys are absent from **`gatherWorkflowDetailFormData`**. |
| **`workflowOutputSpec`** | Design save builds **`normalizeWorkflowOutputSpec`**; detail save via **`gatherWorkflowDetailFormData`** | **`normalizeWorkflowForV1`** normalises shape; legacy **`scopeAndConstraints`** / **`description`** folded in on load/import. |
| **`scopeAndConstraints`** (transient on new design object) | Present on object built in **`handleSaveDesignedWorkflow`** before **`normalizeWorkflowForV1`** | Consumed into **`workflowOutputSpec.constraints`** then **deleted** by normaliser. |
| **Step **`canonical_step_id`**, **`domain_version`**, **`prompt_bindings`**, notes/param blocks** | Design save seeds from catalog + **`mappedBindings`**; detail save gathers from DOM / existing step | **`normalizeWorkflowForV1`** canonicalises step prompt attachment fields and **`depends_on` → `inputBindings`**. |
| **`artefacts`**, **`workflowInputs`**, **`workflowOutputs`** | Gather + design save | Inputs/outputs lists; not domain ids but user text. |

**Export / bundle shapes:**

| Mechanism | Contents |
|-----------|----------|
| **`exportAllData`** | `{ version: 1, prompts: [...], workflows: [...] }` — workflows are **`state.workflows`** as stored (after normalisation on load, not re-normalised at export time in the snippet reviewed). |
| **`handleExportWorkflow`** / **`buildWorkflowBundle`** | `{ version: 1, workflows: [<wf>], prompts: collectPromptsForWorkflows([wf]) }` — **same workflow object** subset as in storage. |

**Separate localStorage (domain Factory preference, not workflow record):**

| Key / API | Owner | Written | Read in **`app.js`** |
|-----------|--------|---------|-------------------------|
| **`promptr.workflowFactory.domains.v1`** | **`workflowGenerationContext.js`** (`DOMAIN_CACHE_KEY`) via **`persistSelectedDomains`** | **`handleWorkflowDomainSelectionChange`** persists **`["general"]`** or **`["general", extra]"`** | **`persistSelectedDomains`** only — **`loadPersistedDomains`** is **exported** from WGC but **no call site** in production **`app.js`** was found; **`initWorkflowDomainSelector`** resets **`state.workflowSelectedDomains`** to **`["general"]`** without reading this key. |

---

## 2. File / function references

| Concern | Location |
|---------|----------|
| **`WORKFLOW_STORAGE_KEY`**, **`loadWorkflows`**, **`saveWorkflows`** | **`app.js`** (~198, ~10487–10532) |
| **`gatherWorkflowDetailFormData`** | **`app.js`** (~11839–11951) |
| **`handleSaveWorkflow`** | **`app.js`** (~11984–12067) |
| **`populateWorkflowDetail`**, **`selectWorkflow`** | **`app.js`** (~10593–10688) |
| **`handleSaveDesignedWorkflow`** | **`app.js`** (~13192–13414+) |
| **`normalizeWorkflowForV1`** | **`app.js`** (~12647–12775) |
| **`validateWorkflow`** | **`app.js`** (~12777–12819) |
| **`buildWorkflowBundle`**, **`handleExportWorkflow`**, **`exportAllData`**, **`triggerDownload`** | **`app.js`** (~10443–10474, ~12872–12899, ~10456–10474) |
| **`handleImportChange`**, **`importWorkflowsAndPrompts`** | **`app.js`** (~12901–13079) |
| **`getSelectedWorkflowDomains`**, **`handleWorkflowDomainSelectionChange`** | **`app.js`** (~2537–2552, ~3051–3067) |
| **`buildPromptRefinementContext`** (refinement injection) | **`app.js`** (~8497–8526); implementation **`workflowGenerationContext.js`** (~228–296) |
| **`persistSelectedDomains`**, **`loadPersistedDomains`** | **`workflowGenerationContext.js`** (~159–173, exports ~894–905) |

---

## 3. Which fields are UI-only / workflow semantics / prompt-facing / persisted / exported-imported

| Classification | Examples |
|----------------|----------|
| **UI-only (session / DOM)** | Factory domain `<select>` value driving **`state.workflowSelectedDomains`** before save; detail-tab fields while editing — **not** durable until **`saveWorkflows`**. |
| **Workflow semantics (stored, drive behaviour)** | **`selectedDomains`** (after normalisation), **`canonical_step_id`**, **`domain_version`**, **`workflowBriefResolution`**, **`workflowOutputSpec`**, step **`prompt_bindings`**, **`startingArtefact`** when present on the object. |
| **Prompt-facing (derived at runtime, not necessarily identical to stored JSON)** | **`buildPromptRefinementContext`** uses **`state.workflowSelectedDomains`** (not fields read from the persisted workflow object in the reviewed path); seeded step bodies from design save use live catalog + mappings. |
| **Persisted** | Any property on the workflow object that survives **`saveWorkflows`** after the relevant save handler — subject to **replacement** behaviour in **`handleSaveWorkflow`**. |
| **Exported / imported** | Whole workflow objects in export bundle JSON; import runs **`normalizeWorkflowForV1`** then merge into **`state.workflows`**. |

---

## 4. Current coupling to **general**, **learning-design**, **research**, first structured domain

| Coupling | Observation |
|----------|-------------|
| **`selectedDomains` shape** | **`normalizeWorkflowForV1`** keeps **at most one** non-**`general`** id; multi-structured selections are **not** preserved in storage. |
| **`getSelectedWorkflowDomains`** | Always ensures **`general`** first; one **`extra`** from **`state.workflowSelectedDomains`**. Fallback rows for Factory select include **`general`**, **`learning-design`**, **`research`** (**`getWorkflowFactoryDomainSelectFallbackDomains`**). |
| **Detail-tab save vs Factory state** | **`gatherWorkflowDetailFormData`** uses **`getSelectedWorkflowDomains()`** (Factory **`state`**) **not** **`wf.selectedDomains`** from the opened workflow — potential **mismatch** when the Workflows tab is saved without aligning Factory selection. |
| **First structured domain** | WGC **`getWorkflowBriefConfig`** uses first non-**`general`** domain (documented in **`sprint-13-general-alwayson-first-structured-domain-behaviour.md`**); persistence stores the **normalised** domain pair, which aligns with **at most one** structured id. |

---

## 5. Backwards-compatibility risks

1. **`normalizeWorkflowForV1`** drops all but one structured **`selectedDomains`** entry — older or external exports with **multiple** structured domains **silently** collapse.
2. **`handleSaveWorkflow`** overwrites the workflow with **`gatherWorkflowDetailFormData`** output, which **omits** **`startingArtefact`** and **`workflowBriefResolution`** — risk of **losing** design-time fields after an edit/save from the **Workflows** tab unless another code path merges them (none observed in the reviewed **`handleSaveWorkflow`** body).
3. **`gatherWorkflowDetailFormData`** **`selectedDomains`** source (**Factory `state`**) can **diverge** from **`wf.selectedDomains`** on the record being edited (§4).
4. **Legacy fields** **`scopeAndConstraints`**, **`description`** are migrated on normalise; exports that still carry only legacy fields depend on that path remaining stable.
5. **Import** uses **warning-only** **`validateWorkflow`** — invalid or partially incompatible records can still merge.
6. **Domain cache write / no read:** **`persistSelectedDomains`** writes Factory selection; **`loadPersistedDomains`** appears **unused** in **`app.js`** — behaviour may surprise operators expecting “remember my domains” across reloads from that key alone.
7. **`workflowBriefResolution`** / **`mappedBindings`** semantics tied to **pack** factor ids and canonical step ids — **replay** after pack edits is not governed by a **versioned migration** framework ( **`normalizeWorkflowForV1`** comment notes **no migration framework**).

---

## 6. Candidate future slices (audit-only)

| Label | Meaning |
|-------|---------|
| **Documentation only** | Operator notes on which save path preserves which fields; export/import shape. |
| **Parity-safe helper extraction** | Pure refactors that preserve **byte-identical** or test-proven identical merge semantics (e.g. extracting merge helpers) — **only** with fixtures proving no field loss. |
| **Migration-required change** | Any change to **stored** workflow schema, **`selectedDomains`** policy, or normaliser behaviour that invalidates existing **`promptr.workflows.v1`** or export files without a **migration** story. |
| **Unsafe without schema / version decision** | Bumping **`version`** on export bundles, splitting **`workflowBriefResolution`**, or adding multi-domain arrays **without** explicit compatibility and **`normalizeWorkflowForV1`** ownership rules. |

---

## 7. Required evidence before implementation

- **Field-loss matrix:** For each save entry point (**`handleSaveDesignedWorkflow`**, **`handleSaveWorkflow`**, duplicate/rename if applicable), list **every** top-level workflow key **before** and **after** persist.
- **Round-trip tests:** Import → export → import for workflows containing **`workflowBriefResolution`**, **`startingArtefact`**, and multi-step **`domain_version`** / **`canonical_step_id`**.
- **Cross-tab state diagram:** Document **`state.workflowSelectedDomains`** vs **`wf.selectedDomains`** when switching between **Create Workflow** and **Workflows** tab.
- **localStorage contract:** Decide whether **`loadPersistedDomains`** is intentionally dead in UI and document, or wire with parity proof.

---

## 8. Stop conditions

- Any change that **alters** **`normalizeWorkflowForV1`** output for existing fixtures **without** recorded **migration** intent and tests — **stop** until chartered.
- Any save-path change that **does not** preserve **`workflowBriefResolution`** / **`startingArtefact`** where they exist today on loaded objects — **stop** until merge semantics are specified and evidenced.
- **Sprint 12** closure — **do not** reopen as part of this audit.

---

## 9. Explicit deferred items

- **S13-02 / S13-03** implementation and other Sprint 13 deferred areas remain as in **`sprint-13-first-pass-closure.md`** / **`sprint-13-index.md`**.
- **Prompt/config channel** detail is cross-referenced in **`sprint-13-prompt-config-portability-tracing-audit.md`**; this audit does **not** duplicate full **`promptContext`** assembly.
- **Starting artefact / LD starting-point** policy — **`sprint-13-starting-artefact-ld-starting-point-portability-audit.md`** and decision framing.

---

## 10. Confirmation that no implementation occurred; no portability completion claim

This file is **audit documentation only**. No repository implementation was performed to author it.

**Full drop-in domain-pack portability** is **not** claimed, implied, or scheduled by this audit.

---

## Review log

- **2026-05-13** — Persistence / export portability audit drafted (`sprint-13-persistence-export-portability-audit.md`).
