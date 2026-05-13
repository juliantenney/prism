# Sprint 13 — General, always-on, and first-structured domain behaviour (v1 reference)

## Purpose and scope

This note describes **currently** implemented behaviour in PRISM **v1** related to:

- how domain lists are sourced (`domains/domain-manifest.json` versus the embedded fallback in `workflowGenerationContext.js`),
- how **`alwaysOnDomains`** and **`normalizeSelectedDomains`** affect effective domain selection,
- how **`general`** is used as a baseline / sentinel in core logic,
- how **`getWorkflowBriefConfig`** chooses a domain for brief configuration,
- how the **Workflow Factory** domain `<select>` and related state represent domains.

It is **descriptive only**. It does **not** change product policy, prescribe fixes, or define a roadmap. Wording uses **“currently”**, **“as implemented”**, and **“v1”** where behaviour is tied to the shipped manifest and code paths.

**Sprint 12 — first-pass structural observability (Phases A–E)** is **closed** separately (`docs/consolidation/sprint-12-first-pass-structural-observability-closure.md`). This document **does not** reopen Sprint 12 scope, tests, or obligations.

---

## Two sources of domain registry (v1)

### On-disk manifest

**File:** `domains/domain-manifest.json`

**Currently** holds:

- `platformFiles` — paths to platform markdown loaded for workflow generation context,
- `alwaysOnDomains` — array of domain ids that are always merged into effective selection **as implemented** in `workflowGenerationContext.js` (`normalizeSelectedDomains`),
- `domains` — object keyed by domain id; each entry **currently** includes `label` and `files` (paths to domain markdown).

In **v1**, `alwaysOnDomains` **as implemented** in the checked-in file includes **`"general"`**.

### Embedded fallback manifest

**File:** `workflowGenerationContext.js`  
**Identifier:** `fallbackManifest` (object near the top of the module)

If manifest fetch or normalisation fails, **`normalizeManifest`** in `workflowGenerationContext.js` **currently** merges keys from `fallbackManifest` into the working manifest so missing domain keys are backfilled. The fallback object **currently** duplicates **v1** domain ids, labels, and file paths for **`general`**, **`learning-design`**, and **`research`**, aligned with the on-disk manifest for those domains.

**As implemented**, there are therefore **two** registry sources: the JSON file on disk and the embedded fallback. Behaviour depends on load path; both **currently** describe the same three domain ids for v1 when the on-disk file matches the repository default.

---

## `alwaysOnDomains`

**Location:** `domains/domain-manifest.json` (`alwaysOnDomains` array); consumed in `workflowGenerationContext.js` after `normalizeManifest`.

**Currently**, the shipped manifest lists **`general`** as an always-on domain. The meaning **as implemented** is: ids listed in `alwaysOnDomains` that also exist in `manifest.domains` are **always** included when building the effective selected-domain set inside **`normalizeSelectedDomains`** (see below), in addition to any user-supplied ids that validate against `manifest.domains`.

---

## `normalizeSelectedDomains`

**File:** `workflowGenerationContext.js`  
**Function:** `normalizeSelectedDomains(selectedDomains, manifest)`

**As implemented:**

1. Starts from the caller’s `selectedDomains` array (or empty if not an array).
2. For each id, if it is truthy and `manifest.domains[id]` exists, it is recorded in an internal set.
3. Each id in `manifest.alwaysOnDomains` is then added if `manifest.domains[id]` exists.
4. Returns **`Object.keys(selected)`** of that set — the **current** insertion semantics follow the order in which keys were added (user-valid ids first in input order, then always-on ids not already present).

This function is used when building workflow generation context and when resolving **`getWorkflowBriefConfig`** input against the manifest.

---

## `general` as baseline / sentinel

**v1 usage (descriptive):**

- **`general`** appears in **`alwaysOnDomains`** in `domains/domain-manifest.json`, so it is **always** merged into normalized selection by **`normalizeSelectedDomains`** when that domain exists in the manifest.
- In **`getWorkflowBriefConfig`** (see below), domains whose id compares equal to **`"general"`** (case-insensitive) are **not** treated as the “structured” domain for brief-config loading; the **first** other domain in the normalized list fills that role.
- In **`app.js`**, **`getSelectedWorkflowDomains`** **currently** ensures **`general`** is present in the array returned for Workflow Factory state and **at most one** additional domain id (see Factory state below).

**As implemented**, **`general`** is both a **normal manifest domain** and a **special case** in multiple code paths (not only “listed in alwaysOnDomains”). This note records that fact only; it does **not** speculate on later changes.

---

## `getWorkflowBriefConfig` — first structured domain

**File:** `workflowGenerationContext.js`  
**Function:** `getWorkflowBriefConfig(options)`  
**Exported** on `window.WorkflowGenerationContext.getWorkflowBriefConfig`.

**As implemented:**

1. Calls **`loadManifest()`** then **`normalizeSelectedDomains(opts.selectedDomains, manifest)`**.
2. Finds the **first** domain id in that normalized array for which **`String(id).toLowerCase() !== "general"`**. That id is treated as the **structured** domain id for this call.
3. If no such id exists, returns **`{ domainId: "", config: null }`**.
4. Otherwise resolves that domain’s **`files`** list from the manifest, picks the first path whose name matches the **`/step-patterns/i`** test, reads that file via **`readTextFile`**, and extracts **`workflowBriefConfig`** via **`extractWorkflowBriefConfigFromText`**. On read/parse failure, **`config`** may be **`null`** while **`domainId`** is still the structured id.

**Currently**, there is **no** merge of brief configuration from multiple structured domains; only the **first** non-`general` domain in the normalized list drives this path.

---

## Workflow Factory domain state — `["general"]` or `["general", oneExtra]`

**File:** `app.js`  
**Function:** `getSelectedWorkflowDomains`

**As implemented:**

- If `state.workflowSelectedDomains` is not an array, the function returns **`["general"]`**.
- Otherwise it builds an array that **always** includes **`"general"`** once (inserting it if missing, or normalising to include it first).
- It then finds the **first** entry in `state.workflowSelectedDomains` that is not **`"general"`** and, if present, appends **that single** id as the only extra entry.

So the Factory-facing selection state **currently** collapses to **`["general"]`** or **`["general", exactlyOneOtherId]`**, even though the manifest may list more than two domains and **`normalizeSelectedDomains`** can yield longer lists in other code paths.

**Related:** **`handleWorkflowDomainSelectionChange`** in `app.js` sets `state.workflowSelectedDomains` to **`["general"]`** or **`["general", selectedValue]`** when the Factory domain `<select>` changes, and calls **`persistSelectedDomains`** on `WorkflowGenerationContext` when available.

---

## `renderWorkflowDomainSelector` — manual General row and `alwaysOn` skip

**File:** `app.js`  
**Function:** `renderWorkflowDomainSelector(options)`

**As implemented:**

- Clears **`#wfDesignDomainSelect`** (`els.wfDesignDomainSelect`).
- If **`opts.domains`** is empty: appends a single option with **`value`** **`"general"`** and label text **`"General"`**, and sets the select value to **`"general"`**.
- If there are domains: appends a **`general`** option **manually** (same value/label pattern), then iterates **`opts.domains`**. For each entry with an **`id`**, if **`domain.alwaysOn`** is true, the entry is **skipped** in the loop. Non–always-on entries become `<option>` elements using **`domain.id`** and **`domain.label || domain.id`**.
- Finally, the selected value is set from **`getSelectedWorkflowDomains()`** (preferring the non-`general` extra if still a valid option; otherwise **`"general"`**).

So **`general`** appears as an explicit row built in code, while manifest rows with **`alwaysOn: true`** (which **currently** includes **`general`** from **`getDomainOptions`**) are **not** duplicated from the iterated list.

---

## `getDomainOptions`

**File:** `workflowGenerationContext.js`  
**Function:** `getDomainOptions`

**As implemented:** returns a promise of an array of `{ id, label, alwaysOn }` built from **`Object.keys(manifest.domains)`**, with **`alwaysOn`** true when the id is listed in **`manifest.alwaysOnDomains`**.

**`app.js` — `initWorkflowDomainSelector`:** when `WorkflowGenerationContext.getDomainOptions` exists, it is called and the result is passed to **`renderWorkflowDomainSelector({ domains: domains })`**. On failure or if `getDomainOptions` is missing, **`fallbackDomains`** is used instead (see below).

---

## `fallbackDomains`

**File:** `app.js`  
**Location:** inside **`initWorkflowDomainSelector`** (local array)

**As implemented:** a static array of three rows — **`general`** (with **`alwaysOn: true`**), **`learning-design`**, and **`research`** — with labels matching the **v1** manifest. It is passed to **`renderWorkflowDomainSelector`** when **`getDomainOptions`** is unavailable or its promise rejects.

This is a **second** source of domain rows for the Factory `<select>` alongside **`getDomainOptions`**, intended to match the **v1** manifest **currently**; it is **not** read from the JSON file at runtime.

---

## Explicitly deferred / out of scope for this document

The following are **not** specified here and are **not** implied to be in scope for Sprint 13 documentation-only work beyond this file:

- **S13-01** implementation (Factory domain row de-duplication or code changes).
- **S13-02** default domain product rules.
- **S13-03** display-only hint neutralisation or Learning Design–specific **`app.js`** hint branches.
- Starting artefact allowlists, title-based domain injection, `getGeneralFallbackBriefConfig`, multi-domain brief merge, semantic prompt changes, persistence/import/export behaviour, broad **`app.js`** refactors, or cache/fallback observability.
- Any claim that **full drop-in domain-pack portability** is complete or scheduled.

Additional **Learning Design–specific** behaviour remains in **`app.js`** elsewhere; it is **not** catalogued in this note unless separately chartered.

---

## Review log

- **2026-05-13** — Initial v1 descriptive consolidation note added (documentation only; no code or domain-pack changes).
