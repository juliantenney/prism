# S78-T-035 — Legacy renderer retirement and vNext parity diagnostic

**Task:** S78-T-035  
**Status:** **DIAGNOSTIC COMPLETE** (2026-08-25)  
**Mode:** Diagnostic / design only — **no production changes in this task**  
**Depends on:** [S78-T-033](S78-T-033-literal-tex-learner-rendering-diagnostic.md) · [S78-T-034](S78-T-034-vnext-math-delimiter-protection-implementation.md)  
**Sprint 78:** OPEN · **T-013:** remains OPEN · **T-019:** not started  

---

## 1. Intended renderer architecture

| Layer | Intended owner (current) |
| ----- | ------------------------ |
| **Learner page HTML** | `lib/learner-renderer-vnext/*` → `renderLearnerPageHtml` / browser bundle `PRISM_LEARNER_RENDERER_VNEXT` |
| **Authoring page export routing** | `app.js` `runUtilityPageExportPipeline` → **always** `runLearnerRendererVNextExport` (S74A-D02 / S74A-T-045) |
| **Export shell post-processing** | `app.js` — standalone document, journey nav/header, MathJax bootstrap, learner ZIP, content viewer |
| **Non-page artefacts** | `app.js` `buildUtilityStructuredHtml` via `runUtilityRendererByPlan` (e.g. **`slide_deck`**) |
| **Shared markdown/math utilities** | **Split** — legacy helpers remain in `app.js`; vNext owns `render-html-utils.js`; T-034 added `lib/math-delimiter-markdown-protection.js` as candidate canonical math protect/restore |

Authoritative statements: [S74A-D02](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/decisions.md#s74a-d02--vnext-replaces-the-obsolete-learner-renderer) · [learner-renderer-vnext.md](../../../architecture/learner-renderer-vnext.md) · [S74A-T-050](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/S74A-T-050-sole-renderer-final-verification.md).

There is **one** learner-page renderer in production. Remaining “legacy” code in `app.js` is **not** a second page renderer; it is shared structured-HTML infrastructure, export orchestration, and **unretired residue** from the pre-vNext page path.

---

## 2. Migration history

| When | Event |
| ---- | ----- |
| **2026-07-16** | Sprint 66 **S66-D10** — build isolated **learner-renderer-vNext** (JSON → model → HTML). Model layer in Sprint 66; HTML/CSS deferred to Sprint 67. |
| **2026-07-17** | Sprint 67 — vNext HTML completion; feature-flag period while vNext matured. |
| **2026-08-06** | Sprint 74 **S74-D07** — one definitive codebase; obsolete paths to be removed when covered. |
| **2026-08-06** | Sprint 74A **S74A-D02** — **vNext is the sole learner-renderer architecture**; remove obsolete renderer after inventory; remove user-facing renderer selection; unconditional page routing. |
| **2026-08-06** | **S74A-T-040** — removal inventory (design only). |
| **2026-08-06** | **S74A-T-045** — removed renderer selector, Legacy page pipeline branch, page registry variant, Legacy parity tests; **`buildUtilityStructuredHtml` rejects `artifact_type: page`**. |
| **2026-08-06** | **S74A-T-050** — production-browser sole-renderer verification; removed final journey-compass / dead page-only structured-HTML residue. |
| **2026-08-25** | **S78-T-033/T-034** — discovered vNext markdown lacked math-delimiter protection present in legacy `utilityRenderMarkdown*`; restored via shared module + vNext live-path tests. |

**Full legacy retirement was explicitly planned** (S74A-D02) and **declared complete for the learner-page choice and routing** (T-045/T-050). **Shared helper extraction and dead-code deletion** were explicitly **deferred** (T-040 INV-IM-05 retain; T-045 §11 dead helpers “optional later delete”).

**Fallback/rollback:** No durable Legacy preference existed. Mid-session selector removed. `rendererVersion: "legacy"` in tests is **ignored** — output remains vNext ([learner-renderer-vnext-feature-flag.test.js](../../../tests/learner-renderer-vnext-feature-flag.test.js)).

**Behavioural parity acceptance:** T-030 production-browser baseline §8; T-050 matrix; Sprint 68 certification corpus — not line-by-line parity with obsolete structured page HTML.

---

## 3. Current legacy runtime reachability

### Learner **page** renderer (obsolete path)

| Reachability | Verdict |
| ------------ | ------- |
| **Live production (Authoring Preview / HTML / ZIP / Open)** | **Not reachable** — `runUtilityPageExportPipeline` always calls `runLearnerRendererVNextExport` (~53065–53119). |
| **Feature-flag / fallback** | **Not reachable** — `#utilitiesRendererVersion` removed; `normalizeRendererVersion("legacy")` throws ([render-learner-page.js](../../../lib/learner-renderer-vnext/render-learner-page.js)). |
| **`buildUtilityStructuredHtml` for pages** | **Hard reject** at entry (~50397–50401). |
| **`runUtilityRendererByPlan` for pages** | **Not used** for Authoring page export after T-045. |
| **Development/debug** | No supported operator path to render pages via structured HTML. |
| **Test-only** | `utilityRenderMarkdownBlockForTest` / `utilityRenderPageSectionsForTest` exercise **markdown helpers**, not the obsolete page assembly path. `buildUtilityStructuredHtmlForTest` is a **misnamed wrapper** that calls `runUtilityPageExportPipeline` → **vNext** (~54911–54921). |

### What **is** still reachable in `app.js`

| Symbol / path | Production use | Classification |
| ------------- | -------------- | -------------- |
| `utilityRenderMarkdownBlock` / `Inline` | **slide_deck** / structured non-page HTML; unit tests | **Live shared utility** (not learner-page renderer) |
| `utilityProtectSupportedMathDelimiters` (inline in `app.js`) | Same as above | **Live duplicate** of T-034 shared module semantics |
| `buildUtilityStructuredHtml` | **slide_deck**, generic_document, generic_assessment registry | **Live non-page** |
| `utilityEnhanceExportHtmlWithMathJax` / preview MathJax | Wraps **vNext export** HTML on download/preview/ZIP (~52533, ~53502, ~52344) | **Live export post-process** |
| `composeStandaloneVnextLearnerExport` | vNext export shell | **Live vNext orchestration** |
| `utilityRenderPageSections` and large page-shaped structured-HTML blocks inside `app.js` | After page reject at `buildUtilityStructuredHtml` entry | **Dead / test-only residue** (T-045/T-050 noted optional cleanup) |
| Journey-compass / obsolete page header helpers | Removed from page export (T-050) | **Dead** (grep: no live apply path) |

**Concrete call sites (page export):**

```text
handleUtilitiesGenerate / Preview
  → renderUtilitiesArtefactHtmlWithResolvedPlan (page branch)
    → runUtilityPageExportPipeline
      → runLearnerRendererVNextExport
        → PRISM_LEARNER_RENDERER_VNEXT.renderLearnerPageHtml
      → composeStandaloneVnextLearnerExport
  → applyUtilityPreviewHtml → utilityBuildPreviewHtmlWithMathJax (when math delimiters present)
```

---

## 4. Why legacy remains

The **obsolete learner page renderer** (structured HTML page assembly + selector + fallback) **does not remain**. Sprint 74A removed it.

What remains is **three distinct categories** that are easy to misread as “the legacy renderer”:

1. **Shared structured-HTML / markdown utilities** retained for **non-page** artefacts and historical test hooks (T-040 INV-IM-05 — intentional).
2. **Authoring export orchestration** (standalone shell, MathJax, ZIP, workflow resource injection) that **wraps vNext output** — not an alternate page renderer.
3. **Unfinished hygiene** — dead page-only branches and **duplicated** markdown/math logic between `app.js` and vNext (T-045 §11, §14; T-033/T-034 evidence).

T-034 did **not** re-couple vNext to legacy `app.js`; it introduced `lib/math-delimiter-markdown-protection.js` as the **candidate canonical** utility. Legacy still embeds its own copy (~37600–37657).

---

## 5. Behavioural parity inventory

Compact inventory of **learner-visible** behaviours. “Legacy” = pre-vNext `utilityRenderMarkdown*` / structured page path unless noted.

| Behaviour / invariant | Legacy | vNext | vNext regression test | Status |
| --------------------- | ------ | ----- | ----------------------- | ------ |
| Math delimiter protection (`\(...\)`, `\[...\]`) | yes (`app.js`) | yes (T-034 + shared module) | yes ([learner-renderer-vnext-math-markdown.test.js](../../../tests/learner-renderer-vnext-math-markdown.test.js)) | **parity confirmed** (restored) |
| MathJax typesetting in Preview/export | yes (export wrapper) | yes (same `app.js` wrapper on vNext HTML) | partial — [mathjax-delimiter-preservation.test.js](../../../tests/mathjax-delimiter-preservation.test.js) targets **legacy markdown helpers**, not live vNext path | **parity confirmed** (orchestration shared); **test gap** on vNext+MathJax E2E |
| Markdown bold/italic/links/code | yes | yes | partial (emphasis outside maths in T-034 suite) | **parity confirmed** (core) |
| Markdown pipe tables | yes | yes | partial — table workspace tests, not all prose tables | **parity confirmed** (basic) |
| Single-line pipe table normalisation | yes (`normalizeMarkdownTableText`) | no | no | **uncertain** — may affect rare compressed tables in materials |
| Inline `•` bullet runs in prose | yes (`renderParagraphWithInlineBullets`) | no (stays in `<p>`) | legacy only ([utility-markdown-bullet.test.js](../../../tests/utility-markdown-bullet.test.js)) | **missing or intentionally changed** — needs product call; legacy tests still assert old behaviour |
| Hyphen-intro multi-item lists (`Intro - a - b`) | yes | no | legacy only | **uncertain / likely missing** |
| Worksheet blank tokens `___` → styled blank | yes (`@@PRISMBLANK`) | no in vNext markdown | legacy only ([utility-learner-workshop-material-visibility.test.js](../../../tests/utility-learner-workshop-material-visibility.test.js)) | **uncertain** — vNext uses workspace/table surfaces for blanks; prose `___` may differ |
| Markdown `#`–`######` → native h1–h6 | yes (structured path) | all map to **h3** + source-depth class | yes ([learner-renderer-vnext-heading-contract.test.js](../../../tests/learner-renderer-vnext-heading-contract.test.js)) | **intentionally changed** in vNext |
| Page heading contract (h1–h3 only) | n/a (obsolete page chrome) | yes | yes (heading-contract + export-shell) | **vNext-only** |
| Material-type rendering (20+ types) | obsolete page sections | yes (`render-material.js`, composition) | yes (certification corpus, field-coverage, golden tests) | **parity superseded** — vNext owns richer model |
| Learner workspaces (text/table/ordering/assessment/checklist) | limited / obsolete | yes | yes (draft persistence, table-workspace, assessment tests) | **vNext-only** (by design post–S68) |
| Activity/task interleaving (T-042) | obsolete | yes | yes (compose-full-page, browser registration) | **vNext-only** |
| Journey sequential nav + sticky header | compass (removed) | vNext sequential nav | yes (export-shell, sequential-nav tests) | **intentionally changed** |
| Duration / page meta in header | partial | yes (`utilityBuildVnextLearningHeaderIntro`) | partial (export-shell) | **parity confirmed** |
| HTML escape / token sanitisation | yes | yes (`escapeHtml`) | indirect | **parity confirmed** (pattern-level) |
| Facilitator material suppression | yes (structured render opts) | vNext workshop policies differ | partial | **uncertain** — not traced as live page gap |
| Visual affordances / icons | shared CSS + structured | vNext icon registry | yes (icons, visual-affordances tests) | **vNext authoritative** |
| `slide_deck` structured HTML | yes | not vNext | non-page tests | **obsolete path retained by design** (non-page) |

---

## 6. Missing / uncertain vNext behaviours

| Item | Assessment |
| ---- | ---------- |
| **Inline `•` bullet runs** | Legacy converts to `<ul>`; vNext leaves literal bullets in `<p>`. If GAM still emits Research-style inline bullet runs in prose, this is a **potential missing behaviour**. No vNext live-path test. |
| **Hyphen-separated inline lists** | Legacy-only paragraph logic. **Uncertain** prevalence in current GAM output. |
| **Worksheet `___` blanks in markdown prose** | Legacy renders `util-worksheet-blank`; vNext has no equivalent in `render-html-utils.js`. May be **obsolete** if all blanks are table/workspace-native — **uncertain** without artefact survey. |
| **Single-line markdown table normalisation** | Legacy-only. **Uncertain** impact on learner materials. |
| **MathJax + vNext combined regression** | MathJax applied in `app.js` after vNext HTML; T-034 tests delimiter preservation in vNext HTML but **not** full preview typeset path. |
| **Legacy markdown helpers vs vNext drift** | T-033/T-034 proved duplication risk. Future markdown fixes could land in one copy only until consolidation. |

No evidence that **required learner-page rendering** still depends on calling the obsolete structured page assembler.

---

## 7. Test-coverage gaps

| Area | What exists | Gap |
| ---- | ----------- | --- |
| **Page export** | Many suites via `renderLearnerPageForTest` / misnamed `buildUtilityStructuredHtmlForTest` → vNext | Good live-path coverage for shell, nav, composition |
| **Markdown/math** | [mathjax-delimiter-preservation.test.js](../../../tests/mathjax-delimiter-preservation.test.js) → **`utilityRenderMarkdownBlockForTest` (legacy helpers)** | Does **not** prove vNext path; T-034 added vNext-specific suite only for math subscripts |
| **Inline bullets / blanks** | [utility-markdown-bullet.test.js](../../../tests/utility-markdown-bullet.test.js), workshop visibility tests → legacy helpers | **No vNext equivalent** |
| **Certification** | [certify-learner-renderer-vnext.js](../../../scripts/certify-learner-renderer-vnext.js) + IMP-020 tests | Corpus-based; may not include every legacy markdown edge |
| **Legacy parity tests** | Removed T-045 (TE-01–TE-07) | Correct — should not return |

**Highlight:** Post–T-045, tests named “structured HTML” for **pages** often still pass while exercising **vNext**, but **markdown edge-case tests** overwhelmingly target **legacy helpers in `app.js`**, giving a false sense that vNext inherits those behaviours automatically.

---

## 8. Retirement decision

**Decision: B — The obsolete learner page renderer is retired for production; retirement of legacy *machinery* is unfinished.**

| Option | Verdict |
| ------ | ------- |
| **A. Legacy renderer still legitimately required** | **Rejected** for learner **pages**. No production route renders pages via structured HTML or Legacy selector. |
| **B. Obsolete but retirement unfinished** | **Accepted.** Page renderer removed; shared markdown duplication, dead page branches, and legacy-targeted tests remain. |
| **C. Migration incomplete — required behaviour stranded in legacy** | **Partially true historically (T-033 math protection); not true as a blocking state after T-034.** Remaining gaps are **edge markdown behaviours** and **test/orchestration split**, not the core page assembly path. |

**Do not delete legacy markdown code in this task.** Prerequisites for a future cleanup task:

1. Inventory which legacy markdown behaviours (bullets, blanks, table normalisation) still appear in **live GAM/material bodies** on vNext export.
2. For each retained behaviour: either implement in vNext **or** document as intentionally dropped.
3. Point legacy `utilityProtectSupportedMathDelimiters` at `lib/math-delimiter-markdown-protection.js` **or** delete legacy copy when slide_deck migrates / consolidates.
4. Remove dead page-only structured-HTML functions after grep-proof no test imports.
5. Add vNext live-path regressions for any behaviour kept.
6. Rename `buildUtilityStructuredHtmlForTest` → page-export test helper (T-040 INV-API-03).

**Legacy should eventually consume the shared math module before deletion of the duplicate in `app.js`**, or delete both together when structured HTML no longer needs inline markdown with math. vNext must **not** depend on `app.js` for maths protection (T-034 already satisfies this).

---

## 9. Recommended follow-on work

| ID | Task (proposed) | Scope |
| -- | --------------- | ----- |
| **S78-T-036** (proposed) | Legacy markdown residue & parity closure audit | Artefact survey for • bullets / `___` / compressed tables; vNext live-path tests or explicit “dropped” decisions |
| **S78-T-037** (proposed) | Consolidate math-delimiter protection | Wire `app.js` `utilityProtectSupportedMathDelimiters` to `lib/math-delimiter-markdown-protection.js`; delete duplicate |
| **S78-T-038** (proposed) | Dead structured-HTML page branch deletion | Grep-proof removal of unreachable page-only helpers in `app.js` (T-045/T-050 residue) |
| **Optional** | vNext + MathJax preview regression | Extend T-034 pattern through `utilityEnhanceExportHtmlWithMathJaxForTest` on `renderLearnerPageForTest` output |

Not authorised in Sprint 78 unless separately opened. **Do not** block T-013 closure on full `app.js` slimming.

---

## 10. Files inspected

| File / record | Role |
| ------------- | ---- |
| [S74A-D02](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/decisions.md) | Sole vNext decision |
| [S74A-T-040](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/S74A-T-040-obsolete-renderer-responsibility-removal-inventory.md) | Removal inventory |
| [S74A-T-045](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/S74A-T-045-obsolete-learner-renderer-removal.md) | Removal execution |
| [S74A-T-050](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/S74A-T-050-sole-renderer-final-verification.md) | Production verification |
| [S66-D10](../2026-07-16-sprint-66-grounded-renderer-learner-experience/decisions.md) | vNext origin |
| [learner-renderer-vnext.md](../../../architecture/learner-renderer-vnext.md) | Architecture SSOT |
| `app.js` | Routing, structured HTML, markdown helpers, MathJax, export shell |
| `lib/learner-renderer-vnext/render-learner-page.js` | Sole renderer API |
| `lib/learner-renderer-vnext/render-html-utils.js` | vNext markdown |
| `lib/math-delimiter-markdown-protection.js` | T-034 shared module |
| [S78-T-033](S78-T-033-literal-tex-learner-rendering-diagnostic.md) · [S78-T-034](S78-T-034-vnext-math-delimiter-protection-implementation.md) | Math parity incident |
| Test suites cited above | Coverage mapping |

---

## 11. Files changed (this task)

| File | Change |
| ---- | ------ |
| `S78-T-035-legacy-renderer-retirement-vnext-parity-diagnostic.md` | **Added** — this record |
| `STATUS.md`, `PLAN.md`, `HANDOVER.md`, `next-chat-briefing.md`, `SPRINT-78-START-HERE.md` | Minimal sprint navigation |

**Production / test code:** **unchanged**

---

## 12. Sprint 78 state after T-035

| Item | Status |
| ---- | ------ |
| Sprint 78 | **OPEN** |
| T-013 | **OPEN** |
| T-035 | **Diagnostic complete** |
| T-034 | Complete |
| T-019 | Queued — not started |
| Next | Fresh Lagrangian regen/benchmark + visual maths check; optional follow-on parity/residue tasks above |
