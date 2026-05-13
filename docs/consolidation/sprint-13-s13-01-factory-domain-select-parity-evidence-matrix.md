# S13-01 — Parity evidence matrix (read-only): Workflow Factory `#wfDesignDomainSelect`

## Purpose

This document captures the **current behavioural baseline** for **`#wfDesignDomainSelect`** (Workflow Factory domain `<select>`) **before** any strict-parity **S13-01** implementation approval. It is **read-only** evidence: **no** fixes, **no** implementation steps, **no** changes to hints, prompts, persistence, **`getWorkflowBriefConfig`**, S13-02/S13-03, or Sprint 12.

**Functions in scope for this matrix:** `initWorkflowDomainSelector`, `renderWorkflowDomainSelector`, `getSelectedWorkflowDomains`, `handleWorkflowDomainSelectionChange` (`app.js`); `getDomainOptions` (`workflowGenerationContext.js`). **`fallbackDomains`** is the literal array inside `initWorkflowDomainSelector` (`app.js`).

**Assumptions (v1 repository default):**

- `domains/domain-manifest.json` lists **`general`**, **`learning-design`**, **`research`** with labels **General**, **Learning Design**, **Research**, and **`alwaysOnDomains`** includes **`general`**.
- `getDomainOptions` returns one row per `Object.keys(manifest.domains)` in **current JSON key order** in that file: **`general`**, then **`learning-design`**, then **`research`**.
- `els.wfDesignDomainSelect` exists when these functions run (otherwise `renderWorkflowDomainSelector` returns early).

**Unknowns (not resolved here):**

- Whether **`getDomainOptions`** can ever fulfill with **`[]`** given **`normalizeManifest`** always merging fallback domain keys into `manifest.domains` when keys are missing (see `workflowGenerationContext.js` **`normalizeManifest`**).
- Behaviour if **`manifest.domains`** or labels differ from the v1 default file (not enumerated).
- Full runtime conditions for **`getDomainOptions`** rejection (network failure vs JSON throw vs other) — matrix rows describe **code path** only.

---

## Matrix (states → observable baseline)

Legend: **ordered options** = top-to-bottom `<option>` elements as **`(value, label)`**. **Selected after init** = value of `#wfDesignDomainSelect` immediately after **`initWorkflowDomainSelector`** completes the branch in question (for async success, after the promise callback runs). **`state.workflowSelectedDomains`** refers to **`app.js`** `state.workflowSelectedDomains`.

### Row A — WGC present + `getDomainOptions` success

| Field | Baseline (as implemented) |
|--------|---------------------------|
| **Reachable in production** | **Yes** — when `window.WorkflowGenerationContext` exists and **`getDomainOptions`** promise fulfills. |
| **Entry path** | **`initWorkflowDomainSelector`** → **`WorkflowGenerationContext.getDomainOptions()`** `.then` → **`renderWorkflowDomainSelector({ domains: domains })`**. |
| **Ordered option list** | **`(general, General)`**, **`(learning-design, Learning Design)`**, **`(research, Research)`** — manual **`general`** row first; then non–`alwaysOn` rows from **`domains`** in iteration order ( **`getDomainOptions`** skips **`alwaysOn`** entries in the loop; **`general`** row is skipped as `alwaysOn: true` in the array but re-added manually). |
| **Selected after init** | **`general`** — **`initWorkflowDomainSelector`** sets **`state.workflowSelectedDomains = ["general"]`** before render; **`getSelectedWorkflowDomains`** returns **`["general"]`**; **`selectedExtra`** is **`"general"`**. |
| **After user selects `learning-design`** | **`handleWorkflowDomainSelectionChange`**: **`state.workflowSelectedDomains`** → **`["general", "learning-design"]`**; select shows **`learning-design`**. |
| **After user selects `research`** (from prior `learning-design`) | **`state.workflowSelectedDomains`** → **`["general", "research"]`**; select shows **`research`**. |
| **Fallback / reset during init** | None beyond explicit **`["general"]`** reset at start of **`initWorkflowDomainSelector`**. |

### Row B — WGC present + `getDomainOptions` rejection

| Field | Baseline (as implemented) |
|--------|---------------------------|
| **Reachable in production** | **Yes** — when **`getDomainOptions()`** promise **rejects** (any reason); **`catch`** runs. |
| **Entry path** | **`initWorkflowDomainSelector`** → **`getDomainOptions()`** `.catch` → **`renderWorkflowDomainSelector({ domains: fallbackDomains })`**. |
| **Ordered option list** | Same as Row A: **`(general, General)`**, **`(learning-design, Learning Design)`**, **`(research, Research)`** — from **`fallbackDomains`** literal (same ids/labels/`alwaysOn` flags as v1 manifest for these three). |
| **Selected after init** | **`general`** — same reset and **`selectedExtra`** logic as Row A. |
| **After selecting each non-general option** | Same as Row A via **`handleWorkflowDomainSelectionChange`**. |
| **Resulting `state.workflowSelectedDomains`** | Same as Row A for each selection. |
| **Fallback / reset** | **`fallbackDomains`** is the **`catch`** path payload; initial state still forced to **`["general"]`** before the async call. |

### Row C — WGC absent

| Field | Baseline (as implemented) |
|--------|---------------------------|
| **Reachable in production** | **Unusual** — requires **`window.WorkflowGenerationContext`** missing **or** **`getDomainOptions`** not a function (e.g. script load order / test harness). Not the normal browser app path when `workflowGenerationContext.js` is loaded. |
| **Entry path** | **`initWorkflowDomainSelector`** first branch → **`renderWorkflowDomainSelector({ domains: fallbackDomains })`**. |
| **Ordered option list** | Identical to Row B: **`fallbackDomains`**. |
| **Selected after init** | **`general`**. |
| **After selecting each non-general option** | Same as Row A. |
| **Resulting `state.workflowSelectedDomains`** | Same as Row A. |
| **Fallback / reset** | **`fallbackDomains`** used synchronously; state reset to **`["general"]`** at init start. |

### Row D — Empty `domains` array passed to `renderWorkflowDomainSelector`

| Field | Baseline (as implemented) |
|--------|---------------------------|
| **Reachable in production** | **Not observed from current call graph** — **`renderWorkflowDomainSelector`** is only invoked from **`initWorkflowDomainSelector`** with either **`fallbackDomains`** (length 3) or **`getDomainOptions`** fulfillment (non-empty keys under v1 **`normalizeManifest`**). |
| **Entry path (hypothetical)** | Direct call **`renderWorkflowDomainSelector({ domains: [] })`** — **no** such call site **`app.js`** **currently**. |
| **Ordered option list** | **Single** option **`(general, General)`** — early branch **`if (!domains.length)`**. |
| **Selected after init** | **`general`** — branch sets **`els.wfDesignDomainSelect.value = "general"`** and returns (no **`onchange`** binding in that branch before return — **`onchange`** is only set on the non-empty path at end of function). |
| **After user selects non-general** | **N/A** — no non-general options in list. |
| **`state.workflowSelectedDomains`** | Whatever it was before call; **`renderWorkflowDomainSelector`** does **not** assign **`state.workflowSelectedDomains`**; **`init`** still sets **`["general"]`** before any render in normal flow. |
| **Fallback / reset** | **`selectedExtra`** logic skipped for empty list return path; **`getSelectedWorkflowDomains`** still drives prior state unless elsewhere updated. |

---

## `selectedExtra` / selection semantics (cross-row)

**Where computed:** **`renderWorkflowDomainSelector`** (`app.js`).

**Rules (as implemented):**

1. **`selected`** = **`getSelectedWorkflowDomains()`**.
2. **`selectedExtra`** = first entry in **`selected`** that is not **`"general"`**, else **`"general"`**.
3. If no `<option>` exists for **`selectedExtra`** value, **`selectedExtra`** is coerced to **`"general"`** (`querySelector` check).
4. **`els.wfDesignDomainSelect.value`** is set to **`selectedExtra`**.
5. **`onchange`** is set to **`handleWorkflowDomainSelectionChange`** on the **non-empty `domains`** path only (not on the **empty `domains`** early return).

**`handleWorkflowDomainSelectionChange` (as implemented):** reads **`els.wfDesignDomainSelect.value`**, builds **`next`** as **`["general"]`** or **`["general", selectedValue]`** if **`selectedValue !== "general"`**, assigns **`state.workflowSelectedDomains`**, optionally **`persistSelectedDomains`**, then clears hints/extras and calls **`renderWorkflowFactoryDomainUiConfig(next)`** (out of matrix scope for options list parity).

---

## Risks if parity-related changes are made later (descriptive only)

- **Option `value` / label drift** vs **`selectedExtra`** reset → silent fallback to **`general`**.
- **Order change** between **`Object.keys(manifest.domains)`** and **`fallbackDomains`** literal → visible order difference between Row A and Row B/C.
- **Duplicate or missing `general`** row if **`alwaysOn`** loop and manual row logic diverge.
- **Empty-list branch** without **`onchange`** → different handler attachment vs populated list (behavioural edge if empty path becomes reachable).
- **Re-init** calling **`initWorkflowDomainSelector`** again resets **`state.workflowSelectedDomains`** to **`["general"]`** — user’s prior non-general selection is cleared on that code path (documented as current init behaviour).

---

## Explicit exclusions (this matrix does not evidence)

- **`renderWorkflowFactoryDomainUiHints`** / Learning Design branches (S13-03 / portability).
- **Prompts**, **`briefLines`**, model payloads.
- **Persistence / import / export** beyond noting **`persistSelectedDomains`** exists on change.
- **`getWorkflowBriefConfig`** semantics beyond what is needed to understand that this matrix is **only** the Factory `<select>`.
- **S13-02** default domain policy.
- **Sprint 12** tests or closure edits.

---

## Review log

- **2026-05-13** — Read-only parity evidence matrix drafted from `app.js` / `workflowGenerationContext.js` behaviour (no code changes).
