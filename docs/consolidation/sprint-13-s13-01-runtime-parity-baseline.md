# S13-01 — Runtime-observed parity baseline: Workflow Factory `#wfDesignDomainSelect`

## Purpose

This document records **observed runtime behaviour** of the Workflow Factory **domain** dropdown (`#wfDesignDomainSelect`, accessibility name **“Workflow design domain”**) **as captured in one session**, for comparison against any later S13-01 strict-parity work.

**This is baseline evidence only.** It is **not** implementation approval, **not** a charter sign-off, and **does not** change product policy.

**Out of scope for this capture:** hints beyond what the browser exposed incidentally, prompts, persistence/import/export, `getWorkflowBriefConfig` semantics, S13-02/S13-03, Sprint 12 A–E, and any code or domain-pack edits. **No production files were modified** to produce this report; observation used a **local** HTTP URL in an automated browser session.

**Related static baseline:** `docs/consolidation/sprint-13-s13-01-factory-domain-select-parity-evidence-matrix.md` (code-derived).

---

## Capture environment

| Field | Value |
|--------|--------|
| **URL** | `http://localhost/prism/index.html` |
| **Tab** | **Create Workflow** (Workflow Factory) selected |
| **Date** | **2026-05-13** (runtime session) |
| **`state.workflowSelectedDomains`** | **Not read from the runtime** (no in-page inspection API used); **post-selection arrays** below are **inferred from `app.js`** behaviour of **`handleWorkflowDomainSelectionChange`** for the observed `value` changes, not read from live `state`. |

---

## Scenario A — WGC present + `getDomainOptions` success

**Reachability:** **Yes** — normal load with `workflowGenerationContext.js` and successful manifest fetch (localhost serving repo).

**Functions involved (init path, as implemented in source):** `initWorkflowDomainSelector` → `WorkflowGenerationContext.getDomainOptions` → `renderWorkflowDomainSelector` → `getSelectedWorkflowDomains`; on user change, **`handleWorkflowDomainSelectionChange`**.

### 1. Ordered dropdown options `(value, visible label)`

Observed **exactly three** options, in this order:

| Order | value | visible label |
|-------|--------|----------------|
| 1 | `general` | General |
| 2 | `learning-design` | Learning Design |
| 3 | `research` | Research |

### 2. Initially selected option

**Observed:** `General` (value **`general`**) immediately after page load with Factory tab context.

### 3. Behaviour after selecting each non-general option

| User action | Observed domain combobox value after action |
|-------------|---------------------------------------------|
| Select **Learning Design** | `Learning Design` |
| Select **Research** | `Research` |

### 4. Resulting `state.workflowSelectedDomains`

**Not observed in runtime.** **Inferred from source** for the same UI actions: **`["general", "learning-design"]`** then **`["general", "research"]`** respectively (`handleWorkflowDomainSelectionChange` in `app.js`).

### 5. Whether `onchange` is attached

**Not verified in runtime** (no DOM property inspection performed). **Inferred:** populated `domains` path in **`renderWorkflowDomainSelector`** assigns **`onchange`** to **`handleWorkflowDomainSelectionChange`** (`app.js`).

### 6. Reset / fallback behaviour observed

None on initial load beyond the **default** selection showing **General**.

### 7. Console warnings / errors (session)

Only a **host-environment** message was present:  
`[CursorBrowser] Native dialog overrides installed - dialogs are now non-blocking`  
**No** application errors or warnings attributable to domain init were captured in this session.

### 8. Adjacent runtime observations (not part of strict dropdown list parity)

When the domain value changed, **other** Factory controls **visibly** updated (e.g. **Starting point (optional)** option sets differed between selections observed in this session). That behaviour is **outside** the narrow **ordered option list** for `#wfDesignDomainSelect` but confirms **downstream** `renderWorkflowFactoryDomainUiConfig` / related paths ran. **Not** used here to assert parity of the domain list itself.

---

## Scenario B — WGC present + `getDomainOptions` rejection

**Status:** **Not reproduced** in this session.

**Reason:** Safely forcing **`getDomainOptions`** to reject **without** temporary instrumentation, blocked network, or modified scripts was **out of scope** for this capture (would risk changing runtime or using non-production tricks).

**Expected baseline (code-derived only):** same ordered options as Scenario A via **`fallbackDomains`** inside **`initWorkflowDomainSelector`** (`app.js`).

---

## Scenario C — WGC absent fallback path

**Status:** **Not reproduced** in this session.

**Reason:** Would require loading the app **without** `WorkflowGenerationContext` / **`getDomainOptions`** (e.g. omitting `workflowGenerationContext.js`), which **breaks** normal product loading and was **not** attempted to avoid accidental non-production behaviour.

**Expected baseline (code-derived only):** same as Scenario B — **`renderWorkflowDomainSelector({ domains: fallbackDomains })`**.

---

## Differences vs code-derived parity matrix

| Topic | Matrix (static) | Runtime (this document) |
|--------|-----------------|-------------------------|
| **Option order and labels** | Matches | **Matches** Scenario A observations |
| **`state.workflowSelectedDomains`** | Stated explicitly | **Not** read live; **inferred** only |
| **`onchange` attached** | Stated for non-empty path | **Inferred** only |
| **Scenario B / C** | Described as code paths | **Not** executed here |
| **Empty `domains` path** | Marked likely unreachable | **Not** tested |
| **Adjacent UI** | Out of matrix scope | **Observed** side effects (Starting point / hints) confirming downstream refresh; **not** a discrepancy for dropdown **value/label** list |

---

## Environment-specific notes

- Behaviour is tied to **`http://localhost/prism/`** and the **current** `domains/domain-manifest.json` on disk at capture time.
- **Cursor** browser automation injected a **non-application** console warning only.

---

## Confirmation

- **No** repository files (`app.js`, `workflowGenerationContext.js`, domain packs, tests, docs other than this file) were **edited** for this runtime session.
- **No** persistence/import/export, prompt, or orchestration **code** changes were made.
- **Sprint 12** A–E was **not** reopened.

---

## Explicit limitation

This file is **baseline evidence only** for later comparison. It **does not** approve S13-01 implementation, merge, or any portability milestone.

---

## Review log

- **2026-05-13** — Runtime baseline captured for Scenario A at localhost; Scenarios B/C not safely reproduced in-session; consolidation note added (no code changes).
