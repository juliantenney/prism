# Sprint 13 — first-pass closure

**Date:** 2026-05-13  
**Status:** Closure note for the **bounded first-pass** items that were in scope for documentation (S13-07) and the **narrow** Factory domain `<select>` implementation slice (S13-01). This document **does not** charter further work or claim umbrella Sprint 13 program approval beyond what is stated below.

---

## Delivered: S13-07 (documentation)

**S13-07** is recorded as **delivered** as the v1 descriptive consolidation note:

- **`docs/consolidation/sprint-13-general-alwayson-first-structured-domain-behaviour.md`** — General, `alwaysOnDomains`, `normalizeSelectedDomains`, first structured domain for `getWorkflowBriefConfig`, Factory `getSelectedWorkflowDomains` / `renderWorkflowDomainSelector` context, manifest vs embedded fallback (read-only reference; no policy change asserted by that doc).

---

## Delivered: S13-01 (narrow implementation)

**S13-01** is recorded as **delivered narrowly**: **parity-preserving de-duplication** for Workflow Factory **`#wfDesignDomainSelect`** only — centralised v1 fallback domain rows and a single helper for appending the **General** `<option>`, without changing selection semantics, `onchange` wiring, or `handleWorkflowDomainSelectionChange`.

**Production code touched:** **`app.js`** only.

### Exact changed / added symbols

| Symbol | Role |
|--------|------|
| **`getWorkflowFactoryDomainSelectFallbackDomains`** | New — returns the same three fallback rows previously inlined in **`initWorkflowDomainSelector`**. |
| **`appendWorkflowFactoryDomainGeneralOption`** | New — appends **`(general, General)`** to the Factory domain `<select>`. |
| **`renderWorkflowDomainSelector`** | Updated — uses **`appendWorkflowFactoryDomainGeneralOption`** on empty and non-empty branches; loop, **`selectedExtra`**, coercion, and **`onchange`** assignment unchanged. |
| **`initWorkflowDomainSelector`** | Updated — **`fallbackDomains`** from **`getWorkflowFactoryDomainSelectFallbackDomains()`**; async branches unchanged. |

**Explicitly not modified for S13-01:** `workflowGenerationContext.js`, domain packs, prompts / `briefLines` / model payloads, persistence / import / export, **`renderWorkflowFactoryDomainUiHints`**, **`handleWorkflowDomainSelectionChange`**, Sprint 12 artefacts and tests.

---

## Verification summary

1. **`git diff` scope:** Only **`app.js`** changed (+helpers, **`renderWorkflowDomainSelector`**, **`initWorkflowDomainSelector`**). No other tracked files in the working tree for this slice.
2. **Excluded areas:** Confirmed no edits to **`workflowGenerationContext.js`**, domain packs, Prompt Studio surfaces, persistence/import/export modules, **`renderWorkflowFactoryDomainUiHints`**, **`handleWorkflowDomainSelectionChange`**, or **`docs/consolidation/sprint-12-*.md`** / Sprint 12 test packs for this change.
3. **Row A (runtime):** On **`http://localhost/prism/index.html`**, **Create Workflow**, after reload: **Workflow design domain** shows **General**, **Learning Design**, **Research** in that order; initial value **General**; selecting **learning-design** then **research** updates the combobox to **Learning Design** then **Research** (browser snapshot, 2026-05-13).
4. **Rows B / C / D (code parity vs matrix):** **`getWorkflowFactoryDomainSelectFallbackDomains()`** returns the same object shapes and order as the former **`fallbackDomains`** literal; **`appendWorkflowFactoryDomainGeneralOption`** matches prior inline **General** option construction. Empty **`domains`** branch still appends one General option, sets value **`general`**, returns **without** setting **`onchange`** — equivalent to **`sprint-13-s13-01-factory-domain-select-parity-evidence-matrix.md`** rows B, C, and D.
5. **Tests:** From repo root, **`node --test tests/*.test.js`** — **16** tests, **16** passed, **0** failed (2026-05-13).

---

## Sprint 13 first-pass consolidation artefact inventory

All **`docs/consolidation/sprint-13-*.md`** files introduced for this first pass (add with **`app.js`** for the release commit):

| File | Role |
|------|------|
| **`docs/consolidation/sprint-13-first-pass-closure.md`** | This closure note. |
| **`docs/consolidation/sprint-13-general-alwayson-first-structured-domain-behaviour.md`** | S13-07 — v1 reference (General, `alwaysOnDomains`, first structured domain, Factory context). |
| **`docs/consolidation/sprint-13-s13-01-factory-domain-select-parity-evidence-matrix.md`** | S13-01 — code-derived parity matrix for `#wfDesignDomainSelect`. |
| **`docs/consolidation/sprint-13-s13-01-runtime-parity-baseline.md`** | S13-01 — runtime baseline (Scenario A + B/C/D notes). |
| **`docs/consolidation/sprint-13-s13-01-factory-domain-select-runtime-baseline.md`** | S13-01 — canonical runtime baseline (aligned capture; same Scenario A intent). |
| **`docs/consolidation/sprint-13-s13-01-implementation-review-packet.md`** | S13-01 — bounded pre-implementation review packet. |

---

## Explicit deferred (not delivered in this first pass)

Aligned with the candidate charter / prep guardrails; **not** implied as approved next work:

- **S13-02** — default domain rule (decision-gated).
- **S13-03** — display-only hint neutralisation (decision-gated; proof of non–prompt-facing scope required if ever taken).
- Semantic prompt migration; **`briefLines`** / extraction changes; multi-domain brief merge; **`getGeneralFallbackBriefConfig`** relocation.
- Starting artefact relocation; Learning Design starting-point trio relocation; title-based domain injection replacement.
- Broad **`app.js`** refactor; persistence/import/export migration; fallback/cache/`manifestPromise`/`textCache` work; domain-pack schema redesign unless separately chartered.

---

## Sprint 12

**Sprint 12** first-pass structural observability (**A–E**) remains **closed** and was **not** modified or reopened for this first pass (`docs/consolidation/sprint-12-first-pass-structural-observability-closure.md`).

---

## S13-02 / S13-03

**S13-02** and **S13-03** were **not** entered; no implementation or documentation closure for those items is recorded here.

---

## Portability claim

**Full drop-in domain-pack portability** is **not** claimed. This first pass delivered **documentation (S13-07)** and a **single-control, strict-parity-preserving** **`app.js`** tidy for **`#wfDesignDomainSelect`** (S13-01) only.

---

## Review log

- **2026-05-13** — First-pass closure note added: S13-07 + narrow S13-01 recorded; verification summarised; deferred list and boundaries stated.
- **2026-05-13** — Release-readiness: full **`docs/consolidation/sprint-13-*.md`** inventory added; test command recorded as **`node --test tests/*.test.js`** (16 passed).
