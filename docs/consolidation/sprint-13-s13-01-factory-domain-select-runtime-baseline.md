# S13-01 — Factory domain select: runtime parity baseline

## 1. Purpose and scope

This consolidation note records **observed runtime behaviour** of the Workflow Factory **domain** dropdown **`#wfDesignDomainSelect`** (accessibility name **“Workflow design domain”**) for **S13-01** parity baselining.

**In scope:** Scenario **A** only — normal page load at **`http://localhost/prism/index.html`** with **Create Workflow** selected, and observed option list / selection after two user-driven changes on that control.

**Out of scope:** S13-02 and S13-03; Sprint 12 first-pass structural observability (A–E); prompts; persistence/import/export; `getWorkflowBriefConfig` semantics beyond what is needed to name init/change handlers; any code or domain-pack edits. **No fixes or implementation steps** are recorded here.

**Related artefact (code-derived):** `docs/consolidation/sprint-13-s13-01-factory-domain-select-parity-evidence-matrix.md`

---

## 2. Scenario A — observed runtime behaviour

**Capture environment**

| Field | Value |
|--------|--------|
| **URL** | `http://localhost/prism/index.html` |
| **Panel** | **Create Workflow** (Workflow Factory) |
| **Date** | **2026-05-13** |
| **Means** | Automated browser session (read-only observation) |

**Ordered dropdown options `(value, visible label)` — observed**

| Order | value | visible label |
|-------|--------|----------------|
| 1 | `general` | General |
| 2 | `learning-design` | Learning Design |
| 3 | `research` | Research |

**Initially selected option — observed:** **General** (`value` **`general`**) after load with Factory in context.

**After selecting each non-general option — observed (domain combobox only)**

| Action | Observed combobox value |
|--------|-------------------------|
| Select **Learning Design** | **Learning Design** |
| Select **Research** | **Research** |

**`state.workflowSelectedDomains`:** not read from the live page in this session. **Not** asserted from runtime.

**`onchange`:** not verified from the live DOM in this session. **Not** asserted from runtime.

**Reset / fallback on init — observed:** none beyond the initial **General** selection.

**Other UI:** other Factory controls changed when the domain value changed; that is **outside** the strict **domain dropdown option list** scope of this baseline.

---

## 3. Scenario B — status: not safely reproduced

**Scenario:** WGC present + **`getDomainOptions`** rejection (promise reject → **`catch`** path in `initWorkflowDomainSelector`).

**Status:** **Not reproduced** in this baseline session.

**Reason:** Reproducing rejection **safely** in the evidence-only lane would require runtime or repository manipulation (e.g. blocking manifest fetch, temporary instrumentation, or script stubs) that was **not** used here.

---

## 4. Scenario C — status: not safely reproduced

**Scenario:** WGC absent (early branch in **`initWorkflowDomainSelector`** when **`WorkflowGenerationContext`** or **`getDomainOptions`** is missing).

**Status:** **Not reproduced** in this baseline session.

**Reason:** Reproduction would require loading the app **without** the normal **`workflowGenerationContext.js`** integration, which is **not** a safe default product load for an evidence-only capture and was **not** attempted.

---

## 5. Comparison with the code-derived parity matrix

| Topic | Parity matrix (static) | This runtime baseline |
|--------|--------------------------|-------------------------|
| **Scenario A option order and labels** | As documented from source | **Matches** observations |
| **Scenario A initial selection** | `general` | **Matches** |
| **Scenario B / C** | Code paths described | **Not** run in browser here |
| **`state.workflowSelectedDomains`** | Described from source | **Not** read in runtime |
| **`onchange`** | Described from source | **Not** verified in runtime |
| **Empty `domains` path** | Documented as unlikely from call graph | **Not** exercised |

---

## 6. Console warnings / errors observed

Only the following **non-application** message was observed in the capture session:

`[CursorBrowser] Native dialog overrides installed - dialogs are now non-blocking`

**No** PRISM application errors or warnings tied to domain dropdown init were observed in that session.

---

## 7. Confirmation — no production behaviour changed

**Repository:** no edits were made to **`app.js`**, **`workflowGenerationContext.js`**, domain packs, tests, or other production assets **for** this baseline capture.

**This document** is a consolidation addition only. **Sprint 12** first-pass A–E was **not** reopened.

---

## 8. Explicit statement

**This file is baseline evidence only.** It is **not** implementation approval, merge authorisation, or a charter sign-off for S13-01 or any other work.

---

## 9. Review log

- **2026-05-13** — Initial runtime capture (Scenario A) at `http://localhost/prism/index.html`; Scenarios B/C not safely reproduced.
- **2026-05-13** — Finalised as canonical S13-01 runtime parity baseline at `docs/consolidation/sprint-13-s13-01-factory-domain-select-runtime-baseline.md`.
